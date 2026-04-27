import { getPublishedProducts } from "@/lib/cms";
import StoreCatalog from "@/components/store/StoreCatalog";

export const metadata = {
  title: "Store",
  description: "KNLTC store items for Japanese learning resources.",
};

export default async function StorePage() {
  const products = await getPublishedProducts();

  return (
    <section className="section-padding">
      <div className="container-narrow">
        <StoreCatalog products={products} />
      </div>
    </section>
  );
}
