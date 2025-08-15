import { create } from 'zustand';

export type HoverInfo = {
	countryName: string;
	centroid: [number, number];
} | null;

type State = {
	hover: HoverInfo;
	setHover: (h: HoverInfo) => void;
	selected: HoverInfo;
	setSelected: (s: HoverInfo) => void;
	focusCountry: string | null;
	setFocusCountry: (name: string | null) => void;
    totalCountryCount: number;
    setTotalCountryCount: (n: number) => void;
};

export const useGlobeStore = create<State>((set) => ({
	hover: null,
	setHover: (h) => set({ hover: h }),
	selected: null,
	setSelected: (s) => set({ selected: s }),
	focusCountry: null,
	setFocusCountry: (name) => set({ focusCountry: name }),
    totalCountryCount: 0,
    setTotalCountryCount: (n) => set({ totalCountryCount: n }),
}));


