import { notFound } from "next/navigation";
import { getApprovedReviews, getPublishedProductBySlug } from "@/lib/cms";
import AddToCartButton from "@/components/store/AddToCartButton";
import WishlistButton from "@/components/store/WishlistButton";
import ReviewForm from "@/components/store/ReviewForm";

export default async function ProductDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getPublishedProductBySlug(slug);

  if (!product) notFound();

  const reviews = await getApprovedReviews(product.id);

  return (
    <section className="section-padding">
      <div className="container-narrow">
        <article className="mx-auto max-w-3xl rounded-2xl border bg-card p-6 md:p-8">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{product.categories?.name ?? "Uncategorized"}</p>
          <h1 className="mt-2 text-3xl font-bold">{product.name}</h1>
          <p className="mt-4 text-muted-foreground">{product.short_description}</p>
          <div className="mt-6 text-2xl font-bold">৳{product.sale_price ?? product.price}</div>
          <div className="mt-4 flex items-center gap-2">
            <AddToCartButton product={product} />
            <WishlistButton product={product} />
          </div>
          <p className="mt-6 whitespace-pre-wrap text-foreground/90">{product.full_description}</p>
          <div className="mt-8 text-sm text-muted-foreground">Stock: {product.stock}</div>

          <section className="mt-10 border-t pt-6">
            <h2 className="text-xl font-semibold">Customer Reviews</h2>
            <div className="mt-4 space-y-3">
              {reviews.length === 0 ? <p className="text-sm text-muted-foreground">No approved reviews yet.</p> : null}
              {reviews.map((review) => (
                <div key={review.id} className="rounded-lg border p-3">
                  <p className="font-medium">{review.customer_name} • {"★".repeat(review.rating)}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{review.comment}</p>
                </div>
              ))}
            </div>
            <ReviewForm productId={product.id} />
          </section>
        </article>
      </div>
    </section>
  );
}
