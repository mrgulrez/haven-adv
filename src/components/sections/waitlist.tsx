"use client"

import { useState } from "react"
import { Section } from "@/components/ui/section"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, CheckCircle2, PartyPopper } from "lucide-react"

const schema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
})

type FormData = z.infer<typeof schema>

export function Waitlist() {
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [position, setPosition] = useState(234)

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
    })

    const onSubmit = async (data: FormData) => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/waitlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...data, source: 'Waitlist Form' }),
            })

            if (response.ok) {
                setIsSubmitted(true)
                setPosition(prev => prev + 1)
            } else {
                throw new Error('Failed to join waitlist')
            }
        } catch (error) {
            console.error(error)
            alert("Something went wrong. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Section id="waitlist" className="relative overflow-hidden py-24 bg-stone-900 text-white">
            {/* Background Elements */}
            <div className="absolute inset-0 w-full h-full">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/40 via-stone-900 to-stone-900" />
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px]" />
            </div>
            <div className="container mx-auto px-4 max-w-xl text-center">
                <AnimatePresence mode="wait">
                    {!isSubmitted ? (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h2 className="text-3xl md:text-5xl font-bold font-heading mb-6">
                                Be the First to Experience Nuravya
                            </h2>
                            <p className="text-amber-100 text-lg mb-8">
                                Join the waitlist to get early access and exclusive pricing.
                            </p>

                            <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 shadow-xl">
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                    <div className="space-y-2 text-left">
                                        <label htmlFor="name" className="text-sm font-medium ml-1">Full Name</label>
                                        <Input
                                            id="name"
                                            {...register("name")}
                                            placeholder="Jane Doe"
                                            className="bg-white/90 border-transparent text-stone-900 placeholder:text-stone-400 focus-visible:ring-white"
                                        />
                                        {errors.name && <p className="text-xs text-red-200 ml-1">{errors.name.message}</p>}
                                    </div>

                                    <div className="space-y-2 text-left">
                                        <label htmlFor="email" className="text-sm font-medium ml-1">Email Address</label>
                                        <Input
                                            id="email"
                                            type="email"
                                            {...register("email")}
                                            placeholder="jane@example.com"
                                            className="bg-white/90 border-transparent text-stone-900 placeholder:text-stone-400 focus-visible:ring-white"
                                        />
                                        {errors.email && <p className="text-xs text-red-200 ml-1">{errors.email.message}</p>}
                                    </div>

                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="w-full bg-white text-orange-600 hover:bg-stone-100 hover:text-orange-700 shadow-lg font-bold text-lg h-12"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? <Loader2 className="animate-spin" /> : "Join Waitlist"}
                                    </Button>

                                    <p className="text-xs text-amber-200 mt-4">
                                        We respect your privacy. Unsubscribe at any time.
                                    </p>
                                </form>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white text-stone-900 p-12 rounded-3xl shadow-2xl flex flex-col items-center max-w-md mx-auto"
                        >
                            <div className="h-20 w-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                                <CheckCircle2 size={40} />
                            </div>
                            <h3 className="text-3xl font-bold font-heading mb-2">You're on the list!</h3>
                            <p className="text-stone-600 mb-6 font-medium">
                                Thanks for joining the Nuravya family.
                            </p>
                            <div className="bg-stone-50 rounded-xl p-6 w-full border border-stone-100 text-center">
                                <p className="text-sm text-stone-500 mb-2">We'll notify you at:</p>
                                <p className="text-lg font-bold text-amber-600 break-all">{(document.getElementById('email') as HTMLInputElement)?.value}</p>
                            </div>
                            <div className="mt-8 text-sm text-stone-500 flex gap-2 items-center">
                                <PartyPopper size={16} className="text-amber-500" />
                                Watch your inbox for early access!
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </Section>
    )
}
