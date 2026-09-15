const TABS = [
  ["today", "Today"],
  ["grove", "Grove"],
  ["journal", "Journal"],
  ["themes", "Mood"],
];

function TabRow({ theme, screen, onGo, justSaved }) {
  return (
    <div style={{ display: "flex", gap: 6, padding: "8px 20px calc(16px + env(safe-area-inset-bottom))" }}>
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

// Rendered twice: an invisible copy reserves the tab bar's exact height in
// the normal flex flow, while the real one is fixed to the true screen
// bottom — so it always sits flush with the real edge even on the odd
// frame where the app shell's own height comes up short (see App.jsx).
export default function TabBar(props) {
  return (
    <>
      <div aria-hidden="true" style={{ visibility: "hidden", pointerEvents: "none" }}>
        <TabRow {...props} />
      </div>
      <div style={{ position: "fixed", left: 0, right: 0, bottom: 0, maxWidth: 480, margin: "0 auto", background: props.theme.bg, zIndex: 10 }}>
        <TabRow {...props} />
      </div>
    </>
  );
}
