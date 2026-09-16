// A plain wooden shelf with bookend posts (screwed in at both ends),
// standing books, and a stack of lying books topped with a cup of pens and
// a paintbrush. Bleeds -28px past its container's sides to reach the screen
// edges (cancelling Today's own 28px side padding), but the plank itself
// stays inset from that.
export default function ShelfScene({ theme }) {
  const { ink, leaf, chip, pot, card, desk, deskDark } = theme;

  // Raised a little from the plank's original resting height, freeing up
  // enough room underneath for the bookend posts to visibly stick out
  // below the plank instead of nearly disappearing under it.
  const plankTop = 66;
  const deskH = 28;
  const deskDarkH = 20;
  const plankBottomY = plankTop - deskH - deskDarkH;

  // Bookend posts: pulled in from the plank's own ends (the plank overhangs
  // past them on both sides), and extend clearly below the plank's
  // underside now. Screws sit centered inside each rounded cap, not
  // straddling the tip, so they read as screwed into the post.
  const postBottom = plankBottomY - 16;
  const postTop = plankTop + 52;
  const postHeight = postTop - postBottom;
  const postWidth = 14;
  const screwSize = 6;
  const screwInset = (postWidth - screwSize) / 2;
  const screwBottomY = postBottom + 3;
  const screwTopY = postTop - screwSize - 3;

  // A thin lighter "page edge" plus a darker binding band on every book, so
  // they read as books rather than plain colored blocks.
  const pageEdge = (side) => ({
    position: "absolute", [side]: 2, top: 3, bottom: 3, width: 2.5, background: card, opacity: 0.55, borderRadius: 1,
  });
  const bindingBand = (height) => ({
    position: "absolute", left: 0, right: 0, top: Math.round(height * 0.28), height: 2, background: "rgba(0,0,0,.16)",
  });

  const standingBooks = [
    { left: 64, width: 17, height: 78, bg: leaf, rotate: 0 },
    { left: 83, width: 15, height: 66, bg: chip, rotate: 0 },
    { left: 101, width: 21, height: 94, bg: pot, rotate: -4 },
  ];

  // Stack of 4 lying books, narrowing toward the top, each a bit darker/
  // lighter than its neighbor for contrast.
  const stack = [
    { width: 58, height: 11, bg: pot },
    { width: 51, height: 10, bg: chip },
    { width: 45, height: 10, bg: leaf },
    { width: 38, height: 9, bg: chip },
  ];
  let stackY = plankTop;
  const stackRight = 62;
  const stackTops = stack.map((b) => {
    const bottom = stackY;
    stackY += b.height;
    return { ...b, bottom };
  });
  const stackTopY = stackY; // surface the cup rests on

  const cupHeight = 26;
  const penBottom = stackTopY + cupHeight - 8; // sunk 8px below the cup's rim, not below the cup itself

  return (
    <div style={{ position: "absolute", left: -28, right: -28, bottom: 0, height: 260, pointerEvents: "none" }}>
      {/* bookend posts framing the shelf, screwed in at both ends */}
      <div style={{ position: "absolute", left: 48, bottom: postBottom, width: postWidth, height: postHeight, borderRadius: 999, background: deskDark }} />
      <div style={{ position: "absolute", left: 48 + screwInset, bottom: screwBottomY, width: screwSize, height: screwSize, borderRadius: 999, background: ink }} />
      <div style={{ position: "absolute", left: 48 + screwInset, bottom: screwTopY, width: screwSize, height: screwSize, borderRadius: 999, background: ink }} />

      <div style={{ position: "absolute", right: 48, bottom: postBottom, width: postWidth, height: postHeight, borderRadius: 999, background: deskDark }} />
      <div style={{ position: "absolute", right: 48 + screwInset, bottom: screwBottomY, width: screwSize, height: screwSize, borderRadius: 999, background: ink }} />
      <div style={{ position: "absolute", right: 48 + screwInset, bottom: screwTopY, width: screwSize, height: screwSize, borderRadius: 999, background: ink }} />

      {/* standing books, left of the pot, filling the gap to the post */}
      {standingBooks.map((b, i) => (
        <div
          key={i}
          style={{
            position: "absolute", left: b.left, bottom: plankTop, width: b.width, height: b.height, background: b.bg,
            borderRadius: "4px 4px 0 0", transform: b.rotate ? `rotate(${b.rotate}deg)` : undefined, transformOrigin: "bottom center",
          }}
        >
          <div style={pageEdge("right")} />
          <div style={bindingBand(b.height)} />
        </div>
      ))}

      {/* a stack of 4 books lying flat, topped with the cup */}
      {stackTops.map((b, i) => (
        <div key={i} style={{ position: "absolute", right: stackRight, bottom: b.bottom, width: b.width, height: b.height, background: b.bg, borderRadius: 3 }}>
          <div style={{ position: "absolute", left: 6, right: 6, top: 1, height: 1.5, background: card, opacity: 0.5, borderRadius: 1 }} />
        </div>
      ))}

      {/* a cup of pens and a paintbrush, resting on top of the stack */}
      <div style={{ position: "absolute", right: stackRight - 5, bottom: stackTopY, width: 28, height: cupHeight, background: pot, borderRadius: "5px 5px 11px 11px" }} />
      <div
        style={{
          position: "absolute", right: stackRight + 2, bottom: penBottom, width: 4, height: 32, borderRadius: 2,
          background: `linear-gradient(to bottom, ${chip} 0 7px, ${leaf} 7px 100%)`,
          transform: "rotate(6deg)", transformOrigin: "bottom center",
        }}
      />
      <div
        style={{
          position: "absolute", right: stackRight - 6, bottom: penBottom + 1, width: 4, height: 34, borderRadius: 2,
          background: `linear-gradient(to bottom, ${leaf} 0 7px, ${pot} 7px 100%)`,
          transform: "rotate(-7deg)", transformOrigin: "bottom center",
        }}
      />
      {/* paintbrush: wooden handle + a bristle head flush against its top */}
      <div style={{ position: "absolute", right: stackRight - 15, bottom: penBottom, width: 4, height: 36, borderRadius: 2, background: desk, transform: "rotate(10deg)", transformOrigin: "bottom center" }} />
      <div style={{ position: "absolute", right: stackRight - 17, bottom: penBottom + 33, width: 9, height: 13, borderRadius: "50% 50% 30% 30%", background: deskDark, transform: "rotate(10deg)", transformOrigin: "bottom center" }} />

      {/* the plank, inset from the screen edges and thick */}
      <div style={{ position: "absolute", left: 22, right: 22, bottom: plankTop - deskH, height: deskH, borderRadius: 6, background: desk }} />
      <div style={{ position: "absolute", left: 22, right: 22, bottom: plankBottomY, height: deskDarkH, borderRadius: "0 0 6px 6px", background: deskDark }} />
    </div>
  );
}
