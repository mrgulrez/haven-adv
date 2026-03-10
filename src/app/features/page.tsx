"use client";

import { Footer } from "@/components/layout/footer";
import { Mic, Brain, Shield, Heart, Sparkles, Zap, Lock, BarChart3, Clock } from "lucide-react";
import { FEATURES, BRAND } from "@/lib/site.config";
import { motion } from "framer-motion";

const ICON_MAP: Record<string, any> = {
    Mic: Mic,
    Brain: Brain,
    Sparkles: Sparkles,
    BarChart3: BarChart3,
    Clock: Clock,
    Lock: Lock,
    Shield: Shield,
    Heart: Heart,
};

export default function FeaturesPage() {
    return (
        <main className="min-h-screen bg-[#FFFBEB] flex flex-col font-sans">
            <div className="flex-grow pt-32 pb-24 px-4 md:px-6">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-20">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 border border-amber-200 shadow-sm mb-6"
                        >
                            <Zap size={14} className="text-amber-600" />
                            <span className="text-xs font-bold text-amber-800 uppercase tracking-widest">Capabilities</span>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-7xl font-bold font-heading text-stone-900 mb-6 tracking-tight"
                        >
                            Built for deep <br /> human connection.
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl text-stone-600 max-w-2xl mx-auto font-light leading-relaxed"
                        >
                            Discover the specialized emotional architecture that makes {BRAND.name} more than just another AI chat app.
                        </motion.p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                        {FEATURES.map((feature, i) => {
                            const Icon = ICON_MAP[feature.icon] || Zap;
                            return (
                                <motion.div
                                    key={feature.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                    className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                >
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-stone-50 bg-${feature.badgeColor === 'rose' ? 'rose-50' : feature.badgeColor === 'purple' ? 'purple-50' : feature.badgeColor === 'blue' ? 'blue-50' : feature.badgeColor === 'emerald' ? 'emerald-50' : 'amber-50'}`}>
                                        <Icon className={`h-7 w-7 text-${feature.badgeColor === 'rose' ? 'rose-500' : feature.badgeColor === 'purple' ? 'purple-500' : feature.badgeColor === 'blue' ? 'blue-500' : feature.badgeColor === 'emerald' ? 'emerald-500' : 'amber-500'}`} />
                                    </div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <h2 className="text-xl font-bold text-stone-900">{feature.title}</h2>
                                    </div>
                                    <p className="text-stone-500 leading-relaxed mb-6 text-sm">
                                        {feature.description}
                                    </p>
                                    <div className="pt-6 border-t border-stone-50 mt-auto flex items-center justify-between">
                                        <span className="text-[10px] uppercase font-black tracking-widest text-stone-400">{feature.stat.label}</span>
                                        <span className="text-sm font-bold text-stone-900">{feature.stat.value}</span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    <div className="max-w-4xl mx-auto rounded-[3rem] overflow-hidden bg-stone-900 text-white p-12 md:p-16 relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[80px] -z-0" />
                        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl font-bold font-heading mb-6 tracking-tight">Daily Chat Reminders</h2>
                                <p className="text-stone-400 text-lg leading-relaxed mb-8">
                                    Set personal milestones or just receive a gentle morning check-in. Our scalable notification system works across Web and Android, keeping you connected without being intrusive.
                                </p>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                                            <Zap size={14} />
                                        </div>
                                        <span className="text-sm">Scalable Node.js Scheduler</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                                            <Zap size={14} />
                                        </div>
                                        <span className="text-sm">Native Android Push Notifications</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-stone-800/50 border border-stone-700 rounded-3xl p-8 backdrop-blur-xl">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center">
                                        <Mic size={18} className="text-stone-950" />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-amber-500 uppercase tracking-widest">Morning Brief</div>
                                        <div className="text-white font-bold text-sm leading-none">Ready for your day?</div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="h-2 w-full bg-stone-700/50 rounded-full overflow-hidden">
                                        <div className="h-full w-3/4 bg-amber-500/30" />
                                    </div>
                                    <div className="h-2 w-2/3 bg-stone-700/50 rounded-full overflow-hidden">
                                        <div className="h-full w-1/2 bg-amber-500/30" />
                                    </div>
                                </div>
                                <div className="mt-8 pt-6 border-t border-stone-700 flex justify-between gap-4">
                                    <div className="h-10 flex-1 bg-stone-700 rounded-xl" />
                                    <div className="h-10 flex-1 bg-amber-500 rounded-xl" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
