"use client";

import React, { useState, useMemo } from "react";
import { trModal } from "@/lib/modal-translations";
import {
  X,
  Building2,
  Briefcase,
  FileText,
  Users,
  Coins,
  CheckCircle2,
  Upload,
  ExternalLink,
  Download,
  Printer,
  Send,
  Plus,
  Trash2,
  Globe,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  KeyRound,
  GraduationCap,
  Calendar,
  Award,
  Link2,
  Sparkles,
  Copy,
  Check,
  Loader2,
} from "lucide-react";
import { uploadMediaImage, uploadDocumentFile } from "@/lib/media-upload";
import {
  type JapanesePartnerSchool,
  type B2bAgent,
  type PartnerDocumentItem,
  type PartnerInstitutionType,
  type IntakeMonth,
  type CrmLead,
  type VisaApplicant,
  type FinancialTransaction,
  getSchoolDocumentVault,
  getB2bAgentDocumentVault,
  updatePartnerSchool,
  updateB2bAgent,
  assignStudentToPartnerSchool,
  assignStudentToB2bAgent,
  claimPartnerSchoolCommission,
  settleB2bAgentCommission,
  getSystemAccounts,
  upsertSystemAccount,
  type SystemUserAccount,
} from "@/lib/knltc-cms-store";

interface PartnerProfileModalProps {
  mode: "SCHOOL" | "AGENT";
  school?: JapanesePartnerSchool | null;
  agent?: B2bAgent | null;
  allLeads: CrmLead[];
  allVisaApplicants: VisaApplicant[];
  allTransactions: FinancialTransaction[];
  language: "bn" | "en" | "ja";
  onClose: () => void;
  onRefreshStore: () => void;
  onShowToast: (msg: string, sub?: string) => void;
}

type ModalTab = "overview" | "docs" | "students" | "ledger";

const INSTITUTION_TYPE_LABELS: Record<
  PartnerInstitutionType,
  { bn: string; en: string; ja: string }
> = {
  LANGUAGE_SCHOOL: {
    bn: "জাপানি ভাষা ইনস্টিটিউট (Nihongo Gakko)",
    en: "Japanese Language School",
    ja: "日本語教育機関（日本語学校）",
  },
  UNIVERSITY: {
    bn: "জাপানি ইউনিভার্সিটি (Daigaku)",
    en: "University (Undergraduate / Postgrad)",
    ja: "日本の大学・大学院",
  },
  VOCATIONAL_COLLEGE: {
    bn: "ভোকেশনাল / টেকনিক্যাল কলেজ (Senmon Gakko)",
    en: "Vocational / Technical College",
    ja: "専門学校（専修学校専門課程）",
  },
  SSW_EMPLOYER: {
    bn: "SSW নিয়োগকারী কোম্পানি / অর্গানাইজেশন",
    en: "SSW Accepting Organization / Employer",
    ja: "特定技能受入企業・登録支援機関",
  },
};

const INTAKE_LABELS: Record<IntakeMonth, { bn: string; en: string; ja: string }> = {
  JANUARY: { bn: "জানুয়ারি ইনটেক", en: "Jan Intake", ja: "1月期生募集" },
  APRIL: { bn: "এপ্রিল ইনটেক", en: "Apr Intake", ja: "4月期生募集" },
  JULY: { bn: "জুলাই ইনটেক", en: "Jul Intake", ja: "7月期生募集" },
  OCTOBER: { bn: "অক্টোবর ইনটেক", en: "Oct Intake", ja: "10月期生募集" },
};

export default function PartnerProfileModal({
  mode,
  school,
  agent,
  allLeads,
  allVisaApplicants,
  allTransactions,
  language,
  onClose,
  onRefreshStore,
  onShowToast,
}: PartnerProfileModalProps) {
  const tr = (bn: string, en: string, ja?: string) => trModal(language, bn, en, ja);
  const [activeTab, setActiveTab] = useState<ModalTab>("overview");
  const [isPrintView, setIsPrintView] = useState(false);

  // ---------------------------------------------------------------------------
  // School Editable State
  // ---------------------------------------------------------------------------
  const [schoolState, setSchoolState] = useState<JapanesePartnerSchool>(() => {
    const base: JapanesePartnerSchool = school || {
      id: "",
      name: "",
      japaneseName: "",
      institutionType: "LANGUAGE_SCHOOL",
      location: "Tokyo",
      contactPerson: "",
      email: "",
      commissionPerStudentYen: 0,
      commissionPerStudentBdt: 0,
      firstYearTuitionYen: 760000,
      admissionFeeYen: 50000,
      hostelFeeMonthlyYen: 35000,
      intakeMonths: ["APRIL", "OCTOBER"],
      minGpaRequired: "3.00",
      maxStudyGapYears: 5,
      minLanguageLevel: "JLPT N5 / NAT 5Q",
      activeStudentsCount: 0,
      intakeQuota: 20,
      totalCommissionReceivedYen: 0,
      status: "ACTIVE_PARTNER",
      documents: [],
      notes: "",
    };
    return {
      ...base,
      institutionType: base.institutionType || "LANGUAGE_SCHOOL",
      intakeMonths:
        base.intakeMonths && base.intakeMonths.length > 0
          ? base.intakeMonths
          : ["APRIL", "OCTOBER"],
      firstYearTuitionYen: base.firstYearTuitionYen ?? 760000,
      admissionFeeYen: base.admissionFeeYen ?? 50000,
      hostelFeeMonthlyYen: base.hostelFeeMonthlyYen ?? 35000,
      minGpaRequired: base.minGpaRequired || "2.80",
      maxStudyGapYears: base.maxStudyGapYears ?? 5,
      minLanguageLevel: base.minLanguageLevel || "JLPT N5 / NAT 5Q",
      documents: getSchoolDocumentVault(base),
    };
  });

  // ---------------------------------------------------------------------------
  // B2B Agent Editable State
  // ---------------------------------------------------------------------------
  const [agentState, setAgentState] = useState<B2bAgent>(() => {
    const base: B2bAgent = agent || {
      id: "",
      organizationName: "",
      agentType: "LOCAL_SUB_AGENT",
      contactPerson: "",
      phone: "",
      city: "Dhaka",
      referredStudentsCount: 0,
      successfulVisasCount: 0,
      agreedCommissionBdt: 30000,
      pendingCommissionBdt: 0,
      paidCommissionBdt: 0,
    };
    return {
      ...base,
      whatsapp: base.whatsapp || base.phone,
      paymentDetails: base.paymentDetails || {
        preferredMethod: "BANK",
        bankName: "",
        accountName: base.contactPerson,
        accountNumber: "",
        branchName: "",
        mobileWalletNo: base.phone,
      },
      documents: getB2bAgentDocumentVault(base),
    };
  });

  // Custom document addition state
  const [newDocTitle, setNewDocTitle] = useState("");
  const [newDocUrl, setNewDocUrl] = useState("");

  // Student assignment state
  const [selectedStudentIdToAssign, setSelectedStudentIdToAssign] = useState("");

  // Financial settlement state
  const [claimStudentCount, setClaimStudentCount] = useState(1);
  const [jpyRate, setJpyRate] = useState(0.8);
  const [agentPayoutAmount, setAgentPayoutAmount] = useState<number>(
    agentState.pendingCommissionBdt || agentState.agreedCommissionBdt || 30000,
  );
  const [agentPayoutMethod, setAgentPayoutMethod] = useState<
    "BKASH" | "NAGAD" | "BANK_TRANSFER" | "CASH_OFFICE"
  >("BANK_TRANSFER");

  // B2B Portal Login state
  const [portalEmail, setPortalEmail] = useState(
    agentState.email ||
      `${(agentState.organizationName || "partner")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")}@knltc-b2b.com`,
  );
  const [portalPassword, setPortalPassword] = useState("B2B@knltc2026");
  const [copiedCredentials, setCopiedCredentials] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [uploadingDocId, setUploadingDocId] = useState<string | null>(null);

  const existingPortalAccount = useMemo<SystemUserAccount | undefined>(() => {
    if (mode !== "AGENT") return undefined;
    const accounts = getSystemAccounts();
    return accounts.find(
      (a) =>
        (agentState.portalAccountId && a.id === agentState.portalAccountId) ||
        (agentState.email &&
          a.email.toLowerCase() === agentState.email.toLowerCase()) ||
        a.name.toLowerCase() === agentState.organizationName.toLowerCase(),
    );
  }, [mode, agentState]);

  // Linked students (CRM + Visa Pipeline)
  const linkedStudents = useMemo(() => {
    const map = new Map<
      string,
      {
        id: string;
        name: string;
        phone: string;
        city: string;
        program: string;
        visaStage?: number;
        coEStatus?: string;
        paidBdt: number;
        dueBdt: number;
      }
    >();

    if (mode === "SCHOOL") {
      allLeads.forEach((l) => {
        if (
          l.targetSchoolId === schoolState.id ||
          (l.targetSchoolName &&
            l.targetSchoolName.toLowerCase() === schoolState.name.toLowerCase())
        ) {
          map.set(l.phone || l.id, {
            id: l.id,
            name: l.name,
            phone: l.phone,
            city: l.city,
            program: l.interest,
            paidBdt: l.paidAmountBdt || 0,
            dueBdt: l.dueAmountBdt || 0,
          });
        }
      });
      allVisaApplicants.forEach((v) => {
        if (
          v.targetSchoolId === schoolState.id ||
          (v.targetSchool &&
            v.targetSchool.toLowerCase() === schoolState.name.toLowerCase())
        ) {
          const existing = map.get(v.phone || v.id);
          map.set(v.phone || v.id, {
            id: existing?.id || v.id,
            name: v.name,
            phone: v.phone,
            city: existing?.city || v.branch,
            program: v.packageType,
            visaStage: v.stage,
            coEStatus: v.coEStatus,
            paidBdt: v.paidAmountBdt ?? existing?.paidBdt ?? 0,
            dueBdt: v.dueAmountBdt ?? existing?.dueBdt ?? 0,
          });
        }
      });
    } else {
      allLeads.forEach((l) => {
        if (
          l.referredByAgentId === agentState.id ||
          (l.referredByAgentName &&
            l.referredByAgentName.toLowerCase() ===
              agentState.organizationName.toLowerCase())
        ) {
          map.set(l.phone || l.id, {
            id: l.id,
            name: l.name,
            phone: l.phone,
            city: l.city,
            program: l.interest,
            paidBdt: l.paidAmountBdt || 0,
            dueBdt: l.dueAmountBdt || 0,
          });
        }
      });
      allVisaApplicants.forEach((v) => {
        if (
          v.b2bAgentId === agentState.id ||
          v.referredByAgentId === agentState.id ||
          (v.b2bAgentName &&
            v.b2bAgentName.toLowerCase() ===
              agentState.organizationName.toLowerCase())
        ) {
          const existing = map.get(v.phone || v.id);
          map.set(v.phone || v.id, {
            id: existing?.id || v.id,
            name: v.name,
            phone: v.phone,
            city: existing?.city || v.branch,
            program: v.packageType,
            visaStage: v.stage,
            coEStatus: v.coEStatus,
            paidBdt: v.paidAmountBdt ?? existing?.paidBdt ?? 0,
            dueBdt: v.dueAmountBdt ?? existing?.dueBdt ?? 0,
          });
        }
      });
    }

    return Array.from(map.values());
  }, [mode, schoolState, agentState, allLeads, allVisaApplicants]);

  // Linked financial transactions
  const linkedTransactions = useMemo(() => {
    if (mode === "SCHOOL") {
      return allTransactions.filter(
        (tx) =>
          tx.linkedSchoolId === schoolState.id ||
          (tx.type === "SCHOOL_COMMISSION_JPY" &&
            tx.studentName
              .toLowerCase()
              .includes(schoolState.name.toLowerCase())),
      );
    }
    return allTransactions.filter(
      (tx) =>
        tx.linkedAgentId === agentState.id ||
        (tx.type === "EXPENSE_B2B_COMMISSION" &&
          tx.studentName
            .toLowerCase()
            .includes(agentState.organizationName.toLowerCase())),
    );
  }, [mode, schoolState, agentState, allTransactions]);

  // Save handler
  const handleSaveProfile = () => {
    if (mode === "SCHOOL") {
      const bdtEquivalent = Math.round(
        (schoolState.commissionPerStudentYen || 0) * jpyRate,
      );
      const updated = {
        ...schoolState,
        schoolName: schoolState.name,
        city: schoolState.location,
        commissionPerStudentBdt: bdtEquivalent,
      };
      updatePartnerSchool(schoolState.id, updated);
      setSchoolState(updated);
      onRefreshStore();
      onShowToast(
        tr(`${schoolState.name}-এর ৩৬০° প্রোফাইল ও ব্রশিউর সংরক্ষিত হয়েছে`, `${schoolState.name} 360° profile saved`),
      );
    } else {
      const updated = {
        ...agentState,
        agencyName: agentState.organizationName,
      };
      updateB2bAgent(agentState.id, updated);
      setAgentState(updated);
      onRefreshStore();
      onShowToast(
        tr(`${agentState.organizationName}-এর বিটুবি প্রোফাইল ও ডকুমেন্ট সংরক্ষিত হয়েছে`, `${agentState.organizationName} B2B profile saved`),
      );
    }
  };

  // Handle Logo File Upload
  const handleLogoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingLogo(true);
    try {
      const result = await uploadMediaImage(file, { bucket: "knltc-media", maxDimension: 600 });
      const finalUrl = result.url;
      if (mode === "SCHOOL") {
        const next = { ...schoolState, logoUrl: finalUrl };
        setSchoolState(next);
        updatePartnerSchool(schoolState.id, { logoUrl: finalUrl });
      } else {
        const next = { ...agentState, logoUrl: finalUrl };
        setAgentState(next);
        updateB2bAgent(agentState.id, { logoUrl: finalUrl });
      }
      onRefreshStore();
      onShowToast(
        tr("প্রতিষ্ঠানের লোগো স্থায়ীভাবে ক্লাউড ও সিস্টেমে সংরক্ষিত হয়েছে", "Logo uploaded & permanently saved"),
      );
    } catch (err) {
      console.error("Logo upload error:", err);
      onShowToast(
        tr("লোগো আপলোড সমস্যা হয়েছে", "Logo upload failed"),
      );
    } finally {
      setIsUploadingLogo(false);
      e.target.value = "";
    }
  };

  // Handle Document File Upload
  const handleDocFileUpload = async (
    docId: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingDocId(docId);
    try {
      const result = await uploadDocumentFile(file, {
        bucket: "knltc-documents",
        trackingNo: mode === "SCHOOL" ? schoolState.id : agentState.id,
        docType: docId,
      });
      const finalUrl = result.url;
      const now = new Date().toISOString().slice(0, 10);
      if (mode === "SCHOOL") {
        const nextDocs = (schoolState.documents || []).map((d) =>
          d.id === docId
            ? {
                ...d,
                status: "VERIFIED" as const,
                fileUrl: finalUrl,
                fileName: result.fileName || file.name,
                uploadedAt: now,
              }
            : d,
        );
        setSchoolState({ ...schoolState, documents: nextDocs });
        updatePartnerSchool(schoolState.id, { documents: nextDocs });
      } else {
        const nextDocs = (agentState.documents || []).map((d) =>
          d.id === docId
            ? {
                ...d,
                status: "VERIFIED" as const,
                fileUrl: finalUrl,
                fileName: result.fileName || file.name,
                uploadedAt: now,
              }
            : d,
        );
        setAgentState({ ...agentState, documents: nextDocs });
        updateB2bAgent(agentState.id, { documents: nextDocs });
      }
      onRefreshStore();
      onShowToast(
        tr(`${file.name} ভল্টে সংরক্ষিত হয়েছে`, `${file.name} saved to vault`),
      );
    } catch (err) {
      console.error("Doc upload error:", err);
    } finally {
      setUploadingDocId(null);
      e.target.value = "";
    }
  };

  // Toggle document status
  const handleToggleDocStatus = (docId: string) => {
    const order: PartnerDocumentItem["status"][] = [
      "MISSING",
      "UPLOADED",
      "VERIFIED",
    ];
    if (mode === "SCHOOL") {
      const nextDocs = (schoolState.documents || []).map((d) => {
        if (d.id !== docId) return d;
        const nextStatus =
          order[(order.indexOf(d.status) + 1) % order.length];
        return {
          ...d,
          status: nextStatus,
          uploadedAt:
            nextStatus !== "MISSING"
              ? d.uploadedAt || new Date().toISOString().slice(0, 10)
              : undefined,
        };
      });
      setSchoolState({ ...schoolState, documents: nextDocs });
      updatePartnerSchool(schoolState.id, { documents: nextDocs });
    } else {
      const nextDocs = (agentState.documents || []).map((d) => {
        if (d.id !== docId) return d;
        const nextStatus =
          order[(order.indexOf(d.status) + 1) % order.length];
        return {
          ...d,
          status: nextStatus,
          uploadedAt:
            nextStatus !== "MISSING"
              ? d.uploadedAt || new Date().toISOString().slice(0, 10)
              : undefined,
        };
      });
      setAgentState({ ...agentState, documents: nextDocs });
      updateB2bAgent(agentState.id, { documents: nextDocs });
    }
    onRefreshStore();
  };

  // Update external link on a document
  const handleUpdateDocUrl = (docId: string, url: string) => {
    const now = new Date().toISOString().slice(0, 10);
    if (mode === "SCHOOL") {
      const nextDocs = (schoolState.documents || []).map((d) =>
        d.id === docId
          ? {
              ...d,
              fileUrl: url,
              fileName: d.fileName || "External Document Link",
              status: url.trim() ? ("UPLOADED" as const) : d.status,
              uploadedAt: url.trim() ? d.uploadedAt || now : d.uploadedAt,
            }
          : d,
      );
      setSchoolState({ ...schoolState, documents: nextDocs });
      updatePartnerSchool(schoolState.id, { documents: nextDocs });
    } else {
      const nextDocs = (agentState.documents || []).map((d) =>
        d.id === docId
          ? {
              ...d,
              fileUrl: url,
              fileName: d.fileName || "External Document Link",
              status: url.trim() ? ("UPLOADED" as const) : d.status,
              uploadedAt: url.trim() ? d.uploadedAt || now : d.uploadedAt,
            }
          : d,
      );
      setAgentState({ ...agentState, documents: nextDocs });
      updateB2bAgent(agentState.id, { documents: nextDocs });
    }
    onRefreshStore();
  };

  // Add custom document to vault
  const handleAddCustomDoc = () => {
    if (!newDocTitle.trim()) return;
    const newItem: PartnerDocumentItem = {
      id: `custom-doc-${Date.now()}`,
      titleBn: newDocTitle.trim(),
      titleEn: newDocTitle.trim(),
      category: mode === "SCHOOL" ? "BROCHURE_PROSPECTUS" : "MOU_AGREEMENT",
      status: newDocUrl.trim() ? "UPLOADED" : "MISSING",
      fileUrl: newDocUrl.trim() || undefined,
      fileName: newDocUrl.trim() ? "Attached Link" : undefined,
      uploadedAt: newDocUrl.trim()
        ? new Date().toISOString().slice(0, 10)
        : undefined,
    };

    if (mode === "SCHOOL") {
      const nextDocs = [...(schoolState.documents || []), newItem];
      setSchoolState({ ...schoolState, documents: nextDocs });
      updatePartnerSchool(schoolState.id, { documents: nextDocs });
    } else {
      const nextDocs = [...(agentState.documents || []), newItem];
      setAgentState({ ...agentState, documents: nextDocs });
      updateB2bAgent(agentState.id, { documents: nextDocs });
    }
    setNewDocTitle("");
    setNewDocUrl("");
    onRefreshStore();
    onShowToast(
      tr("নতুন ডকুমেন্ট স্লট যুক্ত হয়েছে", "New document slot added"),
    );
  };

  // Remove custom document
  const handleDeleteDoc = (docId: string) => {
    if (mode === "SCHOOL") {
      const nextDocs = (schoolState.documents || []).filter(
        (d) => d.id !== docId,
      );
      setSchoolState({ ...schoolState, documents: nextDocs });
      updatePartnerSchool(schoolState.id, { documents: nextDocs });
    } else {
      const nextDocs = (agentState.documents || []).filter(
        (d) => d.id !== docId,
      );
      setAgentState({ ...agentState, documents: nextDocs });
      updateB2bAgent(agentState.id, { documents: nextDocs });
    }
    onRefreshStore();
  };

  // Toggle intake month on school
  const toggleIntakeMonth = (m: IntakeMonth) => {
    const current = schoolState.intakeMonths || [];
    const exists = current.includes(m);
    const nextIntakes = exists
      ? current.filter((x) => x !== m)
      : [...current, m];
    setSchoolState({ ...schoolState, intakeMonths: nextIntakes });
  };

  // 1-Click Assign Student
  const handleAssignStudent = () => {
    if (!selectedStudentIdToAssign) return;
    if (mode === "SCHOOL") {
      const updated = assignStudentToPartnerSchool(
        schoolState.id,
        selectedStudentIdToAssign,
      );
      if (updated) {
        setSchoolState({
          ...schoolState,
          activeStudentsCount: updated.activeStudentsCount,
        });
      }
    } else {
      const updated = assignStudentToB2bAgent(
        agentState.id,
        selectedStudentIdToAssign,
      );
      if (updated) {
        setAgentState({
          ...agentState,
          referredStudentsCount: updated.referredStudentsCount,
        });
      }
    }
    setSelectedStudentIdToAssign("");
    onRefreshStore();
    onShowToast(
      tr("শিক্ষার্থীকে সফলভাবে এই প্রোফাইলের সাথে যুক্ত করা হয়েছে", "Student linked to partner profile"),
    );
  };

  // Issue B2B Portal Login
  const handleIssueB2bPortalLogin = () => {
    if (!portalEmail.trim() || !portalPassword.trim()) return;
    const created = upsertSystemAccount({
      name: `${agentState.organizationName} (${agentState.contactPerson})`,
      email: portalEmail.trim(),
      password: portalPassword.trim(),
      role: "B2B_AGENT",
      branch: "ALL",
      phone: agentState.phone,
      status: "ACTIVE",
      allowedTabs: ["overview", "b2b", "visa"],
    });
    const nextAgent = { ...agentState, email: portalEmail.trim(), portalAccountId: created.id };
    setAgentState(nextAgent);
    updateB2bAgent(agentState.id, {
      email: portalEmail.trim(),
      portalAccountId: created.id,
    });
    onRefreshStore();
    onShowToast(tr(`${agentState.organizationName}-এর বিটুবি পোর্টাল লগইন একাউন্ট তৈরি হয়েছে`, `${agentState.organizationName} B2B Portal Login issued`, `${agentState.organizationName}のB2Bポータルログインを発行しました`));
  };

  const currentDocs =
    mode === "SCHOOL"
      ? schoolState.documents || []
      : agentState.documents || [];
  const verifiedDocsCount = currentDocs.filter(
    (d) => d.status === "VERIFIED" || d.status === "UPLOADED",
  ).length;

  const titleName =
    mode === "SCHOOL" ? schoolState.name : agentState.organizationName;
  const currentLogo =
    mode === "SCHOOL" ? schoolState.logoUrl : agentState.logoUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-3 sm:p-5 backdrop-blur-xs overflow-y-auto">
      <div className="relative my-auto flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        {/* =====================================================================
            TOP STICKY COMMAND HEADER WITH LOGO, METADATA & QUICK ACTIONS
            ===================================================================== */}
        <div className="border-b border-slate-200 bg-slate-50/80 px-5 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Left: Logo Avatar + Institution/Agency Identity */}
            <div className="flex items-start sm:items-center gap-4">
              <div className="relative group shrink-0">
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs">
                  {isUploadingLogo ? (
                    <div className="flex flex-col items-center justify-center gap-1 text-[10px] text-slate-500 font-medium">
                      <Loader2 className="h-5 w-5 animate-spin text-[#b91c1c]" />
                      <span>Saving...</span>
                    </div>
                  ) : currentLogo ? (
                    <img
                      src={currentLogo}
                      alt={titleName}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-contain p-1"
                    />
                  ) : mode === "SCHOOL" ? (
                    <Building2 className="h-7 w-7 text-[#b91c1c]" />
                  ) : (
                    <Briefcase className="h-7 w-7 text-emerald-700" />
                  )}
                </div>
                <label
                  title={
                    tr("লোগো পরিবর্তন বা আপলোড করুন", "Upload Logo")
                  }
                  className={`absolute -bottom-1.5 -right-1.5 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-slate-900 text-white shadow-md hover:bg-[#b91c1c] transition ${
                    isUploadingLogo ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  {isUploadingLogo ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Upload className="h-3 w-3" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isUploadingLogo}
                    onChange={handleLogoFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                  <span className="font-semibold text-[#b91c1c]">
                    {mode === "SCHOOL"
                      ? INSTITUTION_TYPE_LABELS[
                          schoolState.institutionType || "LANGUAGE_SCHOOL"
                        ][language === "ja" ? "ja" : language === "en" ? "en" : "bn"]
                      : agentState.agentType === "INSTITUTIONAL"
                        ? tr("ইনস্টিটিউশনাল বিটুবি পার্টনার", "Institutional B2B Partner", "提携機関パートナー")
                        : agentState.agentType === "CAMPUS_AMBASSADOR"
                          ? tr("ক্যাম্পাস অ্যাম্বাসেডর", "Campus Ambassador", "キャンパスアンバサダー")
                          : tr("লোকাল বিটুবি সাব-এজেন্ট", "Local B2B Sub-Agent", "地域サブエージェント")}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                    <MapPin className="h-3 w-3 text-slate-400" />
                    {mode === "SCHOOL" ? schoolState.location : agentState.city}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-medium text-emerald-700">
                    {verifiedDocsCount}/{currentDocs.length}{" "}
                    {tr("ডকুমেন্ট যুক্ত", "Docs Ready", "登録書類")}
                  </span>
                </div>

                <h2 className="mt-0.5 text-lg sm:text-xl font-bold text-slate-900 truncate">
                  {titleName}
                </h2>

                {mode === "SCHOOL" && schoolState.japaneseName && (
                  <p className="text-xs font-medium text-slate-500">
                    {schoolState.japaneseName}
                  </p>
                )}
                {mode === "AGENT" && (
                  <p className="text-xs text-slate-500">
                    {agentState.contactPerson} ·{" "}
                    <span className="font-mono">{agentState.phone}</span>
                    {agentState.tradeLicenseNo
                      ? ` · লাইসেন্স: ${agentState.tradeLicenseNo}`
                      : ""}
                  </p>
                )}
              </div>
            </div>

            {/* Right: Actions (WhatsApp, Print Dossier, Save, Close) */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {mode === "AGENT" && agentState.phone && (
                <a
                  href={`https://wa.me/${
                    agentState.phone.startsWith("+88")
                      ? agentState.phone.replace("+", "")
                      : `88${agentState.phone.replace(/\D/g, "")}`
                  }?text=${encodeURIComponent(
                    `হ্যালো ${agentState.contactPerson} (${agentState.organizationName}), KNLTC কমান্ড সেন্টার থেকে যোগাযোগ করছি। আপনার রেফারকৃত শিক্ষার্থী ও কমিশন লেজার আপডেট সম্পর্কে কথা বলতে চাই।`,
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition whitespace-nowrap"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>WhatsApp</span>
                </a>
              )}

              {mode === "SCHOOL" && schoolState.email && (
                <a
                  href={`mailto:${schoolState.email}?subject=${encodeURIComponent(
                    `KNLTC Bangladesh - Admission & COE Inquiry (${schoolState.name})`,
                  )}`}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition whitespace-nowrap"
                >
                  <Mail className="h-3.5 w-3.5" />
                  <span>{tr("ইমেইল পাঠান", "Send Email")}</span>
                </a>
              )}

              <button
                type="button"
                onClick={() => setIsPrintView(!isPrintView)}
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition whitespace-nowrap ${
                  isPrintView
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Printer className="h-3.5 w-3.5" />
                <span>
                  {isPrintView
                    ? tr("এডিট মোডে ফিরুন", "Back to Edit")
                    : tr("প্রিন্ট প্রোফাইল শিট", "Print Dossier")}
                </span>
              </button>

              <button
                type="button"
                onClick={handleSaveProfile}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#b91c1c] px-4 py-2 text-xs font-semibold text-white hover:bg-red-800 transition whitespace-nowrap"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>{tr("সেভ করুন", "Save Profile")}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-200 bg-white p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* 4-Tab Navigation Bar */}
          {!isPrintView && (
            <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pt-1">
              {[
                {
                  id: "overview" as ModalTab,
                  icon: mode === "SCHOOL" ? Building2 : Briefcase,
                  labelBn:
                    mode === "SCHOOL"
                      ? "১. একাডেমিক তথ্য, লোগো ও ফি"
                      : "১. এজেন্সি পরিচিতি, লাইসেন্স ও ব্যাংক",
                  labelEn:
                    mode === "SCHOOL"
                      ? "1. Overview, Fees & Criteria"
                      : "1. Agency Bio & Bank Info",
                },
                {
                  id: "docs" as ModalTab,
                  icon: FileText,
                  labelBn:
                    mode === "SCHOOL"
                      ? `২. ব্রশিউর, প্রসপেক্টাস ও MOU ভল্ট (${verifiedDocsCount}/${currentDocs.length})`
                      : `২. ট্রেড লাইসেন্স, NID ও MOU ভল্ট (${verifiedDocsCount}/${currentDocs.length})`,
                  labelEn: `2. Brochure, License & MOU Vault (${verifiedDocsCount}/${currentDocs.length})`,
                },
                {
                  id: "students" as ModalTab,
                  icon: Users,
                  labelBn: `৩. যুক্ত শিক্ষার্থী ও ভিসা প্রগ্রেস (${linkedStudents.length})`,
                  labelEn: `3. Linked Students & Quota (${linkedStudents.length})`,
                },
                {
                  id: "ledger" as ModalTab,
                  icon: Coins,
                  labelBn:
                    mode === "SCHOOL"
                      ? "৪. কমিশন ক্লেইম (JPY⇄BDT) ও লেজার"
                      : "৪. কমিশন পে-আউট ও পোর্টাল লগইন",
                  labelEn:
                    mode === "SCHOOL"
                      ? "4. Commission Ledger (JPY⇄BDT)"
                      : "4. Commission Payout & Portal Login",
                },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition whitespace-nowrap shrink-0 ${
                      active
                        ? "bg-slate-900 text-white shadow-2xs"
                        : "bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{language === "ja" ? (tab as any).labelJa || tab.labelEn : language === "bn" ? tab.labelBn : tab.labelEn}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* =====================================================================
            MODAL BODY CONTENT
            ===================================================================== */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          {/* -----------------------------------------------------------------
              PRINTABLE OFFICIAL PARTNER DOSSIER VIEW
              ----------------------------------------------------------------- */}
          {isPrintView ? (
            <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div className="flex items-center gap-4">
                  {currentLogo ? (
                    <img
                      src={currentLogo}
                      alt={titleName}
                      referrerPolicy="no-referrer"
                      className="h-16 w-16 rounded-xl border border-slate-200 object-contain p-1"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-slate-100 font-bold text-slate-700">
                      KNLTC
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-bold text-[#b91c1c]">
                      KNLTC CENTRAL COMMAND CENTER • OFFICIAL PARTNER DOSSIER
                    </p>
                    <h1 className="text-xl font-bold text-slate-900 mt-0.5">
                      {titleName}
                    </h1>
                    <p className="text-xs text-slate-500">
                      {mode === "SCHOOL"
                        ? `${schoolState.japaneseName || ""} · ${schoolState.location}, Japan`
                        : `${agentState.contactPerson} · ${agentState.city} · Phone: ${agentState.phone}`}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 print:hidden"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Print Now (A4)</span>
                </button>
              </div>

              {mode === "SCHOOL" ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div className="rounded-xl border border-slate-200 p-3">
                    <span className="text-slate-400 block">Institution Type</span>
                    <strong className="text-slate-900 mt-0.5 block">
                      {
                        INSTITUTION_TYPE_LABELS[
                          schoolState.institutionType || "LANGUAGE_SCHOOL"
                        ].bn
                      }
                    </strong>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-3">
                    <span className="text-slate-400 block">1st Year Tuition</span>
                    <strong className="text-slate-900 mt-0.5 block tabular-nums">
                      ¥{(schoolState.firstYearTuitionYen || 0).toLocaleString()} JPY
                    </strong>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-3">
                    <span className="text-slate-400 block">Agreed Commission</span>
                    <strong className="text-emerald-700 mt-0.5 block tabular-nums">
                      ¥{(schoolState.commissionPerStudentYen || 0).toLocaleString()} JPY
                    </strong>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-3">
                    <span className="text-slate-400 block">Seat Quota / Active</span>
                    <strong className="text-slate-900 mt-0.5 block tabular-nums">
                      {schoolState.activeStudentsCount} / {schoolState.intakeQuota || 20} Seats
                    </strong>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div className="rounded-xl border border-slate-200 p-3">
                    <span className="text-slate-400 block">Trade License & NID</span>
                    <strong className="text-slate-900 mt-0.5 block">
                      TL: {agentState.tradeLicenseNo || "N/A"} | NID:{" "}
                      {agentState.nidOrPassportNo || "N/A"}
                    </strong>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-3">
                    <span className="text-slate-400 block">Commission Rate</span>
                    <strong className="text-slate-900 mt-0.5 block tabular-nums">
                      ৳{(agentState.agreedCommissionBdt || 0).toLocaleString()} / Visa
                    </strong>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-3">
                    <span className="text-slate-400 block">Paid Commission</span>
                    <strong className="text-emerald-700 mt-0.5 block tabular-nums">
                      ৳{(agentState.paidCommissionBdt || 0).toLocaleString()} BDT
                    </strong>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-3">
                    <span className="text-slate-400 block">Pending Due</span>
                    <strong className="text-amber-700 mt-0.5 block tabular-nums">
                      ৳{(agentState.pendingCommissionBdt || 0).toLocaleString()} BDT
                    </strong>
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-xs font-bold text-slate-900 mb-2">
                  ভেরিফাইড ডকুমেন্ট ও ব্রশিউর চেকলিস্ট (Document & Brochure Vault)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {currentDocs.map((d) => (
                    <div
                      key={d.id}
                      className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2"
                    >
                      <span className="font-medium text-slate-800">{d.titleBn}</span>
                      <span className="font-bold text-slate-600">{d.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-900 mb-2">
                  যুক্ত শিক্ষার্থীদের তালিকা ({linkedStudents.length} জন)
                </h3>
                <table className="w-full text-left text-xs border border-slate-200">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="p-2">শিক্ষার্থীর নাম</th>
                      <th className="p-2">ফোন</th>
                      <th className="p-2">ভিসা ধাপ / স্ট্যাটাস</th>
                      <th className="p-2 text-right">জমা (BDT)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {linkedStudents.map((st) => (
                      <tr key={st.id}>
                        <td className="p-2 font-semibold">{st.name}</td>
                        <td className="p-2 font-mono">{st.phone}</td>
                        <td className="p-2">
                          {st.visaStage ? `Stage ${st.visaStage}` : "CRM Enrolled"}{" "}
                          {st.coEStatus ? `(${st.coEStatus})` : ""}
                        </td>
                        <td className="p-2 text-right tabular-nums">
                          ৳{st.paidBdt.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <>
              {/* ===============================================================
                  TAB 1: OVERVIEW, BRANDING, ACADEMIC FEES OR AGENCY BANK INFO
                  =============================================================== */}
              {activeTab === "overview" && mode === "SCHOOL" && (
                <div className="space-y-6">
                  {/* Branding & Basic Identity */}
                  <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
                    <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                      {tr("প্রতিষ্ঠানের পরিচিতি, লোগো ও ক্যাটাগরি (School / University Identity)", "Institution Identity, Logo & Category")}
                    </h3>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                      <div className="sm:col-span-2">
                        <label className="font-semibold text-slate-700">
                          {tr("স্কুল / ইউনিভার্সিটির নাম (ইংরেজি) *", "Institution Name (English) *")}
                        </label>
                        <input
                          type="text"
                          value={schoolState.name}
                          onChange={(e) =>
                            setSchoolState({ ...schoolState, name: e.target.value })
                          }
                          placeholder="e.g. Tokyo International University / HLA Japanese Academy"
                          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-semibold text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-slate-700">
                          {tr("প্রতিষ্ঠানের ধরন (Category)", "Institution Category")}
                        </label>
                        <select
                          value={schoolState.institutionType || "LANGUAGE_SCHOOL"}
                          onChange={(e) =>
                            setSchoolState({
                              ...schoolState,
                              institutionType: e.target
                                .value as PartnerInstitutionType,
                            })
                          }
                          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-semibold text-slate-800"
                        >
                          <option value="LANGUAGE_SCHOOL">
                            জাপানি ভাষা ইনস্টিটিউট (Language School)
                          </option>
                          <option value="UNIVERSITY">
                            জাপানি ইউনিভার্সিটি (University)
                          </option>
                          <option value="VOCATIONAL_COLLEGE">
                            ভোকেশনাল কলেজ (Senmon Gakko)
                          </option>
                          <option value="SSW_EMPLOYER">
                            SSW নিয়োগকারী কোম্পানি (Employer)
                          </option>
                        </select>
                      </div>

                      <div>
                        <label className="font-semibold text-slate-700">
                          {tr("জাপানি নাম (日本語名)", "Japanese Name")}
                        </label>
                        <input
                          type="text"
                          value={schoolState.japaneseName}
                          onChange={(e) =>
                            setSchoolState({
                              ...schoolState,
                              japaneseName: e.target.value,
                            })
                          }
                          placeholder="東京国際日本語学院"
                          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-medium"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-slate-700">
                          {tr("জাপানে শহর / প্রিফেকচার", "City / Prefecture in Japan")}
                        </label>
                        <input
                          type="text"
                          value={schoolState.location}
                          onChange={(e) =>
                            setSchoolState({
                              ...schoolState,
                              location: e.target.value,
                            })
                          }
                          placeholder="Tokyo / Osaka / Fukuoka / Hiroshima"
                          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-medium"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-slate-700">
                          {tr("প্রতিষ্ঠানের লোগো URL (অথবা বাম পাশের আইকনে আপলোড)", "Logo URL (or click avatar to upload)")}
                        </label>
                        <input
                          type="text"
                          value={schoolState.logoUrl || ""}
                          onChange={(e) =>
                            setSchoolState({
                              ...schoolState,
                              logoUrl: e.target.value,
                            })
                          }
                          placeholder="https://..."
                          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-mono"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-slate-700">
                          {tr("দায়িত্বশীল প্রতিনিধি / প্রিন্সিপাল", "Contact Person / Principal")}
                        </label>
                        <input
                          type="text"
                          value={schoolState.contactPerson}
                          onChange={(e) =>
                            setSchoolState({
                              ...schoolState,
                              contactPerson: e.target.value,
                            })
                          }
                          placeholder="Tanaka Sensei / International Desk"
                          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-medium"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-slate-700">
                          {tr("অফিসিয়াল ইমেইল", "Official Email")}
                        </label>
                        <input
                          type="email"
                          value={schoolState.email}
                          onChange={(e) =>
                            setSchoolState({
                              ...schoolState,
                              email: e.target.value,
                            })
                          }
                          placeholder="admission@school.jp"
                          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-mono"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-slate-700">
                          {tr("ওয়েবসাইট লিংক", "Official Website")}
                        </label>
                        <input
                          type="text"
                          value={schoolState.websiteUrl || ""}
                          onChange={(e) =>
                            setSchoolState({
                              ...schoolState,
                              websiteUrl: e.target.value,
                            })
                          }
                          placeholder="https://www.school.ac.jp"
                          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Tuition, Hostel Fee & Commission Structure (JPY & BDT) */}
                  <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
                      <h3 className="text-sm font-bold text-slate-900">
                        {tr("টিউশন ফি, হোস্টেল চার্জ ও চুক্তিবদ্ধ কমিশন কাঠামো (JPY ¥ ⇄ BDT ৳)", "Tuition, Dormitory & Commission Breakdown (JPY ⇄ BDT)")}
                      </h3>
                      <span className="text-xs font-semibold text-emerald-700 tabular-nums">
                        1 JPY ≈ ৳{jpyRate} BDT
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                      <div>
                        <label className="font-semibold text-slate-700">
                          {tr("১ম বছরের মোট টিউশন ফি (Yen)", "1st Year Tuition Fee (Yen)")}
                        </label>
                        <input
                          type="number"
                          value={schoolState.firstYearTuitionYen || 0}
                          onChange={(e) =>
                            setSchoolState({
                              ...schoolState,
                              firstYearTuitionYen: Number(e.target.value),
                            })
                          }
                          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-bold text-slate-900 tabular-nums"
                        />
                        <p className="mt-1 text-[11px] text-slate-500 tabular-nums">
                          ≈ ৳
                          {Math.round(
                            (schoolState.firstYearTuitionYen || 0) * jpyRate,
                          ).toLocaleString()}{" "}
                          BDT
                        </p>
                      </div>

                      <div>
                        <label className="font-semibold text-slate-700">
                          {tr("অ্যাপ্লিকেশন / সিলেকশন ফি (Yen)", "Application / Screening Fee (Yen)")}
                        </label>
                        <input
                          type="number"
                          value={schoolState.admissionFeeYen || 0}
                          onChange={(e) =>
                            setSchoolState({
                              ...schoolState,
                              admissionFeeYen: Number(e.target.value),
                            })
                          }
                          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-bold text-slate-900 tabular-nums"
                        />
                        <p className="mt-1 text-[11px] text-slate-500 tabular-nums">
                          ≈ ৳
                          {Math.round(
                            (schoolState.admissionFeeYen || 0) * jpyRate,
                          ).toLocaleString()}{" "}
                          BDT
                        </p>
                      </div>

                      <div>
                        <label className="font-semibold text-slate-700">
                          {tr("মাসিক ডরমেটরি / হোস্টেল ভাড়া (Yen)", "Monthly Dormitory Fee (Yen)")}
                        </label>
                        <input
                          type="number"
                          value={schoolState.hostelFeeMonthlyYen || 0}
                          onChange={(e) =>
                            setSchoolState({
                              ...schoolState,
                              hostelFeeMonthlyYen: Number(e.target.value),
                            })
                          }
                          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-bold text-slate-900 tabular-nums"
                        />
                        <p className="mt-1 text-[11px] text-slate-500 tabular-nums">
                          ≈ ৳
                          {Math.round(
                            (schoolState.hostelFeeMonthlyYen || 0) * jpyRate,
                          ).toLocaleString()}{" "}
                          BDT / {tr("মাস", "Month", "月")}
                        </p>
                      </div>

                      <div>
                        <label className="font-semibold text-emerald-800">
                          {tr("চুক্তিবদ্ধ কমিশন / স্টুডেন্ট (Yen)", "Agreed Commission / Student (Yen)")}
                        </label>
                        <input
                          type="number"
                          value={schoolState.commissionPerStudentYen || 0}
                          onChange={(e) =>
                            setSchoolState({
                              ...schoolState,
                              commissionPerStudentYen: Number(e.target.value),
                            })
                          }
                          className="mt-1 w-full rounded-xl border border-emerald-300 bg-emerald-50/40 px-3 py-2 font-bold text-emerald-900 tabular-nums"
                        />
                        <p className="mt-1 text-[11px] font-semibold text-emerald-700 tabular-nums">
                          ≈ ৳
                          {Math.round(
                            (schoolState.commissionPerStudentYen || 0) * jpyRate,
                          ).toLocaleString()}{" "}
                          BDT / {tr("স্টুডেন্ট", "Student", "生徒")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Intake Months, Quota & Eligibility Requirements */}
                  <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
                    <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                      {tr("ইনটেক সেশন, সিট কোটা ও ভর্তির যোগ্যতা (Intakes & Eligibility)", "Intake Sessions, Seat Quota & Eligibility Criteria")}
                    </h3>

                    <div className="mt-4 space-y-4 text-xs">
                      <div>
                        <label className="font-semibold text-slate-700 block mb-2">
                          {tr("ভর্তি সেশন (Intake Months — ক্লিক করে সিলেক্ট করুন)", "Available Intake Sessions")}
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {(
                            ["JANUARY", "APRIL", "JULY", "OCTOBER"] as IntakeMonth[]
                          ).map((m) => {
                            const selected = (
                              schoolState.intakeMonths || []
                            ).includes(m);
                            return (
                              <button
                                key={m}
                                type="button"
                                onClick={() => toggleIntakeMonth(m)}
                                className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                                  selected
                                    ? "bg-slate-900 text-white"
                                    : "border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                                }`}
                              >
                                {
                                  INTAKE_LABELS[m][
                                    language === "ja" ? "ja" : language === "en" ? "en" : "bn"
                                  ]
                                }
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
                        <div>
                          <label className="font-semibold text-slate-700">
                            {tr("সর্বনিম্ন GPA রিকোয়ারমেন্ট", "Minimum GPA Required")}
                          </label>
                          <input
                            type="text"
                            value={schoolState.minGpaRequired || ""}
                            onChange={(e) =>
                              setSchoolState({
                                ...schoolState,
                                minGpaRequired: e.target.value,
                              })
                            }
                            placeholder="SSC/HSC 3.00"
                            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-semibold"
                          />
                        </div>

                        <div>
                          <label className="font-semibold text-slate-700">
                            {tr("সর্বোচ্চ স্টাডি গ্যাপ (বছর)", "Max Study Gap (Years)")}
                          </label>
                          <input
                            type="number"
                            value={schoolState.maxStudyGapYears ?? 5}
                            onChange={(e) =>
                              setSchoolState({
                                ...schoolState,
                                maxStudyGapYears: Number(e.target.value),
                              })
                            }
                            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-semibold tabular-nums"
                          />
                        </div>

                        <div>
                          <label className="font-semibold text-slate-700">
                            {tr("ন্যূনতম জাপানি ভাষা দক্ষতা", "Min Language Requirement")}
                          </label>
                          <input
                            type="text"
                            value={schoolState.minLanguageLevel || ""}
                            onChange={(e) =>
                              setSchoolState({
                                ...schoolState,
                                minLanguageLevel: e.target.value,
                              })
                            }
                            placeholder="JLPT N5 / NAT 5Q"
                            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-semibold"
                          />
                        </div>

                        <div>
                          <label className="font-semibold text-slate-700">
                            {tr("KNLTC বরাদ্দকৃত সিট কোটা", "Allocated Seat Quota")}
                          </label>
                          <input
                            type="number"
                            value={schoolState.intakeQuota || 20}
                            onChange={(e) =>
                              setSchoolState({
                                ...schoolState,
                                intakeQuota: Number(e.target.value),
                              })
                            }
                            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-bold tabular-nums"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="font-semibold text-slate-700">
                          {tr("ইন্টারভিউ নির্দেশনা ও বিশেষ নোট (School Interview & Part-time Job Support Notes)", "Interview Guidelines & Notes")}
                        </label>
                        <textarea
                          rows={2}
                          value={schoolState.notes || ""}
                          onChange={(e) =>
                            setSchoolState({
                              ...schoolState,
                              notes: e.target.value,
                            })
                          }
                          placeholder={tr(
                            "জুম ইন্টারভিউ প্রশ্ন, ডরমেটরি সুবিধা ও পার্ট-টাইম কাজের সুযোগ সংক্রান্ত নোট...",
                            "Zoom interview notes, dorm features & part-time job notes...",
                            "Zoom面接対策、寮施設、アルバイト支援に関する特記事項...",
                          )}
                          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-medium"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ===============================================================
                  TAB 1: OVERVIEW FOR B2B AGENT (IDENTITY, LICENSE & BANK DETAILS)
                  =============================================================== */}
              {activeTab === "overview" && mode === "AGENT" && (
                <div className="space-y-6">
                  <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
                    <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                      {tr("বিটুবি এজেন্সি পরিচিতি, লোগো ও লাইসেন্স তথ্য (Agency Profile & Verification)", "B2B Agency Identity, Logo & Legal Verification")}
                    </h3>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                      <div className="sm:col-span-2">
                        <label className="font-semibold text-slate-700">
                          {tr("এজেন্সি / প্রতিষ্ঠানের নাম *", "Agency / Organization Name *")}
                        </label>
                        <input
                          type="text"
                          value={agentState.organizationName}
                          onChange={(e) =>
                            setAgentState({
                              ...agentState,
                              organizationName: e.target.value,
                            })
                          }
                          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-semibold text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-slate-700">
                          {tr("পার্টনারশিপ ক্যাটাগরি", "Agent Category")}
                        </label>
                        <select
                          value={agentState.agentType}
                          onChange={(e) =>
                            setAgentState({
                              ...agentState,
                              agentType: e.target.value as B2bAgent["agentType"],
                            })
                          }
                          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-semibold"
                        >
                          <option value="LOCAL_SUB_AGENT">
                            {tr("লোকাল বিটুবি সাব-এজেন্ট (Local Sub-Agent)", "Local Sub-Agent", "地域B2B代理店（Local Sub-Agent）")}
                          </option>
                          <option value="INSTITUTIONAL">
                            {tr("ইনস্টিটিউশনাল পার্টনার (Institutional)", "Institutional Partner", "提携機関パートナー（Institutional）")}
                          </option>
                          <option value="CAMPUS_AMBASSADOR">
                            {tr("ক্যাম্পাস অ্যাম্বাসেডর (Campus Ambassador)", "Campus Ambassador", "キャンパスアンバサダー（Campus Ambassador）")}
                          </option>
                        </select>
                      </div>

                      <div>
                        <label className="font-semibold text-slate-700">
                          {tr("স্বত্বাধিকারী / দায়িত্বশীল ব্যক্তি", "Proprietor / Contact Person")}
                        </label>
                        <input
                          type="text"
                          value={agentState.contactPerson}
                          onChange={(e) =>
                            setAgentState({
                              ...agentState,
                              contactPerson: e.target.value,
                            })
                          }
                          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-medium"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-slate-700">
                          {tr("ফোন / WhatsApp নম্বর", "Phone / WhatsApp")}
                        </label>
                        <input
                          type="text"
                          value={agentState.phone}
                          onChange={(e) =>
                            setAgentState({
                              ...agentState,
                              phone: e.target.value,
                            })
                          }
                          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-mono"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-slate-700">
                          {tr("শহর / জেলা", "City / District")}
                        </label>
                        <input
                          type="text"
                          value={agentState.city}
                          onChange={(e) =>
                            setAgentState({
                              ...agentState,
                              city: e.target.value,
                            })
                          }
                          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-medium"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-slate-700">
                          {tr("ট্রেড লাইসেন্স নম্বর (Trade License No.)", "Trade License Number")}
                        </label>
                        <input
                          type="text"
                          value={agentState.tradeLicenseNo || ""}
                          onChange={(e) =>
                            setAgentState({
                              ...agentState,
                              tradeLicenseNo: e.target.value,
                            })
                          }
                          placeholder="TRAD/DNCC/..."
                          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-mono"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-slate-700">
                          {tr("জাতীয় পরিচয়পত্র (NID) / পাসপোর্ট নং", "Proprietor NID / Passport No.")}
                        </label>
                        <input
                          type="text"
                          value={agentState.nidOrPassportNo || ""}
                          onChange={(e) =>
                            setAgentState({
                              ...agentState,
                              nidOrPassportNo: e.target.value,
                            })
                          }
                          placeholder="NID / Passport Number"
                          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-mono"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-slate-700">
                          {tr("এজেন্সি লোগো URL (অথবা উপরে বামে আপলোড)", "Agency Logo URL")}
                        </label>
                        <input
                          type="text"
                          value={agentState.logoUrl || ""}
                          onChange={(e) =>
                            setAgentState({
                              ...agentState,
                              logoUrl: e.target.value,
                            })
                          }
                          placeholder="https://..."
                          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-mono"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="font-semibold text-slate-700">
                          {tr("অফিসের পূর্ণ ঠিকানা", "Full Office Address")}
                        </label>
                        <input
                          type="text"
                          value={agentState.officeAddress || ""}
                          onChange={(e) =>
                            setAgentState({
                              ...agentState,
                              officeAddress: e.target.value,
                            })
                          }
                          placeholder={tr("বাড়ি/রোড, থানা, জেলা...", "House/Road, Area, District...", "番地・道路・地区...")}
                          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Commission & Settlement Bank / Mobile Wallet Details */}
                  <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
                    <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                      {tr("চুক্তিবদ্ধ কমিশন হার ও ব্যাংক / মোবাইল ওয়ালেট পেমেন্ট তথ্য", "Agreed Commission Rate & Bank / Wallet Settlement Info")}
                    </h3>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                      <div>
                        <label className="font-semibold text-emerald-800">
                          {tr("চুক্তিবদ্ধ কমিশন / ভিসা (BDT ৳)", "Agreed Commission / Visa (BDT)")}
                        </label>
                        <input
                          type="number"
                          value={agentState.agreedCommissionBdt}
                          onChange={(e) =>
                            setAgentState({
                              ...agentState,
                              agreedCommissionBdt: Number(e.target.value),
                            })
                          }
                          className="mt-1 w-full rounded-xl border border-emerald-300 bg-emerald-50/40 px-3 py-2 font-bold text-emerald-900 tabular-nums"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-slate-700">
                          {tr("পছন্দের পেমেন্ট মাধ্যম", "Preferred Payout Method")}
                        </label>
                        <select
                          value={
                            agentState.paymentDetails?.preferredMethod || "BANK"
                          }
                          onChange={(e) =>
                            setAgentState({
                              ...agentState,
                              paymentDetails: {
                                ...(agentState.paymentDetails || {
                                  preferredMethod: "BANK",
                                }),
                                preferredMethod: e.target.value as
                                  | "BANK"
                                  | "BKASH"
                                  | "NAGAD",
                              },
                            })
                          }
                          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-semibold"
                        >
                          <option value="BANK">{tr("ব্যাংক একাউন্ট ট্রান্সফার (Bank)", "Bank Account Transfer", "銀行振込（Bank Transfer）")}</option>
                          <option value="BKASH">{tr("বিকাশ (bKash Merchant/Personal)", "bKash Merchant/Personal", "bKashモバイル決済")}</option>
                          <option value="NAGAD">{tr("নগদ (Nagad)", "Nagad", "Nagadモバイル決済")}</option>
                        </select>
                      </div>

                      <div>
                        <label className="font-semibold text-slate-700">
                          {tr("বিকাশ / নগদ ওয়ালেট নম্বর", "bKash / Nagad Wallet No.")}
                        </label>
                        <input
                          type="text"
                          value={
                            agentState.paymentDetails?.mobileWalletNo || ""
                          }
                          onChange={(e) =>
                            setAgentState({
                              ...agentState,
                              paymentDetails: {
                                ...(agentState.paymentDetails || {
                                  preferredMethod: "BKASH",
                                }),
                                mobileWalletNo: e.target.value,
                              },
                            })
                          }
                          placeholder="017xxxxxxxx"
                          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-mono"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-slate-700">
                          {tr("ব্যাংকের নাম", "Bank Name")}
                        </label>
                        <input
                          type="text"
                          value={agentState.paymentDetails?.bankName || ""}
                          onChange={(e) =>
                            setAgentState({
                              ...agentState,
                              paymentDetails: {
                                ...(agentState.paymentDetails || {
                                  preferredMethod: "BANK",
                                }),
                                bankName: e.target.value,
                              },
                            })
                          }
                          placeholder="Islami Bank / Pubali Bank / City Bank"
                          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-medium"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-slate-700">
                          {tr("একাউন্ট হোল্ডার নাম", "Account Holder Name")}
                        </label>
                        <input
                          type="text"
                          value={agentState.paymentDetails?.accountName || ""}
                          onChange={(e) =>
                            setAgentState({
                              ...agentState,
                              paymentDetails: {
                                ...(agentState.paymentDetails || {
                                  preferredMethod: "BANK",
                                }),
                                accountName: e.target.value,
                              },
                            })
                          }
                          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-medium"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-slate-700">
                          {tr("ব্যাংক একাউন্ট নম্বর ও ব্রাঞ্চ", "Bank Account No. & Branch")}
                        </label>
                        <input
                          type="text"
                          value={agentState.paymentDetails?.accountNumber || ""}
                          onChange={(e) =>
                            setAgentState({
                              ...agentState,
                              paymentDetails: {
                                ...(agentState.paymentDetails || {
                                  preferredMethod: "BANK",
                                }),
                                accountNumber: e.target.value,
                              },
                            })
                          }
                          placeholder="A/C No & Branch"
                          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ===============================================================
                  TAB 2: BROCHURE, PROSPECTUS, TRADE LICENSE & MOU DOCUMENT VAULT
                  =============================================================== */}
              {activeTab === "docs" && (
                <div className="space-y-5">
                  <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">
                          {mode === "SCHOOL"
                            ? tr("স্কুল / ইউনিভার্সিটি ব্রশিউর, প্রসপেক্টাস, আবেদন ফরম ও MOU ভল্ট", "Institution Brochure, Prospectus, Application Form & MOU Vault")
                            : tr("বিটুবি এজেন্টের ট্রেড লাইসেন্স, NID, চুক্তিপত্র (MOU) ও অফিস ডকুমেন্ট ভল্ট", "B2B Agent Trade License, NID & Signed MOU Document Vault")}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {tr("সরাসরি আপনার কম্পিউটার থেকে PDF/ছবি আপলোড করুন অথবা Google Drive / ওয়েবসাইটের লিংক যুক্ত করুন।", "Upload PDF/image files directly from your device or attach an external link.")}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-emerald-700 tabular-nums">
                        {verifiedDocsCount} / {currentDocs.length}{" "}
                        {tr("ডকুমেন্ট সংযুক্ত", "Attached")}
                      </span>
                    </div>

                    {/* Document Cards List */}
                    <div className="mt-4 space-y-3">
                      {currentDocs.map((doc) => {
                        const isReady =
                          doc.status === "VERIFIED" || doc.status === "UPLOADED";
                        return (
                          <div
                            key={doc.id}
                            className={`rounded-xl border p-4 transition ${
                              doc.status === "VERIFIED"
                                ? "border-emerald-200 bg-emerald-50/30"
                                : doc.status === "UPLOADED"
                                  ? "border-amber-200 bg-amber-50/30"
                                  : "border-slate-200/80 bg-slate-50/50"
                            }`}
                          >
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <FileText
                                    className={`h-4 w-4 shrink-0 ${
                                      isReady
                                        ? "text-emerald-700"
                                        : "text-slate-400"
                                    }`}
                                  />
                                  <p className="text-xs sm:text-sm font-bold text-slate-900">
                                    {language === "ja" ? ((doc as any).titleJa || doc.titleEn) : language === "bn" ? doc.titleBn : doc.titleEn}
                                  </p>
                                </div>
                                {doc.fileName && (
                                  <p className="mt-1 text-[11px] text-emerald-700 font-medium pl-6">
                                    {tr("সংযুক্ত ফাইল:", "Attached File:", "添付ファイル:")} {doc.fileName}{" "}
                                    {doc.uploadedAt
                                      ? `(${doc.uploadedAt})`
                                      : ""}
                                  </p>
                                )}
                              </div>

                              {/* Controls: External URL Input + File Upload + Preview + Status Toggle */}
                              <div className="flex flex-wrap items-center gap-2">
                                <input
                                  type="text"
                                  value={
                                    doc.fileUrl && !doc.fileUrl.startsWith("data:")
                                      ? doc.fileUrl
                                      : ""
                                  }
                                  onChange={(e) =>
                                    handleUpdateDocUrl(doc.id, e.target.value)
                                  }
                                  placeholder={
                                    tr("Drive / PDF লিংক দিন...", "Paste PDF / Drive URL...")
                                  }
                                  className="w-44 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-mono"
                                />

                                <label className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition ${
                                  uploadingDocId === doc.id ? "opacity-50 pointer-events-none" : ""
                                }`}>
                                  {uploadingDocId === doc.id ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin text-[#b91c1c]" />
                                  ) : (
                                    <Upload className="h-3.5 w-3.5 text-[#b91c1c]" />
                                  )}
                                  <span>
                                    {uploadingDocId === doc.id
                                      ? tr("আপলোড হচ্ছে...", "Uploading...")
                                      : tr("ফাইল আপলোড", "Upload File")}
                                  </span>
                                  <input
                                    type="file"
                                    disabled={uploadingDocId === doc.id}
                                    accept="image/*,.pdf,.doc,.docx"
                                    onChange={(e) =>
                                      handleDocFileUpload(doc.id, e)
                                    }
                                    className="hidden"
                                  />
                                </label>

                                {doc.fileUrl && (
                                  <a
                                    href={doc.fileUrl}
                                    download={doc.fileName || "document"}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 transition"
                                  >
                                    <Download className="h-3.5 w-3.5" />
                                    <span>
                                      {tr("দেখুন / ডাউনলোড", "View / Download")}
                                    </span>
                                  </a>
                                )}

                                <button
                                  type="button"
                                  onClick={() => handleToggleDocStatus(doc.id)}
                                  className={`rounded-lg px-2.5 py-1.5 text-xs font-bold transition ${
                                    doc.status === "VERIFIED"
                                      ? "bg-emerald-700 text-white"
                                      : doc.status === "UPLOADED"
                                        ? "bg-amber-600 text-white"
                                        : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                                  }`}
                                >
                                  {doc.status === "VERIFIED"
                                    ? "✓ VERIFIED"
                                    : doc.status === "UPLOADED"
                                      ? "UPLOADED"
                                      : "MISSING"}
                                </button>

                                {doc.id.startsWith("custom-doc-") && (
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteDoc(doc.id)}
                                    className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-[#b91c1c]"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Add Custom Brochure / License / Document Slot */}
                    <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50/70 p-4">
                      <p className="text-xs font-bold text-slate-800">
                        {tr("+ নতুন ব্রশিউর, লাইসেন্স বা অতিরিক্ত ডকুমেন্ট স্লট যুক্ত করুন", "+ Add Custom Brochure, License or Document")}
                      </p>
                      <div className="mt-2.5 flex flex-col sm:flex-row gap-2.5">
                        <input
                          type="text"
                          value={newDocTitle}
                          onChange={(e) => setNewDocTitle(e.target.value)}
                          placeholder={
                            tr("ডকুমেন্টের নাম (যেমন: ২০২৭ স্পেশাল স্কলারশিপ ব্রশিউর / চেম্বার সনদ)", "Document Title (e.g. 2027 Scholarship Brochure)")
                          }
                          className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium"
                        />
                        <input
                          type="text"
                          value={newDocUrl}
                          onChange={(e) => setNewDocUrl(e.target.value)}
                          placeholder={
                            tr("ড্রাইভ বা পিডিএফ লিংক (ঐচ্ছিক)", "External URL (Optional)")
                          }
                          className="sm:w-64 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-mono"
                        />
                        <button
                          type="button"
                          onClick={handleAddCustomDoc}
                          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition shrink-0"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>
                            {tr("যুক্ত করুন", "Add Document")}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ===============================================================
                  TAB 3: LINKED STUDENTS, 1-CLICK ASSIGNMENT & VISA STAGE PROGRESS
                  =============================================================== */}
              {activeTab === "students" && (
                <div className="space-y-5">
                  {/* 1-Click Assign Student Bar */}
                  <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
                    <h3 className="text-sm font-bold text-slate-900">
                      {mode === "SCHOOL"
                        ? tr("এই স্কুল / ইউনিভার্সিটিতে নতুন শিক্ষার্থী অ্যাসাইন করুন (1-Click Student Assignment)", "Assign CRM / Visa Student to this Partner Institution")
                        : tr("এই বিটুবি এজেন্টের অধীনে রেফার্ড শিক্ষার্থী যুক্ত করুন (Link Referred Student)", "Link Student Referred by this B2B Agent")}
                    </h3>
                    <div className="mt-3 flex flex-col sm:flex-row gap-2.5">
                      <select
                        value={selectedStudentIdToAssign}
                        onChange={(e) =>
                          setSelectedStudentIdToAssign(e.target.value)
                        }
                        className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium"
                      >
                        <option value="">
                          {tr("-- তালিকা থেকে শিক্ষার্থী নির্বাচন করুন --", "-- Select a student from CRM / Visa Pipeline --")}
                        </option>
                        {allLeads.map((l) => (
                          <option key={l.id} value={l.id}>
                            {l.name} ({l.phone}) — {l.interest} [{l.status}]
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={handleAssignStudent}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#b91c1c] px-4 py-2 text-xs font-semibold text-white hover:bg-red-800 transition shrink-0"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>
                          {tr("+ প্রোফাইলে শিক্ষার্থী যুক্ত করুন", "+ Assign Student")}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Linked Students Table */}
                  <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-900">
                        {mode === "SCHOOL"
                          ? tr(`${schoolState.name}-এ যুক্ত শিক্ষার্থীদের তালিকা (${linkedStudents.length} জন)`, `Enrolled / Assigned Students (${linkedStudents.length})`)
                          : tr(`${agentState.organizationName} কর্তৃক রেফার্ড শিক্ষার্থী তালিকা (${linkedStudents.length} জন)`, `Referred Students List (${linkedStudents.length})`)}
                      </h3>
                      {mode === "SCHOOL" && (
                        <span className="text-xs font-semibold text-slate-600 tabular-nums">
                          কোটা: {linkedStudents.length} /{" "}
                          {schoolState.intakeQuota || 20} সিট
                        </span>
                      )}
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50/70 border-b border-slate-100 font-semibold text-slate-500">
                          <tr>
                            <th className="px-4 py-3">{tr("শিক্ষার্থীর নাম ও ফোন", "Student Name & Phone", "受講生氏名・電話")}</th>
                            <th className="px-4 py-3">{tr("শহর ও প্রোগ্রাম", "City & Program", "居住地・プログラム")}</th>
                            <th className="px-4 py-3">{tr("ভিসা পাইপলাইন ধাপ", "Visa Pipeline Stage", "ビザ進捗段階")}</th>
                            <th className="px-4 py-3">{tr("COE স্ট্যাটাস", "COE Status", "COE交付状況")}</th>
                            <th className="px-4 py-3 text-right">
                              {tr("জমা বনাম বকেয়া (BDT)", "Paid vs Due (BDT)", "納入済 / 未納残額 (BDT)")}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {linkedStudents.map((st) => (
                            <tr
                              key={st.id}
                              className="hover:bg-slate-50/60 transition"
                            >
                              <td className="px-4 py-3">
                                <p className="font-bold text-slate-900">
                                  {st.name}
                                </p>
                                <p className="font-mono text-[11px] text-slate-400">
                                  {st.phone}
                                </p>
                              </td>
                              <td className="px-4 py-3">
                                <span className="font-medium text-slate-700 block">
                                  {st.program}
                                </span>
                                <span className="text-[11px] text-slate-400">
                                  {st.city}
                                </span>
                              </td>
                              <td className="px-4 py-3 font-semibold text-slate-800">
                                {st.visaStage
                                  ? `${tr("ধাপ", "Stage", "段階")} ${st.visaStage} / 10`
                                  : tr("কাউন্সেলিং", "CRM Counseling", "カウンセリング中")}
                              </td>
                              <td className="px-4 py-3">
                                <span
                                  className={`font-bold ${
                                    st.coEStatus === "APPROVED"
                                      ? "text-emerald-700"
                                      : "text-slate-500"
                                  }`}
                                >
                                  {st.coEStatus || "IN_PREPARATION"}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right tabular-nums">
                                <span className="font-semibold text-emerald-700 block">
                                  {tr("জমা", "Paid", "納入済")}: ৳{st.paidBdt.toLocaleString()}
                                </span>
                                <span className="text-[11px] text-amber-700 block">
                                  {tr("বকেয়া", "Due", "未納")}: ৳{st.dueBdt.toLocaleString()}
                                </span>
                              </td>
                            </tr>
                          ))}
                          {linkedStudents.length === 0 && (
                            <tr>
                              <td colSpan={5} className="py-10 text-center">
                                <div className="flex flex-col items-center justify-center text-center">
                                  <Users className="h-6 w-6 text-slate-300 mb-1.5" />
                                  <p className="text-xs font-semibold text-slate-600">
                                    {tr("এখনো কোনো শিক্ষার্থী এই প্রোফাইলে যুক্ত করা হয়নি", "No students linked to this profile yet")}
                                  </p>
                                  <p className="text-[11px] text-slate-400 mt-0.5">
                                    {tr("উপরের ড্রপডাউন থেকে যেকোনো শিক্ষার্থীকে ১-ক্লিকে যুক্ত করুন।", "Use the dropdown above to assign a student in 1 click.")}
                                  </p>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ===============================================================
                  TAB 4: COMMISSION LEDGER, 1-CLICK SETTLEMENT & B2B PORTAL LOGIN
                  =============================================================== */}
              {activeTab === "ledger" && (
                <div className="space-y-6">
                  {mode === "SCHOOL" ? (
                    <>
                      {/* School Commission KPI Strip */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
                          <span className="text-xs text-slate-500">
                            {tr("চুক্তিবদ্ধ কমিশন রেট (প্রতি স্টুডেন্ট)", "Agreed Commission Rate")}
                          </span>
                          <p className="mt-1 text-xl font-bold text-slate-900 tabular-nums">
                            ¥
                            {(
                              schoolState.commissionPerStudentYen || 0
                            ).toLocaleString()}{" "}
                            JPY
                          </p>
                          <p className="text-[11px] text-emerald-700 font-semibold tabular-nums">
                            ≈ ৳
                            {Math.round(
                              (schoolState.commissionPerStudentYen || 0) *
                                jpyRate,
                            ).toLocaleString()}{" "}
                            BDT
                          </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
                          <span className="text-xs text-slate-500">
                            {tr("প্রত্যাশিত মোট কমিশন (চলমান স্টুডেন্ট অনুযায়ী)", "Projected Total Commission")}
                          </span>
                          <p className="mt-1 text-xl font-bold text-slate-900 tabular-nums">
                            ¥
                            {(
                              (schoolState.activeStudentsCount || 0) *
                              (schoolState.commissionPerStudentYen || 0)
                            ).toLocaleString()}{" "}
                            JPY
                          </p>
                          <p className="text-[11px] text-slate-500 tabular-nums">
                            {schoolState.activeStudentsCount} {tr("জন স্টুডেন্ট", "Students", "名")}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4">
                          <span className="text-xs font-semibold text-emerald-800">
                            {tr("মোট প্রাপ্ত কমিশন (Received)", "Total Commission Received")}
                          </span>
                          <p className="mt-1 text-xl font-bold text-emerald-700 tabular-nums">
                            ¥
                            {(
                              schoolState.totalCommissionReceivedYen || 0
                            ).toLocaleString()}{" "}
                            JPY
                          </p>
                          <p className="text-[11px] text-emerald-700 font-semibold tabular-nums">
                            ≈ ৳
                            {Math.round(
                              (schoolState.totalCommissionReceivedYen || 0) *
                                jpyRate,
                            ).toLocaleString()}{" "}
                            BDT
                          </p>
                        </div>
                      </div>

                      {/* 1-Click School Commission Claim Box */}
                      <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
                        <h3 className="text-sm font-bold text-slate-900">
                          {tr("জাপানি স্কুল থেকে প্রাপ্ত কমিশন ফাইন্যান্স লেজারে যুক্ত করুন (Claim JPY ➔ BDT)", "Claim School Commission into Finance Ledger")}
                        </h3>
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 items-end text-xs">
                          <div>
                            <label className="font-semibold text-slate-700">
                              {tr("শিক্ষার্থী সংখ্যা (Students)", "Student Count")}
                            </label>
                            <input
                              type="number"
                              min={1}
                              value={claimStudentCount}
                              onChange={(e) =>
                                setClaimStudentCount(
                                  Math.max(1, Number(e.target.value)),
                                )
                              }
                              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-bold tabular-nums"
                            />
                          </div>
                          <div>
                            <label className="font-semibold text-slate-700">
                              {tr("এক্সচেঞ্জ রেট (1 JPY = ? BDT)", "Exchange Rate (BDT per JPY)")}
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              value={jpyRate}
                              onChange={(e) =>
                                setJpyRate(Number(e.target.value) || 0.8)
                              }
                              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-bold tabular-nums"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              if (
                                (schoolState.commissionPerStudentYen || 0) <= 0
                              ) {
                                onShowToast(
                                  tr("প্রথমে Tab 1-এ স্কুলের কমিশন রেট (Yen) নির্ধারণ করুন", "Please set the school commission rate (Yen) in Tab 1 first"),
                                );
                                return;
                              }
                              updatePartnerSchool(schoolState.id, schoolState);
                              const tx = claimPartnerSchoolCommission(
                                schoolState.id,
                                claimStudentCount,
                                jpyRate,
                              );
                              if (tx) {
                                const addYen =
                                  (schoolState.commissionPerStudentYen || 0) *
                                  claimStudentCount;
                                setSchoolState({
                                  ...schoolState,
                                  totalCommissionReceivedYen:
                                    (schoolState.totalCommissionReceivedYen ||
                                      0) + addYen,
                                });
                                onRefreshStore();
                                onShowToast(
                                  tr(`¥${addYen.toLocaleString()} (৳${tx.amountBdt.toLocaleString()}) কমিশন ফাইন্যান্স লেজারে জমা হয়েছে`, `Commission claimed & recorded in Finance Ledger`),
                                );
                              }
                            }}
                            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-semibold text-white hover:bg-emerald-800 transition"
                          >
                            <Coins className="h-4 w-4" />
                            <span>
                              {tr(
                                `+ কমিশন ক্লেইম করুন (৳${Math.round(
                                  (schoolState.commissionPerStudentYen || 0) *
                                    claimStudentCount *
                                    jpyRate,
                                ).toLocaleString()})`,
                                `+ Claim Commission (৳${Math.round(
                                  (schoolState.commissionPerStudentYen || 0) *
                                    claimStudentCount *
                                    jpyRate,
                                ).toLocaleString()})`,
                                `+ 手数料を計上（৳${Math.round(
                                  (schoolState.commissionPerStudentYen || 0) *
                                    claimStudentCount *
                                    jpyRate,
                                ).toLocaleString()}）`,
                              )}
                            </span>
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* B2B Agent Commission Summary & 1-Click Payout */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
                          <span className="text-xs text-slate-500">
                            {tr("চুক্তিবদ্ধ কমিশন (প্রতি সফল ভিসা)", "Agreed Commission Rate")}
                          </span>
                          <p className="mt-1 text-xl font-bold text-slate-900 tabular-nums">
                            ৳
                            {(
                              agentState.agreedCommissionBdt || 0
                            ).toLocaleString()}{" "}
                            BDT
                          </p>
                        </div>

                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4">
                          <span className="text-xs font-semibold text-emerald-800">
                            {tr("পরিশোধিত মোট কমিশন (Paid)", "Total Paid Commission")}
                          </span>
                          <p className="mt-1 text-xl font-bold text-emerald-700 tabular-nums">
                            ৳
                            {(
                              agentState.paidCommissionBdt || 0
                            ).toLocaleString()}{" "}
                            BDT
                          </p>
                        </div>

                        <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-4">
                          <span className="text-xs font-semibold text-amber-800">
                            {tr("বকেয়া প্রদেয় কমিশন (Pending Due)", "Pending Commission Due")}
                          </span>
                          <p className="mt-1 text-xl font-bold text-amber-700 tabular-nums">
                            ৳
                            {(
                              agentState.pendingCommissionBdt || 0
                            ).toLocaleString()}{" "}
                            BDT
                          </p>
                        </div>
                      </div>

                      {/* 1-Click Payout Settlement Box */}
                      <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
                        <h3 className="text-sm font-bold text-slate-900">
                          {tr("বিটুবি এজেন্টের কমিশন পরিশোধ ও ফাইন্যান্স ভাউচার ইস্যু (1-Click Commission Payout)", "Disburse B2B Agent Commission & Record Expense")}
                        </h3>
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 items-end text-xs">
                          <div>
                            <label className="font-semibold text-slate-700">
                              {tr("পরিশোধের পরিমাণ (BDT ৳)", "Payout Amount (BDT)")}
                            </label>
                            <input
                              type="number"
                              value={agentPayoutAmount}
                              onChange={(e) =>
                                setAgentPayoutAmount(Number(e.target.value))
                              }
                              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-bold tabular-nums"
                            />
                          </div>

                          <div>
                            <label className="font-semibold text-slate-700">
                              {tr("পেমেন্ট মাধ্যম", "Payment Method")}
                            </label>
                            <select
                              value={agentPayoutMethod}
                              onChange={(e) =>
                                setAgentPayoutMethod(e.target.value as any)
                              }
                              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-semibold"
                            >
                              <option value="BANK_TRANSFER">
                                {tr("ব্যাংক ট্রান্সফার (Bank Transfer)", "Bank Transfer", "銀行振込（Bank Transfer）")}
                              </option>
                              <option value="BKASH">{tr("বিকাশ (bKash)", "bKash", "bKash")}</option>
                              <option value="NAGAD">{tr("নগদ (Nagad)", "Nagad", "Nagad")}</option>
                              <option value="CASH_OFFICE">
                                {tr("অফিস ক্যাশ (Office Cash)", "Office Cash", "現金窓口精算（Office Cash）")}
                              </option>
                            </select>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              if (agentPayoutAmount <= 0) return;
                              updateB2bAgent(agentState.id, agentState);
                              const tx = settleB2bAgentCommission(
                                agentState.id,
                                agentPayoutAmount,
                                agentPayoutMethod,
                              );
                              if (tx) {
                                setAgentState({
                                  ...agentState,
                                  paidCommissionBdt:
                                    (agentState.paidCommissionBdt || 0) +
                                    agentPayoutAmount,
                                  pendingCommissionBdt: Math.max(
                                    0,
                                    (agentState.pendingCommissionBdt || 0) -
                                      agentPayoutAmount,
                                  ),
                                });
                                onRefreshStore();
                                onShowToast(
                                  tr(`৳${agentPayoutAmount.toLocaleString()} বিটুবি কমিশন পরিশোধ ও ফাইন্যান্স লেজারে রেকর্ড হয়েছে`, `B2B commission disbursed & recorded`),
                                );
                              }
                            }}
                            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-semibold text-white hover:bg-emerald-800 transition"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            <span>
                              {tr("কমিশন পরিশোধ রেকর্ড করুন", "Disburse Commission")}
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* Dedicated B2B Portal Login Credentials Generator */}
                      <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-5">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200/70 pb-3">
                          <div className="flex items-center gap-2">
                            <KeyRound className="h-4 w-4 text-[#b91c1c]" />
                            <h3 className="text-sm font-bold text-slate-900">
                              {tr("ডেডিকেটেড বিটুবি পার্টনার পোর্টাল লগইন একাউন্ট (B2B Portal Access)", "Dedicated B2B Partner Portal Login Credentials")}
                            </h3>
                          </div>
                          {existingPortalAccount && (
                            <span className="text-xs font-bold text-emerald-700">
                              ✓ পোর্টাল লগইন সক্রিয় ({existingPortalAccount.email})
                            </span>
                          )}
                        </div>

                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 items-end text-xs">
                          <div>
                            <label className="font-semibold text-slate-700">
                              {tr("লগইন ইমেইল / ইউজারনেম", "Login Email")}
                            </label>
                            <input
                              type="email"
                              value={portalEmail}
                              onChange={(e) => setPortalEmail(e.target.value)}
                              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-mono"
                            />
                          </div>

                          <div>
                            <label className="font-semibold text-slate-700">
                              {tr("পোর্টাল পাসওয়ার্ড", "Portal Password")}
                            </label>
                            <input
                              type="text"
                              value={portalPassword}
                              onChange={(e) =>
                                setPortalPassword(e.target.value)
                              }
                              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-mono"
                            />
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={handleIssueB2bPortalLogin}
                              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition"
                            >
                              <KeyRound className="h-3.5 w-3.5" />
                              <span>
                                {existingPortalAccount
                                  ? tr("লগইন আপডেট", "Update Login")
                                  : tr("লগইন তৈরি করুন", "Issue Login")}
                              </span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  `KNLTC B2B Partner Portal\nLogin URL: ${window.location.origin}/admin/login\nEmail: ${portalEmail}\nPassword: ${portalPassword}`,
                                );
                                setCopiedCredentials(true);
                                setTimeout(
                                  () => setCopiedCredentials(false),
                                  2000,
                                );
                              }}
                              className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-700 hover:bg-slate-100"
                              title="Copy Credentials"
                            >
                              {copiedCredentials ? (
                                <Check className="h-4 w-4 text-emerald-700" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Transaction History Table */}
                  <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden">
                    <div className="px-5 py-3.5 border-b border-slate-100">
                      <h4 className="text-xs font-bold text-slate-900">
                        {tr(`কমিশন ও লেনদেন হিস্ট্রি (${linkedTransactions.length} টি রেকর্ড)`, `Commission Settlement History (${linkedTransactions.length})`)}
                      </h4>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50/70 border-b border-slate-100 font-semibold text-slate-500">
                          <tr>
                            <th className="px-4 py-2.5">{tr("রসিদ ও তারিখ", "Receipt & Date", "領収書・日付")}</th>
                            <th className="px-4 py-2.5">{tr("বিবরণ / নোট", "Description / Notes", "詳細・備考")}</th>
                            <th className="px-4 py-2.5">{tr("মাধ্যম ও রেফারেন্স", "Method & Ref", "決済手段・参照番号")}</th>
                            <th className="px-4 py-2.5 text-right">
                              {tr("পরিমাণ (BDT)", "Amount (BDT)", "金額 (BDT)")}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {linkedTransactions.map((tx) => (
                            <tr key={tx.id}>
                              <td className="px-4 py-2.5">
                                <span className="font-mono font-semibold text-slate-800 block">
                                  {tx.receiptNo}
                                </span>
                                <span className="text-[11px] text-slate-400">
                                  {tx.date}
                                </span>
                              </td>
                              <td className="px-4 py-2.5">
                                <span className="font-medium text-slate-800 block">
                                  {tx.studentName}
                                </span>
                                {tx.notes && (
                                  <span className="text-[11px] text-slate-400">
                                    {tx.notes}
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-2.5 font-mono text-slate-600">
                                {tx.paymentMethod} · {tx.referenceOrTrx}
                              </td>
                              <td className="px-4 py-2.5 text-right font-bold text-emerald-700 tabular-nums">
                                ৳{tx.amountBdt.toLocaleString()}
                              </td>
                            </tr>
                          ))}
                          {linkedTransactions.length === 0 && (
                            <tr>
                              <td colSpan={4} className="py-8 text-center">
                                <p className="text-xs text-slate-400">
                                  {tr("এখনো কোনো কমিশন লেনদেন রেকর্ড করা হয়নি।", "No commission transactions recorded yet.")}
                                </p>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
