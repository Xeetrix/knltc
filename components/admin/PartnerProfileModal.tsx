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
  Building2,
  Tag,
  Calendar,
  Edit3,
  Plus,
  Clock,
  CheckCircle2,
  Upload,
  Loader2,
  ExternalLink,
  Send,
  Camera,
  X,
  Save,
  Trash2,
  Printer,
  GraduationCap,
  Eye,
  Download,
} from "lucide-react";
import { uploadMediaImage, uploadDocumentFile } from "@/lib/media-upload";
import DocumentPreviewModal from "@/components/admin/DocumentPreviewModal";
import {
  type JapanesePartnerSchool,
  type B2bAgent,
  type PartnerDocumentItem,
  type PartnerInstitutionType,
  type CrmLead,
  type VisaApplicant,
  type FinancialTransaction,
  type LeadPriority,
  type LeadActivityItem,
  type ProfileTaskItem,
  getSchoolDocumentVault,
  getB2bAgentDocumentVault,
  updatePartnerSchool,
  updateB2bAgent,
  assignStudentToPartnerSchool,
  assignStudentToB2bAgent,
  claimPartnerSchoolCommission,
  settleB2bAgentCommission,
  formatLeadInterestLabel,
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

type WorkspaceTabId =
  | "overview"
  | "tasks"
  | "documents"
  | "matches"
  | "applications"
  | "invoices";

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
    ja: "専門学校",
  },
  SSW_EMPLOYER: {
    bn: "SSW নিয়োগকারী কোম্পানি",
    en: "SSW Accepting Organization / Employer",
    ja: "特定技能受入企業",
  },
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
  const isBn = language === "bn";
  const isSchool = mode === "SCHOOL";

  const [activeTab, setActiveTab] = useState<WorkspaceTabId>("overview");
  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
  const [isUpdateStatusOpen, setIsUpdateStatusOpen] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingDocId, setUploadingDocId] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [statusUpdateNote, setStatusUpdateNote] = useState("");
  const [matchSearchQuery, setMatchSearchQuery] = useState("");
  const [previewDoc, setPreviewDoc] = useState<{
    title: string;
    subtitle?: string;
    fileUrl: string;
    fileName?: string;
  } | null>(null);

  // School State
  const [schoolState, setSchoolState] = useState<JapanesePartnerSchool>(() => {
    const base: JapanesePartnerSchool = school || {
      id: "",
      name: "",
      japaneseName: "",
      institutionType: "LANGUAGE_SCHOOL",
      location: "Tokyo",
      contactPerson: "",
      email: "",
      commissionPerStudentYen: 120000,
      commissionPerStudentBdt: 96000,
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
      priority: "WARM",
      documents: [],
      notes: "",
    };
    return {
      ...base,
      institutionType: base.institutionType || "LANGUAGE_SCHOOL",
      firstYearTuitionYen: base.firstYearTuitionYen ?? 760000,
      minGpaRequired: base.minGpaRequired || "3.00",
      maxStudyGapYears: base.maxStudyGapYears ?? 5,
      minLanguageLevel: base.minLanguageLevel || "JLPT N5 / NAT 5Q",
      priority: base.priority || "WARM",
      documents: getSchoolDocumentVault(base),
      tasks:
        base.tasks && base.tasks.length > 0
          ? base.tasks
          : [
              {
                id: "sch-task-1",
                title: isBn
                  ? "পার্টনার স্কুলের অফিসিয়াল MOU চুক্তিপত্র ও প্রসপেক্টাস যাচাই"
                  : "Verify signed MOU agreement and 2027 intake brochure",
                completed: base.status === "ACTIVE_PARTNER",
                assignee: base.contactPerson || "International Desk",
              },
              {
                id: "sch-task-2",
                title: isBn
                  ? "পরবর্তী ইনটেকের কোটা ও জুম ইন্টারভিউ শিডিউল নির্ধারণ"
                  : "Confirm upcoming intake seat quota and Zoom interview dates",
                completed: false,
                assignee: base.contactPerson || "International Desk",
              },
            ],
      activityLog: base.activityLog || [],
    };
  });

  // Agent State
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
      status: "ACTIVE",
      priority: "WARM",
      documents: [],
      notes: "",
    };
    return {
      ...base,
      status: base.status || "ACTIVE",
      priority: base.priority || "WARM",
      documents: getB2bAgentDocumentVault(base),
      tasks:
        base.tasks && base.tasks.length > 0
          ? base.tasks
          : [
              {
                id: "ag-task-1",
                title: isBn
                  ? "এজেন্সির ট্রেড লাইসেন্স ও স্বত্বাধিকারীর NID যাচাইকরণ"
                  : "Verify agency Trade License and Proprietor NID copy",
                completed: Boolean(base.tradeLicenseNo),
                assignee: base.contactPerson || "B2B Desk",
              },
              {
                id: "ag-task-2",
                title: isBn
                  ? "বিটুবি রেফারেল কমিশন চুক্তি ও ব্যাংক/বিকাশ একাউন্ট যুক্তকরণ"
                  : "Confirm B2B referral commission agreement and payout details",
                completed: Boolean(base.bankAccountNo || base.bkashOrNagadNo),
                assignee: base.contactPerson || "Accounts",
              },
            ],
      activityLog: base.activityLog || [],
    };
  });

  // Linked Leads, Visa Applicants & Transactions
  const linkedLeads = useMemo(() => {
    if (isSchool) {
      return allLeads.filter(
        (l) =>
          l.partnerSchoolId === schoolState.id ||
          l.targetSchoolId === schoolState.id ||
          (l.targetSchool &&
            l.targetSchool.toLowerCase() === schoolState.name.toLowerCase())
      );
    }
    return allLeads.filter(
      (l) =>
        l.b2bAgentId === agentState.id ||
        l.referredByAgentId === agentState.id ||
        (l.b2bAgentName &&
          l.b2bAgentName.toLowerCase() ===
            agentState.organizationName.toLowerCase())
    );
  }, [isSchool, allLeads, schoolState.id, schoolState.name, agentState.id, agentState.organizationName]);

  const linkedVisas = useMemo(() => {
    if (isSchool) {
      return allVisaApplicants.filter(
        (v) =>
          v.partnerSchoolId === schoolState.id ||
          v.targetSchoolId === schoolState.id ||
          (v.targetSchool &&
            v.targetSchool.toLowerCase() === schoolState.name.toLowerCase())
      );
    }
    return allVisaApplicants.filter(
      (v) =>
        v.b2bAgentId === agentState.id ||
        v.referredByAgentId === agentState.id ||
        (v.b2bAgentName &&
          v.b2bAgentName.toLowerCase() ===
            agentState.organizationName.toLowerCase())
    );
  }, [isSchool, allVisaApplicants, schoolState.id, schoolState.name, agentState.id, agentState.organizationName]);

  const linkedTransactions = useMemo(() => {
    if (isSchool) {
      return allTransactions.filter(
        (t) =>
          t.linkedSchoolId === schoolState.id ||
          t.studentName.toLowerCase().includes(schoolState.name.toLowerCase())
      );
    }
    return allTransactions.filter(
      (t) =>
        t.linkedAgentId === agentState.id ||
        t.studentName
          .toLowerCase()
          .includes(agentState.organizationName.toLowerCase())
    );
  }, [isSchool, allTransactions, schoolState.id, schoolState.name, agentState.id, agentState.organizationName]);

  const documents = isSchool
    ? schoolState.documents || []
    : agentState.documents || [];
  const uploadedDocsCount = documents.filter((d) => d.status !== "MISSING").length;
  const tasks = isSchool ? schoolState.tasks || [] : agentState.tasks || [];
  const openTasksCount = tasks.filter((t) => !t.completed).length;
  const activityLog = useMemo(
    () => (isSchool ? schoolState.activityLog || [] : agentState.activityLog || []),
    [isSchool, schoolState.activityLog, agentState.activityLog]
  );

  const displayName = isSchool
    ? schoolState.name
    : agentState.organizationName;
  const displaySubtitle = isSchool
    ? `Japan · ${
        isBn
          ? INSTITUTION_TYPE_LABELS[
              schoolState.institutionType || "LANGUAGE_SCHOOL"
            ].bn
          : INSTITUTION_TYPE_LABELS[
              schoolState.institutionType || "LANGUAGE_SCHOOL"
            ].en
      } · ${schoolState.location}`
    : `Bangladesh · ${agentState.agentType.replace(/_/g, " ")} · ${agentState.city}`;

  const currentStatusText = isSchool
    ? schoolState.status === "ACTIVE_PARTNER"
      ? "Active Partner"
      : "In Review"
    : agentState.status === "UNDER_VERIFICATION"
      ? "Under Verification"
      : agentState.status === "SUSPENDED"
        ? "Suspended"
        : "Active Agent";

  // Save helper
  const persistEntity = (
    schoolOverrides?: Partial<JapanesePartnerSchool>,
    agentOverrides?: Partial<B2bAgent>,
    toastMsg?: string
  ) => {
    if (isSchool) {
      const updated = { ...schoolState, ...schoolOverrides };
      setSchoolState(updated);
      updatePartnerSchool(updated.id, updated);
    } else {
      const updated = { ...agentState, ...agentOverrides };
      setAgentState(updated);
      updateB2bAgent(updated.id, updated);
    }
    onRefreshStore();
    if (toastMsg) onShowToast(toastMsg);
  };

  // Auto Narrative Summary
  const autoNarrativeSummary = useMemo(() => {
    const savedAi = isSchool ? schoolState.aiSummary : agentState.aiSummary;
    if (savedAi) return savedAi;

    if (isSchool) {
      return `${schoolState.name} (${schoolState.location}, Japan) is an institutional partner with a minimum GPA requirement of ${schoolState.minGpaRequired || "3.00"} and first-year tuition of ¥${(schoolState.firstYearTuitionYen || 760000).toLocaleString()}. Currently ${linkedLeads.length} KNLTC students are matched with this school and ${uploadedDocsCount}/${documents.length} institutional documents are on file. The most useful next action is to coordinate upcoming intake interviews and assign eligible student files.`;
    }
    return `${agentState.organizationName} (${agentState.city}) is a B2B referral partner managed by ${agentState.contactPerson} with an agreed commission rate of ৳${(agentState.agreedCommissionBdt || 30000).toLocaleString()} per successful student. They have referred ${linkedLeads.length} candidates so far and submitted ${uploadedDocsCount}/${documents.length} verification documents. The most useful next action is to review their referred candidates and process pending commission settlements.`;
  }, [
    isSchool,
    schoolState,
    agentState,
    linkedLeads.length,
    uploadedDocsCount,
    documents.length,
  ]);

  // 1-Click Gemini AI Summary
  const handleGenerateAiSummary = async () => {
    setIsGeneratingAi(true);
    try {
      const res = await fetch("/api/admin/ai-profile-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entityType: isSchool ? "SCHOOL" : "AGENT",
          name: displayName,
          program: displaySubtitle,
          status: currentStatusText,
          city: isSchool ? schoolState.location : agentState.city,
          uploadedDocsCount,
          totalDocsCount: documents.length,
          latestNote:
            activityLog[0]?.note ||
            (isSchool ? schoolState.notes : agentState.notes) ||
            "",
          extraContext: isSchool
            ? `Min GPA: ${schoolState.minGpaRequired}, 1st Yr Tuition: ¥${schoolState.firstYearTuitionYen}, Matched Students: ${linkedLeads.length}`
            : `Agreed Commission: ৳${agentState.agreedCommissionBdt}, Referred Students: ${linkedLeads.length}, Pending Commission: ৳${agentState.pendingCommissionBdt}`,
          language,
        }),
      });
      const data = await res.json();
      if (data.summary) {
        if (isSchool) {
          persistEntity(
            { aiSummary: data.summary },
            undefined,
            tr("AI সামারি সেভ হয়েছে", "AI Summary updated & saved")
          );
        } else {
          persistEntity(
            undefined,
            { aiSummary: data.summary },
            tr("AI সামারি সেভ হয়েছে", "AI Summary updated & saved")
          );
        }
      }
    } catch {
      onShowToast(tr("AI সামারি তৈরিতে সমস্যা হয়েছে", "Failed to generate AI summary"));
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const timelineItems = useMemo(() => {
    const list: LeadActivityItem[] = [...activityLog];
    const baseNote = isSchool ? schoolState.notes : agentState.notes;
    if (list.length === 0 && baseNote) {
      list.push({
        id: "seed-partner-note",
        type: "MEETING_NOTE",
        fromStatus: "Onboarding",
        toStatus: currentStatusText,
        note: baseNote,
        summary: baseNote,
        counselorName: "B2B & International Desk",
        createdAt: new Date().toISOString(),
      });
    }
    list.push({
      id: "seed-partner-created",
      type: "STAGE_CHANGE",
      toStatus: currentStatusText,
      summary: `Partner profile registered in KNLTC Master Sheet`,
      counselorName: "AI / system",
      createdAt: new Date().toISOString(),
    });
    return list;
  }, [activityLog, isSchool, schoolState.notes, agentState.notes, currentStatusText]);

  // Eligible Candidates for Matching
  const candidateMatches = useMemo(() => {
    const q = matchSearchQuery.trim().toLowerCase();
    return allLeads
      .filter((l) => {
        if (!q) return true;
        return (
          l.name.toLowerCase().includes(q) ||
          l.phone.toLowerCase().includes(q) ||
          l.city.toLowerCase().includes(q)
        );
      })
      .slice(0, 60);
  }, [allLeads, matchSearchQuery]);

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#F8FAFC] rounded-2xl border border-slate-200/80 p-5 sm:p-8 shadow-2xs">
      {/* =====================================================================
          1. TOP BACK BAR
          ===================================================================== */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>
            {isSchool
              ? tr("পার্টনার স্কুল তালিকায় ফিরে যান", "Back to Partner Schools")
              : tr("বিটুবি এজেন্ট তালিকায় ফিরে যান", "Back to B2B Agents")}
          </span>
        </button>
      </div>

      {/* =====================================================================
          2. PARTNER IDENTITY HEADER
          ===================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5 mb-7">
        <div className="flex items-start gap-4">
          <label className="relative group flex h-14 w-14 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#2563EB] text-white text-xl font-bold shadow-xs overflow-hidden">
            {(isSchool ? schoolState.logoUrl : agentState.logoUrl) ? (
              <img
                src={(isSchool ? schoolState.logoUrl : agentState.logoUrl) || ""}
                alt={displayName}
                className="h-full w-full object-cover"
              />
            ) : (
              <span>{displayName.trim().charAt(0).toUpperCase() || "P"}</span>
            )}
            <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
              {uploadingLogo ? (
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
                setUploadingLogo(true);
                try {
                  const res = await uploadMediaImage(file, "knltc-media");
                  if (isSchool) {
                    persistEntity(
                      { logoUrl: res.url },
                      undefined,
                      tr("লোগো আপলোড হয়েছে", "Logo uploaded")
                    );
                  } else {
                    persistEntity(
                      undefined,
                      { logoUrl: res.url },
                      tr("লোগো আপলোড হয়েছে", "Logo uploaded")
                    );
                  }
                } catch {
                  onShowToast(tr("লোগো আপলোড ব্যর্থ হয়েছে", "Logo upload failed"));
                } finally {
                  setUploadingLogo(false);
                }
              }}
            />
          </label>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {displayName}
              </h1>

              <button
                type="button"
                onClick={() => setIsEditingModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs transition cursor-pointer"
              >
                <Edit3 className="h-3.5 w-3.5 text-slate-500" />
                <span>{tr("এডিট", "Edit")}</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 mt-1">
              <Globe className="h-3.5 w-3.5 text-slate-400" />
              <span>{displaySubtitle}</span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 mt-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                <Building2 className="h-3 w-3" />
                <span>{currentStatusText}</span>
              </span>

              <select
                value={
                  (isSchool ? schoolState.priority : agentState.priority) ||
                  "WARM"
                }
                onChange={(e) => {
                  const p = e.target.value as LeadPriority;
                  if (isSchool) {
                    persistEntity(
                      { priority: p },
                      undefined,
                      `Partner rated as ${p}`
                    );
                  } else {
                    persistEntity(
                      undefined,
                      { priority: p },
                      `Agent rated as ${p}`
                    );
                  }
                }}
                aria-label="Rate partner"
                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 shadow-2xs cursor-pointer"
              >
                <option value="HOT">Rate partner: Strategic Tier 🔥</option>
                <option value="WARM">Rate partner: Active Partner ⭐</option>
                <option value="COLD">Rate partner: Standard ❄️</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
          3. 6-TAB HORIZONTAL NAVIGATION BAR
          ===================================================================== */}
      <div className="border-b border-slate-200/90 mb-6 overflow-x-auto">
        <nav className="flex items-center gap-6 min-w-max">
          {(
            [
              {
                id: "overview" as WorkspaceTabId,
                label: tr("ওভারভিউ", "Overview"),
                icon: User,
                badge: undefined as string | number | undefined,
              },
              {
                id: "tasks" as WorkspaceTabId,
                label: tr("টাস্কসমূহ", "Tasks"),
                icon: CheckSquare,
                badge: openTasksCount > 0 ? openTasksCount : undefined,
              },
              {
                id: "documents" as WorkspaceTabId,
                label: tr("ডকুমেন্টস ও MOU", "Documents"),
                icon: FolderOpen,
                badge: `${uploadedDocsCount}/${documents.length}`,
              },
              {
                id: "matches" as WorkspaceTabId,
                label: tr("শিক্ষার্থী ম্যাচিং", "Matches"),
                icon: Sparkles,
                badge: linkedLeads.length,
              },
              {
                id: "applications" as WorkspaceTabId,
                label: tr("ভিসা অ্যাপ্লিকেশন", "Applications"),
                icon: Landmark,
                badge: linkedVisas.length,
              },
              {
                id: "invoices" as WorkspaceTabId,
                label: tr("কমিশন ও ইনভয়েস", "Invoices"),
                icon: Receipt,
                badge: linkedTransactions.length,
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
          TAB 1: OVERVIEW (2-Column Layout Matching Screenshot)
          ===================================================================== */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-4 space-y-5">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-5">
                {isSchool ? "INSTITUTION INFORMATION" : "AGENCY INFORMATION"}
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Phone className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      PHONE / CONTACT
                    </div>
                    <div className="text-sm font-medium text-slate-900 font-mono mt-0.5">
                      {(isSchool ? schoolState.phone : agentState.phone) ||
                        (isSchool ? schoolState.contactPerson : "+880")}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      EMAIL
                    </div>
                    <div className="text-sm font-medium text-slate-900 break-all mt-0.5">
                      {(isSchool ? schoolState.email : agentState.email) ||
                        "partner@knltc.jp"}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Globe className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      LOCATION
                    </div>
                    <div className="text-sm font-medium text-slate-900 mt-0.5">
                      {isSchool
                        ? `${schoolState.location}, Japan`
                        : `${agentState.city}, Bangladesh`}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <GraduationCap className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {isSchool ? "INSTITUTION TYPE" : "PARTNER TIER"}
                    </div>
                    <div className="text-sm font-medium text-slate-900 mt-0.5">
                      {isSchool
                        ? INSTITUTION_TYPE_LABELS[
                            schoolState.institutionType || "LANGUAGE_SCHOOL"
                          ].en
                        : agentState.agentType.replace(/_/g, " ")}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Tag className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      CONTACT PERSON
                    </div>
                    <div className="text-sm font-medium text-slate-900 mt-0.5">
                      {isSchool
                        ? schoolState.contactPerson || "International Office"
                        : agentState.contactPerson}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ACADEMIC / FINANCIAL CRITERIA CARD */}
            <div className="rounded-2xl border border-indigo-100/90 bg-[#EEF2FF]/75 p-6">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 mb-4">
                {isSchool ? "ADMISSION & TUITION PROFILE" : "COMMISSION PROFILE"}
              </h2>

              {isSchool ? (
                <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                  <div>
                    <div className="text-xs text-slate-500">Min GPA Req</div>
                    <div className="text-base font-bold text-slate-900 tabular-nums mt-0.5">
                      {schoolState.minGpaRequired || "3.00"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Max Study Gap</div>
                    <div className="text-base font-bold text-slate-900 tabular-nums mt-0.5">
                      {schoolState.maxStudyGapYears ?? 5} yrs
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">1st Yr Tuition</div>
                    <div className="text-sm font-bold text-slate-900 tabular-nums mt-0.5">
                      ¥{(schoolState.firstYearTuitionYen || 760000).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Commission / Student</div>
                    <div className="text-sm font-bold text-indigo-700 tabular-nums mt-0.5">
                      ¥{(schoolState.commissionPerStudentYen || 120000).toLocaleString()}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                  <div>
                    <div className="text-xs text-slate-500">Rate / Student</div>
                    <div className="text-base font-bold text-slate-900 tabular-nums mt-0.5">
                      ৳{(agentState.agreedCommissionBdt || 30000).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Referred Leads</div>
                    <div className="text-base font-bold text-slate-900 tabular-nums mt-0.5">
                      {linkedLeads.length}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Paid Total</div>
                    <div className="text-sm font-bold text-emerald-700 tabular-nums mt-0.5">
                      ৳{(agentState.paidCommissionBdt || 0).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Pending Due</div>
                    <div className="text-sm font-bold text-rose-700 tabular-nums mt-0.5">
                      ৳{(agentState.pendingCommissionBdt || 0).toLocaleString()}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-8 space-y-5">
            {/* AI PROFILE SUMMARY */}
            <div className="rounded-2xl border border-violet-200/80 bg-[#F5F3FF]/70 p-6 shadow-2xs">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-violet-700">
                  <Sparkles className="h-3.5 w-3.5 text-violet-600" />
                  <span>AI PROFILE SUMMARY</span>
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
                  <span>1-Click AI Advise</span>
                </button>
              </div>

              <p className="text-sm leading-relaxed text-slate-800">
                {autoNarrativeSummary}
              </p>
            </div>

            {/* UPDATE STATUS CARD */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                    UPDATE STATUS
                  </h2>
                  <div className="flex items-center gap-2.5">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-blue-700">
                      <Building2 className="h-3.5 w-3.5" />
                      <span>{currentStatusText}</span>
                    </span>
                    <span className="text-xs text-slate-400">
                      — current status
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsUpdateStatusOpen((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Update</span>
                </button>
              </div>

              {isUpdateStatusOpen && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!statusUpdateNote.trim()) return;
                    const newEntry: LeadActivityItem = {
                      id: `act-${Date.now()}`,
                      type: "MEETING_NOTE",
                      fromStatus: currentStatusText,
                      toStatus: currentStatusText,
                      note: statusUpdateNote.trim(),
                      summary: statusUpdateNote.trim(),
                      counselorName: "B2B Coordinator",
                      createdAt: new Date().toISOString(),
                    };
                    const nextLog = [newEntry, ...activityLog];
                    if (isSchool) {
                      persistEntity(
                        { activityLog: nextLog, notes: statusUpdateNote.trim() },
                        undefined,
                        "Partner timeline updated"
                      );
                    } else {
                      persistEntity(
                        undefined,
                        { activityLog: nextLog, notes: statusUpdateNote.trim() },
                        "Agent timeline updated"
                      );
                    }
                    setStatusUpdateNote("");
                    setIsUpdateStatusOpen(false);
                  }}
                  className="mt-5 pt-5 border-t border-slate-100 space-y-3"
                >
                  <textarea
                    rows={2}
                    value={statusUpdateNote}
                    onChange={(e) => setStatusUpdateNote(e.target.value)}
                    placeholder="Enter partner coordination note, MOU update, or intake remark..."
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsUpdateStatusOpen(false)}
                      className="rounded-xl border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-xl bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 cursor-pointer"
                    >
                      Save Update
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* ACTIVITY TIMELINE */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-5">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                <span>ACTIVITY TIMELINE</span>
              </div>

              <div className="relative pl-6 border-l-2 border-slate-100 space-y-6 ml-2">
                {timelineItems.map((item, idx) => (
                  <div key={item.id} className="relative">
                    <span
                      className={`absolute -left-[31px] top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full ring-4 ring-white ${
                        idx === 0 ? "bg-blue-500" : "bg-slate-400"
                      }`}
                    />
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      {item.fromStatus && (
                        <>
                          <span className="text-slate-500 font-medium">
                            {item.fromStatus}
                          </span>
                          <span className="text-slate-400">→</span>
                        </>
                      )}
                      <span className="rounded-full bg-blue-50 border border-blue-200/80 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                        {item.toStatus || currentStatusText}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      {new Date(item.createdAt).toLocaleString()} ·{" "}
                      {item.counselorName}
                    </div>
                    {item.note && (
                      <p className="text-xs sm:text-sm italic text-slate-600 mt-1.5">
                        &ldquo;{item.note}&rdquo;
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 2: TASKS
          ===================================================================== */}
      {activeTab === "tasks" && (
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">
            Partner Coordination &amp; Compliance Tasks
          </h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!newTaskTitle.trim()) return;
              const nextTasks: ProfileTaskItem[] = [
                {
                  id: `ptask-${Date.now()}`,
                  title: newTaskTitle.trim(),
                  dueDate: newTaskDueDate || undefined,
                  completed: false,
                  assignee: isSchool
                    ? schoolState.contactPerson
                    : agentState.contactPerson,
                },
                ...tasks,
              ];
              setNewTaskTitle("");
              setNewTaskDueDate("");
              if (isSchool) {
                persistEntity({ tasks: nextTasks }, undefined, "Task added");
              } else {
                persistEntity(undefined, { tasks: nextTasks }, "Task added");
              }
            }}
            className="flex flex-col sm:flex-row gap-2.5"
          >
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Add partner task..."
              className="flex-1 rounded-xl border border-slate-200 px-3.5 py-2 text-xs"
            />
            <input
              type="date"
              value={newTaskDueDate}
              onChange={(e) => setNewTaskDueDate(e.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs"
            />
            <button
              type="submit"
              className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white cursor-pointer"
            >
              + Add Task
            </button>
          </form>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl">
            {tasks.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between p-4 text-xs"
              >
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={t.completed}
                    onChange={() => {
                      const next = tasks.map((item) =>
                        item.id === t.id
                          ? { ...item, completed: !item.completed }
                          : item
                      );
                      if (isSchool) persistEntity({ tasks: next });
                      else persistEntity(undefined, { tasks: next });
                    }}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600"
                  />
                  <span
                    className={
                      t.completed
                        ? "line-through text-slate-400"
                        : "font-medium text-slate-900"
                    }
                  >
                    {t.title}
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 3: DOCUMENTS (Google Drive MOU & Compliance Vault)
          ===================================================================== */}
      {activeTab === "documents" && (
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">
            {isSchool
              ? "Institution Brochures, Application Forms & MOU Vault"
              : "B2B Agency Trade License, NID & Agreement Vault"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc) => {
              const isUploading = uploadingDocId === doc.id;
              return (
                <div
                  key={doc.id}
                  className="rounded-xl border border-slate-200 p-4 flex flex-col justify-between gap-3"
                >
                  <div>
                    <div className="text-xs sm:text-sm font-semibold text-slate-900">
                      {isBn ? doc.titleBn : doc.titleEn}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {doc.fileName || "No file uploaded yet"}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <label className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer">
                      {isUploading ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-600" />
                      ) : (
                        <Upload className="h-3.5 w-3.5 text-indigo-600" />
                      )}
                      <span>
                        {isUploading
                          ? "Uploading..."
                          : doc.fileUrl
                            ? "Replace File"
                            : "Upload File"}
                      </span>
                      <input
                        type="file"
                        accept=".pdf,image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setUploadingDocId(doc.id);
                          try {
                            const res = await uploadDocumentFile(
                              file,
                              "knltc-documents"
                            );
                            const nextDocs = documents.map((d) =>
                              d.id === doc.id
                                ? {
                                    ...d,
                                    status: "VERIFIED" as const,
                                    fileUrl: res.url,
                                    fileName: file.name,
                                    uploadedAt: new Date()
                                      .toISOString()
                                      .slice(0, 10),
                                  }
                                : d
                            );
                            if (isSchool) {
                              persistEntity(
                                { documents: nextDocs },
                                undefined,
                                "Document uploaded & saved"
                              );
                            } else {
                              persistEntity(
                                undefined,
                                { documents: nextDocs },
                                "Document uploaded & saved"
                              );
                            }
                          } catch {
                            onShowToast("Upload failed");
                          } finally {
                            setUploadingDocId(null);
                          }
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
                              subtitle: `${displayName} • ${doc.fileName || "Document"}`,
                              fileUrl: doc.fileUrl!,
                              fileName: doc.fileName,
                            })
                          }
                          className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 border border-indigo-200 px-2.5 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>View File</span>
                        </button>
                        <a
                          href={
                            doc.fileUrl.includes("/api/media/file/")
                              ? `${doc.fileUrl}${doc.fileUrl.includes("?") ? "&" : "?"}download=1`
                              : doc.fileUrl
                          }
                          download={doc.fileName || doc.titleEn}
                          className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
                          title="Download"
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
          TAB 4: MATCHES (Assign & Link Students from CRM Leads)
          ===================================================================== */}
      {activeTab === "matches" && (
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {isSchool
                  ? `Matched & Eligible Students (${linkedLeads.length} Linked)`
                  : `Referred Candidates (${linkedLeads.length} Linked)`}
              </h2>
              <p className="text-xs text-slate-500">
                Search any candidate from the {allLeads.length} CRM leads and link
                them in 1 click.
              </p>
            </div>

            <input
              type="text"
              value={matchSearchQuery}
              onChange={(e) => setMatchSearchQuery(e.target.value)}
              placeholder="Search student by name or phone..."
              className="rounded-xl border border-slate-200 px-3.5 py-2 text-xs w-full sm:w-64"
            />
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-4">Candidate</th>
                  <th className="py-3 px-4">Program</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {candidateMatches.map((l) => {
                  const isAlreadyLinked = linkedLeads.some(
                    (item) => item.id === l.id
                  );
                  return (
                    <tr key={l.id} className="hover:bg-slate-50/60">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{l.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {l.phone} · {l.city}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-medium">
                        {formatLeadInterestLabel(l.interest, isBn)}
                      </td>
                      <td className="py-3 px-4">
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700">
                          {l.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          disabled={isAlreadyLinked}
                          onClick={() => {
                            if (isSchool) {
                              assignStudentToPartnerSchool(l.id, schoolState.id);
                            } else {
                              assignStudentToB2bAgent(l.id, agentState.id);
                            }
                            onRefreshStore();
                            onShowToast(
                              `Linked ${l.name} to ${displayName}`
                            );
                          }}
                          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                            isAlreadyLinked
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-slate-900 text-white hover:bg-slate-800"
                          }`}
                        >
                          {isAlreadyLinked ? "✓ Linked" : "+ Assign Student"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 5: APPLICATIONS (Linked Visa & COE Pipeline Files)
          ===================================================================== */}
      {activeTab === "applications" && (
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">
            Active Visa &amp; COE Applications ({linkedVisas.length})
          </h2>

          {linkedVisas.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No active Visa / COE files linked to {displayName} yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {linkedVisas.map((v) => (
                <div
                  key={v.id}
                  className="rounded-xl border border-slate-200 p-4 flex items-center justify-between"
                >
                  <div>
                    <div className="text-sm font-bold text-slate-900">
                      {v.name}
                    </div>
                    <div className="text-xs text-slate-500 font-mono mt-0.5">
                      {v.trackingNo} · {v.phone}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
                      Stage {v.stage} / 10
                    </span>
                    <div className="text-[11px] text-slate-400 mt-1">
                      COE: {v.coEStatus}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          TAB 6: INVOICES (Commission Claims, Payouts & Ledger)
          ===================================================================== */}
      {activeTab === "invoices" && (
        <div className="space-y-5">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {isSchool
                  ? "Institutional Commission Claims (JPY → BDT)"
                  : "B2B Referral Commission Settlements"}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {isSchool
                  ? `Commission per student: ¥${(schoolState.commissionPerStudentYen || 120000).toLocaleString()}`
                  : `Agreed commission per visa: ৳${(agentState.agreedCommissionBdt || 30000).toLocaleString()}`}
              </p>
            </div>

            {isSchool ? (
              <button
                type="button"
                onClick={() => {
                  claimPartnerSchoolCommission(schoolState.id, 1);
                  onRefreshStore();
                  onShowToast(
                    `Claimed 1 student commission from ${schoolState.name}`
                  );
                }}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 cursor-pointer"
              >
                + Claim 1 Student Commission
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  settleB2bAgentCommission(
                    agentState.id,
                    agentState.pendingCommissionBdt ||
                      agentState.agreedCommissionBdt ||
                      30000
                  );
                  onRefreshStore();
                  onShowToast(
                    `Settled commission payout for ${agentState.organizationName}`
                  );
                }}
                className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 cursor-pointer"
              >
                + Disburse Commission Payout
              </button>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-2xs">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                Financial Ledger &amp; Commission Invoices
              </h3>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print</span>
              </button>
            </div>

            {linkedTransactions.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No commission transactions recorded yet.
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-4">Receipt No</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Details</th>
                    <th className="py-3 px-4 text-right">Amount (BDT)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {linkedTransactions.map((tx) => (
                    <tr key={tx.id}>
                      <td className="py-3 px-4 font-mono font-semibold">
                        {tx.receiptNo}
                      </td>
                      <td className="py-3 px-4 text-slate-600">{tx.date}</td>
                      <td className="py-3 px-4 text-slate-700">{tx.notes || tx.studentName}</td>
                      <td className="py-3 px-4 text-right font-bold tabular-nums">
                        ৳{tx.amountBdt.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          EDIT MODAL
          ===================================================================== */}
      {isEditingModalOpen && (
        <div
          className="fixed inset-0 z-[95] flex items-center justify-center bg-slate-950/50 backdrop-blur-xs p-4"
          onClick={() => setIsEditingModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Edit {isSchool ? "Partner School" : "B2B Agent"} Profile
              </h3>
              <button
                type="button"
                onClick={() => setIsEditingModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {isSchool ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700">
                    School Name *
                  </label>
                  <input
                    type="text"
                    value={schoolState.name}
                    onChange={(e) =>
                      setSchoolState({ ...schoolState, name: e.target.value })
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">
                    Location (Japan)
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
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">
                    Min GPA Required
                  </label>
                  <input
                    type="text"
                    value={schoolState.minGpaRequired || "3.00"}
                    onChange={(e) =>
                      setSchoolState({
                        ...schoolState,
                        minGpaRequired: e.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">
                    1st Year Tuition (JPY)
                  </label>
                  <input
                    type="number"
                    value={schoolState.firstYearTuitionYen || 760000}
                    onChange={(e) =>
                      setSchoolState({
                        ...schoolState,
                        firstYearTuitionYen: Number(e.target.value) || 0,
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 tabular-nums"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">
                    Commission / Student (JPY)
                  </label>
                  <input
                    type="number"
                    value={schoolState.commissionPerStudentYen || 120000}
                    onChange={(e) =>
                      setSchoolState({
                        ...schoolState,
                        commissionPerStudentYen: Number(e.target.value) || 0,
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 tabular-nums"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700">
                    Organization Name *
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
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">
                    Contact Person
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
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Phone</label>
                  <input
                    type="text"
                    value={agentState.phone}
                    onChange={(e) =>
                      setAgentState({ ...agentState, phone: e.target.value })
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">City</label>
                  <input
                    type="text"
                    value={agentState.city}
                    onChange={(e) =>
                      setAgentState({ ...agentState, city: e.target.value })
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">
                    Agreed Commission (BDT)
                  </label>
                  <input
                    type="number"
                    value={agentState.agreedCommissionBdt}
                    onChange={(e) =>
                      setAgentState({
                        ...agentState,
                        agreedCommissionBdt: Number(e.target.value) || 0,
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 tabular-nums"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsEditingModalOpen(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (isSchool) {
                    persistEntity(schoolState, undefined, "Partner school saved");
                  } else {
                    persistEntity(undefined, agentState, "B2B agent saved");
                  }
                  setIsEditingModalOpen(false);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-5 py-2 text-xs font-semibold text-white cursor-pointer"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Save Changes</span>
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
