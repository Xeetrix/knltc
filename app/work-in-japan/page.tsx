"use client";

import Link from "next/link";
import { BadgeDollarSign, BriefcaseBusiness, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";

export default function WorkInJapanPage() {
  const { language } = useLanguage();
  const t = translate(
    {
      bn: {
        title: "জাপানে ক্যারিয়ার গড়ার প্রিমিয়াম পথ",
        subtitle: "SSW/TITP প্রস্তুতি, সেক্টর নির্বাচন, ডকুমেন্টেশন ও ভিসা সহ সম্পূর্ণ ক্যারিয়ার সাপোর্ট।",
        compare: "SSW বনাম TITP",
        opportunities: "চলমান সুযোগ",
        sectors: "চাহিদাসম্পন্ন সেক্টর",
        timeline: "ক্যারিয়ার প্রসেস টাইমলাইন",
        salaryLabel: "সম্ভাব্য বেতন",
        finalTitle: "জাপানে কাজের প্রস্তুতি শুরু করুন",
        apply: "এখন আবেদন করুন",
        consult: "ফ্রি কনসাল্টেশন নিন",
      },
      en: {
        title: "Premium Career Pathway for Japan",
        subtitle: "Complete support for SSW/TITP preparation, sector selection, documentation, and visa processing.",
        compare: "SSW vs TITP",
        opportunities: "Current Opportunities",
        sectors: "High-demand sectors",
        timeline: "Career Process Timeline",
        salaryLabel: "Expected salary",
        finalTitle: "Start your work preparation",
        apply: "Apply now",
        consult: "Get consultation",
      },
      ja: {
        title: "日本就職のプレミアムキャリアパス",
        subtitle: "SSW/TITP準備、分野選定、書類準備、ビザ手続きまで一貫サポート。",
        compare: "SSWとTITP",
        opportunities: "現在の募集",
        sectors: "需要の高い分野",
        timeline: "キャリアプロセス",
        salaryLabel: "想定給与",
        finalTitle: "就職準備を始めましょう",
        apply: "今すぐ応募",
        consult: "無料相談",
      },
    },
    language,
  );

  const compareCards = translate(
    {
      bn: [
        { title: "SSW", c: "bg-red-50", items: ["N4/JFT-Basic", "স্কিল টেস্ট বাধ্যতামূলক", "দীর্ঘমেয়াদি ক্যারিয়ার ফোকাস"] },
        { title: "TITP", c: "bg-green-50", items: ["ট্রেইনি ভিত্তিক সুযোগ", "N5 লেভেল থাকলে সুবিধা", "SSW-তে যাওয়ার ভালো পথ"] },
      ],
      en: [
        { title: "SSW", c: "bg-red-50", items: ["N4/JFT-Basic", "Skill test", "Long-term career"] },
        { title: "TITP", c: "bg-green-50", items: ["Trainee track", "N5 helpful", "Good pathway to SSW"] },
      ],
      ja: [
        { title: "SSW", c: "bg-red-50", items: ["N4/JFT-Basic", "技能試験", "長期キャリア"] },
        { title: "TITP", c: "bg-green-50", items: ["研修生制度", "N5が有利", "SSWへの道"] },
      ],
    },
    language,
  );

  const opportunities = translate(
    {
      bn: [
        { t: "SSW Caregiver", e: "ভাষা + কেয়ারগিভিং প্রস্তুতি", s: "¥180k+" },
        { t: "SSW Agriculture", e: "N4/JFT + ফিটনেস", s: "¥170k+" },
        { t: "TITP Construction", e: "বেসিক ভাষা + ট্রেইনি প্রস্তুতি", s: "¥190k+" },
      ],
      en: [
        { t: "SSW Caregiver", e: "Language + caregiver prep", s: "¥180k+" },
        { t: "SSW Agriculture", e: "N4/JFT + fitness", s: "¥170k+" },
        { t: "TITP Construction", e: "Basic language + trainee prep", s: "¥190k+" },
      ],
      ja: [
        { t: "SSW 介護", e: "語学力＋介護準備", s: "¥180k+" },
        { t: "SSW 農業", e: "N4/JFT＋体力", s: "¥170k+" },
        { t: "TITP 建設", e: "基礎語学＋研修準備", s: "¥190k+" },
      ],
    },
    language,
  );

  const sectors = translate(
    {
      bn: ["কেয়ারগিভিং", "কনস্ট্রাকশন", "এগ্রিকালচার", "ফুড সার্ভিস", "ম্যানুফ্যাকচারিং", "অটোমোবাইল"],
      en: ["Caregiving", "Construction", "Agriculture", "Food service", "Manufacturing", "Automobile"],
      ja: ["介護", "建設", "農業", "外食", "製造", "自動車"],
    },
    language,
  );

  const timeline = translate(
    {
      bn: ["প্রোফাইল যাচাই", "ভাষা প্রস্তুতি", "স্কিল ট্রেইনিং", "ইন্টারভিউ ও ম্যাচিং", "ডকুমেন্টেশন", "ভিসা ও ডিপার্চার"],
      en: ["Profile review", "Language prep", "Skill training", "Interview & matching", "Documentation", "Visa & departure"],
      ja: ["プロフィール確認", "語学準備", "技能訓練", "面接・マッチング", "書類", "ビザ・渡航"],
    },
    language,
  );

  return (
    <main className="section-padding bg-[#fcfaf7]">
      <div className="container-narrow space-y-8">
        <section className="fade-up relative overflow-hidden rounded-3xl border border-red-100 bg-white p-8 shadow-xl md:p-10">
          <div className="absolute -top-10 right-0 h-40 w-40 rounded-full bg-red-200/40 blur-2xl" />
          <h1 className="relative text-3xl font-black text-red-700 md:text-4xl">{t.title}</h1>
          <p className="relative mt-3 text-zinc-700">{t.subtitle}</p>
        </section>

        <section>
          <h2 className="section-title fade-up">{t.compare}</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {compareCards.map((card, i) => (
              <div key={card.title} style={{ animationDelay: `${i * 100}ms` }} className={`fade-up card-lift rounded-2xl border border-red-100 p-5 ${card.c}`}>
                <h3 className="text-2xl font-black text-red-700">{card.title}</h3>
                <ul className="mt-3 space-y-2">
                  {card.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-700" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="section-title fade-up">{t.opportunities}</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {opportunities.map((opportunity, i) => (
              <div key={opportunity.t} className="fade-up card-lift rounded-2xl border bg-white p-5 shadow-sm" style={{ animationDelay: `${i * 70}ms` }}>
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-bold">{opportunity.t}</h3>
                  <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700">
                    {t.salaryLabel}: {opportunity.s}
                  </span>
                </div>
                <p className="mt-2 text-sm text-zinc-600">{opportunity.e}</p>
                <Link href="/contact" className="mt-4 inline-flex items-center gap-1 rounded-full bg-green-700 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-1">
                  <BadgeDollarSign className="h-4 w-4" />
                  {t.apply}
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="section-title fade-up">{t.sectors}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sectors.map((sector, i) => (
              <div key={sector} style={{ animationDelay: `${i * 60}ms` }} className="fade-up rounded-xl border border-green-100 bg-gradient-to-r from-white to-green-50 p-4 font-semibold text-zinc-700">
                <BriefcaseBusiness className="mb-2 h-4 w-4 text-red-600" />
                {sector}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="section-title fade-up">{t.timeline}</h2>
          <div className="mt-4 space-y-3">
            {timeline.map((step, i) => (
              <div key={step} className="timeline-step fade-up" style={{ animationDelay: `${i * 70}ms` }}>
                <span className="timeline-dot">{i + 1}</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="fade-up rounded-3xl bg-gradient-to-r from-red-700 to-green-700 p-8 text-center text-white">
          <h2 className="text-3xl font-bold">{t.finalTitle}</h2>
          <Link href="/contact" className="mt-5 inline-block rounded-full bg-white px-6 py-3 font-semibold text-red-700 transition hover:-translate-y-1">
            {t.consult}
          </Link>
        </section>
      </div>
    </main>
  );
}
