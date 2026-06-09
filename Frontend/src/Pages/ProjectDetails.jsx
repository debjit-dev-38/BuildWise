import { useState, useRef, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useParams } from "react-router-dom";
import {
  ExternalLink, FileText, Mail,
  Clock, Users, Briefcase, Calendar, CheckCircle2,
  Zap, Shield, BarChart3, Globe, Star, ChevronRight,
  Code2, Layers, Database, Server, Cpu, Lock,
  TrendingUp, MessageSquare, Award, Play, X,
  ArrowRight, Sparkles,
} from "lucide-react";
import Navbar from "../Components/Navbar";

// ── Service + data imports ─────────────────────────────────────────────────
import {
  getProjectBySlug,
  getProjectDetails,
  getRelatedProjects,
} from "../Services/projectService";

// ── Google Fonts ───────────────────────────────────────────────────────────
const _f = document.createElement("link");
_f.rel = "stylesheet";
_f.href =
  "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Mono:wght@400;500&display=swap";
document.head.appendChild(_f);

// ── Icon resolution map ────────────────────────────────────────────────────
// projectDetails.js stores iconKey strings; we resolve them here so the
// data layer stays framework-agnostic.
const ICON_MAP = {
  Cpu, Sparkles, BarChart3, Shield, Globe, TrendingUp,
  Users, CheckCircle2, Zap, Star,
  Code2, Layers, Database, Server, Lock,
};

/** Resolve an iconKey string → Lucide component, fallback to Sparkles */
const resolveIcon = (iconKey) => ICON_MAP[iconKey] ?? Sparkles;

/**
 * Hydrate iconKey → icon for every item in an array field.
 * Mutates nothing — returns a new array.
 */
const hydrateIcons = (arr = []) =>
  arr.map((item) => ({ ...item, icon: resolveIcon(item.iconKey) }));

// ── Animation helpers ──────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
});

function ScrollReveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

// ── Animated Counter ───────────────────────────────────────────────────────
function Counter({ value }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const num = parseFloat(value);
    const dur = 1400;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setCount(+(num * ease).toFixed(num % 1 !== 0 ? 1 : 0));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, value]);
  return <span ref={ref}>{count}</span>;
}

// ── Background ─────────────────────────────────────────────────────────────
function Background() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />
      <div style={{ position: "absolute", top: "-20%", right: "-10%", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(110,231,183,0.07) 0%, transparent 70%)", filter: "blur(60px)" }} />
      <div style={{ position: "absolute", bottom: "10%", left: "-15%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(129,140,248,0.06) 0%, transparent 70%)", filter: "blur(60px)" }} />
      <div style={{ position: "absolute", top: "50%", left: "40%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(110,231,183,0.04) 0%, transparent 70%)", filter: "blur(40px)" }} />
    </div>
  );
}

// ── Floating Stat Card ─────────────────────────────────────────────────────
function FloatCard({ icon: Icon, label, value, style, color = "#6EE7B7", delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: [0, -6, 0] }}
      transition={{ opacity: { delay, duration: 0.5 }, y: { delay, duration: 3.5, repeat: Infinity, ease: "easeInOut" } }}
      style={{
        position: "absolute",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.1)",
        backdropFilter: "blur(16px)",
        borderRadius: 14,
        padding: "10px 14px",
        display: "flex", alignItems: "center", gap: 10,
        boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)",
        ...style,
      }}
    >
      <div style={{ width: 30, height: 30, borderRadius: 8, background: `${color}15`, border: `1px solid ${color}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={13} style={{ color }} />
      </div>
      <div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 1 }}>{label}</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#F0F0F0" }}>{value}</div>
      </div>
    </motion.div>
  );
}

// ── Gallery ────────────────────────────────────────────────────────────────
function Gallery({ images }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(null);
  const [hov, setHov] = useState(false);
  return (
    <div>
      <div
        onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        onClick={() => setLightbox(active)}
        style={{
          position: "relative", borderRadius: 20, overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.07)", marginBottom: 12, cursor: "zoom-in",
          boxShadow: hov ? "0 0 0 1px rgba(110,231,183,0.2), 0 20px 60px rgba(0,0,0,0.5)" : "0 8px 40px rgba(0,0,0,0.4)",
          transition: "box-shadow 0.3s ease",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.img key={active} src={images[active].src} alt={images[active].caption}
            style={{ width: "100%", height: 240, objectFit: "cover", display: "block" }}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ scale: hov ? 1.04 : 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} />
        </AnimatePresence>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,10,10,0.8) 0%, transparent 50%)" }} />
        {hov && <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(110,231,183,0.06) 0%, transparent 60%)" }} />}
        <div style={{ position: "absolute", bottom: 0, insetInline: 0, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>{images[active].caption}</span>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "3px 8px" }}>
            {active + 1} / {images.length}
          </span>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
        {images.map((img, i) => (
          <motion.button key={i} onClick={() => setActive(i)} whileHover={{ scale: 1.02 }}
            style={{
              position: "relative", borderRadius: 12, overflow: "hidden", border: "none", padding: 0, cursor: "pointer",
              outline: i === active ? "2px solid rgba(110,231,183,0.6)" : "2px solid transparent",
              outlineOffset: 2,
              boxShadow: i === active ? "0 0 12px rgba(110,231,183,0.2)" : "none",
              transition: "outline 0.2s, box-shadow 0.2s",
            }}
          >
            <img src={img.src} alt={img.caption} style={{ width: "100%", height: 54, objectFit: "cover", display: "block" }} />
            {i !== active && <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)" }} />}
          </motion.button>
        ))}
      </div>
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.92)", backdropFilter: "blur(20px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{ position: "relative", maxWidth: 900, width: "100%" }}
              onClick={(e) => e.stopPropagation()}
            >
              <img src={images[lightbox].src} alt={images[lightbox].caption}
                style={{ width: "100%", borderRadius: 20, border: "1px solid rgba(110,231,183,0.15)", boxShadow: "0 40px 120px rgba(0,0,0,0.8)" }} />
              <div style={{ position: "absolute", bottom: -36, left: 0, right: 0, textAlign: "center", color: "rgba(255,255,255,0.5)", fontSize: 13 }}>
                {images[lightbox].caption}
              </div>
            </motion.div>
            <motion.button onClick={() => setLightbox(null)} whileHover={{ scale: 1.1 }}
              style={{ position: "absolute", top: 20, right: 20, width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff" }}>
              <X size={16} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Related Card ───────────────────────────────────────────────────────────
function RelatedCard({ title, cat, img, color }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.div
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      style={{
        borderRadius: 20,
        overflow: "hidden",
        cursor: "pointer",
        background: "#090909",
        border: hov
          ? "1px solid rgba(110,231,183,0.2)"
          : "1px solid rgba(255,255,255,0.07)",
        boxShadow: hov
          ? `0 20px 60px ${color}, 0 0 0 1px rgba(255,255,255,0.05)`
          : "0 4px 20px rgba(0,0,0,0.4)",
        transition: "border 0.3s, box-shadow 0.3s",
      }}
    >
      {/* Thumbnail */}
      <div
        style={{
          height: 140,
          overflow: "hidden",
          position: "relative",
          background: "#0A0A0A",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            position: "relative",
            height: "100%",
            overflow: "hidden",
            backgroundImage: `
          linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
        `,
            backgroundSize: "28px 28px",
          }}
        >
          {/* Glow */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(
            ellipse at center,
            ${color}20 0%,
            transparent 70%
          )`,
            }}
          />

          <motion.div
            animate={{ scale: hov ? 1.08 : 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: 14,
                background: `${color}12`,
                border: `1px solid ${color}35`,
                backdropFilter: "blur(12px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Instrument Serif', serif",
                fontSize: 18,
                color,
              }}
            >
              {img}
            </div>
          </motion.div>

          {hov && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(135deg, rgba(110,231,183,0.08) 0%, transparent 60%)",
              }}
            />
          )}
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          padding: "16px 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#050505",
          borderTop: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.35)",
              marginBottom: 4,
              fontFamily: "'DM Mono', monospace",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            {cat}
          </div>

          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "#F0F0F0",
            }}
          >
            {title}
          </div>
        </div>

        <motion.div
          animate={{ x: hov ? 4 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ArrowRight
            size={15}
            style={{
              color: hov ? "#6EE7B7" : "rgba(255,255,255,0.25)",
              transition: "color 0.2s",
            }}
          />
        </motion.div>
      </div>
    </motion.div>

  );
}

// ── Particles ──────────────────────────────────────────────────────────────
function Particles() {
  const particles = Array.from({ length: 16 }, (_, i) => ({
    id: i, x: Math.random() * 100, y: Math.random() * 100,
    size: Math.random() * 2 + 1, delay: Math.random() * 4, dur: Math.random() * 4 + 4,
  }));
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {particles.map((p) => (
        <motion.div key={p.id}
          style={{ position: "absolute", left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, borderRadius: "50%", background: "rgba(110,231,183,0.4)" }}
          animate={{ y: [-8, 8, -8], opacity: [0, 0.7, 0] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" }} />
      ))}
    </div>
  );
}

// ── Section Label ──────────────────────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6EE7B7", display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
      <div style={{ width: 16, height: 1, background: "#6EE7B7", opacity: 0.6 }} />
      {children}
      <div style={{ width: 16, height: 1, background: "#6EE7B7", opacity: 0.6 }} />
    </div>
  );
}

// ── Glass Card ─────────────────────────────────────────────────────────────
function GlassCard({ children, style = {}, hoverGlow, glowColor = "rgba(110,231,183,0.1)" }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => hoverGlow && setHov(true)}
      onMouseLeave={() => hoverGlow && setHov(false)}
      style={{
        background: "rgba(255,255,255,0.02)",
        border: hov ? "1px solid rgba(110,231,183,0.2)" : "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(12px)",
        borderRadius: 20,
        transition: "border 0.3s, box-shadow 0.3s, transform 0.3s",
        transform: hov ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hov ? `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${glowColor}` : "0 4px 20px rgba(0,0,0,0.3)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ── Loading skeleton ───────────────────────────────────────────────────────
function LoadingState() {
  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0A", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <motion.div
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        style={{ textAlign: "center" }}
      >
        <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(110,231,183,0.08)", border: "1px solid rgba(110,231,183,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <Sparkles size={20} color="#6EE7B7" />
        </div>
        <p style={{ fontSize: 14, color: "#555", fontFamily: "'DM Sans', sans-serif" }}>Loading project…</p>
      </motion.div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function ProjectDetails() {
  const { slug } = useParams();

  // Data state — everything comes from the service layer
  const [project, setProject] = useState(null);   // card-level meta (from projects.js)
  const [details, setDetails] = useState(null);   // full detail object (from projectDetails.js)
  const [related, setRelated] = useState([]);     // related project cards
  const [loading, setLoading] = useState(true);

  // Scroll-aware header
  const [headerScrolled, setHeaderScrolled] = useState(false);

  // ── Fetch all data whenever slug changes ─────────────────────────────────
  useEffect(() => {
    if (!slug) return;
    setLoading(true);

    Promise.all([
      getProjectBySlug(slug),
      getProjectDetails(slug),
      getRelatedProjects(slug),
    ]).then(([proj, det, rel]) => {
      setProject(proj);
      setDetails(det);
      setRelated(rel);
      setLoading(false);
    });
  }, [slug]);

  // ── Scroll listener ──────────────────────────────────────────────────────
  useEffect(() => {
    const el = document.querySelector("[data-scroll-container]");
    const onScroll = (e) => setHeaderScrolled(e.target.scrollTop > 20);
    if (el) el.addEventListener("scroll", onScroll);
    return () => el?.removeEventListener("scroll", onScroll);
  }, []);

  // ── Style tokens (kept local — same as original) ─────────────────────────
  const S = {
    page: { minHeight: "100vh", background: "#0A0A0A", color: "#F0F0F0", fontFamily: "'DM Sans', sans-serif", overflowX: "hidden", position: "relative" },
    container: { maxWidth: 1100, margin: "0 auto", padding: "0 24px" },
    serif: { fontFamily: "'Instrument Serif', serif" },
    mono: { fontFamily: "'DM Mono', monospace" },
  };

  // ── Guard: show skeleton until data arrives ──────────────────────────────
  if (loading || !details) return <LoadingState />;

  // ── Hydrate iconKey → Lucide component for each field that needs it ──────
  // This is the ONLY place in the app that resolves icon strings.
  // Data files stay pure JS; components get real icon components.
  const features = hydrateIcons(details.features);
  const stackItems = hydrateIcons(details.stack);
  const metrics = hydrateIcons(details.metrics);

  // Merge card-level data (project) with detail data so we always have a title
  // even when the detail is for a standalone showcase (projectId: null)
  const title = details.title ?? project?.name ?? "";
  const summary = details.summary ?? project?.desc ?? "";
  const cover = details.cover ?? "";
  const status = details.status ?? "Live";

  return (
    <div style={S.page} data-scroll-container>
      <Background />
      <Navbar />

      {/* ── SCROLL CONTAINER ── */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ ...S.container, padding: "48px 24px", display: "flex", flexDirection: "column", gap: 64 }}>

          {/* ── HERO ── */}
          <motion.section {...fadeUp(0.05)}>
            {/* Cover image */}
            <div style={{ position: "relative", borderRadius: 28, overflow: "hidden", marginBottom: 32, marginTop: 50, boxShadow: "0 40px 120px rgba(0,0,0,0.8)" }}>
              <div style={{ position: "relative", overflow: "hidden" }}>
                <motion.img
                  src={cover} alt={title}
                  style={{ width: "100%", height: 480, objectFit: "cover", display: "block" }}
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>

              {/* Overlays */}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #0A0A0A 0%, rgba(10,10,10,0.4) 50%, transparent 100%)" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(110,231,183,0.06) 0%, transparent 50%)" }} />
              <div style={{ position: "absolute", inset: 0, borderRadius: 28, boxShadow: "inset 0 0 0 1px rgba(110,231,183,0.12)" }} />

              {/* Play button */}
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                  style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(255,255,255,0.08)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <Play size={20} style={{ color: "#fff", marginLeft: 3 }} fill="white" />
                </motion.div>
              </div>

              {/* Bottom content */}
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "32px 40px" }}>
                <motion.div
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  style={{ display: "inline-flex", alignItems: "center", gap: 7, marginBottom: 16, padding: "6px 14px", borderRadius: 20, background: "rgba(110,231,183,0.1)", border: "1px solid rgba(110,231,183,0.25)", color: "#6EE7B7", fontSize: 12, fontWeight: 600, boxShadow: "0 0 16px rgba(110,231,183,0.15)" }}
                >
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#6EE7B7", boxShadow: "0 0 6px #6EE7B7" }} />
                  {status}
                </motion.div>
                <h2 style={{ ...S.serif, fontSize: 52, fontWeight: 400, color: "#F0F0F0", margin: "0 0 12px", lineHeight: 1.1 }}>
                  {title}
                </h2>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 16, maxWidth: 580, lineHeight: 1.65, margin: 0 }}>
                  {summary}
                </p>
              </div>

              {/* Floating stat cards — sourced from metrics */}
              {metrics[0] && <FloatCard icon={metrics[0].icon} label={metrics[0].label} value={metrics[0].value} style={{ top: 32, right: 32 }} delay={0.3} />}
              {metrics[1] && <FloatCard icon={metrics[1].icon} label={metrics[1].label} value={metrics[1].value} style={{ top: 110, right: 32 }} color="#818CF8" delay={0.5} />}
              {metrics[2] && <FloatCard icon={metrics[2].icon} label={metrics[2].label} value={metrics[2].value} style={{ top: 32, right: 180 }} color="#FCD34D" delay={0.4} />}
            </div>

            {/* Metrics row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
              {metrics.map(({ value, label, icon: Icon }, i) => (
                <ScrollReveal key={label} delay={i * 0.08}>
                  <GlassCard hoverGlow style={{ padding: "24px 20px", textAlign: "center" }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(110,231,183,0.08)", border: "1px solid rgba(110,231,183,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                      <Icon size={15} style={{ color: "#6EE7B7" }} />
                    </div>
                    <div style={{ fontSize: 28, fontWeight: 700, color: "#F0F0F0", ...S.serif, background: "linear-gradient(135deg, #F0F0F0, #6EE7B7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                      {value}
                    </div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>{label}</div>
                  </GlassCard>
                </ScrollReveal>
              ))}
            </div>
          </motion.section>

          {/* ── TWO-COLUMN LAYOUT ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 32, alignItems: "start" }}>

            {/* ═══ LEFT COLUMN ═══ */}
            <div style={{ display: "flex", flexDirection: "column", gap: 40, minWidth: 0 }}>

              {/* Problem */}
              <ScrollReveal>
                <GlassCard style={{ padding: "32px 36px", border: "1px solid rgba(248,113,113,0.15)", boxShadow: "inset 0 1px 0 rgba(248,113,113,0.08), 0 4px 20px rgba(0,0,0,0.3)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <MessageSquare size={14} style={{ color: "#F87171" }} />
                    </div>
                    <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#F87171", opacity: 0.7 }}>Problem Statement</div>
                  </div>
                  <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.75, fontSize: 15, margin: 0 }}>{details.problem}</p>
                </GlassCard>
              </ScrollReveal>

              {/* Solution */}
              <ScrollReveal delay={0.05}>
                <GlassCard style={{ padding: "32px 36px", border: "1px solid rgba(110,231,183,0.2)", background: "rgba(110,231,183,0.02)", boxShadow: "inset 0 1px 0 rgba(110,231,183,0.1), 0 0 40px rgba(110,231,183,0.04), 0 4px 20px rgba(0,0,0,0.3)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(110,231,183,0.1)", border: "1px solid rgba(110,231,183,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Zap size={14} style={{ color: "#6EE7B7" }} />
                    </div>
                    <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6EE7B7", opacity: 0.8 }}>Solution</div>
                  </div>
                  <p style={{ color: "rgba(255,255,255,0.75)", lineHeight: 1.75, fontSize: 15, margin: 0 }}>{details.solution}</p>
                </GlassCard>
              </ScrollReveal>

              {/* Features */}
              <ScrollReveal>
                <div>
                  <SectionLabel>Key Features</SectionLabel>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {features.map(({ icon: Icon, label, desc }, i) => (
                      <ScrollReveal key={label} delay={i * 0.06}>
                        <GlassCard hoverGlow style={{ padding: "20px 22px", display: "flex", gap: 16, alignItems: "flex-start", height: "100%" }}>
                          <div style={{ width: 38, height: 38, borderRadius: 12, background: "rgba(110,231,183,0.07)", border: "1px solid rgba(110,231,183,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Icon size={15} style={{ color: "#6EE7B7" }} />
                          </div>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "#F0F0F0", marginBottom: 5 }}>{label}</div>
                            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>{desc}</div>
                          </div>
                        </GlassCard>
                      </ScrollReveal>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              {/* Gallery */}
              <ScrollReveal>
                <div>
                  <SectionLabel>Gallery</SectionLabel>
                  <Gallery images={details.gallery} />
                </div>
              </ScrollReveal>

              {/* Challenges */}
              <ScrollReveal>
                <div>
                  <SectionLabel>Engineering Learnings</SectionLabel>
                  <div style={{ position: "relative", paddingLeft: 32 }}>
                    <div style={{ position: "absolute", left: 10, top: 16, bottom: 16, width: 1, background: "linear-gradient(to bottom, rgba(252,211,77,0.4), rgba(252,211,77,0.1))" }} />
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      {details.challenges.map(({ title: cTitle, body }, i) => (
                        <ScrollReveal key={cTitle} delay={i * 0.08}>
                          <div style={{ position: "relative" }}>
                            <div style={{ position: "absolute", left: -32, top: 16, width: 20, height: 20, borderRadius: "50%", background: "rgba(252,211,77,0.1)", border: "1px solid rgba(252,211,77,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <span style={{ fontSize: 9, fontWeight: 700, color: "#FCD34D" }}>{i + 1}</span>
                            </div>
                            <GlassCard hoverGlow glowColor="rgba(252,211,77,0.08)" style={{ padding: "20px 24px" }}>
                              <div style={{ fontSize: 13, fontWeight: 600, color: "#F0F0F0", marginBottom: 8 }}>{cTitle}</div>
                              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>{body}</div>
                            </GlassCard>
                          </div>
                        </ScrollReveal>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* Timeline */}
              <ScrollReveal>
                <div>
                  <SectionLabel>Development Process</SectionLabel>
                  <div style={{ position: "relative" }}>
                    <div style={{ position: "absolute", left: 18, top: 0, bottom: 0, width: 1, background: "linear-gradient(to bottom, rgba(110,231,183,0.3), rgba(129,140,248,0.15))" }} />
                    <div style={{ display: "flex", flexDirection: "column", gap: 20, paddingLeft: 52 }}>
                      {details.timeline.map(({ phase, weeks, desc }, i) => (
                        <ScrollReveal key={phase} delay={i * 0.07}>
                          <div style={{ position: "relative" }}>
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              whileInView={{ scale: 1, opacity: 1 }}
                              viewport={{ once: true }}
                              transition={{ delay: i * 0.09, type: "spring", stiffness: 400, damping: 20 }}
                              style={{ position: "absolute", left: -52, top: 10, width: 36, height: 36, borderRadius: "50%", background: "rgba(10,10,10,0.9)", border: "1.5px solid rgba(110,231,183,0.4)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 12px rgba(110,231,183,0.15)" }}
                            >
                              <span style={{ fontSize: 11, fontWeight: 700, color: "#6EE7B7" }}>{i + 1}</span>
                            </motion.div>
                            <GlassCard hoverGlow style={{ padding: "16px 22px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                                <span style={{ fontSize: 14, fontWeight: 600, color: "#F0F0F0" }}>{phase}</span>
                                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", ...S.mono }}>{weeks}</span>
                              </div>
                              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: 0, lineHeight: 1.6 }}>{desc}</p>
                            </GlassCard>
                          </div>
                        </ScrollReveal>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* ═══ RIGHT COLUMN ═══ */}
            <div style={{ position: "sticky", top: 76, display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Project Info */}
              <ScrollReveal>
                <GlassCard style={{ padding: "22px 24px" }}>
                  <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6EE7B7", marginBottom: 18 }}>Project Info</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                    {[
                      { icon: Clock, label: "Duration", value: details.info.duration },
                      { icon: Users, label: "Team", value: details.info.team },
                      { icon: Briefcase, label: "My Role", value: details.info.role },
                      { icon: Calendar, label: "Completed", value: details.info.date },
                    ].map(({ icon: Icon, label, value }, i, arr) => (
                      <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 9, color: "rgba(255,255,255,0.4)" }}>
                          <Icon size={13} />
                          <span style={{ fontSize: 12 }}>{label}</span>
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>{value}</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </ScrollReveal>

              {/* Tech Stack */}
              <ScrollReveal delay={0.06}>
                <GlassCard style={{ padding: "22px 24px" }}>
                  <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6EE7B7", marginBottom: 18 }}>Tech Stack</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {stackItems.map(({ icon: Icon, name, cat }) => (
                      <motion.div key={name} whileHover={{ x: 3 }}
                        style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 12, cursor: "default", transition: "background 0.2s" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.querySelector(".stack-icon").style.boxShadow = "0 0 10px rgba(110,231,183,0.2)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.querySelector(".stack-icon").style.boxShadow = "none"; }}
                      >
                        <div className="stack-icon" style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "box-shadow 0.3s" }}>
                          <Icon size={12} style={{ color: "#6EE7B7" }} />
                        </div>
                        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", flex: 1 }}>{name}</span>
                        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", ...S.mono }}>{cat}</span>
                      </motion.div>
                    ))}
                  </div>
                </GlassCard>
              </ScrollReveal>

              {/* Action Buttons */}
              <ScrollReveal delay={0.1}>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <motion.a href="#" whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px 20px", borderRadius: 14, background: "#6EE7B7", color: "#0A0A0A", fontSize: 13, fontWeight: 700, textDecoration: "none", boxShadow: "0 4px 20px rgba(110,231,183,0.3)", transition: "box-shadow 0.3s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 8px 32px rgba(110,231,183,0.45)")}
                    onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 4px 20px rgba(110,231,183,0.3)")}
                  >
                    <ExternalLink size={13} /> Live Demo
                  </motion.a>
                  {[
                    { label: "GitHub Repository", icon: ExternalLink },
                    { label: "Case Study PDF", icon: FileText },
                  ].map(({ label, icon: Icon }) => (
                    <motion.a key={label} href="#" whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
                      style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px 20px", borderRadius: 14, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.09)", color: "rgba(255,255,255,0.75)", fontSize: 13, fontWeight: 600, textDecoration: "none", transition: "background 0.2s, border 0.2s" }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"; }}
                    >
                      <Icon size={13} /> {label}
                    </motion.a>
                  ))}
                </div>
              </ScrollReveal>

              {/* Contact CTA */}
              <ScrollReveal delay={0.12}>
                <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", border: "1px solid rgba(110,231,183,0.18)", background: "rgba(110,231,183,0.03)", padding: "24px 22px", textAlign: "center" }}>
                  <div style={{ position: "absolute", top: -30, left: "50%", transform: "translateX(-50%)", width: 160, height: 80, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(110,231,183,0.2) 0%, transparent 70%)", filter: "blur(20px)", pointerEvents: "none" }} />
                  <div style={{ position: "relative", zIndex: 1 }}>
                    <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                      style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(110,231,183,0.1)", border: "1px solid rgba(110,231,183,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                      <Award size={18} style={{ color: "#6EE7B7" }} />
                    </motion.div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#F0F0F0", marginBottom: 6 }}>Interested in collaborating?</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 18, lineHeight: 1.6 }}>I'm open to freelance and full-time opportunities.</div>
                    <motion.button whileHover={{ y: -1, boxShadow: "0 8px 28px rgba(110,231,183,0.35)" }} whileTap={{ scale: 0.97 }}
                      style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, width: "100%", padding: "11px 18px", borderRadius: 12, background: "#6EE7B7", color: "#0A0A0A", fontSize: 12, fontWeight: 700, border: "none", cursor: "pointer", boxShadow: "0 4px 20px rgba(110,231,183,0.25)" }}>
                      <Mail size={12} /> Get In Touch
                    </motion.button>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>

          {/* ── RELATED PROJECTS ── */}
          {related.length > 0 && (
            <ScrollReveal>
              <section>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6EE7B7", marginBottom: 8 }}>More Work</div>
                    <h2 style={{ ...S.serif, fontSize: 32, fontWeight: 400, color: "#F0F0F0", margin: 0 }}>Related Projects</h2>
                  </div>
                  <motion.button whileHover={{ x: 3 }}
                    style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "rgba(255,255,255,0.4)", background: "none", border: "none", cursor: "pointer", transition: "color 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
                  >
                    View all <ChevronRight size={13} />
                  </motion.button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                  {related.map((p, i) => (
                    <ScrollReveal key={p.id}>
                      <RelatedCard
                        title={p.name}
                        cat={p.category}
                        img={p.image}
                        color={p.color}
                      />
                    </ScrollReveal>
                  ))}
                </div>
              </section>
            </ScrollReveal>
          )}

          {/* ── FINAL CTA ── */}
          <ScrollReveal>
            <section style={{ position: "relative", borderRadius: 28, overflow: "hidden", padding: "80px 60px", textAlign: "center", border: "1px solid rgba(110,231,183,0.12)", background: "rgba(255,255,255,0.01)" }}>
              <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 500, height: 300, background: "radial-gradient(ellipse, rgba(110,231,183,0.15) 0%, transparent 70%)", filter: "blur(30px)", pointerEvents: "none" }} />
              <div style={{ position: "absolute", bottom: 0, right: 0, width: 300, height: 200, background: "radial-gradient(ellipse, rgba(129,140,248,0.1) 0%, transparent 70%)", filter: "blur(30px)", pointerEvents: "none" }} />
              <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "40px 40px", opacity: 0.5 }} />
              <Particles />
              <div style={{ position: "relative", zIndex: 1 }}>
                <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  style={{ width: 52, height: 52, borderRadius: 16, background: "rgba(110,231,183,0.08)", border: "1px solid rgba(110,231,183,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px", boxShadow: "0 0 24px rgba(110,231,183,0.15)" }}>
                  <Sparkles size={22} style={{ color: "#6EE7B7" }} />
                </motion.div>
                <h2 style={{ ...S.serif, fontSize: 48, fontWeight: 400, color: "#F0F0F0", margin: "0 0 14px", lineHeight: 1.15 }}>
                  Ready to Build Your Next Project?
                </h2>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 16, maxWidth: 480, margin: "0 auto 40px", lineHeight: 1.7 }}>
                  Continue your journey with production-grade projects and real-world challenges.
                </p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
                  <motion.button
                    whileHover={{ y: -3, boxShadow: "0 16px 48px rgba(110,231,183,0.5)" }}
                    whileTap={{ scale: 0.97 }}
                    style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 16, background: "#6EE7B7", color: "#0A0A0A", fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer", boxShadow: "0 6px 24px rgba(110,231,183,0.35)", transition: "box-shadow 0.3s" }}
                  >
                    <Globe size={15} /> Explore Projects
                  </motion.button>
                  <motion.button
                    whileHover={{ y: -2, background: "rgba(255,255,255,0.06)" }}
                    whileTap={{ scale: 0.97 }}
                    style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 16, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.8)", fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "background 0.2s" }}
                  >
                    <Users size={15} /> Join Community
                  </motion.button>
                </div>
              </div>
            </section>
          </ScrollReveal>

          <div style={{ height: 32 }} />
        </div>
      </div>
    </div>
  );
}
