"use client";

import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  MessageCircle,
  PhoneCall,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";

export default function HeroCourseSection() {
  const { language } = useLanguage();

  const t = translate(
    {
      en: {
        kicker: "KNLTC Japan Gateway • Dhaka Center",
        headlinePart1: "Learn Japanese the Easy Way — ",
        headlineHighlight: "Your Trusted Gateway to Higher Study & Career in Japan",
        subtitle:
          "Comprehensive JLPT, NAT-TEST, and JFT-Basic preparation from N5 to N1 along with practical Irodori Japanese. Enrolled students access live classes, lecture notes, and recorded sessions directly on our LMS portal.",
        pill1: "All Books & Sheets Free",
        pill2: "Online Live & Offline Batches",
        pill3: "Native Speaker Interaction",
        ctaEnroll: "Enroll in Course Now",
        ctaLms: "Enter LMS Classroom",
        phoneLabel: "Admission Hotline:",
        phoneHours: "(10:00 AM – 8:00 PM)",
        cardTag: "Official Japanese Academy",
        cardTitle: "KNLTC Digital Classroom Portal",
        cardSub: "Connected to https://npw.bd/knltc",
        cardBadge: "Active LMS Platform",
        stat1Label: "Curriculum Level",
        stat1Value: "N5 to N1 & Irodori",
        stat2Label: "LMS Access",
        stat2Value: "Live & Recorded",
        bullet1: "JLPT, NAT-TEST & JFT-Basic certified structured syllabus",
        bullet2: "Complete Minna No Nihongo textbooks & audio files provided free",
        bullet3: "Includes 3 special Embassy & CV bonus courses (৳15,000 value free)",
        btnEnrollNow: "Apply for Seat in Form",
        btnLmsPortal: "Open LMS Portal",
        waChat: "Chat on WhatsApp",
      },
      bn: {
        kicker: "KNLTC জাপান গেটওয়ে • ঢাকা অফিশিয়াল সেন্টার",
        headlinePart1: "সহজ পদ্ধতিতে জাপানি ভাষা শিখুন — ",
        headlineHighlight: "জাপানে উচ্চশিক্ষা ও নিশ্চিত ক্যারিয়ারের বিশ্বস্ত গেটওয়ে",
        subtitle:
          "N5 থেকে শুরু করে N1 লেভেল এবং প্র্যাকটিক্যাল ইরোদোরি (Irodori Japanese) সমন্বিত পূর্ণাঙ্গ প্রস্তুতি। JLPT, NAT-TEST ও JFT-Basic পরীক্ষায় শতভাগ পাসের নিশ্চয়তা এবং সরাসরি KNLTC ডিজিটাল LMS ক্লাসরুম সুবিধা।",
        pill1: "সব পাঠ্যবই ও লেকচার শিট ফ্রি",
        pill2: "অনলাইন লাইভ ও হেড অফিস অফলাইন",
        pill3: "নেটিভ জাপানিজ মেন্টর সেশন",
        ctaEnroll: "এখনই কোর্সে ভর্তি হন",
        ctaLms: "LMS ক্লাসরুমে প্রবেশ করুন",
        phoneLabel: "এডমিশন হটলাইন:",
        phoneHours: "(সকাল ১০:০০ - রাত ৮:০০)",
        cardTag: "অফিশিয়াল জাপানিজ একাডেমি",
        cardTitle: "KNLTC ডিজিটাল ক্লাসরুম পোর্টাল",
        cardSub: "সরাসরি যুক্ত: https://npw.bd/knltc",
        cardBadge: "সক্রিয় LMS প্ল্যাটফর্ম",
        stat1Label: "পাঠ্যক্রম লেভেল",
        stat1Value: "N5 থেকে N1 ও ইরোদোরি",
        stat2Label: "LMS এক্সেস",
        stat2Value: "লাইভ ক্লাস ও রেকর্ডিং",
        bullet1: "JLPT, NAT-TEST ও JFT-Basic অনুমোদিত সুবিন্যস্ত সিলেবাস",
        bullet2: "মিন্না নো নিহোঙ্গো ১ ও ২ পাঠ্যবই এবং প্র্যাকটিস শিট সম্পূর্ণ ফ্রি",
        bullet3: "১৫,০০০ টাকা মূল্যের ৩টি স্পেশাল ইন্টারভিউ ও সিভি কোর্স সম্পূর্ণ ফ্রি",
        btnEnrollNow: "ভর্তির আবেদন করুন",
        btnLmsPortal: "LMS ক্লাসরুমে প্রবেশ",
        waChat: "হোয়াটসঅ্যাপে যোগাযোগ",
      },
      ja: {
        kicker: "KNLTC ジャパンゲートウェイ • ダッカ本部センター",
        headlinePart1: "わかりやすい日本語学習 — ",
        headlineHighlight: "日本留学・確実なキャリアへの信頼のゲートウェイ",
        subtitle:
          "N5〜N1および実践的な『いろどり日本語』に対応。JLPT・NAT・JFT合格とオンラインLMS教室（npw.bd/knltc）による徹底サポート。",
        pill1: "教科書・プリント完全無料",
        pill2: "対面＆オンライン同時開講",
        pill3: "日本人ネイティブ特別指導",
        ctaEnroll: "今すぐ受講登録",
        ctaLms: "LMS教室へ入室する",
        phoneLabel: "受講相談窓口:",
        phoneHours: "（10:00〜20:00）",
        cardTag: "公認 日本語アカデミー",
        cardTitle: "KNLTC 公式LMSクラスルーム",
        cardSub: "アクセス先: https://npw.bd/knltc",
        cardBadge: "稼働中ポータル",
        stat1Label: "対象レベル",
        stat1Value: "N5〜N1・いろどり",
        stat2Label: "LMS学習環境",
        stat2Value: "LIVE講義＆録画アーカイブ",
        bullet1: "JLPT・NAT・JFT-Basic公式基準カリキュラム",
        bullet2: "『みんなの日本語』教科書および練習プリント無償提供",
        bullet3: "15,000タカ相当の大使館面接・履歴書3大特典講座無料",
        btnEnrollNow: "受講申込みへ進む",
        btnLmsPortal: "LMSポータルを開く",
        waChat: "WhatsAppで相談",
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
    <section className="relative overflow-hidden bg-white pt-10 pb-16 md:pt-14 md:pb-22 border-b border-stone-200">
      <div className="container-narrow">
        {/* Top Kicker */}
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#b91c1c] mb-4">
          <ShieldCheck className="h-4 w-4" />
          <span>{t.kicker}</span>
        </div>

        {/* Main Grid: Headline & Value Prop on Left, Portal Preview on Right */}
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 leading-[1.28] sm:text-4xl md:text-5xl lg:text-[2.65rem]">
              {t.headlinePart1}
              <span className="text-[#b91c1c] underline decoration-red-300 underline-offset-4">
                {t.headlineHighlight}
              </span>
            </h1>

            <p className="text-base sm:text-lg leading-relaxed text-slate-700 font-normal max-w-2xl">
              {t.subtitle}
            </p>

            {/* Quiet Feature Indicators */}
            <div className="flex flex-wrap gap-x-5 gap-y-2 pt-1 text-xs sm:text-sm text-slate-700 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[#15803d]" />
                <span>{t.pill1}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[#15803d]" />
                <span>{t.pill2}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[#15803d]" />
                <span>{t.pill3}</span>
              </div>
            </div>

            {/* The Two Main CTAs as requested */}
            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <Button
                onClick={scrollToForm}
                size="lg"
                className="bg-[#b91c1c] hover:bg-red-800 text-white font-semibold text-base px-7 py-6 rounded-xl shadow-sm transition"
              >
                {t.ctaEnroll} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-stone-300 text-slate-800 hover:bg-stone-50 font-semibold text-base px-6 py-6 rounded-xl transition"
              >
                <a
                  href="https://npw.bd/knltc"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GraduationCap className="mr-2 h-5 w-5 text-[#b91c1c]" />
                  {t.ctaLms}
                  <ExternalLink className="ml-2 h-4 w-4 text-slate-400" />
                </a>
              </Button>
            </div>

            {/* Hotline & WhatsApp Quick Contact */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-2 border-t border-stone-100">
              <div className="flex items-center gap-2">
                <PhoneCall className="h-3.5 w-3.5 text-[#b91c1c]" />
                <span>
                  {t.phoneLabel}{" "}
                  <a
                    href="tel:+8801805013633"
                    className="font-bold text-slate-900 hover:text-[#b91c1c]"
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
                className="inline-flex items-center gap-1.5 font-semibold text-[#15803d] hover:underline"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                <span>{t.waChat}</span>
              </a>
            </div>
          </div>

          {/* Right Portal Card - Architectural, Sleek, High-End */}
          <div className="relative">
            <div className="rounded-2xl border border-stone-200 bg-[#fcfaf7] p-6 sm:p-7 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-stone-200/80">
                <div>
                  <span className="text-[11px] font-bold tracking-wider uppercase text-[#b91c1c]">
                    {t.cardTag}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                    {t.cardTitle}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    {t.cardSub}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-800">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#15803d] animate-pulse" />
                  {t.cardBadge}
                </span>
              </div>

              {/* Quick Specs 2-Column Grid */}
              <div className="grid grid-cols-2 gap-3 py-4 border-b border-stone-200/80 text-xs">
                <div className="rounded-xl bg-white p-3 border border-stone-200/60">
                  <span className="text-slate-500 block text-[11px]">{t.stat1Label}</span>
                  <span className="font-bold text-slate-900 mt-0.5 block text-xs sm:text-sm">
                    {t.stat1Value}
                  </span>
                </div>
                <div className="rounded-xl bg-white p-3 border border-stone-200/60">
                  <span className="text-slate-500 block text-[11px]">{t.stat2Label}</span>
                  <span className="font-bold text-slate-900 mt-0.5 block text-xs sm:text-sm">
                    {t.stat2Value}
                  </span>
                </div>
              </div>

              {/* Inclusions */}
              <div className="py-4 space-y-2.5 text-xs text-slate-700">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#15803d] shrink-0 mt-0.5" />
                  <span className="leading-snug">{t.bullet1}</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#15803d] shrink-0 mt-0.5" />
                  <span className="leading-snug">{t.bullet2}</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#15803d] shrink-0 mt-0.5" />
                  <span className="leading-snug">{t.bullet3}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex gap-2.5">
                <Button
                  onClick={scrollToForm}
                  className="flex-1 bg-[#b91c1c] hover:bg-red-800 text-white font-semibold text-xs py-5 rounded-xl transition"
                >
                  {t.btnEnrollNow}
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-stone-300 hover:bg-white text-slate-800 text-xs font-semibold py-5 px-3.5 rounded-xl shrink-0"
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
          </div>
        </div>
      </div>
    </section>
  );
}
