"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
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
  PhoneCall,
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
  const [scrolled, setScrolled] = useState(false);
  const menuPanelRef = useRef<HTMLDivElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    { label: t.nav[6], href: "/contact", icon: PhoneCall },
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
      <div className="bg-[#b91c1c] text-white text-[11px] sm:text-xs font-medium py-1.5 border-b border-red-800/40 relative z-40">
        <div className="container-narrow flex items-center justify-between gap-3">
          {/* Left contact info */}
          <div className="flex items-center gap-4">
            <a
              href={siteConfig.phoneHref}
              className="flex items-center gap-1.5 opacity-90 hover:opacity-100 transition-opacity"
            >
              <Phone className="h-3 w-3 text-red-200" />
              <span>{siteConfig.phoneDisplay}</span>
            </a>

            <span className="text-white/40 hidden sm:inline">|</span>

            <a
              href={siteConfig.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 opacity-90 hover:opacity-100 transition-opacity"
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
            <div className="flex items-center gap-1.5 bg-black/20 rounded-lg px-2 py-0.5 hover:bg-black/30 transition-colors">
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

      {/* Main Navbar with Scroll Dynamics */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-stone-200/90 bg-white/95 backdrop-blur-md shadow-xs py-1"
            : "border-b border-stone-200/60 bg-white/98 backdrop-blur-sm py-2"
        }`}
      >
        <div className="container-narrow flex h-14 md:h-15 items-center justify-between gap-3">
          {/* Brand Logo */}
          <div className="min-w-0 shrink-0">
            <BrandLogo />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center justify-center gap-1 xl:gap-2 flex-1 px-2">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group relative inline-flex items-center gap-1.5 px-2 xl:px-2.5 py-1.5 text-[11px] xl:text-[12px] 2xl:text-[12.5px] font-medium tracking-tight transition-all duration-200 rounded-lg ${
                    active
                      ? "text-[#b91c1c] font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-stone-100/70"
                  }`}
                >
                  <Icon
                    className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                      active ? "text-[#b91c1c]" : "text-slate-400 group-hover:text-slate-700"
                    }`}
                  />
                  <span className="relative z-10 whitespace-nowrap">{link.label}</span>
                  {active && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 rounded-lg bg-red-50/90 -z-0 border border-red-200/60 shadow-2xs"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Cluster */}
          <div className="hidden lg:flex shrink-0 items-center gap-2">
            {/* High-Visibility Student LMS Login with Live Pulse */}
            <motion.a
              href="https://npw.bd/knltc"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="inline-flex h-8 xl:h-8.5 items-center gap-1.5 rounded-lg border border-red-300 bg-red-50/80 hover:bg-red-100 px-2.5 xl:px-3 text-[11px] xl:text-[11.5px] font-semibold text-[#b91c1c] shadow-2xs transition-colors"
              title="Enter Official KNLTC Student LMS Classroom"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#b91c1c]"></span>
              </span>
              <GraduationCap className="h-3.5 w-3.5 text-[#b91c1c]" />
              <span>{t.lmsLogin}</span>
              <ExternalLink className="h-2.5 w-2.5 opacity-75" />
            </motion.a>

            {/* Free Consultation CTA */}
            <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.15 }}>
              <Button
                asChild
                size="sm"
                className="h-8 xl:h-8.5 rounded-lg bg-[#15803d] hover:bg-emerald-700 text-white text-[11px] xl:text-[11.5px] font-semibold px-3 shadow-2xs transition-colors"
              >
                <Link href="/contact">{t.cta}</Link>
              </Button>
            </motion.div>
          </div>

          {/* Tablet & Mobile Right Bar (< 1024px) */}
          <div className="flex shrink-0 items-center gap-2 lg:hidden">
            {/* Direct LMS Access Badge on Mobile */}
            <a
              href="https://npw.bd/knltc"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-[11px] font-bold text-[#b91c1c] shadow-2xs active:scale-95 transition-transform"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#b91c1c] animate-pulse" />
              <GraduationCap className="h-3.5 w-3.5" />
              <span>LMS</span>
              <ExternalLink className="h-3 w-3" />
            </a>

            {/* Mobile Menu Hamburger */}
            <button
              ref={menuButtonRef}
              className="rounded-lg p-2 text-slate-700 hover:bg-stone-100 hover:text-slate-900 transition focus:outline-none active:scale-90"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label={t.toggleMenu}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile & Tablet Full-Width Animated Drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] as const }}
              className="overflow-hidden border-t border-stone-200 bg-white/98 backdrop-blur-md shadow-xl lg:hidden"
            >
              <nav ref={menuPanelRef} className="container-narrow py-4 space-y-3">
                {/* Navigation Links with Staggered Entrance */}
                <div className="space-y-1">
                  {navLinks.map((link, idx) => {
                    const active = isActive(link.href);
                    const Icon = link.icon;
                    return (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.03, duration: 0.18 }}
                      >
                        <Link
                          href={link.href}
                          className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-all ${
                            active
                              ? "bg-red-50 text-[#b91c1c] font-semibold"
                              : "text-slate-700 hover:bg-stone-100 hover:translate-x-0.5"
                          }`}
                          onClick={() => setMobileOpen(false)}
                        >
                          <Icon className={`h-4 w-4 shrink-0 ${active ? "text-[#b91c1c]" : "text-slate-400"}`} />
                          <span>{link.label}</span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                {/* High-Visibility LMS Banner in Drawer */}
                <div className="pt-2 border-t border-stone-100 space-y-2">
                  <a
                    href="https://npw.bd/knltc"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-xs font-bold text-[#b91c1c] shadow-2xs hover:bg-red-100 active:scale-[0.99] transition"
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
                    className="w-full rounded-xl bg-[#15803d] hover:bg-emerald-700 text-white font-semibold text-xs py-3 active:scale-[0.99]"
                  >
                    <Link href="/contact" onClick={() => setMobileOpen(false)}>
                      {t.cta}
                    </Link>
                  </Button>
                </div>

                {/* Quick Contacts */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-slate-500">
                  <a href={siteConfig.phoneHref} className="flex items-center gap-1 hover:text-slate-900 transition-colors">
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
            </motion.div>
          )}
        </AnimatePresence>
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
