"use client";

import { useEffect, useState } from "react";
import { db, storage } from "../../../../firebase-config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Resizer from "react-image-file-resizer";
import { addDoc, collection } from "firebase/firestore";
import { Item } from "@/app/lib/definitions";
import styles from "./index.module.css";

function UnratedBox({ tierlistid, unratedItems }: { tierlistid: string; unratedItems: Item[] }) {
    const [url, setUrl] = useState<string>("");
    const resizeFile = (file: File, extension: string) =>
        new Promise((resolve) => {
            Resizer.imageFileResizer(
                file,
                300,
                300,
                extension,
                100,
                0,
                (uri) => {
                    resolve(uri);
                },
                "file"
            );
        });

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (!file) return;
        const fileName = file.name.split(".");
        const extension = fileName[fileName.length - 1];
        if (extension.match(/^(jpg|png|jpeg|webp)$/)) {
            console.log(file);
            const newImage = await resizeFile(file, extension);
            const fileRef = ref(storage, `tierlist/${Date.now() + file.name}`);
            await uploadBytes(fileRef, newImage as File);
            const uploadedUrl = await getDownloadURL(fileRef);
            setUrl(uploadedUrl);
            try {
                const docRef = collection(db, "tierlists", tierlistid, "items");
                const docSnapshot = addDoc(docRef, {
                    imageUrl: uploadedUrl,
                    tiered: false,
                } as Item);
                console.log(docSnapshot);
            } catch (err) {
                console.error(err);
            }
        } else {
            console.log(`ceci n'est pas une image`);
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} className={styles.upload} />
            <div className={styles.box}>
                {unratedItems &&
                    unratedItems.map((unratedItem) => (
                        <img
                            src={unratedItem.imageUrl}
                            alt=""
                            className={styles.img}
                            key={unratedItem.id}
                        ></img>
                    ))}
            </div>
        </div>
    );
}

export default UnratedBox;
