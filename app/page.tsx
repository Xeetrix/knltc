"use client";

import Link from "next/link";
import { ArrowRight, BookOpenCheck, BriefcaseBusiness, GraduationCap, Languages } from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";


export default function HomePage() {
  const { language } = useLanguage();
  const t = translate({
    bn: {
      headline: "জাপানে পড়াশোনা, কাজ ও ভবিষ্যৎ গড়ার সঠিক পথ",
      subtitle: "স্টুডেন্ট ভিসা, SSW/TITP, জাপানি ভাষা, স্কিল ট্রেইনিং, ডকুমেন্টেশন ও ইন্টারভিউ প্রস্তুতি—সবকিছুর জন্য এক জায়গায় KNLTC।",
      cta: "ফ্রি কনসাল্টেশন নিন",
      quickPath: "আপনার জাপান পথ বেছে নিন",
      programs: "ফিচার্ড প্রোগ্রামসমূহ",
      finalTitle: "আজই আপনার জাপান যাত্রা শুরু করুন",
      finalBtn: "KNLTC-এর সাথে যোগাযোগ করুন",
    },
    en: {
      headline: "The right path to study, work, and build your future in Japan",
      subtitle: "KNLTC supports Student Visa, SSW/TITP, Japanese language, skill training, documentation, and interview preparation in one place.",
      cta: "Get Free Consultation",
      quickPath: "Choose Your Japan Path",
      programs: "Featured Programs",
      finalTitle: "Start your Japan journey today",
      finalBtn: "Contact KNLTC",
    },
    ja: {
      headline: "日本で学び、働き、未来を築くための正しい道",
      subtitle: "学生ビザ、SSW/TITP、日本語、技能トレーニング、書類準備、面接対策まで、KNLTCがワンストップで支援します。",
      cta: "無料相談を受ける",
      quickPath: "日本への進路を選ぶ",
      programs: "注目プログラム",
      finalTitle: "今すぐ日本への一歩を始めましょう",
      finalBtn: "KNLTCに相談する",
    },
  }, language);

  const quickPaths = translate({
    bn: [
      { icon: GraduationCap, title: "জাপানে পড়াশোনা", text: "ভাষা স্কুল, বিশ্ববিদ্যালয় ভর্তি, স্টুডেন্ট ভিসা, ডকুমেন্টেশন ও প্রি-ডিপার্চার গাইডলাইন।", href: "/study-in-japan" },
      { icon: BriefcaseBusiness, title: "জাপানে কাজ", text: "SSW, TITP, স্কিল ট্রেইনিং, ইন্টারভিউ প্রস্তুতি ও জব ভিসা গাইডলাইন।", href: "/work-in-japan" },
      { icon: Languages, title: "জাপানি ভাষা", text: "N5/N4 প্রস্তুতি, JLPT/JFT গাইডলাইন, স্পোকেন জাপানিজ ও বই।", href: "/japanese-language" },
    ],
    en: [
      { icon: GraduationCap, title: "Study in Japan", text: "Language school, university admission, student visa, documentation, and pre-departure guidance.", href: "/study-in-japan" },
      { icon: BriefcaseBusiness, title: "Work in Japan", text: "SSW, TITP, skill training, interview preparation, and job visa guideline.", href: "/work-in-japan" },
      { icon: Languages, title: "Japanese Language", text: "N5/N4 prep, JLPT/JFT guideline, spoken Japanese, and books.", href: "/japanese-language" },
    ],
    ja: [
      { icon: GraduationCap, title: "日本留学", text: "日本語学校、大学進学、学生ビザ、書類準備、渡航前ガイダンス。", href: "/study-in-japan" },
      { icon: BriefcaseBusiness, title: "日本就職", text: "SSW、TITP、技能トレーニング、面接対策、就労ビザガイド。", href: "/work-in-japan" },
      { icon: Languages, title: "日本語", text: "N5/N4対策、JLPT/JFTガイド、会話日本語、教材。", href: "/japanese-language" },
    ],
  }, language);

  const featuredPrograms = translate({
    bn: ["Student Visa", "SSW Visa", "TITP Program", "Japanese Language Program"],
    en: ["Student Visa", "SSW Visa", "TITP Program", "Japanese Language Program"],
    ja: ["学生ビザ", "SSWビザ", "TITPプログラム", "日本語プログラム"],
  }, language);

  return <main>
    <section className="section-padding bg-gradient-to-br from-red-50 via-white to-green-50">
      <div className="container-narrow text-center">
        <p className="text-sm font-semibold text-green-700">KNLTC — Japan Education & Career Consultancy</p>
        <h1 className="mt-3 text-balance-safe text-4xl font-extrabold text-red-700 md:text-5xl">{t.headline}</h1>
        <p className="mx-auto mt-4 max-w-3xl text-balance-safe text-muted-foreground">{t.subtitle}</p>
        <Link href="/contact" className="mt-6 inline-flex items-center gap-2 rounded-full bg-green-600 px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-green-700">{t.cta}<ArrowRight className="h-4 w-4" /></Link>
      </div>
    </section>

    <section className="section-padding">
      <div className="container-narrow">
        <h2 className="text-3xl font-bold text-red-700">{t.quickPath}</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {quickPaths.map((item) => {
            const Icon = item.icon;
            return <Link key={item.title} href={item.href} className="group rounded-2xl border border-red-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-green-300 hover:shadow-lg">
              <div className="mb-4 w-fit rounded-xl bg-red-50 p-3 text-red-700"><Icon className="h-5 w-5" /></div>
              <h3 className="text-xl font-bold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
            </Link>;
          })}
        </div>
      </div>
    </section>

    <section className="section-padding bg-white">
      <div className="container-narrow">
        <h2 className="text-3xl font-bold text-red-700">{t.programs}</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featuredPrograms.map((program) => <div key={program} className="rounded-xl border border-green-100 bg-green-50/40 p-5 text-center font-semibold transition hover:-translate-y-1 hover:shadow-md">{program}</div>)}
        </div>
      </div>
    </section>

    <section className="section-padding bg-red-700 text-white">
      <div className="container-narrow text-center">
        <BookOpenCheck className="mx-auto h-8 w-8 text-green-300" />
        <h2 className="mt-3 text-3xl font-bold">{t.finalTitle}</h2>
        <Link href="/contact" className="mt-5 inline-block rounded-full bg-white px-6 py-3 font-semibold text-red-700 transition hover:bg-green-100">{t.finalBtn}</Link>
      </div>
    </section>
  </main>;
}
