'use client';

import styles from '@/app/components/TierList/index.module.css';
import { Item, Tierlist } from '@/app/lib/definitions';
import { useTierlistStore } from '@/app/store/tierlist-store';
import { useItemsStore } from '@/app/store/items-store';
import Image from 'next/image';
import { calculateItemScore } from '@/app/lib/utils';
import { db, storage } from '../../../../firebase-config';
import { deleteObject, ref } from 'firebase/storage';
import { collection, deleteDoc, doc } from 'firebase/firestore';

function TierList() {
	const { tierlist } = useTierlistStore((state) => state);
	const { items, selectedItem, setSelectedItem, removeItem } = useItemsStore((state) => state);

	const groupedItems = tierlist
		? groupItemsByTier(
				items.filter((item) => item.tiered === true),
				tierlist
		  )
		: {};

	const handleDeleteImg = (e: React.MouseEvent<HTMLButtonElement>, item: Item) => {
		const itemDocRef = doc(collection(db, 'tierlists', tierlist?.id as string, 'items'), item.id);
		const itemStorageRef = ref(storage, item.imageUrl);
		Promise.allSettled([deleteDoc(itemDocRef), deleteObject(itemStorageRef)]).then(
			() => removeItem(item.id as string),
			(error) => console.error(error)
		);
	};

	return (
		<div className={styles.tierlist}>
			{Object.entries(groupedItems).map(([tierName, tierItems]) => (
				<div key={tierName} className={styles.tier}>
					<h3 className={styles['tier-name']}>{tierName}</h3>
					<ul className={styles['items-wrapper']}>
						{tierItems.map((item) => (
							<li className={styles.item} key={item.id} onClick={() => setSelectedItem(item)}>
								<p className={styles.score}>
									{tierlist && calculateItemScore(item, tierlist?.criterias).toFixed(2)}
								</p>
								<button className={styles.delete} onClick={(e) => handleDeleteImg(e, item)}>
									x
								</button>
								<Image
									className={`${styles.img} ${selectedItem?.id === item.id && styles.selected}`}
									src={item.imageUrl}
									alt=''
									width={100}
									height={100}
									priority={false}
									unoptimized
								/>
							</li>
						))}
					</ul>
				</div>
			))}
		</div>
	);
}

export default TierList;

function groupItemsByTier(items: Item[], tierlist: Tierlist): Record<string, Item[]> {
	const sortedTiers = [...tierlist.tiers].sort((a, b) => a.max - b.max);

	const groupedItems: Record<string, Item[]> = {};
	sortedTiers.forEach((tier) => {
		groupedItems[tier.name] = [];
	});

	items.forEach((item) => {
		const score = calculateItemScore(item, tierlist.criterias);

		const assignedTier = sortedTiers.find((tier) => score <= tier.max);

		if (assignedTier) {
			groupedItems[assignedTier.name].push(item);
		}
	});

	Object.values(groupedItems).forEach((tierItems) => {
		tierItems.sort(
			(a, b) =>
				calculateItemScore(b, tierlist.criterias) - calculateItemScore(a, tierlist.criterias)
		);
	});

	const reversedGroupedItems: Record<string, Item[]> = {};
	sortedTiers.reverse().forEach((tier) => {
		reversedGroupedItems[tier.name] = groupedItems[tier.name];
	});

	return reversedGroupedItems;
}
