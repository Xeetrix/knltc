"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Award,
  Building,
  CheckCircle2,
  CreditCard,
  Download,
  FileSpreadsheet,
  FileText,
  GraduationCap,
  PlusCircle,
  ShieldCheck,
  TrendingUp,
  Upload,
  UserCheck,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";
import {
  UserRole,
  Batch,
  Enrollment,
  Resource,
  INITIAL_BRANCHES,
  INITIAL_BATCHES,
  INITIAL_ENROLLMENTS,
  INITIAL_RESOURCES,
  STUDENT_VISA_MILESTONES,
} from "@/lib/portal-data";

interface Props {
  initialRole?: UserRole;
}

export default function RbacPortal({ initialRole = "MAIN_ADMIN" }: Props) {
  const { language } = useLanguage();
  const [role, setRole] = useState<UserRole>(initialRole);
  const [enrollments, setEnrollments] = useState<Enrollment[]>(INITIAL_ENROLLMENTS);
  const [batches, setBatches] = useState<Batch[]>(INITIAL_BATCHES);
  const [resources, setResources] = useState<Resource[]>(INITIAL_RESOURCES);
  const [selectedBranchId, setSelectedBranchId] = useState("branch-dhaka-hq");

  // Attendance simulator state for teacher
  const [attendanceState, setAttendanceState] = useState<{ [studentId: string]: "PRESENT" | "ABSENT" }>({
    "enr-001": "PRESENT",
    "enr-002": "PRESENT",
    "enr-003": "ABSENT",
  });

  // Action status message
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const t = useMemo(
    () =>
      translate(
        {
          en: {
            backToCourse: "Return to Course Page",
            centralSynced: "Central Database Synced",
            switchRole: "Switch Role:",
            switchRoleHelp: "Switch roles to test each workspace's features and permissions",
            roleSuperAdmin: "Main Admin (Super Admin)",
            roleBranchAdmin: "Branch Admin (Dhaka HQ)",
            roleTeacher: "Teacher (Sensei Rafiqul)",
            roleStudent: "Student (Shakil Chowdhury)",
            superAdminTag: "Super Admin Console",
            hqName: "KNLTC Central Headquarters",
            superAdminTitle: "Central Management & Analytics Dashboard",
            superAdminSub: "4 branch campuses, central course revenue, enrollment audits, and Japan visa files.",
            revenueBtn: "Revenue Report (Excel)",
            kpiTotalRevenue: "Total Course Fees Collected",
            kpiRevenueGrowth: "+22% growth this fiscal year",
            kpiTotalStudents: "Total Enrolled Students",
            kpiActiveCampuses: "Active across 4 campuses",
            kpiBatches: "Running & Upcoming Batches",
            kpiBatchSub: "Morning, evening & online",
            kpiPendingApprovals: "Pending Enrollments",
            kpiPendingSub: "Awaiting branch verification",
            branchPerfTitle: "Branch Performance & Admin Management",
            branchPerfSub: "Student numbers, locations, and appointed branch administrators",
            activeBranches: "4 Branches Active",
            thCampus: "Campus Name",
            thLocation: "Location & Phone",
            thStudents: "Students",
            thAdmin: "Branch Admin",
            thManage: "Management",
            assignedBadge: "Appointed",
            openBranchBtn: "Open Branch View",
            centralEnrollmentTitle: "Central Enrollment & Application Audit",
            centralEnrollmentSub: "Recent online & campus student registrations",
            filterLabel: "Filter:",
            filterAll: "All Records",
            thEnrollNo: "Enroll No",
            thApplicant: "Applicant Name",
            thCourseBranch: "Course & Branch",
            thPhone: "Phone",
            thFeePayment: "Fee & Payment",
            thStatus: "Status",
            thAction: "Action",
            btnApprove: "Approve",
            statusApproved: "Approved",
            statusPending: "Pending",
            paidPrefix: "Paid:",
            branchAdminTag: "Branch Administrator",
            branchHqLocation: "Dhaka Head Office (VIP Road, Naya Paltan)",
            branchAdminTitle: "Campus Batches, Admissions & Payment Verification",
            branchAdminSub: "Classroom seat allocations, fee payment verifications, and student document audit.",
            newBatchBtn: "Create New Batch",
            kpiCampusStudents: "Active Campus Students",
            kpiFloorRoom: "8th Floor Campus Classrooms",
            kpiRunningBatches: "Running Batches",
            kpiShiftsDesc: "Morning, evening & weekend",
            kpiPendingPayments: "Pending Payments",
            kpiReceiptsDesc: "bKash & bank slips",
            kpiAvgAttendance: "Average Class Attendance",
            kpiTrackerDesc: "Digital Attendance Tracker",
            paymentQueueTitle: "Payment Verification & Receipt Queue",
            paymentQueueSub: "Verify transaction IDs and confirm seat bookings",
            pendingVerificationTag: "Pending Verification",
            courseLabel: "Course:",
            deliveryLabel: "Delivery:",
            onlineZoom: "Online Zoom",
            campusMode: "Campus",
            feeLabel: "Fee:",
            paymentStatusWaiting: "Payment Status: Awaiting Verification (bKash / Cash / Bank)",
            btnVerifyPayment: "Verify & Approve Payment",
            batchesScheduleTitle: "Branch Batch Schedule & Room Allocation",
            batchesScheduleSub: "Daily schedules and assigned instructors for classroom and online batches",
            instructorLabel: "Instructor:",
            scheduleLabel: "Schedule:",
            locationLabel: "Location:",
            onlineZoomLive: "Online Zoom Live",
            seatBookingLabel: "Seat Booking:",
            teacherTag: "Instructor Workspace",
            teacherSub: "Sensei Rafiqul Islam (N2 Certified)",
            teacherTitle: "Live Classes, Lecture Sheets & Student Attendance",
            teacherSubtitle: "Manage assigned batches, upload lecture sheets, and record attendance digitally.",
            btnStartLive: "Start Today's Live Class",
            runningLesson: "Running Lesson: 15",
            zoomMeetLabel: "Google Meet / Zoom Live Link:",
            copyLinkBtn: "Copy Link",
            digitalAttendanceLabel: "Today's Class Digital Attendance:",
            presentLabel: "✓ Present",
            absentLabel: "✗ Absent",
            uploadResourceTitle: "Study Resource Upload & Management",
            uploadResourceSub: "Lecture sheets, audio files, and test papers for enrolled students",
            btnUpload: "Upload New File",
            downloadsLabel: "downloads",
            studentTag: "Student Dashboard",
            studentEnrollNo: "Enrollment No: KNLTC-2026-081",
            studentWelcome: "Welcome, Shakil Chowdhury!",
            enrolledCourseLabel: "Enrolled Course:",
            n5CourseTitle: "Japanese N5 Level Course",
            batchLabel: "Batch:",
            n5EveningBatch: "N5 Evening Classroom (Dhaka HQ)",
            btnJoinLive: "Join Today's Live Class",
            nextClassTitle: "Next Class",
            nextClassTime: "Saturday 6:30 PM",
            nextClassRoom: "Room 802 (Sky View Trade Valley)",
            feeStatusTitle: "Course Fee Payment",
            paidStatusBadge: "Paid in Full",
            receiptLabel: "Receipt: RCP-2026-0081",
            attendanceTitle: "Attendance Record",
            attendanceStat: "11 of 12 classes attended",
            targetExamTitle: "Target Exam",
            targetExamName: "JLPT N5 (Dec 2026)",
            mockSeriesDesc: "Mock test series included",
            visaMilestoneTitle: "Your Japan Visa Roadmap (Milestone Tracker)",
            visaMilestoneSub: "5 key milestones from starting language classes to arriving in Japan",
            step1Active: "Step 01 In Progress",
            studyMaterialsTitle: "Course Study Materials & Handouts",
            studyMaterialsSub: "Download in 1 click for convenient offline study",
            uploadedByLabel: "Uploaded by:",
            btnDownload: "Download",
            notices: {
              approved: "Enrollment application approved successfully!",
              approvedLocal: "Enrollment status updated (local session)!",
              paymentVerified: "Course fee verified and receipt issued successfully!",
              paymentVerifiedLocal: "Payment verified (local session)!",
              attendance: "Student attendance record updated!",
              revenueAudit: "Downloading Central Revenue Audit Report (Excel)...",
              switchedBranch: (name: string) => `Switched to ${name} Branch Admin Dashboard!`,
              newBatch: "New batch creation modal opened...",
              liveStarted: "Today's live Zoom class has started!",
              linkCopied: "Class link copied to clipboard!",
              downloadReady: (name: string) => `${name} download is ready!`,
            },
          },
          bn: {
            backToCourse: "কোর্স ল্যান্ডিং পেজে ফিরুন",
            centralSynced: "সেন্ট্রাল ডাটাবেস সিঙ্কড",
            switchRole: "সুইচ রোল:",
            switchRoleHelp: "রোল পরিবর্তন করে প্রতিটি ড্যাশবোর্ডের ক্ষমতা ও ফিচার টেস্ট করুন",
            roleSuperAdmin: "Main Admin (Super Admin)",
            roleBranchAdmin: "Branch Admin (Dhaka HQ)",
            roleTeacher: "Teacher (Sensei Rafiqul)",
            roleStudent: "Student (Shakil Chowdhury)",
            superAdminTag: "Super Admin Console",
            hqName: "KNLTC সেন্ট্রাল হেডকোয়ার্টার",
            superAdminTitle: "সেন্ট্রাল ম্যানেজমেন্ট ও অ্যানালিটিক্স ড্যাশবোর্ড",
            superAdminSub: "৪টি শাখা ক্যাম্পাস, সেন্ট্রাল কোর্স ফি, এনরোলমেন্ট অডিট এবং জাপান ভিসা প্রসেসিং ফাইল।",
            revenueBtn: "রাজস্ব রিপোর্ট (Excel)",
            kpiTotalRevenue: "মোট কোর্স ফি আদায়",
            kpiRevenueGrowth: "চলতি অর্থবছরে +২২% প্রবৃদ্ধি",
            kpiTotalStudents: "মোট নিবন্ধিত শিক্ষার্থী",
            kpiActiveCampuses: "৪টি ক্যাম্পাসে বর্তমানে সক্রিয়",
            kpiBatches: "চলমান ও আসন্ন ব্যাচ",
            kpiBatchSub: "সকাল, সন্ধ্যা ও অনলাইন সমন্বিত",
            kpiPendingApprovals: "অপেক্ষমাণ ভর্তি আবেদন",
            kpiPendingSub: "ব্রাঞ্চ এডমিন যাচাইয়ের অপেক্ষায়",
            branchPerfTitle: "শাখাভিত্তিক পারফরম্যান্স ও এডমিন ম্যানেজমেন্ট",
            branchPerfSub: "শাখাগুলোর শিক্ষার্থী সংখ্যা, যোগাযোগ এবং নিযুক্ত এডমিন",
            activeBranches: "৪টি শাখা সক্রিয়",
            thCampus: "ক্যাম্পাসের নাম",
            thLocation: "লোকেশন ও ফোন",
            thStudents: "শিক্ষার্থী সংখ্যা",
            thAdmin: "ব্রাঞ্চ এডমিন",
            thManage: "ম্যানেজমেন্ট",
            assignedBadge: "নিয়োজিত",
            openBranchBtn: "ব্রাঞ্চ ভিউ খুলুন",
            centralEnrollmentTitle: "সেন্ট্রাল ভর্তি ও আবেদন অডিট",
            centralEnrollmentSub: "অনলাইন ও ক্যাম্পাসের সব সাম্প্রতিক ভর্তি তথ্য",
            filterLabel: "ফিল্টার:",
            filterAll: "সব রেকর্ড",
            thEnrollNo: "এনরোল নং",
            thApplicant: "শিক্ষার্থীর নাম",
            thCourseBranch: "কোর্স ও শাখা",
            thPhone: "মোবাইল",
            thFeePayment: "ফি ও পেমেন্ট",
            thStatus: "স্ট্যাটাস",
            thAction: "পদক্ষেপ",
            btnApprove: "অনুমোদন",
            statusApproved: "সম্পন্ন",
            statusPending: "পেন্ডিং",
            paidPrefix: "পরিশোধ:",
            branchAdminTag: "Branch Administrator",
            branchHqLocation: "Dhaka Head Office (VIP Road, Naya Paltan)",
            branchAdminTitle: "ক্যাম্পাস ব্যাচ, ভর্তি ও পেমেন্ট ভেরিফিকেশন",
            branchAdminSub: "ক্লাসরুম আসন বরাদ্দ, অফলাইন/অনলাইন ফি ভেরিফিকেশন এবং শিক্ষার্থীদের ডকুমেন্ট যাচাই।",
            newBatchBtn: "নতুন ব্যাচ তৈরি করুন",
            kpiCampusStudents: "ক্যাম্পাসে সক্রিয় শিক্ষার্থী",
            kpiFloorRoom: "৮ম তলা ক্যাম্পাস ক্লাসরুম",
            kpiRunningBatches: "চলমান ব্যাচ সংখ্যা",
            kpiShiftsDesc: "মর্নিং, ইভনিং ও উইকেন্ড",
            kpiPendingPayments: "পেমেন্ট ভেরিফিকেশন পেন্ডিং",
            kpiReceiptsDesc: "bKash ও ব্যাংক রিসিট",
            kpiAvgAttendance: "গড় ক্লাস উপস্থিতি",
            kpiTrackerDesc: "ডিজিটাল হাজিরা ট্র্যাকার",
            paymentQueueTitle: "পেমেন্ট অনুমোদন ও রিসিট ইস্যু কিউ",
            paymentQueueSub: "শিক্ষার্থীদের সাবমিটকৃত ট্রানজেকশন আইডি যাচাই করে সিট কনফার্ম করুন",
            pendingVerificationTag: "পেন্ডিং ভেরিফিকেশন",
            courseLabel: "কোর্স:",
            deliveryLabel: "ডেলিভারি:",
            onlineZoom: "অনলাইন জুম",
            campusMode: "ক্যাম্পাস",
            feeLabel: "ফি:",
            paymentStatusWaiting: "পেমেন্ট স্ট্যাটাস: অপেক্ষা করছে (bKash / Cash / Bank)",
            btnVerifyPayment: "পেমেন্ট ভেরিফাই ও অনুমোদন",
            batchesScheduleTitle: "ব্রাঞ্চ ব্যাচ শিডিউল ও রুম এলোকেশন",
            batchesScheduleSub: "ক্যাম্পাস ও অনলাইন লাইভ ব্যাচগুলোর রুটিন এবং ইনস্ট্রাক্টর",
            instructorLabel: "ইনস্ট্রাক্টর:",
            scheduleLabel: "শিডিউল:",
            locationLabel: "লোকেশন:",
            onlineZoomLive: "অনলাইন জুম লাইভ",
            seatBookingLabel: "সিট বরাদ্দ:",
            teacherTag: "Instructor Workspace",
            teacherSub: "Sensei Rafiqul Islam (N2 Certified)",
            teacherTitle: "লাইভ ক্লাস, লেকচার শিট ও স্টুডেন্ট হাজিরা",
            teacherSubtitle: "অ্যাসাইন্ড ব্যাচ পরিচালনা, মিন্না নো নিহোঙ্গো লেকচার শিট আপলোড এবং ডিজিটাল উপস্থিতি খাতা।",
            btnStartLive: "আজকের লাইভ ক্লাস শুরু করুন",
            runningLesson: "রানিং লেসন: ১৫",
            zoomMeetLabel: "Google Meet / Zoom লাইভ লিংক:",
            copyLinkBtn: "কপি লিংক",
            digitalAttendanceLabel: "আজকের ক্লাসের ডিজিটাল হাজিরা (Attendance):",
            presentLabel: "✓ উপস্থিত (Present)",
            absentLabel: "✗ অনুপস্থিত (Absent)",
            uploadResourceTitle: "স্টাডি রিসোর্স আপলোড ও ম্যানেজমেন্ট",
            uploadResourceSub: "শিক্ষার্থীদের জন্য লেকচার শিট, অডিও ও কুইজ পেপার",
            btnUpload: "নতুন ফাইল আপলোড",
            downloadsLabel: "বার ডাউনলোড",
            studentTag: "Student Dashboard",
            studentEnrollNo: "এনরোলমেন্ট নম্বর: KNLTC-2026-081",
            studentWelcome: "স্বাগতম, শাকিল চৌধুরী!",
            enrolledCourseLabel: "এনরোল্ড কোর্স:",
            n5CourseTitle: "Japanese N5 Level Course",
            batchLabel: "ব্যাচ:",
            n5EveningBatch: "N5 Evening Classroom (Dhaka HQ)",
            btnJoinLive: "আজকের লাইভ ক্লাসে জয়েন করুন",
            nextClassTitle: "পরবর্তী ক্লাস",
            nextClassTime: "শনিবার সন্ধ্যা ৬:৩০",
            nextClassRoom: "রুম ৮০২ (স্কাই ভিউ ট্রেড ভ্যালি)",
            feeStatusTitle: "কোর্স ফি পেমেন্ট",
            paidStatusBadge: "পরিশোধিত",
            receiptLabel: "রশিদ নং: RCP-2026-0081",
            attendanceTitle: "উপস্থিতি রেকর্ড",
            attendanceStat: "১২টি ক্লাসের মধ্যে ১১টিতে উপস্থিত",
            targetExamTitle: "টার্গেট পরীক্ষা",
            targetExamName: "JLPT N5 (Dec 2026)",
            mockSeriesDesc: "মক টেস্ট সিরিজ অন্তর্ভুক্ত",
            visaMilestoneTitle: "আপনার জাপান ভিসা প্রসেসিং রোডম্যাপ (Milestone Tracker)",
            visaMilestoneSub: "ভাষা কোর্স সম্পন্ন করা থেকে শুরু করে জাপান যাত্রা পর্যন্ত ৫টি প্রধান ধাপ",
            step1Active: "ধাপ ০১ চলমান",
            studyMaterialsTitle: "আপনার কোর্সের স্টাডি ম্যাটেরিয়ালস ও হ্যান্ডআউট",
            studyMaterialsSub: "১-ক্লিকে ডাউনলোড করে অফলাইনে পড়ার সুবিধা",
            uploadedByLabel: "আপলোড:",
            btnDownload: "ডাউনলোড",
            notices: {
              approved: "ভর্তি আবেদনটি সফলভাবে অনুমোদন (Approved) করা হয়েছে!",
              approvedLocal: "ভর্তি অনুমোদন আপডেট করা হয়েছে (লোকাল সেশন)!",
              paymentVerified: "কোর্স ফি সফলভাবে ভেরিফাই ও পেমেন্ট রিসিট ইস্যু করা হয়েছে!",
              paymentVerifiedLocal: "পেমেন্ট ভেরিফাইড (লোকাল সেশন)!",
              attendance: "শিক্ষার্থীর হাজিরা রেকর্ড আপডেট করা হয়েছে!",
              revenueAudit: "সেন্ট্রাল ফাইন্যান্সিয়াল অডিট রিপোর্ট ডাউনলোড হচ্ছে...",
              switchedBranch: (name: string) => `${name}-এর ব্রাঞ্চ এডমিন ড্যাশবোর্ডে সুইচ করা হয়েছে!`,
              newBatch: "নতুন ব্যাচ সৃষ্টির উইন্ডো খোলা হয়েছে...",
              liveStarted: "আজকের জুম লাইভ ক্লাস শুরু হয়েছে!",
              linkCopied: "লিংক কপি হয়েছে!",
              downloadReady: (name: string) => `${name} ডাউনলোড ফাইল প্রস্তুত!`,
            },
          },
          ja: {
            backToCourse: "講座ページへ戻る",
            centralSynced: "中央データベース同期済み",
            switchRole: "ロール切替:",
            switchRoleHelp: "各ダッシュボードの権限と機能を切り替えてテストできます",
            roleSuperAdmin: "Main Admin (最高管理者)",
            roleBranchAdmin: "Branch Admin (ダッカ本部)",
            roleTeacher: "Teacher (ラフィクル講師)",
            roleStudent: "Student (シャキル生徒)",
            superAdminTag: "Super Admin Console",
            hqName: "KNLTC 中央統括本部",
            superAdminTitle: "中央管理・分析ダッシュボード",
            superAdminSub: "4拠点キャンパス、受講料監査、入学審査、ビザ申請状況の全社統合管理。",
            revenueBtn: "収支レポート (Excel)",
            kpiTotalRevenue: "受講料総回収額",
            kpiRevenueGrowth: "今会計年度 +22% 成長",
            kpiTotalStudents: "総登録受講生数",
            kpiActiveCampuses: "4キャンパスで在籍中",
            kpiBatches: "開講中・募集中のクラス",
            kpiBatchSub: "午前・夜間・オンライン",
            kpiPendingApprovals: "審査待ち受講申込",
            kpiPendingSub: "拠点管理者の確認待ち",
            branchPerfTitle: "拠点別実績および管理者一覧",
            branchPerfSub: "拠点ごとの受講生数、連絡先、専任担当者",
            activeBranches: "4拠点 稼働中",
            thCampus: "キャンパス名",
            thLocation: "所在地・電話番号",
            thStudents: "受講生数",
            thAdmin: "拠点管理者",
            thManage: "操作",
            assignedBadge: "専任担当",
            openBranchBtn: "拠点画面を開く",
            centralEnrollmentTitle: "全社受講申請および入学監査",
            centralEnrollmentSub: "オンラインおよび対面クラスの最新申込状況",
            filterLabel: "フィルター:",
            filterAll: "全件表示",
            thEnrollNo: "受付番号",
            thApplicant: "受講生氏名",
            thCourseBranch: "講座・拠点",
            thPhone: "電話番号",
            thFeePayment: "受講料・支払",
            thStatus: "状態",
            thAction: "対応",
            btnApprove: "承認",
            statusApproved: "承認済",
            statusPending: "保留中",
            paidPrefix: "支払済:",
            branchAdminTag: "Branch Administrator",
            branchHqLocation: "ダッカ本部キャンパス (VIP Road, Naya Paltan)",
            branchAdminTitle: "拠点クラス運営・入学審査・支払確認",
            branchAdminSub: "教室の座席割当、対面/オンライン受講料確認、必要書類監査。",
            newBatchBtn: "新規クラス作成",
            kpiCampusStudents: "拠点在籍生徒数",
            kpiFloorRoom: "本部8階キャンパス教室",
            kpiRunningBatches: "開講中クラス数",
            kpiShiftsDesc: "午前・夜間・週末",
            kpiPendingPayments: "支払確認待ち",
            kpiReceiptsDesc: "bKash・銀行振込明細",
            kpiAvgAttendance: "平均出席率",
            kpiTrackerDesc: "電子出欠簿連動",
            paymentQueueTitle: "支払承認・領収書発行キュー",
            paymentQueueSub: "取引IDを確認し、席の予約を確定してください",
            pendingVerificationTag: "確認待ち",
            courseLabel: "講座:",
            deliveryLabel: "受講形式:",
            onlineZoom: "オンラインZoom",
            campusMode: "対面キャンパス",
            feeLabel: "受講料:",
            paymentStatusWaiting: "支払い状況: 確認待ち (bKash / 現金 / 銀行)",
            btnVerifyPayment: "支払確認・受講承認",
            batchesScheduleTitle: "拠点クラス時間割・教室割当",
            batchesScheduleSub: "対面およびオンラインクラスの日程と担当講師",
            instructorLabel: "担当講師:",
            scheduleLabel: "日程:",
            locationLabel: "場所:",
            onlineZoomLive: "オンラインZoomライブ",
            seatBookingLabel: "予約席数:",
            teacherTag: "Instructor Workspace",
            teacherSub: "ラフィクル・イスラム先生 (N2有資格・日本語指導歴8年)",
            teacherTitle: "オンライン授業・講義シート・出欠管理",
            teacherSubtitle: "担当クラス運営、『みんなの日本語』教材配布、電子出席簿の記録。",
            btnStartLive: "本日のライブ授業を開始",
            runningLesson: "進行中: 第15課",
            zoomMeetLabel: "Google Meet / Zoom 授業リンク:",
            copyLinkBtn: "リンクをコピー",
            digitalAttendanceLabel: "本日の電子出欠簿 (Attendance):",
            presentLabel: "✓ 出席 (Present)",
            absentLabel: "✗ 欠席 (Absent)",
            uploadResourceTitle: "学習教材アップロード・管理",
            uploadResourceSub: "受講生向けの講義シート、音声教材、練習問題",
            btnUpload: "新規ファイル追加",
            downloadsLabel: "回ダウンロード",
            studentTag: "Student Dashboard",
            studentEnrollNo: "学籍番号: KNLTC-2026-081",
            studentWelcome: "ようこそ、シャキルさん！",
            enrolledCourseLabel: "受講中の講座:",
            n5CourseTitle: "日本語N5集中マスター講座",
            batchLabel: "所属クラス:",
            n5EveningBatch: "N5 夕方対面クラス (ダッカ本部)",
            btnJoinLive: "本日のライブ授業に参加",
            nextClassTitle: "次の授業",
            nextClassTime: "土曜日 18:30〜",
            nextClassRoom: "802号室 (スカイビュートレードバレー)",
            feeStatusTitle: "受講料ステータス",
            paidStatusBadge: "全額支払済",
            receiptLabel: "領収番号: RCP-2026-0081",
            attendanceTitle: "出席実績",
            attendanceStat: "12回中11回出席",
            targetExamTitle: "目標試験",
            targetExamName: "JLPT N5 (2026年12月期)",
            mockSeriesDesc: "模擬試験シリーズ込み",
            visaMilestoneTitle: "日本ビザ取得ロードマップ (Milestone Tracker)",
            visaMilestoneSub: "語学学習開始から日本渡航までの主要5ステップ",
            step1Active: "ステップ01 進行中",
            studyMaterialsTitle: "受講教材・配布プリント",
            studyMaterialsSub: "ワンクリックでダウンロードしてオフライン学習が可能",
            uploadedByLabel: "配布者:",
            btnDownload: "ダウンロード",
            notices: {
              approved: "受講申請が正常に承認されました！",
              approvedLocal: "受講承認が更新されました（ローカルセッション）",
              paymentVerified: "受講料が確認され、領収書が発行されました！",
              paymentVerifiedLocal: "支払いが確認されました（ローカルセッション）",
              attendance: "出欠記録が更新されました！",
              revenueAudit: "中央収支監査レポート（Excel）を準備中...",
              switchedBranch: (name: string) => `${name}の拠点管理者画面へ切り替えました！`,
              newBatch: "新規クラス作成ウィンドウを開きました...",
              liveStarted: "本日のZoomライブ授業を開始しました！",
              linkCopied: "リンクをクリップボードにコピーしました！",
              downloadReady: (name: string) => `${name}のダウンロード準備が完了しました！`,
            },
          },
        },
        language,
      ),
    [language],
  );

  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 4000);
  };

  // Sync with /api/portal on mount
  useEffect(() => {
    fetch("/api/portal")
      .then((r) => r.json())
      .then((data) => {
        if (data.enrollments) setEnrollments(data.enrollments);
        if (data.batches) setBatches(data.batches);
        if (data.resources) setResources(data.resources);
      })
      .catch((err) => console.warn("Could not fetch remote portal data:", err));
  }, []);

  const handleApproveEnrollment = async (enrollmentId: string) => {
    try {
      const res = await fetch("/api/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_enrollment_status",
          enrollmentId,
          status: "APPROVED",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEnrollments((prev) =>
          prev.map((e) => (e.id === enrollmentId ? { ...e, status: "APPROVED" } : e)),
        );
        showNotice(t.notices.approved);
      }
    } catch {
      setEnrollments((prev) =>
        prev.map((e) => (e.id === enrollmentId ? { ...e, status: "APPROVED" } : e)),
      );
      showNotice(t.notices.approvedLocal);
    }
  };

  const handleVerifyPayment = async (enrollmentId: string) => {
    try {
      const res = await fetch("/api/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_payment",
          enrollmentId,
          paymentStatus: "VERIFIED",
          paidAmount: 12000,
          method: "BKASH",
          transactionId: `BK-${Date.now().toString().slice(-6)}`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEnrollments((prev) =>
          prev.map((e) =>
            e.id === enrollmentId
              ? { ...e, paymentStatus: "VERIFIED", paidAmount: e.totalPayable, status: "APPROVED" }
              : e,
          ),
        );
        showNotice(t.notices.paymentVerified);
      }
    } catch {
      setEnrollments((prev) =>
        prev.map((e) =>
          e.id === enrollmentId
            ? { ...e, paymentStatus: "VERIFIED", paidAmount: e.totalPayable, status: "APPROVED" }
            : e,
        ),
      );
      showNotice(t.notices.paymentVerifiedLocal);
    }
  };

  const handleToggleAttendance = (studentId: string) => {
    setAttendanceState((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === "PRESENT" ? "ABSENT" : "PRESENT",
    }));
    showNotice(t.notices.attendance);
  };

  // Derived metrics for main admin
  const totalRevenue = enrollments.reduce((sum, e) => sum + (e.paidAmount || 0), 0) + 1420000;
  const pendingApprovals = enrollments.filter((e) => e.status === "PENDING").length;

  return (
    <div className="min-h-screen bg-stone-50 text-slate-900 pb-20">
      {/* Top Brand Bar */}
      <header className="border-b border-stone-200 bg-white sticky top-0 z-30 shadow-xs">
        <div className="container-narrow py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/japanese-language"
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#b91c1c] transition"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{t.backToCourse}</span>
            </Link>
            <span className="text-stone-300">|</span>
            <span className="font-extrabold text-[#b91c1c] text-sm tracking-tight">KNLTC Japan Gateway</span>
            <Badge className="border-red-200 bg-red-50 text-[#b91c1c] text-[10px] hidden sm:inline-flex">
              RBAC
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-stone-100 px-3 py-1.5 rounded-full font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{t.centralSynced}</span>
            </div>
          </div>
        </div>

        {/* 4-Tier Role Navigation Tabs */}
        <div className="border-t border-stone-200 bg-[#fcfaf7]">
          <div className="container-narrow py-2.5 overflow-x-auto flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:inline mr-2">
                {t.switchRole}
              </span>

              <button
                onClick={() => setRole("MAIN_ADMIN")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                  role === "MAIN_ADMIN"
                    ? "bg-[#b91c1c] text-white shadow-xs"
                    : "bg-white text-slate-700 border border-stone-200 hover:bg-stone-50"
                }`}
              >
                <ShieldCheck className="h-4 w-4" />
                <span>{t.roleSuperAdmin}</span>
              </button>

              <button
                onClick={() => setRole("BRANCH_ADMIN")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                  role === "BRANCH_ADMIN"
                    ? "bg-[#15803d] text-white shadow-xs"
                    : "bg-white text-slate-700 border border-stone-200 hover:bg-stone-50"
                }`}
              >
                <Building className="h-4 w-4" />
                <span>{t.roleBranchAdmin}</span>
              </button>

              <button
                onClick={() => setRole("TEACHER")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                  role === "TEACHER"
                    ? "bg-blue-700 text-white shadow-xs"
                    : "bg-white text-slate-700 border border-stone-200 hover:bg-stone-50"
                }`}
              >
                <GraduationCap className="h-4 w-4" />
                <span>{t.roleTeacher}</span>
              </button>

              <button
                onClick={() => setRole("STUDENT")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                  role === "STUDENT"
                    ? "bg-amber-600 text-white shadow-xs"
                    : "bg-white text-slate-700 border border-stone-200 hover:bg-stone-50"
                }`}
              >
                <UserCheck className="h-4 w-4" />
                <span>{t.roleStudent}</span>
              </button>
            </div>

            <div className="text-xs text-slate-500 hidden lg:block">{t.switchRoleHelp}</div>
          </div>
        </div>
      </header>

      {/* Floating Action Notice */}
      {actionNotice && (
        <div className="fixed bottom-5 right-5 z-50 rounded-2xl bg-slate-900 text-white px-5 py-3 shadow-2xl text-xs font-semibold flex items-center gap-2 border border-slate-700 animate-in slide-in-from-bottom duration-300">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Main Role Canvas */}
      <main className="container-narrow mt-6">
        {/* ========================================================================= */}
        {/* TIER 1: MAIN ADMIN (SUPER ADMIN) DASHBOARD */}
        {/* ========================================================================= */}
        {role === "MAIN_ADMIN" && (
          <div className="space-y-6">
            {/* Super Admin Welcome Banner */}
            <div className="rounded-3xl border border-red-200 bg-gradient-to-r from-red-50/80 via-white to-stone-50 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
              <div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-[#b91c1c] text-white text-[11px] font-bold">
                    {t.superAdminTag}
                  </Badge>
                  <span className="text-xs text-slate-500 font-medium">{t.hqName}</span>
                </div>
                <h1 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
                  {t.superAdminTitle}
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-slate-600">{t.superAdminSub}</p>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => showNotice(t.notices.revenueAudit)}
                  className="bg-[#b91c1c] hover:bg-red-800 text-white text-xs font-bold rounded-xl"
                >
                  <FileSpreadsheet className="mr-1.5 h-4 w-4" /> {t.revenueBtn}
                </Button>
              </div>
            </div>

            {/* Financial & Operational KPI Cards */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
                <span className="text-xs font-medium text-slate-500">{t.kpiTotalRevenue}</span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-[#15803d]">
                    ৳{totalRevenue.toLocaleString()}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-emerald-700 flex items-center gap-1 font-medium">
                  <TrendingUp className="h-3.5 w-3.5" /> {t.kpiRevenueGrowth}
                </p>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
                <span className="text-xs font-medium text-slate-500">{t.kpiTotalStudents}</span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900">1,055</span>
                </div>
                <p className="mt-1 text-[11px] text-slate-500 font-medium">{t.kpiActiveCampuses}</p>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
                <span className="text-xs font-medium text-slate-500">{t.kpiBatches}</span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-[#b91c1c]">{batches.length}</span>
                </div>
                <p className="mt-1 text-[11px] text-slate-500 font-medium">{t.kpiBatchSub}</p>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
                <span className="text-xs font-medium text-slate-500">{t.kpiPendingApprovals}</span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-amber-600">{pendingApprovals}</span>
                </div>
                <p className="mt-1 text-[11px] text-amber-700 font-medium">{t.kpiPendingSub}</p>
              </div>
            </div>

            {/* Central Branch Overview Table */}
            <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{t.branchPerfTitle}</h3>
                  <p className="text-xs text-slate-500">{t.branchPerfSub}</p>
                </div>
                <Badge variant="outline" className="border-stone-300 text-xs font-medium">
                  {t.activeBranches}
                </Badge>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="border-b border-stone-200 bg-stone-50 text-slate-600 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4 font-bold">{t.thCampus}</th>
                      <th className="py-3 px-4 font-bold">{t.thLocation}</th>
                      <th className="py-3 px-4 font-bold">{t.thStudents}</th>
                      <th className="py-3 px-4 font-bold">{t.thAdmin}</th>
                      <th className="py-3 px-4 font-bold text-right">{t.thManage}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {INITIAL_BRANCHES.map((b) => (
                      <tr key={b.id} className="hover:bg-stone-50/80 transition">
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          {b.name}
                          <span className="block text-[11px] text-slate-400 font-mono font-normal">
                            {b.code}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-slate-600">
                          {b.address}
                          <span className="block text-[11px] text-slate-400">{b.phone}</span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-[#15803d]">{b.totalStudents}</td>
                        <td className="py-3.5 px-4">
                          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 border border-emerald-200">
                            Farhana Yasmin ({t.assignedBadge})
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedBranchId(b.id);
                              setRole("BRANCH_ADMIN");
                              showNotice(t.notices.switchedBranch(b.name));
                            }}
                            className="text-xs h-8 border-stone-300 hover:bg-stone-100"
                          >
                            {t.openBranchBtn}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Central Master Enrollment List */}
            <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{t.centralEnrollmentTitle}</h3>
                  <p className="text-xs text-slate-500">{t.centralEnrollmentSub}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">{t.filterLabel}</span>
                  <Badge className="bg-stone-100 text-slate-700 hover:bg-stone-200 text-xs">
                    {t.filterAll}
                  </Badge>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="border-b border-stone-200 bg-stone-50 text-slate-600 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-3 font-bold">{t.thEnrollNo}</th>
                      <th className="py-3 px-3 font-bold">{t.thApplicant}</th>
                      <th className="py-3 px-3 font-bold">{t.thCourseBranch}</th>
                      <th className="py-3 px-3 font-bold">{t.thPhone}</th>
                      <th className="py-3 px-3 font-bold">{t.thFeePayment}</th>
                      <th className="py-3 px-3 font-bold">{t.thStatus}</th>
                      <th className="py-3 px-3 font-bold text-right">{t.thAction}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {enrollments.map((enr) => (
                      <tr key={enr.id} className="hover:bg-stone-50/80 transition">
                        <td className="py-3 px-3 font-mono font-bold text-[#b91c1c] text-xs">
                          {enr.enrollmentNo}
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-900">
                          {enr.applicantName}
                          <span className="block text-[11px] text-slate-400 font-normal">
                            {enr.highestDegree || "N/A"}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-xs text-slate-700">
                          {enr.courseTitle}
                          <span className="block text-[11px] text-slate-400">{enr.branchName}</span>
                        </td>
                        <td className="py-3 px-3 text-xs text-slate-600">{enr.phone}</td>
                        <td className="py-3 px-3">
                          <span className="font-bold text-slate-900">৳{enr.totalPayable}</span>
                          <span
                            className={`block text-[11px] font-semibold ${
                              enr.paymentStatus === "VERIFIED" ? "text-emerald-700" : "text-amber-700"
                            }`}
                          >
                            {t.paidPrefix} ৳{enr.paidAmount} ({enr.paymentStatus})
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                              enr.status === "APPROVED"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {enr.status === "APPROVED" ? t.statusApproved : t.statusPending}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          {enr.status === "PENDING" ? (
                            <Button
                              size="sm"
                              onClick={() => handleApproveEnrollment(enr.id)}
                              className="bg-[#15803d] hover:bg-emerald-700 text-white text-xs h-7 rounded-lg"
                            >
                              {t.btnApprove}
                            </Button>
                          ) : (
                            <span className="text-xs text-slate-400 font-medium">{t.statusApproved}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TIER 2: BRANCH ADMIN DASHBOARD */}
        {/* ========================================================================= */}
        {role === "BRANCH_ADMIN" && (
          <div className="space-y-6">
            <div className="rounded-3xl border border-green-200 bg-gradient-to-r from-green-50/80 via-white to-stone-50 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
              <div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-[#15803d] text-white text-[11px] font-bold">
                    {t.branchAdminTag}
                  </Badge>
                  <span className="text-xs text-slate-500 font-medium">{t.branchHqLocation}</span>
                </div>
                <h1 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
                  {t.branchAdminTitle}
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-slate-600">{t.branchAdminSub}</p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => showNotice(t.notices.newBatch)}
                  className="bg-[#15803d] hover:bg-emerald-700 text-white text-xs font-bold rounded-xl"
                >
                  <PlusCircle className="mr-1.5 h-4 w-4" /> {t.newBatchBtn}
                </Button>
              </div>
            </div>

            {/* Branch Quick Stats */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
                <span className="text-xs font-medium text-slate-500">{t.kpiCampusStudents}</span>
                <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">340</div>
                <p className="mt-1 text-[11px] text-slate-500">{t.kpiFloorRoom}</p>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
                <span className="text-xs font-medium text-slate-500">{t.kpiRunningBatches}</span>
                <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#15803d]">8</div>
                <p className="mt-1 text-[11px] text-slate-500">{t.kpiShiftsDesc}</p>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
                <span className="text-xs font-medium text-slate-500">{t.kpiPendingPayments}</span>
                <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-amber-600">2</div>
                <p className="mt-1 text-[11px] text-amber-700">{t.kpiReceiptsDesc}</p>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
                <span className="text-xs font-medium text-slate-500">{t.kpiAvgAttendance}</span>
                <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#b91c1c]">94%</div>
                <p className="mt-1 text-[11px] text-slate-500">{t.kpiTrackerDesc}</p>
              </div>
            </div>

            {/* Pending Payment Verification Queue */}
            <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{t.paymentQueueTitle}</h3>
                  <p className="text-xs text-slate-500">{t.paymentQueueSub}</p>
                </div>
                <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-xs">
                  {t.pendingVerificationTag}
                </Badge>
              </div>

              <div className="space-y-3">
                {enrollments
                  .filter((e) => e.paymentStatus === "PENDING" || e.status === "PENDING")
                  .map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-stone-200 bg-stone-50/60 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{item.applicantName}</span>
                          <span className="text-xs text-slate-500">({item.phone})</span>
                          <Badge variant="outline" className="text-[10px]">
                            {item.enrollmentNo}
                          </Badge>
                        </div>
                        <p className="mt-1 text-xs text-slate-600">
                          {t.courseLabel} <strong>{item.courseTitle}</strong> • {t.deliveryLabel}{" "}
                          {item.deliveryMode === "ONLINE_LIVE" ? t.onlineZoom : t.campusMode} • {t.feeLabel} ৳
                          {item.totalPayable}
                        </p>
                        <p className="mt-0.5 text-xs text-amber-700 font-medium">
                          {t.paymentStatusWaiting}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          size="sm"
                          onClick={() => handleVerifyPayment(item.id)}
                          className="bg-[#15803d] hover:bg-emerald-700 text-white text-xs font-bold rounded-xl"
                        >
                          <CreditCard className="mr-1.5 h-3.5 w-3.5" /> {t.btnVerifyPayment}
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Branch Batches & Classroom Allocation */}
            <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{t.batchesScheduleTitle}</h3>
                  <p className="text-xs text-slate-500">{t.batchesScheduleSub}</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {batches.map((batch) => (
                  <div key={batch.id} className="rounded-2xl border border-stone-200 p-4 space-y-3 bg-[#fcfaf7]">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">{batch.name}</span>
                      <span className="text-xs font-mono font-bold text-[#b91c1c]">{batch.code}</span>
                    </div>

                    <div className="text-xs space-y-1 text-slate-600">
                      <p>
                        <strong>{t.instructorLabel}</strong> {batch.teacherName}
                      </p>
                      <p>
                        <strong>{t.scheduleLabel}</strong> {batch.scheduleTime}
                      </p>
                      <p>
                        <strong>{t.locationLabel}</strong> {batch.classroomRoom || t.onlineZoomLive}
                      </p>
                    </div>

                    <div className="border-t border-stone-200 pt-3 flex items-center justify-between">
                      <span className="text-xs text-slate-600">
                        {t.seatBookingLabel} <strong>{batch.seatsBooked}</strong> / {batch.seatsTotal}
                      </span>
                      <div className="w-24 bg-stone-200 rounded-full h-2">
                        <div
                          className="bg-[#15803d] h-2 rounded-full"
                          style={{ width: `${(batch.seatsBooked / batch.seatsTotal) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TIER 3: TEACHER (INSTRUCTOR) DASHBOARD */}
        {/* ========================================================================= */}
        {role === "TEACHER" && (
          <div className="space-y-6">
            <div className="rounded-3xl border border-blue-200 bg-gradient-to-r from-blue-50/80 via-white to-stone-50 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
              <div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-700 text-white text-[11px] font-bold">
                    {t.teacherTag}
                  </Badge>
                  <span className="text-xs text-slate-500 font-medium">{t.teacherSub}</span>
                </div>
                <h1 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
                  {t.teacherTitle}
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-slate-600">{t.teacherSubtitle}</p>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => showNotice(t.notices.liveStarted)}
                  className="bg-[#b91c1c] hover:bg-red-800 text-white text-xs font-bold rounded-xl"
                >
                  <Video className="mr-1.5 h-4 w-4" /> {t.btnStartLive}
                </Button>
              </div>
            </div>

            {/* Assigned Batches Cards */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">N5 Morning Live (Zoom Batch 42)</h3>
                    <p className="text-xs text-slate-500">Sun, Tue, Thu | 9:00 - 11:00 AM</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
                    {t.runningLesson}
                  </Badge>
                </div>

                <div className="rounded-2xl bg-blue-50/60 border border-blue-200 p-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-900">{t.zoomMeetLabel}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => showNotice(t.notices.linkCopied)}
                      className="text-[11px] h-6 text-blue-700 hover:bg-blue-100"
                    >
                      {t.copyLinkBtn}
                    </Button>
                  </div>
                  <p className="font-mono text-slate-700 bg-white p-2 rounded-xl border border-blue-100">
                    https://meet.google.com/knltc-n5-live
                  </p>
                </div>

                {/* Quick Student Attendance Sheet */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    {t.digitalAttendanceLabel}
                  </h4>

                  <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl overflow-hidden bg-white">
                    {enrollments.slice(0, 3).map((student) => {
                      const isPresent = attendanceState[student.id] === "PRESENT";
                      return (
                        <div key={student.id} className="p-3 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-slate-900">{student.applicantName}</span>
                            <span className="text-[11px] text-slate-400 block font-mono">
                              {student.enrollmentNo}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleToggleAttendance(student.id)}
                              className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                                isPresent
                                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                  : "bg-rose-100 text-rose-800 border border-rose-300"
                              }`}
                            >
                              {isPresent ? t.presentLabel : t.absentLabel}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Resource Upload Management */}
              <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{t.uploadResourceTitle}</h3>
                    <p className="text-xs text-slate-500">{t.uploadResourceSub}</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => showNotice(t.notices.downloadReady("Uploader module"))}
                    className="bg-blue-700 hover:bg-blue-800 text-white text-xs h-8 rounded-xl"
                  >
                    <Upload className="mr-1.5 h-3.5 w-3.5" /> {t.btnUpload}
                  </Button>
                </div>

                <div className="space-y-2.5">
                  {resources.slice(0, 4).map((res) => (
                    <div
                      key={res.id}
                      className="rounded-2xl border border-stone-200 bg-stone-50/70 p-3.5 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 line-clamp-1">{res.title}</p>
                          <p className="text-[11px] text-slate-500">
                            {res.type} • {res.size} • {res.downloads} {t.downloadsLabel}
                          </p>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => showNotice(t.notices.downloadReady(res.title))}
                        className="text-slate-600 hover:bg-white h-8"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TIER 4: STUDENT DASHBOARD */}
        {/* ========================================================================= */}
        {role === "STUDENT" && (
          <div className="space-y-6">
            {/* Student Header */}
            <div className="rounded-3xl border border-amber-200 bg-gradient-to-r from-amber-50/80 via-white to-stone-50 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
              <div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-amber-600 text-white text-[11px] font-bold">
                    {t.studentTag}
                  </Badge>
                  <span className="text-xs text-slate-500 font-medium">{t.studentEnrollNo}</span>
                </div>
                <h1 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
                  {t.studentWelcome}
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-slate-600">
                  {t.enrolledCourseLabel}{" "}
                  <strong className="text-[#b91c1c]">{t.n5CourseTitle}</strong> • {t.batchLabel}{" "}
                  {t.n5EveningBatch}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  asChild
                  className="bg-[#15803d] hover:bg-emerald-700 text-white text-xs font-bold rounded-xl px-5 py-5 shadow"
                >
                  <a href="https://meet.google.com/knltc-n5-live" target="_blank" rel="noopener noreferrer">
                    <Video className="mr-1.5 h-4 w-4" /> {t.btnJoinLive}
                  </a>
                </Button>
              </div>
            </div>

            {/* Quick Status Cards */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
                <span className="text-xs font-medium text-slate-500">{t.nextClassTitle}</span>
                <div className="mt-2 text-base sm:text-lg font-bold text-slate-900">{t.nextClassTime}</div>
                <p className="mt-1 text-[11px] text-slate-500">{t.nextClassRoom}</p>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
                <span className="text-xs font-medium text-slate-500">{t.feeStatusTitle}</span>
                <div className="mt-2 text-xl sm:text-2xl font-extrabold text-[#15803d]">
                  {t.paidStatusBadge}
                </div>
                <p className="mt-1 text-[11px] text-slate-500">{t.receiptLabel}</p>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
                <span className="text-xs font-medium text-slate-500">{t.attendanceTitle}</span>
                <div className="mt-2 text-xl sm:text-2xl font-extrabold text-blue-700">96%</div>
                <p className="mt-1 text-[11px] text-slate-500">{t.attendanceStat}</p>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
                <span className="text-xs font-medium text-slate-500">{t.targetExamTitle}</span>
                <div className="mt-2 text-base sm:text-lg font-bold text-[#b91c1c]">
                  {t.targetExamName}
                </div>
                <p className="mt-1 text-[11px] text-slate-500">{t.mockSeriesDesc}</p>
              </div>
            </div>

            {/* Japan Visa Roadmap Milestone Tracker */}
            <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{t.visaMilestoneTitle}</h3>
                  <p className="text-xs text-slate-500">{t.visaMilestoneSub}</p>
                </div>
                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs">
                  {t.step1Active}
                </Badge>
              </div>

              <div className="relative border-l-2 border-emerald-300 ml-4 pl-6 space-y-6 py-2">
                {STUDENT_VISA_MILESTONES.map((m) => (
                  <div key={m.step} className="relative">
                    {/* Step Icon */}
                    <div
                      className={`absolute -left-[35px] top-0 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                        m.status === "COMPLETED"
                          ? "bg-emerald-500 text-white"
                          : m.status === "CURRENT"
                          ? "bg-[#b91c1c] text-white ring-4 ring-red-100 animate-pulse"
                          : "bg-stone-200 text-slate-600"
                      }`}
                    >
                      {m.step}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">
                          {language === "bn" ? m.bnTitle : m.title}
                        </span>
                        {m.date && (
                          <span className="text-[11px] text-[#15803d] font-semibold bg-green-50 px-2 py-0.5 rounded-md border border-green-200">
                            {m.date}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-slate-600 leading-relaxed">{m.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Downloadable Study Materials */}
            <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{t.studyMaterialsTitle}</h3>
                  <p className="text-xs text-slate-500">{t.studyMaterialsSub}</p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {resources.map((res) => (
                  <div
                    key={res.id}
                    className="rounded-2xl border border-stone-200 p-4 bg-stone-50/70 hover:bg-white hover:border-amber-200 transition shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="rounded-md bg-stone-200 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                          {res.type} • {res.size}
                        </span>
                        {res.badge && (
                          <Badge className="bg-red-100 text-[#b91c1c] border-red-200 text-[10px]">
                            {res.badge}
                          </Badge>
                        )}
                      </div>
                      <h4 className="mt-2 text-sm font-bold text-slate-900 leading-snug">{res.title}</h4>
                      <p className="mt-1 text-xs text-slate-600 line-clamp-2">{res.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-stone-200/60 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">
                        {t.uploadedByLabel} {res.uploadedBy}
                      </span>
                      <Button
                        size="sm"
                        onClick={() => showNotice(t.notices.downloadReady(res.title))}
                        className="bg-[#15803d] hover:bg-emerald-700 text-white text-xs h-7 rounded-lg"
                      >
                        <Download className="mr-1 h-3.5 w-3.5" /> {t.btnDownload}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
