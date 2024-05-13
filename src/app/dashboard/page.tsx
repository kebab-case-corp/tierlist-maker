'use client';

import { signOut } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { auth } from '../../../firebase-config';
import TierlistsList from '../components/TierlistsList';
import styles from './index.module.css';
import NewTierlistForm from '../components/NewTierlistForm';
import { getTierlists } from '../lib/data';
import { useAuth } from '../lib/hooks';
import { useTierlistsStore } from '../store/tierlists-store';

function Page() {
	const { setTierlists } = useTierlistsStore();
	const user = useAuth();
	const [loading, setLoading] = useState(true);

	const handleLogoutClick = () => {
		signOut(auth);
	};

	useEffect(() => {
		const fetchTierlists = async () => {
			setLoading(true);
			try {
				if (user) {
					const fetchedTierlists = await getTierlists(user.uid);
					setTierlists(fetchedTierlists);
				}
			} catch (error) {
				console.error('Error fetching tierlists: ' + error);
			} finally {
				setLoading(false);
			}
		};
		fetchTierlists();
	}, [user, setTierlists]);

	if (!user) return <div>Non connecté</div>;

	if (loading) return <div>Connecté! Chargement...</div>;
	return (
		<div className={styles.wrapper}>
			<button className={styles.btn} onClick={handleLogoutClick}>
				Disconnect
			</button>

			<TierlistsList></TierlistsList>
			<NewTierlistForm userId={user.uid}></NewTierlistForm>
		</div>
	);
}

export default Page;
