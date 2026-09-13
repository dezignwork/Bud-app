import { POT_SHAPES } from "../data";
import { plantGrowth } from "../plantGrowth";

/**
 * The Bud plant mark: stem, leaves, pot, and a blinking two-dot face.
 * `size="small"` is the onboarding mark (fixed 78px stem); `size="large"` is
 * the Today screen mark, whose stem/leaf count grows with streak.
 */
export default function Plant({ theme, potShape, streak, size = "large", squish = false, soothe = false, onClick }) {
  const P = POT_SHAPES[potShape] || POT_SHAPES.taper;
  const { leaves, stemH } = plantGrowth(streak);
  const large = size === "large";

  const boxW = large ? 210 : 150;
  const boxH = large ? Math.round(58 + stemH + 46) : 170;
  const stemBottom = large ? 58 : 52;
  const stemHeight = large ? Math.round(stemH) : 78;
  const leafW = large ? 52 : 38;
  const leafH = large ? 28 : 22;
  const potW = large ? 112 : 94;
  const potH = large ? 66 : 60;
  const rimW = large ? 126 : 106;
  const rimH = large ? 16 : 14;
  const rimBottom = large ? 58 : 52;
  const eyeW = large ? 9 : 7;
  const eyeH = large ? 11 : 9;
  const eyeRowW = large ? 50 : 44;
  const eyeBottom = large ? 36 : 32;
  const mouthBottom = large ? 18 : 17;
  const mouthW = large ? 18 : 13;
  const mouthH = large ? 9 : 7;

  return (
    <div
      onClick={onClick}
      data-testid={onClick ? "bud-plant" : undefined}
      style={{
        cursor: onClick ? "pointer" : undefined, transformOrigin: "bottom center", paddingBottom: 6,
        transform: squish ? "scale(1.08,0.9)" : "scale(1,1)",
        transition: "transform .18s cubic-bezier(.34,1.56,.64,1)",
      }}
    >
      <div style={{ animation: "breathe 5.5s ease-in-out infinite" }}>
        <div
          style={{
            width: boxW,
            height: boxH,
            position: "relative",
            transformOrigin: "bottom center",
            animation: soothe ? "soothe 2.4s ease-in-out 1.1s 1" : "none",
          }}
        >
          {/* stem */}
          <div
            style={{
              position: "absolute", left: "50%", bottom: stemBottom,
              width: large ? 7 : 6, height: stemHeight, marginLeft: large ? -3.5 : -3,
              borderRadius: 4, background: theme.leaf,
              transformOrigin: "bottom center", animation: "sway 5s ease-in-out infinite",
            }}
          />
          {/* leaves */}
          {leaves.map((lf, i) => (
            <div
              key={i}
              style={{
                position: "absolute", left: "50%", bottom: lf.bottom,
                transformOrigin: "left center", transform: lf.transform,
                opacity: lf.visible ? 1 : 0,
              }}
            >
              <div
                style={{
                  width: leafW, height: leafH, background: theme.leaf,
                  borderRadius: "100% 0 100% 0", transformOrigin: "left center",
                  animation: "leafbob 4.2s ease-in-out infinite", animationDelay: `${lf.delay}s`,
                }}
              />
            </div>
          ))}
          {/* pot body */}
          <div
            style={{
              position: "absolute", left: "50%", bottom: 0,
              width: potW, height: potH, marginLeft: -potW / 2,
              background: theme.pot, clipPath: P.clip, borderRadius: P.radius,
            }}
          />
          {/* pot rim */}
          <div
            style={{
              position: "absolute", left: "50%", bottom: rimBottom,
              width: rimW, height: rimH, marginLeft: -rimW / 2,
              background: theme.pot, clipPath: P.rimClip, borderRadius: P.rimRadius,
              transform: P.rimT === "none" ? undefined : P.rimT,
            }}
          />
          {/* face: two blinking eyes */}
          <div
            style={{
              position: "absolute", left: "50%", bottom: eyeBottom, width: eyeRowW,
              marginLeft: -eyeRowW / 2, display: "flex", justifyContent: "space-between",
            }}
          >
            <div style={{ width: eyeW, height: eyeH, borderRadius: 5, background: theme.potInk, animation: "blink 6s infinite" }} />
            <div style={{ width: eyeW, height: eyeH, borderRadius: 5, background: theme.potInk, animation: "blink 6.4s infinite" }} />
          </div>
          {/* mouth */}
          <div
            style={{
              position: "absolute", left: "50%", bottom: mouthBottom, width: mouthW, height: mouthH,
              marginLeft: -mouthW / 2, borderBottom: `2px solid ${theme.potInk}`,
              borderRadius: "0 0 12px 12px", opacity: 0.75,
            }}
          />
        </div>
      </div>
    </div>
  );
}
