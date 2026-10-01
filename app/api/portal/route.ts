import { NextRequest, NextResponse } from "next/server";
import {
  getPortalStore,
  updateEnrollmentStatus,
  updatePaymentStatus,
  EnrollmentStatus,
  PaymentStatus,
  PaymentMethod,
} from "@/lib/portal-data";

export async function GET() {
  const store = getPortalStore();
  return NextResponse.json({
    branches: store.branches,
    courses: store.courses,
    batches: store.batches,
    enrollments: store.enrollments,
    resources: store.resources,
  });
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
