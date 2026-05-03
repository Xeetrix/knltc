"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { CheckCircle2, ChevronRight, Leaf, MessageCircle, PhoneCall, ShieldCheck, Timer, UserCheck, Users, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { trackLead, trackWhatsAppClick } from "@/lib/meta-pixel";

type VisaInterest = "Agriculture" | "Caregiver";
type JapaneseLevel = "N4 Passed" | "N5 Passed" | "Preparing for N4";
type SkillCertificate = "Yes" | "No";

const WHATSAPP_URL = "https://wa.me/8801805013633?text=%E0%A6%86%E0%A6%AE%E0%A6%BF%20SSW%20%E0%A6%AD%E0%A6%BF%E0%A6%B8%E0%A6%BE%20%E0%A6%B8%E0%A6%AE%E0%A7%8D%E0%A6%AA%E0%A6%B0%E0%A7%8D%E0%A6%95%E0%A7%87%20%E0%A6%9C%E0%A6%BE%E0%A6%A8%E0%A6%A4%E0%A7%87%20%E0%A6%9A%E0%A6%BE%E0%A6%87";

const infoCards = [
  { label: "ভিসার ধরন", value: "SSW", icon: ShieldCheck },
  { label: "ক্যাটাগরি", value: "Agriculture / Caregiver", icon: Leaf },
  { label: "লোক নেওয়া হবে", value: "২০ জন", icon: Users },
  { label: "বেতন", value: "১ লাখ ৬০ হাজার থেকে ২ লাখ", icon: Wallet },
  { label: "ইন্টারভিউ", value: "৭ই মে থেকে ১০ই মে ২০২৬ পর্যন্ত", icon: Timer },
];

export default function SswVisaLandingClient() {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    visa_interest: "Agriculture" as VisaInterest,
    japanese_level: "Preparing for N4" as JapaneseLevel,
    skill_certificate: "No" as SkillCertificate,
    message: "",
  });

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/ssw-visa-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();

      trackLead({ content_name: "SSW Lead" });
      toast({
        title: "আবেদন সফল",
        description: "আপনার আবেদন গ্রহণ করা হয়েছে। আমাদের টিম দ্রুত যোগাযোগ করবে।",
      });
      setForm({
        name: "",
        phone: "",
        visa_interest: "Agriculture",
        japanese_level: "Preparing for N4",
        skill_certificate: "No",
        message: "",
      });
    } catch {
      toast({
        title: "আবেদন ব্যর্থ হয়েছে",
        description: "দুঃখিত, আবেদন সাবমিট হয়নি। আবার চেষ্টা করুন অথবা WhatsApp করুন।",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative overflow-x-clip bg-gradient-to-b from-emerald-50/70 via-white to-rose-50/60 pb-28 sm:pb-24">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_rgba(220,38,38,0.08),_transparent_45%),radial-gradient(circle_at_top_left,_rgba(5,150,105,0.12),_transparent_40%)]" />

      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:py-10 lg:py-12">
        <section className="rounded-3xl border border-rose-100/70 bg-white/95 p-5 shadow-2xl shadow-rose-100/40 sm:p-8">
          <p className="inline-flex items-center rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">Limited Intake 2026</p>
          <h1 className="mt-4 max-w-4xl text-2xl font-black leading-tight text-slate-900 sm:text-4xl lg:text-5xl">জরুরী ভিত্তিতে জাপানে কর্মী নিয়োগ শুরু</h1>
          <p className="mt-3 text-xl font-bold text-emerald-700">SSW Agriculture &amp; Caregiver Visa</p>
          <p className="mt-2 max-w-2xl text-sm text-slate-700 sm:text-base">N4 পাশ এবং স্কিল টেস্ট সার্টিফিকেট থাকলে এখনই আবেদন করুন</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#apply" className="inline-flex items-center rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-700/30 transition hover:bg-emerald-800">এখনই আবেদন করুন <ChevronRight className="ml-1 h-4 w-4" /></a>
            <Link
              href={WHATSAPP_URL}
              target="_blank"
              className="inline-flex items-center rounded-xl border border-emerald-300 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-100"
              onClick={() => trackWhatsAppClick("SSW Hero")}
            >
              WhatsApp করুন
            </Link>
          </div>
        </section>

        <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {infoCards.map((item) => (
            <article key={item.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <item.icon className="mb-2 h-5 w-5 text-rose-600" />
              <p className="text-xs text-slate-500">{item.label}</p>
              <p className="mt-1 text-sm font-bold text-slate-900">{item.value}</p>
            </article>
          ))}
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-2">
          <article className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-extrabold text-slate-900">Requirements</h2>
            <ul className="mt-3 space-y-3 text-sm text-slate-700">
              <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />N4 পাশ (JLPT/JFT)</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />Agriculture/Caregiver skill test certificate</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />প্রয়োজনীয় ডকুমেন্ট প্রস্তুত থাকতে হবে</li>
            </ul>
          </article>

          <article className="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-extrabold text-slate-900">Why KNLTC</h2>
            <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-slate-700 xl:grid-cols-2">
              {["সঠিক গাইডলাইন", "ডকুমেন্টেশন সাপোর্ট", "ইন্টারভিউ প্রস্তুতি", "দ্রুত যোগাযোগ", "জাপান-কেন্দ্রিক বাস্তব পরামর্শ"].map((item) => (
                <div key={item} className="rounded-xl bg-slate-50 p-3">{item}</div>
              ))}
            </div>
          </article>
        </section>

        <section className="mt-8 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-600 to-emerald-700 p-5 text-white shadow-xl shadow-emerald-700/30 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-100">আপনি কি যোগ্য?</p>
          <h2 className="mt-1 text-2xl font-black">N4 পাশ এবং স্কিল টেস্ট সার্টিফিকেট থাকলে এখনই আবেদন করুন।</h2>
          <a href="#apply" className="mt-4 inline-flex items-center rounded-xl bg-white px-4 py-2 text-sm font-bold text-emerald-800 transition hover:bg-emerald-50">ফর্ম পূরণ করুন <ChevronRight className="ml-1 h-4 w-4" /></a>
        </section>

        <section id="apply" className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/40 sm:p-8">
          <p className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">সীমিত আসন • দ্রুত যোগাযোগ • সঠিক গাইডলাইন</p>
          <h2 className="mt-3 text-2xl font-black text-slate-900">এখনই আবেদন করুন</h2>
          <p className="mt-1 text-sm text-slate-600">আপনার তথ্য দিন, আমাদের টিম দ্রুত যোগাযোগ করবে।</p>
          <form onSubmit={submit} className="mt-6 space-y-5 sm:space-y-6">
            <div className="grid gap-x-4 gap-y-5 md:grid-cols-2">
              <label className="space-y-2.5 text-sm font-medium text-slate-800">
                <span className="block">আপনার নাম</span>
                <Input required placeholder="নাম" className="h-12 rounded-xl border-slate-300 px-4 focus-visible:ring-2 focus-visible:ring-emerald-500" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </label>

              <label className="space-y-2.5 text-sm font-medium text-slate-800">
                <span className="block">মোবাইল নম্বর</span>
                <Input required placeholder="মোবাইল নম্বর" className="h-12 rounded-xl border-slate-300 px-4 focus-visible:ring-2 focus-visible:ring-emerald-500" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                <p className="pt-0.5 text-xs leading-relaxed text-slate-500">সঠিক নম্বর দিন, এই নম্বরেই আমাদের টিম যোগাযোগ করবে।</p>
              </label>

              <label className="space-y-2.5 text-sm font-medium text-slate-800">
                <span className="block">কোন ক্যাটাগরিতে আগ্রহী?</span>
                <select className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none ring-offset-white transition focus-visible:ring-2 focus-visible:ring-emerald-500" value={form.visa_interest} onChange={(e) => setForm({ ...form, visa_interest: e.target.value as VisaInterest })}><option>Agriculture</option><option>Caregiver</option></select>
              </label>

              <label className="space-y-2.5 text-sm font-medium text-slate-800">
                <span className="block">আপনার জাপানি ভাষার লেভেল</span>
                <select className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none ring-offset-white transition focus-visible:ring-2 focus-visible:ring-emerald-500" value={form.japanese_level} onChange={(e) => setForm({ ...form, japanese_level: e.target.value as JapaneseLevel })}><option>N4 Passed</option><option>N5 Passed</option><option>Preparing for N4</option></select>
              </label>

              <label className="space-y-2.5 text-sm font-medium text-slate-800 md:col-span-1">
                <span className="block">স্কিল টেস্ট সার্টিফিকেট আছে?</span>
                <select className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none ring-offset-white transition focus-visible:ring-2 focus-visible:ring-emerald-500" value={form.skill_certificate} onChange={(e) => setForm({ ...form, skill_certificate: e.target.value as SkillCertificate })}><option>Yes</option><option>No</option></select>
              </label>

              <div className="hidden md:block" aria-hidden />
            </div>

            <label className="space-y-2.5 text-sm font-medium text-slate-800">
              <span className="block">অতিরিক্ত বার্তা</span>
              <Textarea rows={5} placeholder="আপনার অভিজ্ঞতা বা প্রশ্ন লিখুন" className="min-h-32 rounded-xl border-slate-300 px-4 py-3 leading-relaxed focus-visible:ring-2 focus-visible:ring-emerald-500" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            </label>

            <p className="mt-1 rounded-xl bg-slate-50 px-4 py-3 text-xs leading-relaxed text-slate-600 sm:mt-2">আপনার তথ্য নিরাপদ থাকবে এবং শুধুমাত্র KNLTC যোগাযোগের জন্য ব্যবহার করবে।</p>
            <Button type="submit" disabled={submitting} className="mt-2 h-12 w-full rounded-xl bg-rose-600 text-base font-semibold transition hover:bg-rose-700 focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2">{submitting ? "জমা হচ্ছে..." : "আবেদন সাবমিট করুন"}</Button>
          </form>
        </section>

        <section className="mt-6 rounded-2xl border border-emerald-200 bg-white p-5 text-center shadow-sm">
          <p className="text-sm text-slate-600">আরও দ্রুত উত্তর চান?</p>
          <Link href={WHATSAPP_URL} target="_blank" onClick={() => trackWhatsAppClick("SSW Bottom CTA")} className="mt-3 inline-flex items-center rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-700"><MessageCircle className="mr-2 h-4 w-4" />WhatsApp করুন</Link>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-3 gap-2 border-t border-slate-200 bg-white/95 p-2 backdrop-blur sm:hidden">
        <a href="tel:+8801805013633" className="inline-flex items-center justify-center gap-1 rounded-lg bg-slate-100 p-2 text-xs font-medium text-slate-800"><PhoneCall className="h-3.5 w-3.5" />Call</a>
        <Link href={WHATSAPP_URL} target="_blank" className="inline-flex items-center justify-center rounded-lg bg-emerald-100 p-2 text-xs font-semibold text-emerald-900" onClick={() => trackWhatsAppClick("SSW Sticky")}>WhatsApp</Link>
        <a href="#apply" className="inline-flex items-center justify-center rounded-lg bg-rose-600 p-2 text-xs font-semibold text-white">Apply Now</a>
      </div>

      <div className="pointer-events-none absolute right-3 top-16 hidden rounded-full bg-white/80 px-3 py-2 text-xs font-semibold text-rose-700 shadow sm:flex">
        <UserCheck className="mr-1 h-3.5 w-3.5" /> Agriculture &amp; Caregiver Intake Open
      </div>
    </div>
  );
}
