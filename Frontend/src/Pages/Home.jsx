import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Hammer, ArrowRight, Play,
  Search, Map, Rocket, Clock, Check, X,
  Star, Menu, BookOpen, Users
} from "lucide-react";
import Navbar from "../Components/Navbar";
import { platformStats, communityStats, howItWorksSteps } from "../data/platform";
import { comparisonTable } from "../data/about";
import { testimonials } from "../data/testimonials";
import { getFeaturedProjects } from "../Services/projectService";
import { getPublishedPaths } from "../Services/learningPathService";
import { COLORS, FONTS } from "../Constants/theme";

// ── MAIN APP ─────────────────────────────────────────────────────────────────

export default function Home() {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [paths, setPaths] = useState([]);

  useEffect(() => {
    getFeaturedProjects().then(setFeaturedProjects);
    getPublishedPaths().then(setPaths);
  }, []);
  return (
    <div className="min-h-screen" style={{ background: "#0A0A0A", color: "#e5e5e5", fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />

      {/* ── HERO ── */}
      <section
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{ paddingTop: 100, paddingBottom: 80 }}
      >
        {/* Grid background */}
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Glow blobs */}
        <div className="absolute pointer-events-none" style={{ top: "20%", left: "50%", transform: "translateX(-50%)", width: 600, height: 400, background: "radial-gradient(ellipse, rgba(110,231,183,0.07) 0%, transparent 70%)" }} />
        <div className="absolute pointer-events-none" style={{ top: "30%", right: "10%", width: 300, height: 300, background: "radial-gradient(ellipse, rgba(129,140,248,0.06) 0%, transparent 70%)" }} />

        <div className="relative w-full max-w-[1100px] mx-auto px-6 flex flex-wrap items-center gap-12 justify-between">
          {/* Left */}
          <div className="flex-1 min-w-[340px] max-w-[520px]">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-6"
                style={{ background: "rgba(110,231,183,0.1)", color: "#6EE7B7", border: "1px solid rgba(110,231,183,0.2)" }}
              >
                <div className="w-[5px] h-[5px] rounded-full animate-pulse" style={{ background: "#6EE7B7" }} />
                Now in public beta
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="leading-[1.1] tracking-tight mb-5"
              style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(40px, 5vw, 58px)", color: "#f0f0f0" }}
            >
              Learn by Building.{" "}
              <span style={{ background: "linear-gradient(135deg, #6EE7B7 0%, #3ABFAD 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Not by Watching.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="text-[17px] leading-relaxed mb-8 max-w-[420px]"
              style={{ color: "#666" }}
            >
              Structured, project-based learning that takes you from zero to deployed — with real code, real tools, and real outcomes.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex gap-3 flex-wrap"
            >
              <button
                className="inline-flex items-center gap-2 px-[22px] py-[11px] text-sm font-semibold rounded-lg transition-all duration-200"
                style={{ background: "#6EE7B7", color: "#0A0A0A" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#5DCAA5"; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(110,231,183,0.25)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#6EE7B7"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                Start Building <ArrowRight size={15} />
              </button>
              <button
                className="inline-flex items-center gap-2 px-[22px] py-[11px] text-sm font-medium rounded-lg transition-all duration-200"
                style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.12)", color: "#e5e5e5" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <Play size={14} /> Watch 90s Demo
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-9 flex gap-6 flex-wrap"
            >
              {[["2,400+", "Projects built"], ["18k+", "Active learners"], ["Free", "to get started"]].map(([v, l]) => (
                <div key={l}>
                  <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 22, color: "#e5e5e5" }}>{v}</div>
                  <div className="text-xs mt-[2px]" style={{ color: "#555" }}>{l}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: browser mockup */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex-1 min-w-[320px] flex justify-center relative"
          >
            <HeroBrowser />
          </motion.div>
        </div>
      </section>

      {/* ── TRUST METRICS ── */}
      <section
        className="py-16 px-6"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="max-w-[1100px] mx-auto grid gap-8" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
          {platformStats.map((s, i) => {
            const Icon = s.icon;
            return (
              <FadeIn key={s.label} delay={i * 0.08}>
                <div className="text-center">
                  <div className="flex justify-center mb-[10px]">
                    <div className="w-10 h-10 rounded-[10px] flex items-center justify-center" style={{ background: "rgba(110,231,183,0.08)", border: "1px solid rgba(110,231,183,0.15)" }}>
                      <Icon size={17} color="#6EE7B7" />
                    </div>
                  </div>
                  <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 38, background: "linear-gradient(135deg, #fff 0%, #888 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                    {s.val}
                  </div>
                  <div className="text-[13px] mt-1" style={{ color: "#555" }}>{s.label}</div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </section>

      {/* ── FEATURED PROJECTS ── */}
      <section className="py-24 px-6">
        <div className="max-w-[1100px] mx-auto">
          <FadeIn>
            <div className="text-center mb-14">
              <SectionLabel>PROJECTS</SectionLabel>
              <h2 className="tracking-tight mb-4" style={{ fontFamily: "'Instrument Serif', serif", fontSize: 42, color: "#f0f0f0" }}>
                Build what matters.
              </h2>
              <p className="text-[15px] leading-relaxed max-w-[400px] mx-auto" style={{ color: "#555" }}>
                Every project is production-grade, structured, and portfolio-worthy.
              </p>
            </div>
          </FadeIn>
          <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
            {featuredProjects.map((p, i) => <ProjectCard key={p.name} p={p} i={i} />)}
          </div>
          <FadeIn>
            <div className="text-center mt-10">
              <button
                className="inline-flex items-center gap-2 px-[22px] py-[11px] text-sm font-medium rounded-lg transition-all duration-200"
                style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.12)", color: "#e5e5e5" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                Browse all projects <ArrowRight size={14} />
              </button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── LEARNING PATHS ── */}
      <section
        className="py-24 px-6"
        style={{ background: "rgba(255,255,255,0.01)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="max-w-[1100px] mx-auto">
          <FadeIn>
            <div className="text-center mb-14">
              <SectionLabel>LEARNING PATHS</SectionLabel>
              <h2 className="tracking-tight mb-4" style={{ fontFamily: "'Instrument Serif', serif", fontSize: 42, color: "#f0f0f0" }}>
                Your roadmap to mastery.
              </h2>
              <p className="text-[15px] leading-relaxed max-w-[400px] mx-auto" style={{ color: "#555" }}>
                Choose a path. Follow the phases. Build projects at every step.
              </p>
            </div>
          </FadeIn>
          <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
            {paths.map((p, i) => <PathCard key={p.title} p={p} i={i} />)}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 px-6">
        <div className="max-w-[800px] mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <SectionLabel>HOW IT WORKS</SectionLabel>
              <h2 className="tracking-tight" style={{ fontFamily: "'Instrument Serif', serif", fontSize: 42, color: "#f0f0f0" }}>
                Three steps to shipped.
              </h2>
            </div>
          </FadeIn>
          <div className="flex flex-col">
            {howItWorksSteps.map((s, i) => {
              const Icon = s.icon;
              return (
                <FadeIn key={s.num} delay={i * 0.12}>
                  <div className="flex gap-7 items-start" style={{ paddingBottom: i < howItWorksSteps.length - 1 ? 40 : 0 }}>
                    <div className="flex flex-col items-center shrink-0">
                      <div
                        className="w-[52px] h-[52px] rounded-xl flex items-center justify-center relative z-10"
                        style={{ background: "rgba(110,231,183,0.08)", border: "1px solid rgba(110,231,183,0.2)" }}
                      >
                        <Icon size={20} color="#6EE7B7" />
                      </div>
                      {i < howItWorksSteps.length - 1 && (
                        <div className="w-px mt-2" style={{ flex: 1, minHeight: 40, background: "linear-gradient(to bottom, rgba(110,231,183,0.3), transparent)" }} />
                      )}
                    </div>
                    <div className="pt-[10px] flex-1">
                      <div className="flex items-center gap-[10px] mb-2">
                        <span className="text-[13px] tracking-[0.05em]" style={{ fontFamily: "'Instrument Serif', serif", color: "#333" }}>{s.num}</span>
                        <h3 className="text-lg font-semibold tracking-tight" style={{ color: "#e5e5e5" }}>{s.title}</h3>
                      </div>
                      <p className="text-[15px] leading-relaxed max-w-[480px]" style={{ color: "#555" }}>{s.desc}</p>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── COMPARISON ── */}
      <section
        className="py-24 px-6"
        style={{ background: "rgba(255,255,255,0.01)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="max-w-[720px] mx-auto">
          <FadeIn>
            <div className="text-center mb-12">
              <SectionLabel>WHY BUILDWISE</SectionLabel>
              <h2 className="tracking-tight" style={{ fontFamily: "'Instrument Serif', serif", fontSize: 42, color: "#f0f0f0" }}>
                A better way to learn.
              </h2>
            </div>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
              {/* Header */}
              <div className="grid px-5 py-[14px]" style={{ gridTemplateColumns: "1fr 1fr 1fr", background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                <span />
                <span className="text-xs font-medium text-center" style={{ color: "#555" }}>Traditional</span>
                <span className="text-xs font-semibold text-center" style={{ color: "#6EE7B7" }}>BuildWise</span>
              </div>
              {comparisonTable.map(({ cat, old, bw }, i) => (
                <div
                  key={cat}
                  className="grid px-5 py-[14px] items-center"
                  style={{
                    gridTemplateColumns: "1fr 1fr 1fr",
                    background: i % 2 === 0
                      ? "rgba(255,255,255,0.015)"
                      : "transparent",
                    borderBottom:
                      i < comparisonTable.length - 1
                        ? "1px solid rgba(255,255,255,0.05)"
                        : "none",
                  }}
                >
                  <span
                    className="text-[13px]"
                    style={{ color: "#888" }}
                  >
                    {cat}
                  </span>

                  <div className="flex justify-center">
                    <span
                      className="flex items-center gap-[5px] text-xs"
                      style={{ color: "#444" }}
                    >
                      <X size={12} color="#3f3f3f" />
                      {old}
                    </span>
                  </div>

                  <div className="flex justify-center">
                    <span
                      className="flex items-center gap-[5px] text-xs"
                      style={{ color: "#6EE7B7" }}
                    >
                      <Check size={12} color="#6EE7B7" />
                      {bw}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── COMMUNITY ── */}
      <section className="py-24 px-6">
        <div className="max-w-[1100px] mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <SectionLabel>COMMUNITY</SectionLabel>
              <h2 className="tracking-tight mb-4" style={{ fontFamily: "'Instrument Serif', serif", fontSize: 42, color: "#f0f0f0" }}>
                Built by builders, for builders.
              </h2>
              <p className="text-[15px] leading-relaxed" style={{ color: "#555" }}>
                Join thousands of developers who chose shipping over scrolling.
              </p>
            </div>
          </FadeIn>

          {/* Counter stats */}
          <div className="grid gap-5 mb-12" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
            {communityStats.map((s, i) => (
              <FadeIn key={s.label} delay={i * 0.08}>
                <div className="rounded-xl p-7 text-center" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(20px)" }}>
                  <CounterStat {...s} />
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Testimonials */}
          <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
            {testimonials.map((t, i) => (
              <FadeIn key={t.name} delay={i * 0.1}>
                <div
                  className="rounded-xl p-[22px] transition-all duration-300"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  <div className="flex gap-1 mb-3">
                    {[0, 1, 2, 3, 4].map((s) => <Star key={s} size={12} color="#FCD34D" fill="#FCD34D" />)}
                  </div>
                  <p className="text-[13px] leading-relaxed mb-4 italic" style={{ color: "#888" }}>"{t.quote}"</p>
                  <div className="flex items-center gap-[10px]">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
                      style={{ background: "linear-gradient(135deg, #6EE7B7, #818CF8)", color: "#0A0A0A" }}
                    >
                      {t.name.split(" ").map((w) => w[0]).join("")}
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold" style={{ color: "#e5e5e5" }}>{t.name}</div>
                      <div className="text-[11px]" style={{ color: "#555" }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="pb-24 px-6">
        <div className="max-w-[760px] mx-auto">
          <FadeIn>
            <div
              className="rounded-[20px] text-center relative overflow-hidden"
              style={{ padding: "64px 40px", border: "1px solid rgba(110,231,183,0.15)", background: "rgba(110,231,183,0.03)" }}
            >
              {/* Glow */}
              <div className="absolute pointer-events-none" style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "120%", height: "120%", background: "radial-gradient(ellipse at 50% 50%, rgba(110,231,183,0.07) 0%, transparent 65%)" }} />

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-5" style={{ background: "rgba(110,231,183,0.1)", color: "#6EE7B7", border: "1px solid rgba(110,231,183,0.2)" }}>
                  Free forever for self-learners
                </div>
                <h2
                  className="tracking-tight mb-4 leading-[1.15]"
                  style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(32px, 5vw, 48px)", color: "#f0f0f0" }}
                >
                  Ready to stop watching<br />and start building?
                </h2>
                <p className="text-base leading-relaxed mb-9 max-w-[440px] mx-auto" style={{ color: "#555" }}>
                  Join 18,000+ developers learning by doing. No fluff, no filler — just projects, roadmaps, and results.
                </p>
                <div className="flex gap-[10px] justify-center flex-wrap mb-5">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="text-sm rounded-lg px-4 py-[11px] outline-none transition-all duration-200"
                    style={{ width: 240, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#e5e5e5" }}
                    onFocus={e => (e.target.style.borderColor = "rgba(110,231,183,0.4)")}
                    onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                  />
                  <button
                    className="inline-flex items-center gap-2 px-[22px] py-[11px] text-sm font-semibold rounded-lg transition-all duration-200"
                    style={{ background: "#6EE7B7", color: "#0A0A0A" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#5DCAA5"; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(110,231,183,0.25)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#6EE7B7"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                  >
                    Get Early Access <ArrowRight size={14} />
                  </button>
                </div>
                <p className="text-xs" style={{ color: "#3f3f3f" }}>No spam. Unsubscribe anytime.</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 48, paddingBottom: 36 }}>
        <div className="max-w-[1100px] mx-auto">
          <div className="grid gap-9 mb-12" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-[26px] h-[26px] rounded-[7px] flex items-center justify-center" style={{ background: "linear-gradient(135deg, #6EE7B7, #818CF8)" }}>
                  <Hammer size={12} color="#0A0A0A" />
                </div>
                <span className="font-semibold text-sm">BuildWise</span>
              </div>
              <p className="text-[13px] leading-relaxed" style={{ color: "#444" }}>
                Project-based learning for the next generation of developers.
              </p>
            </div>

            {[
              { title: "Product", links: ["Projects", "Learning Paths", "Resources", "Community"] },
              { title: "Company", links: ["About", "Blog", "Careers", "Press"] },
              { title: "Support", links: ["Documentation", "Discord", "Contact", "Status"] },
            ].map((col) => (
              <div key={col.title}>
                <div className="text-[12px] font-semibold mb-[14px] uppercase tracking-[0.06em]" style={{ color: "#555" }}>{col.title}</div>
                {col.links.map((l) => (
                  <div
                    key={l}
                    className="text-[13px] mb-[10px] cursor-pointer transition-colors duration-200"
                    style={{ color: "#444" }}
                    onMouseEnter={e => (e.target.style.color = "#e5e5e5")}
                    onMouseLeave={e => (e.target.style.color = "#444")}
                  >
                    {l}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center flex-wrap gap-4 pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            <span className="text-xs" style={{ color: "#333" }}>© 2025 BuildWise. All rights reserved.</span>
            <div className="flex gap-[14px]">
              {[Hammer, Star, Star].map((Icon, i) => (
                <div
                  key={i}
                  className="w-[34px] h-[34px] rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200"
                  style={{ border: "1px solid rgba(255,255,255,0.07)" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(110,231,183,0.3)"; e.currentTarget.style.background = "rgba(110,231,183,0.05)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.background = "transparent"; }}
                >
                  <Icon size={15} color="#555" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}


// ── HOOKS ────────────────────────────────────────────────────────────────────

function useCountUp(target, isInView) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!isInView) return;
    const isDecimal = target % 1 !== 0;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(isDecimal ? parseFloat(current.toFixed(1)) : Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, target]);
  return count;
}

// ── SHARED COMPONENTS ────────────────────────────────────────────────────────

function FadeIn({ children, delay = 0, y = 24, className = "", style = {} }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.8, 0.25, 1] }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

function SectionLabel({ children }) {
  return (
    <p className="text-xs tracking-[0.15em] uppercase font-medium mb-3" style={{ color: "#6EE7B7" }}>
      {children}
    </p>
  );
}

function CounterStat({ val, label, suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const count = useCountUp(val, inView);
  const display = val % 1 !== 0 ? count.toFixed(1) : count.toLocaleString();
  return (
    <div ref={ref} className="text-center">
      <div
        className="leading-none mb-2"
        style={{
          fontFamily: "'Instrument Serif', serif",
          fontSize: 48,
          background: "linear-gradient(135deg, #fff 0%, #888 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {display}
        {suffix}
      </div>
      <div className="text-sm" style={{ color: "#666" }}>
        {label}
      </div>
    </div>
  );
}


// ── HERO BROWSER MOCKUP ──────────────────────────────────────────────────────

function HeroBrowser() {
  return (
    <div className="relative w-full" style={{ maxWidth: 480 }}>
      {/* Main browser window */}
      <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", background: "#111" }}>
        {/* Browser bar */}
        <div
          className="flex items-center gap-[6px] px-3"
          style={{ height: 32, background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="w-2 h-2 rounded-full" style={{ background: "#FF5F57" }} />
          <div className="w-2 h-2 rounded-full" style={{ background: "#FFBD2E" }} />
          <div className="w-2 h-2 rounded-full" style={{ background: "#28CA42" }} />
          <div className="flex-1 mx-3 flex items-center px-2 rounded" style={{ height: 18, background: "rgba(255,255,255,0.05)" }}>
            <span className="text-[10px]" style={{ color: "#666" }}>buildwise.dev/projects/ai-chat</span>
          </div>
        </div>

        {/* Browser content */}
        <div className="p-5" style={{ minHeight: 240, background: "linear-gradient(160deg, #0f0f0f 0%, #111 100%)" }}>
          {/* Progress */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-[10px]">
              <span className="text-xs font-semibold" style={{ color: "#e5e5e5" }}>AI Chat App — Week 3 of 4</span>
              <span className="text-xs" style={{ color: "#6EE7B7" }}>75% complete</span>
            </div>
            <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "75%" }}
                transition={{ delay: 1, duration: 1.2, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg, #6EE7B7, #818CF8)" }}
              />
            </div>
          </div>

          {/* Steps */}
          {[
            { step: "✓ Set up Next.js project", done: true },
            { step: "✓ OpenAI API integration", done: true },
            { step: "✓ Streaming responses", done: true },
            { step: "→ Add conversation history", active: true },
            { step: "  Deploy to Vercel" },
          ].map((s, i) => (
            <div
              key={i}
              className="flex items-center gap-2 py-[5px]"
              style={{ borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
            >
              <span
                className="text-[11px] font-mono flex-1"
                style={{ color: s.done ? "#6EE7B7" : s.active ? "#FCD34D" : "#444" }}
              >
                {s.step}
              </span>
              {s.active && (
                <span className="text-[10px] px-[6px] py-[2px] rounded" style={{ background: "rgba(252,211,77,0.12)", color: "#FCD34D" }}>
                  current
                </span>
              )}
            </div>
          ))}

          {/* Hint */}
          <div className="mt-4 p-3 rounded-lg" style={{ background: "rgba(110,231,183,0.05)", border: "1px solid rgba(110,231,183,0.12)" }}>
            <div className="text-[11px] font-semibold mb-1" style={{ color: "#6EE7B7" }}>💡 Hint</div>
            <div className="text-[11px] leading-relaxed" style={{ color: "#666" }}>
              Use localStorage to persist chat history between sessions.
            </div>
          </div>
        </div>
      </div>

      {/* Floating card: tech stack */}
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-5 -right-6 px-[14px] py-[10px] rounded-[10px]"
        style={{ background: "rgba(129,140,248,0.1)", border: "1px solid rgba(129,140,248,0.25)", backdropFilter: "blur(12px)" }}
      >
        <div className="text-[10px] font-semibold mb-[3px]" style={{ color: "#818CF8" }}>TECH STACK</div>
        <div className="flex gap-[5px]">
          {["Next.js", "OpenAI", "Postgres"].map((t) => (
            <span key={t} className="text-[10px] px-[7px] py-[2px] rounded" style={{ background: "rgba(255,255,255,0.06)", color: "#aaa" }}>{t}</span>
          ))}
        </div>
      </motion.div>

      {/* Floating card: deployed */}
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [-2, 2, -2] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        className="absolute bottom-5 -left-7 px-[14px] py-[10px] rounded-[10px]"
        style={{ background: "rgba(110,231,183,0.08)", border: "1px solid rgba(110,231,183,0.2)", backdropFilter: "blur(12px)" }}
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: "rgba(110,231,183,0.15)" }}>
            <Rocket size={13} color="#6EE7B7" />
          </div>
          <div>
            <div className="text-[11px] font-semibold" style={{ color: "#e5e5e5" }}>Deployed!</div>
            <div className="text-[10px]" style={{ color: "#666" }}>vercel.app/ai-chat</div>
          </div>
        </div>
      </motion.div>

      {/* Floating card: streak */}
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute -right-9 px-[14px] py-[10px] rounded-[10px]"
        style={{ top: "40%", background: "rgba(252,211,77,0.08)", border: "1px solid rgba(252,211,77,0.2)", backdropFilter: "blur(12px)" }}
      >
        <div className="text-[10px] font-semibold mb-[2px]" style={{ color: "#FCD34D" }}>🔥 ON A STREAK</div>
        <div className="text-[11px]" style={{ color: "#aaa" }}>12 days building</div>
      </motion.div>
    </div>
  );
}

// ── PROJECT CARD ─────────────────────────────────────────────────────────────

function ProjectCard({ p, i }) {
  const [hovered, setHovered] = useState(false);
  return (
    <FadeIn delay={i * 0.07}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="flex flex-col gap-4 h-full rounded-xl p-[22px] cursor-pointer transition-all duration-300"
        style={{
          background: hovered ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.02)",
          border: hovered ? `1px solid ${p.color}33` : "1px solid rgba(255,255,255,0.07)",
          transform: hovered ? "translateY(-4px)" : "translateY(0)",
        }}
      >
        <div className="flex justify-between items-start">
          <div
            className="w-11 h-11 rounded-[10px] flex items-center justify-center text-sm font-semibold"
            style={{ background: `${p.color}14`, border: `1px solid ${p.color}30`, color: p.color, fontFamily: "'Instrument Serif', serif" }}
          >
            {p.image}
          </div>
          <div className="flex flex-col items-end gap-[6px]">
            <span className="text-[11px] font-medium px-3 py-1 rounded-full" style={{ background: p.badgeColor, color: p.badgeText }}>
              {p.badge}
            </span>
            <div className="flex items-center gap-1">
              <Clock size={11} color="#555" />
              <span className="text-[11px]" style={{ color: "#555" }}>{p.duration}</span>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="font-semibold text-[15px] mb-[6px]" style={{ color: "#e5e5e5" }}>{p.name}</div>
          <div className="text-[13px] leading-relaxed" style={{ color: "#666" }}>{p.desc}</div>
        </div>

        <div className="flex flex-wrap gap-[5px]">
          {p.stack.map((t) => (
            <span key={t} className="text-[11px] px-2 py-[3px] rounded-[5px]" style={{ background: "rgba(255,255,255,0.05)", color: "#888" }}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </FadeIn>
  );
}

// ── LEARNING PATH CARD ───────────────────────────────────────────────────────

function PathCard({ p, i }) {
  const [hovered, setHovered] = useState(false);
  const Icon = p.iconKey;
  return (
    <FadeIn delay={i * 0.09}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="rounded-xl p-6 cursor-pointer transition-all duration-300"
        style={{
          background: hovered ? `${p.color}06` : "rgba(255,255,255,0.02)",
          border: hovered ? `1px solid ${p.color}30` : "1px solid rgba(255,255,255,0.07)",
          transform: hovered ? "translateY(-4px) scale(1.01)" : "translateY(0) scale(1)",
        }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-[10px] flex items-center justify-center" style={{ background: `${p.color}15` }}>
            <Icon size={18} color={p.color} />
          </div>
          <div>
            <div className="font-semibold text-[15px]" style={{ color: "#e5e5e5" }}>{p.title}</div>
            <div className="text-[12px] mt-[2px]" style={{ color: "#555" }}>{p.desc}</div>
          </div>
        </div>

        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex flex-col gap-2 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                {p.steps.map((s, idx) => (
                  <div key={s} className="flex items-center gap-[10px]">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0"
                      style={{ background: `${p.color}20`, border: `1px solid ${p.color}40`, color: p.color }}
                    >
                      {idx + 1}
                    </div>
                    <span className="text-xs" style={{ color: "#888" }}>{s}</span>
                  </div>
                ))}
                <button
                  className="mt-2 w-full flex items-center justify-center gap-2 text-xs font-semibold rounded-lg py-2 transition-all duration-200"
                  style={{ background: p.color, color: "#0A0A0A" }}
                >
                  Start Path <ArrowRight size={12} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!hovered && (
          <div className="flex items-center gap-[5px]">
            {p.steps.map((_, idx) => (
              <div key={idx} className="h-[2px] flex-1 rounded-sm" style={{ background: idx === 0 ? p.color : "rgba(255,255,255,0.08)" }} />
            ))}
            <span className="text-[11px] ml-[6px]" style={{ color: "#555" }}>{p.steps.length} phases</span>
          </div>
        )}
      </div>
    </FadeIn>
  );
}
