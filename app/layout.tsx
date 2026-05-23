import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { Suspense, type ReactNode } from "react";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Providers from "@/components/layout/Providers";
import MetaPixel from "@/components/analytics/MetaPixel";
import PageViewTracker from "@/components/analytics/PageViewTracker";
import { siteConfig } from "@/lib/site";

const inter = Inter({ subsets: ["latin"], variable: "--font-body" });
const poppins = Poppins({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-display" });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.knltc.com"),
  title: {
    default: "KNLTC | Bangladesh to Japan Guidance",
    template: "%s | KNLTC",
  },
  description: siteConfig.description,
  verification: {
    other: {
      "facebook-domain-verification": "n6w8uw179i0d0yw42u7z64xonnbmzv",
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="bn" className={`${inter.variable} ${poppins.variable}`}>
      <body>
        <MetaPixel />
        <Providers>
          <Suspense fallback={null}>
            <PageViewTracker />
          </Suspense>
          <div className="min-h-screen bg-background">
            <Header />
            <main>{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
