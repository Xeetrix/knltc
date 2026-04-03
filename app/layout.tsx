import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Providers from "@/components/layout/Providers";
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
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body>
        <Providers>
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
