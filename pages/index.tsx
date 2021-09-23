// Framework
import { useEffect, useState } from 'react';
import { GetStaticProps } from 'next';
// Firebase
import { DocumentData, DocumentReference, doc, getDoc, collectionGroup, query, orderBy, limit, getDocs} from 'firebase/firestore';
// Local Code
import { auth, firestore } from '../lib/Firebase';
import ChallengeElement from '../component/Helpers/ChallengeElement';
import Logo from '../component/Graphics/Logo';
import { onAuthStateChanged } from 'firebase/auth';

const HomePage = ({challengeData, challengeIds, gameIds } : {challengeData: string, challengeIds: string, gameIds: string}): JSX.Element => {
	const challenge = JSON.parse(challengeData);
	const challengeId = JSON.parse(challengeIds);
	const gameId = JSON.parse(gameIds);
	
	const [userDatabase, setUserDatabase] = useState<DocumentData | null>(null);
	const [userReference, setUserReference] = useState<DocumentReference>();
	useEffect(() => {
		onAuthStateChanged(auth, (auth) => {
			if (auth) setUserReference(doc(firestore, 'users', auth.uid));
		});
	}, []);
	const [loadedUser, setLoadedUser] = useState(true);
	useEffect(() => {
		if (!loadedUser || !userReference) return;
		setLoadedUser(false);
		getDoc(userReference).then((doc) => setUserDatabase(doc.data()));
	}, [userReference]);

	return (
		<>
			<div className = 'MainPanel'>
				<div className = 'Box'>
					<h2>What is RTL Challenges?</h2>
					<p>RTL Challenges is an ecosystem of user-submitted challenges for your favorite video games. <a tabIndex={-1} className='HoverUnderline' href='/games'>Pick a video game of your choice</a>, and have a challenge be randomly selected for you.</p>
					<div className={'Menu'}>
						<a rel='nofollow' className='InnerBox Button' href='/discord' style={{display: 'flex', flexDirection: 'row', marginTop: '0em'}}>
							<h3 style={{marginRight: '0.5em', marginLeft: '-0.1em'}}>Our Discord</h3>
							<div>
								<Logo size='3em' colorObject={{colorPrimary1: 5860075, colorPrimary2: 4934650, colorSecondary1: 16119290, colorSecondary2: 12763890}} />
							</div>
						</a>
					</div>
				</div>
				{challenge !== undefined && challenge.length > 0 && 
				<div className = 'Box'>
					<h2>Top Challenges - <span style={{fontSize: '0.7em'}}>All Time</span></h2>
					{challenge.map((ele: DocumentData, i: number) => (
						<ChallengeElement key={i} document={ele} user={userDatabase} reference={doc(firestore, 'games', gameId[i], 'challenges', challengeId[i])} />
					))}
				</div>}
			</div>
		</>
	);
};

export const getStaticProps: GetStaticProps = async ()  => {
	const challengeCollection = collectionGroup(firestore, 'challenges');
	const challengeReference = query(challengeCollection, orderBy('likes', 'desc'), limit(8));
	const challengeDatabase = await getDocs(challengeReference);
	return {
		props: {challengeData: JSON.stringify(challengeDatabase.docs.map(ele => ele.data())), challengeIds: JSON.stringify(challengeDatabase.docs.map(ele => ele.ref.id)), gameIds: JSON.stringify(challengeDatabase.docs.map(ele => ele.ref.parent.parent.id))},
		revalidate: 21600,
	};
};

export default HomePage;