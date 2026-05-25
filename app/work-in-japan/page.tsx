"use client";

import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";

export default function WorkInJapanPage() {
  const { language } = useLanguage();
  const t = translate({
    bn: {
      title: "জাপানে কাজের সম্পূর্ণ গাইডলাইন",
      subtitle: "SSW, TITP, স্কিল ট্রেইনিং, ডকুমেন্টেশন ও ইন্টারভিউ প্রস্তুতির মাধ্যমে জাপানে কাজের জন্য শক্ত প্রস্তুতি নিন।",
      focus: "ফোকাসড সার্ভিস",
      current: "চলমান সুযোগসমূহ",
    },
    en: { title: "Complete Guideline to Work in Japan", subtitle: "Build a strong pathway to work in Japan through SSW, TITP, skill training, documentation, and interview preparation.", focus: "Focused Services", current: "Current Opportunities" },
    ja: { title: "日本就職の完全ガイド", subtitle: "SSW、TITP、技能トレーニング、書類準備、面接対策で日本就職への準備を整えます。", focus: "重点サポート", current: "現在の募集機会" },
  }, language);

  const focusItems = ["SSW", "TITP", "Skill Training", "Interview", "Documentation", "Current opportunities"];
  const sectors = ["SSW Agriculture", "SSW Caregiver", "TITP Construction", "TITP Automobile", "TITP Welding"];

  return <main className="section-padding bg-gradient-to-b from-white to-green-50/30"><div className="container-narrow space-y-8">
    <section className="rounded-2xl border bg-white p-8"><h1 className="text-3xl font-extrabold text-red-700">{t.title}</h1><p className="mt-3 text-muted-foreground">{t.subtitle}</p></section>
    <section><h2 className="text-2xl font-bold text-red-700">{t.focus}</h2><div className="mt-4 grid gap-4 md:grid-cols-2">{focusItems.map((item) => <div key={item} className="rounded-xl border border-green-100 bg-green-50/40 p-4 transition hover:-translate-y-1 hover:shadow-md">{item}</div>)}</div></section>
    <section className="rounded-2xl border bg-white p-6"><h2 className="text-2xl font-bold text-red-700">{t.current}</h2><div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{sectors.map((s) => <div key={s} className="rounded-lg border border-red-100 bg-red-50 p-3">{s}</div>)}</div></section>
  </div></main>;
}
