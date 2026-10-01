import type { Metadata } from "next";
import HeroCourseSection from "@/components/japanese-language/HeroCourseSection";
import TrustMetricsSection from "@/components/japanese-language/TrustMetricsSection";
import CoursePackagesSection from "@/components/japanese-language/CoursePackagesSection";
import BonusSection from "@/components/japanese-language/BonusSection";
import MethodologyInteractiveSection from "@/components/japanese-language/MethodologyInteractiveSection";
import EnrollmentForm from "@/components/japanese-language/EnrollmentForm";
import CurriculumFaqSection from "@/components/japanese-language/CurriculumFaqSection";
import RbacArchitecturePreview from "@/components/japanese-language/RbacArchitecturePreview";

export const metadata: Metadata = {
  title: "Japanese Language Course (N5 & N4) | KNLTC Japan Gateway Dhaka",
  description:
    "Complete N5 & N4 Japanese Language Course at KNLTC Dhaka with Minna No Nihongo method. Course fee ৳12,000. Includes 3 Free Bonus Courses for Embassy Visa Interview and Japanese CV.",
};

export default function JapaneseLanguagePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* 1. High Impact Hero Section */}
      <HeroCourseSection />

      {/* 2. Trust Metrics & Certified Curriculum Badges */}
      <TrustMetricsSection />

      {/* 3. Course Packages (N5 - ৳12,000, N4, N5+N4 Combo) */}
      <CoursePackagesSection />

      {/* 4. Exclusive Free Bonus Section (N5 Special - ৳15,000 Value FREE) */}
      <BonusSection />

      {/* 5. Interactive Methodology & Lesson Preview (Alphabet, Kotoba, Grammar, Kaiwa) */}
      <MethodologyInteractiveSection />

      {/* 6. Comprehensive Student Enrollment Form */}
      <EnrollmentForm />

      {/* 7. Curriculum Roadmap & FAQ Accordion */}
      <CurriculumFaqSection />

      {/* 8. Four-Tier Role-Based Access Control (RBAC) Architecture Showcase */}
      <RbacArchitecturePreview />
    </main>
  );
}
