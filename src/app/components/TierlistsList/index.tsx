import { collection, getDocs, query, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db } from '../../../../firebase-config'
import styles from './index.module.css'
import Link from 'next/link'
import { Tierlist } from '@/app/lib/definitions'

type TierlistsListProps = {
    userId: string
}

function TierlistsList({ userId }: TierlistsListProps) {
    const [alltierlists, setAllTierLists] = useState<Tierlist[]>()
    useEffect(() => {
        const fetchTierLists = async () => {
            const q = query(
                collection(db, 'tierlists'),
                where('userId', '==', userId)
            )
            const querySnapshot = await getDocs(q)
            const tl: Tierlist[] = []
            querySnapshot.forEach((doc) => {
                tl.push({ id: doc.id, ...doc.data() } as Tierlist)
            })
            setAllTierLists(tl)
        }
        fetchTierLists()
    }, [userId])
    return (
        <div className={styles.tierlists}>
            {alltierlists?.map((tierlist) => (
                <div key={tierlist.id}>
                    <Link href={`/tierlist/${tierlist.id}`}>
                        {tierlist.name}
                    </Link>
                    {tierlist.name}
                </div>
            ))}
        </div>
    )
}

export default TierlistsList
