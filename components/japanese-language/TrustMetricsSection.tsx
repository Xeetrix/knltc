"use client";

import { motion } from "motion/react";
import {
  Award,
  BookCheck,
  CheckCircle,
  ExternalLink,
  FileCheck,
  Globe2,
  GraduationCap,
  Headphones,
  ShieldCheck,
  Star,
  UserCheck,
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
        stat2Label: "JFT / JLPT / NAT Pass Rate",
        stat2Sub: "Result of our structured mock test and individual mentoring",
        stat3Value: "100%",
        stat3Label: "Free Study Materials",
        stat3Sub: "Irodori & Minna No Nihongo books, sheets & audio free",
        stat4Value: "150 Hrs",
        stat4Label: "Immigration Certified",
        stat4Sub: "Campuses in Dhaka (Paltan) & Khulna + Online Live Hub",
        badge: "Accreditation & Standards",
        title: "Why Learn Japanese with KNLTC?",
        h1Title: "JFT-Basic (Irodori), JLPT & NAT Certified Syllabus",
        h1Desc: "150-hour curriculum aligned with Japan Foundation and Immigration Services Agency of Japan.",
        h2Title: "Senior Sensei Amir Hossen & Native Japanese Panel",
        h2Desc: "7+ years real-life experience in Japan, N2/N1 mentorship, and authentic Japanese accent coaching.",
        h3Title: "Listening Lab & Spoken Baitō Drills",
        h3Desc: "Practical conversational practice for university interviews, part-time jobs, and SSW workplaces.",
        h4Title: "COE & Embassy Visa Guidance",
        h4Desc: "Full support for sponsorship documents, school matching, and embassy interviews.",
        senseiBadge: "Faculty Spotlight • Lead Academic Mentor",
        senseiName: "Senior Sensei Amir Hossen",
        senseiRole: "Head of Japanese Language & Interpreter (7+ Years in Japan)",
        senseiBio:
          "With over 7 years of real-life study, corporate work, and interpretation experience in Japan, Senior Sensei Amir Hossen leads KNLTC's JFT-Basic (Irodori) and JLPT N5–N2 programs alongside native Japanese instructors—training students in authentic pronunciation, embassy interviews, and real Japanese workplace etiquette.",
        senseiTag1: "7+ Years Lived & Worked in Japan",
        senseiTag2: "JLPT N2/N1 & JFT-Basic Specialist",
        senseiTag3: "Embassy & School Interview Coach",
        passersTitle: "Recent Verified JFT-Basic (Irodori), JLPT & NAT-TEST Passers",
        passersSub: "Students from Dhaka, Khulna & Online Live Batches",
        trustpilotBtn: "Read Verified Student Reviews on Trustpilot",
        passers: [
          {
            name: "Tanvir Hasan",
            batch: "JFT-Basic (Irodori) • Student Visa Track",
            score: "235 / 250 (Passed)",
            city: "Dhaka Batch",
          },
          {
            name: "Mehedi Hasan",
            batch: "JLPT N5 + Irodori • April Intake",
            score: "162 / 180 (A Grade)",
            city: "Khulna Branch",
          },
          {
            name: "Sadia Afrin",
            batch: "NAT-TEST 5Q • Student Visa",
            score: "158 / 180 (Passed)",
            city: "Online Zoom",
          },
          {
            name: "Rakibul Islam",
            batch: "JLPT N4 & JFT-Basic • SSW Track",
            score: "228 / 250 (Passed)",
            city: "Dhaka Batch",
          },
        ],
      },
      bn: {
        stat1Value: "১,২০০+",
        stat1Label: "ভিসা সাকসেস রেকর্ড",
        stat1Sub: "স্টুডেন্ট, SSW ও TITP ক্যাটাগরিতে জাপান পৌঁছানো শিক্ষার্থী",
        stat2Value: "৯৮%",
        stat2Label: "JFT / JLPT / NAT পাস রেট",
        stat2Sub: "আমাদের স্পেশাল মক টেস্ট ও নিবিড় মনিটরিং মেথডের ফলাফল",
        stat3Value: "১০০%",
        stat3Label: "ফ্রি স্টাডি ম্যাটেরিয়ালস",
        stat3Sub: "ইরোদেরি ও মিন্না নো নিহোঙ্গো বই, লেকচার শিট ও অডিও ফাইল ফ্রি",
        stat4Value: "১৫০ ঘণ্টা",
        stat4Label: "ইমিগ্রেশন সার্টিফাইড কোর্স",
        stat4Sub: "ঢাকা (নয়া পল্টন) ও খুলনা ক্যাম্পাস এবং অনলাইন লাইভ লার্নিং হাব",
        badge: "বিশ্বাস ও নির্ভরযোগ্যতা",
        title: "কেন KNLTC জাপানিজ ল্যাঙ্গুয়েজ কোর্স সেরা?",
        h1Title: "JFT-Basic (Irodori), JLPT ও NAT সার্টিফাইড সিলেবাস",
        h1Desc: "জাপান ফাউন্ডেশন ও জাপান ইমিগ্রেশনের ১৫০ ঘণ্টার বাধ্যতামূলক মানদণ্ড অনুযায়ী সাজানো।",
        h2Title: "সিনিয়র সেন্সি আমির হোসেন ও নেটিভ জাপানিজ প্যানেল",
        h2Desc: "জাপানে ৭+ বছরের বাস্তব অভিজ্ঞতাসম্পন্ন মেন্টর এবং নেটিভ জাপানি স্পিকারদের সরাসরি তত্ত্বাবধান।",
        h3Title: "অডিও-ভিজুয়াল লিসেনিং ল্যাব ও স্পোকেন ড্রিলস",
        h3Desc: "স্টুডেন্ট ভিসার পার্ট-টাইম জব (Baitō) এবং SSW কর্মক্ষেত্রের জন্য প্র্যাকটিক্যাল জাপানি কথোপকথন।",
        h4Title: "এম্বাসি ফাইল ও COE প্রসেসিং ফুল গাইডেন্স",
        h4Desc: "ভাষা শেষ করার পর স্পন্সর ডকুমেন্টস, স্পেশালাইজড ভিসা প্রিপারেশন এবং স্কুল ম্যাচিং সাপোর্ট।",
        senseiBadge: "ইন্সট্রাক্টর স্পটলাইট • প্রধান একাডেমিক মেন্টর",
        senseiName: "সিনিয়র সেন্সি আমির হোসেন (Senior Sensei Amir Hossen)",
        senseiRole: "প্রধান জাপানি ভাষা প্রশিক্ষক ও দোভাষী (জাপানে ৭+ বছরের বাস্তব অভিজ্ঞতা)",
        senseiBio:
          "জাপানে দীর্ঘ ৭ বছরেরও বেশি সময় সরাসরি বসবাস, উচ্চশিক্ষা ও জাপানি প্রতিষ্ঠানে দোভাষী হিসেবে কাজের বাস্তব অভিজ্ঞতা নিয়ে সিনিয়র সেন্সি আমির হোসেন KNLTC-এর একাডেমিক টিম পরিচালনা করছেন। নেটিভ জাপানি শিক্ষকদের সাথে সমন্বয় করে তিনি স্টুডেন্ট ভিসা ও জব ভিসার শিক্ষার্থীদের JFT-Basic (Irodori), JLPT N5–N2 এবং এম্বাসি ইন্টারভিউয়ের জন্য হাতে-কলমে প্রস্তুত করেন।",
        senseiTag1: "জাপানে ৭+ বছরের বাস্তব অভিজ্ঞতা",
        senseiTag2: "JLPT N2/N1 ও JFT (Irodori) স্পেশালিস্ট",
        senseiTag3: "এম্বাসি ও স্কুল ইন্টারভিউ মেন্টর",
        passersTitle: "সাম্প্রতিক ভেরিফায়েড JFT-Basic (Irodori), JLPT ও NAT উত্তীর্ণ শিক্ষার্থী",
        passersSub: "ঢাকা হেড অফিস, খুলনা শাখা ও অনলাইন লাইভ ব্যাচের সাফল্য",
        trustpilotBtn: "Trustpilot-এ শিক্ষার্থীদের ভেরিফায়েড রিভিউ দেখুন",
        passers: [
          {
            name: "তানভীর হাসান",
            batch: "JFT-Basic (Irodori) • স্টুডেন্ট ভিসা ট্র্যাক",
            score: "২৩৫ / ২৫০ (উত্তীর্ণ)",
            city: "ঢাকা ব্যাচ",
          },
          {
            name: "মেহেদী হাসান",
            batch: "JLPT N5 + Irodori • এপ্রিল সেশন",
            score: "১৬২ / ১৮০ (A গ্রেড)",
            city: "খুলনা শাখা",
          },
          {
            name: "সাদিয়া আফরিন",
            batch: "NAT-TEST 5Q • স্টুডেন্ট ভিসা",
            score: "১৫৮ / ১৮০ (উত্তীর্ণ)",
            city: "অনলাইন জুম",
          },
          {
            name: "রাকিবুল ইসলাম",
            batch: "JLPT N4 ও JFT-Basic • SSW ট্র্যাক",
            score: "২২৮ / ২৫০ (উত্তীর্ণ)",
            city: "ঢাকা ব্যাচ",
          },
        ],
      },
      ja: {
        stat1Value: "1,200名+",
        stat1Label: "日本渡航ビザ取得実績",
        stat1Sub: "留学生、特定技能（SSW）、技能実習生を日本へ輩出",
        stat2Value: "98%",
        stat2Label: "JFT / JLPT / NAT合格率",
        stat2Sub: "定期模擬テストと個別指導による確かな合格実績",
        stat3Value: "100%",
        stat3Label: "オリジナル教材無料提供",
        stat3Sub: "『いろどり』『みんなの日本語』、漢字ドリル、音声を無償配布",
        stat4Value: "150時間+",
        stat4Label: "入管基準カリキュラム",
        stat4Sub: "ダッカ本部・クルナ支部およびオンラインLIVE学習ハブ",
        badge: "実績と信頼",
        title: "KNLTC日本語アカデミーが選ばれる理由",
        h1Title: "JFT-Basic（いろどり）・JLPT・NAT公式基準",
        h1Desc: "国際交流基金および出入国在留管理庁の150時間基準に完全準拠。",
        h2Title: "アミール・ホセン主任講師＆日本人ネイティブ講師陣",
        h2Desc: "日本滞在7年以上の実務・通訳経験を持つ主任講師とネイティブ講師による直接指導。",
        h3Title: "音声リスニングラボ＆実践会話ドリル",
        h3Desc: "留学後のアルバイト面接や特定技能の職場で即戦力となる会話力を養成。",
        h4Title: "COE・ビザ申請・大使館面接フルサポート",
        h4Desc: "語学修了後の学校選定、申請書類審査、面接シミュレーションまで一貫支援。",
        senseiBadge: "講師紹介 • 主任アカデミックメンター",
        senseiName: "アミール・ホセン 主任講師 (Senior Sensei Amir Hossen)",
        senseiRole: "日本語教育主任・専門通訳（日本在住・実務経験7年以上）",
        senseiBio:
          "日本での7年以上にわたる留学・企業実務・通訳経験を活かし、KNLTCの『JFT-Basic（いろどり）』およびJLPT N5〜N2課程を統括。日本人ネイティブ講師陣と連携し、正確な発音、大使館面接対策、日本での生活・職場マナーを実践的に指導しています。",
        senseiTag1: "日本滞在・実務経験7年以上",
        senseiTag2: "JLPT N2/N1 & JFT指導専門",
        senseiTag3: "大使館・学校面接トレーナー",
        passersTitle: "JFT-Basic（いろどり）・JLPT・NAT 合格実績（一部抜粋）",
        passersSub: "ダッカ校・クルナ校・オンラインLIVEクラスの合格者",
        trustpilotBtn: "Trustpilotで受講生の口コミを見る",
        passers: [
          {
            name: "Tanvir Hasan",
            batch: "JFT-Basic (いろどり) • 留学ビザ",
            score: "235 / 250 (合格)",
            city: "ダッカ校",
          },
          {
            name: "Mehedi Hasan",
            batch: "JLPT N5 + いろどり • 4月生",
            score: "162 / 180 (A判定)",
            city: "クルナ校",
          },
          {
            name: "Sadia Afrin",
            batch: "NAT-TEST 5Q • 留学ビザ",
            score: "158 / 180 (合格)",
            city: "オンライン",
          },
          {
            name: "Rakibul Islam",
            batch: "JLPT N4 & JFT-Basic • 特定技能",
            score: "228 / 250 (合格)",
            city: "ダッカ校",
          },
        ],
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
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight tabular-nums">
                    {s.value}
                  </span>
                  <div className="p-2 rounded-xl bg-stone-50 text-[#b91c1c] border border-stone-200/60 shadow-2xs">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <h4 className="mt-2 text-sm font-bold text-slate-900 leading-relaxed">
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
            <h2 className="mt-1 text-xl sm:text-2xl font-bold text-slate-900 leading-relaxed">
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
                  <h3 className="mt-3 text-xs sm:text-sm font-bold text-slate-900 leading-relaxed">
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

        {/* Dedicated Instructor Spotlight Card: Senior Sensei Amir Hossen */}
        <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 sm:p-7 shadow-xs">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-8 space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#b91c1c]">
                <UserCheck className="h-4 w-4 text-[#1E5631]" />
                <span>{t.senseiBadge}</span>
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-relaxed">
                {t.senseiName}
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-[#1E5631]">
                {t.senseiRole}
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t.senseiBio}
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-2.5 rounded-xl bg-[#fcfaf7] border border-stone-200/80 p-4 text-xs font-semibold text-slate-800">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-[#1E5631] shrink-0" />
                <span>{t.senseiTag1}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-[#b91c1c] shrink-0" />
                <span>{t.senseiTag2}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-[#1E5631] shrink-0" />
                <span>{t.senseiTag3}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Verified Student Passers & Trustpilot Strip */}
        <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-5 sm:p-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed">
                {t.passersTitle}
              </h3>
              <p className="text-xs text-slate-500">{t.passersSub}</p>
            </div>
            <a
              href="https://www.trustpilot.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-bold text-[#1E5631] hover:bg-emerald-100 transition shrink-0"
            >
              <Star className="h-3.5 w-3.5 fill-current text-[#1E5631]" />
              <span>{t.trustpilotBtn}</span>
              <ExternalLink className="h-3 w-3 opacity-70" />
            </a>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {t.passers.map((p, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-stone-200/80 bg-[#fcfaf7] p-3.5 text-xs"
              >
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>{p.name}</span>
                  <span className="text-[11px] font-medium text-slate-500">{p.city}</span>
                </div>
                <p className="mt-1 text-[11px] text-slate-600 leading-relaxed">{p.batch}</p>
                <p className="mt-1.5 font-mono text-[11px] font-bold text-[#1E5631] tabular-nums">
                  {p.score}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
