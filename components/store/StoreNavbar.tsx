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
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-stone-50/95 backdrop-blur-xl supports-[backdrop-filter]:bg-stone-50/85">
      <div className="container-narrow flex min-h-[72px] flex-wrap items-center gap-2 py-2.5">
        <div className="flex min-w-0 items-center gap-3">
          <BrandLogo className="max-w-[126px] sm:max-w-[150px]" />
          <nav className="hidden items-center gap-1 lg:flex">
            <Link href="/" className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm text-slate-700 transition hover:bg-white">
              <Home className="h-4 w-4" />
              Home
            </Link>
            <Link
              href="/store"
              className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-500/10 px-3 py-2 text-sm font-semibold text-emerald-700"
            >
              <Store className="h-4 w-4" />
              Store
            </Link>
            <div className="group relative">
              <button className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm text-slate-700 transition hover:bg-white" type="button">
                <Grid3X3 className="h-4 w-4" />
                Categories
                <ChevronDown className="h-4 w-4" />
              </button>
              <div className="invisible absolute left-0 top-full mt-2 w-52 rounded-2xl border border-stone-200 bg-white p-2 opacity-0 shadow-xl shadow-stone-200/80 transition group-hover:visible group-hover:opacity-100">
                {STORE_CATEGORIES.map((category) => (
                  <Link key={category.name} href={category.href} className="block rounded-xl px-3 py-2 text-sm text-slate-700 transition hover:bg-stone-100">
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          </nav>
        </div>

        <form onSubmit={onSearch} className="order-3 flex w-full items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2 md:order-none md:mx-auto md:max-w-2xl">
          <Search className="h-4 w-4 text-slate-500" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search books, JLPT prep, stationery..."
            className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
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
