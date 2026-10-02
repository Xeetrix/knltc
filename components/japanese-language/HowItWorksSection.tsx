"use client";

import { ArrowRight, CheckCircle2, ExternalLink, GraduationCap, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";

export default function HowItWorksSection() {
  const { language } = useLanguage();

  const t = translate(
    {
      en: {
        kicker: "Enrollment Workflow",
        title: "Start Your Japanese Language Journey in 3 Easy Steps",
        subtitle:
          "From submitting the admission form to accessing your online LMS classroom on https://npw.bd/knltc — quick, transparent, and verified.",
        step1Tag: "Step 01",
        step1Title: "Submit Enrollment Application",
        step1Desc:
          "Fill out the quick enrollment form below with your full name, phone number, WhatsApp, preferred course, and delivery mode.",
        step1Action: "Fill Form Below",
        step2Tag: "Step 02",
        step2Title: "Verification & Account Setup",
        step2Desc:
          "Our academic team contacts you to verify payment and creates your dedicated student account on https://npw.bd/knltc, sending your login credentials via WhatsApp/SMS.",
        step2Badge: "Fast Response",
        step3Tag: "Step 03",
        step3Title: "Enter LMS Classroom & Begin Learning",
        step3Desc:
          "Log in to our dedicated digital LMS classroom with your username and password to attend live Zoom classes, watch recorded lectures, and download worksheets.",
        step3Action: "Visit LMS Portal",
      },
      bn: {
        kicker: "ভর্তি প্রক্রিয়া",
        title: "৩টি সহজ ধাপে আপনার যাত্রা শুরু করুন",
        subtitle:
          "ভর্তি ফর্ম পূরণ করা থেকে শুরু করে অফিশিয়াল LMS ক্লাসরুমে প্রবেশ পর্যন্ত—সবকিছুই সহজ, স্বচ্ছ এবং দ্রুততম সময়ে সম্পন্ন হয়।",
        step1Tag: "ধাপ ০১",
        step1Title: "নিচের ফর্মে ভর্তির আবেদন সম্পন্ন করুন",
        step1Desc:
          "আপনার নাম, মোবাইল, হোয়াটসঅ্যাপ নম্বর, পছন্দের কোর্স (N5/N4/Irodori) ও ক্লাসের মাধ্যম নির্বাচন করে সাবমিট করুন।",
        step1Action: "নিচে ফর্ম পূরণ করুন",
        step2Tag: "ধাপ ০২",
        step2Title: "পেমেন্ট ভেরিফিকেশন ও LMS অ্যাকাউন্ট তৈরি",
        step2Desc:
          "আমাদের অ্যাডমিশন টিম আপনার সাথে যোগাযোগ করে পেমেন্ট ভেরিফাই করবে এবং আপনার LMS অ্যাকাউন্ট তৈরি করে ইউজারনেম ও পাসওয়ার্ড হোয়াটসঅ্যাপে পাঠিয়ে দেবে।",
        step2Badge: "দ্রুততম সময়ে",
        step3Tag: "ধাপ ০৩",
        step3Title: "LMS ক্লাসরুমে প্রবেশ ও ক্লাস শুরু",
        step3Desc:
          "সরাসরি KNLTC অফিশিয়াল ক্লাসরুমে লগইন করে লাইভ ক্লাস, রেকর্ডেড ভিডিও, পিডিএফ শিট ও মক টেস্ট রিসোর্স এক্সেস করুন।",
        step3Action: "LMS পোর্টালে প্রবেশ",
      },
      ja: {
        kicker: "受講までの流れ",
        title: "3つの簡単なステップで学習をスタート",
        subtitle:
          "受講申請から公式LMS教室へのアクセスまでスムーズにご案内します。",
        step1Tag: "ステップ 01",
        step1Title: "受講申込みフォームの送信",
        step1Desc:
          "ページ下部のフォームにお名前、連絡先、希望コース（N5/N4/いろどり）および受講形式を入力して送信します。",
        step1Action: "申込みフォームへ",
        step2Tag: "ステップ 02",
        step2Title: "受講料確認とLMSアカウント発行",
        step2Desc:
          "スタッフが確認後、公式LMSのアカウントID・パスワードをWhatsAppまたはSMSにて送付します。",
        step2Badge: "迅速対応",
        step3Tag: "ステップ 03",
        step3Title: "LMSにログインして受講開始",
        step3Desc:
          "公式LMSにログインし、ライブ講義、録画アーカイブ、テキスト教材、模擬試験をご利用いただけます。",
        step3Action: "LMSポータルへ",
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
    <section className="py-16 md:py-20 bg-white border-b border-stone-200">
      <div className="container-narrow">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
          <p className="text-xs font-bold uppercase tracking-widest text-[#b91c1c]">
            {t.kicker}
          </p>
          <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
            {t.title}
          </h2>
          <p className="mt-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* 3 Step Cards Grid - Clean, Architectural, Minimalist */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Step 1 */}
          <div className="flex flex-col justify-between rounded-2xl border border-stone-200 bg-[#fcfaf7] p-6 sm:p-7 shadow-xs hover:border-stone-300 transition">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#b91c1c]">
                  {t.step1Tag}
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-[#b91c1c]">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                {t.step1Title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.step1Desc}
              </p>
            </div>

            <div className="pt-5 mt-4 border-t border-stone-200/60">
              <Button
                onClick={scrollToForm}
                variant="outline"
                size="sm"
                className="w-full border-stone-300 hover:bg-white text-slate-800 font-semibold text-xs rounded-xl"
              >
                {t.step1Action} <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col justify-between rounded-2xl border border-stone-200 bg-[#fcfaf7] p-6 sm:p-7 shadow-xs hover:border-stone-300 transition">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#15803d]">
                  {t.step2Tag}
                </span>
                <span className="text-[11px] font-semibold text-[#15803d] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  {t.step2Badge}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                {t.step2Title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.step2Desc}
              </p>
            </div>

            <div className="pt-5 mt-4 border-t border-stone-200/60">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#15803d]">
                <UserCheck className="h-4 w-4" />
                <span>WhatsApp / SMS Credential Delivery</span>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col justify-between rounded-2xl border border-stone-200 bg-[#fcfaf7] p-6 sm:p-7 shadow-xs hover:border-stone-300 transition">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-800">
                  {t.step3Tag}
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white">
                  <GraduationCap className="h-4 w-4" />
                </div>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                {t.step3Title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.step3Desc}
              </p>
            </div>

            <div className="pt-5 mt-4 border-t border-stone-200/60">
              <Button
                asChild
                size="sm"
                className="w-full bg-[#b91c1c] hover:bg-red-800 text-white font-semibold text-xs rounded-xl shadow-xs"
              >
                <a
                  href="https://npw.bd/knltc"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t.step3Action} <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
