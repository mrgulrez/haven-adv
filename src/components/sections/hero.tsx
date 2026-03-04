"use client"

import { Button } from "@/components/ui/button"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, Mic } from "lucide-react"
import Link from "next/link"

export function Hero() {
    const { scrollY } = useScroll()
    const y1 = useTransform(scrollY, [0, 500], [0, 200])

    return (
        <section className="relative min-h-[90vh] w-full flex items-center justify-center overflow-hidden bg-[#FFFBEB]">
            {/* Background Gradient Mesh */}
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-gradient-to-tr from-amber-400/20 to-rose-400/20 rounded-[100%] blur-[150px] mix-blend-multiply"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, -60, 0],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[10%] right-[-10%] w-[60%] h-[60%] bg-gradient-to-bl from-orange-400/20 to-amber-300/20 rounded-[100%] blur-[130px] mix-blend-multiply"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        x: [0, 100, 0],
                    }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[-20%] left-[20%] w-[80%] h-[80%] bg-gradient-to-t from-stone-200/50 to-transparent rounded-[100%] blur-[150px] mix-blend-overlay"
                />
            </div>

            <div className="container relative z-10 px-4 md:px-6 pt-safe md:pt-0 flex flex-col items-center text-center">
                {/* Pre-header Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 md:px-5 md:py-2 rounded-full bg-white/70 border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl mb-8 cursor-default max-w-full"
                >
                    <span className="relative flex h-1.5 w-1.5 md:h-2 md:w-2 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 md:h-2 md:w-2 bg-gradient-to-r from-amber-500 to-orange-500"></span>
                    </span>
                    <span className="text-[10px] md:text-xs font-bold text-stone-700 uppercase tracking-widest md:tracking-[0.2em] whitespace-nowrap overflow-hidden text-ellipsis">The Next Era of AI Companionship</span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-6xl md:text-8xl lg:text-[7.5rem] font-bold font-heading tracking-tighter text-stone-900 mb-8 max-w-5xl leading-[1.1]"
                >
                    The Future of <br className="hidden md:block" />
                    <span className="px-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 animate-text-gradient bg-300%">
                        True Connection
                    </span>
                </motion.h1>

                {/* Subheadline */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="text-xl md:text-2xl text-stone-600 mb-12 max-w-2xl leading-relaxed font-light"
                >
                    Nuravya is your warm AI companion that remembers, cares, and hangs out.
                    Voice conversations so natural, it feels like an old friend.
                </motion.p>

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="flex flex-col sm:flex-row items-center gap-6"
                >
                    <div className="relative group">
                        <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-500 to-rose-500 rounded-[2rem] blur-[14px] opacity-40 group-hover:opacity-70 transition duration-500"></div>
                        <Link href="#waitlist">
                            <Button size="lg" className="relative text-lg h-14 md:h-16 px-10 shadow-xl bg-gradient-to-r from-amber-500 to-orange-500 border-0 hover:scale-105 transition-all duration-300 rounded-full font-semibold">
                                Join the Waitlist
                                <ArrowRight className="ml-3 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>

                    <Link href="/contact">
                        <Button variant="outline" size="lg" className="text-lg h-14 md:h-16 px-10 border-stone-200/60 shadow-sm text-stone-700 bg-white/60 backdrop-blur-xl hover:bg-white hover:text-stone-900 transition-all rounded-full font-medium">
                            Partner with Us
                        </Button>
                    </Link>
                </motion.div>

                {/* Voice Wave Visualization */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 1 }}
                    className="mt-16 sm:mt-24 w-full max-w-xs h-16 flex items-center justify-center gap-1.5"
                >
                    {[...Array(5)].map((_, i) => (
                        <motion.div
                            key={i}
                            animate={{
                                height: ["20%", "80%", "20%"],
                                backgroundColor: ["#fbbf24", "#f97316", "#fbbf24"]
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: i * 0.1,
                            }}
                            className="w-2 rounded-full bg-amber-400 h-8"
                        />
                    ))}
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, y: [0, 10, 0] }}
                    transition={{ delay: 1.5, duration: 2, repeat: Infinity }}
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-stone-400"
                >
                    <div className="w-6 h-10 border-2 border-stone-300 rounded-full flex justify-center p-1">
                        <motion.div
                            animate={{ y: [0, 12, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="w-1.5 h-1.5 bg-stone-400 rounded-full"
                        />
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
