"use client";

import { MessageCircle } from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { siteConfig } from "@/lib/site";
import { trackWhatsAppClick } from "@/lib/meta-pixel";

const WhatsAppFAB = () => {
  const { language } = useLanguage();
  const label = language === "bn" ? "হোয়াটসঅ্যাপে চ্যাট" : language === "ja" ? "WhatsAppでチャット" : "Chat on WhatsApp";
  return (
    <a
      href={siteConfig.whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-lg transition-transform hover:scale-110"
      aria-label={label}
      onClick={() => trackWhatsAppClick("floating_whatsapp_fab")}
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
};

export default WhatsAppFAB;
