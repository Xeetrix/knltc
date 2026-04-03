"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/layout/LanguageProvider";

const AudienceSection = () => {
  const { language } = useLanguage();
  const content = {
    en: {
      title: "How Can We Help You?",
      desc: "Whether you want to work, study, or learn Japanese — KNLTC has a clear path for you.",
      cards: [
        { icon: Briefcase, title: "For Job Seekers", description: "Prepare for opportunities in Japan with practical training and clear guidance.", cta: "Explore Jobs", href: "/work-in-japan" },
        { icon: GraduationCap, title: "For Students", description: "Get support for admissions, language preparation, and your study plan in Japan.", cta: "Study in Japan", href: "/study-in-japan" },
        { icon: Languages, title: "Learn Japanese", description: "Build confidence in Japanese from beginner to advanced levels with structured courses.", cta: "Start Learning", href: "/japanese-language" },
      ],
    },
    bn: {
      title: "আমরা কীভাবে সাহায্য করতে পারি?",
      desc: "আপনি কাজ, পড়াশোনা বা জাপানি ভাষা শিখতে চাইলে — KNLTC আপনার জন্য পরিষ্কার পথ দেখাবে।",
      cards: [
        { icon: Briefcase, title: "চাকরি প্রার্থীদের জন্য", description: "প্র্যাকটিক্যাল ট্রেনিং ও পরিষ্কার গাইডেন্সে জাপানের সুযোগের জন্য প্রস্তুতি নিন।", cta: "চাকরি দেখুন", href: "/work-in-japan" },
        { icon: GraduationCap, title: "শিক্ষার্থীদের জন্য", description: "অ্যাডমিশন, ভাষা প্রস্তুতি ও জাপানে স্টাডি প্ল্যানের সাপোর্ট নিন।", cta: "জাপানে পড়াশোনা", href: "/study-in-japan" },
        { icon: Languages, title: "জাপানি শিখুন", description: "শুরু থেকে অ্যাডভান্সড পর্যন্ত কাঠামোবদ্ধ কোর্সে আত্মবিশ্বাস গড়ুন।", cta: "শুরু করুন", href: "/japanese-language" },
      ],
    },
    ja: {
      title: "どんなサポートが必要ですか？",
      desc: "就職・留学・日本語学習まで、KNLTCが最適な道をご案内します。",
      cards: [
        { icon: Briefcase, title: "求職者向け", description: "実践的なトレーニングと明確な案内で日本就職を準備。", cta: "求人を見る", href: "/work-in-japan" },
        { icon: GraduationCap, title: "学生向け", description: "入学準備、語学、留学計画をサポート。", cta: "日本留学", href: "/study-in-japan" },
        { icon: Languages, title: "日本語学習", description: "初級から上級まで体系的コースで学習。", cta: "学習開始", href: "/japanese-language" },
      ],
    },
  }[language];

  return (
    <section className="section-padding bg-surface">
      <div className="container-narrow">
        <div className="mb-10 text-center sm:mb-14">
          <h2 className="mb-4 text-2xl font-extrabold text-foreground sm:text-3xl md:text-4xl">{content.title}</h2>
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base">{content.desc}</p>
        </div>

        <div className="grid gap-5 md:grid-cols-3 md:gap-6">
          {content.cards.map((seg, i) => (
            <motion.div
              key={seg.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="rounded-lg border bg-card p-5 shadow-sm transition-shadow hover:shadow-md sm:p-7"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 sm:mb-5 sm:h-14 sm:w-14">
                <seg.icon className="h-6 w-6 text-primary sm:h-7 sm:w-7" />
              </div>
              <h3 className="mb-3 text-lg font-bold text-foreground sm:text-xl">{seg.title}</h3>
              <p className="mb-5 text-sm leading-relaxed text-muted-foreground sm:text-base">{seg.description}</p>
              <Button asChild variant="outline" size="sm" className="w-full font-semibold sm:w-auto">
                <Link href={seg.href}>{seg.cta}</Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AudienceSection;
