"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { BookOpen, Home, Languages, Mail, Menu, MessageCircle, Phone, ShoppingBag, BriefcaseBusiness, GraduationCap, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import BrandLogo from "@/components/layout/BrandLogo";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { defaultLanguage, languageOptions, translate } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";
import StoreNavbar from "@/components/store/StoreNavbar";

function StoreHeader() { return <StoreNavbar />; }

function MainHeader({ pathname }: { pathname: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuPanelRef = useRef<HTMLDivElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const { language, setLanguage } = useLanguage();
  const t = useMemo(() => translate({
    en: { nav: ["Home", "Study in Japan", "Work in Japan", "Japanese Language", "Store", "Blog", "Contact"], cta: "Free Consultation", whatsapp: "WhatsApp", toggleMenu: "Toggle menu", language: "Language" },
    bn: { nav: ["হোম", "জাপানে পড়াশোনা", "জাপানে কাজ", "জাপানি ভাষা", "স্টোর", "ব্লগ", "যোগাযোগ"], cta: "ফ্রি কাউন্সেলিং", whatsapp: "হোয়াটসঅ্যাপ", toggleMenu: "মেনু টগল করুন", language: "Language" },
    ja: { nav: ["ホーム", "日本留学", "日本就職", "日本語", "ストア", "ブログ", "お問い合わせ"], cta: "無料相談", whatsapp: "WhatsApp", toggleMenu: "メニュー切替", language: "Language" },
  }, language), [language]);

  const navLinks = [
    { label: t.nav[0], href: "/", icon: Home }, { label: t.nav[1], href: "/study-in-japan", icon: GraduationCap },
    { label: t.nav[2], href: "/work-in-japan", icon: BriefcaseBusiness }, { label: t.nav[3], href: "/japanese-language", icon: Languages },
    { label: t.nav[4], href: "/store", icon: ShoppingBag }, { label: t.nav[5], href: "/blog", icon: BookOpen }, { label: t.nav[6], href: "/contact", icon: Mail },
  ];
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  useEffect(() => setMobileOpen(false), [pathname]);
  useEffect(() => { if (!languageOptions.some((option) => option.value === language)) setLanguage(defaultLanguage); }, [language, setLanguage]);
  useEffect(() => {
    if (!mobileOpen) return;
    const out = (event: MouseEvent) => { const target = event.target as Node; if (!menuPanelRef.current?.contains(target) && !menuButtonRef.current?.contains(target)) setMobileOpen(false); };
    const esc = (event: KeyboardEvent) => event.key === "Escape" && setMobileOpen(false);
    document.addEventListener("mousedown", out); document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", out); document.removeEventListener("keydown", esc); };
  }, [mobileOpen]);

  return (<>
    <div className="bg-red-700 py-2 text-xs text-white sm:text-sm"><div className="container-narrow flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
      <a href={siteConfig.phoneHref} className="flex max-w-full flex-wrap items-center gap-1.5 font-medium hover:text-green-200"><Phone className="h-3.5 w-3.5" /><span className="break-all">{siteConfig.phoneDisplay}</span></a>
      <a href={siteConfig.whatsappHref} target="_blank" rel="noopener noreferrer" className="flex max-w-full flex-wrap items-center gap-1.5 font-medium hover:text-green-200"><MessageCircle className="h-3.5 w-3.5" /><span>{t.whatsapp}: <span className="break-all">{siteConfig.whatsappDisplay}</span></span></a>
    </div></div>
    <header className="sticky top-0 z-50 border-b border-green-100 bg-background/95 backdrop-blur-md">
      <div className="container-narrow flex min-h-[76px] items-center justify-between gap-3 py-2.5"><div className="min-w-0 flex-1 xl:flex-none"><BrandLogo className="max-w-full" /></div>
        <nav className="hidden flex-1 items-center justify-center gap-1 xl:flex">{navLinks.map((link) => { const Icon = link.icon; return <Link key={link.href} href={link.href} className={`group relative flex h-10 items-center gap-1.5 rounded-md px-3 text-sm transition-colors ${isActive(link.href) ? "font-semibold text-red-700" : "text-foreground/80 hover:text-green-700"}`}><Icon className="h-4 w-4" /><span>{link.label}</span></Link>; })}</nav>
        <div className="hidden shrink-0 items-center gap-2 xl:flex"><label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">{t.language}<select className="min-w-28 rounded-md border bg-background px-2.5 py-1.5 text-xs" value={language} onChange={(e) => setLanguage(e.target.value as typeof language)}>{languageOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label><Button asChild size="sm" className="h-10 rounded-full bg-green-600 px-4 text-xs font-semibold text-white hover:bg-green-700"><Link href="/contact">{t.cta}</Link></Button></div>
        <div className="flex shrink-0 items-center gap-2 xl:hidden"><button ref={menuButtonRef} className="rounded-md p-2 hover:bg-muted" onClick={() => setMobileOpen((prev) => !prev)} aria-label={t.toggleMenu}>{mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}</button></div>
      </div>
      {mobileOpen && <div className="absolute inset-x-0 top-full z-50 border-t border-border/60 bg-black/20 px-3 py-3 xl:hidden"><nav id="mobile-menu" ref={menuPanelRef} className="ml-auto w-full max-w-sm space-y-3 rounded-xl border bg-background p-4 shadow-lg"><label className="mb-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">{t.language}<select className="w-full min-w-0 rounded-md border bg-background px-2.5 py-1.5 text-xs" value={language} onChange={(e) => setLanguage(e.target.value as typeof language)}>{languageOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>{navLinks.map((link) => { const Icon = link.icon; return <Link key={link.href} href={link.href} className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm ${isActive(link.href) ? "font-semibold text-red-700" : "text-foreground/80 hover:bg-muted hover:text-green-700"}`} onClick={() => setMobileOpen(false)}><Icon className="h-4 w-4" />{link.label}</Link>; })}<Button asChild size="sm" className="mt-2 w-full rounded-full bg-green-600 font-semibold text-white hover:bg-green-700"><Link href="/contact" onClick={() => setMobileOpen(false)}>{t.cta}</Link></Button></nav></div>}
    </header>
  </>);
}

export default function Header() { const pathname = usePathname(); const isStoreRoute = ["/store", "/cart", "/wishlist", "/checkout"].some((route) => pathname.startsWith(route)); return isStoreRoute ? <StoreHeader /> : <MainHeader pathname={pathname} />; }
