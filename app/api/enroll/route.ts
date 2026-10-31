import { NextRequest, NextResponse } from "next/server";
import { addEnrollment, DeliveryMode, VisaCategory } from "@/lib/portal-data";
import { createCrmLead } from "@/lib/cms";
import { mutateSheetTable } from "@/lib/google-sheets-db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      applicantName,
      phone,
      whatsapp,
      email,
      branchId,
      courseId,
      deliveryMode = "ONLINE_LIVE",
      visaCategory = "STUDENT_VISA",
      highestDegree,
      notes,
      referenceId,
    } = body;

    if (!applicantName || !phone) {
      return NextResponse.json(
        { error: "নাম এবং মোবাইল নম্বর দেওয়া আবশ্যক।" },
        { status: 400 },
      );
    }

    // 1. Save in portal data
    const enrollment = addEnrollment({
      applicantName: String(applicantName).trim(),
      phone: String(phone).trim(),
      whatsapp: String(whatsapp || phone).trim(),
      email: String(email || "").trim(),
      branchId: String(branchId || "branch-dhaka-hq"),
      courseId: String(courseId || "course-n5"),
      deliveryMode: deliveryMode as DeliveryMode,
      visaCategory: visaCategory as VisaCategory,
      highestDegree: highestDegree ? String(highestDegree) : undefined,
      notes: notes ? String(notes) : undefined,
    });

    const resolvedEnrollmentNo = referenceId || enrollment.enrollmentNo;
    const courseLevel = String(courseId || "N5")
      .toUpperCase()
      .includes("N4")
      ? "N4"
      : String(courseId || "N5")
          .toUpperCase()
          .includes("IRODORI")
        ? "IRODORI"
        : "N5";

    // 2. Register in Google Sheets `knltc_lms_bridges` (`https://npw.bd/knltc` classroom bridge)
    try {
      await mutateSheetTable({
        action: "INSERT",
        table: "knltc_lms_bridges",
        payload: {
          id: `lms-${Date.now()}`,
          lead_id: "",
          student_name: String(applicantName).trim(),
          phone: String(phone).trim(),
          course_level: courseLevel,
          enrollment_no: resolvedEnrollmentNo,
          portal_username: `${String(applicantName)
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "")
            .slice(0, 10)}.${courseLevel.toLowerCase()}@npw.bd`,
          portal_password_masked: `${courseLevel}@knltc2026`,
          portal_fee_deducted_bdt: 2000,
          net_knltc_margin_bdt: Math.max(0, (enrollment.totalPayable || 12000) - 2000),
          credentials_sent_via_wa: true,
          credentials_sent_at: new Date().toISOString(),
          progress_percentage: 5,
          active_batch: `${enrollment.courseTitle} (${deliveryMode} — https://npw.bd/knltc)`,
          assigned_sensei_id: "",
          assigned_sensei_name: "KNLTC Academic Team (Senior Sensei)",
          created_at: new Date().toISOString(),
        },
      });
    } catch (lmsErr) {
      console.warn("Failed to record LMS bridge row in Google Sheets:", lmsErr);
    }

    // 3. Also register in Google Sheets `knltc_crm_leads` for KNLTC counselors
    try {
      await createCrmLead({
        name: applicantName,
        phone: phone,
        email: email || null,
        source: "consultation form",
        interest: `Course Enrollment: ${enrollment.courseTitle} (${resolvedEnrollmentNo})`,
        message: `Branch: ${enrollment.branchName} | Mode: ${deliveryMode} | Visa: ${visaCategory} | Edu: ${highestDegree || "N/A"}`,
        status: "new",
        notes: `Auto-created from Japanese Course Enrollment Form. Fee: ৳${enrollment.totalPayable}. LMS Portal: https://npw.bd/knltc`,
      });
    } catch (crmErr) {
      console.warn("Failed to mirror lead into CRM:", crmErr);
    }

    return NextResponse.json({
      success: true,
      message: "আপনার ভর্তি আবেদন সফলভাবে গ্রহণ করা হয়েছে!",
      enrollment: {
        ...enrollment,
        enrollmentNo: resolvedEnrollmentNo,
      },
    });
  } catch (error) {
    console.error("Enrollment error:", error);
    return NextResponse.json(
      { error: "আবেদন প্রক্রিয়াকরণে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।" },
      { status: 500 },
    );
  }
}
