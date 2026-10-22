"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Users,
  Briefcase,
  GraduationCap,
  FileCheck2,
  DollarSign,
  TrendingUp,
  Globe2,
  Globe,
  Building2,
  PhoneCall,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Clock,
  Send,
  PlusCircle,
  Eye,
  Settings,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Search,
  BookOpen,
  ShoppingBag,
  UserCheck,
  Wallet,
  ArrowUpRight,
  ExternalLink,
  RefreshCw,
  Sliders,
  BadgePercent,
  Calculator,
  Award,
  Phone,
  Bookmark,
  Layers,
  HelpCircle,
  FileText,
  MapPin,
  Save,
  Check,
  LogOut,
  Database,
  Lock,
  KeyRound,
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
  updateWebsiteCms,
  getSystemAccounts,
  type MasterKnlTcStore,
  type UserRole,
  type BranchCode,
  type DashboardTabId,
  type CrmLead,
  type VisaApplicant,
  type VisaStage,
  type LeadStatus,
  type ServiceInterest,
  type WebsiteCmsContent,
  type MinnaLesson,
  type JobCircular,
  type BookStoreProduct,
  type CustomerStoreOrder,
} from "@/lib/knltc-cms-store";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { languageOptions, type Language } from "@/lib/i18n";
import { getDashboardDictionary, DashboardDictionary } from "@/lib/dashboard-translations";
import ProductManager from "@/components/admin/ProductManager";
import BlogManager from "@/components/admin/BlogManager";
import OrderManager from "@/components/admin/OrderManager";
import ReviewManager from "@/components/admin/ReviewManager";
import CategoryManager from "@/components/admin/CategoryManager";
import CrmManager from "@/components/admin/CrmManager";
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
  const [storeSubTab, setStoreSubTab] = useState<
    "summary" | "products" | "orders" | "blog" | "categories" | "reviews" | "uploads"
  >("summary");
  const [adminBundle, setAdminBundle] = useState<{
    loaded: boolean;
    summary: AdminSummary | null;
    products: DbProduct[];
    posts: DbPost[];
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
  type DbPost = BlogPost;

  // Multi-language translation dictionary for the dashboard
  const t: DashboardDictionary = useMemo(() => getDashboardDictionary(language), [language]);

  // Notifications / feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

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

  // Synchronize state with store, load user session & handle storage events
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

    // 1. Verify and fetch active session
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

    // 2. Fetch live store & unified admin bundle from Supabase server
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
        ? "Supabaseデータベースと同期中..."
        : language === "en"
          ? "Syncing with Supabase database..."
          : "Supabase ডাটাবেজের সাথে সিঙ্ক হচ্ছে...",
    );
    try {
      const [live] = await Promise.all([fetchLiveStoreFromServer(), loadAdminBundle()]);
      if (live) setStore({ ...live });
      showToast(
        language === "ja"
          ? "データベース同期が完了しました！"
          : language === "en"
            ? "Database synced successfully!"
            : "ডাটাবেজ সিঙ্ক সফল হয়েছে!",
      );
    } catch {
      showToast(
        language === "ja"
          ? "同期エラー。ローカルキャッシュを使用しています。"
          : language === "en"
            ? "Sync error, using local cache."
            : "সিঙ্কে সমস্যা হয়েছে, লোকাল ক্যাশ ব্যবহার করা হচ্ছে।",
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

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    if (!store) return [];
    return store.crmLeads.filter((l) => {
      if (activeBranch === "ALL") return true;
      return l.branch === activeBranch;
    });
  }, [store, activeBranch]);

  // Filtered Visa Applicants
  const filteredVisaApplicants = useMemo(() => {
    if (!store) return [];
    return store.visaApplicants.filter((v) => {
      if (activeBranch === "ALL") return true;
      return v.branch === activeBranch;
    });
  }, [store, activeBranch]);

  // Role permissions check
  const isSuperAdmin = activeRole === "MAIN_ADMIN";
  const isBranchAdmin = activeRole === "BRANCH_ADMIN" || isSuperAdmin;
  const isTeleCounselor = activeRole === "TELE_COUNSELOR" || isSuperAdmin;
  const isTeacher = activeRole === "TEACHER" || isSuperAdmin;
  const isB2b = activeRole === "B2B_AGENT" || isSuperAdmin;
  const isInvestor = activeRole === "INVESTOR" || isSuperAdmin;
  const isStudent = activeRole === "STUDENT";

  if (!store) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fcfaf7] text-slate-600">
        <RefreshCw className="mr-2 h-6 w-6 animate-spin text-[#b91c1c]" />
        <span className="font-medium text-lg leading-relaxed">{t.loading}</span>
      </div>
    );
  }

  const cms = store.websiteCms[0];

  return (
    <div className="min-h-screen bg-[#fcfaf7] text-slate-900 font-sans leading-relaxed">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-white shadow-xl animate-fade-in border border-slate-700">
          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          <span className="text-sm font-semibold leading-relaxed">{toastMessage}</span>
        </div>
      )}

      {/* Top Banner: Managing Director & Executive Briefing */}
      <div className="bg-[#133e29] px-4 py-2.5 text-xs text-white sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-medium">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{t.topBanner}</span>
            <span className="hidden md:inline text-emerald-200">|</span>
            <span className="hidden md:inline text-emerald-200">{t.leadership}</span>
          </div>
          <div className="flex items-center gap-4 text-emerald-100">
            <span>{t.hotline}</span>
            <a
              href="https://npw.bd/knltc"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded bg-emerald-700 px-2.5 py-0.5 font-bold text-white hover:bg-emerald-600 transition"
            >
              {t.lmsBtn} <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Header with Role & Branch Controls */}
      <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur-md shadow-xs">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Brand Logo & Info */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#b91c1c] text-white font-black shadow-md">
                  KN
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-lg tracking-tight text-slate-900">KNLTC</span>
                    <span className="rounded-md bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-800">
                      ENTERPRISE OS
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-tight">Japan Gateway Master Control</p>
                </div>
              </Link>
            </div>

            {/* Controls: Branch Switcher, 7-Role Switcher, DB Sync, Language & Logout */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Branch Switcher */}
              <div className="flex items-center rounded-xl bg-stone-100 p-1 border border-stone-200">
                <span className="px-2 text-xs font-semibold text-slate-500">{t.branchLabel}</span>
                {(!currentUser || currentUser.role === "MAIN_ADMIN" || currentUser.branch === "ALL") ? (
                  <>
                    <button
                      onClick={() => setActiveBranch("ALL")}
                      className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                        activeBranch === "ALL"
                          ? "bg-white text-slate-900 shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {t.allBranches}
                    </button>
                    <button
                      onClick={() => setActiveBranch("DHK-HQ")}
                      className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                        activeBranch === "DHK-HQ"
                          ? "bg-white text-[#b91c1c] shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {t.dhakaHq}
                    </button>
                    <button
                      onClick={() => setActiveBranch("KHULNA-01")}
                      className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                        activeBranch === "KHULNA-01"
                          ? "bg-white text-emerald-700 shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {t.khulnaBranch}
                    </button>
                  </>
                ) : (
                  <span className="rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-slate-900 shadow-xs">
                    {activeBranch === "DHK-HQ" ? t.dhakaHq : t.khulnaBranch}
                  </span>
                )}
              </div>

              {/* Logged-in User Identity & Admin Access Manager Quick Button */}
              <div className="flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-bold text-slate-800">
                <ShieldCheck className="h-4 w-4 text-[#b91c1c]" />
                <span>
                  {currentUser?.name ||
                    (language === "ja"
                      ? "シェイク・バセット (メイン管理者)"
                      : language === "en"
                        ? "Sheikh Baset (Main Admin)"
                        : "শেখ বাসেত (Main Admin)")}
                </span>
                <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-extrabold text-emerald-900">
                  {activeRole}
                </span>
              </div>

              {(!currentUser || currentUser.role === "MAIN_ADMIN") && (
                <button
                  onClick={() => setActiveTab("users")}
                  className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition shadow-2xs ${
                    activeTab === "users"
                      ? "border-[#b91c1c] bg-[#b91c1c] text-white"
                      : "border-red-200 bg-red-50/70 text-[#b91c1c] hover:bg-red-100"
                  }`}
                  title={
                    language === "ja"
                      ? "ユーザーロールと権限を管理"
                      : language === "en"
                        ? "Manage user roles and access permissions"
                        : "কে কোন রোলে আছে এবং কাকে কী অ্যাক্সেস দেওয়া হয়েছে দেখুন ও নিয়ন্ত্রণ করুন"
                  }
                >
                  <KeyRound className="h-3.5 w-3.5" />
                  <span>
                    {language === "ja"
                      ? "ユーザー・権限管理"
                      : language === "en"
                        ? "Users & Access Control"
                        : "ইউজার ও অ্যাক্সেস কন্ট্রোল"}
                  </span>
                </button>
              )}

              {/* Database Sync Button */}
              <button
                onClick={handleManualSync}
                disabled={isSyncingWithDb}
                className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 transition shadow-2xs"
                title={
                  language === "ja"
                    ? "Supabaseと同期"
                    : language === "en"
                      ? "Sync with Supabase Database"
                      : "Supabase ডাটাবেজের সাথে সিঙ্ক করুন"
                }
              >
                <Database className={`h-3.5 w-3.5 text-emerald-600 ${isSyncingWithDb ? "animate-spin" : ""}`} />
                <span className="hidden lg:inline">
                  {isSyncingWithDb
                    ? language === "ja"
                      ? "同期中..."
                      : language === "en"
                        ? "Syncing..."
                        : "সিঙ্ক হচ্ছে..."
                    : language === "ja"
                      ? "Supabase同期"
                      : language === "en"
                        ? "Supabase Sync"
                        : "Supabase সিঙ্ক"}
                </span>
              </button>

              {/* Language Switcher */}
              <div className="flex items-center gap-1.5 rounded-xl border border-stone-200 bg-stone-50 px-2.5 py-1.5 shadow-2xs hover:bg-white transition">
                <Globe className="h-4 w-4 text-emerald-700 shrink-0" />
                <select
                  aria-label={t.languageLabel}
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as Language)}
                  className="bg-transparent text-xs font-bold text-slate-800 focus:outline-hidden cursor-pointer"
                >
                  {languageOptions.map((opt) => (
                    <option key={opt.value} value={opt.value} className="text-slate-900 bg-white">
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Public Website Link */}
              <Link
                href="/"
                className="hidden sm:inline-flex items-center gap-1 rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-stone-50 transition"
              >
                <span>{t.publicWebsite}</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1 rounded-xl border border-red-200 bg-red-50/70 px-2.5 py-1.5 text-xs font-bold text-red-700 hover:bg-red-100 transition"
                title={language === "ja" ? "ログアウト" : language === "en" ? "Logout" : "লগআউট"}
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">
                  {language === "ja" ? "ログアウト" : language === "en" ? "Logout" : "লগআউট"}
                </span>
              </button>
            </div>
          </div>

          {/* Module Navigation Tabs (Driven by Admin-Assigned Permissions) */}
          <nav className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-stone-200/80 pt-3">
            {[
              {
                id: "my_profile",
                label:
                  language === "ja"
                    ? "マイプロフィール・ファイル"
                    : language === "en"
                      ? "My Profile & File"
                      : "আমার প্রোফাইল ও ফাইল",
                icon: UserCheck,
                badge: 0,
              },
              { id: "overview", label: t.tabs.overview, icon: TrendingUp, badge: 0 },
              {
                id: "crm",
                label: t.tabs.crm,
                icon: PhoneCall,
                badge: adminBundle.summary?.newLeads || 0,
              },
              { id: "visa", label: t.tabs.visa, icon: FileCheck2, badge: 0 },
              { id: "lms", label: t.tabs.lms, icon: GraduationCap, badge: 0 },
              { id: "b2b", label: t.tabs.b2b, icon: Building2, badge: 0 },
              { id: "finance", label: t.tabs.finance, icon: DollarSign, badge: 0 },
              { id: "hr", label: t.tabs.hr, icon: UserCheck, badge: 0 },
              { id: "cms", label: t.tabs.cms, icon: Globe2, badge: 0 },
              {
                id: "store_blog",
                label: t.tabs.storeBlog,
                icon: ShoppingBag,
                badge:
                  (adminBundle.summary?.pendingOrders || 0) +
                  (adminBundle.summary?.pendingReviews || 0) +
                  (adminBundle.summary?.lowStockProducts || 0),
              },
              {
                id: "users",
                label:
                  language === "ja"
                    ? "ユーザー・権限管理"
                    : language === "en"
                      ? "Users & Access Control"
                      : "ইউজার ও অ্যাক্সেস কন্ট্রোল",
                icon: KeyRound,
                badge: 0,
              },
            ]
              .filter((tab) => {
                // Main Admin sees all operational tabs + User Access Control
                if (!currentUser || activeRole === "MAIN_ADMIN") {
                  return tab.id !== "my_profile";
                }
                // If user has explicit allowedTabs assigned by Main Admin, strictly enforce them
                if (currentUser.allowedTabs && currentUser.allowedTabs.length > 0) {
                  return currentUser.allowedTabs.includes(tab.id as DashboardTabId);
                }
                // Fallback role defaults
                if (activeRole === "STUDENT") return ["my_profile", "visa", "lms"].includes(tab.id);
                if (activeRole === "TELE_COUNSELOR") return ["overview", "crm", "visa", "lms"].includes(tab.id);
                if (activeRole === "TEACHER") return ["overview", "lms", "visa"].includes(tab.id);
                if (activeRole === "B2B_AGENT") return ["overview", "b2b", "visa"].includes(tab.id);
                if (activeRole === "INVESTOR") return ["overview", "finance", "b2b"].includes(tab.id);
                return tab.id !== "users" && tab.id !== "my_profile";
              })
              .map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as DashboardTabId)}
                    className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                      isActive
                        ? "bg-[#133e29] text-white shadow-sm ring-1 ring-[#133e29]"
                        : "border border-stone-200/80 bg-[#fcfaf7] text-slate-700 hover:border-emerald-300 hover:bg-white hover:text-slate-900"
                    }`}
                  >
                    <Icon className={`h-3.5 w-3.5 shrink-0 ${isActive ? "text-emerald-300" : "text-emerald-700"}`} />
                    <span>{tab.label}</span>
                    {tab.badge > 0 ? (
                      <span
                        className={`ml-0.5 inline-flex min-w-4 items-center justify-center rounded-full px-1.5 py-0.2 text-[10px] font-extrabold ${
                          isActive ? "bg-amber-400 text-slate-950" : "bg-[#b91c1c] text-white"
                        }`}
                      >
                        {tab.badge}
                      </span>
                    ) : null}
                  </button>
                );
              })}
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* =========================================================================
            MODULE 1: EXECUTIVE OVERVIEW & REAL-TIME KPI COMMAND CENTER
            ========================================================================= */}
        {activeTab === "overview" && (
          <div className="space-y-6 animate-fade-in">
            {/* MD / Super Admin Greeting & KPI Card Row */}
            <div className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 mb-2">
                    <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                    <span>{t.kpi.liveHub} • {activeBranch === "ALL" ? t.kpi.integrated : activeBranch}</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-relaxed">
                    {t.kpi.overviewTitle}
                  </h1>
                  <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
                    {t.kpi.overviewSub}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveTab("crm")}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#b91c1c] px-4 py-2.5 text-xs font-bold text-white hover:bg-red-800 transition shadow-xs"
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span>{t.kpi.addLeadBtn}</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("visa")}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#15803d] px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-800 transition shadow-xs"
                  >
                    <FileCheck2 className="h-4 w-4" />
                    <span>{t.kpi.viewPipelineBtn}</span>
                  </button>
                </div>
              </div>

              {/* 5 Core Financial & Operational KPI Cards */}
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {/* 1. Total Active Leads */}
                <div className="rounded-2xl border border-stone-200 bg-[#fcfaf7] p-4">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-xs font-bold">{t.kpi.totalLeads}</span>
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-900">{filteredLeads.length}</span>
                    <span className="text-xs font-semibold text-emerald-600">+12%</span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">{t.kpi.metaSubtitle}</p>
                </div>

                {/* 2. Active Language Students */}
                <div className="rounded-2xl border border-stone-200 bg-[#fcfaf7] p-4">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-xs font-bold">{t.kpi.activeStudents}</span>
                    <GraduationCap className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-900">
                      {store.lmsBridges.length + 84}
                    </span>
                    <span className="text-xs font-semibold text-emerald-600">N5, N4 &amp; Irodori</span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">{t.kpi.lmsSubtitle}</p>
                </div>

                {/* 3. In-Process Visa Files */}
                <div className="rounded-2xl border border-stone-200 bg-[#fcfaf7] p-4">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-xs font-bold">{t.kpi.inProcessVisas}</span>
                    <FileCheck2 className="h-4 w-4 text-[#b91c1c]" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-900">{filteredVisaApplicants.length}</span>
                    <span className="text-xs font-semibold text-amber-600">{t.kpi.aprilIntake}</span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">HLA Gakuin &amp; Top Academies</p>
                </div>

                {/* 4. Japanese School Commission Projection */}
                <div className="rounded-2xl border border-stone-200 bg-[#fcfaf7] p-4">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-xs font-bold">{t.kpi.expectedCommission}</span>
                    <Building2 className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-900">¥2.4M</span>
                    <span className="text-xs font-semibold text-indigo-700">~৳19.2L</span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">{t.kpi.yenCommissionSub}</p>
                </div>

                {/* 5. Monthly Cash Flow */}
                <div className="rounded-2xl border border-stone-200 bg-[#fcfaf7] p-4">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-xs font-bold">{t.kpi.monthlyCashFlow}</span>
                    <DollarSign className="h-4 w-4 text-emerald-700" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-black text-emerald-800">৳ 4.8L</span>
                    <span className="text-xs font-semibold text-emerald-600">Net Positive</span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">{t.kpi.marginSub}</p>
                </div>
              </div>
            </div>

            {/* Middle Section: Visual Revenue Chart & Live Visa Breakdown */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Left 2 Cols: Custom SVG Cash Flow & Revenue Visualizer */}
              <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-xs lg:col-span-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">{t.module1.chartTitle}</h2>
                    <p className="text-xs text-slate-500 mt-0.5">{t.module1.chartSubtitle}</p>
                  </div>
                  <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-slate-700">
                    {t.module1.fiscalYear}
                  </span>
                </div>

                {/* Custom SVG Performance Chart */}
                <div className="mt-6 rounded-2xl bg-stone-50 p-4 border border-stone-200/60">
                  <div className="h-48 w-full">
                    <svg viewBox="0 0 600 180" className="h-full w-full overflow-visible">
                      <defs>
                        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#15803d" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#15803d" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      {/* Grid lines */}
                      <line x1="0" y1="30" x2="600" y2="30" stroke="#e2e8f0" strokeDasharray="4 4" />
                      <line x1="0" y1="80" x2="600" y2="80" stroke="#e2e8f0" strokeDasharray="4 4" />
                      <line x1="0" y1="130" x2="600" y2="130" stroke="#e2e8f0" strokeDasharray="4 4" />

                      {/* Area Fill */}
                      <path
                        d="M 20 140 Q 120 120, 200 85 T 380 50 T 580 25 L 580 160 L 20 160 Z"
                        fill="url(#chartGrad)"
                      />
                      {/* Trend Line */}
                      <path
                        d="M 20 140 Q 120 120, 200 85 T 380 50 T 580 25"
                        fill="none"
                        stroke="#15803d"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />

                      {/* Data Points */}
                      {[
                        { cx: 20, cy: 140, val: "¥350k (৳3.5L)" },
                        { cx: 140, cy: 110, val: "¥500k (৳5L)" },
                        { cx: 260, cy: 80, val: "¥750k (৳7.5L)" },
                        { cx: 380, cy: 50, val: "¥1.0M (৳10.2L)" },
                        { cx: 500, cy: 35, val: "¥1.2M (৳12.4L)" },
                        { cx: 580, cy: 25, val: "¥1.5M (৳15L)" },
                      ].map((pt, i) => (
                        <g key={i}>
                          <circle cx={pt.cx} cy={pt.cy} r="5" fill="#ffffff" stroke="#b91c1c" strokeWidth="2.5" />
                          <text x={pt.cx} y={pt.cy - 10} fontSize="10" fontWeight="bold" textAnchor="middle" fill="#0f172a">
                            {pt.val}
                          </text>
                        </g>
                      ))}
                    </svg>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs font-semibold text-slate-500">
                    <span>{t.module1.chartMilestones[0]}</span>
                    <span>{t.module1.chartMilestones[1]}</span>
                    <span>{t.module1.chartMilestones[2]}</span>
                    <span>{t.module1.chartMilestones[3]}</span>
                  </div>
                </div>

                {/* 3 Key Financial Highlights */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="rounded-xl border border-stone-200 bg-white p-3">
                    <span className="text-slate-500">{t.module1.grossProjection}</span>
                    <p className="text-base font-extrabold text-slate-900 mt-1">৳ 48,00,000</p>
                    <span className="text-[11px] text-emerald-700">{t.module1.grossDesc}</span>
                  </div>
                  <div className="rounded-xl border border-stone-200 bg-white p-3">
                    <span className="text-slate-500">{t.module1.operationalCost}</span>
                    <p className="text-base font-extrabold text-slate-900 mt-1">৳ 12,00,000</p>
                    <span className="text-[11px] text-slate-500">{t.module1.operationalDesc}</span>
                  </div>
                  <div className="rounded-xl border border-stone-200 bg-emerald-50/50 p-3">
                    <span className="text-emerald-800 font-semibold">{t.module1.netProfit}</span>
                    <p className="text-base font-black text-emerald-700 mt-1">৳ 36,00,000</p>
                    <span className="text-[11px] text-emerald-800">{t.module1.netProfitDesc}</span>
                  </div>
                </div>
              </div>

              {/* Right Col: Quick Intake & SSW Special Campaign Status */}
              <div className="space-y-4">
                {/* Active Campaign Box */}
                <div className="rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-xs">
                  <div className="flex items-center gap-2">
                    <span className="flex h-3 w-3 rounded-full bg-emerald-600 animate-ping" />
                    <span className="text-xs font-black uppercase text-emerald-800">{t.module1.sswBadge}</span>
                  </div>
                  <h3 className="text-base font-black text-slate-900 mt-2 leading-tight">
                    {t.module1.sswTitle}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    {t.module1.sswDesc}
                  </p>
                  <div className="mt-3 rounded-xl bg-white p-3 border border-emerald-200 text-xs">
                    <div className="flex justify-between font-bold">
                      <span>{t.module1.sswSeats}</span>
                      <span className="text-emerald-700">{t.module1.sswEnrolled}</span>
                    </div>
                    <div className="w-full bg-stone-200 rounded-full h-2 mt-2">
                      <div className="bg-emerald-600 h-2 rounded-full" style={{ width: "72%" }}></div>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab("crm")}
                    className="mt-3.5 w-full rounded-xl bg-[#15803d] py-2 text-xs font-bold text-white hover:bg-emerald-800 transition"
                  >
                    {t.module1.sswButton}
                  </button>
                </div>

                {/* HLA Gakuin Partner Quick Status */}
                <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">{t.module1.partnerBadge}</span>
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-800">
                      {t.module1.partnerLocation}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-1">{t.module1.partnerTitle}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{t.module1.partnerDesc}</p>
                  <div className="mt-3 flex items-center justify-between text-xs border-t border-stone-100 pt-2 font-semibold">
                    <span>{t.module1.partnerFiles}</span>
                    <span className="text-emerald-700">{t.module1.partnerCommission}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            MODULE 2: OMNI-CHANNEL CRM & TELE-COUNSELOR WORKSPACE
            ========================================================================= */}
        {activeTab === "crm" && (
          <div className="space-y-6 animate-fade-in">
            {/* Header with Quick Actions */}
            <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {t.crm.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    {t.crm.subtitle}
                  </p>
                </div>
                {/* 1-Click New Lead Quick Insert Modal / Form */}
                <button
                  onClick={() => {
                    const name = prompt(language === "ja" ? "候補者氏名を入力:" : language === "en" ? "Enter candidate name:" : "প্রার্থীর নাম লিখুন:");
                    if (!name) return;
                    const phone = prompt(language === "ja" ? "電話番号を入力:" : language === "en" ? "Enter phone number:" : "ফোন নম্বর লিখুন (e.g. 017...):", "017");
                    if (!phone) return;
                    addCrmLead({
                      name,
                      phone,
                      whatsapp: phone.startsWith("+88") ? phone : `+88${phone}`,
                      city: "Dhaka",
                      source: "WHATSAPP_DIRECT",
                      interest: "STUDENT_VISA_REGULAR",
                      status: "NEW",
                      education: "HSC Passed",
                      japaneseProficiency: "LEARNING_N5",
                      studyGapYears: 1,
                      assignedTo: "Sumaiya Sultana (Tele-Counselor)",
                      branch: activeBranch === "KHULNA-01" ? "KHULNA-01" : "DHK-HQ",
                      notes: "New inquiry received. Immediate counseling required.",
                      followUpDate: new Date().toISOString().slice(0, 10),
                    });
                    showToast(t.toastSuccess);
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#b91c1c] px-4 py-2.5 text-xs font-bold text-white hover:bg-red-800 transition shadow-xs"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>{t.crm.quickAddBtn}</span>
                </button>
              </div>

              {/* CRM Lead Table */}
              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-stone-200 bg-stone-50 font-bold text-slate-700">
                    <tr>
                      <th className="p-3">{t.crm.colCandidate}</th>
                      <th className="p-3">{t.crm.colSource}</th>
                      <th className="p-3">{t.crm.colEducation}</th>
                      <th className="p-3">{t.crm.colCounselor}</th>
                      <th className="p-3">{t.crm.colStatus}</th>
                      <th className="p-3 text-right">{t.crm.colAction}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredLeads.map((lead) => {
                      const waText = encodeURIComponent(
                        `Hello ${lead.name}, greetings from KNLTC (Japan Gateway Dhaka & Khulna). We would like to follow up on your Japan study & SSW inquiry.`
                      );
                      const waLink = `https://wa.me/${lead.whatsapp.replace(/[^0-9]/g, "")}?text=${waText}`;

                      return (
                        <tr key={lead.id} className="hover:bg-stone-50/80 transition">
                          <td className="p-3">
                            <button
                              type="button"
                              onClick={() => setSelectedLeadForProfile(lead)}
                              className="text-left group"
                            >
                              <p className="font-extrabold text-slate-900 text-sm group-hover:text-[#b91c1c] underline-offset-2 group-hover:underline">
                                {lead.name}
                              </p>
                            </button>
                            <p className="text-slate-500 font-mono mt-0.5">{lead.phone}</p>
                            <div className="mt-1 flex flex-wrap items-center gap-1">
                              <span className="text-[10px] text-slate-400">
                                {t.crm.cityLabel}: {lead.city}
                              </span>
                              {lead.isFileOpened && (
                                <span className="rounded bg-red-100 px-1.5 py-0.2 text-[9px] font-bold text-[#b91c1c]">
                                  {language === "ja"
                                    ? "ファイル開設済"
                                    : language === "en"
                                      ? "File Opened"
                                      : "ফাইল ওপেনকৃত"}
                                </span>
                              )}
                              {lead.isCourseEnrolled && (
                                <span className="rounded bg-emerald-100 px-1.5 py-0.2 text-[9px] font-bold text-emerald-800">
                                  {language === "ja"
                                    ? "コース入学済"
                                    : language === "en"
                                      ? "Course Enrolled"
                                      : "কোর্সে ভর্তিকৃত"}
                                </span>
                              )}
                              {lead.hasLoginAccess && (
                                <span className="rounded bg-amber-100 px-1.5 py-0.2 text-[9px] font-bold text-amber-900">
                                  {language === "ja"
                                    ? `ログイン: ${lead.loginEmail}`
                                    : language === "en"
                                      ? `Login: ${lead.loginEmail}`
                                      : `লগইন: ${lead.loginEmail}`}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="inline-block rounded bg-stone-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                              {lead.source}
                            </span>
                            <p className="mt-1 font-semibold text-emerald-800">{lead.interest}</p>
                          </td>
                          <td className="p-3">
                            <p className="font-medium text-slate-800">{lead.education}</p>
                            <span className="inline-block mt-0.5 text-[11px] font-bold text-blue-700">
                              {lead.japaneseProficiency}
                            </span>
                            <p className="text-[10px] text-slate-400">{t.crm.gapLabel}: {lead.studyGapYears}</p>
                          </td>
                          <td className="p-3">
                            <p className="font-semibold text-slate-700">{lead.assignedTo}</p>
                            <span className="inline-block mt-0.5 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                              {lead.branch === "DHK-HQ" ? t.dhakaHq : t.khulnaBranch}
                            </span>
                          </td>
                          <td className="p-3">
                            <select
                              value={lead.status}
                              onChange={(e) => {
                                updateCrmLeadStatus(lead.id, e.target.value as LeadStatus);
                                showToast(`Status: ${e.target.value}`);
                              }}
                              className="rounded-lg border border-stone-300 bg-white px-2 py-1 text-xs font-bold text-slate-800 shadow-xs focus:ring-1 focus:ring-emerald-500"
                            >
                              <option value="NEW">{t.crm.statuses.NEW}</option>
                              <option value="CONTACTED">{t.crm.statuses.CONTACTED}</option>
                              <option value="COUNSELED">{t.crm.statuses.COUNSELED}</option>
                              <option value="OFFICE_VISIT_BOOKED">{t.crm.statuses.OFFICE_VISIT_BOOKED}</option>
                              <option value="ADMITTED">{t.crm.statuses.ADMITTED}</option>
                              <option value="ARCHIVED">{t.crm.statuses.ARCHIVED}</option>
                            </select>
                            <p className="mt-1 text-[10px] text-slate-400 max-w-xs truncate" title={lead.notes}>
                              {lead.notes}
                            </p>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex flex-wrap items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setSelectedLeadForProfile(lead)}
                                className="inline-flex items-center gap-1 rounded-xl bg-[#b91c1c] px-3 py-1.5 text-xs font-bold text-white hover:bg-red-800 transition shadow-xs"
                              >
                                <UserCheck className="h-3.5 w-3.5" />
                                <span>
                                  {language === "ja"
                                    ? "プロフィール・ログイン管理"
                                    : language === "en"
                                      ? "Profile & Login Access"
                                      : "প্রোফাইল ও ভর্তি লগইন"}
                                </span>
                              </button>
                              <a
                                href={waLink}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition shadow-xs"
                              >
                                <Send className="h-3.5 w-3.5" />
                                <span>WA</span>
                              </a>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Unified Supabase Website & Checkout CRM Leads (Merged from /admin/crm) */}
            <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 mb-1">
                    <Database className="h-3 w-3 text-emerald-600" />
                    <span>Supabase `crm_leads` Table</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900">
                    {language === "ja"
                      ? "ウェブサイト相談・お問い合わせ・ストア注文リード"
                      : language === "en"
                        ? "Website Consultation, Contact & Store Checkout Leads"
                        : "ওয়েবসাইট কনসালটেশন, কন্টাক্ট ও স্টোর চেকআউট লিডস"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {language === "ja"
                      ? "公開ウェブサイトのフォームやチェックアウトから直接データベースに登録されたリードを管理し、プロフィールとログインを作成します"
                      : language === "en"
                        ? "Manage leads submitted directly from website forms and store checkout, and provision their profile & portal login"
                        : "পাবলিক ওয়েবসাইটের ফর্ম ও চেকআউট থেকে সরাসরি ডাটাবেজে আসা লিডসমূহ পরিচালনা ও প্রোফাইল/লগইন তৈরি করুন"}
                  </p>
                </div>
                <span className="rounded-xl bg-stone-100 px-3 py-1.5 text-xs font-bold text-slate-700">
                  {language === "ja"
                    ? `総データベースリード: ${adminBundle.crmLeads.length}件`
                    : language === "en"
                      ? `Total Database Leads: ${adminBundle.crmLeads.length}`
                      : `মোট ডাটাবেজ লিড: ${adminBundle.crmLeads.length}টি`}
                </span>
              </div>
              <CrmManager
                initialLeads={adminBundle.crmLeads}
                onOpenLeadProfile={(dbLead) => {
                  const existingInStore = store.crmLeads.find(
                    (l) => l.id === dbLead.id || l.phone === dbLead.phone,
                  );
                  if (existingInStore) {
                    setSelectedLeadForProfile(existingInStore);
                  } else {
                    setSelectedLeadForProfile({
                      id: dbLead.id,
                      name: dbLead.name,
                      phone: dbLead.phone,
                      whatsapp: dbLead.phone.startsWith("+88") ? dbLead.phone : `+88${dbLead.phone}`,
                      email: dbLead.email || "",
                      city: "ঢাকা",
                      source: "WEBSITE_FORM",
                      interest: "STUDENT_VISA_REGULAR",
                      status: dbLead.status === "converted" ? "ADMITTED" : "NEW",
                      education: "HSC / Equivalent",
                      japaneseProficiency: "NONE",
                      studyGapYears: 1,
                      assignedTo: "সুমাইয়া সুলতানা (টেলি-কাউন্সেলর)",
                      branch: "DHK-HQ",
                      notes: dbLead.notes || dbLead.message || "",
                      followUpDate: new Date().toISOString().slice(0, 10),
                      lastContactedAt: dbLead.created_at,
                      createdAt: dbLead.created_at,
                    });
                  }
                }}
              />
            </div>
          </div>
        )}

        {/* =========================================================================
            MODULE 3: VISA PROCESSING ENGINE, ELIGIBILITY CALCULATOR & 10-STEP KANBAN
            ========================================================================= */}
        {activeTab === "visa" && (
          <div className="space-y-6 animate-fade-in">
            {/* Eligibility Calculator & Nexus Standard Checklist */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Automated Eligibility Calculator */}
              <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-xs">
                <div className="flex items-center gap-2 text-[#b91c1c]">
                  <Calculator className="h-5 w-5" />
                  <h3 className="text-base font-extrabold text-slate-900">{t.visa.calcTitle}</h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">{t.visa.calcSubtitle}</p>

                <div className="mt-4 space-y-3 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700">{t.visa.minGpa}</label>
                    <input
                      type="number"
                      step="0.1"
                      defaultValue="2.5"
                      className="mt-1 w-full rounded-lg border border-stone-300 p-2 font-bold"
                    />
                    <span className="text-[10px] text-slate-500">{t.visa.gpaReq}</span>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700">{t.visa.ageLabel}</label>
                    <input
                      type="number"
                      defaultValue="24"
                      className="mt-1 w-full rounded-lg border border-stone-300 p-2 font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700">{t.visa.gapLabel}</label>
                    <input
                      type="number"
                      defaultValue="2"
                      className="mt-1 w-full rounded-lg border border-stone-300 p-2 font-bold"
                    />
                  </div>
                  <div className="rounded-xl bg-emerald-50 p-3 border border-emerald-200 text-emerald-900">
                    <p className="font-extrabold text-sm flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span>{t.visa.eligibleTitle}</span>
                    </p>
                    <p className="text-[11px] mt-1 text-emerald-800 leading-relaxed">
                      {t.visa.eligibleDesc}
                    </p>
                  </div>
                </div>
              </div>

              {/* Nexus Standard Sponsor & Bank Solvency Checklist */}
              <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-xs lg:col-span-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">{t.visa.sponsorTitle}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{t.visa.sponsorSubtitle}</p>
                  </div>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                    {t.visa.bankSupportBadge}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs leading-relaxed">
                  <div className="rounded-2xl border border-stone-200 p-3.5 bg-[#fcfaf7]">
                    <p className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Check className="h-4 w-4 text-emerald-600" />
                      <span>{t.visa.sponsorApprovedTitle}</span>
                    </p>
                    <p className="mt-1 text-slate-600">{t.visa.sponsorApprovedDesc}</p>
                    <p className="mt-2 font-bold text-slate-900">{t.visa.sponsorPhoneReq}</p>
                    <p className="text-slate-500 text-[11px]">{t.visa.sponsorPhoneDesc}</p>
                  </div>

                  <div className="rounded-2xl border border-stone-200 p-3.5 bg-[#fcfaf7]">
                    <p className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Check className="h-4 w-4 text-emerald-600" />
                      <span>{t.visa.bankSolvencyTitle}</span>
                    </p>
                    <p className="mt-1 text-slate-600">{t.visa.bankSolvencyDesc}</p>
                    <p className="mt-2 font-bold text-slate-900 text-emerald-800">{t.visa.approvedBanksTitle}</p>
                    <p className="text-slate-600 text-[11px]">{t.visa.approvedBanksDesc}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 10-Step Visa Kanban Board */}
            <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">
                    {t.visa.pipelineTitle}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {t.visa.pipelineSubtitle}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span>{t.visa.dragActive}</span>
                </div>
              </div>

              {/* Kanban Grid (10 Stages horizontally scrollable) */}
              <div className="mt-6 flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                {t.visa.stages.map((col) => {
                  const applicantsInStage = filteredVisaApplicants.filter((v) => v.stage === col.stage);
                  return (
                    <div
                      key={col.stage}
                      className="min-w-[260px] flex-shrink-0 rounded-2xl border border-stone-200 bg-[#fcfaf7] p-3 shadow-xs"
                    >
                      <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                        <div>
                          <p className="font-extrabold text-xs text-slate-900">{col.name}</p>
                          <p className="text-[10px] text-slate-500">{col.desc}</p>
                        </div>
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-stone-200 text-[10px] font-bold text-slate-800">
                          {applicantsInStage.length}
                        </span>
                      </div>

                      <div className="mt-3 space-y-2.5">
                        {applicantsInStage.map((app) => (
                          <div
                            key={app.id}
                            className="rounded-xl border border-stone-200 bg-white p-3 shadow-xs hover:border-emerald-300 transition"
                          >
                            <div className="flex justify-between items-start">
                              <span className="text-[10px] font-bold text-slate-400 font-mono">
                                {app.trackingNo}
                              </span>
                              <span
                                className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${
                                  app.packageType === "PREMIUM"
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {app.packageType === "PREMIUM" ? t.visa.packagePremium : t.visa.packageRegular}
                              </span>
                            </div>
                            <p className="font-bold text-xs text-slate-900 mt-1">{app.name}</p>
                            <p className="text-[11px] text-slate-500">{app.targetSchool}</p>
                            <p className="text-[10px] text-emerald-700 font-semibold mt-1">
                              {t.visa.sessionPrefix} {app.intakeSession}
                            </p>

                            <div className="mt-2.5 flex items-center justify-between border-t border-stone-100 pt-2">
                              <span className="text-[10px] text-slate-400">
                                {t.visa.sponsorPrefix} {app.sponsorName || t.visa.underReview}
                              </span>
                              {col.stage < 10 && (
                                <button
                                  onClick={() => {
                                    updateVisaStage(app.id, (col.stage + 1) as VisaStage);
                                    showToast(`${app.name} -> Step ${col.stage + 1}`);
                                  }}
                                  className="inline-flex items-center gap-1 rounded bg-stone-900 px-2 py-1 text-[10px] font-bold text-white hover:bg-emerald-700 transition"
                                >
                                  <span>{t.visa.nextStageBtn}</span>
                                  <ChevronRight className="h-3 w-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}

                        {applicantsInStage.length === 0 && (
                          <div className="rounded-xl border border-dashed border-stone-300 p-4 text-center text-[11px] text-slate-400">
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
            MODULE 4: LANGUAGE COURSE & EXTERNAL LMS (npw.bd/knltc) BRIDGE
            ========================================================================= */}
        {activeTab === "lms" && (
          <div className="space-y-6 animate-fade-in">
            {/* Header & Economics Breakdown */}
            <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {t.lms.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    {t.lms.subtitle}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href="https://npw.bd/knltc"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#133e29] px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-900 transition"
                  >
                    <span>{t.lms.npwClassroom}</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href="https://npw.bd/irodori/index.html"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-800 hover:bg-stone-50 transition"
                  >
                    <span>{t.lms.irodoriPortal}</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>

              {/* Economics Breakdown: ৳12,000 fee - ৳2,000 portal fee = ৳10,000 net margin */}
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-stone-200 bg-[#fcfaf7] p-4">
                  <span className="text-xs font-bold text-slate-500">{t.lms.courseFeeTitle}</span>
                  <p className="text-2xl font-black text-slate-900 mt-1">৳ 12,000</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{t.lms.courseFeeDesc}</p>
                </div>
                <div className="rounded-2xl border border-stone-200 bg-rose-50/50 p-4">
                  <span className="text-xs font-bold text-rose-800">{t.lms.portalFeeTitle}</span>
                  <p className="text-2xl font-black text-rose-700 mt-1">৳ 2,000</p>
                  <p className="text-[11px] text-rose-800 mt-0.5">{t.lms.portalFeeDesc}</p>
                </div>
                <div className="rounded-2xl border border-stone-200 bg-emerald-50/50 p-4">
                  <span className="text-xs font-bold text-emerald-800">{t.lms.netMarginTitle}</span>
                  <p className="text-2xl font-black text-emerald-700 mt-1">৳ 10,000</p>
                  <p className="text-[11px] text-emerald-800 mt-0.5">{t.lms.netMarginDesc}</p>
                </div>
              </div>

              {/* LMS Student Credentials Table & 1-Click WhatsApp Sender */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-extrabold text-sm text-slate-900">
                    {t.lms.tableHeading}
                  </h3>
                  <button
                    onClick={() => {
                      const name = prompt(language === "ja" ? "受講生氏名:" : language === "en" ? "Student name:" : "শিক্ষার্থীর নাম:");
                      if (!name) return;
                      const phone = prompt(language === "ja" ? "電話番号:" : language === "en" ? "Phone number:" : "ফোন নম্বর:", "017");
                      if (!phone) return;
                      addLmsCredentials({
                        studentName: name,
                        phone,
                        courseLevel: "N5",
                        enrollmentNo: `KNLTC-2026-N5-${Math.floor(100 + Math.random() * 900)}`,
                        portalUsername: `${name.toLowerCase().replace(/\s+/g, "_")}_knltc`,
                        portalPasswordMasked: "N5@knltc2026",
                        activeBatch: "N5 Evening Classroom (Dhaka HQ)",
                      });
                      showToast(t.toastSuccess);
                    }}
                    className="inline-flex items-center gap-1 rounded-xl bg-stone-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition"
                  >
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span>{t.lms.issueAccountBtn}</span>
                  </button>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-stone-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-50 border-b border-stone-200 font-bold text-slate-700">
                      <tr>
                        <th className="p-3">{t.lms.colStudent}</th>
                        <th className="p-3">{t.lms.colCourse}</th>
                        <th className="p-3">{t.lms.colCredentials}</th>
                        <th className="p-3">{t.lms.colMargin}</th>
                        <th className="p-3">{t.lms.colProgress}</th>
                        <th className="p-3 text-right">{t.lms.colAction}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {store.lmsBridges.map((lms) => {
                        const msg = encodeURIComponent(
                          `Congratulations ${lms.studentName}!\nYour KNLTC Japanese Language Course Enrollment ID: ${lms.enrollmentNo}.\n\nAccess your Official Student LMS Portal:\nURL: https://npw.bd/knltc\nUsername: ${lms.portalUsername}\nPassword: ${lms.portalPasswordMasked}\n\nFor any queries, please reach out to Sensei Amir Hossain. Thank you!`
                        );
                        const waUrl = `https://wa.me/${lms.phone.replace(/[^0-9]/g, "")}?text=${msg}`;

                        return (
                          <tr key={lms.id} className="hover:bg-stone-50">
                            <td className="p-3">
                              <p className="font-bold text-slate-900">{lms.studentName}</p>
                              <span className="font-mono text-slate-400 text-[10px]">{lms.enrollmentNo}</span>
                              <p className="text-slate-500 text-[11px]">{lms.phone}</p>
                            </td>
                            <td className="p-3">
                              <span className="rounded bg-blue-50 px-2 py-0.5 font-bold text-blue-700">
                                {lms.courseLevel}
                              </span>
                              <p className="mt-1 text-[11px] text-slate-600">{lms.activeBatch}</p>
                            </td>
                            <td className="p-3">
                              <p className="font-mono font-bold text-slate-800">@{lms.portalUsername}</p>
                              <p className="font-mono text-slate-500 text-[11px]">{lms.portalPasswordMasked}</p>
                            </td>
                            <td className="p-3">
                              <p className="font-bold text-emerald-700">Net: ৳{lms.netKnlTcMarginBdt.toLocaleString()}</p>
                              <span className="text-[10px] text-slate-400">Portal: ৳{lms.portalFeeDeductedBdt.toLocaleString()}</span>
                            </td>
                            <td className="p-3">
                              <div className="w-24 bg-stone-200 rounded-full h-1.5 mt-1">
                                <div
                                  className="bg-emerald-600 h-1.5 rounded-full"
                                  style={{ width: `${lms.progressPercentage}%` }}
                                ></div>
                              </div>
                              <span className="text-[10px] font-bold text-slate-500 mt-1 inline-block">
                                {lms.progressPercentage}% {t.lms.completed}
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              <a
                                href={waUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white hover:bg-emerald-700 transition"
                              >
                                <Send className="h-3 w-3" />
                                <span>{t.lms.sendWaBtn}</span>
                              </a>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            MODULE 5: B2B CHANNEL, JAPANESE SCHOOL & GLOBAL PARTNER (HLA Gakuin)
            ========================================================================= */}
        {activeTab === "b2b" && (
          <div className="space-y-6 animate-fade-in">
            <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {t.b2b.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    {t.b2b.subtitle}
                  </p>
                </div>
                <div className="rounded-2xl bg-indigo-50 px-4 py-2 text-indigo-900 border border-indigo-200 text-xs font-bold">
                  {t.b2b.commissionBadge}
                </div>
              </div>

              {/* Japanese Partner Schools Grid */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {store.partnerSchools.map((sch) => (
                  <div key={sch.id} className="rounded-2xl border border-stone-200 bg-[#fcfaf7] p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="rounded bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-800">
                          {sch.location}
                        </span>
                        <h3 className="text-base font-extrabold text-slate-900 mt-1">{sch.name}</h3>
                        <p className="text-xs text-slate-500 font-jp">{sch.japaneseName}</p>
                      </div>
                      <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                        {sch.status}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2 text-xs border-t border-stone-200 pt-3">
                      <div>
                        <span className="text-slate-400">{t.b2b.contactPerson}</span>
                        <p className="font-bold text-slate-800 mt-0.5">{sch.contactPerson}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">{t.b2b.commissionRate}</span>
                        <p className="font-bold text-indigo-700 mt-0.5">¥{sch.commissionPerStudentYen.toLocaleString()} / student</p>
                      </div>
                      <div>
                        <span className="text-slate-400">{t.b2b.activeStudents}</span>
                        <p className="font-black text-slate-900 text-sm mt-0.5">{sch.activeStudentsCount} {t.b2b.studentsSuffix}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">{t.b2b.totalEarned}</span>
                        <p className="font-black text-emerald-700 text-sm mt-0.5">¥{sch.totalCommissionReceivedYen.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* B2B Institutional & Local Agent Ledger */}
              <div className="mt-6">
                <h3 className="font-extrabold text-sm text-slate-900 mb-3">
                  {t.b2b.ledgerTitle}
                </h3>
                <div className="overflow-x-auto rounded-2xl border border-stone-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-50 border-b border-stone-200 font-bold text-slate-700">
                      <tr>
                        <th className="p-3">{t.b2b.colAgent}</th>
                        <th className="p-3">{t.b2b.colTypeCity}</th>
                        <th className="p-3">{t.b2b.colReferred}</th>
                        <th className="p-3">{t.b2b.colSuccessfulVisas}</th>
                        <th className="p-3">{t.b2b.colAgreedCommission}</th>
                        <th className="p-3">{t.b2b.colPaidVsPending}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {store.b2bAgents.map((agent) => (
                        <tr key={agent.id} className="hover:bg-stone-50">
                          <td className="p-3">
                            <p className="font-bold text-slate-900">{agent.organizationName}</p>
                            <p className="text-slate-500 text-[11px]">{agent.contactPerson} ({agent.phone})</p>
                          </td>
                          <td className="p-3">
                            <span className="rounded bg-stone-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                              {agent.agentType}
                            </span>
                            <p className="text-[11px] text-slate-500 mt-0.5">{agent.city}</p>
                          </td>
                          <td className="p-3 font-bold text-slate-800">{agent.referredStudentsCount} {t.b2b.studentsSuffix}</td>
                          <td className="p-3 font-extrabold text-emerald-700">{agent.successfulVisasCount} {t.b2b.studentsSuffix}</td>
                          <td className="p-3 font-bold text-slate-900">৳{agent.agreedCommissionBdt.toLocaleString()} / visa</td>
                          <td className="p-3">
                            <p className="text-emerald-700 font-bold">{t.b2b.paidPrefix} ৳{agent.paidCommissionBdt.toLocaleString()}</p>
                            <p className="text-amber-700 text-[11px] font-semibold">{t.b2b.pendingPrefix} ৳{agent.pendingCommissionBdt.toLocaleString()}</p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            MODULE 6: FINANCE, PACKAGE BILLING & INVESTOR OPEN-BOOK PORTAL
            ========================================================================= */}
        {activeTab === "finance" && (
          <div className="space-y-6 animate-fade-in">
            {/* Investor Open-Book 10 Lakh Project Engine */}
            <div className="rounded-3xl border-2 border-emerald-600/30 bg-white p-6 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 mb-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    <span>{t.finance.auditBadge}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {t.finance.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
                    {t.finance.subtitle}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-500">{t.finance.capitalLabel}</span>
                  <p className="text-2xl font-black text-slate-900">৳ 10,00,000</p>
                </div>
              </div>

              {/* 4 Budget Allocation Pillars (30/20/30/20) */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-2xl border border-stone-200 bg-[#fcfaf7] p-4">
                  <span className="text-xs font-bold text-slate-500">{t.finance.pillar1Title}</span>
                  <p className="text-xl font-black text-slate-900 mt-1">৳ 3,00,000</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{t.finance.pillar1Desc}</p>
                </div>
                <div className="rounded-2xl border border-stone-200 bg-[#fcfaf7] p-4">
                  <span className="text-xs font-bold text-slate-500">{t.finance.pillar2Title}</span>
                  <p className="text-xl font-black text-slate-900 mt-1">৳ 2,00,000</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{t.finance.pillar2Desc}</p>
                </div>
                <div className="rounded-2xl border border-stone-200 bg-[#fcfaf7] p-4">
                  <span className="text-xs font-bold text-slate-500">{t.finance.pillar3Title}</span>
                  <p className="text-xl font-black text-slate-900 mt-1">৳ 3,00,000</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{t.finance.pillar3Desc}</p>
                </div>
                <div className="rounded-2xl border border-stone-200 bg-emerald-50/50 p-4">
                  <span className="text-xs font-bold text-emerald-800">{t.finance.pillar4Title}</span>
                  <p className="text-xl font-black text-emerald-700 mt-1">৳ 2,00,000</p>
                  <p className="text-[11px] text-emerald-800 mt-0.5">{t.finance.pillar4Desc}</p>
                </div>
              </div>

              {/* 3 Projections Scenarios Table */}
              <div className="mt-6 rounded-2xl border border-stone-200 p-5 bg-stone-50/50">
                <h3 className="font-extrabold text-sm text-slate-900 mb-3">
                  {t.finance.scenarioTitle}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="rounded-xl border border-stone-200 bg-white p-4">
                    <span className="rounded bg-stone-100 px-2 py-0.5 font-bold text-slate-700">
                      {t.finance.scen1Badge}
                    </span>
                    <p className="text-lg font-black text-slate-900 mt-2">{t.finance.scen1Gross}</p>
                    <p className="text-emerald-700 font-extrabold mt-1 text-sm">{t.finance.scen1Share}</p>
                    <p className="text-[11px] text-slate-500 mt-1">{t.finance.scen1Return}</p>
                  </div>
                  <div className="rounded-xl border-2 border-emerald-500 bg-white p-4 shadow-xs">
                    <span className="rounded bg-emerald-100 px-2 py-0.5 font-bold text-emerald-800">
                      {t.finance.scen2Badge}
                    </span>
                    <p className="text-lg font-black text-slate-900 mt-2">{t.finance.scen2Gross}</p>
                    <p className="text-emerald-700 font-black mt-1 text-base">{t.finance.scen2Share}</p>
                    <p className="text-[11px] text-emerald-800 mt-1 font-semibold">{t.finance.scen2Return}</p>
                  </div>
                  <div className="rounded-xl border border-stone-200 bg-white p-4">
                    <span className="rounded bg-stone-100 px-2 py-0.5 font-bold text-slate-700">
                      {t.finance.scen3Badge}
                    </span>
                    <p className="text-lg font-black text-slate-900 mt-2">{t.finance.scen3Gross}</p>
                    <p className="text-emerald-700 font-extrabold mt-1 text-sm">{t.finance.scen3Share}</p>
                    <p className="text-[11px] text-slate-500 mt-1">{t.finance.scen3Return}</p>
                  </div>
                </div>

                {/* Legal & Bank Cheque Security Record */}
                <div className="mt-4 flex flex-wrap items-center justify-between rounded-xl bg-white p-3.5 border border-stone-200 text-xs">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-emerald-600" />
                    <span className="font-bold text-slate-800">
                      {t.finance.legalText}
                    </span>
                  </div>
                  <span className="font-mono text-emerald-700 font-bold">{t.finance.legalBadge}</span>
                </div>
              </div>
            </div>

            {/* Package Billing & Transactions List */}
            <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {t.finance.billingTitle}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{t.finance.billingSubtitle}</p>
                </div>
                <button
                  onClick={() => {
                    const student = prompt(language === "ja" ? "受講生名:" : language === "en" ? "Student name:" : "শিক্ষার্থীর নাম:");
                    if (!student) return;
                    const amountStr = prompt(language === "ja" ? "入金金額 (BDT):" : language === "en" ? "Amount (BDT):" : "টাকার পরিমাণ (BDT):", "120000");
                    if (!amountStr) return;
                    addFinancialTransaction({
                      receiptNo: `RCP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
                      date: new Date().toISOString().slice(0, 10),
                      studentName: student,
                      type: "REGULAR_SERVICE_CHARGE",
                      amountBdt: Number(amountStr) || 120000,
                      paymentMethod: "BKASH",
                      referenceOrTrx: `BK-${Date.now().toString().slice(-6)}`,
                      branch: activeBranch === "KHULNA-01" ? "KHULNA-01" : "DHK-HQ",
                      verifiedBy: "Sheikh Baset",
                      notes: "Collection / verified",
                    });
                    showToast(t.toastSuccess);
                  }}
                  className="rounded-xl bg-stone-900 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition"
                >
                  {t.finance.recordPaymentBtn}
                </button>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-stone-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 font-bold text-slate-700">
                    <tr>
                      <th className="p-3">{t.finance.colReceiptDate}</th>
                      <th className="p-3">{t.finance.colStudentDesc}</th>
                      <th className="p-3">{t.finance.colPackageType}</th>
                      <th className="p-3">{t.finance.colMethodTrx}</th>
                      <th className="p-3">{t.finance.colBranch}</th>
                      <th className="p-3 text-right">{t.finance.colAmount}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {store.transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-stone-50">
                        <td className="p-3 font-mono font-bold text-slate-800">
                          {tx.receiptNo}
                          <p className="text-[10px] text-slate-400 font-sans">{tx.date}</p>
                        </td>
                        <td className="p-3 font-semibold text-slate-900">{tx.studentName}</td>
                        <td className="p-3 font-medium text-emerald-800">{tx.type}</td>
                        <td className="p-3">
                          <span className="rounded bg-stone-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                            {tx.paymentMethod}
                          </span>
                          <p className="font-mono text-[10px] text-slate-400 mt-0.5">{tx.referenceOrTrx}</p>
                        </td>
                        <td className="p-3 text-slate-600 font-medium">{tx.branch === "DHK-HQ" ? t.dhakaHq : t.khulnaBranch}</td>
                        <td className="p-3 text-right font-extrabold text-slate-900 text-sm">
                          ৳{tx.amountBdt.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            MODULE 7: HR & REMOTE TELE-COUNSELOR PAYROLL
            ========================================================================= */}
        {activeTab === "hr" && (
          <div className="space-y-6 animate-fade-in">
            <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {t.hr.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    {t.hr.subtitle}
                  </p>
                </div>
                <div className="rounded-2xl bg-amber-50 px-4 py-2 text-amber-900 border border-amber-200 text-xs font-bold">
                  {t.hr.bonusBadge}
                </div>
              </div>

              {/* Staff Table */}
              <div className="mt-6 overflow-x-auto rounded-2xl border border-stone-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 font-bold text-slate-700">
                    <tr>
                      <th className="p-3">{t.hr.colNameRole}</th>
                      <th className="p-3">{t.hr.colLocation}</th>
                      <th className="p-3">{t.hr.colCallsTarget}</th>
                      <th className="p-3">{t.hr.colAdmissions}</th>
                      <th className="p-3">{t.hr.colBaseSalary}</th>
                      <th className="p-3">{t.hr.colBonus}</th>
                      <th className="p-3 text-right">{t.hr.colTotalPay}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {store.staffList.map((stf) => {
                      const totalPay = stf.monthlyBaseSalaryBdt + stf.performanceBonusBdt;
                      return (
                        <tr key={stf.id} className="hover:bg-stone-50">
                          <td className="p-3">
                            <p className="font-extrabold text-slate-900 text-sm">{stf.name}</p>
                            <span className="inline-block mt-0.5 rounded bg-stone-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                              {stf.role}
                            </span>
                          </td>
                          <td className="p-3 font-semibold text-slate-600">{stf.location}</td>
                          <td className="p-3">
                            <p className="font-bold text-slate-800">
                              {stf.callsCompleted} / {stf.callsTargetMonthly} {t.hr.callsSuffix}
                            </p>
                            <div className="w-24 bg-stone-200 rounded-full h-1.5 mt-1">
                              <div
                                className="bg-blue-600 h-1.5 rounded-full"
                                style={{
                                  width: `${Math.min(
                                    100,
                                    (stf.callsCompleted / (stf.callsTargetMonthly || 1)) * 100
                                  )}%`,
                                }}
                              ></div>
                            </div>
                          </td>
                          <td className="p-3 font-extrabold text-emerald-700">
                            {stf.admissionsAchieved}
                          </td>
                          <td className="p-3 font-bold text-slate-800">
                            ৳{stf.monthlyBaseSalaryBdt.toLocaleString()}
                          </td>
                          <td className="p-3 font-bold text-emerald-600">
                            +৳{stf.performanceBonusBdt.toLocaleString()}
                          </td>
                          <td className="p-3 text-right font-black text-slate-900 text-sm">
                            ৳{totalPay.toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            MODULE 8: FULL WEBSITE CMS & MULTI-LANGUAGE CONTROL PANEL (100% of knltc.com)
            ========================================================================= */}
        {activeTab === "cms" && (
          <div className="space-y-6 animate-fade-in">
            {/* Top CMS Bar with Save & Reset */}
            <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-[#b91c1c] mb-1.5">
                    <Globe2 className="h-4 w-4" />
                    <span>{t.cms.cmsBadge}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {t.cms.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    {t.cms.subtitle}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      saveCmsStore(store);
                      showToast(t.toastSuccess || "সব পরিবর্তন সফলভাবে সেভ হয়েছে এবং ওয়েবসাইটে কার্যকর হয়েছে!");
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#15803d] px-5 py-2.5 text-xs font-extrabold text-white hover:bg-emerald-800 transition shadow-md"
                  >
                    <Save className="h-4 w-4" />
                    <span>{t.cms.saveBtn}</span>
                  </button>
                </div>
              </div>

              {/* Sub-Tabs for CMS Pages */}
              <div className="mt-8 space-y-8">
                {/* 1. Global Announcement & Hero Section */}
                <div className="rounded-2xl border border-stone-200 p-5 bg-[#fcfaf7]">
                  <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#b91c1c]" />
                    <span>{t.cms.section1Title}</span>
                  </h3>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-700">{t.cms.topBarLabel}:</label>
                      <input
                        type="text"
                        defaultValue={cms.topAnnouncementBar.text[language] || cms.topAnnouncementBar.text.bn}
                        onChange={(e) => {
                          cms.topAnnouncementBar.text[language] = e.target.value;
                          setStore({ ...store });
                        }}
                        className="mt-1 w-full rounded-lg border border-stone-300 p-2.5 font-medium"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700">{t.cms.popupLabel}:</label>
                      <input
                        type="text"
                        defaultValue={cms.popupBanner.headline[language] || cms.popupBanner.headline.bn}
                        onChange={(e) => {
                          cms.popupBanner.headline[language] = e.target.value;
                          setStore({ ...store });
                        }}
                        className="mt-1 w-full rounded-lg border border-stone-300 p-2.5 font-medium"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700">{t.cms.heroLabel}:</label>
                      <input
                        type="text"
                        defaultValue={cms.heroSection.headline[language] || cms.heroSection.headline.bn}
                        onChange={(e) => {
                          cms.heroSection.headline[language] = e.target.value;
                          setStore({ ...store });
                        }}
                        className="mt-1 w-full rounded-lg border border-stone-300 p-2.5 font-medium"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700">{t.cms.pixelLabel}:</label>
                      <input
                        type="text"
                        defaultValue={cms.metaPixelId}
                        onChange={(e) => {
                          cms.metaPixelId = e.target.value;
                          setStore({ ...store });
                        }}
                        className="mt-1 w-full rounded-lg border border-stone-300 p-2.5 font-mono font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Japanese Language Page & Lessons Editor */}
                <div className="rounded-2xl border border-stone-200 p-5 bg-[#fcfaf7]">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-emerald-700" />
                      <span>{t.cms.section2Title}</span>
                    </h3>
                    <span className="text-xs font-bold text-emerald-800">
                      N5: ৳{cms.languageCoursePage.n5PriceBdt.toLocaleString()}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="font-bold text-slate-700">{t.cms.n5PriceLabel}:</label>
                      <input
                        type="number"
                        defaultValue={cms.languageCoursePage.n5PriceBdt}
                        onChange={(e) => {
                          cms.languageCoursePage.n5PriceBdt = Number(e.target.value);
                          setStore({ ...store });
                        }}
                        className="mt-1 w-full rounded-lg border border-stone-300 p-2 font-bold"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700">{t.cms.n4PriceLabel}:</label>
                      <input
                        type="number"
                        defaultValue={cms.languageCoursePage.n4PriceBdt}
                        onChange={(e) => {
                          cms.languageCoursePage.n4PriceBdt = Number(e.target.value);
                          setStore({ ...store });
                        }}
                        className="mt-1 w-full rounded-lg border border-stone-300 p-2 font-bold"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700">{t.cms.comboPriceLabel}:</label>
                      <input
                        type="number"
                        defaultValue={cms.languageCoursePage.comboPriceBdt}
                        onChange={(e) => {
                          cms.languageCoursePage.comboPriceBdt = Number(e.target.value);
                          setStore({ ...store });
                        }}
                        className="mt-1 w-full rounded-lg border border-stone-300 p-2 font-bold"
                      />
                    </div>
                  </div>

                  {/* Minna Lessons Table */}
                  <div className="mt-5">
                    <h4 className="text-xs font-extrabold text-slate-800 mb-2">
                      {t.cms.lessonsTableTitle}
                    </h4>
                    <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-stone-50 border-b border-stone-200 font-bold">
                          <tr>
                            <th className="p-2.5">{t.cms.colLessonNo}</th>
                            <th className="p-2.5">{t.cms.colLessonTitle}</th>
                            <th className="p-2.5">{t.cms.colLessonCategory}</th>
                            <th className="p-2.5">{t.cms.colWordsCount}</th>
                            <th className="p-2.5 text-right">{t.cms.colAction}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                          {cms.languageCoursePage.lessons.map((lsn) => (
                            <tr key={lsn.id} className="hover:bg-stone-50">
                              <td className="p-2.5 font-bold">{lsn.lessonNumber}</td>
                              <td className="p-2.5 font-semibold text-slate-900">
                                {lsn.title[language] || lsn.title.bn || lsn.title.en}
                              </td>
                              <td className="p-2.5">
                                <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-800">
                                  {lsn.tabCategory}
                                </span>
                              </td>
                              <td className="p-2.5 text-slate-500">
                                {lsn.vocabularyList.length} {language === "ja" ? "語" : language === "en" ? "words" : "টি শব্দ"}
                              </td>
                              <td className="p-2.5 text-right">
                                <span className="text-emerald-700 font-bold text-[11px]">{t.cms.activeBadge}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* 3. Student Visa Page Packages Editor */}
                <div className="rounded-2xl border border-stone-200 p-5 bg-[#fcfaf7]">
                  <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                    <FileCheck2 className="h-4 w-4 text-[#b91c1c]" />
                    <span>{t.cms.section3Title}</span>
                  </h3>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="rounded-xl border border-stone-200 bg-white p-4">
                      <p className="font-black text-slate-900 text-sm">{t.cms.regularTitle}</p>
                      <label className="font-semibold text-slate-500 mt-2 block">
                        {t.cms.regularLabel}:
                      </label>
                      <input
                        type="number"
                        defaultValue={cms.studyInJapanPage.regularPackageFeeBdt}
                        onChange={(e) => {
                          cms.studyInJapanPage.regularPackageFeeBdt = Number(e.target.value);
                          setStore({ ...store });
                        }}
                        className="mt-1 w-full rounded-lg border border-stone-300 p-2 font-black text-emerald-800 text-base"
                      />
                      <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                        {t.cms.regularDesc}
                      </p>
                    </div>

                    <div className="rounded-xl border border-stone-200 bg-white p-4">
                      <p className="font-black text-slate-900 text-sm">{t.cms.premiumTitle}</p>
                      <label className="font-semibold text-slate-500 mt-2 block">
                        {t.cms.premiumLabel}:
                      </label>
                      <input
                        type="number"
                        defaultValue={cms.studyInJapanPage.premiumPackageFeeBdt}
                        onChange={(e) => {
                          cms.studyInJapanPage.premiumPackageFeeBdt = Number(e.target.value);
                          setStore({ ...store });
                        }}
                        className="mt-1 w-full rounded-lg border border-stone-300 p-2 font-black text-indigo-800 text-base"
                      />
                      <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                        {t.cms.premiumDesc}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 4. Job Circulars & SSW Manager */}
                <div className="rounded-2xl border border-stone-200 p-5 bg-[#fcfaf7]">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-emerald-700" />
                      <span>{t.cms.section4Title}</span>
                    </h3>
                    <button
                      onClick={() => {
                        const defaultTitle = language === "ja" ? "特定技能 外食業スペシャリスト" : language === "en" ? "SSW Food Service Specialist" : "SSW ফুড সার্ভিস স্পেশালিস্ট";
                        const promptMsg = language === "ja" ? "求人役職名を入力してください:" : language === "en" ? "Enter Job Position Title:" : "চাকরির পদবীর নাম:";
                        const title = prompt(promptMsg, defaultTitle);
                        if (!title) return;
                        const newCirc: JobCircular = {
                          id: `job-${Date.now()}`,
                          title: { bn: title, en: title, ja: title },
                          category: "SSW_FOOD_SERVICE",
                          salaryYen: "¥180,000 – ¥220,000 / 月",
                          salaryBdtEquivalent: "৳ ১,৪৫,০০০ – ৳ ১,৭৫,০০০",
                          locationJapan: "Tokyo, Chiba",
                          openings: 8,
                          requirements: {
                            bn: "JLPT N4 অথবা JFT-Basic + ফুড সার্ভিস স্কিল টেস্ট।",
                            en: "JLPT N4 + Food Service Skill Test",
                            ja: "外食業技能測定試験合格",
                          },
                          specialBenefitsBn: "ফ্রি ডরমেটরি বাসস্থান ও মিল সুবিধা।",
                          isPublished: true,
                          deadline: "2027-03-30",
                        };
                        cms.jobCirculars.unshift(newCirc);
                        setStore({ ...store });
                        showToast(language === "ja" ? "求人情報が追加されました！" : language === "en" ? "New job circular added!" : "নতুন জব সার্কুলার যোগ হয়েছে!");
                      }}
                      className="rounded-xl bg-stone-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition"
                    >
                      {t.cms.newCircularBtn}
                    </button>
                  </div>

                  <div className="space-y-3">
                    {cms.jobCirculars.map((circ) => (
                      <div
                        key={circ.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-stone-200 bg-white p-3.5 gap-3"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                              {circ.category}
                            </span>
                            <span className="text-xs font-bold text-slate-500">{t.cms.japanLocation}: {circ.locationJapan}</span>
                          </div>
                          <p className="font-extrabold text-sm text-slate-900 mt-1">{circ.title[language] || circ.title.bn || circ.title.en}</p>
                          <p className="text-xs font-bold text-emerald-700 mt-0.5">
                            {t.cms.salaryPrefix}: {circ.salaryYen} ({circ.salaryBdtEquivalent})
                          </p>
                          <p className="text-[11px] text-amber-800 font-semibold mt-1">{circ.specialBenefitsBn}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              circ.isPublished = !circ.isPublished;
                              setStore({ ...store });
                              showToast(circ.isPublished ? (language === "ja" ? "公開されました" : language === "en" ? "Circular Published!" : "সার্কুলার পাবলিশ করা হয়েছে!") : (language === "ja" ? "下書きに変更されました" : language === "en" ? "Moved to Draft" : "ড্রাফট করা হয়েছে!"));
                            }}
                            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                              circ.isPublished
                                ? "bg-emerald-600 text-white"
                                : "bg-stone-200 text-slate-700"
                            }`}
                          >
                            {circ.isPublished ? t.cms.liveActive : t.cms.draft}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5. Book Store & Product Management */}
                <div className="rounded-2xl border border-stone-200 p-5 bg-[#fcfaf7]">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                      <ShoppingBag className="h-4 w-4 text-indigo-700" />
                      <span>{t.cms.section5Title}</span>
                    </h3>
                    <span className="text-xs font-bold text-slate-500">
                      {t.cms.pendingOrdersPrefix}: {cms.customerOrders.filter((o) => o.orderStatus === "PROCESSING").length}
                    </span>
                  </div>

                  {/* Customer Orders Table */}
                  <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-stone-50 border-b border-stone-200 font-bold">
                        <tr>
                          <th className="p-2.5">{t.cms.colOrderCustomer}</th>
                          <th className="p-2.5">{t.cms.colItemsAddress}</th>
                          <th className="p-2.5">{t.cms.colDeliveryArea}</th>
                          <th className="p-2.5">{t.cms.colPaymentMethod}</th>
                          <th className="p-2.5">{t.cms.colTotalPrice}</th>
                          <th className="p-2.5 text-right">{t.cms.colStatus}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {cms.customerOrders.map((ord) => (
                          <tr key={ord.id} className="hover:bg-stone-50">
                            <td className="p-2.5">
                              <p className="font-mono font-bold text-slate-900">{ord.orderNo}</p>
                              <p className="text-slate-600 font-medium">{ord.customerName}</p>
                              <p className="text-[10px] text-slate-400 font-mono">{ord.customerPhone}</p>
                            </td>
                            <td className="p-2.5">
                              {ord.items.map((it, idx) => (
                                <p key={idx} className="font-semibold text-slate-800">
                                  {it.productName} x{it.quantity}
                                </p>
                              ))}
                              <p className="text-[10px] text-slate-400 mt-0.5">{ord.address}</p>
                            </td>
                            <td className="p-2.5 font-medium text-slate-700">{ord.deliveryArea}</td>
                            <td className="p-2.5">
                              <span className="rounded bg-stone-100 px-2 py-0.5 text-[10px] font-bold">
                                {ord.paymentMethod}
                              </span>
                              {ord.trxId && (
                                <p className="font-mono text-[9px] text-slate-400 mt-0.5">{ord.trxId}</p>
                              )}
                            </td>
                            <td className="p-2.5 font-black text-slate-900 text-sm">৳{ord.grandTotal}</td>
                            <td className="p-2.5 text-right">
                              <select
                                value={ord.orderStatus}
                                onChange={(e) => {
                                  updateStoreOrderStatus(ord.id, e.target.value as any);
                                  showToast(`${t.cms.colStatus}: ${e.target.value}`);
                                }}
                                className="rounded border border-stone-300 p-1 font-bold text-xs bg-white"
                              >
                                <option value="PENDING">{t.cms.orderStatuses.PENDING}</option>
                                <option value="PROCESSING">{t.cms.orderStatuses.PROCESSING}</option>
                                <option value="SHIPPED">{t.cms.orderStatuses.SHIPPED}</option>
                                <option value="DELIVERED">{t.cms.orderStatuses.DELIVERED}</option>
                                <option value="CANCELLED">{t.cms.orderStatuses.CANCELLED}</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            MODULE 9: UNIFIED BOOK STORE, ORDERS, BLOG, REVIEWS & STORAGE COMMAND CENTER
            (Deeply Merged with Previous /admin Panel)
            ========================================================================= */}
        {activeTab === "store_blog" && (
          <div className="space-y-6 animate-fade-in">
            {/* Top Command Header & Unified Sub-Navigation */}
            <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-0.5 text-xs font-bold text-emerald-800">
                      UNIFIED STORE & BLOG ADMIN
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      {language === "ja"
                        ? "ブックストア・注文・ブログ・カテゴリー・クラウドストレージ管理"
                        : language === "en"
                          ? "Bookstore, Orders, Blog, Categories & Cloud Storage Panel"
                          : "বুক স্টোর, অর্ডার, ব্লগ, ক্যাটেগরি ও ক্লাউড স্টোরেজ প্যানেল"}
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    {language === "ja"
                      ? "書籍の追加・編集、表紙アップロード、注文追跡、ブログ記事、レビュー承認、バケットストレージをすべて一括管理できます。"
                      : language === "en"
                        ? "All bookstore products, cover image uploads, order tracking, blog articles, review moderation, and storage buckets unified in one workspace."
                        : "আগের `/admin` প্যানেলের সব ফিচার (বই যোগ/এডিট, কভার আপলোড, অর্ডার ট্র্যাকিং, ব্লগ পোস্ট, রিভিউ মডারেশন ও বাকেট স্টোরেজ) এখন সরাসরি এখানেই সমন্বিত।"}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href="/store"
                    target="_blank"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-stone-100 transition"
                  >
                    <span>
                      {language === "ja"
                        ? "ライブストア"
                        : language === "en"
                          ? "Live Bookstore"
                          : "লাইভ বুক স্টোর"}
                    </span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                  <Link
                    href="/blog"
                    target="_blank"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-stone-100 transition"
                  >
                    <span>
                      {language === "ja"
                        ? "ライブブログ"
                        : language === "en"
                          ? "Live Blog Page"
                          : "লাইভ ব্লগ পেইজ"}
                    </span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                  <button
                    onClick={() => setStoreSubTab("products")}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#b91c1c] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-red-800 transition"
                  >
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span>
                      {language === "ja"
                        ? "新しい書籍を追加"
                        : language === "en"
                          ? "Add New Book"
                          : "নতুন বই যোগ করুন"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Sub-Navigation Pills for Merged Admin Modules */}
              <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-stone-100 pt-4">
                {[
                  {
                    id: "summary",
                    label:
                      language === "ja"
                        ? "概要・アラート"
                        : language === "en"
                          ? "Summary & Alerts"
                          : "সামগ্রিক চিত্র ও অ্যালার্ট",
                    icon: Sparkles,
                    count: 0,
                  },
                  {
                    id: "products",
                    label:
                      language === "ja"
                        ? "書籍・商品管理"
                        : language === "en"
                          ? "Books & Products"
                          : "বই ও পণ্য সম্ভার (Products)",
                    icon: BookOpen,
                    count: adminBundle.products.length,
                    alert: adminBundle.summary?.lowStockProducts || 0,
                  },
                  {
                    id: "orders",
                    label:
                      language === "ja"
                        ? "オンライン注文"
                        : language === "en"
                          ? "Book Orders"
                          : "অনলাইন বুক অর্ডার (Orders)",
                    icon: ShoppingBag,
                    count: adminBundle.orders.length,
                    alert: adminBundle.summary?.pendingOrders || 0,
                  },
                  {
                    id: "blog",
                    label:
                      language === "ja"
                        ? "ブログ・記事管理"
                        : language === "en"
                          ? "Blog & Articles"
                          : "ব্লগ ও আর্টিকেল (Blog CMS)",
                    icon: FileText,
                    count: adminBundle.posts.length,
                    alert: 0,
                  },
                  {
                    id: "categories",
                    label:
                      language === "ja"
                        ? "カテゴリー管理"
                        : language === "en"
                          ? "Categories"
                          : "ক্যাটেগরি (Categories)",
                    icon: Layers,
                    count: adminBundle.categories.length,
                    alert: 0,
                  },
                  {
                    id: "reviews",
                    label:
                      language === "ja"
                        ? "カスタマーレビュー"
                        : language === "en"
                          ? "Customer Reviews"
                          : "কাস্টমার রিভিউ (Reviews)",
                    icon: Award,
                    count: adminBundle.reviews.length,
                    alert: adminBundle.summary?.pendingReviews || 0,
                  },
                  {
                    id: "uploads",
                    label:
                      language === "ja"
                        ? "クラウドメディア・書類"
                        : language === "en"
                          ? "Cloud Media & Docs"
                          : "ক্লাউড মিডিয়া ও ডকুমেন্টস",
                    icon: Database,
                    count: 0,
                    alert: 0,
                  },
                ].map((sub) => {
                  const SubIcon = sub.icon;
                  const active = storeSubTab === sub.id;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => setStoreSubTab(sub.id as any)}
                      className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                        active
                          ? "bg-[#133e29] text-white shadow-xs"
                          : "border border-stone-200 bg-[#fcfaf7] text-slate-700 hover:bg-white hover:border-emerald-300"
                      }`}
                    >
                      <SubIcon className={`h-3.5 w-3.5 ${active ? "text-emerald-300" : "text-emerald-700"}`} />
                      <span>{sub.label}</span>
                      {sub.count > 0 ? (
                        <span
                          className={`rounded-full px-1.5 py-0.2 text-[10px] font-extrabold ${
                            active ? "bg-emerald-800 text-emerald-100" : "bg-stone-200 text-slate-700"
                          }`}
                        >
                          {sub.count}
                        </span>
                      ) : null}
                      {sub.alert ? (
                        <span className="rounded-full bg-[#b91c1c] px-1.5 py-0.2 text-[10px] font-extrabold text-white">
                          {sub.alert}!
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SUB-TAB 1: SUMMARY & NOTIFICATION OVERVIEW (Merged from /admin/page.tsx) */}
            {storeSubTab === "summary" && (
              <div className="space-y-6">
                {adminBundle.summary?.setupWarning ? (
                  <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-xs font-semibold text-amber-900">
                    {adminBundle.summary.setupWarning}
                  </div>
                ) : null}

                {/* 4 Actionable Notification Cards from Legacy /admin */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <button
                    onClick={() => setStoreSubTab("orders")}
                    className="text-left rounded-2xl border border-amber-200 bg-amber-50/70 p-5 hover:bg-amber-50 transition shadow-2xs group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-900 uppercase">
                        {language === "ja"
                          ? "保留中の注文"
                          : language === "en"
                            ? "Pending Book Orders"
                            : "পেন্ডিং বুক অর্ডার"}
                      </span>
                      <ShoppingBag className="h-4 w-4 text-amber-700 group-hover:scale-110 transition" />
                    </div>
                    <p className="mt-2 text-3xl font-black text-amber-950">
                      {adminBundle.summary?.pendingOrders ?? 0}
                    </p>
                    <p className="mt-1 text-[11px] font-semibold text-amber-800">
                      {language === "ja"
                        ? "注文確認と配送ステータスを更新 →"
                        : language === "en"
                          ? "Confirm orders & update delivery status →"
                          : "অর্ডার কনফার্ম ও ডেলিভারি স্ট্যাটাস আপডেট করুন →"}
                    </p>
                  </button>

                  <button
                    onClick={() => setStoreSubTab("reviews")}
                    className="text-left rounded-2xl border border-purple-200 bg-purple-50/70 p-5 hover:bg-purple-50 transition shadow-2xs group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-900 uppercase">
                        {language === "ja"
                          ? "承認待ちレビュー"
                          : language === "en"
                            ? "Pending Customer Reviews"
                            : "পেন্ডিং কাস্টমার রিভিউ"}
                      </span>
                      <Award className="h-4 w-4 text-purple-700 group-hover:scale-110 transition" />
                    </div>
                    <p className="mt-2 text-3xl font-black text-purple-950">
                      {adminBundle.summary?.pendingReviews ?? 0}
                    </p>
                    <p className="mt-1 text-[11px] font-semibold text-purple-800">
                      {language === "ja"
                        ? "カスタマーレビューを承認または却下 →"
                        : language === "en"
                          ? "Approve or reject customer book reviews →"
                          : "বইয়ের কাস্টমার রিভিউ অ্যাপ্রুভ বা রিজেক্ট করুন →"}
                    </p>
                  </button>

                  <button
                    onClick={() => setStoreSubTab("products")}
                    className="text-left rounded-2xl border border-rose-200 bg-rose-50/70 p-5 hover:bg-rose-50 transition shadow-2xs group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-rose-900 uppercase">
                        {language === "ja"
                          ? "在庫僅少アラート (≤2)"
                          : language === "en"
                            ? "Low-Stock Book Alert (≤2)"
                            : "লো-স্টক বই অ্যালার্ট (≤২)"}
                      </span>
                      <AlertCircle className="h-4 w-4 text-rose-700 group-hover:scale-110 transition" />
                    </div>
                    <p className="mt-2 text-3xl font-black text-rose-950">
                      {adminBundle.summary?.lowStockProducts ?? 0}
                    </p>
                    <p className="mt-1 text-[11px] font-semibold text-rose-800">
                      {language === "ja"
                        ? "在庫数と書籍価格を更新 →"
                        : language === "en"
                          ? "Update inventory stock and book pricing →"
                          : "ইনভেন্টরি স্টক ও বইয়ের মূল্য আপডেট করুন →"}
                    </p>
                  </button>

                  <button
                    onClick={() => setActiveTab("crm")}
                    className="text-left rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 hover:bg-emerald-50 transition shadow-2xs group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-900 uppercase">
                        {language === "ja"
                          ? "新規ウェブサイトリード"
                          : language === "en"
                            ? "New Website Leads"
                            : "নতুন ওয়েবসাইট লিডস"}
                      </span>
                      <Users className="h-4 w-4 text-emerald-700 group-hover:scale-110 transition" />
                    </div>
                    <p className="mt-2 text-3xl font-black text-emerald-950">
                      {adminBundle.summary?.newLeads ?? 0}
                    </p>
                    <p className="mt-1 text-[11px] font-semibold text-emerald-800">
                      {language === "ja"
                        ? "ウェブサイト・チェックアウトのリードをフォロー →"
                        : language === "en"
                          ? "Follow up on website & checkout leads →"
                          : "ওয়েবসাইট ও চেকআউট লিড ফলো-আপ করুন →"}
                    </p>
                  </button>
                </div>

                {/* Content & Store Totals Row (from legacy /admin) */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div
                    onClick={() => setStoreSubTab("products")}
                    className="cursor-pointer rounded-2xl border border-stone-200 bg-white p-5 hover:border-emerald-400 transition shadow-2xs"
                  >
                    <p className="text-xs font-bold text-slate-500">
                      {language === "ja"
                        ? "総書籍・ストア商品数"
                        : language === "en"
                          ? "Total Books & Store Products"
                          : "মোট বই ও স্টোর পণ্য (Total Products)"}
                    </p>
                    <p className="mt-2 text-3xl font-black text-slate-900">
                      {adminBundle.summary?.totalProducts ?? adminBundle.products.length}
                    </p>
                    <p className="mt-1 text-[11px] font-bold text-emerald-700">
                      {language === "ja"
                        ? "商品一覧・エディターを開く →"
                        : language === "en"
                          ? "Open product list & editor →"
                          : "পণ্য তালিকা ও এডিটর খুলুন →"}
                    </p>
                  </div>

                  <div
                    onClick={() => setStoreSubTab("blog")}
                    className="cursor-pointer rounded-2xl border border-stone-200 bg-white p-5 hover:border-emerald-400 transition shadow-2xs"
                  >
                    <p className="text-xs font-bold text-slate-500">
                      {language === "ja"
                        ? "総ブログ記事数"
                        : language === "en"
                          ? "Total Blog Articles"
                          : "মোট ব্লগ আর্টিকেল (Total Blog Posts)"}
                    </p>
                    <p className="mt-2 text-3xl font-black text-slate-900">
                      {adminBundle.summary?.totalBlogPosts ?? adminBundle.posts.length}
                    </p>
                    <p className="mt-1 text-[11px] font-bold text-emerald-700">
                      {language === "ja"
                        ? "ブログエディターを開く →"
                        : language === "en"
                          ? "Open blog editor →"
                          : "ব্লগ এডিটর খুলুন →"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-2xs">
                    <p className="text-xs font-bold text-slate-500">
                      {language === "ja"
                        ? "公開済みコンテンツ"
                        : language === "en"
                          ? "Published Content"
                          : "পাবলিশড কনটেন্ট (Published Items)"}
                    </p>
                    <p className="mt-2 text-3xl font-black text-emerald-700">
                      {adminBundle.summary?.totalPublished ?? 0}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-500">
                      {language === "ja"
                        ? "サイト上で公開中の書籍とブログ"
                        : language === "en"
                          ? "Live books and blog posts on website"
                          : "ওয়েবসাইটে লাইভ প্রদর্শিত বই ও ব্লগ"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-2xs">
                    <p className="text-xs font-bold text-slate-500">
                      {language === "ja"
                        ? "下書きコンテンツ"
                        : language === "en"
                          ? "Draft Content"
                          : "ড্রাফট কনটেন্ট (Draft Items)"}
                    </p>
                    <p className="mt-2 text-3xl font-black text-amber-600">
                      {adminBundle.summary?.totalDrafts ?? 0}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-500">
                      {language === "ja"
                        ? "未公開の下書き商品・記事"
                        : language === "en"
                          ? "Unpublished draft products and articles"
                          : "অপ্রকাশিত খসড়া পণ্য ও আর্টিকেল"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB 2: PRODUCTS MANAGER */}
            {storeSubTab === "products" && (
              <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">
                      {language === "ja"
                        ? "書籍・ストア商品管理 (Product Manager)"
                        : language === "en"
                          ? "Books & Store Product Management"
                          : "বই ও স্টোর পণ্য ব্যবস্থাপনা (Product Manager)"}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {language === "ja"
                        ? "新しい書籍の追加、`knltc-media`バケットへの表紙画像アップロード、在庫・価格の更新"
                        : language === "en"
                          ? "Add new books, upload cover images to `knltc-media` bucket, and update stock & pricing"
                          : "নতুন বই যুক্ত করুন, কভার ছবি `knltc-media` বাকেটে আপলোড করুন এবং স্টক ও মূল্য হালনাগাদ করুন"}
                    </p>
                  </div>
                  <button
                    onClick={() => setStoreSubTab("categories")}
                    className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-stone-100"
                  >
                    {language === "ja"
                      ? "カテゴリー管理 →"
                      : language === "en"
                        ? "Manage Categories →"
                        : "ক্যাটেগরি ম্যানেজ করুন →"}
                  </button>
                </div>
                <ProductManager
                  initialProducts={adminBundle.products}
                  categories={adminBundle.categories.filter((c) => c.type === "product")}
                />
              </div>
            )}

            {/* SUB-TAB 3: ORDERS MANAGER */}
            {storeSubTab === "orders" && (
              <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-xs">
                <div className="mb-4">
                  <h3 className="text-lg font-black text-slate-900">
                    {language === "ja"
                      ? "オンライン書籍注文・配送トラッカー (Order Manager)"
                      : language === "en"
                        ? "Online Book Orders & Delivery Tracker"
                        : "অনলাইন বুক অর্ডার ও ডেলিভারি ট্র্যাকার (Order Manager)"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {language === "ja"
                      ? "顧客の注文一覧、配送先住所、注文ステータスを更新します"
                      : language === "en"
                        ? "View customer orders, delivery addresses, and update order status (`pending`, `confirmed`, `processing`, `delivered`, `cancelled`)"
                        : "কাস্টমারদের অর্ডার তালিকা, ডেলিভারি ঠিকানা এবং স্ট্যাটাস (`pending`, `confirmed`, `processing`, `delivered`, `cancelled`) পরিবর্তন করুন"}
                  </p>
                </div>
                {adminBundle.ordersWarning ? (
                  <div className="mb-4 rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900">
                    {adminBundle.ordersWarning}
                  </div>
                ) : null}
                <OrderManager initialOrders={adminBundle.orders} />
              </div>
            )}

            {/* SUB-TAB 4: BLOG MANAGER */}
            {storeSubTab === "blog" && (
              <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">
                      {language === "ja"
                        ? "ブログ記事・ビザガイドライン編集 (Blog Manager)"
                        : language === "en"
                          ? "Blog Posts & Visa Guidelines Editor"
                          : "ব্লগ পোস্ট ও ভিসা গাইডলাইন এডিটর (Blog Manager)"}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {language === "ja"
                        ? "リッチテキストエディターを使用して新しい記事や日本留学ガイドを作成・公開します"
                        : language === "en"
                          ? "Write and publish new articles, images, and Japan study guidelines using the rich text editor"
                          : "রিচ টেক্সট এডিটরের মাধ্যমে নতুন আর্টিকেল, ছবি ও জাপান স্টাডি গাইডলাইন লিখুন ও প্রকাশ করুন"}
                    </p>
                  </div>
                  <button
                    onClick={() => setStoreSubTab("categories")}
                    className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-stone-100"
                  >
                    {language === "ja"
                      ? "ブログカテゴリー →"
                      : language === "en"
                        ? "Blog Categories →"
                        : "ব্লগ ক্যাটেগরি →"}
                  </button>
                </div>
                <BlogManager
                  initialPosts={adminBundle.posts}
                  categories={adminBundle.categories.filter((c) => c.type === "blog")}
                />
              </div>
            )}

            {/* SUB-TAB 5: CATEGORIES MANAGER */}
            {storeSubTab === "categories" && (
              <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-xs">
                <div className="mb-4">
                  <h3 className="text-lg font-black text-slate-900">
                    {language === "ja"
                      ? "書籍・ブログカテゴリー管理 (Category Manager)"
                      : language === "en"
                        ? "Book & Blog Category Management"
                        : "বই ও ব্লগ ক্যাটেগরি ব্যবস্থাপনা (Category Manager)"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {language === "ja"
                      ? "ブックストア商品およびブログ記事のカテゴリーを作成・削除します"
                      : language === "en"
                        ? "Create or remove categories for bookstore products and blog posts"
                        : "বুক স্টোরের পণ্য এবং ব্লগের জন্য নতুন ক্যাটেগরি তৈরি বা মুছে ফেলুন"}
                  </p>
                </div>
                <CategoryManager initialCategories={adminBundle.categories} />
              </div>
            )}

            {/* SUB-TAB 6: REVIEWS MODERATION */}
            {storeSubTab === "reviews" && (
              <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-xs">
                <div className="mb-4">
                  <h3 className="text-lg font-black text-slate-900">
                    {language === "ja"
                      ? "カスタマー商品レビュー承認管理 (Review Manager)"
                      : language === "en"
                        ? "Customer Product Review Moderation"
                        : "কাস্টমার প্রোডাক্ট রিভিউ মডারেশন (Review Manager)"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {language === "ja"
                      ? "読者や受講生から送信されたブックレビューと星評価を確認し、公開を承認します"
                      : language === "en"
                        ? "Review and approve reader & student book reviews and star ratings for public display"
                        : "পাঠক ও শিক্ষার্থীদের পাঠানো বুক রিভিউ এবং স্টার রেটিং যাচাই করে ওয়েবসাইটে প্রকাশের অনুমোদন দিন"}
                  </p>
                </div>
                <ReviewManager initialReviews={adminBundle.reviews} />
              </div>
            )}

            {/* SUB-TAB 7: SUPABASE STORAGE BUCKETS & UPLOADS */}
            {storeSubTab === "uploads" && (
              <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-emerald-600" />
                    <h3 className="font-extrabold text-base text-slate-900">
                      {language === "ja"
                        ? "Supabase ストレージ 書類・メディア管理 (Storage Buckets)"
                        : language === "en"
                          ? "Supabase Storage Documents & Media Manager"
                          : "Supabase Storage ডক ও মিডিয়া ম্যানেজার (Storage Buckets)"}
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-slate-400">knltc-documents & knltc-media</span>
                </div>
                <p className="text-xs text-slate-600 mb-4">
                  {language === "ja"
                    ? "ビザ申請者のパスポートコピー、学歴証明書、書籍カバーやバナー画像をSupabaseクラウドストレージに直接アップロードします:"
                    : language === "en"
                      ? "Upload visa applicant passport copies, academic certificates, and book covers or banner images directly to Supabase Cloud Storage:"
                      : "ভিসা প্রার্থীদের পাসপোর্ট কপি, অ্যাকাডেমিক সনদপত্র এবং বই বা ওয়েবসাইটের ব্যানার ছবি সরাসরি Supabase ক্লাউড স্টোরেজে আপলোড করুন:"}
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-dashed border-stone-300 p-5 bg-stone-50/60 flex flex-col items-center justify-center text-center">
                    <FileCheck2 className="h-8 w-8 text-emerald-600 mb-2" />
                    <h4 className="text-xs font-bold text-slate-900">
                      {language === "ja"
                        ? "ビザ申請書類 (knltc-documents)"
                        : language === "en"
                          ? "Visa File Documents (knltc-documents)"
                          : "ভিসা ফাইল ডকুমেন্ট (knltc-documents)"}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-1 mb-3">
                      {language === "ja"
                        ? "PDF, DOC, スキャンコピー (最大15MB)"
                        : language === "en"
                          ? "PDF, DOC, Scanned Copies (Max 15MB)"
                          : "PDF, DOC, স্ক্যান কপি (সর্বোচ্চ ১৫ মেগাবাইট)"}
                    </p>
                    <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-1.5 text-xs font-bold transition shadow-xs">
                      <span>
                        {language === "ja"
                          ? "書類ファイルを選択"
                          : language === "en"
                            ? "Select Document File"
                            : "ডকুমেন্ট ফাইল নির্বাচন করুন"}
                      </span>
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
                          showToast(
                            language === "ja"
                              ? "書類をアップロード中..."
                              : language === "en"
                                ? "Uploading document..."
                                : "ডকুমেন্ট আপলোড হচ্ছে...",
                          );
                          try {
                            const res = await fetch("/api/cms/documents", { method: "POST", body: fd });
                            const json = await res.json();
                            if (json.ok) {
                              showToast(
                                language === "ja"
                                  ? `アップロード完了: ${json.url}`
                                  : language === "en"
                                    ? `Upload complete! URL: ${json.url}`
                                    : `আপলোড সফল! ফাইলের লিঙ্ক: ${json.url}`,
                              );
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

                  <div className="rounded-xl border border-dashed border-stone-300 p-5 bg-stone-50/60 flex flex-col items-center justify-center text-center">
                    <ShoppingBag className="h-8 w-8 text-indigo-600 mb-2" />
                    <h4 className="text-xs font-bold text-slate-900">
                      {language === "ja"
                        ? "書籍カバー・バナー画像 (knltc-media)"
                        : language === "en"
                          ? "Book Covers & Banner Images (knltc-media)"
                          : "বইয়ের কভার ও ব্যানার ছবি (knltc-media)"}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-1 mb-3">
                      {language === "ja"
                        ? "JPG, PNG, WEBP (最大5MB)"
                        : language === "en"
                          ? "JPG, PNG, WEBP (Max 5MB)"
                          : "JPG, PNG, WEBP (সর্বোচ্চ ৫ মেগাবাইট)"}
                    </p>
                    <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg bg-indigo-700 hover:bg-indigo-800 text-white px-3.5 py-1.5 text-xs font-bold transition shadow-xs">
                      <span>
                        {language === "ja"
                          ? "画像ファイルを選択"
                          : language === "en"
                            ? "Select Image File"
                            : "ছবি ফাইল নির্বাচন করুন"}
                      </span>
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
                          showToast(
                            language === "ja"
                              ? "画像をアップロード中..."
                              : language === "en"
                                ? "Uploading image..."
                                : "ছবি আপলোড হচ্ছে...",
                          );
                          try {
                            const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
                            const json = await res.json();
                            if (json.url) {
                              showToast(
                                language === "ja"
                                  ? `画像アップロード完了: ${json.url}`
                                  : language === "en"
                                    ? `Image uploaded! URL: ${json.url}`
                                    : `ছবি আপলোড সফল! লিঙ্ক: ${json.url}`,
                              );
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
            MODULE 10: ENROLLED LEAD / STUDENT PERSONAL PROFILE & FILE VIEW
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
            MODULE 11: MAIN ADMIN USER ROLES, CREDENTIALS & ACCESS CONTROL PANEL
            ========================================================================= */}
        {activeTab === "users" && (
          <UserAccessControlPanel
            onNotify={(msg) => {
              setStore({ ...getCmsStore() });
              showToast(msg);
            }}
          />
        )}

        {/* Individual Lead Profile & Login Access Provisioning Modal */}
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
  );
}
