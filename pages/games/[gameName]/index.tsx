// Framework
import { useEffect, useState } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
// Firebase
import { arrayRemove, arrayUnion, deleteDoc, doc, DocumentData, getDoc, updateDoc } from 'firebase/firestore';
// Local Code
import Logo from '../../../component/Graphics/Logo';
import Heart from '../../../component/Graphics/Heart';
import { auth, firestore } from '../../../lib/Firebase';
import { includesReference } from '../../../lib/Helpers';

const Page = ({ game, gameName }: {game: string, gameName: string}): JSX.Element => {
	const router = useRouter();
	const gameData = router.isFallback ? {} : JSON?.parse(game);
	const userReference = auth.currentUser ? doc(firestore, 'users', auth.currentUser.uid) : null;
	const [userDatabase, setUserDatabase] = useState<DocumentData>();
	const [liked, setLiked] = useState(false);
	const [loggedLiked, setLoggedLiked] = useState(false);
	const [canLike, setCanLike] = useState(false);

	if (gameData.likes === undefined) gameData.likes = 0;
	useEffect(() => {
		if (userDatabase || !auth.currentUser || !userReference) return;
		getDoc(userReference).then(user => {
			setUserDatabase(user);
			const tempSetLiked = includesReference(user.data()?.gameLikes, gameName);
			setLiked(tempSetLiked);
			setLoggedLiked(tempSetLiked);
			setCanLike(Boolean(user) && Boolean(auth.currentUser?.emailVerified));
		});
	}, [userReference]);

	useEffect(() => setLikes(gameData.likes), [gameData]);
	const [likes, setLikes] = useState<number>(0);

	const [likeTimeout, setLikeTimeout] = useState(setTimeout.prototype);
	const startLikeTimeout = () => {
		setTimeout(() => {
			setCanLike(true);
		}, 500);
		const thisLikeTimeout = setTimeout(() => {
			if (!userDatabase || !userReference || loggedLiked !== liked) return;
			setLoggedLiked(!liked);
			if (!liked) updateDoc(userReference, {gameLikes: arrayUnion(doc(firestore, 'games', gameName))});
			else updateDoc(userReference, {gameLikes: arrayRemove(doc(firestore, 'games', gameName))});
		}, 1000);
		setLikeTimeout(thisLikeTimeout);
	};

	const LocalHeader = (): JSX.Element => {
		const title = 'Find Challenges for ' + gameName + ' - RTL Challenges';
		const description = 'Want a ' + gameName + ' challenge? Get a random challenge, search through challenges in our collection, or create your own challenge.';
		return (
			<Head>
				{gameData.likes < 16 && <meta name='robots' content='noindex' />}
				<title>Challenges for {gameName} - RTL Challenges</title>
				<meta name='description' content={description} />
				<meta property='og:title' content={title} />
				<meta property='og:description' content={description} />
				<meta name='twitter:title' content={title} />
				<meta name='twitter:description' content={description} />
			</Head>
		);
	};

	if (router.isFallback) return <LocalHeader />;
	return (
		<>
			<LocalHeader />
			<div className='MainPanel'>
				<div className='Box'>
					<div style={{float: 'right', margin: '1em -0.9em'}}>
						{gameData.pictureLink ? (
							<img
								src={gameData.pictureLink}
								alt={gameData.name + ' icon'}
								style={{width: '5em', height: '5em'}}
							/>
						) : (
							<Logo colorObject={gameData.picture} size='5em' />
						)}
					</div>
					<h2>{gameName}</h2>
					<div tabIndex={0} className={'TextAndIcon' + (canLike ? ' ButtonHidden' : '')} onClick={() => {
						if (!canLike) return;
						setLiked(!liked);
						setCanLike(false);
						setLikes(likes + (liked ? -1 : 1));
						clearTimeout(likeTimeout);
						startLikeTimeout();
					}}>
						<p>{likes + ' like' + (likes === 1 ? '' : 's')}</p>
						<Heart size = '1.5em' color = {liked} stroke = {8} />
					</div>
				</div>
				<div className='Box'>
					<h2>Challenges</h2>
					<div className='Menu'>
						<a rel='nofollow' tabIndex={0} className='Button' href={'/games/' + encodeURI(gameName) + '/challenges/random'}>
							<h3>Random</h3>
						</a>
						<a rel='nofollow' tabIndex={0} className='Button' href={'/games/' + encodeURI(gameName) + '/challenges'}>
							<h3>Search</h3>
						</a>
						<a rel='nofollow' tabIndex={0} className='Button' href={'/games/' + encodeURI(gameName) + '/challenges/create'}>
							<h3>Create</h3>
						</a>
						{userDatabase && userDatabase.adminLevel > 3 && 
						<div tabIndex={0} className='Button' onClick={() => deleteDoc(doc(firestore, 'games', gameName))}>
							<h3>Admin Delete</h3>
						</div>}
					</div>
				</div>
			</div>
		</>
	);
};

export const getStaticProps: GetStaticProps = async ({params})  => {
	const gameReference = doc(firestore, 'games', typeof params?.gameName === 'string' ? decodeURI(params.gameName) : '');
	const gameDatabase = await getDoc(gameReference);
	return {
		props: {game: JSON.stringify(gameDatabase.data()), gameName: gameDatabase.id},
		revalidate: 21600,
		notFound: !gameDatabase.exists,
	};
};

export const getStaticPaths: GetStaticPaths = async () => {
	return {
		paths: [],
		fallback: true,
	};
};

export default Page;