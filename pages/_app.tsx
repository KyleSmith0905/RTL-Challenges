// Framework
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
// Firebase
import { AppProps } from 'next/dist/shared/lib/router/router';
import { getAnalytics } from 'firebase/analytics';
// Local Code
import TopBar from '../component/TopBar';
import BottomBar from '../component/BottomBar';
import ThemeControl from '../lib/ThemeControl';
// Local Styling
import '../styles/App.css';
import '../styles/Input.css';
import '../styles/Logo.css';
import '../styles/Separator.css';
import '../styles/TopBar.css';

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
	const router = useRouter();
	ThemeControl();

	useEffect(() => {
		if (process.env.NODE_ENV === 'production') {
			getAnalytics();
		}
	}, []);
  

	return (
		<>
			<Head>
				<meta charSet='utf-8' />
				<title>RTL Challenges - Randomized Video Game Challenges</title>
				<meta name='description' content='Select from the largest collection of user-submitted challenges for your favorite video games. Create your own challenges for any game in the world.' />
				<meta name='keywords' content='video game, game challenges, random challenge, video game challenges, challenge, randomized, roulette, random video game challenge' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<meta name='theme-color' content='#1e222f' />
				<link rel='icon' type='image/png' href='/images/favicon.ico' />
				<link rel='apple-touch-icon' href='/images/logo192.png' />
				<link rel='manifest' href='/manifest.json' />
				<meta name='HandheldFriendly' content='True' />
				<link rel='canonical' href={'http://rtlchallenges.com' + router.asPath} />
				{/* Open Graphics */}
				<meta property='og:site_name' content='RTL Challenges' />
				<meta property='og:url' content='https://rtlchallenges.com' />
				<meta property='og:url' content={'http://rtlchallenges.com' + router.asPath} />
				<meta property='og:keywords' content='video game, game challenges, random challenge, video game challenges, challenge, randomized, roulette, rtl, ltr' />
				<meta property='og:locale' content='en-US' />
				<meta property='og:type' content='website' />
				<meta property='og:image:url' content='/images/logo512.png' />
				<meta property='og:image:alt' content='RTL Challenges logo' />
				<meta property='og:image:type' content='image/png' />
				<meta property='og:image:width' content='1024' />
				<meta property='og:image:height' content='1024' />
				<meta property='og:title' content='RTL Challenges - Randomized Video Game Challenges' />
				<meta property='og:description' content='Select from the largest collection of user-submitted challenges for your favorite video games. Create your own challenges for any game in the world.' />
				{/* Twitter */}
				<meta name='twitter:card' content='summary' />
				<meta name='twitter:image' content='/images/logo512.png' />
				<meta name='twitter:image:alt' content='RTL Challenges logo' />
				<meta name='twitter:title' content='RTL Challenges - Randomized Video Game Challenges' />
				<meta name='twitter:description' content='Select from the largest collection of user-submitted challenges for your favorite video games. Create your own challenges for any game in the world.' />
			</Head>
			<div style={{minHeight: 'calc(100vh - 4em)'}}>
				<TopBar />
				<div style={{display: 'flex', justifyContent: 'center'}}>
					<Component { ...pageProps } />
				</div>
			</div>
			<BottomBar />
		</>
	);
};

export default MyApp;