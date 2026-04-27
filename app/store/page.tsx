import Link from "next/link";
import { getPublishedProducts } from "@/lib/cms";
import AddToCartButton from "@/components/store/AddToCartButton";
import WishlistButton from "@/components/store/WishlistButton";

export const metadata = {
  title: "Store",
  description: "KNLTC store items for Japanese learning resources.",
};

export default async function StorePage() {
  const products = await getPublishedProducts();

  return (
    <section className="section-padding">
      <div className="container-narrow">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Store</h1>
          <p className="mt-2 text-muted-foreground">Japanese books and learning materials curated by KNLTC.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.length === 0 ? (
            <div className="rounded-xl border bg-card p-5 md:col-span-2 lg:col-span-3">
              <h2 className="text-lg font-semibold">No products available yet</h2>
              <p className="mt-2 text-sm text-muted-foreground">Please check back later for new learning resources.</p>
            </div>
          ) : (
            products.map((product) => (
              <article key={product.id} className="rounded-xl border bg-card p-5 transition hover:border-primary/40">
                <Link href={`/store/${product.slug}`}>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{product.categories?.name ?? "Uncategorized"}</p>
                  <h2 className="mt-2 text-lg font-semibold">{product.name}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{product.short_description}</p>
                </Link>
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-base font-bold">৳{product.sale_price ?? product.price}</span>
                  {product.sale_price ? <span className="text-sm text-muted-foreground line-through">৳{product.price}</span> : null}
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <AddToCartButton product={product} />
                  <WishlistButton product={product} />
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
