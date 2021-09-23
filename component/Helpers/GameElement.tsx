// Framework
import { useEffect, useState } from 'react';
// Firebase
import { DocumentData, DocumentReference, DocumentSnapshot } from 'firebase/firestore';
// Local Code
import Logo from '../Graphics/Logo';
import Heart from '../Graphics/Heart';
import { includesReference } from '../../lib/Helpers';

interface Input extends React.HTMLAttributes<HTMLDivElement> {
  document: DocumentSnapshot | DocumentData;
  reference?: DocumentReference;
  liked: DocumentReference[];
  link?: string;
}

const GameElement: React.FC<Input> = ({ document, liked, link, reference }: Input): JSX.Element => {
	const [isLiked, setIsLiked] = useState(false);
	const database = document instanceof DocumentSnapshot ? document.data() : document;

	useEffect(() => {
		if (Array.isArray(liked) && includesReference(liked, reference ? reference.id : document.ref)) setIsLiked(true);
	}, [liked]);


	if (database === undefined) <></>;
	return (
		<a tabIndex={0} href={link ?? '/games/' + encodeURI(reference ? reference.id : document.id)} className='InnerBox Button'>
			<div className = 'DeleteSmall' style={{position: 'absolute', alignSelf: 'flex-end', marginLeft: '0.2em'}}>
				{database && database.pictureLink ? (
					<img
						src={database.pictureLink}
						alt={database.name + ' icon'}
						style={{width: '5em', height: '5em'}}
					/>
				) : (
					<Logo colorObject={database?.picture} size='5em' />
				)}
			</div>
			<h2>{reference ? reference.id : document.id}</h2>
			<div className='TextAndIcon'>
				<p>{(database ? database.likes : '0') + ' like' + ((database ? database.likes : 0) === 1 ? '' : 's')}</p>
				<Heart size = '1.5em' color = {isLiked} stroke = {8} />
			</div>
		</a>
	);
};

export default GameElement;