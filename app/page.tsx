"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WhatsAppFAB from "@/components/home/WhatsAppFAB";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";

const coreServiceMap = {
  bn: ["জাপানি ভাষা প্রোগ্রাম", "স্কিল ট্রেনিং", "স্টুডেন্ট ও জব ভিসা সাপোর্ট", "ইন্টারভিউ প্রিপারেশন", "ডকুমেন্টেশন সাপোর্ট", "লার্নিং রিসোর্স", "আফটার-অ্যারাইভাল সাপোর্ট"],
  en: ["Japanese Language Program", "Skill Training", "Student & Job Visa Support", "Interview Preparation", "Documentation Support", "Japanese Learning Resources", "After Arrival Support"],
  ja: ["日本語プログラム", "スキルトレーニング", "学生・就労ビザ支援", "面接対策", "書類サポート", "学習リソース", "渡航後サポート"],
};

export default function HomePage() {
  const { language } = useLanguage();
  const t = translate(
    {
      bn: {
        title: "জাপান ও আন্তর্জাতিক শিক্ষা পরামর্শ",
        desc: "জাপানি ভাষা প্রশিক্ষণ, SSW/TITP সাপোর্ট, স্টুডেন্ট ভিসা, স্কিল ডেভেলপমেন্ট ও আন্তর্জাতিক শিক্ষা গাইডলাইন।",
        freeConsultation: "ফ্রি কনসালটেশন",
        whatsapp: "হোয়াটসঅ্যাপ",
        services: "সার্ভিস দেখুন",
        cards: ["জাপানে কাজ ও ক্যারিয়ার", "স্টাডি অ্যাব্রড", "জাপানি ভাষা"],
        explorePathway: "পাথওয়ে দেখুন",
        coreServices: "মূল সেবাসমূহ",
        featuredPrograms: "ফিচার্ড প্রোগ্রাম",
        learningTitle: "জাপানি লার্নিং রিসোর্স",
        learningDesc: "আমাদের স্টোর থেকে বই ও স্টাডি টুলস এক্সপ্লোর করুন।",
        visitStore: "স্টোরে যান",
        finalTitle: "নিজের পথ বেছে নিতে প্রস্তুত?",
        finalDesc: "আমাদের কনসালটেন্টদের সাথে কথা বলে জাপান ক্যারিয়ার, ভাষা ও আন্তর্জাতিক শিক্ষার জন্য স্ট্রাকচার্ড রোডম্যাপ নিন।",
      },
      en: {
        title: "Japan & Global Education Consultancy",
        desc: "Japanese Language Training, SSW/TITP Support, Student Visa, Skill Development & International Education Guidance.",
        freeConsultation: "Free Consultation",
        whatsapp: "WhatsApp",
        services: "Explore Services",
        cards: ["Work & Career in Japan", "Study Abroad", "Japanese Language"],
        explorePathway: "Explore Pathway",
        coreServices: "Core Services",
        featuredPrograms: "Featured Programs",
        learningTitle: "Japanese Learning Resources",
        learningDesc: "Explore books and study tools from our existing store ecosystem.",
        visitStore: "Visit Store",
        finalTitle: "Ready to choose your path?",
        finalDesc: "Talk with our consultants for a structured roadmap across Japan career, language, and global education opportunities.",
      },
      ja: {
        title: "日本・海外教育コンサルティング",
        desc: "日本語トレーニング、SSW/TITP支援、学生ビザ、スキル開発、海外教育ガイダンスを提供します。",
        freeConsultation: "無料相談",
        whatsapp: "WhatsApp",
        services: "サービスを見る",
        cards: ["日本で働く・キャリア", "留学", "日本語"],
        explorePathway: "詳細を見る",
        coreServices: "主要サービス",
        featuredPrograms: "注目プログラム",
        learningTitle: "日本語学習リソース",
        learningDesc: "ストアで書籍や学習ツールをご覧ください。",
        visitStore: "ストアへ",
        finalTitle: "進路を選ぶ準備はできましたか？",
        finalDesc: "日本でのキャリア・語学・海外教育に向けたロードマップをご相談ください。",
      },
    },
    language,
  );

  const coreServices = coreServiceMap[language as "bn" | "en" | "ja"] ?? coreServiceMap.en;

  return (
    <>
      <section className="section-padding bg-gradient-to-b from-slate-900 to-slate-700 text-white">
        <div className="container-narrow">
          <h1 className="text-4xl font-bold md:text-5xl">{t.title}</h1>
          <p className="mt-4 max-w-3xl text-white/85">{t.desc}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild><Link href="/contact">{t.freeConsultation}</Link></Button>
            <Button asChild variant="outline"><a href="https://wa.me/8801313292295" target="_blank" rel="noopener noreferrer">{t.whatsapp}</a></Button>
            <Button asChild variant="secondary"><Link href="/services">{t.services}</Link></Button>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-narrow grid gap-4 md:grid-cols-3">
          {t.cards.map((name, i) => (
            <Card key={name}>
              <CardHeader><CardTitle>{name}</CardTitle></CardHeader>
              <CardContent><Button asChild><Link href={["/japan-career", "/study-abroad", "/japanese-language"][i]}>{t.explorePathway}</Link></Button></CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="section-padding pt-0"><div className="container-narrow"><h2 className="text-3xl font-bold">{t.coreServices}</h2><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{coreServices.map((item) => <Card key={item}><CardContent className="p-5 font-medium">{item}</CardContent></Card>)}</div></div></section>
      <section className="section-padding pt-0"><div className="container-narrow"><h2 className="text-3xl font-bold">{t.featuredPrograms}</h2><div className="mt-5 grid gap-4 md:grid-cols-4">{[["SSW Visa", "/ssw-visa"], ["TITP Program", "/japan-career"], ["Study in Malaysia", "/study-in-malaysia"], ["Study in China", "/study-in-china"]].map(([n, h]) => <Card key={n}><CardHeader><CardTitle>{n}</CardTitle></CardHeader><CardContent><Button asChild variant="outline"><Link href={h}>{n}</Link></Button></CardContent></Card>)}</div></div></section>
      <section className="section-padding pt-0"><div className="container-narrow rounded-2xl border bg-white p-6"><h2 className="text-3xl font-bold">{t.learningTitle}</h2><p className="mt-2 text-muted-foreground">{t.learningDesc}</p><Button asChild className="mt-4"><Link href="/store">{t.visitStore}</Link></Button></div></section>
      <section className="section-padding pt-0"><div className="container-narrow rounded-2xl border bg-white p-6 text-center"><h2 className="text-3xl font-bold">{t.finalTitle}</h2><p className="mt-2 text-muted-foreground">{t.finalDesc}</p><div className="mt-4 flex flex-wrap justify-center gap-3"><Button asChild><Link href="/contact">{t.freeConsultation}</Link></Button><Button asChild variant="outline"><a href="https://wa.me/8801313292295" target="_blank" rel="noopener noreferrer">{t.whatsapp}</a></Button></div></div></section>
      <WhatsAppFAB />
    </>
  );
}
