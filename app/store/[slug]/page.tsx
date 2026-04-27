import Link from "next/link";
import { notFound } from "next/navigation";
import { getApprovedReviews, getPublishedProductBySlug, getPublishedProducts } from "@/lib/cms";
import ReviewForm from "@/components/store/ReviewForm";
import StoreProductCard from "@/components/store/StoreProductCard";
import ProductPurchasePanel from "@/components/store/ProductPurchasePanel";

export default async function ProductDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getPublishedProductBySlug(slug);

  if (!product) notFound();

  const [reviews, allProducts] = await Promise.all([getApprovedReviews(product.id), getPublishedProducts()]);

  const relatedProducts = allProducts
    .filter((item) => item.id !== product.id && (item.category_id ? item.category_id === product.category_id : true))
    .slice(0, 3);

  return (
    <section className="section-padding bg-slate-950 text-slate-100">
      <div className="container-narrow space-y-8">
        <ProductPurchasePanel product={product} />

        <section className="rounded-2xl border border-white/10 bg-slate-900 p-5 md:p-8">
          <h2 className="text-xl font-semibold">Description</h2>
          <p className="mt-3 whitespace-pre-wrap leading-relaxed text-slate-300">{product.full_description}</p>
        </section>

        <section className="rounded-2xl border border-white/10 bg-slate-900 p-5 md:p-8">
          <h2 className="text-xl font-semibold">Reviews</h2>
          <div className="mt-4 space-y-3">
            {reviews.length === 0 ? <p className="text-sm text-slate-400">No approved reviews yet.</p> : null}
            {reviews.map((review) => (
              <div key={review.id} className="rounded-lg border border-white/10 bg-black/20 p-3">
                <p className="font-medium text-slate-100">
                  {review.customer_name} • {"★".repeat(review.rating)}
                </p>
                <p className="mt-1 text-sm text-slate-300">{review.comment}</p>
              </div>
            ))}
          </div>
          <ReviewForm productId={product.id} />
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Related Products</h2>
            <Link href="/store" className="text-sm font-medium text-amber-300 hover:underline">
              Continue shopping
            </Link>
          </div>
          {relatedProducts.length === 0 ? (
            <p className="rounded-xl border border-white/10 bg-slate-900 p-4 text-sm text-slate-300">No related products available right now.</p>
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
