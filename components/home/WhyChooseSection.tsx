"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";

const WhyChooseSection = () => {
  const { language } = useLanguage();

  const content = translate(
    {
      en: {
        title: "Why Choose KNLTC?",
        desc: "We're not just an agency — we're your trusted partner for a safe and successful journey to Japan.",
        points: [
          { title: "Step-by-Step Guidance", desc: "We walk you through every stage — no confusion, no shortcuts." },
          { title: "Clear & Transparent Process", desc: "You'll always know where you stand and what comes next." },
          { title: "Language + Career Support", desc: "We prepare you with both the language and professional skills." },
          { title: "Scam-Aware Consultation", desc: "We educate you on common scams so you stay protected." },
          { title: "Honest Communication", desc: "No fake promises. Only realistic expectations and practical guidance." },
          { title: "End-to-End Support", desc: "From first call to Japan arrival — we're with you the entire way." },
        ],
      },
      bn: {
        title: "কেন KNLTC বেছে নেবেন?",
        desc: "আমরা শুধু এজেন্সি নই—জাপান যাত্রাকে নিরাপদ ও সফল করতে আমরা আপনার বিশ্বস্ত সহযোগী।",
        points: [
          { title: "ধাপে ধাপে গাইডলাইন", desc: "প্রতিটি ধাপে আমরা পাশে থাকি—কোনো বিভ্রান্তি বা শর্টকাট নয়।" },
          { title: "স্বচ্ছ প্রক্রিয়া", desc: "আপনি সবসময় জানবেন আপনি কোন ধাপে আছেন এবং পরের ধাপ কী।" },
          { title: "ভাষা + ক্যারিয়ার সাপোর্ট", desc: "ভাষা দক্ষতার সাথে পেশাগত প্রস্তুতিও একসাথে করানো হয়।" },
          { title: "স্ক্যাম সচেতনতা", desc: "সাধারণ প্রতারণা সম্পর্কে আগে থেকেই জানিয়ে আপনাকে নিরাপদ রাখি।" },
          { title: "সৎ যোগাযোগ", desc: "ভুয়া প্রতিশ্রুতি নয়—বাস্তবসম্মত প্রত্যাশা ও কার্যকর গাইডলাইন।" },
          { title: "শুরু থেকে শেষ পর্যন্ত সহায়তা", desc: "প্রথম কল থেকে জাপানে পৌঁছানো পর্যন্ত পুরো পথে আমরা সাথে থাকি।" },
        ],
      },
      ja: {
        title: "なぜKNLTCを選ぶのか",
        desc: "私たちは単なるエージェントではなく、安全で確かな日本への道を支えるパートナーです。",
        points: [
          { title: "段階的なサポート", desc: "各ステップを丁寧に案内し、迷いなく進めます。" },
          { title: "明確で透明な流れ", desc: "現在地と次の行動が常に分かるようにサポートします。" },
          { title: "語学＋キャリア支援", desc: "語学力と就職準備をバランスよく強化します。" },
          { title: "詐欺対策の案内", desc: "よくあるトラブルや詐欺事例を共有し、被害を防ぎます。" },
          { title: "誠実なコミュニケーション", desc: "誇張はせず、現実的で実用的な提案を行います。" },
          { title: "一貫した伴走支援", desc: "初回相談から来日後まで、継続してサポートします。" },
        ],
      },
    },
    language,
  );

  return (
    <section id="about" className="section-padding bg-surface">
      <div className="container-narrow">
        <div className="mb-14 text-center">
          <h2 className="mb-4 text-3xl font-extrabold text-foreground md:text-4xl">{content.title}</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">{content.desc}</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {content.points.map((pt, i) => (
            <motion.div
              key={pt.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="flex gap-4"
            >
              <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-primary" />
              <div>
                <h3 className="mb-1 font-bold text-foreground">{pt.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{pt.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
