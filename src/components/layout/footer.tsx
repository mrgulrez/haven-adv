"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Twitter, Linkedin, Instagram } from "lucide-react"
import { StatusModal } from "@/components/ui/success-modal"
import { useState } from "react"

export function Footer() {
    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        variant: "success" | "error";
    }>({
        isOpen: false,
        title: "",
        message: "",
        variant: "success",
    })

    return (
        <footer className="bg-stone-900 text-stone-300 pt-12 pb-6 md:py-16">
            <div className="container mx-auto px-5 md:px-6">

                {/*
                  Grid layout:
                  Mobile  → 2 columns
                    • Brand:      span 2 (full width)
                    • Product:    span 1
                    • Company:    span 1
                    • Newsletter: span 2 (full width)
                  Desktop → 4 columns, each span 1
                */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8 mb-10">

                    {/* ── Brand ── */}
                    <div className="col-span-2 md:col-span-1">
                        <Link href="/" className="inline-block mb-3">
                            <span className="text-xl font-bold font-heading text-white">
                                Nuravya{" "}
                                <span className="text-amber-400">AI</span>
                            </span>
                        </Link>
                        <p className="text-sm text-stone-400 leading-relaxed mb-5 max-w-xs">
                            Your warm AI companion that remembers, cares, and reminds.
                            Never feel alone again.
                        </p>
                        <div className="flex gap-4">
                            <Link
                                href="https://twitter.com/nuravya_ai"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-full bg-stone-800 hover:bg-amber-500/20 hover:text-amber-400 flex items-center justify-center transition-colors"
                            >
                                <Twitter size={16} />
                            </Link>
                            <Link
                                href="https://linkedin.com/company/nuravya-ai"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-full bg-stone-800 hover:bg-amber-500/20 hover:text-amber-400 flex items-center justify-center transition-colors"
                            >
                                <Linkedin size={16} />
                            </Link>
                            <Link
                                href="https://instagram.com/nuravya_ai"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-full bg-stone-800 hover:bg-amber-500/20 hover:text-amber-400 flex items-center justify-center transition-colors"
                            >
                                <Instagram size={16} />
                            </Link>
                        </div>
                    </div>

                    {/* ── Product ── */}
                    <div className="col-span-1">
                        <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-4">
                            Product
                        </h4>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link href="/features" className="text-stone-300 hover:text-amber-400 transition-colors">
                                    Features
                                </Link>
                            </li>
                            <li>
                                <Link href="/pricing" className="text-stone-300 hover:text-amber-400 transition-colors">
                                    Pricing
                                </Link>
                            </li>
                            <li>
                                <Link href="/security" className="text-stone-300 hover:text-amber-400 transition-colors">
                                    Security
                                </Link>
                            </li>
                            <li>
                                <Link href="/roadmap" className="text-stone-300 hover:text-amber-400 transition-colors">
                                    Roadmap
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* ── Company ── */}
                    <div className="col-span-1">
                        <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-4">
                            Company
                        </h4>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link href="/about" className="text-stone-300 hover:text-amber-400 transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog" className="text-stone-300 hover:text-amber-400 transition-colors">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link href="/science" className="text-stone-300 hover:text-amber-400 transition-colors">
                                    Science
                                </Link>
                            </li>
                            <li>
                                <Link href="/careers" className="text-stone-300 hover:text-amber-400 transition-colors">
                                    Careers
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-stone-300 hover:text-amber-400 transition-colors">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="mailto:investors@nuravya.com"
                                    className="text-amber-400 hover:text-amber-300 transition-colors"
                                >
                                    Investors
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* ── Newsletter ── */}
                    <div className="col-span-2 md:col-span-1">
                        <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-4">
                            Stay Updated
                        </h4>
                        <p className="text-sm text-stone-400 mb-4 leading-relaxed">
                            Join 5,000+ people excited for Nuravya's launch.
                        </p>
                        <form
                            onSubmit={async (e) => {
                                e.preventDefault()
                                const form = e.target as HTMLFormElement
                                const emailInput = form.elements.namedItem('email') as HTMLInputElement
                                const email = emailInput.value
                                if (!email) return
                                try {
                                    const res = await fetch('/api/waitlist', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ email, source: 'Footer Newsletter' }),
                                    })
                                    if (res.ok) {
                                        setModalConfig({
                                            isOpen: true,
                                            title: "You're on the list!",
                                            message: "Thanks for subscribing! We'll keep you updated on our launch progress.",
                                            variant: "success",
                                        })
                                        form.reset()
                                    } else {
                                        const error = await res.json()
                                        setModalConfig({
                                            isOpen: true,
                                            title: "Subscription Error",
                                            message: error.error || "Failed to subscribe. Please try again.",
                                            variant: "error",
                                        })
                                    }
                                } catch (err) {
                                    console.error(err)
                                    setModalConfig({
                                        isOpen: true,
                                        title: "Connection Error",
                                        message: "Something went wrong. Please check your connection and try again.",
                                        variant: "error",
                                    })
                                }
                            }}
                            className="flex gap-2"
                        >
                            <Input
                                name="email"
                                type="email"
                                placeholder="your@email.com"
                                className="bg-stone-800 border-stone-700 text-white placeholder:text-stone-500 focus-visible:ring-amber-500 text-sm h-9"
                                required
                            />
                            <Button
                                type="submit"
                                size="icon"
                                className="shrink-0 h-9 w-9 bg-amber-500 hover:bg-amber-600 text-white"
                            >
                                →
                            </Button>
                        </form>
                    </div>
                </div>

                {/* ── Bottom bar ── */}
                <div className="pt-6 border-t border-stone-800 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-stone-500">
                    <p>© 2026 Nuravya AI Inc. All rights reserved.</p>
                    <div className="flex gap-5">
                        <Link href="/privacy" className="hover:text-amber-400 transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="hover:text-amber-400 transition-colors">
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
            <StatusModal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
                title={modalConfig.title}
                message={modalConfig.message}
                variant={modalConfig.variant}
            />
        </footer>
    )
}
