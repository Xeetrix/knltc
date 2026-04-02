import type { Metadata } from "next";
import ContentPage from "@/components/layout/ContentPage";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about KNLTC and how we support Bangladesh-based applicants planning for Japan.",
};

export default function AboutPage() {
  return (
    <ContentPage
      title="About KNLTC"
      description="We help Bangladeshi students and professionals build a successful future in Japan through end-to-end guidance."
      points={[
        "Experienced team focused on safe and transparent processes",
        "Eligibility-first counseling with practical recommendations",
        "Continuous support from first consultation to your next step",
      ]}
    />
  );
}
