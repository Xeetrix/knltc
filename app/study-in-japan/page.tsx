"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  AlertCircle,
  ArrowRight,
  Banknote,
  Calendar,
  Check,
  CheckCircle2,
  CircleDollarSign,
  Clock,
  FileCheck2,
  GraduationCap,
  Info,
  Landmark,
  Languages,
  MapPin,
  MessageCircle,
  PhoneCall,
  Plane,
  ShieldCheck,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function StudyInJapanClient() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<"student" | "sponsor">("student");
  const [selectedIntake, setSelectedIntake] = useState<number>(1); // 1 = April (most popular)
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const t = translate(
    {
      bn: {
        badge: "KNLTC অফিশিয়াল জাপান এডুকেশন উইং",
        heroTitle: "জাপানে উচ্চশিক্ষা, চাকরি ও স্থায়ী বসবাসের বিশ্বস্ত পথ",
        heroSubtitle:
          "ভর্তি থেকে ভিসা, ব্যাংক সলভেন্সি ও জাপানে বাসস্থান—প্রতিটি ধাপে সরকারি স্ট্যাম্পে চুক্তি ও শতভাগ স্বচ্ছতার সাথে প্রফেশনাল ওয়ান-স্টপ সলিউশন।",
        consultBtn: "ফ্রি কাউন্সেলিং বুক করুন",
        callBtn: "হটলাইনে কথা বলুন",
        stats: [
          { val: "১২+", lbl: "বছরের অভিজ্ঞতা" },
          { val: "৮০০+", lbl: "শিক্ষার্থী কাউন্সেল্ড" },
          { val: "১০০%", lbl: "স্ট্যাম্পে আইনি চুক্তি" },
          { val: "১৬+", lbl: "জাপানের প্রধান শহর" },
        ],
        intakeBoxTitle: "আসন্ন সেশন ও ইনটেক চয়েস",
        intakeBoxSub: "ভর্তির সময়সূচি ও আসন সংখ্যা",
        intakeEnrolling: "ভর্তি চলছে",
        whyChooseIntake: "কেন এই সেশনটি বেছে নেবেন:",
        secureSeatBtn: "এই সেশনে নিজের আসন নিশ্চিত করুন",
        whyTitle: "কেন KNLTC জাপানের জন্য অনন্য ও নির্ভরযোগ্য?",
        whySubtitle: "ব্রোশিওর অনুযায়ী আমাদের স্বচ্ছ কাজের নীতি ও শিক্ষার্থীদের দেওয়া সুযোগ-সুবিধা",
        whyCards: [
          {
            title: "আইনি চুক্তি ও শতভাগ সততা",
            desc: "৩০০ টাকা সরকারি স্ট্যাম্পে আইনি চুক্তি। কোনো ফাইল ওপেনিং বা অগ্রিম সার্ভিস চার্জ নেই।",
          },
          {
            title: "৩টি প্রিমিয়াম কোর্স ফ্রি",
            desc: "N5 শেষে এম্বাসি ইন্টারভিউ (১৫ দিন), সিভি রাইটিং (১০ দিন) ও পার্ট-টাইম জব কোর্স সম্পূর্ণ ফ্রি।",
          },
          {
            title: "COE অপেক্ষাকালে N4 ফ্রি",
            desc: "COE-এর জন্য ৩ মাস অপেক্ষার সময়ে শিক্ষার্থীকে বিনামূল্যে সম্পূর্ণ N4 কোর্স করানো হয়।",
          },
          {
            title: "জাপানে সরাসরি কেয়ার",
            desc: "বিমানবন্দরে রিসিভ, বাসস্থান খোঁজা, ব্যাংক একাউন্ট ওপেনিং ও পার্ট-টাইম জবে প্রত্যক্ষ সহায়তা।",
          },
        ],
        roadmapTitle: "১০-ধাপে জাপানের স্টুডেন্ট ভিসা আবেদন প্রক্রিয়া",
        roadmapSubtitle: "অফিশিয়াল ব্রোশিওরের পেজ ৭–৯ অনুযায়ী স্বচ্ছ ও বিস্তারিত রোডম্যাপ",
        stepPrefix: "ধাপ",
        citiesTitle: "জাপানের যে শহরগুলোতে স্টুডেন্ট ভিসায় আবেদন করা যাবে",
        citiesSubtitle: "আমাদের সরাসরি নেটওয়ার্কের আওতাভুক্ত জাপানের ১৬টি শীর্ষ স্টুডেন্ট সিটি",
        citiesBadge: "১৬টি অনুমোদিত শহর",
        citiesFootnote: "*এই ১৬টি শহর ছাড়াও জাপানের যেকোনো শহরের সরকার অনুমোদিত শিক্ষা প্রতিষ্ঠানে ভর্তির সুযোগ রয়েছে।",
        checklistTitle: "আবেদনের প্রয়োজনীয় ডকুমেন্টস ও ব্যাংক গাইডলাইন",
        checklistSubtitle: "ব্রোশিওরের পেজ ৪, ৫ ও ৬ অনুযায়ী নির্ভুল চেকলিস্ট",
        tabStudent: "স্টুডেন্টের প্রয়োজনীয় ডকুমেন্টস",
        tabSponsor: "স্পন্সর ও ব্যাংক সলভেন্সি গাইডলাইন",
        studentSectionTitle: "শিক্ষার্থীর প্রয়োজনীয় অরিজিনাল ডকুমেন্টস (ইন্টারভিউয়ের পূর্বে আবশ্যক)",
        sponsorSectionTitle: "স্পন্সরের যোগ্যতা, ট্যাক্স ও ব্যাংক সলভেন্সি নিয়মাবলী (মিনিস্ট্রি অফ জাস্টিস মানদণ্ড)",
        studentChecklist: [
          "SSC সার্টিফিকেট ও মার্কশিট (অরিজিনাল এবং অনলাইন ভেরিফিকেশন কপি)",
          "HSC / ডিপ্লোমা সার্টিফিকেট ও মার্কশিট (অরিজিনাল এবং অনলাইন ভেরিফিকেশন কপি)",
          "অনার্স / মাস্টার্স সার্টিফিকেট ও মার্কশিট (অধ্যয়নরত হলে প্রত্যয়নপত্র, MOI ও রিকমেন্ডেশন লেটার)",
          "বার্থ সার্টিফিকেট (ইংরেজি ও অনলাইন ভেরিফায়েড কপি)",
          "পাসপোর্ট (প্রথম ২ পৃষ্ঠার স্পষ্ট রঙিন স্ক্যান কপি) ও NID (উভয় সাইড)",
          "সদ্য তোলা ৩ × ৪ সেমি সাইজের রঙিন ছবি (১০ কপি)",
          "সিটি কর্পোরেশন / পৌরসভা / ইউনিয়ন পরিষদ থেকে ফ্যামিলি রিলেশনশিপ সার্টিফিকেট",
          "চাকরিরত থাকলে অফিশিয়াল জব এক্সপেরিয়েন্স সার্টিফিকেট",
        ],
        sponsorChecklist: [
          "অনুমোদিত স্পন্সর: বাবা, মা, বড় ভাই অথবা বড় বোন (যেকোনো একজন বৈধ স্পন্সর হতে পারবেন)",
          "স্পন্সরের জাতীয় পরিচয়পত্র (NID) রঙিন স্ক্যান কপি ও ২ সেট ছবি",
          "স্পন্সরের সক্রিয় ব্যাংক অ্যাকাউন্ট (সর্বনিম্ন ১৮ লক্ষ টাকা ব্যালেন্স সহ ১ বছরের স্টেটমেন্ট ও সলভেন্সি)",
          "স্পন্সরের টিআইএন (TIN) সার্টিফিকেট ও ইনকাম ট্যাক্স রিটার্ন ফাইল (বিগত ৩ বছর)",
          "ব্যবসা থাকলে আপডেটেড ট্রেড লাইসেন্স / চাকরি থাকলে বেতন প্রত্যয়নপত্র",
          "এম্বাসি ইন্টারভিউয়ের সময় ৬ মাসের ব্যাংক স্টেটমেন্টে ১০–১২ লক্ষ টাকা পর্যাপ্ত ব্যালেন্স থাকতে হবে",
          "অনুমোদিত ব্যাংক তালিকা: জনতা, সোনালী, রূপালী, কৃষি, ব্যাংক এশিয়া, এনআরবিসি, প্রাইম, উত্তরা, ইউসিবি, ঢাকা ব্যাংক ইত্যাদি",
        ],
        calcBadge: "বাস্তবসম্মত আর্থিক হিসাব",
        calcTitle: "পার্ট-টাইম কাজ ও বাৎসরিক আয়-ব্যয়ের হিসাব",
        calcSubtitle: "জাপান সরকার অনুমোদিত কাজের নিয়ম ও বাস্তবসম্মত আর্থিক হিসাব (ব্রোশিওরের পেজ ৩)",
        calcCards: [
          {
            tag: "কাজের অনুমোদন",
            val: "২৮ ঘণ্টা / সপ্তাহ",
            desc: "মাসে ১২০ ঘণ্টা এবং গ্রীষ্ম ও শীতকালীন ছুটিতে (২ মাস) ফুলটাইম ২৪০ ঘণ্টা/মাস কাজের অনুমতি।",
          },
          {
            tag: "গড় মাসিক আয়",
            val: "৳ ১,২০,০০০+",
            desc: "প্রতি ঘণ্টায় ন্যূনতম ১,০০০ টাকা হিসাবে বছরে প্রায় ১৫,৬০,০০০ টাকা পর্যন্ত বৈধ উপার্জন।",
          },
          {
            tag: "বাৎসরিক নিট সঞ্চয়",
            val: "৳ ১০,৮০,০০০",
            desc: "থাকা-খাওয়ার বাৎসরিক ৪,৮০,০০০ টাকা খরচ বাদ দিয়েও ২য় বছরের টিউশন ফি প্রদান ও দেশে টাকা পাঠানো সম্ভব।",
          },
        ],
        packagesTitle: "ভিসা সার্ভিস প্যাকেজ (এক নজরে সব খরচ)",
        packagesSubtitle: "অফিশিয়াল ব্রোশিওরের পেজ ১০ অনুযায়ী সম্পূর্ণ স্বচ্ছ খরচ বিবরণী। কোনো গোপন ফি নেই।",
        packagesRegularBadge: "বাজেট-বান্ধব স্বনির্ভর প্যাকেজ",
        packagesRegularLabel: "রেগুলার প্যাকেজ",
        packagesRegularPrice: "৳ ১,৫০,০০০",
        packagesRegularInWords: "এক লক্ষ পঞ্চাশ হাজার টাকা",
        packagesRegularDesc: "যারা বাজেট-বান্ধব এবং ধাপে ধাপে নিজের প্রক্রিয়ায় এগোতে চান, তাদের জন্য আদর্শ।",
        packagesRegularPayment: "সার্ভিস ফি: প্রি-ভিসা (COE) আসার পর পরিশোধযোগ্য",
        packagesRegularHighlight: "ভিসা/COE পাওয়ার পূর্বে অগ্রিম কোনো সার্ভিস চার্জ নেই",
        packagesRegularFeaturesTitle: "প্যাকেজে যা যা পাচ্ছেন:",
        packagesRegularFeatures: [
          "সম্পূর্ণ ফাইল ওপেনিং ও ডকুমেন্ট ভেরিফিকেশন",
          "জাপানি শিক্ষা প্রতিষ্ঠানে আবেদন ও ইন্টারভিউ প্রস্তুতি",
          "N5 শেষে ৩টি প্রিমিয়াম প্রস্তুতি কোর্স সম্পূর্ণ ফ্রি (১৫ দিন এম্বাসি ইন্টারভিউ, ১০ দিন সিভি রাইটিং, ১০ দিন জব প্রস্তুতি)",
          "COE অপেক্ষাকালে ৩ মাস ফ্রি জাপানিজ N4 কোর্স",
          "জাপানে পৌঁছানোর পর ফ্রি এয়ারপোর্ট পিক-আপ ও বাসস্থান গাইড",
          "টিউশন ফি, এয়ার টিকিট ও সরকারি ফি শিক্ষার্থী নিজে বহন করবে",
        ],
        packagesRegularFootnote: "*রেগুলার প্যাকেজে স্ট্যাম্প, সিলেকশন ও অনুবাদ খরচ সাধারণত Non-Refundable বা অফেরতযোগ্য।",
        packagesRegularCta: "রেগুলার প্যাকেজে কাউন্সেলিং নিন",
        packagesPremiumBadge: "সর্বোচ্চ জনপ্রিয় • নো-ভিসা নো-লস",
        packagesPremiumTag: "অল-ইন-ওয়ান প্রিমিয়াম",
        packagesPremiumLabel: "প্রিমিয়াম প্যাকেজ",
        packagesPremiumPrice: "৳ ১১,০০,০০০",
        packagesPremiumInWords: "এগারো লক্ষ টাকা",
        packagesPremiumDesc: "সম্পূর্ণ হ্যাসেল-ফ্রি অভিজ্ঞতা। যাবতীয় দায়-দায়িত্ব KNLTC বহন করে, যাতে যাত্রা হয় নিশ্চিন্ত।",
        packagesPremiumPayment: "চুক্তির সময় ১০% (ভিসা না হলে সম্পূর্ণ রিফান্ডযোগ্য)",
        packagesPremiumHighlight: "ভিসা না হলে নিজের কোনো আর্থিক ক্ষতি নেই (১০০% মানিব্যাক গ্যারান্টি)",
        packagesPremiumFeaturesTitle: "KNLTC বহন করবে এমন সেবাসমূহ:",
        packagesPremiumFeatures: [
          "১ম বছরের সম্পূর্ণ টিউশন ফি (৳ ৭,০০,০০০) KNLTC বহন করবে",
          "আন্তর্জাতিক এয়ার টিকিট (৳ ৬৫,০০০) KNLTC বহন করবে",
          "ভাষা কোর্স ফি, স্ট্যাম্প, সিলেকশন, অনুবাদ ও শিপিং KNLTC বহন করবে",
          "VFS গ্লোবাল ভিসা আবেদন ফি KNLTC বহন করবে",
          "ভিসা না হলে চুক্তি অনুযায়ী ১০% অগ্রিম সম্পূর্ণ রিফান্ডযোগ্য",
          "৩টি প্রিমিয়াম প্রস্তুতি কোর্স + সম্পূর্ণ N4 কোর্স ফ্রি অন্তর্ভুক্ত",
          "জাপানে এয়ারপোর্ট পিক-আপ, আবাসন, পার্ট-টাইম জব ও ব্যাংক একাউন্ট সাপোর্ট",
        ],
        packagesPremiumCta: "প্রিমিয়াম প্যাকেজে আবেদন করুন",
        tableTitle: "সার-সংক্ষেপ (এক নজরে সব খরচ)",
        tableSubtitle: "অফিশিয়াল ব্রোশিওরের পেজ ১০ অনুযায়ী প্রতিটি ধাপের বিস্তারিত খরচের তুলনা",
        tableBadge: "Brochure Verified",
        colService: "সেবার বিবরণ",
        colBudget: "বাজেট / আনুমানিক খরচ",
        colRegular: "রেগুলার প্যাকেজ (৳ ১,৫০,০০০)",
        colPremium: "প্রিমিয়াম প্যাকেজ (৳ ১১,০০,০০০)",
        notesTitle: "প্যাকেজ ও জাপান যাত্রা সংক্রান্ত জরুরি নোট (ব্রোশিওর অনুযায়ী)",
        notePersonalTitle: "ব্যক্তিগত হাতখরচ:",
        notePersonalDesc:
          "জাপানে যাওয়ার সময় অবশ্যই স্টুডেন্টের সাথে করে ১ লক্ষ জাপানিজ ইয়েন (বাংলাদেশী টাকায় প্রায় ৮০ হাজার টাকা) সাথে করে নিয়ে আসতে হবে তার ব্যক্তিগত খরচের জন্য।",
        noteDormitoryTitle: "ডরমেটরি পলিসি:",
        noteDormitoryDesc:
          "যদি কোনো শিক্ষা প্রতিষ্ঠানে ডরমেটরি সুবিধা থাকে সেক্ষেত্রে ডরমেটরির খরচ সংশ্লিষ্ট প্রতিষ্ঠানে অগ্রিম প্রদান করতে হয়।",
        noteFxTitle: "মুদ্রা মান সমন্বয়:",
        noteFxDesc: "উপরে উল্লিখিত খরচগুলো ডলার ও জাপানিজ ইয়েন মূল্যের ওঠানামার কারণে কিছুটা কম-বেশি হতে পারে।",
        noteSupportTitle: "জাপানে পৌঁছানোর পর সাপোর্ট:",
        noteSupportDesc:
          "এয়ারপোর্ট পিক-আপ, নিরাপদ বাসস্থান ব্যবস্থা, পার্ট-টাইম জবে সহযোগিতা, ব্যাংক অ্যাকাউন্ট ও হেলথ ইন্স্যুরেন্সে প্রত্যক্ষ সহায়তা।",
        faqTitle: "জাপানে পড়াশোনা সংক্রান্ত সাধারণ প্রশ্নোত্তর",
        finalBadge: "KNLTC এডমিশন ২০২৬–২০২৭",
        finalTitle: "জাপানে আপনার উচ্চশিক্ষার স্বপ্নপূরণ শুরু হোক আজই",
        finalSubtitle: "অভিজ্ঞ জাপানিজ গ্র্যাজুয়েট ও এক্সপার্ট কনসালট্যান্টদের সাথে কথা বলে সঠিক সিদ্ধান্ত নিন।",
        whatsappCta: "WhatsApp-এ সরাসরি কথা বলুন",
      },
      en: {
        badge: "KNLTC Official Japan Education Wing",
        heroTitle: "Trusted Pathway for Higher Education, Career & Settlement in Japan",
        heroSubtitle:
          "From school admission to visa, bank solvency, and housing in Japan—a fully transparent, government-stamp bound one-stop solution for aspiring students.",
        consultBtn: "Book Free Consultation",
        callBtn: "Call Hotline",
        stats: [
          { val: "12+", lbl: "Years Experience" },
          { val: "800+", lbl: "Students Advised" },
          { val: "100%", lbl: "Stamp Protected" },
          { val: "16+", lbl: "Major Cities" },
        ],
        intakeBoxTitle: "Upcoming Intakes & Sessions",
        intakeBoxSub: "Admission schedule and seat status",
        intakeEnrolling: "Now Enrolling",
        whyChooseIntake: "Why choose this intake:",
        secureSeatBtn: "Secure Your Seat for this Intake",
        whyTitle: "Why KNLTC is Bangladesh's Most Reliable Japan Consultant?",
        whySubtitle: "Our transparent policies and verified commitments from the official brochure",
        whyCards: [
          {
            title: "Legal Stamp Agreement & Total Honesty",
            desc: "Binding contract on BDT 300 government stamp. No file opening charges or advance service fees.",
          },
          {
            title: "3 Free Premium Courses",
            desc: "Upon N5 completion, embassy interview (15d), Japanese CV writing (10d), and part-time job prep courses are free.",
          },
          {
            title: "Free N4 Course During COE Wait",
            desc: "Students receive a full N4 Japanese course completely free during the 3-month COE waiting period.",
          },
          {
            title: "Direct On-Ground Care in Japan",
            desc: "Airport pickup, student housing arrangement, bank account setup, and part-time job support in Japan.",
          },
        ],
        roadmapTitle: "10-Step Student Visa Process to Japan",
        roadmapSubtitle: "Detailed, step-by-step roadmap from pages 7–9 of our official brochure",
        stepPrefix: "Step",
        citiesTitle: "Destinations Across Japan for Student Visa",
        citiesSubtitle: "16 prime student destinations backed by KNLTC institutional tie-ups",
        citiesBadge: "16 Approved Cities",
        citiesFootnote: "*Besides these 16 cities, admission is available at accredited institutions anywhere in Japan.",
        checklistTitle: "Document Checklist & Bank Guidelines",
        checklistSubtitle: "Accurate requirements per brochure pages 4, 5 & 6",
        tabStudent: "Student Required Documents",
        tabSponsor: "Sponsor & Bank Solvency Rules",
        studentSectionTitle: "Original Student Documents Required (Essential Prior to Interview)",
        sponsorSectionTitle: "Sponsor Eligibility, Tax & Solvency Guidelines (Ministry of Justice Standard)",
        studentChecklist: [
          "SSC Certificate & Marksheet (Original & Online Verification Copy)",
          "HSC / Diploma Certificate & Marksheet (Original & Online Verification Copy)",
          "Honours / Masters Certificate & Marksheet (or Enrolment Certificate, MOI & Recommendation Letter)",
          "Birth Certificate (English & Online Verified Copy)",
          "Passport (Clear color scan of first 2 pages) & National ID Card (both sides)",
          "Recent 3 × 4 cm color photos (10 copies)",
          "Family Relationship Certificate from City Corporation / Municipality / Union Parishad",
          "Official Job Experience Certificate (if currently employed)",
        ],
        sponsorChecklist: [
          "Approved Sponsors: Father, Mother, Elder Brother, or Elder Sister (any one valid sponsor)",
          "Sponsor's National ID (NID) color scan and 2 sets of photographs",
          "Active sponsor bank account (Minimum BDT 1,800,000 balance with 1-year statement and solvency certificate)",
          "Sponsor's TIN Certificate & Income Tax Return files (last 3 consecutive years)",
          "Valid Trade License (if business owner) or Salary Certificate (if employed)",
          "Minimum BDT 1,000,000 to 1,200,000 maintained balance required during embassy interview",
          "Approved Banks: Janata, Sonali, Rupali, Krishi, Bank Asia, NRBC, Prime, Uttara, UCB, Dhaka Bank, etc.",
        ],
        calcBadge: "Realistic Financial Feasibility",
        calcTitle: "Part-Time Work & Annual Income/Expense Breakdown",
        calcSubtitle: "Government permitted work hours and real financial feasibility (Page 3 of brochure)",
        calcCards: [
          {
            tag: "Work Permission",
            val: "28 Hours / Week",
            desc: "120 hours/month during classes, and full-time 240 hours/month during summer & winter breaks.",
          },
          {
            tag: "Avg. Monthly Income",
            val: "BDT 120,000+",
            desc: "At ~BDT 1,000/hr minimum wage, students earn up to BDT 1,560,000 legally per year.",
          },
          {
            tag: "Net Yearly Savings",
            val: "BDT 1,080,000",
            desc: "Even after BDT 480,000 annual living cost, students save enough to cover 2nd year tuition and send remittances.",
          },
        ],
        packagesTitle: "Visa Service Packages (All Costs at a Glance)",
        packagesSubtitle: "Direct, transparent breakdown from brochure page 10. No hidden charges.",
        packagesRegularBadge: "Budget-Friendly Self-Reliant Package",
        packagesRegularLabel: "Regular Package",
        packagesRegularPrice: "BDT 150,000",
        packagesRegularInWords: "One Lakh Fifty Thousand BDT",
        packagesRegularDesc: "Ideal for budget-conscious students seeking self-managed, step-by-step processing.",
        packagesRegularPayment: "Service Fee: Payable after Pre-Visa (COE) issuance",
        packagesRegularHighlight: "No advance service charge before visa/COE issuance",
        packagesRegularFeaturesTitle: "Included in Regular Package:",
        packagesRegularFeatures: [
          "Complete file assessment and application preparation",
          "Japanese school selection & interview coaching",
          "3 Free Premium courses post N5 (Embassy interview, CV writing, part-time job prep)",
          "Free N4 Japanese course during the 3-month COE waiting period",
          "Free airport pickup and housing guidance upon landing in Japan",
          "Tuition fee, flight ticket, and visa fees covered by student as incurred",
        ],
        packagesRegularFootnote: "*In the regular package, stamp, selection, and translation fees are non-refundable.",
        packagesRegularCta: "Book Regular Package Counseling",
        packagesPremiumBadge: "Most Popular • Zero Risk Guarantee",
        packagesPremiumTag: "All-in-One Premium",
        packagesPremiumLabel: "Premium Package",
        packagesPremiumPrice: "BDT 1,100,000",
        packagesPremiumInWords: "Eleven Lakh BDT",
        packagesPremiumDesc: "Complete hassle-free experience. KNLTC covers all major expenses so your journey is worry-free.",
        packagesPremiumPayment: "Only 10% at agreement (100% refundable if visa is refused)",
        packagesPremiumHighlight: "Zero financial loss if visa is not granted (100% money-back guarantee)",
        packagesPremiumFeaturesTitle: "Expenses Covered by KNLTC:",
        packagesPremiumFeatures: [
          "1st Year Full Tuition Fee (BDT 700,000) covered by KNLTC",
          "International Air Ticket to Japan (BDT 65,000) covered by KNLTC",
          "Language course, stamp, selection, translation & courier fees covered by KNLTC",
          "VFS Global visa submission fee covered by KNLTC",
          "10% agreement fee 100% refundable if visa is refused",
          "3 Premium prep courses + complete free N4 course included",
          "Airport pickup, student housing, part-time job assistance & bank account guidance in Japan",
        ],
        packagesPremiumCta: "Apply for Premium Package",
        tableTitle: "Summary Cost Breakdown (All Fees at a Glance)",
        tableSubtitle: "Detailed stage-by-stage comparison directly from Page 10 of our official brochure",
        tableBadge: "Brochure Verified",
        colService: "Service Description",
        colBudget: "Budget / Estimated Cost",
        colRegular: "Regular Package (BDT 150,000)",
        colPremium: "Premium Package (BDT 1,100,000)",
        notesTitle: "Important Brochure Guidelines & Travel Notes",
        notePersonalTitle: "Personal Pocket Money:",
        notePersonalDesc:
          "Students must carry 100,000 Japanese Yen (~BDT 80,000) in cash for personal living expenses upon arrival.",
        noteDormitoryTitle: "Dormitory Policy:",
        noteDormitoryDesc:
          "If the educational institution provides dormitory accommodations, dormitory fees must be paid in advance.",
        noteFxTitle: "Currency Exchange Adjustments:",
        noteFxDesc: "All stated costs may slightly adjust based on currency exchange rate fluctuations (USD/JPY/BDT).",
        noteSupportTitle: "Post-Arrival Support in Japan:",
        noteSupportDesc:
          "Airport pickup, safe student housing, direct assistance with part-time job matching, bank account opening, and health insurance.",
        faqTitle: "Frequently Asked Questions",
        finalBadge: "KNLTC Admissions 2026–2027",
        finalTitle: "Start Your Japanese Higher Education Journey Today",
        finalSubtitle: "Consult directly with Japan-educated counsellors and plan your intake confidently.",
        whatsappCta: "Chat Directly on WhatsApp",
      },
      ja: {
        badge: "KNLTC 公式日本留学・キャリア部門",
        heroTitle: "日本留学・就職・定住への最も確かな道標",
        heroSubtitle:
          "学校選定からビザ申請、資金証明、日本現地住居まで。公的契約書に基づく完全透明・ワンストップサポート。",
        consultBtn: "無料カウンセリング予約",
        callBtn: "ホットラインに電話",
        stats: [
          { val: "12+", lbl: "年の実績" },
          { val: "800+", lbl: "名以上の留学相談" },
          { val: "100%", lbl: "契約書保護" },
          { val: "16+", lbl: "提携都市" },
        ],
        intakeBoxTitle: "入学時期と募集スケジュール",
        intakeBoxSub: "入学期ごとの募集状況と期間",
        intakeEnrolling: "出願受付中",
        whyChooseIntake: "この入学期を選ぶメリット：",
        secureSeatBtn: "この入学期の席を確保する",
        whyTitle: "KNLTCが選ばれる理由と安心のサポート体制",
        whySubtitle: "公式パンフレットに記載された透明な方針と独自の学生支援制度",
        whyCards: [
          {
            title: "公的契約と絶対の誠実さ",
            desc: "300タカ相当の公的印紙による委任契約。ファイル開設料や前払い手数料は一切不要。",
          },
          {
            title: "3大特講コース無料提供",
            desc: "N5修了後、大使館面接対策（15日）、履歴書作成（10日）、アルバイト面接指導を無料提供。",
          },
          {
            title: "COE待機中の無料N4特訓",
            desc: "在留資格認定（COE）交付までの約3ヶ月間、KNLTCでN4レベルを完全無料で学習可能。",
          },
          {
            title: "日本現地直営サポート",
            desc: "空港出迎え、安心な住居手配、銀行口座開設、アルバイト紹介まで現地スタッフが伴走。",
          },
        ],
        roadmapTitle: "日本留学ビザ取得までの10ステップ",
        roadmapSubtitle: "公式パンフレット7〜9ページに基づく完全ロードマップ",
        stepPrefix: "ステップ",
        citiesTitle: "留学ビザ申請が可能な日本の主要都市",
        citiesSubtitle: "KNLTCが提携校を持つ日本全国16の主要留学先",
        citiesBadge: "提携16都市",
        citiesFootnote: "※上記16都市のほか、日本全国の正規認可校への申請が可能です。",
        checklistTitle: "必要書類と経費支弁・銀行証明ガイド",
        checklistSubtitle: "パンフレット4・5・6ページ準拠のチェックリスト",
        tabStudent: "申請者（学生）本人の書類",
        tabSponsor: "経費支弁者・銀行残高証明",
        studentSectionTitle: "申請者本人の原本書類一覧（面接前に提出必須）",
        sponsorSectionTitle: "経費支弁要件・納税証明・残高証明規定（法務省基準）",
        studentChecklist: [
          "SSC（中等教育）修了証・成績証明書（原本およびオンライン検証写し）",
          "HSC / ディプロマ修了証・成績証明書（原本およびオンライン検証写し）",
          "学士・修士の学位記・成績書（在学中の場合は在学証明・MOI・推薦状）",
          "出生証明書（英文表記・オンライン認証済み）",
          "パスポート（写真ページ鮮明カラースキャン）および国民身分証（NID両面）",
          "直近撮影のカラー写真 3×4cm（10枚）",
          "自治体発行の家族関係証明書",
          "職歴がある場合は正規の在職・職歴証明書",
        ],
        sponsorChecklist: [
          "認定経費支弁者：父・母・実兄・実姉（いずれか1名）",
          "経費支弁者の身分証（NID）鮮明カラースキャンおよび写真2組",
          "有効な銀行口座（残高最低180万タカ、過去1年間の取引明細書および残高証明書）",
          "納税者番号（TIN）証明書および直近3年分の所得税確定申告書控",
          "自営業の場合は最新の営業許可証（Trade License）、給与所得者は給与証明書",
          "大使館面接時に100万〜120万タカの十分な残高が維持されていること",
          "指定金融機関：ジャナタ、ソナリ、ルパリ、クリシ、バンクアジア、NRBC、プライム、ダッカ銀行等",
        ],
        calcBadge: "確かな生活設計",
        calcTitle: "アルバイト規定と年間収支シミュレーション",
        calcSubtitle: "法定資格外活動規定に基づくリアルな生活設計（パンフレット3ページ）",
        calcCards: [
          {
            tag: "法定就労可能時間",
            val: "週28時間以内",
            desc: "学期中は月120時間、夏期・冬期の長期休暇中は月240時間まで就労が許可されます。",
          },
          {
            tag: "平均月収目安",
            val: "約 120,000 タカ+",
            desc: "最低時給1,000タカ相当で計算した場合、年間最大156万タカの合法的な収入が見込めます。",
          },
          {
            tag: "年間推定純貯蓄",
            val: "約 1,080,000 タカ",
            desc: "年間生活費約48万タカを差し引いても、翌年度学費の支払いや母国送金が十分可能です。",
          },
        ],
        packagesTitle: "ビザサービスパッケージ（費用一覧）",
        packagesSubtitle: "公式パンフレット10ページ記載の明朗会計。隠れた費用はありません。",
        packagesRegularBadge: "予算重視・自己管理型プラン",
        packagesRegularLabel: "レギュラープラン",
        packagesRegularPrice: "150,000 BDT",
        packagesRegularInWords: "15万タカ（約150,000 BDT）",
        packagesRegularDesc: "予算を抑えて段階的に自分主導で進めたい留学生に最適なプランです。",
        packagesRegularPayment: "サービス料：在留資格認定証明書（COE）交付後のお支払い",
        packagesRegularHighlight: "COE交付前にはサービス料不要",
        packagesRegularFeaturesTitle: "プランに含まれる内容：",
        packagesRegularFeatures: [
          "書類精査・申請ファイル作成支援",
          "提携日本語学校・大学の選考および面接指導",
          "N5修了後の3大無料特講（大使館面接15日、履歴書10日、アルバイト面接指導）",
          "COE待機中の無料N4コース受講（3ヶ月間）",
          "日本到着時の空港送迎・住居探し完全サポート",
          "学費・航空券代・申請実費は学生ご自身が段階的にお支払い",
        ],
        packagesRegularFootnote: "※レギュラープランの実費諸費用（印紙・翻訳・選考料）は原則返金不可です。",
        packagesRegularCta: "レギュラープランで相談する",
        packagesPremiumBadge: "一番人気 • 安心返金保証付き",
        packagesPremiumTag: "完全ワンストップ・プレミアム",
        packagesPremiumLabel: "プレミアムプラン",
        packagesPremiumPrice: "1,100,000 BDT",
        packagesPremiumInWords: "110万タカ（約1,100,000 BDT）",
        packagesPremiumDesc: "主要費用をKNLTCが負担する完全ワンストップ・ストレスフリーのフルパッケージ。",
        packagesPremiumPayment: "契約時わずか10%（不交付時は全額返金）",
        packagesPremiumHighlight: "万一ビザ不交付の場合でも自己負担金ゼロ（100%返金保証）",
        packagesPremiumFeaturesTitle: "KNLTCが全額負担する費用項目：",
        packagesPremiumFeatures: [
          "COE交付後の初年度年間学費（700,000 BDT相当）をKNLTCが負担",
          "日本渡航国際航空券代（65,000 BDT相当）をKNLTCが負担",
          "日本語コース費・印紙・選考料・翻訳料・日本郵送料をKNLTCが負担",
          "VFSビザ申請手数料をKNLTCが負担",
          "万一不交付の場合は契約金10%を全額返金",
          "面接特講3種＋N4コース完全無料提供",
          "日本現地での空港出迎え・住居手配・アルバイト紹介・銀行口座開設支援",
        ],
        packagesPremiumCta: "プレミアムプランに申し込む",
        tableTitle: "総費用サマリー（一目でわかる全費用）",
        tableSubtitle: "公式パンフレット10ページに基づく項目別費用比較",
        tableBadge: "Brochure Verified",
        colService: "サービス内容",
        colBudget: "目安予算 / 費用",
        colRegular: "レギュラープラン（150,000 BDT）",
        colPremium: "プレミアムプラン（1,100,000 BDT）",
        notesTitle: "パンフレット記載の重要注意事項および渡日案内",
        notePersonalTitle: "当面の個人生活費：",
        notePersonalDesc: "渡日時は現地当面の生活費として、必ず10万日本円（約80,000タカ）を各自現金でご持参ください。",
        noteDormitoryTitle: "学生寮の規程：",
        noteDormitoryDesc: "教育機関の学生寮を利用する場合、寮費は事前納付が必要となる場合があります。",
        noteFxTitle: "為替レートの変動：",
        noteFxDesc: "為替レート（USD/JPY/BDT）の変動により、費用が若干前後する場合がございます。",
        noteSupportTitle: "日本到着後の現地支援：",
        noteSupportDesc: "空港出迎え、安全な住居手配、アルバイト紹介、銀行口座・国民健康保険手続き支援。",
        faqTitle: "日本留学に関するよくあるご質問",
        finalBadge: "KNLTC 留学募集 2026–2027",
        finalTitle: "あなたの日本留学の夢を今すぐ形にしましょう",
        finalSubtitle: "日本留学経験のある専任カウンセラーが最適なプランをご提案します。",
        whatsappCta: "WhatsAppで直接相談する",
      },
    },
    language,
  );

  // Brochure 10-Step Roadmap (Pages 7, 8, 9)
  const roadmapSteps = translate(
    {
      bn: [
        {
          step: "০১",
          title: "সরকারি স্ট্যাম্পে চুক্তি",
          desc: "৩০০ টাকা মূল্যের সরকারি স্ট্যাম্পে KNLTC-এর সাথে আইনি চুক্তিবদ্ধ হওয়া। কোনো গোপন শর্ত নেই।",
          badge: "নিশ্চিন্ত চুক্তি",
        },
        {
          step: "০২",
          title: "N5 লেভেল ও ৩টি ফ্রি কোর্স",
          desc: "N5 সম্পন্ন করার পর সম্পূর্ণ বিনামূল্যে ৩টি প্রিমিয়াম কোর্স: এম্বাসি ইন্টারভিউ (১৫ দিন), জাপানিজ সিভি রাইটিং (১০ দিন), পার্ট-টাইম জব প্রস্তুতি (১০ দিন)।",
          badge: "৩টি কোর্স ফ্রি",
        },
        {
          step: "০৩",
          title: "ডকুমেন্ট সাবমিশন ও লিখিত গ্যারান্টি",
          desc: "চুক্তির ৭ দিনের মধ্যে সমস্ত অরিজিনাল ডকুমেন্ট জমা। KNLTC লিখিত নিশ্চয়তা দেয় যে COE আসার পর ফেরত দেওয়া হবে।",
          badge: "লিখিত নিরাপত্তা",
        },
        {
          step: "০৪",
          title: "জাপানি প্রতিষ্ঠানের ইন্টারভিউ",
          desc: "জাপানের একাধিক শিক্ষা প্রতিষ্ঠানে অনলাইন ইন্টারভিউ। ৪র্থ ধাপ পর্যন্ত (৩–৩.৫ মাস) কোনো সার্ভিস ফি দিতে হয় না।",
          badge: "জিরো সার্ভিস ফি",
        },
        {
          step: "০৫",
          title: "সিলেকশন ও জাপানে ফাইল প্রেরণ",
          desc: "নির্বাচিত হলে শিক্ষা প্রতিষ্ঠানে সিলেকশন ফি (~১৬k), অনুবাদ ফি (~১৬k) ও শিপিং ফি (~৩k) প্রদান করে জাপানে ফাইল প্রেরণ।",
          badge: "অফিশিয়াল সাবমিশন",
        },
        {
          step: "০৬",
          title: "COE অপেক্ষা ও সম্পূর্ণ ফ্রি N4 কোর্স",
          desc: "COE (প্রি-ভিসা) আসার ৩ মাস অপেক্ষার সময়ে KNLTC সম্পূর্ণ বিনামূল্যে জাপানি ভাষার N4 কোর্স করার সুযোগ দেয়।",
          badge: "ফ্রি N4 ক্লাস",
        },
        {
          step: "০৭",
          title: "COE প্রাপ্তি ও ১ বছরের টিউশন ফি",
          desc: "জাপান ইমিগ্রেশন থেকে COE ইস্যু হওয়ার পর শিক্ষার্থীর নিজস্ব ব্যাংক অ্যাকাউন্ট থেকে শিক্ষা প্রতিষ্ঠানের ব্যাংকে ১ম বছরের টিউশন ফি প্রদান।",
          badge: "সরাসরি স্কুল ব্যাংকে",
        },
        {
          step: "০৮",
          title: "VFS Global-এ ভিসা সাবমিশন",
          desc: "VFS-এ প্রয়োজনীয় কাগজপত্র, স্পন্সরের ট্যাক্স ও ব্যাংক ব্যালেন্স (১২ লক্ষ টাকা) সহ আবেদন জমা (ফি মাত্র ১,৯০০–২,৫০০ টাকা)।",
          badge: "এম্বাসি প্রসেসিং",
        },
        {
          step: "০৯",
          title: "ভিসা ইস্যু ও সার্ভিস ফি পরিশোধ",
          desc: "জাপানের ভিসা নিশ্চিত হওয়ার পর KNLTC সার্ভিস চার্জ পরিশোধ। রেগুলারে ভিসা/COE পর, প্রিমিয়ামে চুক্তির ১০% বাদে বাকিটা ভিসা পর।",
          badge: "ভিসা নিশ্চিতের পর",
        },
        {
          step: "১০",
          title: "জাপানে যাত্রা ও অন-গ্রাউন্ড সাপোর্ট",
          desc: "জাপানে পৌঁছানোর পর ফ্রি এয়ারপোর্ট পিক-আপ, নিরাপদ বাসস্থান নিশ্চিতকরণ, পার্ট-টাইম জব খোঁজা ও ব্যাংক অ্যাকাউন্ট ওপেনিং সাপোর্ট।",
          badge: "জাপানে সরাসরি যত্ন",
        },
      ],
      en: [
        {
          step: "01",
          title: "Government Stamp Agreement",
          desc: "Signing a legally binding agreement on a BDT 300 government stamp with KNLTC. Zero hidden conditions.",
          badge: "Legal Security",
        },
        {
          step: "02",
          title: "N5 Level + 3 Free Premium Courses",
          desc: "Upon N5 completion, get 3 free courses: Embassy Interview Prep (15d), Japanese CV Writing (10d), and Part-Time Job Prep (10d).",
          badge: "3 Free Courses",
        },
        {
          step: "03",
          title: "Document Submission with Written Guarantee",
          desc: "Submit verified original documents within 7 days. KNLTC provides written assurance for document safety and return.",
          badge: "Safety Guarantee",
        },
        {
          step: "04",
          title: "Japanese School Selection Interview",
          desc: "Direct online interviews with Japanese schools. Up to Step 4 (3 to 3.5 months), zero agency service fees are required.",
          badge: "Zero Service Fee",
        },
        {
          step: "05",
          title: "Selection, Translation & Japan Dispatch",
          desc: "After school selection, admission screening (~16k), certified Japanese translation (~16k), and courier (~3k) are sent to Japan.",
          badge: "Official Filing",
        },
        {
          step: "06",
          title: "COE Waiting Period + Free N4 Course",
          desc: "During the 3-month COE waiting period, students receive a full Japanese N4 course completely free of charge from KNLTC.",
          badge: "Free N4 Course",
        },
        {
          step: "07",
          title: "COE Issuance & 1st Year Tuition Payment",
          desc: "Once Japan Immigration issues the COE, the 1st year tuition is sent directly from the student's bank to the school's Japanese bank.",
          badge: "Direct School Bank",
        },
        {
          step: "08",
          title: "VFS Global Visa Application",
          desc: "Submit visa dossier at VFS Global with sponsor's tax and bank statement (BDT 1,200,000 balance). VFS fee is ~BDT 1,900–2,500.",
          badge: "Embassy Filing",
        },
        {
          step: "09",
          title: "Visa Issuance & Service Fee Clearance",
          desc: "Agency service fee cleared only after visa/COE confirmation. In premium package, agreement fee is 100% refundable if visa is refused.",
          badge: "After Visa Grant",
        },
        {
          step: "10",
          title: "Departure to Japan & On-Ground Support",
          desc: "Airport pickup upon arrival, student apartment/dormitory arrangement, part-time job matching, and bank account setup in Japan.",
          badge: "On-Ground Care",
        },
      ],
      ja: [
        {
          step: "01",
          title: "公的印紙による契約締結",
          desc: "300タカ相当の公的印紙を用いた正式な委任契約。不透明な条件は一切ありません。",
          badge: "法的保護",
        },
        {
          step: "02",
          title: "N5修了と3大無料特講",
          desc: "N5修了後、大使館面接対策（15日）、日本語履歴書作成（10日）、アルバイト面接指導（10日）を完全無料で受講。",
          badge: "3特講無料",
        },
        {
          step: "03",
          title: "原本書類提出と書面保証",
          desc: "契約後7日以内に原本提出。COE交付後の確実な返還を書面にてKNLTCが保証します。",
          badge: "原本保護保証",
        },
        {
          step: "04",
          title: "日本の教育機関オンライン面接",
          desc: "提携日本語学校・大学との直接面接。第4ステップまで（約3〜3.5ヶ月間）はサービス料は不要です。",
          badge: "手数料前払い不要",
        },
        {
          step: "05",
          title: "選考・翻訳および日本送付",
          desc: "選考合格後、選考料（約16,000）、公認日本語翻訳（約16,000）、原本郵送（約3,000）を行い入管に申請。",
          badge: "入管本申請",
        },
        {
          step: "06",
          title: "COE待機期間と無料N4特訓",
          desc: "在留資格認定（COE）交付までの約3ヶ月間、KNLTCでN4レベルコースを完全無料で学習できます。",
          badge: "N4完全無料",
        },
        {
          step: "07",
          title: "COE交付と初年度学費納入",
          desc: "出入国在留管理局よりCOE交付後、学生名義の口座から学校の日本の銀行口座へ直接初年度学費を送金。",
          badge: "学校直通送金",
        },
        {
          step: "08",
          title: "VFS Globalビザ申請",
          desc: "経費支弁者の納税証明・残高証明（120万タカ）を添えてVFSにて申請（実費1,900〜2,500タカ）。",
          badge: "大使館査証申請",
        },
        {
          step: "09",
          title: "ビザ発給とサービス料清算",
          desc: "ビザ取得を確認後にサービス料をお支払い。プレミアムプランは不交付時全額返金保証付き。",
          badge: "ビザ取得後決済",
        },
        {
          step: "10",
          title: "日本渡航と現地ワンストップ支援",
          desc: "日本到着時の空港送迎、住居手配、アルバイト紹介、銀行口座開設、健康保険加入まで現地スタッフが伴走。",
          badge: "日本現地サポート",
        },
      ],
    },
    language,
  );

  // Brochure 4 Intakes for Language Schools & 2 for Universities (Page 2)
  const intakes = [
    {
      name: { bn: "এপ্রিল সেশন (প্রধান সেশন)", en: "April Intake (Main)", ja: "4月生（最大入学期）" },
      period: { bn: "২ বছরের সম্পূর্ণ কোর্স", en: "2 Years Full Course", ja: "2年コース" },
      target: {
        bn: "উচ্চশিক্ষা ও বিশ্ববিদ্যালয়ে ভর্তির সেরা সুযোগ",
        en: "Ideal for university and graduate school progression",
        ja: "大学・大学院進学に最適",
      },
      status: { bn: "আবেদন চলছে (জনপ্রিয়)", en: "Now Enrolling", ja: "現在募集中" },
    },
    {
      name: { bn: "জুলাই সেশন", en: "July Intake", ja: "7月生" },
      period: { bn: "১ বছর ৯ মাসের কোর্স", en: "1 Year 9 Months", ja: "1年9ヶ月コース" },
      target: {
        bn: "দ্রুত ভাষা শিক্ষা ও জব সেশনের সমন্বয়",
        en: "Quick language progression and job transition",
        ja: "早期語学習得と就職",
      },
      status: { bn: "আসন সীমিত", en: "Limited Seats", ja: "残席わずか" },
    },
    {
      name: { bn: "অক্টোবর সেশন", en: "October Intake", ja: "10月生" },
      period: { bn: "১ বছর ৬ মাসের কোর্স", en: "1 Year 6 Months", ja: "1年6ヶ月コース" },
      target: {
        bn: "এইচএসসি ও স্নাতক উত্তীর্ণদের জন্য উপযোগী",
        en: "Popular for recent HSC & university graduates",
        ja: "大学・高校既卒者向け",
      },
      status: { bn: "আবেদন গ্রহণ চলছে", en: "Enrolling Soon", ja: "出願受付中" },
    },
    {
      name: { bn: "জানুয়ারি সেশন", en: "January Intake", ja: "1月生" },
      period: { bn: "১ বছর ৩ মাসের শর্ট কোর্স", en: "1 Year 3 Months Short Course", ja: "1年3ヶ月短期集中コース" },
      target: {
        bn: "উচ্চতর ভাষা দক্ষদের দ্রুত ডিগ্রি ও চাকরির পথ",
        en: "For intermediate learners seeking quick degree & jobs",
        ja: "中上級者の速成進学・就職",
      },
      status: { bn: "বিশেষ ব্যাচ", en: "Special Intake", ja: "特別募集" },
    },
  ];

  // Brochure Top 16 Cities in Japan (Page 2)
  const cities = translate(
    {
      bn: [
        { name: "টোকিও (Tokyo)", tag: "ক্যাপিটাল • হিউজ জবস" },
        { name: "ওসাকা (Osaka)", tag: "বাণিজ্যিক রাজধানী" },
        { name: "কোবে (Kobe)", tag: "আন্তর্জাতিক সংস্কৃতি" },
        { name: "ইয়োকোহামা (Yokohama)", tag: "আধুনিক পোর্ট সিটি" },
        { name: "নাগোয়া (Nagoya)", tag: "ইন্ডাস্ট্রিয়াল হাব" },
        { name: "ফুকুওকা (Fukuoka)", tag: "সাশ্রয়ী জীবনযাত্রা" },
        { name: "সাইতামা (Saitama)", tag: "টোকিওর কাছাকাছি" },
        { name: "চিবা (Chiba)", tag: "শান্ত ও মনোরম" },
        { name: "হিরোশিমা (Hiroshima)", tag: "ঐতিহাসিক ও সুরক্ষিত" },
        { name: "সেন্দাই (Sendai)", tag: "শিক্ষানগরী" },
        { name: "কানাগাওয়া (Kanagawa)", tag: "উচ্চমানের প্রতিষ্ঠান" },
        { name: "ইবারাকি (Ibaraki)", tag: "সাইন্স ও রিসার্চ" },
        { name: "ফুকুশিমা (Fukushima)", tag: "কম খরচে শিক্ষা" },
        { name: "ওকিনাওয়া (Okinawa)", tag: "ট্যুরিজম ও হসপিটালিটি" },
        { name: "আকিতা (Akita)", tag: "প্রাকৃতিক সৌন্দর্য" },
        { name: "সাপ্পোরো (Sapporo)", tag: "উত্তর জাপানের কেন্দ্র" },
      ],
      en: [
        { name: "Tokyo", tag: "Capital · Major Job Hub" },
        { name: "Osaka", tag: "Commercial Center" },
        { name: "Kobe", tag: "Cosmopolitan Port" },
        { name: "Yokohama", tag: "Modern Coastal City" },
        { name: "Nagoya", tag: "Industrial Hub" },
        { name: "Fukuoka", tag: "Affordable Living" },
        { name: "Saitama", tag: "Near Tokyo" },
        { name: "Chiba", tag: "Quiet & Coastal" },
        { name: "Hiroshima", tag: "Historic & Safe" },
        { name: "Sendai", tag: "Academic City" },
        { name: "Kanagawa", tag: "Top Institutions" },
        { name: "Ibaraki", tag: "Science & Research" },
        { name: "Fukushima", tag: "Budget Friendly" },
        { name: "Okinawa", tag: "Tourism & Hospitality" },
        { name: "Akita", tag: "Scenic & Peaceful" },
        { name: "Sapporo", tag: "Northern Metropolis" },
      ],
      ja: [
        { name: "東京", tag: "首都・求人数最大" },
        { name: "大阪", tag: "商業・経済の中心" },
        { name: "神戸", tag: "国際港湾都市" },
        { name: "横浜", tag: "先進的な港湾都市" },
        { name: "名古屋", tag: "ものづくり産業拠点" },
        { name: "福岡", tag: "生活費が手頃" },
        { name: "埼玉", tag: "都心アクセス良好" },
        { name: "千葉", tag: "落ち着いた環境" },
        { name: "広島", tag: "歴史と安全な街" },
        { name: "仙台", tag: "学術・学園都市" },
        { name: "神奈川", tag: "名門校多数" },
        { name: "茨城", tag: "先端研究学園" },
        { name: "福島", tag: "低コスト進学" },
        { name: "沖縄", tag: "観光・ホスピタリティ" },
        { name: "秋田", tag: "豊かな自然と治安" },
        { name: "札幌", tag: "北の大都市" },
      ],
    },
    language,
  );

  // Brochure Detailed Cost Table (Page 10)
  const costBreakdownRows = [
    {
      item: translate(
        {
          bn: "জাপানি ভাষা কোর্স ফী*",
          en: "Japanese Language Course Fee*",
          ja: "日本語コース受講料*",
        },
        language,
      ),
      budget: translate({ bn: "৳ ১২,০০০", en: "BDT 12,000", ja: "12,000 BDT" }, language),
      regular: translate({ bn: "শিক্ষার্থী বহন করবে", en: "Student covers", ja: "学生負担" }, language),
      premium: translate({ bn: "KNLTC বহন করবে", en: "KNLTC covers", ja: "KNLTC負担" }, language),
      isCovered: true,
    },
    {
      item: translate(
        {
          bn: "স্ট্যাম্প চুক্তি খরচ*",
          en: "Legal Stamp Agreement Fee*",
          ja: "公的契約スタンプ費用*",
        },
        language,
      ),
      budget: translate({ bn: "৳ ৩০০", en: "BDT 300", ja: "300 BDT" }, language),
      regular: translate({ bn: "শিক্ষার্থী বহন করবে", en: "Student covers", ja: "学生負担" }, language),
      premium: translate({ bn: "KNLTC বহন করবে", en: "KNLTC covers", ja: "KNLTC負担" }, language),
      isCovered: true,
    },
    {
      item: translate(
        {
          bn: "সিলেকশন ও এডমিশন ফী*",
          en: "School Selection & Screening Fee*",
          ja: "教育機関選考料*",
        },
        language,
      ),
      budget: translate({ bn: "৳ ১৬,০০০", en: "BDT 16,000", ja: "16,000 BDT" }, language),
      regular: translate({ bn: "শিক্ষার্থী বহন করবে", en: "Student covers", ja: "学生負担" }, language),
      premium: translate({ bn: "KNLTC বহন করবে", en: "KNLTC covers", ja: "KNLTC負担" }, language),
      isCovered: true,
    },
    {
      item: translate(
        {
          bn: "ডকুমেন্ট জাপানিজ অনুবাদ ফি*",
          en: "Document Japanese Translation Fee*",
          ja: "書類日本語翻訳料*",
        },
        language,
      ),
      budget: translate({ bn: "৳ ১৬,০০০", en: "BDT 16,000", ja: "16,000 BDT" }, language),
      regular: translate({ bn: "শিক্ষার্থী বহন করবে", en: "Student covers", ja: "学生負担" }, language),
      premium: translate({ bn: "KNLTC বহন করবে", en: "KNLTC covers", ja: "KNLTC負担" }, language),
      isCovered: true,
    },
    {
      item: translate(
        {
          bn: "শিপিং ফী (জাপানে প্রেরণ)*",
          en: "Document Courier to Japan*",
          ja: "日本宛て原本郵送料*",
        },
        language,
      ),
      budget: translate({ bn: "৳ ৩,০০০", en: "BDT 3,000", ja: "3,000 BDT" }, language),
      regular: translate({ bn: "শিক্ষার্থী বহন করবে", en: "Student covers", ja: "学生負担" }, language),
      premium: translate({ bn: "KNLTC বহন করবে", en: "KNLTC covers", ja: "KNLTC負担" }, language),
      isCovered: true,
    },
    {
      item: translate(
        {
          bn: "COE-এর পর ১ম বছরের টিউশন ফী (স্কুলভেদে কম-বেশি হতে পারে)",
          en: "1-Year Tuition Fee after COE (may vary by school)",
          ja: "COE交付後 初年度年間学費（教育機関により変動あり）",
        },
        language,
      ),
      budget: translate({ bn: "৳ ৭,০০,০০০", en: "BDT 700,000", ja: "700,000 BDT" }, language),
      regular: translate({ bn: "শিক্ষার্থী বহন করবে", en: "Student covers", ja: "学生負担" }, language),
      premium: translate({ bn: "KNLTC বহন করবে", en: "KNLTC covers", ja: "KNLTC負担" }, language),
      isCovered: true,
    },
    {
      item: translate(
        {
          bn: "VFS ভিসা আবেদন ফি",
          en: "VFS Global Visa Application Fee",
          ja: "VFSビザ申請手数料",
        },
        language,
      ),
      budget: translate({ bn: "৳ ২,৫০০", en: "BDT 2,500", ja: "2,500 BDT" }, language),
      regular: translate({ bn: "শিক্ষার্থী বহন করবে", en: "Student covers", ja: "学生負担" }, language),
      premium: translate({ bn: "KNLTC বহন করবে", en: "KNLTC covers", ja: "KNLTC負担" }, language),
      isCovered: true,
    },
    {
      item: translate(
        {
          bn: "জাপানে যাওয়ার আন্তর্জাতিক এয়ার টিকিট",
          en: "International Air Ticket to Japan",
          ja: "日本渡航航空券代",
        },
        language,
      ),
      budget: translate({ bn: "৳ ৬৫,০০০", en: "BDT 65,000", ja: "65,000 BDT" }, language),
      regular: translate({ bn: "শিক্ষার্থী বহন করবে", en: "Student covers", ja: "学生負担" }, language),
      premium: translate({ bn: "KNLTC বহন করবে", en: "KNLTC covers", ja: "KNLTC負担" }, language),
      isCovered: true,
    },
    {
      item: translate(
        {
          bn: "সার্ভিস ফী (KNLTC প্রফেশনাল ফি)",
          en: "KNLTC Professional Service Fee",
          ja: "KNLTCコンサルティングサービス料",
        },
        language,
      ),
      budget: translate({ bn: "৳ ১,৫০,০০০", en: "BDT 150,000", ja: "150,000 BDT" }, language),
      regular: translate(
        {
          bn: "প্রি-ভিসা (COE) আসার পর পরিশোধযোগ্য",
          en: "Payable after COE issuance",
          ja: "COE交付後に支払い",
        },
        language,
      ),
      premium: translate(
        {
          bn: "চুক্তির সময় ১০% (ভিসা না হলে ১০০% রিফান্ড); বাকিটা COE ও ভিসা আসার পর",
          en: "10% at agreement (100% refundable if refused); balance after COE & visa",
          ja: "契約時10%（不交付時全額返金）；残額はCOE・ビザ取得後",
        },
        language,
      ),
    },
    {
      item: translate(
        {
          bn: "ব্যাঙ্ক স্টেটমেন্ট সেবা*",
          en: "Bank Statement & Solvency Support*",
          ja: "銀行残高証明・ソルベンシー支援*",
        },
        language,
      ),
      budget: translate({ bn: "৳ ৫০,০০০", en: "BDT 50,000", ja: "50,000 BDT" }, language),
      regular: translate({ bn: "শিক্ষার্থী বহন করবে", en: "Student covers", ja: "学生負担" }, language),
      premium: translate({ bn: "শিক্ষার্থী বহন করবে", en: "Student covers", ja: "学生負担" }, language),
      isCovered: false,
    },
  ];

  // Brochure FAQs
  const faqs = translate(
    {
      bn: [
        {
          q: "ভিসা না হলে কি প্রিমিয়াম প্যাকেজের ফি রিফান্ড পাওয়া যাবে?",
          a: "হ্যাঁ, সম্পূর্ণ নিশ্চিত। আমাদের প্রিমিয়াম প্যাকেজের চুক্তিতে স্পষ্টভাবে উল্লেখ থাকে যে, কোনো কারণে ভিসা না হলে চুক্তি অনুযায়ী গৃহীত অগ্রিম ফি সম্পূর্ণ রিফান্ডযোগ্য।",
        },
        {
          q: "জাপানে পড়াশোনার পাশাপাশি পার্ট-টাইম কাজ করে নিজের খরচ চালানো কি সম্ভব?",
          a: "হ্যাঁ। জাপান সরকার অনুমোদিত নিয়মে সপ্তাহে ২৮ ঘণ্টা এবং ছুটির সময়ে মাসে ২৪০ ঘণ্টা পর্যন্ত বৈধ পার্ট-টাইম কাজ করা যায়। প্রতি ঘণ্টায় ন্যূনতম ১,০০০ টাকা আয় ধরে মাসে প্রায় ১,২০,০০০ টাকা আয় করা যায়, যা দিয়ে থাকা-খাওয়ার ৪০,০০০ টাকা খরচ বাদ দিয়েও বছরে পর্যাপ্ত টাকা সঞ্চয় সম্ভব।",
        },
        {
          q: "আমার পড়াশোনায় ৫–৬ বছরের স্টাডি গ্যাপ রয়েছে, আমি কি আবেদন করতে পারব?",
          a: "হ্যাঁ। জাপানে সর্বোচ্চ ৫–৬ বছরের স্টাডি গ্যাপ স্বাভাবিকভাবেই গ্রহণযোগ্য। এছাড়া ৩০ বছর বয়স পর্যন্ত উপযুক্ত পেশাগত বা বাস্তবিক কারণ থাকলে স্টুডেন্ট ভিসায় আবেদন করা যায়।",
        },
        {
          q: "জাপানি ভাষা না শিখে কি সরাসরি আবেদন করা যাবে?",
          a: "না। জাপানের স্টুডেন্ট ভিসায় আবেদনের জন্য ন্যূনতম N5 লেভেল কোর্স সম্পন্ন থাকা বাধ্যতামূলক। KNLTC-তে N5 কোর্স সম্পন্ন করার পর এম্বাসি ও জব ইন্টারভিউয়ের ৩টি কোর্স সম্পূর্ণ ফ্রি দেওয়া হয়।",
        },
        {
          q: "জাপানে অবতরণের পর KNLTC থেকে কী ধরনের সেবা পাওয়া যাবে?",
          a: "জাপানের বিমানবন্দরে আমাদের প্রতিনিধি ফ্রি এয়ারপোর্ট পিক-আপ প্রদান করবেন, প্রি-বুক করা নিরাপদ হোস্টেল/বাসস্থানে নিয়ে যাবেন, পার্ট-টাইম জব খোঁজা, ব্যাংক অ্যাকাউন্ট ওপেনিং ও হেলথ ইন্স্যুরেন্সে সরাসরি সহযোগিতা করবেন।",
        },
      ],
      en: [
        {
          q: "Will the premium package fee be refunded if the visa is not granted?",
          a: "Yes, 100% guaranteed. Our premium package agreement legally specifies that if a visa is refused for any reason, the agreement advance fee is fully refunded.",
        },
        {
          q: "Can I support myself in Japan through part-time work?",
          a: "Yes. Japan permits 28 hours/week during school terms and up to 240 hours/month during summer & winter breaks. At ~BDT 1,000/hr, students earn ~BDT 120,000/month, leaving ample net savings after ~BDT 40,000 monthly living costs.",
        },
        {
          q: "I have a 5-6 year study gap. Am I eligible to apply?",
          a: "Yes. Study gaps of 5-6 years are widely accepted in Japan. Applicants up to 30 years old with justifiable academic or career backgrounds are eligible for student visas.",
        },
        {
          q: "Can I apply without learning Japanese first?",
          a: "No. A minimum N5 level certification or course completion is mandatory for student visa screening. Upon finishing N5 with KNLTC, 3 premium interview and CV courses are provided for free.",
        },
        {
          q: "What on-ground support does KNLTC provide upon arrival in Japan?",
          a: "Our Japan staff provides airport pickup upon landing, escort to pre-arranged accommodations, and hands-on guidance for bank account opening, health insurance registration, and part-time job matching.",
        },
      ],
      ja: [
        {
          q: "万一ビザが不交付となった場合、プレミアムプランの料金は返金されますか？",
          a: "はい、全額返金されます。プレミアムプランの公的契約書には、ビザが不交付となった場合の着手金100%返金条項が明記されています。",
        },
        {
          q: "日本での留学生活費はアルバイトで賄うことができますか？",
          a: "はい、十分に可能です。資格外活動許可により週28時間（長期休暇中は月240時間）の就労が認められています。生活費（約4万タカ）を差し引いても年間100万タカ超の純貯蓄が可能です。",
        },
        {
          q: "5〜6年の学歴ブランクがありますが申請可能ですか？",
          a: "はい、可能です。5〜6年程度のブランクは合理的な理由書を添付することで広く受け入れられています。30歳前後まで申請可能です。",
        },
        {
          q: "日本語を学習せずに直接ビザ申請することはできますか？",
          a: "いいえ、最低でもN5レベルの学習証明または合格証明が必要です。KNLTCでN5修了後は3大特講コースを完全無料で受講いただけます。",
        },
        {
          q: "日本到着後、KNLTCからはどのような現地支援がありますか？",
          a: "空港での出迎え、手配済み寮・住居への引率、銀行口座開設、国民健康保険加入、アルバイト紹介まで現地スタッフが責任を持ってサポートします。",
        },
      ],
    },
    language,
  );

  return (
    <main className="bg-[#fcfaf7] min-h-screen text-slate-800 pb-20">
      {/* 1. Hero Section - Executive & Authoritative */}
      <section className="relative overflow-hidden pt-6 pb-12 border-b border-stone-200/80 bg-gradient-to-b from-white via-[#faf8f5] to-[#f5f1eb]">
        <div className="container-narrow">
          <div className="inline-flex items-center gap-2 rounded-lg bg-red-50 border border-red-200/80 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#b91c1c] mb-4">
            <span className="h-2 w-2 rounded-full bg-[#b91c1c] animate-pulse" />
            <span>{t.badge}</span>
          </div>

          <div className="grid gap-8 lg:grid-cols-12 items-center">
            {/* Left Column: Heading & Trust Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 space-y-4"
            >
              <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-black text-slate-950 tracking-tight leading-[1.2]">
                {t.heroTitle}
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
                {t.heroSubtitle}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Button
                  asChild
                  size="lg"
                  className="bg-[#15803d] hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg active:scale-95 transition-all px-6 py-5.5"
                >
                  <Link href="/contact" className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    <span>{t.consultBtn}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-stone-300 text-slate-800 bg-white hover:bg-stone-50 rounded-xl text-xs sm:text-sm font-semibold active:scale-95 transition-all px-5 py-5.5 shadow-2xs"
                >
                  <a href="tel:+8801805013633" className="flex items-center gap-2">
                    <PhoneCall className="h-4 w-4 text-[#b91c1c]" />
                    <span>+880 1805 013633</span>
                  </a>
                </Button>
              </div>

              {/* Verified Trust Strip */}
              <div className="pt-3 border-t border-stone-200/80 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {t.stats.map((st, i) => (
                  <div key={i} className="bg-white/90 rounded-xl p-2.5 border border-stone-200/70 shadow-2xs">
                    <p className="text-lg sm:text-xl font-black text-slate-900 leading-none">{st.val}</p>
                    <p className="text-[11px] font-medium text-slate-500 mt-1">{st.lbl}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Column: Quick Intake & Feasibility Advisor */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5"
            >
              <Card className="rounded-3xl border-2 border-stone-300/80 bg-white shadow-xl shadow-stone-200/50 p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-red-50 text-[#b91c1c] flex items-center justify-center font-bold">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <div>
                      <h2 className="text-sm font-black text-slate-900">{t.intakeBoxTitle}</h2>
                      <p className="text-[11px] text-slate-500">{t.intakeBoxSub}</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                    {t.intakeEnrolling}
                  </span>
                </div>

                <div className="space-y-2">
                  {intakes.map((itk, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedIntake(idx)}
                      className={`w-full text-left p-2.5 sm:p-3 rounded-xl border transition-all text-xs flex items-center justify-between ${
                        selectedIntake === idx
                          ? "border-[#b91c1c] bg-red-50/50 shadow-2xs"
                          : "border-stone-200 hover:border-stone-300 hover:bg-stone-50/50"
                      }`}
                    >
                      <div>
                        <p className={`font-bold ${selectedIntake === idx ? "text-[#b91c1c]" : "text-slate-900"}`}>
                          {itk.name[language]}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{itk.period[language]}</p>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                          selectedIntake === idx
                            ? "bg-[#b91c1c] text-white"
                            : "bg-stone-100 text-slate-600"
                        }`}
                      >
                        {itk.status[language]}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Selected Intake Snapshot */}
                <div className="rounded-xl bg-[#faf7f2] p-3 text-xs border border-stone-200/60 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                    <Info className="h-3.5 w-3.5 text-[#b91c1c]" />
                    <span>{t.whyChooseIntake}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {intakes[selectedIntake].target[language]}
                  </p>
                </div>

                <Button asChild className="w-full bg-[#b91c1c] hover:bg-red-800 text-white rounded-xl font-bold text-xs py-4.5 shadow-xs">
                  <Link href="/contact" className="flex items-center justify-center gap-1.5">
                    <span>{t.secureSeatBtn}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="container-narrow space-y-14 pt-10">
        {/* 2. Why KNLTC - Core Pillars from Brochure */}
        <section>
          <div className="text-center max-w-2xl mx-auto mb-7">
            <h2 className="section-title text-center">{t.whyTitle}</h2>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-600">{t.whySubtitle}</p>
          </div>

          <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
            {t.whyCards.map((card, i) => (
              <Card key={i} className="rounded-2xl border-stone-200 bg-white p-5 shadow-xs hover:border-stone-300 transition-all">
                <div className="h-10 w-10 rounded-xl bg-stone-100 text-[#b91c1c] flex items-center justify-center mb-3">
                  {i === 0 && <ShieldCheck className="h-5 w-5" />}
                  {i === 1 && <Languages className="h-5 w-5" />}
                  {i === 2 && <FileCheck2 className="h-5 w-5" />}
                  {i === 3 && <Plane className="h-5 w-5" />}
                </div>
                <h3 className="font-bold text-slate-900 text-sm">{card.title}</h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{card.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* 3. Official 10-Step Visa Roadmap (Pages 7, 8, 9) */}
        <section>
          <div className="text-center max-w-2xl mx-auto mb-7">
            <h2 className="section-title text-center">{t.roadmapTitle}</h2>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-600">{t.roadmapSubtitle}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {roadmapSteps.map((stp, idx) => (
              <div
                key={idx}
                className="relative rounded-2xl border border-stone-200 bg-white p-4 shadow-2xs hover:shadow-md hover:border-stone-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black font-mono text-[#b91c1c] bg-red-50 px-2 py-0.5 rounded-md">
                      {t.stepPrefix} {stp.step}
                    </span>
                    <span className="text-[10px] text-slate-500 font-semibold">{stp.badge}</span>
                  </div>
                  <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 leading-snug">
                    {stp.title}
                  </h3>
                  <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed">
                    {stp.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Top 16 Cities in Japan (From Brochure Page 2) */}
        <section className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">{t.citiesTitle}</h2>
              <p className="text-xs text-slate-500 mt-1">{t.citiesSubtitle}</p>
            </div>
            <span className="text-xs bg-stone-100 text-slate-700 px-3 py-1 rounded-full font-bold w-fit">
              {t.citiesBadge}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
            {cities.map((cty, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-stone-200/80 bg-[#faf8f5] p-2.5 text-center hover:bg-white hover:border-[#b91c1c] transition-all"
              >
                <MapPin className="h-3.5 w-3.5 text-[#b91c1c] mx-auto mb-1" />
                <p className="text-xs font-bold text-slate-900 leading-tight">{cty.name}</p>
                <p className="text-[10px] text-slate-500 mt-0.5 truncate">{cty.tag}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-4 text-center">{t.citiesFootnote}</p>
        </section>

        {/* 5. Document Checklist & Bank Guidelines Tabs (Brochure Pages 4, 5, 6) */}
        <section>
          <div className="text-center max-w-2xl mx-auto mb-6">
            <h2 className="section-title text-center">{t.checklistTitle}</h2>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-600">{t.checklistSubtitle}</p>
          </div>

          {/* Clean Segmented Tab Switcher */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex rounded-xl bg-stone-200/70 p-1 border border-stone-300/80">
              <button
                type="button"
                onClick={() => setActiveTab("student")}
                className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                  activeTab === "student"
                    ? "bg-white text-slate-950 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {t.tabStudent}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("sponsor")}
                className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                  activeTab === "sponsor"
                    ? "bg-white text-slate-950 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {t.tabSponsor}
              </button>
            </div>
          </div>

          <Card className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-xs">
            {activeTab === "student" ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
                  <GraduationCap className="h-5 w-5 text-[#b91c1c]" />
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    {t.studentSectionTitle}
                  </h3>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {t.studentChecklist.map((doc, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3 rounded-xl border border-stone-200/70 bg-[#faf8f5] text-xs sm:text-[13px] text-slate-800"
                    >
                      <CheckCircle2 className="h-4 w-4 text-[#15803d] shrink-0 mt-0.5" />
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
                  <Landmark className="h-5 w-5 text-blue-700" />
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    {t.sponsorSectionTitle}
                  </h3>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {t.sponsorChecklist.map((spn, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3 rounded-xl border border-stone-200/70 bg-[#faf8f5] text-xs sm:text-[13px] text-slate-800"
                    >
                      <CheckCircle2 className="h-4 w-4 text-blue-700 shrink-0 mt-0.5" />
                      <span>{spn}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </section>

        {/* 6. Part-Time Work, Monthly Income & Yearly Savings (Brochure Page 3) */}
        <section className="rounded-3xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/40 via-white to-stone-50 p-6 sm:p-8 shadow-xs">
          <div className="text-center max-w-2xl mx-auto mb-7">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">
              {t.calcBadge}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">{t.calcTitle}</h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">{t.calcSubtitle}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {t.calcCards.map((card, i) => (
              <div key={i} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase">
                  {i === 0 && <Clock className="h-4 w-4" />}
                  {i === 1 && <Banknote className="h-4 w-4" />}
                  {i === 2 && <CircleDollarSign className="h-4 w-4" />}
                  <span>{card.tag}</span>
                </div>
                <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{card.val}</p>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 7. Visa Service Packages (Updated Rates & Full Comparison from Brochure Page 10) */}
        <section id="packages" className="scroll-mt-20">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="section-title text-center">{t.packagesTitle}</h2>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-600">{t.packagesSubtitle}</p>
          </div>

          {/* Cards for Regular and Premium Packages */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Regular Package Card */}
            <Card className="rounded-3xl border border-stone-300 bg-white p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold bg-stone-100 text-slate-700 px-3 py-1 rounded-full">
                    {t.packagesRegularBadge}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mt-3">{t.packagesRegularLabel}</h3>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-4xl font-black text-slate-950">{t.packagesRegularPrice}</span>
                  <span className="text-xs font-semibold text-slate-500">({t.packagesRegularInWords})</span>
                </div>
                <p className="text-xs text-slate-600 mt-2">{t.packagesRegularDesc}</p>

                <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900 flex items-start gap-2">
                  <Clock className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">{t.packagesRegularPayment}</span>
                    <p className="text-[11px] text-amber-700 mt-0.5">{t.packagesRegularHighlight}</p>
                  </div>
                </div>

                <div className="space-y-2.5 mt-5 border-t border-stone-100 pt-4">
                  <p className="text-xs font-bold text-slate-900 uppercase">{t.packagesRegularFeaturesTitle}</p>
                  {t.packagesRegularFeatures.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                      <Check className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                  <p className="text-[11px] text-slate-500 italic pt-1">{t.packagesRegularFootnote}</p>
                </div>
              </div>

              <div className="pt-6">
                <Button asChild variant="outline" className="w-full rounded-xl border-stone-300 font-bold text-xs py-5">
                  <Link href="/contact" className="flex items-center justify-center gap-2">
                    <span>{t.packagesRegularCta}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </Card>

            {/* Premium Package Card */}
            <Card className="rounded-3xl border-2 border-[#b91c1c] bg-white p-6 shadow-xl shadow-red-950/5 flex flex-col justify-between relative">
              <div className="absolute -top-3.5 right-6">
                <span className="bg-[#b91c1c] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-xs flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-amber-300" />
                  <span>{t.packagesPremiumBadge}</span>
                </span>
              </div>

              <div>
                <span className="text-xs font-bold bg-red-50 text-[#b91c1c] border border-red-200 px-3 py-1 rounded-full">
                  {t.packagesPremiumTag}
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-3">{t.packagesPremiumLabel}</h3>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-4xl font-black text-[#b91c1c]">{t.packagesPremiumPrice}</span>
                  <span className="text-xs font-bold text-slate-700">({t.packagesPremiumInWords})</span>
                </div>
                <p className="text-xs text-slate-600 mt-2">{t.packagesPremiumDesc}</p>

                <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-900 flex items-start gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">{t.packagesPremiumPayment}</span>
                    <p className="text-[11px] text-emerald-700 mt-0.5">{t.packagesPremiumHighlight}</p>
                  </div>
                </div>

                <div className="space-y-2.5 mt-5 border-t border-stone-100 pt-4">
                  <p className="text-xs font-bold text-slate-900 uppercase">{t.packagesPremiumFeaturesTitle}</p>
                  {t.packagesPremiumFeatures.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-800 font-medium">
                      <CheckCircle2 className="h-4 w-4 text-[#15803d] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <Button asChild className="w-full rounded-xl bg-[#b91c1c] hover:bg-red-800 text-white font-bold text-xs py-5 shadow-sm">
                  <Link href="/contact" className="flex items-center justify-center gap-2">
                    <span>{t.packagesPremiumCta}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </Card>
          </div>

          {/* Full Cost Table from Brochure Page 10 */}
          <div className="mt-10 overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-xs">
            <div className="bg-slate-900 text-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h3 className="text-base sm:text-lg font-black tracking-tight">{t.tableTitle}</h3>
                <p className="text-xs text-slate-300 mt-0.5">{t.tableSubtitle}</p>
              </div>
              <span className="text-[11px] bg-red-600 text-white px-2.5 py-1 rounded-md font-bold w-fit">
                {t.tableBadge}
              </span>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-stone-50 border-b border-stone-200">
                  <TableRow>
                    <TableHead className="font-bold text-slate-900 text-xs sm:text-sm py-3.5 pl-6 min-w-[240px]">
                      {t.colService}
                    </TableHead>
                    <TableHead className="font-bold text-slate-900 text-xs sm:text-sm py-3.5 text-center min-w-[120px]">
                      {t.colBudget}
                    </TableHead>
                    <TableHead className="font-bold text-slate-900 text-xs sm:text-sm py-3.5 text-center min-w-[180px]">
                      {t.colRegular}
                    </TableHead>
                    <TableHead className="font-bold text-[#b91c1c] text-xs sm:text-sm py-3.5 text-center min-w-[200px] bg-red-50/40">
                      {t.colPremium}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {costBreakdownRows.map((row, idx) => (
                    <TableRow key={idx} className="hover:bg-stone-50/60 transition-colors">
                      <TableCell className="py-3 pl-6 text-xs sm:text-[13px] font-medium text-slate-800">
                        {row.item}
                      </TableCell>
                      <TableCell className="py-3 text-center text-xs sm:text-[13px] font-bold text-slate-900">
                        <span className="font-mono bg-stone-100 px-2 py-0.5 rounded-md border border-stone-200">
                          {row.budget}
                        </span>
                      </TableCell>
                      <TableCell className="py-3 text-center text-xs">
                        <span className="inline-flex items-center gap-1 text-slate-600 bg-stone-100 px-2 py-0.5 rounded-md font-medium text-[11px]">
                          {row.regular}
                        </span>
                      </TableCell>
                      <TableCell className="py-3 text-center text-xs bg-red-50/20">
                        {row.isCovered ? (
                          <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md font-bold text-[11px]">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                            <span>{row.premium}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-slate-600 bg-stone-100 px-2 py-0.5 rounded-md font-medium text-[11px]">
                            {row.premium}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Brochure Page 11 Crucial Notes */}
          <div className="mt-8 rounded-3xl border border-amber-200/80 bg-gradient-to-br from-amber-50/60 via-white to-stone-50 p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="h-5 w-5 text-amber-700" />
              <h3 className="text-base font-bold text-slate-900">{t.notesTitle}</h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 text-xs sm:text-[13px] text-slate-700">
              <div className="bg-white p-3.5 rounded-xl border border-stone-200/80">
                <strong className="text-slate-900 block mb-1">{t.notePersonalTitle}</strong>
                {t.notePersonalDesc}
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-stone-200/80">
                <strong className="text-slate-900 block mb-1">{t.noteDormitoryTitle}</strong>
                {t.noteDormitoryDesc}
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-stone-200/80">
                <strong className="text-slate-900 block mb-1">{t.noteFxTitle}</strong>
                {t.noteFxDesc}
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-stone-200/80">
                <strong className="text-slate-900 block mb-1">{t.noteSupportTitle}</strong>
                {t.noteSupportDesc}
              </div>
            </div>
          </div>
        </section>

        {/* 8. Frequently Asked Questions */}
        <section>
          <div className="text-center max-w-2xl mx-auto mb-7">
            <h2 className="section-title text-center">{t.faqTitle}</h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-stone-200 bg-white overflow-hidden transition-all shadow-2xs"
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 hover:bg-stone-50/50 transition-colors"
                  >
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">{faq.q}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-[#b91c1c]" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="p-4 sm:p-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-stone-100 bg-[#faf8f5]/50">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* 9. Final Institutional Call to Action */}
        <motion.section
          initial={{ opacity: 0, scale: 0.98, y: 16 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl border-2 border-slate-900 bg-slate-950 text-white p-8 sm:p-12 text-center shadow-xl relative overflow-hidden"
        >
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-red-400 bg-red-950/80 border border-red-800/80 px-3 py-1 rounded-full">
              {t.finalBadge}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">{t.finalTitle}</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{t.finalSubtitle}</p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" className="bg-[#b91c1c] hover:bg-red-800 text-white rounded-xl text-xs sm:text-sm font-bold px-7 py-6 active:scale-95 transition-all shadow-md">
                <Link href="/contact" className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  <span>{t.consultBtn}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-slate-700 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-xs sm:text-sm font-semibold px-6 py-6 active:scale-95 transition-all"
              >
                <a
                  href="https://wa.me/8801805013633"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <MessageCircle className="h-4 w-4 text-emerald-400" />
                  <span>{t.whatsappCta}</span>
                </a>
              </Button>
            </div>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
