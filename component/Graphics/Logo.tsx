// Framework
import { useEffect, useState } from 'react';
// Local Code
import { colorNumberToString } from '../../lib/Helpers';

interface Circle {
  x: number;
  y: number;
  r: number;
}

interface Input extends React.HTMLAttributes<HTMLDivElement> {
  colorObject?: {
    colorPrimary1: number;
    colorPrimary2: number;
    colorSecondary1: number;
    colorSecondary2: number;
  };
  size: string;
}

const Logo: React.FC<Input> = ({ size, colorObject}: Input): JSX.Element => {
	let numMain = [1730303, 3065573, 86770, 4295];
	if (colorObject) numMain = [colorObject.colorPrimary1, colorObject.colorPrimary2, colorObject.colorSecondary1, colorObject.colorSecondary2];
	const primaryColor = 'linear-gradient(to top right, ' + colorNumberToString(numMain[0]) + ' 17%, ' + colorNumberToString(numMain[1]) + ' 83%)';
	const secondaryColor = 'linear-gradient(to bottom right, ' + colorNumberToString(numMain[2]) + ' 17%, ' + colorNumberToString(numMain[3]) + ' 83%)';
	const [circleElements, setCircleElements] = useState<{x: string, y: string, r: string}[]>([]);
	useEffect(() => {
		const elements = generateLogo();
		setCircleElements(elements.map((ele) => circleToPixels(ele, parseFloat(size))));
	}, []);
	return (
		<div
			className='LogoContainer'
			style={{ width: size, height: size, backgroundImage: primaryColor }}
		>
			{circleElements.map((ele, i) => (
				<div
					className='Element'
					style={{
						backgroundImage: secondaryColor,
						zIndex: i,
						width: ele.r,
						height: ele.r,
						marginTop: ele.y,
						marginLeft: ele.x,
					}}
					key={i}
				/>
			))}
		</div>
	);
};

export default Logo;

const generateLogo = (): Circle[] => {
	const elements: Circle[] = [];
	for (let i = 0; i < 24; i++) {
		const inverseSize = 1 - Math.pow(i + 7.5, -0.5);
		let circle = {
			r: 1 - inverseSize,
			x: (Math.random() - 0.5) * inverseSize,
			y: (Math.random() - 0.5) * inverseSize,
		};
		let [touching, conflictCircle] = isTouchingAny(circle, elements);
		if (touching) {
			for (let j = 0; j < 2 && touching; j++) {
				circle = tryFixCircle(circle, conflictCircle);
				[touching, conflictCircle] = isTouchingAny(circle, elements);
			}
		}
		if (!touching) elements.push(circle);
	}
	return elements;
};

export { generateLogo };

const distance = (
	circleOne: { x: number; y: number },
	circleTwo: { x: number; y: number }
): number => {
	return Math.sqrt(
		Math.pow(circleOne.x - circleTwo.x, 2) +
      Math.pow(circleOne.y - circleTwo.y, 2)
	);
};

const isOutside = (circle: Circle): boolean => {
	return 0.5 - circle.r * 0.5 - 0.01 < distance(circle, { x: 0, y: 0 });
};

const isTouching = (circleOne: Circle, circleTwo: Circle): boolean => {
	return (
		Math.pow(circleOne.x - circleTwo.x, 2) +
      Math.pow(circleOne.y - circleTwo.y, 2) <=
    0.01 + Math.pow((circleOne.r + circleTwo.r) / 2, 2)
	);
};

const tryFixCircle = (circleMain: Circle, circleOther: Circle): Circle => {
	if (circleMain === circleOther) {
		const escapeAngle = Math.atan2(circleMain.y, circleMain.x);
		circleMain.x = Math.cos(escapeAngle) * (circleMain.r * 0.5 - 0.07);
		circleMain.y = Math.sin(escapeAngle) * (circleMain.r * 0.5 - 0.07);
	} 
	else {
		const escapeAngle = Math.atan2( circleMain.y - circleOther.y, circleMain.x - circleOther.x);
		circleMain.x =
      Math.cos(escapeAngle) * (circleMain.r + circleOther.r + 0.04) * 0.5 +
      circleOther.x;
		circleMain.y =
      Math.sin(escapeAngle) * (circleMain.r + circleOther.r + 0.04) * 0.5 +
      circleOther.y;
	}
	return circleMain;
};

const isTouchingAny = (circle: Circle, elements: Circle[]): [boolean, Circle] => {
	if (isOutside(circle)) return [true, circle];
	for (let i = 0; i < elements.length; i++)
		if (isTouching(circle, elements[i])) return [true, elements[i]];
	return [false, circle];
};

const circleToPixels = (
	circle: Circle,
	size: number,
): { x: string; y: string; r: string } => {
	const r = size*  circle.r;
	const x = (circle.x + 0.5) * size - r * 0.5;
	const y = (circle.y + 0.5) * size - r * 0.5;
	return { x: x + 'em', y: y + 'em', r: r + 'em' };
};