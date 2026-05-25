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
      subtitle: "ভাষা স্কুল, বিশ্ববিদ্যালয় ভর্তি, স্টুডেন্ট ভিসা, ডকুমেন্টেশন, ইন্টারভিউ প্রস্তুতি ও জাপানে যাওয়ার আগে প্রয়োজনীয় প্রস্তুতি—সবকিছুতে KNLTC পাশে আছে।",
      why: "কেন জাপানে পড়াশোনা?",
      paths: "জাপানে পড়াশোনার পথসমূহ",
      support: "স্টুডেন্ট ভিসা সাপোর্ট",
      supportText: "KNLTC শিক্ষার্থীদের জন্য স্কুল/প্রোগ্রাম নির্বাচন, আবেদন, ডকুমেন্টেশন, ইন্টারভিউ প্রস্তুতি ও ভিসা প্রসেসে ধাপে ধাপে সহায়তা করে।",
      uni: "জাপানের শিক্ষা প্রতিষ্ঠানের সাথে সরাসরি কাজের লক্ষ্য",
      uniText: "আমরা জাপানের শিক্ষা প্রতিষ্ঠানগুলোর সাথে কাজের সুযোগ তৈরি করছি এবং শিক্ষার্থীদের জন্য নির্ভরযোগ্য admission guidance দেওয়ার লক্ষ্য নিয়ে কাজ করছি।",
      docs: "প্রয়োজনীয় ডকুমেন্ট",
      timeline: "জাপানে পড়াশোনার প্রস্তুতি যেভাবে হবে",
      faq: "সাধারণ জিজ্ঞাসা",
      cta: "জাপানে পড়াশোনার পরিকল্পনা করছেন?",
      cta1: "ফ্রি কনসাল্টেশন নিন",
      cta2: "হোয়াটসঅ্যাপে কথা বলুন",
    },
    en: { title: "Complete Guideline to Study in Japan", subtitle: "KNLTC supports language school, university admission, student visa, documentation, interview prep, and pre-departure readiness.", why: "Why Study in Japan?", paths: "Study Pathways", support: "Student Visa Support", supportText: "KNLTC provides step-by-step help in school/program selection, application, documentation, interview prep, and visa processing.", uni: "Goal to work with Japanese education institutions", uniText: "We are creating opportunities to collaborate with Japanese institutions and aiming to provide reliable admission guidance for students.", docs: "Required Documents", timeline: "Preparation Timeline", faq: "Frequently Asked Questions", cta: "Planning to study in Japan?", cta1: "Get Free Consultation", cta2: "Talk on WhatsApp" },
    ja: { title: "日本留学の完全ガイド", subtitle: "日本語学校、大学進学、学生ビザ、書類準備、面接対策、渡航前準備までKNLTCがサポートします。", why: "なぜ日本で学ぶのか", paths: "留学ルート", support: "学生ビザサポート", supportText: "学校・プログラム選択から申請、書類、面接、ビザ手続きまで段階的に支援します。", uni: "日本の教育機関との連携目標", uniText: "日本の教育機関と連携する機会を作り、信頼できる入学ガイダンスを提供することを目指しています。", docs: "必要書類", timeline: "準備タイムライン", faq: "よくある質問", cta: "日本留学を計画していますか？", cta1: "無料相談", cta2: "WhatsAppで相談" },
  }, language);

  const whyItems = translate({ bn: ["উন্নত শিক্ষা ব্যবস্থা", "নিরাপদ ও শৃঙ্খলাপূর্ণ পরিবেশ", "পড়াশোনার পাশাপাশি ভবিষ্যৎ ক্যারিয়ার সুযোগ", "ভাষা শেখার মাধ্যমে দীর্ঘমেয়াদি সম্ভাবনা", "আন্তর্জাতিক মানের শিক্ষা ও জীবনযাপন"], en: ["Advanced education system", "Safe and disciplined environment", "Future career opportunities", "Long-term potential through language skills", "International-standard education and lifestyle"], ja: ["高度な教育制度", "安全で規律ある環境", "学びながら将来のキャリア機会", "語学力による長期的な可能性", "国際水準の教育と生活"], }, language);
  const pathways = ["Japanese Language School", "University Admission", "Vocational / Senmon School", "Higher Study Pathway"];
  const checklist = ["যোগ্যতা যাচাই", "স্কুল/প্রোগ্রাম গাইডলাইন", "আবেদন ফাইল প্রস্তুতি", "ব্যাংক/আর্থিক ডকুমেন্ট গাইডলাইন", "ইন্টারভিউ প্রস্তুতি", "ভিসা প্রসেস গাইডলাইন", "প্রি-ডিপার্চার সাপোর্ট"];
  const docs = ["পাসপোর্ট", "শিক্ষাগত সার্টিফিকেট", "মার্কশিট", "ছবি", "ব্যাংক/ফাইন্যান্সিয়াল ডকুমেন্ট", "স্পন্সর ডকুমেন্ট", "স্টেটমেন্ট অফ পারপাস / প্রয়োজনীয় ফাইল", "ভাষা শেখার প্রমাণপত্র যদি থাকে"];
  const steps = ["ফ্রি কনসাল্টেশন", "যোগ্যতা যাচাই", "স্কুল/প্রোগ্রাম নির্বাচন", "আবেদন ও ডকুমেন্টেশন", "ইন্টারভিউ প্রস্তুতি", "ভিসা প্রসেস", "প্রি-ডিপার্চার গাইডলাইন", "জাপানে পৌঁছানোর পর সাপোর্ট"];
  const faqs = ["জাপানে পড়তে যেতে কি জাপানি ভাষা লাগে?", "IELTS লাগে কি?", "কত সময় লাগে?", "কত খরচ হতে পারে?", "পড়াশোনার পরে কাজের সুযোগ আছে কি?"];

  return <main className="section-padding bg-gradient-to-b from-white via-red-50/30 to-green-50/30"><div className="container-narrow space-y-8">
    <section className="rounded-2xl border bg-white p-8 shadow-sm"><h1 className="text-3xl font-extrabold text-red-700">{t.title}</h1><p className="mt-3 text-muted-foreground">{t.subtitle}</p></section>
    <section><h2 className="text-2xl font-bold text-red-700">{t.why}</h2><div className="mt-4 grid gap-4 md:grid-cols-3">{whyItems.map((item) => <div key={item} className="rounded-xl border bg-white p-4 transition hover:-translate-y-1 hover:shadow-md">{item}</div>)}</div></section>
    <section><h2 className="text-2xl font-bold text-red-700">{t.paths}</h2><div className="mt-4 grid gap-4 md:grid-cols-2">{pathways.map((item) => <div key={item} className="rounded-xl border border-green-100 bg-green-50/40 p-4">{item}</div>)}</div></section>
    <section className="rounded-2xl border bg-white p-6"><h2 className="text-2xl font-bold text-red-700">{t.support}</h2><p className="mt-2 text-muted-foreground">{t.supportText}</p><div className="mt-4 grid gap-3 md:grid-cols-2">{checklist.map((item) => <div key={item} className="flex items-start gap-2 rounded-lg bg-red-50 p-3"><CheckCircle2 className="mt-0.5 h-4 w-4 text-green-700" />{item}</div>)}</div></section>
    <section className="rounded-2xl border bg-white p-6"><h2 className="text-2xl font-bold text-red-700">{t.uni}</h2><p className="mt-2 text-muted-foreground">{t.uniText}</p></section>
    <section><h2 className="text-2xl font-bold text-red-700">{t.docs}</h2><div className="mt-4 grid gap-3 md:grid-cols-2">{docs.map((item) => <div key={item} className="rounded-lg border bg-white p-3">{item}</div>)}</div></section>
    <section><h2 className="text-2xl font-bold text-red-700">{t.timeline}</h2><div className="mt-4 grid gap-3 md:grid-cols-2">{steps.map((step, idx) => <div key={step} className="rounded-xl border bg-white p-4"><span className="font-bold text-green-700">{idx + 1}.</span> {step}</div>)}</div></section>
    <section><h2 className="text-2xl font-bold text-red-700">{t.faq}</h2><div className="mt-4 space-y-3">{faqs.map((item) => <div key={item} className="rounded-lg border bg-white p-4">{item}</div>)}</div></section>
    <section className="rounded-2xl bg-red-700 p-7 text-center text-white"><h2 className="text-3xl font-bold">{t.cta}</h2><div className="mt-5 flex flex-wrap items-center justify-center gap-3"><Link className="rounded-full bg-white px-5 py-2 font-semibold text-red-700 transition hover:bg-green-100" href="/contact">{t.cta1}</Link><a className="rounded-full border border-white/50 px-5 py-2 font-semibold transition hover:bg-white/10" href="https://wa.me/8801627442366" target="_blank" rel="noopener noreferrer">{t.cta2}</a></div></section>
  </div></main>;
}
