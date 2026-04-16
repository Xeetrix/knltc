"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Menu, MessageCircle, Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import BrandLogo from "@/components/layout/BrandLogo";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { defaultLanguage, languageOptions, translate } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuPanelRef = useRef<HTMLDivElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
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

  useEffect(() => {
    if (languageOptions.some((option) => option.value === language)) return;
    setLanguage(defaultLanguage);
  }, [language, setLanguage]);

  const handleLanguageChange = (nextValue: string) => {
    const matchedLanguage = languageOptions.find((option) => option.value === nextValue)?.value;
    setLanguage(matchedLanguage ?? defaultLanguage);
  };

  useEffect(() => {
    if (!mobileOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (menuPanelRef.current?.contains(target) || menuButtonRef.current?.contains(target)) return;
      setMobileOpen(false);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [mobileOpen]);

  return (
    <>
      <div className="bg-foreground py-2 text-xs text-white sm:text-sm">
        <div className="container-narrow flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
          <a href={siteConfig.phoneHref} className="flex flex-wrap items-center gap-1.5 font-medium hover:text-primary">
            <Phone className="h-3.5 w-3.5" />
            <span>{siteConfig.phoneDisplay}</span>
          </a>
          <a
            href={siteConfig.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-wrap items-center gap-1.5 font-medium text-primary-foreground hover:text-primary"
          >
            <MessageCircle className="h-3.5 w-3.5 text-primary" />
            <span>
              {t.whatsapp}: {siteConfig.whatsappDisplay}
            </span>
          </a>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container-narrow flex min-h-[76px] items-center justify-between gap-3 py-2.5 sm:min-h-[84px] sm:py-3 sm:gap-4 lg:gap-6">
          <div className="shrink-0">
            <BrandLogo />
          </div>

          <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex xl:gap-1.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`whitespace-nowrap rounded-md px-2.5 py-2 text-[0.82rem] font-medium transition-colors xl:px-3 xl:text-sm ${
                  isActive(link.href) ? "text-accent" : "text-foreground/80 hover:bg-muted hover:text-accent"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden shrink-0 items-center gap-2 xl:gap-3 lg:flex">
            <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              {t.language}
              <select
                className="min-w-28 rounded-md border bg-background px-2.5 py-1.5 text-xs"
                value={language}
                onChange={(event) => handleLanguageChange(event.target.value)}
              >
                {languageOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <Button asChild size="sm" className="bg-primary font-semibold text-primary-foreground hover:bg-primary/90">
              <Link href="/contact">{t.applyNow}</Link>
            </Button>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <button
              ref={menuButtonRef}
              className="rounded-md p-2 hover:bg-muted"
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
          <div className="absolute inset-x-0 top-full z-50 border-t border-border/60 bg-black/20 px-3 py-3 backdrop-blur-[1px] sm:px-4 lg:hidden">
            <nav
              id="mobile-menu"
              ref={menuPanelRef}
              className="ml-auto w-full max-w-sm space-y-3 rounded-xl border bg-background p-4 shadow-lg"
            >
              <div>
                <label className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  {t.language}
                  <select
                    className="w-full min-w-0 rounded-md border bg-background px-2.5 py-1.5 text-xs sm:w-auto sm:min-w-28"
                    value={language}
                    onChange={(event) => handleLanguageChange(event.target.value)}
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
                  className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive(link.href) ? "text-accent" : "text-foreground/80 hover:bg-muted hover:text-accent"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Button asChild size="sm" className="mt-2 w-full bg-primary font-semibold text-primary-foreground hover:bg-primary/90">
                <Link href="/contact" onClick={() => setMobileOpen(false)}>
                  {t.applyNow}
                </Link>
              </Button>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
