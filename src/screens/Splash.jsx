import { useEffect, useState } from "react";

/**
 * Launch splash: seed dot lands, leaf unfurls out of it, brief hold, then the
 * whole overlay scales up slightly and fades to reveal the app underneath
 * (already mounted, not animating in). Timings/easings match the spec
 * exactly — see the keyframes in index.css (spDot/spLeaf/spOut/spOutFade).
 */
export default function Splash({ onDone }) {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);

    // Reduced motion: skip the two entrance beats, hold the finished mark for
    // ~600ms, then a plain opacity cross-fade (no scale) over 500ms.
    // Full motion: dot (0-720ms) + leaf (420-1240ms) overlap, hold, then the
    // spOut exit starts at 2050ms and runs 500ms — overlay gone at 2570ms.
    const totalMs = mq.matches ? 1100 : 2570;
    const t = setTimeout(() => onDone && onDone(), totalMs);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        // Fixed (not absolute) so this always covers the real screen edges,
        // independent of the app shell's own height calc — see TabBar.jsx
        // for why that calc can briefly come up short on iOS.
        position: "fixed", inset: 0, maxWidth: 480, margin: "0 auto", zIndex: 50,
        background: "#F8F7F4",
        display: "flex", alignItems: "center", justifyContent: "center",
        animation: reduced
          ? "spOutFade 500ms cubic-bezier(.4,0,.2,1) 600ms both"
          : "spOut 500ms cubic-bezier(.4,0,.2,1) 2050ms both",
      }}
    >
      <svg width="132" height="132" viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <circle
          cx="30" cy="42" r="14" fill="#094020"
          style={
            reduced
              ? { opacity: 1 }
              : {
                  transformBox: "fill-box", transformOrigin: "50% 50%", opacity: 0,
                  animation: "spDot 720ms cubic-bezier(.2,.9,.3,1.2) both",
                }
          }
        />
        <path
          d="M32 27C32 19 38 12.5 46.5 12C46.5 20 40.5 27 32 27Z" fill="#98AC9F"
          style={
            reduced
              ? { opacity: 1 }
              : {
                  transformBox: "fill-box", transformOrigin: "0% 100%", opacity: 0,
                  animation: "spLeaf 820ms cubic-bezier(.2,.85,.3,1.05) 420ms both",
                }
          }
        />
      </svg>
    </div>
  );
}
