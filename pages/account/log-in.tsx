// Framework
import { useState } from 'react';
import Head from 'next/head';
// Firebase
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
// Local Code
import { auth, firestore } from '../../lib/Firebase';
import { createUserDatabase } from '../../lib/Helpers';
import InputField from '../../component/Helpers/InputField';
import Logo from '../../component/Graphics/Logo';

const Login = (): JSX.Element => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [errors, setErrors] = useState('');

	const LocalHeader = (): JSX.Element => {
		const title = 'Log In To Your Account - RTL Challenges';
		const description = 'Sign into your account with RTL Challenges. Create video game challenges, interact with games and challenges, and personalize your account now.';
		return (
			<Head>
				<title>Account Log In - RTL Challenges</title>
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
					<h2>Login by Email</h2>
					{errors !== '' && <p>{errors}</p>}
					<div className='Form'>
						<InputField name='Email' defaultValue = 'example@email.com' censored={false} value={[email, setEmail]} />
						<InputField name='Password' defaultValue = 'Example$12' censored={true} value={[password, setPassword]} />
					</div>
					<button
						onClick={() => {
							signInWithEmailAndPassword(auth, email, password)
								.then(() => window.location.href = '/account')
								.catch(err => setErrors(err.message || 'Unknown error.'));
						}}
					>
						<h3>Log In</h3>
					</button>
					<p style={{display: 'flex', justifyContent: 'center'}}><a tabIndex={-1} href='/account/reset-password' className='HoverUnderline'>Reset Password</a></p>
				</div>
				<div className='Box'>
					<h2>Social Login</h2>
					<div
						onClick={() => {
							const provider = new GoogleAuthProvider();
							signInWithPopup(auth, provider).then((user) => {
								const userInfo = user.user;
								if (!userInfo) return;
								getDoc(doc(firestore, 'users', user.user?.uid))
									.then(doc => {
										if (!doc.exists) createUserDatabase(userInfo).then(() => window.location.href = '/account');
										else window.location.href = '/account';
									});
							});
						}}
						className='InnerBox Button'
					>
						<h3>Google</h3>
						<div style={{position: 'absolute', alignSelf: 'flex-end', marginLeft: '0.2em'}}>
							<Logo size='3em' colorObject={{colorPrimary1: 25343, colorPrimary2: 45916, colorSecondary1: 16716800, colorSecondary2: 16759808}} />
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Login;