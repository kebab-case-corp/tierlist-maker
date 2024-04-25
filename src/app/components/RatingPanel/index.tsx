"use client";
import { useState } from "react";
import RatingSlider from "../RatingSlider";
import styles from "@/app/components/RatingPanel/index.module.css";
import { Criteria, Item } from "@/app/lib/definitions";
import { collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../../../../firebase-config";

type RatingPanelPropsType = {
    item: Item | null;
    criterias: Criteria[];
    setRatingItem: React.Dispatch<React.SetStateAction<Item | null>>;
    tierlistId: string;
};

function RatingPanel({ item, criterias, setRatingItem, tierlistId }: RatingPanelPropsType) {
    const handleClick = () => {
        try {
            if (item) {
                const tierlistRef = collection(db, "tierlists");
                const docRef = doc(collection(tierlistRef, tierlistId, "items"), item?.id);
                const updatedItem = item;
                updatedItem.tiered = true;
                setRatingItem(updatedItem);
                const docSnapshot = updateDoc(docRef, updatedItem as any);
            }
        } catch (err) {
            console.error(err);
        }
    };
    return (
        item && (
            <div className={styles.container}>
                <img src={item.imageUrl} alt="" className={styles.image}></img>
                {item &&
                    criterias.map((criteria, i) => (
                        <RatingSlider
                            setRatingItem={setRatingItem}
                            name={criteria.name}
                            ratings={item.ratings}
                            index={i}
                            item={item}
                            key={i}
                        ></RatingSlider>
                    ))}

                <div className={styles.wrapper}>
                    <p className={styles["total-rating"]}>
                        {item &&
                            item.ratings.reduce((sum, currentRate) => sum + currentRate.rate, 0)}
                    </p>
                    <button className={styles.button} onClick={handleClick}>
                        Ajouter
                    </button>
                </div>
            </div>
        )
    );
}

export default RatingPanel;
