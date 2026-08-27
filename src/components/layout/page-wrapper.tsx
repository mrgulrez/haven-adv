"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function PageWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isFullBleed = pathname === '/' || pathname?.startsWith('/chat') || pathname?.startsWith('/admin');

    return (
        <div className={cn(
            "flex-grow flex flex-col min-h-screen",
            !isFullBleed && "pt-safe pt-[72px] md:pt-[80px]"
        )}>
            {children}
        </div>
    );
}
