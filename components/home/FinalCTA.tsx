"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";

const FinalCTA = () => {
  const { language } = useLanguage();
  const t = translate(
    {
      en: { title: "Ready to Start Your Journey to Japan?", desc: "Take the first step today. Our team is ready to guide you at every stage.", apply: "Apply Now", consult: "Book Free Consultation", whatsapp: "WhatsApp Us" },
      bn: { title: "জাপান যাত্রা শুরু করতে প্রস্তুত?", desc: "আজই প্রথম পদক্ষেপ নিন। আমাদের টিম প্রতিটি ধাপে পাশে থাকবে।", apply: "এখনই আবেদন করুন", consult: "ফ্রি কনসাল্টেশন বুক করুন", whatsapp: "হোয়াটসঅ্যাপ করুন" },
      ja: { title: "日本への一歩を始めませんか？", desc: "今日から始めましょう。各ステップで私たちがサポートします。", apply: "今すぐ応募", consult: "無料相談を予約", whatsapp: "WhatsAppで相談" },
    },
    language,
  );

  return (
    <section className="section-padding bg-primary">
      <div className="container-narrow text-center">
        <h2 className="mb-4 text-2xl font-extrabold text-primary-foreground sm:text-3xl md:text-4xl">{t.title}</h2>
        <p className="mx-auto mb-8 max-w-xl text-base text-primary-foreground/80 sm:text-lg">{t.desc}</p>

        <div className="mx-auto flex max-w-xl flex-col items-stretch justify-center gap-3 sm:max-w-none sm:flex-row sm:items-center sm:gap-4">
          <Button asChild size="lg" className="bg-white px-6 text-base font-bold text-primary hover:bg-white/90 sm:px-8">
            <Link href="/contact">{t.apply}</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-accent px-6 text-base font-semibold text-accent hover:bg-accent/10 sm:px-8">
            <Link href="/contact">{t.consult}</Link>
          </Button>
          <Button asChild size="lg" className="bg-whatsapp px-6 text-base font-semibold text-whatsapp-foreground hover:bg-whatsapp/90 sm:px-8">
            <a href={siteConfig.whatsappHref} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-2 h-5 w-5" />
              {t.whatsapp}
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
