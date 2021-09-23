// Framework
import { useState } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
// Firebase
import { collection, documentId, getDoc, getDocs, limit, orderBy, query, where, DocumentData, DocumentSnapshot, QueryConstraint, QuerySnapshot, doc } from 'firebase/firestore';
// Local Code
import { auth, firestore } from '../../../../lib/Firebase';
import ChallengeElement from '../../../../component/Helpers/ChallengeElement';
import { pluginsArray, completionArray } from '../../../../lib/Helpers';

const ChallengeList = ({ challenges, gameName, challengesIds }: {challenges: string, gameName: string, challengesIds: string}): JSX.Element => {
	const router = useRouter();
	const challengeData = router.isFallback ? [] : JSON.parse(challenges);
	const challengeId: string[] = router.isFallback ? ['_'] : JSON.parse(challengesIds);
	const gameNameReal: string = router.isFallback ? '_' : JSON.parse(gameName);
	const challengeCollection = collection(firestore, 'games', gameNameReal, 'challenges');
	const [challengeObjects, setChallengeObjects] = useState<QuerySnapshot>();
	const [searchInput1, setSearchInput1] = useState('');
	const [searchOutput1, setSearchOutput1] = useState('');
	const [displaySearch, setDisplaySearch] = useState('');
	
	const [userDatabase, setUserDatabase] = useState<DocumentSnapshot>();
	const [initialize, setInitialize] = useState(false);
	if (!initialize && auth.currentUser) {
		setInitialize(true);
		getDoc(doc(firestore, 'users', auth.currentUser.uid))
			.then((doc) => setUserDatabase(doc));
	}

	const searchByTerms = (): void => {
		const filterTerms = ['id', 'author', 'createdAt', 'category', 'completion', 'plugins'];
		const filterTermsDisplay = ['Unique ID', 'Author\'s Unique ID', 'Age', 'Category', 'Completion', 'Plugins'];
		const filterTermsIndex = filterTerms.indexOf(searchInput1);
		const sortBy: QueryConstraint = orderBy('likes', 'desc');
		let filterBy: QueryConstraint;
		if (filterTermsIndex === 0) filterBy = where(documentId(),'==', searchOutput1);
		else if (filterTermsIndex === 1) filterBy = where('author', '==', doc(firestore, 'users', searchOutput1));
		else if (filterTermsIndex === 2) {
			if (searchOutput1 === 'Today') filterBy = where('createdAt', '>', new Date(Date.now() - 86400000));
			if (searchOutput1 === 'This week') filterBy = where('createdAt', '>', new Date(Date.now() - 604800000));
			if (searchOutput1 === 'This month') filterBy = where('createdAt', '>', new Date(Date.now() - 2592000000));
			if (searchOutput1 === 'This year') filterBy = where('createdAt', '>', new Date(Date.now() - 31536000000));
		}
		else if (filterTermsIndex === 3) filterBy = where('category', 'array-contains', searchOutput1);
		else if (filterTermsIndex === 4) filterBy = where('completion', '==', completionArray.indexOf(searchOutput1) + 1);
		else if (filterTermsIndex === 5) filterBy = where('plugins', '==', pluginsArray.indexOf(searchOutput1) + 1);
		getDocs(query(challengeCollection, sortBy, filterBy, limit(12)))
			.then(docs => {
				setDisplaySearch(filterTermsDisplay[filterTermsIndex] + ': ' + searchOutput1);
				setChallengeObjects(docs);
			});
	};

	const LocalHeader = (): JSX.Element => {
		const title = 'Lists of Challenges for ' + gameNameReal + ' - RTL Challenges';
		const description = 'Want a challenge for ' + gameNameReal + '? Search through our list of challenges by many different filters.';
		return (
			<Head>
				<title>Challenge List for {gameNameReal} - RTL Challenges</title>
				<meta name='description' content={description} />
				<meta property='og:title' content={title} />
				<meta property='og:description' content={description} />
				<meta name='twitter:title' content={title} />
				<meta name='twitter:description' content={description} />
			</Head>
		);
	};

	const ChallengesDisplay = (): JSX.Element => {
		if (challengeObjects === undefined && challengeData.length > 0) return (
			<>
				<h2>Top Challenges{searchInput1 !== '' && ' - '}{searchInput1 !== '' && <span style={{fontSize: '0.7em'}}>{displaySearch}</span>}</h2>
				{challengeData.map((docs: DocumentData, i: number) =>
					<ChallengeElement key={i} document={docs} user={userDatabase} reference={doc(firestore, 'games', gameNameReal, 'challenges', challengeId[i])} />
				)}
			</>
		);
		else if (challengeObjects && challengeObjects.docs.length > 0) return (
			<>
				<h2>Top Challenges{searchInput1 !== '' && ' - '}{searchInput1 !== '' && <span style={{fontSize: '0.7em'}}>{displaySearch}</span>}</h2>
				{challengeObjects.docs.map((docs, i) =>
					<ChallengeElement key={i} document={docs} user={userDatabase} />
				)}
			</>
		);
		else return (
			<>
				<h2>No challenges found</h2>
				{challengeData.length === 0 ?
					<p>Try a different search term, or create your dream challenge!</p>
					: <p>No one made a challenge for this game, be the first!</p>
				}
				<div className = 'Menu'>
					<a rel='nofollow' className='Button' href={'/games/' + encodeURI(gameNameReal) + '/challenges/create'}>
						<h3>Create Challenge</h3>
					</a>
				</div>
			</>
		);
	};

	if (router.isFallback) return <LocalHeader />;
	return (
		<>
			<LocalHeader />
			<div className='MainPanel'>
				{challengeData.length !== 0 && <div className='Box'>
					<h2>Search Terms</h2>
					<div className='InputGroup'>
						<p>Filter By</p>
						<select
							onChange={(e) => setSearchInput1(e.target.value)}
							value={searchInput1}
						>
							<option value=''>- Select An Option -</option>
							<option value='id'>Unique ID</option>
							<option value='author'>Author&apos;s Unique ID</option>
							<option value='createdAt'>Age</option>
							<option value='category'>Category</option>
							<option value='completion'>Completion</option>
							<option value='plugins'>Plugins</option>
						</select>
					</div>
					{(searchInput1 === 'id' || searchInput1 === 'author') &&
						<div className='InputGroup'>
							<p>Filter - <span style={{fontSize: '0.7em'}}>{searchInput1 === 'author' && 'Author\'s '}Unique Id</span></p>
							<input
								value={searchOutput1}
								placeholder='0aA1bB2cC3dD4eE5fF6g'
								maxLength={20}
								onChange={(e) => setSearchOutput1(e.target.value)}
								onKeyPress={(e) => {if (e.key === 'Enter') searchByTerms();}}
							/>
						</div>
					}
					{searchInput1 === 'plugins' &&
						<div className='InputGroup'>
							<p>Filter - <span style={{fontSize: '0.7em'}}>Plugins</span></p>
							<select
								onChange={(e) => setSearchOutput1(e.target.value)}
								value={searchOutput1}
								onKeyPress={(e) => {if (e.key === 'Enter') searchByTerms();}}
							>
								<option value=''>- Select An Option -</option>
								<option value={pluginsArray[0]}>{pluginsArray[0]}</option>
								<option value={pluginsArray[1]}>{pluginsArray[1]}</option>
								<option value={pluginsArray[2]}>{pluginsArray[2]}</option>
								<option value={pluginsArray[3]}>{pluginsArray[3]}</option>
							</select>
						</div>
					}
					{searchInput1 === 'completion' &&
						<div className='InputGroup'>
							<p>Filter - <span style={{fontSize: '0.7em'}}>Completion</span></p>
							<select
								onChange={(e) => setSearchOutput1(e.target.value)}
								value={searchOutput1}
								onKeyPress={(e) => {if (e.key === 'Enter') searchByTerms();}}
							>
								<option value=''>- Select An Option -</option>
								<option value={completionArray[0]}>{completionArray[0]}</option>
								<option value={completionArray[1]}>{completionArray[1]}</option>
								<option value={completionArray[2]}>{completionArray[2]}</option>
							</select>
						</div>
					}
					{searchInput1 === 'category' &&
						<div className='InputGroup'>
							<p>Filter - <span style={{fontSize: '0.7em'}}>Category</span></p>
							<input
								value={searchOutput1}
								placeholder='Example Type'
								maxLength={16}
								onChange={(e) => setSearchOutput1(e.target.value)}
								onKeyPress={(e) => {if (e.key === 'Enter') searchByTerms();}}
							/>
						</div>
					}
					{searchInput1 === 'createdAt' &&
						<div className='InputGroup'>
							<p>Filter - <span style={{fontSize: '0.7em'}}>Age</span></p>
							<select
								onChange={(e) => setSearchOutput1(e.target.value)}
								value={searchOutput1}
								onKeyPress={(e) => {if (e.key === 'Enter') searchByTerms();}}
							>
								<option value=''>- Select An Option -</option>
								<option value='Today'>Today</option>
								<option value='This week'>This week</option>
								<option value='This month'>This month</option>
								<option value='this year'>This year</option>
							</select>
						</div>
					}
					{searchInput1 !== '' &&
						<div className = 'Menu' style={{marginTop: '0.7em'}}>
							<button onClick={() => searchByTerms()}>
								<h3>Search Challenges</h3>
							</button>
						</div>
					}
				</div>}
				<div className='Box'>
					<ChallengesDisplay />
				</div>
			</div>
		</>
	);
};

export const getStaticProps: GetStaticProps = async ({params})  => {
	const gameName = decodeURI(typeof params?.gameName === 'string' ? decodeURI(params.gameName) : '');
	const gameReference = doc(firestore, 'games', gameName);
	const gameDatabase = getDoc(gameReference);
	const challengeDatabase = getDocs(query(collection(firestore, 'games', gameName, 'challenges'), orderBy('likes', 'desc'), limit(12)));
	const [gameData, challengeData] = await Promise.all([gameDatabase, challengeDatabase]);
	return {
		props: {gameName: JSON.stringify(gameName), challenges: JSON.stringify(challengeData.docs.map(ele => ele.data())), challengesIds: JSON.stringify(challengeData.docs.map(ele => ele.id))},
		revalidate: 21600,
		notFound: !gameData.exists,
	};
};

export const getStaticPaths: GetStaticPaths = async () => {
	return {
		paths: [],
		fallback: true,
	};
};

export default ChallengeList;