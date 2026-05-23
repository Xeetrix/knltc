import type { Metadata } from "next";
import ContentPage from "@/components/layout/ContentPage";
import { fallbackLocalizedField } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about KNLTC and how we support Bangladesh-based applicants planning for Japan.",
};

export default function AboutPage() {
  return (
    <ContentPage
      title={fallbackLocalizedField({ en: "About KNLTC", bn: "KNLTC সম্পর্কে", ja: "KNLTCについて" })}
      description={fallbackLocalizedField({
        en: "We help Bangladeshi students and professionals build a successful future in Japan through end-to-end guidance.",
        bn: "আমরা বাংলাদেশি শিক্ষার্থী ও পেশাজীবীদের জাপানে সফল ভবিষ্যৎ গড়তে সম্পূর্ণ গাইডেন্স দিই।",
        ja: "バングラデシュの学生・社会人が日本で成功するために、包括的なサポートを提供します。",
      })}
      points={[
        fallbackLocalizedField({
          en: "Experienced team focused on safe and transparent processes",
          bn: "নিরাপদ ও স্বচ্ছ প্রক্রিয়ায় অভিজ্ঞ টিম",
          ja: "安全で透明性のある手続きに精通したチーム",
        }),
        fallbackLocalizedField({
          en: "Eligibility-first counseling with practical recommendations",
          bn: "যোগ্যতা-ভিত্তিক বাস্তবসম্মত কাউন্সেলিং",
          ja: "適性を重視した実践的なカウンセリング",
        }),
        fallbackLocalizedField({
          en: "Continuous support from first consultation to your next step",
          bn: "প্রথম পরামর্শ থেকে পরবর্তী ধাপ পর্যন্ত ধারাবাহিক সহায়তা",
          ja: "初回相談から次のステップまで継続支援",
        }),
      ]}
    />
  );
}
