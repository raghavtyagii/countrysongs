export function TopHeader() {
	return (
		<header className="site-header">
			<div className="site-header-surface">
				<div className="site-header-row">
					<div className="site-menu">
						<div className="howto">
							<button className="howto-trigger">How to use</button>
							<div className="howto-panel">
								<div className="panel-surface">
									<div className="panel-title">How to use</div>
									<div className="panel-body">
										<div className="panel-line">Hover over a country to check the song.</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="site-title">RT's Favourite Songs</div>
					<div className="site-spacer" />
				</div>
			</div>
		</header>
	);
}


