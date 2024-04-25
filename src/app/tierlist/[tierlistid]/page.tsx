"use client";

import { Item, Tierlist } from "@/app/lib/definitions";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/app/lib/hooks";
import TierList from "@/app/components/TierList";
import RatingPanel from "@/app/components/RatingPanel";
import { getTierlist } from "@/app/lib/data";
import UnratedBox from "@/app/components/UnratedBox";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../firebase-config";
import styles from "./index.module.css";

function Page() {
    const user = useAuth();
    const [tierlist, setTierlist] = useState<Tierlist>();
    const { tierlistid } = useParams<{ tierlistid: string }>();
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState<Item[]>([]);
    const [ratingItem, setRatingItem] = useState<Item | null>(null);

    useEffect(() => {
        const fetchTierlist = async () => {
            setLoading(true);
            try {
                getTierlist(tierlistid)
                    .then((fetchedTierlist) => {
                        setTierlist(fetchedTierlist);
                        return fetchedTierlist;
                    })
                    .then((fetchedTierlist) => {
                        const tierlistRef = collection(db, "tierlists");
                        const itemRef = collection(tierlistRef, tierlistid, "items");
                        const table: Item[] = [];
                        getDocs(itemRef).then((snapshot) => {
                            snapshot.forEach((doc) =>
                                table.push({ id: doc.id, ...(doc.data() as Item) })
                            );
                            setItems(table);
                        });
                    });
            } catch (error) {
                console.error("Fetch tierlist error: " + error);
            } finally {
                setLoading(false);
            }
        };
        fetchTierlist();
    }, [tierlistid]);
    console.log(ratingItem);
    console.log(items);
    useEffect(() => {
        if (tierlist?.userId !== user?.uid) {
            console.log("pas le bon user");
        }
    }, [user, tierlist]);
    if (loading) return <div>Loading</div>;
    return (
        tierlist && (
            <div className={styles.container}>
                <h1>{tierlist.name}</h1>
                <div className={styles.wrapper}>
                    <TierList
                        tierlist={tierlist}
                        items={items.filter((item) => item.tiered === true)}
                    />
                    <RatingPanel
                        item={ratingItem}
                        criterias={tierlist.criterias}
                        setRatingItem={setRatingItem}
                        tierlistId={tierlistid}
                    ></RatingPanel>
                </div>
                <UnratedBox
                    unratedItems={items.filter((item) => item.tiered === false)}
                    tierlistid={tierlistid}
                    criterias={tierlist.criterias}
                    setItems={setItems}
                    setRatingItem={setRatingItem}
                ></UnratedBox>
            </div>
        )
    );
}

export default Page;
