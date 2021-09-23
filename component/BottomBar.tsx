const TopBar = (): JSX.Element => {
	return (
		<>
			<div className='BottomBar'>
				<div className='Menu'>
					<p><a rel='nofollow' href='/privacy' tabIndex={-1} className='HoverUnderline'>Privacy Policy</a></p>
					<p><a rel='nofollow' href='/discord' tabIndex={-1} className='HoverUnderline'>Our Discord</a></p>
				</div>
			</div>
		</>
	);
};

export default TopBar;