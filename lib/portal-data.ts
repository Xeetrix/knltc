// ==============================================================================
// KNLTC Japanese Language Course Platform - RBAC Store & Portal Data
// ==============================================================================

export type UserRole = "MAIN_ADMIN" | "BRANCH_ADMIN" | "TEACHER" | "STUDENT";
export type EnrollmentStatus = "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";
export type PaymentStatus = "PENDING" | "VERIFIED" | "REJECTED";
export type PaymentMethod = "BKASH" | "NAGAD" | "BANK_TRANSFER" | "CASH_OFFICE";
export type DeliveryMode = "ONLINE_LIVE" | "OFFLINE_CLASSROOM";
export type VisaCategory = "STUDENT_VISA" | "SSW_JOB" | "TITP_INTERN" | "GENERAL_LANGUAGE";

export interface Branch {
  id: string;
  name: string;
  code: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  totalStudents: number;
}

export interface Course {
  id: string;
  title: string;
  code: string;
  level: "N5" | "N4" | "N5+N4" | "INTERVIEW";
  durationMonths: number;
  durationHours: number;
  fee: number;
  discountedFee?: number;
  popular?: boolean;
  tagline: string;
  description: string;
  features: string[];
  includedBonuses: {
    title: string;
    days: number;
    value: number;
    description: string;
  }[];
  curriculum: {
    week: string;
    topic: string;
    focus: string;
  }[];
}

export interface Batch {
  id: string;
  name: string;
  code: string;
  courseId: string;
  courseTitle: string;
  branchId: string;
  branchName: string;
  teacherId: string;
  teacherName: string;
  deliveryMode: DeliveryMode;
  scheduleTime: string;
  startDate: string;
  seatsTotal: number;
  seatsBooked: number;
  meetingUrl?: string;
  classroomRoom?: string;
  status: "UPCOMING" | "RUNNING" | "COMPLETED";
}

export interface Enrollment {
  id: string;
  enrollmentNo: string;
  applicantName: string;
  phone: string;
  whatsapp: string;
  email: string;
  branchId: string;
  branchName: string;
  courseId: string;
  courseTitle: string;
  batchId?: string;
  batchName?: string;
  deliveryMode: DeliveryMode;
  visaCategory: VisaCategory;
  totalPayable: number;
  paidAmount: number;
  status: EnrollmentStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  transactionId?: string;
  highestDegree?: string;
  notes?: string;
  createdAt: string;
}

export interface Resource {
  id: string;
  title: string;
  type: "PDF" | "AUDIO" | "VIDEO" | "EXAM";
  courseLevel: "N5" | "N4" | "ALL";
  size: string;
  downloads: number;
  description: string;
  uploadedBy: string;
  uploadedAt: string;
  badge?: string;
}

export interface AttendanceRecord {
  id: string;
  batchId: string;
  studentId: string;
  studentName: string;
  date: string;
  status: "PRESENT" | "ABSENT" | "LATE";
  notes?: string;
}

export interface VisaMilestone {
  step: number;
  title: string;
  bnTitle: string;
  status: "COMPLETED" | "CURRENT" | "UPCOMING";
  date?: string;
  description: string;
}

// ------------------------------------------------------------------------------
// PRE-SEEDED CORE DATA
// ------------------------------------------------------------------------------

export const INITIAL_BRANCHES: Branch[] = [
  {
    id: "branch-dhaka-hq",
    name: "Dhaka Head Office (Naya Paltan)",
    code: "DHK-HQ",
    city: "Dhaka",
    address: "Sky View Trade Valley (8th Floor), 66/1 VIP Road, Naya Paltan, Dhaka-1000",
    phone: "+880 1805 013633",
    email: "info@knltc.com",
    totalStudents: 340,
  },
  {
    id: "branch-khulna",
    name: "Khulna Branch (Shibbari More)",
    code: "KHULNA-01",
    city: "Khulna",
    address: "Shibbari More, Khulna",
    phone: "+880 1805 013633",
    email: "info@knltc.com",
    totalStudents: 185,
  },
  {
    id: "branch-online-global",
    name: "Online Live Global Campus",
    code: "ONL-GLB",
    city: "Virtual",
    address: "Worldwide Interactive Zoom Live Classroom (https://npw.bd/knltc)",
    phone: "+880 1805 013633",
    email: "info@knltc.com",
    totalStudents: 410,
  },
];

export const INITIAL_COURSES: Course[] = [
  {
    id: "course-n5",
    title: "Japanese N5 Level Course (3 Months Intensive)",
    code: "N5-FOUNDATION",
    level: "N5",
    durationMonths: 3,
    durationHours: 120,
    fee: 12000,
    popular: true,
    tagline: "জাপান স্টুডেন্ট ও জব ভিসার প্রথম ও সবচেয়ে গুরুত্বপূর্ণ ধাপ",
    description:
      "হিরাগানা, কাতাকানা, ১০৩টি কাঞ্জি, মিন্না নো নিহোঙ্গো ১-২৫ অধ্যায় এবং JLPT N5 ও JFT-Basic পরীক্ষার ১০০% পরিপূর্ণ প্রস্তুতি। সাথে পাচ্ছেন সম্পূর্ণ বিনামূল্যে ১৫,০০০ টাকা মূল্যের ৩টি স্পেশাল ইন্টারভিউ ও সিভি বোনাস কোর্স।",
    features: [
      "Minna No Nihongo পাঠ্যবই ও লেকচার শিট সম্পূর্ণ ফ্রি",
      "হিরাগানা ও কাতাকানা নির্ভুল স্ট্রোক অর্ডার প্রশিক্ষণ",
      "১০৩টি বেসিক কাঞ্জি মেমোরি টেকনিক ও কুইজ",
      "নেটিভ জাপানি অডিও ট্র‍্যাক দিয়ে লিসেনিং ও স্পোকেন ড্রিলস",
      "JLPT N5 ও NAT-TEST স্ট্যান্ডার্ড ৫টি পূর্ণাঙ্গ মক টেস্ট",
      "অনলাইন রেকর্ডেড ক্লাস ব্যাকআপ ও লাইফটাইম স্টাডি ম্যাটেরিয়ালস",
    ],
    includedBonuses: [
      {
        title: "১৫ দিনের জাপানিজ এম্বাসি ইন্টারভিউ প্রিপারেশন কোর্স",
        days: 15,
        value: 6000,
        description: "এম্বাসির ভিসা অফিসারের সম্ভাব্য প্রশ্নাবলি, উত্তর সাজানো এবং লাইভ ক্যামেরা মক ইন্টারভিউ।",
      },
      {
        title: "১০ দিনের জাপানিজ রিজিউমি / সিভি (Rirekisho) রাইটিং কোর্স",
        days: 10,
        value: 4500,
        description: "জাপানি স্ট্যান্ডার্ড ফরম্যাটে 履歴書 ও 職務経歴書 নির্ভুলভাবে তৈরি করার হাতে-কলমে প্রশিক্ষণ।",
      },
      {
        title: "১০ দিনের পার্ট-টাইম জব (Baitō) ইন্টারভিউ ট্রেনিং",
        days: 10,
        value: 4500,
        description: "জাপানে পৌঁছার পর কনভিনিয়েন্স স্টোর ও রেস্তোরাঁয় কাজ পাওয়ার প্র্যাকটিক্যাল জাপানিজ কথোপকথন।",
      },
    ],
    curriculum: [
      { week: "সপ্তাহ ১ - ২", topic: "বর্ণমালা ও ধ্বনিতত্ত্ব", focus: "Hiragana, Katakana, Dakuon, Handakuon, Youon ও রোমাজি উচ্চারণ" },
      { week: "সপ্তাহ ৩ - ৫", topic: "Minna No Nihongo ১-৮", focus: "আত্মপরিচয় (Jikoshoukai), নামপদ ও ক্রিয়াপদ রূপান্তর, সংখ্যা ও সময়" },
      { week: "সপ্তাহ ৬ - ৮", topic: "Minna No Nihongo ৯-১৬", focus: "বিশেষণ (I-adj / Na-adj), দিকনির্দেশ, অবস্থান, পছন্দ ও অপছন্দ" },
      { week: "সপ্তাহ ৯ - ১০", topic: "Minna No Nihongo ১৭-২০", focus: "Te-form ক্রিয়ার রূপ, অনুরোধ, অনুমতি ও বর্তমান ঘটমান কাল" },
      { week: "সপ্তাহ ১১ - ১২", topic: "Minna No Nihongo ২১-২৫ + কাঞ্জি", focus: "মতামত প্রকাশ, অনুমান, শর্তযুক্ত বাক্য (Tara-form) ও ১০৩টি কাঞ্জি" },
      { week: "সপ্তাহ ১৩", topic: "মক টেস্ট ও সল্যুশন ক্লাস", focus: "JLPT N5 প্রশ্নব্যাংক সমাধান ও টাইম ম্যানেজমেন্ট প্র্যাকটিস" },
    ],
  },
  {
    id: "course-n4",
    title: "Japanese N4 Level Course (3 Months Intermediate)",
    code: "N4-INTERMEDIATE",
    level: "N4",
    durationMonths: 3,
    durationHours: 130,
    fee: 14500,
    tagline: "SSW জব ভিসা ও জাপানি বিশ্ববিদ্যালয়ে ডিরেক্ট এডমিশনের জন্য",
    description:
      "মিন্না নো নিহোঙ্গো ২৬-৫০ অধ্যায়, ২৫০+ অ্যাডভান্সড কাঞ্জি, কমপ্লেক্স গ্রামার প্যাটার্ন এবং কর্মক্ষেত্রে ফ্লুয়েন্ট কমিউনিকেশন। SSW কেয়ারগিভার, এগ্রিকালচার ও কনস্ট্রাকশন ইন্টারভিউয়ের পূর্ণাঙ্গ প্রস্তুতি।",
    features: [
      "Minna No Nihongo ২য় খণ্ড বই ও প্র্যাকটিস শিট ফ্রি",
      "২৫০+ মধ্যম স্তরের কাঞ্জি ও কম্পাউন্ড ওয়ার্ডস",
      "প্যাসিভ, কজেটিভ ও বিনীত কেইগো (Keigo) ব্যাকরণ",
      "SSW Job Interview স্পেশাল টেকনিক্যাল ভোকাবুলারি",
      "JFT-Basic / JLPT N4 স্ট্যান্ডার্ড ৬টি পূর্ণাঙ্গ মক টেস্ট",
      "জাপানি স্পিকারদের সাথে স্পোকেন ইন্টারঅ্যাকশন ক্লাস",
    ],
    includedBonuses: [
      {
        title: "SSW সেক্টর ভিত্তিক স্পেশাল টেকনিক্যাল ইন্টারভিউ কোর্স",
        days: 15,
        value: 7000,
        description: "কেয়ারগিভার, ফুড সার্ভিস এবং এগ্রিকালচার স্কিল টেস্টের স্পেশাল ভোকাবুলারি ও ইন্টারভিউ গাইড।",
      },
      {
        title: "বিজনেস জাপানিজ এটিকেট ও কেইগো ওয়ার্কশপ",
        days: 10,
        value: 5000,
        description: "জাপানি অফিসে সহকর্মীদের সাথে ভদ্র কথোপকথন ও ইমেইল লেখার নিয়মাবলি।",
      },
    ],
    curriculum: [
      { week: "সপ্তাহ ১ - ৩", topic: "Minna No Nihongo ২৬-৩২", focus: "কারণ ও ফলাফল প্রকাশ (N-desu), উপদেশ ও ভবিষ্যদ্বাণী" },
      { week: "সপ্তাহ ৪ - ৬", topic: "Minna No Nihongo ৩৩-৩৮", focus: "আদেশ ও নিষেধাজ্ঞা, নামপদায়ন (Koto / No), প্যাসিভ ভয়েস" },
      { week: "সপ্তাহ ৭ - ৯", topic: "Minna No Nihongo ৩৯-৪৫", focus: "কারণ প্রকাশ (node/te), সম্মানসূচক ভঙ্গি ও উদ্দেশ্য (tame ni)" },
      { week: "সপ্তাহ ১০ - ১২", topic: "Minna No Nihongo ৪৬-৫০", focus: "কেইগো (Sonkeigo / Kenjougo), কাজের শিষ্টাচার ও ২৫০টি কাঞ্জি" },
      { week: "সপ্তাহ ১৩", topic: "JFT-Basic ও JLPT N4 মক টেস্ট", focus: "কম্পিউটার বেইজড টেস্ট (CBT) প্র্যাকটিস ও স্পিড ড্রিল" },
    ],
  },
  {
    id: "course-combo",
    title: "N5 + N4 Complete Career Mastery Combo",
    code: "N5-N4-COMBO",
    level: "N5+N4",
    durationMonths: 6,
    durationHours: 250,
    fee: 24000,
    discountedFee: 21500,
    popular: false,
    tagline: "জিরো থেকে সরাসরি জাপান যাত্রার ফুল-স্ট্যাক প্রস্তুতি",
    description:
      "একই কোর্সে N5 ও N4 কমপ্লিট কভারেজ। বর্ণমালা থেকে শুরু করে জাপানি জব ইন্টারভিউতে সফল হওয়া পর্যন্ত সব ধাপ কভার করা হয়। সবচেয়ে জনপ্রিয় ও সাশ্রয়ী অল-ইন-ওয়ান প্যাকেজ।",
    features: [
      "৬ মাসের সম্পূর্ণ নিবিড় মেন্টরশিপ ও সুপারভিশন",
      "সব পাঠ্যবই, কাঞ্জি নোট ও ড্রিল শিট ফ্রি ডেলিভারি",
      "৩৫০+ কাঞ্জি ও ১৫০০+ জাপানি শব্দের শক্ত দখল",
      "স্টুডেন্ট ও SSW দুই ধরনের ভিসার জন্যই উপযুক্ত",
      "সব মিলিয়ে ১০টি পূর্ণাঙ্গ মক টেস্ট ও ব্যক্তিগত কাউন্সেলিং",
    ],
    includedBonuses: [
      {
        title: "কমপ্লিট ভিসা ডকুমেন্টেশন চেকলিস্ট অডিট",
        days: 20,
        value: 10000,
        description: "COE আবেদন এবং ব্যাংক স্পনসরশিপ পেপারস নিখুঁত করার এক্সক্লুসিভ গাইডলাইন।",
      },
    ],
    curriculum: [
      { week: "মাস ১ - ৩", topic: "N5 ফাউন্ডেশন ও শব্দভাণ্ডার", focus: "মিন্না নো নিহোঙ্গো ১-২৫, ১০৩ কাঞ্জি ও N5 মক টেস্ট" },
      { week: "মাস ৪ - ৫", topic: "N4 ব্যাকরণ ও কেইগো", focus: "মিন্না নো নিহোঙ্গো ২৬-৫০, ২৫০ কাঞ্জি ও লিসেনিং ফ্লুয়েন্সি" },
      { week: "মাস ৬", topic: "ইন্টারভিউ ও এক্সাম ড্রিল", focus: "JFT-Basic/JLPT N4 টেস্ট এবং ভিসা ইন্টারভিউ মাস্টারক্লাস" },
    ],
  },
];

export const INITIAL_BATCHES: Batch[] = [];

export const INITIAL_ENROLLMENTS: Enrollment[] = [];

export const INITIAL_RESOURCES: Resource[] = [];

export const STUDENT_VISA_MILESTONES: VisaMilestone[] = [
  {
    step: 1,
    title: "N5 Language Training",
    bnTitle: "জাপানি ভাষা N5 কোর্স",
    status: "CURRENT",
    date: "Running (Week 4 of 12)",
    description: "মিন্না নো নিহোঙ্গো অধ্যায়ভিত্তিক ক্লাস, সাপ্তাহিক কুইজ ও কাঞ্জি প্র্যাকটিস চলমান।",
  },
  {
    step: 2,
    title: "JLPT / NAT Exam Certification",
    bnTitle: "অফিসিয়াল ভাষা পরীক্ষা পাস",
    status: "UPCOMING",
    date: "Target: Dec 2026",
    description: "JLPT N5 অথবা NAT-TEST 5Q পরীক্ষায় অংশ নিয়ে অফিসিয়াল সার্টিফিকেট অর্জন।",
  },
  {
    step: 3,
    title: "School / Employer Matching",
    bnTitle: "জাপানি স্কুল / কোম্পানি সিলেকশন",
    status: "UPCOMING",
    date: "Jan 2027",
    description: "পছন্দের শহর (টোকিও/ওসাকা/নাগোয়া) অনুযায়ী স্বীকৃত ল্যাঙ্গুয়েজ স্কুল নির্বাচন।",
  },
  {
    step: 4,
    title: "COE Application Filing",
    bnTitle: "জাপান ইমিগ্রেশনে COE আবেদন",
    status: "UPCOMING",
    date: "Feb 2027",
    description: "সার্টিফিকেট অফ এলিজিবিলিটি (COE)-র জন্য ব্যাংক সলভেন্সি ও একাডেমিক ফাইল জমা।",
  },
  {
    step: 5,
    title: "Embassy Visa Stamping & Departure",
    bnTitle: "এম্বাসি ইন্টারভিউ ও ফ্লাই",
    status: "UPCOMING",
    date: "March - April 2027",
    description: "ভিএফএস গ্লোবালে ভিসা স্ট্যাম্পিং, প্রি-ডিপার্চার ওরিয়েন্টেশন ও জাপানে যাত্রা।",
  },
];

// ------------------------------------------------------------------------------
// GLOBAL STORE & HELPER FUNCTIONS
// ------------------------------------------------------------------------------

interface PortalStore {
  branches: Branch[];
  courses: Course[];
  batches: Batch[];
  enrollments: Enrollment[];
  resources: Resource[];
  activeRole: UserRole;
}

const globalForPortal = globalThis as unknown as {
  __knltc_portal_store?: PortalStore;
};

if (!globalForPortal.__knltc_portal_store) {
  globalForPortal.__knltc_portal_store = {
    branches: [...INITIAL_BRANCHES],
    courses: [...INITIAL_COURSES],
    batches: [...INITIAL_BATCHES],
    enrollments: [...INITIAL_ENROLLMENTS],
    resources: [...INITIAL_RESOURCES],
    activeRole: "MAIN_ADMIN",
  };
}

export function getPortalStore(): PortalStore {
  return globalForPortal.__knltc_portal_store!;
}

export function addEnrollment(data: {
  applicantName: string;
  phone: string;
  whatsapp: string;
  email: string;
  branchId: string;
  courseId: string;
  deliveryMode: DeliveryMode;
  visaCategory: VisaCategory;
  highestDegree?: string;
  notes?: string;
}): Enrollment {
  const store = getPortalStore();
  const branch = store.branches.find((b) => b.id === data.branchId) || store.branches[0];
  const course = store.courses.find((c) => c.id === data.courseId) || store.courses[0];
  const count = store.enrollments.length + 85;
  const enrollmentNo = `KNLTC-2026-${String(count).padStart(3, "0")}`;

  const newEnrollment: Enrollment = {
    id: `enr-${Date.now()}`,
    enrollmentNo,
    applicantName: data.applicantName,
    phone: data.phone,
    whatsapp: data.whatsapp || data.phone,
    email: data.email,
    branchId: branch.id,
    branchName: branch.name,
    courseId: course.id,
    courseTitle: course.title,
    deliveryMode: data.deliveryMode,
    visaCategory: data.visaCategory,
    totalPayable: course.discountedFee || course.fee,
    paidAmount: 0,
    status: "PENDING",
    paymentStatus: "PENDING",
    highestDegree: data.highestDegree,
    notes: data.notes,
    createdAt: new Date().toISOString(),
  };

  store.enrollments.unshift(newEnrollment);
  return newEnrollment;
}

export function updateEnrollmentStatus(
  enrollmentId: string,
  status: EnrollmentStatus,
  batchId?: string
): Enrollment | null {
  const store = getPortalStore();
  const enrollment = store.enrollments.find((e) => e.id === enrollmentId);
  if (!enrollment) return null;

  enrollment.status = status;
  if (batchId) {
    const batch = store.batches.find((b) => b.id === batchId);
    if (batch) {
      enrollment.batchId = batch.id;
      enrollment.batchName = batch.name;
      batch.seatsBooked = Math.min(batch.seatsTotal, batch.seatsBooked + 1);
    }
  }
  return enrollment;
}

export function updatePaymentStatus(
  enrollmentId: string,
  paymentStatus: PaymentStatus,
  paidAmount?: number,
  method?: PaymentMethod,
  transactionId?: string
): Enrollment | null {
  const store = getPortalStore();
  const enrollment = store.enrollments.find((e) => e.id === enrollmentId);
  if (!enrollment) return null;

  enrollment.paymentStatus = paymentStatus;
  if (paidAmount !== undefined) enrollment.paidAmount = paidAmount;
  if (method) enrollment.paymentMethod = method;
  if (transactionId) enrollment.transactionId = transactionId;

  if (paymentStatus === "VERIFIED" && enrollment.status === "PENDING") {
    enrollment.status = "APPROVED";
  }
  return enrollment;
}
