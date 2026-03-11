/**
 * site.config.ts — Single source of truth for all Nuravya website content.
 *
 * IMPORTANT: All claims here must be honest and verifiable.
 * We are in pre-launch / early access phase. No beta stats have been collected.
 * Messaging should reflect genuine product capabilities, not projected metrics.
 */

// ─── Company & Brand ─────────────────────────────────────────────────────────

export const BRAND = {
    name: "Nuravya",
    tagline: "An AI that truly knows you",
    description: "Nuravya is an AI companion that truly knows you — voice-first, memory-powered, and warm enough to feel like a friend who never forgets.",
    email: {
        hello: "hello@nuravya.com",
        support: "support@nuravya.com",
        admin: "admin@nuravya.com",
    },
    social: {
        twitter: "https://twitter.com/nuravya_ai",
        instagram: "https://instagram.com/nuravya_ai",
        linkedin: "https://linkedin.com/company/nuravya",
    },
    launchPhase: "Early Access" as const,   // "Early Access" | "Beta" | "GA"
} as const

// ─── Product Stats (only honest, verifiable claims) ──────────────────────────
// NOTE: Do NOT add user-count or retention stats until real data is collected.

export const PRODUCT_STATS = [
    { value: "<1s", label: "Voice response time" },
    { value: "24/7", label: "Always available" },
    { value: "100%", label: "Private & encrypted" },
    { value: "E2E", label: "Encrypted memory" },
] as const

// ─── Pricing Plans ────────────────────────────────────────────────────────────
// These must exactly match the backend plan IDs: "free" | "core" | "pro"

export const PLANS = [
    {
        id: "free" as const,
        name: "Free",
        price: 0,
        priceLabel: "$0",
        period: "/mo",
        badge: null,
        highlight: false,
        description: "Start exploring. No credit card required.",
        features: [
            "Unlimited text conversations",
            "30-day conversation memory",
            "1 AI voice (default)",
            "Basic emotional check-ins",
        ],
        limits: {
            voiceMinutes: 0,
            memoryDays: 30,
            characters: 1,
        },
        cta: { label: "Get Started Free", href: "/chat" },
    },
    {
        id: "core" as const,
        name: "Nuravya Core",
        price: 24,
        priceLabel: "$24",
        period: "/mo",
        badge: "Most Popular",
        highlight: true,
        description: "Deeper connection. Real continuity. For users who want Nuravya to truly grow with them.",
        features: [
            "Everything in Free",
            "300 High-Fidelity Voice Minutes",
            "Sub-500ms Real-Time Response",
            "Natural Interruption Capability",
            "Full Access to 6+ Premium AI Voices",
            "Infinite Long-Term Memory",
            "Emotional Insights Dashboard",
        ],
        limits: {
            voiceMinutes: 300,
            memoryDays: Infinity,
            characters: 1,
        },
        cta: { label: "Start Core", href: "/chat?plan=core" },
    },
    {
        id: "pro" as const,
        name: "Nuravya Pro",
        price: 59,
        priceLabel: "$59",
        period: "/mo",
        badge: "Power Users",
        highlight: false,
        description: "The ultimate emotionally intelligent companion for deep personalization.",
        features: [
            "Everything in Core",
            "700 Ultra-Premium Voice Minutes",
            "Professional Voice Cloning",
            "Advanced Emotional Prosody",
            "Multiple Companion Personalities",
            "Priority Response Speed",
            "Early Access to New Models",
        ],
        limits: {
            voiceMinutes: 700,
            memoryDays: Infinity,
            characters: 5,
        },
        cta: { label: "Start Pro", href: "/chat?plan=pro" },
    },
];

// ─── Core Features ────────────────────────────────────────────────────────────

export const FEATURES = [
    {
        id: "voice",
        icon: "Mic",
        badge: "Core",
        badgeColor: "amber",
        title: "Voice-First Conversation",
        description: "Speak naturally at any pace. Nuravya responds with ultra-realistic voice synthesis — warm, unhurried, and genuinely attentive.",
        stat: { value: "300+ min", label: "Voice included" },
    },
    {
        id: "memory",
        icon: "Brain",
        badge: "Smart",
        badgeColor: "purple",
        title: "Emotional Memory Engine",
        description: "Every conversation is remembered. Nuravya recalls your stories, mood patterns, and important dates — building real continuity over time.",
        stat: { value: "Persistent", label: "Cross-session memory" },
    },
    {
        id: "personas",
        icon: "Sparkles",
        badge: "Unique",
        badgeColor: "rose",
        title: "Custom Personas & Characters",
        description: "Create companions with their own backstory, voice, and personality. From a stoic mentor to a playful friend — Nuravya adapts completely.",
        stat: { value: "Multiple", label: "Custom characters" },
    },
    {
        id: "insights",
        icon: "BarChart3",
        badge: "Core",
        badgeColor: "blue",
        title: "Emotional Insights Dashboard",
        description: "Nuravya surfaces patterns in your mood and conversations — giving you a gentle mirror for your inner world.",
        stat: { value: "Weekly", label: "Mood reports" },
    },
    {
        id: "always",
        icon: "Clock",
        badge: "Always",
        badgeColor: "emerald",
        title: "24/7 Availability",
        description: "3 AM anxious thoughts or 6 AM morning check-ins — Nuravya is always awake, always present, never tired.",
        stat: { value: "24/7", label: "No downtime" },
    },
    {
        id: "private",
        icon: "Lock",
        badge: "Secure",
        badgeColor: "stone",
        title: "Privacy by Design",
        description: "End-to-end encrypted conversations, zero third-party data sharing, and user-scoped AI memory. Your data is yours — always.",
        stat: { value: "E2E", label: "Encrypted" },
    },
] as const

// ─── Trust & Security ─────────────────────────────────────────────────────────

export const TRUST_POINTS = [
    {
        icon: "Cpu",
        title: "Google Gemini LLM",
        description: "Powered by enterprise-grade AI for natural, safe, and nuanced conversation.",
    },
    {
        icon: "ShieldCheck",
        title: "Privacy First",
        description: "We never sell or share your conversations. Your data is encrypted at rest and in transit.",
    },
    {
        icon: "Lock",
        title: "User-Owned Memory",
        description: "Your conversation history belongs to you. Export or delete it at any time.",
    },
    {
        icon: "Database",
        title: "Secure Cloud",
        description: "Built on enterprise infrastructure with 99.9% uptime SLA and real-time monitoring.",
    },
] as const

// ─── FAQ ──────────────────────────────────────────────────────────────────────

export const FAQ_ITEMS = [
    {
        q: "Is Nuravya a therapy app?",
        a: "No. Nuravya is an AI companion designed for everyday conversation, emotional support, and connection. It is not a substitute for professional mental health care. If you're in crisis, please reach out to a licensed therapist or a crisis helpline.",
    },
    {
        q: "Is my data private?",
        a: "Yes. All conversations are encrypted end-to-end. We don't sell your data, share it with third parties, or use it to train models without explicit consent.",
    },
    {
        q: "Can Nuravya remember things between sessions?",
        a: "Yes. Nuravya maintains a persistent memory of your conversations, important dates, and shared experiences — so every session builds continuity rather than starting from scratch.",
    },
    {
        q: "What are voice minutes?",
        a: "Voice minutes count the duration of real-time voice calls. Free users get text-only access. Core users get 300 minutes/month. Pro users get 700 minutes/month.",
    },
    {
        q: "Can I cancel at any time?",
        a: "Yes, no lock-in. You can cancel or downgrade at any time from your account settings. Your memory is retained even on the Free plan for 30 days after downgrade.",
    },
    {
        q: "Does Nuravya work on Android?",
        a: "Yes. Nuravya is available as a web app and as an Android app. iOS support is planned for a future release.",
    },
] as const

// ─── Early Access Messaging ───────────────────────────────────────────────────
// Used on Hero, Waitlist, and social sections.

export const EARLY_ACCESS = {
    badge: "Now in Early Access",
    headline: "Be among the first to experience Nuravya",
    subline: "We're rolling out access gradually to ensure every user gets a personal, high-quality experience.",
    cta: {
        primary: { label: "Start for Free", href: "/chat" },
        secondary: { label: "See how it works", href: "#features" },
    },
} as const
