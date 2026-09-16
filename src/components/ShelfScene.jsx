// The plank the plant rests on, hung by two ropes. No vine decoration (that
// was pulled per feedback) — just the plank and the cords holding it.
// The ropes fade out before they'd ever reach the quote text: longer quotes
// need more room, so the right rope's fade point shifts up to make way for
// it. The left one stays put at a fixed point regardless of quote length.
export default function ShelfScene({ theme, quoteLength = 0 }) {
  const { rope, desk, deskDark } = theme;

  const leftFade = 55;
  const rightFade = Math.max(30, Math.min(60, 62 - quoteLength / 4));

  return (
    <div style={{ position: "absolute", left: -28, right: -28, bottom: 0, height: 230, pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 36, bottom: 58, width: 4, height: 300, borderRadius: 2, background: `linear-gradient(to top, ${rope} 0%, ${rope} ${leftFade}%, transparent 100%)` }} />
      <div style={{ position: "absolute", right: 36, bottom: 58, width: 4, height: 300, borderRadius: 2, background: `linear-gradient(to top, ${rope} 0%, ${rope} ${rightFade}%, transparent 100%)` }} />
      <div style={{ position: "absolute", left: 31, bottom: 52, width: 14, height: 14, borderRadius: 999, background: rope }} />
      <div style={{ position: "absolute", right: 31, bottom: 52, width: 14, height: 14, borderRadius: 999, background: rope }} />

      <div style={{ position: "absolute", left: 10, right: 10, bottom: 44, height: 14, borderRadius: 5, background: desk }} />
      <div style={{ position: "absolute", left: 10, right: 10, bottom: 36, height: 9, borderRadius: "0 0 5px 5px", background: deskDark }} />
    </div>
  );
}
