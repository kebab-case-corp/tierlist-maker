import Link from 'next/link';
import LoginForm from './login-form';

function Header() {
	return (
		<header className='flex justify-between items-center p-4 border-b border-slate-600'>
			<Link href='/'>
				<h1>Tier List Maker</h1>
			</Link>
			<LoginForm />
		</header>
	);
}
export default Header;
