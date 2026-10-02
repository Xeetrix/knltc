"use client";

import { motion } from "motion/react";
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
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

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
        badge: "Accreditation & Standards",
        title: "Why Learn Japanese with KNLTC?",
        h1Title: "JLPT, NAT-TEST & JFT Certified Syllabus",
        h1Desc: "Designed in accordance with Japan Foundation and JEES standards.",
        h2Title: "Native Japanese & N2/N1 Sensei",
        h2Desc: "Authentic pronunciation, accent training & bilingual instructors.",
        h3Title: "Listening Lab & Spoken Drills",
        h3Desc: "Practical conversational practice for real Japanese workplaces.",
        h4Title: "COE & Embassy Visa Guidance",
        h4Desc: "Full support for sponsorship documents and visa interviews.",
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
        badge: "বিশ্বাস ও নির্ভরযোগ্যতা",
        title: "কেন KNLTC জাপানিজ ল্যাঙ্গুয়েজ কোর্স সেরা?",
        h1Title: "JLPT, NAT-TEST ও JFT সার্টিফাইড সিলেবাস",
        h1Desc: "জাপান ফাউন্ডেশন এবং জাপান আন্তর্জাতিক শিক্ষা সমিতি (JEES) অনুমোদিত পাঠ্যক্রম অনুযায়ী সাজানো।",
        h2Title: "নেটিভ জাপানি ও N2/N1 সার্টিফাইড ইন্সট্রাক্টর",
        h2Desc: "সঠিক উচ্চারণ ও এক্সেন্ট শেখার জন্য নেটিভ স্পিকার সেশন এবং অভিজ্ঞ বাংলাদেশি মেন্টর।",
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
        badge: "実績と信頼",
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
    },
    {
      value: t.stat2Value,
      label: t.stat2Label,
      subtext: t.stat2Sub,
      icon: CheckCircle,
    },
    {
      value: t.stat3Value,
      label: t.stat3Label,
      subtext: t.stat3Sub,
      icon: BookCheck,
    },
    {
      value: t.stat4Value,
      label: t.stat4Label,
      subtext: t.stat4Sub,
      icon: Globe2,
    },
  ];

  const highlights = [
    { title: t.h1Title, desc: t.h1Desc, icon: ShieldCheck },
    { title: t.h2Title, desc: t.h2Desc, icon: GraduationCap },
    { title: t.h3Title, desc: t.h3Desc, icon: Headphones },
    { title: t.h4Title, desc: t.h4Desc, icon: FileCheck },
  ];

  return (
    <section className="py-14 bg-[#fcfaf7] border-b border-stone-200">
      <div className="container-narrow">
        {/* Sleek, Animated Stats Row */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-2 gap-4 lg:grid-cols-4"
        >
          {stats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -4, transition: { duration: 0.18 } }}
                className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs transition-shadow hover:border-stone-300 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {s.value}
                  </span>
                  <div className="p-2 rounded-xl bg-stone-50 text-[#b91c1c] border border-stone-200/60 shadow-2xs">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <h4 className="mt-2 text-sm font-bold text-slate-900 leading-snug">
                  {s.label}
                </h4>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  {s.subtext}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* 4 Pillars Grid */}
        <div className="mt-10 pt-10 border-t border-stone-200">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35 }}
            className="text-center max-w-xl mx-auto mb-8"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-[#b91c1c]">
              {t.badge}
            </p>
            <h2 className="mt-1 text-xl sm:text-2xl font-bold text-slate-900">
              {t.title}
            </h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {highlights.map((h, i) => {
              const HIcon = h.icon;
              return (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  whileHover={{ y: -4, transition: { duration: 0.18 } }}
                  className="rounded-xl bg-white p-5 border border-stone-200 shadow-xs hover:border-stone-300 hover:shadow-md transition-shadow"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-stone-100 text-[#15803d]">
                    <HIcon className="h-4 w-4" />
                  </div>
                  <h3 className="mt-3 text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                    {h.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                    {h.desc}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
