import { useEffect, useRef, useState } from "react";
import { isTouch, useSettings } from "@/lib/settings";

type Mode = "default" | "pointer" | "text" | "drag";

/** Custom cursor + light trail. One rAF loop, transform-only, no React state per frame. */
export function CustomCursor() {
  const { cursorFx, reduceMotion, hydrated } = useSettings();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<HTMLDivElement[]>([]);
  const [mode, setMode] = useState<Mode>("default");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(hydrated && cursorFx && !isTouch());
  }, [cursorFx, hydrated]);

  useEffect(() => {
    if (!enabled) return;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let rx = x;
    let ry = y;
    const trail = Array.from({ length: 6 }, () => ({ x, y }));
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      const el = e.target as HTMLElement | null;
      if (!el) return;
      if (el.closest("input,textarea,[contenteditable='true']")) setMode("text");
      else if (el.closest("[data-cursor='drag']")) setMode("drag");
      else if (el.closest("a,button,[role='button'],summary,label,select")) setMode("pointer");
      else setMode("default");
    };

    const loop = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${x}px,${y}px,0)`;
      if (ringRef.current) ringRef.current.style.transform = `translate3d(${rx}px,${ry}px,0)`;
      if (!reduceMotion) {
        let px = x;
        let py = y;
        for (let i = 0; i < trail.length; i++) {
          const t = trail[i]!;
          t.x += (px - t.x) * 0.35;
          t.y += (py - t.y) * 0.35;
          px = t.x;
          py = t.y;
          const node = trailRefs.current[i];
          if (node) node.style.transform = `translate3d(${t.x}px,${t.y}px,0)`;
        }
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [enabled, reduceMotion]);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[9999]">
      {!reduceMotion &&
        Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            ref={(n) => {
              if (n) trailRefs.current[i] = n;
            }}
            className="absolute -ml-[2px] -mt-[2px] h-1 w-1 bg-blood"
            style={{ opacity: 0.5 - i * 0.07 }}
          />
        ))}
      <div
        ref={ringRef}
        className="absolute -ml-4 -mt-4 h-8 w-8 border border-chrome transition-[width,height,border-color] duration-150"
        style={{
          borderRadius: mode === "pointer" ? "50%" : "0",
          borderColor: mode === "drag" ? "var(--toxic)" : undefined,
          transformOrigin: "center",
        }}
      >
        {mode !== "default" ? (
          <span className="absolute left-[34px] top-[26px] whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.2em] text-toxic">
            {mode === "pointer" ? "CLICK" : mode === "drag" ? "DRAG" : "TYPE"}
          </span>
        ) : null}
      </div>
      <div
        ref={dotRef}
        className="absolute -ml-[3px] -mt-[3px] h-1.5 w-1.5 bg-bone"
        style={{ boxShadow: "0 0 6px var(--blood)" }}
      />
    </div>
  );
}
