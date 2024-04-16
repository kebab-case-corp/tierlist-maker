'use client'
import { useState } from 'react'
import RatingSlider from '../RatingSlider'
import { data } from '@/app/lib/data'
import { tierList } from '@/app/lib/data'
import styles from '@/app/components/RatingPanel/index.module.css'

function RatingPanel({}) {
    const [rating, setRating] = useState(data.ratings)
    return (
        <div className={styles.container}>
            <img src={data.image} alt="" className={styles.image}></img>
            {tierList.criterias.map((criteria, i) => (
                <RatingSlider
                    name={criteria.name}
                    setRating={setRating}
                    index={i}
                    rating={rating}
                    key={i}
                ></RatingSlider>
            ))}

            <div className={styles.wrapper}>
                <p className={styles['total-rating']}>
                    {rating.reduce((sum, currentRate) => sum + currentRate, 0)}
                </p>
                <button className={styles.button}>Ajouter</button>
            </div>
        </div>
    )
}

export default RatingPanel
