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
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
      <Link href={`/store/${product.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {product.featured_image ? (
            <img
              src={product.featured_image}
              alt={product.name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">No image</div>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{product.categories?.name ?? "Uncategorized"}</p>
        <Link href={`/store/${product.slug}`} className="mt-1 line-clamp-2 text-base font-semibold leading-snug hover:text-primary">
          {product.name}
        </Link>

        <div className="mt-2 flex items-center gap-2">
          <span className="text-lg font-bold text-foreground">৳{product.sale_price ?? product.price}</span>
          {product.sale_price ? <span className="text-sm text-muted-foreground line-through">৳{product.price}</span> : null}
        </div>

        <div className="mt-2 text-xs">
          <span
            className={`inline-flex rounded-full border px-2 py-1 font-medium ${
              inStock ? "border-emerald-300 bg-emerald-50 text-emerald-700" : "border-rose-300 bg-rose-50 text-rose-700"
            }`}
          >
            {inStock ? `In stock (${product.stock})` : "Out of stock"}
          </span>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <AddToCartButton product={product} disabled={!inStock} />
          <WishlistButton product={product} />
        </div>
        <Link
          href={`/store/${product.slug}`}
          className="mt-2 inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}
