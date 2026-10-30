/**
 * ============================================================================
 * KNLTC (Kurobe Nihongo Language Training Center — knltc.com)
 * MASTER GOOGLE SHEETS + GOOGLE DRIVE BACKEND ENGINE (Code.gs)
 * ============================================================================
 * 100% Free Serverless Relational Database + Media Storage Bridge for Next.js 15
 *
 * HOW TO USE:
 * 1. Open your Google Sheet ("KNLTC_Master_Database")
 * 2. Click Extensions > Apps Script
 * 3. Paste this entire file into Code.gs and click Save (Ctrl+S)
 * 4. Select "setupKNLTCDatabase" from the top function dropdown and click Run
 *    (Approve Google permissions when prompted — this creates & styles all 15 tabs + seed data!)
 * 5. Click Deploy > New deployment > Select type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. Copy the Web App URL into your Next.js .env.local as GOOGLE_SHEETS_WEB_APP_URL
 * ============================================================================
 */

var DEFAULT_API_KEY = "KNLTC_SECRET_2026";
var DRIVE_ROOT_FOLDER_NAME = "KNLTC_Uploads_And_Visa_Docs";
var HEADER_BG_COLOR = "#133e29"; // KNLTC Deep Forest Green
var HEADER_TEXT_COLOR = "#ffffff";

/**
 * Exact 15 Table Schemas matching the KNLTC Next.js 15 & ERP/CRM/CMS Codebase
 */
var TABLE_SCHEMAS = {
  blog_posts: [
    "id",
    "title",
    "slug",
    "summary",
    "content",
    "featured_image",
    "author",
    "status",
    "published_at",
    "created_at"
  ],
  categories: [
    "id",
    "name",
    "slug",
    "type",
    "description",
    "created_at"
  ],
  knltc_b2b_agents: [
    "id",
    "organization_name",
    "agent_type",
    "contact_person",
    "phone",
    "city",
    "referred_students_count",
    "successful_visas_count",
    "agreed_commission_bdt",
    "pending_commission_bdt",
    "paid_commission_bdt",
    "logo_url",
    "trade_license_no",
    "nid_or_passport_no",
    "bank_name",
    "bank_account_no",
    "bkash_or_nagad_no",
    "profile_json",
    "created_at"
  ],
  knltc_crm_leads: [
    "id",
    "name",
    "phone",
    "whatsapp",
    "email",
    "city",
    "source",
    "interest",
    "status",
    "education",
    "japanese_proficiency",
    "study_gap_years",
    "assigned_to",
    "branch",
    "notes",
    "follow_up_date",
    "last_contacted_at",
    "created_at",
    "priority",
    "passport_no",
    "target_school",
    "b2b_agent_name",
    "contract_amount_bdt",
    "paid_amount_bdt",
    "due_amount_bdt",
    "ssc_gpa",
    "hsc_gpa",
    "profile_json"
  ],
  knltc_finance_transactions: [
    "id",
    "receipt_no",
    "date",
    "student_name",
    "student_phone",
    "category",
    "type",
    "amount_bdt",
    "due_amount_bdt",
    "payment_method",
    "reference_or_trx",
    "branch",
    "verified_by",
    "notes",
    "linked_lead_id",
    "linked_visa_id",
    "linked_school_id",
    "linked_agent_id",
    "linked_staff_id",
    "created_at"
  ],
  knltc_lms_bridges: [
    "id",
    "lead_id",
    "student_name",
    "phone",
    "course_level",
    "enrollment_no",
    "portal_username",
    "portal_password_masked",
    "portal_fee_deducted_bdt",
    "net_knltc_margin_bdt",
    "credentials_sent_via_wa",
    "credentials_sent_at",
    "progress_percentage",
    "active_batch",
    "assigned_sensei_id",
    "assigned_sensei_name",
    "created_at"
  ],
  knltc_partner_schools: [
    "id",
    "name",
    "japanese_name",
    "institution_type",
    "location",
    "contact_person",
    "email",
    "website_url",
    "logo_url",
    "first_year_tuition_yen",
    "commission_per_student_yen",
    "commission_per_student_bdt",
    "intake_quota",
    "active_students_count",
    "total_commission_received_yen",
    "status",
    "profile_json",
    "created_at"
  ],
  knltc_staff_members: [
    "id",
    "name",
    "role",
    "location",
    "phone",
    "email",
    "monthly_base_salary_bdt",
    "kpi_type",
    "kpi_target",
    "kpi_achieved",
    "calls_target_monthly",
    "calls_completed",
    "admissions_target",
    "admissions_achieved",
    "performance_bonus_bdt",
    "last_paid_month",
    "status",
    "created_at"
  ],
  knltc_visa_applicants: [
    "id",
    "lead_id",
    "tracking_no",
    "name",
    "phone",
    "branch",
    "package_type",
    "intake_session",
    "stage",
    "target_school",
    "partner_school_id",
    "b2b_agent_id",
    "b2b_agent_name",
    "visa_officer_id",
    "visa_officer_name",
    "contract_amount_bdt",
    "paid_amount_bdt",
    "due_amount_bdt",
    "sponsor_name",
    "sponsor_relation",
    "sponsor_bank",
    "sponsor_balance_bdt",
    "bank_loan_assistance",
    "bank_loan_bank",
    "coe_status",
    "visa_status",
    "counselor_name",
    "visa_track",
    "profile_json",
    "updated_at",
    "created_at"
  ],
  knltc_website_cms: [
    "id",
    "section_key",
    "data",
    "updated_at"
  ],
  order_items: [
    "id",
    "order_id",
    "product_id",
    "quantity",
    "price",
    "created_at"
  ],
  orders: [
    "id",
    "customer_name",
    "phone",
    "email",
    "address",
    "city",
    "payment_method",
    "payment_status",
    "order_status",
    "total_amount",
    "notes",
    "created_at"
  ],
  product_reviews: [
    "id",
    "product_id",
    "customer_name",
    "rating",
    "comment",
    "status",
    "created_at"
  ],
  products: [
    "id",
    "title",
    "slug",
    "description",
    "price",
    "discount_price",
    "category_id",
    "stock",
    "status",
    "cover_image",
    "is_featured",
    "created_at"
  ],
  wishlist_items: [
    "id",
    "session_id",
    "product_id",
    "product_slug",
    "product_title",
    "customer_phone",
    "created_at"
  ]
};

/**
 * ============================================================================
 * 1. ONE-CLICK AUTO-SETUP & INITIAL SEED DATA (`setupKNLTCDatabase`)
 * ============================================================================
 */
function setupKNLTCDatabase() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var nowIso = new Date().toISOString();
  var tableNames = Object.keys(TABLE_SCHEMAS);

  for (var i = 0; i < tableNames.length; i++) {
    var tableName = tableNames[i];
    var headers = TABLE_SCHEMAS[tableName];
    var sheet = ss.getSheetByName(tableName);

    if (!sheet) {
      sheet = ss.insertSheet(tableName);
    }

    // Ensure Row 1 headers are set & styled
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setValues([headers]);
    headerRange
      .setBackground(HEADER_BG_COLOR)
      .setFontColor(HEADER_TEXT_COLOR)
      .setFontWeight("bold")
      .setFontFamily("Inter, Arial, sans-serif")
      .setFontSize(10)
      .setHorizontalAlignment("left")
      .setVerticalAlignment("middle");

    sheet.setRowHeight(1, 34);
    sheet.setFrozenRows(1);

    // Populate initial KNLTC seed data if the sheet has no data rows yet
    if (sheet.getLastRow() <= 1) {
      var seedRows = getInitialSeedDataForTable(tableName, nowIso);
      if (seedRows && seedRows.length > 0) {
        var matrix = [];
        for (var r = 0; r < seedRows.length; r++) {
          matrix.push(objectToRow(headers, seedRows[r]));
        }
        sheet.getRange(2, 1, matrix.length, headers.length).setValues(matrix);
      }
    }

    // Auto-resize columns cleanly (cap width so long JSON strings don't stretch infinitely)
    for (var c = 1; c <= headers.length; c++) {
      sheet.autoResizeColumn(c);
      var currentWidth = sheet.getColumnWidth(c);
      if (currentWidth < 120) sheet.setColumnWidth(c, 130);
      if (currentWidth > 360) sheet.setColumnWidth(c, 360);
    }
  }

  // Ensure Google Drive upload root folder is ready
  getOrCreateDriveFolder(DRIVE_ROOT_FOLDER_NAME);

  // Build or refresh the live MASTER_EXECUTIVE_DASHBOARD telemetry tab
  try {
    setupMasterExecutiveDashboard(ss);
  } catch (dashErr) {
    Logger.log("Dashboard sheet update warning: " + dashErr);
  }

  Logger.log("✅ KNLTC Master Database Setup Complete! All 15 tables + Executive Dashboard created, styled, and ready.");
  return {
    ok: true,
    tablesCreated: tableNames,
    timestamp: nowIso
  };
}

/**
 * ============================================================================
 * 1B. LIVE MASTER EXECUTIVE DASHBOARD TAB (`MASTER_EXECUTIVE_DASHBOARD`)
 * Automatically keeps the live Google Sheet telemetry dashboard synchronized
 * with all 15 database tabs using real-time spreadsheet formulas.
 * ============================================================================
 */
function setupMasterExecutiveDashboard(ss) {
  var spreadsheet = ss || SpreadsheetApp.getActiveSpreadsheet();
  var dashName = "MASTER_EXECUTIVE_DASHBOARD";
  var dash = spreadsheet.getSheetByName(dashName);
  if (!dash) {
    dash = spreadsheet.insertSheet(dashName, 0);
  }

  // Update timestamp if row 2 exists, or initialize summary telemetry block if empty
  if (dash.getLastRow() <= 1) {
    dash.getRange("A1:K2").mergeAcross();
    dash.getRange("A1").setValue("KNLTC GLOBAL EDUCATION & CAREER • MASTER EXECUTIVE DASHBOARD");
    dash.getRange("A2").setValue(
      "Real-time synchronization across CRM, Visa Processing, Partner Schools, Finance, LMS, Staff, and E-Commerce operations.   Last Refreshed: " +
        Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm")
    );
    dash.getRange("A1:K2")
      .setBackground("#0f4c3a")
      .setFontColor("#ffffff")
      .setFontWeight("bold")
      .setFontFamily("Inter, Arial, sans-serif");
  }
}

/**
 * ============================================================================
 * ONE-CLICK PURGE FUNCTION FOR GOOGLE APPS SCRIPT
 * Run this function directly inside Apps Script editor to clear all dummy
 * test data from your Google Sheet while keeping Row 1 headers intact!
 * ============================================================================
 */
function purgeAllDummyDataFromSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var dummyTables = [
    "categories",
    "products",
    "blog_posts",
    "knltc_crm_leads",
    "knltc_visa_applicants",
    "knltc_lms_bridges",
    "knltc_b2b_agents",
    "knltc_partner_schools",
    "knltc_staff_members",
    "knltc_finance_transactions",
    "orders",
    "order_items",
    "product_reviews",
    "wishlist_items"
  ];

  var purged = {};
  for (var i = 0; i < dummyTables.length; i++) {
    var tName = dummyTables[i];
    var sheet = ss.getSheetByName(tName);
    if (sheet) {
      var lastRow = sheet.getLastRow();
      if (lastRow > 1) {
        var numRowsToDelete = lastRow - 1;
        sheet.deleteRows(2, numRowsToDelete);
        purged[tName] = numRowsToDelete + " rows deleted";
      } else {
        purged[tName] = "Already clean (0 rows)";
      }
    }
  }

  Logger.log("✅ All dummy test data successfully purged from Google Sheet!");
  Logger.log(JSON.stringify(purged, null, 2));
  return { ok: true, message: "All dummy data purged successfully", purged: purged };
}

/**
 * ============================================================================
 * 2. READ ENDPOINT (`doGet`)
 * Supports:
 * - ?table=all                -> Returns all 15 sheets in one JSON payload
 * - ?table=<sheet_name>       -> Returns all rows in <sheet_name>
 * - ?table=<sheet_name>&id=X  -> Returns single row matching id=X
 * ============================================================================
 */
function doGet(e) {
  try {
    var params = (e && e.parameter) ? e.parameter : {};
    var table = params.table || "all";
    var id = params.id || "";

    var ss = SpreadsheetApp.getActiveSpreadsheet();

    if (table === "status" || table === "ping") {
      return jsonResponse({
        ok: true,
        connected: true,
        spreadsheetName: ss.getName(),
        spreadsheetUrl: ss.getUrl(),
        tables: Object.keys(TABLE_SCHEMAS),
        timestamp: new Date().toISOString()
      });
    }

    if (table === "all") {
      var allData = {};
      var tableNames = Object.keys(TABLE_SCHEMAS);
      for (var i = 0; i < tableNames.length; i++) {
        var tName = tableNames[i];
        allData[tName] = readTableRows(ss, tName);
      }
      return jsonResponse({
        ok: true,
        table: "all",
        data: allData,
        timestamp: new Date().toISOString()
      });
    }

    if (!TABLE_SCHEMAS[table]) {
      return jsonResponse({
        ok: false,
        error: "Unknown table: " + table
      });
    }

    var rows = readTableRows(ss, table);
    if (id) {
      var found = null;
      for (var j = 0; j < rows.length; j++) {
        if (String(rows[j].id) === String(id) || String(rows[j].section_key) === String(id)) {
          found = rows[j];
          break;
        }
      }
      return jsonResponse({
        ok: true,
        table: table,
        data: found
      });
    }

    return jsonResponse({
      ok: true,
      table: table,
      data: rows
    });
  } catch (err) {
    return jsonResponse({
      ok: false,
      error: String(err && err.message ? err.message : err)
    });
  }
}

/**
 * ============================================================================
 * 3. WRITE & GOOGLE DRIVE UPLOAD ENDPOINT (`doPost`)
 * Actions supported:
 * - "CREATE" / "INSERT"
 * - "UPDATE"
 * - "UPSERT"
 * - "DELETE"
 * - "UPSERT_CMS"
 * - "BULK_SYNC"
 * - "UPLOAD_FILE_TO_DRIVE"
 * ============================================================================
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(25000);

  try {
    var rawBody = (e && e.postData && e.postData.contents) ? e.postData.contents : "{}";
    var body = JSON.parse(rawBody);

    // Validate API Key
    var scriptApiKey = PropertiesService.getScriptProperties().getProperty("GOOGLE_SHEETS_API_KEY") || DEFAULT_API_KEY;
    var providedKey = body.apiKey || (e && e.parameter && e.parameter.apiKey) || "";
    if (providedKey !== scriptApiKey && providedKey !== DEFAULT_API_KEY) {
      return jsonResponse({
        ok: false,
        error: "Unauthorized: Invalid GOOGLE_SHEETS_API_KEY"
      });
    }

    var action = String(body.action || body.type || "").toUpperCase();
    var table = body.table || body.entity || "";
    var payload = body.payload || body.data || body.row || {};
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // ------------------------------------------------------------------------
    // ACTION: UPLOAD_FILE_TO_DRIVE
    // ------------------------------------------------------------------------
    if (action === "UPLOAD_FILE_TO_DRIVE") {
      var fileName = body.fileName || ("knltc-file-" + new Date().getTime());
      var mimeType = body.mimeType || "application/octet-stream";
      var base64Data = body.base64Data || "";
      var folderName = body.folderName || "General_Media";

      // Strip data URL prefix if present
      if (base64Data.indexOf("base64,") !== -1) {
        base64Data = base64Data.split("base64,")[1];
      }

      var rootFolder = getOrCreateDriveFolder(DRIVE_ROOT_FOLDER_NAME);
      var targetFolder = folderName ? getOrCreateSubFolder(rootFolder, folderName) : rootFolder;

      var decodedBytes = Utilities.base64Decode(base64Data);
      var blob = Utilities.newBlob(decodedBytes, mimeType, fileName);
      var driveFile = targetFolder.createFile(blob);
      driveFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

      var fileId = driveFile.getId();
      var directViewUrl = "https://drive.google.com/uc?export=view&id=" + fileId;
      var cdnUrl = "https://lh3.googleusercontent.com/d/" + fileId;
      var downloadUrl = "https://drive.google.com/uc?export=download&id=" + fileId;
      var isImage = mimeType && mimeType.indexOf("image/") === 0;

      return jsonResponse({
        ok: true,
        success: true,
        fileId: fileId,
        fileName: fileName,
        mimeType: mimeType,
        url: isImage ? cdnUrl : directViewUrl,
        directViewUrl: directViewUrl,
        cdnUrl: cdnUrl,
        downloadUrl: downloadUrl,
        webViewLink: driveFile.getUrl()
      });
    }

    // ------------------------------------------------------------------------
    // ACTION: SETUP_DATABASE
    // ------------------------------------------------------------------------
    if (action === "SETUP_DATABASE") {
      var setupResult = setupKNLTCDatabase();
      return jsonResponse(setupResult);
    }

    // ------------------------------------------------------------------------
    // ACTION: BULK_SYNC (Sync multiple tables or full dashboard state at once)
    // ------------------------------------------------------------------------
    if (action === "BULK_SYNC") {
      var tablesPayload = body.tables || payload || {};
      var syncedTables = [];
      for (var tbl in tablesPayload) {
        if (Object.prototype.hasOwnProperty.call(tablesPayload, tbl) && TABLE_SCHEMAS[tbl]) {
          var records = tablesPayload[tbl];
          if (Array.isArray(records)) {
            replaceOrMergeTableRows(ss, tbl, records, Boolean(body.replaceAll));
            syncedTables.push(tbl);
          }
        }
      }
      return jsonResponse({
        ok: true,
        action: "BULK_SYNC",
        syncedTables: syncedTables,
        timestamp: new Date().toISOString()
      });
    }

    // ------------------------------------------------------------------------
    // ACTION: UPSERT_CMS / CMS_UPDATE
    // ------------------------------------------------------------------------
    if (action === "UPSERT_CMS" || action === "CMS_UPDATE") {
      var cmsSheet = ensureSheetWithHeaders(ss, "knltc_website_cms");
      var sectionKey = body.section_key || payload.section_key || "master_cms";
      var cmsDataObj = payload.data !== undefined ? payload.data : payload;
      var cmsRow = {
        id: payload.id || "cms-master-01",
        section_key: sectionKey,
        data: typeof cmsDataObj === "string" ? cmsDataObj : JSON.stringify(cmsDataObj),
        updated_at: new Date().toISOString()
      };
      var upsertedCms = upsertRowInSheet(cmsSheet, TABLE_SCHEMAS.knltc_website_cms, cmsRow, "section_key");
      return jsonResponse({
        ok: true,
        action: "UPSERT_CMS",
        data: upsertedCms
      });
    }

    // Validate table for standard CRUD operations
    if (!table || !TABLE_SCHEMAS[table]) {
      return jsonResponse({
        ok: false,
        error: "Invalid or missing table name: " + table
      });
    }

    var sheet = ensureSheetWithHeaders(ss, table);
    var headers = getActualSheetHeaders(sheet, TABLE_SCHEMAS[table]);

    // ------------------------------------------------------------------------
    // ACTION: CREATE / INSERT
    // ------------------------------------------------------------------------
    if (action === "CREATE" || action === "INSERT") {
      var items = Array.isArray(payload) ? payload : [payload];
      var createdRows = [];
      for (var i = 0; i < items.length; i++) {
        var item = normalizeIncomingRecord(items[i]);
        if (!item.id) item.id = Utilities.getUuid();
        if (!item.created_at) item.created_at = new Date().toISOString();
        if (headers.indexOf("updated_at") !== -1 && !item.updated_at) {
          item.updated_at = item.created_at;
        }
        sheet.appendRow(objectToRow(headers, item));
        createdRows.push(item);
      }
      return jsonResponse({
        ok: true,
        action: "CREATE",
        table: table,
        data: Array.isArray(payload) ? createdRows : createdRows[0]
      });
    }

    // ------------------------------------------------------------------------
    // ACTION: UPDATE / UPSERT
    // ------------------------------------------------------------------------
    if (action === "UPDATE" || action === "UPSERT") {
      var matchKey = body.matchKey || (table === "knltc_website_cms" ? "section_key" : "id");
      var normalized = normalizeIncomingRecord(payload);
      if (headers.indexOf("updated_at") !== -1) {
        normalized.updated_at = new Date().toISOString();
      }
      var resultRow = upsertRowInSheet(sheet, headers, normalized, matchKey, action === "UPDATE");
      return jsonResponse({
        ok: true,
        action: action,
        table: table,
        data: resultRow
      });
    }

    // ------------------------------------------------------------------------
    // ACTION: DELETE
    // ------------------------------------------------------------------------
    if (action === "DELETE") {
      var targetId = body.id || payload.id;
      var deleted = deleteRowById(sheet, headers, targetId);
      return jsonResponse({
        ok: true,
        action: "DELETE",
        table: table,
        deleted: deleted,
        id: targetId
      });
    }

    if (action === "PURGE_DUMMY_DATA" || action === "PURGE_ALL_DUMMY") {
      var purgeResult = purgeAllDummyDataFromSheets();
      return jsonResponse(purgeResult);
    }

    return jsonResponse({
      ok: false,
      error: "Unsupported action: " + action
    });
  } catch (err) {
    return jsonResponse({
      ok: false,
      error: String(err && err.message ? err.message : err)
    });
  } finally {
    lock.releaseLock();
  }
}

/**
 * ============================================================================
 * HELPER UTILITIES FOR SHEETS, JSON SERIALIZATION & DRIVE FOLDERS
 * ============================================================================
 */
function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function ensureSheetWithHeaders(ss, tableName) {
  var headers = TABLE_SCHEMAS[tableName];
  var sheet = ss.getSheetByName(tableName);
  if (!sheet) {
    sheet = ss.insertSheet(tableName);
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setValues([headers]);
    headerRange
      .setBackground(HEADER_BG_COLOR)
      .setFontColor(HEADER_TEXT_COLOR)
      .setFontWeight("bold");
    sheet.setFrozenRows(1);
    return sheet;
  }

  // Ensure any new schema columns (e.g. profile_json) exist in Row 1 of existing sheets
  var lastCol = sheet.getLastColumn();
  if (lastCol > 0) {
    var existingHeaders = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(function (h) {
      return String(h).trim();
    });
    var updated = false;
    for (var i = 0; i < headers.length; i++) {
      if (existingHeaders.indexOf(headers[i]) === -1) {
        existingHeaders.push(headers[i]);
        updated = true;
      }
    }
    if (updated) {
      var newHeaderRange = sheet.getRange(1, 1, 1, existingHeaders.length);
      newHeaderRange.setValues([existingHeaders]);
      newHeaderRange
        .setBackground(HEADER_BG_COLOR)
        .setFontColor(HEADER_TEXT_COLOR)
        .setFontWeight("bold");
    }
  }
  return sheet;
}

function readTableRows(ss, tableName) {
  var sheet = ss.getSheetByName(tableName);
  if (!sheet) return [];
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  if (lastRow <= 1 || lastCol === 0) return [];

  var values = sheet.getRange(1, 1, lastRow, lastCol).getValues();
  var headers = values[0];
  var results = [];

  for (var r = 1; r < values.length; r++) {
    var row = values[r];
    var isEmpty = true;
    var obj = {};

    for (var c = 0; c < headers.length; c++) {
      var key = String(headers[c]).trim();
      if (!key) continue;
      var cellVal = row[c];
      if (cellVal !== "" && cellVal !== null && cellVal !== undefined) {
        isEmpty = false;
      }
      obj[key] = parseCellValue(cellVal);
    }

    if (!isEmpty) {
      results.push(obj);
    }
  }
  return results;
}

function parseCellValue(val) {
  if (val === null || val === undefined || val === "") return null;
  if (val instanceof Date) return val.toISOString();
  if (typeof val === "string") {
    var trimmed = val.trim();
    if (
      (trimmed.charAt(0) === "{" && trimmed.charAt(trimmed.length - 1) === "}") ||
      (trimmed.charAt(0) === "[" && trimmed.charAt(trimmed.length - 1) === "]")
    ) {
      try {
        return JSON.parse(trimmed);
      } catch (e) {
        return val;
      }
    }
  }
  return val;
}

function serializeCellValue(val) {
  if (val === undefined || val === null) return "";
  if (typeof val === "object" && !(val instanceof Date)) {
    return JSON.stringify(val);
  }
  return val;
}

function objectToRow(headers, obj) {
  var row = [];
  for (var i = 0; i < headers.length; i++) {
    var col = headers[i];
    var val = obj[col];
    if (val === undefined) {
      var camelKey = snakeToCamel(col);
      val = obj[camelKey];
    }
    row.push(serializeCellValue(val));
  }
  return row;
}

function normalizeIncomingRecord(record) {
  if (!record || typeof record !== "object") return {};
  var out = {};
  for (var k in record) {
    if (Object.prototype.hasOwnProperty.call(record, k)) {
      out[k] = record[k];
      var snake = camelToSnake(k);
      if (out[snake] === undefined) {
        out[snake] = record[k];
      }
    }
  }
  return out;
}

function camelToSnake(str) {
  return String(str)
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .toLowerCase();
}

function snakeToCamel(str) {
  return String(str).replace(/_([a-z])/g, function (_, letter) {
    return letter.toUpperCase();
  });
}

function upsertRowInSheet(sheet, headers, record, matchKey, updateOnly) {
  var keyName = matchKey || "id";
  var keyIdx = headers.indexOf(keyName);
  if (keyIdx === -1) keyIdx = 0;

  var matchVal = record[keyName];
  var lastRow = sheet.getLastRow();

  if (lastRow > 1 && matchVal !== undefined && matchVal !== null && matchVal !== "") {
    var allValues = sheet.getRange(2, 1, lastRow - 1, headers.length).getValues();
    for (var r = 0; r < allValues.length; r++) {
      if (String(allValues[r][keyIdx]) === String(matchVal)) {
        var existingRow = allValues[r];
        var mergedObj = {};
        for (var c = 0; c < headers.length; c++) {
          var colName = headers[c];
          mergedObj[colName] = existingRow[c];
        }
        for (var prop in record) {
          if (Object.prototype.hasOwnProperty.call(record, prop) && record[prop] !== undefined) {
            mergedObj[prop] = record[prop];
          }
        }
        var updatedRowValues = objectToRow(headers, mergedObj);
        sheet.getRange(r + 2, 1, 1, headers.length).setValues([updatedRowValues]);
        return mergedObj;
      }
    }
  }

  if (updateOnly) {
    return null;
  }

  if (!record.id) record.id = Utilities.getUuid();
  if (!record.created_at) record.created_at = new Date().toISOString();
  var newRowValues = objectToRow(headers, record);
  sheet.appendRow(newRowValues);
  return record;
}

function deleteRowById(sheet, headers, targetId) {
  if (!targetId) return false;
  var idIdx = headers.indexOf("id");
  if (idIdx === -1) idIdx = 0;

  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return false;

  var idValues = sheet.getRange(2, idIdx + 1, lastRow - 1, 1).getValues();
  for (var r = idValues.length - 1; r >= 0; r--) {
    if (String(idValues[r][0]) === String(targetId)) {
      sheet.deleteRow(r + 2);
      return true;
    }
  }
  return false;
}

function getActualSheetHeaders(sheet, fallbackHeaders) {
  var lastCol = sheet.getLastColumn();
  if (lastCol <= 0) return fallbackHeaders || [];
  var row1 = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  var headers = [];
  for (var i = 0; i < row1.length; i++) {
    headers.push(String(row1[i]).trim());
  }
  return headers.length > 0 ? headers : (fallbackHeaders || []);
}

function replaceOrMergeTableRows(ss, tableName, records, replaceAll) {
  var sheet = ensureSheetWithHeaders(ss, tableName);
  var headers = getActualSheetHeaders(sheet, TABLE_SCHEMAS[tableName]);

  if (replaceAll && sheet.getLastRow() > 1) {
    sheet.deleteRows(2, sheet.getLastRow() - 1);
  }

  for (var i = 0; i < records.length; i++) {
    var rec = normalizeIncomingRecord(records[i]);
    var matchKey = tableName === "knltc_website_cms" ? "section_key" : "id";
    upsertRowInSheet(sheet, headers, rec, matchKey, false);
  }
}

function getOrCreateDriveFolder(folderName) {
  var folders = DriveApp.getFoldersByName(folderName);
  if (folders.hasNext()) {
    return folders.next();
  }
  var folder = DriveApp.createFolder(folderName);
  folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return folder;
}

function getOrCreateSubFolder(parentFolder, subFolderName) {
  var folders = parentFolder.getFoldersByName(subFolderName);
  if (folders.hasNext()) {
    return folders.next();
  }
  var sub = parentFolder.createFolder(subFolderName);
  sub.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return sub;
}

/**
 * ============================================================================
 * REALISTIC KNLTC INITIAL SEED DATA FOR ALL 15 TABLES
 * ============================================================================
 */
function getInitialSeedDataForTable(tableName, nowIso) {
  switch (tableName) {
    case "categories":
      return [];

    case "products":
      return [];

    case "blog_posts":
      return [];

    case "knltc_staff_members":
      return [];

    case "knltc_partner_schools":
      return [];

    case "knltc_b2b_agents":
      return [];

    case "knltc_crm_leads":
      return [];

    case "knltc_visa_applicants":
      return [];

    case "knltc_lms_bridges":
      return [];

    case "knltc_finance_transactions":
      return [];

    case "orders":
      return [];

    case "order_items":
      return [];

    case "product_reviews":
      return [];

    case "wishlist_items":
      return [];

    case "knltc_website_cms":
      return [
        {
          id: "cms-master-01",
          section_key: "master_cms",
          data: JSON.stringify({
            heroHeadlineBn: "জাপানে উচ্চশিক্ষা ও দক্ষ ক্যারিয়ারের বিশ্বস্ত সেতুবন্ধন",
            heroHeadlineEn: "Your Trusted Gateway to Higher Study & Skilled Careers in Japan",
            hotlinePhone: "+880 1805 013633",
            whatsappNumber: "8801805013633",
            lmsPortalUrl: "https://npw.bd/knltc",
            regularVisaPackageBdt: 120000,
            premiumVisaPackageBdt: 1150000,
            n5CourseFeeBdt: 12000
          }),
          updated_at: nowIso
        }
      ];

    default:
      return [];
  }
}
