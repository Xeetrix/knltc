"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  GraduationCap,
  Headphones,
  Loader2,
  Lock,
  Maximize2,
  MessageCircle,
  Phone,
  Printer,
  QrCode,
  Receipt,
  Send,
  Sparkles,
  Tag,
  User,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";
import { trackLead } from "@/lib/meta-pixel";
import {
  DEFAULT_WEBSITE_CMS,
  fetchLiveStoreFromServer,
  getWebsiteCms,
  recordPublicCourseEnrollment,
  type LanguageCoursePromoCode,
} from "@/lib/knltc-cms-store";

export type CourseOption =
  | "JFT_IRODORI"
  | "N5_COURSE"
  | "N4_COURSE"
  | "N5_N4_COMBO";
export type ClassModeOption = "ONLINE_LIVE" | "OFFLINE_PALTAN" | "OFFLINE_KHULNA";
export type VisaPurposeOption =
  | "STUDENT_VISA"
  | "SSW_JOB"
  | "TITP_INTERN"
  | "CAREER_SKILLS";
export type PaymentPlanOption = "FULL_PAYMENT" | "INSTALLMENT_50";
export type PaymentMethodOption = "BKASH_BANGLA_QR" | "PAY_AT_OFFICE";
export type EnrollmentFlowMode = "TALK_TO_SALES" | "DIRECT_PURCHASE";

export function slugToCourseOption(slug?: string): CourseOption {
  const s = (slug || "").toLowerCase().trim();
  if (s === "jlpt-n5" || s === "n5" || s === "n5_course") return "N5_COURSE";
  if (s === "jlpt-n4" || s === "n4" || s === "n4_course") return "N4_COURSE";
  if (
    s === "n5-n4-combo" ||
    s === "combo" ||
    s === "n5_n4_combo" ||
    s === "jlpt-combo"
  ) {
    return "N5_N4_COMBO";
  }
  return "JFT_IRODORI";
}

export function courseOptionToSlug(course: CourseOption): string {
  switch (course) {
    case "N5_COURSE":
      return "jlpt-n5";
    case "N4_COURSE":
      return "jlpt-n4";
    case "N5_N4_COMBO":
      return "n5-n4-combo";
    case "JFT_IRODORI":
    default:
      return "jft-irodori";
  }
}

interface SubmittedReceiptData {
  id: string;
  submittedAt: string;
  flowMode: EnrollmentFlowMode;
  name: string;
  phone: string;
  whatsapp: string;
  courseId: CourseOption;
  courseLabel: string;
  classMode: ClassModeOption;
  classModeLabel: string;
  purpose: VisaPurposeOption;
  purposeLabel: string;
  paymentPlan: PaymentPlanOption;
  paymentMethod: PaymentMethodOption;
  baseFeeBdt: number;
  fullPayDiscountBdt: number;
  promoCode?: string;
  promoDiscountBdt: number;
  netCourseFeeBdt: number;
  paidAmountBdt: number;
  dueAmountBdt: number;
  senderNumber: string;
  trxId: string;
  studentNote?: string;
}

export interface EnrollmentFormProps {
  initialCourseSlug?: string;
  initialPlan?: PaymentPlanOption;
  initialPromoCode?: string;
  isStandalonePage?: boolean;
}

export default function EnrollmentForm({
  initialCourseSlug,
  initialPlan,
  initialPromoCode,
  isStandalonePage = false,
}: EnrollmentFormProps = {}) {
  const { language } = useLanguage();

  // Live CMS Pricing, Merchant Info & Promo Codes
  const [cmsConfig, setCmsConfig] = useState(
    DEFAULT_WEBSITE_CMS.languageCoursePage,
  );

  useEffect(() => {
    const syncFromStore = () => {
      try {
        const cms = getWebsiteCms();
        if (cms?.languageCoursePage) {
          setCmsConfig({
            ...DEFAULT_WEBSITE_CMS.languageCoursePage,
            ...cms.languageCoursePage,
            promoCodes: Array.isArray(cms.languageCoursePage.promoCodes)
              ? cms.languageCoursePage.promoCodes
              : [],
          });
        }
      } catch {
        // fallback to default
      }
    };

    syncFromStore();
    void fetchLiveStoreFromServer().then(() => {
      syncFromStore();
    });

    window.addEventListener("knltc-cms-updated", syncFromStore);
    window.addEventListener("storage", syncFromStore);
    return () => {
      window.removeEventListener("knltc-cms-updated", syncFromStore);
      window.removeEventListener("storage", syncFromStore);
    };
  }, []);

  const n5Fee = Number(cmsConfig.n5PriceBdt) || 12000;
  const n4Fee = Number(cmsConfig.n4PriceBdt) || 14500;
  const comboFee = Number(cmsConfig.comboPriceBdt) || 21500;
  const jftFee = Number(cmsConfig.jftPriceBdt) || 12500;
  const fullDiscountPercent = cmsConfig.fullPaymentDiscountPercent ?? 20;
  const merchantNumber = cmsConfig.bkashMerchantNumber || "01805-013633";
  const banglaQrUrl = (cmsConfig.banglaQrImageUrl || "").trim();
  const lmsUrl = cmsConfig.externalLmsUrl || "https://npw.bd/knltc";

  const formatBdt = (val: number) => {
    const rounded = Math.round(val);
    return language === "bn"
      ? `৳${rounded.toLocaleString("bn-BD")}`
      : `৳${rounded.toLocaleString("en-IN")}`;
  };

  const t = translate(
    {
      en: {
        kicker: "Course Enrollment",
        title: "Enroll in Japanese Language Course",
        subtitle: `Submit your application first to discuss payment options with our team, or choose "Enroll Now" for instant admission (Full Payment ${fullDiscountPercent}% OFF or 50% Installment).`,
        tabSales: "Apply Now",
        tabDirect: "Enroll Now",
        labelName: "Full Name *",
        placeholderName: "Your full name",
        labelPhone: "Mobile *",
        placeholderPhone: "017XXXXXXXX",
        labelWhatsapp: "WhatsApp *",
        placeholderWhatsapp: "017XXXXXXXX",
        labelCourse: "Course *",
        labelClassMode: "Class Mode *",
        labelPurpose: "Purpose *",
        labelPaymentPlan: "Payment Plan *",
        planFullTitle: `Full Payment (${fullDiscountPercent}% OFF)`,
        planFullSub: "Instant discount • Zero due",
        planInstallmentTitle: "Installment (50% Now)",
        planInstallmentSub: "Pay 50% now • 50% after class starts",
        labelNote: "Note (Optional)",
        placeholderNote: "Any question about batch timing or payment plan...",
        modeOnline: "Online Live Class",
        modePaltan: "Paltan Head Office",
        modeKhulna: "Khulna Branch",
        purposeStudent: "Student Visa",
        purposeSSW: "SSW Job Visa",
        purposeTITP: "TITP Intern",
        purposeCareer: "Language & Career",
        promoToggle: "Have a promo code?",
        promoPlaceholder: "Promo code",
        promoApplyBtn: "Apply",
        promoRemoveBtn: "Remove",
        promoInvalid: "Invalid or expired code.",
        promoAppliedMsg: "Discount applied!",
        senderLabel: "Sender No. *",
        senderPlaceholder: "017XXXXXXXX",
        paidAmountLabel: "Amount (৳) *",
        trxIdLabel: "TrxID *",
        trxIdPlaceholder: "e.g. BKL982XYZ",
        qrBoxBadge: "bKash / Bangla QR",
        qrBoxTitle: "Scan to Pay",
        qrMerchantLabel: "bKash Merchant:",
        qrEnlargeBtn: "Enlarge QR",
        summaryHeading: "Fee Summary",
        baseFeeText: "Regular Course Fee",
        fullDiscountText: `Full Payment Discount (${fullDiscountPercent}%)`,
        promoDiscountText: "Promo Discount",
        netCourseFeeText: "Total Payable Fee",
        payableTodayFullText: "Payable Now (Full)",
        payableTodayInstText: "Payable Now (1st Installment 50%)",
        dueLaterText: "Remaining Due (50% Later)",
        btnSubmitSales: "Submit Application",
        btnSubmitDirect: "Complete Enrollment & Get Receipt",
        submittingSales: "Submitting...",
        submittingDirect: "Completing Enrollment...",
        securityNote: "Official KNLTC Admission • +880 1805 013633",
        errorName: "Please enter your full name.",
        errorPhone: "Please enter a valid 11-digit mobile number.",
        errorSender: "Please enter the sender bKash/mobile number.",
        errorTrxId: "Please enter a valid Transaction ID (TrxID).",
        salesCardBadge: "Discuss & Pay Later",
        salesCardTitle: "Discuss Payment Plan First",
        salesCardDesc:
          "Submit the form with your basic details. Our counselor will call you to discuss batch timings and flexible payment options before you make any payment.",
        salesWhatsappBtn: "WhatsApp Sales",
        salesCallBtn: "01805-013633",
        switchToDirectBtn: `Ready to enroll right now? Switch to "Enroll Now" →`,
        courses: [
          {
            id: "JFT_IRODORI" as CourseOption,
            name: "JFT (Irodori)",
            duration: "3 Months • 150 Hours",
            baseFee: jftFee,
            tag: "Priority for Student & SSW Visa",
          },
          {
            id: "N5_COURSE" as CourseOption,
            name: "JLPT N5",
            duration: "3 Months • 150 Hours",
            baseFee: n5Fee,
            tag: "Beginner Foundation + 3 Free Bonus Courses",
          },
          {
            id: "N4_COURSE" as CourseOption,
            name: "JLPT N4",
            duration: "3 Months • 150 Hours",
            baseFee: n4Fee,
            tag: "Intermediate & SSW (Free for KNLTC COE Students)",
          },
          {
            id: "N5_N4_COMBO" as CourseOption,
            name: "JLPT N5 + N4 Combo",
            duration: "6 Months • 300 Hours",
            baseFee: comboFee,
            tag: "Complete Zero-to-N4 Bundle",
          },
        ],
        receipt: {
          congratsTitle: "Congratulations",
          congratsSubDirect:
            "Your instant enrollment and payment details (TrxID) have been recorded.",
          congratsSubSales:
            "Your application has been sent! Our team will contact you to discuss payment.",
          receiptHeaderDirect: "OFFICIAL DIGITAL ADMISSION RECEIPT",
          receiptHeaderSales: "APPLICATION & CONSULTATION CONFIRMATION",
          refLabel: "Ref ID",
          statusBadgeQr: "TrxID Verification",
          statusBadgeSales: "Discuss & Pay Later",
          studentInfoTitle: "Student Details",
          paymentInfoTitle: "Fee & Payment Summary",
          nameLabel: "Name:",
          phoneLabel: "Mobile / WhatsApp:",
          courseLabel: "Course:",
          modeLabel: "Class Mode:",
          purposeLabel: "Purpose:",
          planLabel: "Payment Plan:",
          planFullValue: `Full Payment (${fullDiscountPercent}% OFF)`,
          planInstValue: "50% Installment Plan",
          senderLabel: "Sender No:",
          trxLabel: "TrxID:",
          paidNowLabel: "Paid Now:",
          dueLabel: "Remaining Due:",
          paymentStatusLabel: "Status:",
          payLaterStatusValue: "Discuss Payment Plan with Sales Team",
          nextStepsTitleDirect: "Instant LMS Account Activation",
          nextStepsDescDirect:
            "Send your TrxID on WhatsApp below for instant LMS login activation.",
          nextStepsTitleSales: "Our Team Will Contact You Shortly",
          nextStepsDescSales:
            "Our counselor will call you to finalize your payment plan & batch, or click below to chat on WhatsApp now.",
          btnWhatsappDirect: "Verify on WhatsApp",
          btnWhatsappSales: "Chat on WhatsApp Now",
          btnPrint: "Print / Save PDF",
          btnLms: "Open LMS Portal",
          btnNewApp: "Submit Another Application",
        },
      },
      bn: {
        kicker: "কোর্স এনরোলমেন্ট",
        title: "জাপানি ভাষা কোর্সে ভর্তি ফরম",
        subtitle: `পেমেন্টের ব্যাপারে আলোচনা করে পেমেন্ট করতে চাইলে "আবেদন করুন" বেছে নিন, অথবা সাথে সাথে ভর্তি হতে "এখনই এনরোল করুন" সিলেক্ট করুন (ফুল পেমেন্টে ${fullDiscountPercent}% ছাড় অথবা ৫০% কিস্তি সুবিধা)।`,
        tabSales: "আবেদন করুন",
        tabDirect: "এখনই এনরোল করুন",
        labelName: "পূর্ণ নাম *",
        placeholderName: "আপনার নাম লিখুন",
        labelPhone: "মোবাইল *",
        placeholderPhone: "017XXXXXXXX",
        labelWhatsapp: "হোয়াটসঅ্যাপ *",
        placeholderWhatsapp: "017XXXXXXXX",
        labelCourse: "কোর্স *",
        labelClassMode: "ক্লাস মোড *",
        labelPurpose: "উদ্দেশ্য *",
        labelPaymentPlan: "পেমেন্ট প্ল্যান *",
        planFullTitle: `ফুল পেমেন্ট (${fullDiscountPercent}% ছাড়)`,
        planFullSub: "এককালীন পরিশোধ • কোনো বকেয়া নেই",
        planInstallmentTitle: "ইন্সটলমেন্ট পেমেন্ট (৫০% কিস্তি)",
        planInstallmentSub: "এখন ৫০% • বাকি ৫০% ক্লাস শুরুর পর",
        labelNote: "নোট বা প্রশ্ন (ঐচ্ছিক)",
        placeholderNote: "পেমেন্ট প্ল্যান বা ব্যাচ টাইম সম্পর্কে কিছু জানাতে চাইলে...",
        modeOnline: "অনলাইন লাইভ ক্লাস",
        modePaltan: "পল্টন হেড অফিস",
        modeKhulna: "খুলনা শাখা",
        purposeStudent: "স্টুডেন্ট ভিসা",
        purposeSSW: "SSW জব ভিসা",
        purposeTITP: "TITP ইন্টার্ন",
        purposeCareer: "ভাষা ও ক্যারিয়ার",
        promoToggle: "প্রোমো কোড আছে?",
        promoPlaceholder: "কোড লিখুন",
        promoApplyBtn: "অ্যাপ্লাই",
        promoRemoveBtn: "বাতিল",
        promoInvalid: "কোডটি সঠিক নয়।",
        promoAppliedMsg: "ছাড় যুক্ত হয়েছে!",
        senderLabel: "বিকাশ নাম্বার *",
        senderPlaceholder: "017XXXXXXXX",
        paidAmountLabel: "পরিমাণ (৳) *",
        trxIdLabel: "TrxID *",
        trxIdPlaceholder: "যেমন: BKL982XYZ",
        qrBoxBadge: "বিকাশ / Bangla QR",
        qrBoxTitle: "স্ক্যান করে পেমেন্ট করুন",
        qrMerchantLabel: "বিকাশ মার্চেন্ট:",
        qrEnlargeBtn: "বড় করে দেখুন",
        summaryHeading: "কোর্স ফি ও পেমেন্ট হিসাব",
        baseFeeText: "রেগুলার কোর্স ফি",
        fullDiscountText: `ফুল পেমেন্ট ছাড় (${fullDiscountPercent}%)`,
        promoDiscountText: "প্রোমো ছাড়",
        netCourseFeeText: "মোট কোর্স ফি",
        payableTodayFullText: "এখন পরিশোধযোগ্য (ফুল পেমেন্ট)",
        payableTodayInstText: "এখন পরিশোধযোগ্য (১ম কিস্তি ৫০%)",
        dueLaterText: "পরবর্তী কিস্তি (বাকি ৫০%)",
        btnSubmitSales: "আবেদন সাবমিট করুন",
        btnSubmitDirect: "এখনই এনরোলমেন্ট সম্পন্ন করুন ও রিসিট নিন",
        submittingSales: "আবেদন জমা হচ্ছে...",
        submittingDirect: "এনরোলমেন্ট সম্পন্ন হচ্ছে...",
        securityNote: "অফিশিয়াল এডমিশন ডেস্ক • +৮৮০ ১৮০৫ ০১৩৬৩৩",
        errorName: "অনুগ্রহ করে আপনার পূর্ণ নাম লিখুন।",
        errorPhone: "সঠিক মোবাইল নম্বর লিখুন (কমপক্ষে ১০ ডিজিট)।",
        errorSender: "যে নাম্বার থেকে টাকা পাঠিয়েছেন সেটি লিখুন।",
        errorTrxId: "সঠিক Transaction ID (TrxID) লিখুন।",
        salesCardBadge: "আলোচনা সাপেক্ষে পেমেন্ট",
        salesCardTitle: "আগে আলোচনা করুন, পরে পেমেন্ট করুন",
        salesCardDesc:
          "ফর্মটি পূরণ করে সাবমিট করুন। আমাদের টিম আপনার সাথে যোগাযোগ করে পেমেন্টের ব্যাপারে আলোচনা করার পর আপনি সুবিধামতো পেমেন্ট করবেন।",
        salesWhatsappBtn: "হোয়াটসঅ্যাপ মেসেজ",
        salesCallBtn: "01805-013633",
        switchToDirectBtn: `এখনই পেমেন্ট করে ভর্তি হতে চান? "এখনই এনরোল করুন" অপশনে যান →`,
        courses: [
          {
            id: "JFT_IRODORI" as CourseOption,
            name: "JFT (Irodori)",
            duration: "৩ মাস • ১৫০ ঘণ্টা",
            baseFee: jftFee,
            tag: "স্টুডেন্ট ও SSW ভিসার #১ অগ্রাধিকার",
          },
          {
            id: "N5_COURSE" as CourseOption,
            name: "JLPT N5",
            duration: "৩ মাস • ১৫০ ঘণ্টা",
            baseFee: n5Fee,
            tag: "বিগিনার ফাউন্ডেশন + ৩টি বোনাস কোর্স ফ্রি",
          },
          {
            id: "N4_COURSE" as CourseOption,
            name: "JLPT N4",
            duration: "৩ মাস • ১৫০ ঘণ্টা",
            baseFee: n4Fee,
            tag: "ইন্টারমিডিয়েট ও SSW (COE প্রার্থীদের ফ্রি)",
          },
          {
            id: "N5_N4_COMBO" as CourseOption,
            name: "JLPT N5 + N4 কম্বো",
            duration: "৬ মাস • ৩০০ ঘণ্টা",
            baseFee: comboFee,
            tag: "জিরো থেকে N4 কমপ্লিট কম্বো প্যাকেজ",
          },
        ],
        receipt: {
          congratsTitle: "অভিনন্দন",
          congratsSubDirect:
            "আপনার এনরোলমেন্ট ও পেমেন্ট তথ্য (TrxID) সফলভাবে জমা হয়েছে।",
          congratsSubSales:
            "আপনার আবেদনটি জমা হয়েছে! পেমেন্টের ব্যাপারে আলোচনার জন্য আমাদের টিম কল করবে।",
          receiptHeaderDirect: "ডিজিটাল ভর্তি ও মানি রিসিট",
          receiptHeaderSales: "আবেদন ও পেমেন্ট আলোচনা কনফার্মেশন",
          refLabel: "রেফারেন্স আইডি",
          statusBadgeQr: "TrxID ভেরিফিকেশন চলমান",
          statusBadgeSales: "আলোচনা সাপেক্ষে পেমেন্ট",
          studentInfoTitle: "শিক্ষার্থীর তথ্য",
          paymentInfoTitle: "কোর্স ফি ও পেমেন্ট বিবরণ",
          nameLabel: "নাম:",
          phoneLabel: "মোবাইল / হোয়াটসঅ্যাপ:",
          courseLabel: "কোর্স:",
          modeLabel: "ক্লাস মোড:",
          purposeLabel: "উদ্দেশ্য:",
          planLabel: "পেমেন্ট প্ল্যান:",
          planFullValue: `ফুল পেমেন্ট (${fullDiscountPercent}% ছাড়)`,
          planInstValue: "ইন্সটলমেন্ট পেমেন্ট (৫০% কিস্তি)",
          senderLabel: "বিকাশ নাম্বার:",
          trxLabel: "TrxID:",
          paidNowLabel: "পরিশোধিত (এখন):",
          dueLabel: "বকেয়া (পরবর্তী কিস্তি):",
          paymentStatusLabel: "স্ট্যাটাস:",
          payLaterStatusValue: "আলোচনা সাপেক্ষে পেমেন্ট",
          nextStepsTitleDirect: "দ্রুত LMS আইডি ও পাসওয়ার্ড গ্রহণ",
          nextStepsDescDirect:
            "নিচের বাটনে ক্লিক করে হোয়াটসঅ্যাপে TrxID পাঠিয়ে সাথে সাথেই আপনার LMS আইডি বুঝে নিন।",
          nextStepsTitleSales: "আমাদের টিম আপনার সাথে যোগাযোগ করবে",
          nextStepsDescSales:
            "আমাদের কাউন্সেলর শীঘ্রই কল করে পেমেন্ট ও ব্যাচ চূড়ান্ত করবেন। এখনই কথা বলতে নিচের হোয়াটসঅ্যাপ বাটনে ক্লিক করুন।",
          btnWhatsappDirect: "হোয়াটসঅ্যাপে TrxID পাঠান",
          btnWhatsappSales: "হোয়াটসঅ্যাপে কথা বলুন",
          btnPrint: "প্রিন্ট / PDF সেভ",
          btnLms: "LMS পোর্টালে যান",
          btnNewApp: "নতুন আবেদন",
        },
      },
      ja: {
        kicker: "コース受講申込",
        title: "日本語コース受講申込フォーム",
        subtitle: `支払いプランを相談してからお支払いする場合は「申込・支払いプラン相談」、今すぐ入学手続きを完了する場合は「今すぐ申し込む」（一括払い${fullDiscountPercent}%OFFまたは分割50%）をお選びください。`,
        tabSales: "申込フォーム",
        tabDirect: "今すぐ申し込む",
        labelName: "氏名 *",
        placeholderName: "氏名を入力",
        labelPhone: "電話番号 *",
        placeholderPhone: "017XXXXXXXX",
        labelWhatsapp: "WhatsApp *",
        placeholderWhatsapp: "017XXXXXXXX",
        labelCourse: "コース *",
        labelClassMode: "受講形式 *",
        labelPurpose: "目的 *",
        labelPaymentPlan: "お支払いプラン *",
        planFullTitle: `一括払い (${fullDiscountPercent}%割引)`,
        planFullSub: "即時割引 • 残액なし",
        planInstallmentTitle: "分割払い (初回50%)",
        planInstallmentSub: "今50%決済 • 残り50%は開講後",
        labelNote: "備考（任意）",
        placeholderNote: "支払いプランや時間割についてのご質問...",
        modeOnline: "オンラインライブ授業",
        modePaltan: "ダッカ本部（ポルタン）",
        modeKhulna: "クルナ支部",
        purposeStudent: "留学ビザ",
        purposeSSW: "特定技能（SSW）",
        purposeTITP: "技能実習（TITP）",
        purposeCareer: "語学・キャリア",
        promoToggle: "プロモコードをお持ちですか？",
        promoPlaceholder: "コード入力",
        promoApplyBtn: "適用",
        promoRemoveBtn: "解除",
        promoInvalid: "無効なコードです。",
        promoAppliedMsg: "割引適用済み！",
        senderLabel: "送金元番号 *",
        senderPlaceholder: "017XXXXXXXX",
        paidAmountLabel: "金額 (৳) *",
        trxIdLabel: "TrxID *",
        trxIdPlaceholder: "例: BKL982XYZ",
        qrBoxBadge: "bKash / Bangla QR",
        qrBoxTitle: "QRスキャン決済",
        qrMerchantLabel: "bKashマーチャント:",
        qrEnlargeBtn: "拡大表示",
        summaryHeading: "受講料明細",
        baseFeeText: "通常受講料",
        fullDiscountText: `一括払い割引 (${fullDiscountPercent}%)`,
        promoDiscountText: "プロモ割引",
        netCourseFeeText: "受講料合計",
        payableTodayFullText: "本日のお支払い（一括）",
        payableTodayInstText: "本日のお支払い（初回50%）",
        dueLaterText: "次回お支払い（残り50%）",
        btnSubmitSales: "フォームを送信",
        btnSubmitDirect: "今すぐ申し込み＆領収書発行",
        submittingSales: "送信中...",
        submittingDirect: "処理中...",
        securityNote: "公式ホットライン • +880 1805 013633",
        errorName: "氏名をご入力ください。",
        errorPhone: "有効な電話番号をご入力ください。",
        errorSender: "送金元の電話番号をご入力ください。",
        errorTrxId: "有効なTransaction ID (TrxID) をご入力ください。",
        salesCardBadge: "相談してお支払い",
        salesCardTitle: "まずは相談、お支払いは後で",
        salesCardDesc:
          "フォームを送信してください。担当者よりお支払いプランや時間割をご案内した後に決済いただけます。",
        salesWhatsappBtn: "WhatsApp相談",
        salesCallBtn: "01805-013633",
        switchToDirectBtn: `今すぐ入学手続きを完了したい方は「今すぐ申し込む」へ →`,
        courses: [
          {
            id: "JFT_IRODORI" as CourseOption,
            name: "JFT (Irodori)",
            duration: "3ヶ月 • 150時間",
            baseFee: jftFee,
            tag: "留学＆特定技能（SSW）最優先コース",
          },
          {
            id: "N5_COURSE" as CourseOption,
            name: "JLPT N5",
            duration: "3ヶ月 • 150時間",
            baseFee: n5Fee,
            tag: "初級基礎＋3大特典講座無料",
          },
          {
            id: "N4_COURSE" as CourseOption,
            name: "JLPT N4",
            duration: "3ヶ月 • 150時間",
            baseFee: n4Fee,
            tag: "中級・特定技能（COE待機生は無料）",
          },
          {
            id: "N5_N4_COMBO" as CourseOption,
            name: "JLPT N5 + N4 セット",
            duration: "6ヶ月 • 300時間",
            baseFee: comboFee,
            tag: "ゼロからN4合格まで一貫セット",
          },
        ],
        receipt: {
          congratsTitle: "ありがとうございます",
          congratsSubDirect: "お申し込みと決済情報（TrxID）が記録されました。",
          congratsSubSales:
            "申込フォームが送信されました。担当者よりお支払いプランのご相談を差し上げます。",
          receiptHeaderDirect: "公式デジタル受講・決済受領書",
          receiptHeaderSales: "申込受付・支払い相談確認書",
          refLabel: "受付番号",
          statusBadgeQr: "TrxID確認中",
          statusBadgeSales: "相談してお支払い",
          studentInfoTitle: "受講生情報",
          paymentInfoTitle: "受講料明細",
          nameLabel: "氏名:",
          phoneLabel: "電話番号 / WhatsApp:",
          courseLabel: "コース:",
          modeLabel: "受講形式:",
          purposeLabel: "目的:",
          planLabel: "お支払いプラン:",
          planFullValue: `一括払い (${fullDiscountPercent}%割引)`,
          planInstValue: "分割払い (50%)",
          senderLabel: "送金元番号:",
          trxLabel: "TrxID:",
          paidNowLabel: "今回お支払い:",
          dueLabel: "残額（次回）:",
          paymentStatusLabel: "ステータス:",
          payLaterStatusValue: "担当者との相談後にお支払い",
          nextStepsTitleDirect: "LMSアカウントの即時発行",
          nextStepsDescDirect:
            "下のボタンからWhatsAppでTrxIDを送信すると、即座にLMSログイン情報が発行されます。",
          nextStepsTitleSales: "担当者よりご連絡いたします",
          nextStepsDescSales:
            "まもなく担当者よりご連絡いたします。お急ぎの方は下のWhatsAppボタンをご利用ください。",
          btnWhatsappDirect: "WhatsAppでTrxIDを送信",
          btnWhatsappSales: "WhatsAppで担当者に連絡",
          btnPrint: "印刷 / PDF保存",
          btnLms: "LMSポータルを開く",
          btnNewApp: "新規申込み",
        },
      },
    },
    language,
  );

  // Flow Mode: "TALK_TO_SALES" (আবেদন করুন • আলোচনা সাপেক্ষে পেমেন্ট) vs "DIRECT_PURCHASE" (এখনই এনরোল করুন)
  const [flowMode, setFlowMode] = useState<EnrollmentFlowMode>(() =>
    initialPlan === "FULL_PAYMENT" ? "DIRECT_PURCHASE" : "TALK_TO_SALES",
  );

  // Payment Plan inside "এখনই এনরোল করুন" (Instant Enrollment): FULL_PAYMENT (20% OFF) vs INSTALLMENT_50 (50% Now)
  const [instantPaymentPlan, setInstantPaymentPlan] =
    useState<PaymentPlanOption>("FULL_PAYMENT");

  // Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [course, setCourse] = useState<CourseOption>(() =>
    slugToCourseOption(initialCourseSlug),
  );
  const [classMode, setClassMode] = useState<ClassModeOption>("ONLINE_LIVE");
  const [purpose, setPurpose] = useState<VisaPurposeOption>("STUDENT_VISA");
  const [studentNote, setStudentNote] = useState("");

  // Promo Code State (Collapsible toggle in Instant Enrollment mode)
  const [showPromoInput, setShowPromoInput] = useState(
    Boolean(initialPromoCode),
  );
  const [promoInput, setPromoInput] = useState(
    initialPromoCode ? initialPromoCode.toUpperCase() : "",
  );
  const [appliedPromo, setAppliedPromo] =
    useState<LanguageCoursePromoCode | null>(null);
  const [promoFeedback, setPromoFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Sync initialCourseSlug and URL query parameters
  useEffect(() => {
    if (initialCourseSlug) {
      setCourse(slugToCourseOption(initialCourseSlug));
      setPaidAmountEdited(false);
    }
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const planParam = (params.get("plan") || "").toLowerCase();
      const modeParam = (params.get("mode") || "").toLowerCase();
      if (
        modeParam === "sales" ||
        modeParam === "consult" ||
        planParam === "installment" ||
        planParam === "later"
      ) {
        setFlowMode("TALK_TO_SALES");
        setPaidAmountEdited(false);
      } else if (planParam === "50") {
        setFlowMode("DIRECT_PURCHASE");
        setInstantPaymentPlan("INSTALLMENT_50");
        setPaidAmountEdited(false);
      } else if (
        modeParam === "direct" ||
        modeParam === "enroll" ||
        planParam === "full" ||
        planParam === "20"
      ) {
        setFlowMode("DIRECT_PURCHASE");
        setInstantPaymentPlan("FULL_PAYMENT");
        setPaidAmountEdited(false);
      }
      const promoParam = (params.get("promo") || initialPromoCode || "")
        .trim()
        .toUpperCase();
      if (promoParam) {
        setPromoInput(promoParam);
        setShowPromoInput(true);
        const cms = getWebsiteCms();
        const availableCodes = cms?.languageCoursePage?.promoCodes || [];
        const todayIso = new Date().toISOString().slice(0, 10);
        const matched = availableCodes.find(
          (p) =>
            p.isActive &&
            p.code.trim().toUpperCase() === promoParam &&
            (!p.expiresAt || p.expiresAt >= todayIso),
        );
        if (matched) {
          setAppliedPromo(matched);
        }
      }
    }
  }, [initialCourseSlug, initialPromoCode]);

  // Payment Verification Inputs (Instant Enrollment mode)
  const [senderNumber, setSenderNumber] = useState("");
  const [paidAmountInput, setPaidAmountInput] = useState<number>(0);
  const [paidAmountEdited, setPaidAmountEdited] = useState(false);
  const [trxId, setTrxId] = useState("");

  // UI / Modal / Receipt State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submittedReceipt, setSubmittedReceipt] =
    useState<SubmittedReceiptData | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedMerchant, setCopiedMerchant] = useState(false);
  const [qrZoomOpen, setQrZoomOpen] = useState(false);
  const [qrImgFailed, setQrImgFailed] = useState(false);

  useEffect(() => {
    setQrImgFailed(false);
  }, [banglaQrUrl]);

  const currentCourseObj =
    t.courses.find((c) => c.id === course) || t.courses[0];
  const baseFeeBdt = currentCourseObj.baseFee;

  // Full Payment (20% OFF) applies when in DIRECT_PURCHASE + FULL_PAYMENT plan
  const isInstantFullPay =
    flowMode === "DIRECT_PURCHASE" && instantPaymentPlan === "FULL_PAYMENT";

  const fullPayDiscountBdt = isInstantFullPay
    ? Math.round((baseFeeBdt * fullDiscountPercent) / 100)
    : 0;
  const feeAfterFullDiscount = Math.max(0, baseFeeBdt - fullPayDiscountBdt);

  const promoDiscountBdt =
    flowMode === "DIRECT_PURCHASE" && appliedPromo
      ? appliedPromo.discountType === "PERCENT"
        ? Math.round((feeAfterFullDiscount * appliedPromo.discountValue) / 100)
        : Math.min(feeAfterFullDiscount, Math.round(appliedPromo.discountValue))
      : 0;

  const netCourseFeeBdt = Math.max(0, feeAfterFullDiscount - promoDiscountBdt);

  // Calculate recommended payable today based on Full Payment vs 50% Installment
  const recommendedPayableToday =
    flowMode === "DIRECT_PURCHASE"
      ? instantPaymentPlan === "FULL_PAYMENT"
        ? netCourseFeeBdt
        : Math.round(netCourseFeeBdt / 2)
      : 0;

  const estimatedRemainingDue =
    flowMode === "DIRECT_PURCHASE"
      ? Math.max(0, netCourseFeeBdt - recommendedPayableToday)
      : netCourseFeeBdt;

  useEffect(() => {
    if (!paidAmountEdited) {
      setPaidAmountInput(recommendedPayableToday);
    }
  }, [recommendedPayableToday, paidAmountEdited]);

  useEffect(() => {
    const handleCourseSelect = (e: Event) => {
      const customEvent = e as CustomEvent<{
        courseId: string;
        paymentPlan?: PaymentPlanOption;
      }>;
      if (customEvent.detail?.courseId) {
        const rawId = customEvent.detail.courseId;
        const mappedId: CourseOption =
          rawId === "IRODORI_JAPANESE" || rawId === "JFT_IRODORI"
            ? "JFT_IRODORI"
            : rawId === "N4_COURSE"
              ? "N4_COURSE"
              : rawId === "N5_N4_COMBO" || rawId === "ADVANCED_LEVELS"
                ? "N5_N4_COMBO"
                : "N5_COURSE";
        setCourse(mappedId);
        setPaidAmountEdited(false);
      }
      if (customEvent.detail?.paymentPlan) {
        if (customEvent.detail.paymentPlan === "FULL_PAYMENT") {
          setFlowMode("DIRECT_PURCHASE");
          setInstantPaymentPlan("FULL_PAYMENT");
        } else {
          setFlowMode("TALK_TO_SALES");
        }
        setPaidAmountEdited(false);
      }
    };
    window.addEventListener("knltc-select-course", handleCourseSelect);
    return () => {
      window.removeEventListener("knltc-select-course", handleCourseSelect);
    };
  }, []);

  const handleApplyPromoCode = () => {
    const cleanCode = promoInput.trim().toUpperCase();
    if (!cleanCode) return;

    const availableCodes =
      cmsConfig.promoCodes ||
      DEFAULT_WEBSITE_CMS.languageCoursePage.promoCodes ||
      [];
    const todayIso = new Date().toISOString().slice(0, 10);

    const matched = availableCodes.find((p) => {
      if (!p.isActive) return false;
      if (p.code.trim().toUpperCase() !== cleanCode) return false;
      if (p.expiresAt && p.expiresAt < todayIso) return false;
      return true;
    });

    if (!matched) {
      setAppliedPromo(null);
      setPromoFeedback({ type: "error", text: t.promoInvalid });
      return;
    }

    setAppliedPromo(matched);
    setPaidAmountEdited(false);
    setPromoFeedback({
      type: "success",
      text: `${t.promoAppliedMsg} (${matched.code}: -${
        matched.discountType === "PERCENT"
          ? `${matched.discountValue}%`
          : formatBdt(matched.discountValue)
      })`,
    });
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoInput("");
    setPromoFeedback(null);
    setPaidAmountEdited(false);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    const cleanWa = whatsapp.trim() || cleanPhone;
    const cleanSender = senderNumber.trim() || cleanPhone;
    const cleanTrxId = trxId.trim().toUpperCase();
    const cleanNote = studentNote.trim();

    if (!cleanName) {
      setFormError(t.errorName);
      return;
    }

    if (!cleanPhone || cleanPhone.replace(/\D/g, "").length < 10) {
      setFormError(t.errorPhone);
      return;
    }

    if (flowMode === "DIRECT_PURCHASE") {
      if (!cleanSender || cleanSender.replace(/\D/g, "").length < 10) {
        setFormError(t.errorSender);
        return;
      }
      if (!cleanTrxId || cleanTrxId.length < 5) {
        setFormError(t.errorTrxId);
        return;
      }
    }

    setIsSubmitting(true);

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const referenceId = `KNLTC-2026-${randomNum}`;
    const courseLabel = `${currentCourseObj.name} (${currentCourseObj.duration})`;

    const classModeLabel =
      classMode === "ONLINE_LIVE"
        ? t.modeOnline
        : classMode === "OFFLINE_PALTAN"
          ? t.modePaltan
          : t.modeKhulna;

    const purposeLabel =
      purpose === "STUDENT_VISA"
        ? t.purposeStudent
        : purpose === "SSW_JOB"
          ? t.purposeSSW
          : purpose === "TITP_INTERN"
            ? t.purposeTITP
            : t.purposeCareer;

    const isDirect = flowMode === "DIRECT_PURCHASE";
    const resolvedPaymentPlan: PaymentPlanOption = isDirect
      ? instantPaymentPlan
      : "INSTALLMENT_50";
    const resolvedPaymentMethod: PaymentMethodOption = isDirect
      ? "BKASH_BANGLA_QR"
      : "PAY_AT_OFFICE";

    const finalPaidAmount = isDirect
      ? Math.max(0, Number(paidAmountInput) || recommendedPayableToday)
      : 0;
    const finalDueAmount = Math.max(0, netCourseFeeBdt - finalPaidAmount);
    const totalDiscountBdt = fullPayDiscountBdt + promoDiscountBdt;

    recordPublicCourseEnrollment({
      referenceId,
      applicantName: cleanName,
      phone: cleanPhone,
      whatsapp: cleanWa,
      courseId: course,
      courseLabel,
      deliveryMode: classMode,
      classModeLabel,
      visaCategory: purpose,
      purposeLabel,
      baseFeeBdt,
      discountBdt: totalDiscountBdt,
      netCourseFeeBdt,
      paidAmountBdt: finalPaidAmount,
      dueAmountBdt: finalDueAmount,
      paymentPlan: resolvedPaymentPlan,
      paymentMethod: resolvedPaymentMethod,
      senderNumber: isDirect ? cleanSender : undefined,
      trxId: isDirect ? cleanTrxId : "SALES-TEAM-PAY-LATER",
      promoCode: isDirect ? appliedPromo?.code : undefined,
    });

    fetch("/api/enroll", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        applicantName: cleanName,
        phone: cleanPhone,
        whatsapp: cleanWa,
        branchId:
          classMode === "OFFLINE_KHULNA" ? "branch-khulna" : "branch-dhaka-hq",
        courseId: course,
        deliveryMode: classMode,
        visaCategory: purpose,
        referenceId,
        paymentPlan: resolvedPaymentPlan,
        paymentMethod: resolvedPaymentMethod,
        baseFeeBdt,
        discountBdt: totalDiscountBdt,
        netCourseFeeBdt,
        paidAmountBdt: finalPaidAmount,
        dueAmountBdt: finalDueAmount,
        senderNumber: isDirect ? cleanSender : "",
        trxId: isDirect ? cleanTrxId : "SALES-TEAM-PAY-LATER",
        promoCode: isDirect ? appliedPromo?.code || "" : "",
        notes: `${courseLabel} | ${classModeLabel} | ${purposeLabel} | Mode: ${
          isDirect
            ? `INSTANT_ENROLL_${resolvedPaymentPlan}`
            : "DISCUSS_AND_PAY_LATER"
        }${cleanNote ? ` | Note: ${cleanNote}` : ""} | Paid: ৳${finalPaidAmount} | Due: ৳${finalDueAmount} | TrxID: ${
          isDirect ? cleanTrxId : "PAY_LATER"
        }`,
      }),
    }).catch(() => {
      // Non-blocking sync
    });

    setTimeout(() => {
      const receiptPayload: SubmittedReceiptData = {
        id: referenceId,
        submittedAt: new Date().toLocaleString(
          language === "bn" ? "bn-BD" : "en-US",
          {
            dateStyle: "medium",
            timeStyle: "short",
          },
        ),
        flowMode,
        name: cleanName,
        phone: cleanPhone,
        whatsapp: cleanWa,
        courseId: course,
        courseLabel,
        classMode,
        classModeLabel,
        purpose,
        purposeLabel,
        paymentPlan: resolvedPaymentPlan,
        paymentMethod: resolvedPaymentMethod,
        baseFeeBdt,
        fullPayDiscountBdt,
        promoCode: isDirect ? appliedPromo?.code : undefined,
        promoDiscountBdt,
        netCourseFeeBdt,
        paidAmountBdt: finalPaidAmount,
        dueAmountBdt: finalDueAmount,
        senderNumber: isDirect ? cleanSender : "Pay Later",
        trxId: isDirect ? cleanTrxId : "PAY-LATER",
        studentNote: cleanNote || undefined,
      };

      setSubmittedReceipt(receiptPayload);

      try {
        trackLead();
      } catch {
        // Safe fallback
      }

      setIsSubmitting(false);

      const el = document.getElementById("enrollment-form");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 300);
  };

  const handleCopyId = () => {
    if (submittedReceipt?.id) {
      navigator.clipboard.writeText(submittedReceipt.id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2500);
    }
  };

  const handleCopyMerchant = () => {
    navigator.clipboard.writeText(merchantNumber.replace(/[^0-9]/g, ""));
    setCopiedMerchant(true);
    setTimeout(() => setCopiedMerchant(false), 2000);
  };

  const buildWhatsAppExpediteLink = () => {
    if (!submittedReceipt) return "https://wa.me/8801805013633";
    const r = submittedReceipt;
    if (r.flowMode === "TALK_TO_SALES") {
      const salesMsg =
        language === "bn"
          ? `আসসালামু আলাইকুম KNLTC টিম,\nআমি জাপানি ভাষা কোর্সে ভর্তির আবেদন করেছি এবং পেমেন্টের ব্যাপারে আলোচনা করতে চাই।\n\n• নাম: ${r.name}\n• মোবাইল: ${r.phone}\n• রেফারেন্স আইডি: ${r.id}\n• কোর্স: ${r.courseLabel}\n• ক্লাস মোড: ${r.classModeLabel}\n• উদ্দেশ্য: ${r.purposeLabel}${r.studentNote ? `\n• নোট: ${r.studentNote}` : ""}`
          : `Hello KNLTC Team,\nI have submitted my course application and would like to discuss payment options:\n\n• Name: ${r.name}\n• Phone: ${r.phone}\n• Ref ID: ${r.id}\n• Course: ${r.courseLabel}\n• Class Mode: ${r.classModeLabel}\n• Purpose: ${r.purposeLabel}${r.studentNote ? `\n• Note: ${r.studentNote}` : ""}`;
      return `https://wa.me/8801805013633?text=${encodeURIComponent(salesMsg)}`;
    }

    const planText =
      r.paymentPlan === "FULL_PAYMENT"
        ? language === "bn"
          ? "ফুল পেমেন্ট (২০% ছাড়)"
          : "Full Payment (20% OFF)"
        : language === "bn"
          ? "ইন্সটলমেন্ট পেমেন্ট (৫০% কিস্তি)"
          : "50% Installment Plan";

    const directMsg =
      language === "bn"
        ? `আসসালামু আলাইকুম KNLTC এডমিশন টিম,\nআমি "${r.courseLabel}" কোর্সে এনরোলমেন্ট ও পেমেন্ট সম্পন্ন করেছি।\n\n• নাম: ${r.name}\n• মোবাইল: ${r.phone}\n• রেফারেন্স আইডি: ${r.id}\n• পেমেন্ট প্ল্যান: ${planText}\n• পরিশোধিত টাকা: ৳${r.paidAmountBdt}${r.dueAmountBdt > 0 ? `\n• বকেয়া (পরবর্তী কিস্তি): ৳${r.dueAmountBdt}` : ""}\n• বিকাশ নাম্বার: ${r.senderNumber}\n• TrxID: ${r.trxId}`
        : `Hello KNLTC Admissions,\nI have completed my enrollment for "${r.courseLabel}":\n\n• Name: ${r.name}\n• Phone: ${r.phone}\n• Ref ID: ${r.id}\n• Plan: ${planText}\n• Paid Now: ৳${r.paidAmountBdt}${r.dueAmountBdt > 0 ? `\n• Remaining Due: ৳${r.dueAmountBdt}` : ""}\n• Sender: ${r.senderNumber}\n• TrxID: ${r.trxId}`;
    return `https://wa.me/8801805013633?text=${encodeURIComponent(directMsg)}`;
  };

  return (
    <section
      id="enrollment-form"
      className={`${
        isStandalonePage ? "py-8 md:py-14" : "py-14 md:py-20"
      } bg-[#fcfaf7] border-b border-stone-200 scroll-mt-16`}
    >
      <div className="container-narrow max-w-4xl">
        {/* Standalone Campaign Navigation & Course Switcher Bar */}
        {isStandalonePage && (
          <div className="mb-6 space-y-4">
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-stone-200/80">
              <Link
                href="/japanese-language"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-950 transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>
                  {language === "bn"
                    ? "সকল জাপানি ভাষা কোর্সে ফিরে যান"
                    : language === "ja"
                      ? "コース一覧に戻る"
                      : "Back to All Courses"}
                </span>
              </Link>
              <span className="text-[11px] font-semibold text-slate-500">
                KNLTC Official Portal
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {t.courses.map((c) => {
                const slug = courseOptionToSlug(c.id);
                const active = course === c.id;
                return (
                  <Link
                    key={c.id}
                    href={`/japanese-language/enroll/${slug}`}
                    onClick={() => {
                      setCourse(c.id);
                      setPaidAmountEdited(false);
                    }}
                    className={`rounded-xl border px-3 py-2 text-left transition-all ${
                      active
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-stone-200 bg-white text-slate-700 hover:border-stone-300"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold truncate">
                        {c.name}
                      </span>
                      {active && (
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                      )}
                    </div>
                    <p
                      className={`text-[10px] mt-0.5 truncate ${
                        active ? "text-stone-300" : "text-slate-500"
                      }`}
                    >
                      {formatBdt(c.baseFee)}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Minimal Clean Header */}
        <div className="mb-6 text-center sm:text-left">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#b91c1c]">
            {t.kicker}
          </span>
          <h2 className="mt-1 text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight">
            {isStandalonePage ? currentCourseObj.name : t.title}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {submittedReceipt ? (
            /* =====================================================================
               COMPACT DIGITAL CONFIRMATION / RECEIPT VIEW
               ===================================================================== */
            <motion.div
              key="receipt-view"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="max-w-2xl mx-auto"
            >
              <div className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-7 shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-xl bg-emerald-50 text-[#1E5631] flex items-center justify-center shrink-0">
                      <CheckCircle2 className="h-6 w-6 stroke-[2.2]" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#1E5631] block">
                        {submittedReceipt.flowMode === "DIRECT_PURCHASE"
                          ? t.receipt.receiptHeaderDirect
                          : t.receipt.receiptHeaderSales}
                      </span>
                      <h3 className="text-lg font-extrabold text-slate-900">
                        {t.receipt.congratsTitle}, {submittedReceipt.name}!
                      </h3>
                      <p className="text-xs text-slate-600">
                        {submittedReceipt.flowMode === "DIRECT_PURCHASE"
                          ? t.receipt.congratsSubDirect
                          : t.receipt.congratsSubSales}
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-[11px] font-bold text-[#1E5631] self-start sm:self-auto">
                    <Receipt className="h-3.5 w-3.5" />
                    <span>
                      {submittedReceipt.flowMode === "DIRECT_PURCHASE"
                        ? t.receipt.statusBadgeQr
                        : t.receipt.statusBadgeSales}
                    </span>
                  </span>
                </div>

                {/* Ref ID & Status Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-xl border border-stone-200 bg-[#fcfaf7] px-3.5 py-2.5 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-semibold text-slate-500 block">
                        {t.receipt.refLabel}
                      </span>
                      <span className="text-sm font-black text-slate-900 font-mono">
                        {submittedReceipt.id}
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleCopyId}
                      className="h-7 rounded-lg text-[11px] font-semibold gap-1 cursor-pointer"
                    >
                      <Copy className="h-3 w-3" />
                      <span>{copiedId ? "Copied" : "Copy"}</span>
                    </Button>
                  </div>

                  {submittedReceipt.flowMode === "DIRECT_PURCHASE" ? (
                    <div className="rounded-xl border border-red-200 bg-red-50/40 px-3.5 py-2.5 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-semibold text-[#b91c1c] block">
                          {t.receipt.trxLabel}
                        </span>
                        <span className="text-sm font-black text-[#b91c1c] font-mono">
                          {submittedReceipt.trxId}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-slate-800 bg-white border border-stone-200 px-2 py-0.5 rounded-md tabular-nums">
                        {formatBdt(submittedReceipt.paidAmountBdt)}
                      </span>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 px-3.5 py-2.5 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-semibold text-[#1E5631] block">
                          {t.receipt.paymentStatusLabel}
                        </span>
                        <span className="text-xs font-bold text-slate-900">
                          {t.receipt.payLaterStatusValue}
                        </span>
                      </div>
                      <Headphones className="h-4 w-4 text-[#1E5631] shrink-0" />
                    </div>
                  )}
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="rounded-xl border border-stone-200/90 bg-[#fcfaf7] p-4 space-y-2">
                    <h4 className="font-bold text-slate-900 text-[11px] uppercase tracking-wider border-b border-stone-200 pb-1.5">
                      {t.receipt.studentInfoTitle}
                    </h4>
                    <div className="flex justify-between gap-2">
                      <span className="text-slate-500">{t.receipt.nameLabel}</span>
                      <span className="font-bold text-slate-900 text-right">
                        {submittedReceipt.name}
                      </span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-slate-500">{t.receipt.phoneLabel}</span>
                      <span className="font-mono font-bold text-slate-900 text-right">
                        {submittedReceipt.phone}
                      </span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-slate-500">{t.receipt.courseLabel}</span>
                      <span className="font-bold text-[#1E5631] text-right">
                        {submittedReceipt.courseLabel}
                      </span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-slate-500">{t.receipt.modeLabel}</span>
                      <span className="font-semibold text-slate-900 text-right">
                        {submittedReceipt.classModeLabel}
                      </span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-slate-500">{t.receipt.purposeLabel}</span>
                      <span className="font-semibold text-slate-800 text-right">
                        {submittedReceipt.purposeLabel}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-stone-200/90 bg-[#fcfaf7] p-4 space-y-2">
                    <h4 className="font-bold text-slate-900 text-[11px] uppercase tracking-wider border-b border-stone-200 pb-1.5">
                      {t.receipt.paymentInfoTitle}
                    </h4>
                    <div className="flex justify-between">
                      <span className="text-slate-500">{t.baseFeeText}:</span>
                      <span className="font-semibold text-slate-700 tabular-nums">
                        {formatBdt(submittedReceipt.baseFeeBdt)}
                      </span>
                    </div>
                    {submittedReceipt.fullPayDiscountBdt > 0 && (
                      <div className="flex justify-between text-[#1E5631]">
                        <span>{t.fullDiscountText}:</span>
                        <span className="font-bold tabular-nums">
                          -{formatBdt(submittedReceipt.fullPayDiscountBdt)}
                        </span>
                      </div>
                    )}
                    {submittedReceipt.promoDiscountBdt > 0 && (
                      <div className="flex justify-between text-[#b91c1c]">
                        <span>
                          {t.promoDiscountText} ({submittedReceipt.promoCode}):
                        </span>
                        <span className="font-bold tabular-nums">
                          -{formatBdt(submittedReceipt.promoDiscountBdt)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between pt-1.5 border-t border-stone-200 font-bold text-slate-900">
                      <span>{t.netCourseFeeText}:</span>
                      <span className="tabular-nums">
                        {formatBdt(submittedReceipt.netCourseFeeBdt)}
                      </span>
                    </div>
                    {submittedReceipt.flowMode === "DIRECT_PURCHASE" ? (
                      <>
                        <div className="flex justify-between text-slate-600">
                          <span>{t.receipt.planLabel}</span>
                          <span className="font-bold text-slate-900">
                            {submittedReceipt.paymentPlan === "FULL_PAYMENT"
                              ? t.receipt.planFullValue
                              : t.receipt.planInstValue}
                          </span>
                        </div>
                        <div className="flex justify-between font-black text-[#1E5631]">
                          <span>{t.receipt.paidNowLabel}</span>
                          <span className="tabular-nums">
                            {formatBdt(submittedReceipt.paidAmountBdt)}
                          </span>
                        </div>
                        {submittedReceipt.dueAmountBdt > 0 && (
                          <div className="flex justify-between font-bold text-amber-700">
                            <span>{t.receipt.dueLabel}</span>
                            <span className="tabular-nums">
                              {formatBdt(submittedReceipt.dueAmountBdt)}
                            </span>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="pt-1 text-[11px] font-bold text-[#1E5631]">
                        {t.receipt.payLaterStatusValue}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="rounded-xl bg-emerald-50/80 border border-emerald-200 p-4 space-y-3">
                  <div>
                    <h4 className="text-xs sm:text-sm font-extrabold text-[#1E5631]">
                      {submittedReceipt.flowMode === "DIRECT_PURCHASE"
                        ? t.receipt.nextStepsTitleDirect
                        : t.receipt.nextStepsTitleSales}
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {submittedReceipt.flowMode === "DIRECT_PURCHASE"
                        ? t.receipt.nextStepsDescDirect
                        : t.receipt.nextStepsDescSales}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <Button
                      asChild
                      className="flex-1 bg-[#1E5631] hover:bg-emerald-900 text-white font-bold text-xs py-5 rounded-xl cursor-pointer"
                    >
                      <a
                        href={buildWhatsAppExpediteLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span>
                          {submittedReceipt.flowMode === "DIRECT_PURCHASE"
                            ? t.receipt.btnWhatsappDirect
                            : t.receipt.btnWhatsappSales}
                        </span>
                      </a>
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => window.print()}
                      className="border-stone-300 bg-white hover:bg-stone-50 text-slate-800 font-bold text-xs py-5 px-4 rounded-xl cursor-pointer"
                    >
                      <Printer className="mr-1.5 h-3.5 w-3.5 text-slate-600" />
                      <span>{t.receipt.btnPrint}</span>
                    </Button>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedReceipt(null);
                      setTrxId("");
                    }}
                    className="inline-flex items-center gap-1 font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>{t.receipt.btnNewApp}</span>
                  </button>

                  <a
                    href={lmsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-[#b91c1c] hover:underline"
                  >
                    <GraduationCap className="h-3.5 w-3.5" />
                    <span>{t.receipt.btnLms}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </motion.div>
          ) : (
            /* =====================================================================
               MINIMAL & AESTHETIC 2-MODE ENROLLMENT CARD
               ===================================================================== */
            <motion.div
              key="admission-form-view"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="rounded-2xl border border-stone-200/90 bg-white shadow-xs overflow-hidden"
            >
              {/* SLEEK SEGMENTED TAB SWITCHER */}
              <div className="bg-stone-100/80 p-1.5 border-b border-stone-200/80">
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setFlowMode("TALK_TO_SALES");
                      setFormError(null);
                    }}
                    className={`flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      flowMode === "TALK_TO_SALES"
                        ? "bg-white text-[#1E5631] shadow-xs ring-1 ring-stone-200/80"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Headphones className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{t.tabSales}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFlowMode("DIRECT_PURCHASE");
                      setFormError(null);
                      setPaidAmountEdited(false);
                    }}
                    className={`flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      flowMode === "DIRECT_PURCHASE"
                        ? "bg-white text-[#b91c1c] shadow-xs ring-1 ring-stone-200/80"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Sparkles className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{t.tabDirect}</span>
                  </button>
                </div>
              </div>

              {/* MAIN 2-COLUMN BODY */}
              <div className="p-5 sm:p-7 grid gap-7 lg:grid-cols-12 items-start">
                {/* LEFT COLUMN (7 Cols): Clean Student Form */}
                <div className="lg:col-span-7">
                  {formError && (
                    <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs text-red-700 font-medium">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{formError}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* MOBILE-ONLY COMPACT COURSE SUMMARY STRIP FOR "APPLY NOW" MODE */}
                    {flowMode === "TALK_TO_SALES" && (
                      <div className="lg:hidden rounded-xl border border-stone-200/90 bg-[#fcfaf7] px-3.5 py-2.5 flex items-center justify-between gap-2 text-xs">
                        <div className="min-w-0">
                          <span className="font-extrabold text-slate-900 block truncate">
                            {currentCourseObj.name}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {currentCourseObj.duration} • {formatBdt(baseFeeBdt)}
                          </span>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[10px] font-semibold text-slate-500 block">
                            {language === "bn"
                              ? "এখন পরিশোধযোগ্য"
                              : language === "ja"
                                ? "本日のお支払い"
                                : "Payable Now"}
                          </span>
                          <span className="text-sm font-black text-[#1E5631]">
                            {language === "bn" ? "৳০" : "৳0"}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* 1. Full Name */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {t.labelName}
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                          <User className="h-4 w-4" />
                        </div>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder={t.placeholderName}
                          className="w-full rounded-xl border border-stone-200 bg-[#fcfaf7]/60 py-2.5 pl-9 pr-3 text-sm text-slate-900 focus:bg-white focus:border-slate-900 focus:outline-none transition"
                        />
                      </div>
                    </div>

                    {/* 2. Separate Mobile & WhatsApp Inputs (Short Clean Labels) */}
                    <div className="grid gap-3.5 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          {t.labelPhone}
                        </label>
                        <div className="relative">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                            <Phone className="h-3.5 w-3.5" />
                          </div>
                          <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => {
                              setPhone(e.target.value);
                              if (!whatsapp) setWhatsapp(e.target.value);
                              if (!senderNumber) setSenderNumber(e.target.value);
                            }}
                            placeholder={t.placeholderPhone}
                            className="w-full rounded-xl border border-stone-200 bg-[#fcfaf7]/60 py-2.5 pl-9 pr-3 text-sm text-slate-900 focus:bg-white focus:border-slate-900 focus:outline-none transition"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          {t.labelWhatsapp}
                        </label>
                        <div className="relative">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#15803d]">
                            <MessageCircle className="h-3.5 w-3.5" />
                          </div>
                          <input
                            type="tel"
                            required
                            value={whatsapp}
                            onChange={(e) => setWhatsapp(e.target.value)}
                            placeholder={t.placeholderWhatsapp}
                            className="w-full rounded-xl border border-stone-200 bg-[#fcfaf7]/60 py-2.5 pl-9 pr-3 text-sm text-slate-900 focus:bg-white focus:border-slate-900 focus:outline-none transition"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 3. Course Selection (Short Crisp Dropdown Options) */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {t.labelCourse}
                      </label>
                      <select
                        value={course}
                        onChange={(e) => {
                          setCourse(e.target.value as CourseOption);
                          setPaidAmountEdited(false);
                        }}
                        className="w-full rounded-xl border border-stone-200 bg-[#fcfaf7]/60 px-3 py-2.5 text-sm font-semibold text-slate-900 focus:bg-white focus:border-slate-900 focus:outline-none transition cursor-pointer"
                      >
                        {t.courses.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* 4. Class Mode & Purpose (Short Labels & Options, No Zoom Mention) */}
                    <div className="grid gap-3.5 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          {t.labelClassMode}
                        </label>
                        <select
                          value={classMode}
                          onChange={(e) =>
                            setClassMode(e.target.value as ClassModeOption)
                          }
                          className="w-full rounded-xl border border-stone-200 bg-[#fcfaf7]/60 px-3 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-slate-900 focus:outline-none cursor-pointer"
                        >
                          <option value="ONLINE_LIVE">{t.modeOnline}</option>
                          <option value="OFFLINE_PALTAN">{t.modePaltan}</option>
                          <option value="OFFLINE_KHULNA">{t.modeKhulna}</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          {t.labelPurpose}
                        </label>
                        <select
                          value={purpose}
                          onChange={(e) =>
                            setPurpose(e.target.value as VisaPurposeOption)
                          }
                          className="w-full rounded-xl border border-stone-200 bg-[#fcfaf7]/60 px-3 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-slate-900 focus:outline-none cursor-pointer"
                        >
                          <option value="STUDENT_VISA">{t.purposeStudent}</option>
                          <option value="SSW_JOB">{t.purposeSSW}</option>
                          <option value="TITP_INTERN">{t.purposeTITP}</option>
                          <option value="CAREER_SKILLS">{t.purposeCareer}</option>
                        </select>
                      </div>
                    </div>

                    {/* CONDITIONAL SECTION */}
                    {flowMode === "TALK_TO_SALES" ? (
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          {t.labelNote}
                        </label>
                        <input
                          type="text"
                          value={studentNote}
                          onChange={(e) => setStudentNote(e.target.value)}
                          placeholder={t.placeholderNote}
                          className="w-full rounded-xl border border-stone-200 bg-[#fcfaf7]/60 px-3 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-slate-900 focus:outline-none transition"
                        />
                      </div>
                    ) : (
                      /* "এখনই এনরোল করুন" (Instant Enrollment): Payment Plan Selector + Mobile QR/Fee Preview + bKash Inputs */
                      <div className="pt-2 border-t border-stone-100 space-y-3.5">
                        {/* Payment Plan Selector: Full Payment (20% OFF) vs Installment (50% Now) */}
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            {t.labelPaymentPlan}
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <button
                              type="button"
                              onClick={() => {
                                setInstantPaymentPlan("FULL_PAYMENT");
                                setPaidAmountEdited(false);
                              }}
                              className={`rounded-xl border p-3 text-left transition-all cursor-pointer ${
                                instantPaymentPlan === "FULL_PAYMENT"
                                  ? "border-[#1E5631] bg-emerald-50/40 ring-1 ring-[#1E5631]/30"
                                  : "border-stone-200 bg-[#fcfaf7]/60 hover:bg-white hover:border-stone-300"
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-bold text-slate-900">
                                  {t.planFullTitle}
                                </span>
                                <span
                                  className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ${
                                    instantPaymentPlan === "FULL_PAYMENT"
                                      ? "border-[#1E5631] bg-[#1E5631] text-white"
                                      : "border-stone-300 bg-white"
                                  }`}
                                >
                                  {instantPaymentPlan === "FULL_PAYMENT" && (
                                    <Check className="h-2.5 w-2.5 stroke-[3]" />
                                  )}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 mt-0.5">
                                {t.planFullSub}
                              </p>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setInstantPaymentPlan("INSTALLMENT_50");
                                setPaidAmountEdited(false);
                              }}
                              className={`rounded-xl border p-3 text-left transition-all cursor-pointer ${
                                instantPaymentPlan === "INSTALLMENT_50"
                                  ? "border-slate-900 bg-stone-100/70 ring-1 ring-slate-900/20"
                                  : "border-stone-200 bg-[#fcfaf7]/60 hover:bg-white hover:border-stone-300"
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-bold text-slate-900">
                                  {t.planInstallmentTitle}
                                </span>
                                <span
                                  className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ${
                                    instantPaymentPlan === "INSTALLMENT_50"
                                      ? "border-slate-900 bg-slate-900 text-white"
                                      : "border-stone-300 bg-white"
                                  }`}
                                >
                                  {instantPaymentPlan === "INSTALLMENT_50" && (
                                    <Check className="h-2.5 w-2.5 stroke-[3]" />
                                  )}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 mt-0.5">
                                {t.planInstallmentSub}
                              </p>
                            </button>
                          </div>
                        </div>

                        {/* Collapsible "Have a promo code?" Link (Placed right under Payment Plan so user applies code before paying) */}
                        <div>
                          {!showPromoInput && !appliedPromo ? (
                            <button
                              type="button"
                              onClick={() => setShowPromoInput(true)}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-[#b91c1c] transition cursor-pointer"
                            >
                              <Tag className="h-3 w-3" />
                              <span className="underline underline-offset-2">
                                {t.promoToggle}
                              </span>
                            </button>
                          ) : (
                            <div className="flex flex-wrap items-center gap-2 pt-0.5">
                              <input
                                type="text"
                                value={promoInput}
                                onChange={(e) =>
                                  setPromoInput(e.target.value.toUpperCase())
                                }
                                placeholder={t.promoPlaceholder}
                                className="w-40 sm:w-48 rounded-lg border border-stone-200 bg-[#fcfaf7] px-2.5 py-1.5 text-xs font-mono font-bold uppercase text-slate-900 focus:bg-white focus:border-slate-900 focus:outline-none"
                              />
                              {appliedPromo ? (
                                <button
                                  type="button"
                                  onClick={handleRemovePromo}
                                  className="rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 cursor-pointer"
                                >
                                  {t.promoRemoveBtn}
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={handleApplyPromoCode}
                                  className="rounded-lg bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 text-xs font-semibold cursor-pointer"
                                >
                                  {t.promoApplyBtn}
                                </button>
                              )}
                              {!appliedPromo && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setShowPromoInput(false);
                                    setPromoFeedback(null);
                                  }}
                                  className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                                >
                                  <X className="h-3.5 w-3.5" />
                                </button>
                              )}
                              {promoFeedback && (
                                <span
                                  className={`text-[11px] font-semibold ${
                                    promoFeedback.type === "success"
                                      ? "text-[#1E5631]"
                                      : "text-red-600"
                                  }`}
                                >
                                  {promoFeedback.text}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* MOBILE-ONLY FEE BREAKDOWN + BKASH MERCHANT & BANGLA QR BOX (Shown BEFORE TrxID & Submit on Mobile!) */}
                        <div className="lg:hidden rounded-2xl border border-stone-200/90 bg-[#fcfaf7] p-4 space-y-3">
                          <div className="space-y-1.5 text-xs">
                            <div className="flex items-center justify-between pb-1.5 border-b border-stone-200/80">
                              <span className="font-bold text-slate-900">
                                {currentCourseObj.name}
                              </span>
                              <span className="rounded-md bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-[#1E5631]">
                                {instantPaymentPlan === "FULL_PAYMENT"
                                  ? `${fullDiscountPercent}% OFF`
                                  : "50% + 50%"}
                              </span>
                            </div>

                            <div className="flex justify-between text-slate-600">
                              <span>{t.baseFeeText}</span>
                              <span
                                className={`font-semibold text-slate-800 tabular-nums ${
                                  fullPayDiscountBdt > 0 ? "line-through" : ""
                                }`}
                              >
                                {formatBdt(baseFeeBdt)}
                              </span>
                            </div>

                            {fullPayDiscountBdt > 0 && (
                              <div className="flex justify-between text-[#1E5631] font-semibold">
                                <span>{t.fullDiscountText}</span>
                                <span className="tabular-nums">
                                  -{formatBdt(fullPayDiscountBdt)}
                                </span>
                              </div>
                            )}

                            {promoDiscountBdt > 0 && (
                              <div className="flex justify-between text-[#b91c1c] font-semibold">
                                <span>
                                  {t.promoDiscountText} ({appliedPromo?.code})
                                </span>
                                <span className="tabular-nums">
                                  -{formatBdt(promoDiscountBdt)}
                                </span>
                              </div>
                            )}

                            <div className="rounded-xl bg-white border border-stone-200 px-3 py-2 flex items-center justify-between mt-1">
                              <span className="text-xs font-bold text-slate-800">
                                {instantPaymentPlan === "FULL_PAYMENT"
                                  ? t.payableTodayFullText
                                  : t.payableTodayInstText}
                              </span>
                              <span className="text-base font-black text-[#1E5631] tabular-nums">
                                {formatBdt(
                                  paidAmountEdited && paidAmountInput > 0
                                    ? paidAmountInput
                                    : recommendedPayableToday,
                                )}
                              </span>
                            </div>

                            {instantPaymentPlan === "INSTALLMENT_50" &&
                              estimatedRemainingDue > 0 && (
                                <div className="flex justify-between text-[11px] font-semibold text-slate-500 px-1">
                                  <span>{t.dueLaterText}</span>
                                  <span className="tabular-nums">
                                    {formatBdt(estimatedRemainingDue)}
                                  </span>
                                </div>
                              )}
                          </div>

                          {/* Compact Mobile QR + Merchant Row */}
                          <div className="rounded-xl border border-stone-200 bg-white p-3 flex items-center gap-3">
                            <div
                              onClick={() => setQrZoomOpen(true)}
                              className="h-20 w-20 shrink-0 rounded-lg border border-stone-200 bg-[#fcfaf7] p-1.5 flex items-center justify-center cursor-pointer hover:border-[#e2136e] transition"
                            >
                              {Boolean(banglaQrUrl) && !qrImgFailed ? (
                                <img
                                  key={banglaQrUrl}
                                  src={banglaQrUrl}
                                  alt="KNLTC Official bKash Bangla QR"
                                  onError={() => setQrImgFailed(true)}
                                  className="h-full w-full object-contain rounded-xs"
                                />
                              ) : (
                                <QrCode className="h-11 w-11 text-slate-900 stroke-[1.5]" />
                              )}
                            </div>

                            <div className="flex-1 min-w-0 space-y-1.5">
                              <div className="flex items-center justify-between gap-1">
                                <span className="rounded-sm bg-[#e2136e] text-white px-1.5 py-0.5 text-[9px] font-bold">
                                  {t.qrBoxBadge}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setQrZoomOpen(true)}
                                  className="inline-flex items-center gap-1 text-[10px] font-bold text-[#e2136e] hover:underline cursor-pointer"
                                >
                                  <Maximize2 className="h-2.5 w-2.5" />
                                  <span>{t.qrEnlargeBtn}</span>
                                </button>
                              </div>

                              <div className="rounded-lg bg-stone-50 border border-stone-200/80 px-2.5 py-1.5 flex items-center justify-between gap-2">
                                <div className="min-w-0">
                                  <span className="text-[9px] text-slate-500 block">
                                    {t.qrMerchantLabel}
                                  </span>
                                  <span className="text-xs font-black font-mono text-slate-900 truncate block">
                                    {merchantNumber}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={handleCopyMerchant}
                                  className="inline-flex items-center gap-1 rounded-md border border-stone-200 bg-white px-2 py-1 text-[10px] font-semibold text-slate-700 hover:bg-stone-100 shrink-0 cursor-pointer"
                                >
                                  {copiedMerchant ? (
                                    <Check className="h-3 w-3 text-[#1E5631]" />
                                  ) : (
                                    <Copy className="h-3 w-3" />
                                  )}
                                  <span>{copiedMerchant ? "Copied" : "Copy"}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* bKash Verification Fields (Now logically placed AFTER user sees Payable Amount & QR on Mobile!) */}
                        <div className="grid gap-3 sm:grid-cols-3">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              {t.senderLabel}
                            </label>
                            <input
                              type="tel"
                              required
                              value={senderNumber}
                              onChange={(e) => setSenderNumber(e.target.value)}
                              placeholder={t.senderPlaceholder}
                              className="w-full rounded-xl border border-stone-200 bg-[#fcfaf7]/60 px-3 py-2 text-xs sm:text-sm font-mono text-slate-900 focus:bg-white focus:border-slate-900 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              {t.paidAmountLabel}
                            </label>
                            <input
                              type="number"
                              required
                              min={500}
                              value={paidAmountInput}
                              onChange={(e) => {
                                setPaidAmountEdited(true);
                                setPaidAmountInput(Number(e.target.value));
                              }}
                              className="w-full rounded-xl border border-stone-200 bg-[#fcfaf7]/60 px-3 py-2 text-xs sm:text-sm font-mono font-bold text-[#1E5631] tabular-nums focus:bg-white focus:border-[#1E5631] focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-[#b91c1c] mb-1">
                              {t.trxIdLabel}
                            </label>
                            <input
                              type="text"
                              required
                              value={trxId}
                              onChange={(e) =>
                                setTrxId(
                                  e.target.value.toUpperCase().replace(/\s+/g, ""),
                                )
                              }
                              placeholder={t.trxIdPlaceholder}
                              className="w-full rounded-xl border border-red-200 bg-red-50/20 px-3 py-2 text-xs sm:text-sm font-mono font-bold uppercase text-slate-950 focus:bg-white focus:border-[#b91c1c] focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Submit Button (Always at the bottom of the form flow!) */}
                    <div className="pt-1">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full font-bold text-xs sm:text-sm py-5 rounded-xl shadow-xs transition-all cursor-pointer ${
                          flowMode === "DIRECT_PURCHASE"
                            ? "bg-[#b91c1c] hover:bg-red-800 text-white"
                            : "bg-[#1E5631] hover:bg-emerald-900 text-white"
                        }`}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            {flowMode === "DIRECT_PURCHASE"
                              ? t.submittingDirect
                              : t.submittingSales}
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            <Send className="h-3.5 w-3.5" />
                            <span>
                              {flowMode === "DIRECT_PURCHASE"
                                ? t.btnSubmitDirect
                                : t.btnSubmitSales}
                            </span>
                          </span>
                        )}
                      </Button>
                    </div>

                    {/* MOBILE-ONLY COMPACT HELP BAR BELOW SUBMIT IN "APPLY NOW" MODE */}
                    {flowMode === "TALK_TO_SALES" && (
                      <div className="lg:hidden pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                        <a
                          href={`https://wa.me/8801805013633?text=${encodeURIComponent(
                            `Assalamu Alaikum KNLTC Team, I want to discuss payment options for ${currentCourseObj.name}${name ? ` (Name: ${name})` : ""}.`,
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#fcfaf7] border border-stone-200 hover:border-[#1E5631] text-[#1E5631] px-3 py-2 text-xs font-bold whitespace-nowrap transition"
                        >
                          <MessageCircle className="h-3.5 w-3.5 shrink-0" />
                          <span>{t.salesWhatsappBtn}</span>
                        </a>
                        <a
                          href="tel:+8801805013633"
                          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#fcfaf7] border border-stone-200 hover:border-slate-400 text-slate-800 px-3 py-2 text-xs font-bold whitespace-nowrap transition"
                        >
                          <Phone className="h-3.5 w-3.5 text-[#b91c1c] shrink-0" />
                          <span>{t.salesCallBtn}</span>
                        </a>
                      </div>
                    )}

                    <p className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1">
                      <Lock className="h-3 w-3" />
                      <span>{t.securityNote}</span>
                    </p>
                  </form>
                </div>

                {/* RIGHT COLUMN (5 Cols — Desktop Only `hidden lg:block` so Mobile doesn't duplicate or show after Submit!): Minimal Contextual Summary Card */}
                <div className="hidden lg:block lg:col-span-5">
                  {flowMode === "TALK_TO_SALES" ? (
                    /* =========================================================
                       MINIMAL OPTION 1 PANEL: DISCUSS & PAY LATER INFO
                       ========================================================= */
                    <div className="rounded-2xl border border-stone-200/90 bg-[#fcfaf7] p-5 space-y-4">
                      <div className="flex items-center justify-between gap-2 pb-3 border-b border-stone-200/80">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#1E5631] block">
                            {t.salesCardBadge}
                          </span>
                          <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
                            {currentCourseObj.name}
                          </h3>
                          <p className="text-[11px] text-slate-500">
                            {currentCourseObj.duration}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-500 block">
                            {t.baseFeeText}
                          </span>
                          <span className="text-lg font-black text-slate-900 tabular-nums">
                            {formatBdt(baseFeeBdt)}
                          </span>
                        </div>
                      </div>

                      <div className="rounded-xl bg-emerald-50/80 border border-emerald-200/80 px-3.5 py-2.5 flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-700">
                          {language === "bn"
                            ? "এখন পরিশোধযোগ্য"
                            : language === "ja"
                              ? "本日のお支払い"
                              : "Payable Now"}
                        </span>
                        <span className="font-extrabold text-[#1E5631]">
                          {language === "bn"
                            ? "৳০"
                            : language === "ja"
                              ? "৳0"
                              : "৳0"}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {t.salesCardDesc}
                      </p>

                      {/* Direct Contact Buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <a
                          href={`https://wa.me/8801805013633?text=${encodeURIComponent(
                            `Assalamu Alaikum KNLTC Team, I want to discuss payment options for ${currentCourseObj.name}${name ? ` (Name: ${name})` : ""}.`,
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-white border border-stone-200 hover:border-[#1E5631] text-[#1E5631] px-3 py-2 text-xs font-bold whitespace-nowrap transition"
                        >
                          <MessageCircle className="h-3.5 w-3.5 shrink-0" />
                          <span>{t.salesWhatsappBtn}</span>
                        </a>
                        <a
                          href="tel:+8801805013633"
                          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-white border border-stone-200 hover:border-slate-400 text-slate-800 px-3 py-2 text-xs font-bold whitespace-nowrap transition"
                        >
                          <Phone className="h-3.5 w-3.5 text-[#b91c1c] shrink-0" />
                          <span>{t.salesCallBtn}</span>
                        </a>
                      </div>

                      <div className="pt-2 border-t border-stone-200/70 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            setFlowMode("DIRECT_PURCHASE");
                            setPaidAmountEdited(false);
                          }}
                          className="text-[11px] font-bold text-[#b91c1c] hover:underline cursor-pointer"
                        >
                          {t.switchToDirectBtn}
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* =========================================================
                       MINIMAL OPTION 2 PANEL: FEE SUMMARY (FULL vs 50% INST) + BANGLA QR
                       ========================================================= */
                    <div className="rounded-2xl border border-stone-200/90 bg-[#fcfaf7] p-5 space-y-4">
                      {/* Fee Breakdown */}
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between pb-2 border-b border-stone-200/80">
                          <div>
                            <span className="font-bold text-slate-900 block">
                              {currentCourseObj.name}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              {currentCourseObj.duration}
                            </span>
                          </div>
                          <span className="rounded-md bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-[#1E5631]">
                            {instantPaymentPlan === "FULL_PAYMENT"
                              ? `${fullDiscountPercent}% OFF`
                              : "50% + 50%"}
                          </span>
                        </div>

                        <div className="flex justify-between text-slate-600">
                          <span>{t.baseFeeText}</span>
                          <span
                            className={`font-semibold text-slate-800 tabular-nums ${
                              fullPayDiscountBdt > 0 ? "line-through" : ""
                            }`}
                          >
                            {formatBdt(baseFeeBdt)}
                          </span>
                        </div>

                        {fullPayDiscountBdt > 0 && (
                          <div className="flex justify-between text-[#1E5631] font-semibold">
                            <span>{t.fullDiscountText}</span>
                            <span className="tabular-nums">
                              -{formatBdt(fullPayDiscountBdt)}
                            </span>
                          </div>
                        )}

                        {promoDiscountBdt > 0 && (
                          <div className="flex justify-between text-[#b91c1c] font-semibold">
                            <span>
                              {t.promoDiscountText} ({appliedPromo?.code})
                            </span>
                            <span className="tabular-nums">
                              -{formatBdt(promoDiscountBdt)}
                            </span>
                          </div>
                        )}

                        <div className="flex justify-between pt-1.5 border-t border-stone-200/80 font-bold text-slate-900">
                          <span>{t.netCourseFeeText}</span>
                          <span className="tabular-nums">
                            {formatBdt(netCourseFeeBdt)}
                          </span>
                        </div>

                        <div className="rounded-xl bg-white border border-stone-200 px-3.5 py-2.5 flex items-center justify-between mt-1">
                          <span className="text-xs font-bold text-slate-800">
                            {instantPaymentPlan === "FULL_PAYMENT"
                              ? t.payableTodayFullText
                              : t.payableTodayInstText}
                          </span>
                          <span className="text-lg font-black text-[#1E5631] tabular-nums">
                            {formatBdt(
                              paidAmountEdited && paidAmountInput > 0
                                ? paidAmountInput
                                : recommendedPayableToday,
                            )}
                          </span>
                        </div>

                        {instantPaymentPlan === "INSTALLMENT_50" &&
                          estimatedRemainingDue > 0 && (
                            <div className="flex justify-between text-[11px] font-semibold text-slate-500 px-1">
                              <span>{t.dueLaterText}</span>
                              <span className="tabular-nums">
                                {formatBdt(estimatedRemainingDue)}
                              </span>
                            </div>
                          )}
                      </div>

                      {/* Compact Bangla QR & Merchant Number */}
                      <div className="rounded-xl border border-stone-200 bg-white p-3.5 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="rounded-md bg-[#e2136e] text-white px-2 py-0.5 text-[10px] font-bold">
                            {t.qrBoxBadge}
                          </span>
                          <button
                            type="button"
                            onClick={() => setQrZoomOpen(true)}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#e2136e] hover:underline cursor-pointer"
                          >
                            <Maximize2 className="h-3 w-3" />
                            <span>{t.qrEnlargeBtn}</span>
                          </button>
                        </div>

                        <div
                          onClick={() => setQrZoomOpen(true)}
                          className="mx-auto max-w-[170px] rounded-xl border border-stone-200 bg-[#fcfaf7] p-2.5 text-center cursor-pointer hover:border-[#e2136e] transition"
                        >
                          {Boolean(banglaQrUrl) && !qrImgFailed ? (
                            <img
                              key={banglaQrUrl}
                              src={banglaQrUrl}
                              alt="KNLTC Official bKash Bangla QR"
                              onError={() => setQrImgFailed(true)}
                              className="mx-auto h-36 w-36 object-contain rounded-md"
                            />
                          ) : (
                            <div className="mx-auto h-36 w-36 rounded-lg border border-dashed border-[#e2136e]/40 bg-white flex flex-col items-center justify-center p-2 space-y-1">
                              <QrCode className="h-16 w-16 text-slate-900 stroke-[1.5]" />
                              <span className="text-[10px] font-bold text-[#e2136e]">
                                KNLTC BANGLA QR
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="rounded-lg bg-stone-50 border border-stone-200/80 px-3 py-2 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-slate-500 block">
                              {t.qrMerchantLabel}
                            </span>
                            <span className="text-xs font-black font-mono text-slate-900">
                              {merchantNumber}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={handleCopyMerchant}
                            className="inline-flex items-center gap-1 rounded-md border border-stone-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-stone-100 cursor-pointer"
                          >
                            {copiedMerchant ? (
                              <Check className="h-3 w-3 text-[#1E5631]" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                            <span>{copiedMerchant ? "Copied" : "Copy"}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Enlarge Bangla QR Modal */}
      <AnimatePresence>
        {qrZoomOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setQrZoomOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4"
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl border border-stone-200 space-y-4"
            >
              <button
                type="button"
                onClick={() => setQrZoomOpen(false)}
                className="absolute top-3.5 right-3.5 rounded-full p-1.5 text-slate-400 hover:bg-stone-100 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              <div>
                <span className="rounded-md bg-[#e2136e] text-white px-2.5 py-0.5 text-[10px] font-bold uppercase">
                  {t.qrBoxBadge}
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mt-1">
                  KNLTC Japan Gateway
                </h3>
                <p className="text-xs font-mono font-bold text-slate-600">
                  Merchant: {merchantNumber}
                </p>
              </div>

              <div className="rounded-xl border border-stone-200 bg-[#fcfaf7] p-4">
                {Boolean(banglaQrUrl) && !qrImgFailed ? (
                  <img
                    key={banglaQrUrl}
                    src={banglaQrUrl}
                    alt="KNLTC Bangla QR Zoomed"
                    onError={() => setQrImgFailed(true)}
                    className="mx-auto h-60 w-60 object-contain"
                  />
                ) : (
                  <div className="mx-auto h-60 w-60 flex flex-col items-center justify-center space-y-2">
                    <QrCode className="h-32 w-32 text-slate-900 stroke-[1.5]" />
                    <span className="text-xs font-bold text-[#e2136e]">
                      Merchant: {merchantNumber}
                    </span>
                  </div>
                )}
              </div>

              <div className="rounded-xl bg-emerald-50 border border-emerald-200 py-2.5 px-3 text-xs font-bold text-[#1E5631]">
                {instantPaymentPlan === "FULL_PAYMENT"
                  ? t.payableTodayFullText
                  : t.payableTodayInstText}
                : {formatBdt(recommendedPayableToday)}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
