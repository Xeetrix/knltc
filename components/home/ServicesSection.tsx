"use client";

import { motion } from "framer-motion";
import { Languages, Briefcase, Mic, Building2, FileCheck, Plane, MapPin, House } from "lucide-react";
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
    { icon: House, title: "Residency Guidance", desc: "We guide you through residence registration, local procedures, and settling in smoothly." },
  ],
  bn: [
    { icon: Languages, title: "জাপানি ভাষা প্রশিক্ষণ", desc: "বিশেষজ্ঞ শিক্ষকের মাধ্যমে N5 থেকে N1 পর্যন্ত JLPT কোর্স।" },
    { icon: Briefcase, title: "জাপান চাকরি প্রস্তুতি", desc: "সিভি প্রস্তুতি, স্কিল মূল্যায়ন ও ক্যারিয়ার কাউন্সেলিং।" },
    { icon: Mic, title: "ইন্টারভিউ প্রস্তুতি", desc: "মক ইন্টারভিউ, কালচারাল কোচিং ও আত্মবিশ্বাস বৃদ্ধি।" },
    { icon: Building2, title: "চাকরি প্লেসমেন্ট সাপোর্ট", desc: "এমপ্লয়ার অ্যাপ্লিকেশন সাপোর্ট ও রোল-ম্যাচিং গাইড।" },
    { icon: FileCheck, title: "ভিসা প্রসেসিং সাপোর্ট", desc: "সম্পূর্ণ ডকুমেন্টেশন ও আবেদন সহায়তা।" },
    { icon: Plane, title: "প্রি-ডিপার্চার গাইডেন্স", desc: "আবাসন, ভ্রমণ, বীমা ও সাংস্কৃতিক ওরিয়েন্টেশন।" },
    { icon: MapPin, title: "জাপানে পৌঁছানোর পর সাপোর্ট", desc: "আগমনের পরিকল্পনা, ওরিয়েন্টেশন ও চলমান সহায়তা।" },
    { icon: House, title: "রেসিডেন্সি গাইডেন্স", desc: "রেসিডেন্সি পেতে প্রয়োজনীয় ধাপ, স্থানীয় প্রক্রিয়া ও সেটেলমেন্টে আমরা সুন্দরভাবে গাইড করব।" },
  ],
  ja: [
    { icon: Languages, title: "日本語トレーニング", desc: "N5からN1までのJLPTコースを提供。" },
    { icon: Briefcase, title: "就職準備", desc: "履歴書作成、スキル評価、キャリア相談。" },
    { icon: Mic, title: "面接対策", desc: "模擬面接、文化理解、自己表現の強化。" },
    { icon: Building2, title: "就職サポート", desc: "応募支援と職種マッチングの案内。" },
    { icon: FileCheck, title: "ビザ申請サポート", desc: "必要書類と申請手続きを全面支援。" },
    { icon: Plane, title: "渡航前ガイダンス", desc: "住居、渡航、保険、生活オリエンテーション。" },
    { icon: MapPin, title: "来日後サポート", desc: "到着後の計画、案内、継続支援。" },
    { icon: House, title: "居住サポート", desc: "在留手続きや地域での生活開始まで、分かりやすく丁寧にご案内します。" },
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
    <section id="services" className="section-padding">
      <div className="container-narrow">
        <div className="mb-10 text-center sm:mb-14">
          <h2 className="mb-4 text-2xl font-extrabold text-foreground sm:text-3xl md:text-4xl">{t.title}</h2>
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base">{t.desc}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((svc, i) => (
            <motion.div
              key={svc.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="group rounded-lg border bg-card p-5 transition-shadow hover:shadow-md sm:p-6"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20 sm:h-12 sm:w-12">
                <svc.icon className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
              </div>
              <h3 className="mb-2 text-base font-bold text-foreground sm:text-lg">{svc.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{svc.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
