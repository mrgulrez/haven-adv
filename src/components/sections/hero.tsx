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
            <div className="absolute inset-0 w-full h-full overflow-hidden">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-amber-200/40 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, -60, 0],
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-orange-200/40 rounded-full blur-[100px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        x: [0, 100, 0],
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[-10%] left-[20%] w-[70%] h-[70%] bg-amber-100/40 rounded-full blur-[150px]"
                />
            </div>

            <div className="container relative z-10 px-4 md:px-6 flex flex-col items-center text-center">
                {/* Pre-header Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 border border-amber-200 backdrop-blur-sm shadow-sm mb-8"
                >
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                    </span>
                    <span className="text-xs font-semibold text-stone-600 uppercase tracking-wide">Join 15,000+ on the waitlist</span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-bold font-heading tracking-tight text-stone-900 mb-6 max-w-4xl leading-tight"
                >
                    Never Feel <br className="md:hidden" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600 animate-text-gradient bg-300% p-1">
                        Alone Again
                    </span>
                </motion.h1>

                {/* Subheadline */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="text-lg md:text-xl text-stone-600 mb-10 max-w-2xl leading-relaxed"
                >
                    Haven is your warm AI companion that remembers, cares, and reminds.
                    Voice conversations that feel like talking to an old friend.
                </motion.p>

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="flex flex-col sm:flex-row items-center gap-4"
                >
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-orange-400 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
                        <Link href="#waitlist">
                            <Button size="lg" className="relative text-lg h-14 px-8 shadow-xl bg-gradient-to-r from-amber-500 to-orange-500 border-0 hover:scale-105 transition-transform">
                                Join the Waitlist
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>

                    <Link href="/contact">
                        <Button variant="outline" size="lg" className="text-lg h-14 px-8 border-stone-300 text-stone-700 bg-white/50 backdrop-blur-sm hover:bg-white hover:text-stone-900 transition-all">
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
