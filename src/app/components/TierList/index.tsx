"use client"

import React from 'react'
import { tierlists } from '@/app/lib/data'
import styles from '@/app/components/TierList/index.module.css'

function TierList() {
    const addToTier = (name:string) => {
        const result = tierlists[0].items.filter(item => item.tier === name)
        console.log(result)
        return result
    }
  return (
    <div className={styles.tierlist}>
        {tierlists[0].tiers.map(tier => <div key={tier.name} className={styles.tier}>
            <p className={styles["tier__name"]}>{tier.name}</p>
            <div>
            {addToTier(tier.name).map(item => <img src={item.image} key={item.id} className={styles.img}></img>)}
            </div>
        </div>)}
    </div>
  )
}

export default TierList