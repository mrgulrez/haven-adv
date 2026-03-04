"use client"

import { Section } from "@/components/ui/section"
import { Card, CardContent } from "@/components/ui/card"
import { motion, useInView } from "framer-motion"
import { Users, HeartCrack, Banknote } from "lucide-react"
import { useRef } from "react"

const stats = [
    {
        target: 1,
        suffix: "B+",
        label: "People Seeking Connection",
        description: "Billions worldwide are seeking a true friend who is always there.",
        icon: Users,
        color: "text-amber-600",
        bg: "bg-amber-100",
    },
    {
        target: 200,
        suffix: "B+",
        label: "Companion AI TAM",
        description: "Annual global spend on mental wellness and everyday companionship.",
        icon: Banknote,
        color: "text-emerald-600",
        bg: "bg-emerald-100",
    },
    {
        target: 61,
        suffix: "%",
        label: "Of Young Adults Want Connection",
        description: "Gen Z and Millennials desire meaningful, everyday conversations.",
        icon: HeartCrack,
        color: "text-rose-600",
        bg: "bg-rose-100",
    },
]

function Counter({ from, to, duration = 2 }: { from: number; to: number; duration?: number }) {
    const nodeRef = useRef<HTMLSpanElement>(null)
    const inView = useInView(nodeRef, { once: true, margin: "-100px" })

    // Simple counter implementation for brevity, could be more complex with framer-motion useSpring
    // Using CSS animation or simple JS interval would be lighter, but let's stick to a simple effect
    // Actually, let's use a text content animation

    return (
        <span ref={nodeRef} className="tabular-nums">
            {inView ? <CountUp to={to} duration={duration} /> : from}
        </span>
    )
}

function CountUp({ to, duration }: { to: number; duration: number }) {
    const [count, setCount] = React.useState(0)

    React.useEffect(() => {
        let startTime: number
        let animationFrame: number

        const update = (timestamp: number) => {
            if (!startTime) startTime = timestamp
            const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
            setCount(Math.floor(progress * to))

            if (progress < 1) {
                animationFrame = requestAnimationFrame(update)
            }
        }

        animationFrame = requestAnimationFrame(update)
        return () => cancelAnimationFrame(animationFrame)
    }, [to, duration])

    return <>{count}</>
}

import * as React from "react"

export function Problem() {
    return (
        <Section id="problem" className="bg-[#FAFAFA] relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="text-center max-w-4xl mx-auto mb-16 relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 md:px-5 md:py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mt-8 mb-6 shadow-[0_0_20px_rgba(245,158,11,0.15)] backdrop-blur-md max-w-full">
                    <span className="text-[10px] md:text-xs font-bold text-amber-700 uppercase tracking-widest md:tracking-[0.2em] whitespace-nowrap overflow-hidden text-ellipsis">The Market Opportunity</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-bold font-heading mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-stone-900 via-stone-800 to-stone-500">
                    The Need for a True, Everyday Friend
                </h2>
                <p className="text-lg md:text-xl text-stone-600">
                    While AI assistants manage tasks and mental health apps focus on crises, the world is missing a true, everyday companion. Nuravya is tapping into a massive, underserved market for genuine friendship—someone to celebrate wins, brainstorm ideas, and just hang out with.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.2 }}
                        viewport={{ once: true, margin: "-50px" }}
                    >
                        <Card className="h-full border border-stone-200/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgba(245,158,11,0.12)] transition-all duration-500 bg-white/60 backdrop-blur-xl hover:-translate-y-1 relative group overflow-hidden rounded-3xl">
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <CardContent className="pt-10 pb-8 px-6 flex flex-col items-center text-center relative z-10">
                                <div className={`p-4 rounded-full ${stat.bg} ${stat.color} mb-6`}>
                                    <stat.icon size={32} />
                                </div>
                                <div className="text-5xl border-b border-stone-100 pb-4 w-full md:text-6xl font-bold font-heading text-stone-900 mb-4 tracking-tighter">
                                    <Counter from={0} to={stat.target} />{stat.suffix}
                                </div>
                                <h3 className="text-xl font-semibold text-stone-800 mb-2">{stat.label}</h3>
                                <p className="text-stone-600">{stat.description}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </Section>
    )
}
