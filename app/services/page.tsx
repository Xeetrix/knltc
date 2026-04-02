import type { Metadata } from "next";
import ContentPage from "@/components/layout/ContentPage";

export const metadata: Metadata = {
  title: "Services",
  description: "Explore KNLTC services for Japanese language learning, interview preparation, and relocation guidance.",
};

export default function ServicesPage() {
  return (
    <ContentPage
      title="Our Services"
      description="Comprehensive services for language learning, placement readiness, and relocation support."
      points={[
        "Japanese language training (JLPT N5–N1)",
        "Interview, CV, and communication readiness coaching",
        "Visa documentation and pre-departure support",
      ]}
    />
  );
}
