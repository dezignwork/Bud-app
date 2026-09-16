// The "Water me!" animation: a watering can rides in from the left, tilts
// to pour a real fan-shaped spray onto the plant, then rights itself and
// rides back out. Ported from a standalone reference build (kept yellow
// per request, independent of the app's theme) and adapted to run once
// per tap instead of looping, mounted only while `active` (state.rain).
//
// Structure: wcRide carries the whole can in/out via translateX, wcTilt
// rotates just the can body to pour, wcUntilt counter-rotates the water
// group so the stream stays vertical while the can is tilted, and wcPour
// fades that water group in/out for the pour window. The 18 droplets each
// follow one of 6 fan trajectories (SPRAY_PATHS) on their own short loop,
// staggered by delay, gated visible only during wcPour's window.
const EASE = "cubic-bezier(.45,0,.25,1)";
const CYCLE_MS = 4500;

const SPRAY_PATHS = [
  { rot: [24, 9, 3, 2, 1, 1, 1, 1], x: [0, -2, -3, -5, -6, -7, -8, -9] },
  { rot: [-51, -23, -9, -5, -3, -2, -2, -2], x: [0, 5, 9, 13, 16, 19, 22, 25] },
  { rot: [-72, -46, -21, -13, -8, -6, -5, -4], x: [0, 14, 24, 33, 41, 49, 56, 63] },
  { rot: [-79, -60, -32, -20, -14, -10, -8, -6], x: [0, 22, 39, 53, 67, 80, 92, 103] },
  { rot: [-82, -67, -42, -27, -19, -14, -11, -9], x: [0, 31, 55, 74, 94, 111, 128, 144] },
  { rot: [-84, -71, -48, -32, -23, -17, -14, -11], x: [0, 39, 67, 92, 116, 138, 158, 178] },
];
const SPRAY_Y = [0, 5, 22, 52, 99, 160, 236, 327];
const SPRAY_STOPS = [0, 12, 26, 40, 55, 70, 85, 100];

const sprayKeyframes = SPRAY_PATHS.map((p, i) => {
  const frames = SPRAY_STOPS.map((stop, k) => {
    const fade = k === 0 ? ";opacity:0" : k === 1 ? ";opacity:1" : k === SPRAY_STOPS.length - 1 ? ";opacity:0" : "";
    return `${stop}%{transform:translate(${p.x[k]}px,${SPRAY_Y[k]}px) rotate(${p.rot[k]}deg)${fade}}`;
  }).join("");
  return `@keyframes wcSpray${i + 1}{${frames}}`;
}).join("\n");

const CSS = `
@keyframes wcRide{0%,5%{transform:translateX(-320px) rotate(14deg)}22%,70%{transform:translateX(0) rotate(0deg)}90%,100%{transform:translateX(-320px) rotate(14deg)}}
@keyframes wcTilt{0%,25%{transform:rotate(0deg)}33%,63%{transform:rotate(26deg)}72%,100%{transform:rotate(0deg)}}
@keyframes wcUntilt{0%,25%{transform:rotate(0deg)}33%,63%{transform:rotate(-26deg)}72%,100%{transform:rotate(0deg)}}
@keyframes wcPour{0%,34%{opacity:0}37%,60%{opacity:1}63%,100%{opacity:0}}
${sprayKeyframes}
`;

// 18 droplets, staggered across the 1.05s spray loop.
const DROPS = [
  [-2, -21, 8, 23, 1], [4, -17, 7, 20, 2], [10, -13, 6, 17, 3], [0, -13, 8, 14, 4],
  [6, -9, 7, 23, 5], [-5, -10, 6, 20, 6], [1, -6, 8, 17, 1], [7, -2, 7, 14, 2],
  [-3, -2, 6, 23, 3], [3, 2, 8, 20, 4], [-7, 2, 7, 17, 5], [-1, 6, 6, 14, 6],
  [5, 10, 8, 23, 2], [-6, 9, 7, 20, 3], [0, 13, 6, 17, 4], [-10, 13, 8, 14, 5],
  [-4, 17, 7, 23, 1], [2, 21, 6, 20, 6],
].map((d, i) => ({
  left: d[0], top: d[1], w: d[2], h: d[3], path: d[4],
  color: ["#7fc0ae", "#9ad2c2", "#8fcab8"][i % 3],
  delay: (i * 0.055).toFixed(2),
}));

export default function WaterCan({ active, bottom, scale = 0.52 }) {
  if (!active) return null;

  const dur = `${CYCLE_MS / 1000}s`;
  // One playthrough per tap (not the reference's looping demo default) —
  // "both" holds the pre-0% state before it starts and the 100% state
  // after, so it's parked off-screen left the instant it mounts.
  const anim = (name, timing) => `${name} ${dur} ${timing} 1 both`;

  return (
    <div style={{ position: "absolute", left: "50%", bottom, marginLeft: -280 * scale, zIndex: 4, pointerEvents: "none" }}>
      <style>{CSS}</style>
      {/* Rides in from the left, then back out. This has to sit OUTSIDE the
          scale wrapper below — the reference this was ported from relied on
          an outer overflow:hidden box sized to just clip the "off-screen"
          state locally, which we don't have here, so translateX needs to
          mean real screen pixels. Nested inside the 0.52 scale transform
          instead, -250px only ever moved ~130px on screen — less than the
          can's own rendered width — so it never actually left view; it just
          looked stuck at the edge on both the way in and the way out. */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 0, height: 0, animation: anim("wcRide", EASE) }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 0, height: 0, transform: `scale(${scale})`, transformOrigin: "top left" }}>
          {/* tilts to pour */}
          <div style={{ position: "absolute", left: 0, top: 70, width: 340, height: 160, transformOrigin: "44% 56%", animation: anim("wcTilt", EASE) }}>
            {/* handle */}
            <div style={{ position: "absolute", left: 62, top: 52, width: 66, height: 76, boxSizing: "border-box", border: "11px solid #f0b52c", borderRadius: "50%", outline: "2px solid #8a5a12", outlineOffset: -1 }} />
            {/* top grip */}
            <div style={{ position: "absolute", left: 130, top: -8, width: 92, height: 58, boxSizing: "border-box", border: "11px solid #f0b52c", borderBottom: "none", borderRadius: "48px 48px 0 0" }} />
            <div style={{ position: "absolute", left: 130, top: -8, width: 92, height: 58, boxSizing: "border-box", border: "2px solid #8a5a12", borderBottom: "none", borderRadius: "48px 48px 0 0" }} />
            <div style={{ position: "absolute", left: 141, top: 3, width: 70, height: 47, boxSizing: "border-box", border: "2px solid #8a5a12", borderBottom: "none", borderRadius: "36px 36px 0 0", opacity: 0.6 }} />
            {/* body */}
            <div style={{ position: "absolute", left: 107, top: 41, width: 138, height: 136, background: "#8a5a12", borderRadius: "10px 10px 20px 20px", clipPath: "polygon(11% 0,89% 0,100% 100%,0 100%)" }} />
            <div style={{ position: "absolute", left: 110, top: 44, width: 132, height: 130, background: "#ffce47", borderRadius: "9px 9px 18px 18px", clipPath: "polygon(11% 0,89% 0,100% 100%,0 100%)" }} />
            {/* rim */}
            <div style={{ position: "absolute", left: 117, top: 32, width: 118, height: 26, boxSizing: "border-box", border: "2px solid #8a5a12", borderRadius: "50%", background: "#f0b52c" }} />
            <div style={{ position: "absolute", left: 126, top: 38, width: 100, height: 14, borderRadius: "50%", background: "#dda017" }} />
            <div style={{ position: "absolute", left: 119, top: 92, width: 114, height: 8, background: "#f0b52c", opacity: 0.9 }} />
            {/* base */}
            <div style={{ position: "absolute", left: 106, top: 155, width: 140, height: 19, boxSizing: "border-box", border: "2px solid #8a5a12", borderRadius: "7px 7px 17px 17px", background: "#f0b52c" }} />
            {/* spout */}
            <div style={{ position: "absolute", left: 198, top: 68, width: 126, height: 26, boxSizing: "border-box", border: "2px solid #8a5a12", borderRadius: 6, background: "#ffce47", transform: "rotate(-14deg)", transformOrigin: "left center" }} />
            <div style={{ position: "absolute", left: 200, top: 82, width: 120, height: 9, borderRadius: 5, background: "#f0b52c", opacity: 0.75, transform: "rotate(-14deg)", transformOrigin: "left center" }} />
            {/* rose (spout head) */}
            <div style={{ position: "absolute", left: 300, top: 22, width: 58, height: 62, transform: "rotate(-14deg)", transformOrigin: "left center" }}>
              <div style={{ position: "absolute", left: 0, top: 14, width: 36, height: 32, background: "#f0b52c", clipPath: "polygon(0 30%,100% 0,100% 100%,0 70%)" }} />
              <div style={{ position: "absolute", left: 26, top: 2, width: 28, height: 56, borderRadius: "50%", background: "#ffce47", boxSizing: "border-box", border: "5px solid #f0b52c", outline: "2px solid #8a5a12", outlineOffset: -1 }} />
            </div>
            {/* water: counter-rotates so the stream stays vertical, fades in only while tilted */}
            <div style={{ position: "absolute", left: 338, top: 44, width: 0, height: 0, transformOrigin: "top center", animation: anim("wcUntilt", EASE) }}>
              <div style={{ position: "absolute", left: 0, top: 0, width: 0, height: 0, animation: anim("wcPour", "linear") }}>
                {DROPS.map((d, i) => (
                  <div key={i} style={{
                    position: "absolute", left: d.left, top: d.top, width: d.w, height: d.h,
                    borderRadius: 999, background: d.color,
                    animation: `wcSpray${d.path} 1.05s linear ${d.delay}s infinite`,
                  }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { CYCLE_MS };
