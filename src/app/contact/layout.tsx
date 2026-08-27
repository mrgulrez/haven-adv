import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Nuravya AI",
  description: "Contact the Nuravya team about product access, partnerships, support, or privacy questions.",
};

export default function ContactLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
