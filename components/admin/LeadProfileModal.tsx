"use client";

import React, { useState, useMemo } from "react";
import {
  X,
  UserCheck,
  KeyRound,
  ShieldCheck,
  Send,
  Save,
} from "lucide-react";
import {
  getCmsStore,
  updateCrmLeadProfile,
  provisionLeadLoginAndEnrollment,
  type CrmLead,
  type DashboardTabId,
  type LeadStatus,
  type ServiceInterest,
  type UserRole,
} from "@/lib/knltc-cms-store";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";

export default function LeadProfileModal({
  lead,
  onClose,
  onSaved,
}: {
  lead: CrmLead;
  onClose: () => void;
  onSaved: (message: string) => void;
}) {
  const { language } = useLanguage();

  const t = useMemo(
    () =>
      translate(
        {
          en: {
            headerSuffix: "Individual Lead Profile",
            loginActive: "Login Active",
            headerDesc:
              "Manage complete candidate bio, counseling notes, and issue portal login access upon enrollment or file opening",
            closeTitle: "Close",
            sec1Title: "1. Personal & Academic Profile (Lead Profile Details)",
            createdLabel: "Created:",
            fullName: "Candidate Full Name *",
            phone: "Phone Number *",
            whatsapp: "WhatsApp Number",
            email: "Email Address",
            city: "City / District",
            passport: "Passport Number (if any)",
            address: "Current & Permanent Address",
            addressPlaceholder: "House/Road, Area, District...",
            guardianName: "Guardian / Sponsor Name",
            guardianNamePlaceholder: "Father / Mother / Sibling",
            guardianPhone: "Guardian Phone Number",
            education: "Highest Education",
            gpa: "GPA / CGPA Details",
            jpLevel: "Japanese Language Proficiency",
            jpOptions: {
              NONE: "Not Started (NONE)",
              LEARNING_N5: "Learning N5 (LEARNING_N5)",
              PASSED_N5: "JLPT/NAT N5 Passed (PASSED_N5)",
              PASSED_N4: "JLPT/JFT N4 Passed (PASSED_N4)",
              NAT_JFT: "NAT / JFT Basic Passed",
            },
            studyGap: "Study Gap (Years)",
            interest: "Program / Visa of Interest",
            interestOptions: {
              STUDENT_VISA_REGULAR: "Student Visa (Regular Package)",
              STUDENT_VISA_PREMIUM: "Student Visa (Premium Package)",
              SSW_CONSTRUCTION_SPECIAL: "SSW Construction Special",
              SSW_CAREGIVER: "SSW Caregiver (Nursing)",
              SSW_AGRICULTURE: "SSW Agriculture",
              SSW_FOOD_SERVICE: "SSW Food Service",
              TITP_TECHNICAL: "TITP Technical Intern",
              JAPANESE_N5: "Japanese Language N5 Course",
              JAPANESE_N4: "Japanese Language N4 Course",
            },
            leadStatus: "Lead Status",
            statusOptions: {
              NEW: "New Lead (NEW)",
              CONTACTED: "Contacted (CONTACTED)",
              COUNSELED: "Counseled (COUNSELED)",
              OFFICE_VISIT_BOOKED: "Office Visit Booked (OFFICE_VISIT_BOOKED)",
              ADMITTED: "Admitted / File Opened (ADMITTED)",
              ARCHIVED: "Archived (ARCHIVED)",
            },
            branch: "Branch",
            branchDhaka: "Dhaka HQ (DHK-HQ)",
            branchKhulna: "Khulna Branch (KHULNA-01)",
            counselor: "Assigned Counselor",
            notes: "Counseling & Follow-up Notes",
            notesPlaceholder: "Bank solvency, family feedback, and follow-up details...",
            saveProfileOnlyBtn: "Save Profile Details Only",
            sec2Title: "2. Admission / File Opening & Login Access Management",
            sec2Desc:
              "If this candidate enrolls in a course or opens a visa file, create their portal login with specific module access:",
            courseEnrolledTitle: "Course Enrolled",
            courseEnrolledDesc: "Activates LMS & classroom",
            fileOpenedTitle: "Visa File Opened",
            fileOpenedDesc: "Adds to 10-step visa board",
            batchSessionLabel: "Enrolled Batch / Intake Session",
            levelPackageLabel: "Course Level & Package",
            targetSchoolLabel: "Target Japanese School / Company",
            credsHeader: "Portal Login Credentials",
            genPasswordBtn: "Generate Password",
            loginEmailLabel: "Login Email / User ID *",
            loginPasswordLabel: "Login Password *",
            accountRoleLabel: "Account Role",
            roleStudent: "STUDENT (Student / Visa Applicant)",
            roleAgent: "B2B_AGENT (Agent)",
            roleCounselor: "TELE_COUNSELOR",
            permHeader: "Specific Access Permissions (What user can see after login):",
            studentTabs: [
              {
                id: "my_profile" as DashboardTabId,
                label: "My Profile & File Tracker",
                desc: "View personal enrollment info, file status, and biodata",
              },
              {
                id: "visa" as DashboardTabId,
                label: "Visa Processing & 10-Step Tracker",
                desc: "Track COE, school interview, and visa processing stages",
              },
              {
                id: "lms" as DashboardTabId,
                label: "Language Course & LMS Classroom",
                desc: "Access N5/N4 lessons and online classroom links",
              },
              {
                id: "store_blog" as DashboardTabId,
                label: "Bookstore & Guidelines",
                desc: "View book orders and visa guidelines",
              },
              {
                id: "overview" as DashboardTabId,
                label: "Dashboard Overview",
                desc: "View general announcements and intake updates",
              },
            ],
            confirmAdmissionBtn: "Confirm Admission & Activate Login Access",
            sendWaBtn: "Send Login ID & Password on WhatsApp",
            savedProfileToast: "Profile details updated successfully!",
            missingCredsToast: "Please provide Login Email/ID and Password.",
            provisionedToast: "Admission/File Opening and Login Access activated successfully!",
          },
          bn: {
            headerSuffix: "ব্যক্তিগত লিড প্রোফাইল",
            loginActive: "লগইন চালু আছে",
            headerDesc:
              "লিডের সম্পূর্ণ বায়োডাটা, কাউন্সিলিং নোট এবং ভর্তি/ফাইল ওপেনকারীদের জন্য নির্দিষ্ট অ্যাক্সেসসহ লগইন তৈরি করুন",
            closeTitle: "বন্ধ করুন",
            sec1Title: "১. ব্যক্তিগত ও একাডেমিক প্রোফাইল (Lead Profile Details)",
            createdLabel: "তৈরি:",
            fullName: "প্রার্থীর পূর্ণ নাম *",
            phone: "ফোন নম্বর *",
            whatsapp: "WhatsApp নম্বর",
            email: "ইমেইল ঠিকানা",
            city: "জেলা / শহর",
            passport: "পাসপোর্ট নম্বর (যদি থাকে)",
            address: "বর্তমান ও স্থায়ী ঠিকানা",
            addressPlaceholder: "বাসা/রোড, থানা, জেলা...",
            guardianName: "অভিভাবক / স্পন্সরের নাম",
            guardianNamePlaceholder: "পিতা / মাতা / ভাই",
            guardianPhone: "অভিভাবকের ফোন নম্বর",
            education: "সর্বশেষ শিক্ষাগত যোগ্যতা",
            gpa: "GPA / CGPA বিবরণ",
            jpLevel: "জাপানি ভাষার দক্ষতা",
            jpOptions: {
              NONE: "শুরু করেনি (NONE)",
              LEARNING_N5: "N5 শিখছে (LEARNING_N5)",
              PASSED_N5: "JLPT/NAT N5 পাস (PASSED_N5)",
              PASSED_N4: "JLPT/JFT N4 পাস (PASSED_N4)",
              NAT_JFT: "NAT / JFT Basic পাস",
            },
            studyGap: "স্টাডি গ্যাপ (বছর)",
            interest: "আগ্রহের প্রোগ্রাম / ভিসা",
            interestOptions: {
              STUDENT_VISA_REGULAR: "স্টুডেন্ট ভিসা (রেগুলার প্যাকেজ)",
              STUDENT_VISA_PREMIUM: "স্টুডেন্ট ভিসা (প্রিমিয়াম প্যাকেজ)",
              SSW_CONSTRUCTION_SPECIAL: "SSW কনস্ট্রাকশন স্পেশাল",
              SSW_CAREGIVER: "SSW কেয়ারগিভার (নার্সিং)",
              SSW_AGRICULTURE: "SSW এগ্রিকালচার",
              SSW_FOOD_SERVICE: "SSW ফুড সার্ভিস",
              TITP_TECHNICAL: "TITP টেকনিক্যাল ইন্টার্ন",
              JAPANESE_N5: "জাপানি ভাষা N5 কোর্স",
              JAPANESE_N4: "জাপানি ভাষা N4 কোর্স",
            },
            leadStatus: "লিড স্ট্যাটাস",
            statusOptions: {
              NEW: "নতুন লিড (NEW)",
              CONTACTED: "যোগাযোগ হয়েছে (CONTACTED)",
              COUNSELED: "কাউন্সিলিং সম্পন্ন (COUNSELED)",
              OFFICE_VISIT_BOOKED: "অফিস ভিজিট বুকড (OFFICE_VISIT_BOOKED)",
              ADMITTED: "ভর্তি / ফাইল ওপেন (ADMITTED)",
              ARCHIVED: "আর্কাইভড (ARCHIVED)",
            },
            branch: "শাখা (Branch)",
            branchDhaka: "ঢাকা প্রধান কার্যালয় (DHK-HQ)",
            branchKhulna: "খুলনা শাখা (KHULNA-01)",
            counselor: "দায়িত্বপ্রাপ্ত কাউন্সিলর",
            notes: "কাউন্সিলিং ও ফলো-আপ নোটস",
            notesPlaceholder: "প্রার্থীর ব্যাংক সলভেন্সি, পরিবারের মতামত ও পরবর্তী ফলো-আপের বিস্তারিত...",
            saveProfileOnlyBtn: "শুধু প্রোফাইল তথ্য সেভ করুন",
            sec2Title: "২. ভর্তি / ফাইল ওপেন ও লগইন অ্যাক্সেস ম্যানেজমেন্ট",
            sec2Desc:
              "এই লিড যদি কোর্সে ভর্তি হন অথবা ভিসা ফাইল ওপেন করেন, তবে তার জন্য নির্দিষ্ট মডিউল অ্যাক্সেসসহ পোর্টাল লগইন তৈরি করুন:",
            courseEnrolledTitle: "ভাষা কোর্সে ভর্তি",
            courseEnrolledDesc: "LMS ও ক্লাসরুম চালু হবে",
            fileOpenedTitle: "ভিসা ফাইল ওপেন",
            fileOpenedDesc: "১০-ধাপ ভিসা বোর্ডে যুক্ত হবে",
            batchSessionLabel: "ভর্তিকৃত ব্যাচ / ইনটেক সেশন",
            levelPackageLabel: "কোর্স লেভেল ও প্যাকেজ",
            targetSchoolLabel: "টার্গেট জাপানি স্কুল / কোম্পানি",
            credsHeader: "পোর্টাল লগইন ডিটেইলস (Login Credentials)",
            genPasswordBtn: "নতুন পাসওয়ার্ড জেনারেট করুন",
            loginEmailLabel: "লগইন ইমেইল / ইউজার আইডি *",
            loginPasswordLabel: "লগইন পাসওয়ার্ড *",
            accountRoleLabel: "অ্যাকাউন্ট রোল",
            roleStudent: "STUDENT (শিক্ষার্থী/ভিসা ফাইল)",
            roleAgent: "B2B_AGENT (এজেন্ট)",
            roleCounselor: "TELE_COUNSELOR",
            permHeader: "নির্দিষ্ট অ্যাক্সেস পারমিশন (লগইন করার পর কী কী দেখতে পারবে):",
            studentTabs: [
              {
                id: "my_profile" as DashboardTabId,
                label: "নিজস্ব প্রোফাইল ও ফাইল ট্র্যাকার (My Profile & File)",
                desc: "নিজের ভর্তি তথ্য, ফাইল ওপেনিং স্ট্যাটাস ও ব্যক্তিগত প্রোফাইল দেখবে",
              },
              {
                id: "visa" as DashboardTabId,
                label: "ভিসা প্রসেসিং ও ১০-ধাপ ট্র্যাকার (Visa Pipeline)",
                desc: "COE, স্কুল ইন্টারভিউ ও ভিসা প্রসেসিংয়ের ধাপসমূহ ট্র্যাক করতে পারবে",
              },
              {
                id: "lms" as DashboardTabId,
                label: "ভাষা কোর্স ও LMS ক্লাসরুম (Language & LMS)",
                desc: "N5/N4 মিন্না নো নিহোঙ্গো লেসন ও অনলাইন ক্লাসরুম অ্যাক্সেস পাবে",
              },
              {
                id: "store_blog" as DashboardTabId,
                label: "বুক স্টোর ও গাইডলাইন (Book Store & Blog)",
                desc: "বই অর্ডার ও ভিসা গাইডলাইন দেখতে পারবে",
              },
              {
                id: "overview" as DashboardTabId,
                label: "ড্যাশবোর্ড ওভারভিউ (Overview)",
                desc: "সামগ্রিক নোটিশ ও ইনটেক আপডেট দেখতে পারবে",
              },
            ],
            confirmAdmissionBtn: "ভর্তি কনফার্ম ও লগইন অ্যাক্সেস চালু করুন",
            sendWaBtn: "WhatsApp-এ লগইন আইডি ও পাসওয়ার্ড পাঠান",
            savedProfileToast: "প্রোফাইল তথ্য সফলভাবে আপডেট হয়েছে!",
            missingCredsToast: "লগইন ইমেইল/আইডি এবং পাসওয়ার্ড প্রদান করুন।",
            provisionedToast: "ভর্তি/ফাইল ওপেন এবং লগইন অ্যাক্সেস সফলভাবে চালু করা হয়েছে!",
          },
          ja: {
            headerSuffix: "個人リードプロフィール",
            loginActive: "ログイン有効",
            headerDesc:
              "候補者の詳細プロフィール、カウンセリング記録を管理し、入学・ファイル開設者のポータルログインを発行します",
            closeTitle: "閉じる",
            sec1Title: "1. 個人情報・学歴プロフィール (Lead Profile Details)",
            createdLabel: "作成日:",
            fullName: "候補者氏名 *",
            phone: "電話番号 *",
            whatsapp: "WhatsApp番号",
            email: "メールアドレス",
            city: "都市 / 地域",
            passport: "パスポート番号（任意）",
            address: "現住所・本籍地",
            addressPlaceholder: "番地、市区町村...",
            guardianName: "保護者 / スポンサー氏名",
            guardianNamePlaceholder: "父 / 母 / 兄弟",
            guardianPhone: "保護者電話番号",
            education: "最終学歴",
            gpa: "GPA / 成績詳細",
            jpLevel: "日本語能力レベル",
            jpOptions: {
              NONE: "未学習 (NONE)",
              LEARNING_N5: "N5学習中 (LEARNING_N5)",
              PASSED_N5: "JLPT/NAT N5合格 (PASSED_N5)",
              PASSED_N4: "JLPT/JFT N4合格 (PASSED_N4)",
              NAT_JFT: "NAT / JFT-Basic合格",
            },
            studyGap: "ブランク期間（年）",
            interest: "希望プログラム・ビザ",
            interestOptions: {
              STUDENT_VISA_REGULAR: "留学ビザ（レギュラーパッケージ）",
              STUDENT_VISA_PREMIUM: "留学ビザ（プレミアムパッケージ）",
              SSW_CONSTRUCTION_SPECIAL: "特定技能 建設特別バッチ",
              SSW_CAREGIVER: "特定技能 介護",
              SSW_AGRICULTURE: "特定技能 農業",
              SSW_FOOD_SERVICE: "特定技能 外食業",
              TITP_TECHNICAL: "技能実習 (TITP)",
              JAPANESE_N5: "日本語 N5コース",
              JAPANESE_N4: "日本語 N4コース",
            },
            leadStatus: "リードステータス",
            statusOptions: {
              NEW: "新規リード (NEW)",
              CONTACTED: "連絡済 (CONTACTED)",
              COUNSELED: "カウンセリング済 (COUNSELED)",
              OFFICE_VISIT_BOOKED: "来社予約済 (OFFICE_VISIT_BOOKED)",
              ADMITTED: "入学・ファイル開設済 (ADMITTED)",
              ARCHIVED: "アーカイブ (ARCHIVED)",
            },
            branch: "支部 (Branch)",
            branchDhaka: "ダッカ本部 (DHK-HQ)",
            branchKhulna: "クルナ支部 (KHULNA-01)",
            counselor: "担当カウンセラー",
            notes: "カウンセリング・フォローアップメモ",
            notesPlaceholder: "銀行残高証明、家族の同意、次回フォローアップ詳細...",
            saveProfileOnlyBtn: "プロフィール情報のみ保存",
            sec2Title: "2. 入学・ファイル開設およびログイン権限管理",
            sec2Desc:
              "コース入学またはビザファイルを開設した場合、指定モジュール権限付きのポータルログインを発行します:",
            courseEnrolledTitle: "日本語コース入学",
            courseEnrolledDesc: "LMSとオンライン教室を有効化",
            fileOpenedTitle: "ビザファイル開設",
            fileOpenedDesc: "10段階ビザボードに追加",
            batchSessionLabel: "受講バッチ / 入学時期",
            levelPackageLabel: "コースレベル・パッケージ",
            targetSchoolLabel: "志望日本語学校 / 受入企業",
            credsHeader: "ポータルログイン認証情報 (Login Credentials)",
            genPasswordBtn: "パスワード自動生成",
            loginEmailLabel: "ログインメール / ユーザーID *",
            loginPasswordLabel: "ログインパスワード *",
            accountRoleLabel: "アカウントロール",
            roleStudent: "STUDENT (受講生・ビザ申請者)",
            roleAgent: "B2B_AGENT (エージェント)",
            roleCounselor: "TELE_COUNSELOR",
            permHeader: "個別アクセス権限（ログイン後に閲覧可能なタブ）:",
            studentTabs: [
              {
                id: "my_profile" as DashboardTabId,
                label: "マイプロフィール＆ファイル進捗",
                desc: "自身の入学情報、ファイル状況、個人プロフィールを閲覧",
              },
              {
                id: "visa" as DashboardTabId,
                label: "ビザ申請＆10段階トラッカー",
                desc: "COE、学校面接、ビザ審査の進捗を確認",
              },
              {
                id: "lms" as DashboardTabId,
                label: "日本語コース＆LMS教室",
                desc: "N5/N4レッスンおよびオンライン教室へアクセス",
              },
              {
                id: "store_blog" as DashboardTabId,
                label: "ブックストア＆ガイドライン",
                desc: "教材注文やビザガイドラインを閲覧",
              },
              {
                id: "overview" as DashboardTabId,
                label: "ダッシュボード概要",
                desc: "全体のお知らせや募集情報を閲覧",
              },
            ],
            confirmAdmissionBtn: "入学確定＆ログイン権限を有効化",
            sendWaBtn: "WhatsAppでログインID・パスワードを送信",
            savedProfileToast: "プロフィール情報が更新されました！",
            missingCredsToast: "ログインIDとパスワードを入力してください。",
            provisionedToast: "入学・ファイル開設およびログイン権限が有効化されました！",
          },
        },
        language,
      ),
    [language],
  );

  // Load live entities from CMS Store for relational linking
  const liveStore = useMemo(() => getCmsStore(), []);
  const partnerSchools = liveStore.partnerSchools || [];
  const b2bAgents = liveStore.b2bAgents || [];
  const counselors = liveStore.staffList.filter(
    (s) => s.role === "TELE_COUNSELOR" || s.role === "COUNSELOR" || s.role === "BRANCH_MANAGER",
  );
  const visaOfficers = liveStore.staffList.filter(
    (s) => s.role === "VISA_OFFICER" || s.role === "BRANCH_MANAGER",
  );

  // Personal & Academic Profile State
  const [name, setName] = useState(lead.name || "");
  const [phone, setPhone] = useState(lead.phone || "");
  const [whatsapp, setWhatsapp] = useState(lead.whatsapp || lead.phone || "");
  const [email, setEmail] = useState(lead.email || "");
  const [city, setCity] = useState(lead.city || "Dhaka");
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
  const [assignedTo, setAssignedTo] = useState(
    lead.assignedTo || counselors[0]?.name || "শেখ বাসেত",
  );
  const [assignedCounselorId, setAssignedCounselorId] = useState(
    lead.assignedCounselorId || counselors.find((c) => c.name === lead.assignedTo)?.id || "",
  );
  const [b2bAgentId, setB2bAgentId] = useState(lead.b2bAgentId || "");
  const [b2bAgentName, setB2bAgentName] = useState(lead.b2bAgentName || "");
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
  const [partnerSchoolId, setPartnerSchoolId] = useState(
    lead.partnerSchoolId || partnerSchools[0]?.id || "",
  );
  const [targetSchool, setTargetSchool] = useState(
    lead.targetSchool || partnerSchools[0]?.name || "",
  );
  const [assignedVisaOfficerId, setAssignedVisaOfficerId] = useState(
    lead.assignedVisaOfficerId || visaOfficers[0]?.id || "",
  );
  const [contractAmountBdt, setContractAmountBdt] = useState<number>(
    lead.contractAmountBdt ?? (lead.packageType === "PREMIUM" ? 1100000 : 120000),
  );
  const [initialPaymentBdt, setInitialPaymentBdt] = useState<number>(0);
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
      prev.includes(tabId) ? prev.filter((item) => item !== tabId) : [...prev, tabId],
    );
  };

  const generateRandomPassword = () => {
    const digits = Math.floor(1000 + Math.random() * 9000);
    setLoginPassword(`JP@${digits}`);
  };

  const handleSaveProfileOnly = () => {
    const selectedAgent = b2bAgents.find((a) => a.id === b2bAgentId);
    const selectedSchool = partnerSchools.find((s) => s.id === partnerSchoolId);
    const selectedOfficer = visaOfficers.find((v) => v.id === assignedVisaOfficerId);
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
      assignedCounselorId: assignedCounselorId || undefined,
      b2bAgentId: b2bAgentId || undefined,
      b2bAgentName: selectedAgent?.organizationName || b2bAgentName || undefined,
      partnerSchoolId: partnerSchoolId || undefined,
      targetSchool: selectedSchool?.name || targetSchool || undefined,
      assignedVisaOfficerId: assignedVisaOfficerId || undefined,
      assignedVisaOfficerName: selectedOfficer?.name || undefined,
      contractAmountBdt,
      followUpDate,
      notes,
    });
    onSaved(`${name} — ${t.savedProfileToast}`);
  };

  const handleProvisionLoginAndAdmission = () => {
    if (!loginEmail.trim() || !loginPassword.trim()) {
      onSaved(t.missingCredsToast);
      return;
    }

    const finalTabs: DashboardTabId[] =
      allowedTabs.length > 0 ? allowedTabs : ["my_profile", "visa", "lms"];

    const selectedAgent = b2bAgents.find((a) => a.id === b2bAgentId);
    const selectedSchool = partnerSchools.find((s) => s.id === partnerSchoolId);
    const selectedOfficer = visaOfficers.find((v) => v.id === assignedVisaOfficerId);
    const resolvedSchoolName = selectedSchool?.name || targetSchool || "Unassigned School";

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
        targetSchool: resolvedSchoolName,
        partnerSchoolId: partnerSchoolId || undefined,
        b2bAgentId: b2bAgentId || undefined,
        b2bAgentName: selectedAgent?.organizationName || b2bAgentName || undefined,
        assignedCounselorId: assignedCounselorId || undefined,
        assignedVisaOfficerId: assignedVisaOfficerId || undefined,
        assignedVisaOfficerName: selectedOfficer?.name || undefined,
        contractAmountBdt,
        initialPaymentBdt: Number(initialPaymentBdt) || 0,
        courseLevel,
        accountStatus: "ACTIVE",
        address,
        passportNo,
        guardianName,
        guardianPhone,
        gpaDetails,
      },
    );

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
      assignedCounselorId: assignedCounselorId || undefined,
      b2bAgentId: b2bAgentId || undefined,
      b2bAgentName: selectedAgent?.organizationName || b2bAgentName || undefined,
      partnerSchoolId: partnerSchoolId || undefined,
      assignedVisaOfficerId: assignedVisaOfficerId || undefined,
      assignedVisaOfficerName: selectedOfficer?.name || undefined,
      contractAmountBdt,
      followUpDate,
      notes,
      isFileOpened,
      isCourseEnrolled,
      enrolledBatchOrSession,
      packageType,
      targetSchool: resolvedSchoolName,
      hasLoginAccess: true,
      loginEmail: loginEmail.trim().toLowerCase(),
      loginPassword: loginPassword.trim(),
      allowedTabs: finalTabs,
    });

    onSaved(`${name} (${loginEmail.trim()}) — ${t.provisionedToast}`);
    onClose();
  };

  const waCredentialsMessage = encodeURIComponent(
    `Hello ${name},\nYour KNLTC (Japan Gateway) profile & portal login have been activated.\n\nPortal Login URL: ${typeof window !== "undefined" ? window.location.origin : ""}/admin/login\nLogin ID / Email: ${loginEmail}\nPassword: ${loginPassword}\nBatch / Session: ${enrolledBatchOrSession}\n\nThank you,\nKNLTC Management`,
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
                <h2 className="text-lg font-black tracking-tight">
                  {name} — {t.headerSuffix}
                </h2>
                <span className="rounded-full bg-emerald-700/80 px-2.5 py-0.5 text-[10px] font-bold text-emerald-100 border border-emerald-500/40">
                  ID: {lead.id}
                </span>
                {lead.hasLoginAccess && (
                  <span className="rounded-full bg-amber-400 px-2.5 py-0.5 text-[10px] font-black text-slate-950">
                    {t.loginActive}
                  </span>
                )}
              </div>
              <p className="text-xs text-emerald-100/90 mt-0.5">{t.headerDesc}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl bg-white/10 p-2 text-white hover:bg-white/20 transition"
            title={t.closeTitle}
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
                  <span>{t.sec1Title}</span>
                </h3>
                <span className="text-[11px] font-semibold text-slate-500">
                  {t.createdLabel} {new Date(lead.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <div>
                  <label className="font-bold text-slate-700">{t.fullName}</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">{t.phone}</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 font-mono font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">{t.whatsapp}</label>
                  <input
                    type="text"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">{t.email}</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="candidate@email.com"
                    className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">{t.city}</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">{t.passport}</label>
                  <input
                    type="text"
                    value={passportNo}
                    onChange={(e) => setPassportNo(e.target.value)}
                    placeholder="e.g. A04928172"
                    className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 font-mono"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700">{t.address}</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={t.addressPlaceholder}
                    className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">{t.guardianName}</label>
                  <input
                    type="text"
                    value={guardianName}
                    onChange={(e) => setGuardianName(e.target.value)}
                    placeholder={t.guardianNamePlaceholder}
                    className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">{t.guardianPhone}</label>
                  <input
                    type="text"
                    value={guardianPhone}
                    onChange={(e) => setGuardianPhone(e.target.value)}
                    placeholder="017..."
                    className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">{t.education}</label>
                  <input
                    type="text"
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    placeholder="HSC / Diploma / BSc / Honours"
                    className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 font-semibold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">{t.gpa}</label>
                  <input
                    type="text"
                    value={gpaDetails}
                    onChange={(e) => setGpaDetails(e.target.value)}
                    placeholder="SSC 4.50, HSC 4.25"
                    className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">{t.jpLevel}</label>
                  <select
                    value={japaneseProficiency}
                    onChange={(e) => setJapaneseProficiency(e.target.value as any)}
                    className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 font-bold"
                  >
                    <option value="NONE">{t.jpOptions.NONE}</option>
                    <option value="LEARNING_N5">{t.jpOptions.LEARNING_N5}</option>
                    <option value="PASSED_N5">{t.jpOptions.PASSED_N5}</option>
                    <option value="PASSED_N4">{t.jpOptions.PASSED_N4}</option>
                    <option value="NAT_JFT">{t.jpOptions.NAT_JFT}</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700">{t.studyGap}</label>
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
                  <label className="font-bold text-slate-700">{t.interest}</label>
                  <select
                    value={interest}
                    onChange={(e) => setInterest(e.target.value as ServiceInterest)}
                    className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 font-bold text-emerald-900"
                  >
                    {Object.entries(t.interestOptions).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700">{t.leadStatus}</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as LeadStatus)}
                    className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 font-bold"
                  >
                    {Object.entries(t.statusOptions).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700">{t.branch}</label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value as "DHK-HQ" | "KHULNA-01")}
                    className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 font-bold"
                  >
                    <option value="DHK-HQ">{t.branchDhaka}</option>
                    <option value="KHULNA-01">{t.branchKhulna}</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700">{t.counselor}</label>
                  {counselors.length > 0 ? (
                    <select
                      value={assignedCounselorId || assignedTo}
                      onChange={(e) => {
                        const found = counselors.find((c) => c.id === e.target.value);
                        if (found) {
                          setAssignedCounselorId(found.id);
                          setAssignedTo(found.name);
                        } else {
                          setAssignedCounselorId("");
                          setAssignedTo(e.target.value);
                        }
                      }}
                      className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 font-bold"
                    >
                      {counselors.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.role})
                        </option>
                      ))}
                      <option value="শেখ বাসেত (MD)">শেখ বাসেত (MD)</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={assignedTo}
                      onChange={(e) => setAssignedTo(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2"
                    />
                  )}
                </div>
                <div>
                  <label className="font-bold text-slate-700">
                    {language === "bn" ? "রেফারকারী বিটুবি এজেন্ট (যদি থাকে)" : "Referring B2B Agent"}
                  </label>
                  <select
                    value={b2bAgentId}
                    onChange={(e) => {
                      const ag = b2bAgents.find((a) => a.id === e.target.value);
                      setB2bAgentId(e.target.value);
                      setB2bAgentName(ag?.organizationName || "");
                    }}
                    className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 font-semibold"
                  >
                    <option value="">
                      {language === "bn" ? "ডিরেক্ট / কোনো এজেন্ট নেই" : "Direct Inquiry (No Agent)"}
                    </option>
                    {b2bAgents.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.organizationName} ({a.city})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700">{t.notes}</label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={t.notesPlaceholder}
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
                  <span>{t.saveProfileOnlyBtn}</span>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (5 Cols): Admission / File Open & Login Access Provisioning */}
          <div className="lg:col-span-5 space-y-5">
            <div className="rounded-2xl border-2 border-[#b91c1c]/30 bg-gradient-to-b from-red-50/50 to-white p-5 shadow-xs">
              <div className="flex items-center gap-2 text-[#b91c1c]">
                <KeyRound className="h-5 w-5" />
                <h3 className="text-sm font-black text-slate-900">{t.sec2Title}</h3>
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{t.sec2Desc}</p>

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
                    <p className="font-extrabold text-slate-900">{t.courseEnrolledTitle}</p>
                    <p className="text-[10px] text-slate-500">{t.courseEnrolledDesc}</p>
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
                    <p className="font-extrabold text-slate-900">{t.fileOpenedTitle}</p>
                    <p className="text-[10px] text-slate-500">{t.fileOpenedDesc}</p>
                  </div>
                </label>
              </div>

              {/* Batch / Session & School Configuration */}
              <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700">{t.batchSessionLabel}</label>
                  <input
                    type="text"
                    value={enrolledBatchOrSession}
                    onChange={(e) => setEnrolledBatchOrSession(e.target.value)}
                    placeholder="APRIL_2027 • N5 Batch"
                    className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 font-semibold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">{t.levelPackageLabel}</label>
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
                      onChange={(e) => {
                        const pkg = e.target.value as "REGULAR" | "PREMIUM";
                        setPackageType(pkg);
                        setContractAmountBdt(pkg === "PREMIUM" ? 1100000 : 120000);
                      }}
                      className="w-1/2 rounded-xl border border-stone-300 bg-white px-2 py-2 font-bold"
                    >
                      <option value="REGULAR">Regular</option>
                      <option value="PREMIUM">Premium</option>
                    </select>
                  </div>
                </div>
                {isFileOpened && (
                  <>
                    <div className="sm:col-span-2">
                      <label className="font-bold text-slate-700">{t.targetSchoolLabel}</label>
                      {partnerSchools.length > 0 ? (
                        <select
                          value={partnerSchoolId}
                          onChange={(e) => {
                            const sch = partnerSchools.find((s) => s.id === e.target.value);
                            setPartnerSchoolId(e.target.value);
                            if (sch) setTargetSchool(sch.name);
                          }}
                          className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 font-semibold"
                        >
                          <option value="">
                            {language === "bn" ? "-- পার্টনার স্কুল নির্বাচন করুন --" : "-- Select Partner School --"}
                          </option>
                          {partnerSchools.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name} ({s.location})
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={targetSchool}
                          onChange={(e) => setTargetSchool(e.target.value)}
                          placeholder={language === "bn" ? "পার্টনার স্কুলের নাম লিখুন" : "Enter partner school name"}
                          className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 font-semibold"
                        />
                      )}
                    </div>
                    <div>
                      <label className="font-bold text-slate-700">
                        {language === "bn" ? "ভিসা প্রসেসিং অফিসার" : "Assigned Visa Officer"}
                      </label>
                      <select
                        value={assignedVisaOfficerId}
                        onChange={(e) => setAssignedVisaOfficerId(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 font-semibold"
                      >
                        <option value="">
                          {language === "bn" ? "ডিফল্ট ভিসা ডেস্ক" : "Default Visa Desk"}
                        </option>
                        {visaOfficers.map((vo) => (
                          <option key={vo.id} value={vo.id}>
                            {vo.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="font-bold text-slate-700">
                        {language === "bn" ? "মোট প্যাকেজ চুক্তি (৳)" : "Total Contract (BDT)"}
                      </label>
                      <input
                        type="number"
                        value={contractAmountBdt}
                        onChange={(e) => setContractAmountBdt(Number(e.target.value))}
                        className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 font-mono font-bold tabular-nums"
                      />
                    </div>
                  </>
                )}
                <div className="sm:col-span-2">
                  <label className="font-bold text-emerald-800">
                    {language === "bn"
                      ? "আজকের জমাকৃত ফি / অগ্রিম (৳) — অটো ফিন্যান্স লেজারে যুক্ত হবে"
                      : "Initial Payment Received Today (BDT) — Auto-logs to Finance"}
                  </label>
                  <input
                    type="number"
                    value={initialPaymentBdt}
                    onChange={(e) => setInitialPaymentBdt(Number(e.target.value))}
                    placeholder="0"
                    className="mt-1 w-full rounded-xl border border-emerald-300 bg-emerald-50/40 px-3 py-2 font-mono font-bold text-emerald-900 tabular-nums"
                  />
                </div>
              </div>

              {/* Login Credentials Box */}
              <div className="mt-4 rounded-2xl border border-stone-200 bg-white p-4 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-black text-slate-900">{t.credsHeader}</span>
                  <button
                    type="button"
                    onClick={generateRandomPassword}
                    className="text-[11px] font-bold text-[#b91c1c] hover:underline"
                  >
                    {t.genPasswordBtn}
                  </button>
                </div>

                <div>
                  <label className="font-bold text-slate-700">{t.loginEmailLabel}</label>
                  <input
                    type="text"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-stone-300 bg-stone-50 px-3 py-2 font-mono font-bold text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="font-bold text-slate-700">{t.loginPasswordLabel}</label>
                    <input
                      type="text"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-stone-300 bg-stone-50 px-3 py-2 font-mono font-bold text-emerald-800"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700">{t.accountRoleLabel}</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as UserRole)}
                      className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-2.5 py-2 font-bold"
                    >
                      <option value="STUDENT">{t.roleStudent}</option>
                      <option value="B2B_AGENT">{t.roleAgent}</option>
                      <option value="TELE_COUNSELOR">{t.roleCounselor}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Granular Module Access Permissions */}
              <div className="mt-4">
                <label className="block text-xs font-black text-slate-900 mb-2">
                  {t.permHeader}
                </label>
                <div className="space-y-2">
                  {t.studentTabs.map((tab) => {
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
                  <span>{t.confirmAdmissionBtn}</span>
                </button>

                <a
                  href={waLink}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 py-2.5 text-xs font-bold text-white shadow-xs transition"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{t.sendWaBtn}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
