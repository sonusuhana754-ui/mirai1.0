"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User, signOut, deleteUser } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc, onSnapshot, deleteDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  title: string;
  bio: string;
  level: number;
  avatarColor: string;
  // Subscription fields
  plan: 'free' | 'plus' | 'elite';
  cycle: 'daily' | 'monthly' | 'yearly';
  walletBalance: number;
  trialEnd: string;
  hasPaymentMethod: boolean;
  paymentLast4: string;
  hasSeenOnboarding: boolean;
  // Professional traits
  skills: { name: string; value: number }[];
  primaryStack: string;
  experienceYears: number;
  resumeText: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isConfigured: boolean;
  isGuest: boolean;
  setIsGuest: (v: boolean) => void;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isConfigured: false,
  isGuest: false,
  setIsGuest: () => { },
  logout: async () => { },
  refreshProfile: async () => { },
  deleteAccount: async () => { }
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const router = useRouter();

  const refreshProfile = async () => {
    if (!user || !db) return;
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setProfile(docSnap.data() as UserProfile);
    }
  };

  const logout = async () => {
    if (auth) {
      await signOut(auth);
    }
    setIsGuest(false);
    setProfile(null);
    router.push("/");
  };

  const deleteAccount = async () => {
    if (!user || !db || !auth?.currentUser) return;
    
    // 1. Delete Firestore profile
    const userDocRef = doc(db, "users", user.uid);
    await deleteDoc(userDocRef);
    
    // 2. Delete Auth user
    if (auth?.currentUser) {
      await deleteUser(auth.currentUser);
    }
    
    setIsGuest(false);
    setProfile(null);
    setUser(null);
    router.push("/");
  };

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    let unsubscribeProfile: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      // 1. Immediately clean up previous profile listener
      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = null;
      }

      // 2. Reset states for new user
      setUser(firebaseUser);
      setProfile(null);

      if (firebaseUser && db) {
        setLoading(true);
        const userDocRef = doc(db, "users", firebaseUser.uid);

        // 3. Start fresh listener for the new user
        try {
            unsubscribeProfile = onSnapshot(userDocRef, async (docSnap) => {
              if (docSnap.exists()) {
                setProfile(docSnap.data() as UserProfile);
                setLoading(false);
              } else {
                // Create default profile if it doesn't exist
                const colors = ['bg-emerald-500', 'bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-rose-500'];
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
                const trialEndDate = new Date();
                trialEndDate.setDate(trialEndDate.getDate() + 30);
    
                const newProfile: UserProfile = {
                  uid: firebaseUser.uid,
                  displayName: firebaseUser.displayName || 'New Builder',
                  email: firebaseUser.email || '',
                  title: 'Apprentice Developer',
                  bio: 'Setting up my Mirai workspace...',
                  level: 1,
                  avatarColor: randomColor,
                  plan: 'free',
                  cycle: 'monthly',
                  walletBalance: 0,
                  trialEnd: trialEndDate.toISOString(),
                  hasPaymentMethod: false,
                  paymentLast4: '',
                  hasSeenOnboarding: false,
                  skills: [],
                  primaryStack: '',
                  experienceYears: 0,
                  resumeText: ''
                };
                try {
                    await setDoc(userDocRef, newProfile);
                    setProfile(newProfile);
                } catch (e) {
                    console.error("Failed to create profile:", e);
                    // Fallback to local profile if Firestore is blocked
                    setProfile(newProfile);
                }
                setLoading(false);
              }
            }, (error) => {
              console.error("Profile sync error:", error);
              // CRITICAL: If Firestore fails (e.g. database not found), don't stay in loading forever
              setLoading(false);
            });
        } catch (err) {
            console.error("Firestore initialization failed:", err);
            setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      isConfigured: !!auth,
      isGuest,
      setIsGuest,
      logout,
      refreshProfile,
      deleteAccount
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
