import type { Metadata } from "next";
import ServicesPageClient from "@/components/services/ServicesPageClient";

export const metadata: Metadata = {
  title: "All Services Overview",
  description: "All services overview linking Japan career, study abroad, Japanese language, and support pathways.",
};

export default function ServicesPage() {
  return <ServicesPageClient />;
}
