import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import TrustSection from "@/components/home/TrustSection";
import ServicesSection from "@/components/home/ServicesSection";
import ProcessSection from "@/components/home/ProcessSection";
import BenefitsSection from "@/components/home/BenefitsSection";
import FAQSection from "@/components/home/FAQSection";
import FinalCTA from "@/components/home/FinalCTA";
import ContactSection from "@/components/home/ContactSection";
import WhatsAppFAB from "@/components/home/WhatsAppFAB";

export const metadata: Metadata = {
  title: "Japanese Language, Student Visa & Job Pathway",
  description:
    "KNLTC helps Bangladeshi students and job seekers with Japanese language training, student visa support, documentation, and Japan job pathway guidance.",
  keywords: [
    "KNLTC",
    "Japan student visa Bangladesh",
    "Japanese language training",
    "Japan job pathway",
    "Documentation support Japan",
  ],
  openGraph: {
    title: "KNLTC | Japan e porashona o career er shothik prostuti",
    description:
      "Free consultation for Japanese language training, student visa, and work pathway support from Bangladesh to Japan.",
    type: "website",
    url: "https://www.knltc.com",
  },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustSection />
      <ServicesSection />
      <ProcessSection />
      <BenefitsSection />
      <FAQSection />
      <FinalCTA />
      <ContactSection />
      <WhatsAppFAB />
    </>
  );
}
