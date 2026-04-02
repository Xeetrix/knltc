import type { Metadata } from "next";
import ContentPage from "@/components/layout/ContentPage";

export const metadata: Metadata = {
  title: "Work in Japan",
  description: "Prepare for Japan-focused job opportunities with KNLTC language, interview, and documentation support.",
};

export default function WorkInJapanPage() {
  return (
    <ContentPage
      title="Work in Japan"
      description="Build your career path for Japan with structured preparation and practical support."
      points={[
        "Role and eligibility guidance",
        "Japanese workplace etiquette and interview coaching",
        "Documentation and departure planning support",
      ]}
    />
  );
}
