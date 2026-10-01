"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ChevronRight,
  Leaf,
  Lock,
  MessageCircle,
  PhoneCall,
  ShieldCheck,
  Timer,
  UserCheck,
  Users,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";
import { trackLead, trackWhatsAppClick } from "@/lib/meta-pixel";

type VisaInterest = "Agriculture" | "Caregiver";
type JapaneseLevel = "N4 Passed" | "N5 Passed" | "Preparing for N4";
type SkillCertificate = "Yes" | "No";

const WHATSAPP_URL =
  "https://wa.me/8801805013633?text=%E0%A6%86%E0%A6%AE%E0%A6%BF%20SSW%20%E0%A6%AD%E0%A6%BF%E0%A6%B8%E0%A6%BE%20%E0%A6%B8%E0%A6%AE%E0%A7%8D%E0%A6%AA%E0%A6%B0%E0%A7%8D%E0%A6%95%E0%A7%87%20%E0%A6%9C%E0%A6%BE%E0%A6%A8%E0%A6%A4%E0%A7%87%20%E0%A6%9A%E0%A6%BE%E0%A6%87";

export default function SswVisaLandingClient() {
  const { toast } = useToast();
  const { language } = useLanguage();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    visa_interest: "Agriculture" as VisaInterest,
    japanese_level: "Preparing for N4" as JapaneseLevel,
    skill_certificate: "No" as SkillCertificate,
    message: "",
  });

  const t = translate(
    {
      en: {
        badge: "Limited Intake 2026",
        h1: "Urgent Japanese Workforce Recruitment Ongoing",
        sub: "SSW Agriculture & Caregiver Visa",
        lead: "If you have passed N4 and hold a skill test certificate, apply now.",
        ctaApply: "Apply Now",
        ctaWhatsapp: "WhatsApp Us",
        callNow: "Call",
        cards: [
          { label: "Visa Type", value: "SSW (Specified Skilled Worker)", icon: ShieldCheck },
          { label: "Category", value: "Agriculture / Caregiver", icon: Leaf },
          { label: "Vacancies", value: "20 Persons", icon: Users },
          { label: "Salary", value: "¥160,000 - ¥200,000 / month", icon: Wallet },
          { label: "Interview Window", value: "May 7 - May 10, 2026", icon: Timer },
        ],
        reqTitle: "Requirements",
        reqItems: [
          "N4 Passed (JLPT or JFT-Basic)",
          "Agriculture or Caregiver skill test certificate",
          "Valid passport and educational documents ready",
        ],
        whyTitle: "Why KNLTC?",
        whyItems: [
          "Transparent Guidance",
          "Documentation Support",
          "Interview Prep",
          "Prompt Communication",
          "Real Japan-Focused Advice",
        ],
        bannerTag: "Are you eligible?",
        bannerH2: "Passed N4 and hold a skill test certificate? Apply right away.",
        bannerBtn: "Fill the Application",
        formBadge: "Limited Seats • Fast Response • Official Guidance",
        formTitle: "SSW Visa Application Form",
        formSub: "Submit your details below and our team will get in touch promptly.",
        labelName: "Your Full Name *",
        placeholderName: "Full Name",
        labelPhone: "Phone Number *",
        placeholderPhone: "Phone Number",
        phoneNote: "Provide a working number; our team will call or WhatsApp here.",
        labelInterest: "Which Category Are You Interested In?",
        interestOptions: ["Agriculture", "Caregiver"],
        labelLevel: "Your Japanese Language Level",
        levelOptions: ["N4 Passed", "N5 Passed", "Preparing for N4"],
        labelCert: "Do you have a Skill Test Certificate?",
        certOptions: [
          { label: "Yes", value: "Yes" },
          { label: "No", value: "No" },
        ],
        labelMessage: "Additional Message (Optional)",
        placeholderMessage: "Write your past experience, qualifications, or queries...",
        safeNote: "Your data is kept confidential and used solely by KNLTC for guidance.",
        btnSubmit: "Submit Application",
        btnSubmitting: "Submitting...",
        fasterTitle: "Want a faster response?",
        successTitle: "Application Submitted",
        successDesc: "Your application was received. Our team will contact you soon.",
        failedTitle: "Submission Failed",
        failedDesc: "Sorry, submission failed. Please try again or WhatsApp us.",
        intakeOpen: "Agriculture & Caregiver Intake Open",
      },
      bn: {
        badge: "লিমিটেড ইনটেক ২০২৬",
        h1: "জরুরী ভিত্তিতে জাপানে কর্মী নিয়োগ শুরু",
        sub: "SSW Agriculture & Caregiver Visa",
        lead: "N4 পাশ এবং স্কিল টেস্ট সার্টিফিকেট থাকলে এখনই আবেদন করুন",
        ctaApply: "এখনই আবেদন করুন",
        ctaWhatsapp: "WhatsApp করুন",
        callNow: "কল",
        cards: [
          { label: "ভিসার ধরন", value: "SSW", icon: ShieldCheck },
          { label: "ক্যাটাগরি", value: "Agriculture / Caregiver", icon: Leaf },
          { label: "লোক নেওয়া হবে", value: "২০ জন", icon: Users },
          { label: "বেতন", value: "১ লাখ ৬০ হাজার থেকে ২ লাখ", icon: Wallet },
          { label: "ইন্টারভিউ", value: "৭ই মে থেকে ১০ই মে ২০২৬ পর্যন্ত", icon: Timer },
        ],
        reqTitle: "যোগ্যতা ও শর্তাবলী",
        reqItems: [
          "N4 পাশ (JLPT/JFT)",
          "Agriculture/Caregiver স্কিল টেস্ট সার্টিফিকেট",
          "প্রয়োজনীয় ডকুমেন্ট প্রস্তুত থাকতে হবে",
        ],
        whyTitle: "কেন KNLTC?",
        whyItems: [
          "সঠিক গাইডলাইন",
          "ডকুমেন্টেশন সাপোর্ট",
          "ইন্টারভিউ প্রস্তুতি",
          "দ্রুত যোগাযোগ",
          "জাপান-কেন্দ্রিক বাস্তব পরামর্শ",
        ],
        bannerTag: "আপনি কি যোগ্য?",
        bannerH2: "N4 পাশ এবং স্কিল টেস্ট সার্টিফিকেট থাকলে এখনই আবেদন করুন।",
        bannerBtn: "ফরম পূরণ করুন",
        formBadge: "সীমিত আসন • দ্রুত যোগাযোগ • সঠিক গাইডলাইন",
        formTitle: "এখনই আবেদন করুন",
        formSub: "আপনার তথ্য দিন, আমাদের টিম দ্রুত যোগাযোগ করবে।",
        labelName: "আপনার নাম *",
        placeholderName: "নাম",
        labelPhone: "মোবাইল নম্বর *",
        placeholderPhone: "মোবাইল নম্বর",
        phoneNote: "সঠিক নম্বর দিন, এই নম্বরেই আমাদের টিম যোগাযোগ করবে।",
        labelInterest: "কোন ক্যাটাগরিতে আগ্রহী?",
        interestOptions: ["Agriculture", "Caregiver"],
        labelLevel: "আপনার জাপানি ভাষার লেভেল",
        levelOptions: ["N4 Passed", "N5 Passed", "Preparing for N4"],
        labelCert: "স্কিল টেস্ট সার্টিফিকেট আছে?",
        certOptions: [
          { label: "হ্যাঁ (Yes)", value: "Yes" },
          { label: "না (No)", value: "No" },
        ],
        labelMessage: "অতিরিক্ত বার্তা",
        placeholderMessage: "আপনার অভিজ্ঞতা বা প্রশ্ন লিখুন...",
        safeNote: "আপনার তথ্য নিরাপদ থাকবে এবং শুধুমাত্র KNLTC যোগাযোগের জন্য ব্যবহার করবে।",
        btnSubmit: "আবেদন সাবমিট করুন",
        btnSubmitting: "জমা হচ্ছে...",
        fasterTitle: "আরও দ্রুত উত্তর চান?",
        successTitle: "আবেদন সফল",
        successDesc: "আপনার আবেদন গ্রহণ করা হয়েছে। আমাদের টিম দ্রুত যোগাযোগ করবে।",
        failedTitle: "আবেদন ব্যর্থ হয়েছে",
        failedDesc: "দুঃখিত, আবেদন সাবমিট হয়নি। আবার চেষ্টা করুন অথবা WhatsApp করুন।",
        intakeOpen: "Agriculture & Caregiver Intake Open",
      },
      ja: {
        badge: "2026年度 限定募集",
        h1: "日本での特定技能（SSW）緊急人材採用開始",
        sub: "特定技能 農業・介護分野ビザ",
        lead: "日本語N4合格および技能試験合格済みの方、今すぐご応募ください。",
        ctaApply: "今すぐ応募",
        ctaWhatsapp: "WhatsAppで相談",
        callNow: "電話",
        cards: [
          { label: "ビザの種類", value: "特定技能（SSW）", icon: ShieldCheck },
          { label: "分野", value: "農業 / 介護", icon: Leaf },
          { label: "採用予定数", value: "20名", icon: Users },
          { label: "想定月給", value: "160,000円〜200,000円", icon: Wallet },
          { label: "面接期間", value: "2026年5月7日〜10日", icon: Timer },
        ],
        reqTitle: "応募条件",
        reqItems: [
          "JLPT N4またはJFT-Basic合格",
          "農業または介護分野の技能評価試験合格証",
          "パスポートおよび各種証明書類の準備",
        ],
        whyTitle: "KNLTCが選ばれる理由",
        whyItems: [
          "明確なガイダンス",
          "書類準備支援",
          "面接シミュレーション",
          "迅速な連絡体制",
          "日本現地基準の実践助言",
        ],
        bannerTag: "応募対象者の方へ",
        bannerH2: "N4合格および技能評価試験合格済みの方はすぐにご応募いただけます。",
        bannerBtn: "応募フォームへ進む",
        formBadge: "定員限定・迅速対応・公式ガイダンス",
        formTitle: "特定技能ビザ 応募フォーム",
        formSub: "必要事項を入力してください。担当スタッフが速やかにご連絡します。",
        labelName: "お名前 *",
        placeholderName: "お名前",
        labelPhone: "電話番号 *",
        placeholderPhone: "電話番号",
        phoneNote: "確実に連絡の取れる番号をご入力ください。",
        labelInterest: "ご希望の分野",
        interestOptions: ["Agriculture", "Caregiver"],
        labelLevel: "現在の日本語レベル",
        levelOptions: ["N4 Passed", "N5 Passed", "Preparing for N4"],
        labelCert: "技能試験合格証はお持ちですか？",
        certOptions: [
          { label: "はい (Yes)", value: "Yes" },
          { label: "いいえ (No)", value: "No" },
        ],
        labelMessage: "備考・ご質問（任意）",
        placeholderMessage: "職務経歴やご質問があればご記入ください...",
        safeNote: "個人情報は厳重に管理され、KNLTCの相談業務のみに利用されます。",
        btnSubmit: "申請を送信",
        btnSubmitting: "送信中...",
        fasterTitle: "より迅速な回答をご希望ですか？",
        successTitle: "申請が完了しました",
        successDesc: "ご応募ありがとうございます。担当者より近日中にご連絡いたします。",
        failedTitle: "送信に失敗しました",
        failedDesc: "恐れ入りますが、もう一度お試しいただくかWhatsAppでご連絡ください。",
        intakeOpen: "農業・介護分野 募集受付中",
      },
    },
    language,
  );

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
        title: t.successTitle,
        description: t.successDesc,
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
        title: t.failedTitle,
        description: t.failedDesc,
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
          <p className="inline-flex items-center rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
            {t.badge}
          </p>
          <h1 className="mt-4 max-w-4xl text-2xl font-black leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
            {t.h1}
          </h1>
          <p className="mt-3 text-xl font-bold text-emerald-700">{t.sub}</p>
          <p className="mt-2 max-w-2xl text-sm text-slate-700 sm:text-base">{t.lead}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#apply"
              className="inline-flex items-center rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-700/30 transition hover:bg-emerald-800"
            >
              {t.ctaApply} <ChevronRight className="ml-1 h-4 w-4" />
            </a>
            <Link
              href={WHATSAPP_URL}
              target="_blank"
              className="inline-flex items-center rounded-xl border border-emerald-300 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-100"
              onClick={() => trackWhatsAppClick("SSW Hero")}
            >
              <MessageCircle className="mr-1.5 h-4 w-4 text-emerald-700" />
              {t.ctaWhatsapp}
            </Link>
          </div>
        </section>

        <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {t.cards.map((item) => (
            <article key={item.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <item.icon className="mb-2 h-5 w-5 text-rose-600" />
              <p className="text-xs text-slate-500">{item.label}</p>
              <p className="mt-1 text-sm font-bold text-slate-900">{item.value}</p>
            </article>
          ))}
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-2">
          <article className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-extrabold text-slate-900">{t.reqTitle}</h2>
            <ul className="mt-3 space-y-3 text-sm text-slate-700">
              {t.reqItems.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-extrabold text-slate-900">{t.whyTitle}</h2>
            <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-slate-700 xl:grid-cols-2">
              {t.whyItems.map((item) => (
                <div key={item} className="rounded-xl bg-slate-50 p-3 font-medium">
                  {item}
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="mt-8 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-600 to-emerald-700 p-5 text-white shadow-xl shadow-emerald-700/30 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-100">{t.bannerTag}</p>
          <h2 className="mt-1 text-2xl font-black">{t.bannerH2}</h2>
          <a
            href="#apply"
            className="mt-4 inline-flex items-center rounded-xl bg-white px-4 py-2 text-sm font-bold text-emerald-800 transition hover:bg-emerald-50"
          >
            {t.bannerBtn} <ChevronRight className="ml-1 h-4 w-4" />
          </a>
        </section>

        <section id="apply" className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40 sm:p-9">
          <p className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            {t.formBadge}
          </p>
          <h2 className="mt-3 text-2xl font-black text-slate-900">{t.formTitle}</h2>
          <p className="mt-1 text-sm text-slate-600">{t.formSub}</p>
          <form onSubmit={submit} className="mt-8 space-y-6">
            <div className="grid gap-x-5 gap-y-5 md:grid-cols-2">
              <label className="space-y-1.5 text-sm font-medium text-slate-800">
                <span className="block">{t.labelName}</span>
                <Input
                  required
                  placeholder={t.placeholderName}
                  className="h-12 rounded-xl border-slate-300 px-4 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-emerald-500/80 focus-visible:ring-offset-0"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </label>

              <label className="space-y-1.5 text-sm font-medium text-slate-800">
                <span className="block">{t.labelPhone}</span>
                <Input
                  required
                  placeholder={t.placeholderPhone}
                  className="h-12 rounded-xl border-slate-300 px-4 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-emerald-500/80 focus-visible:ring-offset-0"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
                <p className="pt-0.5 text-xs leading-relaxed text-slate-500">{t.phoneNote}</p>
              </label>

              <label className="space-y-1.5 text-sm font-medium text-slate-800">
                <span className="block">{t.labelInterest}</span>
                <select
                  className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-emerald-500/80 focus-visible:ring-offset-0"
                  value={form.visa_interest}
                  onChange={(e) => setForm({ ...form, visa_interest: e.target.value as VisaInterest })}
                >
                  <option value="Agriculture">Agriculture</option>
                  <option value="Caregiver">Caregiver</option>
                </select>
              </label>

              <label className="space-y-1.5 text-sm font-medium text-slate-800">
                <span className="block">{t.labelLevel}</span>
                <select
                  className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-emerald-500/80 focus-visible:ring-offset-0"
                  value={form.japanese_level}
                  onChange={(e) => setForm({ ...form, japanese_level: e.target.value as JapaneseLevel })}
                >
                  <option value="N4 Passed">N4 Passed</option>
                  <option value="N5 Passed">N5 Passed</option>
                  <option value="Preparing for N4">Preparing for N4</option>
                </select>
              </label>

              <label className="space-y-1.5 text-sm font-medium text-slate-800 md:col-span-2">
                <span className="block">{t.labelCert}</span>
                <select
                  className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-emerald-500/80 focus-visible:ring-offset-0"
                  value={form.skill_certificate}
                  onChange={(e) => setForm({ ...form, skill_certificate: e.target.value as SkillCertificate })}
                >
                  {t.certOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="field-group mt-4">
              <label className="mb-2 block text-sm font-medium text-slate-800">{t.labelMessage}</label>
              <Textarea
                rows={5}
                placeholder={t.placeholderMessage}
                className="w-full min-h-32 rounded-xl border-slate-200 bg-slate-50/60 px-4 py-3.5 leading-relaxed placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-emerald-500/80 focus-visible:ring-offset-0"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </div>

            <p className="mt-4 flex items-start gap-2 rounded-xl bg-slate-100 px-4 py-3 text-[11px] leading-relaxed text-slate-600 sm:text-xs">
              <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-500" />
              {t.safeNote}
            </p>

            <Button
              type="submit"
              disabled={submitting}
              className="mt-6 h-[52px] w-full rounded-xl bg-rose-600 text-base font-semibold shadow-md shadow-rose-600/20 transition duration-200 hover:-translate-y-0.5 hover:bg-rose-700 hover:shadow-lg hover:shadow-rose-700/25 focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2"
            >
              {submitting ? t.btnSubmitting : t.btnSubmit}
            </Button>
          </form>
        </section>

        <section className="mt-6 rounded-2xl border border-emerald-200 bg-white p-5 text-center shadow-sm">
          <p className="text-sm text-slate-600">{t.fasterTitle}</p>
          <Link
            href={WHATSAPP_URL}
            target="_blank"
            onClick={() => trackWhatsAppClick("SSW Bottom CTA")}
            className="mt-3 inline-flex items-center rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-700"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            {t.ctaWhatsapp}
          </Link>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-3 gap-2 border-t border-slate-200 bg-white/95 p-2 backdrop-blur sm:hidden">
        <a
          href="tel:+8801805013633"
          className="inline-flex items-center justify-center gap-1 rounded-lg bg-slate-100 p-2 text-xs font-medium text-slate-800"
        >
          <PhoneCall className="h-3.5 w-3.5" />
          {t.callNow}
        </a>
        <Link
          href={WHATSAPP_URL}
          target="_blank"
          className="inline-flex items-center justify-center gap-1 rounded-lg bg-emerald-100 p-2 text-xs font-semibold text-emerald-900"
          onClick={() => trackWhatsAppClick("SSW Sticky")}
        >
          <MessageCircle className="h-3.5 w-3.5 text-emerald-700" />
          WhatsApp
        </Link>
        <a
          href="#apply"
          className="inline-flex items-center justify-center rounded-lg bg-rose-600 p-2 text-xs font-semibold text-white"
        >
          {t.ctaApply}
        </a>
      </div>

      <div className="pointer-events-none absolute right-3 top-16 hidden rounded-full bg-white/80 px-3 py-2 text-xs font-semibold text-rose-700 shadow sm:flex">
        <UserCheck className="mr-1 h-3.5 w-3.5" /> {t.intakeOpen}
      </div>
    </div>
  );
}
