"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WhatsAppFAB from "@/components/home/WhatsAppFAB";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";

export default function HomePage() {
  const { language } = useLanguage();
  const t = translate({
    bn: {
      title: "জাপান ও আন্তর্জাতিক শিক্ষা পরামর্শ",
      desc: "জাপানি ভাষা, SSW/TITP সহায়তা, স্টুডেন্ট ভিসা ও ক্যারিয়ার গাইডলাইন এক জায়গায়।",
      cta: "ফ্রি কনসালটেশন",
      explore: "সার্ভিস দেখুন",
      cards: ["জাপানে কাজ ও ক্যারিয়ার", "স্টাডি অ্যাব্রড", "জাপানি ভাষা"],
      pathway: "বিস্তারিত দেখুন",
    },
    en: { title: "Japan & Global Education Consultancy", desc: "Japanese language, SSW/TITP support, student visa and career guidance in one place.", cta: "Free Consultation", explore: "Explore Services", cards: ["Work & Career in Japan", "Study Abroad", "Japanese Language"], pathway: "Explore Pathway" },
    ja: { title: "日本・海外教育コンサルティング", desc: "日本語、SSW/TITP支援、学生ビザ、キャリア相談をワンストップで。", cta: "無料相談", explore: "サービスを見る", cards: ["日本で働く・キャリア", "留学", "日本語"], pathway: "詳細を見る" },
    zh: { title: "日本与国际教育咨询", desc: "提供日语、SSW/TITP、学生签证与职业规划的一站式服务。", cta: "免费咨询", explore: "查看服务", cards: ["日本就业与职业", "海外留学", "日语学习"], pathway: "查看路径" },
    ru: { title: "Консалтинг по Японии и зарубежному обучению", desc: "Японский язык, SSW/TITP, студенческие визы и карьерное сопровождение в одном месте.", cta: "Бесплатная консультация", explore: "Наши услуги", cards: ["Работа и карьера в Японии", "Учёба за рубежом", "Японский язык"], pathway: "Подробнее" },
    ms: { title: "Perundingan Pendidikan Jepun & Global", desc: "Bahasa Jepun, sokongan SSW/TITP, visa pelajar dan panduan kerjaya di satu tempat.", cta: "Konsultasi Percuma", explore: "Lihat Servis", cards: ["Kerja & Kerjaya di Jepun", "Belajar di Luar Negara", "Bahasa Jepun"], pathway: "Lihat Laluan" },
  }, language);

  return <>
    <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="section-padding bg-gradient-to-b from-slate-900 via-slate-800 to-slate-700 text-white">
      <div className="container-narrow">
        <h1 className="text-balance-safe text-4xl font-bold md:text-5xl">{t.title}</h1>
        <p className="mt-4 max-w-3xl text-white/85">{t.desc}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild className="rounded-full px-6 shadow-lg"><Link href="/contact">{t.cta}</Link></Button>
          <Button asChild variant="secondary" className="rounded-full px-6"><Link href="/services">{t.explore}</Link></Button>
        </div>
      </div>
    </motion.section>
    <section className="section-padding pt-12"><div className="container-narrow grid gap-4 md:grid-cols-3">{t.cards.map((n, i)=><Card key={n} className="transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"><CardHeader><CardTitle>{n}</CardTitle></CardHeader><CardContent><Button asChild variant="outline"><Link href={["/japan-career","/study-abroad","/japanese-language"][i]}>{t.pathway}</Link></Button></CardContent></Card>)}</div></section>
    <WhatsAppFAB />
  </>;
}
