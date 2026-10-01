"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Calendar, User } from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";
import type { BlogPost } from "@/lib/cms";

interface Props {
  posts: BlogPost[];
}

export default function BlogListClient({ posts }: Props) {
  const { language } = useLanguage();

  const t = translate(
    {
      en: {
        badge: "Japan Education & Career Insights",
        title: "KNLTC Insights & Guidance Blog",
        desc: "Expert articles on Japanese universities, embassy interviews, SSW jobs, language exams, and life in Japan.",
        noPosts: "No blog posts available yet",
        checkBack: "Please check back soon for the latest guides and updates.",
        byAuthor: "By",
        readMore: "Read Full Article",
        uncategorized: "General Guidance",
      },
      bn: {
        badge: "জাপান শিক্ষা ও ক্যারিয়ার ব্লগ",
        title: "KNLTC গাইডেন্স ও ব্লগ পোর্টাল",
        desc: "জাপানে পড়াশোনা, এম্বাসি ইন্টারভিউ প্রস্তুতি, SSW জব ভিসা, ভাষা পরীক্ষা এবং জীবনযাপনের প্রয়োজনীয় গাইডলাইন।",
        noPosts: "এখনো কোনো ব্লগ পোস্ট পাওয়া যায়নি",
        checkBack: "নতুন আপডেট ও তথ্যের জন্য পরবর্তীতে আবার ভিজিট করুন।",
        byAuthor: "লেখক:",
        readMore: "সম্পূর্ণ পড়ুন",
        uncategorized: "সাধারণ গাইডলাইন",
      },
      ja: {
        badge: "日本留学・キャリア情報",
        title: "KNLTC 公式ガイダンスブログ",
        desc: "日本の大学進学、大使館面接対策、特定技能（SSW）、日本語試験、日本での生活に関するお役立ち情報。",
        noPosts: "記事はまだありません",
        checkBack: "新しい記事の更新をお待ちください。",
        byAuthor: "著者:",
        readMore: "記事を読む",
        uncategorized: "一般ガイド",
      },
    },
    language,
  );

  return (
    <section className="section-padding bg-gradient-to-b from-stone-50 via-white to-stone-50/50 min-h-[70vh]">
      <div className="container-narrow">
        <div className="mb-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-[#b91c1c]">
            <BookOpen className="h-3.5 w-3.5" />
            {t.badge}
          </span>
          <h1 className="mt-3 text-3xl font-extrabold text-foreground sm:text-4xl">{t.title}</h1>
          <p className="mt-2 text-base text-muted-foreground">{t.desc}</p>
        </div>

        {posts.length === 0 ? (
          <div className="rounded-2xl border bg-card p-10 text-center shadow-sm">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h2 className="mt-4 text-xl font-bold text-foreground">{t.noPosts}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t.checkBack}</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post.id}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-red-200"
              >
                {post.cover_image ? (
                  <div className="aspect-[16/9] w-full overflow-hidden bg-stone-100">
                    <img
                      src={post.cover_image}
                      alt={post.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                ) : null}

                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-semibold uppercase tracking-wider text-[#b91c1c]">
                      {post.categories?.name ?? t.uncategorized}
                    </span>
                    {post.publish_date || post.created_at ? (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.publish_date || post.created_at).toLocaleDateString()}
                      </span>
                    ) : null}
                  </div>

                  <Link href={`/blog/${post.slug}`} className="mt-2">
                    <h2 className="line-clamp-2 text-lg font-bold text-foreground transition group-hover:text-[#b91c1c]">
                      {post.title}
                    </h2>
                  </Link>

                  <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>

                  <div className="mt-auto pt-4 flex items-center justify-between border-t border-border/50 text-xs">
                    <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
                      <User className="h-3.5 w-3.5" />
                      {t.byAuthor} {post.author}
                    </span>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1 font-semibold text-[#b91c1c] transition hover:text-red-800"
                    >
                      {t.readMore}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
