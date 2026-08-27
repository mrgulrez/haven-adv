import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/navbar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { CapacitorManager } from "@/components/layout/capacitor-manager";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Nuravya AI — A Calmer Place to Think and Feel Heard",
  description: "A voice-first AI companion for reflection, planning, and everyday conversation, with account-scoped memory and clear privacy boundaries.",
  keywords: ["AI companion", "voice AI", "reflection", "planning", "daily check-ins", "private AI", "AI memory"],
  authors: [{ name: "Gulrez Alam" }],
  creator: "Gulrez Alam",
  publisher: "Nuravya AI",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Nuravya AI — A Calmer Place to Think and Feel Heard",
    description: "Reflection, planning, and everyday conversation with account-scoped memory and clear privacy boundaries.",
    url: "https://nuravya.com",
    siteName: "Nuravya AI",
    images: [
      {
        url: "https://nuravya.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Nuravya AI voice-first companion",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nuravya AI — A Calmer Place to Think and Feel Heard",
    description: "A voice-first AI companion for reflection, planning, and everyday conversation.",
    creator: "@nuravyaai",
    images: ["https://nuravya.com/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
};

import { AuthProvider } from "@/components/auth/auth-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          inter.variable,
          outfit.variable,
          "font-sans antialiased bg-[#F7F1DC] text-[#0E0D0C] relative"
        )}
      >
        <AuthProvider>
          <CapacitorManager />
          <Navbar />
          {/* Status bar blur overlay for mobile notch/battery visibility */}
          <div className="status-bar-overlay md:hidden"></div>

          {/* Main content wrapper */}
          <div className="pb-24 md:pb-0">
            <PageWrapper>
              {children}
            </PageWrapper>
          </div>
          <BottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}
