"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";

type ContactFormState = { name: string; phone: string; interest: string; message: string };
const initialForm: ContactFormState = { name: "", phone: "", interest: "", message: "" };

export default function ContactForm() {
  const { toast } = useToast();
  const { language } = useLanguage();
  const t = translate(
    {
      en: { submitted: "Application submitted", thanks: "Thanks! Our team will contact you soon.", failed: "Submission failed", retry: "Please try again in a moment.", header: "Send Us a Message", name: "Your Name", phone: "Phone Number", interest: "Interest (e.g. Study in Japan, Work in Japan)", message: "Your Message", applying: "Submitting...", apply: "Apply Now" },
      bn: { submitted: "আবেদন জমা হয়েছে", thanks: "ধন্যবাদ! আমাদের টিম দ্রুত যোগাযোগ করবে।", failed: "জমা ব্যর্থ হয়েছে", retry: "কিছুক্ষণ পরে আবার চেষ্টা করুন।", header: "আমাদের মেসেজ দিন", name: "আপনার নাম", phone: "ফোন নম্বর", interest: "আগ্রহ (যেমন: জাপানে পড়াশোনা, জাপানে কাজ)", message: "আপনার বার্তা", applying: "জমা হচ্ছে...", apply: "এখনই আবেদন করুন" },
      ja: { submitted: "申請が送信されました", thanks: "ありがとうございます。担当者よりご連絡します。", failed: "送信に失敗しました", retry: "しばらくしてから再度お試しください。", header: "メッセージを送る", name: "お名前", phone: "電話番号", interest: "ご希望（例：日本留学、日本就職）", message: "メッセージ", applying: "送信中...", apply: "今すぐ応募" },
    },
    language,
  );

  const [form, setForm] = useState<ContactFormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!response.ok) throw new Error("Request failed");
      toast({ title: t.submitted, description: t.thanks });
      setForm(initialForm);
    } catch {
      toast({ title: t.failed, description: t.retry, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-lg border bg-card p-8 shadow-sm">
      <h3 className="mb-2 text-xl font-bold text-foreground">{t.header}</h3>
      <Input placeholder={t.name} required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
      <Input placeholder={t.phone} required value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
      <Input placeholder={t.interest} value={form.interest} onChange={(event) => setForm({ ...form, interest: event.target.value })} />
      <Textarea placeholder={t.message} rows={4} value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} />
      <Button disabled={submitting} type="submit" className="w-full bg-primary font-bold text-primary-foreground hover:bg-primary/90">{submitting ? t.applying : t.apply}</Button>
    </form>
  );
}
