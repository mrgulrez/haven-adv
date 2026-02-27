import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PricingPage() {
    return (
        <main className="min-h-screen bg-[#FFFBEB] flex flex-col font-sans">
            <Navbar />
            <div className="flex-grow pt-32 pb-24 px-4 md:px-6">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-20">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-200 shadow-sm mb-6">
                            <span className="text-sm font-semibold text-amber-800 uppercase tracking-wide">Haven is built on one belief</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold font-heading text-stone-900 mb-6">Everyone deserves to feel heard.</h1>
                        <p className="text-xl text-stone-600 max-w-2xl mx-auto">
                            Whether you are exploring or seeking a deeply personalized companion experience, there is a plan designed for you.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Free Tier */}
                        <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm flex flex-col hover:shadow-md transition-shadow">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-stone-900 mb-2">Free</h2>
                                <p className="text-stone-500 text-sm h-10">Start your journey with zero barriers. Perfect for experiencing Haven’s emotional intelligence at your own pace.</p>
                            </div>
                            <div className="mb-8">
                                <span className="text-5xl font-bold text-stone-900">$0</span>
                                <span className="text-stone-500">/month</span>
                            </div>
                            <ul className="space-y-4 mb-8 flex-grow text-sm">
                                <li className="flex items-start gap-3 text-stone-700">
                                    <Check className="h-5 w-5 text-emerald-500 shrink-0" />
                                    <span>Unlimited text conversations</span>
                                </li>
                                <li className="flex items-start gap-3 text-stone-700">
                                    <Check className="h-5 w-5 text-emerald-500 shrink-0" />
                                    <span>30-day rolling memory</span>
                                </li>
                                <li className="flex items-start gap-3 text-stone-700">
                                    <Check className="h-5 w-5 text-emerald-500 shrink-0" />
                                    <span>Foundational emotional understanding</span>
                                </li>
                                <li className="flex items-start gap-3 text-stone-700">
                                    <Check className="h-5 w-5 text-emerald-500 shrink-0" />
                                    <span>Late-night supportive chat mode</span>
                                </li>
                                <li className="flex items-start gap-3 text-stone-700">
                                    <Check className="h-5 w-5 text-emerald-500 shrink-0" />
                                    <span>Standard encrypted conversations</span>
                                </li>
                                <li className="flex items-start gap-3 text-stone-700">
                                    <Check className="h-5 w-5 text-emerald-500 shrink-0" />
                                    <span>Access via web and mobile</span>
                                </li>
                                <li className="flex items-start gap-3 text-stone-400">
                                    <X className="h-5 w-5 text-stone-300 shrink-0" />
                                    <span>No voice conversations</span>
                                </li>
                                <li className="flex items-start gap-3 text-stone-400">
                                    <X className="h-5 w-5 text-stone-300 shrink-0" />
                                    <span>No proactive outreach</span>
                                </li>
                            </ul>
                            <div className="text-xs text-stone-500 text-center mb-4">Built for accessibility. Always free.</div>
                            <Link href="/#waitlist">
                                <Button className="w-full bg-stone-100 hover:bg-stone-200 text-stone-900 h-12" size="lg">Get Started</Button>
                            </Link>
                        </div>

                        {/* Core Tier */}
                        <div className="bg-gradient-to-b from-amber-50 to-orange-50 p-8 rounded-3xl border-2 border-amber-300 shadow-xl relative flex flex-col transform md:-translate-y-4">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-500 text-white px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase shadow-sm">
                                Most Popular
                            </div>
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-stone-900 mb-2">Haven Core</h2>
                                <p className="text-stone-700 font-medium text-sm h-10">Deeper connection. Real continuity. For users who want Haven to truly grow with them.</p>
                            </div>
                            <div className="mb-6">
                                <span className="text-5xl font-bold text-stone-900">$24</span>
                                <span className="text-stone-600">/month</span>
                            </div>
                            <div className="text-sm font-semibold text-stone-900 mb-4 pb-4 border-b border-amber-200/50">Everything in Free, plus:</div>
                            <ul className="space-y-4 mb-8 flex-grow text-sm">
                                <li className="flex items-start gap-3 text-stone-800">
                                    <Check className="h-5 w-5 text-amber-500 shrink-0" />
                                    <span className="font-semibold">300 voice minutes per month</span>
                                </li>
                                <li className="flex items-start gap-3 text-stone-800">
                                    <Check className="h-5 w-5 text-amber-500 shrink-0" />
                                    <span className="font-semibold">Infinite long-term memory retention</span>
                                </li>
                                <li className="flex items-start gap-3 text-stone-800">
                                    <Check className="h-5 w-5 text-amber-500 shrink-0" />
                                    <span>Emotional pattern recognition</span>
                                </li>
                                <li className="flex items-start gap-3 text-stone-800">
                                    <Check className="h-5 w-5 text-amber-500 shrink-0" />
                                    <span>Proactive check-ins and thoughtful reminders</span>
                                </li>
                                <li className="flex items-start gap-3 text-stone-800">
                                    <Check className="h-5 w-5 text-amber-500 shrink-0" />
                                    <span>One customizable voice personality</span>
                                </li>
                                <li className="flex items-start gap-3 text-stone-800">
                                    <Check className="h-5 w-5 text-amber-500 shrink-0" />
                                    <span>Faster response priority</span>
                                </li>
                                <li className="flex items-start gap-3 text-stone-800">
                                    <Check className="h-5 w-5 text-amber-500 shrink-0" />
                                    <span>Weekly emotional insight summaries</span>
                                </li>
                                <li className="flex items-start gap-3 text-stone-800">
                                    <Check className="h-5 w-5 text-amber-500 shrink-0" />
                                    <span>Enhanced encrypted memory storage</span>
                                </li>
                                <li className="flex items-start gap-3 text-stone-800">
                                    <Check className="h-5 w-5 text-amber-500 shrink-0" />
                                    <span>Full memory dashboard (view, edit, delete)</span>
                                </li>
                            </ul>
                            <div className="text-xs text-amber-700/80 text-center font-medium mb-4">Designed for meaningful, evolving companionship.</div>
                            <Link href="/#waitlist">
                                <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white h-12 shadow-md" size="lg">Secure Early Access</Button>
                            </Link>
                        </div>

                        {/* Pro Tier */}
                        <div className="bg-stone-900 p-8 rounded-3xl border border-stone-800 shadow-xl flex flex-col relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-stone-800/50 to-transparent pointer-events-none"></div>
                            <div className="mb-6 relative z-10">
                                <h2 className="text-2xl font-bold text-white mb-2">Haven Pro</h2>
                                <p className="text-stone-300 text-sm h-10">The ultimate emotionally intelligent AI companion for a deeply personalized relationship.</p>
                            </div>
                            <div className="mb-6 relative z-10">
                                <span className="text-5xl font-bold text-white">$59</span>
                                <span className="text-stone-400">/month</span>
                            </div>
                            <div className="text-sm font-semibold text-white mb-4 pb-4 border-b border-stone-800 relative z-10">Everything in Core, plus:</div>
                            <ul className="space-y-4 mb-8 flex-grow text-sm relative z-10">
                                <li className="flex items-start gap-3 text-stone-200">
                                    <Check className="h-5 w-5 text-amber-400 shrink-0" />
                                    <span className="font-semibold text-white">700 voice minutes per month</span>
                                </li>
                                <li className="flex items-start gap-3 text-stone-200">
                                    <Check className="h-5 w-5 text-amber-400 shrink-0" />
                                    <span>Multiple companion personalities</span>
                                </li>
                                <li className="flex items-start gap-3 text-stone-200">
                                    <Check className="h-5 w-5 text-amber-400 shrink-0" />
                                    <span>Custom voice cloning</span>
                                </li>
                                <li className="flex items-start gap-3 text-stone-200">
                                    <Check className="h-5 w-5 text-amber-400 shrink-0" />
                                    <span className="text-amber-200 font-medium">Full video companion mode</span>
                                </li>
                                <li className="flex items-start gap-3 text-stone-200">
                                    <Check className="h-5 w-5 text-amber-400 shrink-0" />
                                    <span>Advanced long-term contextual intelligence</span>
                                </li>
                                <li className="flex items-start gap-3 text-stone-200">
                                    <Check className="h-5 w-5 text-amber-400 shrink-0" />
                                    <span>Mood trend analytics and growth reports</span>
                                </li>
                                <li className="flex items-start gap-3 text-stone-200">
                                    <Check className="h-5 w-5 text-amber-400 shrink-0" />
                                    <span>Shared milestone tracking</span>
                                </li>
                                <li className="flex items-start gap-3 text-stone-200">
                                    <Check className="h-5 w-5 text-amber-400 shrink-0" />
                                    <span>Adaptive personality evolution</span>
                                </li>
                                <li className="flex items-start gap-3 text-stone-200">
                                    <Check className="h-5 w-5 text-amber-400 shrink-0" />
                                    <span>Private encrypted memory vault</span>
                                </li>
                                <li className="flex items-start gap-3 text-stone-200">
                                    <Check className="h-5 w-5 text-amber-400 shrink-0" />
                                    <span>Early access to experimental features</span>
                                </li>
                                <li className="flex items-start gap-3 text-stone-200">
                                    <Check className="h-5 w-5 text-amber-400 shrink-0" />
                                    <span>Priority human support</span>
                                </li>
                            </ul>
                            <div className="text-xs text-stone-400 text-center mb-4 relative z-10">Built for depth. Built for trust.</div>
                            <Link href="/#waitlist" className="relative z-10">
                                <Button className="w-full bg-white hover:bg-stone-200 text-stone-900 h-12 shadow-lg" size="lg">Join Waitlist</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
