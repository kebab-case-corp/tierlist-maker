'use client';

import Image from 'next/image';
import useTierlistStore from '../store/useTierlistStore';
import RatingSlider from './rating-slider';
import { calcTotalScore } from '../lib/utils';
import { updateItem, updateScores } from '../lib/data';
import { toast } from 'react-toastify';
import { useEffect, useRef, useState } from 'react';

function RatingPanel() {
	const { currentItem, currentTierlist, setCurrentItem } = useTierlistStore((state) => state);
	const prevItemRef = useRef<typeof currentItem>(null);
	const [hasChanges, setHasChanges] = useState(false);

	const handleClick = () => {
		if (currentItem === null) return;
		try {
			updateScores(currentItem.scores);
			updateItem(currentItem);
			setCurrentItem(null);
		} catch (e) {
			toast.error(e as string);
		}
	};
	useEffect(() => {
		if (
			hasChanges &&
			prevItemRef.current &&
			currentItem &&
			prevItemRef.current.id !== currentItem.id
		) {
			updateScores(prevItemRef.current.scores);
			updateItem(prevItemRef.current);
			setHasChanges(false);
		}
		prevItemRef.current = currentItem;
	}, [currentItem, hasChanges]);

	return (
		<div className='grid max-w-md gap-2 bg-slate-950 border-2 border-transparent p-3 '>
			<Image
				className='w-52 h-52 object-cover'
				src={currentItem ? currentItem.image_url : 'https://placehold.co/200'}
				alt=''
				width={200}
				height={200}
				unoptimized
			/>
			{currentTierlist?.criterias
				.sort((a, b) => a.order - b.order)
				.map((criteria) => (
					<RatingSlider criteria={criteria} key={criteria.id} setHasChanges={setHasChanges} />
				))}
			<div className='flex items-center'>
				<p className='flex-1 font-semibold text-3xl text-center'>
					{currentItem ? calcTotalScore(currentItem.scores) : 0}
				</p>
				<button
					className='button bg-green-800 hover:bg-green-900'
					onClick={handleClick}
					disabled={currentItem === null}>
					Sauvegarder
				</button>
			</div>
		</div>
	);
}
export default RatingPanel;
