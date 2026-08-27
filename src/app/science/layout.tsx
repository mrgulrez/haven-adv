import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Approach | Nuravya AI",
  description: "Learn how Nuravya approaches reflective conversation, memory, and responsible companion design without clinical claims.",
};

export default function ScienceLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
