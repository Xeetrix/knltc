import { notFound } from "next/navigation";
import { getPublishedProductBySlug } from "@/lib/cms";

export default async function ProductDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getPublishedProductBySlug(slug);

  if (!product) notFound();

  return (
    <section className="section-padding">
      <div className="container-narrow">
        <article className="mx-auto max-w-3xl rounded-2xl border bg-card p-6 md:p-8">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{product.categories?.name ?? "Uncategorized"}</p>
          <h1 className="mt-2 text-3xl font-bold">{product.name}</h1>
          <p className="mt-4 text-muted-foreground">{product.short_description}</p>
          <div className="mt-6 text-2xl font-bold">৳{product.sale_price ?? product.price}</div>
          <p className="mt-6 whitespace-pre-wrap text-foreground/90">{product.full_description}</p>
          <div className="mt-8 text-sm text-muted-foreground">Stock: {product.stock}</div>
        </article>
      </div>
    </section>
  );
}
