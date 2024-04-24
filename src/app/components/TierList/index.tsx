'use client';

import React from 'react';
import styles from '@/app/components/TierList/index.module.css';
import { Tierlist } from '@/app/lib/definitions';

function TierList({ tierlist }: { tierlist: Tierlist }) {
	// const addToTier = (name: string) => {
	// 	const result = tierlists[0].items.filter((item) => item.tier === name);
	// 	console.log(result);
	// 	return result;
	// };
	return (
		<div className={styles.tierlist}>
			{tierlist.tiers.map((tier) => (
				<div key={tier.name} className={styles.tier}>
					<div className={styles['tier-name']}>
						<p>{tier.name}</p>
					</div>
					<div className={styles['items-wrapper']}>
						{/* {addToTier(tier.name).map((item) => (
							<div className={styles.item} key={item.id}>
								<img src={item.image} className={styles.img} width={100} height={100}></img>
							</div>
						))} */}
					</div>
				</div>
			))}
		</div>
	);
}

export default TierList;
