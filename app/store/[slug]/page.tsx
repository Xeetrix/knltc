import Link from "next/link";
import { notFound } from "next/navigation";
import { getApprovedReviews, getPublishedProductBySlug, getPublishedProducts } from "@/lib/cms";
import AddToCartButton from "@/components/store/AddToCartButton";
import WishlistButton from "@/components/store/WishlistButton";
import ReviewForm from "@/components/store/ReviewForm";
import StoreProductCard from "@/components/store/StoreProductCard";

export default async function ProductDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getPublishedProductBySlug(slug);

  if (!product) notFound();

  const [reviews, allProducts] = await Promise.all([getApprovedReviews(product.id), getPublishedProducts()]);

  const relatedProducts = allProducts
    .filter((item) => item.id !== product.id && (item.category_id ? item.category_id === product.category_id : true))
    .slice(0, 3);

  return (
    <section className="section-padding">
      <div className="container-narrow space-y-8">
        <article className="grid gap-6 rounded-2xl border bg-card p-5 md:grid-cols-2 md:p-8">
          <div className="overflow-hidden rounded-xl border bg-muted">
            {product.featured_image ? (
              <img src={product.featured_image} alt={product.name} className="aspect-square w-full object-cover" />
            ) : (
              <div className="flex aspect-square items-center justify-center text-sm text-muted-foreground">No image available</div>
            )}
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{product.categories?.name ?? "Uncategorized"}</p>
            <h1 className="mt-2 text-3xl font-bold">{product.name}</h1>

            <div className="mt-4 flex items-center gap-2">
              <span className="text-2xl font-bold">৳{product.sale_price ?? product.price}</span>
              {product.sale_price ? <span className="text-muted-foreground line-through">৳{product.price}</span> : null}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              <span className={`rounded-full border px-2 py-1 ${product.stock > 0 ? "border-emerald-300 text-emerald-700" : "border-rose-300 text-rose-700"}`}>
                {product.stock > 0 ? `In stock (${product.stock})` : "Out of stock"}
              </span>
              <span className="rounded-full border px-2 py-1">SKU: {product.sku ?? "N/A"}</span>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">{product.short_description}</p>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <AddToCartButton product={product} disabled={product.stock <= 0} />
              <WishlistButton product={product} />
            </div>
          </div>
        </article>

        <section className="rounded-2xl border bg-card p-5 md:p-8">
          <h2 className="text-xl font-semibold">Product Details</h2>
          <p className="mt-3 whitespace-pre-wrap leading-relaxed text-foreground/90">{product.full_description}</p>
        </section>

        <section className="rounded-2xl border bg-card p-5 md:p-8">
          <h2 className="text-xl font-semibold">Customer Reviews</h2>
          <div className="mt-4 space-y-3">
            {reviews.length === 0 ? <p className="text-sm text-muted-foreground">No approved reviews yet.</p> : null}
            {reviews.map((review) => (
              <div key={review.id} className="rounded-lg border p-3">
                <p className="font-medium">
                  {review.customer_name} • {"★".repeat(review.rating)}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{review.comment}</p>
              </div>
            ))}
          </div>
          <ReviewForm productId={product.id} />
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Related Products</h2>
            <Link href="/store" className="text-sm font-medium text-primary hover:underline">
              Continue shopping
            </Link>
          </div>
          {relatedProducts.length === 0 ? (
            <p className="rounded-xl border bg-card p-4 text-sm text-muted-foreground">No related products available right now.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((item) => (
                <StoreProductCard key={item.id} product={item} />
              ))}
            </div>
          )}
        </section>
      </div>
    </section>
  );
}
