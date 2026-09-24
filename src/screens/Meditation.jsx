const PHASE_HEADS = ["Inhale", "Hold", "Exhale", "Hold"];
const PHASE_LINES = [
  "Inhale through your nose for 4 seconds",
  "Hold for 4 seconds",
  "Exhale through your mouth for 4 seconds",
  "Hold for 4 seconds",
];

export default function Meditation({ bud, theme }) {
  const { state, beginMed, endMed } = bud;
  const medIntro = state.medPhase < 0 && state.medReady == null;
  const medReadyOn = state.medReady != null;
  const medTitlePhase = state.medPhase >= 0 && state.medPhase <= 3;
  const medOutro = state.medPhase === 4;

  const medScale = state.medPhase === 0 || state.medPhase === 1 ? 1.32 : 0.8;
  const medCircleAnim =
    state.medPhase === 0 ? "medGrow 4s cubic-bezier(.45,0,.55,1) both"
    : state.medPhase === 2 ? "medShrink 4s cubic-bezier(.45,0,.55,1) both"
    : "none";

  const circle = (n, scale, anim) => (
    <div
      style={{
        width: 196, height: 196, borderRadius: 999, background: theme.card, display: "flex",
        alignItems: "center", justifyContent: "center", transform: `scale(${scale})`, animation: anim,
      }}
    >
      <div key={n} style={{ fontSize: 64, fontWeight: 700, letterSpacing: -3.84, lineHeight: 1, color: theme.cardInk, animation: "medNum .95s cubic-bezier(.22,1,.36,1) both" }}>
        {n}
      </div>
    </div>
  );

  return (
    <div
      style={{
        // Fixed (not absolute) so this always covers the real screen edges,
        // independent of the app shell's own height calc — see TabBar.jsx
        // for why that calc can briefly come up short on iOS.
        position: "fixed", inset: 0, maxWidth: 480, margin: "0 auto", zIndex: 20, background: theme.bg, color: theme.ink,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "0 40px", textAlign: "center", animation: "medIn .5s ease both",
      }}
    >
      <div style={{ height: 400, display: "flex", flexDirection: "column", alignItems: "center" }}>
        {medIntro && (
          <div style={{ animation: "medRise .8s cubic-bezier(.22,1,.36,1) both" }}>
            <h1 style={{ margin: "0 0 22px", fontSize: 28, fontWeight: 700, letterSpacing: -1.68, lineHeight: 1.14 }}>Meditation Mode</h1>
            <div style={{ fontSize: 15, fontWeight: 400, lineHeight: 1.45, opacity: 0.7, marginBottom: 34, textWrap: "pretty" }}>
              Let's try box breathing. Four seconds in, four to hold, four out, four to rest. Start when you're ready.
            </div>
            <div
              onClick={beginMed}
              style={{ display: "inline-block", padding: "18px 30px", borderRadius: 999, background: theme.btnBg, color: theme.btnFg, fontSize: 13, fontWeight: 600, letterSpacing: -0.3, cursor: "pointer", transition: "opacity .16s ease, transform .16s ease" }}
            >
              Let's start
            </div>
          </div>
        )}

        {medReadyOn && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 56 }}>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, letterSpacing: -1.68, lineHeight: 1.14 }}>Ready?</h1>
            {circle(state.medReady, 0.8, "none")}
          </div>
        )}

        {medTitlePhase && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 56 }}>
            <h1 key={state.medPhase} style={{ margin: 0, fontSize: 28, fontWeight: 700, letterSpacing: -1.68, lineHeight: 1.14, animation: "medNum .8s cubic-bezier(.22,1,.36,1) both" }}>
              {PHASE_LINES[state.medPhase]}
            </h1>
            {circle(state.medN, medScale, medCircleAnim)}
          </div>
        )}

        {medOutro && (
          <div style={{ animation: "medRise .7s cubic-bezier(.22,1,.36,1) both" }}>
            <h1 style={{ margin: "0 0 26px", fontSize: 28, fontWeight: 700, letterSpacing: -1.68, lineHeight: 1.14 }}>Hope that helps!</h1>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "stretch" }}>
              <div
                onClick={beginMed}
                style={{ padding: "18px 30px", borderRadius: 999, background: theme.btnBg, color: theme.btnFg, fontSize: 13, fontWeight: 600, letterSpacing: -0.3, textAlign: "center", cursor: "pointer", transition: "opacity .16s ease, transform .16s ease" }}
              >
                Start again
              </div>
              <div
                onClick={endMed}
                style={{ padding: "18px 30px", borderRadius: 999, boxShadow: `inset 0 0 0 1px ${theme.ghostLine}`, fontSize: 13, fontWeight: 600, letterSpacing: -0.3, textAlign: "center", cursor: "pointer", transition: "opacity .16s ease, transform .16s ease" }}
              >
                Back to Today
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, bottom: 40, display: "flex", flexDirection: "column", alignItems: "center", gap: 20, opacity: medOutro ? 0 : 1, transition: "opacity .3s ease" }}>
        <div style={{ display: "flex", gap: 7 }}>
          {PHASE_HEADS.map((_, i) => (
            <div
              key={i}
              style={{ width: 7, height: 7, borderRadius: 999, background: theme.ink, opacity: i === state.medPhase ? 1 : i < state.medPhase ? 0.4 : 0.16, transition: "opacity .3s ease" }}
            />
          ))}
        </div>
        <div
          onClick={endMed}
          style={{ padding: "14px 22px", borderRadius: 999, boxShadow: `inset 0 0 0 1px ${theme.ghostLine}`, fontSize: 13, fontWeight: 600, letterSpacing: -0.3, cursor: "pointer", transition: "opacity .16s ease, transform .16s ease" }}
        >
          End early
        </div>
      </div>
    </div>
  );
}
