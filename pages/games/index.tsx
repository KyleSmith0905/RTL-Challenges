import { useEffect, useState } from 'react';
import GameElement from '../../component/Helpers/GameElement';
import { auth, firestore } from '../../lib/Firebase';
import { simplifyText } from '../../lib/Helpers';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import { collection, doc, DocumentData, DocumentReference, DocumentSnapshot, getDoc, getDocs, limit, orderBy, query, QuerySnapshot, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const GamesList = ({gameData, gameIds } : {gameData: string, gameIds: string}): JSX.Element => {
	const game = JSON.parse(gameData);
	const gameId = JSON.parse(gameIds);

	const [userReference, setUserReference] = useState<DocumentReference>();
	const [userDatabase, setUserDatabase] = useState<DocumentData>();
	useEffect(() => {
		onAuthStateChanged(auth, (auth) => {
			if (auth) setUserReference(doc(firestore, 'users', auth?.uid));
		});
	}, []);

	const [startUserFetch, setStartUserFetch] = useState(false);
	useEffect(() => {
		if (startUserFetch || !userReference) return; 
		setStartUserFetch(true);
		getDoc(userReference).then((doc: DocumentSnapshot) => {
			if (doc.exists) setUserDatabase(doc.data());
		});
	}, [userReference]);

	const [gameName, setGameName] = useState('');
	const [unchangingGameName, setUnchangingGameName] = useState('');
	const [searchGameObjects, setSearchGameObjects] = useState<QuerySnapshot | undefined>();
		
	const searchGame = () => {
		getDocs(query(collection(firestore, 'games'), where('simplifiedName', '==', simplifyText(gameName)), orderBy('likes', 'desc'), limit(12)))
			.then(doc => {
				if (doc.docs.length > 0) setSearchGameObjects(doc);
				else setSearchGameObjects(undefined);
			})
			.catch(() => {
				setSearchGameObjects(undefined);
			})
			.finally(() => setUnchangingGameName(gameName));
	};

	const LocalHeader = (): JSX.Element => {
		const title = 'Search Through A List Of Games - RTL Challenges';
		const description = 'Select a game and view its challenges. Find a game you would like to play challenges for by searching it up.';
		return (
			<Head>
				<title>Game List - RTL Challenges</title>
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
					<h2>Search For Game</h2>
					<div className='InputGroup'>
						<p>Game Name - <span style={{fontSize: '0.7em'}}>Capitalization Sensitive</span></p>
						<input
							placeholder='GameName 2: The Uprising'
							autoComplete='on'
							maxLength={64}
							value={gameName}
							onChange={(e) => setGameName(e.target.value)} 
							onKeyPress={(e) => {if (e.key === 'Enter') searchGame();}}
						/>
					</div>
					<div className = 'Menu' style={{marginTop: '0.45em'}}>
						<button onClick={() => searchGame()}>
							<h3>Search</h3>
						</button>
					</div>
				</div>
				<div className='Box'>
					<h2>Top Games{searchGameObjects && ' - '}{searchGameObjects && <span style={{fontSize: '0.7em'}}>{unchangingGameName}</span>}</h2>
					{game && !searchGameObjects &&
						game.map((ele: DocumentData, i: number) => 
							<GameElement key={i} document={ele} liked={userDatabase?.gameLikes} reference={doc(firestore, 'games', gameId[i])} />
						)
					}
					{searchGameObjects?.docs &&
						searchGameObjects.docs.map((ele: DocumentSnapshot, i: number) => 
							<GameElement key={i} document={ele} liked={userDatabase?.gameLikes} />
						)
					}
				</div>
			</div>
		</>
	);
};

export const getStaticProps: GetStaticProps = async ()  => {
	const gameQuery = query(collection(firestore, 'games'), orderBy('likes', 'desc'), limit(12));
	const gameDatabase = await getDocs(gameQuery);
	return {
		props: {gameData: JSON.stringify(gameDatabase.docs.map(ele => ele.data())), gameIds: JSON.stringify(gameDatabase.docs.map(ele => ele.ref.id))},
		revalidate: 21600,
	};
};

export default GamesList;
