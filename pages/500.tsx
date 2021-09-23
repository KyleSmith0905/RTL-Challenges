// Framework
import Head from 'next/head';

const Page500 = (): JSX.Element => {
	return (
		<>
			<Head>
				<title>500 Server-Side Error - RTL Challenges</title>
			</Head>
			<div className='MainPanel'>
				<div className='Box'>
					<h2>500: Server-Side Error</h2>
					<p>Our server had an error while navigating to this page. You could try another page, or refresh your current page.</p>
					<div className='Menu'>
						<a rel='nofollow' className='Button' href='/'>
							<h3>Home Page</h3>
						</a>
						<a rel='nofollow' className='Button' href=''>
							<h3>Refresh Page</h3>
						</a>
					</div>
				</div>
			</div>
		</>
	);
};

export default Page500;