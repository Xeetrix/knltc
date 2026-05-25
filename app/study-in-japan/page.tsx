"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";

export default function StudyInJapanPage() {
  const { language } = useLanguage();
  const t = translate({
    bn: {
      title: "জাপানে পড়াশোনার সম্পূর্ণ গাইডলাইন",
      subtitle: "ভাষা স্কুল, বিশ্ববিদ্যালয় ভর্তি, স্টুডেন্ট ভিসা, ডকুমেন্টেশন, ইন্টারভিউ প্রস্তুতি ও জাপানে পৌঁছানোর পর গাইডলাইন—সবকিছু এক জায়গায়।",
      why: "কেন জাপানে পড়াশোনা",
      path: "স্টাডি পাথওয়ে",
      visaSupport: "স্টুডেন্ট ভিসা সাপোর্ট",
      positioningTitle: "জাপান ইউনিভার্সিটি এডমিশন গাইডেন্সে KNLTC",
      positioningText: "KNLTC জাপানের শিক্ষা প্রতিষ্ঠানগুলোর সাথে কাজের সুযোগ তৈরি করছে এবং শিক্ষার্থীদের জন্য নির্ভরযোগ্য admission guidance দেওয়ার লক্ষ্য নিয়ে কাজ করছে।",
      timeline: "প্রসেস টাইমলাইন",
      faq: "প্রশ্নোত্তর",
      finalTitle: "জাপানে পড়াশোনার পরিকল্পনা শুরু করতে চান?",
      consult: "ফ্রি কনসাল্টেশন নিন",
      whatsapp: "হোয়াটসঅ্যাপে কথা বলুন",
    },
    en: {
      title: "Complete Guideline to Study in Japan",
      subtitle: "Language school, university admission, student visa, documentation, interview prep, and post-arrival guidance in one place.",
      why: "Why Study in Japan",
      path: "Study Pathways",
      visaSupport: "Student Visa Support",
      positioningTitle: "KNLTC in Japan University Admission Guidance",
      positioningText: "KNLTC is creating opportunities to work with Japanese educational institutions and aims to provide reliable admission guidance for students.",
      timeline: "Process Timeline",
      faq: "FAQ",
      finalTitle: "Ready to start your Japan study plan?",
      consult: "Get Free Consultation",
      whatsapp: "Talk on WhatsApp",
    },
    ja: {
      title: "日本留学の完全ガイドライン",
      subtitle: "日本語学校、大学進学、学生ビザ、書類準備、面接対策、渡航後ガイダンスまで一括サポート。",
      why: "なぜ日本で学ぶのか",
      path: "留学パスウェイ",
      visaSupport: "学生ビザサポート",
      positioningTitle: "日本の進学ガイダンスにおけるKNLTC",
      positioningText: "KNLTCは日本の教育機関との連携機会を広げ、学生に信頼できる入学ガイダンスを提供することを目指しています。",
      timeline: "プロセスタイムライン",
      faq: "よくある質問",
      finalTitle: "日本留学の準備を始めませんか？",
      consult: "無料相談を受ける",
      whatsapp: "WhatsAppで相談",
    },
  }, language);

  const why = translate({ bn: ["উন্নত শিক্ষা ব্যবস্থা", "নিরাপদ পরিবেশ", "ভবিষ্যৎ ক্যারিয়ার সুযোগ", "ভাষা শেখার মাধ্যমে দীর্ঘমেয়াদি সম্ভাবনা"], en: ["Advanced education system", "Safe environment", "Future career opportunities", "Long-term opportunities through language"], ja: ["高度な教育制度", "安全な環境", "将来のキャリア機会", "語学習得による長期的な可能性"] }, language);
  const pathways = translate({ bn: ["Japanese Language School", "University Admission", "Vocational / Senmon School", "Higher Study Pathway"], en: ["Japanese Language School", "University Admission", "Vocational / Senmon School", "Higher Study Pathway"], ja: ["日本語学校", "大学進学", "専門学校", "進学発展ルート"] }, language);
  const checklist = translate({ bn: ["যোগ্যতা যাচাই", "স্কুল/প্রোগ্রাম নির্বাচন", "আবেদন ফাইল প্রস্তুতি", "ফাইন্যান্সিয়াল ডকুমেন্ট গাইডলাইন", "ইন্টারভিউ প্রস্তুতি", "ভিসা প্রসেস গাইডলাইন", "প্রি-ডিপার্চার সাপোর্ট"], en: ["Eligibility review", "School/program selection", "Application file preparation", "Financial document guidance", "Interview preparation", "Visa process guidance", "Pre-departure support"], ja: ["適性確認", "学校・プログラム選定", "申請書類作成", "資金書類ガイダンス", "面接対策", "ビザ手続きガイド", "渡航前サポート"] }, language);
  const timeline = translate({ bn: ["ফ্রি কনসাল্টেশন", "যোগ্যতা যাচাই", "স্কুল/প্রোগ্রাম নির্বাচন", "আবেদন ও ডকুমেন্টেশন", "ইন্টারভিউ প্রস্তুতি", "ভিসা প্রসেস", "প্রি-ডিপার্চার", "জাপানে পৌঁছানোর পর সাপোর্ট"], en: ["Free consultation", "Eligibility review", "School/program selection", "Application & documentation", "Interview preparation", "Visa processing", "Pre-departure", "After-arrival support in Japan"], ja: ["無料相談", "適性確認", "学校・プログラム選定", "申請・書類準備", "面接対策", "ビザ手続き", "渡航前準備", "渡航後サポート"] }, language);
  const faqs = translate({ bn: ["ভাষা স্কুল ও বিশ্ববিদ্যালয়ের মধ্যে কোনটি আমার জন্য ভালো?", "জাপানি ভাষা না জানলে কি আবেদন করা যায়?", "ফাইল প্রস্তুতি ও ফাইন্যান্সিয়াল ডকুমেন্টে কীভাবে সহায়তা পাব?", "ইন্টারভিউ প্রস্তুতির জন্য কী ধরনের গাইডলাইন দেওয়া হয়?"], en: ["Which is better for me: language school or university?", "Can I apply without Japanese language proficiency?", "How will I get support for file and financial documents?", "What type of interview preparation is provided?"], ja: ["語学学校と大学進学はどちらが適していますか？", "日本語力がなくても申請できますか？", "書類・資金証明の準備はどう支援されますか？", "面接対策はどのように行われますか？"] }, language);

  return <main className="section-padding bg-gradient-to-b from-white via-red-50/20 to-green-50/20"><div className="container-narrow space-y-6">
    <section className="rounded-3xl border bg-white p-7 shadow-sm md:p-10"><h1 className="text-3xl font-extrabold text-red-700 md:text-4xl">{t.title}</h1><p className="mt-3 text-muted-foreground">{t.subtitle}</p></section>
    <section><h2 className="text-2xl font-bold text-red-700">{t.why}</h2><div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{why.map((item) => <div key={item} className="rounded-xl border bg-white p-4 transition duration-300 hover:-translate-y-1 hover:shadow-md">{item}</div>)}</div></section>
    <section><h2 className="text-2xl font-bold text-red-700">{t.path}</h2><div className="mt-4 grid gap-4 md:grid-cols-2">{pathways.map((item) => <div key={item} className="rounded-xl border border-green-100 bg-green-50/50 p-4 font-medium transition duration-300 hover:-translate-y-1">{item}</div>)}</div></section>
    <section className="rounded-2xl border bg-white p-6"><h2 className="text-2xl font-bold text-red-700">{t.visaSupport}</h2><div className="mt-4 grid gap-3 md:grid-cols-2">{checklist.map((item) => <div key={item} className="flex items-start gap-2 rounded-lg bg-red-50 p-3"><CheckCircle2 className="mt-0.5 h-4 w-4 text-green-700" />{item}</div>)}</div></section>
    <section className="rounded-2xl border bg-white p-6"><h2 className="text-2xl font-bold text-red-700">{t.positioningTitle}</h2><p className="mt-3 leading-relaxed text-muted-foreground">{t.positioningText}</p></section>
    <section><h2 className="text-2xl font-bold text-red-700">{t.timeline}</h2><div className="mt-4 grid gap-3 md:grid-cols-2">{timeline.map((step, i) => <div key={step} className="rounded-xl border bg-white p-4"><span className="mr-1 font-bold text-green-700">{i + 1}.</span>{step}</div>)}</div></section>
    <section><h2 className="text-2xl font-bold text-red-700">{t.faq}</h2><div className="mt-4 space-y-3">{faqs.map((q) => <div key={q} className="rounded-xl border bg-white p-4">{q}</div>)}</div></section>
    <section className="rounded-3xl bg-red-700 p-8 text-center text-white"><h2 className="text-3xl font-bold">{t.finalTitle}</h2><div className="mt-5 flex flex-wrap justify-center gap-3"><Link href="/contact" className="rounded-full bg-white px-5 py-2.5 font-semibold text-red-700 transition duration-300 hover:-translate-y-1 hover:bg-green-100">{t.consult}</Link><a href="https://wa.me/8801627442366" target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/60 px-5 py-2.5 font-semibold transition duration-300 hover:-translate-y-1 hover:bg-white/10">{t.whatsapp}</a></div></section>
  </div></main>;
}
