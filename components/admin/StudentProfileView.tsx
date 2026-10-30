"use client";

import React, { useMemo } from "react";
import {
  UserCheck,
  FileCheck2,
  GraduationCap,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import {
  resolveVisaTrack,
  getStagesForVisaTrack,
  type CrmLead,
  type VisaApplicant,
  type LmsUserBridge,
} from "@/lib/knltc-cms-store";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";

export default function StudentProfileView({
  lead,
  visaApplicant,
  lmsBridge,
  userEmail,
  userName,
}: {
  lead?: CrmLead | null;
  visaApplicant?: VisaApplicant | null;
  lmsBridge?: LmsUserBridge | null;
  userEmail: string;
  userName: string;
}) {
  const { language } = useLanguage();
  const activeTrack = resolveVisaTrack(visaApplicant || undefined, lead || undefined);
  const trackStages = getStagesForVisaTrack(activeTrack);
  const currentStage = Math.min(trackStages.length, visaApplicant?.stage || 1);

  const t = useMemo(
    () =>
      translate(
        {
          en: {
            portalBadge: "Enrolled Student & File Portal",
            loginIdPrefix: "Login ID:",
            phonePrefix: "Phone:",
            lmsBtn: "LMS Online Classroom",
            card1Title: "Enrollment & File Status",
            card1Admitted: "Admitted & File Opened",
            card1Active: "Active Profile",
            card2Title: "Target Japanese Institution",
            card2Package: "Package:",
            card3Title: "Language Course & LMS Progress",
            card3DefaultBatch: "Regular Live Batch",
            card4Title: "Assigned Counselor & Branch",
            branchPrefix: "Branch:",
            branchDhaka: "Dhaka HQ",
            branchKhulna: "Khulna Branch",
            bioHeading: "Personal & Academic Information",
            fullName: "Full Name:",
            phoneWa: "Phone & WhatsApp:",
            cityAddress: "City & Address:",
            passport: "Passport No:",
            passportProcessing: "In Process",
            education: "Education:",
            gpaResult: "GPA / Result:",
            guardianSponsor: "Guardian / Sponsor:",
            guardianDefault: "Designated Guardian",
            counselorNotes: "Counselor Remarks / Notes:",
            defaultNote: "Your visa file and language course progress are under regular supervision.",
            visaHeading: "Your Visa File Processing Progress (10 Stages)",
            currentStageLabel: "Current Stage:",
            statusCurrent: "In Progress",
            statusCompleted: "Completed",
            statusPending: "Upcoming",
            steps: [
              { step: 1, title: "File Opening & Profile Registration (৳0 Advance)" },
              { step: 2, title: "Japanese Language Training (JLPT N5 / N4)" },
              { step: 3, title: "Academic & Sponsor Document Translation & Notary" },
              { step: 4, title: "Zoom Interview with Japanese School / Company" },
              { step: 5, title: "COE Application Submission to Japan Immigration Bureau" },
              { step: 6, title: "Pre-Visa (COE - Certificate of Eligibility) Approval" },
              { step: 7, title: "College Tuition Fee Transfer & Original COE Collection" },
              { step: 8, title: "Japan Embassy Interview Prep & VFS Submission" },
              { step: 9, title: "Visa Stamping in Passport & Service Charge Settlement" },
              { step: 10, title: "Air Ticket, Airport Pickup & Part-Time Job Support in Japan" },
            ],
          },
          bn: {
            portalBadge: "ভর্তিকৃত প্রোফাইল ও ফাইল পোর্টাল",
            loginIdPrefix: "লগইন আইডি:",
            phonePrefix: "ফোন:",
            lmsBtn: "LMS অনলাইন ক্লাসরুম",
            card1Title: "ভর্তি ও ফাইল স্ট্যাটাস",
            card1Admitted: "ভর্তি ও ফাইল ওপেনকৃত",
            card1Active: "সক্রিয় প্রোফাইল",
            card2Title: "টার্গেট জাপানি প্রতিষ্ঠান",
            card2Package: "প্যাকেজ:",
            card3Title: "ভাষা কোর্স ও LMS অগ্রগতি",
            card3DefaultBatch: "নিয়মিত লাইভ ব্যাচ",
            card4Title: "দায়িত্বপ্রাপ্ত কাউন্সিলর ও শাখা",
            branchPrefix: "শাখা:",
            branchDhaka: "ঢাকা প্রধান কার্যালয়",
            branchKhulna: "খুলনা শাখা",
            bioHeading: "ব্যক্তিগত ও একাডেমিক বিবরণী",
            fullName: "পূর্ণ নাম:",
            phoneWa: "ফোন ও WhatsApp:",
            cityAddress: "শহর ও ঠিকানা:",
            passport: "পাসপোর্ট নম্বর:",
            passportProcessing: "প্রক্রিয়াধীন",
            education: "শিক্ষাগত যোগ্যতা:",
            gpaResult: "GPA / রেজাল্ট:",
            guardianSponsor: "অভিভাবক / স্পন্সর:",
            guardianDefault: "নির্ধারিত অভিভাবক",
            counselorNotes: "কাউন্সিলর মন্তব্য / নোটস:",
            defaultNote: "আপনার ফাইল ও কোর্স কার্যক্রম নিয়মিত তদারকি করা হচ্ছে।",
            visaHeading: "আপনার ভিসা ফাইল প্রসেসিং অগ্রগতি (১০ ধাপ)",
            currentStageLabel: "বর্তমান ধাপ:",
            statusCurrent: "চলমান ধাপ",
            statusCompleted: "সম্পন্ন",
            statusPending: "অপেক্ষমাণ",
            steps: [
              { step: 1, title: "ফাইল ওপেনিং ও প্রোফাইল নিবন্ধন (৳০ অগ্রিম)" },
              { step: 2, title: "জাপানি ভাষা প্রশিক্ষণ (JLPT N5 / N4)" },
              { step: 3, title: "একাডেমিক ও স্পন্সর ডকুমেন্ট অনুবাদ এবং নোটারি" },
              { step: 4, title: "জাপানি স্কুল / কোম্পানির সাথে জুম ইন্টারভিউ" },
              { step: 5, title: "জাপান ইমিগ্রেশন ব্যুরোতে COE আবেদন জমাদান" },
              { step: 6, title: "প্রি-ভিসা (COE - Certificate of Eligibility) অনুমোদন" },
              { step: 7, title: "কলেজ টিউশন ফি প্রেরণ ও মূল COE সংগ্রহ" },
              { step: 8, title: "জাপান এম্বাসি ইন্টারভিউ প্রিপারেশন ও VFS আবেদন" },
              { step: 9, title: "পাসপোর্টে ভিসা সিলমোহর ও সার্ভিস চার্জ নিষ্পত্তি" },
              { step: 10, title: "এয়ার টিকিট, এয়ারপোর্ট পিকআপ ও জাপানে পার্ট-টাইম জব সাপোর্ট" },
            ],
          },
          ja: {
            portalBadge: "受講生プロフィール＆ビザ進捗ポータル",
            loginIdPrefix: "ログインID:",
            phonePrefix: "電話:",
            lmsBtn: "LMSオンライン教室",
            card1Title: "入学・ファイルステータス",
            card1Admitted: "入学・ファイル開設済",
            card1Active: "有効なプロフィール",
            card2Title: "志望日本の教育機関・企業",
            card2Package: "パッケージ:",
            card3Title: "日本語コース＆LMS進捗",
            card3DefaultBatch: "レギュラーライブバッチ",
            card4Title: "担当カウンセラー・支部",
            branchPrefix: "支部:",
            branchDhaka: "ダッカ本部",
            branchKhulna: "クルナ支部",
            bioHeading: "個人情報・学歴詳細",
            fullName: "氏名:",
            phoneWa: "電話番号 & WhatsApp:",
            cityAddress: "都市・住所:",
            passport: "パスポート番号:",
            passportProcessing: "手続き中",
            education: "最終学歴:",
            gpaResult: "GPA / 成績:",
            guardianSponsor: "保護者 / スポンサー:",
            guardianDefault: "指定保護者",
            counselorNotes: "カウンセラーメモ:",
            defaultNote: "あなたのビザファイルとコース進捗は定期的に管理されています。",
            visaHeading: "ビザ申請ファイル進捗状況 (全10段階)",
            currentStageLabel: "現在の段階:",
            statusCurrent: "進行中",
            statusCompleted: "完了",
            statusPending: "待機中",
            steps: [
              { step: 1, title: "ファイル開設・プロフィール登録 (前金 ৳0)" },
              { step: 2, title: "日本語トレーニング (JLPT N5 / N4)" },
              { step: 3, title: "学歴・スポンサー書類翻訳および公証" },
              { step: 4, title: "日本の学校・受入企業とのZoom面接" },
              { step: 5, title: "出入国在留管理局へのCOE申請提出" },
              { step: 6, title: "在留資格認定証明書 (COE) 交付" },
              { step: 7, title: "学費送金およびCOE原本受取" },
              { step: 8, title: "日本大使館面接対策およびVFS申請" },
              { step: 9, title: "パスポートのビザ発給および成約手数料精算" },
              { step: 10, title: "航空券手配、空港出迎え＆日本でのアルバイト支援" },
            ],
          },
        },
        language,
      ),
    [language],
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Personal Banner */}
      <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#133e29] text-white font-black text-2xl shadow-md">
              {(lead?.name || userName || "KN").slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-extrabold text-emerald-900">
                  {t.portalBadge}
                </span>
                {lead?.fileTrackingNo || visaApplicant?.trackingNo ? (
                  <span className="rounded-full bg-red-100 px-3 py-0.5 text-xs font-mono font-bold text-[#b91c1c]">
                    Tracking: {lead?.fileTrackingNo || visaApplicant?.trackingNo}
                  </span>
                ) : null}
              </div>
              <h1 className="text-2xl font-black text-slate-900 mt-1">{lead?.name || userName}</h1>
              <p className="text-xs text-slate-500 font-mono">
                {t.loginIdPrefix} {userEmail} {lead?.phone ? `• ${t.phonePrefix} ${lead.phone}` : ""}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href="https://npw.bd/knltc"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#133e29] px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-900 transition"
            >
              <GraduationCap className="h-4 w-4" />
              <span>{t.lmsBtn}</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* 4 Status Cards */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="rounded-2xl border border-stone-200 bg-[#fcfaf7] p-4">
            <span className="font-bold text-slate-500">{t.card1Title}</span>
            <p className="text-base font-black text-emerald-800 mt-1 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>{lead?.status === "ADMITTED" ? t.card1Admitted : t.card1Active}</span>
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              {lead?.enrolledBatchOrSession || visaApplicant?.intakeSession || "—"}
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-[#fcfaf7] p-4">
            <span className="font-bold text-slate-500">{t.card2Title}</span>
            <p className="text-base font-black text-slate-900 mt-1">
              {lead?.targetSchool || visaApplicant?.targetSchool || "—"}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              {t.card2Package} {lead?.packageType || visaApplicant?.packageType || "—"}
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-[#fcfaf7] p-4">
            <span className="font-bold text-slate-500">{t.card3Title}</span>
            <p className="text-base font-black text-indigo-800 mt-1">
              {lmsBridge ? `${lmsBridge.courseLevel} (${lmsBridge.progressPercentage}%)` : lead?.japaneseProficiency || "—"}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              {lmsBridge?.activeBatch || "—"}
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-[#fcfaf7] p-4">
            <span className="font-bold text-slate-500">{t.card4Title}</span>
            <p className="text-base font-black text-slate-900 mt-1">
              {lead?.assignedTo || visaApplicant?.counselorName || "—"}
            </p>
            <p className="text-[11px] text-emerald-700 font-bold mt-1">
              {t.branchPrefix} {lead?.branch === "KHULNA-01" ? t.branchKhulna : t.branchDhaka}
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Bio & 10-Step Visa Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Personal & Academic Information */}
        <div className="lg:col-span-5 rounded-3xl border border-stone-200 bg-white p-6 shadow-xs">
          <h2 className="text-base font-black text-slate-900 flex items-center gap-2 border-b border-stone-100 pb-3">
            <UserCheck className="h-4 w-4 text-emerald-700" />
            <span>{t.bioHeading}</span>
          </h2>
          <dl className="mt-4 space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-stone-100">
              <dt className="text-slate-500 font-semibold">{t.fullName}</dt>
              <dd className="font-bold text-slate-900">{lead?.name || userName || "—"}</dd>
            </div>
            <div className="flex justify-between py-1.5 border-b border-stone-100">
              <dt className="text-slate-500 font-semibold">{t.phoneWa}</dt>
              <dd className="font-mono font-bold text-slate-900">{lead?.phone || "—"}</dd>
            </div>
            <div className="flex justify-between py-1.5 border-b border-stone-100">
              <dt className="text-slate-500 font-semibold">{t.cityAddress}</dt>
              <dd className="font-bold text-slate-900">{lead?.address || lead?.city || "—"}</dd>
            </div>
            <div className="flex justify-between py-1.5 border-b border-stone-100">
              <dt className="text-slate-500 font-semibold">{t.passport}</dt>
              <dd className="font-mono font-bold text-slate-900">{lead?.passportNo || t.passportProcessing}</dd>
            </div>
            <div className="flex justify-between py-1.5 border-b border-stone-100">
              <dt className="text-slate-500 font-semibold">{t.education}</dt>
              <dd className="font-bold text-slate-900">{lead?.education || "—"}</dd>
            </div>
            {lead?.gpaDetails && (
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <dt className="text-slate-500 font-semibold">{t.gpaResult}</dt>
                <dd className="font-bold text-slate-900">{lead.gpaDetails}</dd>
              </div>
            )}
            <div className="flex justify-between py-1.5 border-b border-stone-100">
              <dt className="text-slate-500 font-semibold">{t.guardianSponsor}</dt>
              <dd className="font-bold text-slate-900">
                {lead?.guardianName || visaApplicant?.sponsorName || "—"}
              </dd>
            </div>
            <div className="pt-2">
              <dt className="text-slate-500 font-semibold mb-1">{t.counselorNotes}</dt>
              <dd className="rounded-xl bg-[#fcfaf7] border border-stone-200 p-3 text-slate-700 leading-relaxed">
                {lead?.notes || "—"}
              </dd>
            </div>
          </dl>
        </div>

        {/* Right: Multi-Track Visa File Progress */}
        <div className="lg:col-span-7 rounded-3xl border border-stone-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <FileCheck2 className="h-4 w-4 text-[#b91c1c]" />
              <span>
                {activeTrack === "TITP"
                  ? language === "bn"
                    ? "আপনার TITP টেকনিক্যাল ইন্টার্ন ভিসা অগ্রগতি (৯ ধাপ)"
                    : "Your TITP Technical Intern Visa Progress (9 Stages)"
                  : activeTrack === "SSW"
                    ? language === "bn"
                      ? "আপনার SSW জব ভিসা প্রসেসিং অগ্রগতি (১০ ধাপ)"
                      : "Your SSW Job Visa Processing Progress (10 Stages)"
                    : t.visaHeading}
              </span>
            </h2>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-extrabold text-emerald-800">
              {t.currentStageLabel} {currentStage} / {trackStages.length}
            </span>
          </div>

          <div className="mt-4 space-y-2.5">
            {trackStages.map((item) => {
              const isCompleted = item.stage < currentStage;
              const isCurrent = item.stage === currentStage;
              const stepTitle =
                language === "bn"
                  ? `${item.titleBn} — ${item.subBn}`
                  : language === "ja"
                    ? `${item.titleJa} — ${item.subJa}`
                    : `${item.titleEn} — ${item.subEn}`;
              return (
                <div
                  key={`${activeTrack}-${item.stage}`}
                  className={`flex items-center justify-between rounded-xl border p-3 text-xs transition ${
                    isCurrent
                      ? "border-[#b91c1c] bg-red-50/50 font-black text-slate-900"
                      : isCompleted
                        ? "border-emerald-200 bg-emerald-50/40 text-emerald-950 font-semibold"
                        : "border-stone-200 bg-stone-50/50 text-slate-500"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold ${
                        isCurrent
                          ? "bg-[#b91c1c] text-white"
                          : isCompleted
                            ? "bg-emerald-600 text-white"
                            : "bg-stone-200 text-slate-600"
                      }`}
                    >
                      {isCompleted ? "✓" : item.stage}
                    </span>
                    <span>{stepTitle}</span>
                  </div>
                  <span className="text-[10px] font-bold shrink-0">
                    {isCurrent ? t.statusCurrent : isCompleted ? t.statusCompleted : t.statusPending}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
