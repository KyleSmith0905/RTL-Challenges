// Firebase
import { DocumentSnapshot } from 'firebase/firestore';
import { Auth, sendEmailVerification } from 'firebase/auth';

interface Input {
	userDatabase?: DocumentSnapshot;
	auth?: Auth;
	accountPage?: boolean;
	setUserDatabase?: (userDatabase: DocumentSnapshot) => void;
}

const NoSignedIn: React.FC<Input> = ({ userDatabase, auth, accountPage, setUserDatabase}: Input): JSX.Element => {
	const userData = userDatabase?.data();
	return (
		<div className = {accountPage ? '' : 'MainPanel'}>
			{auth.currentUser && userData ? (
				<div className='Box'>
					<h2>Signed In</h2>
					<p>You are signed in as {userData.username ?? userDatabase?.id?.substring(0,16)}</p>
					<p>To perform certain actions, you must verify your email.</p>
					<button onClick={() => sendEmailVerification(auth.currentUser)}>
						<h3>Send Verification Email</h3>
					</button>
					{accountPage && <button onClick={() => {
						auth.signOut();
						setUserDatabase(undefined);
					}}>
						<h3>Sign Out</h3>
					</button>}
				</div>
			) : (
				<div className='Box'>
					<h2>You are not signed in</h2>
					<p>Signing in allows you to:</p>
					<ul>
						<li>Create challenges</li>
						<li>Personalize account</li>
					</ul>
					<div className='Menu'>
						<a className='Button' href='account/log-in'>
							<h3>Log In</h3>
						</a>
						<a className='Button' href='account/register'>
							<h3>Register</h3>
						</a>
					</div>
				</div>
			)}
		</div>
	);
};

export default NoSignedIn;