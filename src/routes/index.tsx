import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/site/hero";
import { MusicPlayer } from "@/components/site/music-player";
import { VinylWall } from "@/components/site/vinyl-wall";
import { SectionHeading } from "@/components/site/chrome";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "STATIC//BLOODLINE — Personal Site of Ethan" },
      {
        name: "description",
        content:
          "A handmade personal homepage with music, a vinyl wall, and a guestbook. No trackers.",
      },
      { property: "og:title", content: "STATIC//BLOODLINE — Personal Site of Ethan" },
      {
        property: "og:description",
        content: "Music, a vinyl wall and a personal space. Best with headphones.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Hero />
      <section className="mx-auto max-w-[1500px] px-4 py-14">
        <SectionHeading
          index="01"
          title="NOW PLAYING"
          sub="hardware player / synthesised demo tracks"
        />
        <MusicPlayer />
      </section>
      <VinylWall />
    </>
  );
}
