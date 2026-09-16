// A plain wooden shelf with bookend posts (screwed in at both ends), books,
// and a cup of pens/a paintbrush flanking the pot. Bleeds -28px past its
// container's sides to reach the screen edges (cancelling Today's own
// 28px side padding), but the plank itself stays inset from that.
export default function ShelfScene({ theme }) {
  const { ink, leaf, chip, pot, desk, deskDark } = theme;

  // Plank: inset from the screen edges, and thick.
  const plankTop = 58;
  const deskH = 28;
  const deskDarkH = 20;

  // Bookend posts: pulled in from the plank's own ends (the plank overhangs
  // past them on both sides), and extend a little below the plank's
  // underside. Screws sit centered inside each rounded cap, not straddling
  // the tip, so they read as screwed into the post rather than floating
  // past it.
  const postBottom = 4;
  const postHeight = 110;
  const postWidth = 14;
  const screwSize = 6;
  const screwInset = (postWidth - screwSize) / 2;
  const screwBottomY = postBottom + 3;
  const screwTopY = postBottom + postHeight - 9;

  return (
    <div style={{ position: "absolute", left: -28, right: -28, bottom: 0, height: 230, pointerEvents: "none" }}>
      {/* bookend posts framing the shelf, screwed in at both ends */}
      <div style={{ position: "absolute", left: 48, bottom: postBottom, width: postWidth, height: postHeight, borderRadius: 999, background: deskDark }} />
      <div style={{ position: "absolute", left: 48 + screwInset, bottom: screwBottomY, width: screwSize, height: screwSize, borderRadius: 999, background: ink }} />
      <div style={{ position: "absolute", left: 48 + screwInset, bottom: screwTopY, width: screwSize, height: screwSize, borderRadius: 999, background: ink }} />

      <div style={{ position: "absolute", right: 48, bottom: postBottom, width: postWidth, height: postHeight, borderRadius: 999, background: deskDark }} />
      <div style={{ position: "absolute", right: 48 + screwInset, bottom: screwBottomY, width: screwSize, height: screwSize, borderRadius: 999, background: ink }} />
      <div style={{ position: "absolute", right: 48 + screwInset, bottom: screwTopY, width: screwSize, height: screwSize, borderRadius: 999, background: ink }} />

      {/* standing books, left of the pot, filling the gap to the post */}
      <div style={{ position: "absolute", left: 64, bottom: plankTop, width: 16, height: 76, background: leaf, borderRadius: "4px 4px 0 0" }} />
      <div style={{ position: "absolute", left: 82, bottom: plankTop, width: 14, height: 64, background: chip, borderRadius: "4px 4px 0 0" }} />
      <div style={{ position: "absolute", left: 100, bottom: plankTop, width: 20, height: 92, background: pot, borderRadius: "3px 3px 0 0", transform: "rotate(-4deg)", transformOrigin: "bottom center" }} />

      {/* a small stack of books lying flat, between the pot and the cup */}
      <div style={{ position: "absolute", right: 100, bottom: plankTop, width: 34, height: 12, background: chip, borderRadius: 3 }} />
      <div style={{ position: "absolute", right: 104, bottom: plankTop + 12, width: 26, height: 11, background: leaf, borderRadius: 3 }} />

      {/* a bigger cup holding a couple of pens and a paintbrush */}
      <div style={{ position: "absolute", right: 60, bottom: plankTop, width: 40, height: 44, background: pot, borderRadius: "6px 6px 12px 12px" }} />
      {/* pen 1: barrel + a cap poking out the top */}
      <div style={{ position: "absolute", right: 66, bottom: plankTop + 30, width: 3, height: 34, borderRadius: 2, background: chip, transform: "rotate(6deg)", transformOrigin: "bottom center" }} />
      <div style={{ position: "absolute", right: 65, bottom: plankTop + 60, width: 5, height: 7, borderRadius: 1, background: leaf, transform: "rotate(6deg)", transformOrigin: "bottom center" }} />
      {/* pen 2 */}
      <div style={{ position: "absolute", right: 77, bottom: plankTop + 31, width: 3, height: 37, borderRadius: 2, background: pot, transform: "rotate(-8deg)", transformOrigin: "bottom center" }} />
      <div style={{ position: "absolute", right: 79, bottom: plankTop + 65, width: 5, height: 7, borderRadius: 1, background: chip, transform: "rotate(-8deg)", transformOrigin: "bottom center" }} />
      {/* a longer paintbrush: wooden handle + a bristle head */}
      <div style={{ position: "absolute", right: 88, bottom: plankTop + 28, width: 4, height: 42, borderRadius: 2, background: desk, transform: "rotate(10deg)", transformOrigin: "bottom center" }} />
      <div style={{ position: "absolute", right: 86, bottom: plankTop + 66, width: 9, height: 13, borderRadius: "50% 50% 30% 30%", background: deskDark, transform: "rotate(10deg)", transformOrigin: "bottom center" }} />

      {/* the plank, inset from the screen edges and thick */}
      <div style={{ position: "absolute", left: 22, right: 22, bottom: plankTop - deskH, height: deskH, borderRadius: 6, background: desk }} />
      <div style={{ position: "absolute", left: 22, right: 22, bottom: plankTop - deskH - deskDarkH, height: deskDarkH, borderRadius: "0 0 6px 6px", background: deskDark }} />
    </div>
  );
}
