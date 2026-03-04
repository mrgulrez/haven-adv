import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/navbar";
import { BottomNav } from "@/components/layout/bottom-nav";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Nuravya AI - Your Warm AI Companion",
  description: "Meet your true everyday companion. Nuravya AI is a voice friend that remembers, cares, and hangs out. Built for genuine connection and privacy.",
  keywords: ["AI companion", "everyday friend", "voice AI", "true companion", "daily check-ins", "virtual companion", "AI friendship"],
  authors: [{ name: "Nuravya AI Team" }],
  creator: "Nuravya AI",
  publisher: "Nuravya AI",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Nuravya AI - Your Warm AI Companion",
    description: "Never feel alone again with Nuravya AI. A voice companion that remembers, cares, and reminds.",
    url: "https://enord.in",
    siteName: "Nuravya AI",
    images: [
      {
        url: "https://enord.in/og-image.png",
        width: 1200,
        height: 630,
        alt: "Nuravya AI - Comfort and connection in every conversation",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nuravya AI - Your Warm AI Companion",
    description: "Never feel alone again with Nuravya AI.",
    creator: "@nuravyaai",
    images: ["https://enord.in/og-image.png"],
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
          "font-sans antialiased bg-[#FFFBEB] text-stone-800 relative"
        )}
      >
        <AuthProvider>
          <Navbar />
          {/* Status bar blur overlay for mobile notch/battery visibility */}
          <div className="status-bar-overlay md:hidden"></div>

          {/* pb-24 on mobile so content clears the floating BottomNav card */}
          <div className="pb-24 md:pb-0">
            {children}
          </div>
          <BottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}
