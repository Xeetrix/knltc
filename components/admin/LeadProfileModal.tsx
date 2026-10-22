"use client";

import React, { useState } from "react";
import {
  X,
  UserCheck,
  KeyRound,
  FileCheck2,
  GraduationCap,
  ShieldCheck,
  Send,
  Save,
  Sparkles,
  CheckCircle2,
  Copy,
  Phone,
  MapPin,
  BookOpen,
} from "lucide-react";
import {
  updateCrmLeadProfile,
  provisionLeadLoginAndEnrollment,
  type CrmLead,
  type DashboardTabId,
  type LeadStatus,
  type ServiceInterest,
  type UserRole,
} from "@/lib/knltc-cms-store";

const AVAILABLE_STUDENT_TABS: { id: DashboardTabId; label: string; desc: string }[] = [
  {
    id: "my_profile",
    label: "নিজস্ব প্রোফাইল ও ফাইল ট্র্যাকার (My Profile & File)",
    desc: "নিজের ভর্তি তথ্য, ফাইল ওপেনিং স্ট্যাটাস ও ব্যক্তিগত প্রোফাইল দেখবে",
  },
  {
    id: "visa",
    label: "ভিসা প্রসেসিং ও ১০-ধাপ ট্র্যাকার (Visa Pipeline)",
    desc: "COE, স্কুল ইন্টারভিউ ও ভিসা প্রসেসিংয়ের ধাপসমূহ ট্র্যাক করতে পারবে",
  },
  {
    id: "lms",
    label: "ভাষা কোর্স ও LMS ক্লাসরুম (Language & LMS)",
    desc: "N5/N4 মিন্না নো নিহোঙ্গো লেসন ও অনলাইন ক্লাসরুম অ্যাক্সেস পাবে",
  },
  {
    id: "store_blog",
    label: "বুক স্টোর ও গাইডলাইন (Book Store & Blog)",
    desc: "বই অর্ডার ও ভিসা গাইডলাইন দেখতে পারবে",
  },
  {
    id: "overview",
    label: "ড্যাশবোর্ড ওভারভিউ (Overview)",
    desc: "সামগ্রিক নোটিশ ও ইনটেক আপডেট দেখতে পারবে",
  },
];

export default function LeadProfileModal({
  lead,
  onClose,
  onSaved,
}: {
  lead: CrmLead;
  onClose: () => void;
  onSaved: (message: string) => void;
}) {
  // Personal & Academic Profile State
  const [name, setName] = useState(lead.name || "");
  const [phone, setPhone] = useState(lead.phone || "");
  const [whatsapp, setWhatsapp] = useState(lead.whatsapp || lead.phone || "");
  const [email, setEmail] = useState(lead.email || "");
  const [city, setCity] = useState(lead.city || "ঢাকা");
  const [address, setAddress] = useState(lead.address || "");
  const [passportNo, setPassportNo] = useState(lead.passportNo || "");
  const [guardianName, setGuardianName] = useState(lead.guardianName || "");
  const [guardianPhone, setGuardianPhone] = useState(lead.guardianPhone || "");
  const [education, setEducation] = useState(lead.education || "HSC");
  const [gpaDetails, setGpaDetails] = useState(lead.gpaDetails || "");
  const [studyGapYears, setStudyGapYears] = useState<number>(lead.studyGapYears ?? 0);
  const [japaneseProficiency, setJapaneseProficiency] = useState<CrmLead["japaneseProficiency"]>(
    lead.japaneseProficiency || "NONE",
  );
  const [interest, setInterest] = useState<ServiceInterest>(lead.interest || "STUDENT_VISA_REGULAR");
  const [status, setStatus] = useState<LeadStatus>(lead.status || "NEW");
  const [branch, setBranch] = useState<"DHK-HQ" | "KHULNA-01">(lead.branch || "DHK-HQ");
  const [assignedTo, setAssignedTo] = useState(lead.assignedTo || "সুমাইয়া সুলতানা (টেলি-কাউন্সেলর)");
  const [followUpDate, setFollowUpDate] = useState(
    lead.followUpDate || new Date().toISOString().slice(0, 10),
  );
  const [notes, setNotes] = useState(lead.notes || "");

  // Admission / File Open & Login Access Provisioning State
  const defaultSuggestedLogin =
    lead.loginEmail ||
    lead.email ||
    `${(lead.name || "student").toLowerCase().replace(/[^a-z0-9]/g, "") || lead.phone.slice(-4)}@knltc.com`;

  const [isCourseEnrolled, setIsCourseEnrolled] = useState<boolean>(
    Boolean(lead.isCourseEnrolled || lead.status === "ADMITTED"),
  );
  const [isFileOpened, setIsFileOpened] = useState<boolean>(
    Boolean(lead.isFileOpened || lead.status === "ADMITTED"),
  );
  const [courseLevel, setCourseLevel] = useState<"N5" | "N4" | "IRODORI">("N5");
  const [packageType, setPackageType] = useState<"REGULAR" | "PREMIUM">(lead.packageType || "REGULAR");
  const [targetSchool, setTargetSchool] = useState(lead.targetSchool || "HLA Gakuin (Hiroshima)");
  const [enrolledBatchOrSession, setEnrolledBatchOrSession] = useState(
    lead.enrolledBatchOrSession || "APRIL_2027 • N5 Special Batch",
  );
  const [loginEmail, setLoginEmail] = useState(defaultSuggestedLogin);
  const [loginPassword, setLoginPassword] = useState(
    lead.loginPassword || `knltc${lead.phone.replace(/\D/g, "").slice(-4) || "2026"}`,
  );
  const [role, setRole] = useState<UserRole>("STUDENT");
  const [allowedTabs, setAllowedTabs] = useState<DashboardTabId[]>(
    lead.allowedTabs && lead.allowedTabs.length > 0
      ? lead.allowedTabs
      : ["my_profile", "visa", "lms"],
  );

  const toggleTabPermission = (tabId: DashboardTabId) => {
    setAllowedTabs((prev) =>
      prev.includes(tabId) ? prev.filter((t) => t !== tabId) : [...prev, tabId],
    );
  };

  const generateRandomPassword = () => {
    const digits = Math.floor(1000 + Math.random() * 9000);
    setLoginPassword(`JP@${digits}`);
  };

  const handleSaveProfileOnly = () => {
    updateCrmLeadProfile(lead.id, {
      name,
      phone,
      whatsapp,
      email,
      city,
      address,
      passportNo,
      guardianName,
      guardianPhone,
      education,
      gpaDetails,
      studyGapYears,
      japaneseProficiency,
      interest,
      status,
      branch,
      assignedTo,
      followUpDate,
      notes,
    });
    onSaved(`${name}-এর প্রোফাইল তথ্য সফলভাবে আপডেট হয়েছে!`);
  };

  const handleProvisionLoginAndAdmission = () => {
    if (!loginEmail.trim() || !loginPassword.trim()) {
      onSaved("লগইন ইমেইল/আইডি এবং পাসওয়ার্ড প্রদান করুন।");
      return;
    }

    const finalTabs: DashboardTabId[] =
      allowedTabs.length > 0 ? allowedTabs : ["my_profile", "visa", "lms"];

    provisionLeadLoginAndEnrollment(
      {
        id: lead.id,
        name,
        phone,
        whatsapp,
        email,
        city,
        education,
        interest,
        branch,
        notes,
      },
      {
        loginEmail: loginEmail.trim(),
        loginPassword: loginPassword.trim(),
        role,
        allowedTabs: finalTabs,
        isFileOpened,
        isCourseEnrolled,
        enrolledBatchOrSession,
        packageType,
        targetSchool,
        courseLevel,
        accountStatus: "ACTIVE",
        address,
        passportNo,
        guardianName,
        guardianPhone,
        gpaDetails,
      },
    );

    // Also update full profile fields
    updateCrmLeadProfile(lead.id, {
      name,
      phone,
      whatsapp,
      email: loginEmail.trim(),
      city,
      address,
      passportNo,
      guardianName,
      guardianPhone,
      education,
      gpaDetails,
      studyGapYears,
      japaneseProficiency,
      interest,
      status: isFileOpened || isCourseEnrolled ? "ADMITTED" : status,
      branch,
      assignedTo,
      followUpDate,
      notes,
      isFileOpened,
      isCourseEnrolled,
      enrolledBatchOrSession,
      packageType,
      targetSchool,
      hasLoginAccess: true,
      loginEmail: loginEmail.trim().toLowerCase(),
      loginPassword: loginPassword.trim(),
      allowedTabs: finalTabs,
    });

    onSaved(
      `${name}-এর ভর্তি/ফাইল ওপেন এবং লগইন অ্যাক্সেস (${loginEmail.trim()}) সফলভাবে চালু করা হয়েছে!`,
    );
    onClose();
  };

  const waCredentialsMessage = encodeURIComponent(
    `আসসালামু আলাইকুম ${name},\nKNLTC (Japan Gateway)-তে আপনার প্রোফাইল ও ফাইল সফলভাবে নিবন্ধিত হয়েছে।\n\n🔐 আপনার পোর্টাল লগইন ডিটেইলস:\n• পোর্টাল লিঙ্ক: ${typeof window !== "undefined" ? window.location.origin : ""}/admin/login\n• লগইন আইডি/ইমেইল: ${loginEmail}\n• পাসওয়ার্ড: ${loginPassword}\n• ব্যাচ/সেশন: ${enrolledBatchOrSession}\n\nধন্যবাদান্তে,\nKNLTC কর্তৃপক্ষ`,
  );
  const waLink = `https://wa.me/${(whatsapp || phone).replace(/[^0-9]/g, "")}?text=${waCredentialsMessage}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-3 sm:p-6 backdrop-blur-xs overflow-y-auto">
      <div className="relative my-auto w-full max-w-5xl rounded-3xl border border-stone-200 bg-white shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-stone-200 bg-[#133e29] px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 font-black text-lg text-emerald-200">
              {name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-black tracking-tight">{name} — ব্যক্তিগত লিড প্রোফাইল</h2>
                <span className="rounded-full bg-emerald-700/80 px-2.5 py-0.5 text-[10px] font-bold text-emerald-100 border border-emerald-500/40">
                  ID: {lead.id}
                </span>
                {lead.hasLoginAccess && (
                  <span className="rounded-full bg-amber-400 px-2.5 py-0.5 text-[10px] font-black text-slate-950">
                    লগইন চালু আছে
                  </span>
                )}
              </div>
              <p className="text-xs text-emerald-100/90 mt-0.5">
                লিডের সম্পূর্ণ বায়োডাটা, কাউন্সিলিং নোট এবং ভর্তি/ফাইল ওপেনকারীদের জন্য নির্দিষ্ট অ্যাক্সেসসহ লগইন তৈরি করুন
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl bg-white/10 p-2 text-white hover:bg-white/20 transition"
            title="বন্ধ করুন"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 overflow-y-auto">
          {/* LEFT COLUMN (7 Cols): Individual Lead Bio, Academic & Counseling Profile */}
          <div className="lg:col-span-7 space-y-5">
            <div className="rounded-2xl border border-stone-200 bg-[#fcfaf7] p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-emerald-700" />
                  <span>১. ব্যক্তিগত ও একাডেমিক প্রোফাইল (Lead Profile Details)</span>
                </h3>
                <span className="text-[11px] font-semibold text-slate-500">
                  তৈরি: {new Date(lead.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <div>
                  <label className="font-bold text-slate-700">প্রার্থীর পূর্ণ নাম *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">ফোন নম্বর *</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 font-mono font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">WhatsApp নম্বর</label>
                  <input
                    type="text"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">ইমেইল ঠিকানা</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="candidate@email.com"
                    className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">জেলা / শহর</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">পাসপোর্ট নম্বর (যদি থাকে)</label>
                  <input
                    type="text"
                    value={passportNo}
                    onChange={(e) => setPassportNo(e.target.value)}
                    placeholder="e.g. A04928172"
                    className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 font-mono"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700">বর্তমান ও স্থায়ী ঠিকানা</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="বাসা/রোড, থানা, জেলা..."
                    className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">অভিভাবক / স্পন্সরের নাম</label>
                  <input
                    type="text"
                    value={guardianName}
                    onChange={(e) => setGuardianName(e.target.value)}
                    placeholder="পিতা / মাতা / ভাই"
                    className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">অভিভাবকের ফোন নম্বর</label>
                  <input
                    type="text"
                    value={guardianPhone}
                    onChange={(e) => setGuardianPhone(e.target.value)}
                    placeholder="017..."
                    className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">সর্বশেষ শিক্ষাগত যোগ্যতা</label>
                  <input
                    type="text"
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    placeholder="HSC / Diploma / BSc / Honours"
                    className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 font-semibold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">GPA / CGPA বিবরণ</label>
                  <input
                    type="text"
                    value={gpaDetails}
                    onChange={(e) => setGpaDetails(e.target.value)}
                    placeholder="SSC 4.50, HSC 4.25"
                    className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">জাপানি ভাষার দক্ষতা</label>
                  <select
                    value={japaneseProficiency}
                    onChange={(e) => setJapaneseProficiency(e.target.value as any)}
                    className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 font-bold"
                  >
                    <option value="NONE">শুরু করেনি (NONE)</option>
                    <option value="LEARNING_N5">N5 শিখছে (LEARNING_N5)</option>
                    <option value="PASSED_N5">JLPT/NAT N5 পাস (PASSED_N5)</option>
                    <option value="PASSED_N4">JLPT/JFT N4 পাস (PASSED_N4)</option>
                    <option value="NAT_JFT">NAT / JFT Basic পাস</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700">স্টাডি গ্যাপ (বছর)</label>
                  <input
                    type="number"
                    min={0}
                    max={15}
                    value={studyGapYears}
                    onChange={(e) => setStudyGapYears(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">আগ্রহের প্রোগ্রাম / ভিসা</label>
                  <select
                    value={interest}
                    onChange={(e) => setInterest(e.target.value as ServiceInterest)}
                    className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 font-bold text-emerald-900"
                  >
                    <option value="STUDENT_VISA_REGULAR">স্টুডেন্ট ভিসা (রেগুলার প্যাকেজ)</option>
                    <option value="STUDENT_VISA_PREMIUM">স্টুডেন্ট ভিসা (প্রিমিয়াম প্যাকেজ)</option>
                    <option value="SSW_CONSTRUCTION_SPECIAL">SSW কনস্ট্রাকশন স্পেশাল</option>
                    <option value="SSW_CAREGIVER">SSW কেয়ারগিভার (নার্সিং)</option>
                    <option value="SSW_AGRICULTURE">SSW এগ্রিকালচার</option>
                    <option value="SSW_FOOD_SERVICE">SSW ফুড সার্ভিস</option>
                    <option value="TITP_TECHNICAL">TITP টেকনিক্যাল ইন্টার্ন</option>
                    <option value="JAPANESE_N5">জাপানি ভাষা N5 কোর্স</option>
                    <option value="JAPANESE_N4">জাপানি ভাষা N4 কোর্স</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700">লিড স্ট্যাটাস</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as LeadStatus)}
                    className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 font-bold"
                  >
                    <option value="NEW">নতুন লিড (NEW)</option>
                    <option value="CONTACTED">যোগাযোগ হয়েছে (CONTACTED)</option>
                    <option value="COUNSELED">কাউন্সিলিং সম্পন্ন (COUNSELED)</option>
                    <option value="OFFICE_VISIT_BOOKED">অফিস ভিজিট বুকড (OFFICE_VISIT_BOOKED)</option>
                    <option value="ADMITTED">ভর্তি / ফাইল ওপেন (ADMITTED)</option>
                    <option value="ARCHIVED">আর্কাইভড (ARCHIVED)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700">শাখা (Branch)</label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value as "DHK-HQ" | "KHULNA-01")}
                    className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 font-bold"
                  >
                    <option value="DHK-HQ">ঢাকা প্রধান কার্যালয় (DHK-HQ)</option>
                    <option value="KHULNA-01">খুলনা শাখা (KHULNA-01)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700">দায়িত্বপ্রাপ্ত কাউন্সিলর</label>
                  <input
                    type="text"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700">কাউন্সিলিং ও ফলো-আপ নোটস</label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="প্রার্থীর ব্যাংক সলভেন্সি, পরিবারের মতামত ও পরবর্তী ফলো-আপের বিস্তারিত..."
                    className="mt-1 w-full rounded-xl border border-stone-300 bg-white p-3 text-xs leading-relaxed"
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveProfileOnly}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-700 bg-emerald-50 px-4 py-2 text-xs font-extrabold text-emerald-900 hover:bg-emerald-100 transition"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>শুধু প্রোফাইল তথ্য সেভ করুন</span>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (5 Cols): Admission / File Open & Login Access Provisioning */}
          <div className="lg:col-span-5 space-y-5">
            <div className="rounded-2xl border-2 border-[#b91c1c]/30 bg-gradient-to-b from-red-50/50 to-white p-5 shadow-xs">
              <div className="flex items-center gap-2 text-[#b91c1c]">
                <KeyRound className="h-5 w-5" />
                <h3 className="text-sm font-black text-slate-900">
                  ২. ভর্তি / ফাইল ওপেন ও লগইন অ্যাক্সেস ম্যানেজমেন্ট
                </h3>
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                এই লিড যদি কোর্সে ভর্তি হন অথবা ভিসা ফাইল ওপেন করেন, তবে তার জন্য নির্দিষ্ট মডিউল অ্যাক্সেসসহ পোর্টাল লগইন তৈরি করুন:
              </p>

              {/* Enrollment & File Open Checkboxes */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <label
                  className={`flex items-start gap-2.5 rounded-xl border p-3 cursor-pointer transition ${
                    isCourseEnrolled
                      ? "border-emerald-600 bg-emerald-50/70"
                      : "border-stone-200 bg-white"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isCourseEnrolled}
                    onChange={(e) => setIsCourseEnrolled(e.target.checked)}
                    className="mt-0.5 h-4 w-4 accent-emerald-700"
                  />
                  <div className="text-xs">
                    <p className="font-extrabold text-slate-900">ভাষা কোর্সে ভর্তি</p>
                    <p className="text-[10px] text-slate-500">LMS ও ক্লাসরুম চালু হবে</p>
                  </div>
                </label>

                <label
                  className={`flex items-start gap-2.5 rounded-xl border p-3 cursor-pointer transition ${
                    isFileOpened
                      ? "border-[#b91c1c] bg-red-50/60"
                      : "border-stone-200 bg-white"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isFileOpened}
                    onChange={(e) => setIsFileOpened(e.target.checked)}
                    className="mt-0.5 h-4 w-4 accent-[#b91c1c]"
                  />
                  <div className="text-xs">
                    <p className="font-extrabold text-slate-900">ভিসা ফাইল ওপেন</p>
                    <p className="text-[10px] text-slate-500">১০-ধাপ ভিসা বোর্ডে যুক্ত হবে</p>
                  </div>
                </label>
              </div>

              {/* Batch / Session & School Configuration */}
              <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700">ভর্তিকৃত ব্যাচ / ইনটেক সেশন</label>
                  <input
                    type="text"
                    value={enrolledBatchOrSession}
                    onChange={(e) => setEnrolledBatchOrSession(e.target.value)}
                    placeholder="APRIL_2027 • N5 Batch"
                    className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 font-semibold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">কোর্স লেভেল ও প্যাকেজ</label>
                  <div className="mt-1 flex gap-1.5">
                    <select
                      value={courseLevel}
                      onChange={(e) => setCourseLevel(e.target.value as any)}
                      className="w-1/2 rounded-xl border border-stone-300 bg-white px-2 py-2 font-bold"
                    >
                      <option value="N5">N5</option>
                      <option value="N4">N4</option>
                      <option value="IRODORI">Irodori</option>
                    </select>
                    <select
                      value={packageType}
                      onChange={(e) => setPackageType(e.target.value as any)}
                      className="w-1/2 rounded-xl border border-stone-300 bg-white px-2 py-2 font-bold"
                    >
                      <option value="REGULAR">Regular</option>
                      <option value="PREMIUM">Premium</option>
                    </select>
                  </div>
                </div>
                {isFileOpened && (
                  <div className="sm:col-span-2">
                    <label className="font-bold text-slate-700">টার্গেট জাপানি স্কুল / কোম্পানি</label>
                    <input
                      type="text"
                      value={targetSchool}
                      onChange={(e) => setTargetSchool(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 font-semibold"
                    />
                  </div>
                )}
              </div>

              {/* Login Credentials Box */}
              <div className="mt-4 rounded-2xl border border-stone-200 bg-white p-4 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-black text-slate-900">পোর্টাল লগইন ডিটেইলস (Login Credentials)</span>
                  <button
                    type="button"
                    onClick={generateRandomPassword}
                    className="text-[11px] font-bold text-[#b91c1c] hover:underline"
                  >
                    নতুন পাসওয়ার্ড জেনারেট করুন
                  </button>
                </div>

                <div>
                  <label className="font-bold text-slate-700">লগইন ইমেইল / ইউজার আইডি *</label>
                  <input
                    type="text"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-stone-300 bg-stone-50 px-3 py-2 font-mono font-bold text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="font-bold text-slate-700">লগইন পাসওয়ার্ড *</label>
                    <input
                      type="text"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-stone-300 bg-stone-50 px-3 py-2 font-mono font-bold text-emerald-800"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700">অ্যাকাউন্ট রোল</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as UserRole)}
                      className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-2.5 py-2 font-bold"
                    >
                      <option value="STUDENT">STUDENT (শিক্ষার্থী/ভিসা ফাইল)</option>
                      <option value="B2B_AGENT">B2B_AGENT (এজেন্ট)</option>
                      <option value="TELE_COUNSELOR">TELE_COUNSELOR</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Granular Module Access Permissions */}
              <div className="mt-4">
                <label className="block text-xs font-black text-slate-900 mb-2">
                  নির্দিষ্ট অ্যাক্সেস পারমিশন (লগইন করার পর কী কী দেখতে পারবে):
                </label>
                <div className="space-y-2">
                  {AVAILABLE_STUDENT_TABS.map((tab) => {
                    const checked = allowedTabs.includes(tab.id);
                    return (
                      <label
                        key={tab.id}
                        className={`flex items-start gap-2.5 rounded-xl border p-2.5 cursor-pointer text-xs transition ${
                          checked
                            ? "border-emerald-600 bg-emerald-50/60"
                            : "border-stone-200 bg-white hover:bg-stone-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleTabPermission(tab.id)}
                          className="mt-0.5 h-4 w-4 accent-emerald-700"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{tab.label}</p>
                          <p className="text-[10px] text-slate-500">{tab.desc}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 space-y-2.5">
                <button
                  type="button"
                  onClick={handleProvisionLoginAndAdmission}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#b91c1c] hover:bg-red-800 py-3 text-xs font-black text-white shadow-md transition"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>ভর্তি কনফার্ম ও লগইন অ্যাক্সেস চালু করুন</span>
                </button>

                <a
                  href={waLink}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 py-2.5 text-xs font-bold text-white shadow-xs transition"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>WhatsApp-এ লগইন আইডি ও পাসওয়ার্ড পাঠান</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
