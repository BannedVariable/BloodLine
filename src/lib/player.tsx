import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { tracks as allTracks, type Track } from "@/data/portfolio";
import { MusicEngine } from "./music-engine";

type PlayerCtx = {
  queue: Track[];
  current: Track;
  index: number;
  isPlaying: boolean;
  position: number;
  volume: number;
  shuffle: boolean;
  repeat: "off" | "all" | "one";
  hiddenUnlocked: boolean;
  playTrack: (id: string) => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  seek: (s: number) => void;
  setVolume: (v: number) => void;
  setShuffle: (v: boolean) => void;
  cycleRepeat: () => void;
  unlockHidden: () => void;
};

const Ctx = createContext<PlayerCtx | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const engineRef = useRef<MusicEngine | null>(null);
  const [hiddenUnlocked, setHiddenUnlocked] = useState(false);
  const [index, setIndex] = useState(0);
  const [isPlaying, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [volume, setVol] = useState(0.7);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<"off" | "all" | "one">("all");

  const queue = useMemo(
    () => allTracks.filter((t) => !t.hidden || hiddenUnlocked),
    [hiddenUnlocked],
  );
  const current = queue[Math.min(index, queue.length - 1)] ?? allTracks[0]!;

  const engine = () => {
    if (!engineRef.current) engineRef.current = new MusicEngine();
    return engineRef.current;
  };

  useEffect(() => () => engineRef.current?.stop(), []);

  const startAt = useCallback(
    (i: number, autoplay = true) => {
      const t = queue[i];
      if (!t) return;
      const e = engine();
      e.load(t, 0);
      e.setVolume(volume);
      setIndex(i);
      setPosition(0);
      if (autoplay) {
        e.play();
        setPlaying(true);
      } else {
        setPlaying(false);
      }
    },
    [queue, volume],
  );

  const next = useCallback(() => {
    const i = shuffle
      ? Math.floor(Math.random() * queue.length)
      : (index + 1) % Math.max(queue.length, 1);
    startAt(i);
  }, [index, queue.length, shuffle, startAt]);

  const prev = useCallback(() => {
    if (position > 4) {
      engine().seek(0);
      setPosition(0);
      return;
    }
    startAt((index - 1 + queue.length) % Math.max(queue.length, 1));
  }, [index, position, queue.length, startAt]);

  // position ticker + end-of-track handling
  useEffect(() => {
    if (!isPlaying) return;
    const id = window.setInterval(() => {
      const p = engine().position();
      if (p >= current.duration) {
        if (repeat === "one") {
          engine().seek(0);
          setPosition(0);
        } else if (repeat === "off" && index === queue.length - 1 && !shuffle) {
          engine().pause();
          setPlaying(false);
          setPosition(0);
        } else {
          next();
        }
        return;
      }
      setPosition(p);
    }, 250);
    return () => window.clearInterval(id);
  }, [isPlaying, current.duration, repeat, index, queue.length, shuffle, next]);

  const toggle = useCallback(() => {
    const e = engine();
    if (isPlaying) {
      e.pause();
      setPlaying(false);
    } else {
      const t = queue[index];
      if (t) e.load(t, position);
      e.setVolume(volume);
      e.play();
      setPlaying(true);
    }
  }, [isPlaying, index, position, queue, volume]);

  const value: PlayerCtx = {
    queue,
    current,
    index,
    isPlaying,
    position,
    volume,
    shuffle,
    repeat,
    hiddenUnlocked,
    playTrack: (id) => {
      const i = queue.findIndex((t) => t.id === id);
      if (i >= 0) startAt(i);
    },
    toggle,
    next,
    prev,
    seek: (s) => {
      engine().seek(s);
      setPosition(s);
    },
    setVolume: (v) => {
      setVol(v);
      engine().setVolume(v);
    },
    setShuffle,
    cycleRepeat: () => setRepeat((r) => (r === "off" ? "all" : r === "all" ? "one" : "off")),
    unlockHidden: () => setHiddenUnlocked(true),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePlayer() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePlayer must be used inside <PlayerProvider>");
  return ctx;
}

export function fmt(seconds: number) {
  const s = Math.max(0, Math.floor(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
