"use client";

import { useState, type FormEvent } from "react";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Copy,
  ExternalLink,
  GraduationCap,
  Loader2,
  Lock,
  MessageCircle,
  Phone,
  Send,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";
import { trackLead } from "@/lib/meta-pixel";

type CourseOption = "N5_COURSE" | "N4_COURSE" | "IRODORI_JAPANESE" | "ADVANCED_LEVELS";
type ClassModeOption = "ONLINE_LIVE" | "OFFLINE_PALTAN" | "OFFLINE_DHANMONDI";
type VisaPurposeOption = "STUDENT_VISA" | "SSW_JOB" | "TITP_INTERN" | "CAREER_SKILLS";

export default function EnrollmentForm() {
  const { language } = useLanguage();

  const t = translate(
    {
      en: {
        badge: "Online Admission • Fast Processing",
        title: "Japanese Language Course Enrollment Form",
        subtitle:
          "Submit your application below. Our admission team will contact you to verify details and provision your student login on the official LMS platform (https://npw.bd/knltc).",
        cardTitle: "Applicant Registration",
        labelName: "Full Name (English or Bangla) *",
        placeholderName: "e.g. Md. Tanvir Ahmed",
        labelPhone: "Mobile / Phone Number *",
        placeholderPhone: "e.g. 01711 223344",
        labelWhatsapp: "WhatsApp Number *",
        placeholderWhatsapp: "e.g. 01711 223344 (for LMS login delivery)",
        labelCourse: "Select Course *",
        labelClassMode: "Class Delivery Mode *",
        labelPurpose: "Purpose of Going to Japan *",
        modeOnline: "Online Live Class (Zoom Live)",
        modePaltan: "Paltan Head Office (Sky View Trade Valley)",
        modeDhanmondi: "Dhanmondi Branch Campus",
        purposeStudent: "Student Visa (Higher Study in Japan)",
        purposeSSW: "SSW Specified Skilled Worker (Job Visa)",
        purposeTITP: "TITP Technical Intern Training Program",
        purposeCareer: "Japanese Language & Professional Career",
        courses: {
          N5_COURSE: "Japanese N5 Level Course (3 Months Intensive • Fee ৳12,000)",
          N4_COURSE: "Japanese N4 Level Course (3 Months Intermediate • SSW Prep)",
          IRODORI_JAPANESE: "Irodori Japanese (Practical Spoken & Job Ready)",
          ADVANCED_LEVELS: "Advanced Levels (JLPT N3, N2, N1 Preparation)",
        },
        btnSubmit: "Submit Enrollment Application",
        submitting: "Submitting application...",
        securityNote: "🔒 Your details are protected. Official Hotline: +880 1805 013633",
        errorName: "Please enter your full name.",
        errorPhone: "Please enter a valid phone number (at least 10 digits).",
        modal: {
          title: "Application Successfully Submitted!",
          msg: "Your application has been received successfully! Our admission team will quickly contact you via WhatsApp to verify your details and deliver your username and password for the https://npw.bd/knltc classroom.",
          refLabel: "Application Reference ID",
          copied: "Copied!",
          copyBtn: "Copy ID",
          summaryTitle: "Application Summary:",
          nameLabel: "Student Name:",
          phoneLabel: "Phone:",
          waLabel: "WhatsApp:",
          courseLabel: "Selected Course:",
          modeLabel: "Class Mode:",
          purposeLabel: "Purpose:",
          btnWhatsapp: "Expedite on WhatsApp",
          btnLms: "Go to LMS Classroom (npw.bd/knltc)",
          btnClose: "Close",
        },
      },
      bn: {
        badge: "অনলাইন ভর্তি • দ্রুত প্রসেসিং",
        title: "জাপানি ভাষা কোর্সে ভর্তির আবেদন ফরম",
        subtitle:
          "নিচের ফর্মে ভর্তির আবেদন সম্পন্ন করুন। আমাদের টিম দ্রুত আপনার সাথে যোগাযোগ করে পেমেন্ট ভেরিফাই করবে এবং আপনার LMS অ্যাকাউন্ট তৈরি করে ইউজারনেম ও পাসওয়ার্ড হোয়াটসঅ্যাপে পাঠিয়ে দেবে।",
        cardTitle: "শিক্ষার্থীর ভর্তি রেজিস্ট্রেশন",
        labelName: "শিক্ষার্থীর পূর্ণ নাম *",
        placeholderName: "যেমন: মোঃ তানভীর আহমেদ",
        labelPhone: "মোবাইল নম্বর (Phone) *",
        placeholderPhone: "যেমন: 01711 223344",
        labelWhatsapp: "হোয়াটসঅ্যাপ নম্বর (WhatsApp) *",
        placeholderWhatsapp: "যেমন: 01711 223344 (LMS আইডি পাঠানোর জন্য)",
        labelCourse: "কোর্সের নাম *",
        labelClassMode: "ক্লাসের মাধ্যম *",
        labelPurpose: "জাপান গমনের উদ্দেশ্য *",
        modeOnline: "অনলাইন লাইভ ক্লাস (Zoom Live)",
        modePaltan: "পল্টন হেড অফিস অফলাইন (স্কাই ভিউ ট্রেড ভ্যালি)",
        modeDhanmondi: "ধানমন্ডি শাখা অফলাইন",
        purposeStudent: "স্টুডেন্ট ভিসা (জাপানে উচ্চশিক্ষা)",
        purposeSSW: "SSW দক্ষ কর্মী (Specified Skilled Worker)",
        purposeTITP: "TITP টেকনিক্যাল ইন্টার্ন (কারিগরি প্রশিক্ষণ)",
        purposeCareer: "জাপানি ভাষা ও সাধারণ ক্যারিয়ার",
        courses: {
          N5_COURSE: "Japanese N5 Level Course (৩ মাস মেয়াদি • ফি: ৳১২,০০০)",
          N4_COURSE: "Japanese N4 Level Course (৩ মাস মেয়াদি • SSW জব প্রস্তুতি)",
          IRODORI_JAPANESE: "Irodori Japanese (প্র্যাকটিক্যাল স্পোকেন ও জব রেডি)",
          ADVANCED_LEVELS: "Advanced Levels (JLPT N3, N2, N1 প্রস্তুতি)",
        },
        btnSubmit: "এখনই ভর্তির আবেদন সম্পন্ন করুন",
        submitting: "আবেদন জমা হচ্ছে...",
        securityNote: "🔒 আপনার তথ্য সম্পূর্ণ নিরাপদ। অফিশিয়াল হটলাইন: +৮৮০ ১৮০৫ ০১৩৬৩৩",
        errorName: "অনুগ্রহ করে আপনার পূর্ণ নাম লিখুন।",
        errorPhone: "একটি সঠিক মোবাইল নম্বর লিখুন (কমপক্ষে ১০ ডিজিট)।",
        modal: {
          title: "আপনার আবেদন সফলভাবে জমা হয়েছে!",
          msg: "আপনার আবেদন সফলভাবে জমা হয়েছে! আমাদের অ্যাডমিশন টিম দ্রুত আপনার সাথে হোয়াটসঅ্যাপে যোগাযোগ করে আপনার https://npw.bd/knltc ক্লাসরুমের আইডি ও পাসওয়ার্ড বুঝিয়ে দেবে।",
          refLabel: "আবেদন রেফারেন্স আইডি",
          copied: "কপি সম্পন্ন!",
          copyBtn: "কপি করুন",
          summaryTitle: "আপনার আবেদনের বিবরণ:",
          nameLabel: "শিক্ষার্থীর নাম:",
          phoneLabel: "মোবাইল:",
          waLabel: "হোয়াটসঅ্যাপ:",
          courseLabel: "কোর্স:",
          modeLabel: "ক্লাসের মাধ্যম:",
          purposeLabel: "উদ্দেশ্য:",
          btnWhatsapp: "হোয়াটসঅ্যাপে দ্রুত ভেরিফিকেশন করুন",
          btnLms: "LMS ক্লাসরুমে যান (npw.bd/knltc)",
          btnClose: "বন্ধ করুন",
        },
      },
      ja: {
        badge: "オンライン受講申請 • 迅速対応",
        title: "日本語講座 受講申込みフォーム",
        subtitle:
          "フォームを入力して送信してください。スタッフより確認の上、公式LMS（https://npw.bd/knltc）のアカウントID・パスワードを発行・送付します。",
        cardTitle: "受講生登録情報",
        labelName: "受講生氏名 *",
        placeholderName: "例：Md. Tanvir Ahmed",
        labelPhone: "電話番号 *",
        placeholderPhone: "例：01711 223344",
        labelWhatsapp: "WhatsApp番号 *",
        placeholderWhatsapp: "例：01711 223344（ID送信用）",
        labelCourse: "受講コース *",
        labelClassMode: "受講形態 *",
        labelPurpose: "渡航・学習目的 *",
        modeOnline: "オンラインLIVE授業（Zoom）",
        modePaltan: "パルタン本部校舎（対面）",
        modeDhanmondi: "ダンモンディ校舎（対面）",
        purposeStudent: "留学ビザ（大学・専門学校進学）",
        purposeSSW: "特定技能（SSW就労ビザ）",
        purposeTITP: "技能実習生プログラム",
        purposeCareer: "一般教養・ビジネス日本語",
        courses: {
          N5_COURSE: "日本語N5基礎コース（3ヶ月集中・受講料 ৳12,000）",
          N4_COURSE: "日本語N4中級コース（3ヶ月・特定技能対策）",
          IRODORI_JAPANESE: "いろどり日本語（実践会話・即戦力就職）",
          ADVANCED_LEVELS: "上級コース（JLPT N3・N2・N1対策）",
        },
        btnSubmit: "受講申請を送信する",
        submitting: "送信中...",
        securityNote: "🔒 ご入力いただいた情報は保護されます。公式窓口: +880 1805 013633",
        errorName: "お名前をご入力ください。",
        errorPhone: "有効な電話番号をご入力ください。",
        modal: {
          title: "受講申請を受け付けました！",
          msg: "あなたの申請は正常に送信されました！担当アドミッションチームが速やかにWhatsAppにてご連絡し、公式LMS（https://npw.bd/knltc）のログインIDとパスワードを発行・ご案内いたします。",
          refLabel: "受付整理番号 (ID)",
          copied: "コピー完了！",
          copyBtn: "IDをコピー",
          summaryTitle: "申請内容の控え:",
          nameLabel: "氏名:",
          phoneLabel: "電話番号:",
          waLabel: "WhatsApp:",
          courseLabel: "選択コース:",
          modeLabel: "受講形式:",
          purposeLabel: "渡航目的:",
          btnWhatsapp: "WhatsAppで優先確認する",
          btnLms: "LMS教室を開く (npw.bd/knltc)",
          btnClose: "閉じる",
        },
      },
    },
    language,
  );

  // Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [course, setCourse] = useState<CourseOption>("N5_COURSE");
  const [classMode, setClassMode] = useState<ClassModeOption>("ONLINE_LIVE");
  const [purpose, setPurpose] = useState<VisaPurposeOption>("STUDENT_VISA");

  // Interaction State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [submittedData, setSubmittedData] = useState<{
    id: string;
    name: string;
    phone: string;
    whatsapp: string;
    courseLabel: string;
    classModeLabel: string;
    purposeLabel: string;
  } | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    const cleanWa = whatsapp.trim() || cleanPhone;

    if (!cleanName) {
      setFormError(t.errorName);
      return;
    }

    if (!cleanPhone || cleanPhone.replace(/\D/g, "").length < 10) {
      setFormError(t.errorPhone);
      return;
    }

    setIsSubmitting(true);

    // Generate readable reference ID
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const referenceId = `KNLTC-2026-${randomNum}`;

    // Resolve human labels
    const courseLabel = t.courses[course];
    const classModeLabel =
      classMode === "ONLINE_LIVE"
        ? t.modeOnline
        : classMode === "OFFLINE_PALTAN"
        ? t.modePaltan
        : t.modeDhanmondi;

    const purposeLabel =
      purpose === "STUDENT_VISA"
        ? t.purposeStudent
        : purpose === "SSW_JOB"
        ? t.purposeSSW
        : purpose === "TITP_INTERN"
        ? t.purposeTITP
        : t.purposeCareer;

    // Simulate fast client-side submission & tracking
    setTimeout(() => {
      setSubmittedData({
        id: referenceId,
        name: cleanName,
        phone: cleanPhone,
        whatsapp: cleanWa,
        courseLabel,
        classModeLabel,
        purposeLabel,
      });

      // Fire meta pixel lead event safely
      try {
        trackLead();
      } catch {
        // Safe fallback
      }

      setIsSubmitting(false);
      setSuccessModalOpen(true);
    }, 450);
  };

  const handleCopyId = () => {
    if (submittedData?.id) {
      navigator.clipboard.writeText(submittedData.id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2500);
    }
  };

  const buildWhatsAppExpediteLink = () => {
    if (!submittedData) return "https://wa.me/8801805013633";
    const message = `আসসালামু আলাইকুম KNLTC,\nআমি ${submittedData.name}।\nআমি ${submittedData.courseLabel} কোর্সে ভর্তির আবেদন করেছি।\nরেফারেন্স আইডি: ${submittedData.id}\nমোবাইল: ${submittedData.phone}\nহোয়াটসঅ্যাপ: ${submittedData.whatsapp}\nক্লাস মোড: ${submittedData.classModeLabel}\n\nআমার https://npw.bd/knltc ক্লাসরুমের আইডি ও পাসওয়ার্ড পাওয়ার জন্য যোগাযোগ করছি। ধন্যবাদ!`;
    return `https://wa.me/8801805013633?text=${encodeURIComponent(message)}`;
  };

  return (
    <section id="enrollment-form" className="section-padding bg-white relative scroll-mt-20">
      <div className="container-narrow max-w-4xl">
        {/* Header */}
        <div className="text-center mb-10">
          <Badge className="border-red-200 bg-red-50 text-[#b91c1c] mb-3 px-3.5 py-1.5 font-semibold text-xs shadow-xs">
            <Sparkles className="mr-1.5 h-3.5 w-3.5" />
            {t.badge}
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {t.title}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Enrollment Form Card */}
        <div className="rounded-3xl border-2 border-stone-200 bg-gradient-to-b from-[#fcfaf7] to-white p-6 sm:p-10 shadow-lg shadow-stone-200/50">
          {formError && (
            <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-4 text-xs sm:text-sm text-red-700">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 1. Name & Contact Fields */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5">
                  {t.labelName}
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.placeholderName}
                    className="w-full rounded-xl border border-stone-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 shadow-xs focus:border-[#b91c1c] focus:ring-1 focus:ring-[#b91c1c] focus:outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5">
                  {t.labelPhone}
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Phone className="h-4 w-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (!whatsapp) {
                        setWhatsapp(e.target.value);
                      }
                    }}
                    placeholder={t.placeholderPhone}
                    className="w-full rounded-xl border border-stone-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 shadow-xs focus:border-[#b91c1c] focus:ring-1 focus:ring-[#b91c1c] focus:outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5">
                  {t.labelWhatsapp}
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <MessageCircle className="h-4 w-4 text-[#15803d]" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder={t.placeholderWhatsapp}
                    className="w-full rounded-xl border border-stone-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 shadow-xs focus:border-[#15803d] focus:ring-1 focus:ring-[#15803d] focus:outline-none transition"
                  />
                </div>
              </div>
            </div>

            {/* 2. Course Name Selection */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5">
                {t.labelCourse}
              </label>
              <select
                value={course}
                onChange={(e) => setCourse(e.target.value as CourseOption)}
                className="w-full rounded-xl border border-stone-300 bg-white p-3 text-sm text-slate-900 shadow-xs focus:border-[#b91c1c] focus:ring-1 focus:ring-[#b91c1c] focus:outline-none transition"
              >
                <option value="N5_COURSE">{t.courses.N5_COURSE}</option>
                <option value="N4_COURSE">{t.courses.N4_COURSE}</option>
                <option value="IRODORI_JAPANESE">{t.courses.IRODORI_JAPANESE}</option>
                <option value="ADVANCED_LEVELS">{t.courses.ADVANCED_LEVELS}</option>
              </select>
            </div>

            {/* 3. Class Delivery Mode (Radio / Select) */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-2">
                {t.labelClassMode}
              </label>
              <div className="grid gap-3 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() => setClassMode("ONLINE_LIVE")}
                  className={`rounded-xl border p-3.5 text-left text-xs sm:text-sm font-medium transition ${
                    classMode === "ONLINE_LIVE"
                      ? "border-[#b91c1c] bg-red-50/70 text-[#b91c1c] font-semibold ring-1 ring-[#b91c1c]"
                      : "border-stone-200 bg-white text-slate-700 hover:bg-stone-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold">অনলাইন লাইভ (Zoom)</span>
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-[11px] text-slate-500 block">সরাসরি ঘরে বসে লাইভ ক্লাস</span>
                </button>

                <button
                  type="button"
                  onClick={() => setClassMode("OFFLINE_PALTAN")}
                  className={`rounded-xl border p-3.5 text-left text-xs sm:text-sm font-medium transition ${
                    classMode === "OFFLINE_PALTAN"
                      ? "border-[#b91c1c] bg-red-50/70 text-[#b91c1c] font-semibold ring-1 ring-[#b91c1c]"
                      : "border-stone-200 bg-white text-slate-700 hover:bg-stone-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold">পল্টন হেড অফিস</span>
                    <span className="h-2 w-2 rounded-full bg-red-500" />
                  </div>
                  <span className="text-[11px] text-slate-500 block">স্কাই ভিউ ট্রেড ভ্যালি (৮ম তলা)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setClassMode("OFFLINE_DHANMONDI")}
                  className={`rounded-xl border p-3.5 text-left text-xs sm:text-sm font-medium transition ${
                    classMode === "OFFLINE_DHANMONDI"
                      ? "border-[#b91c1c] bg-red-50/70 text-[#b91c1c] font-semibold ring-1 ring-[#b91c1c]"
                      : "border-stone-200 bg-white text-slate-700 hover:bg-stone-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold">ধানমন্ডি শাখা</span>
                    <span className="h-2 w-2 rounded-full bg-blue-500" />
                  </div>
                  <span className="text-[11px] text-slate-500 block">ক্যাম্পাস ক্লাসরুম ও ল্যাব</span>
                </button>
              </div>
            </div>

            {/* 4. Purpose of Going to Japan */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5">
                {t.labelPurpose}
              </label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value as VisaPurposeOption)}
                className="w-full rounded-xl border border-stone-300 bg-white p-3 text-sm text-slate-900 shadow-xs focus:border-[#b91c1c] focus:ring-1 focus:ring-[#b91c1c] focus:outline-none transition"
              >
                <option value="STUDENT_VISA">{t.purposeStudent}</option>
                <option value="SSW_JOB">{t.purposeSSW}</option>
                <option value="TITP_INTERN">{t.purposeTITP}</option>
                <option value="CAREER_SKILLS">{t.purposeCareer}</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                size="lg"
                className="w-full bg-[#b91c1c] hover:bg-red-800 text-white font-bold text-base py-6 rounded-xl shadow-lg shadow-red-700/20 transition-all hover:shadow-xl"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    {t.submitting}
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Send className="h-5 w-5" />
                    {t.btnSubmit}
                  </span>
                )}
              </Button>
            </div>

            {/* Security note */}
            <p className="text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-slate-400" />
              <span>{t.securityNote}</span>
            </p>
          </form>
        </div>
      </div>

      {/* Success Modal / Notification as explicitly requested */}
      {successModalOpen && submittedData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-stone-200 animate-in fade-in zoom-in duration-200">
            {/* Close Button */}
            <button
              onClick={() => setSuccessModalOpen(false)}
              className="absolute top-5 right-5 rounded-full p-2 text-slate-400 hover:bg-stone-100 hover:text-slate-600 transition"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Icon & Header */}
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-[#15803d] mb-4">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
                {t.modal.title}
              </h3>
            </div>

            {/* Core Notification Text as requested */}
            <div className="mt-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 p-4 text-xs sm:text-sm text-emerald-900 leading-relaxed text-center sm:text-left">
              <p className="font-medium">
                {t.modal.msg}
              </p>
            </div>

            {/* Reference ID Pill */}
            <div className="mt-4 flex items-center justify-between rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  {t.modal.refLabel}
                </span>
                <span className="text-base font-extrabold text-[#b91c1c]">
                  {submittedData.id}
                </span>
              </div>
              <Button
                type="button"
                onClick={handleCopyId}
                variant="outline"
                size="sm"
                className="h-8 rounded-lg text-xs font-semibold gap-1"
              >
                <Copy className="h-3 w-3" />
                {copiedId ? t.modal.copied : t.modal.copyBtn}
              </Button>
            </div>

            {/* Summary Details */}
            <div className="mt-4 rounded-xl border border-stone-100 bg-stone-50/60 p-3.5 text-xs text-slate-700 space-y-1.5">
              <p className="font-bold text-slate-900 mb-1">{t.modal.summaryTitle}</p>
              <div className="flex justify-between">
                <span className="text-slate-500">{t.modal.nameLabel}</span>
                <span className="font-semibold text-slate-900">{submittedData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t.modal.courseLabel}</span>
                <span className="font-semibold text-slate-900 text-right">{submittedData.courseLabel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t.modal.modeLabel}</span>
                <span className="font-semibold text-slate-900">{submittedData.classModeLabel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t.modal.purposeLabel}</span>
                <span className="font-semibold text-slate-900">{submittedData.purposeLabel}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-3">
              <Button
                asChild
                size="lg"
                className="w-full bg-[#15803d] hover:bg-emerald-700 text-white font-bold text-sm py-5 rounded-xl shadow-md"
              >
                <a
                  href={buildWhatsAppExpediteLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>{t.modal.btnWhatsapp}</span>
                </a>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full border-red-200 text-[#b91c1c] hover:bg-red-50 font-bold text-sm py-5 rounded-xl"
              >
                <a
                  href="https://npw.bd/knltc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  <GraduationCap className="h-5 w-5" />
                  <span>{t.modal.btnLms}</span>
                  <ExternalLink className="h-4 w-4 opacity-80" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
