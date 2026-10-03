import type { Metadata } from "next";
import HeroCourseSection from "@/components/japanese-language/HeroCourseSection";
import TrustMetricsSection from "@/components/japanese-language/TrustMetricsSection";
import CoursePackagesSection from "@/components/japanese-language/CoursePackagesSection";
import BonusSection from "@/components/japanese-language/BonusSection";
import InteractiveLanguageLab from "@/components/japanese-language/InteractiveLanguageLab";
import HowItWorksSection from "@/components/japanese-language/HowItWorksSection";
import EnrollmentForm from "@/components/japanese-language/EnrollmentForm";
import CurriculumFaqSection from "@/components/japanese-language/CurriculumFaqSection";

export const metadata: Metadata = {
  title: "Japanese Language Course (N5, N4 & Irodori) | KNLTC Japan Gateway Dhaka",
  description:
    "Learn Japanese language the easy way at KNLTC Dhaka. Preparation for JLPT/NAT/JFT from N5 to N1 and Irodori Japanese. Includes 3 free bonus courses for Embassy Visa Interview and Japanese CV with full digital LMS classroom access.",
};

export default function JapaneseLanguagePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* 1. Smart Executive Hero Section */}
      <HeroCourseSection />

      {/* 2. Institutional Accreditation & Trust Metrics */}
      <TrustMetricsSection />

      {/* 3. Interactive Course Explorer & Pricing (N5, N4, Advanced) */}
      <CoursePackagesSection />

      {/* 4. Free Career Bonus Value (৳15,000 Free Inclusions with N5) */}
      <BonusSection />

      {/* 5. Interactive Japanese Spoken & Audio Pronunciation Lab */}
      <InteractiveLanguageLab />

      {/* 6. Simple 3-Step Enrollment Workflow */}
      <HowItWorksSection />

      {/* 7. Streamlined 1-Step Student Admission Form */}
      <EnrollmentForm />

      {/* 8. Essential FAQ & WhatsApp Counseling */}
      <CurriculumFaqSection />
    </main>
  );
}
