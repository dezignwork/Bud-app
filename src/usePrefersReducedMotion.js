import { useEffect, useState } from "react";

// Same idea Splash.jsx already used for its own one-time entrance animation,
// as a shared hook so other continuous, unconditional idle loops (the
// plant's sway/leafbob/blink/breathe) can respect it too. Splash keeps its
// own inline matchMedia read rather than switching to this hook — it needs
// the value synchronously inside the same effect that computes its
// entrance-timeout duration, and this hook's live-updating (change) listener
// isn't needed for a splash that's gone in ~2.6s anyway.
export default function usePrefersReducedMotion() {
  // Lazy initializer so the correct value is already there on the very
  // first render — starting from a hardcoded false and correcting it in an
  // effect meant a reduced-motion user's first paint briefly included the
  // looping animations anyway, for one render.
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
