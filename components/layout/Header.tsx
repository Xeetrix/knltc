"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { BookOpen, Grid2x2, Home, Info, Mail, Menu, MessageCircle, Phone, ShoppingBag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import BrandLogo from "@/components/layout/BrandLogo";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { defaultLanguage, languageOptions, translate } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";
import StoreNavbar from "@/components/store/StoreNavbar";

function StoreHeader() {
  return <StoreNavbar />;
}

function MainHeader({ pathname }: { pathname: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuPanelRef = useRef<HTMLDivElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const { language, setLanguage } = useLanguage();

  const t = useMemo(
    () =>
      translate(
        {
          en: { nav: ["Home", "About", "Services", "Blog", "Store", "Contact"], cta: "Start Your Journey", whatsapp: "WhatsApp", toggleMenu: "Toggle menu", language: "Language" },
          bn: { nav: ["হোম", "আমাদের সম্পর্কে", "সার্ভিস", "ব্লগ", "স্টোর", "যোগাযোগ"], cta: "আপনার যাত্রা শুরু করুন", whatsapp: "হোয়াটসঅ্যাপ", toggleMenu: "মেনু টগল করুন", language: "ভাষা" },
          ja: { nav: ["ホーム", "会社概要", "サービス", "ブログ", "ストア", "お問い合わせ"], cta: "新しい一歩を始める", whatsapp: "WhatsApp", toggleMenu: "メニュー切替", language: "言語" },
        },
        language,
      ),
    [language],
  );

  const navLinks = [
    { label: t.nav[0], href: "/", icon: Home },
    { label: t.nav[1], href: "/about", icon: Info },
    { label: t.nav[2], href: "/services", icon: Grid2x2 },
    { label: t.nav[3], href: "/blog", icon: BookOpen },
    { label: t.nav[4], href: "/store", icon: ShoppingBag },
    { label: t.nav[5], href: "/contact", icon: Mail },
  ];

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  useEffect(() => setMobileOpen(false), [pathname]);
  useEffect(() => {
    if (languageOptions.some((option) => option.value === language)) return;
    setLanguage(defaultLanguage);
  }, [language, setLanguage]);

  useEffect(() => {
    if (!mobileOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (menuPanelRef.current?.contains(target) || menuButtonRef.current?.contains(target)) return;
      setMobileOpen(false);
    };
    const handleEscape = (event: KeyboardEvent) => event.key === "Escape" && setMobileOpen(false);
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
          <a href={siteConfig.phoneHref} className="flex max-w-full flex-wrap items-center gap-1.5 font-medium hover:text-primary">
            <Phone className="h-3.5 w-3.5" />
            <span className="break-all">{siteConfig.phoneDisplay}</span>
          </a>
          <a href={siteConfig.whatsappHref} target="_blank" rel="noopener noreferrer" className="flex max-w-full flex-wrap items-center gap-1.5 font-medium text-primary-foreground hover:text-primary">
            <MessageCircle className="h-3.5 w-3.5 text-primary" />
            <span>{t.whatsapp}: <span className="break-all">{siteConfig.whatsappDisplay}</span></span>
          </a>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
        <div className="container-narrow flex min-h-[76px] items-center justify-between gap-3 py-2.5 sm:min-h-[84px] sm:py-3 sm:gap-4 xl:gap-6">
          <div className="min-w-0 flex-1 xl:flex-none"><BrandLogo className="max-w-full" /></div>

          <nav className="hidden flex-1 items-center justify-center gap-1 xl:flex">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link key={link.href} href={link.href} className={`group relative flex h-10 items-center gap-1.5 rounded-md px-3 text-sm transition-colors ${isActive(link.href) ? "font-semibold text-accent" : "text-foreground/80 hover:text-accent"}`}>
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>
                  <span className={`absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full transition-all ${isActive(link.href) ? "bg-accent" : "bg-accent/70 opacity-0 group-hover:opacity-100"}`} />
                </Link>
              );
            })}
          </nav>

          <div className="hidden shrink-0 items-center gap-2 xl:flex">
            <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">{t.language}
              <select className="min-w-28 rounded-md border bg-background px-2.5 py-1.5 text-xs" value={language} onChange={(e) => setLanguage(e.target.value as typeof language)}>
                {languageOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </label>
            <Button asChild size="sm" className="h-10 rounded-full bg-emerald-600 px-4 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700">
              <Link href="/contact">{t.cta}</Link>
            </Button>
          </div>

          <div className="flex shrink-0 items-center gap-2 xl:hidden">
            <button ref={menuButtonRef} className="rounded-md p-2 hover:bg-muted" onClick={() => setMobileOpen((prev) => !prev)} aria-label={t.toggleMenu} aria-expanded={mobileOpen} aria-controls="mobile-menu">
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="absolute inset-x-0 top-full z-50 border-t border-border/60 bg-black/20 px-3 py-3 backdrop-blur-[1px] sm:px-4 xl:hidden">
            <nav id="mobile-menu" ref={menuPanelRef} className="ml-auto w-full max-w-sm space-y-3 rounded-xl border bg-background p-4 shadow-lg">
              <label className="mb-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">{t.language}
                <select className="w-full min-w-0 rounded-md border bg-background px-2.5 py-1.5 text-xs sm:w-auto sm:min-w-28" value={language} onChange={(e) => setLanguage(e.target.value as typeof language)}>
                  {languageOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </label>
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link key={link.href} href={link.href} className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm ${isActive(link.href) ? "font-semibold text-accent" : "text-foreground/80 hover:bg-muted hover:text-accent"}`} onClick={() => setMobileOpen(false)}>
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                );
              })}
              <Button asChild size="sm" className="mt-2 w-full rounded-full bg-emerald-600 font-semibold text-white hover:bg-emerald-700">
                <Link href="/contact" onClick={() => setMobileOpen(false)}>{t.cta}</Link>
              </Button>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}

export default function Header() {
  const pathname = usePathname();
  const isStoreRoute = ["/store", "/cart", "/wishlist", "/checkout"].some((route) => pathname.startsWith(route));
  return isStoreRoute ? <StoreHeader /> : <MainHeader pathname={pathname} />;
}
