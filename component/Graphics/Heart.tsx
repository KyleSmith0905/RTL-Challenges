// Framework
import { useEffect, useState } from 'react';

interface Input {
  color?: boolean;
  stroke?: number;
  size: string;
}

const Heart: React.FC<Input> = ({ size, color, stroke}: Input): JSX.Element => {
	if (stroke === undefined) stroke = 3;
	const sizeSvg = 64;
	const sizeRadius = sizeSvg / 2.414;
	const sizeLine = sizeSvg / 8;

	const [documentColor, setDocumentColor] = useState('transparent');
	useEffect(() => {
		if (typeof window !== 'object') return;
		setDocumentColor(window.getComputedStyle(document.documentElement).getPropertyValue('--color-text'));
	}, []);
  
	return (
		<svg style ={{width: size, height: size}} viewBox = {-stroke + ',' + -stroke + ' '+ (stroke * 2 + sizeSvg) +',' + (stroke * 2 + sizeSvg)}>
			<path 
				d={
					' M ' + sizeSvg / 2 + ','+ sizeSvg +
          ' l ' + sizeRadius + ',' + -sizeRadius +
          ' a ' + sizeLine + ',' + sizeLine + ' 0 0,0 ' + -sizeRadius + ',' + -sizeRadius +
          ' a ' + sizeLine + ',' + sizeLine + ' 0 0,0 ' + -sizeRadius + ',' + sizeRadius +
          ' z'}
				fill={!color ? 'transparent' : documentColor}
				stroke={documentColor}
				strokeWidth={stroke}
			/>
		</svg>
	);
};

export default Heart;