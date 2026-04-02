import type { Metadata } from "next";
import ContactSection from "@/components/home/ContactSection";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact KNLTC for support on study, work, and language pathways to Japan.",
};

export default function ContactPage() {
  return <ContactSection />;
}
