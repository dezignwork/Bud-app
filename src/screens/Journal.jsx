const DeleteIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
    <path d="M2.5 4h11" /><path d="M6 4V2.6h4V4" /><path d="M3.8 4l.7 9.1a1 1 0 0 0 1 .9h5a1 1 0 0 0 1-.9L12.2 4" /><path d="M6.6 6.6v5M9.4 6.6v5" />
  </svg>
);

// A tiny desk-lamp flourish standing beside the draft card's top-right
// corner — the shade pokes up above the card, the pole and base stand in
// the margin beside it — in the same desk/deskDark wood tones as Today's
// shelf, so Journal reads as a desk in the same room Bud lives in, not a
// bare card on flat ground.
function DeskLampAccent({ theme }) {
  const glow = `radial-gradient(circle, color-mix(in oklab, ${theme.desk}, #fff 55%) 0%, transparent 72%)`;
  return (
    <div style={{ position: "absolute", top: 33, right: 4, width: 46, height: 46, pointerEvents: "none" }} aria-hidden="true">
      <div style={{ position: "absolute", left: 10, top: 14, width: 32, height: 32, background: glow, opacity: 0.6 }} />
      <div style={{ position: "absolute", left: 10, top: 0, width: 24, height: 18, background: theme.desk, clipPath: "polygon(10% 0,90% 0,100% 100%,0% 100%)" }} />
      <div style={{ position: "absolute", left: 26, top: 14, width: 4, height: 22, background: theme.deskDark, borderRadius: 2 }} />
      <div style={{ position: "absolute", left: 24, top: 34, width: 20, height: 6, background: theme.deskDark, borderRadius: 3 }} />
    </div>
  );
}

export default function Journal({ bud, theme }) {
  const { state, setDraft, clearEntry, saveEntry, togglePloon, toggleEditEntries, removeEntry } = bud;
  const wordCount = state.draft.trim() ? state.draft.trim().split(/\s+/).length + " words" : "";
  const actionOpacity = state.draft.trim() ? 1 : 0.5;
  const journalMinH = state.ploon ? 452 : 190;
  const journalPh = state.ploon ? "Let's go animal mode." : "";
  const showEntries = !state.ploon;
  const journalDate = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }).toUpperCase();
  const chipGrad = `linear-gradient(180deg, ${theme.chip}, color-mix(in oklab, ${theme.chip}, #094020 22%))`;

  return (
    <div style={{ flex: 1, padding: "0 28px 24px", overflowY: "auto", overflowX: "hidden", display: "flex", flexDirection: "column", position: "relative" }}>
      <DeskLampAccent theme={theme} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, marginBottom: 22 }}>
        <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: -1.68, lineHeight: 1.1 }}>Journal</div>
        <div
          onClick={togglePloon}
          style={{
            flex: "none", padding: "7px 14px", borderRadius: 999, background: state.ploon ? theme.chip : "transparent",
            color: state.ploon ? theme.chipInk : theme.ink, boxShadow: `inset 0 0 0 1.5px ${theme.chip}`,
            fontSize: 13, fontWeight: 600, letterSpacing: -0.3, cursor: "pointer", transition: "opacity .16s ease, transform .16s ease",
          }}
        >
          Ploon Mode
        </div>
      </div>

      <div style={{ position: "relative", zIndex: 1, background: theme.card, color: theme.cardInk, borderRadius: 32, padding: "22px 24px 18px", marginBottom: 16, boxShadow: theme.cardShadow }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.6, opacity: 0.5, marginBottom: 10 }}>{journalDate}</div>
        <textarea
          value={state.draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={journalPh}
          style={{
            width: "100%", boxSizing: "border-box", minHeight: journalMinH, resize: "none", border: "none",
            outline: "none", background: "transparent", color: theme.cardInk, fontFamily: "inherit",
            fontSize: 17, fontWeight: 300, lineHeight: 1.35,
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
          <div style={{ flex: 1, fontSize: 11, fontWeight: 400, opacity: 0.5 }}>{wordCount}</div>
          <div
            onClick={clearEntry}
            style={{ padding: "9px 18px", borderRadius: 999, boxShadow: `inset 0 0 0 1.5px ${theme.chip}`, color: theme.cardInk, fontSize: 13, fontWeight: 600, cursor: "pointer", opacity: actionOpacity, transition: "opacity .16s ease, transform .16s ease" }}
          >
            Clear
          </div>
          <div
            onClick={saveEntry}
            style={{ padding: "9px 18px", borderRadius: 999, background: chipGrad, color: theme.chipInk, fontSize: 13, fontWeight: 600, cursor: "pointer", opacity: actionOpacity, transition: "opacity .16s ease, transform .16s ease" }}
          >
            Save
          </div>
        </div>
      </div>

      {showEntries && (
        <>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.6, opacity: 0.5 }}>EARLIER</div>
            <div onClick={toggleEditEntries} style={{ fontSize: 11, fontWeight: 600, opacity: 0.5, cursor: "pointer", transition: "opacity .16s ease" }}>
              {state.editingEntries ? "DONE" : "EDIT"}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {state.entries.map((e, i) => (
              <div key={i} style={{ background: theme.card, color: theme.cardInk, borderRadius: 20, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14, boxShadow: theme.cardShadow }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.6, opacity: 0.45, marginBottom: 6 }}>{e.d}</div>
                  <div style={{ fontSize: 15, fontWeight: 400, lineHeight: 1.35 }}>{e.t}</div>
                </div>
                {state.editingEntries && (
                  <div
                    onClick={() => removeEntry(i)}
                    style={{ flex: "0 0 auto", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", opacity: 0.4, transition: "opacity .16s ease, transform .16s ease" }}
                  >
                    <DeleteIcon />
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
