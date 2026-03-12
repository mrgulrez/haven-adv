"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function PageWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isChatOrAdmin = pathname?.startsWith('/chat') || pathname?.startsWith('/admin');

    return (
        <div className={cn(
            "flex-grow flex flex-col min-h-screen",
            !isChatOrAdmin && "pt-safe pt-[80px] md:pt-[128px]"
        )}>
            {children}
        </div>
    );
}
