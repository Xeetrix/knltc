import type { Metadata } from "next";
import ContentPage from "@/components/layout/ContentPage";

export const metadata: Metadata = {
  title: "Study in Japan",
  description: "Plan your Japan study journey with KNLTC support for admissions, documentation, and preparation.",
};

export default function StudyInJapanPage() {
  return (
    <ContentPage
      title="Study in Japan"
      description="Get admission support, language preparation, and guidance for a smooth student journey."
      points={[
        "School and program planning",
        "Application and interview assistance",
        "Student visa and pre-departure guidance",
      ]}
    />
  );
}
