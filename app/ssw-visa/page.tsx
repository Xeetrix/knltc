import type { Metadata } from "next";
import SswVisaLandingClient from "@/components/ssw/SswVisaLandingClient";

export const metadata: Metadata = {
  title: "SSW Japan Visa Application | KNLTC",
  description: "Apply for SSW Agriculture and Caregiver visa support from Bangladesh with KNLTC.",
};

export default function SswVisaPage() {
  return <SswVisaLandingClient />;
}
