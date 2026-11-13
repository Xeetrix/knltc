import { NextRequest, NextResponse } from "next/server";
import { addEnrollment, DeliveryMode, VisaCategory } from "@/lib/portal-data";
import { mutateSheetTable } from "@/lib/google-sheets-db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      leadId: clientSyncedLeadId = "",
      flowMode = "DIRECT_PURCHASE",
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
      paymentPlan = "FULL",
      paymentMethod = "BKASH_QR",
      baseFeeBdt,
      discountBdt = 0,
      netCourseFeeBdt,
      paidAmountBdt = 0,
      dueAmountBdt = 0,
      senderNumber = "",
      trxId = "",
      promoCode = "",
    } = body;

    if (!applicantName || !phone) {
      return NextResponse.json(
        { error: "নাম এবং মোবাইল নম্বর দেওয়া আবশ্যক।" },
        { status: 400 },
      );
    }

    const isDirectPurchase =
      flowMode === "DIRECT_PURCHASE" &&
      Boolean(trxId) &&
      trxId !== "SALES-TEAM-PAY-LATER" &&
      trxId !== "PAY_AT_OFFICE" &&
      Number(paidAmountBdt) > 0;

    // Normalize courseId & branchId for portal-data store
    const rawCourseStr = String(courseId || "JFT_IRODORI").toUpperCase();
    const normalizedPortalCourseId = rawCourseStr.includes("COMBO")
      ? "course-combo"
      : rawCourseStr.includes("N4")
        ? "course-n4"
        : rawCourseStr.includes("N5")
          ? "course-n5"
          : "course-jft";

    const defaultCourseFeeBdt = rawCourseStr.includes("COMBO")
      ? 21500
      : rawCourseStr.includes("N4")
        ? 14500
        : rawCourseStr.includes("N5")
          ? 12000
          : 12500;

    const resolvedBaseFee = Number(baseFeeBdt || defaultCourseFeeBdt);
    const resolvedNetFee = Number(netCourseFeeBdt || defaultCourseFeeBdt);

    const rawModeStr = String(deliveryMode || "ONLINE_LIVE").toUpperCase();
    const normalizedPortalBranchId =
      branchId ||
      (rawModeStr.includes("KHULNA")
        ? "branch-khulna"
        : rawModeStr.includes("PALTAN")
          ? "branch-dhaka-hq"
          : "branch-online-global");

    const normalizedPortalDeliveryMode: DeliveryMode =
      rawModeStr === "ONLINE_LIVE" ? "ONLINE_LIVE" : "OFFLINE_CLASSROOM";

    const normalizedPortalVisa: VisaCategory = String(visaCategory || "STUDENT_VISA")
      .toUpperCase()
      .includes("SSW")
      ? "SSW_JOB"
      : String(visaCategory || "STUDENT_VISA").toUpperCase().includes("TITP")
        ? "TITP_INTERN"
        : "STUDENT_VISA";

    // 1. Save in portal data
    const enrollment = addEnrollment({
      applicantName: String(applicantName).trim(),
      phone: String(phone).trim(),
      whatsapp: String(whatsapp || phone).trim(),
      email: String(email || "").trim(),
      branchId: String(normalizedPortalBranchId),
      courseId: normalizedPortalCourseId,
      deliveryMode: normalizedPortalDeliveryMode,
      visaCategory: normalizedPortalVisa,
      highestDegree: highestDegree ? String(highestDegree) : undefined,
      notes: notes ? String(notes) : undefined,
    });

    enrollment.totalPayable = resolvedNetFee;
    enrollment.paidAmount = Number(paidAmountBdt || 0);
    if (trxId) {
      enrollment.transactionId = String(trxId).trim().toUpperCase();
    }

    const resolvedEnrollmentNo = referenceId || enrollment.enrollmentNo;
    const courseLevel = rawCourseStr.includes("COMBO")
      ? "N5+N4"
      : rawCourseStr.includes("N4")
        ? "N4"
        : rawCourseStr.includes("IRODORI") || rawCourseStr.includes("JFT")
          ? "IRODORI"
          : "N5";

    const nowIso = new Date().toISOString();
    const resolvedBranchLabel = rawModeStr.includes("KHULNA")
      ? "KHULNA"
      : rawModeStr.includes("PALTAN")
        ? "DHAKA_PALTAN"
        : "ONLINE_ZOOM";
    const resolvedLeadId = String(clientSyncedLeadId || "").trim() || `LEAD-WEB-${Date.now()}`;

    // 2. Upsert in Dedicated Google Sheets `knltc_course_enrollments` (25-column Course Admission Table)
    try {
      await mutateSheetTable({
        action: "UPSERT",
        table: "knltc_course_enrollments",
        payload: {
          id: `enr-${resolvedLeadId}`,
          enrollment_no: resolvedEnrollmentNo,
          applicant_name: String(applicantName).trim(),
          phone: String(phone).trim(),
          whatsapp: String(whatsapp || phone).trim(),
          email: String(email || "").trim(),
          course_id: String(courseId || "JFT_IRODORI"),
          course_title: enrollment.courseTitle,
          delivery_mode: String(deliveryMode),
          branch: resolvedBranchLabel,
          visa_category: String(visaCategory),
          highest_degree: String(highestDegree || ""),
          payment_plan: String(paymentPlan),
          payment_method: String(paymentMethod),
          base_fee_bdt: resolvedBaseFee,
          discount_bdt: Number(discountBdt || 0),
          promo_code: String(promoCode || ""),
          net_course_fee_bdt: resolvedNetFee,
          paid_amount_bdt: isDirectPurchase ? Number(paidAmountBdt || 0) : 0,
          due_amount_bdt: isDirectPurchase ? Number(dueAmountBdt || 0) : resolvedNetFee,
          sender_number: String(senderNumber || ""),
          trx_id: String(trxId || "PAY_AT_OFFICE")
            .trim()
            .toUpperCase(),
          payment_status: isDirectPurchase ? "TRX_SUBMITTED" : "OFFICE_PENDING",
          notes: String(notes || ""),
          created_at: nowIso,
        },
      });
    } catch (enrErr) {
      console.warn(
        "Failed to record course enrollment row in knltc_course_enrollments:",
        enrErr,
      );
    }

    // 3. Always UPSERT in Google Sheets `knltc_crm_leads` on the server (using resolvedLeadId to avoid duplicates)
    try {
      const mappedInterest =
        courseLevel === "N4" || courseLevel === "N5+N4"
          ? "JAPANESE_N4"
          : "JAPANESE_N5";
      const mappedBranch = rawModeStr.includes("KHULNA")
        ? "KHULNA"
        : "DHAKA_PALTAN";
      const paymentSummary = isDirectPurchase
        ? `[Enroll Now - Instant LMS] Course: ${enrollment.courseTitle} (${resolvedEnrollmentNo}) | Mode: ${deliveryMode} | Plan: ${paymentPlan} | Net Fee: ৳${resolvedNetFee} | Paid: ৳${paidAmountBdt} | Due: ৳${dueAmountBdt} | Sender: ${senderNumber || phone} | TrxID: ${trxId}`
        : `[Apply Now - Discuss Payment] Course: ${enrollment.courseTitle} (${resolvedEnrollmentNo}) | Mode: ${deliveryMode} | Purpose: ${visaCategory} | Course Fee: ৳${resolvedNetFee}`;

      await mutateSheetTable({
        action: "UPSERT",
        table: "knltc_crm_leads",
        payload: {
          id: resolvedLeadId,
          full_name: String(applicantName).trim(),
          phone: String(phone).trim(),
          whatsapp: String(whatsapp || phone).trim(),
          email: String(email || "").trim(),
          city: rawModeStr.includes("KHULNA") ? "Khulna" : "Dhaka",
          branch: mappedBranch,
          highest_education: String(highestDegree || "HSC / Equivalent"),
          gpa_details: "",
          age: 22,
          study_gap_years: 0,
          interest: mappedInterest,
          stage: isDirectPurchase ? "LANGUAGE_ENROLLED" : "NEW",
          assigned_counselor_id: "",
          assigned_counselor_name: "Unassigned",
          source: "Website Portal",
          contract_amount_bdt: isDirectPurchase ? resolvedNetFee : 0,
          paid_amount_bdt: isDirectPurchase ? Number(paidAmountBdt || 0) : 0,
          next_follow_up_date: new Date(Date.now() + 86400000)
            .toISOString()
            .slice(0, 10),
          notes: `${paymentSummary}${notes ? ` | Note: ${notes}` : ""}`,
          created_at: nowIso,
          updated_at: nowIso,
        },
      });
    } catch (crmErr) {
      console.warn("Failed to upsert lead into knltc_crm_leads:", crmErr);
    }

    // 4. Upsert in `knltc_lms_bridges` and `knltc_finance_transactions` ONLY when Direct Purchase ("Enroll Now")
    if (isDirectPurchase) {
      try {
        await mutateSheetTable({
          action: "UPSERT",
          table: "knltc_lms_bridges",
          payload: {
            id: `LMS-BRIDGE-${resolvedLeadId}`,
            lead_id: resolvedLeadId,
            student_name: String(applicantName).trim(),
            phone: String(phone).trim(),
            course_level: courseLevel,
            enrollment_no: resolvedEnrollmentNo,
            portal_username: `${String(applicantName)
              .trim()
              .toLowerCase()
              .replace(/[^a-z0-9]/g, "")
              .slice(0, 10)}.${courseLevel.toLowerCase().replace(/[^a-z0-9]/g, "")}@npw.bd`,
            portal_password_masked: `${courseLevel}@knltc2026`,
            portal_fee_deducted_bdt: 2000,
            net_knltc_margin_bdt: Math.max(0, resolvedNetFee - 2000),
            credentials_sent_via_wa: true,
            credentials_sent_at: nowIso,
            progress_percentage: 5,
            active_batch: `${enrollment.courseTitle} (${deliveryMode} | Plan: ${paymentPlan} | TrxID: ${trxId})`,
            assigned_sensei_id: "",
            assigned_sensei_name: "",
            created_at: nowIso,
          },
        });
      } catch (lmsErr) {
        console.warn("Failed to upsert LMS bridge row in Google Sheets:", lmsErr);
      }

      try {
        await mutateSheetTable({
          action: "UPSERT",
          table: "knltc_finance_transactions",
          payload: {
            id: `FIN-CRS-${resolvedLeadId}`,
            receipt_no: resolvedEnrollmentNo,
            date: nowIso.slice(0, 10),
            student_name: String(applicantName).trim(),
            student_phone: String(phone).trim(),
            category: "LANGUAGE_COURSE_FEE",
            type: "INCOME",
            amount_bdt: Number(paidAmountBdt),
            due_amount_bdt: Number(dueAmountBdt || 0),
            payment_method: String(paymentMethod || "BKASH_BANGLA_QR"),
            reference_or_trx: String(trxId).trim().toUpperCase(),
            branch: rawModeStr.includes("KHULNA") ? "KHULNA" : "DHAKA_PALTAN",
            verified_by: `Pending (${senderNumber || phone})`,
            notes: `Course: ${courseLevel} | Plan: ${paymentPlan} | Base: ৳${resolvedBaseFee} | Discount: ৳${discountBdt} | Net: ৳${resolvedNetFee}${promoCode ? ` | Promo: ${promoCode}` : ""}`,
            linked_lead_id: resolvedLeadId,
            linked_visa_id: "",
            linked_school_id: "",
            linked_agent_id: "",
            linked_staff_id: "",
            created_at: nowIso,
          },
        });
      } catch (finErr) {
        console.warn("Failed to upsert finance transaction in Google Sheets:", finErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "আপনার ভর্তি আবেদন ও পেমেন্ট তথ্য সফলভাবে গ্রহণ করা হয়েছে!",
      enrollment: {
        ...enrollment,
        enrollmentNo: resolvedEnrollmentNo,
        paymentPlan,
        paymentMethod,
        netCourseFeeBdt: resolvedNetFee,
        paidAmountBdt,
        dueAmountBdt,
        trxId,
        promoCode,
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
