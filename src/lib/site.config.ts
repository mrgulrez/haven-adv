/**
 * site.config.ts - Single source of truth for Nuravya website content.
 * Keep public claims honest and verifiable for the current early-access product.
 */

export const BRAND = {
    name: "Nuravya",
    tagline: "A private companion that grows with you",
    description: "Nuravya is a voice-first AI companion for reflection, planning, and everyday conversation - with account-scoped memory and clear privacy boundaries.",
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
    launchPhase: "Early Access" as const,
} as const

export const PRODUCT_STATS = [
    { value: "Voice", label: "Talk or type" },
    { value: "Memory", label: "Account-scoped context" },
    { value: "Private", label: "No public-feed sharing" },
    { value: "Daily", label: "Check-ins and goals" },
] as const

export const PLANS = [
    {
        id: "free" as const,
        name: "Free",
        price: 0,
        priceLabel: "$0",
        period: "/mo",
        badge: null,
        highlight: false,
        description: "Start exploring the companion experience. No credit card required.",
        features: [
            "Text conversations",
            "30-day conversation memory",
            "Default companion persona",
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
        description: "For users who want voice conversations and deeper continuity.",
        features: [
            "Everything in Free",
            "300 voice minutes per month",
            "Real-time voice calling where supported",
            "Expanded companion voices",
            "Longer memory retention",
            "Mood and conversation insights",
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
        description: "For people who want more voice time, more personas, and early feature access.",
        features: [
            "Everything in Core",
            "700 voice minutes per month",
            "Multiple companion personalities",
            "Priority access to new voice and memory features",
            "Advanced personalization controls",
            "Early access to product experiments",
        ],
        limits: {
            voiceMinutes: 700,
            memoryDays: Infinity,
            characters: 5,
        },
        cta: { label: "Start Pro", href: "/chat?plan=pro" },
    },
]

export const FEATURES = [
    {
        id: "voice",
        icon: "Mic",
        badge: "Core",
        badgeColor: "amber",
        title: "Voice-first conversation",
        description: "Move naturally between text and voice when a spoken conversation feels easier than typing.",
        stat: { value: "300 min", label: "Core voice time" },
    },
    {
        id: "memory",
        icon: "Brain",
        badge: "Memory",
        badgeColor: "purple",
        title: "Context that carries forward",
        description: "Nuravya can remember useful details from prior conversations so you do not have to restart every time.",
        stat: { value: "Scoped", label: "Per account" },
    },
    {
        id: "personas",
        icon: "Sparkles",
        badge: "Personal",
        badgeColor: "rose",
        title: "Custom companion styles",
        description: "Create a companion tone that fits the job: gentle reflection, focused coaching, or a more playful everyday voice.",
        stat: { value: "5", label: "Pro personas" },
    },
    {
        id: "insights",
        icon: "BarChart3",
        badge: "Reflection",
        badgeColor: "blue",
        title: "Mood and conversation insights",
        description: "Review patterns across check-ins and conversations without turning the product into a clinical dashboard.",
        stat: { value: "Weekly", label: "Useful summaries" },
    },
    {
        id: "always",
        icon: "Clock",
        badge: "Daily",
        badgeColor: "emerald",
        title: "Available when you need a check-in",
        description: "Use Nuravya for quick morning plans, late-night thoughts, or a short reset between tasks.",
        stat: { value: "24/7", label: "Access" },
    },
    {
        id: "private",
        icon: "Lock",
        badge: "Trust",
        badgeColor: "stone",
        title: "Privacy boundaries users can understand",
        description: "Conversation data is scoped to your account, protected in transit, and designed around inspectable memory controls.",
        stat: { value: "Private", label: "By design" },
    },
] as const

export const TRUST_POINTS = [
    {
        icon: "Cpu",
        title: "Memory-aware AI",
        description: "Designed around conversation context, voice state, and safety boundaries for more natural continuity.",
    },
    {
        icon: "ShieldCheck",
        title: "Privacy First",
        description: "We do not sell personal conversations, and sensitive product claims stay plain and verifiable.",
    },
    {
        icon: "Lock",
        title: "User-Owned Memory",
        description: "Conversation history should stay inspectable, exportable, and deletable as the product matures.",
    },
    {
        icon: "Database",
        title: "Secure Cloud Foundation",
        description: "Built with authenticated APIs, user-scoped data boundaries, encrypted transport, and service monitoring.",
    },
] as const

export const FAQ_ITEMS = [
    {
        q: "Is Nuravya a therapy app?",
        a: "No. Nuravya is an AI companion designed for everyday conversation, emotional support, and reflection. It is not a substitute for professional mental health care.",
    },
    {
        q: "Is my data private?",
        a: "Conversations are scoped to your account and protected in transit. We do not sell personal conversations, and memory controls should let you inspect or delete stored context.",
    },
    {
        q: "Can Nuravya remember things between sessions?",
        a: "Yes. Nuravya can maintain useful context from prior conversations so future sessions feel more continuous.",
    },
    {
        q: "What are voice minutes?",
        a: "Voice minutes count the duration of real-time voice calls. Free users can start with text, Core includes 300 minutes per month, and Pro includes 700 minutes per month.",
    },
    {
        q: "Can I cancel at any time?",
        a: "Yes. Plans should stay flexible with no lock-in.",
    },
    {
        q: "Does Nuravya work on Android?",
        a: "Yes. Nuravya is built for the web and Android support is included through the mobile app shell.",
    },
] as const

export const EARLY_ACCESS = {
    badge: "Now in Early Access",
    headline: "Be among the first to experience Nuravya",
    subline: "We are rolling out access gradually so every user gets a stable, personal experience.",
    cta: {
        primary: { label: "Start for Free", href: "/chat" },
        secondary: { label: "See how it works", href: "#features" },
    },
} as const
