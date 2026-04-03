"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";

const ProcessSection = () => {
  const { language } = useLanguage();

  const t = translate(
    {
      en: {
        title: "Your 5-Step Journey to Japan",
        desc: "A simple, transparent process from start to finish.",
        steps: [
          { num: "1", title: "Consultation", desc: "Free consultation to understand your goals and eligibility." },
          { num: "2", title: "Eligibility Check", desc: "We assess your profile and recommend the best path." },
          { num: "3", title: "Training & Prep", desc: "Language training, interview prep, and skill building." },
          { num: "4", title: "Application & Visa", desc: "We handle documents, applications, and visa processing." },
          { num: "5", title: "Pre-Departure & Arrival", desc: "Final briefing, travel support, and Japan settlement." },
        ],
      },
      bn: {
        title: "জাপান যাওয়ার ৫ ধাপের যাত্রা",
        desc: "শুরু থেকে শেষ পর্যন্ত সহজ ও স্বচ্ছ একটি প্রক্রিয়া।",
        steps: [
          { num: "1", title: "প্রাথমিক পরামর্শ", desc: "আপনার লক্ষ্য ও যোগ্যতা বুঝতে ফ্রি কনসালটেশন।" },
          { num: "2", title: "যোগ্যতা যাচাই", desc: "আপনার প্রোফাইল দেখে সেরা পথ নির্ধারণ করি।" },
          { num: "3", title: "ট্রেনিং ও প্রস্তুতি", desc: "ভাষা শিক্ষা, ইন্টারভিউ প্রস্তুতি ও স্কিল ডেভেলপমেন্ট।" },
          { num: "4", title: "আবেদন ও ভিসা", desc: "ডকুমেন্টেশন, আবেদন ও ভিসা প্রক্রিয়ায় সহায়তা করি।" },
          { num: "5", title: "যাত্রা ও পৌঁছানো", desc: "ফাইনাল ব্রিফিং, ভ্রমণ সহায়তা ও জাপানে সেটেলমেন্ট।" },
        ],
      },
      ja: {
        title: "日本への5ステップ",
        desc: "最初から最後まで、シンプルで明確な流れです。",
        steps: [
          { num: "1", title: "相談", desc: "目標と適性を確認する無料相談を行います。" },
          { num: "2", title: "適性確認", desc: "プロフィールを評価し、最適な進路を提案します。" },
          { num: "3", title: "研修・準備", desc: "語学学習、面接対策、スキル強化を進めます。" },
          { num: "4", title: "応募・ビザ", desc: "書類準備、応募、ビザ手続きをサポートします。" },
          { num: "5", title: "渡航・到着", desc: "最終案内、渡航支援、来日後の定着支援を行います。" },
        ],
      },
    },
    language,
  );

  return (
    <section className="section-padding">
      <div className="container-narrow">
        <div className="mb-14 text-center">
          <h2 className="mb-4 text-3xl font-extrabold text-foreground md:text-4xl">{t.title}</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">{t.desc}</p>
        </div>

        <div className="relative">
          <div className="absolute left-[10%] right-[10%] top-10 hidden h-0.5 bg-border lg:block" />

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
            {t.steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className="relative text-center"
              >
                <div className="relative z-10 mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-extrabold text-primary-foreground shadow-lg">
                  {step.num}
                </div>
                <h3 className="mb-1 font-bold text-foreground">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
