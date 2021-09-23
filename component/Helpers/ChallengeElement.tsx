// Framework
import { useEffect, useState } from 'react';
// Firebase
import { DocumentData, DocumentReference, DocumentSnapshot, getDoc } from 'firebase/firestore';
// Local Code
import Heart from '../Graphics/Heart';
import Cross from '../Graphics/Cross';
import { includesReference } from '../../lib/Helpers';

interface Input extends React.HTMLAttributes<HTMLDivElement> {
	document?: DocumentSnapshot | DocumentData;
  reference?: DocumentReference;
  user?: DocumentData;
}

const ChallengeElement: React.FC<Input> = ({ reference, user, document }: Input): JSX.Element => {
	const [challengeData, setChallengeData] = useState<DocumentData | undefined>(document instanceof DocumentSnapshot ? document.data() : document);
	const [challengeReference, setChallengeReference] = useState<DocumentReference | undefined>(document instanceof DocumentSnapshot ? document.ref : reference);

	const [initialize, setInitialize] = useState(false);
	const [interaction, setInteraction] = useState('');
	useEffect(() => {
		if (!challengeReference || !user) null;
		else if (includesReference(user.challengeDislikes, challengeReference?.id)) setInteraction('dislike');    
		else if (includesReference(user.challengeLikes, challengeReference?.id)) setInteraction('like');
		if (initialize) return;
		setInitialize(true);
		if (!reference || challengeData) return;
		getDoc(reference).then((doc: DocumentSnapshot) => {
			setChallengeReference(doc.ref);
			setChallengeData(doc.data());
		});
	}, [user, challengeData]);

	if (!challengeReference || !challengeData || !challengeReference.parent?.parent?.id) return <></>;
	let description: string = challengeData?.description.trim();
	if (description.length > 128) description = description.substring(0, 126) + '...';
	description.replace(/\n/g,' ');
	

	return (
		<a tabIndex={0} href={'/games/' + encodeURI(challengeReference.parent.parent?.id ?? '') + '/challenges/' + encodeURI(challengeReference.id)} className='InnerBox Button'>
			<h3>{challengeReference.parent.parent.id} - {challengeData.title}</h3>
			<p style={{fontSize: '0.9em'}}>{description.replace(/[\r\n\u0085\u2028\u2029]+/g, ' ')}</p>
			<p>Categories: <span style={{fontStyle: 'italic'}}>{challengeData.category.join(', ')}</span></p>
			<div className = 'Menu' style={{justifyContent: 'space-between'}}>
				<div className='TextAndIcon'>
					<p>{challengeData.likes + ' like' + (challengeData.likes === 1 ? '' : 's')}</p>
					<Heart size = '1.5em' color = {interaction === 'like'} stroke = {8} />
				</div>
				<div className='TextAndIcon'>
					<Cross size = '1.5em' color = {interaction === 'dislike'} stroke = {8} />
					<p style={{marginLeft: '0.9em'}}>{challengeData.dislikes + ' dislike' + (challengeData.dislikes === 1 ? '' : 's')}</p>
				</div>
			</div>
		</a>
	);
};

export default ChallengeElement;