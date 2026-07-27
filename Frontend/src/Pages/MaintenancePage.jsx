import { motion } from "framer-motion";
import { Wrench } from "lucide-react";

const C    = { green: "#6EE7B7", indigo: "#818CF8" };
const EASE = [0.22, 1, 0.36, 1];

export default function MaintenancePage() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#090909",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'DM Sans', -apple-system, sans-serif",
      color: "#e5e5e5",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Ambient glow */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none" }}>
        <div style={{
          position: "absolute",
          top: "20%", left: "50%", transform: "translateX(-50%)",
          width: 600, height: 400,
          background: `radial-gradient(ellipse, ${C.green}08 0%, transparent 65%)`,
        }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        style={{ textAlign: "center", maxWidth: 440, padding: "40px 24px", position: "relative" }}
      >
        {/* Icon */}
        <div style={{
          width: 64, height: 64, borderRadius: 18,
          background: `${C.green}10`,
          border: `1px solid ${C.green}22`,
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 28px",
        }}>
          <Wrench size={26} color={C.green} />
        </div>

        {/* Eyebrow */}
        <p style={{
          fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase",
          color: C.green, fontWeight: 600, margin: "0 0 10px",
        }}>
          Scheduled Maintenance
        </p>

        {/* Headline */}
        <h1 style={{
          fontFamily: "'Instrument Serif', serif",
          fontSize: 28, color: "#f2f2f2",
          letterSpacing: "-0.02em", lineHeight: 1.2,
          margin: "0 0 14px",
        }}>
          We'll be right back
        </h1>

        <p style={{ fontSize: 14, color: "#555", lineHeight: 1.75, margin: "0 0 32px" }}>
          BuildWise is temporarily down for scheduled maintenance.
          We're making things better — check back in a few minutes.
        </p>

        {/* Pulsing indicator */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <motion.span
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: 7, height: 7, borderRadius: "50%",
              background: C.green,
              boxShadow: `0 0 8px ${C.green}`,
              display: "inline-block",
            }}
          />
          <span style={{ fontSize: 12, color: "#3a3a3a" }}>Status: Maintenance in progress</span>
        </div>
      </motion.div>
    </div>
  );
}
