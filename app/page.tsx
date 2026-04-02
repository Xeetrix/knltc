import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import AudienceSection from "@/components/home/AudienceSection";
import ServicesSection from "@/components/home/ServicesSection";
import WhyChooseSection from "@/components/home/WhyChooseSection";
import ProcessSection from "@/components/home/ProcessSection";
import StudyWorkSection from "@/components/home/StudyWorkSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import FAQSection from "@/components/home/FAQSection";
import FinalCTA from "@/components/home/FinalCTA";
import ContactSection from "@/components/home/ContactSection";
import WhatsAppFAB from "@/components/home/WhatsAppFAB";

export const metadata: Metadata = {
  title: "Home",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AudienceSection />
      <ServicesSection />
      <WhyChooseSection />
      <ProcessSection />
      <StudyWorkSection />
      <TestimonialsSection />
      <FAQSection />
      <FinalCTA />
      <ContactSection />
      <WhatsAppFAB />
    </>
  );
}
