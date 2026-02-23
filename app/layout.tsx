import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AthleteIQ — Sports Science AI",
  description:
    "Evidence-based answers on endurance physiology, training load, recovery, and performance. Built on peer-reviewed research including published work from Harrison Dudley-Rode (EJAP, 2024/2025).",
  openGraph: {
    title: "AthleteIQ — Sports Science AI",
    description:
      "Ask anything about training, physiology, and performance. Backed by peer-reviewed research.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  );
}
