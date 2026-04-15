"use client";

import { ShieldCheck, Users, Award, Clock, BookOpenCheck, MessageSquareHeart } from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";

const TrustSection = () => {
  const { language } = useLanguage();
  const t = translate(
    {
      en: {
        title: "Why Students & Job Seekers Trust KNLTC",
        desc: "Practical, transparent, and supportive guidance for your Japan goal.",
        cards: [
          { icon: ShieldCheck, title: "Transparent Process", desc: "No hidden steps, no confusion — clear milestones from day one." },
          { icon: Users, title: "Bangladesh-Focused Guidance", desc: "Advice tailored for Bangladeshi applicants and families." },
          { icon: Award, title: "Career + Visa Preparation", desc: "Language, interview, and visa support in one complete pathway." },
          { icon: Clock, title: "Fast Response Team", desc: "Get timely updates so you always know your next step." },
          { icon: BookOpenCheck, title: "Structured Language Training", desc: "Stepwise Japanese training aligned with your target path." },
          { icon: MessageSquareHeart, title: "Ongoing Support", desc: "We stay with you before departure and after arrival." },
        ],
      },
      bn: {
        title: "শিক্ষার্থী ও চাকরি প্রার্থীরা কেন KNLTC-কে বিশ্বাস করে",
        desc: "জাপান লক্ষ্য পূরণে বাস্তবধর্মী, স্বচ্ছ এবং সহায়ক গাইডলাইন।",
        cards: [
          { icon: ShieldCheck, title: "স্বচ্ছ প্রসেস", desc: "গোপন কিছু নয় — শুরু থেকেই পরিষ্কার ধাপ ও পরিকল্পনা।" },
          { icon: Users, title: "বাংলাদেশ-কেন্দ্রিক গাইডলাইন", desc: "বাংলাদেশি আবেদনকারী ও পরিবারের প্রয়োজন অনুযায়ী পরামর্শ।" },
          { icon: Award, title: "ক্যারিয়ার + ভিসা প্রস্তুতি", desc: "ভাষা, ইন্টারভিউ ও ভিসা—একসাথে পূর্ণ প্রস্তুতি।" },
          { icon: Clock, title: "দ্রুত সাপোর্ট টিম", desc: "সময়মতো আপডেট, যাতে পরবর্তী ধাপ নিয়ে দ্বিধা না থাকে।" },
          { icon: BookOpenCheck, title: "স্ট্রাকচার্ড ভাষা প্রশিক্ষণ", desc: "আপনার টার্গেট অনুযায়ী ধাপে ধাপে জাপানি ভাষা শেখানো।" },
          { icon: MessageSquareHeart, title: "চলমান সহায়তা", desc: "যাত্রার আগে ও জাপানে পৌঁছানোর পরও সাপোর্ট।" },
        ],
      },
      ja: {
        title: "なぜKNLTCが選ばれるのか",
        desc: "日本を目指す方のための、実践的で透明性の高いサポート。",
        cards: [
          { icon: ShieldCheck, title: "透明なプロセス", desc: "最初から各ステップを明確にご案内します。" },
          { icon: Users, title: "バングラデシュ向け支援", desc: "現地事情に合わせた実践的なアドバイス。" },
          { icon: Award, title: "就職＋ビザ準備", desc: "語学・面接・ビザを一体でサポート。" },
          { icon: Clock, title: "迅速な対応", desc: "進捗をタイムリーに共有し、迷いを減らします。" },
          { icon: BookOpenCheck, title: "体系的な語学研修", desc: "目標に合わせた段階的な日本語トレーニング。" },
          { icon: MessageSquareHeart, title: "継続サポート", desc: "渡航前から来日後まで伴走します。" },
        ],
      },
    },
    language,
  );

  return (
    <section className="section-padding bg-surface">
      <div className="container-narrow">
        <div className="mb-10 text-center sm:mb-12">
          <h2 className="mb-4 text-2xl font-extrabold text-foreground sm:text-3xl md:text-4xl">{t.title}</h2>
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base">{t.desc}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {t.cards.map((card) => (
            <div key={card.title} className="rounded-xl border bg-card p-5 shadow-sm sm:p-6">
              <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-2.5">
                <card.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mb-2 text-base font-bold text-foreground sm:text-lg">{card.title}</h3>
              <p className="text-sm text-muted-foreground">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
