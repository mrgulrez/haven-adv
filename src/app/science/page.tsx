"use client";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { motion } from "framer-motion";
import { BookOpen, Stethoscope, LineChart, Brain } from "lucide-react";

export default function SciencePage() {
    return (
        <main className="min-h-screen bg-[#FFFBEB] flex flex-col font-sans overflow-hidden">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4 md:px-6 flex flex-col items-center justify-center text-center">
                <div className="relative z-10 max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 border border-emerald-200 backdrop-blur-sm shadow-sm mb-6"
                    >
                        <span className="text-sm font-semibold text-emerald-700 uppercase tracking-wide">Clinical Foundation</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-5xl md:text-7xl font-bold font-heading tracking-tight text-stone-900 mb-6 leading-tight"
                    >
                        The Science of <br className="hidden md:inline" /> Connection.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed"
                    >
                        Haven isn't just a language model. It's a therapeutic system built on decades of peer-reviewed clinical psychology and cognitive behavioral principles.
                    </motion.p>
                </div>
            </section>

            {/* Methodology Section */}
            <section className="py-20 px-4 md:px-6 bg-white z-10 relative">
                <div className="container mx-auto max-w-5xl">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-2xl font-bold font-heading text-stone-900 mb-3 flex items-center gap-3">
                                    <Brain className="text-emerald-500" /> Cognitive Architecture
                                </h3>
                                <p className="text-stone-600 leading-relaxed">
                                    Our proprietary emotion engine layers advanced psychological frameworks (CBT, DBT) over generative AI, allowing Haven to guide conversations toward healthy processing rather than just endless rumination.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold font-heading text-stone-900 mb-3 flex items-center gap-3">
                                    <Stethoscope className="text-emerald-500" /> Clinician-Guided
                                </h3>
                                <p className="text-stone-600 leading-relaxed">
                                    Every archetype and conversational vector is reviewed by our board of licensed therapists. We enforce strict safety boundaries and escalation protocols for users exhibiting crisis signals.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold font-heading text-stone-900 mb-3 flex items-center gap-3">
                                    <LineChart className="text-emerald-500" /> Longitudinal Processing
                                </h3>
                                <p className="text-stone-600 leading-relaxed">
                                    Haven doesn't just remember facts; it tracks emotional valence over time. Our context window allows the system to identify behavioral patterns spanning months, offering insights impossible for standard AI models.
                                </p>
                            </div>
                        </div>

                        <div className="bg-stone-50 rounded-3xl p-8 border border-stone-200 relative overflow-hidden h-full flex flex-col justify-center shadow-lg">
                            <div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-[50px]"></div>
                            <BookOpen className="w-16 h-16 text-emerald-600 mb-6" />
                            <h2 className="text-3xl font-bold font-heading text-stone-900 mb-4">Ongoing Research</h2>
                            <p className="text-stone-600 mb-6">
                                We are actively partnering with top universities to conduct clinical trials on AI-mediated companionship protocols and their impact on geriatric depression.
                            </p>
                            <a href="mailto:research@havenai.example.com" className="font-semibold text-emerald-600 hover:text-emerald-700 underline underline-offset-4 w-fit">
                                Read our whitepaper (Coming Soon) →
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
