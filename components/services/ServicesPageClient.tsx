"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { CheckCircle2, FileCheck2, GraduationCap, Languages, MessageCircle, Plane, BriefcaseBusiness, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";


type ServiceCard = {
  id: "language" | "study" | "work" | "visa" | "interview" | "predeparture";
  icon: ComponentType<{ className?: string }>;
  title: string;
  items: string[];
};

export default function ServicesPage() {
  const { language } = useLanguage();

  const t = translate(
    {
      en: {
        badge: "KNLTC Service Hub",
        heading: "Services Designed for Your Japan Journey",
        description:
          "From language mastery to admission, career, visa, and settlement support, KNLTC provides structured and reliable guidance at every stage.",
        contact: "Free Consultation",
        whatsapp: "WhatsApp Now",
        cards: [
          {
            id: "language",
            icon: Languages,
            title: "Japanese Language Training",
            items: ["JLPT N5 to N1", "Spoken Japanese", "Hiragana, Katakana, Kanji", "Grammar, vocabulary, listening, reading", "Interview communication practice"],
          },
          {
            id: "study",
            icon: GraduationCap,
            title: "Study in Japan",
            items: ["School/program guidance", "Application support", "Document preparation", "Interview preparation", "Student visa guidance", "Pre-departure preparation"],
          },
          {
            id: "work",
            icon: BriefcaseBusiness,
            title: "Work in Japan",
            items: ["Eligibility/profile assessment", "Career pathway guidance", "Japanese workplace culture", "Interview preparation", "Documentation support", "Pre-departure guidance"],
          },
          {
            id: "visa",
            icon: FileCheck2,
            title: "Visa & Documentation",
            items: ["Document checklist", "File preparation", "Review and correction", "Submission guidance"],
          },
          {
            id: "interview",
            icon: BadgeCheck,
            title: "Interview Preparation",
            items: ["Mock interview", "CV/profile preparation", "Communication coaching", "Confidence building"],
          },
          {
            id: "predeparture",
            icon: Plane,
            title: "Pre-departure Guidance",
            items: ["Travel preparation", "Accommodation/basic living guidance", "Culture and rules", "Arrival and settlement guidance"],
          },
        ] as ServiceCard[],
      },
      bn: {
        badge: "KNLTC সার্ভিস হাব",
        heading: "আপনার জাপান যাত্রার জন্য ডিজাইন করা সেবা",
        description:
          "ভাষা দক্ষতা, ভর্তি, ক্যারিয়ার, ভিসা এবং সেটেলমেন্ট—প্রতিটি ধাপে KNLTC দেয় কাঠামোবদ্ধ ও নির্ভরযোগ্য সহায়তা।",
        contact: "ফ্রি কনসালটেশন",
        whatsapp: "হোয়াটসঅ্যাপ করুন",
        cards: [
          {
            id: "language",
            icon: Languages,
            title: "জাপানি ভাষা প্রশিক্ষণ",
            items: ["JLPT N5 থেকে N1", "স্পোকেন জাপানিজ", "হিরাগানা, কাতাকানা, কানজি", "গ্রামার, ভোকাবুলারি, লিসেনিং, রিডিং", "ইন্টারভিউ কমিউনিকেশন প্র্যাকটিস"],
          },
          {
            id: "study",
            icon: GraduationCap,
            title: "জাপানে পড়াশোনা",
            items: ["স্কুল/প্রোগ্রাম গাইডেন্স", "আবেদন সহায়তা", "ডকুমেন্ট প্রস্তুতি", "ইন্টারভিউ প্রস্তুতি", "স্টুডেন্ট ভিসা গাইডেন্স", "প্রি-ডিপার্চার প্রস্তুতি"],
          },
          {
            id: "work",
            icon: BriefcaseBusiness,
            title: "জাপানে কাজ",
            items: ["যোগ্যতা/প্রোফাইল মূল্যায়ন", "ক্যারিয়ার পথ নির্দেশনা", "জাপানি কর্মসংস্কৃতি", "ইন্টারভিউ প্রস্তুতি", "ডকুমেন্টেশন সহায়তা", "প্রি-ডিপার্চার গাইডেন্স"],
          },
          {
            id: "visa",
            icon: FileCheck2,
            title: "ভিসা ও ডকুমেন্টেশন",
            items: ["ডকুমেন্ট চেকলিস্ট", "ফাইল প্রস্তুতি", "রিভিউ ও সংশোধন", "সাবমিশন গাইডেন্স"],
          },
          {
            id: "interview",
            icon: BadgeCheck,
            title: "ইন্টারভিউ প্রস্তুতি",
            items: ["মক ইন্টারভিউ", "সিভি/প্রোফাইল প্রস্তুতি", "কমিউনিকেশন কোচিং", "আত্মবিশ্বাস বৃদ্ধি"],
          },
          {
            id: "predeparture",
            icon: Plane,
            title: "প্রি-ডিপার্চার গাইডেন্স",
            items: ["ভ্রমণ প্রস্তুতি", "আবাসন/বেসিক লিভিং গাইডেন্স", "সংস্কৃতি ও নিয়ম", "আগমন ও সেটেলমেন্ট গাইডেন্স"],
          },
        ] as ServiceCard[],
      },
      ja: {
        badge: "KNLTC サービスハブ",
        heading: "日本への挑戦を支えるサービス",
        description:
          "語学習得から進学・就職・ビザ・渡航後サポートまで、KNLTCが各段階を体系的かつ確実にサポートします。",
        contact: "無料相談",
        whatsapp: "WhatsAppで相談",
        cards: [
          {
            id: "language",
            icon: Languages,
            title: "日本語トレーニング",
            items: ["JLPT N5〜N1", "会話日本語", "ひらがな・カタカナ・漢字", "文法・語彙・聴解・読解", "面接コミュニケーション練習"],
          },
          {
            id: "study",
            icon: GraduationCap,
            title: "日本留学",
            items: ["学校/コース選定", "出願サポート", "書類準備", "面接対策", "学生ビザサポート", "渡航前準備"],
          },
          {
            id: "work",
            icon: BriefcaseBusiness,
            title: "日本就職",
            items: ["適性/プロフィール評価", "キャリアパス支援", "日本の職場文化", "面接対策", "書類作成支援", "渡航前ガイダンス"],
          },
          {
            id: "visa",
            icon: FileCheck2,
            title: "ビザ・書類サポート",
            items: ["書類チェックリスト", "申請ファイル準備", "レビューと修正", "提出ガイダンス"],
          },
          {
            id: "interview",
            icon: BadgeCheck,
            title: "面接準備",
            items: ["模擬面接", "履歴書/プロフィール作成", "コミュニケーション指導", "自信強化トレーニング"],
          },
          {
            id: "predeparture",
            icon: Plane,
            title: "渡航前ガイダンス",
            items: ["渡航準備", "住居/生活基礎ガイダンス", "文化とルール", "到着後の定着サポート"],
          },
        ] as ServiceCard[],
      },
    },
    language,
  );

  return (
    <section className="section-padding bg-gradient-to-b from-background via-background to-muted/30">
      <div className="container-narrow space-y-10 md:space-y-14">
        <div className="mx-auto max-w-4xl rounded-2xl border bg-card/90 p-6 text-center shadow-sm backdrop-blur sm:p-8 md:p-12">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent">
            <CheckCircle2 className="h-4 w-4" />
            {t.badge}
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">{t.heading}</h1>
          <p className="mx-auto mt-4 max-w-3xl text-sm text-muted-foreground sm:text-base md:text-lg">{t.description}</p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="font-semibold">
              <Link href="/contact">{t.contact}</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="font-semibold">
              <a href={siteConfig.whatsappHref} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-4 w-4" />
                {t.whatsapp}
              </a>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {t.cards.map((service) => {
            const Icon = service.icon;
            return (
              <Card id={service.id} key={service.id} className="h-full scroll-mt-28 border-border/80 bg-card/95 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <CardHeader className="space-y-3">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-xl leading-tight">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-foreground/85">
                    {service.items.map((item) => (
                      <li key={item} className="flex gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
