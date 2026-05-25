import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Study in Japan", description: "জাপানে পড়াশোনা ও স্টুডেন্ট ভিসা প্রস্তুতির পূর্ণ গাইডলাইন।" };

export default function StudyInJapanPage() {
  return <main className="section-padding"><div className="container-narrow space-y-8"><section className="rounded-2xl border bg-white p-8"><h1 className="text-3xl font-extrabold text-red-700">জাপানে পড়াশোনা: Study Pathway</h1><p className="mt-3 text-muted-foreground">জাপানি ল্যাঙ্গুয়েজ স্কুল/ইউনিভার্সিটি পথে ভর্তি, স্টুডেন্ট ভিসা, ডকুমেন্টেশন, ইন্টারভিউ প্রস্তুতি ও জাপানে পৌঁছানোর পর গাইডেন্স—সবকিছু এক জায়গায়।</p></section><section className="grid gap-4 md:grid-cols-2">{["Japanese language school / university pathway","Student visa support","Admission guidance","Documentation support","Interview preparation","After arrival guidance"].map((item)=> <div key={item} className="rounded-xl border border-green-100 bg-green-50/40 p-4">{item}</div>)}</section><section className="rounded-2xl border bg-red-50 p-6"><h2 className="text-xl font-bold">Future University Agent Positioning</h2><p className="mt-2 text-sm text-muted-foreground">KNLTC ধাপে ধাপে বিশ্ববিদ্যালয়ভিত্তিক অ্যাডমিশন নেটওয়ার্ক শক্তিশালী করছে, যাতে শিক্ষার্থীরা সঠিক একাডেমিক পথে যেতে পারে।</p><Link className="mt-4 inline-block rounded-full bg-green-600 px-5 py-2 text-white" href="/contact">ফ্রি কাউন্সেলিং</Link></section></div></main>;
}
