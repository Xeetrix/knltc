import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  compact?: boolean;
  inverse?: boolean;
  className?: string;
};

export default function BrandLogo({
  compact = false,
  inverse = false,
  className,
}: BrandLogoProps) {
  return (
    <Link
      href="/"
      className={cn("inline-flex min-w-0 items-center gap-2.5 sm:gap-3 group", className)}
      aria-label="KNLTC Japan Gateway Home"
    >
      <div className="relative shrink-0 overflow-hidden rounded-xl">
        <Image
          src="/brand/knltc-logo.svg"
          alt="KNLTC Logo"
          width={compact ? 36 : 42}
          height={compact ? 36 : 42}
          priority
          className={cn("transition-transform group-hover:scale-105", inverse && "ring-1 ring-white/20")}
        />
      </div>

      <div className="flex flex-col justify-center min-w-0">
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "font-extrabold tracking-tight text-slate-900 leading-none",
              compact ? "text-base sm:text-lg" : "text-lg sm:text-xl",
              inverse && "text-white",
            )}
          >
            KNLTC
          </span>
        </div>
        <span
          className={cn(
            "text-[10px] font-bold tracking-widest uppercase text-[#b91c1c] mt-0.5 leading-none",
            inverse && "text-red-300",
          )}
        >
          Japan Gateway
        </span>
      </div>
    </Link>
  );
}
