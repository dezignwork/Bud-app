// Growth curve ported from AffirmationApp.dc.html: streak 0 → 3 leaves / 60px stem,
// streak 12+ → 5 leaves / 106px stem.
export function plantGrowth(streak) {
  const growth = Math.min(streak / 12, 1);
  const leafCount = 3 + Math.round(growth * 2);
  const stemH = 60 + growth * 46;
  const step = (stemH - 16) / leafCount;
  const leaves = [0, 1, 2, 3, 4].map((i) => {
    const rot = -(26 + (i % 2) * 8);
    return {
      bottom: Math.round(58 + 14 + i * step),
      transform: (i % 2 ? "scaleX(-1) " : "") + `rotate(${rot}deg)`,
      delay: i * 0.45,
      visible: i < leafCount,
    };
  });
  return { leaves, stemH };
}
