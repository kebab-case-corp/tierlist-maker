import { Criteria, Tier, Tierlist } from '@/app/lib/definitions';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import styles from '@/app/components/NewTierlistForm/index.module.css';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../../../firebase-config';
import TierlistCriteriasEditor from './criterias-editor';
import TierlistTiersEditor from './tiers-editor';

function NewTierlistForm({
	userId,
	setAllTierlists,
}: {
	userId: string;
	setAllTierlists: React.Dispatch<React.SetStateAction<Tierlist[]>>;
}) {
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
			const tierlistRef = collection(db, 'tierlists');
			const docRef = await addDoc(tierlistRef, prevTierlist);
			prevTierlist.id = docRef.id;
			setTierlist(prevTierlist);
			setAllTierlists((prev) => [prevTierlist, ...prev]);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className={styles.container}>
			<h1 className={styles.title}>Nouvelle Tierlist</h1>
			<form className={styles.form} onSubmit={handleSubmit}>
				<label htmlFor='tierlist-name'>Nom:</label>
				<input
					type='text'
					id='tierlist-name'
					className={styles.input}
					onChange={(e) => handleChange(e, 'name')}
					required></input>
				<label htmlFor='tierlist-description'>Description</label>
				<textarea
					name='description'
					id='tierlist-description'
					className={styles.input}
					cols={30}
					rows={5}
					onChange={(e) => handleChange(e, 'description')}></textarea>
				<TierlistTiersEditor setTiers={setTiers} tiers={tiers}></TierlistTiersEditor>
				<TierlistCriteriasEditor
					setCriterias={setCriterias}
					criterias={criterias}></TierlistCriteriasEditor>
				<button type='submit' className={styles.submit}>
					Créer
				</button>
			</form>
		</div>
	);
}

export default NewTierlistForm;
