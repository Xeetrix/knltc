import type { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  FileText,
  GraduationCap,
  Headphones,
  Languages,
  MessageCircle,
  Sparkles,
} from "lucide-react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata: Metadata = {
  title: "সহজ বাংলায় জাপানি ভাষা কোর্স | KNLTC",
  description:
    "KNLTC Japan Gateway-এ Minna No Nihongo মেথডে N5 ও N4, JLPT, JFT-Basic এবং স্পোকেন জাপানিজ প্রস্তুতি।",
};

const methodologyCards = [
  {
    title: "বর্ণমালা (Hiragana & Katakana)",
    description: "হিরাগানা ও কাতাকানা স্ক্রিপ্ট সহজে মনে রাখার বৈজ্ঞানিক টেকনিক।",
    icon: Languages,
  },
  {
    title: "শব্দভাণ্ডার (Kotoba)",
    description: "Minna No Nihongo বইয়ের অধ্যায়ভিত্তিক জাপানি শব্দের নির্ভুল বাংলা অর্থ ও উচ্চারণ।",
    icon: BookOpen,
  },
  {
    title: "ব্যাকরণ (Bunkei & Reibun)",
    description: "বাংলা ব্যাকরণের সাথে তুলনা করে সহজ নিয়মে বাক্য গঠন ও পার্টিকেল (は, が, を, に, で) প্র্যাকটিস।",
    icon: FileText,
  },
  {
    title: "কথোপকথন (Kaiwa)",
    description:
      "বাস্তব জীবনের বিভিন্ন পরিস্থিতিতে (যেমন: শপিং, ইন্টারভিউ, কর্মক্ষেত্র) জাপানি ভাষায় কথা বলার নিয়মিত অনুশীলন।",
    icon: MessageCircle,
  },
];

const vocabulary = [
  { japanese: "わたし", romaji: "Watashi", meaning: "আমি" },
  { japanese: "あなた", romaji: "Anata", meaning: "আপনি / তুমি" },
  { japanese: "せんせい", romaji: "Sensei", meaning: "শিক্ষক" },
  { japanese: "がくせい", romaji: "Gakusei", meaning: "শিক্ষার্থী" },
  { japanese: "にほん", romaji: "Nihon", meaning: "জাপান" },
];

const benefits = [
  "অভিজ্ঞ ও সার্টিফাইড জাপানিজ ল্যাঙ্গুয়েজ ইন্সট্রাক্টর দ্বারা ক্লাস পরিচালনা।",
  "স্পোকেন জাপানিজ ও লিসেনিং স্কিল (Listening Skill) বৃদ্ধির জন্য অডিও-ভিজ্যুয়াল সেশন।",
  "Student Visa এবং SSW Job Visa-র ইন্টারভিউয়ের জন্য স্পেশাল প্রস্তুতি।",
  "নিয়মিত মক টেস্ট এবং দুর্বল শিক্ষার্থীদের জন্য এক্সট্রা কেয়ার।",
];

export default function JapaneseLanguagePage() {
  return (
    <main className="section-padding bg-gradient-to-b from-red-50/60 via-white to-green-50/40">
      <div className="container-narrow space-y-12">
        <section className="overflow-hidden rounded-3xl border border-red-100 bg-white shadow-sm">
          <div className="grid gap-8 p-6 md:p-10 lg:grid-cols-[1.4fr_0.8fr] lg:items-center">
            <div className="space-y-6">
              <Badge className="border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-green-700 hover:bg-green-50">
                <Sparkles className="mr-2 h-4 w-4" /> ৩ মাস মেয়াদি N5 ও N4 স্পেশাল কোর্স সুবিধা
              </Badge>
              <div className="space-y-4">
                <h1 className="text-4xl font-extrabold tracking-tight text-red-700 leading-relaxed md:text-5xl">
                  সহজ বাংলায় জাপানি ভাষা শিখুন — Minna No Nihongo মেথডে
                </h1>
                <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
                  শূন্য থেকে N5 ও N4 লেভেল পর্যন্ত পরিপূর্ণ গাইডলাইন, JLPT ও JFT-Basic পরীক্ষার ১০০% প্রস্তুতি এবং স্পোকেন
                  জাপানিজে দক্ষতা অর্জনের সেরা প্ল্যাটফর্ম।
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="bg-red-700 text-white hover:bg-red-800">
                  <Link href="/contact">ফ্রি কাউন্সেলিং বুক করুন</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-green-200 text-green-700 hover:bg-green-50">
                  <Link href="/store">জাপানিজ বই ও স্টাডি ম্যাটেরিয়ালস</Link>
                </Button>
              </div>
            </div>
            <Card className="border-green-200 bg-green-50/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl leading-relaxed text-green-700">
                  <GraduationCap className="h-6 w-6" /> KNLTC Japan Gateway
                </CardTitle>
                <CardDescription className="leading-relaxed">
                  বাংলা ব্যাখ্যা, লাইভ প্র্যাকটিস, মক টেস্ট এবং জাপান যাত্রার বাস্তব প্রস্তুতি—সব একসাথে।
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 text-sm leading-relaxed text-slate-700">
                <div className="rounded-2xl bg-white p-4 shadow-sm">JLPT N5/N4 + JFT-Basic ফোকাস</div>
                <div className="rounded-2xl bg-white p-4 shadow-sm">স্পোকেন, লিসেনিং ও ইন্টারভিউ প্র্যাকটিস</div>
                <div className="rounded-2xl bg-white p-4 shadow-sm">Minna No Nihongo ভিত্তিক অধ্যায়ভিত্তিক ক্লাস</div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="space-y-6">
          <div className="text-center">
            <Badge variant="outline" className="border-red-200 text-red-700">KNLTC মেথড</Badge>
            <h2 className="mt-3 text-3xl font-bold leading-relaxed text-red-700">আমাদের পাঠদান পদ্ধতি</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {methodologyCards.map(({ title, description, icon: Icon }) => (
              <Card key={title} className="border-red-100 bg-white transition hover:-translate-y-1 hover:shadow-md">
                <CardHeader>
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-700">
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl leading-relaxed text-red-700">{title}</CardTitle>
                  <CardDescription className="leading-relaxed">{description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-center text-3xl font-bold leading-relaxed text-red-700">
            ইন্টারেক্টিভ লেসন প্রিভিও (Minna No Nihongo লেসন ১-৩)
          </h2>
          <Tabs defaultValue="vocabulary" className="rounded-3xl border border-green-200 bg-white p-4 shadow-sm md:p-6">
            <TabsList className="grid h-auto w-full grid-cols-1 gap-2 bg-green-50 p-2 md:grid-cols-3">
              <TabsTrigger value="vocabulary">শব্দার্থ (Vocabulary)</TabsTrigger>
              <TabsTrigger value="grammar">ব্যাকরণ (Grammar)</TabsTrigger>
              <TabsTrigger value="conversation">কথোপকথন (Conversation)</TabsTrigger>
            </TabsList>
            <TabsContent value="vocabulary" className="mt-6">
              <div className="overflow-hidden rounded-2xl border border-red-100">
                {vocabulary.map((item) => (
                  <div key={item.japanese} className="grid gap-2 border-b border-red-100 p-4 last:border-b-0 md:grid-cols-3">
                    <span className="text-2xl font-bold text-red-700">{item.japanese}</span>
                    <span className="font-semibold text-slate-700">{item.romaji}</span>
                    <span className="leading-relaxed text-green-700">➔ {item.meaning}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="grammar" className="mt-6 space-y-4 leading-relaxed text-slate-700">
              <p><strong className="text-red-700">[A] は [B] です</strong> — এর অর্থ হলো “A হলো B”।</p>
              <p className="rounded-2xl bg-red-50 p-4 text-lg">わたしは がくせい です — আমি একজন শিক্ষার্থী।</p>
              <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-green-800">
                <strong>টিপ:</strong> জাপানি পার্টিকেল <span className="font-bold">は</span> সাধারণত “হা” হলেও বাক্যে পার্টিকেল হিসেবে এটি “wa” উচ্চারণ করা হয়।
              </div>
            </TabsContent>
            <TabsContent value="conversation" className="mt-6">
              <div className="space-y-4 rounded-2xl bg-slate-50 p-5 leading-relaxed">
                <p><strong className="text-red-700">A:</strong> はじめまして。わたしは ラフマン です。<br /><span className="text-muted-foreground">প্রথম পরিচয়ে ভালো লাগলো। আমি রহমান।</span></p>
                <p><strong className="text-green-700">B:</strong> はじめまして。わたしは さとう です。どうぞよろしく。<br /><span className="text-muted-foreground">প্রথম পরিচয়ে ভালো লাগলো। আমি সাতো। আপনার সহযোগিতা কামনা করছি।</span></p>
                <p><strong className="text-red-700">A:</strong> こちらこそ、よろしくおねがいします。<br /><span className="text-muted-foreground">আমিও আপনার সহযোগিতা কামনা করছি।</span></p>
              </div>
            </TabsContent>
          </Tabs>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <Badge className="bg-green-600 text-white hover:bg-green-600">কেন KNLTC?</Badge>
            <h2 className="mt-3 text-3xl font-bold leading-relaxed text-red-700">Why Learn With KNLTC?</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              পরীক্ষার প্রস্তুতি থেকে বাস্তব কথোপকথন—প্রতিটি ধাপে আপনাকে আত্মবিশ্বাসী করে তোলাই আমাদের লক্ষ্য।
            </p>
          </div>
          <div className="space-y-4">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex gap-3 rounded-2xl border border-green-200 bg-white p-4 leading-relaxed shadow-sm">
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-green-600" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </section>

        <Card className="border-green-200 bg-gradient-to-r from-green-50 to-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl leading-relaxed text-red-700">
              <Headphones className="h-6 w-6 text-green-700" /> KNLTC স্টাডি ম্যাটেরিয়ালস
            </CardTitle>
            <CardDescription className="leading-relaxed">
              KNLTC-এর অরিজিনাল N5/N4 বাংলা গাইড, ভোকাবুলারি শিট এবং ইন্টারভিউ প্রস্তুতি বই দিয়ে আপনার শেখা আরও সহজ করুন।
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="bg-green-600 text-white hover:bg-green-700">
              <Link href="/store">স্টাডি ম্যাটেরিয়ালস দেখুন</Link>
            </Button>
          </CardContent>
        </Card>

        <Accordion type="single" collapsible className="rounded-3xl border border-red-100 bg-white px-5">
          <AccordionItem value="course-duration">
            <AccordionTrigger className="text-left leading-relaxed text-red-700">N5/N4 কোর্স কত দিনে শেষ হয়?</AccordionTrigger>
            <AccordionContent className="leading-relaxed text-muted-foreground">
              নিয়মিত ক্লাস, হোমওয়ার্ক এবং মক টেস্টের মাধ্যমে ৩ মাস মেয়াদি স্পেশাল কোর্সে বেসিক থেকে পরীক্ষার প্রস্তুতি নেওয়া যায়।
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="materials">
            <AccordionTrigger className="text-left leading-relaxed text-red-700">Minna No Nihongo বই কি ব্যবহার করা হয়?</AccordionTrigger>
            <AccordionContent className="leading-relaxed text-muted-foreground">
              হ্যাঁ, Minna No Nihongo কনসেপ্ট অনুসরণ করে বাংলা ব্যাখ্যা, শব্দার্থ, গ্রামার ও কথোপকথন প্র্যাকটিস করানো হয়।
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <section className="rounded-3xl bg-red-700 p-8 text-center text-white shadow-lg md:p-12">
          <h2 className="text-3xl font-extrabold leading-relaxed md:text-4xl">আজই শুরু করুন আপনার জাপান যাত্রা</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-red-50">
            সঠিক মেথড, নিয়মিত প্র্যাকটিস এবং অভিজ্ঞ মেন্টরের গাইডলাইন নিয়ে জাপানি ভাষাকে করে তুলুন আপনার ক্যারিয়ারের শক্তি।
          </p>
          <Button asChild size="lg" className="mt-6 bg-green-600 text-white hover:bg-green-700">
            <Link href="/contact"><MessageCircle className="h-5 w-5" /> ফ্রি কাউন্সেলিং বুক করুন</Link>
          </Button>
        </section>
      </div>
    </main>
  );
}
