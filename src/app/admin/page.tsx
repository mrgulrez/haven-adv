"use client"

import { useEffect, useState } from "react"
import { Activity, Users, CreditCard, MessageSquare, Mic } from "lucide-react"
import { AdminStats, AdminHealthResponse, fetchAdminStats, fetchAdminHealth } from "@/lib/admin-api"

export default function AdminOverview() {
    const [stats, setStats] = useState<AdminStats | null>(null)
    const [loading, setLoading] = useState(true)

    const [health, setHealth] = useState<AdminHealthResponse | null>(null)

    useEffect(() => {
        Promise.all([
            fetchAdminStats().then(setStats),
            fetchAdminHealth().then(setHealth)
        ]).catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    if (loading) {
        return <div className="animate-pulse">Loading dashboard...</div>
    }

    if (!stats) {
        return <div className="text-red-400">Failed to load statistics.</div>
    }

    const statCards = [
        {
            title: "Total Users",
            value: stats.total_users,
            icon: Users,
            color: "text-blue-400 bg-blue-400/10",
        },
        {
            title: "Premium Users (Pro)",
            value: stats.pro_users,
            icon: CreditCard,
            color: "text-purple-400 bg-purple-400/10",
        },
        {
            title: "Total Messages Sent",
            value: stats.total_messages,
            icon: MessageSquare,
            color: "text-green-400 bg-green-400/10",
        },
        {
            title: "Voice Minutes This Month",
            value: stats.total_voice_minutes_this_month.toFixed(1),
            icon: Mic,
            color: "text-orange-400 bg-orange-400/10",
        },
    ]

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
                <p className="text-zinc-400 mt-2">
                    High-level statistics and limits across Nuravya.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, i) => {
                    const Icon = card.icon
                    return (
                        <div
                            key={i}
                            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex items-start gap-4"
                        >
                            <div className={`p-3 rounded-xl ${card.color}`}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-zinc-400 mb-1">{card.title}</p>
                                <p className="text-2xl font-bold text-white tracking-tight">{card.value}</p>
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mt-8">
                <h3 className="text-lg font-bold mb-4">Subscription Breakdown</h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b border-zinc-800/50">
                        <span className="text-zinc-400">Free Tier</span>
                        <span className="font-semibold">{stats.total_users - stats.pro_users - stats.core_users}</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-zinc-800/50">
                        <span className="text-zinc-400">Core Tier</span>
                        <span className="font-semibold text-blue-400">{stats.core_users}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-zinc-400">Pro Tier</span>
                        <span className="font-semibold text-purple-400">{stats.pro_users}</span>
                    </div>
                </div>
            </div>

            {health && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mt-8">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-amber-500" />
                        System Health
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {[
                            { name: "Database", status: health.database },
                            { name: "OpenAI", status: health.openai },
                            { name: "Deepgram", status: health.deepgram },
                            { name: "Cartesia", status: health.cartesia },
                            { name: "Pinecone", status: health.pinecone },
                        ].map((srv) => (
                            <div key={srv.name} className="flex items-center justify-between p-4 bg-zinc-950 rounded-xl border border-zinc-800/50 gap-3 flex-wrap">
                                <span className="font-medium text-zinc-300 whitespace-nowrap">{srv.name}</span>
                                <div className="flex items-center gap-2 whitespace-nowrap">
                                    <span className={`w-2.5 h-2.5 rounded-full ${srv.status === "connected" || srv.status === "initialized"
                                        ? "bg-emerald-500 animate-pulse"
                                        : srv.status === "unconfigured"
                                            ? "bg-zinc-500"
                                            : "bg-red-500"
                                        }`}></span>
                                    <span className="text-xs text-zinc-500 capitalize">{srv.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
