'use client';

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import TierList from '@/app/components/TierList';
import RatingPanel from '@/app/components/RatingPanel';
import { getItemsFromTierlist, getTierlist } from '@/app/lib/data';
import UnratedBox from '@/app/components/UnratedBox';
import styles from './index.module.css';
import { useTierlistStore } from '@/app/store/tierlist-store';
import { useItemsStore } from '@/app/store/items-store';

function Page() {
	const { tierlistid } = useParams<{ tierlistid: string }>();
	const [loading, setLoading] = useState(true);
	const setItems = useItemsStore((state) => state.setItems);
	const { tierlist, setTierlist } = useTierlistStore((state) => state);

	useEffect(() => {
		const fetchTierlistAndItems = async () => {
			setLoading(true);
			try {
				const fetchedTierlist = await getTierlist(tierlistid);
				setTierlist(fetchedTierlist);
				const fetchedItems = await getItemsFromTierlist(tierlistid);
				setItems(fetchedItems);
			} catch (error) {
				console.error('Fetch tierlist error:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchTierlistAndItems();
	}, [tierlistid, setTierlist, setItems]);

	if (loading) return <div>Loading</div>;
	return (
		tierlist && (
			<div className={styles.container}>
				<h1>{tierlist.name}</h1>
				<div className={styles.wrapper}>
					<TierList />
					<RatingPanel tierlistId={tierlistid}></RatingPanel>
				</div>
				<UnratedBox tierlistid={tierlistid} criterias={tierlist.criterias}></UnratedBox>
			</div>
		)
	);
}

export default Page;
