"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { GraduationCap, Briefcase, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/layout/LanguageProvider";

const StudyWorkSection = () => {
  const { language } = useLanguage();
  const blocks = {
    en: [
      {
        icon: GraduationCap,
        title: "Study in Japan",
        desc: "Get step-by-step help with admissions planning, documentation, and student visa preparation.",
        cta: "Learn More",
        href: "/study-in-japan",
      },
      {
        icon: Briefcase,
        title: "Work in Japan",
        desc: "Prepare for Japan-focused careers with language practice, interview readiness, and application support.",
        cta: "Apply Now",
        href: "/work-in-japan",
      },
    ],
    bn: [
      { icon: GraduationCap, title: "জাপানে পড়াশোনা", desc: "অ্যাডমিশন পরিকল্পনা, ডকুমেন্টেশন ও স্টুডেন্ট ভিসায় ধাপে ধাপে সহায়তা।", cta: "বিস্তারিত", href: "/study-in-japan" },
      { icon: Briefcase, title: "জাপানে কাজ", desc: "ভাষা অনুশীলন, ইন্টারভিউ প্রস্তুতি ও আবেদন সহায়তায় ক্যারিয়ার প্রস্তুতি।", cta: "এখনই আবেদন", href: "/work-in-japan" },
    ],
    ja: [
      { icon: GraduationCap, title: "日本留学", desc: "入学計画、書類、学生ビザ準備を段階的にサポート。", cta: "詳細を見る", href: "/study-in-japan" },
      { icon: Briefcase, title: "日本就職", desc: "語学、面接、応募支援で日本就職を準備。", cta: "今すぐ応募", href: "/work-in-japan" },
    ],
  }[language];

  return (
    <section id="study-work" className="section-padding bg-surface">
      <div className="container-narrow">
        <div className="grid gap-6 md:grid-cols-2 md:gap-8">
          {blocks.map((block, i) => (
            <motion.div
              key={block.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="rounded-lg border bg-card p-5 transition-shadow hover:shadow-md sm:p-8 md:p-10"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 sm:mb-6 sm:h-14 sm:w-14">
                <block.icon className="h-6 w-6 text-primary sm:h-7 sm:w-7" />
              </div>
              <h3 className="mb-3 text-xl font-extrabold text-foreground sm:text-2xl">{block.title}</h3>
              <p className="mb-6 text-sm leading-relaxed text-muted-foreground sm:text-base">{block.desc}</p>
              <Button asChild className="w-full bg-primary font-semibold text-primary-foreground hover:bg-primary/90 sm:w-auto">
                <Link href={block.href}>
                  {block.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StudyWorkSection;
