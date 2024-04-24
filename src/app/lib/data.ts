import { collection, doc, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from '../../../firebase-config';
import { Tierlist } from './definitions';

export const getTierlists = async (userId: string) => {
	const q = query(
		collection(db, 'tierlists'),
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
	const docRef = doc(db, 'tierlists', tierlistid);
	const docSnapshot = await getDoc(docRef);
	return docSnapshot.exists()
		? (docSnapshot.data() as Tierlist)
		: Promise.reject(new Error('Tierlist not found'));
};
