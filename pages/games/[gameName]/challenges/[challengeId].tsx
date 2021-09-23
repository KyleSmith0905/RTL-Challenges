// Framework
import { GetServerSideProps } from 'next';
import Head from 'next/head';
// Firebase
import { doc, getDoc } from 'firebase/firestore';
// Local Code
import ChallengeLarge from '../../../../component/Helpers/ChallengeLarge';
import { firestore } from '../../../../lib/Firebase';

const Challenge = ({challenge, author, gameName, challengeId, authorId}: {challenge: string, author: string, gameName: string, challengeId: string, authorId: string}): JSX.Element => {

	const challengeData = JSON.parse(challenge);
	const authorData = JSON.parse(author);

	const LocalHeader = (): JSX.Element => {
		let title = '';
		let description = '';
		if (challengeData.title) title = challengeData.title + ' - RTL Challenges';
		else title = 'A Challenge for ' + gameName + ' - RTL Challenges';
		if (challengeData.description) description = challengeData.title;
		else description = 'Play a challenge for ' + gameName + '. The challenge ID is ' + challengeId + '.';
		return (
			<Head>
				{challengeData.likes < 16 && challengeData.likes*2 > challengeData.dislikes && <meta name='robots' content='noindex' />}
				<title>{title}</title>
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
				<ChallengeLarge authorData={authorData} challengeData={challengeData} gameName={gameName} challengeId={challengeId} authorId={authorId} />
			</div>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = async ({res, params})  => {
	const gameName = decodeURI(typeof params?.gameName === 'string' ? decodeURI(params.gameName) : '');
	const challengeId = decodeURI(typeof params?.challengeId === 'string' ? decodeURI(params.challengeId) : '');

	const gameReference = doc(firestore, 'games', gameName);
	const gameDatabase = getDoc(gameReference);
	const challengeDatabase = getDoc(doc(firestore, 'games', gameName, 'challenges', challengeId));

	const [gameData, challengeData] = await Promise.all([gameDatabase, challengeDatabase]);
  
	const authorData = await getDoc(challengeData.data()?.author);

	res.setHeader('X-Robots-Tag', 'noindex');
	return {
		props: {game: JSON.stringify(gameData?.data()), challenge: JSON.stringify(challengeData?.data()), author: JSON.stringify(authorData?.data()), gameName: gameName, challengeId: challengeId, authorId: authorData?.id},
		notFound: !challengeData.exists,
	};
};

export default Challenge;