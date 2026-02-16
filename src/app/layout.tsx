import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Haven AI - Your Warm AI Companion",
  description: "Never feel alone again with Haven AI. A voice companion that remembers, cares, and reminds.",
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
