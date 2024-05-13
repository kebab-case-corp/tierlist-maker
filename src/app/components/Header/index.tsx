"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import styles from "@/app/components/Header/index.module.css";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../../../../firebase-config";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/lib/hooks";

function Header() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const user = useAuth();
    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };
    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };
    const handleFormSubmit = (e: FormEvent) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password).catch((error) => console.error(error));
    };
    const handleLogoutClick = () => {
        signOut(auth);
    };

    return (
        <div className={styles.wrapper}>
            {user ? (
                <button className={styles.disconnect} onClick={handleLogoutClick}>
                    Disconnect
                </button>
            ) : (
                <form className={styles.form} onSubmit={handleFormSubmit}>
                    <label htmlFor="email" className={styles.label}>
                        Email:{" "}
                    </label>
                    <input
                        type="text"
                        id="email"
                        required
                        onChange={handleEmailChange}
                        value={email}
                        className={styles.input}
                    ></input>
                    <label htmlFor="pass" className={styles.label}>
                        Password:
                    </label>
                    <input
                        type="password"
                        id="pass"
                        required
                        onChange={handlePasswordChange}
                        value={password}
                        className={styles.input}
                    ></input>
                    <input type="submit" value="Sign in" className={styles.submit} />
                </form>
            )}
        </div>
    );
}

export default Header;
