"use client";

import React, { useState, useMemo } from "react";
import {
  X,
  Upload,
  Download,
  FileSpreadsheet,
  ClipboardPaste,
  Link2,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  Table,
  SlidersHorizontal,
  ArrowRight,
  FileJson,
  Sparkles,
} from "lucide-react";
import {
  bulkImportCrmLeads,
  normalizeBdPhone,
  calculateLeadEligibility,
  type CrmLead,
  type LeadSource,
  type LeadStatus,
  type LeadPriority,
  type ServiceInterest,
  type StaffMember,
} from "@/lib/knltc-cms-store";
import { useLanguage } from "@/components/layout/LanguageProvider";

type ModalMode = "IMPORT" | "EXPORT";
type ImportMethod = "PASTE" | "FILE" | "GSHEET_URL";

interface CrmImportExportModalProps {
  initialMode?: ModalMode;
  allLeads: CrmLead[];
  filteredLeads: CrmLead[];
  selectedLeadIds: string[];
  staffList: StaffMember[];
  activeBranch: string;
  onClose: () => void;
  onImported: (summaryMessage: string) => void;
}

type MappedFieldKey =
  | "name"
  | "phone"
  | "whatsapp"
  | "email"
  | "city"
  | "education"
  | "sscGpa"
  | "hscGpa"
  | "graduationYear"
  | "studyGapYears"
  | "japaneseProficiency"
  | "interest"
  | "status"
  | "priority"
  | "assignedTo"
  | "targetSchool"
  | "contractAmountBdt"
  | "paidAmountBdt"
  | "followUpDate"
  | "notes";

const CRM_FIELD_DEFINITIONS: {
  key: MappedFieldKey;
  labelBn: string;
  labelEn: string;
  labelJa: string;
  required?: boolean;
  aliases: string[];
}[] = [
  {
    key: "name",
    labelBn: "প্রার্থীর নাম *",
    labelEn: "Candidate Name *",
    labelJa: "候補者氏名 *",
    required: true,
    aliases: [
      "name",
      "student name",
      "candidate name",
      "full name",
      "applicant",
      "student",
      "নাম",
      "শিক্ষার্থীর নাম",
      "প্রার্থীর নাম",
    ],
  },
  {
    key: "phone",
    labelBn: "মোবাইল নম্বর *",
    labelEn: "Phone Number *",
    labelJa: "電話番号 *",
    required: true,
    aliases: [
      "phone",
      "mobile",
      "phone number",
      "mobile number",
      "contact",
      "contact no",
      "cell",
      "number",
      "ফোন",
      "মোবাইল",
      "মোবাইল নম্বর",
    ],
  },
  {
    key: "whatsapp",
    labelBn: "WhatsApp নম্বর",
    labelEn: "WhatsApp Number",
    labelJa: "WhatsApp番号",
    aliases: ["whatsapp", "wa", "whatsapp no", "whatsapp number", "হোয়াটসঅ্যাপ"],
  },
  {
    key: "city",
    labelBn: "জেলা / শহর",
    labelEn: "City / District",
    labelJa: "都市・県",
    aliases: ["city", "district", "location", "zilla", "address", "জেলা", "শহর", "ঠিকানা"],
  },
  {
    key: "education",
    labelBn: "সর্বশেষ শিক্ষাগত যোগ্যতা",
    labelEn: "Highest Education",
    labelJa: "最終学歴",
    aliases: [
      "education",
      "qualification",
      "degree",
      "academic",
      "last education",
      "শিক্ষাগত যোগ্যতা",
      "শিক্ষা",
    ],
  },
  {
    key: "sscGpa",
    labelBn: "SSC GPA",
    labelEn: "SSC GPA",
    labelJa: "SSC GPA",
    aliases: ["ssc_gpa", "ssc gpa", "ssc", "ssc result", "ssc point", "dakhil", "এসএসসি"],
  },
  {
    key: "hscGpa",
    labelBn: "HSC / Diploma GPA",
    labelEn: "HSC / Diploma GPA",
    labelJa: "HSC GPA",
    aliases: ["hsc_gpa", "hsc gpa", "hsc", "hsc result", "diploma gpa", "alim", "gpa", "cgpa", "result", "এইচএসসি", "জিপিএ"],
  },
  {
    key: "graduationYear",
    labelBn: "পাসের সাল",
    labelEn: "Passing Year",
    labelJa: "卒業年",
    aliases: ["passing year", "pass year", "graduation year", "year", "hsc year", "পাসের সাল"],
  },
  {
    key: "studyGapYears",
    labelBn: "স্টাডি গ্যাপ (বছর)",
    labelEn: "Study Gap (Years)",
    labelJa: "空白期間（年）",
    aliases: ["study gap", "gap", "gap years", "year gap", "গ্যাপ", "স্টাডি গ্যাপ"],
  },
  {
    key: "japaneseProficiency",
    labelBn: "জাপানি ভাষা দক্ষতা",
    labelEn: "Japanese Level",
    labelJa: "日本語レベル",
    aliases: [
      "japanese",
      "japanese level",
      "language",
      "jlpt",
      "nat",
      "proficiency",
      "জাপানি ভাষা",
      "ভাষা",
    ],
  },
  {
    key: "interest",
    labelBn: "আগ্রহের কোর্স / ভিসা",
    labelEn: "Program / Interest",
    labelJa: "希望プログラム",
    aliases: [
      "interest",
      "program",
      "service",
      "course",
      "visa type",
      "package",
      "কোর্স",
      "ভিসা",
      "আগ্রহ",
    ],
  },
  {
    key: "status",
    labelBn: "লিড স্ট্যাটাস",
    labelEn: "Lead Status",
    labelJa: "ステータス",
    aliases: ["status", "lead status", "stage", "current status", "স্ট্যাটাস"],
  },
  {
    key: "priority",
    labelBn: "প্রায়োরিটি (HOT/WARM/COLD)",
    labelEn: "Priority",
    labelJa: "優先度",
    aliases: ["priority", "lead priority", "type", "প্রায়োরিটি"],
  },
  {
    key: "assignedTo",
    labelBn: "দায়িত্বপ্রাপ্ত কাউন্সেলর",
    labelEn: "Assigned Counselor",
    labelJa: "担当カウンセラー",
    aliases: ["counselor", "assigned to", "assigned", "executive", "staff", "কাউন্সেলর"],
  },
  {
    key: "targetSchool",
    labelBn: "টার্গেট স্কুল / কলেজ",
    labelEn: "Target School",
    labelJa: "志望校",
    aliases: ["school", "target school", "college", "university", "স্কুল"],
  },
  {
    key: "contractAmountBdt",
    labelBn: "চুক্তিমূল্য (BDT)",
    labelEn: "Contract Amount (BDT)",
    labelJa: "契約金額 (BDT)",
    aliases: ["contract", "contract amount", "total fee", "package fee", "চুক্তি"],
  },
  {
    key: "paidAmountBdt",
    labelBn: "জমা / পরিশোধিত (BDT)",
    labelEn: "Paid Amount (BDT)",
    labelJa: "支払済金額 (BDT)",
    aliases: ["paid", "paid amount", "received", "advance", "জমা", "পরিশোধ"],
  },
  {
    key: "email",
    labelBn: "ইমেইল",
    labelEn: "Email",
    labelJa: "メールアドレス",
    aliases: ["email", "e-mail", "mail", "ইমেইল"],
  },
  {
    key: "followUpDate",
    labelBn: "ফলো-আপ তারিখ",
    labelEn: "Follow-up Date",
    labelJa: "次回連絡日",
    aliases: ["follow up", "followup", "follow-up date", "next call", "ফলো-আপ"],
  },
  {
    key: "notes",
    labelBn: "মন্তব্য / নোটস",
    labelEn: "Notes / Remarks",
    labelJa: "備考・メモ",
    aliases: [
      "notes",
      "note",
      "remarks",
      "remark",
      "comment",
      "comments",
      "feedback",
      "details",
      "মন্তব্য",
      "নোট",
    ],
  },
];

/**
 * RFC-4180 compliant TSV / CSV parser that automatically detects tab vs comma delimiter
 */
function parseTabularText(rawText: string): string[][] {
  const trimmed = rawText.replace(/^\uFEFF/, "").trim();
  if (!trimmed) return [];

  // Detect delimiter from first line: if tabs exist, prefer tab (Google Sheets copy-paste)
  const firstLineEnd = trimmed.indexOf("\n");
  const firstLine = firstLineEnd === -1 ? trimmed : trimmed.slice(0, firstLineEnd);
  const tabCount = (firstLine.match(/\t/g) || []).length;
  const commaCount = (firstLine.match(/,/g) || []).length;
  const delimiter = tabCount > 0 && tabCount >= commaCount / 2 ? "\t" : ",";

  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = "";
  let inQuotes = false;

  for (let i = 0; i < trimmed.length; i++) {
    const ch = trimmed[i];
    const nextCh = trimmed[i + 1];

    if (inQuotes) {
      if (ch === '"' && nextCh === '"') {
        currentCell += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        currentCell += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === delimiter) {
        currentRow.push(currentCell.trim());
        currentCell = "";
      } else if (ch === "\r" && nextCh === "\n") {
        currentRow.push(currentCell.trim());
        if (currentRow.some((c) => c !== "")) rows.push(currentRow);
        currentRow = [];
        currentCell = "";
        i++;
      } else if (ch === "\n" || ch === "\r") {
        currentRow.push(currentCell.trim());
        if (currentRow.some((c) => c !== "")) rows.push(currentRow);
        currentRow = [];
        currentCell = "";
      } else {
        currentCell += ch;
      }
    }
  }

  currentRow.push(currentCell.trim());
  if (currentRow.some((c) => c !== "")) {
    rows.push(currentRow);
  }

  return rows;
}

function parseInterestValue(raw: string): ServiceInterest {
  const u = (raw || "").toUpperCase();
  if (u.includes("PREMIUM") || u.includes("প্রিমিয়াম")) return "STUDENT_VISA_PREMIUM";
  if (u.includes("CONSTRUCTION") || u.includes("কনস্ট্রাকশন")) return "SSW_CONSTRUCTION_SPECIAL";
  if (u.includes("CAREGIVER") || u.includes("কেয়ারগিভার")) return "SSW_CAREGIVER";
  if (u.includes("AGRI") || u.includes("কৃষি")) return "SSW_AGRICULTURE";
  if (u.includes("FOOD") || u.includes("ফুড")) return "SSW_FOOD_SERVICE";
  if (u.includes("TITP") || u.includes("INTERN")) return "TITP_TECHNICAL";
  if (u.includes("N4")) return "JAPANESE_N4";
  if (u.includes("N5") || u.includes("LANGUAGE") || u.includes("COURSE")) return "JAPANESE_N5";
  return "STUDENT_VISA_REGULAR";
}

function parseStatusValue(raw: string, fallback: LeadStatus): LeadStatus {
  const u = (raw || "").toUpperCase();
  if (u.includes("ADMIT") || u.includes("ENROLL") || u.includes("FILE") || u.includes("ভর্তি"))
    return "ADMITTED";
  if (u.includes("VISIT") || u.includes("ভিজিট")) return "OFFICE_VISIT_BOOKED";
  if (u.includes("COUNSEL") || u.includes("কাউন্সেল")) return "COUNSELED";
  if (u.includes("CONTACT") || u.includes("CALL") || u.includes("কথা")) return "CONTACTED";
  if (u.includes("ARCHIVE") || u.includes("CLOSED") || u.includes("REJECT")) return "ARCHIVED";
  if (u.includes("NEW") || u.includes("নতুন")) return "NEW";
  return fallback;
}

function parsePriorityValue(raw: string, fallback: LeadPriority): LeadPriority {
  const u = (raw || "").toUpperCase();
  if (u.includes("HOT") || u.includes("HIGH") || u.includes("URGENT")) return "HOT";
  if (u.includes("COLD") || u.includes("LOW")) return "COLD";
  if (u.includes("WARM") || u.includes("MEDIUM")) return "WARM";
  return fallback;
}

function parseJapaneseProficiency(
  raw: string,
): "NONE" | "LEARNING_N5" | "PASSED_N5" | "PASSED_N4" | "NAT_JFT" {
  const u = (raw || "").toUpperCase();
  if (u.includes("N4")) return "PASSED_N4";
  if (u.includes("NAT") || u.includes("JFT")) return "NAT_JFT";
  if (u.includes("PASS") || (u.includes("N5") && !u.includes("LEARN") && !u.includes("RUN")))
    return "PASSED_N5";
  if (u.includes("LEARN") || u.includes("RUN") || u.includes("N5") || u.includes("চলমান"))
    return "LEARNING_N5";
  return "NONE";
}

const SAMPLE_SHEET_TSV = `Student Name\tPhone Number\tCity\tEducation\tSSC GPA\tHSC GPA\tPassing Year\tStudy Gap\tJapanese Level\tProgram Interest\tLead Status\tPriority\tCounselor\tContract Amount\tPaid Amount\tRemarks / Notes`;

export default function CrmImportExportModal({
  initialMode = "IMPORT",
  allLeads,
  filteredLeads,
  selectedLeadIds,
  staffList,
  activeBranch,
  onClose,
  onImported,
}: CrmImportExportModalProps) {
  const { language } = useLanguage();
  const tr = (bn: string, en: string, ja?: string) =>
    language === "ja" ? ja || en : language === "en" ? en : bn;

  const [mode, setMode] = useState<ModalMode>(initialMode);
  const [importMethod, setImportMethod] = useState<ImportMethod>("PASTE");

  // Raw tabular text (from Paste, File upload, or Google Sheet URL fetch)
  const [rawSheetText, setRawSheetText] = useState("");
  const [hasHeaderRow, setHasHeaderRow] = useState(true);
  const [uploadedFileName, setUploadedFileName] = useState("");

  // Google Sheets URL Fetch state
  const [googleSheetUrl, setGoogleSheetUrl] = useState("");
  const [isFetchingSheet, setIsFetchingSheet] = useState(false);
  const [fetchError, setFetchError] = useState("");

  // Column Mapping Override State: maps MappedFieldKey -> column index (or -1 for unmapped)
  const [manualColumnMap, setManualColumnMap] = useState<Partial<Record<MappedFieldKey, number>>>(
    {},
  );
  const [showColumnMapper, setShowColumnMapper] = useState(false);

  // Import Configuration
  const [duplicateStrategy, setDuplicateStrategy] = useState<
    "UPDATE_EXISTING" | "SKIP_DUPLICATE" | "CREATE_NEW"
  >("UPDATE_EXISTING");
  const [defaultBranch, setDefaultBranch] = useState<"DHK-HQ" | "KHULNA-01">(
    activeBranch === "KHULNA-01" ? "KHULNA-01" : "DHK-HQ",
  );
  const [defaultAssignedTo, setDefaultAssignedTo] = useState<string>(
    staffList.find((s) => s.role === "TELE_COUNSELOR")?.name || "শেখ বাসেত",
  );
  const [defaultStatus, setDefaultStatus] = useState<LeadStatus>("NEW");
  const [defaultPriority, setDefaultPriority] = useState<LeadPriority>("WARM");
  const [defaultSource, setDefaultSource] = useState<LeadSource>("GOOGLE_SHEET");
  const [customImportTag, setCustomImportTag] = useState<string>("Google Sheet Sync");

  // Export Configuration
  const [exportScope, setExportScope] = useState<
    "ALL" | "FILTERED" | "SELECTED" | "ADMITTED" | "HOT"
  >(selectedLeadIds.length > 0 ? "SELECTED" : "ALL");
  const [exportFormatType, setExportFormatType] = useState<"STANDARD_SHEET" | "FULL_360">(
    "FULL_360",
  );
  const [copiedTsv, setCopiedTsv] = useState(false);

  // Parse raw rows
  const parsedGrid = useMemo(() => parseTabularText(rawSheetText), [rawSheetText]);

  const headerCells = useMemo(() => {
    if (parsedGrid.length === 0) return [];
    if (hasHeaderRow) return parsedGrid[0];
    return parsedGrid[0].map((_, idx) => `Column ${idx + 1}`);
  }, [parsedGrid, hasHeaderRow]);

  const dataRows = useMemo(() => {
    if (parsedGrid.length === 0) return [];
    return hasHeaderRow ? parsedGrid.slice(1) : parsedGrid;
  }, [parsedGrid, hasHeaderRow]);

  // Auto-detect column mapping from header row
  const effectiveColumnMap = useMemo(() => {
    const map: Record<MappedFieldKey, number> = {
      name: -1,
      phone: -1,
      whatsapp: -1,
      email: -1,
      city: -1,
      education: -1,
      sscGpa: -1,
      hscGpa: -1,
      graduationYear: -1,
      studyGapYears: -1,
      japaneseProficiency: -1,
      interest: -1,
      status: -1,
      priority: -1,
      assignedTo: -1,
      targetSchool: -1,
      contractAmountBdt: -1,
      paidAmountBdt: -1,
      followUpDate: -1,
      notes: -1,
    };

    if (!hasHeaderRow) {
      // Positional default when user pastes raw rows without headers:
      // Col 0: Name, Col 1: Phone, Col 2: City, Col 3: Education, Col 4: Notes
      map.name = 0;
      map.phone = 1;
      if (headerCells.length > 2) map.city = 2;
      if (headerCells.length > 3) map.education = 3;
      if (headerCells.length > 4) map.notes = 4;
    } else {
      const usedCols = new Set<number>();
      CRM_FIELD_DEFINITIONS.forEach((fieldDef) => {
        const idx = headerCells.findIndex((h, colIdx) => {
          if (usedCols.has(colIdx)) return false;
          const cleanH = h.toLowerCase().replace(/[_-]/g, " ").trim();
          return fieldDef.aliases.some(
            (alias) => cleanH === alias || cleanH.includes(alias),
          );
        });
        if (idx !== -1) {
          map[fieldDef.key] = idx;
          usedCols.add(idx);
        }
      });

      // Fallback if Name or Phone wasn't matched by header name
      if (map.name === -1 && headerCells.length > 0 && !usedCols.has(0)) {
        map.name = 0;
      }
      if (map.phone === -1 && headerCells.length > 1 && !usedCols.has(1)) {
        map.phone = 1;
      }
    }

    // Apply manual overrides
    (Object.keys(manualColumnMap) as MappedFieldKey[]).forEach((k) => {
      const overrideVal = manualColumnMap[k];
      if (overrideVal !== undefined) {
        map[k] = overrideVal;
      }
    });

    return map;
  }, [headerCells, hasHeaderRow, manualColumnMap]);

  // Existing normalized phone set for duplicate detection
  const existingPhoneMap = useMemo(() => {
    const m = new Map<string, CrmLead>();
    allLeads.forEach((l) => {
      const norm = normalizeBdPhone(l.phone);
      if (norm) m.set(norm, l);
    });
    return m;
  }, [allLeads]);

  // Build structured lead preview rows
  const previewRows = useMemo(() => {
    const getCell = (row: string[], key: MappedFieldKey): string => {
      const colIdx = effectiveColumnMap[key];
      if (colIdx === undefined || colIdx < 0 || colIdx >= row.length) return "";
      return (row[colIdx] || "").trim();
    };

    return dataRows.map((row, idx) => {
      const rawName = getCell(row, "name");
      const rawPhone = getCell(row, "phone") || getCell(row, "whatsapp");
      const normPhone = normalizeBdPhone(rawPhone);
      const matchedExisting = normPhone ? existingPhoneMap.get(normPhone) : undefined;

      const rawGap = parseFloat(getCell(row, "studyGapYears"));
      const rawContract = parseFloat(getCell(row, "contractAmountBdt").replace(/[^0-9.]/g, ""));
      const rawPaid = parseFloat(getCell(row, "paidAmountBdt").replace(/[^0-9.]/g, ""));

      let rawSsc = getCell(row, "sscGpa");
      let rawHsc = getCell(row, "hscGpa");
      // If a single GPA column contains two numbers like "4.50 / 4.00" or "SSC: 4.5, HSC: 4.0"
      if (!rawSsc && rawHsc && /[/|,&]/.test(rawHsc)) {
        const nums = rawHsc.match(/\d+(?:\.\d+)?/g);
        if (nums && nums.length >= 2) {
          rawSsc = nums[0];
          rawHsc = nums[1];
        }
      } else if (rawSsc && !rawHsc && /[/|,&]/.test(rawSsc)) {
        const nums = rawSsc.match(/\d+(?:\.\d+)?/g);
        if (nums && nums.length >= 2) {
          rawSsc = nums[0];
          rawHsc = nums[1];
        }
      }

      const candidate: Partial<CrmLead> = {
        name: rawName,
        phone: normPhone || rawPhone,
        whatsapp: getCell(row, "whatsapp") || normPhone || rawPhone,
        email: getCell(row, "email"),
        city: getCell(row, "city") || "ঢাকা",
        education: getCell(row, "education") || "HSC / Alim",
        sscGpa: rawSsc,
        hscGpa: rawHsc,
        graduationYear: getCell(row, "graduationYear") || "",
        studyGapYears: !isNaN(rawGap) ? rawGap : 1,
        japaneseProficiency: parseJapaneseProficiency(getCell(row, "japaneseProficiency")),
        interest: getCell(row, "interest")
          ? parseInterestValue(getCell(row, "interest"))
          : "STUDENT_VISA_REGULAR",
        status: parseStatusValue(getCell(row, "status"), defaultStatus),
        priority: parsePriorityValue(getCell(row, "priority"), defaultPriority),
        assignedTo: getCell(row, "assignedTo") || defaultAssignedTo,
        targetSchool: getCell(row, "targetSchool"),
        contractAmountBdt: !isNaN(rawContract) ? rawContract : undefined,
        paidAmountBdt: !isNaN(rawPaid) ? rawPaid : undefined,
        followUpDate: getCell(row, "followUpDate") || new Date().toISOString().slice(0, 10),
        notes: getCell(row, "notes"),
        branch: defaultBranch,
        source: defaultSource,
      };

      const isValid = Boolean(rawName || rawPhone);
      return {
        rowIndex: idx + 1,
        candidate,
        isValid,
        isDuplicate: Boolean(matchedExisting),
        existingLeadName: matchedExisting?.name,
      };
    });
  }, [
    dataRows,
    effectiveColumnMap,
    existingPhoneMap,
    defaultStatus,
    defaultPriority,
    defaultAssignedTo,
    defaultBranch,
    defaultSource,
  ]);

  const validPreviewRows = useMemo(
    () => previewRows.filter((r) => r.isValid),
    [previewRows],
  );
  const duplicateCount = useMemo(
    () => validPreviewRows.filter((r) => r.isDuplicate).length,
    [validPreviewRows],
  );
  const brandNewCount = validPreviewRows.length - duplicateCount;

  // Handle CSV / TSV File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = String(evt.target?.result || "");
      setRawSheetText(content);
      setManualColumnMap({});
    };
    reader.readAsText(file, "UTF-8");
  };

  // Handle Google Sheet URL Fetch
  const handleFetchGoogleSheet = async () => {
    if (!googleSheetUrl.trim()) return;
    setIsFetchingSheet(true);
    setFetchError("");
    try {
      const res = await fetch("/api/crm/google-sheet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: googleSheetUrl.trim() }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setFetchError(
          data.error ||
            tr(
              "Google Sheet ডাটা লোড করা যায়নি। শিটটি 'Anyone with the link' করা আছে কিনা দেখুন অথবা সরাসরি কপি-পেস্ট করুন।",
              "Failed to load Google Sheet. Ensure link sharing is public or use Direct Copy-Paste.",
            ),
        );
      } else if (data.csvText) {
        setRawSheetText(data.csvText);
        setManualColumnMap({});
      }
    } catch {
      setFetchError(
        tr(
          "নেটওয়ার্ক ত্রুটি — অনুগ্রহ করে সরাসরি Google Sheet থেকে রো কপি (Ctrl+C) করে পেস্ট করুন।",
          "Network error — please copy rows from Google Sheets and paste directly.",
        ),
      );
    } finally {
      setIsFetchingSheet(false);
    }
  };

  // Execute Bulk Import
  const handleExecuteImport = () => {
    if (validPreviewRows.length === 0) return;
    const rowsToImport = validPreviewRows.map((r) => r.candidate);
    const result = bulkImportCrmLeads(rowsToImport, {
      duplicateStrategy,
      defaultBranch,
      defaultAssignedTo,
      defaultSource,
      defaultStatus,
      defaultPriority,
      customImportTag: customImportTag.trim() || "Google Sheet",
    });

    const msg = tr(
      `সফলভাবে ইম্পোর্ট সম্পন্ন! নতুন লিড: ${result.importedCount} জন, আপডেট: ${result.updatedCount} জন${result.skippedCount > 0 ? `, স্কিপড: ${result.skippedCount} জন` : ""}`,
      `Import Complete! New Leads: ${result.importedCount}, Updated: ${result.updatedCount}${result.skippedCount > 0 ? `, Skipped: ${result.skippedCount}` : ""}`,
      `インポート完了！新規: ${result.importedCount}件、更新: ${result.updatedCount}件`,
    );
    onImported(msg);
    onClose();
  };

  // Download Sample CSV Template
  const handleDownloadSampleTemplate = () => {
    const csvRows = parseTabularText(SAMPLE_SHEET_TSV).map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
    );
    const csvContent = "\uFEFF" + csvRows.join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "KNLTC_CRM_Google_Sheet_Template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Determine Leads to Export
  const leadsToExport = useMemo(() => {
    if (exportScope === "SELECTED" && selectedLeadIds.length > 0) {
      const set = new Set(selectedLeadIds);
      return allLeads.filter((l) => set.has(l.id));
    }
    if (exportScope === "FILTERED") return filteredLeads;
    if (exportScope === "ADMITTED")
      return allLeads.filter((l) => l.status === "ADMITTED" || l.isFileOpened);
    if (exportScope === "HOT")
      return allLeads.filter((l) => (l.priority || "WARM") === "HOT");
    return allLeads;
  }, [exportScope, allLeads, filteredLeads, selectedLeadIds]);

  // Build Export Matrix (Headers + Rows)
  const buildExportMatrix = () => {
    if (exportFormatType === "STANDARD_SHEET") {
      const headers = [
        "Student Name",
        "Phone Number",
        "WhatsApp",
        "City",
        "Education",
        "SSC GPA",
        "HSC GPA",
        "Passing Year",
        "Study Gap",
        "Japanese Level",
        "Program Interest",
        "Lead Status",
        "Priority",
        "Counselor",
        "Branch",
        "Target School",
        "Contract Amount (BDT)",
        "Paid Amount (BDT)",
        "Due Amount (BDT)",
        "Follow-up Date",
        "Remarks / Notes",
      ];
      const rows = leadsToExport.map((l) => {
        const contract = l.contractAmountBdt || 120000;
        const paid = l.paidAmountBdt || 0;
        const due = l.dueAmountBdt ?? Math.max(0, contract - paid);
        return [
          l.name || "",
          l.phone || "",
          l.whatsapp || l.phone || "",
          l.city || "",
          l.education || "",
          l.sscGpa || "",
          l.hscGpa || "",
          l.graduationYear || "",
          String(l.studyGapYears ?? 0),
          l.japaneseProficiency || "NONE",
          l.interest || "",
          l.status || "NEW",
          l.priority || "WARM",
          l.assignedTo || "",
          l.branch || "DHK-HQ",
          l.targetSchoolName || l.targetSchool || "",
          String(contract),
          String(paid),
          String(due),
          l.followUpDate || "",
          l.notes || "",
        ];
      });
      return { headers, rows };
    }

    // FULL 360° MASTER DOSSIER
    const headers = [
      "Lead ID / File No",
      "Student Name",
      "Phone Number",
      "WhatsApp",
      "Email",
      "City / District",
      "Full Address",
      "Passport No",
      "Passport Expiry",
      "Date of Birth",
      "Guardian / Sponsor Name",
      "Guardian Phone",
      "Sponsor Relation",
      "Sponsor Bank Balance (BDT)",
      "Education",
      "SSC GPA",
      "HSC GPA",
      "Passing Year",
      "Study Gap (Yrs)",
      "Japanese Level",
      "Official Exam",
      "Eligibility Score (%)",
      "Verified Docs (/12)",
      "Program Interest",
      "Preferred Intake",
      "Target Partner School",
      "Lead Status",
      "Priority",
      "Call Outcome",
      "Assigned Counselor",
      "Branch",
      "Contract Amount (BDT)",
      "Paid Amount (BDT)",
      "Due Amount (BDT)",
      "Follow-up Date",
      "Custom Tags",
      "Remarks / Notes",
    ];

    const rows = leadsToExport.map((l) => {
      const elig = calculateLeadEligibility(l);
      const contract = l.contractAmountBdt || 120000;
      const paid = l.paidAmountBdt || 0;
      const due = l.dueAmountBdt ?? Math.max(0, contract - paid);
      return [
        l.fileTrackingNo || l.id,
        l.name || "",
        l.phone || "",
        l.whatsapp || l.phone || "",
        l.email || "",
        l.city || "",
        l.address || "",
        l.passportNo || "",
        l.passportExpiryDate || "",
        l.dateOfBirth || "",
        l.guardianName || "",
        l.guardianPhone || "",
        l.sponsorRelation || "",
        String(l.sponsorBankBalanceBdt || 0),
        l.education || "",
        l.sscGpa || "",
        l.hscGpa || "",
        l.graduationYear || "",
        String(l.studyGapYears ?? 0),
        l.japaneseProficiency || "NONE",
        l.japaneseExamType || "NONE",
        `${elig.totalScore}% (${elig.tier})`,
        `${elig.verifiedDocsCount}/${elig.totalDocsCount}`,
        l.interest || "",
        l.preferredIntake || "",
        l.targetSchoolName || l.targetSchool || "",
        l.status || "NEW",
        l.priority || "WARM",
        l.callOutcome || "",
        l.assignedTo || "",
        l.branch || "DHK-HQ",
        String(contract),
        String(paid),
        String(due),
        l.followUpDate || "",
        (l.customTags || []).join("; "),
        l.notes || "",
      ];
    });
    return { headers, rows };
  };

  // Download CSV File
  const handleDownloadCsv = () => {
    const { headers, rows } = buildExportMatrix();
    const all = [headers, ...rows];
    const csvLines = all.map((r) =>
      r.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(","),
    );
    const csvString = "\uFEFF" + csvLines.join("\r\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `KNLTC_CRM_Leads_${exportScope}_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Copy TSV for Direct Google Sheets Paste
  const handleCopyTsvForGoogleSheets = async () => {
    const { headers, rows } = buildExportMatrix();
    const all = [headers, ...rows];
    const tsvString = all
      .map((r) => r.map((cell) => String(cell ?? "").replace(/[\t\r\n]+/g, " ")).join("\t"))
      .join("\n");
    await navigator.clipboard.writeText(tsvString);
    setCopiedTsv(true);
    setTimeout(() => setCopiedTsv(false), 3000);
  };

  // Download JSON Backup
  const handleDownloadJson = () => {
    const jsonString = JSON.stringify(leadsToExport, null, 2);
    const blob = new Blob([jsonString], { type: "application/json;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `KNLTC_CRM_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-3 sm:p-5 backdrop-blur-xs">
      <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        {/* Top Modal Header */}
        <div className="border-b border-slate-200 bg-slate-900 px-5 py-4 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300">
                <FileSpreadsheet className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold tracking-tight text-white">
                  {tr(
                    "Google Sheets ও CSV লিড ইম্পোর্ট / এক্সপোর্ট হাব",
                    "Google Sheets & CSV Lead Import / Export Hub",
                    "Googleスプレッドシート＆CSV リード一括入出力ハブ",
                  )}
                </h2>
                <p className="text-xs text-slate-300">
                  {tr(
                    "পুরাতন Google Sheet-এর সকল লিড ১-ক্লিকে CRM-এ নিয়ে আসুন অথবা এক্সেল/শিটে এক্সপোর্ট করুন",
                    "Bring all historical Google Sheet leads into the CRM or export filtered data anytime",
                    "過去のGoogleシートのリードを一括取り込み、またはCSV形式でエクスポートします",
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Segmented Mode Switcher */}
              <div className="flex items-center gap-1 rounded-xl bg-white/10 p-1">
                <button
                  type="button"
                  onClick={() => setMode("IMPORT")}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    mode === "IMPORT"
                      ? "bg-white text-slate-900 shadow-2xs"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  <Upload className="h-3.5 w-3.5" />
                  <span>{tr("ইম্পোর্ট (Import)", "Import Leads", "インポート")}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMode("EXPORT")}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    mode === "EXPORT"
                      ? "bg-white text-slate-900 shadow-2xs"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>
                    {tr("এক্সপোর্ট (Export)", "Export Leads", "エクスポート")} ({allLeads.length})
                  </span>
                </button>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="rounded-xl bg-white/10 p-2 text-slate-300 hover:bg-white/20 hover:text-white transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-slate-50/50 space-y-6">
          {mode === "IMPORT" ? (
            <>
              {/* Step 1: Choose Google Sheet Import Method */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {tr(
                        "ধাপ ১: আপনার পুরাতন Google Sheet থেকে ডাটা আনার মাধ্যম নির্বাচন করুন",
                        "Step 1: Choose How to Load Your Google Sheet Data",
                        "ステップ1: Googleスプレッドシートのデータ取り込み方法を選択",
                      )}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {tr(
                        "সবচেয়ে সহজ উপায়: আপনার Google Sheet ওপেন করে রো-গুলো সিলেক্ট করে Copy (Ctrl+C) করুন এবং নিচে Paste (Ctrl+V) করুন",
                        "Fastest method: Select rows in your Google Sheet, press Ctrl+C, and paste directly below",
                        "最も簡単な方法：スプレッドシートの行をコピー（Ctrl+C）して下に貼り付け（Ctrl+V）ます",
                      )}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleDownloadSampleTemplate}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition shrink-0"
                  >
                    <Download className="h-3.5 w-3.5 text-emerald-700" />
                    <span>
                      {tr(
                        "নমুনা Google Sheet টেমপ্লেট (.CSV)",
                        "Download Sample CSV Template",
                        "サンプルCSVテンプレート",
                      )}
                    </span>
                  </button>
                </div>

                {/* 3 Import Method Selector Tabs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => setImportMethod("PASTE")}
                    className={`flex items-start gap-3 rounded-xl border p-3.5 text-left transition ${
                      importMethod === "PASTE"
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
                    }`}
                  >
                    <ClipboardPaste className="h-4 w-4 shrink-0 mt-0.5 text-emerald-400" />
                    <div>
                      <p className="font-bold">
                        {tr(
                          "১. সরাসরি কপি-পেস্ট (Ctrl+C ➔ Ctrl+V)",
                          "1. Direct Copy-Paste from Sheet",
                          "1. シートから直接コピー＆ペースト",
                        )}
                      </p>
                      <p
                        className={`text-[11px] mt-0.5 ${
                          importMethod === "PASTE" ? "text-slate-300" : "text-slate-500"
                        }`}
                      >
                        {tr(
                          "Google Sheet বা Excel থেকে রো কপি করে পেস্ট করুন",
                          "Copy rows from Google Sheets or Excel & paste",
                          "GoogleシートやExcelの行をそのまま貼り付け",
                        )}
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setImportMethod("FILE")}
                    className={`flex items-start gap-3 rounded-xl border p-3.5 text-left transition ${
                      importMethod === "FILE"
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
                    }`}
                  >
                    <Upload className="h-4 w-4 shrink-0 mt-0.5 text-emerald-400" />
                    <div>
                      <p className="font-bold">
                        {tr(
                          "২. CSV / TSV ফাইল আপলোড",
                          "2. Upload CSV / TSV File",
                          "2. CSV / TSVファイルをアップロード",
                        )}
                      </p>
                      <p
                        className={`text-[11px] mt-0.5 ${
                          importMethod === "FILE" ? "text-slate-300" : "text-slate-500"
                        }`}
                      >
                        {tr(
                          "Google Sheet থেকে ডাউনলোডকৃত .csv ফাইল সিলেক্ট করুন",
                          "Upload .csv file downloaded from Google Sheets",
                          "ダウンロードした.csvファイルを選択",
                        )}
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setImportMethod("GSHEET_URL")}
                    className={`flex items-start gap-3 rounded-xl border p-3.5 text-left transition ${
                      importMethod === "GSHEET_URL"
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
                    }`}
                  >
                    <Link2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-400" />
                    <div>
                      <p className="font-bold">
                        {tr(
                          "৩. Google Sheet লিংক সিঙ্ক",
                          "3. Sync via Google Sheet URL",
                          "3. GoogleシートURLから直接同期",
                        )}
                      </p>
                      <p
                        className={`text-[11px] mt-0.5 ${
                          importMethod === "GSHEET_URL" ? "text-slate-300" : "text-slate-500"
                        }`}
                      >
                        {tr(
                          "পাবলিক Google Sheet লিংক দিয়ে অটো-ফেচ করুন",
                          "Fetch directly from a public Google Sheet URL",
                          "公開GoogleシートのURLから自動取得",
                        )}
                      </p>
                    </div>
                  </button>
                </div>

                {/* Method 1: Copy-Paste Box */}
                {importMethod === "PASTE" && (
                  <div className="space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <label className="font-semibold text-slate-700">
                        {tr(
                          "আপনার Google Sheet-এর ডাটা নিচে পেস্ট করুন (হেডারসহ অথবা ছাড়া):",
                          "Paste your copied Google Sheet or CSV rows below:",
                          "コピーしたGoogleスプレッドシートのデータを下に貼り付けてください：",
                        )}
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setRawSheetText(SAMPLE_SHEET_TSV);
                            setHasHeaderRow(true);
                            setManualColumnMap({});
                          }}
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 hover:bg-emerald-100 transition"
                        >
                          <Sparkles className="h-3 w-3" />
                          <span>
                            {tr(
                              "ডেমো Google Sheet ডাটা টেস্ট করুন",
                              "Load Sample Sheet Data",
                              "サンプルデータを読み込む",
                            )}
                          </span>
                        </button>
                        {rawSheetText && (
                          <button
                            type="button"
                            onClick={() => setRawSheetText("")}
                            className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-200 transition"
                          >
                            {tr("মুছুন (Clear)", "Clear", "クリア")}
                          </button>
                        )}
                      </div>
                    </div>
                    <textarea
                      rows={5}
                      value={rawSheetText}
                      onChange={(e) => setRawSheetText(e.target.value)}
                      placeholder={tr(
                        "এখানে Ctrl+V চেপে আপনার Google Sheet-এর কপি করা সারিগুলো পেস্ট করুন...\nউদাহরণ: নাম    ফোন নম্বর    জেলা    শিক্ষাগত যোগ্যতা    GPA    মন্তব্য",
                        "Press Ctrl+V here to paste rows copied directly from Google Sheets or Excel...",
                        "ここにGoogleスプレッドシートからコピーした行を貼り付けてください（Ctrl+V）...",
                      )}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 font-mono text-xs text-slate-800 focus:border-slate-400 focus:bg-white focus:outline-hidden"
                    />
                  </div>
                )}

                {/* Method 2: CSV / TSV File Upload */}
                {importMethod === "FILE" && (
                  <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/70 p-6 text-center">
                    <Upload className="mx-auto h-8 w-8 text-slate-400" />
                    <p className="mt-2 text-xs sm:text-sm font-bold text-slate-800">
                      {uploadedFileName
                        ? `${tr("নির্বাচিত ফাইল:", "Selected File:")} ${uploadedFileName}`
                        : tr(
                            "Google Sheet থেকে ডাউনলোড করা .CSV অথবা .TSV ফাইল সিলেক্ট করুন",
                            "Select a .CSV or .TSV file exported from Google Sheets",
                            "Googleスプレッドシートから書き出した.CSVファイルを選択",
                          )}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-500">
                      {tr(
                        "Google Sheets-এ গিয়ে File ➔ Download ➔ Comma Separated Values (.csv) ক্লিক করে ডাউনলোড করুন",
                        "In Google Sheets: File ➔ Download ➔ Comma Separated Values (.csv)",
                        "Googleスプレッドシートの「ファイル」➔「ダウンロード」➔「カンマ区切り形式 (.csv)」",
                      )}
                    </p>
                    <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition">
                      <Upload className="h-3.5 w-3.5" />
                      <span>
                        {tr("কম্পিউটার থেকে CSV ফাইল বেছে নিন", "Choose CSV / TSV File", "CSVファイルを選択")}
                      </span>
                      <input
                        type="file"
                        accept=".csv,.tsv,.txt"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}

                {/* Method 3: Google Sheet URL Fetch */}
                {importMethod === "GSHEET_URL" && (
                  <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/60 p-4 text-xs">
                    <label className="font-semibold text-slate-800 block">
                      {tr(
                        "আপনার Google Sheet-এর শেয়ারিং লিংক দিন (Share ➔ Anyone with the link can view):",
                        "Paste your Google Sheet link (Permission must be 'Anyone with the link can view'):",
                        "公開設定（リンクを知っている全員が閲覧可）のGoogleシートURLを入力：",
                      )}
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="url"
                        value={googleSheetUrl}
                        onChange={(e) => setGoogleSheetUrl(e.target.value)}
                        placeholder="https://docs.google.com/spreadsheets/d/1BxiMVs0XRA.../edit#gid=0"
                        className="flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 font-mono text-xs"
                      />
                      <button
                        type="button"
                        disabled={isFetchingSheet || !googleSheetUrl.trim()}
                        onClick={handleFetchGoogleSheet}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 transition shrink-0"
                      >
                        <RefreshCw
                          className={`h-3.5 w-3.5 ${isFetchingSheet ? "animate-spin" : ""}`}
                        />
                        <span>
                          {isFetchingSheet
                            ? tr("লোড হচ্ছে...", "Fetching...", "取得中...")
                            : tr("শিট থেকে ডাটা আনুন", "Fetch Sheet Rows", "シートから取得")}
                        </span>
                      </button>
                    </div>
                    {fetchError && (
                      <p className="text-xs font-medium text-red-600 flex items-center gap-1.5">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>{fetchError}</span>
                      </p>
                    )}
                  </div>
                )}

                {/* Header Row Toggle & Column Mapper Toggle */}
                {parsedGrid.length > 0 && (
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                      <input
                        type="checkbox"
                        checked={hasHeaderRow}
                        onChange={(e) => setHasHeaderRow(e.target.checked)}
                        className="h-4 w-4 rounded accent-slate-900"
                      />
                      <span>
                        {tr(
                          "প্রথম সারিটি কলামের নাম (First row contains column headers)",
                          "First row contains column headers",
                          "1行目を列ヘッダーとして扱う",
                        )}
                      </span>
                    </label>

                    <button
                      type="button"
                      onClick={() => setShowColumnMapper(!showColumnMapper)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                    >
                      <SlidersHorizontal className="h-3.5 w-3.5 text-slate-500" />
                      <span>
                        {showColumnMapper
                          ? tr("কলাম ম্যাপিং লুকান", "Hide Column Mapping", "列マッピングを隠す")
                          : tr(
                              "কলাম ম্যাপিং যাচাই / পরিবর্তন করুন",
                              "Customize Column Mapping",
                              "列マッピングを確認・変更",
                            )}
                      </span>
                    </button>
                  </div>
                )}

                {/* Interactive Column Mapping Panel */}
                {parsedGrid.length > 0 && showColumnMapper && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-slate-900">
                        {tr(
                          "আপনার শিটের কোন কলামটি কোন তথ্যের সাথে যুক্ত হবে তা মিলিয়ে নিন:",
                          "Map your Google Sheet columns to KNLTC CRM fields:",
                          "シートの列とCRM項目の対応付け：",
                        )}
                      </p>
                      <button
                        type="button"
                        onClick={() => setManualColumnMap({})}
                        className="text-[11px] font-semibold text-slate-500 hover:text-slate-900"
                      >
                        {tr("অটো-ম্যাপ রিসেট", "Reset to Auto-Detect", "自動検出に戻す")}
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                      {CRM_FIELD_DEFINITIONS.map((field) => (
                        <div key={field.key}>
                          <label className="font-semibold text-slate-700 block truncate">
                            {language === "ja"
                              ? field.labelJa
                              : language === "en"
                                ? field.labelEn
                                : field.labelBn}
                          </label>
                          <select
                            value={effectiveColumnMap[field.key] ?? -1}
                            onChange={(e) =>
                              setManualColumnMap({
                                ...manualColumnMap,
                                [field.key]: Number(e.target.value),
                              })
                            }
                            className={`mt-1 w-full rounded-lg border px-2.5 py-1.5 text-xs font-medium ${
                              (effectiveColumnMap[field.key] ?? -1) >= 0
                                ? "border-emerald-300 bg-emerald-50/40 text-slate-900 font-semibold"
                                : "border-slate-200 bg-white text-slate-500"
                            }`}
                          >
                            <option value={-1}>-- Not Mapped --</option>
                            {headerCells.map((h, colIdx) => (
                              <option key={colIdx} value={colIdx}>
                                Col {colIdx + 1}: {h || `(Column ${colIdx + 1})`}
                              </option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Step 2: Default Batch Assignment & Duplicate Strategy */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                  {tr(
                    "ধাপ ২: ডুপ্লিকেট নম্বর হ্যান্ডলিং ও ডিফল্ট কাউন্সেলর অ্যাসাইনমেন্ট",
                    "Step 2: Duplicate Handling & Default Assignment Settings",
                    "ステップ2: 重複データの処理とデフォルト担当者設定",
                  )}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs">
                  <div className="sm:col-span-2">
                    <label className="font-semibold text-slate-700">
                      {tr(
                        "আগের লিডের সাথে মোবাইল নম্বর মিলে গেলে কী হবে?",
                        "If Phone Number Already Exists in CRM:",
                        "電話番号が既に存在する場合の処理：",
                      )}
                    </label>
                    <select
                      value={duplicateStrategy}
                      onChange={(e) => setDuplicateStrategy(e.target.value as any)}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-semibold text-slate-900"
                    >
                      <option value="UPDATE_EXISTING">
                        {tr(
                          "আপডেট ও মার্জ করুন (Update & Merge Existing Lead)",
                          "Update & Merge with Existing Lead (Recommended)",
                          "既存リードの情報を更新・統合する（推奨）",
                        )}
                      </option>
                      <option value="SKIP_DUPLICATE">
                        {tr(
                          "ডুপ্লিকেট স্কিপ করুন (শুধু নতুন নম্বর যুক্ত হবে)",
                          "Skip Duplicate Rows (Import New Only)",
                          "重複をスキップ（新規のみ登録）",
                        )}
                      </option>
                      <option value="CREATE_NEW">
                        {tr(
                          "সবগুলো নতুন লিড হিসেবে তৈরি করুন",
                          "Create All as Separate New Leads",
                          "すべて新規リードとして作成",
                        )}
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700">
                      {tr("ডিফল্ট কাউন্সেলর", "Default Counselor", "デフォルト担当者")}
                    </label>
                    <select
                      value={defaultAssignedTo}
                      onChange={(e) => setDefaultAssignedTo(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium"
                    >
                      <option value="শেখ বাসেত">শেখ বাসেত (MD)</option>
                      {staffList.map((st) => (
                        <option key={st.id} value={st.name}>
                          {st.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700">
                      {tr("ডিফল্ট শাখা", "Default Branch", "デフォルト支部")}
                    </label>
                    <select
                      value={defaultBranch}
                      onChange={(e) => setDefaultBranch(e.target.value as any)}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium"
                    >
                      <option value="DHK-HQ">ঢাকা প্রধান কার্যালয় (DHK-HQ)</option>
                      <option value="KHULNA-01">খুলনা শাখা (KHULNA-01)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700">
                      {tr("ব্যাচ ট্যাগ (Tag)", "Import Batch Tag", "インポートタグ")}
                    </label>
                    <input
                      type="text"
                      value={customImportTag}
                      onChange={(e) => setCustomImportTag(e.target.value)}
                      placeholder="e.g. Old Sheet 2025"
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Step 3: Live Preview Table Before Confirming Import */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Table className="h-4 w-4 text-slate-700" />
                    <h3 className="text-sm font-bold text-slate-900">
                      {tr(
                        `ধাপ ৩: ইম্পোর্ট প্রিভিউ টেবিল (${validPreviewRows.length} জন শনাক্ত)`,
                        `Step 3: Live Import Preview (${validPreviewRows.length} Valid Leads Detected)`,
                        `ステップ3: インポートプレビュー（${validPreviewRows.length}件検出）`,
                      )}
                    </h3>
                  </div>

                  {validPreviewRows.length > 0 && (
                    <div className="flex flex-wrap items-center gap-3 text-xs font-mono tabular-nums">
                      <span className="text-emerald-700 font-semibold">
                        ● {tr("নতুন:", "New:")} {brandNewCount}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="text-amber-700 font-semibold">
                        ● {tr("আগের নম্বর ম্যাচ:", "Existing Match:")} {duplicateCount}
                      </span>
                    </div>
                  )}
                </div>

                {validPreviewRows.length > 0 ? (
                  <div className="max-h-64 overflow-auto rounded-xl border border-slate-200/80">
                    <table className="w-full text-left text-xs">
                      <thead className="sticky top-0 bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                        <tr>
                          <th className="px-3 py-2">#</th>
                          <th className="px-3 py-2">{tr("নাম", "Name", "氏名")}</th>
                          <th className="px-3 py-2">{tr("ফোন", "Phone", "電話番号")}</th>
                          <th className="px-3 py-2">{tr("শহর", "City", "都市")}</th>
                          <th className="px-3 py-2">{tr("শিক্ষা ও GPA", "Academic", "学歴・GPA")}</th>
                          <th className="px-3 py-2">{tr("কোর্স/ভিসা", "Interest", "プログラム")}</th>
                          <th className="px-3 py-2">{tr("কাউন্সেলর", "Counselor", "担当者")}</th>
                          <th className="px-3 py-2">{tr("অ্যাকশন", "Import Action", "処理")}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {validPreviewRows.slice(0, 100).map((row) => (
                          <tr key={row.rowIndex} className="hover:bg-slate-50">
                            <td className="px-3 py-2 font-mono text-slate-400">
                              {row.rowIndex}
                            </td>
                            <td className="px-3 py-2 font-bold text-slate-900">
                              {row.candidate.name || "Unnamed"}
                            </td>
                            <td className="px-3 py-2 font-mono text-slate-800">
                              {row.candidate.phone}
                            </td>
                            <td className="px-3 py-2 text-slate-600">{row.candidate.city}</td>
                            <td className="px-3 py-2 font-mono text-[11px] text-slate-600">
                              {row.candidate.education} (SSC {row.candidate.sscGpa} / HSC{" "}
                              {row.candidate.hscGpa})
                            </td>
                            <td className="px-3 py-2 text-slate-700 font-medium">
                              {row.candidate.interest}
                            </td>
                            <td className="px-3 py-2 text-slate-600">
                              {row.candidate.assignedTo}
                            </td>
                            <td className="px-3 py-2">
                              {row.isDuplicate ? (
                                <span className="text-[11px] font-semibold text-amber-700">
                                  {duplicateStrategy === "UPDATE_EXISTING"
                                    ? tr("আপডেট হবে", "Will Update", "既存更新")
                                    : duplicateStrategy === "SKIP_DUPLICATE"
                                      ? tr("স্কিপ হবে", "Will Skip", "スキップ")
                                      : tr("নতুন তৈরি হবে", "Create Copy", "新規作成")}
                                </span>
                              ) : (
                                <span className="text-[11px] font-semibold text-emerald-700">
                                  {tr("✓ নতুন যুক্ত হবে", "✓ New Import", "✓ 新規追加")}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="rounded-xl border border-slate-200/60 bg-slate-50 py-10 text-center">
                    <p className="text-xs sm:text-sm font-semibold text-slate-600">
                      {tr(
                        "এখনো কোনো ডাটা পেস্ট বা আপলোড করা হয়নি। উপরে আপনার Google Sheet-এর সারি পেস্ট করুন বা ডেমো ডাটা বাটনে ক্লিক করুন।",
                        "No sheet rows loaded yet. Paste rows from your Google Sheet above or click 'Load Sample Sheet Data'.",
                        "データがまだ読み込まれていません。上からシートの行を貼り付けるかCSVを選択してください。",
                      )}
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* =====================================================================
               EXPORT MODE: CSV / GOOGLE SHEETS CLIPBOARD / JSON BACKUP
               ===================================================================== */
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 space-y-5">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {tr(
                      "১. কোন লিডগুলো এক্সপোর্ট করতে চান নির্বাচন করুন (Export Scope)",
                      "1. Select Which Leads to Export",
                      "1. エクスポート対象のリードを選択",
                    )}
                  </h3>
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
                    {[
                      {
                        id: "ALL",
                        titleBn: "সম্পূর্ণ CRM ডাটাবেস",
                        titleEn: "All CRM Leads",
                        count: allLeads.length,
                      },
                      {
                        id: "FILTERED",
                        titleBn: "বর্তমান ফিল্টারকৃত তালিকা",
                        titleEn: "Currently Filtered View",
                        count: filteredLeads.length,
                      },
                      {
                        id: "SELECTED",
                        titleBn: "টিক দেওয়া (Selected) লিড",
                        titleEn: "Selected Checkboxes",
                        count: selectedLeadIds.length,
                      },
                      {
                        id: "ADMITTED",
                        titleBn: "শুধুমাত্র ভর্তিকৃত ও ফাইল ওপেন",
                        titleEn: "Admitted / File Opened",
                        count: allLeads.filter((l) => l.status === "ADMITTED" || l.isFileOpened)
                          .length,
                      },
                      {
                        id: "HOT",
                        titleBn: "শুধুমাত্র HOT প্রায়োরিটি লিড",
                        titleEn: "HOT Priority Leads Only",
                        count: allLeads.filter((l) => (l.priority || "WARM") === "HOT").length,
                      },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setExportScope(item.id as any)}
                        className={`rounded-xl border p-3.5 text-left transition ${
                          exportScope === item.id
                            ? "border-slate-900 bg-slate-900 text-white"
                            : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
                        }`}
                      >
                        <p className="font-bold">
                          {tr(item.titleBn, item.titleEn)}
                        </p>
                        <p
                          className={`mt-1 text-base font-mono font-bold tabular-nums ${
                            exportScope === item.id ? "text-emerald-300" : "text-slate-900"
                          }`}
                        >
                          {item.count} {tr("জন", "leads", "件")}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <h3 className="text-sm font-bold text-slate-900">
                    {tr(
                      "২. রিপোর্টের ধরন ও কলাম ফরম্যাট (Report Format)",
                      "2. Choose Column Detail Level",
                      "2. 出力カラム形式を選択",
                    )}
                  </h3>
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <button
                      type="button"
                      onClick={() => setExportFormatType("FULL_360")}
                      className={`rounded-xl border p-4 text-left transition ${
                        exportFormatType === "FULL_360"
                          ? "border-emerald-700 bg-emerald-50/60 text-slate-900"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <p className="font-bold text-slate-900">
                        {tr(
                          "৩৬০° পূর্ণাঙ্গ ডসিয়ার রিপোর্ট (৩৭টি কলাম — সব তথ্যসহ)",
                          "Full 360° Master Dossier (All 37 Columns)",
                          "360°完全マスター調書（全37カラム）",
                        )}
                      </p>
                      <p className="mt-1 text-[11px] text-slate-500">
                        {tr(
                          "বায়োডাটা, পাসপোর্ট, GPA, এলিজিবিলিটি স্কোর, ১২ ডকুমেন্ট ভেরিফিকেশন, ব্যাংক সলভেন্সি, চুক্তি/জমা/বকেয়া ও নোটস",
                          "Includes Bio, Passport, GPAs, Eligibility Score, Verified Docs, Sponsor Solvency, Ledger & Notes",
                          "基本情報、パスポート、GPA、適格性スコア、書類確認状況、支弁者残高、学費出納を含む全項目",
                        )}
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setExportFormatType("STANDARD_SHEET")}
                      className={`rounded-xl border p-4 text-left transition ${
                        exportFormatType === "STANDARD_SHEET"
                          ? "border-emerald-700 bg-emerald-50/60 text-slate-900"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <p className="font-bold text-slate-900">
                        {tr(
                          "স্ট্যান্ডার্ড Google Sheet টেমপ্লেট (২১টি মূল কলাম)",
                          "Standard Google Sheet Format (21 Core Columns)",
                          "標準Googleスプレッドシート形式（主要21カラム）",
                        )}
                      </p>
                      <p className="mt-1 text-[11px] text-slate-500">
                        {tr(
                          "টেলি-কাউন্সেলিং শিট ও পুনরায় ইম্পোর্টের উপযোগী হালকা ফরম্যাট",
                          "Clean tele-counseling sheet format ideal for re-importing",
                          "テレカウンセリング管理や再インポートに最適な標準構成",
                        )}
                      </p>
                    </button>
                  </div>
                </div>

                {/* 3 Export Action Cards */}
                <div className="border-t border-slate-100 pt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    type="button"
                    onClick={handleDownloadCsv}
                    className="flex flex-col justify-between rounded-2xl bg-emerald-600 p-5 text-left text-white hover:bg-emerald-700 transition shadow-xs"
                  >
                    <div>
                      <Download className="h-6 w-6 text-emerald-200" />
                      <h4 className="mt-3 text-sm font-bold">
                        {tr(
                          "Google Sheets / Excel CSV ডাউনলোড (.csv)",
                          "Download CSV for Google Sheets / Excel",
                          "Googleシート / Excel用 CSVダウンロード",
                        )}
                      </h4>
                      <p className="mt-1 text-xs text-emerald-100">
                        {tr(
                          "বাংলা, ইংরেজি ও জাপানি ফন্ট সাপোর্টসহ সরাসরি Excel ও Google Sheets-এ ওপেন হবে",
                          "UTF-8 BOM encoded so Bengali & Japanese characters open cleanly in Excel & Sheets",
                          "UTF-8 BOM付きで文字化けせずExcelやGoogleシートで開けます",
                        )}
                      </p>
                    </div>
                    <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-white">
                      <span>
                        {tr(
                          `${leadsToExport.length} জন লিড ডাউনলোড করুন`,
                          `Download ${leadsToExport.length} Leads (.CSV)`,
                          `${leadsToExport.length}件をダウンロード`,
                        )}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyTsvForGoogleSheets}
                    className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-900 p-5 text-left text-white hover:bg-slate-800 transition"
                  >
                    <div>
                      {copiedTsv ? (
                        <Check className="h-6 w-6 text-emerald-400" />
                      ) : (
                        <Copy className="h-6 w-6 text-slate-300" />
                      )}
                      <h4 className="mt-3 text-sm font-bold">
                        {copiedTsv
                          ? tr(
                              "✓ ক্লিপবোর্ডে কপি হয়েছে! এখন শিটে Ctrl+V চাপুন",
                              "✓ Copied! Press Ctrl+V in Google Sheets",
                              "✓ コピー完了！GoogleシートでCtrl+Vを押してください",
                            )
                          : tr(
                              "Google Sheet-এ পেস্ট করার জন্য ১-ক্লিক কপি",
                              "1-Click Copy for Google Sheets (Ctrl+V)",
                              "Googleシート貼り付け用 1クリックコピー",
                            )}
                      </h4>
                      <p className="mt-1 text-xs text-slate-300">
                        {tr(
                          "ফাইল ডাউনলোড ছাড়াই যেকোনো ফাঁকা Google Sheet ওপেন করে সরাসরি Ctrl+V চাপলেই সব কলাম বসে যাবে!",
                          "Copy all rows in tab-separated format and paste directly into any open Google Sheet",
                          "ファイル不要でそのまま空のGoogleシートにCtrl+Vで貼り付けられます",
                        )}
                      </p>
                    </div>
                    <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-emerald-300">
                      <span>
                        {copiedTsv
                          ? tr("সফলভাবে কপি হয়েছে", "Copied to Clipboard!", "コピーしました")
                          : tr("ক্লিপবোর্ডে কপি করুন", "Copy All Rows (TSV)", "全行をコピー")}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadJson}
                    className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 text-left text-slate-900 hover:bg-slate-50 transition"
                  >
                    <div>
                      <FileJson className="h-6 w-6 text-slate-700" />
                      <h4 className="mt-3 text-sm font-bold">
                        {tr(
                          "পূর্ণাঙ্গ সিস্টেম ব্যাকআপ (.JSON)",
                          "Full Structured Backup (.JSON)",
                          "完全システムバックアップ (.JSON)",
                        )}
                      </h4>
                      <p className="mt-1 text-xs text-slate-500">
                        {tr(
                          "ডকুমেন্ট চেকলিস্ট এবং কাউন্সেলিং টাইমলাইনসহ সম্পূর্ণ ডাটা ব্যাকআপ",
                          "Includes nested 12-item document checklists and full counseling activity logs",
                          "書類チェックリストや面談履歴タイムラインを含む完全バックアップ",
                        )}
                      </p>
                    </div>
                    <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-slate-800">
                      <span>{tr("JSON ডাউনলোড", "Download .JSON Backup", "JSONを保存")}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Footer Action Bar */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-white px-5 py-3.5">
          <div className="text-xs text-slate-500">
            {mode === "IMPORT" ? (
              validPreviewRows.length > 0 ? (
                <span className="font-semibold text-emerald-700 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>
                    {tr(
                      `${validPreviewRows.length} জন লিড CRM-এ যুক্ত করার জন্য প্রস্তুত`,
                      `Ready to import ${validPreviewRows.length} leads into CRM`,
                      `${validPreviewRows.length}件のリードを取り込む準備ができました`,
                    )}
                  </span>
                </span>
              ) : (
                <span>
                  {tr(
                    "টিপস: Google Sheet-এর যেকোনো ফরম্যাটের কলাম অটোমেটিক শনাক্ত হবে",
                    "Tip: Columns from your old Google Sheets are automatically matched",
                    "ヒント：Googleシートの列名は自動的に認識・マッピングされます",
                  )}
                </span>
              )
            ) : (
              <span>
                {tr(
                  `নির্বাচিত মোট লিড: ${leadsToExport.length} জন`,
                  `Total leads selected for export: ${leadsToExport.length}`,
                  `エクスポート対象: ${leadsToExport.length}件`,
                )}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              {tr("বন্ধ করুন", "Close", "閉じる")}
            </button>

            {mode === "IMPORT" && (
              <button
                type="button"
                disabled={validPreviewRows.length === 0}
                onClick={handleExecuteImport}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#b91c1c] px-5 py-2 text-xs font-bold text-white hover:bg-red-800 disabled:opacity-40 transition shadow-xs"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>
                  {tr(
                    `CRM-এ ${validPreviewRows.length} জন লিড ইম্পোর্ট করুন`,
                    `Import ${validPreviewRows.length} Leads to CRM`,
                    `${validPreviewRows.length}件のリードをインポート`,
                  )}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
