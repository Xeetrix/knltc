"use client";

import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Gift,
  GraduationCap,
  MessageCircle,
  PhoneCall,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";

export default function HeroCourseSection() {
  const { language } = useLanguage();

  const t = translate(
    {
      en: {
        admissionBadge: "New Batches Enrolling • Limited Seats",
        bonusBadge: "3 Special Courses Worth ৳15,000 Completely Free!",
        headlinePart1: "Learn Japanese the Easy Way — ",
        headlineHighlight: "Your Trusted Gateway to Higher Study & Career in Japan",
        subtitle:
          "Comprehensive preparation for JLPT, NAT-TEST, and JFT-Basic from N5 to N1 along with practical Irodori Japanese. Master speaking, listening, grammar, and Kanji with KNLTC's proven methodology and digital LMS classroom support.",
        pill1: "All Books & Sheets Free",
        pill2: "Online Live & Offline Batches",
        pill3: "Native Speaker Interaction",
        ctaEnroll: "Enroll in Course Now",
        ctaLms: "Enter LMS Classroom",
        phoneLabel: "Hotline Support:",
        phoneHours: "(10:00 AM - 8:00 PM)",
        cardTag: "N5 Special Package",
        cardTitle: "Japanese N5 Intensive Batch",
        cardSub: "3-Month Complete Course",
        feeLabel: "Course Fee",
        installment: "Installments Available",
        feeNote: "Textbooks, lecture sheets, audio files & mock tests included with zero extra cost.",
        bullet1: "Hiragana, Katakana & 103+ Basic Kanji",
        bullet2: "Minna No Nihongo Lessons 1-25 & Grammar",
        bullet3: "5 Full-length Mock Tests for JLPT N5 & JFT",
        bonusHeader: "Exclusive Free Bonuses for N5:",
        bonus1: "• 15-Day Embassy Interview Preparation Course",
        bonus2: "• 10-Day Japanese Resume (Rirekisho) Writing Course",
        bonus3: "• 10-Day Part-time Job (Baitō) Interview Training",
        btnBook: "Book Your Seat Now",
        btnLmsDirect: "LMS Classroom Login",
      },
      bn: {
        admissionBadge: "নতুন ব্যাচে ভর্তি চলছে • সীমিত আসন",
        bonusBadge: "১৫,০০০ টাকা মূল্যের ৩টি স্পেশাল কোর্স সম্পূর্ণ ফ্রি!",
        headlinePart1: "সহজ পদ্ধতিতে জাপানি ভাষা শিখুন — ",
        headlineHighlight: "জাপানে উচ্চশিক্ষা ও নিশ্চিত ক্যারিয়ারের বিশ্বস্ত গেটওয়ে",
        subtitle:
          "N5 থেকে শুরু করে N1 লেভেল এবং প্র্যাকটিক্যাল ইরোদোরি (Irodori Japanese) সমন্বিত পূর্ণাঙ্গ প্রস্তুতি। JLPT, NAT-TEST ও JFT-Basic পরীক্ষায় শতভাগ পাসের নিশ্চয়তা, সহজ বাংলা ব্যাখ্যা ও সরাসরি KNLTC ডিজিটাল LMS ক্লাসরুম সুবিধা।",
        pill1: "সব পাঠ্যবই ও শিট ফ্রি",
        pill2: "অনলাইন লাইভ ও অফলাইন ব্যাচ",
        pill3: "নেটিভ স্পিকার ইন্টারঅ্যাকশন",
        ctaEnroll: "এখনই কোর্সে ভর্তি হন",
        ctaLms: "LMS ক্লাসরুমে প্রবেশ করুন",
        phoneLabel: "সরাসরি কথা বলুন:",
        phoneHours: "(সকাল ১০:০০ - রাত ৮:০০)",
        cardTag: "N5 Special Package",
        cardTitle: "জাপানিজ N5 কোর্স ব্যাচ",
        cardSub: "৩ মাস মেয়াদি নিবিড় প্রস্তুতি প্রোগ্রাম",
        feeLabel: "কোর্স ফি",
        installment: "কিস্তির সুবিধা আছে",
        feeNote: "বই, শিট, অডিও ফাইল ও মক টেস্ট ফি সম্পূর্ণ ফ্রি অন্তর্ভুক্ত। কোনো অতিরিক্ত চার্জ নেই।",
        bullet1: "বর্ণমালা (হিরাগানা + কাতাকানা) নির্ভুল স্ট্রোক অর্ডার",
        bullet2: "১০৩টি কাঞ্জি ও মিন্না নো নিহোঙ্গো ১-২৫ অধ্যায়",
        bullet3: "JLPT N5 ও JFT-Basic অনুরূপ ৫টি পূর্ণাঙ্গ মক টেস্ট",
        bonusHeader: "N5 ভর্তিতে এক্সক্লুসিভ ফ্রি বোনাস:",
        bonus1: "• ১৫ দিনের জাপানিজ এম্বাসি ইন্টারভিউ প্রিপারেশন কোর্স",
        bonus2: "• ১০ দিনের জাপানিজ সিভি / রিজিউমি রাইটিং কোর্স",
        bonus3: "• ১০ দিনের পার্ট-টাইম জব ইন্টারভিউ ট্রেনিং",
        btnBook: "এখনই সিট বুকিং করুন",
        btnLmsDirect: "LMS শিক্ষার্থী লগইন",
      },
      ja: {
        admissionBadge: "新規受講生募集中・定員限定",
        bonusBadge: "15,000タカ相当の特典3講座が無料！",
        headlinePart1: "わかりやすい日本語学習 — ",
        headlineHighlight: "日本留学・確実なキャリアへの信頼のゲートウェイ",
        subtitle:
          "N5〜N1および実践的な『いろどり日本語』に対応。JLPT・NAT・JFT合格とオンラインLMS教室（npw.bd/knltc）による徹底サポート。",
        pill1: "教材・テキスト無料提供",
        pill2: "対面＆オンライン開講",
        pill3: "ネイティブ講師セッション",
        ctaEnroll: "今すぐ受講登録",
        ctaLms: "LMS教室へ入室する",
        phoneLabel: "お電話窓口:",
        phoneHours: "（10:00〜20:00）",
        cardTag: "N5 特別パッケージ",
        cardTitle: "日本語N5集中講座",
        cardSub: "3ヶ月集中マスタープログラム",
        feeLabel: "受講料",
        installment: "分割払い可",
        feeNote: "教科書、練習シート、音声ファイル、模擬試験すべて込み。",
        bullet1: "ひらがな・カタカナの正確な書き順",
        bullet2: "基本漢字103字＋『みんなの日本語』1〜25課",
        bullet3: "JLPT N5・JFT本番レベルの模擬試験5回",
        bonusHeader: "N5受講特典（無料）:",
        bonus1: "• 15日間 大使館ビザ面接対策コース",
        bonus2: "• 10日間 日本式履歴書（JIS規格）作成コース",
        bonus3: "• 10日間 アルバイト採用面接トレーニング",
        btnBook: "席を予約する",
        btnLmsDirect: "受講生 LMSログイン",
      },
    },
    language,
  );

  const scrollToForm = () => {
    const el = document.getElementById("enrollment-form");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#fcfaf7] via-white to-red-50/30 pt-10 pb-16 md:pt-14 md:pb-24 border-b border-stone-200">
      {/* Decorative Background Elements */}
      <div className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-red-100/50 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 left-0 h-80 w-80 rounded-full bg-green-100/40 blur-3xl" />

      <div className="container-narrow relative">
        {/* Top Badges & Announcement */}
        <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
          <Badge className="border-red-200 bg-red-50 px-3.5 py-1.5 text-xs font-semibold text-[#b91c1c] shadow-xs hover:bg-red-100 transition">
            <Sparkles className="mr-1.5 h-3.5 w-3.5" />
            {t.admissionBadge}
          </Badge>
          <Badge className="border-green-200 bg-green-50 px-3.5 py-1.5 text-xs font-semibold text-[#15803d] shadow-xs hover:bg-green-100 transition">
            <Gift className="mr-1.5 h-3.5 w-3.5" />
            {t.bonusBadge}
          </Badge>
        </div>

        {/* Main Headline & Value Proposition */}
        <div className="mt-6 grid gap-8 lg:grid-cols-[1.25fr_0.95fr] lg:items-center">
          <div className="space-y-6">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 leading-[1.3] sm:text-4xl md:text-5xl lg:text-[2.75rem]">
              {t.headlinePart1}
              <span className="text-[#b91c1c] underline decoration-red-300 underline-offset-4">
                {t.headlineHighlight}
              </span>
            </h1>

            <p className="text-base sm:text-lg leading-relaxed text-slate-700 font-normal max-w-2xl">
              {t.subtitle}
            </p>

            {/* Quick Feature Pills */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 pt-1">
              <div className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white/90 p-2.5 shadow-xs text-xs sm:text-sm font-medium text-slate-800">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#15803d]" />
                <span>{t.pill1}</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white/90 p-2.5 shadow-xs text-xs sm:text-sm font-medium text-slate-800">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#15803d]" />
                <span>{t.pill2}</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white/90 p-2.5 shadow-xs text-xs sm:text-sm font-medium text-slate-800 col-span-2 sm:col-span-1">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#15803d]" />
                <span>{t.pill3}</span>
              </div>
            </div>

            {/* Two Main CTAs as requested */}
            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <Button
                onClick={scrollToForm}
                size="lg"
                className="bg-[#b91c1c] hover:bg-red-800 text-white font-semibold text-base px-7 py-6 rounded-xl shadow-lg shadow-red-700/20 transition-all hover:shadow-xl hover:-translate-y-0.5"
              >
                {t.ctaEnroll} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-red-600/40 text-[#b91c1c] hover:bg-red-50/80 font-semibold text-base px-6 py-6 rounded-xl transition"
              >
                <a
                  href="https://npw.bd/knltc"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GraduationCap className="mr-2 h-5 w-5 text-[#b91c1c]" />
                  {t.ctaLms}
                  <ExternalLink className="ml-2 h-4 w-4 opacity-75" />
                </a>
              </Button>
            </div>

            {/* Helpline Info */}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 pt-1">
              <PhoneCall className="h-4 w-4 text-[#b91c1c]" />
              <span>
                {t.phoneLabel}{" "}
                <a href="tel:+8801805013633" className="font-semibold text-slate-900 hover:text-[#b91c1c] underline">
                  +880 1805 013633
                </a>{" "}
                {t.phoneHours}
              </span>
            </div>
          </div>

          {/* Right Hero Visual Card */}
          <div className="relative">
            <div className="rounded-3xl border-2 border-red-100 bg-white p-6 shadow-xl shadow-stone-200/70 relative overflow-hidden">
              <div className="absolute top-0 right-0 rounded-bl-2xl bg-[#b91c1c] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs">
                {t.cardTag}
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-[#b91c1c]">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{t.cardTitle}</h3>
                  <p className="text-xs text-slate-600">{t.cardSub}</p>
                </div>
              </div>

              {/* Price & Highlight */}
              <div className="mt-5 rounded-2xl bg-[#fcfaf7] border border-stone-200 p-4">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">{t.feeLabel}</span>
                    <div className="text-3xl font-extrabold text-[#b91c1c]">৳12,000</div>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                    {t.installment}
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  {t.feeNote}
                </p>
              </div>

              {/* Course Deliverables List */}
              <div className="mt-4 space-y-2.5 text-xs sm:text-sm text-slate-700">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-[#15803d]" />
                  <span>{t.bullet1}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-[#15803d]" />
                  <span>{t.bullet2}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-[#15803d]" />
                  <span>{t.bullet3}</span>
                </div>
              </div>

              {/* Free Bonuses Callout Box */}
              <div className="mt-5 rounded-2xl border border-dashed border-red-300 bg-red-50/70 p-3.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#b91c1c]">
                  <Gift className="h-4 w-4" />
                  <span>{t.bonusHeader}</span>
                </div>
                <ul className="mt-2 space-y-1 text-xs text-slate-700">
                  <li>{t.bonus1}</li>
                  <li>{t.bonus2}</li>
                  <li>{t.bonus3}</li>
                </ul>
              </div>

              <div className="mt-5 flex gap-2">
                <Button
                  onClick={scrollToForm}
                  className="w-full bg-[#15803d] hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl py-5 shadow-xs"
                >
                  {t.btnBook}
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-red-200 text-[#b91c1c] hover:bg-red-50 rounded-xl px-4 text-xs font-semibold shrink-0"
                >
                  <a
                    href="https://npw.bd/knltc"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1"
                  >
                    <span>LMS</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
