import styles from './index.module.css';
import Link from 'next/link';
import { useTierlistsStore } from '@/app/store/tierlists-store';

function TierlistsList() {
	const tierlists = useTierlistsStore((state) => state.tierlists);
	return (
		<div className={styles.container}>
			{tierlists.map((tierlist) => {
				const date = new Date(tierlist.createdAt);
				const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
				return (
					<Link href={`/tierlist/${tierlist.id}`} key={tierlist.id} className={styles.card}>
						<div></div>
						<div className={styles.text}>
							<p className={styles.name}>{tierlist.name}</p>
							<p className={styles.date}>{`Créé le: ${formattedDate}`}</p>
						</div>
					</Link>
				);
			})}
		</div>
	);
}

export default TierlistsList;
