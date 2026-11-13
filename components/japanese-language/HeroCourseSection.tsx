"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
import {
  DEFAULT_WEBSITE_CMS,
  fetchLiveStoreFromServer,
  getWebsiteCms,
} from "@/lib/knltc-cms-store";

export default function HeroCourseSection() {
  const { language } = useLanguage();
  const [cmsConfig, setCmsConfig] = useState(DEFAULT_WEBSITE_CMS.languageCoursePage);

  useEffect(() => {
    const syncHeroCms = () => {
      try {
        const cms = getWebsiteCms();
        if (cms?.languageCoursePage) {
          setCmsConfig({
            ...DEFAULT_WEBSITE_CMS.languageCoursePage,
            ...cms.languageCoursePage,
          });
        }
      } catch {
        // fallback to default
      }
    };

    syncHeroCms();
    void fetchLiveStoreFromServer().then(() => {
      syncHeroCms();
    });

    window.addEventListener("knltc-cms-updated", syncHeroCms);
    window.addEventListener("storage", syncHeroCms);
    return () => {
      window.removeEventListener("knltc-cms-updated", syncHeroCms);
      window.removeEventListener("storage", syncHeroCms);
    };
  }, []);

  const minCoursePrice = Math.min(
    cmsConfig.n5PriceBdt || 12000,
    cmsConfig.jftPriceBdt || 12500,
  );
  const fullDiscountPercent = cmsConfig.fullPaymentDiscountPercent ?? 20;
  const lmsUrl = cmsConfig.externalLmsUrl || "https://npw.bd/knltc";

  const t = translate(
    {
      en: {
        badge: "Official Japanese Language Academy • Dhaka & Khulna Campuses",
        headlinePart1: "Learn Japanese the Easy Way",
        headlineHighlight: "Gateway to Higher Study & Career in Japan",
        subtitle:
          "Priority preparation for JFT-Basic (Irodori Practical Japanese) & JLPT/NAT-TEST (N5 & N4) for both Student Visa and SSW Job Visa candidates. 150-hour immigration-certified curriculum with live online classes, Paltan & Khulna offline campuses, and 24/7 digital LMS portal.",
        stat1: "98% Pass Rate",
        stat1Sub: "JFT-Basic, JLPT & NAT",
        stat2: "1,200+ Visas",
        stat2Sub: "Student & SSW to Japan",
        stat3: "100% Free Materials",
        stat3Sub: "Textbooks, Sheets & Audio",
        ctaEnroll: "Explore 4 Courses & Enroll",
        ctaLms: "Enter LMS Classroom",
        hotlineLabel: "Admission Hotline:",
        cardTag: "Official KNLTC Portal",
        cardTitle: "Digital Classroom & LMS Gateway",
        cardSub: "Live Digital Campus & Student Portal",
        cardBadge: "Admissions Open",
        startingFee: `Starting from ৳${minCoursePrice.toLocaleString("en-IN")}`,
        feeBadge: `Extra ${fullDiscountPercent}% OFF Full Pay`,
        feeNote: `50% Installment Available • Or get Extra ${fullDiscountPercent}% Discount on Full Payment!`,
        feature1: "Minna No Nihongo & Irodori textbooks + audio drills 100% free",
        feature2: "Online Live Class, Paltan Head Office & Khulna Branch (Offline)",
        feature3: "Includes 3 free bonus courses worth ৳15,000 (Embassy, CV & Baitō)",
        inc1: "150-Hr Immigration Certified",
        inc2: "JFT (Irodori) & JLPT N5/N4",
        inc3: "3 Free Bonus Courses",
        btnEnrollNow: "Apply for Admission",
        btnLmsPortal: "Open LMS Portal",
        waChat: "Chat on WhatsApp",
        studentN4FreeBadge:
          "Scholarship Alert: KNLTC Student Visa (COE Processing) candidates get the JLPT N4 Course 100% FREE!",
      },
      bn: {
        badge: "KNLTC অফিশিয়াল জাপানিজ একাডেমি • ঢাকা হেড অফিস ও খুলনা শাখা",
        headlinePart1: "সহজ পদ্ধতিতে জাপানি ভাষা শিখুন",
        headlineHighlight: "জাপানে উচ্চশিক্ষা ও নিশ্চিত ক্যারিয়ারের বিশ্বস্ত গেটওয়ে",
        subtitle:
          "স্টুডেন্ট ভিসা এবং SSW জব ভিসা—উভয় প্রার্থীদের জন্যই সর্বাধিক কার্যকরী JFT-Basic (ইরোদেরি প্র্যাকটিক্যাল জাপানিজ) এবং JLPT/NAT (N5 ও N4) ১৫০ ঘণ্টার সার্টিফাইড কোর্স। অনলাইন লাইভ ক্লাস, পল্টন হেড অফিস ও খুলনা শাখায় ক্লাস এবং ২৪/৭ ডিজিটাল LMS পোর্টাল সুবিধা।",
        stat1: "৯৮% পাসের হার",
        stat1Sub: "JFT, JLPT ও NAT প্রথমবারই",
        stat2: "১,২০০+ ভিসা",
        stat2Sub: "জাপানে অধ্যয়ন ও জব ভিসা",
        stat3: "১০০% ফ্রি পাঠ্যবই",
        stat3Sub: "মিন্না নো নিহোঙ্গো ও শিট",
        ctaEnroll: "৪টি কোর্স প্যাকেজ ও ভর্তি",
        ctaLms: "LMS ক্লাসরুমে প্রবেশ",
        hotlineLabel: "এডমিশন হটলাইন:",
        cardTag: "অফিশিয়াল KNLTC পোর্টাল",
        cardTitle: "ডিজিটাল ক্লাসরুম ও LMS গেটওয়ে",
        cardSub: "অফিশিয়াল ডিজিটাল স্টুডেন্ট পোর্টাল",
        cardBadge: "ভর্তি চলছে",
        startingFee: `কোর্স ফি শুরু ৳${minCoursePrice.toLocaleString("bn-BD")} থেকে`,
        feeBadge: `ফুল পেমেন্টে ২০% ছাড়`,
        feeNote: `কিস্তি সুবিধা রয়েছে (৫০%+৫০%) • তবে এককালীন ফুল পেমেন্ট করলে পাচ্ছেন অতিরিক্ত ${fullDiscountPercent}% ডিসকাউন্ট!`,
        feature1: "মিন্না নো নিহোঙ্গো ও ইরোদেরি পাঠ্যবই এবং অডিও ফাইল সম্পূর্ণ ফ্রি",
        feature2: "অনলাইন লাইভ ক্লাস এবং পল্টন হেড অফিস ও খুলনা শাখায় অফলাইন ক্লাস",
        feature3: "১৫,০০০ টাকা মূল্যের ৩টি স্পেশাল ইন্টারভিউ ও সিভি কোর্স সম্পূর্ণ ফ্রি",
        inc1: "১৫০ ঘণ্টার ইমিগ্রেশন সার্টিফিকেট",
        inc2: "JFT (Irodori) ও JLPT N5/N4",
        inc3: "৩টি বোনাস কোর্স ফ্রি",
        btnEnrollNow: "ভর্তির আবেদন করুন",
        btnLmsPortal: "LMS পোর্টালে প্রবেশ",
        waChat: "হোয়াটসঅ্যাপে পরামর্শ",
        studentN4FreeBadge:
          "স্পেশাল স্কলারশিপ: KNLTC স্টুডেন্ট ভিসা (COE প্রসেসিং) প্রার্থীদের জন্য JLPT N4 কোর্স ১০০% ফ্রি!",
      },
      ja: {
        badge: "公認 日本語アカデミー • ダッカ本部＆クルナ支部キャンパス",
        headlinePart1: "わかりやすい日本語学習",
        headlineHighlight: "日本留学・就職への確かなゲートウェイ",
        subtitle:
          "留学ビザ・特定技能（SSW）双方に最適な『JFT-Basic（いろどり実践日本語）』およびJLPT/NAT（N5・N4）150時間認定カリキュラム。オンラインLIVE講義、ダッカ本部・クルナ支部での対面授業、公式LMSポータル完備。",
        stat1: "98%合格率",
        stat1Sub: "JFT・JLPT・NAT一発合格",
        stat2: "1,200名ビザ取得",
        stat2Sub: "留学生・特定技能人材",
        stat3: "教材完全無料",
        stat3Sub: "テキスト・音声配布",
        ctaEnroll: "4大コース詳細・受講申請",
        ctaLms: "LMS教室へ入室",
        hotlineLabel: "相談窓口:",
        cardTag: "公式 KNLTCポータル",
        cardTitle: "デジタル教室・公式LMSゲートウェイ",
        cardSub: "公式オンライン学習ポータル",
        cardBadge: "受講受付中",
        startingFee: `受講料 ৳${minCoursePrice.toLocaleString("en-IN")}〜`,
        feeBadge: `一括払いで${fullDiscountPercent}%割引`,
        feeNote: `2回分割払い可能（50%+50%）• 一括払いでさらに${fullDiscountPercent}%特別割引！`,
        feature1: "『みんなの日本語』＆『いろどり』教材・音声データ無償提供",
        feature2: "オンラインLIVE講義・ダッカ本部＆クルナ支部での対面授業",
        feature3: "15,000タカ相当の面接・履歴書・アルバイト3大特典講座無料",
        inc1: "入管基準150時間学習証明",
        inc2: "JFT (いろどり) & JLPT N5/N4",
        inc3: "3大特典講座が無料",
        btnEnrollNow: "受講申込みへ",
        btnLmsPortal: "LMSポータルを開く",
        waChat: "WhatsApp相談",
        studentN4FreeBadge:
          "特別奨学金：KNLTC留学ビザ（COE申請中）候補生はJLPT N4コースが100%無料！",
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
        {/* Top Trust Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-stone-200/80 text-xs text-slate-600">
          <div className="flex items-center gap-2">
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
            <h1
              className={`text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-[2.75rem] ${
                language === "bn" ? "leading-relaxed" : "leading-[1.22]"
              }`}
            >
              <span className="block text-slate-900">{t.headlinePart1}</span>{" "}
              <span
                className={`block mt-2 font-extrabold text-[#b91c1c] text-2xl sm:text-3xl lg:text-[2.15rem] ${
                  language === "bn" ? "leading-relaxed" : "leading-snug"
                }`}
              >
                {t.headlineHighlight}
              </span>
            </h1>

            <p className="text-base sm:text-lg leading-relaxed text-slate-700 font-normal max-w-2xl">
              {t.subtitle}
            </p>

            {/* Student Visa N4 100% Free Scholarship Highlight Callout */}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/90 px-4 py-3 text-xs sm:text-sm font-semibold text-[#1E5631] flex items-start gap-2.5 shadow-2xs">
              <Sparkles className="h-4 w-4 text-[#1E5631] shrink-0 mt-0.5" />
              <span className="leading-relaxed">{t.studentN4FreeBadge}</span>
            </div>

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
            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap">
              <motion.div whileHover={{ y: -2, scale: 1.015 }} whileTap={{ scale: 0.97 }}>
                <Button
                  onClick={scrollToCourses}
                  size="lg"
                  className="w-full sm:w-auto bg-[#b91c1c] hover:bg-red-800 text-white font-semibold text-sm sm:text-base px-7 py-6 rounded-xl shadow-xs transition-colors cursor-pointer"
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
                  className="w-full sm:w-auto border-stone-300 text-slate-800 hover:bg-white font-semibold text-sm sm:text-base px-5 py-6 rounded-xl transition-colors shadow-2xs"
                >
                  <a href={lmsUrl} target="_blank" rel="noopener noreferrer">
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
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5 leading-relaxed">
                    {t.cardTitle}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    {t.cardSub}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-[11px] font-semibold text-emerald-800">
                  <span>{t.cardBadge}</span>
                </span>
              </div>

              {/* Price Banner */}
              <div className="mt-4 rounded-xl bg-[#fcfaf7] border border-stone-200/80 p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="text-xl font-extrabold text-slate-900 tracking-tight tabular-nums">
                    {t.startingFee}
                  </span>
                  <span className="text-xs font-bold text-white bg-[#1E5631] px-2.5 py-0.5 rounded-md">
                    {t.feeBadge}
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-slate-700 font-medium leading-relaxed">
                  {t.feeNote}
                </p>
              </div>

              {/* Inclusions Checklist */}
              <div className="mt-4 space-y-2.5 text-xs text-slate-700">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#15803d] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{t.feature1}</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#15803d] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{t.feature2}</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#15803d] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{t.feature3}</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-6 pt-4 border-t border-stone-100 flex gap-2.5">
                <Button
                  asChild
                  className="flex-1 bg-[#b91c1c] hover:bg-red-800 text-white font-semibold text-xs py-5 rounded-xl shadow-xs active:scale-[0.98] transition-transform cursor-pointer"
                >
                  <Link href="/japanese-language/enroll/jft-irodori">
                    {t.btnEnrollNow}
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-stone-300 hover:bg-stone-50 text-slate-800 text-xs font-semibold py-5 px-3.5 rounded-xl shrink-0 active:scale-[0.98] transition-transform"
                >
                  <a
                    href={lmsUrl}
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
