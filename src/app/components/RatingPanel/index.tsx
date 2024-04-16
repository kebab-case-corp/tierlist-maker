'use client'
import { useState } from 'react'
import RatingSlider from '../RatingSlider'
import { tierlists } from '@/app/lib/data'
import styles from '@/app/components/RatingPanel/index.module.css'

function RatingPanel({}) {
    const [rating, setRating] = useState(tierlists[0].items[0].ratings)
    return (
        <div className={styles.container}>
            <img src={tierlists[0].items[0].image} alt="" className={styles.image}></img>
            {tierlists[0].criterias.map((criteria, i) => (
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
                    {rating.reduce((sum, currentRate) => sum + currentRate.rate, 0)}
                </p>
                <button className={styles.button}>Ajouter</button>
            </div>
        </div>
    )
}

export default RatingPanel
