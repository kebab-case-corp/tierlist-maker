'use client';

import { useEffect } from 'react';
import useTierlistStore from '@/app/store/useTierlistStore';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '../lib/utils';

function TierlistsList() {
	const tierlists = useTierlistStore((state) => state.tierlists);
	const user = useTierlistStore((state) => state.user);
	const fetchTierLists = useTierlistStore((state) => state.getAllTierlists);

	useEffect(() => {
		if (user) {
			fetchTierLists();
		}
	}, [fetchTierLists, user]);

	return (
		<div>
			<h2 className='text-3xl font-bold mb-6'>Mes Tierlists</h2>

			{tierlists ? (
				<ul className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
					{tierlists
						.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
						.map((tierlist) => (
							<li
								key={tierlist.id}
								className='bg-slate-950 rounded-lg shadow-lg overflow-hidden transform transition duration-400 hover:scale-105'>
								<Link href={`/tierlist/${tierlist.id}`}>
									<Image
										src={tierlist.background_image ?? 'https://placehold.co/400'}
										alt={tierlist.name}
										className='w-full h-40 object-cover'
										width={300}
										height={300}
										unoptimized
									/>
									<div className='p-4'>
										<h3 className='text-xl font-bold mb-2'>{tierlist.name}</h3>
										<div className='flex justify-between text-gray-300 text-sm'>
											<p>{tierlist.description ? tierlist.description : 'Aucune description'}</p>
											<p className=''>Crée le: {formatDate(tierlist.created_at)}</p>
										</div>
									</div>
								</Link>
							</li>
						))}
				</ul>
			) : (
				<p className='text-gray-600 text-center'>Aucune tier list trouvée.</p>
			)}
		</div>
	);
}
export default TierlistsList;
