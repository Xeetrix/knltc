"use client";

import React from "react";
import {
  UserCheck,
  FileCheck2,
  GraduationCap,
  ShieldCheck,
  ExternalLink,
  Phone,
  MapPin,
  Award,
  CheckCircle2,
  Clock,
} from "lucide-react";
import type { CrmLead, VisaApplicant, LmsUserBridge } from "@/lib/knltc-cms-store";

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
  const currentStage = visaApplicant?.stage || 1;

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
                  ভর্তিকৃত প্রোফাইল ও ফাইল পোর্টাল
                </span>
                {lead?.fileTrackingNo || visaApplicant?.trackingNo ? (
                  <span className="rounded-full bg-red-100 px-3 py-0.5 text-xs font-mono font-bold text-[#b91c1c]">
                    Tracking: {lead?.fileTrackingNo || visaApplicant?.trackingNo}
                  </span>
                ) : null}
              </div>
              <h1 className="text-2xl font-black text-slate-900 mt-1">{lead?.name || userName}</h1>
              <p className="text-xs text-slate-500 font-mono">
                লগইন আইডি: {userEmail} {lead?.phone ? `• ফোন: ${lead.phone}` : ""}
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
              <span>LMS অনলাইন ক্লাসরুম</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* 4 Status Cards */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="rounded-2xl border border-stone-200 bg-[#fcfaf7] p-4">
            <span className="font-bold text-slate-500">ভর্তি ও ফাইল স্ট্যাটাস</span>
            <p className="text-base font-black text-emerald-800 mt-1 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>{lead?.status === "ADMITTED" ? "ভর্তি ও ফাইল ওপেনকৃত" : "সক্রিয় প্রোফাইল"}</span>
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              {lead?.enrolledBatchOrSession || visaApplicant?.intakeSession || "APRIL_2027 Session"}
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-[#fcfaf7] p-4">
            <span className="font-bold text-slate-500">টার্গেট জাপানি প্রতিষ্ঠান</span>
            <p className="text-base font-black text-slate-900 mt-1">
              {lead?.targetSchool || visaApplicant?.targetSchool || "HLA Gakuin (Hiroshima)"}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              প্যাকেজ: {lead?.packageType || visaApplicant?.packageType || "REGULAR"}
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-[#fcfaf7] p-4">
            <span className="font-bold text-slate-500">ভাষা কোর্স ও LMS অগ্রগতি</span>
            <p className="text-base font-black text-indigo-800 mt-1">
              {lmsBridge ? `${lmsBridge.courseLevel} (${lmsBridge.progressPercentage}%)` : lead?.japaneseProficiency || "LEARNING_N5"}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              {lmsBridge?.activeBatch || "নিয়মিত লাইভ ব্যাচ"}
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-[#fcfaf7] p-4">
            <span className="font-bold text-slate-500">দায়িত্বপ্রাপ্ত কাউন্সিলর ও শাখা</span>
            <p className="text-base font-black text-slate-900 mt-1">
              {lead?.assignedTo || visaApplicant?.counselorName || "শেখ বাসেত"}
            </p>
            <p className="text-[11px] text-emerald-700 font-bold mt-1">
              শাখা: {lead?.branch === "KHULNA-01" ? "খুলনা শাখা" : "ঢাকা প্রধান কার্যালয়"}
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
            <span>ব্যক্তিগত ও একাডেমিক বিবরণী</span>
          </h2>
          <dl className="mt-4 space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-stone-100">
              <dt className="text-slate-500 font-semibold">পূর্ণ নাম:</dt>
              <dd className="font-bold text-slate-900">{lead?.name || userName}</dd>
            </div>
            <div className="flex justify-between py-1.5 border-b border-stone-100">
              <dt className="text-slate-500 font-semibold">ফোন ও WhatsApp:</dt>
              <dd className="font-mono font-bold text-slate-900">{lead?.phone || "N/A"}</dd>
            </div>
            <div className="flex justify-between py-1.5 border-b border-stone-100">
              <dt className="text-slate-500 font-semibold">শহর ও ঠিকানা:</dt>
              <dd className="font-bold text-slate-900">{lead?.address || lead?.city || "ঢাকা"}</dd>
            </div>
            <div className="flex justify-between py-1.5 border-b border-stone-100">
              <dt className="text-slate-500 font-semibold">পাসপোর্ট নম্বর:</dt>
              <dd className="font-mono font-bold text-slate-900">{lead?.passportNo || "প্রক্রিয়াধীন"}</dd>
            </div>
            <div className="flex justify-between py-1.5 border-b border-stone-100">
              <dt className="text-slate-500 font-semibold">শিক্ষাগত যোগ্যতা:</dt>
              <dd className="font-bold text-slate-900">{lead?.education || "HSC / Equivalent"}</dd>
            </div>
            {lead?.gpaDetails && (
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <dt className="text-slate-500 font-semibold">GPA / রেজাল্ট:</dt>
                <dd className="font-bold text-slate-900">{lead.gpaDetails}</dd>
              </div>
            )}
            <div className="flex justify-between py-1.5 border-b border-stone-100">
              <dt className="text-slate-500 font-semibold">অভিভাবক / স্পন্সর:</dt>
              <dd className="font-bold text-slate-900">
                {lead?.guardianName || visaApplicant?.sponsorName || "নির্ধারিত অভিভাবক"}
              </dd>
            </div>
            <div className="pt-2">
              <dt className="text-slate-500 font-semibold mb-1">কাউন্সিলর মন্তব্য / নোটস:</dt>
              <dd className="rounded-xl bg-[#fcfaf7] border border-stone-200 p-3 text-slate-700 leading-relaxed">
                {lead?.notes || "আপনার ফাইল ও কোর্স কার্যক্রম নিয়মিত তদারকি করা হচ্ছে।"}
              </dd>
            </div>
          </dl>
        </div>

        {/* Right: 10-Step Visa File Progress */}
        <div className="lg:col-span-7 rounded-3xl border border-stone-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <FileCheck2 className="h-4 w-4 text-[#b91c1c]" />
              <span>আপনার ভিসা ফাইল প্রসেসিং অগ্রগতি (১০ ধাপ)</span>
            </h2>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-extrabold text-emerald-800">
              বর্তমান ধাপ: {currentStage} / ১০
            </span>
          </div>

          <div className="mt-4 space-y-2.5">
            {[
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
            ].map((item) => {
              const isCompleted = item.step < currentStage;
              const isCurrent = item.step === currentStage;
              return (
                <div
                  key={item.step}
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
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-extrabold ${
                        isCurrent
                          ? "bg-[#b91c1c] text-white"
                          : isCompleted
                            ? "bg-emerald-600 text-white"
                            : "bg-stone-200 text-slate-600"
                      }`}
                    >
                      {isCompleted ? "✓" : item.step}
                    </span>
                    <span>{item.title}</span>
                  </div>
                  <span className="text-[10px] font-bold">
                    {isCurrent ? "চলমান ধাপ" : isCompleted ? "সম্পন্ন" : "অপেক্ষমাণ"}
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
