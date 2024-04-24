import { ChangeEvent, useState } from "react";
import styles from "@/app/components/RatingSlider/index.module.css";
import { Rating } from "@/app/lib/definitions";

type RatingSliderProps = {
  name: string;
  setRating: Function;
  index: number;
  rating: Rating[];
};

function RatingSlider({ name, setRating, index, rating }: RatingSliderProps) {
  const [value, setValue] = useState(0);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newRating = [...rating];
    newRating[index].rate = parseFloat(e.target.value);
    setValue(parseFloat(e.target.value));
    setRating(newRating);
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
