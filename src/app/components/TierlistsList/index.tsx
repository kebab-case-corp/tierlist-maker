import styles from "./index.module.css";
import Link from "next/link";
import { Tierlist } from "@/app/lib/definitions";

type TierlistsListProps = {
  tierlists: Tierlist[];
};

function TierlistsList({ tierlists }: TierlistsListProps) {
  return (
    <div className={styles.tierlists}>
      {tierlists?.map((tierlist) => (
        <div key={tierlist.id}>
          <Link href={`/tierlist/${tierlist.id}`}>{tierlist.name}</Link>
          {tierlist.name}
        </div>
      ))}
    </div>
  );
}

export default TierlistsList;
