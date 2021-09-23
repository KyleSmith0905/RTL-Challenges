// Framework
import { useEffect, useState } from 'react';
import Head from 'next/head';
// Firebase
import { doc, DocumentData, DocumentReference, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
// Local Code
import { auth, firestore } from '../../lib/Firebase';
import ChallengeElement from '../../component/Helpers/ChallengeElement';
import { includesReference } from '../../lib/Helpers';
import NoSignedIn from '../../component/NoSignedIn';

const Challenges = (): JSX.Element => {
	const [user, setUser] = useState(auth?.currentUser);
	onAuthStateChanged(auth, doc => {
		if (doc) setUser(doc);
		else setLoading(false);
	});
	const userDocReference = user?.uid ? doc(firestore, 'users', user.uid) : null;
	const [likeReferences, setLikeReferences] = useState([]);
	const [dislikeReferences, setDislikeReferences] = useState([]);
	const [userDatabase, setUserDatabase] = useState<DocumentData>();
	const userData = userDatabase?.data();
	const [initialize, setInitialize] = useState(false);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		if (initialize || !userDocReference) return;
		setInitialize(true);
		getDoc(userDocReference).then(doc => {
			setUserDatabase(doc);
			setLikeReferences(doc.data()?.challengeLikes?.filter((ele: DocumentReference) => !includesReference(doc.data()?.challenges, ele)));
			setDislikeReferences(doc.data()?.challengeDislikes?.filter((ele: DocumentReference) => !includesReference(doc.data()?.challenges, ele)));
		})
			.finally(() => setLoading(false));
	}, [userDocReference]);

	const LocalHeader = (): JSX.Element => {
		const title = 'Relevant Challenges to You - RTL Challenges';
		const description = 'Create your own challenges, and view challenges you created, challenges you liked, or challenges you dislikes.';
		return (
			<Head>
				<title>Relevant Challenges to You - RTL Challenges</title>
				<meta name='description' content={description} />
				<meta property='og:title' content={title} />
				<meta property='og:description' content={description} />
				<meta name='twitter:title' content={title} />
				<meta name='twitter:description' content={description} />
			</Head>
		);
	};

	if (loading) return <LocalHeader />;
	else if (!userData || !auth.currentUser?.emailVerified) return (
		<>
			<LocalHeader />
			<NoSignedIn auth={auth} userDatabase={userData} />
		</>
	);
	return (
		<>
			<LocalHeader />
			<div className='MainPanel'>
				<div className='Box'>
					<h2>Challenge Menu</h2>
					<div className='Menu'>
						<a rel='nofollow' className='Button' href='/challenges/select-game'>
							<h3>Create</h3>
						</a>
					</div>
				</div>
				{userData.challenges?.length > 0 && <div className='Box'>
					<h2>Your Challenges</h2>
					{userData.challenges && userData.challenges.map((ele: DocumentReference, i: number) => (
						i < 11 && <ChallengeElement key={i} reference={ele} user={userData} />
					))}
				</div>}
				{likeReferences && likeReferences.length > 0 ?
					<div className='Box'>
						<h2>Liked Challenges</h2>
						{likeReferences && likeReferences.map((ele: DocumentReference, i: number) => (
							i < 3 && <ChallengeElement key={i} reference={ele} user={userData} />
						))}
					</div>
					:
					<div className='Box'>
						<h2>No Liked Challenges</h2>
						<p>Head to the list of games to play challenges, like your favorite challenges by clicking the heart.</p>
						<div className='Menu'>
							<a rel='nofollow' className='Button' href='/games'>
								<h3>Games Page</h3>
							</a>
						</div>
					</div>
				}
				{dislikeReferences && dislikeReferences.length > 0 && <div className='Box'>
					<h2>Disliked Challenges</h2>
					{dislikeReferences && dislikeReferences.map((ele: DocumentReference, i: number) => (
						i < 3 && <ChallengeElement key={i} reference={ele} user={userData} />
					))}
				</div>}
			</div>
		</>
	);
};

export default Challenges;