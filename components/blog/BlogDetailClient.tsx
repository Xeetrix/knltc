"use client";

import Link from "next/link";
import { ArrowLeft, Calendar, MessageCircle, Phone, User } from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";
import RichContent from "@/components/blog/RichContent";
import { Button } from "@/components/ui/button";
import type { BlogPost } from "@/lib/cms";

interface Props {
  post: BlogPost;
}

export default function BlogDetailClient({ post }: Props) {
  const { language } = useLanguage();

  const t = translate(
    {
      en: {
        back: "Back to all articles",
        by: "Written by",
        category: "Category",
        ctaTitle: "Planning to Study or Work in Japan?",
        ctaDesc:
          "Get expert guidance on admission, embassy visa interviews, and Japanese language courses directly from KNLTC.",
        ctaBtn: "Book Free Consultation",
        whatsapp: "Chat on WhatsApp",
      },
      bn: {
        back: "সকল ব্লগে ফিরে যান",
        by: "লেখক:",
        category: "ক্যাটাগরি",
        ctaTitle: "জাপানে পড়াশোনা বা ক্যারিয়ার গড়ার পরিকল্পনা করছেন?",
        ctaDesc:
          "অ্যাডমিশন, এম্বাসি ভিসা ইন্টারভিউ ও জাপানি ভাষা কোর্সের বিষয়ে KNLTC-এর অভিজ্ঞ মেন্টরদের সাথে সরাসরি কথা বলুন।",
        ctaBtn: "ফ্রি কাউন্সেলিং বুক করুন",
        whatsapp: "WhatsApp-এ কথা বলুন",
      },
      ja: {
        back: "記事一覧へ戻る",
        by: "著者:",
        category: "カテゴリー",
        ctaTitle: "日本留学・就職をお考えですか？",
        ctaDesc:
          "入学手続き、大使館面接対策、日本語コースについて、KNLTCの専門カウンセラーにご相談ください。",
        ctaBtn: "無料相談を申し込む",
        whatsapp: "WhatsAppで相談",
      },
    },
    language,
  );

  return (
    <section className="section-padding bg-gradient-to-b from-stone-50 via-white to-stone-50/40">
      <div className="container-narrow">
        <div className="mx-auto max-w-3xl mb-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-[#b91c1c] transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {t.back}
          </Link>
        </div>

        <article className="mx-auto max-w-3xl rounded-3xl border bg-card p-6 shadow-sm md:p-10">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-4 text-xs text-muted-foreground">
            <span className="font-bold uppercase tracking-wider text-[#b91c1c]">
              {post.categories?.name ?? "Guidance"}
            </span>
            {post.publish_date || post.created_at ? (
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(post.publish_date || post.created_at).toLocaleDateString()}
              </span>
            ) : null}
          </div>

          <h1 className="mt-4 text-2xl font-extrabold leading-tight text-foreground sm:text-3xl md:text-4xl">
            {post.title}
          </h1>

          <div className="mt-3 mb-6 flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <User className="h-3.5 w-3.5" />
            <span>
              {t.by} <strong className="text-foreground">{post.author}</strong>
            </span>
          </div>

          {post.cover_image ? (
            <div className="mb-8 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-stone-100">
              <img src={post.cover_image} alt={post.title} className="h-full w-full object-cover" />
            </div>
          ) : null}

          <div className="prose prose-stone max-w-none text-base leading-relaxed text-foreground/90">
            <RichContent html={post.content} />
          </div>

          <div className="mt-12 rounded-2xl border border-red-100 bg-red-50/50 p-6 sm:p-8">
            <h3 className="text-lg font-bold text-foreground sm:text-xl">{t.ctaTitle}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{t.ctaDesc}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild className="bg-[#b91c1c] font-semibold text-white hover:bg-red-800">
                <Link href="/contact">{t.ctaBtn}</Link>
              </Button>
              <Button asChild variant="outline" className="border-emerald-300 text-emerald-800 hover:bg-emerald-50">
                <a href={siteConfig.whatsappHref} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-1.5 h-4 w-4 text-emerald-600" />
                  {t.whatsapp}
                </a>
              </Button>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
