// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIRESTORE_API_KEY,
  authDomain: "tier-list-maker-d6ed5.firebaseapp.com",
  projectId: "tier-list-maker-d6ed5",
  storageBucket: "tier-list-maker-d6ed5.appspot.com",
  messagingSenderId: "181093065134",
  appId: "1:181093065134:web:eda67bc301e74e718fa83f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);