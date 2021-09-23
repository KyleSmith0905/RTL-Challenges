// Framework
import { useEffect, useState } from 'react';
import Head from 'next/head';
// Firebase
import { User } from 'firebase/auth';
import { doc, DocumentSnapshot, getDoc, updateDoc } from 'firebase/firestore';
// Local Code
import { setColors } from '../../lib/ThemeControl';
import { auth, firestore } from '../../lib/Firebase';
import { createUserDatabase, getCookie, colorStringToNumber, accountInterface, colorNumberToString} from '../../lib/Helpers';
import Logo from '../../component/Graphics/Logo';
import NoSignedIn from '../../component/NoSignedIn';

const Account = (): JSX.Element => {
	const [user, setUser] = useState<User | undefined>(auth?.currentUser ?? undefined);
	auth.onAuthStateChanged(doc => {
		if (doc) setUser(doc);
		else setLoading(false);
	});
	const userDocReference = user?.uid ? doc(firestore, 'users', user.uid) : null;
	const [userDatabase, setUserDatabase] = useState<DocumentSnapshot>();
	const [updatedUserData, setUpdatedUserData] = useState<accountInterface | undefined>(undefined);
	const userData = updatedUserData === undefined ? userDatabase?.data() :  updatedUserData;
	const [initialize, setInitialize] = useState(false);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		if (initialize || !userDocReference || !user) return;
		setInitialize(true);
		getDoc(userDocReference).then(doc => {
			if (!doc.exists) {
				createUserDatabase(user).then(() => window.location.reload());
				return;
			}
			setUserDatabase(doc);
			setLoading(false);
			setColorPrimary1(colorNumberToString(doc.data()?.profilePicture.colorPrimary1) ?? '#1a66ff');
			setColorPrimary2(colorNumberToString(doc.data()?.profilePicture.colorPrimary2) ?? '#2ec6e5');
			setColorSecondary1(colorNumberToString(doc.data()?.profilePicture.colorSecondary1) ?? '#0166ff');
			setColorSecondary2(colorNumberToString(doc.data()?.profilePicture.colorSecondary2) ?? '#0010c7');
			setUsername(doc.data()?.username ?? doc.id.substring(0, 16));
		})
			.catch(() => {
				if (auth.currentUser) createUserDatabase(auth.currentUser);
				setLoading(false);
			});
	}, [initialize, userDocReference, setUserDatabase, setLoading]);
	const [colorMode, setColorMode] = useState('dark');
	useEffect (() => {
		setColorMode(getCookie('colorMode') ?? 'dark');
	});
	const [editIcon, setEditIcon] = useState(false);
	const [colorPrimary1, setColorPrimary1] = useState('#1a66ff');
	const [colorPrimary2, setColorPrimary2] = useState('#2ec6e5');
	const [colorSecondary1, setColorSecondary1] = useState('#0166ff');
	const [colorSecondary2, setColorSecondary2] = useState('#0010c7');
	const [username, setUsername] = useState('');
	const [errorMessage, setErrorMessage] = useState('');

	const LocalHeader = (): JSX.Element => {
		const title = 'Account Management and Various Settings - RTL Challenges';
		const description = 'Change visual settings, signin or signup to an account, and customize your account with RTL Challenges.';
		return (
			<Head>
				<title>Account and Settings - RTL Challenges</title>
				<meta name='description' content={description} />
				<meta property='og:title' content={title} />
				<meta property='og:description' content={description} />
				<meta name='twitter:title' content={title} />
				<meta name='twitter:description' content={description} />
			</Head>
		);
	};

	if (loading && !userData) return <LocalHeader />;
	return (
		<>
			<LocalHeader />
			<div className='MainPanel'>
				{auth && userData && userDatabase && auth.currentUser?.emailVerified ? (
					<div className='Box'>
						<h2>Signed In</h2>
						<p>You are signed in as {userData.username ?? userDatabase?.id?.substring(0,16)}</p>
					</div>
				) : (
					<NoSignedIn auth={auth} userDatabase={userDatabase} accountPage={true} setUserDatabase={setUserDatabase} />
				)
				}
				<div className='Box'>
					<h2>View Options</h2>
					<button
						className='Button'
						onClick={() => {
							const newColor = colorMode === 'light' ? 'dark' : 'light';
							setColorMode(newColor);
							setColors(newColor);
							const todayDate = new Date();
							const futureDate = new Date(todayDate.getTime() + (1000 * 60 * 60 * 24 * 30));
							window.document.cookie = 'colorMode=' + newColor + '; path=/; expires=' + futureDate.toUTCString();
						}}
					>
						<h3>Switch Themes</h3>
					</button>
				</div>
				{auth && userData && userDatabase && auth.currentUser?.emailVerified && 
					<div className='Box'>
						<h2>Account Options</h2>
						{errorMessage && <p>{errorMessage}</p>}
						<div className='InputGroup'>
							<p>Profile Picture</p>
							<div style={{margin: '-0.65em 0em 0.5em 2.5em'}}>
								<Logo size='3em' colorObject={userData.profilePicture} />
							</div>
							<button onClick={() => setEditIcon(!editIcon)}><h3>Open Picture Editor</h3></button>
						</div>
						{editIcon && 
						<>
							<div style={{margin: '1em auto 0em auto', display:'flex', justifyContent: 'center'}}>
								<Logo size='6em' colorObject={{
									colorPrimary1: colorStringToNumber(colorPrimary1),
									colorPrimary2: colorStringToNumber(colorPrimary2),
									colorSecondary1: colorStringToNumber(colorSecondary1),
									colorSecondary2: colorStringToNumber(colorSecondary2)
								}} />
							</div>
							<div className='Form'>
								<div className='InputGroup'>
									<p>Primary 1</p>
									<input
										type='color'
										value={colorPrimary1}
										style={{width: '6.5em', height: '2.5em'}}
										onChange={(e) => setColorPrimary1(e.currentTarget.value)}
									/>
								</div>
								<div className='InputGroup'>
									<p>Primary 2</p>
									<input
										type='color'
										value={colorPrimary2}
										style={{width: '6.5em', height: '2.5em'}}
										onChange={(e) => setColorPrimary2(e.currentTarget.value)}
									/>
								</div>
								<div className='InputGroup'>
									<p>Secondary 1</p>
									<input
										type='color'
										value={colorSecondary1}
										style={{width: '6.5em', height: '2.5em'}}
										onChange={(e) => setColorSecondary1(e.currentTarget.value)}
									/>
								</div>
								<div className='InputGroup'>
									<p>Secondary 2</p>
									<input
										type='color'
										value={colorSecondary2}
										style={{width: '6.5em', height: '2.5em'}}
										onChange={(e) => setColorSecondary2(e.currentTarget.value)}
									/>
								</div>
							</div>
						</>}
						<div className='InputGroup'>
							<p>Username</p>
							<input
								value={username}
								placeholder={'xXExampleXx'}
								onChange={(e) => setUsername(e.target.value)}
							/>
						</div>
						<div className='Menu' style={{marginTop: '1em'}}>
							<button onClick={() => {
								setErrorMessage('');
								const profilePictureChanged = userData.colorPrimary1 !== colorPrimary1 || userData.colorPrimary2 !== colorPrimary2 || userData.colorSecondary1 !== colorSecondary1 || userData. colorSecondary2 !== colorSecondary2;
								const changes = {};
								if (profilePictureChanged) {
									changes['profilePicture.colorPrimary1'] = colorStringToNumber(colorPrimary1),
									changes['profilePicture.colorPrimary2'] = colorStringToNumber(colorPrimary2),
									changes['profilePicture.colorSecondary1'] = colorStringToNumber(colorSecondary1),
									changes['profilePicture.colorSecondary2'] = colorStringToNumber(colorSecondary2);
								}
								if (username !== userData.username) {
									let error = '';
									if (username.length < 4) error = 'Username must be at least 4 characters.';
									if (!error && username.length > 16) error = 'Username must be at most 16 characters.';
									if (!error && username.match(/[^a-zA-Z0-9 ]/)) error = 'Username must contain only letters, numbers, and spaces.';
									if (!error && username[0] === ' ') error = 'Username must not start with a space.';
									if (!error && username[-1] === ' ') error = 'Username must not end with a space.';
									if (error) return setErrorMessage(error);
									changes['username'] = username;
								}
								updateDoc(userDatabase.ref, changes).then(() => {
									setUpdatedUserData({...userData, ...changes});
									setUserDatabase(userDatabase);
								})
									.catch(() => setErrorMessage('An error occured with during save.'));
							}}>
								<h3>Save Changes</h3>
							</button>
						</div>
					</div>
				}
			</div>
		</>
	);
};

export default Account;