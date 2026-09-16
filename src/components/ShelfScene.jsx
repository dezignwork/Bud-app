// The plank the plant rests on. Bleeds -28px past its container's sides to
// reach the screen edges (cancelling Today's own 28px side padding).
export default function ShelfScene({ theme }) {
  const { desk, deskDark } = theme;

  return (
    <div style={{ position: "absolute", left: -28, right: -28, bottom: 0, height: 230, pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 10, right: 10, bottom: 44, height: 14, borderRadius: 5, background: desk }} />
      <div style={{ position: "absolute", left: 10, right: 10, bottom: 36, height: 9, borderRadius: "0 0 5px 5px", background: deskDark }} />
    </div>
  );
}
