import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "KNLTC — Japan Education & Career Consultancy",
  description: "Study, Work & Build Your Future in Japan",
};

export default function HomePage() {
  const support = ["ল্যাঙ্গুয়েজ প্রোগ্রাম", "স্কিল ট্রেইনিং", "ভিসা সাপোর্ট", "ইন্টারভিউ প্রিপারেশন", "জাপানিজ ভাষার বই", "ডকুমেন্টেশন সাপোর্ট", "আফটার অ্যারাইভাল সাপোর্ট"];
  const opportunities = ["SSW Agriculture", "SSW Caregiver", "TITP Construction", "TITP Automobile", "TITP Welding"];
  return <main>
    <section className="section-padding bg-gradient-to-br from-red-50 via-white to-green-50"><div className="container-narrow text-center"><p className="text-sm font-semibold text-green-700">KNLTC — Japan Education & Career Consultancy</p><h1 className="mt-3 text-4xl font-extrabold text-red-700">Study, Work & Build Your Future in Japan</h1><p className="mt-3 text-muted-foreground">জাপান-কেন্দ্রিক শিক্ষা, ভাষা, ভিসা ও ক্যারিয়ার গাইডেন্স এক প্ল্যাটফর্মে।</p><Link href="/contact" className="mt-6 inline-block rounded-full bg-green-600 px-6 py-3 text-white">ফ্রি কাউন্সেলিং নিন</Link></div></section>
    <section className="section-padding"><div className="container-narrow"><h2 className="text-2xl font-bold">Choose Your Japan Path</h2><div className="mt-4 grid gap-4 md:grid-cols-3">{[["Study in Japan","/study-in-japan"],["Work in Japan","/work-in-japan"],["Japanese Language","/japanese-language"]].map(([t,h])=><Link key={t} href={h} className="rounded-xl border p-5 hover:border-green-400">{t}</Link>)}</div></div></section>
    <section className="section-padding bg-white"><div className="container-narrow"><h2 className="text-2xl font-bold">KNLTC Complete Support System</h2><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{support.map((s)=><div key={s} className="rounded-lg border border-red-100 bg-red-50/40 p-3">{s}</div>)}</div></div></section>
    <section className="section-padding"><div className="container-narrow"><h2 className="text-2xl font-bold">Visa Programs</h2><div className="mt-4 flex gap-3 flex-wrap">{["Student Visa","SSW","TITP"].map((v)=><span key={v} className="rounded-full bg-green-100 px-4 py-2">{v}</span>)}</div></div></section>
    <section className="section-padding bg-green-50/40"><div className="container-narrow"><h2 className="text-2xl font-bold">Featured Current Opportunities</h2><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{opportunities.map((o)=><div key={o} className="rounded-lg border bg-white p-3">{o}</div>)}</div></div></section>
    <section className="section-padding"><div className="container-narrow"><h2 className="text-2xl font-bold">Books & Resources Preview</h2><p className="mt-2 text-muted-foreground">জাপানি ভাষার বই, JLPT/JFT রিসোর্স ও স্টাডি ম্যাটেরিয়াল স্টোরে পাওয়া যাবে।</p><Link href="/store" className="mt-4 inline-block rounded-full border border-green-600 px-5 py-2 text-green-700">স্টোরে যান</Link></div></section>
    <section className="section-padding bg-red-700 text-white"><div className="container-narrow text-center"><h2 className="text-3xl font-bold">আজই আপনার জাপান যাত্রা শুরু করুন</h2><Link href="/contact" className="mt-5 inline-block rounded-full bg-white px-6 py-3 font-semibold text-red-700">Contact KNLTC</Link></div></section>
  </main>;
}
