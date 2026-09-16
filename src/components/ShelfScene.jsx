// A plain wooden shelf with a few books and a pencil cup flanking the pot —
// no ropes. Bleeds -28px past its container's sides to reach the screen
// edges (cancelling Today's own 28px side padding).
export default function ShelfScene({ theme }) {
  const { leaf, chip, pot, desk, deskDark } = theme;

  return (
    <div style={{ position: "absolute", left: -28, right: -28, bottom: 0, height: 230, pointerEvents: "none" }}>
      {/* standing books, left of the pot */}
      <div style={{ position: "absolute", left: 22, bottom: 58, width: 16, height: 70, background: leaf, borderRadius: "4px 4px 0 0" }} />
      <div style={{ position: "absolute", left: 40, bottom: 58, width: 14, height: 58, background: chip, borderRadius: "4px 4px 0 0" }} />
      <div style={{ position: "absolute", left: 56, bottom: 58, width: 18, height: 80, background: pot, borderRadius: "3px 3px 0 0", transform: "rotate(-4deg)", transformOrigin: "bottom center" }} />

      {/* a couple of books lying flat, right of the pot */}
      <div style={{ position: "absolute", right: 70, bottom: 58, width: 64, height: 12, background: chip, borderRadius: 3 }} />
      <div style={{ position: "absolute", right: 76, bottom: 70, width: 52, height: 11, background: leaf, borderRadius: 3 }} />

      {/* a cup of pencils */}
      <div style={{ position: "absolute", right: 24, bottom: 58, width: 30, height: 34, background: pot, borderRadius: "4px 4px 10px 10px" }} />
      <div style={{ position: "absolute", right: 30, bottom: 88, width: 2, height: 24, borderRadius: 2, background: chip, transform: "rotate(4deg)" }} />
      <div style={{ position: "absolute", right: 36, bottom: 88, width: 2, height: 22, borderRadius: 2, background: leaf, transform: "rotate(-8deg)" }} />
      <div style={{ position: "absolute", right: 42, bottom: 87, width: 2, height: 20, borderRadius: 2, background: pot, transform: "rotate(12deg)" }} />

      {/* the plank */}
      <div style={{ position: "absolute", left: 10, right: 10, bottom: 44, height: 14, borderRadius: 5, background: desk }} />
      <div style={{ position: "absolute", left: 10, right: 10, bottom: 36, height: 9, borderRadius: "0 0 5px 5px", background: deskDark }} />
    </div>
  );
}
