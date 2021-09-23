// Framework
import Head from 'next/head';

const Page500 = (): JSX.Element => {

	const updateDate = '2021/09/04';
	const siteName = 'RTL Challenges';
	const siteAddress = 'https://rtlchallenges.com';

	const LocalHeader = (): JSX.Element => {
		const title = 'Our Official Privacy Policy - RTL Challenges';
		const description = 'RTL Challenges privacy policy since ' + updateDate + '. In short, we may need to collect information about you for account creation, and store other information for your convenience.';
		return (
			<Head>
				<title>Privacy Policy - RTL Challenges</title>
				<meta name='description' content={description} />
				<meta property='og:title' content={title} />
				<meta property='og:description' content={description} />
				<meta name='twitter:title' content={title} />
				<meta name='twitter:description' content={description} />
			</Head>
		);
	};

	return (
		<>
			<LocalHeader />
			<div className='MainPanel'>
				<div className='Box'>
					<h2>Privacy Policy</h2>
					<p>Last updated: {updateDate}</p>
					<p>{siteName} (&quot;us&quot;, &quot;we&quot;, or &quot;our&quot;) operates <a rel='nofollow' href={siteAddress} className='HoverUnderline'>{siteAddress}</a> (the &quot;Site&quot;). This page informs you of our policies regarding the collection, use and disclosure of Personal Information we receive from users of the Site.</p>
					<p>We use your Personal Information only for providing and improving the Site. By using the Site, you agree to the collection and use of information in accordance with this policy.</p>
					<h3>Information Collection And Use</h3>
					<p>While using our Site, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you. Personally identifiable information may include, but is not limited to your name (&quot;Personal Information&quot;).</p>
					<h3>Log Data</h3>
					<p>Like many site operators, we collect information that your browser sends whenever you visit our Site (&quot;Log Data&quot;).</p>
					<p>This Log Data may include information such as your computer&apos;s Internet Protocol (&quot;IP&quot;) address, browser type, browser version, the pages of our Site that you visit, the time and date of your visit, the time spent on those pages and other statistics.</p>
					<p>In addition, we may use third party services such as Google Analytics that collect, monitor and analyze {siteName}&apos;s performance.</p>
					<h3>Communications</h3>
					<p>We may use your Personal Information to contact you with newsletters, marketing or promotional materials and other information.</p>
					<h3>Cookies</h3>
					<p>Cookies are files with small amount of data, which may include an anonymous unique identifier. Cookies are sent to your browser from a web site and stored on your computer&apos;s hard drive.</p>
					<p>Like many sites, we use &quot;cookies&quot; to collect information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Site.</p>
					<h3>Security</h3>
					<p>The security of your Personal Information is important to us, but remember that no method of transmission over the Internet, or method of electronic storage, is 100% secure. While we strive to use commercially acceptable means to protect your Personal Information, we cannot guarantee its absolute security.</p>
					<h3>Changes To This Privacy Policy</h3>
					<p>This Privacy Policy is effective as of {updateDate} and will remain in effect except with respect to any changes in its provisions in the future, which will be in effect immediately after being posted on this page.</p>
					<p>We reserve the right to update or change our Privacy Policy at any time and you should check this Privacy Policy periodically. Your continued use of the Service after we post any modifications to the Privacy Policy on this page will constitute your acknowledgment of the modifications and your consent to abide and be bound by the modified Privacy Policy.</p>
					<p>If we make any material changes to this Privacy Policy, we will notify you either through the email address you have provided us, or by placing a prominent notice on our website.</p>
					<h3>Contact Us</h3>
					<p>If you have any questions about this Privacy Policy, please contact us.</p>
				</div>
			</div>
		</>
	);
};

export default Page500;