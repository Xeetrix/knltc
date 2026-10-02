"use client";

import Link from "next/link";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";

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
            title: "SSW Caregiver (介護)",
            role: "Specified Skilled Worker in Elderly Healthcare",
            salary: "180,000 – 220,000 Yen / Month",
            eligibility: "JLPT N4 / JFT-Basic + Caregiver Skill Test",
            href: "/work-in-japan",
          },
          {
            title: "SSW Agriculture (農業)",
            role: "Crop & Livestock Agricultural Specialist",
            salary: "150,000 – 200,000 Yen / Month",
            eligibility: "JLPT N4 / JFT-Basic + Agriculture Skill Test",
            href: "/work-in-japan",
          },
          {
            title: "Student Visa (留学)",
            role: "Language Academy & University Admission",
            salary: "Legal 28 hrs/week part-time work permitted",
            eligibility: "HSC / Diploma / Degree + Basic Japanese (N5)",
            href: "/study-in-japan",
          },
          {
            title: "TITP Technical Intern (技能実習)",
            role: "Construction & Manufacturing Training",
            salary: "160,000 – 190,000 Yen + Subsidized Housing",
            eligibility: "Basic Japanese + Physical Fitness",
            href: "/work-in-japan",
          },
        ],
        processSteps: [
          { num: "01", title: "Free Profile Assessment", desc: "Evaluating your eligibility for study or employment." },
          { num: "02", title: "Japanese Language Training", desc: "Intensive classroom and digital LMS preparation." },
          { num: "03", title: "COE Application Filing", desc: "Filing Certificate of Eligibility dossiers with Japan Immigration." },
          { num: "04", title: "Visa Interview & Stamping", desc: "Mock interview coaching and embassy visa stamping." },
          { num: "05", title: "Fly to Japan & Settle In", desc: "Pre-departure briefing and safe arrival in Japan." },
        ],
        trustStats: [
          { num: "1,200+", label: "Visa Success Track Record", sub: "Students & workers departed to Japan", icon: Award },
          { num: "98%", label: "JLPT / NAT Pass Rate", sub: "Through our weekly structured mock exams", icon: BookCheck },
          { num: "12+", label: "Years Japan Experience", sub: "Dhaka campus & Japan partner network", icon: Globe2 },
          { num: "100%", label: "Transparent Processing", sub: "With zero hidden or unexpected fees", icon: ShieldCheck },
        ],
      },
      bn: {
        kicker: "KNLTC • জাপান এডুকেশন অ্যান্ড ক্যারিয়ার কনসালটেন্সি",
        headline: "জাপানে উচ্চশিক্ষা, ক্যারিয়ার ও ভিসা প্রসেসিংয়ের বিশ্বস্ত গেটওয়ে",
        subtitle:
          "স্টুডেন্ট ভিসা, SSW জব ভিসা, TITP টেকনিক্যাল ট্রেইনিং, জাপানি ভাষা শিক্ষা (N5–N1), স্কিল ট্রেনিং, নিখুঁত ডকুমেন্টেশন ও এম্বাসি ইন্টারভিউ প্রস্তুতি—এক ছাদের নিচে KNLTC ঢাকা।",
        c1: "ফ্রি কাউন্সেলিং বুক করুন",
        c2: "জাপানি ভাষা কোর্স",
        waBtn: "হোয়াটসঅ্যাপে সরাসরি কথা বলুন",
        hotlineLabel: "হটলাইন:",
        pathKicker: "জাপান পাথওয়ে",
        pathHeading: "আপনার জাপান গমনের মূল ৩টি পাথওয়ে",
        pathSub: "আপনার শিক্ষাগত যোগ্যতা ও ক্যারিয়ারের লক্ষ্য অনুযায়ী সঠিক প্রোগ্রাম নির্বাচন করুন।",
        supportKicker: "KNLTC সমন্বিত সেবা",
        supportTitle: "জাপান গমনের সম্পূর্ণ প্রস্তুতি — এক ছাদের নিচে",
        supportSub:
          "ভাষা শিক্ষা থেকে শুরু করে ফাইল ওপেনিং, ইন্টারভিউ, স্পনসর ভেরিফিকেশন ও জাপানে পৌঁছানোর পরও নিবিড় সহায়তা।",
        oppKicker: "চলমান নিয়োগ ও ভিসা সুযোগ",
        oppTitle: "বর্তমানে চলমান ভিসা ও ক্যারিয়ারের সুযোগসমূহ",
        oppSub: "জাপান সরকারের অনুমোদিত বিভিন্ন ক্যাটাগরিতে নিয়মিত আবেদন চলছে।",
        processKicker: "সুনির্দিষ্ট রোডম্যাপ",
        processTitle: "জাপান যাত্রার সুনির্দিষ্ট ধাপসমূহ",
        processSub: "স্বচ্ছ ও নিয়মতান্ত্রিক প্রক্রিয়ায় শুরু থেকে শেষ পর্যন্ত প্রতিটি ধাপে শতভাগ দিকনির্দেশনা।",
        trustKicker: "বিশ্বাস ও অর্জন",
        trustTitle: "বিশ্বাসের সাথে আপনার জাপান যাত্রা",
        finalKicker: "আজই আপনার আবেদন শুরু করুন",
        finalTitle: "আপনার জাপান যাত্রা শুরু করতে প্রস্তুত?",
        finalSub: "আমাদের অভিজ্ঞ কাউন্সেলরদের সাথে কথা বলে জেনে নিন আপনার প্রোফাইল অনুযায়ী সেরা প্রোগ্রাম কোনটি।",
        applyBtn: "আবেদন করুন",
        salaryLabel: "মাসিক বেতন / আয়",
        eligibilityLabel: "যোগ্যতা",
        stepLabel: "ধাপ",
        badgeOpen: "ভর্তি/আবেদন চলছে",
        viewDetails: "বিস্তারিত জানুন",
        verifiedStep: "ভেরিফাইড ধাপ",
        pathways: [
          {
            icon: GraduationCap,
            title: "জাপানে পড়াশোনা (Student Visa)",
            desc: "ভাষা স্কুল, আন্ডারগ্র্যাজুয়েট ও মাস্টার্স ডিগ্রি। COE ফাইল প্রসেসিং, স্কলারশিপ ও ভিসা গাইডেন্স।",
            cta: "স্টুডেন্ট ভিসা সম্পর্কে জানুন",
            href: "/study-in-japan",
            highlight: "উচ্চশিক্ষা ও পার্ট-টাইম কাজ",
          },
          {
            icon: BriefcaseBusiness,
            title: "জাপানে কাজ (SSW & TITP)",
            desc: "কেয়ারগিভার, এগ্রিকালচার ও ফুড সার্ভিস খাতে আকর্ষণীয় বেতন ও অফিসিয়াল চুক্তিতে চাকরি।",
            cta: "জব ভিসা সম্পর্কে জানুন",
            href: "/work-in-japan",
            highlight: "মাসিক আকর্ষণীয় বেতন",
          },
          {
            icon: Languages,
            title: "জাপানি ভাষা কোর্স (N5–N1)",
            desc: "JLPT, NAT-TEST ও JFT প্রস্তুতি। ডিজিটাল LMS এক্সেস এবং ১৫,০০০ টাকার ৩টি ফ্রি বোনাস কোর্স।",
            cta: "কোর্স বিস্তারিত ও ভর্তি",
            href: "/japanese-language",
            highlight: "৩টি বোনাস কোর্স ফ্রি",
          },
        ],
        supportPillars: [
          {
            icon: Languages,
            title: "ল্যাঙ্গুয়েজ প্রোগ্রাম",
            desc: "অভিজ্ঞ বাংলাদেশি ও নেটিভ সেনসিদের তত্ত্বাবধানে N5 থেকে N1 এবং স্পোকেন জাপানিজ।",
          },
          {
            icon: Wrench,
            title: "স্কিল ট্রেইনিং সাপোর্ট",
            desc: "SSW কেয়ারগিভার, এগ্রিকালচার ও ফুড সার্ভিস টেস্টের অফিসিয়াল টেকনিক্যাল ড্রিলস।",
          },
          {
            icon: FileCheck2,
            title: "নিখুঁত ডকুমেন্টেশন",
            desc: "ব্যাংক স্পনসরশিপ, ট্যাক্স অডিট, COE ফাইল সাবমিশন ও এম্বাসি পেপারস রিভিউ।",
          },
          {
            icon: Users,
            title: "এম্বাসি ইন্টারভিউ কোচিং",
            desc: "ভিসা অফিসারের মুখোমুখি হওয়ার সঠিক ম্যানার, জাপানি রিজিউমি ও লাইভ মক ইন্টারভিউ।",
          },
          {
            icon: Handshake,
            title: "স্কুল ও জব ম্যাচিং",
            desc: "জাপানের শীর্ষস্থানীয় ভাষা স্কুল ও স্বীকৃত রিক্রুটিং অর্গানাইজেশনের সাথে সরাসরি সংযোগ।",
          },
          {
            icon: Globe2,
            title: "আফটার-অ্যারাইভাল সাপোর্ট",
            desc: "জাপানে পৌঁছানোর পর এয়ারপোর্ট পিকআপ, পার্ট-টাইম জব গাইডেন্স ও ব্যাংক অ্যাকাউন্ট খোলা।",
          },
        ],
        opportunities: [
          {
            title: "SSW Caregiver (介護)",
            role: "স্পেশিফাইড স্কিল্ড র্কেয়ারগিভার",
            salary: "১৮০,০০০ – ২২০,০০০ ইয়েন (প্রায় ১.৫ – ১.৮ লাখ টাকা)",
            eligibility: "JLPT N4 / JFT-Basic + কেয়ারগিভার স্কিল টেস্ট",
            href: "/work-in-japan",
          },
          {
            title: "SSW Agriculture (農業)",
            role: "কৃষি ও ফসল ব্যবস্থাপনা কর্মী",
            salary: "১৫০,০০০ – ২০০,০০০ ইয়েন (প্রায় ১.৩ – ১.৬ লাখ টাকা)",
            eligibility: "JLPT N4 / JFT-Basic + এগ্রিকালচার টেস্ট",
            href: "/work-in-japan",
          },
          {
            title: "Student Visa (留学)",
            role: "ভাষা স্কুল ও বিশ্ববিদ্যালয় ভর্তি",
            salary: "সপ্তাহে ২৮ ঘণ্টা পার্ট-টাইম বৈধ কাজের সুযোগ",
            eligibility: "HSC / ডিপ্লোমা / অনার্স + বেসিক জাপানিজ (N5)",
            href: "/study-in-japan",
          },
          {
            title: "TITP Technical Intern (技能実習)",
            role: "কনস্ট্রাকশন ও ম্যানুফ্যাকচারিং",
            salary: "১৬০,০০০ – ১৯০,০০০ ইয়েন + আবাসন সুবিধা",
            eligibility: "বেসিক জাপানিজ + শারীরিক সুস্থতা",
            href: "/work-in-japan",
          },
        ],
        processSteps: [
          { num: "০১", title: "ফ্রি প্রোফাইল এসেসমেন্ট", desc: "আপনার শিক্ষাগত ব্যাকগ্রাউন্ড অনুযায়ী সেরা পাথওয়ে নির্বাচন।" },
          { num: "০২", title: "জাপানি ভাষা শিক্ষা (N5/N4)", desc: "KNLTC একাডেমিতে নিবিড় ক্লাসরুম ও ডিজিটাল LMS প্রস্তুতি।" },
          { num: "০৩", title: "ডকুমেন্টেশন ও COE ফাইলিং", desc: "জাপান ইমিগ্রেশনে সঠিক কাগজপত্র ও স্পনসরশিপ সাবমিশন।" },
          { num: "০৪", title: "এম্বাসি ইন্টারভিউ ও ভিসা প্রাপ্তি", desc: "মক ইন্টারভিউ প্রস্তুতি সম্পন্ন করে সফলভাবে ভিসা সংগ্রহ।" },
          { num: "০৫", title: "জাপান যাত্রা ও ক্যারিয়ার শুরু", desc: "প্রি-ডিপার্চার ব্রিফিং এবং জাপানে নিরাপদ অবতরণ।" },
        ],
        trustStats: [
          { num: "১,২০০+", label: "ভিসা সাকসেস রেকর্ড", sub: "স্টুডেন্ট ও কর্মী জাপান পৌঁছেছেন", icon: Award },
          { num: "৯৮%", label: "JLPT/NAT পাস রেট", sub: "আমাদের নিয়মিত নিবিড় পরীক্ষার মাধ্যমে", icon: BookCheck },
          { num: "১২+", label: "বছরের জাপান অভিজ্ঞতা", sub: "ঢাকায় নিজস্ব অফিস ও জাপানে নেটওয়ার্ক", icon: Globe2 },
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
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#fcfaf7] border-b border-stone-200 py-16 sm:py-20 md:py-24">
        <div className="container-narrow">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-widest text-[#b91c1c] mb-3">
              {t.kicker}
            </p>

            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 leading-[1.22] sm:text-4xl md:text-5xl lg:text-[3.15rem]">
              {t.headline}
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
              {t.subtitle}
            </p>

            {/* Main Action Group */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3.5">
              <Button
                asChild
                size="lg"
                className="bg-[#15803d] hover:bg-emerald-800 text-white font-semibold text-sm sm:text-base py-6 px-7 rounded-xl shadow-xs transition"
              >
                <Link href="/contact" className="flex items-center gap-2">
                  <span>{t.c1}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-stone-300 hover:bg-white text-slate-900 font-semibold text-sm sm:text-base py-6 px-6 rounded-xl transition"
              >
                <Link href="/japanese-language" className="flex items-center gap-2">
                  <Languages className="h-4 w-4 text-[#b91c1c]" />
                  <span>{t.c2}</span>
                </Link>
              </Button>
            </div>

            {/* Quick Hotline Strip */}
            <div className="mt-8 pt-6 border-t border-stone-200/80 flex flex-wrap items-center gap-5 text-xs sm:text-sm text-slate-600 font-medium">
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
                className="flex items-center gap-1.5 text-[#15803d] font-bold hover:underline"
              >
                <MessageCircle className="h-4 w-4" />
                <span>{t.waBtn}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Core Pathways */}
      <section className="py-16 md:py-20 border-b border-stone-200 bg-white">
        <div className="container-narrow">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-[#b91c1c]">
              {t.pathKicker}
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t.pathHeading}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t.pathSub}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {t.pathways.map((p, i) => {
              const Icon = p.icon;
              return (
                <div
                  key={i}
                  className="flex flex-col justify-between rounded-2xl border border-stone-200 bg-[#fcfaf7] p-7 transition hover:border-stone-300 hover:shadow-xs"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white border border-stone-200 text-slate-900 shadow-2xs">
                        <Icon className="h-5 w-5 text-[#b91c1c]" />
                      </div>
                      <span className="text-[11px] font-semibold text-[#15803d] bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                        {p.highlight}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 leading-snug">
                      {p.title}
                    </h3>
                    <p className="mt-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      {p.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-5 border-t border-stone-200/80">
                    <Link
                      href={p.href}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#b91c1c] hover:underline"
                    >
                      <span>{p.cta}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6 Support Ecosystem Pillars */}
      <section className="py-16 md:py-20 border-b border-stone-200 bg-[#fcfaf7]">
        <div className="container-narrow">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-[#15803d]">
              {t.supportKicker}
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t.supportTitle}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t.supportSub}
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {t.supportPillars.map((s, idx) => {
              const SIcon = s.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-stone-200 bg-white p-6 shadow-2xs hover:border-stone-300 transition"
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
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Ongoing Visa Opportunities */}
      <section className="py-16 md:py-20 border-b border-stone-200 bg-white">
        <div className="container-narrow">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-[#b91c1c]">
              {t.oppKicker}
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t.oppTitle}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t.oppSub}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {t.opportunities.map((opp, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-stone-200 bg-[#fcfaf7] p-6 sm:p-7 flex flex-col justify-between shadow-2xs hover:border-stone-300 transition"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                    <h3 className="text-lg font-bold text-slate-900">{opp.title}</h3>
                    <span className="text-[11px] font-semibold text-[#15803d] bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                      {t.badgeOpen}
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
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>

                  <Button
                    asChild
                    size="sm"
                    className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg px-3.5 h-8"
                  >
                    <Link href="/contact">{t.applyBtn}</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5-Step Process Roadmap */}
      <section className="py-16 md:py-20 border-b border-stone-200 bg-[#fcfaf7]">
        <div className="container-narrow">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-[#b91c1c]">
              {t.processKicker}
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t.processTitle}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t.processSub}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {t.processSteps.map((step, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-stone-200 bg-white p-5 shadow-2xs hover:border-stone-300 transition flex flex-col justify-between"
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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Track Record Metrics */}
      <section className="py-16 md:py-20 border-b border-stone-200 bg-white">
        <div className="container-narrow">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-[#15803d]">
              {t.trustKicker}
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t.trustTitle}
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {t.trustStats.map((m, i) => {
              const MIcon = m.icon;
              return (
                <div
                  key={i}
                  className="rounded-2xl border border-stone-200 bg-[#fcfaf7] p-6 text-center shadow-2xs hover:border-stone-300 transition"
                >
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-stone-200 text-[#b91c1c] mb-3">
                    <MIcon className="h-5 w-5" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                    {m.num}
                  </div>
                  <div className="mt-1 text-sm font-bold text-slate-800">{m.label}</div>
                  <div className="mt-1 text-xs text-slate-500">{m.sub}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Executive Final CTA Card */}
      <section className="py-16 md:py-20 bg-[#fcfaf7]">
        <div className="container-narrow">
          <div className="rounded-3xl border border-stone-200 bg-white p-8 sm:p-12 text-center shadow-xs max-w-3xl mx-auto">
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
              <Button
                asChild
                size="lg"
                className="bg-[#15803d] hover:bg-emerald-700 text-white font-bold text-sm px-7 py-6 rounded-xl shadow-xs"
              >
                <Link href="/contact" className="flex items-center gap-2">
                  <span>{t.c1}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-stone-300 hover:bg-stone-50 text-slate-800 font-semibold text-sm px-6 py-6 rounded-xl"
              >
                <a
                  href={siteConfig.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <MessageCircle className="h-4 w-4 text-[#15803d]" />
                  <span>{t.waBtn}</span>
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
