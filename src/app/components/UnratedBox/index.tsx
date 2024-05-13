'use client';

import { db, storage } from '../../../../firebase-config';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import Resizer from 'react-image-file-resizer';
import { addDoc, collection } from 'firebase/firestore';
import { Criteria, Item, Rating } from '@/app/lib/definitions';
import styles from './index.module.css';
import { useItemsStore } from '@/app/store/items-store';
import Image from 'next/image';

function UnratedBox({ tierlistid, criterias }: { tierlistid: string; criterias: Criteria[] }) {
	const { items, addItem, setSelectedItem } = useItemsStore((state) => state);
	const resizeFile = (file: File, extension: string) =>
		new Promise((resolve) => {
			Resizer.imageFileResizer(
				file,
				300,
				300,
				extension,
				80,
				0,
				(uri) => {
					resolve(uri);
				},
				'file'
			);
		});

	const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files ? event.target.files[0] : null;
		if (!file) return;
		const fileName = file.name.split('.');
		const extension = fileName[fileName.length - 1];
		if (extension.match(/^(jpg|png|jpeg|webp)$/)) {
			const initRating: Rating[] = [];
			criterias.forEach((criteria) => {
				initRating.push({ criteriaName: criteria.name, rate: 0 });
			});
			const newImage = await resizeFile(file, extension);
			const fileRef = ref(storage, `tierlist/${Date.now() + file.name}`);
			await uploadBytes(fileRef, newImage as File);
			const uploadedUrl = await getDownloadURL(fileRef);
			try {
				const docRef = collection(db, 'tierlists', tierlistid, 'items');
				const docSnapshot = await addDoc(docRef, {
					imageUrl: uploadedUrl,
					tiered: false,
					ratings: initRating,
				} as Item);
				addItem({
					imageUrl: uploadedUrl,
					tiered: false,
					ratings: initRating,
					id: docSnapshot.id,
				});
				console.log(docSnapshot);
			} catch (err) {
				console.error(err);
			}
		} else {
			console.log(`ceci n'est pas une image`);
		}
	};

	return (
		<div>
			<input type='file' onChange={handleFileChange} className={styles.upload} />
			<div className={styles.box}>
				{items &&
					items
						.filter((item) => item.tiered === false)
						.map((unratedItem) => (
							<Image
								src={unratedItem.imageUrl}
								alt=''
								className={styles.img}
								key={unratedItem.id}
								onClick={() => {
									setSelectedItem({ ...unratedItem, tiered: true });
								}}
								priority={false}
								width={150}
								height={150}
							/>
						))}
			</div>
		</div>
	);
}

export default UnratedBox;
