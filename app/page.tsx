"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Award, BriefcaseBusiness, CheckCircle2, Globe2, GraduationCap, ShieldCheck, Sparkles, TrendingUp, Users2, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import WhatsAppFAB from "@/components/home/WhatsAppFAB";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";

const serviceLinks = ["/japanese-language", "/japan-career", "/study-abroad", "/ssw-visa"];

type StatItem = {
  icon: LucideIcon;
  value: string;
  label: string;
};

export default function HomePage() {
  const { language } = useLanguage();
  const t = translate({
    bn: {
      heroTitle: "জাপান থেকে গ্লোবাল ক্যারিয়ার: আপনার ভবিষ্যতের প্রিমিয়াম রোডম্যাপ",
      heroDesc: "KNLTC আপনাকে জাপানি ভাষা, স্টাডি, SSW/TITP ও আন্তর্জাতিক ক্যারিয়ারে ধাপে ধাপে গাইড করে—পরিকল্পনা থেকে ভিসা ও সেটেলমেন্ট পর্যন্ত।",
      consult: "ফ্রি কনসালটেশন",
      services: "প্রোগ্রাম দেখুন",
      trustTitle: "বিশ্বাসের ভিত্তি",
      servicesTitle: "আপনার লক্ষ্যভিত্তিক প্রিমিয়াম সার্ভিস",
      whyTitle: "কেন KNLTC",
      pathwayTitle: "Japan Visa Pathways",
      successTitle: "সাকসেস হাইলাইটস",
      finalTitle: "জাপান ও আন্তর্জাতিক শিক্ষার যাত্রা শুরু করুন",
      finalDesc: "একজন সিনিয়র কনসালটেন্টের সাথে ব্যক্তিগত স্ট্র্যাটেজি সেশন বুক করে আপনার স্পষ্ট পরবর্তী পদক্ষেপ জেনে নিন।",
    },
    en: {
      heroTitle: "From Japan to Global Career: Your Premium Growth Roadmap",
      heroDesc: "KNLTC guides you through Japanese language, study, SSW/TITP, and global career pathways—from planning to visa and settlement support.",
      consult: "Free Consultation",
      services: "Explore Programs",
      trustTitle: "Built on Trust",
      servicesTitle: "Premium Services Built Around Your Goal",
      whyTitle: "Why KNLTC",
      pathwayTitle: "Japan Visa Pathways",
      successTitle: "Success Highlights",
      finalTitle: "Start Your Japan & Global Education Journey",
      finalDesc: "Book a strategy session with a senior consultant and get a clear next-step plan tailored to your profile.",
    },
    ja: {
      heroTitle: "日本から世界へ。あなたの成長を導くプレミアムロードマップ",
      heroDesc: "KNLTCは日本語学習、留学、SSW/TITP、国際キャリアまで、計画からビザ・渡航後まで一貫支援します。",
      consult: "無料相談",
      services: "プログラムを見る",
      trustTitle: "信頼の実績",
      servicesTitle: "目標別プレミアムサービス",
      whyTitle: "KNLTCが選ばれる理由",
      pathwayTitle: "Japan Visa Pathways",
      successTitle: "成功事例ハイライト",
      finalTitle: "日本・国際教育への一歩を今ここから",
      finalDesc: "シニアコンサルタントとの戦略セッションで、あなたに合う次の一手を明確にします。",
    },
  }, language);

  const services = translate({
    bn: ["জাপানি ভাষা মাস্টারি", "SSW/TITP জব পাথওয়ে", "স্টাডি ইন জাপান/মালয়েশিয়া/চায়না", "ডকুমেন্ট, COE ও ইন্টারভিউ সাপোর্ট"],
    en: ["Japanese Language Mastery", "SSW/TITP Job Pathway", "Study in Japan/Malaysia/China", "Document, COE & Interview Support"],
    ja: ["日本語マスタリー", "SSW/TITP就職ルート", "日本・マレーシア・中国留学", "書類・COE・面接サポート"],
  }, language);

  const stats: StatItem[] = [
    { value: "3,200+", label: "Students Guided", icon: Users2 },
    { value: "97%", label: "Visa File Accuracy", icon: ShieldCheck },
    { value: "24/7", label: "Counsellor Support", icon: Sparkles },
    { value: "11+", label: "Partner Networks", icon: Globe2 },
  ];

  return (
    <>
      <section className="relative overflow-hidden bg-[#111827] text-white">
        <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center opacity-45" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(214,31,38,.36),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(0,153,102,.22),transparent_32%),linear-gradient(180deg,rgba(17,24,39,.55),rgba(17,24,39,.9))]" />
        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="container-narrow relative z-10 grid gap-8 py-16 md:grid-cols-2 md:items-end md:py-20 lg:py-24">
          <div>
            <span className="mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold backdrop-blur">🇯🇵 KNLTC · Japan + Global Education</span>
            <h1 className="text-balance-safe text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">{t.heroTitle}</h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/85 md:text-lg">{t.heroDesc}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild className="h-11 rounded-full bg-gradient-to-r from-[#009966] to-[#00B67A] px-7 font-semibold text-white shadow-[0_8px_24px_rgba(0,153,102,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(0,153,102,0.45)]"><Link href="/contact">{t.consult}</Link></Button>
              <Button asChild variant="outline" className="h-11 rounded-full border-[#D61F26]/70 bg-white/10 px-7 text-white hover:bg-[#D61F26]/25"><Link href="/services">{t.services}</Link></Button>
              <Button asChild className="h-11 rounded-full border border-[#D61F26]/40 bg-[#D61F26] px-7 hover:bg-[#A8141A]"><a href={siteConfig.whatsappHref} target="_blank" rel="noopener noreferrer">WhatsApp</a></Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {stats.map((item) => {
              const Icon = item.icon;
              return (
              <Card key={item.value} className="border-white/20 bg-white/10 text-white shadow-2xl backdrop-blur-md">
                <CardContent className="p-4">
                  <Icon className="mb-2 h-4 w-4 text-emerald-300" />
                  <p className="text-2xl font-bold">{item.value}</p>
                  <p className="text-white/75">{item.label}</p>
                </CardContent>
              </Card>
            )})}
          </div>
        </motion.div>
      </section>

      <section className="section-padding bg-[#F8FAFC]">
        <div className="container-narrow">
          <h2 className="text-3xl font-bold text-[#111827] md:text-4xl">{t.servicesTitle}</h2>
          <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {services.map((s, i) => (
              <Link key={s} href={serviceLinks[i]} className="group rounded-2xl border border-red-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-[#D61F26] to-[#A8141A] p-2.5 text-white">{[GraduationCap, BriefcaseBusiness, Globe2, CheckCircle2].map((I, idx) => idx===i ? <I key={idx} className="h-5 w-5"/>:null)}</div>
                <p className="min-h-16 text-lg font-semibold leading-snug text-[#111827]">{s}</p>
                <p className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#A8141A]">Explore <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-narrow grid gap-6 lg:grid-cols-3">
          {[{t:t.whyTitle,d:"Expert counsellors, transparent process, and profile-specific planning for each applicant.",i:Award},{t:t.pathwayTitle,d:"Student visa, language school, SSW, TITP, and higher-study progression mapped clearly.",i:TrendingUp},{t:t.successTitle,d:"From first consultation to arrival support—our team stays with students at every key step.",i:Users2}].map((item) => (
            <Card key={item.t} className="border-red-100 bg-gradient-to-b from-white to-red-50/30 shadow-sm">
              <CardContent className="p-6">
                <item.i className="mb-3 h-6 w-6 text-[#D61F26]" />
                <h3 className="text-xl font-semibold text-[#111827]">{item.t}</h3>
                <p className="mt-2 leading-relaxed text-slate-600">{item.d}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="section-padding bg-gradient-to-b from-white to-green-50/30 pt-0">
        <div className="container-narrow rounded-3xl border border-red-100 bg-[#111827] p-8 text-center text-white shadow-2xl">
          <h2 className="text-3xl font-bold md:text-4xl">{t.finalTitle}</h2>
          <p className="mx-auto mt-3 max-w-3xl text-white/80">{t.finalDesc}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild className="h-11 rounded-full bg-gradient-to-r from-[#009966] to-[#00B67A] px-7 font-semibold text-white shadow-[0_8px_24px_rgba(0,153,102,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(0,153,102,0.45)]"><Link href="/contact">{t.consult}</Link></Button>
            <Button asChild className="h-11 rounded-full border border-[#D61F26]/40 bg-[#D61F26] px-7 hover:bg-[#A8141A]"><a href={siteConfig.whatsappHref} target="_blank" rel="noopener noreferrer">WhatsApp</a></Button>
          </div>
        </div>
      </section>
      <WhatsAppFAB />
    </>
  );
}
