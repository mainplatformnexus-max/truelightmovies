import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCJEKQGBycp6VOty_rhMWJ_UZfOAX4NuCA",
  authDomain: "true-light-37917.firebaseapp.com",
  projectId: "true-light-37917",
  storageBucket: "true-light-37917.firebasestorage.app",
  messagingSenderId: "899061893514",
  appId: "1:899061893514:web:90e6bca30dd55b89daa073",
  measurementId: "G-YZ8EE702B3",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

try {
  getAnalytics(app);
} catch (_) {}

export default app;
