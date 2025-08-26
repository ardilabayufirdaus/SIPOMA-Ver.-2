import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/toaster";
import ClientLayout from "@/components/layout/ClientLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SIPOMA - Sistem Informasi Produksi Management",
  description:
    "Aplikasi web enterprise-grade untuk operasi manufaktur semen dengan integrasi AI, real-time analytics, dan UX design terdepan.",
  keywords: "manufaktur, semen, produksi, management, AI, analytics, real-time",
  authors: [{ name: "SIPOMA Team" }],
  creator: "SIPOMA Development Team",
  publisher: "SIPOMA",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://sipoma.app"),
  alternates: {
    canonical: "/",
    languages: {
      "id-ID": "/id",
      "en-US": "/en",
    },
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://sipoma.app",
    title: "SIPOMA - Sistem Informasi Produksi Management",
    description:
      "Aplikasi web enterprise-grade untuk operasi manufaktur semen dengan integrasi AI, real-time analytics, dan UX design terdepan.",
    siteName: "SIPOMA",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SIPOMA - Manufacturing Management System",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SIPOMA - Sistem Informasi Produksi Management",
    description:
      "Aplikasi web enterprise-grade untuk operasi manufaktur semen dengan integrasi AI, real-time analytics, dan UX design terdepan.",
    images: ["/og-image.png"],
    creator: "@sipoma_app",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#dc2626",
      },
    ],
  },
  manifest: "/manifest.json",
  category: "technology",
  classification: "Manufacturing Management System",
  referrer: "origin-when-cross-origin",
  // colorScheme, themeColor, dan viewport dipindahkan ke export viewport di bawah
  // sesuai standar Next.js 14+
};

// Viewport dan themeColor dipindahkan dari metadata ke export viewport
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SIPOMA" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#dc2626" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <ClientLayout>{children}</ClientLayout>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
// ...existing code...
