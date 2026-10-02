"use client";

import { useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  AlertCircle,
  CheckCircle2,
  Copy,
  ExternalLink,
  GraduationCap,
  Loader2,
  Lock,
  MessageCircle,
  Phone,
  Send,
  User,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
        kicker: "Direct Admission Portal",
        title: "Japanese Language Course Enrollment Form",
        subtitle:
          "Submit your details below. Our admission office will verify your application and send your official LMS (https://npw.bd/knltc) username and password via WhatsApp.",
        labelName: "Full Name *",
        placeholderName: "e.g. Md. Tanvir Ahmed",
        labelPhone: "Phone Number *",
        placeholderPhone: "e.g. 01711 223344",
        labelWhatsapp: "WhatsApp Number *",
        placeholderWhatsapp: "e.g. 01711 223344 (for LMS login delivery)",
        labelCourse: "Course Name *",
        labelClassMode: "Class Delivery Mode *",
        labelPurpose: "Target Visa / Career Purpose *",
        modeOnline: "Online Live Class (Zoom)",
        modePaltan: "Paltan Head Office (Offline)",
        modeDhanmondi: "Dhanmondi Branch (Offline)",
        purposeStudent: "Student Visa (Higher Study in Japan)",
        purposeSSW: "SSW Specified Skilled Worker (Job Visa)",
        purposeTITP: "TITP Technical Intern Training",
        purposeCareer: "Japanese Language & Professional Career",
        courses: [
          {
            id: "N5_COURSE" as CourseOption,
            name: "Japanese N5 Level Course",
            details: "3 Months • ৳12,000 (3 Free Bonus Courses Included)",
          },
          {
            id: "N4_COURSE" as CourseOption,
            name: "Japanese N4 Level Course",
            details: "3 Months • ৳14,500 (SSW Job Visa & University Preparation)",
          },
          {
            id: "IRODORI_JAPANESE" as CourseOption,
            name: "Irodori Japanese Course",
            details: "Practical Conversational & Workplace Living Japanese",
          },
          {
            id: "ADVANCED_LEVELS" as CourseOption,
            name: "Advanced Levels (JLPT N3 / N2 / N1)",
            details: "4 Months • ৳18,000 (Corporate & Higher Career Fluency)",
          },
        ],
        btnSubmit: "Submit Enrollment Application",
        submitting: "Submitting application...",
        securityNote: "Your data is confidential. Official hotline: +880 1805 013633",
        selectedLabel: "Selected Course:",
        errorName: "Please enter your full name.",
        errorPhone: "Please enter a valid phone number (at least 10 digits).",
        modal: {
          title: "Application Successfully Submitted!",
          msg: "Your application has been received successfully! Our admission team will contact you via WhatsApp to verify your admission and hand over your username and password for the https://npw.bd/knltc classroom.",
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
          btnLms: "Enter LMS Classroom (npw.bd/knltc)",
          btnClose: "Close",
        },
      },
      bn: {
        kicker: "অনলাইন ভর্তি আবেদন",
        title: "জাপানি ভাষা কোর্সে ভর্তির আবেদন ফরম",
        subtitle:
          "নিচের ফর্মে ভর্তির আবেদন সম্পন্ন করুন। আমাদের টিম আপনার আবেদন ভেরিফাই করে সরাসরি আপনার হোয়াটসঅ্যাপে https://npw.bd/knltc ক্লাসরুমের আইডি ও পাসওয়ার্ড বুঝিয়ে দেবে।",
        labelName: "শিক্ষার্থীর পূর্ণ নাম *",
        placeholderName: "যেমন: মোঃ তানভীর আহমেদ",
        labelPhone: "মোবাইল নম্বর (Phone) *",
        placeholderPhone: "যেমন: 01711 223344",
        labelWhatsapp: "হোয়াটসঅ্যাপ নম্বর (WhatsApp) *",
        placeholderWhatsapp: "যেমন: 01711 223344 (LMS আইডি পাওয়ার জন্য)",
        labelCourse: "কোর্সের নাম *",
        labelClassMode: "ক্লাসের মাধ্যম *",
        labelPurpose: "জাপান গমনের উদ্দেশ্য *",
        modeOnline: "অনলাইন লাইভ ক্লাস (Zoom)",
        modePaltan: "পল্টন হেড অফিস (অফলাইন)",
        modeDhanmondi: "ধানমন্ডি শাখা (অফলাইন)",
        purposeStudent: "Student Visa (জাপানে উচ্চশিক্ষা)",
        purposeSSW: "SSW দক্ষ কর্মী (Job Visa)",
        purposeTITP: "TITP টেকনিক্যাল ইন্টার্ন",
        purposeCareer: "জাপানি ভাষা ও সাধারণ ক্যারিয়ার",
        courses: [
          {
            id: "N5_COURSE" as CourseOption,
            name: "Japanese N5 Level Course",
            details: "৩ মাস মেয়াদি • ফি: ৳১২,০০০ (৩টি স্পেশাল ফ্রি বোনাস কোর্সসহ)",
          },
          {
            id: "N4_COURSE" as CourseOption,
            name: "Japanese N4 Level Course",
            details: "৩ মাস মেয়াদি • ফি: ৳১৪,৫০০ (SSW জব ভিসা ও বিশ্ববিদ্যালয় প্রস্তুতি)",
          },
          {
            id: "IRODORI_JAPANESE" as CourseOption,
            name: "Irodori Japanese Course",
            details: "প্র্যাকটিক্যাল স্পোকেন ও কর্মক্ষেত্রের রিয়েল-লাইফ জাপানিজ",
          },
          {
            id: "ADVANCED_LEVELS" as CourseOption,
            name: "Advanced Levels (JLPT N3, N2, N1)",
            details: "৪ মাস মেয়াদি • ফি: ৳১৮,০০০ (কর্পোরেট ও ক্যারিয়ার বিশেষ প্রস্তুতি)",
          },
        ],
        btnSubmit: "ভর্তির আবেদন জমা দিন",
        submitting: "আবেদন জমা হচ্ছে...",
        securityNote: "আপনার তথ্য সম্পূর্ণ নিরাপদ। অফিশিয়াল হটলাইন: +৮৮০ ১৮০৫ ০১৩৬৩৩",
        selectedLabel: "নির্বাচিত কোর্স:",
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
        kicker: "オンライン受講申請",
        title: "日本語講座 受講申込みフォーム",
        subtitle:
          "以下のフォームにご入力ください。受講手続確認後、公式LMS（https://npw.bd/knltc）のアカウントID・パスワードをWhatsAppにてご案内します。",
        labelName: "氏名 *",
        placeholderName: "例：Md. Tanvir Ahmed",
        labelPhone: "電話番号 *",
        placeholderPhone: "例：01711 223344",
        labelWhatsapp: "WhatsApp番号 *",
        placeholderWhatsapp: "例：01711 223344 (ID送信用)",
        labelCourse: "希望コース（Dropdown）*",
        labelClassMode: "受講形式 *",
        labelPurpose: "渡航・学習目的 *",
        modeOnline: "オンラインLIVE講義（Zoom）",
        modePaltan: "パルタン本部校舎（対面）",
        modeDhanmondi: "ダンモンディ校舎（対面）",
        purposeStudent: "留学ビザ（大学・大学院・専門学校）",
        purposeSSW: "特定技能（SSW就労ビザ）",
        purposeTITP: "技能実習生プログラム",
        purposeCareer: "ビジネス実務・キャリアアップ",
        courses: [
          {
            id: "N5_COURSE" as CourseOption,
            name: "日本語N5集中講座",
            details: "3ヶ月 • ৳12,000 (大使館面接・履歴書3大特典付帯)",
          },
          {
            id: "N4_COURSE" as CourseOption,
            name: "日本語N4中級講座",
            details: "3ヶ月 • ৳14,500 (特定技能就労・進学対策)",
          },
          {
            id: "IRODORI_JAPANESE" as CourseOption,
            name: "いろどり日本語 実践会話",
            details: "生活・職場コミュニケーション特訓",
          },
          {
            id: "ADVANCED_LEVELS" as CourseOption,
            name: "上級マスター（JLPT N3 / N2 / N1）",
            details: "4ヶ月 • ৳18,000 (高度ビジネス日本語)",
          },
        ],
        btnSubmit: "受講申請を送信する",
        submitting: "送信中...",
        securityNote: "個人情報は厳格に保護されます。公式ホットライン: +880 1805 013633",
        selectedLabel: "選択中のコース:",
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

  // Listen for course selection from package cards
  useEffect(() => {
    const handleCourseSelect = (e: Event) => {
      const customEvent = e as CustomEvent<{ courseId: string }>;
      if (customEvent.detail?.courseId) {
        const targetId = customEvent.detail.courseId as CourseOption;
        setCourse(targetId);
      }
    };
    window.addEventListener("knltc-select-course", handleCourseSelect);
    return () => {
      window.removeEventListener("knltc-select-course", handleCourseSelect);
    };
  }, []);

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

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const referenceId = `KNLTC-2026-${randomNum}`;

    const selectedCourseObj = t.courses.find((c) => c.id === course);
    const courseLabel = selectedCourseObj ? `${selectedCourseObj.name} (${selectedCourseObj.details})` : course;

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

      try {
        trackLead();
      } catch {
        // Safe fallback
      }

      setIsSubmitting(false);
      setSuccessModalOpen(true);
    }, 400);
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
    const message =
      language === "bn"
        ? `আসসালামু আলাইকুম KNLTC,\nআমি ${submittedData.name}।\nআমি ${submittedData.courseLabel} কোর্সে ভর্তির আবেদন করেছি।\nরেফারেন্স আইডি: ${submittedData.id}\nমোবাইল: ${submittedData.phone}\nহোয়াটসঅ্যাপ: ${submittedData.whatsapp}\nক্লাস মোড: ${submittedData.classModeLabel}\n\nআমার https://npw.bd/knltc ক্লাসরুমের আইডি ও পাসওয়ার্ড পাওয়ার জন্য যোগাযোগ করছি। ধন্যবাদ!`
        : language === "ja"
        ? `こんにちは KNLTC事務局様、\n${submittedData.name}と申します。\nコース「${submittedData.courseLabel}」への受講申請を完了しました。\n受付ID: ${submittedData.id}\n電話番号: ${submittedData.phone}\nWhatsApp: ${submittedData.whatsapp}\n受講形式: ${submittedData.classModeLabel}\n\n公式LMS（https://npw.bd/knltc）のログイン情報のご案内をお願いいたします。`
        : `Hello KNLTC Admissions,\nMy name is ${submittedData.name}.\nI submitted an application for: ${submittedData.courseLabel}.\nReference ID: ${submittedData.id}\nPhone: ${submittedData.phone}\nWhatsApp: ${submittedData.whatsapp}\nClass Mode: ${submittedData.classModeLabel}\n\nI am contacting you to verify my admission and receive my https://npw.bd/knltc LMS classroom login credentials. Thank you!`;
    return `https://wa.me/8801805013633?text=${encodeURIComponent(message)}`;
  };

  const currentCourseObj = t.courses.find((c) => c.id === course);

  return (
    <section id="enrollment-form" className="py-16 md:py-24 bg-[#fcfaf7] border-b border-stone-200 scroll-mt-16">
      <div className="container-narrow max-w-2xl">
        {/* Header - Quiet & Executive */}
        <div className="text-center mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-[#b91c1c]">
            {t.kicker}
          </p>
          <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t.title}
          </h2>
          <p className="mt-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-lg mx-auto">
            {t.subtitle}
          </p>
        </div>

        {/* Form Card - Minimalist, Pristine White on Cream */}
        <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-9 shadow-sm">
          {formError && (
            <div className="mb-6 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs sm:text-sm text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 1. Student Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
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
                  className="w-full rounded-xl border border-stone-300 bg-white py-2.5 pl-10 pr-3.5 text-sm text-slate-900 shadow-xs focus:border-[#b91c1c] focus:ring-1 focus:ring-[#b91c1c] focus:outline-none transition"
                />
              </div>
            </div>

            {/* 2. Phone & WhatsApp in a 2-column layout */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
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
                      if (!whatsapp) setWhatsapp(e.target.value);
                    }}
                    placeholder={t.placeholderPhone}
                    className="w-full rounded-xl border border-stone-300 bg-white py-2.5 pl-10 pr-3.5 text-sm text-slate-900 shadow-xs focus:border-[#b91c1c] focus:ring-1 focus:ring-[#b91c1c] focus:outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
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
                    className="w-full rounded-xl border border-stone-300 bg-white py-2.5 pl-10 pr-3.5 text-sm text-slate-900 shadow-xs focus:border-[#15803d] focus:ring-1 focus:ring-[#15803d] focus:outline-none transition"
                  />
                </div>
              </div>
            </div>

            {/* 3. Minimalist, Professional Course Option (Dropdown) */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                {t.labelCourse}
              </label>
              <select
                value={course}
                onChange={(e) => setCourse(e.target.value as CourseOption)}
                className="w-full rounded-xl border border-stone-300 bg-white p-3 text-xs sm:text-sm font-medium text-slate-900 shadow-xs focus:border-[#b91c1c] focus:ring-1 focus:ring-[#b91c1c] focus:outline-none transition cursor-pointer"
              >
                {t.courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} — {c.details}
                  </option>
                ))}
              </select>
              {currentCourseObj && (
                <p className="mt-1.5 text-[11px] text-slate-500 font-medium pl-1">
                  {t.selectedLabel} <span className="text-slate-800 font-semibold">{currentCourseObj.name}</span> ({currentCourseObj.details})
                </p>
              )}
            </div>

            {/* 4. Class Mode (Radio Selection) */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                {t.labelClassMode}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { id: "ONLINE_LIVE" as ClassModeOption, label: t.modeOnline },
                  { id: "OFFLINE_PALTAN" as ClassModeOption, label: t.modePaltan },
                  { id: "OFFLINE_DHANMONDI" as ClassModeOption, label: t.modeDhanmondi },
                ].map((item) => {
                  const isChecked = classMode === item.id;
                  return (
                    <label
                      key={item.id}
                      onClick={() => setClassMode(item.id)}
                      className={`flex items-center gap-2 rounded-xl border p-2.5 text-xs font-medium cursor-pointer transition ${
                        isChecked
                          ? "border-[#b91c1c] bg-red-50/40 text-slate-900"
                          : "border-stone-200 bg-white text-slate-600 hover:border-stone-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="classMode"
                        checked={isChecked}
                        onChange={() => setClassMode(item.id)}
                        className="text-[#b91c1c] focus:ring-[#b91c1c]"
                      />
                      <span>{item.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 5. Purpose Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                {t.labelPurpose}
              </label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value as VisaPurposeOption)}
                className="w-full rounded-xl border border-stone-300 bg-white p-3 text-xs sm:text-sm font-medium text-slate-900 shadow-xs focus:border-[#b91c1c] focus:ring-1 focus:ring-[#b91c1c] focus:outline-none transition cursor-pointer"
              >
                <option value="STUDENT_VISA">{t.purposeStudent}</option>
                <option value="SSW_JOB">{t.purposeSSW}</option>
                <option value="TITP_INTERN">{t.purposeTITP}</option>
                <option value="CAREER_SKILLS">{t.purposeCareer}</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#15803d] hover:bg-emerald-700 text-white font-bold text-sm sm:text-base py-6 rounded-xl shadow-xs transition-all"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t.submitting}
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Send className="h-4 w-4" />
                    {t.btnSubmit}
                  </span>
                )}
              </Button>
            </div>

            {/* Security note */}
            <p className="text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5 pt-1">
              <Lock className="h-3 w-3 text-slate-400" />
              <span>{t.securityNote}</span>
            </p>
          </form>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {successModalOpen && submittedData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 16 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="relative w-full max-w-lg rounded-2xl bg-white p-6 sm:p-7 shadow-2xl border border-stone-200"
            >
              <button
                onClick={() => setSuccessModalOpen(false)}
                className="absolute top-4 right-4 rounded-full p-1.5 text-slate-400 hover:bg-stone-100 hover:text-slate-600 transition"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-[#15803d] mb-3">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  {t.modal.title}
                </h3>
              </div>

              <div className="mt-3 rounded-xl bg-emerald-50/70 border border-emerald-200 p-3.5 text-xs text-emerald-900 leading-relaxed text-center sm:text-left">
                <p className="font-medium">{t.modal.msg}</p>
              </div>

              <div className="mt-3 flex items-center justify-between rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2">
                <div>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                    {t.modal.refLabel}
                  </span>
                  <span className="text-sm font-extrabold text-[#b91c1c]">
                    {submittedData.id}
                  </span>
                </div>
                <Button
                  type="button"
                  onClick={handleCopyId}
                  variant="outline"
                  size="sm"
                  className="h-7 rounded-lg text-xs font-semibold gap-1 active:scale-95 transition-transform"
                >
                  <Copy className="h-3 w-3" />
                  {copiedId ? t.modal.copied : t.modal.copyBtn}
                </Button>
              </div>

              <div className="mt-3 rounded-xl border border-stone-100 bg-stone-50/60 p-3 text-xs text-slate-700 space-y-1">
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
              </div>

              <div className="mt-5 space-y-2.5">
                <Button
                  asChild
                  size="lg"
                  className="w-full bg-[#15803d] hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm py-4 rounded-xl shadow-xs active:scale-[0.98] transition-transform"
                >
                  <a
                    href={buildWhatsAppExpediteLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>{t.modal.btnWhatsapp}</span>
                  </a>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="w-full border-red-200 text-[#b91c1c] hover:bg-red-50 font-bold text-xs sm:text-sm py-4 rounded-xl active:scale-[0.98] transition-transform"
                >
                  <a
                    href="https://npw.bd/knltc"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5"
                  >
                    <GraduationCap className="h-4 w-4" />
                    <span>{t.modal.btnLms}</span>
                    <ExternalLink className="h-3.5 w-3.5 opacity-80" />
                  </a>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
