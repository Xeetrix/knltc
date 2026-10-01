import type { Metadata } from "next";
import PrivacyPolicyClient from "@/components/privacy/PrivacyPolicyClient";

export const metadata: Metadata = {
  title: "Privacy Policy | KNLTC",
  description:
    "Privacy Policy for KNLTC (Japan Education & Career Consultancy) covering data protection, course enrollment records, and user rights.",
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyClient />;
}
