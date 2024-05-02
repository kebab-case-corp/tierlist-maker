import { create } from 'zustand';
import { Item } from '../lib/definitions';

interface ItemState {
	items: Item[];
	selectedItem: Item | null;
	setSelectedItem: (item: Item | null) => void;
	updateRating: (criteriaName: string, newRate: number) => void;

	setItems: (item: Item[]) => void;
	addItem: (item: Item) => void;
	updateItem: (id: string, updatedFields: Partial<Item>) => void;
	removeItem: (id: string) => void;
}

export const useItemsStore = create<ItemState>((set) => ({
	items: [],
	selectedItem: null,

	setSelectedItem: (item) => set({ selectedItem: item }),
	setItems: (items) => set({ items }),

	addItem: (item) => set((state) => ({ items: [...state.items, item] })),

	updateItem: (id, updatedFields) =>
		set((state) => ({
			items: state.items.map((item) => (item.id === id ? { ...item, ...updatedFields } : item)),
		})),

	removeItem: (id) =>
		set((state) => ({
			items: state.items.filter((item) => item.id !== id),
		})),

	updateRating: (criteriaName, newRate) => {
		set((state) => {
			if (!state.selectedItem) return {}; // Si aucun item n'est sélectionné, ne rien faire

			// Mettre à jour le tableau des ratings
			const updatedRatings = state.selectedItem.ratings.map((rating) =>
				rating.criteriaName === criteriaName ? { ...rating, rate: newRate } : rating
			);

			// Mettre à jour l'item sélectionné
			const updatedItem = { ...state.selectedItem, ratings: updatedRatings };

			// Remplacer l'item dans la liste des items
			const updatedItems = state.items.map((item) =>
				item.id === updatedItem.id ? updatedItem : item
			);

			return {
				selectedItem: updatedItem,
				items: updatedItems,
			};
		});
	},
}));
