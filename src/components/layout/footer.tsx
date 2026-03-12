"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Twitter, Linkedin, Instagram, Heart, ArrowRight } from "lucide-react"
import { StatusModal } from "@/components/ui/success-modal"
import { useState } from "react"


import { PLANS, BRAND } from "@/lib/site.config"

const FOOTER_LINKS = {
    Product: [
        { label: "Features", href: "/features" },
        { label: "Pricing", href: "/pricing" },
        { label: "Security", href: "/security" },
        { label: "Roadmap", href: "/roadmap" },
    ],
    Company: [
        { label: "About", href: "/about" },
        { label: "Blog", href: "/blog" },
        { label: "Science", href: "/science" },
        { label: "Careers", href: "/careers" },
        { label: "Contact", href: "/contact" },
        { label: "Partners", href: `mailto:${BRAND.email.hello}` },
    ],
    Legal: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
    ],
}

const SOCIAL = [
    { icon: Twitter, href: BRAND.social.twitter, label: "Twitter" },
    { icon: Linkedin, href: BRAND.social.linkedin, label: "LinkedIn" },
    { icon: Instagram, href: BRAND.social.instagram, label: "Instagram" },
]

export function Footer() {
    const [email, setEmail] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const [modal, setModal] = useState<{ isOpen: boolean; title: string; message: string; variant: "success" | "error" }>({
        isOpen: false, title: "", message: "", variant: "success",
    })

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) return
        setSubmitting(true)
        try {
            // Plain fetch with relative URL → hits Next.js API route, not FastAPI
            const res = await fetch("/api/waitlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, source: "Footer Newsletter" }),
            })
            if (res.ok) {
                setModal({ isOpen: true, title: "You're on the list!", message: "Thanks for subscribing! We'll keep you updated.", variant: "success" })
                setEmail("")
            } else {
                const err = await res.json()
                setModal({ isOpen: true, title: "Subscription Error", message: err.error || "Failed to subscribe.", variant: "error" })
            }
        } catch {
            setModal({ isOpen: true, title: "Connection Error", message: "Check your connection and try again.", variant: "error" })
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <footer className="bg-stone-950 text-stone-400">

            {/* ── Newsletter banner ── */}
            <div className="border-b border-stone-800/60">
                <div className="container mx-auto px-6 py-12 md:py-14">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4">
                                <Heart size={12} className="text-amber-400" fill="currentColor" />
                                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">Stay Connected</span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold font-heading text-white leading-tight">
                                Be first to experience<br />
                                <span className="text-amber-400">Nuravya&apos;s launch</span>
                            </h2>
                            <p className="text-stone-500 text-sm mt-2">Get early access to authentic AI companionship.</p>
                        </div>
                        <form onSubmit={handleSubscribe} className="flex gap-2">
                            <input
                                type="email"
                                placeholder="your@email.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                className="flex-1 bg-stone-900 border border-stone-700 text-white placeholder:text-stone-500 text-sm px-4 py-2.5 rounded-xl outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                            />
                            <Button
                                type="submit"
                                disabled={submitting}
                                className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl px-5 flex items-center gap-2 flex-shrink-0 transition-all"
                            >
                                {submitting ? "…" : <><span>Join</span><ArrowRight size={14} /></>}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>

            {/* ── Main columns ── */}
            <div className="container mx-auto px-6 py-12 md:py-16">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8">

                    {/* Brand */}
                    <div className="col-span-2 md:col-span-2">
                        <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
                            <Image
                                src="/images/NuravyaLogo.svg"
                                alt="Nuravya AI Logo"
                                width={36}
                                height={36}
                                className="group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="flex flex-col">
                                <span className="text-xl font-bold font-heading text-white tracking-tight leading-none group-hover:text-amber-400 transition-colors">
                                    {BRAND.name} <span className="text-amber-500 font-extrabold">AI</span>
                                </span>
                                <span className="text-[9px] font-bold text-stone-600 uppercase tracking-[0.2em] leading-none mt-1">
                                    Engineering Connection
                                </span>
                            </div>
                        </Link>
                        <p className="text-sm text-stone-500 leading-relaxed mb-6 max-w-xs">
                            {BRAND.description}
                        </p>
                        <div className="flex gap-3">
                            {SOCIAL.map(s => (
                                <Link
                                    key={s.label}
                                    href={s.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={s.label}
                                    className="w-9 h-9 rounded-xl bg-stone-900 border border-stone-800 hover:bg-amber-500/15 hover:border-amber-500/30 hover:text-amber-400 flex items-center justify-center transition-all"
                                >
                                    <s.icon size={15} />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    {Object.entries(FOOTER_LINKS).map(([section, links]) => (
                        <div key={section} className="col-span-1">
                            <h4 className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-4">{section}</h4>
                            <ul className="space-y-3">
                                {links.map(link => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-stone-400 hover:text-amber-400 transition-colors duration-150"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Bottom bar ── */}
            <div className="border-t border-stone-800/60">
                <div className="container mx-auto px-6 py-5 flex flex-col md:flex-row justify-between items-center gap-3">
                    <p className="text-xs text-stone-600">
                        © 2026 Nuravya AI Inc. All rights reserved.
                    </p>
                    <div className="flex items-center gap-1 text-xs text-stone-600">
                        <span>Made with</span>
                        <Heart size={11} className="text-amber-500" fill="currentColor" />
                        <span>for human connection</span>
                    </div>
                    <div className="flex gap-5 text-xs">
                        <Link href="/privacy" className="text-stone-500 hover:text-amber-400 transition-colors">Privacy</Link>
                        <Link href="/terms" className="text-stone-500 hover:text-amber-400 transition-colors">Terms</Link>
                    </div>
                </div>
            </div>

            <StatusModal
                isOpen={modal.isOpen}
                onClose={() => setModal(m => ({ ...m, isOpen: false }))}
                title={modal.title}
                message={modal.message}
                variant={modal.variant}
            />
        </footer>
    )
}
