"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, ChevronDown, SlidersHorizontal } from "lucide-react";
import type { Product } from "@/lib/cms";
import StoreProductCard from "@/components/store/StoreProductCard";
import CartNavLink from "@/components/store/CartNavLink";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";

type Props = {
  products: Product[];
};

type SortMode = "newest" | "price-low" | "price-high" | "popular";
type PriceMode = "all" | "under-500" | "500-1000" | "1000-plus";

export default function StoreCatalog({ products }: Props) {
  const { language } = useLanguage();
  const t = translate({
    en: { title: "Japanese Learning Store", subtitle: "Premium books, JLPT prep, and essentials—ready to shop quickly.", all: "All Products", filters: "Filters", search: "Search", searchPlaceholder: "Search by name", category: "Category", allCategories: "All categories", price: "Price", allRanges: "All ranges", under500: "Under ৳500", above1000: "Above ৳1000", sort: "Sort", newest: "Newest", priceLow: "Price low to high", priceHigh: "Price high to low", popular: "Popular", featured: "Featured only", none: "No products available yet", noMatch: "No matching products", tryDifferent: "Try a different filter combination." },
    bn: { title: "জাপানি লার্নিং স্টোর", subtitle: "প্রিমিয়াম বই, JLPT প্রস্তুতি ও দরকারি সামগ্রী—দ্রুত কেনাকাটার জন্য প্রস্তুত।", all: "সব পণ্য", filters: "ফিল্টার", search: "সার্চ", searchPlaceholder: "নাম দিয়ে খুঁজুন", category: "ক্যাটাগরি", allCategories: "সব ক্যাটাগরি", price: "দাম", allRanges: "সব রেঞ্জ", under500: "৳৫০০-এর নিচে", above1000: "৳১০০০-এর বেশি", sort: "সাজান", newest: "নতুনতম", priceLow: "কম দাম থেকে বেশি", priceHigh: "বেশি দাম থেকে কম", popular: "জনপ্রিয়", featured: "শুধু ফিচার্ড", none: "এখনো কোনো পণ্য নেই", noMatch: "ম্যাচিং পণ্য পাওয়া যায়নি", tryDifferent: "অন্য ফিল্টার কম্বিনেশন চেষ্টা করুন।" },
    ja: { title: "日本語学習ストア", subtitle: "厳選書籍、JLPT対策、学習必需品をすぐに購入できます。", all: "すべての商品", filters: "フィルター", search: "検索", searchPlaceholder: "名前で検索", category: "カテゴリー", allCategories: "すべてのカテゴリー", price: "価格", allRanges: "すべての価格帯", under500: "৳500未満", above1000: "৳1000超", sort: "並び替え", newest: "新着順", priceLow: "価格が低い順", priceHigh: "価格が高い順", popular: "人気", featured: "おすすめのみ", none: "商品はまだありません", noMatch: "一致する商品がありません", tryDifferent: "別のフィルター条件をお試しください。" },
  }, language);
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
        <h1 className="text-2xl font-bold text-slate-900">{t.title}</h1>
        <p className="mt-1 text-sm text-slate-600">{t.subtitle}</p>
      </section>

      <section id="products" className="space-y-4 rounded-3xl border border-stone-200 bg-stone-100/70 p-4 md:p-5">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-2xl font-semibold text-slate-900">{t.all}</h2>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-3 py-2 text-xs text-slate-700 md:hidden"
            onClick={() => setFiltersOpen((prev) => !prev)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            {t.filters}
            <ChevronDown className={`h-4 w-4 transition ${filtersOpen ? "rotate-180" : ""}`} />
          </button>
        </div>

        <div className={`${filtersOpen ? "grid" : "hidden"} gap-3 rounded-2xl border border-stone-200 bg-white p-3 shadow-sm md:grid md:grid-cols-5`}>
          <label>
            <span className="mb-1 block text-xs font-medium text-slate-600">{t.search}</span>
            <div className="flex items-center gap-2 rounded-md border border-stone-300 bg-white px-3 py-2">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                placeholder={t.searchPlaceholder}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </label>

          <label>
            <span className="mb-1 block text-xs font-medium text-slate-600">{t.category}</span>
            <select className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-slate-800" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="all">{t.allCategories}</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="mb-1 block text-xs font-medium text-slate-600">{t.price}</span>
            <select className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-slate-800" value={priceMode} onChange={(e) => setPriceMode(e.target.value as PriceMode)}>
              <option value="all">{t.allRanges}</option>
              <option value="under-500">{t.under500}</option>
              <option value="500-1000">৳500 - ৳1000</option>
              <option value="1000-plus">{t.above1000}</option>
            </select>
          </label>

          <label>
            <span className="mb-1 block text-xs font-medium text-slate-600">{t.sort}</span>
            <select className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-slate-800" value={sort} onChange={(e) => setSort(e.target.value as SortMode)}>
              <option value="newest">{t.newest}</option>
              <option value="price-low">{t.priceLow}</option>
              <option value="price-high">{t.priceHigh}</option>
              <option value="popular">{t.popular}</option>
            </select>
          </label>

          <label className="inline-flex items-center gap-2 self-end rounded-md border border-stone-300 bg-stone-50 px-3 py-2 text-sm text-slate-700">
            <input type="checkbox" checked={featuredOnly} onChange={(event) => setFeaturedOnly(event.target.checked)} />
            {t.featured}
          </label>
        </div>

        {products.length === 0 ? (
          <div className="rounded-2xl border border-stone-200 bg-white p-8 text-center">
            <h3 className="text-xl font-semibold text-slate-900">{t.none}</h3>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-2xl border border-stone-200 bg-white p-8 text-center">
            <h3 className="text-xl font-semibold text-slate-900">{t.noMatch}</h3>
            <p className="mt-2 text-sm text-slate-600">{t.tryDifferent}</p>
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
