/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

// Framework
import next from 'next';
// Firebase
import { https } from 'firebase-functions';

const isDev = process.env.NODE_ENV === 'development';
const nextServer = next({
	dev: isDev,
	conf: { distDir: '.next' },
});

const nextHandle = nextServer.getRequestHandler();

exports.hosting = https.onRequest((req, res) => {
	return nextServer.prepare().then(() => nextHandle(req, res));
});