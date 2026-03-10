"use client";

import { useState, useRef } from "react";
import { UploadCloud, Mic, Loader2, Wand2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiFetch } from "@/lib/api";
import { StatusModal } from "@/components/ui/success-modal";

interface VoiceClonerProps {
    hasAccess: boolean;
    onSuccess: () => void;
    onUpgradeClick: () => void;
}

export function VoiceCloner({ hasAccess, onSuccess, onUpgradeClick }: VoiceClonerProps) {
    const [file, setFile] = useState<File | null>(null);
    const [name, setName] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        variant: "success" | "error";
    }>({ isOpen: false, title: "", message: "", variant: "success" });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleClone = async () => {
        if (!hasAccess) {
            onUpgradeClick();
            return;
        }

        if (!file) {
            setModalConfig({
                isOpen: true,
                title: "No File Selected",
                message: "Please select an audio file to clone.",
                variant: "error",
            });
            return;
        }

        if (!name.trim()) {
            setModalConfig({
                isOpen: true,
                title: "Voice Name Required",
                message: "Please provide a name for your custom voice.",
                variant: "error",
            });
            return;
        }

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("name", name);

            const res = await apiFetch("/api/voice-settings/voices/clone", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Failed to clone voice: ${errorText}`);
            }

            setModalConfig({
                isOpen: true,
                title: "Voice Cloned! 🎉",
                message: `Your voice "${name}" has been successfully cloned and set as active.`,
                variant: "success",
            });

            // Clear form
            setFile(null);
            setName("");
            if (fileInputRef.current) fileInputRef.current.value = "";

            onSuccess();
        } catch (err: any) {
            console.error(err);
            setModalConfig({
                isOpen: true,
                title: "Cloning Failed",
                message: err.message || "An error occurred while cloning your voice.",
                variant: "error",
            });
        } finally {
            setIsUploading(true);
            setIsUploading(false); // Reset properly
        }
    };

    return (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-amber-100 rounded-xl text-amber-600">
                    <Wand2 size={24} />
                </div>
                <div>
                    <h3 className="font-bold text-stone-900">Custom Voice Cloning</h3>
                    <p className="text-sm text-stone-500">Upload a crisp audio clip to clone your own voice.</p>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-semibold text-stone-500 mb-1">Voice Name</label>
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. My Custom Voice"
                        className="bg-stone-50 border-stone-200 rounded-xl"
                        disabled={!hasAccess || isUploading}
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-stone-500 mb-1">Audio Clip (MP3, WAV)</label>
                    <div
                        className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${file ? 'border-amber-400 bg-amber-50' : 'border-stone-200 hover:border-amber-200 bg-stone-50'}`}
                        onClick={() => hasAccess && !isUploading && fileInputRef.current?.click()}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="audio/mp3,audio/wav,audio/mpeg,audio/x-m4a"
                            className="hidden"
                            disabled={!hasAccess || isUploading}
                        />
                        {file ? (
                            <div className="flex flex-col items-center gap-2">
                                <Mic size={24} className="text-amber-500" />
                                <span className="text-sm font-medium text-amber-800">{file.name}</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2 text-stone-400">
                                <UploadCloud size={24} />
                                <span className="text-sm text-stone-500">Click to select an audio file</span>
                            </div>
                        )}
                    </div>
                </div>

                {!hasAccess ? (
                    <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 flex items-start gap-3 mt-4">
                        <AlertCircle className="text-amber-600 mt-0.5 shrink-0" size={18} />
                        <div>
                            <p className="text-sm font-semibold text-amber-900 mb-1">Pro/Core Plan Required</p>
                            <p className="text-xs text-amber-700 mb-3">Upgrade your plan to unlock custom voice cloning.</p>
                            <Button
                                size="sm"
                                className="bg-amber-500 hover:bg-amber-600 text-white rounded-lg w-full"
                                onClick={onUpgradeClick}
                            >
                                Upgrade Plan
                            </Button>
                        </div>
                    </div>
                ) : (
                    <Button
                        onClick={handleClone}
                        disabled={isUploading || !file || !name.trim()}
                        className="w-full bg-stone-900 hover:bg-stone-800 text-white rounded-xl py-6"
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Cloning Voice... (Takes a moment)
                            </>
                        ) : (
                            <>
                                <Wand2 className="mr-2 h-5 w-5" />
                                Clone & Activate Voice
                            </>
                        )}
                    </Button>
                )}
            </div>

            <StatusModal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                title={modalConfig.title}
                message={modalConfig.message}
                variant={modalConfig.variant}
            />
        </div>
    );
}
