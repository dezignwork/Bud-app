const TABS = [
  ["today", "Today"],
  ["grove", "Grove"],
  ["journal", "Journal"],
  ["themes", "Mood"],
];

// Lives at the top of the app, right under the date/streak row, instead of
// pinned to the bottom — nothing here needs to reach the true bottom edge
// of the screen, so it's a plain normal-flow row with none of the
// bottom-safe-area or fixed-position handling that a bottom bar would need.
export default function TabBar({ theme, screen, onGo, justSaved }) {
  return (
    <div style={{ display: "flex", gap: 6, padding: "0 26px 16px" }}>
      {TABS.map(([key, name]) => {
        const active = screen === key;
        return (
          <div
            key={key}
            onClick={() => onGo(key)}
            style={{
              flex: 1, textAlign: "center", padding: "13px 0", borderRadius: 999, fontSize: 13.5,
              fontWeight: 700, letterSpacing: -0.3, cursor: "pointer",
              background: active ? theme.btnBg : "transparent", color: active ? theme.btnFg : theme.ink,
              animation: key === "grove" && justSaved ? "tabpop .45s ease" : "none",
              transition: "opacity .16s ease",
            }}
          >
            {name}
          </div>
        );
      })}
    </div>
  );
}
