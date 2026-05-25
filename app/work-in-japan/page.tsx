import type { Metadata } from "next";

export const metadata: Metadata = { title: "Work in Japan", description: "SSW, TITP, স্কিল ট্রেইনিং ও জাপান চাকরি প্রস্তুতি।" };

export default function WorkInJapanPage() {
  const sectors = ["SSW Agriculture", "SSW Caregiver", "TITP Construction", "TITP Automobile", "TITP Welding"];
  return <main className="section-padding"><div className="container-narrow space-y-8"><section className="rounded-2xl border bg-white p-8"><h1 className="text-3xl font-extrabold text-red-700">জাপানে কাজ: Work Pathway</h1><p className="mt-3 text-muted-foreground">SSW ও TITP ভিত্তিক ক্যারিয়ার, স্কিল ট্রেইনিং, ইন্টারভিউ প্রিপারেশন ও ডকুমেন্টেশন সহায়তা।</p></section><section className="grid gap-4 md:grid-cols-2">{["SSW","TITP","Skill training","Interview preparation","Documentation support","Current opportunities"].map((item)=> <div key={item} className="rounded-xl border border-green-100 bg-green-50/40 p-4">{item}</div>)}</section><section className="rounded-2xl border bg-white p-6"><h2 className="text-xl font-bold">চলমান সেক্টর সুযোগ</h2><div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{sectors.map((s)=><div key={s} className="rounded-lg border border-red-100 bg-red-50 p-3">{s}</div>)}</div></section></div></main>;
}
