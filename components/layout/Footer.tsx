"use client";

import Link from "next/link";
import {
  ExternalLink,
  Facebook,
  GraduationCap,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import BrandLogo from "@/components/layout/BrandLogo";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";

export default function Footer() {
  const { language } = useLanguage();

  const t = translate(
    {
      en: {
        desc: "KNLTC (Japan Gateway) — Japan Education & Career Consultancy. Dedicated pathways for Higher Education, SSW & TITP employment, and professional Japanese language certification.",
        quick: "Quick Navigation",
        contact: "Official Office & Contact",
        rights: "All rights reserved.",
        lmsTitle: "Online LMS Portal",
        lmsDesc: "Current students can access live classes and study materials directly on our digital learning management system.",
        lmsBtn: "Student LMS Login",
        links: [
          { label: "Study in Japan", href: "/study-in-japan" },
          { label: "Work in Japan (SSW & TITP)", href: "/work-in-japan" },
          { label: "Japanese Language Course", href: "/japanese-language" },
          { label: "Book Store & Worksheets", href: "/store" },
          { label: "Japan Articles & Blog", href: "/blog" },
          { label: "Contact & Location", href: "/contact" },
          { label: "Privacy Policy", href: "/privacy-policy" },
        ],
      },
      bn: {
        desc: "KNLTC (জাপান গেটওয়ে) — জাপান এডুকেশন অ্যান্ড ক্যারিয়ার কনসালটেন্সি। জাপানে উচ্চশিক্ষা, SSW ও TITP জব ভিসা এবং মানসম্মত জাপানি ভাষা শিক্ষার পূর্ণাঙ্গ নির্ভরযোগ্য প্রতিষ্ঠান।",
        quick: "প্রয়োজনীয় লিংক",
        contact: "অফিস ও সরাসরি যোগাযোগ",
        rights: "সর্বস্বত্ব সংরক্ষিত।",
        lmsTitle: "অনলাইন LMS ক্লাসরুম",
        lmsDesc: "ভর্তিকৃত শিক্ষার্থীরা সরাসরি KNLTC ডিজিটাল লার্নিং পোর্টালে লগইন করে লাইভ ক্লাস ও লেকচার শিট এক্সেস করতে পারবেন।",
        lmsBtn: "শিক্ষার্থী LMS লগইন",
        links: [
          { label: "জাপানে পড়াশোনা", href: "/study-in-japan" },
          { label: "জাপানে কাজ (SSW ও TITP)", href: "/work-in-japan" },
          { label: "জাপানি ভাষা কোর্স", href: "/japanese-language" },
          { label: "বই ও স্টাডি মেটেরিয়ালস", href: "/store" },
          { label: "ব্লগ ও গাইডলাইন", href: "/blog" },
          { label: "যোগাযোগ ও ঠিকানা", href: "/contact" },
          { label: "গোপনীয়তা নীতি", href: "/privacy-policy" },
        ],
      },
      ja: {
        desc: "KNLTC（ジャパンゲートウェイ）— 日本留学・就労・在留資格総合支援センター。留学ビザ、特定技能就労、日本語教育のトータルサポート。",
        quick: "主なリンク",
        contact: "オフィス・お問い合わせ",
        rights: "無断転載を禁じます。",
        lmsTitle: "オンラインLMS教室",
        lmsDesc: "受講生は専用ポータルよりライブ講義や教材アーカイブをご利用いただけます。",
        lmsBtn: "受講生 LMSログイン",
        links: [
          { label: "日本留学", href: "/study-in-japan" },
          { label: "日本就労（特定技能・実習）", href: "/work-in-japan" },
          { label: "日本語講座", href: "/japanese-language" },
          { label: "教材ストア", href: "/store" },
          { label: "ブログ・お知らせ", href: "/blog" },
          { label: "お問い合わせ", href: "/contact" },
          { label: "プライバシーポリシー", href: "/privacy-policy" },
        ],
      },
    },
    language,
  );

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs sm:text-sm border-t border-slate-800">
      <div className="container-narrow py-14 sm:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Col 1: Brand & Identity */}
          <div className="space-y-4">
            <BrandLogo compact inverse />
            <p className="text-slate-400 text-xs leading-relaxed font-normal">
              {t.desc}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://web.facebook.com/KurobeNihongoLanguageTrainingCenter"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://www.instagram.com/knltc.official"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={siteConfig.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-emerald-400 hover:text-emerald-300 hover:border-slate-700 transition"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4 tracking-tight">
              {t.quick}
            </h4>
            <ul className="space-y-2.5">
              {t.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-white transition"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Contact & Location */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4 tracking-tight">
              {t.contact}
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-[#b91c1c] shrink-0 mt-0.5" />
                <span className="leading-snug text-slate-300">
                  Sky View Trade Valley (8th Floor), 66/1 VIP Road, Naya Paltan, Dhaka
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-[#b91c1c] shrink-0" />
                <a
                  href={siteConfig.phoneHref}
                  className="text-slate-300 hover:text-white font-medium transition"
                >
                  +880 1805 013633
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-[#b91c1c] shrink-0" />
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-slate-300 hover:text-white transition"
                >
                  {siteConfig.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageCircle className="h-4 w-4 text-[#15803d] shrink-0" />
                <a
                  href={siteConfig.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline font-semibold"
                >
                  WhatsApp: +880 1805 013633
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: LMS Classroom Direct Access */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <GraduationCap className="h-4 w-4 text-[#b91c1c]" />
              <span>{t.lmsTitle}</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              {t.lmsDesc}
            </p>
            <div className="pt-2">
              <a
                href="https://npw.bd/knltc"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 w-full rounded-xl bg-[#b91c1c] hover:bg-red-800 text-white font-semibold text-xs py-2.5 px-3 transition shadow-xs"
              >
                <span>{t.lmsBtn}</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} KNLTC (Japan Gateway). {t.rights}
          </div>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="hover:text-slate-400 transition">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-slate-400 transition">
              Location Map
            </Link>
            <span>•</span>
            <a
              href="https://npw.bd/knltc"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#b91c1c] hover:underline font-semibold"
            >
              LMS Portal
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
