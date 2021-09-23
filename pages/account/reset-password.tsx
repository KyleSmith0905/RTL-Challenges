// Framework
import { useState } from 'react';
import Head from 'next/head';
// Firebase
import { sendPasswordResetEmail } from 'firebase/auth';
// Local Code
import InputField from '../../component/Helpers/InputField';
import { auth } from '../../lib/Firebase';

const ResetPassword = (): JSX.Element => {
	const [email, setEmail] = useState('');
	const [errors, setErrors] = useState('');

	const LocalHeader = (): JSX.Element => {
		const title = 'Reset Your Account Password - RTL Challenges';
		const description = 'Reset your password for RTL Challenges. If you forget your password this is always a viable option if your email is still viable.';
		return (
			<Head>
				<title>Reset Password - RTL Challenges</title>
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
				<div className='Box'>
					<h2>Reset Password</h2>
					<p>Enter your email address below and we will send you a link to reset your password.</p>
					{errors !== '' && <p>{errors}</p>}
					<div className='Form'>
						<InputField name='Email' defaultValue = 'example@email.com' censored={false} value={[email, setEmail]} />
					</div>
					<button
						onClick={() => {
							sendPasswordResetEmail(auth, email)
								.then(() => setErrors('We sent an email to ' + email +'. Look for an email by .'))
								.catch(err => setErrors(err.message || 'Unknown error.'));
						}}
					>
						<h3>Send Email</h3>
					</button>
				</div>
			</div>
		</>
	);
};

export default ResetPassword;