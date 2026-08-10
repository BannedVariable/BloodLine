import { useState } from "react";
import { projects, type Project } from "@/data/portfolio";
import { useDraggable } from "@/lib/use-draggable";
import { useSfx } from "@/lib/use-sfx";
import { cn } from "@/lib/utils";
import { ModalWindow } from "./modal-window";
import { SectionHeading, Sticker, Titlebar, WinButton } from "./chrome";

const ARTIFACT_LABEL: Record<Project["kind"], string> = {
  CD: "COMPACT DISC",
  CASSETTE: "CASSETTE TAPE",
  VHS: "VHS CASSETTE",
  POLAROID: "INSTANT PHOTO",
  FOLDER: "SYSTEM FOLDER",
  POSTER: "PRINTED POSTER",
};

function Artifact({ p, onOpen }: { p: Project; onOpen: () => void }) {
  const sfx = useSfx();
  const [flipped, setFlipped] = useState(false);
  const { pos, dragging, dragProps } = useDraggable({ x: 0, y: 0 });

  const shell = "relative border border-border bg-panel shadow-[10px_10px_0_oklch(0_0_0/0.6)]";

  return (
    <article
      data-cursor="drag"
      {...dragProps}
      style={{ transform: `translate3d(${pos.x}px, ${pos.y}px, 0)` }}
      className={cn("group touch-none select-none", dragging && "z-30 cursor-grabbing")}
    >
      <div className={cn(shell, "overflow-hidden")}>
        <Titlebar title={`${p.kind}_${p.id.toUpperCase()} — ${ARTIFACT_LABEL[p.kind]}`}>
          <WinButton label="Flip artifact" glyph="⟲" onClick={() => setFlipped((f) => !f)} />
          <WinButton label="Open project" glyph="□" onClick={onOpen} />
        </Titlebar>

        <div className="relative aspect-[4/3] overflow-hidden">
          {/* CD: disc slides out. VHS/CASSETTE: spool graphic. POLAROID: frame. */}
          <img
            src={p.image}
            alt={`${p.title} preview`}
            loading="lazy"
            width={960}
            height={640}
            className={cn(
              "h-full w-full object-cover transition-transform duration-500",
              !flipped && "group-hover:scale-105",
              flipped && "opacity-10 blur-[2px]",
            )}
          />
          {p.kind === "CD" && (
            <div
              aria-hidden
              className="absolute -right-16 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full border border-border transition-transform duration-500 group-hover:-translate-x-14"
              style={{
                background:
                  "conic-gradient(from 0deg, oklch(0.8 0.08 200), oklch(0.7 0.12 330), oklch(0.85 0.1 100), oklch(0.8 0.08 200))",
              }}
            >
              <span className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-background" />
            </div>
          )}
          {(p.kind === "VHS" || p.kind === "CASSETTE") && (
            <div
              aria-hidden
              className="absolute inset-x-6 bottom-4 flex items-center justify-between"
            >
              {[0, 1].map((i) => (
                <span
                  key={i}
                  className="h-10 w-10 rounded-full border-2 border-chrome/60 bg-panel-lo group-hover:animate-spin-vinyl"
                />
              ))}
            </div>
          )}
          {flipped && (
            <div className="absolute inset-0 grid content-center gap-2 p-4 font-mono text-[11px] text-muted-foreground">
              <p className="text-toxic">// SIDE B</p>
              <p className="leading-relaxed text-foreground">{p.description}</p>
              <p>TECH: {p.tech.join(" · ")}</p>
            </div>
          )}
          <span className="absolute left-2 top-2 sticker">{p.year}</span>
        </div>

        <div className="border-t border-border p-3">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="truncate font-cond text-xl uppercase leading-none text-bone">
              {p.title}
            </h3>
            <span
              className={cn(
                "label-tiny shrink-0",
                p.status === "SHIPPED" && "text-toxic",
                p.status === "IN PROGRESS" && "text-blood",
              )}
            >
              {p.status}
            </span>
          </div>
          <p className="label-tiny mt-1 truncate">{p.tech.join(" / ")}</p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              className="btn-metal px-3 py-1.5 text-[10px]"
              onClick={() => {
                sfx("open");
                onOpen();
              }}
            >
              OPEN ▸
            </button>
            <button
              type="button"
              className="btn-metal px-3 py-1.5 text-[10px]"
              onClick={() => {
                sfx("click");
                setFlipped((f) => !f);
              }}
            >
              FLIP ⟲
            </button>
          </div>
        </div>
      </div>
      <p className="label-tiny mt-1 opacity-0 transition-opacity group-hover:opacity-100">
        ↔ drag me around
      </p>
    </article>
  );
}

export function Projects({ limit }: { limit?: number }) {
  const [open, setOpen] = useState<Project | null>(null);
  const sfx = useSfx();
  const list = limit ? projects.slice(0, limit) : projects;

  return (
    <section id="work" aria-labelledby="work-h" className="mx-auto max-w-[1500px] px-4 py-14">
      <SectionHeading
        index="02"
        title="ARTIFACTS"
        sub="selected work / drag them / flip them / open them"
      />
      <span id="work-h" className="sr-only">
        Projects
      </span>

      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {list.map((p, i) => (
          <div key={p.id} style={{ transform: `rotate(${(i % 3) - 1}deg)` }}>
            <Artifact p={p} onOpen={() => setOpen(p)} />
          </div>
        ))}
      </div>

      <ModalWindow
        open={!!open}
        onClose={() => setOpen(null)}
        wide
        title={open ? `NETSCAPE — ${open.title.toLowerCase().replace(/\s+/g, "-")}.html` : ""}
      >
        {open ? (
          <div>
            <div className="panel-inset mb-4 flex items-center gap-2 px-2 py-1 font-mono text-[10px] text-muted-foreground">
              <span className="text-blood">◀ ▶ ⟳</span>
              <span className="truncate">
                http://staticbloodline.net/work/{open.id}/
                {open.title.toLowerCase().replace(/\s+/g, "-")}
              </span>
            </div>
            <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
              <img
                src={open.image}
                alt={`${open.title} full preview`}
                loading="lazy"
                width={960}
                height={640}
                className="w-full border border-border object-cover"
              />
              <div>
                <h3 className="chrome-text text-4xl">{open.title}</h3>
                <p className="label-tiny mt-1">
                  {ARTIFACT_LABEL[open.kind]} · {open.year} · {open.status}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-foreground">{open.description}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {open.tech.map((t) => (
                    <Sticker key={t}>{t}</Sticker>
                  ))}
                </div>
                <a
                  href={open.href}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => sfx("notify")}
                  className="btn-metal mt-5 inline-block px-4 py-2 text-xs text-toxic"
                >
                  VISIT SITE ▸
                </a>
              </div>
            </div>
          </div>
        ) : null}
      </ModalWindow>
    </section>
  );
}
