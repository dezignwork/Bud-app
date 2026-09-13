/** Bubble with a curved swoosh tail — used for Bud's greeting and reaction lines. */
export function TailBubble({ theme, children, style, mirror = false, animKey }) {
  return (
    <div
      key={animKey}
      style={{
        position: "absolute", left: mirror ? "auto" : 4, right: mirror ? 4 : "auto",
        zIndex: 4, transformOrigin: mirror ? "bottom right" : "bottom left",
        animation: "greetdrift 2.4s ease forwards", ...style,
      }}
    >
      <div
        style={{
          background: theme.bubble, color: theme.bubbleInk, borderRadius: 18,
          padding: "11px 16px", fontSize: 15, fontWeight: 400, lineHeight: 1.25,
          maxWidth: 252, textWrap: "balance", boxShadow: `0 0 0 1px ${theme.ghostLine}`,
        }}
      >
        {children}
      </div>
      <svg
        width="28" height="22" viewBox="0 0 34 26" fill="none" aria-hidden="true"
        style={{
          position: "absolute", top: "100%", marginTop: -1,
          left: mirror ? "auto" : 12, right: mirror ? 12 : "auto",
          transform: mirror ? "scaleX(-1)" : undefined,
        }}
      >
        <path d="M2 0 C2 12, 10 20, 32 25 C14 22, 2 14, 2 0 Z" fill={theme.bubble} />
      </svg>
    </div>
  );
}

/** Bubble with a rotated-square tail pointing up or down — used in onboarding. */
export function PopBubble({ theme, title, body, tailSide = "top" }) {
  return (
    <div
      style={{
        background: theme.bubble, color: theme.bubbleInk, borderRadius: 24,
        padding: "20px 24px", maxWidth: 280, position: "relative",
        animation: "pop .3s ease both",
      }}
    >
      <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: -1.2, lineHeight: 1.15 }}>{title}</div>
      {body && <div style={{ fontSize: 14, fontWeight: 300, lineHeight: 1.4, marginTop: 8, opacity: 0.72 }}>{body}</div>}
      <div
        style={{
          position: "absolute", left: "50%", top: tailSide === "top" ? -7 : "auto", bottom: tailSide === "bottom" ? -7 : "auto",
          width: 16, height: 16, marginLeft: -8, background: theme.bubble, borderRadius: 4, transform: "rotate(45deg)",
        }}
      />
    </div>
  );
}
