export function HeaderBar({ visible }: { visible: boolean }) {
	return (
		<div
			className="headerbar"
			style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(-12px)' }}
		>
			<div className="headerbar-surface">
				<div className="headerbar-title">RT's Favourite Songs</div>
			</div>
		</div>
	);
}


