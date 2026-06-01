"use client";

import Link from "next/link";
import type { Product, ProductReview } from "@/lib/cms";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";
import ProductDetailTabs from "@/components/store/ProductDetailTabs";
import ProductPurchasePanel from "@/components/store/ProductPurchasePanel";
import ReviewForm from "@/components/store/ReviewForm";
import StoreProductCard from "@/components/store/StoreProductCard";

type ProductDetailsContentProps = {
  product: Product;
  reviews: ProductReview[];
  relatedProducts: Product[];
};

export default function ProductDetailsContent({ product, reviews, relatedProducts }: ProductDetailsContentProps) {
  const { language } = useLanguage();
  const t = translate({
    en: { writeReview: "Write a Review", related: "Related Products", continue: "Continue shopping", noRelated: "No related products available right now." },
    bn: { writeReview: "রিভিউ লিখুন", related: "সম্পর্কিত পণ্য", continue: "শপিং চালিয়ে যান", noRelated: "এখন কোনো সম্পর্কিত পণ্য নেই।" },
    ja: { writeReview: "レビューを書く", related: "関連商品", continue: "買い物を続ける", noRelated: "現在、関連商品はありません。" },
  }, language);

  return (
    <section className="section-padding bg-stone-50 text-slate-900">
      <div className="container-narrow space-y-8">
        <ProductPurchasePanel product={product} />

        <ProductDetailTabs details={product.full_description} reviews={reviews} />

        <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm shadow-stone-200/70 md:p-8">
          <h2 className="text-xl font-semibold">{t.writeReview}</h2>
          <ReviewForm productId={product.id} />
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">{t.related}</h2>
            <Link href="/store" className="text-sm font-medium text-emerald-700 hover:underline">
              {t.continue}
            </Link>
          </div>
          {relatedProducts.length === 0 ? (
            <p className="rounded-xl border border-stone-200 bg-white p-4 text-sm text-slate-500">{t.noRelated}</p>
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
