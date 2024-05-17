import { Criteria, Tier, Tierlist } from '@/app/lib/definitions';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import styles from '@/app/components/NewTierlistForm/index.module.css';
import TierlistCriteriasEditor from './criterias-editor';
import TierlistTiersEditor from './tiers-editor';
import { addNewTierlist } from '@/app/lib/data';

function NewTierlistForm({ userId }: { userId: string }) {
	const [tiers, setTiers] = useState<Tier[]>([
		{ name: 'S', max: 20 },
		{ name: 'A', max: 16 },
		{ name: 'B', max: 12 },
		{ name: 'C', max: 8 },
		{ name: 'D', max: 4 },
	]);

	const [criterias, setCriterias] = useState<Criteria[]>([
		{ name: '', maxRate: 5, description: '' },
		{ name: '', maxRate: 5, description: '' },
		{ name: '', maxRate: 5, description: '' },
		{ name: '', maxRate: 5, description: '' },
	]);

	const [tierlist, setTierlist] = useState<Tierlist>({
		userId: userId,
		name: '',
		createdAt: new Date().getTime(),
		description: '',
		criterias: criterias,
		tiers: tiers,
	});

	const [modal, setModal] = useState(false);

	const handleChange = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
		field: 'name' | 'description'
	) => {
		let prevTierlist = { ...tierlist };
		prevTierlist[field] = e.target.value;
		setTierlist(prevTierlist);
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const prevTierlist = { ...tierlist };
		prevTierlist.criterias = criterias;
		prevTierlist.tiers = tiers;
		prevTierlist.createdAt = new Date().getTime();
		try {
			const docRef = await addNewTierlist(prevTierlist);
			prevTierlist.id = docRef.id;
			setTierlist(prevTierlist);
			setModal(false);
		} catch (error) {
			console.error(error);
		}
	};

	const handleModalClick = () => {
		setModal(true);
	};

	const handleCloseModal = () => {
		setModal(false);
	};
	return (
		<div>
			<button className={styles.button} onClick={handleModalClick}>
				Créer une nouvelle tierlist
			</button>
			{modal && (
				<div className={styles.background}>
					<div className={styles.container}>
						<button className={styles.closeModal} onClick={handleCloseModal}>
							X
						</button>
						<h1 className={styles.title}>Nouvelle Tierlist</h1>
						<form className={styles.form} onSubmit={handleSubmit}>
							<div className={styles.inputContainer}>
								<label htmlFor='tierlist-name'>Nom:</label>
								<input
									type='text'
									id='tierlist-name'
									className={styles.input}
									onChange={(e) => handleChange(e, 'name')}
									required></input>
							</div>
							<div className={styles.inputContainer}>
								<label htmlFor='tierlist-description'>Description</label>
								<textarea
									name='description'
									id='tierlist-description'
									className={styles.input}
									cols={30}
									rows={5}
									onChange={(e) => handleChange(e, 'description')}></textarea>
							</div>
							<TierlistTiersEditor setTiers={setTiers} tiers={tiers}></TierlistTiersEditor>
							<TierlistCriteriasEditor
								setCriterias={setCriterias}
								criterias={criterias}></TierlistCriteriasEditor>
							<button type='submit' className={styles.button}>
								Créer la tierlist
							</button>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}

export default NewTierlistForm;
