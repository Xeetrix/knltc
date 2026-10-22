// ==============================================================================
// KNLTC (Japan Gateway) - Master CMS Store & Business Operations Data Engine
// Supports 100% Website Content CMS + CRM, Visa, LMS, B2B, Finance, HR & Investor
// ==============================================================================

export type SupportedLanguage = "bn" | "en" | "ja";

export type UserRole =
  | "MAIN_ADMIN"       // শেখ বাসেত (Managing Director & Super Admin)
  | "BRANCH_ADMIN"     // ঢাকা ও খুলনা শাখা ব্যবস্থাপক
  | "TELE_COUNSELOR"   // রিমোট ফিমেল ক্লায়েন্ট কমিউনিকেশন এক্সিকিউটিভ
  | "TEACHER"          // আমির হোসেন (সিনিয়র সেন্সি) ও অন্যান্য প্রশিক্ষক
  | "B2B_AGENT"        // Nexus Group, BWBS, ক্যাম্পাস অ্যাম্বাসেডর
  | "INVESTOR"         // ১০ লক্ষ টাকার বিনিয়োগকারী (Open-Book Audit View)
  | "STUDENT";         // শিক্ষার্থী ও ভিসা প্রার্থী (Portal & Progress View)

export type BranchCode = "ALL" | "DHK-HQ" | "KHULNA-01";

// ------------------------------------------------------------------------------
// CRM & Lead Management
// ------------------------------------------------------------------------------
export type LeadSource = "FACEBOOK_META" | "WHATSAPP_DIRECT" | "WEBSITE_FORM" | "OFFICE_WALKIN" | "B2B_REFERRAL";
export type LeadStatus = "NEW" | "CONTACTED" | "COUNSELED" | "OFFICE_VISIT_BOOKED" | "ADMITTED" | "ARCHIVED";
export type ServiceInterest =
  | "STUDENT_VISA_REGULAR"
  | "STUDENT_VISA_PREMIUM"
  | "SSW_CONSTRUCTION_SPECIAL" // N4 pass free food/acc in Dhaka + skill training
  | "SSW_CAREGIVER"
  | "SSW_AGRICULTURE"
  | "SSW_FOOD_SERVICE"
  | "TITP_TECHNICAL"
  | "JAPANESE_N5"
  | "JAPANESE_N4";

export interface CrmLead {
  id: string;
  name: string;
  phone: string;
  whatsapp: string;
  email?: string;
  city: string;
  source: LeadSource;
  interest: ServiceInterest;
  status: LeadStatus;
  education: string;
  japaneseProficiency: "NONE" | "LEARNING_N5" | "PASSED_N5" | "PASSED_N4" | "NAT_JFT";
  studyGapYears: number;
  assignedTo: string;
  branch: "DHK-HQ" | "KHULNA-01";
  notes: string;
  followUpDate: string;
  lastContactedAt: string;
  createdAt: string;
}

// ------------------------------------------------------------------------------
// Visa Pipeline & Kanban Engine (10 Steps)
// ------------------------------------------------------------------------------
export type VisaStage =
  | 1  // ফাইল ওপেনিং (৳০ অগ্রিম)
  | 2  // ভাষা প্রশিক্ষণ (N5/N4)
  | 3  // ডকুমেন্ট সংগ্রহ ও নোটারি/অনুবাদ
  | 4  // জাপানি স্কুল জুম ইন্টারভিউ (HLA Gakuin ইত্যাদি)
  | 5  // জাপান ইমিগ্রেশনে COE আবেদন
  | 6  // প্রি-ভিসা (COE) অনুমোদন
  | 7  // টিউশন ফি প্রদান ও মূল COE রিলিজ
  | 8  // এম্বাসি ইন্টারভিউ ও VFS ভিসা আবেদন
  | 9  // ভিসা সিলমোহর ও সার্ভিস চার্জ গ্রহণ
  | 10; // এয়ার টিকিট ও আফটার-অ্যারাইভাল সাপোর্ট (এয়ারপোর্ট পিকআপ, বাসা, পার্ট-টাইম)

export interface VisaApplicant {
  id: string;
  trackingNo: string; // e.g. KNLTC-VISA-2026-042
  name: string;
  phone: string;
  branch: "DHK-HQ" | "KHULNA-01";
  packageType: "REGULAR" | "PREMIUM";
  intakeSession: "APRIL_2027" | "JULY_2027" | "OCTOBER_2027" | "JANUARY_2028";
  stage: VisaStage;
  targetSchool: string;
  sponsorName: string;
  sponsorRelation: "FATHER" | "MOTHER" | "BROTHER" | "SISTER";
  sponsorBank: string;
  sponsorBalanceBdt: number;
  bankLoanAssistance: boolean;
  bankLoanBank?: string; // অগ্রণী, সোস্যাল ইসলামী, পূবালী
  coEStatus: "PENDING" | "APPROVED" | "REJECTED";
  visaStatus: "IN_PROCESS" | "STAMPED" | "DEPARTED";
  counselorName: string;
  updatedAt: string;
}

// ------------------------------------------------------------------------------
// LMS & External Portal Bridge (`npw.bd/knltc` & `npw.bd/irodori`)
// ------------------------------------------------------------------------------
export interface LmsUserBridge {
  id: string;
  studentName: string;
  phone: string;
  courseLevel: "N5" | "N4" | "IRODORI";
  enrollmentNo: string;
  portalUsername: string;
  portalPasswordMasked: string;
  portalFeeDeductedBdt: number; // ৳২,০০০ NPW প্ল্যাটফর্ম ফি
  netKnlTcMarginBdt: number;   // ৳১০,০০০ নিট প্রতিষ্ঠান মার্জিন
  credentialsSentViaWa: boolean;
  credentialsSentAt?: string;
  progressPercentage: number;
  activeBatch: string;
}

// ------------------------------------------------------------------------------
// B2B & Japanese School Partners
// ------------------------------------------------------------------------------
export interface JapanesePartnerSchool {
  id: string;
  name: string;
  japaneseName: string;
  location: string;
  contactPerson: string; // e.g. Principal Fujii Keiko, Donaka-san
  email: string;
  commissionPerStudentYen: number; // 80,000 JPY
  commissionPerStudentBdt: number; // ~60,000–64,000 BDT
  activeStudentsCount: number;
  totalCommissionReceivedYen: number;
  status: "ACTIVE_PARTNER" | "IN_REVIEW";
}

export interface B2bAgent {
  id: string;
  organizationName: string; // e.g. Nexus Group, BWBS Global, Local Agent
  agentType: "INSTITUTIONAL" | "LOCAL_SUB_AGENT" | "CAMPUS_AMBASSADOR";
  contactPerson: string;
  phone: string;
  city: string;
  referredStudentsCount: number;
  successfulVisasCount: number;
  agreedCommissionBdt: number;
  pendingCommissionBdt: number;
  paidCommissionBdt: number;
}

// ------------------------------------------------------------------------------
// Finance & Package Billing
// ------------------------------------------------------------------------------
export interface FinancialTransaction {
  id: string;
  receiptNo: string;
  date: string;
  studentName: string;
  type: "COURSE_FEE" | "REGULAR_SERVICE_CHARGE" | "PREMIUM_PACKAGE_ADVANCE" | "EXPENSE_OFFICE" | "MARKETING_META";
  amountBdt: number;
  paymentMethod: "BKASH" | "NAGAD" | "BANK_TRANSFER" | "CASH_OFFICE" | "AAMARPAY" | "SSLCOMMERZ";
  referenceOrTrx: string;
  branch: "DHK-HQ" | "KHULNA-01";
  verifiedBy: string;
  notes?: string;
}

// ------------------------------------------------------------------------------
// Investor Open-Book Portal (10 Lakh Investment Engine)
// ------------------------------------------------------------------------------
export interface InvestorProject {
  totalCapitalBdt: number; // 10,00,000 BDT
  budgetAllocation: {
    coachingSetup: number;       // 30% = 3,00,000 BDT
    marketingAndAds: number;     // 20% = 2,00,000 BDT
    operationalRunway: number;   // 30% = 3,00,000 BDT
    safetyReserve: number;       // 20% = 2,00,000 BDT
  };
  securityGuarantees: {
    stampAgreementBdt: number;   // 300 TK Govt Stamp
    bankChequeIssued: boolean;
    chequeNumber: string;
    investorName: string;
    tenureMonths: number;
    profitSharePercentage: number; // 10%
  };
  projections: {
    scenarios: {
      conservative: { visas: 20; grossProfit: 2400000; investorShare: 240000 };
      realistic: { visas: 30; grossProfit: 3600000; investorShare: 360000 };
      optimistic: { visas: 40; grossProfit: 4800000; investorShare: 480000 };
    };
    liveCalculatedVisas: number;
    liveGrossRevenue: number;
    liveNetProfit: number;
    liveInvestorDividend: number;
  };
}

// ------------------------------------------------------------------------------
// HR & Remote Tele-Counselor Workspace
// ------------------------------------------------------------------------------
export interface StaffMember {
  id: string;
  name: string;
  role: "TELE_COUNSELOR" | "SENIOR_SENSEI" | "BRANCH_MANAGER" | "COUNSELOR";
  location: "REMOTE" | "DHAKA_OFFICE" | "KHULNA_OFFICE";
  phone: string;
  email: string;
  monthlyBaseSalaryBdt: number;
  callsTargetMonthly: number;
  callsCompleted: number;
  admissionsTarget: number;
  admissionsAchieved: number;
  performanceBonusBdt: number;
  status: "ACTIVE" | "ON_LEAVE";
}

// ------------------------------------------------------------------------------
// 100% Website Content CMS (Editable via Dashboard)
// ------------------------------------------------------------------------------
export interface MultilingualText {
  bn: string;
  en: string;
  ja: string;
}

export interface MinnaLesson {
  id: string;
  lessonNumber: number;
  title: MultilingualText;
  tabCategory: "ALPHABET" | "KOTOBA" | "GRAMMAR" | "KAIWA";
  summary: MultilingualText;
  vocabularyList: {
    kanji: string;
    hiragana: string;
    romaji: string;
    meaningBn: string;
    meaningEn: string;
  }[];
  grammarPoints: string[];
  audioUrl?: string;
}

export interface JobCircular {
  id: string;
  title: MultilingualText;
  category: "SSW_CONSTRUCTION" | "SSW_CAREGIVER" | "SSW_AGRICULTURE" | "SSW_FOOD_SERVICE" | "TITP_TECHNICAL" | "TITP_WELDING";
  salaryYen: string;
  salaryBdtEquivalent: string;
  locationJapan: string;
  openings: number;
  requirements: MultilingualText;
  specialBenefitsBn: string; // e.g. "JLPT N4 পাসদের ঢাকায় ফ্রি থাকা-খাওয়া ও স্কিল ট্রেনিং"
  isPublished: boolean;
  deadline: string;
}

export interface BookStoreProduct {
  id: string;
  name: MultilingualText;
  slug: string;
  category: "TEXTBOOK" | "JLPT_PRACTICE" | "KANJI_SHEET" | "STATIONERY";
  priceBdt: number;
  salePriceBdt?: number;
  stockCount: number;
  imageUrl: string;
  badgeBn?: string;
  isPublished: boolean;
  description: MultilingualText;
}

export interface CustomerStoreOrder {
  id: string;
  orderNo: string;
  customerName: string;
  customerPhone: string;
  address: string;
  items: { productName: string; quantity: number; unitPrice: number }[];
  deliveryArea: "INSIDE_DHAKA" | "OUTSIDE_DHAKA";
  deliveryFee: number;
  grandTotal: number;
  paymentMethod: "COD" | "BKASH" | "NAGAD";
  trxId?: string;
  orderStatus: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  createdAt: string;
}

export interface WebsiteCmsContent {
  topAnnouncementBar: {
    enabled: boolean;
    text: MultilingualText;
    actionLinkText: MultilingualText;
    actionUrl: string;
  };
  popupBanner: {
    enabled: boolean;
    badge: MultilingualText;
    headline: MultilingualText;
    subheadline: MultilingualText;
    primaryCtaText: MultilingualText;
    primaryCtaUrl: string;
    waDirectText: string;
  };
  heroSection: {
    kicker: MultilingualText;
    headline: MultilingualText;
    subtitle: MultilingualText;
    stats: { label: MultilingualText; value: string }[];
    licenseInfo: MultilingualText;
  };
  languageCoursePage: {
    n5PriceBdt: number;
    n4PriceBdt: number;
    comboPriceBdt: number;
    externalLmsUrl: string;
    externalIrodoriUrl: string;
    bonuses: { title: MultilingualText; valueBdt: number; description: MultilingualText }[];
    lessons: MinnaLesson[];
  };
  studyInJapanPage: {
    regularPackageFeeBdt: number;   // 1,20,000 BDT
    premiumPackageFeeBdt: number;   // 11,00,000 BDT
    regularTerms: MultilingualText[];
    premiumTerms: MultilingualText[];
    eligibilityMinGpa: number;
    eligibilityMaxAge: number;
    eligibilityMaxStudyGapYears: number;
    ieltsRequired: boolean;
  };
  jobCirculars: JobCircular[];
  storeProducts: BookStoreProduct[];
  customerOrders: CustomerStoreOrder[];
  metaPixelId: string;
  contactHotline: string;
  contactWhatsApp: string;
  contactEmail: string;
  dhakaOfficeAddress: MultilingualText;
  khulnaOfficeAddress: MultilingualText;
  faqList: { question: MultilingualText; answer: MultilingualText }[];
  testimonials: { studentName: string; courseOrVisa: string; quote: MultilingualText; city: string; avatarUrl: string }[];
}

export interface MasterKnlTcStore {
  crmLeads: CrmLead[];
  visaApplicants: VisaApplicant[];
  lmsBridges: LmsUserBridge[];
  partnerSchools: JapanesePartnerSchool[];
  b2bAgents: B2bAgent[];
  transactions: FinancialTransaction[];
  investorProject: InvestorProject;
  staffList: StaffMember[];
  websiteCms: WebsiteCmsContent[];
}

// ------------------------------------------------------------------------------
// INITIAL SEED DATA (Authentic KNLTC Business Model)
// ------------------------------------------------------------------------------
const DEFAULT_WEBSITE_CMS: WebsiteCmsContent = {
  topAnnouncementBar: {
    enabled: true,
    text: {
      bn: "📢 ২০২৭ এপ্রিল ও জুলাই সেশন স্টুডেন্ট ভিসা ও SSW কনস্ট্রাকশন স্পেশাল ব্যাচে ভর্তি চলছে! সরাসরি জাপানি সেন্সির তত্ত্বাবধান।",
      en: "📢 April & July 2027 Intakes Open for Student Visa & SSW Construction Special Batch! Direct instruction by Native Sensei.",
      ja: "📢 2027年4月・7月期生 留学ビザ＆特定技能 建設特別コース 募集中！日本人講師直接指導。",
    },
    actionLinkText: {
      bn: "ফ্রি অ্যাপয়েন্টমেন্ট নিন",
      en: "Book Free Appointment",
      ja: "無料相談を予約",
    },
    actionUrl: "/contact",
  },
  popupBanner: {
    enabled: true,
    badge: {
      bn: "স্পেশাল স্কিল ক্যাম্পেইন",
      en: "Special Skill Campaign",
      ja: "特別技能キャンペーン",
    },
    headline: {
      bn: "SSW কনস্ট্রাকশন: JLPT N4 পাস করলেই ঢাকায় ফ্রি থাকা-খাওয়া ও স্কিল ট্রেনিং!",
      en: "SSW Construction: Pass JLPT N4 to get FREE Food, Accommodation & Practical Training in Dhaka!",
      ja: "特定技能 建設：JLPT N4合格でダッカでの宿泊・食事・実技訓練が完全無料！",
    },
    subheadline: {
      bn: "সরাসরি জাপানি কনস্ট্রাকশন কোম্পানি ইন্টারভিউ ও স্পেশাল কোটা। সীমিত সংখ্যক আসন!",
      en: "Direct live interview with licensed Japanese construction employers. Limited slots available.",
      ja: "認可済み日本の建設会社との直接面接。枠に限りがあります。",
    },
    primaryCtaText: {
      bn: "এখনই আবেদন করুন",
      en: "Apply Now",
      ja: "今すぐ応募",
    },
    primaryCtaUrl: "/work-in-japan",
    waDirectText: "হ্যালো KNLTC, আমি SSW কনস্ট্রাকশন স্কিল ক্যাম্পেইন সম্পর্কে জানতে চাই।",
  },
  heroSection: {
    kicker: {
      bn: "KNLTC • জাপান এডুকেশন, ক্যারিয়ার ও ল্যাঙ্গুয়েজ গেটওয়ে ঢাকা ও খুলনা",
      en: "KNLTC • Japan Education, Career & Language Gateway Dhaka & Khulna",
      ja: "KNLTC • バングラデシュ・日本教育キャリアゲートウェイ",
    },
    headline: {
      bn: "জাপানে উচ্চশিক্ষা, নিশ্চিত চাকরি ও স্থায়ী ক্যারিয়ারের পূর্ণাঙ্গ সমাধান",
      en: "Your Complete Pathway to Higher Study, Career & Permanent Settlement in Japan",
      ja: "日本での進学・就職・定住への最も確実なワンストップゲートウェイ",
    },
    subtitle: {
      bn: "স্টুডেন্ট ভিসা (রেগুলার ও প্রিমিয়াম), SSW ১৬টি খাত, TITP টেকনিক্যাল ইন্টার্নশিপ ও JLPT N5–N1 ভাষা কোর্স—ভিসার পূর্বে কোনো ফাইল ওপেনিং বা সার্ভিস চার্জ নেই।",
      en: "Student Visa (Regular & Premium), SSW 16 sectors, TITP technical training and Japanese Language (N5-N1). Zero advance service charge before visa.",
      ja: "留学ビザ、特定技能16分野、技能実習、日本語教育（N5-N1）。ビザ発給前の前払い手数料は一切不要です。",
    },
    stats: [
      { label: { bn: "সফল ভিসা", en: "Visas Processed", ja: "ビザ実績" }, value: "১,২০০+" },
      { label: { bn: "JLPT পাস রেট", en: "Pass Rate", ja: "合格率" }, value: "৯৮%" },
      { label: { bn: "জাপানি অংশীদার স্কুল", en: "Japanese Schools", ja: "提携教育機関" }, value: "২৫+" },
      { label: { bn: "আইনি চুক্তি", en: "Stamp Agreement", ja: "公的契約" }, value: "১০০%" },
    ],
    licenseInfo: {
      bn: "সরকারি রেজিস্টার্ড ও ৩০০ টাকার আইনি স্ট্যাম্পে চুক্তিবদ্ধ স্বচ্ছ প্রক্রিয়াকরণ",
      en: "Govt. Registered & Legally Bound with 300 BDT Judicial Stamp Agreement",
      ja: "政府公認・公的印紙契約による完全な透明性を保証",
    },
  },
  languageCoursePage: {
    n5PriceBdt: 12000,
    n4PriceBdt: 12000,
    comboPriceBdt: 21500,
    externalLmsUrl: "https://npw.bd/knltc",
    externalIrodoriUrl: "https://npw.bd/irodori/index.html",
    bonuses: [
      {
        title: {
          bn: "১৫ দিনের জাপানিজ এম্বাসি ও ভিসা ইন্টারভিউ প্রিপারেশন কোর্স",
          en: "15-Day Embassy & Visa Interview Preparation",
          ja: "15日間 大使館面接対策講座",
        },
        valueBdt: 6000,
        description: {
          bn: "ভিসা অফিসারের সম্ভাব্য ৩০টি কমন ও ট্রিকি প্রশ্ন, শিবৌ দোকি (অধ্যয়ন উদ্দেশ্য) এবং লাইভ ক্যামেরা মক ইন্টারভিউ।",
          en: "Top 30 visa officer questions, study purpose statement, and live camera mock sessions.",
          ja: "領事面接対策、志望動機書の添削、模擬面接の実施。",
        },
      },
      {
        title: {
          bn: "১০ দিনের জাপানিজ স্ট্যান্ডার্ড রিজিউমি / সিভি (Rirekisho) রাইটিং কোর্স",
          en: "10-Day Japanese Resume (Rirekisho) Writing Course",
          ja: "10日間 履歴書・職務経歴書作成講座",
        },
        valueBdt: 4500,
        description: {
          bn: "জাপানের JIS স্ট্যান্ডার্ড ফরম্যাটে 履歴書 ও 職務経歴書 নির্ভুলভাবে প্রস্তুত করার হাতে-কলমে প্রশিক্ষণ।",
          en: "Practical training in drafting official JIS-standard Japanese resumes and work histories.",
          ja: "JIS規格履歴書と職務経歴書の書き方実践指導。",
        },
      },
      {
        title: {
          bn: "১০ দিনের পার্ট-টাইম জব (Baitō) ইন্টারভিউ ও কনভিনিয়েন্স স্টোর স্পোকেন কোর্স",
          en: "10-Day Part-time Job (Baito) Interview & Spoken Japanese Course",
          ja: "10日間 アルバイト面接・接客会話講座",
        },
        valueBdt: 4500,
        description: {
          bn: "জাপানে সেভেন-ইলেভেন, লসন ও রেস্তোরাঁয় কাজের প্র্যাকটিক্যাল গ্রাহক সেবা সংলাপ ও ফ্রন্ট ডেস্ক শিষ্টাচার।",
          en: "Essential conversational drill for 7-Eleven, Lawson, and Japanese restaurant customer service.",
          ja: "コンビニや飲食店での接客日本語とアルバイト面接ロールプレイング。",
        },
      },
    ],
    lessons: [
      {
        id: "lesson-01",
        lessonNumber: 1,
        title: {
          bn: "লেসন ১: আত্মপরিচয় ও মৌলিক সম্ভাষণ (Jikoshoukai)",
          en: "Lesson 1: Self-Introduction & Basic Greetings (Jikoshoukai)",
          ja: "第1課：自己紹介と基本のあいさつ",
        },
        tabCategory: "KOTOBA",
        summary: {
          bn: "মিন্না নো নিহোঙ্গো ১ম অধ্যায়ের মূল শব্দভাণ্ডার, ওয়া/দেস বাক্য গঠন ও পরিচিতি।",
          en: "Vocabulary, ~wa ~desu sentence structure, and self-introduction basics.",
          ja: "「～は～です」構文と基本語彙の学習。",
        },
        vocabularyList: [
          { kanji: "私", hiragana: "わたし", romaji: "watashi", meaningBn: "আমি", meaningEn: "I / me" },
          { kanji: "学生", hiragana: "がくせい", romaji: "gakusei", meaningBn: "ছাত্র / শিক্ষার্থী", meaningEn: "Student" },
          { kanji: "先生", hiragana: "せんせい", romaji: "sensei", meaningBn: "শিক্ষক / ওস্তাদ", meaningEn: "Teacher / Instructor" },
          { kanji: "会社員", hiragana: "かいしゃいん", romaji: "kaishain", meaningBn: "কোম্পানি কর্মী", meaningEn: "Company employee" },
        ],
        grammarPoints: [
          "N1 は N2 です (N1 is N2)",
          "N1 は N2 じゃありません / ではありません (N1 is not N2)",
          "N1 は N2 ですか (Is N1 N2?)",
          "N も (N also / too)",
        ],
      },
      {
        id: "lesson-02",
        lessonNumber: 2,
        title: {
          bn: "লেসন ২: নির্দেশক শব্দাবলী (Kore, Sore, Are, Dore)",
          en: "Lesson 2: Demonstratives (Kore, Sore, Are, Dore)",
          ja: "第2課：指示代名詞（これ・それ・あれ・どれ）",
        },
        tabCategory: "GRAMMAR",
        summary: {
          bn: "কাছের ও দূরের বস্তু নির্দেশ এবং মালিকানা (No পার্টিকেল) প্রকাশ।",
          en: "Pointing out objects near/far and expressing possession with particle 'No'.",
          ja: "物の指示代名詞と所有を表す助詞「の」の用法。",
        },
        vocabularyList: [
          { kanji: "本", hiragana: "ほん", romaji: "hon", meaningBn: "বই", meaningEn: "Book" },
          { kanji: "辞書", hiragana: "じしょ", romaji: "jisho", meaningBn: "অভিধান", meaningEn: "Dictionary" },
          { kanji: "時計", hiragana: "とけい", romaji: "tokei", meaningBn: "ঘড়ি", meaningEn: "Clock / Watch" },
          { kanji: "車", hiragana: "くるま", romaji: "kuruma", meaningBn: "গাড়ি", meaningEn: "Car" },
        ],
        grammarPoints: [
          "これ / それ / あれ は N です (This / That / That over there is N)",
          "この / その / あの N は ... です",
          "そうです / そうじゃありません",
        ],
      },
    ],
  },
  studyInJapanPage: {
    regularPackageFeeBdt: 120000,
    premiumPackageFeeBdt: 1100000,
    regularTerms: [
      {
        bn: "সার্ভিস চার্জ: মাত্র ১,২০,০০০ টাকা (প্রি-ভিসা / COE আসার পর পরিশোধযোগ্য)",
        en: "Service Fee: Only 1,20,000 BDT (Payable strictly AFTER Pre-Visa / COE approval)",
        ja: "サービス料：120,000タカ（COE取得後に支払い）",
      },
      {
        bn: "ভিসা বা COE পাওয়ার পূর্বে অগ্রিম কোনো ফাইল ওপেনিং বা সার্ভিস চার্জ নেই",
        en: "Zero file opening fee or advance service charge prior to visa / COE",
        ja: "ビザ・COE発給前の一切の着手金・事前手数料なし",
      },
      {
        bn: "জাপানি শিক্ষা প্রতিষ্ঠানে আবেদন, ইন্টারভিউ প্রস্তুতি ও স্পনসরশিপ পেপারস অডিট অন্তর্ভুক্ত",
        en: "Includes Japanese school application, mock interview training, and sponsorship audit",
        ja: "学校出願、面接対策、スポンサー書類審査を完全サポート",
      },
      {
        bn: "১ বছরের টিউশন ফি (আনুমানিক ৭ লক্ষ টাকা) ও এয়ার টিকিট শিক্ষার্থী নিজে বহন করবে",
        en: "1st year tuition fee (~7 Lakh BDT) and air ticket paid directly by student",
        ja: "初年度学費（約70万タカ）および航空券は実費自己負担",
      },
    ],
    premiumTerms: [
      {
        bn: "অল-ইন-ওয়ান কভারেজ: ১১,০০,০০০–১২,০০,০০০ টাকা (সম্পূর্ণ ঝুঁকিমুক্ত নো-ভিসা নো-লস প্যাকেজ)",
        en: "All-in-One Coverage: 11,00,000 - 12,00,000 BDT (Risk-free No Visa No Loss package)",
        ja: "オールインワン：1,100,000〜1,200,000タカ（完全返金保証付き）",
      },
      {
        bn: "চুক্তির সময় ১০% জামানত — কোনো কারণে ভিসা না হলে স্ট্যাম্প অনুযায়ী ১০০% রিফান্ডযোগ্য",
        en: "10% security deposit at contract sign — 100% refundable if visa is denied",
        ja: "契約時手付金10%（不交付の場合は契約に基づき100%返金）",
      },
      {
        bn: "১ম বছরের সম্পূর্ণ টিউশন ফি (৳ ৭,০০,০০০) ও ওয়ান-ওয়ে আন্তর্জাতিক এয়ার টিকিট KNLTC বহন করে",
        en: "1st year full tuition fee (7,00,000 BDT) and international flight covered by KNLTC",
        ja: "初年度学費全額（約70万タカ）と片道航空券はKNLTCが負担",
      },
      {
        bn: "জাপানে পৌঁছার পর ফ্রি এয়ারপোর্ট পিকআপ, নিরাপদ ডরমেটরি ও সপ্তাহে ২৮ ঘণ্টার কাজ সাপোর্ট",
        en: "Airport reception in Japan, dorm arrangement and 28 hrs/week legal part-time job matching",
        ja: "日本到着後の空港送迎、宿舎手配、週28時間アルバイト紹介保証",
      },
    ],
    eligibilityMinGpa: 2.5,
    eligibilityMaxAge: 30,
    eligibilityMaxStudyGapYears: 6,
    ieltsRequired: false,
  },
  jobCirculars: [
    {
      id: "job-01",
      title: {
        bn: "SSW কনস্ট্রাকশন ও নির্মাণ বিশেষজ্ঞ (টোকিও ও ওসাকা)",
        en: "SSW Construction & Building Specialist (Tokyo & Osaka)",
        ja: "特定技能 建設・躯体工事スペシャリスト（東京・大阪）",
      },
      category: "SSW_CONSTRUCTION",
      salaryYen: "¥180,000 – ¥230,000 / মাস",
      salaryBdtEquivalent: "৳ ১,৪৫,০০০ – ৳ ১,৮৫,০০০",
      locationJapan: "Tokyo, Kanagawa, Osaka",
      openings: 15,
      requirements: {
        bn: "JLPT N4 অথবা JFT-Basic + কনস্ট্রাকশন স্কিল টেস্ট (JAC)। ভালো শারীরিক সুস্থতা।",
        en: "JLPT N4 or JFT-Basic + JAC Construction Evaluation Test. Good physical fitness.",
        ja: "JLPT N4またはJFT-Basic合格、JAC建設評価試験合格、健康状態良好な方。",
      },
      specialBenefitsBn: "💥 স্পেশাল অফার: JLPT N4 পাসদের ঢাকায় ফ্রি থাকা-খাওয়া ও প্র্যাকটিক্যাল স্কিল ট্রেনিং দেওয়া হচ্ছে!",
      isPublished: true,
      deadline: "2027-01-31",
    },
    {
      id: "job-02",
      title: {
        bn: "SSW নার্সিং কেয়ারগিভার (Kaigo - আইচি ও হিরোশিমা)",
        en: "SSW Nursing Caregiver (Kaigo - Aichi & Hiroshima)",
        ja: "特定技能 介護スタッフ（愛知・広島）",
      },
      category: "SSW_CAREGIVER",
      salaryYen: "¥190,000 – ¥245,000 / মাস",
      salaryBdtEquivalent: "৳ ১,৫৫,০০০ – ৳ ১,৯৮,০০০",
      locationJapan: "Nagoya, Hiroshima, Fukuoka",
      openings: 20,
      requirements: {
        bn: "JLPT N4 বা JFT-Basic + নার্সিং কেয়ার স্কিল ও জাপানিজ কেয়ারগিভিং ল্যাঙ্গুয়েজ টেস্ট।",
        en: "JLPT N4 or JFT-Basic + Nursing Care Skill & Caregiving Japanese Evaluation Test.",
        ja: "JLPT N4またはJFT-Basic合格、介護技能評価試験および介護日本語試験合格。",
      },
      specialBenefitsBn: "সাবসিডিযুক্ত আধুনিক ডরমেটরি বাসস্থান, ওভারটাইম ভাতা এবং জাপানি সোশ্যাল ইনস্যুরেন্স সুবিধা।",
      isPublished: true,
      deadline: "2027-02-15",
    },
    {
      id: "job-03",
      title: {
        bn: "SSW এগ্রিকালচার ও ফার্মিং বিশেষজ্ঞ (হক্কাইডো ও নাগানো)",
        en: "SSW Agriculture & Farming Specialist (Hokkaido & Nagano)",
        ja: "特定技能 農業・畜産スタッフ（北海道・長野）",
      },
      category: "SSW_AGRICULTURE",
      salaryYen: "¥170,000 – ¥215,000 / মাস",
      salaryBdtEquivalent: "৳ ১,৩৮,০০০ – ৳ ১,৭২,০০০",
      locationJapan: "Hokkaido, Nagano, Kumamoto",
      openings: 12,
      requirements: {
        bn: "JLPT N4 অথবা JFT-Basic + এগ্রিকালচার স্কিল টেস্ট। ফসল ও গ্রিনহাউস কাজে আগ্রহ।",
        en: "JLPT N4 or JFT-Basic + Agriculture Skill Test. Passion for greenhouse & crops.",
        ja: "JLPT N4またはJFT-Basic合格、農業技能測定試験合格。",
      },
      specialBenefitsBn: "বিনামূল্যে ফ্রেশ ফার্ম ফুড অ্যালাউন্স, কোজি কান্ট্রি হাউজিং ও ভিসা নবায়ন সুবিধা।",
      isPublished: true,
      deadline: "2027-03-01",
    },
  ],
  storeProducts: [
    {
      id: "prod-01",
      name: {
        bn: "মিন্না নো নিহোঙ্গো শোকিউ ১ (বাংলা অনুবাদ, ব্যাকরণ নোট ও ভোকাবুলারি)",
        en: "Minna No Nihongo Shokyu 1 (Bangla Translation & Grammar Notes)",
        ja: "みんなの日本語 初級I（ベンガル語翻訳・文法解説付き）",
      },
      slug: "minna-no-nihongo-shokyu-1-bangla",
      category: "TEXTBOOK",
      priceBdt: 450,
      salePriceBdt: 390,
      stockCount: 65,
      imageUrl: "/placeholder.svg",
      badgeBn: "বেস্টসেলার",
      isPublished: true,
      description: {
        bn: "বাংলাদেশি শিক্ষার্থীদের জন্য ১-২৫ অধ্যায়ের নির্ভুল বাংলা অর্থ, গ্রামার নোট এবং প্র্যাকটিস ড্রিলস। N5 ও JFT প্রস্তুতির মূল বই।",
        en: "Original Lessons 1-25 translated accurately into Bengali with full grammar explanations for N5 aspirants.",
        ja: "バングラデシュの初級学習者のための第1〜25課ベンガル語解説付き標準テキスト。",
      },
    },
    {
      id: "prod-02",
      name: {
        bn: "JLPT N5 অফিসিয়াল প্র্যাকটিস ওয়ার্কবুক ও স্পেশাল অডিও সিডি",
        en: "JLPT N5 Official Practice Workbook with Listening Audio CD",
        ja: "JLPT N5 公式問題集＆リスニングCD付き",
      },
      slug: "jlpt-n5-official-practice-workbook",
      category: "JLPT_PRACTICE",
      priceBdt: 550,
      salePriceBdt: 480,
      stockCount: 40,
      imageUrl: "/placeholder.svg",
      badgeBn: "মক টেস্ট স্পেশাল",
      isPublished: true,
      description: {
        bn: "JLPT এবং NAT-TEST-এর আসল পরীক্ষার প্যাটার্নে সাজানো ৫টি পূর্ণাঙ্গ প্রশ্নব্যাংক ও নেটিভ অডিও।",
        en: "Real exam simulation with 5 full mock test papers and native Japanese speaker audio.",
        ja: "本試験と同形式の模擬試験5回分とネイティブ音声音源を収録。",
      },
    },
    {
      id: "prod-03",
      name: {
        bn: "জাপানি কাঞ্জি ও ক্যালিগ্রাফি রাইটিং গ্রিড খাতা (১০৩ কাঞ্জি স্ট্রোক গাইড)",
        en: "Japanese Kanji & Calligraphy Practice Notebook (103 Kanji Strokes)",
        ja: "漢字・かな書き方練習帳（原稿用紙マス目仕様）",
      },
      slug: "kanji-calligraphy-writing-notebook",
      category: "KANJI_SHEET",
      priceBdt: 200,
      salePriceBdt: 160,
      stockCount: 110,
      imageUrl: "/placeholder.svg",
      badgeBn: "হাতে লেখার খাতা",
      isPublished: true,
      description: {
        bn: "স্কয়ার গ্রিড সহ জাপানিজ মানুস্ক্রিপ্ট পেপার, যা হিরাগানা ও কাঞ্জির ভারসাম্যপূর্ণ স্ট্রোক অর্ডারে অপরিহার্য।",
        en: "Special square-grid calligraphy manuscript paper designed for perfect Japanese stroke order.",
        ja: "正しい筆順とバランスの良い文字が身につくマス目入り練習ノート。",
      },
    },
  ],
  customerOrders: [
    {
      id: "ord-101",
      orderNo: "KNLTC-ORD-8921",
      customerName: "আব্দুল্লাহ আল মামুন",
      customerPhone: "01711998877",
      address: "বাড়ি ১২, রোড ৫, মিরপুর ১০, ঢাকা",
      items: [{ productName: "মিন্না নো নিহোঙ্গো শোকিউ ১", quantity: 1, unitPrice: 390 }],
      deliveryArea: "INSIDE_DHAKA",
      deliveryFee: 60,
      grandTotal: 450,
      paymentMethod: "COD",
      orderStatus: "PROCESSING",
      createdAt: "2026-10-18T10:15:00.000Z",
    },
    {
      id: "ord-102",
      orderNo: "KNLTC-ORD-8922",
      customerName: "ফারহানা ইয়াসমিন",
      customerPhone: "01822334455",
      address: "সোনারগাঁও রোড, বয়রা, খুলনা",
      items: [
        { productName: "মিন্না নো নিহোঙ্গো শোকিউ ১", quantity: 1, unitPrice: 390 },
        { productName: "JLPT N5 প্র্যাকটিস ওয়ার্কবুক", quantity: 1, unitPrice: 480 },
      ],
      deliveryArea: "OUTSIDE_DHAKA",
      deliveryFee: 120,
      grandTotal: 990,
      paymentMethod: "BKASH",
      trxId: "BK994821734",
      orderStatus: "SHIPPED",
      createdAt: "2026-10-19T14:30:00.000Z",
    },
  ],
  metaPixelId: "n6w8uw179i0d0yw42u7z64xonnbmzv",
  contactHotline: "+880 1805 013633",
  contactWhatsApp: "+880 1805 013633",
  contactEmail: "info@knltc.com",
  dhakaOfficeAddress: {
    bn: "স্কাই ভিউ ট্রেড ভ্যালি (৮ম তলা), ৬৬/১ ভিআইপি রোড, নয়া পল্টন, ঢাকা-১০০০",
    en: "Sky View Trade Valley (8th Floor), 66/1 VIP Road, Naya Paltan, Dhaka-1000",
    ja: "スカイビュートレードバレー（8階）、66/1 VIPロード、ナヤパルタン、ダッカ",
  },
  khulnaOfficeAddress: {
    bn: "কেডিএ এভিনিউ, শিববাড়ি মোড়, সোনাডাঙ্গা, খুলনা",
    en: "KDA Avenue, Shibbari More, Sonadanga, Khulna",
    ja: "KDAアベニュー、シッバリ・モア、ソナダンガ、クルナ",
  },
  faqList: [
    {
      question: {
        bn: "জাপানে স্টুডেন্ট ভিসায় যেতে কি IELTS বা অগ্রিম ফি লাগে?",
        en: "Is IELTS or advance fee required for Japan student visa?",
        ja: "日本の留学ビザにIELTSや前払いの費用は必要ですか？",
      },
      answer: {
        bn: "না! জাপানের জন্য কোনো IELTS প্রয়োজন নেই। শুধুমাত্র জাপানি ভাষা N5 লেভেল বা ১৫০ ঘণ্টার কোর্স সম্পন্ন করলেই আবেদন সম্ভব। KNLTC-তে প্রি-ভিসা (COE) আসার পূর্বে কোনো সার্ভিস চার্জ দিতে হয় না।",
        en: "No! IELTS is not required. You only need JLPT N5 or 150 hours of Japanese study. At KNLTC, no service charge is taken before COE approval.",
        ja: "いいえ、IELTSは不要です。日本語N5レベルまたは150時間の学習歴があれば申請可能です。COE発給前の事前手数料は一切不要です。",
      },
    },
    {
      question: {
        bn: "SSW কনস্ট্রাকশন স্পেশাল ক্যাম্পেইনের সুবিধাগুলো কী?",
        en: "What are the benefits of the SSW Construction special campaign?",
        ja: "特定技能 建設特別キャンペーンのメリットは何ですか？",
      },
      answer: {
        bn: "যারা অলরেডি JLPT N4 বা JFT পাস করেছেন, তাদের ঢাকায় আমাদের সেন্টারে বিনামূল্যে থাকা ও খাওয়ার সুবিধা দেওয়া হয় এবং সরাসরি কনস্ট্রাকশন স্কিল টেস্ট প্র্যাকটিস করিয়ে জাপানি কোম্পানির সাথে ইন্টারভিউ করিয়ে দেওয়া হয়।",
        en: "For candidates who already passed N4 or JFT, we provide free food and hostel in Dhaka, with practical construction test training and direct live interviews.",
        ja: "N4またはJFT合格者には、ダッカでの宿泊・食事を無料提供し、実技試験対策と日本企業との直接面接をサポートします。",
      },
    },
  ],
  testimonials: [
    {
      studentName: "তানভীর হাসান",
      courseOrVisa: "টোকিও ল্যাঙ্গুয়েজ স্কুল (এপ্রিল ইনটেক)",
      quote: {
        bn: "KNLTC-র সবচেয়ে বড় সততা হলো ভিসার আগে ১ টাকাও সার্ভিস ফি নেয়নি। আর আমির সেন্সির ইন্টারভিউ ট্রেনিং আমাকে এম্বাসিতে কনফিডেন্স দিয়েছে।",
        en: "KNLTC took zero service fee before visa. Sensei Amir's interview drills gave me immense confidence at the Embassy.",
        ja: "ビザ取得前の事前費用が一切なく、アミール先生の丁寧な面接指導のおかげで無事にビザを取得できました。",
      },
      city: "ঢাকা",
      avatarUrl: "/placeholder.svg",
    },
    {
      studentName: "সাদিয়া আক্তার",
      courseOrVisa: "SSW কেয়ারগিভার (আইচি প্রশাসনিক অঞ্চল)",
      quote: {
        bn: "নার্সিং ডিপ্লোমার পর KNLTC-তে N4 ও স্পেশাল কেয়ারগিভিং টার্মস শিখেছি। প্রতি মাসে এখন ২ লক্ষ টাকার বেশি বৈধ আয় করছি।",
        en: "Learned N4 and technical caregiving terms at KNLTC after nursing diploma. Now earning over 200,000 JPY monthly in Japan.",
        ja: "看護専門卒業後、KNLTCでN4と介護専門用語を学びました。現在は愛知県で充実した就労生活を送っています。",
      },
      city: "খুলনা",
      avatarUrl: "/placeholder.svg",
    },
  ],
};

const DEFAULT_CRM_LEADS: CrmLead[] = [
  {
    id: "lead-001",
    name: "তানজিল আহমেদ",
    phone: "01712345678",
    whatsapp: "+8801712345678",
    email: "tanjil.japan@gmail.com",
    city: "ঢাকা",
    source: "FACEBOOK_META",
    interest: "STUDENT_VISA_REGULAR",
    status: "OFFICE_VISIT_BOOKED",
    education: "HSC 2024 (GPA 4.25)",
    japaneseProficiency: "LEARNING_N5",
    studyGapYears: 1,
    assignedTo: "সুমাইয়া সুলতানা (টেলি-কাউন্সেলর)",
    branch: "DHK-HQ",
    notes: "বাবা ব্যবসায়ী, ১৮ লক্ষ টাকা ব্যাংক সলভেন্সি রেডি। শনিবার বিকাল ৩টায় ঢাকা অফিসে আসবেন।",
    followUpDate: "2026-10-24",
    lastContactedAt: "2026-10-21T11:00:00.000Z",
    createdAt: "2026-10-20T08:30:00.000Z",
  },
  {
    id: "lead-002",
    name: "মেহেদী হাসান রনি",
    phone: "01899887766",
    whatsapp: "+8801899887766",
    city: "খুলনা",
    source: "WHATSAPP_DIRECT",
    interest: "SSW_CONSTRUCTION_SPECIAL",
    status: "COUNSELED",
    education: "ডিপ্লোমা ইন সিভিল ইঞ্জিনিয়ারিং",
    japaneseProficiency: "PASSED_N4",
    studyGapYears: 2,
    assignedTo: "রোকসানা আক্তার (টেলি-কাউন্সেলর)",
    branch: "KHULNA-01",
    notes: "অলরেডি N4 পাস। ঢাকায় ফ্রি থাকা-খাওয়ার ক্যাম্পেইনে জয়েন করতে চায়।",
    followUpDate: "2026-10-23",
    lastContactedAt: "2026-10-21T15:20:00.000Z",
    createdAt: "2026-10-19T14:10:00.000Z",
  },
  {
    id: "lead-003",
    name: "ফারিহা জামান",
    phone: "01911224455",
    whatsapp: "+8801911224455",
    email: "fariha.kaigo@yahoo.com",
    city: "যশোর",
    source: "WEBSITE_FORM",
    interest: "SSW_CAREGIVER",
    status: "NEW",
    education: "বিএসসি ইন নার্সিং (২০২৩)",
    japaneseProficiency: "NONE",
    studyGapYears: 3,
    assignedTo: "সুমাইয়া সুলতানা (টেলি-কাউন্সেলর)",
    branch: "KHULNA-01",
    notes: "N5+N4 কম্বো কোর্সে ভর্তি হতে আগ্রহী।",
    followUpDate: "2026-10-22",
    lastContactedAt: "2026-10-21T09:00:00.000Z",
    createdAt: "2026-10-21T07:45:00.000Z",
  },
  {
    id: "lead-004",
    name: "রাকিবুল ইসলাম",
    phone: "01688776655",
    whatsapp: "+8801688776655",
    city: "ঢাকা",
    source: "OFFICE_WALKIN",
    interest: "STUDENT_VISA_PREMIUM",
    status: "ADMITTED",
    education: "অনার্স কমপ্লিট (ইংরেজি)",
    japaneseProficiency: "PASSED_N5",
    studyGapYears: 2,
    assignedTo: "শেখ বাসেত (ম্যানেজিং ডিরেক্টর)",
    branch: "DHK-HQ",
    notes: "প্রিমিয়াম প্যাকেজে চুক্তিবদ্ধ। HLA Gakuin এপ্রিল ইনটেক ফাইল তৈরি হচ্ছে।",
    followUpDate: "2026-10-30",
    lastContactedAt: "2026-10-20T17:00:00.000Z",
    createdAt: "2026-10-15T12:00:00.000Z",
  },
];

const DEFAULT_VISA_APPLICANTS: VisaApplicant[] = [
  {
    id: "visa-01",
    trackingNo: "KNLTC-VISA-2027-01",
    name: "রাকিবুল ইসলাম",
    phone: "01688776655",
    branch: "DHK-HQ",
    packageType: "PREMIUM",
    intakeSession: "APRIL_2027",
    stage: 4, // জাপানি স্কুল জুম ইন্টারভিউ
    targetSchool: "HLA Gakuin (Hiroshima)",
    sponsorName: "মোহাম্মদ রফিকুল ইসলাম (পিতা)",
    sponsorRelation: "FATHER",
    sponsorBank: "অগ্রণী ব্যাংক লি.",
    sponsorBalanceBdt: 1950000,
    bankLoanAssistance: false,
    coEStatus: "PENDING",
    visaStatus: "IN_PROCESS",
    counselorName: "শেখ বাসেত",
    updatedAt: "2026-10-20T10:00:00.000Z",
  },
  {
    id: "visa-02",
    trackingNo: "KNLTC-VISA-2027-02",
    name: "মাহমুদ হাসান",
    phone: "01722338899",
    branch: "DHK-HQ",
    packageType: "REGULAR",
    intakeSession: "APRIL_2027",
    stage: 5, // COE আবেদন জমা
    targetSchool: "Tokyo Central Japanese Language School",
    sponsorName: "সেলিনা পারভীন (মাতা)",
    sponsorRelation: "MOTHER",
    sponsorBank: "সোস্যাল ইসলামী ব্যাংক লি.",
    sponsorBalanceBdt: 1820000,
    bankLoanAssistance: true,
    bankLoanBank: "সোস্যাল ইসলামী ব্যাংক",
    coEStatus: "PENDING",
    visaStatus: "IN_PROCESS",
    counselorName: "আমির হোসেন",
    updatedAt: "2026-10-18T14:00:00.000Z",
  },
  {
    id: "visa-03",
    trackingNo: "KNLTC-VISA-2027-03",
    name: "শামীম রেজা",
    phone: "01855443322",
    branch: "KHULNA-01",
    packageType: "REGULAR",
    intakeSession: "APRIL_2027",
    stage: 2, // ভাষা প্রশিক্ষণ
    targetSchool: "Osaka International Academy",
    sponsorName: "শাহ আলম (পিতা)",
    sponsorRelation: "FATHER",
    sponsorBank: "পূবালী ব্যাংক লি.",
    sponsorBalanceBdt: 1800000,
    bankLoanAssistance: false,
    coEStatus: "PENDING",
    visaStatus: "IN_PROCESS",
    counselorName: "খুলনা শাখা ব্যবস্থাপক",
    updatedAt: "2026-10-15T09:30:00.000Z",
  },
  {
    id: "visa-04",
    trackingNo: "KNLTC-VISA-2026-88",
    name: "সাইফুল ইসলাম",
    phone: "01944556677",
    branch: "DHK-HQ",
    packageType: "REGULAR",
    intakeSession: "APRIL_2027",
    stage: 9, // ভিসা সিলমোহর ও সার্ভিস চার্জ গ্রহণ
    targetSchool: "HLA Gakuin (Hiroshima)",
    sponsorName: "আবুল কালাম (বড় ভাই)",
    sponsorRelation: "BROTHER",
    sponsorBank: "জনতা ব্যাংক লি.",
    sponsorBalanceBdt: 2100000,
    bankLoanAssistance: false,
    coEStatus: "APPROVED",
    visaStatus: "STAMPED",
    counselorName: "শেখ বাসেত",
    updatedAt: "2026-10-19T16:00:00.000Z",
  },
];

const DEFAULT_LMS_BRIDGES: LmsUserBridge[] = [
  {
    id: "lms-01",
    studentName: "তানজিল আহমেদ",
    phone: "01712345678",
    courseLevel: "N5",
    enrollmentNo: "KNLTC-2026-N5-102",
    portalUsername: "tanjil_knltc",
    portalPasswordMasked: "N5@knltc2026",
    portalFeeDeductedBdt: 2000,
    netKnlTcMarginBdt: 10000,
    credentialsSentViaWa: true,
    credentialsSentAt: "2026-10-20T12:00:00.000Z",
    progressPercentage: 35,
    activeBatch: "N5 Morning Live (Zoom Batch 42)",
  },
  {
    id: "lms-02",
    studentName: "মেহেদী হাসান রনি",
    phone: "01899887766",
    courseLevel: "N4",
    enrollmentNo: "KNLTC-2026-N4-054",
    portalUsername: "mehedi_ssw",
    portalPasswordMasked: "SswN4#2026",
    portalFeeDeductedBdt: 2000,
    netKnlTcMarginBdt: 10000,
    credentialsSentViaWa: true,
    credentialsSentAt: "2026-10-19T15:30:00.000Z",
    progressPercentage: 68,
    activeBatch: "N4 SSW Special Live (Zoom Batch 14)",
  },
];

const DEFAULT_PARTNER_SCHOOLS: JapanesePartnerSchool[] = [
  {
    id: "sch-01",
    name: "HLA Gakuin (Hiroshima Language Academy)",
    japaneseName: "HLA学院（広島）",
    location: "Hiroshima, Japan",
    contactPerson: "Principal Fujii Keiko / Donaka-san",
    email: "admissions@hla-gakuin.jp",
    commissionPerStudentYen: 80000,
    commissionPerStudentBdt: 64000,
    activeStudentsCount: 18,
    totalCommissionReceivedYen: 1440000,
    status: "ACTIVE_PARTNER",
  },
  {
    id: "sch-02",
    name: "Tokyo Central Japanese Language School",
    japaneseName: "東京中央日本語学院",
    location: "Shinjuku, Tokyo",
    contactPerson: "Kobayashi Sensei",
    email: "global@tcj-nihongo.com",
    commissionPerStudentYen: 80000,
    commissionPerStudentBdt: 64000,
    activeStudentsCount: 12,
    totalCommissionReceivedYen: 960000,
    status: "ACTIVE_PARTNER",
  },
];

const DEFAULT_B2B_AGENTS: B2bAgent[] = [
  {
    id: "b2b-01",
    organizationName: "Nexus Group Global Admissions",
    agentType: "INSTITUTIONAL",
    contactPerson: "ইঞ্জি. মোস্তাফিজুর রহমান",
    phone: "01711002233",
    city: "ঢাকা",
    referredStudentsCount: 14,
    successfulVisasCount: 11,
    agreedCommissionBdt: 30000,
    pendingCommissionBdt: 60000,
    paidCommissionBdt: 270000,
  },
  {
    id: "b2b-02",
    organizationName: "BWBS Worldwide Services",
    agentType: "INSTITUTIONAL",
    contactPerson: "Mr. Chowdhury",
    phone: "01819112233",
    city: "UK / Dhaka Liaison",
    referredStudentsCount: 8,
    successfulVisasCount: 6,
    agreedCommissionBdt: 35000,
    pendingCommissionBdt: 35000,
    paidCommissionBdt: 175000,
  },
  {
    id: "b2b-03",
    organizationName: "খুলনা ইউনিভার্সিটি ক্যাম্পাস অ্যাম্বাসেডর উইং",
    agentType: "CAMPUS_AMBASSADOR",
    contactPerson: "সাকিব আল হাসান",
    phone: "01922334411",
    city: "খুলনা",
    referredStudentsCount: 9,
    successfulVisasCount: 4,
    agreedCommissionBdt: 15000,
    pendingCommissionBdt: 15000,
    paidCommissionBdt: 45000,
  },
];

const DEFAULT_TRANSACTIONS: FinancialTransaction[] = [
  {
    id: "trx-01",
    receiptNo: "RCP-2026-0491",
    date: "2026-10-21",
    studentName: "তানজিল আহমেদ",
    type: "COURSE_FEE",
    amountBdt: 12000,
    paymentMethod: "BKASH",
    referenceOrTrx: "BK-99382104",
    branch: "DHK-HQ",
    verifiedBy: "শেখ বাসেত",
    notes: "N5 কোর্স সম্পূর্ণ পরিশোধ",
  },
  {
    id: "trx-02",
    receiptNo: "RCP-2026-0492",
    date: "2026-10-20",
    studentName: "সাইফুল ইসলাম",
    type: "REGULAR_SERVICE_CHARGE",
    amountBdt: 120000,
    paymentMethod: "BANK_TRANSFER",
    referenceOrTrx: "IBBL-DEP-00492",
    branch: "DHK-HQ",
    verifiedBy: "শেখ বাসেত",
    notes: "ভিসা সাকসেস পরবর্তী রেগুলার প্যাকেজ সার্ভিস চার্জ",
  },
  {
    id: "trx-03",
    receiptNo: "RCP-2026-0493",
    date: "2026-10-19",
    studentName: "রাকিবুল ইসলাম",
    type: "PREMIUM_PACKAGE_ADVANCE",
    amountBdt: 110000,
    paymentMethod: "AAMARPAY",
    referenceOrTrx: "AP-88492019",
    branch: "DHK-HQ",
    verifiedBy: "শেখ বাসেত",
    notes: "প্রিমিয়াম প্যাকেজ চুক্তি সময় ১০% জামানত (ভিসা না হলে ফেরতযোগ্য)",
  },
  {
    id: "trx-04",
    receiptNo: "RCP-2026-0494",
    date: "2026-10-18",
    studentName: "Meta Ads Manager",
    type: "MARKETING_META",
    amountBdt: 25000,
    paymentMethod: "BANK_TRANSFER",
    referenceOrTrx: "CARD-FB-ADS",
    branch: "DHK-HQ",
    verifiedBy: "শেখ বাসেত",
    notes: "অক্টোবর সেশন স্টুডেন্ট ভিসা ও SSW ফেসবুক ক্যাম্পেইন বাজেট",
  },
];

const DEFAULT_INVESTOR_PROJECT: InvestorProject = {
  totalCapitalBdt: 1000000,
  budgetAllocation: {
    coachingSetup: 300000,     // 30%
    marketingAndAds: 200000,   // 20%
    operationalRunway: 300000, // 30%
    safetyReserve: 200000,     // 20%
  },
  securityGuarantees: {
    stampAgreementBdt: 300,
    bankChequeIssued: true,
    chequeNumber: "IBBL-CHQ-9948201",
    investorName: "প্রাইভেট ইনভেস্টর সিন্ডিকেট (১০ লক্ষ টাকা পার্টনারশিপ)",
    tenureMonths: 12,
    profitSharePercentage: 10,
  },
  projections: {
    scenarios: {
      conservative: { visas: 20, grossProfit: 2400000, investorShare: 240000 },
      realistic: { visas: 30, grossProfit: 3600000, investorShare: 360000 },
      optimistic: { visas: 40, grossProfit: 4800000, investorShare: 480000 },
    },
    liveCalculatedVisas: 28,
    liveGrossRevenue: 4360000,
    liveNetProfit: 3360000,
    liveInvestorDividend: 336000,
  },
};

const DEFAULT_STAFF_LIST: StaffMember[] = [
  {
    id: "stf-01",
    name: "শেখ বাসেত",
    role: "COUNSELOR",
    location: "DHAKA_OFFICE",
    phone: "+880 1805 013633",
    email: "baset@knltc.com",
    monthlyBaseSalaryBdt: 0, // Managing Director
    callsTargetMonthly: 100,
    callsCompleted: 120,
    admissionsTarget: 25,
    admissionsAchieved: 28,
    performanceBonusBdt: 0,
    status: "ACTIVE",
  },
  {
    id: "stf-02",
    name: "আমির হোসেন (সিনিয়র সেন্সি)",
    role: "SENIOR_SENSEI",
    location: "DHAKA_OFFICE",
    phone: "+880 1711 445566",
    email: "amir@knltc.com",
    monthlyBaseSalaryBdt: 50000,
    callsTargetMonthly: 40,
    callsCompleted: 45,
    admissionsTarget: 15,
    admissionsAchieved: 18,
    performanceBonusBdt: 12000,
    status: "ACTIVE",
  },
  {
    id: "stf-03",
    name: "সুমাইয়া সুলতানা",
    role: "TELE_COUNSELOR",
    location: "REMOTE",
    phone: "+880 1899 112233",
    email: "sumaiya.counselor@knltc.com",
    monthlyBaseSalaryBdt: 18000,
    callsTargetMonthly: 600,
    callsCompleted: 640,
    admissionsTarget: 12,
    admissionsAchieved: 14,
    performanceBonusBdt: 14000, // প্রতি কনফার্ম ভর্তিতে ১,০০০ টাকা
    status: "ACTIVE",
  },
  {
    id: "stf-04",
    name: "রোকসানা আক্তার",
    role: "TELE_COUNSELOR",
    location: "REMOTE",
    phone: "+880 1899 445566",
    email: "roksana.counselor@knltc.com",
    monthlyBaseSalaryBdt: 18000,
    callsTargetMonthly: 600,
    callsCompleted: 580,
    admissionsTarget: 12,
    admissionsAchieved: 11,
    performanceBonusBdt: 11000,
    status: "ACTIVE",
  },
  {
    id: "stf-05",
    name: "খুলনা শাখা ব্যবস্থাপক",
    role: "BRANCH_MANAGER",
    location: "KHULNA_OFFICE",
    phone: "+880 1712 998877",
    email: "khulna@knltc.com",
    monthlyBaseSalaryBdt: 35000,
    callsTargetMonthly: 250,
    callsCompleted: 260,
    admissionsTarget: 15,
    admissionsAchieved: 16,
    performanceBonusBdt: 10000,
    status: "ACTIVE",
  },
];

// ------------------------------------------------------------------------------
// GLOBAL SINGLETON & STORAGE SYNCHRONIZATION
// ------------------------------------------------------------------------------
const STORAGE_KEY = "knltc_master_cms_v2";

const globalForStore = globalThis as unknown as {
  __knltc_master_store?: MasterKnlTcStore;
};

function getFreshDefaultStore(): MasterKnlTcStore {
  return {
    crmLeads: JSON.parse(JSON.stringify(DEFAULT_CRM_LEADS)),
    visaApplicants: JSON.parse(JSON.stringify(DEFAULT_VISA_APPLICANTS)),
    lmsBridges: JSON.parse(JSON.stringify(DEFAULT_LMS_BRIDGES)),
    partnerSchools: JSON.parse(JSON.stringify(DEFAULT_PARTNER_SCHOOLS)),
    b2bAgents: JSON.parse(JSON.stringify(DEFAULT_B2B_AGENTS)),
    transactions: JSON.parse(JSON.stringify(DEFAULT_TRANSACTIONS)),
    investorProject: JSON.parse(JSON.stringify(DEFAULT_INVESTOR_PROJECT)),
    staffList: JSON.parse(JSON.stringify(DEFAULT_STAFF_LIST)),
    websiteCms: [JSON.parse(JSON.stringify(DEFAULT_WEBSITE_CMS))],
  };
}

export function getCmsStore(): MasterKnlTcStore {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore JSON parse error in browser
    }
  }

  if (!globalForStore.__knltc_master_store) {
    globalForStore.__knltc_master_store = getFreshDefaultStore();
  }
  return globalForStore.__knltc_master_store;
}

export function saveCmsStore(updated: MasterKnlTcStore) {
  globalForStore.__knltc_master_store = updated;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("knltc-cms-updated", { detail: updated }));
    } catch (e) {
      console.warn("Could not save to localStorage:", e);
    }
  }
}

async function syncToServer(type: "UPSERT" | "INSERT" | "CMS_UPDATE", entity?: string, payload?: any) {
  if (typeof window === "undefined") return;
  try {
    await fetch("/api/cms/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, entity, payload }),
    });
  } catch (err) {
    console.warn("[KNLTC-CMS] Sync to server failed:", err);
  }
}

export async function fetchLiveStoreFromServer(): Promise<MasterKnlTcStore | null> {
  if (typeof window === "undefined") return null;
  try {
    const res = await fetch("/api/cms/sync", { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json.ok || !json.data) return null;

    const data = json.data;
    const store = getCmsStore();
    let hasChanges = false;

    if (Array.isArray(data.crmLeads) && data.crmLeads.length > 0) {
      store.crmLeads = data.crmLeads.map((l: any) => ({
        id: l.id,
        name: l.name,
        phone: l.phone,
        whatsapp: l.whatsapp || l.phone,
        email: l.email,
        city: l.city || "Dhaka",
        source: l.source || "FACEBOOK_META",
        interest: l.interest || "STUDENT_VISA_REGULAR",
        status: l.status || "NEW",
        education: l.education || "HSC",
        japaneseProficiency: l.japanese_proficiency || "NONE",
        studyGapYears: Number(l.study_gap_years) || 0,
        assignedTo: l.assigned_to || "নাসরিন সুলতানা",
        branch: l.branch || "DHK-HQ",
        notes: l.notes || "",
        followUpDate: l.follow_up_date || new Date().toISOString().split("T")[0],
        lastContactedAt: l.last_contacted_at || l.created_at || new Date().toISOString(),
        createdAt: l.created_at || new Date().toISOString(),
      }));
      hasChanges = true;
    }

    if (Array.isArray(data.visaApplicants) && data.visaApplicants.length > 0) {
      store.visaApplicants = data.visaApplicants.map((v: any) => ({
        id: v.id,
        trackingNo: v.tracking_no,
        name: v.name,
        phone: v.phone,
        branch: v.branch || "DHK-HQ",
        packageType: v.package_type || "REGULAR",
        intakeSession: v.intake_session || "OCTOBER_2027",
        stage: Number(v.stage) || 1,
        targetSchool: v.target_school,
        sponsorName: v.sponsor_name,
        sponsorRelation: v.sponsor_relation || "FATHER",
        sponsorBank: v.sponsor_bank,
        sponsorBalanceBdt: Number(v.sponsor_balance_bdt) || 0,
        bankLoanAssistance: Boolean(v.bank_loan_assistance),
        bankLoanBank: v.bank_loan_bank,
        coEStatus: v.coe_status || "PENDING",
        visaStatus: v.visa_status || "IN_PROCESS",
        counselorName: v.counselor_name || "শেখ বাসেত",
        updatedAt: v.updated_at || new Date().toISOString(),
      }));
      hasChanges = true;
    }

    if (Array.isArray(data.transactions) && data.transactions.length > 0) {
      store.transactions = data.transactions.map((tx: any) => ({
        id: tx.id,
        receiptNo: tx.receipt_no,
        date: tx.date || new Date().toISOString().split("T")[0],
        studentName: tx.student_name,
        type: tx.type,
        amountBdt: Number(tx.amount_bdt) || 0,
        paymentMethod: tx.payment_method || "BKASH",
        referenceOrTrx: tx.reference_or_trx || "N/A",
        branch: tx.branch || "DHK-HQ",
        verifiedBy: tx.verified_by || "শেখ বাসেত",
        notes: tx.notes,
      }));
      hasChanges = true;
    }

    if (Array.isArray(data.websiteCms) && data.websiteCms.length > 0) {
      store.websiteCms = data.websiteCms;
      hasChanges = true;
    }

    if (hasChanges) {
      saveCmsStore(store);
    }
    return store;
  } catch (err) {
    console.warn("[KNLTC-CMS] Failed to fetch live server store:", err);
    return null;
  }
}

export function getWebsiteCms(): WebsiteCmsContent {
  const store = getCmsStore();
  return store.websiteCms?.[0] || DEFAULT_WEBSITE_CMS;
}

export function updateWebsiteCms(partial: Partial<WebsiteCmsContent>) {
  const store = getCmsStore();
  const current = store.websiteCms?.[0] || DEFAULT_WEBSITE_CMS;
  const merged: WebsiteCmsContent = {
    ...current,
    ...partial,
  };
  store.websiteCms = [merged];
  saveCmsStore(store);
  syncToServer("CMS_UPDATE", undefined, merged);
  return merged;
}

export function addCrmLead(lead: Omit<CrmLead, "id" | "createdAt" | "lastContactedAt">): CrmLead {
  const store = getCmsStore();
  const newLead: CrmLead = {
    ...lead,
    id: `lead-${Date.now()}`,
    createdAt: new Date().toISOString(),
    lastContactedAt: new Date().toISOString(),
  };
  store.crmLeads.unshift(newLead);
  saveCmsStore(store);

  syncToServer("INSERT", "knltc_crm_leads", {
    id: newLead.id,
    name: newLead.name,
    phone: newLead.phone,
    whatsapp: newLead.whatsapp,
    email: newLead.email,
    city: newLead.city,
    source: newLead.source,
    interest: newLead.interest,
    status: newLead.status,
    education: newLead.education,
    japanese_proficiency: newLead.japaneseProficiency,
    study_gap_years: newLead.studyGapYears,
    assigned_to: newLead.assignedTo,
    branch: newLead.branch,
    notes: newLead.notes,
    follow_up_date: newLead.followUpDate,
  });

  return newLead;
}

export function updateCrmLeadStatus(id: string, status: LeadStatus, notes?: string): CrmLead | null {
  const store = getCmsStore();
  const index = store.crmLeads.findIndex((l) => l.id === id);
  if (index === -1) return null;
  store.crmLeads[index].status = status;
  store.crmLeads[index].lastContactedAt = new Date().toISOString();
  if (notes) store.crmLeads[index].notes = notes;
  saveCmsStore(store);

  syncToServer("UPSERT", "knltc_crm_leads", {
    id: store.crmLeads[index].id,
    status: status,
    notes: store.crmLeads[index].notes,
    last_contacted_at: store.crmLeads[index].lastContactedAt,
  });

  return store.crmLeads[index];
}

export function updateVisaStage(id: string, nextStage: VisaStage): VisaApplicant | null {
  const store = getCmsStore();
  const index = store.visaApplicants.findIndex((v) => v.id === id);
  if (index === -1) return null;
  store.visaApplicants[index].stage = nextStage;
  store.visaApplicants[index].updatedAt = new Date().toISOString();
  if (nextStage >= 6) {
    store.visaApplicants[index].coEStatus = "APPROVED";
  }
  if (nextStage >= 9) {
    store.visaApplicants[index].visaStatus = "STAMPED";
  }
  if (nextStage === 10) {
    store.visaApplicants[index].visaStatus = "DEPARTED";
  }
  saveCmsStore(store);

  syncToServer("UPSERT", "knltc_visa_applicants", {
    id: store.visaApplicants[index].id,
    stage: nextStage,
    coe_status: store.visaApplicants[index].coEStatus,
    visa_status: store.visaApplicants[index].visaStatus,
    updated_at: store.visaApplicants[index].updatedAt,
  });

  return store.visaApplicants[index];
}

export function addLmsCredentials(data: {
  studentName: string;
  phone: string;
  courseLevel: "N5" | "N4" | "IRODORI";
  enrollmentNo: string;
  portalUsername: string;
  portalPasswordMasked: string;
  activeBatch: string;
}): LmsUserBridge {
  const store = getCmsStore();
  const newBridge: LmsUserBridge = {
    id: `lms-${Date.now()}`,
    ...data,
    portalFeeDeductedBdt: 2000,
    netKnlTcMarginBdt: 10000,
    credentialsSentViaWa: true,
    credentialsSentAt: new Date().toISOString(),
    progressPercentage: 5,
  };
  store.lmsBridges.unshift(newBridge);
  saveCmsStore(store);

  syncToServer("INSERT", "knltc_lms_bridges", {
    id: newBridge.id,
    student_name: newBridge.studentName,
    phone: newBridge.phone,
    course_level: newBridge.courseLevel,
    enrollment_no: newBridge.enrollmentNo,
    portal_username: newBridge.portalUsername,
    portal_password_masked: newBridge.portalPasswordMasked,
    portal_fee_deducted_bdt: newBridge.portalFeeDeductedBdt,
    net_knltc_margin_bdt: newBridge.netKnlTcMarginBdt,
    credentials_sent_via_wa: newBridge.credentialsSentViaWa,
    credentials_sent_at: newBridge.credentialsSentAt,
    progress_percentage: newBridge.progressPercentage,
    active_batch: newBridge.activeBatch,
  });

  return newBridge;
}

export function addFinancialTransaction(tx: Omit<FinancialTransaction, "id">): FinancialTransaction {
  const store = getCmsStore();
  const newTx: FinancialTransaction = {
    ...tx,
    id: `trx-${Date.now()}`,
  };
  store.transactions.unshift(newTx);
  saveCmsStore(store);

  syncToServer("INSERT", "knltc_finance_transactions", {
    id: newTx.id,
    receipt_no: newTx.receiptNo,
    date: newTx.date,
    student_name: newTx.studentName,
    type: newTx.type,
    amount_bdt: newTx.amountBdt,
    payment_method: newTx.paymentMethod,
    reference_or_trx: newTx.referenceOrTrx,
    branch: newTx.branch,
    verified_by: newTx.verifiedBy,
    notes: newTx.notes,
  });

  return newTx;
}

export function updateStoreOrderStatus(orderId: string, status: CustomerStoreOrder["orderStatus"]) {
  const store = getCmsStore();
  const cms = store.websiteCms[0];
  const order = cms.customerOrders.find((o) => o.id === orderId);
  if (order) {
    order.orderStatus = status;
    saveCmsStore(store);
    syncToServer("CMS_UPDATE", undefined, cms);
  }
}

