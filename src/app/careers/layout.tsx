import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers | Nuravya AI",
  description: "Explore opportunities to help build a calmer, trustworthy AI companion with the Nuravya team.",
};

export default function CareersLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
