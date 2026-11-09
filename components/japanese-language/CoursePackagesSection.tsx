"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  Award,
  BookOpen,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  ExternalLink,
  GraduationCap,
  Percent,
  Sparkles,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";
import {
  DEFAULT_WEBSITE_CMS,
  fetchLiveStoreFromServer,
  getWebsiteCms,
} from "@/lib/knltc-cms-store";

export type StandardCourseId =
  | "JFT_IRODORI"
  | "N5_COURSE"
  | "N4_COURSE"
  | "N5_N4_COMBO";

interface Props {
  onSelectCourse?: (courseId: StandardCourseId) => void;
}

export default function CoursePackagesSection({ onSelectCourse }: Props) {
  const { language } = useLanguage();
  // Default to JFT_IRODORI as top priority for both Student & Job Visa candidates
  const [selectedId, setSelectedId] = useState<StandardCourseId>("JFT_IRODORI");
  const [cmsPricing, setCmsPricing] = useState({
    n5PriceBdt: DEFAULT_WEBSITE_CMS.languageCoursePage.n5PriceBdt || 12000,
    n4PriceBdt: DEFAULT_WEBSITE_CMS.languageCoursePage.n4PriceBdt || 14500,
    comboPriceBdt: DEFAULT_WEBSITE_CMS.languageCoursePage.comboPriceBdt || 21500,
    jftPriceBdt: DEFAULT_WEBSITE_CMS.languageCoursePage.jftPriceBdt || 12500,
    fullPaymentDiscountPercent:
      DEFAULT_WEBSITE_CMS.languageCoursePage.fullPaymentDiscountPercent ?? 20,
    externalIrodoriUrl:
      DEFAULT_WEBSITE_CMS.languageCoursePage.externalIrodoriUrl ||
      "https://npw.bd/irodori/index.html",
  });

  useEffect(() => {
    const syncPricing = () => {
      try {
        const cms = getWebsiteCms();
        if (cms?.languageCoursePage) {
          setCmsPricing({
            n5PriceBdt: Number(cms.languageCoursePage.n5PriceBdt) || 12000,
            n4PriceBdt: Number(cms.languageCoursePage.n4PriceBdt) || 14500,
            comboPriceBdt: Number(cms.languageCoursePage.comboPriceBdt) || 21500,
            jftPriceBdt: Number(cms.languageCoursePage.jftPriceBdt) || 12500,
            fullPaymentDiscountPercent:
              cms.languageCoursePage.fullPaymentDiscountPercent ?? 20,
            externalIrodoriUrl:
              cms.languageCoursePage.externalIrodoriUrl ||
              "https://npw.bd/irodori/index.html",
          });
        }
      } catch {
        // fallback to defaults
      }
    };

    syncPricing();
    void fetchLiveStoreFromServer().then(() => {
      syncPricing();
    });

    window.addEventListener("knltc-cms-updated", syncPricing);
    window.addEventListener("storage", syncPricing);
    return () => {
      window.removeEventListener("knltc-cms-updated", syncPricing);
      window.removeEventListener("storage", syncPricing);
    };
  }, []);

  const discountPct = cmsPricing.fullPaymentDiscountPercent;

  const formatBdt = (amount: number) => {
    const rounded = Math.round(amount);
    if (language === "bn") {
      return `৳${rounded.toLocaleString("bn-BD")}`;
    }
    return `৳${rounded.toLocaleString("en-IN")}`;
  };

  const getCoursePriceData = (id: StandardCourseId) => {
    const baseFee =
      id === "JFT_IRODORI"
        ? cmsPricing.jftPriceBdt
        : id === "N5_COURSE"
          ? cmsPricing.n5PriceBdt
          : id === "N4_COURSE"
            ? cmsPricing.n4PriceBdt
            : cmsPricing.comboPriceBdt;
    const fullPayDiscountAmount = Math.round((baseFee * discountPct) / 100);
    const fullPayFee = Math.max(0, baseFee - fullPayDiscountAmount);
    const installmentFee = Math.round(baseFee / 2);
    return {
      baseFee,
      fullPayDiscountAmount,
      fullPayFee,
      installmentFee,
    };
  };

  const t = translate(
    {
      en: {
        kicker: "4 Standardized Course Packages • Official Fee & Scholarship",
        title: "Choose Your Japanese Language Package",
        subtitle:
          "Priority JFT (Irodori) & JLPT N5/N4 programs designed for both Student Visa and SSW Job Visa candidates. Flexible installment options available (negotiate with our Sales Team) OR get an instant 20% discount on Full Payment!",
        priorityTag: "#1 Priority • Student & Job Visa",
        scholarshipBadge: "100% FREE for KNLTC Student Visa COE Candidates",
        comboBadge: "Best Value Combo",
        regularFeeLabel: "Regular Course Fee",
        fullPayLabel: `Full Payment (${discountPct}% OFF)`,
        installmentBadge: `Option 1: Apply Now (Discuss & Pay) • Option 2: Enroll Now (${discountPct}% OFF or 50% Installment)`,
        syllabusHeading: "Curriculum & Syllabus Highlights",
        scheduleHeading: "Flexible Batch Schedules (Online, Paltan & Khulna)",
        materialsHeading: "100% Free Included Materials",
        benefit1: "All Textbooks (Minna No Nihongo & Irodori) & Worksheets Free",
        benefit2: "3 Career Bonus Courses Worth ৳15,000 Included Free",
        benefit3: "Official Student LMS Account (npw.bd/knltc) & HD Recordings",
        ctaEnrollFull: `Enroll Now (${discountPct}% OFF / Installment)`,
        ctaEnrollInstallment: "Apply Now (Discuss Payment Plan)",
        autoSelectNote: "Apply first to discuss payment options, or choose 'Enroll Now' for instant admission",
        tryIrodoriBtn: "Try Free Irodori Demo",
        camp1Badge: "Student Visa Special Scholarship",
        camp1Title: "100% Free JLPT N4 Course During COE Processing!",
        camp1Desc:
          "All KNLTC Student Visa candidates automatically receive the complete 3-Month JLPT N4 Course 100% FREE while their Certificate of Eligibility (COE) is being processed in Japan.",
        camp2Badge: "Zero-Advance SSW Campaign",
        camp2Title: "Passed JLPT N4 or JFT-Basic? Get Free Skill Training + Free Food & Stay in Dhaka!",
        camp2Desc:
          "Candidates who pass JLPT N4 or JFT-Basic receive 100% Free Construction Skill Training plus Free Accommodation & Meals in Dhaka under our Zero-Advance SSW Visa program.",
        camp2Cta: "Explore SSW Job Visa",
        courses: {
          JFT_IRODORI: {
            id: "JFT_IRODORI" as StandardCourseId,
            shortTab: "JFT (Irodori)",
            badge: "Top Priority • Students & SSW",
            durationShort: "/ 3 Months (150 Hrs)",
            level: "JFT-Basic & Practical Living/Workplace Japanese",
            title: "JFT (Irodori) — Spoken, Listening & Exam Mastery",
            duration: "3 Months • 150 Hours (Immigration Certified)",
            examTarget: "JFT-Basic (A2), Student Embassy Interview & SSW",
            targetAudience:
              "Top priority for BOTH Student Visa candidates (for real-life campus life, Embassy interview fluency & instant Baitō jobs) AND SSW Specified Skilled Worker Job Visa applicants.",
            highlights: [
              "Japan Foundation official 'Irodori: Japanese for Life in Japan' A1–A2 full mastery",
              "Real-life situational speaking & listening for Japanese schools, part-time jobs (Baitō) & workplaces",
              "Computer-Based Testing (CBT) simulations for JFT-Basic & NAT/JLPT listening",
              "Direct Japanese Embassy & School online interview conversational drills",
              "Includes 3 free bonus courses (Embassy Interview, JIS CV & Baitō worth ৳15,000)",
            ],
            schedules: [
              "Morning Batch: 10:00 AM – 12:00 PM (Online Live / Paltan / Khulna)",
              "Evening Batch: 07:00 PM – 09:00 PM (Online Live / Paltan / Khulna)",
              "Weekend Intensive: Friday & Saturday (Special Spoken Lab)",
            ],
            materials:
              "Japan Foundation Irodori Textbooks, Interactive Audio Lab (npw.bd/irodori), Kanji Sheets & 24/7 LMS Portal.",
          },
          N5_COURSE: {
            id: "N5_COURSE" as StandardCourseId,
            shortTab: "JLPT N5",
            badge: "Foundation • 150 Hours",
            durationShort: "/ 3 Months (150 Hrs)",
            level: "JLPT N5 & NAT-TEST 5Q (Beginner Foundation)",
            title: "JLPT N5 Complete Beginner Foundation Course",
            duration: "3 Months • 150 Hours (Mandatory Study Certificate)",
            examTarget: "JLPT N5, NAT-TEST 5Q, JCL / Top-J",
            targetAudience:
              "Designed for Student Visa applicants, TITP candidates, and complete beginners starting from zero Japanese knowledge.",
            highlights: [
              "Complete Hiragana & Katakana stroke orders, phonetics & native pronunciation",
              "103 Essential N5 Kanji characters with visual memory sheets & weekly quizzes",
              "Minna No Nihongo I (Lessons 1–25) complete vocabulary, grammar & conversation",
              "Official 150-Hour Japanese Language Study Certificate required by Japan Immigration",
              "Includes 3 free bonus courses (Embassy, CV & Baitō worth ৳15,000)",
            ],
            schedules: [
              "Morning Batch: 10:00 AM – 12:00 PM (Sun, Tue, Thu — Dhaka / Khulna / Online)",
              "Evening Batch: 07:00 PM – 09:00 PM (Sun, Tue, Thu — Dhaka / Khulna / Online)",
              "Weekend Special: Friday & Saturday (For College & Job Holders)",
            ],
            materials:
              "Minna No Nihongo I Textbook, Kanji Workbook, Grammar Sheets, Audio MP3s & LMS Portal Access.",
          },
          N4_COURSE: {
            id: "N4_COURSE" as StandardCourseId,
            shortTab: "JLPT N4",
            badge: "100% Free for KNLTC COE Students",
            durationShort: "/ 3 Months (150 Hrs)",
            level: "JLPT N4 & SSW / University Track (Intermediate)",
            title: "JLPT N4 Intermediate & SSW Job Visa Course",
            duration: "3 Months • 150 Hours",
            examTarget: "JLPT N4, NAT-TEST 4Q, JFT-Basic & SSW Skill Exams",
            targetAudience:
              "For SSW Job Visa candidates, direct University/Senmon Gakko applicants, and KNLTC Student Visa candidates (100% Free during COE processing!).",
            highlights: [
              "Minna No Nihongo II (Lessons 26–50) intermediate grammar & polite Keigo (Honorifics)",
              "250+ Intermediate Kanji characters and workplace technical vocabulary",
              "SSW Construction, Caregiver, Food Service & Agriculture interview preparation",
              "6 Full-length JLPT N4, NAT 4Q & JFT-Basic mock tests with individual review",
              "100% FREE scholarship for KNLTC Student Visa candidates during COE wait period",
            ],
            schedules: [
              "Morning Batch: 10:00 AM – 12:00 PM (Mon, Wed, Sat — Dhaka / Khulna / Online)",
              "Evening Batch: 07:00 PM – 09:00 PM (Mon, Wed, Sat — Dhaka / Khulna / Online)",
              "Weekend Intensive: Friday & Saturday",
            ],
            materials:
              "Minna No Nihongo II Textbook, Intermediate Kanji Book, SSW Question Bank & 24/7 LMS Access.",
          },
          N5_N4_COMBO: {
            id: "N5_N4_COMBO" as StandardCourseId,
            shortTab: "JLPT N5 + N4 Together",
            badge: "Complete Zero-to-N4 Combo",
            durationShort: "/ 6 Months (300 Hrs)",
            level: "Zero to JLPT N4 + JFT-Basic All-in-One Track",
            title: "JLPT N5 + N4 Together (Complete Zero-to-N4 Package)",
            duration: "6 Months • 300 Hours Comprehensive",
            examTarget: "JLPT N5 + N4, NAT 4Q & JFT-Basic Guaranteed Readiness",
            targetAudience:
              "Ideal for ambitious Student Visa & SSW candidates who want uninterrupted mastery from Hiragana to N4 certificate at a special bundled discount.",
            highlights: [
              "Complete Minna No Nihongo I & II (Lessons 1–50) + Irodori Spoken Japanese integration",
              "350+ Combined N5 & N4 Kanji mastery + daily Japanese listening & speaking lab",
              "Priority placement for Japan SSW Employer Interviews & Top Tokyo/Osaka Schools",
              "12 Full-length progressive mock exams + 1-on-1 mentorship with Senior Sensei Amir Hossen",
              "Includes all textbooks, workbooks & 3 Career Bonus Courses (worth ৳15,000) 100% Free",
            ],
            schedules: [
              "Regular Track: 3 Days/Week (Online Live / Paltan HQ / Khulna Branch)",
              "Fast-Track Intensive: 5 Days/Week (Dedicated Visa Target Batch)",
            ],
            materials:
              "Complete N5 + N4 + Irodori Full Book Set, Kanji Master Sheets, Audio Library & Lifetime LMS Access.",
          },
        },
      },
      bn: {
        kicker: "৪টি স্ট্যান্ডার্ড কোর্স প্যাকেজ • অফিশিয়াল কোর্স ফি ও স্কলারশিপ",
        title: "আপনার উপযুক্ত জাপানি ভাষা কোর্সটি বেছে নিন",
        subtitle:
          "স্টুডেন্ট ভিসা এবং SSW জব ভিসা—উভয় প্রার্থীদের জন্যই সর্বাধিক গুরুত্ব দিয়ে সাজানো JFT (Irodori) ও JLPT N5/N4 কোর্স। প্রতিটি কোর্সে কিস্তি সুবিধা (সেলস টিমের সাথে আলোচনা সাপেক্ষে) রয়েছে, আর এককালীন ফুল পেমেন্ট করলে পাচ্ছেন অতিরিক্ত ২০% ডিসকাউন্ট!",
        priorityTag: "#১ অগ্রাধিকার • স্টুডেন্ট ও জব ভিসা",
        scholarshipBadge: "KNLTC স্টুডেন্ট ভিসা (COE) প্রার্থীদের জন্য ১০০% ফ্রি",
        comboBadge: "সেরা কম্বো সাশ্রয়",
        regularFeeLabel: "নির্ধারিত রেগুলার কোর্স ফি",
        fullPayLabel: `ফুল পেমেন্ট (${discountPct}% ছাড়)`,
        installmentBadge: `অপশন ১: আবেদন করুন (আলোচনা সাপেক্ষে পেমেন্ট) • অপশন ২: এখনই এনরোল করুন`,
        syllabusHeading: "পাঠ্যক্রম ও সিলেবাসের মূল বৈশিষ্ট্যসমূহ",
        scheduleHeading: "ব্যাচ সময়সূচি (অনলাইন লাইভ ক্লাস, পল্টন ও খুলনা শাখা)",
        materialsHeading: "সম্পূর্ণ বিনামূল্যে স্টাডি ম্যাটেরিয়ালস",
        benefit1: "মিন্না নো নিহোঙ্গো ও ইরোদেরি সব পাঠ্যবই এবং লেকচার শিট ফ্রি",
        benefit2: "১৫,০০০ টাকা মূল্যের ৩টি স্পেশাল ইন্টারভিউ ও সিভি কোর্স ফ্রি",
        benefit3: "অফিশিয়াল LMS আইডি (npw.bd/knltc) ও এইচডি ক্লাস রেকর্ডিং",
        ctaEnrollFull: `এখনই এনরোল করুন (${discountPct}% ছাড় / ৫০% কিস্তি)`,
        ctaEnrollInstallment: "আবেদন করুন (আলোচনা সাপেক্ষে পেমেন্ট)",
        autoSelectNote: "পেমেন্টের ব্যাপারে আলোচনা করে পেমেন্ট করতে আবেদন করুন, অথবা এখনই এনরোল করুন",
        tryIrodoriBtn: "ফ্রি ইরোদেরি ডেমো",
        camp1Badge: "স্টুডেন্ট ভিসা স্পেশাল স্কলারশিপ",
        camp1Title: "COE প্রসেসিং চলাকালীন স্টুডেন্ট ভিসা প্রার্থীদের N4 কোর্স ১০০% ফ্রি!",
        camp1Desc:
          "KNLTC থেকে যারা স্টুডেন্ট ভিসার ফাইল প্রসেস করবেন, জাপান ইমিগ্রেশনে তাদের COE প্রসেসিং চলাকালীন সময়ে ৩ মাসের সম্পূর্ণ JLPT N4 কোর্সটি ১০০% বিনামূল্যে করানো হয়।",
        camp2Badge: "জিরো অ্যাডভান্স SSW ক্যাম্পেইন",
        camp2Title: "JLPT N4 বা JFT পাস থাকলেই ঢাকায় ফ্রি থাকা-খাওয়া ও ফ্রি স্কিল ট্রেনিং!",
        camp2Desc:
          "যাদের ইতিমধ্যে JLPT N4 অথবা JFT-Basic পাস করা আছে, তাদের জন্য আমাদের জিরো-অ্যাডভান্স SSW প্রোগ্রামের আওতায় ঢাকায় সম্পূর্ণ ফ্রি থাকা-খাওয়া এবং ফ্রি কনস্ট্রাকশন স্কিল ট্রেনিংয়ের সুবিধা রয়েছে।",
        camp2Cta: "SSW জব ভিসা বিস্তারিত",
        courses: {
          JFT_IRODORI: {
            id: "JFT_IRODORI" as StandardCourseId,
            shortTab: "JFT (Irodori)",
            badge: "সর্বাধিক কার্যকরী • স্টুডেন্ট ও SSW",
            durationShort: "/ ৩ মাস (১৫০ ঘণ্টা)",
            level: "JFT-Basic ও বাস্তব জীবন/কর্মক্ষেত্রের জাপানি ভাষা",
            title: "JFT (Irodori) — স্পোকেন, লিসেনিং ও এক্সাম স্পেশাল কোর্স",
            duration: "৩ মাস • ১৫০ ঘণ্টা নিবিড় প্রশিক্ষণ",
            examTarget: "JFT-Basic (A2), এম্বাসি/স্কুল ইন্টারভিউ ও SSW",
            targetAudience:
              "শুধুমাত্র জব ভিসা নয়—স্টুডেন্ট ভিসা প্রার্থীদের জন্যও এটি সর্বাধিক গুরুত্বপূর্ণ! জাপানে গিয়েই পার্ট-টাইম কাজ (Baitō) পাওয়া, স্কুল ও এম্বাসি ইন্টারভিউতে অনর্গল কথা বলা এবং SSW প্রার্থীদের দ্রুত জাপান যাওয়ার সেরা কোর্স।",
            highlights: [
              "জাপান ফাউন্ডেশনের অফিশিয়াল 'Irodori: Japanese for Life in Japan' (A1–A2) পূর্ণাঙ্গ অনুশীলন",
              "স্টুডেন্টদের জাপানি ক্যাম্পাস লাইফ, পার্ট-টাইম জব (Baitō) ও কর্মক্ষেত্রের রিয়েল-লাইফ কথোপকথন ও লিসেনিং",
              "কম্পিউটার ভিত্তিক (CBT) JFT-Basic এবং JLPT/NAT লিসেনিং মক টেস্ট সিমুলেশন",
              "জাপানি স্কুল অনলাইন ইন্টারভিউ ও এম্বাসি ভিসা অফিসারের সামনে স্মার্টলি জাপানি বলার প্র্যাকটিস",
              "১৫,০০০ টাকা মূল্যের ৩টি স্পেশাল বোনাস কোর্স (এম্বাসি ইন্টারভিউ, সিভি ও বাইতো) সম্পূর্ণ ফ্রি",
            ],
            schedules: [
              "সকালের ব্যাচ: ১০:০০ AM – ১২:০০ PM (অনলাইন লাইভ / পল্টন / খুলনা শাখা)",
              "সন্ধ্যার ব্যাচ: ০৭:০০ PM – ০৯:০০ PM (অনলাইন লাইভ / পল্টন / খুলনা শাখা)",
              "উইকেন্ড ইন্টেনসিভ: শুক্র ও শনিবার (স্পেশাল স্পোকেন ও লিসেনিং ল্যাব)",
            ],
            materials:
              "জাপান ফাউন্ডেশন ইরোদেরি টেক্সটবুক, ইন্টারঅ্যাক্টিভ অডিও ল্যাব (npw.bd/irodori), কাঞ্জি শিট ও ২৪/৭ LMS পোর্টাল।",
          },
          N5_COURSE: {
            id: "N5_COURSE" as StandardCourseId,
            shortTab: "JLPT N5",
            badge: "ফাউন্ডেশন • ১৫০ ঘণ্টা",
            durationShort: "/ ৩ মাস (১৫০ ঘণ্টা)",
            level: "JLPT N5 ও NAT-TEST 5Q (বিগিনার ফাউন্ডেশন)",
            title: "JLPT N5 কমপ্লিট বিগিনার ফাউন্ডেশন কোর্স",
            duration: "৩ মাস • ১৫০ ঘণ্টা (ইমিগ্রেশন বাধ্যতামূলক সার্টিফিকেট)",
            examTarget: "JLPT N5, NAT-TEST 5Q, JCL / Top-J",
            targetAudience:
              "স্টুডেন্ট ভিসা, TITP এবং যাদের জাপানি ভাষায় কোনো পূর্ব অভিজ্ঞতা নেই—তাদের একদম শূন্য (Zero Level) থেকে ১৫০ ঘণ্টা স্টাডি সার্টিফিকেটসহ পূর্ণাঙ্গ প্রস্তুতির কোর্স।",
            highlights: [
              "হিরাগানা ও কাতাকানা বর্ণমালার সঠিক স্ট্রোক অর্ডার ও নেটিভ উচ্চারণ প্র্যাকটিস",
              "১০৩টি বেসিক কাঞ্জি মেমোরি টেকনিক ও সাপ্তাহিক কুইজ প্র্যাকটিস",
              "মিন্না নো নিহোঙ্গো ১ থেকে ২৫ অধ্যায়ের পূর্ণাঙ্গ শব্দভাণ্ডার (Kotoba), ব্যাকরণ ও কথোপকথন",
              "জাপান ইমিগ্রেশনের জন্য বাধ্যতামূলক ১৫০ ঘণ্টার অফিশিয়াল ল্যাঙ্গুয়েজ স্টাডি সার্টিফিকেট",
              "১৫,০০০ টাকা মূল্যের ৩টি স্পেশাল ইন্টারভিউ ও সিভি কোর্স সম্পূর্ণ ফ্রি",
            ],
            schedules: [
              "সকালের ব্যাচ: ১০:০০ AM – ১২:০০ PM (রবি, মঙ্গল, বৃহস্পতি — ঢাকা / খুলনা / অনলাইন)",
              "সন্ধ্যার ব্যাচ: ০৭:০০ PM – ০৯:০০ PM (রবি, মঙ্গল, বৃহস্পতি — ঢাকা / খুলনা / অনলাইন)",
              "উইকেন্ড স্পেশাল: শুক্র ও শনিবার (শিক্ষার্থী ও চাকরিজীবীদের জন্য)",
            ],
            materials:
              "মিন্না নো নিহোঙ্গো ১ম খণ্ড বই, কাঞ্জি ওয়ার্কবুক, গ্রামার শিট, অডিও ফাইল ও ডিজিটাল LMS ক্লাসরুম এক্সেস।",
          },
          N4_COURSE: {
            id: "N4_COURSE" as StandardCourseId,
            shortTab: "JLPT N4",
            badge: "স্টুডেন্ট ভিসা COE প্রার্থীদের ফ্রি",
            durationShort: "/ ৩ মাস (১৫০ ঘণ্টা)",
            level: "JLPT N4 ও SSW / ইউনিভার্সিটি ট্র্যাক (ইন্টারমিডিয়েট)",
            title: "JLPT N4 ইন্টারমিডিয়েট ও SSW জব ভিসা কোর্স",
            duration: "৩ মাস • ১৫০ ঘণ্টা নিবিড় প্রশিক্ষণ",
            examTarget: "JLPT N4, NAT-TEST 4Q, JFT-Basic ও SSW স্কিল টেস্ট",
            targetAudience:
              "SSW জব ভিসা প্রার্থী, সরাসরি জাপানি কলেজ/ভার্সিটিতে আবেদনকারী এবং KNLTC-এর স্টুডেন্ট ভিসা প্রার্থীদের জন্য (COE প্রসেসিং চলাকালীন ১০০% ফ্রি!)।",
            highlights: [
              "মিন্না নো নিহোঙ্গো ২৬ থেকে ৫০ অধ্যায় ও জাপানি বিনীত ভাষা (Keigo) আয়ত্তকরণ",
              "২৫০+ ইন্টারমিডিয়েট কাঞ্জি ও জাপানি কর্মক্ষেত্রের টেকনিক্যাল শব্দভাণ্ডার",
              "SSW কনস্ট্রাকশন, কেয়ারগিভার, ফুড সার্ভিস ও এগ্রিকালচার ইন্টারভিউ প্রস্তুতি",
              "JLPT N4, NAT 4Q ও JFT-Basic স্ট্যান্ডার্ড ৬টি পূর্ণাঙ্গ মক টেস্ট ও মূল্যায়ন",
              "KNLTC স্টুডেন্ট ভিসা প্রার্থীদের COE অপেক্ষাকালীন সময়ে ১০০% ফ্রি স্কলারশিপ সুবিধা",
            ],
            schedules: [
              "সকালের ব্যাচ: ১০:০০ AM – ১২:০০ PM (সোম, বুধ, শনি — ঢাকা / খুলনা / অনলাইন)",
              "সন্ধ্যার ব্যাচ: ০৭:০০ PM – ০৯:০০ PM (সোম, বুধ, শনি — ঢাকা / খুলনা / অনলাইন)",
              "উইকেন্ড ইন্টেনসিভ: শুক্র ও শনিবার",
            ],
            materials:
              "মিন্না নো নিহোঙ্গো ২য় খণ্ড বই, ইন্টারমিডিয়েট কাঞ্জি বুক, SSW প্রশ্নব্যাংক ও ২৪/৭ LMS এক্সেস।",
          },
          N5_N4_COMBO: {
            id: "N5_N4_COMBO" as StandardCourseId,
            shortTab: "JLPT N5 + N4 Together",
            badge: "কমপ্লিট জিরো-টু-N4 কম্বো",
            durationShort: "/ ৬ মাস (৩০০ ঘণ্টা)",
            level: "শূন্য থেকে JLPT N4 + ইরোদেরি অল-ইন-ওয়ান প্যাকেজ",
            title: "JLPT N5 + N4 Together (কমপ্লিট জিরো-টু-N4 কম্বো প্যাকেজ)",
            duration: "৬ মাস • ৩০০ ঘণ্টা পূর্ণাঙ্গ প্রশিক্ষণ",
            examTarget: "JLPT N5 + N4, NAT 4Q ও JFT-Basic নিশ্চিত প্রস্তুতি",
            targetAudience:
              "যারা হিরাগানা থেকে শুরু করে একটানা N4 সার্টিফিকেট ও প্র্যাকটিক্যাল স্পোকেন জাপানিজ কমপ্লিট করে স্টুডেন্ট ভিসা বা SSW ভিসায় নিশ্চিতভাবে জাপান যেতে চান।",
            highlights: [
              "মিন্না নো নিহোঙ্গো ১ম ও ২য় খণ্ড (১–৫০ লেসন) + ইরোদেরি স্পোকেন জাপানিজের সমন্বিত মাস্টারি",
              "৩৫০+ কম্বাইন্ড N5 ও N4 কাঞ্জি + প্রতিদিন জাপানি লিসেনিং ও স্পিকিং ল্যাব",
              "জাপানি SSW এম্প্লয়ার ইন্টারভিউ এবং টোকিও/ওসাকার শীর্ষ স্কুলে অগ্রাধিকার প্লেসমেন্ট",
              "১২টি পূর্ণাঙ্গ মক টেস্ট + সিনিয়র সেন্সি আমির হোসেনের সরাসরি ওয়ান-টু-ওয়ান মেন্টরশিপ",
              "সম্পূর্ণ বুক সেট, ওয়ার্কবুক এবং ১৫,০০০ টাকার ৩টি ক্যারিয়ার বোনাস কোর্স ১০০% ফ্রি",
            ],
            schedules: [
              "রেগুলার ট্র্যাক: সপ্তাহে ৩ দিন (অনলাইন লাইভ ক্লাস / পল্টন হেড অফিস / খুলনা শাখা)",
              "ফাস্ট-ট্র্যাক ইন্টেনসিভ: সপ্তাহে ৫ দিন (স্পেশাল ভিসা টার্গেট ব্যাচ)",
            ],
            materials:
              "কমপ্লিট N5 + N4 + Irodori ফুল বুক সেট, কাঞ্জি মাস্টার শিট, অডিও লাইব্রেরি ও আজীবন LMS এক্সেস।",
          },
        },
      },
      ja: {
        kicker: "4大標準コースパッケージ • 公式受講料＆奨学金",
        title: "目的に合わせた日本語コース選択",
        subtitle:
          "留学ビザ・特定技能（SSW）双方に最優先の『JFT（いろどり）』および『JLPT N5 / N4』150時間認定講座。分割払い相談可能、一括払いならさらに20%特別割引！",
        priorityTag: "最優先推奨 • 留学＆特定技能",
        scholarshipBadge: "KNLTC留学ビザ（COE申請中）候補生は100%無料",
        comboBadge: "お得なセット割",
        regularFeeLabel: "通常コース受講料",
        fullPayLabel: `一括払い (${discountPct}%割引)`,
        installmentBadge: `方法1: 申込・支払い相談 • 方法2: 今すぐ申し込む (${discountPct}%割引 / 分割)`,
        syllabusHeading: "カリキュラム概要・学習内容",
        scheduleHeading: "クラス時間割（オンライン・ダッカ本部・クルナ支部）",
        materialsHeading: "完全無料配布教材",
        benefit1: "『みんなの日本語』＆『いろどり』全テキスト・資料無料",
        benefit2: "15,000タカ相当の面接・履歴書・バイト3大特典講座無料",
        benefit3: "公式LMSアカウント（npw.bd/knltc）＆講義録画視聴",
        ctaEnrollFull: `今すぐ申し込む（${discountPct}%割引 / 分割払い）`,
        ctaEnrollInstallment: "申込フォーム送信（相談してお支払い）",
        autoSelectNote: "支払いプランを相談してからお支払い、または今すぐ入学手続きを選択できます",
        tryIrodoriBtn: "無料いろどりデモ",
        camp1Badge: "留学ビザ特別奨学金",
        camp1Title: "COE申請期間中の留学ビザ候補生はJLPT N4講座が100%無料！",
        camp1Desc:
          "KNLTCで留学ビザ申請を行う候補生は、在留資格認定証明書（COE）審査期間中に3ヶ月間のJLPT N4コースを完全無料で受講できます。",
        camp2Badge: "初期費用ゼロ 特定技能キャンペーン",
        camp2Title: "JLPT N4またはJFT合格者はダッカでの宿泊・食事・建設実技訓練が無料！",
        camp2Desc:
          "JLPT N4またはJFT-Basic合格者は、特定技能（建設）ゼロ前払いプログラムにより、ダッカでの実技訓練および宿泊・食事が100%無料になります。",
        camp2Cta: "特定技能の詳細を見る",
        courses: {
          JFT_IRODORI: {
            id: "JFT_IRODORI" as StandardCourseId,
            shortTab: "JFT (いろどり)",
            badge: "最優先 • 留学＆特定技能",
            durationShort: "/ 3ヶ月 (150時間)",
            level: "JFT-Basic＆実践生活・職場コミュニケーション",
            title: "JFT (Irodori) — 会話・聴解・試験突破コース",
            duration: "3ヶ月 • 150時間（入管基準対応）",
            examTarget: "JFT-Basic (A2), 大使館・学校面接, 特定技能",
            targetAudience:
              "特定技能（SSW）希望者だけでなく、日本到着後すぐにアルバイト（Baitō）や学校生活で自然な会話力が必要な【留学ビザ候補生】にも最優先で推奨される実践コースです。",
            highlights: [
              "国際交流基金公式『いろどり 生活の日本語』A1〜A2完全マスター",
              "日本の学校生活、コンビニ・飲食店アルバイト、職場で即戦力となる会話・聴解特訓",
              "JFT-Basic（CBT方式）およびJLPT聴解の本番形式シミュレーション",
              "日本大使館面接・日本語学校オンライン面接での自然な受け答えロールプレイ",
              "15,000タカ相当の面接・履歴書・アルバイト3大特典講座が完全無料",
            ],
            schedules: [
              "午前クラス: 10:00〜12:00（オンライン / ダッカ本部 / クルナ支部）",
              "夜間クラス: 19:00〜21:00（オンライン / ダッカ本部 / クルナ支部）",
              "週末集中クラス: 金曜・土曜（実践会話ラボ）",
            ],
            materials:
              "国際交流基金『いろどり』教材、対話型音声デモ（npw.bd/irodori）、漢字シート、24時間LMSアクセス",
          },
          N5_COURSE: {
            id: "N5_COURSE" as StandardCourseId,
            shortTab: "JLPT N5",
            badge: "基礎 • 150時間証明",
            durationShort: "/ 3ヶ月 (150時間)",
            level: "JLPT N5・NAT-TEST 5Q（初級基礎）",
            title: "JLPT N5 初級総合マスター講座",
            duration: "3ヶ月 • 150時間（入管提出用学習証明書発行）",
            examTarget: "JLPT N5, NAT-TEST 5Q, JCL / Top-J",
            targetAudience:
              "留学ビザ申請者、技能実習生、日本語学習が全く初めての方向けの150時間認定基礎コース。",
            highlights: [
              "ひらがな・カタカナの正しい筆順とネイティブ発音指導",
              "基本漢字103字の記憶シートと毎週の確認テスト",
              "『みんなの日本語』第1課〜第25課の語彙・文法・会話を完全習得",
              "日本の出入国在留管理庁が求める「150時間日本語学習証明書」を公式発行",
              "15,000タカ相当の面接・履歴書・アルバイト3大特典講座が完全無料",
            ],
            schedules: [
              "午前クラス: 10:00〜12:00（日・火・木 — ダッカ / クルナ / オンライン）",
              "夜間クラス: 19:00〜21:00（日・火・木 — ダッカ / クルナ / オンライン）",
              "週末特別クラス: 金曜・土曜",
            ],
            materials:
              "『みんなの日本語』第1巻、漢字ワークブック、文法シート、音声データ、公式LMSアカウント",
          },
          N4_COURSE: {
            id: "N4_COURSE" as StandardCourseId,
            shortTab: "JLPT N4",
            badge: "COE待機留学生は100%無料",
            durationShort: "/ 3ヶ月 (150時間)",
            level: "JLPT N4・特定技能 / 大学進学トラック",
            title: "JLPT N4 中級＆特定技能・進学総合講座",
            duration: "3ヶ月 • 150時間",
            examTarget: "JLPT N4, NAT-TEST 4Q, JFT-Basic, 特定技能試験",
            targetAudience:
              "特定技能（SSW）就労希望者、大学・専門学校進学希望者、およびKNLTC留学ビザCOE待機生（受講料100%無料！）。",
            highlights: [
              "『みんなの日本語』第26課〜第50課および丁寧語・敬語表現の習得",
              "中級漢字250字以上と日本の職場・学校で使われる実務語彙",
              "特定技能（建設・介護・外食・農業）採用面接および技能試験対策",
              "JLPT N4・NAT 4Q・JFT-Basicの本番形式模擬試験6回",
              "KNLTC留学ビザ候補生はCOE審査期間中100%無料で受講可能",
            ],
            schedules: [
              "午前クラス: 10:00〜12:00（月・水・土 — ダッカ / クルナ / オンライン）",
              "夜間クラス: 19:00〜21:00（月・水・土 — ダッカ / クルナ / オンライン）",
              "週末集中クラス: 金曜・土曜",
            ],
            materials:
              "『みんなの日本語』第2巻、中級漢字ブック、特定技能問題集、24時間LMSアクセス",
          },
          N5_N4_COMBO: {
            id: "N5_N4_COMBO" as StandardCourseId,
            shortTab: "JLPT N5 + N4 セット",
            badge: "ゼロからN4一貫セット",
            durationShort: "/ 6ヶ月 (300時間)",
            level: "ゼロからJLPT N4＋実践いろどり一貫マスター",
            title: "JLPT N5 + N4 一貫総合パッケージ（6ヶ月・300時間）",
            duration: "6ヶ月 • 300時間 徹底指導",
            examTarget: "JLPT N5 + N4, NAT 4Q, JFT-Basic 完全合格保証",
            targetAudience:
              "ひらがなからスタートし、N4合格と実践会話力まで一気に習得したい留学・特定技能候補生向けの特別割引パッケージ。",
            highlights: [
              "『みんなの日本語』第1〜50課＋『いろどり』実践会話の統合カリキュラム",
              "N5・N4漢字350字以上＋毎日のリスニング＆スピーキング特訓",
              "日本の受入企業面接および東京・大阪優良校への優先推薦枠",
              "模擬試験12回＋アミール・ホセン主任講師による個別メンタリング",
              "全テキスト・問題集および15,000タカ相当の3大特典講座が100%無料",
            ],
            schedules: [
              "通常コース: 週3日（オンラインライブ / ダッカ本部 / クルナ支部）",
              "短期集中コース: 週5日（ビザ優先選抜クラス）",
            ],
            materials:
              "N5＋N4＋いろどり全教材セット、漢字マスターシート、音声ライブラリ、無期限LMSアクセス",
          },
        },
      },
    },
    language,
  );

  const courseOrder: StandardCourseId[] = [
    "JFT_IRODORI",
    "N5_COURSE",
    "N4_COURSE",
    "N5_N4_COMBO",
  ];

  const activeCourse = t.courses[selectedId] || t.courses.JFT_IRODORI;
  const activePricing = getCoursePriceData(activeCourse.id);

  const getCourseSlug = (courseId: StandardCourseId): string => {
    switch (courseId) {
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
  };

  const getCourseEnrollUrl = (
    courseId: StandardCourseId,
    paymentPlan: "FULL_PAYMENT" | "INSTALLMENT_50" = "FULL_PAYMENT",
  ) => {
    const slug = getCourseSlug(courseId);
    const planQuery = paymentPlan === "INSTALLMENT_50" ? "installment" : "full";
    return `/japanese-language/enroll/${slug}?plan=${planQuery}`;
  };

  const handleApply = (
    courseId: StandardCourseId,
    paymentPlan: "FULL_PAYMENT" | "INSTALLMENT_50" = "FULL_PAYMENT",
  ) => {
    setSelectedId(courseId);
    if (onSelectCourse) {
      onSelectCourse(courseId);
    }
    if (typeof window !== "undefined") {
      window.location.href = getCourseEnrollUrl(courseId, paymentPlan);
    }
  };

  return (
    <section
      id="course-options"
      className="py-16 md:py-22 bg-white border-b border-stone-200 scroll-mt-14"
    >
      <div className="container-narrow">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <p className="text-xs font-bold tracking-widest text-[#b91c1c] uppercase">
            {t.kicker}
          </p>
          <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-relaxed">
            {t.title}
          </h2>
          <p className="mt-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* 4 Standardized Course Overview Cards (Quick Comparison + 1-Click Switch) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {courseOrder.map((cId) => {
            const c = t.courses[cId];
            const p = getCoursePriceData(cId);
            const isSelected = selectedId === cId;
            const isIrodori = cId === "JFT_IRODORI";

            return (
              <div
                key={cId}
                onClick={() => setSelectedId(cId)}
                className={`rounded-2xl border p-5 transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? isIrodori
                      ? "border-2 border-[#1E5631] bg-emerald-50/30 shadow-md"
                      : "border-2 border-[#b91c1c] bg-red-50/20 shadow-md"
                    : "border-stone-200 bg-[#fcfaf7] hover:border-stone-300 hover:bg-white shadow-2xs"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md ${
                        isIrodori
                          ? "bg-[#1E5631] text-white"
                          : cId === "N4_COURSE"
                            ? "bg-emerald-100 text-[#1E5631]"
                            : "bg-red-50 text-[#b91c1c] border border-red-200/70"
                      }`}
                    >
                      {c.badge}
                    </span>
                    {isIrodori && (
                      <Star className="h-4 w-4 text-amber-500 fill-amber-500 shrink-0" />
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-relaxed">
                    {c.shortTab}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                    {c.duration}
                  </p>

                  {/* Pricing Box inside summary card */}
                  <div className="mt-4 pt-3 border-t border-stone-200/80 space-y-1">
                    <div className="flex items-baseline justify-between">
                      <span className="text-[11px] text-slate-500">
                        {t.regularFeeLabel}:
                      </span>
                      <span className="text-xs font-bold text-slate-500 line-through tabular-nums">
                        {formatBdt(p.baseFee)}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-[11px] font-bold text-[#1E5631]">
                        {t.fullPayLabel}:
                      </span>
                      <span className="text-lg font-black text-slate-950 tabular-nums">
                        {formatBdt(p.fullPayFee)}
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  href={getCourseEnrollUrl(cId, "FULL_PAYMENT")}
                  onClick={(e) => e.stopPropagation()}
                  className={`mt-4 w-full rounded-xl py-2.5 px-3 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? isIrodori
                        ? "bg-[#1E5631] text-white hover:bg-emerald-900"
                        : "bg-[#b91c1c] text-white hover:bg-red-800"
                      : "bg-white border border-stone-300 text-slate-800 hover:bg-stone-100"
                  }`}
                >
                  <span>
                    {language === "bn"
                      ? `${c.shortTab} ভর্তি`
                      : language === "ja"
                        ? `${c.shortTab} 申込`
                        : `Enroll ${c.shortTab}`}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Detailed Course Explorer Panel for Selected Package */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCourse.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="rounded-3xl border border-stone-200/90 bg-[#fcfaf7] p-6 sm:p-9 shadow-xs"
          >
            <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
              {/* Left Column (7 cols): Syllabus, Highlights & Schedule */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2.5">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                        activeCourse.id === "JFT_IRODORI"
                          ? "bg-[#1E5631] text-white"
                          : "text-[#b91c1c] bg-red-50 border border-red-200/80"
                      }`}
                    >
                      {activeCourse.level}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-600 font-medium bg-white border border-stone-200 px-2.5 py-1 rounded-md">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      <span>{activeCourse.duration}</span>
                    </span>
                    <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
                      {activeCourse.examTarget}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-relaxed">
                    {activeCourse.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                    {activeCourse.targetAudience}
                  </p>
                </div>

                {/* Syllabus Highlights */}
                <div className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6 shadow-2xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-[#b91c1c]" />
                      <span>{t.syllabusHeading}</span>
                    </h4>
                    {activeCourse.id === "JFT_IRODORI" && (
                      <a
                        href={cmsPricing.externalIrodoriUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#1E5631] hover:underline"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>{t.tryIrodoriBtn}</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                    {activeCourse.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <Check className="h-4 w-4 text-[#15803d] shrink-0 mt-0.5 stroke-[2.5]" />
                        <span className="leading-relaxed">{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Schedules & Inclusions Grid */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-2xs">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-[#15803d]" />
                      <span>{t.scheduleHeading}</span>
                    </h5>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {activeCourse.schedules.map((sc, i) => (
                        <li key={i} className="flex items-start gap-1.5 leading-relaxed">
                          <span className="text-slate-400 font-bold">•</span>
                          <span>{sc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-2xs">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-1.5">
                      <GraduationCap className="h-4 w-4 text-slate-800" />
                      <span>{t.materialsHeading}</span>
                    </h5>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {activeCourse.materials}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column (5 cols): Pricing Breakdown (Full Pay 20% Off vs 50% Installment) */}
              <div className="lg:col-span-5">
                <div className="rounded-2xl border-2 border-slate-900 bg-white p-6 sm:p-7 shadow-md">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#b91c1c]">
                      {activeCourse.shortTab}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-bold text-[#1E5631]">
                      <Percent className="h-3 w-3" />
                      <span>{t.fullPayLabel}</span>
                    </span>
                  </div>

                  {/* Full Payment 20% OFF Box */}
                  <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
                    <div className="flex items-baseline justify-between gap-2">
                      <div>
                        <span className="text-xs font-bold text-[#1E5631] block">
                          {t.fullPayLabel}
                        </span>
                        <span className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight tabular-nums">
                          {formatBdt(activePricing.fullPayFee)}
                        </span>
                        <span className="text-xs text-slate-500 font-medium ml-1">
                          {activeCourse.durationShort}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-400 line-through block tabular-nums">
                          {formatBdt(activePricing.baseFee)}
                        </span>
                        <span className="text-[11px] font-bold text-[#b91c1c] tabular-nums">
                          -{formatBdt(activePricing.fullPayDiscountAmount)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Option 2: Submit Form & Pay Later After Sales Team Consultation */}
                  <div className="mt-3 rounded-xl border border-stone-200 bg-[#fcfaf7] p-3.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-800 block">
                        {t.regularFeeLabel}: {formatBdt(activePricing.baseFee)}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {language === "bn"
                          ? "আগে ফর্ম সাবমিট করুন • সেলস টিমের সাথে কথা বলে পরে পেমেন্ট করুন"
                          : language === "ja"
                            ? "フォーム送信後、営業チームと相談して後払い可能"
                            : "Submit form first • Discuss with Sales Team & pay later"}
                      </span>
                    </div>
                    <CheckCircle2 className="h-4 w-4 text-[#15803d] shrink-0" />
                  </div>

                  {/* 3 Localized Included Benefits */}
                  <div className="mt-5 space-y-2.5 text-xs text-slate-700 pb-5 border-b border-stone-100">
                    <div className="flex items-start gap-2">
                      <Check className="h-3.5 w-3.5 text-[#15803d] stroke-[2.5] shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{t.benefit1}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-3.5 w-3.5 text-[#15803d] stroke-[2.5] shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{t.benefit2}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-3.5 w-3.5 text-[#15803d] stroke-[2.5] shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{t.benefit3}</span>
                    </div>
                  </div>

                  {/* Dual Action Buttons: Direct Purchase (20% Off) vs Submit Form & Pay Later */}
                  <div className="mt-5 space-y-2.5">
                    <Button
                      asChild
                      className="w-full py-6 rounded-xl bg-[#1E5631] hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm shadow-xs active:scale-[0.98] transition-transform cursor-pointer"
                    >
                      <Link href={getCourseEnrollUrl(activeCourse.id, "INSTALLMENT_50")}>
                        <span>{t.ctaEnrollInstallment}</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>

                    <Button
                      asChild
                      variant="outline"
                      className="w-full py-5 rounded-xl border-2 border-[#b91c1c] bg-red-50/30 hover:bg-red-50 text-[#b91c1c] font-bold text-xs sm:text-sm active:scale-[0.98] transition-transform cursor-pointer"
                    >
                      <Link href={getCourseEnrollUrl(activeCourse.id, "FULL_PAYMENT")}>
                        <span>
                          {t.ctaEnrollFull} — {formatBdt(activePricing.fullPayFee)}
                        </span>
                      </Link>
                    </Button>

                    <p className="text-center text-[11px] text-slate-500 pt-1">
                      {t.autoSelectNote}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Special Scholarships & Zero-Advance SSW Campaign Banners */}
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {/* 1. Student Visa N4 100% Free Scholarship */}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6 flex flex-col justify-between shadow-2xs">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1E5631]">
                <Award className="h-4 w-4" />
                <span>{t.camp1Badge}</span>
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-relaxed">
                {t.camp1Title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {t.camp1Desc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-emerald-200/70 flex items-center justify-between">
              <span className="text-xs font-bold text-[#1E5631]">
                Value: {formatBdt(cmsPricing.n4PriceBdt)} — 100% Waived
              </span>
              <Link
                href={getCourseEnrollUrl("N5_COURSE", "FULL_PAYMENT")}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#1E5631] hover:underline"
              >
                <span>Enroll Now</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* 2. JLPT N4 / JFT Passed Zero-Advance SSW Campaign */}
          <div className="rounded-2xl border border-red-200 bg-red-50/50 p-6 flex flex-col justify-between shadow-2xs">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C8102E]">
                <Building2 className="h-4 w-4" />
                <span>{t.camp2Badge}</span>
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-relaxed">
                {t.camp2Title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {t.camp2Desc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-red-200/70 flex items-center justify-between">
              <span className="text-xs font-bold text-[#C8102E]">
                Zero Advance Service Charge
              </span>
              <Link
                href="/work-in-japan"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#C8102E] hover:underline"
              >
                <span>{t.camp2Cta}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
