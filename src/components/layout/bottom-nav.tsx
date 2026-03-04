"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Sparkles, Tag, HeartHandshake, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth/auth-provider"

const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/features", label: "Features", icon: Sparkles },
    { href: "/pricing", label: "Pricing", icon: Tag },
    { href: "/about", label: "Mission", icon: HeartHandshake },
]

export function BottomNav() {
    const pathname = usePathname()
    const { user, loginWithGoogle } = useAuth()

    if (pathname?.startsWith('/chat')) {
        return null;
    }

    const NavButton = ({ href, label, icon: Icon, onClick, isActive }: { href?: string, label: string, icon: any, onClick?: () => void, isActive?: boolean }) => {
        const content = (
            <div className="flex-1 flex flex-col items-center py-2 gap-1 group">
                <div
                    className={cn(
                        "flex items-center justify-center w-12 h-8 rounded-xl transition-all duration-300",
                        isActive
                            ? "bg-amber-500 shadow-sm shadow-amber-200"
                            : "bg-transparent group-active:bg-amber-50"
                    )}
                >
                    <Icon
                        size={18}
                        strokeWidth={isActive ? 2.5 : 1.7}
                        className={cn(
                            "transition-all duration-300",
                            isActive
                                ? "text-white"
                                : "text-stone-400 group-hover:text-stone-600"
                        )}
                    />
                </div>
                <span
                    className={cn(
                        "text-[10px] leading-none font-medium tracking-wide transition-all duration-300",
                        isActive
                            ? "text-amber-600 font-semibold"
                            : "text-stone-400 group-hover:text-stone-500"
                    )}
                >
                    {label}
                </span>
            </div>
        );

        if (onClick) {
            return (
                <button key={label} onClick={onClick} className="flex-1">
                    {content}
                </button>
            );
        }

        return (
            <Link key={href} href={href!} className="flex-1">
                {content}
            </Link>
        );
    };

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 pb-safe">
            <div className="mx-0 mb-0 rounded-t-2xl overflow-hidden"
                style={{
                    background: "rgba(255, 251, 235, 0.92)",
                    backdropFilter: "blur(24px)",
                    WebkitBackdropFilter: "blur(24px)",
                    boxShadow: "0 -1px 0 0 rgba(245,158,11,0.12), 0 8px 32px rgba(41,37,36,0.12), 0 2px 8px rgba(41,37,36,0.08)",
                    border: "1px solid rgba(245,158,11,0.15)",
                }}
            >
                <div className="flex items-center justify-around px-1 py-1">
                    {navItems.map((item) => (
                        <NavButton
                            key={item.href}
                            href={item.href}
                            label={item.label}
                            icon={item.icon}
                            isActive={pathname === item.href}
                        />
                    ))}

                    <NavButton
                        label={user ? (user.displayName?.split(' ')[0] || "Profile") : "Login"}
                        icon={User}
                        onClick={user ? undefined : loginWithGoogle}
                        href={user ? "/profile" : undefined}
                        isActive={pathname === "/profile"}
                    />
                </div>
            </div>
        </div>
    )
}
