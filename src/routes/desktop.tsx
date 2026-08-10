import { createFileRoute } from "@tanstack/react-router";
import { DesktopSection } from "@/components/site/desktop";

export const Route = createFileRoute("/desktop")({
  head: () => ({
    meta: [
      { title: "DESKTOP — BLOODLINE/OS | STATIC//BLOODLINE" },
      {
        name: "description",
        content:
          "A fake operating system desktop with draggable, minimizable and maximizable windows: about, notes, system info and the music player.",
      },
      { property: "og:title", content: "DESKTOP — BLOODLINE/OS" },
      {
        property: "og:description",
        content: "Draggable windows, icons and a taskbar in a fake late-90s operating system.",
      },
    ],
  }),
  component: () => <DesktopSection />,
});
