'use client';

import React, { useEffect, useState } from 'react';
import TierlistsList from './components/TierlistsList';
import styles from './page.module.css';
import NewTierlistForm from './components/NewTierlistForm';
import { getTierlists } from './lib/data';
import { useAuth } from './lib/hooks';
import { useTierlistsStore } from './store/tierlists-store';
import { toast } from 'react-toastify';

function Page() {
	const { setTierlists } = useTierlistsStore();
	const user = useAuth();
	const [loading, setLoading] = useState(true);

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
				toast.error('Erreur lors de la récupération des tierlists');
			} finally {
				setLoading(false);
			}
		};
		fetchTierlists();
	}, [user, setTierlists]);

	if (!user) return <div className={styles.loginstatus}>Non connecté</div>;

	if (loading) return <div>Connecté! Chargement...</div>;
	return (
		<div className={styles.container}>
			<TierlistsList></TierlistsList>
			<NewTierlistForm userId={user.uid}></NewTierlistForm>
		</div>
	);
}

export default Page;
