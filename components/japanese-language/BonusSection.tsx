"use client";

import { motion } from "motion/react";
import {
  Briefcase,
  CheckCircle2,
  FileSpreadsheet,
  GraduationCap,
} from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";

export default function BonusSection() {
  const { language } = useLanguage();

  const t = translate(
    {
      en: {
        kicker: "Free Career Inclusions",
        title: "3 Specialized Courses Worth ৳15,000 — 100% Free",
        subtitle:
          "Language certification alone is not enough to succeed in Japan. These 3 exclusive KNLTC preparatory courses guarantee you pass your Embassy interview and secure employment smoothly.",
        bonus1Badge: "Bonus 01 • 15 Days",
        bonus1Val: "৳6,000 Value",
        bonus1Title: "Japanese Embassy Visa Interview Preparation",
        bonus1Sub: "Pass your visa interview with confidence and eliminate non-issuance risks.",
        bonus1Points: [
          "Model answers for 30+ frequent visa officer questions",
          "Clarifying study motivation in Japan (Shibou Douki)",
          "Camera mock interview simulations with personalized feedback",
        ],
        bonus2Badge: "Bonus 02 • 10 Days",
        bonus2Val: "৳4,500 Value",
        bonus2Title: "Japanese Resume / CV (Rirekisho) Writing Course",
        bonus2Sub: "Drafting flawless resumes adhering strictly to Japan's JIS official standards.",
        bonus2Points: [
          "Rules and phrasing for Japan's official 履歴書 standards",
          "Highlighting personal strengths and self-promotion (Jiko PR)",
          "Individual drafting and instructor audit of your completed CV",
        ],
        bonus3Badge: "Bonus 03 • 10 Days",
        bonus3Val: "৳4,500 Value",
        bonus3Title: "Part-Time Job (Baitō) Interview & Workplace Training",
        bonus3Sub: "Secure convenience store and restaurant jobs immediately after arriving.",
        bonus3Points: [
          "Practical conversational phrases for convenience store & restaurant jobs",
          "Workplace etiquette, customer greetings & phone scheduling",
          "28 hours/week work permit rules, taxes and living guidance",
        ],
      },
      bn: {
        kicker: "এক্সক্লুসিভ ফ্রি ক্যারিয়ার ইনক্লুশন",
        title: "১৫,০০০ টাকা মূল্যের ৩টি স্পেশাল কোর্স সম্পূর্ণ বিনামূল্যে",
        subtitle:
          "শুধুমাত্র ভাষা জানলেই হবে না—এম্বাসি ইন্টারভিউ পাস করা এবং জাপানে পৌঁছানোর পরই পার্ট-টাইম কাজ নিশ্চিত করতে KNLTC দিচ্ছে ৩টি স্পেশাল ক্যারিয়ার কোর্স সম্পূর্ণ ফ্রি।",
        bonus1Badge: "বোনাস ০১ • ১৫ দিন",
        bonus1Val: "মূল্য: ৳৬,০০০",
        bonus1Title: "জাপানিজ এম্বাসি ইন্টারভিউ প্রিপারেশন কোর্স",
        bonus1Sub: "ভিসা অফিসারের মুখোমুখি হওয়ার সঠিক টেকনিক ও শতভাগ প্রস্তুতি নিশ্চিতকরণ।",
        bonus1Points: [
          "এম্বাসির ভিসা অফিসারের সর্বাধিক জিজ্ঞাসিত ৩০+ প্রশ্নের মডেল উত্তর",
          "জাপানে পড়ার আসল উদ্দেশ্য (Shibou Douki) স্পষ্ট ও যৌক্তিকভাবে উপস্থাপন",
          "ক্যামেরার সামনে বা ফেস-টু-ফেস লাইভ মক ইন্টারভিউ ও পার্সোনালাইজড ফিডব্যাক",
        ],
        bonus2Badge: "বোনাস ০২ • ১০ দিন",
        bonus2Val: "মূল্য: ৳৪,৫০০",
        bonus2Title: "জাপানিজ রিজিউমি / সিভি (Rirekisho) রাইটিং কোর্স",
        bonus2Sub: "জাপানের JIS স্ট্যান্ডার্ড ফরম্যাটে নির্ভুল সিভি ও কভার লেটার প্রস্তুতকরণ।",
        bonus2Points: [
          "জাপানের অফিশিয়াল 履歴書 (Rirekisho) স্ট্যান্ডার্ডে নির্ভুল সিভি লেখার নিয়ম",
          "নিজের শক্তি ও আত্মপরিচয় (Jiko PR) আকর্ষণীয়ভাবে তুলে ধরার কলাকৌশল",
          "কোর্সের অংশ হিসেবে নিজের ফাইনাল জাপানি সিভি প্রস্তুত ও সিনিয়র অডিট",
        ],
        bonus3Badge: "বোনাস ০৩ • ১০ দিন",
        bonus3Val: "মূল্য: ৳৪,৫০০",
        bonus3Title: "পার্ট-টাইম জব (Baitō) ইন্টারভিউ ও কর্মক্ষেত্র প্রশিক্ষণ",
        bonus3Sub: "জাপানে পা রেখেই কনভিনিয়েন্স স্টোর ও রেস্তোরাঁয় কাজ পাওয়ার প্রস্তুতি।",
        bonus3Points: [
          "সেভেন-ইলেভেন, লসন ও রেস্তোরাঁয় কাজের প্র্যাকটিক্যাল কথ্য ভাষা",
          "কাস্টমার সার্ভিসের শিষ্টাচার ও জাপানি ভাষায় ইন্টারভিউ কল হ্যান্ডলিং",
          "সপ্তাহে ২৮ ঘণ্টার কাজের নিয়ম, ট্যাক্স ও জাপানি কর্মসংস্কৃতির গাইডলাইন",
        ],
      },
      ja: {
        kicker: "特別無料特典",
        title: "総額15,000タカ相当の専門3講座が完全無料",
        subtitle:
          "語学学習にとどまらず、大使館のビザ面接突破や現地到着後のアルバイト採用までを確実に支援する特別カリキュラム。",
        bonus1Badge: "特典 01 • 15日間",
        bonus1Val: "৳6,000相当",
        bonus1Title: "日本大使館ビザ面接完全攻略コース",
        bonus1Sub: "不交付への不安を解消し、一発合格を勝ち取る実践面接メソッド。",
        bonus1Points: [
          "査証官から頻出される30問以上の想定質問と模範回答作成",
          "志望動機（志望動機書）の論理的かつ説得力ある説明法",
          "模擬面接シミュレーションと個別改善フィードバック",
        ],
        bonus2Badge: "特典 02 • 10日間",
        bonus2Val: "৳4,500相当",
        bonus2Title: "日本式履歴書・職務経歴書作成コース",
        bonus2Sub: "JIS規格に準拠した日本標準の履歴書作成を個別指導。",
        bonus2Points: [
          "日本の公式な履歴書の正確な書き方ルール",
          "自己PR・志望理由を日本の採用担当者に響く日本語で表現",
          "完成した履歴書の日本人スタッフによる最終添削・チェック",
        ],
        bonus3Badge: "特典 03 • 10日間",
        bonus3Val: "৳4,500相当",
        bonus3Title: "アルバイト面接・職場コミュニケーション特訓",
        bonus3Sub: "コンビニや飲食店での採用を現地渡航直後に獲得するための実践力。",
        bonus3Points: [
          "コンビニ・飲食店で必須となる接客日本語",
          "接客マナー用語および面接日時設定の会話演習",
          "週28時間就労ルール、税金、シフト管理などの現地就労知識",
        ],
      },
    },
    language,
  );

  const bonuses = [
    {
      badge: t.bonus1Badge,
      value: t.bonus1Val,
      title: t.bonus1Title,
      subtitle: t.bonus1Sub,
      icon: GraduationCap,
      points: t.bonus1Points,
    },
    {
      badge: t.bonus2Badge,
      value: t.bonus2Val,
      title: t.bonus2Title,
      subtitle: t.bonus2Sub,
      icon: FileSpreadsheet,
      points: t.bonus2Points,
    },
    {
      badge: t.bonus3Badge,
      value: t.bonus3Val,
      title: t.bonus3Title,
      subtitle: t.bonus3Sub,
      icon: Briefcase,
      points: t.bonus3Points,
    },
  ];

  return (
    <section className="py-16 md:py-20 bg-[#fcfaf7] border-b border-stone-200">
      <div className="container-narrow">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-10 sm:mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-[#15803d]">
            {t.kicker}
          </p>
          <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
            {t.title}
          </h2>
          <p className="mt-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* 3 Streamlined Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {bonuses.map((b, idx) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -4, transition: { duration: 0.18 } }}
                className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-7 shadow-xs hover:border-stone-300 hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                    <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-700">
                      {b.badge}
                    </span>
                    <span className="text-[11px] font-semibold text-[#15803d] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      FREE ({b.value})
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-50 border border-stone-200 text-[#15803d] shadow-2xs">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                      {b.title}
                    </h3>
                  </div>

                  <p className="mt-2 text-xs text-slate-600 leading-relaxed font-normal">
                    {b.subtitle}
                  </p>

                  <div className="mt-4 pt-3 border-t border-stone-100 space-y-2">
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
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
