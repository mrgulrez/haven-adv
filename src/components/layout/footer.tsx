"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Twitter, Linkedin, Instagram } from "lucide-react"

export function Footer() {
    return (
        <footer className="bg-stone-900 text-stone-300 py-12 md:py-16">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    <div className="md:col-span-1">
                        <Link href="/" className="text-2xl font-bold font-heading text-white mb-4 block">
                            Haven AI
                        </Link>
                        <p className="text-sm text-stone-400 mb-6">
                            Your warm AI companion that remembers, cares, and reminds. Never feel alone again.
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="hover:text-white transition-colors">
                                <Twitter size={20} />
                            </Link>
                            <Link href="#" className="hover:text-white transition-colors">
                                <Linkedin size={20} />
                            </Link>
                            <Link href="#" className="hover:text-white transition-colors">
                                <Instagram size={20} />
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold text-white mb-4">Product</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="#" className="hover:text-white transition-colors">Features</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Pricing</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Security</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Roadmap</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-white mb-4">Company</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-white mb-4">Stay Included</h4>
                        <p className="text-sm text-stone-400 mb-4">
                            Join 5,000+ people excited for Haven's launch.
                        </p>
                        <form
                            onSubmit={async (e) => {
                                e.preventDefault()
                                const form = e.target as HTMLFormElement
                                const emailInput = form.elements.namedItem('email') as HTMLInputElement
                                const email = emailInput.value
                                if (!email) return

                                try {
                                    const res = await fetch('/api/waitlist', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ email, source: 'Footer Newsletter' }),
                                    })
                                    if (res.ok) {
                                        alert('Thanks for subscribing!')
                                        form.reset()
                                    }
                                } catch (err) {
                                    console.error(err)
                                }
                            }}
                            className="flex gap-2"
                        >
                            <Input
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                className="bg-stone-800 border-stone-700 text-white placeholder:text-stone-500 focus-visible:ring-amber-500"
                                required
                            />
                            <Button type="submit" size="icon" className="shrink-0 bg-amber-500 hover:bg-amber-600 text-white">
                                →
                            </Button>
                        </form>
                    </div>
                </div>

                <div className="pt-8 border-t border-stone-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-stone-500">
                    <p>© 2026 Haven AI Inc. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
