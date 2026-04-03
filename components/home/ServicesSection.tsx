"use client";

import { motion } from "framer-motion";
import { Languages, Briefcase, Mic, Building2, FileCheck, Plane, MapPin } from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";

const services = {
  en: [
    { icon: Languages, title: "Japanese Language Training", desc: "Structured JLPT courses from N5 to N1 with expert instructors." },
    { icon: Briefcase, title: "Japan Job Preparation", desc: "Resume building, skill assessment, and career counseling for Japan." },
    { icon: Mic, title: "Interview Preparation", desc: "Mock interviews, cultural coaching, and confidence building." },
    { icon: Building2, title: "Job Placement Support", desc: "Employer-facing application support and role matching guidance." },
    { icon: FileCheck, title: "Visa Processing Support", desc: "Complete documentation and application assistance." },
    { icon: Plane, title: "Pre-Departure Guidance", desc: "Accommodation, travel, insurance, and cultural orientation." },
    { icon: MapPin, title: "Japan Arrival Support", desc: "Arrival planning, orientation, and ongoing support guidance." },
  ],
  bn: [
    { icon: Languages, title: "জাপানি ভাষা প্রশিক্ষণ", desc: "বিশেষজ্ঞ শিক্ষকের মাধ্যমে N5 থেকে N1 পর্যন্ত JLPT কোর্স।" },
    { icon: Briefcase, title: "জাপান চাকরি প্রস্তুতি", desc: "সিভি প্রস্তুতি, স্কিল মূল্যায়ন ও ক্যারিয়ার কাউন্সেলিং।" },
    { icon: Mic, title: "ইন্টারভিউ প্রস্তুতি", desc: "মক ইন্টারভিউ, কালচারাল কোচিং ও আত্মবিশ্বাস বৃদ্ধি।" },
    { icon: Building2, title: "চাকরি প্লেসমেন্ট সাপোর্ট", desc: "এমপ্লয়ার অ্যাপ্লিকেশন সাপোর্ট ও রোল-ম্যাচিং গাইড।" },
    { icon: FileCheck, title: "ভিসা প্রসেসিং সাপোর্ট", desc: "সম্পূর্ণ ডকুমেন্টেশন ও আবেদন সহায়তা।" },
    { icon: Plane, title: "প্রি-ডিপার্চার গাইডেন্স", desc: "আবাসন, ভ্রমণ, বীমা ও সাংস্কৃতিক ওরিয়েন্টেশন।" },
    { icon: MapPin, title: "জাপানে পৌঁছানোর পর সাপোর্ট", desc: "আগমনের পরিকল্পনা, ওরিয়েন্টেশন ও চলমান সহায়তা।" },
  ],
  ja: [
    { icon: Languages, title: "日本語トレーニング", desc: "N5からN1までのJLPTコースを提供。" },
    { icon: Briefcase, title: "就職準備", desc: "履歴書作成、スキル評価、キャリア相談。" },
    { icon: Mic, title: "面接対策", desc: "模擬面接、文化理解、自己表現の強化。" },
    { icon: Building2, title: "就職サポート", desc: "応募支援と職種マッチングの案内。" },
    { icon: FileCheck, title: "ビザ申請サポート", desc: "必要書類と申請手続きを全面支援。" },
    { icon: Plane, title: "渡航前ガイダンス", desc: "住居、渡航、保険、生活オリエンテーション。" },
    { icon: MapPin, title: "来日後サポート", desc: "到着後の計画、案内、継続支援。" },
  ],
} as const;

const heading = {
  en: { title: "Our Services", desc: "End-to-end support from your first consultation to your first day in Japan." },
  bn: { title: "আমাদের সেবা", desc: "প্রথম পরামর্শ থেকে জাপানে প্রথম দিন পর্যন্ত পূর্ণাঙ্গ সহায়তা।" },
  ja: { title: "サービス", desc: "初回相談から来日後まで一貫してサポートします。" },
} as const;

const ServicesSection = () => {
  const { language } = useLanguage();
  const list = services[language];
  const t = heading[language];
  return (
    <section id="services" className="section-padding"><div className="container-narrow"><div className="text-center mb-14"><h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">{t.title}</h2><p className="text-muted-foreground max-w-2xl mx-auto">{t.desc}</p></div><div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">{list.map((svc, i) => (<motion.div key={svc.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }} className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow group"><div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors"><svc.icon className="h-6 w-6 text-primary" /></div><h3 className="font-bold text-foreground mb-2">{svc.title}</h3><p className="text-sm text-muted-foreground leading-relaxed">{svc.desc}</p></motion.div>))}</div></div></section>
  );
};

export default ServicesSection;
