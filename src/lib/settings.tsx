import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Settings = {
  crt: boolean;
  sound: boolean;
  cursorFx: boolean;
  reduceMotion: boolean;
  bootSeen: boolean;
};

const DEFAULTS: Settings = {
  crt: true,
  sound: false, // sound MUST default to off
  cursorFx: true,
  reduceMotion: false,
  bootSeen: false,
};

const KEY = "sb.settings.v1";

type Ctx = Settings & {
  hydrated: boolean;
  set: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  toggle: (key: keyof Settings) => void;
};

const SettingsContext = createContext<Ctx | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Settings>(DEFAULTS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const parsed = raw ? (JSON.parse(raw) as Partial<Settings>) : {};
      setState({ ...DEFAULTS, reduceMotion: prefersReduced, ...parsed, sound: false });
    } catch {
      /* storage unavailable — keep defaults */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
    const root = document.documentElement;
    root.classList.toggle("crt-on", state.crt);
    root.classList.toggle("no-motion", state.reduceMotion);
    document.body.classList.toggle("cursor-hidden", state.cursorFx && !isTouch());
  }, [state, hydrated]);

  const set = useCallback<Ctx["set"]>((key, value) => {
    setState((s) => ({ ...s, [key]: value }));
  }, []);
  const toggle = useCallback((key: keyof Settings) => {
    setState((s) => ({ ...s, [key]: !s[key] }));
  }, []);

  const value = useMemo(
    () => ({ ...state, hydrated, set, toggle }),
    [state, hydrated, set, toggle],
  );
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used inside <SettingsProvider>");
  return ctx;
}

export function isTouch() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: none)").matches;
}
