"use client";
import { useState } from "react";
import RatingSlider from "../RatingSlider";
import styles from "@/app/components/RatingPanel/index.module.css";
import { Criteria, Item } from "@/app/lib/definitions";

type RatingPanelPropsType = {
  item: Item | null;
  criterias: Criteria[];
};

function RatingPanel({ item, criterias }: RatingPanelPropsType) {
  const [rating, setRating] = useState(item?.ratings);
  return (
    item && (
      <div className={styles.container}>
        <img src={item.imageUrl} alt="" className={styles.image}></img>
        {rating &&
          criterias.map((criteria, i) => (
            <RatingSlider
              name={criteria.name}
              setRating={setRating}
              index={i}
              rating={rating}
              key={i}
            ></RatingSlider>
          ))}

        <div className={styles.wrapper}>
          <p className={styles["total-rating"]}>
            {rating &&
              rating.reduce((sum, currentRate) => sum + currentRate.rate, 0)}
          </p>
          <button className={styles.button}>Ajouter</button>
        </div>
      </div>
    )
  );
}

export default RatingPanel;
