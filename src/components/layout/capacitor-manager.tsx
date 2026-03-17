"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Capacitor } from "@capacitor/core";

export function CapacitorManager() {
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (!Capacitor.isNativePlatform()) return;

        // Dynamic import to avoid SSR issues
        const handleBackButton = async () => {
            const { App } = await import("@capacitor/app");

            const listener = await App.addListener("backButton", (data: { canGoBack: boolean }) => {
                if (pathname === "/" || pathname === "/home") {
                    // If on home, allow exit
                    App.exitApp();
                } else {
                    // If not on home, go home first
                    router.push("/");
                }
            });

            return () => {
                listener.remove();
            };
        };

        handleBackButton();
    }, [pathname, router]);

    return null;
}
