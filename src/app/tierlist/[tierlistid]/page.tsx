"use client";

import { Tierlist } from "@/app/lib/definitions";
import { collection, getDocs } from "firebase/firestore";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { db } from "../../../../firebase-config";

function Page() {
  const [tierlist, setTierlist] = useState<Tierlist>();
  const { tierlistid } = useParams<{ tierlistid: string }>();

  useEffect(() => {
    const fetchTierlist = async () => {
      const querySnapshot = await getDocs(collection(db, "tierlists"));
      querySnapshot.forEach((doc) => {
        if (doc.id === tierlistid) {
          setTierlist(doc.data() as Tierlist);
        }
      });
    };
    fetchTierlist();
  }, []);
  console.log(tierlist);
  return <div>{tierlistid}</div>;
}

export default Page;
