const TABS = [
  ["today", "Today"],
  ["grove", "Grove"],
  ["journal", "Journal"],
  ["themes", "Mood"],
];

export default function TabBar({ theme, screen, onGo, justSaved }) {
  return (
    <div style={{ display: "flex", gap: 6, padding: "8px 20px calc(14px + env(safe-area-inset-bottom))", position: "relative" }}>
      <div style={{ position: "absolute", left: "50%", bottom: "calc(9px + env(safe-area-inset-bottom))", width: 139, height: 5, marginLeft: -69.5, borderRadius: 3, background: "currentColor", opacity: 0.3 }} />
      {TABS.map(([key, name]) => {
        const active = screen === key;
        return (
          <div
            key={key}
            onClick={() => onGo(key)}
            style={{
              flex: 1, textAlign: "center", padding: "15px 0", borderRadius: 999, fontSize: 13.5,
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
