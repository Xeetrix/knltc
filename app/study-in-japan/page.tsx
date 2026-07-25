"use client";

import Link from "next/link";
import { CheckCircle2, CircleDollarSign, FileCheck2, GraduationCap, Home, School, Users, XCircle } from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function StudyInJapanClient() {
  const { language } = useLanguage();
  const t = translate(
    {
      bn: {
        title: "জাপানে পড়াশোনার প্রিমিয়াম স্টুডেন্ট জার্নি",
        subtitle: "ভর্তি থেকে ভিসা—সব ধাপে অভিভাবক-বান্ধব, পরিষ্কার ও নির্ভরযোগ্য গাইডলাইন।",
        roadmap: "স্টুডেন্ট রোডম্যাপ",
        pathways: "স্টাডি পাথওয়ে",
        eligibility: "ন্যূনতম যোগ্যতা",
        checklist: "ডকুমেন্ট চেকলিস্ট",
        life: "জাপানে স্টুডেন্ট লাইফ",
        packages: "ভিসা সার্ভিস প্যাকেজ",
        faq: "প্রশ্নোত্তর",
        finalTitle: "জাপানে পড়াশোনার পরিকল্পনা আজই শুরু করুন",
        consult: "ফ্রি কনসাল্টেশন নিন",
      },
      en: {
        title: "Premium Student Journey for Study in Japan",
        subtitle: "From admission to visa with clear, parent-friendly, and trusted guidance.",
        roadmap: "Student Roadmap",
        pathways: "Study Pathways",
        eligibility: "Minimum Eligibility",
        checklist: "Document Checklist",
        life: "Student Life in Japan",
        packages: "Visa Service Packages",
        faq: "FAQ",
        finalTitle: "Start your Japan study plan today",
        consult: "Get Free Consultation",
      },
      ja: {
        title: "日本留学のプレミアム学生ジャーニー",
        subtitle: "入学からビザまで、保護者にも分かりやすく信頼できるガイド。",
        roadmap: "学生ロードマップ",
        pathways: "留学パスウェイ",
        eligibility: "最低応募資格",
        checklist: "書類チェックリスト",
        life: "日本での学生生活",
        packages: "ビザサービスパッケージ",
        faq: "よくある質問",
        finalTitle: "日本留学の計画を今日から始めましょう",
        consult: "無料相談を受ける",
      },
    },
    language,
  );

  const heroStats = translate(
    {
      bn: [
        { icon: School, value: "১২+", label: "ইয়ার গাইডেন্স" },
        { icon: Users, value: "৮০০+", label: "শিক্ষার্থী পরামর্শ" },
        { icon: FileCheck2, value: "১০০%", label: "চেকলিস্ট ফোকাস" },
      ],
      en: [
        { icon: School, value: "12+", label: "Years guidance" },
        { icon: Users, value: "800+", label: "Student consultations" },
        { icon: FileCheck2, value: "100%", label: "Checklist focus" },
      ],
      ja: [
        { icon: School, value: "12+", label: "年のガイダンス" },
        { icon: Users, value: "800+", label: "学生相談" },
        { icon: FileCheck2, value: "100%", label: "チェックリスト重視" },
      ],
    },
    language,
  );

  const roadmap = translate(
    {
      bn: ["যোগ্যতা যাচাই", "স্কুল নির্বাচন", "অ্যাপ্লিকেশন প্রস্তুতি", "ভিসা ডকুমেন্ট", "ইন্টারভিউ প্রস্তুতি", "জাপানে যাত্রা"],
      en: ["Eligibility", "School selection", "Application", "Visa docs", "Interview", "Departure"],
      ja: ["適性確認", "学校選定", "申請準備", "ビザ書類", "面接準備", "渡航"],
    },
    language,
  );

  const pathways = translate(
    {
      bn: [
        { n: "ভাষা স্কুল", d: "ফাউন্ডেশন তৈরি ও বিশ্ববিদ্যালয় প্রস্তুতি — বছরে ৪টি সেশন: জানুয়ারি, এপ্রিল, জুলাই, অক্টোবর" },
        { n: "বিশ্ববিদ্যালয় ভর্তি", d: "ব্যাচেলর/মাস্টার্স অ্যাডমিশন গাইড — বছরে ২টি সেশন: এপ্রিল, অক্টোবর" },
        { n: "সেনমন স্কুল", d: "স্কিল-কেন্দ্রিক বাস্তবমুখী শিক্ষা" },
      ],
      en: [
        { n: "Language School", d: "Build a foundation for university — 4 intakes/year: Jan, Apr, Jul, Oct" },
        { n: "University", d: "Bachelor/Master admission guidance — 2 intakes/year: Apr, Oct" },
        { n: "Senmon School", d: "Skill-focused practical education" },
      ],
      ja: [
        { n: "日本語学校", d: "大学進学の基盤づくり — 年4回入学：1月・4月・7月・10月" },
        { n: "大学進学", d: "学部・修士の入学支援 — 年2回入学：4月・10月" },
        { n: "専門学校", d: "実践重視の技能教育" },
      ],
    },
    language,
  );

  const eligibility = translate(
    {
      bn: [
        "HSC/ডিপ্লোমা বা সমমান, অথবা অনার্স/মাস্টার্স (সম্পন্ন বা অধ্যয়নরত)",
        "ন্যূনতম GPA ২.৫ — IELTS বা TOEFL-এর প্রয়োজন নেই",
        "সর্বোচ্চ বয়সসীমা ৩০ বছর পর্যন্ত গ্রহণযোগ্য",
        "সর্বোচ্চ ৫–৬ বছর স্টাডি গ্যাপ গ্রহণযোগ্য",
        "N5 লেভেল জাপানি ভাষা কোর্স সম্পন্ন থাকতে হবে",
      ],
      en: [
        "HSC/Diploma or equivalent, or Honours/Masters (completed or currently studying)",
        "Minimum GPA 2.5 — no IELTS or TOEFL required",
        "Maximum age 30 years",
        "Study gap of up to 5–6 years accepted",
        "Must have completed an N5-level Japanese language course",
      ],
      ja: [
        "HSC/ディプロマ以上、または学士・修士（在学中も可）",
        "最低GPA 2.5 — IELTS・TOEFLは不要",
        "上限年齢30歳まで",
        "最大5〜6年のブランクまで許容",
        "N5レベルの日本語コース修了が必要",
      ],
    },
    language,
  );

  const checklist = translate(
    {
      bn: ["পাসপোর্ট ও একাডেমিক ডকুমেন্ট", "ফাইন্যান্সিয়াল প্রুফ", "COE আবেদন ফাইল", "ইন্টারভিউ প্রস্তুতি নোট"],
      en: ["Passport & academics", "Financial proof", "COE application file", "Interview prep notes"],
      ja: ["パスポート・学歴書類", "資金証明", "COE申請書類", "面接対策ノート"],
    },
    language,
  );

  const lifeCards = translate(
    {
      bn: [
        { title: "পার্ট-টাইম সুযোগ", desc: "সপ্তাহে ২৮ ঘণ্টা, মাসে ১২০ ঘণ্টা পর্যন্ত; ছুটিতে ফুলটাইম পর্যন্ত সুযোগ" },
        { title: "নিরাপদ হোস্টেল/বাসস্থান", desc: "যাচাইকৃত আবাসন ব্যবস্থাপনায় সহায়তা" },
        { title: "কালচারাল অ্যাডাপ্টেশন", desc: "ভাষা, নিয়মকানুন ও দৈনন্দিন জীবনে দ্রুত মানিয়ে নেওয়ার গাইড" },
      ],
      en: [
        { title: "Part-time options", desc: "Up to 28 hrs/week, 120 hrs/month; near full-time during school breaks" },
        { title: "Safe hostel/housing", desc: "Support finding verified student accommodation" },
        { title: "Cultural adaptation", desc: "Guidance on language, etiquette, and daily life in Japan" },
      ],
      ja: [
        { title: "アルバイト機会", desc: "週28時間・月120時間まで、長期休暇中はフルタイムも可能" },
        { title: "安心できる寮・住居", desc: "確認済みの学生向け住居探しをサポート" },
        { title: "文化適応", desc: "言語・マナー・日常生活への適応ガイド" },
      ],
    },
    language,
  );

  const packageItems = translate(
    {
      bn: ["জাপানি ভাষা কোর্স ফি", "স্ট্যাম্প খরচ", "সিলেকশন ফি", "ডকুমেন্ট অনুবাদ ও কুরিয়ার", "COE-এর পর ১ম বছরের টিউশন ফি", "VFS ফি", "এয়ার টিকিট"],
      en: ["Japanese course fee", "Stamp cost", "Selection fee", "Document translation & courier", "1st-year tuition after COE", "VFS fee", "Airfare"],
      ja: ["日本語コース費用", "スタンプ代", "選考料", "書類翻訳・配送", "COE後の初年度学費", "VFS手数料", "航空券"],
    },
    language,
  );

  const packages = translate(
    {
      bn: {
        regularLabel: "রেগুলার প্যাকেজ",
        regularPrice: "৳১,২০,০০০",
        regularNote: "বাজেট-বান্ধব ও স্বনির্ভর প্রক্রিয়ার জন্য আদর্শ",
        premiumLabel: "প্রিমিয়াম প্যাকেজ",
        premiumPrice: "৳১২,০০,০০০",
        premiumNote: "সম্পূর্ণ হ্যাসেল-ফ্রি — ভিসা না হলে নিজের কোনো খরচ নেই",
        itemHeader: "সেবা",
        cta: "প্যাকেজ নিয়ে কথা বলুন",
        studentPays: "শিক্ষার্থী বহন করবে",
        knltcPays: "KNLTC বহন করবে",
      },
      en: {
        regularLabel: "Regular Package",
        regularPrice: "৳1,20,000",
        regularNote: "Ideal for budget-conscious, self-reliant applicants",
        premiumLabel: "Premium Package",
        premiumPrice: "৳12,00,000",
        premiumNote: "Fully hassle-free — no cost to you if the visa is denied",
        itemHeader: "Item",
        cta: "Talk about packages",
        studentPays: "Student pays",
        knltcPays: "KNLTC pays",
      },
      ja: {
        regularLabel: "レギュラーパッケージ",
        regularPrice: "৳1,20,000",
        regularNote: "予算重視で自分で進めたい方に",
        premiumLabel: "プレミアムパッケージ",
        premiumPrice: "৳12,00,000",
        premiumNote: "手間いらず — ビザ不許可でも自己負担なし",
        itemHeader: "項目",
        cta: "パッケージについて相談する",
        studentPays: "学生負担",
        knltcPays: "KNLTC負担",
      },
    },
    language,
  );

  const faqs = translate(
    {
      bn: [
        {
          q: "জাপানি ভাষা কি বাধ্যতামূলক?",
          a: "হ্যাঁ, ভিসার জন্য কমপক্ষে N5 লেভেল জাপানি ভাষা কোর্স সম্পন্ন করতে হবে। KNLTC নিজেই ৩ মাস মেয়াদি N5 কোর্স করিয়ে থাকে।",
        },
        {
          q: "IELTS বা TOEFL কি লাগবে?",
          a: "না। জাপান স্টুডেন্ট ভিসার আবেদনে IELTS বা TOEFL-এর প্রয়োজন নেই।",
        },
        {
          q: "কত সময়ে প্রক্রিয়া শেষ হয়?",
          a: "ভাষা স্কুলের ভর্তি বছরে ৪টি সেশনে (জানুয়ারি, এপ্রিল, জুলাই, অক্টোবর) এবং বিশ্ববিদ্যালয়ের ভর্তি ২টি সেশনে (এপ্রিল, অক্টোবর) হয়। প্রকৃত সময়সীমা আপনার নির্বাচিত সেশন ও প্রোফাইলের উপর নির্ভর করে বলে আমরা কনসালটেশনে সুনির্দিষ্ট টাইমলাইন জানিয়ে দিই।",
        },
        {
          q: "পড়াশোনার সময় পার্ট-টাইম জব করা যায়?",
          a: "হ্যাঁ। সরকার-অনুমোদিত নিয়মে সপ্তাহে ২৮ ঘণ্টা ও মাসে সর্বোচ্চ ১২০ ঘণ্টা পার্ট-টাইম কাজ করা যায়; গ্রীষ্ম ও শীতকালীন ছুটিতে (২ মাস) ফুলটাইম পর্যন্ত (মাসে ২৪০ ঘণ্টা) কাজ করা সম্ভব।",
        },
      ],
      en: [
        {
          q: "Is Japanese mandatory?",
          a: "Yes — an N5-level Japanese course is required for visa eligibility. KNLTC runs its own 3-month N5 course.",
        },
        {
          q: "Do I need IELTS or TOEFL?",
          a: "No. IELTS or TOEFL is not required to apply for a Japan student visa.",
        },
        {
          q: "How long does the process take?",
          a: "Language schools take students 4 times a year (Jan, Apr, Jul, Oct); universities twice a year (Apr, Oct). The exact timeline depends on your chosen intake and profile — we'll confirm specifics during your consultation.",
        },
        {
          q: "Can students work part-time?",
          a: "Yes. Government rules permit up to 28 hrs/week and 120 hrs/month; during summer and winter breaks (2 months) students can work close to full-time, up to 240 hrs/month.",
        },
      ],
      ja: [
        {
          q: "日本語は必須ですか？",
          a: "はい。ビザ申請にはN5レベルの日本語コース修了が必要です。KNLTCでも3か月のN5コースを提供しています。",
        },
        {
          q: "IELTSやTOEFLは必要ですか？",
          a: "いいえ。日本の学生ビザ申請にIELTSやTOEFLは不要です。",
        },
        {
          q: "手続きにはどれくらい時間がかかりますか？",
          a: "日本語学校は年4回（1月・4月・7月・10月）、大学は年2回（4月・10月）の入学があります。正確な期間は選択する入学時期とプロフィールにより異なるため、無料相談で具体的なスケジュールをご案内します。",
        },
        {
          q: "留学中アルバイトは可能ですか？",
          a: "はい。政府の規定により週28時間・月120時間まで可能で、夏休み・冬休み（2か月間）はフルタイムに近い月240時間まで働けます。",
        },
      ],
    },
    language,
  );

  return (
    <main className="section-padding bg-[#fcfaf7]">
      <div className="container-narrow space-y-8">
        <section className="fade-up relative overflow-hidden rounded-3xl border border-red-100 bg-white p-8 shadow-xl md:p-10">
          <div className="absolute right-0 top-0 h-36 w-36 rounded-full bg-red-200/40 blur-2xl" />
          <h1 className="relative text-3xl font-black text-red-700 md:text-4xl">{t.title}</h1>
          <p className="relative mt-3 text-zinc-700">{t.subtitle}</p>
          <div className="relative mt-6 grid gap-3 sm:grid-cols-3">
            {heroStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="rounded-xl border border-green-100 bg-green-50/60 p-4">
                  <Icon className="h-5 w-5 text-green-700" />
                  <p className="mt-2 text-2xl font-black text-red-700">{stat.value}</p>
                  <p className="text-sm text-zinc-600">{stat.label}</p>
                </div>
              );
            })}
          </div>
          <div className="relative mt-6 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="bg-red-700 text-white hover:bg-red-800">
              <Link href="/contact">{t.consult}</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-green-200 text-green-700 hover:bg-green-50">
              <a href="tel:+8801805013633">+880 1805 013633</a>
            </Button>
          </div>
        </section>

        <section>
          <h2 className="section-title fade-up">{t.roadmap}</h2>
          <div className="mt-4 space-y-3">
            {roadmap.map((step, i) => (
              <div key={step} className="timeline-step fade-up" style={{ animationDelay: `${i * 80}ms` }}>
                <span className="timeline-dot">{i + 1}</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="section-title fade-up">{t.pathways}</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {pathways.map((path) => (
              <div key={path.n} className="card-lift fade-up rounded-2xl border bg-white p-5 shadow-sm">
                <School className="h-6 w-6 text-red-600" />
                <h3 className="mt-3 font-bold">{path.n}</h3>
                <p className="text-sm text-zinc-600">{path.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="section-title fade-up">{t.eligibility}</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {eligibility.map((item) => (
              <div key={item} className="fade-up flex items-start gap-2 rounded-xl border border-green-100 bg-white p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-700" />
                <span className="text-sm text-zinc-700">{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="section-title fade-up">{t.checklist}</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {checklist.map((item) => (
              <div key={item} className="fade-up flex items-center gap-2 rounded-xl border bg-white p-4">
                <CheckCircle2 className="h-5 w-5 text-green-700" />
                {item}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="section-title fade-up">{t.life}</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {lifeCards.map((card) => (
              <div key={card.title} className="fade-up rounded-2xl bg-gradient-to-br from-green-50 to-white p-5 shadow-sm">
                <Home className="mb-2 h-5 w-5 text-green-700" />
                <p className="font-semibold">{card.title}</p>
                <p className="mt-1 text-sm text-zinc-600">{card.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="section-title fade-up">{t.packages}</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Card className="fade-up border-zinc-200">
              <CardHeader>
                <Badge variant="outline" className="w-fit border-zinc-300 text-zinc-600">
                  {packages.regularLabel}
                </Badge>
                <CardTitle className="text-2xl text-zinc-800">{packages.regularPrice}</CardTitle>
                <p className="text-sm text-zinc-600">{packages.regularNote}</p>
              </CardHeader>
              <CardContent className="space-y-2">
                {packageItems.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-zinc-600">
                    <XCircle className="h-4 w-4 shrink-0 text-zinc-400" />
                    <span>
                      {item} — {packages.studentPays}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="fade-up border-red-200 shadow-lg">
              <CardHeader>
                <Badge className="w-fit bg-red-700 text-white hover:bg-red-700">{packages.premiumLabel}</Badge>
                <CardTitle className="text-2xl text-red-700">{packages.premiumPrice}</CardTitle>
                <p className="text-sm text-zinc-600">{packages.premiumNote}</p>
              </CardHeader>
              <CardContent className="space-y-2">
                {packageItems.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-zinc-700">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />
                    <span>
                      {item} — {packages.knltcPays}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="mt-4 overflow-x-auto rounded-2xl border bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{packages.itemHeader}</TableHead>
                  <TableHead className="text-center">{packages.regularLabel}</TableHead>
                  <TableHead className="text-center">{packages.premiumLabel}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {packageItems.map((item) => (
                  <TableRow key={item}>
                    <TableCell className="flex items-center gap-2 font-medium text-zinc-700">
                      <CircleDollarSign className="h-4 w-4 text-zinc-400" />
                      {item}
                    </TableCell>
                    <TableCell className="text-center text-zinc-500">
                      <XCircle className="mx-auto h-4 w-4" />
                    </TableCell>
                    <TableCell className="text-center text-green-700">
                      <CheckCircle2 className="mx-auto h-4 w-4" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="fade-up mt-4 flex justify-center">
            <Button asChild size="lg" className="bg-red-700 text-white hover:bg-red-800">
              <Link href="/contact">
                <GraduationCap className="h-5 w-5" /> {packages.cta}
              </Link>
            </Button>
          </div>
        </section>

        <section>
          <h2 className="section-title fade-up">{t.faq}</h2>
          <div className="mt-4 space-y-3">
            {faqs.map((item, i) => (
              <details key={item.q} className="fade-up rounded-xl border bg-white p-4" style={{ animationDelay: `${i * 70}ms` }}>
                <summary className="cursor-pointer font-semibold">{item.q}</summary>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="fade-up rounded-3xl bg-gradient-to-r from-red-700 to-green-700 p-8 text-center text-white">
          <h2 className="text-3xl font-bold">{t.finalTitle}</h2>
          <Link href="/contact" className="mt-5 inline-block rounded-full bg-white px-6 py-3 font-semibold text-red-700 transition hover:-translate-y-1">
            {t.consult}
          </Link>
        </section>
      </div>
    </main>
  );
}
