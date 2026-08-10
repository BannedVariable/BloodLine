import { useEffect, useState, type ReactNode } from "react";
import { aboutBlocks, profile, skills } from "@/data/portfolio";
import { useDraggable } from "@/lib/use-draggable";
import { useSfx } from "@/lib/use-sfx";
import { cn } from "@/lib/utils";
import { MusicPlayer } from "./music-player";
import { Panel, Titlebar, WinButton } from "./chrome";
import { SkillBars } from "./about";

type WinId = "ABOUT_ME.EXE" | "MUSIC_PLAYER.EXE" | "SYSTEM_INFO.EXE" | "APPS.EXE";

const ORDER: WinId[] = [
  "ABOUT_ME.EXE",
  "MUSIC_PLAYER.EXE",
  "SYSTEM_INFO.EXE",
  "APPS.EXE",
];

function DeskWindow({
  id,
  title,
  initial,
  z,
  focus,
  onClose,
  children,
  width = 380,
}: {
  id: WinId;
  title: string;
  initial: { x: number; y: number };
  z: number;
  focus: () => void;
  onClose: () => void;
  children: ReactNode;
  width?: number;
}) {
  const { pos, dragProps } = useDraggable(initial);
  const [state, setState] = useState<"normal" | "min" | "max">("normal");
  const sfx = useSfx();

  return (
    <div
      onPointerDown={focus}
      style={
        state === "max"
          ? { zIndex: z, inset: 8, position: "absolute" }
          : {
              zIndex: z,
              position: "absolute",
              transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
              width,
              maxWidth: "calc(100% - 16px)",
            }
      }
      className="panel-metal grain touch-none"
      role="dialog"
      aria-label={title}
    >
      <div data-cursor="drag" {...dragProps}>
        <Titlebar title={title}>
          <WinButton
            label="Minimize"
            glyph="_"
            onClick={() => {
              sfx("click");
              setState((s) => (s === "min" ? "normal" : "min"));
            }}
          />
          <WinButton
            label="Maximize"
            glyph="□"
            onClick={() => {
              sfx("click");
              setState((s) => (s === "max" ? "normal" : "max"));
            }}
          />
          <WinButton
            label="Close"
            glyph="✕"
            onClick={() => {
              sfx("close");
              onClose();
            }}
          />
        </Titlebar>
      </div>
      {state !== "min" && (
        <div
          className={cn(
            "overflow-y-auto p-3 text-sm",
            state === "max" ? "max-h-[calc(100%-28px)]" : "max-h-[420px]",
          )}
        >
          {children}
        </div>
      )}
      <span className="sr-only">{id}</span>
    </div>
  );
}

export function DesktopSection() {
  const [openIds, setOpenIds] = useState<WinId[]>([
    "ABOUT_ME.EXE",
    "MUSIC_PLAYER.EXE",
  ]);
  const [zTop, setZTop] = useState(10);
  const [zMap, setZMap] = useState<Record<string, number>>({});
  const [clock, setClock] = useState("");
  const sfx = useSfx();

  useEffect(() => {
    const t = () =>
      setClock(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    t();
    const id = window.setInterval(t, 15000);
    return () => window.clearInterval(id);
  }, []);

  const focus = (id: WinId) => {
    setZTop((z) => z + 1);
    setZMap((m) => ({ ...m, [id]: zTop + 1 }));
  };
  const open = (id: WinId) => {
    sfx("open");
    setOpenIds((ids) => (ids.includes(id) ? ids : [...ids, id]));
    focus(id);
  };

  const content: Record<WinId, ReactNode> = {
    "ABOUT_ME.EXE": (
      <div className="space-y-2">
        <img
          src={profile.avatar}
          alt=""
          loading="lazy"
          width={120}
          height={120}
          className="float-left mr-3 w-24 border border-border grayscale-[0.4] contrast-125"
          style={{ imageRendering: "auto" }}
        />
        <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">
          {profile.bio[0]}
        </p>
        <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">
          {profile.bio[1]}
        </p>
      </div>
    ),
    "MUSIC_PLAYER.EXE": <MusicPlayer compact />,
    "SYSTEM_INFO.EXE": (
      <dl className="space-y-1 font-mono text-[11px]">
        {[
          ["OS", "BLOODLINE/OS 3.06"],
          ["CPU", "K6-2 500MHz (overclocked, unstable)"],
          ["MEM", "128MB SDRAM"],
          ["GFX", "VOODOO BANSHEE"],
          ["MODEM", "56K — CONNECTED"],
          ["UPTIME", "8,213 DAYS"],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between gap-3 border-b border-border/50 pb-1">
            <dt className="text-muted-foreground">{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
    ),
    "APPS.EXE": (
      <div className="space-y-3 text-[11px]">
        <div>
          <p className="label-tiny mb-1">GAMES</p>
          <div className="flex flex-wrap gap-1">
            {aboutBlocks.games.map((g) => (
              <span key={g} className="sticker text-center text-[10px]">{g}</span>
            ))}
          </div>
        </div>
        <div>
          <p className="label-tiny mb-1">MUSIC</p>
          <div className="flex flex-wrap gap-1">
            {aboutBlocks.music.slice(0, 6).map((m) => (
              <span key={m} className="sticker text-center text-[10px]">{m}</span>
            ))}
          </div>
        </div>
        <div>
          <p className="label-tiny mb-1">INTERESTS</p>
          <div className="flex flex-wrap gap-1">
            {aboutBlocks.interests.map((i) => (
              <span key={i} className="sticker text-center text-[10px]">{i}</span>
            ))}
          </div>
        </div>
      </div>
    ),
  };

  const initials: Record<WinId, { x: number; y: number }> = {
    "ABOUT_ME.EXE": { x: 24, y: 40 },
    "MUSIC_PLAYER.EXE": { x: 300, y: 120 },
    "SYSTEM_INFO.EXE": { x: 460, y: 300 },
    "APPS.EXE": { x: 200, y: 200 },
  };

  return (
    <section id="desktop" className="mx-auto max-w-[1500px] px-4 py-10">
      <Panel className="overflow-hidden">
        <Titlebar title="BLOODLINE/OS — DESKTOP">
          <span className="font-mono text-[9px] text-background">{clock}</span>
        </Titlebar>
        <div className="dotted-grid relative h-[620px] overflow-hidden bg-[radial-gradient(circle_at_30%_20%,color-mix(in_oklab,var(--blood)_18%,transparent),transparent_60%)]">
          {/* icons */}
          <ul className="absolute left-2 top-2 z-[5] grid gap-3">
            {ORDER.map((id) => (
              <li key={id}>
                <button
                  type="button"
                  onDoubleClick={() => open(id)}
                  onClick={() => open(id)}
                  className="group grid w-20 justify-items-center gap-1 p-1 text-center focus-visible:bg-blood/30"
                >
                  <span className="grid h-9 w-9 place-items-center border border-border bg-panel text-lg shadow-[3px_3px_0_oklch(0_0_0/0.7)] group-hover:border-toxic">
                    {id.endsWith(".TXT") ? "▤" : "▣"}
                  </span>
                  <span className="font-mono text-[8px] uppercase leading-tight text-bone">
                    {id}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          {openIds.map((id) => (
            <DeskWindow
              key={id}
              id={id}
              title={id}
              z={zMap[id] ?? 10}
              focus={() => focus(id)}
              onClose={() => setOpenIds((ids) => ids.filter((x) => x !== id))}
              initial={initials[id]}
              width={id === "MUSIC_PLAYER.EXE" ? 520 : 360}
            >
              {content[id]}
            </DeskWindow>
          ))}

          {/* taskbar */}
          <div className="titlebar-metal absolute inset-x-0 bottom-0 z-[100] flex items-center gap-2 border-t border-border px-2 py-1">
            <span className="btn-metal px-2 py-1 text-[10px]">START</span>
            <div className="flex flex-1 flex-wrap gap-1">
              {openIds.map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => focus(id)}
                  className="btn-metal px-2 py-0.5 text-[9px]"
                >
                  {id}
                </button>
              ))}
            </div>
            <span className="panel-inset px-2 py-0.5 font-mono text-[10px] text-toxic">
              {clock}
            </span>
          </div>
        </div>
      </Panel>
      <p className="label-tiny mt-2">
        DRAG WINDOWS BY THEIR TITLE BAR · DOUBLE-CLICK ICONS · MINIMIZE / MAXIMIZE / CLOSE ALL WORK
      </p>
    </section>
  );
}
