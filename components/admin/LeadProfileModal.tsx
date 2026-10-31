"use client";

import React, { useState, useMemo } from "react";
import { trModal } from "@/lib/modal-translations";
import {
  ArrowLeft,
  User,
  CheckSquare,
  FolderOpen,
  Sparkles,
  Landmark,
  Receipt,
  Phone,
  Mail,
  Globe,
  GraduationCap,
  Tag,
  Calendar,
  Edit3,
  Trash2,
  Plus,
  Clock,
  CheckCircle2,
  Upload,
  Loader2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Send,
  PhoneCall,
  Building2,
  ShieldCheck,
  KeyRound,
  Copy,
  Check,
  Printer,
  Camera,
  X,
  Save,
  FileCheck2,
  Award,
  Wallet,
  Eye,
  Download,
} from "lucide-react";
import { uploadDocumentFile, uploadMediaImage } from "@/lib/media-upload";
import DocumentPreviewModal from "@/components/admin/DocumentPreviewModal";
import {
  getCmsStore,
  updateCrmLeadProfile,
  updateCrmLeadStatus,
  deleteCrmLead,
  provisionLeadLoginAndEnrollment,
  promoteLeadToVisaPipeline,
  updateVisaStage,
  updateVisaApplicantTrack,
  resolveVisaTrack,
  getStagesForVisaTrack,
  addFinancialTransaction,
  getLeadDocumentChecklist,
  calculateLeadEligibility,
  addLeadActivityLog,
  formatLeadInterestLabel,
  formatLeadSourceLabel,
  formatProficiencyLabel,
  STANDARD_DEGREE_OPTIONS,
  type CrmLead,
  type DashboardTabId,
  type LeadStatus,
  type LeadPriority,
  type LeadDocumentItem,
  type LeadActivityItem,
  type ProfileTaskItem,
  type ServiceInterest,
  type VisaStage,
  type VisaTrack,
  type TransactionType,
  type FinancialTransaction,
  type JapanesePartnerSchool,
} from "@/lib/knltc-cms-store";
import { useLanguage } from "@/components/layout/LanguageProvider";

type WorkspaceTabId =
  | "overview"
  | "tasks"
  | "documents"
  | "matches"
  | "applications"
  | "invoices";

const STATUS_META: Record<
  LeadStatus,
  { labelEn: string; labelBn: string; badgeClass: string; dotClass: string }
> = {
  NEW: {
    labelEn: "New Lead",
    labelBn: "নতুন লিড",
    badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
    dotClass: "bg-slate-400",
  },
  CONTACTED: {
    labelEn: "Contacted",
    labelBn: "যোগাযোগকৃত",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
    dotClass: "bg-blue-600",
  },
  COUNSELED: {
    labelEn: "Counseled",
    labelBn: "কাউন্সেলিং সম্পন্ন",
    badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-200",
    dotClass: "bg-indigo-600",
  },
  OFFICE_VISIT_BOOKED: {
    labelEn: "Office Visit Booked",
    labelBn: "অফিস ভিজিট বুকড",
    badgeClass: "bg-amber-50 text-amber-800 border-amber-200",
    dotClass: "bg-amber-500",
  },
  ADMITTED: {
    labelEn: "Admitted",
    labelBn: "ভর্তি নিশ্চিত",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotClass: "bg-emerald-600",
  },
  ARCHIVED: {
    labelEn: "Archived / Closed",
    labelBn: "আর্কাইভড / বাতিল",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
    dotClass: "bg-rose-500",
  },
};

const VISA_STAGE_LABELS: Record<VisaStage, { bn: string; en: string; ja: string }> = {
  1: {
    bn: "ধাপ ১: ফাইল ওপেনিং (৳০ অগ্রিম)",
    en: "Stage 1: File Opening (৳0 Advance)",
    ja: "ステップ1: ファイル開設",
  },
  2: {
    bn: "ধাপ ২: ভাষা প্রশিক্ষণ (N5/N4)",
    en: "Stage 2: Language Training (N5/N4)",
    ja: "ステップ2: 日本語講習（N5/N4）",
  },
  3: {
    bn: "ধাপ ৩: ডকুমেন্ট সংগ্রহ ও নোটারি",
    en: "Stage 3: Document Collection & Notary",
    ja: "ステップ3: 書類収集・公証翻訳",
  },
  4: {
    bn: "ধাপ ৪: জাপানি স্কুল জুম ইন্টারভিউ",
    en: "Stage 4: Japanese School Zoom Interview",
    ja: "ステップ4: 日本語学校Zoom面接",
  },
  5: {
    bn: "ধাপ ৫: ইমিগ্রেশনে COE আবেদন",
    en: "Stage 5: Immigration COE Submission",
    ja: "ステップ5: 入管COE申請提出",
  },
  6: {
    bn: "ধাপ ৬: প্রি-ভিসা (COE) অনুমোদন",
    en: "Stage 6: Pre-Visa (COE) Approval",
    ja: "ステップ6: COE交付承認",
  },
  7: {
    bn: "ধাপ ৭: টিউশন ফি ও মূল COE রিলিজ",
    en: "Stage 7: Tuition Payment & Original COE",
    ja: "ステップ7: 学費送金・原本COE交付",
  },
  8: {
    bn: "ধাপ ৮: এম্বাসি ইন্টারভিউ ও VFS",
    en: "Stage 8: Embassy Submission & VFS",
    ja: "ステップ8: 日本大使館・VFS査証申請",
  },
  9: {
    bn: "ধাপ ৯: ভিসা স্ট্যাম্পিং ও সার্ভিস চার্জ",
    en: "Stage 9: Visa Stamping & Service Charge",
    ja: "ステップ9: ビザ発給・成功報酬精算",
  },
  10: {
    bn: "ধাপ ১০: এয়ার টিকিট ও জাপান ফ্লাই",
    en: "Stage 10: Air Ticket & Departure to Japan",
    ja: "ステップ10: 航空券手配・日本渡航",
  },
};

function getDefaultTasksForLead(lead: CrmLead, isBn: boolean): ProfileTaskItem[] {
  return [
    {
      id: "task-1",
      title: isBn
        ? "প্রাথমিক টেলি-কাউন্সেলিং ও যোগ্যতা যাচাই কল"
        : "Complete initial counseling & eligibility assessment call",
      dueDate: lead.followUpDate || new Date().toISOString().slice(0, 10),
      completed: lead.status !== "NEW",
      category: "CALL",
      assignee: lead.assignedTo || "Counselor",
    },
    {
      id: "task-2",
      title: isBn
        ? "SSC ও HSC মূল মার্কশিট এবং সার্টিফিকেট স্ক্যান সংগ্রহ"
        : "Collect SSC & HSC academic transcripts and certificates",
      dueDate: "",
      completed: Boolean(lead.sscGpa && lead.hscGpa),
      category: "DOCUMENT",
      assignee: lead.assignedTo || "Counselor",
    },
    {
      id: "task-3",
      title: isBn
        ? "পাসপোর্ট কপি বা জাতীয় পরিচয়পত্র (NID) যাচাইকরণ"
        : "Verify valid Passport copy or NID/Birth Registration",
      dueDate: "",
      completed: Boolean(lead.passportNo),
      category: "DOCUMENT",
      assignee: lead.assignedTo || "Counselor",
    },
    {
      id: "task-4",
      title: isBn
        ? "জাপানি ভাষা ব্যাচ (JLPT N5 / N4) বা পার্টনার স্কুল নির্বাচন"
        : "Match candidate with target Japanese Partner School & Language Batch",
      dueDate: "",
      completed: Boolean(lead.targetSchool || lead.isCourseEnrolled),
      category: "INTERVIEW",
      assignee: lead.assignedTo || "Counselor",
    },
    {
      id: "task-5",
      title: isBn
        ? "ফাইল ওপেনিং চুক্তি ও প্রাথমিক অ্যাডমিশন ইনভয়েস সম্পন্নকরণ"
        : "Confirm admission agreement & issue initial fee invoice",
      dueDate: "",
      completed: lead.status === "ADMITTED" || Boolean(lead.isFileOpened),
      category: "FINANCE",
      assignee: lead.assignedTo || "Accounts",
    },
  ];
}

export default function LeadProfileModal({
  lead,
  allLeads = [],
  onSelectLead,
  onDeleted,
  onClose,
  onSaved,
  backLabel,
}: {
  lead: CrmLead;
  allLeads?: CrmLead[];
  onSelectLead?: (nextLead: CrmLead) => void;
  onDeleted?: (deletedName: string) => void;
  onClose: () => void;
  onSaved: (message: string) => void;
  backLabel?: string;
}) {
  const { language } = useLanguage();
  const tr = (bn: string, en: string, ja?: string) => trModal(language, bn, en, ja);
  const isBn = language === "bn";

  const [activeTab, setActiveTab] = useState<WorkspaceTabId>("overview");
  const [storeTick, setStoreTick] = useState(0);
  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
  const [isUpdateStatusOpen, setIsUpdateStatusOpen] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingDocId, setUploadingDocId] = useState<string | null>(null);
  const [docCategoryFilter, setDocCategoryFilter] = useState<
    "ALL" | "IDENTITY" | "ACADEMIC" | "LANGUAGE" | "SPONSOR_FINANCIAL"
  >("ALL");
  const [copiedCredentials, setCopiedCredentials] = useState(false);

  // Live store snapshot
  const liveStore = useMemo(() => {
    void storeTick;
    return getCmsStore();
  }, [storeTick]);

  const partnerSchools = useMemo(
    () => liveStore.partnerSchools || [],
    [liveStore.partnerSchools]
  );
  const b2bAgents = useMemo(() => liveStore.b2bAgents || [], [liveStore.b2bAgents]);
  const counselors = useMemo(
    () =>
      liveStore.staffList.filter(
        (s) =>
          s.role === "TELE_COUNSELOR" ||
          s.role === "COUNSELOR" ||
          s.role === "BRANCH_MANAGER"
      ),
    [liveStore.staffList]
  );

  // Linked Visa & LMS & Finance records
  const linkedVisa = useMemo(
    () =>
      liveStore.visaApplicants.find(
        (v) =>
          v.leadId === lead.id ||
          v.linkedLeadId === lead.id ||
          (lead.phone && v.phone === lead.phone)
      ) || null,
    [liveStore.visaApplicants, lead.id, lead.phone]
  );

  const linkedLms = useMemo(
    () =>
      liveStore.lmsBridges.find(
        (b) =>
          b.leadId === lead.id ||
          b.linkedLeadId === lead.id ||
          (lead.phone && b.phone === lead.phone)
      ) || null,
    [liveStore.lmsBridges, lead.id, lead.phone]
  );

  const studentTransactions = useMemo(
    () =>
      liveStore.transactions.filter(
        (tx) =>
          tx.linkedLeadId === lead.id ||
          (linkedVisa && tx.linkedVisaId === linkedVisa.id) ||
          (lead.phone && tx.studentPhone === lead.phone) ||
          tx.studentName.toLowerCase() === lead.name.toLowerCase()
      ),
    [liveStore.transactions, lead.id, lead.phone, lead.name, linkedVisa]
  );

  // Prev / Next navigation in filtered list
  const currentLeadIndex = useMemo(
    () => allLeads.findIndex((item) => item.id === lead.id),
    [allLeads, lead.id]
  );
  const prevLead = currentLeadIndex > 0 ? allLeads[currentLeadIndex - 1] : null;
  const nextLead =
    currentLeadIndex >= 0 && currentLeadIndex < allLeads.length - 1
      ? allLeads[currentLeadIndex + 1]
      : null;

  // Editable Profile State
  const [name, setName] = useState(lead.name);
  const [phone, setPhone] = useState(lead.phone);
  const [whatsapp, setWhatsapp] = useState(lead.whatsapp || lead.phone);
  const [email, setEmail] = useState(lead.email || lead.loginEmail || "");
  const [city, setCity] = useState(lead.city || "Dhaka");
  const [address, setAddress] = useState(lead.address || "");
  const [avatarUrl, setAvatarUrl] = useState(lead.avatarUrl || "");
  const [passportNo, setPassportNo] = useState(lead.passportNo || "");
  const [guardianName, setGuardianName] = useState(
    lead.guardianName || linkedVisa?.sponsorName || ""
  );
  const [guardianPhone, setGuardianPhone] = useState(lead.guardianPhone || "");
  const [education, setEducation] = useState(lead.education || "HSC / Alim");
  const [sscGpa, setSscGpa] = useState(() => {
    const rawSsc = String(lead.sscGpa ?? "").trim();
    const rawHsc = String(lead.hscGpa ?? "").trim();
    if (
      ((rawSsc === "4.00" && (rawHsc === "3.70" || rawHsc === "3.7")) ||
        (rawSsc === "4.25" && rawHsc === "4.00")) &&
      !lead.gpaDetails
    ) {
      return "";
    }
    if (rawSsc) return rawSsc;
    const match = (lead.gpaDetails || "").match(/ssc\s*[:=-]?\s*(\d+(?:\.\d+)?)/i);
    return match ? match[1] : "";
  });
  const [hscGpa, setHscGpa] = useState(() => {
    const rawSsc = String(lead.sscGpa ?? "").trim();
    const rawHsc = String(lead.hscGpa ?? "").trim();
    if (
      ((rawSsc === "4.00" && (rawHsc === "3.70" || rawHsc === "3.7")) ||
        (rawSsc === "4.25" && rawHsc === "4.00")) &&
      !lead.gpaDetails
    ) {
      return "";
    }
    if (rawHsc) return rawHsc;
    const match = (lead.gpaDetails || "").match(/hsc\s*[:=-]?\s*(\d+(?:\.\d+)?)/i);
    return match ? match[1] : "";
  });
  const [studyGapYears, setStudyGapYears] = useState<number>(lead.studyGapYears ?? 0);
  const [japaneseProficiency, setJapaneseProficiency] = useState<
    CrmLead["japaneseProficiency"]
  >(lead.japaneseProficiency || "NONE");
  const [interest, setInterest] = useState<ServiceInterest>(
    lead.interest || "STUDENT_VISA_REGULAR"
  );
  const [status, setStatus] = useState<LeadStatus>(lead.status || "NEW");
  const [priority, setPriority] = useState<LeadPriority>(lead.priority || "WARM");
  const [assignedTo, setAssignedTo] = useState(
    lead.assignedTo || "Sales & Marketing Team"
  );
  const [branch, setBranch] = useState<"DHK-HQ" | "KHULNA-01">(
    lead.branch || "DHK-HQ"
  );
  const [followUpDate, setFollowUpDate] = useState(lead.followUpDate || "");
  const [notes, setNotes] = useState(lead.notes || "");
  const [targetSchool, setTargetSchool] = useState(
    lead.targetSchool || linkedVisa?.targetSchool || ""
  );
  const [partnerSchoolId, setPartnerSchoolId] = useState(
    lead.partnerSchoolId || linkedVisa?.partnerSchoolId || ""
  );
  const [b2bAgentId, setB2bAgentId] = useState(
    lead.b2bAgentId || linkedVisa?.b2bAgentId || ""
  );
  const [b2bAgentName, setB2bAgentName] = useState(
    lead.b2bAgentName || linkedVisa?.b2bAgentName || ""
  );
  const [contractAmountBdt, setContractAmountBdt] = useState<number>(
    lead.contractAmountBdt ??
      linkedVisa?.contractAmountBdt ??
      (lead.interest === "STUDENT_VISA_PREMIUM" ? 1100000 : 120000)
  );
  const [paidAmountBdt, setPaidAmountBdt] = useState<number>(
    lead.paidAmountBdt ?? linkedVisa?.paidAmountBdt ?? 0
  );
  const [sponsorBankName, setSponsorBankName] = useState(
    lead.sponsorBankName || linkedVisa?.sponsorBank || "Agrani Bank PLC"
  );
  const [sponsorBankBalanceBdt, setSponsorBankBalanceBdt] = useState<number>(
    lead.sponsorBankBalanceBdt ?? linkedVisa?.sponsorBalanceBdt ?? 1850000
  );

  // Documents, Tasks, AI Summary & Activity Timeline
  const [documents, setDocuments] = useState<LeadDocumentItem[]>(() =>
    getLeadDocumentChecklist(lead)
  );
  const [tasks, setTasks] = useState<ProfileTaskItem[]>(() =>
    lead.tasks && lead.tasks.length > 0
      ? lead.tasks
      : getDefaultTasksForLead(lead, isBn)
  );
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [aiSummary, setAiSummary] = useState<string>(lead.aiSummary || "");
  const [activityLog, setActivityLog] = useState<LeadActivityItem[]>(
    () => lead.activityLog || []
  );
  const [previewDoc, setPreviewDoc] = useState<{
    title: string;
    subtitle?: string;
    fileUrl: string;
    fileName?: string;
  } | null>(null);

  // Inline Status Update Composer State
  const [nextStatusInput, setNextStatusInput] = useState<LeadStatus>(
    lead.status === "NEW" ? "CONTACTED" : lead.status
  );
  const [statusUpdateNote, setStatusUpdateNote] = useState("");
  const [statusUpdateFollowUp, setStatusUpdateFollowUp] = useState(
    lead.followUpDate || ""
  );

  // Quick Fee Payment State (in Invoices tab)
  const [quickPayAmount, setQuickPayAmount] = useState<string>("");
  const [quickPayType, setQuickPayType] = useState<TransactionType>(
    "REGULAR_SERVICE_CHARGE"
  );
  const [quickPayMethod, setQuickPayMethod] = useState<
    FinancialTransaction["paymentMethod"]
  >("CASH_OFFICE");
  const [quickPayRef, setQuickPayRef] = useState<string>("");

  // Portal Login Provisioning State (in Applications tab)
  const [loginEmail, setLoginEmail] = useState(
    lead.loginEmail ||
      lead.email ||
      `${lead.name.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 10) || "student"}@knltc.jp`
  );
  const [loginPassword, setLoginPassword] = useState(
    lead.loginPassword || `Japan@${lead.phone.slice(-4) || "2027"}`
  );
  const [courseLevel, setCourseLevel] = useState<"N5" | "N4" | "IRODORI">(
    linkedLms?.courseLevel || "N5"
  );
  const [enrolledBatch, setEnrolledBatch] = useState(
    lead.enrolledBatchOrSession ||
      linkedLms?.activeBatch ||
      "JLPT N5 Regular Batch — April 2027"
  );

  // Eligibility Calculation
  const eligibility = useMemo(
    () =>
      calculateLeadEligibility({
        ...lead,
        education,
        sscGpa,
        hscGpa,
        studyGapYears,
        japaneseProficiency,
        sponsorBankBalanceBdt,
        documentChecklist: documents,
      }),
    [
      lead,
      education,
      sscGpa,
      hscGpa,
      studyGapYears,
      japaneseProficiency,
      sponsorBankBalanceBdt,
      documents,
    ]
  );

  const uploadedDocsCount = useMemo(
    () => documents.filter((d) => d.status !== "MISSING").length,
    [documents]
  );

  // Auto-generated narrative summary (matches reference screenshot style)
  const autoNarrativeSummary = useMemo(() => {
    if (aiSummary) return aiSummary;
    const programLabel = formatLeadInterestLabel(interest, isBn);
    const docPhrase =
      uploadedDocsCount > 0
        ? `has submitted ${uploadedDocsCount} of ${documents.length} required documents`
        : `has not yet submitted any applications or documents`;
    const recentNote =
      activityLog[0]?.note ||
      activityLog[0]?.summary ||
      (notes ? notes : "");
    const notePhrase = recentNote
      ? `In the recent update, the counselor noted: "${recentNote}".`
      : `In recent interactions, no specific concerns or questions were recorded.`;
    const nextAction =
      status === "NEW"
        ? "contact the candidate to verify academic transcripts and explain the Japan application roadmap."
        : status === "CONTACTED" || status === "COUNSELED"
          ? "guide the candidate on the application process and required documents for the chosen program."
          : status === "OFFICE_VISIT_BOOKED"
            ? "conduct the in-office assessment, finalize partner school selection, and open the COE file."
            : "complete COE documentation verification and track Japanese language batch progress.";

    const hasGpa = Boolean(sscGpa.trim() || hscGpa.trim());
    if (isBn) {
      const gpaSentenceBn = hasGpa
        ? `${name}-এর একাডেমিক প্রোফাইলে HSC GPA ${hscGpa || "—"} এবং SSC GPA ${sscGpa || "—"} এন্ট্রি করা আছে (${education || "HSC / Alim"})।`
        : `${name}-এর সর্বোচ্চ শিক্ষা ${education || "HSC / Alim"} (SSC ও HSC GPA এখনো যুক্ত করা হয়নি)।`;
      return `${gpaSentenceBn} তিনি জাপানের ${programLabel} প্রোগ্রামে আগ্রহী এবং এখন পর্যন্ত ${uploadedDocsCount}/${documents.length}টি ডকুমেন্ট জমা দিয়েছেন। ${recentNote ? `সাম্প্রতিক নোটে উল্লেখ আছে: "${recentNote}"।` : ""} কাউন্সেলরের জন্য পরবর্তী সবচেয়ে কার্যকর পদক্ষেপ হবে নির্বাচিত প্রোগ্রামের আবেদন প্রক্রিয়া ও প্রয়োজনীয় ডকুমেন্টগুলো সম্পর্কে তাকে গাইড করা।`;
    }
    const gpaSentenceEn = hasGpa
      ? `${name} has an academic profile (${education || "HSC / Alim"}) with an HSC GPA of ${hscGpa || "—"} and an SSC GPA of ${sscGpa || "—"}.`
      : `${name} holds a ${education || "HSC / Alim"} qualification (SSC & HSC GPA not yet recorded).`;
    return `${gpaSentenceEn} The candidate is interested in ${programLabel} in Japan and ${docPhrase}. ${notePhrase} The most useful next action for the counselor would be to ${nextAction}`;
  }, [
    aiSummary,
    interest,
    isBn,
    uploadedDocsCount,
    documents.length,
    activityLog,
    notes,
    status,
    name,
    education,
    hscGpa,
    sscGpa,
  ]);

  // Smart School & Program Matches
  const schoolMatches = useMemo(() => {
    const pSsc = parseFloat(sscGpa);
    const pHsc = parseFloat(hscGpa);
    const rawAvg =
      !isNaN(pSsc) && !isNaN(pHsc)
        ? (pSsc + pHsc) / 2
        : !isNaN(pHsc)
          ? pHsc
          : !isNaN(pSsc)
            ? pSsc
            : 3.5;
    const candidateGpa = Math.min(5, rawAvg);
    const baseSchools: JapanesePartnerSchool[] =
      partnerSchools.length > 0
        ? partnerSchools
        : [
            {
              id: "jp-sch-tokyo-1",
              name: "Tokyo International Japanese School",
              japaneseName: "東京国際日本語学院",
              institutionType: "LANGUAGE_SCHOOL",
              location: "Shinjuku, Tokyo",
              contactPerson: "Yamamoto Sensei",
              email: "admissions@tijs.ac.jp",
              commissionPerStudentYen: 120000,
              commissionPerStudentBdt: 96000,
              firstYearTuitionYen: 760000,
              intakeMonths: ["APRIL", "OCTOBER"],
              minGpaRequired: "3.00",
              maxStudyGapYears: 5,
              minLanguageLevel: "JLPT N5 / NAT 5Q",
              activeStudentsCount: 14,
              intakeQuota: 30,
              totalCommissionReceivedYen: 0,
              status: "ACTIVE_PARTNER",
            },
            {
              id: "jp-sch-osaka-2",
              name: "Osaka Meros Language Academy",
              japaneseName: "大阪メロス言語学院",
              institutionType: "LANGUAGE_SCHOOL",
              location: "Namba, Osaka",
              contactPerson: "Tanaka Kenji",
              email: "int@meros-osaka.jp",
              commissionPerStudentYen: 110000,
              commissionPerStudentBdt: 88000,
              firstYearTuitionYen: 720000,
              intakeMonths: ["APRIL", "JULY", "OCTOBER"],
              minGpaRequired: "2.80",
              maxStudyGapYears: 6,
              minLanguageLevel: "JLPT N5 / Studying",
              activeStudentsCount: 9,
              intakeQuota: 25,
              totalCommissionReceivedYen: 0,
              status: "ACTIVE_PARTNER",
            },
            {
              id: "jp-sch-fukuoka-3",
              name: "Fukuoka Kyushu Foreign Language Institute",
              japaneseName: "九州外国語学院（福岡）",
              institutionType: "LANGUAGE_SCHOOL",
              location: "Hakata, Fukuoka",
              contactPerson: "Sato Haruka",
              email: "apply@kyushu-fli.jp",
              commissionPerStudentYen: 100000,
              commissionPerStudentBdt: 80000,
              firstYearTuitionYen: 690000,
              intakeMonths: ["JANUARY", "APRIL", "JULY", "OCTOBER"],
              minGpaRequired: "2.50",
              maxStudyGapYears: 7,
              minLanguageLevel: "Beginner / N5 Prep",
              activeStudentsCount: 6,
              intakeQuota: 25,
              totalCommissionReceivedYen: 0,
              status: "ACTIVE_PARTNER",
            },
          ];

    return baseSchools
      .map((sch) => {
        const minGpa = parseFloat(sch.minGpaRequired || "2.80") || 2.8;
        const maxGap = sch.maxStudyGapYears ?? 5;
        let matchScore = 85;
        if (candidateGpa >= minGpa + 0.7) matchScore += 10;
        else if (candidateGpa >= minGpa) matchScore += 5;
        else matchScore -= 18;

        if (studyGapYears <= maxGap) matchScore += 4;
        else matchScore -= 15;

        matchScore = Math.max(45, Math.min(99, matchScore));
        const isCurrentTarget =
          (partnerSchoolId && sch.id === partnerSchoolId) ||
          (targetSchool &&
            sch.name.toLowerCase() === targetSchool.toLowerCase());

        return {
          school: sch,
          matchScore,
          isEligible: candidateGpa >= minGpa && studyGapYears <= maxGap + 1,
          isCurrentTarget,
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [partnerSchools, sscGpa, hscGpa, studyGapYears, partnerSchoolId, targetSchool]);

  // Persist helper
  const persistLeadChanges = (
    overrides?: Partial<CrmLead>,
    toastMsg?: string
  ) => {
    const due = Math.max(0, contractAmountBdt - paidAmountBdt);
    const resolvedSsc = (overrides?.sscGpa !== undefined ? overrides.sscGpa : sscGpa).trim();
    const resolvedHsc = (overrides?.hscGpa !== undefined ? overrides.hscGpa : hscGpa).trim();
    const resolvedGpaDetails =
      resolvedSsc || resolvedHsc
        ? `SSC: ${resolvedSsc || "N/A"}, HSC: ${resolvedHsc || "N/A"}`
        : "";
    const payload: Partial<CrmLead> = {
      name,
      phone,
      whatsapp,
      email,
      city,
      address,
      avatarUrl,
      passportNo,
      guardianName,
      guardianPhone,
      education,
      sscGpa: resolvedSsc,
      hscGpa: resolvedHsc,
      gpaDetails: resolvedGpaDetails,
      studyGapYears,
      japaneseProficiency,
      interest,
      status,
      priority,
      assignedTo,
      branch,
      followUpDate,
      notes,
      targetSchool,
      partnerSchoolId,
      b2bAgentId,
      b2bAgentName,
      contractAmountBdt,
      paidAmountBdt,
      dueAmountBdt: due,
      sponsorBankName,
      sponsorBankBalanceBdt,
      documentChecklist: documents,
      tasks,
      aiSummary,
      activityLog,
      ...overrides,
    };
    updateCrmLeadProfile(lead.id, payload);
    setStoreTick((t) => t + 1);
    if (toastMsg) {
      onSaved(toastMsg);
    }
  };

  // Generate AI Profile Summary via Gemini API
  const handleGenerateAiSummary = async () => {
    setIsGeneratingAi(true);
    try {
      const res = await fetch("/api/admin/ai-profile-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entityType: "LEAD",
          name,
          program: formatLeadInterestLabel(interest, false),
          status,
          sscGpa,
          hscGpa,
          education,
          japaneseProficiency: formatProficiencyLabel(japaneseProficiency, false),
          studyGapYears,
          uploadedDocsCount,
          totalDocsCount: documents.length,
          latestNote: activityLog[0]?.note || activityLog[0]?.summary || notes,
          city,
          language,
        }),
      });
      const data = await res.json();
      if (data.summary) {
        setAiSummary(data.summary);
        persistLeadChanges(
          { aiSummary: data.summary },
          tr(
            "AI প্রোফাইল সামারি আপডেট ও Google Sheet-এ সেভ হয়েছে",
            "AI Profile Summary updated & saved to Google Sheet"
          )
        );
      }
    } catch {
      onSaved(
        tr(
          "সামারি জেনারেট করতে সমস্যা হয়েছে",
          "Could not generate AI summary right now"
        )
      );
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Submit Inline Status Update (+ Add Update)
  const handleAddStatusUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const prevStatusLabel = STATUS_META[status]?.labelEn || status;
    const nextStatusLabel = STATUS_META[nextStatusInput]?.labelEn || nextStatusInput;
    const trimmedNote = statusUpdateNote.trim();

    const newLogItem: LeadActivityItem = {
      id: `act-${Date.now()}`,
      type: "STAGE_CHANGE",
      fromStatus: prevStatusLabel,
      toStatus: nextStatusLabel,
      note: trimmedNote || undefined,
      summary: trimmedNote
        ? `${prevStatusLabel} → ${nextStatusLabel}: "${trimmedNote}"`
        : `${prevStatusLabel} → ${nextStatusLabel}`,
      counselorName: assignedTo || "Counselor / system",
      createdAt: new Date().toISOString(),
    };

    const nextLog = [newLogItem, ...activityLog];
    setStatus(nextStatusInput);
    setActivityLog(nextLog);
    if (trimmedNote) setNotes(trimmedNote);
    if (statusUpdateFollowUp) setFollowUpDate(statusUpdateFollowUp);

    if (nextStatusInput === "ADMITTED" && status !== "ADMITTED") {
      updateCrmLeadStatus(lead.id, "ADMITTED", trimmedNote || notes);
    }

    persistLeadChanges(
      {
        status: nextStatusInput,
        notes: trimmedNote || notes,
        followUpDate: statusUpdateFollowUp || followUpDate,
        activityLog: nextLog,
      },
      tr(
        `স্ট্যাটাস "${nextStatusLabel}"-এ আপডেট ও টাইমলাইনে লগ করা হয়েছে`,
        `Status updated to "${nextStatusLabel}" & logged in timeline`
      )
    );
    setStatusUpdateNote("");
    setIsUpdateStatusOpen(false);
  };

  // Rate Lead (Priority Change)
  const handleRateLead = (nextPriority: LeadPriority) => {
    setPriority(nextPriority);
    const logEntry: LeadActivityItem = {
      id: `act-rate-${Date.now()}`,
      type: "MEETING_NOTE",
      fromStatus: STATUS_META[status]?.labelEn || status,
      toStatus: `${nextPriority} Lead`,
      note: `Lead rating updated to ${nextPriority}`,
      summary: `Rated lead as ${nextPriority}`,
      counselorName: assignedTo || "Counselor",
      createdAt: new Date().toISOString(),
    };
    const nextLog = [logEntry, ...activityLog];
    setActivityLog(nextLog);
    persistLeadChanges(
      { priority: nextPriority, activityLog: nextLog },
      tr(
        `লিড রেটিং "${nextPriority}" সেট করা হয়েছে`,
        `Lead rated as ${nextPriority}`
      )
    );
  };

  // Document Upload Handler
  const handleDocUpload = async (docItem: LeadDocumentItem, file: File) => {
    setUploadingDocId(docItem.id);
    try {
      const result = await uploadDocumentFile(file, "knltc-documents");
      const nextDocs = documents.map((d) =>
        d.id === docItem.id
          ? {
              ...d,
              status: "SUBMITTED" as const,
              fileUrl: result.url,
              fileName: file.name,
              updatedAt: new Date().toISOString().slice(0, 10),
            }
          : d
      );
      setDocuments(nextDocs);
      const docLog: LeadActivityItem = {
        id: `act-doc-${Date.now()}`,
        type: "DOC_UPDATE",
        fromStatus: "Documents",
        toStatus: "Uploaded",
        note: `Uploaded ${docItem.titleEn} (${file.name})`,
        summary: `Uploaded document: ${docItem.titleEn}`,
        counselorName: assignedTo || "Counselor",
        createdAt: new Date().toISOString(),
      };
      const nextLog = [docLog, ...activityLog];
      setActivityLog(nextLog);
      persistLeadChanges(
        { documentChecklist: nextDocs, activityLog: nextLog },
        tr(
          `"${docItem.titleBn}" সফলভাবে আপলোড ও সংরক্ষিত হয়েছে`,
          `"${docItem.titleEn}" uploaded & saved`
        )
      );
    } catch (err) {
      onSaved(
        err instanceof Error ? err.message : "Document upload failed"
      );
    } finally {
      setUploadingDocId(null);
    }
  };

  const formattedAddedDate = useMemo(() => {
    try {
      const d = new Date(lead.createdAt || new Date().toISOString());
      if (isNaN(d.getTime())) return "Oct 29, 2026";
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Oct 29, 2026";
    }
  }, [lead.createdAt]);

  const formatTimelineDate = (iso: string) => {
    try {
      const d = new Date(iso);
      if (isNaN(d.getTime())) return iso;
      return d.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return iso;
    }
  };

  // Synthesize timeline items so even imported Google Sheet rows show a rich timeline
  const timelineItems = useMemo(() => {
    const list: LeadActivityItem[] = [...activityLog];
    if (list.length === 0 && notes) {
      list.push({
        id: "seed-note-1",
        type: "CALL",
        fromStatus: "New Lead",
        toStatus: STATUS_META[status]?.labelEn || "Contacted",
        note: notes,
        summary: notes,
        counselorName: assignedTo || "AI / system",
        createdAt: lead.lastContactedAt || lead.createdAt || new Date().toISOString(),
      });
    }
    list.push({
      id: "seed-created-0",
      type: "STAGE_CHANGE",
      toStatus: "New Lead",
      summary: `Lead added from ${formatLeadSourceLabel(lead.source)}`,
      counselorName: "AI / system",
      createdAt: lead.createdAt || new Date().toISOString(),
    });
    return list;
  }, [activityLog, notes, status, assignedTo, lead.lastContactedAt, lead.createdAt, lead.source]);

  const openTasksCount = tasks.filter((t) => !t.completed).length;
  const dueAmountBdt = Math.max(0, contractAmountBdt - paidAmountBdt);

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#F8FAFC] rounded-2xl border border-slate-200/80 p-5 sm:p-8 shadow-2xs">
      {/* =====================================================================
          1. TOP BACK BAR & PREV / NEXT RECORD NAVIGATION
          ===================================================================== */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{backLabel || tr("লিড তালিকায় ফিরে যান", "Back to Leads", "リード一覧へ戻る")}</span>
        </button>

        {allLeads.length > 1 && onSelectLead && (
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 py-1 shadow-2xs">
            <button
              type="button"
              disabled={!prevLead}
              onClick={() => prevLead && onSelectLead(prevLead)}
              className="rounded-lg p-1 text-slate-600 hover:bg-slate-100 disabled:opacity-35 transition"
              title="Previous Lead"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-[11px] font-semibold text-slate-500 tabular-nums px-1.5">
              {currentLeadIndex + 1} / {allLeads.length}
            </span>
            <button
              type="button"
              disabled={!nextLead}
              onClick={() => nextLead && onSelectLead(nextLead)}
              className="rounded-lg p-1 text-slate-600 hover:bg-slate-100 disabled:opacity-35 transition"
              title="Next Lead"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* =====================================================================
          2. CANDIDATE IDENTITY HEADER (Matches Reference Screenshot)
          ===================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5 mb-7">
        <div className="flex items-start gap-4">
          {/* Circular Avatar with Photo Upload Support */}
          <label className="relative group flex h-14 w-14 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#2563EB] text-white text-xl font-bold shadow-xs overflow-hidden">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span>{name.trim().charAt(0).toUpperCase() || "A"}</span>
            )}
            <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
              {uploadingAvatar ? (
                <Loader2 className="h-4 w-4 animate-spin text-white" />
              ) : (
                <Camera className="h-4 w-4 text-white" />
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setUploadingAvatar(true);
                try {
                  const res = await uploadMediaImage(file, "knltc-media");
                  setAvatarUrl(res.url);
                  persistLeadChanges(
                    { avatarUrl: res.url },
                    tr("প্রোফাইল ছবি আপলোড হয়েছে", "Profile photo updated")
                  );
                } catch {
                  onSaved(tr("ছবি আপলোড ব্যর্থ হয়েছে", "Photo upload failed"));
                } finally {
                  setUploadingAvatar(false);
                }
              }}
            />
          </label>

          <div>
            {/* Name + Edit Button + Delete Icon */}
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {name}
              </h1>

              <button
                type="button"
                onClick={() => setIsEditingModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs transition cursor-pointer"
              >
                <Edit3 className="h-3.5 w-3.5 text-slate-500" />
                <span>{tr("এডিট", "Edit", "編集")}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  deleteCrmLead(lead.id);
                  if (onDeleted) onDeleted(name);
                  onClose();
                }}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer"
                title={tr("লিড মুছে ফেলুন", "Delete Lead")}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            {/* Subtitle: Globe · Country · Program */}
            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 mt-1">
              <Globe className="h-3.5 w-3.5 text-slate-400" />
              <span>
                Japan · {formatLeadInterestLabel(interest, isBn)}
              </span>
              {city && (
                <span className="text-slate-400">· {city}</span>
              )}
            </div>

            {/* Status Pill + Rate Lead Dropdown */}
            <div className="flex flex-wrap items-center gap-2.5 mt-3">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${STATUS_META[status]?.badgeClass || "bg-blue-50 text-blue-700 border-blue-200"}`}
              >
                <Phone className="h-3 w-3" />
                <span>
                  {isBn
                    ? STATUS_META[status]?.labelBn
                    : STATUS_META[status]?.labelEn}
                </span>
              </span>

              <select
                value={priority}
                onChange={(e) => handleRateLead(e.target.value as LeadPriority)}
                aria-label="Rate lead"
                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 shadow-2xs cursor-pointer focus:outline-none focus:border-indigo-400"
              >
                <option value="HOT">
                  {tr("রেট লিড: Hot (অগ্রাধিকার)", "Rate lead: Hot 🔥", "評価: Hot")}
                </option>
                <option value="WARM">
                  {tr("রেট লিড: Warm (আগ্রহী)", "Rate lead: Warm ⭐", "評価: Warm")}
                </option>
                <option value="COLD">
                  {tr("রেট লিড: Cold (সাধারণ)", "Rate lead: Cold ❄️", "評価: Cold")}
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Quick Outreach Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={`tel:${phone.replace(/[^0-9+]/g, "")}`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs transition"
          >
            <PhoneCall className="h-3.5 w-3.5 text-blue-600" />
            <span>{tr("সরাসরি কল", "Call Now", "電話発信")}</span>
          </a>
          <a
            href={`https://wa.me/${(whatsapp || phone).replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
              `আসসালামু আলাইকুম ${name}, KNLTC (Japan Education & Career) থেকে যোগাযোগ করছি।`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-700 shadow-2xs transition"
          >
            <Send className="h-3.5 w-3.5" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>

      {/* =====================================================================
          3. 6-TAB HORIZONTAL NAVIGATION BAR (Overview, Tasks, Documents, Matches, Applications, Invoices)
          ===================================================================== */}
      <div className="border-b border-slate-200/90 mb-6 overflow-x-auto">
        <nav className="flex items-center gap-6 min-w-max">
          {(
            [
              {
                id: "overview" as WorkspaceTabId,
                label: tr("ওভারভিউ", "Overview", "概要"),
                icon: User,
                badge: undefined as string | number | undefined,
              },
              {
                id: "tasks" as WorkspaceTabId,
                label: tr("টাস্কসমূহ", "Tasks", "タスク"),
                icon: CheckSquare,
                badge: openTasksCount > 0 ? openTasksCount : undefined,
              },
              {
                id: "documents" as WorkspaceTabId,
                label: tr("ডকুমেন্টস", "Documents", "必要書類"),
                icon: FolderOpen,
                badge: `${uploadedDocsCount}/${documents.length}`,
              },
              {
                id: "matches" as WorkspaceTabId,
                label: tr("স্কুল ম্যাচিং", "Matches", "マッチング"),
                icon: Sparkles,
                badge: schoolMatches.length,
              },
              {
                id: "applications" as WorkspaceTabId,
                label: tr("অ্যাপ্লিকেশন ও ভিসা", "Applications", "申請・ビザ"),
                icon: Landmark,
                badge: linkedVisa ? `Stage ${linkedVisa.stage}` : undefined,
              },
              {
                id: "invoices" as WorkspaceTabId,
                label: tr("ইনভয়েস ও ফি", "Invoices", "請求・入金"),
                icon: Receipt,
                badge: studentTransactions.length > 0 ? studentTransactions.length : undefined,
              },
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`group relative flex items-center gap-2 py-3.5 text-xs sm:text-sm font-semibold transition cursor-pointer ${
                  isActive
                    ? "text-slate-900"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Icon
                  className={`h-4 w-4 ${
                    isActive
                      ? "text-indigo-600"
                      : "text-slate-400 group-hover:text-slate-600"
                  }`}
                />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold tabular-nums ${
                      isActive
                        ? "bg-indigo-50 text-indigo-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-indigo-600" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* =====================================================================
          TAB 1: OVERVIEW (Exact 2-Column Layout from Reference Screenshot)
          ===================================================================== */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN (4 cols): LEAD INFORMATION + ACADEMIC PROFILE */}
          <div className="lg:col-span-4 space-y-5">
            {/* LEAD INFORMATION CARD */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-5">
                {tr("লিড ইনফরমেশন", "LEAD INFORMATION", "基本情報")}
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Phone className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {tr("ফোন", "PHONE", "電話番号")}
                    </div>
                    <div className="text-sm font-medium text-slate-900 font-mono mt-0.5">
                      {phone || "Not provided"}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {tr("ইমেইল", "EMAIL", "メールアドレス")}
                    </div>
                    <div className="text-sm font-medium text-slate-900 break-all mt-0.5">
                      {email || `${name.toLowerCase().replace(/[^a-z0-9]/g, "")}@gmail.com`}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Globe className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {tr("দেশ ও শহর", "COUNTRY", "対象国・都市")}
                    </div>
                    <div className="text-sm font-medium text-slate-900 mt-0.5">
                      Japan {city ? `(${city})` : ""}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <GraduationCap className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {tr("প্রোগ্রাম", "PROGRAM", "希望プログラム")}
                    </div>
                    <div className="text-sm font-medium text-slate-900 mt-0.5">
                      {formatLeadInterestLabel(interest, isBn)}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Tag className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {tr("উৎস / সোর্স", "SOURCE", "流入元")}
                    </div>
                    <div className="text-sm font-medium text-slate-900 mt-0.5">
                      {formatLeadSourceLabel(lead.source)}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {tr("যুক্ত করার তারিখ", "ADDED", "登録日")}
                    </div>
                    <div className="text-sm font-medium text-slate-900 mt-0.5">
                      {formattedAddedDate}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">
                    {tr("কাউন্সেলর ও শাখা", "Counselor & Branch", "担当・拠点")}
                  </span>
                  <span className="font-semibold text-slate-800">
                    {assignedTo} ({branch === "KHULNA-01" ? "Khulna" : "Dhaka HQ"})
                  </span>
                </div>
              </div>
            </div>

            {/* ACADEMIC PROFILE CARD (Soft Indigo Tinted Card with Inline Degree Dropdown & Real GPA Sync) */}
            <div className="rounded-2xl border border-indigo-100/90 bg-[#EEF2FF]/75 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
                  {tr("একাডেমিক প্রোফাইল", "ACADEMIC PROFILE", "学歴・語学プロファイル")}
                </h2>
                <button
                  type="button"
                  onClick={() => setIsEditingModalOpen(true)}
                  className="text-[11px] font-semibold text-indigo-600 hover:underline cursor-pointer"
                >
                  {tr("সম্পূর্ণ এডিট", "Full Edit", "編集")}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-y-4 gap-x-4">
                <div>
                  <label className="text-xs text-slate-500 block">SSC GPA</label>
                  <input
                    type="text"
                    value={sscGpa}
                    onChange={(e) => setSscGpa(e.target.value)}
                    onBlur={() =>
                      persistLeadChanges(
                        { sscGpa: sscGpa.trim() },
                        tr(
                          "SSC GPA গুগল শিটে সংরক্ষিত হয়েছে",
                          "SSC GPA saved & synced to Google Sheet"
                        )
                      )
                    }
                    placeholder={tr("যুক্ত করুন (যেমন 4.50)", "Add GPA (e.g. 4.50)")}
                    className="mt-1 w-full rounded-lg border border-indigo-200/80 bg-white/90 px-2.5 py-1.5 text-sm font-bold text-slate-900 tabular-nums placeholder:text-xs placeholder:font-normal placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-500 block">HSC / Dip. GPA</label>
                  <input
                    type="text"
                    value={hscGpa}
                    onChange={(e) => setHscGpa(e.target.value)}
                    onBlur={() =>
                      persistLeadChanges(
                        { hscGpa: hscGpa.trim() },
                        tr(
                          "HSC GPA গুগল শিটে সংরক্ষিত হয়েছে",
                          "HSC GPA saved & synced to Google Sheet"
                        )
                      )
                    }
                    placeholder={tr("যুক্ত করুন (যেমন 4.25)", "Add GPA (e.g. 4.25)")}
                    className="mt-1 w-full rounded-lg border border-indigo-200/80 bg-white/90 px-2.5 py-1.5 text-sm font-bold text-slate-900 tabular-nums placeholder:text-xs placeholder:font-normal placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="text-xs text-slate-500 block">
                    {tr("সর্বোচ্চ ডিগ্রি", "Highest Degree", "最終学歴")}
                  </label>
                  <select
                    value={education}
                    onChange={(e) => {
                      const nextEdu = e.target.value;
                      setEducation(nextEdu);
                      persistLeadChanges(
                        { education: nextEdu },
                        tr(
                          `সর্বোচ্চ ডিগ্রি "${nextEdu}" গুগল শিটে সেভ হয়েছে`,
                          `Highest Degree updated to "${nextEdu}"`
                        )
                      );
                    }}
                    className="mt-1 w-full rounded-lg border border-indigo-200/80 bg-white/90 px-2 py-1.5 text-xs font-bold text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none cursor-pointer"
                  >
                    {education &&
                      !(STANDARD_DEGREE_OPTIONS as readonly string[]).includes(education) && (
                        <option value={education}>{education}</option>
                      )}
                    {STANDARD_DEGREE_OPTIONS.map((deg) => (
                      <option key={deg} value={deg}>
                        {deg}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <div className="text-xs text-slate-500">
                    {tr("ভাষা ও যোগ্যতা", "Language & Score", "日本語・適格率")}
                  </div>
                  <div className="text-sm font-bold text-indigo-700 tabular-nums mt-2">
                    {formatProficiencyLabel(japaneseProficiency, isBn)} ·{" "}
                    {eligibility.totalScore}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (8 cols): AI PROFILE SUMMARY + UPDATE STATUS + ACTIVITY TIMELINE */}
          <div className="lg:col-span-8 space-y-5">
            {/* 1. AI PROFILE SUMMARY CARD */}
            <div className="rounded-2xl border border-violet-200/80 bg-[#F5F3FF]/70 p-6 shadow-2xs">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-violet-700">
                  <Sparkles className="h-3.5 w-3.5 text-violet-600" />
                  <span>
                    {tr("এআই প্রোফাইল সামারি", "AI PROFILE SUMMARY", "AIプロファイル要約")}
                  </span>
                </div>

                <button
                  type="button"
                  disabled={isGeneratingAi}
                  onClick={handleGenerateAiSummary}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-violet-200 bg-white px-3 py-1 text-[11px] font-semibold text-violet-700 hover:bg-violet-50 disabled:opacity-50 transition cursor-pointer shadow-2xs"
                >
                  {isGeneratingAi ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Sparkles className="h-3 w-3" />
                  )}
                  <span>
                    {isGeneratingAi
                      ? tr("বিশ্লেষণ হচ্ছে...", "Generating...", "生成中...")
                      : tr("১-ক্লিক AI পরামর্শ", "1-Click AI Advise", "AIアドバイス生成")}
                  </span>
                </button>
              </div>

              <p className="text-sm leading-relaxed text-slate-800">
                {autoNarrativeSummary}
              </p>
            </div>

            {/* 2. UPDATE STATUS CARD */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                    {tr("স্ট্যাটাস আপডেট", "UPDATE STATUS", "ステータス更新")}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold ${STATUS_META[status]?.badgeClass || "bg-blue-50 text-blue-700 border-blue-200"}`}
                    >
                      <Phone className="h-3.5 w-3.5" />
                      <span>
                        {isBn
                          ? STATUS_META[status]?.labelBn
                          : STATUS_META[status]?.labelEn}
                      </span>
                    </span>
                    <span className="text-xs text-slate-400">
                      — {tr("বর্তমান স্ট্যাটাস", "current status", "現在のステータス")}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsUpdateStatusOpen((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>{tr("আপডেট যোগ করুন", "Add Update", "更新を追加")}</span>
                </button>
              </div>

              {/* Expandable Inline Status + Call Note Composer */}
              {isUpdateStatusOpen && (
                <form
                  onSubmit={handleAddStatusUpdate}
                  className="mt-5 pt-5 border-t border-slate-100 space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                        {tr("নতুন স্ট্যাটাস নির্বাচন করুন", "New Status", "新しいステータス")}
                      </label>
                      <select
                        value={nextStatusInput}
                        onChange={(e) =>
                          setNextStatusInput(e.target.value as LeadStatus)
                        }
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800"
                      >
                        <option value="NEW">New Lead</option>
                        <option value="CONTACTED">Contacted</option>
                        <option value="COUNSELED">Counseled</option>
                        <option value="OFFICE_VISIT_BOOKED">Office Visit Booked</option>
                        <option value="ADMITTED">Admitted (Confirm &amp; Open Visa File)</option>
                        <option value="ARCHIVED">Archived / Closed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                        {tr("পরবর্তী ফলো-আপ তারিখ", "Next Follow-up Date", "次回フォロー日")}
                      </label>
                      <input
                        type="date"
                        value={statusUpdateFollowUp}
                        onChange={(e) => setStatusUpdateFollowUp(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      {tr("কল / কাউন্সেলিং নোট", "Call / Counseling Note", "通話・面談メモ")}
                    </label>
                    <textarea
                      rows={2}
                      value={statusUpdateNote}
                      onChange={(e) => setStatusUpdateNote(e.target.value)}
                      placeholder={tr(
                        "যেমন: সৌজন্যমূলক কথাবার্তা হয়েছে। উনি একটু ব্যস্ত আছেন, আগামীকাল রাত ৯টার পর ফ্রি থাকবেন...",
                        'e.g. "Sowjonno mulok kotha barta hoyeche. uni ektu busy achen agamikal rat 9 tar por free thakben."',
                        "通話内容や次回アクションを記入..."
                      )}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsUpdateStatusOpen(false)}
                      className="rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      {tr("বাতিল", "Cancel", "キャンセル")}
                    </button>
                    <button
                      type="submit"
                      className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition cursor-pointer"
                    >
                      {tr("আপডেট সেভ করুন", "Save Update", "更新を保存")}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* 3. ACTIVITY TIMELINE CARD */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-5">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                <span>
                  {tr("অ্যাক্টিভিটি টাইমলাইন", "ACTIVITY TIMELINE", "活動タイムライン")}
                </span>
              </div>

              <div className="relative pl-6 border-l-2 border-slate-100 space-y-6 ml-2">
                {timelineItems.map((item, idx) => {
                  const isLatest = idx === 0;
                  const noteContent = item.note || item.summary;
                  return (
                    <div key={item.id} className="relative">
                      {/* Timeline Node Dot */}
                      <span
                        className={`absolute -left-[31px] top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full ring-4 ring-white ${
                          isLatest ? "bg-blue-500" : "bg-slate-400"
                        }`}
                      />

                      {/* Status Transition Line: e.g. New Lead -> [Contacted] */}
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        {item.fromStatus ? (
                          <>
                            <span className="text-slate-500 font-medium">
                              {item.fromStatus}
                            </span>
                            <span className="text-slate-400">→</span>
                            <span className="rounded-full bg-blue-50 border border-blue-200/80 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                              {item.toStatus || "Contacted"}
                            </span>
                          </>
                        ) : (
                          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                            {item.toStatus || "New Lead"}
                          </span>
                        )}
                      </div>

                      {/* Timestamp & Actor */}
                      <div className="text-[11px] text-slate-400 mt-1">
                        {formatTimelineDate(item.createdAt)} ·{" "}
                        {item.counselorName || "AI / system"}
                      </div>

                      {/* Quoted Note */}
                      {noteContent &&
                        !noteContent.startsWith("Lead added from") && (
                          <p className="text-xs sm:text-sm italic text-slate-600 mt-1.5 leading-relaxed">
                            &ldquo;{noteContent.replace(/^["“]|["”]$/g, "")}&rdquo;
                          </p>
                        )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 2: TASKS (Interactive Counselor & Document Follow-up Checklist)
          ===================================================================== */}
      {activeTab === "tasks" && (
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {tr(
                  "কাউন্সেলর ও অ্যাডমিশন ফলো-আপ টাস্ক",
                  "Counselor & Admission Tasks",
                  "カウンセラー・出願タスク"
                )}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {tr(
                  "এই শিক্ষার্থীর ফাইল প্রসেসিং ও ফলো-আপের ধাপগুলো টিক দিয়ে সম্পন্ন করুন",
                  "Track follow-up calls, document collection, and interview tasks synced to Google Sheets."
                )}
              </p>
            </div>

            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
              {tasks.filter((t) => t.completed).length} / {tasks.length}{" "}
              {tr("সম্পন্ন", "Completed", "完了")}
            </span>
          </div>

          {/* Add New Task Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!newTaskTitle.trim()) return;
              const newItem: ProfileTaskItem = {
                id: `task-${Date.now()}`,
                title: newTaskTitle.trim(),
                dueDate: newTaskDueDate || undefined,
                completed: false,
                category: "GENERAL",
                assignee: assignedTo,
              };
              const nextTasks = [newItem, ...tasks];
              setTasks(nextTasks);
              setNewTaskTitle("");
              setNewTaskDueDate("");
              persistLeadChanges(
                { tasks: nextTasks },
                tr("নতুন টাস্ক যুক্ত হয়েছে", "Task added & saved")
              );
            }}
            className="flex flex-col sm:flex-row gap-2.5 pt-2"
          >
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder={tr(
                "নতুন টাস্ক লিখুন (যেমন: আগামীকাল অভিভাবকের সাথে জুম মিটিং)...",
                "Add a new task for this candidate (e.g. Schedule guardian Zoom call)..."
              )}
              className="flex-1 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:outline-none"
            />
            <input
              type="date"
              value={newTaskDueDate}
              onChange={(e) => setNewTaskDueDate(e.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>{tr("টাস্ক যোগ করুন", "Add Task", "追加")}</span>
            </button>
          </form>

          {/* Tasks List */}
          <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-xl overflow-hidden">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-center justify-between gap-4 p-4 transition ${
                  task.completed ? "bg-slate-50/70" : "bg-white hover:bg-slate-50/40"
                }`}
              >
                <label className="flex items-start gap-3 cursor-pointer flex-1">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => {
                      const nextTasks = tasks.map((t) =>
                        t.id === task.id ? { ...t, completed: !t.completed } : t
                      );
                      setTasks(nextTasks);
                      persistLeadChanges(
                        { tasks: nextTasks },
                        tr("টাস্ক স্ট্যাটাস আপডেট হয়েছে", "Task status updated")
                      );
                    }}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <div
                      className={`text-xs sm:text-sm font-medium ${
                        task.completed
                          ? "line-through text-slate-400"
                          : "text-slate-900"
                      }`}
                    >
                      {task.title}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-slate-400">
                      <span>{task.assignee || assignedTo}</span>
                      {task.dueDate && <span>· Due: {task.dueDate}</span>}
                    </div>
                  </div>
                </label>

                <button
                  type="button"
                  onClick={() => {
                    const nextTasks = tasks.filter((t) => t.id !== task.id);
                    setTasks(nextTasks);
                    persistLeadChanges({ tasks: nextTasks });
                  }}
                  className="text-slate-300 hover:text-rose-600 p-1 rounded-lg transition"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 3: DOCUMENTS (12-Item Japan COE & Embassy Document Vault)
          ===================================================================== */}
      {activeTab === "documents" && (
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {tr(
                  "জাপান COE ও এম্বাসি ১২টি ডকুমেন্ট ভল্ট",
                  "Japan COE & Embassy 12-Document Vault",
                  "日本COE・大使館提出12書類チェックリスト"
                )}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {tr(
                  "সরাসরি পিডিএফ বা ছবি আপলোড করুন — প্রতিটি ফাইলের ডিরেক্ট লিংক স্বয়ংক্রিয়ভাবে প্রোফাইল ও শিট কলামে সংরক্ষিত হবে",
                  "Upload PDFs or images directly and preview or download them anytime."
                )}
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  { id: "ALL", label: tr("সব (১২)", "All (12)") },
                  { id: "IDENTITY", label: tr("পরিচয়পত্র", "Identity") },
                  { id: "ACADEMIC", label: tr("একাডেমিক", "Academic") },
                  { id: "LANGUAGE", label: tr("ভাষা সনদ", "Language") },
                  { id: "SPONSOR_FINANCIAL", label: tr("স্পন্সর ও ব্যাংক", "Financial") },
                ] as const
              ).map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setDocCategoryFilter(cat.id)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                    docCategoryFilter === cat.id
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {documents
              .filter(
                (d) =>
                  docCategoryFilter === "ALL" || d.category === docCategoryFilter
              )
              .map((doc) => {
                const isUploading = uploadingDocId === doc.id;
                return (
                  <div
                    key={doc.id}
                    className="flex flex-col justify-between rounded-xl border border-slate-200/90 p-4 hover:border-slate-300 transition gap-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-xs sm:text-sm font-semibold text-slate-900">
                          {isBn ? doc.titleBn : doc.titleEn}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {doc.fileName
                            ? `${doc.fileName} (${doc.updatedAt || "Uploaded"})`
                            : tr("এখনো ফাইল আপলোড করা হয়নি", "No file uploaded yet")}
                        </div>
                      </div>

                      <select
                        value={doc.status}
                        onChange={(e) => {
                          const nextStatus = e.target
                            .value as LeadDocumentItem["status"];
                          const nextDocs = documents.map((d) =>
                            d.id === doc.id ? { ...d, status: nextStatus } : d
                          );
                          setDocuments(nextDocs);
                          persistLeadChanges(
                            { documentChecklist: nextDocs },
                            tr("ডকুমেন্ট স্ট্যাটাস আপডেট হয়েছে", "Document status updated")
                          );
                        }}
                        className={`rounded-lg border px-2.5 py-1 text-[11px] font-bold ${
                          doc.status === "VERIFIED"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : doc.status === "SUBMITTED"
                              ? "border-blue-200 bg-blue-50 text-blue-700"
                              : "border-slate-200 bg-slate-50 text-slate-600"
                        }`}
                      >
                        <option value="MISSING">{tr("বাকি (Missing)", "Missing")}</option>
                        <option value="SUBMITTED">{tr("জমা হয়েছে (Submitted)", "Submitted")}</option>
                        <option value="VERIFIED">{tr("যাচাইকৃত (Verified)", "Verified")}</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                      <label className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer transition">
                        {isUploading ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-600" />
                        ) : (
                          <Upload className="h-3.5 w-3.5 text-indigo-600" />
                        )}
                        <span>
                          {isUploading
                            ? tr("আপলোড হচ্ছে...", "Uploading...")
                            : doc.fileUrl
                              ? tr("নতুন ফাইল আপলোড", "Replace File")
                              : tr("ফাইল আপলোড", "Upload File")}
                        </span>
                        <input
                          type="file"
                          accept=".pdf,image/*"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) handleDocUpload(doc, f);
                          }}
                        />
                      </label>

                      {doc.fileUrl && (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              setPreviewDoc({
                                title: isBn ? doc.titleBn : doc.titleEn,
                                subtitle: `${name} • ${doc.fileName || "Document"}`,
                                fileUrl: doc.fileUrl!,
                                fileName: doc.fileName,
                              })
                            }
                            className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 border border-indigo-200 px-2.5 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>{tr("ফাইল দেখুন", "View File")}</span>
                          </button>
                          <a
                            href={
                              doc.fileUrl.includes("/api/media/file/")
                                ? `${doc.fileUrl}${doc.fileUrl.includes("?") ? "&" : "?"}download=1`
                                : doc.fileUrl
                            }
                            download={doc.fileName || doc.titleEn}
                            className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
                            title={tr("ডাউনলোড", "Download")}
                          >
                            <Download className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 4: MATCHES (Smart Japanese Partner School & Program Matcher)
          ===================================================================== */}
      {activeTab === "matches" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  {tr(
                    "স্মার্ট জাপানি স্কুল ও প্রোগ্রাম ম্যাচিং",
                    "Recommended Japanese Partner Schools & Programs",
                    "AI推奨提携日本語学校・プログラム"
                  )}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {tr(
                    `প্রার্থীর SSC GPA (${sscGpa}), HSC GPA (${hscGpa}), এবং Study Gap (${studyGapYears} বছর) অনুযায়ী স্বয়ংক্রিয়ভাবে র‍্যাঙ্ক করা হয়েছে`,
                    `Automatically ranked based on SSC GPA (${sscGpa}), HSC GPA (${hscGpa}), and Study Gap (${studyGapYears} yrs).`
                  )}
                </p>
              </div>

              {targetSchool && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3.5 py-1 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>
                    {tr("নির্বাচিত স্কুল:", "Selected:")} {targetSchool}
                  </span>
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {schoolMatches.map(({ school, matchScore, isCurrentTarget }) => (
                <div
                  key={school.id}
                  className={`flex flex-col justify-between rounded-2xl border p-5 transition ${
                    isCurrentTarget
                      ? "border-indigo-500 bg-indigo-50/30 ring-1 ring-indigo-500"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700 tabular-nums">
                        {matchScore}% Match
                      </span>
                      <span className="text-[11px] font-medium text-slate-400">
                        {school.location}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900">
                      {school.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {school.japaneseName}
                    </p>

                    <div className="mt-4 space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                      <div className="flex justify-between">
                        <span className="text-slate-400">1st Year Tuition:</span>
                        <span className="font-semibold text-slate-900 tabular-nums">
                          ¥{(school.firstYearTuitionYen || 760000).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Min GPA Req:</span>
                        <span className="font-semibold text-slate-900 tabular-nums">
                          {school.minGpaRequired || "2.80"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Max Study Gap:</span>
                        <span className="font-semibold text-slate-900 tabular-nums">
                          {school.maxStudyGapYears ?? 5} Years
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setTargetSchool(school.name);
                      setPartnerSchoolId(school.id);
                      const logItem: LeadActivityItem = {
                        id: `act-sch-${Date.now()}`,
                        type: "STAGE_CHANGE",
                        fromStatus: "School Match",
                        toStatus: school.name,
                        note: `Matched and assigned candidate to ${school.name} (${school.location})`,
                        summary: `Assigned school: ${school.name}`,
                        counselorName: assignedTo || "Counselor",
                        createdAt: new Date().toISOString(),
                      };
                      const nextLog = [logItem, ...activityLog];
                      setActivityLog(nextLog);
                      persistLeadChanges(
                        {
                          targetSchool: school.name,
                          targetSchoolName: school.name,
                          partnerSchoolId: school.id,
                          targetSchoolId: school.id,
                          activityLog: nextLog,
                        },
                        tr(
                          `"${school.name}" এই শিক্ষার্থীর জন্য নির্বাচন করা হয়েছে`,
                          `Matched & assigned "${school.name}"`
                        )
                      );
                    }}
                    className={`mt-4 w-full rounded-xl py-2 text-xs font-semibold transition cursor-pointer ${
                      isCurrentTarget
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-900 text-white hover:bg-slate-800"
                    }`}
                  >
                    {isCurrentTarget
                      ? tr("✓ বর্তমান নির্বাচিত স্কুল", "✓ Selected Target School")
                      : tr("এই স্কুলে এসাইন করুন", "Select & Match School")}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 5: APPLICATIONS (Multi-Track Visa Pipeline + LMS & Student Login)
          ===================================================================== */}
      {activeTab === "applications" &&
        (() => {
          const activeCandidateTrack = resolveVisaTrack(
            linkedVisa || undefined,
            { ...lead, interest, targetSchool },
          );
          const candidateTrackStages = getStagesForVisaTrack(activeCandidateTrack);

          return (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Multi-Track Visa Application Tracker */}
              <div className="lg:col-span-7 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      {activeCandidateTrack === "TITP"
                        ? tr(
                            "TITP টেকনিক্যাল ইন্টার্ন ভিসা ট্র্যাকার (৯ ধাপ)",
                            "TITP Technical Intern Visa Pipeline (9 Stages)",
                            "技能実習（TITP）ビザ9段階トラッカー",
                          )
                        : activeCandidateTrack === "SSW"
                          ? tr(
                              "SSW জব ভিসা অ্যাপ্লিকেশন ট্র্যাকার (১০ ধাপ)",
                              "SSW Job Visa Application Pipeline (10 Stages)",
                              "特定技能（SSW）ビザ10段階トラッカー",
                            )
                          : tr(
                              "স্টুডেন্ট ভিসা ও COE অ্যাপ্লিকেশন ট্র্যাকার (১০ ধাপ)",
                              "Student Visa & COE Application Pipeline (10 Stages)",
                              "留学ビザ・COE 10段階申請トラッカー",
                            )}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {linkedVisa
                        ? `Tracking ID: ${linkedVisa.trackingNo} · Institution: ${linkedVisa.targetSchool}`
                        : tr(
                            "এখনো ভিসা ফাইল ওপেন করা হয়নি — নিচে ক্লিক করে ভিসা পাইপলাইনে যুক্ত করুন",
                            "Not yet in Visa Pipeline — click below to open Visa File",
                          )}
                    </p>
                  </div>

                  {!linkedVisa && (
                    <button
                      type="button"
                      onClick={() => {
                        promoteLeadToVisaPipeline({
                          leadId: lead.id,
                          targetSchool: targetSchool || "Tokyo International Japanese School",
                          partnerSchoolId,
                          b2bAgentId,
                          packageType:
                            interest === "STUDENT_VISA_PREMIUM" ? "PREMIUM" : "REGULAR",
                          visaTrack: activeCandidateTrack,
                          contractAmountBdt,
                        });
                        setStatus("ADMITTED");
                        setStoreTick((t) => t + 1);
                        onSaved(
                          tr(
                            `ভিসা ফাইল ওপেন হয়েছে (${activeCandidateTrack} পাইপলাইন)`,
                            `Visa file opened in ${activeCandidateTrack} Kanban pipeline`,
                          ),
                        );
                      }}
                      className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition cursor-pointer"
                    >
                      {tr("+ ভিসা ফাইল ওপেন করুন", "+ Open Visa Application File")}
                    </button>
                  )}
                </div>

                {/* Track Switcher inside 360 Profile */}
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-100 p-1.5">
                  <span className="px-2 text-[11px] font-semibold text-slate-600">
                    {tr("ভিসা পাইপলাইন ট্র্যাক:", "Pipeline Track:")}
                  </span>
                  <div className="flex flex-wrap items-center gap-1">
                    {(
                      [
                        { id: "STUDENT", labelBn: "স্টুডেন্ট ভিসা (১০ ধাপ)", labelEn: "Student Visa (10)" },
                        { id: "SSW", labelBn: "SSW জব ভিসা (১০ ধাপ)", labelEn: "SSW Job Visa (10)" },
                        { id: "TITP", labelBn: "TITP ইন্টার্ন ভিসা (৯ ধাপ)", labelEn: "TITP Intern (9)" },
                      ] as { id: VisaTrack; labelBn: string; labelEn: string }[]
                    ).map((tOpt) => (
                      <button
                        key={tOpt.id}
                        type="button"
                        onClick={() => {
                          if (linkedVisa) {
                            updateVisaApplicantTrack(linkedVisa.id, tOpt.id);
                          }
                          persistLeadChanges(
                            { visaTrack: tOpt.id },
                            tr(
                              `ভিসা ট্র্যাক ${tOpt.labelBn}-এ পরিবর্তন করা হয়েছে`,
                              `Switched Visa Pipeline track to ${tOpt.labelEn}`,
                            ),
                          );
                          setStoreTick((t) => t + 1);
                        }}
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                          activeCandidateTrack === tOpt.id
                            ? "bg-white text-slate-900 shadow-2xs"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        {isBn ? tOpt.labelBn : tOpt.labelEn}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  {candidateTrackStages.map((stgInfo) => {
                    const st = stgInfo.stage;
                    const currentStage = linkedVisa
                      ? Math.min(candidateTrackStages.length, linkedVisa.stage || 1)
                      : 0;
                    const isCompleted = currentStage > st;
                    const isCurrent = currentStage === st;
                    return (
                      <div
                        key={`${activeCandidateTrack}-${st}`}
                        className={`flex items-center justify-between rounded-xl border px-4 py-2.5 text-xs transition ${
                          isCurrent
                            ? "border-indigo-500 bg-indigo-50/60 font-bold text-indigo-950"
                            : isCompleted
                              ? "border-emerald-200 bg-emerald-50/40 text-emerald-800"
                              : "border-slate-200/80 bg-white text-slate-600"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                              isCompleted
                                ? "bg-emerald-600 text-white"
                                : isCurrent
                                  ? "bg-indigo-600 text-white"
                                  : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {isCompleted ? "✓" : st}
                          </span>
                          <div>
                            <p className="leading-snug">
                              {isBn ? stgInfo.titleBn : stgInfo.titleEn}
                            </p>
                            <p className="text-[10px] font-normal text-slate-400">
                              {isBn ? stgInfo.subBn : stgInfo.subEn}
                            </p>
                          </div>
                        </div>

                        {linkedVisa && currentStage !== st && (
                          <button
                            type="button"
                            onClick={() => {
                              updateVisaStage(linkedVisa.id, st);
                              setStoreTick((t) => t + 1);
                              onSaved(
                                tr(
                                  `ভিসা ধাপ "${stgInfo.titleBn}"-এ উন্নীত করা হয়েছে`,
                                  `Updated Visa Application to ${stgInfo.titleEn}`,
                                ),
                              );
                            }}
                            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer shrink-0"
                          >
                            {tr("সেট করুন", "Set Stage")}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

          {/* LMS Language Course & Student Portal Login Provisioning */}
          <div className="lg:col-span-5 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs space-y-4">
            <div className="flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">
                {tr(
                  "LMS ভাষা ব্যাচ ও স্টুডেন্ট পোর্টাল লগইন",
                  "LMS Batch & Student Portal Access"
                )}
              </h2>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-600">
                  {tr("লগইন ইমেইল", "Portal Login Email")}
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-600">
                  {tr("পাসওয়ার্ড", "Portal Password")}
                </label>
                <input
                  type="text"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-semibold text-slate-600">
                    {tr("কোর্স লেভেল", "Course Level")}
                  </label>
                  <select
                    value={courseLevel}
                    onChange={(e) =>
                      setCourseLevel(e.target.value as "N5" | "N4" | "IRODORI")
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-semibold"
                  >
                    <option value="N5">JLPT N5</option>
                    <option value="N4">JLPT N4</option>
                    <option value="IRODORI">Irodori Spoken</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-600">
                    {tr("ব্যাচ সেশন", "Active Batch")}
                  </label>
                  <input
                    type="text"
                    value={enrolledBatch}
                    onChange={(e) => setEnrolledBatch(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    provisionLeadLoginAndEnrollment(
                      {
                        id: lead.id,
                        name,
                        phone,
                        whatsapp,
                        email: loginEmail,
                        city,
                        education,
                        interest,
                        branch,
                        notes,
                      },
                      {
                        loginEmail,
                        loginPassword,
                        role: "STUDENT",
                        allowedTabs: ["my_profile", "lms", "visa"],
                        isFileOpened: true,
                        isCourseEnrolled: true,
                        enrolledBatchOrSession: enrolledBatch,
                        targetSchool:
                          targetSchool || "Tokyo International Japanese School",
                        partnerSchoolId,
                        b2bAgentId,
                        b2bAgentName,
                        contractAmountBdt,
                        courseLevel,
                      }
                    );
                    setStatus("ADMITTED");
                    setStoreTick((t) => t + 1);
                    onSaved(
                      tr(
                        "ভর্তি, ভিসা ফাইল ও স্টুডেন্ট লগইন একসাথে চালু হয়েছে!",
                        "Enrolled in LMS, opened Visa File & activated Student Login!"
                      )
                    );
                  }}
                  className="flex-1 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition cursor-pointer"
                >
                  {tr(
                    "ভর্তি নিশ্চিত ও লগইন চালু করুন",
                    "Activate Admission & Student Portal"
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `KNLTC Portal\nEmail: ${loginEmail}\nPassword: ${loginPassword}`
                    );
                    setCopiedCredentials(true);
                    setTimeout(() => setCopiedCredentials(false), 2000);
                  }}
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  {copiedCredentials ? (
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  <span>{copiedCredentials ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>
              </div>
            </div>
          );
        })()}

      {/* =====================================================================
          TAB 6: INVOICES (Contract Summary, Fee Collection & Receipts)
          ===================================================================== */}
      {activeTab === "invoices" && (
        <div className="space-y-5">
          {/* 3 Financial KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {tr("মোট চুক্তিমূল্য (Contract)", "TOTAL CONTRACT AMOUNT")}
              </div>
              <div className="text-2xl font-bold text-slate-900 tabular-nums mt-1">
                ৳{contractAmountBdt.toLocaleString()}
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/40 p-5 shadow-2xs">
              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                {tr("মোট জমা (Paid)", "TOTAL PAID / COLLECTED")}
              </div>
              <div className="text-2xl font-bold text-emerald-700 tabular-nums mt-1">
                ৳{paidAmountBdt.toLocaleString()}
              </div>
            </div>

            <div className="rounded-2xl border border-rose-200/80 bg-rose-50/40 p-5 shadow-2xs">
              <div className="text-[11px] font-bold uppercase tracking-wider text-rose-700">
                {tr("বর্তমান বকেয়া (Due)", "REMAINING DUE BALANCE")}
              </div>
              <div className="text-2xl font-bold text-rose-700 tabular-nums mt-1">
                ৳{dueAmountBdt.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Record Fee Payment Form */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3">
              {tr(
                "নতুন পেমেন্ট / ইনভয়েস রেকর্ড করুন",
                "Record Fee Payment & Issue Official Receipt"
              )}
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const amt = Number(quickPayAmount);
                if (!amt || amt <= 0) return;
                addFinancialTransaction({
                  receiptNo: `KNLTC-REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
                  date: new Date().toISOString().slice(0, 10),
                  studentName: name,
                  studentPhone: phone,
                  category: "INCOME",
                  type: quickPayType,
                  amountBdt: amt,
                  paymentMethod: quickPayMethod,
                  referenceOrTrx:
                    quickPayRef.trim() || `TRX-${Date.now().toString().slice(-6)}`,
                  branch,
                  verifiedBy: assignedTo || "Accounts",
                  notes: `Payment recorded from student 360 profile`,
                  linkedLeadId: lead.id,
                  linkedVisaId: linkedVisa?.id,
                });
                const nextPaid = paidAmountBdt + amt;
                setPaidAmountBdt(nextPaid);
                setQuickPayAmount("");
                setQuickPayRef("");
                setStoreTick((t) => t + 1);
                onSaved(
                  tr(
                    `৳${amt.toLocaleString()} জমা হয়েছে এবং ফিন্যান্স লেজারে যুক্ত হয়েছে`,
                    `Recorded ৳${amt.toLocaleString()} payment & synced with Finance Ledger`
                  )
                );
              }}
              className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs"
            >
              <input
                type="number"
                required
                value={quickPayAmount}
                onChange={(e) => setQuickPayAmount(e.target.value)}
                placeholder={tr("টাকার পরিমাণ (BDT) *", "Amount (BDT) *")}
                className="rounded-xl border border-slate-200 px-3.5 py-2 font-semibold tabular-nums"
              />
              <select
                value={quickPayType}
                onChange={(e) => setQuickPayType(e.target.value as TransactionType)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium"
              >
                <option value="COURSE_FEE">Language Course Fee</option>
                <option value="REGULAR_SERVICE_CHARGE">Visa Service Charge</option>
                <option value="PREMIUM_PACKAGE_ADVANCE">Premium Package Installment</option>
              </select>
              <select
                value={quickPayMethod}
                onChange={(e) =>
                  setQuickPayMethod(
                    e.target.value as FinancialTransaction["paymentMethod"]
                  )
                }
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium"
              >
                <option value="CASH_OFFICE">Cash at Office</option>
                <option value="BKASH">bKash Merchant</option>
                <option value="BANK_TRANSFER">Bank Deposit / Transfer</option>
              </select>
              <button
                type="submit"
                className="rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700 transition cursor-pointer"
              >
                {tr("+ পেমেন্ট জমা নিন", "+ Record Payment")}
              </button>
            </form>
          </div>

          {/* Payment History Table */}
          <div className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-2xs">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                {tr("পেমেন্ট ও মানি রসিদ ইতিহাস", "Invoices & Payment History")}
              </h3>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>{tr("প্রিন্ট স্টেটমেন্ট", "Print Statement")}</span>
              </button>
            </div>

            {studentTransactions.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                {tr(
                  "এই শিক্ষার্থীর নামে এখনো কোনো পেমেন্ট রসিদ ইস্যু করা হয়নি।",
                  "No invoices or payments recorded for this candidate yet."
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      <th className="py-3 px-4">Receipt No</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Method</th>
                      <th className="py-3 px-4 text-right">Amount (BDT)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {studentTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50/60">
                        <td className="py-3 px-4 font-mono font-semibold text-slate-900">
                          {tx.receiptNo}
                        </td>
                        <td className="py-3 px-4 text-slate-600 tabular-nums">
                          {tx.date}
                        </td>
                        <td className="py-3 px-4 text-slate-700 font-medium">
                          {tx.type}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {tx.paymentMethod}
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-emerald-700 tabular-nums">
                          ৳{tx.amountBdt.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          INLINE EDIT PROFILE MODAL (Triggered by "Edit" Button in Header)
          ===================================================================== */}
      {isEditingModalOpen && (
        <div
          className="fixed inset-0 z-[95] flex items-center justify-center bg-slate-950/50 backdrop-blur-xs p-4 overflow-y-auto"
          onClick={() => setIsEditingModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4 my-8"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {tr(
                  "শিক্ষার্থীর পূর্ণাঙ্গ প্রোফাইল ও একাডেমিক তথ্য সম্পাদনা",
                  "Edit Candidate Profile & Academic Details"
                )}
              </h3>
              <button
                type="button"
                onClick={() => setIsEditingModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs max-h-[68vh] overflow-y-auto pr-1">
              <div>
                <label className="font-semibold text-slate-700">Full Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">Phone *</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">SSC GPA</label>
                <input
                  type="text"
                  value={sscGpa}
                  onChange={(e) => setSscGpa(e.target.value)}
                  placeholder="e.g. 4.50"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">HSC / Diploma GPA</label>
                <input
                  type="text"
                  value={hscGpa}
                  onChange={(e) => setHscGpa(e.target.value)}
                  placeholder="e.g. 4.25"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">
                  {tr("সর্বোচ্চ ডিগ্রি / শিক্ষাগত যোগ্যতা", "Highest Degree / Qualification")}
                </label>
                <select
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium cursor-pointer"
                >
                  {education &&
                    !(STANDARD_DEGREE_OPTIONS as readonly string[]).includes(education) && (
                      <option value={education}>{education}</option>
                    )}
                  {STANDARD_DEGREE_OPTIONS.map((deg) => (
                    <option key={deg} value={deg}>
                      {deg}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700">
                  Study Gap (Years)
                </label>
                <input
                  type="number"
                  value={studyGapYears}
                  onChange={(e) => setStudyGapYears(Number(e.target.value) || 0)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 tabular-nums"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">
                  Target Program in Japan
                </label>
                <select
                  value={interest}
                  onChange={(e) => setInterest(e.target.value as ServiceInterest)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium"
                >
                  <option value="STUDENT_VISA_REGULAR">Student Visa • Regular</option>
                  <option value="STUDENT_VISA_PREMIUM">Student Visa • Premium</option>
                  <option value="JAPANESE_N5">Language Program (JLPT N5)</option>
                  <option value="JAPANESE_N4">Language Program (JLPT N4)</option>
                  <option value="SSW_CONSTRUCTION_SPECIAL">SSW • Construction</option>
                  <option value="SSW_CAREGIVER">SSW • Caregiver</option>
                  <option value="SSW_AGRICULTURE">SSW • Agriculture</option>
                  <option value="SSW_FOOD_SERVICE">SSW • Food Service</option>
                  <option value="TITP_TECHNICAL">TITP • Technical Intern</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700">
                  Japanese Proficiency
                </label>
                <select
                  value={japaneseProficiency}
                  onChange={(e) =>
                    setJapaneseProficiency(
                      e.target.value as CrmLead["japaneseProficiency"]
                    )
                  }
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium"
                >
                  <option value="NONE">Beginner (N5 Prep)</option>
                  <option value="LEARNING_N5">Studying JLPT N5</option>
                  <option value="PASSED_N5">JLPT N5 Passed</option>
                  <option value="PASSED_N4">JLPT N4 Passed</option>
                  <option value="NAT_JFT">NAT / JFT Passed</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Passport No.</label>
                <input
                  type="text"
                  value={passportNo}
                  onChange={(e) => setPassportNo(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">
                  Assigned Counselor
                </label>
                <input
                  type="text"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  list="counselors-datalist"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                />
                <datalist id="counselors-datalist">
                  {counselors.map((c) => (
                    <option key={c.id} value={c.name} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="font-semibold text-slate-700">
                  Contract Amount (BDT)
                </label>
                <input
                  type="number"
                  value={contractAmountBdt}
                  onChange={(e) =>
                    setContractAmountBdt(Number(e.target.value) || 0)
                  }
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-semibold tabular-nums"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">
                  B2B Referral Agent (Optional)
                </label>
                <select
                  value={b2bAgentId}
                  onChange={(e) => {
                    const ag = b2bAgents.find((a) => a.id === e.target.value);
                    setB2bAgentId(e.target.value);
                    setB2bAgentName(ag ? ag.organizationName : "");
                  }}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
                >
                  <option value="">Direct / No Agent</option>
                  {b2bAgents.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.organizationName} ({a.contactPerson})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsEditingModalOpen(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                {tr("বাতিল", "Cancel")}
              </button>
              <button
                type="button"
                onClick={() => {
                  persistLeadChanges(
                    {},
                    tr(
                      "প্রোফাইল আপডেট ও Google Sheet-এ সেভ হয়েছে",
                      "Profile changes saved & synced to Google Sheet"
                    )
                  );
                  setIsEditingModalOpen(false);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-5 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <Save className="h-3.5 w-3.5" />
                <span>{tr("সেভ করুন", "Save Changes")}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {previewDoc && (
        <DocumentPreviewModal
          isOpen={Boolean(previewDoc)}
          onClose={() => setPreviewDoc(null)}
          title={previewDoc.title}
          subtitle={previewDoc.subtitle}
          fileUrl={previewDoc.fileUrl}
          fileName={previewDoc.fileName}
        />
      )}
    </div>
  );
}
