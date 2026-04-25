import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Care Minutes Funding Calculator — CHRIS-OS",
  description: "Calculate your care minutes supplement funding gap. Most aged care providers are losing $1M–$5M+ annually from April 2026. Find your number in 60 seconds.",
};

export default function CareMinutesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
