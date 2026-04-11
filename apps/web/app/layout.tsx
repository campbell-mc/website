import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CHRIS — Culture Health & Reinforcement Intelligent System",
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
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Source+Serif+4:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
