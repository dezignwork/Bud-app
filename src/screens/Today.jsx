import { useMemo } from "react";
import Plant, { potMetrics } from "../components/Plant";
import ShelfScene from "../components/ShelfScene";
import { plantGrowth } from "../plantGrowth";
import { TailBubble } from "../components/SpeechBubble";

// How far the plant is lifted off the container's bottom to rest on top of
// the shelf's plank, rather than floating on plain ground. Plant's own box
// has 6px of built-in bottom padding, so the actual lift is 6px less than
// the plank's surface height (66px, matching ShelfScene's plankTop) or the
// pot would hover just above it.
const PLANK_LIFT = 60;

function Droplets({ theme, rainN }) {
  const drops = useMemo(() => {
    const out = [];
    for (let i = 0; i < 52; i++) {
      out.push({
        left: (Math.random() * 97 + 1).toFixed(1) + "%",
        width: 1.5,
        height: (Math.random() * 15 + 13).toFixed(0) + "px",
        opacity: (Math.random() * 0.28 + 0.22).toFixed(2),
        duration: (Math.random() * 0.33 + 0.62).toFixed(2) + "s",
        delay: (Math.random() * 1.5).toFixed(2) + "s",
      });
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rainN]);

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 8, pointerEvents: "none", overflow: "hidden" }}>
      {drops.map((d, i) => (
        <div
          key={i}
          style={{
            position: "absolute", top: -60, left: d.left, width: d.width, height: d.height,
            borderRadius: 999, background: theme.leaf, opacity: d.opacity,
            animation: `rainFall ${d.duration} linear ${d.delay} infinite`,
          }}
        />
      ))}
    </div>
  );
}

function ActionTab({ theme, active, width, labelOpacity, label, icon, onPointerDown, onPointerMove, onPointerUp, disabledOpacity }) {
  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onTouchStart={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
      style={{
        position: "relative", height: 56, width, boxSizing: "border-box", background: theme.chip, color: theme.chipInk,
        borderRadius: "999px 0 0 999px", display: "flex", alignItems: "center", justifyContent: "flex-start",
        paddingLeft: 6, overflow: "hidden", cursor: "pointer", touchAction: "none",
        transition: active ? "none" : "width .3s cubic-bezier(.34,1.3,.64,1)",
        opacity: disabledOpacity ?? 1,
      }}
    >
      <div style={{ flex: "none", width: 44, height: 44, borderRadius: 999, background: theme.card, color: theme.cardInk, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, lineHeight: 1 }}>
        {icon}
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: -0.3, whiteSpace: "nowrap", marginLeft: 10, opacity: labelOpacity, transition: "opacity .16s ease" }}>
        {label}
      </div>
    </div>
  );
}

const PlusIcon = () => (
  <div style={{ position: "relative", width: 17, height: 17 }}>
    <div style={{ position: "absolute", left: 0, top: 7.2, width: 17, height: 2.6, borderRadius: 2, background: "currentColor" }} />
    <div style={{ position: "absolute", top: 0, left: 7.2, width: 2.6, height: 17, borderRadius: 2, background: "currentColor" }} />
  </div>
);

const DropIcon = () => (
  <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M10 2.4c3 3.6 5.2 6.4 5.2 9a5.2 5.2 0 0 1-10.4 0c0-2.6 2.2-5.4 5.2-9Z" />
  </svg>
);

export default function Today({ bud, theme }) {
  const { state, todayLine, nameOrFriend, tapPlant, pullStart, pullMove, pullEnd, keepDown, nextDown, waterDown, swipeMove, swipeEnd } = bud;
  const line = todayLine(state);
  const isSaved = state.saved.includes(line);
  const name = nameOrFriend(state);
  const lineTag = state.extra ? "ONE MORE FOR YOU" : "FOR " + name.toUpperCase();

  const { stemH } = plantGrowth(state.streak);
  const { stemBottom } = potMetrics(state.potShape, true);
  const msgBottom = Math.round(stemBottom + stemH + 46 + 10 + PLANK_LIFT);

  const keepW = (state.sw === "keep" ? 68 + state.swX : 68) + "px";
  const nextW = (state.sw === "next" ? 68 + state.swX : 68) + "px";
  const waterW = (state.sw === "water" ? 68 + state.swX : 68) + "px";

  return (
    <div
      onPointerDown={pullStart}
      onPointerMove={pullMove}
      onPointerUp={pullEnd}
      onPointerCancel={pullEnd}
      style={{
        flex: 1, display: "flex", flexDirection: "column", padding: "0 28px", touchAction: "none",
        cursor: "grab", userSelect: "none", position: "relative", minHeight: 0,
      }}
    >
      <div style={{ height: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 400, opacity: state.pull > 8 ? 1 : 0.35, transition: "opacity .16s ease" }}>
        {state.pull > 29 ? "let go for another" : state.pull > 8 ? "keep pulling…" : ""}
      </div>

      {state.rain && <Droplets theme={theme} rainN={state.rainN} />}

      <div style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", zIndex: 5, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 11 }}>
        <ActionTab
          theme={theme} active={state.sw === "keep"} width={keepW}
          labelOpacity={state.sw === "keep" && state.swX > 30 ? 1 : 0} label={isSaved ? "Kept" : "Keep"}
          icon={isSaved ? "♥" : "♡"}
          onPointerDown={keepDown} onPointerMove={swipeMove} onPointerUp={swipeEnd}
        />
        <ActionTab
          theme={theme} active={state.sw === "next"} width={nextW}
          labelOpacity={state.sw === "next" && state.swX > 30 ? 1 : 0} label="One more"
          icon={<PlusIcon />}
          onPointerDown={nextDown} onPointerMove={swipeMove} onPointerUp={swipeEnd}
        />
        <ActionTab
          theme={theme} active={state.sw === "water"} width={waterW}
          labelOpacity={state.sw === "water" && state.swX > 30 ? 1 : 0} label={state.rain ? "Raining" : "Water me!"}
          icon={<DropIcon />} disabledOpacity={state.rain ? 0.55 : 1}
          onPointerDown={waterDown} onPointerMove={swipeMove} onPointerUp={swipeEnd}
        />
      </div>

      {state.flying && (
        <div style={{ position: "absolute", left: 28, right: 28, top: 40, zIndex: 3, pointerEvents: "none", transformOrigin: "top center", animation: "swish .8s cubic-bezier(.55,-0.2,.6,1) forwards" }}>
          <div style={{ background: theme.bubble, color: theme.bubbleInk, borderRadius: 32, padding: "24px 26px", boxShadow: `0 0 0 1px ${theme.ghostLine}` }}>
            <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: -1.5, lineHeight: 1.12 }}>{line}</div>
          </div>
        </div>
      )}

      <div style={{ flex: 1, display: "flex", flexDirection: "column", transform: `translateY(${state.pull}px)`, transition: state.dragging ? "none" : "transform .32s cubic-bezier(.34,1.4,.64,1)", minHeight: 0 }}>
        <div style={{ paddingTop: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.6, opacity: 0.5, marginBottom: 14 }}>{lineTag}</div>
          <div style={{ fontSize: 38, fontWeight: 700, letterSpacing: -2.28, lineHeight: 1.06, textWrap: "pretty" }}>{line}</div>
        </div>

        <div style={{ flex: 1, display: "flex", alignItems: "flex-end", justifyContent: "center", position: "relative", minHeight: 0 }}>
          <ShelfScene theme={theme} />

          {state.greet && (
            <TailBubble theme={theme} animKey={`greet-${state.greetN}`} style={{ bottom: msgBottom }}>
              Hi, {name}!
            </TailBubble>
          )}
          {state.tapMsg && (
            <TailBubble theme={theme} animKey={`msg-${state.msgN}`} style={{ bottom: msgBottom, animation: "drift 2.6s ease forwards" }}>
              {state.tapMsg}
            </TailBubble>
          )}

          <div style={{ position: "relative", zIndex: 1, marginBottom: PLANK_LIFT }}>
            <Plant theme={theme} potShape={state.potShape} streak={state.streak} size="large" squish={state.squish} soothe={state.rain} scene="shelf" onClick={tapPlant} />
          </div>
        </div>
      </div>
    </div>
  );
}
