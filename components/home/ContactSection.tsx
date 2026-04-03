"use client";

import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import ContactForm from "@/components/forms/ContactForm";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";

export default function ContactSection() {
  const { language } = useLanguage();
  const t = translate(
    {
      en: { title: "Contact Us", desc: "Have questions? Reach out through any channel — we're here to help.", phone: "Phone", whatsapp: "WhatsApp", email: "Email", office: "Office Address" },
      bn: { title: "যোগাযোগ করুন", desc: "কোন প্রশ্ন আছে? যেকোনো মাধ্যমে যোগাযোগ করুন — আমরা সাহায্যের জন্য আছি।", phone: "ফোন", whatsapp: "হোয়াটসঅ্যাপ", email: "ইমেইল", office: "অফিসের ঠিকানা" },
      ja: { title: "お問い合わせ", desc: "ご質問がありますか？どの連絡手段でもお気軽にご相談ください。", phone: "電話", whatsapp: "WhatsApp", email: "メール", office: "オフィス住所" },
    },
    language,
  );

  return (
    <section id="contact" className="section-padding">
      <div className="container-narrow">
        <div className="mb-14 text-center">
          <h2 className="mb-4 text-3xl font-extrabold text-foreground md:text-4xl">{t.title}</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">{t.desc}</p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="flex items-start gap-4"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10"><Phone className="h-5 w-5 text-primary" /></div><div><h4 className="font-bold text-foreground">{t.phone}</h4><a href={siteConfig.phoneHref} className="text-muted-foreground hover:underline">{siteConfig.phoneDisplay}</a></div></div>
            <div className="flex items-start gap-4"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-whatsapp/10"><MessageCircle className="h-5 w-5 text-whatsapp" /></div><div><h4 className="font-bold text-foreground">{t.whatsapp}</h4><a href={siteConfig.whatsappHref} target="_blank" rel="noopener noreferrer" className="text-whatsapp hover:underline">{siteConfig.whatsappDisplay}</a></div></div>
            <div className="flex items-start gap-4"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10"><Mail className="h-5 w-5 text-primary" /></div><div><h4 className="font-bold text-foreground">{t.email}</h4><a href={`mailto:${siteConfig.email}`} className="text-muted-foreground hover:underline">{siteConfig.email}</a></div></div>
            <div className="flex items-start gap-4"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10"><MapPin className="h-5 w-5 text-primary" /></div><div><h4 className="font-bold text-foreground">{t.office}</h4><p className="text-muted-foreground">{siteConfig.location}</p></div></div>
          </div>

          <ContactForm />
        </div>
      </div>
    </section>
  );
}
