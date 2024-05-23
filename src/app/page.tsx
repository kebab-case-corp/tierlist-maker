'use client';
import CreateTierListForm from './components/create-tierlist-form';
import DeleteTierlistForm from './components/delete-tierlist-form';
import TierlistsList from './components/tierlists-list';
import useTierlistStore from './store/useTierlistStore';

export default function Page() {
	const { user } = useTierlistStore((state) => state);

	return (
		<main className='container mx-auto p-4 grid gap-3'>
			{user ? (
				<>
					<TierlistsList />
					<div className='flex gap-3'>
						<CreateTierListForm />
						<DeleteTierlistForm />
					</div>
				</>
			) : (
				<p>non connecté</p>
			)}
		</main>
	);
}
