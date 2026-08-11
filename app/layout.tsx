import type { Metadata, Viewport } from "next";
import { Space_Grotesk, IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { site, SITE_URL } from "@/data/content";

// Display face for headings + brand.
const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-display",
  display: "swap",
});

// Clean body face.
const body = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

// Monospace for tags, labels, and the terminal log.
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Winayagatar — AI Full-Stack & Automation Developer",
  description: site.metaDescription,
  applicationName: "Winayagatar — Portfolio",
  authors: [{ name: site.fullName }],
  keywords: [
    "Full-Stack Developer",
    "Automation Engineer",
    "AI Developer",
    "Next.js",
    "TypeScript",
    "Python",
    "Malaysia",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Winayagatar",
    title: "Winayagatar — AI Full-Stack & Automation Developer",
    description: site.metaDescription,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Winayagatar — AI Full-Stack & Automation Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Winayagatar — AI Full-Stack & Automation Developer",
    description: site.metaDescription,
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#07090f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
