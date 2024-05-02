import { create } from 'zustand';
import { Tierlist } from '../lib/definitions';

export interface TierlistsStore {
	tierlists: Tierlist[];
	setTierlists: (tierlists: Tierlist[]) => void;
	addTierlist: (tierlist: Tierlist) => void;
	removeTierlist: (tierlistId: string) => void;
	updateTierlist: (updatedTierlist: Tierlist) => void;
}

export const useTierlistsStore = create<TierlistsStore>((set) => ({
	tierlists: [],
	setTierlists: (tierlists) => set({ tierlists }),
	addTierlist: (tierlist) => set((state) => ({ tierlists: [...state.tierlists, tierlist] })),
	removeTierlist: (tierlistId) =>
		set((state) => ({
			tierlists: state.tierlists.filter((t) => t.id !== tierlistId),
		})),
	updateTierlist: (updatedTierlist) =>
		set((state) => ({
			tierlists: state.tierlists.map((t) => (t.id === updatedTierlist.id ? updatedTierlist : t)),
		})),
}));
