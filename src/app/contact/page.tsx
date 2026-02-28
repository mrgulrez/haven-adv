"use client";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, MapPin, MessageSquare } from "lucide-react";

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-[#FFFBEB] flex flex-col font-sans">
            <Navbar />
            <div className="flex-grow pt-32 pb-16 px-4 md:px-6 flex flex-col items-center">
                <div className="container mx-auto max-w-5xl">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-6xl font-bold font-heading text-stone-900 mb-6">Get in touch</h1>
                        <p className="text-xl text-stone-600 max-w-2xl mx-auto">Have a question? We would love to hear from you. We read every single message.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 bg-white rounded-3xl overflow-hidden shadow-xl border border-stone-100 max-w-5xl w-full">
                        {/* Contact Form */}
                        <div className="p-8 md:p-12">
                            <h2 className="text-2xl font-bold font-heading text-stone-900 mb-6">Send a message</h2>
                            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert("Thanks for reaching out! In a production app, this would connect to an API."); }}>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor="first-name" className="text-sm font-medium text-stone-700">First name</label>
                                        <Input id="first-name" placeholder="Jane" className="bg-stone-50 border-stone-200" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="last-name" className="text-sm font-medium text-stone-700">Last name</label>
                                        <Input id="last-name" placeholder="Doe" className="bg-stone-50 border-stone-200" required />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium text-stone-700">Email address</label>
                                    <Input id="email" type="email" placeholder="jane@example.com" className="bg-stone-50 border-stone-200" required />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-sm font-medium text-stone-700">Message</label>
                                    <textarea
                                        id="message"
                                        className="flex w-full rounded-md border border-stone-200 bg-stone-50 px-3 py-2 text-sm placeholder:text-stone-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 disabled:cursor-not-allowed disabled:opacity-50 min-h-[120px]"
                                        placeholder="How can we help?"
                                        required
                                    />
                                </div>
                                <Button type="submit" size="lg" className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-md">
                                    Send Message
                                </Button>
                            </form>
                        </div>

                        {/* Contact Guidelines / Info */}
                        <div className="bg-stone-900 text-stone-300 p-8 md:p-12 flex flex-col justify-center">
                            <h3 className="text-2xl font-bold font-heading text-white mb-8">Other ways to connect</h3>

                            <div className="space-y-6 mb-12 flex-grow">
                                <div className="flex items-start gap-4">
                                    <Mail className="w-6 h-6 text-amber-500 shrink-0 mt-1" />
                                    <div>
                                        <h4 className="text-white font-medium mb-1">Email Support</h4>
                                        <p className="text-sm text-stone-400">Our support team aims to respond within 24 hours.</p>
                                        <p className="text-amber-400 mt-1 hover:underline cursor-pointer font-medium">hello@nuravyaai.example.com</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <MapPin className="w-6 h-6 text-amber-500 shrink-0 mt-1" />
                                    <div>
                                        <h4 className="text-white font-medium mb-1">Headquarters</h4>
                                        <p className="text-sm text-stone-400">100 AI Plaza, Suite 400<br />San Francisco, CA 94107</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <MessageSquare className="w-6 h-6 text-amber-500 shrink-0 mt-1" />
                                    <div>
                                        <h4 className="text-white font-medium mb-1">Press & Media</h4>
                                        <p className="text-sm text-stone-400">For interview requests and media resources.</p>
                                        <p className="text-amber-400 mt-1 hover:underline cursor-pointer font-medium">press@nuravyaai.example.com</p>
                                    </div>
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
