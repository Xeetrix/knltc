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
} from "lucide-react";
import {
  getCmsStore,
  saveCmsStore,
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

export default function DashboardPage() {
  const [store, setStore] = useState<MasterKnlTcStore | null>(null);
  const [activeRole, setActiveRole] = useState<UserRole>("MAIN_ADMIN");
  const [activeBranch, setActiveBranch] = useState<BranchCode>("ALL");
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "crm"
    | "visa"
    | "lms"
    | "b2b"
    | "finance"
    | "hr"
    | "cms"
  >("overview");

  // Notifications / feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Synchronize state with store & handle storage events
  useEffect(() => {
    const sync = () => {
      setStore({ ...getCmsStore() });
    };
    sync();

    window.addEventListener("knltc-cms-updated", sync);
    return () => window.removeEventListener("knltc-cms-updated", sync);
  }, []);

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
        <span className="font-medium text-lg leading-relaxed">KNLTC কমান্ড সেন্টার লোড হচ্ছে...</span>
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
            <span>KNLTC সেন্ট্রাল এডুকেশন ও ক্যারিয়ার কমান্ড সেন্টার (ঢাকা ও খুলনা)</span>
            <span className="hidden md:inline text-emerald-200">|</span>
            <span className="hidden md:inline text-emerald-200">এমডি: শেখ বাসেত • প্রধান সেন্সি: আমির হোসেন</span>
          </div>
          <div className="flex items-center gap-4 text-emerald-100">
            <span>হটলাইন: +880 1805 013633</span>
            <a
              href="https://npw.bd/knltc"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded bg-emerald-700 px-2.5 py-0.5 font-bold text-white hover:bg-emerald-600 transition"
            >
              LMS পোর্টাল <ExternalLink className="h-3 w-3" />
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

            {/* Controls: Branch Switcher & 7-Role Switcher */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Branch Switcher */}
              <div className="flex items-center rounded-xl bg-stone-100 p-1 border border-stone-200">
                <span className="px-2 text-xs font-semibold text-slate-500">শাখা:</span>
                <button
                  onClick={() => setActiveBranch("ALL")}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                    activeBranch === "ALL"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  সব শাখা
                </button>
                <button
                  onClick={() => setActiveBranch("DHK-HQ")}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                    activeBranch === "DHK-HQ"
                      ? "bg-white text-[#b91c1c] shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  ঢাকা হেড অফিস
                </button>
                <button
                  onClick={() => setActiveBranch("KHULNA-01")}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                    activeBranch === "KHULNA-01"
                      ? "bg-white text-emerald-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  খুলনা শাখা
                </button>
              </div>

              {/* 7-Role View Switcher */}
              <div className="flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white px-3 py-1.5 shadow-xs">
                <ShieldCheck className="h-4 w-4 text-[#b91c1c]" />
                <span className="text-xs font-bold text-slate-500">ভিউ মোড:</span>
                <select
                  value={activeRole}
                  onChange={(e) => setActiveRole(e.target.value as UserRole)}
                  className="rounded bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
                >
                  <option value="MAIN_ADMIN">👑 ১. মেইন এডমিন (শেখ বাসেত)</option>
                  <option value="BRANCH_ADMIN">🏢 ২. ব্রাঞ্চ এডমিন (ঢাকা/খুলনা)</option>
                  <option value="TELE_COUNSELOR">📞 ৩. টেলি-কাউন্সেলর (রিমোট)</option>
                  <option value="TEACHER">🎓 ৪. শিক্ষক / সেন্সি (আমির হোসেন)</option>
                  <option value="B2B_AGENT">🤝 ৫. বিটুবি এজেন্ট (Nexus / BWBS)</option>
                  <option value="INVESTOR">💼 ৬. ইনভেস্টর পোর্টাল (Open-Book)</option>
                  <option value="STUDENT">🎒 ৭. শিক্ষার্থী ও ভিসা ট্র্যাকার</option>
                </select>
              </div>

              <Link
                href="/"
                className="inline-flex items-center gap-1 rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-stone-50 transition"
              >
                <span>পাবলিক ওয়েবসাইট</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Module Navigation Tabs */}
          <nav className="mt-4 flex space-x-1 overflow-x-auto border-t border-stone-100 pt-2 no-scrollbar">
            {[
              { id: "overview", label: "১. এক্সিকিউটিভ ওভারভিউ", icon: TrendingUp },
              { id: "crm", label: "২. CRM ও টেলি-কাউন্সেলর", icon: PhoneCall },
              { id: "visa", label: "৩. ১০-ধাপের ভিসা Kanban", icon: FileCheck2 },
              { id: "lms", label: "৪. ভাষা কোর্স ও LMS ব্রিজ", icon: GraduationCap },
              { id: "b2b", label: "৫. বিটুবি ও জাপানি স্কুল", icon: Building2 },
              { id: "finance", label: "৬. ফাইন্যান্স ও ইনভেস্টর", icon: DollarSign },
              { id: "hr", label: "৭. HR ও কাউন্সেলর পে-রোল", icon: UserCheck },
              { id: "cms", label: "৮. ১০০% ওয়েবসাইট সিএমএস", icon: Globe2 },
            ].map((tab) => {
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
                    <span>লাইভ কমান্ড হাব • {activeBranch === "ALL" ? "ঢাকা ও খুলনা সমন্বিত" : activeBranch}</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-relaxed">
                    এক্সিকিউটিভ ওভারভিউ ও রিয়েল-টাইম বিজনেস এনালাইটিক্স
                  </h1>
                  <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
                    জাপান স্টুডেন্ট ভিসা, SSW ১৬টি খাত ও ভাষা প্রশিক্ষণ কার্যক্রমের একক সেন্ট্রাল ড্যাশবোর্ড।
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveTab("crm")}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#b91c1c] px-4 py-2.5 text-xs font-bold text-white hover:bg-red-800 transition shadow-xs"
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span>নতুন লিড যুক্ত করুন</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("visa")}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#15803d] px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-800 transition shadow-xs"
                  >
                    <FileCheck2 className="h-4 w-4" />
                    <span>ভিসা পাইপলাইন দেখুন</span>
                  </button>
                </div>
              </div>

              {/* 5 Core Financial & Operational KPI Cards */}
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {/* 1. Total Active Leads */}
                <div className="rounded-2xl border border-stone-200 bg-[#fcfaf7] p-4">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-xs font-bold">মোট সক্রিয় লিড</span>
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-900">{filteredLeads.length}</span>
                    <span className="text-xs font-semibold text-emerald-600">+১২% আজ</span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">মেটা অ্যাডস ও হোয়াটসঅ্যাপ লিড</p>
                </div>

                {/* 2. Active Language Students */}
                <div className="rounded-2xl border border-stone-200 bg-[#fcfaf7] p-4">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-xs font-bold">চলমান ভাষা শিক্ষার্থী</span>
                    <GraduationCap className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-900">
                      {store.lmsBridges.length + 84}
                    </span>
                    <span className="text-xs font-semibold text-emerald-600">N5, N4 ও Irodori</span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">npw.bd/knltc ও অফলাইন ব্যাচ</p>
                </div>

                {/* 3. In-Process Visa Files */}
                <div className="rounded-2xl border border-stone-200 bg-[#fcfaf7] p-4">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-xs font-bold">চলমান ভিসা প্রসেসিং</span>
                    <FileCheck2 className="h-4 w-4 text-[#b91c1c]" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-900">{filteredVisaApplicants.length}</span>
                    <span className="text-xs font-semibold text-amber-600">এপ্রিল ২০২৭ ইনটেক</span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">HLA Gakuin ও শীর্ষ একাডেমি</p>
                </div>

                {/* 4. Japanese School Commission Projection */}
                <div className="rounded-2xl border border-stone-200 bg-[#fcfaf7] p-4">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-xs font-bold">প্রত্যাশিত স্কুল কমিশন</span>
                    <Building2 className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-900">¥২.৪M</span>
                    <span className="text-xs font-semibold text-indigo-700">~৳১৯.২ লক্ষ</span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">স্টুডেন্ট পিছু ৮০,০০০ ইয়েন</p>
                </div>

                {/* 5. Monthly Cash Flow */}
                <div className="rounded-2xl border border-stone-200 bg-[#fcfaf7] p-4">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-xs font-bold">মাসিক নিট ক্যাশ-ফ্লো</span>
                    <DollarSign className="h-4 w-4 text-emerald-700" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-black text-emerald-800">৳ ৪.৮ লক্ষ</span>
                    <span className="text-xs font-semibold text-emerald-600">পজিটিভ</span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">ভর্তি ফি ও ভিসা সাকসেস মার্জিন</p>
                </div>
              </div>
            </div>

            {/* Middle Section: Visual Revenue Chart & Live Visa Breakdown */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Left 2 Cols: Custom SVG Cash Flow & Revenue Visualizer */}
              <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-xs lg:col-span-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">বাৎসরিক আর্থিক প্রজেকশন বনাম লাইভ পারফরম্যান্স</h2>
                    <p className="text-xs text-slate-500 mt-0.5">রেগুলার (৳১.২ লক্ষ) ও প্রিমিয়াম (৳১১ লক্ষ) প্যাকেজ ভিত্তিক হিসাব</p>
                  </div>
                  <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-slate-700">
                    ২০২৬–২০২৭ অর্থবছর
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
                        { cx: 20, cy: 140, val: "মে (৳৩.৫L)" },
                        { cx: 140, cy: 110, val: "জুন (৳৫L)" },
                        { cx: 260, cy: 80, val: "জুলাই (৳৭.৫L)" },
                        { cx: 380, cy: 50, val: "আগস্ট (৳১০.২L)" },
                        { cx: 500, cy: 35, val: "সেপ্টেম্বর (৳১২.৪L)" },
                        { cx: 580, cy: 25, val: "অক্টোবর (৳১৫L)" },
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
                    <span>মে ২০২৬ (ভিত্তি সেশন)</span>
                    <span>জুলাই ইনটেক ডেলিভারি</span>
                    <span>অক্টোবর ইনটেক বৃদ্ধি</span>
                    <span>জানুয়ারি ২০২৭ লক্ষ্যমাত্রা</span>
                  </div>
                </div>

                {/* 3 Key Financial Highlights */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="rounded-xl border border-stone-200 bg-white p-3">
                    <span className="text-slate-500">মোট গ্রস রেভিনিউ প্রজেকশন</span>
                    <p className="text-base font-extrabold text-slate-900 mt-1">৳ ৪৮,০০,০০০</p>
                    <span className="text-[11px] text-emerald-700">৩০-৪০টি ভিসা ফাইল সাকসেস</span>
                  </div>
                  <div className="rounded-xl border border-stone-200 bg-white p-3">
                    <span className="text-slate-500">মোট অপারেশনাল খরচ</span>
                    <p className="text-base font-extrabold text-slate-900 mt-1">৳ ১২,০০,০০০</p>
                    <span className="text-[11px] text-slate-500">অফিস রেন্ট, মার্কেটিং ও সেন্সি বেতন</span>
                  </div>
                  <div className="rounded-xl border border-stone-200 bg-emerald-50/50 p-3">
                    <span className="text-emerald-800 font-semibold">প্রত্যাশিত নিট মুনাফা</span>
                    <p className="text-base font-black text-emerald-700 mt-1">৳ ৩৬,০০,০০০</p>
                    <span className="text-[11px] text-emerald-800">১০% ইনভেস্টর শেয়ার: ৳৩.৬ লক্ষ</span>
                  </div>
                </div>
              </div>

              {/* Right Col: Quick Intake & SSW Special Campaign Status */}
              <div className="space-y-4">
                {/* Active Campaign Box */}
                <div className="rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-xs">
                  <div className="flex items-center gap-2">
                    <span className="flex h-3 w-3 rounded-full bg-emerald-600 animate-ping" />
                    <span className="text-xs font-black uppercase text-emerald-800">স্পেশাল রিক্রুটমেন্ট ক্যাম্পেইন</span>
                  </div>
                  <h3 className="text-base font-black text-slate-900 mt-2 leading-tight">
                    SSW কনস্ট্রাকশন স্পেশাল ব্যাচ (JLPT N4 পাস)
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    যারা N4 পাস করেছেন, ঢাকায় KNLTC সেন্টারে সম্পূর্ণ বিনামূল্যে থাকা-খাওয়া ও প্র্যাকটিক্যাল স্কিল টেস্ট প্রস্তুতি।
                  </p>
                  <div className="mt-3 rounded-xl bg-white p-3 border border-emerald-200 text-xs">
                    <div className="flex justify-between font-bold">
                      <span>আসন সংখ্যা: ২৫ জন</span>
                      <span className="text-emerald-700">ভর্তি: ১৮ জন</span>
                    </div>
                    <div className="w-full bg-stone-200 rounded-full h-2 mt-2">
                      <div className="bg-emerald-600 h-2 rounded-full" style={{ width: "72%" }}></div>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab("crm")}
                    className="mt-3.5 w-full rounded-xl bg-[#15803d] py-2 text-xs font-bold text-white hover:bg-emerald-800 transition"
                  >
                    ক্যাম্পেইন লিড প্রসেস করুন
                  </button>
                </div>

                {/* HLA Gakuin Partner Quick Status */}
                <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">জাপানি পার্টনার স্কুল</span>
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-800">
                      হিরোশিমা
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-1">HLA Gakuin (Hiroshima)</h3>
                  <p className="text-xs text-slate-500 mt-0.5">প্রিন্সিপাল ফুজিই কেইকো ও দোনাকা-সান</p>
                  <div className="mt-3 flex items-center justify-between text-xs border-t border-stone-100 pt-2 font-semibold">
                    <span>চলমান ফাইল: ১৮ জন</span>
                    <span className="text-emerald-700">কমিশন: ¥১,৪৪০,০০০</span>
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
                    ওমনি-চ্যানেল CRM ও টেলি-কাউন্সেলর ড্যাশবোর্ড
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    ফেসবুক মেটা অ্যাডস, হোয়াটসঅ্যাপ চ্যাট ও ওয়েবসাইট ফর্ম থেকে আসা প্রার্থীদের কল রেকর্ড ও ফলো-আপ।
                  </p>
                </div>
                {/* 1-Click New Lead Quick Insert Modal / Form */}
                <button
                  onClick={() => {
                    const name = prompt("প্রার্থীর নাম লিখুন:");
                    if (!name) return;
                    const phone = prompt("ফোন নম্বর লিখুন (e.g. 017...):", "017");
                    if (!phone) return;
                    addCrmLead({
                      name,
                      phone,
                      whatsapp: phone.startsWith("+88") ? phone : `+88${phone}`,
                      city: "ঢাকা",
                      source: "WHATSAPP_DIRECT",
                      interest: "STUDENT_VISA_REGULAR",
                      status: "NEW",
                      education: "HSC Passed",
                      japaneseProficiency: "LEARNING_N5",
                      studyGapYears: 1,
                      assignedTo: "সুমাইয়া সুলতানা (টেলি-কাউন্সেলর)",
                      branch: activeBranch === "KHULNA-01" ? "KHULNA-01" : "DHK-HQ",
                      notes: "নতুন ইনকোয়ারি এসেছে। অবিলম্বে কাউন্সেলিং প্রয়োজন।",
                      followUpDate: new Date().toISOString().slice(0, 10),
                    });
                    showToast("নতুন লিড সফলভাবে যুক্ত হয়েছে!");
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#b91c1c] px-4 py-2.5 text-xs font-bold text-white hover:bg-red-800 transition shadow-xs"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>দ্রুত নতুন লিড যোগ করুন</span>
                </button>
              </div>

              {/* CRM Lead Table */}
              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-stone-200 bg-stone-50 font-bold text-slate-700">
                    <tr>
                      <th className="p-3">প্রার্থীর নাম ও যোগাযোগ</th>
                      <th className="p-3">উৎস ও আগ্রহ</th>
                      <th className="p-3">শিক্ষাগত যোগ্যতা ও জাপানি স্তর</th>
                      <th className="p-3">কাউন্সেলর ও ব্রাঞ্চ</th>
                      <th className="p-3">বর্তমান স্ট্যাটাস</th>
                      <th className="p-3 text-right">হোয়াটসঅ্যাপ ও অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredLeads.map((lead) => {
                      const waText = encodeURIComponent(
                        `আসসালামু আলাইকুম ${lead.name}। KNLTC (জাপান গেটওয়ে ঢাকা ও খুলনা) থেকে যোগাযোগ করা হচ্ছে। আপনার আবেদন ও কাউন্সেলিং বিষয়ে কথা বলতে চাই।`
                      );
                      const waLink = `https://wa.me/${lead.whatsapp.replace(/[^0-9]/g, "")}?text=${waText}`;

                      return (
                        <tr key={lead.id} className="hover:bg-stone-50/80 transition">
                          <td className="p-3">
                            <p className="font-extrabold text-slate-900 text-sm">{lead.name}</p>
                            <p className="text-slate-500 font-mono mt-0.5">{lead.phone}</p>
                            <span className="inline-block mt-1 text-[10px] text-slate-400">শহর: {lead.city}</span>
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
                            <p className="text-[10px] text-slate-400">গ্যাপ: {lead.studyGapYears} বছর</p>
                          </td>
                          <td className="p-3">
                            <p className="font-semibold text-slate-700">{lead.assignedTo}</p>
                            <span className="inline-block mt-0.5 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                              {lead.branch === "DHK-HQ" ? "ঢাকা হেড অফিস" : "খুলনা শাখা"}
                            </span>
                          </td>
                          <td className="p-3">
                            <select
                              value={lead.status}
                              onChange={(e) => {
                                updateCrmLeadStatus(lead.id, e.target.value as LeadStatus);
                                showToast(`স্ট্যাটাস আপডেট: ${e.target.value}`);
                              }}
                              className="rounded-lg border border-stone-300 bg-white px-2 py-1 text-xs font-bold text-slate-800 shadow-xs focus:ring-1 focus:ring-emerald-500"
                            >
                              <option value="NEW">নতুন লিড</option>
                              <option value="CONTACTED">কল সম্পন্ন</option>
                              <option value="COUNSELED">কাউন্সেল্ড</option>
                              <option value="OFFICE_VISIT_BOOKED">অফিস ভিজিট বুকড</option>
                              <option value="ADMITTED">ভর্তি নিশ্চিত</option>
                              <option value="ARCHIVED">বাতিল / ফলো-আপ বন্ধ</option>
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
                  <h3 className="text-base font-extrabold text-slate-900">অটোমেটেড যোগ্যতা যাচাই ইঞ্জিন</h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">জাপান ইমিগ্রেশন ও মিনিস্ট্রি অফ জাস্টিস মানদণ্ড</p>

                <div className="mt-4 space-y-3 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700">সর্বনিম্ন এসএসসি/এইচএসসি জিপিএ:</label>
                    <input
                      type="number"
                      step="0.1"
                      defaultValue="2.5"
                      className="mt-1 w-full rounded-lg border border-stone-300 p-2 font-bold"
                    />
                    <span className="text-[10px] text-slate-500">ন্যূনতম ২.৫০ আবশ্যক</span>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700">প্রার্থীর বয়স (সর্বোচ্চ ৩০ বছর):</label>
                    <input
                      type="number"
                      defaultValue="24"
                      className="mt-1 w-full rounded-lg border border-stone-300 p-2 font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700">স্টাডি গ্যাপ (সর্বোচ্চ ৫-৬ বছর):</label>
                    <input
                      type="number"
                      defaultValue="2"
                      className="mt-1 w-full rounded-lg border border-stone-300 p-2 font-bold"
                    />
                  </div>
                  <div className="rounded-xl bg-emerald-50 p-3 border border-emerald-200 text-emerald-900">
                    <p className="font-extrabold text-sm flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span>১০০% যোগ্য প্রার্থী (IELTS প্রয়োজন নেই)</span>
                    </p>
                    <p className="text-[11px] mt-1 text-emerald-800 leading-relaxed">
                      N5 দক্ষতা সম্পন্ন হলে সরাসরি স্কুল নির্বাচন ও আবেদন সম্পন্ন করা যাবে।
                    </p>
                  </div>
                </div>
              </div>

              {/* Nexus Standard Sponsor & Bank Solvency Checklist */}
              <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-xs lg:col-span-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">নেক্সাস স্ট্যান্ডার্ড স্পন্সর ও ব্যাংক গাইডলাইন</h3>
                    <p className="text-xs text-slate-500 mt-0.5">মিনিস্ট্রি অফ জাস্টিস রিকোয়ারমেন্ট</p>
                  </div>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                    ব্যাংক লোন সাপোর্ট সহায়ক
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs leading-relaxed">
                  <div className="rounded-2xl border border-stone-200 p-3.5 bg-[#fcfaf7]">
                    <p className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Check className="h-4 w-4 text-emerald-600" />
                      <span>অনুমোদিত স্পন্সর ক্যাটাগরি:</span>
                    </p>
                    <p className="mt-1 text-slate-600">বাবা, মা অথবা বড় ভাই/বোন (যেকোনো ১ জন বৈধ স্পন্সর)।</p>
                    <p className="mt-2 font-bold text-slate-900">স্পন্সরের ২টি ভিন্ন ফোন নম্বর আবশ্যক</p>
                    <p className="text-slate-500 text-[11px]">জাপান ইমিগ্রেশন থেকে কল ভেরিফিকেশনের জন্য।</p>
                  </div>

                  <div className="rounded-2xl border border-stone-200 p-3.5 bg-[#fcfaf7]">
                    <p className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Check className="h-4 w-4 text-emerald-600" />
                      <span>১৮ লক্ষ টাকার ব্যাংক সলভেন্সি:</span>
                    </p>
                    <p className="mt-1 text-slate-600">বিগত ১ বছরের ব্যালেন্স ও ৩ বছরের ইনকাম ট্যাক্স রিটার্ন ফাইল।</p>
                    <p className="mt-2 font-bold text-slate-900 text-emerald-800">সহায়ক অনুমোদিত ব্যাংকসমূহ:</p>
                    <p className="text-slate-600 text-[11px]">অগ্রণী ব্যাংক, সোস্যাল ইসলামী ব্যাংক, পূবালী ব্যাংক ও জনতা ব্যাংক।</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 10-Step Visa Kanban Board */}
            <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">
                    ১০-ধাপের ফুল-স্ট্যাক ভিসা Kanban পাইপলাইন
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    ফাইল ওপেনিং (৳০ অগ্রিম) থেকে শুরু করে প্রি-ভিসা (COE), এম্বাসি ও জাপানে অবতরণ পর্যন্ত।
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span>সরাসরি স্টেজ ড্র্যাগ ও নেক্সট স্টেজ প্রমোশন সক্রিয়</span>
                </div>
              </div>

              {/* Kanban Grid (10 Stages horizontally scrollable) */}
              <div className="mt-6 flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                {[
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
                ].map((col) => {
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
                                {app.packageType === "PREMIUM" ? "প্রিমিয়াম" : "রেগুলার"}
                              </span>
                            </div>
                            <p className="font-bold text-xs text-slate-900 mt-1">{app.name}</p>
                            <p className="text-[11px] text-slate-500">{app.targetSchool}</p>
                            <p className="text-[10px] text-emerald-700 font-semibold mt-1">
                              সেশন: {app.intakeSession}
                            </p>

                            <div className="mt-2.5 flex items-center justify-between border-t border-stone-100 pt-2">
                              <span className="text-[10px] text-slate-400">
                                স্পন্সর: {app.sponsorName || "যাচাইাধীন"}
                              </span>
                              {col.stage < 10 && (
                                <button
                                  onClick={() => {
                                    updateVisaStage(app.id, (col.stage + 1) as VisaStage);
                                    showToast(`${app.name}-কে পরবর্তী ধাপে পাঠানো হয়েছে!`);
                                  }}
                                  className="inline-flex items-center gap-1 rounded bg-stone-900 px-2 py-1 text-[10px] font-bold text-white hover:bg-emerald-700 transition"
                                >
                                  <span>পরবর্তী ধাপ</span>
                                  <ChevronRight className="h-3 w-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}

                        {applicantsInStage.length === 0 && (
                          <div className="rounded-xl border border-dashed border-stone-300 p-4 text-center text-[11px] text-slate-400">
                            কোনো প্রার্থী নেই
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
                    ভাষা কোর্স ও এক্সটার্নাল LMS (npw.bd/knltc) ব্রিজ
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    N5, N4 ও Irodori ভর্তি নিশ্চিতকরণ, ইউজারনেম পাসওয়ার্ড ডেলিভারি ও শিক্ষক লেসন জেনারেটর।
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href="https://npw.bd/knltc"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#133e29] px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-900 transition"
                  >
                    <span>NPW LMS ক্লাসরুম</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href="https://npw.bd/irodori/index.html"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-800 hover:bg-stone-50 transition"
                  >
                    <span>Irodori পোর্টাল</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>

              {/* Economics Breakdown: ৳12,000 fee - ৳2,000 portal fee = ৳10,000 net margin */}
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-stone-200 bg-[#fcfaf7] p-4">
                  <span className="text-xs font-bold text-slate-500">কোর্স ফি (প্রতি শিক্ষার্থী)</span>
                  <p className="text-2xl font-black text-slate-900 mt-1">৳ ১২,০০০</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">৩ মাসের নিবিড় N5 বা N4 কোর্স</p>
                </div>
                <div className="rounded-2xl border border-stone-200 bg-rose-50/50 p-4">
                  <span className="text-xs font-bold text-rose-800">এক্সটার্নাল LMS প্ল্যাটফর্ম ফি</span>
                  <p className="text-2xl font-black text-rose-700 mt-1">৳ ২,০০০</p>
                  <p className="text-[11px] text-rose-800 mt-0.5">npw.bd সার্ভার ও ব্যান্ডউইথ খরচ</p>
                </div>
                <div className="rounded-2xl border border-stone-200 bg-emerald-50/50 p-4">
                  <span className="text-xs font-bold text-emerald-800">KNLTC নিট প্রতিষ্ঠান মার্জিন</span>
                  <p className="text-2xl font-black text-emerald-700 mt-1">৳ ১০,০০০</p>
                  <p className="text-[11px] text-emerald-800 mt-0.5">৮৩.৩% হাই প্রফিট মার্জিন</p>
                </div>
              </div>

              {/* LMS Student Credentials Table & 1-Click WhatsApp Sender */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-extrabold text-sm text-slate-900">
                    ভর্তি হওয়া শিক্ষার্থীদের LMS একাউন্ট ও পাসওয়ার্ড লগ
                  </h3>
                  <button
                    onClick={() => {
                      const name = prompt("শিক্ষার্থীর নাম:");
                      if (!name) return;
                      const phone = prompt("ফোন নম্বর:", "017");
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
                      showToast("LMS একাউন্ট তৈরি ও WhatsApp-এ পাঠানো হয়েছে!");
                    }}
                    className="inline-flex items-center gap-1 rounded-xl bg-stone-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition"
                  >
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span>নতুন LMS একাউন্ট ইস্যু করুন</span>
                  </button>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-stone-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-50 border-b border-stone-200 font-bold text-slate-700">
                      <tr>
                        <th className="p-3">শিক্ষার্থী ও এনরোলমেন্ট</th>
                        <th className="p-3">কোর্স ও ব্যাচ</th>
                        <th className="p-3">LMS ইউজারনেম ও পাসওয়ার্ড</th>
                        <th className="p-3">মার্জিন হিসাব</th>
                        <th className="p-3">অগ্রগতি</th>
                        <th className="p-3 text-right">হোয়াটসঅ্যাপে পাঠান</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {store.lmsBridges.map((lms) => {
                        const msg = encodeURIComponent(
                          `অভিনন্দন ${lms.studentName}!\nKNLTC-র জাপানি ভাষা কোর্সে আপনার এনরোলমেন্ট নম্বর: ${lms.enrollmentNo}।\n\nআপনার অফিসিয়াল ডিজিটাল LMS পোর্টাল অ্যাক্সেস:\nURL: https://npw.bd/knltc\nUsername: ${lms.portalUsername}\nPassword: ${lms.portalPasswordMasked}\n\nযেকোনো সমস্যায় সেন্সি আমির হোসেনের সাথে যোগাযোগ করুন। ধন্যবাদ!`
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
                                {lms.courseLevel} কোর্স
                              </span>
                              <p className="mt-1 text-[11px] text-slate-600">{lms.activeBatch}</p>
                            </td>
                            <td className="p-3">
                              <p className="font-mono font-bold text-slate-800">@{lms.portalUsername}</p>
                              <p className="font-mono text-slate-500 text-[11px]">{lms.portalPasswordMasked}</p>
                            </td>
                            <td className="p-3">
                              <p className="font-bold text-emerald-700">নিট: ৳{lms.netKnlTcMarginBdt}</p>
                              <span className="text-[10px] text-slate-400">পোর্টাল ফি: ৳{lms.portalFeeDeductedBdt}</span>
                            </td>
                            <td className="p-3">
                              <div className="w-24 bg-stone-200 rounded-full h-1.5 mt-1">
                                <div
                                  className="bg-emerald-600 h-1.5 rounded-full"
                                  style={{ width: `${lms.progressPercentage}%` }}
                                ></div>
                              </div>
                              <span className="text-[10px] font-bold text-slate-500 mt-1 inline-block">
                                {lms.progressPercentage}% সম্পন্ন
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
                                <span>১-ক্লিকে পাঠান</span>
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
                    বিটুবি (B2B) চ্যানেল, জাপানি স্কুল ও আন্তর্জাতিক পার্টনার নেটওয়ার্ক
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    হিরোশিমার HLA Gakuin, নেক্সাস গ্রুপ ও গ্লোবাল পার্টনারদের কমিশন লেজার ও রিক্রুটমেন্ট ট্র্যাকিং।
                  </p>
                </div>
                <div className="rounded-2xl bg-indigo-50 px-4 py-2 text-indigo-900 border border-indigo-200 text-xs font-bold">
                  স্টুডেন্ট পিছু কমিশন: ৮০,০০০ ইয়েন (~৬০,০০০–৬৪,০০০ টাকা)
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
                        <span className="text-slate-400">দায়িত্বশীল ব্যক্তিত্ব:</span>
                        <p className="font-bold text-slate-800 mt-0.5">{sch.contactPerson}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">কমিশন রেট:</span>
                        <p className="font-bold text-indigo-700 mt-0.5">¥{sch.commissionPerStudentYen.toLocaleString()} / ছাত্র</p>
                      </div>
                      <div>
                        <span className="text-slate-400">চলমান শিক্ষার্থী:</span>
                        <p className="font-black text-slate-900 text-sm mt-0.5">{sch.activeStudentsCount} জন</p>
                      </div>
                      <div>
                        <span className="text-slate-400">মোট অর্জিত কমিশন:</span>
                        <p className="font-black text-emerald-700 text-sm mt-0.5">¥{sch.totalCommissionReceivedYen.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* B2B Institutional & Local Agent Ledger */}
              <div className="mt-6">
                <h3 className="font-extrabold text-sm text-slate-900 mb-3">
                  নেক্সাস গ্রুপ, BWBS ও ক্যাম্পাস অ্যাম্বাসেডর কমিশন লেজার
                </h3>
                <div className="overflow-x-auto rounded-2xl border border-stone-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-50 border-b border-stone-200 font-bold text-slate-700">
                      <tr>
                        <th className="p-3">এজেন্ট / পার্টনার প্রতিষ্ঠান</th>
                        <th className="p-3">টাইপ ও শহর</th>
                        <th className="p-3">রেফার্ড শিক্ষার্থী</th>
                        <th className="p-3">সফল ভিসা</th>
                        <th className="p-3">চুক্তিভিত্তিক কমিশন</th>
                        <th className="p-3">পরিশোধিত বনাম বকেয়া</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {store.b2bAgents.map((agent) => (
                        <tr key={agent.id} className="hover:bg-stone-50">
                          <td className="p-3">
                            <p className="font-bold text-slate-900">{agent.organizationName}</p>
                            <p className="text-slate-500 text-[11px]">যোগাযোগ: {agent.contactPerson} ({agent.phone})</p>
                          </td>
                          <td className="p-3">
                            <span className="rounded bg-stone-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                              {agent.agentType}
                            </span>
                            <p className="text-[11px] text-slate-500 mt-0.5">{agent.city}</p>
                          </td>
                          <td className="p-3 font-bold text-slate-800">{agent.referredStudentsCount} জন</td>
                          <td className="p-3 font-extrabold text-emerald-700">{agent.successfulVisasCount} জন</td>
                          <td className="p-3 font-bold text-slate-900">৳{agent.agreedCommissionBdt.toLocaleString()} / ভিসা</td>
                          <td className="p-3">
                            <p className="text-emerald-700 font-bold">পেইড: ৳{agent.paidCommissionBdt.toLocaleString()}</p>
                            <p className="text-amber-700 text-[11px] font-semibold">বকেয়া: ৳{agent.pendingCommissionBdt.toLocaleString()}</p>
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
                    <span>১০ লক্ষ টাকার ইনভেস্টর ওপেন-বুক অডিট পোর্টাল (১০০% হালাল লভ্যাংশ মডেল)</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    বিনিয়োগ বণ্টন, সিকিউরিটি গ্যারান্টি ও রিয়েল-টাইম ডিভিডেন্ড ক্যালকুলেটর
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
                    ৩০০ টাকার সরকারি স্ট্যাম্প চুক্তি ও ব্যাংকের সিকিউরিটি চেকের অধীনে ১০% প্রফিট শেয়ারিং হিসাব।
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-500">মূল ক্যাপিটাল বিনিয়োগ:</span>
                  <p className="text-2xl font-black text-slate-900">৳ ১০,০০,০০০</p>
                </div>
              </div>

              {/* 4 Budget Allocation Pillars (30/20/30/20) */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-2xl border border-stone-200 bg-[#fcfaf7] p-4">
                  <span className="text-xs font-bold text-slate-500">১. কোচিং ও ল্যাব সেটআপ (৩০%)</span>
                  <p className="text-xl font-black text-slate-900 mt-1">৳ ৩,০০,০০০</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">মাল্টিমিডিয়া ক্লাসরুম ও সাউন্ড ল্যাব</p>
                </div>
                <div className="rounded-2xl border border-stone-200 bg-[#fcfaf7] p-4">
                  <span className="text-xs font-bold text-slate-500">২. ডিজিটাল মার্কেটিং ও লিড (২০%)</span>
                  <p className="text-xl font-black text-slate-900 mt-1">৳ ২,০০,০০০</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">মেটা অ্যাডস ও ডিরেক্ট ফর্ম ফানেল</p>
                </div>
                <div className="rounded-2xl border border-stone-200 bg-[#fcfaf7] p-4">
                  <span className="text-xs font-bold text-slate-500">৩. অপারেশনাল রানওয়ে (৩০%)</span>
                  <p className="text-xl font-black text-slate-900 mt-1">৳ ৩,০০,০০০</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">৬ মাসের অফিস রেন্ট ও স্টাফ বেতন</p>
                </div>
                <div className="rounded-2xl border border-stone-200 bg-emerald-50/50 p-4">
                  <span className="text-xs font-bold text-emerald-800">৪. জরুরি সেফটি রিজার্ভ (২০%)</span>
                  <p className="text-xl font-black text-emerald-700 mt-1">৳ ২,০০,০০০</p>
                  <p className="text-[11px] text-emerald-800 mt-0.5">ব্যাংক সিকিউরিটি রিজার্ভ ফান্ড</p>
                </div>
              </div>

              {/* 3 Projections Scenarios Table */}
              <div className="mt-6 rounded-2xl border border-stone-200 p-5 bg-stone-50/50">
                <h3 className="font-extrabold text-sm text-slate-900 mb-3">
                  বাৎসরিক মুনাফা শেয়ারিং প্রজেকশন বনাম লাইভ পারফরম্যান্স
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="rounded-xl border border-stone-200 bg-white p-4">
                    <span className="rounded bg-stone-100 px-2 py-0.5 font-bold text-slate-700">
                      রক্ষণশীল দৃশ্যপট (২০টি ভিসা)
                    </span>
                    <p className="text-lg font-black text-slate-900 mt-2">গ্রস লাভ: ৳২৪,০০,০০০</p>
                    <p className="text-emerald-700 font-extrabold mt-1 text-sm">ইনভেস্টর শেয়ার: ৳২,৪০,০০০</p>
                    <p className="text-[11px] text-slate-500 mt-1">২৪% বার্ষিক রিটার্ন</p>
                  </div>
                  <div className="rounded-xl border-2 border-emerald-500 bg-white p-4 shadow-xs">
                    <span className="rounded bg-emerald-100 px-2 py-0.5 font-bold text-emerald-800">
                      বাস্তবসম্মত লক্ষ্যমাত্রা (৩০টি ভিসা)
                    </span>
                    <p className="text-lg font-black text-slate-900 mt-2">গ্রস লাভ: ৳৩৬,০০,০০০</p>
                    <p className="text-emerald-700 font-black mt-1 text-base">ইনভেস্টর শেয়ার: ৳৩,৬০,০০০</p>
                    <p className="text-[11px] text-emerald-800 mt-1 font-semibold">৩৬% বার্ষিক হালাল মুনাফা</p>
                  </div>
                  <div className="rounded-xl border border-stone-200 bg-white p-4">
                    <span className="rounded bg-stone-100 px-2 py-0.5 font-bold text-slate-700">
                      সর্বোচ্চ সম্ভাবনা (৪০টি ভিসা)
                    </span>
                    <p className="text-lg font-black text-slate-900 mt-2">গ্রস লাভ: ৳৪৮,০০,০০০</p>
                    <p className="text-emerald-700 font-extrabold mt-1 text-sm">ইনভেস্টর শেয়ার: ৳৪,৮০,০০০</p>
                    <p className="text-[11px] text-slate-500 mt-1">৪৮% বার্ষিক রিটার্ন</p>
                  </div>
                </div>

                {/* Legal & Bank Cheque Security Record */}
                <div className="mt-4 flex flex-wrap items-center justify-between rounded-xl bg-white p-3.5 border border-stone-200 text-xs">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-emerald-600" />
                    <span className="font-bold text-slate-800">
                      আইনি নিরাপত্তা: ৩০০ টাকার সরকারি স্ট্যাম্প চুক্তি ও ইসলামী ব্যাংক সিকিউরিটি চেক নং IBBL-CHQ-9948201
                    </span>
                  </div>
                  <span className="font-mono text-emerald-700 font-bold">১০% ফিক্সড ডিভিডেন্ড এগ্রিমেন্ট</span>
                </div>
              </div>
            </div>

            {/* Package Billing & Transactions List */}
            <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    রেগুলার (৳১,২০,০০০) ও প্রিমিয়াম (৳১১,০০,০০০) প্যাকেজ বিলিং
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">বিকাশ, নগদ, ব্যাংক ও গেটওয়ে পেমেন্ট ট্র্যাকার</p>
                </div>
                <button
                  onClick={() => {
                    const student = prompt("শিক্ষার্থীর নাম:");
                    if (!student) return;
                    const amountStr = prompt("টাকার পরিমাণ (BDT):", "120000");
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
                      verifiedBy: "শেখ বাসেত",
                      notes: "ক্যাশ কালেকশন বা অনলাইন ভেরিফিকেশন",
                    });
                    showToast("পেমেন্ট ট্রানজেকশন সফলভাবে রেকর্ড হয়েছে!");
                  }}
                  className="rounded-xl bg-stone-900 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition"
                >
                  পেমেন্ট এন্ট্রি নিন
                </button>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-stone-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 font-bold text-slate-700">
                    <tr>
                      <th className="p-3">রশিদ ও তারিখ</th>
                      <th className="p-3">শিক্ষার্থী / বিবরণ</th>
                      <th className="p-3">প্যাকেজ / পেমেন্ট টাইপ</th>
                      <th className="p-3">মাধ্যম ও Trx ID</th>
                      <th className="p-3">শাখা</th>
                      <th className="p-3 text-right">টাকার পরিমাণ (BDT)</th>
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
                        <td className="p-3 text-slate-600 font-medium">{tx.branch}</td>
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
                    এইচআর (HR) ও রিমোট ফিমেল টেলি-কাউন্সেলর পে-রোল
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    কল টার্গেট (মাসিক ৬০০ কল), নিশ্চিত ভর্তি বোনাস (১,০০০ টাকা/ভর্তি) ও স্যালারি শীট।
                  </p>
                </div>
                <div className="rounded-2xl bg-amber-50 px-4 py-2 text-amber-900 border border-amber-200 text-xs font-bold">
                  পারফরম্যান্স বোনাস: প্রতি নিশ্চিত ভর্তিতে ১,০০০ টাকা
                </div>
              </div>

              {/* Staff Table */}
              <div className="mt-6 overflow-x-auto rounded-2xl border border-stone-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 font-bold text-slate-700">
                    <tr>
                      <th className="p-3">কর্মকর্তার নাম ও রোল</th>
                      <th className="p-3">লোকেশন</th>
                      <th className="p-3">মাসিক কল টার্গেট বনাম অর্জন</th>
                      <th className="p-3">ভর্তি অর্জন</th>
                      <th className="p-3">মূল বেতন</th>
                      <th className="p-3">পারফরম্যান্স বোনাস</th>
                      <th className="p-3 text-right">মোট প্রদেয় বেতন</th>
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
                              {stf.callsCompleted} / {stf.callsTargetMonthly} কল
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
                            {stf.admissionsAchieved} জন
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
                    <span>১০০% ডাইনামিক ওয়েবসাইট সিএমএস (knltc.com)</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    কোডে হাত না দিয়ে ওয়েবসাইটের সব পেইজ ও কনটেন্ট পরিচালনা করুন
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    টপ ব্যানার, হিরো সেকশন, জাপানি কোর্স ও লেসন, ভিসা প্যাকেজ, চাকরির সার্কুলার ও বুক স্টোর।
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      saveCmsStore(store);
                      showToast("সব পরিবর্তন সফলভাবে সেভ হয়েছে এবং ওয়েবসাইটে কার্যকর হয়েছে!");
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#15803d] px-5 py-2.5 text-xs font-extrabold text-white hover:bg-emerald-800 transition shadow-md"
                  >
                    <Save className="h-4 w-4" />
                    <span>সিএমএস পরিবর্তন সেভ করুন</span>
                  </button>
                </div>
              </div>

              {/* Sub-Tabs for CMS Pages */}
              <div className="mt-8 space-y-8">
                {/* 1. Global Announcement & Hero Section */}
                <div className="rounded-2xl border border-stone-200 p-5 bg-[#fcfaf7]">
                  <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#b91c1c]" />
                    <span>১. গ্লোবাল টপ অ্যানাউন্সমেন্ট ও পপ-আপ ব্যানার</span>
                  </h3>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-700">টপ বার অ্যানাউন্সমেন্ট (বাংলা):</label>
                      <input
                        type="text"
                        defaultValue={cms.topAnnouncementBar.text.bn}
                        onChange={(e) => {
                          cms.topAnnouncementBar.text.bn = e.target.value;
                          setStore({ ...store });
                        }}
                        className="mt-1 w-full rounded-lg border border-stone-300 p-2.5 font-medium"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700">পপ-আপ ব্যানার হেডলাইন (বাংলা):</label>
                      <input
                        type="text"
                        defaultValue={cms.popupBanner.headline.bn}
                        onChange={(e) => {
                          cms.popupBanner.headline.bn = e.target.value;
                          setStore({ ...store });
                        }}
                        className="mt-1 w-full rounded-lg border border-stone-300 p-2.5 font-medium"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700">হোমপেজ হিরো হেডলাইন (বাংলা):</label>
                      <input
                        type="text"
                        defaultValue={cms.heroSection.headline.bn}
                        onChange={(e) => {
                          cms.heroSection.headline.bn = e.target.value;
                          setStore({ ...store });
                        }}
                        className="mt-1 w-full rounded-lg border border-stone-300 p-2.5 font-medium"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700">Facebook Meta Pixel ID:</label>
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
                      <span>২. জাপানি ভাষা পেইজ ও লেসন এডিটর (/japanese-language)</span>
                    </h3>
                    <span className="text-xs font-bold text-emerald-800">
                      N5 ফি: ৳{cms.languageCoursePage.n5PriceBdt.toLocaleString()}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="font-bold text-slate-700">N5 কোর্স ফি (BDT):</label>
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
                      <label className="font-bold text-slate-700">N4 কোর্স ফি (BDT):</label>
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
                      <label className="font-bold text-slate-700">N5+N4 কম্বো কোর্স ফি (BDT):</label>
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
                      মিন্না নো নিহোঙ্গো লেসন তালিকা (শব্দভাণ্ডার ও ব্যাকরণ)
                    </h4>
                    <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-stone-50 border-b border-stone-200 font-bold">
                          <tr>
                            <th className="p-2.5">লেসন নং</th>
                            <th className="p-2.5">শিরোনাম (বাংলা ও রোমাজি)</th>
                            <th className="p-2.5">ক্যাটেগরি</th>
                            <th className="p-2.5">শব্দ সংখ্যা</th>
                            <th className="p-2.5 text-right">অ্যাকশন</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                          {cms.languageCoursePage.lessons.map((lsn) => (
                            <tr key={lsn.id} className="hover:bg-stone-50">
                              <td className="p-2.5 font-bold">{lsn.lessonNumber}</td>
                              <td className="p-2.5 font-semibold text-slate-900">{lsn.title.bn}</td>
                              <td className="p-2.5">
                                <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-800">
                                  {lsn.tabCategory}
                                </span>
                              </td>
                              <td className="p-2.5 text-slate-500">{lsn.vocabularyList.length} টি শব্দ</td>
                              <td className="p-2.5 text-right">
                                <span className="text-emerald-700 font-bold text-[11px]">সক্রিয়</span>
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
                    <span>৩. স্টুডেন্ট ভিসা প্যাকেজ মূল্য ও শর্তাবলি (/study-in-japan)</span>
                  </h3>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="rounded-xl border border-stone-200 bg-white p-4">
                      <p className="font-black text-slate-900 text-sm">রেগুলার প্যাকেজ</p>
                      <label className="font-semibold text-slate-500 mt-2 block">
                        সার্ভিস চার্জ (ভিসা অনুমোদনের পর):
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
                        ভিসার পূর্বে কোনো ফাইল চার্জ নেই। শিক্ষার্থী টিউশন ফি ও টিকিট বহন করবে।
                      </p>
                    </div>

                    <div className="rounded-xl border border-stone-200 bg-white p-4">
                      <p className="font-black text-slate-900 text-sm">প্রিমিয়াম প্যাকেজ (অল-ইন-ওয়ান)</p>
                      <label className="font-semibold text-slate-500 mt-2 block">
                        সম্পূর্ণ প্যাকেজ মূল্য (টিউশন ও টিকিট সহ):
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
                        ১০% রিফান্ডযোগ্য জামানত। ১ম বছরের টিউশন ও এয়ার টিকিট KNLTC বহন করে।
                      </p>
                    </div>
                  </div>
                </div>

                {/* 4. Job Circulars & SSW Manager */}
                <div className="rounded-2xl border border-stone-200 p-5 bg-[#fcfaf7]">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-emerald-700" />
                      <span>৪. জব সার্কুলার ও SSW ক্যাম্পেইন ম্যানেজার (/work-in-japan)</span>
                    </h3>
                    <button
                      onClick={() => {
                        const title = prompt("চাকরির পদবীর নাম (বাংলা):", "SSW ফুড সার্ভিস স্পেশালিস্ট");
                        if (!title) return;
                        const newCirc: JobCircular = {
                          id: `job-${Date.now()}`,
                          title: { bn: title, en: title, ja: title },
                          category: "SSW_FOOD_SERVICE",
                          salaryYen: "¥180,000 – ¥220,000 / মাস",
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
                        showToast("নতুন জব সার্কুলার যোগ হয়েছে!");
                      }}
                      className="rounded-xl bg-stone-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition"
                    >
                      নতুন সার্কুলার প্রকাশ করুন
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
                            <span className="text-xs font-bold text-slate-500">জাপান লোকেশন: {circ.locationJapan}</span>
                          </div>
                          <p className="font-extrabold text-sm text-slate-900 mt-1">{circ.title.bn}</p>
                          <p className="text-xs font-bold text-emerald-700 mt-0.5">
                            বেতন: {circ.salaryYen} ({circ.salaryBdtEquivalent})
                          </p>
                          <p className="text-[11px] text-amber-800 font-semibold mt-1">{circ.specialBenefitsBn}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              circ.isPublished = !circ.isPublished;
                              setStore({ ...store });
                              showToast(`সার্কুলার ${circ.isPublished ? "পাবলিশ" : "আনপাবলিশ"} করা হয়েছে!`);
                            }}
                            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                              circ.isPublished
                                ? "bg-emerald-600 text-white"
                                : "bg-stone-200 text-slate-700"
                            }`}
                          >
                            {circ.isPublished ? "লাইভ সক্রিয়" : "ড্রাফট"}
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
                      <span>৫. বুক স্টোর ও কাস্টমার অর্ডার প্রসেসিং (/store, /cart, /checkout)</span>
                    </h3>
                    <span className="text-xs font-bold text-slate-500">
                      পেন্ডিং অর্ডার: {cms.customerOrders.filter((o) => o.orderStatus === "PROCESSING").length} টি
                    </span>
                  </div>

                  {/* Customer Orders Table */}
                  <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-stone-50 border-b border-stone-200 font-bold">
                        <tr>
                          <th className="p-2.5">অর্ডার নং ও ক্রেতা</th>
                          <th className="p-2.5">আইটেম ও ঠিকানা</th>
                          <th className="p-2.5">ডেলিভারি এরিয়া</th>
                          <th className="p-2.5">পেমেন্ট মাধ্যম</th>
                          <th className="p-2.5">মোট মূল্য</th>
                          <th className="p-2.5 text-right">স্ট্যাটাস</th>
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
                                  showToast(`অর্ডার স্ট্যাটাস: ${e.target.value}`);
                                }}
                                className="rounded border border-stone-300 p-1 font-bold text-xs bg-white"
                              >
                                <option value="PENDING">পেন্ডিং</option>
                                <option value="PROCESSING">প্রসেসিং</option>
                                <option value="SHIPPED">শিপড</option>
                                <option value="DELIVERED">ডেলিভারড</option>
                                <option value="CANCELLED">ক্যান্সেলড</option>
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
      </main>
    </div>
  );
}
