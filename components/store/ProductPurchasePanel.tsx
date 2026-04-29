"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import AddToCartButton from "@/components/store/AddToCartButton";
import WishlistButton from "@/components/store/WishlistButton";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";

type ProductPanelProps = {
  product: {
    id: string;
    name: string;
    slug: string;
    category_id: string | null;
    short_description: string;
    price: number;
    sale_price: number | null;
    stock: number;
    featured_image: string | null;
    sku: string | null;
    categories?: { name: string; slug: string } | null;
  };
};

export default function ProductPurchasePanel({ product }: ProductPanelProps) {
  const { language } = useLanguage();
  const [quantity, setQuantity] = useState(1);
  const effectivePrice = useMemo(() => (product.sale_price ?? product.price) * quantity, [product.price, product.sale_price, quantity]);

  return (
    <article className="grid gap-6 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm shadow-stone-200/70 md:grid-cols-[1.1fr_1fr] md:p-8">
      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-gradient-to-b from-stone-100 to-white">
        {product.featured_image ? (
          <img src={product.featured_image} alt={product.name} className="aspect-square w-full object-cover" />
        ) : (
          <div className="flex aspect-square items-center justify-center text-sm text-slate-500">Premium product image coming soon</div>
        )}
      </div>

      <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">{product.categories?.name ?? "Uncategorized"}</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">{product.name}</h1>

        <div className="mt-4 flex items-center gap-2">
          <span className="text-3xl font-bold">৳{product.sale_price ?? product.price}</span>
          {product.sale_price ? <span className="text-slate-500 line-through">৳{product.price}</span> : null}
        </div>

        <div className="mt-3 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
          <span className={`rounded-full border px-2 py-1 text-center ${product.stock > 0 ? "border-emerald-300 bg-emerald-50 text-emerald-700" : "border-rose-200 bg-rose-50 text-rose-700"}`}>
            {product.stock > 0 ? translate({ en: "Stock Available", bn: "স্টক আছে", ja: "在庫あり" }, language) : translate({ en: "Out of Stock", bn: "স্টক নেই", ja: "在庫なし" }, language)}
          </span>
          <span className="rounded-full border border-stone-300 bg-white px-2 py-1 text-center">SKU: {product.sku ?? "N/A"}</span>
        </div>

        <p className="mt-4 text-sm text-slate-700">{product.short_description}</p>

        <div className="mt-5">
          <p className="mb-2 text-sm text-slate-600">Quantity</p>
          <div className="inline-flex items-center rounded-lg border border-stone-300 bg-white">
            <button type="button" className="px-3 py-2 hover:bg-stone-100" onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}>
              -
            </button>
            <span className="min-w-10 px-3 text-center">{quantity}</span>
            <button
              type="button"
              className="px-3 py-2 hover:bg-stone-100"
              onClick={() => setQuantity((prev) => Math.min(product.stock || 1, prev + 1))}
            >
              +
            </button>
          </div>
          <p className="mt-2 text-sm text-slate-600">Selected subtotal: ৳{effectivePrice}</p>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <AddToCartButton product={product} quantity={quantity} disabled={product.stock <= 0} className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400" />
          <WishlistButton product={product} className="border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50" />
          <Link href="/checkout" className="rounded-md border border-emerald-200 bg-emerald-50 px-6 py-2.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-100">
            Buy Now
          </Link>
        </div>
      </div>
    </article>
  );
}
