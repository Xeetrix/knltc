import type { Metadata } from "next";
import ContentPage from "@/components/layout/ContentPage";

export const metadata: Metadata = {
  title: "Study in Japan",
  description: "Plan your Japan study journey with KNLTC support for admissions, documentation, and preparation.",
};

export default function StudyInJapanPage() {
  return (
    <ContentPage
      title={{ en: "Study in Japan", bn: "জাপানে পড়াশোনা", ja: "日本留学" }}
      description={{
        en: "Get admission support, language preparation, and guidance for a smooth student journey.",
        bn: "অ্যাডমিশন সাপোর্ট, ভাষা প্রস্তুতি ও সহজ স্টুডেন্ট জার্নির গাইডলাইন নিন।",
        ja: "入学サポート、語学準備、留学生活のためのガイダンスを提供します。",
      }}
      points={[
        { en: "School and program planning", bn: "স্কুল ও প্রোগ্রাম পরিকল্পনা", ja: "学校・プログラム選定" },
        { en: "Application and interview assistance", bn: "আবেদন ও ইন্টারভিউ সহায়তা", ja: "出願・面接サポート" },
        { en: "Student visa and pre-departure guidance", bn: "স্টুডেন্ট ভিসা ও প্রি-ডিপার্চার গাইড", ja: "学生ビザと渡航前ガイダンス" },
      ]}
    />
  );
}
