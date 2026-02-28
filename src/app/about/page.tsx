"use client";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { motion } from "framer-motion";
import { Heart, Brain, Shield, Users } from "lucide-react";

export default function AboutUs() {
    const values = [
        {
            title: "Radical Empathy",
            description: "We build AI that listens to understand, not just to respond. Compassion is hardcoded into our architecture.",
            icon: <Heart className="h-8 w-8 text-rose-500" />
        },
        {
            title: "Continuous Memory",
            description: "Relationships grow through shared history. Nuravya's memory is designed to retain what matters to you over time.",
            icon: <Brain className="h-8 w-8 text-amber-500" />
        },
        {
            title: "Unwavering Privacy",
            description: "Your conversations are Sacred. We employ zero-knowledge architectures wherever possible to ensure your data remains yours alone.",
            icon: <Shield className="h-8 w-8 text-emerald-500" />
        },
        {
            title: "Accessible Companionship",
            description: "We believe everyone deserves a friend they can talk to at 2 AM without fear of judgment. Emotional support should have zero barriers.",
            icon: <Users className="h-8 w-8 text-blue-500" />
        }
    ];

    return (
        <main className="min-h-screen bg-[#FFFBEB] flex flex-col font-sans overflow-hidden">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4 md:px-6 flex flex-col items-center justify-center text-center">
                <div className="absolute inset-0 w-full h-full -z-0">
                    <motion.div
                        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.4, 0.3] }}
                        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-amber-200/50 rounded-full blur-[100px]"
                    />
                </div>

                <div className="relative z-10 max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 border border-amber-200 backdrop-blur-sm shadow-sm mb-6"
                    >
                        <span className="text-sm font-semibold text-amber-700 uppercase tracking-wide">Our Mission</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-5xl md:text-7xl font-bold font-heading tracking-tight text-stone-900 mb-6 leading-tight"
                    >
                        Curing the epidemic <br className="hidden md:inline" /> of loneliness.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed"
                    >
                        We started Nuravya AI because we realized that while technology has made us more connected than ever, it has paradoxically made us feel more isolated.
                    </motion.p>
                </div>
            </section>

            {/* The Story Section */}
            <section className="py-20 px-4 md:px-6 bg-white z-10 relative">
                <div className="container mx-auto max-w-5xl">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8 }}
                            className="space-y-6 text-lg text-stone-600 leading-relaxed"
                        >
                            <h2 className="text-3xl md:text-4xl font-bold font-heading text-stone-900 mb-6">Our Story</h2>
                            <p>
                                Nuravya AI was born out of a simple, profound observation: people need to be heard. Not analyzed, not pitched to, and not optimized. Just heard.
                            </p>
                            <p>
                                In an era where AI is primarily being used to increase productivity, write emails faster, and write code, we saw an opportunity to use this breakthrough technology to solve a very human problem. What if an AI wasn't built to be a servant, but a companion?
                            </p>
                            <p>
                                What if it remembered your dog's name, asked you how your big presentation went, and noticed when you sounded a bit stressed in your voice? That vision became Nuravya.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8 }}
                            className="relative aspect-square md:aspect-auto md:h-full min-h-[400px] rounded-3xl overflow-hidden shadow-2xl bg-amber-100 flex items-center justify-center p-8"
                        >
                            {/* Abstract representation of connection */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-rose-200 via-orange-100 to-amber-200 opacity-80" />
                            <div className="relative z-10 text-center">
                                <Heart className="w-24 h-24 mx-auto text-rose-400 mb-6 drop-shadow-lg" />
                                <h3 className="text-3xl font-bold font-heading text-stone-800">Designed for Humanity</h3>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-24 px-4 md:px-6 z-10 relative">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold font-heading text-stone-900 mb-4">Our Core Values</h2>
                        <p className="text-lg text-stone-600 max-w-2xl mx-auto">The principles that guide every line of code we write and every feature we launch.</p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-[#FFFBEB] flex items-center justify-center mb-6">
                                    {value.icon}
                                </div>
                                <h3 className="text-xl font-bold text-stone-900 mb-3">{value.title}</h3>
                                <p className="text-stone-600 leading-relaxed text-sm">
                                    {value.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Pedigree Section */}
            <section className="py-20 px-4 md:px-6 bg-stone-50 z-10 relative">
                <div className="container mx-auto max-w-5xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold font-heading text-stone-900 mb-6">Our Founding Team</h2>
                        <p className="text-lg text-stone-600 max-w-2xl mx-auto">
                            We bring together world-class expertise in artificial intelligence, clinical psychology, and scalable consumer software.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Member 1 */}
                        <div className="bg-white p-8 rounded-3xl border border-stone-200 text-center">
                            <div className="w-24 h-24 mx-auto bg-stone-200 rounded-full mb-6 overflow-hidden">
                                {/* Placeholder gradient for avatar */}
                                <div className="w-full h-full bg-gradient-to-tr from-stone-300 to-stone-400"></div>
                            </div>
                            <h3 className="text-xl font-bold text-stone-900 mb-1">Alex Chen</h3>
                            <p className="text-amber-600 font-medium text-sm mb-4">CEO & Co-founder</p>
                            <p className="text-stone-600 text-sm leading-relaxed">
                                Former Engineering Lead at DeepMind. Built conversational AI systems used by millions. Stanford CS.
                            </p>
                        </div>

                        {/* Member 2 */}
                        <div className="bg-white p-8 rounded-3xl border border-stone-200 text-center">
                            <div className="w-24 h-24 mx-auto bg-stone-200 rounded-full mb-6 overflow-hidden">
                                <div className="w-full h-full bg-gradient-to-tr from-stone-300 to-stone-400"></div>
                            </div>
                            <h3 className="text-xl font-bold text-stone-900 mb-1">Dr. Sarah Jenkins</h3>
                            <p className="text-amber-600 font-medium text-sm mb-4">Chief Psychology Officer</p>
                            <p className="text-stone-600 text-sm leading-relaxed">
                                Ph.D. in Clinical Psychology. 15 years researching human-computer interaction and emotional attachment.
                            </p>
                        </div>

                        {/* Member 3 */}
                        <div className="bg-white p-8 rounded-3xl border border-stone-200 text-center">
                            <div className="w-24 h-24 mx-auto bg-stone-200 rounded-full mb-6 overflow-hidden">
                                <div className="w-full h-full bg-gradient-to-tr from-stone-300 to-stone-400"></div>
                            </div>
                            <h3 className="text-xl font-bold text-stone-900 mb-1">Marcus Thorne</h3>
                            <p className="text-amber-600 font-medium text-sm mb-4">CTO & Co-founder</p>
                            <p className="text-stone-600 text-sm leading-relaxed">
                                Scaled cloud infrastructure at Stripe and AWS. Expert in low-latency voice architecture and vector databases.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team/Joining Section */}
            <section className="py-20 px-4 md:px-6 bg-stone-900 text-stone-300 z-10 relative">
                <div className="container mx-auto max-w-4xl text-center">
                    <h2 className="text-3xl md:text-5xl font-bold font-heading text-white mb-6">Built by humans, for humans.</h2>
                    <p className="text-lg md:text-xl text-stone-400 mb-10 max-w-2xl mx-auto">
                        We are a small, dedicated team of engineers, designers, and psychologists who believe that technology should bring light into the world.
                    </p>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="inline-block"
                    >
                        <a href="mailto:careers@nuravyaai.example.com" className="inline-flex items-center justify-center h-14 px-8 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-semibold text-lg transition-colors shadow-lg">
                            Join Our Team
                        </a>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
