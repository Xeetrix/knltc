"use client";

import { useState } from "react";
import type { ProductReview } from "@/lib/cms";

type Props = {
  details: string;
  reviews: ProductReview[];
};

type Tab = "details" | "shipping" | "reviews";

export default function ProductDetailTabs({ details, reviews }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("details");

  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm shadow-stone-200/70 md:p-8">
      <div className="flex flex-wrap gap-2 border-b border-stone-200 pb-4">
        {[
          { key: "details", label: "Details" },
          { key: "shipping", label: "Shipping / Support" },
          { key: "reviews", label: `Reviews (${reviews.length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key as Tab)}
            className={`rounded-full px-4 py-2 text-sm transition ${
              activeTab === tab.key ? "bg-emerald-600 text-white" : "border border-stone-300 bg-white text-slate-700 hover:bg-stone-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "details" ? <p className="mt-4 whitespace-pre-wrap leading-relaxed text-slate-700">{details}</p> : null}

      {activeTab === "shipping" ? (
        <div className="mt-4 space-y-3 text-sm text-slate-700">
          <p>Orders are processed quickly with human support for payment and delivery updates.</p>
          <p>Need help choosing materials? Our support team can assist based on your JLPT level.</p>
        </div>
      ) : null}

      {activeTab === "reviews" ? (
        <div className="mt-4 space-y-3">
          {reviews.length === 0 ? <p className="text-sm text-slate-500">No approved reviews yet.</p> : null}
          {reviews.map((review) => (
            <div key={review.id} className="rounded-lg border border-stone-200 bg-stone-50 p-3">
              <p className="font-medium text-slate-900">
                {review.customer_name} • {"★".repeat(review.rating)}
              </p>
              <p className="mt-1 text-sm text-slate-700">{review.comment}</p>
              {review.image_url ? <img src={review.image_url} alt="Review" className="mt-2 h-24 w-24 rounded-md object-cover" /> : null}
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
