import { Link, useRouterState } from "@tanstack/react-router";
import { useSettings } from "@/lib/settings";
import { useSfx } from "@/lib/use-sfx";
import { cn } from "@/lib/utils";

const LINKS = [
  { to: "/", label: "HOME", key: "01" },
  { to: "/music", label: "MUSIC", key: "02" },
  { to: "/about", label: "ABOUT", key: "03" },
  { to: "/desktop", label: "DESKTOP", key: "04" },
] as const;

export function Nav() {
  const sfx = useSfx();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { crt, sound, cursorFx, reduceMotion, toggle } = useSettings();

  const toggles = [
    { label: "CRT", on: crt, key: "crt" as const },
    { label: "SND", on: sound, key: "sound" as const },
    { label: "CUR", on: cursorFx, key: "cursorFx" as const },
    { label: "MTN", on: !reduceMotion, key: "reduceMotion" as const },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-[color-mix(in_oklab,var(--panel-lo)_88%,transparent)] backdrop-blur-[2px]">
      <nav aria-label="Primary" className="mx-auto max-w-[1500px] px-3 py-2">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <Link
            to="/"
            className="group flex shrink-0 items-center gap-2"
            onClick={() => sfx("click")}
          >
            <span className="grid h-7 w-7 place-items-center border border-border bg-blood font-display text-lg text-bone shadow-[2px_2px_0_oklch(0_0_0/0.7)]">
              ✚
            </span>
            <span className="chrome-text font-display text-xl leading-none">STATIC//BLOODLINE</span>
          </Link>

          <ul className="order-3 flex w-full flex-wrap items-center gap-1 sm:order-2 sm:w-auto">
            {LINKS.map((l) => {
              const active = l.to === "/" ? path === "/" : path.startsWith(l.to);
              return (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    onMouseEnter={() => sfx("hover")}
                    onClick={() => sfx("click")}
                    className={cn(
                      "btn-metal group relative flex items-baseline gap-1.5 px-2.5 py-1.5 text-[10px] sm:text-[11px]",
                      active && "border-blood text-bone [filter:brightness(1.25)]",
                    )}
                  >
                    <span className="text-[8px] text-muted-foreground">{l.key}</span>
                    <span className={cn(active && "blood-text font-bold")}>{l.label}</span>
                    {active ? (
                      <span className="absolute -bottom-[3px] left-0 h-[2px] w-full bg-blood" />
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="order-2 ml-auto flex items-center gap-1 sm:order-3">
            {toggles.map((t) => (
              <button
                key={t.key}
                type="button"
                aria-pressed={t.on}
                onClick={() => {
                  toggle(t.key);
                  sfx("click");
                }}
                title={`Toggle ${t.label}`}
                className={cn(
                  "btn-metal px-2 py-1 text-[9px]",
                  t.on ? "text-toxic" : "text-muted-foreground line-through",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
