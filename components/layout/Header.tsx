"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { Menu, MessageCircle, Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import BrandLogo from "@/components/layout/BrandLogo";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { languageOptions, translate } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { language, setLanguage } = useLanguage();

  const t = useMemo(
    () =>
      translate(
        {
          en: {
            nav: ["Home", "About", "Services", "Study in Japan", "Work in Japan", "Japanese Language", "Contact"],
            applyNow: "Apply Now",
            whatsapp: "WhatsApp",
            toggleMenu: "Toggle menu",
            language: "Language",
          },
          bn: {
            nav: ["হোম", "আমাদের সম্পর্কে", "সার্ভিস", "জাপানে পড়াশোনা", "জাপানে কাজ", "জাপানি ভাষা", "যোগাযোগ"],
            applyNow: "এখনই আবেদন করুন",
            whatsapp: "হোয়াটসঅ্যাপ",
            toggleMenu: "মেনু টগল করুন",
            language: "ভাষা",
          },
          ja: {
            nav: ["ホーム", "会社概要", "サービス", "日本留学", "日本就職", "日本語", "お問い合わせ"],
            applyNow: "今すぐ応募",
            whatsapp: "WhatsApp",
            toggleMenu: "メニュー切替",
            language: "言語",
          },
        },
        language,
      ),
    [language],
  );

  const navLinks = [
    { label: t.nav[0], href: "/" },
    { label: t.nav[1], href: "/about" },
    { label: t.nav[2], href: "/services" },
    { label: t.nav[3], href: "/study-in-japan" },
    { label: t.nav[4], href: "/work-in-japan" },
    { label: t.nav[5], href: "/japanese-language" },
    { label: t.nav[6], href: "/contact" },
  ];

  return (
    <>
      <div className="bg-foreground py-2 text-sm text-white">
        <div className="container-narrow flex items-center justify-between gap-3">
          <a href={siteConfig.phoneHref} className="flex items-center gap-1.5 font-medium hover:text-primary">
            <Phone className="h-3.5 w-3.5" />
            <span>{siteConfig.phoneDisplay}</span>
          </a>
          <a href={siteConfig.whatsappHref} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 font-medium text-primary-foreground hover:text-primary">
            <MessageCircle className="h-3.5 w-3.5 text-primary" />
            <span>{t.whatsapp}: {siteConfig.whatsappDisplay}</span>
          </a>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b bg-background">
        <div className="container-narrow flex h-20 items-center justify-between">
          <BrandLogo />

          <nav className="hidden items-center gap-6 lg:flex">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={`text-sm font-medium transition-colors ${pathname === link.href ? "text-accent" : "text-foreground/80 hover:text-accent"}`}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <label className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
              {t.language}
              <select
                className="rounded border bg-background px-2 py-1 text-xs"
                value={language}
                onChange={(event) => setLanguage(event.target.value as "en" | "bn" | "ja")}
              >
                {languageOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
            <Button asChild size="sm" className="hidden bg-primary font-semibold text-primary-foreground hover:bg-primary/90 sm:inline-flex">
              <Link href="/contact">{t.applyNow}</Link>
            </Button>
            <button className="p-2 lg:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label={t.toggleMenu}>
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="space-y-3 border-t bg-background px-4 py-4 lg:hidden">
            <div>
              <label className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                {t.language}
                <select
                  className="rounded border bg-background px-2 py-1 text-xs"
                  value={language}
                  onChange={(event) => setLanguage(event.target.value as "en" | "bn" | "ja")}
                >
                  {languageOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>
            </div>
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="block text-sm font-medium text-foreground/80 hover:text-accent" onClick={() => setMobileOpen(false)}>
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </header>
    </>
  );
}
