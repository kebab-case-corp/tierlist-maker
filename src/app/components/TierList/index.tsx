"use client";

import React, { useEffect } from "react";
import styles from "@/app/components/TierList/index.module.css";
import { Item, Rating, Tierlist } from "@/app/lib/definitions";

function TierList({ tierlist, items }: { tierlist: Tierlist; items: Item[] }) {
    const calcTotalRate = (ratings: Rating[]): number => {
        const result = ratings.reduce((acc, total) => (acc = total.rate + acc), 0);
        return result;
    };

    const addToTier = () => {
        const tiers = tierlist.tiers.sort((a, b) => a.max - b.max);
        const tieredItem = items.map((item) => {
            const totalRating = calcTotalRate(item.ratings);
            const tier = tiers.find((tier) => totalRating <= tier.max);
            return { ...item, tier: tier?.name };
        });
        return tieredItem;
    };
    console.log(addToTier());

    useEffect(() => {
        items.forEach((item) => {});
    });
    return (
        <div className={styles.tierlist}>
            {tierlist.tiers
                .sort((a, b) => b.max - a.max)
                .map((tier) => (
                    <div key={tier.name} className={styles.tier}>
                        <div className={styles["tier-name"]}>
                            <p>{tier.name}</p>
                        </div>
                        <div className={styles["items-wrapper"]}></div>
                    </div>
                ))}
        </div>
    );
}

export default TierList;
