import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  FileCheck2,
  GraduationCap,
  Hammer,
  Languages,
  MessageCircle,
  Plane,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "জাপান ক্যারিয়ার | KNLTC",
  description:
    "KNLTC-এর জাপান ক্যারিয়ার সাপোর্ট: ভাষা শিক্ষা, স্কিল ট্রেনিং, SSW/TITP ভিসা প্রস্তুতি, ইন্টারভিউ, ডকুমেন্টেশন ও আফটার অ্যারাইভাল সাপোর্ট।",
};

type LangCode = "bn" | "en" | "ja" | "zh" | "ru" | "ms";

const bnText = {
  badge: "KNLTC Japan Career",
  heroTitle: "জাপানে কাজ ও ক্যারিয়ার গড়ার সম্পূর্ণ প্রস্তুতি",
  heroSubtitle:
    "ভাষা শিক্ষা, স্কিল ট্রেনিং, SSW/TITP ভিসা, ইন্টারভিউ প্রস্তুতি, ডকুমেন্টেশন ও জাপানে পৌঁছানোর পরও সাপোর্ট—সবকিছু এক জায়গায়।",
  ctaConsult: "ফ্রি কনসাল্টেশন",
  ctaWhatsApp: "WhatsApp করুন",
  supportTitle: "Complete Support System",
  visaTitle: "Visa Programs",
  sswTitle: "SSW প্রোগ্রাম",
  titpTitle: "TITP প্রোগ্রাম",
  sswSectorsTitle: "SSW Sectors",
  titpSectorsTitle: "TITP Sectors",
  circularTitle: "Current Opportunities",
  whyTitle: "Why KNLTC",
  finalTitle: "জাপানে কাজের প্রস্তুতি শুরু করতে চান?",
  fallbackNote: "* কিছু অনুবাদ চলমান। এই পেজে ডিফল্ট ভাষা বাংলা দেখানো হচ্ছে।",
  overtimeNote:
    "ওভারটাইমের সুযোগ থাকতে পারে। ভাষা ও কাজের দক্ষতা বাড়লে আয়ও বাড়তে পারে।",
};

const translations: Partial<Record<LangCode, Partial<typeof bnText>>> = {
  en: {
    heroTitle: "Complete preparation for work and career in Japan",
    ctaConsult: "Free Consultation",
    ctaWhatsApp: "WhatsApp",
    fallbackNote: "* Some translations are in progress. Bengali is shown as default fallback.",
  },
  ja: { ctaConsult: "無料相談", ctaWhatsApp: "WhatsAppで相談" },
  zh: { ctaConsult: "免费咨询", ctaWhatsApp: "WhatsApp 咨询" },
  ru: { ctaConsult: "Бесплатная консультация", ctaWhatsApp: "WhatsApp" },
  ms: { ctaConsult: "Konsultasi Percuma", ctaWhatsApp: "WhatsApp" },
};

const activeLang: LangCode = "bn";
const t = { ...bnText, ...(translations[activeLang] ?? {}) };

const supportCards = [
  {
    title: "ল্যাঙ্গুয়েজ প্রোগ্রাম",
    description: "JLPT/JFT ভিত্তিক ভাষা দক্ষতা ও জাপানি কর্মপরিবেশে যোগাযোগ প্রস্তুতি।",
    icon: Languages,
  },
  {
    title: "স্কিল ট্রেইনিং",
    description: "সেক্টরভিত্তিক ব্যবহারিক প্রশিক্ষণ, যাতে নিয়োগের জন্য প্রস্তুত থাকা যায়।",
    icon: Hammer,
  },
  {
    title: "ভিসা সাপোর্ট",
    description: "SSW ও TITP ভিসা প্রক্রিয়ার ধাপভিত্তিক গাইড ও বাস্তব সহায়তা।",
    icon: ShieldCheck,
  },
  {
    title: "ইন্টারভিউ প্রিপারেশন",
    description: "মক ইন্টারভিউ, আত্মবিশ্বাস, এবং জাপানি নিয়োগদাতার প্রত্যাশা অনুযায়ী প্রস্তুতি।",
    icon: CheckCircle2,
  },
  {
    title: "জাপানিজ ভাষার বই",
    description: "শুরু থেকে পরীক্ষাভিত্তিক শেখার জন্য রিকমেন্ডেড বই ও স্টাডি রোডম্যাপ।",
    icon: BookOpen,
  },
  {
    title: "ডকুমেন্টেশন সাপোর্ট",
    description: "ডকুমেন্ট চেকলিস্ট, ফরম্যাটিং, যাচাই ও সাবমিশন গাইডলাইন।",
    icon: FileCheck2,
  },
  {
    title: "আফটার অ্যারাইভাল সাপোর্ট",
    description: "জাপানে পৌঁছানোর পর প্রয়োজনীয় দিকনির্দেশনা ও যোগাযোগে সহায়তার চেষ্টা।",
    icon: Plane,
  },
];

const sswSectors = [
  "Nursing Care",
  "Building Cleaning",
  "Manufacturing/Industrial",
  "Construction",
  "Shipbuilding",
  "Automobile Repair",
  "Aviation",
  "Accommodation",
  "Agriculture",
  "Fishery",
  "Food and Beverage",
  "Food Service",
  "Automobile Transportation",
  "Railway",
  "Forestry",
  "Wood Industry",
];

const titpSectors = [
  "Agriculture/Farming",
  "Construction",
  "Manufacturing/Factory",
  "Textile/Garments",
  "Fishery",
  "Welding",
  "Automobile",
];

export default function JapanCareerPage() {
  return (
    <section className="section-padding bg-gradient-to-b from-red-50 via-white to-green-50/70">
      <div className="container-narrow space-y-8">
        <div className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm md:p-8">
          <p className="text-sm font-semibold tracking-wide text-red-600">{t.badge}</p>
          <h1 className="mt-2 text-3xl font-extrabold leading-tight tracking-tight text-zinc-900 md:text-5xl">
            {t.heroTitle}
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-zinc-600">{t.heroSubtitle}</p>
          <p className="mt-2 text-xs text-zinc-500">BN · EN · JA · ZH · RU · MS {t.fallbackNote}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild className="bg-red-600 text-white hover:bg-red-700">
              <Link href="/contact">{t.ctaConsult}</Link>
            </Button>
            <Button asChild variant="outline" className="border-green-600 text-green-700 hover:bg-green-50">
              <a href={siteConfig.whatsappHref} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-4 w-4" />
                {t.ctaWhatsApp}
              </a>
            </Button>
          </div>
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-zinc-900 md:text-3xl">{t.supportTitle}</h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {supportCards.map((card) => {
              const Icon = card.icon;
              return (
                <Card
                  key={card.title}
                  className="group border-zinc-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-md"
                >
                  <CardHeader>
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-700 transition-colors group-hover:bg-red-100 group-hover:text-red-700">
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg font-bold text-zinc-900">{card.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed text-zinc-600">{card.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-zinc-900 md:text-3xl">{t.visaTitle}</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="border-red-200 bg-red-50/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl text-red-700">
                  <BriefcaseBusiness className="h-6 w-6" /> {t.sswTitle}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-zinc-700">
                  <li>• JLPT N4 বা JFT-Basic</li>
                  <li>• Skill Test</li>
                  <li>• দক্ষ কর্মী ভিসা</li>
                  <li>• ভবিষ্যতে Type 2 pathway</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="border-green-200 bg-green-50/70">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl text-green-700">
                  <GraduationCap className="h-6 w-6" /> {t.titpTitle}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-zinc-700">
                  <li>• trainee program</li>
                  <li>• N5 level preparation</li>
                  <li>• 3–5 years</li>
                  <li>• future SSW pathway</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-zinc-900 md:text-3xl">{t.sswSectorsTitle}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sswSectors.map((sector) => (
              <div
                key={sector}
                className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:border-red-200 hover:bg-red-50/40"
              >
                {sector}
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-zinc-900 md:text-3xl">{t.titpSectorsTitle}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {titpSectors.map((sector) => (
              <div
                key={sector}
                className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:border-green-200 hover:bg-green-50/40"
              >
                {sector}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-red-200 bg-gradient-to-br from-white via-red-50 to-green-50 p-6 shadow-sm md:p-8">
          <h2 className="text-2xl font-bold text-zinc-900 md:text-3xl">{t.circularTitle}</h2>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {[
              ["SSW Agriculture", "JLPT N4/JFT-Basic + Skill Test Certificate", "150,000–200,000 JPY"],
              ["SSW Caregiver", "JLPT N4/JFT-Basic + Skill Test Certificate", "180,000–220,000 JPY"],
              ["TITP Construction", "N5 basic Japanese; language can be taught if needed", "150,000–200,000 JPY"],
              ["TITP Automobile", "Relevant experience; language can be taught if needed", "200,000–250,000 JPY"],
              ["TITP Welding", "Relevant experience; language can be taught if needed", "200,000–250,000 JPY"],
            ].map(([title, eligibility, salary]) => (
              <Card key={title} className="border-zinc-200 bg-white/95">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-zinc-900">{title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p className="text-zinc-600">
                    <span className="font-semibold text-zinc-800">Eligibility:</span> {eligibility}
                  </p>
                  <p className="text-zinc-600">
                    <span className="font-semibold text-zinc-800">Salary:</span> {salary}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
            {t.overtimeNote}
          </p>
        </section>

        <section className="rounded-2xl border border-green-200 bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-2xl font-bold text-zinc-900 md:text-3xl">{t.whyTitle}</h2>
          <ul className="mt-4 grid gap-3 text-sm text-zinc-700 sm:grid-cols-2">
            <li className="rounded-lg bg-green-50 px-4 py-3">• ভাষা + স্কিল + ভিসা একসাথে</li>
            <li className="rounded-lg bg-red-50 px-4 py-3">• ইন্টারভিউ প্রস্তুতি</li>
            <li className="rounded-lg bg-green-50 px-4 py-3">• ডকুমেন্টেশন গাইডলাইন</li>
            <li className="rounded-lg bg-red-50 px-4 py-3">• জাপানে পৌঁছানোর পরও সম্পর্ক বজায় রাখার চেষ্টা</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-red-200 bg-white p-6 text-center shadow-sm md:p-8">
          <h2 className="text-2xl font-bold text-zinc-900 md:text-3xl">{t.finalTitle}</h2>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <Button asChild className="bg-red-600 text-white hover:bg-red-700">
              <Link href="/contact">
                {t.ctaConsult} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-green-600 text-green-700 hover:bg-green-50">
              <a href={siteConfig.whatsappHref} target="_blank" rel="noopener noreferrer">
                {t.ctaWhatsApp}
              </a>
            </Button>
          </div>
        </section>
      </div>
    </section>
  );
}
