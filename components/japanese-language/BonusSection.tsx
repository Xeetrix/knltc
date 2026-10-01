"use client";

import {
  Briefcase,
  CheckCircle2,
  FileSpreadsheet,
  Gift,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";

export default function BonusSection() {
  const { language } = useLanguage();

  const t = translate(
    {
      en: {
        bannerTag: "Exclusive Free Bonus Package Included with N5 Course",
        bannerTitle1: "3 Specialized Courses Worth ৳15,000 Received ",
        bannerHighlight: "Completely FREE!",
        bannerDesc:
          "Many learners acquire vocabulary but stumble at the Japanese Embassy interview or struggle to find a part-time job upon arrival. These KNLTC exclusive bonus courses prepare you 100% from Day 1.",
        btnEnroll: "Enroll Now with Free Bonuses",
        limitedNotice: "Applicable for the first 50 admitted students this intake",
        bonus1Badge: "BONUS 01",
        bonus1Duration: "15-Day Intensive",
        bonus1Val: "৳6,000",
        bonus1Title: "Japanese Embassy Visa Interview Preparation Course",
        bonus1Sub: "Eliminate rejection anxiety and pass the visa officer interview on your 1st try",
        bonus1Points: [
          "Model answers for the 30+ most frequent Japanese visa officer questions.",
          "Clear presentation of your study motivation in Japan (Shibou Douki / 志望動機).",
          "Handling financial sponsorship and parental tax proof cross-examination.",
          "Live camera mock interview simulations with personalized constructive feedback.",
        ],
        bonus2Badge: "BONUS 02",
        bonus2Duration: "10-Day Practical",
        bonus2Val: "৳4,500",
        bonus2Title: "Japanese Resume / CV (Rirekisho) Writing Course",
        bonus2Sub: "Drafting flawless resumes adhering strictly to Japan's JIS official standards",
        bonus2Points: [
          "Rules and phrasing for Japan's official 履歴書 (Rirekisho) and 職務経歴書.",
          "Highlighting personal strengths and self-promotion (Jiko PR / 自己PR) effectively.",
          "Photo etiquette, business suit dress code, and Japanese Reiwa year notation.",
          "Individual drafting and instructor audit of your completed Japanese CV.",
        ],
        bonus3Badge: "BONUS 03",
        bonus3Duration: "10-Day Job Training",
        bonus3Val: "৳4,500",
        bonus3Title: "Part-Time Job (Baitō) Interview & Workplace Training",
        bonus3Sub: "Secure convenience store and restaurant jobs immediately after arriving in Japan",
        bonus3Points: [
          "Essential conversational phrases for 7-Eleven, Lawson, and restaurant jobs.",
          "Customer service etiquette (Irasshaimase, Arigatou Gozaimasu, Omatase Itashimashita).",
          "Conducting job phone calls and scheduling interview appointments in Japanese.",
          "Rules of 28 hours/week student work permits, tax compliance, and workplace harmony.",
        ],
        freeBadge: "FREE",
        handoutLabel: "Certificates & Handouts:",
        includedLabel: "Included",
      },
      bn: {
        bannerTag: "N5 কোর্সে ভর্তিতে এক্সক্লুসিভ ফ্রি বোনাস প্যাকেজ",
        bannerTitle1: "১৫,০০০ টাকা মূল্যের ৩টি স্পেশালাইজড কোর্স পাচ্ছেন ",
        bannerHighlight: "সম্পূর্ণ বিনামূল্যে!",
        bannerDesc:
          "অনেকেই ভাষা শিখলেও এম্বাসি ইন্টারভিউতে আটকে যান কিংবা জাপানে গিয়ে পার্ট-টাইম কাজের ইন্টারভিউ দিতে হিমশিম খান। KNLTC-এর এই স্পেশাল বোনাস কোর্সগুলো আপনাকে শুরু থেকেই ১০০% প্রস্তুত রাখবে।",
        btnEnroll: "বোনাসসহ এখনই ভর্তি হন",
        limitedNotice: "সীমিত সংখ্যক প্রথম ৫০ জন শিক্ষার্থীর জন্য প্রযোজ্য",
        bonus1Badge: "বোনাস ০১",
        bonus1Duration: "১৫ দিন নিবিড় কোর্স",
        bonus1Val: "৳৬,০০০",
        bonus1Title: "জাপানিজ এম্বাসি ইন্টারভিউ প্রিপারেশন কোর্স",
        bonus1Sub: "ভিসা রিজেকশনের ভয় দূর করে প্রথমবারেই ভিসা নিশ্চিত করার সিক্রেট মেথড",
        bonus1Points: [
          "এম্বাসির জাপানি ভিসা অফিসারের সর্বাধিক জিজ্ঞাসিত ৩০+ প্রশ্নের মডেল উত্তর।",
          "জাপানে পড়ার আসল উদ্দেশ্য (Shibou Douki / 志望動機) সুস্পষ্টভাবে প্রেজেন্ট করা।",
          "পিতা-মাতার ব্যাংক স্পনসর ও আয়ের উৎস সম্পর্কিত ক্রস-কোশ্চেন ফেস করার টেকনিক।",
          "ক্যামেরার সামনে বা ফেস-টু-ফেস এম্বাসি স্টাইল লাইভ মক ইন্টারভিউ ও পার্সোনাল ফিডব্যাক।",
        ],
        bonus2Badge: "বোনাস ০২",
        bonus2Duration: "১০ দিন প্র্যাকটিক্যাল কোর্স",
        bonus2Val: "৳৪,৫০০",
        bonus2Title: "জাপানিজ রিজিউমি / সিভি (Rirekisho) রাইটিং কোর্স",
        bonus2Sub: "জাপানের JIS স্ট্যান্ডার্ড ফরম্যাটে নির্ভুল সিভি ও কভার লেটার ড্রাফটিং",
        bonus2Points: [
          "জাপানের অফিশিয়াল 履歴書 (Rirekisho) ও 職務経歴書 লেখার নিয়মাবলি।",
          "নিজের শক্তি ও আত্মপরিচয় (Jiko PR / 自己PR) আকর্ষণীয়ভাবে তুলে ধরার উপায়।",
          "সিভিতে সঠিক ছবির সাইজ, কোট-টাই ড্রেসকোড এবং তারিখ লেখার জাপানি বর্ষ গণনা (Reiwa)।",
          "কোর্সের অংশ হিসেবে নিজের সিভিটি জাপানি ভাষায় প্রস্তুত ও ফাইনাল অডিট করিয়ে নেওয়া।",
        ],
        bonus3Badge: "বোনাস ০৩",
        bonus3Duration: "১০ দিন জব ট্রেনিং",
        bonus3Val: "৳৪,৫০০",
        bonus3Title: "পার্ট-টাইম জব (Baitō) ইন্টারভিউ ও ওয়ার্কপ্লেস ট্রেনিং",
        bonus3Sub: "জাপানে পা রেখেই কনভিনিয়েন্স স্টোর ও রেস্তোরাঁয় কাজ নিশ্চিত করার কৌশল",
        bonus3Points: [
          "সেভেন-ইলেভেন, লসন, ফ্যামিলি মার্ট ও রেস্তোরাঁয় কাজের জন্য প্রয়োজনীয় প্র্যাকটিক্যাল ভাষা।",
          "গ্রাহক সেবার শিষ্টাচার (Irasshaimase, Arigatou Gozaimasu, Omatase Itashimashita)।",
          "পার্ট-টাইম জব ইন্টারভিউতে ফোন কল করা এবং সময় শিডিউল ফিক্স করার কথোপকথন।",
          "সপ্তাহে ২৮ ঘণ্টার কাজের নিয়ম, ট্যাক্স ও কাজের জায়গায় মানিয়ে চলার বাস্তবমুখী টিপস।",
        ],
        freeBadge: "FREE",
        handoutLabel: "সার্টিফিকেট ও হ্যান্ডআউট:",
        includedLabel: "ইনক্লুডেড",
      },
      ja: {
        bannerTag: "N5受講者限定・無料特典パッケージ",
        bannerTitle1: "総額15,000タカ相当の専門対策3講座が",
        bannerHighlight: "完全無料！",
        bannerDesc:
          "語学学習にとどまらず、大使館のビザ面接突破や現地到着後のアルバイト採用までを確実に支援する特別カリキュラム。",
        btnEnroll: "無料特典つきで今すぐ申し込む",
        limitedNotice: "今期募集の先着50名様限定で適用",
        bonus1Badge: "特典 01",
        bonus1Duration: "15日間 集中講座",
        bonus1Val: "৳6,000",
        bonus1Title: "日本大使館ビザ面接完全攻略コース",
        bonus1Sub: "不交付への不安を解消し、一発合格を勝ち取る実践面接メソッド",
        bonus1Points: [
          "査証官から頻出される30問以上の想定質問と模範回答作成。",
          "日本留学の志望動機（志望動機書）の論理的かつ説得力ある説明法。",
          "経費支弁者（両親の銀行残高・年収証明等）に関する質問への的確な対応。",
          "模擬面接シミュレーションと専任指導員による個別改善フィードバック。",
        ],
        bonus2Badge: "特典 02",
        bonus2Duration: "10日間 実践講座",
        bonus2Val: "৳4,500",
        bonus2Title: "日本式履歴書・職務経歴書作成コース",
        bonus2Sub: "JIS規格に準拠した日本標準の履歴書作成をマンツーマン指導",
        bonus2Points: [
          "日本の公式な履歴書および職務経歴書の正確な書き方ルール。",
          "自己PR・志望理由を日本の採用担当者に響く日本語で表現。",
          "証明写真の服装マナー・年号（令和表記）のルールをマスター。",
          "完成した履歴書の日本人スタッフによる最終添削・チェック。",
        ],
        bonus3Badge: "特典 03",
        bonus3Duration: "10日間 採用対策",
        bonus3Val: "৳4,500",
        bonus3Title: "アルバイト面接・職場コミュニケーション特訓",
        bonus3Sub: "コンビニや飲食店での採用を現地渡航直後に獲得するための実践力",
        bonus3Points: [
          "セブン-イレブン、ローソン、飲食店で必須となる接客日本語。",
          "接客マナー用語（いらっしゃいませ、ありがとうございます、お待たせいたしました）。",
          "アルバイト応募の電話対応および面接日時設定の会話演習。",
          "週28時間就労ルール、税金、シフト管理などの現地就労知識。",
        ],
        freeBadge: "無料",
        handoutLabel: "修了証・オリジナル資料:",
        includedLabel: "無料付帯",
      },
    },
    language,
  );

  const bonuses = [
    {
      badge: t.bonus1Badge,
      duration: t.bonus1Duration,
      value: t.bonus1Val,
      title: t.bonus1Title,
      subtitle: t.bonus1Sub,
      icon: GraduationCap,
      color: "text-[#b91c1c]",
      border: "border-red-200",
      bg: "bg-red-50/40",
      points: t.bonus1Points,
    },
    {
      badge: t.bonus2Badge,
      duration: t.bonus2Duration,
      value: t.bonus2Val,
      title: t.bonus2Title,
      subtitle: t.bonus2Sub,
      icon: FileSpreadsheet,
      color: "text-[#15803d]",
      border: "border-green-200",
      bg: "bg-green-50/40",
      points: t.bonus2Points,
    },
    {
      badge: t.bonus3Badge,
      duration: t.bonus3Duration,
      value: t.bonus3Val,
      title: t.bonus3Title,
      subtitle: t.bonus3Sub,
      icon: Briefcase,
      color: "text-amber-700",
      border: "border-amber-200",
      bg: "bg-amber-50/40",
      points: t.bonus3Points,
    },
  ];

  const scrollToForm = () => {
    const el = document.getElementById("enrollment-form");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="bg-white py-16 md:py-24 border-b border-stone-200 relative overflow-hidden">
      <div className="container-narrow">
        {/* Banner Announcement */}
        <div className="rounded-3xl bg-gradient-to-r from-red-900 via-[#b91c1c] to-red-800 p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="pointer-events-none absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-white/10 blur-2xl" />

          <div className="relative max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
              <Gift className="h-4 w-4 text-amber-300" />
              <span>{t.bannerTag}</span>
            </div>

            <h2 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight">
              {t.bannerTitle1}
              <span className="text-amber-300 underline decoration-amber-400">{t.bannerHighlight}</span>
            </h2>

            <p className="mt-3 text-sm sm:text-base text-red-100 leading-relaxed max-w-2xl">
              {t.bannerDesc}
            </p>

            <div className="mt-6 flex flex-wrap gap-4 items-center">
              <Button
                onClick={scrollToForm}
                className="bg-white text-[#b91c1c] hover:bg-stone-100 font-bold px-6 py-5 rounded-xl shadow transition"
              >
                {t.btnEnroll}
              </Button>
              <span className="text-xs text-red-200 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-amber-300" />
                {t.limitedNotice}
              </span>
            </div>
          </div>
        </div>

        {/* 3 Bonus Cards */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {bonuses.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={idx}
                className={`flex flex-col justify-between rounded-3xl border ${b.border} ${b.bg} p-6 sm:p-7 shadow-xs transition hover:shadow-md hover:-translate-y-1`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-800 shadow-xs border border-stone-200">
                      {b.badge} • {b.duration}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-slate-400 line-through">{b.value}</span>
                      <span className="text-xs font-extrabold text-[#15803d] bg-green-100 px-2 py-0.5 rounded-full">
                        {t.freeBadge}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center gap-3">
                    <div className={`p-3 rounded-2xl bg-white shadow-xs ${b.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 leading-snug">{b.title}</h3>
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-slate-600 leading-relaxed font-medium">
                    {b.subtitle}
                  </p>

                  <div className="mt-5 space-y-2 border-t border-stone-200/60 pt-4">
                    {b.points.map((pt, pi) => (
                      <div key={pi} className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#15803d] mt-0.5" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-200/60">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>{t.handoutLabel}</span>
                    <span className="font-bold text-slate-900">{t.includedLabel}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
