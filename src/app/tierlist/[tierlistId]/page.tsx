'use client';
import RatingPanel from '@/app/components/rating-panel';
import Tierlist from '@/app/components/tierlist';
import UnratedBox from '@/app/components/unrated-box';
import { supabase } from '@/app/lib/supabase/client';
import useTierlistStore from '@/app/store/useTierlistStore';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

function Page() {
	const { tierlistId } = useParams();
	const [loading, setLoading] = useState(true);
	const { currentTierlist, setCurrentTierlist, setCurrentItem } = useTierlistStore(
		(state) => state
	);

	useEffect(() => {
		const fetchTierlist = async () => {
			setLoading(true);
			try {
				const { data: fetchedTierlist, error } = await supabase
					.from('tierlists')
					.select('*, tiers(*), criterias(*), items(*, scores(*))')
					.eq('id', tierlistId)
					.single();

				setCurrentTierlist(fetchedTierlist);
				setCurrentItem(null);

				setLoading(false);
			} catch (error) {
				console.log(error);
			}
		};
		fetchTierlist();
	}, [tierlistId, setCurrentTierlist, setCurrentItem]);

	return loading ? (
		<h1>Chargement...</h1>
	) : (
		<main className='grid gap-2 justify-items-center mt-2'>
			<h1 className='text-2xl'>{currentTierlist?.name}</h1>
			<div className='flex w-[90vw] m-auto gap-1'>
				<Tierlist />
				<RatingPanel />
			</div>
			<UnratedBox />
		</main>
	);
}
export default Page;
