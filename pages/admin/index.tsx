// Framework
import Head from 'next/head';
import { useEffect, useState } from 'react';
// Firebase
import { onAuthStateChanged } from '@firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
// Local Code
import NoPermissions from '../../component/NoPermissions';
import NoSignedIn from '../../component/NoSignedIn';
import { auth, firestore } from '../../lib/Firebase';

const AdminPage = (): JSX.Element => {  
	const [user, setUser] = useState(auth?.currentUser);
	const [loading, setLoading] = useState(true);
	onAuthStateChanged(auth, doc => {
		if (doc) setUser(doc);
		else setLoading(false);
	});
	const userDocReference = user?.uid ? doc(firestore, 'users', user.uid) : null;
	const [userDatabase, setUserDatabase] = useState(null);
	const [initialize, setInitialize] = useState(false);
	useEffect(() => {
		if (initialize || !userDocReference) return;
		setInitialize(true);
		getDoc(userDocReference).then(doc => {
			setUserDatabase(doc.data());
		})
			.finally(() => setLoading(false));
	}, [userDocReference]);
  
	const LocalHeader = (): JSX.Element => {
		const title = 'Site Admin Panel - RTL Challenges';
		const description = 'RTL Challenges admin site panel to moderate the content of the site. This contains a ton of tools to moderate our content.';
		return (
			<Head>
				<meta name='robots' content='noindex' />
				<title>Site Admin Panel - RTL Challenges</title>
				<meta name='description' content={description} />
				<meta property='og:title' content={title} />
				<meta property='og:description' content={description} />
				<meta name='twitter:title' content={title} />
				<meta name='twitter:description' content={description} />
			</Head>
		);
	};
  
	if (loading) return <LocalHeader />;
	else if (!auth?.currentUser || !userDatabase) return (
		<>
			<LocalHeader />
			<NoSignedIn auth={auth} userDatabase={userDatabase} />
		</>
	);
	else if (!userDatabase.adminLevel) return (
		<>
			<LocalHeader />
			<NoPermissions theirAdminLevel={userDatabase.data().adminLevel ?? '0'} requiredAdminLevel={'1'} />
		</>
	);
	return (
		<>
			<LocalHeader />
			<div className='MainPanel'>
				<div className='Box'>
					<h2>Admin Page</h2>
					<p>Welcome {userDatabase.username}, you are admin level {userDatabase.adminLevel}.</p>
				</div>
				<div className='Box'>
					<h2>Your Admin Duties</h2>
					<a className='InnerBox Button' href='/admin/challenges'>
						<h3>Moderate Challenges</h3>
						<p>Shuffle through new challenges and warn users for malicious posting.</p>
						<p>Report challenges and punish users for posting wrong challenges, people with high number of reports or obvious malicious content will be banned from posting.</p>
					</a>
				</div>
			</div>
		</>
	);
};

export default AdminPage;