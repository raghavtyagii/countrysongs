import { useEffect, useMemo, useRef, useState } from 'react';
import Globe, { type GlobeMethods } from 'react-globe.gl';
import { useGlobeStore } from '../store/useGlobeStore';
// import { HoverCard } from './HoverCard';

// Minimal GeoJSON feature type to avoid relying on external @types/geojson
type Feature = {
	type: 'Feature';
	properties?: { name?: string };
	geometry:
		| { type: 'Polygon'; coordinates: number[][][] }
		| { type: 'MultiPolygon'; coordinates: number[][][][] };
};

export function GlobeScene() {
	const globeRef = useRef<GlobeMethods | undefined>(undefined);
	const [countries, setCountries] = useState<Feature[]>([]);
	const [hovered, setHovered] = useState<Feature | null>(null);
	const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
    const setHover = useGlobeStore((s) => s.setHover);
    const setTotalCountryCount = useGlobeStore((s) => s.setTotalCountryCount);
	const selected = useGlobeStore((s) => s.selected);
	const setSelected = useGlobeStore((s) => s.setSelected);
	const focusCountry = useGlobeStore((s) => s.focusCountry);

	useEffect(() => {
        fetch('https://raw.githubusercontent.com/vasturiano/globe.gl/master/examples/datasets/ne_110m_admin_0_countries.geojson')
			.then((res) => res.json())
			.then((geo: any) => {
				const feats = (geo.features as Feature[]).filter(Boolean);
				setCountries(feats);
                setTotalCountryCount(feats.length);
			})
			.catch(() => {
				// Fallback source if GitHub raw throttles
				fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson')
					.then((r) => r.json())
                    .then((geoAlt: any) => {
                        const feats = (geoAlt.features || []) as Feature[];
                        setCountries(feats);
                        setTotalCountryCount(feats.length);
                    });
			});
	}, []);

	// Focus camera when user searches
	useEffect(() => {
		if (!focusCountry || !globeRef.current) return;
		const feat = countries.find(
			(f) => (f.properties?.name || '').toLowerCase() === focusCountry.toLowerCase(),
		);
		if (!feat) return;
		const [lng, lat] = getFeatureCentroid(feat);
		globeRef.current.pointOfView({ lat, lng, altitude: 1.5 }, 1200);
	}, [focusCountry, countries]);

	const polygonsData = useMemo(() => countries, [countries]);

	return (
		<div className="globe-stage">
			<Globe
				ref={globeRef as unknown as React.MutableRefObject<GlobeMethods>}
				width={window.innerWidth}
				height={window.innerHeight}
				backgroundColor="rgba(0,0,0,0)"
				globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
				bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
				showAtmosphere={true}
				atmosphereColor="#4c7cff"
				atmosphereAltitude={0.18}
				// controls will allow wheel zoom by default; tweak via control options below
				polygonsData={polygonsData}
				polygonCapColor={(d) => {
					const isHovered = d === hovered;
					const isSelected = d === selectedFeature || getCountryName((d as any).properties) === (selected?.countryName || '');
					if (isSelected) return 'rgba(160,210,255,0.75)';
					return isHovered ? 'rgba(120,170,255,0.65)' : 'rgba(170,200,255,0.25)';
				}}
				polygonSideColor={() => 'rgba(120,150,255,0.28)'}
				polygonStrokeColor={(d) => {
					const isSelected = d === selectedFeature || getCountryName((d as any).properties) === (selected?.countryName || '');
					return isSelected ? 'rgba(210, 230, 255, 0.95)' : 'rgba(190, 210, 255, 0.75)';
				}}
				polygonAltitude={(d) => {
					const isHovered = d === hovered;
					const isSelected = d === selectedFeature || getCountryName((d as any).properties) === (selected?.countryName || '');
					return isSelected ? 0.025 : isHovered ? 0.02 : 0.006;
				}}
				enablePointerInteraction={true}
				onPolygonHover={(poly) => {
					if (!poly) {
						setHovered(null);
						return setHover(null);
					}
					setHovered(poly as Feature);
					const props = (poly as any).properties || {};
					const centroid = getFeatureCentroid(poly as Feature);
					setHover({ countryName: getCountryName(props), centroid });
				}}
				onPolygonClick={(poly) => {
					const props = (poly as any).properties || {};
					const centroid = getFeatureCentroid(poly as Feature);
					const info = { countryName: getCountryName(props), centroid } as const;
					// toggle selection
					if (selected && selected.countryName === info.countryName) {
						setSelected(null);
						setSelectedFeature(null);
					} else {
						setHover(info);
						setSelected(info);
						setSelectedFeature(poly as Feature);
					}
				}}
				polygonsTransitionDuration={200}
				animateIn={true}
			/>
			{/* On-globe tooltip removed per design; right-side panel is the single source of truth */}
		</div>
	);
}

// Helpers
function getFeatureCentroid(feature: Feature): [number, number] {
	const coords: [number, number][] = [];
	const geom = feature.geometry;
	function pushRing(ring: number[][]) {
		ring.forEach(([lng, lat]) => coords.push([lng, lat]));
	}
	if (geom.type === 'Polygon') geom.coordinates.forEach(pushRing);
	if (geom.type === 'MultiPolygon') geom.coordinates.forEach((poly) => poly.forEach(pushRing));
	const lng = coords.reduce((a, c) => a + c[0], 0) / coords.length;
	const lat = coords.reduce((a, c) => a + c[1], 0) / coords.length;
	return [lng, lat];
}

function getCountryName(props: Record<string, unknown>): string {
	return (
		(String(props?.name) ||
			String((props as any)?.NAME) ||
			String((props as any)?.ADMIN) ||
			'Unknown')
	);
}

// removed screen projection helper (tooltip now lives in right panel)


