"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { CheckCircle2, CircleDollarSign, FileCheck2, GraduationCap, Home, School, Users, XCircle, ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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

export default function StudyInJapanClient() {
  const { language } = useLanguage();
  const t = translate(
    {
      bn: {
        title: "জাপানে পড়াশোনার প্রিমিয়াম স্টুডেন্ট জার্নি",
        subtitle: "ভর্তি থেকে ভিসা—সব ধাপে অভিভাবক-বান্ধব, পরিষ্কার ও নির্ভরযোগ্য গাইডলাইন।",
        roadmap: "স্টুডেন্ট রোডম্যাপ",
        pathways: "স্টাডি পাথওয়ে",
        eligibility: "ন্যূনতম যোগ্যতা",
        checklist: "ডকুমেন্ট চেকলিস্ট",
        life: "জাপানে স্টুডেন্ট লাইফ",
        packages: "ভিসা সার্ভিস প্যাকেজ",
        faq: "প্রশ্নোত্তর",
        finalTitle: "জাপানে পড়াশোনার পরিকল্পনা আজই শুরু করুন",
        consult: "ফ্রি কনসাল্টেশন নিন",
      },
      en: {
        title: "Premium Student Journey for Study in Japan",
        subtitle: "From admission to visa with clear, parent-friendly, and trusted guidance.",
        roadmap: "Student Roadmap",
        pathways: "Study Pathways",
        eligibility: "Minimum Eligibility",
        checklist: "Document Checklist",
        life: "Student Life in Japan",
        packages: "Visa Service Packages",
        faq: "FAQ",
        finalTitle: "Start your Japan study plan today",
        consult: "Get Free Consultation",
      },
      ja: {
        title: "日本留学のプレミアム学生ジャーニー",
        subtitle: "入学からビザまで、保護者にも分かりやすく信頼できるガイド。",
        roadmap: "学生ロードマップ",
        pathways: "留学パスウェイ",
        eligibility: "最低応募資格",
        checklist: "書類チェックリスト",
        life: "日本での学生生活",
        packages: "ビザサービスパッケージ",
        faq: "よくある質問",
        finalTitle: "日本留学の計画を今日から始めましょう",
        consult: "無料相談を受ける",
      },
    },
    language,
  );

  const heroStats = translate(
    {
      bn: [
        { icon: School, value: "১২+", label: "ইয়ার গাইডেন্স" },
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
        { n: "ভাষা স্কুল", d: "ফাউন্ডেশন তৈরি ও বিশ্ববিদ্যালয় প্রস্তুতি — বছরে ৪টি সেশন: জানুয়ারি, এপ্রিল, জুলাই, অক্টোবর" },
        { n: "বিশ্ববিদ্যালয় ভর্তি", d: "ব্যাচেলর/মাস্টার্স অ্যাডমিশন গাইড — বছরে ২টি সেশন: এপ্রিল, অক্টোবর" },
        { n: "সেনমন স্কুল", d: "স্কিল-কেন্দ্রিক বাস্তবমুখী শিক্ষা" },
      ],
      en: [
        { n: "Language School", d: "Build a foundation for university — 4 intakes/year: Jan, Apr, Jul, Oct" },
        { n: "University", d: "Bachelor/Master admission guidance — 2 intakes/year: Apr, Oct" },
        { n: "Senmon School", d: "Skill-focused practical education" },
      ],
      ja: [
        { n: "日本語学校", d: "大学進学の基盤づくり — 年4回入学：1月・4月・7月・10月" },
        { n: "大学進学", d: "学部・修士の入学支援 — 年2回入学：4月・10月" },
        { n: "専門学校", d: "実践重視の技能教育" },
      ],
    },
    language,
  );

  const eligibility = translate(
    {
      bn: [
        "HSC/ডিপ্লোমা বা সমমান, অথবা অনার্স/মাস্টার্স (সম্পন্ন বা অধ্যয়নরত)",
        "ন্যূনতম GPA ২.৫ — IELTS বা TOEFL-এর প্রয়োজন নেই",
        "সর্বোচ্চ বয়সসীমা ৩০ বছর পর্যন্ত গ্রহণযোগ্য",
        "সর্বোচ্চ ৫–৬ বছর স্টাডি গ্যাপ গ্রহণযোগ্য",
        "N5 লেভেল জাপানি ভাষা কোর্স সম্পন্ন থাকতে হবে",
      ],
      en: [
        "HSC/Diploma or equivalent, or Honours/Masters (completed or currently studying)",
        "Minimum GPA 2.5 — no IELTS or TOEFL required",
        "Maximum age 30 years",
        "Study gap of up to 5–6 years accepted",
        "Must have completed an N5-level Japanese language course",
      ],
      ja: [
        "HSC/ディプロマ以上、または学士・修士（在学中も可）",
        "最低GPA 2.5 — IELTS・TOEFLは不要",
        "上限年齢30歳まで",
        "最大5〜6年のブランクまで許容",
        "N5レベルの日本語コース修了が必要",
      ],
    },
    language,
  );

  const checklist = translate(
    {
      bn: ["পাসপোর্ট ও একাডেমিক ডকুমেন্ট", "ফাইন্যান্সিয়াল প্রুফ", "COE আবেদন ফাইল", "ইন্টারভিউ প্রস্তুতি নোট"],
      en: ["Passport & academics", "Financial proof", "COE application file", "Interview prep notes"],
      ja: ["パスポート・学歴書類", "資金証明", "COE申請書類", "面接対策ノート"],
    },
    language,
  );

  const lifeCards = translate(
    {
      bn: [
        { title: "পার্ট-টাইম সুযোগ", desc: "সপ্তাহে ২৮ ঘণ্টা, মাসে ১২০ ঘণ্টা পর্যন্ত; ছুটিতে ফুলটাইম পর্যন্ত সুযোগ" },
        { title: "নিরাপদ হোস্টেল/বাসস্থান", desc: "যাচাইকৃত আবাসন ব্যবস্থাপনায় সহায়তা" },
        { title: "কালচারাল অ্যাডাপ্টেশন", desc: "ভাষা, নিয়মকানুন ও দৈনন্দিন জীবনে দ্রুত মানিয়ে নেওয়ার গাইড" },
      ],
      en: [
        { title: "Part-time options", desc: "Up to 28 hrs/week, 120 hrs/month; near full-time during school breaks" },
        { title: "Safe hostel/housing", desc: "Support finding verified student accommodation" },
        { title: "Cultural adaptation", desc: "Guidance on language, etiquette, and daily life in Japan" },
      ],
      ja: [
        { title: "アルバイト機会", desc: "週28時間・月120時間まで、長期休暇中はフルタイムも可能" },
        { title: "安心できる寮・住居", desc: "確認済みの学生向け住居探しをサポート" },
        { title: "異文化適応", desc: "言語・マナー・日本での生活習慣へのスムーズな適応指導" },
      ],
    },
    language,
  );

  const packages = translate(
    {
      bn: {
        regularLabel: "রেগুলার প্যাকেজ",
        regularPrice: "BDT ৮০,০০০",
        regularNote: "ডকুমেন্টেশন ও ফাইল প্রসেসিং সাপোর্ট",
        premiumLabel: "প্রিমিয়াম প্যাকেজ",
        premiumPrice: "BDT ১,৫০,০০০",
        premiumNote: "সম্পূর্ণ ওয়ান-স্টপ সাপোর্ট",
        itemHeader: "সেবা তালিকা",
        studentPays: "শিক্ষার্থী বহন করবে",
        knltcPays: "KNLTC বহন করবে",
        cta: "প্যাকেজ বেছে নিন",
      },
      en: {
        regularLabel: "Regular Package",
        regularPrice: "BDT 80,000",
        regularNote: "Documentation & processing support",
        premiumLabel: "Premium Package",
        premiumPrice: "BDT 150,000",
        premiumNote: "Full one-stop support",
        itemHeader: "Services",
        studentPays: "Student pays",
        knltcPays: "KNLTC covers",
        cta: "Choose a package",
      },
      ja: {
        regularLabel: "レギュラープラン",
        regularPrice: "BDT 80,000",
        regularNote: "書類作成と申請手続き支援",
        premiumLabel: "プレミアムプラン",
        premiumPrice: "BDT 150,000",
        premiumNote: "ワンストップ完全サポート",
        itemHeader: "サービス一覧",
        studentPays: "学生負担",
        knltcPays: "KNLTC負担",
        cta: "プランを選ぶ",
      },
    },
    language,
  );

  const packageItems = translate(
    {
      bn: ["COE আবেদন ফি", "অরিজিনাল সার্টিফিকেট ট্র্যান্সলেশন", "নোটারি ও লিগ্যালাইজেশন", "মক ইন্টারভিউ সেশন", "জাপানে এয়ারপোর্ট সাপোর্ট"],
      en: ["COE Application Fee", "Original Certificate Translation", "Notary & Legalization", "Mock Interview Sessions", "Japan Airport Pickup"],
      ja: ["在留資格認定申請料", "証明書原本翻訳", "公証および認証", "模擬面接対策", "現地空港出迎え"],
    },
    language,
  );

  const faqs = translate(
    {
      bn: [
        { q: "স্টাডি গ্যাপ কতটা গ্রহণযোগ্য?", a: "সাধারণত ৫–৬ বছর গ্রহণযোগ্য; যৌক্তিক ব্যাখ্যা থাকলে আরও বিবেচনা করা হয়।" },
        { q: "পিতা-মাতা ছাড়া অন্য কেউ কি স্পনসর হতে পারে?", a: "হ্যাঁ, রক্তের সম্পর্কের উপযুক্ত আত্মীয় আর্থিক সক্ষমতা দেখালে স্পনসর হতে পারেন।" },
        { q: "জাপানে গিয়ে পার্ট-টাইম কাজ করা যাবে?", a: "হ্যাঁ, অনুমতি সাপেক্ষে সপ্তাহে ২৮ ঘণ্টা পর্যন্ত বৈধ কাজের সুযোগ রয়েছে।" },
      ],
      en: [
        { q: "How much study gap is acceptable?", a: "Generally 5–6 years; longer gaps can be considered with valid reasons." },
        { q: "Can someone other than parents be a financial sponsor?", a: "Yes, immediate relatives with verified financial capacity can sponsor." },
        { q: "Can I do part-time work in Japan as a student?", a: "Yes, up to 28 hours per week with student work permit." },
      ],
      ja: [
        { q: "学歴のブランクはどのくらいまで許容されますか？", a: "通常5〜6年程度ですが、合理的な理由があれば相談可能です。" },
        { q: "両親以外の親族を経費支弁者にできますか？", a: "はい、資金力のある血縁関係者であれば可能です。" },
        { q: "留学中にアルバイトはできますか？", a: "はい、資格外活動許可により週28時間まで可能です。" },
      ],
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
            <span>KNLTC Study in Japan Wing</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 md:text-4xl tracking-tight">{t.title}</h1>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl">{t.subtitle}</p>

          <div className="mt-6 grid grid-cols-3 gap-3">
            {heroStats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="rounded-xl border border-stone-200 bg-[#fcfaf7] p-3 text-center">
                  <Icon className="mx-auto h-5 w-5 text-[#b91c1c] mb-1" />
                  <p className="text-base sm:text-lg font-extrabold text-slate-900">{stat.value}</p>
                  <p className="text-[11px] text-slate-500 font-medium">{stat.label}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-[#15803d] hover:bg-emerald-700 text-white rounded-xl shadow-xs text-xs sm:text-sm active:scale-95 transition-transform">
              <Link href="/contact" className="flex items-center gap-2">
                <span>{t.consult}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-stone-300 text-slate-800 hover:bg-stone-50 rounded-xl text-xs sm:text-sm active:scale-95 transition-transform">
              <a href="tel:+8801805013633">+880 1805 013633</a>
            </Button>
          </div>
        </motion.section>

        {/* Roadmap */}
        <section>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-title"
          >
            {t.roadmap}
          </motion.h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
          >
            {roadmap.map((step, i) => (
              <motion.div
                key={step}
                variants={itemVariants}
                whileHover={{ y: -3, transition: { duration: 0.15 } }}
                className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white p-4 shadow-2xs hover:border-stone-300 transition-colors"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-red-50 text-[#b91c1c] text-xs font-bold">
                  {i + 1}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-800">{step}</span>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Pathways */}
        <section>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-title"
          >
            {t.pathways}
          </motion.h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="mt-6 grid gap-4 md:grid-cols-3"
          >
            {pathways.map((path) => (
              <motion.div
                key={path.n}
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs hover:border-stone-300 hover:shadow-md transition-shadow"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 text-[#b91c1c] mb-3">
                  <School className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">{path.n}</h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">{path.d}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Minimum Eligibility */}
        <section>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-title"
          >
            {t.eligibility}
          </motion.h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="mt-6 grid gap-3 md:grid-cols-2"
          >
            {eligibility.map((item) => (
              <motion.div
                key={item}
                variants={itemVariants}
                whileHover={{ x: 4, transition: { duration: 0.15 } }}
                className="flex items-start gap-2.5 rounded-xl border border-stone-200 bg-white p-4 shadow-2xs hover:border-stone-300 transition-all"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#15803d]" />
                <span className="text-xs sm:text-sm text-slate-700 leading-relaxed">{item}</span>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Document Checklist */}
        <section>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-title"
          >
            {t.checklist}
          </motion.h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="mt-6 grid gap-3 md:grid-cols-2"
          >
            {checklist.map((item) => (
              <motion.div
                key={item}
                variants={itemVariants}
                whileHover={{ x: 4, transition: { duration: 0.15 } }}
                className="flex items-center gap-2.5 rounded-xl border border-stone-200 bg-white p-4 text-xs sm:text-sm font-semibold text-slate-800 shadow-2xs hover:border-stone-300 transition-all"
              >
                <CheckCircle2 className="h-4 w-4 text-[#15803d] shrink-0" />
                <span>{item}</span>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Student Life */}
        <section>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-title"
          >
            {t.life}
          </motion.h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="mt-6 grid gap-4 md:grid-cols-3"
          >
            {lifeCards.map((card) => (
              <motion.div
                key={card.title}
                variants={itemVariants}
                whileHover={{ y: -4, transition: { duration: 0.18 } }}
                className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs hover:border-stone-300 hover:shadow-md transition-shadow"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-[#15803d] mb-3">
                  <Home className="h-4 w-4" />
                </div>
                <p className="font-bold text-slate-900 text-sm sm:text-base">{card.title}</p>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Packages */}
        <section>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-title"
          >
            {t.packages}
          </motion.h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <Card className="rounded-2xl border-stone-200 shadow-xs bg-white">
              <CardHeader>
                <Badge variant="outline" className="w-fit border-stone-300 text-slate-600">
                  {packages.regularLabel}
                </Badge>
                <CardTitle className="text-2xl text-slate-900">{packages.regularPrice}</CardTitle>
                <p className="text-xs text-slate-500">{packages.regularNote}</p>
              </CardHeader>
              <CardContent className="space-y-2.5">
                {packageItems.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                    <XCircle className="h-4 w-4 shrink-0 text-slate-400" />
                    <span>
                      {item} — {packages.studentPays}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-2 border-slate-900 shadow-md bg-white">
              <CardHeader>
                <Badge className="w-fit bg-[#b91c1c] text-white hover:bg-red-800">{packages.premiumLabel}</Badge>
                <CardTitle className="text-2xl text-slate-900">{packages.premiumPrice}</CardTitle>
                <p className="text-xs text-slate-500">{packages.premiumNote}</p>
              </CardHeader>
              <CardContent className="space-y-2.5">
                {packageItems.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs sm:text-sm text-slate-800 font-medium">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[#15803d]" />
                    <span>
                      {item} — {packages.knltcPays}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 overflow-x-auto rounded-2xl border border-stone-200 bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{packages.itemHeader}</TableHead>
                  <TableHead className="text-center">{packages.regularLabel}</TableHead>
                  <TableHead className="text-center">{packages.premiumLabel}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {packageItems.map((item) => (
                  <TableRow key={item}>
                    <TableCell className="flex items-center gap-2 font-medium text-slate-700 text-xs sm:text-sm">
                      <CircleDollarSign className="h-4 w-4 text-slate-400 shrink-0" />
                      {item}
                    </TableCell>
                    <TableCell className="text-center text-slate-400">
                      <XCircle className="mx-auto h-4 w-4" />
                    </TableCell>
                    <TableCell className="text-center text-[#15803d]">
                      <CheckCircle2 className="mx-auto h-4 w-4" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-6 flex justify-center">
            <Button asChild size="lg" className="bg-[#b91c1c] text-white hover:bg-red-800 rounded-xl px-7 py-6 text-xs sm:text-sm active:scale-95 transition-transform">
              <Link href="/contact" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                <span>{packages.cta}</span>
              </Link>
            </Button>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-title"
          >
            {t.faq}
          </motion.h2>
          <div className="mt-6 space-y-3">
            {faqs.map((item) => (
              <details key={item.q} className="rounded-xl border border-stone-200 bg-white p-4 shadow-2xs group">
                <summary className="cursor-pointer font-bold text-slate-900 text-xs sm:text-sm group-hover:text-[#b91c1c] transition-colors">{item.q}</summary>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Final CTA */}
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
