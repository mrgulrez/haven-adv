"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Trash2, Zap, Shield, User, ChevronRight, Sparkles } from "lucide-react";
import { apiGet, apiPost, apiFetch } from "@/lib/api";

export type Character = {
    id: string;
    name: string;
    description?: string;
    system_prompt: string;
    voice_id?: string;
    is_uncapped: boolean;
    is_public: boolean;
    created_at: string;
    user_id: string;
};

const NURAVYA_DEFAULT: Character = {
    id: "__nuravya__",
    name: "Nuravya",
    description: "Your warm, genuine AI companion. Always here for you.",
    system_prompt: "",
    voice_id: undefined,
    is_uncapped: false,
    is_public: true,
    created_at: "",
    user_id: "",
};

interface CharacterPanelProps {
    isOpen: boolean;
    onClose: () => void;
    selectedCharacter: Character;
    onSelectCharacter: (c: Character) => void;
    isUncapped: boolean;
    onToggleUncapped: (v: boolean) => void;
}

export function CharacterPanel({
    isOpen,
    onClose,
    selectedCharacter,
    onSelectCharacter,
    isUncapped,
    onToggleUncapped,
}: CharacterPanelProps) {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [voices, setVoices] = useState<any[]>([]);
    const [showCreate, setShowCreate] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: "",
        description: "",
        system_prompt: "",
        voice_id: "",
        is_uncapped: false,
    });

    useEffect(() => {
        if (isOpen) {
            fetchCharacters();
            fetchVoices();
        }
    }, [isOpen]);

    const fetchCharacters = async () => {
        try {
            const data = await apiGet<Character[]>("/api/characters");
            setCharacters(data);
        } catch (e) {
            console.warn("Could not fetch characters", e);
        }
    };

    const fetchVoices = async () => {
        try {
            const data = await apiGet<any[]>("/api/voice-settings/voices/presets");
            setVoices(data);
            if (data.length > 0 && !form.voice_id) {
                setForm(f => ({ ...f, voice_id: data[0].voice_id }));
            }
        } catch (e) {
            console.warn("Could not fetch voices", e);
        }
    };

    const handleCreate = async () => {
        if (!form.name.trim() || !form.system_prompt.trim()) return;
        setLoading(true);
        try {
            await apiPost("/api/characters", {
                name: form.name,
                description: form.description,
                system_prompt: form.system_prompt,
                voice_id: form.voice_id || undefined,
                is_uncapped: form.is_uncapped,
                is_public: false,
            });
            setForm({ name: "", description: "", system_prompt: "", voice_id: "", is_uncapped: false });
            setShowCreate(false);
            await fetchCharacters();
        } catch (e) {
            console.error("Create character failed", e);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await apiFetch(`/api/characters/${id}`, { method: "DELETE" });
            setCharacters(prev => prev.filter(c => c.id !== id));
            if (selectedCharacter.id === id) onSelectCharacter(NURAVYA_DEFAULT);
        } catch (e) {
            console.error("Delete failed", e);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[150] bg-black/30 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed right-0 top-0 bottom-0 z-[160] w-[340px] bg-white shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
                            <div>
                                <h2 className="font-bold text-stone-900 text-lg">Characters</h2>
                                <p className="text-xs text-stone-500">Choose your AI companion</p>
                            </div>
                            <button onClick={onClose} className="p-2 rounded-full hover:bg-stone-100 transition-colors text-stone-500">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Uncapped toggle */}
                        <div className="px-5 py-3 border-b border-stone-100 bg-gradient-to-r from-purple-50 to-violet-50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className={`p-1.5 rounded-lg ${isUncapped ? "bg-purple-500" : "bg-stone-200"}`}>
                                        <Zap size={14} className={isUncapped ? "text-white" : "text-stone-500"} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-stone-800">Uncapped Mode</p>
                                        <p className="text-[10px] text-stone-500">Uses unrestricted open-source LLM</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => onToggleUncapped(!isUncapped)}
                                    className={`relative w-11 h-6 rounded-full transition-colors ${isUncapped ? "bg-purple-500" : "bg-stone-300"}`}
                                >
                                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${isUncapped ? "left-6" : "left-1"}`} />
                                </button>
                            </div>
                        </div>

                        {/* Character list */}
                        <div className="flex-1 overflow-y-auto py-2">
                            {/* Default Nuravya */}
                            <CharacterRow
                                character={NURAVYA_DEFAULT}
                                isSelected={selectedCharacter.id === "__nuravya__"}
                                onSelect={() => onSelectCharacter(NURAVYA_DEFAULT)}
                                isDefault
                            />
                            {characters.map(c => (
                                <CharacterRow
                                    key={c.id}
                                    character={c}
                                    isSelected={selectedCharacter.id === c.id}
                                    onSelect={() => onSelectCharacter(c)}
                                    onDelete={(e) => handleDelete(c.id, e)}
                                />
                            ))}
                        </div>

                        {/* Create button */}
                        <div className="border-t border-stone-100 p-4">
                            {!showCreate ? (
                                <button
                                    onClick={() => setShowCreate(true)}
                                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-sm shadow-md shadow-amber-200 hover:shadow-amber-300 hover:scale-[1.01] transition-all"
                                >
                                    <Plus size={16} />
                                    Create Custom Character
                                </button>
                            ) : (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-sm font-semibold text-stone-700">New Character</p>
                                        <button onClick={() => setShowCreate(false)} className="text-stone-400 hover:text-stone-600 text-xs">Cancel</button>
                                    </div>
                                    <input
                                        className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                                        placeholder="Name (e.g. Captain Drake)"
                                        value={form.name}
                                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    />
                                    <input
                                        className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                                        placeholder="Short description (optional)"
                                        value={form.description}
                                        onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                    />
                                    <textarea
                                        className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 resize-none"
                                        placeholder="System prompt — define the character's personality, tone, rules..."
                                        rows={4}
                                        value={form.system_prompt}
                                        onChange={e => setForm(f => ({ ...f, system_prompt: e.target.value }))}
                                    />
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-stone-500 uppercase tracking-tighter ml-1">Assigned Voice</label>
                                        <select
                                            className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none bg-stone-50"
                                            value={form.voice_id}
                                            onChange={e => setForm(f => ({ ...f, voice_id: e.target.value }))}
                                        >
                                            {voices.map(v => (
                                                <option key={v.voice_id} value={v.voice_id}>
                                                    {v.name} ({v.gender || "neutral"})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <div className={`relative w-9 h-5 rounded-full transition-colors ${form.is_uncapped ? "bg-purple-500" : "bg-stone-300"}`} onClick={() => setForm(f => ({ ...f, is_uncapped: !f.is_uncapped }))}>
                                            <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${form.is_uncapped ? "left-4" : "left-0.5"}`} />
                                        </div>
                                        <span className="text-xs text-stone-600 font-medium">Enable Uncapped mode for this character</span>
                                    </label>
                                    <button
                                        onClick={handleCreate}
                                        disabled={loading || !form.name.trim() || !form.system_prompt.trim()}
                                        className="w-full py-2.5 rounded-lg bg-amber-500 text-white font-semibold text-sm disabled:opacity-50 hover:bg-amber-600 transition-colors"
                                    >
                                        {loading ? "Creating..." : "Create Character"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

function CharacterRow({
    character,
    isSelected,
    onSelect,
    onDelete,
    isDefault,
}: {
    character: Character;
    isSelected: boolean;
    onSelect: () => void;
    onDelete?: (e: React.MouseEvent) => void;
    isDefault?: boolean;
}) {
    return (
        <button
            onClick={onSelect}
            className={`w-full flex items-center gap-3 px-4 py-3 transition-colors text-left group ${isSelected ? "bg-amber-50" : "hover:bg-stone-50"}`}
        >
            {/* Avatar */}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isSelected ? "bg-gradient-to-br from-amber-400 to-orange-500" : "bg-stone-100"}`}>
                {isDefault
                    ? <Sparkles size={18} className={isSelected ? "text-white" : "text-stone-500"} />
                    : <User size={18} className={isSelected ? "text-white" : "text-stone-500"} />
                }
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                    <p className={`text-sm font-semibold truncate ${isSelected ? "text-amber-700" : "text-stone-800"}`}>{character.name}</p>
                    {character.is_uncapped && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-600">UNCAPPED</span>
                    )}
                </div>
                {character.description && (
                    <p className="text-xs text-stone-500 truncate">{character.description}</p>
                )}
            </div>
            <div className="flex items-center gap-1 shrink-0">
                {!isDefault && onDelete && (
                    <span
                        onClick={onDelete}
                        className="p-1.5 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-500 text-stone-400 transition-all"
                    >
                        <Trash2 size={14} />
                    </span>
                )}
                {isSelected && <div className="w-2 h-2 rounded-full bg-amber-500 mr-1" />}
            </div>
        </button>
    );
}

export { NURAVYA_DEFAULT };
