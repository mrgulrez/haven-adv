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

interface AuthContextType {
    user: User | null;
    loading: boolean;
    loginWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Web ID from the frontend (.env.example NEXT_PUBLIC_FIREBASE_APP_ID or standard GCP Web Client ID)
// Capacitor Firebase Auth needs the Web Client ID to generate the idToken on native devices.
const defaultWebClientId = "388836511470-3emebksk90f6q6ucl435qg5e2k78k73j.apps.googleusercontent.com"; // Placeholder, but should work or be configured if provided

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
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
        } catch (error) {
            console.error("Logout failed:", error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout }}>
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
