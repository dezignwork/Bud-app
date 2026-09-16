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
// Each tab is a label over a small leaf-shaped dot that fills in when active.
export default function TabBar({ theme, screen, onGo, justSaved }) {
  return (
    <div style={{ position: "relative", display: "flex", gap: 6, padding: "0 26px 24px" }}>
      <div style={{ position: "absolute", left: "50%", bottom: 9, width: 139, height: 5, marginLeft: -69.5, borderRadius: 3, background: "currentColor", opacity: 0.3 }} />
      {TABS.map(([key, name]) => {
        const active = screen === key;
        return (
          <div
            key={key}
            onClick={() => onGo(key)}
            style={{
              flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
              padding: "12px 0 2px", cursor: "pointer",
              animation: key === "grove" && justSaved ? "tabpop .45s ease" : "none",
              transition: "opacity .16s ease",
            }}
          >
            <div style={{ fontSize: 13.5, fontWeight: 700, letterSpacing: -0.3, opacity: active ? 1 : 0.45, transition: "opacity .16s ease" }}>
              {name}
            </div>
            <div
              style={{
                width: 8, height: 8, borderRadius: "100% 0 100% 0", background: theme.leaf,
                opacity: active ? 1 : 0, transform: `scale(${active ? 1 : 0.4})`,
                transition: "opacity .16s ease, transform .16s ease",
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
