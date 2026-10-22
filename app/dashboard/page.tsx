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
} from "lucide-react";
import {
  getCmsStore,
  saveCmsStore,
  fetchLiveStoreFromServer,
  addCrmLead,
  updateCrmLeadStatus,
  updateVisaStage,
  addLmsCredentials,
  addFinancialTransaction,
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
  type MasterKnlTcStore,
  type UserRole,
  type BranchCode,
  type DashboardTabId,
  type CrmLead,
  type VisaStage,
  type LeadStatus,
  type LeadSource,
  type ServiceInterest,
  type JobCircular,
  type JapanesePartnerSchool,
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
import UserAccessControlPanel from "@/components/admin/UserAccessControlPanel";
import StudentProfileView from "@/components/admin/StudentProfileView";
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
  const [selectedLeadForProfile, setSelectedLeadForProfile] = useState<CrmLead | null>(null);
  const [activeTab, setActiveTab] = useState<DashboardTabId>("overview");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [storeSubTab, setStoreSubTab] = useState<
    "summary" | "products" | "orders" | "blog" | "categories" | "reviews" | "uploads"
  >("summary");

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
  });

  // Form states for Issue LMS Account
  const [lmsForm, setLmsForm] = useState({
    studentName: "",
    phone: "",
    courseLevel: "N5" as "N5" | "N4" | "IRODORI",
    activeBatch: "N5 Intensive Batch (Dhaka HQ)",
    portalUsername: "",
    portalPasswordMasked: "N5@knltc2026",
  });

  // Form states for Partner School
  const [schoolForm, setSchoolForm] = useState({
    name: "",
    japaneseName: "",
    location: "Tokyo",
    contactPerson: "",
    email: "",
    commissionPerStudentYen: 80000,
    commissionPerStudentBdt: 64000,
    activeStudentsCount: 0,
    totalCommissionReceivedYen: 0,
    status: "ACTIVE_PARTNER" as JapanesePartnerSchool["status"],
  });

  // Form states for B2B Agent
  const [b2bForm, setB2bForm] = useState({
    organizationName: "",
    agentType: "LOCAL_SUB_AGENT" as B2bAgent["agentType"],
    contactPerson: "",
    phone: "",
    city: "Dhaka",
    referredStudentsCount: 0,
    successfulVisasCount: 0,
    agreedCommissionBdt: 30000,
    paidCommissionBdt: 0,
    pendingCommissionBdt: 0,
  });

  // Form states for HR Staff Member
  const [staffForm, setStaffForm] = useState({
    name: "",
    role: "TELE_COUNSELOR" as StaffMember["role"],
    location: "DHAKA_OFFICE" as StaffMember["location"],
    phone: "",
    email: "",
    monthlyBaseSalaryBdt: 15000,
    callsTargetMonthly: 600,
    callsCompleted: 0,
    admissionsTarget: 10,
    admissionsAchieved: 0,
    performanceBonusBdt: 0,
    status: "ACTIVE" as StaffMember["status"],
  });

  // Form states for Finance Payment
  const [paymentForm, setPaymentForm] = useState({
    studentName: "",
    type: "REGULAR_SERVICE_CHARGE" as FinancialTransaction["type"],
    amountBdt: 120000,
    paymentMethod: "BKASH" as FinancialTransaction["paymentMethod"],
    referenceOrTrx: "",
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
        ? "データベースと同期中..."
        : language === "en"
          ? "Syncing with cloud database..."
          : "ক্লাউড ডাটাবেজের সাথে সিঙ্ক হচ্ছে...",
    );
    try {
      const [live] = await Promise.all([fetchLiveStoreFromServer(), loadAdminBundle()]);
      if (live) setStore({ ...live });
      showToast(
        language === "ja"
          ? "データベース同期が完了しました"
          : language === "en"
            ? "Database synced successfully"
            : "ডাটাবেজ সিঙ্ক সফল হয়েছে",
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

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {
      // ignore
    }
    window.location.href = "/admin/login";
  };

  const filteredLeads = useMemo(() => {
    if (!store) return [];
    return store.crmLeads.filter((l) => {
      if (activeBranch === "ALL") return true;
      return l.branch === activeBranch;
    });
  }, [store, activeBranch]);

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

  const cms = store.websiteCms[0];

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
        location: school.location,
        contactPerson: school.contactPerson,
        email: school.email,
        commissionPerStudentYen: school.commissionPerStudentYen,
        commissionPerStudentBdt: school.commissionPerStudentBdt,
        activeStudentsCount: school.activeStudentsCount,
        totalCommissionReceivedYen: school.totalCommissionReceivedYen,
        status: school.status,
      });
    } else {
      setEditingPartnerSchool(null);
      setSchoolForm({
        name: "",
        japaneseName: "",
        location: "Tokyo",
        contactPerson: "",
        email: "",
        commissionPerStudentYen: 80000,
        commissionPerStudentBdt: 64000,
        activeStudentsCount: 0,
        totalCommissionReceivedYen: 0,
        status: "ACTIVE_PARTNER",
      });
    }
    setActiveModal("ADD_PARTNER_SCHOOL");
  };

  // Open HR Staff Modal (for Add or Edit)
  const openStaffModal = (staff?: StaffMember) => {
    if (staff) {
      setEditingStaff(staff);
      setStaffForm({
        name: staff.name,
        role: staff.role,
        location: staff.location,
        phone: staff.phone,
        email: staff.email,
        monthlyBaseSalaryBdt: staff.monthlyBaseSalaryBdt,
        callsTargetMonthly: staff.callsTargetMonthly,
        callsCompleted: staff.callsCompleted,
        admissionsTarget: staff.admissionsTarget,
        admissionsAchieved: staff.admissionsAchieved,
        performanceBonusBdt: staff.performanceBonusBdt,
        status: staff.status,
      });
    } else {
      setEditingStaff(null);
      setStaffForm({
        name: "",
        role: "TELE_COUNSELOR",
        location: "DHAKA_OFFICE",
        phone: "017",
        email: "",
        monthlyBaseSalaryBdt: 15000,
        callsTargetMonthly: 600,
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
                        ¥{(store.partnerSchools.reduce((sum, s) => sum + s.totalCommissionReceivedYen, 0) || 2400000).toLocaleString()}
                      </p>
                      <p className="mt-1 text-[11px] text-slate-400">{t.kpi.yenCommissionSub}</p>
                    </div>

                    <div className="hover-spotlight rounded-2xl border border-slate-200/80 bg-white p-5">
                      <div className="flex items-center justify-between text-slate-400">
                        <span className="text-xs font-medium text-slate-500">{t.kpi.monthlyCashFlow}</span>
                        <DollarSign className="h-4 w-4 text-emerald-600" />
                      </div>
                      <p className="mt-3 text-2xl font-bold text-emerald-700 tabular-nums">
                        ৳{(store.transactions.reduce((sum, tx) => sum + tx.amountBdt, 0) || 480000).toLocaleString()}
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
                          <p className="text-sm font-bold text-slate-900 mt-0.5 tabular-nums">৳ 48,00,000</p>
                        </div>
                        <div>
                          <span className="text-slate-400">{t.module1.operationalCost}</span>
                          <p className="text-sm font-bold text-slate-900 mt-0.5 tabular-nums">৳ 12,00,000</p>
                        </div>
                        <div>
                          <span className="text-slate-400">{t.module1.netProfit}</span>
                          <p className="text-sm font-bold text-emerald-700 mt-0.5 tabular-nums">৳ 36,00,000</p>
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
                            onClick={() => setActiveTab("b2b")}
                            className="text-[11px] font-semibold text-[#b91c1c] hover:underline"
                          >
                            {language === "bn" ? "সব দেখুন →" : "Manage →"}
                          </button>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 mt-1">
                          {store.partnerSchools[0]?.name || t.module1.partnerTitle}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {store.partnerSchools[0]?.contactPerson || t.module1.partnerDesc}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* =========================================================================
                  MODULE 2: OMNI-CHANNEL CRM & TELE-COUNSELOR WORKSPACE
                  ========================================================================= */}
              {activeTab === "crm" && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                        {t.crm.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                        {t.crm.subtitle}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveModal("ADD_LEAD")}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#b91c1c] px-4 py-2.5 text-xs font-semibold text-white hover:bg-red-800 transition shadow-2xs shrink-0"
                    >
                      <Plus className="h-4 w-4" />
                      <span>{t.crm.quickAddBtn}</span>
                    </button>
                  </div>

                  <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="border-b border-slate-100 bg-slate-50/70 font-semibold text-slate-500">
                          <tr>
                            <th className="px-4 py-3">{t.crm.colCandidate}</th>
                            <th className="px-4 py-3">{t.crm.colSource}</th>
                            <th className="px-4 py-3">{t.crm.colEducation}</th>
                            <th className="px-4 py-3">{t.crm.colCounselor}</th>
                            <th className="px-4 py-3">{t.crm.colStatus}</th>
                            <th className="px-4 py-3 text-right">{t.crm.colAction}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredLeads.map((lead) => {
                            const waText = encodeURIComponent(
                              `Hello ${lead.name}, greetings from KNLTC. We would like to follow up on your Japan study & visa inquiry.`,
                            );
                            const waLink = `https://wa.me/${lead.whatsapp.replace(/[^0-9]/g, "")}?text=${waText}`;

                            return (
                              <tr key={lead.id} className="hover:bg-slate-50/70 transition-colors">
                                <td className="px-4 py-3.5">
                                  <button
                                    type="button"
                                    onClick={() => setSelectedLeadForProfile(lead)}
                                    className="text-left group"
                                  >
                                    <p className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-[#b91c1c] transition-colors">
                                      {lead.name}
                                    </p>
                                  </button>
                                  <p className="text-slate-400 font-mono text-[11px] tabular-nums mt-0.5">
                                    {lead.phone} • {lead.city}
                                  </p>
                                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                                    {lead.isFileOpened && (
                                      <span className="text-[10px] font-semibold text-[#b91c1c]">
                                        • {language === "bn" ? "ফাইল ওপেনকৃত" : "File Opened"}
                                      </span>
                                    )}
                                    {lead.isCourseEnrolled && (
                                      <span className="text-[10px] font-semibold text-emerald-700">
                                        • {language === "bn" ? "কোর্সে ভর্তিকৃত" : "Course Enrolled"}
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="px-4 py-3.5">
                                  <span className="text-[11px] font-medium text-slate-500 block">
                                    {lead.source}
                                  </span>
                                  <span className="font-semibold text-slate-800 mt-0.5 block">
                                    {lead.interest}
                                  </span>
                                </td>
                                <td className="px-4 py-3.5">
                                  <p className="font-medium text-slate-800">{lead.education}</p>
                                  <span className="text-[11px] font-semibold text-emerald-700">
                                    {lead.japaneseProficiency}
                                  </span>
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
                                      updateCrmLeadStatus(lead.id, e.target.value as LeadStatus);
                                      showToast(`${lead.name} — ${e.target.value}`);
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
                                  <div className="inline-flex items-center justify-end gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => setSelectedLeadForProfile(lead)}
                                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                                    >
                                      <UserCheck className="h-3.5 w-3.5 text-[#b91c1c]" />
                                      <span>{language === "bn" ? "প্রোফাইল" : "Profile"}</span>
                                    </button>
                                    <a
                                      href={waLink}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition"
                                    >
                                      <Send className="h-3 w-3" />
                                      <span>WA</span>
                                    </a>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                          {filteredLeads.length === 0 && (
                            <tr>
                              <td colSpan={6} className="py-12 text-center">
                                <p className="text-sm font-semibold text-slate-600">
                                  {language === "bn"
                                    ? "এখনো কোনো CRM লিড যুক্ত করা হয়নি"
                                    : "No CRM leads recorded yet"}
                                </p>
                                <button
                                  type="button"
                                  onClick={() => setActiveModal("ADD_LEAD")}
                                  className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-[#b91c1c] px-4 py-2 text-xs font-semibold text-white hover:bg-red-800 transition"
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                  <span>{t.crm.quickAddBtn}</span>
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
                              {applicantsInStage.map((app) => (
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
                                  <p className="text-[11px] text-slate-500">{app.targetSchool}</p>
                                  <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-slate-100">
                                    <span className="text-[10px] text-slate-400 truncate max-w-[110px]">
                                      {app.intakeSession}
                                    </span>
                                    {col.stage < 10 && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          updateVisaStage(app.id, (col.stage + 1) as VisaStage);
                                          showToast(`${app.name} → Step ${col.stage + 1}`);
                                        }}
                                        className="inline-flex items-center gap-0.5 rounded-lg bg-slate-900 px-2 py-1 text-[10px] font-semibold text-white hover:bg-emerald-700 transition"
                                      >
                                        <span>{t.visa.nextStageBtn}</span>
                                        <ChevronRight className="h-3 w-3" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
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
                        {store.lmsBridges.length} {language === "bn" ? "জন শিক্ষার্থী" : "students"}
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
                            const msg = encodeURIComponent(
                              `Congratulations ${lms.studentName}!\nYour KNLTC Course ID: ${lms.enrollmentNo}.\nPortal: https://npw.bd/knltc\nUsername: ${lms.portalUsername}\nPassword: ${lms.portalPasswordMasked}`,
                            );
                            const waUrl = `https://wa.me/${lms.phone.replace(/[^0-9]/g, "")}?text=${msg}`;

                            return (
                              <tr key={lms.id} className="hover:bg-slate-50/70">
                                <td className="px-4 py-3.5">
                                  <p className="font-bold text-slate-900">{lms.studentName}</p>
                                  <p className="text-[11px] font-mono text-slate-400">{lms.phone}</p>
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
                                    ৳{lms.netKnlTcMarginBdt.toLocaleString()}
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
                                {language === "bn"
                                  ? "কোনো LMS অ্যাকাউন্ট ইস্যু করা হয়নি।"
                                  : "No LMS accounts issued yet."}
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
                          {language === "ja"
                            ? "+ 提携日本語学校を追加"
                            : language === "en"
                              ? "+ Add Partner School"
                              : "+ জাপানি পার্টনার স্কুল যোগ করুন"}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => openB2bAgentModal()}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#b91c1c] px-4 py-2.5 text-xs font-semibold text-white hover:bg-red-800 transition shadow-2xs"
                      >
                        <Plus className="h-4 w-4" />
                        <span>
                          {language === "ja"
                            ? "+ B2Bエージェントを追加"
                            : language === "en"
                              ? "+ Add B2B Agent"
                              : "+ নতুন বিটুবি এজেন্ট যোগ করুন"}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Partner Japanese Schools Section */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-900">
                        {language === "ja"
                          ? "提携日本語学校・教育機関"
                          : language === "en"
                            ? "Partner Japanese Language Schools & Academies"
                            : "জাপানি পার্টনার ভাষা স্কুল ও একাডেমি তালিকা"}
                      </h3>
                      <span className="text-xs text-slate-400 tabular-nums">
                        {store.partnerSchools.length}{" "}
                        {language === "bn" ? "টি স্কুল" : "schools"}
                      </span>
                    </div>

                    {store.partnerSchools.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {store.partnerSchools.map((sch) => (
                          <div
                            key={sch.id}
                            className="hover-spotlight rounded-2xl border border-slate-200/80 bg-white p-5"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-[11px] font-semibold text-[#b91c1c]">
                                    {sch.location}
                                  </span>
                                  <span className="text-slate-300">•</span>
                                  <span className="text-[11px] font-medium text-emerald-700">
                                    {sch.status === "ACTIVE_PARTNER" ? "Active Partner" : "In Review"}
                                  </span>
                                </div>
                                <h4 className="text-base font-bold text-slate-900 mt-1">
                                  {sch.name}
                                </h4>
                                {sch.japaneseName && (
                                  <p className="text-xs text-slate-400">{sch.japaneseName}</p>
                                )}
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => openPartnerSchoolModal(sch)}
                                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                                  title="Edit School"
                                >
                                  <Edit3 className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    deletePartnerSchool(sch.id);
                                    setStore({ ...getCmsStore() });
                                    showToast(
                                      language === "bn"
                                        ? `${sch.name} মুছে ফেলা হয়েছে`
                                        : `${sch.name} removed`,
                                    );
                                  }}
                                  className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-[#b91c1c] transition"
                                  title="Delete School"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>

                            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-slate-100 pt-3.5 text-xs">
                              <div>
                                <span className="text-slate-400 block text-[11px]">
                                  {t.b2b.contactPerson}
                                </span>
                                <p className="font-semibold text-slate-800 mt-0.5 truncate">
                                  {sch.contactPerson || "N/A"}
                                </p>
                              </div>
                              <div>
                                <span className="text-slate-400 block text-[11px]">
                                  {t.b2b.commissionRate}
                                </span>
                                <p className="font-semibold text-slate-900 mt-0.5 tabular-nums">
                                  ¥{sch.commissionPerStudentYen.toLocaleString()}
                                </p>
                              </div>
                              <div>
                                <span className="text-slate-400 block text-[11px]">
                                  {t.b2b.activeStudents}
                                </span>
                                <p className="font-bold text-slate-900 mt-0.5 tabular-nums">
                                  {sch.activeStudentsCount} {t.b2b.studentsSuffix}
                                </p>
                              </div>
                              <div>
                                <span className="text-slate-400 block text-[11px]">
                                  {t.b2b.totalEarned}
                                </span>
                                <p className="font-bold text-emerald-700 mt-0.5 tabular-nums">
                                  ¥{sch.totalCommissionReceivedYen.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center">
                        <Building2 className="h-7 w-7 text-slate-300 mx-auto mb-2" />
                        <p className="text-sm font-semibold text-slate-700">
                          {language === "bn"
                            ? "এখনো কোনো জাপানি পার্টনার স্কুল যোগ করা হয়নি"
                            : "No Japanese partner schools added yet"}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          {language === "bn"
                            ? "আপনার চুক্তিবদ্ধ জাপানি ভাষা স্কুল ও কমিশনের তথ্য যোগ করুন।"
                            : "Add your partnered Japanese schools to track students and yen commissions."}
                        </p>
                        <button
                          type="button"
                          onClick={() => openPartnerSchoolModal()}
                          className="mt-3 inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>
                            {language === "bn"
                              ? "প্রথম পার্টনার স্কুল যোগ করুন"
                              : "Add First Partner School"}
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
                          {language === "bn"
                            ? "আপনার নিজস্ব বিটুবি এজেন্ট, সাব-এজেন্ট ও অ্যাম্বাসেডরদের হিসাব"
                            : "Manage your B2B agencies, sub-agents, and referral commissions"}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => openB2bAgentModal()}
                        className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>{language === "bn" ? "এজেন্ট যোগ করুন" : "Add Agent"}</span>
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
                              {language === "bn" ? "অ্যাকশন" : "Actions"}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {store.b2bAgents.map((agent) => (
                            <tr key={agent.id} className="hover:bg-slate-50/70 transition-colors">
                              <td className="px-4 py-3.5">
                                <p className="font-bold text-slate-900">{agent.organizationName}</p>
                                <p className="text-slate-400 text-[11px]">
                                  {agent.contactPerson} • <span className="font-mono">{agent.phone}</span>
                                </p>
                              </td>
                              <td className="px-4 py-3.5">
                                <span className="text-[11px] font-medium text-slate-700 block">
                                  {agent.agentType}
                                </span>
                                <span className="text-[11px] text-slate-400">{agent.city}</span>
                              </td>
                              <td className="px-4 py-3.5 font-semibold text-slate-800 tabular-nums">
                                {agent.referredStudentsCount} {t.b2b.studentsSuffix}
                              </td>
                              <td className="px-4 py-3.5 font-bold text-emerald-700 tabular-nums">
                                {agent.successfulVisasCount} {t.b2b.studentsSuffix}
                              </td>
                              <td className="px-4 py-3.5 font-semibold text-slate-900 tabular-nums">
                                ৳{agent.agreedCommissionBdt.toLocaleString()}
                              </td>
                              <td className="px-4 py-3.5 tabular-nums">
                                <span className="text-emerald-700 font-semibold block">
                                  {t.b2b.paidPrefix} ৳{agent.paidCommissionBdt.toLocaleString()}
                                </span>
                                <span className="text-amber-600 text-[11px] font-medium block">
                                  {t.b2b.pendingPrefix} ৳{agent.pendingCommissionBdt.toLocaleString()}
                                </span>
                              </td>
                              <td className="px-4 py-3.5 text-right">
                                <div className="inline-flex items-center justify-end gap-1">
                                  <button
                                    type="button"
                                    onClick={() => openB2bAgentModal(agent)}
                                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                                    title="Edit Agent"
                                  >
                                    <Edit3 className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      deleteB2bAgent(agent.id);
                                      setStore({ ...getCmsStore() });
                                      showToast(
                                        language === "bn"
                                          ? `${agent.organizationName} মুছে ফেলা হয়েছে`
                                          : `${agent.organizationName} removed`,
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
                          ))}
                          {store.b2bAgents.length === 0 && (
                            <tr>
                              <td colSpan={7} className="py-12 text-center">
                                <p className="text-sm font-semibold text-slate-700">
                                  {language === "bn"
                                    ? "কোনো বিটুবি এজেন্ট বা সাব-এজেন্টের তথ্য নেই"
                                    : "No B2B agents or sub-agents added yet"}
                                </p>
                                <p className="text-xs text-slate-400 mt-1">
                                  {language === "bn"
                                    ? "আপনার প্রতিষ্ঠানের বিটুবি এজেন্ট ও কমিশন হিসাব রাখতে নতুন এজেন্ট যুক্ত করুন।"
                                    : "Click below to add your B2B partner agencies and commission details."}
                                </p>
                                <button
                                  type="button"
                                  onClick={() => openB2bAgentModal()}
                                  className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-[#b91c1c] px-4 py-2 text-xs font-semibold text-white hover:bg-red-800 transition"
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                  <span>
                                    {language === "bn"
                                      ? "নতুন বিটুবি এজেন্ট যোগ করুন"
                                      : "Add New B2B Agent"}
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
                  MODULE 6: FINANCE, PACKAGE BILLING & INVESTOR PORTAL
                  ========================================================================= */}
              {activeTab === "finance" && (
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
                      <div className=" md:text-right">
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
                  </div>

                  {/* Transactions Table */}
                  <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">{t.finance.billingTitle}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">{t.finance.billingSubtitle}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveModal("ADD_PAYMENT")}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>{t.finance.recordPaymentBtn}</span>
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50/70 border-b border-slate-100 font-semibold text-slate-500">
                          <tr>
                            <th className="px-4 py-3">{t.finance.colReceiptDate}</th>
                            <th className="px-4 py-3">{t.finance.colStudentDesc}</th>
                            <th className="px-4 py-3">{t.finance.colPackageType}</th>
                            <th className="px-4 py-3">{t.finance.colMethodTrx}</th>
                            <th className="px-4 py-3">{t.finance.colBranch}</th>
                            <th className="px-4 py-3 text-right">{t.finance.colAmount}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {store.transactions.map((tx) => (
                            <tr key={tx.id} className="hover:bg-slate-50/70">
                              <td className="px-4 py-3.5 font-mono text-slate-800">
                                <span className="font-semibold">{tx.receiptNo}</span>
                                <p className="text-[10px] text-slate-400 font-sans">{tx.date}</p>
                              </td>
                              <td className="px-4 py-3.5 font-semibold text-slate-900">{tx.studentName}</td>
                              <td className="px-4 py-3.5 text-slate-600">{tx.type}</td>
                              <td className="px-4 py-3.5">
                                <span className="font-medium text-slate-800">{tx.paymentMethod}</span>
                                <p className="font-mono text-[10px] text-slate-400">{tx.referenceOrTrx}</p>
                              </td>
                              <td className="px-4 py-3.5 text-slate-500">
                                {tx.branch === "DHK-HQ" ? t.dhakaHq : t.khulnaBranch}
                              </td>
                              <td className="px-4 py-3.5 text-right font-bold text-slate-900 tabular-nums">
                                ৳{tx.amountBdt.toLocaleString()}
                              </td>
                            </tr>
                          ))}
                          {store.transactions.length === 0 && (
                            <tr>
                              <td colSpan={6} className="py-10 text-center text-slate-400">
                                {language === "bn"
                                  ? "কোনো পেমেন্ট ট্রানজেকশন রেকর্ড করা হয়নি।"
                                  : "No payment transactions recorded yet."}
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
                  MODULE 7: HR & TEAM MEMBER PAYROLL (With Full Add / Edit / Delete)
                  ========================================================================= */}
              {activeTab === "hr" && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                        {t.hr.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{t.hr.subtitle}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => openStaffModal()}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#b91c1c] px-4 py-2.5 text-xs font-semibold text-white hover:bg-red-800 transition shadow-2xs shrink-0"
                    >
                      <UserPlus className="h-4 w-4" />
                      <span>
                        {language === "ja"
                          ? "+ 新規チームメンバー追加"
                          : language === "en"
                            ? "+ Add Team Member"
                            : "+ নতুন টিম মেম্বার যোগ করুন"}
                      </span>
                    </button>
                  </div>

                  <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50/70 border-b border-slate-100 font-semibold text-slate-500">
                          <tr>
                            <th className="px-4 py-3">{t.hr.colNameRole}</th>
                            <th className="px-4 py-3">{t.hr.colLocation}</th>
                            <th className="px-4 py-3">{t.hr.colCallsTarget}</th>
                            <th className="px-4 py-3">{t.hr.colAdmissions}</th>
                            <th className="px-4 py-3">{t.hr.colBaseSalary}</th>
                            <th className="px-4 py-3">{t.hr.colBonus}</th>
                            <th className="px-4 py-3 text-right">{t.hr.colTotalPay}</th>
                            <th className="px-4 py-3 text-right">
                              {language === "bn" ? "অ্যাকশন" : "Actions"}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {store.staffList.map((stf) => {
                            const totalPay = stf.monthlyBaseSalaryBdt + stf.performanceBonusBdt;
                            return (
                              <tr key={stf.id} className="hover:bg-slate-50/70 transition-colors">
                                <td className="px-4 py-3.5">
                                  <p className="font-bold text-slate-900">{stf.name}</p>
                                  <span className="text-[11px] text-slate-400">
                                    {stf.role} {stf.phone ? `• ${stf.phone}` : ""}
                                  </span>
                                </td>
                                <td className="px-4 py-3.5 text-slate-600">{stf.location}</td>
                                <td className="px-4 py-3.5 tabular-nums">
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold text-slate-800">
                                      {stf.callsCompleted} / {stf.callsTargetMonthly}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        updateStaffMember(stf.id, {
                                          callsCompleted: stf.callsCompleted + 10,
                                        });
                                        setStore({ ...getCmsStore() });
                                        showToast(`${stf.name}: +10 calls recorded`);
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
                                          (stf.callsCompleted / (stf.callsTargetMonthly || 1)) * 100,
                                        )}%`,
                                      }}
                                    />
                                  </div>
                                </td>
                                <td className="px-4 py-3.5 tabular-nums">
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-emerald-700">
                                      {stf.admissionsAchieved}
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
                                          language === "bn"
                                            ? `${stf.name} মুছে ফেলা হয়েছে`
                                            : `${stf.name} removed`,
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
                                  {language === "bn"
                                    ? "এখনো কোনো টিম মেম্বার বা স্টাফ যোগ করা হয়নি"
                                    : "No team members or staff added yet"}
                                </p>
                                <p className="text-xs text-slate-400 mt-1">
                                  {language === "bn"
                                    ? "টেলি-কাউন্সেলর, সেন্সি বা ব্রাঞ্চ কর্মকর্তাদের পে-রোল ও টার্গেট ট্র্যাক করতে যুক্ত করুন।"
                                    : "Add your counselors, teachers, and branch team members to manage payroll and KPIs."}
                                </p>
                                <button
                                  type="button"
                                  onClick={() => openStaffModal()}
                                  className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-[#b91c1c] px-4 py-2 text-xs font-semibold text-white hover:bg-red-800 transition"
                                >
                                  <UserPlus className="h-3.5 w-3.5" />
                                  <span>
                                    {language === "bn"
                                      ? "প্রথম টিম মেম্বার যোগ করুন"
                                      : "Add First Team Member"}
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
                          defaultValue={cms.topAnnouncementBar.text[language] || cms.topAnnouncementBar.text.bn}
                          onChange={(e) => {
                            cms.topAnnouncementBar.text[language] = e.target.value;
                            setStore({ ...store });
                          }}
                          className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 font-medium"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-600">{t.cms.popupLabel}</label>
                        <input
                          type="text"
                          defaultValue={cms.popupBanner.headline[language] || cms.popupBanner.headline.bn}
                          onChange={(e) => {
                            cms.popupBanner.headline[language] = e.target.value;
                            setStore({ ...store });
                          }}
                          className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 font-medium"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-600">{t.cms.heroLabel}</label>
                        <input
                          type="text"
                          defaultValue={cms.heroSection.headline[language] || cms.heroSection.headline.bn}
                          onChange={(e) => {
                            cms.heroSection.headline[language] = e.target.value;
                            setStore({ ...store });
                          }}
                          className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 font-medium"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-600">{t.cms.pixelLabel}</label>
                        <input
                          type="text"
                          defaultValue={cms.metaPixelId}
                          onChange={(e) => {
                            cms.metaPixelId = e.target.value;
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
                            defaultValue={cms.languageCoursePage.n5PriceBdt}
                            onChange={(e) => {
                              cms.languageCoursePage.n5PriceBdt = Number(e.target.value);
                              setStore({ ...store });
                            }}
                            className="mt-1 w-full rounded-xl border border-slate-200 p-2 font-bold tabular-nums"
                          />
                        </div>
                        <div>
                          <label className="font-semibold text-slate-600">N4 (BDT)</label>
                          <input
                            type="number"
                            defaultValue={cms.languageCoursePage.n4PriceBdt}
                            onChange={(e) => {
                              cms.languageCoursePage.n4PriceBdt = Number(e.target.value);
                              setStore({ ...store });
                            }}
                            className="mt-1 w-full rounded-xl border border-slate-200 p-2 font-bold tabular-nums"
                          />
                        </div>
                        <div>
                          <label className="font-semibold text-slate-600">Combo (BDT)</label>
                          <input
                            type="number"
                            defaultValue={cms.languageCoursePage.comboPriceBdt}
                            onChange={(e) => {
                              cms.languageCoursePage.comboPriceBdt = Number(e.target.value);
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
                            defaultValue={cms.studyInJapanPage.regularPackageFeeBdt}
                            onChange={(e) => {
                              cms.studyInJapanPage.regularPackageFeeBdt = Number(e.target.value);
                              setStore({ ...store });
                            }}
                            className="mt-1 w-full rounded-xl border border-slate-200 p-2 font-bold tabular-nums"
                          />
                        </div>
                        <div>
                          <label className="font-semibold text-slate-600">{t.cms.premiumTitle}</label>
                          <input
                            type="number"
                            defaultValue={cms.studyInJapanPage.premiumPackageFeeBdt}
                            onChange={(e) => {
                              cms.studyInJapanPage.premiumPackageFeeBdt = Number(e.target.value);
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
                      {cms.jobCirculars.map((circ) => (
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
                              {circ.title[language] || circ.title.bn || circ.title.en}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {circ.salaryYen} ({circ.salaryBdtEquivalent})
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              circ.isPublished = !circ.isPublished;
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
                      ))}
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
                          {language === "ja"
                            ? "ブックストア・注文・ブログ管理"
                            : language === "en"
                              ? "Bookstore, Orders, Blog & Media"
                              : "বুক স্টোর, অর্ডার, ব্লগ ও মিডিয়া প্যানেল"}
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {language === "bn"
                            ? "বই যোগ/এডিট, অর্ডার ট্র্যাকিং, ব্লগ পোস্ট এবং ক্লাউড স্টোরেজ পরিচালনা করুন।"
                            : "Manage bookstore inventory, customer orders, blog articles, and media."}
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
                          label: language === "bn" ? "সামগ্রিক চিত্র" : "Overview",
                          icon: Sparkles,
                        },
                        {
                          id: "products",
                          label: language === "bn" ? "বই ও পণ্য" : "Products",
                          icon: BookOpen,
                          count: adminBundle.products.length,
                        },
                        {
                          id: "orders",
                          label: language === "bn" ? "বুক অর্ডার" : "Orders",
                          icon: ShoppingBag,
                          count: adminBundle.orders.length,
                        },
                        {
                          id: "blog",
                          label: language === "bn" ? "ব্লগ পোস্ট" : "Blog",
                          icon: FileText,
                          count: adminBundle.posts.length,
                        },
                        {
                          id: "categories",
                          label: language === "bn" ? "ক্যাটেগরি" : "Categories",
                          icon: Layers,
                          count: adminBundle.categories.length,
                        },
                        {
                          id: "reviews",
                          label: language === "bn" ? "রিভিউ" : "Reviews",
                          icon: Award,
                          count: adminBundle.reviews.length,
                        },
                        {
                          id: "uploads",
                          label: language === "bn" ? "ক্লাউড ফাইল" : "Cloud Media",
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
                          {language === "bn" ? "পেন্ডিং বুক অর্ডার" : "Pending Orders"}
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
                          {language === "bn" ? "পেন্ডিং রিভিউ" : "Pending Reviews"}
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
                          {language === "bn" ? "মোট বইয়ের সংখ্যা" : "Total Books"}
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
                          {language === "bn" ? "প্রকাশিত ব্লগ" : "Published Articles"}
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
                    }) || store.visaApplicants[0]
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
                    }) || store.lmsBridges[0]
                  }
                  userEmail={currentUser?.email || "student@knltc.com"}
                  userName={currentUser?.name || "রাকিবুল ইসলাম"}
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
              lead={selectedLeadForProfile}
              onClose={() => setSelectedLeadForProfile(null)}
              onSaved={(msg) => {
                setStore({ ...getCmsStore() });
                showToast(msg);
              }}
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
                        language === "bn"
                          ? `${b2bForm.organizationName} আপডেট করা হয়েছে`
                          : `${b2bForm.organizationName} updated`,
                      );
                    } else {
                      addB2bAgent(b2bForm);
                      showToast(
                        language === "bn"
                          ? `নতুন বিটুবি এজেন্ট (${b2bForm.organizationName}) যোগ করা হয়েছে`
                          : `B2B Agent (${b2bForm.organizationName}) added`,
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
                        ? language === "bn"
                          ? "বিটুবি এজেন্ট তথ্য সম্পাদনা"
                          : "Edit B2B Agent"
                        : language === "bn"
                          ? "নতুন বিটুবি এজেন্ট / সাব-এজেন্ট যোগ করুন"
                          : "Add B2B Agent / Sub-Agent"}
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
                        {language === "bn" ? "প্রতিষ্ঠান বা এজেন্সির নাম *" : "Organization / Agency Name *"}
                      </label>
                      <input
                        type="text"
                        required
                        value={b2bForm.organizationName}
                        onChange={(e) => setB2bForm({ ...b2bForm, organizationName: e.target.value })}
                        placeholder={language === "bn" ? "এজেন্সি বা পার্টনারের নাম লিখুন" : "Enter agency name"}
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-medium"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700">
                        {language === "bn" ? "এজেন্টের ধরন" : "Agent Type"}
                      </label>
                      <select
                        value={b2bForm.agentType}
                        onChange={(e) =>
                          setB2bForm({ ...b2bForm, agentType: e.target.value as B2bAgent["agentType"] })
                        }
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium"
                      >
                        <option value="INSTITUTIONAL">Institutional Partner</option>
                        <option value="LOCAL_SUB_AGENT">Local Sub-Agent</option>
                        <option value="CAMPUS_AMBASSADOR">Campus Ambassador</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700">
                        {language === "bn" ? "শহর / জেলা" : "City"}
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
                        {language === "bn" ? "যোগাযোগকারীর নাম *" : "Contact Person *"}
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
                        {language === "bn" ? "ফোন নম্বর *" : "Phone Number *"}
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
                        {language === "bn" ? "রেফার্ড শিক্ষার্থী সংখ্যা" : "Referred Students"}
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
                        {language === "bn" ? "সফল ভিসা সংখ্যা" : "Successful Visas"}
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
                        {language === "bn" ? "চুক্তিভিত্তিক কমিশন (BDT)" : "Agreed Commission (BDT)"}
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
                        {language === "bn" ? "পরিশোধিত কমিশন (BDT)" : "Paid Commission (BDT)"}
                      </label>
                      <input
                        type="number"
                        value={b2bForm.paidCommissionBdt}
                        onChange={(e) =>
                          setB2bForm({ ...b2bForm, paidCommissionBdt: Number(e.target.value) })
                        }
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-semibold tabular-nums"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="font-semibold text-slate-700">
                        {language === "bn" ? "বকেয়া কমিশন (BDT)" : "Pending Commission (BDT)"}
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

                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      {language === "bn" ? "বাতিল" : "Cancel"}
                    </button>
                    <button
                      type="submit"
                      className="rounded-xl bg-[#b91c1c] px-5 py-2 text-xs font-semibold text-white hover:bg-red-800 transition"
                    >
                      {language === "bn" ? "সেভ করুন" : "Save Agent"}
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
                      showToast(`${schoolForm.name} updated`);
                    } else {
                      addPartnerSchool(schoolForm);
                      showToast(`${schoolForm.name} added`);
                    }
                    setStore({ ...getCmsStore() });
                    setActiveModal(null);
                  }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-base font-bold text-slate-900">
                      {editingPartnerSchool
                        ? language === "bn"
                          ? "পার্টনার স্কুল সম্পাদনা"
                          : "Edit Partner School"
                        : language === "bn"
                          ? "নতুন জাপানি পার্টনার স্কুল যোগ করুন"
                          : "Add Japanese Partner School"}
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
                        {language === "bn" ? "স্কুলের নাম (English / বাংলা) *" : "School Name *"}
                      </label>
                      <input
                        type="text"
                        required
                        value={schoolForm.name}
                        onChange={(e) => setSchoolForm({ ...schoolForm, name: e.target.value })}
                        placeholder="e.g. Tokyo International Language Academy"
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-medium"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700">
                        {language === "bn" ? "জাপানি নাম (ঐচ্ছিক)" : "Japanese Name"}
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
                        {language === "bn" ? "জাপানে অবস্থান (শহর) *" : "Location in Japan *"}
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
                        {language === "bn" ? "দায়িত্বশীল ব্যক্তি / প্রিন্সিপাল" : "Contact Person"}
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
                        {language === "bn" ? "ইমেইল" : "Email"}
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
                        {language === "bn" ? "স্টুডেন্ট পিছু কমিশন (Yen)" : "Commission / Student (Yen)"}
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
                        {language === "bn" ? "চলমান শিক্ষার্থী সংখ্যা" : "Active Students"}
                      </label>
                      <input
                        type="number"
                        value={schoolForm.activeStudentsCount}
                        onChange={(e) =>
                          setSchoolForm({
                            ...schoolForm,
                            activeStudentsCount: Number(e.target.value),
                          })
                        }
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-semibold tabular-nums"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="font-semibold text-slate-700">
                        {language === "bn" ? "মোট প্রাপ্ত কমিশন (Yen)" : "Total Earned Commission (Yen)"}
                      </label>
                      <input
                        type="number"
                        value={schoolForm.totalCommissionReceivedYen}
                        onChange={(e) =>
                          setSchoolForm({
                            ...schoolForm,
                            totalCommissionReceivedYen: Number(e.target.value),
                          })
                        }
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-semibold tabular-nums"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      {language === "bn" ? "বাতিল" : "Cancel"}
                    </button>
                    <button
                      type="submit"
                      className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition"
                    >
                      {language === "bn" ? "সেভ করুন" : "Save Partner School"}
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
                        language === "bn"
                          ? `${staffForm.name}-এর তথ্য আপডেট হয়েছে`
                          : `${staffForm.name} updated`,
                      );
                    } else {
                      addStaffMember(staffForm);
                      showToast(
                        language === "bn"
                          ? `নতুন টিম মেম্বার (${staffForm.name}) যুক্ত করা হয়েছে`
                          : `Team member (${staffForm.name}) added`,
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
                        ? language === "bn"
                          ? "টিম মেম্বার তথ্য সম্পাদনা"
                          : "Edit Team Member"
                        : language === "bn"
                          ? "নতুন টিম মেম্বার / স্টাফ যোগ করুন"
                          : "Add New Team Member"}
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
                        {language === "bn" ? "কর্মকর্তা / স্টাফের পূর্ণ নাম *" : "Full Name *"}
                      </label>
                      <input
                        type="text"
                        required
                        value={staffForm.name}
                        onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                        placeholder={language === "bn" ? "যেমন: সুমাইয়া সুলতানা" : "e.g. Sumaiya Sultana"}
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-medium"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700">
                        {language === "bn" ? "পদবী / রোল" : "Role"}
                      </label>
                      <select
                        value={staffForm.role}
                        onChange={(e) =>
                          setStaffForm({ ...staffForm, role: e.target.value as StaffMember["role"] })
                        }
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium"
                      >
                        <option value="TELE_COUNSELOR">Tele-Counselor</option>
                        <option value="COUNSELOR">Office Counselor</option>
                        <option value="SENIOR_SENSEI">Japanese Sensei / Instructor</option>
                        <option value="BRANCH_MANAGER">Branch Manager</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700">
                        {language === "bn" ? "কর্মস্থল / লোকেশন" : "Work Location"}
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
                        <option value="DHAKA_OFFICE">Dhaka Office (HQ)</option>
                        <option value="KHULNA_OFFICE">Khulna Branch Office</option>
                        <option value="REMOTE">Remote / Home Office</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700">
                        {language === "bn" ? "ফোন নম্বর" : "Phone Number"}
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
                        {language === "bn" ? "ইমেইল" : "Email"}
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
                        {language === "bn" ? "মাসিক মূল বেতন (BDT)" : "Monthly Base Salary (BDT)"}
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
                        {language === "bn" ? "পারফরম্যান্স বোনাস (BDT)" : "Performance Bonus (BDT)"}
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

                    <div>
                      <label className="font-semibold text-slate-700">
                        {language === "bn" ? "মাসিক কল টার্গেট" : "Monthly Call Target"}
                      </label>
                      <input
                        type="number"
                        value={staffForm.callsTargetMonthly}
                        onChange={(e) =>
                          setStaffForm({ ...staffForm, callsTargetMonthly: Number(e.target.value) })
                        }
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-semibold tabular-nums"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700">
                        {language === "bn" ? "সম্পন্ন কল সংখ্যা" : "Calls Completed"}
                      </label>
                      <input
                        type="number"
                        value={staffForm.callsCompleted}
                        onChange={(e) =>
                          setStaffForm({ ...staffForm, callsCompleted: Number(e.target.value) })
                        }
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-semibold tabular-nums"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      {language === "bn" ? "বাতিল" : "Cancel"}
                    </button>
                    <button
                      type="submit"
                      className="rounded-xl bg-[#b91c1c] px-5 py-2 text-xs font-semibold text-white hover:bg-red-800 transition"
                    >
                      {language === "bn" ? "সেভ করুন" : "Save Team Member"}
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
                    addCrmLead({
                      name: leadForm.name.trim(),
                      phone: leadForm.phone.trim(),
                      whatsapp: leadForm.phone.trim().startsWith("+88")
                        ? leadForm.phone.trim()
                        : `+88${leadForm.phone.trim()}`,
                      city: leadForm.city,
                      source: leadForm.source,
                      interest: leadForm.interest,
                      status: "NEW",
                      education: leadForm.education,
                      japaneseProficiency: leadForm.japaneseProficiency,
                      studyGapYears: leadForm.studyGapYears,
                      assignedTo: currentUser?.name || "শেখ বাসেত",
                      branch: activeBranch === "KHULNA-01" ? "KHULNA-01" : "DHK-HQ",
                      notes: leadForm.notes || "New lead inquiry added.",
                      followUpDate: new Date().toISOString().slice(0, 10),
                    });
                    setStore({ ...getCmsStore() });
                    setLeadForm({ ...leadForm, name: "", phone: "", notes: "" });
                    setActiveModal(null);
                    showToast(t.toastSuccess);
                  }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-base font-bold text-slate-900">
                      {language === "bn" ? "নতুন প্রার্থী / CRM লিড যোগ করুন" : "Add New CRM Lead"}
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
                        {language === "bn" ? "প্রার্থীর নাম *" : "Candidate Name *"}
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
                        {language === "bn" ? "ফোন / WhatsApp *" : "Phone / WhatsApp *"}
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
                        {language === "bn" ? "শহর" : "City"}
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
                        {language === "bn" ? "আগ্রহের প্রোগ্রাম" : "Program Interest"}
                      </label>
                      <select
                        value={leadForm.interest}
                        onChange={(e) =>
                          setLeadForm({ ...leadForm, interest: e.target.value as ServiceInterest })
                        }
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium"
                      >
                        <option value="STUDENT_VISA_REGULAR">Student Visa (Regular)</option>
                        <option value="STUDENT_VISA_PREMIUM">Student Visa (Premium)</option>
                        <option value="SSW_CONSTRUCTION_SPECIAL">SSW Construction</option>
                        <option value="SSW_CAREGIVER">SSW Caregiver</option>
                        <option value="JAPANESE_N5">Japanese N5 Course</option>
                        <option value="JAPANESE_N4">Japanese N4 Course</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">
                        {language === "bn" ? "শিক্ষাগত যোগ্যতা" : "Education"}
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
                        {language === "bn" ? "জাপানি ভাষার স্তর" : "Japanese Level"}
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
                        <option value="NONE">Beginner / None</option>
                        <option value="LEARNING_N5">Learning N5</option>
                        <option value="PASSED_N5">Passed N5</option>
                        <option value="PASSED_N4">Passed N4</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="font-semibold text-slate-700">
                        {language === "bn" ? "কাউন্সেলিং নোট" : "Notes"}
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
                      className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600"
                    >
                      {language === "bn" ? "বাতিল" : "Cancel"}
                    </button>
                    <button
                      type="submit"
                      className="rounded-xl bg-[#b91c1c] px-5 py-2 text-xs font-semibold text-white hover:bg-red-800 transition"
                    >
                      {language === "bn" ? "লিড সেভ করুন" : "Save Lead"}
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
                    <div>
                      <label className="font-semibold text-slate-700">Student Name *</label>
                      <input
                        type="text"
                        required
                        value={lmsForm.studentName}
                        onChange={(e) => setLmsForm({ ...lmsForm, studentName: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-medium"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Phone *</label>
                      <input
                        type="text"
                        required
                        value={lmsForm.phone}
                        onChange={(e) => setLmsForm({ ...lmsForm, phone: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-mono"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Course Level</label>
                      <select
                        value={lmsForm.courseLevel}
                        onChange={(e) =>
                          setLmsForm({ ...lmsForm, courseLevel: e.target.value as any })
                        }
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium"
                      >
                        <option value="N5">JLPT N5</option>
                        <option value="N4">JLPT N4</option>
                        <option value="IRODORI">Irodori Spoken</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Batch</label>
                      <input
                        type="text"
                        value={lmsForm.activeBatch}
                        onChange={(e) => setLmsForm({ ...lmsForm, activeBatch: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-medium"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition"
                    >
                      Issue Account
                    </button>
                  </div>
                </form>
              )}

              {/* 6. RECORD PAYMENT ENTRY MODAL */}
              {activeModal === "ADD_PAYMENT" && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!paymentForm.studentName.trim()) return;
                    addFinancialTransaction({
                      receiptNo: `RCP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
                      date: new Date().toISOString().slice(0, 10),
                      studentName: paymentForm.studentName.trim(),
                      type: paymentForm.type,
                      amountBdt: Number(paymentForm.amountBdt) || 0,
                      paymentMethod: paymentForm.paymentMethod,
                      referenceOrTrx:
                        paymentForm.referenceOrTrx.trim() || `TRX-${Date.now().toString().slice(-6)}`,
                      branch: activeBranch === "KHULNA-01" ? "KHULNA-01" : "DHK-HQ",
                      verifiedBy: currentUser?.name || "Sheikh Baset",
                      notes: paymentForm.notes,
                    });
                    setStore({ ...getCmsStore() });
                    setActiveModal(null);
                    showToast(t.toastSuccess);
                  }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-base font-bold text-slate-900">{t.finance.recordPaymentBtn}</h3>
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
                      <label className="font-semibold text-slate-700">Student Name / Description *</label>
                      <input
                        type="text"
                        required
                        value={paymentForm.studentName}
                        onChange={(e) =>
                          setPaymentForm({ ...paymentForm, studentName: e.target.value })
                        }
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-medium"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Payment Type</label>
                      <select
                        value={paymentForm.type}
                        onChange={(e) =>
                          setPaymentForm({ ...paymentForm, type: e.target.value as any })
                        }
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium"
                      >
                        <option value="COURSE_FEE">Course Fee</option>
                        <option value="REGULAR_SERVICE_CHARGE">Regular Visa Service Charge</option>
                        <option value="PREMIUM_PACKAGE_ADVANCE">Premium Package Installment</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Amount (BDT) *</label>
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
                      <label className="font-semibold text-slate-700">Method</label>
                      <select
                        value={paymentForm.paymentMethod}
                        onChange={(e) =>
                          setPaymentForm({ ...paymentForm, paymentMethod: e.target.value as any })
                        }
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium"
                      >
                        <option value="BKASH">bKash</option>
                        <option value="NAGAD">Nagad</option>
                        <option value="BANK_TRANSFER">Bank Transfer</option>
                        <option value="CASH_OFFICE">Cash at Office</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Trx ID / Reference</label>
                      <input
                        type="text"
                        value={paymentForm.referenceOrTrx}
                        onChange={(e) =>
                          setPaymentForm({ ...paymentForm, referenceOrTrx: e.target.value })
                        }
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition"
                    >
                      Save Payment
                    </button>
                  </div>
                </form>
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
                      <label className="font-semibold text-slate-700">Job Title *</label>
                      <input
                        type="text"
                        required
                        value={circularForm.title}
                        onChange={(e) => setCircularForm({ ...circularForm, title: e.target.value })}
                        placeholder="e.g. SSW Food Service Specialist (Tokyo)"
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-medium"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Category</label>
                      <select
                        value={circularForm.category}
                        onChange={(e) =>
                          setCircularForm({ ...circularForm, category: e.target.value as any })
                        }
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium"
                      >
                        <option value="SSW_CONSTRUCTION">SSW Construction</option>
                        <option value="SSW_CAREGIVER">SSW Caregiver</option>
                        <option value="SSW_AGRICULTURE">SSW Agriculture</option>
                        <option value="SSW_FOOD_SERVICE">SSW Food Service</option>
                        <option value="TITP_TECHNICAL">TITP Technical</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Location in Japan</label>
                      <input
                        type="text"
                        value={circularForm.locationJapan}
                        onChange={(e) =>
                          setCircularForm({ ...circularForm, locationJapan: e.target.value })
                        }
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-medium"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Salary (Yen)</label>
                      <input
                        type="text"
                        value={circularForm.salaryYen}
                        onChange={(e) =>
                          setCircularForm({ ...circularForm, salaryYen: e.target.value })
                        }
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-medium"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Salary (BDT)</label>
                      <input
                        type="text"
                        value={circularForm.salaryBdtEquivalent}
                        onChange={(e) =>
                          setCircularForm({ ...circularForm, salaryBdtEquivalent: e.target.value })
                        }
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-medium"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition"
                    >
                      Publish Circular
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
