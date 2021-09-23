// Framework
import Head from 'next/head';

const Error = ({statusCode}: {statusCode: string}): JSX.Element => {
	return (
		<>
			<Head>
				<title>{statusCode} Error - RTL Challenges</title>
			</Head>
			<div className='MainPanel'>
				<div className='Box'>
					<h2>{statusCode}: An Unknown Error Occurs</h2>
					<p>
						An error occurred. Search for the error code online {statusCode} for more information.
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

Error.getInitialProps = ({ res, err }) => {
	const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
	return { statusCode };
};


export default Error;