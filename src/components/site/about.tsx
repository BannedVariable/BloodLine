import { aboutBlocks, profile, skills } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import { Panel, SectionHeading, Sticker, StatusDot } from "./chrome";

export function SkillBars({ compact }: { compact?: boolean }) {
  return (
    <ul className={cn("space-y-2", compact && "space-y-1")}>
      {skills.map((s) => {
        const filled = Math.round(s.value / 10);
        return (
          <li key={s.label}>
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground">
                {s.label}
              </span>
              <span className="font-mono text-[10px] text-toxic">{s.value}%</span>
            </div>
            <div
              className="font-mono text-[13px] leading-none tracking-[-0.04em] text-blood"
              role="img"
              aria-label={`${s.label} ${s.value} percent`}
            >
              <span className="text-toxic">{"█".repeat(filled)}</span>
              <span className="text-muted-foreground/40">{"░".repeat(10 - filled)}</span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function ListCard({ title, items }: { title: string; items: string[] }) {
  return (
    <Panel className="p-3">
      <p className="label-tiny mb-2">{title}</p>
      <ul className="flex flex-wrap gap-1.5">
        {items.map((i) => (
          <li key={i}>
            <Sticker>{i}</Sticker>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

export function About() {
  return (
    <section id="about" className="mx-auto max-w-[1500px] px-4 py-14">
      <SectionHeading index="05" title="ABOUT / PROFILE" sub="a personal page, not a résumé" />

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="space-y-4">
          <Panel className="p-3">
            <img
              src={profile.avatar}
              alt={`${profile.name} avatar`}
              loading="lazy"
              width={512}
              height={512}
              className="w-full border border-border grayscale-[0.35] contrast-125"
            />
            <p className="mt-3 font-cond text-2xl uppercase leading-none text-bone">
              {profile.name}
            </p>
            <p className="label-tiny">{profile.handle}</p>
            <div className="mt-3 space-y-1 font-mono text-[11px] text-muted-foreground">
              <p>
                <StatusDot label={profile.status} />
              </p>
              <p>
                LOCATION: <span className="text-foreground">{profile.location}</span>
              </p>
              <p className="text-toxic">{profile.currentActivity}</p>
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel className="p-4 md:p-6">
            {profile.bio.map((b, i) => (
              <p
                key={i}
                className={cn(
                  "text-[15px] leading-relaxed text-foreground",
                  i > 0 && "mt-3",
                  i === 0 &&
                    "float-left mr-2 font-display text-6xl leading-[0.8] text-blood",
                )}
              >
                {b}
              </p>
            ))}
          </Panel>

          <div className="grid gap-4 sm:grid-cols-2">
            <ListCard title="FAVOURITE SOFTWARE" items={aboutBlocks.software} />
            <ListCard title="GAMES ON REPEAT" items={aboutBlocks.games} />
            <ListCard title="IN THE HEADPHONES" items={aboutBlocks.music} />
            <ListCard title="INTERESTS" items={aboutBlocks.interests} />
          </div>
        </div>
      </div>
    </section>
  );
}
