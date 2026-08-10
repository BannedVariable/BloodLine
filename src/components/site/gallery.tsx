import { useState } from "react";
import { galleryItems } from "@/data/portfolio";
import { useDraggable } from "@/lib/use-draggable";
import { useSfx } from "@/lib/use-sfx";
import { cn } from "@/lib/utils";
import { ModalWindow } from "./modal-window";
import { SectionHeading } from "./chrome";

type View = "grid" | "polaroid" | "scatter";

function ScatterItem({
  src,
  caption,
  seed,
  onOpen,
}: {
  src: string;
  caption: string;
  seed: number;
  onOpen: () => void;
}) {
  const { pos, dragging, dragProps } = useDraggable({
    x: (seed * 137) % 520,
    y: (seed * 91) % 260,
  });
  return (
    <figure
      data-cursor="drag"
      {...dragProps}
      style={{
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0) rotate(${((seed % 5) - 2) * 3}deg)`,
        zIndex: dragging ? 40 : 10 + (seed % 7),
      }}
      className="absolute w-44 touch-none select-none border border-border bg-bone p-2 pb-6 shadow-[8px_8px_0_oklch(0_0_0/0.6)]"
    >
      <img
        src={src}
        alt={caption}
        loading="lazy"
        width={800}
        height={600}
        onDoubleClick={onOpen}
        className="aspect-[4/3] w-full object-cover"
      />
      <figcaption className="absolute bottom-1 left-2 font-mono text-[9px] uppercase text-background">
        {caption}
      </figcaption>
    </figure>
  );
}

export function Gallery() {
  const [view, setView] = useState<View>("grid");
  const [open, setOpen] = useState<(typeof galleryItems)[number] | null>(null);
  const sfx = useSfx();

  return (
    <section id="gallery" className="mx-auto max-w-[1500px] px-4 py-14">
      <SectionHeading index="06" title="SCRAPBOOK" sub="images / screenshots / experiments" />

      <div className="mb-4 flex flex-wrap gap-2">
        {(["grid", "polaroid", "scatter"] as View[]).map((v) => (
          <button
            key={v}
            type="button"
            aria-pressed={view === v}
            onClick={() => {
              sfx("click");
              setView(v);
            }}
            className={cn(
              "btn-metal px-3 py-1.5 text-[10px]",
              view === v && "border-toxic text-toxic",
            )}
          >
            {v.toUpperCase()} VIEW
          </button>
        ))}
        <span className="label-tiny self-center">
          {view === "scatter" ? "DRAG THE PHOTOS · DOUBLE-CLICK TO ENLARGE" : "CLICK TO ENLARGE"}
        </span>
      </div>

      {view === "scatter" ? (
        <div className="dotted-grid relative h-[560px] overflow-hidden border border-border bg-panel-lo">
          {galleryItems.map((g, i) => (
            <ScatterItem
              key={g.id}
              src={g.src}
              caption={g.caption}
              seed={i + 3}
              onOpen={() => setOpen(g)}
            />
          ))}
        </div>
      ) : (
        <ul
          className={cn(
            "grid gap-4",
            view === "grid"
              ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
              : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
          )}
        >
          {galleryItems.map((g, i) => (
            <li key={g.id}>
              <button
                type="button"
                onClick={() => {
                  sfx("open");
                  setOpen(g);
                }}
                onMouseEnter={() => sfx("hover")}
                className={cn(
                  "hover-jitter block w-full text-left",
                  view === "polaroid" &&
                    "border border-border bg-bone p-2 pb-7 shadow-[6px_6px_0_oklch(0_0_0/0.6)]",
                )}
                style={
                  view === "polaroid"
                    ? { transform: `rotate(${((i % 5) - 2) * 1.6}deg)` }
                    : undefined
                }
              >
                <img
                  src={g.src}
                  alt={g.caption}
                  loading="lazy"
                  width={800}
                  height={600}
                  className={cn(
                    "aspect-[4/3] w-full object-cover",
                    view === "grid" && "border border-border grayscale-[0.25] hover:grayscale-0",
                  )}
                />
                <span
                  className={cn(
                    "mt-1 block font-mono text-[10px] uppercase",
                    view === "polaroid" ? "text-background" : "text-muted-foreground",
                  )}
                >
                  {g.caption} · {g.year}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <ModalWindow
        open={!!open}
        onClose={() => setOpen(null)}
        wide
        title={open ? `IMAGE_VIEWER — ${open.caption}` : ""}
      >
        {open ? (
          <figure>
            <img
              src={open.src}
              alt={open.caption}
              width={800}
              height={600}
              className="w-full border border-border object-contain"
            />
            <figcaption className="label-tiny mt-2">
              {open.caption} — CAPTURED {open.year}
            </figcaption>
          </figure>
        ) : null}
      </ModalWindow>
    </section>
  );
}
