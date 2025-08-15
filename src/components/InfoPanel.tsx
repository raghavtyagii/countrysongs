import { useEffect, useMemo, useState } from 'react';
import songs from '../data/songs.json';
import { useGlobeStore } from '../store/useGlobeStore';

type SongEntry = {
	country: string;
	title?: string;
	artist?: string;
	spotifyUrl?: string;
	coverImage?: string; // optional override/cache
	song?: string; // backward compat e.g., "Artist — Title"
	url?: string; // backward compat
};

function toSpotifyEmbed(url: string | undefined): string | null {
	if (!url) return null;
	try {
		const u = new URL(url);
		// Expect /track/{id}
		const parts = u.pathname.split('/').filter(Boolean);
		const idx = parts.findIndex((p) => p === 'track');
		if (idx >= 0 && parts[idx + 1]) return `https://open.spotify.com/embed/track/${parts[idx + 1]}?theme=0`;
		return `https://open.spotify.com/embed?uri=${encodeURIComponent(url)}`; // generic fallback
	} catch {
		return null;
	}
}

function parseSong(e: SongEntry) {
	// Back-compat parser: "Artist — Title" or "Artist - Title"
	const s = e.song || '';
	const parts = s.split(/—|-/);
	if (parts.length >= 2) {
		return { artist: parts[0].trim(), title: parts.slice(1).join('-').trim() };
	}
	return { artist: e.artist || '', title: e.title || '' };
}

export function InfoPanel() {
	const selected = useGlobeStore((s) => s.selected);
	const setSelected = useGlobeStore((s) => s.setSelected);
    const total = useGlobeStore((s) => s.totalCountryCount);
	const [thumbUrl, setThumbUrl] = useState<string | null>(null);
    const done = useMemo(() => new Set((songs as SongEntry[]).map((s) => s.country)).size, []);

	function norm(s: string) {
		return s
			.normalize('NFKD')
			.replace(/\p{Diacritic}/gu, '')
			.replace(/[^a-z0-9 ]+/gi, ' ')
			.replace(/\s+/g, ' ')
			.trim()
			.toLowerCase();
	}

	const entry = useMemo<SongEntry | null>(() => {
		if (!selected) return null;
		const wanted = norm(selected.countryName);
		const e = (songs as SongEntry[]).find((s) => norm(s.country) === wanted);
		return e || null;
	}, [selected]);

	const resolvedUrl = entry?.spotifyUrl || entry?.url;
	const embedUrl = useMemo(() => toSpotifyEmbed(resolvedUrl || undefined), [resolvedUrl]);

	// Fetch cover image via Spotify oEmbed for better tile preview when no embed
	useEffect(() => {
		let cancelled = false;
		async function run() {
			if (!entry) return setThumbUrl(null);
			if (entry.coverImage) return setThumbUrl(entry.coverImage);
			if (resolvedUrl) {
				try {
					const r = await fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(resolvedUrl)}`);
					const j = await r.json();
					if (!cancelled) setThumbUrl(j.thumbnail_url || null);
					return;
				} catch {}
			}
			// Fallback placeholder
			setThumbUrl(null);
		}
		run();
		return () => {
			cancelled = true;
		};
	}, [entry]);

	return (
		<div className="info-panel pointer-events-auto">
			<div className="panel-surface">
				<div className="panel-header">
					<div className="panel-country">{selected ? selected.countryName : 'Click a country to view the song'}</div>
					{selected && (
						<button className="panel-clear" onClick={() => setSelected(null)}>Clear</button>
					)}
				</div>
				{selected && <div className="panel-divider" />}
				{selected && (
					<div className="panel-body">
						{entry ? (
							embedUrl ? (
								<div className="embed-card">
									<iframe
										className="embed-frame"
										src={embedUrl}
										width="100%"
										height="152"
										allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
										loading="lazy"
										title="Spotify player"
									/>
								</div>
							) : (
								<a
									href={resolvedUrl || `https://open.spotify.com/search/${encodeURIComponent(`${entry.title || ''} ${entry.artist || ''}`.trim())}`}
									target="_blank"
									rel="noreferrer"
									className="tile-link"
								>
									<div className="tile">
										<div className="tile-art" style={{ backgroundImage: thumbUrl ? `url(${thumbUrl})` : undefined }} />
										<div className="tile-text">
											<div className="tile-title">{entry.title || parseSong(entry).title || 'Unknown Title'}</div>
											<div className="tile-artist">{entry.artist || parseSong(entry).artist || 'Unknown Artist'}</div>
										</div>
									</div>
								</a>
							)
						) : (
							<div className="panel-line">No song yet</div>
						)}
                        <div className="panel-meta">{done}/{total || '…'} Countries Done</div>
					</div>
				)}
			</div>
		</div>
	);
}


