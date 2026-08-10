import { useSettings } from "@/lib/settings";

/** Global CRT / VHS overlay. Purely decorative, pointer-events: none. */
export function CrtOverlay() {
  const { crt } = useSettings();
  if (!crt) return null;
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[9998] overflow-hidden">
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background:
            "repeating-linear-gradient(0deg, oklch(0 0 0 / 0.38) 0 1px, transparent 1px 3px)",
        }}
      />
      <div
        className="absolute inset-0 mix-blend-screen opacity-[0.07]"
        style={{
          background:
            "linear-gradient(90deg, oklch(0.6 0.25 25) 0%, transparent 22%, transparent 78%, oklch(0.6 0.2 250) 100%)",
        }}
      />
      <div
        className="absolute inset-x-0 h-24 opacity-[0.06] animate-scan"
        style={{ background: "linear-gradient(180deg, transparent, white, transparent)" }}
      />
      <div
        className="absolute inset-0 animate-flicker"
        style={{
          boxShadow:
            "inset 0 0 140px 40px oklch(0 0 0 / 0.85), inset 0 0 30px 4px oklch(0 0 0 / 0.6)",
          borderRadius: "0px",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.12] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='140' height='140' filter='url(%23n)'/></svg>\")",
        }}
      />
    </div>
  );
}
