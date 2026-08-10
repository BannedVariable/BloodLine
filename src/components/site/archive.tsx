import { useState } from "react";
import { archiveItems } from "@/data/portfolio";
import { useSfx } from "@/lib/use-sfx";
import { cn } from "@/lib/utils";
import { ModalWindow } from "./modal-window";
import { Panel, SectionHeading } from "./chrome";

const TYPES = ["ALL", "SCREENSHOT", "WALLPAPER", "LOGO", "EXPERIMENT", "PHOTO"] as const;

export function Archive() {
  const [filter, setFilter] = useState<(typeof TYPES)[number]>("ALL");
  const [open, setOpen] = useState<(typeof archiveItems)[number] | null>(null);
  const sfx = useSfx();
  const list = archiveItems.filter((a) => filter === "ALL" || a.type === filter);

  return (
    <section id="archive" className="mx-auto max-w-[1500px] px-4 py-14">
      <SectionHeading
        index="04"
        title="THE ARCHIVE"
        sub="artifacts from a personal hard drive, 2002 — present"
      />

      <div className="mb-4 flex flex-wrap gap-1.5">
        {TYPES.map((t) => (
          <button
            key={t}
            type="button"
            aria-pressed={filter === t}
            onClick={() => {
              sfx("click");
              setFilter(t);
            }}
            className={cn(
              "btn-metal px-3 py-1 text-[10px]",
              filter === t && "border-toxic text-toxic",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <Panel className="p-8 text-center font-mono text-xs text-muted-foreground">
          NO FILES MATCH THIS FILTER. THE DRIVE IS QUIET.
        </Panel>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((a, i) => (
            <li key={a.id} style={{ transform: `rotate(${((i % 4) - 1.5) * 0.8}deg)` }}>
              <button
                type="button"
                onMouseEnter={() => sfx("hover")}
                onClick={() => {
                  sfx("open");
                  setOpen(a);
                }}
                className="hover-jitter panel-metal grain block w-full overflow-hidden text-left"
              >
                <div className="flex items-center justify-between border-b border-border px-2 py-1">
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-toxic">
                    {a.type}
                  </span>
                  <span className="font-mono text-[9px] text-muted-foreground">{a.year}</span>
                </div>
                <img
                  src={a.src}
                  alt={a.title}
                  loading="lazy"
                  width={800}
                  height={600}
                  className="aspect-[4/3] w-full object-cover opacity-90 contrast-125"
                />
                <div className="p-2">
                  <p className="truncate font-cond text-base uppercase text-bone">{a.title}</p>
                  <p className="label-tiny truncate">{a.note}</p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      <ModalWindow
        open={!!open}
        onClose={() => setOpen(null)}
        title={open ? `ARCHIVE — ${open.title}` : ""}
      >
        {open ? (
          <div className="grid gap-4 sm:grid-cols-[1.4fr_1fr]">
            <img
              src={open.src}
              alt={open.title}
              width={800}
              height={600}
              className="w-full border border-border object-cover"
            />
            <div>
              <h3 className="chrome-text text-3xl">{open.title}</h3>
              <p className="label-tiny mt-1">
                {open.type} · {open.year}
              </p>
              <p className="mt-3 font-mono text-xs leading-relaxed text-muted-foreground">
                {open.note}
              </p>
            </div>
          </div>
        ) : null}
      </ModalWindow>
    </section>
  );
}
