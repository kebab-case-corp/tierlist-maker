import { ChangeEvent, useState } from "react";
import styles from "@/app/components/RatingSlider/index.module.css";
import { Item, Rating } from "@/app/lib/definitions";

type RatingSliderProps = {
    name: string;
    setRatingItem: React.Dispatch<React.SetStateAction<Item | null>>;
    ratings: Rating[];
    index: number;
    item: Item;
};

function RatingSlider({ name, setRatingItem, ratings, index, item }: RatingSliderProps) {
    const [value, setValue] = useState(ratings[index].rate);
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newRating = ratings;
        newRating[index].rate = parseFloat(e.target.value);
        setValue(newRating[index].rate);
        setRatingItem({ ...item, ratings: newRating });
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
                type="range"
                min="0"
                max="5"
                value={value}
                className={styles.input}
                id={name}
                step={0.25}
                onChange={handleChange}
            />
        </div>
    );
}

export default RatingSlider;
