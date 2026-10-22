"use client";

import React, { useState, useMemo } from "react";
import {
  ShieldCheck,
  UserPlus,
  KeyRound,
  Trash2,
  Send,
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
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";

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
  const { language } = useLanguage();
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

  const t = useMemo(
    () =>
      translate(
        {
          en: {
            badge: "MAIN ADMIN ACCESS & CREDENTIAL GENERATOR",
            title: "User Roles, Login Credentials & Access Control Panel",
            subtitle:
              "Manage who can sign in from the login page, view assigned roles, and control which dashboard tabs/modules each user can access.",
            closeFormBtn: "Close Form",
            createAccountBtn: "Create New Login Account",
            card1Title: "Total Authorized Login Users",
            card1Sub: "Active & managed accounts",
            card2Title: "Admins, Sensei & Staff",
            card2Sub: "Dhaka & Khulna branch team",
            card3Title: "Enrolled Student / File Logins",
            card3Sub: "Approved from lead profiles",
            card4Title: "Login Page Security",
            card4Val: "Standard Secure Login",
            card4Sub: "Accessible only with issued ID & password",
            usersSuffix: "users",
            formHeader: "Generate New Staff / Student Login Credentials",
            autoPassBtn: "Generate Auto-Password",
            nameLabel: "Full Name & Designation *",
            namePlaceholder: "e.g. Roksana Akter (Counselor)",
            emailLabel: "Login Email or User ID *",
            passwordLabel: "Login Password *",
            phoneLabel: "Phone / WhatsApp Number",
            roleLabel: "Assigned Role",
            branchLabel: "Branch Access",
            branchAll: "Both Branches (ALL)",
            branchDhaka: "Dhaka HQ (DHK-HQ)",
            branchKhulna: "Khulna Branch (KHULNA-01)",
            selectTabsLabel: "Select which modules/tabs this user can access:",
            cancelBtn: "Cancel",
            saveAccountBtn: "Save & Activate Login Account",
            filterAll: "All Login Accounts",
            filterStaff: "Admins, Teachers & Staff",
            filterStudents: "Enrolled Leads & Students",
            instantNotice: "Any change to a user's password or tab permissions takes effect immediately",
            branchPrefix: "Branch:",
            leadProfilePrefix: "Lead Profile:",
            phonePrefix: "Phone:",
            loginIdBox: "Login Email / ID",
            passwordBox: "Password (Editable)",
            statusActive: "Active",
            statusSuspended: "Suspended",
            allowedTabsHeader: "Authorized Dashboard Access (Check/uncheck to grant or revoke):",
            modules: {
              my_profile: "My Profile & File",
              overview: "Overview",
              crm: "CRM & Leads",
              visa: "Visa Pipeline",
              lms: "Language & LMS",
              b2b: "B2B & Partner Schools",
              finance: "Finance & Investor",
              hr: "HR & Tele-Counselors",
              cms: "Website CMS",
              store_blog: "Bookstore & Blog",
              users: "Users & Access Control",
            } as Record<DashboardTabId, string>,
            roles: {
              MAIN_ADMIN: "Main Admin (Super Admin)",
              BRANCH_ADMIN: "Branch Admin",
              TELE_COUNSELOR: "Tele-Counselor (CRM Executive)",
              TEACHER: "Senior Sensei / Teacher",
              B2B_AGENT: "B2B Agent / Ambassador",
              INVESTOR: "Investor (Open-Book View)",
              STUDENT: "Enrolled Student / Visa Applicant",
            } as Record<UserRole, string>,
            fillRequiredToast: "Please fill in name, login email/ID, and password.",
            createdToast: "New login account created and activated!",
            permUpdatedToast: "Module access permissions updated!",
            settingsUpdatedToast: "Account settings updated!",
            cannotDeleteAdminToast: "Cannot delete the primary Main Admin account.",
            deletedToast: "Login access removed.",
          },
          bn: {
            badge: "MAIN ADMIN ACCESS & CREDENTIAL GENERATOR",
            title: "ইউজার রোল, লগইন ডিটেইলস ও অ্যাক্সেস কন্ট্রোল প্যানেল",
            subtitle:
              "লগইন পেইজ থেকে কারা লগইন করতে পারবে, কে কোন রোলে আছে এবং কাকে কোন কোন ট্যাব/মডিউলের অ্যাক্সেস দেওয়া হয়েছে—সবকিছু এখান থেকে নিয়ন্ত্রণ করুন।",
            closeFormBtn: "ফর্ম বন্ধ করুন",
            createAccountBtn: "নতুন লগইন অ্যাকাউন্ট তৈরি করুন",
            card1Title: "মোট অনুমোদিত লগইন ইউজার",
            card1Sub: "সক্রিয় ও নিয়ন্ত্রিত অ্যাকাউন্ট",
            card2Title: "অ্যাডমিন, শিক্ষক ও স্টাফ",
            card2Sub: "ঢাকা ও খুলনা শাখা টিম",
            card3Title: "ভর্তিকৃত শিক্ষার্থী / ফাইল লগইন",
            card3Sub: "লিড প্রোফাইল থেকে অনুমোদিত",
            card4Title: "লগইন পেইজ স্ট্যাটাস",
            card4Val: "স্ট্যান্ডার্ড সিকিউর লগইন",
            card4Sub: "শুধুমাত্র প্রদত্ত আইডি/পাসওয়ার্ডে প্রবেশযোগ্য",
            usersSuffix: "জন",
            formHeader: "নতুন ইউজার / স্টাফ / শিক্ষার্থী লগইন ডিটেইলস জেনারেট করুন",
            autoPassBtn: "অটো-পাসওয়ার্ড তৈরি করুন",
            nameLabel: "পূর্ণ নাম ও পদবী *",
            namePlaceholder: "যেমন: রোকসানা আক্তার (কাউন্সেলর)",
            emailLabel: "লগইন ইমেইল বা ইউজার আইডি *",
            passwordLabel: "লগইন পাসওয়ার্ড *",
            phoneLabel: "ফোন / WhatsApp নম্বর",
            roleLabel: "নির্ধারিত রোল (Role)",
            branchLabel: "শাখা অ্যাক্সেস (Branch)",
            branchAll: "উভয় শাখা (ALL Branches)",
            branchDhaka: "ঢাকা প্রধান কার্যালয় (DHK-HQ)",
            branchKhulna: "খুলনা শাখা (KHULNA-01)",
            selectTabsLabel: "এই ইউজারকে কোন কোন মডিউল/ট্যাবের অ্যাক্সেস দিতে চান টিক দিন:",
            cancelBtn: "বাতিল",
            saveAccountBtn: "লগইন অ্যাকাউন্ট সেভ ও চালু করুন",
            filterAll: "সকল লগইন অ্যাকাউন্ট",
            filterStaff: "অ্যাডমিন, শিক্ষক ও স্টাফ",
            filterStudents: "ভর্তিকৃত লিড ও শিক্ষার্থী",
            instantNotice: "যেকোনো ইউজারের পাসওয়ার্ড বা ট্যাব পারমিশন পরিবর্তন করলে সাথে সাথে তা কার্যকর হবে",
            branchPrefix: "শাখা:",
            leadProfilePrefix: "লিড প্রোফাইল:",
            phonePrefix: "ফোন:",
            loginIdBox: "লগইন ইমেইল / আইডি",
            passwordBox: "পাসওয়ার্ড (এডিটযোগ্য)",
            statusActive: "সক্রিয় (Active)",
            statusSuspended: "স্থগিত (Suspended)",
            allowedTabsHeader: "অনুমোদিত ড্যাশবোর্ড অ্যাক্সেস (টিক দিয়ে অ্যাক্সেস দিন বা তুলে নিন):",
            modules: {
              my_profile: "আমার প্রোফাইল ও ফাইল",
              overview: "সামগ্রিক চিত্র (Overview)",
              crm: "সিআরএম ও লিডস (CRM)",
              visa: "ভিসা পাইপলাইন (Visa)",
              lms: "ভাষা কোর্স ও LMS",
              b2b: "B2B ও পার্টনার স্কুল",
              finance: "ফিন্যান্স ও ইনভেস্টর",
              hr: "HR ও টেলি-কাউন্সেলর",
              cms: "ওয়েবসাইট CMS",
              store_blog: "বুক স্টোর ও ব্লগ",
              users: "ইউজার ও অ্যাক্সেস কন্ট্রোল",
            } as Record<DashboardTabId, string>,
            roles: {
              MAIN_ADMIN: "মেইন অ্যাডমিন (Super Admin)",
              BRANCH_ADMIN: "শাখা প্রধান (Branch Admin)",
              TELE_COUNSELOR: "টেলি-কাউন্সেলর (CRM Executive)",
              TEACHER: "সিনিয়র সেন্সি / শিক্ষক (Teacher)",
              B2B_AGENT: "B2B এজেন্ট / অ্যাম্বাসেডর",
              INVESTOR: "বিনিয়োগকারী (Investor View)",
              STUDENT: "ভর্তিকৃত শিক্ষার্থী / ভিসা প্রার্থী",
            } as Record<UserRole, string>,
            fillRequiredToast: "নাম, লগইন ইমেইল/আইডি এবং পাসওয়ার্ড পূরণ করুন।",
            createdToast: "নতুন লগইন অ্যাকাউন্ট তৈরি এবং সক্রিয় করা হয়েছে!",
            permUpdatedToast: "মডিউল অ্যাক্সেস পারমিশন আপডেট হয়েছে!",
            settingsUpdatedToast: "অ্যাকাউন্ট সেটিংস আপডেট হয়েছে!",
            cannotDeleteAdminToast: "প্রধান অ্যাডমিন অ্যাকাউন্ট মুছে ফেলা যাবে না।",
            deletedToast: "লগইন অ্যাক্সেস মুছে ফেলা হয়েছে।",
          },
          ja: {
            badge: "MAIN ADMIN ACCESS & CREDENTIAL GENERATOR",
            title: "ユーザーロール・ログイン情報・アクセス権限管理パネル",
            subtitle:
              "ログイン可能なユーザー、割り当てられたロール、および各ユーザーがアクセスできるダッシュボードタブを一元管理します。",
            closeFormBtn: "フォームを閉じる",
            createAccountBtn: "新規ログインアカウント作成",
            card1Title: "総承認ログインユーザー",
            card1Sub: "有効な管理対象アカウント",
            card2Title: "管理者・講師・スタッフ",
            card2Sub: "ダッカ＆クルナ支部チーム",
            card3Title: "受講生・ビザ申請者ログイン",
            card3Sub: "リードプロフィールから承認済",
            card4Title: "ログインセキュリティ状態",
            card4Val: "標準セキュアログイン",
            card4Sub: "発行されたIDとパスワードのみ有効",
            usersSuffix: "名",
            formHeader: "新規スタッフ・受講生ログイン情報の発行",
            autoPassBtn: "パスワード自動生成",
            nameLabel: "氏名・役職 *",
            namePlaceholder: "例: ロクサナ・アクター (カウンセラー)",
            emailLabel: "ログインメール または ユーザーID *",
            passwordLabel: "ログインパスワード *",
            phoneLabel: "電話番号 / WhatsApp",
            roleLabel: "割り当てロール (Role)",
            branchLabel: "支部アクセス (Branch)",
            branchAll: "全支部 (ALL Branches)",
            branchDhaka: "ダッカ本部 (DHK-HQ)",
            branchKhulna: "クルナ支部 (KHULNA-01)",
            selectTabsLabel: "このユーザーに許可するモジュール/タブを選択してください:",
            cancelBtn: "キャンセル",
            saveAccountBtn: "アカウントを保存して有効化",
            filterAll: "全ログインアカウント",
            filterStaff: "管理者・講師・スタッフ",
            filterStudents: "入学済リード・受講生",
            instantNotice: "パスワードやタブ権限の変更は即座に反映されます",
            branchPrefix: "支部:",
            leadProfilePrefix: "リードID:",
            phonePrefix: "電話:",
            loginIdBox: "ログインメール / ID",
            passwordBox: "パスワード (編集可)",
            statusActive: "有効 (Active)",
            statusSuspended: "停止中 (Suspended)",
            allowedTabsHeader: "許可されたダッシュボード権限（チェックで付与・解除）:",
            modules: {
              my_profile: "マイプロフィール・ファイル",
              overview: "全体概要 (Overview)",
              crm: "CRM・リード管理",
              visa: "ビザパイプライン",
              lms: "日本語コース・LMS",
              b2b: "B2B・提携学校",
              finance: "財務・投資家情報",
              hr: "人事・給与管理",
              cms: "サイトCMS",
              store_blog: "ストア・ブログ管理",
              users: "ユーザー・権限管理",
            } as Record<DashboardTabId, string>,
            roles: {
              MAIN_ADMIN: "メイン管理者 (Super Admin)",
              BRANCH_ADMIN: "支部長 (Branch Admin)",
              TELE_COUNSELOR: "テレカウンセラー (CRM)",
              TEACHER: "主任講師 / 先生 (Teacher)",
              B2B_AGENT: "B2Bエージェント",
              INVESTOR: "投資家 (Investor View)",
              STUDENT: "受講生・ビザ申請者",
            } as Record<UserRole, string>,
            fillRequiredToast: "氏名、ログインID、パスワードを入力してください。",
            createdToast: "新しいログインアカウントを作成・有効化しました！",
            permUpdatedToast: "モジュールアクセス権限を更新しました！",
            settingsUpdatedToast: "アカウント設定を更新しました！",
            cannotDeleteAdminToast: "メイン管理者アカウントは削除できません。",
            deletedToast: "ログインアクセスを削除しました。",
          },
        },
        language,
      ),
    [language],
  );

  const allModuleIds: DashboardTabId[] = [
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
  ];

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
      onNotify(t.fillRequiredToast);
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
    onNotify(`${newEmail.trim()} — ${t.createdToast}`);
  };

  const handleToggleAccountTab = (acc: SystemUserAccount, tabId: DashboardTabId) => {
    const currentTabs = acc.allowedTabs || [];
    const updatedTabs = currentTabs.includes(tabId)
      ? currentTabs.filter((item) => item !== tabId)
      : [...currentTabs, tabId];

    upsertSystemAccount({
      ...acc,
      allowedTabs: updatedTabs,
    });
    refreshAccounts();
    onNotify(`${acc.name} — ${t.permUpdatedToast}`);
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
    onNotify(`${acc.name} — ${t.settingsUpdatedToast}`);
  };

  const handleDelete = (acc: SystemUserAccount) => {
    if (acc.role === "MAIN_ADMIN" && accounts.filter((a) => a.role === "MAIN_ADMIN").length <= 1) {
      onNotify(t.cannotDeleteAdminToast);
      return;
    }
    deleteSystemAccount(acc.id);
    refreshAccounts();
    onNotify(`${acc.name} — ${t.deletedToast}`);
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
              <span>{t.badge}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {t.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">{t.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#b91c1c] px-4 py-2.5 text-xs font-black text-white shadow-md hover:bg-red-800 transition"
          >
            <UserPlus className="h-4 w-4" />
            <span>{showCreateForm ? t.closeFormBtn : t.createAccountBtn}</span>
          </button>
        </div>

        {/* 4 Summary Cards */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-stone-200 bg-[#fcfaf7] p-4">
            <span className="text-xs font-bold text-slate-500">{t.card1Title}</span>
            <p className="text-2xl font-black text-slate-900 mt-1">
              {accounts.length} {t.usersSuffix}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">{t.card1Sub}</p>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-[#fcfaf7] p-4">
            <span className="text-xs font-bold text-slate-500">{t.card2Title}</span>
            <p className="text-2xl font-black text-emerald-800 mt-1">
              {staffCount} {t.usersSuffix}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">{t.card2Sub}</p>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-[#fcfaf7] p-4">
            <span className="text-xs font-bold text-slate-500">{t.card3Title}</span>
            <p className="text-2xl font-black text-indigo-800 mt-1">
              {studentCount} {t.usersSuffix}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">{t.card3Sub}</p>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-emerald-50/60 p-4">
            <span className="text-xs font-bold text-emerald-900">{t.card4Title}</span>
            <p className="text-base font-black text-emerald-800 mt-1">{t.card4Val}</p>
            <p className="text-[11px] text-emerald-700 mt-0.5">{t.card4Sub}</p>
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
                <span>{t.formHeader}</span>
              </h3>
              <button
                type="button"
                onClick={() =>
                  setNewPassword(`KNLTC#${Math.floor(1000 + Math.random() * 9000)}`)
                }
                className="text-xs font-bold text-[#b91c1c] hover:underline"
              >
                {t.autoPassBtn}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700">{t.nameLabel}</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder={t.namePlaceholder}
                  className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 font-bold"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700">{t.emailLabel}</label>
                <input
                  type="text"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="user@knltc.com"
                  className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 font-mono font-bold"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700">{t.passwordLabel}</label>
                <input
                  type="text"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 font-mono font-bold text-emerald-800"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700">{t.phoneLabel}</label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 font-mono"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700">{t.roleLabel}</label>
                <select
                  value={newRole}
                  onChange={(e) => handleRoleChangeForNew(e.target.value as UserRole)}
                  className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 font-bold"
                >
                  {Object.entries(t.roles).map(([roleKey, label]) => (
                    <option key={roleKey} value={roleKey}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700">{t.branchLabel}</label>
                <select
                  value={newBranch}
                  onChange={(e) => setNewBranch(e.target.value as BranchCode)}
                  className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 font-bold"
                >
                  <option value="ALL">{t.branchAll}</option>
                  <option value="DHK-HQ">{t.branchDhaka}</option>
                  <option value="KHULNA-01">{t.branchKhulna}</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-900 mb-2">
                {t.selectTabsLabel}
              </label>
              <div className="flex flex-wrap gap-2">
                {allModuleIds.map((modId) => {
                  const checked = newAllowedTabs.includes(modId);
                  return (
                    <label
                      key={modId}
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
                            prev.includes(modId)
                              ? prev.filter((item) => item !== modId)
                              : [...prev, modId],
                          )
                        }
                        className="h-3.5 w-3.5 accent-emerald-700"
                      />
                      <span>{t.modules[modId]}</span>
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
                {t.cancelBtn}
              </button>
              <button
                type="submit"
                className="rounded-xl bg-[#133e29] px-5 py-2 text-xs font-black text-white hover:bg-emerald-900 transition"
              >
                {t.saveAccountBtn}
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
              { id: "ALL", label: `${t.filterAll} (${accounts.length})` },
              { id: "STAFF", label: `${t.filterStaff} (${staffCount})` },
              { id: "STUDENTS", label: `${t.filterStudents} (${studentCount})` },
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
          <span className="text-xs text-slate-500">{t.instantNotice}</span>
        </div>

        <div className="space-y-4">
          {filteredAccounts.map((acc) => {
            const waText = encodeURIComponent(
              `Hello ${acc.name},\nYour KNLTC Portal Login Credentials:\n• Portal Link: ${typeof window !== "undefined" ? window.location.origin : ""}/admin/login\n• Login Email/ID: ${acc.email}\n• Password: ${acc.password}\n• Role: ${t.roles[acc.role] || acc.role}`,
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
                        {t.roles[acc.role] || acc.role}
                      </span>
                      <span className="rounded-full bg-stone-200 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                        {t.branchPrefix} {acc.branch}
                      </span>
                      {acc.linkedLeadId && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-900">
                          {t.leadProfilePrefix} {acc.linkedLeadId}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 font-mono">
                      {t.phonePrefix} {acc.phone || "N/A"}
                    </p>
                  </div>

                  {/* Login Credentials & Quick Controls */}
                  <div className="flex flex-wrap items-center gap-2.5 text-xs">
                    <div className="rounded-xl border border-stone-300 bg-white px-3 py-1.5">
                      <span className="text-[10px] font-bold text-slate-400 block">{t.loginIdBox}</span>
                      <span className="font-mono font-bold text-slate-900">{acc.email}</span>
                    </div>

                    <div className="rounded-xl border border-stone-300 bg-white px-3 py-1.5">
                      <span className="text-[10px] font-bold text-slate-400 block">{t.passwordBox}</span>
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
                      {Object.entries(t.roles).map(([k, v]) => (
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
                      {acc.status === "ACTIVE" ? t.statusActive : t.statusSuspended}
                    </button>

                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-2 font-bold text-white hover:bg-emerald-700 transition"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>WhatsApp</span>
                    </a>

                    {acc.role !== "MAIN_ADMIN" && (
                      <button
                        type="button"
                        onClick={() => handleDelete(acc)}
                        className="rounded-xl border border-rose-200 bg-rose-50 p-2 text-rose-700 hover:bg-rose-100 transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Granular Access Permissions Checkboxes */}
                <div className="mt-3">
                  <span className="text-[11px] font-bold text-slate-600 block mb-2">
                    {t.allowedTabsHeader}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {allModuleIds.map((modId) => {
                      const hasAccess = (acc.allowedTabs || []).includes(modId);
                      return (
                        <label
                          key={modId}
                          className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-bold cursor-pointer transition ${
                            hasAccess
                              ? "border-emerald-600 bg-emerald-50 text-emerald-950"
                              : "border-stone-200 bg-white text-slate-400 hover:text-slate-700"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={hasAccess}
                            onChange={() => handleToggleAccountTab(acc, modId)}
                            className="h-3 w-3 accent-emerald-700"
                          />
                          <span>{t.modules[modId]}</span>
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
