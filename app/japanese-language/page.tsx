import type { Metadata } from "next";
import ContentPage from "@/components/layout/ContentPage";

export const metadata: Metadata = {
  title: "Japanese Language",
  description: "Develop Japanese communication skills through structured KNLTC training from beginner to advanced levels.",
};

export default function JapaneseLanguagePage() {
  return (
    <ContentPage
      title={{ en: "Japanese Language", bn: "জাপানি ভাষা", ja: "日本語" }}
      description={{
        en: "Structured courses designed to help learners progress confidently from beginner to advanced levels.",
        bn: "শুরু থেকে অ্যাডভান্সড পর্যন্ত আত্মবিশ্বাসের সাথে এগোতে সাজানো কোর্স।",
        ja: "初級から上級まで自信を持って学べる体系的なコースです。",
      }}
      points={[
        { en: "JLPT-focused curriculum with guided practice", bn: "JLPT-কেন্দ্রিক কারিকুলাম ও গাইডেড প্র্যাকটিস", ja: "JLPT対策カリキュラムと指導付き練習" },
        { en: "Speaking and interview confidence workshops", bn: "স্পিকিং ও ইন্টারভিউ আত্মবিশ্বাস ওয়ার্কশপ", ja: "会話力・面接力向上ワークショップ" },
        { en: "Personalized coaching aligned with your goals", bn: "আপনার লক্ষ্যের সাথে মিলিয়ে পার্সোনালাইজড কোচিং", ja: "目標に合わせた個別コーチング" },
      ]}
    />
  );
}
