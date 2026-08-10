/** Synthesised music engine. Plays real audio files when a track has `src`,
 *  otherwise renders a generative demo piece with WebAudio so the player is
 *  never a fake. */
import type { Track } from "@/data/portfolio";

export class MusicEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private bass: OscillatorNode | null = null;
  private bassGain: GainNode | null = null;
  private hiss: AudioBufferSourceNode | null = null;
  private timer: number | null = null;
  private nextNoteTime = 0;
  private step = 0;
  private track: Track | null = null;
  private el: HTMLAudioElement | null = null;
  private startedAt = 0;
  private offset = 0;
  private playing = false;
  private vol = 0.7;

  private audio(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.vol * 0.35;
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
    return this.ctx;
  }

  get isPlaying() {
    return this.playing;
  }

  position(): number {
    if (this.el) return this.el.currentTime;
    if (!this.playing || !this.ctx) return this.offset;
    return this.offset + (this.ctx.currentTime - this.startedAt);
  }

  setVolume(v: number) {
    this.vol = v;
    if (this.master) this.master.gain.value = v * 0.35;
    if (this.el) this.el.volume = v;
  }

  load(track: Track, offset = 0) {
    this.stop();
    this.track = track;
    this.offset = offset;
  }

  play() {
    const t = this.track;
    if (!t || this.playing) return;
    if (t.src) {
      if (!this.el) {
        this.el = new Audio(t.src);
        this.el.preload = "none";
      }
      this.el.volume = this.vol;
      this.el.currentTime = this.offset;
      void this.el.play().catch(() => undefined);
      this.playing = true;
      return;
    }
    const c = this.audio();
    if (!c || !this.master) return;

    this.bass = c.createOscillator();
    this.bassGain = c.createGain();
    this.bass.type = "sine";
    this.bass.frequency.value = t.synth.root / 2;
    this.bassGain.gain.value = 0.0001;
    this.bassGain.gain.linearRampToValueAtTime(0.5, c.currentTime + 1.2);
    const lp = c.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 420;
    this.bass.connect(this.bassGain).connect(lp).connect(this.master);
    this.bass.start();

    // tape hiss bed
    const frames = Math.floor(c.sampleRate * 2);
    const buf = c.createBuffer(1, frames, c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < frames; i++) data[i] = (Math.random() * 2 - 1) * 0.5;
    this.hiss = c.createBufferSource();
    this.hiss.buffer = buf;
    this.hiss.loop = true;
    const hp = c.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 3200;
    const hg = c.createGain();
    hg.gain.value = 0.035;
    this.hiss.connect(hp).connect(hg).connect(this.master);
    this.hiss.start();

    this.startedAt = c.currentTime;
    this.nextNoteTime = c.currentTime + 0.08;
    this.step = 0;
    this.playing = true;
    this.timer = window.setInterval(() => this.schedule(), 90);
  }

  private schedule() {
    const c = this.ctx;
    const t = this.track;
    if (!c || !t || !this.master) return;
    const spb = 60 / t.synth.bpm / 2; // eighth notes
    while (this.nextNoteTime < c.currentTime + 0.35) {
      const s = this.step;
      const scale = t.synth.scale;
      const deg = scale[(s * 3) % scale.length] ?? 0;
      const oct = s % 8 === 0 ? 2 : s % 3 === 0 ? 1 : 0;
      const freq = t.synth.root * Math.pow(2, (deg + 12 * (1 + oct)) / 12);
      if (s % 2 === 0 || s % 7 === 3) this.pluck(freq, this.nextNoteTime, t.synth.wave);
      if (s % 8 === 0) this.hit(this.nextNoteTime, 90, 0.5);
      if (s % 8 === 4) this.hit(this.nextNoteTime, 180, 0.25);
      this.nextNoteTime += spb;
      this.step++;
    }
  }

  private pluck(freq: number, at: number, wave: OscillatorType) {
    const c = this.ctx;
    if (!c || !this.master) return;
    const o = c.createOscillator();
    const g = c.createGain();
    const f = c.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.setValueAtTime(2400, at);
    f.frequency.exponentialRampToValueAtTime(500, at + 0.5);
    o.type = wave;
    o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(0.16, at + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, at + 0.6);
    o.connect(f).connect(g).connect(this.master);
    o.start(at);
    o.stop(at + 0.65);
  }

  private hit(at: number, freq: number, gain: number) {
    const c = this.ctx;
    if (!c || !this.master) return;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(freq, at);
    o.frequency.exponentialRampToValueAtTime(40, at + 0.18);
    g.gain.setValueAtTime(gain * 0.7, at);
    g.gain.exponentialRampToValueAtTime(0.0001, at + 0.25);
    o.connect(g).connect(this.master);
    o.start(at);
    o.stop(at + 0.3);
  }

  pause() {
    if (!this.playing) return;
    this.offset = this.position();
    this.playing = false;
    if (this.el) {
      this.el.pause();
      return;
    }
    this.teardown();
  }

  seek(seconds: number) {
    const wasPlaying = this.playing;
    if (this.el) {
      this.el.currentTime = seconds;
      this.offset = seconds;
      return;
    }
    if (wasPlaying) this.teardown();
    this.offset = seconds;
    this.playing = false;
    if (wasPlaying) this.play();
  }

  stop() {
    this.playing = false;
    this.offset = 0;
    if (this.el) {
      this.el.pause();
      this.el.src = "";
      this.el = null;
    }
    this.teardown();
  }

  private teardown() {
    if (this.timer !== null) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
    try {
      this.bass?.stop();
      this.hiss?.stop();
    } catch {
      /* already stopped */
    }
    this.bass = null;
    this.hiss = null;
    this.bassGain = null;
  }
}
