"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  FileCheck2,
  GraduationCap,
  Handshake,
  Languages,
  MessageCircle,
  PhoneCall,
  ShieldCheck,
  Users,
  Wrench,
  Award,
  Globe2,
  BookCheck,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";

// Motion Variants for High-Performance GPU Staggering
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

const cardHoverVariants = {
  rest: { y: 0, scale: 1 },
  hover: {
    y: -5,
    scale: 1.008,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

export default function HomePage() {
  const { language } = useLanguage();

  const t = translate(
    {
      en: {
        kicker: "KNLTC • Japan Education & Career Consultancy",
        headline: "Your Trusted Gateway to Higher Study, Career & Visa in Japan",
        subtitle:
          "Student visa, SSW job visa, TITP technical training, Japanese language mastery (N5–N1), skill qualification, and Embassy visa interview preparation—all under one roof at KNLTC Dhaka.",
        c1: "Book Free Consultation",
        c2: "Japanese Language Course",
        waBtn: "Talk on WhatsApp",
        hotlineLabel: "Hotline:",
        portalCardKicker: "Dhaka Central Gateway",
        portalCardTitle: "Study, Work & Japanese Language",
        portalCardSub: "Official KNLTC Japan Admissions & Career Liaison",
        portalTag1: "1,200+ Visas",
        portalTag2: "98% Pass Rate",
        portalTag3: "LMS Digital",
        portalLmsBtn: "Enter Student LMS Classroom",
        pathKicker: "Pathways to Japan",
        pathHeading: "Three Core Pathways to Your Journey in Japan",
        pathSub: "Select the ideal program based on your academic background and professional aspirations.",
        supportKicker: "KNLTC One-Stop Solution",
        supportTitle: "Everything You Need for Japan — All in One Place",
        supportSub:
          "From language mastery to Certificate of Eligibility (COE) filing, financial sponsor auditing, and post-arrival assistance in Japan.",
        oppKicker: "Active Intakes & Career Openings",
        oppTitle: "Current Visa & Career Opportunities",
        oppSub: "Ongoing intakes across Japan government-approved study and employment sectors.",
        processKicker: "Systematic Roadmap",
        processTitle: "Step-by-Step Pathway to Japan",
        processSub: "Transparent, step-by-step guidance through each phase of your journey.",
        trustKicker: "Track Record of Excellence",
        trustTitle: "Start Your Japan Journey with Proven Trust",
        finalKicker: "Start Your Application Today",
        finalTitle: "Ready to Begin Your Japan Journey?",
        finalSub: "Speak directly with our senior counseling team to evaluate your profile and plan your roadmap.",
        applyBtn: "Apply Now",
        salaryLabel: "Salary / Income",
        eligibilityLabel: "Requirements",
        stepLabel: "Step",
        badgeOpen: "Application Open",
        viewDetails: "View Details",
        verifiedStep: "Verified Phase",
        pathways: [
          {
            icon: GraduationCap,
            title: "Study in Japan (Student Visa)",
            desc: "Language academies, bachelor's, and master's degree programs. Complete COE filing, scholarship mentoring, and visa guidance.",
            cta: "Explore Student Visa",
            href: "/study-in-japan",
            highlight: "Higher Study & Work",
          },
          {
            icon: BriefcaseBusiness,
            title: "Work in Japan (SSW & TITP)",
            desc: "Specified Skilled Worker visas in Caregiving, Agriculture, and Food Service with competitive salaries and official contracts.",
            cta: "Explore Job Visas",
            href: "/work-in-japan",
            highlight: "Attractive Monthly Salary",
          },
          {
            icon: Languages,
            title: "Japanese Language Course (N5–N1)",
            desc: "Targeted JLPT, NAT-TEST, and JFT preparation. Digital LMS classroom at npw.bd/knltc plus 3 free bonus interview courses.",
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
            desc: "Specialized training for Prometric SSW qualification tests in Caregiving, Food Service, and Agriculture.",
          },
          {
            icon: FileCheck2,
            title: "Flawless Documentation",
            desc: "Sponsorship auditing, tax documents, and complete Certificate of Eligibility (COE) filing.",
          },
          {
            icon: Users,
            title: "Embassy Interview Coaching",
            desc: "Live camera mock interviews, study motivation (Shibou Douki) audit, and visa officer etiquette.",
          },
          {
            icon: Handshake,
            title: "School & Employer Matching",
            desc: "Direct liaison with recognized Japanese schools, universities, and licensed accepting companies.",
          },
          {
            icon: Globe2,
            title: "After-Arrival Assistance",
            desc: "Guidance on airport arrival, ward office residence registration, SIM card, student bank accounts, and living etiquette.",
          },
        ],
        opportunities: [
          {
            title: "SSW Caregiving (Kaigo)",
            role: "Specified Skilled Worker (Nursing Care / Caregiver)",
            salary: "¥180,000 – ¥240,000 / month",
            eligibility: "JLPT N4 / JFT-Basic + Nursing Skill Evaluation Test",
            href: "/work-in-japan",
          },
          {
            title: "SSW Agriculture (Nogyo)",
            role: "Crop & Livestock Farming Specialist",
            salary: "¥160,000 – ¥210,000 / month",
            eligibility: "JLPT N4 / JFT-Basic + Agriculture Skill Test",
            href: "/work-in-japan",
          },
          {
            title: "Study in Japan (Language & University)",
            role: "Top-Tier Japanese Language Schools & Universities",
            salary: "Part-time work permitted up to 28 hrs/week",
            eligibility: "HSC / Diploma / Bachelor + Min. 150 hrs Japanese (N5)",
            href: "/study-in-japan",
          },
          {
            title: "TITP Technical Intern Training",
            role: "Construction, Manufacturing & Logistics",
            salary: "¥160,000 – ¥190,000 / month + Subsidized Housing",
            eligibility: "Basic Japanese proficiency + Good physical fitness",
            href: "/work-in-japan",
          },
        ],
        processSteps: [
          {
            num: "01",
            title: "Profile Assessment",
            desc: "Comprehensive evaluation of your education, career goals, and eligibility for study or work in Japan.",
          },
          {
            num: "02",
            title: "Language & Skill Mastery",
            desc: "Daily intensive classes in Dhaka and 24/7 digital LMS access for JLPT/NAT or SSW Prometric prep.",
          },
          {
            num: "03",
            title: "COE & Sponsor Documentation",
            desc: "Rigorous sponsor auditing and flawless Certificate of Eligibility (COE) submission to Japan Immigration.",
          },
          {
            num: "04",
            title: "Embassy Interview & Visa",
            desc: "High-intensity mock interview training ensuring confidence before the Embassy of Japan.",
          },
          {
            num: "05",
            title: "Pre-Departure & Arrival Support",
            desc: "Flight ticketing, airport reception in Japan, residence card registration, and part-time job guidance.",
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
            num: "12+ Yrs",
            label: "Expertise in Japan Consultancy",
            sub: "Dedicated team in Dhaka and partners across Japan",
            icon: Globe2,
          },
          {
            num: "100%",
            label: "Transparent Process",
            sub: "No hidden fees, ethical and legal procedures",
            icon: ShieldCheck,
          },
        ],
      },
      bn: {
        kicker: "KNLTC • জাপান এডুকেশন অ্যান্ড ক্যারিয়ার কনসালটেন্সি",
        headline: "জাপানে উচ্চশিক্ষা, ক্যারিয়ার ও স্থায়ী ভিসার বিশ্বস্ত প্রবেশদ্বার",
        subtitle:
          "স্টুডেন্ট ভিসা, SSW জব ভিসা, TITP টেকনিক্যাল ইন্টার্নশিপ, জাপানি ভাষা শিক্ষা (N5–N1), প্র্যাকটিক্যাল স্কিল ও জাপান এম্বাসি ইন্টারভিউ প্রস্তুতি—সবকিছু KNLTC ঢাকা সেন্টারে এক ছাদের নিচে।",
        c1: "ফ্রি কাউন্সেলিং বুক করুন",
        c2: "জাপানি ভাষা কোর্স",
        waBtn: "হোয়াটসঅ্যাপে পরামর্শ",
        hotlineLabel: "হটলাইন:",
        portalCardKicker: "ঢাকা সেন্ট্রাল গেটওয়ে",
        portalCardTitle: "উচ্চশিক্ষা, ক্যারিয়ার ও জাপানি ভাষা",
        portalCardSub: "KNLTC অফিশিয়াল জাপান এডমিশন ও ভিসা উইং",
        portalTag1: "১,২০০+ ভিসা",
        portalTag2: "৯৮% পাসের হার",
        portalTag3: "ডিজিটাল LMS",
        portalLmsBtn: "LMS ক্লাসরুমে প্রবেশ করুন",
        pathKicker: "জাপান যাত্রার পথসমূহ",
        pathHeading: "জাপান গমনের তিনটি মূল পাথওয়ে",
        pathSub: "আপনার শিক্ষাগত যোগ্যতা ও ক্যারিয়ারের লক্ষ্যের সাথে মানানসই সেরা প্রোগ্রামটি বেছে নিন।",
        supportKicker: "KNLTC ওয়ান-স্টপ সমাধান",
        supportTitle: "জাপান যাত্রার যাবতীয় প্রস্তুতি — এক ছাদের নিচে",
        supportSub:
          "ভাষা শিক্ষা থেকে শুরু করে COE ফাইল তৈরি, স্পন্সর অডিট ও জাপানে পৌঁছানোর পর সকল সহযোগিতা।",
        oppKicker: "চলমান ইনটেক ও চাকরির বিজ্ঞপ্তি",
        oppTitle: "বর্তমান ভিসা ও ক্যারিয়ারের সুযোগসমূহ",
        oppSub: "জাপান সরকার অনুমোদিত স্টুডেন্ট ও প্রফেশনাল জব সেক্টরের চলমান সার্কুলার।",
        processKicker: "পরিকল্পিত রোডম্যাপ",
        processTitle: "জাপান যাত্রার সহজ ও স্পষ্ট ধাপসমূহ",
        processSub: "প্রতিটি ধাপে স্বচ্ছ, নির্ভরযোগ্য এবং অভিজ্ঞ কনসালট্যান্টদের প্রত্যক্ষ গাইডলাইন।",
        trustKicker: "আমাদের নির্ভরতা ও সুনাম",
        trustTitle: "প্রমাণিত সফলতার সাথে শুরু হোক আপনার যাত্রা",
        finalKicker: "আজই আবেদন শুরু করুন",
        finalTitle: "জাপান যাত্রার স্বপ্ন পূরণে প্রস্তুত?",
        finalSub: "আপনার প্রোফাইল মূল্যায়ন এবং সঠিক দিকনির্দেশনার জন্য আমাদের সিনিয়র কাউন্সেলিং টিমের সাথে কথা বলুন।",
        applyBtn: "আবেদন করুন",
        salaryLabel: "সম্ভাব্য বেতন / আয়",
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
            highlight: "উচ্চশিক্ষা ও পার্ট-টাইম কাজ",
          },
          {
            icon: BriefcaseBusiness,
            title: "জাপানে চাকরি (SSW ও TITP)",
            desc: "কেয়ারগিভার, এগ্রিকালচার ও ফুড সার্ভিস ক্যাটাগরিতে স্পেসিফাইড স্কিলড ওয়ার্কার ভিসায় আকর্ষণীয় বেতনে চাকরি।",
            cta: "জব ভিসা সম্পর্কে জানুন",
            href: "/work-in-japan",
            highlight: "আকর্ষণীয় মাসিক বেতন",
          },
          {
            icon: Languages,
            title: "জাপানি ভাষা কোর্স (N5–N1)",
            desc: "JLPT, NAT-TEST ও JFT পরীক্ষার ১০০% নিশ্চয়তা। ডিজিটাল LMS ক্লাসরুম এবং ৩টি ফ্রি বোনাস ইন্টারভিউ কোর্স।",
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
            desc: "কেয়ারগিভার, এগ্রিকালচার ও ফুড সার্ভিস খাতের প্রোমেট্রিক স্কিল টেস্টের স্পেশাল প্রস্তুতি।",
          },
          {
            icon: FileCheck2,
            title: "নির্ভুল ডকুমেন্টেশন ও COE",
            desc: "ব্যাংক স্পন্সর অডিট, ট্যাক্স ক্লিয়ারেন্স ও জাপানি ইমিগ্রেশনে নিখুঁত COE ফাইল প্রসেসিং।",
          },
          {
            icon: Users,
            title: "এম্বাসি ইন্টারভিউ ট্রেনিং",
            desc: "লাইভ ক্যামেরা মক ইন্টারভিউ, আবেদনকারীর স্টাডি প্ল্যান অডিট ও ভিসা অফিসারের আদবকায়দা প্রশিক্ষণ।",
          },
          {
            icon: Handshake,
            title: "স্কুল ও নিয়োগকারী ম্যাচিং",
            desc: "জাপানের প্রথম সারির ভাষা একাডেমি ও রেজিস্টার্ড সরকারি-বেসরকারি প্রতিষ্ঠানের সাথে সরাসরি সংযোগ।",
          },
          {
            icon: Globe2,
            title: "জাপানে পৌঁছে সার্বিক সহায়তা",
            desc: "এয়ারপোর্ট পিকআপ, সিটি কর্পোরেশন রেসিডেন্স কার্ড রেজিস্ট্রেশন, ব্যাংক অ্যাকাউন্ট ও পার্ট-টাইম কাজ পেতে সাহায্য।",
          },
        ],
        opportunities: [
          {
            title: "SSW কেয়ারগিভিং (নার্সিং কেয়ার)",
            role: "স্পেসিফাইড স্কিলড ওয়ার্কার (কেয়ারগিভার)",
            salary: "১,৮০,০০০ – ২,৪০,০০০ ইয়েন / মাস",
            eligibility: "JLPT N4 / JFT-Basic + কেয়ারগিভার স্কিল টেস্ট",
            href: "/work-in-japan",
          },
          {
            title: "SSW এগ্রিকালচার (কৃষি খাত)",
            role: "কৃষি ও পশুপালন ফার্মিং স্পেশালিস্ট",
            salary: "১,৬০,০০০ – ২,১০,০০০ ইয়েন / মাস",
            eligibility: "JLPT N4 / JFT-Basic + এগ্রিকালচার স্কিল টেস্ট",
            href: "/work-in-japan",
          },
          {
            title: "জাপান স্টুডেন্ট ভিসা (ভাষা স্কুল ও বিশ্ববিদ্যালয়)",
            role: "শীর্ষস্থানীয় ল্যাঙ্গুয়েজ স্কুল ও ডিগ্রি প্রোগ্রাম",
            salary: "সপ্তাহে ২৮ ঘণ্টা বৈধ পার্ট-টাইম কাজের অনুমতি",
            eligibility: "HSC / ডিপ্লোমা / ডিগ্রি + নূন্যতম ১৫০ ঘণ্টার ভাষা শিক্ষা (N5)",
            href: "/study-in-japan",
          },
          {
            title: "TITP টেকনিক্যাল ইন্টার্নশিপ",
            role: "কনস্ট্রাকশন, ম্যানুফ্যাকচারিং ও প্যাকেজিং",
            salary: "১,৬০,০০০ – ১,৯০,০০০ ইয়েন + সাশ্রয়ী আবাসন",
            eligibility: "বেসিক জাপানি ভাষা + সুস্বাস্থ্যের অধিকারী",
            href: "/work-in-japan",
          },
        ],
        processSteps: [
          {
            num: "০১",
            title: "প্রোফাইল মূল্যায়ন ও পরামর্শ",
            desc: "আপনার শিক্ষাগত পটভূমি ও আগ্রহ যাচাই করে জাপান যাওয়ার সঠিক পথ নির্ধারণ।",
          },
          {
            num: "০২",
            title: "জাপানি ভাষা ও স্কিল অর্জন",
            desc: "ঢাকায় নিয়মিত ক্লাস এবং ২৪/৭ ডিজিটাল LMS ক্লাসরুমে পরীক্ষার সর্বোচ্চ প্রস্তুতি।",
          },
          {
            num: "০৩",
            title: "COE ফাইল ও স্পন্সর প্রসেসিং",
            desc: "জাপান ইমিগ্রেশনের নিয়ম মেনে নির্ভুল ফাইল তৈরি ও স্পন্সর সংক্রান্ত অডিট সম্পন্ন।",
          },
          {
            num: "০৪",
            title: "এম্বাসি ইন্টারভিউ ও ভিসা প্রাপ্তি",
            desc: "ক্যামেরা মক ইন্টারভিউয়ের মাধ্যমে আত্মবিশ্বাস তৈরি ও জাপানি এম্বাসি থেকে ভিসা সংগ্রহ।",
          },
          {
            num: "০৫",
            title: "জাপানে যাত্রা ও শুভ সূচনা",
            desc: "বিমানের টিকিট বুকিং, প্রাক-যাত্রা ওরিয়েন্টেশন এবং জাপানে পৌঁছে প্রাথমিক সেটেলমেন্ট।",
          },
        ],
        trustStats: [
          { num: "১,২০০+", label: "সফল ভিসা অর্জন", sub: "জাপানে অধ্যয়ন ও কর্মসংস্থানরত শিক্ষার্থী", icon: Award },
          { num: "৯৮%", label: "JLPT / NAT পাস রেট", sub: "দক্ষ শিক্ষক ও মক টেস্টের মাধ্যমে সাফল্য", icon: BookCheck },
          { num: "১২+ বছর", label: "বিশ্বস্ত অভিজ্ঞতার রেকর্ড", sub: "ঢাকা প্রধান অফিস ও জাপানে নিজস্ব নেটওয়ার্ক", icon: Globe2 },
          { num: "১০০%", label: "স্বচ্ছ ডকুমেন্টেশন", sub: "কোনো গোপন বা অপ্রত্যাশিত চার্জ ছাড়া", icon: ShieldCheck },
        ],
      },
      ja: {
        kicker: "KNLTC • 日本留学・特定技能就労総合コンサルタンシー",
        headline: "日本留学・就労・ビザ手続きの確かなゲートウェイ",
        subtitle:
          "留学ビザ・特定技能（SSW）・技能実習・日本語講座（N5〜N1）・在留資格申請書類作成・大使館面接対策まで一貫指導。",
        c1: "無料相談を予約する",
        c2: "日本語コースを見る",
        waBtn: "WhatsAppで相談する",
        hotlineLabel: "窓口電話:",
        portalCardKicker: "ダッカ中央ゲートウェイ",
        portalCardTitle: "日本留学・就労・日本語アカデミー",
        portalCardSub: "公式KNLTC日本渡航総合支援センター",
        portalTag1: "1,200名ビザ取得",
        portalTag2: "98%合格率",
        portalTag3: "公式LMS完備",
        portalLmsBtn: "公式受講生LMSにログイン",
        pathKicker: "日本進路プログラム",
        pathHeading: "日本渡航への3大基本進路",
        pathSub: "学歴・職歴や将来の目標に合わせた最適な進路プランをご案内します。",
        supportKicker: "KNLTCトータルサポート",
        supportTitle: "日本渡航に必要なすべての支援をワンストップで",
        supportSub:
          "語学学習からCOE申請、経費支弁書確認、面接対策、渡航後の生活サポートまで。",
        oppKicker: "募集中の最新求人・進学枠",
        oppTitle: "現在募集中の進路・求人情報",
        oppSub: "日本政府公認の留学および特定技能分野の最新募集要項。",
        processKicker: "計画的ロードマップ",
        processTitle: "日本渡航までの確実なステップ",
        processSub: "透明性が高く計画的な進行で、各段階を確実にサポートします。",
        trustKicker: "実績と信頼",
        trustTitle: "確かな実績と信頼の日本渡航サポート",
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
            highlight: "進学＆アルバイト",
          },
          {
            icon: BriefcaseBusiness,
            title: "日本就労（特定技能・TITP）",
            desc: "介護・農業・外食等の特定技能就労ビザ。月給15〜22万円水準。",
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
            desc: "特定技能分野別の技能測定試験対策。",
          },
          {
            icon: FileCheck2,
            title: "申請書類・COE作成",
            desc: "在留資格認定証明書（COE）申請と経費支弁審査。",
          },
          {
            icon: Users,
            title: "大使館面接シミュレーション",
            desc: "査証官面接シミュレーションと志望動機添削。",
          },
          {
            icon: Handshake,
            title: "教育機関・企業マッチング",
            desc: "提携日本語学校および受入れ企業への推薦。",
          },
          {
            icon: Globe2,
            title: "渡航後生活サポート",
            desc: "空港出迎え、区役所登録、生活オリエンテーション。",
          },
        ],
        opportunities: [
          {
            title: "SSW 介護 (Caregiver)",
            role: "特定技能1号 介護職員",
            salary: "180,000～220,000 円 / 月",
            eligibility: "JLPT N4 / JFT-Basic ＋ 介護技能試験",
            href: "/work-in-japan",
          },
          {
            title: "SSW 農業 (Agriculture)",
            role: "特定技能1号 耕種・畜産農業",
            salary: "150,000～200,000 円 / 月",
            eligibility: "JLPT N4 / JFT-Basic ＋ 農業技能試験",
            href: "/work-in-japan",
          },
          {
            title: "留学ビザ (Student Visa)",
            role: "日本語学校・大学進学コース",
            salary: "週28時間以内のアルバイト許可あり",
            eligibility: "高卒・短大・大卒 ＋ 基礎日本語（N5）",
            href: "/study-in-japan",
          },
          {
            title: "技能実習生 (TITP Intern)",
            role: "建設・製造現場トレーニング",
            salary: "160,000～190,000 円 ＋ 寮完備",
            eligibility: "基礎日本語 ＋ 健康状態良好",
            href: "/work-in-japan",
          },
        ],
        processSteps: [
          { num: "01", title: "無料進路診断", desc: "学歴・経歴に基づく最適な進路プランの策定。" },
          { num: "02", title: "日本語・技能学習", desc: "ダッカ校舎および公式LMSでの集中受講。" },
          { num: "03", title: "在留資格（COE）申請", desc: "出入国在留管理局への申請書類提出。" },
          { num: "04", title: "大使館ビザ面接・発給", desc: "模擬面接特訓と査証受取。" },
          { num: "05", title: "日本渡航・生活開始", desc: "渡航前オリエンテーションと現地定着支援。" },
        ],
        trustStats: [
          { num: "1,200名+", label: "日本渡航ビザ取得実績", sub: "留学生・特定技能人材を日本へ輩出", icon: Award },
          { num: "98%", label: "JLPT / NAT合格率", sub: "定期模擬テストと個別指導の成果", icon: BookCheck },
          { num: "12年+", label: "日本専門ガイダンス実績", sub: "ダッカ中心部校舎＆日本現地ネットワーク", icon: Globe2 },
          { num: "100%", label: "透明な費用体系", sub: "不当な追加費用は一切ありません", icon: ShieldCheck },
        ],
      },
    },
    language,
  );

  return (
    <div className="bg-white overflow-hidden">
      {/* Hero Section with Interactive Staggered Entrance */}
      <section className="relative overflow-hidden bg-[#fcfaf7] border-b border-stone-200 py-14 sm:py-20 lg:py-24">
        {/* Subtle decorative background blur orbs */}
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-red-100/40 blur-3xl pointer-events-none -z-0" />
        <div className="absolute top-1/2 -right-24 h-96 w-96 rounded-full bg-emerald-100/30 blur-3xl pointer-events-none -z-0" />

        <div className="container-narrow relative z-10">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left Hero Column */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="lg:col-span-7"
            >
              <motion.div variants={itemVariants} className="inline-flex items-center gap-2 mb-3">
                <span className="h-2 w-2 rounded-full bg-[#b91c1c] animate-pulse" />
                <p className="text-xs font-bold uppercase tracking-widest text-[#b91c1c]">
                  {t.kicker}
                </p>
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="text-3xl font-extrabold tracking-tight text-slate-900 leading-[1.2] sm:text-4xl md:text-5xl lg:text-[3.1rem]"
              >
                {t.headline}
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="mt-5 text-base sm:text-lg text-slate-700 leading-relaxed font-normal"
              >
                {t.subtitle}
              </motion.p>

              {/* Main Action Group with Spring Hovers */}
              <motion.div variants={itemVariants} className="mt-8 flex flex-col sm:flex-row gap-3.5">
                <motion.div whileHover={{ y: -3, scale: 1.015 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    asChild
                    size="lg"
                    className="w-full sm:w-auto bg-[#15803d] hover:bg-emerald-800 text-white font-semibold text-sm sm:text-base py-6 px-7 rounded-xl shadow-xs transition-colors"
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
                    className="w-full sm:w-auto border-stone-300 hover:bg-white text-slate-900 font-semibold text-sm sm:text-base py-6 px-6 rounded-xl transition-colors"
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
                className="mt-8 pt-6 border-t border-stone-200/80 flex flex-wrap items-center gap-5 text-xs sm:text-sm text-slate-600 font-medium"
              >
                <div className="flex items-center gap-2">
                  <PhoneCall className="h-4 w-4 text-[#b91c1c]" />
                  <span>
                    {t.hotlineLabel}{" "}
                    <a href={siteConfig.phoneHref} className="text-slate-900 font-bold hover:underline">
                      {siteConfig.phoneDisplay}
                    </a>
                  </span>
                </div>
                <span className="text-slate-300 hidden sm:inline">|</span>
                <a
                  href={siteConfig.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[#15803d] font-bold hover:underline transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>{t.waBtn}</span>
                </a>
              </motion.div>
            </motion.div>

            {/* Right Hero Column - Interactive Ambient Japan Gateway Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] as const }}
              className="lg:col-span-5"
            >
              <div className="relative rounded-3xl border border-stone-200/90 bg-white p-7 sm:p-8 shadow-md">
                {/* Floating Top Badge */}
                <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                      {t.portalCardKicker}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#b91c1c] bg-red-50 border border-red-200/70 px-2.5 py-0.5 rounded-md">
                    ISO & Gov. Aligned
                  </span>
                </div>

                <div className="mt-5">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
                    {t.portalCardTitle}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {t.portalCardSub}
                  </p>
                </div>

                {/* 3 Interactive Highlight Tags */}
                <div className="mt-6 grid grid-cols-3 gap-2">
                  <div className="rounded-xl border border-stone-200 bg-[#fcfaf7] p-2.5 text-center">
                    <Award className="h-4 w-4 text-[#b91c1c] mx-auto mb-1" />
                    <div className="text-xs font-bold text-slate-900">{t.portalTag1}</div>
                  </div>
                  <div className="rounded-xl border border-stone-200 bg-[#fcfaf7] p-2.5 text-center">
                    <BookCheck className="h-4 w-4 text-[#15803d] mx-auto mb-1" />
                    <div className="text-xs font-bold text-slate-900">{t.portalTag2}</div>
                  </div>
                  <div className="rounded-xl border border-stone-200 bg-[#fcfaf7] p-2.5 text-center">
                    <GraduationCap className="h-4 w-4 text-slate-800 mx-auto mb-1" />
                    <div className="text-xs font-bold text-slate-900">{t.portalTag3}</div>
                  </div>
                </div>

                {/* Official LMS Entrance Card CTA */}
                <div className="mt-6 pt-5 border-t border-stone-100">
                  <a
                    href="https://npw.bd/knltc"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between rounded-xl bg-red-50/90 border border-red-200/90 p-3.5 text-xs font-bold text-[#b91c1c] hover:bg-red-100 transition-all active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-[#b91c1c]">
                        <GraduationCap className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="block text-xs font-extrabold">{t.portalLmsBtn}</span>
                        <span className="block text-[10px] text-red-600/80 font-mono">npw.bd/knltc</span>
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3 Core Pathways - Animated In-View */}
      <section className="py-16 md:py-20 border-b border-stone-200 bg-white">
        <div className="container-narrow">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4 }}
            className="max-w-2xl mb-12"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-[#b91c1c]">
              {t.pathKicker}
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
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
                  whileHover="hover"
                  initial="rest"
                  className="group flex flex-col justify-between rounded-2xl border border-stone-200 bg-[#fcfaf7] p-7 transition-colors hover:border-stone-300 hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white border border-stone-200 text-slate-900 shadow-2xs group-hover:border-red-200 transition-colors">
                        <Icon className="h-5 w-5 text-[#b91c1c]" />
                      </div>
                      <span className="text-[11px] font-semibold text-[#15803d] bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                        {p.highlight}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-[#b91c1c] transition-colors">
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

      {/* 6 Support Ecosystem Pillars - Staggered entrance */}
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
              {t.supportKicker}
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
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
                  className="rounded-2xl border border-stone-200 bg-white p-6 shadow-2xs hover:border-stone-300 hover:shadow-md transition-shadow"
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

      {/* Ongoing Visa Opportunities */}
      <section className="py-16 md:py-20 border-b border-stone-200 bg-white">
        <div className="container-narrow">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4 }}
            className="max-w-2xl mb-12"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-[#b91c1c]">
              {t.oppKicker}
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
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
            {t.opportunities.map((opp, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -4, transition: { duration: 0.18 } }}
                className="group rounded-2xl border border-stone-200 bg-[#fcfaf7] p-6 sm:p-7 flex flex-col justify-between shadow-2xs hover:border-stone-300 hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#b91c1c] transition-colors">
                      {opp.title}
                    </h3>
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#15803d] bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{t.badgeOpen}</span>
                    </span>
                  </div>

                  <p className="mt-3 text-xs sm:text-sm font-semibold text-slate-700">
                    {opp.role}
                  </p>

                  <div className="mt-4 space-y-2 text-xs text-slate-600">
                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-slate-800 shrink-0">
                        {t.salaryLabel}:
                      </span>
                      <span className="text-emerald-800 font-bold">{opp.salary}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-slate-800 shrink-0">
                        {t.eligibilityLabel}:
                      </span>
                      <span>{opp.eligibility}</span>
                    </div>
                  </div>
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

      {/* 5-Step Process Roadmap */}
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
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
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
            {t.processSteps.map((step, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -4, transition: { duration: 0.18 } }}
                className="rounded-2xl border border-stone-200 bg-white p-5 shadow-2xs hover:border-stone-300 hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <span className="font-mono text-xs font-bold text-[#b91c1c] block mb-2">
                    {step.num}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-1 text-[11px] font-semibold text-[#15803d]">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>{t.verifiedStep}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Trust & Track Record Metrics - Spring Scale Animation */}
      <section className="py-16 md:py-20 border-b border-stone-200 bg-white">
        <div className="container-narrow">
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
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
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
              return (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="rounded-2xl border border-stone-200 bg-[#fcfaf7] p-6 text-center shadow-2xs hover:border-stone-300 hover:shadow-md transition-shadow"
                >
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-stone-200 text-[#b91c1c] mb-3 shadow-2xs">
                    <MIcon className="h-5 w-5" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                    {m.num}
                  </div>
                  <div className="mt-1 text-sm font-bold text-slate-800">{m.label}</div>
                  <div className="mt-1 text-xs text-slate-500">{m.sub}</div>
                </motion.div>
              );
            })}
          </motion.div>
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
            className="relative overflow-hidden rounded-3xl border border-stone-200 bg-white p-8 sm:p-12 text-center shadow-xs max-w-3xl mx-auto"
          >
            <div className="absolute top-0 right-0 -mr-16 -mt-16 h-40 w-40 rounded-full bg-red-100/40 blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-40 w-40 rounded-full bg-emerald-100/40 blur-2xl pointer-events-none" />

            <div className="relative z-10">
              <p className="text-xs font-bold uppercase tracking-widest text-[#b91c1c] mb-2">
                {t.finalKicker}
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
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
                      href={siteConfig.whatsappHref}
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
