'use client';
import { SetStateAction, useEffect, useState } from 'react';
import useTierlistStore from '../store/useTierlistStore';
import { Slider } from '@mui/material';

interface RatingSliderProps {
	criteria: {
		id: number;
		name: string;
		max_score: number;
	};
	setHasChanges: React.Dispatch<SetStateAction<boolean>>;
}

function RatingSlider({ criteria, setHasChanges }: RatingSliderProps) {
	const { currentTierlist, currentItem, updateScore } = useTierlistStore((state) => state);
	const [value, setValue] = useState(0);

	useEffect(() => {
		if (currentItem)
			setValue(currentItem.scores.find((s) => s.criteria_id === criteria.id)?.score || 0);
	}, [currentItem, criteria.id]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>, criteria_id: number) => {
		if (currentItem) {
			const newScore = parseFloat(e.target.value);
			setValue(newScore);
			updateScore(criteria_id, newScore);
			setHasChanges(true);
		}
	};

	return (
		<div key={criteria.id}>
			<div className='flex justify-between'>
				<label>{currentTierlist?.criterias.find((c) => c.id === criteria.id)?.name}</label>
				<output>{value}</output>
			</div>
			<Slider
				min={0}
				max={criteria.max_score}
				step={0.5}
				value={value}
				onChange={(e) =>
					handleChange(e as unknown as React.ChangeEvent<HTMLInputElement>, criteria.id)
				}
				marks
				className='w-full cursor-pointer'
				color='secondary'
			/>
		</div>
	);
}
export default RatingSlider;
