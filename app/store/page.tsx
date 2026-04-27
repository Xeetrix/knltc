import { Suspense } from "react";
import { getPublishedProducts } from "@/lib/cms";
import StoreCatalog from "@/components/store/StoreCatalog";

export const metadata = {
  title: "Store",
  description: "KNLTC store items for Japanese learning resources.",
};

export default async function StorePage() {
  const products = await getPublishedProducts();

  return (
    <section className="section-padding bg-stone-50">
      <div className="container-narrow">
        <Suspense
          fallback={
            <div className="rounded-2xl border border-stone-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
              Loading store catalog...
            </div>
          }
        >
          <StoreCatalog products={products} />
        </Suspense>
      </div>
    </section>
  );
}
