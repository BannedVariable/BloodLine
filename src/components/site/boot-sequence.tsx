import { useEffect, useRef, useState } from "react";
import { useSettings } from "@/lib/settings";
import { useSfx } from "@/lib/use-sfx";

const LINES = [
  "INITIALIZING PORTFOLIO...",
  "MOUNTING /dev/chrome...",
  "LOADING GRAPHICS...",
  "LOADING MUSIC...",
  "LOADING PROJECTS...",
  "CONNECTING TO INTERNET...",
  "WELCOME.",
];

export function BootSequence() {
  const { bootSeen, hydrated, set, reduceMotion } = useSettings();
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const skipRef = useRef<HTMLButtonElement>(null);
  const sfx = useSfx();

  useEffect(() => {
    if (!hydrated) return;
    if (bootSeen) return;
    setVisible(true);
    const t = window.setTimeout(() => skipRef.current?.focus(), 60);
    return () => window.clearTimeout(t);
  }, [hydrated, bootSeen]);

  useEffect(() => {
    if (!visible) return;
    if (reduceMotion) {
      finish();
      return;
    }
    const id = window.setInterval(() => {
      setProgress((p) => {
        const nextP = Math.min(100, p + 2 + Math.random() * 5);
        setStep(Math.min(LINES.length - 1, Math.floor((nextP / 100) * LINES.length)));
        if (nextP >= 100) {
          window.clearInterval(id);
          window.setTimeout(finish, 520);
        }
        return nextP;
      });
    }, 90);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, reduceMotion]);

  function finish() {
    setVisible(false);
    set("bootSeen", true);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Boot sequence"
      className="scanlines grain fixed inset-0 z-[10000] flex flex-col justify-between bg-background p-6 sm:p-10"
    >
      <div className="label-tiny flex justify-between">
        <span>STATIC//BLOODLINE BIOS v3.06</span>
        <span className="hidden sm:block">MEM OK — 640K</span>
      </div>

      <div className="mx-auto w-full max-w-2xl font-mono text-sm text-toxic">
        <ul className="space-y-1">
          {LINES.slice(0, step + 1).map((l, i) => (
            <li key={l} className="flex gap-3">
              <span className="text-muted-foreground">{String(i).padStart(2, "0")}</span>
              <span>{l}</span>
              <span className="ml-auto text-chrome">{i < step ? "[ OK ]" : "[ .. ]"}</span>
            </li>
          ))}
        </ul>
        <div className="panel-inset mt-6 h-5 p-[3px]">
          <div
            className="h-full bg-[linear-gradient(90deg,var(--blood),var(--toxic))] transition-[width] duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="label-tiny mt-2 flex justify-between">
          <span>{Math.floor(progress)}% COMPLETE</span>
          <span className="animate-blink">█</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="label-tiny max-w-[55%]">
          THIS ONLY PLAYS ONCE. YOUR PREFERENCE IS SAVED LOCALLY.
        </p>
        <button
          ref={skipRef}
          type="button"
          onClick={() => {
            sfx("click");
            finish();
          }}
          className="btn-metal px-5 py-2 text-xs"
        >
          SKIP ▸
        </button>
      </div>
    </div>
  );
}
