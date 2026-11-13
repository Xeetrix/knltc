import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { selectRows, upsertRow, insertRow, deleteRow } from "@/lib/supabase";
import {
  bulkSyncMasterStoreToSheets,
  fetchAllSheetTables,
  getGoogleSheetsConfig,
  getPersistentDataDir,
  offloadEmbeddedBase64Strings,
  purgeFallbackTables,
} from "@/lib/google-sheets-db";
import {
  getCmsStore,
  serializeLeadToSheetRow,
  serializeVisaToSheetRow,
  serializeSchoolToSheetRow,
  serializeAgentToSheetRow,
  serializeStaffToSheetRow,
  serializeTransactionToSheetRow,
  type MasterKnlTcStore,
} from "@/lib/knltc-cms-store";

export const dynamic = "force-dynamic";

function getSnapshotFilePath(): string {
  return path.join(getPersistentDataDir(), "knltc-cms-server-snapshot-v4.json");
}

const LEGACY_TMP_SNAPSHOT = path.join("/tmp", "knltc-cms-server-snapshot-v3.json");

const globalForServerSync = globalThis as unknown as {
  __knltc_server_snapshot?: MasterKnlTcStore;
};

async function readServerSnapshot(): Promise<MasterKnlTcStore> {
  if (globalForServerSync.__knltc_server_snapshot) {
    return globalForServerSync.__knltc_server_snapshot;
  }
  const primaryPath = getSnapshotFilePath();
  for (const candidatePath of [primaryPath, LEGACY_TMP_SNAPSHOT]) {
    try {
      const raw = await fs.readFile(candidatePath, "utf-8");
      const parsed = JSON.parse(raw) as MasterKnlTcStore;
      if (parsed && Array.isArray(parsed.crmLeads)) {
        const cleaned = offloadEmbeddedBase64Strings(parsed, "KNLTC_Snapshot", "snapshot").value;
        globalForServerSync.__knltc_server_snapshot = cleaned;
        return cleaned;
      }
    } catch {
      // Try next candidate
    }
  }
  const initial = getCmsStore();
  globalForServerSync.__knltc_server_snapshot = initial;
  return initial;
}

async function writeServerSnapshot(store: MasterKnlTcStore): Promise<MasterKnlTcStore> {
  const cleaned = offloadEmbeddedBase64Strings(store, "KNLTC_Snapshot", "snapshot").value;
  globalForServerSync.__knltc_server_snapshot = cleaned;
  try {
    await fs.writeFile(getSnapshotFilePath(), JSON.stringify(cleaned), "utf-8");
  } catch {
    // Ignore file write errors in read-only environments
  }
  return cleaned;
}

function stripCmsVolatileFields(cms: any) {
  if (!cms || typeof cms !== "object") return {};
  const clone = { ...cms };
  delete clone.updatedAt;
  delete clone.leadExtendedProfiles;
  delete clone.schoolExtendedProfiles;
  delete clone.b2bAgentExtendedProfiles;
  return clone;
}

async function syncStoreDeltaToSheets(
  prevStore: MasterKnlTcStore | null,
  nextStore: MasterKnlTcStore,
  nowIso: string,
): Promise<number> {
  let deltaCount = 0;

  const diffAndSyncCollection = async <T extends { id: string }>(
    prevList: T[] | undefined,
    nextList: T[] | undefined,
    tableName: string,
    serializeFn: (item: T) => Record<string, any>,
  ) => {
    if (!Array.isArray(nextList)) return;
    const prevMap = new Map<string, string>();
    if (Array.isArray(prevList)) {
      for (const item of prevList) {
        if (item?.id) {
          prevMap.set(String(item.id), JSON.stringify(item));
        }
      }
    }

    const nextIds = new Set<string>();
    for (const item of nextList) {
      if (!item?.id) continue;
      const idStr = String(item.id);
      nextIds.add(idStr);
      const prevJson = prevMap.get(idStr);
      const nextJson = JSON.stringify(item);
      if (prevJson !== nextJson) {
        deltaCount++;
        await upsertRow(tableName, serializeFn(item));
      }
    }

    if (Array.isArray(prevList)) {
      for (const prevItem of prevList) {
        if (prevItem?.id && !nextIds.has(String(prevItem.id))) {
          deltaCount++;
          await deleteRow(tableName, String(prevItem.id));
        }
      }
    }
  };

  await diffAndSyncCollection(
    prevStore?.crmLeads,
    nextStore.crmLeads,
    "knltc_crm_leads",
    serializeLeadToSheetRow,
  );

  await diffAndSyncCollection(
    prevStore?.visaApplicants,
    nextStore.visaApplicants,
    "knltc_visa_applicants",
    serializeVisaToSheetRow,
  );

  await diffAndSyncCollection(
    prevStore?.lmsBridges,
    nextStore.lmsBridges,
    "knltc_lms_bridges",
    (b) => ({
      id: b.id,
      lead_id: b.leadId || b.linkedLeadId || "",
      student_name: b.studentName,
      phone: b.phone,
      course_level: b.courseLevel,
      enrollment_no: b.enrollmentNo,
      portal_username: b.portalUsername,
      portal_password_masked: b.portalPasswordMasked,
      portal_fee_deducted_bdt: b.portalFeeDeductedBdt,
      net_knltc_margin_bdt: b.netKnlTcMarginBdt,
      credentials_sent_via_wa: b.credentialsSentViaWa,
      credentials_sent_at: b.credentialsSentAt || nowIso,
      progress_percentage: b.progressPercentage,
      active_batch: b.activeBatch,
      assigned_sensei_id: b.assignedSenseiId || "",
      assigned_sensei_name: b.assignedSenseiName || "",
      created_at: b.credentialsSentAt || nowIso,
    }),
  );

  await diffAndSyncCollection(
    prevStore?.partnerSchools,
    nextStore.partnerSchools,
    "knltc_partner_schools",
    serializeSchoolToSheetRow,
  );

  await diffAndSyncCollection(
    prevStore?.b2bAgents,
    nextStore.b2bAgents,
    "knltc_b2b_agents",
    serializeAgentToSheetRow,
  );

  await diffAndSyncCollection(
    prevStore?.staffList,
    nextStore.staffList,
    "knltc_staff_members",
    serializeStaffToSheetRow,
  );

  await diffAndSyncCollection(
    prevStore?.transactions,
    nextStore.transactions,
    "knltc_finance_transactions",
    serializeTransactionToSheetRow,
  );

  const prevCmsCore = JSON.stringify(stripCmsVolatileFields(prevStore?.websiteCms?.[0]));
  const nextCmsCore = JSON.stringify(stripCmsVolatileFields(nextStore.websiteCms?.[0]));
  if (nextStore.websiteCms?.[0] && prevCmsCore !== nextCmsCore) {
    deltaCount++;
    await upsertRow(
      "knltc_website_cms",
      {
        id: "cms-master-01",
        section_key: "master_cms",
        data: nextStore.websiteCms[0],
        updated_at: nowIso,
      },
      "section_key",
    );
  }

  return deltaCount;
}

export async function GET() {
  try {
    const snapshot = await readServerSnapshot();
    const gsConfig = getGoogleSheetsConfig();

    // Hydrate all tables in ONE single round-trip (`?table=all`) so selectRows below resolve instantaneously!
    if (gsConfig.isConfigured) {
      await fetchAllSheetTables();
    }

    const [
      leads,
      applicants,
      lmsBridges,
      b2bAgents,
      partnerSchools,
      transactions,
      staffMembers,
      cmsRoot,
    ] = await Promise.allSettled([
      selectRows<any>("knltc_crm_leads", { order: "created_at.desc" }, true),
      selectRows<any>("knltc_visa_applicants", { order: "created_at.desc" }, true),
      selectRows<any>("knltc_lms_bridges", { order: "created_at.desc" }, true),
      selectRows<any>("knltc_b2b_agents", { order: "created_at.desc" }, true),
      selectRows<any>("knltc_partner_schools", { order: "created_at.desc" }, true),
      selectRows<any>("knltc_finance_transactions", { order: "created_at.desc" }, true),
      selectRows<any>("knltc_staff_members", { order: "created_at.desc" }, true),
      selectRows<any>("knltc_website_cms", "", true),
    ]);

    const dbLeads =
      leads.status === "fulfilled" && Array.isArray(leads.value) && leads.value.length > 0
        ? leads.value
        : null;
    const dbApplicants =
      applicants.status === "fulfilled" &&
      Array.isArray(applicants.value) &&
      applicants.value.length > 0
        ? applicants.value
        : null;
    const dbLms =
      lmsBridges.status === "fulfilled" &&
      Array.isArray(lmsBridges.value) &&
      lmsBridges.value.length > 0
        ? lmsBridges.value
        : null;
    const dbAgents =
      b2bAgents.status === "fulfilled" &&
      Array.isArray(b2bAgents.value) &&
      b2bAgents.value.length > 0
        ? b2bAgents.value
        : null;
    const dbSchools =
      partnerSchools.status === "fulfilled" &&
      Array.isArray(partnerSchools.value) &&
      partnerSchools.value.length > 0
        ? partnerSchools.value
        : null;
    const dbTransactions =
      transactions.status === "fulfilled" &&
      Array.isArray(transactions.value) &&
      transactions.value.length > 0
        ? transactions.value
        : null;
    const dbStaff =
      staffMembers.status === "fulfilled" &&
      Array.isArray(staffMembers.value) &&
      staffMembers.value.length > 0
        ? staffMembers.value
        : null;

    const normalizeCmsQr = (cmsObj: any) => {
      if (!cmsObj || typeof cmsObj !== "object") return cmsObj;
      if (cmsObj.languageCoursePage?.banglaQrImageUrl) {
        const rawQr = String(cmsObj.languageCoursePage.banglaQrImageUrl).trim();
        const mediaIdx = rawQr.indexOf("/api/media/file/");
        if (mediaIdx >= 0) {
          cmsObj.languageCoursePage.banglaQrImageUrl = rawQr.slice(mediaIdx);
        }
      }
      return cmsObj;
    };

    let dbCms: any[] | null = null;
    let dbUpdatedAt = 0;
    if (cmsRoot.status === "fulfilled" && Array.isArray(cmsRoot.value) && cmsRoot.value.length > 0) {
      const masterRow =
        cmsRoot.value.find((r: any) => String(r?.section_key) === "master_cms") ||
        cmsRoot.value.find((r: any) => !String(r?.section_key || "").startsWith("media_item_")) ||
        cmsRoot.value[0];
      dbUpdatedAt = Date.parse(String(masterRow?.updated_at || "")) || 0;
      const rawCms = masterRow?.data ?? masterRow?.content ?? null;
      if (rawCms) {
        const parsed = typeof rawCms === "string" ? JSON.parse(rawCms) : rawCms;
        if (parsed?.updatedAt) {
          dbUpdatedAt = Math.max(dbUpdatedAt, Date.parse(String(parsed.updatedAt)) || 0);
        }
        dbCms = [normalizeCmsQr(parsed)];
      }
    }

    const snapCms = snapshot.websiteCms?.[0] ? normalizeCmsQr(snapshot.websiteCms[0]) : null;
    const snapUpdatedAt = snapCms?.updatedAt ? Date.parse(String(snapCms.updatedAt)) || 0 : 0;

    let resolvedCmsList = dbCms || (snapCms ? [snapCms] : null);
    if (dbCms?.[0] && snapCms) {
      const primary = snapUpdatedAt > dbUpdatedAt ? snapCms : dbCms[0];
      const secondary = snapUpdatedAt > dbUpdatedAt ? dbCms[0] : snapCms;
      const primaryQr = String(primary.languageCoursePage?.banglaQrImageUrl || "").trim();
      const secondaryQr = String(secondary.languageCoursePage?.banglaQrImageUrl || "").trim();
      const mergedQr = primaryQr.startsWith("data:image/")
        ? primaryQr
        : secondaryQr.startsWith("data:image/")
          ? secondaryQr
          : primaryQr || secondaryQr;
      resolvedCmsList = [
        normalizeCmsQr({
          ...secondary,
          ...primary,
          languageCoursePage: {
            ...(secondary.languageCoursePage || {}),
            ...(primary.languageCoursePage || {}),
            banglaQrImageUrl: mergedQr,
          },
          leadExtendedProfiles:
            primary.leadExtendedProfiles || secondary.leadExtendedProfiles || {},
          schoolExtendedProfiles:
            primary.schoolExtendedProfiles || secondary.schoolExtendedProfiles || {},
          b2bAgentExtendedProfiles:
            primary.b2bAgentExtendedProfiles || secondary.b2bAgentExtendedProfiles || {},
        }),
      ];
    }

    const result = {
      crmLeads: dbLeads,
      visaApplicants: dbApplicants,
      lmsBridges: dbLms,
      b2bAgents: dbAgents,
      partnerSchools: dbSchools,
      transactions: dbTransactions,
      staffList: dbStaff,
      websiteCms: resolvedCmsList,
      snapshotStore: snapshot,
    };

    return NextResponse.json({ ok: true, data: result });
  } catch (error) {
    console.error("[API][CMS_SYNC][GET] Error:", error);
    return NextResponse.json({ ok: false, data: null, error: "Sync failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, entity, payload, fullStore } = body as {
      type: "UPSERT" | "INSERT" | "DELETE" | "CMS_UPDATE" | "DELTA_STORE_SYNC" | "FULL_STORE_SYNC";
      entity?: string;
      payload?: any;
      fullStore?: MasterKnlTcStore;
    };

    const nowIso = new Date().toISOString();
    const prevSnapshot = await readServerSnapshot();
    const prevSnapshotClone: MasterKnlTcStore = JSON.parse(JSON.stringify(prevSnapshot));

    if (fullStore && Array.isArray(fullStore.crmLeads)) {
      if (fullStore.websiteCms?.[0]) {
        (fullStore.websiteCms[0] as any).updatedAt = nowIso;
      }
      await writeServerSnapshot(fullStore);
    }

    if (type === "DELTA_STORE_SYNC" && fullStore) {
      const cleanedStore = await writeServerSnapshot(fullStore);
      const deltaCount = await syncStoreDeltaToSheets(prevSnapshotClone, cleanedStore, nowIso);
      return NextResponse.json({
        ok: true,
        deltaCount,
        message: `Synced ${deltaCount} changed record(s) to Google Sheets & Persistent Disk`,
      });
    }

    if (type === "FULL_STORE_SYNC" && fullStore) {
      if (fullStore.websiteCms?.[0]) {
        (fullStore.websiteCms[0] as any).updatedAt = nowIso;
      }
      const cleanedStore = await writeServerSnapshot(fullStore);
      await bulkSyncMasterStoreToSheets(cleanedStore, false);
      return NextResponse.json({
        ok: true,
        message: "Full store synced to Google Sheets & Persistent Disk",
        store: cleanedStore,
      });
    }

    if ((type as string) === "PURGE_ALL_DUMMY" || entity === "PURGE_ALL_DUMMY") {
      prevSnapshot.crmLeads = [];
      prevSnapshot.visaApplicants = [];
      prevSnapshot.lmsBridges = [];
      prevSnapshot.b2bAgents = [];
      prevSnapshot.partnerSchools = [];
      prevSnapshot.staffList = [];
      prevSnapshot.transactions = [];
      if (prevSnapshot.websiteCms?.[0]) {
        prevSnapshot.websiteCms[0].customerOrders = [];
        prevSnapshot.websiteCms[0].testimonials = [];
        prevSnapshot.websiteCms[0].storeProducts = [];
      }
      purgeFallbackTables();
      await writeServerSnapshot(prevSnapshot);
      return NextResponse.json({ ok: true, message: "Server snapshot purged of dummy data" });
    }

    if (type === "CMS_UPDATE" && payload) {
      const cleanedCms = offloadEmbeddedBase64Strings(payload, "KNLTC_Website_CMS", "cms").value;
      if (cleanedCms && typeof cleanedCms === "object") {
        cleanedCms.updatedAt = nowIso;
        if (cleanedCms.languageCoursePage?.banglaQrImageUrl) {
          const rawQr = String(cleanedCms.languageCoursePage.banglaQrImageUrl).trim();
          const idx = rawQr.indexOf("/api/media/file/");
          if (idx >= 0) {
            cleanedCms.languageCoursePage.banglaQrImageUrl = rawQr.slice(idx);
          }
        }
      }
      prevSnapshot.websiteCms = [cleanedCms];
      await writeServerSnapshot(prevSnapshot);
      await upsertRow(
        "knltc_website_cms",
        {
          id: "cms-master-01",
          section_key: "master_cms",
          data: cleanedCms,
          updated_at: nowIso,
        },
        "section_key",
      );
      return NextResponse.json({
        ok: true,
        message: "CMS updated in Google Sheets & Persistent Disk",
        data: cleanedCms,
      });
    }

    if (entity && payload) {
      const cleanedPayload = offloadEmbeddedBase64Strings(
        payload,
        `KNLTC_${entity}`,
        entity,
      ).value;

      if (type === "DELETE" && cleanedPayload.id) {
        await deleteRow(entity, String(cleanedPayload.id));
        return NextResponse.json({ ok: true, deletedId: cleanedPayload.id });
      } else if (type === "UPSERT") {
        const saved = await upsertRow(entity, cleanedPayload);
        return NextResponse.json({ ok: true, data: saved });
      } else {
        const saved = await insertRow(entity, cleanedPayload);
        return NextResponse.json({ ok: true, data: saved });
      }
    }

    return NextResponse.json({ ok: false, error: "Invalid parameters" }, { status: 400 });
  } catch (error) {
    console.error("[API][CMS_SYNC][POST] Error:", error);
    return NextResponse.json({ ok: false, error: "Operation failed" }, { status: 500 });
  }
}
