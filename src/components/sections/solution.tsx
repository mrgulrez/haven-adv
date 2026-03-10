"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import {
    Mic, Brain, Heart, Zap, Clock, Lock, BarChart3, Sparkles,
    Star, ArrowRight
} from "lucide-react"
import Link from "next/link"
import { FEATURES as FEATURE_CONFIG, PLANS } from "@/lib/site.config"

// ─── Icon map ─────────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>> = {
    Mic, Brain, Sparkles, BarChart3, Clock, Lock,
}

// ─── Color map ─────────────────────────────────────────────────────────────────

const COLOR_MAP: Record<string, {
    bg: string; text: string; border: string; badgeBg: string; badgeText: string
}> = {
    amber: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200", badgeBg: "bg-amber-100", badgeText: "text-amber-700" },
    purple: { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200", badgeBg: "bg-purple-100", badgeText: "text-purple-700" },
    rose: { bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-200", badgeBg: "bg-rose-100", badgeText: "text-rose-700" },
    blue: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200", badgeBg: "bg-blue-100", badgeText: "text-blue-700" },
    emerald: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200", badgeBg: "bg-emerald-100", badgeText: "text-emerald-700" },
    stone: { bg: "bg-stone-100", text: "text-stone-600", border: "border-stone-200", badgeBg: "bg-stone-200", badgeText: "text-stone-700" },
}

// ─── Live mini-demos (stable, deterministic animations only) ──────────────────

const WAVEFORM_BARS = [6, 10, 14, 8, 18, 12, 20, 9, 15, 7, 19, 11, 16, 8, 13, 10, 17, 9]

function WaveformDemo() {
    return (
        <div className="flex items-end gap-0.5 h-8">
            {WAVEFORM_BARS.map((h, i) => (
                <motion.div key={i}
                    animate={{ height: [h + "px", Math.min(h + 8, 22) + "px", h + "px"] }}
                    transition={{ duration: 0.65 + i * 0.04, repeat: Infinity, delay: i * 0.05, ease: "easeInOut" }}
                    className="w-1.5 rounded-full bg-amber-400/70 flex-shrink-0"
                    style={{ height: h + "px" }}
                />
            ))}
        </div>
    )
}

function MemoryDemo() {
    const tags = ["Loves jazz 🎷", "Dog: Mochi 🐶", "Big presentation", "Nervous yesterday", "Garden project"]
    return (
        <div className="flex flex-wrap gap-1.5">
            {tags.map((t, i) => (
                <motion.span key={i}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.12 }}
                    className="px-2.5 py-1 bg-purple-100 text-purple-700 text-[10px] font-semibold rounded-full"
                >
                    {t}
                </motion.span>
            ))}
        </div>
    )
}

function PersonasDemo() {
    const chars = [
        { n: "Aria", r: "Warm mentor", c: "bg-amber-500" },
        { n: "Sage", r: "Philosopher", c: "bg-purple-500" },
        { n: "Nova", r: "Bold coach", c: "bg-rose-500" },
    ]
    return (
        <div className="flex gap-2">
            {chars.map((c, i) => (
                <motion.div key={i}
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12 }}
                    className="flex-1 bg-white rounded-xl p-2.5 border border-rose-100 text-center"
                >
                    <div className={`w-8 h-8 ${c.c} rounded-full mx-auto mb-1 flex items-center justify-center text-white text-xs font-bold`}>{c.n[0]}</div>
                    <p className="text-[10px] font-bold text-stone-800">{c.n}</p>
                    <p className="text-[9px] text-stone-400">{c.r}</p>
                </motion.div>
            ))}
        </div>
    )
}

function ChartDemo() {
    const bars = [40, 60, 50, 75, 65, 85, 70]
    const days = ["M", "T", "W", "T", "F", "S", "S"]
    return (
        <div className="flex gap-1 items-end h-10">
            {bars.map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                    <motion.div
                        initial={{ height: 0 }} animate={{ height: `${h}%` }}
                        transition={{ delay: i * 0.07, duration: 0.45 }}
                        className="w-full rounded-t-sm bg-gradient-to-t from-blue-400 to-blue-300"
                        style={{ maxHeight: "32px", minHeight: "3px" }}
                    />
                    <span className="text-[8px] text-stone-400">{days[i]}</span>
                </div>
            ))}
        </div>
    )
}

function AvailabilityDemo() {
    return (
        <div className="flex items-center gap-3">
            {["6 AM", "12 PM", "9 PM", "3 AM"].map((t, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" style={{ animationDelay: `${i * 0.4}s` }} />
                    <span className="text-[9px] text-stone-400">{t}</span>
                </div>
            ))}
        </div>
    )
}

function PrivacyDemo() {
    return (
        <div className="flex flex-col gap-1.5">
            {["AES-256 encryption", "Zero data selling", "User-owned memory"].map((l, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.14 }}
                    className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-stone-900 flex items-center justify-center flex-shrink-0">
                        <span className="text-[8px] text-emerald-400 font-bold">✓</span>
                    </div>
                    <span className="text-[11px] text-stone-600">{l}</span>
                </motion.div>
            ))}
        </div>
    )
}

const DEMO_MAP: Record<string, React.ComponentType> = {
    voice: WaveformDemo,
    memory: MemoryDemo,
    personas: PersonasDemo,
    insights: ChartDemo,
    always: AvailabilityDemo,
    private: PrivacyDemo,
}

// ─── Feature Card ─────────────────────────────────────────────────────────────

function FeatureCard({ feature, index }: { feature: typeof FEATURE_CONFIG[number]; index: number }) {
    const ref = useRef<HTMLDivElement>(null)
    const inView = useInView(ref, { once: true, margin: "-8%" })
    const c = COLOR_MAP[feature.badgeColor] ?? COLOR_MAP.stone
    const Icon = ICON_MAP[feature.icon] ?? Mic
    const Demo = DEMO_MAP[feature.id]

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className={`bg-white rounded-3xl border-2 ${c.border} p-7 flex flex-col gap-5 shadow-sm hover:shadow-lg transition-all duration-400 group relative overflow-hidden`}
        >
            <div className={`absolute inset-0 ${c.bg} opacity-0 group-hover:opacity-50 transition-opacity duration-500 rounded-3xl`} />

            <div className="relative z-10">
                {/* Top row */}
                <div className="flex items-start justify-between mb-4">
                    <div className={`p-3.5 rounded-2xl ${c.bg} ${c.text} group-hover:scale-110 transition-transform duration-300`}>
                        <Icon size={20} strokeWidth={2} />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <span className={`px-2.5 py-0.5 ${c.badgeBg} ${c.badgeText} rounded-full text-[9px] font-bold uppercase tracking-widest`}>
                            {feature.badge}
                        </span>
                        <div className="text-right">
                            <p className="text-base font-black text-stone-900 leading-none">{feature.stat.value}</p>
                            <p className="text-[10px] text-stone-400">{feature.stat.label}</p>
                        </div>
                    </div>
                </div>

                <h3 className="text-base font-bold font-heading text-stone-900 mb-2">{feature.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed font-light">{feature.description}</p>

                <div className={`mt-5 pt-4 border-t ${c.border}`}>
                    {Demo && <Demo />}
                </div>
            </div>
        </motion.div>
    )
}

// ─── Main Section ─────────────────────────────────────────────────────────────

export function Solution() {
    const headerRef = useRef<HTMLDivElement>(null)
    const headerInView = useInView(headerRef, { once: true })

    return (
        <section id="features" className="relative bg-[#FFFBEB] py-24 md:py-32 overflow-hidden">

            {/* Background grid */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.025]" style={{
                backgroundImage: "linear-gradient(#78716c 1px, transparent 1px),linear-gradient(90deg, #78716c 1px, transparent 1px)",
                backgroundSize: "64px 64px",
            }} />

            {/* Dark header banner */}
            <div className="container px-4 md:px-6 mx-auto max-w-6xl mb-16">
                <motion.div
                    ref={headerRef}
                    initial={{ opacity: 0, y: 24 }}
                    animate={headerInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.65 }}
                    className="bg-stone-950 rounded-[2rem] p-10 md:p-14 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl" />

                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                        <div className="max-w-2xl">
                            <p className="text-amber-400 text-[11px] font-bold uppercase tracking-[0.25em] mb-3">Why Nuravya</p>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-white tracking-tight leading-tight mb-4">
                                Built for{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">real connection.</span>
                                <br />Not just chat.
                            </h2>
                            <p className="text-stone-400 text-base leading-relaxed font-light">
                                Nuravya is engineered around emotional intelligence — with memory, voice, and genuine
                                presence to make every conversation feel like it matters.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 flex-shrink-0">
                            {[
                                { v: "Voice + Text", l: "Multi-modal" },
                                { v: "100%", l: "Private" },
                                { v: "24/7", l: "Available" },
                                { v: "E2E", l: "Encrypted" },
                            ].map((s, i) => (
                                <motion.div key={i}
                                    initial={{ opacity: 0, scale: 0.85 }}
                                    animate={headerInView ? { opacity: 1, scale: 1 } : {}}
                                    transition={{ delay: 0.3 + i * 0.08 }}
                                    className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center"
                                >
                                    <p className="text-base font-black text-white">{s.v}</p>
                                    <p className="text-[10px] text-stone-500 mt-0.5">{s.l}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Feature bento grid */}
            <div className="container px-4 md:px-6 mx-auto max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {FEATURE_CONFIG.map((f, i) => (
                        <FeatureCard key={f.id} feature={f} index={i} />
                    ))}
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mt-14 flex flex-col md:flex-row items-center justify-between gap-6 bg-white rounded-3xl border border-stone-100 shadow-sm p-8"
                >
                    <div>
                        <h3 className="text-2xl font-bold font-heading text-stone-900 mb-1">Ready to try Nuravya?</h3>
                        <p className="text-stone-500 text-sm">Free to start. No credit card needed.</p>
                    </div>
                    <div className="flex gap-3 flex-shrink-0">
                        <Link href="/chat">
                            <button className="flex items-center gap-2 px-7 py-3.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm rounded-2xl transition-all shadow-md shadow-amber-100 hover:scale-105">
                                <Mic size={15} /> Start Free
                            </button>
                        </Link>
                        <Link href="/pricing">
                            <button className="flex items-center gap-2 px-7 py-3.5 border border-stone-200 text-stone-700 hover:bg-stone-50 font-semibold text-sm rounded-2xl transition-all">
                                View Plans <ArrowRight size={13} />
                            </button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
