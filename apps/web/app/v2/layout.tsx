import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CHRIS-OS — Operational intelligence for Australian aged care",
  description: "Seven AI agents monitor every domain of your aged care operation. When something needs action, CHRIS executes it.",
};

export default function V2Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
