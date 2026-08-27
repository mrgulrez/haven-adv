import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Roadmap | Nuravya AI",
  description: "See what is available in Nuravya today, what is being improved next, and what remains exploratory.",
};

export default function RoadmapLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
