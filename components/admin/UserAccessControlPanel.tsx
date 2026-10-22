"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  UserPlus,
  KeyRound,
  Lock,
  CheckCircle2,
  Trash2,
  Send,
  Copy,
  Users,
  GraduationCap,
  Building2,
} from "lucide-react";
import {
  getSystemAccounts,
  upsertSystemAccount,
  deleteSystemAccount,
  type SystemUserAccount,
  type UserRole,
  type BranchCode,
  type DashboardTabId,
} from "@/lib/knltc-cms-store";

const ALL_DASHBOARD_MODULES: { id: DashboardTabId; label: string }[] = [
  { id: "my_profile", label: "আমার প্রোফাইল ও ফাইল" },
  { id: "overview", label: "সামগ্রিক চিত্র (Overview)" },
  { id: "crm", label: "সিআরএম ও লিডস (CRM)" },
  { id: "visa", label: "ভিসা পাইপলাইন (Visa)" },
  { id: "lms", label: "ভাষা কোর্স ও LMS" },
  { id: "b2b", label: "B2B ও পার্টনার স্কুল" },
  { id: "finance", label: "ফিন্যান্স ও ইনভেস্টর" },
  { id: "hr", label: "HR ও টেলি-কাউন্সেলর" },
  { id: "cms", label: "ওয়েবসাইট CMS" },
  { id: "store_blog", label: "বুক স্টোর ও ব্লগ" },
  { id: "users", label: "ইউজার ও অ্যাক্সেস কন্ট্রোল" },
];

const ROLE_LABELS: Record<UserRole, string> = {
  MAIN_ADMIN: "মেইন অ্যাডমিন (Super Admin)",
  BRANCH_ADMIN: "শাখা প্রধান (Branch Admin)",
  TELE_COUNSELOR: "টেলি-কাউন্সেলর (CRM Executive)",
  TEACHER: "সিনিয়র সেন্সি / শিক্ষক (Teacher)",
  B2B_AGENT: "B2B এজেন্ট / অ্যাম্বাসেডর",
  INVESTOR: "বিনিয়োগকারী (Investor View)",
  STUDENT: "ভর্তিকৃত শিক্ষার্থী / ভিসা প্রার্থী",
};

const ROLE_DEFAULT_TABS: Record<UserRole, DashboardTabId[]> = {
  MAIN_ADMIN: ["overview", "crm", "visa", "lms", "b2b", "finance", "hr", "cms", "store_blog", "users"],
  BRANCH_ADMIN: ["overview", "crm", "visa", "lms", "finance", "hr", "store_blog"],
  TELE_COUNSELOR: ["overview", "crm", "visa", "lms"],
  TEACHER: ["overview", "lms", "visa"],
  B2B_AGENT: ["overview", "b2b", "visa"],
  INVESTOR: ["overview", "finance", "b2b"],
  STUDENT: ["my_profile", "visa", "lms"],
};

export default function UserAccessControlPanel({
  onNotify,
}: {
  onNotify: (msg: string) => void;
}) {
  const [accounts, setAccounts] = useState<SystemUserAccount[]>(() => getSystemAccounts());
  const [filterGroup, setFilterGroup] = useState<"ALL" | "STAFF" | "STUDENTS">("ALL");
  const [showCreateForm, setShowCreateForm] = useState(false);

  // New Account Form State
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("017");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("knltc2026");
  const [newRole, setNewRole] = useState<UserRole>("TELE_COUNSELOR");
  const [newBranch, setNewBranch] = useState<BranchCode>("DHK-HQ");
  const [newAllowedTabs, setNewAllowedTabs] = useState<DashboardTabId[]>(
    ROLE_DEFAULT_TABS.TELE_COUNSELOR,
  );

  const refreshAccounts = () => {
    setAccounts([...getSystemAccounts()]);
  };

  const handleRoleChangeForNew = (role: UserRole) => {
    setNewRole(role);
    setNewAllowedTabs(ROLE_DEFAULT_TABS[role] || ["overview"]);
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim() || !newPassword.trim()) {
      onNotify("নাম, লগইন ইমেইল/আইডি এবং পাসওয়ার্ড পূরণ করুন।");
      return;
    }

    upsertSystemAccount({
      name: newName.trim(),
      email: newEmail.trim().toLowerCase(),
      password: newPassword.trim(),
      phone: newPhone.trim(),
      role: newRole,
      branch: newBranch,
      allowedTabs: newAllowedTabs.length > 0 ? newAllowedTabs : ["my_profile"],
      status: "ACTIVE",
      enrollmentType: newRole === "STUDENT" ? "COURSE_AND_VISA" : "NONE",
    });

    refreshAccounts();
    setNewName("");
    setNewEmail("");
    setNewPhone("017");
    setShowCreateForm(false);
    onNotify(`নতুন লগইন অ্যাকাউন্ট (${newEmail.trim()}) তৈরি এবং সক্রিয় করা হয়েছে!`);
  };

  const handleToggleAccountTab = (acc: SystemUserAccount, tabId: DashboardTabId) => {
    const currentTabs = acc.allowedTabs || [];
    const updatedTabs = currentTabs.includes(tabId)
      ? currentTabs.filter((t) => t !== tabId)
      : [...currentTabs, tabId];

    upsertSystemAccount({
      ...acc,
      allowedTabs: updatedTabs,
    });
    refreshAccounts();
    onNotify(`${acc.name}-এর মডিউল অ্যাক্সেস পারমিশন আপডেট হয়েছে!`);
  };

  const handleUpdateRoleOrStatus = (
    acc: SystemUserAccount,
    updates: Partial<SystemUserAccount>,
  ) => {
    upsertSystemAccount({
      ...acc,
      ...updates,
    });
    refreshAccounts();
    onNotify(`${acc.name}-এর অ্যাকাউন্ট সেটিংস আপডেট হয়েছে!`);
  };

  const handleDelete = (acc: SystemUserAccount) => {
    if (acc.role === "MAIN_ADMIN" && accounts.filter((a) => a.role === "MAIN_ADMIN").length <= 1) {
      onNotify("প্রধান অ্যাডমিন অ্যাকাউন্ট মুছে ফেলা যাবে না।");
      return;
    }
    deleteSystemAccount(acc.id);
    refreshAccounts();
    onNotify(`${acc.name}-এর লগইন অ্যাক্সেস মুছে ফেলা হয়েছে।`);
  };

  const filteredAccounts = accounts.filter((acc) => {
    if (filterGroup === "STAFF") return acc.role !== "STUDENT";
    if (filterGroup === "STUDENTS") return acc.role === "STUDENT";
    return true;
  });

  const staffCount = accounts.filter((a) => a.role !== "STUDENT").length;
  const studentCount = accounts.filter((a) => a.role === "STUDENT").length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner & Summary Cards */}
      <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-[#b91c1c] mb-1.5">
              <ShieldCheck className="h-4 w-4" />
              <span>MAIN ADMIN ACCESS & CREDENTIAL GENERATOR</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              ইউজার রোল, লগইন ডিটেইলস ও অ্যাক্সেস কন্ট্রোল প্যানেল
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              লগইন পেইজ থেকে কারা লগইন করতে পারবে, কে কোন রোলে আছে এবং কাকে কোন কোন ট্যাব/মডিউলের অ্যাক্সেস দেওয়া হয়েছে—সবকিছু এখান থেকে নিয়ন্ত্রণ করুন।
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#b91c1c] px-4 py-2.5 text-xs font-black text-white shadow-md hover:bg-red-800 transition"
          >
            <UserPlus className="h-4 w-4" />
            <span>{showCreateForm ? "ফর্ম বন্ধ করুন" : "নতুন লগইন অ্যাকাউন্ট তৈরি করুন"}</span>
          </button>
        </div>

        {/* 4 Summary Cards */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-stone-200 bg-[#fcfaf7] p-4">
            <span className="text-xs font-bold text-slate-500">মোট অনুমোদিত লগইন ইউজার</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{accounts.length} জন</p>
            <p className="text-[11px] text-slate-500 mt-0.5">সক্রিয় ও নিয়ন্ত্রিত অ্যাকাউন্ট</p>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-[#fcfaf7] p-4">
            <span className="text-xs font-bold text-slate-500">অ্যাডমিন, শিক্ষক ও স্টাফ</span>
            <p className="text-2xl font-black text-emerald-800 mt-1">{staffCount} জন</p>
            <p className="text-[11px] text-slate-500 mt-0.5">ঢাকা ও খুলনা শাখা টিম</p>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-[#fcfaf7] p-4">
            <span className="text-xs font-bold text-slate-500">ভর্তিকৃত শিক্ষার্থী / ফাইল লগইন</span>
            <p className="text-2xl font-black text-indigo-800 mt-1">{studentCount} জন</p>
            <p className="text-[11px] text-slate-500 mt-0.5">লিড প্রোফাইল থেকে অনুমোদিত</p>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-emerald-50/60 p-4">
            <span className="text-xs font-bold text-emerald-900">লগইন পেইজ স্ট্যাটাস</span>
            <p className="text-base font-black text-emerald-800 mt-1">স্ট্যান্ডার্ড সিকিউর লগইন</p>
            <p className="text-[11px] text-emerald-700 mt-0.5">শুধুমাত্র প্রদত্ত আইডি/পাসওয়ার্ডে প্রবেশযোগ্য</p>
          </div>
        </div>

        {/* Create New User Login Form */}
        {showCreateForm && (
          <form
            onSubmit={handleCreateAccount}
            className="mt-6 rounded-2xl border-2 border-[#133e29]/20 bg-[#fcfaf7] p-5 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-[#b91c1c]" />
                <span>নতুন ইউজার / স্টাফ / শিক্ষার্থী লগইন ডিটেইলস জেনারেট করুন</span>
              </h3>
              <button
                type="button"
                onClick={() =>
                  setNewPassword(`KNLTC#${Math.floor(1000 + Math.random() * 9000)}`)
                }
                className="text-xs font-bold text-[#b91c1c] hover:underline"
              >
                অটো-পাসওয়ার্ড তৈরি করুন
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700">পূর্ণ নাম ও পদবী *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="যেমন: রোকসানা আক্তার (কাউন্সেলর)"
                  className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 font-bold"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700">লগইন ইমেইল বা ইউজার আইডি *</label>
                <input
                  type="text"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="roksana@knltc.com"
                  className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 font-mono font-bold"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700">লগইন পাসওয়ার্ড *</label>
                <input
                  type="text"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 font-mono font-bold text-emerald-800"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700">ফোন / WhatsApp নম্বর</label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 font-mono"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700">নির্ধারিত রোল (Role)</label>
                <select
                  value={newRole}
                  onChange={(e) => handleRoleChangeForNew(e.target.value as UserRole)}
                  className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 font-bold"
                >
                  {Object.entries(ROLE_LABELS).map(([roleKey, label]) => (
                    <option key={roleKey} value={roleKey}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700">শাখা অ্যাক্সেস (Branch)</label>
                <select
                  value={newBranch}
                  onChange={(e) => setNewBranch(e.target.value as BranchCode)}
                  className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 font-bold"
                >
                  <option value="ALL">উভয় শাখা (ALL Branches)</option>
                  <option value="DHK-HQ">ঢাকা প্রধান কার্যালয় (DHK-HQ)</option>
                  <option value="KHULNA-01">খুলনা শাখা (KHULNA-01)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-900 mb-2">
                এই ইউজারকে কোন কোন মডিউল/ট্যাবের অ্যাক্সেস দিতে চান টিক দিন:
              </label>
              <div className="flex flex-wrap gap-2">
                {ALL_DASHBOARD_MODULES.map((mod) => {
                  const checked = newAllowedTabs.includes(mod.id);
                  return (
                    <label
                      key={mod.id}
                      className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold cursor-pointer transition ${
                        checked
                          ? "border-emerald-600 bg-emerald-50 text-emerald-950"
                          : "border-stone-200 bg-white text-slate-600"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() =>
                          setNewAllowedTabs((prev) =>
                            prev.includes(mod.id)
                              ? prev.filter((t) => t !== mod.id)
                              : [...prev, mod.id],
                          )
                        }
                        className="h-3.5 w-3.5 accent-emerald-700"
                      />
                      <span>{mod.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="rounded-xl border border-stone-300 bg-white px-4 py-2 text-xs font-bold text-slate-700"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="rounded-xl bg-[#133e29] px-5 py-2 text-xs font-black text-white hover:bg-emerald-900 transition"
              >
                লগইন অ্যাকাউন্ট সেভ ও চালু করুন
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Filter Tabs & Accounts Table */}
      <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "ALL", label: `সকল লগইন অ্যাকাউন্ট (${accounts.length})` },
              { id: "STAFF", label: `অ্যাডমিন, শিক্ষক ও স্টাফ (${staffCount})` },
              { id: "STUDENTS", label: `ভর্তিকৃত লিড ও শিক্ষার্থী (${studentCount})` },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilterGroup(f.id as any)}
                className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                  filterGroup === f.id
                    ? "bg-[#133e29] text-white"
                    : "border border-stone-200 bg-[#fcfaf7] text-slate-700 hover:bg-white"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <span className="text-xs text-slate-500">
            যেকোনো ইউজারের পাসওয়ার্ড বা ট্যাব পারমিশন পরিবর্তন করলে সাথে সাথে তা কার্যকর হবে
          </span>
        </div>

        <div className="space-y-4">
          {filteredAccounts.map((acc) => {
            const waText = encodeURIComponent(
              `হ্যালো ${acc.name},\nআপনার KNLTC পোর্টাল লগইন ডিটেইলস:\n• লিঙ্ক: ${typeof window !== "undefined" ? window.location.origin : ""}/admin/login\n• লগইন ইমেইল/আইডি: ${acc.email}\n• পাসওয়ার্ড: ${acc.password}\n• রোল: ${ROLE_LABELS[acc.role] || acc.role}`,
            );
            const waUrl = `https://wa.me/${(acc.phone || "").replace(/[^0-9]/g, "")}?text=${waText}`;

            return (
              <div
                key={acc.id}
                className="rounded-2xl border border-stone-200 bg-[#fcfaf7] p-4 sm:p-5 transition hover:border-emerald-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-stone-200/80 pb-4">
                  {/* User Identity & Role */}
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-black text-slate-900">{acc.name}</h3>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${
                          acc.role === "MAIN_ADMIN"
                            ? "bg-red-100 text-red-800"
                            : acc.role === "STUDENT"
                              ? "bg-indigo-100 text-indigo-800"
                              : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {ROLE_LABELS[acc.role] || acc.role}
                      </span>
                      <span className="rounded-full bg-stone-200 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                        শাখা: {acc.branch}
                      </span>
                      {acc.linkedLeadId && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-900">
                          লিড প্রোফাইল: {acc.linkedLeadId}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 font-mono">ফোন: {acc.phone || "N/A"}</p>
                  </div>

                  {/* Login Credentials & Quick Controls */}
                  <div className="flex flex-wrap items-center gap-2.5 text-xs">
                    <div className="rounded-xl border border-stone-300 bg-white px-3 py-1.5">
                      <span className="text-[10px] font-bold text-slate-400 block">লগইন ইমেইল / আইডি</span>
                      <span className="font-mono font-bold text-slate-900">{acc.email}</span>
                    </div>

                    <div className="rounded-xl border border-stone-300 bg-white px-3 py-1.5">
                      <span className="text-[10px] font-bold text-slate-400 block">পাসওয়ার্ড (এডিটযোগ্য)</span>
                      <input
                        type="text"
                        defaultValue={acc.password}
                        onBlur={(e) => {
                          if (e.target.value.trim() && e.target.value !== acc.password) {
                            handleUpdateRoleOrStatus(acc, { password: e.target.value.trim() });
                          }
                        }}
                        className="w-28 font-mono font-bold text-emerald-800 bg-transparent focus:outline-hidden"
                      />
                    </div>

                    <select
                      value={acc.role}
                      onChange={(e) => {
                        const nextRole = e.target.value as UserRole;
                        handleUpdateRoleOrStatus(acc, {
                          role: nextRole,
                          allowedTabs: ROLE_DEFAULT_TABS[nextRole] || acc.allowedTabs,
                        });
                      }}
                      className="rounded-xl border border-stone-300 bg-white px-2.5 py-2 font-bold text-slate-800"
                    >
                      {Object.entries(ROLE_LABELS).map(([k, v]) => (
                        <option key={k} value={k}>
                          {v}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateRoleOrStatus(acc, {
                          status: acc.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE",
                        })
                      }
                      className={`rounded-xl px-3 py-2 font-bold transition ${
                        acc.status === "ACTIVE"
                          ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                          : "bg-rose-100 text-rose-800 hover:bg-rose-200"
                      }`}
                    >
                      {acc.status === "ACTIVE" ? "সক্রিয় (Active)" : "স্থগিত (Suspended)"}
                    </button>

                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-2 font-bold text-white hover:bg-emerald-700 transition"
                      title="WhatsApp-এ লগইন ডিটেইলস পাঠান"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>WhatsApp</span>
                    </a>

                    {acc.role !== "MAIN_ADMIN" && (
                      <button
                        type="button"
                        onClick={() => handleDelete(acc)}
                        className="rounded-xl border border-rose-200 bg-rose-50 p-2 text-rose-700 hover:bg-rose-100 transition"
                        title="অ্যাকাউন্ট মুছে ফেলুন"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Granular Access Permissions Checkboxes */}
                <div className="mt-3">
                  <span className="text-[11px] font-bold text-slate-600 block mb-2">
                    অনুমোদিত ড্যাশবোর্ড অ্যাক্সেস (টিক দিয়ে অ্যাক্সেস দিন বা তুলে নিন):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {ALL_DASHBOARD_MODULES.map((mod) => {
                      const hasAccess = (acc.allowedTabs || []).includes(mod.id);
                      return (
                        <label
                          key={mod.id}
                          className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-bold cursor-pointer transition ${
                            hasAccess
                              ? "border-emerald-600 bg-emerald-50 text-emerald-950"
                              : "border-stone-200 bg-white text-slate-400 hover:text-slate-700"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={hasAccess}
                            onChange={() => handleToggleAccountTab(acc, mod.id)}
                            className="h-3 w-3 accent-emerald-700"
                          />
                          <span>{mod.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
