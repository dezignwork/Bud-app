// The "Water me!" animation: a gloved hand carrying a watering can slides
// in from the left, tips over the plant's canopy to pour a few drops, then
// rights itself and exits back the way it came. Replaces the old
// full-screen rain effect — this one only touches the plant.
//
// wcSlide (outer, horizontal travel) and wcTip (inner, tip rotation around
// the wrist) run on the same 3.6s timeline as separate CSS animations so
// they can be keyframed independently — see index.css. That duration
// matches useBud.js's own `rain` timers exactly, so this unmounts right as
// the choreography finishes.
const POUR_DELAYS = [1.05, 1.35, 1.65, 1.95, 2.25, 2.55, 2.85];

export default function WaterCan({ theme, active, bottom }) {
  if (!active) return null;

  return (
    <div
      style={{
        position: "absolute", left: "50%", bottom, marginLeft: -128, zIndex: 4,
        pointerEvents: "none", animation: "wcSlide 3.6s ease-in-out both",
      }}
    >
      <div style={{ position: "relative", width: 112, height: 78, transformOrigin: "6px 40px", animation: "wcTip 3.6s ease-in-out both" }}>
        {/* sleeve, entering from the left edge of the group toward the grip */}
        <div style={{ position: "absolute", left: -12, top: 28, width: 58, height: 25, borderRadius: 13, background: theme.chip, transform: "rotate(-10deg)" }} />
        {/* can body */}
        <div style={{ position: "absolute", left: 44, top: 18, width: 48, height: 38, borderRadius: 15, background: theme.pot }} />
        {/* rim shading, the same darkened-band trick used on the plant's pot */}
        <div style={{ position: "absolute", left: 44, top: 18, width: 48, height: 10, borderRadius: "15px 15px 0 0", background: `color-mix(in oklab, ${theme.pot}, #000000 16%)` }} />
        {/* spout */}
        <div style={{ position: "absolute", left: 86, top: 32, width: 28, height: 10, borderRadius: 4, background: theme.deskDark, transform: "rotate(-14deg)" }} />
        {/* can handle, arcing over the top */}
        <div style={{ position: "absolute", left: 54, top: 0, width: 30, height: 20, borderRadius: "15px 15px 0 0", border: `5px solid ${theme.deskDark}`, borderBottom: "none" }} />
        {/* gloved hand, resting on top of the handle so it reads as gripping it */}
        <div style={{ position: "absolute", left: 40, top: 4, width: 32, height: 26, borderRadius: "16px 16px 16px 4px", background: theme.potInk, boxShadow: `inset 0 0 0 1px ${theme.ghostLine}` }} />

        {/* droplets falling from the spout tip during the pour */}
        {POUR_DELAYS.map((d, i) => (
          <div
            key={i}
            style={{
              position: "absolute", left: 112, top: 40, width: 3, height: 10, borderRadius: 999,
              background: theme.leaf, opacity: 0, animation: `wcDrop .6s ease-in ${d}s 1`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
