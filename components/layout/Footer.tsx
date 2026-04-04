"use client";

import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import BrandLogo from "@/components/layout/BrandLogo";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";

export default function Footer() {
  const { language } = useLanguage();
  const t = translate(
    {
      en: {
        desc: "Your trusted partner for Japan recruitment and training from Bangladesh.",
        quickLinks: "Quick Links",
        services: "Core Services",
        contact: "Contact",
        social: "Social",
        items: ["Japanese Language Training", "Job Placement Support", "Visa Documentation Guidance", "Interview Preparation"],
        rights: "All rights reserved.",
        links: ["Services", "Study in Japan", "Work in Japan", "Contact"],
      },
      bn: {
        desc: "বাংলাদেশ থেকে জাপান রিক্রুটমেন্ট ও ট্রেনিংয়ে আপনার বিশ্বস্ত অংশীদার।",
        quickLinks: "দ্রুত লিংক",
        services: "মূল সেবা",
        contact: "যোগাযোগ",
        social: "সোশ্যাল",
        items: ["জাপানি ভাষা প্রশিক্ষণ", "চাকরির সহায়তা", "ভিসা ডকুমেন্টেশন গাইড", "ইন্টারভিউ প্রস্তুতি"],
        rights: "সর্বস্বত্ব সংরক্ষিত।",
        links: ["সার্ভিস", "জাপানে পড়াশোনা", "জাপানে কাজ", "যোগাযোগ"],
      },
      ja: {
        desc: "バングラデシュから日本への採用・研修を支える信頼のパートナーです。",
        quickLinks: "クイックリンク",
        services: "主要サービス",
        contact: "お問い合わせ",
        social: "ソーシャル",
        items: ["日本語トレーニング", "就職サポート", "ビザ書類ガイド", "面接対策"],
        rights: "無断転載を禁じます。",
        links: ["サービス", "日本留学", "日本就職", "お問い合わせ"],
      },
    },
    language,
  );

  return (
    <footer className="bg-foreground py-12 text-white/80">
      <div className="container-narrow">
        <div className="mb-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4 rounded bg-white p-3 w-fit">
              <BrandLogo compact />
            </div>
            <p className="text-sm leading-relaxed">{t.desc}</p>
          </div>
          <div>
            <h4 className="mb-3 font-bold text-white">{t.quickLinks}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/services" className="transition-colors hover:text-primary">{t.links[0]}</Link></li>
              <li><Link href="/study-in-japan" className="transition-colors hover:text-primary">{t.links[1]}</Link></li>
              <li><Link href="/work-in-japan" className="transition-colors hover:text-primary">{t.links[2]}</Link></li>
              <li><Link href="/contact" className="transition-colors hover:text-primary">{t.links[3]}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-bold text-white">{t.services}</h4>
            <ul className="space-y-2 text-sm">
              {t.items.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-bold text-white">{t.contact}</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-primary" /> <a href={siteConfig.phoneHref} className="hover:text-primary">{siteConfig.phoneDisplay}</a></li>
              <li className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-accent" /> <a href={`mailto:${siteConfig.email}`} className="hover:text-accent">{siteConfig.email}</a></li>
              <li className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> {siteConfig.location}</li>
            </ul>
            <h4 className="mb-3 mt-5 font-bold text-white">{t.social}</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><Facebook className="h-3.5 w-3.5 text-primary" /> <a href="https://web.facebook.com/KurobeNihongoLanguageTrainingCenter" target="_blank" rel="noopener noreferrer" className="hover:text-primary">Facebook</a></li>
              <li className="flex items-center gap-2"><Instagram className="h-3.5 w-3.5 text-pink-400" /> <a href="https://www.instagram.com/knltc.official" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400">Instagram</a></li>
              <li className="flex items-center gap-2"><MessageCircle className="h-3.5 w-3.5 text-green-400" /> <a href={siteConfig.whatsappHref} target="_blank" rel="noopener noreferrer" className="hover:text-green-400">{siteConfig.whatsappDisplay}</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 text-center text-sm">© {new Date().getFullYear()} KNLTC. {t.rights}</div>
      </div>
    </footer>
  );
}
