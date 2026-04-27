"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, ChevronDown, Store, Home } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import BrandLogo from "@/components/layout/BrandLogo";
import CartNavLink from "@/components/store/CartNavLink";
import WishlistNavLink from "@/components/store/WishlistNavLink";

const STORE_ROUTES = ["/store", "/cart", "/wishlist", "/checkout"];
const STORE_CATEGORIES = [
  { name: "Books", href: "/store?category=Books" },
  { name: "JLPT", href: "/store?category=JLPT" },
  { name: "Stationery", href: "/store?category=Stationery" },
];

export default function StoreNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState("");

  const isStoreRoute = useMemo(() => STORE_ROUTES.some((route) => pathname.startsWith(route)), [pathname]);

  const onSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("search", query.trim());
    router.push(`/store${params.toString() ? `?${params.toString()}` : ""}`);
  };

  if (!isStoreRoute) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/95 backdrop-blur supports-[backdrop-filter]:bg-slate-950/75">
      <div className="container-narrow flex min-h-[80px] items-center gap-3 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <BrandLogo className="max-w-[140px] invert sm:max-w-[170px]" />
          <div className="hidden items-center gap-1 lg:flex">
            <Link href="/" className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm text-slate-200 transition hover:bg-white/10">
              <Home className="h-4 w-4" />
              Home
            </Link>
            <Link
              href="/store"
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              <Store className="h-4 w-4" />
              Store
            </Link>
            <div className="group relative">
              <button className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm text-slate-200 transition hover:bg-white/10" type="button">
                Categories
                <ChevronDown className="h-4 w-4" />
              </button>
              <div className="invisible absolute left-0 top-full mt-2 w-44 rounded-xl border border-white/15 bg-slate-900 p-2 opacity-0 shadow-2xl transition group-hover:visible group-hover:opacity-100">
                {STORE_CATEGORIES.map((category) => (
                  <Link key={category.name} href={category.href} className="block rounded-lg px-3 py-2 text-sm text-slate-100 hover:bg-white/10">
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={onSearch} className="mx-auto hidden w-full max-w-xl items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2 md:flex">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products..."
            className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-400"
          />
        </form>

        <div className="ml-auto flex items-center gap-2">
          <WishlistNavLink />
          <CartNavLink />
        </div>
      </div>

      <div className="container-narrow pb-3 md:hidden">
        <form onSubmit={onSearch} className="flex w-full items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products..."
            className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-400"
          />
        </form>
      </div>
    </header>
  );
}
