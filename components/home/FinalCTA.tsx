"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";
import { trackApplyNowClick, trackWhatsAppClick } from "@/lib/meta-pixel";

const FinalCTA = () => {
  const { language } = useLanguage();
  const t = translate(
    {
      en: { title: "Ready to Start Your Journey to Japan?", desc: "Book a free consultation and get your personalized roadmap for study or work in Japan.", apply: "Apply Now", consult: "Free Consultation", whatsapp: "WhatsApp Now" },
      bn: { title: "জাপান যাত্রা শুরু করতে প্রস্তুত?", desc: "ফ্রি কনসাল্টেশন বুক করে জাপানে পড়াশোনা বা কাজের জন্য আপনার ব্যক্তিগত রোডম্যাপ নিন।", apply: "Apply Now", consult: "Free Consultation", whatsapp: "WhatsApp Now" },
      ja: { title: "日本への一歩を始めませんか？", desc: "無料相談で、留学・就職に向けたあなた専用のロードマップを受け取りましょう。", apply: "Apply Now", consult: "Free Consultation", whatsapp: "WhatsApp Now" },
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
            <Link href="/contact" onClick={() => trackApplyNowClick("final_cta_apply_now")}>{t.apply}</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-accent px-6 text-base font-semibold text-accent hover:bg-accent/10 sm:px-8">
            <Link href="/contact" onClick={() => trackApplyNowClick("final_cta_free_consultation")}>{t.consult}</Link>
          </Button>
          <Button asChild size="lg" className="bg-whatsapp px-6 text-base font-semibold text-whatsapp-foreground hover:bg-whatsapp/90 sm:px-8">
            <a href={siteConfig.whatsappHref} target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsAppClick("final_cta_whatsapp_now")}>
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
