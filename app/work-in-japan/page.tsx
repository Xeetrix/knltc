"use client";

import Link from "next/link";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";

export default function WorkInJapanPage() {
  const { language } = useLanguage();
  const t = translate({
    bn: {
      title: "জাপানে কাজের প্রস্তুতি ও ভিসা সাপোর্ট",
      subtitle: "SSW, TITP, স্কিল ট্রেইনিং, ইন্টারভিউ প্রিপারেশন, ডকুমেন্টেশন ও জাপানে পৌঁছানোর পর সাপোর্ট—সবকিছু এক জায়গায়।",
      compare: "SSW বনাম TITP",
      training: "স্কিল ট্রেইনিং",
      interview: "ইন্টারভিউ প্রিপারেশন",
      docs: "ডকুমেন্টেশন সাপোর্ট",
      opportunities: "চলমান সুযোগসমূহ",
      sectors: "ওয়ার্ক সেক্টরসমূহ",
      timeline: "প্রসেস টাইমলাইন",
      arrival: "আফটার অ্যারাইভাল সাপোর্ট",
      finalTitle: "জাপানে কাজের পথ শুরু করতে প্রস্তুত?",
      apply: "আবেদন করুন",
      consult: "ফ্রি কনসাল্টেশন নিন",
    },
    en: { title: "Work Preparation and Visa Support for Japan", subtitle: "SSW, TITP, skill training, interview preparation, documentation, and after-arrival support in one place.", compare: "SSW vs TITP", training: "Skill Training", interview: "Interview Preparation", docs: "Documentation Support", opportunities: "Current Opportunities", sectors: "Work Sectors", timeline: "Process Timeline", arrival: "After Arrival Support", finalTitle: "Ready to start your Japan work pathway?", apply: "Apply Now", consult: "Get Free Consultation" },
    ja: { title: "日本就職の準備とビザサポート", subtitle: "SSW、TITP、技能訓練、面接対策、書類準備、渡航後サポートまで一括対応。", compare: "SSWとTITPの比較", training: "技能トレーニング", interview: "面接対策", docs: "書類サポート", opportunities: "現在の募集機会", sectors: "就労分野", timeline: "プロセスタイムライン", arrival: "渡航後サポート", finalTitle: "日本就職の準備を始めませんか？", apply: "申し込む", consult: "無料相談を受ける" },
  }, language);

  const compare = translate({ bn: [{ k: "ভিসা টাইপ", ssw: "Specified Skilled Worker", titp: "Technical Intern Training" }, { k: "লক্ষ্য", ssw: "দক্ষ জনবল হিসেবে কাজ", titp: "প্রশিক্ষণভিত্তিক কাজের অভিজ্ঞতা" }, { k: "দক্ষতা", ssw: "স্কিল টেস্ট + ভাষা", titp: "প্রোগ্রাম ও প্রতিষ্ঠানের শর্ত" }], en: [{ k: "Visa Type", ssw: "Specified Skilled Worker", titp: "Technical Intern Training" }, { k: "Focus", ssw: "Skilled worker placement", titp: "Training-based practical pathway" }, { k: "Requirements", ssw: "Skill test + language", titp: "Program and institution criteria" }], ja: [{ k: "ビザ種別", ssw: "特定技能", titp: "技能実習" }, { k: "目的", ssw: "技能人材として就労", titp: "訓練中心の実務経験" }, { k: "要件", ssw: "技能試験＋語学", titp: "制度・受入機関の基準" }] }, language);
  const opportunities = translate({ bn: ["SSW Agriculture", "SSW Caregiver", "TITP Construction", "TITP Automobile", "TITP Welding"], en: ["SSW Agriculture", "SSW Caregiver", "TITP Construction", "TITP Automobile", "TITP Welding"], ja: ["SSW 農業", "SSW 介護", "TITP 建設", "TITP 自動車", "TITP 溶接"] }, language);
  const sectors = translate({ bn: ["কৃষি", "কেয়ারগিভার", "নির্মাণ", "অটোমোবাইল", "ওয়েল্ডিং", "ফ্যাক্টরি সাপোর্ট"], en: ["Agriculture", "Caregiver", "Construction", "Automobile", "Welding", "Factory Support"], ja: ["農業", "介護", "建設", "自動車", "溶接", "工場サポート"] }, language);
  const timeline = translate({ bn: ["ফ্রি কনসাল্টেশন", "যোগ্যতা যাচাই", "সেক্টর নির্বাচন", "স্কিল ট্রেইনিং", "ইন্টারভিউ প্রিপারেশন", "ডকুমেন্টেশন", "ভিসা প্রসেস", "আফটার অ্যারাইভাল সাপোর্ট"], en: ["Free consultation", "Eligibility review", "Sector selection", "Skill training", "Interview preparation", "Documentation", "Visa process", "After-arrival support"], ja: ["無料相談", "適性確認", "分野選定", "技能トレーニング", "面接対策", "書類準備", "ビザ手続き", "渡航後サポート"] }, language);

  return <main className="section-padding bg-gradient-to-b from-white via-red-50/20 to-green-50/20"><div className="container-narrow space-y-6">
    <section className="rounded-3xl border bg-white p-7 shadow-sm md:p-10"><h1 className="text-3xl font-extrabold text-red-700 md:text-4xl">{t.title}</h1><p className="mt-3 text-muted-foreground">{t.subtitle}</p></section>
    <section className="rounded-2xl border bg-white p-6"><h2 className="text-2xl font-bold text-red-700">{t.compare}</h2><div className="mt-4 overflow-hidden rounded-xl border"><div className="grid grid-cols-3 bg-red-50 p-3 font-semibold text-red-700"><div>{translate({bn:"বিষয়",en:"Topic",ja:"項目"},language)}</div><div>SSW</div><div>TITP</div></div>{compare.map((r) => <div key={r.k} className="grid grid-cols-3 border-t p-3 text-sm"><div className="font-medium">{r.k}</div><div>{r.ssw}</div><div>{r.titp}</div></div>)}</div></section>
    <section className="grid gap-4 md:grid-cols-3"><div className="rounded-xl border bg-white p-5"><h3 className="font-bold text-red-700">{t.training}</h3><p className="mt-2 text-sm text-muted-foreground">{translate({bn:"জব সেক্টরভিত্তিক স্কিল ডেভেলপমেন্ট পরিকল্পনা।",en:"Sector-focused skill development plan.",ja:"分野別の技能開発プラン。"},language)}</p></div><div className="rounded-xl border bg-white p-5"><h3 className="font-bold text-red-700">{t.interview}</h3><p className="mt-2 text-sm text-muted-foreground">{translate({bn:"মক ইন্টারভিউ ও প্রশ্নভিত্তিক প্রস্তুতি।",en:"Mock interviews with role-specific question prep.",ja:"模擬面接と職種別の質問対策。"},language)}</p></div><div className="rounded-xl border bg-white p-5"><h3 className="font-bold text-red-700">{t.docs}</h3><p className="mt-2 text-sm text-muted-foreground">{translate({bn:"চেকলিস্ট, ফাইল রিভিউ ও সাবমিশন গাইডলাইন।",en:"Checklist, file review, and submission guidance.",ja:"チェックリスト・書類確認・提出ガイダンス。"},language)}</p></div></section>
    <section><h2 className="text-2xl font-bold text-red-700">{t.opportunities}</h2><div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{opportunities.map((op) => <div key={op} className="rounded-xl border bg-white p-5 transition duration-300 hover:-translate-y-1 hover:shadow-md"><h3 className="font-bold">{op}</h3><p className="mt-2 text-sm text-muted-foreground">{translate({bn:"যোগ্যতা: প্রোগ্রামভেদে নির্ধারিত",en:"Eligibility: Depends on program criteria",ja:"応募条件: プログラム基準による"},language)}</p><p className="mt-1 text-sm text-muted-foreground">{translate({bn:"বেতন: প্রতিষ্ঠান ও সেক্টরভেদে ভিন্ন",en:"Salary: Varies by sector and employer",ja:"給与: 分野・受入先により異なる"},language)}</p><Link href="/contact" className="mt-4 inline-block rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700">{t.apply}</Link></div>)}</div></section>
    <section><h2 className="text-2xl font-bold text-red-700">{t.sectors}</h2><div className="mt-4 flex flex-wrap gap-2">{sectors.map((x) => <span key={x} className="rounded-full bg-red-50 px-4 py-2 text-sm font-medium text-red-700">{x}</span>)}</div></section>
    <section><h2 className="text-2xl font-bold text-red-700">{t.timeline}</h2><div className="mt-4 grid gap-3 md:grid-cols-2">{timeline.map((x, i) => <div key={x} className="rounded-xl border bg-white p-4"><span className="mr-1 font-bold text-green-700">{i + 1}.</span>{x}</div>)}</div></section>
    <section className="rounded-2xl border bg-white p-6"><h2 className="text-2xl font-bold text-red-700">{t.arrival}</h2><p className="mt-3 text-muted-foreground">{translate({bn:"জাপানে পৌঁছানোর পর প্রয়োজনীয় প্রাথমিক সেটআপ, সাংস্কৃতিক অভিযোজন ও গাইডলাইন সাপোর্ট দেওয়া হয়।",en:"Post-arrival support includes initial setup, cultural orientation, and practical guidance.",ja:"渡航後は初期手続き、生活オリエンテーション、実務ガイダンスを提供します。"},language)}</p></section>
    <section className="rounded-3xl bg-red-700 p-8 text-center text-white"><h2 className="text-3xl font-bold">{t.finalTitle}</h2><Link href="/contact" className="mt-5 inline-block rounded-full bg-white px-6 py-3 font-semibold text-red-700 transition duration-300 hover:-translate-y-1 hover:bg-green-100">{t.consult}</Link></section>
  </div></main>;
}
