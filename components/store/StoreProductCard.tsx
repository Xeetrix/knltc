import Link from "next/link";
import { Star } from "lucide-react";
import AddToCartButton from "@/components/store/AddToCartButton";
import WishlistButton from "@/components/store/WishlistButton";
import type { Product } from "@/lib/cms";

type Props = {
  product: Product;
};

function getBadge(product: Product) {
  if (product.stock <= 0) return { label: "Out of Stock", style: "border-rose-300/40 bg-rose-500/20 text-rose-100" };
  if (product.is_featured) return { label: "Featured", style: "border-emerald-300/40 bg-emerald-500/20 text-emerald-100" };
  if (product.sale_price) return { label: "Bestseller", style: "border-amber-300/40 bg-amber-500/20 text-amber-100" };
  return { label: "New", style: "border-sky-300/40 bg-sky-500/20 text-sky-100" };
}

export default function StoreProductCard({ product }: Props) {
  const inStock = product.stock > 0;
  const badge = getBadge(product);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-lg shadow-black/30 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-500/10">
      <Link href={`/store/${product.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden border-b border-white/10 bg-gradient-to-b from-slate-800 to-slate-900">
          <span className={`absolute left-3 top-3 z-10 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${badge.style}`}>{badge.label}</span>
          {product.featured_image ? (
            <img
              src={product.featured_image}
              alt={product.name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center text-sm text-slate-400">
              <p className="font-medium text-slate-200">KNLTC Premium</p>
              <p>Image coming soon</p>
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{product.categories?.name ?? "Uncategorized"}</p>
        <Link href={`/store/${product.slug}`} className="mt-1 line-clamp-2 text-base font-semibold leading-snug text-slate-100 hover:text-emerald-300">
          {product.name}
        </Link>

        <div className="mt-2 inline-flex items-center gap-1 text-xs text-amber-300">
          <Star className="h-3.5 w-3.5 fill-current" />
          <span>Reviews available after purchase</span>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <span className="text-lg font-bold text-white">৳{product.sale_price ?? product.price}</span>
          {product.sale_price ? <span className="text-sm text-slate-400 line-through">৳{product.price}</span> : null}
        </div>

        <div className="mt-2 text-xs">
          <span
            className={`inline-flex rounded-full border px-2 py-1 font-medium ${
              inStock ? "border-emerald-400/50 bg-emerald-500/10 text-emerald-300" : "border-rose-400/50 bg-rose-500/10 text-rose-300"
            }`}
          >
            {inStock ? `In stock (${product.stock})` : "Out of stock"}
          </span>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <AddToCartButton product={product} disabled={!inStock} className="bg-emerald-500 hover:bg-emerald-400" />
          <WishlistButton product={product} className="border-white/20 text-slate-100 hover:bg-white/10" />
        </div>

        <Link href={`/store/${product.slug}`} className="mt-3 text-center text-sm font-medium text-emerald-300 transition hover:text-emerald-200 hover:underline">
          View details
        </Link>
      </div>
    </article>
  );
}
