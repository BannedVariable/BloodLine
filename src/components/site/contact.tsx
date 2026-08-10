import { useEffect, useRef, useState } from "react";
import { socials } from "@/data/portfolio";
import { useSfx } from "@/lib/use-sfx";
import { Panel, SectionHeading, Sticker, Titlebar } from "./chrome";

type Phase = "idle" | "sending" | "done" | "error";

const STEPS = [
  "OPENING SOCKET...",
  "NEGOTIATING HANDSHAKE...",
  "ENCRYPTING PAYLOAD...",
  "UPLOADING 1 MESSAGE...",
  "AWAITING ACK...",
];

export function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [log, setLog] = useState<string[]>([]);
  const [err, setErr] = useState("");
  const timers = useRef<number[]>([]);
  const sfx = useSfx();

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !/^\S+@\S+\.\S+$/.test(email) || message.trim().length < 4) {
      setErr("INVALID INPUT — CHECK NAME, EMAIL AND MESSAGE.");
      setPhase("error");
      sfx("error");
      return;
    }
    setErr("");
    setPhase("sending");
    setLog([]);
    sfx("open");
    STEPS.forEach((s, i) => {
      timers.current.push(window.setTimeout(() => setLog((l) => [...l, s]), 380 * (i + 1)));
    });
    timers.current.push(
      window.setTimeout(
        () => {
          setPhase("done");
          sfx("notify");
        },
        380 * (STEPS.length + 1),
      ),
    );
  }

  const field =
    "w-full border border-border bg-background px-2 py-2 font-mono text-xs text-foreground outline-none focus:border-toxic";

  return (
    <section id="contact" className="mx-auto max-w-[1500px] px-4 py-14">
      <SectionHeading
        index="08"
        title="SEND_MESSAGE.EXE"
        sub="transmission terminal / replies within 48h"
      />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Panel className="overflow-hidden">
          <Titlebar title="SEND_MESSAGE.EXE — NEW TRANSMISSION" />
          {phase === "done" ? (
            <div className="scanlines grid min-h-[360px] place-content-center gap-3 p-6 text-center">
              <p className="chrome-text animate-glitch font-display text-4xl sm:text-5xl">
                MESSAGE TRANSMITTED
              </p>
              <p className="font-mono text-xs text-toxic">SUCCESSFULLY — ACK RECEIVED</p>
              <div className="mx-auto mt-2 h-px w-40 bg-blood" />
              <button
                type="button"
                className="btn-metal mx-auto mt-2 px-4 py-2 text-xs"
                onClick={() => {
                  setPhase("idle");
                  setName("");
                  setEmail("");
                  setMessage("");
                  setLog([]);
                  sfx("click");
                }}
              >
                NEW MESSAGE
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="grid gap-3 p-4">
              <div>
                <label className="label-tiny" htmlFor="c-name">
                  YOUR NAME
                </label>
                <input
                  id="c-name"
                  className={field}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={phase === "sending"}
                />
              </div>
              <div>
                <label className="label-tiny" htmlFor="c-mail">
                  EMAIL ADDRESS
                </label>
                <input
                  id="c-mail"
                  type="email"
                  className={field}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={phase === "sending"}
                />
              </div>
              <div>
                <label className="label-tiny" htmlFor="c-msg">
                  MESSAGE
                </label>
                <textarea
                  id="c-msg"
                  rows={6}
                  className={field}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={phase === "sending"}
                />
              </div>
              {err ? (
                <p role="alert" className="font-mono text-[11px] text-blood">
                  ⚠ {err}
                </p>
              ) : null}
              <button
                type="submit"
                disabled={phase === "sending"}
                className="btn-metal px-4 py-2 text-xs text-toxic disabled:opacity-60"
              >
                {phase === "sending" ? "TRANSMITTING..." : "TRANSMIT ▸"}
              </button>

              {phase === "sending" ? (
                <div className="panel-inset p-3 font-mono text-[11px] text-toxic">
                  {log.map((l) => (
                    <p key={l}>&gt; {l}</p>
                  ))}
                  <p className="animate-blink">&gt; █</p>
                </div>
              ) : null}
            </form>
          )}
        </Panel>

        <div className="space-y-4">
          <Panel className="p-4">
            <p className="label-tiny mb-2">DIRECT CHANNELS</p>
            <ul className="space-y-2">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    className="flex items-baseline justify-between border-b border-border/60 pb-1 font-mono text-xs hover:text-toxic"
                  >
                    <span>{s.label}</span>
                    <span className="text-muted-foreground">{s.note}</span>
                  </a>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel className="p-4">
            <p className="label-tiny mb-2">RESPONSE POLICY</p>
            <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">
              Messages here are stored nowhere — this terminal is a front-end demo. Wire it to your
              own inbox or backend when you're ready; the submit handler is a single function in{" "}
              <span className="text-toxic">contact.tsx</span>.
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <Sticker>NO SPAM</Sticker>
              <Sticker tone="toxic">NO NEWSLETTER</Sticker>
              <Sticker tone="blood">REPLIES GUARANTEED</Sticker>
            </div>
          </Panel>
        </div>
      </div>
    </section>
  );
}
