import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Journal | Nuravya AI",
  description: "Product notes and practical thinking about AI companionship, memory, voice, privacy, and reflective design.",
};

export default function BlogLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
