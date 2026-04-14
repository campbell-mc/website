import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Newsroom — CHRIS-OS",
  description:
    "Live sector intelligence for Australian aged care. The Curator monitors 35 sources " +
    "every 2 hours — regulatory updates, funding changes, workforce intelligence, and sector news.",
  openGraph: {
    title: "CHRIS Newsroom — Aged Care Sector Intelligence",
    description:
      "Live intelligence from 35 sources. Regulatory changes, funding updates, workforce " +
      "data, and sector news — curated every 2 hours by The Curator.",
  },
};

export default function NewsroomLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
