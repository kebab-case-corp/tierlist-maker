'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase/client';
import useTierlistStore from '@/app/store/useTierlistStore';
import { toast } from 'react-toastify';

function LoginForm() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const { user, setUser, logout } = useTierlistStore((state) => state);

	useEffect(() => {
		const getUser = async () => {
			const { data } = await supabase.auth.getUser();
			if (data.user) {
				setUser({
					id: data.user.id,
					email: data.user.email || '',
				});
			} else {
				setUser(null);
			}
		};

		getUser();
	}, [setUser]);

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			if (data.user) {
				setUser({ id: data.user.id, email: data.user.email as string });
				toast.success('Connexion réussie');
			} else {
				toast.error('Erreur de connexion ' + error);
			}
		} catch (error: any) {
			setError(error.message);
		} finally {
			setLoading(false);
		}
	};

	const handleLogout = async () => {
		try {
			await supabase.auth.signOut();
			logout();
		} catch (error) {
			console.error(error);
		}
	};

	return !user ? (
		<form onSubmit={handleSubmit} className='flex gap-2'>
			<input
				type='email'
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				placeholder='Email'
				className='input'
				required
			/>

			<input
				type='password'
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				placeholder='Mot de passe'
				className='input'
				required
			/>

			<button type='submit' disabled={loading} className='button'>
				{loading ? 'Connexion en cours...' : 'Se connecter'}
			</button>

			{error && <p style={{ color: 'red' }}>{error}</p>}
		</form>
	) : (
		<button
			onClick={handleLogout}
			className='button bg-rose-700 hover:bg-rose-800 focus:ring-rose-300 dark:bg-rose-600 dark:hover:bg-rose-700 dark:focus:ring-rose-800'>
			Se déconnecter
		</button>
	);
}

export default LoginForm;
