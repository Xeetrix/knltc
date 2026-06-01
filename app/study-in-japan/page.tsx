"use client";

import Link from "next/link";
import { CheckCircle2, FileCheck2, Home, School, Users } from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";

export default function StudyInJapanPage() {
  const { language } = useLanguage();
  const t = translate(
    {
      bn: {
        title: "জাপানে পড়াশোনার প্রিমিয়াম স্টুডেন্ট জার্নি",
        subtitle: "ভর্তি থেকে ভিসা—সব ধাপে অভিভাবক-বান্ধব, পরিষ্কার ও নির্ভরযোগ্য গাইডলাইন।",
        roadmap: "স্টুডেন্ট রোডম্যাপ",
        pathways: "স্টাডি পাথওয়ে",
        checklist: "ডকুমেন্ট চেকলিস্ট",
        life: "জাপানে স্টুডেন্ট লাইফ",
        faq: "প্রশ্নোত্তর",
        answerPrefix: "উত্তর",
        answerText: "আপনার প্রোফাইল অনুযায়ী KNLTC ধাপে ধাপে সঠিক গাইডলাইন দেবে।",
        finalTitle: "জাপানে পড়াশোনার পরিকল্পনা আজই শুরু করুন",
        consult: "ফ্রি কনসাল্টেশন নিন",
      },
      en: {
        title: "Premium Student Journey for Study in Japan",
        subtitle: "From admission to visa with clear, parent-friendly, and trusted guidance.",
        roadmap: "Student Roadmap",
        pathways: "Study Pathways",
        checklist: "Document Checklist",
        life: "Student Life in Japan",
        faq: "FAQ",
        answerPrefix: "Answer",
        answerText: "KNLTC will guide you step by step based on your profile.",
        finalTitle: "Start your Japan study plan today",
        consult: "Get Free Consultation",
      },
      ja: {
        title: "日本留学のプレミアム学生ジャーニー",
        subtitle: "入学からビザまで、保護者にも分かりやすく信頼できるガイド。",
        roadmap: "学生ロードマップ",
        pathways: "留学パスウェイ",
        checklist: "書類チェックリスト",
        life: "日本での学生生活",
        faq: "よくある質問",
        answerPrefix: "回答",
        answerText: "プロフィールに合わせてKNLTCが段階的にガイドします。",
        finalTitle: "日本留学の計画を今日から始めましょう",
        consult: "無料相談を受ける",
      },
    },
    language,
  );

  const heroStats = translate(
    {
      bn: [
        { icon: School, value: "১২+", label: "ইয়ার গাইডেন্স" },
        { icon: Users, value: "৮০০+", label: "শিক্ষার্থী পরামর্শ" },
        { icon: FileCheck2, value: "১০০%", label: "চেকলিস্ট ফোকাস" },
      ],
      en: [
        { icon: School, value: "12+", label: "Years guidance" },
        { icon: Users, value: "800+", label: "Student consultations" },
        { icon: FileCheck2, value: "100%", label: "Checklist focus" },
      ],
      ja: [
        { icon: School, value: "12+", label: "年のガイダンス" },
        { icon: Users, value: "800+", label: "学生相談" },
        { icon: FileCheck2, value: "100%", label: "チェックリスト重視" },
      ],
    },
    language,
  );

  const roadmap = translate(
    {
      bn: ["যোগ্যতা যাচাই", "স্কুল নির্বাচন", "অ্যাপ্লিকেশন প্রস্তুতি", "ভিসা ডকুমেন্ট", "ইন্টারভিউ প্রস্তুতি", "জাপানে যাত্রা"],
      en: ["Eligibility", "School selection", "Application", "Visa docs", "Interview", "Departure"],
      ja: ["適性確認", "学校選定", "申請準備", "ビザ書類", "面接準備", "渡航"],
    },
    language,
  );

  const pathways = translate(
    {
      bn: [
        { n: "ভাষা স্কুল", d: "ফাউন্ডেশন তৈরি ও বিশ্ববিদ্যালয় প্রস্তুতি" },
        { n: "বিশ্ববিদ্যালয় ভর্তি", d: "ব্যাচেলর/মাস্টার্স অ্যাডমিশন গাইড" },
        { n: "সেনমন স্কুল", d: "স্কিল-কেন্দ্রিক বাস্তবমুখী শিক্ষা" },
      ],
      en: [
        { n: "Language School", d: "Build a foundation for university" },
        { n: "University", d: "Bachelor/Master admission guidance" },
        { n: "Senmon School", d: "Skill-focused practical education" },
      ],
      ja: [
        { n: "日本語学校", d: "大学進学の基盤づくり" },
        { n: "大学進学", d: "学部・修士の入学支援" },
        { n: "専門学校", d: "実践重視の技能教育" },
      ],
    },
    language,
  );

  const checklist = translate(
    {
      bn: ["পাসপোর্ট ও একাডেমিক ডকুমেন্ট", "ফাইন্যান্সিয়াল প্রুফ", "COE আবেদন ফাইল", "ইন্টারভিউ প্রস্তুতি নোট"],
      en: ["Passport & academics", "Financial proof", "COE application file", "Interview prep notes"],
      ja: ["パスポート・学歴書類", "資金証明", "COE申請書類", "面接対策ノート"],
    },
    language,
  );

  const lifeCards = translate(
    {
      bn: ["পার্ট-টাইম সুযোগ", "নিরাপদ হোস্টেল/বাসস্থান", "কালচারাল অ্যাডাপ্টেশন"],
      en: ["Part-time options", "Safe hostel/housing", "Cultural adaptation"],
      ja: ["アルバイト機会", "安心できる寮・住居", "文化適応"],
    },
    language,
  );

  const faqs = translate(
    {
      bn: ["জাপানি ভাষা কি বাধ্যতামূলক?", "কত সময়ে প্রক্রিয়া শেষ হয়?", "পড়াশোনার সময় পার্ট-টাইম করা যায়?"],
      en: ["Is Japanese mandatory?", "How long does the process take?", "Can students work part-time?"],
      ja: ["日本語は必須ですか？", "手続きにはどれくらい時間がかかりますか？", "留学中アルバイトは可能ですか？"],
    },
    language,
  );

  return (
    <main className="section-padding bg-[#fcfaf7]">
      <div className="container-narrow space-y-8">
        <section className="fade-up relative overflow-hidden rounded-3xl border border-red-100 bg-white p-8 shadow-xl md:p-10">
          <div className="absolute right-0 top-0 h-36 w-36 rounded-full bg-red-200/40 blur-2xl" />
          <h1 className="relative text-3xl font-black text-red-700 md:text-4xl">{t.title}</h1>
          <p className="relative mt-3 text-zinc-700">{t.subtitle}</p>
          <div className="relative mt-6 grid gap-3 sm:grid-cols-3">
            {heroStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="rounded-xl border border-green-100 bg-green-50/60 p-4">
                  <Icon className="h-5 w-5 text-green-700" />
                  <p className="mt-2 text-2xl font-black text-red-700">{stat.value}</p>
                  <p className="text-sm text-zinc-600">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="section-title fade-up">{t.roadmap}</h2>
          <div className="mt-4 space-y-3">
            {roadmap.map((step, i) => (
              <div key={step} className="timeline-step fade-up" style={{ animationDelay: `${i * 80}ms` }}>
                <span className="timeline-dot">{i + 1}</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="section-title fade-up">{t.pathways}</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {pathways.map((path) => (
              <div key={path.n} className="card-lift fade-up rounded-2xl border bg-white p-5 shadow-sm">
                <School className="h-6 w-6 text-red-600" />
                <h3 className="mt-3 font-bold">{path.n}</h3>
                <p className="text-sm text-zinc-600">{path.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="section-title fade-up">{t.checklist}</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {checklist.map((item) => (
              <div key={item} className="fade-up flex items-center gap-2 rounded-xl border bg-white p-4">
                <CheckCircle2 className="h-5 w-5 text-green-700" />
                {item}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="section-title fade-up">{t.life}</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {lifeCards.map((card) => (
              <div key={card} className="fade-up rounded-2xl bg-gradient-to-br from-green-50 to-white p-5 font-semibold shadow-sm">
                <Home className="mb-2 h-5 w-5 text-green-700" />
                {card}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="section-title fade-up">{t.faq}</h2>
          <div className="mt-4 space-y-3">
            {faqs.map((question, i) => (
              <details key={question} className="fade-up rounded-xl border bg-white p-4" style={{ animationDelay: `${i * 70}ms` }}>
                <summary className="cursor-pointer font-semibold">{question}</summary>
                <p className="mt-2 text-sm text-zinc-600">
                  {t.answerPrefix}: {t.answerText}
                </p>
              </details>
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
