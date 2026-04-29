import type { Metadata } from "next";
import "./globals.css";
import { instrumentSerif, dmSans } from "./fonts";

export const metadata: Metadata = {
  title: "Chris OS — Operational intelligence for Australian aged care",
  description:
    "Seven AI agents monitor every domain of your aged care operation. When something needs action, Chris executes it.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${instrumentSerif.variable} ${dmSans.variable}`}>
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
