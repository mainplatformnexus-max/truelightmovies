import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  User,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider } from "../lib/firebase";

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  phone: string;
  role: "user" | "vj" | "admin";
  plan: string | null;
  planExpiry: string | null;
  status: "active" | "expired" | "blocked" | "none";
  joined: string;
  photoURL?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, phone: string, password: string) => Promise<void>;
  loginWithGoogle: (phone?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (uid: string): Promise<UserProfile | null> => {
    const ref = doc(db, "userProfiles", uid);
    const snap = await getDoc(ref);
    if (snap.exists()) return snap.data() as UserProfile;
    return null;
  };

  const createProfile = async (
    uid: string,
    displayName: string,
    email: string,
    phone: string,
    photoURL?: string
  ): Promise<UserProfile> => {
    const profile: UserProfile = {
      uid,
      displayName,
      email,
      phone,
      role: "user",
      plan: null,
      planExpiry: null,
      status: "none",
      joined: new Date().toISOString().split("T")[0],
      photoURL: photoURL || "",
    };
    await setDoc(doc(db, "userProfiles", uid), {
      ...profile,
      createdAt: serverTimestamp(),
    });
    return profile;
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const p = await fetchProfile(firebaseUser.uid);
        setProfile(p);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const login = async (email: string, password: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const p = await fetchProfile(cred.user.uid);
    setProfile(p);
  };

  const signup = async (name: string, email: string, phone: string, password: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    const p = await createProfile(cred.user.uid, name, email, phone);
    setProfile(p);
  };

  const loginWithGoogle = async (phone = "") => {
    const cred = await signInWithPopup(auth, googleProvider);
    const existing = await fetchProfile(cred.user.uid);
    if (existing) {
      setProfile(existing);
    } else {
      const p = await createProfile(
        cred.user.uid,
        cred.user.displayName || "User",
        cred.user.email || "",
        phone,
        cred.user.photoURL || ""
      );
      setProfile(p);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (user) {
      const p = await fetchProfile(user.uid);
      setProfile(p);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, signup, loginWithGoogle, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
