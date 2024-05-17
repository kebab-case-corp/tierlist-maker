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
import { db, storage } from '../../../firebase-config';
import { Item, Tierlist } from './definitions';
import { deleteObject, ref } from 'firebase/storage';

const tierlistsCollectionRef = collection(db, 'tierlists');

export const getTierlists = async (userId: string) => {
	const querySnapshot = await getDocs(
		query(tierlistsCollectionRef, where('userId', '==', userId), orderBy('createdAt', 'desc'))
	);

	const tierlists: Tierlist[] = [];
	querySnapshot.forEach((document) => {
		tierlists.push({ id: document.id, ...document.data() } as Tierlist);
	});

	return tierlists;
};

export const getTierlist = async (tierlistid: string) => {
	const docSnapshot = await getDoc(doc(tierlistsCollectionRef, tierlistid));
	if (docSnapshot.exists()) {
		return docSnapshot.data() as Tierlist;
	} else {
		throw new Error('Tierlist not found');
	}
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

export const deleteTierlistAndFiles = async (tierlistid: string) => {
	const docRef = doc(tierlistsCollectionRef, tierlistid);
	const itemsRef = getItemsCollectionRef(tierlistid);
	const querySnapshot = await getDocs(itemsRef);
	querySnapshot.forEach((doc) => {
		deleteObject(ref(storage, doc.data().imageUrl));
	});
	await deleteDoc(docRef);
};
