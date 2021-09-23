// Framework
import { GetServerSideProps } from 'next';
// Firebase
import { doc, getDoc } from 'firebase/firestore';
// Local Code
import { firestore } from '../lib/Firebase';

const Sitemap = (): void => null;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
	const baseUrl = decodeURI({
		development: 'http://localhost:5000',
		production: 'https://rtlchallenges.com',
	} [process.env.NODE_ENV]);
	
	const sitemapSnapshot = (await getDoc(doc(firestore, 'siteInfo', 'sitemap'))).data();
	const sitemapData = sitemapSnapshot?.data();
	let dynamicPages = '';

	const gamesLength = Object.keys(sitemapData.games).length;

	for (let i = 0; i < gamesLength; i++) {
		const tempEntry = Object.entries(sitemapData.games)[i];
		const gameName = decodeURI(tempEntry[0]);
		dynamicPages += '<url>' +
			'<loc>'+baseUrl+'/games/'+gameName+'</loc>' +
			'<lastmod>'+new Date('2021/09/14').toISOString()+'</lastmod>' +
			'<changefreq>monthly</changefreq>' +
			'<priority>0.8</priority>' +
		'</url>' +
		'<url>' +
			'<loc>'+baseUrl+'/games/'+gameName+'/challenges</loc>' +
			'<lastmod>'+new Date('2021/09/14').toISOString()+'</lastmod>' +
			'<changefreq>daily</changefreq>' +
			'<priority>0.2</priority>' +
		'</url>' +
		'<url>' +
			'<loc>'+baseUrl+'/games/'+gameName+'/challenges/random</loc>' +
			'<lastmod>'+new Date('2021/09/14').toISOString()+'</lastmod>' +
			'<changefreq>always</changefreq>' +
			'<priority>0.0</priority>' +
		'</url>' +
		'<url>' +
			'<loc>'+baseUrl+'/games/'+gameName+'/challenges/create</loc>' +
			'<lastmod>'+new Date('2021/09/14').toISOString()+'</lastmod>' +
			'<changefreq>monthly</changefreq>' +
			'<priority>0.0</priority>' +
		'</url>' +
		(Array.isArray(tempEntry[1]) ? tempEntry[1].map((e) => {
			const challengeName = decodeURI(e);
			return '<url>' +
				'<loc>'+baseUrl+'/games/'+gameName+'/challenges/'+challengeName+'</loc>' +
				'<lastmod>'+new Date('2021/09/14').toISOString()+'</lastmod>' +
				'<changefreq>monthly</changefreq>' +
				'<priority>0.6</priority>' +
			'</url>';}) : '');
	}

	const staticPages = '<?xml version="1.0" encoding="UTF-8"?>' +
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
			'<url>' +
				'<loc>'+baseUrl+'</loc>' +
				'<lastmod>'+new Date('2021/09/14').toISOString()+'</lastmod>' +
				'<changefreq>daily</changefreq>' +
				'<priority>0.8</priority>' +
			'</url>' +
			'<url>' +
				'<loc>'+baseUrl+'/account</loc>' +
				'<lastmod>'+new Date('2021/09/14').toISOString()+'</lastmod>' +
				'<changefreq>monthly</changefreq>' +
				'<priority>0.1</priority>' +
			'</url>' +
			'<url>' +
				'<loc>'+baseUrl+'/account/log-in</loc>' +
				'<lastmod>'+new Date('2021/09/21').toISOString()+'</lastmod>' +
				'<changefreq>yearly</changefreq>' +
				'<priority>0.0</priority>' +
			'</url>' +
			'<url>' +
				'<loc>'+baseUrl+'/account/register</loc>' +
				'<lastmod>'+new Date('2021/09/14').toISOString()+'</lastmod>' +
				'<changefreq>yearly</changefreq>' +
				'<priority>0.0</priority>' +
			'</url>' +
			'<url>' +
				'<loc>'+baseUrl+'/account/reset-password</loc>' +
				'<lastmod>'+new Date('2021/09/21').toISOString()+'</lastmod>' +
				'<changefreq>yearly</changefreq>' +
				'<priority>0.0</priority>' +
			'</url>' +
			'<url>' +
				'<loc>'+baseUrl+'/admin</loc>' +
				'<lastmod>'+new Date('2021/09/21').toISOString()+'</lastmod>' +
				'<changefreq>monthly</changefreq>' +
				'<priority>0.1</priority>' +
			'</url>' +
			'<url>' +
				'<loc>'+baseUrl+'/admin/challenges</loc>' +
				'<lastmod>'+new Date('2021/09/21').toISOString()+'</lastmod>' +
				'<changefreq>monthly</changefreq>' +
				'<priority>0.1</priority>' +
			'</url>' +
			'<url>' +
				'<loc>'+baseUrl+'/challenges</loc>' +
				'<lastmod>'+new Date('2021/09/14').toISOString()+'</lastmod>' +
				'<changefreq>daily</changefreq>' +
				'<priority>0.2</priority>' +
			'</url>' +
			'<url>' +
				'<loc>'+baseUrl+'/challenges/select-game</loc>' +
				'<lastmod>'+new Date('2021/09/14').toISOString()+'</lastmod>' +
				'<changefreq>monthly</changefreq>' +
				'<priority>0.0</priority>' +
			'</url>' +
			'<url>' +
				'<loc>'+baseUrl+'/games</loc>' +
				'<lastmod>'+new Date('2021/09/14').toISOString()+'</lastmod>' +
				'<changefreq>daily</changefreq>' +
				'<priority>0.6</priority>' +
			'</url>' +
			'<url>' +
				'<loc>'+baseUrl+'/privacy</loc>' +
				'<lastmod>'+new Date('2021/09/14').toISOString()+'</lastmod>' +
				'<changefreq>yearly</changefreq>' +
				'<priority>0.1</priority>' +
			'</url>' +
			'<url>' +
				'<loc>'+baseUrl+'/discord</loc>' +
				'<lastmod>'+new Date('2021/09/14').toISOString()+'</lastmod>' +
				'<changefreq>never</changefreq>' +
				'<priority>0.0</priority>' +
			'</url>' +
			dynamicPages +
		'</urlset>';


	res.setHeader('Content-Type', 'text/xml');
	res.write(staticPages);
	res.end();

	return {
		props: {},
	};
};

export default Sitemap;