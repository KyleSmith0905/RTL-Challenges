// Framework
import { useEffect, useState } from 'react';

interface Input {
  active: boolean;
  onClick?: () => void;
}

const Eye: React.FC<Input> = ({ active, onClick}: Input): JSX.Element => {

	const [documentColor, setDocumentColor] = useState('transparent');
	useEffect(() => {
		if (typeof window !== 'object') return;
		setDocumentColor(window.getComputedStyle(document.documentElement).getPropertyValue('--color-text'));
	}, []);
	
	return (
		<svg onClick={onClick} className = 'ButtonHidden' style ={{width: 16, height: 16}} viewBox = {'-4 -4 40 40'}>
			<path 
				d={
					' M 0,16' +
          ' C 8,32 24,32 32,16'}
				fill='transparent'
				stroke={documentColor}
				strokeWidth={4}
				strokeLinecap='round'
			/>
			<path 
				d={
					' M 0,16' +
          ' C 8,' + (active ? '0' : '32') + ' 24,' + (active ? '0' : '32') + ' 32,16'}
				fill='transparent'
				stroke={documentColor}
				strokeWidth={4}
				strokeLinecap='round'
			/>
			<circle
				style = {{transform: active ? '' : 'translateY(24px) scaleY(0)'}}
				cx='16'
				cy='16'
				r='4'
				fill='transparent'
				stroke={documentColor}
				strokeWidth={4}
				strokeLinecap='round'
			/>
		</svg>
	);
};

export default Eye;