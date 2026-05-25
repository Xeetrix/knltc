import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Japanese Language", description: "N5/N4, JLPT/JFT ও spoken Japanese প্রস্তুতি।" };

export default function JapaneseLanguagePage() {
  return <main className="section-padding"><div className="container-narrow space-y-8"><section className="rounded-2xl border bg-white p-8"><h1 className="text-3xl font-extrabold text-red-700">জাপানি ভাষা প্রোগ্রাম</h1><p className="mt-3 text-muted-foreground">N5/N4 ফাস্ট প্রিপারেশন, JLPT/JFT ফোকাস, spoken Japanese ও ভিসা-পাথওয়ে প্রস্তুতি।</p></section><section className="grid gap-4 md:grid-cols-2">{["N5/N4 fast preparation","JLPT / JFT","Spoken Japanese","Books & resources","Pathway to student visa","Pathway to job visa"].map((item)=> <div key={item} className="rounded-xl border border-green-100 bg-green-50/40 p-4">{item}</div>)}</section><Link href="/store" className="inline-block rounded-full bg-green-600 px-5 py-2 text-white">জাপানিজ বই দেখুন</Link></div></main>;
}
