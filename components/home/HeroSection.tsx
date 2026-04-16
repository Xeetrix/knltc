"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";
import { trackApplyNowClick, trackWhatsAppClick } from "@/lib/meta-pixel";

const HeroSection = () => {
  const { language } = useLanguage();
  const t = translate(
    {
      en: {
        badge: "🇯🇵 Trusted Japan Guidance Agency",
        title: "Right preparation for study and career in Japan",
        desc: "Japanese language training, student visa guidance, and job pathway support for Bangladeshi students & job seekers.",
        apply: "Free Consultation",
        whatsapp: "WhatsApp Now",
        highlights: ["✓ Student & job pathway support", "✓ Documentation assistance", "✓ End-to-end guidance"],
      },
      bn: {
        badge: "🇯🇵 বিশ্বস্ত জাপান গাইডেন্স এজেন্সি",
        title: "জাপানে পড়াশোনা ও ক্যারিয়ারের সঠিক প্রস্তুতি",
        desc: "বাংলাদেশি শিক্ষার্থী ও চাকরি প্রার্থীদের জন্য জাপানি ভাষা প্রশিক্ষণ, স্টুডেন্ট ভিসা গাইডেন্স এবং জব পাথওয়ের সহায়তা।",
        apply: "Free Consultation",
        whatsapp: "WhatsApp Now",
        highlights: ["✓ স্টুডেন্ট ও জব পাথওয়ে সাপোর্ট", "✓ ডকুমেন্টেশন সহায়তা", "✓ শুরু থেকে শেষ পর্যন্ত গাইডলাইন"],
      },
      ja: {
        badge: "🇯🇵 信頼できる日本進学・就職ガイダンス",
        title: "日本での留学とキャリアに向けた最適な準備",
        desc: "バングラデシュの学生・求職者向けに、日本語研修、学生ビザ支援、就職パスを提供します。",
        apply: "Free Consultation",
        whatsapp: "WhatsApp Now",
        highlights: ["✓ 留学・就職の両方に対応", "✓ 書類準備サポート", "✓ 渡航まで一貫支援"],
      },
    },
    language,
  );

  return (
    <section className="relative flex min-h-[560px] items-center overflow-hidden md:min-h-[700px]">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(/images/hero-bg.jpg)" }} />
      <div className="absolute inset-0 bg-primary/75" />

      <div className="container-narrow relative z-10 py-16 sm:py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl"
        >
          <span className="mb-5 inline-block rounded-full border border-accent-foreground/20 bg-accent/20 px-3 py-1.5 text-xs font-semibold text-accent-foreground sm:mb-6 sm:px-4 sm:text-sm">{t.badge}</span>
          <h1 className="mb-5 max-w-3xl text-3xl font-extrabold leading-[1.2] tracking-tight text-primary-foreground sm:text-4xl md:mb-6 md:text-5xl lg:text-6xl">
            {t.title}
          </h1>
          <p className="mb-7 max-w-2xl text-base leading-relaxed text-primary-foreground/90 sm:text-lg md:mb-8 md:text-xl">{t.desc}</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Button asChild size="lg" className="w-full bg-accent px-6 text-base font-bold text-accent-foreground hover:bg-accent/90 sm:w-auto sm:px-8">
              <Link href="/contact" onClick={() => trackApplyNowClick("hero_free_consultation")}>
                {t.apply}
              </Link>
            </Button>
            <Button asChild size="lg" className="w-full bg-whatsapp px-6 text-base font-semibold text-whatsapp-foreground hover:bg-whatsapp/90 sm:w-auto sm:px-8">
              <a href={siteConfig.whatsappHref} target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsAppClick("hero_whatsapp_now")}>
                <MessageCircle className="mr-2 h-5 w-5" />
                {t.whatsapp}
              </a>
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3 text-xs text-primary-foreground/80 sm:mt-10 sm:gap-6 sm:text-sm">
            {t.highlights.map((item) => <span key={item}>{item}</span>)}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
