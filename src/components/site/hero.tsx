import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { profile, tickerItems } from "@/data/portfolio";
import { useSfx } from "@/lib/use-sfx";
import { cn } from "@/lib/utils";
import { Marquee, Panel, Sticker, StatusDot } from "./chrome";

function Word({ word }: { word: string }) {
  const [hot, setHot] = useState(false);
  return (
    <span
      onMouseEnter={() => setHot(true)}
      onAnimationEnd={() => setHot(false)}
      className={cn(
        "chrome-text inline-block transition-transform duration-200 hover:-translate-y-1 hover:rotate-[-1.5deg]",
        hot && "animate-glitch",
      )}
    >
      {word}
    </span>
  );
}

export function Hero() {
  const [clock, setClock] = useState("--:--:--");
  const [uptime, setUptime] = useState(0);
  const sfx = useSfx();

  useEffect(() => {
    const t = () => setClock(new Date().toLocaleTimeString([], { hour12: true, hour: "2-digit", minute: "2-digit", second: "2-digit" }).split(' ')[0]);
    t();
    const id = window.setInterval(() => {
      t();
      setUptime((u) => u + 1);
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="relative mx-auto max-w-[1500px] px-4 pt-8">
      {/* identity strip */}
      <div className="grid gap-4 lg:grid-cols-[300px_1fr_230px]">
        <Panel className="relative p-3">
          <span className="absolute -right-3 -top-3 rotate-12">
            <Sticker tone="blood">HANDMADE</Sticker>
          </span>
          <div className="relative">
            <img
              src={profile.avatar}
              alt={`${profile.name} profile picture`}
              width={512}
              height={512}
              className="w-full border border-border grayscale-[0.4] contrast-125"
              style={{ imageRendering: "auto", borderRadius: "0px" }}
            />
            <span className="absolute bottom-1 left-1 font-mono text-[9px] text-toxic">
              [ USER PHOTO ]
            </span>
          </div>
          <p className="mt-2 font-cond text-xl uppercase leading-none text-bone name-text">{profile.name}</p>
          <p className="label-tiny">{profile.handle}</p>
          <div className="mt-2 space-y-0.5 font-mono text-[10px] text-muted-foreground">
            <p>
              <StatusDot label={profile.status} />
            </p>
            <p className="text-toxic">{profile.currentActivity}</p>
            <p>{profile.location}</p>
            <p>
              LOCAL <span className="text-foreground">{clock}</span> · SESSION {uptime}s
            </p>
          </div>
        </Panel>

        <div className="min-w-0">
          <p className="label-tiny">[ PERSONAL HOMEPAGE — HANDMADE — NOT A LINKEDIN ]</p>
          <h1 className="mt-2 font-display text-[clamp(2.6rem,9vw,7.5rem)] leading-[0.86]">
            {profile.statement.map((w, i) => (
              <span key={w + i}>
                <Word word={w} />{" "}
              </span>
            ))}
          </h1>
          <p className="mt-3 max-w-xl font-mono text-xs leading-relaxed text-muted-foreground">
            {profile.subStatement} <span className="text-blood">{profile.tagline}</span>
          </p>

          <Marquee
            items={tickerItems}
            className="mt-5 border-y border-border py-2 font-mono text-[11px] uppercase tracking-[0.28em] text-bone"
          />

          <div className="mt-5 flex flex-wrap gap-2">
            <Link to="/music" onClick={() => sfx("click")} className="btn-metal px-4 py-2 text-xs">
              PLAY SOMETHING ♪
            </Link>
            <Link
              to="/desktop"
              onClick={() => sfx("click")}
              className="btn-metal px-4 py-2 text-xs"
            >
              OPEN DESKTOP ▣
            </Link>
          </div>
        </div>

        <div className="space-y-3">
          <Panel className="p-3">
            <p className="label-tiny mb-1">SYSTEM MONITOR</p>
            <ul className="space-y-1 font-mono text-[10px] text-muted-foreground">
              {[
                ["CPU", 38 + (uptime % 7)],
                ["MEM", 61 + (uptime % 5)],
                ["NET", 12 + (uptime % 11)],
                ["VIBE", 99],
              ].map(([k, v]) => (
                <li key={k as string} className="flex items-center gap-2">
                  <span className="w-8">{k}</span>
                  <span className="flex-1 text-toxic">
                    {"█".repeat(Math.round((v as number) / 10))}
                    <span className="text-muted-foreground/40">
                      {"░".repeat(10 - Math.round((v as number) / 10))}
                    </span>
                  </span>
                  <span>{v}%</span>
                </li>
              ))}
            </ul>
          </Panel>
          <div className="flex flex-wrap gap-1.5">
            <Sticker>BEST VIEWED IN 1024×768</Sticker>
            <Sticker tone="toxic">NO COOKIES</Sticker>
          </div>
        </div>
      </div>
    </section>
  );
}
