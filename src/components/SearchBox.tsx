import { useRef } from 'react';

import { useGlobeStore } from '../store/useGlobeStore';
import songs from '../data/songs.json';

export function SearchBox() {
	const inputRef = useRef<HTMLInputElement>(null);
	const setFocusCountry = useGlobeStore((s) => s.setFocusCountry);

	function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		const q = inputRef.current?.value?.trim();
		if (!q) return;
		setFocusCountry(q);
	}

	const suggestions = [...new Set(songs.map((s) => s.country))];

	return (
		<form onSubmit={onSubmit} className="pointer-events-auto mx-auto mt-6 w-[min(760px,92vw)]">
			<div className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 p-2 pl-3 backdrop-blur-md">
				<svg width="18" height="18" viewBox="0 0 24 24" className="opacity-70">
					<path d="M21 21l-4.35-4.35" stroke="#cfd8ff" strokeWidth="1.5" strokeLinecap="round" />
					<circle cx="11" cy="11" r="7" stroke="#cfd8ff" strokeWidth="1.5" />
				</svg>
				<input
					ref={inputRef}
					list="countries"
					placeholder="Search a country..."
					className="w-full bg-transparent outline-none placeholder:opacity-60"
				/>
				<button className="rounded-md bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15 transition">Go</button>
				<datalist id="countries">
					{suggestions.map((c) => (
						<option key={c} value={c} />
					))}
				</datalist>
			</div>
		</form>
	);
}


