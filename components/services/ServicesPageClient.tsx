"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { CheckCircle2, FileCheck2, GraduationCap, Languages, MessageCircle, Plane, BriefcaseBusiness, BadgeCheck, BookOpenText, ArrowRight, Sparkles, ShieldCheck, Handshake, BookCopy, PencilRuler } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";

type ServiceCard = {
  id: "language" | "study" | "work" | "visa" | "interview" | "pre-departure";
  icon: ComponentType<{ className?: string }>;
  title: string;
  items: string[];
};

type DecisionCard = {
  icon: string;
  title: string;
  description: string;
  target: "study" | "work" | "language";
};

type ResourceCard = {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
};

export default function ServicesPage() {
  const { language } = useLanguage();

  const t = translate(
    {
      en: {
        heroTitle: "Start your Japan journey with the right guidance",
        heroDescription: "Language, study, work, visa, and learning resources—all your support in one place.",
        contact: "Free Consultation",
        whatsapp: "Talk on WhatsApp",
        decisionTitle: "What do you want to do?",
        decisionCards: [
          { icon: "🎓", title: "Study in Japan", description: "Get complete guidance from course selection to visa prep.", target: "study" },
          { icon: "💼", title: "Work in Japan", description: "Build your profile and prepare for Japan career pathways.", target: "work" },
          { icon: "📚", title: "Learn Japanese Language", description: "Start structured JLPT-focused language training.", target: "language" },
        ] as DecisionCard[],
        servicesTitle: "KNLTC Service Hub",
        servicesDescription: "Premium support services designed to guide you step by step.",
        cards: [
          { id: "language", icon: Languages, title: "Japanese Language Training", items: ["JLPT N5 to N1", "Spoken Japanese", "Hiragana, Katakana, Kanji", "Grammar, vocabulary, listening, reading", "Interview communication practice"] },
          { id: "study", icon: GraduationCap, title: "Study in Japan", items: ["School/program guidance", "Application support", "Document preparation", "Interview preparation", "Student visa guidance", "Pre-departure preparation"] },
          { id: "work", icon: BriefcaseBusiness, title: "Work in Japan", items: ["Eligibility/profile assessment", "Career pathway guidance", "Japanese workplace culture", "Interview preparation", "Documentation support", "Pre-departure guidance"] },
          { id: "visa", icon: FileCheck2, title: "Visa & Documentation", items: ["Document checklist", "File preparation", "Review and correction", "Submission guidance"] },
          { id: "interview", icon: BadgeCheck, title: "Interview & Career Preparation", items: ["Mock interview", "CV/profile preparation", "Communication coaching", "Confidence building"] },
          { id: "pre-departure", icon: Plane, title: "Pre-departure & Japan Life Guidance", items: ["Travel preparation", "Accommodation/basic living guidance", "Culture and rules", "Arrival and settlement guidance"] },
        ] as ServiceCard[],
        resourcesTitle: "Learning Resources",
        resourcesDescription: "Collect curated books and materials aligned with our courses and JLPT preparation.",
        resources: [
          { icon: BookOpenText, title: "JLPT N5 Books", description: "Beginner grammar, vocabulary, and practice materials." },
          { icon: BookCopy, title: "JLPT N4 Books", description: "Level-up resources for reading, listening, and tests." },
          { icon: PencilRuler, title: "Learning Accessories", description: "Useful tools and stationery for consistent study." },
        ] as ResourceCard[],
        viewBooks: "View Books",
        viewAllBooks: "Browse All Books",
        trustTitle: "We do more than guide—you get real support at every preparation step.",
        trustPoints: ["Transparent guidance", "Step-by-step preparation", "Practical support"],
        finalTitle: "Ready to start your Japan journey?",
        finalDescription: "Get free counseling now to choose the right path for your goals.",
      },
      bn: {
        heroTitle: "আপনার জাপান যাত্রা শুরু হোক সঠিক গাইডলাইন দিয়ে",
        heroDescription: "ভাষা, পড়াশোনা, কাজ, ভিসা ও শেখার উপকরণ—সবকিছুর জন্য এক জায়গায় সম্পূর্ণ সহায়তা।",
        contact: "ফ্রি কাউন্সেলিং নিন",
        whatsapp: "হোয়াটসঅ্যাপে কথা বলুন",
        decisionTitle: "আপনি কী করতে চান?",
        decisionCards: [
          { icon: "🎓", title: "জাপানে পড়াশোনা", description: "কোর্স নির্বাচন থেকে ভিসা পর্যন্ত সম্পূর্ণ সহায়তা নিন।", target: "study" },
          { icon: "💼", title: "জাপানে কাজ", description: "ক্যারিয়ার পরিকল্পনা ও প্রোফাইল প্রস্তুতিতে গাইডেন্স পান।", target: "work" },
          { icon: "📚", title: "জাপানি ভাষা শিখতে চাই", description: "JLPT-কেন্দ্রিক কাঠামোবদ্ধ ভাষা প্রশিক্ষণ শুরু করুন।", target: "language" },
        ] as DecisionCard[],
        servicesTitle: "KNLTC সার্ভিস হাব",
        servicesDescription: "ধাপে ধাপে প্রস্তুতির জন্য প্রিমিয়াম ও নির্ভরযোগ্য সার্ভিস।",
        cards: [
          { id: "language", icon: Languages, title: "জাপানি ভাষা প্রশিক্ষণ", items: ["JLPT N5 থেকে N1", "Spoken Japanese", "Hiragana, Katakana, Kanji", "Grammar, vocabulary, listening, reading", "Interview communication practice"] },
          { id: "study", icon: GraduationCap, title: "জাপানে পড়াশোনা", items: ["School/program guidance", "Application support", "Document preparation", "Interview preparation", "Student visa guidance", "Pre-departure preparation"] },
          { id: "work", icon: BriefcaseBusiness, title: "জাপানে কাজ", items: ["Eligibility/profile assessment", "Career pathway guidance", "Japanese workplace culture", "Interview preparation", "Documentation support", "Pre-departure guidance"] },
          { id: "visa", icon: FileCheck2, title: "ভিসা ও ডকুমেন্টেশন", items: ["Document checklist", "File preparation", "Review and correction", "Submission guidance"] },
          { id: "interview", icon: BadgeCheck, title: "ইন্টারভিউ ও ক্যারিয়ার প্রস্তুতি", items: ["Mock interview", "CV/profile preparation", "Communication coaching", "Confidence building"] },
          { id: "pre-departure", icon: Plane, title: "প্রি-ডিপার্চার ও জাপান লাইফ গাইডেন্স", items: ["Travel preparation", "Accommodation/basic living guidance", "Culture and rules", "Arrival and settlement guidance"] },
        ] as ServiceCard[],
        resourcesTitle: "শেখার উপকরণ",
        resourcesDescription: "আমাদের কোর্স ও JLPT প্রস্তুতির সাথে সামঞ্জস্যপূর্ণ নির্বাচিত বই ও উপকরণ এখন সহজেই সংগ্রহ করুন।",
        resources: [
          { icon: BookOpenText, title: "JLPT N5 Books", description: "বেসিক গ্রামার, ভোকাবুলারি ও প্র্যাকটিস বই।" },
          { icon: BookCopy, title: "JLPT N4 Books", description: "পরবর্তী ধাপের রিডিং, লিসেনিং ও টেস্ট প্রস্তুতি।" },
          { icon: PencilRuler, title: "Learning Accessories", description: "নিয়মিত শেখার জন্য প্রয়োজনীয় স্টাডি টুলস।" },
        ] as ResourceCard[],
        viewBooks: "বই দেখুন",
        viewAllBooks: "সব বই দেখুন",
        trustTitle: "আমরা শুধু গাইড করি না—আপনার প্রস্তুতির প্রতিটি ধাপে পাশে থাকি।",
        trustPoints: ["স্বচ্ছ গাইডলাইন", "ধাপে ধাপে প্রস্তুতি", "বাস্তব সাপোর্ট"],
        finalTitle: "আপনার জাপান যাত্রা শুরু করতে প্রস্তুত?",
        finalDescription: "আপনার লক্ষ্য অনুযায়ী সঠিক পথ বুঝতে এখনই ফ্রি কাউন্সেলিং নিন।",
      },
      ja: {
        heroTitle: "正しいガイドラインで、日本への一歩を始めましょう",
        heroDescription: "語学・留学・就職・ビザ・学習リソースまで、必要なサポートを一つの場所で。",
        contact: "無料カウンセリング",
        whatsapp: "WhatsAppで相談",
        decisionTitle: "何を始めたいですか？",
        decisionCards: [
          { icon: "🎓", title: "日本へ留学したい", description: "コース選定からビザ準備まで総合サポート。", target: "study" },
          { icon: "💼", title: "日本で働きたい", description: "キャリア準備と応募対策を体系的に支援。", target: "work" },
          { icon: "📚", title: "日本語を学びたい", description: "JLPT中心の段階的トレーニングを提供。", target: "language" },
        ] as DecisionCard[],
        servicesTitle: "KNLTC サービスハブ",
        servicesDescription: "目標達成に向けた、段階的で実践的なプレミアム支援。",
        cards: [
          { id: "language", icon: Languages, title: "日本語トレーニング", items: ["JLPT N5〜N1", "会話日本語", "ひらがな・カタカナ・漢字", "文法・語彙・聴解・読解", "面接コミュニケーション練習"] },
          { id: "study", icon: GraduationCap, title: "日本留学", items: ["学校/コース選定", "出願サポート", "書類準備", "面接対策", "学生ビザサポート", "渡航前準備"] },
          { id: "work", icon: BriefcaseBusiness, title: "日本就職", items: ["適性/プロフィール評価", "キャリアパス支援", "日本の職場文化", "面接対策", "書類作成支援", "渡航前ガイダンス"] },
          { id: "visa", icon: FileCheck2, title: "ビザ・書類サポート", items: ["書類チェックリスト", "申請ファイル準備", "レビューと修正", "提出ガイダンス"] },
          { id: "interview", icon: BadgeCheck, title: "面接・キャリア準備", items: ["模擬面接", "履歴書/プロフィール作成", "コミュニケーション指導", "自信強化トレーニング"] },
          { id: "pre-departure", icon: Plane, title: "渡航前・日本生活ガイダンス", items: ["渡航準備", "住居/生活基礎ガイダンス", "文化とルール", "到着後の定着サポート"] },
        ] as ServiceCard[],
        resourcesTitle: "学習リソース",
        resourcesDescription: "コースとJLPT対策に連動した書籍・学習教材を手軽に確認できます。",
        resources: [
          { icon: BookOpenText, title: "JLPT N5 Books", description: "初級文法・語彙・演習用リソース。" },
          { icon: BookCopy, title: "JLPT N4 Books", description: "読解・聴解・模試対策の中級手前教材。" },
          { icon: PencilRuler, title: "Learning Accessories", description: "学習習慣を支える補助アイテム。" },
        ] as ResourceCard[],
        viewBooks: "書籍を見る",
        viewAllBooks: "すべての書籍を見る",
        trustTitle: "ガイドだけでなく、準備の各ステップで伴走します。",
        trustPoints: ["明確なガイドライン", "段階的な準備", "実践的サポート"],
        finalTitle: "日本への挑戦を始める準備はできましたか？",
        finalDescription: "目標に合う最適なルートを、無料相談で一緒に見つけましょう。",
      },
    },
    language,
  );

  return (
    <section className="section-padding bg-gradient-to-b from-emerald-50/40 via-background to-rose-50/30">
      <div className="container-narrow space-y-8 md:space-y-12">
        <div className="mx-auto max-w-4xl rounded-2xl border border-emerald-100 bg-white p-6 text-center shadow-[0_12px_35px_-22px_rgba(16,185,129,0.75)] sm:p-8">
          <p className="mx-auto mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-700">
            <Sparkles className="h-4 w-4" /> KNLTC Service Hub
          </p>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl md:text-4xl">{t.heroTitle}</h1>
          <p className="mx-auto mt-3 max-w-3xl text-sm text-muted-foreground sm:text-base">{t.heroDescription}</p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="bg-emerald-600 font-semibold text-white hover:bg-emerald-700">
              <Link href="/contact">{t.contact}</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-emerald-300 font-semibold text-emerald-700 hover:bg-emerald-50">
              <a href={siteConfig.whatsappHref} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-4 w-4" />
                {t.whatsapp}
              </a>
            </Button>
          </div>
        </div>


        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {[['Japan Career','/japan-career'],['Study Abroad','/study-abroad'],['Japanese Language','/japanese-language'],['Store','/store'],['Contact','/contact']].map(([name, href]) => (
            <Card key={name} className="border-emerald-100 bg-white">
              <CardHeader><CardTitle className="text-lg">{name}</CardTitle></CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full"><Link href={href}>Open</Link></Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          <h2 className="text-center text-2xl font-bold tracking-tight">{t.decisionTitle}</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {t.decisionCards.map((item) => (
              <a key={item.target} href={`#${item.target}`} className="group rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <p className="text-2xl">{item.icon}</p>
                <h3 className="mt-3 text-lg font-semibold">{item.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
              </a>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight">{t.servicesTitle}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{t.servicesDescription}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {t.cards.map((service) => {
              const Icon = service.icon;
              return (
                <Card id={service.id} key={service.id} className="h-full scroll-mt-28 border-border/80 bg-white shadow-[0_16px_40px_-28px_rgba(15,23,42,0.55)] transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg">
                  <CardHeader className="space-y-3">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-rose-100 text-emerald-700">
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl leading-tight">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-foreground/85">
                      {service.items.map((item) => (
                        <li key={item} className="flex gap-2">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
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

        <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-2xl font-bold tracking-tight">{t.resourcesTitle}</h2>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">{t.resourcesDescription}</p>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {t.resources.map((resource) => {
              const Icon = resource.icon;
              return (
                <Card key={resource.title} className="border-emerald-100 bg-emerald-50/30 shadow-sm">
                  <CardHeader>
                    <div className="mb-1 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white text-emerald-700 shadow-sm">
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{resource.description}</p>
                    <Button asChild variant="link" className="mt-2 h-auto p-0 font-semibold text-emerald-700">
                      <Link href="/store">{t.viewBooks} <ArrowRight className="ml-1 h-4 w-4" /></Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <Button asChild className="mt-6 bg-emerald-600 text-white hover:bg-emerald-700">
            <Link href="/store">{t.viewAllBooks}</Link>
          </Button>
        </div>

        <div className="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm">
          <p className="text-center text-lg font-semibold">{t.trustTitle}</p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {[ShieldCheck, CheckCircle2, Handshake].map((Icon, index) => (
              <div key={t.trustPoints[index]} className="flex items-center gap-2 rounded-xl border border-rose-100 bg-rose-50/40 px-3 py-2 text-sm font-medium">
                <Icon className="h-4 w-4 text-rose-500" />
                <span>{t.trustPoints[index]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-white p-6 text-center shadow-sm md:p-8">
          <h2 className="text-2xl font-bold tracking-tight">{t.finalTitle}</h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground">{t.finalDescription}</p>
          <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="bg-emerald-600 font-semibold text-white hover:bg-emerald-700">
              <Link href="/contact">{t.contact}</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-emerald-300 font-semibold text-emerald-700 hover:bg-emerald-50">
              <a href={siteConfig.whatsappHref} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-4 w-4" />
                {t.whatsapp}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
