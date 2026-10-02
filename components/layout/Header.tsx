"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  BookOpen,
  BriefcaseBusiness,
  ExternalLink,
  Globe,
  GraduationCap,
  Home,
  Languages,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  ShoppingBag,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import BrandLogo from "@/components/layout/BrandLogo";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { defaultLanguage, languageOptions, translate, type Language } from "@/lib/i18n";
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
          en: {
            nav: [
              "Home",
              "Study in Japan",
              "Work in Japan",
              "Japanese Language",
              "Store",
              "Blog",
              "Contact",
            ],
            cta: "Free Consultation",
            whatsapp: "WhatsApp",
            toggleMenu: "Toggle menu",
            language: "Language",
            lmsLogin: "Student LMS Login",
            address: "Naya Paltan, Dhaka",
            directLmsTitle: "Official Student LMS Portal",
          },
          bn: {
            nav: [
              "হোম",
              "জাপানে পড়াশোনা",
              "জাপানে কাজ",
              "জাপানি ভাষা",
              "স্টোর",
              "ব্লগ",
              "যোগাযোগ",
            ],
            cta: "ফ্রি কাউন্সেলিং",
            whatsapp: "হোয়াটসঅ্যাপ",
            toggleMenu: "মেনু খুলুন",
            language: "ভাষা",
            lmsLogin: "শিক্ষার্থী LMS লগইন",
            address: "নয়া পল্টন, ঢাকা",
            directLmsTitle: "অফিশিয়াল শিক্ষার্থী LMS পোর্টাল",
          },
          ja: {
            nav: [
              "ホーム",
              "日本留学",
              "日本就職",
              "日本語",
              "ストア",
              "ブログ",
              "お問い合わせ",
            ],
            cta: "無料相談",
            whatsapp: "WhatsApp",
            toggleMenu: "メニュー切替",
            language: "言語",
            lmsLogin: "受講生 LMSログイン",
            address: "ダッカ・パルタン本部",
            directLmsTitle: "公式受講生LMSポータル",
          },
        },
        language,
      ),
    [language],
  );

  const navLinks = [
    { label: t.nav[0], href: "/", icon: Home },
    { label: t.nav[1], href: "/study-in-japan", icon: GraduationCap },
    { label: t.nav[2], href: "/work-in-japan", icon: BriefcaseBusiness },
    { label: t.nav[3], href: "/japanese-language", icon: Languages },
    { label: t.nav[4], href: "/store", icon: ShoppingBag },
    { label: t.nav[5], href: "/blog", icon: BookOpen },
    { label: t.nav[6], href: "/contact", icon: Mail },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  useEffect(() => setMobileOpen(false), [pathname]);

  useEffect(() => {
    if (!languageOptions.some((option) => option.value === language)) {
      setLanguage(defaultLanguage);
    }
  }, [language, setLanguage]);

  useEffect(() => {
    if (!mobileOpen) return;
    const out = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        !menuPanelRef.current?.contains(target) &&
        !menuButtonRef.current?.contains(target)
      ) {
        setMobileOpen(false);
      }
    };
    const esc = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("mousedown", out);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", out);
      document.removeEventListener("keydown", esc);
    };
  }, [mobileOpen]);

  return (
    <>
      {/* Top Utility Bar - Clean, Slim & Professional */}
      <div className="bg-[#b91c1c] text-white text-[11px] sm:text-xs font-medium py-1.5 border-b border-red-800/40">
        <div className="container-narrow flex items-center justify-between gap-3">
          {/* Left contact info */}
          <div className="flex items-center gap-4">
            <a
              href={siteConfig.phoneHref}
              className="flex items-center gap-1.5 opacity-90 hover:opacity-100 transition"
            >
              <Phone className="h-3 w-3 text-red-200" />
              <span>{siteConfig.phoneDisplay}</span>
            </a>

            <span className="text-white/40 hidden sm:inline">|</span>

            <a
              href={siteConfig.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 opacity-90 hover:opacity-100 transition"
            >
              <MessageCircle className="h-3 w-3 text-emerald-300" />
              <span>WhatsApp: {siteConfig.whatsappDisplay}</span>
            </a>
          </div>

          {/* Right location & quick info */}
          <div className="flex items-center gap-3">
            <span className="hidden md:flex items-center gap-1 opacity-80">
              <MapPin className="h-3 w-3 text-red-200" />
              <span>{t.address}</span>
            </span>

            <span className="text-white/40 hidden md:inline">|</span>

            {/* Top Language Switcher */}
            <div className="flex items-center gap-1.5 bg-black/20 rounded-lg px-2 py-0.5">
              <Globe className="h-3 w-3 text-red-200" />
              <select
                aria-label={t.language}
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-transparent text-white text-[11px] font-semibold focus:outline-none cursor-pointer"
              >
                {languageOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} className="text-slate-900 bg-white">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-white/98 backdrop-blur-md transition-all">
        <div className="container-narrow flex h-17 items-center justify-between gap-3">
          {/* Brand Logo */}
          <div className="min-w-0 shrink-0">
            <BrandLogo />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center justify-center gap-0.5 xl:gap-1.5 flex-1 px-2">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-2.5 xl:px-3 py-1.5 text-xs xl:text-[13.5px] font-semibold transition-colors rounded-lg ${
                    active
                      ? "text-[#b91c1c] bg-red-50/60 font-bold"
                      : "text-slate-700 hover:text-slate-900 hover:bg-stone-50"
                  }`}
                >
                  <span>{link.label}</span>
                  {active && (
                    <span className="absolute inset-x-2.5 -bottom-2.5 h-0.5 bg-[#b91c1c] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Cluster - Streamlined and balanced */}
          <div className="hidden lg:flex shrink-0 items-center gap-2.5">
            {/* High-Visibility Student LMS Login */}
            <a
              href="https://npw.bd/knltc"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-red-300 bg-red-50/70 hover:bg-red-100/80 px-3.5 text-xs font-bold text-[#b91c1c] shadow-2xs transition-all hover:-translate-y-0.5"
              title="Enter Official KNLTC Student LMS Classroom"
            >
              <GraduationCap className="h-3.5 w-3.5 text-[#b91c1c]" />
              <span>{t.lmsLogin}</span>
              <ExternalLink className="h-3 w-3 opacity-75" />
            </a>

            {/* Free Consultation CTA */}
            <Button
              asChild
              size="sm"
              className="h-9 rounded-xl bg-[#15803d] hover:bg-emerald-700 text-white text-xs font-semibold px-4 shadow-2xs transition-all hover:-translate-y-0.5"
            >
              <Link href="/contact">{t.cta}</Link>
            </Button>
          </div>

          {/* Tablet & Mobile Right Bar (< 1024px) */}
          <div className="flex shrink-0 items-center gap-2 lg:hidden">
            {/* Direct LMS Access Badge on Mobile */}
            <a
              href="https://npw.bd/knltc"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-[11px] font-bold text-[#b91c1c] shadow-2xs"
            >
              <GraduationCap className="h-3.5 w-3.5" />
              <span>LMS</span>
              <ExternalLink className="h-3 w-3" />
            </a>

            {/* Mobile Menu Hamburger */}
            <button
              ref={menuButtonRef}
              className="rounded-lg p-2 text-slate-700 hover:bg-stone-100 hover:text-slate-900 transition focus:outline-none"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label={t.toggleMenu}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile & Tablet Full-Width Drawer */}
        {mobileOpen && (
          <div className="absolute inset-x-0 top-full z-50 border-t border-stone-200 bg-white/98 backdrop-blur-md px-4 py-5 shadow-xl lg:hidden animate-in fade-in slide-in-from-top-2 duration-150">
            <nav ref={menuPanelRef} className="space-y-3">
              {/* Language Switcher Bar in Mobile Drawer */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#fcfaf7] border border-stone-200/80">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                  <Globe className="h-3.5 w-3.5 text-[#b91c1c]" />
                  <span>{t.language}:</span>
                </span>
                <div className="flex items-center gap-1">
                  {languageOptions.map((opt) => {
                    const isSelected = language === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setLanguage(opt.value)}
                        className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
                          isSelected
                            ? "bg-[#b91c1c] text-white shadow-2xs"
                            : "text-slate-600 hover:bg-stone-200/60"
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Navigation Links */}
              <div className="space-y-1 pt-1">
                {navLinks.map((link) => {
                  const active = isActive(link.href);
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
                        active
                          ? "bg-red-50 text-[#b91c1c] font-bold"
                          : "text-slate-700 hover:bg-stone-100"
                      }`}
                      onClick={() => setMobileOpen(false)}
                    >
                      <Icon className="h-4 w-4 shrink-0 text-slate-500" />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </div>

              {/* High-Visibility LMS Banner in Drawer */}
              <div className="pt-2 border-t border-stone-100 space-y-2">
                <a
                  href="https://npw.bd/knltc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-xs font-bold text-[#b91c1c] shadow-2xs hover:bg-red-100 transition"
                  onClick={() => setMobileOpen(false)}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-[#b91c1c]">
                      <GraduationCap className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="block text-xs font-extrabold">{t.lmsLogin}</span>
                      <span className="block text-[10px] text-red-600/80 font-mono">https://npw.bd/knltc</span>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 shrink-0 text-[#b91c1c]" />
                </a>

                {/* Free Consultation CTA */}
                <Button
                  asChild
                  size="sm"
                  className="w-full rounded-xl bg-[#15803d] hover:bg-emerald-700 text-white font-semibold text-xs py-3"
                >
                  <Link href="/contact" onClick={() => setMobileOpen(false)}>
                    {t.cta}
                  </Link>
                </Button>
              </div>

              {/* Quick Contacts */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-slate-500">
                <a href={siteConfig.phoneHref} className="flex items-center gap-1 hover:text-slate-900">
                  <Phone className="h-3.5 w-3.5 text-[#b91c1c]" />
                  <span>{siteConfig.phoneDisplay}</span>
                </a>
                <a
                  href={siteConfig.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[#15803d] font-bold hover:underline"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}

export default function Header() {
  const pathname = usePathname();
  const isStoreRoute = [
    "/store",
    "/cart",
    "/wishlist",
    "/checkout",
  ].some((route) => pathname.startsWith(route));

  return isStoreRoute ? <StoreHeader /> : <MainHeader pathname={pathname} />;
}
