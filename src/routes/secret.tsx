import { createFileRoute, Link } from "@tanstack/react-router";
import { usePlayer } from "@/lib/player";
import { Panel, Sticker } from "@/components/site/chrome";

export const Route = createFileRoute("/secret")({
  head: () => ({
    meta: [
      { title: "//////// — STATIC//BLOODLINE" },
      {
        name: "description",
        content: "You found the unlisted page. Nothing to see. Everything to hear.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "////////" },
      { property: "og:description", content: "An unlisted page." },
    ],
  }),
  component: SecretPage,
});

function SecretPage() {
  const { playTrack, unlockHidden } = usePlayer();
  return (
    <section className="mx-auto max-w-3xl px-4 py-20">
      <Panel className="scanlines p-8 text-center">
        <p className="label-tiny">UNLISTED / DIRECTORY INDEX DISABLED</p>
        <h1 className="chrome-text mt-3 font-display text-6xl">YOU FOUND IT</h1>
        <p className="mx-auto mt-4 max-w-md font-mono text-xs leading-relaxed text-muted-foreground">
          Nobody links here. If you're reading this you either typed the URL, read the source, or
          entered the konami code. All three are respectable.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            className="btn-metal px-4 py-2 text-xs text-toxic"
            onClick={() => {
              unlockHidden();
              playTrack("t5");
            }}
          >
            ▶ PLAY THE HIDDEN TRACK
          </button>
          <Link to="/" className="btn-metal px-4 py-2 text-xs">
            ◂ BACK TO THE SURFACE
          </Link>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-1.5">
          <Sticker tone="blood">SECRET SECTOR</Sticker>
          <Sticker>NOT INDEXED</Sticker>
          <Sticker tone="toxic">HELLO, FRIEND</Sticker>
        </div>
      </Panel>
    </section>
  );
}
