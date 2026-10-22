"use client";

import { useState, useMemo, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
} from "lucide-react";
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
            portalTitle: "KNLTC Portal Login & Registration",
            portalSubtitle:
              "Sign in with admin-issued credentials or register your candidate profile",
            loginTab: "Portal Login",
            registerTab: "New Registration",
            emailLabel: "Email or Login ID",
            emailPlaceholder: "Enter your assigned email or login ID",
            passwordLabel: "Password",
            passwordPlaceholder: "••••••••",
            verifying: "Verifying credentials...",
            loginBtn: "Sign In to Portal",
            invalidCreds:
              "Invalid login details. Please use the email/ID and password issued from the Main Admin dashboard.",
            serverError: "Unable to connect to the server. Please try again.",
            footerBadge: "Admin-Controlled Access System",
            regTitle: "Create Candidate / Student Profile",
            regDesc:
              "Register your profile for Japanese Language Course or Visa File Opening. Once enrolled, Admin will activate your portal login.",
            nameLabel: "Full Name *",
            namePlaceholder: "Enter your full name",
            phoneLabel: "Phone / WhatsApp Number *",
            phonePlaceholder: "017XXXXXXXX",
            regEmailLabel: "Email Address",
            regEmailPlaceholder: "you@example.com",
            cityLabel: "City / District",
            cityPlaceholder: "Dhaka / Khulna",
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
            submitRegBtn: "Submit Registration",
            submittingReg: "Submitting...",
            regSuccessTitle: "Registration Completed Successfully!",
            regSuccessDesc:
              "Your candidate profile has been created in our CRM. Our counselor or Main Admin will review your profile and provide your portal login credentials upon admission / file opening.",
            switchToLogin: "Go to Login",
          },
          bn: {
            backHome: "মূল ওয়েবসাইটে ফিরে যান",
            portalTitle: "KNLTC পোর্টাল লগইন ও রেজিস্ট্রেশন",
            portalSubtitle:
              "অ্যাডমিন প্রদত্ত লগইন ডিটেইলস দিয়ে প্রবেশ করুন অথবা নতুন প্রোফাইল রেজিস্ট্রেশন করুন",
            loginTab: "পোর্টাল লগইন",
            registerTab: "নতুন রেজিস্ট্রেশন",
            emailLabel: "ইমেইল অথবা ইউজার আইডি (Email / Login ID)",
            emailPlaceholder: "আপনার নির্ধারিত ইমেইল বা আইডি লিখুন",
            passwordLabel: "পাসওয়ার্ড (Password)",
            passwordPlaceholder: "••••••••",
            verifying: "যাচাই করা হচ্ছে...",
            loginBtn: "লগইন করুন",
            invalidCreds:
              "লগইন তথ্য সঠিক নয়। মেইন অ্যাডমিন থেকে প্রদত্ত ইমেইল ও পাসওয়ার্ড ব্যবহার করুন।",
            serverError:
              "সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি। অনুগ্রহ করে পুনরায় চেষ্টা করুন।",
            footerBadge: "অ্যাডমিন নিয়ন্ত্রিত অ্যাক্সেস সিস্টেম",
            regTitle: "নতুন শিক্ষার্থী / প্রার্থী রেজিস্ট্রেশন",
            regDesc:
              "জাপানি ভাষা কোর্স বা ভিসা প্রসেসিংয়ের জন্য আপনার প্রোফাইল নিবন্ধন করুন। ভর্তি বা ফাইল ওপেন হলে অ্যাডমিন আপনার লগইন অ্যাক্সেস চালু করে দেবেন।",
            nameLabel: "পূর্ণ নাম *",
            namePlaceholder: "আপনার পূর্ণ নাম লিখুন",
            phoneLabel: "ফোন / WhatsApp নম্বর *",
            phonePlaceholder: "017XXXXXXXX",
            regEmailLabel: "ইমেইল ঠিকানা",
            regEmailPlaceholder: "example@email.com",
            cityLabel: "জেলা / শহর",
            cityPlaceholder: "ঢাকা / খুলনা",
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
            regSuccessTitle: "রেজিস্ট্রেশন সফলভাবে সম্পন্ন হয়েছে!",
            regSuccessDesc:
              "আমাদের সিস্টেমে আপনার ব্যক্তিগত প্রোফাইল তৈরি হয়েছে। আমাদের কাউন্সেলর আপনার সাথে যোগাযোগ করবেন এবং ভর্তি/ফাইল ওপেন সম্পন্ন হলে অ্যাডমিন ড্যাশবোর্ড থেকে আপনার লগইন ডিটেইলস প্রদান করা হবে।",
            switchToLogin: "লগইন পেইজে ফিরে যান",
          },
          ja: {
            backHome: "メインサイトに戻る",
            portalTitle: "KNLTC ポータル ログイン・新規登録",
            portalSubtitle:
              "管理者から発行された認証情報でログインするか、新規候補者プロフィールを登録してください",
            loginTab: "ログイン",
            registerTab: "新規登録",
            emailLabel: "メールアドレス または ログインID",
            emailPlaceholder: "指定されたメールアドレスまたはIDを入力",
            passwordLabel: "パスワード",
            passwordPlaceholder: "••••••••",
            verifying: "認証中...",
            loginBtn: "ログインする",
            invalidCreds:
              "ログイン情報が正しくありません。メイン管理者から発行されたIDとパスワードをご使用ください。",
            serverError: "サーバーに接続できませんでした。もう一度お試しください。",
            footerBadge: "管理者制御アクセスシステム",
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
            regSuccessTitle: "プロフィール登録が完了しました！",
            regSuccessDesc:
              "システムにあなたの候補者プロフィールが作成されました。担当カウンセラーよりご連絡し、手続き完了後に管理者よりログイン情報が発行されます。",
            switchToLogin: "ログイン画面へ戻る",
          },
        },
        language,
      ),
    [language],
  );

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
      // 1. Add to KNLTC Master CRM Store (creates individual Lead Profile)
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

      // 2. Also send to Supabase CRM table if available
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
    <div className="min-h-screen bg-[#fcfaf7] py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
      <div className="w-full max-w-md">
        {/* Top Bar: Back Link + Language Switcher */}
        <div className="mb-5 flex items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#b91c1c] transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{t.backHome}</span>
          </Link>

          <div className="flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-2.5 py-1 shadow-2xs">
            <Globe className="h-3.5 w-3.5 text-[#b91c1c]" />
            <select
              aria-label="Language"
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-hidden cursor-pointer"
            >
              {languageOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="text-slate-900 bg-white">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white p-7 sm:p-8 rounded-3xl border border-stone-200 shadow-xl">
          {/* Header */}
          <div className="flex items-center gap-3.5 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-[#b91c1c] text-white flex items-center justify-center font-black text-xl shadow-md shrink-0">
              KN
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-tight">
                {t.portalTitle}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{t.portalSubtitle}</p>
            </div>
          </div>

          {/* Mode Switcher Tabs: Login vs Registration */}
          <div className="grid grid-cols-2 gap-1.5 rounded-2xl bg-stone-100 p-1.5 mb-6 border border-stone-200/80">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError(null);
              }}
              className={`flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-extrabold transition ${
                mode === "login"
                  ? "bg-white text-[#b91c1c] shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Lock className="h-3.5 w-3.5" />
              <span>{t.loginTab}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setError(null);
                setRegSuccess(false);
              }}
              className={`flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-extrabold transition ${
                mode === "register"
                  ? "bg-white text-[#133e29] shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>{t.registerTab}</span>
            </button>
          </div>

          {mode === "login" ? (
            <form className="space-y-4" onSubmit={onLoginSubmit}>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t.emailLabel}
                </label>
                <div className="relative">
                  <Mail className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    className="w-full rounded-xl border border-stone-300 pl-10 pr-3.5 py-2.5 text-sm focus:border-[#b91c1c] focus:outline-hidden focus:ring-1 focus:ring-[#b91c1c]"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.emailPlaceholder}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t.passwordLabel}
                </label>
                <div className="relative">
                  <Lock className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    className="w-full rounded-xl border border-stone-300 pl-10 pr-3.5 py-2.5 text-sm focus:border-[#b91c1c] focus:outline-hidden focus:ring-1 focus:ring-[#b91c1c]"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t.passwordPlaceholder}
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-red-300 bg-red-50 p-3 text-xs text-red-700 font-semibold leading-relaxed">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#b91c1c] hover:bg-[#991b1b] py-3 text-sm font-bold text-white shadow-md transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>{t.verifying}</>
                ) : (
                  <>
                    <span>{t.loginBtn}</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          ) : regSuccess ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 text-center space-y-3">
              <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
              <h3 className="text-base font-black text-slate-900">{t.regSuccessTitle}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{t.regSuccessDesc}</p>
              <button
                type="button"
                onClick={() => {
                  setRegSuccess(false);
                  setMode("login");
                }}
                className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#133e29] px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-900 transition"
              >
                <span>{t.switchToLogin}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <form className="space-y-3.5" onSubmit={onRegisterSubmit}>
              <div className="rounded-xl bg-stone-50 border border-stone-200/80 p-3">
                <p className="text-xs font-extrabold text-slate-900">{t.regTitle}</p>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{t.regDesc}</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t.nameLabel}</label>
                <div className="relative">
                  <User className="h-4 w-4 text-slate-400 absolute left-3.5 top-2.5" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder={t.namePlaceholder}
                    className="w-full rounded-xl border border-stone-300 pl-10 pr-3.5 py-2 text-xs font-semibold focus:border-[#133e29] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
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
                      className="w-full rounded-xl border border-stone-300 pl-9 pr-3 py-2 text-xs font-mono font-semibold focus:border-[#133e29] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.cityLabel}
                  </label>
                  <div className="relative">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={regCity}
                      onChange={(e) => setRegCity(e.target.value)}
                      placeholder={t.cityPlaceholder}
                      className="w-full rounded-xl border border-stone-300 pl-9 pr-3 py-2 text-xs font-semibold focus:border-[#133e29] focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.regEmailLabel}
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder={t.regEmailPlaceholder}
                    className="w-full rounded-xl border border-stone-300 px-3 py-2 text-xs focus:border-[#133e29] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.eduLabel}
                  </label>
                  <input
                    type="text"
                    value={regEducation}
                    onChange={(e) => setRegEducation(e.target.value)}
                    placeholder={t.eduPlaceholder}
                    className="w-full rounded-xl border border-stone-300 px-3 py-2 text-xs font-semibold focus:border-[#133e29] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.interestLabel}
                </label>
                <div className="relative">
                  <GraduationCap className="h-4 w-4 text-slate-400 absolute left-3.5 top-2.5" />
                  <select
                    value={regInterest}
                    onChange={(e) => setRegInterest(e.target.value as ServiceInterest)}
                    className="w-full rounded-xl border border-stone-300 bg-white pl-10 pr-3.5 py-2 text-xs font-bold text-slate-800 focus:border-[#133e29] focus:outline-hidden"
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
                <div className="rounded-xl border border-red-300 bg-red-50 p-3 text-xs text-red-700 font-semibold leading-relaxed">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#133e29] hover:bg-emerald-900 py-3 text-sm font-bold text-white shadow-md transition disabled:opacity-70"
              >
                <UserPlus className="h-4 w-4" />
                <span>{isSubmitting ? t.submittingReg : t.submitRegBtn}</span>
              </button>
            </form>
          )}

          <div className="mt-6 pt-5 border-t border-stone-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>{t.footerBadge}</span>
            </span>
            <span>KNLTC Japan Gateway</span>
          </div>
        </div>
      </div>
    </div>
  );
}
