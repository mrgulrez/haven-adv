import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Security & Privacy | Nuravya AI",
  description: "See Nuravya's current authentication, account isolation, data controls, and security practices.",
};

export default function SecurityLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
