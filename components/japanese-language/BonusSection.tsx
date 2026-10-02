"use client";

import {
  Briefcase,
  CheckCircle2,
  FileSpreadsheet,
  Gift,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";

export default function BonusSection() {
  const { language } = useLanguage();

  const t = translate(
    {
      en: {
        kicker: "Free Bonus Package Included with N5 Course",
        title: "3 Specialized Courses Worth ৳15,000 — 100% Free",
        subtitle:
          "Language certification alone is not enough to succeed in Japan. These 3 exclusive KNLTC preparatory courses guarantee you pass your Embassy interview and secure employment smoothly.",
        btnEnroll: "Enroll Now with Free Bonuses",
        bonus1Badge: "BONUS 01",
        bonus1Duration: "15-Day Intensive",
        bonus1Val: "৳6,000 Value",
        bonus1Title: "Japanese Embassy Visa Interview Preparation",
        bonus1Sub: "Overcome visa officer questioning and pass on your first attempt",
        bonus1Points: [
          "Model answers for the 30+ most frequent Japanese visa officer questions.",
          "Clear presentation of your study motivation in Japan (Shibou Douki).",
          "Handling parental financial sponsorship and bank balance inquiries.",
          "Live camera mock interview simulations with personalized feedback.",
        ],
        bonus2Badge: "BONUS 02",
        bonus2Duration: "10-Day Practical",
        bonus2Val: "৳4,500 Value",
        bonus2Title: "Japanese Resume / CV (Rirekisho) Writing Course",
        bonus2Sub: "Drafting flawless resumes adhering strictly to Japan's JIS official standards",
        bonus2Points: [
          "Rules and phrasing for Japan's official 履歴書 (Rirekisho) standards.",
          "Highlighting personal strengths and self-promotion (Jiko PR) effectively.",
          "Photo etiquette, business suit dress code, and Japanese Reiwa year notation.",
          "Individual drafting and instructor audit of your completed Japanese CV.",
        ],
        bonus3Badge: "BONUS 03",
        bonus3Duration: "10-Day Job Training",
        bonus3Val: "৳4,500 Value",
        bonus3Title: "Part-Time Job (Baitō) Interview & Workplace Training",
        bonus3Sub: "Secure convenience store and restaurant jobs immediately after arriving",
        bonus3Points: [
          "Essential conversational phrases for 7-Eleven, Lawson, and restaurant jobs.",
          "Customer service etiquette (Irasshaimase, Arigatou Gozaimasu, Omatase Itashimashita).",
          "Conducting job phone calls and scheduling interview appointments in Japanese.",
          "Rules of 28 hours/week student work permits and workplace harmony.",
        ],
      },
      bn: {
        kicker: "N5 কোর্সে ভর্তিতে এক্সক্লুসিভ ফ্রি বোনাস",
        title: "১৫,০০০ টাকা মূল্যের ৩টি স্পেশাল কোর্স সম্পূর্ণ বিনামূল্যে",
        subtitle:
          "অনেকেই ভাষা শিখলেও এম্বাসি ইন্টারভিউতে আটকে যান কিংবা পার্ট-টাইম কাজের ইন্টারভিউ দিতে হিমশিম খান। KNLTC-এর এই স্পেশাল বোনাস কোর্সগুলো আপনাকে শুরু থেকেই প্রস্তুত রাখবে।",
        btnEnroll: "বোনাসসহ এখনই ভর্তি হন",
        bonus1Badge: "বোনাস ০১",
        bonus1Duration: "১৫ দিন নিবিড় কোর্স",
        bonus1Val: "মূল্য: ৳৬,০০০",
        bonus1Title: "জাপানিজ এম্বাসি ইন্টারভিউ প্রিপারেশন কোর্স",
        bonus1Sub: "ভিসা অফিসারের মুখোমুখি হওয়ার সঠিক টেকনিক ও শতভাগ প্রস্তুতি",
        bonus1Points: [
          "এম্বাসির জাপানি ভিসা অফিসারের সর্বাধিক জিজ্ঞাসিত ৩০+ প্রশ্নের মডেল উত্তর।",
          "জাপানে পড়ার আসল উদ্দেশ্য (Shibou Douki / 志望動機) সুস্পষ্টভাবে উপস্থাপন।",
          "পিতা-মাতার ব্যাংক স্পনসর ও আয়ের উৎস সম্পর্কিত ক্রস-কোশ্চেন ফেস করা।",
          "ক্যামেরার সামনে বা ফেস-টু-ফেস এম্বাসি স্টাইল লাইভ মক ইন্টারভিউ ও ফিডব্যাক।",
        ],
        bonus2Badge: "বোনাস ০২",
        bonus2Duration: "১০ দিন প্র্যাকটিক্যাল",
        bonus2Val: "মূল্য: ৳৪,৫০০",
        bonus2Title: "জাপানিজ রিজিউমি / সিভি (Rirekisho) রাইটিং কোর্স",
        bonus2Sub: "জাপানের JIS স্ট্যান্ডার্ড ফরম্যাটে নির্ভুল সিভি ও কভার লেটার প্রস্তুত",
        bonus2Points: [
          "জাপানের অফিশিয়াল 履歴書 (Rirekisho) ও 職務経歴書 লেখার নিয়মাবলি।",
          "নিজের শক্তি ও আত্মপরিচয় (Jiko PR / 自己PR) আকর্ষণীয়ভাবে তুলে ধরার উপায়।",
          "সিভিতে সঠিক ছবির সাইজ, কোট-টাই ড্রেসকোড এবং জাপানি বর্ষ গণনা (Reiwa)।",
          "কোর্সের অংশ হিসেবে নিজের সিভিটি জাপানি ভাষায় প্রস্তুত ও ফাইনাল অডিট।",
        ],
        bonus3Badge: "বোনাস ০৩",
        bonus3Duration: "১০ দিন জব ট্রেনিং",
        bonus3Val: "মূল্য: ৳৪,৫০০",
        bonus3Title: "পার্ট-টাইম জব (Baitō) ইন্টারভিউ ও ওয়ার্কপ্লেস ট্রেনিং",
        bonus3Sub: "জাপানে পা রেখেই কনভিনিয়েন্স স্টোর ও রেস্তোরাঁয় কাজ পাওয়ার কৌশল",
        bonus3Points: [
          "সেভেন-ইলেভেন, লসন, ফ্যামিলি মার্ট ও রেস্তোরাঁয় কাজের প্র্যাকটিক্যাল ভাষা।",
          "গ্রাহক সেবার শিষ্টাচার (Irasshaimase, Arigatou Gozaimasu, Omatase Itashimashita)।",
          "পার্ট-টাইম জব ইন্টারভিউতে ফোন কল করা এবং সময় শিডিউল ফিক্স করা।",
          "সপ্তাহে ২৮ ঘণ্টার কাজের নিয়ম, ট্যাক্স ও কাজের জায়গায় মানিয়ে চলার বাস্তবমুখী টিপস।",
        ],
      },
      ja: {
        kicker: "N5受講生限定・特別無料特典",
        title: "総額15,000タカ相当の専門対策3講座が完全無料",
        subtitle:
          "語学学習にとどまらず、大使館のビザ面接突破や現地到着後のアルバイト採用までを確実に支援する特別カリキュラム。",
        btnEnroll: "無料特典つきで申し込む",
        bonus1Badge: "特典 01",
        bonus1Duration: "15日間 集中講座",
        bonus1Val: "৳6,000相当",
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
        bonus2Val: "৳4,500相当",
        bonus2Title: "日本式履歴書・職務経歴書作成コース",
        bonus2Sub: "JIS規格に準拠した日本標準の履歴書作成を個別指導",
        bonus2Points: [
          "日本の公式な履歴書および職務経歴書の正確な書き方ルール。",
          "自己PR・志望理由を日本の採用担当者に響く日本語で表現。",
          "証明写真の服装マナー・年号（令和表記）のルールをマスター。",
          "完成した履歴書の日本人スタッフによる最終添削・チェック。",
        ],
        bonus3Badge: "特典 03",
        bonus3Duration: "10日間 採用対策",
        bonus3Val: "৳4,500相当",
        bonus3Title: "アルバイト面接・職場コミュニケーション特訓",
        bonus3Sub: "コンビニや飲食店での採用を現地渡航直後に獲得するための実践力",
        bonus3Points: [
          "セブン-イレブン、ローソン、飲食店で必須となる接客日本語。",
          "接客マナー用語（いらっしゃいませ、ありがとうございます、お待たせいたしました）。",
          "アルバイト応募の電話対応および面接日時設定の会話演習。",
          "週28時間就労ルール、税金、シフト管理などの現地就労知識。",
        ],
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
      points: t.bonus1Points,
    },
    {
      badge: t.bonus2Badge,
      duration: t.bonus2Duration,
      value: t.bonus2Val,
      title: t.bonus2Title,
      subtitle: t.bonus2Sub,
      icon: FileSpreadsheet,
      points: t.bonus2Points,
    },
    {
      badge: t.bonus3Badge,
      duration: t.bonus3Duration,
      value: t.bonus3Val,
      title: t.bonus3Title,
      subtitle: t.bonus3Sub,
      icon: Briefcase,
      points: t.bonus3Points,
    },
  ];

  const scrollToForm = () => {
    const el = document.getElementById("enrollment-form");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-16 md:py-24 bg-white border-b border-stone-200">
      <div className="container-narrow">
        {/* Clean Editorial Header */}
        <div className="max-w-2xl mx-auto text-center mb-12 sm:mb-16">
          <p className="text-xs font-bold uppercase tracking-widest text-[#15803d]">
            {t.kicker}
          </p>
          <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
            {t.title}
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* 3 Executive Bonus Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {bonuses.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={idx}
                className="flex flex-col justify-between rounded-2xl border border-stone-200 bg-[#fcfaf7] p-6 sm:p-7 shadow-xs hover:border-stone-300 transition"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-700">
                      {b.badge} • {b.duration}
                    </span>
                    <span className="text-[11px] font-semibold text-[#15803d] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      FREE ({b.value})
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-stone-200 text-slate-900 shadow-xs">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {b.title}
                    </h3>
                  </div>

                  <p className="mt-2.5 text-xs text-slate-600 leading-relaxed font-normal">
                    {b.subtitle}
                  </p>

                  <div className="mt-5 space-y-2.5 border-t border-stone-200/60 pt-4">
                    {b.points.map((pt, pi) => (
                      <div
                        key={pi}
                        className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#15803d] mt-0.5 stroke-[2.5]" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-200/60">
                  <Button
                    onClick={scrollToForm}
                    variant="outline"
                    size="sm"
                    className="w-full border-stone-300 hover:bg-white text-slate-800 text-xs font-semibold rounded-xl"
                  >
                    {t.btnEnroll}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
