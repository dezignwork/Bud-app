// Design data ported from project/AffirmationApp.dc.html (Claude Design export).

export const THEMES = {
  meadow: {
    name: "Meadow", note: "sage, type-first", swatch: "#98ac9f",
    bg: "#f8f7f4", ink: "#000000", card: "#ffffff", cardInk: "#000000",
    bubble: "#ffffff", bubbleInk: "#000000",
    leaf: "#094020", pot: "#7a5638", potInk: "#fdf6ec",
    chip: "#98ac9f", chipInk: "#000000", btnBg: "#000000", btnFg: "#ffffff",
    ghostLine: "rgba(0,0,0,.18)",
    rope: "#c9b79c", grassDeep: "#3a5a3f", grassMid: "#7fa07a", grassSpeck: "#b9c9a9",
    desk: "#c9a876", deskDark: "#a4855c",
  },
  clay: {
    name: "Clay", note: "earthy terracotta", swatch: "#7a3b23",
    bg: "#f4efe7", ink: "#3d2317", card: "#fffcf7", cardInk: "#3d2317",
    bubble: "#fffcf7", bubbleInk: "#3d2317",
    leaf: "#6f9c4d", pot: "#7a5638", potInk: "#f4efe7",
    chip: "#d8a06d", chipInk: "#3d2317", btnBg: "#7a3b23", btnFg: "#f4efe7",
    ghostLine: "rgba(61,35,23,.2)",
    rope: "#b89468", grassDeep: "#4f6b3a", grassMid: "#8fae5c", grassSpeck: "#c7d9a0",
    desk: "#a97a54", deskDark: "#8a6142",
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

// 1000 affirmations, pooled from a user-supplied set of 5 tone categories
// and split evenly (shuffled, fixed seed) across the app's 7 moods below —
// the source categories were about voice/tone, not these target moods, so
// there was no clean 1:1 mapping to preserve.
import AFFIRMATIONS from "./affirmations.json";

export const MOODS = ["Calm", "Tender", "Brave", "Tired", "Hopeful", "Grateful", "Restless"];

export const linesForMood = (mood) => AFFIRMATIONS[mood] || AFFIRMATIONS[MOODS[0]];

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
  { title: "One gentle line a day, {n}.", body: "I grow a little each time you come back.", cta: "Got it!" },
  { title: "How are you feeling, {n}?", body: "You can change this any day. Nothing here is a commitment.", cta: "Let's Grow!" },
];

export const fillName = (text, name) => text.split("{n}").join(name).split("{name}").join(name);
