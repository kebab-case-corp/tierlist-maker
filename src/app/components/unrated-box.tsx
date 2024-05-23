import Image from 'next/image';
import useTierlistStore from '../store/useTierlistStore';
import { createItem } from '../lib/data';
import { Item, Score } from '../lib/definitions';
import { supabase } from '../lib/supabase/client';

function UnratedBox() {
	const { currentTierlist, addNewItem, setCurrentTierlist, setCurrentItem } = useTierlistStore(
		(store) => store
	);

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files && e.target.files[0];
		if (!file) return;
		if (!file.type.includes('image')) return;

		try {
			const newItem = await createItem(file, currentTierlist?.id as number);

			if (!newItem) return;

			const scores: Partial<Score>[] = currentTierlist?.criterias.map((criteria) => ({
				criteria_id: criteria.id,
				score: 0,
				item_id: newItem.id,
			}))!!;
			newItem.scores = scores as Score[];
			const { data: scoresData, error: scoresError } = await supabase
				.from('scores')
				.insert(scores)
				.select('*');

			if (scoresError) return;

			newItem.scores = scoresData;

			currentTierlist && addNewItem(currentTierlist.id, newItem as Item);
			currentTierlist &&
				setCurrentTierlist({
					...currentTierlist,
					items: [...currentTierlist.items, newItem as Item],
				});
		} catch (e) {}
	};

	const handleClick = (id: number) => {
		const item = currentTierlist?.items.find((item) => item.id === id);
		if (!item) return;
		setCurrentItem(item);
	};

	return (
		<div className='grid gap-1 border-slate-600 border p-1 w-[90vw] m-auto'>
			<div className='flex gap-1 flex-wrap'>
				{currentTierlist?.items &&
					currentTierlist?.items
						.filter((item) => item.tiered === false)
						.map((item) => (
							<Image
								src={item.image_url}
								key={item.id}
								alt={''}
								width={100}
								height={100}
								className='object-cover h-28 w-28'
								onClick={() => {
									handleClick(item.id);
								}}
							/>
						))}
			</div>
			<input type='file' onChange={handleFileChange} className='input self-center max-w-max' />
		</div>
	);
}
export default UnratedBox;
