import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CardProps {
  href: string;
  title: string;
  subtitle?: string;
  posterUrl: string;
  accent?: "marquee" | "frequency";
  className?: string;
}

/** Kartu media generik dipakai di katalog cinema & music. */
export function Card({ href, title, subtitle, posterUrl, accent = "marquee", className }: CardProps) {
  const ring = accent === "marquee" ? "hover:ring-marquee/60" : "hover:ring-frequency/60";
  return (
    <Link
      href={href}
      className={cn(
        "group block card-surface overflow-hidden ring-1 ring-transparent transition-all duration-200",
        ring,
        className
      )}
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-ink-soft">
        <Image
          src={posterUrl}
          alt={title}
          fill
          sizes="(max-width: 768px) 45vw, 200px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-3">
        <p className="truncate text-sm font-medium text-paper">{title}</p>
        {subtitle && <p className="truncate text-xs text-muted">{subtitle}</p>}
      </div>
    </Link>
  );
}
