// Local Code
import Logo from './Graphics/Logo';

const TopBar = (): JSX.Element => {
	return (
		<div className='TopBar'>
			<div className='Menu'>
				<a rel='nofollow' tabIndex={0} className='Button' href='/games'>
					<h3>Games</h3>
				</a>
				<a rel='nofollow' tabIndex={0} className='Button' href='/challenges'>
					<h3>Challenges</h3>
				</a>
				<a rel='nofollow' tabIndex={0} className='Button' href='/account'>
					<h3>Account</h3>
				</a>
			</div>
			<a rel='nofollow' tabIndex={1} className='Title' style={{ opacity: 1 }} href='/'>
				<div style={{alignSelf: 'center'}}>
					<Logo size='3.5em' color='blue' />
				</div>
				<h1>RTL Challenges</h1>
			</a>
		</div>
	);
};

export default TopBar;