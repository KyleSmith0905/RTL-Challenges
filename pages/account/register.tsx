// Framework
import { useState } from 'react';
import Head from 'next/head';
// Firebase
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, UserCredential } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
// Local Code
import { auth, firestore } from '../../lib/Firebase';
import InputField from '../../component/Helpers/InputField';
import { createUserDatabase } from '../../lib/Helpers';
import Logo from '../../component/Graphics/Logo';

const Register = (): JSX.Element => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [username, setUsername] = useState('');
	const [errors, setErrors] = useState('');

	const LocalHeader = (): JSX.Element => {
		const title = 'Create An Account - RTL Challenges';
		const description = 'Register an account with RTL Challenges. Create video game challenges, interact with games and challenges, and personalize your account now.';
		return (
			<Head>
				<title>Create An Account - RTL Challenges</title>
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
					<h2>Register by Email</h2>
					{errors !== '' && <p>{errors}</p>}
					<div className='Form'>
						<InputField name='Email' defaultValue = 'example@email.com' censored={false} value={[email, setEmail]} />
						<InputField name='Password' defaultValue = 'Example$12' censored={true} value={[password, setPassword]} />
						<InputField name='Username' defaultValue = 'xXExampleXx' censored={false} value={[username, setUsername]} />
					</div>
					<button
						onClick={async () => {
							try {
								if (username !== '') {
									if (username.length < 4) throw 'Username must be at least 4 characters.';
									if (username.length > 16) throw 'Username must be at most 16 characters.';
									if (username.match(/[^a-zA-Z0-9 ]/)) throw 'Username must contain only letters, numbers, and spaces.';
									if (username[0] === ' ') throw 'Username must not start with a space.';
									if (username[-1] === ' ') throw 'Username must not end with a space.';
								}
								let tempError: string;
								const user: UserCredential = await createUserWithEmailAndPassword(auth, email, password).catch(err => tempError = err.message);
								if (tempError || !user.user) throw tempError || 'Invalid credentials.';
								await createUserDatabase(user.user, username)
									.then(() => window.location.href = '/account')
									.catch(err => tempError = err.message);
								if (tempError) throw 'There was a database error, however, your account was still created. Error: ' + tempError;
							}
							catch (err) {
								setErrors(typeof(err) === 'string' ? err : 'Unknown error.');
							}
						}}>
						<h3>Sign Up</h3>
					</button>
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

export default Register;