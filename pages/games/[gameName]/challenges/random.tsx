// Framework
import { useEffect } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
// Firebase
import { collection, doc, getDoc, getDocs, increment, limit, orderBy, query, updateDoc } from 'firebase/firestore';
// Local Code
import ChallengeLarge from '../../../../component/Helpers/ChallengeLarge';
import { firestore } from '../../../../lib/Firebase';

const Challenge = ({challenge, author, gameName, challengeId}: {challenge: string, author: string, gameName: string, challengeId: string}): JSX.Element => {

	const challengeData = challenge ? JSON.parse(challenge) : null;
	const authorData = author ? JSON.parse(author) : null;

	useEffect(() => {
		if (!challengeData) return;
		updateDoc(doc(firestore, 'games', gameName, 'challenges', challengeId), {seed: increment(incrementSeed(challengeData.likes, challengeData.dislikes)), changeSeed: true});
	}, []);

	const LocalHeader = (): JSX.Element => {
		const title = 'A Random Challenge for ' + gameName + ' - RTL Challenges';
		const description = 'Play a random challenge for ' + gameName + '. Roll again for a different challenge.';
		return (
			<Head>
				<title>{gameName} Random Challenges - RTL Challenges</title>
				<meta name='description' content={description} />
				<meta property='og:title' content={title} />
				<meta property='og:description' content={description} />
				<meta name='twitter:title' content={title} />
				<meta name='twitter:description' content={description} />
			</Head>
		);
	};

	return (
		<>
			<LocalHeader />
			<div className='MainPanel'>
				<ChallengeLarge authorData={authorData} challengeData={challengeData} gameName={gameName} challengeId={challengeId} random={true} />
			</div>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = async ({params})  => {
	const gameName = decodeURI(typeof params?.gameName === 'string' ? decodeURI(params.gameName) : '');

	const gameReference = doc(firestore, 'games', gameName);
	const gameDatabase = getDoc(gameReference);
	const challengeDatabase = getDocs(query(collection(firestore, 'games', gameName, 'challenges'), orderBy('seed', 'asc'), limit(1)));

	const [gameData, challengeData] = await Promise.all([gameDatabase, challengeDatabase]);
  
	if (challengeData.empty) return {
		props: {game: JSON.stringify(gameData.data()), gameName: gameName},
		notFound: !gameData.exists,
	};

	const authorData = await getDoc(challengeData.docs[0].data().author);

	return {
		props: {game: JSON.stringify(gameData.data()), challenge: JSON.stringify(challengeData.docs[0].data()), author: JSON.stringify(authorData.data()), gameName: gameName, challengeId: challengeData.docs[0].id},
		notFound: !gameData.exists,
	};
};

export default Challenge;

const incrementSeed = (likes: number, dislikes: number): number => {
	const experience = likes + dislikes;
	const difference = likes - dislikes;
	const differenceSeed = experience>=0 ? (1.02**-experience)*0.1+0.9 : Math.log2(-experience+1)-Math.log2(1)+1;
	const experienceSeed = -(100**0.05)+(difference+100)**0.05;
	return differenceSeed + experienceSeed;
};