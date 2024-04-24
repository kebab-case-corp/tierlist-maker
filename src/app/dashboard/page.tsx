'use client';

import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { auth } from '../../../firebase-config';
import TierlistsList from '../components/TierlistsList';
import styles from './index.module.css';
import NewTierlistForm from '../components/NewTierlistForm';
import { Tierlist } from '../lib/definitions';
import { getTierlists } from '../lib/data';
import { useAuth } from '../lib/hooks';

function Page() {
	const [tierlists, setTierLists] = useState<Tierlist[]>([]);
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
					setTierLists(fetchedTierlists);
				}
			} catch (error) {
				console.error('Error fetching tierlists: ' + error);
			} finally {
				setLoading(false);
			}
		};
		fetchTierlists();
	}, [user]);

	if (!user || loading) return <div>Loading</div>;
	return (
		<div className={styles.wrapper}>
			<button className={styles.btn} onClick={handleLogoutClick}>
				Disconnect
			</button>
			{tierlists && (
				<>
					<TierlistsList tierlists={tierlists}></TierlistsList>
					<NewTierlistForm userId={user.uid} setAllTierlists={setTierLists}></NewTierlistForm>
				</>
			)}
		</div>
	);
}

export default Page;
