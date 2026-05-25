import type { Metadata } from "next";
import ServicesPageClient from "@/components/services/ServicesPageClient";

export const metadata: Metadata = {
  title: "Services",
  description: "KNLTC service hub for Japanese language training, study/work pathways, and complete guidance support.",
};

export default function ServicesPage() {
  return <ServicesPageClient />;
}
