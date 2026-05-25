"use client";

import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, CheckCircle2, GraduationCap, Languages, Sparkles } from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";

export default function HomePage() {
  const { language } = useLanguage();
  const t = translate({
    bn: {
      brand: "KNLTC — Japan Education & Career Consultancy",
      headline: "জাপানে পড়াশোনা, কাজ ও ভবিষ্যৎ গড়ার সঠিক পথ",
      subtitle: "স্টুডেন্ট ভিসা, SSW/TITP, জাপানি ভাষা, স্কিল ট্রেইনিং, ডকুমেন্টেশন ও ইন্টারভিউ প্রস্তুতি—সবকিছুর জন্য এক জায়গায় KNLTC।",
      ctaConsult: "ফ্রি কনসাল্টেশন নিন",
      ctaWhatsApp: "হোয়াটসঅ্যাপে কথা বলুন",
      choosePath: "আপনার জাপান পথ বেছে নিন",
      supportSystem: "সম্পূর্ণ জাপান সাপোর্ট সিস্টেম",
      visaPrograms: "ভিসা প্রোগ্রাম",
      whyKnltc: "কেন KNLTC",
      finalTitle: "আজই আপনার জাপান যাত্রার পরিকল্পনা শুরু করুন",
      finalSubtitle: "স্টাডি, ওয়ার্ক, ভাষা ও ডকুমেন্টেশন—সবকিছুর জন্য পান একটি প্রফেশনাল গাইডেড সাপোর্ট সিস্টেম।",
      finalBtn: "এখনই যোগাযোগ করুন",
    },
    en: {
      brand: "KNLTC — Japan Education & Career Consultancy",
      headline: "The right path to study, work, and build your future in Japan",
      subtitle: "Student visa, SSW/TITP, Japanese language, skill training, documentation, and interview preparation—everything in one place at KNLTC.",
      ctaConsult: "Get Free Consultation",
      ctaWhatsApp: "Talk on WhatsApp",
      choosePath: "Choose Your Japan Path",
      supportSystem: "Complete Japan Support System",
      visaPrograms: "Visa Programs",
      whyKnltc: "Why KNLTC",
      finalTitle: "Start planning your Japan journey today",
      finalSubtitle: "Study, work, language, and documentation—get a professional guided support system in one place.",
      finalBtn: "Contact Us Now",
    },
    ja: {
      brand: "KNLTC — Japan Education & Career Consultancy",
      headline: "日本で学び、働き、未来を築くための正しい道",
      subtitle: "学生ビザ、SSW/TITP、日本語、技能トレーニング、書類準備、面接対策まで、KNLTCがワンストップで支援します。",
      ctaConsult: "無料相談を受ける",
      ctaWhatsApp: "WhatsAppで相談",
      choosePath: "日本への進路を選ぶ",
      supportSystem: "包括的な日本サポート",
      visaPrograms: "ビザプログラム",
      whyKnltc: "KNLTCが選ばれる理由",
      finalTitle: "今すぐ日本への計画を始めましょう",
      finalSubtitle: "留学・就職・語学・書類準備まで、プロによる一貫したサポートを提供します。",
      finalBtn: "今すぐお問い合わせ",
    },
  }, language);

  const paths = translate({
    bn: [
      { icon: GraduationCap, title: "জাপানে পড়াশোনা", text: "ভাষা স্কুল, বিশ্ববিদ্যালয় ভর্তি, স্টুডেন্ট ভিসা ও ধাপে ধাপে প্রস্তুতি।", href: "/study-in-japan" },
      { icon: BriefcaseBusiness, title: "জাপানে কাজ", text: "SSW, TITP, স্কিল ট্রেইনিং, ইন্টারভিউ ও জব-রেডি সাপোর্ট।", href: "/work-in-japan" },
      { icon: Languages, title: "জাপানি ভাষা", text: "N5/N4 ভিত্তি, JLPT/JFT প্রস্তুতি ও ব্যবহারিক জাপানি ভাষা।", href: "/japanese-language" },
    ],
    en: [
      { icon: GraduationCap, title: "Study in Japan", text: "Language school, university admission, student visa and step-by-step preparation.", href: "/study-in-japan" },
      { icon: BriefcaseBusiness, title: "Work in Japan", text: "SSW, TITP, skill training, interview and job-ready support.", href: "/work-in-japan" },
      { icon: Languages, title: "Japanese Language", text: "N5/N4 foundation, JLPT/JFT prep and practical communication.", href: "/japanese-language" },
    ],
    ja: [
      { icon: GraduationCap, title: "日本留学", text: "日本語学校、大学進学、学生ビザ、段階的な準備を支援。", href: "/study-in-japan" },
      { icon: BriefcaseBusiness, title: "日本就職", text: "SSW、TITP、技能訓練、面接対策、就職準備を支援。", href: "/work-in-japan" },
      { icon: Languages, title: "日本語", text: "N5/N4基礎、JLPT/JFT対策、実用会話まで対応。", href: "/japanese-language" },
    ],
  }, language);

  const supportItems = translate({ bn: ["ল্যাঙ্গুয়েজ প্রোগ্রাম", "স্কিল ট্রেইনিং", "ভিসা সাপোর্ট", "ইন্টারভিউ প্রিপারেশন", "জাপানিজ ভাষার বই", "ডকুমেন্টেশন সাপোর্ট", "আফটার অ্যারাইভাল সাপোর্ট"], en: ["Language Program", "Skill Training", "Visa Support", "Interview Preparation", "Japanese Language Books", "Documentation Support", "After Arrival Support"], ja: ["語学プログラム", "技能トレーニング", "ビザサポート", "面接対策", "日本語教材", "書類サポート", "渡航後サポート"] }, language);
  const visas = translate({ bn: ["Student Visa", "SSW", "TITP"], en: ["Student Visa", "SSW", "TITP"], ja: ["学生ビザ", "SSW", "TITP"] }, language);
  const why = translate({ bn: ["অভিজ্ঞ টিম ও প্রক্রিয়াভিত্তিক সাপোর্ট", "বাংলা-প্রথম কাউন্সেলিং ও স্বচ্ছ গাইডলাইন", "ভর্তি থেকে জাপানে পৌঁছানো পর্যন্ত ধারাবাহিক সহায়তা"], en: ["Experienced team with process-driven support", "Transparent guidance with multilingual counseling", "Continuous support from admission to arrival in Japan"], ja: ["経験豊富なチームによるプロセス支援", "多言語での透明なカウンセリング", "入学準備から渡航後まで継続支援"] }, language);

  return <main className="bg-gradient-to-b from-white via-red-50/20 to-green-50/30">
    <section className="section-padding">
      <div className="container-narrow rounded-3xl border border-red-100 bg-white/90 p-8 text-center shadow-xl md:p-12">
        <p className="text-sm font-semibold tracking-wide text-green-700">{t.brand}</p>
        <h1 className="mt-3 text-4xl font-extrabold leading-tight text-red-700 md:text-5xl">{t.headline}</h1>
        <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">{t.subtitle}</p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 font-semibold text-white transition duration-300 hover:-translate-y-1 hover:bg-red-700"><ArrowRight className="h-4 w-4" />{t.ctaConsult}</Link>
          <a href="https://wa.me/8801627442366" target="_blank" rel="noopener noreferrer" className="rounded-full border border-green-600 px-6 py-3 font-semibold text-green-700 transition duration-300 hover:-translate-y-1 hover:bg-green-50">{t.ctaWhatsApp}</a>
        </div>
      </div>
    </section>

    <section className="section-padding pt-0"><div className="container-narrow"><h2 className="text-3xl font-bold text-red-700">{t.choosePath}</h2><div className="mt-6 grid gap-5 md:grid-cols-3">{paths.map((item) => { const Icon = item.icon; return <Link key={item.title} href={item.href} className="group rounded-2xl border border-red-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"><Icon className="h-6 w-6 text-red-600 transition group-hover:text-green-700" /><h3 className="mt-4 text-xl font-bold">{item.title}</h3><p className="mt-2 text-sm text-muted-foreground">{item.text}</p></Link>; })}</div></div></section>

    <section className="section-padding pt-0"><div className="container-narrow"><h2 className="text-3xl font-bold text-red-700">{t.supportSystem}</h2><div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{supportItems.map((x) => <div key={x} className="rounded-xl border border-green-100 bg-green-50/60 p-4 font-medium transition duration-300 hover:-translate-y-1 hover:shadow-md"><CheckCircle2 className="mb-2 h-4 w-4 text-green-700" />{x}</div>)}</div></div></section>

    <section className="section-padding pt-0"><div className="container-narrow grid gap-5 lg:grid-cols-2"><div className="rounded-2xl border bg-white p-6 shadow-sm"><h2 className="text-2xl font-bold text-red-700">{t.visaPrograms}</h2><div className="mt-4 flex flex-wrap gap-3">{visas.map((item) => <div key={item} className="rounded-full bg-red-50 px-4 py-2 font-semibold text-red-700">{item}</div>)}</div></div><div className="rounded-2xl border bg-white p-6 shadow-sm"><h2 className="text-2xl font-bold text-red-700">{t.whyKnltc}</h2><ul className="mt-4 space-y-2 text-sm">{why.map((item, idx) => <li key={item} className="flex gap-2"><span className="text-green-700">{idx + 1}.</span><span>{item}</span></li>)}</ul></div></div></section>

    <section className="section-padding pt-0"><div className="container-narrow rounded-3xl bg-red-700 p-8 text-center text-white shadow-lg"><Sparkles className="mx-auto h-8 w-8 text-green-200" /><h2 className="mt-3 text-3xl font-bold">{t.finalTitle}</h2><p className="mx-auto mt-3 max-w-2xl text-white/90">{t.finalSubtitle}</p><Link href="/contact" className="mt-6 inline-block rounded-full bg-white px-6 py-3 font-semibold text-red-700 transition duration-300 hover:-translate-y-1 hover:bg-green-100">{t.finalBtn}</Link></div></section>
  </main>;
}
