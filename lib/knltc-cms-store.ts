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

export type DashboardTabId =
  | "my_profile"
  | "overview"
  | "crm"
  | "visa"
  | "lms"
  | "b2b"
  | "finance"
  | "hr"
  | "cms"
  | "store_blog"
  | "users";

export interface SystemUserAccount {
  id: string;
  name: string;
  email: string; // Login Email or User ID
  password: string;
  phone: string;
  role: UserRole;
  branch: BranchCode;
  allowedTabs: DashboardTabId[];
  status: "ACTIVE" | "SUSPENDED";
  linkedLeadId?: string;
  enrollmentType?: "NONE" | "COURSE_ONLY" | "VISA_FILE" | "COURSE_AND_VISA";
  createdAt: string;
}

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
  address?: string;
  passportNo?: string;
  guardianName?: string;
  guardianPhone?: string;
  gpaDetails?: string;
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
  // Individual Profile, File Open / Admission & Login Provisioning
  isFileOpened?: boolean;
  isCourseEnrolled?: boolean;
  enrolledBatchOrSession?: string;
  fileTrackingNo?: string;
  packageType?: "REGULAR" | "PREMIUM";
  targetSchool?: string;
  hasLoginAccess?: boolean;
  loginEmail?: string;
  loginPassword?: string;
  allowedTabs?: DashboardTabId[];
}

// ------------------------------------------------------------------------------
// Visa Pipeline & Kanban Engine (10 Steps)
// ------------------------------------------------------------------------------
export type VisaStage =
  | 1  // ফাইল ওপেনিং (৳০ অগ্রিম)
  | 2  // ভাষা প্রশিক্ষণ (N5/N4)
  | 3  // ডকুমেন্ট সংগ্রহ ও নোটারি/অনুবাদ
  | 4  // জাপানি শিক্ষা প্রতিষ্ঠান জুম ইন্টারভিউ
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
// ------------------------------------------------------------------------------
// Finance & Package Billing
// ------------------------------------------------------------------------------
export type TransactionCategory = "INCOME" | "EXPENSE";

export type TransactionType =
  | "COURSE_FEE"
  | "SERVICE_CHARGE_COE"
  | "PREMIUM_PACKAGE"
  | "REGULAR_SERVICE_CHARGE"
  | "PREMIUM_PACKAGE_ADVANCE"
  | "BOOK_STORE_SALE"
  | "EXPENSE_RENT"
  | "EXPENSE_PAYROLL"
  | "EXPENSE_MARKETING"
  | "EXPENSE_EMBASSY_NOTARY"
  | "EXPENSE_EXAM_FEE"
  | "EXPENSE_B2B_COMMISSION"
  | "EXPENSE_OFFICE"
  | "EXPENSE_MISC";

export interface FinancialTransaction {
  id: string;
  receiptNo: string;
  date: string;
  studentName: string; // or Payee / Vendor name if expense
  category?: TransactionCategory; // INCOME or EXPENSE
  type: TransactionType;
  amountBdt: number;
  paymentMethod: "BKASH" | "NAGAD" | "BANK_TRANSFER" | "CASH_OFFICE" | "AAMARPAY" | "SSLCOMMERZ";
  referenceOrTrx: string;
  branch: "DHK-HQ" | "KHULNA-01";
  verifiedBy: string;
  notes?: string;
  studentPhone?: string;
  dueAmountBdt?: number;
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
// HR & Team Members Workspace (Diverse Roles with Role-Specific KPIs)
// ------------------------------------------------------------------------------
export type StaffRole =
  | "TELE_COUNSELOR"     // Tele-Counselor / Lead Outreach (KPI: Calls & Admissions)
  | "COUNSELOR"          // Senior Admission Counselor (KPI: Admissions & Consultations)
  | "SENIOR_SENSEI"      // Japanese Sensei / Teacher (KPI: Classes Conducted & Batches)
  | "VISA_OFFICER"       // Visa & Documentation Officer (KPI: COE & Visa Files Processed)
  | "BRANCH_MANAGER"     // Branch Manager (Operations)
  | "ACCOUNTANT_ADMIN";  // Accounts & Office Administration

export interface StaffMember {
  id: string;
  name: string;
  role: StaffRole;
  location: "REMOTE" | "DHAKA_OFFICE" | "KHULNA_OFFICE";
  phone: string;
  email: string;
  monthlyBaseSalaryBdt: number;
  kpiType?: "CALLS" | "CLASSES" | "VISA_FILES" | "SALARIED_FIXED";
  kpiTarget?: number;
  kpiAchieved?: number;
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
  systemAccounts?: SystemUserAccount[];
  leadExtendedProfiles?: Record<string, Partial<CrmLead>>;
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
  customerOrders: [],
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

const DEFAULT_CRM_LEADS: CrmLead[] = [];

export const DEFAULT_SYSTEM_ACCOUNTS: SystemUserAccount[] = [
  {
    id: "acc-admin-01",
    name: "শেখ বাসেত (ম্যানেজিং ডিরেক্টর / Main Admin)",
    email: "baset@knltc.com",
    password: "admin123",
    phone: "+880 1805 013633",
    role: "MAIN_ADMIN",
    branch: "ALL",
    allowedTabs: ["overview", "crm", "visa", "lms", "b2b", "finance", "hr", "cms", "store_blog", "users"],
    status: "ACTIVE",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
];

const DEFAULT_VISA_APPLICANTS: VisaApplicant[] = [];

const DEFAULT_LMS_BRIDGES: LmsUserBridge[] = [];

const DEFAULT_PARTNER_SCHOOLS: JapanesePartnerSchool[] = [];

const DEFAULT_B2B_AGENTS: B2bAgent[] = [];

const DEFAULT_TRANSACTIONS: FinancialTransaction[] = [];

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
    liveCalculatedVisas: 0,
    liveGrossRevenue: 0,
    liveNetProfit: 0,
    liveInvestorDividend: 0,
  },
};

const DEFAULT_STAFF_LIST: StaffMember[] = [];

// ------------------------------------------------------------------------------
// GLOBAL SINGLETON & STORAGE SYNCHRONIZATION
// ------------------------------------------------------------------------------
const STORAGE_KEY = "knltc_master_cms_v4_prod";

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

async function syncToServer(type: "UPSERT" | "INSERT" | "DELETE" | "CMS_UPDATE", entity?: string, payload?: any) {
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

    if (Array.isArray(data.crmLeads)) {
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
        assignedTo: l.assigned_to || "শেখ বাসেত",
        branch: l.branch || "DHK-HQ",
        notes: l.notes || "",
        followUpDate: l.follow_up_date || new Date().toISOString().split("T")[0],
        lastContactedAt: l.last_contacted_at || l.created_at || new Date().toISOString(),
        createdAt: l.created_at || new Date().toISOString(),
      }));
      hasChanges = true;
    }

    if (Array.isArray(data.visaApplicants)) {
      store.visaApplicants = data.visaApplicants.map((v: any) => ({
        id: v.id,
        trackingNo: v.tracking_no,
        name: v.name,
        phone: v.phone,
        branch: v.branch || "DHK-HQ",
        packageType: v.package_type || "REGULAR",
        intakeSession: v.intake_session || "APRIL_2027",
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

    if (Array.isArray(data.lmsBridges)) {
      store.lmsBridges = data.lmsBridges.map((b: any) => ({
        id: b.id,
        studentName: b.student_name,
        phone: b.phone,
        courseLevel: b.course_level || "N5",
        enrollmentNo: b.enrollment_no,
        portalUsername: b.portal_username,
        portalPasswordMasked: b.portal_password_masked,
        portalFeeDeductedBdt: Number(b.portal_fee_deducted_bdt) || 2000,
        netKnlTcMarginBdt: Number(b.net_knltc_margin_bdt) || 10000,
        credentialsSentViaWa: Boolean(b.credentials_sent_via_wa),
        credentialsSentAt: b.credentials_sent_at || new Date().toISOString(),
        progressPercentage: Number(b.progress_percentage) || 0,
        activeBatch: b.active_batch || "",
      }));
      hasChanges = true;
    }

    if (Array.isArray(data.partnerSchools)) {
      store.partnerSchools = data.partnerSchools.map((s: any) => ({
        id: s.id,
        name: s.name,
        japaneseName: s.japanese_name || "",
        location: s.location || "",
        contactPerson: s.contact_person || "",
        email: s.email || "",
        commissionPerStudentYen: Number(s.commission_per_student_yen) || 80000,
        commissionPerStudentBdt: Number(s.commission_per_student_bdt) || 64000,
        activeStudentsCount: Number(s.active_students_count) || 0,
        totalCommissionReceivedYen: Number(s.total_commission_received_yen) || 0,
        status: s.status || "ACTIVE_PARTNER",
      }));
      hasChanges = true;
    }

    if (Array.isArray(data.b2bAgents)) {
      store.b2bAgents = data.b2bAgents.map((a: any) => ({
        id: a.id,
        organizationName: a.organization_name,
        agentType: a.agent_type || "INSTITUTIONAL",
        contactPerson: a.contact_person,
        phone: a.phone,
        city: a.city || "",
        referredStudentsCount: Number(a.referred_students_count) || 0,
        successfulVisasCount: Number(a.successful_visas_count) || 0,
        agreedCommissionBdt: Number(a.agreed_commission_bdt) || 30000,
        pendingCommissionBdt: Number(a.pending_commission_bdt) || 0,
        paidCommissionBdt: Number(a.paid_commission_bdt) || 0,
      }));
      hasChanges = true;
    }

    if (Array.isArray(data.staffList)) {
      store.staffList = data.staffList.map((st: any) => ({
        id: st.id,
        name: st.name,
        role: st.role || "COUNSELOR",
        location: st.location || "DHAKA_OFFICE",
        phone: st.phone || "",
        email: st.email || "",
        monthlyBaseSalaryBdt: Number(st.monthly_base_salary_bdt) || 0,
        callsTargetMonthly: Number(st.calls_target_monthly) || 0,
        callsCompleted: Number(st.calls_completed) || 0,
        admissionsTarget: Number(st.admissions_target) || 0,
        admissionsAchieved: Number(st.admissions_achieved) || 0,
        performanceBonusBdt: Number(st.performance_bonus_bdt) || 0,
        status: st.status || "ACTIVE",
      }));
      hasChanges = true;
    }

    if (Array.isArray(data.transactions)) {
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
      const serverCms = data.websiteCms[0] as WebsiteCmsContent;
      if (!serverCms.systemAccounts || serverCms.systemAccounts.length === 0) {
        serverCms.systemAccounts = JSON.parse(JSON.stringify(DEFAULT_SYSTEM_ACCOUNTS));
      }
      store.websiteCms = [serverCms];

      // Merge extended lead profile fields stored in websiteCms.leadExtendedProfiles
      if (serverCms.leadExtendedProfiles) {
        store.crmLeads = store.crmLeads.map((lead) => {
          const ext = serverCms.leadExtendedProfiles?.[lead.id];
          return ext ? { ...lead, ...ext } : lead;
        });
      }
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
  const cms = store.websiteCms?.[0] || DEFAULT_WEBSITE_CMS;
  if (!cms.systemAccounts || cms.systemAccounts.length === 0) {
    cms.systemAccounts = JSON.parse(JSON.stringify(DEFAULT_SYSTEM_ACCOUNTS));
  }
  return cms;
}

export function getSystemAccounts(): SystemUserAccount[] {
  const cms = getWebsiteCms();
  if (!cms.systemAccounts || cms.systemAccounts.length === 0) {
    cms.systemAccounts = JSON.parse(JSON.stringify(DEFAULT_SYSTEM_ACCOUNTS));
  }
  return cms.systemAccounts;
}

export function upsertSystemAccount(
  accountInput: Omit<SystemUserAccount, "id" | "createdAt"> & { id?: string; createdAt?: string },
): SystemUserAccount {
  const store = getCmsStore();
  const cms = store.websiteCms?.[0] || DEFAULT_WEBSITE_CMS;
  if (!cms.systemAccounts || cms.systemAccounts.length === 0) {
    cms.systemAccounts = JSON.parse(JSON.stringify(DEFAULT_SYSTEM_ACCOUNTS));
  }

  const normalizedEmail = accountInput.email.trim().toLowerCase();
  const existingIdx = cms.systemAccounts.findIndex(
    (a) => (accountInput.id && a.id === accountInput.id) || a.email.toLowerCase() === normalizedEmail,
  );

  let savedAccount: SystemUserAccount;
  if (existingIdx >= 0) {
    savedAccount = {
      ...cms.systemAccounts[existingIdx],
      ...accountInput,
      email: normalizedEmail,
    };
    cms.systemAccounts[existingIdx] = savedAccount;
  } else {
    savedAccount = {
      ...accountInput,
      id: accountInput.id || `acc-${Date.now()}`,
      email: normalizedEmail,
      createdAt: accountInput.createdAt || new Date().toISOString(),
    };
    cms.systemAccounts.unshift(savedAccount);
  }

  store.websiteCms = [cms];
  saveCmsStore(store);
  syncToServer("CMS_UPDATE", undefined, cms);
  return savedAccount;
}

export function deleteSystemAccount(accountId: string) {
  const store = getCmsStore();
  const cms = store.websiteCms?.[0] || DEFAULT_WEBSITE_CMS;
  if (!cms.systemAccounts) return;
  cms.systemAccounts = cms.systemAccounts.filter((a) => a.id !== accountId);
  store.websiteCms = [cms];
  saveCmsStore(store);
  syncToServer("CMS_UPDATE", undefined, cms);
}

export function updateCrmLeadProfile(id: string, updates: Partial<CrmLead>): CrmLead | null {
  const store = getCmsStore();
  const cms = store.websiteCms?.[0] || DEFAULT_WEBSITE_CMS;
  if (!cms.leadExtendedProfiles) {
    cms.leadExtendedProfiles = {};
  }

  const index = store.crmLeads.findIndex((l) => l.id === id);
  if (index === -1) return null;

  const updatedLead: CrmLead = {
    ...store.crmLeads[index],
    ...updates,
    lastContactedAt: new Date().toISOString(),
  };
  store.crmLeads[index] = updatedLead;
  cms.leadExtendedProfiles[id] = {
    ...(cms.leadExtendedProfiles[id] || {}),
    ...updates,
  };
  store.websiteCms = [cms];
  saveCmsStore(store);

  syncToServer("UPSERT", "knltc_crm_leads", {
    id: updatedLead.id,
    name: updatedLead.name,
    phone: updatedLead.phone,
    whatsapp: updatedLead.whatsapp,
    email: updatedLead.email,
    city: updatedLead.city,
    source: updatedLead.source,
    interest: updatedLead.interest,
    status: updatedLead.status,
    education: updatedLead.education,
    japanese_proficiency: updatedLead.japaneseProficiency,
    study_gap_years: updatedLead.studyGapYears,
    assigned_to: updatedLead.assignedTo,
    branch: updatedLead.branch,
    notes: updatedLead.notes,
    follow_up_date: updatedLead.followUpDate,
    last_contacted_at: updatedLead.lastContactedAt,
  });
  syncToServer("CMS_UPDATE", undefined, cms);

  return updatedLead;
}

export function provisionLeadLoginAndEnrollment(
  leadBase: {
    id: string;
    name: string;
    phone: string;
    whatsapp?: string;
    email?: string;
    city?: string;
    education?: string;
    interest?: ServiceInterest;
    branch?: "DHK-HQ" | "KHULNA-01";
    notes?: string;
  },
  config: {
    loginEmail: string;
    loginPassword: string;
    role: UserRole;
    allowedTabs: DashboardTabId[];
    isFileOpened: boolean;
    isCourseEnrolled: boolean;
    enrolledBatchOrSession: string;
    packageType?: "REGULAR" | "PREMIUM";
    targetSchool?: string;
    courseLevel?: "N5" | "N4" | "IRODORI";
    accountStatus?: "ACTIVE" | "SUSPENDED";
    address?: string;
    passportNo?: string;
    guardianName?: string;
    guardianPhone?: string;
    gpaDetails?: string;
  },
): { lead: CrmLead; account: SystemUserAccount } {
  const store = getCmsStore();
  const cms = store.websiteCms?.[0] || DEFAULT_WEBSITE_CMS;
  if (!cms.leadExtendedProfiles) cms.leadExtendedProfiles = {};

  let existingLead = store.crmLeads.find((l) => l.id === leadBase.id);
  const trackingNo =
    existingLead?.fileTrackingNo || `KNLTC-VISA-2027-${Math.floor(10 + Math.random() * 89)}`;

  const profileUpdates: Partial<CrmLead> = {
    name: leadBase.name,
    phone: leadBase.phone,
    email: config.loginEmail,
    address: config.address ?? existingLead?.address,
    passportNo: config.passportNo ?? existingLead?.passportNo,
    guardianName: config.guardianName ?? existingLead?.guardianName,
    guardianPhone: config.guardianPhone ?? existingLead?.guardianPhone,
    gpaDetails: config.gpaDetails ?? existingLead?.gpaDetails,
    status: config.isFileOpened || config.isCourseEnrolled ? "ADMITTED" : existingLead?.status || "COUNSELED",
    isFileOpened: config.isFileOpened,
    isCourseEnrolled: config.isCourseEnrolled,
    enrolledBatchOrSession: config.enrolledBatchOrSession,
    fileTrackingNo: config.isFileOpened ? trackingNo : existingLead?.fileTrackingNo,
    packageType: config.packageType || existingLead?.packageType || "REGULAR",
    targetSchool: config.targetSchool || existingLead?.targetSchool || "HLA Gakuin (Hiroshima)",
    hasLoginAccess: true,
    loginEmail: config.loginEmail.trim().toLowerCase(),
    loginPassword: config.loginPassword.trim(),
    allowedTabs: config.allowedTabs,
  };

  if (!existingLead) {
    existingLead = {
      id: leadBase.id,
      name: leadBase.name,
      phone: leadBase.phone,
      whatsapp: leadBase.whatsapp || leadBase.phone,
      email: config.loginEmail.trim().toLowerCase(),
      city: leadBase.city || "ঢাকা",
      source: "WEBSITE_FORM",
      interest: leadBase.interest || "STUDENT_VISA_REGULAR",
      status: "ADMITTED",
      education: leadBase.education || "HSC / Equivalent",
      japaneseProficiency: "LEARNING_N5",
      studyGapYears: 1,
      assignedTo: "শেখ বাসেত (ম্যানেজিং ডিরেক্টর)",
      branch: leadBase.branch || "DHK-HQ",
      notes: leadBase.notes || "ভর্তি ও লগইন অ্যাক্সেস প্রদান করা হয়েছে।",
      followUpDate: new Date().toISOString().slice(0, 10),
      lastContactedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      ...profileUpdates,
    };
    store.crmLeads.unshift(existingLead);
  } else {
    Object.assign(existingLead, profileUpdates);
  }

  cms.leadExtendedProfiles[existingLead.id] = {
    ...(cms.leadExtendedProfiles[existingLead.id] || {}),
    ...profileUpdates,
  };

  // If Visa File is opened, ensure a VisaApplicant card exists in pipeline
  if (config.isFileOpened) {
    const hasVisaCard = store.visaApplicants.some(
      (v) => v.phone === existingLead!.phone || v.trackingNo === trackingNo,
    );
    if (!hasVisaCard) {
      const newVisa: VisaApplicant = {
        id: `visa-${Date.now()}`,
        trackingNo,
        name: existingLead.name,
        phone: existingLead.phone,
        branch: existingLead.branch,
        packageType: config.packageType || "REGULAR",
        intakeSession: "APRIL_2027",
        stage: 1,
        targetSchool: config.targetSchool || "HLA Gakuin (Hiroshima)",
        sponsorName: config.guardianName || "অভিভাবক (যাচাইকৃত)",
        sponsorRelation: "FATHER",
        sponsorBank: "অগ্রণী ব্যাংক লি.",
        sponsorBalanceBdt: 1850000,
        bankLoanAssistance: false,
        coEStatus: "PENDING",
        visaStatus: "IN_PROCESS",
        counselorName: existingLead.assignedTo,
        updatedAt: new Date().toISOString(),
      };
      store.visaApplicants.unshift(newVisa);
    }
  }

  // If Language Course is enrolled, ensure LMS bridge record exists
  if (config.isCourseEnrolled) {
    const hasLms = store.lmsBridges.some((l) => l.phone === existingLead!.phone);
    if (!hasLms) {
      store.lmsBridges.unshift({
        id: `lms-${Date.now()}`,
        studentName: existingLead.name,
        phone: existingLead.phone,
        courseLevel: config.courseLevel || "N5",
        enrollmentNo: `KNLTC-2026-${config.courseLevel || "N5"}-${Math.floor(100 + Math.random() * 899)}`,
        portalUsername: config.loginEmail.trim().toLowerCase(),
        portalPasswordMasked: config.loginPassword.trim(),
        portalFeeDeductedBdt: 2000,
        netKnlTcMarginBdt: 10000,
        credentialsSentViaWa: true,
        credentialsSentAt: new Date().toISOString(),
        progressPercentage: 10,
        activeBatch: config.enrolledBatchOrSession || "N5 Special Batch",
      });
    }
  }

  store.websiteCms = [cms];
  saveCmsStore(store);

  const account = upsertSystemAccount({
    name: existingLead.name,
    email: config.loginEmail.trim().toLowerCase(),
    password: config.loginPassword.trim(),
    phone: existingLead.phone,
    role: config.role,
    branch: existingLead.branch,
    allowedTabs: config.allowedTabs,
    status: config.accountStatus || "ACTIVE",
    linkedLeadId: existingLead.id,
    enrollmentType:
      config.isFileOpened && config.isCourseEnrolled
        ? "COURSE_AND_VISA"
        : config.isFileOpened
          ? "VISA_FILE"
          : config.isCourseEnrolled
            ? "COURSE_ONLY"
            : "NONE",
  });

  return { lead: existingLead, account };
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

export function updateFinancialTransaction(
  id: string,
  updates: Partial<FinancialTransaction>,
): FinancialTransaction | null {
  const store = getCmsStore();
  const tx = store.transactions.find((t) => t.id === id);
  if (!tx) return null;
  Object.assign(tx, updates);
  saveCmsStore(store);
  syncToServer("UPSERT", "knltc_finance_transactions", tx);
  return tx;
}

export function deleteFinancialTransaction(id: string) {
  const store = getCmsStore();
  store.transactions = store.transactions.filter((t) => t.id !== id);
  saveCmsStore(store);
  syncToServer("DELETE", "knltc_finance_transactions", { id });
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

// ------------------------------------------------------------------------------
// B2B Partner Schools & B2B Sub-Agents CRUD
// ------------------------------------------------------------------------------
export function addPartnerSchool(school: Omit<JapanesePartnerSchool, "id">): JapanesePartnerSchool {
  const store = getCmsStore();
  const newSchool: JapanesePartnerSchool = {
    ...school,
    id: `sch-${Date.now()}`,
  };
  store.partnerSchools.unshift(newSchool);
  saveCmsStore(store);

  syncToServer("INSERT", "knltc_partner_schools", {
    id: newSchool.id,
    name: newSchool.name,
    japanese_name: newSchool.japaneseName,
    location: newSchool.location,
    contact_person: newSchool.contactPerson,
    email: newSchool.email,
    commission_per_student_yen: newSchool.commissionPerStudentYen,
    commission_per_student_bdt: newSchool.commissionPerStudentBdt,
    active_students_count: newSchool.activeStudentsCount,
    total_commission_received_yen: newSchool.totalCommissionReceivedYen,
    status: newSchool.status,
  });

  return newSchool;
}

export function updatePartnerSchool(id: string, updates: Partial<JapanesePartnerSchool>): JapanesePartnerSchool | null {
  const store = getCmsStore();
  const idx = store.partnerSchools.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  store.partnerSchools[idx] = { ...store.partnerSchools[idx], ...updates };
  const s = store.partnerSchools[idx];
  saveCmsStore(store);

  syncToServer("UPSERT", "knltc_partner_schools", {
    id: s.id,
    name: s.name,
    japanese_name: s.japaneseName,
    location: s.location,
    contact_person: s.contactPerson,
    email: s.email,
    commission_per_student_yen: s.commissionPerStudentYen,
    commission_per_student_bdt: s.commissionPerStudentBdt,
    active_students_count: s.activeStudentsCount,
    total_commission_received_yen: s.totalCommissionReceivedYen,
    status: s.status,
  });

  return s;
}

export function deletePartnerSchool(id: string) {
  const store = getCmsStore();
  store.partnerSchools = store.partnerSchools.filter((s) => s.id !== id);
  saveCmsStore(store);
  syncToServer("DELETE", "knltc_partner_schools", { id });
}

export function addB2bAgent(agent: Omit<B2bAgent, "id">): B2bAgent {
  const store = getCmsStore();
  const newAgent: B2bAgent = {
    ...agent,
    id: `agent-${Date.now()}`,
  };
  store.b2bAgents.unshift(newAgent);
  saveCmsStore(store);

  syncToServer("INSERT", "knltc_b2b_agents", {
    id: newAgent.id,
    organization_name: newAgent.organizationName,
    agent_type: newAgent.agentType,
    contact_person: newAgent.contactPerson,
    phone: newAgent.phone,
    city: newAgent.city,
    referred_students_count: newAgent.referredStudentsCount,
    successful_visas_count: newAgent.successfulVisasCount,
    agreed_commission_bdt: newAgent.agreedCommissionBdt,
    pending_commission_bdt: newAgent.pendingCommissionBdt,
    paid_commission_bdt: newAgent.paidCommissionBdt,
  });

  return newAgent;
}

export function updateB2bAgent(id: string, updates: Partial<B2bAgent>): B2bAgent | null {
  const store = getCmsStore();
  const idx = store.b2bAgents.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  store.b2bAgents[idx] = { ...store.b2bAgents[idx], ...updates };
  const a = store.b2bAgents[idx];
  saveCmsStore(store);

  syncToServer("UPSERT", "knltc_b2b_agents", {
    id: a.id,
    organization_name: a.organizationName,
    agent_type: a.agentType,
    contact_person: a.contactPerson,
    phone: a.phone,
    city: a.city,
    referred_students_count: a.referredStudentsCount,
    successful_visas_count: a.successfulVisasCount,
    agreed_commission_bdt: a.agreedCommissionBdt,
    pending_commission_bdt: a.pendingCommissionBdt,
    paid_commission_bdt: a.paidCommissionBdt,
  });

  return a;
}

export function deleteB2bAgent(id: string) {
  const store = getCmsStore();
  store.b2bAgents = store.b2bAgents.filter((a) => a.id !== id);
  saveCmsStore(store);
  syncToServer("DELETE", "knltc_b2b_agents", { id });
}

// ------------------------------------------------------------------------------
// HR & Team Member Payroll CRUD
// ------------------------------------------------------------------------------
export function addStaffMember(staff: Omit<StaffMember, "id">): StaffMember {
  const store = getCmsStore();
  const newStaff: StaffMember = {
    ...staff,
    id: `stf-${Date.now()}`,
  };
  store.staffList.unshift(newStaff);
  saveCmsStore(store);

  syncToServer("INSERT", "knltc_staff_members", {
    id: newStaff.id,
    name: newStaff.name,
    role: newStaff.role,
    location: newStaff.location,
    phone: newStaff.phone,
    email: newStaff.email,
    monthly_base_salary_bdt: newStaff.monthlyBaseSalaryBdt,
    calls_target_monthly: newStaff.callsTargetMonthly,
    calls_completed: newStaff.callsCompleted,
    admissions_target: newStaff.admissionsTarget,
    admissions_achieved: newStaff.admissionsAchieved,
    performance_bonus_bdt: newStaff.performanceBonusBdt,
    status: newStaff.status,
  });

  return newStaff;
}

export function updateStaffMember(id: string, updates: Partial<StaffMember>): StaffMember | null {
  const store = getCmsStore();
  const idx = store.staffList.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  store.staffList[idx] = { ...store.staffList[idx], ...updates };
  const s = store.staffList[idx];
  saveCmsStore(store);

  syncToServer("UPSERT", "knltc_staff_members", {
    id: s.id,
    name: s.name,
    role: s.role,
    location: s.location,
    phone: s.phone,
    email: s.email,
    monthly_base_salary_bdt: s.monthlyBaseSalaryBdt,
    calls_target_monthly: s.callsTargetMonthly,
    calls_completed: s.callsCompleted,
    admissions_target: s.admissionsTarget,
    admissions_achieved: s.admissionsAchieved,
    performance_bonus_bdt: s.performanceBonusBdt,
    status: s.status,
  });

  return s;
}

export function deleteStaffMember(id: string) {
  const store = getCmsStore();
  store.staffList = store.staffList.filter((s) => s.id !== id);
  saveCmsStore(store);
  syncToServer("DELETE", "knltc_staff_members", { id });
}


