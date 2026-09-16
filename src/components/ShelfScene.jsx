// Ropes, a climbing vine, and a woven wooden plank behind the plant on the
// Today screen. Bleeds -28px past its container's sides to reach the
// screen edges (cancelling Today's own 28px side padding).
export default function ShelfScene({ theme }) {
  const { rope, grassDeep, grassMid, grassSpeck, desk, deskDark } = theme;

  return (
    <div style={{ position: "absolute", left: -28, right: -28, bottom: 0, height: 230, pointerEvents: "none" }}>
      {/* rope cords, faded out at the top so they never reach the quote */}
      <div style={{ position: "absolute", left: 36, bottom: 58, width: 4, height: 300, borderRadius: 2, background: `linear-gradient(to top, ${rope} 0%, ${rope} 52%, transparent 100%)` }} />
      <div style={{ position: "absolute", right: 36, bottom: 58, width: 4, height: 300, borderRadius: 2, background: `linear-gradient(to top, ${rope} 0%, ${rope} 52%, transparent 100%)` }} />
      <div style={{ position: "absolute", left: 31, bottom: 52, width: 14, height: 14, borderRadius: 999, background: rope }} />
      <div style={{ position: "absolute", right: 31, bottom: 52, width: 14, height: 14, borderRadius: 999, background: rope }} />

      {/* vine spiralling up the left rope: alternating half-arcs, fading as it climbs */}
      <div style={{ position: "absolute", left: 24, bottom: 58, width: 14, display: "flex", flexDirection: "column-reverse" }}>
        <div style={{ height: 19, boxSizing: "border-box", borderLeft: `3px solid ${grassDeep}`, borderRadius: "999px 0 0 999px", opacity: 1 }} />
        <div style={{ height: 19 }} />
        <div style={{ height: 19, boxSizing: "border-box", borderLeft: `3px solid ${grassDeep}`, borderRadius: "999px 0 0 999px", opacity: 0.8 }} />
        <div style={{ height: 19 }} />
        <div style={{ height: 19, boxSizing: "border-box", borderLeft: `3px solid ${grassDeep}`, borderRadius: "999px 0 0 999px", opacity: 0.6 }} />
        <div style={{ height: 19 }} />
        <div style={{ height: 19, boxSizing: "border-box", borderLeft: `3px solid ${grassDeep}`, borderRadius: "999px 0 0 999px", opacity: 0.4 }} />
        <div style={{ height: 19 }} />
      </div>
      <div style={{ position: "absolute", left: 38, bottom: 58, width: 14, display: "flex", flexDirection: "column-reverse" }}>
        <div style={{ height: 19 }} />
        <div style={{ height: 19, boxSizing: "border-box", borderRight: `3px solid ${grassMid}`, borderRadius: "0 999px 999px 0", opacity: 0.9 }} />
        <div style={{ height: 19 }} />
        <div style={{ height: 19, boxSizing: "border-box", borderRight: `3px solid ${grassMid}`, borderRadius: "0 999px 999px 0", opacity: 0.7 }} />
        <div style={{ height: 19 }} />
        <div style={{ height: 19, boxSizing: "border-box", borderRight: `3px solid ${grassMid}`, borderRadius: "0 999px 999px 0", opacity: 0.5 }} />
        <div style={{ height: 19 }} />
        <div style={{ height: 19, boxSizing: "border-box", borderRight: `3px solid ${grassMid}`, borderRadius: "0 999px 999px 0", opacity: 0.3 }} />
      </div>
      <div style={{ position: "absolute", left: 18, bottom: 96, width: 13, height: 8, background: grassMid, borderRadius: "0 100% 0 100%" }} />
      <div style={{ position: "absolute", left: 48, bottom: 134, width: 13, height: 8, background: grassDeep, borderRadius: "100% 0 100% 0", opacity: 0.8 }} />
      <div style={{ position: "absolute", left: 18, bottom: 172, width: 12, height: 8, background: grassMid, borderRadius: "0 100% 0 100%", opacity: 0.6 }} />

      {/* decorative curls at the plank ends */}
      <div style={{ position: "absolute", left: 44, bottom: 58, width: 30, height: 30, boxSizing: "border-box", borderTop: `3.5px solid ${grassDeep}`, borderRight: `3.5px solid ${grassDeep}`, borderRadius: "0 30px 0 0" }} />
      <div style={{ position: "absolute", left: 70, bottom: 58, width: 22, height: 22, boxSizing: "border-box", borderTop: `3.5px solid ${grassMid}`, borderLeft: `3.5px solid ${grassMid}`, borderRadius: "22px 0 0 0" }} />
      <div style={{ position: "absolute", left: 38, bottom: 84, width: 16, height: 10, background: grassMid, borderRadius: "0 100% 0 100%" }} />
      <div style={{ position: "absolute", left: 84, bottom: 76, width: 15, height: 10, background: grassDeep, borderRadius: "100% 0 100% 0" }} />
      <div style={{ position: "absolute", left: 58, bottom: 70, width: 9, height: 9, borderRadius: 999, background: grassSpeck }} />
      <div style={{ position: "absolute", right: 46, bottom: 58, width: 34, height: 34, boxSizing: "border-box", borderTop: `3.5px solid ${grassDeep}`, borderLeft: `3.5px solid ${grassDeep}`, borderRadius: "34px 0 0 0" }} />
      <div style={{ position: "absolute", right: 76, bottom: 58, width: 20, height: 20, boxSizing: "border-box", borderTop: `3.5px solid ${grassMid}`, borderRight: `3.5px solid ${grassMid}`, borderRadius: "0 20px 0 0" }} />
      <div style={{ position: "absolute", right: 40, bottom: 88, width: 16, height: 10, background: grassMid, borderRadius: "100% 0 100% 0" }} />
      <div style={{ position: "absolute", right: 90, bottom: 74, width: 15, height: 10, background: grassDeep, borderRadius: "0 100% 0 100%" }} />
      <div style={{ position: "absolute", right: 62, bottom: 72, width: 9, height: 9, borderRadius: 999, background: grassSpeck }} />

      {/* the plank */}
      <div style={{ position: "absolute", left: 10, right: 10, bottom: 44, height: 14, borderRadius: 5, background: desk }} />
      <div style={{ position: "absolute", left: 10, right: 10, bottom: 36, height: 9, borderRadius: "0 0 5px 5px", background: deskDark }} />

      {/* continuous over/under helix wrapping the plank: top arcs + offset bottom arcs */}
      <div style={{ position: "absolute", left: 10, right: 10, bottom: 51, height: 14, display: "flex", alignItems: "flex-end" }}>
        <div style={{ flex: 1, height: 14, boxSizing: "border-box", borderTop: `3px solid ${grassDeep}`, borderRadius: "999px 999px 0 0" }} />
        <div style={{ flex: 1 }} />
        <div style={{ flex: 1, height: 14, boxSizing: "border-box", borderTop: `3px solid ${grassMid}`, borderRadius: "999px 999px 0 0" }} />
        <div style={{ flex: 1 }} />
        <div style={{ flex: 1, height: 14, boxSizing: "border-box", borderTop: `3px solid ${grassDeep}`, borderRadius: "999px 999px 0 0" }} />
        <div style={{ flex: 1 }} />
        <div style={{ flex: 1, height: 14, boxSizing: "border-box", borderTop: `3px solid ${grassMid}`, borderRadius: "999px 999px 0 0" }} />
        <div style={{ flex: 1 }} />
        <div style={{ flex: 1, height: 14, boxSizing: "border-box", borderTop: `3px solid ${grassDeep}`, borderRadius: "999px 999px 0 0" }} />
        <div style={{ flex: 1 }} />
        <div style={{ flex: 1, height: 14, boxSizing: "border-box", borderTop: `3px solid ${grassMid}`, borderRadius: "999px 999px 0 0" }} />
        <div style={{ flex: 1 }} />
      </div>
      <div style={{ position: "absolute", left: 10, right: 10, bottom: 37, height: 14, display: "flex", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }} />
        <div style={{ flex: 1, height: 14, boxSizing: "border-box", borderBottom: `3px solid ${grassDeep}`, borderRadius: "0 0 999px 999px" }} />
        <div style={{ flex: 1 }} />
        <div style={{ flex: 1, height: 14, boxSizing: "border-box", borderBottom: `3px solid ${grassMid}`, borderRadius: "0 0 999px 999px" }} />
        <div style={{ flex: 1 }} />
        <div style={{ flex: 1, height: 14, boxSizing: "border-box", borderBottom: `3px solid ${grassDeep}`, borderRadius: "0 0 999px 999px" }} />
        <div style={{ flex: 1 }} />
        <div style={{ flex: 1, height: 14, boxSizing: "border-box", borderBottom: `3px solid ${grassMid}`, borderRadius: "0 0 999px 999px" }} />
        <div style={{ flex: 1 }} />
        <div style={{ flex: 1, height: 14, boxSizing: "border-box", borderBottom: `3px solid ${grassDeep}`, borderRadius: "0 0 999px 999px" }} />
        <div style={{ flex: 1 }} />
        <div style={{ flex: 1, height: 14, boxSizing: "border-box", borderBottom: `3px solid ${grassMid}`, borderRadius: "0 0 999px 999px" }} />
      </div>
      <div style={{ position: "absolute", left: 10, bottom: 64, width: 14, height: 9, background: grassMid, borderRadius: "0 100% 0 100%" }} />
      <div style={{ position: "absolute", left: 100, bottom: 64, width: 14, height: 9, background: grassDeep, borderRadius: "100% 0 100% 0" }} />
      <div style={{ position: "absolute", right: 38, bottom: 64, width: 14, height: 9, background: grassMid, borderRadius: "100% 0 100% 0" }} />
      <div style={{ position: "absolute", right: 128, bottom: 64, width: 14, height: 9, background: grassDeep, borderRadius: "0 100% 0 100%" }} />
    </div>
  );
}
