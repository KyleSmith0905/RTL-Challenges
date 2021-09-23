// Framework
import {useEffect, useState} from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
// Firebase
import { addDoc, collection, doc, DocumentReference, DocumentSnapshot, FieldValue, getDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
// Local Code
import { getCookie } from '../../../../lib/Helpers';
import { auth, firestore } from '../../../../lib/Firebase';
import NoSignedIn from '../../../../component/NoSignedIn';

interface challenge {
	createdAt: FieldValue;
	author: DocumentReference;
	title: string;
	seed?: number;
	description: string;
	likes: number;
	dislikes: number;
	category: string[];
	completion: number;
	completionTime?: number;
	completionEvent?: string;
	plugins: number;
	pluginsLink?: string;
}

const CreateChallenges = ({ gameName }: {gameName: string}): JSX.Element => {
	const router = useRouter();
	const [userDatabase, setUserDatabase] = useState<DocumentSnapshot>();
	const userData = userDatabase?.data();
	const [userLoading, setUserLoading] = useState(true);
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [category, setCategory] = useState(['', '', '']);
	const [completion, setCompletion] = useState('1');
	const [completionTimeDay, setCompletionTimeDay] = useState(-1);
	const [completionTimeHour, setCompletionTimeHour] = useState(-1);
	const [completionTimeMinute, setCompletionTimeMinute] = useState(-1);
	const [completionEvent, setCompletionEvent] = useState('');
	const [plugins, setPlugins] = useState('1');
	const [pluginsLink, setPluginsLink] = useState('');
	const [errors, setErrors] = useState('');
	const [initialize, setInitialize] = useState(false);
	const [user, setUser] = useState(auth?.currentUser);
	onAuthStateChanged(auth, doc => {
		if (doc) setUser(doc);
		else setUserLoading(false);
	});

	useEffect(() => {
		if (initialize || !user) return;
		setInitialize(true);
		getDoc(doc(firestore, 'users', auth.currentUser.uid)).then((doc) => setUserDatabase(doc)).finally(() => setUserLoading(false));
		setTitle(window.unescape(getCookie('formTitle') ?? ''));
		setDescription(window.unescape(getCookie('formDescription') ?? ''));
		setCategory(JSON.parse(window.unescape(getCookie('formCategory') ?? '["","",""]')));
		setCompletion(window.unescape(getCookie('formCompletion') ?? ''));
		setCompletionTimeDay(parseInt(window.unescape(getCookie('formCompletionTimeDay') ?? '-1')));
		setCompletionTimeHour(parseInt(window.unescape(getCookie('formCompletionTimeHour') ?? '-1')));
		setCompletionTimeMinute(parseInt(window.unescape(getCookie('formCompletionTimeMinute') ?? '-1')));
		setCompletionEvent(window.unescape(getCookie('formCompletionEvent') ?? ''));
		setPlugins(window.unescape(getCookie('formPlugins') ?? ''));
		setPluginsLink(window.unescape(getCookie('formPluginsLink') ?? ''));
	}, [auth.currentUser]);

	const staticCookie = 'path=/games/' + gameName + '/challenges/create; expires=' + new Date(Date.now() + 604800000).toUTCString();
	useEffect(() => {
		const interval = setInterval(() => {
			document.cookie = 'formTitle=' + window.escape(title) + '; ' + staticCookie;
			document.cookie = 'formDescription=' + window.escape(description) + '; ' + staticCookie;
			document.cookie = 'formCategory=' + window.escape(JSON.stringify(category)) + '; ' + staticCookie;
			document.cookie = 'formCompletion=' + window.escape(completion) + '; ' + staticCookie;
			if (completion === '2') {
				document.cookie = 'formCompletionTimeDay=' + window.escape(completionTimeDay.toString()) + '; ' + staticCookie;
				document.cookie = 'formCompletionTimeHour=' + window.escape(completionTimeHour.toString()) + '; ' + staticCookie;
				document.cookie = 'formCompletionTimeMinute=' + window.escape(completionTimeMinute.toString()) + '; ' + staticCookie;
			}
			else if (completion === '3')document.cookie = 'formCompletionEvent=' + window.escape(completionEvent) + '; ' + staticCookie;
			document.cookie = 'formPlugins=' + window.escape(plugins) + '; ' + staticCookie;
			if (plugins === '4') document.cookie = 'formPluginsLink=' + window.escape(pluginsLink) + '; ' + staticCookie;
		}, 4000);
		return () => clearInterval(interval);
	});
	const validateForm = (): string => {
		let categoriesMade = 0;
		const tempCompletionTimeDay = completionTimeDay < 0 ? 0 : completionTimeDay;
		const tempCompletionTimeHour = completionTimeHour < 0 ? 0 : completionTimeHour;
		const tempCompletionTimeMinute = completionTimeMinute < 0 ? 0 : completionTimeMinute;

		if (title.length < 4) return 'Title must be at least 4 characters.';
		if (description.length < 16) return 'Description must be at least 16 characters.';
		for (let i = 0; i < category.length; i++) {
			if (category[i].length === 0) continue;
			if (category[i].length < 2) return 'Category must be at least 2 characters.';
			categoriesMade++;
		}
		if (category.some((val, i) => (category.indexOf(val) !== i && val))) return 'Categories must not have duplicates.';
		if (categoriesMade === 0) return 'Categories must have at least 1 value.';
		if (completion === '') return 'Completion must be selected.';
		if (completion === '2' && (tempCompletionTimeDay * 1440 + tempCompletionTimeHour * 60 + tempCompletionTimeMinute <= 0)) return 'Completion Time must have a value.';
		if (completion === '2' && (tempCompletionTimeDay > 16 || tempCompletionTimeHour > 23 || tempCompletionTimeMinute > 59)) return 'Completion Time must not exceed maximum values.';
		if (completion === '3' && completionEvent.length < 4) return 'Completion Event must be at least 4 characters.';
		if (plugins === '') return 'Plugins must be selected.';
		if (plugins === '4' && !isValidURL(pluginsLink)) return 'Plugins Link must be a valid URL. Try pasting the link directly.';
		else return '';
	};

	const LocalHeader = (): JSX.Element => {
		const title = 'Create A Challenge For ' + gameName + ' - RTL Challenges';
		const description = 'Build your own challenge for ' + gameName + '. Fully customize your dream challenge and publish it for other people.';
		return (
			<Head>
				<title>Create Challenges For {gameName} - RTL Challenges</title>
				<meta name='description' content={description} />
				<meta property='og:title' content={title} />
				<meta property='og:description' content={description} />
				<meta name='twitter:title' content={title} />
				<meta name='twitter:description' content={description} />
			</Head>
		);
	};

	if (userLoading || router.isFallback) return <LocalHeader />;
	else if (!auth.currentUser?.emailVerified || !userDatabase) return (
		<>
			<LocalHeader />
			<NoSignedIn auth={auth} userDatabase={userDatabase} />
		</>
	);
	else if (userData.challenges?.length > 12) return (
		<>
			<LocalHeader />
			<div className='MainPanel'>
				<div className='Box'>
					<h2>Challenge Limit Exceeded</h2>
					<p>You made a lot of challenges! We will give you this opportunity to delete your unpopular past challenges!</p>
				</div>
			</div>
		</>
	);
	else if (userData.warning >= 10) return (
		<>
			<LocalHeader />
			<div className='MainPanel'>
				<div className='Box'>
					<h2>Account Banned From Posting</h2>
					<p>Your account has been banned for posting malicious or spammy content. You are still allowed to use the rest of the site.</p>
					<p>You are not out of luck however. As you may know, we recently released, we designed our moderation to be strict, but we are currently working on overhauling it.</p>
				</div>
			</div>
		</>
	);
	return (
		<>
			<LocalHeader />
			<div className='MainPanel'>
				<div className='Box'>
					<h2>Create a Challenge for {gameName}</h2>
					{errors && <p>{errors}</p>}
					<div className='InputGroup'>
						<p>Title</p>
						<input
							autoComplete='on'
							value={title}
							placeholder='No Special Abilities!'
							onChange={(e) => setTitle(e.target.value)}
							maxLength={64}
							autoFocus={true}
						/>
					</div>
					<div className='InputGroup'>
						<p>Description</p>
						<textarea
							autoComplete='on'
							value={description}
							placeholder='Beat the game on easy without using special abilities!&#13;&#13;Rules: You must go from the beginning cutscene to beating final boss on easy without activating any of your three special abilities.&#13;&#13;Character: Your choice.'
							onChange={(e) => setDescription(e.target.value)}
							maxLength={512}
						/>
					</div>
					<div className='Form'>
						<div className='InputGroup'>
							<p>Category - <span style={{fontSize: '0.7em'}}>1</span></p>
							<input
								autoComplete='on'
								value={category[0]}
								placeholder='Story Mode'
								onChange={(e) => setCategory([e.target.value, category[1], category[2]])}
								maxLength={16}
							/>
						</div>
						<div className='InputGroup'>
							<p>Category - <span style={{fontSize: '0.7em'}}>2</span></p>
							<input
								autoComplete='on'
								value={category[1]}
								placeholder='100% Completion'
								onChange={(e) => setCategory([category[0], e.target.value, category[2]])}
								maxLength={16}
							/>
						</div>
						<div className='InputGroup'>
							<p>Category - <span style={{fontSize: '0.7em'}}>3</span></p>
							<input
								autoComplete='on'
								value={category[2]}
								placeholder='Abilities'
								onChange={(e) => setCategory([category[0], category[1], e.target.value])}
								maxLength={16}
							/>
						</div>
					</div>
					<div className='InputGroup'>
						<p>Completion - <span style={{fontSize: '0.7em'}}>When does the challenge end?</span></p>
						<select
							onChange={(e) => setCompletion(e.target.value)}
							value={completion}
						>
							<option value=''>- Select An Option -</option>
							<option value='1'>When the player wants to quit</option>
							<option value='2'>After a specified amount of time</option>
							<option value='3'>After something is completed</option>
						</select>
						{completion === '2' &&
							<div className='Form'>
								<div className='InputGroup'>
									<p>Completion - <span style={{fontSize: '0.7em'}}>Days</span></p>
									<input
										type='number'
										value={completionTimeDay < 0 || isNaN(completionTimeDay) ? '' : completionTimeDay}
										max='16'
										min='0'
										placeholder='0'
										onChange={(e) => setCompletionTimeDay(parseInt(e.target.value) ?? 0)}
									/>
								</div>
								<div className='InputGroup'>
									<p>Completion - <span style={{fontSize: '0.7em'}}>Hours</span></p>
									<input
										type='number'
										value={completionTimeHour < 0 || isNaN(completionTimeHour) ? '' : completionTimeHour}
										max='23'
										min='0'
										placeholder='6'
										onChange={(e) => setCompletionTimeHour(parseInt(e.target.value) ?? 0)}
									/>
								</div>
								<div className='InputGroup'>
									<p>Completion - <span style={{fontSize: '0.7em'}}>Minutes</span></p>
									<input
										type='number'
										value={completionTimeMinute < 0 || isNaN(completionTimeMinute) ? '' : completionTimeMinute}
										max='59'
										min='0'
										placeholder='0'
										onChange={(e) => setCompletionTimeMinute(parseInt(e.target.value) ?? 0)}
									/>
								</div>
							</div>
						}
						{completion === '3' && 
							<div className='InputGroup'>
								<p>Completion - <span style={{fontSize: '0.7em'}}>Event</span></p>
								<input
									autoComplete='on'
									value={completionEvent}
									placeholder='After beating final boss'
									onChange={(e) => setCompletionEvent(e.currentTarget.value)}
									maxLength={32}
								/>
							</div>
						}
					</div>
					<div className='InputGroup'>
						<p>Plugins - <span style={{fontSize: '0.7em'}}>Includes any external downloads, such as maps.</span></p>
						<select
							onChange={(e) => setPlugins(e.target.value)}
							value={plugins}
						>
							<option value=''>- Select An Option -</option>
							<option value='1'>No plugins allowed</option>
							<option value='2'>Cosmetic plugins allowed</option>
							<option value='3'>Gameplay and cosmetic plugins allowed</option>
							<option value='4'>Plugin required</option>
						</select>
						{plugins === '4' &&
							<div className='InputGroup'>
								<p>Plugins - <span style={{fontSize: '0.7em'}}>Link</span></p>
								<input
									autoComplete='on'
									type='url'
									value={pluginsLink}
									placeholder='https://exampleWebsite.com/exampleUser/examplePlugin'
									onChange={(e) => setPluginsLink(e.target.value)}
									maxLength={256}
								/>
							</div>
						}
					</div>
					<div className='Menu'>
						<button className = 'Link' 
							style = {{marginTop: '1.6em'}}
							onClick = {async () => {
								try {
									const validForm = validateForm();
									if (validForm !== '') throw validForm;
									else if (!auth.currentUser) throw 'You must be logged in to create a challenge.';
									setErrors('');
									const challengeData: challenge = {
										createdAt: serverTimestamp(),
										author: doc(firestore, 'users', auth.currentUser.uid),
										likes: 0,
										dislikes: 0,
										title: title,
										description: description,
										category: category.filter((ele) => ele !== ''),
										completion: parseFloat(completion),
										plugins: parseFloat(plugins),
									};
									if (completion === '2') challengeData.completionTime = (completionTimeDay < 0 ? 0 : completionTimeDay) * 1440 + (completionTimeHour < 0 ? 0 : completionTimeHour) * 60 + (completionTimeMinute < 0 ? 0 : completionTimeMinute);
									else if (completion === '3') challengeData.completionEvent = completionEvent;
									if (plugins === '4') challengeData.pluginsLink = pluginsLink;
									addDoc(collection(firestore, 'games', gameName, 'challenges'), challengeData)
										.then((docRef) => window.location.href = '/games/' + gameName + '/challenges/' + docRef.id)
										.catch(() => setErrors('An error occurred when communicating with the database.'));
								}
								catch (err) {
									setErrors(typeof(err) === 'string' ? err : 'Unknown error.');
								}
							}}>
							<h3>Submit</h3>
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default CreateChallenges;


export const getStaticProps: GetStaticProps = async ({params})  => {
	const gameReference = doc(firestore, 'games', typeof params?.gameName === 'string' ? decodeURI(params.gameName) : '');
	const gameDatabase = await getDoc(gameReference);
	return {
		props: {gameName: gameDatabase.id},
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

const isValidURL = (url: string): boolean => {
	try {
		const parsedUrl = new URL(url);
		if (!parsedUrl.protocol.startsWith('http')) throw 'Not a web address';
	}
	catch {
		return false;
	}
	return true;
};