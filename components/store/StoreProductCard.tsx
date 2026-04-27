import Link from "next/link";
import AddToCartButton from "@/components/store/AddToCartButton";
import WishlistButton from "@/components/store/WishlistButton";
import type { Product } from "@/lib/cms";

type Props = {
  product: Product;
};

export default function StoreProductCard({ product }: Props) {
  const inStock = product.stock > 0;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900 to-slate-950 shadow-lg shadow-black/30 transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40">
      <Link href={`/store/${product.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-800">
          {product.featured_image ? (
            <img
              src={product.featured_image}
              alt={product.name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-slate-400">No image</div>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{product.categories?.name ?? "Uncategorized"}</p>
        <Link href={`/store/${product.slug}`} className="mt-1 line-clamp-2 text-base font-semibold leading-snug text-slate-100 hover:text-amber-300">
          {product.name}
        </Link>

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
          <AddToCartButton product={product} disabled={!inStock} className="bg-primary/90 hover:bg-primary" />
          <WishlistButton product={product} className="border-white/20 text-slate-100 hover:bg-white/10" />
        </div>
      </div>
    </article>
  );
}
