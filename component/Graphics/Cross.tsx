// Framework
import { useEffect, useState } from 'react';

interface Input {
	color?: boolean;
	stroke?: number;
	size: string;
}

const Cross: React.FC<Input> = ({ size, color, stroke}: Input): JSX.Element => {
	if (stroke === undefined) stroke = 3;
	const strokeColor = 'hsl(210, 100%, 77.5%)';
	const sizeSvg = 64;
	return (
		<svg style ={{width: size, height: size}} viewBox = {-stroke + ',' + -stroke + ' '+ (stroke * 2 + sizeSvg) +',' + (stroke * 2 + sizeSvg)}>
			<CrossLines num={0} color={color} stroke={stroke} strokeColor={strokeColor} />
			<CrossLines num={1} color={color} stroke={stroke} strokeColor={strokeColor} />
		</svg>
	);
};

interface InputLines {
	color?: boolean;
	stroke: number;
	strokeColor?: string;
	num: number;
}

const CrossLines: React.FC<InputLines> = ({ color, strokeColor, stroke, num }: InputLines): JSX.Element => {
	const sideLineWidth = stroke*0.8;
	const halfSideLineWidth = sideLineWidth / 2;
	const length = num ? '24' : '12';
	if (strokeColor === undefined) strokeColor = 'transparent';
	
	const [documentColor, setDocumentColor] = useState('transparent');
	useEffect(() => {
		if (typeof window !== 'object') return;
		setDocumentColor(window.getComputedStyle(document.documentElement).getPropertyValue('--color-text'));
	}, []);
	
	return (
		<path d={
			'M ' + (sideLineWidth + 32) + ',32' +
				'l ' + length +',' + length +'' +
				'a ' + -halfSideLineWidth + ',' + halfSideLineWidth + ' 0 0,1 -' + sideLineWidth + ',' + sideLineWidth +
				'L 32,' + (sideLineWidth + 32) +
				'l -' + length +',' + length +'' +
				'a ' + -halfSideLineWidth + ',-' + halfSideLineWidth + ' 0 0,1 -' + sideLineWidth + ',-' + sideLineWidth +
				'L ' + (-sideLineWidth + 32) + ',32' +
				'l -' + length +',-' + length +'' +
				'a ' + halfSideLineWidth + ',-' + halfSideLineWidth + ' 0 0,1 ' + sideLineWidth +',-' + sideLineWidth +
				'L 32,' + (-sideLineWidth + 32) +
				'l ' + length +',-' + length +'' +
				'a ' + halfSideLineWidth + ',' + halfSideLineWidth + ' 0 0,1 ' + sideLineWidth +',' + sideLineWidth +
				'Z' + (color ? 
				'M -' + stroke + ',32' +
					'A 32,32 0 1,0 ' + (64 + stroke) +',32' +
					'A 32,32 0 1,0 -' + stroke +',32' 
				: '')
		}
		fill={documentColor}
		opacity={Boolean(num) === color ? '0' : '1'}
		/>
	);
};

export default Cross;