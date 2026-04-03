import type { Metadata } from "next";
import ContentPage from "@/components/layout/ContentPage";

export const metadata: Metadata = {
  title: "Services",
  description: "Explore KNLTC services for Japanese language learning, interview preparation, and relocation guidance.",
};

export default function ServicesPage() {
  return (
    <ContentPage
      title={{ en: "Our Services", bn: "আমাদের সেবা", ja: "サービス" }}
      description={{
        en: "Comprehensive services for language learning, placement readiness, and relocation support.",
        bn: "ভাষা শেখা, চাকরি প্রস্তুতি ও রিলোকেশন সাপোর্টের জন্য সম্পূর্ণ সেবা।",
        ja: "語学学習、就職準備、渡航サポートを包括的に提供します。",
      }}
      points={[
        { en: "Japanese language training (JLPT N5–N1)", bn: "জাপানি ভাষা প্রশিক্ষণ (JLPT N5–N1)", ja: "日本語トレーニング（JLPT N5〜N1）" },
        { en: "Interview, CV, and communication readiness coaching", bn: "ইন্টারভিউ, সিভি ও যোগাযোগ দক্ষতা কোচিং", ja: "面接・履歴書・コミュニケーション対策" },
        { en: "Visa documentation and pre-departure support", bn: "ভিসা ডকুমেন্টেশন ও প্রি-ডিপার্চার সাপোর্ট", ja: "ビザ書類と渡航前サポート" },
      ]}
    />
  );
}
