import styles from "./index.module.css";
import Link from "next/link";
import { useTierlistsStore } from "@/app/store/tierlists-store";
import { deleteTierlistAndFiles } from "@/app/lib/data";
import { useState } from "react";
import { toast } from "react-toastify";

function TierlistsList() {
    const { tierlists, removeTierlist } = useTierlistsStore((state) => state);
    const [message, setMessage] = useState("");
    const handleDelete = async (tierlistId: string): Promise<void> => {
        deleteTierlistAndFiles(tierlistId)
            .then(() => toast.success("Tierlist supprimé"))
            .catch(() => toast.error("Une erreur est survenue"));
        removeTierlist(tierlistId);
    };
    return (
        <div className={styles.container}>
            {tierlists.map((tierlist) => {
                const date = new Date(tierlist.createdAt);
                const formattedDate = `${date.getDate()}-${
                    date.getMonth() + 1
                }-${date.getFullYear()}`;
                return (
                    <div className={styles.wrapper}>
                        <Link
                            href={`/tierlist/${tierlist.id}`}
                            key={tierlist.id}
                            className={styles.card}
                        >
                            <div></div>
                            <div className={styles.text}>
                                <p className={styles.name}>{tierlist.name}</p>
                                <p className={styles.date}>{`Créé le: ${formattedDate}`}</p>
                            </div>
                        </Link>
                        <button
                            className={styles.delete}
                            onClick={() => handleDelete(tierlist.id as string)}
                        >
                            x
                        </button>
                    </div>
                );
            })}
        </div>
    );
}

export default TierlistsList;
