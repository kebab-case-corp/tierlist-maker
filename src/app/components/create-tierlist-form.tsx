'use client';

import { useState, useRef, SetStateAction, FormEvent, ChangeEvent } from 'react';
import { Criteria, Tier } from '@/app/lib/definitions';
import useTierlistStore from '@/app/store/useTierlistStore';
import { supabase } from '@/app/lib/supabase/client';
import { uploadImageToStorage } from '@/app/lib/data';
import { toast } from 'react-toastify';
import { HexColorPicker } from 'react-colorful';

const defaultTiers: Omit<Tier, 'id'>[] = [
	{ name: 'S', min_score: 20, background_color: '#FF7F80' },
	{ name: 'A', min_score: 16, background_color: '#FFC07F' },
	{ name: 'B', min_score: 12, background_color: '#FFDF7F' },
	{ name: 'C', min_score: 8, background_color: '#BFFE7F' },
	{ name: 'D', min_score: 4, background_color: '#7FFE80' },
	{ name: 'E', min_score: 0, background_color: '#80FFFF' },
];

const defaultCriterias: Omit<Criteria, 'id'>[] = [
	{ name: '', max_score: 5, order: 1 },
	{ name: '', max_score: 5, order: 2 },
	{ name: '', max_score: 5, order: 3 },
	{ name: '', max_score: 5, order: 4 },
];

function CreateTierListForm() {
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [backgroundImage, setBackgroundImage] = useState<File | undefined>(undefined);
	const [showModal, setShowModal] = useState(false);
	const [criterias, setCriterias] = useState<Criteria[] | Omit<Criteria, 'id'>[]>(defaultCriterias);
	const [tiers, setTiers] = useState<Tier[] | Omit<Tier, 'id'>[]>(defaultTiers);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files.length > 0) {
			setBackgroundImage(event.target.files[0]);
		}
	};

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		try {
			const backgroundImageUrl = backgroundImage
				? await uploadImageToStorage(backgroundImage, 'backgrounds')
				: undefined;

			if (backgroundImageUrl === undefined && backgroundImage) {
				throw new Error("Erreur lors du téléchargement de l'image de fond");
			}

			const newTierlist = await useTierlistStore.getState().addNewTierlist({
				name,
				user_id: useTierlistStore.getState().user!.id,
				created_at: new Date().toISOString(),
				background_image: backgroundImageUrl ?? null,
				description,
				criterias: [],
				items: [],
				tiers: [],
			});

			if (!newTierlist) {
				throw new Error('Erreur lors de la création de la tier list');
			}

			const criteriaPromises = criterias.map((criteria) =>
				supabase
					.from('criterias')
					.insert({ ...criteria, tierlist_id: newTierlist.id })
					.select()
			);
			const criteriaResults = await Promise.all(criteriaPromises);
			criteriaResults.forEach(({ data, error }, index) => {
				if (error) {
					toast.error(`Erreur lors de la création du critère ${criterias[index].name}`);
				} else if (data) {
					toast.success(`Critère ${criterias[index].name} créé avec succès!`);
				}
			});

			const tierPromises = tiers.map((tier) =>
				supabase
					.from('tiers')
					.insert({ ...tier, tierlist_id: newTierlist.id })
					.select()
			);
			const tierResults = await Promise.all(tierPromises);
			tierResults.forEach(({ data, error }, index) => {
				if (error) {
					toast.error(`Erreur lors de la création du tier ${tiers[index].name}`);
				} else if (data) {
					toast.success(`Tier ${tiers[index].name} créé avec succès!`);
				}
			});

			setName('');
			setDescription('');
			setBackgroundImage(undefined);
			setCriterias(defaultCriterias);
			setTiers(defaultTiers);
			setShowModal(false);
			await useTierlistStore.getState().getAllTierlists();
		} catch (error) {
			console.error('Erreur lors de la création de la tier list:', error);
			toast.error('Erreur lors de la création de la tier list');
		}
	};

	return (
		<>
			<button onClick={() => setShowModal(true)} className='button max-w-max'>
				Créer une nouvelle tierlist
			</button>

			{showModal && (
				<div
					className='fixed inset-0 z-50 overflow-y-auto'
					aria-labelledby='modal-title'
					role='dialog'
					aria-modal='true'>
					<div className='flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0'>
						<div
							onClick={(e) => e.stopPropagation()}
							className='inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full'>
							<div className='bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
								<h3 className='text-lg leading-6 font-medium text-white' id='modal-title'>
									Créer une nouvelle tierlist
								</h3>
								<form onSubmit={handleSubmit} className='mt-4'>
									<div>
										<label htmlFor='name' className='block text-sm font-medium text-gray-300'>
											Nom de la tierlist
										</label>
										<input
											type='text'
											name='name'
											id='name'
											value={name}
											onChange={(e) => setName(e.target.value)}
											className='input w-full'
											required
										/>
									</div>

									<div className='mt-4'>
										<label
											htmlFor='description'
											className='block text-sm font-medium text-gray-300'>
											Description
										</label>
										<textarea
											name='description'
											id='description'
											value={description}
											onChange={(e) => setDescription(e.target.value)}
											className='input w-full h-16'
										/>
									</div>

									<div className='mt-4'>
										<label
											htmlFor='backgroundImage'
											className='block text-sm font-medium text-gray-300'>
											Background Image
										</label>
										<input
											type='file'
											name='backgroundImage'
											id='backgroundImage'
											ref={fileInputRef}
											onChange={handleFileChange}
											className='mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-600 bg-gray-700 text-white'
										/>
									</div>

									<CriteriasEditor
										criterias={criterias}
										setCriterias={setCriterias}></CriteriasEditor>

									<TiersEditor tiers={tiers} setTiers={setTiers}></TiersEditor>

									<div className='mt-4 flex justify-around'>
										<button type='submit' className='button min-w-32'>
											Créer
										</button>
										<button
											type='button'
											onClick={() => setShowModal(false)}
											className='button bg-rose-500 hover:bg-rose-600 min-w-32'>
											Annuler
										</button>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
}

function CriteriasEditor({
	criterias,
	setCriterias,
}: {
	criterias: Criteria[] | Omit<Criteria, 'id'>[];
	setCriterias: React.Dispatch<SetStateAction<Criteria[] | Omit<Criteria, 'id'>[]>>;
}) {
	const handleAddCriteria = () => {
		setCriterias([...criterias, { name: '', max_score: 5, order: criterias.length + 1 }]);
	};

	const handleDeleteCriteria = (e: FormEvent<HTMLButtonElement>, index: number) => {
		e.preventDefault();
		setCriterias((prevCriterias) => prevCriterias.filter((_, i) => i !== index));
	};

	const handleChangeCriteria = (
		e: ChangeEvent<HTMLInputElement>,
		index: number,
		field: 'name' | 'max_score'
	) => {
		const value = field === 'max_score' ? parseInt(e.target.value) : e.target.value;
		setCriterias((prevCriterias) =>
			prevCriterias.map((criteria, i) => (i === index ? { ...criteria, [field]: value } : criteria))
		);
	};

	return (
		<div className='grid gap-2'>
			<h4 className='text-md font-medium text-white'>Critères</h4>
			{criterias.map((criteria, index) => (
				<div key={index} className='flex gap-1'>
					<input
						type='text'
						value={criteria.name}
						onChange={(e) => handleChangeCriteria(e, index, 'name')}
						placeholder='Nom du critère'
						className='input'
					/>
					<input
						type='number'
						value={criteria.max_score}
						onChange={(e) => handleChangeCriteria(e, index, 'max_score')}
						placeholder='Score max du critère'
						className='input w-24'
						min={0}
					/>
					<button
						className={'button bg-rose-700 hover:bg-rose-800'}
						onClick={(e) => handleDeleteCriteria(e, index)}>
						D
					</button>
				</div>
			))}
			<button
				type='button'
				onClick={handleAddCriteria}
				className='button text-sm bg-slate-500 hover:bg-green-700'>
				Ajouter un critère
			</button>
		</div>
	);
}

function TiersEditor({
	tiers,
	setTiers,
}: {
	tiers: Tier[] | Omit<Tier, 'id'>[];
	setTiers: React.Dispatch<SetStateAction<Tier[] | Omit<Tier, 'id'>[]>>;
}) {
	const handleAddTier = () => {
		setTiers([...tiers, { name: '', min_score: 0, background_color: '#F44336' }]);
	};

	const handleDeleteTier = (e: FormEvent<HTMLButtonElement>, index: number) => {
		e.preventDefault();
		setTiers((prevTiers) => prevTiers.filter((_, i) => i !== index));
	};

	const handleChangeTier = (
		e: ChangeEvent<HTMLInputElement>,
		index: number,
		field: 'name' | 'min_score' | 'background_color'
	) => {
		const value = field === 'min_score' ? parseInt(e.target.value) : e.target.value;
		setTiers((prevTiers) =>
			prevTiers.map((tier, i) => (i === index ? { ...tier, [field]: value } : tier))
		);
	};
	const handleChangeBackgroundColor = (color: string, index: number) => {
		console.log(tiers);
		setTiers((prevTiers) =>
			prevTiers.map((tier, i) => (i === index ? { ...tier, background_color: color } : tier))
		);
	};
	return (
		<div className='grid gap-2 mt-4'>
			<h4 className='text-md font-medium text-white'>Tiers</h4>
			{tiers.map((tier, index) => (
				<div key={index} className='flex gap-2 items-end'>
					<input
						type='text'
						value={tier.name}
						onChange={(e) => handleChangeTier(e, index, 'name')}
						placeholder='Nom du tier'
						className='input flex-1'
					/>
					<input
						type='number'
						value={tier.min_score}
						onChange={(e) => handleChangeTier(e, index, 'min_score')}
						placeholder='Score minimal du tier'
						className='input w-24'
						min={0}
					/>
					<HexColorPicker
						color={tier.background_color ?? '#F44336'}
						onChange={(e) => handleChangeBackgroundColor(e, index)}
					/>
					<button
						onClick={(e) => handleDeleteTier(e, index)}
						className='button bg-rose-700 hover:bg-rose-800'>
						D
					</button>
				</div>
			))}
			<button
				type='button'
				onClick={handleAddTier}
				className='button text-sm bg-slate-500 hover:bg-green-700'>
				Ajouter un tier
			</button>
		</div>
	);
}

export default CreateTierListForm;
