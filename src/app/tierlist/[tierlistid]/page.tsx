'use client';

import { Tierlist } from '@/app/lib/definitions';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/app/lib/hooks';
import TierList from '@/app/components/TierList';
import RatingPanel from '@/app/components/RatingPanel';
import { getTierlist } from '@/app/lib/data';

function Page() {
	const user = useAuth();
	const [tierlist, setTierlist] = useState<Tierlist>();
	const { tierlistid } = useParams<{ tierlistid: string }>();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchTierlist = async () => {
			setLoading(true);
			try {
				const fetchedTierlist = await getTierlist(tierlistid);
				setTierlist(fetchedTierlist);
			} catch (error) {
				console.error('Fetch tierlist error: ' + error);
			} finally {
				setLoading(false);
			}
		};
		fetchTierlist();
	}, [tierlistid]);
	useEffect(() => {
		if (tierlist?.userId !== user?.uid) {
			console.log('pas le bon user');
		}
	}, [user, tierlist]);
	if (loading) return <div>Loading</div>;
	return (
		tierlist && (
			<div>
				<h1>{tierlist.name}</h1>
				<TierList tierlist={tierlist} />
			</div>
		)
	);
}

export default Page;
