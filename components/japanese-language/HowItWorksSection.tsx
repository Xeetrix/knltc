"use client";

import { CheckCircle2, ArrowRight, ExternalLink, GraduationCap, UserCheck, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";

export default function HowItWorksSection() {
  const { language } = useLanguage();

  const t = translate(
    {
      en: {
        badge: "Simple 3-Step Enrollment Workflow",
        title: "Start Your Japanese Language Journey in 3 Easy Steps",
        subtitle:
          "From filling out the admission form to accessing your online LMS classroom on npw.bd/knltc — quick, transparent, and hassle-free.",
        step1Tag: "Step 01",
        step1Title: "Submit Enrollment Application",
        step1Desc:
          "Fill out the quick enrollment form below with your name, phone, WhatsApp number, preferred course (N5/N4/Irodori), and delivery mode.",
        step1Action: "Fill Form Below",
        step2Tag: "Step 02",
        step2Title: "Verification & Account Setup",
        step2Desc:
          "Our academic team contacts you to verify payment and creates your dedicated student account on the official LMS platform (https://npw.bd/knltc), sending your login credentials via WhatsApp/SMS.",
        step2Badge: "Within 2 Hours",
        step3Tag: "Step 03",
        step3Title: "Enter LMS Classroom",
        step3Desc:
          "Directly log in to https://npw.bd/knltc with your username and password to attend live Zoom classes, access recorded video lessons, download handouts, and track your progress.",
        step3Action: "Visit LMS Portal",
        lmsCalloutTitle: "Already have your LMS credentials?",
        lmsCalloutDesc:
          "Access your enrolled batches, video archive, and Minna No Nihongo lecture sheets directly on the KNLTC LMS platform.",
        lmsCalloutBtn: "Student LMS Login (npw.bd/knltc)",
      },
      bn: {
        badge: "সহজ ৩-ধাপের ভর্তি প্রক্রিয়া",
        title: "৩টি সহজ ধাপে আপনার যাত্রা শুরু করুন",
        subtitle:
          "ভর্তি ফর্ম পূরণ করা থেকে শুরু করে npw.bd/knltc ক্লাসরুমে প্রবেশ পর্যন্ত—সবকিছুই অত্যন্ত সহজ, স্বচ্ছ এবং দ্রুততম সময়ে সম্পন্ন হয়।",
        step1Tag: "ধাপ ০১",
        step1Title: "নিচের ফর্মে ভর্তির আবেদন সম্পন্ন করুন",
        step1Desc:
          "আপনার নাম, মোবাইল, হোয়াটসঅ্যাপ নম্বর, পছন্দের কোর্স (N5/N4/Irodori) ও ক্লাসের মাধ্যম নির্বাচন করে সাবমিট করুন।",
        step1Action: "নিচে ফর্ম পূরণ করুন",
        step2Tag: "ধাপ ০২",
        step2Title: "পেমেন্ট ভেরিফিকেশন ও LMS অ্যাকাউন্ট তৈরি",
        step2Desc:
          "আমাদের অ্যাডমিশন টিম দ্রুত আপনার সাথে যোগাযোগ করে পেমেন্ট ভেরিফাই করবে এবং আপনার LMS অ্যাকাউন্ট তৈরি করে ইউজারনেম ও পাসওয়ার্ড হোয়াটসঅ্যাপে পাঠিয়ে দেবে।",
        step2Badge: "দ্রুততম সময়ে",
        step3Tag: "ধাপ ০৩",
        step3Title: "LMS ক্লাসরুমে প্রবেশ ও ক্লাস শুরু",
        step3Desc:
          "সরাসরি https://npw.bd/knltc পোর্টালে লগইন করে লাইভ ক্লাস, রেকর্ডেড ভিডিও, পিডিএফ শিট ও মক টেস্ট রিসোর্স এক্সেস করুন।",
        step3Action: "LMS পোর্টালে প্রবেশ",
        lmsCalloutTitle: "ইতিমধ্যে কি আপনার LMS আইডি পেয়েছেন?",
        lmsCalloutDesc:
          "সরাসরি KNLTC-এর অফিশিয়াল অনলাইন লার্নিং প্ল্যাটফর্মে লগইন করে লাইভ ক্লাসে অংশ নিন এবং লেকচার শিট ডাউনলোড করুন।",
        lmsCalloutBtn: "শিক্ষার্থী LMS লগইন (npw.bd/knltc)",
      },
      ja: {
        badge: "シンプルな3ステップ受講手順",
        title: "3つの簡単なステップで日本語学習をスタート",
        subtitle:
          "受講申請から専用LMSプラットフォーム（npw.bd/knltc）へのアクセスまで、スムーズかつ迅速にサポートします。",
        step1Tag: "ステップ 01",
        step1Title: "受講申込みフォームの送信",
        step1Desc:
          "ページ下部のフォームにお名前、連絡先、希望コース（N5/N4/いろどり）および受講形式を入力して送信します。",
        step1Action: "申込みフォームへ",
        step2Tag: "ステップ 02",
        step2Title: "受講料確認とLMSアカウント発行",
        step2Desc:
          "担当スタッフよりご連絡し受講手続き完了後、公式LMS（https://npw.bd/knltc）のアカウントID・パスワードをWhatsAppまたはSMSにて送付します。",
        step2Badge: "最短即日",
        step3Tag: "ステップ 03",
        step3Title: "LMSにログインして受講開始",
        step3Desc:
          "https://npw.bd/knltc にログインし、ライブZoom授業、録画アーカイブ、テキスト教材、模擬試験を今すぐ利用できます。",
        step3Action: "LMSポータルへ",
        lmsCalloutTitle: "既に受講生IDをお持ちですか？",
        lmsCalloutDesc:
          "公式LMSプラットフォームから直接講義への参加や教材ダウンロードが可能です。",
        lmsCalloutBtn: "受講生 LMSログイン (npw.bd/knltc)",
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
    <section className="section-padding bg-[#fcfaf7] border-y border-stone-200">
      <div className="container-narrow">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <Badge className="border-red-200 bg-red-50 text-[#b91c1c] mb-3 px-3 py-1 font-semibold text-xs shadow-xs">
            {t.badge}
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
            {t.title}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid gap-6 md:grid-cols-3 relative">
          {/* Step 1 */}
          <div className="relative flex flex-col justify-between rounded-2xl border-2 border-stone-200 bg-white p-6 shadow-sm hover:shadow-md transition">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="rounded-xl bg-red-100 text-[#b91c1c] px-3 py-1 text-xs font-bold uppercase tracking-wider">
                  {t.step1Tag}
                </span>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-[#b91c1c]">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug">
                {t.step1Title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t.step1Desc}
              </p>
            </div>

            <div className="pt-6 mt-4 border-t border-stone-100">
              <Button
                onClick={scrollToForm}
                variant="outline"
                size="sm"
                className="w-full border-red-200 text-[#b91c1c] hover:bg-red-50 font-semibold text-xs rounded-xl"
              >
                {t.step1Action} <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative flex flex-col justify-between rounded-2xl border-2 border-emerald-200 bg-emerald-50/30 p-6 shadow-sm hover:shadow-md transition">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="rounded-xl bg-emerald-100 text-[#15803d] px-3 py-1 text-xs font-bold uppercase tracking-wider">
                  {t.step2Tag}
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                  {t.step2Badge}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug">
                {t.step2Title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t.step2Desc}
              </p>
            </div>

            <div className="pt-6 mt-4 border-t border-emerald-100/80">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
                <UserCheck className="h-4 w-4" />
                <span>WhatsApp / SMS Credential Delivery</span>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative flex flex-col justify-between rounded-2xl border-2 border-red-200 bg-white p-6 shadow-sm hover:shadow-md transition">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="rounded-xl bg-[#b91c1c] text-white px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-xs">
                  {t.step3Tag}
                </span>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-[#b91c1c]">
                  <GraduationCap className="h-5 w-5" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug">
                {t.step3Title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t.step3Desc}
              </p>
            </div>

            <div className="pt-6 mt-4 border-t border-stone-100">
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

        {/* LMS Callout Banner */}
        <div className="mt-10 rounded-2xl border border-stone-200 bg-gradient-to-r from-red-900 to-red-800 p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-amber-200 mb-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Official KNLTC Classroom Portal</span>
            </div>
            <h4 className="text-xl font-bold tracking-tight">{t.lmsCalloutTitle}</h4>
            <p className="text-xs sm:text-sm text-white/80 max-w-xl">
              {t.lmsCalloutDesc}
            </p>
          </div>
          <Button
            asChild
            size="lg"
            className="shrink-0 bg-white text-[#b91c1c] hover:bg-red-50 font-bold text-sm px-6 py-5 rounded-xl shadow-lg transition"
          >
            <a
              href="https://npw.bd/knltc"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GraduationCap className="mr-2 h-4 w-4" />
              {t.lmsCalloutBtn}
              <ExternalLink className="ml-2 h-3.5 w-3.5 opacity-80" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
