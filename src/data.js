// Design data ported from project/AffirmationApp.dc.html (Claude Design export).

export const THEMES = {
  meadow: {
    name: "Meadow", note: "sage, type-first", swatch: "#98ac9f",
    bg: "#f8f7f4", ink: "#000000", card: "#ffffff", cardInk: "#000000",
    bubble: "#ffffff", bubbleInk: "#000000",
    leaf: "#094020", pot: "#98ac9f", potInk: "#094020",
    chip: "#98ac9f", chipInk: "#000000", btnBg: "#000000", btnFg: "#ffffff",
    ghostLine: "rgba(0,0,0,.18)",
  },
  clay: {
    name: "Clay", note: "earthy terracotta", swatch: "#7a3b23",
    bg: "#f4efe7", ink: "#3d2317", card: "#fffcf7", cardInk: "#3d2317",
    bubble: "#fffcf7", bubbleInk: "#3d2317",
    leaf: "#6f9c4d", pot: "#7a3b23", potInk: "#f4efe7",
    chip: "#d8a06d", chipInk: "#3d2317", btnBg: "#7a3b23", btnFg: "#f4efe7",
    ghostLine: "rgba(61,35,23,.2)",
  },
};

export const POT_SHAPES = {
  taper: {
    name: "Classic",
    clip: "polygon(3% 0,97% 0,82% 86%,74% 100%,26% 100%,18% 86%)", radius: "0", rimT: "none",
    rimClip: "polygon(0 0,100% 0,94% 100%,6% 100%)", rimRadius: "3px 3px 0 0",
  },
  orb: {
    name: "Round",
    clip: "none", radius: "50% 50% 48% 48% / 44% 44% 56% 56%", rimT: "scaleX(0.5)",
    rimClip: "none", rimRadius: "999px 999px 0 0",
  },
  urn: {
    name: "Vase",
    clip: "polygon(0 0,100% 0,78% 100%,22% 100%)", radius: "42% 42% 26% 26% / 34% 34% 28% 28%",
    rimT: "scaleX(0.86)", rimClip: "none", rimRadius: "10px 10px 3px 3px",
  },
};

export const LINES = [
  { t: "Take it one day at a time.", m: "Tired" },
  { t: "One step back, is also part of the dance", m: "Tender" },
  { t: "you are allowed to rest", m: "Tired" },
  { t: "small is still growing", m: "Hopeful" },
  { t: "your pace is the right pace", m: "Calm" },
  { t: "today can be quiet", m: "Calm" },
  { t: "let it be enough", m: "Tired" },
  { t: "you are doing plenty", m: "Tender" },
  { t: "soft things last longer", m: "Tender" },
  { t: "nothing blooms all year", m: "Hopeful" },
  { t: "you can begin again at noon", m: "Brave" },
  { t: "be gentle, you're new here too", m: "Brave" },
  { t: "the light finds you either way", m: "Hopeful" },
  { t: "one small brave thing counts", m: "Brave" },
  { t: "breathe, then decide", m: "Calm" },
  { t: "something here is already enough", m: "Grateful" },
  { t: "notice one good, ordinary thing", m: "Grateful" },
  { t: "thank yourself for showing up", m: "Grateful" },
  { t: "the list can wait a minute", m: "Restless" },
  { t: "you don't have to solve it today", m: "Restless" },
  { t: "put your feet down, you're here", m: "Restless" },
];

export const MOODS = ["Calm", "Tender", "Brave", "Tired", "Hopeful", "Grateful", "Restless"];

export const THANKS = [
  "Thank you — I needed that.",
  "Ahh. Thank you, {name}.",
  "That felt good. Thank you!",
  "Thanks, I was getting thirsty!",
  "Wow, thanks for the quick drink!",
];

export const SAVE_MSGS = ["Great! I am glad I could help!", "You got it, boss!", "Let's go!"];

export const REACTIONS = [
  "oh! hi, {n}", "that tickles", "*leaf wiggle*", "psst… some water, {n}?", "we're growing, {n}", "mm, good day",
];

export const ONBOARDING_STEPS = [
  { title: "Hi, I'm Bud.", body: "Let's grow each day, together.", cta: "Nice to meet you" },
  { title: "what should I call you?", body: "Let's be friends!", cta: "That's me" },
  { title: "One gentle line a day, {n}.", body: "Pull down for another if today needs a second one. I grow a little each time you come back.", cta: "Got it!" },
  { title: "how are you arriving, {n}?", body: "You can change this any day. Nothing here is a commitment.", cta: "Let's grow" },
];

export const fillName = (text, name) => text.split("{n}").join(name).split("{name}").join(name);
