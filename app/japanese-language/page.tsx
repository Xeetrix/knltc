import type { Metadata } from "next";
import ContentPage from "@/components/layout/ContentPage";

export const metadata: Metadata = {
  title: "Japanese Language",
  description: "Develop Japanese communication skills through structured KNLTC training from beginner to advanced levels.",
};

export default function JapaneseLanguagePage() {
  return (
    <ContentPage
      title="Japanese Language"
      description="Structured courses designed to help learners progress confidently from beginner to advanced levels."
      points={[
        "JLPT-focused curriculum with guided practice",
        "Speaking and interview confidence workshops",
        "Personalized coaching aligned with your goals",
      ]}
    />
  );
}
