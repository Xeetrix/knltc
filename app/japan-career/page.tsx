import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  FileCheck2,
  Fish,
  GraduationCap,
  Hammer,
  HeartHandshake,
  Languages,
  Leaf,
  MessageCircle,
  Plane,
  ShieldCheck,
  Sparkles,
  UtensilsCrossed,
  Wrench,
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
  heroTitle: "জাপানে কাজ নয়, ভবিষ্যৎ গড়ার প্রিমিয়াম পথচলা",
  heroSubtitle:
    "Language + Skill + Visa — একটি সম্পূর্ণ জাপান ক্যারিয়ার সিস্টেম যেখানে প্রস্তুতি, সুযোগ এবং দীর্ঘমেয়াদি গাইডেন্স একই প্ল্যাটফর্মে।",
  ctaConsult: "ফ্রি কনসাল্টেশন বুক করুন",
  ctaWhatsApp: "WhatsApp এ কথা বলুন",
  supportTitle: "Complete Support System",
  visaTitle: "SSW vs TITP: আপনার জন্য সঠিক পথ কোনটি",
  sswTitle: "SSW প্রোগ্রাম",
  titpTitle: "TITP প্রোগ্রাম",
  sswSectorsTitle: "Japan Work Sectors",
  circularTitle: "Current Opportunities",
  processTitle: "আপনার জাপান জার্নির ৭ ধাপ",
  whyTitle: "Why KNLTC",
  finalTitle: "আজই আপনার Japan Career Consultation শুরু করুন",
  fallbackNote: "* কিছু অনুবাদ চলমান। এই পেজে ডিফল্ট ভাষা বাংলা দেখানো হচ্ছে।",
  overtimeNote:
    "ওভারটাইমের সুযোগ থাকতে পারে। ভাষা ও কাজের দক্ষতা বাড়লে আয়ও বাড়তে পারে।",
};

const translations: Partial<Record<LangCode, Partial<typeof bnText>>> = {
  en: {
    heroTitle: "Build not just a job, but a long-term career in Japan",
    ctaConsult: "Book Free Consultation",
    ctaWhatsApp: "Talk on WhatsApp",
    fallbackNote: "* Some translations are in progress. Bengali is shown as default fallback.",
  },
};

const activeLang: LangCode = "bn";
const t = { ...bnText, ...(translations[activeLang] ?? {}) };

const heroStats = ["500+ guided", "SSW/TITP Support", "Language + Skill + Visa"];

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
];

const sectorGroups = [
  {
    title: "Infrastructure & Industry",
    items: [
      { name: "Construction", icon: Building2 },
      { name: "Manufacturing", icon: Wrench },
      { name: "Shipbuilding", icon: Hammer },
      { name: "Railway", icon: BriefcaseBusiness },
    ],
  },
  {
    title: "Care & Services",
    items: [
      { name: "Nursing Care", icon: HeartHandshake },
      { name: "Accommodation", icon: Award },
      { name: "Food Service", icon: UtensilsCrossed },
      { name: "Building Cleaning", icon: Sparkles },
    ],
  },
  {
    title: "Primary Sectors",
    items: [
      { name: "Agriculture", icon: Leaf },
      { name: "Fishery", icon: Fish },
      { name: "Forestry", icon: Leaf },
      { name: "Wood Industry", icon: Hammer },
    ],
  },
];

const opportunityCards = [
  {
    title: "SSW Agriculture",
    visa: "SSW",
    salary: "150,000–200,000 JPY",
    eligibility: "JLPT N4/JFT-Basic + Skill Test",
    highlights: ["Direct skilled work", "Career progression", "Overtime opportunities"],
  },
  {
    title: "SSW Caregiver",
    visa: "SSW",
    salary: "180,000–220,000 JPY",
    eligibility: "JLPT N4/JFT-Basic + Skill Test",
    highlights: ["High demand sector", "Stable long-term role", "People-focused work"],
  },
  {
    title: "TITP Construction",
    visa: "TITP",
    salary: "150,000–200,000 JPY",
    eligibility: "N5 basic Japanese; language support available",
    highlights: ["Training pathway", "Easier entry", "Future SSW conversion"],
  },
  {
    title: "TITP Automobile",
    visa: "TITP",
    salary: "200,000–250,000 JPY",
    eligibility: "Relevant experience; language support available",
    highlights: ["Hands-on training", "Structured environment", "Growth opportunity"],
  },
];

const processSteps = [
  "Consultation",
  "Language Preparation",
  "Skill Training",
  "Interview Preparation",
  "Documentation",
  "Visa Processing",
  "Japan Arrival Support",
];

export default function JapanCareerPage() {
  return (
    <section className="section-padding overflow-hidden bg-gradient-to-b from-red-50 via-white to-green-50/70">
      <div className="container-narrow space-y-10 md:space-y-16">
        <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-[radial-gradient(circle_at_top_right,#fef2f2,transparent_42%),linear-gradient(135deg,#7f1d1d_0%,#991b1b_35%,#14532d_100%)] p-6 text-white shadow-2xl md:p-10">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_0%,rgba(255,255,255,0.14)_48%,transparent_100%)] opacity-60" />
          <div className="relative z-10">
            <p className="inline-flex rounded-full border border-white/40 bg-white/15 px-4 py-1 text-xs font-semibold tracking-wider backdrop-blur-md">
              {t.badge}
            </p>
            <h1 className="mt-4 max-w-3xl text-3xl font-extrabold leading-tight md:text-5xl">{t.heroTitle}</h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-red-50 md:text-lg">{t.heroSubtitle}</p>
            <p className="mt-2 text-xs text-red-100/90">BN · EN · JA · ZH · RU · MS {t.fallbackNote}</p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {heroStats.map((stat) => (
                <div key={stat} className="rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-sm font-semibold backdrop-blur">
                  {stat}
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="bg-white text-red-700 hover:bg-red-50">
                <Link href="/contact">
                  {t.ctaConsult} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/70 bg-white/10 text-white hover:bg-white/20">
                <a href={siteConfig.whatsappHref} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  {t.ctaWhatsApp}
                </a>
              </Button>
            </div>
          </div>
        </div>

        <section className="space-y-5">
          <h2 className="text-2xl font-bold text-zinc-900 md:text-3xl">{t.supportTitle}</h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {supportCards.map((card) => {
              const Icon = card.icon;
              return (
                <Card key={card.title} className="group border-zinc-200 bg-white/90 transition-all duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-lg">
                  <CardHeader>
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-red-100 to-green-100 text-red-700 transition-transform duration-300 group-hover:scale-105">
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-xl font-bold text-zinc-900">{card.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed text-zinc-600">{card.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="space-y-5">
          <h2 className="text-2xl font-bold text-zinc-900 md:text-3xl">{t.visaTitle}</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="border-red-200 bg-gradient-to-b from-red-50 to-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl text-red-700"><BriefcaseBusiness className="h-6 w-6" />{t.sswTitle}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-zinc-700">
                <p>• Direct skilled work</p><p>• N4/JFT requirement</p><p>• Higher growth potential</p><p>• Future Type-2 pathway</p>
              </CardContent>
            </Card>
            <Card className="border-green-200 bg-gradient-to-b from-green-50 to-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl text-green-700"><GraduationCap className="h-6 w-6" />{t.titpTitle}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-zinc-700">
                <p>• Training pathway</p><p>• Easier entry</p><p>• N5 preparation</p><p>• Future SSW conversion</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="space-y-5">
          <h2 className="text-2xl font-bold text-zinc-900 md:text-3xl">{t.sswSectorsTitle}</h2>
          <div className="grid gap-4 lg:grid-cols-3">
            {sectorGroups.map((group) => (
              <Card key={group.title} className="border-zinc-200 bg-white/95">
                <CardHeader className="pb-3"><CardTitle className="text-lg text-zinc-900">{group.title}</CardTitle></CardHeader>
                <CardContent className="grid gap-2">
                  {group.items.map((sector) => {
                    const Icon = sector.icon;
                    return (
                      <div key={sector.name} className="flex items-center gap-2 rounded-lg border border-zinc-100 px-3 py-2 text-sm text-zinc-700 transition hover:-translate-y-0.5 hover:border-red-200 hover:bg-red-50/40">
                        <Icon className="h-4 w-4 text-red-600" />{sector.name}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-red-100 bg-gradient-to-br from-white via-red-50/70 to-green-50 p-6 shadow-sm md:p-8">
          <h2 className="text-2xl font-bold text-zinc-900 md:text-3xl">{t.circularTitle}</h2>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {opportunityCards.map((card) => (
              <Card key={card.title} className="group border-zinc-200 bg-white/95 transition-all hover:-translate-y-1 hover:shadow-md">
                <CardHeader className="space-y-2 pb-2">
                  <p className="inline-flex w-fit rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700">{card.visa}</p>
                  <CardTitle className="text-lg text-zinc-900">{card.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-zinc-700">
                  <p><span className="font-semibold text-zinc-900">Salary:</span> {card.salary}</p>
                  <p><span className="font-semibold text-zinc-900">Eligibility:</span> {card.eligibility}</p>
                  <ul className="space-y-1 text-zinc-600">
                    {card.highlights.map((item) => <li key={item}>• {item}</li>)}
                  </ul>
                  <Button asChild variant="outline" className="mt-1 border-red-200 text-red-700 hover:bg-red-50">
                    <Link href="/contact">Apply for this opportunity</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">{t.overtimeNote}</p>
        </section>

        <section className="space-y-5">
          <h2 className="text-2xl font-bold text-zinc-900 md:text-3xl">{t.processTitle}</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {processSteps.map((step, idx) => (
              <div key={step} className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 transition hover:-translate-y-0.5 hover:border-green-200 hover:shadow-sm">
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-green-700 text-sm font-bold text-white">{idx + 1}</span>
                <p className="text-sm font-medium text-zinc-800 md:text-base">{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-green-200 bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-2xl font-bold text-zinc-900 md:text-3xl">{t.whyTitle}</h2>
          <ul className="mt-4 grid gap-3 text-sm text-zinc-700 sm:grid-cols-2">
            <li className="rounded-lg bg-green-50 px-4 py-3">• Language + Skill + Visa integrated support</li>
            <li className="rounded-lg bg-red-50 px-4 py-3">• Japan-focused interview and communication preparation</li>
            <li className="rounded-lg bg-green-50 px-4 py-3">• Documentation clarity from start to submission</li>
            <li className="rounded-lg bg-red-50 px-4 py-3">• Long-term relationship beyond arrival in Japan</li>
          </ul>
        </section>

        <section className="rounded-3xl border border-red-200 bg-gradient-to-r from-red-700 to-green-700 p-6 text-center text-white shadow-lg md:p-9">
          <h2 className="text-2xl font-bold md:text-3xl">{t.finalTitle}</h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-red-50 md:text-base">সীমিত ব্যাচে কনসাল্টেশন চলছে — এখনই আপনার প্রোফাইল রিভিউ করে সঠিক জাপান পথ নির্বাচন করুন।</p>
          <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="bg-white text-red-700 hover:bg-red-50">
              <Link href="/contact">{t.ctaConsult} <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/70 bg-white/10 text-white hover:bg-white/20">
              <a href={siteConfig.whatsappHref} target="_blank" rel="noopener noreferrer">{t.ctaWhatsApp}</a>
            </Button>
          </div>
        </section>
      </div>
    </section>
  );
}
