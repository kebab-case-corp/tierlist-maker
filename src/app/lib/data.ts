import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	orderBy,
	query,
	updateDoc,
	where,
} from 'firebase/firestore';
import { db } from '../../../firebase-config';
import { Item, Tierlist } from './definitions';

const tierlistsCollectionRef = collection(db, 'tierlists');

export const getTierlists = async (userId: string) => {
	const q = query(
		tierlistsCollectionRef,
		where('userId', '==', userId),
		orderBy('createdAt', 'desc')
	);
	const querySnapshot = await getDocs(q);
	const tl: Tierlist[] = [];
	querySnapshot.forEach((doc) => {
		tl.push({ id: doc.id, ...doc.data() } as Tierlist);
	});
	return tl;
};

export const getTierlist = async (tierlistid: string) => {
	const docRef = doc(tierlistsCollectionRef, tierlistid);
	const docSnapshot = await getDoc(docRef);
	return docSnapshot.exists()
		? (docSnapshot.data() as Tierlist)
		: Promise.reject(new Error('Tierlist not found'));
};

export const addNewTierlist = async (newTierlist: Omit<Tierlist, 'id'>) => {
	const docRef = await addDoc(tierlistsCollectionRef, newTierlist);
	return { id: docRef.id, ...newTierlist };
};

const getItemsCollectionRef = (tierlistid: string) =>
	collection(db, 'tierlists', tierlistid, 'items');

export const getItemsFromTierlist = async (tierlistid: string) => {
	const itemsRef = getItemsCollectionRef(tierlistid);
	const querySnapshot = await getDocs(query(itemsRef));
	if (querySnapshot.empty) {
		return Promise.reject(new Error('No items found for this tierlist'));
	}
	return querySnapshot.docs.map((doc) => ({
		id: doc.id,
		...(doc.data() as Item),
	}));
};

export const addNewItem = async (tierlistid: string, newItem: Omit<Item, 'id'>) => {
	const itemsRef = getItemsCollectionRef(tierlistid);
	const docRef = await addDoc(itemsRef, newItem);
	return { id: docRef.id, ...newItem };
};

export const updateItem = async (
	tierlistid: string,
	itemId: string,
	updatedData: Partial<Item>
) => {
	const docRef = doc(getItemsCollectionRef(tierlistid), itemId);
	await updateDoc(docRef, updatedData);
};

export const deleteItem = async (tierlistid: string, itemId: string) => {
	const docRef = doc(getItemsCollectionRef(tierlistid), itemId);
	await deleteDoc(docRef);
};
