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
        let cleanup: (() => void) | undefined;

        const handleBackButton = async () => {
            const { App } = await import("@capacitor/app");

            const listener = await App.addListener("backButton", () => {
                if (pathname === "/" || pathname === "/home") {
                    // If on home, allow exit
                    App.exitApp();
                } else {
                    // Navigate back through history instead of always going home
                    router.back();
                }
            });

            cleanup = () => {
                listener.remove();
            };
        };

        handleBackButton();

        return () => {
            cleanup?.();
        };
    }, [pathname, router]);

    return null;
}
