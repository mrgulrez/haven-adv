import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Features | Nuravya AI",
  description: "Explore Nuravya's voice conversations, account-scoped memory, daily reflection, goals, and privacy controls.",
};

export default function FeaturesLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
