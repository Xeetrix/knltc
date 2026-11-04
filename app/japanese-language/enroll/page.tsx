import type { Metadata } from "next";
import EnrollmentForm from "@/components/japanese-language/EnrollmentForm";

export const metadata: Metadata = {
  title:
    "Japanese Course Online Admission & bKash Bangla QR Payment | KNLTC Japan Gateway",
  description:
    "Enroll in JFT (Irodori), JLPT N5, JLPT N4, or N5+N4 Combo Package with 20% Full Payment Discount or 50% Installment at KNLTC Dhaka & Khulna.",
};

export default function DefaultCourseEnrollPage() {
  return (
    <main className="min-h-screen bg-[#fcfaf7]">
      <EnrollmentForm initialCourseSlug="jft-irodori" isStandalonePage={true} />
    </main>
  );
}
