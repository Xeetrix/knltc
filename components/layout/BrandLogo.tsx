import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  compact?: boolean;
  inverse?: boolean;
  className?: string;
};

export default function BrandLogo({ compact = false, inverse = false, className }: BrandLogoProps) {
  return (
    <Link href="/" className={cn("inline-flex min-w-0 items-center gap-2.5 sm:gap-3", className)} aria-label="KNLTC Home">
      <Image
        src="/brand/knltc-logo.svg"
        alt="KNLTC Logo"
        width={compact ? 34 : 44}
        height={compact ? 34 : 44}
        priority
        className={cn("rounded-md", inverse && "ring-1 ring-white/20")}
      />
      <span className={cn("block truncate font-display font-semibold text-foreground", compact ? "text-base sm:text-lg" : "text-lg sm:text-xl", inverse && "text-white")}>KNLTC</span>
    </Link>
  );
}
