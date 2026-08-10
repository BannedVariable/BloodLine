import { useCallback, useEffect, useRef, useState } from "react";

export type Pos = { x: number; y: number };

/** Pointer-based dragging that works with mouse, pen and touch. */
export function useDraggable(initial: Pos, opts?: { disabled?: boolean }) {
  const [pos, setPos] = useState<Pos>(initial);
  const [dragging, setDragging] = useState(false);
  const origin = useRef<{ px: number; py: number; ox: number; oy: number } | null>(null);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (opts?.disabled) return;
      const target = e.target as HTMLElement;
      if (target.closest("[data-no-drag]")) return;
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
      origin.current = { px: e.clientX, py: e.clientY, ox: pos.x, oy: pos.y };
      setDragging(true);
    },
    [opts?.disabled, pos.x, pos.y],
  );

  useEffect(() => {
    if (!dragging) return;
    const move = (e: PointerEvent) => {
      const o = origin.current;
      if (!o) return;
      setPos({ x: o.ox + (e.clientX - o.px), y: o.oy + (e.clientY - o.py) });
    };
    const up = () => {
      setDragging(false);
      origin.current = null;
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [dragging]);

  return { pos, setPos, dragging, dragProps: { onPointerDown } };
}
