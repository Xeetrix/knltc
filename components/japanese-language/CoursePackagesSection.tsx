"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";

interface Props {
  onSelectCourse?: (courseId: string) => void;
}

export default function CoursePackagesSection({ onSelectCourse }: Props) {
  const { language } = useLanguage();
  const [selectedId, setSelectedId] = useState<string>("N5_COURSE");

  const t = translate(
    {
      en: {
        kicker: "Curriculum & Fee Structure",
        title: "Smart Course Selector & Options",
        subtitle:
          "Targeted preparation for JLPT, NAT-TEST, JFT-Basic, SSW Job Visas, and Japanese universities.",
        tabN5: "N5 Beginner",
        tabN4: "N4 Intermediate",
        tabAdv: "Advanced & Irodori",
        badgePopular: "Most Popular",
        ctaEnroll: "Enroll in This Level",
        feeLabel: "Total Course Fee",
        installments: "2 Installments Available (50% + 50%)",
        syllabusHeading: "Curriculum & Syllabus Highlights",
        scheduleHeading: "Flexible Batch Schedules",
        materialsHeading: "Free Included Materials",
        courses: {
          N5_COURSE: {
            id: "N5_COURSE",
            level: "JLPT N5 & JFT-Basic (Beginner)",
            title: "Japanese N5 Level Comprehensive Course",
            duration: "3 Months • 120 Hours",
            fee: "৳12,000",
            examTarget: "JLPT N5, NAT-TEST 5Q, JFT-Basic",
            targetAudience: "Designed for beginners with zero prior Japanese knowledge.",
            highlights: [
              "Hiragana and Katakana stroke orders, phonetics & basic conversation",
              "103 Basic Kanji characters with mnemonic memory sheets",
              "Minna No Nihongo lessons 1 through 25 full mastery",
              "5 Full-length exam simulation mock tests with grading",
              "Includes 3 free bonus courses (Embassy, CV & Baitō worth ৳15,000)",
            ],
            schedules: [
              "Morning Batch: 10:00 AM – 12:00 PM (Sun, Tue, Thu)",
              "Evening Batch: 07:00 PM – 09:00 PM (Sun, Tue, Thu)",
              "Weekend Special: Friday & Saturday (Intensive)",
            ],
            materials: "Minna No Nihongo I Book, Kanji Workbook, Audio MP3s & Online LMS access.",
          },
          N4_COURSE: {
            id: "N4_COURSE",
            level: "JLPT N4 & SSW Job Track (Intermediate)",
            title: "Japanese N4 Level Comprehensive Course",
            duration: "3 Months • 130 Hours",
            fee: "৳14,500",
            examTarget: "JLPT N4, NAT-TEST 4Q, SSW Skill Tests",
            targetAudience: "For students with N5 knowledge, SSW job candidates, and degree applicants.",
            highlights: [
              "Minna No Nihongo II lessons 26 through 50 & honorifics (Keigo)",
              "250+ Intermediate Kanji characters and workplace compound words",
              "SSW Caregiver, Agriculture & Food Service interview preparation",
              "6 Full-length JFT-Basic and JLPT N4 exam simulations",
              "Embassy & Immigration SOP statement auditing included",
            ],
            schedules: [
              "Morning Batch: 10:00 AM – 12:00 PM (Mon, Wed, Sat)",
              "Evening Batch: 07:00 PM – 09:00 PM (Mon, Wed, Sat)",
              "Weekend Special: Friday & Saturday (Intensive)",
            ],
            materials: "Minna No Nihongo II Book, Grammar Handouts, Audio Drills & 24/7 LMS access.",
          },
          ADVANCED_LEVELS: {
            id: "ADVANCED_LEVELS",
            level: "JLPT N3–N1 & Irodori Practical",
            title: "Advanced & Practical Workplace Japanese",
            duration: "4 Months • 160 Hours",
            fee: "৳18,000",
            examTarget: "JLPT N3/N2, Corporate Fluency, University Degree",
            targetAudience: "For career professionals, translators, and direct university applicants.",
            highlights: [
              "Irodori Japanese practical situational speaking & listening drills",
              "500+ Advanced Kanji characters & corporate communication syntax",
              "Japanese business etiquette (Business Keigo & Meishi exchange)",
              "JLPT N3/N2 digital question bank and speed mock tests",
              "Corporate career liaison and professional Japanese CV audit",
            ],
            schedules: [
              "Evening Professional Batch: 07:30 PM – 09:30 PM",
              "Weekend Executive: Friday & Saturday (Flexible)",
            ],
            materials: "Irodori Textbooks, Business Japanese Handouts, N3/N2 Question Bank.",
          },
        },
      },
      bn: {
        kicker: "পাঠ্যক্রম ও কোর্স ফি",
        title: "স্মার্ট কোর্স সিলেক্টর ও ফি বিবরণ",
        subtitle:
          "JLPT, NAT-TEST, JFT-Basic, SSW জব ভিসা ও জাপানে উচ্চশিক্ষার জন্য সুনির্দিষ্ট ও বাস্তবমুখী কোর্স পরিকল্পনা।",
        tabN5: "N5 বিগিনার",
        tabN4: "N4 ইন্টারমিডিয়েট",
        tabAdv: "Advanced ও ইরোদেরি",
        badgePopular: "সর্বাধিক জনপ্রিয়",
        ctaEnroll: "এই কোর্সে ভর্তি হতে আবেদন করুন",
        feeLabel: "মোট কোর্স ফি",
        installments: "২টি সহজ কিস্তিতে পরিশোধযোগ্য (৫০% + ৫০%)",
        syllabusHeading: "পাঠ্যক্রম ও সিলেবাসের মূল বিষয়সমূহ",
        scheduleHeading: "সুবিধাজনক ব্যাচ সময়সূচি",
        materialsHeading: "সম্পূর্ণ বিনামূল্যে স্টাডি ম্যাটেরিয়ালস",
        courses: {
          N5_COURSE: {
            id: "N5_COURSE",
            level: "JLPT N5 ও JFT-Basic (বিগিনার)",
            title: "Japanese N5 Level Comprehensive Course",
            duration: "৩ মাস • ১২০ ঘণ্টা নিবিড় প্রশিক্ষণ",
            fee: "৳১২,০০০",
            examTarget: "JLPT N5, NAT-TEST 5Q, JFT-Basic",
            targetAudience: "যাদের জাপানি ভাষায় কোনো পূর্ব অভিজ্ঞতা নেই, তাদের একদম শূন্য লেভেল থেকে শেখার কোর্স।",
            highlights: [
              "হিরাগানা ও কাতাকানা বর্ণমালার সঠিক স্ট্রোক অর্ডার ও শুদ্ধ উচ্চারণ",
              "১০৩টি বেসিক কাঞ্জি মেমোরি টেকনিক ও সাপ্তাহিক কুইজ প্র্যাকটিস",
              "মিন্না নো নিহোঙ্গো ১ থেকে ২৫ অধ্যায়ের পূর্ণাঙ্গ ব্যাকরণ ও শব্দার্থ",
              "অফিশিয়াল পরীক্ষার আদলে ৫টি পূর্ণাঙ্গ মক টেস্ট ও মূল্যায়ন",
              "১৫,০০০ টাকা মূল্যের ৩টি স্পেশাল ইন্টারভিউ ও সিভি কোর্স সম্পূর্ণ ফ্রি",
            ],
            schedules: [
              "সকালের ব্যাচ: ১০:০০ AM – ১২:০০ PM (রবি, মঙ্গল, বৃহস্পতি)",
              "সন্ধ্যার ব্যাচ: ০৭:০০ PM – ০৯:০০ PM (রবি, মঙ্গল, বৃহস্পতি)",
              "উইকেন্ড স্পেশাল: শুক্র ও শনিবার (চাকরিজীবী ও শিক্ষার্থীদের জন্য)",
            ],
            materials: "মিন্না নো নিহোঙ্গো ১ম খণ্ড বই, কাঞ্জি শিট, অডিও ফাইল ও ডিজিটাল LMS ক্লাসরুম এক্সেস।",
          },
          N4_COURSE: {
            id: "N4_COURSE",
            level: "JLPT N4 ও SSW জব ট্র্যাক (ইন্টারমিডিয়েট)",
            title: "Japanese N4 Level Comprehensive Course",
            duration: "৩ মাস • ১৩০ ঘণ্টা নিবিড় প্রশিক্ষণ",
            fee: "৳১৪,৫০০",
            examTarget: "JLPT N4, NAT-TEST 4Q, SSW স্কিল টেস্ট",
            targetAudience: "যাদের N5 সম্পন্ন বা বেসিক জানা আছে এবং SSW জব ভিসা বা বিশ্ববিদ্যালয়ের প্রস্তুতি নিতে চান।",
            highlights: [
              "মিন্না নো নিহোঙ্গো ২৬ থেকে ৫০ অধ্যায় ও বিনীত কেইগো ব্যাকরণ",
              "২৫০+ মধ্যম স্তরের কাঞ্জি ও কর্মক্ষেত্রের প্রয়োজনীয় শব্দভাণ্ডার",
              "SSW কেয়ারগিভার, এগ্রিকালচার ও ফুড সার্ভিস ইন্টারভিউ প্রস্তুতি",
              "JFT-Basic / JLPT N4 স্ট্যান্ডার্ড ৬টি পূর্ণাঙ্গ মক টেস্ট",
              "এম্বাসি ও স্টাডি মোটিভেশন (SOP) রাইটিং বিশেষ গাইডেন্স",
            ],
            schedules: [
              "সকালের ব্যাচ: ১০:০০ AM – ১২:০০ PM (সোম, বুধ, শনি)",
              "সন্ধ্যার ব্যাচ: ০৭:০০ PM – ০৯:০০ PM (সোম, বুধ, শনি)",
              "উইকেন্ড স্পেশাল: শুক্র ও শনিবার (ইন্টেনসিভ)",
            ],
            materials: "মিন্না নো নিহোঙ্গো ২য় খণ্ড বই, গ্রামার শিট, অডিও ড্রিলস ও ২৪/৭ LMS এক্সেস।",
          },
          ADVANCED_LEVELS: {
            id: "ADVANCED_LEVELS",
            level: "JLPT N3–N1 ও ইরোদোরি প্র্যাকটিক্যাল",
            title: "Advanced & Practical Workplace Japanese",
            duration: "৪ মাস • ১৬০ ঘণ্টা নিবিড় প্রশিক্ষণ",
            fee: "৳১৮,০০০",
            examTarget: "JLPT N3/N2, কর্পোরেট ক্যারিয়ার, ডিগ্রি প্রোগ্রাম",
            targetAudience: "জাপানি কোম্পানিতে চাকরি, অনুবাদক বা সরাসরি জাপানি বিশ্ববিদ্যালয়ে মাস্টার্সের জন্য।",
            highlights: [
              "ইরোদেরি জাপানিজ বাস্তবমুখী সিচুয়েশনাল স্পিকিং ও লিসেনিং ড্রিলস",
              "৫০০+ উচ্চতর কাঞ্জি ও কর্পোরেট যোগাযোগের বিশেষ অনুশীলন",
              "জাপানিজ কর্মসংস্কৃতি (Work Ethics) ও বিজনেস এটিকেট",
              "JLPT N3/N2 পরীক্ষার সিমুলেশন ও ডিজিটাল প্রশ্নব্যাংক",
              "কর্পোরেট ইন্টারভিউ গাইড ও জাপানি সিভি প্রফেশনাল অডিট",
            ],
            schedules: [
              "ইভনিং প্রফেশনাল ব্যাচ: ০৭:৩০ PM – ০৯:৩০ PM",
              "উইকেন্ড এক্সিকিউটিভ ব্যাচ: শুক্র ও শনিবার",
            ],
            materials: "ইরোদেরি টেক্সটবুক, বিজনেস হ্যান্ডআউটস ও N3/N2 প্রশ্নব্যাংক।",
          },
        },
      },
      ja: {
        kicker: "受講プラン・料金案内",
        title: "スマートコース選択・受講料詳細",
        subtitle:
          "JLPT、NAT-TEST、JFT-Basic、特定技能就労、日本留学に直結する実践カリキュラム。",
        tabN5: "N5 基礎",
        tabN4: "N4 中級",
        tabAdv: "上級・いろどり",
        badgePopular: "標準推奨コース",
        ctaEnroll: "このコースで受講申請する",
        feeLabel: "受講料合計",
        installments: "2回分割払い可能（50% + 50%）",
        syllabusHeading: "カリキュラム概要・特徴",
        scheduleHeading: "受講時間帯（選択可）",
        materialsHeading: "完全無料教材",
        courses: {
          N5_COURSE: {
            id: "N5_COURSE",
            level: "JLPT N5・JFT-Basic（基礎レベル）",
            title: "日本語N5集中総合講座",
            duration: "3ヶ月 • 120時間",
            fee: "৳12,000",
            examTarget: "JLPT N5, NAT-TEST 5Q, JFT-Basic",
            targetAudience: "日本語学習が初めての方向け。ひらがな・カタカナからスタートします。",
            highlights: [
              "ひらがな・カタカナの正確な筆順と発音指導",
              "基本漢字103字の記憶法と確認小テスト",
              "『みんなの日本語』第1課〜第25課の完全習得",
              "本番レベルの模擬試験5回と個別添削",
              "15,000タカ相当の面接・履歴書3大特典講座が完全無料",
            ],
            schedules: [
              "午前クラス: 10:00〜12:00（日・火・木）",
              "夜間クラス: 19:00〜21:00（日・火・木）",
              "週末集中クラス: 金曜・土曜",
            ],
            materials: "『みんなの日本語』教科書、漢字ドリル、音声データ、LMSアカウント",
          },
          N4_COURSE: {
            id: "N4_COURSE",
            level: "JLPT N4・特定技能就労（中級レベル）",
            title: "日本語N4中級総合講座",
            duration: "3ヶ月 • 130時間",
            fee: "৳14,500",
            examTarget: "JLPT N4, NAT-TEST 4Q, 特定技能試験",
            targetAudience: "N5修了者、特定技能（介護・外食等）就労希望者、大学進学希望者。",
            highlights: [
              "『みんなの日本語』第26課〜第50課およびビジネス敬語",
              "中級漢字250字および実務単語の習得",
              "特定技能（介護・外食等）の採用面接特訓",
              "JFT-Basic / JLPT N4 本番レベル模試6回",
              "志望理由書および出願書類の個別添削",
            ],
            schedules: [
              "午前クラス: 10:00〜12:00（月・水・土）",
              "夜間クラス: 19:00〜21:00（月・水・土）",
              "週末集中クラス: 金曜・土曜",
            ],
            materials: "『みんなの日本語』第2巻、文法資料、リスニング音声、LMSアクセス",
          },
          ADVANCED_LEVELS: {
            id: "ADVANCED_LEVELS",
            level: "JLPT N3〜N1・実践いろどり",
            title: "上級・ビジネス実践日本語講座",
            duration: "4ヶ月 • 160時間",
            fee: "৳18,000",
            examTarget: "JLPT N3/N2, 企業就職, 大学院進学",
            targetAudience: "日系企業就労、通訳、大学院進学を目指す上級者向け。",
            highlights: [
              "『いろどり』生活・職場シチュエーション会話特訓",
              "上級漢字500字およびビジネス文書作成演習",
              "日本の企業文化・名刺交換・ビジネスマナー指導",
              "JLPT N3/N2問題演習および模擬試験",
              "就職面接ポートフォリオ作成サポート",
            ],
            schedules: [
              "夜間ビジネス便: 19:30〜21:30",
              "週末エグゼクティブ便: 金曜・土曜",
            ],
            materials: "『いろどり』テキスト、ビジネス日本語ハンドブック、試験問題集",
          },
        },
      },
    },
    language,
  );

  const activeCourse = t.courses[selectedId as keyof typeof t.courses] || t.courses.N5_COURSE;

  const handleApply = (courseId: string) => {
    if (onSelectCourse) {
      onSelectCourse(courseId);
    }
    // Sync with form
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("knltc-select-course", { detail: { courseId } }),
      );
    }
    const form = document.getElementById("enrollment-form");
    if (form) {
      form.scrollIntoView({ behavior: "smooth" });
    }
  };

  const tabs = [
    { id: "N5_COURSE", label: t.tabN5, popular: true },
    { id: "N4_COURSE", label: t.tabN4, popular: false },
    { id: "ADVANCED_LEVELS", label: t.tabAdv, popular: false },
  ];

  return (
    <section id="course-options" className="py-16 md:py-22 bg-white border-b border-stone-200 scroll-mt-14">
      <div className="container-narrow">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-10 sm:mb-12">
          <p className="text-xs font-bold tracking-widest text-[#b91c1c] uppercase">
            {t.kicker}
          </p>
          <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t.title}
          </h2>
          <p className="mt-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Smart Segmented Level Switcher */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 rounded-2xl bg-[#fcfaf7] border border-stone-200/90 shadow-2xs max-w-xl w-full">
            {tabs.map((tab) => {
              const active = selectedId === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedId(tab.id)}
                  type="button"
                  className={`relative flex-1 py-3 px-3 sm:px-4 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                    active
                      ? "text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="courseTabActive"
                      className="absolute inset-0 rounded-xl bg-white border border-stone-200/90 -z-0"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center justify-center gap-1.5">
                    <span>{tab.label}</span>
                    {tab.popular && (
                      <span className="hidden sm:inline text-[10px] font-bold text-[#b91c1c] bg-red-50 border border-red-200/60 px-1.5 py-0.2 rounded">
                        Hot
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Smart Course Explorer Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCourse.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="rounded-3xl border border-stone-200/90 bg-[#fcfaf7] p-6 sm:p-9 shadow-xs"
          >
            <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
              {/* Left Column (8 cols): Syllabus, Highlights & Schedule */}
              <div className="lg:col-span-8 space-y-6">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-[#b91c1c] bg-red-50 border border-red-200/80 px-2.5 py-0.5 rounded-md">
                      {activeCourse.level}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-500 font-medium bg-white border border-stone-200 px-2.5 py-0.5 rounded-md">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      <span>{activeCourse.duration}</span>
                    </span>
                    <span className="text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md">
                      {activeCourse.examTarget}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
                    {activeCourse.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {activeCourse.targetAudience}
                  </p>
                </div>

                {/* Syllabus Highlights */}
                <div className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6 shadow-2xs">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-[#b91c1c]" />
                    <span>{t.syllabusHeading}</span>
                  </h4>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                    {activeCourse.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <Check className="h-4 w-4 text-[#15803d] shrink-0 mt-0.5 stroke-[2.5]" />
                        <span className="leading-relaxed">{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Schedules & Inclusions Grid */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-2xs">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-[#15803d]" />
                      <span>{t.scheduleHeading}</span>
                    </h5>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {activeCourse.schedules.map((sc, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="h-1 w-1 rounded-full bg-slate-400" />
                          <span>{sc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-2xs">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-1.5">
                      <GraduationCap className="h-4 w-4 text-slate-800" />
                      <span>{t.materialsHeading}</span>
                    </h5>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {activeCourse.materials}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column (4 cols): Pricing Box & Direct 1-Click Action */}
              <div className="lg:col-span-4">
                <div className="rounded-2xl border-2 border-slate-900 bg-white p-6 sm:p-7 shadow-md">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#b91c1c]">
                    {t.feeLabel}
                  </span>

                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                      {activeCourse.fee}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">/ ৩ মাস</span>
                  </div>

                  <div className="mt-3 rounded-xl bg-emerald-50/80 border border-emerald-200/80 p-3 text-xs font-semibold text-[#15803d] flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>{t.installments}</span>
                  </div>

                  <div className="mt-5 space-y-2.5 text-xs text-slate-600 pb-5 border-b border-stone-100">
                    <div className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-[#15803d] stroke-[2.5]" />
                      <span>সব পাঠ্যবই ও লেকচার শিট ফ্রি</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-[#15803d] stroke-[2.5]" />
                      <span>১৫,০০০ টাকার ৩টি কোর্স ফ্রি</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-[#15803d] stroke-[2.5]" />
                      <span>অফিশিয়াল LMS আইডি ও ক্লাস রেকর্ডিং</span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Button
                      onClick={() => handleApply(activeCourse.id)}
                      className="w-full py-6 rounded-xl bg-[#b91c1c] hover:bg-red-800 text-white font-bold text-sm shadow-xs active:scale-[0.98] transition-transform"
                    >
                      <span>{t.ctaEnroll}</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <p className="text-center text-[11px] text-slate-400 mt-2">
                      নিচের ফর্মে স্বয়ংক্রিয়ভাবে সিলেক্ট হবে
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
