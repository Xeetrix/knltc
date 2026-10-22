import { Language } from "@/lib/i18n";

export interface DashboardDictionary {
  loading: string;
  topBanner: string;
  leadership: string;
  hotline: string;
  lmsBtn: string;
  branchLabel: string;
  allBranches: string;
  dhakaHq: string;
  khulnaBranch: string;
  viewRoleLabel: string;
  publicWebsite: string;
  toastSuccess: string;
  languageLabel: string;
  roles: {
    mainAdmin: string;
    branchAdmin: string;
    teleCounselor: string;
    teacher: string;
    b2bAgent: string;
    investor: string;
    student: string;
  };
  tabs: {
    overview: string;
    crm: string;
    visa: string;
    lms: string;
    b2b: string;
    finance: string;
    hr: string;
    cms: string;
    storeBlog: string;
  };
  kpi: {
    liveHub: string;
    integrated: string;
    overviewTitle: string;
    overviewSub: string;
    addLeadBtn: string;
    viewPipelineBtn: string;
    totalLeads: string;
    metaSubtitle: string;
    activeStudents: string;
    lmsSubtitle: string;
    inProcessVisas: string;
    aprilIntake: string;
    expectedCommission: string;
    yenCommissionSub: string;
    monthlyCashFlow: string;
    marginSub: string;
  };
  module1: {
    chartTitle: string;
    chartSubtitle: string;
    fiscalYear: string;
    chartMilestones: [string, string, string, string];
    grossProjection: string;
    grossDesc: string;
    operationalCost: string;
    operationalDesc: string;
    netProfit: string;
    netProfitDesc: string;
    sswBadge: string;
    sswTitle: string;
    sswDesc: string;
    sswSeats: string;
    sswEnrolled: string;
    sswButton: string;
    partnerBadge: string;
    partnerLocation: string;
    partnerTitle: string;
    partnerDesc: string;
    partnerFiles: string;
    partnerCommission: string;
  };
  crm: {
    title: string;
    subtitle: string;
    quickAddBtn: string;
    colCandidate: string;
    colSource: string;
    colEducation: string;
    colCounselor: string;
    colStatus: string;
    colAction: string;
    cityLabel: string;
    gapLabel: string;
    statuses: {
      NEW: string;
      CONTACTED: string;
      COUNSELED: string;
      OFFICE_VISIT_BOOKED: string;
      ADMITTED: string;
      ARCHIVED: string;
    };
  };
  visa: {
    calcTitle: string;
    calcSubtitle: string;
    minGpa: string;
    gpaReq: string;
    ageLabel: string;
    gapLabel: string;
    eligibleTitle: string;
    eligibleDesc: string;
    sponsorTitle: string;
    sponsorSubtitle: string;
    bankSupportBadge: string;
    sponsorApprovedTitle: string;
    sponsorApprovedDesc: string;
    sponsorPhoneReq: string;
    sponsorPhoneDesc: string;
    bankSolvencyTitle: string;
    bankSolvencyDesc: string;
    approvedBanksTitle: string;
    approvedBanksDesc: string;
    pipelineTitle: string;
    pipelineSubtitle: string;
    dragActive: string;
    stages: Array<{ stage: number; name: string; desc: string }>;
    packageRegular: string;
    packagePremium: string;
    sessionPrefix: string;
    sponsorPrefix: string;
    underReview: string;
    nextStageBtn: string;
    noApplicants: string;
  };
  lms: {
    title: string;
    subtitle: string;
    npwClassroom: string;
    irodoriPortal: string;
    courseFeeTitle: string;
    courseFeeDesc: string;
    portalFeeTitle: string;
    portalFeeDesc: string;
    netMarginTitle: string;
    netMarginDesc: string;
    tableHeading: string;
    issueAccountBtn: string;
    colStudent: string;
    colCourse: string;
    colCredentials: string;
    colMargin: string;
    colProgress: string;
    colAction: string;
    completed: string;
    sendWaBtn: string;
  };
  b2b: {
    title: string;
    subtitle: string;
    commissionBadge: string;
    contactPerson: string;
    commissionRate: string;
    activeStudents: string;
    totalEarned: string;
    ledgerTitle: string;
    colAgent: string;
    colTypeCity: string;
    colReferred: string;
    colSuccessfulVisas: string;
    colAgreedCommission: string;
    colPaidVsPending: string;
    studentsSuffix: string;
    paidPrefix: string;
    pendingPrefix: string;
  };
  finance: {
    auditBadge: string;
    title: string;
    subtitle: string;
    capitalLabel: string;
    pillar1Title: string;
    pillar1Desc: string;
    pillar2Title: string;
    pillar2Desc: string;
    pillar3Title: string;
    pillar3Desc: string;
    pillar4Title: string;
    pillar4Desc: string;
    scenarioTitle: string;
    scen1Badge: string;
    scen1Gross: string;
    scen1Share: string;
    scen1Return: string;
    scen2Badge: string;
    scen2Gross: string;
    scen2Share: string;
    scen2Return: string;
    scen3Badge: string;
    scen3Gross: string;
    scen3Share: string;
    scen3Return: string;
    legalText: string;
    legalBadge: string;
    billingTitle: string;
    billingSubtitle: string;
    recordPaymentBtn: string;
    colReceiptDate: string;
    colStudentDesc: string;
    colPackageType: string;
    colMethodTrx: string;
    colBranch: string;
    colAmount: string;
  };
  hr: {
    title: string;
    subtitle: string;
    bonusBadge: string;
    colNameRole: string;
    colLocation: string;
    colCallsTarget: string;
    colAdmissions: string;
    colBaseSalary: string;
    colBonus: string;
    colTotalPay: string;
    callsSuffix: string;
  };
  cms: {
    cmsBadge: string;
    title: string;
    subtitle: string;
    saveBtn: string;
    section1Title: string;
    topBarLabel: string;
    popupLabel: string;
    heroLabel: string;
    pixelLabel: string;
    section2Title: string;
    n5PriceLabel: string;
    n4PriceLabel: string;
    comboPriceLabel: string;
    lessonsTableTitle: string;
    colLessonNo: string;
    colLessonTitle: string;
    colLessonCategory: string;
    colWordsCount: string;
    colAction: string;
    activeBadge: string;
    section3Title: string;
    regularTitle: string;
    regularLabel: string;
    regularDesc: string;
    premiumTitle: string;
    premiumLabel: string;
    premiumDesc: string;
    section4Title: string;
    newCircularBtn: string;
    japanLocation: string;
    salaryPrefix: string;
    liveActive: string;
    draft: string;
    section5Title: string;
    pendingOrdersPrefix: string;
    colOrderCustomer: string;
    colItemsAddress: string;
    colDeliveryArea: string;
    colPaymentMethod: string;
    colTotalPrice: string;
    colStatus: string;
    orderStatuses: {
      PENDING: string;
      PROCESSING: string;
      SHIPPED: string;
      DELIVERED: string;
      CANCELLED: string;
    };
  };
}

export const dashboardDictionaries: Record<Language, DashboardDictionary> = {
  en: {
    loading: "Loading KNLTC Command Center...",
    topBanner: "KNLTC Education & Career Command Center (Dhaka & Khulna)",
    leadership: "MD: Sheikh Baset • Senior Sensei: Amir Hossain",
    hotline: "Hotline: +880 1805 013633",
    lmsBtn: "LMS Portal",
    branchLabel: "Branch:",
    allBranches: "All Branches",
    dhakaHq: "Dhaka HQ",
    khulnaBranch: "Khulna Branch",
    viewRoleLabel: "Role View:",
    publicWebsite: "Public Website",
    toastSuccess: "Changes saved and updated live on the website!",
    languageLabel: "Language:",
    roles: {
      mainAdmin: "👑 Main Admin (Sheikh Baset)",
      branchAdmin: "🏢 Branch Admin (Dhaka / Khulna)",
      teleCounselor: "📞 Tele-Counselor (Remote)",
      teacher: "🎓 Japanese Sensei (Amir Hossain)",
      b2bAgent: "🤝 B2B Agent (Nexus / BWBS)",
      investor: "💼 Investor Portal (Open-Book)",
      student: "🎒 Student & Visa Progress",
    },
    tabs: {
      overview: "Overview",
      crm: "CRM & Counseling",
      visa: "Visa Kanban",
      lms: "Language & LMS",
      b2b: "B2B & Partner Schools",
      finance: "Finance & Investor",
      hr: "HR & Payroll",
      cms: "Website CMS",
      storeBlog: "Bookstore, Orders & Blog",
    },
    kpi: {
      liveHub: "Live Command Hub",
      integrated: "Dhaka & Khulna Integrated",
      overviewTitle: "Executive Overview & Real-Time Business Analytics",
      overviewSub: "Unified master dashboard for Japan Student Visa, SSW 16 sectors, and Japanese language programs.",
      addLeadBtn: "Add New Lead",
      viewPipelineBtn: "View Visa Pipeline",
      totalLeads: "Total Active Leads",
      metaSubtitle: "Meta Ads & WhatsApp Inquiries",
      activeStudents: "Active Language Students",
      lmsSubtitle: "npw.bd/knltc & Offline Batches",
      inProcessVisas: "In-Process Visa Files",
      aprilIntake: "April 2027 Intake",
      expectedCommission: "Projected School Commission",
      yenCommissionSub: "80,000 Yen per enrolled student",
      monthlyCashFlow: "Monthly Net Cash Flow",
      marginSub: "Admission Fee & Visa Success Margin",
    },
    module1: {
      chartTitle: "Annual Financial Projection vs Live Performance",
      chartSubtitle: "Calculated across Regular (৳1.2L) and Premium (৳11L) packages",
      fiscalYear: "FY 2026–2027",
      chartMilestones: [
        "May 2026 (Foundation)",
        "July Intake Delivery",
        "October Intake Growth",
        "January 2027 Target",
      ],
      grossProjection: "Total Gross Revenue Projection",
      grossDesc: "30–40 successful visa files",
      operationalCost: "Total Operational Expenses",
      operationalDesc: "Office rent, marketing & Sensei payroll",
      netProfit: "Expected Net Profit",
      netProfitDesc: "10% Investor Share: ৳3.6 Lakh",
      sswBadge: "Special Recruitment Campaign",
      sswTitle: "SSW Construction Special Batch (JLPT N4 Passed)",
      sswDesc: "Candidates who passed N4 get 100% free food, lodging & practical skill test training in Dhaka.",
      sswSeats: "Total Seats: 25 Candidates",
      sswEnrolled: "Enrolled: 18 Students",
      sswButton: "Process Campaign Leads",
      partnerBadge: "Partner Japanese School",
      partnerLocation: "Hiroshima",
      partnerTitle: "HLA Gakuin (Hiroshima)",
      partnerDesc: "Principal Keiko Fujii & Mr. Donaka",
      partnerFiles: "Active Files: 18 Students",
      partnerCommission: "Commission: ¥1,440,000",
    },
    crm: {
      title: "Omni-Channel CRM & Tele-Counselor Workspace",
      subtitle: "Call logging and follow-ups for candidates from Facebook Meta Ads, WhatsApp, and web forms.",
      quickAddBtn: "Quick Add New Lead",
      colCandidate: "Candidate Name & Contact",
      colSource: "Source & Interest",
      colEducation: "Education & Japanese Level",
      colCounselor: "Counselor & Branch",
      colStatus: "Current Status",
      colAction: "WhatsApp & Action",
      cityLabel: "City",
      gapLabel: "Gap",
      statuses: {
        NEW: "New Lead",
        CONTACTED: "Contacted / Called",
        COUNSELED: "Counseled",
        OFFICE_VISIT_BOOKED: "Office Visit Booked",
        ADMITTED: "Admission Confirmed",
        ARCHIVED: "Archived / Inactive",
      },
    },
    visa: {
      calcTitle: "Automated Eligibility Engine",
      calcSubtitle: "Japan Immigration & Ministry of Justice Standards",
      minGpa: "Minimum SSC / HSC GPA:",
      gpaReq: "Minimum 2.50 required",
      ageLabel: "Candidate Age (Max 30 yrs):",
      gapLabel: "Study Gap (Max 5–6 yrs):",
      eligibleTitle: "100% Eligible Candidate (No IELTS Required)",
      eligibleDesc: "With JLPT N5 proficiency, direct school selection and submission can begin immediately.",
      sponsorTitle: "Nexus Standard Sponsor & Bank Solvency Guidelines",
      sponsorSubtitle: "Ministry of Justice Requirements",
      bankSupportBadge: "Bank Loan Assistance Available",
      sponsorApprovedTitle: "Approved Sponsor Categories:",
      sponsorApprovedDesc: "Father, Mother, or Elder Sibling (Any 1 valid legal sponsor).",
      sponsorPhoneReq: "2 Distinct Sponsor Phone Numbers Required",
      sponsorPhoneDesc: "For immigration telephone verification from Japan.",
      bankSolvencyTitle: "18 Lakh BDT Bank Solvency:",
      bankSolvencyDesc: "Past 1 year bank statement and 3 years tax return documents.",
      approvedBanksTitle: "Recommended Approved Banks:",
      approvedBanksDesc: "Agrani Bank, Social Islami Bank, Pubali Bank, and Janata Bank.",
      pipelineTitle: "10-Step Full-Stack Visa Kanban Pipeline",
      pipelineSubtitle: "From File Opening (৳0 advance) to Pre-Visa (COE), Embassy, and Japan Landing.",
      dragActive: "Direct Stage Drag & Next Stage Promotion Active",
      stages: [
        { stage: 1, name: "1. File Opening", desc: "৳0 Advance Service Charge" },
        { stage: 2, name: "2. Language Prep", desc: "N5/N4 & Irodori Training" },
        { stage: 3, name: "3. Translation", desc: "Notary & Certificate Attestation" },
        { stage: 4, name: "4. School Interview", desc: "Direct HLA Gakuin Zoom Session" },
        { stage: 5, name: "5. COE Filing", desc: "Submission to Japan Immigration" },
        { stage: 6, name: "6. Pre-Visa (COE)", desc: "Immigration Approval Issued" },
        { stage: 7, name: "7. Tuition Payment", desc: "Direct Fee Transfer to School" },
        { stage: 8, name: "8. Embassy & VFS", desc: "Visa Interview & Passport Deposit" },
        { stage: 9, name: "9. Visa Stamped", desc: "Service Charge Paid & Visa Affixed" },
        { stage: 10, name: "10. Japan Landing", desc: "Airport Pickup & Part-time Job Support" },
      ],
      packageRegular: "Regular",
      packagePremium: "Premium",
      sessionPrefix: "Intake:",
      sponsorPrefix: "Sponsor:",
      underReview: "Under Review",
      nextStageBtn: "Next Stage",
      noApplicants: "No applicants in this stage",
    },
    lms: {
      title: "Language Courses & External LMS (npw.bd/knltc) Bridge",
      subtitle: "N5, N4 & Irodori enrollments, automated credential distribution, and teacher lesson tools.",
      npwClassroom: "NPW LMS Classroom",
      irodoriPortal: "Irodori Portal",
      courseFeeTitle: "Course Fee (per student)",
      courseFeeDesc: "3-Month Intensive N5 or N4 Course",
      portalFeeTitle: "External LMS Platform Fee",
      portalFeeDesc: "npw.bd server & bandwidth cost",
      netMarginTitle: "KNLTC Net Organization Margin",
      netMarginDesc: "83.3% High Profit Margin",
      tableHeading: "Enrolled Students LMS Accounts & Password Log",
      issueAccountBtn: "Issue New LMS Account",
      colStudent: "Student & Enrollment",
      colCourse: "Course & Batch",
      colCredentials: "LMS Username & Password",
      colMargin: "Margin Breakdown",
      colProgress: "Progress",
      colAction: "Send WhatsApp",
      completed: "Completed",
      sendWaBtn: "1-Click Send",
    },
    b2b: {
      title: "B2B Channel, Japanese Schools & International Partners",
      subtitle: "Hiroshima HLA Gakuin, Nexus Group & Global Partners commission ledger and recruitment tracking.",
      commissionBadge: "Commission per Student: 80,000 Yen (~60,000–64,000 BDT)",
      contactPerson: "Key Contact:",
      commissionRate: "Commission Rate:",
      activeStudents: "Active Students:",
      totalEarned: "Total Earned Commission:",
      ledgerTitle: "Nexus Group, BWBS & Campus Ambassador Commission Ledger",
      colAgent: "Agent / Partner Organization",
      colTypeCity: "Type & City",
      colReferred: "Referred Students",
      colSuccessfulVisas: "Successful Visas",
      colAgreedCommission: "Agreed Commission",
      colPaidVsPending: "Paid vs Pending",
      studentsSuffix: "Students",
      paidPrefix: "Paid:",
      pendingPrefix: "Pending:",
    },
    finance: {
      auditBadge: "10 Lakh BDT Investor Open-Book Audit Portal (100% Halal Profit-Sharing Model)",
      title: "Capital Allocation, Security Guarantees & Real-Time Dividend Calculator",
      subtitle: "10% net profit-sharing audited under 300 BDT government stamp agreement and bank security cheques.",
      capitalLabel: "Initial Capital Investment:",
      pillar1Title: "1. Coaching & Lab Setup (30%)",
      pillar1Desc: "Multimedia classroom & sound lab",
      pillar2Title: "2. Digital Marketing & Leads (20%)",
      pillar2Desc: "Meta Ads & direct application funnels",
      pillar3Title: "3. Operational Runway (30%)",
      pillar3Desc: "6 months office rent & staff payroll",
      pillar4Title: "4. Emergency Safety Reserve (20%)",
      pillar4Desc: "Bank security reserve fund",
      scenarioTitle: "Annual Profit-Sharing Projections vs Live Target",
      scen1Badge: "Conservative Scenario (20 Visas)",
      scen1Gross: "Gross Profit: ৳24,00,000",
      scen1Share: "Investor Share: ৳2,40,000",
      scen1Return: "24% Annual Return",
      scen2Badge: "Realistic Target (30 Visas)",
      scen2Gross: "Gross Profit: ৳36,00,000",
      scen2Share: "Investor Share: ৳3,60,000",
      scen2Return: "36% Annual Halal Profit",
      scen3Badge: "Maximum Potential (40 Visas)",
      scen3Gross: "Gross Profit: ৳48,00,000",
      scen3Share: "Investor Share: ৳4,80,000",
      scen3Return: "48% Annual Return",
      legalText: "Legal Protection: 300 BDT official govt stamp agreement & Islami Bank security cheque #IBBL-CHQ-9948201",
      legalBadge: "10% Fixed Dividend Agreement",
      billingTitle: "Regular (৳1,20,000) & Premium (৳11,00,000) Package Billing",
      billingSubtitle: "bKash, Nagad, Bank, and Gateway Payment Tracker",
      recordPaymentBtn: "Record Payment Entry",
      colReceiptDate: "Receipt & Date",
      colStudentDesc: "Student / Description",
      colPackageType: "Package / Payment Type",
      colMethodTrx: "Method & Trx ID",
      colBranch: "Branch",
      colAmount: "Amount (BDT)",
    },
    hr: {
      title: "HR & Remote Female Tele-Counselor Payroll",
      subtitle: "Call targets (600 calls/month), confirmed admission bonuses (৳1,000/student), and salary sheet.",
      bonusBadge: "Performance Bonus: ৳1,000 per confirmed enrollment",
      colNameRole: "Staff Name & Role",
      colLocation: "Location",
      colCallsTarget: "Monthly Calls: Target vs Actual",
      colAdmissions: "Admissions Achieved",
      colBaseSalary: "Base Salary",
      colBonus: "Performance Bonus",
      colTotalPay: "Total Net Payable",
      callsSuffix: "calls",
    },
    cms: {
      cmsBadge: "100% Dynamic Website CMS (knltc.com)",
      title: "Manage All Pages & Live Content Without Writing Code",
      subtitle: "Update top banner, hero section, Japanese language lessons, visa packages, job circulars & book store.",
      saveBtn: "Save CMS Changes",
      section1Title: "1. Global Top Announcement & Pop-up Banner",
      topBarLabel: "Top Bar Announcement:",
      popupLabel: "Pop-up Banner Headline:",
      heroLabel: "Homepage Hero Headline:",
      pixelLabel: "Facebook Meta Pixel ID:",
      section2Title: "2. Japanese Language Page & Lessons Editor (/japanese-language)",
      n5PriceLabel: "N5 Course Fee (BDT):",
      n4PriceLabel: "N4 Course Fee (BDT):",
      comboPriceLabel: "N5+N4 Combo Course Fee (BDT):",
      lessonsTableTitle: "Minna no Nihongo Lesson List (Vocabulary & Grammar)",
      colLessonNo: "Lesson #",
      colLessonTitle: "Title",
      colLessonCategory: "Category",
      colWordsCount: "Vocabulary Count",
      colAction: "Status",
      activeBadge: "Active",
      section3Title: "3. Student Visa Packages & Terms (/study-in-japan)",
      regularTitle: "Regular Package",
      regularLabel: "Service Charge (Payable after visa approval):",
      regularDesc: "Zero advance file opening fee. Student covers tuition fee and airfare.",
      premiumTitle: "Premium Package (All-Inclusive)",
      premiumLabel: "Total Package Price (Including tuition and airfare):",
      premiumDesc: "10% refundable guarantee. 1st year tuition and flight covered by KNLTC.",
      section4Title: "4. Job Circulars & SSW Campaign Manager (/work-in-japan)",
      newCircularBtn: "Publish New Circular",
      japanLocation: "Japan Location:",
      salaryPrefix: "Salary:",
      liveActive: "Live Active",
      draft: "Draft",
      section5Title: "5. Book Store & Customer Orders (/store, /cart, /checkout)",
      pendingOrdersPrefix: "Pending Orders:",
      colOrderCustomer: "Order # & Customer",
      colItemsAddress: "Items & Address",
      colDeliveryArea: "Delivery Area",
      colPaymentMethod: "Payment Method",
      colTotalPrice: "Total Price",
      colStatus: "Order Status",
      orderStatuses: {
        PENDING: "Pending",
        PROCESSING: "Processing",
        SHIPPED: "Shipped",
        DELIVERED: "Delivered",
        CANCELLED: "Cancelled",
      },
    },
  },
  bn: {
    loading: "KNLTC কমান্ড সেন্টার লোড হচ্ছে...",
    topBanner: "KNLTC সেন্ট্রাল এডুকেশন ও ক্যারিয়ার কমান্ড সেন্টার (ঢাকা ও খুলনা)",
    leadership: "এমডি: শেখ বাসেত • প্রধান সেন্সি: আমির হোসেন",
    hotline: "হটলাইন: +880 1805 013633",
    lmsBtn: "LMS পোর্টাল",
    branchLabel: "শাখা:",
    allBranches: "সব শাখা",
    dhakaHq: "ঢাকা হেড অফিস",
    khulnaBranch: "খুলনা শাখা",
    viewRoleLabel: "ভিউ মোড:",
    publicWebsite: "পাবলিক ওয়েবসাইট",
    toastSuccess: "সব পরিবর্তন সফলভাবে সেভ হয়েছে এবং ওয়েবসাইটে কার্যকর হয়েছে!",
    languageLabel: "ভাষা:",
    roles: {
      mainAdmin: "👑 মেইন এডমিন (শেখ বাসেত)",
      branchAdmin: "🏢 ব্রাঞ্চ এডমিন (ঢাকা/খুলনা)",
      teleCounselor: "📞 টেলি-কাউন্সেলর (রিমোট)",
      teacher: "🎓 শিক্ষক / সেন্সি (আমির হোসেন)",
      b2bAgent: "🤝 বিটুবি এজেন্ট (Nexus / BWBS)",
      investor: "💼 ইনভেস্টর পোর্টাল (Open-Book)",
      student: "🎒 শিক্ষার্থী ও ভিসা ট্র্যাকার",
    },
    tabs: {
      overview: "ওভারভিউ",
      crm: "CRM ও কাউন্সেলিং",
      visa: "ভিসা Kanban",
      lms: "ভাষা কোর্স ও LMS",
      b2b: "বিটুবি ও জাপানি স্কুল",
      finance: "ফাইন্যান্স ও ইনভেস্টর",
      hr: "HR ও পে-রোল",
      cms: "ওয়েবসাইট সিএমএস",
      storeBlog: "বুক স্টোর, অর্ডার ও ব্লগ",
    },
    kpi: {
      liveHub: "লাইভ কমান্ড হাব",
      integrated: "ঢাকা ও খুলনা সমন্বিত",
      overviewTitle: "এক্সিকিউটিভ ওভারভিউ ও রিয়েল-টাইম বিজনেস এনালাইটিক্স",
      overviewSub: "জাপান স্টুডেন্ট ভিসা, SSW ১৬টি খাত ও ভাষা প্রশিক্ষণ কার্যক্রমের একক সেন্ট্রাল ড্যাশবোর্ড।",
      addLeadBtn: "নতুন লিড যুক্ত করুন",
      viewPipelineBtn: "ভিসা পাইপলাইন দেখুন",
      totalLeads: "মোট সক্রিয় লিড",
      metaSubtitle: "মেটা অ্যাডস ও হোয়াটসঅ্যাপ লিড",
      activeStudents: "চলমান ভাষা শিক্ষার্থী",
      lmsSubtitle: "npw.bd/knltc ও অফলাইন ব্যাচ",
      inProcessVisas: "চলমান ভিসা প্রসেসিং",
      aprilIntake: "এপ্রিল ২০২৭ ইনটেক",
      expectedCommission: "প্রত্যাশিত স্কুল কমিশন",
      yenCommissionSub: "স্টুডেন্ট পিছু ৮০,০০০ ইয়েন",
      monthlyCashFlow: "মাসিক নিট ক্যাশ-ফ্লো",
      marginSub: "ভর্তি ফি ও ভিসা সাকসেস মার্জিন",
    },
    module1: {
      chartTitle: "বাৎসরিক আর্থিক প্রজেকশন বনাম লাইভ পারফরম্যান্স",
      chartSubtitle: "রেগুলার (৳১.২ লক্ষ) ও প্রিমিয়াম (৳১১ লক্ষ) প্যাকেজ ভিত্তিক হিসাব",
      fiscalYear: "২০২৬–২০২৭ অর্থবছর",
      chartMilestones: [
        "মে ২০২৬ (ভিত্তি সেশন)",
        "জুলাই ইনটেক ডেলিভারি",
        "অক্টোবর ইনটেক বৃদ্ধি",
        "জানুয়ারি ২০২৭ লক্ষ্যমাত্রা",
      ],
      grossProjection: "মোট গ্রস রেভিনিউ প্রজেকশন",
      grossDesc: "৩০-৪০টি ভিসা ফাইল সাকসেস",
      operationalCost: "মোট অপারেশনাল খরচ",
      operationalDesc: "অফিস রেন্ট, মার্কেটিং ও সেন্সি বেতন",
      netProfit: "প্রত্যাশিত নিট মুনাফা",
      netProfitDesc: "১০% ইনভেস্টর শেয়ার: ৳৩.৬ লক্ষ",
      sswBadge: "স্পেশাল রিক্রুটমেন্ট ক্যাম্পেইন",
      sswTitle: "SSW কনস্ট্রাকশন স্পেশাল ব্যাচ (JLPT N4 পাস)",
      sswDesc: "যারা N4 পাস করেছেন, ঢাকায় KNLTC সেন্টারে সম্পূর্ণ বিনামূল্যে থাকা-খাওয়া ও প্র্যাকটিক্যাল স্কিল টেস্ট প্রস্তুতি।",
      sswSeats: "আসন সংখ্যা: ২৫ জন",
      sswEnrolled: "ভর্তি: ১৮ জন",
      sswButton: "ক্যাম্পেইন লিড প্রসেস করুন",
      partnerBadge: "জাপানি পার্টনার স্কুল",
      partnerLocation: "হিরোশিমা",
      partnerTitle: "HLA Gakuin (Hiroshima)",
      partnerDesc: "প্রিন্সিপাল ফুজিই কেইকো ও দোনাকা-সান",
      partnerFiles: "চলমান ফাইল: ১৮ জন",
      partnerCommission: "কমিশন: ¥১,৪৪০,০০০",
    },
    crm: {
      title: "ওমনি-চ্যানেল CRM ও টেলি-কাউন্সেলর ড্যাশবোর্ড",
      subtitle: "ফেসবুক মেটা অ্যাডস, হোয়াটসঅ্যাপ চ্যাট ও ওয়েবসাইট ফর্ম থেকে আসা প্রার্থীদের কল রেকর্ড ও ফলো-আপ।",
      quickAddBtn: "দ্রুত নতুন লিড যোগ করুন",
      colCandidate: "প্রার্থীর নাম ও যোগাযোগ",
      colSource: "উৎস ও আগ্রহ",
      colEducation: "শিক্ষাগত যোগ্যতা ও জাপানি স্তর",
      colCounselor: "কাউন্সেলর ও ব্রাঞ্চ",
      colStatus: "বর্তমান স্ট্যাটাস",
      colAction: "হোয়াটসঅ্যাপ ও অ্যাকশন",
      cityLabel: "শহর",
      gapLabel: "গ্যাপ",
      statuses: {
        NEW: "নতুন লিড",
        CONTACTED: "কল সম্পন্ন",
        COUNSELED: "কাউন্সেল্ড",
        OFFICE_VISIT_BOOKED: "অফিস ভিজিট বুকড",
        ADMITTED: "ভর্তি নিশ্চিত",
        ARCHIVED: "বাতিল / ফলো-আপ বন্ধ",
      },
    },
    visa: {
      calcTitle: "অটোমেটেড যোগ্যতা যাচাই ইঞ্জিন",
      calcSubtitle: "জাপান ইমিগ্রেশন ও মিনিস্ট্রি অফ জাস্টিস মানদণ্ড",
      minGpa: "সর্বনিম্ন এসএসসি/এইচএসসি জিপিএ:",
      gpaReq: "ন্যূনতম ২.৫০ আবশ্যক",
      ageLabel: "প্রার্থীর বয়স (সর্বোচ্চ ৩০ বছর):",
      gapLabel: "স্টাডি গ্যাপ (সর্বোচ্চ ৫-৬ বছর):",
      eligibleTitle: "১০০% যোগ্য প্রার্থী (IELTS প্রয়োজন নেই)",
      eligibleDesc: "N5 দক্ষতা সম্পন্ন হলে সরাসরি স্কুল নির্বাচন ও আবেদন সম্পন্ন করা যাবে।",
      sponsorTitle: "নেক্সাস স্ট্যান্ডার্ড স্পন্সর ও ব্যাংক গাইডলাইন",
      sponsorSubtitle: "মিনিস্ট্রি অফ জাস্টিস রিকোয়ারমেন্ট",
      bankSupportBadge: "ব্যাংক লোন সাপোর্ট সহায়ক",
      sponsorApprovedTitle: "অনুমোদিত স্পন্সর ক্যাটাগরি:",
      sponsorApprovedDesc: "বাবা, মা অথবা বড় ভাই/বোন (যেকোনো ১ জন বৈধ স্পন্সর)।",
      sponsorPhoneReq: "স্পন্সরের ২টি ভিন্ন ফোন নম্বর আবশ্যক",
      sponsorPhoneDesc: "জাপান ইমিগ্রেশন থেকে কল ভেরিফিকেশনের জন্য।",
      bankSolvencyTitle: "১৮ লক্ষ টাকার ব্যাংক সলভেন্সি:",
      bankSolvencyDesc: "বিগত ১ বছরের ব্যালেন্স ও ৩ বছরের ইনকাম ট্যাক্স রিটার্ন ফাইল।",
      approvedBanksTitle: "সহায়ক অনুমোদিত ব্যাংকসমূহ:",
      approvedBanksDesc: "অগ্রণী ব্যাংক, সোস্যাল ইসলামী ব্যাংক, পূবালী ব্যাংক ও জনতা ব্যাংক।",
      pipelineTitle: "১০-ধাপের ফুল-স্ট্যাক ভিসা Kanban পাইপলাইন",
      pipelineSubtitle: "ফাইল ওপেনিং (৳০ অগ্রিম) থেকে শুরু করে প্রি-ভিসা (COE), এম্বাসি ও জাপানে অবতরণ পর্যন্ত।",
      dragActive: "সরাসরি স্টেজ ড্র্যাগ ও নেক্সট স্টেজ প্রমোশন সক্রিয়",
      stages: [
        { stage: 1, name: "১. ফাইল ওপেনিং", desc: "৳০ অগ্রিম সার্ভিস চার্জ" },
        { stage: 2, name: "২. ভাষা প্রশিক্ষণ", desc: "N5/N4 ও Irodori প্রস্তুতি" },
        { stage: 3, name: "৩. ডকুমেন্ট অনুবাদ", desc: "নোটারি ও সার্টিফিকেট ভেরিফিকেশন" },
        { stage: 4, name: "৪. স্কুল জুম ইন্টারভিউ", desc: "HLA Gakuin সরাসরি ইন্টারভিউ" },
        { stage: 5, name: "৫. COE আবেদন", desc: "জাপান ইমিগ্রেশনে ফাইল সাবমিশন" },
        { stage: 6, name: "৬. প্রি-ভিসা (COE)", desc: "ইমিগ্রেশন অনুমোদন প্রাপ্তি" },
        { stage: 7, name: "৭. টিউশন ফি প্রদান", desc: "জাপানি স্কুলে ফি ট্রান্সফার" },
        { stage: 8, name: "৮. এম্বাসি ও VFS", desc: "ভিসা ইন্টারভিউ ও পাসপোর্ট জমা" },
        { stage: 9, name: "৯. ভিসা প্রাপ্তি", desc: "সার্ভিস চার্জ পরিশোধ ও স্ট্যাম্প" },
        { stage: 10, name: "১০. জাপান ল্যান্ডিং", desc: "এয়ারপোর্ট পিকআপ ও পার্ট-টাইম কাজ" },
      ],
      packageRegular: "রেগুলার",
      packagePremium: "প্রিমিয়াম",
      sessionPrefix: "সেশন:",
      sponsorPrefix: "স্পন্সর:",
      underReview: "যাচাইাধীন",
      nextStageBtn: "পরবর্তী ধাপ",
      noApplicants: "কোনো প্রার্থী নেই",
    },
    lms: {
      title: "ভাষা কোর্স ও এক্সটার্নাল LMS (npw.bd/knltc) ব্রিজ",
      subtitle: "N5, N4 ও Irodori ভর্তি নিশ্চিতকরণ, ইউজারনেম পাসওয়ার্ড ডেলিভারি ও শিক্ষক লেসন জেনারেটর।",
      npwClassroom: "NPW LMS ক্লাসরুম",
      irodoriPortal: "Irodori পোর্টাল",
      courseFeeTitle: "কোর্স ফি (প্রতি শিক্ষার্থী)",
      courseFeeDesc: "৩ মাসের নিবিড় N5 বা N4 কোর্স",
      portalFeeTitle: "এক্সটার্নাল LMS প্ল্যাটফর্ম ফি",
      portalFeeDesc: "npw.bd সার্ভার ও ব্যান্ডউইথ খরচ",
      netMarginTitle: "KNLTC নিট প্রতিষ্ঠান মার্জিন",
      netMarginDesc: "৮৩.৩% হাই প্রফিট মার্জিন",
      tableHeading: "ভর্তি হওয়া শিক্ষার্থীদের LMS একাউন্ট ও পাসওয়ার্ড লগ",
      issueAccountBtn: "নতুন LMS একাউন্ট ইস্যু করুন",
      colStudent: "শিক্ষার্থী ও এনরোলমেন্ট",
      colCourse: "কোর্স ও ব্যাচ",
      colCredentials: "LMS ইউজারনেম ও পাসওয়ার্ড",
      colMargin: "মার্জিন হিসাব",
      colProgress: "অগ্রগতি",
      colAction: "হোয়াটসঅ্যাপে পাঠান",
      completed: "সম্পন্ন",
      sendWaBtn: "১-ক্লিকে পাঠান",
    },
    b2b: {
      title: "বিটুবি (B2B) চ্যানেল, জাপানি স্কুল ও আন্তর্জাতিক পার্টনার নেটওয়ার্ক",
      subtitle: "হিরোশিমার HLA Gakuin, নেক্সাস গ্রুপ ও গ্লোবাল পার্টনারদের কমিশন লেজার ও রিক্রুটমেন্ট ট্র্যাকিং।",
      commissionBadge: "স্টুডেন্ট পিছু কমিশন: ৮০,০০০ ইয়েন (~৬০,০০০–৬৪,০০০ টাকা)",
      contactPerson: "দায়িত্বশীল ব্যক্তিত্ব:",
      commissionRate: "কমিশন রেট:",
      activeStudents: "চলমান শিক্ষার্থী:",
      totalEarned: "মোট অর্জিত কমিশন:",
      ledgerTitle: "নেক্সাস গ্রুপ, BWBS ও ক্যাম্পাস অ্যাম্বাসেডর কমিশন লেজার",
      colAgent: "এজেন্ট / পার্টনার প্রতিষ্ঠান",
      colTypeCity: "টাইপ ও শহর",
      colReferred: "রেফার্ড শিক্ষার্থী",
      colSuccessfulVisas: "সফল ভিসা",
      colAgreedCommission: "চুক্তিভিত্তিক কমিশন",
      colPaidVsPending: "পরিশোধিত বনাম বকেয়া",
      studentsSuffix: "জন",
      paidPrefix: "পেইড:",
      pendingPrefix: "বকেয়া:",
    },
    finance: {
      auditBadge: "১০ লক্ষ টাকার ইনভেস্টর ওপেন-বুক অডিট পোর্টাল (১০০% হালাল লভ্যাংশ মডেল)",
      title: "বিনিয়োগ বণ্টন, সিকিউরিটি গ্যারান্টি ও রিয়েল-টাইম ডিভিডেন্ড ক্যালকুলেটর",
      subtitle: "৩০০ টাকার সরকারি স্ট্যাম্প চুক্তি ও ব্যাংকের সিকিউরিটি চেকের অধীনে ১০% প্রফিট শেয়ারিং হিসাব।",
      capitalLabel: "মূল ক্যাপিটাল বিনিয়োগ:",
      pillar1Title: "১. কোচিং ও ল্যাব সেটআপ (৩০%)",
      pillar1Desc: "মাল্টিমিডিয়া ক্লাসরুম ও সাউন্ড ল্যাব",
      pillar2Title: "২. ডিজিটাল মার্কেটিং ও লিড (২০%)",
      pillar2Desc: "মেটা অ্যাডস ও ডিরেক্ট ফর্ম ফানেল",
      pillar3Title: "৩. অপারেশনাল রানওয়ে (৩০%)",
      pillar3Desc: "৬ মাসের অফিস রেন্ট ও স্টাফ বেতন",
      pillar4Title: "৪. জরুরি সেফটি রিজার্ভ (২০%)",
      pillar4Desc: "ব্যাংক সিকিউরিটি রিজার্ভ ফান্ড",
      scenarioTitle: "বাৎসরিক মুনাফা শেয়ারিং প্রজেকশন বনাম লাইভ পারফরম্যান্স",
      scen1Badge: "রক্ষণশীল দৃশ্যপট (২০টি ভিসা)",
      scen1Gross: "গ্রস লাভ: ৳২৪,০০,০০০",
      scen1Share: "ইনভেস্টর শেয়ার: ৳২,৪০,০০০",
      scen1Return: "২৪% বার্ষিক রিটার্ন",
      scen2Badge: "বাস্তবসম্মত লক্ষ্যমাত্রা (৩০টি ভিসা)",
      scen2Gross: "গ্রস লাভ: ৳৩৬,০০,০০০",
      scen2Share: "ইনভেস্টর শেয়ার: ৳৩,৬০,০০০",
      scen2Return: "৩৬% বার্ষিক হালাল মুনাফা",
      scen3Badge: "সর্বোচ্চ সম্ভাবনা (৪০টি ভিসা)",
      scen3Gross: "গ্রস লাভ: ৳৪৮,০০,০০০",
      scen3Share: "ইনভেস্টর শেয়ার: ৳৪,৮০,০০০",
      scen3Return: "৪৮% বার্ষিক রিটার্ন",
      legalText: "আইনি নিরাপত্তা: ৩০০ টাকার সরকারি স্ট্যাম্প চুক্তি ও ইসলামী ব্যাংক সিকিউরিটি চেক নং IBBL-CHQ-9948201",
      legalBadge: "১০% ফিক্সড ডিভিডেন্ড এগ্রিমেন্ট",
      billingTitle: "রেগুলার (৳১,২০,০০০) ও প্রিমিয়াম (৳১১,০০,০০০) প্যাকেজ বিলিং",
      billingSubtitle: "বিকাশ, নগদ, ব্যাংক ও গেটওয়ে পেমেন্ট ট্র্যাকার",
      recordPaymentBtn: "পেমেন্ট এন্ট্রি নিন",
      colReceiptDate: "রশিদ ও তারিখ",
      colStudentDesc: "শিক্ষার্থী / বিবরণ",
      colPackageType: "প্যাকেজ / পেমেন্ট টাইপ",
      colMethodTrx: "মাধ্যম ও Trx ID",
      colBranch: "শাখা",
      colAmount: "টাকার পরিমাণ (BDT)",
    },
    hr: {
      title: "এইচআর (HR) ও রিমোট ফিমেল টেলি-কাউন্সেলর পে-রোল",
      subtitle: "কল টার্গেট (মাসিক ৬০০ কল), নিশ্চিত ভর্তি বোনাস (১,০০০ টাকা/ভর্তি) ও স্যালারি শীট।",
      bonusBadge: "পারফরম্যান্স বোনাস: প্রতি নিশ্চিত ভর্তিতে ১,০০০ টাকা",
      colNameRole: "কর্মকর্তার নাম ও রোল",
      colLocation: "লোকেশন",
      colCallsTarget: "মাসিক কল টার্গেট বনাম অর্জন",
      colAdmissions: "ভর্তি অর্জন",
      colBaseSalary: "মূল বেতন",
      colBonus: "পারফরম্যান্স বোনাস",
      colTotalPay: "মোট প্রদেয় বেতন",
      callsSuffix: "কল",
    },
    cms: {
      cmsBadge: "১০০% ডাইনামিক ওয়েবসাইট সিএমএস (knltc.com)",
      title: "কোডে হাত না দিয়ে ওয়েবসাইটের সব পেইজ ও কনটেন্ট পরিচালনা করুন",
      subtitle: "টপ ব্যানার, হিরো সেকশন, জাপানি কোর্স ও লেসন, ভিসা প্যাকেজ, চাকরির সার্কুলার ও বুক স্টোর।",
      saveBtn: "সিএমএস পরিবর্তন সেভ করুন",
      section1Title: "১. গ্লোবাল টপ অ্যানাউন্সমেন্ট ও পপ-আপ ব্যানার",
      topBarLabel: "টপ বার অ্যানাউন্সমেন্ট:",
      popupLabel: "পপ-আপ ব্যানার হেডলাইন:",
      heroLabel: "হোমপেজ হিরো হেডলাইন:",
      pixelLabel: "Facebook Meta Pixel ID:",
      section2Title: "২. জাপানি ভাষা পেইজ ও লেসন এডিটর (/japanese-language)",
      n5PriceLabel: "N5 কোর্স ফি (BDT):",
      n4PriceLabel: "N4 কোর্স ফি (BDT):",
      comboPriceLabel: "N5+N4 কম্বো কোর্স ফি (BDT):",
      lessonsTableTitle: "মিন্না নো নিহোঙ্গো লেসন তালিকা (শব্দভাণ্ডার ও ব্যাকরণ)",
      colLessonNo: "লেসন নং",
      colLessonTitle: "শিরোনাম",
      colLessonCategory: "ক্যাটেগরি",
      colWordsCount: "শব্দ সংখ্যা",
      colAction: "অ্যাকশন",
      activeBadge: "সক্রিয়",
      section3Title: "৩. স্টুডেন্ট ভিসা প্যাকেজ মূল্য ও শর্তাবলি (/study-in-japan)",
      regularTitle: "রেগুলার প্যাকেজ",
      regularLabel: "সার্ভিস চার্জ (ভিসা অনুমোদনের পর):",
      regularDesc: "ভিসার পূর্বে কোনো ফাইল চার্জ নেই। শিক্ষার্থী টিউশন ফি ও টিকিট বহন করবে।",
      premiumTitle: "প্রিমিয়াম প্যাকেজ (অল-ইন-ওয়ান)",
      premiumLabel: "সম্পূর্ণ প্যাকেজ মূল্য (টিউশন ও টিকিট সহ):",
      premiumDesc: "১০% রিফান্ডযোগ্য জামানত। ১ম বছরের টিউশন ও এয়ার টিকিট KNLTC বহন করে।",
      section4Title: "৪. জব সার্কুলার ও SSW ক্যাম্পেইন ম্যানেজার (/work-in-japan)",
      newCircularBtn: "নতুন সার্কুলার প্রকাশ করুন",
      japanLocation: "জাপান লোকেশন:",
      salaryPrefix: "বেতন:",
      liveActive: "লাইভ সক্রিয়",
      draft: "ড্রাফট",
      section5Title: "৫. বুক স্টোর ও কাস্টমার অর্ডার প্রসেসিং (/store, /cart, /checkout)",
      pendingOrdersPrefix: "পেন্ডিং অর্ডার:",
      colOrderCustomer: "অর্ডার নং ও ক্রেতা",
      colItemsAddress: "আইটেম ও ঠিকানা",
      colDeliveryArea: "ডেলিভারি এরিয়া",
      colPaymentMethod: "পেমেন্ট মাধ্যম",
      colTotalPrice: "মোট মূল্য",
      colStatus: "স্ট্যাটাস",
      orderStatuses: {
        PENDING: "পেন্ডিং",
        PROCESSING: "প্রসেসিং",
        SHIPPED: "শিপড",
        DELIVERED: "ডেলিভারড",
        CANCELLED: "ক্যান্সেলড",
      },
    },
  },
  ja: {
    loading: "KNLTC コマンドセンターを読み込み中...",
    topBanner: "KNLTC 総合教育・就職コマンドセンター（ダッカ・クルナ）",
    leadership: "代表: シェイク・バセット • 首席講師: アミール・ホセイン",
    hotline: "ホットライン: +880 1805 013633",
    lmsBtn: "LMSポータル",
    branchLabel: "拠点:",
    allBranches: "全拠点",
    dhakaHq: "ダッカ本部",
    khulnaBranch: "クルナ支部",
    viewRoleLabel: "ロール:",
    publicWebsite: "公開サイト",
    toastSuccess: "変更内容が保存され、サイトに反映されました！",
    languageLabel: "言語:",
    roles: {
      mainAdmin: "👑 総括管理者 (シェイク・バセット)",
      branchAdmin: "🏢 拠点管理者 (ダッカ/クルナ)",
      teleCounselor: "📞 カウンセラー (リモート)",
      teacher: "🎓 日本語教師 (アミール先生)",
      b2bAgent: "🤝 B2B代理店 (Nexus / BWBS)",
      investor: "💼 投資家ポータル (公開帳簿)",
      student: "🎒 受講生・ビザ進捗",
    },
    tabs: {
      overview: "経営概要",
      crm: "顧客管理・相談",
      visa: "ビザ進捗管理",
      lms: "日本語講座・LMS",
      b2b: "B2B・提携校",
      finance: "財務・投資家",
      hr: "人事・給与管理",
      cms: "サイトCMS",
      storeBlog: "ストア・注文・ブログ",
    },
    kpi: {
      liveHub: "リアルタイム統合管理",
      integrated: "ダッカ・クルナ統合",
      overviewTitle: "経営概況・リアルタイム業務分析",
      overviewSub: "日本留学ビザ、特定技能16分野、日本語教育の一元管理ダッシュボード。",
      addLeadBtn: "新規問い合わせ追加",
      viewPipelineBtn: "ビザ進捗パイプライン",
      totalLeads: "有効問い合わせ総数",
      metaSubtitle: "Meta広告およびWhatsApp流入",
      activeStudents: "在籍受講生総数",
      lmsSubtitle: "npw.bd/knltc および対面クラス",
      inProcessVisas: "申請中ビザ件数",
      aprilIntake: "2027年4月期生",
      expectedCommission: "提携校手数料見込み",
      yenCommissionSub: "受講生1名につき80,000円",
      monthlyCashFlow: "月次純キャッシュフロー",
      marginSub: "受講料およびビザ報酬マージン",
    },
    module1: {
      chartTitle: "年間財務予測と実績",
      chartSubtitle: "レギュラー（12万BDT）およびプレミアム（110万BDT）に基づく試算",
      fiscalYear: "2026–2027年度",
      chartMilestones: [
        "2026年5月（開講期）",
        "7月生送り出し",
        "10月生拡大",
        "2027年1月目標",
      ],
      grossProjection: "年間総売上予測",
      grossDesc: "30〜40件のビザ認可達成ベース",
      operationalCost: "総運営費",
      operationalDesc: "オフィス家賃、広告費、講師人件費",
      netProfit: "年間純利益見込み",
      netProfitDesc: "投資家配当10%: 36万BDT",
      sswBadge: "特別採用キャンペーン",
      sswTitle: "特定技能（建設）特別育成クラス（N4合格者限定）",
      sswDesc: "N4合格者に対し、ダッカ研修センターでの宿泊・食費無料および技能試験対策を実施。",
      sswSeats: "定員: 25名",
      sswEnrolled: "受講中: 18名",
      sswButton: "応募リードを処理する",
      partnerBadge: "日本提携校",
      partnerLocation: "広島",
      partnerTitle: "HLA日本語学院（広島）",
      partnerDesc: "藤井啓子校長 ＆ 堂中様",
      partnerFiles: "進行中申請: 18名",
      partnerCommission: "手数料見込み: ¥1,440,000",
    },
    crm: {
      title: "オムニチャネルCRM ＆ カウンセラー管理",
      subtitle: "Meta広告、WhatsApp、ウェブサイトからの問い合わせ対応と通話記録。",
      quickAddBtn: "新規リードを即時追加",
      colCandidate: "候補者氏名・連絡先",
      colSource: "流入元・希望コース",
      colEducation: "学歴・日本語レベル",
      colCounselor: "担当者・拠点",
      colStatus: "進捗ステータス",
      colAction: "WhatsApp・操作",
      cityLabel: "居住都市",
      gapLabel: "学歴空白",
      statuses: {
        NEW: "新規リード",
        CONTACTED: "連絡・通話済",
        COUNSELED: "面談・相談済",
        OFFICE_VISIT_BOOKED: "来社予約済",
        ADMITTED: "入学確定",
        ARCHIVED: "終了・無効",
      },
    },
    visa: {
      calcTitle: "自動適格性判定エンジン",
      calcSubtitle: "出入国在留管理庁および法務省基準",
      minGpa: "最低学業評定 (SSC/HSC GPA):",
      gpaReq: "2.50以上が必須です",
      ageLabel: "年齢 (上限30歳):",
      gapLabel: "卒業後空白期間 (上限5〜6年):",
      eligibleTitle: "適格基準クリア（IELTS不要）",
      eligibleDesc: "日本語N5レベル到達後、速やかに提携校選定および願書提出が可能です。",
      sponsorTitle: "ネクサス標準経費支弁者・銀行残高基準",
      sponsorSubtitle: "法務省在留資格認定要件",
      bankSupportBadge: "提携銀行ローン支援あり",
      sponsorApprovedTitle: "認定支弁者区分:",
      sponsorApprovedDesc: "父、母、または実兄姉（いずれか1名の正当な支弁者）。",
      sponsorPhoneReq: "支弁者電話番号2回線が必要",
      sponsorPhoneDesc: "入管からの在籍・本人電話照会用。",
      bankSolvencyTitle: "180万BDT（約220万円）残高証明:",
      bankSolvencyDesc: "過去1年間の取引推移および直近3年の納税証明書類。",
      approvedBanksTitle: "推奨認定銀行一覧:",
      approvedBanksDesc: "アグラニ銀行、ソーシャルイスラミ銀行、プバリ銀行、ジャナタ銀行。",
      pipelineTitle: "10段階フルスタックビザ看板パイプライン",
      pipelineSubtitle: "申請着手（前払金ゼロ）から在留資格認定(COE)、大使館査証発給、日本入国まで。",
      dragActive: "ドラッグ＆ドロップおよび次ステージ昇格機能が有効",
      stages: [
        { stage: 1, name: "1. 申請ファイル開設", desc: "前受サービス料 ৳0" },
        { stage: 2, name: "2. 日本語特訓", desc: "N5/N4およびいろどり講習" },
        { stage: 3, name: "3. 書類公証・翻訳", desc: "学歴証明・在職証明認証" },
        { stage: 4, name: "4. 学校面接 (Zoom)", desc: "HLA日本語学院直接面接" },
        { stage: 5, name: "5. COE入管申請", desc: "地方出入国在留管理局へ提出" },
        { stage: 6, name: "6. 在留資格認定 (COE)", desc: "入国管理局許可証受領" },
        { stage: 7, name: "7. 学費海外送金", desc: "日本語学校への学費納入" },
        { stage: 8, name: "8. 大使館査証申請", desc: "在バングラデシュ日本国大使館" },
        { stage: 9, name: "9. ビザ発給・受取", desc: "成果報酬精算・旅券受領" },
        { stage: 10, name: "10. 日本入国・送迎", desc: "空港出迎え・アルバイト支援" },
      ],
      packageRegular: "レギュラー",
      packagePremium: "プレミアム",
      sessionPrefix: "期:",
      sponsorPrefix: "支弁者:",
      underReview: "審査中",
      nextStageBtn: "次の段階へ",
      noApplicants: "この段階の候補者はいません",
    },
    lms: {
      title: "日本語講座・外部LMS（npw.bd/knltc）連携",
      subtitle: "N5・N4・いろどり受講生のアカウント発行、パスワード通知、教材管理。",
      npwClassroom: "NPW LMS教室",
      irodoriPortal: "いろどりポータル",
      courseFeeTitle: "受講料（受講生1名）",
      courseFeeDesc: "3ヶ月集中 N5/N4クラス",
      portalFeeTitle: "外部LMSシステム利用料",
      portalFeeDesc: "npw.bdサーバー運用費",
      netMarginTitle: "KNLTC純利益マージン",
      netMarginDesc: "83.3% 高収益モデル",
      tableHeading: "受講生LMSアカウント・アクセス履歴",
      issueAccountBtn: "新規LMSアカウントを発行",
      colStudent: "受講生名・学籍番号",
      colCourse: "コース・所属クラス",
      colCredentials: "LMS ID・初期パスワード",
      colMargin: "マージン計算",
      colProgress: "学習進捗",
      colAction: "WhatsApp通知",
      completed: "修了",
      sendWaBtn: "ワンクリック送信",
    },
    b2b: {
      title: "B2B提携・日本語学校・海外パートナー",
      subtitle: "広島HLA日本語学院、ネクサスグループ等の紹介手数料および生徒管理台帳。",
      commissionBadge: "生徒1名あたり手数料: 80,000円（約60,000〜64,000 BDT）",
      contactPerson: "責任者:",
      commissionRate: "手数料単価:",
      activeStudents: "在籍学生数:",
      totalEarned: "受領済手数料総額:",
      ledgerTitle: "ネクサスグループ・BWBS・代理店手数料台帳",
      colAgent: "代理店・提携法人名",
      colTypeCity: "種別・所在地",
      colReferred: "紹介学生数",
      colSuccessfulVisas: "ビザ成功数",
      colAgreedCommission: "契約手数料単価",
      colPaidVsPending: "支払済 / 未払残高",
      studentsSuffix: "名",
      paidPrefix: "支払済:",
      pendingPrefix: "未払:",
    },
    finance: {
      auditBadge: "100万BDT 投資家公開帳簿監査ポータル（100% ハラール利益分配）",
      title: "資金使途・保全担保・リアルタイム配当計算",
      subtitle: "300タカ政府印紙契約書およびイスラミ銀行担保小切手に基づく10%利益分配。",
      capitalLabel: "投資元本総額:",
      pillar1Title: "1. 教室設備・ラボ構築 (30%)",
      pillar1Desc: "マルチメディア教室・音響設備",
      pillar2Title: "2. デジタル集客・広告 (20%)",
      pillar2Desc: "Meta広告・問い合わせ導線",
      pillar3Title: "3. 運営資金・ランウェイ (30%)",
      pillar3Desc: "6ヶ月分の家賃・講師給与",
      pillar4Title: "4. 緊急安全予備費 (20%)",
      pillar4Desc: "銀行担保準備金",
      scenarioTitle: "年間利益分配シミュレーションと実績比較",
      scen1Badge: "保守的目標 (ビザ20件)",
      scen1Gross: "粗利益: ৳24,00,000",
      scen1Share: "投資家受取: ৳2,40,000",
      scen1Return: "年利換算 24%",
      scen2Badge: "現実的目標 (ビザ30件)",
      scen2Gross: "粗利益: ৳36,00,000",
      scen2Share: "投資家受取: ৳3,60,000",
      scen2Return: "年利換算 36%（ハラール配当）",
      scen3Badge: "最高達成目標 (ビザ40件)",
      scen3Gross: "粗利益: ৳48,00,000",
      scen3Share: "投資家受取: ৳4,80,000",
      scen3Return: "年利換算 48%",
      legalText: "法的担保: 300タカ公認印紙契約書およびイスラミ銀行担保小切手番号 IBBL-CHQ-9948201",
      legalBadge: "10%固定配当契約",
      billingTitle: "レギュラー（12万BDT）＆プレミアム（110万BDT）決済台帳",
      billingSubtitle: "bKash、Nagad、銀行振込、決済ゲートウェイ管理",
      recordPaymentBtn: "入金記録を新規追加",
      colReceiptDate: "領収番号・日付",
      colStudentDesc: "生徒氏名・内容",
      colPackageType: "区分・決済種別",
      colMethodTrx: "決済手段・Trx ID",
      colBranch: "拠点",
      colAmount: "金額 (BDT)",
    },
    hr: {
      title: "人事・在宅女性カウンセラー給与管理",
      subtitle: "月間コール目標（600件）、成約インセンティブ（1,000 BDT/名）、給与明細台帳。",
      bonusBadge: "成約ボーナス: 入学決定1名につき 1,000 BDT",
      colNameRole: "スタッフ氏名・役職",
      colLocation: "勤務地",
      colCallsTarget: "月間通話: 目標 vs 実績",
      colAdmissions: "獲得入学者数",
      colBaseSalary: "基本給",
      colBonus: "成果インセンティブ",
      colTotalPay: "当月総支給額",
      callsSuffix: "件",
    },
    cms: {
      cmsBadge: "100% 動的サイトCMS (knltc.com)",
      title: "コード修正なしで全ページ・コンテンツを一括管理",
      subtitle: "告知バー、ヒーロー文言、日本語講座カリキュラム、留学パッケージ、求人情報、オンラインストア。",
      saveBtn: "CMS変更を保存する",
      section1Title: "1. 共通告知バー・ポップアップ管理",
      topBarLabel: "ヘッダー上部告知:",
      popupLabel: "ポップアップ告知見出し:",
      heroLabel: "トップページ大見出し:",
      pixelLabel: "Facebook Meta Pixel ID:",
      section2Title: "2. 日本語講座・レッスン編集 (/japanese-language)",
      n5PriceLabel: "N5コース受講料 (BDT):",
      n4PriceLabel: "N4コース受講料 (BDT):",
      comboPriceLabel: "N5+N4セット受講料 (BDT):",
      lessonsTableTitle: "みんなの日本語 カリキュラム一覧（語彙・文法）",
      colLessonNo: "課番号",
      colLessonTitle: "課タイトル",
      colLessonCategory: "区分",
      colWordsCount: "収録語彙数",
      colAction: "状態",
      activeBadge: "公開中",
      section3Title: "3. 日本留学ビザパッケージ料金・条件 (/study-in-japan)",
      regularTitle: "レギュラーパッケージ",
      regularLabel: "成功報酬サービス料（ビザ認可後払い）:",
      regularDesc: "申請着手時の前払金は一切不要。学費実費および航空券代のみ自己負担。",
      premiumTitle: "プレミアムパッケージ（コミコミ安心プラン）",
      premiumLabel: "総額パッケージ料金（1年目学費・航空券込）:",
      premiumDesc: "10%返金保証付き保証金。初年度学費および航空券代をKNLTCが負担。",
      section4Title: "4. 求人情報・特定技能キャンペーン管理 (/work-in-japan)",
      newCircularBtn: "新規求人を公開",
      japanLocation: "勤務予定地:",
      salaryPrefix: "給与水準:",
      liveActive: "募集中",
      draft: "下書き",
      section5Title: "5. ブックストア・注文管理 (/store, /cart, /checkout)",
      pendingOrdersPrefix: "未処理注文:",
      colOrderCustomer: "注文番号・購入者",
      colItemsAddress: "購入商品・送付先",
      colDeliveryArea: "配送地域",
      colPaymentMethod: "支払方法",
      colTotalPrice: "合計金額",
      colStatus: "注文ステータス",
      orderStatuses: {
        PENDING: "保留中",
        PROCESSING: "処理中",
        SHIPPED: "発送済",
        DELIVERED: "配達完了",
        CANCELLED: "キャンセル",
      },
    },
  },
};

export function getDashboardDictionary(lang: Language): DashboardDictionary {
  return dashboardDictionaries[lang] ?? dashboardDictionaries.en;
}
