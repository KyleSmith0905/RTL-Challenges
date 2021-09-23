// Framework
import { useEffect, useState } from 'react';
import GameElement from '../../component/Helpers/GameElement';
import { auth, firestore } from '../../lib/Firebase';
import Logo from '../../component/Graphics/Logo';
import {colorStringToNumber, simplifyText, randomColor, colorNumberToString} from '../../lib/Helpers';
import Head from 'next/head';
import NoSignedIn from '../../component/NoSignedIn';
import { collection, doc, DocumentReference, DocumentSnapshot, getDoc, getDocs, limit, orderBy, query, QuerySnapshot, setDoc, where } from 'firebase/firestore';

interface firebaseGameInterface {
	likes: number;
	picture: {
		colorPrimary1: number,
		colorPrimary2: number,
		colorSecondary1: number,
		colorSecondary2: number,
	},
	simplifiedName: string,
	author: DocumentReference,
}

const SelectGame = (): JSX.Element => {
	const [user, setUser] = useState(auth?.currentUser);
	auth.onAuthStateChanged(doc => {
		if (doc) setUser(doc);
		else setLoading(false);
	});
	const userDocReference = user?.uid ? doc(firestore, 'users', user.uid) : null;
	const [userDatabase, setUserDatabase] = useState<DocumentSnapshot>();
	const userData = userDatabase?.data();
	const [initialize, setInitialize] = useState(false);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		if (initialize || !userDocReference) return;
		setInitialize(true);
		getDoc(userDocReference).then(doc => {
			setUserDatabase(doc);
		})
			.finally(() => setLoading(false));
	}, [initialize, userDocReference]);
	const [gameName, setGameName] = useState('');
	const [creatingGameName, setCreatingGameName] = useState('');
	const [selectedGame, setSelectedGame] = useState<DocumentSnapshot | undefined>();
	const [searchGameObjects, setSearchGameObjects] = useState<QuerySnapshot>();
	const [canFindGame, setCanFindGame] = useState(true);
	const [makeGame, setMakeGame] = useState(false);
	const [colorPrimary1, setColorPrimary1] = useState(colorNumberToString(randomColor()));
	const [colorPrimary2, setColorPrimary2] = useState(colorNumberToString(randomColor()));
	const [colorSecondary1, setColorSecondary1] = useState(colorNumberToString(randomColor()));
	const [colorSecondary2, setColorSecondary2] = useState(colorNumberToString(randomColor()));
	const [error, setError] = useState('');

	const LocalHeader = (): JSX.Element => {
		const title = 'Challenge And Game Creation Screen - RTL Challenges';
		const description = 'Make your own challenge for any game. If a game does not exist with a name, you can add it.';
		return (
			<Head>
				<title>Challenge Creation Screen - RTL Challenges</title>
				<meta name='description' content={description} />
				<meta property='og:title' content={title} />
				<meta property='og:description' content={description} />
				<meta name='twitter:title' content={title} />
				<meta name='twitter:description' content={description} />
			</Head>
		);
	};

	if (loading) return <LocalHeader />;
	if (!auth.currentUser || !auth.currentUser.emailVerified || !userDatabase) return (
		<>
			<LocalHeader />
			<NoSignedIn auth={auth} userDatabase={userDatabase} />
		</>
	);
	return (
		<>
			<LocalHeader />
			<div className='MainPanel'>
				<div className='Box'>
					<h2>Select a Game</h2>
					{error && <p>{error}</p>}
					<p>For your challenge, what game must you play for it?</p>
					<div className='InputGroup'>
						<p>Game Name</p>
						<input
							autoComplete='on'
							autoCapitalize='words'
							value={gameName}
							placeholder='GameName 2: The Uprising'
							maxLength={64}
							autoFocus={true}
							onChange={(e) => setGameName(e.target.value)}
						/>
					</div>
					<div style={{margin: '1em'}} />
					<button className = 'Link' onClick={() => {
						if (gameName === '') return setError('Game name must not be empty');
						else if(gameName.includes('/')) return setError('Game name must not contain a slash');
						else if(gameName === '.' || gameName === '..') return setError('Game name must not consist of only one or two periods');
						else if(gameName.startsWith('__') && gameName.endsWith('__')) return setError('Game name must not start or end with two underscores');
						else setError('');
						getDoc(doc(firestore, 'games', gameName)).then(document => {
							setMakeGame(false);
							setCreatingGameName(gameName);
							if (document.exists()) {
								setCanFindGame(true);
								setSelectedGame(document);
							}
							else {
								getDocs(query(collection(firestore, 'games'), where('simplifiedName', '==', simplifyText(gameName)), orderBy('likes', 'desc'), limit(12)))
									.then(doc => {
										if (doc.docs.length > 0) setSearchGameObjects(doc);
										else setSearchGameObjects(undefined);
									})
									.catch(() => {
										setSearchGameObjects(undefined);
									})
									.finally(() => {
										setCanFindGame(false);
										setSelectedGame(undefined);
									});
							}
						})
							.catch(() => setSelectedGame(undefined));
					}}>
						<h3>Find Game</h3>
					</button>
				</div>
				{selectedGame &&
					<div className='Box'>
						<h2>Is This the Game?</h2>
						<GameElement document={selectedGame} liked={userData.gameLikes} />
						<div className = 'Menu'>
							<a rel='nofollow' href={'/games/' + encodeURI(selectedGame.id) + '/challenges/create'} className='Button'>
								<h3>Yes, This is the Game</h3>
							</a>
						</div>
					</div>
				}
				{!canFindGame && 
					<div className='Box'>
						<h2>Could Not Find Game</h2>
						{userData.gameCreatedCount === undefined || userData.gameCreatedCount < 3 ?
							<>
								<p>The game entered does not explicitly exist, retype the game name{searchGameObjects && ', selected from suggested games below,'} or create the game yourself.</p>
								<button className = 'Link' onClick={() => {
									setCanFindGame(true);
									setMakeGame(true);
								}}>
									<h3>Make New Game</h3>
								</button>
							</>
							:
							<p>The game entered does not explicitly exist, retype the game name{searchGameObjects && ', or selected from suggested games below'}. You can not create a game as you created too many before.</p>
						}
						{userData.warning >= 10 &&
							<div className='Box'>
								<h2>Account Banned From Posting</h2>
								<p>Your account has been banned for posting malicious or spammy content. You are still allowed to use the rest of the site.</p>
								<p>You are not out of luck however. As you may know, we recently released, we designed our moderation to be strict, but we are currently working on overhauling it.</p>
							</div>
						}
						<div>
							{searchGameObjects &&
							<div className='SingleSeparator'>
								<h2>Suggested Games</h2>
								{searchGameObjects.docs.map((doc, i) => 
									<GameElement key={i} document={doc} liked={userData.gameLikes} link={'/games/' + encodeURI(doc.id) + '/challenges/create'} />
								)}
							</div>
							}
						</div>
					</div>
				}
				{makeGame && 
					<div className='Box'>
						<h2>Create A Game</h2>
						<p>These colors are the game&apos;s permanent colors until it gets verified</p>
						<p><b>Game Name:</b> {creatingGameName}</p>
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
						<button onClick={() => {
							if (!auth.currentUser) return;
							const newGameData: firebaseGameInterface = {
								likes: 0,
								picture: {
									colorPrimary1: colorStringToNumber(colorPrimary1),
									colorPrimary2: colorStringToNumber(colorPrimary2),
									colorSecondary1: colorStringToNumber(colorSecondary1),
									colorSecondary2: colorStringToNumber(colorSecondary2)
								},
								simplifiedName: simplifyText(creatingGameName),
								author: doc(firestore, 'users', auth.currentUser.uid),
							};
							setDoc(doc(firestore, 'games', creatingGameName), newGameData)
								.then(() => window.location.href = '/games/' + creatingGameName)
								.catch(() => setError('Trouble communicating with database.'));
						}}
						style= {{marginTop: '1em'}}>
							<h3>Make New Game</h3>
						</button>
					</div>
				}
			</div>
		</>
	);
};

export default SelectGame;