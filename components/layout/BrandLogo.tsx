import Image from "next/image";
import Link from "next/link";

export default function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="inline-flex items-center gap-3" aria-label="KNLTC Home">
      <Image
        src="/brand/knltc-logo.svg"
        alt="KNLTC Logo"
        width={compact ? 38 : 46}
        height={compact ? 38 : 46}
        priority
      />
      <span className="leading-tight">
        <span className="block font-display text-xl font-semibold text-foreground">KNLTC</span>
        {!compact && <span className="block text-xs text-muted-foreground">Japan Recruiting & Training</span>}
      </span>
    </Link>
  );
}
