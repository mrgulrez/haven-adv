import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Nuravya AI",
  description: "Meet the ideas and product principles behind Nuravya's calmer, memory-aware AI companion.",
};

export default function AboutLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
