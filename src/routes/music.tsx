import { createFileRoute } from "@tanstack/react-router";
import { MusicPlayer } from "@/components/site/music-player";
import { VinylWall } from "@/components/site/vinyl-wall";
import { SectionHeading } from "@/components/site/chrome";

export const Route = createFileRoute("/music")({
  head: () => ({
    meta: [
      { title: "MUSIC — Player & Vinyl Wall | STATIC//BLOODLINE" },
      {
        name: "description",
        content:
          "A custom hardware-style music player with playlist, shuffle, repeat and equalizer, plus an interactive vinyl record collection.",
      },
      { property: "og:title", content: "MUSIC — Player & Vinyl Wall" },
      {
        property: "og:description",
        content: "Hardware-style player, playlist, and an interactive vinyl wall.",
      },
    ],
  }),
  component: MusicPage,
});

function MusicPage() {
  return (
    <>
      <section className="mx-auto max-w-[1500px] px-4 py-10">
        <SectionHeading
          index="01"
          title="THE PLAYER"
          sub="press play — every track is synthesised live in your browser"
        />
        <MusicPlayer />
      </section>
      <VinylWall />
    </>
  );
}
