"use client"

import { useEffect, useState } from "react"
import { Search, MoreVertical, Edit2 } from "lucide-react"
import { AdminUser, fetchAdminUsers, updateUserPlan } from "@/lib/admin-api"

export default function AdminUsers() {
    const [users, setUsers] = useState<AdminUser[]>([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(true)

    const [editingPlan, setEditingPlan] = useState<string | null>(null) // user ID
    const [newPlan, setNewPlan] = useState<"free" | "core" | "pro">("free")

    const loadUsers = async () => {
        setLoading(true)
        try {
            const data = await fetchAdminUsers(page, search)
            setUsers(data.users)
            setTotal(data.total)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadUsers()
    }, [page]) // reload when page changes

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        setPage(1)
        loadUsers()
    }

    const handlePlanSave = async (userId: string) => {
        try {
            await updateUserPlan(userId, newPlan)
            setEditingPlan(null)
            loadUsers() // refresh list
        } catch (err) {
            alert("Failed to update plan")
            console.error(err)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Users</h2>
                    <p className="text-zinc-400 mt-1">
                        Manage {total} platform users and their subscription tiers.
                    </p>
                </div>

                <form onSubmit={handleSearch} className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Search email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                    />
                </form>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-zinc-950/50 text-zinc-400">
                            <tr>
                                <th className="px-6 py-4 font-medium">Email / Name</th>
                                <th className="px-6 py-4 font-medium">Joined</th>
                                <th className="px-6 py-4 font-medium border-l border-zinc-800/50 text-center">Voice Mins</th>
                                <th className="px-6 py-4 font-medium text-center">Text Msgs</th>
                                <th className="px-6 py-4 font-medium">Plan</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/50">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                                        Loading users...
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                                        No users found.
                                    </td>
                                </tr>
                            ) : (
                                users.map((u) => (
                                    <tr key={u.id} className="hover:bg-zinc-800/20 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-white">{u.email}</div>
                                            <div className="text-xs text-zinc-500">{u.display_name || "No name"}</div>
                                        </td>
                                        <td className="px-6 py-4 text-zinc-400">
                                            {new Date(u.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 font-mono text-center border-l border-zinc-800/50 text-orange-400">
                                            {u.voice_minutes_used.toFixed(1)}
                                        </td>
                                        <td className="px-6 py-4 font-mono text-center text-zinc-300">
                                            {u.text_messages_sent}
                                        </td>
                                        <td className="px-6 py-4">
                                            {editingPlan === u.id ? (
                                                <div className="flex items-center gap-2">
                                                    <select
                                                        className="bg-zinc-950 border border-zinc-700 rounded px-2 py-1 text-xs text-white"
                                                        value={newPlan}
                                                        onChange={(e) => setNewPlan(e.target.value as any)}
                                                    >
                                                        <option value="free">Free</option>
                                                        <option value="core">Core</option>
                                                        <option value="pro">Pro</option>
                                                    </select>
                                                    <button
                                                        onClick={() => handlePlanSave(u.id)}
                                                        className="text-xs bg-orange-500 text-white px-2 py-1 rounded hover:bg-orange-600"
                                                    >
                                                        Save
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${u.plan === "pro" ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" :
                                                        u.plan === "core" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                                                            "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20"
                                                    }`}>
                                                    {u.plan}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {!editingPlan && (
                                                <button
                                                    onClick={() => {
                                                        setEditingPlan(u.id)
                                                        setNewPlan(u.plan as any)
                                                    }}
                                                    className="text-zinc-500 hover:text-white p-1 rounded transition-colors"
                                                    title="Edit Plan"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-zinc-800/50 flex items-center justify-between text-sm">
                    <span className="text-zinc-500">
                        Showing {users.length} of {total} users
                    </span>
                    <div className="flex gap-2">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                            className="px-3 py-1 bg-zinc-800 rounded-lg text-white disabled:opacity-50 hover:bg-zinc-700 transition"
                        >
                            Prev
                        </button>
                        <button
                            disabled={page * 20 >= total}
                            onClick={() => setPage(page + 1)}
                            className="px-3 py-1 bg-zinc-800 rounded-lg text-white disabled:opacity-50 hover:bg-zinc-700 transition"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
