"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, ChevronDown, Store, Home, Grid3X3, Menu, X } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import BrandLogo from "@/components/layout/BrandLogo";
import CartNavLink from "@/components/store/CartNavLink";
import WishlistNavLink from "@/components/store/WishlistNavLink";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { languageOptions, translate } from "@/lib/i18n";

const STORE_ROUTES = ["/store", "/cart", "/wishlist", "/checkout"];
const STORE_CATEGORIES = [
  { name: "Books", label: { en: "Books", bn: "বই", ja: "書籍" }, href: "/store?category=Books" },
  { name: "JLPT", label: { en: "JLPT", bn: "JLPT", ja: "JLPT" }, href: "/store?category=JLPT" },
  { name: "Stationery", label: { en: "Stationery", bn: "স্টেশনারি", ja: "文房具" }, href: "/store?category=Stationery" },
  { name: "Accessories", label: { en: "Accessories", bn: "অ্যাকসেসরিজ", ja: "アクセサリー" }, href: "/store?category=Accessories" },
];

export default function StoreNavbar() {
  const { language, setLanguage } = useLanguage();
  const t = translate({
    en: { home: "Home", store: "Store", categories: "Categories", category: "Category", search: "Search books, JLPT prep, stationery...", toggle: "Toggle store menu", language: "Language" },
    bn: { home: "হোম", store: "স্টোর", categories: "ক্যাটাগরি", category: "ক্যাটাগরি", search: "বই, JLPT প্রস্তুতি, স্টেশনারি খুঁজুন...", toggle: "স্টোর মেনু খুলুন/বন্ধ করুন", language: "ভাষা" },
    ja: { home: "ホーム", store: "ストア", categories: "カテゴリー", category: "カテゴリー", search: "書籍、JLPT教材、文房具を検索...", toggle: "ストアメニューを切り替え", language: "言語" },
  }, language);
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const isStoreRoute = useMemo(() => STORE_ROUTES.some((route) => pathname.startsWith(route)), [pathname]);

  const onSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("search", query.trim());
    router.push(`/store${params.toString() ? `?${params.toString()}` : ""}`);
  };

  if (!isStoreRoute) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-stone-50/95 backdrop-blur-xl supports-[backdrop-filter]:bg-stone-50/85">
      <div className="container-narrow flex min-h-[64px] items-center gap-2 py-2">
        <div className="flex min-w-0 shrink-0 items-center gap-2 lg:gap-3">
          <BrandLogo compact className="max-w-[118px] sm:max-w-none" />
          <nav className="hidden items-center gap-0.5 lg:flex">
            <Link href="/" className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm text-slate-700 transition hover:bg-white">
              <Home className="h-4 w-4" />
              {t.home}
            </Link>
            <Link
              href="/store"
              className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-500/10 px-3 py-2 text-sm font-semibold text-emerald-700"
            >
              <Store className="h-4 w-4" />
              {t.store}
            </Link>
            <div className="group relative">
              <button className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm text-slate-700 transition hover:bg-white" type="button">
                <Grid3X3 className="h-4 w-4" />
                {t.categories}
                <ChevronDown className="h-4 w-4" />
              </button>
              <div className="invisible absolute left-0 top-full mt-2 w-52 rounded-2xl border border-stone-200 bg-white p-2 opacity-0 shadow-xl shadow-stone-200/80 transition group-hover:visible group-hover:opacity-100">
                {STORE_CATEGORIES.map((category) => (
                  <Link key={category.name} href={category.href} className="block rounded-xl px-3 py-2 text-sm text-slate-700 transition hover:bg-stone-100">
                    {translate(category.label, language)}
                  </Link>
                ))}
              </div>
            </div>
          </nav>
        </div>

        <form onSubmit={onSearch} className="hidden min-w-0 flex-1 items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 py-2 md:flex lg:max-w-none">
          <Search className="h-4 w-4 text-slate-500" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t.search}
            className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
          />
        </form>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <label className="hidden items-center gap-2 text-xs font-medium text-slate-600 lg:flex">
            {t.language}
            <select
              className="rounded-full border border-stone-300 bg-white px-2.5 py-2 text-xs text-slate-800"
              value={language}
              onChange={(event) => setLanguage(event.target.value as typeof language)}
            >
              {languageOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-300 bg-white text-slate-700 transition hover:bg-stone-100 lg:hidden"
            aria-label={t.toggle}
            onClick={() => setMobileOpen((prev) => !prev)}
            type="button"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
          <WishlistNavLink showLabel className="hidden lg:inline-flex" />
          <CartNavLink showLabel className="hidden lg:inline-flex" />
          <WishlistNavLink className="lg:hidden" />
          <CartNavLink className="lg:hidden" />
        </div>
      </div>

      <div className="container-narrow pb-2 md:hidden">
        <form onSubmit={onSearch} className="flex min-w-0 items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 py-2">
          <Search className="h-4 w-4 text-slate-500" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t.search}
            className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
          />
        </form>
      </div>

      {mobileOpen ? (
        <div className="border-t border-stone-200 bg-stone-50 px-4 py-3 lg:hidden">
          <div className="container-narrow space-y-2">
            <label className="block rounded-lg border border-stone-200 bg-white p-2 text-xs font-medium text-slate-600">
              {t.language}
              <select
                className="mt-1 w-full rounded-md border border-stone-300 bg-white px-2.5 py-2 text-xs text-slate-800"
                value={language}
                onChange={(event) => setLanguage(event.target.value as typeof language)}
              >
                {languageOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <Link href="/" className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-white" onClick={() => setMobileOpen(false)}>
              {t.home}
            </Link>
            <Link href="/store" className="block rounded-lg px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-white" onClick={() => setMobileOpen(false)}>
              {t.store}
            </Link>
            <div className="rounded-lg border border-stone-200 bg-white p-2">
              <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500">{t.category}</p>
              {STORE_CATEGORIES.map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  className="block rounded-md px-2 py-2 text-sm text-slate-700 hover:bg-stone-100"
                  onClick={() => setMobileOpen(false)}
                >
                  {translate(category.label, language)}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
