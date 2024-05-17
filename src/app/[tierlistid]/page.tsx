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
import { toast } from 'react-toastify';
import { useAuth } from '../lib/hooks';

function Page() {
	const { tierlistid } = useParams<{ tierlistid: string }>();
	const [loading, setLoading] = useState(true);
	const setItems = useItemsStore((state) => state.setItems);
	const { tierlist, setTierlist } = useTierlistStore((state) => state);
	const user = useAuth();

	useEffect(() => {
		const fetchTierlistAndItems = async () => {
			setLoading(true);
			try {
				const fetchedTierlist = await getTierlist(tierlistid);
				setTierlist({ ...fetchedTierlist, id: tierlistid });
				const fetchedItems = await getItemsFromTierlist(tierlistid);
				setItems(fetchedItems);
			} catch (error) {
				console.error('Fetch tierlist error:', error);
				toast.error('Erreur lors du chargement de la tierlist.');
				return;
			} finally {
				setLoading(false);
			}
		};

		fetchTierlistAndItems();
	}, [tierlistid, setTierlist, setItems]);

	if (!user) return null;
	if (loading) return <div>Chargement...</div>;
	return tierlist ? (
		<div className={styles.container}>
			<h1 className={styles.title}>{tierlist.name}</h1>
			<div className={styles.wrapper}>
				<TierList />
				<RatingPanel tierlistId={tierlistid}></RatingPanel>
			</div>
			<UnratedBox tierlistid={tierlistid} criterias={tierlist.criterias}></UnratedBox>
		</div>
	) : (
		<div>Tierlist non trouvée</div>
	);
}

export default Page;
