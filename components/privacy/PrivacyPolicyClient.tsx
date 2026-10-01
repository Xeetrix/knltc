"use client";

import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";
import { siteConfig } from "@/lib/site";

export default function PrivacyPolicyClient() {
  const { language } = useLanguage();

  const t = translate(
    {
      en: {
        title: "Privacy Policy",
        lastUpdated: "Last updated: September 2026",
        intro:
          "KNLTC (Japan Education & Career Consultancy) values your trust and is committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and protect your data when you access knltc.com and our counseling services.",
        sec1Title: "1. Information We Collect",
        sec1P:
          "We collect personal data that you voluntarily provide when requesting a consultation, enrolling in language courses, or submitting an application, including: Name, Phone Number, WhatsApp Number, Email, Education, and Visa Preferences. We also collect automated usage data such as browser type and referral sources.",
        sec2Title: "2. How We Use Your Data",
        sec2P:
          "Your information is used strictly to provide educational counseling, language batch scheduling, visa roadmap preparation, and essential communication. We never sell your data to third parties.",
        sec3Title: "3. Advertising & Cookies (Meta Pixel)",
        sec3P:
          "We utilize standard cookies and advertising measurement tools (such as Meta Pixel) to assess advertising effectiveness and provide relevant program guidance to prospective students and job candidates.",
        sec4Title: "4. Your Rights & Data Protection",
        sec4P:
          "You have the right to request access to, correction, or deletion of your personal records at any time by contacting our data protection officer.",
        sec5Title: "5. Contact & Inquiries",
      },
      bn: {
        title: "গোপনীয়তা নীতি (Privacy Policy)",
        lastUpdated: "সর্বশেষ আপডেট: সেপ্টেম্বর ২০২৬",
        intro:
          "KNLTC (Japan Education & Career Consultancy) আপনার তথ্যের গোপনীয়তা রক্ষায় দৃঢ় প্রতিশ্রুতিবদ্ধ। knltc.com ব্যবহার ও আমাদের গাইডেন্স নেওয়ার সময় আপনার তথ্য কীভাবে সংরক্ষিত ও ব্যবহৃত হয় তা নিচে বর্ণিত হলো।",
        sec1Title: "১. আমরা যে তথ্য সংগ্রহ করি",
        sec1P:
          "কনসাল্টেশন গ্রহণ, কোর্স ভর্তি কিংবা আবেদন ফরম পূরণের সময় আপনি স্বেচ্ছায় যে তথ্য প্রদান করেন (যেমন: নাম, মোবাইল নম্বর, হোয়াটসঅ্যাপ নম্বর, ইমেইল, শিক্ষাগত যোগ্যতা এবং পছন্দের ভিসা ক্যাটাগরি) তা আমরা সংরক্ষণ করি।",
        sec2Title: "২. তথ্যের ব্যবহার",
        sec2P:
          "আপনার তথ্য শুধুমাত্র জাপানি ভাষা কোর্সের ব্যাচ বরাদ্দ, ক্যারিয়ার কাউন্সেলিং, এম্বাসি গাইডলাইন এবং জরুরি যোগাযোগের উদ্দেশ্যে ব্যবহৃত হয়। আমরা কোনো অবস্থাতেই আপনার তথ্য তৃতীয় পক্ষের কাছে বিক্রয় করি না।",
        sec3Title: "৩. বিজ্ঞাপন ও কুকিজ (Meta Pixel)",
        sec3P:
          "ওয়েবসাইটের পারফরম্যান্স এবং সঠিক আগ্রহীদের কাছে তথ্য পৌঁছানোর জন্য আমরা কুকিজ ও মেটা পিক্সেল (Meta Pixel) প্রযুক্তি ব্যবহার করি।",
        sec4Title: "৪. আপনার অধিকার ও নিরাপত্তা",
        sec4P:
          "যেকোনো সময় আপনার প্রদানকৃত তথ্য পরিবর্তন, হালনাগাদ কিংবা ডেটাবেজ থেকে মুছে ফেলার অনুরোধ করতে পারেন।",
        sec5Title: "৫. যোগাযোগ",
      },
      ja: {
        title: "プライバシーポリシー",
        lastUpdated: "最終更新: 2026年9月",
        intro:
          "KNLTC（日本留学・キャリアコンサルタント）は、お客様の個人情報の保護を最重要課題と位置付けています。当サイトおよび各種ガイダンスをご利用いただく際の個人情報の取り扱い方針を以下に定めます。",
        sec1Title: "1. 収集する情報",
        sec1P:
          "無料相談、講座お申し込み、お問い合わせ時にご提供いただく氏名、電話番号、WhatsApp番号、メールアドレス、学歴、希望ビザ区分等の情報を適法かつ公正に取得します。",
        sec2Title: "2. 利用目的",
        sec2P:
          "収集した情報は、受講クラス編成、進学・就職カウンセリング、ビザ手続き案内、各種連絡にのみ使用し、第三者への販売・無断譲渡は行いません。",
        sec3Title: "3. クッキーおよび広告計測（Meta Pixel）",
        sec3P:
          "サイトの利便性向上および適切な情報発信のため、CookieおよびMeta Pixel等の計測ツールを使用する場合があります。",
        sec4Title: "4. ご利用者の権利",
        sec4P:
          "ご自身の個人情報の開示、訂正、削除を希望される場合は、窓口までお申し出いただければ速やかに対応いたします。",
        sec5Title: "5. お問い合わせ窓口",
      },
    },
    language,
  );

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-gray-800">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">{t.title}</h1>
      <p className="text-sm text-gray-500 mb-8">{t.lastUpdated}</p>

      <div className="space-y-6 leading-relaxed text-sm sm:text-base text-gray-700">
        <p className="bg-stone-50 border border-stone-200 rounded-2xl p-5">{t.intro}</p>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-gray-900">{t.sec1Title}</h2>
          <p>{t.sec1P}</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-gray-900">{t.sec2Title}</h2>
          <p>{t.sec2P}</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-gray-900">{t.sec3Title}</h2>
          <p>{t.sec3P}</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-gray-900">{t.sec4Title}</h2>
          <p>{t.sec4P}</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-gray-900">{t.sec5Title}</h2>
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 space-y-1 text-sm">
            <p className="font-semibold text-gray-900">{siteConfig.name}</p>
            <p>{siteConfig.address.streetAddress}, {siteConfig.address.addressLocality}, Bangladesh</p>
            <p>
              Email:{" "}
              <a href={`mailto:${siteConfig.email}`} className="text-red-700 underline">
                {siteConfig.email}
              </a>
            </p>
            <p>
              Phone / WhatsApp:{" "}
              <a href={siteConfig.phoneHref} className="text-red-700 underline">
                {siteConfig.phoneDisplay}
              </a>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
