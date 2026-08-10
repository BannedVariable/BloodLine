import { createFileRoute } from "@tanstack/react-router";
import { About } from "@/components/site/about";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "ABOUT — Profile of Ethan | STATIC//BLOODLINE" },
      {
        name: "description",
        content:
          "Biography, skill meters, favourite software, games, music and creative influences — a personal profile page in the old sense.",
      },
      { property: "og:title", content: "ABOUT — Profile of Ethan" },
      {
        property: "og:description",
        content: "Bio, skill meters, favourite software, games and influences.",
      },
    ],
  }),
  component: () => <About />,
});
