"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, ChevronDown, Store, Home, Grid3X3 } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import BrandLogo from "@/components/layout/BrandLogo";
import CartNavLink from "@/components/store/CartNavLink";
import WishlistNavLink from "@/components/store/WishlistNavLink";

const STORE_ROUTES = ["/store", "/cart", "/wishlist", "/checkout"];
const STORE_CATEGORIES = [
  { name: "Books", href: "/store?category=Books" },
  { name: "JLPT", href: "/store?category=JLPT" },
  { name: "Stationery", href: "/store?category=Stationery" },
  { name: "Accessories", href: "/store?category=Accessories" },
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
    <header className="sticky top-0 z-50 border-b border-emerald-400/10 bg-slate-950/95 backdrop-blur-xl supports-[backdrop-filter]:bg-slate-950/80">
      <div className="container-narrow flex min-h-[86px] flex-wrap items-center gap-3 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <BrandLogo className="max-w-[140px] invert sm:max-w-[165px]" />
          <nav className="hidden items-center gap-1 lg:flex">
            <Link href="/" className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm text-slate-200 transition hover:bg-white/10">
              <Home className="h-4 w-4" />
              Home
            </Link>
            <Link
              href="/store"
              className="inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-400/15 px-3 py-2 text-sm font-semibold text-emerald-100"
            >
              <Store className="h-4 w-4" />
              Store
            </Link>
            <div className="group relative">
              <button className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm text-slate-200 transition hover:bg-white/10" type="button">
                <Grid3X3 className="h-4 w-4" />
                Categories
                <ChevronDown className="h-4 w-4" />
              </button>
              <div className="invisible absolute left-0 top-full mt-2 w-52 rounded-2xl border border-white/15 bg-slate-900/95 p-2 opacity-0 shadow-2xl shadow-black/40 transition group-hover:visible group-hover:opacity-100">
                {STORE_CATEGORIES.map((category) => (
                  <Link key={category.name} href={category.href} className="block rounded-xl px-3 py-2 text-sm text-slate-100 transition hover:bg-white/10">
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          </nav>
        </div>

        <form onSubmit={onSearch} className="order-3 flex w-full items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-2 md:order-none md:mx-auto md:max-w-2xl">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search books, JLPT prep, stationery..."
            className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
          />
        </form>

        <div className="ml-auto flex items-center gap-2">
          <WishlistNavLink />
          <CartNavLink />
        </div>
      </div>
    </header>
  );
}
