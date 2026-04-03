import type { Metadata } from "next";
import ContentPage from "@/components/layout/ContentPage";

export const metadata: Metadata = {
  title: "Work in Japan",
  description: "Prepare for Japan-focused job opportunities with KNLTC language, interview, and documentation support.",
};

export default function WorkInJapanPage() {
  return (
    <ContentPage
      title={{ en: "Work in Japan", bn: "জাপানে কাজ", ja: "日本就職" }}
      description={{
        en: "Build your career path for Japan with structured preparation and practical support.",
        bn: "গোছানো প্রস্তুতি ও বাস্তব সহায়তায় জাপানে ক্যারিয়ার গড়ুন।",
        ja: "体系的な準備と実践的サポートで日本でのキャリアを築きます。",
      }}
      points={[
        { en: "Role and eligibility guidance", bn: "রোল ও যোগ্যতা নির্দেশনা", ja: "職種と応募資格のガイダンス" },
        { en: "Japanese workplace etiquette and interview coaching", bn: "জাপানি কর্মসংস্কৃতি ও ইন্টারভিউ কোচিং", ja: "日本の職場マナーと面接対策" },
        { en: "Documentation and departure planning support", bn: "ডকুমেন্টেশন ও ডিপার্চার পরিকল্পনা সহায়তা", ja: "書類準備と渡航計画サポート" },
      ]}
    />
  );
}
