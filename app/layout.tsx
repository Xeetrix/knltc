import type { Metadata } from "next";
import { Inter, Noto_Sans_JP, Tiro_Bangla } from "next/font/google";
import { Suspense, type ReactNode } from "react";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Providers from "@/components/layout/Providers";
import MetaPixel from "@/components/analytics/MetaPixel";
import PageViewTracker from "@/components/analytics/PageViewTracker";
import { siteConfig } from "@/lib/site";

// Tiro Bangla is a strict, single-weight (400) serif — Google Fonts does not
// publish 500/600/700 cuts for it, unlike the Hind Siliguri it replaces.
// Bold/black headings will render as browser-synthesized (faux) bold.
const tiroBangla = Tiro_Bangla({
  subsets: ["bengali", "latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-bangla",
});
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
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    description: siteConfig.description,
    email: siteConfig.email,
    telephone: siteConfig.phoneDisplay,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.streetAddress,
      addressLocality: siteConfig.address.addressLocality,
      postalCode: siteConfig.address.postalCode,
      addressCountry: siteConfig.address.addressCountry,
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteConfig.phoneDisplay,
      email: siteConfig.email,
      contactType: "customer service",
      areaServed: "BD",
      availableLanguage: ["Bangla", "English", "Japanese"],
    },
  };

  return (
    <html lang="en" className={`${tiroBangla.variable} ${inter.variable} ${notoSansJp.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
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
