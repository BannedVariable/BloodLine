import { useEffect, useState } from "react";
import { usePlayer } from "@/lib/player";
import { useSettings } from "@/lib/settings";
import { useSfx } from "@/lib/use-sfx";

const CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

/** Konami code → unlocks the hidden track, flips CRT on, throws a fake BSOD. */
export function EasterEggs() {
  const [crash, setCrash] = useState(false);
  const { set } = useSettings();
  const { unlockHidden, playTrack } = usePlayer();
  const sfx = useSfx();

  useEffect(() => {
    let buf: string[] = [];
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      buf = [...buf, key].slice(-CODE.length);
      if (buf.join(",") !== CODE.join(",")) return;
      buf = [];
      unlockHidden();
      set("crt", true);
      setCrash(true);
      sfx("error");
      window.setTimeout(() => {
        setCrash(false);
        playTrack("t5");
      }, 2600);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [playTrack, set, sfx, unlockHidden]);

  if (!crash) return null;

  return (
    <div
      role="alert"
      className="fixed inset-0 z-[9997] grid place-content-center bg-[oklch(0.28_0.14_265)] p-8 font-mono text-sm text-bone"
    >
      <p className="mb-4 inline-block bg-bone px-3 py-1 font-bold text-[oklch(0.28_0.14_265)]">
        BLOODLINE/OS
      </p>
      <p className="max-w-xl leading-relaxed">
        A fatal exception 0E has occurred at 0028:C0011E36 in VXD VMM(01).
        <br />
        <br />
        The current application will be terminated. A HIDDEN TRACK has been recovered from the
        damaged sector and added to your playlist.
        <br />
        <br />
        Press any key to continue _
      </p>
      <p className="mt-6 animate-blink">█</p>
    </div>
  );
}
