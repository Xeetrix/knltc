import { NextRequest, NextResponse } from "next/server";
import { addEnrollment, DeliveryMode, VisaCategory } from "@/lib/portal-data";
import { createCrmLead } from "@/lib/cms";

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
    } = body;

    if (!applicantName || !phone) {
      return NextResponse.json(
        { error: "নাম এবং মোবাইল নম্বর দেওয়া আবশ্যক।" },
        { status: 400 }
      );
    }

    // Save in portal data
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

    // Also register as CRM lead for KNLTC admin team
    try {
      await createCrmLead({
        name: applicantName,
        phone: phone,
        email: email || null,
        source: "consultation form",
        interest: `Course Enrollment: ${enrollment.courseTitle} (${enrollment.enrollmentNo})`,
        message: `Branch: ${enrollment.branchName} | Mode: ${deliveryMode} | Visa: ${visaCategory} | Edu: ${highestDegree || "N/A"}`,
        status: "new",
        notes: `Auto-created from Japanese Course Enrollment Form. Fee: ৳${enrollment.totalPayable}`,
      });
    } catch (crmErr) {
      console.warn("Failed to mirror lead into CRM:", crmErr);
    }

    return NextResponse.json({
      success: true,
      message: "আপনার ভর্তি আবেদন সফলভাবে গ্রহণ করা হয়েছে!",
      enrollment,
    });
  } catch (error) {
    console.error("Enrollment error:", error);
    return NextResponse.json(
      { error: "আবেদন প্রক্রিয়াকরণে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।" },
      { status: 500 }
    );
  }
}
