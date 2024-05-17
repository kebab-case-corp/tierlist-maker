'use client';

import { ChangeEvent, FormEvent, useState } from 'react';
import styles from '@/app/components/Header/index.module.css';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../../../../firebase-config';
import { useAuth } from '@/app/lib/hooks';
import Link from 'next/link';

function Header() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const user = useAuth();
	const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value);
	};
	const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value);
	};
	const handleFormSubmit = (e: FormEvent) => {
		e.preventDefault();
		signInWithEmailAndPassword(auth, email, password).catch((error) => console.error(error));
	};
	const handleLogoutClick = () => {
		signOut(auth);
	};

	return (
		<div className={styles.container}>
			<Link href={'/'}>Accueil</Link>
			{user ? (
				<button className={styles.disconnect} onClick={handleLogoutClick}>
					Se déconnecter
				</button>
			) : (
				<form className={styles.form} onSubmit={handleFormSubmit}>
					<div className={styles.inputContainer}>
						<label htmlFor='email' className={styles.label}>
							Email:
						</label>
						<input
							type='text'
							id='email'
							required
							onChange={handleEmailChange}
							value={email}
							className={styles.input}
							placeholder='email@exemple.com'></input>
					</div>
					<div className={styles.inputContainer}>
						<label htmlFor='pass' className={styles.label}>
							Mot de Passe:
						</label>
						<input
							type='password'
							id='pass'
							required
							onChange={handlePasswordChange}
							value={password}
							className={styles.input}
							placeholder='********'></input>
					</div>
					<input type='submit' value='Se connecter' className={styles.submit} />
				</form>
			)}
		</div>
	);
}

export default Header;
