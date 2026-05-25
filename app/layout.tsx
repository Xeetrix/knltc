import type { Metadata } from "next";
import { Hind_Siliguri, Inter, Noto_Sans_JP } from "next/font/google";
import { Suspense, type ReactNode } from "react";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Providers from "@/components/layout/Providers";
import MetaPixel from "@/components/analytics/MetaPixel";
import PageViewTracker from "@/components/analytics/PageViewTracker";
import { siteConfig } from "@/lib/site";

const hindSiliguri = Hind_Siliguri({ subsets: ["bengali", "latin"], weight: ["400", "500", "600", "700"], variable: "--font-bangla" });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-body" });
const notoSansJp = Noto_Sans_JP({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-japanese" });

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
    <html lang="en" className={`${hindSiliguri.variable} ${inter.variable} ${notoSansJp.variable}`}>
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
