"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  Users,
  Briefcase,
  GraduationCap,
  FileCheck2,
  DollarSign,
  Globe2,
  Globe,
  Building2,
  PhoneCall,
  CheckCircle2,
  Send,
  PlusCircle,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  BookOpen,
  ShoppingBag,
  UserCheck,
  ArrowUpRight,
  ExternalLink,
  RefreshCw,
  Calculator,
  Award,
  Layers,
  FileText,
  Save,
  Check,
  LogOut,
  Database,
  KeyRound,
  Menu,
  X,
  LayoutDashboard,
  Plus,
  Trash2,
  Edit3,
  UserPlus,
  Receipt,
  Printer,
  Download,
  Upload,
  FileSpreadsheet,
  TrendingUp,
  TrendingDown,
  Filter,
  Search,
  ArrowDownRight,
  Coins,
} from "lucide-react";
import {
  getCmsStore,
  saveCmsStore,
  fetchLiveStoreFromServer,
  addCrmLead,
  updateCrmLeadStatus,
  deleteCrmLead,
  bulkDeleteCrmLeads,
  bulkUpdateCrmLeads,
  updateVisaStage,
  addLmsCredentials,
  addFinancialTransaction,
  updateFinancialTransaction,
  deleteFinancialTransaction,
  updateStoreOrderStatus,
  getSystemAccounts,
  addPartnerSchool,
  updatePartnerSchool,
  deletePartnerSchool,
  addB2bAgent,
  updateB2bAgent,
  deleteB2bAgent,
  addStaffMember,
  updateStaffMember,
  deleteStaffMember,
  promoteLeadToVisaPipeline,
  claimPartnerSchoolCommission,
  settleB2bAgentCommission,
  disburseStaffPayroll,
  disburseAllActivePayroll,
  calculateLeadEligibility,
  getSchoolDocumentVault,
  getB2bAgentDocumentVault,
  DEFAULT_WEBSITE_CMS,
  purgeStoreOfDummyData,
  type WebsiteCmsContent,
  type MasterKnlTcStore,
  type UserRole,
  type BranchCode,
  type DashboardTabId,
  type CrmLead,
  type VisaStage,
  type LeadStatus,
  type LeadPriority,
  type LeadSource,
  type ServiceInterest,
  type JobCircular,
  type JapanesePartnerSchool,
  type PartnerInstitutionType,
  type B2bAgent,
  type StaffMember,
  type FinancialTransaction,
} from "@/lib/knltc-cms-store";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { languageOptions, type Language } from "@/lib/i18n";
import { getDashboardDictionary, DashboardDictionary } from "@/lib/dashboard-translations";
import ProductManager from "@/components/admin/ProductManager";
import BlogManager from "@/components/admin/BlogManager";
import OrderManager from "@/components/admin/OrderManager";
import ReviewManager from "@/components/admin/ReviewManager";
import CategoryManager from "@/components/admin/CategoryManager";
import LeadProfileModal from "@/components/admin/LeadProfileModal";
import CrmImportExportModal from "@/components/admin/CrmImportExportModal";
import PartnerProfileModal from "@/components/admin/PartnerProfileModal";
import UserAccessControlPanel from "@/components/admin/UserAccessControlPanel";
import StudentProfileView from "@/components/admin/StudentProfileView";
import DriveFileUploadButton from "@/components/admin/DriveFileUploadButton";
import type {
  AdminSummary,
  BlogPost,
  Category,
  CrmLead as DbCrmLead,
  Order as DbOrder,
  Product as DbProduct,
  ProductReview as DbReview,
} from "@/lib/cms";

type ActiveModalType =
  | null
  | "ADD_LEAD"
  | "ADD_LMS"
  | "ADD_PARTNER_SCHOOL"
  | "ADD_B2B_AGENT"
  | "ADD_STAFF"
  | "ADD_PAYMENT"
  | "ADD_EXPENSE"
  | "VIEW_RECEIPT"
  | "ADD_CIRCULAR";

export default function DashboardPage() {
  const { language, setLanguage } = useLanguage();
  const [store, setStore] = useState<MasterKnlTcStore | null>(null);
  const [currentUser, setCurrentUser] = useState<{
    email: string;
    role: UserRole;
    name: string;
    branch: BranchCode;
    allowedTabs?: DashboardTabId[];
    linkedLeadId?: string;
  } | null>(null);
  const [activeRole, setActiveRole] = useState<UserRole>("MAIN_ADMIN");
  const [activeBranch, setActiveBranch] = useState<BranchCode>("ALL");
  const [isSyncingWithDb, setIsSyncingWithDb] = useState(false);
  const [isPushingToSheets, setIsPushingToSheets] = useState(false);
  const [sheetsStatus, setSheetsStatus] = useState<{
    connected: boolean;
    mode: string;
    masterSheetUrl: string;
  }>({
    connected: false,
    mode: "LOCAL_SEED_FALLBACK",
    masterSheetUrl:
      process.env.NEXT_PUBLIC_MASTER_SHEET_URL || "https://docs.google.com/spreadsheets",
  });
  const [selectedLeadForProfile, setSelectedLeadForProfile] = useState<CrmLead | null>(null);
  const [selectedSchoolForProfile, setSelectedSchoolForProfile] =
    useState<JapanesePartnerSchool | null>(null);
  const [selectedAgentForProfile, setSelectedAgentForProfile] = useState<B2bAgent | null>(null);
  const [activeTab, setActiveTab] = useState<DashboardTabId>("overview");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [storeSubTab, setStoreSubTab] = useState<
    "summary" | "products" | "orders" | "blog" | "categories" | "reviews" | "uploads"
  >("summary");

  // Finance Sub Tabs, Search & Filter states
  const [financeSubTab, setFinanceSubTab] = useState<"overview" | "ledger" | "dues" | "investor">("overview");
  const [financeFilterCategory, setFinanceFilterCategory] = useState<"ALL" | "INCOME" | "EXPENSE">("ALL");
  const [financeSearchQuery, setFinanceSearchQuery] = useState("");
  const [selectedTxForReceipt, setSelectedTxForReceipt] = useState<FinancialTransaction | null>(null);

  // CRM Search, Filter, Bulk Selection & Import/Export states
  const [crmImportExportMode, setCrmImportExportMode] = useState<"IMPORT" | "EXPORT" | null>(null);
  const [crmSearchQuery, setCrmSearchQuery] = useState("");
  const [crmStatusFilter, setCrmStatusFilter] = useState<"ALL" | LeadStatus | "FOLLOWUP_DUE">("ALL");
  const [crmPriorityFilter, setCrmPriorityFilter] = useState<"ALL" | LeadPriority>("ALL");
  const [crmSourceFilter, setCrmSourceFilter] = useState<"ALL" | LeadSource>("ALL");
  const [crmCounselorFilter, setCrmCounselorFilter] = useState<string>("ALL");
  const [selectedCrmLeadIds, setSelectedCrmLeadIds] = useState<string[]>([]);

  // Clean Custom Modals State (Replaces all ugly browser prompts)
  const [activeModal, setActiveModal] = useState<ActiveModalType>(null);
  const [editingB2bAgent, setEditingB2bAgent] = useState<B2bAgent | null>(null);
  const [editingPartnerSchool, setEditingPartnerSchool] = useState<JapanesePartnerSchool | null>(null);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

  // Form states for Quick Add Lead
  const [leadForm, setLeadForm] = useState({
    name: "",
    phone: "",
    city: "Dhaka",
    source: "WHATSAPP_DIRECT" as LeadSource,
    interest: "STUDENT_VISA_REGULAR" as ServiceInterest,
    education: "HSC Passed",
    japaneseProficiency: "LEARNING_N5" as CrmLead["japaneseProficiency"],
    studyGapYears: 1,
    notes: "",
    assignedCounselorId: "",
    referredByAgentId: "",
    targetSchoolId: "",
  });

  // Form states for Issue LMS Account
  const [lmsForm, setLmsForm] = useState({
    studentName: "",
    phone: "",
    courseLevel: "N5" as "N5" | "N4" | "IRODORI",
    activeBatch: "N5 Intensive Batch (Dhaka HQ)",
    portalUsername: "",
    portalPasswordMasked: "N5@knltc2026",
    assignedSenseiId: "",
    linkedLeadId: "",
  });

  // Form states for Partner School / University
  const [schoolForm, setSchoolForm] = useState({
    name: "",
    japaneseName: "",
    institutionType: "LANGUAGE_SCHOOL" as PartnerInstitutionType,
    logoUrl: "",
    websiteUrl: "",
    location: "Tokyo",
    contactPerson: "",
    email: "",
    firstYearTuitionYen: 760000,
    commissionPerStudentYen: 0,
    commissionPerStudentBdt: 0,
    intakeQuota: 20,
    activeStudentsCount: 0,
    totalCommissionReceivedYen: 0,
    status: "ACTIVE_PARTNER" as JapanesePartnerSchool["status"],
  });

  // Form states for B2B Agent
  const [b2bForm, setB2bForm] = useState({
    organizationName: "",
    agentType: "LOCAL_SUB_AGENT" as B2bAgent["agentType"],
    logoUrl: "",
    tradeLicenseNo: "",
    nidOrPassportNo: "",
    contactPerson: "",
    phone: "",
    city: "Dhaka",
    referredStudentsCount: 0,
    successfulVisasCount: 0,
    agreedCommissionBdt: 30000,
    paidCommissionBdt: 0,
    pendingCommissionBdt: 0,
  });

  // Form states for HR Staff Member (Role-specific KPIs)
  const [staffForm, setStaffForm] = useState({
    name: "",
    role: "TELE_COUNSELOR" as StaffMember["role"],
    location: "DHAKA_OFFICE" as StaffMember["location"],
    phone: "",
    email: "",
    monthlyBaseSalaryBdt: 18000,
    kpiType: "CALLS" as NonNullable<StaffMember["kpiType"]>,
    kpiTarget: 500,
    kpiAchieved: 0,
    callsTargetMonthly: 500,
    callsCompleted: 0,
    admissionsTarget: 10,
    admissionsAchieved: 0,
    performanceBonusBdt: 0,
    status: "ACTIVE" as StaffMember["status"],
  });

  // Form states for Finance Payment (Income)
  const [paymentForm, setPaymentForm] = useState({
    linkedLeadId: "",
    studentName: "",
    studentPhone: "",
    type: "SERVICE_CHARGE_COE" as FinancialTransaction["type"],
    amountBdt: 120000,
    paymentMethod: "BKASH" as FinancialTransaction["paymentMethod"],
    referenceOrTrx: "",
    branch: "DHK-HQ" as "DHK-HQ" | "KHULNA-01",
    notes: "",
  });

  // Form states for Finance Expense (Outflow)
  const [expenseForm, setExpenseForm] = useState({
    title: "",
    type: "EXPENSE_RENT" as FinancialTransaction["type"],
    amountBdt: 35000,
    paymentMethod: "BANK_TRANSFER" as FinancialTransaction["paymentMethod"],
    referenceOrTrx: "",
    branch: "DHK-HQ" as "DHK-HQ" | "KHULNA-01",
    notes: "",
  });

  // Form states for CMS Job Circular
  const [circularForm, setCircularForm] = useState({
    title: "",
    category: "SSW_CONSTRUCTION" as JobCircular["category"],
    salaryYen: "¥180,000 – ¥230,000 / মাস",
    salaryBdtEquivalent: "৳ ১,৪৫,০০০ – ৳ ১,৮৫,০০০",
    locationJapan: "Tokyo, Osaka",
    openings: 10,
    requirements: "JLPT N4 বা JFT-Basic + স্কিল টেস্ট পাস",
    specialBenefitsBn: "ফ্রি ডরমেটরি ও প্র্যাকটিক্যাল স্কিল ট্রেনিং সুবিধা",
    deadline: "2027-03-30",
  });

  const [adminBundle, setAdminBundle] = useState<{
    loaded: boolean;
    summary: AdminSummary | null;
    products: DbProduct[];
    posts: BlogPost[];
    categories: Category[];
    orders: DbOrder[];
    ordersWarning: string | null;
    reviews: DbReview[];
    crmLeads: DbCrmLead[];
  }>({
    loaded: false,
    summary: null,
    products: [],
    posts: [],
    categories: [],
    orders: [],
    ordersWarning: null,
    reviews: [],
    crmLeads: [],
  });

  const t: DashboardDictionary = useMemo(() => getDashboardDictionary(language), [language]);

  // Trilingual localization helper for Dashboard
  const tr = (bn: string, en: string, ja?: string): string => {
    if (language === "ja") return ja || en;
    if (language === "en") return en;
    return bn;
  };

  // Sleek Animated Toast Notification State
  const [toastState, setToastState] = useState<{
    id: number;
    title: string;
    subtitle?: string;
  } | null>(null);

  const showToast = (msg: string, subtitle?: string) => {
    setToastState({
      id: Date.now(),
      title: msg,
      subtitle:
        subtitle ||
        (language === "ja"
          ? "リアルタイムで保存・同期されました"
          : language === "en"
            ? "Saved & synced in real-time"
            : "রিয়েল-টাইমে ডাটাবেজে সংরক্ষিত হয়েছে"),
    });
  };

  useEffect(() => {
    if (!toastState) return;
    const timer = setTimeout(() => setToastState(null), 3800);
    return () => clearTimeout(timer);
  }, [toastState]);

  const loadAdminBundle = async () => {
    try {
      const res = await fetch("/api/admin/bundle", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      if (data?.ok) {
        setAdminBundle({
          loaded: true,
          summary: data.summary ?? null,
          products: data.products ?? [],
          posts: data.posts ?? [],
          categories: data.categories ?? [],
          orders: data.orders ?? [],
          ordersWarning: data.ordersWarning ?? null,
          reviews: data.reviews ?? [],
          crmLeads: data.crmLeads ?? [],
        });
      }
    } catch {
      // ignore bundle error
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      const subParam = params.get("sub");
      if (
        tabParam &&
        [
          "my_profile",
          "overview",
          "crm",
          "visa",
          "lms",
          "b2b",
          "finance",
          "hr",
          "cms",
          "store_blog",
          "users",
        ].includes(tabParam)
      ) {
        setActiveTab(tabParam as DashboardTabId);
      }
      if (
        subParam &&
        ["summary", "products", "orders", "blog", "categories", "reviews", "uploads"].includes(subParam)
      ) {
        setStoreSubTab(subParam as any);
      }
    }

    fetch("/api/admin/me")
      .then((res) => {
        if (!res.ok) {
          window.location.href = "/admin/login?next=/dashboard";
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.authenticated && data?.user) {
          const allLocalAccounts = getSystemAccounts();
          const matchedLocal = allLocalAccounts.find(
            (a) => a.email.toLowerCase() === String(data.user.email || "").toLowerCase(),
          );
          const resolvedAllowedTabs: DashboardTabId[] | undefined =
            matchedLocal?.allowedTabs || data.user.allowedTabs;
          const resolvedLinkedLeadId: string | undefined =
            matchedLocal?.linkedLeadId || data.user.linkedLeadId;
          const resolvedRole: UserRole = matchedLocal?.role || data.user.role;

          setCurrentUser({
            ...data.user,
            role: resolvedRole,
            allowedTabs: resolvedAllowedTabs,
            linkedLeadId: resolvedLinkedLeadId,
          });
          setActiveRole(resolvedRole);
          if (data.user.branch && data.user.branch !== "ALL") {
            setActiveBranch(data.user.branch);
          }
          const hasExplicitTab =
            typeof window !== "undefined" && new URLSearchParams(window.location.search).has("tab");
          if (!hasExplicitTab) {
            if (resolvedRole === "STUDENT" || resolvedAllowedTabs?.includes("my_profile")) {
              setActiveTab("my_profile");
            } else if (resolvedAllowedTabs && resolvedAllowedTabs.length > 0) {
              setActiveTab(resolvedAllowedTabs[0]);
            } else if (resolvedRole === "TELE_COUNSELOR") {
              setActiveTab("crm");
            } else if (resolvedRole === "TEACHER") {
              setActiveTab("lms");
            }
          }
        }
      })
      .catch(() => {});

    setIsSyncingWithDb(true);
    fetch("/api/sheets?action=status")
      .then((r) => r.json())
      .then((st) => {
        if (st?.ok) {
          setSheetsStatus({
            connected: Boolean(st.connected),
            mode: st.mode || "LOCAL_SEED_FALLBACK",
            masterSheetUrl: st.masterSheetUrl || "https://docs.google.com/spreadsheets",
          });
        }
      })
      .catch(() => {});

    Promise.all([fetchLiveStoreFromServer(), loadAdminBundle()])
      .then(([live]) => {
        if (live) {
          setStore({ ...live });
        } else {
          setStore({ ...getCmsStore() });
        }
      })
      .finally(() => setIsSyncingWithDb(false));

    const sync = () => {
      setStore({ ...getCmsStore() });
    };

    window.addEventListener("knltc-cms-updated", sync);
    return () => window.removeEventListener("knltc-cms-updated", sync);
  }, []);

  const handleManualSync = async () => {
    setIsSyncingWithDb(true);
    showToast(
      language === "ja"
        ? "Googleスプレッドシートのキャッシュを更新中..."
        : language === "en"
          ? "Refreshing Google Sheets cache..."
          : "গুগল শিট ডাটাবেজ ক্যাশ রিফ্রেশ হচ্ছে...",
    );
    try {
      await fetch("/api/sheets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "REFRESH_CACHE" }),
      });
      const [live] = await Promise.all([fetchLiveStoreFromServer(), loadAdminBundle()]);
      if (live) setStore({ ...live });
      showToast(
        language === "ja"
          ? "Googleスプレッドシートとの同期が完了しました"
          : language === "en"
            ? "Google Sheets cache refreshed & synced"
            : "গুগল শিট ক্যাশ রিফ্রেশ ও সিঙ্ক সফল হয়েছে",
      );
    } catch {
      showToast(
        language === "ja"
          ? "ローカルキャッシュを使用中"
          : language === "en"
            ? "Using local cache"
            : "লোকাল ক্যাশ ব্যবহার করা হচ্ছে",
      );
    } finally {
      setIsSyncingWithDb(false);
    }
  };

  const handlePushInitialDataToSheets = async () => {
    setIsPushingToSheets(true);
    showToast(
      language === "ja"
        ? "全15テーブルをGoogleスプレッドシートへ一括送信中..."
        : language === "en"
          ? "Pushing all 15 tables to Master Google Sheet..."
          : "১৫টি টেবিলের সব ডাটা মাস্টার গুগল শিটে পুশ হচ্ছে...",
    );
    try {
      const currentStore = store || getCmsStore();
      const res = await fetch("/api/sheets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "BULK_SYNC",
          store: currentStore,
          replaceAll: false,
        }),
      });
      const json = await res.json();
      if (json?.ok) {
        showToast(
          language === "ja"
            ? "全15タブのデータをGoogleスプレッドシートへ同期しました！"
            : language === "en"
              ? "All 15 tables synced to Master Google Sheet!"
              : "১৫টি ট্যাবের সব ডাটা মাস্টার গুগল শিটে সফলভাবে সিঙ্ক হয়েছে!",
        );
      }
    } catch {
      showToast(
        language === "ja"
          ? "同期エラーが発生しました"
          : language === "en"
            ? "Saved to local fallback store"
            : "লোকাল স্টোরে সংরক্ষিত হয়েছে",
      );
    } finally {
      setIsPushingToSheets(false);
    }
  };

  const handlePurgeDummyData = async () => {
    if (
      !window.confirm(
        language === "ja"
          ? "ダミーデータ（リード・ビザ申請・取引・注文）を完全に削除しますか？"
          : language === "en"
            ? "Are you sure you want to permanently purge all dummy/test data (leads, visas, transactions, orders)?"
            : "আপনি কি নিশ্চিত যে সমস্ত ডামি ও টেস্ট ডাটা (লিড, ভিসা ট্র্যাকিং, লেনদেন, অর্ডার) স্থায়ীভাবে মুছে ফেলতে চান?"
      )
    ) {
      return;
    }

    setIsSyncingWithDb(true);
    showToast(tr("ডামি ডাটা মুছে ফেলা হচ্ছে...", "Purging dummy data...", "ダミーデータを削除中..."));
    try {
      // 1. Purge locally in browser
      const cleanStore = purgeStoreOfDummyData();
      setStore({ ...cleanStore });
      setAdminBundle((prev) => ({
        ...prev,
        products: [],
        posts: [],
        categories: [],
        orders: [],
        reviews: [],
        crmLeads: [],
        summary: prev.summary
          ? {
              ...prev.summary,
              totalProducts: 0,
              totalBlogPosts: 0,
              totalDrafts: 0,
              totalPublished: 0,
              pendingOrders: 0,
              pendingReviews: 0,
              newLeads: 0,
              lowStockProducts: 0,
            }
          : null,
      }));

      // 2. Purge on Next.js server & Sheets backend
      await Promise.allSettled([
        fetch("/api/sheets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "PURGE_DUMMY_DATA" }),
        }),
        fetch("/api/cms/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "PURGE_ALL_DUMMY", entity: "PURGE_ALL_DUMMY" }),
        }),
      ]);

      showToast(
        tr(
          "সব ডামি ডাটা সফলভাবে মুছে ফেলা হয়েছে!",
          "All dummy data purged successfully!",
          "すべてのダミーデータが正常に削除されました"
        )
      );
    } catch {
      showToast(tr("লোকাল ডামি ডাটা মুছে ফেলা হয়েছে", "Local dummy data purged", "ローカルのダミーデータが削除されました"));
    } finally {
      setIsSyncingWithDb(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {
      // ignore
    }
    window.location.href = "/admin/login";
  };

  const branchLeads = useMemo(() => {
    if (!store) return [];
    return store.crmLeads.filter((l) => {
      if (activeBranch === "ALL") return true;
      return l.branch === activeBranch;
    });
  }, [store, activeBranch]);

  const filteredLeads = useMemo(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    return branchLeads.filter((l) => {
      // Status filter
      if (crmStatusFilter === "FOLLOWUP_DUE") {
        if (!l.followUpDate || l.followUpDate > todayStr || l.status === "ARCHIVED") {
          return false;
        }
      } else if (crmStatusFilter !== "ALL" && l.status !== crmStatusFilter) {
        return false;
      }

      // Priority filter
      const resolvedPrio = l.priority || (l.status === "ADMITTED" ? "HOT" : "WARM");
      if (crmPriorityFilter !== "ALL" && resolvedPrio !== crmPriorityFilter) {
        return false;
      }

      // Source filter
      if (crmSourceFilter !== "ALL" && l.source !== crmSourceFilter) {
        return false;
      }

      // Counselor filter
      if (crmCounselorFilter !== "ALL" && l.assignedTo !== crmCounselorFilter) {
        return false;
      }

      // Search query
      if (crmSearchQuery.trim()) {
        const q = crmSearchQuery.trim().toLowerCase();
        const haystack = [
          l.name,
          l.phone,
          l.whatsapp,
          l.email,
          l.city,
          l.passportNo,
          l.fileTrackingNo,
          l.id,
          l.education,
          l.assignedTo,
          l.targetSchoolName || l.targetSchool,
          l.referredByAgentName || l.b2bAgentName,
          ...(l.customTags || []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      return true;
    });
  }, [
    branchLeads,
    crmStatusFilter,
    crmPriorityFilter,
    crmSourceFilter,
    crmCounselorFilter,
    crmSearchQuery,
  ]);

  const filteredVisaApplicants = useMemo(() => {
    if (!store) return [];
    return store.visaApplicants.filter((v) => {
      if (activeBranch === "ALL") return true;
      return v.branch === activeBranch;
    });
  }, [store, activeBranch]);

  if (!store) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
          <RefreshCw className="h-5 w-5 animate-spin text-[#b91c1c]" />
          <span className="font-semibold text-sm">{t.loading}</span>
        </div>
      </div>
    );
  }

  const rawCms = store.websiteCms?.[0] || DEFAULT_WEBSITE_CMS;
  const cms: WebsiteCmsContent = {
    ...DEFAULT_WEBSITE_CMS,
    ...rawCms,
    topAnnouncementBar: {
      ...DEFAULT_WEBSITE_CMS.topAnnouncementBar,
      ...(rawCms.topAnnouncementBar || {}),
      text: {
        ...DEFAULT_WEBSITE_CMS.topAnnouncementBar.text,
        ...(rawCms.topAnnouncementBar?.text || {}),
      },
    },
    popupBanner: {
      ...DEFAULT_WEBSITE_CMS.popupBanner,
      ...(rawCms.popupBanner || {}),
      headline: {
        ...DEFAULT_WEBSITE_CMS.popupBanner.headline,
        ...(rawCms.popupBanner?.headline || {}),
      },
    },
    heroSection: {
      ...DEFAULT_WEBSITE_CMS.heroSection,
      ...(rawCms.heroSection || {}),
      headline: {
        ...DEFAULT_WEBSITE_CMS.heroSection.headline,
        ...(rawCms.heroSection?.headline || {}),
      },
    },
    languageCoursePage: {
      ...DEFAULT_WEBSITE_CMS.languageCoursePage,
      ...(rawCms.languageCoursePage || {}),
    },
    studyInJapanPage: {
      ...DEFAULT_WEBSITE_CMS.studyInJapanPage,
      ...(rawCms.studyInJapanPage || {}),
    },
    jobCirculars:
      Array.isArray(rawCms.jobCirculars) && rawCms.jobCirculars.length > 0
        ? rawCms.jobCirculars
        : DEFAULT_WEBSITE_CMS.jobCirculars,
  };

  const allNavItems = [
    {
      id: "my_profile",
      group: language === "bn" ? "ব্যক্তিগত" : language === "ja" ? "個人" : "Personal",
      label:
        language === "ja"
          ? "マイプロフィール"
          : language === "en"
            ? "My Profile & File"
            : "আমার প্রোফাইল ও ফাইল",
      icon: UserCheck,
      badge: 0,
    },
    {
      id: "overview",
      group: language === "bn" ? "ড্যাশবোর্ড" : language === "ja" ? "概要" : "Workspace",
      label: t.tabs.overview,
      icon: LayoutDashboard,
      badge: 0,
    },
    {
      id: "crm",
      group: language === "bn" ? "অপারেশনস" : language === "ja" ? "業務管理" : "Operations",
      label: t.tabs.crm,
      icon: PhoneCall,
      badge: adminBundle.summary?.newLeads || 0,
    },
    {
      id: "visa",
      group: language === "bn" ? "অপারেশনস" : language === "ja" ? "業務管理" : "Operations",
      label: t.tabs.visa,
      icon: FileCheck2,
      badge: 0,
    },
    {
      id: "b2b",
      group: language === "bn" ? "অপারেশনস" : language === "ja" ? "業務管理" : "Operations",
      label: t.tabs.b2b,
      icon: Building2,
      badge: 0,
    },
    {
      id: "lms",
      group: language === "bn" ? "একাডেমি" : language === "ja" ? "アカデミー" : "Academy",
      label: t.tabs.lms,
      icon: GraduationCap,
      badge: 0,
    },
    {
      id: "finance",
      group: language === "bn" ? "ফাইন্যান্স ও টিম" : language === "ja" ? "財務・人事" : "Finance & Team",
      label: t.tabs.finance,
      icon: DollarSign,
      badge: 0,
    },
    {
      id: "hr",
      group: language === "bn" ? "ফাইন্যান্স ও টিম" : language === "ja" ? "財務・人事" : "Finance & Team",
      label: t.tabs.hr,
      icon: Users,
      badge: 0,
    },
    {
      id: "store_blog",
      group: language === "bn" ? "কনটেন্ট ও স্টোর" : language === "ja" ? "ストア・CMS" : "Content & Store",
      label: t.tabs.storeBlog,
      icon: ShoppingBag,
      badge:
        (adminBundle.summary?.pendingOrders || 0) +
        (adminBundle.summary?.pendingReviews || 0) +
        (adminBundle.summary?.lowStockProducts || 0),
    },
    {
      id: "cms",
      group: language === "bn" ? "কনটেন্ট ও স্টোর" : language === "ja" ? "ストア・CMS" : "Content & Store",
      label: t.tabs.cms,
      icon: Globe2,
      badge: 0,
    },
    {
      id: "users",
      group: language === "bn" ? "কনটেন্ট ও স্টোর" : language === "ja" ? "ストア・CMS" : "Content & Store",
      label:
        language === "ja"
          ? "権限・アクセス管理"
          : language === "en"
            ? "Access Control"
            : "অ্যাক্সেস কন্ট্রোল",
      icon: KeyRound,
      badge: 0,
    },
  ].filter((tab) => {
    if (!currentUser || activeRole === "MAIN_ADMIN") {
      return tab.id !== "my_profile";
    }
    if (currentUser.allowedTabs && currentUser.allowedTabs.length > 0) {
      return currentUser.allowedTabs.includes(tab.id as DashboardTabId);
    }
    if (activeRole === "STUDENT") return ["my_profile", "visa", "lms"].includes(tab.id);
    if (activeRole === "TELE_COUNSELOR") return ["overview", "crm", "visa", "lms"].includes(tab.id);
    if (activeRole === "TEACHER") return ["overview", "lms", "visa"].includes(tab.id);
    if (activeRole === "B2B_AGENT") return ["overview", "b2b", "visa"].includes(tab.id);
    if (activeRole === "INVESTOR") return ["overview", "finance", "b2b"].includes(tab.id);
    return tab.id !== "users" && tab.id !== "my_profile";
  });

  const groupedNavItems = allNavItems.reduce<Record<string, typeof allNavItems>>((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {});

  const currentTabInfo = allNavItems.find((item) => item.id === activeTab) || allNavItems[0];

  // Open B2B Agent Modal (for Add or Edit)
  const openB2bAgentModal = (agent?: B2bAgent) => {
    if (agent) {
      setEditingB2bAgent(agent);
      setB2bForm({
        organizationName: agent.organizationName,
        agentType: agent.agentType,
        logoUrl: agent.logoUrl || "",
        tradeLicenseNo: agent.tradeLicenseNo || "",
        nidOrPassportNo: agent.nidOrPassportNo || "",
        contactPerson: agent.contactPerson,
        phone: agent.phone,
        city: agent.city,
        referredStudentsCount: agent.referredStudentsCount,
        successfulVisasCount: agent.successfulVisasCount,
        agreedCommissionBdt: agent.agreedCommissionBdt,
        paidCommissionBdt: agent.paidCommissionBdt,
        pendingCommissionBdt: agent.pendingCommissionBdt,
      });
    } else {
      setEditingB2bAgent(null);
      setB2bForm({
        organizationName: "",
        agentType: "LOCAL_SUB_AGENT",
        logoUrl: "",
        tradeLicenseNo: "",
        nidOrPassportNo: "",
        contactPerson: "",
        phone: "017",
        city: "Dhaka",
        referredStudentsCount: 0,
        successfulVisasCount: 0,
        agreedCommissionBdt: 30000,
        paidCommissionBdt: 0,
        pendingCommissionBdt: 0,
      });
    }
    setActiveModal("ADD_B2B_AGENT");
  };

  // Open Partner School Modal (for Add or Edit)
  const openPartnerSchoolModal = (school?: JapanesePartnerSchool) => {
    if (school) {
      setEditingPartnerSchool(school);
      setSchoolForm({
        name: school.name,
        japaneseName: school.japaneseName,
        institutionType: school.institutionType || "LANGUAGE_SCHOOL",
        logoUrl: school.logoUrl || "",
        websiteUrl: school.websiteUrl || "",
        location: school.location,
        contactPerson: school.contactPerson,
        email: school.email,
        firstYearTuitionYen: school.firstYearTuitionYen ?? 760000,
        commissionPerStudentYen: school.commissionPerStudentYen,
        commissionPerStudentBdt: school.commissionPerStudentBdt,
        intakeQuota: school.intakeQuota || 20,
        activeStudentsCount: school.activeStudentsCount,
        totalCommissionReceivedYen: school.totalCommissionReceivedYen,
        status: school.status,
      });
    } else {
      setEditingPartnerSchool(null);
      setSchoolForm({
        name: "",
        japaneseName: "",
        institutionType: "LANGUAGE_SCHOOL",
        logoUrl: "",
        websiteUrl: "",
        location: "Tokyo",
        contactPerson: "",
        email: "",
        firstYearTuitionYen: 760000,
        commissionPerStudentYen: 0,
        commissionPerStudentBdt: 0,
        intakeQuota: 20,
        activeStudentsCount: 0,
        totalCommissionReceivedYen: 0,
        status: "ACTIVE_PARTNER",
      });
    }
    setActiveModal("ADD_PARTNER_SCHOOL");
  };

  // Helper to open payment collection pre-filled for a specific student
  const openStudentPaymentModal = (lead: CrmLead) => {
    const due = Math.max(0, (lead.contractAmountBdt || 120000) - (lead.paidAmountBdt || 0));
    setPaymentForm({
      linkedLeadId: lead.id,
      studentName: lead.name,
      studentPhone: lead.phone,
      type:
        lead.interest === "STUDENT_VISA_PREMIUM"
          ? "PREMIUM_PACKAGE"
          : lead.interest === "JAPANESE_N5" || lead.interest === "JAPANESE_N4"
            ? "COURSE_FEE"
            : "SERVICE_CHARGE_COE",
      amountBdt: due > 0 ? due : 12000,
      paymentMethod: "BKASH",
      referenceOrTrx: "",
      branch: lead.branch || "DHK-HQ",
      notes: `${lead.name} — কিস্তি / বকেয়া পরিশোধ`,
    });
    setActiveModal("ADD_PAYMENT");
  };

  // Open HR Staff Modal (for Add or Edit)
  const openStaffModal = (staff?: StaffMember) => {
    if (staff) {
      setEditingStaff(staff);
      const inferredKpiType: NonNullable<StaffMember["kpiType"]> =
        staff.kpiType ||
        (staff.role === "TELE_COUNSELOR" || staff.role === "COUNSELOR"
          ? "CALLS"
          : staff.role === "SENIOR_SENSEI"
            ? "CLASSES"
            : staff.role === "VISA_OFFICER"
              ? "VISA_FILES"
              : "SALARIED_FIXED");

      setStaffForm({
        name: staff.name,
        role: staff.role,
        location: staff.location,
        phone: staff.phone,
        email: staff.email,
        monthlyBaseSalaryBdt: staff.monthlyBaseSalaryBdt,
        kpiType: inferredKpiType,
        kpiTarget:
          staff.kpiTarget ??
          (inferredKpiType === "CALLS"
            ? staff.callsTargetMonthly || 500
            : inferredKpiType === "CLASSES"
              ? 24
              : inferredKpiType === "VISA_FILES"
                ? 15
                : 0),
        kpiAchieved:
          staff.kpiAchieved ??
          (inferredKpiType === "CALLS" ? staff.callsCompleted || 0 : 0),
        callsTargetMonthly: staff.callsTargetMonthly || 0,
        callsCompleted: staff.callsCompleted || 0,
        admissionsTarget: staff.admissionsTarget || 0,
        admissionsAchieved: staff.admissionsAchieved || 0,
        performanceBonusBdt: staff.performanceBonusBdt || 0,
        status: staff.status || "ACTIVE",
      });
    } else {
      setEditingStaff(null);
      setStaffForm({
        name: "",
        role: "TELE_COUNSELOR",
        location: "DHAKA_OFFICE",
        phone: "017",
        email: "",
        monthlyBaseSalaryBdt: 18000,
        kpiType: "CALLS",
        kpiTarget: 500,
        kpiAchieved: 0,
        callsTargetMonthly: 500,
        callsCompleted: 0,
        admissionsTarget: 10,
        admissionsAchieved: 0,
        performanceBonusBdt: 0,
        status: "ACTIVE",
      });
    }
    setActiveModal("ADD_STAFF");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex flex-col lg:flex-row">
      {/* =========================================================================
          SLEEK FLOATING TOAST NOTIFICATION (Replaces basic unstyled bar)
          ========================================================================= */}
      <AnimatePresence>
        {toastState && (
          <motion.div
            key={toastState.id}
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 420, damping: 28 }}
            className="fixed bottom-6 right-6 z-[100] w-[calc(100vw-3rem)] max-w-sm overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 backdrop-blur-xl p-4 shadow-2xl"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-200/70 text-emerald-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                  {toastState.title}
                </p>
                {toastState.subtitle && (
                  <p className="mt-0.5 text-[11px] font-medium text-slate-500 truncate">
                    {toastState.subtitle}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setToastState(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                aria-label="Close notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <motion.div
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 3.6, ease: "linear" }}
              style={{ transformOrigin: "left" }}
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#b91c1c] to-emerald-600"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Sidebar Backdrop */}
      <AnimatePresence>
        {mobileNavOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-xs lg:hidden"
            onClick={() => setMobileNavOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* =========================================================================
          MINIMAL LEFT SIDEBAR NAVIGATION
          ========================================================================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 shrink-0 border-r border-slate-200/80 bg-white flex flex-col justify-between transition-transform duration-200 lg:static lg:translate-x-0 ${
          mobileNavOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Clean Brand Header */}
          <div className="h-16 px-5 border-b border-slate-100 flex items-center justify-between gap-2">
            <Link href="/" className="flex items-center gap-2.5 min-w-0 group">
              <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-xl bg-white border border-slate-200/90 p-0.5 flex items-center justify-center">
                <Image
                  src="/brand/knltc-logo.svg"
                  alt="KNLTC Logo"
                  width={32}
                  height={32}
                  priority
                  referrerPolicy="no-referrer"
                  className="object-contain transition-transform duration-200 group-hover:scale-105"
                />
              </div>
              <div className="min-w-0">
                <span className="block font-bold text-sm tracking-tight text-slate-900 leading-none">
                  KNLTC
                </span>
                <span className="block text-[11px] text-slate-400 mt-1 truncate leading-none">
                  Workspace Portal
                </span>
              </div>
            </Link>

            <button
              type="button"
              onClick={() => setMobileNavOpen(false)}
              className="lg:hidden rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-900"
              aria-label="Close sidebar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Minimal Grouped Navigation */}
          <nav className="p-3 space-y-5 overflow-y-auto max-h-[calc(100vh-12rem)]">
            {Object.entries(groupedNavItems).map(([groupTitle, items]) => (
              <div key={groupTitle}>
                <div className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  {groupTitle}
                </div>
                <div className="space-y-0.5">
                  {items.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => {
                          setActiveTab(tab.id as DashboardTabId);
                          setMobileNavOpen(false);
                        }}
                        className={`relative w-full flex items-center justify-between gap-2.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors text-left ${
                          isActive
                            ? "text-white font-semibold"
                            : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                        }`}
                      >
                        {isActive && (
                          <motion.span
                            layoutId="sidebarActivePill"
                            className="absolute inset-0 rounded-xl bg-slate-900 -z-0"
                            transition={{ type: "spring", stiffness: 380, damping: 32 }}
                          />
                        )}
                        <div className="relative z-10 flex items-center gap-2.5 min-w-0">
                          <Icon
                            className={`h-4 w-4 shrink-0 ${
                              isActive ? "text-red-400" : "text-slate-400"
                            }`}
                          />
                          <span className="truncate">{tab.label}</span>
                        </div>
                        {tab.badge > 0 ? (
                          <span
                            className={`relative z-10 inline-flex min-w-4.5 items-center justify-center rounded-full px-1.5 py-0.2 text-[10px] font-bold tabular-nums ${
                              isActive
                                ? "bg-[#b91c1c] text-white"
                                : "bg-red-50 text-[#b91c1c]"
                            }`}
                          >
                            {tab.badge}
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Minimal Bottom User Bar */}
        <div className="p-3 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between gap-2 px-2 py-1.5">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-900 truncate">
                {currentUser?.name ||
                  (language === "ja"
                    ? "シェイク・バセット"
                    : language === "en"
                      ? "Sheikh Baset"
                      : "শেখ বাসেত")}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-medium text-slate-400 truncate">
                  {activeRole}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              title={language === "ja" ? "ログアウト" : language === "en" ? "Sign Out" : "লগআউট"}
              className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-[#b91c1c] transition"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* =========================================================================
          RIGHT WORKSPACE AREA
          ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Clean Minimal Top Bar */}
        <header className="sticky top-0 z-30 h-16 border-b border-slate-200/80 bg-white/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              className="lg:hidden inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white p-2 text-slate-700 hover:bg-slate-100"
              aria-label="Open menu"
            >
              <Menu className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs font-medium text-slate-400 hidden sm:inline">
                {currentTabInfo?.group}
              </span>
              <ChevronRight className="h-3.5 w-3.5 text-slate-300 hidden sm:inline" />
              <h2 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                {currentTabInfo?.label}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Minimal Branch Filter */}
            <div className="hidden md:flex items-center rounded-xl bg-slate-100/80 p-0.5 border border-slate-200/70">
              {!currentUser || currentUser.role === "MAIN_ADMIN" || currentUser.branch === "ALL" ? (
                <>
                  {(
                    [
                      { id: "ALL", label: t.allBranches },
                      { id: "DHK-HQ", label: t.dhakaHq },
                      { id: "KHULNA-01", label: t.khulnaBranch },
                    ] as const
                  ).map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setActiveBranch(b.id)}
                      className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition ${
                        activeBranch === b.id
                          ? "bg-white text-slate-900 font-semibold shadow-2xs"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </>
              ) : (
                <span className="rounded-lg bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-900">
                  {activeBranch === "DHK-HQ" ? t.dhakaHq : t.khulnaBranch}
                </span>
              )}
            </div>

            {/* Cloud Sync */}
            <button
              type="button"
              onClick={handleManualSync}
              disabled={isSyncingWithDb}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
              title="Sync Database"
            >
              <Database
                className={`h-3.5 w-3.5 text-emerald-600 ${isSyncingWithDb ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">
                {isSyncingWithDb
                  ? language === "ja"
                    ? "同期中"
                    : language === "en"
                      ? "Syncing"
                      : "সিঙ্ক হচ্ছে"
                  : language === "ja"
                    ? "同期"
                    : language === "en"
                      ? "Sync"
                      : "সিঙ্ক"}
              </span>
            </button>

            {/* Language Selector */}
            <div className="flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white px-2.5 py-1.5">
              <Globe className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <select
                aria-label={t.languageLabel}
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-transparent text-xs font-medium text-slate-700 focus:outline-hidden cursor-pointer"
              >
                {languageOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} className="text-slate-900 bg-white">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Public Website */}
            <Link
              href="/"
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200/80 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
            >
              <span className="hidden sm:inline">{t.publicWebsite}</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
            </Link>
          </div>
        </header>

        {/* Main Animated Workspace Viewport */}
        <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
          {/* =====================================================================
              GOOGLE SHEETS + GOOGLE DRIVE 1-CLICK CONNECTION & SYNC BAR
              ===================================================================== */}
          {(!currentUser || activeRole !== "STUDENT") && (
            <div className="mb-6 rounded-2xl border border-emerald-900/15 bg-gradient-to-r from-[#133e29] via-[#164a31] to-[#133e29] px-4 py-3 text-white shadow-sm">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 border border-white/15 text-emerald-300">
                    <FileSpreadsheet className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold tracking-tight text-white">
                        {tr(
                          "KNLTC মাস্টার গুগল শিট ও গুগল ড্রাইভ ব্যাকএন্ড (১৫টি টেবিল)",
                          "KNLTC Master Google Sheet & Drive Backend (15 Tables)",
                          "KNLTC マスターGoogleスプレッドシート＆ドライブ基盤（全15タブ）",
                        )}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          sheetsStatus.connected
                            ? "bg-emerald-400/20 text-emerald-200 border border-emerald-400/30"
                            : "bg-amber-400/20 text-amber-200 border border-amber-400/30"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            sheetsStatus.connected ? "bg-emerald-400" : "bg-amber-300"
                          }`}
                        />
                        {sheetsStatus.connected
                          ? tr("লাইভ সংযুক্ত", "Connected Live", "ライブ接続中")
                          : tr("রেডি (সিড ও লোকাল মিরর সক্রিয়)", "Ready (Seed & Mirror Active)", "準備完了（ローカルミラー有効）")}
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-100/80 mt-0.5 leading-relaxed">
                      {tr(
                        "১০০% ফ্রি গুগল শিট ডাটাবেজ ও গুগল ড্রাইভ ফাইল স্টোরেজ (KNLTC_Uploads_And_Visa_Docs) — কোনো পেইড ডাটাবেজ ছাড়াই সম্পূর্ণ সচল।",
                        "100% Free Google Sheets Database + Google Drive File Storage (KNLTC_Uploads_And_Visa_Docs) with 60s edge caching.",
                        "完全無料のGoogleスプレッドシートDB＋Googleドライブ証憑保管（KNLTC_Uploads_And_Visa_Docs）連携。",
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handlePushInitialDataToSheets}
                    disabled={isPushingToSheets}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-[#133e29] hover:bg-emerald-50 transition shadow-2xs disabled:opacity-60"
                  >
                    <Upload className={`h-3.5 w-3.5 ${isPushingToSheets ? "animate-bounce" : ""}`} />
                    <span>
                      {isPushingToSheets
                        ? tr("পুশ হচ্ছে...", "Pushing...", "送信中...")
                        : tr(
                            "Push Initial Data to Google Sheet",
                            "Push Initial Data to Google Sheet",
                            "初期データをシートへ一括送信",
                          )}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={handleManualSync}
                    disabled={isSyncingWithDb}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20 transition disabled:opacity-60"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${isSyncingWithDb ? "animate-spin" : ""}`} />
                    <span>
                      {tr("Refresh Cache", "Refresh Cache", "キャッシュ更新")}
                    </span>
                  </button>

                  <a
                    href={sheetsStatus.masterSheetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-400/30 bg-emerald-500/20 px-3 py-1.5 text-xs font-semibold text-emerald-100 hover:bg-emerald-500/30 transition"
                  >
                    <span>
                      {tr(
                        "Open Master Google Sheet",
                        "Open Master Google Sheet",
                        "マスターシートを開く",
                      )}
                    </span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>

                  <button
                    type="button"
                    onClick={handlePurgeDummyData}
                    disabled={isSyncingWithDb}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-red-400/40 bg-red-500/25 px-3 py-1.5 text-xs font-semibold text-red-100 hover:bg-red-500/40 transition disabled:opacity-60"
                    title={tr("সমস্ত ডামি ডেটা মুছে ফেলুন", "Purge all dummy test data", "ダミーデータを削除")}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-red-200" />
                    <span>{tr("ডামি ডাটা মুছুন", "Purge Dummy Data", "ダミー削除")}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* =========================================================================
                  MODULE 1: MINIMAL EXECUTIVE OVERVIEW
                  ========================================================================= */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Clean Header Banner */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                        {t.kpi.overviewTitle}
                      </h1>
                      <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        {t.kpi.overviewSub}
                      </p>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => setActiveModal("ADD_LEAD")}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#b91c1c] px-4 py-2.5 text-xs font-semibold text-white hover:bg-red-800 transition shadow-2xs"
                      >
                        <Plus className="h-4 w-4" />
                        <span>{t.kpi.addLeadBtn}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab("visa")}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                      >
                        <FileCheck2 className="h-4 w-4 text-slate-500" />
                        <span>{t.kpi.viewPipelineBtn}</span>
                      </button>
                    </div>
                  </div>

                  {/* 5 Minimal Single-Elevation KPI Cards */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    <div className="hover-spotlight rounded-2xl border border-slate-200/80 bg-white p-5">
                      <div className="flex items-center justify-between text-slate-400">
                        <span className="text-xs font-medium text-slate-500">{t.kpi.totalLeads}</span>
                        <Users className="h-4 w-4" />
                      </div>
                      <p className="mt-3 text-2xl font-bold text-slate-900 tabular-nums">
                        {filteredLeads.length}
                      </p>
                      <p className="mt-1 text-[11px] text-slate-400">{t.kpi.metaSubtitle}</p>
                    </div>

                    <div className="hover-spotlight rounded-2xl border border-slate-200/80 bg-white p-5">
                      <div className="flex items-center justify-between text-slate-400">
                        <span className="text-xs font-medium text-slate-500">{t.kpi.activeStudents}</span>
                        <GraduationCap className="h-4 w-4 text-emerald-600" />
                      </div>
                      <p className="mt-3 text-2xl font-bold text-slate-900 tabular-nums">
                        {store.lmsBridges.length}
                      </p>
                      <p className="mt-1 text-[11px] text-slate-400">{t.kpi.lmsSubtitle}</p>
                    </div>

                    <div className="hover-spotlight rounded-2xl border border-slate-200/80 bg-white p-5">
                      <div className="flex items-center justify-between text-slate-400">
                        <span className="text-xs font-medium text-slate-500">{t.kpi.inProcessVisas}</span>
                        <FileCheck2 className="h-4 w-4 text-[#b91c1c]" />
                      </div>
                      <p className="mt-3 text-2xl font-bold text-slate-900 tabular-nums">
                        {filteredVisaApplicants.length}
                      </p>
                      <p className="mt-1 text-[11px] text-slate-400">{t.kpi.aprilIntake}</p>
                    </div>

                    <div className="hover-spotlight rounded-2xl border border-slate-200/80 bg-white p-5">
                      <div className="flex items-center justify-between text-slate-400">
                        <span className="text-xs font-medium text-slate-500">{t.kpi.expectedCommission}</span>
                        <Building2 className="h-4 w-4" />
                      </div>
                      <p className="mt-3 text-2xl font-bold text-slate-900 tabular-nums">
                        ¥{store.partnerSchools.reduce(
                          (sum, s) =>
                            sum +
                            Math.max(
                              s.totalCommissionReceivedYen || 0,
                              (s.activeStudentsCount || 0) * (s.commissionPerStudentYen || 0),
                            ),
                          0,
                        ).toLocaleString()}
                      </p>
                      <p className="mt-1 text-[11px] text-slate-400">{t.kpi.yenCommissionSub}</p>
                    </div>

                    <div className="hover-spotlight rounded-2xl border border-slate-200/80 bg-white p-5">
                      <div className="flex items-center justify-between text-slate-400">
                        <span className="text-xs font-medium text-slate-500">{t.kpi.monthlyCashFlow}</span>
                        <DollarSign className="h-4 w-4 text-emerald-600" />
                      </div>
                      <p className="mt-3 text-2xl font-bold text-emerald-700 tabular-nums">
                        ৳{store.transactions.filter((tx) => tx.category !== "EXPENSE").reduce((sum, tx) => sum + tx.amountBdt, 0).toLocaleString()}
                      </p>
                      <p className="mt-1 text-[11px] text-slate-400">{t.kpi.marginSub}</p>
                    </div>
                  </div>

                  {/* Clean Chart & Quick Action Cards */}
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="hover-spotlight rounded-2xl border border-slate-200/80 bg-white p-6 lg:col-span-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-base font-bold text-slate-900">
                            {t.module1.chartTitle}
                          </h2>
                          <p className="text-xs text-slate-400 mt-0.5">{t.module1.chartSubtitle}</p>
                        </div>
                        <span className="text-xs font-semibold text-slate-500 tabular-nums">
                          {t.module1.fiscalYear}
                        </span>
                      </div>

                      <div className="mt-6 h-44 w-full">
                        <svg viewBox="0 0 600 170" className="h-full w-full overflow-visible">
                          <defs>
                            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#15803d" stopOpacity="0.14" />
                              <stop offset="100%" stopColor="#15803d" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>
                          <line x1="0" y1="30" x2="600" y2="30" stroke="#f1f5f9" />
                          <line x1="0" y1="80" x2="600" y2="80" stroke="#f1f5f9" />
                          <line x1="0" y1="130" x2="600" y2="130" stroke="#f1f5f9" />
                          <path
                            d="M 20 135 Q 120 115, 200 80 T 380 48 T 580 22 L 580 155 L 20 155 Z"
                            fill="url(#chartGrad)"
                          />
                          <path
                            d="M 20 135 Q 120 115, 200 80 T 380 48 T 580 22"
                            fill="none"
                            stroke="#15803d"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          />
                          {[
                            { cx: 20, cy: 135, val: "৳3.5L" },
                            { cx: 160, cy: 102, val: "৳6.2L" },
                            { cx: 300, cy: 70, val: "৳9.4L" },
                            { cx: 440, cy: 42, val: "৳12.4L" },
                            { cx: 580, cy: 22, val: "৳15.0L" },
                          ].map((pt, i) => (
                            <g key={i}>
                              <circle
                                cx={pt.cx}
                                cy={pt.cy}
                                r="4"
                                fill="#ffffff"
                                stroke="#15803d"
                                strokeWidth="2"
                              />
                              <text
                                x={pt.cx}
                                y={pt.cy - 10}
                                fontSize="10"
                                fontWeight="600"
                                textAnchor="middle"
                                fill="#475569"
                              >
                                {pt.val}
                              </text>
                            </g>
                          ))}
                        </svg>
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-4 border-t border-slate-100 pt-4 text-xs">
                        <div>
                          <span className="text-slate-400">{t.module1.grossProjection}</span>
                          <p className="text-sm font-bold text-slate-900 mt-0.5 tabular-nums">
                            ৳ {(store.transactions.filter((tx) => tx.category !== "EXPENSE").reduce((sum, tx) => sum + tx.amountBdt, 0) || (store.visaApplicants.length * 120000)).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <span className="text-slate-400">{t.module1.operationalCost}</span>
                          <p className="text-sm font-bold text-slate-900 mt-0.5 tabular-nums">
                            ৳ {(store.transactions.filter((tx) => tx.category === "EXPENSE").reduce((sum, tx) => sum + tx.amountBdt, 0) || (store.staffList.reduce((sum, st) => sum + st.monthlyBaseSalaryBdt, 0) * 3)).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <span className="text-slate-400">{t.module1.netProfit}</span>
                          <p className="text-sm font-bold text-emerald-700 mt-0.5 tabular-nums">
                            ৳ {Math.max(
                              0,
                              (store.transactions.filter((tx) => tx.category !== "EXPENSE").reduce((sum, tx) => sum + tx.amountBdt, 0) || (store.visaApplicants.length * 120000)) -
                              (store.transactions.filter((tx) => tx.category === "EXPENSE").reduce((sum, tx) => sum + tx.amountBdt, 0) || (store.staffList.reduce((sum, st) => sum + st.monthlyBaseSalaryBdt, 0) * 3))
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="hover-spotlight rounded-2xl border border-slate-200/80 bg-white p-5">
                        <span className="text-[11px] font-semibold text-emerald-700">
                          {t.module1.sswBadge}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900 mt-1">
                          {t.module1.sswTitle}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                          {t.module1.sswDesc}
                        </p>
                        <button
                          type="button"
                          onClick={() => setActiveTab("crm")}
                          className="mt-4 w-full rounded-xl bg-slate-900 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition"
                        >
                          {t.module1.sswButton}
                        </button>
                      </div>

                      <div className="hover-spotlight rounded-2xl border border-slate-200/80 bg-white p-5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-medium text-slate-400">
                            {t.module1.partnerBadge}
                          </span>
                          <button
                            type="button"
                            onClick={() => openPartnerSchoolModal()}
                            className="text-[11px] font-semibold text-[#b91c1c] hover:underline"
                          >
                            {tr("+ নতুন স্কুল যোগ করুন", "+ Add School", "+ 提携校を追加")}
                          </button>
                        </div>

                        {store.partnerSchools.length > 0 ? (
                          <div className="mt-2.5 space-y-2.5">
                            {store.partnerSchools.slice(0, 3).map((sch) => {
                              const quota = sch.intakeQuota || 20;
                              const pct = Math.min(100, Math.round((sch.activeStudentsCount / quota) * 100));
                              return (
                                <div key={sch.id} className="pt-2 first:pt-0 border-t border-slate-100 first:border-0">
                                  <div className="flex items-center justify-between">
                                    <h3 className="text-xs font-bold text-slate-900 truncate">{sch.name}</h3>
                                    <span className="text-[11px] font-bold text-slate-700 tabular-nums">
                                      {sch.activeStudentsCount}/{quota} {tr("সিট", "Seats", "席")}
                                    </span>
                                  </div>
                                  <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                                    <div
                                      className="h-full rounded-full bg-[#b91c1c] transition-all"
                                      style={{ width: `${pct}%` }}
                                    />
                                  </div>
                                  <p className="text-[10px] text-slate-400 mt-1">
                                    {sch.location} • {tr("কমিশন", "Comm.", "手数料")} ¥{sch.commissionPerStudentYen.toLocaleString()}{tr("/স্টুডেন্ট", "/Student", "/名")}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="mt-3 rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-4 text-center">
                            <Building2 className="h-6 w-6 text-slate-300 mx-auto mb-1.5" />
                            <p className="text-xs font-semibold text-slate-700">
                              {t.module1.partnerTitle}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {t.module1.partnerDesc}
                            </p>
                            <button
                              type="button"
                              onClick={() => openPartnerSchoolModal()}
                              className="mt-2.5 inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-slate-800 transition"
                            >
                              <Plus className="h-3 w-3" />
                              <span>{tr("প্রতিষ্ঠান যোগ করুন", "Add Institution", "教育機関を追加")}</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* =====================================================================
                      CROSS-MODULE EXECUTIVE INTELLIGENCE (Funnel, Dues/Commissions, Leaderboard)
                      ===================================================================== */}
                  {(() => {
                    const totalLeadsCount = filteredLeads.length;
                    const counseledCount = filteredLeads.filter(
                      (l) => l.status === "COUNSELED" || l.status === "OFFICE_VISIT_BOOKED" || l.status === "ADMITTED",
                    ).length;
                    const enrolledCount = filteredLeads.filter(
                      (l) => l.status === "ADMITTED" || l.isCourseEnrolled || l.isFileOpened,
                    ).length;
                    const visaPipelineCount = filteredVisaApplicants.length;
                    const coeApprovedCount = filteredVisaApplicants.filter((v) => v.stage >= 6).length;
                    const visaFlyCount = filteredVisaApplicants.filter((v) => v.stage >= 9).length;

                    const studentsWithDues = store.crmLeads.filter(
                      (l) =>
                        (l.isFileOpened || l.isCourseEnrolled || l.status === "ADMITTED") &&
                        (l.dueAmountBdt ?? Math.max(0, (l.contractAmountBdt || 120000) - (l.paidAmountBdt || 0))) > 0,
                    );
                    const totalStudentDuesBdt = studentsWithDues.reduce(
                      (sum, l) =>
                        sum + (l.dueAmountBdt ?? Math.max(0, (l.contractAmountBdt || 120000) - (l.paidAmountBdt || 0))),
                      0,
                    );
                    const agentsWithPending = store.b2bAgents.filter((a) => (a.pendingCommissionBdt || 0) > 0);
                    const totalPendingAgentBdt = agentsWithPending.reduce((sum, a) => sum + a.pendingCommissionBdt, 0);

                    const topCounselors = [...store.staffList]
                      .filter((s) => s.role === "COUNSELOR" || s.role === "TELE_COUNSELOR")
                      .sort((a, b) => (b.admissionsAchieved || 0) - (a.admissionsAchieved || 0))
                      .slice(0, 3);

                    const topAgents = [...store.b2bAgents]
                      .sort((a, b) => (b.successfulVisasCount || 0) - (a.successfulVisasCount || 0))
                      .slice(0, 3);

                    const funnelSteps = [
                      {
                        label: tr("মোট লিড (CRM)", "Total Leads", "総リード数"),
                        count: totalLeadsCount,
                        sub: tr("ইনকোয়ারি", "Inquiries", "問合せ"),
                        tab: "crm" as DashboardTabId,
                      },
                      {
                        label: tr("কাউন্সেলিং সম্পন্ন", "Counseled", "カウンセリング済"),
                        count: counseledCount,
                        sub: tr("ভিজিট / কল", "Assessed", "面談・評価"),
                        tab: "crm" as DashboardTabId,
                      },
                      {
                        label: tr("ভর্তি ও LMS ব্যাচ", "Enrolled / LMS", "受講生 / LMS"),
                        count: enrolledCount || store.lmsBridges.length,
                        sub: tr("ভাষা ও ফাইল", "Active Students", "在籍生徒"),
                        tab: "lms" as DashboardTabId,
                      },
                      {
                        label: tr("ভিসা প্রসেসিং ফাইল", "Visa Pipeline", "ビザ申請中"),
                        count: visaPipelineCount,
                        sub: tr("ডকুমেন্টেশন", "In Process", "書類手続き中"),
                        tab: "visa" as DashboardTabId,
                      },
                      {
                        label: tr("COE অনুমোদিত", "COE Approved", "COE交付済"),
                        count: coeApprovedCount,
                        sub: tr("জাপান ইমিগ্রেশন", "Stage 6+", "入管交付"),
                        tab: "visa" as DashboardTabId,
                      },
                      {
                        label: tr("ভিসা স্ট্যাম্প ও ফ্লাই", "Visa & Fly", "ビザ取得・渡航"),
                        count: visaFlyCount,
                        sub: tr("চূড়ান্ত সফলতা", "Stage 9-10", "渡航成功"),
                        tab: "visa" as DashboardTabId,
                      },
                    ];

                    return (
                      <>
                        {/* 1. End-to-End Student Conversion Funnel */}
                        <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-slate-100">
                            <div>
                              <h2 className="text-sm font-bold text-slate-900">
                                {tr(
                                  "এন্ড-টু-এন্ড স্টুডেন্ট কনভার্সন ফানেল (CRM ➔ LMS ➔ Visa ➔ COE ➔ Fly)",
                                  "End-to-End Student Conversion Funnel (CRM to COE & Fly)",
                                  "学生コンバージョンファネル (CRM ➔ LMS ➔ ビザ ➔ COE ➔ 渡航)",
                                )}
                              </h2>
                              <p className="text-xs text-slate-400 mt-0.5">
                                {tr(
                                  "প্রাথমিক লিড থেকে শুরু করে জাপানে ফ্লাইট পর্যন্ত প্রতিটি ধাপের লাইভ সিঙ্ক ট্র্যাকার",
                                  "Live relational synchronization from initial inquiry to visa stamping",
                                  "初回問合せからCOE交付・日本渡航までのリアルタイム追跡",
                                )}
                              </p>
                            </div>
                            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60">
                              {tr("অটো-সিঙ্ক সক্রিয়", "Auto-Sync Active", "自動同期稼働中")}
                            </span>
                          </div>

                          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                            {funnelSteps.map((step, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setActiveTab(step.tab)}
                                className="group text-left rounded-xl border border-slate-200/70 bg-slate-50/60 hover:bg-white hover:border-slate-300 p-3.5 transition"
                              >
                                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                                  <span>STEP 0{idx + 1}</span>
                                  <ChevronRight className="h-3 w-3 text-slate-300 group-hover:text-[#b91c1c] transition" />
                                </div>
                                <p className="mt-1.5 text-xl font-bold text-slate-900 tabular-nums">
                                  {step.count}
                                </p>
                                <p className="mt-0.5 text-xs font-semibold text-slate-700 truncate">
                                  {step.label}
                                </p>
                                <p className="text-[10px] text-slate-400">{step.sub}</p>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* 2. Actionable Financial Alerts & Top Performers Leaderboard */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Pending Dues & B2B Commission Action Alerts */}
                          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <div>
                                  <h3 className="text-sm font-bold text-slate-900">
                                    {tr(
                                      "বকেয়া ফি ও প্রদেয় এজেন্ট কমিশন অ্যালার্ট",
                                      "Pending Student Dues & Payable B2B Commissions",
                                      "未収金およびB2B代理店手数料アラート",
                                    )}
                                  </h3>
                                  <p className="text-[11px] text-slate-400 mt-0.5">
                                    {tr(
                                      "১-ক্লিকে বকেয়া আদায় অথবা সাব-এজেন্ট কমিশন পরিশোধ করুন",
                                      "Collect due installments or settle B2B commissions in 1 click",
                                      "1クリックで未収金回収またはエージェント手数料を精算",
                                    )}
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveTab("finance");
                                    setFinanceSubTab("dues");
                                  }}
                                  className="text-xs font-semibold text-[#b91c1c] hover:underline"
                                >
                                  {tr("সব বকেয়া দেখুন", "View All", "すべて表示")}
                                </button>
                              </div>

                              <div className="mt-3 grid grid-cols-2 gap-3">
                                <div className="rounded-xl border border-amber-200/70 bg-amber-50/40 p-3">
                                  <span className="text-[11px] font-semibold text-amber-800">
                                    {tr("শিক্ষার্থীদের মোট বকেয়া", "Student Receivable Dues", "生徒未収金総額")}
                                  </span>
                                  <p className="text-lg font-bold text-slate-900 mt-0.5 tabular-nums">
                                    ৳{totalStudentDuesBdt.toLocaleString()}
                                  </p>
                                  <p className="text-[10px] text-amber-700 mt-0.5 tabular-nums">
                                    {studentsWithDues.length} {tr("জন শিক্ষার্থীর কিস্তি বাকি", "students with balance", "名の残金あり")}
                                  </p>
                                </div>

                                <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-3">
                                  <span className="text-[11px] font-semibold text-slate-600">
                                    {tr("বিটুবি এজেন্ট কমিশন প্রদেয়", "Payable B2B Commission", "未払B2B手数料")}
                                  </span>
                                  <p className="text-lg font-bold text-slate-900 mt-0.5 tabular-nums">
                                    ৳{totalPendingAgentBdt.toLocaleString()}
                                  </p>
                                  <p className="text-[10px] text-slate-500 mt-0.5 tabular-nums">
                                    {agentsWithPending.length} {tr("টি এজেন্সির COE কমিশন", "agencies pending", "社の手数料未払")}
                                  </p>
                                </div>
                              </div>

                              <div className="mt-3 space-y-2">
                                {studentsWithDues.slice(0, 3).map((stu) => {
                                  const due =
                                    stu.dueAmountBdt ??
                                    Math.max(0, (stu.contractAmountBdt || 120000) - (stu.paidAmountBdt || 0));
                                  return (
                                    <div
                                      key={stu.id}
                                      className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2 text-xs"
                                    >
                                      <div>
                                        <p className="font-bold text-slate-900">{stu.name}</p>
                                        <p className="text-[11px] text-slate-500 tabular-nums">
                                          {tr("বকেয়া:", "Due:", "残金:")}{" "}
                                          <span className="font-semibold text-[#b91c1c]">
                                            ৳{due.toLocaleString()}
                                          </span>{" "}
                                          ({stu.targetSchoolName || stu.interest})
                                        </p>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => openStudentPaymentModal(stu)}
                                        className="rounded-lg bg-emerald-700 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-emerald-800 transition"
                                      >
                                        {tr("ফি গ্রহণ", "Collect Fee", "入金受領")}
                                      </button>
                                    </div>
                                  );
                                })}

                                {agentsWithPending.slice(0, 2).map((ag) => (
                                  <div
                                    key={ag.id}
                                    className="flex items-center justify-between rounded-xl border border-amber-200/60 bg-amber-50/30 px-3 py-2 text-xs"
                                  >
                                    <div>
                                      <p className="font-bold text-slate-900">{ag.organizationName}</p>
                                      <p className="text-[11px] text-amber-800 tabular-nums">
                                        {tr("প্রদেয় কমিশন:", "Payable:", "未払手数料:")}{" "}
                                        <span className="font-bold">৳{ag.pendingCommissionBdt.toLocaleString()}</span>
                                      </p>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const tx = settleB2bAgentCommission(ag.id);
                                        if (tx) {
                                          setStore({ ...getCmsStore() });
                                          showToast(`${ag.organizationName}: ৳${tx.amountBdt.toLocaleString()} ${tr("কমিশন পরিশোধিত", "commission settled", "手数料精算完了")}`);
                                        }
                                      }}
                                      className="rounded-lg bg-slate-900 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-slate-800 transition"
                                    >
                                      {tr("পরিশোধ করুন", "Settle Now", "今すぐ精算")}
                                    </button>
                                  </div>
                                ))}

                                {studentsWithDues.length === 0 && agentsWithPending.length === 0 && (
                                  <div className="rounded-xl border border-dashed border-slate-200 py-5 text-center text-xs text-slate-400">
                                    {tr(
                                      "কোনো বকেয়া ফি বা অমীমাংসিত এজেন্ট কমিশন নেই",
                                      "No pending student dues or unsettled agent commissions",
                                      "未収金や未精算の手数料はありません",
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Top Performing Counselor & B2B Agent Leaderboard */}
                          <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                              <div>
                                <h3 className="text-sm font-bold text-slate-900">
                                  {tr(
                                    "টপ পারফর্মিং কাউন্সেলর ও বিটুবি এজেন্ট লিডারবোর্ড",
                                    "Top Performing Counselors & B2B Partners",
                                    "トップ実績カウンセラー＆B2Bパートナー",
                                  )}
                                </h3>
                                <p className="text-[11px] text-slate-400 mt-0.5">
                                  {tr(
                                    "ভর্তি ও সফল ভিসা প্রাপ্তির ভিত্তিতে সেরা পারফর্মার তালিকা",
                                    "Ranked by confirmed student admissions and successful COE/Visas",
                                    "入学者数およびビザ・COE取得実績ランキング",
                                  )}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => setActiveTab("hr")}
                                className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                              >
                                {tr("HR প্যানেল", "HR Panel", "人事パネル")}
                              </button>
                            </div>

                            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                  {tr("সেরা এডমিশন কাউন্সেলর", "Top Counselors", "トップカウンセラー")}
                                </span>
                                <div className="mt-2 space-y-2">
                                  {topCounselors.length > 0 ? (
                                    topCounselors.map((c, i) => (
                                      <div
                                        key={c.id}
                                        className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2 text-xs"
                                      >
                                        <div className="min-w-0">
                                          <p className="font-bold text-slate-900 truncate">
                                            {i + 1}. {c.name}
                                          </p>
                                          <p className="text-[10px] text-slate-400 tabular-nums">
                                            {c.callsCompleted || 0} {tr("কল", "calls", "件架電")} • {tr("বোনাস", "Bonus", "ボーナス")} ৳{(c.performanceBonusBdt || 0).toLocaleString()}
                                          </p>
                                        </div>
                                        <span className="rounded-lg bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200/60 tabular-nums shrink-0">
                                          {c.admissionsAchieved} {tr("ভর্তি", "Admissions", "名入学")}
                                        </span>
                                      </div>
                                    ))
                                  ) : (
                                    <p className="text-xs text-slate-400 py-3">
                                      {tr("কোনো কাউন্সেলর তথ্য নেই", "No counselors added", "カウンセラー情報なし")}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div>
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                  {tr("সেরা বিটুবি সাব-এজেন্ট", "Top B2B Agents", "トップB2Bパートナー")}
                                </span>
                                <div className="mt-2 space-y-2">
                                  {topAgents.length > 0 ? (
                                    topAgents.map((ag, i) => (
                                      <div
                                        key={ag.id}
                                        className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2 text-xs"
                                      >
                                        <div className="min-w-0">
                                          <p className="font-bold text-slate-900 truncate">
                                            {i + 1}. {ag.organizationName}
                                          </p>
                                          <p className="text-[10px] text-slate-400 tabular-nums">
                                            {tr("রেফার্ড:", "Referred:", "紹介数:")} {ag.referredStudentsCount} {tr("জন", "students", "名")} • {ag.city}
                                          </p>
                                        </div>
                                        <span className="rounded-lg bg-slate-900 px-2 py-0.5 text-[11px] font-bold text-white tabular-nums shrink-0">
                                          {ag.successfulVisasCount} {tr("ভিসা", "Visas", "件ビザ")}
                                        </span>
                                      </div>
                                    ))
                                  ) : (
                                    <p className="text-xs text-slate-400 py-3">
                                      {tr("কোনো বিটুবি এজেন্ট যুক্ত নেই", "No B2B agents added", "B2Bエージェント情報なし")}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}

              {/* =========================================================================
                  MODULE 2: OMNI-CHANNEL CRM & TELE-COUNSELOR WORKSPACE
                  ========================================================================= */}
              {activeTab === "crm" && (
                <div className="space-y-5">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                        {t.crm.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                        {t.crm.subtitle}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setCrmImportExportMode("IMPORT")}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50/80 px-3.5 py-2.5 text-xs font-semibold text-emerald-900 hover:bg-emerald-100 transition shrink-0"
                      >
                        <FileSpreadsheet className="h-4 w-4 text-emerald-700" />
                        <span>
                          {tr(
                            "Google Sheet / CSV ইমপোর্ট",
                            "Import Sheet / CSV",
                            "Googleシート / CSV取込"
                          )}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setCrmImportExportMode("EXPORT")}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shrink-0"
                      >
                        <Download className="h-4 w-4 text-slate-600" />
                        <span>
                          {tr(
                            `এক্সপোর্ট (${filteredLeads.length})`,
                            `Export (${filteredLeads.length})`,
                            `エクスポート (${filteredLeads.length})`
                          )}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={handlePurgeDummyData}
                        disabled={isSyncingWithDb}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50/70 px-3 py-2.5 text-xs font-semibold text-red-700 hover:bg-red-100 transition shrink-0"
                        title={tr("সমস্ত ডামি ডেটা মুছে ফেলুন", "Purge all dummy test data", "ダミーデータを削除")}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                        <span>{tr("ডামি ডাটা মুছুন", "Purge Dummy", "ダミー削除")}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveModal("ADD_LEAD")}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#b91c1c] px-4 py-2.5 text-xs font-semibold text-white hover:bg-red-800 transition shadow-2xs shrink-0"
                      >
                        <Plus className="h-4 w-4" />
                        <span>{t.crm.quickAddBtn}</span>
                      </button>
                    </div>
                  </div>

                  {/* Interactive Status Pipeline Filter Bar */}
                  {(() => {
                    const todayStr = new Date().toISOString().slice(0, 10);
                    const dueFollowUpCount = branchLeads.filter(
                      (l) => l.followUpDate && l.followUpDate <= todayStr && l.status !== "ARCHIVED"
                    ).length;

                    const statusTabs: {
                      id: "ALL" | LeadStatus | "FOLLOWUP_DUE";
                      label: string;
                      count: number;
                      accent?: string;
                    }[] = [
                      {
                        id: "ALL",
                        label: tr("সকল লিড", "All Leads", "全リード"),
                        count: branchLeads.length,
                      },
                      {
                        id: "NEW",
                        label: t.crm.statuses.NEW,
                        count: branchLeads.filter((l) => l.status === "NEW").length,
                      },
                      {
                        id: "CONTACTED",
                        label: t.crm.statuses.CONTACTED,
                        count: branchLeads.filter((l) => l.status === "CONTACTED").length,
                      },
                      {
                        id: "COUNSELED",
                        label: t.crm.statuses.COUNSELED,
                        count: branchLeads.filter((l) => l.status === "COUNSELED").length,
                      },
                      {
                        id: "OFFICE_VISIT_BOOKED",
                        label: t.crm.statuses.OFFICE_VISIT_BOOKED,
                        count: branchLeads.filter((l) => l.status === "OFFICE_VISIT_BOOKED").length,
                      },
                      {
                        id: "ADMITTED",
                        label: t.crm.statuses.ADMITTED,
                        count: branchLeads.filter((l) => l.status === "ADMITTED").length,
                      },
                      {
                        id: "FOLLOWUP_DUE",
                        label: tr("আজকের ফলো-আপ", "Follow-up Due", "本日フォロー対象"),
                        count: dueFollowUpCount,
                        accent: "amber",
                      },
                    ];

                    return (
                      <div className="flex flex-wrap items-center gap-1.5">
                        {statusTabs.map((tab) => {
                          const active = crmStatusFilter === tab.id;
                          return (
                            <button
                              key={tab.id}
                              type="button"
                              onClick={() => setCrmStatusFilter(tab.id)}
                              className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                                active
                                  ? "bg-slate-900 text-white shadow-2xs"
                                  : tab.accent === "amber" && tab.count > 0
                                    ? "border border-amber-200 bg-amber-50/70 text-amber-900 hover:bg-amber-100"
                                    : "border border-slate-200/80 bg-white text-slate-600 hover:bg-slate-50"
                              }`}
                            >
                              <span>{tab.label}</span>
                              <span
                                className={`rounded-md px-1.5 py-0.2 font-mono text-[10px] tabular-nums ${
                                  active
                                    ? "bg-white/20 text-white"
                                    : "bg-slate-100 text-slate-700"
                                }`}
                              >
                                {tab.count}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    );
                  })()}

                  {/* Search & Multi-Dimensional Filter Controls */}
                  <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2.5 text-xs">
                      <div className="sm:col-span-2 lg:col-span-5 relative">
                        <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={crmSearchQuery}
                          onChange={(e) => setCrmSearchQuery(e.target.value)}
                          placeholder={tr(
                            "নাম, মোবাইল নম্বর, পাসপোর্ট, জেলা, স্কুল বা ট্যাগ দিয়ে খুঁজুন...",
                            "Search by name, phone, passport, city, school, or tag...",
                            "氏名・電話番号・パスポート・都市・タグで検索..."
                          )}
                          className="w-full rounded-xl border border-slate-200 pl-8 pr-3 py-2 text-xs text-slate-900 focus:border-slate-400 focus:outline-hidden"
                        />
                      </div>

                      <div className="lg:col-span-2">
                        <select
                          value={crmPriorityFilter}
                          onChange={(e) => setCrmPriorityFilter(e.target.value as any)}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-semibold text-slate-700"
                        >
                          <option value="ALL">
                            {tr("সব প্রায়োরিটি (All Priority)", "All Priorities", "全優先度")}
                          </option>
                          <option value="HOT">HOT Priority</option>
                          <option value="WARM">WARM Lead</option>
                          <option value="COLD">COLD Lead</option>
                        </select>
                      </div>

                      <div className="lg:col-span-2">
                        <select
                          value={crmSourceFilter}
                          onChange={(e) => setCrmSourceFilter(e.target.value as any)}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-semibold text-slate-700"
                        >
                          <option value="ALL">
                            {tr("সব মাধ্যম (All Sources)", "All Sources", "全流入元")}
                          </option>
                          <option value="GOOGLE_SHEET">Google Sheet Import</option>
                          <option value="FACEBOOK_AD">Facebook Ads</option>
                          <option value="WHATSAPP_DIRECT">WhatsApp Direct</option>
                          <option value="WEBSITE_CALCULATOR">Website Inquiry</option>
                          <option value="WALK_IN_DHAKA">Walk-in (Dhaka HQ)</option>
                          <option value="WALK_IN_KHULNA">Walk-in (Khulna)</option>
                          <option value="SUB_AGENT_REFERRAL">B2B Sub-Agent</option>
                        </select>
                      </div>

                      <div className="lg:col-span-3 flex items-center gap-2">
                        <select
                          value={crmCounselorFilter}
                          onChange={(e) => setCrmCounselorFilter(e.target.value)}
                          className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 font-semibold text-slate-700"
                        >
                          <option value="ALL">
                            {tr("সকল কাউন্সেলর (All Counselors)", "All Counselors", "全カウンセラー")}
                          </option>
                          {Array.from(new Set(branchLeads.map((l) => l.assignedTo).filter(Boolean))).map(
                            (cName) => (
                              <option key={cName} value={cName}>
                                {cName}
                              </option>
                            )
                          )}
                        </select>

                        {(crmSearchQuery ||
                          crmStatusFilter !== "ALL" ||
                          crmPriorityFilter !== "ALL" ||
                          crmSourceFilter !== "ALL" ||
                          crmCounselorFilter !== "ALL") && (
                          <button
                            type="button"
                            onClick={() => {
                              setCrmSearchQuery("");
                              setCrmStatusFilter("ALL");
                              setCrmPriorityFilter("ALL");
                              setCrmSourceFilter("ALL");
                              setCrmCounselorFilter("ALL");
                            }}
                            className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 text-[11px] font-semibold text-slate-600 hover:bg-slate-100 shrink-0"
                          >
                            {tr("রিসেট", "Reset", "リセット")}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bulk Selection Actions Bar */}
                  {selectedCrmLeadIds.length > 0 && (
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-900 px-4 py-3 text-xs text-white shadow-md">
                      <div className="flex items-center gap-2">
                        <span className="rounded-lg bg-emerald-500/20 border border-emerald-400/30 px-2.5 py-1 font-mono font-bold text-emerald-300 tabular-nums">
                          {selectedCrmLeadIds.length}
                        </span>
                        <span className="font-semibold">
                          {tr(
                            "টি লিড নির্বাচিত করা হয়েছে — বাল্ক অ্যাকশন নিন:",
                            "leads selected — apply bulk action:",
                            "件のリードを選択中 — 一括操作："
                          )}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <select
                          defaultValue=""
                          onChange={(e) => {
                            if (!e.target.value) return;
                            const nextStatus = e.target.value as LeadStatus;
                            const count = bulkUpdateCrmLeads(selectedCrmLeadIds, { status: nextStatus });
                            setStore({ ...getCmsStore() });
                            showToast(
                              tr(
                                `${count}টি লিডের স্ট্যাটাস "${nextStatus}"-এ পরিবর্তন করা হয়েছে`,
                                `Updated status to ${nextStatus} for ${count} leads`,
                                `${count}件のステータスを${nextStatus}に更新しました`
                              )
                            );
                            e.target.value = "";
                          }}
                          className="rounded-xl border border-white/15 bg-white/10 px-2.5 py-1.5 text-xs font-semibold text-white"
                        >
                          <option value="" className="text-slate-900">
                            {tr("স্ট্যাটাস পরিবর্তন...", "Set Status...", "ステータス変更...")}
                          </option>
                          <option value="NEW" className="text-slate-900">NEW</option>
                          <option value="CONTACTED" className="text-slate-900">CONTACTED</option>
                          <option value="COUNSELED" className="text-slate-900">COUNSELED</option>
                          <option value="OFFICE_VISIT_BOOKED" className="text-slate-900">OFFICE_VISIT_BOOKED</option>
                          <option value="ADMITTED" className="text-slate-900">ADMITTED</option>
                          <option value="ARCHIVED" className="text-slate-900">ARCHIVED</option>
                        </select>

                        <select
                          defaultValue=""
                          onChange={(e) => {
                            if (!e.target.value) return;
                            const nextPrio = e.target.value as LeadPriority;
                            const count = bulkUpdateCrmLeads(selectedCrmLeadIds, { priority: nextPrio });
                            setStore({ ...getCmsStore() });
                            showToast(
                              tr(
                                `${count}টি লিডের প্রায়োরিটি "${nextPrio}" করা হয়েছে`,
                                `Updated priority to ${nextPrio} for ${count} leads`,
                                `${count}件の優先度を${nextPrio}に更新しました`
                              )
                            );
                            e.target.value = "";
                          }}
                          className="rounded-xl border border-white/15 bg-white/10 px-2.5 py-1.5 text-xs font-semibold text-white"
                        >
                          <option value="" className="text-slate-900">
                            {tr("প্রায়োরিটি সেট...", "Set Priority...", "優先度変更...")}
                          </option>
                          <option value="HOT" className="text-slate-900">HOT Priority</option>
                          <option value="WARM" className="text-slate-900">WARM Lead</option>
                          <option value="COLD" className="text-slate-900">COLD Lead</option>
                        </select>

                        <select
                          defaultValue=""
                          onChange={(e) => {
                            if (!e.target.value) return;
                            const counselorName = e.target.value;
                            const staffObj = store.staffList.find((s) => s.name === counselorName);
                            const count = bulkUpdateCrmLeads(selectedCrmLeadIds, {
                              assignedTo: counselorName,
                              assignedCounselorId: staffObj?.id,
                            });
                            setStore({ ...getCmsStore() });
                            showToast(
                              tr(
                                `${count}টি লিড "${counselorName}"-কে অ্যাসাইন করা হয়েছে`,
                                `Assigned ${count} leads to ${counselorName}`,
                                `${count}件を${counselorName}に割り当てました`
                              )
                            );
                            e.target.value = "";
                          }}
                          className="rounded-xl border border-white/15 bg-white/10 px-2.5 py-1.5 text-xs font-semibold text-white"
                        >
                          <option value="" className="text-slate-900">
                            {tr("কাউন্সেলর অ্যাসাইন...", "Assign Counselor...", "担当者割当...")}
                          </option>
                          {store.staffList
                            .filter(
                              (s) =>
                                s.role === "COUNSELOR" ||
                                s.role === "TELE_COUNSELOR" ||
                                s.role === "BRANCH_MANAGER"
                            )
                            .map((s) => (
                              <option key={s.id} value={s.name} className="text-slate-900">
                                {s.name}
                              </option>
                            ))}
                        </select>

                        <button
                          type="button"
                          onClick={() => setCrmImportExportMode("EXPORT")}
                          className="inline-flex items-center gap-1 rounded-xl bg-white/15 px-3 py-1.5 font-semibold text-white hover:bg-white/25 transition"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>{tr("এক্সপোর্ট", "Export Selected", "選択分出力")}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const count = bulkDeleteCrmLeads(selectedCrmLeadIds);
                            setSelectedCrmLeadIds([]);
                            setStore({ ...getCmsStore() });
                            showToast(
                              tr(
                                `${count}টি লিড মুছে ফেলা হয়েছে`,
                                `Deleted ${count} selected leads`,
                                `${count}件のリードを削除しました`
                              )
                            );
                          }}
                          className="inline-flex items-center gap-1 rounded-xl bg-red-600 px-3 py-1.5 font-semibold text-white hover:bg-red-500 transition"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>{tr("ডিলিট", "Delete", "削除")}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedCrmLeadIds([])}
                          className="rounded-xl bg-white/10 px-2.5 py-1.5 text-slate-300 hover:text-white"
                        >
                          {tr("বাতিল", "Clear", "解除")}
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="border-b border-slate-100 bg-slate-50/70 font-semibold text-slate-500">
                          <tr>
                            <th className="w-9 px-3 py-3">
                              <input
                                type="checkbox"
                                checked={
                                  filteredLeads.length > 0 &&
                                  filteredLeads.every((l) => selectedCrmLeadIds.includes(l.id))
                                }
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedCrmLeadIds(filteredLeads.map((l) => l.id));
                                  } else {
                                    setSelectedCrmLeadIds([]);
                                  }
                                }}
                                className="h-3.5 w-3.5 rounded accent-slate-900 cursor-pointer"
                              />
                            </th>
                            <th className="px-4 py-3">{t.crm.colCandidate}</th>
                            <th className="px-4 py-3">{t.crm.colSource}</th>
                            <th className="px-4 py-3">
                              {tr("চুক্তি ও বকেয়া হিসাব (Finance)", "Contract & Dues", "契約・未収金管理")}
                            </th>
                            <th className="px-4 py-3">{t.crm.colCounselor}</th>
                            <th className="px-4 py-3">{t.crm.colStatus}</th>
                            <th className="px-4 py-3 text-right">{t.crm.colAction}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredLeads.map((lead) => {
                            const candidateName = lead.name || "Candidate";
                            const waText = encodeURIComponent(
                              `Hello ${candidateName}, greetings from KNLTC. We would like to follow up on your Japan study & visa inquiry.`,
                            );
                            const rawPhone = String(lead.whatsapp || lead.phone || "");
                            const waLink = `https://wa.me/${rawPhone.replace(/[^0-9]/g, "")}?text=${waText}`;
                            const contractBdt =
                              lead.contractAmountBdt ||
                              (lead.interest === "STUDENT_VISA_PREMIUM"
                                ? 1100000
                                : lead.interest === "JAPANESE_N5" || lead.interest === "JAPANESE_N4"
                                  ? 12000
                                  : 120000);
                            const paidBdt = lead.paidAmountBdt || 0;
                            const dueBdt = lead.dueAmountBdt ?? Math.max(0, contractBdt - paidBdt);
                            const elig = calculateLeadEligibility(lead);
                            const leadPriority =
                              lead.priority || (lead.status === "ADMITTED" ? "HOT" : "WARM");
                            const isSelected = selectedCrmLeadIds.includes(lead.id);
                            const safeTags: string[] = Array.isArray(lead.customTags)
                              ? lead.customTags
                              : typeof lead.customTags === "string"
                                ? (lead.customTags as string).split(",").map((t) => t.trim()).filter(Boolean)
                                : [];

                            return (
                              <tr
                                key={lead.id}
                                className={`transition-colors ${
                                  isSelected ? "bg-slate-50" : "hover:bg-slate-50/70"
                                }`}
                              >
                                <td className="px-3 py-3.5">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedCrmLeadIds((prev) => [...prev, lead.id]);
                                      } else {
                                        setSelectedCrmLeadIds((prev) =>
                                          prev.filter((id) => id !== lead.id)
                                        );
                                      }
                                    }}
                                    className="h-3.5 w-3.5 rounded accent-slate-900 cursor-pointer"
                                  />
                                </td>
                                <td className="px-4 py-3.5">
                                  <div className="flex items-start gap-2.5">
                                    <button
                                      type="button"
                                      onClick={() => setSelectedLeadForProfile(lead)}
                                      className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100 border border-slate-200 font-bold text-[11px] text-slate-700 hover:border-slate-400 transition mt-0.5"
                                    >
                                      {lead.avatarUrl ? (
                                        <img
                                          src={lead.avatarUrl}
                                          alt={candidateName}
                                          className="h-full w-full object-cover"
                                        />
                                      ) : (
                                        <span>{(candidateName || "ST").slice(0, 2).toUpperCase()}</span>
                                      )}
                                    </button>
                                    <div>
                                      <div className="flex flex-wrap items-center gap-1.5">
                                        <button
                                          type="button"
                                          onClick={() => setSelectedLeadForProfile(lead)}
                                          className="text-left group"
                                        >
                                          <p className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-[#b91c1c] transition-colors">
                                            {candidateName}
                                          </p>
                                        </button>
                                        <span
                                          className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded ${
                                            leadPriority === "HOT"
                                              ? "bg-red-50 text-red-700"
                                              : leadPriority === "WARM"
                                                ? "bg-amber-50 text-amber-800"
                                                : "bg-slate-100 text-slate-600"
                                          }`}
                                        >
                                          {leadPriority}
                                        </span>
                                        {lead.source === "GOOGLE_SHEET" && (
                                          <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700">
                                            Sheet
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-slate-400 font-mono text-[11px] tabular-nums mt-0.5">
                                        {lead.phone || "No phone"} · {lead.city || "Dhaka"}
                                        {lead.followUpDate ? ` · Follow-up: ${lead.followUpDate}` : ""}
                                      </p>
                                      <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 font-mono tabular-nums">
                                        <span
                                          className={
                                            elig.totalScore >= 80
                                              ? "text-emerald-700 font-semibold"
                                              : elig.totalScore >= 65
                                                ? "text-amber-700 font-semibold"
                                                : "text-slate-600 font-semibold"
                                          }
                                        >
                                          {tr("যোগ্যতা:", "Eligibility:", "適格性:")} {elig.totalScore}%
                                        </span>
                                        <span aria-hidden="true">·</span>
                                        <span>
                                          {tr("ডকুমেন্ট:", "Docs:", "書類:")} {elig.verifiedDocsCount}/{elig.totalDocsCount}
                                        </span>
                                        {(lead.targetSchoolName || lead.targetSchool) && (
                                          <>
                                            <span aria-hidden="true">·</span>
                                            <span className="font-sans text-slate-700 font-medium">
                                              {lead.targetSchoolName || lead.targetSchool}
                                            </span>
                                          </>
                                        )}
                                      </div>
                                      {safeTags.length > 0 && (
                                        <div className="mt-1 flex flex-wrap gap-1">
                                          {safeTags.slice(0, 3).map((tag) => (
                                            <span
                                              key={tag}
                                              className="rounded bg-slate-100 px-1.5 py-0.2 text-[10px] font-medium text-slate-600"
                                            >
                                              {tag}
                                            </span>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3.5">
                                  <span className="text-[11px] font-medium text-slate-500 block">
                                    {lead.referredByAgentName || lead.b2bAgentName
                                      ? `${tr("এজেন্ট:", "Agent:", "代理店:")} ${lead.referredByAgentName || lead.b2bAgentName}`
                                      : lead.source}
                                  </span>
                                  <span className="font-semibold text-slate-800 mt-0.5 block">
                                    {lead.interest}
                                  </span>
                                  <span className="text-[10px] text-emerald-700 font-semibold font-mono tabular-nums">
                                    {lead.education} · {lead.japaneseProficiency}
                                    {lead.studyGapYears ? ` · ${lead.studyGapYears}y gap` : ""}
                                  </span>
                                </td>
                                <td className="px-4 py-3.5 tabular-nums">
                                  <div className="space-y-0.5">
                                    <p className="text-[11px] text-slate-500">
                                      {tr("চুক্তি:", "Contract:", "契約額:")} <span className="font-semibold text-slate-800">৳{contractBdt.toLocaleString()}</span>
                                    </p>
                                    <p className="text-[11px] text-emerald-700 font-semibold">
                                      {tr("জমা:", "Paid:", "入金額:")} ৳{paidBdt.toLocaleString()}
                                    </p>
                                    {dueBdt > 0 ? (
                                      <p className="text-[11px] text-[#b91c1c] font-bold">
                                        {tr("বকেয়া:", "Due:", "残金:")} ৳{dueBdt.toLocaleString()}
                                      </p>
                                    ) : (
                                      <span className="inline-block rounded bg-emerald-50 px-1.5 py-0.2 text-[10px] font-bold text-emerald-700">
                                        {tr("পরিশোধিত", "Paid in full", "完納")}
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="px-4 py-3.5">
                                  <p className="font-medium text-slate-700">{lead.assignedTo}</p>
                                  <span className="text-[11px] text-slate-400">
                                    {lead.branch === "DHK-HQ" ? t.dhakaHq : t.khulnaBranch}
                                  </span>
                                </td>
                                <td className="px-4 py-3.5">
                                  <select
                                    value={lead.status}
                                    onChange={(e) => {
                                      const nextStatus = e.target.value as LeadStatus;
                                      updateCrmLeadStatus(lead.id, nextStatus);
                                      setStore({ ...getCmsStore() });
                                      showToast(
                                        nextStatus === "ADMITTED"
                                          ? `${lead.name} — ${tr("ভর্তি সম্পন্ন ও ভিসা পাইপলাইনে সিঙ্ক হয়েছে", "Admitted & synced to visa pipeline", "入学手続完了・ビザパイプライン連携済")}`
                                          : `${lead.name} — ${nextStatus}`,
                                      );
                                    }}
                                    className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:border-slate-400 focus:outline-hidden"
                                  >
                                    <option value="NEW">{t.crm.statuses.NEW}</option>
                                    <option value="CONTACTED">{t.crm.statuses.CONTACTED}</option>
                                    <option value="COUNSELED">{t.crm.statuses.COUNSELED}</option>
                                    <option value="OFFICE_VISIT_BOOKED">{t.crm.statuses.OFFICE_VISIT_BOOKED}</option>
                                    <option value="ADMITTED">{t.crm.statuses.ADMITTED}</option>
                                    <option value="ARCHIVED">{t.crm.statuses.ARCHIVED}</option>
                                  </select>
                                </td>
                                <td className="px-4 py-3.5 text-right">
                                  <div className="inline-flex flex-wrap items-center justify-end gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => setSelectedLeadForProfile(lead)}
                                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                                    >
                                      <UserCheck className="h-3.5 w-3.5 text-[#b91c1c]" />
                                      <span>{tr("প্রোফাইল ও ভর্তি", "360° Profile", "360°プロファイル")}</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => openStudentPaymentModal(lead)}
                                      className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 border border-emerald-200/80 px-2.5 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition"
                                      title="Collect Fee Installment"
                                    >
                                      <DollarSign className="h-3 w-3 text-emerald-700" />
                                      <span>{tr("ফি জমা", "Fee", "入金")}</span>
                                    </button>
                                    {!lead.isFileOpened && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          promoteLeadToVisaPipeline({ leadId: lead.id });
                                          setStore({ ...getCmsStore() });
                                          showToast(`${lead.name} ${tr("ভিসা পাইপলাইনে যুক্ত হয়েছে", "promoted to visa pipeline", "ビザパイプラインに追加されました")}`);
                                        }}
                                        className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 transition"
                                        title="Promote to 10-Step Visa Pipeline"
                                      >
                                        <FileCheck2 className="h-3 w-3" />
                                        <span>{tr("পাইপলাইন", "Pipeline", "パイプライン")}</span>
                                      </button>
                                    )}
                                    <a
                                      href={waLink}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition"
                                    >
                                      <Send className="h-3 w-3" />
                                    </a>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                          {filteredLeads.length === 0 && (
                            <tr>
                              <td colSpan={7} className="py-12 text-center">
                                <p className="text-sm font-semibold text-slate-600">
                                  {tr(
                                    "কোনো CRM লিড পাওয়া যায়নি",
                                    "No matching CRM leads found",
                                    "条件に一致するCRMリードが見つかりません",
                                  )}
                                </p>
                                <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => setCrmImportExportMode("IMPORT")}
                                    className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-900 hover:bg-emerald-100 transition"
                                  >
                                    <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-700" />
                                    <span>
                                      {tr(
                                        "Google Sheet থেকে লিড ইমপোর্ট করুন",
                                        "Import Leads from Google Sheet",
                                        "Googleシートからインポート"
                                      )}
                                    </span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setActiveModal("ADD_LEAD")}
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#b91c1c] px-4 py-2 text-xs font-semibold text-white hover:bg-red-800 transition"
                                  >
                                    <Plus className="h-3.5 w-3.5" />
                                    <span>{t.crm.quickAddBtn}</span>
                                  </button>
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

              {/* =========================================================================
                  MODULE 3: VISA PROCESSING ENGINE & 10-STEP KANBAN
                  ========================================================================= */}
              {activeTab === "visa" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                    <div className="hover-spotlight rounded-2xl border border-slate-200/80 bg-white p-5">
                      <div className="flex items-center gap-2">
                        <Calculator className="h-4 w-4 text-[#b91c1c]" />
                        <h3 className="text-sm font-bold text-slate-900">{t.visa.calcTitle}</h3>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{t.visa.calcSubtitle}</p>

                      <div className="mt-4 space-y-3 text-xs">
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="text-[11px] font-medium text-slate-500">GPA</label>
                            <input
                              type="number"
                              step="0.1"
                              defaultValue="2.5"
                              className="mt-1 w-full rounded-lg border border-slate-200 px-2.5 py-1.5 font-semibold tabular-nums"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-medium text-slate-500">Age</label>
                            <input
                              type="number"
                              defaultValue="24"
                              className="mt-1 w-full rounded-lg border border-slate-200 px-2.5 py-1.5 font-semibold tabular-nums"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-medium text-slate-500">Gap (Yrs)</label>
                            <input
                              type="number"
                              defaultValue="2"
                              className="mt-1 w-full rounded-lg border border-slate-200 px-2.5 py-1.5 font-semibold tabular-nums"
                            />
                          </div>
                        </div>
                        <div className="rounded-xl bg-emerald-50/70 p-3 border border-emerald-200/70 text-emerald-900">
                          <p className="font-bold text-xs flex items-center gap-1.5">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                            <span>{t.visa.eligibleTitle}</span>
                          </p>
                          <p className="text-[11px] mt-1 text-emerald-700 leading-relaxed">
                            {t.visa.eligibleDesc}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="hover-spotlight rounded-2xl border border-slate-200/80 bg-white p-5 lg:col-span-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">{t.visa.sponsorTitle}</h3>
                          <p className="text-xs text-slate-400 mt-0.5">{t.visa.sponsorSubtitle}</p>
                        </div>
                        <span className="text-[11px] font-semibold text-emerald-700">
                          {t.visa.bankSupportBadge}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5">
                          <p className="font-semibold text-slate-900">{t.visa.sponsorApprovedTitle}</p>
                          <p className="mt-1 text-slate-500">{t.visa.sponsorApprovedDesc}</p>
                          <p className="mt-2 font-semibold text-slate-800">{t.visa.sponsorPhoneReq}</p>
                        </div>
                        <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5">
                          <p className="font-semibold text-slate-900">{t.visa.bankSolvencyTitle}</p>
                          <p className="mt-1 text-slate-500">{t.visa.bankSolvencyDesc}</p>
                          <p className="mt-2 font-semibold text-emerald-700">{t.visa.approvedBanksDesc}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 10-Step Visa Kanban Pipeline */}
                  <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                      <div>
                        <h3 className="text-base font-bold text-slate-900">{t.visa.pipelineTitle}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">{t.visa.pipelineSubtitle}</p>
                      </div>
                      <span className="text-xs font-medium text-emerald-700">{t.visa.dragActive}</span>
                    </div>

                    <div className="mt-4 flex gap-3.5 overflow-x-auto pb-3">
                      {t.visa.stages.map((col) => {
                        const applicantsInStage = filteredVisaApplicants.filter(
                          (v) => v.stage === col.stage,
                        );
                        return (
                          <div
                            key={col.stage}
                            className="min-w-[245px] shrink-0 rounded-xl border border-slate-200/70 bg-slate-50/60 p-3"
                          >
                            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                              <div>
                                <p className="font-bold text-xs text-slate-900">{col.name}</p>
                                <p className="text-[10px] text-slate-400">{col.desc}</p>
                              </div>
                              <span className="text-xs font-bold text-slate-500 tabular-nums">
                                {applicantsInStage.length}
                              </span>
                            </div>

                            <div className="mt-2.5 space-y-2">
                              {applicantsInStage.map((app) => {
                                const linkedAgent = app.referredByAgentId
                                  ? store.b2bAgents.find((a) => a.id === app.referredByAgentId)
                                  : null;
                                const linkedOfficer = app.assignedVisaOfficerId
                                  ? store.staffList.find((s) => s.id === app.assignedVisaOfficerId)
                                  : null;
                                const dueAmt =
                                  app.dueAmountBdt ??
                                  Math.max(0, (app.contractAmountBdt || 120000) - (app.paidAmountBdt || 0));

                                return (
                                  <div
                                    key={app.id}
                                    className="rounded-xl border border-slate-200/80 bg-white p-3 shadow-2xs hover:border-slate-300 transition"
                                  >
                                    <div className="flex justify-between items-center">
                                      <span className="text-[10px] font-mono text-slate-400">
                                        {app.trackingNo}
                                      </span>
                                      <span className="text-[10px] font-semibold text-slate-600">
                                        {app.packageType === "PREMIUM"
                                          ? t.visa.packagePremium
                                          : t.visa.packageRegular}
                                      </span>
                                    </div>
                                    <p className="font-bold text-xs text-slate-900 mt-1">{app.name}</p>
                                    <p className="text-[11px] font-medium text-slate-600 truncate">
                                      🏫 {app.targetSchool}
                                    </p>
                                    {linkedAgent && (
                                      <p className="text-[10px] text-amber-700 font-medium mt-0.5 truncate">
                                        {tr("এজেন্ট:", "Agent:", "代理店:")} {linkedAgent.organizationName}
                                      </p>
                                    )}
                                    {linkedOfficer && (
                                      <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                                        {tr("অফিসার:", "Officer:", "担当官:")} {linkedOfficer.name}
                                      </p>
                                    )}
                                    <div className="mt-1.5 flex items-center justify-between text-[10px] tabular-nums">
                                      <span className="text-emerald-700 font-semibold">
                                        {tr("জমা:", "Paid:", "入金:")} ৳{(app.paidAmountBdt || 0).toLocaleString()}
                                      </span>
                                      {dueAmt > 0 && (
                                        <span className="text-[#b91c1c] font-semibold">
                                          {tr("বকেয়া:", "Due:", "残金:")} ৳{dueAmt.toLocaleString()}
                                        </span>
                                      )}
                                    </div>
                                    <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-slate-100">
                                      <span className="text-[10px] text-slate-400 truncate max-w-[110px]">
                                        {app.intakeSession}
                                      </span>
                                      {col.stage < 10 && (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const nextStage = (col.stage + 1) as VisaStage;
                                            updateVisaStage(app.id, nextStage);
                                            setStore({ ...getCmsStore() });
                                            if (nextStage === 6 && linkedAgent) {
                                              showToast(
                                                `${app.name} → COE অনুমোদিত! (${linkedAgent.organizationName}-এর কমিশন যুক্ত হয়েছে)`,
                                              );
                                            } else {
                                              showToast(`${app.name} → Step ${nextStage}`);
                                            }
                                          }}
                                          className="inline-flex items-center gap-0.5 rounded-lg bg-slate-900 px-2 py-1 text-[10px] font-semibold text-white hover:bg-emerald-700 transition"
                                        >
                                          <span>{t.visa.nextStageBtn}</span>
                                          <ChevronRight className="h-3 w-3" />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                              {applicantsInStage.length === 0 && (
                                <div className="py-6 text-center text-[11px] text-slate-400">
                                  {t.visa.noApplicants}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* =========================================================================
                  MODULE 4: LANGUAGE COURSE & EXTERNAL LMS BRIDGE
                  ========================================================================= */}
              {activeTab === "lms" && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                        {t.lms.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{t.lms.subtitle}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveModal("ADD_LMS")}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#b91c1c] px-4 py-2 text-xs font-semibold text-white hover:bg-red-800 transition"
                      >
                        <Plus className="h-4 w-4" />
                        <span>{t.lms.issueAccountBtn}</span>
                      </button>
                      <a
                        href="https://npw.bd/knltc"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                      >
                        <span>{t.lms.npwClassroom}</span>
                        <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                      </a>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="hover-spotlight rounded-2xl border border-slate-200/80 bg-white p-5">
                      <span className="text-xs text-slate-500">{t.lms.courseFeeTitle}</span>
                      <p className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">৳ 12,000</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{t.lms.courseFeeDesc}</p>
                    </div>
                    <div className="hover-spotlight rounded-2xl border border-slate-200/80 bg-white p-5">
                      <span className="text-xs text-slate-500">{t.lms.portalFeeTitle}</span>
                      <p className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">৳ 2,000</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{t.lms.portalFeeDesc}</p>
                    </div>
                    <div className="hover-spotlight rounded-2xl border border-slate-200/80 bg-white p-5">
                      <span className="text-xs text-slate-500">{t.lms.netMarginTitle}</span>
                      <p className="text-2xl font-bold text-emerald-700 mt-1 tabular-nums">৳ 10,000</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{t.lms.netMarginDesc}</p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                      <h3 className="font-bold text-sm text-slate-900">{t.lms.tableHeading}</h3>
                      <span className="text-xs text-slate-400 tabular-nums">
                        {store.lmsBridges.length} {tr("জন শিক্ষার্থী", "students", "名の生徒")}
                      </span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50/70 border-b border-slate-100 font-semibold text-slate-500">
                          <tr>
                            <th className="px-4 py-3">{t.lms.colStudent}</th>
                            <th className="px-4 py-3">{t.lms.colCourse}</th>
                            <th className="px-4 py-3">{t.lms.colCredentials}</th>
                            <th className="px-4 py-3">{t.lms.colMargin}</th>
                            <th className="px-4 py-3">{t.lms.colProgress}</th>
                            <th className="px-4 py-3 text-right">{t.lms.colAction}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {store.lmsBridges.map((lms) => {
                            const rawLmsPhone = String(lms.phone || "");
                            const msg = encodeURIComponent(
                              `Congratulations ${lms.studentName}!\nYour KNLTC Course ID: ${lms.enrollmentNo}.\nPortal: https://npw.bd/knltc\nUsername: ${lms.portalUsername}\nPassword: ${lms.portalPasswordMasked}`,
                            );
                            const waUrl = `https://wa.me/${rawLmsPhone.replace(/[^0-9]/g, "")}?text=${msg}`;

                            return (
                              <tr key={lms.id} className="hover:bg-slate-50/70">
                                <td className="px-4 py-3.5">
                                  <p className="font-bold text-slate-900">{lms.studentName}</p>
                                  <p className="text-[11px] font-mono text-slate-400">{rawLmsPhone}</p>
                                </td>
                                <td className="px-4 py-3.5">
                                  <span className="font-semibold text-slate-900">{lms.courseLevel}</span>
                                  <p className="text-[11px] text-slate-400">{lms.activeBatch}</p>
                                </td>
                                <td className="px-4 py-3.5 font-mono">
                                  <p className="font-semibold text-slate-800">{lms.portalUsername}</p>
                                  <p className="text-[11px] text-slate-400">{lms.portalPasswordMasked}</p>
                                </td>
                                <td className="px-4 py-3.5 tabular-nums">
                                  <p className="font-semibold text-emerald-700">
                                    ৳{(lms.netKnlTcMarginBdt || 0).toLocaleString()}
                                  </p>
                                </td>
                                <td className="px-4 py-3.5">
                                  <div className="w-24 bg-slate-100 rounded-full h-1.5">
                                    <div
                                      className="bg-emerald-600 h-1.5 rounded-full"
                                      style={{ width: `${lms.progressPercentage}%` }}
                                    />
                                  </div>
                                  <span className="text-[10px] text-slate-400 mt-1 inline-block tabular-nums">
                                    {lms.progressPercentage}%
                                  </span>
                                </td>
                                <td className="px-4 py-3.5 text-right">
                                  <a
                                    href={waUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition"
                                  >
                                    <Send className="h-3 w-3" />
                                    <span>{t.lms.sendWaBtn}</span>
                                  </a>
                                </td>
                              </tr>
                            );
                          })}
                          {store.lmsBridges.length === 0 && (
                            <tr>
                              <td colSpan={6} className="py-10 text-center text-slate-400">
                                {tr("কোনো LMS অ্যাকাউন্ট ইস্যু করা হয়নি।", "No LMS accounts issued yet.", "LMSアカウントはまだ発行されていません。")}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* =========================================================================
                  MODULE 5: B2B CHANNEL, JAPANESE PARTNER SCHOOLS & SUB-AGENTS
                  (With Full Add / Edit / Delete Capabilities & Generic Titles)
                  ========================================================================= */}
              {activeTab === "b2b" && (
                <div className="space-y-6">
                  {/* Clean Header with Add Partner School & Add B2B Agent Buttons */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                        {t.b2b.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{t.b2b.subtitle}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => openPartnerSchoolModal()}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-800 hover:bg-slate-50 transition shadow-2xs"
                      >
                        <Building2 className="h-4 w-4 text-[#b91c1c]" />
                        <span>
                          {tr("+ জাপানি পার্টনার স্কুল যোগ করুন", "+ Add Partner School", "+ 提携日本語学校を追加")}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => openB2bAgentModal()}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#b91c1c] px-4 py-2.5 text-xs font-semibold text-white hover:bg-red-800 transition shadow-2xs"
                      >
                        <Plus className="h-4 w-4" />
                        <span>
                          {tr("+ নতুন বিটুবি এজেন্ট যোগ করুন", "+ Add B2B Agent", "+ B2Bエージェントを追加")}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Partner Japanese Schools & Universities Section */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-900">
                        {tr(
                          "জাপানি পার্টনার ভাষা স্কুল, ইউনিভার্সিটি ও কলেজ তালিকা",
                          "Partner Japanese Language Schools, Universities & Colleges",
                          "提携日本語学校・大学・教育機関",
                        )}
                      </h3>
                      <span className="text-xs text-slate-400 tabular-nums">
                        {store.partnerSchools.length}{" "}
                        {tr("টি প্রতিষ্ঠান", "institutions", "校・機関")}
                      </span>
                    </div>

                    {store.partnerSchools.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {store.partnerSchools.map((sch) => {
                          const quota = sch.intakeQuota || 20;
                          const quotaPct = Math.min(
                            100,
                            Math.round(((sch.activeStudentsCount || 0) / quota) * 100),
                          );
                          const schName = sch.name || (sch as any).schoolName || "Partner School";
                          const coeStudentsForSchool = (store.visaApplicants || []).filter(
                            (v) =>
                              (v.targetSchoolId === sch.id ||
                                (v.targetSchool &&
                                  String(v.targetSchool).toLowerCase() ===
                                    schName.toLowerCase())) &&
                              v.stage >= 6,
                          ).length;
                          const schoolDocs = getSchoolDocumentVault(sch);
                          const readySchoolDocs = schoolDocs.filter(
                            (d) => d.status === "VERIFIED" || d.status === "UPLOADED",
                          ).length;

                          return (
                            <div
                              key={sch.id}
                              className="hover-spotlight rounded-2xl border border-slate-200/80 bg-white p-5"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-start gap-3.5 min-w-0">
                                  <button
                                    type="button"
                                    onClick={() => setSelectedSchoolForProfile(sch)}
                                    className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50/70 hover:border-slate-300 transition"
                                    title="Open 360° School Profile"
                                  >
                                    {sch.logoUrl ? (
                                      <img
                                        src={sch.logoUrl}
                                        alt={sch.name}
                                        referrerPolicy="no-referrer"
                                        className="h-full w-full object-contain p-1"
                                      />
                                    ) : (
                                      <Building2 className="h-5 w-5 text-[#b91c1c]" />
                                    )}
                                  </button>

                                  <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
                                      <span className="font-semibold text-[#b91c1c]">
                                        {sch.institutionType === "UNIVERSITY"
                                          ? tr("ইউনিভার্সিটি", "University", "大学")
                                          : sch.institutionType === "VOCATIONAL_COLLEGE"
                                            ? tr("ভোকেশনাল কলেজ", "Vocational College", "専門学校")
                                            : sch.institutionType === "SSW_EMPLOYER"
                                              ? tr("SSW নিয়োগদাতা", "SSW Employer", "特定技能受入企業")
                                              : tr("ভাষা স্কুল", "Language School", "日本語学校")}
                                      </span>
                                      <span aria-hidden="true">·</span>
                                      <span className="font-medium text-slate-700">
                                        {sch.location}
                                      </span>
                                      <span aria-hidden="true">·</span>
                                      <span className="font-medium text-emerald-700">
                                        {readySchoolDocs}/{schoolDocs.length}{" "}
                                        {tr("ব্রশিউর/MOU", "Docs", "提出書類")}
                                      </span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => setSelectedSchoolForProfile(sch)}
                                      className="text-left group"
                                    >
                                      <h4 className="text-base font-bold text-slate-900 mt-0.5 group-hover:text-[#b91c1c] transition">
                                        {sch.name}
                                      </h4>
                                    </button>
                                    {sch.japaneseName && (
                                      <p className="text-xs text-slate-400">{sch.japaneseName}</p>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-1 shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => setSelectedSchoolForProfile(sch)}
                                    className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-2.5 py-1.5 text-[11px] font-semibold text-white hover:bg-slate-800 transition"
                                  >
                                    <FileText className="h-3 w-3" />
                                    <span>
                                      {tr("৩৬০° প্রোফাইল", "360° Profile", "360°プロファイル")}
                                    </span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => openPartnerSchoolModal(sch)}
                                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                                    title="Quick Edit"
                                  >
                                    <Edit3 className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      deletePartnerSchool(sch.id);
                                      setStore({ ...getCmsStore() });
                                      showToast(
                                        tr(
                                          `${sch.name} মুছে ফেলা হয়েছে`,
                                          `${sch.name} removed`,
                                          `${sch.name}を削除しました`,
                                        ),
                                      );
                                    }}
                                    className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-[#b91c1c] transition"
                                    title="Delete School"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </div>

                              {/* Seat Quota Progress Bar */}
                              <div className="mt-3.5 rounded-xl bg-slate-50/80 border border-slate-100 p-3">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="font-semibold text-slate-600">
                                    {tr("সিট কোটা ও ভর্তি অগ্রগতি", "Intake Seat Quota", "入学定員・進捗")}
                                  </span>
                                  <span className="font-bold text-slate-900 tabular-nums">
                                    {sch.activeStudentsCount} / {quota} {t.b2b.studentsSuffix} (
                                    {quotaPct}%)
                                  </span>
                                </div>
                                <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-200/80 overflow-hidden">
                                  <div
                                    className="h-full rounded-full bg-[#b91c1c] transition-all"
                                    style={{ width: `${quotaPct}%` }}
                                  />
                                </div>
                              </div>

                              <div className="mt-3.5 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-slate-100 pt-3.5 text-xs">
                                <div>
                                  <span className="text-slate-400 block text-[11px]">
                                    {tr("১ম বর্ষ টিউশন ফি", "1st Yr Tuition", "初年度学費")}
                                  </span>
                                  <p className="font-semibold text-slate-800 mt-0.5 tabular-nums">
                                    {sch.firstYearTuitionYen
                                      ? `¥${sch.firstYearTuitionYen.toLocaleString()}`
                                      : "¥760,000"}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-slate-400 block text-[11px]">
                                    {t.b2b.commissionRate}
                                  </span>
                                  <p className="font-semibold text-slate-900 mt-0.5 tabular-nums">
                                    ¥{(sch.commissionPerStudentYen || 0).toLocaleString()}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-slate-400 block text-[11px]">
                                    {tr("COE অনুমোদিত", "COE Approved", "COE交付済")}
                                  </span>
                                  <p className="font-bold text-slate-900 mt-0.5 tabular-nums">
                                    {coeStudentsForSchool} {t.b2b.studentsSuffix}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-slate-400 block text-[11px]">
                                    {t.b2b.totalEarned}
                                  </span>
                                  <p className="font-bold text-emerald-700 mt-0.5 tabular-nums">
                                    ¥{(sch.totalCommissionReceivedYen || 0).toLocaleString()}
                                  </p>
                                </div>
                              </div>

                              {/* Quick Actions: 360 Brochure Vault + 1-Click Claim Commission */}
                              <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                                <button
                                  type="button"
                                  onClick={() => setSelectedSchoolForProfile(sch)}
                                  className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 underline underline-offset-2"
                                >
                                  {tr(
                                    "ব্রশিউর, প্রসপেক্টাস, লোগো ও চুক্তিপত্র ভল্ট দেখুন →",
                                    "Open Brochure, Logo & MOU Vault →",
                                    "パンフレット・募集要項・協定書Vaultを見る →",
                                  )}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (!sch.commissionPerStudentYen) {
                                      setSelectedSchoolForProfile(sch);
                                      return;
                                    }
                                    const tx = claimPartnerSchoolCommission(sch.id, 1);
                                    if (tx) {
                                      setStore({ ...getCmsStore() });
                                      showToast(
                                        tr(
                                          `${sch.name}: ¥${sch.commissionPerStudentYen.toLocaleString()} (৳${tx.amountBdt.toLocaleString()}) কমিশন ফাইন্যান্স লেজারে যুক্ত হয়েছে`,
                                          `${sch.name}: ¥${sch.commissionPerStudentYen.toLocaleString()} (৳${tx.amountBdt.toLocaleString()}) commission added to Finance ledger`,
                                          `${sch.name}: 手数料¥${sch.commissionPerStudentYen.toLocaleString()}（৳${tx.amountBdt.toLocaleString()}）を出納帳に記録しました`,
                                        ),
                                      );
                                    }
                                  }}
                                  className="inline-flex items-center gap-1 rounded-xl bg-emerald-700 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-emerald-800 transition"
                                >
                                  <Coins className="h-3.5 w-3.5" />
                                  <span>
                                    {tr(
                                      "+ ১ স্টুডেন্ট কমিশন ক্লেইম (JPY➔BDT)",
                                      "+ Claim 1 Student Commission",
                                      "+ 生徒1名分の手数料申請 (JPY➔BDT)",
                                    )}
                                  </span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center">
                        <Building2 className="h-8 w-8 text-slate-300 mx-auto mb-2.5" />
                        <p className="mx-auto text-sm font-semibold text-slate-700">
                          {tr(
                            "এখনো কোনো জাপানি পার্টনার স্কুল বা ইউনিভার্সিটি যোগ করা হয়নি",
                            "No Japanese partner schools added yet",
                            "提携教育機関はまだ登録されていません",
                          )}
                        </p>
                        <p className="mx-auto text-xs text-slate-400 mt-1">
                          {tr(
                            "আপনার চুক্তিবদ্ধ জাপানি ভাষা স্কুল, ইউনিভার্সিটি, ব্রশিউর ও কমিশনের তথ্য যোগ করুন।",
                            "Add your partnered Japanese schools to track students, brochures, and yen commissions.",
                            "提携日本語学校、大学、パンフレットおよび手数料情報を登録してください。",
                          )}
                        </p>
                        <button
                          type="button"
                          onClick={() => openPartnerSchoolModal()}
                          className="mt-3.5 inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>
                            {tr(
                              "প্রথম পার্টনার স্কুল যোগ করুন",
                              "Add First Partner School",
                              "提携校を登録する",
                            )}
                          </span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* B2B Sub-Agent & Partner Commission Ledger */}
                  <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-sm text-slate-900">{t.b2b.ledgerTitle}</h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {tr(
                            "বিটুবি এজেন্টের ট্রেড লাইসেন্স, চুক্তিপত্র (MOU), রেফার্ড স্টুডেন্ট ও স্বয়ংক্রিয় COE কমিশন লেজার",
                            "Manage your B2B agencies, trade licenses, MOUs, and auto-accrued COE commissions",
                            "B2B代理店のライセンス、協定書(MOU)、紹介生徒およびCOE手数料台帳",
                          )}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => openB2bAgentModal()}
                        className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>{tr("এজেন্ট যোগ করুন", "Add Agent", "代理店を追加")}</span>
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50/70 border-b border-slate-100 font-semibold text-slate-500">
                          <tr>
                            <th className="px-4 py-3">{t.b2b.colAgent}</th>
                            <th className="px-4 py-3">{t.b2b.colTypeCity}</th>
                            <th className="px-4 py-3">{t.b2b.colReferred}</th>
                            <th className="px-4 py-3">{t.b2b.colSuccessfulVisas}</th>
                            <th className="px-4 py-3">{t.b2b.colAgreedCommission}</th>
                            <th className="px-4 py-3">{t.b2b.colPaidVsPending}</th>
                            <th className="px-4 py-3 text-right">
                              {tr("৩৬০° প্রোফাইল ও অ্যাকশন", "360° Profile & Actions", "360°プロファイル＆操作")}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {store.b2bAgents.map((agent) => {
                            const agentDocs = getB2bAgentDocumentVault(agent);
                            const readyAgentDocs = agentDocs.filter(
                              (d) => d.status === "VERIFIED" || d.status === "UPLOADED",
                            ).length;
                            const orgName =
                              agent.organizationName ||
                              (agent as any).agencyName ||
                              "B2B Partner";
                            const contactPerson = agent.contactPerson || "Contact Person";
                            const agreedBdt = agent.agreedCommissionBdt || 0;
                            const paidBdt = agent.paidCommissionBdt || 0;
                            const pendingBdt = agent.pendingCommissionBdt || 0;

                            return (
                              <tr key={agent.id} className="hover:bg-slate-50/70 transition-colors">
                                <td className="px-4 py-3.5">
                                  <div className="flex items-center gap-3">
                                    <button
                                      type="button"
                                      onClick={() => setSelectedAgentForProfile(agent)}
                                      className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 hover:border-slate-300 transition"
                                    >
                                      {agent.logoUrl ? (
                                        <img
                                          src={agent.logoUrl}
                                          alt={orgName}
                                          referrerPolicy="no-referrer"
                                          className="h-full w-full object-contain p-0.5"
                                        />
                                      ) : (
                                        <Briefcase className="h-4 w-4 text-emerald-700" />
                                      )}
                                    </button>
                                    <div>
                                      <button
                                        type="button"
                                        onClick={() => setSelectedAgentForProfile(agent)}
                                        className="font-bold text-slate-900 hover:text-[#b91c1c] transition text-left"
                                      >
                                        {orgName}
                                      </button>
                                      <p className="text-slate-400 text-[11px]">
                                        {contactPerson} ·{" "}
                                        <span className="font-mono">{agent.phone || "No phone"}</span>
                                        {" · "}
                                        <span className="text-emerald-700 font-semibold">
                                          {readyAgentDocs}/{agentDocs.length}{" "}
                                          {tr("ডকুমেন্ট", "Docs", "提出書類")}
                                        </span>
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3.5">
                                  <span className="text-[11px] font-medium text-slate-700 block">
                                    {agent.agentType || "LOCAL_SUB_AGENT"}
                                  </span>
                                  <span className="text-[11px] text-slate-400">
                                    {agent.city || "Dhaka"}
                                    {agent.tradeLicenseNo
                                      ? ` · TL: ${agent.tradeLicenseNo}`
                                      : ""}
                                  </span>
                                </td>
                                <td className="px-4 py-3.5 font-semibold text-slate-800 tabular-nums">
                                  {agent.referredStudentsCount || 0} {t.b2b.studentsSuffix}
                                </td>
                                <td className="px-4 py-3.5 font-bold text-emerald-700 tabular-nums">
                                  {agent.successfulVisasCount || 0} {t.b2b.studentsSuffix}
                                </td>
                                <td className="px-4 py-3.5 font-semibold text-slate-900 tabular-nums">
                                  ৳{agreedBdt.toLocaleString()}
                                </td>
                                <td className="px-4 py-3.5 tabular-nums">
                                  <span className="text-emerald-700 font-semibold block">
                                    {t.b2b.paidPrefix} ৳{paidBdt.toLocaleString()}
                                  </span>
                                  <span className="text-amber-600 text-[11px] font-medium block">
                                    {t.b2b.pendingPrefix} ৳
                                    {pendingBdt.toLocaleString()}
                                  </span>
                                </td>
                                <td className="px-4 py-3.5 text-right">
                                  <div className="inline-flex items-center justify-end gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => setSelectedAgentForProfile(agent)}
                                      className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-2.5 py-1.5 text-[11px] font-semibold text-white hover:bg-slate-800 transition"
                                    >
                                      <FileText className="h-3 w-3" />
                                      <span>
                                        {tr(
                                          "৩৬০° প্রোফাইল ও লাইসেন্স",
                                          "360° Profile",
                                          "360°プロファイル＆ライセンス",
                                        )}
                                      </span>
                                    </button>
                                    {pendingBdt > 0 && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const tx = settleB2bAgentCommission(agent.id);
                                          if (tx) {
                                            setStore({ ...getCmsStore() });
                                            showToast(
                                              tr(
                                                `${agent.organizationName}: ৳${tx.amountBdt.toLocaleString()} কমিশন পরিশোধ ও লেজারে রেকর্ড হয়েছে`,
                                                `${agent.organizationName}: ৳${tx.amountBdt.toLocaleString()} commission settled`,
                                                `${agent.organizationName}: 手数料৳${tx.amountBdt.toLocaleString()}の精算を完了しました`,
                                              ),
                                            );
                                          }
                                        }}
                                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-700 px-2.5 py-1.5 text-[11px] font-semibold text-white hover:bg-emerald-800 transition"
                                        title="Settle Pending Commission & Record Expense"
                                      >
                                        <CheckCircle2 className="h-3 w-3" />
                                        <span>{tr("কমিশন দিন", "Pay Due", "手数料精算")}</span>
                                      </button>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => openB2bAgentModal(agent)}
                                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                                      title="Quick Edit Agent"
                                    >
                                      <Edit3 className="h-3.5 w-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        deleteB2bAgent(agent.id);
                                        setStore({ ...getCmsStore() });
                                        showToast(
                                          tr(
                                            `${agent.organizationName} মুছে ফেলা হয়েছে`,
                                            `${agent.organizationName} removed`,
                                            `${agent.organizationName}を削除しました`,
                                          ),
                                        );
                                      }}
                                      className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-[#b91c1c] transition"
                                      title="Delete Agent"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                          {store.b2bAgents.length === 0 && (
                            <tr>
                              <td colSpan={7} className="py-12 text-center">
                                <div className="flex flex-col items-center justify-center text-center">
                                  <Briefcase className="h-8 w-8 text-slate-300 mx-auto mb-2.5" />
                                  <p className="mx-auto text-sm font-semibold text-slate-700">
                                    {tr(
                                      "কোনো বিটুবি এজেন্ট বা সাব-এজেন্টের তথ্য নেই",
                                      "No B2B agents or sub-agents added yet",
                                      "B2B代理店はまだ登録されていません",
                                    )}
                                  </p>
                                  <p className="mx-auto text-xs text-slate-400 mt-1">
                                    {tr(
                                      "আপনার প্রতিষ্ঠানের বিটুবি এজেন্ট, ট্রেড লাইসেন্স ও কমিশন হিসাব রাখতে নতুন এজেন্ট যুক্ত করুন।",
                                      "Click below to add your B2B partner agencies, licenses, and commission details.",
                                      "提携代理店、事業ライセンス、手数料管理のため新規代理店を登録してください。",
                                    )}
                                  </p>
                                  <button
                                    type="button"
                                    onClick={() => openB2bAgentModal()}
                                    className="mt-3.5 inline-flex items-center gap-1.5 rounded-xl bg-[#b91c1c] px-4 py-2 text-xs font-semibold text-white hover:bg-red-800 transition"
                                  >
                                    <Plus className="h-3.5 w-3.5" />
                                    <span>
                                      {tr(
                                        "নতুন বিটুবি এজেন্ট যোগ করুন",
                                        "Add New B2B Agent",
                                        "新規B2B代理店を追加",
                                      )}
                                    </span>
                                  </button>
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

              {/* =========================================================================
              {/* =========================================================================
                  MODULE 6: INDUSTRY-GRADE FINANCE, LEDGER & INVESTOR OPEN-BOOK PORTAL
                  ========================================================================= */}
              {activeTab === "finance" && (
                <div className="space-y-6">
                  {/* Top Action Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-lg bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200/60 uppercase tracking-wider">
                          {tr("অডিট ভেরিফাইড", "Audit Verified", "監査認証済")}
                        </span>
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                          {tr(
                            "ফাইন্যান্সিয়াল ম্যানেজমেন্ট ও ক্যাশফ্লো হাব",
                            "Financial Management & Cashflow Hub",
                            "財務・キャッシュフロー管理ハブ",
                          )}
                        </h2>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        {tr(
                          "কোর্স ফি, প্রি-ভিসা COE সার্ভিস চার্জ (৳১.২ লক্ষ), অল-ইন-ওয়ান প্যাকেজ ও প্রাতিষ্ঠানিক ব্যয়ের পূর্ণাঙ্গ খতিয়ান।",
                          "Tuition fees, COE service charges (৳1.2L), all-in-one packages, and operational expenditure ledger.",
                          "授業料、COE申請手数料（12万BDT）、パッケージ費用および運営経費の完全な出納帳。",
                        )}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveModal("ADD_PAYMENT")}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-semibold text-white hover:bg-emerald-800 transition shadow-2xs"
                      >
                        <Plus className="h-4 w-4" />
                        <span>{tr("+ আয় গ্রহণ (Student Fee)", "+ Record Income", "+ 収入を記録（学費等）")}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveModal("ADD_EXPENSE")}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#b91c1c] px-4 py-2.5 text-xs font-semibold text-white hover:bg-red-800 transition shadow-2xs"
                      >
                        <ArrowDownRight className="h-4 w-4" />
                        <span>{tr("+ ব্যয় রেকর্ড (Expense)", "+ Record Expense", "+ 経費・支出を記録")}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const csvRows = [
                            ["Receipt No", "Date", "Name / Payee", "Category", "Type", "Amount (BDT)", "Method", "Trx ID", "Branch"],
                            ...store.transactions.map((tx) => [
                              tx.receiptNo,
                              tx.date,
                              `"${(tx.studentName || "").replace(/"/g, '""')}"`,
                              tx.category || (tx.type.startsWith("EXPENSE") ? "EXPENSE" : "INCOME"),
                              tx.type,
                              tx.amountBdt,
                              tx.paymentMethod,
                              tx.referenceOrTrx,
                              tx.branch,
                            ]),
                          ];
                          const csvString = csvRows.map((r) => r.join(",")).join("\n");
                          const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = `KNLTC_Finance_Ledger_${new Date().toISOString().slice(0, 10)}.csv`;
                          a.click();
                          URL.revokeObjectURL(url);
                          showToast(tr("লেজার CSV ফাইল ডাউনলোড হয়েছে", "Ledger exported to CSV", "出納帳をCSVエクスポートしました"));
                        }}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                        title="Export CSV"
                      >
                        <Download className="h-4 w-4 text-slate-500" />
                        <span className="hidden sm:inline">{tr("CSV এক্সপোর্ট", "Export CSV", "CSV出力")}</span>
                      </button>
                    </div>
                  </div>

                  {/* Finance Sub-Tab Selector */}
                  <div className="flex flex-wrap items-center gap-2 border-b border-slate-200/80 pb-2">
                    <button
                      type="button"
                      onClick={() => setFinanceSubTab("overview")}
                      className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                        financeSubTab === "overview"
                          ? "bg-slate-900 text-white shadow-2xs"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      {tr("সারসংক্ষেপ ও নগদ প্রবাহ (Overview)", "Overview & P&L", "概要・損益計算書")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setFinanceSubTab("ledger")}
                      className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition flex items-center gap-1.5 ${
                        financeSubTab === "ledger"
                          ? "bg-slate-900 text-white shadow-2xs"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <span>{tr("জেনারেল লেজার ও ট্রানজেকশন", "General Ledger", "総勘定元帳・取引履歴")}</span>
                      <span className="rounded-full bg-slate-200 px-1.5 py-0.5 text-[10px] font-bold text-slate-700">
                        {store.transactions.length}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFinanceSubTab("dues")}
                      className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition flex items-center gap-1.5 ${
                        financeSubTab === "dues"
                          ? "bg-slate-900 text-white shadow-2xs"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <span>{tr("শিক্ষার্থীদের বকেয়া ও কিস্তি (Student Dues)", "Student Dues & Contracts", "未収金・分割払管理")}</span>
                      <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800">
                        {store.crmLeads.filter((l) => (l.dueAmountBdt ?? ((l.contractAmountBdt || 0) - (l.paidAmountBdt || 0))) > 0).length}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFinanceSubTab("investor")}
                      className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                        financeSubTab === "investor"
                          ? "bg-slate-900 text-white shadow-2xs"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      {tr("ইনভেস্টর ওপেন-বুক পোর্টাল (১০ লক্ষ টাকা)", "Investor Open-Book", "投資家オープンブック（100万BDT）")}
                    </button>
                  </div>

                  {/* 1. OVERVIEW & P&L SUB-TAB */}
                  {financeSubTab === "overview" && (
                    <div className="space-y-6">
                      {/* 4 Financial Health KPI Cards */}
                      {(() => {
                        const totalInflow = store.transactions
                          .filter((t) => t.category !== "EXPENSE" && !t.type.startsWith("EXPENSE"))
                          .reduce((sum, t) => sum + t.amountBdt, 0);
                        const totalOutflow = store.transactions
                          .filter((t) => t.category === "EXPENSE" || t.type.startsWith("EXPENSE"))
                          .reduce((sum, t) => sum + t.amountBdt, 0);
                        const netMargin = totalInflow - totalOutflow;
                        const pendingB2bCommission = store.b2bAgents.reduce(
                          (sum, a) => sum + (a.pendingCommissionBdt || 0),
                          0,
                        );

                        return (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="hover-spotlight rounded-2xl border border-emerald-100 bg-white p-5">
                              <div className="flex items-center justify-between text-emerald-600">
                                <span className="text-xs font-semibold text-slate-500">
                                  {tr("মোট সংগৃহীত আয় (Inflow)", "Total Gross Income", "総収入（インフロー）")}
                                </span>
                                <TrendingUp className="h-4 w-4 text-emerald-600" />
                              </div>
                              <p className="mt-3 text-2xl font-bold text-slate-900 tabular-nums">
                                ৳{totalInflow.toLocaleString()}
                              </p>
                              <p className="mt-1 text-[11px] text-emerald-700 font-medium">
                                {tr("কোর্স ফি, সার্ভিস চার্জ ও অন্যান্য", "Tuition & Service fees", "学費・手続料・その他")}
                              </p>
                            </div>

                            <div className="hover-spotlight rounded-2xl border border-red-100 bg-white p-5">
                              <div className="flex items-center justify-between text-red-500">
                                <span className="text-xs font-semibold text-slate-500">
                                  {tr("মোট অপারেশনাল ব্যয় (Outflow)", "Total Expenditures", "総支出・運営経費")}
                                </span>
                                <TrendingDown className="h-4 w-4 text-[#b91c1c]" />
                              </div>
                              <p className="mt-3 text-2xl font-bold text-slate-900 tabular-nums">
                                ৳{totalOutflow.toLocaleString()}
                              </p>
                              <p className="mt-1 text-[11px] text-red-600 font-medium">
                                {tr("অফিস ভাড়া, সেন্সি পে-রোল ও মার্কেটিং", "Rent, payroll & marketing", "賃料・講師給与・広告費")}
                              </p>
                            </div>

                            <div className="hover-spotlight rounded-2xl border border-slate-200/80 bg-white p-5">
                              <div className="flex items-center justify-between text-slate-400">
                                <span className="text-xs font-semibold text-slate-500">
                                  {tr("নিট অপারেটিং মার্জিন", "Net Operating Margin", "営業純利益（マージン）")}
                                </span>
                                <DollarSign className={`h-4 w-4 ${netMargin >= 0 ? "text-emerald-600" : "text-amber-600"}`} />
                              </div>
                              <p className={`mt-3 text-2xl font-bold tabular-nums ${netMargin >= 0 ? "text-emerald-700" : "text-red-700"}`}>
                                ৳{netMargin.toLocaleString()}
                              </p>
                              <p className="mt-1 text-[11px] text-slate-400">
                                {netMargin >= 0
                                  ? tr("✓ ইতিবাচক নগদ উদ্বৃত্ত", "Positive Cash Surplus", "✓ 黒字キャッシュフロー")
                                  : tr("প্রাথমিক সেটআপ ইনভেস্টমেন্ট পর্যায়", "Initial Capital Phase", "初期投資・設立フェーズ")}
                              </p>
                            </div>

                            <div className="hover-spotlight rounded-2xl border border-amber-100 bg-white p-5">
                              <div className="flex items-center justify-between text-amber-500">
                                <span className="text-xs font-semibold text-slate-500">
                                  {tr("বিটুবি কমিশন বকেয়া", "Pending B2B Commission", "B2B未払手数料")}
                                </span>
                                <Briefcase className="h-4 w-4 text-amber-600" />
                              </div>
                              <p className="mt-3 text-2xl font-bold text-slate-900 tabular-nums">
                                ৳{pendingB2bCommission.toLocaleString()}
                              </p>
                              <p className="mt-1 text-[11px] text-amber-700 font-medium">
                                {tr("সাব-এজেন্ট প্রদেয় দায়", "Payable to verified sub-agents", "認証済代理店への支払予定")}
                              </p>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Currency Converter & Japan Study Cost Calculator */}
                      <div className="hover-spotlight rounded-2xl border border-slate-200/80 bg-white p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4">
                          <div>
                            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                              <Coins className="h-4 w-4 text-amber-600" />
                              <span>
                                {tr(
                                  "জাপান স্টাডি মাল্টি-কারেন্সি ক্যালকুলেটর (BDT ৳ ⇄ JPY ¥)",
                                  "Japan Study Currency Conversion Assistant",
                                  "日本留学マルチ通貨計算アシスタント（BDT ৳ ⇄ JPY ¥）",
                                )}
                              </span>
                            </h3>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {tr(
                                "১ম বছরের টিউশন ফি, হোস্টেল ফি ও স্কুল কমিশন দ্রুত রূপান্তর করুন (১ JPY ≈ ৳ ০.৮০ BDT)",
                                "Quickly convert tuition, dormitory fees and school commission (1 JPY ≈ 0.80 BDT)",
                                "初年度学費、寮費および提携校手数料のリアルタイム換算（1 JPY ≈ 0.80 BDT）",
                              )}
                            </p>
                          </div>
                          <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 tabular-nums">
                            1 JPY = ৳ 0.80 BDT
                          </span>
                        </div>

                        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                          <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                            <span className="font-semibold text-slate-600">
                              {tr("জাপানি স্কুল কমিশন (প্রতিষ্ঠানভেদে)", "School Commission (By Institution)", "提携校手数料（学校別）")}
                            </span>
                            {(() => {
                              const validRates = store.partnerSchools
                                .map((s) => s.commissionPerStudentYen)
                                .filter((r) => r > 0);
                              if (validRates.length === 0) {
                                return (
                                  <>
                                    <p className="text-base font-bold text-slate-900 mt-1">
                                      {tr("প্রতিষ্ঠানভেদে ভিন্ন", "Varies by Institution", "提携校により異なる")}
                                    </p>
                                    <p className="text-xs text-emerald-700 font-semibold mt-0.5">
                                      {tr("চুক্তিবদ্ধ হার অনুযায়ী নির্ধারিত", "Based on school agreement", "提携協定に基づく規定")}
                                    </p>
                                  </>
                                );
                              }
                              const minRate = Math.min(...validRates);
                              const maxRate = Math.max(...validRates);
                              return (
                                <>
                                  <p className="text-lg font-bold text-slate-900 mt-1 tabular-nums">
                                    {minRate === maxRate
                                      ? `¥${minRate.toLocaleString()} JPY`
                                      : `¥${minRate.toLocaleString()} – ¥${maxRate.toLocaleString()} JPY`}
                                  </p>
                                  <p className="text-xs text-emerald-700 font-semibold mt-0.5 tabular-nums">
                                    {minRate === maxRate
                                      ? `≈ ৳ ${Math.round(minRate * 0.8).toLocaleString()} BDT`
                                      : `≈ ৳ ${Math.round(minRate * 0.8).toLocaleString()} – ৳ ${Math.round(maxRate * 0.8).toLocaleString()} BDT`}
                                  </p>
                                </>
                              );
                            })()}
                          </div>

                          <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                            <span className="font-semibold text-slate-600">
                              {tr("১ বছরের টিউশন ফি (গড়পড়তা)", "1st Year Tuition Fee (Average)", "初年度学費（平均目安）")}
                            </span>
                            <p className="text-lg font-bold text-slate-900 mt-1 tabular-nums">¥750,000 – ¥850,000 JPY</p>
                            <p className="text-xs text-slate-500 font-medium mt-0.5 tabular-nums">
                              ≈ ৳ 6,00,000 – ৳ 6,80,000 BDT
                            </p>
                          </div>

                          <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                            <span className="font-semibold text-slate-600">
                              {tr("KNLTC রেগুলার প্যাকেজ ফি", "KNLTC Regular Service Charge", "KNLTC レギュラー手続手数料")}
                            </span>
                            <p className="text-lg font-bold text-slate-900 mt-1 tabular-nums">৳ 1,20,000 BDT</p>
                            <p className="text-xs text-emerald-700 font-semibold mt-0.5 tabular-nums">
                              {tr(
                                "≈ ¥১৫০,০০০ JPY (COE অনুমোদনের পর প্রযোজ্য)",
                                "≈ ¥150,000 JPY (Strictly after COE Approval)",
                                "≈ ¥150,000 JPY（COE交付後のみ請求）",
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 2. GENERAL LEDGER SUB-TAB */}
                  {financeSubTab === "ledger" && (
                    <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
                      {/* Filter & Search Bar */}
                      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div className="flex items-center gap-1.5 overflow-x-auto">
                          <button
                            type="button"
                            onClick={() => setFinanceFilterCategory("ALL")}
                            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                              financeFilterCategory === "ALL"
                                ? "bg-slate-900 text-white"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                          >
                            {tr("সব ট্রানজেকশন", "All Entries", "全取引")}
                          </button>
                          <button
                            type="button"
                            onClick={() => setFinanceFilterCategory("INCOME")}
                            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition flex items-center gap-1 ${
                              financeFilterCategory === "INCOME"
                                ? "bg-emerald-700 text-white"
                                : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                            }`}
                          >
                            <TrendingUp className="h-3 w-3" />
                            <span>{tr("কেবল আয় (Inflow)", "Income Only", "収入のみ")}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setFinanceFilterCategory("EXPENSE")}
                            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition flex items-center gap-1 ${
                              financeFilterCategory === "EXPENSE"
                                ? "bg-[#b91c1c] text-white"
                                : "bg-red-50 text-red-800 hover:bg-red-100"
                            }`}
                          >
                            <TrendingDown className="h-3 w-3" />
                            <span>{tr("কেবল ব্যয় (Expense)", "Expenses Only", "支出のみ")}</span>
                          </button>
                        </div>

                        <div className="relative w-full md:w-64">
                          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                          <input
                            type="text"
                            value={financeSearchQuery}
                            onChange={(e) => setFinanceSearchQuery(e.target.value)}
                            placeholder={tr("রসিদ নং, শিক্ষার্থী বা খাত খুঁজুন...", "Search ledger entries...", "領収書番号、生徒名、項目で検索...")}
                            className="w-full rounded-xl border border-slate-200 pl-8 pr-3 py-1.5 text-xs font-medium focus:border-slate-400 focus:outline-hidden"
                          />
                        </div>
                      </div>

                      {/* Ledger Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-50/70 border-b border-slate-100 font-semibold text-slate-500">
                            <tr>
                              <th className="px-4 py-3">{tr("রসিদ নং ও তারিখ", "Receipt / Date", "領収書番号・日付")}</th>
                              <th className="px-4 py-3">{tr("শিক্ষার্থী / বিবরণ", "Student / Payee", "生徒名・支払先")}</th>
                              <th className="px-4 py-3">{tr("খাত / টাইপ", "Account Head", "勘定科目・区分")}</th>
                              <th className="px-4 py-3">{tr("পেমেন্ট মাধ্যম", "Payment Method", "決済手段")}</th>
                              <th className="px-4 py-3">{tr("ব্রাঞ্চ", "Branch", "支店・拠点")}</th>
                              <th className="px-4 py-3 text-right">{tr("পরিমাণ (BDT)", "Amount (BDT)", "金額 (BDT)")}</th>
                              <th className="px-4 py-3 text-right">{tr("অ্যাকশন", "Actions", "操作")}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {store.transactions
                              .filter((tx) => {
                                const isExpense = tx.category === "EXPENSE" || tx.type.startsWith("EXPENSE");
                                if (financeFilterCategory === "INCOME" && isExpense) return false;
                                if (financeFilterCategory === "EXPENSE" && !isExpense) return false;
                                if (financeSearchQuery.trim()) {
                                  const q = financeSearchQuery.toLowerCase();
                                  const textMatch =
                                    (tx.receiptNo || "").toLowerCase().includes(q) ||
                                    (tx.studentName || "").toLowerCase().includes(q) ||
                                    (tx.type || "").toLowerCase().includes(q) ||
                                    (tx.referenceOrTrx || "").toLowerCase().includes(q) ||
                                    (tx.notes || "").toLowerCase().includes(q);
                                  if (!textMatch) return false;
                                }
                                return true;
                              })
                              .map((tx) => {
                                const isExpense = tx.category === "EXPENSE" || tx.type.startsWith("EXPENSE");
                                return (
                                  <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                                    <td className="px-4 py-3.5 font-mono text-slate-800">
                                      <span className="font-semibold">{tx.receiptNo}</span>
                                      <p className="text-[10px] text-slate-400 font-sans">{tx.date}</p>
                                    </td>
                                    <td className="px-4 py-3.5">
                                      <p className="font-semibold text-slate-900">{tx.studentName}</p>
                                      {tx.notes && (
                                        <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{tx.notes}</p>
                                      )}
                                    </td>
                                    <td className="px-4 py-3.5">
                                      <span
                                        className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                                          isExpense
                                            ? "bg-red-50 text-red-800 border border-red-200/60"
                                            : "bg-emerald-50 text-emerald-800 border border-emerald-200/60"
                                        }`}
                                      >
                                        {isExpense ? <TrendingDown className="h-2.5 w-2.5" /> : <TrendingUp className="h-2.5 w-2.5" />}
                                        <span>
                                          {tx.type === "COURSE_FEE"
                                            ? tr("ভাষা কোর্স ফি", "Course Fee", "語学コース受講料")
                                            : tx.type === "SERVICE_CHARGE_COE"
                                              ? tr("COE সার্ভিস চার্জ", "COE Service Charge", "COE申請手数料")
                                              : tx.type === "REGULAR_SERVICE_CHARGE"
                                                ? tr("রেগুলার সার্ভিস চার্জ", "Regular Service Charge", "レギュラー手続手数料")
                                                : tx.type === "PREMIUM_PACKAGE" || tx.type === "PREMIUM_PACKAGE_ADVANCE"
                                                  ? tr("প্রিমিয়াম প্যাকেজ ফি", "Premium Package Fee", "プレミアムパッケージ料")
                                                  : tx.type === "BOOK_STORE_SALE"
                                                    ? tr("মিন্না নো নিহোঙ্গো বই সেল", "Bookstore Sale", "教材・テキスト売上")
                                                    : tx.type === "SCHOOL_COMMISSION_JPY"
                                                      ? tr("জাপানি স্কুল কমিশন (JPY➔BDT)", "School Commission (JPY➔BDT)", "提携校手数料 (JPY➔BDT)")
                                                      : tx.type === "EXPENSE_RENT"
                                                        ? tr("অফিস ভাড়া ও ইউটিলিটি", "Office Rent & Utilities", "オフィス賃料・光熱費")
                                                        : tx.type === "EXPENSE_PAYROLL"
                                                          ? tr("শিক্ষক/স্টাফ সম্মানী", "Sensei & Staff Salary", "講師・スタッフ給与")
                                                          : tx.type === "EXPENSE_MARKETING"
                                                            ? tr("মেটা অ্যাডস খরচ", "Meta Digital Ads", "Meta広告宣伝費")
                                                            : tx.type === "EXPENSE_EMBASSY_NOTARY"
                                                              ? tr("নোটারি ও পররাষ্ট্র মন্ত্রণালয়", "Notary & MOFA Attestation", "公証・外務省認証・郵送費")
                                                              : tx.type === "EXPENSE_EXAM_FEE"
                                                                ? tr("JLPT / NAT-TEST ফি", "JLPT / NAT Exam Fee", "JLPT・NAT-TEST受験料")
                                                                : tx.type === "EXPENSE_B2B_COMMISSION"
                                                                  ? tr("এজেন্ট কমিশন প্রদান", "B2B Agent Commission", "B2B代理店手数料支払")
                                                                  : tx.type === "EXPENSE_MISC"
                                                                    ? tr("বিবিধ অফিস খরচ", "Office Misc & Refreshments", "雑費・消耗品・接待費")
                                                                    : tx.type}
                                        </span>
                                      </span>
                                    </td>
                                    <td className="px-4 py-3.5">
                                      <span className="font-medium text-slate-800">{tx.paymentMethod}</span>
                                      <p className="font-mono text-[10px] text-slate-400">{tx.referenceOrTrx || "N/A"}</p>
                                    </td>
                                    <td className="px-4 py-3.5 text-slate-500">
                                      {tx.branch === "DHK-HQ" ? t.dhakaHq : t.khulnaBranch}
                                    </td>
                                    <td className="px-4 py-3.5 text-right font-bold tabular-nums">
                                      <span className={isExpense ? "text-red-700" : "text-emerald-700"}>
                                        {isExpense ? "- ৳" : "+ ৳"}{tx.amountBdt.toLocaleString()}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3.5 text-right">
                                      <div className="inline-flex items-center justify-end gap-1">
                                        {!isExpense && (
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setSelectedTxForReceipt(tx);
                                              setActiveModal("VIEW_RECEIPT");
                                            }}
                                            className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-200 transition"
                                            title="View Official Money Receipt"
                                          >
                                            <Receipt className="h-3 w-3 text-slate-500" />
                                            <span>{tr("রসিদ", "Receipt", "領収書")}</span>
                                          </button>
                                        )}
                                        <button
                                          type="button"
                                          onClick={() => {
                                            deleteFinancialTransaction(tx.id);
                                            setStore({ ...getCmsStore() });
                                            showToast(tr("ট্রানজেকশন মুছে ফেলা হয়েছে", "Transaction deleted", "取引を削除しました"));
                                          }}
                                          className="rounded-lg p-1 text-slate-400 hover:bg-red-50 hover:text-[#b91c1c] transition"
                                          title="Delete entry"
                                        >
                                          <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}

                            {store.transactions.length === 0 && (
                              <tr>
                                <td colSpan={7} className="py-12 text-center text-slate-400">
                                  <Receipt className="h-7 w-7 text-slate-300 mx-auto mb-2" />
                                  <p className="text-sm font-semibold text-slate-700">
                                    {tr("এখনো কোনো ট্রানজেকশন বা পেমেন্ট রেকর্ড নেই", "No financial transactions recorded yet", "取引履歴はまだありません")}
                                  </p>
                                  <p className="text-xs text-slate-400 mt-0.5">
                                    {tr(
                                      "শিক্ষার্থীদের ফি গ্রহণ বা অফিস খরচ রেকর্ড করতে উপরের বাটনে ক্লিক করুন।",
                                      "Click Record Income or Record Expense above to start tracking.",
                                      "上のボタンから生徒の学費受領または経費を記録してください。",
                                    )}
                                  </p>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* 2.5 STUDENT DUES & INSTALLMENT TRACKER SUB-TAB */}
                  {financeSubTab === "dues" && (
                    <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
                      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">
                            {tr(
                              "শিক্ষার্থীদের চুক্তিমূল্য, পরিশোধিত ফি ও বকেয়া খতিয়ান",
                              "Student Contract Value, Paid Installments & Due Balance",
                              "生徒契約額・納入済額・未収金台帳",
                            )}
                          </h3>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {tr(
                              "CRM ও Visa Pipeline-এর সাথে সরাসরি সংযুক্ত — রসিদ ইস্যু করলেই বকেয়া স্বয়ংক্রিয়ভাবে কমে যাবে।",
                              "Directly synced with CRM & Visa Pipeline — issuing a receipt automatically updates student dues.",
                              "CRMおよびビザ進行状況とリアルタイム連携 — 領収書発行で未収金が即時減額されます。",
                            )}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 text-xs tabular-nums">
                          <span className="rounded-lg bg-amber-50 border border-amber-200/60 px-3 py-1.5 font-bold text-amber-900">
                            {tr("মোট বকেয়া: ", "Total Receivable: ", "総未収金: ")}
                            ৳
                            {store.crmLeads
                              .reduce(
                                (sum, l) =>
                                  sum + Math.max(0, l.dueAmountBdt ?? ((l.contractAmountBdt || 0) - (l.paidAmountBdt || 0))),
                                0,
                              )
                              .toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-50/70 border-b border-slate-100 font-semibold text-slate-500">
                            <tr>
                              <th className="px-4 py-3">{tr("শিক্ষার্থীর নাম ও ফোন", "Student", "生徒氏名・連絡先")}</th>
                              <th className="px-4 py-3">{tr("টার্গেট স্কুল ও এজেন্ট", "School & Agent", "志望校・紹介代理店")}</th>
                              <th className="px-4 py-3 text-right">{tr("মোট চুক্তি (Contract)", "Contract (BDT)", "契約総額 (BDT)")}</th>
                              <th className="px-4 py-3 text-right">{tr("জমা (Paid)", "Paid (BDT)", "納入済 (BDT)")}</th>
                              <th className="px-4 py-3 text-right">{tr("বকেয়া (Due)", "Due (BDT)", "残金・未収 (BDT)")}</th>
                              <th className="px-4 py-3 text-right">{tr("অ্যাকশন", "Action", "操作")}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {store.crmLeads.map((lead) => {
                              const contract = lead.contractAmountBdt || 0;
                              const paid = lead.paidAmountBdt || 0;
                              const due = lead.dueAmountBdt ?? Math.max(0, contract - paid);
                              const school = store.partnerSchools.find((s) => s.id === lead.targetSchoolId);
                              const agent = store.b2bAgents.find((a) => a.id === lead.referredByAgentId);
                              return (
                                <tr key={lead.id} className="hover:bg-slate-50/70 transition-colors">
                                  <td className="px-4 py-3.5">
                                    <p className="font-bold text-slate-900">{lead.name}</p>
                                    <p className="font-mono text-[11px] text-slate-400">{lead.phone}</p>
                                  </td>
                                  <td className="px-4 py-3.5">
                                    <p className="font-medium text-slate-800">
                                      {school?.name || (school as any)?.schoolName || lead.targetSchoolName || tr("নির্ধারিত নয়", "Not Assigned", "未定")}
                                    </p>
                                    {agent && (
                                      <p className="text-[10px] text-amber-700 font-medium">
                                        {tr("এজেন্ট:", "Agent:", "代理店:")} {agent.organizationName || (agent as any)?.agencyName}
                                      </p>
                                    )}
                                  </td>
                                  <td className="px-4 py-3.5 text-right font-semibold text-slate-800 tabular-nums">
                                    ৳{contract.toLocaleString()}
                                  </td>
                                  <td className="px-4 py-3.5 text-right font-semibold text-emerald-700 tabular-nums">
                                    ৳{paid.toLocaleString()}
                                  </td>
                                  <td className="px-4 py-3.5 text-right font-bold tabular-nums">
                                    <span className={due > 0 ? "text-amber-700" : "text-slate-400"}>
                                      ৳{due.toLocaleString()}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3.5 text-right">
                                    {due > 0 ? (
                                      <button
                                        type="button"
                                        onClick={() => openStudentPaymentModal(lead)}
                                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-emerald-700 transition"
                                      >
                                        <Plus className="h-3 w-3" />
                                        <span>{tr("বকেয়া আদায়", "Collect Due", "未収金回収")}</span>
                                      </button>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                                        <CheckCircle2 className="h-3 w-3" />
                                        <span>{tr("পরিশোধিত", "Paid in full", "完納")}</span>
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* 3. INVESTOR PORTAL SUB-TAB */}
                  {financeSubTab === "investor" && (
                    <div className="space-y-6">
                      <div className="hover-spotlight rounded-2xl border border-slate-200/80 bg-white p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-5 border-b border-slate-100">
                          <div>
                            <span className="text-xs font-semibold text-emerald-700">
                              {t.finance.auditBadge}
                            </span>
                            <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
                              {t.finance.title}
                            </h2>
                            <p className="text-xs text-slate-500 mt-0.5">{t.finance.subtitle}</p>
                          </div>
                          <div className="md:text-right">
                            <span className="text-xs text-slate-400">{t.finance.capitalLabel}</span>
                            <p className="text-2xl font-bold text-slate-900 tabular-nums">৳ 10,00,000</p>
                          </div>
                        </div>

                        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                            <span className="text-xs text-slate-500">{t.finance.pillar1Title}</span>
                            <p className="text-lg font-bold text-slate-900 mt-1 tabular-nums">৳ 3,00,000</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">{t.finance.pillar1Desc}</p>
                          </div>
                          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                            <span className="text-xs text-slate-500">{t.finance.pillar2Title}</span>
                            <p className="text-lg font-bold text-slate-900 mt-1 tabular-nums">৳ 2,00,000</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">{t.finance.pillar2Desc}</p>
                          </div>
                          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                            <span className="text-xs text-slate-500">{t.finance.pillar3Title}</span>
                            <p className="text-lg font-bold text-slate-900 mt-1 tabular-nums">৳ 3,00,000</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">{t.finance.pillar3Desc}</p>
                          </div>
                          <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4">
                            <span className="text-xs font-medium text-emerald-800">{t.finance.pillar4Title}</span>
                            <p className="text-lg font-bold text-emerald-700 mt-1 tabular-nums">৳ 2,00,000</p>
                            <p className="text-[11px] text-emerald-700 mt-0.5">{t.finance.pillar4Desc}</p>
                          </div>
                        </div>

                        {/* Legal Stamp & Cheque Verification */}
                        <div className="mt-5 rounded-xl border border-emerald-200/80 bg-emerald-50/50 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-emerald-950">
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
                            <div>
                              <p className="font-bold">
                                {tr(
                                  "৩০০ টাকার সরকারি নন-জুডিশিয়াল স্ট্যাম্প ও ব্যাংক গ্যারান্টি চেক সংরক্ষিত",
                                  "300 BDT Govt Non-Judicial Stamp & Bank Security Cheques Held",
                                  "公証印紙協定書および銀行保証小切手を保管管理",
                                )}
                              </p>
                              <p className="text-[11px] text-emerald-800 mt-0.5">
                                {tr(
                                  "নিরাপদ বিনিয়োগ নিশ্চয়তা ও শরীয়াহ সম্মত ১০% নিট লভ্যাংশ অংশীদারিত্ব।",
                                  "100% principal safety protection with 10% audited dividend distribution.",
                                  "元本保全および監査済純利益10%の配当分配スキーム。",
                                )}
                              </p>
                            </div>
                          </div>
                          <span className="rounded-lg bg-emerald-700 px-3 py-1.5 font-bold text-white shrink-0 text-center">
                            {tr("চুক্তি সক্রিয়", "Active Syndicate", "契約有効")}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* =========================================================================
                  MODULE 7: HR & TEAM MEMBERS (With Diverse Roles & Role-Specific KPIs)
                  ========================================================================= */}
              {activeTab === "hr" && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                        {t.hr.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                        {tr(
                          "টেলি-কাউন্সেলর, জাপানি শিক্ষক (সেন্সি), ভিসা প্রসেসিং ও অফিস কর্মকর্তাদের টার্গেট ও পে-রোল।",
                          "Manage tele-counselors, senseis, visa officers, and office payroll/KPIs.",
                          "テレカウンセラー、日本語教師、ビザ担当官、管理スタッフのKPIと給与管理。",
                        )}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const res = disburseAllActivePayroll(currentUser?.name || "Sheikh Baset (MD)");
                          setStore({ ...getCmsStore() });
                          if (res.count > 0) {
                            showToast(
                              tr(
                                `${res.count} জন স্টাফের বেতন (মোট ৳${res.totalBdt.toLocaleString()}) পরিশোধ ও লেজারে যুক্ত হয়েছে!`,
                                `Disbursed payroll for ${res.count} staff (৳${res.totalBdt.toLocaleString()})`,
                                `スタッフ${res.count}名の給与（計৳${res.totalBdt.toLocaleString()}）を出納帳に記録しました`,
                              ),
                            );
                          } else {
                            showToast(
                              tr(
                                "চলতি মাসের সকল সক্রিয় স্টাফের বেতন ইতিমধ্যে পরিশোধ করা হয়েছে।",
                                "All active staff have already been paid for this month.",
                                "今月分の給与は全員支払い済みです。",
                              ),
                            );
                          }
                        }}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-3.5 py-2.5 text-xs font-semibold text-white hover:bg-emerald-800 transition shadow-2xs shrink-0"
                      >
                        <DollarSign className="h-4 w-4" />
                        <span>
                          {tr(
                            "সকল বেতন পরিশোধ (Run Monthly Payroll)",
                            "Run Monthly Payroll",
                            "一括給与支払い実行",
                          )}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => openStaffModal()}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#b91c1c] px-4 py-2.5 text-xs font-semibold text-white hover:bg-red-800 transition shadow-2xs shrink-0"
                      >
                        <UserPlus className="h-4 w-4" />
                        <span>
                          {tr(
                            "+ নতুন টিম মেম্বার যোগ করুন",
                            "+ Add Team Member",
                            "+ 新規チームメンバー追加",
                          )}
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50/70 border-b border-slate-100 font-semibold text-slate-500">
                          <tr>
                            <th className="px-4 py-3">{t.hr.colNameRole}</th>
                            <th className="px-4 py-3">{t.hr.colLocation}</th>
                            <th className="px-4 py-3">
                              {tr("টার্গেট ও পারফরম্যান্স (KPI)", "Role KPI Target", "職務KPI目標・進捗")}
                            </th>
                            <th className="px-4 py-3">
                              {tr("ফলাফল / অর্জন", "Deliverables", "達成成果・実績")}
                            </th>
                            <th className="px-4 py-3">{t.hr.colBaseSalary}</th>
                            <th className="px-4 py-3">{t.hr.colBonus}</th>
                            <th className="px-4 py-3 text-right">{t.hr.colTotalPay}</th>
                            <th className="px-4 py-3 text-right">
                              {tr("অ্যাকশন", "Actions", "操作")}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {store.staffList.map((stf) => {
                            const totalPay = stf.monthlyBaseSalaryBdt + stf.performanceBonusBdt;
                            const isCaller = stf.role === "TELE_COUNSELOR" || stf.role === "COUNSELOR";
                            const isSensei = stf.role === "SENIOR_SENSEI";
                            const isVisaOfficer = stf.role === "VISA_OFFICER";
                            const isSalariedFixed = stf.role === "BRANCH_MANAGER" || stf.role === "ACCOUNTANT_ADMIN" || (!isCaller && !isSensei && !isVisaOfficer);

                            return (
                              <tr key={stf.id} className="hover:bg-slate-50/70 transition-colors">
                                <td className="px-4 py-3.5">
                                  <p className="font-bold text-slate-900">{stf.name}</p>
                                  <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[10px] font-semibold text-slate-700">
                                      {stf.role === "TELE_COUNSELOR"
                                        ? tr("টেলি-কাউন্সেলর", "Tele-Counselor", "テレカウンセラー")
                                        : stf.role === "COUNSELOR"
                                          ? tr("এডমিশন কাউন্সেলর", "Admission Counselor", "入学カウンセラー")
                                          : stf.role === "SENIOR_SENSEI"
                                            ? tr("জাপানি শিক্ষক (Sensei)", "Japanese Sensei", "日本語教師 (Sensei)")
                                            : stf.role === "VISA_OFFICER"
                                              ? tr("ভিসা প্রসেসিং অফিসার", "Visa Processing Officer", "ビザ申請担当官")
                                              : stf.role === "BRANCH_MANAGER"
                                                ? tr("ব্রাঞ্চ ম্যানেজার", "Branch Manager", "支店長")
                                                : stf.role === "ACCOUNTANT_ADMIN"
                                                  ? tr("একাউন্টস ও অ্যাডমিন", "Accounts & Admin", "総務・経理担当")
                                                  : stf.role}
                                    </span>
                                    {stf.phone && <span className="text-[11px] text-slate-400 font-mono">{stf.phone}</span>}
                                  </div>
                                </td>
                                <td className="px-4 py-3.5 text-slate-600">
                                  {stf.location === "DHAKA_OFFICE"
                                    ? t.dhakaHq
                                    : stf.location === "KHULNA_OFFICE"
                                      ? t.khulnaBranch
                                      : tr("রিমোট / অনলাইন", "Remote / Online", "リモート・在宅勤務")}
                                </td>

                                {/* Role-specific KPI Column */}
                                <td className="px-4 py-3.5 tabular-nums">
                                  {isCaller && (
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <span className="font-semibold text-slate-800">
                                          {stf.callsCompleted || stf.kpiAchieved || 0} / {stf.callsTargetMonthly || stf.kpiTarget || 500} {tr("কল", "calls", "件")}
                                        </span>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const updatedCount = (stf.callsCompleted || 0) + 10;
                                            updateStaffMember(stf.id, {
                                              callsCompleted: updatedCount,
                                              kpiAchieved: updatedCount,
                                            });
                                            setStore({ ...getCmsStore() });
                                            showToast(`${stf.name}: +10 calls logged`);
                                          }}
                                          className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700 hover:bg-slate-200"
                                          title="Add 10 calls"
                                        >
                                          +10
                                        </button>
                                      </div>
                                      <div className="w-24 bg-slate-100 rounded-full h-1.5 mt-1">
                                        <div
                                          className="bg-emerald-600 h-1.5 rounded-full"
                                          style={{
                                            width: `${Math.min(
                                              100,
                                              ((stf.callsCompleted || stf.kpiAchieved || 0) / (stf.callsTargetMonthly || stf.kpiTarget || 1)) * 100,
                                            )}%`,
                                          }}
                                        />
                                      </div>
                                    </div>
                                  )}

                                  {isSensei && (
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <span className="font-semibold text-slate-800">
                                          {stf.kpiAchieved || 0} / {stf.kpiTarget || 24} {tr("ক্লাসেস", "classes", "コマ")}
                                        </span>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const updated = (stf.kpiAchieved || 0) + 1;
                                            updateStaffMember(stf.id, { kpiAchieved: updated });
                                            setStore({ ...getCmsStore() });
                                            showToast(tr(`${stf.name}: +১ ক্লাস সম্পন্ন`, `${stf.name}: +1 class conducted`, `${stf.name}: +1 コマ授業実施`));
                                          }}
                                          className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 hover:bg-emerald-100"
                                          title="Add 1 class conducted"
                                        >
                                          {tr("+১ ক্লাস", "+1 Class", "+1 コマ")}
                                        </button>
                                      </div>
                                      <p className="text-[10px] text-slate-400 mt-0.5">{tr("মিন্না নো নিহোঙ্গো / কাইওয়া", "Minna no Nihongo / Kaiwa", "みんなの日本語・会話")}</p>
                                    </div>
                                  )}

                                  {isVisaOfficer && (
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <span className="font-semibold text-slate-800">
                                          {stf.kpiAchieved || 0} / {stf.kpiTarget || 15} {tr("ফাইল", "files", "件")}
                                        </span>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const updated = (stf.kpiAchieved || 0) + 1;
                                            updateStaffMember(stf.id, { kpiAchieved: updated });
                                            setStore({ ...getCmsStore() });
                                            showToast(tr(`${stf.name}: +১ ফাইল প্রসেসড`, `${stf.name}: +1 file processed`, `${stf.name}: +1 件処理完了`));
                                          }}
                                          className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700 hover:bg-blue-100"
                                          title="Add 1 file processed"
                                        >
                                          {tr("+১ ফাইল", "+1 File", "+1 件")}
                                        </button>
                                      </div>
                                      <p className="text-[10px] text-slate-400 mt-0.5">{tr("COE আবেদন ও ডকুমেন্টেশন", "COE Application & Docs", "COE申請・書類作成")}</p>
                                    </div>
                                  )}

                                  {isSalariedFixed && (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50/80 px-2 py-0.5 rounded-md border border-emerald-200/50">
                                      <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                                      <span>{tr("অফিস অপারেশনস ডিউটি", "Office Operations Duty", "総務・拠点運営業務")}</span>
                                    </span>
                                  )}
                                </td>

                                {/* Deliverables / Achievement Column */}
                                <td className="px-4 py-3.5 tabular-nums">
                                  {isCaller ? (
                                    <div className="flex items-center gap-2">
                                      <span className="font-bold text-emerald-700">
                                        {stf.admissionsAchieved} {tr("ভর্তি", "Admissions", "名入学")}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          updateStaffMember(stf.id, {
                                            admissionsAchieved: stf.admissionsAchieved + 1,
                                            performanceBonusBdt: stf.performanceBonusBdt + 1000,
                                          });
                                          setStore({ ...getCmsStore() });
                                          showToast(`${stf.name}: +1 Admission (+৳1,000 bonus)`);
                                        }}
                                        className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 hover:bg-emerald-100"
                                      >
                                        +1
                                      </button>
                                    </div>
                                  ) : isSensei ? (
                                    <span className="text-[11px] font-medium text-slate-600">
                                      {tr("JLPT N5/N4 মেন্টরিং ব্যাচ", "JLPT N5/N4 Mentoring", "JLPT N5/N4 指導担当")}
                                    </span>
                                  ) : isVisaOfficer ? (
                                    <span className="text-[11px] font-medium text-slate-600">
                                      {tr("ইমিগ্রেশন COE স্পেশালিস্ট", "Immigration COE Specialist", "出入国在留管理局COE担当")}
                                    </span>
                                  ) : (
                                    <span className="text-[11px] font-medium text-slate-500">
                                      {tr("রেগুলার অ্যাডমিনিস্ট্রেশন", "General Administration", "一般総務管理")}
                                    </span>
                                  )}
                                </td>

                                <td className="px-4 py-3.5 font-semibold text-slate-800 tabular-nums">
                                  ৳{stf.monthlyBaseSalaryBdt.toLocaleString()}
                                </td>
                                <td className="px-4 py-3.5 font-semibold text-emerald-600 tabular-nums">
                                  +৳{stf.performanceBonusBdt.toLocaleString()}
                                </td>
                                <td className="px-4 py-3.5 text-right font-bold text-slate-900 tabular-nums">
                                  ৳{totalPay.toLocaleString()}
                                </td>
                                <td className="px-4 py-3.5 text-right">
                                  <div className="inline-flex items-center justify-end gap-1">
                                    {stf.lastPaidMonth === new Date().toISOString().slice(0, 7) ? (
                                      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700 border border-emerald-200/60">
                                        <CheckCircle2 className="h-3 w-3" />
                                        <span>Paid ({stf.lastPaidMonth})</span>
                                      </span>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const tx = disburseStaffPayroll(stf.id, currentUser?.name || "Sheikh Baset (MD)");
                                          if (tx) {
                                            setStore({ ...getCmsStore() });
                                            showToast(
                                              tr(
                                                `${stf.name}-এর বেতন (৳${tx.amountBdt.toLocaleString()}) পরিশোধ ও ফিন্যান্স লেজারে যুক্ত হয়েছে`,
                                                `Salary ৳${tx.amountBdt.toLocaleString()} disbursed to ${stf.name}`,
                                                `${stf.name}の給与（৳${tx.amountBdt.toLocaleString()}）の支払いを完了しました`,
                                              ),
                                            );
                                          }
                                        }}
                                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2 py-1 text-[10px] font-semibold text-white hover:bg-emerald-700 transition"
                                        title="Disburse Monthly Salary & Sync to Finance Ledger"
                                      >
                                        <DollarSign className="h-3 w-3" />
                                        <span>{tr("বেতন দিন", "Pay Salary", "給与支払")}</span>
                                      </button>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => openStaffModal(stf)}
                                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                                      title="Edit Staff"
                                    >
                                      <Edit3 className="h-3.5 w-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        deleteStaffMember(stf.id);
                                        setStore({ ...getCmsStore() });
                                        showToast(
                                          tr(
                                            `${stf.name} মুছে ফেলা হয়েছে`,
                                            `${stf.name} removed`,
                                            `${stf.name}を削除しました`,
                                          ),
                                        );
                                      }}
                                      className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-[#b91c1c] transition"
                                      title="Delete Staff"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}

                          {store.staffList.length === 0 && (
                            <tr>
                              <td colSpan={8} className="py-12 text-center">
                                <Users className="h-7 w-7 text-slate-300 mx-auto mb-2" />
                                <p className="text-sm font-semibold text-slate-700">
                                  {tr(
                                    "এখনো কোনো টিম মেম্বার বা স্টাফ যোগ করা হয়নি",
                                    "No team members or staff added yet",
                                    "チームメンバーはまだ登録されていません",
                                  )}
                                </p>
                                <p className="text-xs text-slate-400 mt-1">
                                  {tr(
                                    "টেলি-কাউন্সেলর, সেন্সি বা ব্রাঞ্চ কর্মকর্তাদের পে-রোল ও টার্গেট ট্র্যাক করতে যুক্ত করুন।",
                                    "Add your counselors, teachers, and branch team members to manage payroll and KPIs.",
                                    "カウンセラー、日本語教師、支店スタッフを登録して給与とKPIを管理してください。",
                                  )}
                                </p>
                                <button
                                  type="button"
                                  onClick={() => openStaffModal()}
                                  className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-[#b91c1c] px-4 py-2 text-xs font-semibold text-white hover:bg-red-800 transition"
                                >
                                  <UserPlus className="h-3.5 w-3.5" />
                                  <span>
                                    {tr(
                                      "প্রথম টিম মেম্বার যোগ করুন",
                                      "Add First Team Member",
                                      "最初のメンバーを追加",
                                    )}
                                  </span>
                                </button>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* =========================================================================
                  MODULE 8: WEBSITE CMS CONTROL PANEL
                  ========================================================================= */}
              {activeTab === "cms" && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                        {t.cms.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{t.cms.subtitle}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        saveCmsStore(store);
                        showToast(t.toastSuccess);
                      }}
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-xs font-semibold text-white hover:bg-emerald-800 transition shadow-2xs shrink-0"
                    >
                      <Save className="h-4 w-4" />
                      <span>{t.cms.saveBtn}</span>
                    </button>
                  </div>

                  {/* 1. Global Announcement & Hero Section */}
                  <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
                    <h3 className="font-bold text-sm text-slate-900">{t.cms.section1Title}</h3>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="font-semibold text-slate-600">{t.cms.topBarLabel}</label>
                        <input
                          type="text"
                          defaultValue={cms.topAnnouncementBar?.text?.[language] || cms.topAnnouncementBar?.text?.bn || ""}
                          onChange={(e) => {
                            if (!cms.topAnnouncementBar) cms.topAnnouncementBar = { ...DEFAULT_WEBSITE_CMS.topAnnouncementBar };
                            if (!cms.topAnnouncementBar.text) cms.topAnnouncementBar.text = { ...DEFAULT_WEBSITE_CMS.topAnnouncementBar.text };
                            cms.topAnnouncementBar.text[language] = e.target.value;
                            store.websiteCms[0] = cms;
                            setStore({ ...store });
                          }}
                          className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 font-medium"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-600">{t.cms.popupLabel}</label>
                        <input
                          type="text"
                          defaultValue={cms.popupBanner?.headline?.[language] || cms.popupBanner?.headline?.bn || ""}
                          onChange={(e) => {
                            if (!cms.popupBanner) cms.popupBanner = { ...DEFAULT_WEBSITE_CMS.popupBanner };
                            if (!cms.popupBanner.headline) cms.popupBanner.headline = { ...DEFAULT_WEBSITE_CMS.popupBanner.headline };
                            cms.popupBanner.headline[language] = e.target.value;
                            store.websiteCms[0] = cms;
                            setStore({ ...store });
                          }}
                          className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 font-medium"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-600">{t.cms.heroLabel}</label>
                        <input
                          type="text"
                          defaultValue={cms.heroSection?.headline?.[language] || cms.heroSection?.headline?.bn || ""}
                          onChange={(e) => {
                            if (!cms.heroSection) cms.heroSection = { ...DEFAULT_WEBSITE_CMS.heroSection };
                            if (!cms.heroSection.headline) cms.heroSection.headline = { ...DEFAULT_WEBSITE_CMS.heroSection.headline };
                            cms.heroSection.headline[language] = e.target.value;
                            store.websiteCms[0] = cms;
                            setStore({ ...store });
                          }}
                          className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 font-medium"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-600">{t.cms.pixelLabel}</label>
                        <input
                          type="text"
                          defaultValue={cms.metaPixelId || ""}
                          onChange={(e) => {
                            cms.metaPixelId = e.target.value;
                            store.websiteCms[0] = cms;
                            setStore({ ...store });
                          }}
                          className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 font-mono font-semibold"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2. Course Fees & Visa Packages */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
                      <h3 className="font-bold text-sm text-slate-900">{t.cms.section2Title}</h3>
                      <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
                        <div>
                          <label className="font-semibold text-slate-600">N5 (BDT)</label>
                          <input
                            type="number"
                            defaultValue={cms.languageCoursePage?.n5PriceBdt ?? 12000}
                            onChange={(e) => {
                              if (!cms.languageCoursePage) cms.languageCoursePage = { ...DEFAULT_WEBSITE_CMS.languageCoursePage };
                              cms.languageCoursePage.n5PriceBdt = Number(e.target.value);
                              store.websiteCms[0] = cms;
                              setStore({ ...store });
                            }}
                            className="mt-1 w-full rounded-xl border border-slate-200 p-2 font-bold tabular-nums"
                          />
                        </div>
                        <div>
                          <label className="font-semibold text-slate-600">N4 (BDT)</label>
                          <input
                            type="number"
                            defaultValue={cms.languageCoursePage?.n4PriceBdt ?? 12000}
                            onChange={(e) => {
                              if (!cms.languageCoursePage) cms.languageCoursePage = { ...DEFAULT_WEBSITE_CMS.languageCoursePage };
                              cms.languageCoursePage.n4PriceBdt = Number(e.target.value);
                              store.websiteCms[0] = cms;
                              setStore({ ...store });
                            }}
                            className="mt-1 w-full rounded-xl border border-slate-200 p-2 font-bold tabular-nums"
                          />
                        </div>
                        <div>
                          <label className="font-semibold text-slate-600">Combo (BDT)</label>
                          <input
                            type="number"
                            defaultValue={cms.languageCoursePage?.comboPriceBdt ?? 21500}
                            onChange={(e) => {
                              if (!cms.languageCoursePage) cms.languageCoursePage = { ...DEFAULT_WEBSITE_CMS.languageCoursePage };
                              cms.languageCoursePage.comboPriceBdt = Number(e.target.value);
                              store.websiteCms[0] = cms;
                              setStore({ ...store });
                            }}
                            className="mt-1 w-full rounded-xl border border-slate-200 p-2 font-bold tabular-nums"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
                      <h3 className="font-bold text-sm text-slate-900">{t.cms.section3Title}</h3>
                      <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="font-semibold text-slate-600">{t.cms.regularTitle}</label>
                          <input
                            type="number"
                            defaultValue={cms.studyInJapanPage?.regularPackageFeeBdt ?? 120000}
                            onChange={(e) => {
                              if (!cms.studyInJapanPage) cms.studyInJapanPage = { ...DEFAULT_WEBSITE_CMS.studyInJapanPage };
                              cms.studyInJapanPage.regularPackageFeeBdt = Number(e.target.value);
                              store.websiteCms[0] = cms;
                              setStore({ ...store });
                            }}
                            className="mt-1 w-full rounded-xl border border-slate-200 p-2 font-bold tabular-nums"
                          />
                        </div>
                        <div>
                          <label className="font-semibold text-slate-600">{t.cms.premiumTitle}</label>
                          <input
                            type="number"
                            defaultValue={cms.studyInJapanPage?.premiumPackageFeeBdt ?? 1100000}
                            onChange={(e) => {
                              if (!cms.studyInJapanPage) cms.studyInJapanPage = { ...DEFAULT_WEBSITE_CMS.studyInJapanPage };
                              cms.studyInJapanPage.premiumPackageFeeBdt = Number(e.target.value);
                              store.websiteCms[0] = cms;
                              setStore({ ...store });
                            }}
                            className="mt-1 w-full rounded-xl border border-slate-200 p-2 font-bold tabular-nums"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3. Job Circulars Manager */}
                  <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-sm text-slate-900">{t.cms.section4Title}</h3>
                      <button
                        type="button"
                        onClick={() => setActiveModal("ADD_CIRCULAR")}
                        className="inline-flex items-center gap-1 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>{t.cms.newCircularBtn}</span>
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {(cms.jobCirculars || []).map((circ) => {
                        const circTitle =
                          typeof circ.title === "object" && circ.title
                            ? circ.title[language] || circ.title.bn || circ.title.en || "SSW Position"
                            : String(circ.title || "SSW Position");

                        return (
                          <div
                            key={circ.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-slate-200/70 p-3.5 gap-3"
                          >
                            <div>
                              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                                <span className="font-semibold text-emerald-700">{circ.category}</span>
                                <span>•</span>
                                <span>{circ.locationJapan}</span>
                              </div>
                              <p className="font-bold text-xs sm:text-sm text-slate-900 mt-0.5">
                                {circTitle}
                              </p>
                              <p className="text-xs text-slate-500 mt-0.5">
                                {circ.salaryYen} ({circ.salaryBdtEquivalent})
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                circ.isPublished = !circ.isPublished;
                                store.websiteCms[0] = cms;
                                saveCmsStore(store);
                                setStore({ ...store });
                                showToast(circ.isPublished ? t.cms.liveActive : t.cms.draft);
                              }}
                              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition shrink-0 ${
                                circ.isPublished
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                                {circ.isPublished ? t.cms.liveActive : t.cms.draft}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* =========================================================================
                  MODULE 9: UNIFIED BOOKSTORE, ORDERS, BLOG & CLOUD MEDIA
                  ========================================================================= */}
              {activeTab === "store_blog" && (
                <div className="space-y-6">
                  <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                          {tr(
                            "বুক স্টোর, অর্ডার, ব্লগ ও মিডিয়া প্যানেল",
                            "Bookstore, Orders, Blog & Media",
                            "ブックストア・注文・ブログ管理",
                          )}
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {tr(
                            "বই যোগ/এডিট, অর্ডার ট্র্যাকিং, ব্লগ পোস্ট এবং ক্লাউড স্টোরেজ পরিচালনা করুন।",
                            "Manage bookstore inventory, customer orders, blog articles, and media.",
                            "教材在庫、注文状況、ブログ記事およびクラウドアセットの管理。",
                          )}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href="/store"
                          target="_blank"
                          className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          <span>Store</span>
                          <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                        </Link>
                        <Link
                          href="/blog"
                          target="_blank"
                          className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          <span>Blog</span>
                          <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                        </Link>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-4">
                      {[
                        {
                          id: "summary",
                          label: tr("সামগ্রিক চিত্র", "Overview", "概要"),
                          icon: Sparkles,
                        },
                        {
                          id: "products",
                          label: tr("বই ও পণ্য", "Products", "商品・書籍"),
                          icon: BookOpen,
                          count: adminBundle.products.length,
                        },
                        {
                          id: "orders",
                          label: tr("বুক অর্ডার", "Orders", "注文管理"),
                          icon: ShoppingBag,
                          count: adminBundle.orders.length,
                        },
                        {
                          id: "blog",
                          label: tr("ব্লগ পোস্ট", "Blog", "ブログ記事"),
                          icon: FileText,
                          count: adminBundle.posts.length,
                        },
                        {
                          id: "categories",
                          label: tr("ক্যাটেগরি", "Categories", "カテゴリ"),
                          icon: Layers,
                          count: adminBundle.categories.length,
                        },
                        {
                          id: "reviews",
                          label: tr("রিভিউ", "Reviews", "レビュー"),
                          icon: Award,
                          count: adminBundle.reviews.length,
                        },
                        {
                          id: "uploads",
                          label: tr("ক্লাউড ফাইল", "Cloud Media", "クラウドアセット"),
                          icon: Database,
                        },
                      ].map((sub) => {
                        const SubIcon = sub.icon;
                        const active = storeSubTab === sub.id;
                        return (
                          <button
                            key={sub.id}
                            type="button"
                            onClick={() => setStoreSubTab(sub.id as any)}
                            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                              active
                                ? "bg-slate-900 text-white"
                                : "text-slate-600 hover:bg-slate-100"
                            }`}
                          >
                            <SubIcon className="h-3.5 w-3.5" />
                            <span>{sub.label}</span>
                            {sub.count ? (
                              <span className="text-[10px] opacity-75 tabular-nums">({sub.count})</span>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {storeSubTab === "summary" && (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <button
                        type="button"
                        onClick={() => setStoreSubTab("orders")}
                        className="hover-spotlight text-left rounded-2xl border border-slate-200/80 bg-white p-5"
                      >
                        <span className="text-xs text-slate-500">
                          {tr("পেন্ডিং বুক অর্ডার", "Pending Orders", "未処理の注文")}
                        </span>
                        <p className="mt-2 text-2xl font-bold text-slate-900 tabular-nums">
                          {adminBundle.summary?.pendingOrders ?? 0}
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setStoreSubTab("reviews")}
                        className="hover-spotlight text-left rounded-2xl border border-slate-200/80 bg-white p-5"
                      >
                        <span className="text-xs text-slate-500">
                          {tr("পেন্ডিং রিভিউ", "Pending Reviews", "承認待ちレビュー")}
                        </span>
                        <p className="mt-2 text-2xl font-bold text-slate-900 tabular-nums">
                          {adminBundle.summary?.pendingReviews ?? 0}
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setStoreSubTab("products")}
                        className="hover-spotlight text-left rounded-2xl border border-slate-200/80 bg-white p-5"
                      >
                        <span className="text-xs text-slate-500">
                          {tr("মোট বইয়ের সংখ্যা", "Total Books", "登録書籍総数")}
                        </span>
                        <p className="mt-2 text-2xl font-bold text-slate-900 tabular-nums">
                          {adminBundle.products.length}
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setStoreSubTab("blog")}
                        className="hover-spotlight text-left rounded-2xl border border-slate-200/80 bg-white p-5"
                      >
                        <span className="text-xs text-slate-500">
                          {tr("প্রকাশিত ব্লগ", "Published Articles", "公開ブログ記事")}
                        </span>
                        <p className="mt-2 text-2xl font-bold text-slate-900 tabular-nums">
                          {adminBundle.posts.length}
                        </p>
                      </button>
                    </div>
                  )}

                  {storeSubTab === "products" && (
                    <div className="rounded-2xl border border-slate-200/80 bg-white p-6">
                      <ProductManager
                        initialProducts={adminBundle.products}
                        categories={adminBundle.categories.filter((c) => c.type === "product")}
                      />
                    </div>
                  )}

                  {storeSubTab === "orders" && (
                    <div className="rounded-2xl border border-slate-200/80 bg-white p-6">
                      <OrderManager initialOrders={adminBundle.orders} />
                    </div>
                  )}

                  {storeSubTab === "blog" && (
                    <div className="rounded-2xl border border-slate-200/80 bg-white p-6">
                      <BlogManager
                        initialPosts={adminBundle.posts}
                        categories={adminBundle.categories.filter((c) => c.type === "blog")}
                      />
                    </div>
                  )}

                  {storeSubTab === "categories" && (
                    <div className="rounded-2xl border border-slate-200/80 bg-white p-6">
                      <CategoryManager initialCategories={adminBundle.categories} />
                    </div>
                  )}

                  {storeSubTab === "reviews" && (
                    <div className="rounded-2xl border border-slate-200/80 bg-white p-6">
                      <ReviewManager initialReviews={adminBundle.reviews} />
                    </div>
                  )}

                  {storeSubTab === "uploads" && (
                    <div className="rounded-2xl border border-slate-200/80 bg-white p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center">
                          <FileCheck2 className="h-7 w-7 text-emerald-600 mx-auto mb-2" />
                          <h4 className="text-xs font-bold text-slate-900">
                            Visa Documents (knltc-documents)
                          </h4>
                          <p className="text-[11px] text-slate-400 mt-1 mb-3">
                            PDF, DOC, Scanned Copies (Max 15MB)
                          </p>
                          <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 text-xs font-semibold transition">
                            <span>Select File</span>
                            <input
                              type="file"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const fd = new FormData();
                                fd.append("file", file);
                                fd.append("trackingNo", "DOC-" + Date.now().toString().slice(-4));
                                fd.append("docType", "verified_doc");
                                showToast("Uploading document...");
                                try {
                                  const res = await fetch("/api/cms/documents", {
                                    method: "POST",
                                    body: fd,
                                  });
                                  const json = await res.json();
                                  if (json.ok) {
                                    showToast("Document uploaded!", json.url);
                                  } else {
                                    showToast(json.error || "Upload failed");
                                  }
                                } catch {
                                  showToast("Upload connection error");
                                }
                              }}
                            />
                          </label>
                        </div>

                        <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center">
                          <ShoppingBag className="h-7 w-7 text-[#b91c1c] mx-auto mb-2" />
                          <h4 className="text-xs font-bold text-slate-900">
                            Book Covers &amp; Media (knltc-media)
                          </h4>
                          <p className="text-[11px] text-slate-400 mt-1 mb-3">
                            JPG, PNG, WEBP (Max 5MB)
                          </p>
                          <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl bg-[#b91c1c] hover:bg-red-800 text-white px-4 py-2 text-xs font-semibold transition">
                            <span>Select Image</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const fd = new FormData();
                                fd.append("file", file);
                                fd.append("bucket", "knltc-media");
                                showToast("Uploading image...");
                                try {
                                  const res = await fetch("/api/admin/upload", {
                                    method: "POST",
                                    body: fd,
                                  });
                                  const json = await res.json();
                                  if (json.url) {
                                    showToast("Image uploaded!", json.url);
                                  } else {
                                    showToast(json.error || "Upload failed");
                                  }
                                } catch {
                                  showToast("Upload connection error");
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* =========================================================================
                  MODULE 10: STUDENT PERSONAL PROFILE VIEW
                  ========================================================================= */}
              {activeTab === "my_profile" && (
                <StudentProfileView
                  lead={
                    store.crmLeads.find(
                      (l) =>
                        (currentUser?.linkedLeadId && l.id === currentUser.linkedLeadId) ||
                        (currentUser?.email &&
                          (l.loginEmail?.toLowerCase() === currentUser.email.toLowerCase() ||
                            l.email?.toLowerCase() === currentUser.email.toLowerCase())),
                    ) || store.crmLeads.find((l) => l.status === "ADMITTED")
                  }
                  visaApplicant={
                    store.visaApplicants.find((v) => {
                      const matchedLead = store.crmLeads.find(
                        (l) =>
                          (currentUser?.linkedLeadId && l.id === currentUser.linkedLeadId) ||
                          (currentUser?.email &&
                            l.loginEmail?.toLowerCase() === currentUser.email.toLowerCase()),
                      );
                      return matchedLead
                        ? v.phone === matchedLead.phone || v.trackingNo === matchedLead.fileTrackingNo
                        : false;
                    })
                  }
                  lmsBridge={
                    store.lmsBridges.find((lms) => {
                      const matchedLead = store.crmLeads.find(
                        (l) =>
                          (currentUser?.linkedLeadId && l.id === currentUser.linkedLeadId) ||
                          (currentUser?.email &&
                            l.loginEmail?.toLowerCase() === currentUser.email.toLowerCase()),
                      );
                      return matchedLead ? lms.phone === matchedLead.phone : false;
                    })
                  }
                  userEmail={currentUser?.email || ""}
                  userName={currentUser?.name || tr("শিক্ষার্থী", "Student Profile", "学生プロフィール")}
                />
              )}

              {/* =========================================================================
                  MODULE 11: USER ROLES & ACCESS CONTROL PANEL
                  ========================================================================= */}
              {activeTab === "users" && (
                <UserAccessControlPanel
                  onNotify={(msg) => {
                    setStore({ ...getCmsStore() });
                    showToast(msg);
                  }}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Individual Lead Profile Modal */}
          {selectedLeadForProfile && (
            <LeadProfileModal
              key={selectedLeadForProfile.id}
              lead={selectedLeadForProfile}
              allLeads={filteredLeads}
              onSelectLead={(nextLead) => setSelectedLeadForProfile(nextLead)}
              onClose={() => setSelectedLeadForProfile(null)}
              onSaved={(msg) => {
                const updatedStore = getCmsStore();
                setStore({ ...updatedStore });
                const refreshed = updatedStore.crmLeads.find(
                  (l) => l.id === selectedLeadForProfile.id
                );
                if (refreshed) setSelectedLeadForProfile(refreshed);
                showToast(msg);
              }}
              onDeleted={(deletedName) => {
                setStore({ ...getCmsStore() });
                showToast(
                  tr(
                    `"${deletedName}"-এর লিড প্রোফাইল মুছে ফেলা হয়েছে`,
                    `Deleted lead profile for "${deletedName}"`,
                    `「${deletedName}」のリードを削除しました`
                  )
                );
              }}
            />
          )}

          {/* CRM Google Sheets / CSV Import & Export Modal */}
          {crmImportExportMode && (
            <CrmImportExportModal
              initialMode={crmImportExportMode}
              allLeads={store.crmLeads}
              filteredLeads={filteredLeads}
              selectedLeadIds={selectedCrmLeadIds}
              staffList={store.staffList}
              activeBranch={activeBranch === "ALL" ? "DHK-HQ" : activeBranch}
              onClose={() => setCrmImportExportMode(null)}
              onImported={(summaryMsg) => {
                setStore({ ...getCmsStore() });
                setCrmImportExportMode(null);
                showToast(summaryMsg);
              }}
            />
          )}

          {/* 360° Partner School / University Profile Command Center Modal */}
          {selectedSchoolForProfile && (
            <PartnerProfileModal
              mode="SCHOOL"
              school={selectedSchoolForProfile}
              allLeads={store.crmLeads}
              allVisaApplicants={store.visaApplicants}
              allTransactions={store.transactions}
              language={language}
              onClose={() => setSelectedSchoolForProfile(null)}
              onRefreshStore={() => {
                const updatedStore = getCmsStore();
                setStore({ ...updatedStore });
                const refreshed = updatedStore.partnerSchools.find(
                  (s) => s.id === selectedSchoolForProfile.id,
                );
                if (refreshed) setSelectedSchoolForProfile(refreshed);
              }}
              onShowToast={(msg, sub) => showToast(msg, sub)}
            />
          )}

          {/* 360° B2B Agent Profile Command Center Modal */}
          {selectedAgentForProfile && (
            <PartnerProfileModal
              mode="AGENT"
              agent={selectedAgentForProfile}
              allLeads={store.crmLeads}
              allVisaApplicants={store.visaApplicants}
              allTransactions={store.transactions}
              language={language}
              onClose={() => setSelectedAgentForProfile(null)}
              onRefreshStore={() => {
                const updatedStore = getCmsStore();
                setStore({ ...updatedStore });
                const refreshed = updatedStore.b2bAgents.find(
                  (a) => a.id === selectedAgentForProfile.id,
                );
                if (refreshed) setSelectedAgentForProfile(refreshed);
              }}
              onShowToast={(msg, sub) => showToast(msg, sub)}
            />
          )}
        </main>
      </div>

      {/* =========================================================================
          UNIFIED SLEEK ANIMATED MODALS (For B2B, Partner School, HR, CRM, LMS, Finance)
          ========================================================================= */}
      <AnimatePresence>
        {activeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/50 backdrop-blur-xs p-4 overflow-y-auto"
            onClick={() => setActiveModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
            >
              {/* 1. ADD / EDIT B2B AGENT MODAL */}
              {activeModal === "ADD_B2B_AGENT" && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!b2bForm.organizationName.trim()) return;
                    if (editingB2bAgent) {
                      updateB2bAgent(editingB2bAgent.id, b2bForm);
                      showToast(
                        tr(
                          `${b2bForm.organizationName} আপডেট করা হয়েছে`,
                          `${b2bForm.organizationName} updated`,
                          `${b2bForm.organizationName}を更新しました`,
                        ),
                      );
                    } else {
                      addB2bAgent(b2bForm);
                      showToast(
                        tr(
                          `নতুন বিটুবি এজেন্ট (${b2bForm.organizationName}) যোগ করা হয়েছে`,
                          `B2B Agent (${b2bForm.organizationName}) added`,
                          `新規B2B代理店（${b2bForm.organizationName}）を追加しました`,
                        ),
                      );
                    }
                    setStore({ ...getCmsStore() });
                    setActiveModal(null);
                  }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-base font-bold text-slate-900">
                      {editingB2bAgent
                        ? tr("বিটুবি এজেন্ট তথ্য সম্পাদনা", "Edit B2B Agent", "B2B代理店情報の編集")
                        : tr("নতুন বিটুবি এজেন্ট / সাব-এজেন্ট যোগ করুন", "Add B2B Agent / Sub-Agent", "新規B2B代理店の追加")}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                    <div className="sm:col-span-2">
                      <label className="font-semibold text-slate-700">
                        {tr("প্রতিষ্ঠান বা এজেন্সির নাম *", "Organization / Agency Name *", "機関・代理店名 *")}
                      </label>
                      <input
                        type="text"
                        required
                        value={b2bForm.organizationName}
                        onChange={(e) => setB2bForm({ ...b2bForm, organizationName: e.target.value })}
                        placeholder={tr("এজেন্সি বা পার্টনারের নাম লিখুন", "Enter agency name", "代理店・機関名を入力")}
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-medium"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700">
                        {tr("এজেন্টের ধরন", "Agent Type", "代理店区分")}
                      </label>
                      <select
                        value={b2bForm.agentType}
                        onChange={(e) =>
                          setB2bForm({ ...b2bForm, agentType: e.target.value as B2bAgent["agentType"] })
                        }
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium"
                      >
                        <option value="INSTITUTIONAL">{tr("প্রাতিষ্ঠানিক পার্টনার", "Institutional Partner", "提携教育機関・法人パートナー")}</option>
                        <option value="LOCAL_SUB_AGENT">{tr("লোকাল সাব-এজেন্ট", "Local Sub-Agent", "地域サブエージェント")}</option>
                        <option value="CAMPUS_AMBASSADOR">{tr("ক্যাম্পাস অ্যাম্বাসেডর", "Campus Ambassador", "学生アンバサダー")}</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700">
                        {tr("শহর / জেলা", "City", "都市・所在地")}
                      </label>
                      <input
                        type="text"
                        value={b2bForm.city}
                        onChange={(e) => setB2bForm({ ...b2bForm, city: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-medium"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700">
                        {tr("যোগাযোগকারীর নাম *", "Contact Person *", "担当者名 *")}
                      </label>
                      <input
                        type="text"
                        required
                        value={b2bForm.contactPerson}
                        onChange={(e) => setB2bForm({ ...b2bForm, contactPerson: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-medium"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700">
                        {tr("ফোন নম্বর *", "Phone Number *", "電話番号 *")}
                      </label>
                      <input
                        type="text"
                        required
                        value={b2bForm.phone}
                        onChange={(e) => setB2bForm({ ...b2bForm, phone: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-mono"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700">
                        {tr("ট্রেড লাইসেন্স নম্বর", "Trade License No.", "事業ライセンス番号")}
                      </label>
                      <input
                        type="text"
                        value={b2bForm.tradeLicenseNo}
                        onChange={(e) => setB2bForm({ ...b2bForm, tradeLicenseNo: e.target.value })}
                        placeholder="TRAD/DSCC/..."
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-mono"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700">
                        {tr("NID / পাসপোর্ট নম্বর", "NID / Passport No.", "身分証明書・パスポート番号")}
                      </label>
                      <input
                        type="text"
                        value={b2bForm.nidOrPassportNo}
                        onChange={(e) => setB2bForm({ ...b2bForm, nidOrPassportNo: e.target.value })}
                        placeholder="NID / Passport"
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-mono"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <div className="flex items-center justify-between gap-2">
                        <label className="font-semibold text-slate-700">
                          {tr("এজেন্সির লোগো URL বা ফাইল আপলোড", "Agency Logo URL or Drive Upload", "ロゴ画像URLまたはドライブアップロード")}
                        </label>
                        <DriveFileUploadButton
                          folderName="KNLTC_B2B_Agents"
                          accept="image/*,application/pdf"
                          label={tr("গুগল ড্রাইভে আপলোড", "Upload to Google Drive", "Driveへアップロード")}
                          onUploaded={(url) => setB2bForm({ ...b2bForm, logoUrl: url })}
                        />
                      </div>
                      <input
                        type="text"
                        value={b2bForm.logoUrl}
                        onChange={(e) => setB2bForm({ ...b2bForm, logoUrl: e.target.value })}
                        placeholder={tr("লোগো ইমেজ লিংক দিন অথবা ডানপাশের বাটনে আপলোড করুন", "https://... (or click Upload to Google Drive)", "https://... (またはDriveへアップロード)")}
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-mono"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700">
                        {tr("রেফার্ড শিক্ষার্থী সংখ্যা", "Referred Students", "紹介生徒数")}
                      </label>
                      <input
                        type="number"
                        value={b2bForm.referredStudentsCount}
                        onChange={(e) =>
                          setB2bForm({ ...b2bForm, referredStudentsCount: Number(e.target.value) })
                        }
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-semibold tabular-nums"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700">
                        {tr("সফল ভিসা সংখ্যা", "Successful Visas", "ビザ取得実績数")}
                      </label>
                      <input
                        type="number"
                        value={b2bForm.successfulVisasCount}
                        onChange={(e) =>
                          setB2bForm({ ...b2bForm, successfulVisasCount: Number(e.target.value) })
                        }
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-semibold tabular-nums"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700">
                        {tr("চুক্তিভিত্তিক কমিশন (BDT)", "Agreed Commission (BDT)", "契約手数料 (BDT)")}
                      </label>
                      <input
                        type="number"
                        value={b2bForm.agreedCommissionBdt}
                        onChange={(e) =>
                          setB2bForm({ ...b2bForm, agreedCommissionBdt: Number(e.target.value) })
                        }
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-semibold tabular-nums"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700">
                        {tr("বকেয়া কমিশন (BDT)", "Pending Commission (BDT)", "未払手数料 (BDT)")}
                      </label>
                      <input
                        type="number"
                        value={b2bForm.pendingCommissionBdt}
                        onChange={(e) =>
                          setB2bForm({ ...b2bForm, pendingCommissionBdt: Number(e.target.value) })
                        }
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-semibold tabular-nums"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      {tr("বাতিল", "Cancel", "キャンセル")}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!b2bForm.organizationName.trim()) return;
                        let savedAgent: B2bAgent | null = null;
                        if (editingB2bAgent) {
                          savedAgent = updateB2bAgent(editingB2bAgent.id, b2bForm);
                        } else {
                          savedAgent = addB2bAgent(b2bForm);
                        }
                        setStore({ ...getCmsStore() });
                        setActiveModal(null);
                        if (savedAgent) {
                          setSelectedAgentForProfile(savedAgent);
                        }
                      }}
                      className="rounded-xl border border-slate-900 bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition"
                    >
                      {tr("সেভ ও ৩৬০° প্রোফাইল খুলুন", "Save & Open 360° Profile", "保存して360°プロファイルを開く")}
                    </button>
                    <button
                      type="submit"
                      className="rounded-xl bg-[#b91c1c] px-5 py-2 text-xs font-semibold text-white hover:bg-red-800 transition"
                    >
                      {tr("সেভ করুন", "Save Agent", "保存")}
                    </button>
                  </div>
                </form>
              )}

              {/* 2. ADD / EDIT PARTNER SCHOOL MODAL */}
              {activeModal === "ADD_PARTNER_SCHOOL" && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!schoolForm.name.trim()) return;
                    if (editingPartnerSchool) {
                      updatePartnerSchool(editingPartnerSchool.id, schoolForm);
                      showToast(tr(`${schoolForm.name} আপডেট করা হয়েছে`, `${schoolForm.name} updated`, `${schoolForm.name}を更新しました`));
                    } else {
                      addPartnerSchool(schoolForm);
                      showToast(tr(`${schoolForm.name} যোগ করা হয়েছে`, `${schoolForm.name} added`, `${schoolForm.name}を追加しました`));
                    }
                    setStore({ ...getCmsStore() });
                    setActiveModal(null);
                  }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-base font-bold text-slate-900">
                      {editingPartnerSchool
                        ? tr("পার্টনার স্কুল / ভার্সিটি সম্পাদনা", "Edit Partner School / University", "提携教育機関情報の編集")
                        : tr("নতুন জাপানি পার্টনার স্কুল / ভার্সিটি যোগ করুন", "Add Japanese Partner School / University", "新規提携教育機関の追加")}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                    <div className="sm:col-span-2">
                      <label className="font-semibold text-slate-700">
                        {tr("প্রতিষ্ঠানের নাম (English / বাংলা) *", "Institution Name *", "教育機関名 *")}
                      </label>
                      <input
                        type="text"
                        required
                        value={schoolForm.name}
                        onChange={(e) => setSchoolForm({ ...schoolForm, name: e.target.value })}
                        placeholder="e.g. Tokyo International Language Academy / University"
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-medium"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700">
                        {tr("প্রতিষ্ঠানের ক্যাটাগরি", "Institution Category", "機関区分")}
                      </label>
                      <select
                        value={schoolForm.institutionType}
                        onChange={(e) =>
                          setSchoolForm({
                            ...schoolForm,
                            institutionType: e.target.value as PartnerInstitutionType,
                          })
                        }
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-semibold"
                      >
                        <option value="LANGUAGE_SCHOOL">
                          {tr("জাপানি ভাষা স্কুল (Language School)", "Japanese Language School", "日本語教育機関（日本語学校）")}
                        </option>
                        <option value="UNIVERSITY">
                          {tr("বিশ্ববিদ্যালয় (University)", "University (Daigaku)", "大学・大学院")}
                        </option>
                        <option value="VOCATIONAL_COLLEGE">
                          {tr("ভোকেশনাল কলেজ (Senmon Gakko)", "Vocational College", "専門学校")}
                        </option>
                        <option value="SSW_EMPLOYER">
                          {tr("SSW নিয়োগদাতা কোম্পানি", "SSW Employer Company", "特定技能受入企業・監理団体")}
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700">
                        {tr("জাপানি নাম (ঐচ্ছিক)", "Japanese Name", "日本語名称（任意）")}
                      </label>
                      <input
                        type="text"
                        value={schoolForm.japaneseName}
                        onChange={(e) => setSchoolForm({ ...schoolForm, japaneseName: e.target.value })}
                        placeholder="東京国際日本語学院"
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-medium"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700">
                        {tr("জাপানে অবস্থান (শহর) *", "Location in Japan *", "日本国内の所在地（都市） *")}
                      </label>
                      <input
                        type="text"
                        required
                        value={schoolForm.location}
                        onChange={(e) => setSchoolForm({ ...schoolForm, location: e.target.value })}
                        placeholder="Tokyo / Hiroshima / Osaka"
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-medium"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700">
                        {tr("দায়িত্বশীল ব্যক্তি / প্রিন্সিপাল", "Contact Person", "担当者・校長名")}
                      </label>
                      <input
                        type="text"
                        value={schoolForm.contactPerson}
                        onChange={(e) =>
                          setSchoolForm({ ...schoolForm, contactPerson: e.target.value })
                        }
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-medium"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700">
                        {tr("ইমেইল", "Email", "メールアドレス")}
                      </label>
                      <input
                        type="email"
                        value={schoolForm.email}
                        onChange={(e) => setSchoolForm({ ...schoolForm, email: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-mono"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700">
                        {tr("১ম বর্ষের টিউশন ফি (Yen)", "1st Year Tuition (Yen)", "初年度学費 (Yen)")}
                      </label>
                      <input
                        type="number"
                        value={schoolForm.firstYearTuitionYen}
                        onChange={(e) =>
                          setSchoolForm({
                            ...schoolForm,
                            firstYearTuitionYen: Number(e.target.value),
                          })
                        }
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-semibold tabular-nums"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700">
                        {tr("স্টুডেন্ট পিছু কমিশন (Yen)", "Commission / Student (Yen)", "生徒1名あたり手数料 (Yen)")}
                      </label>
                      <input
                        type="number"
                        value={schoolForm.commissionPerStudentYen}
                        onChange={(e) =>
                          setSchoolForm({
                            ...schoolForm,
                            commissionPerStudentYen: Number(e.target.value),
                          })
                        }
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-semibold tabular-nums"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700">
                        {tr("স্টুডেন্ট পিছু কমিশন (BDT - ঐচ্ছিক)", "Commission / Student (BDT)", "生徒1名あたり手数料 (BDT)")}
                      </label>
                      <input
                        type="number"
                        value={schoolForm.commissionPerStudentBdt}
                        onChange={(e) =>
                          setSchoolForm({
                            ...schoolForm,
                            commissionPerStudentBdt: Number(e.target.value),
                          })
                        }
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-semibold tabular-nums"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700">
                        {tr("ইনটেক সিট কোটা (Seat Quota)", "Intake Seat Quota", "募集定員（名）")}
                      </label>
                      <input
                        type="number"
                        value={schoolForm.intakeQuota}
                        onChange={(e) =>
                          setSchoolForm({
                            ...schoolForm,
                            intakeQuota: Number(e.target.value),
                          })
                        }
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-semibold tabular-nums"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <label className="font-semibold text-slate-700">
                          {tr("লোগো / প্রসপেক্টাস URL", "Logo / Brochure URL", "ロゴ画像URL")}
                        </label>
                        <DriveFileUploadButton
                          folderName="KNLTC_Partner_Schools"
                          accept="image/*,application/pdf"
                          label={tr("ড্রাইভে আপলোড", "Upload to Drive", "Driveアップロード")}
                          onUploaded={(url) => setSchoolForm({ ...schoolForm, logoUrl: url })}
                        />
                      </div>
                      <input
                        type="text"
                        value={schoolForm.logoUrl}
                        onChange={(e) => setSchoolForm({ ...schoolForm, logoUrl: e.target.value })}
                        placeholder="https://..."
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      {tr("বাতিল", "Cancel", "キャンセル")}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!schoolForm.name.trim()) return;
                        let savedSchool: JapanesePartnerSchool | null = null;
                        if (editingPartnerSchool) {
                          savedSchool = updatePartnerSchool(editingPartnerSchool.id, schoolForm);
                        } else {
                          savedSchool = addPartnerSchool(schoolForm);
                        }
                        setStore({ ...getCmsStore() });
                        setActiveModal(null);
                        if (savedSchool) {
                          setSelectedSchoolForProfile(savedSchool);
                        }
                      }}
                      className="rounded-xl border border-[#b91c1c] bg-red-50 px-4 py-2 text-xs font-semibold text-[#b91c1c] hover:bg-red-100 transition"
                    >
                      {tr("সেভ ও ৩৬০° প্রোফাইল খুলুন", "Save & Open 360° Profile", "保存して360°プロファイルを開く")}
                    </button>
                    <button
                      type="submit"
                      className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition"
                    >
                      {tr("সেভ করুন", "Save Partner School", "提携校を保存")}
                    </button>
                  </div>
                </form>
              )}

              {/* 3. ADD / EDIT HR TEAM MEMBER MODAL */}
              {activeModal === "ADD_STAFF" && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!staffForm.name.trim()) return;
                    if (editingStaff) {
                      updateStaffMember(editingStaff.id, staffForm);
                      showToast(
                        tr(
                          `${staffForm.name}-এর তথ্য আপডেট হয়েছে`,
                          `${staffForm.name} updated`,
                          `${staffForm.name}の情報を更新しました`,
                        ),
                      );
                    } else {
                      addStaffMember(staffForm);
                      showToast(
                        tr(
                          `নতুন টিম মেম্বার (${staffForm.name}) যুক্ত করা হয়েছে`,
                          `Team member (${staffForm.name}) added`,
                          `新規スタッフ（${staffForm.name}）を追加しました`,
                        ),
                      );
                    }
                    setStore({ ...getCmsStore() });
                    setActiveModal(null);
                  }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-base font-bold text-slate-900">
                      {editingStaff
                        ? tr("টিম মেম্বার তথ্য সম্পাদনা", "Edit Team Member", "チームメンバー情報編集")
                        : tr("নতুন টিম মেম্বার / স্টাফ যোগ করুন", "Add New Team Member", "新規スタッフ登録")}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                    <div className="sm:col-span-2">
                      <label className="font-semibold text-slate-700">
                        {tr("কর্মকর্তা / স্টাফের পূর্ণ নাম *", "Full Name *", "氏名（フルネーム）*")}
                      </label>
                      <input
                        type="text"
                        required
                        value={staffForm.name}
                        onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                        placeholder={tr("যেমন: সুমাইয়া সুলতানা", "e.g. Sumaiya Sultana", "例：スマイヤ・スルタナ")}
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-medium"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700">
                        {tr("পদবী / ভূমিকা *", "Role *", "役職・職種 *")}
                      </label>
                      <select
                        value={staffForm.role}
                        onChange={(e) => {
                          const newRole = e.target.value as StaffMember["role"];
                          const newKpiType: NonNullable<StaffMember["kpiType"]> =
                            newRole === "TELE_COUNSELOR" || newRole === "COUNSELOR"
                              ? "CALLS"
                              : newRole === "SENIOR_SENSEI"
                                ? "CLASSES"
                                : newRole === "VISA_OFFICER"
                                  ? "VISA_FILES"
                                  : "SALARIED_FIXED";
                          setStaffForm({
                            ...staffForm,
                            role: newRole,
                            kpiType: newKpiType,
                            kpiTarget:
                              newKpiType === "CALLS"
                                ? 500
                                : newKpiType === "CLASSES"
                                  ? 24
                                  : newKpiType === "VISA_FILES"
                                    ? 15
                                    : 0,
                          });
                        }}
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium"
                      >
                        <option value="TELE_COUNSELOR">{tr("টেলি-কাউন্সেলর (Tele-Counselor & Outreach)", "Tele-Counselor & Outreach", "テレカウンセラー・広報")}</option>
                        <option value="COUNSELOR">{tr("এডমিশন কাউন্সেলর (Admission Counselor)", "Admission Counselor", "入学相談カウンセラー")}</option>
                        <option value="SENIOR_SENSEI">{tr("জাপানি শিক্ষক / সেন্সি (Japanese Sensei)", "Japanese Sensei", "専任日本語教師 (Sensei)")}</option>
                        <option value="VISA_OFFICER">{tr("ভিসা প্রসেসিং অফিসার (Visa Specialist)", "Visa Specialist", "ビザ・COE申請専門官")}</option>
                        <option value="BRANCH_MANAGER">{tr("ব্রাঞ্চ ম্যানেজার (Branch Manager)", "Branch Manager", "支店長・拠点統括")}</option>
                        <option value="ACCOUNTANT_ADMIN">{tr("একাউন্টস ও অ্যাডমিন (Accounts & Admin)", "Accounts & Admin", "経理・総務管理")}</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700">
                        {tr("কর্মস্থল / লোকেশন", "Work Location", "勤務地・オフィス")}
                      </label>
                      <select
                        value={staffForm.location}
                        onChange={(e) =>
                          setStaffForm({
                            ...staffForm,
                            location: e.target.value as StaffMember["location"],
                          })
                        }
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium"
                      >
                        <option value="DHAKA_OFFICE">{tr("ঢাকা প্রধান কার্যালয় (HQ)", "Dhaka Office (HQ)", "ダッカ本社 (HQ)")}</option>
                        <option value="KHULNA_OFFICE">{tr("খুলনা শাখা কার্যালয়", "Khulna Branch Office", "クルナ支店")}</option>
                        <option value="REMOTE">{tr("রিমোট / হোম অফিস", "Remote / Home Office", "リモート・在宅")}</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700">
                        {tr("ফোন নম্বর", "Phone Number", "電話番号")}
                      </label>
                      <input
                        type="text"
                        value={staffForm.phone}
                        onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-mono"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700">
                        {tr("ইমেইল", "Email", "メールアドレス")}
                      </label>
                      <input
                        type="email"
                        value={staffForm.email}
                        onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-mono"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700">
                        {tr("মাসিক মূল বেতন (BDT)", "Monthly Base Salary (BDT)", "月次基本給 (BDT)")}
                      </label>
                      <input
                        type="number"
                        value={staffForm.monthlyBaseSalaryBdt}
                        onChange={(e) =>
                          setStaffForm({ ...staffForm, monthlyBaseSalaryBdt: Number(e.target.value) })
                        }
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-semibold tabular-nums"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700">
                        {tr("পারফরম্যান্স বোনাস (BDT)", "Performance Bonus (BDT)", "業績賞与・ボーナス (BDT)")}
                      </label>
                      <input
                        type="number"
                        value={staffForm.performanceBonusBdt}
                        onChange={(e) =>
                          setStaffForm({ ...staffForm, performanceBonusBdt: Number(e.target.value) })
                        }
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-semibold tabular-nums"
                      />
                    </div>

                    {/* Role-Specific KPI Inputs: Only Tele-Counselors have call targets! */}
                    {(staffForm.kpiType === "CALLS" ||
                      staffForm.role === "TELE_COUNSELOR" ||
                      staffForm.role === "COUNSELOR") && (
                      <>
                        <div>
                          <label className="font-semibold text-slate-700">
                            {tr("মাসিক কল টার্গেট", "Monthly Call Target", "月間架電目標数")}
                          </label>
                          <input
                            type="number"
                            value={staffForm.callsTargetMonthly}
                            onChange={(e) =>
                              setStaffForm({
                                ...staffForm,
                                callsTargetMonthly: Number(e.target.value),
                                kpiTarget: Number(e.target.value),
                              })
                            }
                            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-semibold tabular-nums"
                          />
                        </div>

                        <div>
                          <label className="font-semibold text-slate-700">
                            {tr("সম্পন্ন কল সংখ্যা", "Calls Completed", "達成架電数")}
                          </label>
                          <input
                            type="number"
                            value={staffForm.callsCompleted}
                            onChange={(e) =>
                              setStaffForm({
                                ...staffForm,
                                callsCompleted: Number(e.target.value),
                                kpiAchieved: Number(e.target.value),
                              })
                            }
                            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-semibold tabular-nums"
                          />
                        </div>
                      </>
                    )}

                    {staffForm.role === "SENIOR_SENSEI" && (
                      <>
                        <div>
                          <label className="font-semibold text-slate-700">
                            {tr("মাসিক ক্লাস / লেকচার টার্গেট", "Monthly Class Target", "月間担当講義数")}
                          </label>
                          <input
                            type="number"
                            value={staffForm.kpiTarget || 24}
                            onChange={(e) =>
                              setStaffForm({ ...staffForm, kpiTarget: Number(e.target.value) })
                            }
                            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-semibold tabular-nums"
                          />
                        </div>

                        <div>
                          <label className="font-semibold text-slate-700">
                            {tr("সম্পন্ন ক্লাস সংখ্যা", "Classes Conducted", "実施済講義数")}
                          </label>
                          <input
                            type="number"
                            value={staffForm.kpiAchieved || 0}
                            onChange={(e) =>
                              setStaffForm({ ...staffForm, kpiAchieved: Number(e.target.value) })
                            }
                            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-semibold tabular-nums"
                          />
                        </div>
                      </>
                    )}

                    {staffForm.role === "VISA_OFFICER" && (
                      <>
                        <div>
                          <label className="font-semibold text-slate-700">
                            {tr("টার্গেট ভিসা ও COE ফাইল প্রসেসিং", "Target Visa / COE Files", "目標申請ファイル数")}
                          </label>
                          <input
                            type="number"
                            value={staffForm.kpiTarget || 15}
                            onChange={(e) =>
                              setStaffForm({ ...staffForm, kpiTarget: Number(e.target.value) })
                            }
                            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-semibold tabular-nums"
                          />
                        </div>

                        <div>
                          <label className="font-semibold text-slate-700">
                            {tr("সম্পন্ন ফাইল সংখ্যা", "Files Processed", "処理済ファイル数")}
                          </label>
                          <input
                            type="number"
                            value={staffForm.kpiAchieved || 0}
                            onChange={(e) =>
                              setStaffForm({ ...staffForm, kpiAchieved: Number(e.target.value) })
                            }
                            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-semibold tabular-nums"
                          />
                        </div>
                      </>
                    )}

                    {(staffForm.role === "BRANCH_MANAGER" || staffForm.role === "ACCOUNTANT_ADMIN") && (
                      <div className="sm:col-span-2 rounded-xl bg-slate-50 border border-slate-200/80 p-3 text-slate-600">
                        <p className="font-semibold text-xs text-slate-800 flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          <span>{tr("ফিক্সড পে-রোল ও অফিস অপারেশনস", "Fixed Salaried Role", "固定給・管理統括職")}</span>
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {tr(
                            "এই পদের জন্য কোনো টেলি-কলিং বা আউটরিচ টার্গেটের প্রয়োজন নেই। বেতন ও অ্যাডমিন কার্যক্রম নিয়মিত ট্র্যাক হবে।",
                            "No tele-calling or outreach KPIs are required for this management role.",
                            "この役職にはテレコール目標はありません。月次固定給および総務業務として管理されます。"
                          )}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      {tr("বাতিল", "Cancel", "キャンセル")}
                    </button>
                    <button
                      type="submit"
                      className="rounded-xl bg-[#b91c1c] px-5 py-2 text-xs font-semibold text-white hover:bg-red-800 transition"
                    >
                      {tr("সেভ করুন", "Save Team Member", "保存する")}
                    </button>
                  </div>
                </form>
              )}

              {/* 4. QUICK ADD CRM LEAD MODAL */}
              {activeModal === "ADD_LEAD" && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!leadForm.name.trim() || !leadForm.phone.trim()) return;
                    const selectedCounselor = store.staffList.find(
                      (s) => s.id === leadForm.assignedCounselorId,
                    );
                    const selectedSchool = store.partnerSchools.find(
                      (s) => s.id === leadForm.targetSchoolId,
                    );
                    addCrmLead({
                      name: leadForm.name.trim(),
                      phone: leadForm.phone.trim(),
                      whatsapp: leadForm.phone.trim().startsWith("+88")
                        ? leadForm.phone.trim()
                        : `+88${leadForm.phone.trim()}`,
                      city: leadForm.city,
                      source: leadForm.referredByAgentId ? "SUB_AGENT" : leadForm.source,
                      interest: leadForm.interest,
                      status: "NEW",
                      education: leadForm.education,
                      japaneseProficiency: leadForm.japaneseProficiency,
                      studyGapYears: leadForm.studyGapYears,
                      assignedTo: selectedCounselor?.name || currentUser?.name || tr("শেখ বাসেত", "Sheikh Baset", "シェイク・バセット"),
                      assignedCounselorId: leadForm.assignedCounselorId || undefined,
                      referredByAgentId: leadForm.referredByAgentId || undefined,
                      targetSchoolId: leadForm.targetSchoolId || undefined,
                      targetSchoolName: selectedSchool?.schoolName || undefined,
                      branch: activeBranch === "KHULNA-01" ? "KHULNA-01" : "DHK-HQ",
                      notes: leadForm.notes || "New lead inquiry added.",
                      followUpDate: new Date().toISOString().slice(0, 10),
                    });
                    setStore({ ...getCmsStore() });
                    setLeadForm({
                      ...leadForm,
                      name: "",
                      phone: "",
                      notes: "",
                      assignedCounselorId: "",
                      referredByAgentId: "",
                      targetSchoolId: "",
                    });
                    setActiveModal(null);
                    showToast(t.toastSuccess);
                  }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-base font-bold text-slate-900">
                      {tr("নতুন প্রার্থী / CRM লিড যোগ করুন", "Add New CRM Lead", "新規CRM見込み客登録")}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                    <div>
                      <label className="font-semibold text-slate-700">
                        {tr("প্রার্থীর নাম *", "Candidate Name *", "候補者氏名 *")}
                      </label>
                      <input
                        type="text"
                        required
                        value={leadForm.name}
                        onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-medium"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">
                        {tr("ফোন / WhatsApp *", "Phone / WhatsApp *", "電話番号・WhatsApp *")}
                      </label>
                      <input
                        type="text"
                        required
                        value={leadForm.phone}
                        onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                        placeholder="017..."
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-mono"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">
                        {tr("শহর", "City", "居住都市")}
                      </label>
                      <input
                        type="text"
                        value={leadForm.city}
                        onChange={(e) => setLeadForm({ ...leadForm, city: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-medium"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">
                        {tr("আগ্রহের প্রোগ্রাম", "Program Interest", "希望プログラム")}
                      </label>
                      <select
                        value={leadForm.interest}
                        onChange={(e) =>
                          setLeadForm({ ...leadForm, interest: e.target.value as ServiceInterest })
                        }
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium"
                      >
                        <option value="STUDENT_VISA_REGULAR">{tr("স্টুডেন্ট ভিসা (রেগুলার)", "Student Visa (Regular)", "留学ビザ（レギュラー）")}</option>
                        <option value="STUDENT_VISA_PREMIUM">{tr("স্টুডেন্ট ভিসা (প্রিমিয়াম প্যাকেজ)", "Student Visa (Premium)", "留学ビザ（プレミアム包括）")}</option>
                        <option value="SSW_CONSTRUCTION_SPECIAL">{tr("এসএসডব্লিউ কনস্ট্রাকশন", "SSW Construction", "特定技能（建設）")}</option>
                        <option value="SSW_CAREGIVER">{tr("এসএসডব্লিউ কেয়ারগিভার", "SSW Caregiver", "特定技能（介護）")}</option>
                        <option value="JAPANESE_N5">{tr("জাপানি ভাষা N5 কোর্স", "Japanese N5 Course", "日本語N5講習コース")}</option>
                        <option value="JAPANESE_N4">{tr("জাপানি ভাষা N4 কোর্স", "Japanese N4 Course", "日本語N4講習コース")}</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">
                        {tr("শিক্ষাগত যোগ্যতা", "Education", "最終学歴")}
                      </label>
                      <input
                        type="text"
                        value={leadForm.education}
                        onChange={(e) => setLeadForm({ ...leadForm, education: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-medium"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">
                        {tr("জাপানি ভাষার স্তর", "Japanese Level", "日本語レベル")}
                      </label>
                      <select
                        value={leadForm.japaneseProficiency}
                        onChange={(e) =>
                          setLeadForm({
                            ...leadForm,
                            japaneseProficiency: e.target.value as CrmLead["japaneseProficiency"],
                          })
                        }
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium"
                      >
                        <option value="NONE">{tr("শুরুর স্তর / জানা নেই", "Beginner / None", "初級・未学習")}</option>
                        <option value="LEARNING_N5">{tr("N5 অধ্যায়নরত", "Learning N5", "N5学習中")}</option>
                        <option value="PASSED_N5">{tr("N5 উত্তীর্ণ", "Passed N5", "N5合格")}</option>
                        <option value="PASSED_N4">{tr("N4 উত্তীর্ণ", "Passed N4", "N4合格")}</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">
                        {tr("দায়িত্বপ্রাপ্ত কাউন্সেলর (HR)", "Assigned Counselor", "担当カウンセラー")}
                      </label>
                      <select
                        value={leadForm.assignedCounselorId}
                        onChange={(e) =>
                          setLeadForm({ ...leadForm, assignedCounselorId: e.target.value })
                        }
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium"
                      >
                        <option value="">{tr("-- স্বয়ংক্রিয় / নির্বাচন করুন --", "-- Auto / Select Counselor --", "-- 自動割当 / カウンセラー選択 --")}</option>
                        {store.staffList
                          .filter((s) => s.role === "COUNSELOR" || s.role === "TELE_COUNSELOR" || s.role === "BRANCH_MANAGER")
                          .map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name} ({s.role})
                            </option>
                          ))}
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">
                        {tr("রেফারকারী বিটুবি এজেন্ট (যদি থাকে)", "Referring B2B Agent", "紹介B2Bエージェント")}
                      </label>
                      <select
                        value={leadForm.referredByAgentId}
                        onChange={(e) =>
                          setLeadForm({ ...leadForm, referredByAgentId: e.target.value })
                        }
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium"
                      >
                        <option value="">{tr("-- সরাসরি অফিস (Direct Lead) --", "-- Direct Office Lead --", "-- 直通来館（Direct Lead）--")}</option>
                        {store.b2bAgents.map((ag) => (
                          <option key={ag.id} value={ag.id}>
                            {ag.agencyName} ({ag.contactPerson})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="font-semibold text-slate-700">
                        {tr("পছন্দের জাপানি পার্টনার স্কুল (ঐচ্ছিক)", "Target Partner School", "志望提携教育機関")}
                      </label>
                      <select
                        value={leadForm.targetSchoolId}
                        onChange={(e) =>
                          setLeadForm({ ...leadForm, targetSchoolId: e.target.value })
                        }
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium"
                      >
                        <option value="">{tr("-- পরবর্তীতে নির্ধারণ করা হবে --", "-- To be determined later --", "-- 後ほど決定 --")}</option>
                        {store.partnerSchools.map((sc) => (
                          <option key={sc.id} value={sc.id}>
                            {sc.schoolName} ({sc.city}) — {tr("কোটা", "Quota", "受入枠")}: {sc.activeStudentsCount}/{sc.intakeQuota || 20}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="font-semibold text-slate-700">
                        {tr("কাউন্সেলিং নোট", "Counseling Notes", "カウンセリング記録・備考")}
                      </label>
                      <input
                        type="text"
                        value={leadForm.notes}
                        onChange={(e) => setLeadForm({ ...leadForm, notes: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-medium"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      {tr("বাতিল", "Cancel", "キャンセル")}
                    </button>
                    <button
                      type="submit"
                      className="rounded-xl bg-[#b91c1c] px-5 py-2 text-xs font-semibold text-white hover:bg-red-800 transition"
                    >
                      {tr("লিড সেভ করুন", "Save Lead", "リードを保存")}
                    </button>
                  </div>
                </form>
              )}

              {/* 5. ISSUE LMS ACCOUNT MODAL */}
              {activeModal === "ADD_LMS" && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!lmsForm.studentName.trim() || !lmsForm.phone.trim()) return;
                    addLmsCredentials({
                      studentName: lmsForm.studentName.trim(),
                      phone: lmsForm.phone.trim(),
                      courseLevel: lmsForm.courseLevel,
                      enrollmentNo: `KNLTC-2026-${lmsForm.courseLevel}-${Math.floor(100 + Math.random() * 900)}`,
                      portalUsername:
                        lmsForm.portalUsername.trim() ||
                        `${lmsForm.studentName.toLowerCase().replace(/\s+/g, "_")}_knltc`,
                      portalPasswordMasked: lmsForm.portalPasswordMasked,
                      activeBatch: lmsForm.activeBatch,
                      assignedSenseiId: lmsForm.assignedSenseiId || undefined,
                      linkedLeadId: lmsForm.linkedLeadId || undefined,
                    });
                    setStore({ ...getCmsStore() });
                    setActiveModal(null);
                    showToast(t.toastSuccess);
                  }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-base font-bold text-slate-900">{t.lms.issueAccountBtn}</h3>
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                    <div className="sm:col-span-2">
                      <label className="font-semibold text-slate-700">
                        {tr("CRM থেকে শিক্ষার্থী নির্বাচন করুন (ঐচ্ছিক)", "Link CRM Student (Optional)", "CRM受講生と連携（任意）")}
                      </label>
                      <select
                        value={lmsForm.linkedLeadId}
                        onChange={(e) => {
                          const lead = store.crmLeads.find((l) => l.id === e.target.value);
                          if (lead) {
                            setLmsForm({
                              ...lmsForm,
                              linkedLeadId: lead.id,
                              studentName: lead.name,
                              phone: lead.phone,
                            });
                          } else {
                            setLmsForm({ ...lmsForm, linkedLeadId: "" });
                          }
                        }}
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium"
                      >
                        <option value="">{tr("-- ম্যানুয়ালি নাম লিখুন অথবা তালিকা থেকে বাছুন --", "-- Enter manually or pick from CRM --", "-- 手動入力 または CRMから選択 --")}</option>
                        {store.crmLeads.map((l) => (
                          <option key={l.id} value={l.id}>
                            {l.name} ({l.phone}) — {l.status}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">{tr("শিক্ষার্থীর নাম *", "Student Name *", "受講生氏名 *")}</label>
                      <input
                        type="text"
                        required
                        value={lmsForm.studentName}
                        onChange={(e) => setLmsForm({ ...lmsForm, studentName: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-medium"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">{tr("ফোন নম্বর *", "Phone *", "電話番号 *")}</label>
                      <input
                        type="text"
                        required
                        value={lmsForm.phone}
                        onChange={(e) => setLmsForm({ ...lmsForm, phone: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-mono"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">{tr("কোর্স লেভেল", "Course Level", "受講コースレベル")}</label>
                      <select
                        value={lmsForm.courseLevel}
                        onChange={(e) =>
                          setLmsForm({ ...lmsForm, courseLevel: e.target.value as any })
                        }
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium"
                      >
                        <option value="N5">JLPT N5</option>
                        <option value="N4">JLPT N4</option>
                        <option value="IRODORI">{tr("ইরোডোরি স্পোকেন", "Irodori Spoken", "いろどり会話")}</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">{tr("ব্যাচ", "Batch", "クラス・期")}</label>
                      <input
                        type="text"
                        value={lmsForm.activeBatch}
                        onChange={(e) => setLmsForm({ ...lmsForm, activeBatch: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-medium"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="font-semibold text-slate-700">
                        {tr("দায়িত্বপ্রাপ্ত জাপানি শিক্ষক / সেন্সি (HR)", "Assigned Sensei (HR)", "専任日本語講師（Sensei）")}
                      </label>
                      <select
                        value={lmsForm.assignedSenseiId}
                        onChange={(e) => setLmsForm({ ...lmsForm, assignedSenseiId: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium"
                      >
                        <option value="">{tr("-- সেন্সি নির্বাচন করুন --", "-- Select Sensei --", "-- 講師を選択 --")}</option>
                        {store.staffList
                          .filter((s) => s.role === "SENIOR_SENSEI")
                          .map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name} ({s.location})
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      {tr("বাতিল", "Cancel", "キャンセル")}
                    </button>
                    <button
                      type="submit"
                      className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition"
                    >
                      {tr("একাউন্ট ইস্যু করুন", "Issue Account", "アカウント発行")}
                    </button>
                  </div>
                </form>
              )}

              {/* 6. RECORD STUDENT INCOME / PAYMENT MODAL */}
              {activeModal === "ADD_PAYMENT" && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!paymentForm.studentName.trim()) return;
                    const newTx = addFinancialTransaction({
                      receiptNo: `KNLTC-REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
                      date: new Date().toISOString().slice(0, 10),
                      studentName: paymentForm.studentName.trim(),
                      studentPhone: paymentForm.studentPhone.trim(),
                      category: "INCOME",
                      type: paymentForm.type,
                      amountBdt: Number(paymentForm.amountBdt) || 0,
                      paymentMethod: paymentForm.paymentMethod,
                      referenceOrTrx:
                        paymentForm.referenceOrTrx.trim() || `TRX-${Date.now().toString().slice(-6)}`,
                      branch: paymentForm.branch || (activeBranch === "KHULNA-01" ? "KHULNA-01" : "DHK-HQ"),
                      verifiedBy: currentUser?.name || "Sheikh Baset (MD)",
                      notes: paymentForm.notes,
                      linkedLeadId: paymentForm.linkedLeadId || undefined,
                    });
                    setStore({ ...getCmsStore() });
                    setActiveModal(null);
                    showToast(
                      tr(
                        `৳${Number(paymentForm.amountBdt).toLocaleString()} টাকা জমা নেওয়া হয়েছে ও বকেয়া হালনাগাদ হয়েছে`,
                        `Payment recorded & student dues updated`,
                        `学費受領を記録し未納額を更新しました`
                      )
                    );
                    setSelectedTxForReceipt(newTx);
                    setActiveModal("VIEW_RECEIPT");
                  }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                        <TrendingUp className="h-4 w-4" />
                      </span>
                      <h3 className="text-base font-bold text-slate-900">
                        {tr("শিক্ষার্থীর ফি জমা ও মানি রসিদ ইস্যু", "Record Student Fee Payment", "学費受領登録・領収証発行")}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                    <div className="sm:col-span-2">
                      <label className="font-semibold text-slate-700">
                        {tr(
                          "CRM শিক্ষার্থী নির্বাচন করুন (স্বয়ংক্রিয় বকেয়া সমন্বয়)",
                          "Select CRM Student (Auto-sync Dues)",
                          "CRM受講生選択（未納額自動照合）"
                        )}
                      </label>
                      <select
                        value={paymentForm.linkedLeadId}
                        onChange={(e) => {
                          const lead = store.crmLeads.find((l) => l.id === e.target.value);
                          if (lead) {
                            const due =
                              lead.dueAmountBdt ??
                              Math.max(0, (lead.contractAmountBdt || 0) - (lead.paidAmountBdt || 0));
                            setPaymentForm({
                              ...paymentForm,
                              linkedLeadId: lead.id,
                              studentName: lead.name,
                              studentPhone: lead.phone,
                              branch: lead.branch,
                              amountBdt: due > 0 ? due : paymentForm.amountBdt,
                            });
                          } else {
                            setPaymentForm({ ...paymentForm, linkedLeadId: "" });
                          }
                        }}
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium"
                      >
                        <option value="">{tr("-- তালিকা থেকে শিক্ষার্থী বাছুন অথবা নিচে নাম লিখুন --", "-- Select student from list or type below --", "-- 受講生を一覧から選択 または 下記に入力 --")}</option>
                        {store.crmLeads.map((l) => {
                          const due =
                            l.dueAmountBdt ??
                            Math.max(0, (l.contractAmountBdt || 0) - (l.paidAmountBdt || 0));
                          return (
                            <option key={l.id} value={l.id}>
                              {l.name} ({l.phone}) — {tr("বকেয়া", "Dues", "未納残額")}: ৳{due.toLocaleString()}
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="font-semibold text-slate-700">
                        {tr("শিক্ষার্থীর পূর্ণ নাম *", "Student Name *", "受講生氏名 *")}
                      </label>
                      <input
                        type="text"
                        required
                        value={paymentForm.studentName}
                        onChange={(e) =>
                          setPaymentForm({ ...paymentForm, studentName: e.target.value })
                        }
                        placeholder={tr("শিক্ষার্থীর নাম লিখুন", "Enter student name", "受講生氏名を入力")}
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-medium"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700">
                        {tr("মোবাইল / হোয়াটসঅ্যাপ নম্বর", "Student Phone", "電話番号・WhatsApp")}
                      </label>
                      <input
                        type="text"
                        value={paymentForm.studentPhone}
                        onChange={(e) =>
                          setPaymentForm({ ...paymentForm, studentPhone: e.target.value })
                        }
                        placeholder="017xxxxxxxx"
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-mono"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700">
                        {tr("আয়ের খাত / সার্ভিস ধরন *", "Payment Type *", "受領項目・サービス種別 *")}
                      </label>
                      <select
                        value={paymentForm.type}
                        onChange={(e) =>
                          setPaymentForm({ ...paymentForm, type: e.target.value as any })
                        }
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium"
                      >
                        <option value="SERVICE_CHARGE_COE">
                          {tr("প্রি-ভিসা / COE সার্ভিস চার্জ (৳ ১,২০,০০০)", "Pre-Visa / COE Service Charge (৳ 120,000)", "COE交付後申請代行費（৳ 120,000）")}
                        </option>
                        <option value="COURSE_FEE">
                          {tr("ভাষা প্রশিক্ষণ কোর্স ফি (N5 / N4 - ৳ ১২,০০০)", "Language Course Fee (N5 / N4 - ৳ 12,000)", "日本語講習受講料（N5/N4 - ৳ 12,000）")}
                        </option>
                        <option value="PREMIUM_PACKAGE">
                          {tr("অল-ইন-ওয়ান প্রিমিয়াম প্যাকেজ কিস্তি (৳ ১১,০০,০০০)", "All-in-One Premium Package Installment (৳ 1,100,000)", "オールインワン包括パッケージ分割（৳ 1,100,000）")}
                        </option>
                        <option value="REGULAR_SERVICE_CHARGE">
                          {tr("রেগুলার ভিসা প্রসেসিং অগ্রিম", "Regular Visa Processing Advance", "通常ビザ手続前受金")}
                        </option>
                        <option value="BOOK_STORE_SALE">
                          {tr("মিন্না নো নিহোঙ্গো বই ও ম্যাটেরিয়াল সেল", "Minna no Nihongo Book & Material Sale", "みんなの日本語教材・テキスト売上")}
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700">
                        {tr("পরিশোধিত টাকার পরিমাণ (BDT) *", "Amount (BDT) *", "受領金額 (BDT) *")}
                      </label>
                      <input
                        type="number"
                        required
                        value={paymentForm.amountBdt}
                        onChange={(e) =>
                          setPaymentForm({ ...paymentForm, amountBdt: Number(e.target.value) })
                        }
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-semibold tabular-nums"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700">
                        {tr("পেমেন্ট মাধ্যম", "Payment Method", "決済手段")}
                      </label>
                      <select
                        value={paymentForm.paymentMethod}
                        onChange={(e) =>
                          setPaymentForm({ ...paymentForm, paymentMethod: e.target.value as any })
                        }
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium"
                      >
                        <option value="BKASH">bKash Merchant / Personal</option>
                        <option value="NAGAD">Nagad</option>
                        <option value="BANK_TRANSFER">Bank Transfer (IBBL / Pubali)</option>
                        <option value="CASH_OFFICE">{tr("অফিস ডেস্কে নগদ", "Cash at Office Desk", "事務所窓口現金")}</option>
                        <option value="AAMARPAY">AamarPay Gateway</option>
                        <option value="SSLCOMMERZ">SSLCOMMERZ Gateway</option>
                      </select>
                    </div>

                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <label className="font-semibold text-slate-700">
                          {tr("Trx ID / রসিদ স্ক্রিনশট", "Trx ID / Receipt Link", "取引番号 / 領収証URL")}
                        </label>
                        <DriveFileUploadButton
                          folderName="KNLTC_Payment_Receipts"
                          accept="image/*,application/pdf"
                          label={tr("রসিদ আপলোড", "Upload Receipt", "証憑アップロード")}
                          onUploaded={(url) =>
                            setPaymentForm({ ...paymentForm, referenceOrTrx: url })
                          }
                        />
                      </div>
                      <input
                        type="text"
                        value={paymentForm.referenceOrTrx}
                        onChange={(e) =>
                          setPaymentForm({ ...paymentForm, referenceOrTrx: e.target.value })
                        }
                        placeholder="e.g. 9J28A00X or Drive Receipt URL"
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-mono"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700">
                        {tr("ব্রাঞ্চ / অফিস", "Branch", "拠点・支店")}
                      </label>
                      <select
                        value={paymentForm.branch}
                        onChange={(e) =>
                          setPaymentForm({ ...paymentForm, branch: e.target.value as any })
                        }
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium"
                      >
                        <option value="DHK-HQ">{tr("ঢাকা প্রধান কার্যালয় (HQ)", "Dhaka Office (HQ)", "ダッカ本社 (HQ)")}</option>
                        <option value="KHULNA-01">{tr("খুলনা শাখা কার্যালয়", "Khulna Branch Office", "クルナ支店")}</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="font-semibold text-slate-700">
                        {tr("মন্তব্য / বিবরণ", "Notes", "備考・詳細")}
                      </label>
                      <input
                        type="text"
                        value={paymentForm.notes}
                        onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                        placeholder={tr("ইনটেক সেশন, ব্যাচ বা বিশেষ নোট...", "Intake session, batch, or special notes...", "入学時期・クラス・特記事項...")}
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-medium"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      {tr("বাতিল", "Cancel", "キャンセル")}
                    </button>
                    <button
                      type="submit"
                      className="rounded-xl bg-emerald-700 px-5 py-2 text-xs font-semibold text-white hover:bg-emerald-800 transition"
                    >
                      {tr("জমা গ্রহণ ও রসিদ তৈরি করুন", "Save & Generate Receipt", "領収登録・受領書発行")}
                    </button>
                  </div>
                </form>
              )}

              {/* 7. RECORD OPERATIONAL EXPENSE MODAL */}
              {activeModal === "ADD_EXPENSE" && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!expenseForm.title.trim()) return;
                    addFinancialTransaction({
                      receiptNo: `EXP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
                      date: new Date().toISOString().slice(0, 10),
                      studentName: expenseForm.title.trim(),
                      category: "EXPENSE",
                      type: expenseForm.type,
                      amountBdt: Number(expenseForm.amountBdt) || 0,
                      paymentMethod: expenseForm.paymentMethod,
                      referenceOrTrx:
                        expenseForm.referenceOrTrx.trim() || `EXP-${Date.now().toString().slice(-6)}`,
                      branch: expenseForm.branch,
                      verifiedBy: currentUser?.name || "Sheikh Baset (MD)",
                      notes: expenseForm.notes,
                    });
                    setStore({ ...getCmsStore() });
                    setActiveModal(null);
                    showToast(
                      tr(
                        `৳${Number(expenseForm.amountBdt).toLocaleString()} টাকা ব্যয় রেকর্ড হয়েছে`,
                        `Expense recorded successfully`,
                        `経費支出を記録しました`
                      )
                    );
                  }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-50 text-[#b91c1c]">
                        <ArrowDownRight className="h-4 w-4" />
                      </span>
                      <h3 className="text-base font-bold text-slate-900">
                        {tr("অফিস অপারেশনাল ব্যয় ও খরচ রেকর্ড", "Record Operational Expense", "運営経費支出登録")}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                    <div className="sm:col-span-2">
                      <label className="font-semibold text-slate-700">
                        {tr("ব্যয়ের বিবরণ / প্রাপক *", "Expense Title / Payee *", "経費項目・支払先 *")}
                      </label>
                      <input
                        type="text"
                        required
                        value={expenseForm.title}
                        onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })}
                        placeholder={tr("যেমন: ঢাকা অফিস ভাড়া ও বিদ্যুৎ বিল", "e.g. Dhaka Office Rent & Electricity", "例：ダッカ事務所賃料・光熱費")}
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-medium"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700">
                        {tr("ব্যয়ের খাত / ক্যাটাগরি *", "Expense Category *", "支出科目・カテゴリー *")}
                      </label>
                      <select
                        value={expenseForm.type}
                        onChange={(e) =>
                          setExpenseForm({ ...expenseForm, type: e.target.value as any })
                        }
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium"
                      >
                        <option value="EXPENSE_RENT">{tr("অফিস ভাড়া ও ইউটিলিটি বিল", "Office Rent & Utilities", "事務所家賃・水道光熱費")}</option>
                        <option value="EXPENSE_PAYROLL">{tr("শিক্ষক (Sensei) ও স্টাফ বেতন", "Sensei & Staff Payroll", "講師・スタッフ人件費")}</option>
                        <option value="EXPENSE_MARKETING">{tr("ফেসবুক / মেটা ডিজিটাল বিজ্ঞাপন", "Meta / Facebook Digital Marketing", "SNS・Web広告宣伝費")}</option>
                        <option value="EXPENSE_EMBASSY_NOTARY">{tr("নোটারি, পরারাষ্ট্র মন্ত্রণালয় সত্যায়ন ও কোরিয়ার", "Notary, MOFA Attestation & Courier", "公証・外務省認証・国際配送代")}</option>
                        <option value="EXPENSE_EXAM_FEE">{tr("NAT-TEST / JLPT ভেন্যু ও এক্সাম ফি", "NAT-TEST / JLPT Exam Fees", "NAT-TEST/JLPT受験料代行")}</option>
                        <option value="EXPENSE_B2B_COMMISSION">{tr("বিটুবি সাব-এজেন্ট কমিশন বিতরণ", "B2B Sub-Agent Commission Payout", "提携取次店コミッション支払")}</option>
                        <option value="EXPENSE_MISC">{tr("বিবিধ অফিস স্টেশনারি ও আপ্যায়ন", "Misc Office Supplies & Hospitality", "消耗品・事務用品・交際費")}</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700">
                        {tr("খরচের পরিমাণ (BDT) *", "Amount (BDT) *", "支出金額 (BDT) *")}
                      </label>
                      <input
                        type="number"
                        required
                        value={expenseForm.amountBdt}
                        onChange={(e) =>
                          setExpenseForm({ ...expenseForm, amountBdt: Number(e.target.value) })
                        }
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-semibold tabular-nums"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700">
                        {tr("পরিশোধের মাধ্যম", "Payment Method", "支払方法")}
                      </label>
                      <select
                        value={expenseForm.paymentMethod}
                        onChange={(e) =>
                          setExpenseForm({ ...expenseForm, paymentMethod: e.target.value as any })
                        }
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium"
                      >
                        <option value="BANK_TRANSFER">{tr("ব্যাংক চেক / ট্রান্সফার", "Bank Cheque / Transfer", "銀行振込・小切手")}</option>
                        <option value="CASH_OFFICE">{tr("অফিস পেটি ক্যাশ", "Cash from Office Petty Cash", "小口現金・デスク支払")}</option>
                        <option value="BKASH">bKash Payment</option>
                        <option value="NAGAD">Nagad</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700">
                        {tr("ব্রাঞ্চ", "Branch", "拠点・支店")}
                      </label>
                      <select
                        value={expenseForm.branch}
                        onChange={(e) =>
                          setExpenseForm({ ...expenseForm, branch: e.target.value as any })
                        }
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium"
                      >
                        <option value="DHK-HQ">{tr("ঢাকা প্রধান কার্যালয় (HQ)", "Dhaka Office (HQ)", "ダッカ本社 (HQ)")}</option>
                        <option value="KHULNA-01">{tr("খুলনা শাখা কার্যালয়", "Khulna Branch Office", "クルナ支店")}</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <div className="flex items-center justify-between gap-2">
                        <label className="font-semibold text-slate-700">
                          {tr("ভাউচার নং / গুগল ড্রাইভ ভাউচার আপলোড", "Voucher / Drive Upload", "伝票番号・証憑参照")}
                        </label>
                        <DriveFileUploadButton
                          folderName="KNLTC_Expense_Vouchers"
                          accept="image/*,application/pdf"
                          label={tr("ভাউচার আপলোড", "Upload Voucher", "伝票アップロード")}
                          onUploaded={(url) =>
                            setExpenseForm({ ...expenseForm, referenceOrTrx: url })
                          }
                        />
                      </div>
                      <input
                        type="text"
                        value={expenseForm.referenceOrTrx}
                        onChange={(e) =>
                          setExpenseForm({ ...expenseForm, referenceOrTrx: e.target.value })
                        }
                        placeholder={tr("ভাউচার নং বা মেমো বিবরণ", "Voucher # or Drive link", "伝票番号・メモ詳細")}
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      {tr("বাতিল", "Cancel", "キャンセル")}
                    </button>
                    <button
                      type="submit"
                      className="rounded-xl bg-[#b91c1c] px-5 py-2 text-xs font-semibold text-white hover:bg-red-800 transition"
                    >
                      {tr("ব্যয় সেভ করুন", "Save Expense", "経費を保存")}
                    </button>
                  </div>
                </form>
              )}

              {/* 8. OFFICIAL PRINTABLE MONEY RECEIPT MODAL */}
              {activeModal === "VIEW_RECEIPT" && selectedTxForReceipt && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 print:hidden">
                    <div className="flex items-center gap-2">
                      <Receipt className="h-5 w-5 text-emerald-700" />
                      <h3 className="text-base font-bold text-slate-900">
                        {tr("অফিসিয়াল পেমেন্ট ভাউচার ও মানি রসিদ", "Official Money Receipt", "公式領収証・受領書")}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 transition"
                      >
                        <Printer className="h-3.5 w-3.5" />
                        <span>{tr("প্রিন্ট রসিদ", "Print Voucher", "領収書印刷")}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveModal(null)}
                        className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Printable Receipt Card */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 text-slate-900 shadow-sm print:border-0 print:p-0">
                    {/* Header */}
                    <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-lg bg-[#b91c1c] text-white font-bold flex items-center justify-center text-sm">
                            KN
                          </div>
                          <div>
                            <h2 className="text-base font-black tracking-tight uppercase">
                              Kamrul Nippon Language & Training Center (KNLTC)
                            </h2>
                            <p className="text-[11px] text-slate-500 font-medium">
                              {tr(
                                "সরকারি অনুমোদন ও ট্রেড লাইসেন্স নং: ১৭৭৯২৬ • জাপান স্টাডি ও এসএসডব্লিউ গেটওয়ে",
                                "Govt Reg & Trade License No: 177926 • Japan Study & SSW Gateway",
                                "政府公認・貿易ライセンス番号: 177926 • 日本留学・特定技能ゲートウェイ"
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="rounded bg-slate-900 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                          {tr("মানি রসিদ", "Money Receipt", "領収証")}
                        </span>
                        <p className="font-mono text-xs font-bold text-slate-900 mt-1">
                          {selectedTxForReceipt.receiptNo}
                        </p>
                        <p className="text-[11px] text-slate-500 font-medium">
                          {tr("তারিখ", "Date", "発行日")}: {selectedTxForReceipt.date}
                        </p>
                      </div>
                    </div>

                    {/* Student & Payment Details */}
                    <div className="mt-5 grid grid-cols-2 gap-4 text-xs">
                      <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400">
                          {tr("অর্থ প্রদানকারী (শিক্ষার্থী / ক্লায়েন্ট)", "Received From (Student / Client)", "支払者（受講生・申請者）")}
                        </span>
                        <p className="text-sm font-bold text-slate-900">{selectedTxForReceipt.studentName}</p>
                        {selectedTxForReceipt.studentPhone && (
                          <p className="text-slate-600 font-mono">{tr("মোবাইল", "Mobile", "連絡先")}: {selectedTxForReceipt.studentPhone}</p>
                        )}
                        <p className="text-slate-500">
                          {tr("ব্রাঞ্চ", "Branch", "支店")}: {selectedTxForReceipt.branch === "DHK-HQ" ? tr("ঢাকা প্রধান কার্যালয় (ধানমন্ডি)", "Dhaka HQ (Dhanmondi)", "ダッカ本社（Dhanmondi）") : tr("খুলনা শাখা", "Khulna Branch", "クルナ支店")}
                        </p>
                      </div>

                      <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400">
                          {tr("পেমেন্ট মাধ্যম / একাউন্ট", "Payment Gateway / Account", "受取口座・決済手段")}
                        </span>
                        <p className="text-sm font-bold text-slate-900">{selectedTxForReceipt.paymentMethod}</p>
                        <p className="font-mono text-slate-600">
                          {tr("রেফারেন্স / Trx", "Trx / Ref", "取引番号 / 照会")}: {selectedTxForReceipt.referenceOrTrx || tr("যাচাইকৃত নগদ", "Verified Cash", "現金受領済")}
                        </p>
                        <p className="text-emerald-700 font-semibold">
                          {tr("স্ট্যাটাস: ১০০% নিরীক্ষিত ও পরিশোধিত", "Status: 100% Verified Paid", "ステータス: 100% 監査照合済・納入完了")}
                        </p>
                      </div>
                    </div>

                    {/* Line Items */}
                    <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-100 font-bold text-slate-700">
                          <tr>
                            <th className="px-4 py-2.5">{tr("সেবা / ফি বিবরণ", "Item / Service Particulars", "受領項目・明細")}</th>
                            <th className="px-4 py-2.5 text-right">{tr("পরিমাণ (BDT)", "Amount (BDT)", "金額 (BDT)")}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          <tr>
                            <td className="px-4 py-3">
                              <p className="font-bold text-slate-900">
                                {selectedTxForReceipt.type === "SERVICE_CHARGE_COE"
                                  ? tr(
                                      "জাপান স্টুডেন্ট ভিসা সার্ভিস চার্জ (COE অনুমোদনের পর প্রযোজ্য)",
                                      "Japan Student Visa Service Charge (Payable strictly AFTER COE Approval)",
                                      "日本留学ビザ申請手数料（COE交付後のみ請求）"
                                    )
                                  : selectedTxForReceipt.type === "COURSE_FEE"
                                    ? tr(
                                        "৩ মাসের নিবিড় জাপানি ভাষা প্রশিক্ষণ কোর্স (N5/N4)",
                                        "3-Month Intensive Japanese Language Course (N5/N4)",
                                        "3ヶ月集中日本語講習コース（N5/N4）"
                                      )
                                    : selectedTxForReceipt.type === "PREMIUM_PACKAGE"
                                      ? tr(
                                          "অল-ইন-ওয়ান জাপান স্টাডি সমন্বিত প্যাকেজ কিস্তি",
                                          "All-in-One Comprehensive Japan Study Package Installment",
                                          "日本留学オールインワン包括パッケージ分割納入"
                                        )
                                      : selectedTxForReceipt.type}
                              </p>
                              {selectedTxForReceipt.notes && (
                                <p className="text-[11px] text-slate-500 mt-0.5">{selectedTxForReceipt.notes}</p>
                              )}
                            </td>
                            <td className="px-4 py-3 text-right font-bold text-slate-900 tabular-nums">
                              ৳{selectedTxForReceipt.amountBdt.toLocaleString()}
                            </td>
                          </tr>
                        </tbody>
                        <tfoot className="bg-slate-50 font-bold border-t border-slate-200">
                          <tr>
                            <td className="px-4 py-2.5 text-slate-700">{tr("মোট গৃহীত অর্থ", "Total Received Amount", "合計受領金額")}</td>
                            <td className="px-4 py-2.5 text-right text-emerald-800 text-sm tabular-nums">
                              ৳{selectedTxForReceipt.amountBdt.toLocaleString()} BDT
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    {/* Seal & Authorization */}
                    <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between text-xs">
                      <div>
                        <div className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-emerald-800 font-bold">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          <span>{tr("KNLTC অ্যাকাউন্টস ভেরিফাইড", "KNLTC ACCOUNTS VERIFIED", "KNLTC会計監査認証済")}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">{tr("কম্পিউটার জেনারেটেড অফিসিয়াল অডিট রসিদ", "Computer-generated official audit receipt.", "システム自動発行・公式監査証憑")}</p>
                      </div>
                      <div className="text-right">
                        <div className="w-36 border-b border-slate-400 pb-1 font-semibold text-slate-800">
                          {selectedTxForReceipt.verifiedBy || "Sheikh Baset (MD)"}
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">{tr("অনুমোদিত স্বাক্ষরকারী", "Authorized Signatory", "代表署名・認印")}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 7. PUBLISH NEW JOB CIRCULAR MODAL */}
              {activeModal === "ADD_CIRCULAR" && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!circularForm.title.trim()) return;
                    const newCirc: JobCircular = {
                      id: `job-${Date.now()}`,
                      title: {
                        bn: circularForm.title.trim(),
                        en: circularForm.title.trim(),
                        ja: circularForm.title.trim(),
                      },
                      category: circularForm.category,
                      salaryYen: circularForm.salaryYen,
                      salaryBdtEquivalent: circularForm.salaryBdtEquivalent,
                      locationJapan: circularForm.locationJapan,
                      openings: Number(circularForm.openings) || 5,
                      requirements: {
                        bn: circularForm.requirements,
                        en: circularForm.requirements,
                        ja: circularForm.requirements,
                      },
                      specialBenefitsBn: circularForm.specialBenefitsBn,
                      isPublished: true,
                      deadline: circularForm.deadline,
                    };
                    cms.jobCirculars.unshift(newCirc);
                    saveCmsStore(store);
                    setStore({ ...store });
                    setActiveModal(null);
                    showToast(t.toastSuccess);
                  }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-base font-bold text-slate-900">{t.cms.newCircularBtn}</h3>
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                    <div className="sm:col-span-2">
                      <label className="font-semibold text-slate-700">{tr("পদের নাম *", "Job Title *", "職種・求人タイトル *")}</label>
                      <input
                        type="text"
                        required
                        value={circularForm.title}
                        onChange={(e) => setCircularForm({ ...circularForm, title: e.target.value })}
                        placeholder={tr("যেমন: এসএসডব্লিউ ফুড সার্ভিস স্পেশালিস্ট (টোকিও)", "e.g. SSW Food Service Specialist (Tokyo)", "例：特定技能 外食業スタッフ（東京）")}
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-medium"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">{tr("ক্যাটাগরি", "Category", "募集区分・業種")}</label>
                      <select
                        value={circularForm.category}
                        onChange={(e) =>
                          setCircularForm({ ...circularForm, category: e.target.value as any })
                        }
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium"
                      >
                        <option value="SSW_CONSTRUCTION">{tr("এসএসডব্লিউ কনস্ট্রাকশন", "SSW Construction", "特定技能（建設）")}</option>
                        <option value="SSW_CAREGIVER">{tr("এসএসডব্লিউ কেয়ারগিভার", "SSW Caregiver", "特定技能（介護）")}</option>
                        <option value="SSW_AGRICULTURE">{tr("এসএসডব্লিউ কৃষি", "SSW Agriculture", "特定技能（農業）")}</option>
                        <option value="SSW_FOOD_SERVICE">{tr("এসএসডব্লিউ ফুড সার্ভিস", "SSW Food Service", "特定技能（外食業）")}</option>
                        <option value="TITP_TECHNICAL">{tr("টিআইটিপি টেকনিক্যাল", "TITP Technical", "技能実習（TITP）")}</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">{tr("জাপানের লোকেশন / শহর", "Location in Japan", "日本勤務地・都市")}</label>
                      <input
                        type="text"
                        value={circularForm.locationJapan}
                        onChange={(e) =>
                          setCircularForm({ ...circularForm, locationJapan: e.target.value })
                        }
                        placeholder="Tokyo / Osaka"
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-medium"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">{tr("মাসিক বেতন (ইয়েন)", "Salary (Yen)", "月給（日本円）")}</label>
                      <input
                        type="text"
                        value={circularForm.salaryYen}
                        onChange={(e) =>
                          setCircularForm({ ...circularForm, salaryYen: e.target.value })
                        }
                        placeholder="¥210,000 / month"
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-medium"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">{tr("সমপরিমাণ টাকা (BDT)", "Salary (BDT)", "想定月給（BDT換算）")}</label>
                      <input
                        type="text"
                        value={circularForm.salaryBdtEquivalent}
                        onChange={(e) =>
                          setCircularForm({ ...circularForm, salaryBdtEquivalent: e.target.value })
                        }
                        placeholder="৳1,65,000 / মাস"
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-medium"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      {tr("বাতিল", "Cancel", "キャンセル")}
                    </button>
                    <button
                      type="submit"
                      className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition"
                    >
                      {tr("সার্কুলার প্রকাশ করুন", "Publish Circular", "求人を公開する")}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
