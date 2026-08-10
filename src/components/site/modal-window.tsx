import { useEffect, useRef, type ReactNode } from "react";
import { useSfx } from "@/lib/use-sfx";
import { Titlebar, WinButton } from "./chrome";

/** Accessible modal styled as an old application window. */
export function ModalWindow({
  open,
  onClose,
  title,
  children,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const sfx = useSfx();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9000] flex items-start justify-center overflow-y-auto bg-[oklch(0_0_0/0.78)] p-3 sm:p-8"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          sfx("close");
          onClose();
        }
      }}
    >
      <div
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`panel-metal grain my-auto w-full ${wide ? "max-w-5xl" : "max-w-3xl"} outline-none`}
      >
        <Titlebar title={title}>
          <WinButton
            label="Close"
            glyph="✕"
            onClick={() => {
              sfx("close");
              onClose();
            }}
          />
        </Titlebar>
        <div className="max-h-[80vh] overflow-y-auto p-4 sm:p-6">{children}</div>
      </div>
    </div>
  );
}
