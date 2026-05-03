"use client";
import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { trackLead, trackViewContent } from "@/lib/meta-pixel";

type VisaInterest = "Agriculture" | "Caregiver";
type JapaneseLevel = "N5" | "N4" | "N3+" | "Not started";
type SkillCertificate = "Yes" | "No" | "Preparing";

export default function SswVisaLandingClient() {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", visa_interest: "Agriculture" as VisaInterest, japanese_level: "Not started" as JapaneseLevel, skill_certificate: "Preparing" as SkillCertificate, message: "" });

  useEffect(() => trackViewContent({ content_name: "SSW Visa Campaign", content_category: "Lead Generation" }), []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/ssw-visa-leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error();
      toast({ title: "আবেদন সফল", description: "আপনার আবেদন গ্রহণ করা হয়েছে। আমাদের টিম দ্রুত যোগাযোগ করবে।" });
      trackLead({ content_name: "SSW Visa Lead", content_category: form.visa_interest });
      setForm({ name: "", phone: "", visa_interest: "Agriculture", japanese_level: "Not started", skill_certificate: "Preparing", message: "" });
    } catch {
      toast({ title: "আবেদন ব্যর্থ হয়েছে", description: "দুঃখিত, আবেদন জমা হয়নি। অনুগ্রহ করে আবার চেষ্টা করুন।", variant: "destructive" });
    } finally { setSubmitting(false); }
  };

  return <div className="mx-auto max-w-5xl px-4 py-8 pb-24"><h1 className="text-3xl font-extrabold">জরুরী ভিত্তিতে জাপানে কর্মী নিয়োগ শুরু</h1><p className="mt-2">SSW Agriculture ও SSW Caregiver ভিসার জন্য আবেদন চলছে</p><div className="mt-4 flex gap-2"><a href="#apply" className="rounded bg-emerald-700 px-4 py-2 text-white">এখনই আবেদন করুন</a><Link href="https://wa.me/8800000000000" target="_blank" className="rounded border px-4 py-2">WhatsApp করুন</Link></div><div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">{[["ভিসার ধরন","SSW"],["ক্যাটাগরি","Agriculture / Caregiver"],["লোক নেওয়া হবে","২০ জন"],["বেতন","১ লাখ ৬০ হাজার থেকে ২ লাখ"],["ইন্টারভিউ","৭ই মে থেকে ১০ই মে ২০২৬ পর্যন্ত"]].map(([k,v])=><div key={k} className="rounded border p-3"><p className="text-xs">{k}</p><p className="font-semibold">{v}</p></div>)}</div><div className="mt-6 grid gap-4 sm:grid-cols-2"><div className="rounded border p-4"><h2 className="font-bold">Requirements</h2><ul className="list-disc pl-5 text-sm"><li>N4 পাশ (JLPT/JFT)</li><li>Agriculture/Caregiver skill test certificate</li><li>প্রয়োজনীয় ডকুমেন্ট প্রস্তুত থাকতে হবে</li></ul></div><div className="rounded border p-4"><h2 className="font-bold">Why KNLTC</h2><ul className="list-disc pl-5 text-sm"><li>সঠিক গাইডলাইন</li><li>ডকুমেন্টেশন সাপোর্ট</li><li>ইন্টারভিউ প্রস্তুতি</li><li>জাপান-কেন্দ্রিক বাস্তব পরামর্শ</li></ul></div></div><form id="apply" onSubmit={submit} className="mt-6 space-y-3 rounded border p-4"><Input required placeholder="নাম" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})}/><Input required placeholder="ফোন" value={form.phone} onChange={(e)=>setForm({...form,phone:e.target.value})}/><select className="h-10 w-full rounded border px-3" value={form.visa_interest} onChange={(e)=>setForm({...form,visa_interest:e.target.value as VisaInterest})}><option>Agriculture</option><option>Caregiver</option></select><select className="h-10 w-full rounded border px-3" value={form.japanese_level} onChange={(e)=>setForm({...form,japanese_level:e.target.value as JapaneseLevel})}><option>N5</option><option>N4</option><option>N3+</option><option>Not started</option></select><select className="h-10 w-full rounded border px-3" value={form.skill_certificate} onChange={(e)=>setForm({...form,skill_certificate:e.target.value as SkillCertificate})}><option>Yes</option><option>No</option><option>Preparing</option></select><Textarea rows={4} placeholder="বার্তা" value={form.message} onChange={(e)=>setForm({...form,message:e.target.value})}/><Button type="submit" disabled={submitting} className="w-full">{submitting?"জমা হচ্ছে...":"এখনই আবেদন করুন"}</Button></form><div className="fixed inset-x-0 bottom-0 grid grid-cols-3 gap-2 border-t bg-white p-2 sm:hidden"><a href="tel:+8800000000000" className="rounded bg-slate-100 p-2 text-center text-xs">Call</a><Link href="https://wa.me/8800000000000" target="_blank" className="rounded bg-emerald-100 p-2 text-center text-xs">WhatsApp</Link><a href="#apply" className="rounded bg-emerald-700 p-2 text-center text-xs text-white">Apply Now</a></div></div>;
}
