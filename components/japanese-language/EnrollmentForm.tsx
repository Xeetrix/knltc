"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Copy,
  GraduationCap,
  Loader2,
  MessageCircle,
  Send,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { INITIAL_BRANCHES, INITIAL_COURSES, Enrollment } from "@/lib/portal-data";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";

interface Props {
  selectedCourseId?: string;
}

export default function EnrollmentForm({ selectedCourseId = "course-n5" }: Props) {
  const { language } = useLanguage();

  const t = translate(
    {
      en: {
        badge: "Online Admission • 2026 Batch",
        title: "Japanese Language Course Enrollment Form",
        sub: "Complete the form below to apply. Our senior counselor will reach out via phone/WhatsApp to confirm your batch timing and seat allocation.",
        sec1Title: "1. Course & Branch Selection",
        labelCourse: "Select Course *",
        labelBranch: "Branch / Campus *",
        labelMode: "Class Delivery Mode *",
        modeOffline: "Campus (In-Person)",
        modeOnline: "Online Live (Zoom)",
        labelVisa: "Target Visa Category *",
        visaStudent: "Student Visa (Higher Study)",
        visaSSW: "SSW Specified Skilled Worker (Job Visa)",
        visaTITP: "TITP Technical Intern Training",
        visaGeneral: "Japanese Language & Professional Career",
        sec2Title: "2. Applicant & Contact Details",
        labelName: "Full Name (English or Bangla) *",
        placeholderName: "e.g. Md. Tanvir Ahmed",
        labelPhone: "Phone Number *",
        labelWhatsapp: "WhatsApp Number",
        whatsappPlaceholder: "Leave blank if same as phone",
        labelEmail: "Email Address",
        labelDegree: "Highest Educational Qualification",
        labelNotes: "Additional Notes / Specific Questions",
        notesPlaceholder: "e.g. I prefer the evening 6:30 PM batch...",
        summaryFee: "Selected Course Fee:",
        summaryBonus: "Textbooks, lecture sheets, 15-day embassy & CV bonus courses included free",
        btnSubmit: "Submit Enrollment Application",
        btnSubmitting: "Submitting application...",
        securityNote: "🔒 Your information is secure. For immediate assistance call:",
        successTitle: "Congratulations! Your Application is Received",
        successSub: "Your record has been stored in KNLTC's central database.",
        enrollIdLabel: "Enrollment ID Number",
        btnCopy: "Copy",
        btnCopied: "Copied!",
        fieldStudentName: "Student Name:",
        fieldPhone: "Phone:",
        fieldCourse: "Course:",
        fieldCampus: "Campus / Branch:",
        fieldMode: "Class Mode:",
        fieldTotalFee: "Total Course Fee:",
        btnSendWa: "Send Confirmation on WhatsApp",
        btnViewPortal: "View Student / Staff RBAC Portal",
        btnApplyAnother: "Want to submit another enrollment? Click here",
        errorName: "Please provide your full name.",
        errorPhone: "Please provide a valid phone number (e.g. 01711223344).",
        errorGeneric: "Network error occurred. Please try again.",
      },
      bn: {
        badge: "অনলাইন এডমিশন • ২০২৬ ব্যাচ",
        title: "জাপানি ভাষা কোর্সে ভর্তি আবেদন ফরম",
        sub: "ফর্মটি পূরণ করে সাবমিট করুন। আমাদের সিনিয়র এডমিশন কাউন্সিলর আপনার সাথে ফোনে যোগাযোগ করে ব্যাচ শিডিউল ও পেমেন্ট কনফার্ম করবেন।",
        sec1Title: "১. কোর্স ও ক্যাম্পাস নির্বাচন",
        labelCourse: "কোর্স নির্বাচন করুন *",
        labelBranch: "ব্রাঞ্চ / ক্যাম্পাস *",
        labelMode: "ক্লাস ডেলিভারি মোড *",
        modeOffline: "ক্যাম্পাস (Offline)",
        modeOnline: "অনলাইন লাইভ (Zoom)",
        labelVisa: "টার্গেট ভিসা ক্যাটাগরি *",
        visaStudent: "স্টুডেন্ট ভিসা (Higher Study)",
        visaSSW: "SSW নির্দিষ্ট দক্ষ কর্মী (Job Visa)",
        visaTITP: "TITP টেকনিক্যাল ইন্টার্ন",
        visaGeneral: "জাপানি ভাষা ও ক্যারিয়ার দক্ষতা",
        sec2Title: "২. শিক্ষার্থীর ব্যক্তিগত ও যোগাযোগ তথ্য",
        labelName: "আপনার পূর্ণ নাম (Full Name) *",
        placeholderName: "যেমন: মোঃ তানভীর আহমেদ",
        labelPhone: "মোবাইল নম্বর (Phone) *",
        labelWhatsapp: "হোয়াটসঅ্যাপ নম্বর (WhatsApp)",
        whatsappPlaceholder: "নম্বর একই হলে খালি রাখুন",
        labelEmail: "ইমেইল ঠিকানা (Email)",
        labelDegree: "সর্বোচ্চ শিক্ষাগত যোগ্যতা",
        labelNotes: "অতিরিক্ত নোট / কোনো নির্দিষ্ট প্রশ্ন থাকলে লিখুন",
        notesPlaceholder: "যেমন: আমি সন্ধ্যার ব্যাচে ক্লাস করতে আগ্রহী...",
        summaryFee: "নির্বাচিত কোর্স ফি:",
        summaryBonus: "বই, লেকচার শিট, ১৫-দিনের এম্বাসি ও সিভি কোর্স সম্পূর্ণ ফ্রি ইনক্লুডেড",
        btnSubmit: "ভর্তি আবেদন সম্পন্ন করুন",
        btnSubmitting: "আবেদন জমা হচ্ছে...",
        securityNote: "🔒 আপনার দেওয়া তথ্য সম্পূর্ণ সুরক্ষিত থাকবে। কোনো সমস্যা হলে কল করুন:",
        successTitle: "অভিনন্দন! আপনার ভর্তি আবেদন গৃহীত হয়েছে",
        successSub: "KNLTC জাপানিজ ল্যাঙ্গুয়েজ ডিপার্টমেন্টের সেন্ট্রাল সিস্টেমে আপনার তথ্য সংরক্ষিত হয়েছে।",
        enrollIdLabel: "এনরোলমেন্ট নম্বর",
        btnCopy: "কপি",
        btnCopied: "কপি হয়েছে!",
        fieldStudentName: "শিক্ষার্থীর নাম:",
        fieldPhone: "মোবাইল:",
        fieldCourse: "কোর্স:",
        fieldCampus: "ক্যাম্পাস / ব্রাঞ্চ:",
        fieldMode: "ক্লাস মোড:",
        fieldTotalFee: "মোট কোর্স ফি:",
        btnSendWa: "WhatsApp-এ কনফার্মেশন পাঠান",
        btnViewPortal: "স্টুডেন্ট / স্টাফ RBAC পোর্টাল দেখুন",
        btnApplyAnother: "আরেকটি নতুন ভর্তি ফর্ম পূরণ করতে চান? ক্লিক করুন",
        errorName: "আপনার পূর্ণ নাম প্রদান করুন।",
        errorPhone: "একটি সঠিক মোবাইল নম্বর প্রদান করুন (যেমন: 01711223344)।",
        errorGeneric: "নেটওয়ার্ক ত্রুটি। অনুগ্রহ করে আবার চেষ্টা করুন।",
      },
      ja: {
        badge: "オンライン受講申請 • 2026年期生",
        title: "日本語講座受講申込みフォーム",
        sub: "以下のフォームにご入力ください。専任カウンセラーより受講クラスの時間割および手続きについてご連絡差し上げます。",
        sec1Title: "1. 希望コース・校舎の選択",
        labelCourse: "受講コース選択 *",
        labelBranch: "希望キャンパス・校舎 *",
        labelMode: "受講形式 *",
        modeOffline: "対面教室（通学）",
        modeOnline: "オンラインLIVE（Zoom）",
        labelVisa: "目標ビザ分類 *",
        visaStudent: "留学ビザ（大学・専門学校進学）",
        visaSSW: "特定技能（SSW就労ビザ）",
        visaTITP: "技能実習生プログラム",
        visaGeneral: "一般教養・ビジネス日本語",
        sec2Title: "2. 受講生情報・連絡先",
        labelName: "受講者氏名（英語・ベンガル語表記） *",
        placeholderName: "例：Md. Tanvir Ahmed",
        labelPhone: "電話番号 *",
        labelWhatsapp: "WhatsApp番号",
        whatsappPlaceholder: "電話番号と同じ場合は空欄可",
        labelEmail: "メールアドレス",
        labelDegree: "最終学歴",
        labelNotes: "ご質問・ご希望事項（任意）",
        notesPlaceholder: "例：夜間18:30のクラスを希望します...",
        summaryFee: "受講料合計:",
        summaryBonus: "全テキスト・プリント・面接対策3講座が無料付帯",
        btnSubmit: "受講申請を送信する",
        btnSubmitting: "送信中...",
        securityNote: "🔒 ご入力いただいた個人情報は厳格に保護されます。お電話でのお問い合わせ:",
        successTitle: "受講申請を受け付けました！",
        successSub: "KNLTC受講管理システムに申請情報が正常に登録されました。",
        enrollIdLabel: "受付登録番号（ID）",
        btnCopy: "コピー",
        btnCopied: "コピー完了！",
        fieldStudentName: "受講者名:",
        fieldPhone: "電話番号:",
        fieldCourse: "選択コース:",
        fieldCampus: "希望校舎:",
        fieldMode: "受講形態:",
        fieldTotalFee: "受講費用:",
        btnSendWa: "WhatsAppで受付確認メッセージを送る",
        btnViewPortal: "受講生ポータルを開く",
        btnApplyAnother: "別の申請を行う場合はこちらをクリック",
        errorName: "お名前をご入力ください。",
        errorPhone: "有効な電話番号をご入力ください（例：01711223344）。",
        errorGeneric: "通信エラーが発生しました。再度お試しください。",
      },
    },
    language,
  );

  const [courseId, setCourseId] = useState(selectedCourseId);
  const [branchId, setBranchId] = useState("branch-dhaka-hq");
  const [deliveryMode, setDeliveryMode] = useState<"ONLINE_LIVE" | "OFFLINE_CLASSROOM">("OFFLINE_CLASSROOM");
  const [visaCategory, setVisaCategory] = useState<"STUDENT_VISA" | "SSW_JOB" | "TITP_INTERN" | "GENERAL_LANGUAGE">("STUDENT_VISA");

  const [applicantName, setApplicantName] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [highestDegree, setHighestDegree] = useState("HSC");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<Enrollment | null>(null);
  const [copied, setCopied] = useState(false);

  const selectedCourse = INITIAL_COURSES.find((c) => c.id === courseId) || INITIAL_COURSES[0];
  const selectedBranch = INITIAL_BRANCHES.find((b) => b.id === branchId) || INITIAL_BRANCHES[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!applicantName.trim()) {
      setError(t.errorName);
      setLoading(false);
      return;
    }

    if (!phone.trim() || phone.length < 10) {
      setError(t.errorPhone);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicantName,
          phone,
          whatsapp: whatsapp || phone,
          email,
          branchId,
          courseId,
          deliveryMode,
          visaCategory,
          highestDegree,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || t.errorGeneric);
      }

      setSuccessResult(data.enrollment);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.errorGeneric);
    } finally {
      setLoading(false);
    }
  };

  const copyEnrollmentId = () => {
    if (successResult?.enrollmentNo) {
      navigator.clipboard.writeText(successResult.enrollmentNo);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section id="enrollment-form" className="bg-white py-16 md:py-24 border-b border-stone-200">
      <div className="container-narrow">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-10">
            <Badge className="border-green-200 bg-green-50 text-[#15803d] text-xs font-semibold px-3 py-1">
              {t.badge}
            </Badge>
            <h2 className="mt-3 text-3xl font-extrabold text-slate-900 md:text-4xl">
              {t.title}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
              {t.sub}
            </p>
          </div>

          {/* Success Result Modal / Card */}
          {successResult ? (
            <div className="rounded-3xl border-2 border-emerald-500 bg-emerald-50/50 p-6 sm:p-10 shadow-xl text-center space-y-6 animate-in fade-in duration-300">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-[#15803d]">
                <CheckCircle2 className="h-10 w-10" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-slate-900">{t.successTitle}</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  {t.successSub}
                </p>
              </div>

              {/* Enrollment Ticket Box */}
              <div className="mx-auto max-w-md rounded-2xl border border-emerald-200 bg-white p-5 text-left shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <div>
                    <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">{t.enrollIdLabel}</span>
                    <div className="text-xl font-extrabold text-[#b91c1c] font-mono">
                      {successResult.enrollmentNo}
                    </div>
                  </div>
                  <button
                    onClick={copyEnrollmentId}
                    className="flex items-center gap-1 rounded-lg border border-stone-200 px-2.5 py-1 text-xs text-slate-600 hover:bg-stone-50 transition"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    <span>{copied ? t.btnCopied : t.btnCopy}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500">{t.fieldStudentName}</span>
                    <p className="font-semibold text-slate-900">{successResult.applicantName}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">{t.fieldPhone}</span>
                    <p className="font-semibold text-slate-900">{successResult.phone}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">{t.fieldCourse}</span>
                    <p className="font-semibold text-[#b91c1c]">{successResult.courseTitle}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">{t.fieldCampus}</span>
                    <p className="font-semibold text-slate-900">{successResult.branchName}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">{t.fieldMode}</span>
                    <p className="font-semibold text-slate-900">
                      {successResult.deliveryMode === "ONLINE_LIVE" ? t.modeOnline : t.modeOffline}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500">{t.fieldTotalFee}</span>
                    <p className="font-bold text-[#15803d]">৳{successResult.totalPayable}</p>
                  </div>
                </div>
              </div>

              {/* Next Steps Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
                <Button
                  asChild
                  className="bg-[#15803d] hover:bg-emerald-700 text-white font-semibold rounded-xl px-6 py-5 shadow"
                >
                  <a
                    href={`https://wa.me/8801805013633?text=Hello%20KNLTC,%20I%20have%20completed%20admission%20form.%20My%20Enrollment%20ID%20is%20${successResult.enrollmentNo}.%20Name:%20${encodeURIComponent(
                      successResult.applicantName
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="mr-2 h-5 w-5" /> {t.btnSendWa}
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-stone-300 text-slate-800 hover:bg-stone-50 font-semibold rounded-xl px-6 py-5"
                >
                  <Link href="/portal">
                    {t.btnViewPortal} <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <button
                onClick={() => setSuccessResult(null)}
                className="text-xs text-slate-500 hover:underline pt-2"
              >
                {t.btnApplyAnother}
              </button>
            </div>
          ) : (
            /* Enrollment Form */
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-stone-200 bg-[#fcfaf7] p-6 sm:p-10 shadow-sm space-y-8"
            >
              {error && (
                <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-xs sm:text-sm text-red-700">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Step 1: Course & Campus Selection */}
              <div>
                <div className="flex items-center gap-2 border-b border-stone-200 pb-2 mb-4">
                  <GraduationCap className="h-5 w-5 text-[#b91c1c]" />
                  <h3 className="text-base font-bold text-slate-900">{t.sec1Title}</h3>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">{t.labelCourse}</label>
                    <select
                      value={courseId}
                      onChange={(e) => setCourseId(e.target.value)}
                      className="w-full rounded-xl border border-stone-300 bg-white p-3 text-sm text-slate-900 focus:border-[#b91c1c] focus:outline-none"
                    >
                      {INITIAL_COURSES.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.title} — ৳{c.discountedFee || c.fee}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">{t.labelBranch}</label>
                    <select
                      value={branchId}
                      onChange={(e) => setBranchId(e.target.value)}
                      className="w-full rounded-xl border border-stone-300 bg-white p-3 text-sm text-slate-900 focus:border-[#b91c1c] focus:outline-none"
                    >
                      {INITIAL_BRANCHES.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name} ({b.city})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">{t.labelMode}</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setDeliveryMode("OFFLINE_CLASSROOM")}
                        className={`rounded-xl border p-2.5 text-xs font-bold transition text-center ${
                          deliveryMode === "OFFLINE_CLASSROOM"
                            ? "border-[#b91c1c] bg-red-50 text-[#b91c1c]"
                            : "border-stone-300 bg-white text-slate-700 hover:bg-stone-50"
                        }`}
                      >
                        {t.modeOffline}
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeliveryMode("ONLINE_LIVE")}
                        className={`rounded-xl border p-2.5 text-xs font-bold transition text-center ${
                          deliveryMode === "ONLINE_LIVE"
                            ? "border-[#15803d] bg-green-50 text-[#15803d]"
                            : "border-stone-300 bg-white text-slate-700 hover:bg-stone-50"
                        }`}
                      >
                        {t.modeOnline}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">{t.labelVisa}</label>
                    <select
                      value={visaCategory}
                      onChange={(e) =>
                        setVisaCategory(
                          e.target.value as
                            | "STUDENT_VISA"
                            | "SSW_JOB"
                            | "TITP_INTERN"
                            | "GENERAL_LANGUAGE",
                        )
                      }
                      className="w-full rounded-xl border border-stone-300 bg-white p-3 text-sm text-slate-900 focus:border-[#b91c1c] focus:outline-none"
                    >
                      <option value="STUDENT_VISA">{t.visaStudent}</option>
                      <option value="SSW_JOB">{t.visaSSW}</option>
                      <option value="TITP_INTERN">{t.visaTITP}</option>
                      <option value="GENERAL_LANGUAGE">{t.visaGeneral}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Step 2: Personal & Contact Information */}
              <div>
                <div className="flex items-center gap-2 border-b border-stone-200 pb-2 mb-4">
                  <User className="h-5 w-5 text-[#15803d]" />
                  <h3 className="text-base font-bold text-slate-900">{t.sec2Title}</h3>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">{t.labelName}</label>
                    <input
                      type="text"
                      required
                      placeholder={t.placeholderName}
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      className="w-full rounded-xl border border-stone-300 bg-white p-3 text-sm text-slate-900 focus:border-[#b91c1c] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">{t.labelPhone}</label>
                    <input
                      type="tel"
                      required
                      placeholder="01711223344"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-xl border border-stone-300 bg-white p-3 text-sm text-slate-900 focus:border-[#b91c1c] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">{t.labelWhatsapp}</label>
                    <input
                      type="tel"
                      placeholder={t.whatsappPlaceholder}
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full rounded-xl border border-stone-300 bg-white p-3 text-sm text-slate-900 focus:border-[#b91c1c] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">{t.labelEmail}</label>
                    <input
                      type="email"
                      placeholder="student@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-stone-300 bg-white p-3 text-sm text-slate-900 focus:border-[#b91c1c] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">{t.labelDegree}</label>
                    <select
                      value={highestDegree}
                      onChange={(e) => setHighestDegree(e.target.value)}
                      className="w-full rounded-xl border border-stone-300 bg-white p-3 text-sm text-slate-900 focus:border-[#b91c1c] focus:outline-none"
                    >
                      <option value="HSC">HSC / Alim</option>
                      <option value="Diploma">Diploma in Engineering / Nursing</option>
                      <option value="Bachelor">Bachelor / Honours Degree</option>
                      <option value="Masters">Masters Degree</option>
                      <option value="SSC">SSC / Equivalent</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      {t.labelNotes}
                    </label>
                    <textarea
                      rows={2}
                      placeholder={t.notesPlaceholder}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full rounded-xl border border-stone-300 bg-white p-3 text-sm text-slate-900 focus:border-[#b91c1c] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Price Calculation Summary Banner */}
              <div className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-slate-500 font-medium">{t.summaryFee}</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-[#b91c1c]">
                      ৳{selectedCourse.discountedFee || selectedCourse.fee}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      ({selectedCourse.title})
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {t.summaryBonus}
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  size="lg"
                  className="w-full sm:w-auto bg-[#b91c1c] hover:bg-red-800 text-white font-bold px-8 py-6 rounded-xl shadow-lg shadow-red-700/20"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t.btnSubmitting}
                    </>
                  ) : (
                    <>
                      {t.btnSubmit} <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>

              <div className="text-center text-xs text-slate-500">
                {t.securityNote}{" "}
                <a href="tel:+8801805013633" className="font-semibold text-slate-800 underline">
                  +880 1805 013633
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
