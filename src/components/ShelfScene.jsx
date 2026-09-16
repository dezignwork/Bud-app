// A plain wooden shelf with a few books and a pencil cup flanking the pot —
// no ropes. Bleeds -28px past its container's sides to reach the screen
// edges (cancelling Today's own 28px side padding).
export default function ShelfScene({ theme }) {
  const { leaf, chip, pot, desk, deskDark } = theme;

  return (
    <div style={{ position: "absolute", left: -28, right: -28, bottom: 0, height: 230, pointerEvents: "none" }}>
      {/* bookend posts framing the shelf */}
      <div style={{ position: "absolute", left: 20, bottom: 40, width: 14, height: 108, borderRadius: 999, background: deskDark }} />
      <div style={{ position: "absolute", right: 20, bottom: 40, width: 14, height: 108, borderRadius: 999, background: deskDark }} />

      {/* standing books, left of the pot */}
      <div style={{ position: "absolute", left: 46, bottom: 58, width: 16, height: 70, background: leaf, borderRadius: "4px 4px 0 0" }} />
      <div style={{ position: "absolute", left: 64, bottom: 58, width: 14, height: 58, background: chip, borderRadius: "4px 4px 0 0" }} />
      <div style={{ position: "absolute", left: 80, bottom: 58, width: 18, height: 80, background: pot, borderRadius: "3px 3px 0 0", transform: "rotate(-4deg)", transformOrigin: "bottom center" }} />

      {/* a couple of books lying flat, right of the pot */}
      <div style={{ position: "absolute", right: 96, bottom: 58, width: 64, height: 12, background: chip, borderRadius: 3 }} />
      <div style={{ position: "absolute", right: 102, bottom: 70, width: 52, height: 11, background: leaf, borderRadius: 3 }} />

      {/* a cup of pencils */}
      <div style={{ position: "absolute", right: 50, bottom: 58, width: 30, height: 34, background: pot, borderRadius: "4px 4px 10px 10px" }} />
      <div style={{ position: "absolute", right: 56, bottom: 88, width: 2, height: 24, borderRadius: 2, background: chip, transform: "rotate(4deg)" }} />
      <div style={{ position: "absolute", right: 62, bottom: 88, width: 2, height: 22, borderRadius: 2, background: leaf, transform: "rotate(-8deg)" }} />
      <div style={{ position: "absolute", right: 68, bottom: 87, width: 2, height: 20, borderRadius: 2, background: pot, transform: "rotate(12deg)" }} />

      {/* the plank */}
      <div style={{ position: "absolute", left: 10, right: 10, bottom: 48, height: 10, borderRadius: 4, background: desk }} />
      <div style={{ position: "absolute", left: 10, right: 10, bottom: 40, height: 8, borderRadius: "0 0 4px 4px", background: deskDark }} />
    </div>
  );
}
