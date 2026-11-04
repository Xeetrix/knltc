import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, QrCode, ShieldCheck, Sparkles } from "lucide-react";
import HeroCourseSection from "@/components/japanese-language/HeroCourseSection";
import TrustMetricsSection from "@/components/japanese-language/TrustMetricsSection";
import CoursePackagesSection from "@/components/japanese-language/CoursePackagesSection";
import BonusSection from "@/components/japanese-language/BonusSection";
import InteractiveLanguageLab from "@/components/japanese-language/InteractiveLanguageLab";
import HowItWorksSection from "@/components/japanese-language/HowItWorksSection";
import CurriculumFaqSection from "@/components/japanese-language/CurriculumFaqSection";

export const metadata: Metadata = {
  title:
    "Japanese Language Course (JFT Irodori, JLPT N5 & N4) | KNLTC Japan Gateway",
  description:
    "Learn Japanese language the easy way at KNLTC Dhaka & Khulna. 150-Hour immigration-certified preparation for JFT-Basic (Irodori) and JLPT/NAT N5 & N4 for both Student Visa and SSW Job Visa candidates.",
};

const CAMPAIGN_COURSES = [
  {
    slug: "jft-irodori",
    badge: "#1 Priority • Student & SSW",
    title: "JFT (Irodori)",
    duration: "3 Months • 150 Hours",
    accent: "border-[#1E5631] bg-emerald-50/40 text-[#1E5631]",
    btnClass: "bg-[#1E5631] hover:bg-emerald-900 text-white",
  },
  {
    slug: "jlpt-n5",
    badge: "Beginner Foundation",
    title: "JLPT N5",
    duration: "3 Months • 150 Hours",
    accent: "border-stone-200 bg-white text-slate-900",
    btnClass: "bg-slate-900 hover:bg-slate-800 text-white",
  },
  {
    slug: "jlpt-n4",
    badge: "Free for KNLTC COE Students",
    title: "JLPT N4",
    duration: "3 Months • 150 Hours",
    accent: "border-stone-200 bg-white text-slate-900",
    btnClass: "bg-slate-900 hover:bg-slate-800 text-white",
  },
  {
    slug: "n5-n4-combo",
    badge: "Zero-to-N4 Bundle",
    title: "JLPT N5 + N4 Together",
    duration: "6 Months • 300 Hours",
    accent: "border-[#b91c1c]/40 bg-red-50/20 text-[#b91c1c]",
    btnClass: "bg-[#b91c1c] hover:bg-red-800 text-white",
  },
];

export default function JapaneseLanguagePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* 1. Smart Executive Hero Section */}
      <HeroCourseSection />

      {/* 2. Institutional Accreditation & Senior Sensei Amir Hossen Spotlight */}
      <TrustMetricsSection />

      {/* 3. Interactive 4-Course Explorer & Live Database Pricing */}
      <CoursePackagesSection />

      {/* 4. Free Career Bonus Value (৳15,000 Free Inclusions) */}
      <BonusSection />

      {/* 5. Complete Minna No Nihongo & Irodori Interactive Learning Hub */}
      <InteractiveLanguageLab />

      {/* 6. Simple 3-Step Enrollment Workflow */}
      <HowItWorksSection />

      {/* 7. Minimal Direct Course Admission & Ad-Campaign Gateway */}
      <section
        id="enrollment-form"
        className="py-16 md:py-20 bg-[#fcfaf7] border-b border-stone-200 scroll-mt-16"
      >
        <div className="container-narrow max-w-5xl">
          <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-10 shadow-xs">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-stone-100">
              <div className="max-w-2xl space-y-2">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#b91c1c]">
                  <QrCode className="h-4 w-4" />
                  <span>Direct Course Admission & Bangla QR Checkout</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight leading-relaxed">
                  সিলেক্ট করুন আপনার কোর্স এবং সরাসরি পেমেন্ট ও ভর্তি সম্পন্ন করুন
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  প্রতিটি কোর্সের জন্য আলাদা ডেডিকেটেড এডমিশন পেইজ রয়েছে। এককালীন ফুল পেমেন্টে{" "}
                  <strong className="text-[#1E5631]">২০% ডিসকাউন্ট</strong> অথবা{" "}
                  <strong className="text-slate-900">৫০% ১ম কিস্তি</strong> সুবিধায় অফিশিয়াল বিকাশ Bangla QR স্ক্যান করে সাথে সাথেই ডিজিটাল মানি রিসিট বুঝে নিন।
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-[#1E5631] bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl shrink-0">
                <ShieldCheck className="h-4 w-4" />
                <span>Instant Digital Money Receipt & LMS ID</span>
              </div>
            </div>

            <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {CAMPAIGN_COURSES.map((c) => (
                <Link
                  key={c.slug}
                  href={`/japanese-language/enroll/${c.slug}`}
                  className={`group rounded-2xl border p-5 flex flex-col justify-between transition-all hover:shadow-md ${c.accent}`}
                >
                  <div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider opacity-85">
                      <Sparkles className="h-3 w-3" />
                      <span>{c.badge}</span>
                    </span>
                    <h3 className="mt-2 text-base font-extrabold text-slate-950 leading-relaxed">
                      {c.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      {c.duration}
                    </p>
                  </div>

                  <div
                    className={`mt-5 w-full rounded-xl py-2.5 px-3 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${c.btnClass}`}
                  >
                    <span>ভর্তি পেইজে যান</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. Essential FAQ & WhatsApp Counseling */}
      <CurriculumFaqSection />
    </main>
  );
}
