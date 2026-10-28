"use client";

import { Mail, MapPin, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import ContactForm from "@/components/forms/ContactForm";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";
import { trackWhatsAppClick } from "@/lib/meta-pixel";
import { useKnlTcCms } from "@/hooks/use-knltc-cms";

export default function ContactSection() {
  const { language } = useLanguage();
  const { cms } = useKnlTcCms();
  const t = translate(
    {
      en: {
        title: "Contact Us",
        desc: "Have questions? Reach out through any channel — our Dhaka Head Office and Khulna Branch teams are ready to assist.",
        phone: "Official Hotline",
        whatsapp: "WhatsApp Direct",
        email: "Official Email",
        dhakaOffice: "Dhaka Head Office",
        khulnaOffice: "Khulna Branch",
        license: "Govt. Trade License & 300 BDT Legal Stamp Verified",
      },
      bn: {
        title: "যোগাযোগ করুন",
        desc: "যেকোনো প্রশ্নে সরাসরি আমাদের ঢাকা হেড অফিস অথবা খুলনা শাখায় যোগাযোগ করুন — আমরা সাহায্যের জন্য প্রস্তুত।",
        phone: "অফিশিয়াল হটলাইন",
        whatsapp: "হোয়াটসঅ্যাপ ডিরেক্ট",
        email: "অফিশিয়াল ইমেইল",
        dhakaOffice: "ঢাকা হেড অফিস (নয়া পল্টন)",
        khulnaOffice: "খুলনা শাখা অফিস",
        license: "সরকারি ট্রেড লাইসেন্স ও ৩০০ টাকার জুডিশিয়াল স্ট্যাম্প ভেরিফাইড",
      },
      ja: {
        title: "お問い合わせ",
        desc: "ダッカ本部およびクルナ支部の専任カウンセラーがお答えします。",
        phone: "公式ホットライン",
        whatsapp: "WhatsApp直通",
        email: "公式メール",
        dhakaOffice: "ダッカ本部オフィス",
        khulnaOffice: "クルナ支部オフィス",
        license: "政府営業許可証・300タカ公的印紙契約対応",
      },
    },
    language,
  );

  const phoneDisplay = cms?.contactHotline || siteConfig.phoneDisplay;
  const phoneDigits = phoneDisplay.replace(/\D/g, "");
  const waDisplay = cms?.contactWhatsApp || siteConfig.whatsappDisplay;
  const waDigits = waDisplay.replace(/\D/g, "");
  const emailDisplay = cms?.contactEmail || siteConfig.email;
  const dhakaAddress = cms?.dhakaOfficeAddress?.[language] || siteConfig.locations[language];
  const khulnaAddress = cms?.khulnaOfficeAddress?.[language] || "শিববাড়ি মোড়, খুলনা";

  return (
    <section id="contact" className="section-padding">
      <div className="container-narrow">
        <div className="mb-14 text-center">
          <h2 className="mb-4 text-2xl font-extrabold text-foreground sm:text-3xl md:text-4xl">{t.title}</h2>
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base">{t.desc}</p>
        </div>

        <div className="grid gap-8 md:gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-foreground">{t.phone}</h4>
                <a href={`tel:+${phoneDigits}`} className="break-all text-muted-foreground hover:underline font-medium">
                  {phoneDisplay}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-whatsapp/10">
                <MessageCircle className="h-5 w-5 text-whatsapp" />
              </div>
              <div>
                <h4 className="font-bold text-foreground">{t.whatsapp}</h4>
                <a
                  href={`https://wa.me/${waDigits}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all text-whatsapp hover:underline font-medium"
                  onClick={() => trackWhatsAppClick("contact_section_whatsapp")}
                >
                  {waDisplay}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-foreground">{t.email}</h4>
                <a href={`mailto:${emailDisplay}`} className="break-all text-muted-foreground hover:underline">
                  {emailDisplay}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-foreground">{t.dhakaOffice}</h4>
                <p className="break-words text-sm text-muted-foreground">{dhakaAddress}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
                <MapPin className="h-5 w-5 text-[#15803d]" />
              </div>
              <div>
                <h4 className="font-bold text-foreground">{t.khulnaOffice}</h4>
                <p className="break-words text-sm text-muted-foreground">{khulnaAddress}</p>
              </div>
            </div>

            <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5 flex items-center gap-2.5 text-xs font-semibold text-[#15803d]">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>{t.license}</span>
            </div>
          </div>

          <ContactForm />
        </div>
      </div>
    </section>
  );
}
