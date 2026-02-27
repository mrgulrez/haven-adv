import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function BlogPage() {
    return (
        <main className="min-h-screen bg-[#FFFBEB] flex flex-col font-sans">
            <Navbar />
            <div className="flex-grow pt-32 pb-16 px-4 md:px-6">
                <div className="container mx-auto max-w-6xl">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                        <div>
                            <h1 className="text-4xl md:text-6xl font-bold font-heading text-stone-900 mb-4">Engineering Empathy</h1>
                            <p className="text-xl text-stone-600 max-w-2xl">Thoughts, updates, and research from the team building Haven.</p>
                        </div>
                        <div className="bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-semibold tracking-wide w-fit">
                            Subscribe for Updates
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Featured Post */}
                        <Link href="/blog" className="md:col-span-2 lg:col-span-3 group relative rounded-3xl overflow-hidden bg-white shadow-sm border border-stone-100 flex flex-col md:flex-row hover:shadow-xl transition-shadow duration-300">
                            <div className="md:w-1/2 aspect-video md:aspect-auto bg-stone-200 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-tr from-rose-200 via-orange-100 to-amber-200 group-hover:scale-105 transition-transform duration-700"></div>
                            </div>
                            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                                <div className="flex items-center gap-4 text-sm font-medium text-stone-500 mb-4">
                                    <span className="text-amber-600 uppercase tracking-wider">Research</span>
                                    <span>•</span>
                                    <span>Feb 20, 2026</span>
                                </div>
                                <h2 className="text-3xl font-bold text-stone-900 mb-4 group-hover:text-amber-600 transition-colors">Why "Hello" Matters: The Architecture of Zero-Latency Greetings</h2>
                                <p className="text-stone-600 mb-8 leading-relaxed">
                                    To make an AI feel like a friend, the first 800 milliseconds of conversation are critical. Here is an inside look at how we re-architected LiveKit to eliminate TTS delay.
                                </p>
                                <div className="flex items-center gap-2 text-amber-600 font-semibold group-hover:translate-x-2 transition-transform">
                                    Read Article <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                        </Link>

                        {/* Standard Posts */}
                        {[
                            {
                                tag: "Culture",
                                date: "Feb 10, 2026",
                                title: "Designing for Vulnerability, Not Engagement",
                                excerpt: "The dangerous incentives of the modern web, and why Haven's core metrics completely ignore time-in-app."
                            },
                            {
                                tag: "Update",
                                date: "Jan 28, 2026",
                                title: "Haven Early Access: What to Expect",
                                excerpt: "We are finally opening our doors to the first 5,000 waitlist users next month. Here is exactly what the V1 experience looks like."
                            },
                            {
                                tag: "Engineering",
                                date: "Jan 15, 2026",
                                title: "Building an Infinite Memory Graph",
                                excerpt: "How we utilize vector databases and LLM-driven graph extraction to ensure Haven never forgets your mother's birthday."
                            }
                        ].map((post, i) => (
                            <Link key={i} href="/blog" className="group bg-white p-8 rounded-3xl border border-stone-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
                                <div className="flex items-center gap-4 text-xs font-semibold text-stone-500 mb-4 uppercase tracking-wider">
                                    <span className="text-amber-600">{post.tag}</span>
                                    <span>•</span>
                                    <span>{post.date}</span>
                                </div>
                                <h3 className="text-2xl font-bold text-stone-900 mb-4 group-hover:text-amber-600 transition-colors">{post.title}</h3>
                                <p className="text-stone-600 mb-6 flex-grow">{post.excerpt}</p>
                                <div className="flex items-center gap-2 text-amber-600 font-medium group-hover:px-2 transition-all">
                                    Read <ArrowRight className="w-4 h-4" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
