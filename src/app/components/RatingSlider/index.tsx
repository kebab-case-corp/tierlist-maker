import { ChangeEvent, useEffect, useState } from 'react';
import styles from '@/app/components/RatingSlider/index.module.css';
import { useItemsStore } from '@/app/store/items-store';
import { useTierlistStore } from '@/app/store/tierlist-store';
import { Criteria } from '@/app/lib/definitions';

type RatingSliderProps = {
	criteria: Criteria;
	index: number;
	setHasChanges: React.Dispatch<React.SetStateAction<boolean>>;
};

function RatingSlider({ criteria, index, setHasChanges }: RatingSliderProps) {
	const { selectedItem, updateRating } = useItemsStore((state) => state);
	const [value, setValue] = useState(0);
	const name = criteria.name;

	useEffect(() => {
		if (selectedItem) setValue(selectedItem.ratings[index].rate);
	}, [selectedItem, index]);

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (selectedItem) {
			const newRating = parseFloat(e.target.value);
			setValue(newRating);
			updateRating(name, newRating);
			setHasChanges(true);
		}
	};
	return (
		<div className={styles.container}>
			<div className={styles.wrapper}>
				<label htmlFor={name} className={styles.label}>
					{name}
				</label>
				<output htmlFor={name} className={styles.output}>
					{value}
				</output>
			</div>
			<input
				type='range'
				min='0'
				max={criteria.maxRate}
				value={value}
				className={styles.input}
				id={name}
				step={0.25}
				onChange={handleChange}
				disabled={selectedItem ? false : true}
			/>
		</div>
	);
}

export default RatingSlider;
