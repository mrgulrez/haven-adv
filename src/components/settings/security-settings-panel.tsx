"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, Loader2, Lock, LogOut, Shield, Smartphone, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SecuritySettingsPanelProps {
  email: string | null;
  onLogout: () => void | Promise<void>;
  onDeleteAccount: () => Promise<void>;
}

const SAFEGUARDS = [
  { icon: Shield, label: "Protected data", description: "Stored by managed services with access controls" },
  { icon: Lock, label: "Verified authentication", description: "Firebase ID tokens protect authenticated requests" },
  { icon: Smartphone, label: "Account-scoped memory", description: "Memory access is isolated by your account ID" },
] as const;

export function SecuritySettingsPanel({ email, onLogout, onDeleteAccount }: SecuritySettingsPanelProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const cancelDelete = () => {
    setIsConfirming(false);
    setConfirmation("");
    setDeleteError("");
  };

  const handleDelete = async () => {
    if (confirmation !== "DELETE" || isDeleting) return;
    setIsDeleting(true);
    setDeleteError("");
    try {
      await onDeleteAccount();
    } catch {
      setDeleteError("We could not delete your account. Please try again or contact support.");
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-5">
      <section className="glass-panel hairline-glow rounded-3xl p-5 sm:p-6" aria-labelledby="authentication-title">
        <h2 id="authentication-title" className="mb-5 text-[10px] font-bold uppercase tracking-widest text-stone-400">Authentication</h2>
        <div className="mb-5 flex flex-wrap items-center gap-4 rounded-2xl border border-stone-100 bg-white/70 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-stone-200 bg-white shadow-sm" aria-hidden="true">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-stone-900">Google sign-in</p>
            <p className="truncate text-xs text-stone-500">{email}</p>
            <p className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600"><CheckCircle2 size={12} /> Active session</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-[10px] text-stone-400">Identity provider</p>
            <p className="text-xs font-bold text-stone-700">Firebase Auth</p>
          </div>
        </div>

        <div className="space-y-2">
          {SAFEGUARDS.map(({ icon: Icon, label, description }) => (
            <div key={label} className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-emerald-700">
              <Icon size={16} aria-hidden="true" />
              <div><p className="text-sm font-semibold">{label}</p><p className="text-xs opacity-75">{description}</p></div>
              <span className="ml-auto text-[10px] font-bold uppercase tracking-widest opacity-80">Enabled</span>
            </div>
          ))}
        </div>
      </section>

      <section className="glass-panel rounded-3xl p-5 sm:p-6" aria-labelledby="session-title">
        <h2 id="session-title" className="mb-4 text-[10px] font-bold uppercase tracking-widest text-stone-400">Session management</h2>
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div><p className="text-sm font-semibold text-stone-900">Sign out of this device</p><p className="mt-0.5 text-xs text-stone-500">Your Nuravya data remains available when you sign back in.</p></div>
          <Button type="button" variant="outline" size="sm" onClick={onLogout}><LogOut size={15} className="mr-2" />Sign out</Button>
        </div>
      </section>

      <section className="rounded-3xl border border-red-200 bg-white/80 p-5 shadow-sm sm:p-6" aria-labelledby="danger-title">
        <h2 id="danger-title" className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-red-500"><AlertTriangle size={13} />Danger zone</h2>
        {!isConfirming ? (
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div><p className="text-sm font-semibold text-stone-900">Delete account</p><p className="mt-0.5 text-xs text-stone-500">Permanently removes your Nuravya profile and associated application data.</p></div>
            <Button type="button" variant="destructive" size="sm" onClick={() => setIsConfirming(true)}><Trash2 size={15} className="mr-2" />Delete</Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4"><AlertTriangle size={16} className="mt-0.5 shrink-0 text-red-500" /><p className="text-sm text-red-700">This permanently deletes conversations, memories, settings, and other Nuravya data. <strong>This cannot be undone.</strong></p></div>
            <label htmlFor="delete-confirmation" className="block text-xs text-stone-600">Type <strong>DELETE</strong> to confirm</label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input id="delete-confirmation" className="min-h-11 flex-1 rounded-xl border border-red-300 px-4 py-2.5 font-mono text-sm text-red-700 outline-none focus:ring-2 focus:ring-red-300/30" placeholder="DELETE" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} autoComplete="off" />
              <Button type="button" variant="destructive" size="sm" disabled={confirmation !== "DELETE" || isDeleting} onClick={handleDelete}>{isDeleting && <Loader2 size={14} className="mr-2 animate-spin" />}Confirm delete</Button>
              <Button type="button" variant="ghost" size="sm" disabled={isDeleting} onClick={cancelDelete}>Cancel</Button>
            </div>
            {deleteError && <p role="alert" className="text-xs font-medium text-red-600">{deleteError}</p>}
          </div>
        )}
      </section>

      <aside className="flex items-start gap-3 rounded-3xl border border-stone-200 bg-stone-50/80 p-5">
        <Shield size={16} className="mt-0.5 shrink-0 text-stone-400" aria-hidden="true" />
        <p className="text-xs leading-relaxed text-stone-500">We use account-scoped access controls and do not sell personal data. Read the <Link href="/privacy" className="font-medium text-amber-700 underline-offset-4 hover:underline">Privacy Policy</Link>.</p>
      </aside>
    </div>
  );
}
