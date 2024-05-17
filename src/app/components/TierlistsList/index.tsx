import styles from './index.module.css';
import Link from 'next/link';
import { useTierlistsStore } from '@/app/store/tierlists-store';
import { deleteTierlistAndFiles } from '@/app/lib/data';
import { useState } from 'react';
import { toast } from 'react-toastify';

function TierlistsList() {
	const { tierlists, removeTierlist } = useTierlistsStore((state) => state);

	const handleDelete = async (
		e: React.MouseEvent<HTMLButtonElement>,
		tierlistId: string
	): Promise<void> => {
		e.stopPropagation();
		try {
			await deleteTierlistAndFiles(tierlistId);
			toast.success('Tierlist supprimé');
			removeTierlist(tierlistId);
		} catch (error) {
			toast.error('Une erreur est survenue');
			console.error(error);
		}
	};

	const handleFormattedDate = (createdAt: number): string => {
		const date = new Date(createdAt);
		return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
	};

	return (
		<div className={styles.container}>
			{tierlists.map((tierlist) => (
				<div key={tierlist.id} className={styles.wrapper}>
					<Link href={`/${tierlist.id}`} className={styles.link}>
						<div className={styles.background}></div>
						<div className={styles.text}>
							<div className={styles.name}>
								<h2>{tierlist.name}</h2>
							</div>
							<p className={styles.date}>{`Créé le: ${handleFormattedDate(tierlist.createdAt)}`}</p>
						</div>
					</Link>
					<button className={styles.delete} onClick={(e) => handleDelete(e, tierlist.id as string)}>
						X
					</button>
				</div>
			))}
		</div>
	);
}

export default TierlistsList;
