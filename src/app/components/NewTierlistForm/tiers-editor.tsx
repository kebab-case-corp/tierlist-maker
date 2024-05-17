import { Tier } from '@/app/lib/definitions';
import { ChangeEvent, FormEvent } from 'react';
import styles from './index.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';

function TierlistTiersEditor({
	setTiers,
	tiers,
}: {
	setTiers: React.Dispatch<React.SetStateAction<Tier[]>>;
	tiers: Tier[];
}) {
	const handleCreateTier = (e: FormEvent<HTMLButtonElement>) => {
		e.preventDefault();
		setTiers([...tiers, { name: '', max: 0 }]);
	};
	const handleDeleteTier = (e: FormEvent<HTMLButtonElement>, index: number) => {
		e.preventDefault();
		setTiers((prevTiers) => prevTiers.filter((_, i) => i !== index));
	};

	const handleChangeTier = (
		e: ChangeEvent<HTMLInputElement>,
		index: number,
		field: 'name' | 'max'
	) => {
		const value = field === 'name' ? e.target.value : parseInt(e.target.value);
		setTiers((prevTiers) =>
			prevTiers.map((tier, i) => (i === index ? { ...tier, [field]: value } : tier))
		);
	};

	return (
		<div className={styles.tiersEditor}>
			<h3 className={styles.subTitle}>Tiers:</h3>
			<div className={styles.tiers}>
				{tiers.map((tier, i) => (
					<div key={i.toString()} className={styles.tier}>
						<div className={styles.inputContainer}>
							<label htmlFor={`tier-name--${i + 1}`}>{`Nom du tier ${i + 1}`}</label>
							<input
								type='text'
								id={`tier-name--${i + 1}`}
								value={tier.name}
								className={styles.input}
								onChange={(e) => handleChangeTier(e, i, 'name')}
							/>
						</div>
						<div className={styles.inputContainer}>
							<label htmlFor={`tier-max--${i + 1}`}>{'Note max: '}</label>
							<input
								type='number'
								id={`tier-max--${i + 1}`}
								value={tier.max}
								className={styles.input}
								onChange={(e) => handleChangeTier(e, i, 'max')}
								min={0}
								max={20}
							/>
						</div>
						<button className={styles.delete} onClick={(e) => handleDeleteTier(e, i)}>
							<FontAwesomeIcon icon={faTrashCan}></FontAwesomeIcon>
						</button>
					</div>
				))}

				<button onClick={handleCreateTier} className={styles.button}>
					Ajouter un tier
				</button>
			</div>
		</div>
	);
}

export default TierlistTiersEditor;
