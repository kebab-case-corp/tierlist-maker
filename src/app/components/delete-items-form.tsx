import Image from 'next/image';
import useTierlistStore from '../store/useTierlistStore';
import { deleteItem } from '../lib/data';

function DeleteItemsForm() {
	const currentTierlist = useTierlistStore((state) => state.currentTierlist);
	const removeItem = useTierlistStore((state) => state.removeItem);

	return (
		<div>
			{currentTierlist?.items.map((item) => (
				<div key={item.id}>
					<Image src={item.image_url} alt='' width={100} height={100}></Image>
					<button onClick={() => removeItem(item.id)} className='button'>
						Supprimer
					</button>
				</div>
			))}
		</div>
	);
}
export default DeleteItemsForm;
