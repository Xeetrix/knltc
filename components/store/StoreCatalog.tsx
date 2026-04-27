"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, ChevronDown, SlidersHorizontal } from "lucide-react";
import type { Product } from "@/lib/cms";
import StoreProductCard from "@/components/store/StoreProductCard";
import CartNavLink from "@/components/store/CartNavLink";

type Props = {
  products: Product[];
};

type SortMode = "newest" | "price-low" | "price-high" | "popular";
type PriceMode = "all" | "under-500" | "500-1000" | "1000-plus";

export default function StoreCatalog({ products }: Props) {
  const params = useSearchParams();
  const [search, setSearch] = useState(params.get("search") ?? "");
  const [category, setCategory] = useState(params.get("category") ?? "all");
  const [sort, setSort] = useState<SortMode>("newest");
  const [priceMode, setPriceMode] = useState<PriceMode>("all");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const categories = useMemo(
    () => Array.from(new Set(products.map((item) => item.categories?.name).filter(Boolean))) as string[],
    [products],
  );

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = products.filter((product) => {
      const matchingText = `${product.name} ${product.short_description} ${product.categories?.name ?? ""}`.toLowerCase();
      const matchesSearch = query.length === 0 || matchingText.includes(query);
      const matchesCategory = category === "all" || product.categories?.name === category;
      const effectivePrice = product.sale_price ?? product.price;
      const matchesPrice =
        priceMode === "all" ||
        (priceMode === "under-500" && effectivePrice < 500) ||
        (priceMode === "500-1000" && effectivePrice >= 500 && effectivePrice <= 1000) ||
        (priceMode === "1000-plus" && effectivePrice > 1000);
      const matchesFeatured = !featuredOnly || product.is_featured;

      return matchesSearch && matchesCategory && matchesPrice && matchesFeatured;
    });

    const sorted = [...filtered];
    if (sort === "price-low") sorted.sort((a, b) => (a.sale_price ?? a.price) - (b.sale_price ?? b.price));
    if (sort === "price-high") sorted.sort((a, b) => (b.sale_price ?? b.price) - (a.sale_price ?? a.price));
    if (sort === "popular") sorted.sort((a, b) => Number(b.is_featured) - Number(a.is_featured) || b.stock - a.stock);

    return sorted;
  }, [category, featuredOnly, priceMode, products, search, sort]);

  return (
    <div className="space-y-4 text-slate-900">
      <section className="rounded-2xl border border-stone-200 bg-white px-5 py-4 shadow-sm shadow-stone-200/70">
        <h1 className="text-2xl font-bold text-slate-900">Japanese Learning Store</h1>
        <p className="mt-1 text-sm text-slate-600">Premium books, JLPT prep, and essentials—ready to shop quickly.</p>
      </section>

      <section id="products" className="space-y-4 rounded-3xl border border-stone-200 bg-stone-100/70 p-4 md:p-5">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-2xl font-semibold text-slate-900">All Products</h2>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-3 py-2 text-xs text-slate-700 md:hidden"
            onClick={() => setFiltersOpen((prev) => !prev)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            <ChevronDown className={`h-4 w-4 transition ${filtersOpen ? "rotate-180" : ""}`} />
          </button>
        </div>

        <div className={`${filtersOpen ? "grid" : "hidden"} gap-3 rounded-2xl border border-stone-200 bg-white p-3 shadow-sm md:grid md:grid-cols-5`}>
          <label>
            <span className="mb-1 block text-xs font-medium text-slate-600">Search</span>
            <div className="flex items-center gap-2 rounded-md border border-stone-300 bg-white px-3 py-2">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                placeholder="Search by name"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </label>

          <label>
            <span className="mb-1 block text-xs font-medium text-slate-600">Category</span>
            <select className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-slate-800" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="all">All categories</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="mb-1 block text-xs font-medium text-slate-600">Price</span>
            <select className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-slate-800" value={priceMode} onChange={(e) => setPriceMode(e.target.value as PriceMode)}>
              <option value="all">All ranges</option>
              <option value="under-500">Under ৳500</option>
              <option value="500-1000">৳500 - ৳1000</option>
              <option value="1000-plus">Above ৳1000</option>
            </select>
          </label>

          <label>
            <span className="mb-1 block text-xs font-medium text-slate-600">Sort</span>
            <select className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-slate-800" value={sort} onChange={(e) => setSort(e.target.value as SortMode)}>
              <option value="newest">Newest</option>
              <option value="price-low">Price low to high</option>
              <option value="price-high">Price high to low</option>
              <option value="popular">Popular</option>
            </select>
          </label>

          <label className="inline-flex items-center gap-2 self-end rounded-md border border-stone-300 bg-stone-50 px-3 py-2 text-sm text-slate-700">
            <input type="checkbox" checked={featuredOnly} onChange={(event) => setFeaturedOnly(event.target.checked)} />
            Featured only
          </label>
        </div>

        {products.length === 0 ? (
          <div className="rounded-2xl border border-stone-200 bg-white p-8 text-center">
            <h3 className="text-xl font-semibold text-slate-900">No products available yet</h3>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-2xl border border-stone-200 bg-white p-8 text-center">
            <h3 className="text-xl font-semibold text-slate-900">No matching products</h3>
            <p className="mt-2 text-sm text-slate-600">Try a different filter combination.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <StoreProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <div className="fixed bottom-4 right-4 z-40 md:hidden">
        <CartNavLink className="h-14 w-14 rounded-full border-emerald-200 bg-emerald-600 text-white shadow-xl shadow-emerald-200/70" />
      </div>
    </div>
  );
}
