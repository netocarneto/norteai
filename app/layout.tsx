import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NorteAI Pessoal",
  description: "O teu copiloto financeiro inteligente.",
  applicationName: "NorteAI Pessoal",
  metadataBase: new URL("https://norteai.carlosanetopt.workers.dev"),
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "NorteAI Pessoal",
    description: "O teu copiloto financeiro inteligente.",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "NorteAI Pessoal dashboard preview" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NorteAI Pessoal",
    description: "O teu copiloto financeiro inteligente.",
    images: ["/og.png"],
  },
  appleWebApp: {
    capable: true,
    title: "NorteAI",
    statusBarStyle: "default",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/apple-touch-icon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#6d28d9",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-PT" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  );
}
