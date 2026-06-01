"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import AddToCartButton from "@/components/store/AddToCartButton";
import WishlistButton from "@/components/store/WishlistButton";
import { useLanguage } from "@/components/layout/LanguageProvider";
import type { Product } from "@/lib/cms";
import { translate } from "@/lib/i18n";

type Props = {
  product: Product;
};

function getBadge(product: Product) {
  if (product.stock <= 0) return { key: "out" as const, style: "border-rose-200 bg-rose-50 text-rose-700" };
  if (product.is_featured) return { key: "featured" as const, style: "border-emerald-200 bg-emerald-50 text-emerald-700" };
  if (product.sale_price) return { key: "bestseller" as const, style: "border-amber-200 bg-amber-50 text-amber-700" };
  return { key: "new" as const, style: "border-sky-200 bg-sky-50 text-sky-700" };
}

export default function StoreProductCard({ product }: Props) {
  const { language } = useLanguage();
  const inStock = product.stock > 0;
  const t = translate({
    en: { badges: { out: "Out of Stock", featured: "Featured", bestseller: "Bestseller", new: "New" }, premium: "KNLTC Premium", imageSoon: "Image coming soon", uncategorized: "Uncategorized", reviews: "Reviews available after purchase", details: "View details" },
    bn: { badges: { out: "স্টক নেই", featured: "ফিচার্ড", bestseller: "বেস্টসেলার", new: "নতুন" }, premium: "KNLTC প্রিমিয়াম", imageSoon: "ছবি শীঘ্রই আসছে", uncategorized: "ক্যাটাগরি নেই", reviews: "কেনার পর রিভিউ দেওয়া যাবে", details: "বিস্তারিত দেখুন" },
    ja: { badges: { out: "在庫なし", featured: "おすすめ", bestseller: "ベストセラー", new: "新着" }, premium: "KNLTCプレミアム", imageSoon: "画像は近日公開", uncategorized: "未分類", reviews: "購入後にレビュー可能", details: "詳細を見る" },
  }, language);
  const badge = getBadge(product);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-md shadow-stone-200/70 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-100/80">
      <Link href={`/store/${product.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden border-b border-stone-200 bg-gradient-to-b from-stone-100 to-white">
          <span className={`absolute left-3 top-3 z-10 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${badge.style}`}>{t.badges[badge.key]}</span>
          {product.featured_image ? (
            <img
              src={product.featured_image}
              alt={product.name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center text-sm text-slate-500">
              <p className="font-medium text-slate-700">{t.premium}</p>
              <p>{t.imageSoon}</p>
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{product.categories?.name ?? t.uncategorized}</p>
        <Link href={`/store/${product.slug}`} className="mt-1 line-clamp-2 text-base font-semibold leading-snug text-slate-900 hover:text-emerald-700">
          {product.name}
        </Link>

        <div className="mt-2 inline-flex items-center gap-1 text-xs text-amber-300">
          <Star className="h-3.5 w-3.5 fill-current" />
          <span>{t.reviews}</span>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <span className="text-lg font-bold text-slate-900">৳{product.sale_price ?? product.price}</span>
          {product.sale_price ? <span className="text-sm text-slate-400 line-through">৳{product.price}</span> : null}
        </div>

        <div className="mt-2 text-xs">
          <span
            className={`inline-flex rounded-full border px-2 py-1 font-medium ${
              inStock ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-rose-200 bg-rose-50 text-rose-700"
            }`}
          >
            {inStock ? translate({ en: "Stock Available", bn: "স্টক আছে", ja: "在庫あり" }, language) : translate({ en: "Out of Stock", bn: "স্টক নেই", ja: "在庫なし" }, language)}
          </span>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <AddToCartButton product={product} disabled={!inStock} className="bg-emerald-600 text-white hover:bg-emerald-500" />
          <WishlistButton product={product} className="border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50" />
        </div>

        <Link href={`/store/${product.slug}`} className="mt-3 text-center text-sm font-medium text-emerald-700 transition hover:text-emerald-600 hover:underline">
          {t.details}
        </Link>
      </div>
    </article>
  );
}
