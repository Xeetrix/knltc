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
export type LeadSource =
  | "FACEBOOK_META"
  | "WHATSAPP_DIRECT"
  | "WEBSITE_FORM"
  | "OFFICE_WALKIN"
  | "B2B_REFERRAL"
  | "SUB_AGENT"
  | "GOOGLE_SHEET";
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

export type LeadPriority = "HOT" | "WARM" | "COLD";

export type LeadCallOutcome =
  | "INTERESTED"
  | "CALL_LATER"
  | "NO_ANSWER"
  | "BUSY"
  | "WRONG_NUMBER"
  | "GUARDIAN_DISCUSSION"
  | "OFFICE_VISIT_CONFIRMED";

export interface LeadDocumentItem {
  id: string;
  titleBn: string;
  titleEn: string;
  category: "IDENTITY" | "ACADEMIC" | "LANGUAGE" | "SPONSOR_FINANCIAL";
  status: "MISSING" | "SUBMITTED" | "VERIFIED";
  fileUrl?: string;
  fileName?: string;
  updatedAt?: string;
}

export interface LeadActivityItem {
  id: string;
  type:
    | "CALL"
    | "VISIT"
    | "MEETING_NOTE"
    | "WHATSAPP"
    | "DOC_UPDATE"
    | "PAYMENT"
    | "STAGE_CHANGE";
  summary: string;
  counselorName: string;
  createdAt: string;
}

export interface CrmLead {
  id: string;
  name: string;
  phone: string;
  whatsapp: string;
  email?: string;
  city: string;
  address?: string;
  avatarUrl?: string;
  dateOfBirth?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  maritalStatus?: "SINGLE" | "MARRIED";
  nidOrBirthRegNo?: string;
  passportNo?: string;
  passportExpiryDate?: string;
  guardianName?: string;
  guardianPhone?: string;
  gpaDetails?: string;
  source: LeadSource;
  interest: ServiceInterest;
  status: LeadStatus;
  priority?: LeadPriority;
  callOutcome?: LeadCallOutcome;
  customTags?: string[];
  preferredIntake?: "JANUARY" | "APRIL" | "JULY" | "OCTOBER";
  preferredJapanCity?: string;
  education: string;
  sscGpa?: string;
  hscGpa?: string;
  honorsOrDiplomaCgpa?: string;
  graduationYear?: string;
  japaneseProficiency: "NONE" | "LEARNING_N5" | "PASSED_N5" | "PASSED_N4" | "NAT_JFT";
  japaneseExamType?: "NONE" | "JLPT_N5" | "JLPT_N4" | "NAT_5Q" | "NAT_4Q" | "JFT_BASIC";
  japaneseExamScore?: string;
  japaneseExamStatus?: "NOT_REGISTERED" | "REGISTERED" | "PASSED";
  studyGapYears: number;
  assignedTo: string;
  branch: "DHK-HQ" | "KHULNA-01";
  notes: string;
  followUpDate: string;
  lastContactedAt: string;
  createdAt: string;
  importedFromSheetAt?: string;
  // Individual Profile, File Open / Admission & Login Provisioning
  isFileOpened?: boolean;
  isCourseEnrolled?: boolean;
  enrolledBatchOrSession?: string;
  fileTrackingNo?: string;
  packageType?: "REGULAR" | "PREMIUM";
  targetSchool?: string;
  targetSchoolName?: string;
  partnerSchoolId?: string;
  targetSchoolId?: string;
  b2bAgentId?: string;
  referredByAgentId?: string;
  b2bAgentName?: string;
  referredByAgentName?: string;
  assignedCounselorId?: string;
  assignedVisaOfficerId?: string;
  assignedVisaOfficerName?: string;
  contractAmountBdt?: number;
  paidAmountBdt?: number;
  dueAmountBdt?: number;
  // Sponsor & Financial Solvency Details
  sponsorRelation?: "FATHER" | "MOTHER" | "BROTHER" | "SISTER" | "SELF";
  sponsorOccupation?: string;
  sponsorMonthlyIncomeBdt?: number;
  sponsorBankName?: string;
  sponsorBankBalanceBdt?: number;
  bankLoanRequired?: boolean;
  preferredLoanBank?: string;
  // Visa & School Interview + LMS Attendance
  schoolInterviewStatus?: "NOT_SCHEDULED" | "SCHEDULED" | "PASSED" | "RE_INTERVIEW";
  schoolInterviewDate?: string;
  attendancePercentage?: number;
  // 12-Item Document Checklist & Activity Timeline
  documentChecklist?: LeadDocumentItem[];
  activityLog?: LeadActivityItem[];
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
  targetSchoolName?: string;
  sponsorName: string;
  sponsorRelation: "FATHER" | "MOTHER" | "BROTHER" | "SISTER";
  sponsorBank: string;
  sponsorBalanceBdt: number;
  bankLoanAssistance: boolean;
  bankLoanBank?: string; // অগ্রণী, সোস্যাল ইসলামী, পূবালী
  coEStatus: "PENDING" | "APPROVED" | "REJECTED";
  visaStatus: "IN_PROCESS" | "STAMPED" | "DEPARTED";
  counselorName: string;
  leadId?: string;
  linkedLeadId?: string;
  partnerSchoolId?: string;
  targetSchoolId?: string;
  b2bAgentId?: string;
  referredByAgentId?: string;
  b2bAgentName?: string;
  referredByAgentName?: string;
  visaOfficerId?: string;
  assignedVisaOfficerId?: string;
  visaOfficerName?: string;
  assignedVisaOfficerName?: string;
  contractAmountBdt?: number;
  paidAmountBdt?: number;
  dueAmountBdt?: number;
  b2bCommissionTriggered?: boolean;
  schoolCommissionClaimed?: boolean;
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
  leadId?: string;
  linkedLeadId?: string;
  assignedSenseiId?: string;
  assignedSenseiName?: string;
}

// ------------------------------------------------------------------------------
// B2B & Japanese School / University Partners (360° Profile System)
// ------------------------------------------------------------------------------
export interface PartnerDocumentItem {
  id: string;
  titleBn: string;
  titleEn: string;
  category:
    | "BROCHURE_PROSPECTUS"
    | "APPLICATION_FORM"
    | "MOU_AGREEMENT"
    | "FEE_STRUCTURE"
    | "ACCREDITATION_LICENSE"
    | "TRADE_LICENSE"
    | "NID_PASSPORT"
    | "TIN_TAX"
    | "OFFICE_IDENTITY";
  status: "MISSING" | "UPLOADED" | "VERIFIED";
  fileUrl?: string;
  fileName?: string;
  uploadedAt?: string;
  notes?: string;
}

export type PartnerInstitutionType =
  | "LANGUAGE_SCHOOL"
  | "UNIVERSITY"
  | "VOCATIONAL_COLLEGE"
  | "SSW_EMPLOYER";

export type IntakeMonth = "JANUARY" | "APRIL" | "JULY" | "OCTOBER";

export interface JapanesePartnerSchool {
  id: string;
  name: string;
  schoolName?: string;
  japaneseName: string;
  institutionType?: PartnerInstitutionType;
  logoUrl?: string;
  websiteUrl?: string;
  phone?: string;
  addressJapan?: string;
  establishedYear?: string;
  location: string;
  city?: string;
  contactPerson: string;
  email: string;
  commissionPerStudentYen: number;
  commissionPerStudentBdt: number;
  firstYearTuitionYen?: number;
  admissionFeeYen?: number;
  hostelFeeMonthlyYen?: number;
  intakeMonths?: IntakeMonth[];
  minGpaRequired?: string;
  maxStudyGapYears?: number;
  minLanguageLevel?: string;
  activeStudentsCount: number;
  intakeQuota?: number; // e.g. 20 seats per intake
  totalCommissionReceivedYen: number;
  status: "ACTIVE_PARTNER" | "IN_REVIEW";
  documents?: PartnerDocumentItem[];
  notes?: string;
}

export interface B2bAgent {
  id: string;
  organizationName: string; // e.g. Nexus Group, BWBS Global, Local Agent
  agencyName?: string;
  agentType: "INSTITUTIONAL" | "LOCAL_SUB_AGENT" | "CAMPUS_AMBASSADOR";
  logoUrl?: string;
  contactPerson: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  city: string;
  officeAddress?: string;
  establishedYear?: string;
  tradeLicenseNo?: string;
  nidOrPassportNo?: string;
  tinCertificateNo?: string;
  paymentDetails?: {
    preferredMethod: "BANK" | "BKASH" | "NAGAD";
    bankName?: string;
    accountName?: string;
    accountNumber?: string;
    branchName?: string;
    mobileWalletNo?: string;
  };
  bankName?: string;
  bankAccountNo?: string;
  bkashOrNagadNo?: string;
  referredStudentsCount: number;
  successfulVisasCount: number;
  agreedCommissionBdt: number;
  pendingCommissionBdt: number;
  paidCommissionBdt: number;
  documents?: PartnerDocumentItem[];
  portalAccountId?: string;
  notes?: string;
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
  | "SCHOOL_COMMISSION_JPY"
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
  linkedLeadId?: string;
  linkedVisaId?: string;
  linkedAgentId?: string;
  linkedStaffId?: string;
  linkedSchoolId?: string;
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
  lastPaidMonth?: string;
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
  schoolExtendedProfiles?: Record<string, Partial<JapanesePartnerSchool>>;
  b2bAgentExtendedProfiles?: Record<string, Partial<B2bAgent>>;
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
export const DEFAULT_WEBSITE_CMS: WebsiteCmsContent = {
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

export function purgeStoreOfDummyData(): MasterKnlTcStore {
  const store = getCmsStore();
  store.crmLeads = [];
  store.visaApplicants = [];
  store.lmsBridges = [];
  store.b2bAgents = [];
  store.transactions = [];
  if (store.websiteCms?.[0]) {
    store.websiteCms[0].customerOrders = [];
  }
  saveCmsStore(store);
  return store;
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
      const existingSchoolsMap = new Map(store.partnerSchools.map((s) => [s.id, s]));
      store.partnerSchools = data.partnerSchools.map((s: any) => {
        const local = existingSchoolsMap.get(s.id);
        const commYen = s.commission_per_student_yen !== undefined && s.commission_per_student_yen !== null
          ? Number(s.commission_per_student_yen)
          : (local?.commissionPerStudentYen ?? 0);
        const commBdt = s.commission_per_student_bdt !== undefined && s.commission_per_student_bdt !== null
          ? Number(s.commission_per_student_bdt)
          : (local?.commissionPerStudentBdt ?? 0);

        return {
          ...local,
          id: s.id,
          name: s.name,
          japaneseName: s.japanese_name || local?.japaneseName || "",
          location: s.location || local?.location || "",
          contactPerson: s.contact_person || local?.contactPerson || "",
          email: s.email || local?.email || "",
          commissionPerStudentYen: isNaN(commYen) ? 0 : commYen,
          commissionPerStudentBdt: isNaN(commBdt) ? 0 : commBdt,
          activeStudentsCount: Number(s.active_students_count) || local?.activeStudentsCount || 0,
          totalCommissionReceivedYen: Number(s.total_commission_received_yen) || local?.totalCommissionReceivedYen || 0,
          status: s.status || local?.status || "ACTIVE_PARTNER",
          logoUrl: s.logo_url || local?.logoUrl,
          institutionType: local?.institutionType || "LANGUAGE_SCHOOL",
          websiteUrl: local?.websiteUrl,
          firstYearTuitionYen: local?.firstYearTuitionYen ?? 760000,
          admissionFeeYen: local?.admissionFeeYen ?? 50000,
          hostelFeeMonthlyYen: local?.hostelFeeMonthlyYen ?? 35000,
          intakeMonths: local?.intakeMonths || ["APRIL", "OCTOBER"],
          intakeQuota: local?.intakeQuota || 20,
          documents: local?.documents || [],
          notes: local?.notes || "",
        };
      });
      hasChanges = true;
    }

    if (Array.isArray(data.b2bAgents)) {
      const existingAgentsMap = new Map(store.b2bAgents.map((a) => [a.id, a]));
      store.b2bAgents = data.b2bAgents.map((a: any) => {
        const local = existingAgentsMap.get(a.id);
        return {
          ...local,
          id: a.id,
          organizationName: a.organization_name,
          agentType: a.agent_type || local?.agentType || "LOCAL_SUB_AGENT",
          contactPerson: a.contact_person,
          phone: a.phone,
          city: a.city || local?.city || "",
          referredStudentsCount: Number(a.referred_students_count) || local?.referredStudentsCount || 0,
          successfulVisasCount: Number(a.successful_visas_count) || local?.successfulVisasCount || 0,
          agreedCommissionBdt: a.agreed_commission_bdt != null ? Number(a.agreed_commission_bdt) : (local?.agreedCommissionBdt ?? 30000),
          pendingCommissionBdt: Number(a.pending_commission_bdt) || local?.pendingCommissionBdt || 0,
          paidCommissionBdt: Number(a.paid_commission_bdt) || local?.paidCommissionBdt || 0,
          logoUrl: a.logo_url || local?.logoUrl,
          tradeLicenseNo: a.trade_license_no || local?.tradeLicenseNo,
          nidOrPassportNo: a.nid_or_passport_no || local?.nidOrPassportNo,
          bankName: a.bank_name || local?.bankName,
          bankAccountNo: a.bank_account_no || local?.bankAccountNo,
          bkashOrNagadNo: a.bkash_or_nagad_no || local?.bkashOrNagadNo,
          documents: local?.documents || [],
          notes: local?.notes || "",
        };
      });
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
      const mergedCms: WebsiteCmsContent = {
        ...JSON.parse(JSON.stringify(DEFAULT_WEBSITE_CMS)),
        ...serverCms,
        topAnnouncementBar: {
          ...DEFAULT_WEBSITE_CMS.topAnnouncementBar,
          ...(serverCms.topAnnouncementBar || {}),
          text: {
            ...DEFAULT_WEBSITE_CMS.topAnnouncementBar.text,
            ...(serverCms.topAnnouncementBar?.text || {}),
          },
        },
        popupBanner: {
          ...DEFAULT_WEBSITE_CMS.popupBanner,
          ...(serverCms.popupBanner || {}),
          headline: {
            ...DEFAULT_WEBSITE_CMS.popupBanner.headline,
            ...(serverCms.popupBanner?.headline || {}),
          },
        },
        heroSection: {
          ...DEFAULT_WEBSITE_CMS.heroSection,
          ...(serverCms.heroSection || {}),
          headline: {
            ...DEFAULT_WEBSITE_CMS.heroSection.headline,
            ...(serverCms.heroSection?.headline || {}),
          },
        },
        languageCoursePage: {
          ...DEFAULT_WEBSITE_CMS.languageCoursePage,
          ...(serverCms.languageCoursePage || {}),
        },
        studyInJapanPage: {
          ...DEFAULT_WEBSITE_CMS.studyInJapanPage,
          ...(serverCms.studyInJapanPage || {}),
        },
        jobCirculars:
          Array.isArray(serverCms.jobCirculars) && serverCms.jobCirculars.length > 0
            ? serverCms.jobCirculars
            : DEFAULT_WEBSITE_CMS.jobCirculars,
        systemAccounts:
          Array.isArray(serverCms.systemAccounts) && serverCms.systemAccounts.length > 0
            ? serverCms.systemAccounts
            : JSON.parse(JSON.stringify(DEFAULT_SYSTEM_ACCOUNTS)),
      };
      store.websiteCms = [mergedCms];

      // Merge extended lead profile fields stored in websiteCms.leadExtendedProfiles
      if (serverCms.leadExtendedProfiles) {
        store.crmLeads = store.crmLeads.map((lead) => {
          const ext = serverCms.leadExtendedProfiles?.[lead.id];
          return ext ? { ...lead, ...ext } : lead;
        });
      }

      // Merge extended partner school profiles (logos, documents, fee structures, quotas)
      if (serverCms.schoolExtendedProfiles) {
        store.partnerSchools = store.partnerSchools.map((sch) => {
          const ext = serverCms.schoolExtendedProfiles?.[sch.id];
          return ext ? { ...sch, ...ext } : sch;
        });
        Object.entries(serverCms.schoolExtendedProfiles).forEach(([schId, ext]) => {
          if (!store.partnerSchools.some((s) => s.id === schId) && ext.name) {
            store.partnerSchools.push(ext as JapanesePartnerSchool);
          }
        });
      }

      // Merge extended B2B agent profiles (logos, trade licenses, MOUs, banking details)
      if (serverCms.b2bAgentExtendedProfiles) {
        store.b2bAgents = store.b2bAgents.map((agent) => {
          const ext = serverCms.b2bAgentExtendedProfiles?.[agent.id];
          return ext ? { ...agent, ...ext } : agent;
        });
        Object.entries(serverCms.b2bAgentExtendedProfiles).forEach(([agentId, ext]) => {
          if (!store.b2bAgents.some((a) => a.id === agentId) && ext.organizationName) {
            store.b2bAgents.push(ext as B2bAgent);
          }
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
    partnerSchoolId?: string;
    b2bAgentId?: string;
    b2bAgentName?: string;
    assignedCounselorId?: string;
    assignedVisaOfficerId?: string;
    assignedVisaOfficerName?: string;
    contractAmountBdt?: number;
    initialPaymentBdt?: number;
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
  const wasAlreadyAdmitted = existingLead?.status === "ADMITTED";
  const trackingNo =
    existingLead?.fileTrackingNo || `KNLTC-VISA-2027-${Math.floor(10 + Math.random() * 89)}`;

  const matchedSchool = store.partnerSchools.find(
    (s) =>
      (config.partnerSchoolId && s.id === config.partnerSchoolId) ||
      (config.targetSchool && s.name.toLowerCase() === config.targetSchool.toLowerCase()),
  );
  const resolvedSchoolName =
    matchedSchool?.name ||
    config.targetSchool ||
    existingLead?.targetSchool ||
    store.partnerSchools[0]?.name ||
    "Unassigned School";

  const matchedAgent = store.b2bAgents.find(
    (a) =>
      (config.b2bAgentId && a.id === config.b2bAgentId) ||
      (config.b2bAgentName && a.organizationName.toLowerCase() === config.b2bAgentName.toLowerCase()),
  );

  const defaultContract =
    config.contractAmountBdt ??
    existingLead?.contractAmountBdt ??
    (config.packageType === "PREMIUM"
      ? 1100000
      : config.isFileOpened
        ? 120000
        : config.isCourseEnrolled
          ? 12000
          : 0);

  const currentPaid =
    (existingLead?.paidAmountBdt || 0) + (config.initialPaymentBdt ? Number(config.initialPaymentBdt) : 0);
  const currentDue = Math.max(0, defaultContract - currentPaid);

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
    targetSchool: resolvedSchoolName,
    partnerSchoolId: matchedSchool?.id || config.partnerSchoolId || existingLead?.partnerSchoolId,
    b2bAgentId: matchedAgent?.id || config.b2bAgentId || existingLead?.b2bAgentId,
    b2bAgentName: matchedAgent?.organizationName || config.b2bAgentName || existingLead?.b2bAgentName,
    assignedCounselorId: config.assignedCounselorId || existingLead?.assignedCounselorId,
    assignedVisaOfficerId: config.assignedVisaOfficerId || existingLead?.assignedVisaOfficerId,
    assignedVisaOfficerName: config.assignedVisaOfficerName || existingLead?.assignedVisaOfficerName,
    contractAmountBdt: defaultContract,
    paidAmountBdt: currentPaid,
    dueAmountBdt: currentDue,
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
      source: matchedAgent ? "B2B_REFERRAL" : "WEBSITE_FORM",
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

  // Auto-increment Counselor KPI if newly admitted
  if (!wasAlreadyAdmitted && existingLead.status === "ADMITTED") {
    const counselor = store.staffList.find(
      (st) =>
        (existingLead?.assignedCounselorId && st.id === existingLead.assignedCounselorId) ||
        st.name.toLowerCase() === (existingLead?.assignedTo || "").toLowerCase(),
    );
    if (counselor) {
      counselor.admissionsAchieved = (counselor.admissionsAchieved || 0) + 1;
      counselor.performanceBonusBdt = (counselor.performanceBonusBdt || 0) + 1000;
    }
    if (matchedAgent) {
      matchedAgent.referredStudentsCount = (matchedAgent.referredStudentsCount || 0) + 1;
    }
  }

  // If Visa File is opened, ensure a VisaApplicant card exists in pipeline and sync school seats
  if (config.isFileOpened) {
    const existingVisa = store.visaApplicants.find(
      (v) => v.leadId === existingLead!.id || v.phone === existingLead!.phone || v.trackingNo === trackingNo,
    );
    if (!existingVisa) {
      const newVisa: VisaApplicant = {
        id: `visa-${Date.now()}`,
        trackingNo,
        name: existingLead.name,
        phone: existingLead.phone,
        branch: existingLead.branch,
        packageType: config.packageType || "REGULAR",
        intakeSession: "APRIL_2027",
        stage: 1,
        targetSchool: resolvedSchoolName,
        partnerSchoolId: matchedSchool?.id || config.partnerSchoolId,
        b2bAgentId: matchedAgent?.id || config.b2bAgentId,
        b2bAgentName: matchedAgent?.organizationName || config.b2bAgentName,
        visaOfficerId: config.assignedVisaOfficerId,
        visaOfficerName: config.assignedVisaOfficerName,
        leadId: existingLead.id,
        contractAmountBdt: defaultContract,
        paidAmountBdt: currentPaid,
        dueAmountBdt: currentDue,
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
      if (matchedSchool) {
        matchedSchool.activeStudentsCount = (matchedSchool.activeStudentsCount || 0) + 1;
      }
    } else {
      Object.assign(existingVisa, {
        name: existingLead.name,
        phone: existingLead.phone,
        packageType: config.packageType || existingVisa.packageType,
        targetSchool: resolvedSchoolName,
        partnerSchoolId: matchedSchool?.id || existingVisa.partnerSchoolId,
        b2bAgentId: matchedAgent?.id || existingVisa.b2bAgentId,
        b2bAgentName: matchedAgent?.organizationName || existingVisa.b2bAgentName,
        visaOfficerId: config.assignedVisaOfficerId || existingVisa.visaOfficerId,
        visaOfficerName: config.assignedVisaOfficerName || existingVisa.visaOfficerName,
        leadId: existingLead.id,
        contractAmountBdt: defaultContract,
        paidAmountBdt: currentPaid,
        dueAmountBdt: currentDue,
        updatedAt: new Date().toISOString(),
      });
    }
  }

  // If Language Course is enrolled, ensure LMS bridge record exists
  if (config.isCourseEnrolled) {
    const hasLms = store.lmsBridges.some((l) => l.phone === existingLead!.phone);
    if (!hasLms) {
      const sensei = store.staffList.find((st) => st.role === "SENIOR_SENSEI");
      store.lmsBridges.unshift({
        id: `lms-${Date.now()}`,
        leadId: existingLead.id,
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
        assignedSenseiId: sensei?.id,
        assignedSenseiName: sensei?.name,
      });
    }
  }

  // If an initial payment was entered during admission, record it in Finance Ledger
  if (config.initialPaymentBdt && Number(config.initialPaymentBdt) > 0) {
    store.transactions.unshift({
      id: `trx-${Date.now()}`,
      receiptNo: `KNLTC-REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().slice(0, 10),
      studentName: existingLead.name,
      studentPhone: existingLead.phone,
      category: "INCOME",
      type: config.isFileOpened
        ? config.packageType === "PREMIUM"
          ? "PREMIUM_PACKAGE"
          : "REGULAR_SERVICE_CHARGE"
        : "COURSE_FEE",
      amountBdt: Number(config.initialPaymentBdt),
      dueAmountBdt: currentDue,
      paymentMethod: "CASH_OFFICE",
      referenceOrTrx: `ADM-${Date.now().toString().slice(-6)}`,
      branch: existingLead.branch,
      verifiedBy: existingLead.assignedTo,
      notes: `Initial admission payment (${config.enrolledBatchOrSession})`,
      linkedLeadId: existingLead.id,
    });
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

  const schoolId = lead.partnerSchoolId || lead.targetSchoolId;
  const schoolLabel = lead.targetSchool || lead.targetSchoolName;
  const agentId = lead.b2bAgentId || lead.referredByAgentId;

  // Resolve Partner School & B2B Agent if linked
  const matchedSchool = store.partnerSchools.find(
    (s) =>
      (schoolId && s.id === schoolId) ||
      (schoolLabel && s.name.toLowerCase() === schoolLabel.toLowerCase()),
  );
  const matchedAgent = store.b2bAgents.find(
    (a) =>
      (agentId && a.id === agentId) ||
      (lead.b2bAgentName && a.organizationName.toLowerCase() === lead.b2bAgentName.toLowerCase()),
  );
  const matchedCounselor = store.staffList.find(
    (st) =>
      (lead.assignedCounselorId && st.id === lead.assignedCounselorId) ||
      (lead.assignedTo && st.name.toLowerCase() === lead.assignedTo.toLowerCase()),
  );

  const defaultContract =
    lead.contractAmountBdt ??
    (lead.interest === "STUDENT_VISA_PREMIUM"
      ? 1100000
      : lead.interest === "JAPANESE_N5" || lead.interest === "JAPANESE_N4"
        ? 12000
        : 120000);

  const paid = lead.paidAmountBdt ?? 0;
  const due = Math.max(0, defaultContract - paid);

  const newLead: CrmLead = {
    ...lead,
    id: `lead-${Date.now()}`,
    partnerSchoolId: matchedSchool?.id || schoolId,
    targetSchoolId: matchedSchool?.id || schoolId,
    targetSchool: matchedSchool?.name || schoolLabel,
    targetSchoolName: matchedSchool?.name || schoolLabel,
    b2bAgentId: matchedAgent?.id || agentId,
    referredByAgentId: matchedAgent?.id || agentId,
    b2bAgentName: matchedAgent?.organizationName || lead.b2bAgentName,
    assignedCounselorId: matchedCounselor?.id || lead.assignedCounselorId,
    assignedTo: matchedCounselor?.name || lead.assignedTo,
    contractAmountBdt: defaultContract,
    paidAmountBdt: paid,
    dueAmountBdt: due,
    createdAt: new Date().toISOString(),
    lastContactedAt: new Date().toISOString(),
  };

  store.crmLeads.unshift(newLead);

  // If referred by a B2B agent, increment their referred count
  if (matchedAgent) {
    matchedAgent.referredStudentsCount = (matchedAgent.referredStudentsCount || 0) + 1;
  }

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

  const lead = store.crmLeads[index];
  const prevStatus = lead.status;
  lead.status = status;
  lead.lastContactedAt = new Date().toISOString();
  if (notes) lead.notes = notes;

  // Auto-sync when status changes to ADMITTED
  if (status === "ADMITTED" && prevStatus !== "ADMITTED") {
    lead.isFileOpened = true;
    const trackingNo =
      lead.fileTrackingNo || `KNLTC-VISA-2027-${Math.floor(10 + Math.random() * 89)}`;
    lead.fileTrackingNo = trackingNo;

    const defaultContract =
      lead.contractAmountBdt ??
      (lead.packageType === "PREMIUM" || lead.interest === "STUDENT_VISA_PREMIUM"
        ? 1100000
        : lead.interest === "JAPANESE_N5" || lead.interest === "JAPANESE_N4"
          ? 12000
          : 120000);
    lead.contractAmountBdt = defaultContract;
    lead.paidAmountBdt = lead.paidAmountBdt ?? 0;
    lead.dueAmountBdt = Math.max(0, defaultContract - lead.paidAmountBdt);

    // 1. Increment assigned Counselor KPI & performance bonus
    const counselor = store.staffList.find(
      (st) =>
        (lead.assignedCounselorId && st.id === lead.assignedCounselorId) ||
        st.name.toLowerCase() === (lead.assignedTo || "").toLowerCase(),
    );
    if (counselor) {
      counselor.admissionsAchieved = (counselor.admissionsAchieved || 0) + 1;
      counselor.performanceBonusBdt = (counselor.performanceBonusBdt || 0) + 1000;
    }

    // 2. Match Partner School & increment activeStudentsCount
    const matchedSchool = store.partnerSchools.find(
      (s) =>
        (lead.partnerSchoolId && s.id === lead.partnerSchoolId) ||
        (lead.targetSchool && s.name.toLowerCase() === lead.targetSchool.toLowerCase()),
    );

    // 3. Match B2B Agent
    const matchedAgent = store.b2bAgents.find(
      (a) =>
        (lead.b2bAgentId && a.id === lead.b2bAgentId) ||
        (lead.b2bAgentName && a.organizationName.toLowerCase() === lead.b2bAgentName.toLowerCase()),
    );

    // 4. Auto-create VisaApplicant in Pipeline if not already present
    const hasVisa = store.visaApplicants.some(
      (v) => v.leadId === lead.id || v.phone === lead.phone || v.trackingNo === trackingNo,
    );
    if (!hasVisa) {
      const visaOfficer = store.staffList.find(
        (st) =>
          (lead.assignedVisaOfficerId && st.id === lead.assignedVisaOfficerId) ||
          st.role === "VISA_OFFICER",
      );
      const newVisa: VisaApplicant = {
        id: `visa-${Date.now()}`,
        leadId: lead.id,
        linkedLeadId: lead.id,
        trackingNo,
        name: lead.name,
        phone: lead.phone,
        branch: lead.branch,
        packageType:
          lead.packageType ||
          (lead.interest === "STUDENT_VISA_PREMIUM" ? "PREMIUM" : "REGULAR"),
        intakeSession: "APRIL_2027",
        stage: 1,
        targetSchool: matchedSchool?.name || lead.targetSchool || lead.targetSchoolName || store.partnerSchools[0]?.name || "Unassigned School",
        targetSchoolName: matchedSchool?.name || lead.targetSchool || lead.targetSchoolName || store.partnerSchools[0]?.name || "Unassigned School",
        partnerSchoolId: matchedSchool?.id || lead.partnerSchoolId || lead.targetSchoolId,
        targetSchoolId: matchedSchool?.id || lead.partnerSchoolId || lead.targetSchoolId,
        b2bAgentId: matchedAgent?.id || lead.b2bAgentId || lead.referredByAgentId,
        referredByAgentId: matchedAgent?.id || lead.b2bAgentId || lead.referredByAgentId,
        b2bAgentName: matchedAgent?.organizationName || lead.b2bAgentName,
        visaOfficerId: visaOfficer?.id || lead.assignedVisaOfficerId,
        assignedVisaOfficerId: visaOfficer?.id || lead.assignedVisaOfficerId,
        visaOfficerName: visaOfficer?.name || lead.assignedVisaOfficerName,
        contractAmountBdt: lead.contractAmountBdt,
        paidAmountBdt: lead.paidAmountBdt,
        dueAmountBdt: lead.dueAmountBdt,
        sponsorName: lead.guardianName || "অভিভাবক (যাচাইকৃত)",
        sponsorRelation: "FATHER",
        sponsorBank: "অগ্রণী ব্যাংক লি.",
        sponsorBalanceBdt: 1850000,
        bankLoanAssistance: false,
        coEStatus: "PENDING",
        visaStatus: "IN_PROCESS",
        counselorName: lead.assignedTo,
        updatedAt: new Date().toISOString(),
      };
      store.visaApplicants.unshift(newVisa);
      if (matchedSchool) {
        matchedSchool.activeStudentsCount = (matchedSchool.activeStudentsCount || 0) + 1;
      }
    }
  }

  saveCmsStore(store);

  syncToServer("UPSERT", "knltc_crm_leads", {
    id: lead.id,
    status: status,
    notes: lead.notes,
    last_contacted_at: lead.lastContactedAt,
  });

  return lead;
}

export function promoteLeadToVisaPipeline(
  leadIdOrPayload:
    | string
    | {
        leadId: string;
        partnerSchoolId?: string;
        targetSchoolId?: string;
        targetSchool?: string;
        targetSchoolName?: string;
        packageType?: "REGULAR" | "PREMIUM";
        b2bAgentId?: string;
        referredByAgentId?: string;
        visaOfficerId?: string;
        assignedVisaOfficerId?: string;
        contractAmountBdt?: number;
      },
  optionsArg?: {
    partnerSchoolId?: string;
    targetSchoolId?: string;
    targetSchool?: string;
    targetSchoolName?: string;
    packageType?: "REGULAR" | "PREMIUM";
    b2bAgentId?: string;
    referredByAgentId?: string;
    visaOfficerId?: string;
    assignedVisaOfficerId?: string;
    contractAmountBdt?: number;
  },
): VisaApplicant | null {
  const leadId = typeof leadIdOrPayload === "string" ? leadIdOrPayload : leadIdOrPayload.leadId;
  const options = typeof leadIdOrPayload === "string" ? optionsArg : leadIdOrPayload;

  const store = getCmsStore();
  const lead = store.crmLeads.find((l) => l.id === leadId);
  if (!lead) return null;

  if (options?.partnerSchoolId || options?.targetSchoolId) {
    lead.partnerSchoolId = options.partnerSchoolId || options.targetSchoolId;
    lead.targetSchoolId = options.partnerSchoolId || options.targetSchoolId;
  }
  if (options?.targetSchool || options?.targetSchoolName) {
    lead.targetSchool = options.targetSchool || options.targetSchoolName;
    lead.targetSchoolName = options.targetSchool || options.targetSchoolName;
  }
  if (options?.packageType) lead.packageType = options.packageType;
  if (options?.b2bAgentId || options?.referredByAgentId) {
    lead.b2bAgentId = options.b2bAgentId || options.referredByAgentId;
    lead.referredByAgentId = options.b2bAgentId || options.referredByAgentId;
  }
  if (options?.visaOfficerId || options?.assignedVisaOfficerId) {
    lead.assignedVisaOfficerId = options.visaOfficerId || options.assignedVisaOfficerId;
  }
  if (options?.contractAmountBdt !== undefined) lead.contractAmountBdt = options.contractAmountBdt;

  saveCmsStore(store);
  updateCrmLeadStatus(leadId, "ADMITTED");
  const updatedStore = getCmsStore();
  return (
    updatedStore.visaApplicants.find((v) => v.leadId === leadId || v.linkedLeadId === leadId || v.phone === lead.phone) || null
  );
}

export function updateVisaStage(id: string, nextStage: VisaStage): VisaApplicant | null {
  const store = getCmsStore();
  const index = store.visaApplicants.findIndex((v) => v.id === id);
  if (index === -1) return null;

  const app = store.visaApplicants[index];
  const prevStage = app.stage;
  app.stage = nextStage;
  app.updatedAt = new Date().toISOString();

  // 1. Auto-increment Visa Officer KPI when progressing stages
  if (nextStage > prevStage) {
    const officer = store.staffList.find(
      (st) =>
        ((app.visaOfficerId || app.assignedVisaOfficerId) && st.id === (app.visaOfficerId || app.assignedVisaOfficerId)) ||
        (app.visaOfficerName && st.name.toLowerCase() === app.visaOfficerName.toLowerCase()) ||
        st.role === "VISA_OFFICER",
    );
    if (officer) {
      officer.kpiAchieved = (officer.kpiAchieved || 0) + 1;
    }
  }

  // 2. Stage 6 (Pre-Visa COE Approval): Trigger B2B Agent Commission & COE Status
  if (nextStage >= 6) {
    app.coEStatus = "APPROVED";

    const agentId = app.b2bAgentId || app.referredByAgentId;
    if (!app.b2bCommissionTriggered && (agentId || app.b2bAgentName)) {
      const agent = store.b2bAgents.find(
        (a) =>
          (agentId && a.id === agentId) ||
          (app.b2bAgentName && a.organizationName.toLowerCase() === app.b2bAgentName.toLowerCase()),
      );
      if (agent) {
        agent.successfulVisasCount = (agent.successfulVisasCount || 0) + 1;
        agent.pendingCommissionBdt =
          (agent.pendingCommissionBdt || 0) + (agent.agreedCommissionBdt || 30000);
        app.b2bCommissionTriggered = true;
      }
    }
  }

  // 3. Stage 9 (Visa Stamped): Update status
  if (nextStage >= 9) {
    app.visaStatus = "STAMPED";
  }
  if (nextStage === 10) {
    app.visaStatus = "DEPARTED";
  }

  saveCmsStore(store);

  syncToServer("UPSERT", "knltc_visa_applicants", {
    id: app.id,
    stage: nextStage,
    coe_status: app.coEStatus,
    visa_status: app.visaStatus,
    updated_at: app.updatedAt,
  });

  return app;
}

export function addLmsCredentials(data: {
  studentName: string;
  phone: string;
  courseLevel: "N5" | "N4" | "IRODORI";
  enrollmentNo: string;
  portalUsername: string;
  portalPasswordMasked: string;
  activeBatch: string;
  assignedSenseiId?: string;
  assignedSenseiName?: string;
  leadId?: string;
  linkedLeadId?: string;
}): LmsUserBridge {
  const store = getCmsStore();
  const sensei = store.staffList.find(
    (st) =>
      (data.assignedSenseiId && st.id === data.assignedSenseiId) || st.role === "SENIOR_SENSEI",
  );
  const matchedLead = store.crmLeads.find(
    (l) =>
      (data.leadId && l.id === data.leadId) ||
      (data.linkedLeadId && l.id === data.linkedLeadId) ||
      l.phone === data.phone,
  );

  const newBridge: LmsUserBridge = {
    id: `lms-${Date.now()}`,
    ...data,
    leadId: matchedLead?.id || data.leadId || data.linkedLeadId,
    linkedLeadId: matchedLead?.id || data.leadId || data.linkedLeadId,
    assignedSenseiId: sensei?.id || data.assignedSenseiId,
    assignedSenseiName: sensei?.name || data.assignedSenseiName,
    portalFeeDeductedBdt: 2000,
    netKnlTcMarginBdt: 10000,
    credentialsSentViaWa: true,
    credentialsSentAt: new Date().toISOString(),
    progressPercentage: 5,
  };
  store.lmsBridges.unshift(newBridge);

  if (matchedLead) {
    matchedLead.isCourseEnrolled = true;
    matchedLead.enrolledBatchOrSession = data.activeBatch;
  }

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
  const isExpense = tx.category === "EXPENSE" || tx.type.startsWith("EXPENSE");

  // If INCOME, sync with student's CrmLead and VisaApplicant paid/due balance
  let computedDue = tx.dueAmountBdt;
  let resolvedLeadId = tx.linkedLeadId;
  let resolvedVisaId = tx.linkedVisaId;

  if (!isExpense && tx.type !== "SCHOOL_COMMISSION_JPY") {
    const matchedLead = store.crmLeads.find(
      (l) =>
        (tx.linkedLeadId && l.id === tx.linkedLeadId) ||
        (tx.studentPhone && l.phone === tx.studentPhone) ||
        l.name.toLowerCase() === (tx.studentName || "").toLowerCase(),
    );
    const matchedVisa = store.visaApplicants.find(
      (v) =>
        (tx.linkedVisaId && v.id === tx.linkedVisaId) ||
        (matchedLead && v.leadId === matchedLead.id) ||
        (tx.studentPhone && v.phone === tx.studentPhone) ||
        v.name.toLowerCase() === (tx.studentName || "").toLowerCase(),
    );

    const defaultContract =
      matchedLead?.contractAmountBdt ||
      matchedVisa?.contractAmountBdt ||
      (tx.type === "PREMIUM_PACKAGE" || tx.type === "PREMIUM_PACKAGE_ADVANCE"
        ? 1100000
        : tx.type === "COURSE_FEE"
          ? 12000
          : 120000);

    if (matchedLead) {
      resolvedLeadId = matchedLead.id;
      const contract = matchedLead.contractAmountBdt || defaultContract;
      const newPaid = (matchedLead.paidAmountBdt || 0) + Number(tx.amountBdt || 0);
      const newDue = Math.max(0, contract - newPaid);
      matchedLead.contractAmountBdt = contract;
      matchedLead.paidAmountBdt = newPaid;
      matchedLead.dueAmountBdt = newDue;
      computedDue = newDue;
    }

    if (matchedVisa) {
      resolvedVisaId = matchedVisa.id;
      const contract = matchedVisa.contractAmountBdt || defaultContract;
      const newPaid = (matchedVisa.paidAmountBdt || 0) + Number(tx.amountBdt || 0);
      const newDue = Math.max(0, contract - newPaid);
      matchedVisa.contractAmountBdt = contract;
      matchedVisa.paidAmountBdt = newPaid;
      matchedVisa.dueAmountBdt = newDue;
      computedDue = newDue;
    }
  }

  const newTx: FinancialTransaction = {
    ...tx,
    id: `trx-${Date.now()}`,
    category: isExpense ? "EXPENSE" : "INCOME",
    dueAmountBdt: computedDue,
    linkedLeadId: resolvedLeadId,
    linkedVisaId: resolvedVisaId,
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
  const tx = store.transactions.find((t) => t.id === id);
  if (tx && tx.category !== "EXPENSE" && !tx.type.startsWith("EXPENSE")) {
    const matchedLead = store.crmLeads.find(
      (l) =>
        (tx.linkedLeadId && l.id === tx.linkedLeadId) ||
        (tx.studentPhone && l.phone === tx.studentPhone) ||
        l.name.toLowerCase() === (tx.studentName || "").toLowerCase(),
    );
    if (matchedLead && matchedLead.paidAmountBdt) {
      matchedLead.paidAmountBdt = Math.max(0, matchedLead.paidAmountBdt - tx.amountBdt);
      matchedLead.dueAmountBdt = Math.max(
        0,
        (matchedLead.contractAmountBdt || 120000) - matchedLead.paidAmountBdt,
      );
    }
    const matchedVisa = store.visaApplicants.find(
      (v) =>
        (tx.linkedVisaId && v.id === tx.linkedVisaId) ||
        (tx.studentPhone && v.phone === tx.studentPhone) ||
        v.name.toLowerCase() === (tx.studentName || "").toLowerCase(),
    );
    if (matchedVisa && matchedVisa.paidAmountBdt) {
      matchedVisa.paidAmountBdt = Math.max(0, matchedVisa.paidAmountBdt - tx.amountBdt);
      matchedVisa.dueAmountBdt = Math.max(
        0,
        (matchedVisa.contractAmountBdt || 120000) - matchedVisa.paidAmountBdt,
      );
    }
  }
  store.transactions = store.transactions.filter((t) => t.id !== id);
  saveCmsStore(store);
  syncToServer("DELETE", "knltc_finance_transactions", { id });
}

// ------------------------------------------------------------------------------
// Cross-Module Financial Settlement Actions (School Commission, B2B Payout, HR Payroll)
// ------------------------------------------------------------------------------
export function claimPartnerSchoolCommission(
  schoolId: string,
  studentCount = 1,
  jpyToBdtRate = 0.8,
  verifiedBy = "Sheikh Baset (MD)",
): FinancialTransaction | null {
  const store = getCmsStore();
  const school = store.partnerSchools.find((s) => s.id === schoolId);
  if (!school) return null;

  const yenAmount = (school.commissionPerStudentYen || 0) * studentCount;
  if (yenAmount <= 0) return null;
  const bdtAmount = Math.round(yenAmount * jpyToBdtRate);

  school.totalCommissionReceivedYen = (school.totalCommissionReceivedYen || 0) + yenAmount;
  saveCmsStore(store);

  return addFinancialTransaction({
    receiptNo: `JP-COM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    date: new Date().toISOString().slice(0, 10),
    studentName: `${school.name} (${studentCount} Student Commission)`,
    category: "INCOME",
    type: "SCHOOL_COMMISSION_JPY",
    amountBdt: bdtAmount,
    paymentMethod: "BANK_TRANSFER",
    referenceOrTrx: `JPY-${yenAmount.toLocaleString()}`,
    branch: "DHK-HQ",
    verifiedBy,
    notes: `Japanese Partner School Commission: ¥${yenAmount.toLocaleString()} JPY @ ${jpyToBdtRate} BDT`,
    linkedSchoolId: school.id,
  });
}

export function settleB2bAgentCommission(
  agentId: string,
  amountBdt?: number,
  paymentMethod: FinancialTransaction["paymentMethod"] = "BKASH",
  branch: "DHK-HQ" | "KHULNA-01" = "DHK-HQ",
  verifiedBy = "Sheikh Baset (MD)",
): FinancialTransaction | null {
  const store = getCmsStore();
  const agent = store.b2bAgents.find((a) => a.id === agentId);
  if (!agent) return null;

  const payoutAmount = amountBdt ?? (agent.pendingCommissionBdt || agent.agreedCommissionBdt || 0);
  if (payoutAmount <= 0) return null;

  agent.pendingCommissionBdt = Math.max(0, (agent.pendingCommissionBdt || 0) - payoutAmount);
  agent.paidCommissionBdt = (agent.paidCommissionBdt || 0) + payoutAmount;
  saveCmsStore(store);

  return addFinancialTransaction({
    receiptNo: `B2B-PAY-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    date: new Date().toISOString().slice(0, 10),
    studentName: `${agent.organizationName} (${agent.contactPerson})`,
    studentPhone: agent.phone,
    category: "EXPENSE",
    type: "EXPENSE_B2B_COMMISSION",
    amountBdt: payoutAmount,
    paymentMethod,
    referenceOrTrx: `B2B-${Date.now().toString().slice(-6)}`,
    branch,
    verifiedBy,
    notes: `B2B Referral Commission Settlement for ${agent.organizationName}`,
    linkedAgentId: agent.id,
  });
}

export function disburseStaffPayroll(
  staffId: string,
  branchOrVerifiedBy: string = "DHK-HQ",
  verifiedByArg = "Sheikh Baset (MD)",
): FinancialTransaction | null {
  const store = getCmsStore();
  const staff = store.staffList.find((s) => s.id === staffId);
  if (!staff) return null;

  const isBranch = branchOrVerifiedBy === "DHK-HQ" || branchOrVerifiedBy === "KHULNA-01";
  const branch: "DHK-HQ" | "KHULNA-01" = isBranch ? branchOrVerifiedBy : "DHK-HQ";
  const verifiedBy = isBranch ? verifiedByArg : branchOrVerifiedBy;

  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const totalPay = (staff.monthlyBaseSalaryBdt || 0) + (staff.performanceBonusBdt || 0);
  const bonusIncluded = staff.performanceBonusBdt || 0;

  staff.lastPaidMonth = currentMonth;
  staff.performanceBonusBdt = 0;
  saveCmsStore(store);

  return addFinancialTransaction({
    receiptNo: `PAY-${currentMonth.replace("-", "")}-${Math.floor(100 + Math.random() * 899)}`,
    date: new Date().toISOString().slice(0, 10),
    studentName: `${staff.name} (${staff.role})`,
    studentPhone: staff.phone,
    category: "EXPENSE",
    type: "EXPENSE_PAYROLL",
    amountBdt: totalPay,
    paymentMethod: "BANK_TRANSFER",
    referenceOrTrx: `SAL-${currentMonth}-${staff.id.slice(-4)}`,
    branch: staff.location === "KHULNA_OFFICE" ? "KHULNA-01" : branch,
    verifiedBy,
    notes: `Monthly Salary (${currentMonth}) — Base: ৳${staff.monthlyBaseSalaryBdt.toLocaleString()}${bonusIncluded > 0 ? ` + Bonus: ৳${bonusIncluded.toLocaleString()}` : ""}`,
    linkedStaffId: staff.id,
  });
}

export function disburseAllActivePayroll(
  branchOrVerifiedBy: string = "DHK-HQ",
  verifiedByArg = "Sheikh Baset (MD)",
): { count: number; totalAmountBdt: number; totalBdt: number } {
  const store = getCmsStore();
  const currentMonth = new Date().toISOString().slice(0, 7);
  const unpaidActiveStaff = store.staffList.filter(
    (s) => s.status === "ACTIVE" && s.lastPaidMonth !== currentMonth,
  );

  let totalAmountBdt = 0;
  for (const stf of unpaidActiveStaff) {
    const tx = disburseStaffPayroll(stf.id, branchOrVerifiedBy, verifiedByArg);
    if (tx) totalAmountBdt += tx.amountBdt;
  }

  return { count: unpaidActiveStaff.length, totalAmountBdt, totalBdt: totalAmountBdt };
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
    intakeQuota: school.intakeQuota || 20,
    id: `sch-${Date.now()}`,
  };
  store.partnerSchools.unshift(newSchool);

  // Persist extended fields (logoUrl, documents, tuition, quotas) in websiteCms
  const cms = store.websiteCms?.[0] || DEFAULT_WEBSITE_CMS;
  if (!cms.schoolExtendedProfiles) cms.schoolExtendedProfiles = {};
  cms.schoolExtendedProfiles[newSchool.id] = { ...newSchool };

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

  syncToServer("CMS_UPDATE", undefined, cms);

  return newSchool;
}

export function updatePartnerSchool(id: string, updates: Partial<JapanesePartnerSchool>): JapanesePartnerSchool | null {
  const store = getCmsStore();
  const idx = store.partnerSchools.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  store.partnerSchools[idx] = { ...store.partnerSchools[idx], ...updates };
  const s = store.partnerSchools[idx];

  // Persist extended fields (logoUrl, documents, tuition, quotas) in websiteCms
  const cms = store.websiteCms?.[0] || DEFAULT_WEBSITE_CMS;
  if (!cms.schoolExtendedProfiles) cms.schoolExtendedProfiles = {};
  cms.schoolExtendedProfiles[s.id] = {
    ...(cms.schoolExtendedProfiles[s.id] || {}),
    ...s,
  };

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

  syncToServer("CMS_UPDATE", undefined, cms);

  return s;
}

export function deletePartnerSchool(id: string) {
  const store = getCmsStore();
  store.partnerSchools = store.partnerSchools.filter((s) => s.id !== id);

  const cms = store.websiteCms?.[0];
  if (cms?.schoolExtendedProfiles?.[id]) {
    delete cms.schoolExtendedProfiles[id];
    syncToServer("CMS_UPDATE", undefined, cms);
  }

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

  // Persist extended fields (logoUrl, documents, license, nid, banking) in websiteCms
  const cms = store.websiteCms?.[0] || DEFAULT_WEBSITE_CMS;
  if (!cms.b2bAgentExtendedProfiles) cms.b2bAgentExtendedProfiles = {};
  cms.b2bAgentExtendedProfiles[newAgent.id] = { ...newAgent };

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

  syncToServer("CMS_UPDATE", undefined, cms);

  return newAgent;
}

export function updateB2bAgent(id: string, updates: Partial<B2bAgent>): B2bAgent | null {
  const store = getCmsStore();
  const idx = store.b2bAgents.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  store.b2bAgents[idx] = { ...store.b2bAgents[idx], ...updates };
  const a = store.b2bAgents[idx];

  // Persist extended fields (logoUrl, documents, license, nid, banking) in websiteCms
  const cms = store.websiteCms?.[0] || DEFAULT_WEBSITE_CMS;
  if (!cms.b2bAgentExtendedProfiles) cms.b2bAgentExtendedProfiles = {};
  cms.b2bAgentExtendedProfiles[a.id] = {
    ...(cms.b2bAgentExtendedProfiles[a.id] || {}),
    ...a,
  };

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

  syncToServer("CMS_UPDATE", undefined, cms);

  return a;
}

export function deleteB2bAgent(id: string) {
  const store = getCmsStore();
  store.b2bAgents = store.b2bAgents.filter((a) => a.id !== id);

  const cms = store.websiteCms?.[0];
  if (cms?.b2bAgentExtendedProfiles?.[id]) {
    delete cms.b2bAgentExtendedProfiles[id];
    syncToServer("CMS_UPDATE", undefined, cms);
  }

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

// ------------------------------------------------------------------------------
// 360° Lead Profile: Default 12-Item Immigration Checklist, Eligibility Engine & Activity Log
// ------------------------------------------------------------------------------
export const DEFAULT_LEAD_DOCUMENTS: LeadDocumentItem[] = [
  {
    id: "doc-passport",
    titleBn: "মূল পাসপোর্ট (MRP / E-Passport - ন্যূনতম ১ বছর মেয়াদ)",
    titleEn: "Valid Passport (MRP / E-Passport)",
    category: "IDENTITY",
    status: "MISSING",
  },
  {
    id: "doc-nid-birth",
    titleBn: "ডিজিটাল জন্ম নিবন্ধন (ইংরেজি) ও জাতীয় পরিচয়পত্র (NID)",
    titleEn: "English Birth Certificate & National ID",
    category: "IDENTITY",
    status: "MISSING",
  },
  {
    id: "doc-photos",
    titleBn: "জাপান ইমিগ্রেশন সাইজ ছবি (4cm x 3cm - সাদা ব্যাকগ্রাউন্ড)",
    titleEn: "Biometric Photographs (4cm x 3cm)",
    category: "IDENTITY",
    status: "MISSING",
  },
  {
    id: "doc-ssc",
    titleBn: "এসএসসি (SSC) মূল সার্টিফিকেট ও মার্কশিট (ভেরিফাইড)",
    titleEn: "SSC Original Certificate & Transcript",
    category: "ACADEMIC",
    status: "MISSING",
  },
  {
    id: "doc-hsc",
    titleBn: "এইচএসসি / ডিপ্লোমা / অনার্স মূল সার্টিফিকেট ও মার্কশিট",
    titleEn: "HSC / Diploma / Bachelor Certificate & Transcript",
    category: "ACADEMIC",
    status: "MISSING",
  },
  {
    id: "doc-study-gap",
    titleBn: "স্টাডি গ্যাপ জাস্টিফিকেশন / জব এক্সপেরিয়েন্স সার্টিফিকেট (প্রযোজ্য ক্ষেত্রে)",
    titleEn: "Study Gap Explanation / Job Experience Certificate",
    category: "ACADEMIC",
    status: "MISSING",
  },
  {
    id: "doc-jp-150hr",
    titleBn: "KNLTC ১৫০ ঘণ্টা জাপানি ভাষা কোর্স সম্পন্ন সনদ",
    titleEn: "150+ Hours Japanese Language Study Certificate",
    category: "LANGUAGE",
    status: "MISSING",
  },
  {
    id: "doc-jlpt-nat",
    titleBn: "JLPT N5/N4 অথবা NAT-TEST / JFT-Basic পাস সার্টিফিকেট",
    titleEn: "JLPT / NAT-TEST / JFT Official Pass Certificate",
    category: "LANGUAGE",
    status: "MISSING",
  },
  {
    id: "doc-bank-solvency",
    titleBn: "স্পন্সরের ব্যাংক সলভেন্সি সার্টিফিকেট (৳১৮–২২ লক্ষ সমপরিমাণ)",
    titleEn: "Sponsor Bank Solvency Certificate (৳18L–22L BDT)",
    category: "SPONSOR_FINANCIAL",
    status: "MISSING",
  },
  {
    id: "doc-bank-statement",
    titleBn: "স্পন্সরের বিগত ৬ মাসের ব্যাংক স্টেটমেন্ট (অরিজিনাল সিলসহ)",
    titleEn: "6-Month Official Bank Transaction Statement",
    category: "SPONSOR_FINANCIAL",
    status: "MISSING",
  },
  {
    id: "doc-income-tax",
    titleBn: "স্পন্সরের আয়ের উৎস সনদ, ট্রেড লাইসেন্স / চাকরির সনদ ও TIN/Tax রিটার্ন",
    titleEn: "Sponsor Income Certificate, Trade License & Tax Return",
    category: "SPONSOR_FINANCIAL",
    status: "MISSING",
  },
  {
    id: "doc-family-rel",
    titleBn: "পরিবারিক সম্পর্ক সনদ (Family Relationship Certificate - ইউনিয়ন/ওয়ার্ড)",
    titleEn: "Official Family Relationship Certificate",
    category: "SPONSOR_FINANCIAL",
    status: "MISSING",
  },
];

export function getLeadDocumentChecklist(lead: Partial<CrmLead>): LeadDocumentItem[] {
  if (lead.documentChecklist && lead.documentChecklist.length > 0) {
    return lead.documentChecklist;
  }
  const passportStr = String(lead.passportNo || "").trim();
  const hasPassport = Boolean(passportStr.length > 3);
  const hasPassedJp =
    lead.japaneseProficiency === "PASSED_N5" ||
    lead.japaneseProficiency === "PASSED_N4" ||
    lead.japaneseProficiency === "NAT_JFT" ||
    lead.japaneseExamStatus === "PASSED";
  const isEnrolled = Boolean(lead.isCourseEnrolled || lead.status === "ADMITTED");
  const hasSolvency = (lead.sponsorBankBalanceBdt || 0) >= 1500000;

  return DEFAULT_LEAD_DOCUMENTS.map((doc) => {
    if (doc.id === "doc-passport" && hasPassport) {
      return { ...doc, status: "VERIFIED" as const };
    }
    if (doc.id === "doc-jlpt-nat" && hasPassedJp) {
      return { ...doc, status: "VERIFIED" as const };
    }
    if (doc.id === "doc-jp-150hr" && isEnrolled) {
      return { ...doc, status: "SUBMITTED" as const };
    }
    if ((doc.id === "doc-ssc" || doc.id === "doc-hsc") && isEnrolled) {
      return { ...doc, status: "VERIFIED" as const };
    }
    if (doc.id === "doc-bank-solvency" && hasSolvency) {
      return { ...doc, status: "VERIFIED" as const };
    }
    return { ...doc };
  });
}

export function calculateLeadEligibility(lead: Partial<CrmLead>): {
  totalScore: number;
  gpaScore: number;
  gapScore: number;
  languageScore: number;
  financialScore: number;
  verifiedDocsCount: number;
  submittedDocsCount: number;
  totalDocsCount: number;
  tier: "EXCELLENT" | "GOOD" | "MODERATE" | "NEEDS_REVIEW";
  recommendationBn: string;
  recommendationEn: string;
} {
  // 1. Academic GPA Score (max 30 points)
  let gpaScore = 20;
  const parsedSsc = parseFloat(lead.sscGpa || "");
  const parsedHsc = parseFloat(lead.hscGpa || "");
  const gpaText = (lead.gpaDetails || "").toLowerCase();

  if (!isNaN(parsedSsc) && !isNaN(parsedHsc)) {
    const avg = (parsedSsc + parsedHsc) / 2;
    if (avg >= 4.5) gpaScore = 30;
    else if (avg >= 4.0) gpaScore = 27;
    else if (avg >= 3.5) gpaScore = 23;
    else if (avg >= 3.0) gpaScore = 18;
    else gpaScore = 12;
  } else if (gpaText.includes("5.0") || gpaText.includes("4.8") || gpaText.includes("4.5")) {
    gpaScore = 29;
  } else if (gpaText.includes("4.") || gpaText.includes("3.8")) {
    gpaScore = 25;
  } else if (gpaText.includes("3.")) {
    gpaScore = 20;
  }

  // 2. Study Gap Score (max 25 points)
  const gap = Number(lead.studyGapYears ?? 0);
  let gapScore = 25;
  if (gap <= 2) gapScore = 25;
  else if (gap <= 4) gapScore = 20;
  else if (gap <= 6) gapScore = 14;
  else gapScore = 8;

  // 3. Language & Exam Score (max 25 points)
  let languageScore = 10;
  if (
    lead.japaneseProficiency === "PASSED_N4" ||
    lead.japaneseExamType === "JLPT_N4" ||
    lead.japaneseExamType === "NAT_4Q" ||
    lead.japaneseExamType === "JFT_BASIC"
  ) {
    languageScore = 25;
  } else if (
    lead.japaneseProficiency === "PASSED_N5" ||
    lead.japaneseProficiency === "NAT_JFT" ||
    lead.japaneseExamStatus === "PASSED"
  ) {
    languageScore = 23;
  } else if (
    lead.japaneseProficiency === "LEARNING_N5" ||
    lead.japaneseExamStatus === "REGISTERED" ||
    lead.isCourseEnrolled
  ) {
    languageScore = 17;
  } else {
    languageScore = 10;
  }

  // 4. Financial Solvency & Document Readiness (max 20 points)
  const docs = getLeadDocumentChecklist(lead);
  const verifiedDocsCount = docs.filter((d) => d.status === "VERIFIED").length;
  const submittedDocsCount = docs.filter((d) => d.status === "SUBMITTED").length;
  const totalDocsCount = docs.length;

  const balance = Number(lead.sponsorBankBalanceBdt ?? 0);
  let solvencyPts = 6;
  if (balance >= 1800000) solvencyPts = 12;
  else if (balance >= 1200000 || lead.bankLoanRequired) solvencyPts = 10;
  else if (lead.guardianName) solvencyPts = 7;

  const docPts = Math.min(8, Math.round(((verifiedDocsCount + submittedDocsCount * 0.5) / totalDocsCount) * 8));
  const financialScore = Math.min(20, solvencyPts + docPts);

  const totalScore = Math.min(100, gpaScore + gapScore + languageScore + financialScore);

  let tier: "EXCELLENT" | "GOOD" | "MODERATE" | "NEEDS_REVIEW" = "GOOD";
  let recommendationBn = "";
  let recommendationEn = "";

  if (totalScore >= 82) {
    tier = "EXCELLENT";
    recommendationBn =
      "জাপান স্টুডেন্ট ভিসা (COE) ও টোকিও/ওসাকা প্রথম সারির স্কুলের জন্য অত্যন্ত উপযুক্ত প্রোফাইল।";
    recommendationEn =
      "Highly eligible for Japan Student Visa (COE) at top-tier Tokyo/Osaka partner schools.";
  } else if (totalScore >= 68) {
    tier = "GOOD";
    recommendationBn =
      "স্টুডেন্ট ভিসা ফাইল ওপেনিংয়ের জন্য উপযুক্ত — দ্রুত N5 সার্টিফিকেট ও ব্যাংক সলভেন্সি সম্পন্ন করুন।";
    recommendationEn =
      "Good profile for Student Visa — complete N5/NAT exam and bank solvency verification.";
  } else if (totalScore >= 52) {
    tier = "MODERATE";
    recommendationBn =
      gap > 4
        ? "স্টাডি গ্যাপ বেশি হওয়ায় জব এক্সপেরিয়েন্স সনদসহ স্টুডেন্ট ভিসা অথবা SSW স্পেসিফাইড স্কিলড ভিসা সুপারিশকৃত।"
        : "ভাষা দক্ষতা বৃদ্ধি ও স্পন্সর ব্যাংক লোন সহায়তা (অগ্রণী/পূবালী ব্যাংক) নিয়ে ফাইল প্রসেস করা যাবে।";
    recommendationEn =
      gap > 4
        ? "Recommend SSW Specified Skilled Visa or Student Visa with verified job experience."
        : "Eligible with intensive N5 training and partner bank education loan support.";
  } else {
    tier = "NEEDS_REVIEW";
    recommendationBn =
      "কাউন্সেলর রিভিউ প্রয়োজন — প্রথমে জাপানি ভাষা N5/N4 কোর্স ও ডকুমেন্ট প্রস্তুতি শুরু করার পরামর্শ দিন।";
    recommendationEn =
      "Requires senior counselor review — start with N5/N4 language enrollment first.";
  }

  return {
    totalScore,
    gpaScore,
    gapScore,
    languageScore,
    financialScore,
    verifiedDocsCount,
    submittedDocsCount,
    totalDocsCount,
    tier,
    recommendationBn,
    recommendationEn,
  };
}

export function addLeadActivityLog(
  leadId: string,
  entry: {
    type: LeadActivityItem["type"];
    summary: string;
    counselorName: string;
  },
): CrmLead | null {
  const store = getCmsStore();
  const lead = store.crmLeads.find((l) => l.id === leadId);
  if (!lead) return null;

  const newEntry: LeadActivityItem = {
    id: `act-${Date.now()}-${Math.floor(Math.random() * 100)}`,
    type: entry.type,
    summary: entry.summary,
    counselorName: entry.counselorName,
    createdAt: new Date().toISOString(),
  };

  lead.activityLog = [newEntry, ...(lead.activityLog || [])];
  lead.lastContactedAt = newEntry.createdAt;
  saveCmsStore(store);
  return lead;
}

export function updateLmsProgressAndAttendance(
  leadId: string,
  phone: string,
  progressPercentage: number,
  attendancePercentage: number,
): void {
  const store = getCmsStore();
  const lead = store.crmLeads.find((l) => l.id === leadId || l.phone === phone);
  if (lead) {
    lead.attendancePercentage = attendancePercentage;
  }
  const bridge = store.lmsBridges.find(
    (b) => b.leadId === leadId || b.linkedLeadId === leadId || b.phone === phone,
  );
  if (bridge) {
    bridge.progressPercentage = progressPercentage;
  }
  saveCmsStore(store);
}

// ------------------------------------------------------------------------------
// 360° Partner School / University & B2B Agent Document Vaults & Helpers
// ------------------------------------------------------------------------------
export const DEFAULT_SCHOOL_DOCUMENTS: PartnerDocumentItem[] = [
  {
    id: "sch-doc-brochure",
    titleBn: "অফিসিয়াল স্কুল / ইউনিভার্সিটি ব্রশিউর ও প্রসপেক্টাস (PDF/Image)",
    titleEn: "Official Institution Brochure & Prospectus",
    category: "BROCHURE_PROSPECTUS",
    status: "MISSING",
  },
  {
    id: "sch-doc-app-form",
    titleBn: "ভর্তি আবেদন ফরম (Application Form & CV Template)",
    titleEn: "Student Application & Rirekisho Template",
    category: "APPLICATION_FORM",
    status: "MISSING",
  },
  {
    id: "sch-doc-fee-chart",
    titleBn: "১ম বছরের টিউশন ফি, এডমিশন ফি ও হোস্টেল চার্জ চার্ট",
    titleEn: "1st Year Tuition, Admission & Dormitory Fee Breakdown",
    category: "FEE_STRUCTURE",
    status: "MISSING",
  },
  {
    id: "sch-doc-mou",
    titleBn: "দ্বিপাক্ষিক চুক্তিপত্র ও কমিশন এগ্রিমেন্ট (Signed MOU / Agency Certificate)",
    titleEn: "Signed Bilateral MOU & Official Representation Agreement",
    category: "MOU_AGREEMENT",
    status: "MISSING",
  },
  {
    id: "sch-doc-accreditation",
    titleBn: "জাপান মিনিস্ট্রি অফ জাস্টিস / MEXT অ্যাক্রেডিটেশন ও লাইসেন্স সনদ",
    titleEn: "Ministry of Justice / MEXT Accreditation & School License",
    category: "ACCREDITATION_LICENSE",
    status: "MISSING",
  },
];

export const DEFAULT_B2B_AGENT_DOCUMENTS: PartnerDocumentItem[] = [
  {
    id: "b2b-doc-trade-license",
    titleBn: "হালনাগাদ ট্রেড লাইসেন্স (Trade License Copy)",
    titleEn: "Valid Business Trade License",
    category: "TRADE_LICENSE",
    status: "MISSING",
  },
  {
    id: "b2b-doc-nid-passport",
    titleBn: "স্বত্বাধিকারীর জাতীয় পরিচয়পত্র (NID) / পাসপোর্ট কপি",
    titleEn: "Proprietor National ID (NID) / Passport Copy",
    category: "NID_PASSPORT",
    status: "MISSING",
  },
  {
    id: "b2b-doc-mou",
    titleBn: "স্বাক্ষরিত বিটুবি পার্টনারশিপ ও কমিশন চুক্তিপত্র (Signed B2B MOU)",
    titleEn: "Signed B2B Sub-Agent MOU & Commission Agreement",
    category: "MOU_AGREEMENT",
    status: "MISSING",
  },
  {
    id: "b2b-doc-tin",
    titleBn: "টিন সার্টিফিকেট ও ব্যাংক একাউন্ট ভেরিফিকেশন কপি (TIN / Bank Cheque)",
    titleEn: "TIN Certificate & Cancelled Cheque Leaf",
    category: "TIN_TAX",
    status: "MISSING",
  },
  {
    id: "b2b-doc-office-card",
    titleBn: "অফিস ভিজিটিং কার্ড / ব্রশিউর ও সাইনবোর্ড ছবি",
    titleEn: "Agency Visiting Card, Brochure & Office Photo",
    category: "OFFICE_IDENTITY",
    status: "MISSING",
  },
];

export function getSchoolDocumentVault(
  school: Partial<JapanesePartnerSchool>,
): PartnerDocumentItem[] {
  if (school.documents && school.documents.length > 0) {
    return school.documents;
  }
  return DEFAULT_SCHOOL_DOCUMENTS.map((d) => ({ ...d }));
}

export function getB2bAgentDocumentVault(agent: Partial<B2bAgent>): PartnerDocumentItem[] {
  if (agent.documents && agent.documents.length > 0) {
    return agent.documents;
  }
  const licenseStr = String(agent.tradeLicenseNo || "").trim();
  const nidStr = String(agent.nidOrPassportNo || "").trim();
  const hasLicense = Boolean(licenseStr.length > 2);
  const hasNid = Boolean(nidStr.length > 4);
  return DEFAULT_B2B_AGENT_DOCUMENTS.map((d) => {
    if (d.id === "b2b-doc-trade-license" && hasLicense) {
      return { ...d, status: "VERIFIED" as const };
    }
    if (d.id === "b2b-doc-nid-passport" && hasNid) {
      return { ...d, status: "VERIFIED" as const };
    }
    return { ...d };
  });
}

export function assignStudentToPartnerSchool(
  schoolId: string,
  leadOrVisaId: string,
): JapanesePartnerSchool | null {
  const store = getCmsStore();
  const school = store.partnerSchools.find((s) => s.id === schoolId);
  if (!school) return null;

  const lead = store.crmLeads.find((l) => l.id === leadOrVisaId);
  const visa = store.visaApplicants.find(
    (v) => v.id === leadOrVisaId || (lead && v.leadId === lead.id),
  );

  if (lead) {
    lead.targetSchoolId = school.id;
    lead.targetSchoolName = school.name;
  }
  if (visa) {
    visa.targetSchoolId = school.id;
    visa.targetSchool = school.name;
  }

  // Recompute activeStudentsCount for this school based on linked leads/visas
  const linkedStudentPhones = new Set<string>();
  store.crmLeads.forEach((l) => {
    if (
      l.targetSchoolId === school.id ||
      (l.targetSchoolName && l.targetSchoolName.toLowerCase() === school.name.toLowerCase())
    ) {
      linkedStudentPhones.add(l.phone || l.id);
    }
  });
  store.visaApplicants.forEach((v) => {
    if (
      v.targetSchoolId === school.id ||
      (v.targetSchool && v.targetSchool.toLowerCase() === school.name.toLowerCase())
    ) {
      linkedStudentPhones.add(v.phone || v.id);
    }
  });

  school.activeStudentsCount = Math.max(school.activeStudentsCount || 0, linkedStudentPhones.size);
  saveCmsStore(store);
  return school;
}

export function assignStudentToB2bAgent(
  agentId: string,
  leadOrVisaId: string,
): B2bAgent | null {
  const store = getCmsStore();
  const agent = store.b2bAgents.find((a) => a.id === agentId);
  if (!agent) return null;

  const lead = store.crmLeads.find((l) => l.id === leadOrVisaId);
  const visa = store.visaApplicants.find(
    (v) => v.id === leadOrVisaId || (lead && v.leadId === lead.id),
  );

  if (lead) {
    lead.referredByAgentId = agent.id;
    lead.referredByAgentName = agent.organizationName;
    lead.source = "SUB_AGENT";
  }
  if (visa) {
    visa.b2bAgentId = agent.id;
    visa.referredByAgentId = agent.id;
    visa.b2bAgentName = agent.organizationName;
    visa.referredByAgentName = agent.organizationName;
  }

  // Recompute referredStudentsCount for this agent
  const linkedStudentPhones = new Set<string>();
  store.crmLeads.forEach((l) => {
    if (
      l.referredByAgentId === agent.id ||
      (l.referredByAgentName &&
        l.referredByAgentName.toLowerCase() === agent.organizationName.toLowerCase())
    ) {
      linkedStudentPhones.add(l.phone || l.id);
    }
  });
  store.visaApplicants.forEach((v) => {
    if (
      v.b2bAgentId === agent.id ||
      v.referredByAgentId === agent.id ||
      (v.b2bAgentName && v.b2bAgentName.toLowerCase() === agent.organizationName.toLowerCase())
    ) {
      linkedStudentPhones.add(v.phone || v.id);
    }
  });

  agent.referredStudentsCount = Math.max(
    agent.referredStudentsCount || 0,
    linkedStudentPhones.size,
  );
  saveCmsStore(store);
  return agent;
}

// ------------------------------------------------------------------------------
// Bulk CRM Lead Operations (Google Sheet / CSV Import, Bulk Update & Delete)
// ------------------------------------------------------------------------------
export function normalizeBdPhone(rawPhone: string): string {
  const digits = String(rawPhone || "").replace(/[^0-9]/g, "");
  if (!digits) return "";
  if (digits.startsWith("8801") && digits.length === 13) {
    return "0" + digits.slice(3);
  }
  if (digits.startsWith("1") && digits.length === 10) {
    return "0" + digits;
  }
  return digits;
}

export function deleteCrmLead(leadId: string): void {
  const store = getCmsStore();
  store.crmLeads = store.crmLeads.filter((l) => l.id !== leadId);
  const cms = store.websiteCms?.[0];
  if (cms?.leadExtendedProfiles?.[leadId]) {
    delete cms.leadExtendedProfiles[leadId];
    syncToServer("CMS_UPDATE", undefined, cms);
  }
  saveCmsStore(store);
  syncToServer("DELETE", "knltc_crm_leads", { id: leadId });
}

export function bulkDeleteCrmLeads(leadIds: string[]): number {
  if (!leadIds.length) return 0;
  const idSet = new Set(leadIds);
  const store = getCmsStore();
  const initialCount = store.crmLeads.length;
  store.crmLeads = store.crmLeads.filter((l) => !idSet.has(l.id));
  const deletedCount = initialCount - store.crmLeads.length;

  const cms = store.websiteCms?.[0];
  if (cms?.leadExtendedProfiles) {
    leadIds.forEach((id) => {
      delete cms.leadExtendedProfiles![id];
    });
    syncToServer("CMS_UPDATE", undefined, cms);
  }

  saveCmsStore(store);
  leadIds.forEach((id) => {
    syncToServer("DELETE", "knltc_crm_leads", { id });
  });
  return deletedCount;
}

export function bulkUpdateCrmLeads(
  leadIds: string[],
  updates: Partial<CrmLead>,
): number {
  if (!leadIds.length) return 0;
  const idSet = new Set(leadIds);
  const store = getCmsStore();
  const cms = store.websiteCms?.[0] || DEFAULT_WEBSITE_CMS;
  if (!cms.leadExtendedProfiles) cms.leadExtendedProfiles = {};

  let updatedCount = 0;
  store.crmLeads.forEach((lead) => {
    if (!idSet.has(lead.id)) return;
    Object.assign(lead, updates, { lastContactedAt: new Date().toISOString() });
    cms.leadExtendedProfiles![lead.id] = {
      ...(cms.leadExtendedProfiles![lead.id] || {}),
      ...lead,
    };
    updatedCount++;
  });

  store.websiteCms = [cms];
  saveCmsStore(store);
  syncToServer("CMS_UPDATE", undefined, cms);
  return updatedCount;
}

export function bulkImportCrmLeads(
  rows: Partial<CrmLead>[],
  options?: {
    duplicateStrategy?: "UPDATE_EXISTING" | "SKIP_DUPLICATE" | "CREATE_NEW";
    defaultBranch?: "DHK-HQ" | "KHULNA-01";
    defaultAssignedTo?: string;
    defaultSource?: LeadSource;
    defaultStatus?: LeadStatus;
    defaultPriority?: LeadPriority;
    customImportTag?: string;
  },
): {
  importedCount: number;
  updatedCount: number;
  skippedCount: number;
  totalProcessed: number;
} {
  const store = getCmsStore();
  const cms = store.websiteCms?.[0] || DEFAULT_WEBSITE_CMS;
  if (!cms.leadExtendedProfiles) cms.leadExtendedProfiles = {};

  const strategy = options?.duplicateStrategy || "UPDATE_EXISTING";
  const fallbackBranch = options?.defaultBranch || "DHK-HQ";
  const fallbackAssignedTo = options?.defaultAssignedTo || "শেখ বাসেত";
  const fallbackSource = options?.defaultSource || "GOOGLE_SHEET";
  const fallbackStatus = options?.defaultStatus || "NEW";
  const fallbackPriority = options?.defaultPriority || "WARM";
  const nowIso = new Date().toISOString();
  const todayDate = nowIso.slice(0, 10);

  let importedCount = 0;
  let updatedCount = 0;
  let skippedCount = 0;

  rows.forEach((row, idx) => {
    const cleanName = (row.name || "").trim();
    const rawPhone = (row.phone || row.whatsapp || "").trim();
    if (!cleanName && !rawPhone) {
      skippedCount++;
      return;
    }

    const normPhone = normalizeBdPhone(rawPhone);
    const displayPhone = normPhone || rawPhone || "01700000000";
    const displayWa =
      row.whatsapp && row.whatsapp.trim()
        ? row.whatsapp.trim()
        : displayPhone.startsWith("+88")
          ? displayPhone
          : `+88${displayPhone}`;

    // Check existing lead by normalized phone number
    const existingLead = normPhone
      ? store.crmLeads.find((l) => normalizeBdPhone(l.phone) === normPhone)
      : undefined;

    if (existingLead && strategy === "SKIP_DUPLICATE") {
      skippedCount++;
      return;
    }

    const interest: ServiceInterest = row.interest || "STUDENT_VISA_REGULAR";
    const defaultContract =
      row.contractAmountBdt ??
      (interest === "STUDENT_VISA_PREMIUM"
        ? 1100000
        : interest === "JAPANESE_N5" || interest === "JAPANESE_N4"
          ? 12000
          : 120000);
    const paid = row.paidAmountBdt ?? existingLead?.paidAmountBdt ?? 0;
    const due = Math.max(0, defaultContract - paid);

    const tags = Array.from(
      new Set([
        ...(existingLead?.customTags || []),
        ...(row.customTags || []),
        ...(options?.customImportTag ? [options.customImportTag] : ["Google Sheet"]),
      ]),
    );

    if (existingLead && strategy === "UPDATE_EXISTING") {
      const merged: Partial<CrmLead> = {
        name: cleanName || existingLead.name,
        phone: displayPhone || existingLead.phone,
        whatsapp: displayWa || existingLead.whatsapp,
        email: row.email || existingLead.email,
        city: row.city || existingLead.city,
        address: row.address || existingLead.address,
        passportNo: row.passportNo || existingLead.passportNo,
        guardianName: row.guardianName || existingLead.guardianName,
        guardianPhone: row.guardianPhone || existingLead.guardianPhone,
        education: row.education || existingLead.education,
        sscGpa: row.sscGpa || existingLead.sscGpa,
        hscGpa: row.hscGpa || existingLead.hscGpa,
        graduationYear: row.graduationYear || existingLead.graduationYear,
        studyGapYears:
          row.studyGapYears !== undefined ? row.studyGapYears : existingLead.studyGapYears,
        japaneseProficiency: row.japaneseProficiency || existingLead.japaneseProficiency,
        interest: row.interest || existingLead.interest,
        status: row.status || existingLead.status,
        priority: row.priority || existingLead.priority,
        assignedTo: row.assignedTo || existingLead.assignedTo,
        branch: row.branch || existingLead.branch,
        targetSchool: row.targetSchool || existingLead.targetSchool,
        targetSchoolName: row.targetSchool || existingLead.targetSchoolName,
        contractAmountBdt: defaultContract,
        paidAmountBdt: paid,
        dueAmountBdt: due,
        notes: row.notes
          ? existingLead.notes
            ? `${existingLead.notes} | ${row.notes}`
            : row.notes
          : existingLead.notes,
        customTags: tags,
        importedFromSheetAt: nowIso,
        lastContactedAt: nowIso,
      };
      Object.assign(existingLead, merged);
      cms.leadExtendedProfiles![existingLead.id] = {
        ...(cms.leadExtendedProfiles![existingLead.id] || {}),
        ...existingLead,
      };
      updatedCount++;
      return;
    }

    // Create brand new lead
    const newId = `lead-${Date.now()}-${idx}-${Math.floor(100 + Math.random() * 899)}`;
    const newLead: CrmLead = {
      id: newId,
      name: cleanName || `Candidate ${displayPhone.slice(-4)}`,
      phone: displayPhone,
      whatsapp: displayWa,
      email: row.email || "",
      city: row.city || "ঢাকা",
      address: row.address || "",
      passportNo: row.passportNo || "",
      guardianName: row.guardianName || "",
      guardianPhone: row.guardianPhone || "",
      gpaDetails:
        row.gpaDetails ||
        (row.sscGpa || row.hscGpa
          ? `SSC: ${row.sscGpa || "N/A"}, HSC: ${row.hscGpa || "N/A"}`
          : ""),
      source: row.source || fallbackSource,
      interest,
      status: row.status || fallbackStatus,
      priority: row.priority || fallbackPriority,
      education: row.education || "HSC / Equivalent",
      sscGpa: row.sscGpa || "4.25",
      hscGpa: row.hscGpa || "4.00",
      graduationYear: row.graduationYear || "2024",
      japaneseProficiency: row.japaneseProficiency || "NONE",
      studyGapYears: Number(row.studyGapYears ?? 1),
      assignedTo: row.assignedTo || fallbackAssignedTo,
      branch: row.branch || fallbackBranch,
      targetSchool: row.targetSchool || "",
      targetSchoolName: row.targetSchool || "",
      contractAmountBdt: defaultContract,
      paidAmountBdt: paid,
      dueAmountBdt: due,
      notes: row.notes || "Imported from Google Sheets / CSV",
      followUpDate: row.followUpDate || todayDate,
      lastContactedAt: nowIso,
      createdAt: row.createdAt || nowIso,
      importedFromSheetAt: nowIso,
      customTags: tags,
      activityLog: [
        {
          id: `act-${Date.now()}-${idx}`,
          type: "MEETING_NOTE",
          summary: row.notes
            ? `Google Sheet থেকে ইম্পোর্টকৃত নোট: ${row.notes}`
            : "Google Sheet / CSV থেকে লিড প্রোফাইল সিঙ্ক করা হয়েছে।",
          counselorName: row.assignedTo || fallbackAssignedTo,
          createdAt: nowIso,
        },
      ],
    };

    store.crmLeads.unshift(newLead);
    cms.leadExtendedProfiles![newLead.id] = { ...newLead };
    importedCount++;

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
  });

  store.websiteCms = [cms];
  saveCmsStore(store);
  syncToServer("CMS_UPDATE", undefined, cms);

  return {
    importedCount,
    updatedCount,
    skippedCount,
    totalProcessed: importedCount + updatedCount + skippedCount,
  };
}


