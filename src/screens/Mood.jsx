import { MOODS, POT_SHAPES, THEMES } from "../data";

export default function Mood({ bud, theme }) {
  const { state, pickMood, setPotShape, setTheme, nameOrFriend, editName, replayIntro } = bud;
  const name = nameOrFriend(state);

  const now = new Date();
  const nextMonthFirst = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const storageNote =
    state.entries.length + (state.entries.length === 1 ? " entry" : " entries") + " and " +
    state.saved.length + (state.saved.length === 1 ? " line" : " lines") + " saved. Both clear on " +
    nextMonthFirst.toLocaleDateString("en-US", { month: "long", day: "numeric" }) + ".";
  const storageMonth = now.toLocaleDateString("en-US", { month: "short" }).toUpperCase();

  return (
    <div style={{ flex: 1, padding: "0 28px 24px", overflowY: "auto", overflowX: "hidden", WebkitOverflowScrolling: "touch" }}>
      <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: -1.68, lineHeight: 1.1, marginBottom: 6 }}>How are you today?</div>
      <div style={{ fontSize: 15, fontWeight: 300, lineHeight: 1.25, opacity: 0.7, marginBottom: 20 }}>Pick a mood and your line changes to match.</div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 9, marginBottom: 30 }}>
        {MOODS.map((m) => {
          const active = state.mood === m;
          return (
            <div
              key={m}
              onClick={() => pickMood(m)}
              style={{
                padding: "12px 20px", borderRadius: 999, fontSize: 15, fontWeight: 400, cursor: "pointer",
                background: active ? theme.chip : "transparent", color: active ? theme.chipInk : theme.ink,
                boxShadow: active ? "none" : `inset 0 0 0 1px ${theme.ghostLine}`,
                transition: "opacity .16s ease, transform .16s ease",
              }}
            >
              {m}
            </div>
          );
        })}
      </div>

      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.6, opacity: 0.5, marginBottom: 12 }}>POT SHAPE</div>
      <div style={{ display: "flex", gap: 10, marginBottom: 26 }}>
        {Object.entries(POT_SHAPES).map(([key, shape]) => {
          const active = state.potShape === key;
          return (
            <div
              key={key}
              onClick={() => setPotShape(key)}
              style={{
                flex: 1, background: theme.card, color: theme.cardInk, borderRadius: 24, padding: "14px 8px 12px",
                cursor: "pointer", textAlign: "center", boxShadow: `inset 0 0 0 1.5px ${active ? theme.leaf : "transparent"}`,
                transition: "opacity .16s ease, transform .16s ease",
              }}
            >
              <div style={{ height: 48, position: "relative", marginBottom: 8 }}>
                <div style={{ position: "absolute", left: "50%", bottom: 0, width: 46, height: 32, marginLeft: -23, background: theme.pot, clipPath: shape.clip, borderRadius: shape.radius }} />
                <div style={{ position: "absolute", left: "50%", bottom: 28, width: 52, height: 7, marginLeft: -26, background: theme.pot, clipPath: shape.rimClip, borderRadius: shape.rimRadius, transform: shape.rimT === "none" ? undefined : shape.rimT }} />
              </div>
              <div style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: -0.3 }}>{shape.name}</div>
            </div>
          );
        })}
      </div>

      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.6, opacity: 0.5, marginBottom: 12 }}>POT &amp; LIGHT</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 26 }}>
        {Object.entries(THEMES).map(([key, t]) => {
          const on = state.theme === key;
          return (
            <div
              key={key}
              onClick={() => setTheme(key)}
              style={{ display: "flex", alignItems: "center", gap: 16, background: theme.card, color: theme.cardInk, borderRadius: 24, padding: "14px 18px", cursor: "pointer", transition: "opacity .16s ease" }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 16, background: t.swatch, boxShadow: "inset 0 0 0 1px rgba(0,0,0,.1)" }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: -0.5 }}>{t.name}</div>
                <div style={{ fontSize: 12.5, fontWeight: 300, opacity: 0.6 }}>{t.note}</div>
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, opacity: on ? 0.6 : 0 }}>ON</div>
            </div>
          );
        })}
      </div>

      <div
        onClick={editName}
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, background: theme.card, color: theme.cardInk, borderRadius: 24, padding: "16px 20px", marginBottom: 10, cursor: "pointer", transition: "opacity .16s ease" }}
      >
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 3 }}>
          <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: -0.5, lineHeight: 1.2, overflowWrap: "anywhere" }}>Bud calls you {name}</div>
          <div style={{ fontSize: 12.5, fontWeight: 300, opacity: 0.6, lineHeight: 1.2 }}>Change your name</div>
        </div>
        <div style={{ flex: "none", fontSize: 11, fontWeight: 700, opacity: 0.45 }}>EDIT</div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, background: theme.card, color: theme.cardInk, borderRadius: 24, padding: "16px 20px", marginBottom: 10 }}>
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 3 }}>
          <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: -0.5, lineHeight: 1.2 }}>Kept this month</div>
          <div style={{ fontSize: 12.5, fontWeight: 300, opacity: 0.6, lineHeight: 1.3 }}>{storageNote}</div>
        </div>
        <div style={{ flex: "none", fontSize: 11, fontWeight: 700, opacity: 0.45 }}>{storageMonth}</div>
      </div>

      <div
        onClick={replayIntro}
        style={{ textAlign: "center", padding: 16, borderRadius: 999, boxShadow: `inset 0 0 0 1px ${theme.ghostLine}`, fontSize: 15, fontWeight: 400, cursor: "pointer", transition: "opacity .16s ease" }}
      >
        Replay the intro
      </div>
    </div>
  );
}
