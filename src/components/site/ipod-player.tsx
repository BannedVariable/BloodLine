import { useEffect, useState } from "react";
import { usePlayer, fmt } from "@/lib/player";
import { useDraggable } from "@/lib/use-draggable";
import { cn } from "@/lib/utils";

export function IPodPlayer() {
  const player = usePlayer();
  const [mounted, setMounted] = useState(false);
  const [seeking, setSeeking] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { pos, dragProps } = useDraggable(
    mounted
      ? { x: window.innerWidth - 380, y: window.innerHeight - 420 }
      : { x: 0, y: 0 }
  );

  if (!mounted) return null;

  // Only show when music is playing
  if (!player.isPlaying) return null;

  const pct = Math.min(100, (player.position / player.current.duration) * 100);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newPosition = percentage * player.current.duration;
    player.seek(newPosition);
  };

  return (
    <div
      style={{
        zIndex: 500,
        position: "fixed",
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
        width: 320,
      }}
      className="panel-metal grain touch-none"
    >
      {/* Header */}
      <div
        data-cursor="drag"
        {...dragProps}
        className="flex items-center justify-between px-3 py-2 border-b border-border"
      >
        <span className="font-mono text-[10px] text-toxic font-bold">iPOD PLAYER</span>
      </div>

      {/* Content */}
      <div className="p-3 space-y-3">
        {/* Album Art */}
        <div className="aspect-square w-full border-2 border-border overflow-hidden">
          <img
            src={player.current.art}
            alt={player.current.album}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="space-y-1">
          <p className="font-mono text-[11px] text-toxic font-bold truncate">
            {player.current.artist}
          </p>
          <p className="font-mono text-[10px] text-foreground truncate">
            {player.current.title}
          </p>
          <p className="font-mono text-[9px] text-muted-foreground truncate">
            {player.current.album}
          </p>
        </div>

        {/* Progress Bar - Interactive */}
        <div className="space-y-1">
          <div
            onClick={handleSeek}
            onMouseDown={() => setSeeking(true)}
            onMouseUp={() => setSeeking(false)}
            className="w-full bg-background border border-border h-2 overflow-hidden cursor-pointer hover:border-toxic transition-colors"
          >
            <div
              className="bg-blood h-full transition-all duration-100"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex justify-between font-mono text-[8px] text-muted-foreground">
            <span>{fmt(player.position)}</span>
            <span>{fmt(player.current.duration)}</span>
          </div>
        </div>

        {/* Volume Slider */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] text-muted-foreground">VOL</span>
            <span className="font-mono text-[9px] text-foreground">{Math.round(player.volume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={player.volume * 100}
            onChange={(e) => player.setVolume(Number(e.target.value) / 100)}
            title="Volume"
            className="volume-slider w-full h-2 bg-background border border-border cursor-pointer appearance-none"
            style={{
              backgroundImage: `linear-gradient(to right, var(--blood) 0%, var(--blood) ${player.volume * 100}%, var(--background) ${player.volume * 100}%, var(--background) 100%)`
            }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => player.prev()}
            className="btn-metal px-3 py-1 text-xs text-bone"
            title="Previous"
          >
            PREV
          </button>
          <button
            onClick={() => player.toggle()}
            className="btn-metal px-4 py-1 text-xs text-toxic font-bold"
            title={player.isPlaying ? "Pause" : "Play"}
          >
            {player.isPlaying ? "PAUSE" : "PLAY"}
          </button>
          <button
            onClick={() => player.next()}
            className="btn-metal px-3 py-1 text-xs text-bone"
            title="Next"
          >
            NEXT
          </button>
        </div>

        {/* Repeat/Shuffle */}
        <div className="flex gap-1">
          <button
            onClick={() => player.setShuffle(!player.shuffle)}
            className={cn(
              "flex-1 btn-metal px-2 py-1 text-[9px]",
              player.shuffle ? "text-toxic" : "text-muted-foreground"
            )}
            title="Shuffle"
          >
            SHUF: {player.shuffle ? "ON" : "OFF"}
          </button>
          <button
            onClick={() => player.cycleRepeat()}
            className={cn(
              "flex-1 btn-metal px-2 py-1 text-[9px]",
              player.repeat !== "off" ? "text-toxic" : "text-muted-foreground"
            )}
            title="Repeat"
          >
            RPT: {player.repeat.toUpperCase()}
          </button>
        </div>
      </div>
    </div>
  );
}
