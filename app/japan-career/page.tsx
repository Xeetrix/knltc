import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  Fish,
  GraduationCap,
  Hammer,
  HeartHandshake,
  Hotel,
  Languages,
  Leaf,
  MessageCircle,
  Plane,
  ShieldCheck,
  Sparkles,
  Train,
  Trees,
  UtensilsCrossed,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "জাপান ক্যারিয়ার | KNLTC",
  description:
    "জাপানে কাজের জন্য KNLTC-এর ভাষা, স্কিল, ভিসা, ইন্টারভিউ, ডকুমেন্টেশন ও আফটার অ্যারাইভাল সাপোর্ট।",
};

type LangCode = "bn" | "en" | "ja" | "zh" | "ru" | "ms";
type LocalizedField = Record<LangCode, string>;

const tr = (bn: string, en?: string): LocalizedField => ({
  bn,
  en: en ?? bn,
  ja: bn,
  zh: bn,
  ru: bn,
  ms: bn,
});

const lang: LangCode = "bn";
const text = {
  heroTitle: tr("জাপানে কাজ ও ক্যারিয়ার গড়ার সম্পূর্ণ প্রস্তুতি"),
  heroSubtitle: tr(
    "ভাষা শিক্ষা, স্কিল ট্রেনিং, SSW/TITP ভিসা, ইন্টারভিউ প্রস্তুতি, ডকুমেন্টেশন ও জাপানে পৌঁছানোর পরও সাপোর্ট—সবকিছু এক জায়গায়।"
  ),
  ctaConsult: tr("ফ্রি কনসাল্টেশন", "Get Free Consultation"),
  ctaWhatsapp: tr("হোয়াটসঅ্যাপে কথা বলুন", "Talk on WhatsApp"),
  supportTitle: tr("জাপানে যাওয়ার সম্পূর্ণ সাপোর্ট সিস্টেম"),
  compareTitle: tr("SSW ও TITP: আপনার জন্য কোন পথটি উপযুক্ত?"),
  opportunityTitle: tr("বর্তমানে চলমান সুযোগসমূহ"),
  sswSectorTitle: tr("জাপানে কাজের সম্ভাব্য খাত"),
  titpSectorTitle: tr("TITP প্রোগ্রামের সম্ভাব্য খাত"),
  processTitle: tr("জাপানে কাজের প্রস্তুতি যেভাবে হবে"),
  whyTitle: tr("কেন KNLTC?"),
  finalTitle: tr("জাপানে কাজের প্রস্তুতি শুরু করতে চান?"),
  finalSubtitle: tr("আপনার যোগ্যতা অনুযায়ী সঠিক পথ বুঝতে এখনই ফ্রি কনসাল্টেশন নিন।"),
};

const supportCards = [
  {
    title: "ভাষা প্রস্তুতি",
    description:
      "জাপান যাওয়ার জন্য ভাষা শেখা সবচেয়ে গুরুত্বপূর্ণ। KNLTC অল্প সময়ের মধ্যে N5 ও N4 সম্পন্ন করিয়ে পরবর্তী ধাপে এগিয়ে নিতে সাহায্য করে।",
    icon: Languages,
  },
  {
    title: "স্কিল ট্রেইনিং",
    description:
      "জাপানে যেসব স্কিলের ওপর কর্মী নেওয়া হয়, সেসব বিষয়ে ট্রেইনিং ও স্কিল টেস্ট প্রস্তুতিতে সহায়তা করা হয়।",
    icon: Hammer,
  },
  {
    title: "ভিসা সাপোর্ট",
    description: "Student Visa, SSW এবং TITP ভিসার জন্য গাইডলাইন ও প্রসেসিং সাপোর্ট দেওয়া হয়।",
    icon: ShieldCheck,
  },
  {
    title: "ইন্টারভিউ প্রস্তুতি",
    description:
      "জাপানে চাকরি পাওয়ার জন্য ইন্টারভিউ প্রস্তুতি, মক ইন্টারভিউ ও কমিউনিকেশন গাইডলাইন দেওয়া হয়।",
    icon: CheckCircle2,
  },
  {
    title: "ডকুমেন্টেশন",
    description: "CV/Resume, ব্যাংক স্টেটমেন্ট, সার্টিফিকেট ও প্রয়োজনীয় ফাইল প্রস্তুতিতে সহায়তা।",
    icon: BookOpen,
  },
  {
    title: "ভিসা প্রসেসিং",
    description: "SSW ও TITP ভিসার জন্য ধাপে ধাপে প্রসেসিং, ফর্ম ফিলআপ ও প্রয়োজনীয় গাইডলাইন দেওয়া হয়।",
    icon: FileCheck2,
  },
  {
    title: "জাপানে পৌঁছানোর পর সাপোর্ট",
    description: "জাপানে পৌঁছানোর পরও প্রয়োজনীয় খোঁজখবর ও গাইডলাইন দেওয়ার চেষ্টা করা হয়।",
    icon: HeartHandshake,
  },
  {
    title: "আফটার অ্যারাইভাল সাপোর্ট",
    description: "জাপানে পৌঁছানোর পর বাসস্থান, কাগজপত্র ও দৈনন্দিন সেটআপ বিষয়ে ফলো-আপ সাপোর্ট দেওয়া হয়।",
    icon: Sparkles,
  },
];

const opportunities = [
  ["SSW Agriculture", "SSW", "১৫০,০০০ – ২০০,০০০ ইয়েন", ["JLPT N4 অথবা JFT-Basic", "Skill Test Certificate"]],
  ["SSW Caregiver", "SSW", "১৮০,০০০ – ২২০,০০০ ইয়েন", ["JLPT N4 অথবা JFT-Basic", "Skill Test Certificate"]],
  ["TITP Construction", "TITP", "১৫০,০০০ – ২০০,০০০ ইয়েন", ["N5 লেভেলের জাপানি ভাষা থাকলে ভালো", "প্রয়োজন হলে ভাষা শেখানো যায়"]],
  ["TITP Automobile", "TITP", "২০০,০০০ – ২৫০,০০০ ইয়েন", ["সংশ্লিষ্ট কাজের অভিজ্ঞতা থাকলে আবেদন করা যায়", "প্রয়োজনীয় ভাষা শেখানো যায়"]],
  ["TITP Welding", "TITP", "২০০,০০০ – ২৫০,০০০ ইয়েন", ["সংশ্লিষ্ট কাজের অভিজ্ঞতা থাকলে আবেদন করা যায়।", "প্রাথমিকভাবে ভাষা না জানলেও চলবে।", "প্রয়োজনীয় ভাষা শিখিয়ে নেওয়া হবে।"]],
] as const;

const sswSectors = [
  ["নার্সিং কেয়ার", HeartHandshake],
  ["বিল্ডিং ক্লিনিং", Sparkles],
  ["ম্যানুফ্যাকচারিং", Wrench],
  ["নির্মাণ শিল্প", Building2],
  ["জাহাজ নির্মাণ", Hammer],
  ["অটোমোবাইল মেরামত", Wrench],
  ["বিমান শিল্প", Plane],
  ["হোটেল/আবাসন", Hotel],
  ["কৃষি", Leaf],
  ["মৎস্য", Fish],
  ["খাদ্য ও পানীয় প্রস্তুতকরণ", UtensilsCrossed],
  ["রেস্টুরেন্ট/ফুড সার্ভিস", UtensilsCrossed],
  ["অটোমোবাইল পরিবহন", BriefcaseBusiness],
  ["রেলওয়ে", Train],
  ["বনায়ন", Trees],
  ["কাঠ শিল্প", Hammer],
] as const;

const titpSectors = ["কৃষি ও খামার", "নির্মাণ খাত", "উৎপাদন ও কারখানা", "টেক্সটাইল ও পোশাক", "মৎস্য শিল্প", "ওয়েল্ডিং", "অটোমোবাইল"];

const processSteps = [
  "ফ্রি কনসাল্টেশন",
  "ভাষা প্রস্তুতি",
  "স্কিল ট্রেইনিং",
  "ইন্টারভিউ প্রিপারেশন",
  "ডকুমেন্টেশন",
  "ভিসা প্রসেসিং",
  "জাপানে পৌঁছানোর পর সাপোর্ট",
];

export default function JapanCareerPage() {
  return (
    <main className="section-padding overflow-hidden bg-gradient-to-b from-red-50 via-white to-green-50">
      <div className="container-narrow space-y-8 md:space-y-14">
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-700 via-red-600 to-green-700 p-6 text-white shadow-2xl md:p-10">
          <div className="absolute -right-16 top-0 h-44 w-44 rounded-full bg-white/20 blur-2xl" />
          <div className="absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-green-200/30 blur-xl" />
          <div className="relative z-10 max-w-3xl">
            <p className="inline-flex rounded-full border border-white/40 bg-white/15 px-4 py-1 text-xs font-semibold">BN · EN · JA · ZH · RU · MS</p>
            <h1 className="mt-4 text-3xl font-black leading-tight md:text-5xl">{text.heroTitle[lang]}</h1>
            <p className="mt-4 text-sm leading-relaxed text-red-50 md:text-lg">{text.heroSubtitle[lang]}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="bg-white text-red-700 hover:bg-red-50">
                <Link href="/contact">{text.ctaConsult[lang]} <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white bg-white/10 text-white hover:bg-white/20">
                <a href={siteConfig.whatsappHref} target="_blank" rel="noopener noreferrer"><MessageCircle className="mr-2 h-4 w-4" />{text.ctaWhatsapp[lang]}</a>
              </Button>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold md:text-3xl">{text.supportTitle[lang]}</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {supportCards.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.title} className="group rounded-2xl border-0 bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <CardHeader>
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-red-100 to-green-100 text-red-600"><Icon className="h-5 w-5" /></div>
                    <CardTitle>{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm leading-relaxed text-zinc-700">{item.description}</CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold md:text-3xl">{text.compareTitle[lang]}</h2>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <Card className="rounded-2xl border-red-200 bg-red-50/60 shadow-sm">
              <CardHeader><CardTitle className="flex items-center gap-2 text-red-700"><BriefcaseBusiness className="h-5 w-5" />SSW (Specified Skilled Worker)</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-zinc-800">
                  <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />JLPT N4 অথবা JFT-Basic প্রয়োজন</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />সংশ্লিষ্ট স্কিল টেস্ট পাস করতে হয়</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />সরাসরি দক্ষ কর্মী হিসেবে কাজের সুযোগ</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />Type 1 থেকে ভবিষ্যতে Type 2-এ যাওয়ার সম্ভাবনা</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border-green-200 bg-green-50/70 shadow-sm">
              <CardHeader><CardTitle className="flex items-center gap-2 text-green-700"><GraduationCap className="h-5 w-5" />TITP (Technical Intern Training Program)</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-zinc-800">
                  <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-700" />প্রশিক্ষণভিত্তিক কর্মপথ</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-700" />N5 লেভেলের ভাষা প্রস্তুতি থাকলে ভালো</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-700" />৩ থেকে ৫ বছরের সুযোগ</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-700" />ভবিষ্যতে SSW-তে যাওয়ার সম্ভাবনা</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="rounded-3xl border border-red-100 bg-white p-6 shadow-lg md:p-8">
          <h2 className="text-2xl font-bold md:text-3xl">{text.opportunityTitle[lang]}</h2>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {opportunities.map(([title, visa, salary, eligibility]) => (
              <Card key={title} className="group rounded-2xl border border-zinc-200 bg-white transition hover:-translate-y-1 hover:shadow-lg">
                <CardHeader className="space-y-2">
                  <div className="flex flex-wrap gap-2 text-xs font-semibold"><span className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-red-700">ভিসা: {visa}</span><span className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-green-700">বেতন: {salary}</span></div>
                  <CardTitle className="text-lg">{title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-3">
                    <p className="mb-2 text-sm font-semibold text-zinc-900">যোগ্যতা</p>
                    <ul className="space-y-1.5 text-sm text-zinc-700">{eligibility.map((line) => <li key={line} className="flex items-start gap-2"><ClipboardCheck className="mt-0.5 h-4 w-4 shrink-0 text-green-700" />{line}</li>)}</ul>
                  </div>
                  <Button asChild className="w-full bg-red-600 text-white hover:bg-red-700"><Link href="/contact">এই সুযোগে আবেদন করুন</Link></Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="mt-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">ওভারটাইমের সুযোগ থাকতে পারে। ভাষা ও কাজে দক্ষতা বাড়লে আয়ও বাড়তে পারে।</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold md:text-3xl">{text.sswSectorTitle[lang]}</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {sswSectors.map(([name, Icon]) => (
              <div key={name} className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-3 text-sm shadow-sm transition hover:-translate-y-0.5 hover:border-red-200">
                <Icon className="h-4 w-4 text-red-600" />{name}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold md:text-3xl">{text.titpSectorTitle[lang]}</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {titpSectors.map((name) => (
              <Card key={name} className="rounded-xl border-green-100 bg-green-50/50 text-center shadow-sm"><CardContent className="py-6 text-sm font-semibold text-zinc-800">{name}</CardContent></Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold md:text-3xl">{text.processTitle[lang]}</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {processSteps.map((step, i) => (
              <div key={step} className="flex items-center gap-3 rounded-xl border bg-white px-4 py-3 shadow-sm"><span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-green-700 text-sm font-bold text-white">{i + 1}</span><span className="text-sm font-medium">{step}</span></div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold md:text-3xl">{text.whyTitle[lang]}</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {["ভাষা + স্কিল + ভিসা একসাথে", "বাস্তব জাপান-কেন্দ্রিক গাইডলাইন", "ইন্টারভিউ প্রস্তুতি", "ডকুমেন্টেশন সাপোর্ট", "জাপানে পৌঁছানোর পরও সম্পর্ক বজায় রাখার চেষ্টা"].map((point) => (
              <div key={point} className="rounded-xl border border-zinc-200 bg-white px-4 py-4 text-sm shadow-sm">{point}</div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-gradient-to-r from-red-700 to-green-700 p-7 text-center text-white shadow-xl">
          <h2 className="text-2xl font-bold md:text-3xl">{text.finalTitle[lang]}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm md:text-base">{text.finalSubtitle[lang]}</p>
          <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="bg-white text-red-700 hover:bg-red-50"><Link href="/contact">{text.ctaConsult[lang]} <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
            <Button asChild size="lg" variant="outline" className="border-white/70 bg-white/10 text-white hover:bg-white/20"><a href={siteConfig.whatsappHref} target="_blank" rel="noopener noreferrer">{text.ctaWhatsapp[lang]}</a></Button>
          </div>
        </section>
      </div>
    </main>
  );
}
