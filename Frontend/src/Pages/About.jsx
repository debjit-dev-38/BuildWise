import { useState, useRef, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import {
  Zap, Globe, Users, Star, CheckCircle2, ArrowRight, Sparkles,
  Code2, BookOpen, Rocket, Target, TrendingUp, Heart,
  ChevronRight, MessageSquare, Award, Layers, BarChart3, Briefcase,
  GitBranch, Cpu, Shield, Play, Mail, X, Check, Minus,
  Map, Compass, Terminal, Lightbulb, Coffee, Clock
} from "lucide-react";
import { philosophy, team, roadmap, comparisonTable } from "../data/about";
import { testimonials } from "../data/testimonials";
import { howItWorksSteps, platformStats } from "../data/platform";
import {G} from "../Constants/theme";

/* ── Fonts ── */
const _f = document.createElement("link");
_f.rel = "stylesheet";
_f.href = "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Mono:wght@400;500&display=swap";
document.head.appendChild(_f);

/* ── Helpers ── */
function ScrollReveal({ children, delay = 0, y = 32 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay }}>
      {children}
    </motion.div>
  );
}

function Counter({ to, suffix = "", prefix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const dur = 1600;
    const start = performance.now();
    const isFloat = to % 1 !== 0;
    const tick = now => {
      const p = Math.min((now - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setVal(isFloat ? +(to * e).toFixed(1) : Math.round(to * e));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, to]);
  return <span ref={ref}>{prefix}{val}{suffix}</span>;
}

function Label({ children, color = G.green }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
      <div style={{ width: 18, height: 1, background: color, opacity: 0.7 }} />
      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color }}>{children}</span>
      <div style={{ width: 18, height: 1, background: color, opacity: 0.7 }} />
    </div>
  );
}

function GlassCard({ children, style = {}, hover = false, glowColor = "rgba(110,231,183,0.12)" }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => hover && setHov(true)}
      onMouseLeave={() => hover && setHov(false)}
      style={{
        background: G.card,
        border: `1px solid ${hov ? "rgba(110,231,183,0.22)" : G.border}`,
        backdropFilter: "blur(12px)",
        borderRadius: 20,
        transform: hov ? "translateY(-5px)" : "translateY(0)",
        boxShadow: hov ? `0 24px 64px rgba(0,0,0,0.55), 0 0 48px ${glowColor}` : "0 4px 24px rgba(0,0,0,0.3)",
        transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)",
        ...style,
      }}>
      {children}
    </div>
  );
}

function Particles({ count = 20 }) {
  const pts = useRef(Array.from({ length: count }, (_, i) => ({
    id: i, x: Math.random() * 100, y: Math.random() * 100,
    size: Math.random() * 2 + 1, delay: Math.random() * 5, dur: Math.random() * 5 + 4,
  }))).current;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {pts.map(p => (
        <motion.div key={p.id}
          style={{ position: "absolute", left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, borderRadius: "50%", background: "rgba(110,231,183,0.5)" }}
          animate={{ y: [-10, 10, -10], opacity: [0, 0.6, 0] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" }} />
      ))}
    </div>
  );
}

/* ── Background ── */
function Background() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.022) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.022) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
      <div style={{ position: "absolute", top: "-20%", right: "-10%", width: 800, height: 800, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(110,231,183,0.07) 0%,transparent 70%)", filter: "blur(60px)" }} />
      <div style={{ position: "absolute", bottom: "5%", left: "-15%", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(129,140,248,0.06) 0%,transparent 70%)", filter: "blur(60px)" }} />
      <div style={{ position: "absolute", top: "45%", left: "35%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(110,231,183,0.035) 0%,transparent 70%)", filter: "blur(50px)" }} />
    </div>
  );
}
/* ═══════════════════════════════════════════════════════
   MAIN
════════════════════════════════════════════════════════ */
export default function About() {
  const navigate = useNavigate();
  const W = { maxWidth: 1100, margin: "0 auto", padding: "0 24px" };

  return (
    <div style={{ minHeight: "100vh", background: G.bg, color: G.text, ...G.sans, overflowX: "hidden" }}>
      <Background />
      <Navbar />

      {/* ═══ HERO ═══ */}
      <section style={{ position: "relative", zIndex: 1, paddingTop: 160, paddingBottom: 120, textAlign: "center", overflow: "hidden" }}>
        {/* Big glow */}
        <div style={{ position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)", width: 700, height: 400, background: "radial-gradient(ellipse, rgba(110,231,183,0.12) 0%,transparent 70%)", filter: "blur(40px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "30%", left: "30%", width: 400, height: 300, background: "radial-gradient(ellipse, rgba(129,140,248,0.08) 0%,transparent 70%)", filter: "blur(40px)", pointerEvents: "none" }} />

        <div style={{ ...W, position: "relative", zIndex: 1 }}>
          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 16px", borderRadius: 24, background: "rgba(110,231,183,0.07)", border: "1px solid rgba(110,231,183,0.2)", color: G.green, fontSize: 12, fontWeight: 600, marginBottom: 32 }}>
            <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}
              style={{ width: 6, height: 6, borderRadius: "50%", background: G.green, boxShadow: `0 0 6px ${G.green}` }} />
            Our mission — Building the future of learning
          </motion.div>

          {/* Headline */}
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{ ...G.serif, fontSize: "clamp(40px, 9vw, 72px)", fontWeight: 400, lineHeight: 1.08, margin: "0 auto 24px", maxWidth: 820, letterSpacing: "-0.01em" }}>
            Building the Future of Learning <em style={{ color: G.green, fontStyle: "italic" }}>Through Projects.</em>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            style={{ fontSize: 18, color: "rgba(255,255,255,0.55)", maxWidth: 560, margin: "0 auto 48px", lineHeight: 1.7 }}>
            BuildWise helps developers learn by shipping real products instead of endlessly consuming tutorials.
          </motion.p>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.3 }}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginBottom: 72, flexWrap: "wrap" }}>
            <motion.button onClick={() => navigate("/projects")} whileHover={{ y: -2, boxShadow: "0 14px 44px rgba(110,231,183,0.45)" }} whileTap={{ scale: 0.97 }}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 14, background: G.green, color: G.bg, fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer", boxShadow: "0 6px 24px rgba(110,231,183,0.3)", transition: "box-shadow 0.3s" }}>
              <Globe size={15} /> Explore Projects
            </motion.button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.6 }}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 32, flexWrap: "wrap" }}>
            {[
              { value: "18,000+", label: "Builders" },
              { value: "2,400+", label: "Projects Completed" },
              { value: "48", label: "Learning Paths" },
            ].map(({ value, label }, i) => (
              <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                <span style={{ ...G.serif, fontSize: 26, fontWeight: 400, background: "linear-gradient(135deg,#F0F0F0,#6EE7B7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{value}</span>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", letterSpacing: "0.04em" }}>{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ OUR STORY ═══ */}
      <section style={{ position: "relative", zIndex: 1, padding: "100px 24px" }}>
        <div style={{ ...W, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 40, alignItems: "center" }}>
          {/* Left — story */}
          <ScrollReveal>
            <Label>Our Story</Label>
            <h2 style={{ ...G.serif, fontSize: 44, fontWeight: 400, lineHeight: 1.15, margin: "0 0 28px", color: G.text }}>
              We got tired of learning that never led to building.
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {[
                { color: "#F87171", icon: X, title: "The Problem", body: "Most developers spend hundreds of hours watching tutorials — but struggle to build anything from scratch. Tutorial completion ≠ engineering ability." },
                { color: G.amber, icon: Lightbulb, title: "The Reality", body: "Learning happens through building. The friction of debugging real code, designing real systems, and shipping real products is irreplaceable." },
                { color: G.green, icon: CheckCircle2, title: "The Solution", body: "BuildWise provides structured project-based learning. Real projects, real stack, real deployment — guided by a curriculum built by senior engineers." },
              ].map(({ color, icon: Icon, title, body }) => (
                <div key={title} style={{ display: "flex", gap: 16 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: `${color}12`, border: `1px solid ${color}28`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                    <Icon size={14} style={{ color }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: G.text, marginBottom: 5 }}>{title}</div>
                    <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>{body}</div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>

          {/* Right — animated timeline */}
          <ScrollReveal delay={0.12}>
            <div style={{ position: "relative", padding: "8px 0" }}>
              {/* Vertical line */}
              <div style={{ position: "absolute", left: 17, top: 0, bottom: 0, width: 1, background: "linear-gradient(to bottom, transparent, rgba(110,231,183,0.4) 20%, rgba(110,231,183,0.4) 80%, transparent)" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 0, paddingLeft: 52 }}>
                {[
                  { year: "2021", title: "The frustration begins", desc: "Two engineers leave FAANG, frustrated watching talented developers fail to land jobs because they couldn't build anything without a tutorial." },
                  { year: "2022", title: "First prototype", desc: "A Notion doc with 12 project briefs shared on Twitter. 800 developers sign up overnight. The idea had legs." },
                  { year: "2023", title: "BuildWise launches", desc: "V1 ships with 10 learning paths. 2,000 developers complete their first project in 90 days. The platform proves itself." },
                  { year: "2024", title: "Scale & impact", desc: "18,000 builders. 2,400 projects shipped. Developers hired at Linear, Vercel, Stripe, Anthropic, and more." },
                  { year: "Now", title: "What comes next", desc: "AI-guided project reviews, community challenges, and a mentorship network. The best is still ahead." },
                ].map(({ year, title, desc }, i) => (
                  <ScrollReveal key={year} delay={i * 0.08}>
                    <div style={{ position: "relative", paddingBottom: 32 }}>
                      {/* Dot */}
                      <motion.div
                        initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
                        transition={{ delay: i * 0.1, type: "spring", stiffness: 400 }}
                        style={{ position: "absolute", left: -52, top: 4, width: 34, height: 34, borderRadius: "50%", background: "#0A0A0A", border: `1.5px solid ${i === 4 ? G.green : "rgba(110,231,183,0.35)"}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: i === 4 ? `0 0 14px rgba(110,231,183,0.25)` : "none" }}>
                        <span style={{ fontSize: 9, fontWeight: 700, color: G.green, ...G.mono }}>{year}</span>
                      </motion.div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: G.text, marginBottom: 5 }}>{title}</div>
                      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.65 }}>{desc}</div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══ PHILOSOPHY ═══ */}
      <section style={{ position: "relative", zIndex: 1, padding: "100px 24px", borderTop: `1px solid ${G.border}` }}>
        <div style={W}>
          <ScrollReveal>
            <div style={{ textAlign: "center", marginBottom: 60 }}>
              <Label>Our Philosophy</Label>
              <h2 style={{ ...G.serif, fontSize: 48, fontWeight: 400, color: G.text, margin: "0 auto", maxWidth: 600, lineHeight: 1.15 }}>
                Three principles we never compromise on.
              </h2>
            </div>
          </ScrollReveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            {philosophy.map(({ icon: Icon, color, title, desc }, i) => (
              <ScrollReveal key={title} delay={i * 0.1}>
                <GlassCard hover glowColor={`${color}18`} style={{ padding: "36px 30px", height: "100%" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: `${color}10`, border: `1px solid ${color}22`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 22 }}>
                    <Icon size={20} style={{ color }} />
                  </div>
                  <h3 style={{ ...G.serif, fontSize: 22, fontWeight: 400, color: G.text, margin: "0 0 12px" }}>{title}</h3>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,0.48)", lineHeight: 1.75, margin: 0 }}>{desc}</p>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ COMPARISON ═══ */}
      <section style={{ position: "relative", zIndex: 1, padding: "100px 24px" }}>
        <div style={W}>
          <ScrollReveal>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <Label>Why BuildWise Exists</Label>
              <h2 style={{ ...G.serif, fontSize: 48, fontWeight: 400, color: G.text, margin: "0 auto 16px", maxWidth: 600, lineHeight: 1.15 }}>
                Traditional learning vs BuildWise.
              </h2>
              <p style={{ fontSize: 16, color: "rgba(255,255,255,0.4)", maxWidth: 480, margin: "0 auto" }}>
                The gap between knowing and doing is wide. We bridge it.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.08}>
            <GlassCard style={{ overflow: "hidden" }}>
              {/* Header row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderBottom: `1px solid ${G.border}` }}>
                <div style={{ padding: "18px 28px", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Category</div>
                <div style={{ padding: "18px 28px", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em", textTransform: "uppercase", borderLeft: `1px solid ${G.border}` }}>Traditional Learning</div>
                <div style={{ padding: "18px 28px", fontSize: 12, fontWeight: 700, color: G.green, letterSpacing: "0.08em", textTransform: "uppercase", borderLeft: `1px solid rgba(110,231,183,0.15)`, background: "rgba(110,231,183,0.03)" }}>BuildWise</div>
              </div>
              {/* Rows */}
              {comparisonTable.map(({ cat, old, bw }, i) => (
                <motion.div key={cat}
                  style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderBottom: i < comparisonTable.length - 1 ? `1px solid ${G.border}` : "none", transition: "background 0.2s" }}
                  whileHover={{ background: "rgba(255,255,255,0.015)" }}>
                  <div style={{ padding: "16px 28px", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)" }}>{cat}</div>
                  <div style={{ padding: "16px 28px", fontSize: 13, color: "rgba(255,255,255,0.35)", borderLeft: `1px solid ${G.border}`, display: "flex", alignItems: "center", gap: 8 }}>
                    <Minus size={13} style={{ color: "#F87171", flexShrink: 0 }} /> {old}
                  </div>
                  <div style={{ padding: "16px 28px", fontSize: 13, color: "rgba(255,255,255,0.8)", borderLeft: `1px solid rgba(110,231,183,0.12)`, background: "rgba(110,231,183,0.02)", display: "flex", alignItems: "center", gap: 8 }}>
                    <Check size={13} style={{ color: G.green, flexShrink: 0 }} /> {bw}
                  </div>
                </motion.div>
              ))}
            </GlassCard>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section style={{ position: "relative", zIndex: 1, padding: "100px 24px", borderTop: `1px solid ${G.border}`, borderBottom: `1px solid ${G.border}` }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 400, background: "radial-gradient(ellipse, rgba(110,231,183,0.07) 0%,transparent 70%)", filter: "blur(50px)", pointerEvents: "none" }} />
        <div style={W}>
          <ScrollReveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <Label>By The Numbers</Label>
              <h2 style={{ ...G.serif, fontSize: 48, fontWeight: 400, color: G.text, margin: 0 }}>
                The builders have spoken.
              </h2>
            </div>
          </ScrollReveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            {platformStats.map(({ to, suffix, label, icon: Icon }, i) => (
              <ScrollReveal key={label} delay={i * 0.09}>
                <GlassCard hover style={{ padding: "36px 28px", textAlign: "center" }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: "rgba(110,231,183,0.07)", border: "1px solid rgba(110,231,183,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
                    <Icon size={17} style={{ color: G.green }} />
                  </div>
                  <div style={{ ...G.serif, fontSize: 46, fontWeight: 400, lineHeight: 1, marginBottom: 10, background: "linear-gradient(135deg,#F0F0F0,#6EE7B7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    <Counter to={to} suffix={suffix} />
                  </div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", letterSpacing: "0.04em" }}>{label}</div>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section style={{ position: "relative", zIndex: 1, padding: "100px 24px" }}>
        <div style={W}>
          <ScrollReveal>
            <div style={{ textAlign: "center", marginBottom: 72 }}>
              <Label>How BuildWise Works</Label>
              <h2 style={{ ...G.serif, fontSize: 48, fontWeight: 400, color: G.text, margin: "0 auto", maxWidth: 520, lineHeight: 1.15 }}>
                From zero to deployed in three steps.
              </h2>
            </div>
          </ScrollReveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, position: "relative" }}>
            {/* Connector lines */}
            <div style={{ position: "absolute", top: 64, left: "33.33%", right: "33.33%", height: 1, background: "linear-gradient(90deg, rgba(110,231,183,0.3), rgba(129,140,248,0.3))", zIndex: 0 }} />
            {howItWorksSteps.map(({ icon: Icon, step, title, desc }, i) => (
              <ScrollReveal key={title} delay={i * 0.12}>
                <GlassCard hover style={{ padding: "36px 28px", position: "relative", zIndex: 1 }}>
                  {/* Step badge */}
                  <div style={{ position: "absolute", top: 20, right: 20, fontSize: 11, ...G.mono, color: "rgba(255,255,255,0.2)", fontWeight: 500 }}>{step}</div>
                  <div style={{ width: 52, height: 52, borderRadius: 16, background: "linear-gradient(135deg,rgba(110,231,183,0.1),rgba(129,140,248,0.08))", border: "1px solid rgba(110,231,183,0.18)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                    <Icon size={22} style={{ color: G.green }} />
                  </div>
                  <h3 style={{ ...G.serif, fontSize: 22, fontWeight: 400, color: G.text, margin: "0 0 12px" }}>{title}</h3>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.75, margin: 0 }}>{desc}</p>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TEAM ═══ */}
      <section style={{ position: "relative", zIndex: 1, padding: "100px 24px", borderTop: `1px solid ${G.border}` }}>
        <div style={W}>
          <ScrollReveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <Label>Meet The Team</Label>
              <h2 style={{ ...G.serif, fontSize: 48, fontWeight: 400, color: G.text, margin: "0 auto 16px", maxWidth: 560, lineHeight: 1.15 }}>
                Built by engineers who felt the same frustration.
              </h2>
              <p style={{ fontSize: 16, color: "rgba(255,255,255,0.4)", maxWidth: 460, margin: "0 auto" }}>
                We've all been through tutorial hell. That's why we built the way out.
              </p>
            </div>
          </ScrollReveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            {team.map(({ name, role, bio, img }, i) => (
              <ScrollReveal key={name} delay={i * 0.09}>
                <motion.div
                  whileHover={{
                    y: -6,
                    borderColor: "rgba(110,231,183,0.22)",
                    boxShadow:
                      "0 24px 64px rgba(0,0,0,0.6), 0 0 48px rgba(110,231,183,0.1)",
                  }}
                  transition={{ duration: 0.35 }}
                  style={{
                    background: G.card,
                    borderRadius: 20,
                    overflow: "hidden",
                    border: `1px solid ${G.border}`,
                    boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
                    cursor: "default",
                  }}
                >
                  {/* Photo */}
                  <div
                    style={{
                      position: "relative",
                      height: 220,
                      overflow: "hidden",
                    }}
                  >
                    <motion.img
                      src={img}
                      alt={name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      whileHover={{ scale: 1.06 }}
                      transition={{
                        duration: 0.5,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    />

                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(to top, rgba(10,10,10,0.9) 0%, transparent 60%)",
                      }}
                    />

                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(135deg, rgba(110,231,183,0.08) 0%, transparent 60%)",
                      }}
                    />
                  </div>

                  <div style={{ padding: "18px 20px" }}>
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: G.text,
                        marginBottom: 3,
                      }}
                    >
                      {name}
                    </div>

                    <div
                      style={{
                        fontSize: 11,
                        color: G.green,
                        fontWeight: 600,
                        letterSpacing: "0.04em",
                        marginBottom: 10,
                      }}
                    >
                      {role}
                    </div>

                    <p
                      style={{
                        fontSize: 12,
                        color: "rgba(255,255,255,0.4)",
                        lineHeight: 1.65,
                        margin: 0,
                      }}
                    >
                      {bio}
                    </p>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ COMMUNITY ═══ */}
      <section style={{ position: "relative", zIndex: 1, padding: "100px 24px" }}>
        <div style={W}>
          <ScrollReveal>
            <div style={{ textAlign: "center", marginBottom: 60 }}>
              <Label>Community Impact</Label>
              <h2 style={{ ...G.serif, fontSize: 48, fontWeight: 400, color: G.text, margin: "0 auto 16px", maxWidth: 560, lineHeight: 1.15 }}>
                Builders helping builders, every day.
              </h2>
            </div>
          </ScrollReveal>

          {/* Testimonials */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 24 }}>
            {testimonials.map(({ name, role, quote, avatar, color }, i) => (
              <ScrollReveal key={name} delay={i * 0.09}>
                <GlassCard hover glowColor={`${color}15`} style={{ padding: "28px 26px" }}>
                  {/* Stars */}
                  <div style={{ display: "flex", gap: 3, marginBottom: 18 }}>
                    {[...Array(5)].map((_, j) => <Star key={j} size={12} style={{ color: G.amber }} fill={G.amber} />)}
                  </div>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.75, fontStyle: "italic", margin: "0 0 22px" }}>"{quote}"</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${color}18`, border: `1px solid ${color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color }}>
                      {avatar}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: G.text }}>{name}</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{role}</div>
                    </div>
                  </div>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>

          {/* Impact row */}
          <ScrollReveal delay={0.1}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
              {[
                { icon: Briefcase, label: "Hired at top companies", value: "340+", color: G.green },
                { icon: Rocket, label: "Side projects launched", value: "1,200+", color: G.indigo },
                { icon: Star, label: "Avg project rating", value: "4.9★", color: G.amber },
                { icon: Globe, label: "Countries represented", value: "68", color: G.green },
              ].map(({ icon: Icon, label, value, color }) => (
                <GlassCard key={label} hover glowColor={`${color}12`} style={{ padding: "22px 20px", textAlign: "center" }}>
                  <Icon size={18} style={{ color, marginBottom: 10 }} />
                  <div style={{ ...G.serif, fontSize: 28, fontWeight: 400, color: G.text, marginBottom: 5 }}>{value}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.38)", letterSpacing: "0.04em" }}>{label}</div>
                </GlassCard>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══ ROADMAP ═══ */}
      <section style={{ position: "relative", zIndex: 1, padding: "100px 24px", borderTop: `1px solid ${G.border}` }}>
        <div style={W}>
          <ScrollReveal>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "start" }}>
              {/* Left */}
              <div>
                <Label>Roadmap & Vision</Label>
                <h2 style={{ ...G.serif, fontSize: 44, fontWeight: 400, color: G.text, margin: "0 0 20px", lineHeight: 1.15 }}>
                  We're just getting started.
                </h2>
                <p style={{ fontSize: 16, color: "rgba(255,255,255,0.45)", lineHeight: 1.75, margin: "0 0 36px" }}>
                  The future of BuildWise is AI-guided, community-powered, and open to every developer on the planet — regardless of geography or economic access.
                </p>
                <GlassCard style={{ padding: "22px 24px", border: "1px solid rgba(110,231,183,0.18)", background: "rgba(110,231,183,0.02)" }}>
                  <div style={{ fontSize: 12, color: G.green, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10 }}>Long-term vision</div>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.75, margin: 0 }}>
                    A world where every developer can learn through building — mentored by AI, supported by community, and validated by shipped products rather than certificates.
                  </p>
                </GlassCard>
              </div>

              {/* Right — roadmap items */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {roadmap.map(({ icon: Icon, label, desc, color, status }, i) => (
                  <ScrollReveal key={label} delay={i * 0.08}>
                    <GlassCard hover glowColor={`${color}12`} style={{ padding: "20px 22px", display: "flex", gap: 16, alignItems: "flex-start" }}>
                      <div style={{ width: 38, height: 38, borderRadius: 11, background: `${color}10`, border: `1px solid ${color}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Icon size={15} style={{ color }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: G.text }}>{label}</span>
                          <span style={{ fontSize: 10, padding: "2px 9px", borderRadius: 10, background: `${color}12`, border: `1px solid ${color}22`, color, fontWeight: 600, ...G.mono, flexShrink: 0 }}>{status}</span>
                        </div>
                        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.65, margin: 0 }}>{desc}</p>
                      </div>
                    </GlassCard>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section style={{ position: "relative", zIndex: 1, padding: "80px 24px 120px" }}>
        <div style={W}>
          <ScrollReveal>
            <div style={{ position: "relative", borderRadius: 28, overflow: "hidden", padding: "96px 60px", textAlign: "center", border: "1px solid rgba(110,231,183,0.13)", background: "rgba(255,255,255,0.01)" }}>
              {/* Glows */}
              <div style={{ position: "absolute", top: "-20%", left: "50%", transform: "translateX(-50%)", width: 600, height: 400, background: "radial-gradient(ellipse, rgba(110,231,183,0.18) 0%,transparent 70%)", filter: "blur(40px)", pointerEvents: "none" }} />
              <div style={{ position: "absolute", bottom: 0, right: 0, width: 350, height: 250, background: "radial-gradient(ellipse, rgba(129,140,248,0.1) 0%,transparent 70%)", filter: "blur(40px)", pointerEvents: "none" }} />
              {/* Grid */}
              <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px)", backgroundSize: "40px 40px", opacity: 0.6 }} />
              <Particles count={18} />

              <div style={{ position: "relative", zIndex: 1 }}>
                <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
                  style={{ width: 52, height: 52, borderRadius: 16, background: "rgba(110,231,183,0.08)", border: "1px solid rgba(110,231,183,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px", boxShadow: "0 0 24px rgba(110,231,183,0.15)" }}>
                  <Sparkles size={22} style={{ color: G.green }} />
                </motion.div>

                <h2 style={{ ...G.serif, fontSize: 56, fontWeight: 400, color: G.text, margin: "0 0 16px", lineHeight: 1.1 }}>
                  Ready to Start Building?
                </h2>
                <p style={{ fontSize: 18, color: "rgba(255,255,255,0.45)", maxWidth: 440, margin: "0 auto 48px", lineHeight: 1.7 }}>
                  Join thousands of developers learning through real projects.
                </p>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
                  <motion.button onClick={() => navigate("/projects")}
                    whileHover={{ y: -3, boxShadow: "0 18px 52px rgba(110,231,183,0.5)" }}
                    whileTap={{ scale: 0.97 }}
                    style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "15px 30px", borderRadius: 16, background: G.green, color: G.bg, fontSize: 15, fontWeight: 700, border: "none", cursor: "pointer", boxShadow: "0 6px 28px rgba(110,231,183,0.35)", transition: "box-shadow 0.3s" }}>
                    <Globe size={15} /> Explore Projects
                  </motion.button>
                  <motion.button
                    whileHover={{ y: -2, background: "rgba(255,255,255,0.06)" }}
                    whileTap={{ scale: 0.97 }}
                    style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "15px 30px", borderRadius: 16, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.8)", fontSize: 15, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>
                    <Sparkles size={15} /> Get Started
                  </motion.button>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
