import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import {
  Hammer, ArrowRight, Search, SlidersHorizontal, Bookmark,
  BookmarkCheck, Users, Clock, ChevronDown, ChevronLeft,
  ChevronRight, X, Sparkles, TrendingUp, Zap, RotateCcw,
  Star, ExternalLink, Filter, Monitor, Server, Layers,
  Brain, Smartphone, Container, ArrowUpRight, Check
} from "lucide-react";
import { filterProjects, getFeaturedProjects, getProjects } from "../Services/projectService";
import {
  categories,
  difficulties,
  durations,
  sortOptions,
  techFilters,
  matchDurationFilter,
} from "../data/filters";
import { COLORS, FONTS, DIFFICULTY_COLORS } from "../Constants/theme";
// ── CONSTANTS ────────────────────────────────────────────────────────────────


// Filter/sort constants sourced from data layer
const CATEGORIES = categories;
const DIFFICULTIES = difficulties;
const DURATIONS = durations;
const SORT_OPTIONS = sortOptions;
const TECH_FILTERS = techFilters;

// PROJECTS is now fetched from the data layer — see root component below

const STATS = [
  { val: 2400, label: "Projects Built", suffix: "+" },
  { val: 18000, label: "Active Learners", suffix: "+" },
  { val: 48, label: "Learning Paths", suffix: "" },
  { val: 94, label: "Completion Rate", suffix: "%" },
];


const ITEMS_PER_PAGE = 10;

// ── HELPERS ──────────────────────────────────────────────────────────────────

function diffColor(d) {
  return d === "Beginner" ? { bg: "rgba(110,231,183,0.12)", text: "#6EE7B7" }
    : d === "Intermediate" ? { bg: "rgba(252,211,77,0.12)", text: "#FCD34D" }
      : d === "Advanced" ? { bg: "rgba(129,140,248,0.12)", text: "#818CF8" }
        : { bg: "rgba(249,168,212,0.12)", text: "#F9A8D4" };
}

function formatLearners(n = 0) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n.toString();
}


function getMetric(project, label) {
  return project.metrics?.find(
    m => m.label.toLowerCase() === label.toLowerCase()
  );
}

function getLearners(project) {
  const metric = project.metrics?.find(
    m => m.label.toLowerCase() === "learners"
  );

  return metric?.num || 0;
}

function getRating(project) {
  const metric = project.metrics?.find(
    m => m.label.toLowerCase() === "rating"
  );

  return metric?.num || 0;
}
// ── HOOKS ────────────────────────────────────────────────────────────────────

function useCountUp(target, isInView) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!isInView) return;
    const steps = 60, duration = 2000;
    const inc = target / steps;
    let cur = 0;
    const t = setInterval(() => {
      cur += inc;
      if (cur >= target) { setCount(target); clearInterval(t); }
      else setCount(Math.floor(cur));
    }, duration / steps);
    return () => clearInterval(t);
  }, [isInView, target]);
  return count;
}

// ── SHARED UI ────────────────────────────────────────────────────────────────

function FadeIn({ children, delay = 0, y = 20, className = "", style = {} }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.25, 0.8, 0.25, 1] }}
      className={className} style={style}>
      {children}
    </motion.div>
  );
}

function SectionLabel({ children }) {
  return (
    <p style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "#6EE7B7", fontWeight: 500 }}>
      {children}
    </p>
  );
}

function GlassCard({ children, className = "", style = {}, onClick, hoverAccent }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className={className}
      style={{
        background: hov ? "rgba(255,255,255,0.045)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${hov && hoverAccent ? hoverAccent + "33" : "rgba(255,255,255,0.07)"}`,
        backdropFilter: "blur(20px)",
        borderRadius: 14,
        transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
        transform: hov ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hov && hoverAccent ? `0 20px 60px ${hoverAccent}12` : "none",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}>
      {children}
    </div>
  );
}

function PrimaryBtn({ children, onClick, style = {} }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        padding: "10px 20px", background: hov ? "#5DCAA5" : "#6EE7B7",
        color: "#0A0A0A", fontWeight: 600, fontSize: 13,
        borderRadius: 8, border: "none", cursor: "pointer",
        transition: "all 0.2s ease",
        transform: hov ? "translateY(-1px)" : "translateY(0)",
        boxShadow: hov ? "0 8px 24px rgba(110,231,183,0.25)" : "none",
        fontFamily: "inherit",
        ...style,
      }}>
      {children}
    </button>
  );
}

function GhostBtn({ children, onClick, style = {}, active = false }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "9px 18px",
        background: active ? "rgba(110,231,183,0.1)" : hov ? "rgba(255,255,255,0.05)" : "transparent",
        color: active ? "#6EE7B7" : hov ? "#e5e5e5" : "#888",
        fontSize: 13, fontWeight: active ? 600 : 400,
        borderRadius: 8, border: `1px solid ${active ? "rgba(110,231,183,0.3)" : "rgba(255,255,255,0.1)"}`,
        cursor: "pointer", transition: "all 0.2s ease", fontFamily: "inherit",
        ...style,
      }}>
      {children}
    </button>
  );
}


// ── HERO ─────────────────────────────────────────────────────────────────────

function Hero({ search, setSearch, activeCategory, setActiveCategory, activeDiff, setActiveDiff, totalCount }) {
  return (
    <section style={{ position: "relative", paddingTop: 120, paddingBottom: 72, overflow: "hidden" }}>
      {/* Grid bg */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.55,
        backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />
      {/* Glows */}
      <div style={{ position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)", width: 700, height: 350, background: "radial-gradient(ellipse, rgba(110,231,183,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "30%", right: "5%", width: 280, height: 280, background: "radial-gradient(ellipse, rgba(129,140,248,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "10%", left: "8%", width: 240, height: 240, background: "radial-gradient(ellipse, rgba(252,211,77,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ position: "relative", maxWidth: 1100, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "4px 14px", borderRadius: 999, background: "rgba(110,231,183,0.1)", border: "1px solid rgba(110,231,183,0.2)", marginBottom: 24 }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#6EE7B7", animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: 12, color: "#6EE7B7", fontWeight: 500 }}>{totalCount} projects available</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12 }}
          style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(40px, 6vw, 64px)", lineHeight: 1.05, letterSpacing: "-0.02em", color: "#f0f0f0", marginBottom: 18 }}>
          Find Your Next
          <span style={{ background: "linear-gradient(135deg, #6EE7B7 0%, #3ABFAD 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}> Project</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.22 }}
          style={{ fontSize: 17, color: "#666", lineHeight: 1.7, maxWidth: 520, margin: "0 auto 40px" }}>
          Production-grade projects designed to help you build real skills, real experience, and a portfolio that stands out.
        </motion.p>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.32 }}
          style={{ maxWidth: 580, margin: "0 auto 32px", position: "relative" }}>
          <div style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
            <Search size={16} color="#555" />
          </div>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search projects, technologies, topics…"
            style={{
              width: "100%", padding: "14px 44px 14px 44px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12, color: "#e5e5e5", fontSize: 14,
              outline: "none", fontFamily: "inherit",
              transition: "border-color 0.2s ease",
            }}
            onFocus={e => (e.target.style.borderColor = "rgba(110,231,183,0.35)")}
            onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
          />
          {search && (
            <button onClick={() => setSearch("")} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#555", display: "flex" }}>
              <X size={14} />
            </button>
          )}
        </motion.div>

        {/* Category pills */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 16 }}>
          {CATEGORIES.map(cat => {
            const active = activeCategory === cat.id;
            const Icon = cat.icon;
            return (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "8px 16px", borderRadius: 8, fontSize: 13,
                  background: active ? "rgba(110,231,183,0.12)" : "rgba(255,255,255,0.04)",
                  color: active ? "#6EE7B7" : "#888",
                  border: `1px solid ${active ? "rgba(110,231,183,0.3)" : "rgba(255,255,255,0.08)"}`,
                  cursor: "pointer", transition: "all 0.2s ease", fontFamily: "inherit", fontWeight: active ? 600 : 400,
                }}>
                <Icon size={13} /> {cat.label}
              </button>
            );
          })}
        </motion.div>

        {/* Difficulty pills */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
          {DIFFICULTIES.map(d => {
            const active = activeDiff === d;
            const dc = d !== "All" ? diffColor(d) : null;
            return (
              <button key={d} onClick={() => setActiveDiff(d)}
                style={{
                  padding: "6px 14px", borderRadius: 6, fontSize: 12,
                  background: active && dc ? dc.bg : active ? "rgba(255,255,255,0.08)" : "transparent",
                  color: active && dc ? dc.text : active ? "#e5e5e5" : "#555",
                  border: `1px solid ${active ? (dc ? dc.text + "40" : "rgba(255,255,255,0.2)") : "rgba(255,255,255,0.06)"}`,
                  cursor: "pointer", transition: "all 0.2s ease", fontFamily: "inherit",
                }}>
                {d}
              </button>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

// ── FEATURED BANNER ──────────────────────────────────────────────────────────

function FeaturedBanner({ project }) {
  const accent = COLORS[project.color] ?? COLORS.green;
  const [hov, setHov] = useState(false);
  const dc = diffColor(project.difficulty);
  return (
    <FadeIn>
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          maxWidth: 1100, margin: "0 auto 72px", padding: "0 24px",
        }}>
        <div style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
          <SectionLabel>FEATURED PROJECT</SectionLabel>
          <div style={{ height: 1, flex: 1, background: "rgba(255,255,255,0.06)" }} />
        </div>
        <div
          style={{
            borderRadius: 18, overflow: "hidden",
            border: hov ? `1px solid ${accent}33` : "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.02)",
            backdropFilter: "blur(20px)",
            transition: "all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
            transform: hov ? "translateY(-3px)" : "translateY(0)",
            boxShadow: hov ? `0 24px 80px ${accent}10` : "none",
            display: "flex", flexWrap: "wrap",
          }}>
          {/* Visual side */}
          <div style={{
            flex: "1 1 320px", minHeight: 280,
            background: `radial-gradient(ellipse at 30% 50%, ${accent}18 0%, rgba(255,255,255,0.02) 70%)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative", overflow: "hidden",
            borderRight: "1px solid rgba(255,255,255,0.06)",
          }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "30px 30px", opacity: 0.6 }} />
            <motion.div
              animate={{ scale: hov ? 1.05 : 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              style={{ position: "relative", width: 100, height: 100, borderRadius: 20, background: `${accent}18`, border: `1px solid ${accent}35`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Instrument Serif', serif", fontSize: 28, color: accent }}>
              {project.image}
            </motion.div>
            {/* Floating chip */}
            <div style={{ position: "absolute", bottom: 20, left: 20, background: "rgba(10,10,10,0.7)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "6px 12px", display: "flex", alignItems: "center", gap: 6 }}>
              <Star size={11} color="#FCD34D" fill="#FCD34D" />
              <span style={{ fontSize: 12, color: "#e5e5e5", fontWeight: 600 }}> {getRating(project)} rating</span>
            </div>
            <div style={{ position: "absolute", top: 20, right: 20, background: "rgba(10,10,10,0.7)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "6px 12px", display: "flex", alignItems: "center", gap: 6 }}>
              <Users size={11} color="#818CF8" />
              <span style={{ fontSize: 12, color: "#e5e5e5" }}>{formatLearners(getLearners(project))} learners</span>
            </div>
          </div>

          {/* Content side */}
          <div style={{ flex: "2 1 340px", padding: "36px 40px", display: "flex", flexDirection: "column", gap: 16, justifyContent: "center" }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: dc.bg, color: dc.text }}>{project.difficulty}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <Clock size={12} color="#555" />
                <span style={{ fontSize: 12, color: "#555" }}>{project.duration}</span>
              </div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 6, background: "rgba(110,231,183,0.08)", border: "1px solid rgba(110,231,183,0.2)" }}>
                <Sparkles size={11} color="#6EE7B7" />
                <span style={{ fontSize: 11, color: "#6EE7B7", fontWeight: 500 }}>Editor's Pick</span>
              </div>
            </div>
            <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 32, color: "#f0f0f0", lineHeight: 1.15, letterSpacing: "-0.02em" }}>{project.name}</h3>
            <p style={{ fontSize: 15, color: "#666", lineHeight: 1.7, maxWidth: 480 }}>{project.description}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {project.stack.map(t => (
                <span
                  key={t.name}
                  style={{
                    padding: "5px 10px",
                    borderRadius: 6,
                    fontSize: 11,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    color: "#777",
                  }}
                >
                  {t.name}
                </span>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 4, flexWrap: "wrap" }}>
              <PrimaryBtn >Start Project <ArrowRight size={14} /></PrimaryBtn>
              <GhostBtn>Preview <ExternalLink size={13} /></GhostBtn>
            </div>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

// ── PROJECT CARD ─────────────────────────────────────────────────────────────

function ProjectCard({ project, index }) {
  const accent = COLORS[project.color] ?? COLORS.green;
  const navigate = useNavigate();
  const [hov, setHov] = useState(false);
  const [saved, setSaved] = useState(false);
  const dc = diffColor(project.difficulty);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: (index % ITEMS_PER_PAGE) * 0.05, ease: [0.25, 0.8, 0.25, 1] }}>
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          borderRadius: 14, overflow: "hidden",
          border: hov ? `1px solid ${accent}33` : "1px solid rgba(255,255,255,0.07)",
          background: hov ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)",
          backdropFilter: "blur(20px)",
          transition: "all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1)",
          transform: hov ? "translateY(-5px)" : "translateY(0)",
          boxShadow: hov ? `0 20px 60px ${accent}10` : "none",
          display: "flex", flexDirection: "column", height: "100%",
        }}>
        {/* Thumbnail */}
        <div style={{
          height: 140, overflow: "hidden", position: "relative",
          background: `radial-gradient(ellipse at 40% 60%, ${accent}18 0%, rgba(255,255,255,0.02) 70%)`,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
          <motion.div
            animate={{ scale: hov ? 1.08 : 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 60, height: 60, borderRadius: 14, background: `${accent}18`, border: `1px solid ${accent}35`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Instrument Serif', serif", fontSize: 18, color: accent }}>
              {project.image}
            </div>
          </motion.div>
          {/* Save button */}
          <button
            onClick={e => { e.stopPropagation(); setSaved(!saved); }}
            style={{ position: "absolute", top: 10, right: 10, width: 30, height: 30, borderRadius: 7, background: "rgba(10,10,10,0.6)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s", color: saved ? "#6EE7B7" : "#555" }}>
            {saved ? <BookmarkCheck size={13} color="#6EE7B7" /> : <Bookmark size={13} color="#555" />}
          </button>
          {/* Badges overlay */}
          <div style={{ position: "absolute", bottom: 10, left: 10, display: "flex", gap: 5 }}>
            <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 5, background: dc.bg, color: dc.text }}>{project.difficulty}</span>
            {project.newest && <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 5, background: "rgba(252,211,77,0.15)", color: "#FCD34D" }}>NEW</span>}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "18px 18px 14px", flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <Clock size={11} color="#555" />
              <span style={{ fontSize: 11, color: "#555" }}>{project.duration}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Star size={11} color="#FCD34D" fill="#FCD34D" />
              <span style={{ fontSize: 11, color: "#888" }}> {getRating(project)}</span>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: "#e5e5e5", marginBottom: 6, lineHeight: 1.3 }}>{project.name}</h3>
            <p style={{ fontSize: 12, color: "#555", lineHeight: 1.65 }}>{project.description}</p>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: "auto" }}>
            {project.stack.slice(0, 3).map(t => (
              <span
                key={t.name}
                style={{
                  padding: "4px 8px",
                  borderRadius: 5,
                  fontSize: 10,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  color: "#666",
                }}
              >
                {t.name}
              </span>
            ))}
            {project.stack.length > 3 && (
              <span
                style={{
                  padding: "4px 8px",
                  borderRadius: 5,
                  fontSize: 10,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  color: "#666",
                }}
              >
                +{project.stack.length - 3}
              </span>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 5, paddingTop: 4, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            <Users size={11} color="#555" />
            <span style={{ fontSize: 11, color: "#555", flex: 1 }}>{formatLearners(getLearners(project))} learners</span>
          </div>
        </div>

        {/* Footer CTA */}
        <div style={{ padding: "0 18px 16px" }}>
          <button onClick={() => navigate(`/projectdetails/${project.slug}`)} style={{
            width: "100%", padding: "9px 0", borderRadius: 8, fontSize: 13, fontWeight: 500,
            background: hov ? `${accent}15` : "rgba(255,255,255,0.04)",
            border: `1px solid ${hov ? accent + "40" : "rgba(255,255,255,0.08)"}`,
            color: hov ? accent : "#888",
            cursor: "pointer", transition: "all 0.25s ease", fontFamily: "inherit",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}>
            View Project <ArrowUpRight size={13} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ── SIDEBAR ──────────────────────────────────────────────────────────────────

function Sidebar({ search, setSearch, activeCategory, setActiveCategory, activeDiff, setActiveDiff, activeDuration, setActiveDuration, activeTech, setActiveTech, onReset }) {
  const [catOpen, setCatOpen] = useState(true);
  const [diffOpen, setDiffOpen] = useState(true);
  const [durOpen, setDurOpen] = useState(false);
  const [techOpen, setTechOpen] = useState(false);

  function SideSection({ title, open, onToggle, children }) {
    return (
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 16, marginBottom: 16 }}>
        <button onClick={onToggle} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", cursor: "pointer", padding: "0 0 12px", fontFamily: "inherit" }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#888", letterSpacing: "0.08em", textTransform: "uppercase" }}>{title}</span>
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={14} color="#555" />
          </motion.div>
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} style={{ overflow: "hidden" }}>
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div style={{
      position: "sticky", top: 88, width: 220, flexShrink: 0,
      background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 14, padding: "20px 16px", backdropFilter: "blur(20px)",
      alignSelf: "flex-start", maxHeight: "calc(100vh - 110px)", overflowY: "auto",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Filter size={14} color="#6EE7B7" />
          <span style={{ fontSize: 13, fontWeight: 600, color: "#e5e5e5" }}>Filters</span>
        </div>
        <button onClick={onReset} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, color: "#555", fontSize: 11, fontFamily: "inherit" }}>
          <RotateCcw size={11} /> Reset
        </button>
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: 20 }}>
        <Search size={13} color="#555" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…"
          style={{ width: "100%", padding: "8px 8px 8px 30px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, color: "#e5e5e5", fontSize: 12, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
          onFocus={e => (e.target.style.borderColor = "rgba(110,231,183,0.3)")}
          onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.08)")} />
      </div>

      <SideSection title="Category" open={catOpen} onToggle={() => setCatOpen(!catOpen)}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            const active = activeCategory === cat.id;
            return (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", borderRadius: 7, fontSize: 12, background: active ? "rgba(110,231,183,0.1)" : "transparent", color: active ? "#6EE7B7" : "#888", border: `1px solid ${active ? "rgba(110,231,183,0.25)" : "transparent"}`, cursor: "pointer", transition: "all 0.15s", fontFamily: "inherit", textAlign: "left" }}>
                <Icon size={12} /> {cat.label}
              </button>
            );
          })}
        </div>
      </SideSection>

      <SideSection title="Difficulty" open={diffOpen} onToggle={() => setDiffOpen(!diffOpen)}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {DIFFICULTIES.map(d => {
            const active = activeDiff === d;
            const dc = d !== "All" ? diffColor(d) : null;
            return (
              <button key={d} onClick={() => setActiveDiff(d)}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 10px", borderRadius: 7, fontSize: 12, background: active ? (dc ? dc.bg : "rgba(255,255,255,0.08)") : "transparent", color: active ? (dc ? dc.text : "#e5e5e5") : "#888", border: `1px solid ${active ? (dc ? dc.text + "35" : "rgba(255,255,255,0.15)") : "transparent"}`, cursor: "pointer", transition: "all 0.15s", fontFamily: "inherit" }}>
                {d}
                {active && <Check size={11} />}
              </button>
            );
          })}
        </div>
      </SideSection>

      <SideSection title="Duration" open={durOpen} onToggle={() => setDurOpen(!durOpen)}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {DURATIONS.map(d => {
            const active = activeDuration === d;
            return (
              <button key={d} onClick={() => setActiveDuration(d)}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 10px", borderRadius: 7, fontSize: 12, background: active ? "rgba(255,255,255,0.08)" : "transparent", color: active ? "#e5e5e5" : "#888", border: "1px solid transparent", cursor: "pointer", transition: "all 0.15s", fontFamily: "inherit" }}>
                {d}
                {active && <Check size={11} color="#6EE7B7" />}
              </button>
            );
          })}
        </div>
      </SideSection>

      <SideSection title="Technology" open={techOpen} onToggle={() => setTechOpen(!techOpen)}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {TECH_FILTERS.map(t => {
            const active = activeTech.includes(t);
            return (
              <button key={t} onClick={() => setActiveTech(prev => active ? prev.filter(x => x !== t) : [...prev, t])}
                style={{ padding: "4px 9px", borderRadius: 5, fontSize: 11, background: active ? "rgba(110,231,183,0.12)" : "rgba(255,255,255,0.04)", color: active ? "#6EE7B7" : "#666", border: `1px solid ${active ? "rgba(110,231,183,0.3)" : "rgba(255,255,255,0.07)"}`, cursor: "pointer", transition: "all 0.15s", fontFamily: "inherit" }}>
                {t}
              </button>
            );
          })}
        </div>
      </SideSection>
    </div>
  );
}

// ── SORT BAR ──────────────────────────────────────────────────────────────────

function SortBar({ sort, setSort, resultCount }) {
  const [open, setOpen] = useState(false);
  const current = SORT_OPTIONS.find(o => o.id === sort);
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
      <p style={{ fontSize: 13, color: "#555" }}>
        <span style={{ color: "#e5e5e5", fontWeight: 600 }}>{resultCount}</span> projects
      </p>
      <div style={{ position: "relative" }}>
        <button
          onClick={() => setOpen(!open)}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 8, color: "#888", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
          <current.icon size={13} /> {current.label}
          <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} style={{ display: "flex" }}>
            <ChevronDown size={13} />
          </motion.span>
        </button>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.96 }}
              transition={{ duration: 0.18 }}
              style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 50, background: "#161616", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: 6, minWidth: 200, boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
              {SORT_OPTIONS.map(o => {
                const Icon = o.icon;
                return (
                  <button key={o.id} onClick={() => { setSort(o.id); setOpen(false); }}
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 7, fontSize: 13, background: sort === o.id ? "rgba(110,231,183,0.1)" : "transparent", color: sort === o.id ? "#6EE7B7" : "#888", border: "none", cursor: "pointer", fontFamily: "inherit", textAlign: "left", transition: "background 0.15s" }}>
                    <Icon size={13} /> {o.label}
                    {sort === o.id && <Check size={12} style={{ marginLeft: "auto" }} color="#6EE7B7" />}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── EMPTY STATE ───────────────────────────────────────────────────────────────

function EmptyState({ onReset }) {
  return (
    <FadeIn>
      <div style={{ textAlign: "center", padding: "80px 40px", gridColumn: "1 / -1" }}>
        <div style={{ width: 80, height: 80, borderRadius: 20, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
          <Search size={32} color="#333" />
        </div>
        <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 28, color: "#555", marginBottom: 10 }}>No projects found</h3>
        <p style={{ fontSize: 14, color: "#3f3f3f", marginBottom: 28 }}>Try adjusting your filters or search terms</p>
        <GhostBtn onClick={onReset}><RotateCcw size={13} /> Reset filters</GhostBtn>
      </div>
    </FadeIn>
  );
}

// ── PAGINATION ────────────────────────────────────────────────────────────────

function Pagination({ page, totalPages, setPage }) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <FadeIn>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 48 }}>
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          style={{ display: "flex", alignItems: "center", gap: 5, padding: "8px 14px", borderRadius: 8, fontSize: 13, background: "transparent", border: "1px solid rgba(255,255,255,0.09)", color: page === 1 ? "#333" : "#888", cursor: page === 1 ? "not-allowed" : "pointer", fontFamily: "inherit", transition: "all 0.2s" }}>
          <ChevronLeft size={14} /> Prev
        </button>
        {pages.map(p => (
          <button key={p} onClick={() => setPage(p)}
            style={{ width: 36, height: 36, borderRadius: 8, fontSize: 13, background: page === p ? "rgba(110,231,183,0.12)" : "transparent", border: `1px solid ${page === p ? "rgba(110,231,183,0.3)" : "rgba(255,255,255,0.09)"}`, color: page === p ? "#6EE7B7" : "#888", cursor: "pointer", fontFamily: "inherit", fontWeight: page === p ? 600 : 400, transition: "all 0.2s" }}>
            {p}
          </button>
        ))}
        <button
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          style={{ display: "flex", alignItems: "center", gap: 5, padding: "8px 14px", borderRadius: 8, fontSize: 13, background: "transparent", border: "1px solid rgba(255,255,255,0.09)", color: page === totalPages ? "#333" : "#888", cursor: page === totalPages ? "not-allowed" : "pointer", fontFamily: "inherit", transition: "all 0.2s" }}>
          Next <ChevronRight size={14} />
        </button>
      </div>
    </FadeIn>
  );
}

// ── STATS SECTION ─────────────────────────────────────────────────────────────

function StatsSection() {
  return (
    <section style={{ padding: "80px 24px", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.01)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 600, height: 200, background: "radial-gradient(ellipse, rgba(129,140,248,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
        <FadeIn style={{ textAlign: "center", marginBottom: 48 }}>
          <SectionLabel>PLATFORM STATS</SectionLabel>
          <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 38, color: "#f0f0f0", letterSpacing: "-0.02em", marginTop: 10 }}>Numbers that speak.</h2>
        </FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 20 }}>
          {STATS.map((s, i) => {
            const ref = useRef(null);
            const inView = useInView(ref, { once: true });
            const count = useCountUp(s.val, inView);
            const display = s.val >= 1000 ? `${(count / 1000).toFixed(count >= s.val ? (s.val % 1000 === 0 ? 0 : 1) : 1)}k` : count;
            return (
              <FadeIn key={s.label} delay={i * 0.1}>
                <div ref={ref} style={{ textAlign: "center", padding: "28px 20px", borderRadius: 14, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(20px)" }}>
                  <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 48, lineHeight: 1, background: "linear-gradient(135deg, #fff 0%, #888 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", marginBottom: 8 }}>
                    {s.val >= 1000 ? `${(count / 1000).toFixed(1)}k` : count}{s.suffix}
                  </div>
                  <div style={{ fontSize: 13, color: "#555" }}>{s.label}</div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── CTA SECTION ───────────────────────────────────────────────────────────────

function CtaSection() {
  return (
    <section style={{ padding: "80px 24px 100px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ borderRadius: 20, padding: "60px 40px", textAlign: "center", position: "relative", overflow: "hidden", border: "1px solid rgba(110,231,183,0.15)", background: "rgba(110,231,183,0.02)" }}>
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "130%", height: "130%", background: "radial-gradient(ellipse at 50% 50%, rgba(110,231,183,0.06) 0%, transparent 65%)", pointerEvents: "none" }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "4px 14px", borderRadius: 999, background: "rgba(110,231,183,0.1)", border: "1px solid rgba(110,231,183,0.2)", marginBottom: 20 }}>
                <Sparkles size={11} color="#6EE7B7" />
                <span style={{ fontSize: 12, color: "#6EE7B7", fontWeight: 500 }}>Free forever for self-learners</span>
              </div>
              <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(30px, 5vw, 46px)", color: "#f0f0f0", letterSpacing: "-0.02em", marginBottom: 14, lineHeight: 1.15 }}>
                Ready to start building?
              </h2>
              <p style={{ fontSize: 15, color: "#555", lineHeight: 1.7, marginBottom: 32, maxWidth: 400, margin: "0 auto 32px" }}>
                Pick a project, follow the roadmap, and ship something you're proud of.
              </p>
              <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                <PrimaryBtn>Browse All Paths <ArrowRight size={14} /></PrimaryBtn>
                <GhostBtn>Join Community</GhostBtn>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ── ROOT COMPONENT ────────────────────────────────────────────────────────────

export default function Projects() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeDiff, setActiveDiff] = useState("All");
  const [activeDuration, setActiveDuration] = useState("Any");
  const [activeTech, setActiveTech] = useState([]);
  const [sort, setSort] = useState("popular");
  const [page, setPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [projects, setProjects] = useState([]);
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [featuredProject, setFeaturedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Single source of truth: every filter/sort/page change triggers one backend call
  useEffect(() => {
    setLoading(true);
    getProjects({
      page,
      limit: ITEMS_PER_PAGE,
      category: activeCategory,
      difficulty: activeDiff,
      duration: activeDuration,
      tech: activeTech,
      sort,
      search,
    })
      .then((data) => {
        setProjects(data.projects);
        console.log(data.projects)
        setTotalProjects(data.totalProjects);
        setTotalPages(data.totalPages);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [page, activeCategory, activeDiff, activeDuration, activeTech, sort, search]);

  // Fetch featured project once, separately (doesn't depend on filters/page)
  useEffect(() => {
    getProjects({ page: 1, limit: 1, featured: true })
      .then((data) => setFeaturedProject(data.projects[0] ?? null))
      .catch(() => {}); // non-critical, fail silently
  }, []);

  function resetFilters() {
    setSearch(""); setActiveCategory("all");
    setActiveDiff("All"); setActiveDuration("Any");
    setActiveTech([]); setSort("popular"); setPage(1);
  }

  // Reset to page 1 whenever a filter changes (not when page itself changes)
  useEffect(() => {
    setPage(1);
  }, [search, activeCategory, activeDiff, activeDuration, activeTech, sort]);

  if (error) {
    return (
      <div style={{ minHeight: "100vh", background: "#0A0A0A", color: "#e5e5e5", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif" }}>
        <p style={{ color: "#F9A8D4" }}>Failed to load projects: {error}</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0A", color: "#e5e5e5", fontFamily: "'DM Sans', sans-serif" }}>
      {/* ...unchanged styles, Navbar, Hero... */}
    <Navbar/>
      <Hero
        search={search} setSearch={setSearch}
        activeCategory={activeCategory} setActiveCategory={setActiveCategory}
        activeDiff={activeDiff} setActiveDiff={setActiveDiff}
        totalCount={totalProjects}
      />

      {featuredProject && <FeaturedBanner project={featuredProject} />}
      <StatsSection />

      <section style={{ padding: "72px 24px 40px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {/* ...section label unchanged... */}
          <div style={{ display: "flex", gap: 28, alignItems: "flex-start" }}>
            <div className="sidebar-desktop" style={{ display: "block" }}>
              <Sidebar
                search={search} setSearch={setSearch}
                activeCategory={activeCategory} setActiveCategory={setActiveCategory}
                activeDiff={activeDiff} setActiveDiff={setActiveDiff}
                activeDuration={activeDuration} setActiveDuration={setActiveDuration}
                activeTech={activeTech} setActiveTech={setActiveTech}
                onReset={resetFilters}
              />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <SortBar sort={sort} setSort={setSort} resultCount={totalProjects} />

              {loading ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} style={{ borderRadius: 14, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", height: 320, animation: "pulse 1.5s ease-in-out infinite" }} />
                  ))}
                </div>
              ) : projects.length === 0 ? (
                <EmptyState onReset={resetFilters} />
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                  <AnimatePresence mode="popLayout">
                    {projects.map((p, i) => (
                      <ProjectCard key={p._id} project={p} index={i} />
                    ))}
                  </AnimatePresence>
                </div>
              )}

              <Pagination page={page} totalPages={totalPages} setPage={setPage} />
            </div>
          </div>
        </div>
      </section>

      <CtaSection />
      {/* ...footer unchanged... */}
    </div>
  );
}
