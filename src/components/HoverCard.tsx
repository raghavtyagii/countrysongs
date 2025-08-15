import { AnimatePresence, motion } from 'framer-motion';
import songs from '../data/songs.json';

export function HoverCard({ country }: { country: string }) {
	const entry = songs.find((s) => s.country === country);

	return (
		<AnimatePresence>
			{country && (
				<motion.div
					initial={{ opacity: 0, y: 8, scale: 0.98 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					exit={{ opacity: 0, y: 8, scale: 0.98 }}
					transition={{ type: 'spring', stiffness: 300, damping: 24 }}
					className="rounded-2xl border border-white/10 bg-white/7 backdrop-blur-2xl p-3.5 shadow-[0_12px_50px_rgba(0,8,20,0.55)] ring-1 ring-white/5"
				>
					<div className="text-[13px] font-semibold tracking-wide text-white [text-shadow:0_1px_0_rgba(0,0,0,0.25)]">{country}</div>
					<div className="mt-1 text-[11px] text-white/75">{entry ? entry.song : 'No song yet'}</div>
					{entry?.url && (
            <a
							href={entry.url}
							target="_blank"
							rel="noreferrer"
							className="mt-2 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] text-white/90 hover:bg-white/15 transition shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]"
						>
							Listen
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none">
								<path d="M7 17L17 7M17 7H9M17 7v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
							</svg>
						</a>
					)}
				</motion.div>
			)}
		</AnimatePresence>
	);
}


