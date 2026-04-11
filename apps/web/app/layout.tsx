import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CHRIS — Culture Habit Reinforcement Intelligence System",
  description:
    "Operational intelligence for Australian aged care providers. Connecting every source system into a single canonical data layer.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1B4332" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
