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
    <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 md:p-8">
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
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
              activeTab === tab.key ? "bg-emerald-500 text-white" : "border border-white/20 bg-white/5 text-slate-200 hover:bg-white/10"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "details" ? <p className="mt-4 whitespace-pre-wrap leading-relaxed text-slate-300">{details}</p> : null}

      {activeTab === "shipping" ? (
        <div className="mt-4 space-y-3 text-sm text-slate-300">
          <p>Orders are processed quickly with human support for payment and delivery updates.</p>
          <p>Need help choosing materials? Our support team can assist based on your JLPT level.</p>
        </div>
      ) : null}

      {activeTab === "reviews" ? (
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
      ) : null}
    </section>
  );
}
