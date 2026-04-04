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
    <Link href="/" className={cn("inline-flex items-center gap-3", className)} aria-label="KNLTC Home">
      <Image
        src="/brand/knltc-logo.svg"
        alt="KNLTC Logo"
        width={compact ? 38 : 46}
        height={compact ? 38 : 46}
        priority
        className={cn("rounded-md", inverse && "ring-1 ring-white/20")}
      />
      <span className="leading-tight">
        <span className={cn("block font-display text-xl font-semibold text-foreground", inverse && "text-white")}>KNLTC</span>
        {!compact && (
          <span className={cn("block text-xs text-muted-foreground", inverse && "text-white/70")}>
            Kurobe Nihongo Language Training Center
          </span>
        )}
      </span>
    </Link>
  );
}
