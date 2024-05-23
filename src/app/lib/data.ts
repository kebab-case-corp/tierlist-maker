import { supabase } from '@/app/lib/supabase/client';
import { Item, Score, Tierlist } from '@/app/lib/definitions';
import { toast } from 'react-toastify';
import { resizeFile } from './utils';
import { PostgrestError } from '@supabase/supabase-js';

export const fetchTierlists = async (userId: string): Promise<Tierlist[] | null> => {
	try {
		const { data, error } = await supabase
			.from('tierlists')
			.select(`*, tiers(*), criterias(*), items(*, scores(*))`)
			.eq('user_id', userId);

		if (error) {
			console.error('Erreur lors de la récupération des tierlists:', error);
			toast.error('Erreur lors de la récupération des tierlists');

			return null;
		}

		return data;
	} catch (error) {
		console.error('Erreur lors de la récupération des tierlists:', error);
		return null;
	}
};

export const uploadImageToStorage = async (
	file: File,
	folder: 'backgrounds' | 'items'
): Promise<string | undefined> => {
	try {
		const size = folder === 'backgrounds' ? 300 : 200;
		const resizedFile = (await resizeFile(file, size, size)) as File;
		const fileExtension = file.name.split('.').pop();
		const fileName = `${crypto.randomUUID()}.${fileExtension}`;

		const { data, error } = await supabase.storage
			.from(`tierlists/${folder}`)
			.upload(fileName, resizedFile);

		if (error) {
			console.error("Erreur lors du téléchargement de l'image :", error);
			toast.error("Erreur lors du téléchargement de l'image");
			return undefined;
		}

		const { data: url } = await supabase.storage
			.from(`tierlists/${folder}`)
			.getPublicUrl(data.path);

		return url.publicUrl;
	} catch (error) {
		console.error("Erreur lors du téléchargement de l'image :", error);
		toast.error("Erreur lors du téléchargement de l'image");
		return undefined;
	}
};

export const createTierlist = async (
	tierlist: Omit<Tierlist, 'id' | 'created_at'>
): Promise<Tierlist | null> => {
	try {
		const { data, error } = await supabase
			.from('tierlists')
			.insert({ ...tierlist, created_at: new Date().toISOString() })
			.select(`*, items:items(*), criterias:criterias(*), tiers:tiers(*)`)
			.single();

		if (error) {
			console.error('Erreur lors de la création de la tier list:', error);
			return null;
		}

		return data;
	} catch (error) {
		console.error('Erreur lors de la création de la tier list:', error);
		return null;
	}
};

export const updateTierlist = async (tierlist: Tierlist): Promise<Tierlist | null> => {
	try {
		const { data, error } = await supabase
			.from('tierlists')
			.update({ ...tierlist })
			.eq('id', tierlist.id)
			.select(`*, items:items(*), criterias:criterias(*), tiers:tiers(*)`)
			.single();

		if (error) {
			console.error('Erreur lors de la mise à jour de la tier list:', error);
			return null;
		}

		return data;
	} catch (error) {
		console.error('Erreur lors de la mise à jour de la tier list:', error);
		return null;
	}
};

export const deleteTierlist = async (tierlistId: number): Promise<PostgrestError | null> => {
	try {
		const { error } = await supabase.from('tierlists').delete().eq('id', tierlistId);

		if (error) {
			throw error;
		}
		return null;
	} catch (error) {
		console.error('Erreur lors de la suppression de la tier list:', error);
		throw error;
	}
};

export const createItem = async (imageFile: File, tierlistId: number): Promise<Item | null> => {
	try {
		const item: Partial<Item> = {};
		const imageUrl = await uploadImageToStorage(imageFile, 'items');
		item.image_url = imageUrl;
		item.tiered = false;
		item.tierlist_id = tierlistId;
		const { data, error } = await supabase.from('items').insert(item).select().single();
		if (error) return null;
		return data;
	} catch (error) {
		toast.error(("Erreur lors de la creation d'item" + error) as string);
		return null;
	}
};

export const updateScores = async (scores: Score[]) => {
	try {
		for (const score of scores) {
			const { error } = await supabase
				.from('scores')
				.update({ score: score.score })
				.eq('id', score.id);
			if (error)
				toast.error("Erreur lors de la mise à jour d'un score id:" + score.id + error.message);
		}
	} catch (error) {
		toast.error('Erreur lors de la mise à jour des scores');
	}
};

export const updateItem = async (item: Item) => {
	try {
		const { error } = await supabase
			.from('items')
			.update({ image_url: item.image_url, tiered: true, tierlist_id: item.tierlist_id })
			.eq('id', item.id);
		if (error) toast.error("Erreur lors de la mise à jour de l'item: " + error.message);
	} catch (error) {
		toast.error("Erreur lors de la mise à jour de l'item");
	}
};

export const deleteItem = async (itemId: number) => {
	try {
		const { error } = await supabase.from('items').delete().eq('id', itemId);
		if (error) toast.error("Erreur lors de la suppression d'item");
	} catch (error) {
		toast.error("Erreur lors de la suppression d'item");
	}
};
