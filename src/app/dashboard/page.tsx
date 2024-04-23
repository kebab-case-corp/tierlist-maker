"use client";

import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { auth } from "../../../firebase-config";
import TierlistsList from "../components/TierlistsList";
import styles from "./index.module.css";
import NewTierlistForm from "../components/NewTierlistForm";
import { Tierlist } from "../lib/definitions";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebase-config";

function Page() {
  const [alltierlists, setAllTierLists] = useState<Tierlist[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const handleLogoutClick = () => {
    signOut(auth);
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        router.push("/");
      }
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const fetchTierLists = async () => {
      const q = query(
        collection(db, "tierlists"),
        where("userId", "==", user?.uid)
      );
      const querySnapshot = await getDocs(q);
      const tl: Tierlist[] = [];
      querySnapshot.forEach((doc) => {
        tl.push({ id: doc.id, ...doc.data() } as Tierlist);
      });
      setAllTierLists(tl.sort((a, b) => b.createdAt - a.createdAt));
    };
    if (user) {
      fetchTierLists();
    }
  }, [user]);

  if (!user) return <div>Loading</div>;
  return (
    <div className={styles.wrapper}>
      <button className={styles.btn} onClick={handleLogoutClick}>
        Disconnect
      </button>
      {alltierlists && (
        <>
          <TierlistsList tierlists={alltierlists}></TierlistsList>
          <NewTierlistForm
            userId={user.uid}
            setAllTierlists={setAllTierLists}
          ></NewTierlistForm>
        </>
      )}
    </div>
  );
}

export default Page;
