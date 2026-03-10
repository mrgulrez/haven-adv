"use client"

import * as React from "react"
import Link from "next/link"
import { useScroll, useMotionValueEvent, motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth/auth-provider"
import { MessageSquare, Brain, TrendingUp, User, ChevronDown, LogOut, Settings, Crown } from "lucide-react"
import Image from "next/image"

export function Navbar() {
    const { scrollY } = useScroll()
    const [isScrolled, setIsScrolled] = React.useState(false)
    const [userMenuOpen, setUserMenuOpen] = React.useState(false)
    const pathname = usePathname()
    const { user, loginWithGoogle, nuravyaUser, logout } = useAuth()
    const menuRef = React.useRef<HTMLDivElement>(null)

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 50)
    })

    // Close dropdown on outside click
    React.useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setUserMenuOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClick)
        return () => document.removeEventListener("mousedown", handleClick)
    }, [])

    if (pathname?.startsWith('/chat') || pathname?.startsWith('/admin')) {
        return null;
    }

    const navLinks = user
        ? [
            { href: "/chat", label: "Chat", icon: MessageSquare },
            { href: "/memory", label: "Memory", icon: Brain },
            { href: "/insights", label: "Insights", icon: TrendingUp },
        ]
        : [
            { href: "/features", label: "Features" },
            { href: "/blog", label: "Blog" },
            { href: "/science", label: "Science" },
            { href: "/pricing", label: "Pricing" },
        ];

    return (
        <header
            className={cn(
                "hidden md:block fixed top-0 left-0 right-0 z-50 transition-all duration-500",
                isScrolled
                    ? "bg-[#FFFBEB]/90 backdrop-blur-xl border-b border-stone-900/5 shadow-sm py-3"
                    : "bg-transparent py-5"
            )}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <Image
                        src="/images/NuravyaLogo.png"
                        alt="Nuravya AI Logo"
                        width={36}
                        height={36}
                        className="rounded-lg transition-transform duration-200 group-hover:scale-105"
                        priority
                    />
                    <span className="text-2xl font-bold font-heading text-stone-900 group-hover:text-amber-600 transition-colors duration-200">
                        Nuravya <span className="text-amber-500">AI</span>
                    </span>
                </Link>

                {/* Nav links */}
                <nav className="flex items-center gap-1">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-amber-50 text-amber-700 font-semibold"
                                        : "text-stone-600 hover:text-stone-900 hover:bg-stone-100/70"
                                )}
                            >
                                {"icon" in link && link.icon && (
                                    <link.icon size={15} className={isActive ? "text-amber-500" : "text-stone-400"} />
                                )}
                                {link.label}
                                {isActive && <span className="w-1 h-1 rounded-full bg-amber-500" />}
                            </Link>
                        )
                    })}
                </nav>

                {/* Right side */}
                <div className="flex items-center gap-3">
                    {user ? (
                        <div className="flex items-center gap-2" ref={menuRef}>
                            {nuravyaUser?.is_admin && (
                                <Link
                                    href="/admin"
                                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-amber-700 bg-amber-100 hover:bg-amber-200 border border-amber-200 transition-all"
                                >
                                    Admin
                                </Link>
                            )}

                            {/* User avatar dropdown */}
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-white border border-stone-200 hover:border-amber-300 hover:bg-amber-50/50 transition-all shadow-sm group"
                            >
                                <div className="w-7 h-7 rounded-lg overflow-hidden bg-stone-100 flex-shrink-0">
                                    {user.photoURL ? (
                                        <Image
                                            src={user.photoURL}
                                            alt={user.displayName || "User"}
                                            width={28}
                                            height={28}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-stone-500 font-bold text-xs">
                                            {user.displayName?.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <span className="text-sm font-semibold text-stone-800">{user.displayName?.split(' ')[0]}</span>
                                {nuravyaUser?.plan && nuravyaUser.plan !== "free" && (
                                    <Crown size={12} className="text-amber-500" />
                                )}
                                <ChevronDown size={14} className={cn("text-stone-400 transition-transform duration-200", userMenuOpen ? "rotate-180" : "")} />
                            </button>

                            {/* Dropdown menu */}
                            <AnimatePresence>
                                {userMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl border border-stone-100 shadow-xl overflow-hidden z-50"
                                    >
                                        <div className="p-3 border-b border-stone-50">
                                            <p className="text-xs font-bold text-stone-900 truncate">{user.displayName}</p>
                                            <p className="text-[11px] text-stone-400 truncate">{user.email}</p>
                                        </div>
                                        <div className="py-1">
                                            {[
                                                { icon: User, label: "Profile", href: "/profile" },
                                                { icon: Settings, label: "Settings", href: "/settings" },
                                                { icon: Brain, label: "Memory", href: "/memory" },
                                                { icon: TrendingUp, label: "Insights", href: "/insights" },
                                            ].map((item) => (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    onClick={() => setUserMenuOpen(false)}
                                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50 hover:text-amber-600 transition-colors group"
                                                >
                                                    <item.icon size={15} className="text-stone-400 group-hover:text-amber-500 transition-colors" />
                                                    {item.label}
                                                </Link>
                                            ))}
                                        </div>
                                        <div className="border-t border-stone-50 py-1">
                                            <button
                                                onClick={() => { logout(); setUserMenuOpen(false); }}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                                            >
                                                <LogOut size={15} />
                                                Sign Out
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="rounded-xl text-stone-600 hover:text-stone-900" onClick={loginWithGoogle}>
                                Log In
                            </Button>
                            <Link href="/#waitlist">
                                <Button size="sm" className="rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold px-4">
                                    Get Early Access
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}
