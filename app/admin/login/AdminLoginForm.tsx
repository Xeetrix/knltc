"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, ArrowRight, ShieldCheck, ArrowLeft } from "lucide-react";
import { getSystemAccounts } from "@/lib/knltc-cms-store";

export default function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const clientAccounts = getSystemAccounts();
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
          clientAccounts,
        }),
      });

      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(
          payload?.error ??
            "লগইন তথ্য সঠিক নয়। মেইন অ্যাডমিন থেকে প্রদত্ত ইমেইল ও পাসওয়ার্ড ব্যবহার করুন।",
        );
        return;
      }

      const destination =
        nextPath &&
        (nextPath.startsWith("/dashboard") ||
          nextPath.startsWith("/admin") ||
          nextPath.startsWith("/portal"))
          ? nextPath
          : "/dashboard";

      router.push(destination);
      router.refresh();
    } catch {
      setError("সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি। অনুগ্রহ করে পুনরায় চেষ্টা করুন।");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfaf7] py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
      <div className="w-full max-w-md">
        <div className="mb-5">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#b91c1c] transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>মূল ওয়েবসাইটে ফিরে যান</span>
          </Link>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-xl">
          <div className="flex items-center gap-3.5 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#b91c1c] text-white flex items-center justify-center font-black text-xl shadow-md">
              KN
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight leading-tight">
                KNLTC পোর্টাল লগইন
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                অ্যাডমিন ড্যাশবোর্ড থেকে প্রদত্ত লগইন ডিটেইলস দিয়ে প্রবেশ করুন
              </p>
            </div>
          </div>

          <form className="space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                ইমেইল অথবা ইউজার আইডি (Email / Login ID)
              </label>
              <div className="relative">
                <Mail className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  className="w-full rounded-xl border border-stone-300 pl-10 pr-3.5 py-2.5 text-sm focus:border-[#b91c1c] focus:outline-hidden focus:ring-1 focus:ring-[#b91c1c]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="আপনার নির্ধারিত ইমেইল বা আইডি লিখুন"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                পাসওয়ার্ড (Password)
              </label>
              <div className="relative">
                <Lock className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  className="w-full rounded-xl border border-stone-300 pl-10 pr-3.5 py-2.5 text-sm focus:border-[#b91c1c] focus:outline-hidden focus:ring-1 focus:ring-[#b91c1c]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-300 bg-red-50 p-3 text-xs text-red-700 font-semibold leading-relaxed">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#b91c1c] hover:bg-[#991b1b] py-3 text-sm font-bold text-white shadow-md transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>যাচাই করা হচ্ছে...</>
              ) : (
                <>
                  <span>লগইন করুন</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-stone-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>অ্যাডমিন নিয়ন্ত্রিত অ্যাক্সেস সিস্টেম</span>
            </span>
            <span>KNLTC Japan Gateway</span>
          </div>
        </div>
      </div>
    </div>
  );
}

