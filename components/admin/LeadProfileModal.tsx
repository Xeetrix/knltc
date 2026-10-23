"use client";

import React, { useState, useMemo } from "react";
import {
  X,
  UserCheck,
  KeyRound,
  ShieldCheck,
  Send,
  Save,
  FileCheck2,
  Landmark,
  Wallet,
  Plane,
  GraduationCap,
  MessageSquare,
  PhoneCall,
  Calendar,
  Printer,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Sparkles,
  Building2,
  Receipt,
  BookOpen,
} from "lucide-react";
import {
  getCmsStore,
  updateCrmLeadProfile,
  provisionLeadLoginAndEnrollment,
  promoteLeadToVisaPipeline,
  updateVisaStage,
  addFinancialTransaction,
  getLeadDocumentChecklist,
  calculateLeadEligibility,
  addLeadActivityLog,
  updateLmsProgressAndAttendance,
  type CrmLead,
  type DashboardTabId,
  type LeadStatus,
  type LeadPriority,
  type LeadDocumentItem,
  type LeadActivityItem,
  type ServiceInterest,
  type UserRole,
  type VisaStage,
  type TransactionType,
  type FinancialTransaction,
} from "@/lib/knltc-cms-store";
import { useLanguage } from "@/components/layout/LanguageProvider";

type ProfileTabId = "bio" | "docs" | "finance_visa" | "timeline" | "access_print";

const VISA_STAGE_LABELS_BN: Record<VisaStage, string> = {
  1: "ধাপ ১: ফাইল ওপেনিং (৳০ অগ্রিম)",
  2: "ধাপ ২: ভাষা প্রশিক্ষণ (N5/N4)",
  3: "ধাপ ৩: ডকুমেন্ট সংগ্রহ ও নোটারি",
  4: "ধাপ ৪: জাপানি স্কুল জুম ইন্টারভিউ",
  5: "ধাপ ৫: ইমিগ্রেশনে COE আবেদন",
  6: "ধাপ ৬: প্রি-ভিসা (COE) অনুমোদন",
  7: "ধাপ ৭: টিউশন ফি ও মূল COE রিলিজ",
  8: "ধাপ ৮: এম্বাসি ইন্টারভিউ ও VFS",
  9: "ধাপ ৯: ভিসা স্ট্যাম্পিং ও সার্ভিস চার্জ",
  10: "ধাপ ১০: এয়ার টিকিট ও জাপান ফ্লাই",
};

export default function LeadProfileModal({
  lead,
  onClose,
  onSaved,
}: {
  lead: CrmLead;
  onClose: () => void;
  onSaved: (message: string) => void;
}) {
  const { language } = useLanguage();
  const isBn = language === "bn";

  // Active 360° Command Center Tab
  const [activeTab, setActiveTab] = useState<ProfileTabId>("bio");
  const [storeTick, setStoreTick] = useState(0);

  // Load live entities from CMS Store for relational linking
  const liveStore = useMemo(() => {
    void storeTick;
    return getCmsStore();
  }, [storeTick]);

  const partnerSchools = liveStore.partnerSchools || [];
  const b2bAgents = liveStore.b2bAgents || [];
  const counselors = liveStore.staffList.filter(
    (s) => s.role === "TELE_COUNSELOR" || s.role === "COUNSELOR" || s.role === "BRANCH_MANAGER",
  );
  const visaOfficers = liveStore.staffList.filter(
    (s) => s.role === "VISA_OFFICER" || s.role === "BRANCH_MANAGER",
  );
  const senseis = liveStore.staffList.filter((s) => s.role === "SENIOR_SENSEI");

  // Linked Visa Applicant, LMS Bridge & Financial Transactions
  const linkedVisa = useMemo(
    () =>
      liveStore.visaApplicants.find(
        (v) => v.leadId === lead.id || v.linkedLeadId === lead.id || v.phone === lead.phone,
      ) || null,
    [liveStore.visaApplicants, lead.id, lead.phone],
  );

  const linkedLms = useMemo(
    () =>
      liveStore.lmsBridges.find(
        (b) => b.leadId === lead.id || b.linkedLeadId === lead.id || b.phone === lead.phone,
      ) || null,
    [liveStore.lmsBridges, lead.id, lead.phone],
  );

  const studentTransactions = useMemo(
    () =>
      liveStore.transactions.filter(
        (tx) =>
          tx.category !== "EXPENSE" &&
          !tx.type.startsWith("EXPENSE") &&
          (tx.linkedLeadId === lead.id ||
            (tx.studentPhone && tx.studentPhone === lead.phone) ||
            tx.studentName.toLowerCase() === lead.name.toLowerCase()),
      ),
    [liveStore.transactions, lead.id, lead.phone, lead.name],
  );

  // ---------------------------------------------------------------------------
  // 1. Bio, Academic & Exam Tracker State
  // ---------------------------------------------------------------------------
  const [name, setName] = useState(lead.name || "");
  const [phone, setPhone] = useState(lead.phone || "");
  const [whatsapp, setWhatsapp] = useState(lead.whatsapp || lead.phone || "");
  const [email, setEmail] = useState(lead.email || "");
  const [city, setCity] = useState(lead.city || "Dhaka");
  const [address, setAddress] = useState(lead.address || "");
  const [passportNo, setPassportNo] = useState(lead.passportNo || "");
  const [guardianName, setGuardianName] = useState(lead.guardianName || "");
  const [guardianPhone, setGuardianPhone] = useState(lead.guardianPhone || "");
  const [education, setEducation] = useState(lead.education || "HSC");
  const [sscGpa, setSscGpa] = useState(lead.sscGpa || "4.50");
  const [hscGpa, setHscGpa] = useState(lead.hscGpa || "4.25");
  const [graduationYear, setGraduationYear] = useState(lead.graduationYear || "2024");
  const [gpaDetails, setGpaDetails] = useState(lead.gpaDetails || "");
  const [studyGapYears, setStudyGapYears] = useState<number>(lead.studyGapYears ?? 0);
  const [japaneseProficiency, setJapaneseProficiency] = useState<CrmLead["japaneseProficiency"]>(
    lead.japaneseProficiency || "NONE",
  );
  const [japaneseExamType, setJapaneseExamType] = useState<
    NonNullable<CrmLead["japaneseExamType"]>
  >(lead.japaneseExamType || "NONE");
  const [japaneseExamStatus, setJapaneseExamStatus] = useState<
    NonNullable<CrmLead["japaneseExamStatus"]>
  >(lead.japaneseExamStatus || "NOT_REGISTERED");
  const [japaneseExamScore, setJapaneseExamScore] = useState(lead.japaneseExamScore || "");

  const [interest, setInterest] = useState<ServiceInterest>(
    lead.interest || "STUDENT_VISA_REGULAR",
  );
  const [status, setStatus] = useState<LeadStatus>(lead.status || "NEW");
  const [priority, setPriority] = useState<LeadPriority>(
    lead.priority || (lead.status === "ADMITTED" ? "HOT" : "WARM"),
  );
  const [branch, setBranch] = useState<"DHK-HQ" | "KHULNA-01">(lead.branch || "DHK-HQ");
  const [assignedTo, setAssignedTo] = useState(
    lead.assignedTo || counselors[0]?.name || "শেখ বাসেত",
  );
  const [assignedCounselorId, setAssignedCounselorId] = useState(
    lead.assignedCounselorId || counselors.find((c) => c.name === lead.assignedTo)?.id || "",
  );
  const [b2bAgentId, setB2bAgentId] = useState(lead.b2bAgentId || lead.referredByAgentId || "");
  const [b2bAgentName, setB2bAgentName] = useState(
    lead.b2bAgentName || lead.referredByAgentName || "",
  );
  const [followUpDate, setFollowUpDate] = useState(
    lead.followUpDate || new Date().toISOString().slice(0, 10),
  );
  const [notes, setNotes] = useState(lead.notes || "");

  // ---------------------------------------------------------------------------
  // 2. Document Checklist Vault & Sponsor Solvency State
  // ---------------------------------------------------------------------------
  const [documentChecklist, setDocumentChecklist] = useState<LeadDocumentItem[]>(() =>
    getLeadDocumentChecklist(lead),
  );
  const [sponsorRelation, setSponsorRelation] = useState<
    NonNullable<CrmLead["sponsorRelation"]>
  >(lead.sponsorRelation || linkedVisa?.sponsorRelation || "FATHER");
  const [sponsorOccupation, setSponsorOccupation] = useState(
    lead.sponsorOccupation || "ব্যবসা / প্রথম শ্রেণীর চাকরি",
  );
  const [sponsorMonthlyIncomeBdt, setSponsorMonthlyIncomeBdt] = useState<number>(
    lead.sponsorMonthlyIncomeBdt ?? 85000,
  );
  const [sponsorBankName, setSponsorBankName] = useState(
    lead.sponsorBankName || linkedVisa?.sponsorBank || "অগ্রণী ব্যাংক পিএলসি",
  );
  const [sponsorBankBalanceBdt, setSponsorBankBalanceBdt] = useState<number>(
    lead.sponsorBankBalanceBdt ?? linkedVisa?.sponsorBalanceBdt ?? 1850000,
  );
  const [bankLoanRequired, setBankLoanRequired] = useState<boolean>(
    lead.bankLoanRequired ?? linkedVisa?.bankLoanAssistance ?? false,
  );
  const [preferredLoanBank, setPreferredLoanBank] = useState(
    lead.preferredLoanBank || linkedVisa?.bankLoanBank || "অগ্রণী ব্যাংক পিএলসি (এডুকেশন লোন)",
  );

  // ---------------------------------------------------------------------------
  // 3. Finance, Visa Stage & LMS State
  // ---------------------------------------------------------------------------
  const [packageType, setPackageType] = useState<"REGULAR" | "PREMIUM">(
    lead.packageType || (lead.interest === "STUDENT_VISA_PREMIUM" ? "PREMIUM" : "REGULAR"),
  );
  const [partnerSchoolId, setPartnerSchoolId] = useState(
    lead.partnerSchoolId || lead.targetSchoolId || partnerSchools[0]?.id || "",
  );
  const [targetSchool, setTargetSchool] = useState(
    lead.targetSchool || lead.targetSchoolName || partnerSchools[0]?.name || "",
  );
  const [assignedVisaOfficerId, setAssignedVisaOfficerId] = useState(
    lead.assignedVisaOfficerId || linkedVisa?.visaOfficerId || visaOfficers[0]?.id || "",
  );
  const [schoolInterviewStatus, setSchoolInterviewStatus] = useState<
    NonNullable<CrmLead["schoolInterviewStatus"]>
  >(lead.schoolInterviewStatus || "NOT_SCHEDULED");
  const [schoolInterviewDate, setSchoolInterviewDate] = useState(
    lead.schoolInterviewDate || "",
  );

  const [contractAmountBdt, setContractAmountBdt] = useState<number>(
    lead.contractAmountBdt ?? (lead.packageType === "PREMIUM" ? 1100000 : 120000),
  );
  const livePaidAmountBdt = useMemo(() => {
    const freshLead = liveStore.crmLeads.find((l) => l.id === lead.id);
    return freshLead?.paidAmountBdt ?? lead.paidAmountBdt ?? 0;
  }, [liveStore.crmLeads, lead.id, lead.paidAmountBdt]);

  const liveDueAmountBdt = Math.max(0, contractAmountBdt - livePaidAmountBdt);

  // Inline Quick Fee Collection State
  const [feeAmountBdt, setFeeAmountBdt] = useState<number>(
    liveDueAmountBdt > 0 ? Math.min(20000, liveDueAmountBdt) : 12000,
  );
  const [feeType, setFeeType] = useState<TransactionType>("COURSE_FEE");
  const [feeMethod, setFeeMethod] = useState<FinancialTransaction["paymentMethod"]>("BKASH");
  const [feeTrxRef, setFeeTrxRef] = useState("");

  // LMS Progress & Attendance State
  const [courseLevel, setCourseLevel] = useState<"N5" | "N4" | "IRODORI">(
    linkedLms?.courseLevel || "N5",
  );
  const [enrolledBatchOrSession, setEnrolledBatchOrSession] = useState(
    lead.enrolledBatchOrSession || linkedLms?.activeBatch || "APRIL_2027 • N5 Special Batch",
  );
  const [lmsProgressPct, setLmsProgressPct] = useState<number>(
    linkedLms?.progressPercentage ?? 25,
  );
  const [attendancePct, setAttendancePct] = useState<number>(
    lead.attendancePercentage ?? 92,
  );

  // ---------------------------------------------------------------------------
  // 4. Counseling Activity Timeline State
  // ---------------------------------------------------------------------------
  const [activityLog, setActivityLog] = useState<LeadActivityItem[]>(() => {
    if (lead.activityLog && lead.activityLog.length > 0) return lead.activityLog;
    return [
      {
        id: "act-init-1",
        type: "CALL",
        summary: lead.notes || "প্রাথমিক টেলি-কাউন্সেলিং ও প্রোফাইল যাচাই সম্পন্ন হয়েছে।",
        counselorName: lead.assignedTo || "শেখ বাসেত",
        createdAt: lead.createdAt || new Date().toISOString(),
      },
    ];
  });
  const [newActivityType, setNewActivityType] =
    useState<LeadActivityItem["type"]>("CALL");
  const [newActivitySummary, setNewActivitySummary] = useState("");

  // ---------------------------------------------------------------------------
  // 5. Portal Login Provisioning State
  // ---------------------------------------------------------------------------
  const defaultSuggestedLogin =
    lead.loginEmail ||
    lead.email ||
    `${(lead.name || "student").toLowerCase().replace(/[^a-z0-9]/g, "") || lead.phone.slice(-4)}@knltc.com`;

  const [isCourseEnrolled, setIsCourseEnrolled] = useState<boolean>(
    Boolean(lead.isCourseEnrolled || lead.status === "ADMITTED"),
  );
  const [isFileOpened, setIsFileOpened] = useState<boolean>(
    Boolean(lead.isFileOpened || lead.status === "ADMITTED" || linkedVisa),
  );
  const [initialPaymentBdt, setInitialPaymentBdt] = useState<number>(0);
  const [loginEmail, setLoginEmail] = useState(defaultSuggestedLogin);
  const [loginPassword, setLoginPassword] = useState(
    lead.loginPassword || `knltc${lead.phone.replace(/\D/g, "").slice(-4) || "2026"}`,
  );
  const [role, setRole] = useState<UserRole>("STUDENT");
  const [allowedTabs, setAllowedTabs] = useState<DashboardTabId[]>(
    lead.allowedTabs && lead.allowedTabs.length > 0
      ? lead.allowedTabs
      : ["my_profile", "visa", "lms"],
  );

  // ---------------------------------------------------------------------------
  // Live Eligibility Calculation
  // ---------------------------------------------------------------------------
  const eligibility = useMemo(
    () =>
      calculateLeadEligibility({
        ...lead,
        sscGpa,
        hscGpa,
        gpaDetails: gpaDetails || `SSC ${sscGpa}, HSC ${hscGpa}`,
        studyGapYears,
        japaneseProficiency,
        japaneseExamType,
        japaneseExamStatus,
        isCourseEnrolled,
        sponsorBankBalanceBdt,
        bankLoanRequired,
        guardianName,
        passportNo,
        documentChecklist,
      }),
    [
      lead,
      sscGpa,
      hscGpa,
      gpaDetails,
      studyGapYears,
      japaneseProficiency,
      japaneseExamType,
      japaneseExamStatus,
      isCourseEnrolled,
      sponsorBankBalanceBdt,
      bankLoanRequired,
      guardianName,
      passportNo,
      documentChecklist,
    ],
  );

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------
  const buildUpdatedLeadPayload = (): Partial<CrmLead> => {
    const selectedAgent = b2bAgents.find((a) => a.id === b2bAgentId);
    const selectedSchool = partnerSchools.find((s) => s.id === partnerSchoolId);
    const selectedOfficer = visaOfficers.find((v) => v.id === assignedVisaOfficerId);
    const resolvedSchoolName = selectedSchool?.name || targetSchool || undefined;

    return {
      name,
      phone,
      whatsapp,
      email,
      city,
      address,
      passportNo,
      guardianName,
      guardianPhone,
      education,
      sscGpa,
      hscGpa,
      graduationYear,
      gpaDetails: gpaDetails || `SSC ${sscGpa} • HSC ${hscGpa}`,
      studyGapYears,
      japaneseProficiency,
      japaneseExamType,
      japaneseExamStatus,
      japaneseExamScore,
      interest,
      status,
      priority,
      branch,
      assignedTo,
      assignedCounselorId: assignedCounselorId || undefined,
      b2bAgentId: b2bAgentId || undefined,
      referredByAgentId: b2bAgentId || undefined,
      b2bAgentName: selectedAgent?.organizationName || b2bAgentName || undefined,
      referredByAgentName: selectedAgent?.organizationName || b2bAgentName || undefined,
      partnerSchoolId: partnerSchoolId || undefined,
      targetSchoolId: partnerSchoolId || undefined,
      targetSchool: resolvedSchoolName,
      targetSchoolName: resolvedSchoolName,
      assignedVisaOfficerId: assignedVisaOfficerId || undefined,
      assignedVisaOfficerName: selectedOfficer?.name || undefined,
      contractAmountBdt,
      sponsorRelation,
      sponsorOccupation,
      sponsorMonthlyIncomeBdt,
      sponsorBankName,
      sponsorBankBalanceBdt,
      bankLoanRequired,
      preferredLoanBank,
      schoolInterviewStatus,
      schoolInterviewDate,
      attendancePercentage: attendancePct,
      documentChecklist,
      activityLog,
      followUpDate,
      notes,
    };
  };

  const handleSaveAllProfileChanges = () => {
    updateCrmLeadProfile(lead.id, buildUpdatedLeadPayload());
    updateLmsProgressAndAttendance(lead.id, phone, lmsProgressPct, attendancePct);
    setStoreTick((t) => t + 1);
    onSaved(
      isBn
        ? `${name}-এর ৩৬০° প্রোফাইল, ডকুমেন্ট ভল্ট ও এসেসমেন্ট সেভ হয়েছে!`
        : `${name}'s 360° profile and assessment saved!`,
    );
  };

  const cycleDocStatus = (docId: string) => {
    const order: LeadDocumentItem["status"][] = ["MISSING", "SUBMITTED", "VERIFIED"];
    const nextList = documentChecklist.map((item) => {
      if (item.id !== docId) return item;
      const nextStatus = order[(order.indexOf(item.status) + 1) % order.length];
      return {
        ...item,
        status: nextStatus,
        updatedAt: new Date().toISOString().slice(0, 10),
      };
    });
    setDocumentChecklist(nextList);
    updateCrmLeadProfile(lead.id, { documentChecklist: nextList });
  };

  const markAllDocsStatus = (targetStatus: LeadDocumentItem["status"]) => {
    const nextList = documentChecklist.map((item) => ({
      ...item,
      status: targetStatus,
      updatedAt: new Date().toISOString().slice(0, 10),
    }));
    setDocumentChecklist(nextList);
    updateCrmLeadProfile(lead.id, { documentChecklist: nextList });
    onSaved(
      isBn
        ? `সকল ডকুমেন্ট "${targetStatus}" হিসেবে চিহ্নিত করা হয়েছে`
        : `All documents marked as ${targetStatus}`,
    );
  };

  const handleAddActivityEntry = (
    typeOverride?: LeadActivityItem["type"],
    summaryOverride?: string,
  ) => {
    const finalType = typeOverride || newActivityType;
    const finalSummary = (summaryOverride ?? newActivitySummary).trim();
    if (!finalSummary) return;

    const updatedLead = addLeadActivityLog(lead.id, {
      type: finalType,
      summary: finalSummary,
      counselorName: assignedTo || "শেখ বাসেত",
    });

    if (updatedLead?.activityLog) {
      setActivityLog(updatedLead.activityLog);
    } else {
      const fallbackItem: LeadActivityItem = {
        id: `act-${Date.now()}`,
        type: finalType,
        summary: finalSummary,
        counselorName: assignedTo || "শেখ বাসেত",
        createdAt: new Date().toISOString(),
      };
      const next = [fallbackItem, ...activityLog];
      setActivityLog(next);
      updateCrmLeadProfile(lead.id, { activityLog: next });
    }

    if (!summaryOverride) {
      setNewActivitySummary("");
    }
    setStoreTick((t) => t + 1);
  };

  const handleQuickCollectFee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feeAmountBdt || feeAmountBdt <= 0) return;

    updateCrmLeadProfile(lead.id, buildUpdatedLeadPayload());

    const tx = addFinancialTransaction({
      receiptNo: `KNLTC-REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().slice(0, 10),
      studentName: name.trim(),
      studentPhone: phone.trim(),
      category: "INCOME",
      type: feeType,
      amountBdt: Number(feeAmountBdt),
      paymentMethod: feeMethod,
      referenceOrTrx: feeTrxRef.trim() || `TRX-${Date.now().toString().slice(-6)}`,
      branch,
      verifiedBy: assignedTo || "Sheikh Baset (MD)",
      notes: `Collected from 360° Lead Profile (${feeType})`,
      linkedLeadId: lead.id,
    });

    handleAddActivityEntry(
      "PAYMENT",
      `ফি জমা নেওয়া হয়েছে: ৳${tx.amountBdt.toLocaleString()} (${tx.receiptNo} • ${tx.paymentMethod})`,
    );
    setFeeTrxRef("");
    setStoreTick((t) => t + 1);
    onSaved(
      isBn
        ? `৳${tx.amountBdt.toLocaleString()} জমা নেওয়া হয়েছে (রসিদ: ${tx.receiptNo})`
        : `Collected ৳${tx.amountBdt.toLocaleString()} (Receipt: ${tx.receiptNo})`,
    );
  };

  const handleAdvanceOrSetVisaStage = (nextStage: VisaStage) => {
    updateCrmLeadProfile(lead.id, buildUpdatedLeadPayload());
    let targetVisa = linkedVisa;
    if (!targetVisa) {
      targetVisa = promoteLeadToVisaPipeline({
        leadId: lead.id,
        partnerSchoolId: partnerSchoolId || undefined,
        targetSchool: targetSchool || undefined,
        packageType,
        b2bAgentId: b2bAgentId || undefined,
        visaOfficerId: assignedVisaOfficerId || undefined,
        contractAmountBdt,
      });
      setIsFileOpened(true);
      setStatus("ADMITTED");
    }
    if (targetVisa) {
      updateVisaStage(targetVisa.id, nextStage);
      handleAddActivityEntry(
        "STAGE_CHANGE",
        `ভিসা পাইপলাইন আপডেট: ${VISA_STAGE_LABELS_BN[nextStage]}`,
      );
      setStoreTick((t) => t + 1);
      onSaved(
        isBn
          ? `${name}-এর ভিসা ধাপ আপডেট হয়েছে: ${VISA_STAGE_LABELS_BN[nextStage]}`
          : `Visa stage updated to Stage ${nextStage}`,
      );
    }
  };

  const toggleTabPermission = (tabId: DashboardTabId) => {
    setAllowedTabs((prev) =>
      prev.includes(tabId) ? prev.filter((item) => item !== tabId) : [...prev, tabId],
    );
  };

  const generateRandomPassword = () => {
    const digits = Math.floor(1000 + Math.random() * 9000);
    setLoginPassword(`JP@${digits}`);
  };

  const handleProvisionLoginAndAdmission = () => {
    if (!loginEmail.trim() || !loginPassword.trim()) {
      onSaved(isBn ? "লগইন ইমেইল ও পাসওয়ার্ড প্রদান করুন।" : "Please provide Login ID and Password.");
      return;
    }

    const finalTabs: DashboardTabId[] =
      allowedTabs.length > 0 ? allowedTabs : ["my_profile", "visa", "lms"];
    const selectedAgent = b2bAgents.find((a) => a.id === b2bAgentId);
    const selectedSchool = partnerSchools.find((s) => s.id === partnerSchoolId);
    const selectedOfficer = visaOfficers.find((v) => v.id === assignedVisaOfficerId);
    const resolvedSchoolName = selectedSchool?.name || targetSchool || "Unassigned School";

    provisionLeadLoginAndEnrollment(
      {
        id: lead.id,
        name,
        phone,
        whatsapp,
        email,
        city,
        education,
        interest,
        branch,
        notes,
      },
      {
        loginEmail: loginEmail.trim(),
        loginPassword: loginPassword.trim(),
        role,
        allowedTabs: finalTabs,
        isFileOpened,
        isCourseEnrolled,
        enrolledBatchOrSession,
        packageType,
        targetSchool: resolvedSchoolName,
        partnerSchoolId: partnerSchoolId || undefined,
        b2bAgentId: b2bAgentId || undefined,
        b2bAgentName: selectedAgent?.organizationName || b2bAgentName || undefined,
        assignedCounselorId: assignedCounselorId || undefined,
        assignedVisaOfficerId: assignedVisaOfficerId || undefined,
        assignedVisaOfficerName: selectedOfficer?.name || undefined,
        contractAmountBdt,
        initialPaymentBdt: Number(initialPaymentBdt) || 0,
        courseLevel,
        accountStatus: "ACTIVE",
        address,
        passportNo,
        guardianName,
        guardianPhone,
        gpaDetails: gpaDetails || `SSC ${sscGpa} • HSC ${hscGpa}`,
      },
    );

    updateCrmLeadProfile(lead.id, {
      ...buildUpdatedLeadPayload(),
      email: loginEmail.trim(),
      status: isFileOpened || isCourseEnrolled ? "ADMITTED" : status,
      isFileOpened,
      isCourseEnrolled,
      enrolledBatchOrSession,
      packageType,
      targetSchool: resolvedSchoolName,
      hasLoginAccess: true,
      loginEmail: loginEmail.trim().toLowerCase(),
      loginPassword: loginPassword.trim(),
      allowedTabs: finalTabs,
    });

    onSaved(
      isBn
        ? `${name} (${loginEmail.trim()}) — ভর্তি ও পোর্টাল লগইন চালু হয়েছে!`
        : `${name} (${loginEmail.trim()}) — Admission & Portal Login activated!`,
    );
    onClose();
  };

  // Pre-built WhatsApp Templates
  const whatsappTemplates = useMemo(() => {
    const missingDocs = documentChecklist
      .filter((d) => d.status === "MISSING")
      .slice(0, 4)
      .map((d) => `• ${d.titleBn}`)
      .join("\n");

    return [
      {
        id: "tpl-counseling",
        titleBn: "১. প্রাথমিক কাউন্সেলিং ও এলিজিবিলিটি রিপোর্ট",
        titleEn: "1. Counseling & Eligibility Summary",
        message: `আসসালামু আলাইকুম ${name},\nকবির নিউ লাইফ ট্রেনিং সেন্টার (KNLTC - Japan Gateway)-এ আপনার প্রোফাইল মূল্যায়ন সম্পন্ন হয়েছে।\n\n• জাপান ভিসা এলিজিবিলিটি স্কোর: ${eligibility.totalScore}%\n• প্রস্তাবিত প্রোগ্রাম: ${interest}\n• কাউন্সেলর: ${assignedTo}\n\nবিস্তারিত ফাইল ওপেনিংয়ের জন্য আমাদের অফিসে আসার আমন্ত্রণ রইল।`,
      },
      {
        id: "tpl-docs",
        titleBn: "২. বকেয়া ডকুমেন্ট জমাদানের রিমাইন্ডার",
        titleEn: "2. Missing Document Reminder",
        message: `প্রিয় ${name},\nআপনার জাপান প্রি-ভিসা (COE) ফাইল প্রসেসিংয়ের জন্য নিচের ডকুমেন্টগুলো দ্রুত অফিসে জমা দেওয়ার অনুরোধ করা হচ্ছে:\n\n${missingDocs || "• পাসপোর্ট ও একাডেমিক ট্রান্সক্রিপ্ট"}\n\nধন্যবাদান্তে,\nKNLTC ভিসা প্রসেসিং সেল`,
      },
      {
        id: "tpl-interview",
        titleBn: "৩. জাপানি স্কুল জুম ইন্টারভিউ প্রস্তুতি",
        titleEn: "3. Japanese School Zoom Interview Prep",
        message: `প্রিয় ${name},\nআপনার টার্গেট জাপানি স্কুল (${targetSchool || "Partner School"})-এর সাথে জুম ইন্টারভিউয়ের প্রস্তুতি সেশন নির্ধারিত হয়েছে।\n• তারিখ: ${schoolInterviewDate || followUpDate}\n• জিকোশোকাই (Self-Introduction) ও স্টাডি প্ল্যান রিভিশন করে আসবেন।`,
      },
      {
        id: "tpl-due",
        titleBn: "৪. বকেয়া কোর্স/সার্ভিস ফি কিস্তি রিমাইন্ডার",
        titleEn: "4. Pending Fee Installment Notice",
        message: `প্রিয় ${name},\nKNLTC-তে আপনার মোট চুক্তি ৳${contractAmountBdt.toLocaleString()}, পরিশোধিত ৳${livePaidAmountBdt.toLocaleString()} এবং বর্তমান বকেয়া ৳${liveDueAmountBdt.toLocaleString()}।\nপরবর্তী কিস্তি পরিশোধ করে অফিসিয়াল মানি রসিদ সংগ্রহ করার অনুরোধ করা হলো।`,
      },
      {
        id: "tpl-login",
        titleBn: "৫. স্টুডেন্ট পোর্টাল লগইন আইডি ও পাসওয়ার্ড",
        titleEn: "5. Student Portal Login Credentials",
        message: `অভিনন্দন ${name}!\nআপনার KNLTC স্টুডেন্ট পোর্টাল লগইন চালু হয়েছে:\n\n• পোর্টাল লিংক: ${typeof window !== "undefined" ? window.location.origin : ""}/admin/login\n• লগইন আইডি: ${loginEmail}\n• পাসওয়ার্ড: ${loginPassword}\n• ব্যাচ: ${enrolledBatchOrSession}`,
      },
    ];
  }, [
    name,
    eligibility.totalScore,
    interest,
    assignedTo,
    documentChecklist,
    targetSchool,
    schoolInterviewDate,
    followUpDate,
    contractAmountBdt,
    livePaidAmountBdt,
    liveDueAmountBdt,
    loginEmail,
    loginPassword,
    enrolledBatchOrSession,
  ]);

  const cleanWaNumber = (whatsapp || phone).replace(/[^0-9]/g, "");

  // Required Solvency Math
  const requiredSolvencyBdt = packageType === "PREMIUM" ? 2000000 : 1800000;
  const solvencyDeltaBdt = sponsorBankBalanceBdt - requiredSolvencyBdt;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 p-2 sm:p-5 backdrop-blur-xs overflow-y-auto">
      <div className="relative my-auto w-full max-w-6xl rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden max-h-[94vh] flex flex-col">
        {/* =====================================================================
            TOP 360° COMMAND CENTER HEADER
            ===================================================================== */}
        <div className="border-b border-slate-200 bg-slate-900 px-5 py-4 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Candidate Identity & Key Status */}
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 font-bold text-base text-white border border-white/15">
                {(name || "ST").slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold tracking-tight text-white">
                    {name || "Unnamed Candidate"}
                  </h2>
                  <span className="text-xs font-mono text-slate-400">
                    · {lead.fileTrackingNo || lead.id}
                  </span>
                  <span
                    className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                      priority === "HOT"
                        ? "bg-red-500/20 text-red-200 border border-red-400/30"
                        : priority === "WARM"
                          ? "bg-amber-500/20 text-amber-200 border border-amber-400/30"
                          : "bg-slate-700 text-slate-300"
                    }`}
                  >
                    {priority === "HOT"
                      ? "HOT PRIORITY"
                      : priority === "WARM"
                        ? "WARM LEAD"
                        : "COLD LEAD"}
                  </span>
                  {lead.hasLoginAccess && (
                    <span className="rounded-md bg-emerald-500/20 border border-emerald-400/30 px-2 py-0.5 text-[11px] font-semibold text-emerald-200">
                      {isBn ? "পোর্টাল লগইন সচল" : "Portal Active"}
                    </span>
                  )}
                </div>

                {/* Unboxed Metadata Row with · separators */}
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-300 font-mono tabular-nums">
                  <span>{phone}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-sans">{city}</span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {isBn ? "ডকুমেন্ট:" : "Docs:"} {eligibility.verifiedDocsCount}/
                    {eligibility.totalDocsCount} Verified
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-300 font-semibold">
                    {isBn ? "জমা:" : "Paid:"} ৳{livePaidAmountBdt.toLocaleString()}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className={liveDueAmountBdt > 0 ? "text-amber-300 font-semibold" : "text-slate-400"}>
                    {isBn ? "বকেয়া:" : "Due:"} ৳{liveDueAmountBdt.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Live Eligibility Meter & Quick Actions */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="rounded-xl bg-white/10 border border-white/10 px-3.5 py-2 flex items-center gap-3">
                <div>
                  <span className="block text-[10px] text-slate-300">
                    {isBn ? "জাপান ভিসা এলিজিবিলিটি" : "Japan Visa Eligibility"}
                  </span>
                  <span className="text-sm font-bold tabular-nums text-white">
                    {eligibility.totalScore}%{" "}
                    <span
                      className={`text-[11px] font-semibold ${
                        eligibility.totalScore >= 80
                          ? "text-emerald-300"
                          : eligibility.totalScore >= 65
                            ? "text-amber-300"
                            : "text-red-300"
                      }`}
                    >
                      ({eligibility.tier})
                    </span>
                  </span>
                </div>
                <div className="w-16 bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      eligibility.totalScore >= 80
                        ? "bg-emerald-400"
                        : eligibility.totalScore >= 65
                          ? "bg-amber-400"
                          : "bg-red-400"
                    }`}
                    style={{ width: `${eligibility.totalScore}%` }}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab("access_print")}
                className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 px-3 py-2 text-xs font-semibold text-white transition whitespace-nowrap shrink-0"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>{isBn ? "এসেসমেন্ট শিট" : "Print Sheet"}</span>
              </button>

              <button
                type="button"
                onClick={handleSaveAllProfileChanges}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-3.5 py-2 text-xs font-semibold text-white transition whitespace-nowrap shrink-0"
              >
                <Save className="h-3.5 w-3.5" />
                <span>{isBn ? "সব তথ্য সেভ" : "Save Profile"}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="rounded-xl bg-white/10 p-2 text-slate-300 hover:bg-white/20 hover:text-white transition"
                title="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* 5-Tab Segmented Command Bar */}
          <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-white/10">
            {(
              [
                {
                  id: "bio" as ProfileTabId,
                  icon: UserCheck,
                  labelBn: "১. বায়োডাটা, জিপিএ ও এলিজিবিলিটি",
                  labelEn: "1. Bio & Eligibility",
                },
                {
                  id: "docs" as ProfileTabId,
                  icon: FileCheck2,
                  labelBn: `২. ডকুমেন্ট ভল্ট (${eligibility.verifiedDocsCount}/12) ও স্পন্সর`,
                  labelEn: `2. Docs (${eligibility.verifiedDocsCount}/12) & Sponsor`,
                },
                {
                  id: "finance_visa" as ProfileTabId,
                  icon: Wallet,
                  labelBn: "৩. পেমেন্ট লেজার, ভিসা ধাপ ও LMS",
                  labelEn: "3. Finance, Visa & LMS",
                },
                {
                  id: "timeline" as ProfileTabId,
                  icon: MessageSquare,
                  labelBn: `৪. কাউন্সেলিং টাইমলাইন (${activityLog.length}) ও WhatsApp`,
                  labelEn: `4. Timeline (${activityLog.length}) & WhatsApp`,
                },
                {
                  id: "access_print" as ProfileTabId,
                  icon: KeyRound,
                  labelBn: "৫. পোর্টাল লগইন ও প্রিন্ট ডসিয়ার",
                  labelEn: "5. Portal Login & Print",
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
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition whitespace-nowrap shrink-0 ${
                    isActive
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{isBn ? tab.labelBn : tab.labelEn}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* =====================================================================
            TAB CONTENT WORKSPACE
            ===================================================================== */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-slate-50/50">
          {/* -------------------------------------------------------------------
              TAB 1: BIO, ACADEMIC, JAPAN EXAM & ELIGIBILITY SCORE
              ------------------------------------------------------------------- */}
          {activeTab === "bio" && (
            <div className="space-y-6">
              {/* Auto Japan Visa Eligibility Breakdown Panel */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {isBn
                        ? "স্বয়ংক্রিয় জাপান ভিসা এলিজিবিলিটি মূল্যায়ন (Auto Eligibility Assessment)"
                        : "Automated Japan Immigration Eligibility Assessment"}
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {isBn ? eligibility.recommendationBn : eligibility.recommendationEn}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-slate-500">
                      {isBn ? "মোট স্কোর:" : "Total Score:"}
                    </span>
                    <span className="text-xl font-bold text-slate-900 font-mono tabular-nums">
                      {eligibility.totalScore} / 100
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
                    <div className="flex items-center justify-between font-semibold text-slate-700">
                      <span>{isBn ? "১. একাডেমিক GPA" : "1. Academic GPA"}</span>
                      <span className="font-mono tabular-nums">{eligibility.gpaScore} / 30</span>
                    </div>
                    <div className="mt-2 h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full bg-slate-900 rounded-full"
                        style={{ width: `${(eligibility.gpaScore / 30) * 100}%` }}
                      />
                    </div>
                    <p className="mt-1.5 text-[11px] text-slate-500 font-mono tabular-nums">
                      SSC: {sscGpa || "N/A"} · HSC: {hscGpa || "N/A"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
                    <div className="flex items-center justify-between font-semibold text-slate-700">
                      <span>{isBn ? "২. স্টাডি গ্যাপ" : "2. Study Gap"}</span>
                      <span className="font-mono tabular-nums">{eligibility.gapScore} / 25</span>
                    </div>
                    <div className="mt-2 h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full"
                        style={{ width: `${(eligibility.gapScore / 25) * 100}%` }}
                      />
                    </div>
                    <p className="mt-1.5 text-[11px] text-slate-500 font-mono tabular-nums">
                      {studyGapYears} {isBn ? "বছর গ্যাপ" : "Years Gap"} (Pass: {graduationYear})
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
                    <div className="flex items-center justify-between font-semibold text-slate-700">
                      <span>{isBn ? "৩. জাপানি ভাষা দক্ষতা" : "3. Language & Exam"}</span>
                      <span className="font-mono tabular-nums">{eligibility.languageScore} / 25</span>
                    </div>
                    <div className="mt-2 h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full bg-amber-600 rounded-full"
                        style={{ width: `${(eligibility.languageScore / 25) * 100}%` }}
                      />
                    </div>
                    <p className="mt-1.5 text-[11px] text-slate-500">
                      {japaneseProficiency} · {japaneseExamType} ({japaneseExamStatus})
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
                    <div className="flex items-center justify-between font-semibold text-slate-700">
                      <span>{isBn ? "৪. সলভেন্সি ও ডকুমেন্ট" : "4. Solvency & Docs"}</span>
                      <span className="font-mono tabular-nums">{eligibility.financialScore} / 20</span>
                    </div>
                    <div className="mt-2 h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full bg-emerald-700 rounded-full"
                        style={{ width: `${(eligibility.financialScore / 20) * 100}%` }}
                      />
                    </div>
                    <p className="mt-1.5 text-[11px] text-slate-500 font-mono tabular-nums">
                      ৳{(sponsorBankBalanceBdt / 100000).toFixed(1)}L · {eligibility.verifiedDocsCount}/12 Docs
                    </p>
                  </div>
                </div>
              </div>

              {/* Main Bio & Academic Form Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left 7 Cols: Personal & Guardian Information */}
                <div className="lg:col-span-7 rounded-2xl border border-slate-200/80 bg-white p-5 space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                    {isBn
                      ? "ব্যক্তিগত, পাসপোর্ট ও অভিভাবকের তথ্য"
                      : "Personal, Passport & Guardian Information"}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                    <div>
                      <label className="font-semibold text-slate-700">
                        {isBn ? "প্রার্থীর পূর্ণ নাম *" : "Candidate Full Name *"}
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-semibold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">
                        {isBn ? "মোবাইল নম্বর *" : "Phone Number *"}
                      </label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-mono font-semibold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">
                        {isBn ? "WhatsApp নম্বর" : "WhatsApp Number"}
                      </label>
                      <input
                        type="text"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-mono"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">
                        {isBn ? "ইমেইল ঠিকানা" : "Email Address"}
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="student@email.com"
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-mono"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">
                        {isBn ? "জেলা / শহর" : "City / District"}
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">
                        {isBn ? "পাসপোর্ট নম্বর (যদি থাকে)" : "Passport Number"}
                      </label>
                      <input
                        type="text"
                        value={passportNo}
                        onChange={(e) => setPassportNo(e.target.value)}
                        placeholder="e.g. A04928172"
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-mono"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="font-semibold text-slate-700">
                        {isBn ? "বর্তমান ও স্থায়ী ঠিকানা" : "Current & Permanent Address"}
                      </label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder={isBn ? "বাসা/রোড, থানা, জেলা..." : "House/Road, Area, District..."}
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">
                        {isBn ? "অভিভাবক / স্পন্সরের নাম" : "Guardian / Sponsor Name"}
                      </label>
                      <input
                        type="text"
                        value={guardianName}
                        onChange={(e) => setGuardianName(e.target.value)}
                        placeholder={isBn ? "পিতা / মাতা / ভাই" : "Father / Mother / Sibling"}
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">
                        {isBn ? "অভিভাবকের ফোন নম্বর" : "Guardian Phone"}
                      </label>
                      <input
                        type="text"
                        value={guardianPhone}
                        onChange={(e) => setGuardianPhone(e.target.value)}
                        placeholder="017..."
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Right 5 Cols: Academic GPA, Study Gap, Japanese Exam & ERP Assignment */}
                <div className="lg:col-span-5 rounded-2xl border border-slate-200/80 bg-white p-5 space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                    {isBn
                      ? "একাডেমিক ফলাফল, জাপানি পরীক্ষা ও অ্যাসাইনমেন্ট"
                      : "Academic GPA, Japanese Exam & ERP Links"}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                    <div>
                      <label className="font-semibold text-slate-700">
                        {isBn ? "সর্বশেষ শিক্ষাগত যোগ্যতা" : "Highest Education"}
                      </label>
                      <input
                        type="text"
                        value={education}
                        onChange={(e) => setEducation(e.target.value)}
                        placeholder="HSC / Diploma / BSc"
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-semibold"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">
                        {isBn ? "পাসের সাল ও স্টাডি গ্যাপ" : "Pass Year & Gap (Yrs)"}
                      </label>
                      <div className="mt-1 grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={graduationYear}
                          onChange={(e) => setGraduationYear(e.target.value)}
                          placeholder="2024"
                          className="w-full rounded-xl border border-slate-200 px-2.5 py-2 font-mono tabular-nums"
                        />
                        <input
                          type="number"
                          min={0}
                          max={15}
                          value={studyGapYears}
                          onChange={(e) => setStudyGapYears(Number(e.target.value))}
                          className="w-full rounded-xl border border-slate-200 px-2.5 py-2 font-mono font-semibold tabular-nums"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700">SSC / সমমান GPA</label>
                      <input
                        type="text"
                        value={sscGpa}
                        onChange={(e) => setSscGpa(e.target.value)}
                        placeholder="4.50"
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-mono tabular-nums"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">HSC / ডিপ্লোমা GPA</label>
                      <input
                        type="text"
                        value={hscGpa}
                        onChange={(e) => setHscGpa(e.target.value)}
                        placeholder="4.25"
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-mono tabular-nums"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700">
                        {isBn ? "জাপানি ভাষা স্তর" : "Japanese Level"}
                      </label>
                      <select
                        value={japaneseProficiency}
                        onChange={(e) => setJapaneseProficiency(e.target.value as any)}
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-semibold"
                      >
                        <option value="NONE">শুরু করেনি (NONE)</option>
                        <option value="LEARNING_N5">N5 শিখছে (LEARNING_N5)</option>
                        <option value="PASSED_N5">JLPT/NAT N5 পাস</option>
                        <option value="PASSED_N4">JLPT/JFT N4 পাস</option>
                        <option value="NAT_JFT">NAT / JFT Basic পাস</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700">
                        {isBn ? "অফিসিয়াল পরীক্ষা (JLPT/NAT/JFT)" : "Official Exam Type"}
                      </label>
                      <select
                        value={japaneseExamType}
                        onChange={(e) => setJapaneseExamType(e.target.value as any)}
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-semibold"
                      >
                        <option value="NONE">এখনো নিবন্ধন করেনি</option>
                        <option value="JLPT_N5">JLPT N5</option>
                        <option value="NAT_5Q">NAT-TEST 5Q (N5 Eqv.)</option>
                        <option value="JLPT_N4">JLPT N4</option>
                        <option value="NAT_4Q">NAT-TEST 4Q (N4 Eqv.)</option>
                        <option value="JFT_BASIC">JFT-Basic (SSW)</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700">
                        {isBn ? "পরীক্ষার স্ট্যাটাস" : "Exam Status"}
                      </label>
                      <select
                        value={japaneseExamStatus}
                        onChange={(e) => setJapaneseExamStatus(e.target.value as any)}
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium"
                      >
                        <option value="NOT_REGISTERED">Not Registered</option>
                        <option value="REGISTERED">Registered (Admit Card)</option>
                        <option value="PASSED">Passed (Certificate Ready)</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700">
                        {isBn ? "স্কোর / রেজিঃ নম্বর" : "Exam Score / Reg No"}
                      </label>
                      <input
                        type="text"
                        value={japaneseExamScore}
                        onChange={(e) => setJapaneseExamScore(e.target.value)}
                        placeholder="e.g. 112/180"
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-mono tabular-nums"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700">
                        {isBn ? "লিড প্রায়োরিটি" : "Priority"}
                      </label>
                      <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as LeadPriority)}
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-bold"
                      >
                        <option value="HOT">HOT (তাৎক্ষণিক ভর্তি প্রস্তুত)</option>
                        <option value="WARM">WARM (ফলো-আপ চলমান)</option>
                        <option value="COLD">COLD (পরবর্তীতে যোগাযোগ)</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700">
                        {isBn ? "লিড স্ট্যাটাস" : "Lead Status"}
                      </label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as LeadStatus)}
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-semibold"
                      >
                        <option value="NEW">NEW (নতুন লিড)</option>
                        <option value="CONTACTED">CONTACTED (কথা হয়েছে)</option>
                        <option value="COUNSELED">COUNSELED (কাউন্সেলিং সম্পন্ন)</option>
                        <option value="OFFICE_VISIT_BOOKED">OFFICE_VISIT_BOOKED</option>
                        <option value="ADMITTED">ADMITTED (ভর্তি / ফাইল ওপেন)</option>
                        <option value="ARCHIVED">ARCHIVED</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700">
                        {isBn ? "দায়িত্বপ্রাপ্ত কাউন্সেলর (HR)" : "Assigned Counselor"}
                      </label>
                      <select
                        value={assignedCounselorId}
                        onChange={(e) => {
                          const found = counselors.find((c) => c.id === e.target.value);
                          setAssignedCounselorId(e.target.value);
                          if (found) setAssignedTo(found.name);
                        }}
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium"
                      >
                        <option value="">{assignedTo}</option>
                        {counselors.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name} ({c.role})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700">
                        {isBn ? "রেফারকারী বিটুবি এজেন্ট" : "Referring B2B Agent"}
                      </label>
                      <select
                        value={b2bAgentId}
                        onChange={(e) => {
                          const ag = b2bAgents.find((a) => a.id === e.target.value);
                          setB2bAgentId(e.target.value);
                          setB2bAgentName(ag?.organizationName || "");
                        }}
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium"
                      >
                        <option value="">সরাসরি অফিস (Direct Inquiry)</option>
                        {b2bAgents.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.organizationName} ({a.city})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* -------------------------------------------------------------------
              TAB 2: 12-ITEM DOCUMENT VAULT & SPONSOR SOLVENCY CALCULATOR
              ------------------------------------------------------------------- */}
          {activeTab === "docs" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left 7 Cols: 12-Item Immigration Document Checklist */}
              <div className="lg:col-span-7 rounded-2xl border border-slate-200/80 bg-white p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {isBn
                        ? "জাপান ইমিগ্রেশন (COE) ১২টি আবশ্যিক ডকুমেন্ট চেকলিস্ট ভল্ট"
                        : "12-Item Japan Immigration COE Document Checklist Vault"}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {isBn
                        ? "যেকোনো ডকুমেন্টে ক্লিক করে স্ট্যাটাস পরিবর্তন করুন (Missing ➔ Submitted ➔ Verified)"
                        : "Click any item to cycle status between Missing, Submitted, and Verified"}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => markAllDocsStatus("SUBMITTED")}
                      className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 transition"
                    >
                      {isBn ? "সব জমা হয়েছে" : "All Submitted"}
                    </button>
                    <button
                      type="button"
                      onClick={() => markAllDocsStatus("VERIFIED")}
                      className="rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-emerald-700 transition"
                    >
                      {isBn ? "সব ভেরিফাইড" : "Verify All"}
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700 tabular-nums">
                    <span>
                      {isBn ? "ডকুমেন্ট প্রস্তুতি অগ্রগতি" : "Document Readiness"}
                    </span>
                    <span>
                      {eligibility.verifiedDocsCount} Verified · {eligibility.submittedDocsCount} Submitted /{" "}
                      {eligibility.totalDocsCount} Total
                    </span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all"
                      style={{
                        width: `${Math.round(
                          ((eligibility.verifiedDocsCount + eligibility.submittedDocsCount * 0.5) /
                            eligibility.totalDocsCount) *
                            100,
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                {/* 12 Document Rows */}
                <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                  {documentChecklist.map((doc, idx) => (
                    <div
                      key={doc.id}
                      onClick={() => cycleDocStatus(doc.id)}
                      className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer transition select-none"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-xs font-mono font-semibold text-slate-400 w-5 shrink-0 tabular-nums">
                          {String(idx + 1).padStart(2, "0")}.
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-900 truncate">
                            {isBn ? doc.titleBn : doc.titleEn}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {doc.category} {doc.updatedAt ? `· Updated ${doc.updatedAt}` : ""}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        className={`shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition ${
                          doc.status === "VERIFIED"
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : doc.status === "SUBMITTED"
                              ? "bg-amber-50 text-amber-800 border border-amber-200"
                              : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                      >
                        {doc.status === "VERIFIED"
                          ? isBn
                            ? "✓ ভেরিফাইড (Verified)"
                            : "✓ Verified"
                          : doc.status === "SUBMITTED"
                            ? isBn
                              ? "জমা দিয়েছে (Submitted)"
                              : "Submitted"
                            : isBn
                              ? "বাকি আছে (Missing)"
                              : "Missing"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right 5 Cols: Sponsor Bank Solvency & Education Loan Calculator */}
              <div className="lg:col-span-5 rounded-2xl border border-slate-200/80 bg-white p-5 space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Landmark className="h-4 w-4 text-slate-700" />
                    <span>
                      {isBn
                        ? "স্পন্সর ব্যাংক সলভেন্সি ও লোন ক্যালকুলেটর"
                        : "Sponsor Bank Solvency & Loan Calculator"}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {isBn
                      ? "জাপান ইমিগ্রেশনের নিয়ম অনুযায়ী স্পন্সরের ন্যূনতম ১৮–২০ লক্ষ টাকা সলভেন্সি যাচাই"
                      : "Verify required ৳18L–20L BDT sponsor bank solvency for Japan Immigration"}
                  </p>
                </div>

                {/* Live Solvency Verdict Box */}
                <div
                  className={`rounded-xl p-4 border ${
                    solvencyDeltaBdt >= 0
                      ? "bg-emerald-50/70 border-emerald-200 text-emerald-950"
                      : "bg-amber-50/70 border-amber-200 text-amber-950"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span>
                      {isBn ? "প্রয়োজনীয় সলভেন্সি:" : "Required Solvency:"} ৳
                      {requiredSolvencyBdt.toLocaleString()}
                    </span>
                    <span className="font-mono tabular-nums">
                      {solvencyDeltaBdt >= 0
                        ? `+৳${solvencyDeltaBdt.toLocaleString()} উদ্বৃত্ত`
                        : `-৳${Math.abs(solvencyDeltaBdt).toLocaleString()} ঘাটতি`}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs">
                    {solvencyDeltaBdt >= 0
                      ? isBn
                        ? "✓ স্পন্সরের ব্যাংক ব্যালেন্স জাপান ইমিগ্রেশনের COE আবেদনের জন্য সম্পূর্ণ পর্যাপ্ত।"
                        : "✓ Sponsor bank balance meets Japan Immigration COE requirements."
                      : isBn
                        ? "⚠ ব্যালেন্স কিছুটা কম রয়েছে — অগ্রণী / সোস্যাল ইসলামী / পূবালী ব্যাংকের এডুকেশন লোন সহায়তা নেওয়ার পরামর্শ দিন।"
                        : "⚠ Balance shortfall detected — enable Partner Bank Education Loan support below."}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700">
                      {isBn ? "স্পন্সরের সাথে সম্পর্ক" : "Sponsor Relation"}
                    </label>
                    <select
                      value={sponsorRelation}
                      onChange={(e) => setSponsorRelation(e.target.value as any)}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-semibold"
                    >
                      <option value="FATHER">পিতা (Father)</option>
                      <option value="MOTHER">মাতা (Mother)</option>
                      <option value="BROTHER">ভাই (Brother)</option>
                      <option value="SISTER">বোন (Sister)</option>
                      <option value="SELF">নিজস্ব (Self)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700">
                      {isBn ? "স্পন্সরের পেশা / আয়ের উৎস" : "Sponsor Occupation"}
                    </label>
                    <input
                      type="text"
                      value={sponsorOccupation}
                      onChange={(e) => setSponsorOccupation(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700">
                      {isBn ? "স্পন্সরের মাসিক আয় (BDT)" : "Monthly Income (BDT)"}
                    </label>
                    <input
                      type="number"
                      value={sponsorMonthlyIncomeBdt}
                      onChange={(e) => setSponsorMonthlyIncomeBdt(Number(e.target.value))}
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-mono font-semibold tabular-nums"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700">
                      {isBn ? "বার্ষিক আয় হিসাব (১২ মাস)" : "Annual Income (Calculated)"}
                    </label>
                    <div className="mt-1 w-full rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 font-mono font-bold text-slate-800 tabular-nums">
                      ৳{(sponsorMonthlyIncomeBdt * 12).toLocaleString()} / yr
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-semibold text-slate-700">
                      {isBn ? "স্পন্সরের ব্যাংকের নাম ও শাখা" : "Sponsor Bank Name"}
                    </label>
                    <input
                      type="text"
                      value={sponsorBankName}
                      onChange={(e) => setSponsorBankName(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-semibold text-slate-700">
                      {isBn ? "বর্তমান ব্যাংক সলভেন্সি ব্যালেন্স (BDT)" : "Current Bank Balance (BDT)"}
                    </label>
                    <input
                      type="number"
                      step={50000}
                      value={sponsorBankBalanceBdt}
                      onChange={(e) => setSponsorBankBalanceBdt(Number(e.target.value))}
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-mono text-sm font-bold text-emerald-800 tabular-nums"
                    />
                  </div>

                  <div className="sm:col-span-2 pt-2 border-t border-slate-100">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={bankLoanRequired}
                        onChange={(e) => setBankLoanRequired(e.target.checked)}
                        className="h-4 w-4 rounded accent-slate-900"
                      />
                      <span className="font-semibold text-slate-800">
                        {isBn
                          ? "KNLTC পার্টনার ব্যাংক এডুকেশন লোন সহায়তা প্রয়োজন"
                          : "Requires Partner Bank Education Loan Assistance"}
                      </span>
                    </label>

                    {bankLoanRequired && (
                      <div className="mt-2.5">
                        <label className="font-semibold text-slate-700">
                          {isBn ? "পছন্দের লোন প্রদানকারী ব্যাংক" : "Preferred Partner Bank"}
                        </label>
                        <select
                          value={preferredLoanBank}
                          onChange={(e) => setPreferredLoanBank(e.target.value)}
                          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium"
                        >
                          <option value="অগ্রণী ব্যাংক পিএলসি (এডুকেশন লোন)">
                            অগ্রণী ব্যাংক পিএলসি (Agrani Bank PLC)
                          </option>
                          <option value="সোস্যাল ইসলামী ব্যাংক (SIBL)">
                            সোস্যাল ইসলামী ব্যাংক (SIBL)
                          </option>
                          <option value="পূবালী ব্যাংক পিএলসি">
                            পূবালী ব্যাংক পিএলসি (Pubali Bank PLC)
                          </option>
                          <option value="ব্র্যাক ব্যাংক স্টুডেন্ট ফাইল">
                            ব্র্যাক ব্যাংক (BRAC Bank Student File)
                          </option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* -------------------------------------------------------------------
              TAB 3: LIVE STUDENT LEDGER, 10-STEP VISA CONTROLLER & LMS PROGRESS
              ------------------------------------------------------------------- */}
          {activeTab === "finance_visa" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left 6 Cols: Live Student Financial Ledger & Instant Fee Collection */}
              <div className="lg:col-span-6 space-y-5">
                <div className="rounded-2xl border border-slate-200/80 bg-white p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        {isBn
                          ? "শিক্ষার্থীর লাইভ পেমেন্ট লেজার ও কিস্তি আদায়"
                          : "Live Student Financial Ledger & Fee Collection"}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {isBn
                          ? "এখান থেকে ফি জমা নিলে মূল Finance লেজার ও রসিদে স্বয়ংক্রিয়ভাবে যুক্ত হবে"
                          : "Collecting fees here syncs directly with the main Finance Ledger"}
                      </p>
                    </div>
                    <Receipt className="h-4 w-4 text-slate-400" />
                  </div>

                  {/* 3 Financial Summary Boxes */}
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3">
                      <span className="text-[11px] text-slate-500 block">
                        {isBn ? "মোট চুক্তিমূল্য (Contract)" : "Total Contract"}
                      </span>
                      <input
                        type="number"
                        step={5000}
                        value={contractAmountBdt}
                        onChange={(e) => setContractAmountBdt(Number(e.target.value))}
                        className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-1 font-mono text-sm font-bold text-slate-900 tabular-nums"
                      />
                    </div>
                    <div className="rounded-xl border border-emerald-200/70 bg-emerald-50/50 p-3">
                      <span className="text-[11px] text-emerald-800 block">
                        {isBn ? "মোট পরিশোধিত (Paid)" : "Total Paid"}
                      </span>
                      <p className="mt-1.5 font-mono text-base font-bold text-emerald-700 tabular-nums">
                        ৳{livePaidAmountBdt.toLocaleString()}
                      </p>
                    </div>
                    <div className="rounded-xl border border-amber-200/70 bg-amber-50/50 p-3">
                      <span className="text-[11px] text-amber-900 block">
                        {isBn ? "বর্তমান বকেয়া (Due)" : "Current Due"}
                      </span>
                      <p className="mt-1.5 font-mono text-base font-bold text-amber-800 tabular-nums">
                        ৳{liveDueAmountBdt.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Quick Collect Fee Installment Form */}
                  <form
                    onSubmit={handleQuickCollectFee}
                    className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-4 space-y-3 text-xs"
                  >
                    <p className="font-bold text-slate-900">
                      {isBn ? "+ তাৎক্ষণিক কিস্তি / ফি জমা নিন" : "+ Record Instant Fee Payment"}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-semibold text-slate-700">
                          {isBn ? "জমার পরিমাণ (BDT)" : "Amount (BDT)"}
                        </label>
                        <input
                          type="number"
                          required
                          min={100}
                          value={feeAmountBdt}
                          onChange={(e) => setFeeAmountBdt(Number(e.target.value))}
                          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-mono font-bold tabular-nums"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700">
                          {isBn ? "খাত / ফি টাইপ" : "Fee Type"}
                        </label>
                        <select
                          value={feeType}
                          onChange={(e) => setFeeType(e.target.value as TransactionType)}
                          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium"
                        >
                          <option value="COURSE_FEE">ভাষা কোর্স ফি (N5/N4)</option>
                          <option value="SERVICE_CHARGE_COE">COE সার্ভিস চার্জ</option>
                          <option value="REGULAR_SERVICE_CHARGE">রেগুলার প্যাকেজ কিস্তি</option>
                          <option value="PREMIUM_PACKAGE_ADVANCE">প্রিমিয়াম প্যাকেজ কিস্তি</option>
                        </select>
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700">
                          {isBn ? "পেমেন্ট মাধ্যম" : "Payment Method"}
                        </label>
                        <select
                          value={feeMethod}
                          onChange={(e) => setFeeMethod(e.target.value as any)}
                          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium"
                        >
                          <option value="BKASH">bKash Merchant</option>
                          <option value="NAGAD">Nagad</option>
                          <option value="BANK_TRANSFER">Bank Transfer</option>
                          <option value="CASH_OFFICE">Cash at Office</option>
                        </select>
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700">
                          {isBn ? "TrxID / রেফারেন্স" : "TrxID / Reference"}
                        </label>
                        <input
                          type="text"
                          value={feeTrxRef}
                          onChange={(e) => setFeeTrxRef(e.target.value)}
                          placeholder="e.g. BK982341"
                          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-mono"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full rounded-xl bg-emerald-600 py-2.5 text-xs font-semibold text-white hover:bg-emerald-700 transition"
                    >
                      {isBn
                        ? "ফি জমা দিন ও মানি রসিদ জেনারেট করুন"
                        : "Collect Fee & Issue Official Receipt"}
                    </button>
                  </form>

                  {/* Student Payment History Table */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 mb-2">
                      {isBn
                        ? `পূর্বে পরিশোধিত রসিদসমূহ (${studentTransactions.length})`
                        : `Payment Receipt History (${studentTransactions.length})`}
                    </h4>
                    {studentTransactions.length > 0 ? (
                      <div className="divide-y divide-slate-100 rounded-xl border border-slate-200/80 overflow-hidden text-xs">
                        {studentTransactions.map((tx) => (
                          <div
                            key={tx.id}
                            className="flex items-center justify-between px-3.5 py-2.5 bg-white"
                          >
                            <div>
                              <span className="font-mono font-semibold text-slate-900">
                                {tx.receiptNo}
                              </span>
                              <span className="text-slate-400 mx-1.5">·</span>
                              <span className="text-slate-600">{tx.type}</span>
                              <p className="text-[11px] text-slate-400 font-mono">
                                {tx.date} · {tx.paymentMethod} ({tx.referenceOrTrx})
                              </p>
                            </div>
                            <span className="font-mono font-bold text-emerald-700 tabular-nums">
                              +৳{tx.amountBdt.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="rounded-xl border border-slate-200/60 bg-slate-50 p-4 text-center text-xs text-slate-400">
                        {isBn
                          ? "এই শিক্ষার্থীর নামে এখনো কোনো পেমেন্ট রসিদ নেই।"
                          : "No payment receipts recorded for this student yet."}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right 6 Cols: Direct 10-Step Visa Stage Controller & LMS Progress */}
              <div className="lg:col-span-6 space-y-5">
                {/* 10-Step Visa Pipeline Controller */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        {isBn
                          ? "১০-ধাপ ভিসা পাইপলাইন ও জাপানি স্কুল ইন্টারভিউ কন্ট্রোল"
                          : "10-Step Visa Pipeline & School Interview Controller"}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {linkedVisa
                          ? `Tracking ID: ${linkedVisa.trackingNo} · COE: ${linkedVisa.coEStatus}`
                          : isBn
                            ? "যেকোনো ধাপে ক্লিক করলেই ভিসা পাইপলাইনে ফাইল চালু ও সিঙ্ক হবে"
                            : "Select a stage below to activate or advance in the Visa Pipeline"}
                      </p>
                    </div>
                    <Plane className="h-4 w-4 text-slate-400" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="font-semibold text-slate-700">
                        {isBn ? "ভিসা প্রসেসিং ধাপ (Stage 1–10)" : "Current Visa Stage (1–10)"}
                      </label>
                      <select
                        value={linkedVisa?.stage || 1}
                        onChange={(e) =>
                          handleAdvanceOrSetVisaStage(Number(e.target.value) as VisaStage)
                        }
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-semibold text-slate-900"
                      >
                        {([1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as VisaStage[]).map((st) => (
                          <option key={st} value={st}>
                            {VISA_STAGE_LABELS_BN[st]}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700">
                        {isBn ? "টার্গেট জাপানি পার্টনার স্কুল" : "Target Partner School"}
                      </label>
                      <select
                        value={partnerSchoolId}
                        onChange={(e) => {
                          const sc = partnerSchools.find((s) => s.id === e.target.value);
                          setPartnerSchoolId(e.target.value);
                          if (sc) setTargetSchool(sc.name);
                        }}
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium"
                      >
                        <option value="">-- স্কুল নির্বাচন করুন --</option>
                        {partnerSchools.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name} ({s.location})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700">
                        {isBn ? "স্কুল জুম ইন্টারভিউ স্ট্যাটাস" : "School Interview Status"}
                      </label>
                      <select
                        value={schoolInterviewStatus}
                        onChange={(e) => setSchoolInterviewStatus(e.target.value as any)}
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-semibold"
                      >
                        <option value="NOT_SCHEDULED">নির্ধারিত হয়নি (Not Scheduled)</option>
                        <option value="SCHEDULED">ইন্টারভিউ শিডিউলড (Scheduled)</option>
                        <option value="PASSED">ইন্টারভিউ উত্তীর্ণ (Passed ✓)</option>
                        <option value="RE_INTERVIEW">পুনঃইন্টারভিউ (Re-Interview)</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700">
                        {isBn ? "ইন্টারভিউ তারিখ" : "Interview Date"}
                      </label>
                      <input
                        type="date"
                        value={schoolInterviewDate}
                        onChange={(e) => setSchoolInterviewDate(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-mono"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="font-semibold text-slate-700">
                        {isBn ? "দায়িত্বপ্রাপ্ত ভিসা প্রসেসিং অফিসার (HR)" : "Assigned Visa Officer"}
                      </label>
                      <select
                        value={assignedVisaOfficerId}
                        onChange={(e) => setAssignedVisaOfficerId(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium"
                      >
                        <option value="">-- ভিসা অফিসার নির্বাচন করুন --</option>
                        {visaOfficers.map((vo) => (
                          <option key={vo.id} value={vo.id}>
                            {vo.name} ({vo.role})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* LMS Batch Progress & Attendance Summary */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        {isBn
                          ? "জাপানি ভাষা ব্যাচ (LMS) অগ্রগতি ও উপস্থিতি"
                          : "LMS Language Batch Progress & Attendance"}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {linkedLms
                          ? `Enrollment: ${linkedLms.enrollmentNo} · Sensei: ${linkedLms.assignedSenseiName || senseis[0]?.name || "Assigned"}`
                          : isBn
                            ? "শিক্ষার্থীর ক্লাস উপস্থিতি ও সিলেবাস সম্পন্ন করার হার"
                            : "Track syllabus completion and classroom attendance"}
                      </p>
                    </div>
                    <BookOpen className="h-4 w-4 text-slate-400" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                    <div>
                      <label className="font-semibold text-slate-700">
                        {isBn ? "ভর্তিকৃত ব্যাচ / সেশন" : "Active Batch / Session"}
                      </label>
                      <input
                        type="text"
                        value={enrolledBatchOrSession}
                        onChange={(e) => setEnrolledBatchOrSession(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-medium"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">
                        {isBn ? "কোর্স লেভেল" : "Course Level"}
                      </label>
                      <select
                        value={courseLevel}
                        onChange={(e) => setCourseLevel(e.target.value as any)}
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-semibold"
                      >
                        <option value="N5">JLPT N5 (Minna no Nihongo I)</option>
                        <option value="N4">JLPT N4 (Minna no Nihongo II)</option>
                        <option value="IRODORI">Irodori Spoken Japanese</option>
                      </select>
                    </div>

                    <div>
                      <div className="flex items-center justify-between font-semibold text-slate-700">
                        <span>{isBn ? "সিলেবাস অগ্রগতি (LMS)" : "Syllabus Progress"}</span>
                        <span className="font-mono tabular-nums">{lmsProgressPct}%</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={lmsProgressPct}
                        onChange={(e) => setLmsProgressPct(Number(e.target.value))}
                        className="mt-2 w-full accent-slate-900"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between font-semibold text-slate-700">
                        <span>{isBn ? "ক্লাস উপস্থিতির হার (Attendance)" : "Class Attendance"}</span>
                        <span className="font-mono tabular-nums">{attendancePct}%</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={attendancePct}
                        onChange={(e) => setAttendancePct(Number(e.target.value))}
                        className="mt-2 w-full accent-emerald-600"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* -------------------------------------------------------------------
              TAB 4: COUNSELING TIMELINE, FOLLOW-UP & 1-CLICK WHATSAPP TEMPLATES
              ------------------------------------------------------------------- */}
          {activeTab === "timeline" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left 7 Cols: Add Activity & Chronological Counseling Feed */}
              <div className="lg:col-span-7 space-y-5">
                <div className="rounded-2xl border border-slate-200/80 bg-white p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        {isBn
                          ? "কাউন্সেলিং ও কল অ্যাক্টিভিটি লগ (Timestamped Timeline)"
                          : "Timestamped Counseling & Call Activity Log"}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {isBn
                          ? "প্রার্থীর সাথে প্রতিটি ফোনালাপ, অফিস ভিজিট ও মিটিং নোট তারিখসহ সংরক্ষণ করুন"
                          : "Record every phone call, office visit, and guardian meeting with timestamps"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-semibold text-slate-600">
                        {isBn ? "পরবর্তী ফলো-আপ:" : "Next Follow-up:"}
                      </span>
                      <input
                        type="date"
                        value={followUpDate}
                        onChange={(e) => setFollowUpDate(e.target.value)}
                        className="rounded-lg border border-slate-200 px-2.5 py-1 font-mono text-xs"
                      />
                    </div>
                  </div>

                  {/* New Activity Input Box */}
                  <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 space-y-3 text-xs">
                    <div className="flex flex-wrap items-center gap-2">
                      {(
                        [
                          { id: "CALL", labelBn: "ফোনালাপ (Phone Call)" },
                          { id: "VISIT", labelBn: "অফিস ভিজিট (Office Visit)" },
                          { id: "MEETING_NOTE", labelBn: "ভয়েস / মিটিং সামারি" },
                          { id: "DOC_UPDATE", labelBn: "ডকুমেন্ট ফলো-আপ" },
                        ] as const
                      ).map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setNewActivityType(item.id)}
                          className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition ${
                            newActivityType === item.id
                              ? "bg-slate-900 text-white"
                              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          {item.labelBn}
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newActivitySummary}
                        onChange={(e) => setNewActivitySummary(e.target.value)}
                        placeholder={
                          isBn
                            ? "কথোপকথনের সারসংক্ষেপ লিখুন (যেমন: অভিভাবক আগামীকাল পাসপোর্ট ও মার্কশিট নিয়ে আসবেন)..."
                            : "Write call or meeting summary..."
                        }
                        className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddActivityEntry()}
                        className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition shrink-0"
                      >
                        {isBn ? "+ লগ যুক্ত করুন" : "+ Log Entry"}
                      </button>
                    </div>
                  </div>

                  {/* Activity Timeline List */}
                  <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                    {activityLog.map((act) => (
                      <div key={act.id} className="p-3.5 bg-white hover:bg-slate-50/60 transition">
                        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                          <span className="font-sans font-semibold text-slate-700">
                            {act.type} · {act.counselorName}
                          </span>
                          <span>{new Date(act.createdAt).toLocaleString()}</span>
                        </div>
                        <p className="mt-1 text-xs text-slate-800 leading-relaxed">{act.summary}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right 5 Cols: 1-Click Contextual WhatsApp Templates */}
              <div className="lg:col-span-5 space-y-5">
                <div className="rounded-2xl border border-slate-200/80 bg-white p-5 space-y-4">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-bold text-slate-900">
                      {isBn
                        ? "১-ক্লিক প্রফেশনাল WhatsApp মেসেজ টেমপ্লেট"
                        : "1-Click Contextual WhatsApp Templates"}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {isBn
                        ? "যেকোনো টেমপ্লেটে ক্লিক করলে প্রার্থীর নাম ও তথ্যসহ WhatsApp ওপেন হবে এবং টাইমলাইনে রেকর্ড থাকবে"
                        : "Click any template to send via WhatsApp and auto-log in the timeline"}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {whatsappTemplates.map((tpl) => {
                      const href = `https://wa.me/${cleanWaNumber}?text=${encodeURIComponent(tpl.message)}`;
                      return (
                        <div
                          key={tpl.id}
                          className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-3.5 space-y-2"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-slate-900">
                              {isBn ? tpl.titleBn : tpl.titleEn}
                            </span>
                            <a
                              href={href}
                              target="_blank"
                              rel="noreferrer"
                              onClick={() =>
                                handleAddActivityEntry(
                                  "WHATSAPP",
                                  `WhatsApp মেসেজ পাঠানো হয়েছে: ${tpl.titleBn}`,
                                )
                              }
                              className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-emerald-700 transition shrink-0"
                            >
                              <Send className="h-3 w-3" />
                              <span>WhatsApp পাঠান</span>
                            </a>
                          </div>
                          <p className="text-[11px] text-slate-600 whitespace-pre-line line-clamp-3">
                            {tpl.message}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* -------------------------------------------------------------------
              TAB 5: PORTAL LOGIN ACCESS & PRINTABLE OFFICIAL ASSESSMENT SHEET
              ------------------------------------------------------------------- */}
          {activeTab === "access_print" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left 5 Cols: Portal Login Credentials & Permissions */}
              <div className="lg:col-span-5 rounded-2xl border border-slate-200/80 bg-white p-5 space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <KeyRound className="h-4 w-4 text-slate-700" />
                    <span>
                      {isBn
                        ? "স্টুডেন্ট পোর্টাল লগইন ও অ্যাক্সেস কন্ট্রোল"
                        : "Student Portal Login & Access Control"}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {isBn
                      ? "শিক্ষার্থীকে পোর্টাল আইডি ও পাসওয়ার্ড দিয়ে তার নিজস্ব ফাইল ও ক্লাসরুম অ্যাক্সেস দিন"
                      : "Provision student portal credentials and module permissions"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <label
                    className={`flex items-start gap-2.5 rounded-xl border p-3 cursor-pointer transition ${
                      isCourseEnrolled
                        ? "border-emerald-600 bg-emerald-50/50"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isCourseEnrolled}
                      onChange={(e) => setIsCourseEnrolled(e.target.checked)}
                      className="mt-0.5 h-4 w-4 accent-emerald-600"
                    />
                    <div>
                      <p className="font-bold text-slate-900">
                        {isBn ? "ভাষা কোর্সে ভর্তি" : "Course Enrolled"}
                      </p>
                      <p className="text-[10px] text-slate-500">LMS ক্লাসরুম চালু হবে</p>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-2.5 rounded-xl border p-3 cursor-pointer transition ${
                      isFileOpened
                        ? "border-emerald-600 bg-emerald-50/50"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isFileOpened}
                      onChange={(e) => setIsFileOpened(e.target.checked)}
                      className="mt-0.5 h-4 w-4 accent-emerald-600"
                    />
                    <div>
                      <p className="font-bold text-slate-900">
                        {isBn ? "ভিসা ফাইল ওপেন" : "Visa File Opened"}
                      </p>
                      <p className="text-[10px] text-slate-500">১০-ধাপ বোর্ডে যুক্ত হবে</p>
                    </div>
                  </label>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700">
                      {isBn ? "লগইন ইমেইল ও পাসওয়ার্ড" : "Login Credentials"}
                    </span>
                    <button
                      type="button"
                      onClick={generateRandomPassword}
                      className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-200"
                    >
                      {isBn ? "নতুন পাসওয়ার্ড জেনারেট" : "Generate Password"}
                    </button>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-600">Login Email / User ID *</label>
                    <input
                      type="text"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-mono font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-600">Login Password *</label>
                    <input
                      type="text"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-mono font-bold text-emerald-800"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-600">
                      {isBn ? "আজকের প্রাথমিক পেমেন্ট জমা (যদি থাকে)" : "Initial Payment Today (BDT)"}
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={1000}
                      value={initialPaymentBdt}
                      onChange={(e) => setInitialPaymentBdt(Number(e.target.value))}
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-mono font-bold tabular-nums"
                    />
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <p className="font-semibold text-slate-700">
                      {isBn ? "পোর্টাল মডিউল পারমিশন:" : "Allowed Student Tabs:"}
                    </p>
                    {(
                      [
                        { id: "my_profile" as DashboardTabId, label: "My Profile & File Tracker" },
                        { id: "visa" as DashboardTabId, label: "10-Step Visa Pipeline Tracker" },
                        { id: "lms" as DashboardTabId, label: "Language Course & LMS Classroom" },
                        { id: "store_blog" as DashboardTabId, label: "Bookstore & Visa Guidelines" },
                      ] as const
                    ).map((tb) => (
                      <label
                        key={tb.id}
                        className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={allowedTabs.includes(tb.id)}
                          onChange={() => toggleTabPermission(tb.id)}
                          className="h-3.5 w-3.5 accent-slate-900"
                        />
                        <span className="font-medium text-slate-800">{tb.label}</span>
                      </label>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleProvisionLoginAndAdmission}
                    className="w-full rounded-xl bg-slate-900 py-3 text-xs font-bold text-white hover:bg-slate-800 transition"
                  >
                    {isBn
                      ? "ভর্তি কনফার্ম ও লগইন অ্যাক্সেস চালু করুন"
                      : "Confirm Admission & Activate Portal Login"}
                  </button>
                </div>
              </div>

              {/* Right 7 Cols: Printable Official Student Assessment & Admission Dossier */}
              <div className="lg:col-span-7 rounded-2xl border border-slate-200/80 bg-white p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div>
                    <p className="text-[11px] font-bold text-emerald-700">
                      KABIR NEW LIFE TRAINING CENTER (KNLTC)
                    </p>
                    <h3 className="text-base font-bold text-slate-900">
                      Official Japan Visa Student Assessment & File Dossier
                    </h3>
                    <p className="text-xs text-slate-500 font-mono">
                      File ID: {lead.fileTrackingNo || lead.id} · Date:{" "}
                      {new Date().toISOString().slice(0, 10)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition shrink-0"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    <span>{isBn ? "প্রিন্ট করুন (A4)" : "Print Dossier"}</span>
                  </button>
                </div>

                {/* Printable Bio & Eligibility Summary Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-slate-400 block">Candidate Name</span>
                    <span className="font-bold text-slate-900">{name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Phone / WhatsApp</span>
                    <span className="font-mono font-semibold text-slate-900">{phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Passport No</span>
                    <span className="font-mono font-semibold text-slate-900">
                      {passportNo || "Pending"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Academic GPA & Gap</span>
                    <span className="font-mono font-semibold text-slate-900">
                      SSC {sscGpa} · HSC {hscGpa} ({studyGapYears}y gap)
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Japanese Level / Exam</span>
                    <span className="font-semibold text-slate-900">
                      {japaneseProficiency} ({japaneseExamType})
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Eligibility Score</span>
                    <span className="font-mono font-bold text-emerald-700">
                      {eligibility.totalScore}% ({eligibility.tier})
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Target Partner School</span>
                    <span className="font-semibold text-slate-900">
                      {targetSchool || "To Be Assigned"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Sponsor & Bank Solvency</span>
                    <span className="font-mono font-semibold text-slate-900">
                      {guardianName || sponsorRelation} · ৳{sponsorBankBalanceBdt.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Contract / Paid / Due</span>
                    <span className="font-mono font-semibold text-slate-900">
                      ৳{contractAmountBdt.toLocaleString()} / ৳{livePaidAmountBdt.toLocaleString()} / Due ৳
                      {liveDueAmountBdt.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Document Verification Summary */}
                <div className="text-xs">
                  <p className="font-bold text-slate-800 mb-2">
                    Document Verification Status ({eligibility.verifiedDocsCount}/
                    {eligibility.totalDocsCount} Verified)
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {documentChecklist.map((d) => (
                      <div
                        key={d.id}
                        className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/70 px-2.5 py-1.5 text-[11px]"
                      >
                        <span className="truncate pr-2 text-slate-700">{d.titleBn}</span>
                        <span
                          className={`font-mono font-bold shrink-0 ${
                            d.status === "VERIFIED"
                              ? "text-emerald-700"
                              : d.status === "SUBMITTED"
                                ? "text-amber-700"
                                : "text-red-600"
                          }`}
                        >
                          {d.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Official Signature Blocks */}
                <div className="pt-8 grid grid-cols-3 gap-6 text-center text-[11px] text-slate-500">
                  <div className="border-t border-slate-300 pt-1.5">
                    Candidate Signature
                  </div>
                  <div className="border-t border-slate-300 pt-1.5">
                    Guardian / Sponsor Signature
                  </div>
                  <div className="border-t border-slate-300 pt-1.5">
                    Counselor ({assignedTo})
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
