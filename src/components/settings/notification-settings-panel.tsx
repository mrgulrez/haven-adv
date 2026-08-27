"use client";

import { Award, Bell, CheckCircle2, Info, Loader2, Mail, RefreshCw, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface NotificationSettings {
  email_digests: boolean;
  milestone_alerts: boolean;
  weekly_insights: boolean;
  chat_reminders: boolean;
}

interface NotificationSettingsPanelProps {
  settings: NotificationSettings;
  saving: boolean;
  saved: boolean;
  onChange: (settings: NotificationSettings) => void;
  onSave: () => void;
}

const OPTIONS = [
  { key: "email_digests", label: "Weekly email digest", description: "A recap of your conversations and recent insights", icon: Mail },
  { key: "milestone_alerts", label: "Milestone achievements", description: "Hear when you reach a new personal milestone", icon: Award },
  { key: "weekly_insights", label: "Insights report", description: "A summary of mood patterns and conversation themes", icon: RefreshCw },
  { key: "chat_reminders", label: "Check-in reminders", description: "A gentle daily nudge to pause and reflect", icon: Bell },
] as const;

export function NotificationSettingsPanel({ settings, saving, saved, onChange, onSave }: NotificationSettingsPanelProps) {
  return (
    <div className="space-y-5">
      <section className="glass-panel hairline-glow rounded-3xl p-5 sm:p-6" aria-labelledby="email-preferences-title">
        <h2 id="email-preferences-title" className="mb-5 text-[10px] font-bold uppercase tracking-widest text-stone-400">
          Email preferences
        </h2>
        <div className="space-y-2">
          {OPTIONS.map(({ key, label, description, icon: Icon }) => {
            const enabled = settings[key];
            return (
              <div key={key} className="flex items-center justify-between gap-4 rounded-2xl px-3 py-4 transition-colors hover:bg-white/70 sm:px-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="rounded-xl bg-stone-100 p-2.5" aria-hidden="true">
                    <Icon size={16} className="text-stone-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-stone-900">{label}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-stone-500">{description}</p>
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={enabled}
                  aria-label={`${label}: ${enabled ? "on" : "off"}`}
                  onClick={() => onChange({ ...settings, [key]: !enabled })}
                  className={`relative h-7 w-12 shrink-0 rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/35 ${enabled ? "border-amber-500 bg-amber-500" : "border-stone-200 bg-stone-200"}`}
                >
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${enabled ? "translate-x-5" : "translate-x-0.5"}`} />
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-stone-100 pt-5">
          <p className={`flex items-center gap-1.5 text-xs text-emerald-600 transition-opacity ${saved ? "opacity-100" : "opacity-0"}`} aria-live="polite">
            <CheckCircle2 size={13} /> Preferences saved
          </p>
          <Button type="button" onClick={onSave} disabled={saving} size="sm">
            {saving ? <Loader2 size={14} className="mr-2 animate-spin" /> : <Save size={14} className="mr-2" />}
            Save preferences
          </Button>
        </div>
      </section>

      <aside className="flex items-start gap-4 rounded-3xl border border-amber-200/70 bg-amber-50/80 p-5">
        <Info size={18} className="mt-0.5 shrink-0 text-amber-600" aria-hidden="true" />
        <p className="text-sm leading-relaxed text-amber-900">
          Notifications are sent to the email address connected to your Nuravya account. You can change these preferences at any time.
        </p>
      </aside>
    </div>
  );
}
