import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="section-padding py-24 text-center">
      <div className="container-narrow max-w-md">
        <span className="inline-block rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
          404 Error
        </span>
        <h1 className="mt-4 mb-2 text-3xl font-extrabold text-foreground sm:text-4xl">
          Page Not Found
        </h1>
        <p className="text-sm text-slate-600 mb-1">
          পৃষ্ঠাটি পাওয়া যায়নি
        </p>
        <p className="text-xs text-slate-500 mb-6">
          ページが見つかりません
        </p>
        <p className="mb-8 text-sm text-muted-foreground leading-relaxed">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Button asChild className="bg-[#b91c1c] text-white hover:bg-red-800">
            <Link href="/">Return to Home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/japanese-language">Explore Courses</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
