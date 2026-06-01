"use client";

import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  ClipboardCheck,
  FileCheck2,
  GraduationCap,
  Handshake,
  Languages,
  Leaf,
  ShieldCheck,
  Users,
  Wrench,
} from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";

export default function HomePage() {
  const { language } = useLanguage();
  const t = translate(
    {
      bn: {
        headline: "জাপানে পড়াশোনা, কাজ ও ভবিষ্যৎ গড়ার সঠিক পথ",
        subtitle:
          "স্টুডেন্ট ভিসা, জব ভিসা, SSW/TITP, জাপানি ভাষা, স্কিল ট্রেইনিং, ডকুমেন্টেশন ও ইন্টারভিউ প্রস্তুতি—সবকিছুর জন্য এক জায়গায় KNLTC।",
        c1: "ফ্রি কনসাল্টেশন নিন",
        c2: "হোয়াটসঅ্যাপে কথা বলুন",
        apply: "এই সুযোগে আবেদন করুন",
        path: "আপনার জাপান পথ বেছে নিন",
        supportTitle: "জাপানে যাওয়ার জন্য যা যা প্রয়োজন — সবকিছু এক জায়গায়",
        supportSub:
          "ভাষা শিক্ষা থেকে শুরু করে ভিসা, স্কিল, ইন্টারভিউ, ডকুমেন্টেশন ও জাপানে পৌঁছানোর পরও প্রয়োজনীয় গাইডলাইন দিয়ে থাকে KNLTC।",
        opp: "বর্তমানে চলমান সুযোগসমূহ",
        process: "জাপানে যাওয়ার প্রক্রিয়া",
        whyJ: "কেন জাপান?",
        whyK: "কেন KNLTC?",
        trust: "বিশ্বাসের সাথে জাপান যাত্রা",
        finalT: "আপনার জাপান যাত্রা শুরু করতে প্রস্তুত?",
        finalS: "আপনার লক্ষ্য অনুযায়ী সঠিক পথ বুঝতে এখনই KNLTC-এর সাথে যোগাযোগ করুন।",
        visaTag: "ভিসা সুযোগ",
        salaryLabel: "বেতন",
        eligibilityLabel: "যোগ্যতা",
        stepLabel: "ধাপ",
      },
      en: {
        headline: "The right path to study, work, and build your future in Japan",
        subtitle:
          "Student visa, job visa, SSW/TITP, Japanese language, skill training, documentation, and interview preparation with KNLTC.",
        c1: "Get Free Consultation",
        c2: "Talk on WhatsApp",
        apply: "Apply for this opportunity",
        path: "Choose Your Japan Path",
        supportTitle: "Everything you need for Japan — in one place",
        supportSub:
          "Language training, visa support, skills, interviews, documentation, and after-arrival support.",
        opp: "Current Japan Opportunities",
        process: "Japan Journey Process",
        whyJ: "Why Japan?",
        whyK: "Why KNLTC?",
        trust: "Start your Japan journey with trust",
        finalT: "Ready to start your Japan journey?",
        finalS: "Contact KNLTC now to choose the right path for your goal.",
        visaTag: "Visa opportunity",
        salaryLabel: "Salary",
        eligibilityLabel: "Eligibility",
        stepLabel: "Step",
      },
      ja: {
        headline: "日本で学び、働き、未来を築くための正しい道",
        subtitle:
          "学生ビザ、就労ビザ、SSW/TITP、日本語、技能訓練、書類準備、面接対策をKNLTCが総合サポート。",
        c1: "無料相談を受ける",
        c2: "WhatsAppで相談",
        apply: "この機会に応募",
        path: "あなたの日本進路を選ぶ",
        supportTitle: "日本渡航に必要なすべてを一か所で",
        supportSub: "語学教育からビザ、技能、面接、書類、渡航後サポートまで。",
        opp: "現在募集中の機会",
        process: "日本渡航までの流れ",
        whyJ: "なぜ日本？",
        whyK: "なぜKNLTC？",
        trust: "信頼とともに日本へ",
        finalT: "日本への一歩を始める準備はできましたか？",
        finalS: "目標に合う進路を今すぐKNLTCと確認しましょう。",
        visaTag: "ビザ機会",
        salaryLabel: "給与",
        eligibilityLabel: "条件",
        stepLabel: "ステップ",
      },
    },
    language,
  );

  const pathCards = translate(
    {
      bn: [
        {
          icon: GraduationCap,
          title: "জাপানে পড়াশোনা",
          text: "ভাষা স্কুল, বিশ্ববিদ্যালয় ভর্তি, স্টুডেন্ট ভিসা, ডকুমেন্টেশন ও প্রি-ডিপার্চার গাইডলাইন।",
          cta: "স্টুডেন্ট ভিসা সম্পর্কে জানুন",
          href: "/study-in-japan",
        },
        {
          icon: BriefcaseBusiness,
          title: "জাপানে কাজ",
          text: "SSW, TITP, স্কিল ট্রেইনিং, ইন্টারভিউ প্রস্তুতি, ডকুমেন্টেশন ও জব ভিসা গাইডলাইন।",
          cta: "জব ভিসা সম্পর্কে জানুন",
          href: "/work-in-japan",
        },
        {
          icon: Languages,
          title: "জাপানি ভাষা",
          text: "N5/N4 প্রস্তুতি, JLPT/JFT গাইডলাইন, স্পোকেন জাপানিজ ও শেখার বই।",
          cta: "ভাষা শেখা শুরু করুন",
          href: "/japanese-language",
        },
      ],
      en: [
        {
          icon: GraduationCap,
          title: "Study in Japan",
          text: "Language school, university admission, student visa, documentation, and pre-departure guidance.",
          cta: "Learn about Student Visa",
          href: "/study-in-japan",
        },
        {
          icon: BriefcaseBusiness,
          title: "Work in Japan",
          text: "SSW, TITP, skill training, interview prep, documentation, and job visa guidance.",
          cta: "Learn about Job Visa",
          href: "/work-in-japan",
        },
        {
          icon: Languages,
          title: "Japanese Language",
          text: "N5/N4 prep, JLPT/JFT guidance, spoken Japanese, and learning resources.",
          cta: "Start learning",
          href: "/japanese-language",
        },
      ],
      ja: [
        {
          icon: GraduationCap,
          title: "日本留学",
          text: "日本語学校・大学進学・学生ビザ・書類準備・渡航前ガイド。",
          cta: "学生ビザを見る",
          href: "/study-in-japan",
        },
        {
          icon: BriefcaseBusiness,
          title: "日本就職",
          text: "SSW、TITP、技能訓練、面接準備、書類、就労ビザガイド。",
          cta: "就労ビザを見る",
          href: "/work-in-japan",
        },
        {
          icon: Languages,
          title: "日本語",
          text: "N5/N4対策、JLPT/JFTガイド、会話、日本語教材。",
          cta: "学習を始める",
          href: "/japanese-language",
        },
      ],
    },
    language,
  );

  const badges = translate(
    {
      bn: ["স্টুডেন্ট ভিসা সাপোর্ট", "জব ভিসা সাপোর্ট", "জাপানি ভাষা", "SSW/TITP"],
      en: ["Student Visa Support", "Job Visa Support", "Japanese Language", "SSW/TITP"],
      ja: ["学生ビザサポート", "就労ビザサポート", "日本語学習", "SSW/TITP"],
    },
    language,
  );

  const support = translate(
    {
      bn: [
        { icon: Languages, title: "ল্যাঙ্গুয়েজ প্রোগ্রাম", text: "অল্প সময়ে N5/N4 প্রস্তুতি ও জাপানি ভাষার শক্ত ভিত্তি তৈরিতে সহায়তা।" },
        { icon: Wrench, title: "স্কিল ট্রেইনিং", text: "জাপানে যেসব স্কিলে কর্মী নেওয়া হয়, সেসব স্কিল ও স্কিল টেস্ট প্রস্তুতিতে সহায়তা।" },
        { icon: FileCheck2, title: "ডকুমেন্টেশন", text: "COE, ভিসা ফাইল, অ্যাপ্লিকেশন ফর্ম ও প্রয়োজনীয় ডকুমেন্ট চেকলিস্ট।" },
        { icon: ClipboardCheck, title: "ইন্টারভিউ প্রস্তুতি", text: "জাপানি স্টাইল ইন্টারভিউ, আত্মপরিচয় ও প্রশ্নোত্তর প্র্যাকটিস।" },
        { icon: Handshake, title: "জব/স্কুল ম্যাচিং", text: "স্টুডেন্টের লক্ষ্য ও কর্মীর স্কিল অনুযায়ী সঠিক সুযোগ নির্বাচন।" },
        { icon: Users, title: "আফটার সাপোর্ট", text: "জাপানে পৌঁছানোর পর প্রাথমিক গাইডলাইন ও প্রয়োজনীয় পরামর্শ।" },
      ],
      en: [
        { icon: Languages, title: "Language Program", text: "N5/N4 preparation and a strong Japanese foundation in a focused timeline." },
        { icon: Wrench, title: "Skill Training", text: "Support for in-demand Japan skills and skill test preparation." },
        { icon: FileCheck2, title: "Documentation", text: "COE, visa files, application forms, and required document checklists." },
        { icon: ClipboardCheck, title: "Interview Preparation", text: "Japanese-style interview, self-introduction, and Q&A practice." },
        { icon: Handshake, title: "Job/School Matching", text: "Choose the right opportunity based on each student's goal or worker's skill." },
        { icon: Users, title: "After Support", text: "Basic guidance and practical advice after arriving in Japan." },
      ],
      ja: [
        { icon: Languages, title: "語学プログラム", text: "短期間でN5/N4対策と日本語の基礎固めを支援。" },
        { icon: Wrench, title: "技能トレーニング", text: "日本で需要のある技能と技能試験対策をサポート。" },
        { icon: FileCheck2, title: "書類準備", text: "COE、ビザ書類、申請フォーム、必要書類チェックリスト。" },
        { icon: ClipboardCheck, title: "面接準備", text: "日本式面接、自己紹介、質疑応答の練習。" },
        { icon: Handshake, title: "就職・学校マッチング", text: "学生の目標や求職者の技能に合う機会を選定。" },
        { icon: Users, title: "渡航後サポート", text: "日本到着後の基本ガイドと実用的なアドバイス。" },
      ],
    },
    language,
  );

  const opportunities = translate(
    {
      bn: [
        ["SSW Agriculture", "JLPT N4 অথবা JFT-Basic + Skill Test Certificate", "১৫০,০০০ – ২০০,০০০ ইয়েন"],
        ["SSW Caregiver", "JLPT N4 অথবা JFT-Basic + Skill Test Certificate", "১৮০,০০০ – ২২০,০০০ ইয়েন"],
        ["TITP Construction", "বেসিক জাপানি + ফিজিক্যাল ফিটনেস", "১৬০,০০০ – ২০০,০০০ ইয়েন"],
        ["Student Visa", "একাডেমিক ডকুমেন্ট + ফাইন্যান্সিয়াল প্রুফ", "পার্ট-টাইম সুযোগ"],
      ],
      en: [
        ["SSW Agriculture", "JLPT N4 or JFT-Basic + Skill Test Certificate", "150,000 – 200,000 yen"],
        ["SSW Caregiver", "JLPT N4 or JFT-Basic + Skill Test Certificate", "180,000 – 220,000 yen"],
        ["TITP Construction", "Basic Japanese + physical fitness", "160,000 – 200,000 yen"],
        ["Student Visa", "Academic documents + financial proof", "Part-time opportunities"],
      ],
      ja: [
        ["SSW 農業", "JLPT N4またはJFT-Basic＋技能試験証明", "150,000～200,000円"],
        ["SSW 介護", "JLPT N4またはJFT-Basic＋技能試験証明", "180,000～220,000円"],
        ["TITP 建設", "基礎日本語＋体力", "160,000～200,000円"],
        ["学生ビザ", "学歴書類＋資金証明", "アルバイト機会"],
      ],
    },
    language,
  );

  const processSteps = translate(
    {
      bn: [
        "ফ্রি কনসাল্টেশন",
        "ভাষা শিক্ষা",
        "স্কিল ট্রেইনিং / অ্যাডমিশন প্রস্তুতি",
        "ইন্টারভিউ প্রিপারেশন",
        "ডকুমেন্টেশন",
        "ভিসা প্রসেস",
        "জাপান যাত্রা",
        "আফটার অ্যারাইভাল সাপোর্ট",
      ],
      en: [
        "Free consultation",
        "Language training",
        "Skill training / admission preparation",
        "Interview preparation",
        "Documentation",
        "Visa processing",
        "Travel to Japan",
        "After-arrival support",
      ],
      ja: [
        "無料相談",
        "語学学習",
        "技能訓練・入学準備",
        "面接準備",
        "書類準備",
        "ビザ手続き",
        "日本へ渡航",
        "到着後サポート",
      ],
    },
    language,
  );

  const whyJapan = translate(
    {
      bn: ["নিরাপদ পরিবেশ", "উন্নত প্রযুক্তি", "ভবিষ্যৎ ক্যারিয়ার সুযোগ", "আন্তর্জাতিক মানের শিক্ষা", "শৃঙ্খলাপূর্ণ জীবন", "দীর্ঘমেয়াদি সম্ভাবনা"],
      en: ["Safe environment", "Advanced technology", "Future career opportunities", "International-standard education", "Disciplined lifestyle", "Long-term potential"],
      ja: ["安全な環境", "先進技術", "将来のキャリア機会", "国際水準の教育", "規律ある生活", "長期的な可能性"],
    },
    language,
  );

  const whyKnltc = translate(
    {
      bn: ["জাপান-কেন্দ্রিক গাইডলাইন", "স্টুডেন্ট ও জব ভিসা সাপোর্ট", "ভাষা + স্কিল সাপোর্ট", "ডকুমেন্টেশন সাপোর্ট", "ইন্টারভিউ প্রস্তুতি", "জাপানে পৌঁছানোর পরও সম্পর্ক"],
      en: ["Japan-focused guidance", "Student and job visa support", "Language + skill support", "Documentation support", "Interview preparation", "Continued connection after arrival"],
      ja: ["日本特化のガイド", "学生・就労ビザサポート", "語学＋技能サポート", "書類準備サポート", "面接準備", "渡航後も続く関係"],
    },
    language,
  );

  const trustStats = translate(
    {
      bn: [["৫০০+", "গাইডলাইন"], ["N5/N4", "প্রস্তুতি"], ["স্টুডেন্ট ও জব ভিসা", "সাপোর্ট"], ["SSW/TITP", "পথ"]],
      en: [["500+", "Guidance sessions"], ["N5/N4", "Preparation"], ["Student & Job Visa", "Support"], ["SSW/TITP", "Pathways"]],
      ja: [["500+", "相談実績"], ["N5/N4", "対策"], ["学生・就労ビザ", "サポート"], ["SSW/TITP", "進路"]],
    },
    language,
  );

  return (
    <main className="overflow-hidden bg-[#fcfaf7]">
      <section className="section-padding relative bg-gradient-to-br from-red-50 via-white to-green-50">
        <div className="container-narrow grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="fade-up">
            <p className="mb-3 inline-flex rounded-full bg-red-100 px-4 py-1 text-sm font-semibold text-red-700">KNLTC Japan Gateway</p>
            <h1 className="text-4xl font-black tracking-tight text-red-700 md:text-6xl">{t.headline}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-700">{t.subtitle}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact" className="rounded-full bg-green-700 px-6 py-3 font-semibold text-white transition hover:-translate-y-1 hover:bg-green-800">
                {t.c1}
              </Link>
              <a href={siteConfig.whatsappHref} className="rounded-full border border-red-200 px-6 py-3 font-semibold text-red-700 transition hover:-translate-y-1">
                {t.c2}
              </a>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {badges.map((b) => (
                <span key={b} className="fade-up inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                  <ShieldCheck className="mr-1 h-3 w-3" />
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-narrow">
          <h2 className="section-title">{t.path}</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {pathCards.map((p) => {
              const Icon = p.icon;
              return (
                <Link key={p.title} href={p.href} className="card-lift fade-up rounded-2xl border border-red-100 bg-white p-6 shadow-md">
                  <Icon className="h-6 w-6 text-red-600" />
                  <h3 className="mt-3 text-2xl font-bold text-red-700">{p.title}</h3>
                  <p className="mt-2 text-sm text-zinc-700">{p.text}</p>
                  <p className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-green-700">
                    {p.cta}
                    <ArrowRight className="h-4 w-4" />
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-narrow">
          <h2 className="section-title">{t.supportTitle}</h2>
          <p className="section-subtitle">{t.supportSub}</p>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {support.map((item, i) => {
              const Icon = item.icon;
              return (
                <article key={item.title} style={{ animationDelay: `${i * 60}ms` }} className="fade-up card-lift rounded-2xl border bg-white p-5 shadow-sm">
                  <Icon className="h-6 w-6 text-green-700" />
                  <h3 className="mt-3 font-bold text-red-700">{item.title}</h3>
                  <p className="mt-2 text-sm text-zinc-700">{item.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-narrow">
          <h2 className="section-title">{t.opp}</h2>
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {opportunities.map(([name, eligibility, salary]) => (
              <article key={name} className="card-lift rounded-2xl border bg-white p-5 shadow-sm">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">{t.visaTag}</span>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    {t.salaryLabel}: {salary}
                  </span>
                </div>
                <h3 className="mt-3 text-xl font-bold text-zinc-900">{name}</h3>
                <p className="mt-2 text-sm text-zinc-700">
                  <strong>{t.eligibilityLabel}:</strong> {eligibility}
                </p>
                <Link href="/contact" className="mt-4 inline-block rounded-full bg-green-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-800">
                  {t.apply}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-narrow">
          <h2 className="section-title">{t.process}</h2>
          <div className="mt-8 grid gap-3 md:grid-cols-2">
            {processSteps.map((step, i) => (
              <div key={step} className="fade-up rounded-2xl border-l-4 border-green-600 bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold text-red-700">
                  {t.stepLabel} {i + 1}
                </p>
                <p className="font-semibold">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-narrow grid gap-6 lg:grid-cols-2">
          <div>
            <h2 className="section-title">{t.whyJ}</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {whyJapan.map((item) => (
                <div key={item} className="rounded-xl border bg-white p-4 text-sm font-semibold">
                  <Leaf className="mb-2 h-4 w-4 text-green-700" />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="section-title">{t.whyK}</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {whyKnltc.map((item) => (
                <div key={item} className="rounded-xl border bg-white p-4 text-sm font-semibold">
                  <BadgeCheck className="mb-2 h-4 w-4 text-red-700" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-narrow">
          <h2 className="section-title">{t.trust}</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {trustStats.map(([number, label]) => (
              <div key={number} className="fade-up rounded-2xl border bg-white p-5 text-center shadow-sm">
                <p className="text-2xl font-black text-red-700">{number}</p>
                <p className="text-sm font-semibold text-zinc-700">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-narrow rounded-3xl bg-gradient-to-r from-red-700 to-green-700 p-8 text-center text-white">
          <h2 className="text-3xl font-black">{t.finalT}</h2>
          <p className="mt-3">{t.finalS}</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/contact" className="rounded-full bg-white px-6 py-3 font-semibold text-green-700">
              {t.c1}
            </Link>
            <a href={siteConfig.whatsappHref} className="rounded-full border border-white px-6 py-3 font-semibold">
              {t.c2}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
