"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  AlertCircle,
  ArrowLeft,
  Award,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  CreditCard,
  ExternalLink,
  GraduationCap,
  Loader2,
  Lock,
  Maximize2,
  MessageCircle,
  Percent,
  Phone,
  Printer,
  QrCode,
  Receipt,
  Send,
  ShieldCheck,
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
        kicker: "Direct Admission & Instant Bangla QR Payment",
        title: "Japanese Course Enrollment & Payment Portal",
        subtitle:
          "Select your course package, apply your 20% Full-Payment Discount (or 50% Installment), scan our official bKash / Bangla QR, and enter your TrxID to get your instant Digital Admission Receipt.",
        labelName: "Student Full Name *",
        placeholderName: "e.g. Tanvir Hasan",
        labelPhone: "Mobile Number (Phone) *",
        placeholderPhone: "e.g. 01711 223344",
        labelWhatsapp: "WhatsApp Number (For LMS Login Delivery) *",
        placeholderWhatsapp: "e.g. 01711 223344",
        labelCourse: "Select Course Package (4 Standard Courses) *",
        labelClassMode: "Class Delivery Mode *",
        labelPurpose: "Target Visa / Career Purpose *",
        modeOnline: "Online Live Class (Zoom)",
        modePaltan: "Paltan Head Office (Offline)",
        modeKhulna: "Khulna Branch (Offline)",
        purposeStudent: "Student Visa (Higher Study in Japan)",
        purposeSSW: "SSW Specified Skilled Worker (Job Visa)",
        purposeTITP: "TITP Technical Intern Training",
        purposeCareer: "Japanese Language & Professional Career",
        paymentPlanLabel: "Choose Payment Plan *",
        planFullTitle: `Full Course Fee Payment (Extra ${fullDiscountPercent}% OFF!)`,
        planFullSub: `Save ${fullDiscountPercent}% instantly on the database course fee`,
        planInstTitle: "1st Installment (50% Booking Payment)",
        planInstSub: "Pay 50% today and the remaining 50% after 30 days",
        promoLabel: "Have a Special Client Promo Code?",
        promoPlaceholder: "Enter Promo Code (e.g. KNLTC10)",
        promoApplyBtn: "Apply Code",
        promoRemoveBtn: "Remove",
        promoInvalid: "Invalid or expired promo code.",
        promoAppliedMsg: "Promo code applied successfully!",
        payMethodLabel: "Payment Method *",
        methodQr: "bKash Merchant / Bangla QR (Instant Verification)",
        methodOffice: "Pay Later at Office Desk (Paltan / Khulna)",
        senderLabel: "Sender bKash / Mobile Number *",
        senderPlaceholder: "e.g. 017XXXXXXXX (Number you paid from)",
        paidAmountLabel: "Paid Amount (BDT) *",
        trxIdLabel: "Transaction ID (TrxID) *",
        trxIdPlaceholder: "e.g. BKL982XYZ",
        qrBoxBadge: "Official bKash Merchant & Bangla QR",
        qrBoxTitle: "Scan to Pay Course Fee",
        qrMerchantLabel: "bKash Merchant Account:",
        qrEnlargeBtn: "Click to Enlarge QR",
        qrStep1: "1. Open bKash App or any Bangla QR supported banking app.",
        qrStep2: "2. Tap 'Scan QR' or 'Payment' to merchant number.",
        qrStep3: "3. Pay the payable amount & copy the Transaction ID (TrxID).",
        summaryHeading: "Live Fee & Discount Summary",
        baseFeeText: "Database Course Fee:",
        fullDiscountText: `Full Payment Discount (${fullDiscountPercent}%):`,
        promoDiscountText: "Special Promo Discount:",
        netCourseFeeText: "Net Payable Course Fee:",
        payableTodayText: "Payable Today:",
        dueLaterText: "Remaining Due (2nd Installment):",
        btnSubmitQr: "Submit Admission & Verify TrxID",
        btnSubmitOffice: "Submit Admission & Book Seat",
        submitting: "Generating Official Digital Receipt...",
        securityNote: "256-Bit Encrypted • Official KNLTC Admission Hotline: +880 1805 013633",
        errorName: "Please enter your full name.",
        errorPhone: "Please enter a valid mobile number (at least 10 digits).",
        errorSender: "Please enter the sender bKash/Bank mobile number.",
        errorTrxId: "Please enter a valid Transaction ID (TrxID) of at least 5 characters.",
        courses: [
          {
            id: "JFT_IRODORI" as CourseOption,
            name: "JFT (Irodori) — Priority Spoken & Exam Track",
            duration: "3 Months • 150 Hours",
            baseFee: jftFee,
            tag: "#1 Priority for BOTH Student Visa & SSW Job Visa",
          },
          {
            id: "N5_COURSE" as CourseOption,
            name: "JLPT N5 (Beginner Foundation Course)",
            duration: "3 Months • 150 Hours",
            baseFee: n5Fee,
            tag: "Student Visa, TITP & Beginners (+3 Free Bonus Courses)",
          },
          {
            id: "N4_COURSE" as CourseOption,
            name: "JLPT N4 (Intermediate & SSW Track)",
            duration: "3 Months • 150 Hours",
            baseFee: n4Fee,
            tag: "SSW & University (100% Free for KNLTC COE Candidates)",
          },
          {
            id: "N5_N4_COMBO" as CourseOption,
            name: "JLPT N5 + N4 Together (Zero-to-N4 Combo)",
            duration: "6 Months • 300 Hours",
            baseFee: comboFee,
            tag: "Uninterrupted Hiragana to N4 Certificate Bundle",
          },
        ],
        receipt: {
          congratsTitle: "Congratulations",
          congratsSub:
            "Your admission application and payment details have been recorded!",
          receiptHeader: "OFFICIAL DIGITAL ADMISSION & PAYMENT RECEIPT",
          refLabel: "Application Ref ID",
          dateLabel: "Date & Time",
          statusBadgeQr: "TrxID Verification in Progress",
          statusBadgeOffice: "Office Desk Payment Pending",
          studentInfoTitle: "Student & Batch Information",
          paymentInfoTitle: "Fee & Payment Verification Details",
          nameLabel: "Student Name:",
          phoneLabel: "Phone / WhatsApp:",
          courseLabel: "Enrolled Package:",
          modeLabel: "Class Delivery Mode:",
          purposeLabel: "Target Visa Track:",
          methodLabel: "Payment Method:",
          senderLabel: "Sender Number:",
          trxLabel: "Transaction ID (TrxID):",
          nextStepsTitle: "Next Step: Instant Student LMS Account Activation",
          nextStepsDesc:
            "Our accounts & admission team is verifying your TrxID and will dispatch your official Student LMS (https://npw.bd/knltc) Username & Password directly to your WhatsApp. Click the WhatsApp button below for instant 1-minute verification!",
          btnWhatsapp: "1-Click WhatsApp Instant Verification (Send TrxID)",
          btnPrint: "Print / Save PDF Receipt",
          btnLms: "Open Student LMS Portal",
          btnNewApp: "Submit Another Application",
        },
      },
      bn: {
        kicker: "সরাসরি অনলাইন ভর্তি ও বিকাশ Bangla QR পেমেন্ট গেটওয়ে",
        title: "জাপানি ভাষা কোর্সে ভর্তি ও পেমেন্ট ফরম",
        subtitle:
          "আপনার পছন্দের কোর্সটি সিলেক্ট করুন, এককালীন ফুল পেমেন্টে ২০% ডিসকাউন্ট (অথবা ৫০% কিস্তি) বেছে নিন, অফিশিয়াল বিকাশ মার্চেন্ট / Bangla QR স্ক্যান করে পেমেন্ট সম্পন্ন করে TrxID সাবমিট করুন এবং সাথে সাথেই অফিশিয়াল ডিজিটাল মানি রিসিট বুঝে নিন।",
        labelName: "শিক্ষার্থীর পূর্ণ নাম *",
        placeholderName: "যেমন: তানভীর হাসান",
        labelPhone: "মোবাইল নম্বর (Phone) *",
        placeholderPhone: "যেমন: 01711 223344",
        labelWhatsapp: "হোয়াটসঅ্যাপ নম্বর (LMS আইডি ও পাসওয়ার্ড পাওয়ার জন্য) *",
        placeholderWhatsapp: "যেমন: 01711 223344",
        labelCourse: "কোর্স প্যাকেজ নির্বাচন করুন (৪টি স্ট্যান্ডার্ড কোর্স) *",
        labelClassMode: "ক্লাসের মাধ্যম (Class Delivery Mode) *",
        labelPurpose: "জাপান গমনের উদ্দেশ্য (Target Visa) *",
        modeOnline: "Online Live Class (Zoom)",
        modePaltan: "Paltan Head Office (Offline)",
        modeKhulna: "Khulna Branch (Offline)",
        purposeStudent: "Student Visa (জাপানে উচ্চশিক্ষা)",
        purposeSSW: "SSW দক্ষ কর্মী (Job Visa)",
        purposeTITP: "TITP টেকনিক্যাল ইন্টার্ন",
        purposeCareer: "জাপানি ভাষা ও প্রফেশনাল ক্যারিয়ার",
        paymentPlanLabel: "পেমেন্ট প্ল্যান নির্বাচন করুন *",
        planFullTitle: `ফুল কোর্স ফি পেমেন্ট (অতিরিক্ত ${fullDiscountPercent}% ডিসকাউন্ট!)`,
        planFullSub: `এককালীন পেমেন্টে মূল কোর্স ফি থেকে সরাসরি ${fullDiscountPercent}% ছাড়`,
        planInstTitle: "১ম কিস্তি (৫০% বুকিং পেমেন্ট — Installment)",
        planInstSub: "ভর্তির সময় ৫০% এবং ক্লাস শুরুর ৩০ দিন পর বাকি ৫০% পরিশোধযোগ্য",
        promoLabel: "স্পেশাল প্রোমো কোড আছে? (Promo Code)",
        promoPlaceholder: "প্রোমো কোড লিখুন (যেমন: KNLTC10)",
        promoApplyBtn: "অ্যাপ্লাই করুন",
        promoRemoveBtn: "বাতিল",
        promoInvalid: "প্রোমো কোডটি সঠিক নয় অথবা মেয়াদ শেষ হয়েছে।",
        promoAppliedMsg: "প্রোমো কোড ডিসকাউন্ট সফলভাবে যুক্ত হয়েছে!",
        payMethodLabel: "পেমেন্ট মেথড নির্বাচন করুন *",
        methodQr: "বিকাশ মার্চেন্ট / Bangla QR (দ্রুত LMS অ্যাক্টিভেশন)",
        methodOffice: "অফিসে এসে পেমেন্ট করব (পল্টন / খুলনা শাখা)",
        senderLabel: "যে নাম্বার থেকে টাকা পাঠিয়েছেন (Sender bKash / Mobile No.) *",
        senderPlaceholder: "যেমন: 017XXXXXXXX",
        paidAmountLabel: "পরিশোধিত টাকার পরিমাণ (Paid Amount BDT) *",
        trxIdLabel: "ট্রানজেকশন আইডি (Transaction ID / TrxID) *",
        trxIdPlaceholder: "যেমন: BKL982XYZ",
        qrBoxBadge: "অফিশিয়াল বিকাশ মার্চেন্ট ও Bangla QR",
        qrBoxTitle: "স্ক্যান করে কোর্স ফি পরিশোধ করুন",
        qrMerchantLabel: "বিকাশ মার্চেন্ট নাম্বার:",
        qrEnlargeBtn: "বড় করে QR দেখুন (Click to Enlarge)",
        qrStep1: "১. আপনার বিকাশ অ্যাপ অথবা যেকোনো Bangla QR সাপোর্টেড ব্যাংক অ্যাপ খুলুন।",
        qrStep2: "২. 'Scan QR' করুন অথবা মার্চেন্ট নাম্বারে 'Payment' অপশনে যান।",
        qrStep3: "৩. নির্ধারিত ফি পেমেন্ট করে Transaction ID (TrxID) কপি করে বামপাশের বক্সে লিখুন।",
        summaryHeading: "লাইভ কোর্স ফি ও ডিসকাউন্ট হিসাব",
        baseFeeText: "নির্ধারিত কোর্স ফি (ডাটাবেস):",
        fullDiscountText: `ফুল পেমেন্ট ডিসকাউন্ট (${fullDiscountPercent}%):`,
        promoDiscountText: "স্পেশাল প্রোমো কোড ছাড়:",
        netCourseFeeText: "ডিসকাউন্ট পরবর্তী মোট কোর্স ফি:",
        payableTodayText: "আজ পরিশোধযোগ্য (Payable Today):",
        dueLaterText: "পরবর্তী কিস্তিতে বকেয়া (Due):",
        btnSubmitQr: "ভর্তি ও পেমেন্ট তথ্য (TrxID) জমা দিন",
        btnSubmitOffice: "ভর্তির আবেদন জমা দিন (অফিস পেমেন্ট)",
        submitting: "ডিজিটাল মানি রিসিট তৈরি হচ্ছে...",
        securityNote: "আপনার পেমেন্ট ও তথ্য ১০০% নিরাপদ • হটলাইন: +৮৮০ ১৮০৫ ০১৩৬৩৩",
        errorName: "অনুগ্রহ করে শিক্ষার্থীর পূর্ণ নাম লিখুন।",
        errorPhone: "একটি সঠিক মোবাইল নম্বর লিখুন (কমপক্ষে ১০ ডিজিট)।",
        errorSender: "যে বিকাশ বা মোবাইল নাম্বার থেকে টাকা পাঠিয়েছেন সেটি লিখুন।",
        errorTrxId: "সঠিক Transaction ID (TrxID) লিখুন (কমপক্ষে ৫ অক্ষর)।",
        courses: [
          {
            id: "JFT_IRODORI" as CourseOption,
            name: "JFT (Irodori) — স্পোকেন, লিসেনিং ও এক্সাম স্পেশাল",
            duration: "৩ মাস • ১৫০ ঘণ্টা",
            baseFee: jftFee,
            tag: "#১ অগ্রাধিকার • স্টুডেন্ট ভিসা ও SSW জব ভিসা উভয়ের জন্য সেরা",
          },
          {
            id: "N5_COURSE" as CourseOption,
            name: "JLPT N5 (বিগিনার ফাউন্ডেশন কোর্স)",
            duration: "৩ মাস • ১৫০ ঘণ্টা",
            baseFee: n5Fee,
            tag: "স্টুডেন্ট ভিসা, TITP ও বিগিনার (+৩টি বোনাস কোর্স ফ্রি)",
          },
          {
            id: "N4_COURSE" as CourseOption,
            name: "JLPT N4 (ইন্টারমিডিয়েট ও SSW ট্র্যাক)",
            duration: "৩ মাস • ১৫০ ঘণ্টা",
            baseFee: n4Fee,
            tag: "SSW ও ইউনিভার্সিটি (KNLTC স্টুডেন্ট ভিসা COE প্রার্থীদের ১০০% ফ্রি)",
          },
          {
            id: "N5_N4_COMBO" as CourseOption,
            name: "JLPT N5 + N4 Together (কমপ্লিট জিরো-টু-N4 কম্বো)",
            duration: "৬ মাস • ৩০০ ঘণ্টা",
            baseFee: comboFee,
            tag: "হিরাগানা থেকে N4 পর্যন্ত একটানা কম্বো সাশ্রয় প্যাকেজ",
          },
        ],
        receipt: {
          congratsTitle: "অভিনন্দন",
          congratsSub:
            "আপনার ভর্তি আবেদন ও পেমেন্ট তথ্য সফলভাবে জমা হয়েছে!",
          receiptHeader: "অফিশিয়াল ডিজিটাল ভর্তি ও পেমেন্ট রিসিট (MONEY RECEIPT)",
          refLabel: "রেফারেন্স আইডি (Ref ID)",
          dateLabel: "তারিখ ও সময়",
          statusBadgeQr: "TrxID ভেরিফিকেশন চলমান",
          statusBadgeOffice: "অফিস ডেস্কে পেমেন্ট পেন্ডিং",
          studentInfoTitle: "শিক্ষার্থী ও ব্যাচের তথ্য",
          paymentInfoTitle: "কোর্স ফি ও পেমেন্ট ভেরিফিকেশন বিবরণ",
          nameLabel: "শিক্ষার্থীর নাম:",
          phoneLabel: "মোবাইল / হোয়াটসঅ্যাপ:",
          courseLabel: "ভর্তিকৃত কোর্স প্যাকেজ:",
          modeLabel: "ক্লাসের মাধ্যম:",
          purposeLabel: "টার্গেট ভিসা:",
          methodLabel: "পেমেন্ট মেথড:",
          senderLabel: "প্রেরকের নাম্বার (Sender):",
          trxLabel: "ট্রানজেকশন আইডি (TrxID):",
          nextStepsTitle: "পরবর্তী ধাপ: দ্রুত স্টুডেন্ট LMS আইডি ও পাসওয়ার্ড গ্রহণ",
          nextStepsDesc:
            "আমাদের অ্যাডমিন ও একাউন্টস টিম আপনার TrxID ভেরিফাই করছে এবং অল্প সময়ের মধ্যেই আপনার হোয়াটসঅ্যাপে অফিশিয়াল স্টুডেন্ট পোর্টালের (https://npw.bd/knltc) ইউজারনেম ও পাসওয়ার্ড পাঠিয়ে দেবে। ১ মিনিটেই তাৎক্ষণিক অ্যাক্টিভেশনের জন্য নিচের WhatsApp বাটনে ক্লিক করুন!",
          btnWhatsapp: "১-ক্লিকে WhatsApp-এ TrxID পাঠিয়ে LMS আইডি নিন",
          btnPrint: "রিসিট প্রিন্ট / PDF সেভ করুন",
          btnLms: "LMS ক্লাসরুমে প্রবেশ করুন",
          btnNewApp: "নতুন আরেকটি আবেদন করুন",
        },
      },
      ja: {
        kicker: "オンライン受講申請＆公式Bangla QR即時決済",
        title: "日本語4大コース 受講申込み・決済フォーム",
        subtitle:
          "希望コースを選択し、一括払い20%割引（または50%分割払い）を適用の上、公式bKash / Bangla QRで決済してTrxIDをご入力ください。即時にデジタル領収書が発行されます。",
        labelName: "受講生氏名 *",
        placeholderName: "例：Tanvir Hasan",
        labelPhone: "携帯電話番号 *",
        placeholderPhone: "例：01711 223344",
        labelWhatsapp: "WhatsApp番号（LMSアカウント送付先）*",
        placeholderWhatsapp: "例：01711 223344",
        labelCourse: "受講コースパッケージ（4大標準コース）*",
        labelClassMode: "受講形式 *",
        labelPurpose: "渡航・学習目的 *",
        modeOnline: "Online Live Class (Zoom)",
        modePaltan: "Paltan Head Office (Offline)",
        modeKhulna: "Khulna Branch (Offline)",
        purposeStudent: "留学ビザ（日本での進学）",
        purposeSSW: "特定技能（SSW就労ビザ）",
        purposeTITP: "技能実習プログラム（TITP）",
        purposeCareer: "日本語キャリア・ビジネス実務",
        paymentPlanLabel: "お支払いプランの選択 *",
        planFullTitle: `一括払いプラン（さらに${fullDiscountPercent}%特別割引！）`,
        planFullSub: `一括払いで基本受講料から即座に${fullDiscountPercent}%OFF`,
        planInstTitle: "2回分割払いプラン（初回50%申込金）",
        planInstSub: "申込時に50%、開講30日後に残り50%をお支払い",
        promoLabel: "特別プロモコードをお持ちですか？",
        promoPlaceholder: "コードを入力 (例: KNLTC10)",
        promoApplyBtn: "適用する",
        promoRemoveBtn: "解除",
        promoInvalid: "無効または期限切れのプロモコードです。",
        promoAppliedMsg: "プロモコード割引が適用されました！",
        payMethodLabel: "お支払い方法 *",
        methodQr: "bKash加盟店 / Bangla QR（即時確認）",
        methodOffice: "窓口で後払い（ダッカ本部 / クルナ支部）",
        senderLabel: "送金元bKash / 携帯電話番号 *",
        senderPlaceholder: "例：017XXXXXXXX",
        paidAmountLabel: "送金金額 (BDT) *",
        trxIdLabel: "取引ID (Transaction ID / TrxID) *",
        trxIdPlaceholder: "例：BKL982XYZ",
        qrBoxBadge: "公式 bKash Merchant & Bangla QR",
        qrBoxTitle: "QRコードをスキャンして決済",
        qrMerchantLabel: "bKashマーチャント番号:",
        qrEnlargeBtn: "QRコードを拡大表示",
        qrStep1: "1. bKashアプリまたはBangla QR対応銀行アプリを開きます。",
        qrStep2: "2. QRスキャンまたはマーチャント番号へ送金（Payment）します。",
        qrStep3: "3. 決済完了後のTransaction ID (TrxID) を入力してください。",
        summaryHeading: "受講料・割引リアルタイム明細",
        baseFeeText: "基本受講料（DB）:",
        fullDiscountText: `一括払い割引 (${fullDiscountPercent}%):`,
        promoDiscountText: "プロモコード割引:",
        netCourseFeeText: "割引後受講料合計:",
        payableTodayText: "本日のお支払い額:",
        dueLaterText: "次回お支払い残高:",
        btnSubmitQr: "申込＆TrxIDを送信して領収書を発行",
        btnSubmitOffice: "受講申請を送信する",
        submitting: "デジタル領収書を発行中...",
        securityNote: "SSL暗号化保護 • 公式ホットライン: +880 1805 013633",
        errorName: "氏名をご入力ください。",
        errorPhone: "有効な電話番号をご入力ください。",
        errorSender: "送金元の電話番号をご入力ください。",
        errorTrxId: "有効なTransaction ID (TrxID) をご入力ください。",
        courses: [
          {
            id: "JFT_IRODORI" as CourseOption,
            name: "JFT (Irodori) — 会話・聴解・試験最優先コース",
            duration: "3ヶ月 • 150時間",
            baseFee: jftFee,
            tag: "最優先推奨 • 留学ビザ＆特定技能（SSW）双方に最適",
          },
          {
            id: "N5_COURSE" as CourseOption,
            name: "JLPT N5（初級基礎150時間コース）",
            duration: "3ヶ月 • 150時間",
            baseFee: n5Fee,
            tag: "留学ビザ・技能実習・初心者向け（3大特典無料）",
          },
          {
            id: "N4_COURSE" as CourseOption,
            name: "JLPT N4（中級・特定技能＆進学コース）",
            duration: "3ヶ月 • 150時間",
            baseFee: n4Fee,
            tag: "特定技能・進学（KNLTC留学COE待機生は100%無料）",
          },
          {
            id: "N5_N4_COMBO" as CourseOption,
            name: "JLPT N5 + N4 セット（6ヶ月300時間一貫コース）",
            duration: "6ヶ月 • 300時間",
            baseFee: comboFee,
            tag: "ひらがなからN4合格まで一貫マスター特別セット",
          },
        ],
        receipt: {
          congratsTitle: "お申し込みありがとうございます",
          congratsSub: "受講申請および決済情報（TrxID）が正常に記録されました！",
          receiptHeader: "公式デジタル受講申込・決済受領書 (OFFICIAL RECEIPT)",
          refLabel: "受付整理番号 (Ref ID)",
          dateLabel: "発行日時",
          statusBadgeQr: "TrxID照合・確認中",
          statusBadgeOffice: "窓口支払い予約済",
          studentInfoTitle: "受講生・クラス情報",
          paymentInfoTitle: "受講料・決済明細",
          nameLabel: "受講生氏名:",
          phoneLabel: "電話番号 / WhatsApp:",
          courseLabel: "申込コース:",
          modeLabel: "受講形式:",
          purposeLabel: "渡航目的:",
          methodLabel: "決済方法:",
          senderLabel: "送金元番号:",
          trxLabel: "取引ID (TrxID):",
          nextStepsTitle: "次のステップ：公式LMSアカウントの即時発行",
          nextStepsDesc:
            "経理・事務局にてTrxIDを確認後、WhatsApp宛てに公式LMSポータル（https://npw.bd/knltc）のログインID・パスワードをお送りします。下のボタンからWhatsAppで即時確認が可能です！",
          btnWhatsapp: "WhatsAppでTrxIDを送信して即時有効化",
          btnPrint: "領収書を印刷 / PDF保存",
          btnLms: "公式LMSポータルを開く",
          btnNewApp: "新規申込みへ戻る",
        },
      },
    },
    language,
  );

  // Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [course, setCourse] = useState<CourseOption>(() =>
    slugToCourseOption(initialCourseSlug),
  );
  const [classMode, setClassMode] = useState<ClassModeOption>("ONLINE_LIVE");
  const [purpose, setPurpose] = useState<VisaPurposeOption>("STUDENT_VISA");
  const [paymentPlan, setPaymentPlan] = useState<PaymentPlanOption>(
    initialPlan || "FULL_PAYMENT",
  );
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethodOption>("BKASH_BANGLA_QR");

  // Promo Code State
  const [promoInput, setPromoInput] = useState(
    initialPromoCode ? initialPromoCode.toUpperCase() : "",
  );
  const [appliedPromo, setAppliedPromo] =
    useState<LanguageCoursePromoCode | null>(null);
  const [promoFeedback, setPromoFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Sync initialCourseSlug and URL query parameters (?plan=full|installment&promo=CODE)
  useEffect(() => {
    if (initialCourseSlug) {
      setCourse(slugToCourseOption(initialCourseSlug));
      setPaidAmountEdited(false);
    }
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const planParam = (params.get("plan") || "").toLowerCase();
      if (planParam === "installment" || planParam === "50") {
        setPaymentPlan("INSTALLMENT_50");
        setPaidAmountEdited(false);
      } else if (planParam === "full" || planParam === "20") {
        setPaymentPlan("FULL_PAYMENT");
        setPaidAmountEdited(false);
      }
      const promoParam = (params.get("promo") || initialPromoCode || "")
        .trim()
        .toUpperCase();
      if (promoParam) {
        setPromoInput(promoParam);
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

  // Payment Verification Inputs
  const [senderNumber, setSenderNumber] = useState("");
  const [paidAmountInput, setPaidAmountInput] = useState<number>(0);
  const [ paidAmountEdited, setPaidAmountEdited ] = useState(false);
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

  // Reset image error state whenever the uploaded Bangla QR URL changes
  useEffect(() => {
    setQrImgFailed(false);
  }, [banglaQrUrl]);

  // Current course pricing breakdown
  const currentCourseObj =
    t.courses.find((c) => c.id === course) || t.courses[0];
  const baseFeeBdt = currentCourseObj.baseFee;

  // 20% Full Payment Discount
  const fullPayDiscountBdt =
    paymentPlan === "FULL_PAYMENT"
      ? Math.round((baseFeeBdt * fullDiscountPercent) / 100)
      : 0;
  const feeAfterFullDiscount = Math.max(0, baseFeeBdt - fullPayDiscountBdt);

  // Promo Code Discount
  const promoDiscountBdt = appliedPromo
    ? appliedPromo.discountType === "PERCENT"
      ? Math.round((feeAfterFullDiscount * appliedPromo.discountValue) / 100)
      : Math.min(feeAfterFullDiscount, Math.round(appliedPromo.discountValue))
    : 0;

  const netCourseFeeBdt = Math.max(0, feeAfterFullDiscount - promoDiscountBdt);
  const recommendedPayableToday =
    paymentPlan === "FULL_PAYMENT"
      ? netCourseFeeBdt
      : Math.round(netCourseFeeBdt / 2);

  // Keep `paidAmountInput` synced with calculated payable unless manually edited
  useEffect(() => {
    if (!paidAmountEdited) {
      setPaidAmountInput(recommendedPayableToday);
    }
  }, [recommendedPayableToday, paidAmountEdited]);

  // Listen for course selection from CoursePackagesSection cards
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
        setPaymentPlan(customEvent.detail.paymentPlan);
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

    if (!cleanName) {
      setFormError(t.errorName);
      return;
    }

    if (!cleanPhone || cleanPhone.replace(/\D/g, "").length < 10) {
      setFormError(t.errorPhone);
      return;
    }

    if (paymentMethod === "BKASH_BANGLA_QR") {
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

    const finalPaidAmount =
      paymentMethod === "BKASH_BANGLA_QR"
        ? Math.max(0, Number(paidAmountInput) || recommendedPayableToday)
        : 0;
    const finalDueAmount = Math.max(0, netCourseFeeBdt - finalPaidAmount);
    const totalDiscountBdt = fullPayDiscountBdt + promoDiscountBdt;

    // 1. Immediately sync with client-side CMS store so Dashboard shows the student & TrxID
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
      paymentPlan,
      paymentMethod,
      senderNumber: paymentMethod === "BKASH_BANGLA_QR" ? cleanSender : undefined,
      trxId: paymentMethod === "BKASH_BANGLA_QR" ? cleanTrxId : undefined,
      promoCode: appliedPromo?.code,
    });

    // 2. Persist to server API (`knltc_lms_bridges`, `knltc_crm_leads` & `knltc_finance_transactions`)
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
        paymentPlan,
        paymentMethod,
        baseFeeBdt,
        discountBdt: totalDiscountBdt,
        netCourseFeeBdt,
        paidAmountBdt: finalPaidAmount,
        dueAmountBdt: finalDueAmount,
        senderNumber: paymentMethod === "BKASH_BANGLA_QR" ? cleanSender : "",
        trxId: paymentMethod === "BKASH_BANGLA_QR" ? cleanTrxId : "",
        promoCode: appliedPromo?.code || "",
        notes: `${courseLabel} | ${classModeLabel} | ${purposeLabel} | Plan: ${paymentPlan} | Paid: ৳${finalPaidAmount} | TrxID: ${cleanTrxId || "OFFICE_DESK"}`,
      }),
    }).catch(() => {
      // Non-blocking sync to Google Sheets backend
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
        name: cleanName,
        phone: cleanPhone,
        whatsapp: cleanWa,
        courseId: course,
        courseLabel,
        classMode,
        classModeLabel,
        purpose,
        purposeLabel,
        paymentPlan,
        paymentMethod,
        baseFeeBdt,
        fullPayDiscountBdt,
        promoCode: appliedPromo?.code,
        promoDiscountBdt,
        netCourseFeeBdt,
        paidAmountBdt:
          paymentMethod === "BKASH_BANGLA_QR"
            ? finalPaidAmount
            : recommendedPayableToday,
        dueAmountBdt: finalDueAmount,
        senderNumber:
          paymentMethod === "BKASH_BANGLA_QR" ? cleanSender : "Office Desk",
        trxId:
          paymentMethod === "BKASH_BANGLA_QR" ? cleanTrxId : "PAY-AT-OFFICE",
      };

      setSubmittedReceipt(receiptPayload);

      try {
        trackLead();
      } catch {
        // Safe fallback
      }

      setIsSubmitting(false);

      // Smoothly scroll to the top of #enrollment-form so the user sees their Thank You & Receipt screen
      const el = document.getElementById("enrollment-form");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 350);
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
    const message =
      language === "bn"
        ? `আসসালামু আলাইকুম KNLTC এডমিশন টিম,\nআমি জাপানি ভাষা কোর্সে ভর্তি ও পেমেন্ট সম্পন্ন করেছি।\n\n• নাম: ${r.name}\n• মোবাইল: ${r.phone}\n• হোয়াটসঅ্যাপ: ${r.whatsapp}\n• রেফারেন্স আইডি: ${r.id}\n• কোর্স: ${r.courseLabel}\n• ক্লাস মোড: ${r.classModeLabel}\n• টার্গেট ভিসা: ${r.purposeLabel}\n• পেমেন্ট প্ল্যান: ${r.paymentPlan === "FULL_PAYMENT" ? "Full Payment (20% Discount)" : "50% 1st Installment"}${r.promoCode ? `\n• প্রোমো কোড: ${r.promoCode}` : ""}\n• পরিশোধিত টাকা: ৳${r.paidAmountBdt}\n• প্রেরকের নাম্বার: ${r.senderNumber}\n• TrxID: ${r.trxId}\n\nঅনুগ্রহ করে আমার পেমেন্ট ভেরিফাই করে স্টুডেন্ট LMS পোর্টালের (https://npw.bd/knltc) ইউজারনেম ও পাসওয়ার্ড প্রদান করুন। ধন্যবাদ!`
        : language === "ja"
          ? `こんにちは KNLTC事務局様、\n日本語コースの受講申請および決済を完了しました。\n\n• 氏名: ${r.name}\n• 電話: ${r.phone}\n• 受付ID: ${r.id}\n• コース: ${r.courseLabel}\n• 受講形式: ${r.classModeLabel}\n• 渡航目的: ${r.purposeLabel}\n• 送金額: ৳${r.paidAmountBdt}\n• 送金元番号: ${r.senderNumber}\n• 取引ID (TrxID): ${r.trxId}\n\n公式LMS（https://npw.bd/knltc）のログイン情報のご案内をお願いいたします。`
          : `Hello KNLTC Admissions,\nI have submitted my Japanese Language Course enrollment & payment details:\n\n• Student Name: ${r.name}\n• Phone: ${r.phone}\n• WhatsApp: ${r.whatsapp}\n• Reference ID: ${r.id}\n• Selected Course: ${r.courseLabel}\n• Delivery Mode: ${r.classModeLabel}\n• Target Visa: ${r.purposeLabel}\n• Payment Plan: ${r.paymentPlan === "FULL_PAYMENT" ? "Full Payment (20% Off)" : "50% 1st Installment"}${r.promoCode ? `\n• Promo Code: ${r.promoCode}` : ""}\n• Paid Amount: ৳${r.paidAmountBdt}\n• Sender Number: ${r.senderNumber}\n• Transaction ID (TrxID): ${r.trxId}\n\nPlease verify my TrxID and send my official Student LMS (https://npw.bd/knltc) login credentials. Thank you!`;
    return `https://wa.me/8801805013633?text=${encodeURIComponent(message)}`;
  };

  return (
    <section
      id="enrollment-form"
      className={`${
        isStandalonePage ? "py-10 md:py-16" : "py-16 md:py-24"
      } bg-[#fcfaf7] border-b border-stone-200 scroll-mt-16`}
    >
      <div className="container-narrow max-w-5xl">
        {/* Standalone Campaign Navigation & Course Switcher Bar */}
        {isStandalonePage && (
          <div className="mb-8 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-200/80">
              <Link
                href="/japanese-language"
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-950 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>
                  {language === "bn"
                    ? "সকল জাপানি ভাষা কোর্স ও কারিকুলামে ফিরে যান"
                    : language === "ja"
                      ? "全日本語コース一覧に戻る"
                      : "Back to All Japanese Courses & Curriculum"}
                </span>
              </Link>

              <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-600">
                <span className="inline-flex items-center gap-1 text-[#1E5631]">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>
                    {language === "bn"
                      ? "১৫০ ঘণ্টা সার্টিফাইড"
                      : "150-Hr Certified"}
                  </span>
                </span>
                <span className="text-stone-300">•</span>
                <span className="inline-flex items-center gap-1 text-[#b91c1c]">
                  <Award className="h-3.5 w-3.5" />
                  <span>
                    {language === "bn"
                      ? "সিনিয়র সেন্সি আমির হোসেন"
                      : "Senior Sensei Amir Hossen"}
                  </span>
                </span>
              </div>
            </div>

            {/* 4 Shareable Course Campaign Links / Switcher */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
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
                    className={`rounded-xl border px-3.5 py-2.5 text-left transition-all ${
                      active
                        ? "border-slate-900 bg-slate-900 text-white shadow-xs"
                        : "border-stone-200 bg-white text-slate-700 hover:border-stone-300"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-extrabold truncate">
                        {c.id === "JFT_IRODORI"
                          ? "JFT (Irodori)"
                          : c.id === "N5_COURSE"
                            ? "JLPT N5"
                            : c.id === "N4_COURSE"
                              ? "JLPT N4"
                              : "N5 + N4 Combo"}
                      </span>
                      {active && (
                        <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
                      )}
                    </div>
                    <p
                      className={`text-[10px] mt-0.5 truncate ${
                        active ? "text-stone-300" : "text-slate-500"
                      }`}
                    >
                      {c.duration} • {formatBdt(c.baseFee)}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Minimal Editorial Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#b91c1c]">
            <span>{t.kicker}</span>
          </div>
          <h1 className="mt-1.5 text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight leading-relaxed">
            {currentCourseObj.name}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-2.5 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1 font-semibold text-slate-800 bg-white border border-stone-200 px-2.5 py-1 rounded-md">
              <Clock className="h-3.5 w-3.5 text-[#b91c1c]" />
              <span>{currentCourseObj.duration}</span>
            </span>
            <span className="inline-flex items-center gap-1 font-semibold text-[#1E5631] bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{currentCourseObj.tag}</span>
            </span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {submittedReceipt ? (
            /* =====================================================================
               DEDICATED THANK YOU & OFFICIAL DIGITAL ADMISSION RECEIPT VIEW
               ===================================================================== */
            <motion.div
              key="receipt-view"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="max-w-3xl mx-auto space-y-6"
            >
              {/* Celebratory Banner */}
              <div className="rounded-3xl border-2 border-[#1E5631] bg-white p-6 sm:p-8 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
                  <div className="flex items-start gap-4">
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 320, damping: 20 }}
                      className="h-14 w-14 rounded-2xl bg-emerald-100 text-[#1E5631] flex items-center justify-center shrink-0 shadow-xs"
                    >
                      <CheckCircle2 className="h-8 w-8 stroke-[2.5]" />
                    </motion.div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-widest text-[#1E5631] block">
                        {t.receipt.receiptHeader}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5 leading-relaxed">
                        {t.receipt.congratsTitle}, {submittedReceipt.name}!
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {t.receipt.congratsSub}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-[#1E5631]">
                      <Receipt className="h-3.5 w-3.5" />
                      <span>
                        {submittedReceipt.paymentMethod === "BKASH_BANGLA_QR"
                          ? t.receipt.statusBadgeQr
                          : t.receipt.statusBadgeOffice}
                      </span>
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      {submittedReceipt.submittedAt}
                    </span>
                  </div>
                </div>

                {/* Ref ID & Highlighted TrxID Bar */}
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="rounded-xl border border-stone-200 bg-[#fcfaf7] p-4 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                        {t.receipt.refLabel}
                      </span>
                      <span className="text-base font-black text-slate-900 font-mono">
                        {submittedReceipt.id}
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleCopyId}
                      className="h-8 rounded-lg text-xs font-semibold gap-1.5 cursor-pointer"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      <span>{copiedId ? "Copied" : "Copy"}</span>
                    </Button>
                  </div>

                  <div className="rounded-xl border-2 border-[#C8102E]/40 bg-red-50/40 p-4 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#C8102E] block">
                        {t.receipt.trxLabel}
                      </span>
                      <span className="text-base font-black text-[#C8102E] font-mono tracking-wide">
                        {submittedReceipt.trxId}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-slate-700 bg-white border border-stone-200 px-2.5 py-1 rounded-lg tabular-nums">
                      {formatBdt(submittedReceipt.paidAmountBdt)}
                    </span>
                  </div>
                </div>

                {/* 2-Column Detailed Receipt Grid */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Left: Student & Batch Details */}
                  <div className="rounded-2xl border border-stone-200 bg-[#fcfaf7] p-5 space-y-3 text-xs">
                    <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] border-b border-stone-200 pb-2">
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
                      <span className="font-bold text-slate-900 text-right">
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

                  {/* Right: Payment & Discount Details */}
                  <div className="rounded-2xl border border-stone-200 bg-[#fcfaf7] p-5 space-y-2.5 text-xs">
                    <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] border-b border-stone-200 pb-2">
                      {t.receipt.paymentInfoTitle}
                    </h4>
                    <div className="flex justify-between">
                      <span className="text-slate-500">{t.baseFeeText}</span>
                      <span className="font-semibold text-slate-700 tabular-nums">
                        {formatBdt(submittedReceipt.baseFeeBdt)}
                      </span>
                    </div>
                    {submittedReceipt.fullPayDiscountBdt > 0 && (
                      <div className="flex justify-between text-[#1E5631]">
                        <span>{t.fullDiscountText}</span>
                        <span className="font-bold tabular-nums">
                          -{formatBdt(submittedReceipt.fullPayDiscountBdt)}
                        </span>
                      </div>
                    )}
                    {submittedReceipt.promoDiscountBdt > 0 && (
                      <div className="flex justify-between text-[#C8102E]">
                        <span>
                          {t.promoDiscountText} ({submittedReceipt.promoCode}):
                        </span>
                        <span className="font-bold tabular-nums">
                          -{formatBdt(submittedReceipt.promoDiscountBdt)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-stone-200 font-bold text-slate-900">
                      <span>{t.netCourseFeeText}</span>
                      <span className="tabular-nums">
                        {formatBdt(submittedReceipt.netCourseFeeBdt)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-black text-[#1E5631]">
                      <span>{t.payableTodayText}</span>
                      <span className="tabular-nums">
                        {formatBdt(submittedReceipt.paidAmountBdt)}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>{t.receipt.senderLabel}</span>
                      <span className="font-mono font-bold text-slate-900">
                        {submittedReceipt.senderNumber}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Next Steps & 1-Click Pre-Filled WhatsApp Button */}
                <div className="mt-6 rounded-2xl bg-emerald-50/90 border border-emerald-200 p-5 space-y-4">
                  <div>
                    <h4 className="text-sm sm:text-base font-extrabold text-[#1E5631] leading-relaxed">
                      {t.receipt.nextStepsTitle}
                    </h4>
                    <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                      {t.receipt.nextStepsDesc}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      asChild
                      size="lg"
                      className="flex-1 bg-[#1E5631] hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm py-6 rounded-xl shadow-md cursor-pointer"
                    >
                      <a
                        href={buildWhatsAppExpediteLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                      >
                        <MessageCircle className="h-5 w-5" />
                        <span>{t.receipt.btnWhatsapp}</span>
                      </a>
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={() => window.print()}
                      className="border-stone-300 bg-white hover:bg-stone-50 text-slate-800 font-bold text-xs sm:text-sm py-6 px-5 rounded-xl cursor-pointer"
                    >
                      <Printer className="mr-2 h-4 w-4 text-slate-600" />
                      <span>{t.receipt.btnPrint}</span>
                    </Button>
                  </div>
                </div>

                {/* Secondary Footer Actions */}
                <div className="mt-5 pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedReceipt(null);
                      setTrxId("");
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>{t.receipt.btnNewApp}</span>
                  </button>

                  <a
                    href={lmsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#b91c1c] hover:underline"
                  >
                    <GraduationCap className="h-4 w-4" />
                    <span>{t.receipt.btnLms}</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </motion.div>
          ) : (
            /* =====================================================================
               2-COLUMN ADMISSION + BKASH BANGLA QR PAYMENT FORM
               ===================================================================== */
            <motion.div
              key="admission-form-view"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="grid gap-8 lg:grid-cols-12 items-start"
            >
              {/* LEFT COLUMN (7 Cols): Student Details, Plan, Promo & TrxID Form */}
              <div className="lg:col-span-7 rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm">
                {formError && (
                  <div className="mb-6 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs sm:text-sm text-red-700 font-medium">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* 1. Student Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
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
                        className="w-full rounded-xl border border-stone-300 bg-white py-2.5 pl-10 pr-3.5 text-sm text-slate-900 shadow-2xs focus:border-[#b91c1c] focus:ring-1 focus:ring-[#b91c1c] focus:outline-none transition"
                      />
                    </div>
                  </div>

                  {/* 2. Phone & WhatsApp */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
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
                            if (!senderNumber) setSenderNumber(e.target.value);
                          }}
                          placeholder={t.placeholderPhone}
                          className="w-full rounded-xl border border-stone-300 bg-white py-2.5 pl-10 pr-3.5 text-sm text-slate-900 shadow-2xs focus:border-[#b91c1c] focus:ring-1 focus:ring-[#b91c1c] focus:outline-none transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
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
                          className="w-full rounded-xl border border-stone-300 bg-white py-2.5 pl-10 pr-3.5 text-sm text-slate-900 shadow-2xs focus:border-[#15803d] focus:ring-1 focus:ring-[#15803d] focus:outline-none transition"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3. Select Course Package (4 Standardized Courses) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      {t.labelCourse}
                    </label>
                    <select
                      value={course}
                      onChange={(e) => {
                        setCourse(e.target.value as CourseOption);
                        setPaidAmountEdited(false);
                      }}
                      className="w-full rounded-xl border border-stone-300 bg-white p-3 text-xs sm:text-sm font-bold text-slate-900 shadow-2xs focus:border-[#b91c1c] focus:ring-1 focus:ring-[#b91c1c] focus:outline-none transition cursor-pointer"
                    >
                      {t.courses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.duration}) — Regular: {formatBdt(c.baseFee)}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1.5 text-[11px] font-semibold text-[#1E5631] pl-1">
                      ★ {currentCourseObj.tag}
                    </p>
                  </div>

                  {/* 4. Class Delivery Mode & Target Visa */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        {t.labelClassMode}
                      </label>
                      <select
                        value={classMode}
                        onChange={(e) =>
                          setClassMode(e.target.value as ClassModeOption)
                        }
                        className="w-full rounded-xl border border-stone-300 bg-white p-3 text-xs sm:text-sm font-semibold text-slate-900 shadow-2xs focus:border-[#b91c1c] focus:outline-none cursor-pointer"
                      >
                        <option value="ONLINE_LIVE">{t.modeOnline}</option>
                        <option value="OFFLINE_PALTAN">{t.modePaltan}</option>
                        <option value="OFFLINE_KHULNA">{t.modeKhulna}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        {t.labelPurpose}
                      </label>
                      <select
                        value={purpose}
                        onChange={(e) =>
                          setPurpose(e.target.value as VisaPurposeOption)
                        }
                        className="w-full rounded-xl border border-stone-300 bg-white p-3 text-xs sm:text-sm font-semibold text-slate-900 shadow-2xs focus:border-[#b91c1c] focus:outline-none cursor-pointer"
                      >
                        <option value="STUDENT_VISA">{t.purposeStudent}</option>
                        <option value="SSW_JOB">{t.purposeSSW}</option>
                        <option value="TITP_INTERN">{t.purposeTITP}</option>
                        <option value="CAREER_SKILLS">{t.purposeCareer}</option>
                      </select>
                    </div>
                  </div>

                  {/* 5. Payment Plan Selection (Full Payment 20% Off vs 50% Installment) */}
                  <div className="pt-2 border-t border-stone-100">
                    <label className="block text-xs font-bold text-slate-800 mb-2">
                      {t.paymentPlanLabel}
                    </label>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => {
                          setPaymentPlan("FULL_PAYMENT");
                          setPaidAmountEdited(false);
                        }}
                        className={`rounded-xl border p-3.5 text-left transition cursor-pointer ${
                          paymentPlan === "FULL_PAYMENT"
                            ? "border-2 border-[#1E5631] bg-emerald-50/50"
                            : "border-stone-200 bg-white hover:border-stone-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-[#1E5631]">
                            {t.planFullTitle}
                          </span>
                          <Percent className="h-4 w-4 text-[#1E5631] shrink-0" />
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1">
                          {t.planFullSub}
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setPaymentPlan("INSTALLMENT_50");
                          setPaidAmountEdited(false);
                        }}
                        className={`rounded-xl border p-3.5 text-left transition cursor-pointer ${
                          paymentPlan === "INSTALLMENT_50"
                            ? "border-2 border-[#b91c1c] bg-red-50/30"
                            : "border-stone-200 bg-white hover:border-stone-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-slate-900">
                            {t.planInstTitle}
                          </span>
                          <CreditCard className="h-4 w-4 text-[#b91c1c] shrink-0" />
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1">
                          {t.planInstSub}
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* 6. Temporary Promo Code Input Box */}
                  <div className="rounded-xl border border-stone-200 bg-[#fcfaf7] p-3.5">
                    <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                      <Tag className="h-3.5 w-3.5 text-[#b91c1c]" />
                      <span>{t.promoLabel}</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) =>
                          setPromoInput(e.target.value.toUpperCase())
                        }
                        placeholder={t.promoPlaceholder}
                        className="flex-1 rounded-xl border border-stone-300 bg-white px-3.5 py-2 text-xs font-mono font-bold uppercase text-slate-900 focus:border-[#b91c1c] focus:outline-none"
                      />
                      {appliedPromo ? (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleRemovePromo}
                          className="rounded-xl text-xs font-bold text-red-600 border-red-200 hover:bg-red-50 cursor-pointer"
                        >
                          {t.promoRemoveBtn}
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          onClick={handleApplyPromoCode}
                          className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 cursor-pointer"
                        >
                          {t.promoApplyBtn}
                        </Button>
                      )}
                    </div>
                    {promoFeedback && (
                      <p
                        className={`mt-1.5 text-[11px] font-semibold ${
                          promoFeedback.type === "success"
                            ? "text-[#1E5631]"
                            : "text-red-600"
                        }`}
                      >
                        {promoFeedback.text}
                      </p>
                    )}
                  </div>

                  {/* 7. Payment Method & TrxID Verification Inputs */}
                  <div className="pt-2 border-t border-stone-100 space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-2">
                        {t.payMethodLabel}
                      </label>
                      <div className="grid gap-2.5 sm:grid-cols-2">
                        <label
                          onClick={() => setPaymentMethod("BKASH_BANGLA_QR")}
                          className={`flex items-center gap-2 rounded-xl border p-3 text-xs font-bold cursor-pointer transition ${
                            paymentMethod === "BKASH_BANGLA_QR"
                              ? "border-[#b91c1c] bg-red-50/40 text-slate-900"
                              : "border-stone-200 bg-white text-slate-600"
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            checked={paymentMethod === "BKASH_BANGLA_QR"}
                            onChange={() => setPaymentMethod("BKASH_BANGLA_QR")}
                            className="text-[#b91c1c]"
                          />
                          <span>{t.methodQr}</span>
                        </label>

                        <label
                          onClick={() => setPaymentMethod("PAY_AT_OFFICE")}
                          className={`flex items-center gap-2 rounded-xl border p-3 text-xs font-bold cursor-pointer transition ${
                            paymentMethod === "PAY_AT_OFFICE"
                              ? "border-slate-900 bg-stone-100 text-slate-900"
                              : "border-stone-200 bg-white text-slate-600"
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            checked={paymentMethod === "PAY_AT_OFFICE"}
                            onChange={() => setPaymentMethod("PAY_AT_OFFICE")}
                            className="text-slate-900"
                          />
                          <span>{t.methodOffice}</span>
                        </label>
                      </div>
                    </div>

                    {paymentMethod === "BKASH_BANGLA_QR" && (
                      <div className="rounded-2xl border-2 border-[#b91c1c]/30 bg-red-50/20 p-4 space-y-3.5">
                        <div className="grid gap-3.5 sm:grid-cols-2">
                          <div>
                            <label className="block text-xs font-bold text-slate-800 mb-1">
                              {t.senderLabel}
                            </label>
                            <input
                              type="tel"
                              required
                              value={senderNumber}
                              onChange={(e) => setSenderNumber(e.target.value)}
                              placeholder={t.senderPlaceholder}
                              className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs sm:text-sm font-mono font-bold text-slate-900 focus:border-[#b91c1c] focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-800 mb-1">
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
                              className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs sm:text-sm font-mono font-black text-[#1E5631] tabular-nums focus:border-[#1E5631] focus:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#C8102E] mb-1">
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
                            className="w-full rounded-xl border-2 border-[#C8102E]/50 bg-white px-3.5 py-2.5 text-sm font-mono font-black tracking-wider uppercase text-slate-950 focus:border-[#C8102E] focus:outline-none"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#1E5631] hover:bg-emerald-900 text-white font-bold text-sm sm:text-base py-6 rounded-xl shadow-md transition-all cursor-pointer"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          {t.submitting}
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <Send className="h-4 w-4" />
                          <span>
                            {paymentMethod === "BKASH_BANGLA_QR"
                              ? t.btnSubmitQr
                              : t.btnSubmitOffice}
                          </span>
                        </span>
                      )}
                    </Button>
                  </div>

                  <p className="text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5 pt-1">
                    <Lock className="h-3 w-3 text-slate-400" />
                    <span>{t.securityNote}</span>
                  </p>
                </form>
              </div>

              {/* RIGHT COLUMN (5 Cols): Live Fee Summary + Branded Bangla QR Payment Card */}
              <div className="lg:col-span-5 space-y-5">
                {/* 1. Live Fee & Discount Calculator Card */}
                <div className="rounded-3xl border-2 border-slate-900 bg-white p-6 shadow-md space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                      {t.summaryHeading}
                    </h3>
                    <span className="rounded-md bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-bold text-[#1E5631]">
                      {paymentPlan === "FULL_PAYMENT"
                        ? `${fullDiscountPercent}% OFF`
                        : "50% Installment"}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>{t.baseFeeText}</span>
                      <span className="font-bold text-slate-900 tabular-nums">
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
                      <div className="flex justify-between text-[#C8102E] font-semibold">
                        <span>
                          {t.promoDiscountText} ({appliedPromo?.code}):
                        </span>
                        <span className="tabular-nums">
                          -{formatBdt(promoDiscountBdt)}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between pt-2 border-t border-stone-100 font-bold text-slate-800">
                      <span>{t.netCourseFeeText}</span>
                      <span className="tabular-nums">
                        {formatBdt(netCourseFeeBdt)}
                      </span>
                    </div>

                    <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 flex items-center justify-between mt-2">
                      <span className="text-xs font-extrabold text-[#1E5631]">
                        {t.payableTodayText}
                      </span>
                      <span className="text-2xl font-black text-[#1E5631] tabular-nums">
                        {formatBdt(recommendedPayableToday)}
                      </span>
                    </div>

                    {paymentPlan === "INSTALLMENT_50" && (
                      <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                        <span>{t.dueLaterText}</span>
                        <span className="font-bold tabular-nums">
                          {formatBdt(netCourseFeeBdt - recommendedPayableToday)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Branded bKash Merchant & Bangla QR Card */}
                <div className="rounded-3xl border-2 border-[#e2136e]/30 bg-white p-6 shadow-md space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="inline-block rounded-md bg-[#e2136e] text-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                        {t.qrBoxBadge}
                      </span>
                      <h3 className="text-base font-extrabold text-slate-900 mt-1">
                        {t.qrBoxTitle}
                      </h3>
                    </div>
                    <QrCode className="h-7 w-7 text-[#e2136e]" />
                  </div>

                  {/* QR Image Box with Clean Interactive Fallback + Click to Enlarge */}
                  <div
                    onClick={() => setQrZoomOpen(true)}
                    className="group relative mx-auto max-w-[240px] rounded-2xl border-2 border-stone-200 bg-[#fcfaf7] p-4 text-center cursor-pointer hover:border-[#e2136e] transition"
                  >
                    {Boolean(banglaQrUrl) && !qrImgFailed ? (
                      <img
                        key={banglaQrUrl}
                        src={banglaQrUrl}
                        alt="KNLTC Official bKash Bangla QR"
                        onError={() => setQrImgFailed(true)}
                        className="mx-auto h-48 w-48 object-contain rounded-lg"
                      />
                    ) : (
                      <div className="mx-auto h-48 w-48 rounded-xl border border-dashed border-[#e2136e]/40 bg-white flex flex-col items-center justify-center p-4 space-y-2">
                        <QrCode className="h-24 w-24 text-slate-900 stroke-[1.5]" />
                        <span className="text-[11px] font-extrabold text-[#e2136e]">
                          KNLTC BANGLA QR
                        </span>
                        <span className="text-[10px] font-mono font-bold text-slate-600">
                          Merchant: {merchantNumber}
                        </span>
                      </div>
                    )}

                    <div className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] font-bold text-[#e2136e] group-hover:underline">
                      <Maximize2 className="h-3.5 w-3.5" />
                      <span>{t.qrEnlargeBtn}</span>
                    </div>
                  </div>

                  {/* Merchant Number Box */}
                  <div className="rounded-xl border border-stone-200 bg-stone-50 p-3 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-semibold text-slate-500 block">
                        {t.qrMerchantLabel}
                      </span>
                      <span className="text-sm font-black font-mono text-slate-900">
                        {merchantNumber}
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleCopyMerchant}
                      className="h-8 rounded-lg text-xs font-bold gap-1 cursor-pointer"
                    >
                      {copiedMerchant ? (
                        <Check className="h-3.5 w-3.5 text-[#1E5631]" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                      <span>{copiedMerchant ? "Copied" : "Copy"}</span>
                    </Button>
                  </div>

                  {/* 3-Step Instructions */}
                  <div className="space-y-1.5 text-xs text-slate-600 border-t border-stone-100 pt-3 leading-relaxed">
                    <p>{t.qrStep1}</p>
                    <p>{t.qrStep2}</p>
                    <p className="font-semibold text-slate-800">{t.qrStep3}</p>
                  </div>
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
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl border border-stone-200 space-y-4"
            >
              <button
                type="button"
                onClick={() => setQrZoomOpen(false)}
                className="absolute top-4 right-4 rounded-full p-1.5 text-slate-400 hover:bg-stone-100 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              <div>
                <span className="rounded-md bg-[#e2136e] text-white px-2.5 py-0.5 text-[10px] font-bold uppercase">
                  {t.qrBoxBadge}
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                  KNLTC Japan Gateway
                </h3>
                <p className="text-xs font-mono font-bold text-slate-600">
                  Merchant: {merchantNumber}
                </p>
              </div>

              <div className="rounded-2xl border-2 border-stone-200 bg-[#fcfaf7] p-5">
                {Boolean(banglaQrUrl) && !qrImgFailed ? (
                  <img
                    key={banglaQrUrl}
                    src={banglaQrUrl}
                    alt="KNLTC Bangla QR Zoomed"
                    onError={() => setQrImgFailed(true)}
                    className="mx-auto h-64 w-64 object-contain"
                  />
                ) : (
                  <div className="mx-auto h-64 w-64 flex flex-col items-center justify-center space-y-2">
                    <QrCode className="h-36 w-36 text-slate-900 stroke-[1.5]" />
                    <span className="text-xs font-bold text-[#e2136e]">
                      bKash / Bangla QR Merchant: {merchantNumber}
                    </span>
                  </div>
                )}
              </div>

              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-bold text-[#1E5631]">
                {t.payableTodayText} {formatBdt(recommendedPayableToday)}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
