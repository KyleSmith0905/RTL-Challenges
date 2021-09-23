// Firebase
import { initializeApp, FirebaseApp} from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

let app: FirebaseApp;

if (!app) {
	if (process.env.NODE_ENV === 'development') {
		app = initializeApp({
			apiKey: 'AIzaSyAVU9i6BZpLd4Z5CNtu4fXxoTANO0GLQug',
			authDomain: 'rtl-challenges-dev.firebaseapp.com',
			projectId: 'rtl-challenges-dev',
			storageBucket: 'rtl-challenges-dev.appspot.com',
			messagingSenderId: '365855190443',
			appId: '1:365855190443:web:19ad80216f4da40e6fb6ee'
		});
	}
	else {
		app = initializeApp({
			apiKey: 'AIzaSyDhuJFv8Hcq9BTGUJ73FPZfXZpHRfN1xjo',
			authDomain: 'rtlchallenges.firebaseapp.com',
			projectId: 'rtlchallenges',
			storageBucket: 'rtlchallenges.appspot.com',
			messagingSenderId: '871018012708',
			appId: '1:871018012708:web:ddde54791d8e38867638b1',
			measurementId: 'G-942D6PM837',
		});
	}
}

export const auth = getAuth();
export const firestore = getFirestore();
export default app;