/* eslint-disable no-undef */

const securityHeaders = [
	{
		key: 'X-Frame-Options',
		value: 'SAMEORIGIN'
	},
	{
		key: 'X-DNS-Prefetch-Control',
		value: 'on'
	},
	{
		key: 'Strict-Transport-Security',
		value: 'max-age=63072000; includeSubDomains; preload'
	},
	{
		key: 'X-XSS-Protection',
		value: '1; mode=block'
	},
	{
		key: 'X-Frame-Options',
		value: 'SAMEORIGIN'
	},
	{
		key: 'X-Content-Type-Options',
		value: 'nosniff'
	},
	{
		key: 'Content-Security-Policy',
		value: 'default-src \'self\' https://*.googleapis.com https://rtlchallenges.firebaseapp.com/ https://rtl-challenges-dev.firebaseapp.com/ https://www.googleapis.com https://www.googletagmanager.com https://www.google-analytics.com https://apis.google.com;' +
      'img-src *;' +
      'style-src \'self\' \'unsafe-inline\';'
	},
];

if (process.env.NODE_ENV === 'development') securityHeaders.push({
	key: 'X-Robots-Tag',
	value: 'noindex'
});

module.exports = {
	async headers() {
		return [
			{
				source: '/(.*)',
				headers: securityHeaders,
			},
		];
	},
	httpAgentOptions: {
		keepAlive: true,
	},
	reactStrictMode: true,
};