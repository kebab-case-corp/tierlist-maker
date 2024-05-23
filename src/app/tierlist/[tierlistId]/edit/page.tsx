'use client';

import DeleteItemsForm from '@/app/components/delete-items-form';
import EditTierlistForm from '@/app/components/edit-tierlist-form';
import { supabase } from '@/app/lib/supabase/client';
import useTierlistStore from '@/app/store/useTierlistStore';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

function Page() {
	const { tierlistId } = useParams();
	const [loading, setLoading] = useState(true);
	const { currentTierlist, setCurrentTierlist } = useTierlistStore((state) => state);

	useEffect(() => {
		const fetchTierlist = async () => {
			setLoading(true);
			try {
				const { data: fetchedTierlist } = await supabase
					.from('tierlists')
					.select('*, tiers(*), criterias(*), items(*, scores(*))')
					.eq('id', tierlistId)
					.single();

				setCurrentTierlist(fetchedTierlist);

				setLoading(false);
			} catch (error) {
				console.log(error);
			}
		};
		fetchTierlist();
	}, [tierlistId, setCurrentTierlist]);
	return (
		<main className='container mx-auto'>
			{currentTierlist && (
				<>
					<EditTierlistForm /> <DeleteItemsForm />
				</>
			)}
		</main>
	);
}
export default Page;
