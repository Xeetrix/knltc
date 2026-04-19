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
      <span className="min-w-0 leading-tight">
        <span className={cn("block truncate font-display text-lg font-semibold text-foreground sm:text-xl", inverse && "text-white")}>KNLTC</span>
        {!compact && (
          <span className={cn("hidden text-xs text-muted-foreground sm:block", inverse && "text-white/70")}>
            Kurobe Nihongo Language Training Center
          </span>
        )}
      </span>
    </Link>
  );
}
