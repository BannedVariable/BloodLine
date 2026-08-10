/**
 * ============================================================
 *  EDIT EVERYTHING HERE.
 *  This single file drives the whole site: identity, music,
 *  vinyl, projects, gallery, archive, guestbook, footer.
 *  Swap the imported images in /src/assets and the strings below.
 * ============================================================
 */

import avatarImg from "@/assets/avatar.jpg";
import tune1 from "@/assets/album-1.jpg";
import tune2 from "@/assets/album-2.jpg";
import tune3 from "@/assets/album-3.jpg";
import tune4 from "@/assets/album-4.jpg";
import tune5 from "@/assets/Song-5.jpg";
import tune6 from "@/assets/Song-6.jpg";
import tune7 from "@/assets/Song-7.jpg";
import tune8 from "@/assets/Song8.jpg";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";

export const profile = {
  alias: "STATIC//BLOODLINE",
  name: "ETHAN",
  handle: "@staticbloodline",
  tagline: "designer · software engineer",
  statement: ["DESIGNER", "SOFTWARE", "ENGINEER"],
  subStatement: "no algorithm sent you here. you found this on purpose.",
  status: "OFFLINE",
  currentActivity: "CURRENTLY SLEEPING",
  location: "INDIANA / EST",
  mood: "nocturnal",
  avatar: avatarImg,
  siteVersion: "v3.06",
  lastUpdated: "2026.08.10",
  visitorBase: 2847,
  bio: [
    "I'm",
    "Ethan, born September 2, 2007. I do a lot of Graphic, Web, UI/UX Design and Software Engineering in my free time. I'm from Indiana — worst fucking state, don't move here, YUP that's pretty much it.",
    "Explore the rest of the site, dickhead!",
  ],
  randomFacts: [
    "Owns 4 non-functional CRT monitors.",
    "Types on a keyboard from 1998.",
    "Has never closed a browser tab willingly.",
    "Ripped 900 CDs and lost the hard drive.",
    "Still reads printed manuals.",
  ],
};

export const socials = [
  { label: "SNAPCHAT", href: "https://snapchat.com/t/URe1xenq" },
  { label: "TIKTOK", href: "https://www.tiktok.com/@staticbloodline" },
  { label: "INSTAGRAM", href: "https://www.instagram.com/staticbloodline/?hl=en" },
];

export const tickerItems = [
  "HANDMADE",
  "DESIGNER",
  "SOFTWARE ENGINEER",
];

export const skills = [
  { label: "GRAPHIC DESIGN", value: 95 },
  { label: "FRONT-END", value: 92 },
  { label: "TYPOGRAPHY", value: 88 },
  { label: "MOTION", value: 78 },
  { label: "SOUND DESIGN", value: 64 },
  { label: "3D / RENDER", value: 55 },
];

export const aboutBlocks = {
  software: ["VS Code 2022", "Photoshop", "Blender", "Figma", "Kiro"],
  games: ["CS2", "Destiny 2", "Breakpoint Ghost Recon", "Forza", "Assetto Corsa"],
  music: ["Ghostemane", "Bones", "Tool", "A Perfect Circle", "ZillaKami", "The Flat Stanleys", "Falling In Reverse", "Slipknot", "Limp Bizkit", "Corpse Pile", "Peeling Flesh", "Snuffed On Sight", "Bodybox", "Alexisonfire", "Motionless In White", "Linkin Park"],
  influences: ["Designers Republic", "Vaughan Oliver", "Cold Storage", "Geocities", "Winamp skins"],
  interests: ["Guns", "Designing", "Cars", "Programming"],
  currentProjects: ["A record label site", "This page (forever)", "A cassette compilation"],
};

/* ---------------- MUSIC ----------------
 * Each track can point at a real audio file:
 *   src: "/audio/my-track.mp3"
 * If `src` is omitted, the built-in synth engine renders a
 * demo tone-piece using `synth`, so the player always works.
 */
export type Track = {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // seconds
  art: string;
  src?: string;
  hidden?: boolean;
  synth: { root: number; scale: number[]; bpm: number; wave: OscillatorType };
};

export const tracks: Track[] = [
  {
    id: "t1",
    title: "SCHISM",
    artist: "TOOL",
    album: "SCHISM",
    duration: 442,
    art: tune1,
    src: "/audio/tool-schism.mp3",
    synth: { root: 55, scale: [0, 3, 5, 7, 10], bpm: 82, wave: "sawtooth" },
  },
  {
    id: "t2",
    title: "THE NOOSE",
    artist: "A PERFECT CIRCLE",
    album: "THE NOOSE",
    duration: 237,
    art: tune2,
    src: "/audio/the-noose.mp3",
    synth: { root: 49, scale: [0, 2, 3, 7, 8], bpm: 96, wave: "square" },
  },
  {
    id: "t3",
    title: "THE DRUG IN ME IS YOU",
    artist: "FALLING IN REVERSE",
    album: "THE DRUG IN ME IS YOU",
    duration: 220,
    art: tune3,
    src: "/audio/the-drug-in-me-is-you.mp3",
    synth: { root: 44, scale: [0, 3, 7, 10, 12], bpm: 70, wave: "triangle" },
  },
  {
    id: "t4",
    title: "REALITY",
    artist: "LOST FREQUENCIES",
    album: "REALITY",
    duration: 265,
    art: tune4,
    src: "/audio/reality.mp3",
    synth: { root: 62, scale: [0, 1, 5, 6, 10], bpm: 128, wave: "sawtooth" },
  },
  {
    id: "t5",
    title: "NUMB",
    artist: "LINKIN PARK",
    album: "NUMB",
    duration: 187,
    art: tune5,
    src: "/audio/so-numb.mp3",
    synth: { root: 57, scale: [0, 3, 5, 7, 10], bpm: 95, wave: "square" },
  },
  {
    id: "t6",
    title: "FROM THE INSIDE",
    artist: "LINKIN PARK",
    album: "FROM THE INSIDE",
    duration: 208,
    art: tune6,
    src: "/audio/from-the-inside.mp3",
    synth: { root: 51, scale: [0, 2, 4, 7, 9], bpm: 88, wave: "triangle" },
  },
  {
    id: "t7",
    title: "SUCH SMALL HANDS",
    artist: "SNOW PATROL",
    album: "SUCH SMALL HANDS",
    duration: 215,
    art: tune7,
    src: "/audio/such-small-hands.mp3",
    synth: { root: 53, scale: [0, 3, 5, 7, 10], bpm: 92, wave: "sine" },
  },
  {
    id: "t8",
    title: "IF YOU CAN'T HANG",
    artist: "SLEEPING WITH SIRENS",
    album: "IF YOU CAN'T HANG",
    duration: 226,
    art: tune8,
    src: "/audio/if-you-cant-hang.mp3",
    synth: { root: 55, scale: [0, 3, 5, 7, 10], bpm: 100, wave: "sawtooth" },
  },
];

export type Record_ = {
  id: string;
  title: string;
  artist: string;
  year: number;
  genre: string;
  art: string;
  note: string;
  tracklist: string[];
  trackId?: string;
};

export const records: Record_[] = [
  {
    id: "r1",
    title: "SCHISM",
    artist: "TOOL",
    year: 2001,
    genre: "ALTERNATIVE ROCK",
    art: tune1,
    note: "Complex polyrhythmic exploration of psychological duality from the 2001 masterpiece Lateralus.",
    tracklist: ["SCHISM"],
    trackId: "t1",
  },
  {
    id: "r2",
    title: "THE NOOSE",
    artist: "A PERFECT CIRCLE",
    year: 2003,
    genre: "ALTERNATIVE ROCK",
    art: tune2,
    note: "Haunting meditation on despair and breaking free from constraints. Ethereal and devastating.",
    tracklist: ["THE NOOSE"],
    trackId: "t2",
  },
  {
    id: "r3",
    title: "THE DRUG IN ME IS YOU",
    artist: "FALLING IN REVERSE",
    year: 2011,
    genre: "ALTERNATIVE METAL",
    art: tune3,
    note: "Raw chaotic exploration of addiction and obsession. Screamed vocals over crushing riffs.",
    tracklist: ["THE DRUG IN ME IS YOU"],
    trackId: "t3",
  },
  {
    id: "r4",
    title: "REALITY",
    artist: "LOST FREQUENCIES",
    year: 2019,
    genre: "DEATH METAL",
    art: tune4,
    note: "Hypnotic electronic journey through ambient soundscapes and infectious rhythmic pulses.",
    tracklist: ["REALITY"],
    trackId: "t4",
  },
  {
    id: "r5",
    title: "NUMB",
    artist: "LINKIN PARK",
    year: 2002,
    genre: "NU METAL",
    art: tune5,
    note: "Introspective exploration of emotional numbness and detachment with powerful guitar-driven intensity.",
    tracklist: ["NUMB"],
    trackId: "t5",
  },
  {
    id: "r6",
    title: "FROM THE INSIDE",
    artist: "LINKIN PARK",
    year: 2002,
    genre: "NU METAL",
    art: tune6,
    note: "Intense collaboration exploring inner turmoil and psychological depth with aggressive instrumentation.",
    tracklist: ["FROM THE INSIDE"],
    trackId: "t6",
  },
  {
    id: "r7",
    title: "SUCH SMALL HANDS",
    artist: "SNOW PATROL",
    year: 2004,
    genre: "ALTERNATIVE ROCK",
    art: tune7,
    note: "Haunting indie rock anthem about vulnerability and intimate connection with atmospheric melodies.",
    tracklist: ["SUCH SMALL HANDS"],
    trackId: "t7",
  },
  {
    id: "r8",
    title: "IF YOU CAN'T HANG",
    artist: "SLEEPING WITH SIRENS",
    year: 2010,
    genre: "POP PUNK",
    art: tune8,
    note: "Energetic pop punk anthem about resilience and determination with catchy vocal hooks.",
    tracklist: ["IF YOU CAN'T HANG"],
    trackId: "t8",
  },
];

/* ---------------- GUESTBOOK ---------------- */
export type GuestEntry = {
  id: string;
  name: string;
  message: string;
  website?: string | undefined;
  mood: string;
  date: string;
};

export const seedGuestbook: GuestEntry[] = [
  {
    id: "gb1",
    name: "xX_dial_up_Xx",
    message: "found this from a webring at 4am. site rules. adding you to my links page!!",
    website: "http://example.com/~dialup",
    mood: "nostalgic",
    date: "2026.07.02",
  },
  {
    id: "gb2",
    name: "corrupted.bmp",
    message: "the vinyl wall broke my brain in the best way. what font is the big one??",
    mood: "amazed",
    date: "2026.07.14",
  },
  {
    id: "gb3",
    name: "MOD_ghost",
    message: "signing ur guestbook like it's 2004. keep the old web alive.",
    website: "http://example.com/ghost",
    mood: "chaotic",
    date: "2026.08.01",
  },
];

export const moods = ["nostalgic", "chaotic", "amazed", "sleepy", "haunted", "hyped"];

export const badges = [
  "BEST VIEWED IN 1024×768",
  "NO TRACKING",
  "HANDMADE HTML",
];

export const webring = [
  { label: "◄ PREV", href: "https://example.com" },
  { label: "RANDOM", href: "https://example.com" },
  { label: "NEXT ►", href: "https://example.com" },
];
