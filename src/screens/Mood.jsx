import { MOODS, POT_SHAPES } from "../data";

export default function Mood({ bud, theme }) {
  const { state, pickMood, setPotShape, nameOrFriend, editName } = bud;
  const name = nameOrFriend(state);

  return (
    <div style={{ flex: 1, padding: "0 28px 24px", overflowY: "auto", overflowX: "hidden", WebkitOverflowScrolling: "touch" }}>
      <h1 style={{ margin: "0 0 6px", fontSize: 28, fontWeight: 700, letterSpacing: -1.68, lineHeight: 1.1 }}>How are you today?</h1>
      <div style={{ fontSize: 15, fontWeight: 400, lineHeight: 1.25, opacity: 0.7, marginBottom: 20 }}>Pick a mood and your line changes to match.</div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 9, marginBottom: 30 }}>
        {MOODS.map((m) => {
          const active = state.mood === m;
          return (
            <div
              key={m}
              onClick={() => pickMood(m)}
              style={{
                padding: "13px 20px", borderRadius: 999, fontSize: 15, fontWeight: 400, cursor: "pointer",
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

      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.6, opacity: 0.5, marginBottom: 12 }}>POT SHAPE</div>
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
                <div style={{ position: "absolute", left: "50%", bottom: 0, width: 46 * (shape.widthScale ?? 1), height: 32 * (shape.heightScale ?? 1), marginLeft: -23 * (shape.widthScale ?? 1), background: theme.pot, clipPath: shape.clip, borderRadius: shape.radius }} />
                <div style={{ position: "absolute", left: "50%", bottom: 28 * (shape.heightScale ?? 1), width: 52 * (shape.rimWidthScale ?? 1), height: 7 * (shape.rimHeightScale ?? 1), marginLeft: -26 * (shape.rimWidthScale ?? 1), background: theme.pot, clipPath: shape.rimClip, borderRadius: shape.rimRadius, transform: shape.rimT === "none" ? undefined : shape.rimT }} />
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: -0.3 }}>{shape.name}</div>
            </div>
          );
        })}
      </div>

      <div
        onClick={editName}
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, background: theme.card, color: theme.cardInk, borderRadius: 24, padding: "16px 20px", cursor: "pointer", transition: "opacity .16s ease", boxShadow: theme.cardShadow }}
      >
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 3 }}>
          <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: -0.5, lineHeight: 1.2, overflowWrap: "anywhere" }}>Bud calls you {name}</div>
          <div style={{ fontSize: 13, fontWeight: 400, opacity: 0.6, lineHeight: 1.2 }}>Change your name</div>
        </div>
        <div style={{ flex: "none", fontSize: 11, fontWeight: 600, opacity: 0.45 }}>EDIT</div>
      </div>
    </div>
  );
}
