"use client";

import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  GraduationCap,
  Languages,
  Sparkles,
  TicketCheck,
} from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";

export default function HomePage() {
  const { language } = useLanguage();

  const t = translate(
    {
      bn: {
        brand: "KNLTC — Japan Education & Career Consultancy",
        headline: "জাপানে পড়াশোনা, কাজ ও ভবিষ্যৎ গড়ার সঠিক পথ",
        subtitle:
          "স্টুডেন্ট ভিসা, SSW/TITP, জাপানি ভাষা, স্কিল ট্রেইনিং, ডকুমেন্টেশন ও ইন্টারভিউ প্রস্তুতি—সবকিছুর জন্য এক জায়গায় KNLTC।",
        ctaConsult: "ফ্রি কনসাল্টেশন নিন",
        ctaWhatsApp: "হোয়াটসঅ্যাপে কথা বলুন",
        choosePath: "আপনার জাপান পথ বেছে নিন",
        supportTitle: "KNLTC কী কী সাপোর্ট দেয়?",
        visaPrograms: "ভিসা প্রোগ্রামসমূহ",
        whyKnltc: "কেন KNLTC?",
        finalTitle: "আজই আপনার জাপান যাত্রা শুরু করুন",
        finalSubtitle: "সঠিক পরিকল্পনা, সঠিক প্রস্তুতি এবং নির্ভরযোগ্য সাপোর্ট—সবকিছু একসাথে শুরু করুন KNLTC-এর সাথে।",
      },
      en: {
        brand: "KNLTC — Japan Education & Career Consultancy",
        headline: "The right path to study, work, and build your future in Japan",
        subtitle:
          "Student visa, SSW/TITP, Japanese language, skill training, documentation, and interview preparation—everything in one place at KNLTC.",
        ctaConsult: "Get Free Consultation",
        ctaWhatsApp: "Talk on WhatsApp",
        choosePath: "Choose Your Japan Path",
        supportTitle: "What support does KNLTC provide?",
        visaPrograms: "Visa Programs",
        whyKnltc: "Why KNLTC?",
        finalTitle: "Start your Japan journey today",
        finalSubtitle: "Begin with proper planning, strong preparation, and trusted guidance from KNLTC.",
      },
      ja: {
        brand: "KNLTC — Japan Education & Career Consultancy",
        headline: "日本で学び、働き、未来を築くための正しい道",
        subtitle:
          "学生ビザ、SSW/TITP、日本語、技能トレーニング、書類準備、面接対策まで、KNLTCがワンストップで支援します。",
        ctaConsult: "無料相談を受ける",
        ctaWhatsApp: "WhatsAppで相談",
        choosePath: "日本への進路を選ぶ",
        supportTitle: "KNLTCのサポート内容",
        visaPrograms: "ビザプログラム",
        whyKnltc: "KNLTCが選ばれる理由",
        finalTitle: "今すぐ日本への一歩を始めましょう",
        finalSubtitle: "正しい計画、十分な準備、信頼できるサポートをKNLTCで。",
      },
    },
    language,
  );

  const paths = translate({ bn: [{ icon: GraduationCap, title: "জাপানে পড়াশোনা", href: "/study-in-japan" }, { icon: BriefcaseBusiness, title: "জাপানে কাজ", href: "/work-in-japan" }, { icon: Languages, title: "জাপানি ভাষা", href: "/japanese-language" }], en: [{ icon: GraduationCap, title: "Study in Japan", href: "/study-in-japan" }, { icon: BriefcaseBusiness, title: "Work in Japan", href: "/work-in-japan" }, { icon: Languages, title: "Japanese Language", href: "/japanese-language" }], ja: [{ icon: GraduationCap, title: "日本留学", href: "/study-in-japan" }, { icon: BriefcaseBusiness, title: "日本就職", href: "/work-in-japan" }, { icon: Languages, title: "日本語", href: "/japanese-language" }] }, language);
  const supportItems = translate({ bn: ["ল্যাঙ্গুয়েজ প্রোগ্রাম", "স্কিল ট্রেইনিং", "স্টুডেন্ট ও জব ভিসা সাপোর্ট", "ইন্টারভিউ প্রিপারেশন", "ডকুমেন্টেশন সাপোর্ট", "জাপানিজ ভাষার বই", "আফটার অ্যারাইভাল সাপোর্ট"], en: ["Language program", "Skill training", "Student and work visa support", "Interview preparation", "Documentation support", "Japanese language books", "After-arrival support"], ja: ["語学プログラム", "技能トレーニング", "学生・就労ビザ支援", "面接対策", "書類サポート", "日本語教材", "渡航後サポート"] }, language);
  const visaItems = translate({ bn: ["স্টুডেন্ট ভিসা", "SSW ভিসা", "TITP প্রোগ্রাম"], en: ["Student Visa", "SSW Visa", "TITP Program"], ja: ["学生ビザ", "SSWビザ", "TITPプログラム"] }, language);
  const whyItems = translate({ bn: ["জাপান-কেন্দ্রিক গাইডেন্স", "ভাষা + স্কিল + ভিসা ইকোসিস্টেম", "ডকুমেন্টেশন ও ইন্টারভিউ সাপোর্ট", "জাপানে পৌঁছানোর পরও সম্পর্কভিত্তিক সাপোর্ট"], en: ["Japan-focused guidance", "Language + Skill + Visa ecosystem", "Documentation and interview support", "After-arrival relationship and support"], ja: ["日本特化のガイダンス", "語学＋技能＋ビザの一体型支援", "書類・面接サポート", "渡航後も続く伴走サポート"] }, language);

  return (
    <main className="bg-gradient-to-b from-white via-red-50/30 to-green-50/40">
      <section className="section-padding">
        <div className="container-narrow fade-up rounded-3xl border border-red-100 bg-white/90 p-8 text-center shadow-xl md:p-12">
          <p className="text-sm font-semibold tracking-wide text-green-700">{t.brand}</p>
          <h1 className="mt-3 text-balance-safe text-4xl font-extrabold leading-tight text-red-700 md:text-5xl">{t.headline}</h1>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">{t.subtitle}</p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link href="/contact" className="btn-premium-red inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold text-white"><ArrowRight className="h-4 w-4" />{t.ctaConsult}</Link>
            <a href="https://wa.me/8801627442366" target="_blank" rel="noopener noreferrer" className="btn-premium-green rounded-full border px-6 py-3 font-semibold">{t.ctaWhatsApp}</a>
          </div>
        </div>
      </section>

      <section className="section-padding pt-0"><div className="container-narrow"><h2 className="section-title fade-up">{t.choosePath}</h2><div className="mt-6 grid gap-5 md:grid-cols-3">{paths.map((item, i) => { const Icon = item.icon; return <Link key={item.title} href={item.href} className="fade-up card-lift rounded-2xl border border-red-100 bg-white p-6 shadow-sm" style={{ animationDelay: `${i * 90}ms` }}><Icon className="h-7 w-7 text-red-600" /><h3 className="mt-4 text-xl font-bold">{item.title}</h3></Link>; })}</div></div></section>

      <section className="section-padding pt-0"><div className="container-narrow"><h2 className="section-title fade-up">{t.supportTitle}</h2><div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{supportItems.map((x, i) => <div key={x} className="fade-up card-lift rounded-xl border border-green-100 bg-green-50/60 p-4 font-medium" style={{ animationDelay: `${i * 70}ms` }}><CheckCircle2 className="mb-2 h-4 w-4 text-green-700" />{x}</div>)}</div></div></section>

      <section className="section-padding pt-0"><div className="container-narrow grid gap-5 lg:grid-cols-2"><div className="fade-up rounded-2xl border bg-white p-6 shadow-sm"><h2 className="section-title text-2xl">{t.visaPrograms}</h2><div className="mt-4 flex flex-wrap gap-3">{visaItems.map((item) => <div key={item} className="rounded-full bg-red-50 px-4 py-2 font-semibold text-red-700">{item}</div>)}</div></div><div className="fade-up rounded-2xl border bg-white p-6 shadow-sm"><h2 className="section-title text-2xl">{t.whyKnltc}</h2><ul className="mt-4 space-y-2 text-sm">{whyItems.map((item, idx) => <li key={item} className="flex gap-2"><TicketCheck className="h-4 w-4 text-green-700" /><span>{idx + 1}. {item}</span></li>)}</ul></div></div></section>

      <section className="section-padding pt-0"><div className="container-narrow fade-up rounded-3xl bg-red-700 p-8 text-center text-white shadow-lg"><Sparkles className="mx-auto h-8 w-8 text-green-200" /><h2 className="mt-3 text-3xl font-bold">{t.finalTitle}</h2><p className="mx-auto mt-3 max-w-2xl text-white/90">{t.finalSubtitle}</p><Link href="/contact" className="mt-6 inline-block rounded-full bg-white px-6 py-3 font-semibold text-red-700 transition duration-300 hover:-translate-y-1 hover:bg-green-100">{t.ctaConsult}</Link></div></section>
    </main>
  );
}
