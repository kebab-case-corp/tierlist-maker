"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import RatingPanel from "./components/RatingPanel";
import TierList from "./components/TierList";
import UnratedBox from "./components/UnratedBox";
import styles from "@/app/page.module.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase-config";
import { useRouter } from "next/navigation";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter()
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault()
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => router.push('/dashboard'))
      .catch((error) => console.error(error));
  };
  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleFormSubmit}>
        <label htmlFor="email">Email: </label>
        <input
          type="text"
          id="email"
          required
          onChange={handleEmailChange}
          value={email}
        ></input>
        <label htmlFor="pass">Password:</label>
        <input
          type="password"
          id="pass"
          required
          onChange={handlePasswordChange}
          value={password}
        ></input>
        <input type="submit" value="Sign in" />
      </form>
    </div>
  );
}
