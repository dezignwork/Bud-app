import { dateKey } from "../storage";

const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];

// A tiny potted-plant flourish for the header corner — not Bud (no face),
// just a plain little plant so this screen reads as part of the same room
// as Today's shelf instead of a bare list on a flat background.
function PottedCornerAccent({ theme }) {
  return (
    <div style={{ position: "absolute", top: 2, right: 8, width: 40, height: 50, pointerEvents: "none" }} aria-hidden="true">
      <div style={{ position: "absolute", left: 15, top: 4, width: 4, height: 15, background: theme.leaf, borderRadius: 2 }} />
      <div style={{ position: "absolute", left: 4, top: 2, width: 17, height: 11, background: theme.leaf, borderRadius: "100% 0 100% 0", transform: "rotate(-20deg)" }} />
      <div style={{ position: "absolute", left: 17, top: 0, width: 19, height: 12, background: theme.leaf, borderRadius: "100% 0 100% 0", transform: "rotate(16deg)" }} />
      <div style={{ position: "absolute", left: 2, top: 19, width: 30, height: 6, background: `color-mix(in oklab, ${theme.pot}, #000 16%)`, borderRadius: "3px 3px 0 0" }} />
      <div style={{ position: "absolute", left: 4, top: 23, width: 26, height: 20, background: theme.pot, clipPath: "polygon(6% 0,94% 0,82% 100%,18% 100%)" }} />
    </div>
  );
}

function buildMonth(openedDates, theme) {
  const now = new Date();
  const y = now.getFullYear(), mo = now.getMonth();
  const total = new Date(y, mo + 1, 0).getDate();
  const lead = (new Date(y, mo, 1).getDay() + 6) % 7; // Monday-first
  const opened = new Set(openedDates);
  const dim = "rgba(0,0,0,.13)";
  const cells = [];
  for (let i = 0; i < lead; i++) cells.push({ bg: "transparent" });
  let openCount = 0;
  for (let d = 1; d <= total; d++) {
    const on = opened.has(dateKey(new Date(y, mo, d)));
    if (on) openCount++;
    cells.push({ bg: on ? theme.leaf : dim });
  }
  return {
    cells, openCount, total,
    monthLabel: now.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
  };
}

export default function Grove({ bud, theme }) {
  const { state, nameOrFriend, toggleEditSaved, removeSaved } = bud;
  const name = nameOrFriend(state);
  const { cells, openCount, total, monthLabel } = buildMonth(state.openedDates, theme);

  return (
    <div style={{ flex: 1, padding: "0 28px 24px", overflowY: "auto", overflowX: "hidden", WebkitOverflowScrolling: "touch", position: "relative" }}>
      <PottedCornerAccent theme={theme} />
      <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: -1.68, lineHeight: 1.1, marginBottom: 22 }}>{name}’s grove</div>

      <div style={{ background: theme.card, borderRadius: 40, padding: "26px 24px", marginBottom: 18, boxShadow: theme.cardShadow }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: -0.5, color: theme.cardInk }}>{monthLabel}</div>
          <div style={{ fontSize: 11, fontWeight: 600, color: theme.cardInk, opacity: 0.45 }}>{openCount} of {total} days</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 6, marginBottom: 8 }}>
          {WEEKDAYS.map((w, i) => (
            <div key={i} style={{ textAlign: "center", fontSize: 11, fontWeight: 600, color: theme.cardInk, opacity: 0.4 }}>{w}</div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 6 }}>
          {cells.map((c, i) => (
            <div key={i} style={{ height: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 18, height: 18, borderRadius: "100% 0 100% 0", background: c.bg }} />
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.6, opacity: 0.5 }}>LINES YOU KEPT</div>
        <div onClick={toggleEditSaved} style={{ fontSize: 11, fontWeight: 600, opacity: 0.5, cursor: "pointer", transition: "opacity .16s ease" }}>
          {state.editingSaved ? "DONE" : "EDIT"}
        </div>
      </div>

      {state.saved.length === 0 ? (
        <div style={{ background: theme.card, color: theme.cardInk, borderRadius: 20, padding: 20, fontSize: 15, fontWeight: 400, lineHeight: 1.35, opacity: 0.7, boxShadow: theme.cardShadow }}>
          Nothing kept yet. Tap “Keep” on a line you'd like to come back to.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {state.saved.map((line) => (
            <div key={line} style={{ background: theme.card, color: theme.cardInk, borderRadius: 20, padding: "16px 20px", display: "flex", justifyContent: "space-between", gap: 14, alignItems: "center", boxShadow: theme.cardShadow }}>
              <span style={{ fontSize: 15, fontWeight: 400, lineHeight: 1.25 }}>{line}</span>
              {state.editingSaved && (
                <div
                  onClick={() => removeSaved(line)}
                  style={{ flex: "0 0 auto", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", opacity: 0.4, transition: "opacity .16s ease, transform .16s ease" }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                    <path d="M2.5 4h11" /><path d="M6 4V2.6h4V4" /><path d="M3.8 4l.7 9.1a1 1 0 0 0 1 .9h5a1 1 0 0 0 1-.9L12.2 4" /><path d="M6.6 6.6v5M9.4 6.6v5" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
