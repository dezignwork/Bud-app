// A plain wooden shelf with bookend posts (screwed in at both ends),
// standing books, and a stack of lying books topped with a cup holding a
// pencil, a pen, and a marker. Bleeds -28px past its container's sides to
// reach the screen edges (cancelling Today's own 28px side padding), but
// the plank itself stays inset from that.
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

  // Stack of 4 lying books, as thick and clearly-defined as the standing
  // ones — just arranged flat instead of upright.
  const stack = [
    { width: 62, height: 18, bg: pot },
    { width: 54, height: 16, bg: chip },
    { width: 47, height: 15, bg: leaf },
    { width: 40, height: 14, bg: chip },
  ];
  let stackY = plankTop;
  const stackRight = 62;
  const stackTops = stack.map((b) => {
    const bottom = stackY;
    stackY += b.height;
    return { ...b, bottom };
  });
  const stackTopY = stackY; // surface the cup rests on

  // Cup centered on the top (narrowest) book, not off toward the post.
  const topBookWidth = stack[stack.length - 1].width;
  const cupWidth = 34;
  const cupHeight = 28;
  const cupRight = stackRight + topBookWidth / 2 - cupWidth / 2;
  const toolCenter = stackRight + topBookWidth / 2;
  const toolBottom = stackTopY + cupHeight - 9; // sunk below the cup's rim, not below the cup itself

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
          <div style={{ position: "absolute", left: 5, top: 2, bottom: 2, width: 2.5, background: card, opacity: 0.5, borderRadius: 1 }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 1.5, height: 1.5, background: "rgba(0,0,0,.14)" }} />
        </div>
      ))}

      {/* a cylindrical cup, centered on the stack, holding a pencil/pen/marker */}
      <div style={{ position: "absolute", right: cupRight, bottom: stackTopY, width: cupWidth, height: cupHeight, background: pot, borderRadius: "3px 3px 7px 7px" }} />
      <div style={{ position: "absolute", right: cupRight + 2, bottom: stackTopY + cupHeight - 5, width: cupWidth - 4, height: 3, background: card, opacity: 0.5, borderRadius: 2 }} />

      {/* pencil: thin shaft with a pointed wood-tone tip */}
      <div style={{ position: "absolute", right: toolCenter - 3, bottom: toolBottom, width: 3, height: 26, borderRadius: 1.5, background: chip, transform: "rotate(-9deg)", transformOrigin: "bottom center" }} />
      <div style={{ position: "absolute", right: toolCenter - 4, bottom: toolBottom + 25, width: 0, height: 0, borderLeft: "2.5px solid transparent", borderRight: "2.5px solid transparent", borderBottom: `7px solid ${desk}`, transform: "rotate(-9deg)", transformOrigin: "bottom center" }} />

      {/* pen: shaft with a capped top */}
      <div style={{ position: "absolute", right: toolCenter + 3, bottom: toolBottom + 1, width: 3.5, height: 30, borderRadius: 1.5, background: leaf, transform: "rotate(7deg)", transformOrigin: "bottom center" }} />
      <div style={{ position: "absolute", right: toolCenter + 2.5, bottom: toolBottom + 30, width: 5, height: 8, borderRadius: "2px 2px 1px 1px", background: chip, transform: "rotate(7deg)", transformOrigin: "bottom center" }} />

      {/* marker: chunkier shaft with a flat cap */}
      <div style={{ position: "absolute", right: toolCenter - 9, bottom: toolBottom, width: 5, height: 24, borderRadius: 1.5, background: pot, transform: "rotate(2deg)", transformOrigin: "bottom center" }} />
      <div style={{ position: "absolute", right: toolCenter - 10, bottom: toolBottom + 23, width: 6, height: 9, borderRadius: 2, background: ink, transform: "rotate(2deg)", transformOrigin: "bottom center" }} />

      {/* the plank, inset from the screen edges and thick */}
      <div style={{ position: "absolute", left: 22, right: 22, bottom: plankTop - deskH, height: deskH, borderRadius: 6, background: desk }} />
      <div style={{ position: "absolute", left: 22, right: 22, bottom: plankBottomY, height: deskDarkH, borderRadius: "0 0 6px 6px", background: deskDark }} />
    </div>
  );
}
