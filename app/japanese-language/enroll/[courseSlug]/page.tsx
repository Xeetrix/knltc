import type { Metadata } from "next";
import EnrollmentForm, {
  type PaymentPlanOption,
} from "@/components/japanese-language/EnrollmentForm";

interface PageProps {
  params: Promise<{ courseSlug: string }>;
  searchParams: Promise<{ plan?: string; promo?: string }>;
}

const COURSE_METADATA: Record<
  string,
  { title: string; description: string }
> = {
  "jft-irodori": {
    title:
      "Enroll in JFT (Irodori) Course (3 Months • 150 Hours) | KNLTC Japan Gateway",
    description:
      "Official JFT-Basic & Irodori Japanese Course for both Student Visa and SSW Job Visa candidates. 20% Discount on Full Payment or 50% 1st Installment via bKash Bangla QR.",
  },
  "jlpt-n5": {
    title:
      "Enroll in JLPT N5 Beginner Course (3 Months • 150 Hours) | KNLTC Japan Gateway",
    description:
      "Complete 150-Hour JLPT N5 & NAT 5Q Foundation Course for Student Visa & TITP candidates. Includes 3 Free Bonus Courses worth ৳15,000.",
  },
  "jlpt-n4": {
    title:
      "Enroll in JLPT N4 Intermediate & SSW Course (3 Months • 150 Hours) | KNLTC",
    description:
      "JLPT N4 & SSW Job Visa preparation course at KNLTC Dhaka & Khulna. 100% Free Scholarship for KNLTC Student Visa COE processing candidates.",
  },
  "n5-n4-combo": {
    title:
      "Enroll in JLPT N5 + N4 Together Combo (6 Months • 300 Hours) | KNLTC",
    description:
      "Complete Zero-to-N4 300-Hour Combo Package with 20% Full Payment Discount, 3 Free Bonus Courses, and 24/7 Student LMS access.",
  },
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { courseSlug } = await params;
  const slug = (courseSlug || "jft-irodori").toLowerCase();
  const meta = COURSE_METADATA[slug] || COURSE_METADATA["jft-irodori"];
  return {
    title: meta.title,
    description: meta.description,
  };
}

export default async function CourseEnrollmentCampaignPage({
  params,
  searchParams,
}: PageProps) {
  const { courseSlug } = await params;
  const sp = await searchParams;
  const planParam = (sp?.plan || "").toLowerCase();
  const initialPlan: PaymentPlanOption =
    planParam === "full" || planParam === "20" || planParam === "direct"
      ? "FULL_PAYMENT"
      : "INSTALLMENT_50";

  return (
    <main className="min-h-screen bg-[#fcfaf7]">
      <EnrollmentForm
        initialCourseSlug={courseSlug}
        initialPlan={initialPlan}
        initialPromoCode={sp?.promo}
        isStandalonePage={true}
      />
    </main>
  );
}
