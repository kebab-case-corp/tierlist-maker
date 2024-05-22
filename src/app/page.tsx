import CreateTierListForm from './components/create-tierlist-form';
import DeleteTierlistForm from './components/delete-tierlist-form';
import TierlistsList from './components/tierlists-list';

export default function Page() {
	return (
		<main className='container mx-auto p-4 grid gap-3'>
			<TierlistsList />
			<div className='flex gap-3'>
				<CreateTierListForm />
				<DeleteTierlistForm />
			</div>
		</main>
	);
}
