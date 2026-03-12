"use client";

import { useState, useEffect } from "react";
import { Footer } from "@/components/layout/footer";
import { useAuth } from "@/components/auth/auth-provider";
import { useRouter } from "next/navigation";
import { apiGet, apiPost } from "@/lib/api";
import {
  Heart,
  TrendingUp,
  Sparkles,
  Bell,
  Loader2,
  Lock,
  ChevronRight,
  Calendar,
  BarChart3,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface InsightItem {
  id: string;
  period_date: string | null;
  dominant_emotion: string | null;
  emotion_distribution: Record<string, number>;
  summary: string | null;
}

interface CheckinEvent {
  id: string;
  event_type: string;
  trigger_context: string | null;
  message: string | null;
  status: string;
  scheduled_at: string | null;
}

const EMOTION_COLORS: Record<string, string> = {
  joy: "#FBBF24", love: "#F472B6", gratitude: "#34D399", excitement: "#FB923C",
  calm: "#60A5FA", sadness: "#93C5FD", anxiety: "#A78BFA", anger: "#F87171",
  frustration: "#FB7185", loneliness: "#C4B5FD", fear: "#FCA5A5",
  confusion: "#D1D5DB", hope: "#6EE7B7", nostalgia: "#FDE68A", neutral: "#D6D3D1",
};

export default function InsightsPage() {
  const { user, nuravyaUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const [insights, setInsights] = useState<InsightItem[]>([]);
  const [checkins, setCheckins] = useState<CheckinEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const isPaid = nuravyaUser?.plan === "core" || nuravyaUser?.plan === "pro";

  useEffect(() => {
    if (!authLoading && !user) router.push("/");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user || !isPaid) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [insightsData, checkinsData] = await Promise.all([
          apiGet<InsightItem[]>("/api/insights/insights?limit=8"),
          apiGet<CheckinEvent[]>("/api/insights/checkins"),
        ]);
        setInsights(insightsData);
        setCheckins(checkinsData);
      } catch (err) {
        console.warn("Insights load failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, isPaid]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const result = await apiPost<{ status: string; summary?: string }>("/api/insights/insights/generate", {});
      if (result.status === "generated") {
        // Refresh insights
        const data = await apiGet<InsightItem[]>("/api/insights/insights?limit=8");
        setInsights(data);
      }
    } catch (err) {
      console.warn("Generation failed:", err);
    } finally {
      setGenerating(false);
    }
  };

  const dismissCheckin = async (eventId: string) => {
    try {
      await apiPost(`/api/insights/checkins/${eventId}/dismiss`, {});
      setCheckins((prev) => prev.filter((c) => c.id !== eventId));
    } catch (err) {
      console.warn("Dismiss failed:", err);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-[#FFFBEB] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Gate for free users
  if (!isPaid) {
    return (
      <main className="min-h-screen bg-[#FFFBEB] flex flex-col font-sans">
        <div className="flex-grow pb-24 px-4 md:px-6 flex items-center justify-center">
          <div className="bg-white rounded-3xl p-12 border border-stone-200 shadow-sm text-center max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-200">
              <Lock size={28} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold font-heading text-stone-900 mb-3">Emotional Insights</h2>
            <p className="text-stone-500 mb-6">
              Unlock emotion detection, weekly insight reports, and proactive check-ins with Nuravya Core or Pro.
            </p>
            <Link href="/pricing">
              <Button className="bg-amber-500 hover:bg-amber-600 text-white">View Plans</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FFFBEB] flex flex-col font-sans">
      <div className="flex-grow pb-24 px-4 md:px-6">
        <div className="container mx-auto max-w-5xl">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold font-heading text-stone-900 flex items-center gap-3">
                <Heart className="text-pink-500" size={32} />
                Emotional Insights
              </h1>
              <p className="text-stone-500 mt-1">Understanding your emotional patterns over time</p>
            </div>
            <Button
              onClick={handleGenerate}
              disabled={generating}
              className="bg-purple-500 hover:bg-purple-600 text-white"
              size="sm"
            >
              {generating ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Sparkles size={14} className="mr-1" />}
              Generate Report
            </Button>
          </div>

          {/* Proactive Check-ins */}
          <AnimatePresence>
            {checkins.map((checkin) => (
              <motion.div
                key={checkin.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-200 mb-4 relative"
              >
                <button
                  onClick={() => dismissCheckin(checkin.id)}
                  className="absolute top-3 right-3 p-1 text-stone-400 hover:text-stone-600 rounded-full hover:bg-white/50"
                >
                  <X size={16} />
                </button>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-100 rounded-xl">
                    <Bell size={18} className="text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-stone-900 mb-1">Nuravya is thinking of you</p>
                    <p className="text-sm text-stone-700">{checkin.message}</p>
                    <p className="text-xs text-stone-400 mt-2">
                      {checkin.scheduled_at && new Date(checkin.scheduled_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
          ) : insights.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 border border-stone-200 text-center">
              <TrendingUp className="mx-auto mb-4 text-stone-300" size={48} />
              <h3 className="text-lg font-bold text-stone-900 mb-2">No insights yet</h3>
              <p className="text-stone-500 mb-4">Keep chatting with Nuravya to build emotional data for your first weekly report.</p>
              <Link href="/chat">
                <Button className="bg-amber-500 hover:bg-amber-600 text-white">Chat Now</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {insights.map((insight) => {
                const totalMessages = Object.values(insight.emotion_distribution).reduce((a, b) => a + b, 0);
                const topEmotions = Object.entries(insight.emotion_distribution)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 5);

                return (
                  <motion.div
                    key={insight.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm"
                  >
                    {/* Week Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-purple-500" />
                        <span className="text-sm font-semibold text-stone-600">
                          Week of {insight.period_date ? new Date(insight.period_date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}
                        </span>
                      </div>
                      <span className="text-xs text-stone-400">{totalMessages} messages analyzed</span>
                    </div>

                    {/* Dominant Emotion */}
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: EMOTION_COLORS[insight.dominant_emotion || "neutral"] + "30" }}
                      >
                        <Heart size={18} style={{ color: EMOTION_COLORS[insight.dominant_emotion || "neutral"] }} />
                      </div>
                      <div>
                        <span className="text-xs text-stone-500 uppercase tracking-wider">Dominant Emotion</span>
                        <p className="text-lg font-bold text-stone-900 capitalize">{insight.dominant_emotion}</p>
                      </div>
                    </div>

                    {/* Emotion Bars */}
                    <div className="space-y-2 mb-4">
                      {topEmotions.map(([emotion, count]) => (
                        <div key={emotion} className="flex items-center gap-3">
                          <span className="text-xs text-stone-500 w-20 text-right capitalize">{emotion}</span>
                          <div className="flex-1 h-3 bg-stone-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${(count / totalMessages) * 100}%`,
                                backgroundColor: EMOTION_COLORS[emotion] || "#D6D3D1",
                              }}
                            />
                          </div>
                          <span className="text-xs text-stone-400 w-8">{count}</span>
                        </div>
                      ))}
                    </div>

                    {/* AI Summary */}
                    {insight.summary && (
                      <div className="bg-stone-50 rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles size={14} className="text-purple-500" />
                          <span className="text-xs font-semibold text-stone-500">Nuravya&apos;s Reflection</span>
                        </div>
                        <p className="text-sm text-stone-700 leading-relaxed">{insight.summary}</p>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
