import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  compact?: boolean;
  inverse?: boolean;
  subtitle?: string;
  badge?: string;
  href?: string;
  className?: string;
};

export default function BrandLogo({
  compact = false,
  inverse = false,
  subtitle = "Japan Gateway",
  badge,
  href = "/",
  className,
}: BrandLogoProps) {
  return (
    <Link
      href={href}
      className={cn("inline-flex min-w-0 items-center gap-2.5 sm:gap-3 group", className)}
      aria-label="KNLTC Japan Gateway Home"
    >
      <div
        className={cn(
          "relative shrink-0 overflow-hidden rounded-xl bg-white shadow-2xs ring-1 ring-slate-200/80",
          inverse && "bg-white/95 ring-white/25",
        )}
      >
        <Image
          src="/brand/knltc-logo.svg"
          alt="KNLTC Official Logo"
          width={compact ? 36 : 42}
          height={compact ? 36 : 42}
          priority
          referrerPolicy="no-referrer"
          className="transition-transform duration-200 group-hover:scale-105 object-contain"
        />
      </div>

      <div className="flex flex-col justify-center min-w-0">
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "font-bold tracking-tight text-slate-900 leading-none",
              compact ? "text-base sm:text-[17px]" : "text-lg sm:text-[19px]",
              inverse && "text-white",
            )}
          >
            KNLTC
          </span>
          {badge && (
            <span
              className={cn(
                "rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider leading-none",
                inverse
                  ? "bg-red-500/20 text-red-200 border border-red-400/30"
                  : "bg-red-50 text-[#b91c1c] border border-red-200/80",
              )}
            >
              {badge}
            </span>
          )}
        </div>
        <span
          className={cn(
            "text-[10px] font-semibold tracking-wider uppercase text-[#b91c1c] mt-1 leading-none truncate",
            inverse && "text-slate-300",
          )}
        >
          {subtitle}
        </span>
      </div>
    </Link>
  );
}
