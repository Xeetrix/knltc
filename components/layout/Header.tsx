"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { BookOpen, BriefcaseBusiness, Grid2x2, Home, Languages, Mail, Menu, MessageCircle, Phone, ShoppingBag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import BrandLogo from "@/components/layout/BrandLogo";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { defaultLanguage, languageOptions, translate } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";
import StoreNavbar from "@/components/store/StoreNavbar";

function StoreHeader() { return <StoreNavbar />; }

function MainHeader({ pathname }: { pathname: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuPanelRef = useRef<HTMLDivElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const { language, setLanguage } = useLanguage();

  const t = useMemo(() => translate({
    bn: { nav: ["হোম", "জাপান ক্যারিয়ার", "স্টাডি অ্যাব্রড", "জাপানি ভাষা", "স্টোর", "ব্লগ", "যোগাযোগ"], cta: "ফ্রি কনসালটেশন", whatsapp: "হোয়াটসঅ্যাপ", toggleMenu: "মেনু", language: "ভাষা" },
    en: { nav: ["Home", "Japan Career", "Study Abroad", "Japanese Language", "Store", "Blog", "Contact"], cta: "Free Consultation", whatsapp: "WhatsApp", toggleMenu: "Menu", language: "Language" },
    ja: { nav: ["ホーム", "日本キャリア", "留学", "日本語", "ストア", "ブログ", "お問い合わせ"], cta: "無料相談", whatsapp: "WhatsApp", toggleMenu: "メニュー", language: "言語" },
    zh: { nav: ["首页", "日本职业", "海外留学", "日语", "商店", "博客", "联系"], cta: "免费咨询", whatsapp: "WhatsApp", toggleMenu: "菜单", language: "语言" },
    ru: { nav: ["Главная", "Карьера в Японии", "Учёба за рубежом", "Японский язык", "Магазин", "Блог", "Контакты"], cta: "Бесплатная консультация", whatsapp: "WhatsApp", toggleMenu: "Меню", language: "Язык" },
    ms: { nav: ["Laman Utama", "Kerjaya Jepun", "Belajar di Luar Negara", "Bahasa Jepun", "Kedai", "Blog", "Hubungi"], cta: "Konsultasi Percuma", whatsapp: "WhatsApp", toggleMenu: "Menu", language: "Bahasa" },
  }, language), [language]);

  const navLinks = [
    { label: t.nav[0], href: "/", icon: Home }, { label: t.nav[1], href: "/japan-career", icon: BriefcaseBusiness },
    { label: t.nav[2], href: "/study-abroad", icon: Grid2x2 }, { label: t.nav[3], href: "/japanese-language", icon: Languages },
    { label: t.nav[4], href: "/store", icon: ShoppingBag }, { label: t.nav[5], href: "/blog", icon: BookOpen }, { label: t.nav[6], href: "/contact", icon: Mail },
  ];

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  useEffect(() => setMobileOpen(false), [pathname]);
  useEffect(() => { if (!languageOptions.some((option) => option.value === language)) setLanguage(defaultLanguage); }, [language, setLanguage]);
  useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 8); onScroll(); window.addEventListener('scroll', onScroll); return () => window.removeEventListener('scroll', onScroll); }, []);
  useEffect(() => {
    if (!mobileOpen) return;
    const handleClickOutside = (event: MouseEvent) => { const target = event.target as Node; if (menuPanelRef.current?.contains(target) || menuButtonRef.current?.contains(target)) return; setMobileOpen(false); };
    const handleEscape = (event: KeyboardEvent) => event.key === "Escape" && setMobileOpen(false);
    document.addEventListener("mousedown", handleClickOutside); document.addEventListener("keydown", handleEscape);
    return () => { document.removeEventListener("mousedown", handleClickOutside); document.removeEventListener("keydown", handleEscape); };
  }, [mobileOpen]);

  return (<>
    <div className="bg-slate-950 py-2 text-xs text-white sm:text-sm"><div className="container-narrow flex flex-wrap items-center justify-between gap-2 text-white/85"><a href={siteConfig.phoneHref} className="inline-flex items-center gap-1.5 hover:text-white"><Phone className="h-3.5 w-3.5" />{siteConfig.phoneDisplay}</a><a href={siteConfig.whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-emerald-300 hover:text-emerald-200"><MessageCircle className="h-3.5 w-3.5" />{t.whatsapp}: {siteConfig.whatsappDisplay}</a></div></div>
    <header className={`sticky top-0 z-50 transition-all ${scrolled ? "border-b border-slate-200/70 bg-white/80 shadow-md backdrop-blur-xl" : "bg-white"}`}>
      <div className="container-narrow flex min-h-[84px] items-center justify-between gap-4 py-3">
        <BrandLogo className="max-w-full" />
        <nav className="hidden flex-1 items-center justify-center gap-1 xl:flex">{navLinks.map((link) => { const Icon = link.icon; return <Link key={link.href} href={link.href} className={`group relative flex h-11 items-center gap-2 rounded-full px-4 text-sm font-medium transition ${isActive(link.href) ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"}`}><Icon className="h-4 w-4" />{link.label}</Link>; })}</nav>
        <div className="hidden items-center gap-2 xl:flex"><select className="rounded-full border border-slate-300 bg-white px-3 py-2 text-xs" value={language} onChange={(e) => setLanguage(e.target.value as typeof language)}>{languageOptions.map((option) => <option key={option.value} value={option.value}>{`${option.short} · ${option.label}`}</option>)}</select><Button asChild className="h-11 rounded-full bg-emerald-600 px-5 text-white hover:bg-emerald-700"><Link href="/contact">{t.cta}</Link></Button></div>
        <button ref={menuButtonRef} className="rounded-full border border-slate-300 p-2 xl:hidden" onClick={() => setMobileOpen((prev) => !prev)} aria-label={t.toggleMenu}>{mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
      </div>
      {mobileOpen && <div className="border-t border-slate-200 bg-white/95 p-3 backdrop-blur xl:hidden"><nav ref={menuPanelRef} className="space-y-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl"><select className="mb-2 w-full rounded-lg border p-2 text-sm" value={language} onChange={(e) => setLanguage(e.target.value as typeof language)}>{languageOptions.map((option) => <option key={option.value} value={option.value}>{`${option.short} · ${option.label}`}</option>)}</select>{navLinks.map((link) => { const Icon = link.icon; return <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${isActive(link.href) ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"}`}><Icon className="h-4 w-4" />{link.label}</Link>; })}<Button asChild className="mt-2 w-full rounded-full bg-emerald-600 hover:bg-emerald-700"><Link href="/contact">{t.cta}</Link></Button></nav></div>}
    </header>
  </>);
}

export default function Header() {
  const pathname = usePathname();
  const isStoreRoute = ["/store", "/cart", "/wishlist", "/checkout"].some((route) => pathname.startsWith(route));
  return isStoreRoute ? <StoreHeader /> : <MainHeader pathname={pathname} />;
}
