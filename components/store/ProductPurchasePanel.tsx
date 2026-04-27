"use client";

import { useMemo, useState } from "react";
import AddToCartButton from "@/components/store/AddToCartButton";
import WishlistButton from "@/components/store/WishlistButton";

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
  const [quantity, setQuantity] = useState(1);
  const effectivePrice = useMemo(() => (product.sale_price ?? product.price) * quantity, [product.price, product.sale_price, quantity]);

  return (
    <article className="grid gap-6 rounded-2xl border border-white/10 bg-slate-900 p-5 md:grid-cols-2 md:p-8">
      <div className="overflow-hidden rounded-xl border border-white/10 bg-slate-800">
        {product.featured_image ? (
          <img src={product.featured_image} alt={product.name} className="aspect-square w-full object-cover" />
        ) : (
          <div className="flex aspect-square items-center justify-center text-sm text-slate-400">No image available</div>
        )}
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{product.categories?.name ?? "Uncategorized"}</p>
        <h1 className="mt-2 text-3xl font-bold text-white">{product.name}</h1>

        <div className="mt-4 flex items-center gap-2">
          <span className="text-3xl font-bold">৳{product.sale_price ?? product.price}</span>
          {product.sale_price ? <span className="text-slate-400 line-through">৳{product.price}</span> : null}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
          <span className={`rounded-full border px-2 py-1 ${product.stock > 0 ? "border-emerald-400/60 text-emerald-300" : "border-rose-400/60 text-rose-300"}`}>
            {product.stock > 0 ? `In stock (${product.stock})` : "Out of stock"}
          </span>
          <span className="rounded-full border border-white/20 px-2 py-1 text-slate-300">SKU: {product.sku ?? "N/A"}</span>
        </div>

        <p className="mt-4 text-sm text-slate-300">{product.short_description}</p>

        <div className="mt-5">
          <p className="mb-2 text-sm text-slate-300">Quantity</p>
          <div className="inline-flex items-center rounded-md border border-white/20">
            <button type="button" className="px-3 py-2 hover:bg-white/10" onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}>
              -
            </button>
            <span className="min-w-10 px-3 text-center">{quantity}</span>
            <button
              type="button"
              className="px-3 py-2 hover:bg-white/10"
              onClick={() => setQuantity((prev) => Math.min(product.stock || 1, prev + 1))}
            >
              +
            </button>
          </div>
          <p className="mt-2 text-sm text-slate-400">Selected subtotal: ৳{effectivePrice}</p>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <AddToCartButton product={product} quantity={quantity} disabled={product.stock <= 0} className="px-6 py-2.5" />
          <WishlistButton product={product} className="border-white/20 text-slate-100 hover:bg-white/10" />
        </div>
      </div>
    </article>
  );
}
