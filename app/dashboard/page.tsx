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
  type MasterKnlTcStore,
  type UserRole,
  type BranchCode,
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

export default function DashboardPage() {
  const { language, setLanguage } = useLanguage();
  const [store, setStore] = useState<MasterKnlTcStore | null>(null);
  const [currentUser, setCurrentUser] = useState<{
    email: string;
    role: UserRole;
    name: string;
    branch: BranchCode;
  } | null>(null);
  const [activeRole, setActiveRole] = useState<UserRole>("MAIN_ADMIN");
  const [activeBranch, setActiveBranch] = useState<BranchCode>("ALL");
  const [isSyncingWithDb, setIsSyncingWithDb] = useState(false);
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "crm"
    | "visa"
    | "lms"
    | "b2b"
    | "finance"
    | "hr"
    | "cms"
    | "store_blog"
  >("overview");

  // Multi-language translation dictionary for the dashboard
  const t: DashboardDictionary = useMemo(() => getDashboardDictionary(language), [language]);

  // Notifications / feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Synchronize state with store, load user session & handle storage events
  useEffect(() => {
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
          setCurrentUser(data.user);
          setActiveRole(data.user.role);
          if (data.user.branch && data.user.branch !== "ALL") {
            setActiveBranch(data.user.branch);
          }
          if (data.user.role === "STUDENT") {
            setActiveTab("visa");
          } else if (data.user.role === "TELE_COUNSELOR") {
            setActiveTab("crm");
          } else if (data.user.role === "TEACHER") {
            setActiveTab("lms");
          }
        }
      })
      .catch(() => {});

    // 2. Fetch live store from Supabase server
    setIsSyncingWithDb(true);
    fetchLiveStoreFromServer()
      .then((live) => {
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
    showToast("Supabase ডাটাবেজের সাথে সিঙ্ক হচ্ছে...");
    try {
      const live = await fetchLiveStoreFromServer();
      if (live) setStore({ ...live });
      showToast("ডাটাবেজ সিঙ্ক সফল হয়েছে! (Database Synced)");
    } catch {
      showToast("সিঙ্কে সমস্যা হয়েছে, লোকাল ক্যাশ ব্যবহার করা হচ্ছে।");
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

              {/* 7-Role View Switcher or Locked Role Badge */}
              {(!currentUser || currentUser.role === "MAIN_ADMIN") ? (
                <div className="flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white px-3 py-1.5 shadow-xs">
                  <ShieldCheck className="h-4 w-4 text-[#b91c1c]" />
                  <span className="text-xs font-bold text-slate-500">{t.viewRoleLabel}</span>
                  <select
                    value={activeRole}
                    onChange={(e) => {
                      const nextRole = e.target.value as UserRole;
                      setActiveRole(nextRole);
                      if (nextRole === "STUDENT") setActiveTab("visa");
                      else if (nextRole === "TELE_COUNSELOR") setActiveTab("crm");
                      else if (nextRole === "TEACHER") setActiveTab("lms");
                    }}
                    className="rounded bg-transparent text-xs font-bold text-slate-900 focus:outline-hidden cursor-pointer"
                  >
                    <option value="MAIN_ADMIN">{t.roles.mainAdmin}</option>
                    <option value="BRANCH_ADMIN">{t.roles.branchAdmin}</option>
                    <option value="TELE_COUNSELOR">{t.roles.teleCounselor}</option>
                    <option value="TEACHER">{t.roles.teacher}</option>
                    <option value="B2B_AGENT">{t.roles.b2bAgent}</option>
                    <option value="INVESTOR">{t.roles.investor}</option>
                    <option value="STUDENT">{t.roles.student}</option>
                  </select>
                </div>
              ) : (
                <div className="flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-100 px-3 py-1.5 text-xs font-bold text-slate-800">
                  <Lock className="h-3.5 w-3.5 text-amber-600" />
                  <span>{currentUser.name}</span>
                </div>
              )}

              {/* Database Sync Button */}
              <button
                onClick={handleManualSync}
                disabled={isSyncingWithDb}
                className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 transition shadow-2xs"
                title="Supabase ডাটাবেজের সাথে সিঙ্ক করুন"
              >
                <Database className={`h-3.5 w-3.5 text-emerald-600 ${isSyncingWithDb ? "animate-spin" : ""}`} />
                <span className="hidden lg:inline">{isSyncingWithDb ? "সিঙ্ক হচ্ছে..." : "Supabase সিঙ্ক"}</span>
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
                title="লগআউট (Logout)"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">লগআউট</span>
              </button>
            </div>
          </div>

          {/* Module Navigation Tabs (Filtered by Active Role) */}
          <nav className="mt-4 flex space-x-1 overflow-x-auto border-t border-stone-100 pt-2 no-scrollbar">
            {[
              { id: "overview", label: t.tabs.overview, icon: TrendingUp },
              { id: "crm", label: t.tabs.crm, icon: PhoneCall },
              { id: "visa", label: t.tabs.visa, icon: FileCheck2 },
              { id: "lms", label: t.tabs.lms, icon: GraduationCap },
              { id: "b2b", label: t.tabs.b2b, icon: Building2 },
              { id: "finance", label: t.tabs.finance, icon: DollarSign },
              { id: "hr", label: t.tabs.hr, icon: UserCheck },
              { id: "cms", label: t.tabs.cms, icon: Globe2 },
              { id: "store_blog", label: "বই স্টোর ও ব্লগ সিএমএস", icon: ShoppingBag },
            ]
              .filter((tab) => {
                if (activeRole === "STUDENT") return tab.id === "visa" || tab.id === "lms";
                if (activeRole === "TELE_COUNSELOR") return ["overview", "crm", "visa", "lms"].includes(tab.id);
                if (activeRole === "TEACHER") return ["overview", "lms", "visa"].includes(tab.id);
                if (activeRole === "B2B_AGENT") return ["overview", "b2b", "visa"].includes(tab.id);
                if (activeRole === "INVESTOR") return ["overview", "finance", "b2b"].includes(tab.id);
                return true;
              })
              .map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3.5 py-2 text-xs font-bold transition ${
                      isActive
                        ? "bg-[#133e29] text-white shadow-xs"
                        : "text-slate-600 hover:bg-stone-100 hover:text-slate-900"
                    }`}
                  >
                    <Icon className={`h-3.5 w-3.5 ${isActive ? "text-emerald-400" : "text-slate-400"}`} />
                    <span>{tab.label}</span>
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
                            <p className="font-extrabold text-slate-900 text-sm">{lead.name}</p>
                            <p className="text-slate-500 font-mono mt-0.5">{lead.phone}</p>
                            <span className="inline-block mt-1 text-[10px] text-slate-400">{t.crm.cityLabel}: {lead.city}</span>
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
                            <a
                              href={waLink}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition shadow-xs"
                            >
                              <Send className="h-3.5 w-3.5" />
                              <span>WhatsApp</span>
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
            MODULE 9: UNIFIED BOOK STORE & BLOG CMS COMMAND CENTER
            ========================================================================= */}
        {activeTab === "store_blog" && (
          <div className="space-y-6 animate-fade-in">
            {/* Header info */}
            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-indigo-100 px-2 py-0.5 text-xs font-bold text-indigo-800">
                      E-COMMERCE & BLOG
                    </span>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">
                      বই স্টোর, ইনভেন্টরি, অর্ডার ও ব্লগ সিএমএস
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    জাপানি ভাষার পাঠ্যবই, কানজি ফ্ল্যাশকার্ড, ভিজিটর্স রিভিউ এবং জাপান স্টাডি/ভিসা গাইডলাইন ব্লগ পরিচালনা
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href="/store"
                    target="_blank"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-stone-100 transition"
                  >
                    <span>লাইভ স্টোর দেখুন</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                  <Link
                    href="/admin/products"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#b91c1c] px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-red-800 transition"
                  >
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span>নতুন বই যোগ করুন</span>
                  </Link>
                </div>
              </div>

              {/* 4 Quick Control Navigation Cards */}
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Link
                  href="/admin/products"
                  className="rounded-xl border border-stone-200 bg-stone-50/60 p-4 hover:border-indigo-400 hover:bg-white transition group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase">বই ও পণ্য সম্ভার</span>
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 group-hover:scale-105 transition">
                      <BookOpen className="h-4 w-4" />
                    </div>
                  </div>
                  <p className="mt-2 text-2xl font-black text-slate-900">৪টি বই</p>
                  <p className="text-[11px] text-slate-500 mt-1">মূল্য ও স্টক এডিট করুন &rarr;</p>
                </Link>

                <Link
                  href="/admin/orders"
                  className="rounded-xl border border-stone-200 bg-stone-50/60 p-4 hover:border-emerald-400 hover:bg-white transition group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase">অনলাইন বুক অর্ডার</span>
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 group-hover:scale-105 transition">
                      <ShoppingBag className="h-4 w-4" />
                    </div>
                  </div>
                  <p className="mt-2 text-2xl font-black text-emerald-700">{cms.customerOrders.length}টি অর্ডার</p>
                  <p className="text-[11px] text-slate-500 mt-1">ডেলিভারি ট্র্যাকিং ও ক্যাশ অন ডেলিভারি &rarr;</p>
                </Link>

                <Link
                  href="/admin/blog"
                  className="rounded-xl border border-stone-200 bg-stone-50/60 p-4 hover:border-amber-400 hover:bg-white transition group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase">ব্লগ ও গাইডলাইন</span>
                    <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 group-hover:scale-105 transition">
                      <FileText className="h-4 w-4" />
                    </div>
                  </div>
                  <p className="mt-2 text-2xl font-black text-slate-900">৩টি পোস্ট</p>
                  <p className="text-[11px] text-slate-500 mt-1">নতুন আর্টিকেল লিখুন ও প্রকাশ করুন &rarr;</p>
                </Link>

                <Link
                  href="/admin/reviews"
                  className="rounded-xl border border-stone-200 bg-stone-50/60 p-4 hover:border-purple-400 hover:bg-white transition group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase">কাস্টমার রিভিউ</span>
                    <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700 group-hover:scale-105 transition">
                      <Award className="h-4 w-4" />
                    </div>
                  </div>
                  <p className="mt-2 text-2xl font-black text-purple-700">২টি রিভিউ</p>
                  <p className="text-[11px] text-slate-500 mt-1">স্টার রেটিং ও মতামত মডারেশন &rarr;</p>
                </Link>
              </div>
            </div>

            {/* Supabase Storage Media & Document Uploader Tool */}
            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-emerald-600" />
                  <h3 className="font-extrabold text-base text-slate-900">
                    Supabase Storage ডক ও মিডিয়া ম্যানেজার (Storage Buckets)
                  </h3>
                </div>
                <span className="text-xs font-mono text-slate-400">knltc-documents & knltc-media</span>
              </div>
              <p className="text-xs text-slate-600 mb-4">
                ভিসা প্রার্থীদের পাসপোর্ট কপি, অ্যাকাডেমিক সনদপত্র এবং বই বা ওয়েবসাইটের ব্যানার ছবি সরাসরি Supabase ক্লাউড স্টোরেজে আপলোড করুন:
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-dashed border-stone-300 p-5 bg-stone-50/60 flex flex-col items-center justify-center text-center">
                  <FileCheck2 className="h-8 w-8 text-emerald-600 mb-2" />
                  <h4 className="text-xs font-bold text-slate-900">ভিসা ফাইল ডকুমেন্ট (knltc-documents)</h4>
                  <p className="text-[11px] text-slate-500 mt-1 mb-3">PDF, DOC, স্ক্যান কপি (সর্বোচ্চ ১৫ মেগাবাইট)</p>
                  <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-1.5 text-xs font-bold transition shadow-xs">
                    <span>ডকুমেন্ট ফাইল নির্বাচন করুন</span>
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
                        showToast("ডকুমেন্ট আপলোড হচ্ছে...");
                        try {
                          const res = await fetch("/api/cms/documents", { method: "POST", body: fd });
                          const json = await res.json();
                          if (json.ok) {
                            showToast(`আপলোড সফল! ফাইলের লিঙ্ক: ${json.url}`);
                          } else {
                            showToast(json.error || "আপলোড ব্যর্থ হয়েছে");
                          }
                        } catch {
                          showToast("আপলোড সংযোগে ত্রুটি");
                        }
                      }}
                    />
                  </label>
                </div>

                <div className="rounded-xl border border-dashed border-stone-300 p-5 bg-stone-50/60 flex flex-col items-center justify-center text-center">
                  <ShoppingBag className="h-8 w-8 text-indigo-600 mb-2" />
                  <h4 className="text-xs font-bold text-slate-900">বইয়ের কভার ও ব্যানার ছবি (knltc-media)</h4>
                  <p className="text-[11px] text-slate-500 mt-1 mb-3">JPG, PNG, WEBP (সর্বোচ্চ ৫ মেগাবাইট)</p>
                  <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg bg-indigo-700 hover:bg-indigo-800 text-white px-3.5 py-1.5 text-xs font-bold transition shadow-xs">
                    <span>ছবি ফাইল নির্বাচন করুন</span>
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
                        showToast("ছবি আপলোড হচ্ছে...");
                        try {
                          const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
                          const json = await res.json();
                          if (json.url) {
                            showToast(`ছবি আপলোড সফল! লিঙ্ক: ${json.url}`);
                          } else {
                            showToast(json.error || "আপলোড ব্যর্থ হয়েছে");
                          }
                        } catch {
                          showToast("আপলোড সংযোগে ত্রুটি");
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
