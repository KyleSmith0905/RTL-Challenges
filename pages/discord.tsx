// Framework
import { GetServerSideProps } from 'next';
import Head from 'next/head';

const Discord = (): JSX.Element => {
	const LocalHeader = (): JSX.Element => {
		const title = 'The Community Discord - RTL Challenges';
		const description = 'RTL Challenges\' community discord. Discuss with others about the website, suggestions, or challenges.';
		return (
			<Head>
				<title>Community Discord - RTL Challenges</title>
				<meta name='description' content={description} />
				<meta property='og:title' content={title} />
				<meta property='og:description' content={description} />
				<meta name='twitter:title' content={title} />
				<meta name='twitter:description' content={description} />
			</Head>
		);
	};

	return (
		<LocalHeader />
	);
};

export const getServerSideProps: GetServerSideProps = async ()  => {
	return {
		redirect: {
			destination: 'https://discord.gg/fZkPnR6Er4',
			permanent: true,
		},
	};
};

export default Discord;