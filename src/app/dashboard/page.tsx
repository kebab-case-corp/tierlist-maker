"use client";

import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { auth } from "../../../firebase-config";
import TierlistsList from "../components/TierlistsList";
import styles from "./index.module.css";

function Page() {
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
  if (!user) return <div>Loading</div>;
  return (
    <div className={styles.wrapper}>
      <button className={styles.btn} onClick={handleLogoutClick}>
        Disconnect
      </button>
      <TierlistsList userId={user.uid}></TierlistsList>
    </div>
  );
}

export default Page;
