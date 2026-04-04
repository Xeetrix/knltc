"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";

const HeroSection = () => {
  const { language } = useLanguage();
  const t = translate(
    {
      en: {
        badge: "🇯🇵 Trusted Japan Guidance Agency",
        title: "Your Trusted Guidefrom Bangladesh to Japan",
        desc: "Japanese language training, job preparation, interview support, visa guidance, and step-by-step assistance.",
        apply: "Apply Now",
        whatsapp: "WhatsApp Us",
        highlights: ["✓ Clear process guidance", "✓ Transparent communication", "✓ Ongoing support"],
      },
      bn: {
        badge: "🇯🇵 বিশ্বস্ত জাপান গাইডেন্স এজেন্সি",
        title: "বাংলাদেশ থেকে জাপানে আপনার বিশ্বস্ত পথপ্রদর্শক",
        desc: "জাপানি ভাষা প্রশিক্ষণ, চাকরি প্রস্তুতি, ইন্টারভিউ সাপোর্ট, ভিসা গাইডেন্স এবং ধাপে ধাপে সহায়তা।",
        apply: "এখনই আবেদন করুন",
        whatsapp: "হোয়াটসঅ্যাপ করুন",
        highlights: ["✓ পরিষ্কার প্রক্রিয়া নির্দেশনা", "✓ স্বচ্ছ যোগাযোগ", "✓ চলমান সহায়তা"],
      },
      ja: {
        badge: "🇯🇵 信頼できる日本進学・就職ガイダンス",
        title: "バングラデシュから日本への信頼のガイド",
        desc: "日本語学習、就職準備、面接サポート、ビザ案内まで段階的に支援します。",
        apply: "今すぐ応募",
        whatsapp: "WhatsAppで相談",
        highlights: ["✓ 明確な手続き案内", "✓ 透明なコミュニケーション", "✓ 継続サポート"],
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
          <h1 className="mb-5 text-3xl font-extrabold leading-tight text-primary-foreground sm:text-4xl md:mb-6 md:text-5xl lg:text-6xl">{t.title}</h1>
          <p className="mb-7 max-w-xl text-base text-primary-foreground/85 sm:text-lg md:mb-8 md:text-xl">{t.desc}</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Button asChild size="lg" className="w-full bg-accent px-6 text-base font-bold text-accent-foreground hover:bg-accent/90 sm:w-auto sm:px-8">
              <Link href="/contact">{t.apply}</Link>
            </Button>
            <Button asChild size="lg" className="w-full bg-whatsapp px-6 text-base font-semibold text-whatsapp-foreground hover:bg-whatsapp/90 sm:w-auto sm:px-8">
              <a href={siteConfig.whatsappHref} target="_blank" rel="noopener noreferrer">
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
