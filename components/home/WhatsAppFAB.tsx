"use client";

import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/lib/site";

const WhatsAppFAB = () => (
  <a
    href={siteConfig.whatsappHref}
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-lg transition-transform hover:scale-110"
    aria-label="Chat on WhatsApp"
  >
    <MessageCircle className="h-7 w-7" />
  </a>
);

export default WhatsAppFAB;
