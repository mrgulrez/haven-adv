"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
    onAuthStateChanged,
    signInWithPopup,
    signOut,
    User,
    signInWithRedirect,
    getRedirectResult
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    loginWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Handle redirect result for mobile/redirect flows
        const checkRedirect = async () => {
            try {
                const result = await getRedirectResult(auth);
                if (result?.user) {
                    setUser(result.user);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Redirect login result error:", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                setLoading(false);
            } else {
                // If no user from onAuthStateChanged, check if we just came back from a redirect
                checkRedirect();
            }
        });

        return () => unsubscribe();
    }, []);

    const loginWithGoogle = async () => {
        try {
            // Priority: Popup is better for UX and reliability on desktop/simulated mobile
            // Redirect is a fallback for true mobile browsers that block popups aggressively
            await signInWithPopup(auth, googleProvider);
        } catch (error: any) {
            console.warn("Popup blocked or failed, falling back to redirect:", error);
            // If popup is blocked (common on real mobile devices) use redirect
            if (error.code === "auth/popup-blocked" || error.code === "auth/cancelled-popup-request") {
                await signInWithRedirect(auth, googleProvider);
            } else {
                throw error;
            }
        }
    };

    const logout = async () => {
        try {
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
