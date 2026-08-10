import { useEffect, useState } from "react";
import { moods, seedGuestbook, type GuestEntry } from "@/data/portfolio";
import { useSfx } from "@/lib/use-sfx";
import { Panel, SectionHeading, Sticker } from "./chrome";

const KEY = "sb.guestbook.v1";

export function Guestbook() {
  const [entries, setEntries] = useState<GuestEntry[]>(seedGuestbook);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [mood, setMood] = useState(moods[0]!);
  const [error, setError] = useState("");
  const sfx = useSfx();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setEntries([...(JSON.parse(raw) as GuestEntry[]), ...seedGuestbook]);
    } catch {
      /* ignore */
    }
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      setError("NAME AND MESSAGE ARE REQUIRED.");
      sfx("error");
      return;
    }
    const entry: GuestEntry = {
      id: `gb-${Date.now()}`,
      name: name.trim().slice(0, 40),
      message: message.trim().slice(0, 400),
      website: website.trim() || undefined,
      mood,
      date: new Date().toISOString().slice(0, 10).replace(/-/g, "."),
    };
    const mine = entries.filter((x) => x.id.startsWith("gb-"));
    try {
      localStorage.setItem(KEY, JSON.stringify([entry, ...mine]));
    } catch {
      /* ignore */
    }
    setEntries([entry, ...entries]);
    setName("");
    setMessage("");
    setWebsite("");
    setError("");
    sfx("notify");
  }

  const field =
    "w-full border border-border bg-background px-2 py-1.5 font-mono text-xs text-foreground outline-none focus:border-toxic";

  return (
    <section id="guestbook" className="mx-auto max-w-[1500px] px-4 py-14">
      <SectionHeading
        index="07"
        title="GUESTBOOK"
        sub="sign it like it's 2004 — stored locally on your machine"
      />

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <Panel className="p-4">
          <form onSubmit={submit} className="space-y-3">
            <div>
              <label className="label-tiny" htmlFor="gb-name">
                NAME *
              </label>
              <input
                id="gb-name"
                className={field}
                value={name}
                maxLength={40}
                onChange={(e) => setName(e.target.value)}
                placeholder="xX_your_handle_Xx"
              />
            </div>
            <div>
              <label className="label-tiny" htmlFor="gb-site">
                WEBSITE
              </label>
              <input
                id="gb-site"
                className={field}
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="http://"
              />
            </div>
            <div>
              <label className="label-tiny" htmlFor="gb-mood">
                MOOD
              </label>
              <select
                id="gb-mood"
                className={field}
                value={mood}
                onChange={(e) => setMood(e.target.value)}
              >
                {moods.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-tiny" htmlFor="gb-msg">
                MESSAGE *
              </label>
              <textarea
                id="gb-msg"
                rows={4}
                maxLength={400}
                className={field}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="say something nice..."
              />
              <p className="label-tiny mt-1 text-right">{message.length}/400</p>
            </div>
            {error ? (
              <p role="alert" className="font-mono text-[11px] text-blood">
                ⚠ {error}
              </p>
            ) : null}
            <button type="submit" className="btn-metal w-full px-4 py-2 text-xs text-toxic">
              SIGN GUESTBOOK ▸
            </button>
          </form>
        </Panel>

        <div className="space-y-3">
          {entries.length === 0 ? (
            <Panel className="p-6 text-center font-mono text-xs text-muted-foreground">
              NO ENTRIES YET. BE THE FIRST GHOST IN THIS ROOM.
            </Panel>
          ) : (
            entries.map((e, i) => (
              <Panel key={e.id} className="p-3">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="font-cond text-lg uppercase leading-none text-bone">
                    {e.name}
                  </span>
                  {e.website ? (
                    <a
                      href={e.website}
                      className="font-mono text-[10px] text-toxic underline decoration-dotted"
                      rel="noreferrer nofollow"
                      target="_blank"
                    >
                      {e.website.replace(/^https?:\/\//, "")}
                    </a>
                  ) : null}
                  <span className="label-tiny ml-auto">
                    #{String(entries.length - i).padStart(3, "0")} · {e.date}
                  </span>
                </div>
                <p className="mt-2 font-mono text-xs leading-relaxed text-foreground">
                  {e.message}
                </p>
                <div className="mt-2">
                  <Sticker tone="blood">MOOD: {e.mood}</Sticker>
                </div>
              </Panel>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
