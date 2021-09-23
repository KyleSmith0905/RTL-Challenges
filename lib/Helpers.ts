// Firebase
import { User } from 'firebase/auth';
import { DocumentReference, doc, setDoc } from 'firebase/firestore';
// Local Code
import { firestore } from './Firebase';

const randomColor = (): number => {
	return Math.floor(Math.random() * 0xFFFFFF);
};

interface accountInterface {
	username?: string,
	profilePicture?: {
		colorPrimary1: number,
		colorPrimary2: number,
		colorSecondary1: number,
		colorSecondary2: number,
	},
}

const createUserDatabase = (user: User, username?: string): Promise<void> => {
	const userData: accountInterface = {
		username: !username ? user.uid.substr(0, 16) : username,
		profilePicture: {
			colorPrimary1: randomColor(),
			colorPrimary2: randomColor(),
			colorSecondary1: randomColor(),
			colorSecondary2: randomColor(),
		}
	};
	return setDoc(doc(firestore, 'users', user.uid), userData);
};

const getCookie = (name: string): string | undefined => {
	if (typeof window !== 'object') return;
	const value = '; ' + document.cookie;
	const parts = value.split('; ' + name + '=');
	if (parts.length === 2) return parts?.pop()?.split(';').shift();
};

const includesReference = (liked: DocumentReference[] | undefined, reference: DocumentReference | string | undefined): boolean => {
	if (!liked || !reference) return false;
	if (reference instanceof DocumentReference) {
		for (let i = 0; i < liked.length; i++) {
			if (liked[i].id === reference.id) return true;
		}
	}
	else if (typeof reference === 'string') {
		for (let i = 0; i < liked.length; i++) {
			if (liked[i].id === reference) return true;
		}
	}
	return false;
};

const colorStringToNumber = (colorString: string): number => {
	return parseInt(colorString.replace('#', '0x'), 16);
};

const colorNumberToString = (number: number): string => {
	const hex = number.toString(16);
	return '#' + hex.padStart(6, '0');
};

const simplifyText = (text: string): string => {
	text = text.toUpperCase().replace(/[^A-Z]/g, '');
	text = text.substring(0, 12);
	text = text.replaceAll('Q', 'O').replaceAll(/[LT]/g, 'I').replaceAll('E', 'F');
	return text.trim();
};

const pluginsArray = ['No plugins allowed', 'Cosmetic plugins allowed', 'Gameplay and cosmetic plugins allowed', 'Plugin required'];

const completionArray = ['When the player wants to quit', 'After a specified amount of time', 'After something is completed'];

export { randomColor, createUserDatabase, getCookie, completionArray, pluginsArray, includesReference, colorStringToNumber, colorNumberToString, simplifyText};
export type { accountInterface };
