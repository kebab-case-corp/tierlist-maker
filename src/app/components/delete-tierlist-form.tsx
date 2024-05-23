'use client';

import { useState } from 'react';
import useTierlistStore from '../store/useTierlistStore';
import { formatDate } from '../lib/utils';
import { Tierlist } from '../lib/definitions';

function DeleteTierlistForm() {
	const [showModal, setShowModal] = useState(false);
	const { tierlists, removeTierlist } = useTierlistStore((state) => state);

	const handleClick = async (tierlist: Tierlist) => {
		try {
			removeTierlist(tierlist);
		} catch (error) {}
	};
	return (
		<>
			<button
				onClick={() => setShowModal(true)}
				className='button max-w-max bg-rose-800 hover:bg-rose-900'>
				Supprimer une tierlist
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
							<div className='grid  gap-2 bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
								{tierlists?.map((tierlist) => (
									<div key={tierlist.id} className='flex gap-2 w-full items-center'>
										<h2 className='flex-1'>{tierlist.name}</h2>
										<p>{tierlist.description ?? 'Aucune description'}</p>
										<p>Crée le {formatDate(tierlist.created_at)}</p>
										<button
											onClick={() => handleClick(tierlist)}
											className='button bg-rose-800 hover:bg-rose-900'>
											Supprimer
										</button>
									</div>
								))}
								<button className='button' onClick={() => setShowModal(false)}>
									Fermer
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
export default DeleteTierlistForm;
