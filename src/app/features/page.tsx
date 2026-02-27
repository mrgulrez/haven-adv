import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Mic, Brain, Shield, Heart } from "lucide-react";

export default function FeaturesPage() {
    return (
        <main className="min-h-screen bg-[#FFFBEB] flex flex-col font-sans">
            <Navbar />
            <div className="flex-grow pt-32 pb-16 px-4 md:px-6">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-6xl font-bold font-heading text-stone-900 mb-6">Features</h1>
                        <p className="text-xl text-stone-600 max-w-2xl mx-auto">Discover what makes Haven the most empathetic AI companion ever built.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                        {/* Feature 1 */}
                        <div className="bg-white p-8 md:p-12 rounded-3xl border border-stone-100 shadow-sm">
                            <Mic className="h-12 w-12 text-amber-500 mb-6" />
                            <h2 className="text-2xl font-bold text-stone-900 mb-4">Real-Time Voice Intelligence</h2>
                            <p className="text-stone-600 leading-relaxed mb-6">
                                Haven doesn't just process text. It listens to the tone, cadence, and emotion in your voice, allowing for incredibly natural, interrupting, and flowing conversations.
                            </p>
                            <ul className="space-y-3 text-stone-600">
                                <li>✓ Sub-500ms response latency</li>
                                <li>✓ Emotional prosody detection</li>
                                <li>✓ Natural interruptions allowed</li>
                            </ul>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-white p-8 md:p-12 rounded-3xl border border-stone-100 shadow-sm">
                            <Brain className="h-12 w-12 text-rose-500 mb-6" />
                            <h2 className="text-2xl font-bold text-stone-900 mb-4">Infinite Memory Graph</h2>
                            <p className="text-stone-600 leading-relaxed mb-6">
                                Conversations shouldn't start from scratch every day. Haven builds a secure associative memory graph of your preferences, relationships, and history over time.
                            </p>
                            <ul className="space-y-3 text-stone-600">
                                <li>✓ Contextual recall across sessions</li>
                                <li>✓ Personalized relationship modeling</li>
                                <li>✓ Explicit memory controls</li>
                            </ul>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-white p-8 md:p-12 rounded-3xl border border-stone-100 shadow-sm">
                            <Shield className="h-12 w-12 text-emerald-500 mb-6" />
                            <h2 className="text-2xl font-bold text-stone-900 mb-4">Zero-Knowledge Core</h2>
                            <p className="text-stone-600 leading-relaxed mb-6">
                                Your data is yours. We utilize advanced encryption and local-first architecture where possible to ensure your most intimate conversations stay private.
                            </p>
                            <ul className="space-y-3 text-stone-600">
                                <li>✓ End-to-end memory encryption</li>
                                <li>✓ No third-party data selling</li>
                                <li>✓ Instant data wipe capabilities</li>
                            </ul>
                        </div>

                        {/* Feature 4 */}
                        <div className="bg-white p-8 md:p-12 rounded-3xl border border-stone-100 shadow-sm">
                            <Heart className="h-12 w-12 text-blue-500 mb-6" />
                            <h2 className="text-2xl font-bold text-stone-900 mb-4">Proactive Care</h2>
                            <p className="text-stone-600 leading-relaxed mb-6">
                                Haven doesn't just wait for you to speak. If you mention an important interview tomorrow, Haven will proactively check in to see how it went.
                            </p>
                            <ul className="space-y-3 text-stone-600">
                                <li>✓ Smart gentle reminders</li>
                                <li>✓ Emotion-based check-ins</li>
                                <li>✓ Personalized morning briefs</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
