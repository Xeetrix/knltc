"use client";

import {
  ArrowRight,
  BookOpen,
  Calendar,
  Check,
  Clock,
  Gift,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
        badge: "Course Packages & Fee Structure",
        title: "Choose the Right Course for Your Goal",
        desc: "Tailored programs for Student Visa, SSW Job Visa, and Technical Intern pathways to Japan.",
        popularBadge: "Most Popular Choice",
        durationLabel: "3 Months (120 Hours)",
        durationLabelN4: "3 Months (130 Hours)",
        durationLabelCombo: "6 Months (250 Hours)",
        feeLabel: "Fee:",
        installmentN5: "Payable in one time or 2 easy installments",
        installmentOther: "Full textbook and practice sheet package included",
        featuresHeader: "What is included:",
        bonusHeader: "Included Free Bonus Courses:",
        freeTag: "FREE",
        ctaEnroll: "Enroll in This Course",
        scheduleTitle: "Class Schedules & Flexible Shifts",
        scheduleDesc: "Morning (9:00-11:00 AM) • Afternoon (3:00-5:00 PM) • Evening (6:30-8:30 PM) • Friday-Saturday Weekend Executive",
        selectBatchBtn: "Select Preferred Batch",
        courses: [
          {
            id: "course-n5",
            level: "N5",
            title: "Japanese N5 Level Course (3 Months Intensive)",
            tagline: "The First & Most Important Step for Japan Student & Job Visas",
            fee: 12000,
            popular: true,
            desc: "Master Hiragana, Katakana, 103+ Kanji, Minna No Nihongo lessons 1-25, and 100% preparation for JLPT N5 & JFT-Basic. Includes ৳15,000 worth of 3 bonus courses free.",
            features: [
              "Free Minna No Nihongo textbooks & lecture sheets",
              "Precise stroke order training for Hiragana & Katakana",
              "103 Kanji memory mnemonics & weekly quizzes",
              "Native audio tracks for listening & speaking drills",
              "5 Full-length mock tests matching JLPT/NAT standards",
              "Class recordings backup & lifetime study access",
            ],
            bonuses: [
              "15-Day Japan Embassy Visa Interview Course",
              "10-Day Japanese Resume (Rirekisho) Writing Course",
              "10-Day Part-time Job (Baitō) Interview Training",
            ],
          },
          {
            id: "course-n4",
            level: "N4",
            title: "Japanese N4 Level Course (3 Months Intermediate)",
            tagline: "Designed for SSW Job Visas & Direct University Admissions",
            fee: 14500,
            popular: false,
            desc: "Minna No Nihongo lessons 26-50, 250+ Kanji, complex grammar patterns, and fluent workplace communication. Complete prep for SSW Caregiver & Agriculture interviews.",
            features: [
              "Minna No Nihongo Part 2 book & worksheets free",
              "250+ Intermediate Kanji & compound words",
              "Passive, causative, and honorific Keigo grammar",
              "SSW technical vocabulary & interview drills",
              "6 Full-length JFT-Basic / JLPT N4 mock tests",
              "Conversational practice with native Japanese speakers",
            ],
            bonuses: [
              "SSW Sector Specific Interview & Skill Test Guide",
              "Business Japanese Etiquette & Keigo Workshop",
            ],
          },
          {
            id: "course-combo",
            level: "N5+N4",
            title: "N5 + N4 Complete Career Mastery Combo",
            tagline: "Zero to Direct Japan Departure Full-Stack Preparation",
            fee: 24000,
            discountedFee: 21500,
            popular: false,
            desc: "Comprehensive N5 + N4 curriculum in a single journey. From beginner alphabet to clearing Japanese job interviews. Highly recommended and most cost-effective package.",
            features: [
              "6 Months intensive mentorship & supervision",
              "All textbooks, Kanji notes & drill sheets delivered free",
              "Mastery of 350+ Kanji and 1,500+ Japanese vocabulary",
              "Ideal for both Student Visa & SSW Job candidates",
              "10 Full mock exams & personal academic counseling",
            ],
            bonuses: [
              "Complete Japan Visa Documentation Checklist & COE Audit",
            ],
          },
        ],
      },
      bn: {
        badge: "কোর্স প্যাকেজ ও ফি স্ট্রাকচার",
        title: "আপনার লক্ষ্য অনুযায়ী সঠিক কোর্স বেছে নিন",
        desc: "স্টুডেন্ট ভিসা, SSW জব ভিসা কিংবা টেকনিক্যাল ইন্টার্ন—সব ধরনের জাপান স্বপ্ন পূরণের উপযোগী সুনির্দিষ্ট কোর্স প্ল্যান।",
        popularBadge: "সবচেয়ে জনপ্রিয় চয়েস",
        durationLabel: "৩ মাস (১২০ ঘণ্টা)",
        durationLabelN4: "৩ মাস (১৩০ ঘণ্টা)",
        durationLabelCombo: "৬ মাস (২৫০ ঘণ্টা)",
        feeLabel: "ফি:",
        installmentN5: "এককালীন অথবা ২টি সহজ কিস্তিতে পরিশোধযোগ্য",
        installmentOther: "বই ও লেকচার শিটসহ সম্পূর্ণ প্যাকেজ",
        featuresHeader: "কোর্সে যা যা পাচ্ছেন:",
        bonusHeader: "ইনক্লুডেড ফ্রি বোনাস কোর্স:",
        freeTag: "ফ্রি",
        ctaEnroll: "এই কোর্সে ভর্তি হতে চাই",
        scheduleTitle: "ক্লাস শিডিউল ও টাইমিং",
        scheduleDesc: "সকাল ব্যাচ (৯:০০-১১:০০) • দুপুর ব্যাচ (৩:০০-৫:০০) • সন্ধ্যা ব্যাচ (৬:৩০-৮:৩০) • ফ্রাইডে-স্যাটারডে স্পেশাল",
        selectBatchBtn: "পছন্দের ব্যাচ সিলেকশন করুন",
        courses: [
          {
            id: "course-n5",
            level: "N5",
            title: "Japanese N5 Level Course (3 Months Intensive)",
            tagline: "জাপান স্টুডেন্ট ও জব ভিসার প্রথম ও সবচেয়ে গুরুত্বপূর্ণ ধাপ",
            fee: 12000,
            popular: true,
            desc: "হিরাগানা, কাতাকানা, ১০৩টি কাঞ্জি, মিন্না নো নিহোঙ্গো ১-২৫ অধ্যায় এবং JLPT N5 ও JFT-Basic পরীক্ষার ১০০% পরিপূর্ণ প্রস্তুতি। সাথে পাচ্ছেন সম্পূর্ণ বিনামূল্যে ১৫,০০০ টাকা মূল্যের ৩টি স্পেশাল ইন্টারভিউ ও সিভি বোনাস কোর্স।",
            features: [
              "Minna No Nihongo পাঠ্যবই ও লেকচার শিট সম্পূর্ণ ফ্রি",
              "হিরাগানা ও কাতাকানা নির্ভুল স্ট্রোক অর্ডার প্রশিক্ষণ",
              "১০৩টি বেসিক কাঞ্জি মেমোরি টেকনিক ও কুইজ",
              "নেটিভ জাপানি অডিও ট্র‍্যাক দিয়ে লিসেনিং ও স্পোকেন ড্রিলস",
              "JLPT N5 ও NAT-TEST স্ট্যান্ডার্ড ৫টি পূর্ণাঙ্গ মক টেস্ট",
              "অনলাইন রেকর্ডেড ক্লাস ব্যাকআপ ও লাইফটাইম স্টাডি ম্যাটেরিয়ালস",
            ],
            bonuses: [
              "১৫ দিনের জাপানিজ এম্বাসি ইন্টারভিউ প্রিপারেশন কোর্স",
              "১০ দিনের জাপানিজ রিজিউমি / সিভি (Rirekisho) রাইটিং কোর্স",
              "১০ দিনের পার্ট-টাইম জব (Baitō) ইন্টারভিউ ট্রেনিং",
            ],
          },
          {
            id: "course-n4",
            level: "N4",
            title: "Japanese N4 Level Course (3 Months Intermediate)",
            tagline: "SSW জব ভিসা ও জাপানি বিশ্ববিদ্যালয়ে ডিরেক্ট এডমিশনের জন্য",
            fee: 14500,
            popular: false,
            desc: "মিন্না নো নিহোঙ্গো ২৬-৫০ অধ্যায়, ২৫০+ অ্যাডভান্সড কাঞ্জি, কমপ্লেক্স গ্রামার প্যাটার্ন এবং কর্মক্ষেত্রে ফ্লুয়েন্ট কমিউনিকেশন। SSW কেয়ারগিভার, এগ্রিকালচার ও কনস্ট্রাকশন ইন্টারভিউয়ের পূর্ণাঙ্গ প্রস্তুতি।",
            features: [
              "Minna No Nihongo ২য় খণ্ড বই ও প্র্যাকটিস শিট ফ্রি",
              "২৫০+ মধ্যম স্তরের কাঞ্জি ও কম্পাউন্ড ওয়ার্ডস",
              "প্যাসিভ, কজেটিভ ও বিনীত কেইগো (Keigo) ব্যাকরণ",
              "SSW Job Interview স্পেশাল টেকনিক্যাল ভোকাবুলারি",
              "JFT-Basic / JLPT N4 স্ট্যান্ডার্ড ৬টি পূর্ণাঙ্গ মক টেস্ট",
              "জাপানি স্পিকারদের সাথে স্পোকেন ইন্টারঅ্যাকশন ক্লাস",
            ],
            bonuses: [
              "SSW সেক্টর ভিত্তিক স্পেশাল টেকনিক্যাল ইন্টারভিউ কোর্স",
              "বিজনেস জাপানিজ এটিকেট ও কেইগো ওয়ার্কশপ",
            ],
          },
          {
            id: "course-combo",
            level: "N5+N4",
            title: "N5 + N4 Complete Career Mastery Combo",
            tagline: "জিরো থেকে সরাসরি জাপান যাত্রার ফুল-স্ট্যাক প্রস্তুতি",
            fee: 24000,
            discountedFee: 21500,
            popular: false,
            desc: "একই কোর্সে N5 ও N4 কমপ্লিট কভারেজ। বর্ণমালা থেকে শুরু করে জাপানি জব ইন্টারভিউতে সফল হওয়া পর্যন্ত সব ধাপ কভার করা হয়। সবচেয়ে জনপ্রিয় ও সাশ্রয়ী অল-ইন-ওয়ান প্যাকেজ।",
            features: [
              "৬ মাসের সম্পূর্ণ নিবিড় মেন্টরশিপ ও সুপারভিশন",
              "সব পাঠ্যবই, কাঞ্জি নোট ও ড্রিল শিট ফ্রি ডেলিভারি",
              "৩৫০+ কাঞ্জি ও ১৫০০+ জাপানি শব্দের শক্ত দখল",
              "স্টুডেন্ট ও SSW দুই ধরনের ভিসার জন্যই উপযুক্ত",
              "সব মিলিয়ে ১০টি পূর্ণাঙ্গ মক টেস্ট ও ব্যক্তিগত কাউন্সেলিং",
            ],
            bonuses: [
              "কমপ্লিট ভিসা ডকুমেন্টেশন চেকলিস্ট অডিট",
            ],
          },
        ],
      },
      ja: {
        badge: "受講パッケージ・料金プラン",
        title: "目標に応じた最適なコースを選択",
        desc: "留学ビザ、特定技能（SSW）就労、技能実習生まで、目的に合わせた体系的な指導。",
        popularBadge: "一番人気のプラン",
        durationLabel: "3ヶ月（120時間）",
        durationLabelN4: "3ヶ月（130時間）",
        durationLabelCombo: "6ヶ月（250時間）",
        feeLabel: "受講料:",
        installmentN5: "一括または2回分割払い可能",
        installmentOther: "テキスト・ワークシートすべて受講料に含む",
        featuresHeader: "コース内容・特典:",
        bonusHeader: "無料付帯特典コース:",
        freeTag: "無料",
        ctaEnroll: "このコースに登録する",
        scheduleTitle: "柔軟なクラス時間割",
        scheduleDesc: "午前クラス（9:00〜11:00）• 午後クラス（15:00〜17:00）• 夜間クラス（18:30〜20:30）• 週末集中コース",
        selectBatchBtn: "希望クラスを選ぶ",
        courses: [
          {
            id: "course-n5",
            level: "N5",
            title: "日本語N5基礎マスターコース（3ヶ月集中）",
            tagline: "日本留学・就労ビザ取得の最重要ファーストステップ",
            fee: 12000,
            popular: true,
            desc: "ひらがな・カタカナ・基本漢字103字、『みんなの日本語』1〜25課、JLPT N5およびJFT-Basic合格を100%目指します。15,000タカ相当の面接・履歴書対策3講座が無料。",
            features: [
              "『みんなの日本語』正本テキスト・プリント無料配布",
              "ひらがな・カタカナの正確な書き順指導",
              "基本漢字103字の語源記憶法と毎週のテスト",
              "ネイティブ音声による実践的リスニング・会話演習",
              "JLPT/NAT基準の模擬試験（5回）実施",
              "録画アーカイブでいつでも復習可能",
            ],
            bonuses: [
              "15日間 日本大使館ビザ面接対策講座",
              "10日間 日本式履歴書（JIS規格）作成講座",
              "10日間 アルバイト採用面接トレーニング",
            ],
          },
          {
            id: "course-n4",
            level: "N4",
            title: "日本語N4中級ステップアップコース（3ヶ月）",
            tagline: "特定技能（SSW）就労・専門学校・大学進学対応",
            fee: 14500,
            popular: false,
            desc: "『みんなの日本語』26〜50課、応用漢字250字、受身・使役・敬語などの重要構文を網羅。介護・外食・農業などの特定技能面接にも直結。",
            features: [
              "『みんなの日本語』第2巻テキスト・ドリル無償提供",
              "中級漢字250字と複合語の語彙力強化",
              "受身・使役・丁寧な敬語（尊敬語・謙譲語）マスター",
              "特定技能（SSW）業種別専門用語・面接特訓",
              "JFT-Basic / JLPT N4本番レベル模擬テスト6回",
              "日本人ネイティブ講師との実戦会話セッション",
            ],
            bonuses: [
              "SSW分野別技能試験・面接ガイド講座",
              "ビジネスマナー＆敬語実践ワークショップ",
            ],
          },
          {
            id: "course-combo",
            level: "N5+N4",
            title: "N5 + N4 キャリアコンプリートパック（6ヶ月）",
            tagline: "入門から日本出国までを完全網羅するオールインワン",
            fee: 24000,
            discountedFee: 21500,
            popular: false,
            desc: "ゼロからN4合格・現地就業までを最短ルートで進む総合コース。個別進路指導とビザ書類審査つきの特別割引パッケージ。",
            features: [
              "6ヶ月間の専任講師による徹底個別指導",
              "全冊テキスト・漢字帳・教材の自宅無料配送",
              "漢字350字・必須語彙1,500語の確実な定着",
              "留学・特定技能双方の進路に対応",
              "計10回のフル模擬試験と進路カウンセリング",
            ],
            bonuses: [
              "ビザ申請書類・COE書類チェック＆個別監査",
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
    const form = document.getElementById("enrollment-form");
    if (form) {
      form.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="courses" className="bg-[#fcfaf7] py-16 md:py-24 border-b border-stone-200">
      <div className="container-narrow">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge className="border-red-200 bg-red-50 text-[#b91c1c] text-xs font-semibold px-3 py-1">
            {t.badge}
          </Badge>
          <h2 className="mt-3 text-3xl font-extrabold text-slate-900 md:text-4xl">
            {t.title}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            {t.desc}
          </p>
        </div>

        {/* 3 Course Packages Grid */}
        <div className="grid gap-8 lg:grid-cols-3 items-stretch">
          {t.courses.map((course) => {
            const isN5 = course.level === "N5";
            const durationText = isN5 ? t.durationLabel : course.level === "N4" ? t.durationLabelN4 : t.durationLabelCombo;

            return (
              <div
                key={course.id}
                className={`relative flex flex-col justify-between rounded-3xl bg-white p-6 sm:p-8 transition-all hover:shadow-xl ${
                  course.popular
                    ? "border-2 border-[#b91c1c] shadow-lg shadow-red-700/10 -translate-y-1 sm:-translate-y-2"
                    : "border border-stone-200 shadow-sm"
                }`}
              >
                {/* Popular Pill */}
                {course.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[#b91c1c] px-4 py-1 text-xs font-bold text-white shadow-md flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" />
                    {t.popularBadge}
                  </div>
                )}

                <div>
                  {/* Header info */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Level: {course.level}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-600 font-medium bg-stone-100 px-2.5 py-1 rounded-full">
                      <Clock className="h-3.5 w-3.5" />
                      {durationText}
                    </span>
                  </div>

                  <h3 className="mt-4 text-xl font-bold text-slate-900">{course.title}</h3>
                  <p className="mt-1 text-xs font-medium text-[#b91c1c]">{course.tagline}</p>

                  {/* Pricing Box */}
                  <div className="mt-5 rounded-2xl bg-stone-50 border border-stone-200 p-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-slate-900">
                        ৳{course.discountedFee || course.fee}
                      </span>
                      {course.discountedFee && (
                        <span className="text-sm text-slate-400 line-through">৳{course.fee}</span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-slate-600">
                      {isN5 ? t.installmentN5 : t.installmentOther}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {course.desc}
                  </p>

                  {/* Features Checklist */}
                  <div className="mt-6 border-t border-stone-100 pt-5">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      {t.featuresHeader}
                    </span>
                    <ul className="mt-3 space-y-2.5 text-xs sm:text-sm text-slate-700">
                      {course.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-green-100 text-[#15803d]">
                            <Check className="h-3 w-3" />
                          </div>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Free Bonus Inclusion Box */}
                  {course.bonuses && course.bonuses.length > 0 && (
                    <div className="mt-6 rounded-2xl border border-red-200 bg-red-50/60 p-3.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#b91c1c]">
                        <Gift className="h-4 w-4" />
                        <span>{t.bonusHeader}</span>
                      </div>
                      <div className="mt-2 space-y-1.5 text-xs text-slate-700">
                        {course.bonuses.map((b, bi) => (
                          <div key={bi} className="flex items-center justify-between font-medium">
                            <span>• {b}</span>
                            <span className="text-emerald-700 font-bold ml-1">{t.freeTag}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Enroll CTA */}
                <div className="mt-8 pt-4 border-t border-stone-100">
                  <Button
                    onClick={() => handleSelect(course.id)}
                    className={`w-full py-5 rounded-xl font-semibold text-sm shadow ${
                      course.popular
                        ? "bg-[#b91c1c] hover:bg-red-800 text-white shadow-red-700/20"
                        : "bg-[#15803d] hover:bg-emerald-700 text-white"
                    }`}
                  >
                    {t.ctaEnroll} <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Batch Delivery Schedule Notice */}
        <div className="mt-12 rounded-2xl border border-stone-200 bg-white p-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">{t.scheduleTitle}</h4>
              <p className="text-xs sm:text-sm text-slate-600">
                {t.scheduleDesc}
              </p>
            </div>
          </div>
          <Button
            onClick={() => handleSelect("course-n5")}
            variant="outline"
            className="border-stone-300 text-slate-800 hover:bg-stone-50 text-xs shrink-0 rounded-xl"
          >
            {t.selectBatchBtn}
          </Button>
        </div>
      </div>
    </section>
  );
}
