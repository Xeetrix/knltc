"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { translate } from "@/lib/i18n";

const TestimonialsSection = () => {
  const { language } = useLanguage();

  const content = translate(
    {
      en: {
        title: "Client Feedback",
        desc: "Here is how learners and applicants describe their experience with KNLTC.",
        testimonials: [
          {
            name: "Recent Applicant",
            role: "Work Program Candidate",
            quote: "The guidance process was clear from day one. I always knew what documents to prepare and what steps came next.",
            rating: 5,
          },
          {
            name: "Language Student",
            role: "JLPT Learner",
            quote: "Classes and consultation were practical and supportive. The team helped me stay confident with my Japan study plan.",
            rating: 5,
          },
          {
            name: "Career Candidate",
            role: "Interview Preparation",
            quote: "I appreciated the interview coaching and communication support. It made me better prepared for employer discussions.",
            rating: 5,
          },
        ],
      },
      bn: {
        title: "শিক্ষার্থী ও আবেদনকারীদের মতামত",
        desc: "KNLTC সম্পর্কে শিক্ষার্থী ও আবেদনকারীদের বাস্তব অভিজ্ঞতা।",
        testimonials: [
          {
            name: "সাম্প্রতিক আবেদনকারী",
            role: "ওয়ার্ক প্রোগ্রাম প্রার্থী",
            quote: "শুরুর দিন থেকেই পুরো গাইডলাইন ছিল পরিষ্কার। কোন কাগজ লাগবে আর পরের ধাপ কী—সবই স্পষ্টভাবে বুঝতে পেরেছি।",
            rating: 5,
          },
          {
            name: "ভাষা শিক্ষার্থী",
            role: "JLPT প্রস্তুতি",
            quote: "ক্লাস আর পরামর্শ ছিল খুবই বাস্তবভিত্তিক ও সহযোগিতাপূর্ণ। জাপানে পড়াশোনার পরিকল্পনায় আত্মবিশ্বাস পেয়েছি।",
            rating: 5,
          },
          {
            name: "ক্যারিয়ার প্রার্থী",
            role: "ইন্টারভিউ প্রস্তুতি",
            quote: "ইন্টারভিউ কোচিং ও কমিউনিকেশন সাপোর্ট আমার জন্য খুব উপকারী ছিল। নিয়োগকর্তার সাথে আলোচনায় ভালোভাবে প্রস্তুত হতে পেরেছি।",
            rating: 5,
          },
        ],
      },
      ja: {
        title: "受講生・応募者の声",
        desc: "KNLTCでの学習と応募サポートに関する体験談です。",
        testimonials: [
          {
            name: "最近の応募者",
            role: "就職プログラム候補者",
            quote: "初日から手続きの流れが明確でした。必要書類と次のステップが常に分かり安心できました。",
            rating: 5,
          },
          {
            name: "語学受講生",
            role: "JLPT学習者",
            quote: "授業と相談は実践的で丁寧でした。日本留学の計画にも自信を持てるようになりました。",
            rating: 5,
          },
          {
            name: "キャリア候補者",
            role: "面接対策",
            quote: "面接コーチングとコミュニケーション支援が役立ち、企業との面談にしっかり準備できました。",
            rating: 5,
          },
        ],
      },
    },
    language,
  );

  return (
    <section id="testimonials" className="section-padding">
      <div className="container-narrow">
        <div className="mb-14 text-center">
          <h2 className="mb-4 text-3xl font-extrabold text-foreground md:text-4xl">{content.title}</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">{content.desc}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {content.testimonials.map((item, i) => (
            <motion.div
              key={item.name + i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="rounded-lg border bg-card p-8 transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex gap-1">
                {Array.from({ length: item.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="mb-6 italic leading-relaxed text-foreground/80">"{item.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {item.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
