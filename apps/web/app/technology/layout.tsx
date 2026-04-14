import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Technology — CHRIS-OS",
  description:
    "How CHRIS-OS works. The middleware layer, seven intelligent agents, and " +
    "execution infrastructure that powers operational intelligence for Australian aged care.",
  openGraph: {
    title: "CHRIS-OS Technology — How it works",
    description:
      "The architecture behind CHRIS-OS. Canonical data layer, seven AI agents, " +
      "and execution infrastructure built for Australian aged care.",
  },
};

export default function TechnologyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
