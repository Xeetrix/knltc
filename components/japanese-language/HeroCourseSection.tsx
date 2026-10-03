"use client";

import { motion } from "motion/react";
import {
  ArrowRight,
  BookCheck,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  MessageCircle,
  PhoneCall,
  ShieldCheck,
  Award,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";

export default function HeroCourseSection() {
  const { language } = useLanguage();

  const t = translate(
    {
      en: {
        badge: "Official Japanese Language Academy • Dhaka Center",
        headlinePart1: "Learn Japanese the Easy Way",
        headlineHighlight: "Gateway to Higher Study & Career in Japan",
        subtitle:
          "Targeted JLPT, NAT-TEST, and JFT-Basic preparation from N5 to N1 and practical Irodori Japanese. Live online interactive classes, classroom training, and 24/7 digital LMS classroom portal.",
        stat1: "98% Pass Rate",
        stat1Sub: "JLPT & NAT First Attempt",
        stat2: "1,200+ Visas",
        stat2Sub: "Student & SSW to Japan",
        stat3: "100% Free Materials",
        stat3Sub: "Textbooks, Sheets & Audio",
        ctaEnroll: "Explore Courses & Enroll",
        ctaLms: "Enter LMS Classroom",
        hotlineLabel: "Admission Hotline:",
        cardTag: "Official KNLTC Portal",
        cardTitle: "Digital Classroom & LMS Gateway",
        cardSub: "Live Digital Campus & Student Portal",
        cardBadge: "Admissions Open",
        startingFee: "Starting from ৳12,000",
        feeNote: "2 Easy Installments (50% + 50%)",
        feature1: "Minna No Nihongo textbooks & audio free",
        feature2: "Live interactive Zoom & offline Dhaka campus",
        feature3: "Includes 3 free bonus courses worth ৳15,000",
        inc1: "JLPT, NAT & JFT Certified",
        inc2: "Native Japanese Instructors",
        inc3: "3 Free Bonus Courses",
        btnEnrollNow: "Apply for Admission",
        btnLmsPortal: "Open LMS Portal",
        waChat: "Chat on WhatsApp",
      },
      bn: {
        badge: "KNLTC অফিশিয়াল জাপানিজ একাডেমি • ঢাকা হেড অফিস",
        headlinePart1: "সহজ পদ্ধতিতে জাপানি ভাষা শিখুন",
        headlineHighlight: "জাপানে উচ্চশিক্ষা ও নিশ্চিত ক্যারিয়ারের বিশ্বস্ত গেটওয়ে",
        subtitle:
          "N5 থেকে N1 লেভেল এবং প্র্যাকটিক্যাল ইরোদোরি (Irodori Japanese) সমন্বিত সুবিন্যস্ত প্রস্তুতি। JLPT, NAT-TEST ও JFT-Basic পরীক্ষায় শতভাগ পাসের নিশ্চয়তা এবং সরাসরি KNLTC ডিজিটাল LMS ক্লাসরুম সুবিধা।",
        stat1: "৯৮% পাসের হার",
        stat1Sub: "JLPT ও NAT প্রথমবারই",
        stat2: "১,২০০+ ভিসা",
        stat2Sub: "জাপানে অধ্যয়ন ও জব ভিসা",
        stat3: "১০০% ফ্রি পাঠ্যবই",
        stat3Sub: "মিন্না নো নিহোঙ্গো ও শিট",
        ctaEnroll: "কোর্স অপশন ও ভর্তি",
        ctaLms: "LMS ক্লাসরুমে প্রবেশ",
        hotlineLabel: "এডমিশন হটলাইন:",
        cardTag: "অফিশিয়াল KNLTC পোর্টাল",
        cardTitle: "ডিজিটাল ক্লাসরুম ও LMS গেটওয়ে",
        cardSub: "অফিশিয়াল ডিজিটাল স্টুডেন্ট পোর্টাল",
        cardBadge: "ভর্তি চলছে",
        startingFee: "কোর্স ফি শুরু ৳১২,০০০ থেকে",
        feeNote: "২টি সহজ কিস্তিতে পরিশোধযোগ্য (৫০% + ৫০%)",
        feature1: "মিন্না নো নিহোঙ্গো ১ ও ২ পাঠ্যবই ও অডিও ফাইল সম্পূর্ণ ফ্রি",
        feature2: "অনলাইন লাইভ জুম ও পল্টন/ধানমন্ডি ক্যাম্পাসে ক্লাস",
        feature3: "১৫,০০০ টাকা মূল্যের ৩টি স্পেশাল ইন্টারভিউ ও সিভি কোর্স ফ্রি",
        inc1: "JLPT, NAT ও JFT সার্টিফাইড",
        inc2: "নেটিভ জাপানিজ শিক্ষক",
        inc3: "৩টি বোনাস কোর্স ফ্রি",
        btnEnrollNow: "ভর্তির আবেদন করুন",
        btnLmsPortal: "LMS পোর্টালে প্রবেশ",
        waChat: "হোয়াটসঅ্যাপে পরামর্শ",
      },
      ja: {
        badge: "公認 日本語アカデミー • ダッカ本部センター",
        headlinePart1: "わかりやすい日本語学習",
        headlineHighlight: "日本留学・就職への確かなゲートウェイ",
        subtitle:
          "N5〜N1および実践『いろどり日本語』に対応。JLPT・NAT・JFT合格とオンラインLMS教室による徹底サポート。",
        stat1: "98%合格率",
        stat1Sub: "JLPT・NAT一発合格",
        stat2: "1,200名ビザ取得",
        stat2Sub: "留学生・特定技能人材",
        stat3: "教材完全無料",
        stat3Sub: "テキスト・音声配布",
        ctaEnroll: "コース詳細・受講申請",
        ctaLms: "LMS教室へ入室",
        hotlineLabel: "相談窓口:",
        cardTag: "公式 KNLTCポータル",
        cardTitle: "デジタル教室・公式LMSゲートウェイ",
        cardSub: "公式オンライン学習ポータル",
        cardBadge: "受講受付中",
        startingFee: "受講料 ৳12,000〜",
        feeNote: "2回分割払い可能（50% + 50%）",
        feature1: "『みんなの日本語』教科書＆音声データ無償提供",
        feature2: "オンラインLIVE講義およびダッカ対面授業",
        feature3: "15,000タカ相当の面接・履歴書3大特典講座無料",
        inc1: "JLPT・NAT・JFT認定",
        inc2: "日本人ネイティブ講師",
        inc3: "3大特典講座が無料",
        btnEnrollNow: "受講申込みへ",
        btnLmsPortal: "LMSポータルを開く",
        waChat: "WhatsApp相談",
      },
    },
    language,
  );

  const scrollToCourses = () => {
    const el = document.getElementById("course-options");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToForm = () => {
    const el = document.getElementById("enrollment-form");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-[#fcfaf7] pt-8 pb-14 md:pt-12 md:pb-20 border-b border-stone-200">
      <div className="container-narrow relative z-10">
        {/* Top Trust Strip - Smart & Minimalist */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-stone-200/80 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-[#b91c1c] uppercase tracking-wider text-[11px]">
              {t.badge}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-6 font-medium text-slate-700">
            <div className="flex items-center gap-1.5">
              <Award className="h-3.5 w-3.5 text-[#15803d]" />
              <span>{t.stat1}</span>
            </div>
            <span className="text-stone-300">|</span>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-[#b91c1c]" />
              <span>{t.stat2}</span>
            </div>
            <span className="text-stone-300">|</span>
            <div className="flex items-center gap-1.5">
              <BookCheck className="h-3.5 w-3.5 text-slate-800" />
              <span>{t.stat3}</span>
            </div>
          </div>
        </div>

        {/* Main 2-Column Hero */}
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          {/* Left Column (Headline + Value + CTAs) */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] as const }}
            className="lg:col-span-7 space-y-6"
          >
            <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-[2.85rem] leading-[1.18]">
              <span className="block text-slate-900">{t.headlinePart1}</span>
              <span className="block mt-2 font-extrabold text-[#b91c1c] text-2xl sm:text-3xl lg:text-[2.25rem] leading-snug">
                {t.headlineHighlight}
              </span>
            </h1>

            <p className="text-base sm:text-lg leading-relaxed text-slate-700 font-normal max-w-2xl">
              {t.subtitle}
            </p>

            {/* Inclusions Row */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs sm:text-sm text-slate-700 font-medium pt-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#15803d]" />
                <span>{t.inc1}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#15803d]" />
                <span>{t.inc2}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#15803d]" />
                <span>{t.inc3}</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <motion.div whileHover={{ y: -2, scale: 1.015 }} whileTap={{ scale: 0.97 }}>
                <Button
                  onClick={scrollToCourses}
                  size="lg"
                  className="w-full sm:w-auto bg-[#b91c1c] hover:bg-red-800 text-white font-semibold text-sm sm:text-base px-7 py-6 rounded-xl shadow-xs transition-colors"
                >
                  <span>{t.ctaEnroll}</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>

              <motion.div whileHover={{ y: -2, scale: 1.015 }} whileTap={{ scale: 0.97 }}>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-stone-300 text-slate-800 hover:bg-white font-semibold text-sm sm:text-base px-6 py-6 rounded-xl transition-colors shadow-2xs"
                >
                  <a
                    href="https://npw.bd/knltc"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <GraduationCap className="mr-2 h-5 w-5 text-[#b91c1c]" />
                    <span>{t.ctaLms}</span>
                    <ExternalLink className="ml-2 h-4 w-4 text-slate-400" />
                  </a>
                </Button>
              </motion.div>
            </div>

            {/* Hotline & WhatsApp strip */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-3 border-t border-stone-200/80">
              <div className="flex items-center gap-2">
                <PhoneCall className="h-3.5 w-3.5 text-[#b91c1c]" />
                <span>
                  {t.hotlineLabel}{" "}
                  <a
                    href="tel:+8801805013633"
                    className="font-bold text-slate-900 hover:text-[#b91c1c] transition-colors"
                  >
                    +880 1805 013633
                  </a>
                </span>
              </div>
              <span className="text-slate-300">|</span>
              <a
                href="https://wa.me/8801805013633?text=Hello%20KNLTC,%20I%20want%20to%20enroll%20in%20the%20Japanese%20Language%20Course."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-semibold text-[#15803d] hover:underline transition-colors"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                <span>{t.waChat}</span>
              </a>
            </div>
          </motion.div>

          {/* Right Column - Smart Institutional Portal Preview Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.12, ease: [0.16, 1, 0.3, 1] as const }}
            className="lg:col-span-5"
          >
            <div className="relative rounded-2xl border border-stone-200 bg-white p-6 sm:p-7 shadow-xs hover:border-stone-300 transition-colors">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <div>
                  <span className="text-[11px] font-bold tracking-wider uppercase text-[#b91c1c]">
                    {t.cardTag}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5 leading-snug">
                    {t.cardTitle}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    {t.cardSub}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-[11px] font-semibold text-emerald-800">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#15803d] animate-pulse" />
                  <span>{t.cardBadge}</span>
                </span>
              </div>

              {/* Price Banner */}
              <div className="mt-4 rounded-xl bg-[#fcfaf7] border border-stone-200/80 p-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                    {t.startingFee}
                  </span>
                  <span className="text-xs font-semibold text-[#15803d] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    N5 to N1
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-600 font-medium">
                  {t.feeNote}
                </p>
              </div>

              {/* Inclusions Checklist */}
              <div className="mt-4 space-y-2 text-xs text-slate-700">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#15803d] shrink-0 mt-0.5" />
                  <span className="leading-snug">{t.feature1}</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#15803d]" />
                  <span className="leading-snug">{t.feature2}</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#15803d]" />
                  <span className="leading-snug">{t.feature3}</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-6 pt-4 border-t border-stone-100 flex gap-2.5">
                <Button
                  onClick={scrollToForm}
                  className="flex-1 bg-[#b91c1c] hover:bg-red-800 text-white font-semibold text-xs py-5 rounded-xl shadow-xs active:scale-[0.98] transition-transform"
                >
                  {t.btnEnrollNow}
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-stone-300 hover:bg-stone-50 text-slate-800 text-xs font-semibold py-5 px-3.5 rounded-xl shrink-0 active:scale-[0.98] transition-transform"
                >
                  <a
                    href="https://npw.bd/knltc"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5"
                  >
                    <span>{t.btnLmsPortal}</span>
                    <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                  </a>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
