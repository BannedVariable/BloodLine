import { useEffect, useState } from "react";
import { badges, profile, socials, webring } from "@/data/portfolio";
import { Marquee, Sticker } from "./chrome";

export function Footer() {
  const [count, setCount] = useState<number | null>(null);
  const [now, setNow] = useState("");

  useEffect(() => {
    let visits = 0;
    try {
      visits = Number(localStorage.getItem("sb.visits") ?? "0") + 1;
      localStorage.setItem("sb.visits", String(visits));
    } catch {
      visits = 1;
    }
    setCount(profile.visitorBase + visits);
    const tick = () => setNow(new Date().toISOString().replace("T", " ").slice(0, 19));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <footer className="mt-20 border-t border-border bg-[color-mix(in_oklab,var(--panel-lo)_70%,transparent)]">
      <Marquee
        items={[
          "PHOTOSHOP 7",
          "SILENT HILL 2",
          "DEFTONES",
          "DESIGNERS REPUBLIC",
          "DEAD WEB ARCHAEOLOGY",
        ]}
        speed="slow"
        className="border-b border-border py-1 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground"
      />
      <div className="mx-auto grid max-w-[1500px] gap-8 px-4 py-10 md:grid-cols-4">
        <div>
          <p className="chrome-text font-display text-3xl">{profile.alias}</p>
          <p className="label-tiny mt-2">© 2026 {profile.name} — BUILT ON THE INTERNET</p>
          <p className="mt-3 font-mono text-[11px] text-muted-foreground">
            Hand-made HTML, no trackers, no cookies, no newsletter popup. Ever.
          </p>
        </div>

        <div>
          <p className="label-tiny mb-2">ELSEWHERE</p>
          <ul className="space-y-1">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  className="group inline-flex items-baseline gap-2 font-mono text-xs text-foreground hover:text-toxic"
                >
                  <span className="text-blood">▸</span>
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="label-tiny mb-2">VISITORS</p>
          <div className="panel-inset inline-flex items-center gap-1 px-2 py-1 font-mono text-sm text-toxic">
            {(count ?? profile.visitorBase)
              .toString()
              .padStart(8, "0")
              .split("")
              .map((d, i) => (
                <span key={i} className="border border-border bg-background px-1">
                  {d}
                </span>
              ))}
          </div>
        </div>

        <div>
          <p className="label-tiny mb-2">BADGES</p>
          <div className="flex flex-wrap gap-1.5">
            {badges.map((b) => (
              <Sticker key={b} tone={b === "NO TRACKING" ? "toxic" : "steel"}>
                {b}
              </Sticker>
            ))}
          </div>
        </div>
      </div>
      <p className="border-t border-border py-3 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        this page was made by a human · press ↑↑↓↓←→←→ if you know, you know
      </p>
    </footer>
  );
}
