import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SettingsProvider } from "@/lib/settings";
import { PlayerProvider } from "@/lib/player";
import { Nav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { CrtOverlay } from "@/components/site/crt-overlay";
import { CustomCursor } from "@/components/site/custom-cursor";
import { BootSequence } from "@/components/site/boot-sequence";
import { EasterEggs } from "@/components/site/easter-eggs";
import { IPodPlayer } from "@/components/site/ipod-player";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="panel-metal grain max-w-md p-8 text-center">
        <h1 className="chrome-text font-display text-7xl">404</h1>
        <h2 className="mt-3 font-cond text-xl uppercase text-bone">FILE NOT FOUND ON THIS DRIVE</h2>
        <p className="mt-2 font-mono text-xs text-muted-foreground">
          The page you're looking for was deleted, renamed, or never existed. Classic.
        </p>
        <Link to="/" className="btn-metal mt-6 inline-block px-4 py-2 text-xs text-toxic">
          ◂ RETURN HOME
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="panel-metal grain max-w-md p-8 text-center">
        <h1 className="chrome-text font-display text-4xl">GENERAL PROTECTION FAULT</h1>
        <p className="mt-2 font-mono text-xs text-muted-foreground">
          Something went wrong rendering this page.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="btn-metal px-4 py-2 text-xs text-toxic"
          >
            RETRY
          </button>
          <a href="/" className="btn-metal px-4 py-2 text-xs">
            GO HOME
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "STATIC//BLOODLINE" },
      { name: "description", content: "A handmade personal homepage from the underground." },
      { name: "author", content: "Ethan" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#0a0a0c" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "icon", href: "/favicon-96x96.png", type: "image/png", sizes: "96x96" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/site.webmanifest" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Pirata+One&family=Press+Start+2P&family=Share+Tech+Mono&family=Oswald:wght@300;400;600&family=Courier+Prime:wght@400;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <PlayerProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-[10001] focus:bg-blood focus:px-3 focus:py-2 focus:font-mono focus:text-xs"
          >
            SKIP TO CONTENT
          </a>
          <BootSequence />
          <CrtOverlay />
          <CustomCursor />
          <IPodPlayer />
          <Nav />
          <main id="main">
            <EasterEggs />
            <Outlet />
          </main>
          <Footer />
        </PlayerProvider>
      </SettingsProvider>
    </QueryClientProvider>
  );
}
