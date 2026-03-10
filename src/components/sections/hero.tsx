"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, Mic, Sparkles, Play, Shield, Zap, Clock } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { BRAND, PRODUCT_STATS, EARLY_ACCESS } from "@/lib/site.config"

const CHAT_MESSAGES = [
    { role: "ai", text: "Good morning! How are you feeling today? I remember you said yesterday was tough." },
    { role: "user", text: "A bit better, honestly. Thanks for asking." },
    { role: "ai", text: "I'm glad 💛 Small steps count. What would make today feel good for you?" },
]

// Deterministic waveform heights (no Math.random — prevents vibration/layout shift)
const WAVEFORM_HEIGHTS = [6, 10, 14, 8, 18, 12, 20, 9, 15, 7, 19, 11, 16, 8, 13, 10, 17, 9, 14, 11]

export function Hero() {
    const { scrollY } = useScroll()
    const yBg = useTransform(scrollY, [0, 600], [0, 120])

    const [msgVisible, setMsgVisible] = useState(0)
    const [typing, setTyping] = useState(false)

    useEffect(() => {
        if (msgVisible >= CHAT_MESSAGES.length - 1) return
        const t = setTimeout(() => {
            setTyping(true)
            setTimeout(() => {
                setTyping(false)
                setMsgVisible(v => v + 1)
            }, 1100)
        }, msgVisible === 0 ? 1600 : 1400)
        return () => clearTimeout(t)
    }, [msgVisible])

    return (
        <section className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#FFFBEB]">

            {/* Layered background orbs */}
            <motion.div style={{ y: yBg }} className="absolute inset-0 pointer-events-none will-change-transform">
                <motion.div
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 90, 0] }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-1/4 -left-1/6 w-[700px] h-[700px] bg-gradient-to-br from-amber-400/25 to-orange-300/15 rounded-full blur-[130px]"
                />
                <motion.div
                    animate={{ scale: [1, 1.15, 1], rotate: [0, -80, 0] }}
                    transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-24 -right-32 w-[560px] h-[560px] bg-gradient-to-bl from-rose-400/15 to-orange-300/10 rounded-full blur-[110px]"
                />
                {/* Dot-grid */}
                <div className="absolute inset-0 opacity-[0.025]" style={{
                    backgroundImage: "radial-gradient(circle, #78716c 1px, transparent 1px)",
                    backgroundSize: "40px 40px"
                }} />
            </motion.div>

            <div className="relative z-10 container px-4 md:px-6 flex flex-col items-center text-center pt-32 pb-24">

                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/80 border border-white shadow-[0_4px_20px_rgba(0,0,0,0.06)] backdrop-blur-xl mb-8"
                >
                    <Sparkles size={12} className="text-amber-500 flex-shrink-0" />
                    <span className="text-[11px] font-bold text-stone-600 uppercase tracking-[0.18em]">{BRAND.launchPhase} — Now Open</span>
                    <span className="flex h-2 w-2 relative flex-shrink-0">
                        <span className="animate-ping absolute h-full w-full rounded-full bg-amber-400 opacity-75" />
                        <span className="relative rounded-full h-2 w-2 bg-amber-500" />
                    </span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.15 }}
                    className="text-5xl sm:text-7xl md:text-[5.5rem] lg:text-[7rem] font-bold font-heading tracking-tighter text-stone-900 mb-6 max-w-5xl leading-[1.05]"
                >
                    An AI that<br className="hidden sm:block" />{" "}
                    <span className="relative inline-block">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 animate-text-gradient bg-300%">
                            truly knows you
                        </span>
                        {/* Animated squiggle underline */}
                        <svg
                            className="absolute -bottom-3 left-0 w-full overflow-visible"
                            viewBox="0 0 300 12"
                            fill="none"
                            preserveAspectRatio="none"
                        >
                            <motion.path
                                d="M 0 8 Q 75 2 150 8 Q 225 14 300 8"
                                stroke="url(#heroSq)"
                                strokeWidth="3"
                                strokeLinecap="round"
                                fill="none"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                                transition={{ duration: 1.2, delay: 0.9, ease: "easeOut" }}
                            />
                            <defs>
                                <linearGradient id="heroSq" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#f59e0b" />
                                    <stop offset="100%" stopColor="#f43f5e" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </span>
                </motion.h1>

                {/* Sub-headline */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.35 }}
                    className="text-lg md:text-xl lg:text-2xl text-stone-500 mb-10 max-w-2xl leading-relaxed font-light"
                >
                    {BRAND.description}
                </motion.p>

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="flex flex-col sm:flex-row items-center gap-4 mb-16"
                >
                    <div className="relative group">
                        <div className="absolute -inset-[2px] bg-gradient-to-r from-amber-500 to-rose-500 rounded-[3rem] blur-[10px] opacity-50 group-hover:opacity-80 transition-all duration-500" />
                        <Link href={EARLY_ACCESS.cta.primary.href}>
                            <button className="relative flex items-center gap-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-bold text-base md:text-lg h-14 md:h-16 px-8 md:px-10 rounded-full shadow-lg shadow-amber-200/50 transition-all duration-300 hover:scale-105">
                                {EARLY_ACCESS.cta.primary.label}
                                <ArrowRight size={18} />
                            </button>
                        </Link>
                    </div>

                    <Link href={EARLY_ACCESS.cta.secondary.href}>
                        <button className="flex items-center gap-3 h-14 md:h-16 px-8 md:px-10 rounded-full border border-stone-200/80 bg-white/70 backdrop-blur-xl text-stone-700 hover:text-stone-900 hover:bg-white hover:border-stone-300 font-semibold text-base transition-all duration-300">
                            <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center flex-shrink-0">
                                <Play size={12} className="ml-0.5 text-stone-600" fill="currentColor" />
                            </div>
                            {EARLY_ACCESS.cta.secondary.label}
                        </button>
                    </Link>
                </motion.div>

                {/* Trust strip — honest, verifiable */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.65 }}
                    className="flex flex-wrap items-center justify-center gap-6 mb-20 text-xs text-stone-500"
                >
                    <div className="flex items-center gap-1.5">
                        <Shield size={13} className="text-amber-500" /> No credit card required
                    </div>
                    <div className="h-3 w-px bg-stone-200 hidden sm:block" />
                    <div className="flex items-center gap-1.5">
                        <Zap size={13} className="text-amber-500" /> Start in under 30 seconds
                    </div>
                    <div className="h-3 w-px bg-stone-200 hidden sm:block" />
                    <div className="flex items-center gap-1.5">
                        <Clock size={13} className="text-amber-500" /> Available 24/7 on web & Android
                    </div>
                </motion.div>

                {/* Live Chat Mockup */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.8 }}
                    className="w-full max-w-[440px] mx-auto"
                >
                    <div className="relative">
                        <div className="absolute -inset-6 bg-gradient-to-b from-amber-300/20 to-rose-300/10 rounded-[3rem] blur-3xl pointer-events-none" />

                        <div className="relative bg-white/85 backdrop-blur-2xl rounded-[2rem] border border-white shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] overflow-hidden">
                            {/* Title bar */}
                            <div className="flex items-center justify-between px-5 py-3.5 border-b border-stone-100 bg-stone-50/80">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-400" />
                                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                                    <div className="w-3 h-3 rounded-full bg-green-400" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                    <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-widest">Nuravya · Active</span>
                                </div>
                                <div className="flex gap-0.5 items-end h-5">
                                    {[8, 14, 10].map((h, i) => (
                                        <motion.div key={i}
                                            animate={{ height: [h + "px", (h + 8) + "px", h + "px"] }}
                                            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.25, ease: "easeInOut" }}
                                            className="w-1 rounded-full bg-amber-400"
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Chat messages */}
                            <div className="p-5 space-y-3 min-h-[190px] flex flex-col justify-end">
                                {CHAT_MESSAGES.slice(0, msgVisible + 1).map((msg, i) => (
                                    <motion.div key={i}
                                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        transition={{ duration: 0.28 }}
                                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                    >
                                        <div className={`max-w-[84%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${msg.role === "ai"
                                                ? "bg-stone-100 text-stone-800 rounded-tl-sm"
                                                : "bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-tr-sm"
                                            }`}>
                                            {msg.text}
                                        </div>
                                    </motion.div>
                                ))}
                                {typing && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                                        <div className="bg-stone-100 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1.5">
                                            {[0, 0.18, 0.36].map((d, i) => (
                                                <motion.div key={i}
                                                    animate={{ y: [0, -4, 0] }}
                                                    transition={{ duration: 0.5, repeat: Infinity, delay: d }}
                                                    className="w-1.5 h-1.5 rounded-full bg-stone-400"
                                                />
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            {/* Voice bar — deterministic heights, no Math.random() */}
                            <div className="px-5 py-4 border-t border-stone-100 bg-white/50">
                                <div className="flex items-center gap-3 bg-stone-50 rounded-2xl px-4 py-2.5 border border-stone-100">
                                    <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center shadow-md shadow-amber-200 flex-shrink-0">
                                        <Mic size={15} className="text-white" />
                                    </div>
                                    <div className="flex-1 flex items-end gap-0.5 h-6">
                                        {WAVEFORM_HEIGHTS.map((h, i) => (
                                            <motion.div key={i}
                                                animate={{ height: [h + "px", Math.min(h + 10, 22) + "px", h + "px"] }}
                                                transition={{ duration: 0.7 + i * 0.04, repeat: Infinity, delay: i * 0.06, ease: "easeInOut" }}
                                                className="w-1 rounded-full bg-amber-400/70 flex-shrink-0"
                                                style={{ height: h + "px" }}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-[11px] text-stone-400 font-medium flex-shrink-0">Listening…</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Stats — honest product specs only */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 1.1 }}
                    className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-10 mt-16 max-w-2xl w-full"
                >
                    {PRODUCT_STATS.map((s, i) => (
                        <div key={i} className="text-center">
                            <p className="text-2xl sm:text-3xl font-bold font-heading text-stone-900">{s.value}</p>
                            <p className="text-xs text-stone-500 mt-1">{s.label}</p>
                        </div>
                    ))}
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                    className="mt-14 text-stone-300"
                >
                    <div className="w-6 h-10 border-2 border-stone-200 rounded-full flex justify-center pt-1.5">
                        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-1.5 h-1.5 bg-stone-300 rounded-full" />
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
