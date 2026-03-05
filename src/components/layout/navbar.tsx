"use client"

import * as React from "react"
import Link from "next/link"
import { useScroll, useMotionValueEvent } from "framer-motion"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth/auth-provider"

export function Navbar() {
    const { scrollY } = useScroll()
    const [isScrolled, setIsScrolled] = React.useState(false)
    const pathname = usePathname()
    const { user, loginWithGoogle, logout } = useAuth()

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 50)
    })

    if (pathname?.startsWith('/chat')) {
        return null;
    }

    return (
        <header
            className={cn(
                "hidden md:block fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                isScrolled
                    ? "bg-[#FFFBEB]/85 backdrop-blur-md border-b border-amber-500/10 py-3"
                    : "bg-transparent py-5"
            )}
        >
            <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-2xl font-bold font-heading text-stone-800">Nuravya AI</span>
                </Link>

                {/* Desktop Nav only — mobile uses BottomNav */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link href="/about" className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors">
                        Mission
                    </Link>
                    <Link href="/features" className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors">
                        Features
                    </Link>
                    <Link href="/blog" className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors">
                        Blog
                    </Link>
                    <Link href="/science" className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors">
                        Science
                    </Link>
                    <Link href="/pricing" className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors">
                        Pricing
                    </Link>
                </nav>

                <div className="hidden md:flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <Link href="/memory" className="text-sm font-medium text-stone-600 hover:text-amber-600 transition-colors">
                                Memory
                            </Link>
                            <Link href="/insights" className="text-sm font-medium text-stone-600 hover:text-purple-600 transition-colors">
                                Insights
                            </Link>
                            <Link href="/profile" className="text-sm font-medium text-stone-600 hover:text-amber-600 transition-colors">
                                {user.displayName?.split(' ')[0]}
                            </Link>
                            <Button size="sm" variant="outline" className="rounded-full" onClick={logout}>Logout</Button>
                        </div>
                    ) : (
                        <Button size="sm" className="rounded-full" onClick={loginWithGoogle}>Login</Button>
                    )}
                    <Link href="/#waitlist">
                        <Button size="sm" className="rounded-full">Join Waitlist</Button>
                    </Link>
                </div>

                {/* Mobile: Waitlist CTA only — BottomNav handles navigation */}
                <div className="md:hidden">
                    {!user && (
                        <Button size="sm" variant="ghost" className="rounded-full text-xs mr-2" onClick={loginWithGoogle}>Login</Button>
                    )}
                    <Link href="/#waitlist">
                        <Button size="sm" className="rounded-full text-xs px-3 py-1.5">Join Waitlist</Button>
                    </Link>
                </div>
            </div>
        </header>
    )
}
