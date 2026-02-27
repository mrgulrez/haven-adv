import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Haven AI - Your Warm AI Companion",
  description: "Never feel alone again with Haven AI. A voice companion that remembers, cares, and reminds. Built with radical empathy and unwavering privacy.",
  keywords: ["AI companion", "mental health AI", "loneliness", "voice AI", "empathetic AI", "elderly care", "daily check-ins"],
  openGraph: {
    title: "Haven AI - Your Warm AI Companion",
    description: "Never feel alone again with Haven AI. A voice companion that remembers, cares, and reminds.",
    url: "https://havenai.example.com",
    siteName: "Haven AI",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Haven AI - Your Warm AI Companion",
    description: "Never feel alone again with Haven AI. A voice companion that remembers, cares, and reminds.",
    creator: "@havenai",
  },
  robots: {
    index: true,
    follow: true,
  }
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
