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
    <section className="section-padding bg-slate-950">
      <div className="container-narrow">
        <Suspense
          fallback={
            <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-sm text-slate-300">
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
