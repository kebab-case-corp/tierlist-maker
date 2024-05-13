"use client";

import styles from "@/app/components/TierList/index.module.css";
import { Item, Tier, Tierlist } from "@/app/lib/definitions";
import { useTierlistStore } from "@/app/store/tierlist-store";
import { useItemsStore } from "@/app/store/items-store";
import Image from "next/image";
import { calculateItemScore } from "@/app/lib/utils";

function TierList() {
    const { tierlist } = useTierlistStore((state) => state);
    const { items, selectedItem, setSelectedItem } = useItemsStore((state) => state);

    const groupedItems = tierlist
        ? groupItemsByTier(
              items.filter((item) => item.tiered === true),
              tierlist
          )
        : {};
    return (
        <div className={styles.tierlist}>
            {Object.entries(groupedItems).map(([tierName, tierItems]) => (
                <div key={tierName} className={styles.tier}>
                    <h3 className={styles["tier-name"]}>{tierName}</h3>
                    <ul className={styles["items-wrapper"]}>
                        {tierItems.map((item) => (
                            <li key={item.id} onClick={() => setSelectedItem(item)}>
                                <p>{tierlist && calculateItemScore(item, tierlist?.criterias)}</p>
                                <Image
                                    className={`${styles.img} ${
                                        selectedItem?.id === item.id && styles.selected
                                    }`}
                                    src={item.imageUrl}
                                    alt=""
                                    width={100}
                                    height={100}
                                    priority={false}
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}

export default TierList;

function groupItemsByTier(items: Item[], tierlist: Tierlist): Record<string, Item[]> {
    const sortedTiers = [...tierlist.tiers].sort((a, b) => a.max - b.max);

    const groupedItems: Record<string, Item[]> = {};
    sortedTiers.forEach((tier) => {
        groupedItems[tier.name] = [];
    });

    items.forEach((item) => {
        const score = calculateItemScore(item, tierlist.criterias);

        const assignedTier = sortedTiers.find((tier) => score <= tier.max);

        if (assignedTier) {
            groupedItems[assignedTier.name].push(item);
        }
    });

    Object.values(groupedItems).forEach((tierItems) => {
        tierItems.sort(
            (a, b) =>
                calculateItemScore(b, tierlist.criterias) -
                calculateItemScore(a, tierlist.criterias)
        );
    });

    const reversedGroupedItems: Record<string, Item[]> = {};
    sortedTiers.reverse().forEach((tier) => {
        reversedGroupedItems[tier.name] = groupedItems[tier.name];
    });

    return reversedGroupedItems;
}
