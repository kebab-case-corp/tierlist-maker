import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebase-config";
import { Tierlist } from "./definitions";

export const fetchTierLists = async (userId: string) => {
  const q = query(collection(db, "tierlists"), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  const tl: Tierlist[] = [];
  querySnapshot.forEach((doc) => {
    tl.push({ id: doc.id, ...doc.data() } as Tierlist);
  });
  return tl;
};
