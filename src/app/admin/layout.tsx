"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { ShieldAlert, Users, LayoutDashboard, Settings } from "lucide-react"

import { auth } from "@/lib/firebase"
import { apiGet } from "@/lib/api"
import { fetchAdminStats } from "@/lib/admin-api"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        // Wait for Firebase Auth to initialize
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (!user) {
                router.push("/auth")
                return
            }

            try {
                // Attempt to hit the admin stats endpoint as a lightweight authorization check
                await fetchAdminStats()
                setIsAuthorized(true)
            } catch (err: any) {
                console.error("Admin Auth Error:", err)
                router.push("/chat") // Not authorized
            }
        })

        return () => unsubscribe()
    }, [router])

    if (isAuthorized === null) {
        return (
            <div className="min-h-screen flex text-white items-center justify-center bg-zinc-950">
                <span className="opacity-50">Checking admin authorization...</span>
            </div>
        )
    }

    const links = [
        { href: "/admin", label: "Overview", icon: LayoutDashboard },
        { href: "/admin/users", label: "Users", icon: Users },
    ]

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col md:flex-row font-sans">
            {/* Dark status-bar overlay for the dark admin theme */}
            <div className="status-bar-overlay-dark md:hidden" />

            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col gap-6 pt-safe">
                <div className="px-6 pt-3 pb-4 flex flex-col gap-6 flex-1">
                    <div className="flex items-center gap-3 text-orange-400">
                        <ShieldAlert className="w-6 h-6" />
                        <h1 className="text-xl font-bold">Admin Panel</h1>
                    </div>

                    <nav className="flex flex-col gap-2">
                        {links.map((link) => {
                            const Icon = link.icon
                            const isActive = pathname === link.href
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive
                                            ? "bg-zinc-800 text-white font-medium"
                                            : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    {link.label}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Bottom gets pb-safe to clear home indicator */}
                    <div className="mt-auto pb-safe">
                        <Link
                            href="/chat"
                            className="flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-white transition-colors"
                        >
                            ← Back to App
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-12 overflow-y-auto pt-safe md:pt-12">
                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
