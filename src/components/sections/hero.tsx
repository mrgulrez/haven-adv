"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, Brain, Clock, Mic, Shield, Sparkles, Zap } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { BRAND, EARLY_ACCESS, PRODUCT_STATS } from "@/lib/site.config"
import { Button } from "@/components/ui/button"

const CHAT_MESSAGES = [
    { role: "ai", text: "Good morning. Want to start with a quick check-in?" },
    { role: "user", text: "Yes. Yesterday was heavy, but I slept better." },
    { role: "ai", text: "I remember you wanted a slower morning. Let us choose one small step." },
]

const WAVEFORM_HEIGHTS = [6, 10, 14, 8, 18, 12, 20, 9, 15, 7, 19, 11, 16, 8, 13, 10, 17, 9, 14, 11]

const productPillars = [
    { icon: Brain, label: "Memory with consent" },
    { icon: Mic, label: "Voice and text" },
    { icon: Shield, label: "Private by design" },
]

export function Hero() {
    const { scrollY } = useScroll()
    const yBg = useTransform(scrollY, [0, 600], [0, 90])
    const [msgVisible, setMsgVisible] = useState(0)
    const [typing, setTyping] = useState(false)

    useEffect(() => {
        if (msgVisible >= CHAT_MESSAGES.length - 1) return
        const t = setTimeout(() => {
            setTyping(true)
            const inner = setTimeout(() => {
                setTyping(false)
                setMsgVisible((v) => v + 1)
            }, 950)
            return () => clearTimeout(inner)
        }, msgVisible === 0 ? 1400 : 1300)
        return () => clearTimeout(t)
    }, [msgVisible])

    return (
        <section className="relative min-h-screen w-full overflow-hidden bg-[#FFFBEB]">
            <motion.div style={{ y: yBg }} className="absolute inset-0 pointer-events-none will-change-transform">
                <div className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage: "radial-gradient(circle, #78716c 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
                <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />
            </motion.div>

            <div className="relative z-10 container mx-auto px-4 md:px-6 pt-32 pb-20 md:pb-24">
                <div className="grid min-h-[calc(100vh-8rem)] items-center gap-12 lg:grid-cols-[1.08fr_0.92fr]">
                    <div className="text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45 }}
                            className="mb-7 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/80 px-4 py-2 shadow-sm backdrop-blur"
                        >
                            <Sparkles size={13} className="text-amber-600" />
                            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-stone-600">{BRAND.launchPhase} now open</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 26 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.75, delay: 0.1 }}
                            className="max-w-5xl text-5xl font-bold tracking-tight text-stone-950 sm:text-6xl md:text-7xl lg:text-[5.75rem] leading-[1.02] font-heading"
                        >
                            A calmer AI companion for the moments you usually carry alone.
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.65, delay: 0.25 }}
                            className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-stone-600 md:text-xl lg:mx-0"
                        >
                            {BRAND.description}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.38 }}
                            className="mt-9 flex flex-col items-center gap-3 sm:flex-row lg:justify-start"
                        >
                            <Button asChild size="lg" className="h-14 rounded-full px-8 text-base bg-stone-950 text-white hover:bg-stone-800">
                                <Link href={EARLY_ACCESS.cta.primary.href}>
                                    {EARLY_ACCESS.cta.primary.label}
                                    <ArrowRight size={18} className="ml-2" />
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="h-14 rounded-full px-8 text-base bg-white/75 backdrop-blur">
                                <Link href={EARLY_ACCESS.cta.secondary.href}>See the features</Link>
                            </Button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.55, delay: 0.52 }}
                            className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
                        >
                            {productPillars.map((pillar) => (
                                <span key={pillar.label} className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white/70 px-3.5 py-2 text-sm text-stone-700 shadow-sm">
                                    <pillar.icon size={15} className="text-amber-600" />
                                    {pillar.label}
                                </span>
                            ))}
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.65 }}
                            className="mt-8 flex flex-wrap items-center justify-center gap-5 text-xs text-stone-500 lg:justify-start"
                        >
                            <span className="flex items-center gap-1.5"><Shield size={13} className="text-amber-600" /> No credit card required</span>
                            <span className="hidden h-3 w-px bg-stone-200 sm:block" />
                            <span className="flex items-center gap-1.5"><Zap size={13} className="text-amber-600" /> Start in under 30 seconds</span>
                            <span className="hidden h-3 w-px bg-stone-200 sm:block" />
                            <span className="flex items-center gap-1.5"><Clock size={13} className="text-amber-600" /> Web and Android ready</span>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 36 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.75, delay: 0.35 }}
                        className="mx-auto w-full max-w-[460px]"
                    >
                        <div className="relative rounded-[2rem] border border-stone-200 bg-white/90 shadow-[0_30px_70px_-35px_rgba(0,0,0,0.35)] backdrop-blur overflow-hidden">
                            <div className="flex items-center justify-between border-b border-stone-100 bg-stone-50/80 px-5 py-3.5">
                                <div className="flex gap-1.5">
                                    <span className="h-3 w-3 rounded-full bg-red-400" />
                                    <span className="h-3 w-3 rounded-full bg-amber-400" />
                                    <span className="h-3 w-3 rounded-full bg-green-400" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-green-400" />
                                    <span className="text-[11px] font-semibold uppercase tracking-widest text-stone-400">Nuravya active</span>
                                </div>
                                <div className="flex h-5 items-end gap-0.5">
                                    {[8, 14, 10].map((h, i) => (
                                        <motion.span
                                            key={i}
                                            animate={{ height: [h + "px", h + 7 + "px", h + "px"] }}
                                            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.25, ease: "easeInOut" }}
                                            className="w-1 rounded-full bg-amber-400"
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="flex min-h-[210px] flex-col justify-end space-y-3 p-5">
                                {CHAT_MESSAGES.slice(0, msgVisible + 1).map((msg, i) => (
                                    <motion.div
                                        key={`${msg.role}-${i}`}
                                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        transition={{ duration: 0.28 }}
                                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                    >
                                        <div className={`max-w-[86%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${msg.role === "ai" ? "rounded-tl-sm bg-stone-100 text-stone-800" : "rounded-tr-sm bg-stone-950 text-white"}`}>
                                            {msg.text}
                                        </div>
                                    </motion.div>
                                ))}
                                {typing && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                                        <div className="flex gap-1.5 rounded-2xl rounded-tl-sm bg-stone-100 px-4 py-3">
                                            {[0, 0.18, 0.36].map((d, i) => (
                                                <motion.span key={i} animate={{ y: [0, -4, 0] }} transition={{ duration: 0.5, repeat: Infinity, delay: d }} className="h-1.5 w-1.5 rounded-full bg-stone-400" />
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            <div className="border-t border-stone-100 bg-white/55 px-5 py-4">
                                <div className="flex items-center gap-3 rounded-2xl border border-stone-100 bg-stone-50 px-4 py-2.5">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500 shadow-md shadow-amber-200">
                                        <Mic size={15} className="text-white" />
                                    </div>
                                    <div className="flex h-6 flex-1 items-end gap-0.5">
                                        {WAVEFORM_HEIGHTS.map((h, i) => (
                                            <motion.span
                                                key={i}
                                                animate={{ height: [h + "px", Math.min(h + 10, 22) + "px", h + "px"] }}
                                                transition={{ duration: 0.7 + i * 0.04, repeat: Infinity, delay: i * 0.06, ease: "easeInOut" }}
                                                className="w-1 shrink-0 rounded-full bg-amber-400/70"
                                                style={{ height: h + "px" }}
                                            />
                                        ))}
                                    </div>
                                    <span className="shrink-0 text-[11px] font-medium text-stone-400">Listening</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.8 }}
                    className="mx-auto mt-8 grid w-full max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6"
                >
                    {PRODUCT_STATS.map((s) => (
                        <div key={s.label} className="rounded-xl border border-stone-200 bg-white/65 p-4 text-center shadow-sm backdrop-blur">
                            <p className="text-xl font-bold text-stone-950 sm:text-2xl font-heading">{s.value}</p>
                            <p className="mt-1 text-xs text-stone-500">{s.label}</p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
