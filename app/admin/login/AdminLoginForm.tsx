"use client";

import { useState, useMemo, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  ArrowLeft,
  Globe,
  UserPlus,
  Phone,
  User,
  GraduationCap,
  CheckCircle2,
  MapPin,
  Eye,
  EyeOff,
  FileCheck2,
  Building2,
  ChevronDown,
  KeyRound,
} from "lucide-react";
import BrandLogo from "@/components/layout/BrandLogo";
import { getSystemAccounts, addCrmLead, type ServiceInterest } from "@/lib/knltc-cms-store";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { languageOptions, translate, type Language } from "@/lib/i18n";

export default function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/dashboard";
  const initialMode = searchParams.get("mode") === "register" ? "register" : "login";

  const { language, setLanguage } = useLanguage();

  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Registration state
  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regCity, setRegCity] = useState("");
  const [regEducation, setRegEducation] = useState("HSC / Equivalent");
  const [regInterest, setRegInterest] = useState<ServiceInterest>("STUDENT_VISA_REGULAR");
  const [regSuccess, setRegSuccess] = useState(false);

  const t = useMemo(
    () =>
      translate(
        {
          en: {
            backHome: "Back to Main Website",
            brandTag: "KNLTC Enterprise Workspace",
            brandHeadline: "Centralized Japan Admissions, COE Visa Pipeline & Language Academy Portal",
            brandSub:
              "Unified operational management for KNLTC administration, counseling officers, instructors, and enrolled visa candidates.",
            pillar1Title: "10-Stage COE & Embassy Pipeline",
            pillar1Desc: "Real-time tracking from initial sponsor audit to Certificate of Eligibility and VFS visa stamping.",
            pillar2Title: "Digital LMS & JLPT / SSW Academy",
            pillar2Desc: "Structured N5–N1 curriculum, mock visa interviews, and student attendance tracking.",
            pillar3Title: "Role-Based Access Governance",
            pillar3Desc: "Granular permissions controlled directly from the Main Admin command dashboard.",
            hqFooter: "Sky View Trade Valley (8th Floor), 66/1 VIP Road, Naya Paltan, Dhaka",
            portalTitle: "KNLTC Portal Login & Registration",
            portalSubtitle:
              "Sign in with admin-issued credentials or register your candidate profile",
            loginTab: "Portal Sign In",
            registerTab: "Candidate Registration",
            emailLabel: "Email or Login ID",
            emailPlaceholder: "Enter your assigned email or login ID",
            passwordLabel: "Password",
            passwordPlaceholder: "Enter your password",
            verifying: "Authenticating...",
            loginBtn: "Sign In to Portal",
            invalidCreds:
              "Invalid login details. Please use the email/ID and password issued from the Main Admin dashboard.",
            serverError: "Unable to connect to the server. Please try again.",
            footerBadge: "Role-Based Access Control",
            demoToggle: "Quick Demo Credentials (Testing)",
            demoSub: "Click any role below to auto-fill login credentials:",
            regTitle: "Candidate & Student Profile Registration",
            regDesc:
              "Register your profile for Japanese Language Course or Visa File Opening. Once enrolled, Main Admin will activate your portal login credentials.",
            nameLabel: "Full Name *",
            namePlaceholder: "Enter your full name as on passport/NID",
            phoneLabel: "Phone / WhatsApp Number *",
            phonePlaceholder: "017XXXXXXXX",
            regEmailLabel: "Email Address",
            regEmailPlaceholder: "you@example.com",
            cityLabel: "City / District",
            cityPlaceholder: "Dhaka / Khulna / Rajshahi",
            eduLabel: "Highest Education",
            eduPlaceholder: "HSC / Diploma / BSc",
            interestLabel: "Program of Interest",
            interests: {
              STUDENT_VISA_REGULAR: "Japan Student Visa (Regular Package)",
              STUDENT_VISA_PREMIUM: "Japan Student Visa (Premium Package)",
              JAPANESE_N5: "Japanese Language JLPT N5 Course",
              JAPANESE_N4: "Japanese Language JLPT N4 Course",
              SSW_CONSTRUCTION_SPECIAL: "SSW Construction Special Batch",
              SSW_CAREGIVER: "SSW Caregiver (Nursing)",
              SSW_FOOD_SERVICE: "SSW Food Service",
            },
            submitRegBtn: "Complete Profile Registration",
            submittingReg: "Submitting Profile...",
            regSuccessTitle: "Registration Completed Successfully",
            regSuccessDesc:
              "Your candidate profile has been created in our central system. Our counselor or Main Admin will review your file and issue your portal login credentials upon admission.",
            switchToLogin: "Return to Portal Sign In",
          },
          bn: {
            backHome: "মূল ওয়েবসাইটে ফিরে যান",
            brandTag: "KNLTC এন্টারপ্রাইজ ওয়ার্কস্পেস",
            brandHeadline: "জাপান উচ্চশিক্ষা, COE ভিসা প্রসেসিং এবং ল্যাঙ্গুয়েজ একাডেমি সেন্ট্রাল পোর্টাল",
            brandSub:
              "KNLTC প্রশাসন, কাউন্সেলর, ভাষা প্রশিক্ষক এবং ভর্তিকৃত শিক্ষার্থীদের ফাইল ও কোর্স অগ্রগতির সমন্বিত ডিজিটাল প্ল্যাটফর্ম।",
            pillar1Title: "১০-ধাপের COE ও ভিসা পাইপলাইন",
            pillar1Desc: "স্পন্সর ডকুমেন্ট অডিট থেকে শুরু করে জাপান ইমিগ্রেশন COE এবং এম্বাসি ভিসা স্ট্যাম্পিং ট্র্যাকিং।",
            pillar2Title: "ডিজিটাল LMS ও JLPT / SSW একাডেমি",
            pillar2Desc: "N5–N1 ভাষা কোর্স, মক ভিসা ইন্টারভিউ এবং ক্লাসরুম উপস্থিতির পূর্ণাঙ্গ ব্যবস্থাপনা।",
            pillar3Title: "অ্যাডমিন নিয়ন্ত্রিত অ্যাক্সেস সিস্টেম",
            pillar3Desc: "মেইন অ্যাডমিন ড্যাশবোর্ড থেকে প্রতিটি রোল এবং মডিউল পারমিশনের নিরাপদ নিয়ন্ত্রণ।",
            hqFooter: "স্কাই ভিউ ট্রেড ভ্যালি (৮ম তলা), ৬৬/১ ভিআইপি রোড, নয়া পল্টন, ঢাকা",
            portalTitle: "KNLTC পোর্টাল লগইন ও রেজিস্ট্রেশন",
            portalSubtitle:
              "অ্যাডমিন প্রদত্ত লগইন তথ্য দিয়ে প্রবেশ করুন অথবা নতুন প্রোফাইল নিবন্ধন করুন",
            loginTab: "পোর্টাল লগইন",
            registerTab: "নতুন রেজিস্ট্রেশন",
            emailLabel: "ইমেইল অথবা লগইন আইডি",
            emailPlaceholder: "আপনার নির্ধারিত ইমেইল বা আইডি লিখুন",
            passwordLabel: "পাসওয়ার্ড",
            passwordPlaceholder: "আপনার পাসওয়ার্ড লিখুন",
            verifying: "যাচাই করা হচ্ছে...",
            loginBtn: "পোর্টালে প্রবেশ করুন",
            invalidCreds:
              "লগইন তথ্য সঠিক নয়। মেইন অ্যাডমিন থেকে প্রদত্ত ইমেইল ও পাসওয়ার্ড ব্যবহার করুন।",
            serverError:
              "সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি। অনুগ্রহ করে পুনরায় চেষ্টা করুন।",
            footerBadge: "অ্যাডমিন নিয়ন্ত্রিত নিরাপত্তা",
            demoToggle: "কুইক ডেমো লগইন (পরীক্ষামূলক)",
            demoSub: "যেকোনো রোলে ক্লিক করে সহজে লগইন তথ্য পূরণ করুন:",
            regTitle: "নতুন শিক্ষার্থী / প্রার্থী প্রোফাইল নিবন্ধন",
            regDesc:
              "জাপানি ভাষা কোর্স বা ভিসা ফাইল ওপেনিংয়ের জন্য আপনার প্রোফাইল নিবন্ধন করুন। ভর্তি সম্পন্ন হলে অ্যাডমিন আপনার লগইন অ্যাক্সেস চালু করে দেবেন।",
            nameLabel: "পূর্ণ নাম *",
            namePlaceholder: "পাসপোর্ট বা এনআইডি অনুযায়ী পূর্ণ নাম",
            phoneLabel: "ফোন / WhatsApp নম্বর *",
            phonePlaceholder: "017XXXXXXXX",
            regEmailLabel: "ইমেইল ঠিকানা",
            regEmailPlaceholder: "example@email.com",
            cityLabel: "জেলা / শহর",
            cityPlaceholder: "ঢাকা / খুলনা / রাজশাহী",
            eduLabel: "সর্বশেষ শিক্ষাগত যোগ্যতা",
            eduPlaceholder: "HSC / Diploma / Honours",
            interestLabel: "আগ্রহের কোর্স বা ভিসা প্রোগ্রাম",
            interests: {
              STUDENT_VISA_REGULAR: "জাপান স্টুডেন্ট ভিসা (রেগুলার প্যাকেজ)",
              STUDENT_VISA_PREMIUM: "জাপান স্টুডেন্ট ভিসা (প্রিমিয়াম প্যাকেজ)",
              JAPANESE_N5: "জাপানি ভাষা JLPT N5 কোর্স",
              JAPANESE_N4: "জাপানি ভাষা JLPT N4 কোর্স",
              SSW_CONSTRUCTION_SPECIAL: "SSW কনস্ট্রাকশন স্পেশাল ব্যাচ",
              SSW_CAREGIVER: "SSW কেয়ারগিভার (নার্সিং)",
              SSW_FOOD_SERVICE: "SSW ফুড সার্ভিস",
            },
            submitRegBtn: "রেজিস্ট্রেশন সম্পন্ন করুন",
            submittingReg: "জমা হচ্ছে...",
            regSuccessTitle: "প্রোফাইল রেজিস্ট্রেশন সম্পন্ন হয়েছে",
            regSuccessDesc:
              "আমাদের কেন্দ্রীয় সিস্টেমে আপনার প্রোফাইল তৈরি হয়েছে। আমাদের কাউন্সেলর আপনার সাথে যোগাযোগ করবেন এবং ফাইল ওপেন সম্পন্ন হলে অ্যাডমিন ড্যাশবোর্ড থেকে আপনার লগইন অ্যাক্সেস প্রদান করা হবে।",
            switchToLogin: "লগইন পেইজে ফিরে যান",
          },
          ja: {
            backHome: "メインサイトに戻る",
            brandTag: "KNLTC 統合管理システム",
            brandHeadline: "日本留学・特定技能ビザ申請・日本語アカデミー統合ポータル",
            brandSub:
              "KNLTC本部管理者、カウンセラー、日本語講師、および登録受講生向けの公式業務・進捗管理システム。",
            pillar1Title: "10段階のCOE・ビザ申請管理",
            pillar1Desc: "書類審査から出入国在留管理局へのCOE申請、大使館面接までを一元管理。",
            pillar2Title: "デジタルLMS・JLPT/SSW講座",
            pillar2Desc: "N5〜N1カリキュラム、模擬面接、出席・成績データのリアルタイム連携。",
            pillar3Title: "ロールベース権限管理",
            pillar3Desc: "メイン管理者ダッシュボードから各担当者と受講生のアクセス権を厳格に制御。",
            hqFooter: "Sky View Trade Valley (8F), 66/1 VIP Road, Naya Paltan, Dhaka",
            portalTitle: "KNLTC ポータル ログイン・新規登録",
            portalSubtitle:
              "管理者から発行された認証情報でログインするか、新規候補者プロフィールを登録してください",
            loginTab: "ポータルログイン",
            registerTab: "新規候補者登録",
            emailLabel: "メールアドレス または ログインID",
            emailPlaceholder: "指定されたメールアドレスまたはIDを入力",
            passwordLabel: "パスワード",
            passwordPlaceholder: "パスワードを入力",
            verifying: "認証中...",
            loginBtn: "ポータルにログイン",
            invalidCreds:
              "ログイン情報が正しくありません。メイン管理者から発行されたIDとパスワードをご使用ください。",
            serverError: "サーバーに接続できませんでした。もう一度お試しください。",
            footerBadge: "ロールベース認証システム",
            demoToggle: "デモ用クイックログイン",
            demoSub: "ロールを選択して認証情報を自動入力:",
            regTitle: "新規受講生・応募者プロフィール登録",
            regDesc:
              "日本語コースまたはビザ申請のためにプロフィールを登録してください。入学・ファイル開設後、管理者がログイン権限を有効化します。",
            nameLabel: "氏名 *",
            namePlaceholder: "氏名を入力してください",
            phoneLabel: "電話番号 / WhatsApp *",
            phonePlaceholder: "017XXXXXXXX",
            regEmailLabel: "メールアドレス",
            regEmailPlaceholder: "you@example.com",
            cityLabel: "都市 / 地域",
            cityPlaceholder: "ダッカ / クルナ",
            eduLabel: "最終学歴",
            eduPlaceholder: "HSC / 短大 / 大学卒",
            interestLabel: "希望プログラム・コース",
            interests: {
              STUDENT_VISA_REGULAR: "日本留学ビザ（レギュラーパッケージ）",
              STUDENT_VISA_PREMIUM: "日本留学ビザ（プレミアムパッケージ）",
              JAPANESE_N5: "日本語 JLPT N5コース",
              JAPANESE_N4: "日本語 JLPT N4コース",
              SSW_CONSTRUCTION_SPECIAL: "特定技能（建設）特別バッチ",
              SSW_CAREGIVER: "特定技能（介護）",
              SSW_FOOD_SERVICE: "特定技能（外食業）",
            },
            submitRegBtn: "登録を完了する",
            submittingReg: "送信中...",
            regSuccessTitle: "プロフィール登録が完了しました",
            regSuccessDesc:
              "システムにあなたの候補者プロフィールが作成されました。担当カウンセラーよりご連絡し、手続き完了後に管理者よりログイン情報が発行されます。",
            switchToLogin: "ログイン画面へ戻る",
          },
        },
        language,
      ),
    [language],
  );

  const demoAccounts = [
    { label: "Main Admin", email: "admin@knltc.com", pass: "knltc2026", badge: "Full Access" },
    { label: "Tele-Counselor", email: "counselor@knltc.com", pass: "counselor123", badge: "CRM & Visa" },
    { label: "Language Teacher", email: "teacher@knltc.com", pass: "teacher123", badge: "LMS & Batches" },
    { label: "Enrolled Student", email: "student@knltc.com", pass: "student123", badge: "My File & LMS" },
  ];

  const onLoginSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const clientAccounts = getSystemAccounts();
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
          clientAccounts,
        }),
      });

      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(payload?.error || t.invalidCreds);
        return;
      }

      const destination =
        nextPath &&
        (nextPath.startsWith("/dashboard") ||
          nextPath.startsWith("/admin") ||
          nextPath.startsWith("/portal"))
          ? nextPath
          : "/dashboard";

      router.push(destination);
      router.refresh();
    } catch {
      setError(t.serverError);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onRegisterSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!regName.trim() || !regPhone.trim()) return;
    setError(null);
    setIsSubmitting(true);

    try {
      addCrmLead({
        name: regName.trim(),
        phone: regPhone.trim(),
        whatsapp: regPhone.trim().startsWith("+88") ? regPhone.trim() : `+88${regPhone.trim()}`,
        email: regEmail.trim(),
        city: regCity.trim() || "Dhaka",
        source: "WEBSITE_FORM",
        interest: regInterest,
        status: "NEW",
        education: regEducation.trim() || "HSC",
        japaneseProficiency: "NONE",
        studyGapYears: 0,
        assignedTo: "Sumaiya Sultana (Tele-Counselor)",
        branch: "DHK-HQ",
        notes: `Self-registered via Portal Registration (${regInterest})`,
        followUpDate: new Date().toISOString().slice(0, 10),
      });

      await fetch("/api/crm-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regName.trim(),
          phone: regPhone.trim(),
          email: regEmail.trim() || null,
          interest: regInterest,
          source: "portal_registration",
          message: `City: ${regCity || "Dhaka"}, Education: ${regEducation}`,
        }),
      }).catch(() => null);

      setRegSuccess(true);
    } catch {
      setError(t.serverError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-12 bg-slate-50">
      {/* Left Column: KNLTC Institutional Brand Showcase Panel */}
      <div className="hidden lg:flex lg:col-span-5 xl:col-span-5 bg-slate-950 text-white flex-col justify-between p-10 xl:p-12 relative overflow-hidden border-r border-slate-800">
        {/* Subtle architectural background accents */}
        <div className="absolute -top-28 -left-28 h-80 w-80 rounded-full bg-[#b91c1c]/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 -right-24 h-80 w-80 rounded-full bg-emerald-600/10 blur-3xl pointer-events-none" />

        {/* Top Brand Identity */}
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <BrandLogo inverse subtitle="Japan Gateway" badge="PORTAL" />
          </div>

          <div className="mt-10">
            <div className="inline-flex items-center gap-2 rounded-md bg-white/5 border border-white/10 px-3 py-1 text-[11px] font-semibold text-red-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>{t.brandTag}</span>
            </div>

            <h2 className="mt-4 text-2xl xl:text-3xl font-bold tracking-tight text-white leading-snug">
              {t.brandHeadline}
            </h2>

            <p className="mt-3 text-sm text-slate-300 leading-relaxed">
              {t.brandSub}
            </p>
          </div>

          {/* 3 Institutional Capability Pillars */}
          <div className="mt-9 space-y-4">
            <div className="flex items-start gap-3.5 rounded-xl border border-slate-800/90 bg-slate-900/60 p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-500/15 border border-red-500/30 text-red-300">
                <FileCheck2 className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">{t.pillar1Title}</h3>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">{t.pillar1Desc}</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 rounded-xl border border-slate-800/90 bg-slate-900/60 p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                <GraduationCap className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">{t.pillar2Title}</h3>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">{t.pillar2Desc}</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 rounded-xl border border-slate-800/90 bg-slate-900/60 p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-300">
                <Building2 className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">{t.pillar3Title}</h3>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">{t.pillar3Desc}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Headquarters Footer */}
        <div className="relative z-10 pt-8 border-t border-slate-800/80 flex items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 text-red-400 shrink-0" />
            <span>{t.hqFooter}</span>
          </div>
        </div>
      </div>

      {/* Right Column: Authentication & Registration Form Workspace */}
      <div className="lg:col-span-7 xl:col-span-7 flex flex-col justify-between p-6 sm:p-10 lg:p-12 bg-white">
        {/* Top Utility Navigation */}
        <div className="flex items-center justify-between gap-4 max-w-lg w-full mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors py-1.5 px-2.5 rounded-lg hover:bg-slate-100"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{t.backHome}</span>
          </Link>

          <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5">
            <Globe className="h-3.5 w-3.5 text-[#b91c1c]" />
            <select
              aria-label="Language"
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
            >
              {languageOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="text-slate-900 bg-white">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Center Authentication Container */}
        <div className="my-auto py-8 max-w-lg w-full mx-auto">
          {/* Official KNLTC Brand Header (Replaces placeholder KN box) */}
          <div className="flex items-start gap-4 mb-7">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-xs p-1 flex items-center justify-center">
              <Image
                src="/brand/knltc-logo.svg"
                alt="KNLTC Official Logo"
                width={48}
                height={48}
                priority
                referrerPolicy="no-referrer"
                className="object-contain"
              />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
                {t.portalTitle}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                {t.portalSubtitle}
              </p>
            </div>
          </div>

          {/* Segmented Mode Switcher: Sign In vs Candidate Registration */}
          <div className="grid grid-cols-2 gap-1.5 rounded-xl bg-slate-100 p-1 mb-6 border border-slate-200/80">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError(null);
              }}
              className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs sm:text-sm font-semibold transition-all ${
                mode === "login"
                  ? "bg-white text-slate-900 shadow-2xs border border-slate-200/60"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Lock className={`h-3.5 w-3.5 ${mode === "login" ? "text-[#b91c1c]" : "text-slate-400"}`} />
              <span>{t.loginTab}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setError(null);
                setRegSuccess(false);
              }}
              className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs sm:text-sm font-semibold transition-all ${
                mode === "register"
                  ? "bg-white text-slate-900 shadow-2xs border border-slate-200/60"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <UserPlus className={`h-3.5 w-3.5 ${mode === "register" ? "text-[#15803d]" : "text-slate-400"}`} />
              <span>{t.registerTab}</span>
            </button>
          </div>

          {mode === "login" ? (
            <div className="space-y-5">
              <form className="space-y-4" onSubmit={onLoginSubmit}>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {t.emailLabel}
                  </label>
                  <div className="relative">
                    <Mail className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#b91c1c] focus:outline-hidden focus:ring-2 focus:ring-[#b91c1c]/15 transition"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t.emailPlaceholder}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {t.passwordLabel}
                  </label>
                  <div className="relative">
                    <Lock className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-10 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#b91c1c] focus:outline-hidden focus:ring-2 focus:ring-[#b91c1c]/15 transition"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t.passwordPlaceholder}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-0.5"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50/80 p-3.5 text-xs text-red-700 font-medium leading-relaxed">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#b91c1c] hover:bg-red-800 py-3 text-sm font-semibold text-white shadow-xs transition disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span>{t.verifying}</span>
                  ) : (
                    <>
                      <span>{t.loginBtn}</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Collapsible Demo Credentials Helper */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowDemoAccounts((prev) => !prev)}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <KeyRound className="h-3.5 w-3.5 text-[#b91c1c]" />
                    <span>{t.demoToggle}</span>
                  </span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${showDemoAccounts ? "rotate-180" : ""}`}
                  />
                </button>

                {showDemoAccounts && (
                  <div className="px-4 pb-3.5 pt-1 border-t border-slate-200/80 space-y-2">
                    <p className="text-[11px] text-slate-500">{t.demoSub}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {demoAccounts.map((acc) => (
                        <button
                          key={acc.email}
                          type="button"
                          onClick={() => {
                            setEmail(acc.email);
                            setPassword(acc.pass);
                            setError(null);
                          }}
                          className="flex flex-col items-start rounded-lg border border-slate-200 bg-white p-2 text-left hover:border-red-300 hover:bg-red-50/30 transition"
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="text-xs font-bold text-slate-800">{acc.label}</span>
                            <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                              {acc.badge}
                            </span>
                          </div>
                          <span className="text-[11px] font-mono text-slate-500 mt-0.5">{acc.email}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : regSuccess ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6 text-center space-y-3.5">
              <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">{t.regSuccessTitle}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{t.regSuccessDesc}</p>
              <button
                type="button"
                onClick={() => {
                  setRegSuccess(false);
                  setMode("login");
                }}
                className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition"
              >
                <span>{t.switchToLogin}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={onRegisterSubmit}>
              <div className="rounded-xl bg-slate-50 border border-slate-200/90 p-3.5">
                <p className="text-xs font-bold text-slate-900">{t.regTitle}</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{t.regDesc}</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.nameLabel}
                </label>
                <div className="relative">
                  <User className="h-4 w-4 text-slate-400 absolute left-3.5 top-2.5" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder={t.namePlaceholder}
                    className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:border-[#15803d] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.phoneLabel}
                  </label>
                  <div className="relative">
                    <Phone className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder={t.phonePlaceholder}
                      className="w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3 py-2 text-xs sm:text-sm font-mono text-slate-900 focus:border-[#15803d] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.cityLabel}
                  </label>
                  <div className="relative">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={regCity}
                      onChange={(e) => setRegCity(e.target.value)}
                      placeholder={t.cityPlaceholder}
                      className="w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-900 focus:border-[#15803d] focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.regEmailLabel}
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder={t.regEmailPlaceholder}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs sm:text-sm text-slate-900 focus:border-[#15803d] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.eduLabel}
                  </label>
                  <input
                    type="text"
                    value={regEducation}
                    onChange={(e) => setRegEducation(e.target.value)}
                    placeholder={t.eduPlaceholder}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs sm:text-sm text-slate-900 focus:border-[#15803d] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.interestLabel}
                </label>
                <div className="relative">
                  <GraduationCap className="h-4 w-4 text-slate-400 absolute left-3.5 top-2.5" />
                  <select
                    value={regInterest}
                    onChange={(e) => setRegInterest(e.target.value as ServiceInterest)}
                    className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3.5 py-2 text-xs sm:text-sm font-medium text-slate-900 focus:border-[#15803d] focus:outline-hidden"
                  >
                    {Object.entries(t.interests).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 font-medium leading-relaxed">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#15803d] hover:bg-emerald-800 py-3 text-sm font-semibold text-white shadow-xs transition disabled:opacity-70"
              >
                <UserPlus className="h-4 w-4" />
                <span>{isSubmitting ? t.submittingReg : t.submitRegBtn}</span>
              </button>
            </form>
          )}
        </div>

        {/* Bottom Security Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 max-w-lg w-full mx-auto">
          <span className="inline-flex items-center gap-1.5 text-slate-600 font-medium">
            <ShieldCheck className="h-4 w-4 text-[#15803d]" />
            <span>{t.footerBadge}</span>
          </span>
          <span className="font-medium text-slate-400">KNLTC Japan Gateway</span>
        </div>
      </div>
    </div>
  );
}
