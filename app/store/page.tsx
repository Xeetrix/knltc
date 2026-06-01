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
    <section className="bg-stone-50 py-5 md:py-6">
      <div className="container-narrow">
        <Suspense
          fallback={
            <div className="rounded-2xl border border-stone-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
              Loading store catalog... / স্টোর ক্যাটালগ লোড হচ্ছে... / ストアカタログを読み込み中...
            </div>
          }
        >
          <StoreCatalog products={products} />
        </Suspense>
      </div>
    </section>
  );
}
