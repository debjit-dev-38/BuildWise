// ─────────────────────────────────────────────
// BuildWise Design System — Single Source of Truth
// ─────────────────────────────────────────────

export const COLORS = {
  bg: "#0A0A0A",
  surface: "rgba(255,255,255,0.02)",
  surfaceHover: "rgba(255,255,255,0.045)",
  border: "rgba(255,255,255,0.07)",
  borderHover: "rgba(255,255,255,0.14)",

  // Accent palette
  green: "#6EE7B7",
  indigo: "#818CF8",
  amber: "#FCD34D",
  pink: "#F9A8D4",

  // Text hierarchy
  text: "#F0F0F0",
  textSecondary: "#e5e5e5",
  muted: "rgba(255,255,255,0.45)",
  faint: "rgba(255,255,255,0.18)",
  mutedSolid: "#666",
  faintSolid: "#333",

  // Card / glassmorphism
  card: "rgba(255,255,255,0.02)",
};

export const FONTS = {
  serif: { fontFamily: "'Instrument Serif', serif" },
  sans: { fontFamily: "'DM Sans', sans-serif" },
  mono: { fontFamily: "'DM Mono', monospace" },
};

/* --------------------------------------------------
   Backward Compatibility Layer
   Allows existing code using G.text, G.serif, etc.
   -------------------------------------------------- */
export const G= {
  ...COLORS,
  serif: FONTS.serif,
  sans: FONTS.sans,
  mono: FONTS.mono,
};

export const ACCENT_COLORS = [
  COLORS.green,
  COLORS.indigo,
  COLORS.amber,
  COLORS.pink,
];

// Convenience: badge background per accent color
export const badgeBg = (color) => {
  const map = {
    [COLORS.green]: "rgba(110,231,183,0.12)",
    [COLORS.indigo]: "rgba(129,140,248,0.12)",
    [COLORS.amber]: "rgba(252,211,77,0.12)",
    [COLORS.pink]: "rgba(249,168,212,0.12)",
  };
  return map[color] ?? "rgba(255,255,255,0.08)";
};
export const S = {
    page: { minHeight: "100vh", background: "#0A0A0A", color: "#F0F0F0", fontFamily: "'DM Sans', sans-serif", overflowX: "hidden", position: "relative" },
    container: { maxWidth: 1100, margin: "0 auto", padding: "0 24px" },
    serif: { fontFamily: "'Instrument Serif', serif" },
    mono: { fontFamily: "'DM Mono', monospace" },
    green: { color: "#6EE7B7" },
    indigo: { color: "#818CF8" },
    yellow: { color: "#FCD34D" },
  };
// Difficulty → color mapping
export const DIFFICULTY_COLORS = {
  Beginner: COLORS.green,
  Intermediate: COLORS.indigo,
  Advanced: COLORS.amber,
  Expert: COLORS.pink,
};
// ── DESIGN TOKENS in Dashboard ────────────────────────────────────────────────────────────
export const C = {
  bg: "#0A0A0A",
  surface: "rgba(255,255,255,0.02)",
  surfaceHov: "rgba(255,255,255,0.045)",
  border: "rgba(255,255,255,0.07)",
  borderHov: "rgba(255,255,255,0.14)",
  green: "#6EE7B7",
  indigo: "#818CF8",
  amber: "#FCD34D",
  pink: "#F9A8D4",
  text: "#e5e5e5",
  muted: "#666",
  faint: "#333",
};

export default {
  COLORS,
  FONTS,
  G,
  S,
  C,
  ACCENT_COLORS,
  badgeBg,
  DIFFICULTY_COLORS,
};