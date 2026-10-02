"use client";

import { ArrowRight, Check, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";

interface Props {
  onSelectCourse?: (courseId: string) => void;
}

export default function CoursePackagesSection({ onSelectCourse }: Props) {
  const { language } = useLanguage();

  const t = translate(
    {
      en: {
        kicker: "Course Packages & Fee Structure",
        title: "Simple, Transparent Course Options",
        subtitle:
          "Targeted preparation for JLPT, NAT-TEST, JFT-Basic, SSW Job Visa, and university admissions in Japan.",
        featuredBadge: "Recommended Intake",
        ctaEnroll: "Enroll in This Course",
        perDuration: "/ 3 Months",
        courses: [
          {
            id: "N5_COURSE",
            level: "N5 Beginner",
            title: "Japanese N5 Level Course",
            duration: "3 Months • 120 Hours",
            fee: "৳12,000",
            feeNote: "Installments available (50% + 50%)",
            featured: true,
            features: [
              "Minna No Nihongo lessons 1–25 and all textbooks free",
              "Hiragana & Katakana stroke orders and pronunciation",
              "103 Basic Kanji & weekly vocabulary drills",
              "5 Full-length mock tests for JLPT N5 & JFT-Basic",
              "Includes 3 free bonus courses (Embassy, CV & Baitō)",
            ],
          },
          {
            id: "N4_COURSE",
            level: "N4 Intermediate",
            title: "Japanese N4 Level Course",
            duration: "3 Months • 130 Hours",
            fee: "৳14,500",
            feeNote: "All books & practice audio files included",
            featured: false,
            features: [
              "Minna No Nihongo lessons 26–50 & Part 2 book free",
              "250+ Intermediate Kanji and Keigo honorific grammar",
              "SSW Caregiver, Food Service & Agriculture interview prep",
              "6 Full-length JFT-Basic & JLPT N4 mock exams",
              "Technical interview coaching & workplace etiquette",
            ],
          },
          {
            id: "ADVANCED_LEVELS",
            level: "N3–N1 & Irodori",
            title: "Advanced & Practical Japanese",
            duration: "4 Months • 160 Hours",
            fee: "৳18,000",
            feeNote: "Career, corporate & exam simulation",
            featured: false,
            features: [
              "Irodori Japanese practical situational speaking drills",
              "500+ Advanced Kanji & corporate workplace phrases",
              "Japanese business etiquette and interview portfolio",
              "JLPT N3/N2 exam simulations & digital question bank",
              "Corporate career guidance & CV audit",
            ],
          },
        ],
      },
      bn: {
        kicker: "কোর্স প্যাকেজ ও ফি বিবরণ",
        title: "সহজ ও স্বচ্ছ কোর্স অপশন",
        subtitle:
          "JLPT, NAT-TEST, JFT-Basic, SSW জব ভিসা ও জাপানে উচ্চশিক্ষার জন্য সুনির্দিষ্ট ও বাস্তবমুখী কোর্স পরিকল্পনা।",
        featuredBadge: "সর্বাধিক জনপ্রিয়",
        ctaEnroll: "ভর্তির আবেদন করুন",
        perDuration: "/ ৩ মাস",
        courses: [
          {
            id: "N5_COURSE",
            level: "N5 বিগিনার",
            title: "Japanese N5 Level Course",
            duration: "৩ মাস • ১২০ ঘণ্টা",
            fee: "৳১২,০০০",
            feeNote: "২টি সহজ কিস্তিতে পরিশোধযোগ্য (৫০% + ৫০%)",
            featured: true,
            features: [
              "মিন্না নো নিহোঙ্গো ১-২৫ পাঠ্যবই ও লেকচার শিট সম্পূর্ণ ফ্রি",
              "হিরাগানা ও কাতাকানা বর্ণমালার নির্ভুল স্ট্রোক অর্ডার",
              "১০৩টি বেসিক কাঞ্জি মেমোরি টেকনিক ও সাপ্তাহিক কুইজ",
              "JLPT N5 ও JFT-Basic অনুরূপ ৫টি পূর্ণাঙ্গ মক টেস্ট",
              "১৫,০০০ টাকা মূল্যের ৩টি স্পেশাল ইন্টারভিউ ও সিভি কোর্স সম্পূর্ণ ফ্রি",
            ],
          },
          {
            id: "N4_COURSE",
            level: "N4 ইন্টারমিডিয়েট",
            title: "Japanese N4 Level Course",
            duration: "৩ মাস • ১৩০ ঘণ্টা",
            fee: "৳১৪,৫০০",
            feeNote: "বই, প্র্যাকটিস শিট ও অডিও ফাইল অন্তর্ভুক্ত",
            featured: false,
            features: [
              "মিন্না নো নিহোঙ্গো ২য় খণ্ড বই ও প্র্যাকটিস শিট ফ্রি",
              "২৫০+ মধ্যম স্তরের কাঞ্জি ও বিনীত কেইগো ব্যাকরণ",
              "SSW কেয়ারগিভার, এগ্রিকালচার ও ফুড সার্ভিস ইন্টারভিউ প্রস্তুতি",
              "JFT-Basic / JLPT N4 স্ট্যান্ডার্ড ৬টি পূর্ণাঙ্গ মক টেস্ট",
              "কর্মক্ষেত্রের ভাষা ও টেকনিক্যাল ইন্টারভিউ প্রশিক্ষণ",
            ],
          },
          {
            id: "ADVANCED_LEVELS",
            level: "N3–N1 ও ইরোদোরি",
            title: "Advanced & Practical Japanese",
            duration: "৪ মাস • ১৬০ ঘণ্টা",
            fee: "৳১৮,০০০",
            feeNote: "স্পেশাল জব রেডি ও ক্যারিয়ার প্রোগ্রাম",
            featured: false,
            features: [
              "ইরোদেরি জাপানিজ বাস্তবমুখী সিচুয়েশনাল স্পিকিং ও লিসেনিং",
              "৫০০+ উচ্চতর কাঞ্জি ও কর্পোরেট যোগাযোগের বিশেষ অনুশীলন",
              "জাপানিজ কর্মসংস্কৃতি (Work Ethics) ও বিজনেস এটিকেট",
              "JLPT N3/N2 পরীক্ষার সিমুলেশন ও অনলাইন প্রশ্নব্যাংক",
              "কর্পোরেট ইন্টারভিউ গাইড ও জাপানি সিভি অডিট",
            ],
          },
        ],
      },
      ja: {
        kicker: "受講プラン・料金案内",
        title: "目標に応じたシンプルなコース体系",
        subtitle:
          "JLPT、NAT-TEST、JFT-Basic、特定技能就労、日本留学に直結する実践カリキュラム。",
        featuredBadge: "標準推奨コース",
        ctaEnroll: "このコースで申請する",
        perDuration: "/ 3ヶ月",
        courses: [
          {
            id: "N5_COURSE",
            level: "N5 基礎レベル",
            title: "日本語N5集中講座",
            duration: "3ヶ月 • 120時間",
            fee: "৳12,000",
            feeNote: "2回分割払い可能（50% + 50%）",
            featured: true,
            features: [
              "『みんなの日本語』教科書＆プリント無料配布",
              "ひらがな・カタカナの正確な書き順と発音指導",
              "基本漢字103字の記憶法と確認小テスト",
              "JLPT N5・JFT本番レベルの模擬試験5回",
              "15,000タカ相当の面接・履歴書3大特典講座が全額無料",
            ],
          },
          {
            id: "N4_COURSE",
            level: "N4 中級レベル",
            title: "日本語N4中級講座",
            duration: "3ヶ月 • 130時間",
            fee: "৳14,500",
            feeNote: "教材・音声ファイル受講料に含む",
            featured: false,
            features: [
              "『みんなの日本語』第2巻テキスト＆プリント無料",
              "中級漢字250字およびビジネス敬語の習得",
              "特定技能（介護・外食等）の面接特訓",
              "JFT-Basic / JLPT N4 本番レベル模試6回",
              "職場で必要な実務会話とマナー指導",
            ],
          },
          {
            id: "ADVANCED_LEVELS",
            level: "N3〜N1・いろどり",
            title: "実践・上級日本語講座",
            duration: "4ヶ月 • 160時間",
            fee: "৳18,000",
            feeNote: "就職・上位資格取得向け特訓",
            featured: false,
            features: [
              "『いろどり』生活・職場シチュエーション会話特訓",
              "上級漢字500字および高度ビジネス文書作成",
              "日本の企業文化・ビジネスマナーの徹底指導",
              "JLPT N3/N2問題演習および模擬試験",
              "採用面接ポートフォリオ作成サポート",
            ],
          },
        ],
      },
    },
    language,
  );

  const handleSelect = (courseId: string) => {
    if (onSelectCourse) {
      onSelectCourse(courseId);
    }
    // Also trigger custom event for form sync
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

  return (
    <section id="course-options" className="py-16 md:py-24 bg-white border-b border-stone-200">
      <div className="container-narrow">
        {/* Section Header - Clean, Editorial & Minimalist */}
        <div className="max-w-2xl mx-auto text-center mb-12 sm:mb-16">
          <p className="text-xs font-bold tracking-widest text-[#b91c1c] uppercase">
            {t.kicker}
          </p>
          <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t.title}
          </h2>
          <p className="mt-3 text-sm text-slate-600 leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* 3 Crisp Minimalist Cards */}
        <div className="grid gap-6 lg:grid-cols-3 items-stretch">
          {t.courses.map((course) => (
            <div
              key={course.id}
              className={`relative flex flex-col justify-between rounded-2xl bg-white p-7 transition-all ${
                course.featured
                  ? "border-2 border-slate-900 shadow-md ring-1 ring-slate-900/5"
                  : "border border-stone-200 hover:border-stone-300 shadow-xs"
              }`}
            >
              {/* Featured Tag */}
              {course.featured && (
                <div className="absolute -top-3 left-7 rounded-md bg-slate-900 px-2.5 py-0.5 text-[11px] font-semibold text-white shadow-xs flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-amber-300" />
                  <span>{t.featuredBadge}</span>
                </div>
              )}

              <div>
                {/* Level & Duration */}
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span className="font-bold text-[#b91c1c] uppercase tracking-wider text-[11px]">
                    {course.level}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    {course.duration}
                  </span>
                </div>

                {/* Course Title */}
                <h3 className="mt-3 text-xl font-bold text-slate-900 leading-snug">
                  {course.title}
                </h3>

                {/* Clean Price Line */}
                <div className="mt-4 pb-4 border-b border-stone-100">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                      {course.fee}
                    </span>
                    <span className="text-xs text-slate-500 font-normal">
                      {t.perDuration}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{course.feeNote}</p>
                </div>

                {/* Bullet Points */}
                <ul className="mt-5 space-y-3 text-xs sm:text-[13px] text-slate-700">
                  {course.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 text-[#15803d] shrink-0 mt-0.5 stroke-[2.5]" />
                      <span className="leading-snug">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom CTA Button */}
              <div className="mt-8 pt-5 border-t border-stone-100">
                <Button
                  onClick={() => handleSelect(course.id)}
                  className={`w-full py-5 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-xs ${
                    course.featured
                      ? "bg-[#b91c1c] hover:bg-red-800 text-white"
                      : "bg-slate-900 hover:bg-slate-800 text-white"
                  }`}
                >
                  <span>{t.ctaEnroll}</span>
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
