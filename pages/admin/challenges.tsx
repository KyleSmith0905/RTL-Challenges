// FrameWork
import { useEffect, useState } from 'react';
import Head from 'next/head';
// Firebase
import { collectionGroup, doc, DocumentData, DocumentSnapshot, getDoc, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
// Local Code
import ChallengeLarge from '../../component/Helpers/ChallengeLarge';
import NoPermissions from '../../component/NoPermissions';
import NoSignedIn from '../../component/NoSignedIn';
import { auth, firestore } from '../../lib/Firebase';

const ModerateChallengesPage = (): JSX.Element => {  
	const [user, setUser] = useState(auth?.currentUser);
	const [loading, setLoading] = useState(true);
	onAuthStateChanged(auth, doc => {
		if (doc) setUser(doc);
		else setLoading(false);
	});
	const userDocReference = user?.uid ? doc(firestore, 'users', user.uid) : null;
	const [userDatabase, setUserDatabase] = useState<DocumentSnapshot>(null);
	const [initialize, setInitialize] = useState(false);
	const [challengeData, setChallengeData] = useState<DocumentData[]>();
	const [challengeGameName, setChallengeGameName] = useState<string[]>();
	const [challengeId, setChallengeId] = useState<string[]>();
	useEffect(() => {
		if (initialize || !userDocReference) return;
		setInitialize(true);
		getDoc(userDocReference).then(userDoc => {
			getDocs(query(collectionGroup(firestore, 'challenges'), orderBy('createdAt', 'desc'), limit(12))).then((challengeDoc) => {
				setChallengeData(challengeDoc.docs.map(doc => doc.data()));
				setChallengeGameName(challengeDoc.docs.map(doc => doc.ref.parent.parent.id));
				setChallengeId(challengeDoc.docs.map(doc => doc.id));
			});
			setUserDatabase(userDoc);
		})
			.finally(() => setLoading(false));
	}, [userDocReference]);
  
	console.log(challengeId, challengeGameName, challengeData);

	const LocalHeader = (): JSX.Element => {
		const title = 'Site Admin Panel For Managing Challenges - RTL Challenges';
		const description = 'RTL Challenges admin site panel to moderate the content of the site. This is a tool to moderate challenges.';
		return (
			<Head>
				<meta name='robots' content='noindex' />
				<title>Site Admin Panel For Challenges - RTL Challenges</title>
				<meta name='description' content={description} />
				<meta property='og:title' content={title} />
				<meta property='og:description' content={description} />
				<meta name='twitter:title' content={title} />
				<meta name='twitter:description' content={description} />
			</Head>
		);
	};
  
	if (loading) return <LocalHeader />;
	else if (!auth?.currentUser || !userDatabase) return (
		<>
			<LocalHeader />
			<NoSignedIn auth={auth} userDatabase={userDatabase} />
		</>
	);
	else if (!userDatabase.data().adminLevel || userDatabase.data().adminLevel < 1) return (
		<>
			<LocalHeader />
			<NoPermissions theirAdminLevel={userDatabase.data().adminLevel ?? '0'} requiredAdminLevel={'1'} />
		</>
	);
	return (
		<>
			<LocalHeader />
			<div className='MainPanel'>
				<div className='Box'>
					<h2>Moderate Challenges</h2>
					<p>Report challenges for breaking challenge rules. Enough reports will get the user banned.</p>
					<table style={{backgroundColor: 'var(--color-secondary)'}}>
						<tbody>
							<tr>
								<td>10</td>
								<td>Harmful Content</td>
								<td>The user had a malicious intent towards other users, whether to scam, hack, phish, or other extremely bad content.</td>
							</tr>
							<tr>
								<td>6</td>
								<td>Malicious Content</td>
								<td>The user had a malicious intent towards us, whether to intentionally spam, insult us, or other malicious content where we are the victim.</td>
							</tr>
							<tr>
								<td>5</td>
								<td>Advertising</td>
								<td>The user posted a challenge with an intent to advertise their website, social media, and others.</td>
							</tr>
							<tr>
								<td>3</td>
								<td>Irrelevant Game</td>
								<td>The user posted a challenge that does not seem to be relevant to the game it was made for.</td>
							</tr>
							<tr>
								<td>2</td>
								<td>Spam</td>
								<td>The user posted something with little useful content. This might be because he did not check before uploading it.</td>
							</tr>
							<tr>
								<td>1</td>
								<td>Low-Quality Content</td>
								<td>The user posted something low-quality, such as an extremely uninteresting challenge and unreadable grammar.</td>
							</tr>
						</tbody>
					</table>
				</div>
				{challengeData && challengeGameName && challengeId && challengeData.map((challenge: DocumentData, i: number) => (
					<ChallengeLarge key={i} challengeData={challenge} gameName={challengeGameName[i]} challengeId={challengeId[i]} userDatabase={userDatabase} />
				))}
			</div>
		</>
	);
};

export default ModerateChallengesPage;