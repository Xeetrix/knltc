"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { BadgeDollarSign, BriefcaseBusiness, CheckCircle2, ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export default function WorkInJapanPage() {
  const { language } = useLanguage();
  const t = translate(
    {
      bn: {
        title: "জাপানে ক্যারিয়ার গড়ার প্রিমিয়াম পথ",
        subtitle: "SSW/TITP প্রস্তুতি, সেক্টর নির্বাচন, ডকুমেন্টেশন ও ভিসা সহ সম্পূর্ণ ক্যারিয়ার সাপোর্ট।",
        compare: "SSW বনাম TITP",
        opportunities: "চলমান সুযোগ",
        sectors: "চাহিদাসম্পন্ন সেক্টর",
        timeline: "ক্যারিয়ার প্রসেস টাইমলাইন",
        salaryLabel: "সম্ভাব্য বেতন",
        finalTitle: "জাপানে কাজের প্রস্তুতি শুরু করুন",
        apply: "এখন আবেদন করুন",
        consult: "ফ্রি কনসাল্টেশন নিন",
      },
      en: {
        title: "Premium Career Pathway for Japan",
        subtitle: "Complete support for SSW/TITP preparation, sector selection, documentation, and visa processing.",
        compare: "SSW vs TITP",
        opportunities: "Current Opportunities",
        sectors: "High-demand sectors",
        timeline: "Career Process Timeline",
        salaryLabel: "Expected salary",
        finalTitle: "Start your work preparation",
        apply: "Apply now",
        consult: "Get consultation",
      },
      ja: {
        title: "日本就職のプレミアムキャリアパス",
        subtitle: "SSW/TITP準備、分野選定、書類準備、ビザ手続きまで一貫サポート。",
        compare: "SSWとTITP",
        opportunities: "現在の募集",
        sectors: "需要の高い分野",
        timeline: "キャリアプロセス",
        salaryLabel: "想定給与",
        finalTitle: "就職準備を始めましょう",
        apply: "今すぐ応募",
        consult: "無料相談",
      },
    },
    language,
  );

  const compareCards = translate(
    {
      bn: [
        { title: "SSW (Specified Skilled Worker)", c: "bg-[#fcfaf7] border-stone-200", items: ["JLPT N4 অথবা JFT-Basic", "অনুমোদিত সেক্টরভিত্তিক স্কিল টেস্ট বাধ্যতামূলক", "দীর্ঘমেয়াদি ক্যারিয়ার ও ফ্যামিলি নিয়ে যাওয়ার সুযোগ"] },
        { title: "TITP (Technical Intern)", c: "bg-white border-stone-200", items: ["ট্রেইনি ভিত্তিক টেকনিক্যাল ইন্টার্নশিপ", "বেসিক ভাষা (N5) হলে অগ্রাধিকার", "৩-৫ বছর শেষে সরাসরি SSW-তে রূপান্তরের সুযোগ"] },
      ],
      en: [
        { title: "SSW (Specified Skilled Worker)", c: "bg-[#fcfaf7] border-stone-200", items: ["JLPT N4 or JFT-Basic required", "Mandatory Prometric skill evaluation test", "Long-term career pathway and family sponsorship eligible"] },
        { title: "TITP (Technical Intern)", c: "bg-white border-stone-200", items: ["Practical on-the-job training in Japan", "Basic N5 Japanese level beneficial", "Smooth conversion path to SSW after 3–5 years"] },
      ],
      ja: [
        { title: "特定技能（SSW）", c: "bg-[#fcfaf7] border-stone-200", items: ["JLPT N4またはJFT-Basic合格", "分野別技能測定試験の合格が必須", "長期就労および特定技能2号へのステップアップ可能"] },
        { title: "技能実習（TITP）", c: "bg-white border-stone-200", items: ["現場での技術習得と実務研修", "基礎的な日本語（N5程度）が望ましい", "3〜5年の実習修了後に特定技能への移行が可能"] },
      ],
    },
    language,
  );

  const opportunities = translate(
    {
      bn: [
        { t: "SSW কেয়ারগিভার (Kaigo)", e: "N4/JFT + কেয়ারগিভিং স্কিল টেস্ট", s: "¥180,000 – ¥240,000" },
        { t: "SSW এগ্রিকালচার (Nogyo)", e: "N4/JFT + এগ্রিকালচার স্কিল টেস্ট", s: "¥160,000 – ¥210,000" },
        { t: "TITP কনস্ট্রাকশন ও টেকনিক্যাল", e: "বেসিক ভাষা + মেডিকেল ক্লিয়ারেন্স", s: "¥160,000 – ¥190,000" },
      ],
      en: [
        { t: "SSW Caregiver (Kaigo)", e: "N4/JFT + Nursing Care Skill Test", s: "¥180,000 – ¥240,000" },
        { t: "SSW Agriculture (Nogyo)", e: "N4/JFT + Farming Skill Test", s: "¥160,000 – ¥210,000" },
        { t: "TITP Construction & Technical", e: "Basic Japanese + Medical Fitness", s: "¥160,000 – ¥190,000" },
      ],
      ja: [
        { t: "特定技能 介護 (Kaigo)", e: "N4/JFT ＋ 介護技能評価試験", s: "180,000～240,000 円" },
        { t: "特定技能 農業 (Nogyo)", e: "N4/JFT ＋ 農業技能測定試験", s: "160,000～210,000 円" },
        { t: "技能実習 建設・製造", e: "基礎日本語 ＋ 健康状態良好", s: "160,000～190,000 円" },
      ],
    },
    language,
  );

  const sectors = translate(
    {
      bn: ["কেয়ারগিভিং (নার্সিং কেয়ার)", "কনস্ট্রাকশন ও নির্মাণ খাত", "এগ্রিকালচার (কৃষি ও পশুপালন)", "ফুড সার্ভিস ও ক্যাটারিং", "ম্যানুফ্যাকচারিং ও প্যাকেজিং", "অটোমোবাইল রিপেয়ার"],
      en: ["Caregiving (Nursing Care)", "Construction & Building", "Agriculture & Farming", "Food Service & Restaurant", "Manufacturing & Assembly", "Automobile Maintenance"],
      ja: ["介護（看護ケア）", "建設・建築", "農業・畜産", "外食業・飲食料品製造", "素形材・産業機械製造", "自動車整備"],
    },
    language,
  );

  const timeline = translate(
    {
      bn: ["১. প্রোফাইল ও শিক্ষাগত যোগ্যতা যাচাই", "২. জাপানি ভাষা ও স্কিল প্রস্তুতি", "৩. প্রোমেট্রিক স্কিল টেস্টে অংশগ্রহণ", "৪. নিয়োগকারী জাপানি কোম্পানি ইন্টারভিউ", "৫. COE আবেদন ও এম্বাসি ভিসা প্রসেসিং", "৬. জাপানে ডিপার্চার ও শুভ সূচনা"],
      en: ["1. Profile & Eligibility Assessment", "2. Japanese Language & Skill Training", "3. Prometric Skill Examination", "4. Employer Matching & Live Interview", "5. COE Filing & Embassy Visa Stamping", "6. Departure & Settlement in Japan"],
      ja: ["1. 学歴・経歴の適性診断", "2. 日本語学習および技能訓練", "3. プロメトリック技能測定試験", "4. 受入れ企業との採用面接", "5. 在留資格（COE）申請・査証発給", "6. 日本渡航と現地就労開始"],
    },
    language,
  );

  return (
    <main className="section-padding bg-[#fcfaf7]">
      <div className="container-narrow space-y-12">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] as const }}
          className="relative overflow-hidden rounded-3xl border border-stone-200 bg-white p-8 shadow-xs md:p-10"
        >
          <div className="inline-flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-[#b91c1c]">
            <span className="h-2 w-2 rounded-full bg-[#b91c1c] animate-pulse" />
            <span>KNLTC Japan Career Division</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 md:text-4xl tracking-tight">{t.title}</h1>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl">{t.subtitle}</p>
        </motion.section>

        {/* Compare SSW vs TITP */}
        <section>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-title"
          >
            {t.compare}
          </motion.h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="mt-6 grid gap-6 md:grid-cols-2"
          >
            {compareCards.map((card) => (
              <motion.div
                key={card.title}
                variants={itemVariants}
                whileHover={{ y: -4, transition: { duration: 0.18 } }}
                className={`rounded-2xl border p-6 sm:p-7 shadow-xs hover:shadow-md transition-shadow ${card.c}`}
              >
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">{card.title}</h3>
                <ul className="mt-4 space-y-3">
                  {card.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#15803d]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Opportunities */}
        <section>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-title"
          >
            {t.opportunities}
          </motion.h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="mt-6 grid gap-6 md:grid-cols-3"
          >
            {opportunities.map((opportunity) => (
              <motion.div
                key={opportunity.t}
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="flex flex-col justify-between rounded-2xl border border-stone-200 bg-white p-6 shadow-xs hover:shadow-md hover:border-stone-300 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 pb-3 border-b border-stone-100">
                    <h3 className="font-bold text-slate-900 text-base leading-snug">{opportunity.t}</h3>
                  </div>
                  <div className="mt-3">
                    <span className="inline-block rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-bold text-[#15803d] border border-emerald-200">
                      {t.salaryLabel}: {opportunity.s}
                    </span>
                  </div>
                  <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">{opportunity.e}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-100">
                  <Link
                    href="/contact"
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 px-4 py-2.5 text-xs font-semibold text-white shadow-2xs active:scale-95 transition-all"
                  >
                    <BadgeDollarSign className="h-4 w-4 text-emerald-400" />
                    <span>{t.apply}</span>
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* High-demand Sectors */}
        <section>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-title"
          >
            {t.sectors}
          </motion.h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
          >
            {sectors.map((sector) => (
              <motion.div
                key={sector}
                variants={itemVariants}
                whileHover={{ y: -3, transition: { duration: 0.15 } }}
                className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white p-4 font-semibold text-slate-800 shadow-2xs hover:border-stone-300 transition-colors"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-[#b91c1c]">
                  <BriefcaseBusiness className="h-4 w-4" />
                </div>
                <span className="text-xs sm:text-sm">{sector}</span>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Timeline Process */}
        <section>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-title"
          >
            {t.timeline}
          </motion.h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="mt-6 space-y-3"
          >
            {timeline.map((step) => (
              <motion.div
                key={step}
                variants={itemVariants}
                whileHover={{ x: 4, transition: { duration: 0.15 } }}
                className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white p-4 text-xs sm:text-sm font-semibold text-slate-800 shadow-2xs hover:border-stone-300 transition-all"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#15803d]" />
                <span>{step}</span>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Executive Final Card */}
        <motion.section
          initial={{ opacity: 0, scale: 0.98, y: 16 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl border border-stone-200 bg-white p-8 sm:p-10 text-center shadow-xs"
        >
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{t.finalTitle}</h2>
          <div className="mt-6">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-[#15803d] hover:bg-emerald-700 px-6 py-3.5 font-semibold text-white shadow-xs active:scale-95 transition-all text-sm"
            >
              <span>{t.consult}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
