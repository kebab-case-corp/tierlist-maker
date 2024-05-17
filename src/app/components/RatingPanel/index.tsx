'use client';

import RatingSlider from '../RatingSlider';
import styles from '@/app/components/RatingPanel/index.module.css';
import { collection, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../firebase-config';
import { useTierlistStore } from '@/app/store/tierlist-store';
import { useItemsStore } from '@/app/store/items-store';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Item } from '@/app/lib/definitions';
import Image from 'next/image';
import { calculateItemScore } from '@/app/lib/utils';

type RatingPanelPropsType = {
	tierlistId: string;
};

function RatingPanel({ tierlistId }: RatingPanelPropsType) {
	const { selectedItem, setSelectedItem } = useItemsStore((state) => state);
	const criterias = useTierlistStore((state) => state.tierlist?.criterias);
	const prevItemRef = useRef<typeof selectedItem | null>(null);
	const [hasChanges, setHasChanges] = useState(false);
	const score = useMemo(() => {
		if (selectedItem && criterias) {
			return calculateItemScore(selectedItem, criterias).toFixed(2);
		}
		return 0;
	}, [selectedItem, criterias]);

	const handleClick = () => {
		try {
			if (selectedItem) {
				const tierlistRef = collection(db, 'tierlists');
				const docRef = doc(collection(tierlistRef, tierlistId, 'items'), selectedItem?.id);
				const updatedItem = selectedItem;
				updatedItem.tiered = true;
				setSelectedItem(null);
				const docSnapshot = updateDoc(docRef, updatedItem as any);
			}
		} catch (err) {
			console.error(err);
		}
	};
	useEffect(() => {
		const saveItem = async (item: Item) => {
			const tierlistRef = collection(db, 'tierlists');
			const docRef = doc(collection(tierlistRef, tierlistId, 'items'), item.id);

			try {
				await updateDoc(docRef, item as any);
				setHasChanges(false);
			} catch (err) {
				console.error("Erreur lors de la mise à jour de l'item", err);
			}
		};

		if (
			hasChanges &&
			prevItemRef.current &&
			selectedItem &&
			prevItemRef.current.id !== selectedItem.id
		) {
			saveItem(prevItemRef.current);
		}

		prevItemRef.current = selectedItem;
	}, [selectedItem, tierlistId, hasChanges]);
	return (
		<div className={styles.container}>
			<Image
				src={selectedItem ? selectedItem.imageUrl : 'https://placehold.co/30'}
				alt=''
				className={styles.image}
				width={300}
				height={300}
				unoptimized
			/>

			{criterias?.map((criteria, i) => (
				<RatingSlider
					criteria={criteria}
					index={i}
					key={i}
					setHasChanges={setHasChanges}></RatingSlider>
			))}

			<div className={styles.wrapper}>
				<p className={styles['total-rating']}>{score}</p>
				<button
					className={styles.button}
					onClick={handleClick}
					disabled={selectedItem ? false : true}>
					Ajouter
				</button>
			</div>
		</div>
	);
}

export default RatingPanel;
