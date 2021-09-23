interface Input {
  requiredAdminLevel?: string;
  theirAdminLevel?: string;
}

const NoPermissions: React.FC<Input> = ({ requiredAdminLevel, theirAdminLevel}: Input): JSX.Element => {
	return (
		<div className='MainPanel'>
			<div className='Box'>
				<h2>Invalid Permission</h2>
				<p>You do not have permission to see this page. You have admin level {theirAdminLevel}, you must have admin level {requiredAdminLevel} or over to access this page.</p>
				<div className='Menu'>
					<a rel='nofollow' tabIndex={0} className='Button' href='/account'>
						<h3>Account Page</h3>
					</a>
				</div>
			</div>
		</div>
	);
};

export default NoPermissions;