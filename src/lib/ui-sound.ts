/**
 * Tiny WebAudio UI sound engine — no audio files, no libraries.
 * Every sound is synthesised on demand, so it costs nothing until used.
 */

let ctx: AudioContext | null = null;
let master: GainNode | null = null;

function ac(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.18;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export type UiSound =
  "click" | "hover" | "open" | "close" | "insert" | "crackle" | "notify" | "error";

function blip(freq: number, dur: number, type: OscillatorType, gain = 0.6, slideTo?: number) {
  const c = ac();
  if (!c || !master) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, c.currentTime);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, c.currentTime + dur);
  g.gain.setValueAtTime(0.0001, c.currentTime);
  g.gain.exponentialRampToValueAtTime(gain, c.currentTime + 0.006);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
  o.connect(g).connect(master);
  o.start();
  o.stop(c.currentTime + dur + 0.02);
}

function noise(dur: number, gain = 0.25, hp = 800) {
  const c = ac();
  if (!c || !master) return;
  const frames = Math.floor(c.sampleRate * dur);
  const buf = c.createBuffer(1, frames, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < frames; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / frames);
  const src = c.createBufferSource();
  src.buffer = buf;
  const filt = c.createBiquadFilter();
  filt.type = "highpass";
  filt.frequency.value = hp;
  const g = c.createGain();
  g.gain.value = gain;
  src.connect(filt).connect(g).connect(master);
  src.start();
}

export function playUiSound(name: UiSound) {
  switch (name) {
    case "click":
      blip(880, 0.05, "square", 0.5, 420);
      break;
    case "hover":
      blip(1400, 0.03, "triangle", 0.16);
      break;
    case "open":
      blip(320, 0.14, "square", 0.4, 900);
      noise(0.06, 0.1, 1800);
      break;
    case "close":
      blip(760, 0.12, "square", 0.35, 180);
      break;
    case "insert":
      noise(0.35, 0.16, 500);
      blip(120, 0.4, "sawtooth", 0.2, 90);
      break;
    case "crackle":
      noise(0.9, 0.09, 2600);
      break;
    case "notify":
      blip(660, 0.08, "sine", 0.4);
      window.setTimeout(() => blip(990, 0.12, "sine", 0.4), 90);
      break;
    case "error":
      blip(180, 0.22, "square", 0.5);
      window.setTimeout(() => blip(140, 0.3, "square", 0.5), 140);
      break;
  }
}
