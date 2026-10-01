"use client";

import {
  Award,
  BookCheck,
  CheckCircle,
  FileCheck,
  Globe2,
  GraduationCap,
  Headphones,
  ShieldCheck,
} from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";

export default function TrustMetricsSection() {
  const { language } = useLanguage();

  const t = translate(
    {
      en: {
        stat1Value: "1,200+",
        stat1Label: "Visa Success Track Record",
        stat1Sub: "Students & professionals in Japan across Student, SSW & TITP",
        stat2Value: "98%",
        stat2Label: "JLPT / NAT Pass Rate",
        stat2Sub: "Result of our structured mock test and individual mentoring",
        stat3Value: "100%",
        stat3Label: "Free Study Materials",
        stat3Sub: "Minna No Nihongo books, lecture sheets & audio files free",
        stat4Value: "12+",
        stat4Label: "Years Japan Experience",
        stat4Sub: "Modern campus in Dhaka & global online live learning hub",
        badge: "Trust & Credibility",
        title: "Why Learn Japanese With KNLTC?",
        h1Title: "JLPT, NAT-TEST & JFT-Basic Certified Syllabus",
        h1Desc: "Designed according to Japan Foundation and JEES standards.",
        h2Title: "Native Japanese & N2/N1 Certified Sensei",
        h2Desc: "Authentic pronunciation, accent training & bilingual instructors.",
        h3Title: "Audio-Visual Listening Lab & Spoken Drills",
        h3Desc: "Regular conversational practice for real Japanese workplaces.",
        h4Title: "Embassy File & COE Documentation Guidance",
        h4Desc: "Full support for sponsorship papers, COE filing and visa interviews.",
      },
      bn: {
        stat1Value: "১,২০০+",
        stat1Label: "ভিসা সাকসেস রেকর্ড",
        stat1Sub: "স্টুডেন্ট, SSW ও TITP ক্যাটাগরিতে জাপান পৌঁছানো শিক্ষার্থী",
        stat2Value: "৯৮%",
        stat2Label: "JLPT / NAT পাস রেট",
        stat2Sub: "আমাদের স্পেশাল মক টেস্ট ও নিবিড় মনিটরিং মেথডের ফলাফল",
        stat3Value: "১০০%",
        stat3Label: "ফ্রি স্টাডি ম্যাটেরিয়ালস",
        stat3Sub: "মিন্না নো নিহোঙ্গো বই, লেকচার শিট ও অডিও ফাইল ফ্রি",
        stat4Value: "১২+",
        stat4Label: "বছরের জাপান অভিজ্ঞতা",
        stat4Sub: "ঢাকায় নিজস্ব ক্যাম্পাস ও অনলাইন গ্লোবাল লার্নিং হাব",
        badge: "Trust & Credibility",
        title: "কেন KNLTC জাপানিজ ল্যাঙ্গুয়েজ কোর্স সেরা?",
        h1Title: "JLPT, NAT-TEST ও JFT-Basic সার্টিফাইড সিলেবাস",
        h1Desc: "জাপান ফাউন্ডেশন এবং জাপান আন্তর্জাতিক শিক্ষা সমিতি (JEES) অনুমোদিত পাঠ্যক্রম অনুযায়ী সাজানো。",
        h2Title: "নেটিভ জাপানি ও N2/N1 সার্টিফাইড ইন্সট্রাক্টর",
        h2Desc: "সঠিক উচ্চারণ ও এক্সেন্ট শেখার জন্য নেটিভ স্পিকার সেশন এবং অভিজ্ঞ বাংলাদেশি মেন্টর。",
        h3Title: "অডিও-ভিজুয়াল লিসেনিং ল্যাব ও স্পোকেন ড্রিলস",
        h3Desc: "শুধুমাত্র বইয়ের পড়া নয়, প্র্যাকটিক্যাল জাপানিজ শোনার ও দ্রুত জবাব দেওয়ার নিয়মিত প্র্যাকটিস।",
        h4Title: "এম্বাসি ফাইল ও COE প্রসেসিং ফুল গাইডেন্স",
        h4Desc: "ভাষা শেষ করার পর স্পন্সর ডকুমেন্টস, স্পেশালাইজড ভিসা প্রিপারেশন এবং স্কুল ম্যাচিং সাপোর্ট।",
      },
      ja: {
        stat1Value: "1,200名+",
        stat1Label: "日本渡航ビザ取得実績",
        stat1Sub: "留学生、特定技能（SSW）、技能実習生を日本へ輩出",
        stat2Value: "98%",
        stat2Label: "JLPT / NAT合格率",
        stat2Sub: "定期模擬テストと個別指導による確かな合格実績",
        stat3Value: "100%",
        stat3Label: "オリジナル教材無料提供",
        stat3Sub: "『みんなの日本語』、漢字テキスト、音声データを無償配布",
        stat4Value: "12年+",
        stat4Label: "日本専門ガイダンス実績",
        stat4Sub: "ダッカ中心部キャンパス＆世界中から参加できるオンライン",
        badge: "信頼と実績",
        title: "KNLTC日本語アカデミーが選ばれる理由",
        h1Title: "JLPT・NAT・JFT-Basic公式基準カリキュラム",
        h1Desc: "国際交流基金（Japan Foundation）認定基準に準拠した教育内容。",
        h2Title: "日本人ネイティブ講師およびN2/N1有資格指導陣",
        h2Desc: "正確な発音・アクセント指導と現地文化に即した実践授業。",
        h3Title: "音声リスニングラボ＆ロールプレイ英会話",
        h3Desc: "試験対策だけでなく、現地で即戦力となる自然な会話力を養成。",
        h4Title: "COE・ビザ申請・大使館面接フルサポート",
        h4Desc: "語学修了後の学校選定、申請書類審査、面接シミュレーションまで一貫支援。",
      },
    },
    language,
  );

  const stats = [
    {
      value: t.stat1Value,
      label: t.stat1Label,
      subtext: t.stat1Sub,
      icon: Award,
      color: "text-[#b91c1c]",
      bgColor: "bg-red-50",
      borderColor: "border-red-100",
    },
    {
      value: t.stat2Value,
      label: t.stat2Label,
      subtext: t.stat2Sub,
      icon: CheckCircle,
      color: "text-[#15803d]",
      bgColor: "bg-green-50",
      borderColor: "border-green-100",
    },
    {
      value: t.stat3Value,
      label: t.stat3Label,
      subtext: t.stat3Sub,
      icon: BookCheck,
      color: "text-amber-700",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-100",
    },
    {
      value: t.stat4Value,
      label: t.stat4Label,
      subtext: t.stat4Sub,
      icon: Globe2,
      color: "text-blue-700",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-100",
    },
  ];

  const highlights = [
    { title: t.h1Title, desc: t.h1Desc, icon: ShieldCheck },
    { title: t.h2Title, desc: t.h2Desc, icon: GraduationCap },
    { title: t.h3Title, desc: t.h3Desc, icon: Headphones },
    { title: t.h4Title, desc: t.h4Desc, icon: FileCheck },
  ];

  return (
    <section className="bg-white py-14 border-b border-stone-200">
      <div className="container-narrow">
        {/* Stat Metric Cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className={`rounded-2xl border ${s.borderColor} ${s.bgColor} p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-3xl font-extrabold sm:text-4xl ${s.color}`}>{s.value}</span>
                  <div className={`p-2 rounded-xl bg-white/80 shadow-xs ${s.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <h4 className="mt-2 text-base font-bold text-slate-900">{s.label}</h4>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">{s.subtext}</p>
              </div>
            );
          })}
        </div>

        {/* Credibility & Guarantee Row */}
        <div className="mt-12 rounded-3xl border border-stone-200 bg-[#fcfaf7] p-6 md:p-8">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-[#b91c1c]">{t.badge}</span>
            <h2 className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl">
              {t.title}
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map((h, i) => {
              const HIcon = h.icon;
              return (
                <div key={i} className="rounded-2xl bg-white p-5 border border-stone-200 shadow-xs">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-[#15803d]">
                    <HIcon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-3 text-sm font-bold text-slate-900 leading-snug">{h.title}</h3>
                  <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">{h.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
