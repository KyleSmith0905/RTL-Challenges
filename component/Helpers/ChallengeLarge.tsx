// Framework
import { useEffect, useState } from 'react';
// Firebase
import { arrayRemove, arrayUnion, deleteDoc, doc, DocumentData, DocumentReference, DocumentSnapshot, FieldValue, getDoc, increment, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
// Local Code
import Logo from '../Graphics/Logo';
import Heart from '../Graphics/Heart';
import Cross from '../Graphics/Cross';
import {completionArray, pluginsArray, includesReference} from '../../lib/Helpers';
import { auth, firestore } from '../../lib/Firebase';

interface Input {
	authorData?: DocumentData
	authorId?: string,
	challengeData: DocumentData,
	challengeId: string,
	gameName: string,
	random?: boolean,
	userDatabase?: DocumentSnapshot,
}

const Challenge: React.FC<Input> = ({authorId, challengeData, challengeId, gameName, authorData, random, userDatabase}: Input): JSX.Element => {
	const challengeRef = doc(firestore, 'games', gameName, 'challenges', challengeId);
	const [userReference, setUserReference] = useState<DocumentReference>();
	useEffect(() => {
		onAuthStateChanged(auth, (auth: User) => {
			if (auth) setUserReference(doc(firestore, 'users', auth.uid));
		});
	}, []);

	const [canInteract, setCanInteract] = useState(false);
	const [interactTimeout, setInteractTimeout] = useState<NodeJS.Timeout | undefined>();
	const [whatInteract, setWhatInteract] = useState('');
	const [likes, setLikes] = useState(0);
	const [dislikes, setDislikes] = useState(0);
	const [loggedInteraction, setLoggedInteraction] = useState('');
	const [intendDelete, setIntendDelete] = useState(false);
	const [intendWarn, setIntendWarn] = useState(false);
	const [warnCount, setWarnCount] = useState(0);
	const [userData, setUserData] = useState<DocumentData>(userDatabase);

	const [startedUser, setStartedUser] = useState(false);
	useEffect(() => {
		if (startedUser || !auth.currentUser || !challengeData || !userReference) return;
		setStartedUser(true);
		if (userDatabase) {
			setCanInteract(userDatabase.exists && Boolean(auth.currentUser?.emailVerified));
			let tempInteraction = '';
			if (includesReference(userDatabase.data()?.challengeLikes, challengeRef)) tempInteraction = 'like';
			else if (includesReference(userDatabase.data()?.challengeDislikes, challengeRef)) tempInteraction = 'dislike';
			setLoggedInteraction(tempInteraction);
			setWhatInteract(tempInteraction);
		}
		getDoc(userReference).then((user: DocumentSnapshot) => {
			if (!user || !user.exists) return;
			setUserData(user);
			setCanInteract(user.exists && Boolean(auth.currentUser?.emailVerified));
			let tempInteraction = '';
			if (includesReference(user?.data()?.challengeLikes, challengeRef)) tempInteraction = 'like';
			else if (includesReference(user?.data()?.challengeDislikes, challengeRef)) tempInteraction = 'dislike';
			setLoggedInteraction(tempInteraction);
			setWhatInteract(tempInteraction);
		});
	}, [userReference, challengeData, auth]);
	
	useEffect(() => {
		if (challengeData === undefined || challengeData === null) return;
		if (!challengeData.likes) challengeData.likes = 0;
		if (!challengeData.dislikes) challengeData.dislikes = 0;
		setLikes(challengeData.likes ?? 0);
		setDislikes(challengeData.dislikes ?? 0);
	}, []);

	const startInteractTimeout = (interaction: string, emptyInteraction: boolean): void => {
		const localInteractTimeout: NodeJS.Timeout | undefined = global.setTimeout(() => {
			const beforeInteraction = loggedInteraction;
			const afterInteraction = emptyInteraction ? '' : interaction;
			if (!userReference || !challengeData || beforeInteraction === afterInteraction) return;
			setLoggedInteraction(afterInteraction);
			const changes: {challengeLikes?: FieldValue, challengeDislikes?: FieldValue} = {};
			if (afterInteraction === 'like') changes.challengeLikes = arrayUnion(challengeRef);
			else if (afterInteraction === 'dislike') changes.challengeDislikes = arrayUnion(challengeRef);
			if (beforeInteraction === 'like') changes.challengeLikes = arrayRemove(challengeRef);
			else if (beforeInteraction === 'dislike') changes.challengeDislikes = arrayRemove(challengeRef);
			updateDoc(userReference, changes);
		}, 1000);
		setInteractTimeout(localInteractTimeout);
	};

	let completionTimeDay = 0;
	let completionTimeHour = 0;
	let completionTimeMinute = 0;
	if (challengeData && challengeData.completion === 2) {
		completionTimeDay = Math.floor(challengeData.completionTime / 1440);
		completionTimeHour = Math.floor((challengeData.completionTime % 1440) / 60);
		completionTimeMinute = challengeData.completionTime % 60;
	}

	if (challengeData === null) return (
		<div className='Box'>
			<h2>No Challenges</h2>
			<p>We did not find any challenges. Feel free to create your own challenges!</p>
			<div className='Menu'>
				<a rel='nofollow' className='Button' href={'/games/' + encodeURI(gameName) + '/challenges/create'}>
					<h3>Create Challenge</h3>
				</a>
			</div>
		</div>
	);

	return (
		<div className='Box'>
			{random ? <h2>Challenge for {gameName}</h2> : <h2>Random Challenge for {gameName}</h2>}
			{authorData && <div className='TextAndIcon' style={{width: '100%'}}>
				<p style={{wordBreak: 'break-word'}}>Challenge By: <span style={{fontSize: '1.3em'}}>{authorData.username || 'Unknown'}</span></p>
				<div>
					<Logo size='2.5em' colorObject={authorData.profilePicture} />
				</div>
			</div>}
			<div className='InnerBox'>
				<h3>{challengeData.title}</h3>
				<p>{challengeData.description}</p>
				<div className = 'Separator'>
					<h4 className = 'FieldName'>Categories:</h4>
					<div className = 'MultiContent'>
						{challengeData.category.map((ele: string, i: number) => 
							<p key={i}>{ele}</p>
						)}
					</div>
				</div>
				<div className = 'Separator'>
					<h4 className = 'FieldName'>Completion:</h4>
					<div className = 'MultiContent'>
						{challengeData.completion === 1 &&
						<p>{completionArray[0]}</p>
						}
						{challengeData.completion === 2 &&
						<p>Challenge will lasts for: {
							(completionTimeDay && completionTimeDay + ' day' + (completionTimeDay === 1 ? ' ' : 's ') || '') +
						(completionTimeHour > 0 && completionTimeHour + ' hour' + (completionTimeHour === 1 ? ' ' : 's ') || '') +
						(completionTimeMinute > 0 && completionTimeMinute + ' minute' + (completionTimeMinute === 1 ? ' ' : 's ') || '')
						}</p>
						}
						{challengeData.completion === 3 &&
						<p>Challenge ends when: {challengeData.completionEvent}</p>
						}
					</div>
				</div>
				<div className = 'Separator'>
					<h4 className = 'FieldName'>Plugins:</h4>
					<div className ='MultiContent'>
						{challengeData.plugins > 0 && challengeData.plugins < 4 &&
						<p>{pluginsArray[challengeData.plugins - 1]}</p>
						}
						{challengeData.plugins === 4 &&
						<p>Challenge requires this plugin: <a rel='noreferrer noopener ugc' className='HoverUnderline' href={challengeData.pluginsLink} target='_blank'>{challengeData.pluginsLink}</a></p>
						}
					</div>
				</div>
				<div className = 'Menu' style={{justifyContent: 'space-between'}}>
					<div className={'TextAndIcon' + (canInteract ? ' ButtonHidden' : '')} onClick={() => {
						if (!canInteract) return;
						const tempWhatInteract = whatInteract === 'like' ? '' : 'like';
						setLikes(likes + (tempWhatInteract === 'like' ? 1 : -1));
						if (whatInteract === 'dislike') setDislikes(dislikes - 1);
						if (interactTimeout) clearTimeout(interactTimeout);
						setWhatInteract(tempWhatInteract);
						startInteractTimeout('like', tempWhatInteract === '');
					}}>
						<p>{likes ?? '0'} Like{likes === 1 ? '' : 's'}</p>
						<Heart size='1.2em' color = {whatInteract === 'like'} stroke = {8} />
					</div>
					<div className={'TextAndIcon' + (canInteract ? ' ButtonHidden' : '')} onClick={() => {
						if (!canInteract) return;
						const tempWhatInteract = whatInteract === 'dislike' ? '' : 'dislike';
						setDislikes(dislikes + (tempWhatInteract === 'dislike' ? 1 : -1));
						if (whatInteract === 'like') setLikes(likes - 1);
						if (interactTimeout) clearTimeout(interactTimeout);
						setWhatInteract(tempWhatInteract);
						startInteractTimeout('dislike', tempWhatInteract === '');
					}}>
						<Cross size='1.2em' color = {whatInteract === 'dislike'} stroke = {8} />
						<p style={{marginLeft: '0.9em'}}>{dislikes ?? '0'} Dislike{dislikes === 1 ? '' : 's'}</p>
					</div>
				</div>
				<p className = 'FadedText' style={{padding: '0.75em'}}>Challenge created at: {new Date(challengeData.createdAt.seconds * 1000).toISOString().substring(0,10)}</p>
			</div>
			<div className='Menu'>
				{random &&
				<>
					<a rel='nofollow' tabIndex={0} className='Button' href={''}>
						<h3>Random</h3>
					</a>
					<a rel='nofollow' tabIndex={0} className='Button' href={'/games/' + encodeURI(gameName) + '/challenges/' + encodeURI(challengeId)}>
						<h3>Static Page</h3>
					</a>
				</>
				}
				{challengeData.author.id === auth.currentUser?.uid || authorId === auth.currentUser?.uid &&
				<div tabIndex={0} className='Button' onClick={() => setIntendDelete(!intendDelete)}>
					<h3>Delete Challenge</h3>
				</div>
				}
				{intendDelete &&
				<input
					tabIndex={0}
					className='Button'
					placeholder='Type "Delete" to delete'
					maxLength={16}
					onChange={(ele) => {
						if (ele.currentTarget.value.toLowerCase() !== 'delete') return;
						deleteDoc(challengeRef)
							.then(() => window.location.href = '/games/' + encodeURI(gameName));
					}}
					
				/>
				}
				{userData && userData.exists && userData.data().adminLevel &&
				<>
					<div tabIndex={0} className='Button' onClick={() => {
						deleteDoc(challengeRef);
						window.location.reload();
					}}>
						<h3>Admin Delete</h3>
					</div>
					<div tabIndex={0} className='Button' onClick={() => {
						if (warnCount <= 0 || warnCount > 10) {
							setIntendWarn(!intendWarn);
						}
						else {
							deleteDoc(challengeRef);
							updateDoc(userReference, {warning: !userData.warning ? warnCount : increment(warnCount)});
							window.location.reload();
						}
					}}>
						<h3>Admin Warn And Delete</h3>
					</div>
					{intendWarn &&
						<input
							type='number'
							value={warnCount < 0 || isNaN(warnCount) ? '' : warnCount}
							max='10'
							min='0'
							placeholder='0'
							onChange={(e) => setWarnCount(parseInt(e.target.value) ?? 0)}
							onKeyPress={(e) => {
								if (e.key === 'Enter') {
									deleteDoc(challengeRef);
									updateDoc(userReference, {warning: !userData.warning ? warnCount : increment(warnCount)});
									window.location.reload();
								}
							}}
						/>
					}
				</>
				}
			</div>
		</div>
	);
};

export default Challenge;