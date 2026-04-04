"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
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

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <div className="bg-foreground py-2 text-xs text-white sm:text-sm">
        <div className="container-narrow flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
          <a href={siteConfig.phoneHref} className="flex items-center gap-1.5 font-medium hover:text-primary break-all sm:break-normal">
            <Phone className="h-3.5 w-3.5" />
            <span>{siteConfig.phoneDisplay}</span>
          </a>
          <a
            href={siteConfig.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-medium text-primary-foreground hover:text-primary break-all sm:break-normal"
          >
            <MessageCircle className="h-3.5 w-3.5 text-primary" />
            <span>
              {t.whatsapp}: {siteConfig.whatsappDisplay}
            </span>
          </a>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b bg-background">
        <div className="container-narrow flex min-h-20 items-center gap-3 py-2 sm:gap-4">
          <div className="shrink-0">
            <BrandLogo />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Button asChild size="sm" className="bg-primary font-semibold text-primary-foreground hover:bg-primary/90">
              <Link href="/contact">{t.applyNow}</Link>
            </Button>
            <button
              className="p-2"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label={t.toggleMenu}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav id="mobile-menu" className="space-y-3 border-t bg-background px-4 py-4">
            <div>
              <label className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                {t.language}
                <select
                  className="rounded border bg-background px-2 py-1 text-xs"
                  value={language}
                  onChange={(event) => setLanguage(event.target.value as "en" | "bn" | "ja")}
                >
                  {languageOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block rounded-md px-2 py-1 text-sm font-medium transition-colors ${
                  isActive(link.href) ? "text-accent" : "text-foreground/80 hover:bg-muted hover:text-accent"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </header>
    </>
  );
}
