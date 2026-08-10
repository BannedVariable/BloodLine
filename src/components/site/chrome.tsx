import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Panel({
  children,
  className,
  inset,
}: {
  children: ReactNode;
  className?: string;
  inset?: boolean;
}) {
  return (
    <div className={cn(inset ? "panel-inset" : "panel-metal", "grain relative", className)}>
      {children}
    </div>
  );
}

export function Titlebar({
  title,
  children,
  className,
}: {
  title: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "titlebar-metal flex select-none items-center justify-between gap-2 border-b border-border px-2 py-1",
        className,
      )}
    >
      <span className="truncate font-mono text-[11px] uppercase tracking-[0.2em] text-background">
        {title}
      </span>
      <div className="flex items-center gap-1">{children}</div>
    </div>
  );
}

export function WinButton({
  label,
  glyph,
  onClick,
}: {
  label: string;
  glyph: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      data-no-drag
      aria-label={label}
      onClick={onClick}
      className="btn-metal h-4 w-5 text-[9px] leading-none text-foreground"
    >
      {glyph}
    </button>
  );
}

export function Sticker({
  children,
  className,
  tone = "steel",
}: {
  children: ReactNode;
  className?: string;
  tone?: "steel" | "blood" | "toxic";
}) {
  return (
    <span
      className={cn(
        "sticker inline-block",
        tone === "blood" &&
          "border-blood text-bone [background:linear-gradient(180deg,var(--blood),var(--blood-deep))]",
        tone === "toxic" && "border-toxic text-toxic",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Marquee({
  items,
  className,
  speed = "normal",
}: {
  items: string[];
  className?: string;
  speed?: "normal" | "slow";
}) {
  const row = (
    <div className="flex shrink-0 items-center gap-8 pr-8">
      {items.map((t, i) => (
        <span key={i} className="flex items-center gap-8 whitespace-nowrap">
          <span>{t}</span>
          <span className="text-blood">✦</span>
        </span>
      ))}
    </div>
  );
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div
        className={cn("flex w-max", speed === "slow" ? "animate-marquee-slow" : "animate-marquee")}
      >
        {row}
        {row}
      </div>
    </div>
  );
}

export function SectionHeading({
  index,
  title,
  sub,
  className,
}: {
  index: string;
  title: string;
  sub?: string;
  className?: string;
}) {
  return (
    <header className={cn("mb-6 flex items-end gap-4", className)}>
      <span className="label-tiny mb-2 hidden shrink-0 sm:block">[{index}]</span>
      <div className="min-w-0">
        <h2 className="chrome-text text-5xl leading-none sm:text-6xl md:text-7xl">{title}</h2>
        {sub ? <p className="label-tiny mt-2">{sub}</p> : null}
      </div>
      <div
        aria-hidden
        className="dotted-grid mb-3 hidden h-6 flex-1 border-b border-border md:block"
      />
    </header>
  );
}

export function StatusDot({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-toxic">
      <span className="h-2 w-2 animate-blink rounded-full bg-toxic" />
      {label}
    </span>
  );
}
