"use client"

import * as React from "react"
import Link from "next/link"
import { useScroll, useMotionValueEvent } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export function Navbar() {
    const { scrollY } = useScroll()
    const [isScrolled, setIsScrolled] = React.useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 50)
    })

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                isScrolled
                    ? "bg-background/80 backdrop-blur-md border-b border-border/50 py-3"
                    : "bg-transparent py-5"
            )}
        >
            <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-2xl font-bold font-heading text-stone-800">Haven AI</span>
                </Link>

                {/* Desktop Nav */}
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
                    <Link href="/#waitlist">
                        <Button size="sm" className="rounded-full">Join Waitlist</Button>
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden p-2 text-stone-600"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border p-4 flex flex-col gap-4 shadow-lg animate-in slide-in-from-top-5">
                    <Link
                        href="/about"
                        className="text-base font-medium p-2 hover:bg-muted rounded-md"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Mission
                    </Link>
                    <Link
                        href="/features"
                        className="text-base font-medium p-2 hover:bg-muted rounded-md"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Features
                    </Link>
                    <Link
                        href="/blog"
                        className="text-base font-medium p-2 hover:bg-muted rounded-md"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Blog
                    </Link>
                    <Link
                        href="/science"
                        className="text-base font-medium p-2 hover:bg-muted rounded-md"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Science
                    </Link>
                    <Link
                        href="/pricing"
                        className="text-base font-medium p-2 hover:bg-muted rounded-md"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Pricing
                    </Link>
                    <div className="flex flex-col gap-2 mt-2">
                        <Link href="/#waitlist" onClick={() => setMobileMenuOpen(false)}>
                            <Button className="w-full">Join Waitlist</Button>
                        </Link>
                    </div>
                </div>
            )}
        </header>
    )
}
