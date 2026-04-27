"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/cms";
import StoreProductCard from "@/components/store/StoreProductCard";

type Props = {
  products: Product[];
};

type SortMode = "newest" | "low-high" | "high-low" | "featured";

export default function StoreCatalog({ products }: Props) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<SortMode>("newest");

  const categories = useMemo(
    () => Array.from(new Set(products.map((item) => item.categories?.name).filter(Boolean))) as string[],
    [products],
  );

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = products.filter((product) => {
      const matchesSearch =
        query.length === 0 ||
        product.name.toLowerCase().includes(query) ||
        product.short_description.toLowerCase().includes(query) ||
        (product.categories?.name ?? "").toLowerCase().includes(query);

      const matchesCategory = category === "all" || product.categories?.name === category;
      return matchesSearch && matchesCategory;
    });

    const sorted = [...filtered];
    if (sort === "low-high") sorted.sort((a, b) => (a.sale_price ?? a.price) - (b.sale_price ?? b.price));
    if (sort === "high-low") sorted.sort((a, b) => (b.sale_price ?? b.price) - (a.sale_price ?? a.price));
    if (sort === "featured") {
      sorted.sort((a, b) => Number(b.is_featured) - Number(a.is_featured));
    }

    return sorted;
  }, [category, products, search, sort]);

  return (
    <>
      <section className="mb-8 overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/10 via-background to-accent/10 p-6 md:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">KNLTC Store</p>
        <h1 className="mt-2 text-3xl font-bold md:text-4xl">Japanese Learning Store</h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">
          Books, JLPT materials, stationery, and learning accessories for Japan-focused learners
        </p>
      </section>

      <section className="mb-6 grid gap-3 rounded-2xl border bg-card p-4 md:grid-cols-3">
        <label className="md:col-span-1">
          <span className="mb-1 block text-xs font-medium text-muted-foreground">Search product</span>
          <input
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            placeholder="Search by name or keyword"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>

        <label>
          <span className="mb-1 block text-xs font-medium text-muted-foreground">Category</span>
          <select className="w-full rounded-md border bg-background px-3 py-2 text-sm" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="all">All categories</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="mb-1 block text-xs font-medium text-muted-foreground">Sort by</span>
          <select className="w-full rounded-md border bg-background px-3 py-2 text-sm" value={sort} onChange={(e) => setSort(e.target.value as SortMode)}>
            <option value="newest">Newest</option>
            <option value="low-high">Price low to high</option>
            <option value="high-low">Price high to low</option>
            <option value="featured">Featured</option>
          </select>
        </label>
      </section>

      {products.length === 0 ? (
        <div className="rounded-2xl border bg-card p-8 text-center">
          <h2 className="text-xl font-semibold">No products available yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">Please check back soon for new items.</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="rounded-2xl border bg-card p-8 text-center">
          <h2 className="text-xl font-semibold">No matching products</h2>
          <p className="mt-2 text-sm text-muted-foreground">Try another keyword or category filter.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <StoreProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </>
  );
}
