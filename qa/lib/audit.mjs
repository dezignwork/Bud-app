// Shared page-level audit checks used by qa/smoke.mjs's Phase 3 pass.
// Each function returns an array of finding strings (empty = clean) rather
// than throwing, so one screen's issues don't stop the audit from covering
// the rest — smoke.mjs decides what to do with the accumulated list.

export async function checkOverflow(page) {
  return page.evaluate(() => {
    const found = [];
    const root = document.scrollingElement || document.documentElement;
    if (root.scrollWidth > root.clientWidth + 1) {
      found.push(`document: scrollWidth ${root.scrollWidth} > clientWidth ${root.clientWidth}`);
    }
    // Also check likely-scrollable panes directly, since this app nests its
    // own overflow containers rather than scrolling the document itself.
    document.querySelectorAll("*").forEach((el) => {
      const cs = getComputedStyle(el);
      if (cs.overflowY === "auto" || cs.overflowY === "scroll") {
        if (el.scrollWidth > el.clientWidth + 1) {
          const label = el.getAttribute("data-testid") || el.className || el.tagName;
          found.push(`${label}: scrollWidth ${el.scrollWidth} > clientWidth ${el.clientWidth}`);
        }
      }
    });
    return found;
  });
}

// 44x44 CSS px is the common (WCAG 2.5.5 / iOS HIG) minimum comfortable
// touch target. Checks the element's own box plus any ::after content used
// to invisibly expand a hit area, since a design can pass "looks fine" while
// failing this on the actual box alone.
export async function checkHitAreas(page) {
  return page.evaluate(() => {
    const found = [];
    const clickable = document.querySelectorAll(
      '[onclick], button, a, input, textarea, [style*="cursor: pointer"], [style*="cursor:pointer"]'
    );
    clickable.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) return; // not rendered/visible
      const after = getComputedStyle(el, "::after");
      let w = r.width, h = r.height;
      if (after.content && after.content !== "none" && after.content !== '""') {
        // Approximate: an ::after expander is usually sized via width/height
        // or inset; take the larger of the element's own box and the
        // after-pseudo's declared box if it's larger.
        const aw = parseFloat(after.width) || 0;
        const ah = parseFloat(after.height) || 0;
        w = Math.max(w, aw);
        h = Math.max(h, ah);
      }
      if (w > 0 && h > 0 && (w < 44 || h < 44)) {
        const label = el.getAttribute("data-testid") || el.textContent?.trim().slice(0, 30) || el.tagName;
        found.push(`"${label}": ${Math.round(w)}x${Math.round(h)} (needs 44x44)`);
      }
    });
    return found;
  });
}

// Walks up from each text-bearing element to find its effective (non-
// transparent) background, then checks WCAG contrast against that.
export async function checkContrast(page) {
  return page.evaluate(() => {
    function luminance(r, g, b) {
      const [rs, gs, bs] = [r, g, b].map((c) => {
        c /= 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    }
    function parseColor(str) {
      const m = str.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/);
      if (!m) return null;
      return { r: +m[1], g: +m[2], b: +m[3], a: m[4] === undefined ? 1 : +m[4] };
    }
    function effectiveBg(el) {
      let node = el;
      while (node) {
        const bg = parseColor(getComputedStyle(node).backgroundColor);
        if (bg && bg.a > 0) return bg;
        node = node.parentElement;
      }
      return { r: 255, g: 255, b: 255, a: 1 }; // fall back to white (this app's actual root bg is #f8f7f4, close enough for a ratio check)
    }
    // Opacity composites toward the effective background at render time (a
    // dimmed label's rendered color sits between its `color` and whatever is
    // behind it), so a text node under an ancestor opacity < 1 needs its `fg`
    // blended toward `bg` by the product of every ancestor's opacity before
    // computing the ratio — otherwise this check reads the pre-opacity color
    // and misses real failures on dimmed labels (EDIT/DONE, eyebrow text, etc).
    function effectiveOpacity(el) {
      let node = el, op = 1;
      while (node) {
        const cs = getComputedStyle(node);
        if (cs.opacity !== "") op *= parseFloat(cs.opacity);
        node = node.parentElement;
      }
      return op;
    }
    const found = [];
    document.querySelectorAll("*").forEach((el) => {
      const hasOwnText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      if (!hasOwnText) return;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      const op = effectiveOpacity(el);
      if (op < 0.05) return; // fully/near-invisible; not a real contrast concern
      const fgRaw = parseColor(getComputedStyle(el).color);
      if (!fgRaw) return;
      const bg = effectiveBg(el);
      const fg = {
        r: fgRaw.r * op + bg.r * (1 - op),
        g: fgRaw.g * op + bg.g * (1 - op),
        b: fgRaw.b * op + bg.b * (1 - op),
      };
      const cs = getComputedStyle(el);
      const L1 = luminance(fg.r, fg.g, fg.b) + 0.05;
      const L2 = luminance(bg.r, bg.g, bg.b) + 0.05;
      const ratio = L1 > L2 ? L1 / L2 : L2 / L1;
      const fontSize = parseFloat(cs.fontSize);
      const isLarge = fontSize >= 24 || (fontSize >= 19 && parseInt(cs.fontWeight, 10) >= 700);
      const threshold = isLarge ? 3 : 4.5;
      if (ratio < threshold) {
        const label = el.textContent.trim().slice(0, 30);
        found.push(`"${label}" ratio ${ratio.toFixed(2)}:1 (needs ${threshold}:1 at ${fontSize}px)`);
      }
    });
    return found;
  });
}

// This app has no semantic <h1>-<h6> anywhere (every title is a styled
// <div>), no [role=dialog] on the Meditation overlay, and no aria-live
// region on the async "Watering..." / "Kept" status changes — checked
// together since they're all instances of the same underlying gap
// (screen-reader/structural semantics), not independent screen-by-screen
// issues, and reported as one line each so severity can be judged for the
// whole app rather than once per screen.
export async function checkStructure(page) {
  return page.evaluate(() => {
    const found = [];
    const headings = document.querySelectorAll("h1,h2,h3,h4,h5,h6");
    if (headings.length === 0) found.push("no semantic heading elements (h1-h6) anywhere on this screen");
    return found;
  });
}

export async function screenshotAt(page, dir, name) {
  await page.screenshot({ path: `${dir}/${name}.png` });
}
