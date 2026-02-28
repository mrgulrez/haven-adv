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
        label: "People Globally Affected",
        description: "The WHO declared loneliness a global public health concern.",
        icon: Users,
        color: "text-amber-600",
        bg: "bg-amber-100",
    },
    {
        target: 200,
        suffix: "B+",
        label: "Mental Health TAM",
        description: "Annual global spend on mental wellness and companionship.",
        icon: Banknote,
        color: "text-emerald-600",
        bg: "bg-emerald-100",
    },
    {
        target: 61,
        suffix: "%",
        label: "Of Young Adults Feel Lonely",
        description: "Gen Z and Millennials report unprecedented isolation rates.",
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
        <Section id="problem" className="bg-white">
            <div className="text-center max-w-4xl mx-auto mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-100 border border-stone-200 mt-8 mb-6">
                    <span className="text-sm font-semibold text-stone-600 uppercase tracking-wide">The Market Opportunity</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold font-heading text-stone-900 mb-6">
                    The Silent Epidemic of Loneliness
                </h2>
                <p className="text-lg md:text-xl text-stone-600">
                    In a hyper-connected world, we are more isolated than ever. Nuravya is tapping into a massive, underserved market where existing solutions are either unscalable or lack true empathy.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.2 }}
                        viewport={{ once: true, margin: "-50px" }}
                    >
                        <Card className="h-full border-none shadow-lg hover:shadow-xl transition-shadow bg-stone-50/50">
                            <CardContent className="pt-8 flex flex-col items-center text-center">
                                <div className={`p-4 rounded-full ${stat.bg} ${stat.color} mb-6`}>
                                    <stat.icon size={32} />
                                </div>
                                <div className="text-4xl md:text-5xl font-bold font-heading text-stone-900 mb-2">
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
