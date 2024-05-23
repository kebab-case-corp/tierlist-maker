import { useEffect, useState } from 'react';
import { Item, Score, Tierlist as TierlistType } from '../lib/definitions';
import { calcTotalScore } from '../lib/utils';
import useTierlistStore from '../store/useTierlistStore';
import Image from 'next/image';

function Tierlist() {
	const { currentTierlist, setCurrentItem } = useTierlistStore((state) => state);
	const [groupedItems, setGroupedItems] = useState<Record<number, Item[]>>({});

	useEffect(() => {
		if (currentTierlist) {
			const groupedItems = groupItemsByTier(currentTierlist);
			setGroupedItems(groupedItems);
		}
	}, [currentTierlist]);

	const handleClick = (id: number) => {
		const item = currentTierlist?.items.find((item) => item.id === id);
		if (!item) return;
		setCurrentItem(item);
	};
	return (
		currentTierlist && (
			<div className='grid flex-1 gap-0.5'>
				{Object.entries(groupedItems).map(([tierName, items]) => (
					<div
						key={currentTierlist.tiers.find((tier) => tier.name === tierName)?.id}
						className='flex '>
						<div
							className={`w-28 min-h-28 flex justify-center items-center border-2 border-transparent text-slate-950 font-semibold relative`}
							style={{
								backgroundColor: currentTierlist.tiers.find((tier) => tier.name === tierName)
									?.background_color,
							}}>
							<h2>{tierName}</h2>
							<p className='absolute bottom-0 left-0 font-normal text-sm'>
								{currentTierlist.tiers.find((tier) => tier.name === tierName)?.min_score}
							</p>
						</div>
						<div className='flex flex-wrap p-2 gap-2 border-2 border-transparent flex-1 bg-slate-950'>
							{items.map((item) => (
								<div
									key={item.id}
									onClick={() => handleClick(item.id)}
									className='min-h-28 min-w-28'>
									<Image
										className='w-28 h-28 object-cover'
										src={item.image_url}
										width={100}
										height={100}
										alt=''
										unoptimized
									/>
								</div>
							))}
						</div>
					</div>
				))}
			</div>
		)
	);
}
export default Tierlist;

function groupItemsByTier(tierlist: TierlistType) {
	const sortedTiers = [...tierlist.tiers].sort((a, b) => b.min_score - a.min_score);
	const groupedItems: Record<string, Item[]> = {};

	sortedTiers.forEach((tier) => {
		groupedItems[tier.name] = [];
	});

	[...tierlist.items]
		.filter((item) => item.tiered)
		.forEach((item) => {
			const score = calcTotalScore(item.scores);

			const assignedTier = sortedTiers.find((tier) => score >= tier.min_score);

			if (assignedTier) {
				groupedItems[assignedTier.name].push(item);
			}
		});

	Object.values(groupedItems).forEach((tierItems) =>
		tierItems.sort((a, b) => calcTotalScore(b.scores) - calcTotalScore(a.scores))
	);

	return groupedItems;
}
