import { useState } from "react";
import { records, type Record_ } from "@/data/portfolio";
import { usePlayer } from "@/lib/player";
import { useSfx } from "@/lib/use-sfx";
import { cn } from "@/lib/utils";
import { ModalWindow } from "./modal-window";
import { SectionHeading, Sticker } from "./chrome";

function Vinyl({ spinning, className }: { spinning?: boolean; className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "rounded-full border border-border",
        spinning && "animate-spin-vinyl",
        className,
      )}
      style={{
        background:
          "repeating-radial-gradient(circle at 50% 50%, oklch(0.13 0 0) 0 2px, oklch(0.2 0 0) 2px 4px)",
      }}
    >
      <span className="absolute left-1/2 top-1/2 h-[26%] w-[26%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blood" />
      <span className="absolute left-1/2 top-1/2 h-[5%] w-[5%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-background" />
    </div>
  );
}

export function VinylWall() {
  const [open, setOpen] = useState<Record_ | null>(null);
  const sfx = useSfx();
  const player = usePlayer();

  return (
    <section id="vinyl" aria-labelledby="vinyl-h" className="mx-auto max-w-[1500px] px-4 py-14">
      <SectionHeading
        index="03"
        title="THE VINYL WALL"
        sub="physical media / rotate on hover / click to open the sleeve"
      />
      <span id="vinyl-h" className="sr-only">
        Vinyl collection
      </span>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {records.map((r, i) => (
          <button
            key={r.id}
            type="button"
            onMouseEnter={() => sfx("hover")}
            onClick={() => {
              sfx("insert");
              setOpen(r);
            }}
            className="group relative block text-left"
            style={{ transform: `rotate(${(i % 2 ? 1 : -1) * (0.6 + (i % 3) * 0.5)}deg)` }}
          >
            <div className="relative aspect-square">
              <div className="absolute inset-0 z-10 overflow-hidden border border-border shadow-[8px_8px_0_oklch(0_0_0/0.65)] transition-transform duration-300 group-hover:-translate-x-2 group-hover:-translate-y-1">
                <img
                  src={r.art}
                  alt={`${r.title} by ${r.artist}`}
                  loading="lazy"
                  width={640}
                  height={640}
                  className="h-full w-full object-cover transition duration-500 group-hover:saturate-150"
                />
                <span className="absolute inset-x-0 bottom-0 translate-y-full bg-[oklch(0_0_0/0.82)] px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-toxic transition-transform duration-300 group-hover:translate-y-0">
                  {r.genre} · {r.tracklist.length === 1 ? "SONG" : "SONGS"}
                </span>
              </div>
              <Vinyl
                spinning={false}
                className="absolute right-0 top-0 aspect-square h-full transition-transform duration-500 group-hover:translate-x-[34%] group-hover:rotate-[24deg]"
              />
            </div>
            <div className="mt-3 flex items-baseline justify-between gap-2">
              <span className="truncate font-cond text-lg uppercase leading-none text-bone">
                {r.title}
              </span>
              <span className="label-tiny shrink-0">{r.year}</span>
            </div>
            <span className="label-tiny">{r.artist}</span>
          </button>
        ))}
      </div>

      <ModalWindow
        open={!!open}
        onClose={() => setOpen(null)}
        wide
        title={open ? `RECORD_${open.id.toUpperCase()} — ${open.title}` : ""}
      >
        {open ? (
          <div className="grid gap-6 md:grid-cols-[1fr_1fr]">
            <div className="relative">
              <img
                src={open.art}
                alt={`${open.title} cover`}
                loading="lazy"
                width={640}
                height={640}
                className="relative z-10 aspect-square w-full border border-border object-cover"
              />
              <Vinyl
                spinning={player.isPlaying}
                className="absolute -right-6 top-6 aspect-square w-2/3 opacity-95"
              />
            </div>
            <div>
              <h3 className="chrome-text text-4xl">{open.title}</h3>
              <p className="label-tiny mt-1">
                {open.artist} · {open.year} · {open.genre}
              </p>
              <p className="mt-4 border-l-2 border-blood pl-3 font-mono text-xs leading-relaxed text-muted-foreground">
                “{open.note}”
              </p>
              <ol className="mt-4 divide-y divide-border/60 border border-border">
                {open.tracklist.map((t, i) => (
                  <li key={t} className="flex gap-3 px-3 py-1.5 font-mono text-[11px]">
                    <span className="text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                    <span className="uppercase">{t}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  className="btn-metal px-4 py-2 text-xs text-toxic"
                  onClick={() => {
                    sfx("crackle");
                    if (open.trackId) player.playTrack(open.trackId);
                  }}
                >
                  ▶ PLAY SIDE A
                </button>
                <Sticker tone="blood">AUTHENTIC CRACKLE INCLUDED</Sticker>
              </div>
            </div>
          </div>
        ) : null}
      </ModalWindow>
    </section>
  );
}
