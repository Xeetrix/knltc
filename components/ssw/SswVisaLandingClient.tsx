"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, ChevronRight, Leaf, PhoneCall, ShieldCheck, Stethoscope, Timer, Users, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { trackLead, trackViewContent, trackWhatsAppClick } from "@/lib/meta-pixel";

type VisaInterest = "Agriculture" | "Caregiver";
type JapaneseLevel = "N5" | "N4" | "N3+" | "Not started";
type SkillCertificate = "Yes" | "No" | "Preparing";

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
    japanese_level: "Not started" as JapaneseLevel,
    skill_certificate: "Preparing" as SkillCertificate,
    message: "",
  });

  useEffect(() => {
    trackViewContent({ content_name: "SSW Visa Campaign", content_category: "Lead Generation" });
  }, []);

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

      trackLead({ content_name: "SSW Visa Lead", content_category: form.visa_interest });
      toast({
        title: "আবেদন সফল",
        description: "আপনার আবেদন গ্রহণ করা হয়েছে। আমাদের টিম দ্রুত যোগাযোগ করবে।",
      });
      setForm({
        name: "",
        phone: "",
        visa_interest: "Agriculture",
        japanese_level: "Not started",
        skill_certificate: "Preparing",
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
    <div className="relative overflow-hidden bg-gradient-to-b from-rose-50 via-white to-emerald-50 pb-24">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_rgba(220,38,38,0.10),_transparent_45%),radial-gradient(circle_at_top_left,_rgba(5,150,105,0.10),_transparent_40%)]" />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <section className="rounded-3xl border border-rose-100 bg-white/90 p-6 shadow-xl shadow-rose-100/40 sm:p-8">
          <p className="inline-flex items-center rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">Limited Intake 2026</p>
          <h1 className="mt-4 text-3xl font-black leading-tight text-slate-900 sm:text-5xl">জরুরী ভিত্তিতে জাপানে কর্মী নিয়োগ শুরু</h1>
          <p className="mt-3 text-xl font-bold text-emerald-700">SSW Agriculture &amp; Caregiver Visa</p>
          <p className="mt-2 max-w-2xl text-sm text-slate-700 sm:text-base">N4 পাশ এবং স্কিল টেস্ট সার্টিফিকেট থাকলে এখনই আবেদন করুন</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#apply" className="inline-flex items-center rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-700/30 transition hover:bg-emerald-800">এখনই আবেদন করুন <ChevronRight className="ml-1 h-4 w-4" /></a>
            <Link
              href="https://wa.me/8800000000000"
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
            <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-slate-700 sm:grid-cols-2">
              {["সঠিক গাইডলাইন", "ডকুমেন্টেশন সাপোর্ট", "ইন্টারভিউ প্রস্তুতি", "দ্রুত যোগাযোগ", "জাপান-কেন্দ্রিক বাস্তব পরামর্শ"].map((item) => (
                <div key={item} className="rounded-xl bg-slate-50 p-3">{item}</div>
              ))}
            </div>
          </article>
        </section>

        <section id="apply" className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/40 sm:p-8">
          <h2 className="text-2xl font-black text-slate-900">এখনই আবেদন করুন</h2>
          <p className="mt-1 text-sm text-slate-600">আপনার তথ্য দিন, আমাদের টিম দ্রুত যোগাযোগ করবে।</p>
          <form onSubmit={submit} className="mt-5 space-y-3">
            <Input required placeholder="নাম" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input required placeholder="ফোন" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={form.visa_interest} onChange={(e) => setForm({ ...form, visa_interest: e.target.value as VisaInterest })}><option>Agriculture</option><option>Caregiver</option></select>
            <select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={form.japanese_level} onChange={(e) => setForm({ ...form, japanese_level: e.target.value as JapaneseLevel })}><option>N5</option><option>N4</option><option>N3+</option><option>Not started</option></select>
            <select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={form.skill_certificate} onChange={(e) => setForm({ ...form, skill_certificate: e.target.value as SkillCertificate })}><option>Yes</option><option>No</option><option>Preparing</option></select>
            <Textarea rows={4} placeholder="বার্তা" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            <Button type="submit" disabled={submitting} className="h-11 w-full bg-rose-600 text-base hover:bg-rose-700">{submitting ? "জমা হচ্ছে..." : "আবেদন সাবমিট করুন"}</Button>
          </form>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-3 gap-2 border-t border-slate-200 bg-white/95 p-2 backdrop-blur sm:hidden">
        <a href="tel:+8800000000000" className="inline-flex items-center justify-center gap-1 rounded-lg bg-slate-100 p-2 text-xs font-medium text-slate-800"><PhoneCall className="h-3.5 w-3.5" />Call</a>
        <Link href="https://wa.me/8800000000000" target="_blank" className="inline-flex items-center justify-center rounded-lg bg-emerald-100 p-2 text-xs font-semibold text-emerald-900" onClick={() => trackWhatsAppClick("SSW Sticky")}>WhatsApp</Link>
        <a href="#apply" className="inline-flex items-center justify-center rounded-lg bg-rose-600 p-2 text-xs font-semibold text-white">Apply Now</a>
      </div>

      <div className="pointer-events-none absolute right-3 top-16 hidden rounded-full bg-white/80 px-3 py-2 text-xs font-semibold text-rose-700 shadow sm:flex">
        <Stethoscope className="mr-1 h-3.5 w-3.5" /> Agriculture &amp; Caregiver Intake Open
      </div>
    </div>
  );
}
