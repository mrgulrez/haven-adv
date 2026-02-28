import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Nuravya AI - Your Warm AI Companion",
  description: "Never feel alone again with Nuravya AI. A voice companion that remembers, cares, and reminds. Built with radical empathy and unwavering privacy.",
  keywords: ["AI companion", "mental health AI", "loneliness", "voice AI", "empathetic AI", "elderly care", "daily check-ins", "virtual companion"],
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
    url: "https://nuravyaai.example.com",
    siteName: "Nuravya AI",
    images: [
      {
        url: "https://nuravyaai.example.com/og-image.png",
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
    images: ["https://nuravyaai.example.com/og-image.png"],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          inter.variable,
          outfit.variable,
          "font-sans antialiased bg-[#FFFBEB] text-stone-800"
        )}
      >
        {children}
      </body>
    </html>
  );
}
