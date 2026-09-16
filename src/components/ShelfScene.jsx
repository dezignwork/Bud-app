// A plain wooden shelf with bookend posts (with screw-cap ends), a few
// books, and a pencil cup flanking the pot. Bleeds -28px past its
// container's sides to reach the screen edges (cancelling Today's own
// 28px side padding), but the plank itself stays inset from that.
export default function ShelfScene({ theme }) {
  const { ink, leaf, chip, pot, desk, deskDark } = theme;

  // Bookend posts: pulled in from the plank's own ends (the plank overhangs
  // past them on both sides), and extend a little below the plank's
  // underside rather than stopping flush with it.
  const postBottom = 26;
  const postHeight = 90;
  const postWidth = 12;
  const screwSize = 7;
  const screwInset = (postWidth - screwSize) / 2;

  return (
    <div style={{ position: "absolute", left: -28, right: -28, bottom: 0, height: 230, pointerEvents: "none" }}>
      {/* bookend posts framing the shelf, with a screw at each end */}
      <div style={{ position: "absolute", left: 48, bottom: postBottom, width: postWidth, height: postHeight, borderRadius: 999, background: deskDark }} />
      <div style={{ position: "absolute", left: 48 + screwInset, bottom: postBottom - screwSize / 2, width: screwSize, height: screwSize, borderRadius: 999, background: ink }} />
      <div style={{ position: "absolute", left: 48 + screwInset, bottom: postBottom + postHeight - screwSize / 2, width: screwSize, height: screwSize, borderRadius: 999, background: ink }} />

      <div style={{ position: "absolute", right: 48, bottom: postBottom, width: postWidth, height: postHeight, borderRadius: 999, background: deskDark }} />
      <div style={{ position: "absolute", right: 48 + screwInset, bottom: postBottom - screwSize / 2, width: screwSize, height: screwSize, borderRadius: 999, background: ink }} />
      <div style={{ position: "absolute", right: 48 + screwInset, bottom: postBottom + postHeight - screwSize / 2, width: screwSize, height: screwSize, borderRadius: 999, background: ink }} />

      {/* standing books, left of the pot, just inside the left post */}
      <div style={{ position: "absolute", left: 64, bottom: 58, width: 12, height: 50, background: leaf, borderRadius: "4px 4px 0 0" }} />
      <div style={{ position: "absolute", left: 78, bottom: 58, width: 10, height: 42, background: chip, borderRadius: "4px 4px 0 0" }} />
      <div style={{ position: "absolute", left: 90, bottom: 58, width: 13, height: 58, background: pot, borderRadius: "3px 3px 0 0", transform: "rotate(-4deg)", transformOrigin: "bottom center" }} />

      {/* a couple of books lying flat, just inside the right post */}
      <div style={{ position: "absolute", right: 64, bottom: 58, width: 46, height: 9, background: chip, borderRadius: 3 }} />
      <div style={{ position: "absolute", right: 68, bottom: 67, width: 38, height: 8, background: leaf, borderRadius: 3 }} />

      {/* a cup of pencils, closest to the pot */}
      <div style={{ position: "absolute", right: 112, bottom: 58, width: 24, height: 26, background: pot, borderRadius: "4px 4px 8px 8px" }} />
      <div style={{ position: "absolute", right: 117, bottom: 82, width: 2, height: 20, borderRadius: 2, background: chip, transform: "rotate(4deg)" }} />
      <div style={{ position: "absolute", right: 122, bottom: 82, width: 2, height: 18, borderRadius: 2, background: leaf, transform: "rotate(-8deg)" }} />
      <div style={{ position: "absolute", right: 127, bottom: 81, width: 2, height: 16, borderRadius: 2, background: pot, transform: "rotate(12deg)" }} />

      {/* the plank, inset from the screen edges and a bit thicker */}
      <div style={{ position: "absolute", left: 22, right: 22, bottom: 44, height: 14, borderRadius: 5, background: desk }} />
      <div style={{ position: "absolute", left: 22, right: 22, bottom: 34, height: 10, borderRadius: "0 0 5px 5px", background: deskDark }} />
    </div>
  );
}
