import type { Metadata, Viewport } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/AppShell";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const serifDisplay = Lora({
  variable: "--font-serif-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SunoVyapar — Shree Ram Distributors",
  description:
    "Live AI-qualified leads for FMCG distributors. WhatsApp pe karo, dhanda badhao.",
};

export const viewport: Viewport = {
  themeColor: "#fbf9f4",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${serifDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-cream text-ink">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
