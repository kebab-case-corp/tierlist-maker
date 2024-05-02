import { create } from 'zustand';
import { Tierlist } from '../lib/definitions';

interface TierlistState {
	tierlist: Tierlist | null;
}

interface TierlistActions {
	setTierlist: (tl: Tierlist) => void;
}

export const useTierlistStore = create<TierlistState & TierlistActions>((set) => ({
	tierlist: null,
	setTierlist: (tl) => set((state) => ({ tierlist: tl })),
}));
