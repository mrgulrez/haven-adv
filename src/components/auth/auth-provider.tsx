"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
    onAuthStateChanged,
    signInWithPopup,
    signOut,
    User,
    signInWithCredential,
    GoogleAuthProvider,
    getAuth,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { Capacitor } from '@capacitor/core';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import { apiFetch } from "@/lib/api";

interface NuravyaUser {
    id: string;
    email: string;
    display_name: string | null;
    photo_url: string | null;
    plan: string;
    created_at: string;
    is_admin?: boolean;
    plan_started_at?: string | null;
}

interface AuthContextType {
    user: User | null;
    nuravyaUser: NuravyaUser | null;
    loading: boolean;
    loginWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Web ID from the frontend (.env.example NEXT_PUBLIC_FIREBASE_APP_ID or standard GCP Web Client ID)
// Capacitor Firebase Auth needs the Web Client ID to generate the idToken on native devices.
const defaultWebClientId = "275083657175-dk7qgflo9nmdstr8j9sv58sffmjh85pc.apps.googleusercontent.com";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [nuravyaUser, setNuravyaUser] = useState<NuravyaUser | null>(null);
    const [loading, setLoading] = useState(true);

    // Sync with backend whenever Firebase user changes
    const syncWithBackend = async (firebaseUser: User | null) => {
        if (!firebaseUser) {
            setNuravyaUser(null);
            return;
        }

        try {
            const res = await apiFetch("/api/users/sync", {
                method: "POST",
                body: JSON.stringify({}),
            });

            if (res.ok) {
                const data: NuravyaUser = await res.json();
                setNuravyaUser(data);
            } else {
                console.warn("Backend user sync returned:", res.status);
            }
        } catch (err) {
            console.warn("Backend user sync failed (backend might be offline):", err);
        }
    };

    const refreshProfile = async () => {
        if (user) {
            await syncWithBackend(user);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user);
            await syncWithBackend(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const loginWithGoogle = async () => {
        try {
            if (Capacitor.isNativePlatform()) {
                console.log("Using Native Capacitor Firebase Auth");
                // Trigger Native Google Sign In popup (Android/iOS)
                const result = await FirebaseAuthentication.signInWithGoogle();

                if (result.credential?.idToken) {
                    // Send the native token to the Web SDK to link the session
                    const credential = GoogleAuthProvider.credential(result.credential.idToken);
                    await signInWithCredential(auth, credential);
                }
            } else {
                console.log("Using Web Firebase Auth");
                // Intercept window.open to force perfect centering of the Google Auth popup
                const originalOpen = window.open;
                window.open = function (url?: string | URL, target?: string, features?: string) {
                    const width = 500;
                    const height = 600;

                    // Handle multi-monitors to open on the active screen
                    const systemLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX;
                    const systemTop = window.screenTop !== undefined ? window.screenTop : window.screenY;

                    const clientWidth = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
                    const clientHeight = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

                    const left = systemLeft + (clientWidth - width) / 2;
                    const top = systemTop + (clientHeight - height) / 2;

                    // Override the features string provided by Firebase
                    const centeredFeatures = `width=${width},height=${height},top=${top},left=${left},status=yes,scrollbars=yes`;
                    return originalOpen.call(window, url, target, centeredFeatures);
                };

                try {
                    // Standard Web Popup Flow for desktop browsers
                    await signInWithPopup(auth, googleProvider);
                } finally {
                    // Always restore the original window.open, even if the popup fails or is closed
                    window.open = originalOpen;
                }
            }

            // After successful auth, sync user is handled by onAuthStateChanged
        } catch (error: any) {
            console.error("Login failed:", error);
            alert(`Login Failed: ${error?.message || "Something went wrong"}`);
            throw error;
        }
    };

    const logout = async () => {
        try {
            if (Capacitor.isNativePlatform()) {
                await FirebaseAuthentication.signOut();
            }
            await signOut(auth);
            setUser(null);
            setNuravyaUser(null);
        } catch (error) {
            console.error("Logout failed:", error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, nuravyaUser, loading, loginWithGoogle, logout, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
