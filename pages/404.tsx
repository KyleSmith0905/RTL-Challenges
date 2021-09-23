// Framework
import Head from 'next/head';

const Page404 = (): JSX.Element => {
	return (
		<>
			<Head>
				<title>404 Page Not Found - RTL Challenges</title>
			</Head>
			<div className='MainPanel'>
				<div className='Box'>
					<h2>404: Page not found</h2>
					<p>
						This page does not exist. Try navigating around RTL Challenges to find what you are looking for.
					</p>
					<div className='Menu'>
						<a rel='nofollow' className='Button' href='/'>
							<h3>Home Page</h3>
						</a>
					</div>
				</div>
			</div>
		</>
	);
};

export default Page404;