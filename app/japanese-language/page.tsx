import type { Metadata } from "next";
import HeroCourseSection from "@/components/japanese-language/HeroCourseSection";
import TrustMetricsSection from "@/components/japanese-language/TrustMetricsSection";
import HowItWorksSection from "@/components/japanese-language/HowItWorksSection";
import CoursePackagesSection from "@/components/japanese-language/CoursePackagesSection";
import BonusSection from "@/components/japanese-language/BonusSection";
import EnrollmentForm from "@/components/japanese-language/EnrollmentForm";
import CurriculumFaqSection from "@/components/japanese-language/CurriculumFaqSection";

export const metadata: Metadata = {
  title: "Japanese Language Course (N5, N4 & Irodori) | KNLTC Japan Gateway Dhaka",
  description:
    "Learn Japanese language the easy way at KNLTC Dhaka. Preparation for JLPT/NAT/JFT from N5 to N1 and Irodori Japanese. Includes 3 free bonus courses for Embassy Visa Interview and Japanese CV. Online LMS at npw.bd/knltc.",
};

export default function JapaneseLanguagePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* 1. High Impact Hero Section */}
      <HeroCourseSection />

      {/* 2. Trust Metrics & Certified Curriculum Badges */}
      <TrustMetricsSection />

      {/* 3. How It Works (৩টি সহজ ধাপে আপনার যাত্রা শুরু করুন & LMS Access) */}
      <HowItWorksSection />

      {/* 4. Course Packages (N5 - ৳12,000, N4 - SSW, Advanced & Irodori) */}
      <CoursePackagesSection />

      {/* 5. Exclusive Free Bonus Section (N5 Special - ৳15,000 Value FREE) */}
      <BonusSection />

      {/* 6. Comprehensive Student Enrollment Form with Immediate Confirmation */}
      <EnrollmentForm />

      {/* 7. Frequently Asked Questions (FAQ) */}
      <CurriculumFaqSection />
    </main>
  );
}
