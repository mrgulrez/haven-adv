"use client"

import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion"
import { ArrowRight, Brain, Clock, Mic, Shield, Sparkles, Zap } from "lucide-react"
import Link from "next/link"
import { BRAND, EARLY_ACCESS, PRODUCT_STATS } from "@/lib/site.config"
import { Button } from "@/components/ui/button"

const WAVEFORM_HEIGHTS = [6, 10, 14, 8, 18, 12, 20, 9, 15, 7, 19, 11, 16, 8, 13, 10, 17, 9, 14, 11]

const productPillars = [
    { icon: Brain, label: "Memory with consent" },
    { icon: Mic, label: "Voice and text" },
    { icon: Shield, label: "Private by design" },
]

export function Hero() {
    const { scrollY } = useScroll()
    const yBg = useTransform(scrollY, [0, 600], [0, 90])

    // Hardware Accelerated 3D Tilt Physics
    const cardX = useMotionValue(0)
    const cardY = useMotionValue(0)
    const rotateX = useSpring(cardY, { stiffness: 80, damping: 25, mass: 0.5 })
    const rotateY = useSpring(cardX, { stiffness: 80, damping: 25, mass: 0.5 })

    return (
        <section className="relative w-full overflow-hidden bg-[#F7F1DC]">
            <motion.div style={{ y: yBg }} className="absolute inset-0 pointer-events-none transform-gpu will-change-transform">
                <div className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage: "radial-gradient(circle, #78716c 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
                <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />
                <div className="absolute -right-28 top-20 h-96 w-96 rounded-full bg-orange-300/20 blur-[90px]" />
                <div className="absolute left-[42%] top-44 h-72 w-72 rounded-full bg-white/60 blur-[90px]" />
            </motion.div>

            <div className="relative z-10 container mx-auto px-4 md:px-6 pt-20 pb-14 md:pt-28 md:pb-20">
                <div className="grid items-center gap-14 lg:grid-cols-[1.02fr_0.98fr] xl:gap-20">
                    <div className="text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-4 py-2 shadow-sm backdrop-blur-md"
                        >
                            <Sparkles size={13} className="text-amber-600 animate-pulse" />
                            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-stone-600">{BRAND.launchPhase} now open</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 26 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                            className="max-w-3xl text-5xl font-bold tracking-[-0.05em] text-[#0E0D0C] sm:text-6xl lg:text-[4.5rem] leading-[0.98] font-heading"
                        >
                            An AI companion that remembers <span className="text-[#F2811D]">what matters.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.65, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                            className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-stone-600 md:text-xl lg:mx-0"
                        >
                            {BRAND.description}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.38 }}
                            className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start"
                        >
                            <Button asChild size="lg" className="h-14 px-8 text-base shadow-lg shadow-orange-500/15 hover:shadow-orange-500/25 transition-all duration-300">
                                <Link href={EARLY_ACCESS.cta.primary.href}>
                                    {EARLY_ACCESS.cta.primary.label}
                                    <ArrowRight size={18} className="ml-2" />
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="h-14 px-8 text-base bg-white/75 backdrop-blur hover:bg-white transition-all duration-300">
                                <Link href={EARLY_ACCESS.cta.secondary.href}>See the features</Link>
                            </Button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.55, delay: 0.52 }}
                            className="mt-7 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
                        >
                            {productPillars.map((pillar) => (
                                <span key={pillar.label} className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white/70 px-3.5 py-2 text-sm text-stone-700 shadow-xs backdrop-blur-xs transition-transform hover:-translate-y-0.5">
                                    <pillar.icon size={15} className="text-amber-600" />
                                    {pillar.label}
                                </span>
                            ))}
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.65 }}
                            className="mt-6 flex flex-wrap items-center justify-center gap-5 text-xs text-stone-500 lg:justify-start"
                        >
                            <span className="flex items-center gap-1.5"><Shield size={13} className="text-amber-600" /> No credit card required</span>
                            <span className="hidden h-3 w-px bg-stone-200 sm:block" />
                            <span className="flex items-center gap-1.5"><Zap size={13} className="text-amber-600" /> Start in under 30 seconds</span>
                            <span className="hidden h-3 w-px bg-stone-200 sm:block" />
                            <span className="flex items-center gap-1.5"><Clock size={13} className="text-amber-600" /> Web and Android ready</span>
                        </motion.div>
                    </div>

                    {/* Right Side: World-Class Voice Session Composition */}
                    <div className="relative mx-auto w-full max-w-[480px] py-4 flex items-center justify-center">

                        {/* Center Phone Container */}
                        <div
                            className="relative w-full max-w-[350px] [perspective:1200px]"
                            onMouseMove={(event) => {
                                const rect = event.currentTarget.getBoundingClientRect()
                                const x = (event.clientX - rect.left) / rect.width - 0.5
                                const y = (event.clientY - rect.top) / rect.height - 0.5
                                cardX.set(x * 6)
                                cardY.set(y * -6)
                            }}
                            onMouseLeave={() => { cardX.set(0); cardY.set(0) }}
                        >
                            {/* Top Floating Trust Badge */}
                            <motion.div
                                animate={{ y: [0, -4, 0] }}
                                transition={{ duration: 4.5, repeat: Infinity, ease: [0.45, 0, 0.55, 1] }}
                                className="absolute -top-5 right-2 z-30 flex items-center gap-1.5 rounded-full border border-amber-200/80 bg-white/95 px-3.5 py-1.5 text-[11px] font-bold text-stone-800 shadow-md backdrop-blur-md transform-gpu"
                            >
                                <span className="text-amber-500">★ ★ ★ ★ ★</span>
                                <span className="text-stone-300">|</span>
                                <span>4.9/5</span>
                            </motion.div>

                            {/* Ambient Glow behind phone */}
                            <div className="absolute inset-2 -z-10 rounded-[3rem] bg-gradient-to-tr from-amber-500/25 via-orange-400/20 to-transparent blur-[40px]" />

                            {/* Main Mobile Mockup Frame with 3D Tilt */}
                            <motion.div
                                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                                className="relative overflow-hidden rounded-[2.5rem] border-[6px] border-stone-900 bg-stone-950 shadow-[0_30px_80px_-20px_rgba(28,25,23,0.35)] transform-gpu will-change-transform"
                            >
                                {/* Dark Waveform Session Header */}
                                <div className="bg-stone-950 p-5 text-left text-white border-b border-stone-800/80">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-medium text-stone-400 uppercase tracking-wider">Live Session</p>
                                            <h3 className="text-base font-bold text-stone-100 font-heading">Morning Check-In</h3>
                                        </div>
                                        <div className="flex items-center gap-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 px-2.5 py-1 text-[10px] font-semibold text-orange-400">
                                            <Sparkles size={11} className="animate-pulse" />
                                            <span>Empathy AI</span>
                                        </div>
                                    </div>

                                    {/* GPU-Accelerated Waveform Visualization & Timer */}
                                    <div className="mt-4 flex items-center justify-between rounded-xl bg-stone-900/90 border border-stone-800 p-3">
                                        <div className="flex h-6 items-center gap-1">
                                            {WAVEFORM_HEIGHTS.slice(0, 16).map((h, i) => (
                                                <motion.span
                                                    key={i}
                                                    animate={{ scaleY: [1, 1.6, 1] }}
                                                    transition={{ duration: 0.65 + i * 0.04, repeat: Infinity, delay: i * 0.04, ease: "easeInOut" }}
                                                    className="w-1 h-3 rounded-full bg-gradient-to-t from-orange-500 to-amber-400 transform-gpu origin-bottom"
                                                />
                                            ))}
                                        </div>
                                        <span className="text-xs font-mono font-medium text-stone-400">00:04:12</span>
                                    </div>
                                </div>

                                {/* White Transcript Container */}
                                <div className="bg-white p-4 sm:p-5 text-left space-y-3 min-h-[220px]">
                                    <AnimatePresence mode="wait">
                                        {/* Live Active Speaker Card */}
                                        <motion.div
                                            key="speaker-card"
                                            initial={{ opacity: 0, y: 12, scale: 0.98 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                            className="rounded-2xl border border-amber-200/80 bg-amber-50/70 p-3.5 shadow-xs transform-gpu"
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-6 w-6 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-xs">
                                                        <Sparkles size={11} />
                                                    </div>
                                                    <span className="text-xs font-bold text-stone-900">Nuravya AI</span>
                                                </div>
                                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-700">
                                                    <Mic size={9} /> Speaking
                                                </span>
                                            </div>
                                            <p className="text-xs leading-relaxed font-medium text-stone-800">
                                                "I remember yesterday felt heavy for you. Let's start slow today — what's one small thing on your mind?"
                                            </p>
                                        </motion.div>
                                    </AnimatePresence>

                                    {/* User Message */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.35, delay: 0.15 }}
                                        className="flex justify-end"
                                    >
                                        <div className="max-w-[88%] rounded-2xl bg-stone-900 px-3.5 py-2.5 text-xs text-white leading-relaxed shadow-xs">
                                            " Slept better, just need clarity on my priorities."
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Footer Listening Controls */}
                                <div className="bg-stone-50 border-t border-stone-100 p-3.5 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="relative flex h-3 w-3">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                                        </div>
                                        <span className="text-xs font-semibold text-stone-700">Voice Connected</span>
                                    </div>

                                    <div aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-950 text-white shadow-md">
                                        <Mic size={16} />
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.8 }}
                    className="mx-auto mt-14 grid w-full max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4"
                >
                    {PRODUCT_STATS.map((s) => (
                        <motion.div key={s.label} whileHover={{ y: -4, scale: 1.015 }} className="rounded-2xl border border-[#E8E3D3] bg-white/70 p-4 text-center shadow-sm backdrop-blur transition-shadow hover:shadow-md">
                            <p className="text-xl font-bold text-stone-950 sm:text-2xl font-heading">{s.value}</p>
                            <p className="mt-1 text-xs text-stone-500">{s.label}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
