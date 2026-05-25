"use client";

import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, GraduationCap, Languages, ShieldCheck, Sparkles } from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";

export default function HomePage() {
  const { language } = useLanguage();

  const t = translate(
    {
      bn: {
        brand: "KNLTC — Japan Education & Career Consultancy",
        headline: "জাপানে পড়াশোনা, কাজ ও ভবিষ্যৎ গড়ার প্রিমিয়াম পথনির্দেশনা",
        subtitle:
          "স্টুডেন্ট ভিসা, SSW/TITP, জাপানি ভাষা, স্কিল ট্রেইনিং ও ডকুমেন্টেশন—সবকিছু অভিভাবক-বান্ধব ও বিশ্বাসযোগ্য গাইডলাইনে।",
        ctaConsult: "ফ্রি কনসাল্টেশন নিন",
        ctaWhatsApp: "হোয়াটসঅ্যাপে কথা বলুন",
        choosePath: "আপনার জাপান যাত্রার সঠিক ধাপ বেছে নিন",
      },
      en: {
        brand: "KNLTC — Japan Education & Career Consultancy",
        headline: "Premium guidance to study, work, and build your future in Japan",
        subtitle:
          "Student visa, SSW/TITP, Japanese language, skill training, and documentation in one trusted and parent-friendly system.",
        ctaConsult: "Get Free Consultation",
        ctaWhatsApp: "Talk on WhatsApp",
        choosePath: "Choose your Japan pathway",
      },
      ja: {
        brand: "KNLTC — Japan Education & Career Consultancy",
        headline: "日本で学び、働き、未来を築くためのプレミアムガイダンス",
        subtitle:
          "学生ビザ、SSW/TITP、日本語、技能訓練、書類準備まで、保護者にも安心の一体型サポート。",
        ctaConsult: "無料相談を受ける",
        ctaWhatsApp: "WhatsAppで相談",
        choosePath: "日本への進路を選ぶ",
      },
    },
    language,
  );

  const pathCards = translate(
    {
      bn: [
        { icon: GraduationCap, title: "জাপানে পড়াশোনা", desc: "ভর্তি, ভিসা, স্টুডেন্ট লাইফ প্রস্তুতি", href: "/study-in-japan", bg: "from-red-100/90 to-white" },
        { icon: BriefcaseBusiness, title: "জাপানে কাজ", desc: "SSW/TITP, চাকরি খাত, বাস্তব প্রস্তুতি", href: "/work-in-japan", bg: "from-green-100/90 to-white" },
        { icon: Languages, title: "জাপানি ভাষা", desc: "JLPT/JFT লক্ষ্যভিত্তিক ক্লাস", href: "/japanese-language", bg: "from-red-50 to-green-50" },
      ],
      en: [
        { icon: GraduationCap, title: "Study in Japan", desc: "Admission, visa, and student life prep", href: "/study-in-japan", bg: "from-red-100/90 to-white" },
        { icon: BriefcaseBusiness, title: "Work in Japan", desc: "SSW/TITP, sectors, and job readiness", href: "/work-in-japan", bg: "from-green-100/90 to-white" },
        { icon: Languages, title: "Japanese Language", desc: "Targeted JLPT/JFT preparation", href: "/japanese-language", bg: "from-red-50 to-green-50" },
      ],
      ja: [
        { icon: GraduationCap, title: "日本留学", desc: "入学・ビザ・学生生活準備", href: "/study-in-japan", bg: "from-red-100/90 to-white" },
        { icon: BriefcaseBusiness, title: "日本就職", desc: "SSW/TITP・分野選定・就職準備", href: "/work-in-japan", bg: "from-green-100/90 to-white" },
        { icon: Languages, title: "日本語", desc: "JLPT/JFT目標別トレーニング", href: "/japanese-language", bg: "from-red-50 to-green-50" },
      ],
    },
    language,
  );

  const trustBadges = translate(
    {
      bn: ["জাপান-কেন্দ্রিক গাইডেন্স", "ডকুমেন্টেশন সাপোর্ট", "আফটার অ্যারাইভাল সাপোর্ট"],
      en: ["Japan-focused guidance", "Documentation support", "After-arrival support"],
      ja: ["日本特化のガイダンス", "書類サポート", "渡航後サポート"],
    },
    language,
  );

  return (
    <main className="bg-[#fcfaf7]">
      <section className="section-padding pb-10">
        <div className="container-narrow relative overflow-hidden rounded-[2rem] border border-red-100 bg-white/90 p-6 shadow-2xl md:p-10">
          <div className="absolute -right-14 top-6 h-48 w-48 rounded-full bg-red-200/40 blur-2xl" />
          <div className="absolute -left-16 bottom-4 h-44 w-44 rounded-full bg-green-200/40 blur-2xl" />
          <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(#d83434_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="relative grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="fade-up">
              <p className="text-xs font-bold tracking-[0.18em] text-green-700 md:text-sm">{t.brand}</p>
              <h1 className="mt-4 text-balance-safe text-4xl font-black leading-tight text-red-700 md:text-5xl">{t.headline}</h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-700">{t.subtitle}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-green-700 px-6 py-3 font-semibold text-white transition hover:-translate-y-1 hover:bg-green-800">
                  {t.ctaConsult} <ArrowRight className="h-4 w-4" />
                </Link>
                <a href="https://wa.me/8801627442366" target="_blank" rel="noopener noreferrer" className="rounded-full border border-red-200 bg-white px-6 py-3 font-semibold text-red-700 transition hover:-translate-y-1">
                  {t.ctaWhatsApp}
                </a>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {trustBadges.map((badge, i) => (
                  <span key={badge} style={{ animationDelay: `${i * 90}ms` }} className="fade-up inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                    <ShieldCheck className="h-3.5 w-3.5" /> {badge}
                  </span>
                ))}
              </div>
            </div>

            <div className="fade-up space-y-3" style={{ animationDelay: "90ms" }}>
              {pathCards.map((item, i) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    className={`card-lift group block rounded-2xl border border-white/60 bg-gradient-to-br ${item.bg} p-5 shadow-lg`}
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-xl font-extrabold text-zinc-900">{item.title}</h3>
                        <p className="mt-1 text-sm text-zinc-700">{item.desc}</p>
                      </div>
                      <div className="rounded-xl bg-white/75 p-2"><Icon className="h-6 w-6 text-red-600" /></div>
                    </div>
                    <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-green-700 group-hover:gap-2">বিস্তারিত দেখুন <ArrowRight className="h-4 w-4" /></div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-narrow">
          <h2 className="section-title fade-up">{t.choosePath}</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {pathCards.map((item, i) => (
              <Link key={`${item.title}-2`} href={item.href} style={{ animationDelay: `${i * 80}ms` }} className="fade-up card-lift rounded-2xl border border-red-100 bg-white p-6 shadow-md">
                <h3 className="text-2xl font-bold text-red-700">{item.title}</h3>
                <p className="mt-2 text-sm text-zinc-600">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-narrow fade-up rounded-3xl border border-green-200 bg-gradient-to-r from-red-700 to-green-700 p-8 text-center text-white">
          <Sparkles className="mx-auto h-8 w-8" />
          <p className="mt-3 text-lg font-semibold">KNLTC আপনার জাপান যাত্রায় প্রিমিয়াম, মানবিক ও ফলাফলমুখী সাপোর্ট নিশ্চিত করে।</p>
        </div>
      </section>
    </main>
  );
}
