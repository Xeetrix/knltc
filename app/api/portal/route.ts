import { NextRequest, NextResponse } from "next/server";
import {
  getPortalStore,
  updateEnrollmentStatus,
  updatePaymentStatus,
  EnrollmentStatus,
  PaymentStatus,
  PaymentMethod,
} from "@/lib/portal-data";
import { fetchAllSheetTables } from "@/lib/google-sheets-db";

export async function GET() {
  const store = getPortalStore();
  try {
    const db = await fetchAllSheetTables();
    const lmsRows = Array.isArray(db.knltc_lms_bridges) ? db.knltc_lms_bridges : [];
    const enrollmentRows = Array.isArray(db.knltc_course_enrollments)
      ? db.knltc_course_enrollments
      : [];

    const dhakaCount = enrollmentRows.filter((r) =>
      String(r.branch || "").toUpperCase().includes("DHAKA"),
    ).length;
    const khulnaCount = enrollmentRows.filter((r) =>
      String(r.branch || "").toUpperCase().includes("KHULNA"),
    ).length;
    const onlineCount = Math.max(
      lmsRows.length,
      enrollmentRows.filter((r) =>
        String(r.branch || "").toUpperCase().includes("ONLINE"),
      ).length,
    );

    const branches = store.branches.map((b) => ({
      ...b,
      totalStudents:
        b.id === "branch-dhaka-hq"
          ? dhakaCount
          : b.id === "branch-khulna"
            ? khulnaCount
            : onlineCount,
    }));

    return NextResponse.json({
      branches,
      courses: store.courses,
      batches: store.batches,
      enrollments: store.enrollments,
      resources: store.resources,
    });
  } catch {
    return NextResponse.json({
      branches: store.branches,
      courses: store.courses,
      batches: store.batches,
      enrollments: store.enrollments,
      resources: store.resources,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, enrollmentId, status, batchId, paymentStatus, paidAmount, method, transactionId } = body;

    if (action === "update_enrollment_status" && enrollmentId && status) {
      const updated = updateEnrollmentStatus(enrollmentId, status as EnrollmentStatus, batchId);
      if (!updated) {
        return NextResponse.json({ error: "Enrollment not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, enrollment: updated });
    }

    if (action === "update_payment" && enrollmentId && paymentStatus) {
      const updated = updatePaymentStatus(
        enrollmentId,
        paymentStatus as PaymentStatus,
        paidAmount ? Number(paidAmount) : undefined,
        method as PaymentMethod,
        transactionId
      );
      if (!updated) {
        return NextResponse.json({ error: "Enrollment not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, enrollment: updated });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Portal API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
