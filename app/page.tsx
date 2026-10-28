"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";
import {
  ArrowRight,
  Award,
  Banknote,
  BookCheck,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  ExternalLink,
  FileCheck2,
  Globe2,
  GraduationCap,
  Handshake,
  Home,
  Landmark,
  Languages,
  MessageCircle,
  PhoneCall,
  Plane,
  Quote,
  Scale,
  ShieldCheck,
  Star,
  Users,
  Wrench,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";
import { useKnlTcCms } from "@/hooks/use-knltc-cms";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export default function HomePage() {
  const { language } = useLanguage();
  const { cms } = useKnlTcCms();
  const [campaignDismissed, setCampaignDismissed] = useState(false);

  const livePhoneDisplay = cms?.contactHotline || siteConfig.phoneDisplay;
  const livePhoneHref = `tel:${livePhoneDisplay.replace(/\s+/g, "")}`;
  const liveWaNumber = (cms?.contactWhatsApp || "8801805013633").replace(/\D/g, "");
  const liveWaHref = `https://wa.me/${liveWaNumber}`;
  const liveLmsUrl = cms?.languageCoursePage?.externalLmsUrl || "https://npw.bd/knltc";

  const t = translate(
    {
      en: {
        kicker: "KNLTC • Japan Education & Career Consultancy",
        headline: "Your Trusted Gateway to Higher Study, Career & Visa in Japan",
        subtitle:
          "Student visa, SSW job visa, TITP technical training, Japanese language mastery (N5–N1), skill qualification, and Embassy visa interview preparation—all under one roof at KNLTC Dhaka & Khulna.",
        c1: "Book Free Consultation",
        c2: "Japanese Language Course",
        waBtn: "Talk on WhatsApp",
        hotlineLabel: "Hotline:",
        portalCardKicker: "Dhaka & Khulna Gateway",
        portalCardTitle: "Study, Work & Japanese Language",
        portalCardSub: "Official KNLTC Japan Admissions & Career Liaison",
        portalTag1: "1,200+ Visas",
        portalTag2: "98% Pass Rate",
        portalTag3: "LMS Digital",
        portalLmsBtn: "Enter Student LMS Classroom",
        pathKicker: "Pathways to Japan",
        pathHeading: "Three Core Pathways to Your Journey in Japan",
        pathSub: "Select the ideal program based on your academic background and professional aspirations.",
        guidelineKicker: "Ethical & Bangladesh-Centric Standards",
        guidelineTitle: "Transparent Process & Bangladesh-Focused Guidelines",
        guidelineSub: "Legally bound on BDT 300 Judicial Stamp with zero advance service fee before Pre-Visa (COE) approval.",
        guidelineCards: [
          {
            icon: Scale,
            title: "Transparent Process (স্বচ্ছ প্রসেস)",
            subtitle: "100% Open-Book Legal Contract",
            items: [
              "Written legal agreement on BDT 300 Government Judicial Stamp",
              "Zero file-opening fee or hidden advance charges before COE",
              "Direct tuition payment from student's own bank to the Japanese school",
              "Written guarantee for safe return of original academic certificates",
            ],
          },
          {
            icon: Landmark,
            title: "Bangladesh-Centric Guideline (বাংলাদেশ কেন্দ্রীক গাইডলাইন)",
            subtitle: "Tailored for Bangladeshi Students & Sponsors",
            items: [
              "Complete BDT 18 Lakh sponsor solvency & tax file preparation support",
              "Education bank loan guidance via Agrani, Social Islami & Pubali Bank",
              "3 Free Bonus Courses (Embassy Interview, Japanese CV & Part-Time Job)",
              "Free N4 Japanese Course during the 3-month COE waiting period",
            ],
          },
          {
            icon: ShieldCheck,
            title: "Direct Japan School & Employer Tie-Ups",
            subtitle: "Accredited Institutions Across 16+ Cities",
            items: [
              "Direct representation with HLA Gakuin Hiroshima & 25+ Japanese academies",
              "No middleman or sub-broker markups on school selection fees",
              "Dedicated mock interviews with native & Japan-returned sensei",
              "Regular (BDT 1.20L post-visa) & All-in-One Premium (BDT 11L) packages",
            ],
          },
        ],
        supportKicker: "KNLTC One-Stop Solution",
        supportTitle: "Everything You Need for Japan — All in One Place",
        supportSub:
          "From language mastery to Certificate of Eligibility (COE) filing, financial sponsor auditing, and continuous post-arrival care in Japan.",
        afterArrivalKicker: "Continuous On-Ground Care in Japan",
        afterArrivalTitle: "After-Arrival Support: Our Commitment Continues Long After You Land",
        afterArrivalSub:
          "Unlike agencies whose responsibility ends at the airport, KNLTC's Japan on-ground team supports your settlement, legal registration, banking, and 28 hrs/week part-time employment throughout your student life.",
        afterArrivalItems: [
          {
            icon: Plane,
            title: "Airport Reception & Transit",
            desc: "Direct pick-up from Narita, Haneda, Kansai, or Hiroshima airport and safe escort to your dormitory.",
          },
          {
            icon: Home,
            title: "Safe Student Hostel & Housing",
            desc: "Pre-arranged affordable student dormitories or shared apartments near your school and train station.",
          },
          {
            icon: Building2,
            title: "Ward / City Office Registration",
            desc: "In-person assistance with Residence Card address registration (Juminhyo) and National Health Insurance.",
          },
          {
            icon: Landmark,
            title: "Bank Account & Japanese SIM",
            desc: "Guided setup of your Japan Post (Yuucho) student bank account and mobile voice/data SIM card.",
          },
          {
            icon: BriefcaseBusiness,
            title: "Ongoing 28 Hrs/Week Job Support",
            desc: "Continuous Baitō job referrals, Japanese interview prep, and workplace support for legal 28 hrs/week income.",
          },
        ],
        oppKicker: "Active Intakes & Career Openings",
        oppTitle: "Current Visa & Career Opportunities",
        oppSub: "Ongoing intakes across Japan government-approved study and employment sectors.",
        processKicker: "Systematic Roadmap",
        processTitle: "5-Step Pathway to Japan",
        processSub: "Transparent, step-by-step guidance with clear financial and lifestyle milestones.",
        trustKicker: "Track Record & Legal Credentials",
        trustTitle: "Start Your Japan Journey with Proven Trust",
        licenseBadge: "Official Government Trade License & Legal Stamp Protection",
        licenseTitle: "Government Registered Consultancy • Dhaka & Khulna",
        licenseDesc:
          "Every student and SSW file at KNLTC is protected by a BDT 300 Government Judicial Stamp agreement with full receipt transparency.",
        trustpilotCta: "Verify Reviews on Trustpilot (knltc.com)",
        testimonialsKicker: "Verified Student Stories",
        testimonialsTitle: "What Our Students & Visa Holders Say",
        finalKicker: "Start Your Application Today",
        finalTitle: "Ready to Begin Your Japan Journey?",
        finalSub: "Speak directly with our senior counseling team to evaluate your profile and plan your roadmap.",
        applyBtn: "Apply Now",
        salaryLabel: "Salary / Benefits",
        eligibilityLabel: "Requirements",
        stepLabel: "Step",
        badgeOpen: "Application Open",
        viewDetails: "View Details",
        verifiedStep: "Verified Milestone",
        pathways: [
          {
            icon: GraduationCap,
            title: "Study in Japan (Student Visa)",
            desc: "Language academies, bachelor's, and master's degree programs. Complete COE filing, scholarship mentoring, and visa guidance.",
            cta: "Explore Student Visa",
            href: "/study-in-japan",
            highlight: "0 BDT Advance File Open",
          },
          {
            icon: BriefcaseBusiness,
            title: "Work in Japan (SSW & TITP)",
            desc: "Specified Skilled Worker visas in Construction, Caregiving, Agriculture, and Food Service with official employer contracts.",
            cta: "Explore Job Visas",
            href: "/work-in-japan",
            highlight: "¥180k–¥245k / Month",
          },
          {
            icon: Languages,
            title: "Japanese Language Course (N5–N1)",
            desc: "Targeted JLPT, NAT-TEST, and JFT preparation. Digital LMS classroom plus 3 free bonus interview courses.",
            cta: "View Courses & Enroll",
            href: "/japanese-language",
            highlight: "3 Free Bonus Courses",
          },
        ],
        supportPillars: [
          {
            icon: Languages,
            title: "Language Mastery Program",
            desc: "Structured N5 to N1 preparation led by certified bilingual and native Japanese sensei.",
          },
          {
            icon: Wrench,
            title: "SSW Skill Test Training",
            desc: "Specialized training for Prometric SSW qualification tests in Construction, Caregiving, Food Service, and Agriculture.",
          },
          {
            icon: FileCheck2,
            title: "Flawless Documentation",
            desc: "18 Lakh BDT sponsorship auditing, tax documents, and complete Certificate of Eligibility (COE) filing.",
          },
          {
            icon: Users,
            title: "Embassy Interview Coaching",
            desc: "Live camera mock interviews, study motivation (Shibou Douki) audit, and visa officer etiquette.",
          },
          {
            icon: Handshake,
            title: "School & Employer Matching",
            desc: "Direct liaison with HLA Gakuin Hiroshima and licensed Japanese accepting companies.",
          },
          {
            icon: Globe2,
            title: "Long-Term Settlement Care",
            desc: "Airport reception, ward office registration, SIM, Yuucho bank account, and ongoing 28 hrs/week job support.",
          },
        ],
        processSteps: [
          {
            num: "01",
            icon: ClipboardCheck,
            title: "Profile & Eligibility Audit",
            desc: "Free assessment of your GPA (>= 2.5), study gap, and 300 BDT stamp agreement with 0 BDT file opening fee.",
            meta: "Cost: ৳0 File Opening",
          },
          {
            num: "02",
            icon: BookCheck,
            title: "Language & 3 Free Bonus Courses",
            desc: "Intensive N5/N4 classes in Dhaka/Khulna + 24/7 LMS portal and 3 free interview/CV/Baitō courses.",
            meta: "Course: ৳12,000 + 3 Free",
          },
          {
            num: "03",
            icon: Landmark,
            title: "COE & 18L Sponsor Audit",
            desc: "Sponsor bank solvency (18L BDT) or bank loan setup and flawless COE submission to Japan Immigration.",
            meta: "Free N4 During COE Wait",
          },
          {
            num: "04",
            icon: ShieldCheck,
            title: "Embassy Interview & Visa",
            desc: "Camera mock interview training, tuition transfer after COE, and VFS visa stamping.",
            meta: "Pay Service Fee After Visa",
          },
          {
            num: "05",
            icon: Plane,
            title: "Japan Arrival & 28h/wk Job",
            desc: "Airport pickup, hostel check-in, city office & bank setup, and ongoing 28 hrs/week part-time job placement.",
            meta: "Earn ~৳1.20L+ / Month",
          },
        ],
        trustStats: [
          {
            num: "1,200+",
            label: "Japan Visas Secured",
            sub: "Student and SSW visas issued successfully",
            icon: Award,
          },
          {
            num: "98%",
            label: "JLPT / NAT Pass Rate",
            sub: "First-attempt success with certified teachers",
            icon: BookCheck,
          },
          {
            num: "25+",
            label: "Partner Schools in Japan",
            sub: "Direct ties including HLA Gakuin Hiroshima",
            icon: Globe2,
          },
          {
            num: "100%",
            label: "Stamp-Bound Transparency",
            sub: "No hidden fees, legal BDT 300 stamp contract",
            icon: ShieldCheck,
          },
        ],
      },
      bn: {
        kicker: "KNLTC • জাপান এডুকেশন অ্যান্ড ক্যারিয়ার কনসালটেন্সি",
        headline: "জাপানে উচ্চশিক্ষা, ক্যারিয়ার ও স্থায়ী ভিসার বিশ্বস্ত প্রবেশদ্বার",
        subtitle:
          "স্টুডেন্ট ভিসা, SSW জব ভিসা, TITP টেকনিক্যাল ইন্টার্নশিপ, জাপানি ভাষা শিক্ষা (N5–N1), প্র্যাকটিক্যাল স্কিল ও জাপান এম্বাসি ইন্টারভিউ প্রস্তুতি—সবকিছু KNLTC ঢাকা ও খুলনা শাখায় এক ছাদের নিচে।",
        c1: "ফ্রি কাউন্সেলিং বুক করুন",
        c2: "জাপানি ভাষা কোর্স",
        waBtn: "হোয়াটসঅ্যাপে পরামর্শ",
        hotlineLabel: "হটলাইন:",
        portalCardKicker: "ঢাকা ও খুলনা সেন্ট্রাল গেটওয়ে",
        portalCardTitle: "উচ্চশিক্ষা, ক্যারিয়ার ও জাপানি ভাষা",
        portalCardSub: "KNLTC অফিশিয়াল জাপান এডমিশন ও ভিসা উইং",
        portalTag1: "১,২০০+ ভিসা",
        portalTag2: "৯৮% পাসের হার",
        portalTag3: "ডিজিটাল LMS",
        portalLmsBtn: "LMS ক্লাসরুমে প্রবেশ করুন",
        pathKicker: "জাপান যাত্রার পথসমূহ",
        pathHeading: "জাপান গমনের তিনটি মূল পাথওয়ে",
        pathSub: "আপনার শিক্ষাগত যোগ্যতা ও ক্যারিয়ারের লক্ষ্যের সাথে মানানসই সেরা প্রোগ্রামটি বেছে নিন।",
        guidelineKicker: "শতভাগ সততা ও বাংলাদেশ-কেন্দ্রিক নীতিমালা",
        guidelineTitle: "স্বচ্ছ প্রসেস ও বাংলাদেশ কেন্দ্রীক গাইডলাইন",
        guidelineSub: "৩০০ টাকার সরকারি জুডিশিয়াল স্ট্যাম্পে আইনি চুক্তি এবং ভিসা/COE আসার পূর্বে কোনো অগ্রিম সার্ভিস চার্জ নেই।",
        guidelineCards: [
          {
            icon: Scale,
            title: "স্বচ্ছ প্রসেস (Transparent Process)",
            subtitle: "১০০% ওপেন-বুক আইনি চুক্তি ও নিরাপত্তা",
            items: [
              "৩০০ টাকার সরকারি স্ট্যাম্পে লিখিত আইনি চুক্তিবদ্ধ প্রক্রিয়া",
              "প্রি-ভিসা (COE) বা ভিসার পূর্বে কোনো ফাইল ওপেনিং বা অগ্রিম সার্ভিস চার্জ নেই",
              "শিক্ষার্থীর নিজস্ব ব্যাংক অ্যাকাউন্ট থেকে জাপানি স্কুলের ব্যাংকে সরাসরি টিউশন ফি প্রদান",
              "অরিজিনাল সার্টিফিকেট ও ডকুমেন্টস নিরাপদে ফেরতের লিখিত গ্যারান্টি",
            ],
          },
          {
            icon: Landmark,
            title: "বাংলাদেশ কেন্দ্রীক গাইডলাইন",
            subtitle: "বাংলাদেশি শিক্ষার্থী ও অভিভাবকদের বাস্তবসম্মত সহায়তা",
            items: [
              "১৮ লক্ষ টাকার স্পন্সর ব্যাংক সলভেন্সি, ট্যাক্স রিটার্ন ও ডকুমেন্টস প্রস্তুতিতে পূর্ণ সহায়তা",
              "অগ্রণী, সোস্যাল ইসলামী ও পূবালী ব্যাংকের মাধ্যমে এডুকেশন ব্যাংক লোন গাইডলাইন",
              "N5 শেষে ৩টি প্রিমিয়াম কোর্স সম্পূর্ণ ফ্রি (এম্বাসি ইন্টারভিউ, জাপানিজ সিভি ও পার্ট-টাইম জব)",
              "COE অপেক্ষার ৩ মাসে সম্পূর্ণ বিনামূল্যে জাপানি ভাষা N4 কোর্স করার সুবিধা",
            ],
          },
          {
            icon: ShieldCheck,
            title: "জাপানি স্কুল ও কোম্পানির সরাসরি সংযোগ",
            subtitle: "মধ্যস্বত্বভোগী ছাড়া সরাসরি ফাইল প্রসেসিং",
            items: [
              "HLA Gakuin Hiroshima সহ জাপানের ২৫+ অনুমোদিত শিক্ষা প্রতিষ্ঠানের সরাসরি পার্টনারশিপ",
              "কোনো সাব-এজেন্ট বা ব্রোকার ছাড়া সরাসরি জাপানি প্রতিষ্ঠানে জুম ইন্টারভিউ",
              "সিনিয়র সেন্সি আমির হোসেন ও নেটিভ টিমের তত্ত্বাবধানে ক্যামেরা মক ইন্টারভিউ",
              "রেগুলার প্যাকেজ (ভিসার পর ৳১,২০,০০০) ও অল-ইন-ওয়ান প্রিমিয়াম প্যাকেজ (৳১১,০০,০০০)",
            ],
          },
        ],
        supportKicker: "KNLTC ওয়ান-স্টপ সমাধান",
        supportTitle: "জাপান যাত্রার যাবতীয় প্রস্তুতি — এক ছাদের নিচে",
        supportSub:
          "ভাষা শিক্ষা থেকে শুরু করে COE ফাইল তৈরি, স্পন্সর অডিট ও জাপানে পৌঁছানোর পর দীর্ঘমেয়াদি সার্বিক সহযোগিতা।",
        afterArrivalKicker: "জাপানে পৌঁছানোর পর দীর্ঘমেয়াদি দায়িত্ব",
        afterArrivalTitle: "আফটার-অ্যারাইভাল সাপোর্ট: জাপানে পৌঁছানোর প্রথম দিনেই আমাদের দায়িত্ব শেষ নয়",
        afterArrivalSub:
          "অনেক এজেন্সির কাজ বিমানবন্দর পর্যন্ত সীমাবদ্ধ থাকলেও KNLTC-এর জাপান টিম আপনার আবাসন, সিটি অফিস রেজিস্ট্রেশন, ব্যাংক অ্যাকাউন্ট এবং সপ্তাহে ২৮ ঘণ্টার পার্ট-টাইম কাজ পাওয়া পর্যন্ত দীর্ঘমেয়াদি পাশে থাকে।",
        afterArrivalItems: [
          {
            icon: Plane,
            title: "এয়ারপোর্ট পিক-আপ ও নিরাপদ ট্রানজিট",
            desc: "নারিতা, হানেদা, কানসাই বা হিরোশিমা বিমানবন্দর থেকে সরাসরি রিসিভ করে নিরাপদে ডরমেটরিতে পৌঁছে দেওয়া।",
          },
          {
            icon: Home,
            title: "নিরাপদ স্টুডেন্ট হোস্টেল ও আবাসন",
            desc: "স্কুল ও ট্রেন স্টেশনের কাছে সাশ্রয়ী স্টুডেন্ট ডরমেটরি বা শেয়ার্ড অ্যাপার্টমেন্টের অগ্রিম ব্যবস্থা।",
          },
          {
            icon: Building2,
            title: "সিটি অফিস ও হেলথ ইন্স্যুরেন্স রেজিস্ট্রেশন",
            desc: "জাপানে পৌঁছানোর ১৪ দিনের মধ্যে ওয়ার্ড/সিটি অফিসে রেসিডেন্স কার্ড (Juminhyo) ও হেলথ ইন্স্যুরেন্স নিবন্ধনে প্রত্যক্ষ সহায়তা।",
          },
          {
            icon: Landmark,
            title: "ব্যাংক অ্যাকাউন্ট ও জাপানিজ সিম কার্ড",
            desc: "জাপান পোস্ট ব্যাংক (Yuucho Bank) স্টুডেন্ট অ্যাকাউন্ট খোলা এবং ভয়েস/ডাটা সিম কার্ড সংগ্রহে সরাসরি গাইড।",
          },
          {
            icon: BriefcaseBusiness,
            title: "সপ্তাহে ২৮ ঘণ্টা পার্ট-টাইম জব সাপোর্ট",
            desc: "বৈধ ওয়ার্ক পারমিটে (সপ্তাহে ২৮ ঘণ্টা, ছুটিতে ৪০ ঘণ্টা) কনভিনিয়েন্স স্টোর, রেস্তোরাঁ ও লজিস্টিকসে কাজ পেতে চলমান রেফারেল ও সহায়তা।",
          },
        ],
        oppKicker: "চলমান ইনটেক ও চাকরির বিজ্ঞপ্তি",
        oppTitle: "বর্তমান ভিসা ও ক্যারিয়ারের সুযোগসমূহ",
        oppSub: "জাপান সরকার অনুমোদিত স্টুডেন্ট ও প্রফেশনাল জব সেক্টরের চলমান সার্কুলার।",
        processKicker: "পরিকল্পিত রোডম্যাপ",
        processTitle: "জাপান যাত্রার ৫টি সহজ ও স্পষ্ট ধাপ",
        processSub: "প্রতিটি ধাপে স্বচ্ছ আর্থিক হিসাব এবং অভিজ্ঞ কনসালট্যান্টদের প্রত্যক্ষ গাইডলাইন।",
        trustKicker: "আমাদের নির্ভরতা ও সরকারি অনুমোদন",
        trustTitle: "প্রমাণিত সফলতার সাথে শুরু হোক আপনার যাত্রা",
        licenseBadge: "সরকারি ট্রেড লাইসেন্স ও ৩০০ টাকার স্ট্যাম্পে আইনি সুরক্ষা",
        licenseTitle: "গণপ্রজাতন্ত্রী বাংলাদেশ সরকার অনুমোদিত প্রতিষ্ঠান • ঢাকা ও খুলনা",
        licenseDesc:
          "KNLTC-এর প্রতিটি স্টুডেন্ট ও SSW ফাইল ৩০০ টাকার সরকারি জুডিশিয়াল স্ট্যাম্পে লিখিত চুক্তি এবং মানি রিসিট দ্বারা শতভাগ সুরক্ষিত।",
        trustpilotCta: "Trustpilot-এ ভেরিফাইড রিভিউ দেখুন (knltc.com)",
        testimonialsKicker: "শিক্ষার্থীদের বাস্তব অভিজ্ঞতা",
        testimonialsTitle: "আমাদের সফল শিক্ষার্থী ও ভিসা প্রাপ্তদের মতামত",
        finalKicker: "আজই আবেদন শুরু করুন",
        finalTitle: "জাপান যাত্রার স্বপ্ন পূরণে প্রস্তুত?",
        finalSub: "আপনার প্রোফাইল মূল্যায়ন এবং সঠিক দিকনির্দেশনার জন্য আমাদের সিনিয়র কাউন্সেলিং টিমের সাথে কথা বলুন।",
        applyBtn: "আবেদন করুন",
        salaryLabel: "সম্ভাব্য বেতন / সুবিধা",
        eligibilityLabel: "যোগ্যতা",
        stepLabel: "ধাপ",
        badgeOpen: "আবেদন চলছে",
        viewDetails: "বিস্তারিত দেখুন",
        verifiedStep: "যাচাইকৃত ধাপ",
        pathways: [
          {
            icon: GraduationCap,
            title: "জাপানে পড়াশোনা (স্টুডেন্ট ভিসা)",
            desc: "জাপানিজ ল্যাঙ্গুয়েজ স্কুল, ব্যাচেলর ও মাস্টার্স ডিগ্রি প্রোগ্রাম। নিখুঁত COE আবেদন ও স্কলারশিপ মেন্টরিং।",
            cta: "স্টুডেন্ট ভিসা সম্পর্কে জানুন",
            href: "/study-in-japan",
            highlight: "৳০ ফাইল ওপেনিং ফি",
          },
          {
            icon: BriefcaseBusiness,
            title: "জাপানে চাকরি (SSW ও TITP)",
            desc: "কনস্ট্রাকশন, কেয়ারগিভার, এগ্রিকালচার ও ফুড সার্ভিস খাতে স্পেসিফাইড স্কিলড ওয়ার্কার ভিসায় সরাসরি কোম্পানি চুক্তিতে চাকরি।",
            cta: "জব ভিসা সম্পর্কে জানুন",
            href: "/work-in-japan",
            highlight: "মাসিক ১.৪৫–১.৯৮ লক্ষ টাকা",
          },
          {
            icon: Languages,
            title: "জাপানি ভাষা কোর্স (N5–N1)",
            desc: "JLPT, NAT-TEST ও JFT পরীক্ষার পূর্ণাঙ্গ প্রস্তুতি। ডিজিটাল LMS ক্লাসরুম এবং ৩টি ফ্রি বোনাস ইন্টারভিউ কোর্স।",
            cta: "কোর্স দেখুন ও ভর্তি হন",
            href: "/japanese-language",
            highlight: "৩টি ফ্রি বোনাস কোর্স",
          },
        ],
        supportPillars: [
          {
            icon: Languages,
            title: "পূর্ণাঙ্গ ভাষা প্রশিক্ষণ",
            desc: "N5 থেকে N1 লেভেল পর্যন্ত সার্টিফাইড ও নেটিভ স্পিকারদের সমন্বয়ে নিবিড় ক্লাসরুম প্রশিক্ষণ।",
          },
          {
            icon: Wrench,
            title: "SSW স্কিল টেস্ট প্রস্তুতি",
            desc: "কনস্ট্রাকশন, কেয়ারগিভার, এগ্রিকালচার ও ফুড সার্ভিস খাতের প্রোমেট্রিক স্কিল টেস্টের স্পেশাল প্রস্তুতি।",
          },
          {
            icon: FileCheck2,
            title: "নির্ভুল ডকুমেন্টেশন ও COE",
            desc: "১৮ লক্ষ টাকার ব্যাংক স্পন্সর অডিট, ট্যাক্স ক্লিয়ারেন্স ও জাপানি ইমিগ্রেশনে নিখুঁত COE ফাইল প্রসেসিং।",
          },
          {
            icon: Users,
            title: "এম্বাসি ইন্টারভিউ ট্রেনিং",
            desc: "লাইভ ক্যামেরা মক ইন্টারভিউ, আবেদনকারীর স্টাডি প্ল্যান অডিট ও ভিসা অফিসারের আদবকায়দা প্রশিক্ষণ।",
          },
          {
            icon: Handshake,
            title: "স্কুল ও নিয়োগকারী ম্যাচিং",
            desc: "HLA Gakuin Hiroshima সহ জাপানের প্রথম সারির ভাষা একাডেমি ও প্রতিষ্ঠানের সাথে সরাসরি সংযোগ।",
          },
          {
            icon: Globe2,
            title: "জাপানে দীর্ঘমেয়াদি সেটেলমেন্ট কেয়ার",
            desc: "এয়ারপোর্ট পিকআপ, হোস্টেল, সিটি অফিস রেজিস্ট্রেশন, ব্যাংক অ্যাকাউন্ট ও সপ্তাহে ২৮ ঘণ্টা পার্ট-টাইম জব সাপোর্ট।",
          },
        ],
        processSteps: [
          {
            num: "০১",
            icon: ClipboardCheck,
            title: "প্রোফাইল মূল্যায়ন ও স্ট্যাম্প চুক্তি",
            desc: "GPA (>= ২.৫) ও স্টাডি গ্যাপ যাচাই করে ৩০০ টাকার সরকারি স্ট্যাম্পে চুক্তি। অগ্রিম কোনো ফাইল ওপেনিং চার্জ নেই।",
            meta: "ফাইল ওপেনিং: ৳০",
          },
          {
            num: "০২",
            icon: BookCheck,
            title: "ভাষা শিক্ষা ও ৩টি ফ্রি বোনাস কোর্স",
            desc: "ঢাকা/খুলনা শাখায় N5 ক্লাস, ২৪/৭ ডিজিটাল LMS পোর্টাল এবং এম্বাসি ইন্টারভিউ, সিভি ও জব প্রস্তুতির ৩টি ফ্রি কোর্স।",
            meta: "কোর্স ফি: ৳১২,০০০",
          },
          {
            num: "০৩",
            icon: Landmark,
            title: "COE আবেদন ও ১৮ লক্ষ স্পন্সর অডিট",
            desc: "স্পন্সরের ১৮ লক্ষ টাকার ব্যাংক ব্যালেন্স বা ব্যাংক লোন প্রসেসিং এবং জাপান ইমিগ্রেশনে COE জমা। অপেক্ষাকালে N4 ফ্রি।",
            meta: "COE অপেক্ষায় N4 ফ্রি",
          },
          {
            num: "০৪",
            icon: ShieldCheck,
            title: "এম্বাসি ইন্টারভিউ ও ভিসা স্ট্যাম্পিং",
            desc: "COE আসার পর টিউশন ফি প্রেরণ, ক্যামেরা মক ইন্টারভিউ এবং VFS Global-এর মাধ্যমে পাসপোর্টে ভিসা গ্রহণ।",
            meta: "ভিসার পর সার্ভিস চার্জ",
          },
          {
            num: "০৫",
            icon: Plane,
            title: "জাপানে আগমন ও ২৮ ঘণ্টা জব সাপোর্ট",
            desc: "ফ্রি এয়ারপোর্ট পিকআপ, ডরমেটরি, সিটি অফিস ও ব্যাংক অ্যাকাউন্ট খোলা এবং সপ্তাহে ২৮ ঘণ্টার পার্ট-টাইম কাজ নিশ্চিতকরণ।",
            meta: "মাসিক আয় ~৳১,২০,০০০+",
          },
        ],
        trustStats: [
          { num: "১,২০০+", label: "সফল ভিসা অর্জন", sub: "জাপানে অধ্যয়ন ও কর্মসংস্থানরত শিক্ষার্থী", icon: Award },
          { num: "৯৮%", label: "JLPT / NAT পাস রেট", sub: "দক্ষ শিক্ষক ও মক টেস্টের মাধ্যমে সাফল্য", icon: BookCheck },
          { num: "২৫+", label: "জাপানি পার্টনার স্কুল", sub: "HLA Gakuin Hiroshima সহ সরাসরি নেটওয়ার্ক", icon: Globe2 },
          { num: "১০০%", label: "স্ট্যাম্পে স্বচ্ছ চুক্তি", sub: "কোনো গোপন বা অগ্রিম সার্ভিস চার্জ ছাড়া", icon: ShieldCheck },
        ],
      },
      ja: {
        kicker: "KNLTC • 日本留学・特定技能就労総合コンサルタンシー",
        headline: "日本留学・就労・ビザ手続きの確かなゲートウェイ",
        subtitle:
          "留学ビザ・特定技能（SSW）・技能実習・日本語講座（N5〜N1）・在留資格申請書類作成・大使館面接対策までダッカ＆クルナ校で一貫指導。",
        c1: "無料相談を予約する",
        c2: "日本語コースを見る",
        waBtn: "WhatsAppで相談する",
        hotlineLabel: "窓口電話:",
        portalCardKicker: "ダッカ＆クルナ中央ゲートウェイ",
        portalCardTitle: "日本留学・就労・日本語アカデミー",
        portalCardSub: "公式KNLTC日本渡航総合支援センター",
        portalTag1: "1,200名ビザ取得",
        portalTag2: "98%合格率",
        portalTag3: "公式LMS完備",
        portalLmsBtn: "公式受講生LMSにログイン",
        pathKicker: "日本進路プログラム",
        pathHeading: "日本渡航への3大基本進路",
        pathSub: "学歴・職歴や将来の目標に合わせた最適な進路プランをご案内します。",
        guidelineKicker: "透明性の高いプロセスと現地適合ガイドライン",
        guidelineTitle: "透明な契約プロセス＆バングラデシュ特化型サポート",
        guidelineSub: "300タカ公的印紙による法的契約と、COE交付前の前払い手数料ゼロを徹底しています。",
        guidelineCards: [
          {
            icon: Scale,
            title: "透明な手続き (Transparent Process)",
            subtitle: "100%オープンな公的印紙契約",
            items: [
              "300タカ公的印紙を用いた書面での正式委任契約",
              "COE交付・ビザ発給前のファイル開設料や事前手数料は一切ゼロ",
              "学費は学生本人の銀行口座から日本の学校口座へ直接送金",
              "預託された原本証明書の完全返却を書面で保証",
            ],
          },
          {
            icon: Landmark,
            title: "バングラデシュ基準の資金・審査支援",
            subtitle: "学生と経費支弁者に寄り添う実務支援",
            items: [
              "180万タカ相当の銀行残高証明および納税書類の作成指導",
              "Agrani・Social Islami・Pubali銀行の教育ローン手続き案内",
              "N5修了者に3大無料特講（大使館面接・JIS履歴書・アルバイト会話）を進呈",
              "COE結果待機中の約3ヶ月間、N4コースを完全無料で提供",
            ],
          },
          {
            icon: ShieldCheck,
            title: "日本の教育機関・受入れ企業との直結",
            subtitle: "中間ブローカーを介さない直接提携",
            items: [
              "HLA学院（広島）をはじめ日本全国25校以上の認定校と直接提携",
              "ブローカー手数料なしの公正な選考スケジュール",
              "日本人講師およびシニア講師アミール・ホセインによる模擬面接",
              "レギュラー（ビザ後12万タカ）とプレミアム（110万タカ保証型）を選択可能",
            ],
          },
        ],
        supportKicker: "KNLTCトータルサポート",
        supportTitle: "日本渡航に必要なすべての支援をワンストップで",
        supportSub:
          "語学学習からCOE申請、経費支弁書確認、面接対策、渡航後の長期生活・就労サポートまで。",
        afterArrivalKicker: "渡日後の長期定着サポート",
        afterArrivalTitle: "渡日後サポート：空港到着後も続く徹底した現地生活・アルバイト支援",
        afterArrivalSub:
          "渡航して終わりではなく、空港出迎えから学生寮の手配、区役所での住民登録、ゆうちょ銀行口座開設、週28時間の法定アルバイト紹介まで現地チームが継続支援します。",
        afterArrivalItems: [
          {
            icon: Plane,
            title: "空港出迎え・安全な移動",
            desc: "成田・羽田・関西・広島などの到着空港から学生寮までスタッフが安全に案内します。",
          },
          {
            icon: Home,
            title: "安全な学生寮・住居手配",
            desc: "学校や駅に近く、生活しやすい学生寮・シェアハウスを事前に確保します。",
          },
          {
            icon: Building2,
            title: "市区町村役場での住民登録・国保加入",
            desc: "在留カードの住居地届出（住民票登録）や国民健康保険の手続きに同行・支援します。",
          },
          {
            icon: Landmark,
            title: "銀行口座開設・SIMカード契約",
            desc: "ゆうちょ銀行等の口座開設および日本の音声・データSIMカードの契約をサポートします。",
          },
          {
            icon: BriefcaseBusiness,
            title: "週28時間アルバイト紹介・継続支援",
            desc: "資格外活動許可（週28時間以内）に基づくアルバイト求人紹介と面接指導を継続的に行います。",
          },
        ],
        oppKicker: "募集中の最新求人・進学枠",
        oppTitle: "現在募集中の進路・求人情報",
        oppSub: "日本政府公認の留学および特定技能分野の最新募集要項。",
        processKicker: "計画的ロードマップ",
        processTitle: "日本渡航までの5つの確実なステップ",
        processSub: "透明性が高く計画的な進行で、費用・生活面の各段階を確実にサポートします。",
        trustKicker: "実績と公的認証",
        trustTitle: "確かな実績と信頼の日本渡航サポート",
        licenseBadge: "政府公認営業許可（Trade License）＆公的印紙契約保護",
        licenseTitle: "バングラデシュ政府公認コンサルタンシー • ダッカ＆クルナ",
        licenseDesc:
          "すべての留学・特定技能申請ファイルは300タカ公的印紙契約と公式領収書により法的に保護されます。",
        trustpilotCta: "Trustpilotで公式レビューを確認 (knltc.com)",
        testimonialsKicker: "合格者・渡航者の声",
        testimonialsTitle: "留学生・特定技能合格者のリアルな体験談",
        finalKicker: "今すぐ申請をスタート",
        finalTitle: "日本への第一歩を今すぐ始めましょう",
        finalSub: "専門カウンセラーがあなたの経歴に合った最適な進路をご提案します。",
        applyBtn: "応募する",
        salaryLabel: "想定給与・待遇",
        eligibilityLabel: "応募条件",
        stepLabel: "ステップ",
        badgeOpen: "募集中",
        viewDetails: "詳細を見る",
        verifiedStep: "認証ステップ",
        pathways: [
          {
            icon: GraduationCap,
            title: "日本留学（学生ビザ）",
            desc: "日本語学校・専門学校・大学進学。COE申請と奨学金支援。",
            cta: "留学詳細を見る",
            href: "/study-in-japan",
            highlight: "初期着手金 0 BDT",
          },
          {
            icon: BriefcaseBusiness,
            title: "日本就労（特定技能・TITP）",
            desc: "建設・介護・農業・外食等の特定技能就労ビザ。月給18〜24.5万円水準。",
            cta: "就労詳細を見る",
            href: "/work-in-japan",
            highlight: "安定した高待遇",
          },
          {
            icon: Languages,
            title: "日本語集中講座（N5〜N1）",
            desc: "JLPT/NAT対策。オンラインLMS教室と面接・履歴書3大特典付帯。",
            cta: "コース詳細・受講申請",
            href: "/japanese-language",
            highlight: "3大特典無料付帯",
          },
        ],
        supportPillars: [
          {
            icon: Languages,
            title: "語学集中プログラム",
            desc: "N5〜N1および実践会話の徹底指導。",
          },
          {
            icon: Wrench,
            title: "技能試験対策",
            desc: "建設・介護・農業・外食分野の技能測定試験対策。",
          },
          {
            icon: FileCheck2,
            title: "申請書類・COE作成",
            desc: "在留資格認定証明書（COE）申請と180万タカ経費支弁審査。",
          },
          {
            icon: Users,
            title: "大使館面接シミュレーション",
            desc: "査証官面接シミュレーションと志望動機添削。",
          },
          {
            icon: Handshake,
            title: "教育機関・企業マッチング",
            desc: "HLA学院（広島）をはじめ提携日本語学校・受入れ企業への推薦。",
          },
          {
            icon: Globe2,
            title: "渡航後長期定着サポート",
            desc: "空港出迎え、宿舎、区役所登録、銀行口座、週28時間アルバイト紹介。",
          },
        ],
        processSteps: [
          {
            num: "01",
            icon: ClipboardCheck,
            title: "無料適性診断＆公的印紙契約",
            desc: "GPA（2.5以上）と経歴を審査し、300タカ公的印紙で契約。初期ファイル開設料は0タカ。",
            meta: "初期着手金: ৳0",
          },
          {
            num: "02",
            icon: BookCheck,
            title: "日本語学習＆3大無料特講",
            desc: "ダッカ/クルナ校と24時間LMSでの学習に加え、面接・履歴書・接客の3講座が無料。",
            meta: "受講料: ৳12,000",
          },
          {
            num: "03",
            icon: Landmark,
            title: "COE申請＆180万タカ資金審査",
            desc: "スポンサー残高証明または銀行教育ローン手配と入管へのCOE提出。待機中はN4無料。",
            meta: "待機中N4コース無料",
          },
          {
            num: "04",
            icon: ShieldCheck,
            title: "大使館面接・ビザ発給",
            desc: "COE交付後の学費送金、カメラ模擬面接特訓、VFSでの査証発給。",
            meta: "成功報酬型サービス料",
          },
          {
            num: "05",
            icon: Plane,
            title: "日本到着＆週28時間アルバイト",
            desc: "空港送迎、寮入居、役所・銀行手続き、週28時間のアルバイト就労開始まで伴走。",
            meta: "月収目安 ~৳1.20L+",
          },
        ],
        trustStats: [
          { num: "1,200名+", label: "日本渡航ビザ取得実績", sub: "留学生・特定技能人材を日本へ輩出", icon: Award },
          { num: "98%", label: "JLPT / NAT合格率", sub: "定期模擬テストと個別指導の成果", icon: BookCheck },
          { num: "25校+", label: "日本国内提携学校", sub: "HLA学院（広島）ほか直接ネットワーク", icon: Globe2 },
          { num: "100%", label: "透明な公的印紙契約", sub: "不当な前払い・追加費用は一切なし", icon: ShieldCheck },
        ],
      },
    },
    language,
  );

  // Merge dynamic CMS hero content with localized fallback
  const heroKicker = cms?.heroSection?.kicker?.[language] || t.kicker;
  const heroHeadline = cms?.heroSection?.headline?.[language] || t.headline;
  const heroSubtitle = cms?.heroSection?.subtitle?.[language] || t.subtitle;
  const heroLicenseInfo = cms?.heroSection?.licenseInfo?.[language] || t.licenseDesc;

  // Dynamic opportunities from CMS jobCirculars + Study in Japan card
  const publishedJobs = (cms?.jobCirculars || []).filter((j) => j.isPublished);
  const dynamicOpportunities = [
    ...publishedJobs.slice(0, 3).map((job) => ({
      title: job.title[language] || job.title.en,
      role: `${job.locationJapan} • ${job.openings} Openings`,
      salary: `${job.salaryYen} (${job.salaryBdtEquivalent})`,
      eligibility: job.requirements[language] || job.requirements.en,
      specialBadge: language === "bn" ? job.specialBenefitsBn : undefined,
      href: "/work-in-japan",
    })),
    {
      title:
        language === "bn"
          ? "জাপান স্টুডেন্ট ভিসা (জুলাই ও অক্টোবর ২০২৭ ইনটেক)"
          : language === "ja"
            ? "日本留学ビザ（2027年7月・10月期生）"
            : "Study in Japan (July & October 2027 Intakes)",
      role:
        language === "bn"
          ? "HLA Gakuin Hiroshima ও ২৫+ অনুমোদিত ভাষা স্কুল ও বিশ্ববিদ্যালয়"
          : language === "ja"
            ? "HLA学院（広島）ほか全国25校以上の認定日本語学校・大学"
            : "HLA Gakuin Hiroshima & 25+ Accredited Language Schools & Universities",
      salary:
        language === "bn"
          ? "সপ্তাহে ২৮ ঘণ্টা বৈধ পার্ট-টাইম কাজের অনুমতি (~৳১,২০,০০০+/মাস)"
          : language === "ja"
            ? "週28時間以内の法定アルバイト許可（月収約12万タカ相当）"
            : "Part-time work permitted up to 28 hrs/week (~BDT 120,000+/mo)",
      eligibility:
        language === "bn"
          ? `HSC / ডিপ্লোমা / অনার্স (ন্যূনতম GPA ${cms?.studyInJapanPage?.eligibilityMinGpa ?? 2.5}) + জাপানি ভাষা N5`
          : language === "ja"
            ? `高卒・短大・大卒（GPA ${cms?.studyInJapanPage?.eligibilityMinGpa ?? 2.5}以上）＋ 日本語N5`
            : `HSC / Diploma / Bachelor (Min GPA ${cms?.studyInJapanPage?.eligibilityMinGpa ?? 2.5}) + Japanese N5`,
      specialBadge:
        language === "bn"
          ? `রেগুলার প্যাকেজ: ভিসার পর ৳${(cms?.studyInJapanPage?.regularPackageFeeBdt ?? 120000).toLocaleString()} • প্রিমিয়াম: ৳${(cms?.studyInJapanPage?.premiumPackageFeeBdt ?? 1100000).toLocaleString()}`
          : undefined,
      href: "/study-in-japan",
    },
  ];

  const popupBanner = cms?.popupBanner;

  return (
    <div className="bg-white overflow-hidden">
      {/* Dynamic CMS Special Skill Campaign Banner */}
      {popupBanner?.enabled && !campaignDismissed && (
        <div className="bg-emerald-950 text-white border-b border-emerald-800/80 py-3 px-4 relative">
          <div className="container-narrow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pr-8">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 bg-amber-500/15 border border-amber-400/30 px-2.5 py-0.5 rounded-md">
                {popupBanner.badge?.[language] || popupBanner.badge?.bn}
              </span>
              <p className="text-xs sm:text-sm font-bold text-white leading-snug">
                {popupBanner.headline?.[language] || popupBanner.headline?.bn}
              </p>
              <span className="hidden xl:inline text-xs text-emerald-200">
                — {popupBanner.subheadline?.[language] || popupBanner.subheadline?.bn}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href={popupBanner.primaryCtaUrl || "/work-in-japan"}
                className="inline-flex items-center gap-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs px-3 py-1.5 transition"
              >
                <span>{popupBanner.primaryCtaText?.[language] || t.applyBtn}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <button
              type="button"
              onClick={() => setCampaignDismissed(true)}
              aria-label="Dismiss campaign banner"
              className="absolute right-3 top-3 text-emerald-300 hover:text-white p-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Hero Section with Clean Institutional Architecture */}
      <section className="relative overflow-hidden bg-slate-50/70 border-b border-slate-200 py-14 sm:py-20 lg:py-24">
        <div className="container-narrow relative z-10">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left Hero Column */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="lg:col-span-7"
            >
              <motion.div variants={itemVariants} className="inline-flex items-center gap-2 mb-3.5">
                <span className="h-2 w-2 rounded-full bg-[#b91c1c]" />
                <p className="text-xs font-bold uppercase tracking-wider text-[#b91c1c]">
                  {heroKicker}
                </p>
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="text-3xl font-bold tracking-tight text-slate-900 leading-relaxed sm:text-4xl md:text-5xl lg:text-[2.9rem]"
              >
                {heroHeadline}
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed font-normal"
              >
                {heroSubtitle}
              </motion.p>

              {/* Main Action Group */}
              <motion.div variants={itemVariants} className="mt-8 flex flex-col sm:flex-row gap-3.5">
                <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    asChild
                    size="lg"
                    className="w-full sm:w-auto bg-[#15803d] hover:bg-emerald-800 text-white font-semibold text-sm sm:text-base py-6 px-7 rounded-xl shadow-2xs transition-colors"
                  >
                    <Link href="/contact" className="flex items-center justify-center gap-2">
                      <span>{t.c1}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </motion.div>

                <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto border-slate-300 bg-white hover:bg-slate-50 text-slate-900 font-semibold text-sm sm:text-base py-6 px-6 rounded-xl transition-colors"
                  >
                    <Link href="/japanese-language" className="flex items-center justify-center gap-2">
                      <Languages className="h-4 w-4 text-[#b91c1c]" />
                      <span>{t.c2}</span>
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>

              {/* Quick Hotline Strip */}
              <motion.div
                variants={itemVariants}
                className="mt-8 pt-6 border-t border-slate-200/80 flex flex-wrap items-center gap-5 text-xs sm:text-sm text-slate-600 font-medium"
              >
                <div className="flex items-center gap-2">
                  <PhoneCall className="h-4 w-4 text-[#b91c1c]" />
                  <span>
                    {t.hotlineLabel}{" "}
                    <a href={livePhoneHref} className="text-slate-900 font-bold hover:underline">
                      {livePhoneDisplay}
                    </a>
                  </span>
                </div>
                <span className="text-slate-300 hidden sm:inline">|</span>
                <a
                  href={liveWaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[#15803d] font-bold hover:underline transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>{t.waBtn}</span>
                </a>
              </motion.div>
            </motion.div>

            {/* Right Hero Column - Official KNLTC Institutional Gateway Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] as const }}
              className="lg:col-span-5"
            >
              <div className="hover-spotlight relative rounded-2xl border border-slate-200 bg-white p-7 sm:p-8 shadow-sm">
                {/* Top Header with Official Brand Emblem */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-white border border-slate-200 p-0.5 flex items-center justify-center">
                      <Image
                        src="/brand/knltc-logo.svg"
                        alt="KNLTC Logo"
                        width={36}
                        height={36}
                        referrerPolicy="no-referrer"
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-slate-900 leading-none">
                        KNLTC
                      </span>
                      <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mt-1 leading-none">
                        {t.portalCardKicker}
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-[#15803d] flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Gov. Registered</span>
                  </span>
                </div>

                <div className="mt-5">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
                    {t.portalCardTitle}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {heroLicenseInfo}
                  </p>
                </div>

                {/* 3 Institutional Metrics */}
                <div className="mt-6 grid grid-cols-3 gap-2.5">
                  <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-center">
                    <Award className="h-4 w-4 text-[#b91c1c] mx-auto mb-1" />
                    <div className="text-xs font-bold text-slate-900">
                      {cms?.heroSection?.stats?.[0]?.value || t.portalTag1}
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-center">
                    <BookCheck className="h-4 w-4 text-[#15803d] mx-auto mb-1" />
                    <div className="text-xs font-bold text-slate-900">
                      {cms?.heroSection?.stats?.[1]?.value || t.portalTag2}
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-center">
                    <GraduationCap className="h-4 w-4 text-slate-800 mx-auto mb-1" />
                    <div className="text-xs font-bold text-slate-900">{t.portalTag3}</div>
                  </div>
                </div>

                {/* Official LMS Entrance Card CTA */}
                <div className="mt-6 pt-5 border-t border-slate-100">
                  <a
                    href={liveLmsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between rounded-xl bg-slate-900 hover:bg-slate-800 p-3.5 text-xs font-semibold text-white transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-red-300">
                        <GraduationCap className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-white">{t.portalLmsBtn}</span>
                        <span className="block text-[10px] text-slate-300 font-medium">
                          Official Student Portal ({liveLmsUrl.replace("https://", "")})
                        </span>
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-0.5" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3 Core Pathways - Distinct Context-Appropriate Lucide Icons */}
      <section className="py-16 md:py-20 border-b border-stone-200 bg-white">
        <div className="container-narrow">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4 }}
            className="max-w-2xl mx-auto text-center mb-12"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-[#b91c1c]">
              {t.pathKicker}
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-relaxed">
              {t.pathHeading}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t.pathSub}
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="grid gap-6 md:grid-cols-3"
          >
            {t.pathways.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  whileHover={{ y: -4, transition: { duration: 0.18 } }}
                  className="hover-spotlight group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-7 transition-all hover:border-slate-300"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50/70 border border-red-200/70 text-[#b91c1c] shadow-2xs">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-bold text-[#15803d]">
                        {p.highlight}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 leading-relaxed group-hover:text-[#b91c1c] transition-colors">
                      {p.title}
                    </h3>
                    <p className="mt-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      {p.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-5 border-t border-stone-200/80">
                    <Link
                      href={p.href}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#b91c1c] group-hover:underline"
                    >
                      <span>{p.cta}</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Transparent Process ("স্বচ্ছ প্রসেস") & Bangladesh-Centric Guideline ("বাংলাদেশ কেন্দ্রীক গাইডলাইন") with Visible Checkmark Icons */}
      <section className="py-16 md:py-20 border-b border-stone-200 bg-[#fcfaf7]">
        <div className="container-narrow">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4 }}
            className="max-w-2xl mx-auto text-center mb-12"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-[#15803d]">
              {t.guidelineKicker}
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-relaxed">
              {t.guidelineTitle}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t.guidelineSub}
            </p>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-3">
            {t.guidelineCards.map((card, idx) => {
              const CardIcon = card.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-2xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-3.5 mb-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-200 text-[#15803d]">
                        <CardIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                          {card.title}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          {card.subtitle}
                        </p>
                      </div>
                    </div>

                    <ul className="mt-5 space-y-3 border-t border-slate-100 pt-4">
                      {card.items.map((item, itemIdx) => (
                        <li
                          key={itemIdx}
                          className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed"
                        >
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-[#15803d] mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6 Support Ecosystem Pillars */}
      <section className="py-16 md:py-20 border-b border-stone-200 bg-white">
        <div className="container-narrow">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4 }}
            className="max-w-2xl mx-auto text-center mb-12"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-[#b91c1c]">
              {t.supportKicker}
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-relaxed">
              {t.supportTitle}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t.supportSub}
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {t.supportPillars.map((s, idx) => {
              const SIcon = s.icon;
              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  whileHover={{ y: -4, transition: { duration: 0.18 } }}
                  className="hover-spotlight group rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs hover:border-slate-300 transition-all"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 text-slate-900 mb-4">
                    <SIcon className="h-5 w-5 text-[#15803d]" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {s.desc}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Dedicated Long-Term After-Arrival Support in Japan Section */}
      <section className="py-16 md:py-20 border-b border-stone-200 bg-slate-950 text-white">
        <div className="container-narrow">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              {t.afterArrivalKicker}
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-relaxed">
              {t.afterArrivalTitle}
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
              {t.afterArrivalSub}
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {t.afterArrivalItems.map((item, idx) => {
              const AIcon = item.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3.5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                        <AIcon className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-400">
                        0{idx + 1}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white leading-snug">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                    <span>Japan On-Ground Team</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Ongoing Visa Opportunities (Dynamically Powered by CMS Job Circulars) */}
      <section className="py-16 md:py-20 border-b border-stone-200 bg-white">
        <div className="container-narrow">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4 }}
            className="max-w-2xl mx-auto text-center mb-12"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-[#b91c1c]">
              {t.oppKicker}
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-relaxed">
              {t.oppTitle}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t.oppSub}
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="grid gap-6 md:grid-cols-2"
          >
            {dynamicOpportunities.map((opp, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -4, transition: { duration: 0.18 } }}
                className="hover-spotlight group rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 flex flex-col justify-between shadow-2xs hover:border-slate-300 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 pb-3 border-b border-stone-200">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#b91c1c] transition-colors leading-snug">
                      {opp.title}
                    </h3>
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#15803d] shrink-0">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{t.badgeOpen}</span>
                    </span>
                  </div>

                  <p className="mt-3 text-xs sm:text-sm font-semibold text-slate-700">
                    {opp.role}
                  </p>

                  <div className="mt-4 space-y-2 text-xs text-slate-600">
                    <div className="flex items-start gap-2">
                      <Banknote className="h-4 w-4 text-[#15803d] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-800">
                          {t.salaryLabel}:{" "}
                        </span>
                        <span className="text-emerald-800 font-bold">{opp.salary}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#b91c1c] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-800">
                          {t.eligibilityLabel}:{" "}
                        </span>
                        <span>{opp.eligibility}</span>
                      </div>
                    </div>
                  </div>

                  {opp.specialBadge && (
                    <p className="mt-3 text-xs font-semibold text-[#b91c1c] bg-red-50/70 border border-red-200/60 rounded-lg px-3 py-2">
                      {opp.specialBadge}
                    </p>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-stone-200/80 flex items-center justify-between">
                  <Link
                    href={opp.href}
                    className="text-xs font-bold text-[#b91c1c] hover:underline flex items-center gap-1"
                  >
                    <span>{t.viewDetails}</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>

                  <Button
                    asChild
                    size="sm"
                    className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg px-3.5 h-8 active:scale-95 transition-transform"
                  >
                    <Link href="/contact">{t.applyBtn}</Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 5-Step Process Roadmap with Financial & Lifestyle Icons */}
      <section className="py-16 md:py-20 border-b border-stone-200 bg-[#fcfaf7]">
        <div className="container-narrow">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4 }}
            className="max-w-2xl mx-auto text-center mb-12"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-[#b91c1c]">
              {t.processKicker}
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-relaxed">
              {t.processTitle}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t.processSub}
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
          >
            {t.processSteps.map((step, idx) => {
              const StepIcon = step.icon;
              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  whileHover={{ y: -4, transition: { duration: 0.18 } }}
                  className="hover-spotlight rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-[#b91c1c] border border-red-200/60">
                        <StepIcon className="h-4 w-4" />
                      </div>
                      <span className="font-mono text-xs font-bold text-[#b91c1c]">
                        {step.num}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-1 text-[11px] font-semibold text-[#15803d]">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                      <span>{step.meta}</span>
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Trust, Official Trade License Showcase, Testimonials & Trustpilot Integration */}
      <section className="py-16 md:py-20 border-b border-stone-200 bg-white">
        <div className="container-narrow space-y-14">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4 }}
              className="max-w-2xl mx-auto text-center mb-12"
            >
              <p className="text-xs font-bold uppercase tracking-widest text-[#15803d]">
                {t.trustKicker}
              </p>
              <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-relaxed">
                {t.trustTitle}
              </h2>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              className="grid grid-cols-2 gap-4 lg:grid-cols-4"
            >
              {t.trustStats.map((m, i) => {
                const MIcon = m.icon;
                const dynamicValue = cms?.heroSection?.stats?.[i]?.value || m.num;
                const dynamicLabel = cms?.heroSection?.stats?.[i]?.label?.[language] || m.label;
                return (
                  <motion.div
                    key={i}
                    variants={itemVariants}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="hover-spotlight rounded-2xl border border-slate-200/90 bg-white p-6 text-center shadow-2xs hover:border-slate-300 transition-all"
                  >
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-stone-200 text-[#b91c1c] mb-3 shadow-2xs">
                      <MIcon className="h-5 w-5" />
                    </div>
                    <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                      {dynamicValue}
                    </div>
                    <div className="mt-1 text-sm font-bold text-slate-800">{dynamicLabel}</div>
                    <div className="mt-1 text-xs text-slate-500">{m.sub}</div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Official Government Trade License & Trustpilot Verification Strip */}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6 sm:p-8">
            <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-8 space-y-2">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-[#15803d]">
                  <ShieldCheck className="h-4 w-4" />
                  <span>{t.licenseBadge}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                  {t.licenseTitle}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {heroLicenseInfo}
                </p>
              </div>
              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 lg:items-end">
                <a
                  href="https://www.trustpilot.com/review/knltc.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-3 transition shadow-2xs"
                >
                  <Star className="h-4 w-4 text-emerald-400 fill-emerald-400" />
                  <span>{t.trustpilotCta}</span>
                  <ExternalLink className="h-3.5 w-3.5 text-slate-300" />
                </a>
              </div>
            </div>
          </div>

          {/* Verified Student Testimonials (Dynamic from CMS) */}
          {cms?.testimonials && cms.testimonials.length > 0 && (
            <div>
              <div className="text-center max-w-2xl mx-auto mb-8">
                <p className="text-xs font-bold uppercase tracking-widest text-[#b91c1c]">
                  {t.testimonialsKicker}
                </p>
                <h3 className="mt-1.5 text-xl sm:text-2xl font-extrabold text-slate-900 leading-relaxed">
                  {t.testimonialsTitle}
                </h3>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                {cms.testimonials.map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-slate-200 bg-[#fcfaf7] p-6 shadow-2xs flex flex-col justify-between"
                  >
                    <div>
                      <Quote className="h-6 w-6 text-[#b91c1c]/30 mb-3" />
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                        &ldquo;{item.quote?.[language] || item.quote?.bn || item.quote?.en}&rdquo;
                      </p>
                    </div>
                    <div className="mt-5 pt-4 border-t border-stone-200/80 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-slate-900">{item.studentName}</p>
                        <p className="text-xs text-[#15803d] font-semibold">{item.courseOrVisa}</p>
                      </div>
                      <span className="text-xs text-slate-500">{item.city}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Executive Final CTA Card */}
      <section className="py-16 md:py-20 bg-[#fcfaf7]">
        <div className="container-narrow">
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 16 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] as const }}
            className="hover-spotlight relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 text-center shadow-xs max-w-3xl mx-auto"
          >
            <div className="absolute top-0 right-0 -mr-16 -mt-16 h-40 w-40 rounded-full bg-red-100/40 blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-40 w-40 rounded-full bg-emerald-100/40 blur-2xl pointer-events-none" />

            <div className="relative z-10">
              <p className="text-xs font-bold uppercase tracking-widest text-[#b91c1c] mb-2">
                {t.finalKicker}
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-relaxed">
                {t.finalTitle}
              </h2>
              <p className="mt-3 text-xs sm:text-sm md:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
                {t.finalSub}
              </p>

              <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3.5">
                <motion.div whileHover={{ y: -3, scale: 1.015 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    asChild
                    size="lg"
                    className="w-full sm:w-auto bg-[#15803d] hover:bg-emerald-700 text-white font-bold text-sm px-7 py-6 rounded-xl shadow-xs transition-colors"
                  >
                    <Link href="/contact" className="flex items-center justify-center gap-2">
                      <span>{t.c1}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </motion.div>

                <motion.div whileHover={{ y: -3, scale: 1.015 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto border-stone-300 hover:bg-stone-50 text-slate-800 font-semibold text-sm px-6 py-6 rounded-xl transition-colors"
                  >
                    <a
                      href={liveWaHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="h-4 w-4 text-[#15803d]" />
                      <span>{t.waBtn}</span>
                    </a>
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
