import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing | Nuravya AI",
  description: "Compare Nuravya Free, Core, and Pro plans with clear usage limits and no hidden fees.",
};

export default function PricingLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
