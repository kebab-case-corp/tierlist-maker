import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Item, Tierlist, User } from '../lib/definitions';
import { supabase } from '../lib/supabase/client';
import { deleteItem, deleteTierlist, fetchTierlists } from '../lib/data';
import { toast } from 'react-toastify';

interface TierlistState {
	user: User | null;
	tierlists: Tierlist[] | null;
	currentTierlist: Tierlist | null;
	currentItem: Item | null;
	setTierlists: (tierlist: Tierlist[]) => void;
	getAllTierlists: () => Promise<void>;
	setCurrentTierlist: (tierlist: Tierlist | null) => void;
	addNewTierlist: (tierlist: Omit<Tierlist, 'id'>) => Promise<Tierlist | null>;
	removeTierlist: (tierlist: Tierlist) => Promise<void>;
	addNewItem: (tierlistId: number, item: Item) => void;
	setCurrentItem: (item: Item | null) => void;
	updateScore: (criteriaId: number, newScore: number) => void;
	removeItem: (itemId: number) => Promise<void>;
	setUser: (user: User | null) => void;
	logout: () => void;
}

const useTierlistStore = create(
	persist<TierlistState>(
		(set, get) => ({
			user: null,
			tierlists: [],
			currentTierlist: null,
			currentItem: null,
			getAllTierlists: async () => {
				const user = get().user;
				if (!user) return;

				try {
					const tierlists = await fetchTierlists(user.id);
					if (tierlists) {
						set({ tierlists: tierlists });
					}
				} catch (error) {
					console.error(error);
				}
			},
			setCurrentTierlist: (tierlist) => set({ currentTierlist: tierlist }),
			setTierlists: (tierlists) => set({ tierlists }),
			addNewTierlist: async (tierlist: Omit<Tierlist, 'id' | 'created_at'>) => {
				try {
					const newTierlist = await supabase
						.from('tierlists')
						.insert({
							name: tierlist.name,
							description: tierlist.description,
							created_at: new Date().toISOString(),
							background_image: tierlist.background_image,
							user_id: tierlist.user_id,
						})
						.select(`*, items:items(*, scores(*)), criterias:criterias(*), tiers:tiers(*)`)
						.single();

					if (newTierlist.error) {
						throw newTierlist.error;
					}

					set((state) => ({
						tierlists: [...(state.tierlists as Tierlist[]), newTierlist.data],
					}));

					toast.success('Tier list créée avec succès!');
					return newTierlist.data;
				} catch (error) {
					console.error('Erreur lors de la création de la tier list:', error);
					toast.error('Erreur lors de la création de la tier list');
					return null;
				}
			},
			removeTierlist: async (tierlist) => {
				try {
					const error = await deleteTierlist(tierlist.id);

					if (error) {
						console.error('Error removing tier list:', error);
						return;
					}

					set((state) => ({
						tierlists: state.tierlists?.filter((t) => t.id !== tierlist.id),
					}));
				} catch (error) {
					console.error('Error removing tierlist:', error);
				}
			},
			addNewItem: (tierlistId, item) => {
				set((state) => ({
					tierlists: state.tierlists?.map((tierlist) => {
						if (tierlist.id === tierlistId) {
							return {
								...tierlist,
								items: [...tierlist.items, item],
							};
						}
						return tierlist;
					}),
				}));
			},
			setCurrentItem: (item) => set({ currentItem: item }),
			updateScore: (criteriaId, newScore) => {
				set((state) => {
					if (!state.currentItem || !state.currentTierlist) return {};

					const updateScores = state.currentItem.scores.map((score) =>
						score.criteria_id === criteriaId ? { ...score, score: newScore } : score
					);

					const updatedItem = {
						...state.currentItem,
						scores: updateScores,
						tiered: true,
					};

					const newItems = [...state.currentTierlist.items];

					const itemIndex = newItems.findIndex((item) => item.id === state.currentItem!.id);
					if (itemIndex === -1) {
						return {};
					}

					newItems[itemIndex] = updatedItem;

					const newCurrentTierlist = {
						...state.currentTierlist,
						items: newItems,
					};

					return {
						currentTierlist: newCurrentTierlist,
						currentItem: updatedItem,
					};
				});
			},
			removeItem: async (itemId) => {
				try {
					await deleteItem(itemId);
				} catch (error) {}
				set((state) => {
					if (!state.currentTierlist) return {};
					const items = [...state.currentTierlist.items];
					const itemIndex = items.findIndex((item) => item.id === itemId);
					if (itemIndex === -1) return {};
					items.splice(itemIndex, 1);
					const newCurrentTierlist = {
						...state.currentTierlist,
						items: items,
					};
					return {
						currentTierlist: newCurrentTierlist,
					};
				});
			},

			setUser: (user) => set({ user }),
			logout: () => set({ user: null, tierlists: [], currentTierlist: null }),
		}),
		{
			name: 'tierlist-storage',
		}
	)
);

export default useTierlistStore;
