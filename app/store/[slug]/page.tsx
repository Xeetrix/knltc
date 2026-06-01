import ProductDetailsContent from "@/components/store/ProductDetailsContent";
import { notFound } from "next/navigation";
import { getApprovedReviews, getPublishedProductBySlug, getPublishedProducts } from "@/lib/cms";

export default async function ProductDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getPublishedProductBySlug(slug);

  if (!product) notFound();

  const [reviews, allProducts] = await Promise.all([getApprovedReviews(product.id), getPublishedProducts()]);

  const relatedProducts = allProducts
    .filter((item) => item.id !== product.id && (item.category_id ? item.category_id === product.category_id : true))
    .slice(0, 3);

  return <ProductDetailsContent product={product} reviews={reviews} relatedProducts={relatedProducts} />;
}
