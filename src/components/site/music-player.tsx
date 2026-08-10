import { fmt, usePlayer } from "@/lib/player";
import { useSfx } from "@/lib/use-sfx";
import { cn } from "@/lib/utils";
import { Panel, Titlebar } from "./chrome";

export function Equalizer({ active, bars = 14 }: { active: boolean; bars?: number }) {
  return (
    <div aria-hidden className="flex h-8 items-end gap-[2px]">
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          className={cn("eq-bar w-[3px]", !active && "!animate-none")}
          style={{
            height: "100%",
            animationDelay: `${(i % 7) * 0.11}s`,
            animationDuration: `${0.65 + (i % 4) * 0.18}s`,
            transform: active ? undefined : "scaleY(0.12)",
          }}
        />
      ))}
    </div>
  );
}

export function MusicPlayer({ compact = false }: { compact?: boolean }) {
  const p = usePlayer();
  const sfx = useSfx();
  const pct = Math.min(100, (p.position / p.current.duration) * 100);

  const btn = (
    label: string,
    glyph: string,
    onClick: () => void,
    opts?: { active?: boolean; big?: boolean },
  ) => (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={() => {
        sfx("click");
        onClick();
      }}
      className={cn(
        "btn-metal grid place-items-center",
        opts?.big ? "h-12 w-14 text-xl" : "h-9 w-11 text-sm",
        opts?.active && "border-toxic text-toxic",
      )}
    >
      {glyph}
    </button>
  );

  return (
    <Panel className="overflow-hidden">
      <Titlebar title="MUSIC_PLAYER.EXE — [ NOW PLAYING ]">
        <span className="font-mono text-[9px] text-background">
          {p.isPlaying ? "▶ PLAY" : "❚❚ PAUSE"}
        </span>
      </Titlebar>

      <div className="grid gap-4 p-3 sm:p-4 md:grid-cols-[auto_1fr]">
        {/* artwork + spinning disc */}
        <div className="relative mx-auto w-[172px] shrink-0 sm:w-[196px]">
          <div
            className={cn(
              "absolute right-0 top-1/2 h-[150px] w-[150px] -translate-y-1/2 rounded-full border border-border transition-transform duration-500",
              p.isPlaying ? "translate-x-[46%] animate-spin-vinyl" : "translate-x-[14%]",
            )}
            style={{
              background:
                "repeating-radial-gradient(circle at 50% 50%, oklch(0.16 0 0) 0 2px, oklch(0.22 0 0) 2px 4px)",
            }}
          >
            <span className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blood" />
            <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-background" />
          </div>
          <img
            src={p.current.art}
            alt={`${p.current.album} artwork`}
            loading="lazy"
            width={196}
            height={196}
            className="relative z-10 aspect-square w-full border border-border object-cover shadow-[6px_6px_0_oklch(0_0_0/0.7)]"
          />
        </div>

        <div className="min-w-0">
          <div className="panel-inset mb-3 px-3 py-2">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-cond text-2xl uppercase leading-none text-bone">
                  {p.current.title}
                </p>
                <p className="label-tiny mt-1 truncate">
                  {p.current.artist} — {p.current.album}
                </p>
              </div>
              <Equalizer active={p.isPlaying} />
            </div>
          </div>

          {/* progress */}
          <label className="sr-only" htmlFor="seek">
            Seek
          </label>
          <div className="relative">
            <div className="panel-inset h-4 p-[2px]">
              <div
                className="h-full bg-[linear-gradient(90deg,var(--blood),var(--toxic))]"
                style={{ width: `${pct}%` }}
              />
            </div>
            <input
              id="seek"
              type="range"
              min={0}
              max={p.current.duration}
              step={1}
              value={Math.floor(p.position)}
              onChange={(e) => p.seek(Number(e.target.value))}
              className="absolute inset-0 h-4 w-full cursor-pointer opacity-0"
            />
          </div>
          <div className="label-tiny mt-1 flex justify-between">
            <span>{fmt(p.position)}</span>
            <span>-{fmt(p.current.duration - p.position)}</span>
          </div>

          {/* transport */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {btn("Previous track", "◀◀", p.prev)}
            {btn(p.isPlaying ? "Pause" : "Play", p.isPlaying ? "❚❚" : "▶", p.toggle, { big: true })}
            {btn("Next track", "▶▶", p.next)}
            {btn("Shuffle", "⤨", () => p.setShuffle(!p.shuffle), { active: p.shuffle })}
            {btn(`Repeat: ${p.repeat}`, p.repeat === "one" ? "↻1" : "↻", p.cycleRepeat, {
              active: p.repeat !== "off",
            })}
            <div className="ml-auto flex items-center gap-2">
              <span className="label-tiny">VOL</span>
              <input
                aria-label="Volume"
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={p.volume}
                onChange={(e) => p.setVolume(Number(e.target.value))}
                className="h-1 w-24 cursor-pointer appearance-none bg-panel-hi accent-blood"
              />
            </div>
          </div>
        </div>
      </div>

      {!compact && (
        <div className="border-t border-border">
          <p className="label-tiny px-3 py-2">PLAYLIST — {p.queue.length} TRACKS</p>
          <ul className="max-h-64 overflow-y-auto">
            {p.queue.map((t, i) => {
              const active = t.id === p.current.id;
              return (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => {
                      sfx("insert");
                      p.playTrack(t.id);
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 border-t border-border/60 px-3 py-2 text-left font-mono text-[11px] hover:bg-[color-mix(in_oklab,var(--blood)_18%,transparent)]",
                      active && "bg-[color-mix(in_oklab,var(--blood)_26%,transparent)] text-bone",
                    )}
                  >
                    <span className="w-6 text-muted-foreground">
                      {active && p.isPlaying ? "▶" : String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 truncate uppercase">{t.title}</span>
                    <span className="hidden truncate text-muted-foreground sm:block">
                      {t.artist}
                    </span>
                    <span className="text-muted-foreground">{fmt(t.duration)}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </Panel>
  );
}
