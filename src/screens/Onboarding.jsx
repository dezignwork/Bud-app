import { MOODS, ONBOARDING_STEPS, fillName } from "../data";
import Plant from "../components/Plant";
import { PopBubble } from "../components/SpeechBubble";

export default function Onboarding({ bud, theme, dailyCheckIn = false }) {
  const { state, setName, pickMood, obNext, finishDailyCheckIn, nameOrFriend } = bud;
  const stepIndex = dailyCheckIn ? 3 : state.step;
  const step = ONBOARDING_STEPS[stepIndex];
  const isName = !dailyCheckIn && state.step === 1;
  const isMood = stepIndex === 3;
  const name = nameOrFriend(state);
  const onCta = dailyCheckIn ? finishDailyCheckIn : obNext;

  return (
    <div style={{ flex: 1, boxSizing: "border-box", display: "flex", flexDirection: "column", padding: "0 20px 34px", minHeight: 0, overflowY: "auto" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 28, textAlign: "center" }}>
        <Plant theme={theme} potShape={state.potShape} streak={state.streak} size="small" />
        <PopBubble theme={theme} title={fillName(step.title, name)} body={step.body} />
      </div>

      {isName && (
        <div style={{ marginBottom: 24 }}>
          <input
            value={state.name}
            onChange={(e) => setName(e.target.value)}
            placeholder="your name"
            style={{
              width: "100%", boxSizing: "border-box", padding: "20px 24px", borderRadius: 999,
              border: "none", outline: "none", background: theme.bubble, color: theme.bubbleInk,
              boxShadow: `inset 0 0 0 1px ${theme.ghostLine}`, fontFamily: "inherit",
              fontSize: 20, fontWeight: 700, letterSpacing: -1, textAlign: "center",
            }}
          />
        </div>
      )}

      {isMood && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 24 }}>
          {MOODS.map((m) => {
            const active = state.mood === m;
            return (
              <div
                key={m}
                onClick={() => pickMood(m)}
                style={{
                  padding: "13px 18px", borderRadius: 999, fontSize: 15, fontWeight: 400, cursor: "pointer",
                  background: active ? theme.chip : "transparent", color: active ? theme.chipInk : theme.ink,
                  transition: "opacity .16s ease",
                }}
              >
                {m}
              </div>
            );
          })}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "center" }}>
        <button
          onClick={onCta}
          style={{
            width: "100%", boxSizing: "border-box", textAlign: "center", padding: "18px 30px", borderRadius: 999,
            background: theme.btnBg, color: theme.btnFg, fontSize: 16, fontWeight: 600,
            cursor: "pointer", border: "none", transition: "opacity .16s ease, transform .16s ease",
          }}
        >
          {state.editingName ? "Save" : step.cta}
        </button>
        {!dailyCheckIn && (
          <div style={{ display: "flex", gap: 7 }}>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} style={{ width: 6, height: 6, borderRadius: 3, background: theme.ink, opacity: i === state.step ? 1 : 0.22 }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
