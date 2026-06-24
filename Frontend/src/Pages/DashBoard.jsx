import { useState, useEffect, useRef, } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../Services/api";
import axios from "axios";
import Loader from "../Components/Loader";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { NavLink } from "react-router-dom";
import {
  Hammer, Home, FolderOpen, Map, Trophy, Settings, Bell,
  Search, ChevronLeft, ChevronRight, ArrowRight, Flame, BookOpen, Clock,
  Star, TrendingUp, Zap, Play, Check, Lock, BarChart2,
  GitCommit, Code2, Rocket, Brain, Monitor, Server, Layers,
  Smartphone, Menu, X, User, LogOut, ExternalLink, Sparkles,
  Target, Award, Coffee, ChevronUp, Shield,
  LayoutDashboard, BadgeInfo,
  // Settings section icons
  Camera, KeyRound, Trash2, RotateCcw, ShieldCheck,
  PlusCircle, Edit3, UserCog, BookOpenCheck,
} from "lucide-react";
import { getDashboardSummary } from "../Services/dashboardService";
import { COLORS, FONTS, C } from "../Constants/theme";
import { useContext } from "react";
import { UserContext } from "../Context/UserContext";
import DashboardCard from "../Components/DashboardCard";


// ── DATA ─────────────────────────────────────────────────────────────────────

// [Settings Navigation Item]
// "settings" uses in-page scroll. "admin" is scroll-anchor, adminOnly.
const NAV = [
  { id: "home", label: "Home", icon: Home, path: "/" },
  { id: "projects", label: "Projects", icon: FolderOpen, path: "/projects" },
  { id: "about", label: "About", icon: BadgeInfo, path: "/about" },
  { id: "paths", label: "Learning Paths", icon: Map, scroll: "learning-paths" },
  { id: "achieve", label: "Achievements", icon: Trophy, scroll: "achievements" },
  { id: "settings", label: "Settings", icon: Settings, scroll: "settings" },      // [Settings Navigation Item]
  { id: "admin", label: "Admin Panel", icon: Shield, path: "/admin", adminOnly: true },
];


// ── MAIN DASHBOARD ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user, loading } = useContext(UserContext)
  const [active, setActive] = useState("home");
  const [collapsed, setCollapsed] = useState(false);
  const scrollContainerRef = useRef(null);
  const [data, setData] = useState(null);
  const navigate = useNavigate()

  useEffect(() => {
    getDashboardSummary().then(setData);
  }, []);


  if (!data) return null;

  const { stats, paths, projects, activity, achievements } = data;
  if (loading) {
    return <Loader size="lg" text="Authenticating..." fullScreen />;
  }
  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-sm mx-auto p-8">
          <div className="w-12 h-12 rounded-xl bg-rose-500/8 border border-rose-500/15 flex items-center justify-center mx-auto mb-6">
            <Shield size={20} className="text-rose-400/70" />
          </div>
          <h1 className="text-xl font-semibold text-white mb-3">Access Required</h1>
          <p className="text-white/40 text-sm mb-6 leading-relaxed">
            Sign in to access your dashboard, projects, learning paths, achievements and progress.
          </p>
          <a href="/login" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-400 text-black text-sm font-semibold hover:bg-emerald-300 transition-colors">
            <ChevronLeft size={14} strokeWidth={2.5} /> Login
          </a>
        </motion.div>
      </div>
    );
  }

  console.log(user.userStats)

  const dashboardStats = [
    {
      label: "Day Streak",
      val: user?.userStats?.dayStreak?.value ?? 0,
      suffix: "",
      icon: Flame,
      color: COLORS.amber,
    },
    {
      label: "Projects Shipped",
      val: user?.userStats?.projectsShipped?.value ?? 0,
      suffix: "",
      icon: Rocket,
      color: COLORS.green,
    },
    {
      label: "Hours Learned",
      val: user?.userStats?.hoursLearned?.value ?? 0,
      suffix: "",
      icon: Clock,
      color: COLORS.indigo,
    },
    {
      label: "Current Level",
      val: user?.userStats?.currentLevel?.value ?? 1,
      suffix: "",
      icon: TrendingUp,
      color: COLORS.pink,
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'DM Sans', sans-serif", display: "flex" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { overflow-x: hidden; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0A0A0A; }
        ::-webkit-scrollbar-thumb { background: #222; border-radius: 2px; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
        input::placeholder { color: #444; }
        input, select { box-sizing: border-box; }
        select option { background: #111; color: #e5e5e5; }
      `}</style>

      <Sidebar
        active={active}
        setActive={setActive}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        scrollContainerRef={scrollContainerRef}
      />

      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", position: "relative", overflowY: "auto", maxHeight: "100vh" }}>
        {/* Ambient background */}
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "60px 60px", opacity: 0.6 }} />
          <div style={{ position: "absolute", top: "5%", left: "25%", width: 500, height: 300, background: `radial-gradient(ellipse, ${C.green}07 0%, transparent 70%)` }} />
          <div style={{ position: "absolute", top: "50%", right: "5%", width: 350, height: 300, background: `radial-gradient(ellipse, ${C.indigo}06 0%, transparent 70%)` }} />
          <div style={{ position: "absolute", bottom: "10%", left: "40%", width: 300, height: 200, background: `radial-gradient(ellipse, ${C.amber}05 0%, transparent 70%)` }} />
        </div>

        <div style={{ position: "relative", zIndex: 20 }}>
          <Header />
        </div>

        <div ref={scrollContainerRef} style={{ flex: 1, overflowY: "auto", position: "relative", zIndex: 10 }}>
          <WelcomeHero />

          <div style={{ padding: "32px 32px 0" }}>
            <div style={{ marginBottom: 32 }}><QuickActions /></div>

            {/* Stat cards */}
            <div style={{ marginBottom: 36 }}>
              <FadeIn style={{ marginBottom: 14 }}>
                <SectionLabel>YOUR PROGRESS</SectionLabel>
                <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 22, color: "#f0f0f0", letterSpacing: "-0.015em" }}>At a glance</h2>
              </FadeIn>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
                {dashboardStats.map((s, i) => <StatCard key={s.label} stat={s} i={i} />)}
              </div>
            </div>

            {/* Main 2-col layout */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, alignItems: "start", marginBottom: 36 }}>

              {/* Left col */}
              <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                <ContinueLearning />

                {/* Projects */}
                <div>
                  <FadeIn style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <div>
                        <SectionLabel>PROJECTS</SectionLabel>
                        <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 22, color: "#f0f0f0", letterSpacing: "-0.015em" }}>My projects</h2>
                      </div>
                      <GhostBtn style={{ fontSize: 12, padding: "6px 12px" }}>View all <ArrowRight size={12} /></GhostBtn>
                    </div>
                  </FadeIn>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
                    {projects.map((p, i) => <ProjectCard key={p.name} p={p} i={i} />)}
                  </div>
                </div>

                {/* Achievements */}
                <AchievementsSection achievements={achievements} />

                {/* Learning Paths */}
                <LearningPathsSection paths={paths} />

                {/* [Settings Section] */}
                <SettingsSection user={user} />
              </div>

              {/* Right col */}
              <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                <FadeIn>
                  <div>
                    <SectionLabel>PATHS</SectionLabel>
                    <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 20, color: "#f0f0f0", letterSpacing: "-0.015em", marginBottom: 16 }}>Learning paths</h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {paths.map((p, i) => <PathCard key={p.title} p={p} i={i} />)}
                    </div>
                  </div>
                </FadeIn>

                <ActivityFeed activity={activity} />

                <FadeIn delay={0.1}>
                  <div style={{ borderRadius: 14, padding: "24px 20px", border: "1px solid rgba(110,231,183,0.15)", background: "rgba(110,231,183,0.03)", backdropFilter: "blur(20px)", textAlign: "center", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "140%", height: "140%", background: `radial-gradient(ellipse, ${C.green}07 0%, transparent 65%)`, pointerEvents: "none" }} />
                    <div style={{ position: "relative", zIndex: 1 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 11, background: C.green + "14", border: `1px solid ${C.green}28`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                        <Target size={18} color={C.green} />
                      </div>
                      <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 18, color: "#f0f0f0", marginBottom: 8 }}>Start a new path</div>
                      <p style={{ fontSize: 12, color: C.muted, marginBottom: 16, lineHeight: 1.6 }}>Pick a learning path and build something real from day one.</p>
                      <PrimaryBtn style={{ width: "100%", justifyContent: "center", padding: "9px" }}>
                        <Map size={13} /> Browse Paths
                      </PrimaryBtn>
                    </div>
                  </div>
                </FadeIn>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ padding: "24px 32px", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <div style={{ width: 20, height: 20, borderRadius: 5, background: "linear-gradient(135deg, #6EE7B7, #818CF8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Hammer size={10} color="#0A0A0A" />
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>BuildWise</span>
            </div>
            <span style={{ fontSize: 11, color: "#333" }}>© 2025 BuildWise. All rights reserved.</span>
            <div style={{ display: "flex", gap: 16 }}>
              {["Help", "Privacy", "Status"].map(l => (
                <span key={l} style={{ fontSize: 11, color: "#444", cursor: "pointer" }}>{l}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── HOOKS ────────────────────────────────────────────────────────────────────
function useCountUp(target, isInView, duration = 1200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!isInView) return;
    const steps = 50, inc = target / steps;
    let cur = 0;
    const t = setInterval(() => {
      cur += inc;
      if (cur >= target) { setCount(target); clearInterval(t); }
      else setCount(Math.floor(cur));
    }, duration / steps);
    return () => clearInterval(t);
  }, [isInView, target, duration]);
  return count;
}

// ── REUSABLE PRIMITIVES ───────────────────────────────────────────────────────
function FadeIn({ children, delay = 0, y = 16, style = {}, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.25, 0.8, 0.25, 1] }}
      style={style} className={className}>
      {children}
    </motion.div>
  );
}

function Glass({ children, style = {}, hoverAccent, onClick, className = "" }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className={className}
      style={{
        background: hov ? C.surfaceHov : C.surface,
        border: `1px solid ${hov && hoverAccent ? hoverAccent + "30" : C.border}`,
        backdropFilter: "blur(20px)",
        borderRadius: 14,
        transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
        transform: hov ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hov && hoverAccent ? `0 16px 48px ${hoverAccent}0f` : "0 4px 24px rgba(0,0,0,0.2)",
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
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 7,
        padding: "9px 18px", background: hov ? "#5DCAA5" : C.green,
        color: "#0A0A0A", fontWeight: 600, fontSize: 13,
        borderRadius: 8, border: "none", cursor: "pointer",
        transition: "all 0.2s ease",
        transform: hov ? "translateY(-1px)" : "translateY(0)",
        boxShadow: hov ? `0 8px 20px ${C.green}25` : "none",
        fontFamily: "inherit", ...style,
      }}>
      {children}
    </button>
  );
}

function GhostBtn({ children, onClick, style = {} }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 7,
        padding: "9px 18px",
        background: hov ? "rgba(255,255,255,0.05)" : "transparent",
        color: hov ? C.text : "#888", fontSize: 13, fontWeight: 400,
        borderRadius: 8, border: `1px solid ${hov ? C.borderHov : C.border}`,
        cursor: "pointer", transition: "all 0.2s ease", fontFamily: "inherit", ...style,
      }}>
      {children}
    </button>
  );
}

// Danger button — same shell as GhostBtn but red palette
function DangerBtn({ children, onClick, style = {} }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 7,
        padding: "9px 18px",
        background: hov ? "rgba(239,68,68,0.08)" : "transparent",
        color: hov ? "#FCA5A5" : "#888", fontSize: 13, fontWeight: 400,
        borderRadius: 8, border: `1px solid ${hov ? "rgba(239,68,68,0.35)" : C.border}`,
        cursor: "pointer", transition: "all 0.2s ease", fontFamily: "inherit", ...style,
      }}>
      {children}
    </button>
  );
}

function SectionLabel({ children }) {
  return (
    <p style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: C.green, fontWeight: 500, marginBottom: 6 }}>
      {children}
    </p>
  );
}

function DiffBadge({ d }) {
  const map = {
    Beginner: { bg: "rgba(110,231,183,0.12)", color: C.green },
    Intermediate: { bg: "rgba(252,211,77,0.12)", color: C.amber },
    Advanced: { bg: "rgba(129,140,248,0.12)", color: C.indigo },
    Expert: { bg: "rgba(249,168,212,0.12)", color: C.pink },
  };
  const s = map[d] || map.Intermediate;
  return (
    <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 5, background: s.bg, color: s.color }}>{d}</span>
  );
}

// Shared form field styles used in Settings cards
const inputStyle = {
  width: "100%", padding: "9px 12px",
  background: "rgba(255,255,255,0.04)",
  border: `1px solid ${C.border}`,
  borderRadius: 9, color: "#e5e5e5", fontSize: 13,
  outline: "none", fontFamily: "inherit", boxSizing: "border-box",
  transition: "border-color 0.2s",
};
const labelStyle = {
  fontSize: 11, color: "#666", letterSpacing: "0.06em",
  textTransform: "uppercase", fontWeight: 500,
  marginBottom: 6, display: "block",
};

// ── SIDEBAR ───────────────────────────────────────────────────────────────────
function Sidebar({ active, setActive, collapsed, setCollapsed, scrollContainerRef }) {
  const { user } = useContext(UserContext);
  function scrollToSection(sectionId) {
    const container = scrollContainerRef.current;
    const target = document.getElementById(sectionId);
    if (!container || !target) return;
    const containerTop = container.getBoundingClientRect().top;
    const targetTop = target.getBoundingClientRect().top;
    const offset = 72;
    container.scrollBy({ top: targetTop - containerTop - offset, behavior: "smooth" });
  }

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.8, 0.25, 1] }}
      style={{
        width: collapsed ? 68 : 220, flexShrink: 0,
        height: "100vh", position: "sticky", top: 0,
        display: "flex", flexDirection: "column",
        background: "rgba(10,10,10,0.7)", backdropFilter: "blur(28px)",
        borderRight: `1px solid ${C.border}`,
        transition: "width 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
        zIndex: 40, overflow: "hidden",
      }}>
      {/* Logo */}
      <div style={{ padding: "20px 16px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 9, background: "linear-gradient(135deg, #6EE7B7, #818CF8)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Hammer size={15} color="#0A0A0A" />
        </div>
        {!collapsed && (
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            style={{ fontWeight: 600, fontSize: 15, letterSpacing: "-0.02em", color: "#fff", whiteSpace: "nowrap" }}>
            BuildWise
          </motion.span>
        )}
        <button onClick={() => setCollapsed(!collapsed)}
          style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "#555", display: "flex", flexShrink: 0, padding: 4, borderRadius: 6, transition: "color 0.2s" }}
          onMouseEnter={e => (e.currentTarget.style.color = "#e5e5e5")}
          onMouseLeave={e => (e.currentTarget.style.color = "#555")}>
          <Menu size={15} />
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: 2, overflowY: "auto" }}>
        {NAV
          .filter(item => !item.adminOnly || user?.role === "admin")
          .map(item => {
            const Icon = item.icon;
            const isActive = active === item.id;

            // Scroll-anchor items (Learning Paths, Achievements, Settings, Admin Panel)
            if (item.scroll) {
              return (
                <button key={item.id}
                  onClick={() => { setActive(item.id); scrollToSection(item.scroll); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: collapsed ? "10px" : "9px 12px",
                    justifyContent: collapsed ? "center" : "flex-start",
                    borderRadius: 9,
                    border: `1px solid ${isActive ? C.green + "30" : "transparent"}`,
                    background: isActive ? "rgba(110,231,183,0.08)" : "transparent",
                    color: isActive ? C.green : "#888",
                    transition: "all 0.2s ease", width: "100%",
                    textAlign: "left", cursor: "pointer", fontFamily: "inherit",
                  }}
                  onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = C.text; } }}
                  onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#888"; } }}>
                  <Icon size={16} style={{ flexShrink: 0 }} />
                  {!collapsed && <span style={{ fontSize: 13, fontWeight: isActive ? 500 : 400, whiteSpace: "nowrap" }}>{item.label}</span>}
                  {!collapsed && isActive && <div style={{ marginLeft: "auto", width: 5, height: 5, borderRadius: "50%", background: C.green, boxShadow: `0 0 6px ${C.green}` }} />}
                </button>
              );
            }

            // Regular routed items
            return (
              <NavLink key={item.id} to={item.path}
                style={({ isActive: ra }) => ({
                  display: "flex", alignItems: "center", gap: 10,
                  padding: collapsed ? "10px" : "9px 12px",
                  justifyContent: collapsed ? "center" : "flex-start",
                  borderRadius: 9,
                  border: `1px solid ${ra ? C.green + "30" : "transparent"}`,
                  background: ra ? "rgba(110,231,183,0.08)" : "transparent",
                  color: ra ? C.green : "#888",
                  transition: "all 0.2s ease", width: "100%", textDecoration: "none",
                })}
                onMouseEnter={e => { if (!e.currentTarget.classList.contains("active")) { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = C.text; } }}
                onMouseLeave={e => { if (!e.currentTarget.classList.contains("active")) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#888"; } }}>
                {({ isActive: ra }) => (
                  <>
                    <Icon size={16} style={{ flexShrink: 0 }} />
                    {!collapsed && <span style={{ fontSize: 13, fontWeight: ra ? 500 : 400, whiteSpace: "nowrap" }}>{item.label}</span>}
                    {!collapsed && ra && <div style={{ marginLeft: "auto", width: 5, height: 5, borderRadius: "50%", background: C.green, boxShadow: `0 0 6px ${C.green}` }} />}
                  </>
                )}
              </NavLink>
            );
          })}
      </nav>

      {/* User */}
      <div style={{ padding: "12px 10px", borderTop: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: collapsed ? "8px" : "8px 10px", borderRadius: 9, cursor: "pointer", transition: "background 0.2s" }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
          <div style={{ display: "flex", alignItems: "center", margin: 20, flexShrink: 0 }}>
            <div
              title={user.fullName}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "#6EE7B7",
                color: "#0A0A0A",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {user.fullName?.charAt(0).toUpperCase()}
            </div>
          </div>
          {!collapsed && (
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.fullName}</div>
              <div style={{ fontSize: 11, color: "#555", whiteSpace: "nowrap" }}>Level 4 · Builder</div>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
}

// ── HEADER ────────────────────────────────────────────────────────────────────
function Header() {
  const { user } = useContext(UserContext)
  const [notifs] = useState(3);
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.8, 0.25, 1] }}
      style={{ padding: "20px 32px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 16, background: "rgba(10,10,10,0.5)", backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 30 }}>
      <div style={{ flex: 1, maxWidth: 380, position: "relative" }}>
        <Search size={14} color="#555" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
        <input placeholder="Search projects, paths, modules…"
          style={{ width: "100%", padding: "9px 12px 9px 34px", background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`, borderRadius: 9, color: C.text, fontSize: 13, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
          onFocus={e => (e.target.style.borderColor = "rgba(110,231,183,0.3)")}
          onBlur={e => (e.target.style.borderColor = C.border)} />
      </div>
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ position: "relative" }}>
          <button style={{ width: 36, height: 36, borderRadius: 9, background: C.surface, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s", color: "#888" }}
            onMouseEnter={e => { e.currentTarget.style.background = C.surfaceHov; e.currentTarget.style.color = C.text; }}
            onMouseLeave={e => { e.currentTarget.style.background = C.surface; e.currentTarget.style.color = "#888"; }}>
            <Bell size={15} />
          </button>
          {notifs > 0 && (
            <div style={{ position: "absolute", top: -4, right: -4, width: 16, height: 16, borderRadius: "50%", background: C.green, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "#0A0A0A", border: "2px solid #0A0A0A" }}>{notifs}</div>
          )}
        </div>
        <div
          title={user.fullName}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "#6EE7B7",
            color: "#0A0A0A",
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          {user.fullName?.charAt(0).toUpperCase()}
        </div>
      </div>
    </motion.header>
  );
}

// ── HERO WELCOME ─────────────────────────────────────────────────────────────
function WelcomeHero() {
  const { user } = useContext(UserContext);
  return (
    <div style={{ padding: "40px 32px 0", position: "relative" }}>
      <div style={{ position: "absolute", top: 0, left: "30%", width: 400, height: 200, background: `radial-gradient(ellipse, ${C.green}09 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 20, right: "10%", width: 250, height: 150, background: `radial-gradient(ellipse, ${C.indigo}07 0%, transparent 70%)`, pointerEvents: "none" }} />
      <FadeIn>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "4px 12px", borderRadius: 999, background: "rgba(110,231,183,0.09)", border: "1px solid rgba(110,231,183,0.2)", marginBottom: 14 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.green, animation: "pulse 2s infinite" }} />
              <span style={{ fontSize: 11, color: C.green, fontWeight: 500 }}>12-day streak active 🔥</span>
            </div>
            <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(28px, 4vw, 44px)", color: "#f0f0f0", letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: 10 }}>
              Welcome back, {user.fullName.split(" ")[0]}
            </h1>
            <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.65, maxWidth: 440 }}>
              Continue your learning journey and ship your next project. You're 75% through AI Chat App.
            </p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <PrimaryBtn><Play size={14} /> Continue Learning</PrimaryBtn>
            <GhostBtn><FolderOpen size={13} /> All Projects</GhostBtn>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}

// ── STAT CARDS ────────────────────────────────────────────────────────────────
function StatCard({ stat, i }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const count = useCountUp(stat.val, inView);
  const Icon = stat.icon;
  return (
    <FadeIn delay={i * 0.07}>
      <Glass hoverAccent={stat.color} style={{ padding: "22px 20px" }}>
        <div ref={ref} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: stat.color + "14", border: `1px solid ${stat.color}28`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon size={17} color={stat.color} />
          </div>
        </div>
        <div style={{
          fontFamily: "'Instrument Serif', serif",
          fontSize: 40,
          lineHeight: 1,
          marginBottom: 4,
          background: `linear-gradient(135deg, #fff 30%, ${stat.color} 100%)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          textAlign: "center", 
        }}>
          {count}{stat.suffix}
        </div>
        <div style={{ fontSize: 12, color: "#666", textAlign: "center" }}> 
          {stat.label}
        </div>
      </Glass>
    </FadeIn>
  );
}

// ── CONTINUE LEARNING ─────────────────────────────────────────────────────────
function ContinueLearning() {
  const [hov, setHov] = useState(false);
  return (
    <FadeIn delay={0.1}>
      <div style={{ marginBottom: 6 }}>
        <SectionLabel>CONTINUE WHERE YOU LEFT OFF</SectionLabel>
        <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 22, color: "#f0f0f0", letterSpacing: "-0.015em", marginBottom: 16 }}>Current project</h2>
      </div>
      <DashboardCard/>
    </FadeIn>
  );
}

// ── PATH CARD (sidebar widget) ────────────────────────────────────────────────
function PathCard({ p, i }) {
  const [hov, setHov] = useState(false);
  const Icon = p.icon;
  return (
    <FadeIn delay={i * 0.07}>
      <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        style={{
          padding: "18px", borderRadius: 12,
          background: hov ? C.surfaceHov : C.surface,
          border: `1px solid ${hov ? p.color + "30" : C.border}`,
          backdropFilter: "blur(20px)",
          transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
          transform: hov ? "translateY(-3px) scale(1.01)" : "translateY(0) scale(1)",
          boxShadow: hov ? `0 14px 40px ${p.color}10` : "none",
          cursor: "pointer",
        }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: p.color + "14", border: `1px solid ${p.color}28`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon size={16} color={p.color} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: C.text, marginBottom: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.title}</div>
            <div style={{ fontSize: 11, color: "#555" }}>{p.lessons}/{p.total} lessons</div>
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, color: p.progress > 0 ? p.color : "#444" }}>{p.progress}%</span>
        </div>
        <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
          <motion.div initial={{ width: 0 }} animate={{ width: `${p.progress}%` }}
            transition={{ duration: 1, delay: 0.3 + i * 0.1, ease: "easeOut" }}
            style={{ height: "100%", background: p.progress > 0 ? p.color : "transparent", borderRadius: 2 }} />
        </div>
        {p.progress === 0 && <div style={{ fontSize: 11, color: "#3f3f3f", marginTop: 8 }}>Not started</div>}
      </div>
    </FadeIn>
  );
}

// ── PROJECT CARDS ─────────────────────────────────────────────────────────────
function ProjectCard({ p, i }) {
  const [hov, setHov] = useState(false);
  return (
    <FadeIn delay={i * 0.07}>
      <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        style={{
          borderRadius: 12, overflow: "hidden",
          border: hov ? `1px solid ${p.color}30` : `1px solid ${C.border}`,
          background: C.surface, backdropFilter: "blur(20px)",
          transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
          transform: hov ? "translateY(-4px)" : "translateY(0)",
          boxShadow: hov ? `0 16px 48px ${p.color}10` : "none",
          cursor: "pointer",
        }}>
        <div style={{ height: 100, position: "relative", background: `radial-gradient(ellipse at 40% 60%, ${p.color}18 0%, rgba(255,255,255,0.02) 70%)`, borderBottom: `1px solid ${C.border}`, overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
          <motion.div animate={{ scale: hov ? 1.07 : 1 }} transition={{ duration: 0.4 }}
            style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 44, height: 44, borderRadius: 11, background: p.color + "18", border: `1px solid ${p.color}35`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Instrument Serif', serif", fontSize: 14, color: p.color }}>{p.image}</div>
          </motion.div>
          <div style={{ position: "absolute", bottom: 8, left: 10 }}><DiffBadge d={p.diff} /></div>
          {p.progress === 100 && (
            <div style={{ position: "absolute", top: 8, right: 8, background: C.green + "20", border: `1px solid ${C.green}35`, borderRadius: 6, padding: "3px 7px", fontSize: 10, color: C.green, fontWeight: 600 }}>✓ Done</div>
          )}
        </div>
        <div style={{ padding: "14px 14px 12px" }}>
          <h4 style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 6 }}>{p.name}</h4>
          {p.progress > 0 && p.progress < 100 && (
            <div style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 10, color: "#555" }}>Progress</span>
                <span style={{ fontSize: 10, color: p.color }}>{p.progress}%</span>
              </div>
              <div style={{ height: 2, background: "rgba(255,255,255,0.06)", borderRadius: 1, overflow: "hidden" }}>
                <div style={{ width: `${p.progress}%`, height: "100%", background: p.color, borderRadius: 1, transition: "width 1s ease" }} />
              </div>
            </div>
          )}
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 10 }}>
            {p.stack.slice(0, 3).map(t => (
              <span key={t} style={{ fontSize: 10, background: "rgba(255,255,255,0.05)", color: "#777", padding: "2px 7px", borderRadius: 4 }}>{t}</span>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Clock size={10} color="#555" />
            <span style={{ fontSize: 11, color: "#555", flex: 1 }}>{p.dur}</span>
            <ChevronRight size={13} color={hov ? p.color : "#444"} style={{ transition: "color 0.2s" }} />
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

// ── ACTIVITY FEED ─────────────────────────────────────────────────────────────
function ActivityFeed({ activity }) {
  return (
    <FadeIn delay={0.1}>
      <div>
        <SectionLabel>ACTIVITY</SectionLabel>
        <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 20, color: "#f0f0f0", letterSpacing: "-0.015em", marginBottom: 18 }}>Recent activity</h2>
        <Glass style={{ padding: "8px 0" }}>
          {activity.map((a, i) => {
            const Icon = a.icon;
            return (
              <FadeIn key={i} delay={i * 0.06}>
                <div style={{ display: "flex", gap: 12, padding: "13px 18px", position: "relative" }}>
                  {i < activity.length - 1 && (
                    <div style={{ position: "absolute", left: 28, top: 46, bottom: -12, width: 1, background: "linear-gradient(to bottom, rgba(255,255,255,0.08), transparent)" }} />
                  )}
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: a.color + "14", border: `1px solid ${a.color}28`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, position: "relative", zIndex: 1, boxShadow: `0 0 12px ${a.color}15` }}>
                    <Icon size={13} color={a.color} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                      <div>
                        <span style={{ fontSize: 11, color: a.color, fontWeight: 600, display: "block", marginBottom: 2 }}>{a.label}</span>
                        <span style={{ fontSize: 13, color: C.text, lineHeight: 1.4 }}>{a.text}</span>
                      </div>
                      <span style={{ fontSize: 11, color: "#444", whiteSpace: "nowrap", flexShrink: 0 }}>{a.time}</span>
                    </div>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </Glass>
      </div>
    </FadeIn>
  );
}

// ── ACHIEVEMENTS SECTION ──────────────────────────────────────────────────────
function AchievementsSection({ achievements }) {
  return (
    <FadeIn delay={0.1}>
      <div id="achievements">
        <SectionLabel>MILESTONES</SectionLabel>
        <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 20, color: "#f0f0f0", letterSpacing: "-0.015em", marginBottom: 18 }}>Achievements</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 10 }}>
          {achievements.map((a, i) => {
            const Icon = a.icon;
            return (
              <FadeIn key={i} delay={i * 0.05}>
                <div
                  style={{ padding: "16px 14px", borderRadius: 12, border: `1px solid ${a.unlocked ? a.color + "28" : C.border}`, background: a.unlocked ? a.color + "07" : C.surface, backdropFilter: "blur(20px)", opacity: a.unlocked ? 1 : 0.45, cursor: "pointer", transition: "all 0.25s ease", textAlign: "center" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 12px 32px ${a.color}12`; e.currentTarget.style.opacity = "1"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.opacity = a.unlocked ? "1" : "0.45"; }}>
                  <div style={{ width: 40, height: 40, borderRadius: 11, background: a.unlocked ? a.color + "18" : "rgba(255,255,255,0.04)", border: `1px solid ${a.unlocked ? a.color + "35" : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px", boxShadow: a.unlocked ? `0 0 16px ${a.color}15` : "none" }}>
                    {a.unlocked ? <Icon size={18} color={a.color} /> : <Lock size={16} color="#444" />}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: a.unlocked ? C.text : "#444", marginBottom: 4 }}>{a.name}</div>
                  <div style={{ fontSize: 10, color: "#444", lineHeight: 1.4 }}>{a.desc}</div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </FadeIn>
  );
}

// ── LEARNING PATHS SECTION ────────────────────────────────────────────────────
function LearningPathsSection({ paths }) {
  return (
    <FadeIn delay={0.05}>
      <div id="learning-paths">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
          <div>
            <SectionLabel>PATHS</SectionLabel>
            <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 22, color: "#f0f0f0", letterSpacing: "-0.015em", marginBottom: 4 }}>Learning paths</h2>
            <p style={{ fontSize: 13, color: C.muted, marginBottom: 18 }}>Structured tracks built for shipping, not just watching.</p>
          </div>
          <GhostBtn style={{ fontSize: 12, padding: "6px 12px" }}>Browse all <ArrowRight size={12} /></GhostBtn>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
          {paths.map((p, i) => {
            const Icon = p.icon;
            const [hov, setHov] = useState(false);
            return (
              <FadeIn key={p.title} delay={i * 0.07}>
                <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
                  style={{
                    padding: "22px 20px", borderRadius: 14,
                    background: hov ? C.surfaceHov : C.surface,
                    border: `1px solid ${hov ? p.color + "30" : C.border}`,
                    backdropFilter: "blur(20px)",
                    transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
                    transform: hov ? "translateY(-3px)" : "translateY(0)",
                    boxShadow: hov ? `0 16px 48px ${p.color}12` : "none",
                    cursor: "pointer",
                  }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 16 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 11, background: p.color + "14", border: `1px solid ${p.color}28`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon size={18} color={p.color} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 3 }}>{p.title}</div>
                      <div style={{ fontSize: 11, color: "#555" }}>{p.lessons} of {p.total} lessons complete</div>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: p.progress > 0 ? p.color : "#333", flexShrink: 0 }}>{p.progress}%</span>
                  </div>
                  <p style={{ fontSize: 12, color: "#555", lineHeight: 1.65, marginBottom: 16 }}>{p.desc}</p>
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${p.progress}%` }}
                        transition={{ duration: 1.1, delay: 0.3 + i * 0.1, ease: "easeOut" }}
                        style={{ height: "100%", background: p.progress > 0 ? `linear-gradient(90deg, ${p.color}, ${p.color}99)` : "transparent", borderRadius: 2 }} />
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    {p.progress === 0 ? (
                      <span style={{ fontSize: 11, color: "#3a3a3a" }}>Not started yet</span>
                    ) : p.progress === 100 ? (
                      <span style={{ fontSize: 11, color: C.green, display: "flex", alignItems: "center", gap: 4 }}><Check size={11} /> Completed</span>
                    ) : (
                      <span style={{ fontSize: 11, color: C.amber }}>{p.total - p.lessons} lessons remaining</span>
                    )}
                    <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: hov ? p.color : "#444", transition: "color 0.2s" }}>
                      {p.progress === 0 ? "Start path" : p.progress === 100 ? "Review" : "Continue"}
                      <ChevronRight size={12} />
                    </div>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </FadeIn>
  );
}

// ── QUICK ACTIONS ─────────────────────────────────────────────────────────────
function QuickActions() {
  const actions = [
    { label: "Browse Projects", icon: FolderOpen, color: C.green },
    { label: "View Paths", icon: Map, color: C.indigo },
    { label: "Community", icon: Sparkles, color: C.amber },
    { label: "My Profile", icon: User, color: C.pink },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
      {actions.map((a, i) => {
        const Icon = a.icon;
        return (
          <div key={i} style={{ padding: "14px 12px", borderRadius: 10, background: C.surface, border: `1px solid ${C.border}`, backdropFilter: "blur(20px)", cursor: "pointer", transition: "all 0.25s ease", textAlign: "center" }}
            onMouseEnter={e => { e.currentTarget.style.background = C.surfaceHov; e.currentTarget.style.borderColor = a.color + "30"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = C.surface; e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = "translateY(0)"; }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: a.color + "12", border: `1px solid ${a.color}22`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>
              <Icon size={15} color={a.color} />
            </div>
            <div style={{ fontSize: 11, color: "#888", fontWeight: 400 }}>{a.label}</div>
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// [Settings Section] — all cards below share the existing Glass, PrimaryBtn,
// GhostBtn, DangerBtn primitives and labelStyle / inputStyle tokens.
// ═══════════════════════════════════════════════════════════════════════════════

// Thin horizontal rule reusing existing border token
function Divider() {
  return <div style={{ height: 1, background: C.border, margin: "20px 0" }} />;
}

// Read-only info row used inside Account Settings
function InfoRow({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 0", borderBottom: `1px solid ${C.border}` }}>
      <span style={{ fontSize: 12, color: C.muted }}>{label}</span>
      <span style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>{value}</span>
    </div>
  );
}

// [Profile Information Card]
function ProfileCard() {
  const { user } = useContext(UserContext)
  const [form, setForm] = useState({
    name: user?.fullName,
    email: user?.email,
    bio: "Full-stack learner building real products.",
    college: "VIT VELLORE",
    github: "https://github.com/debjit",
    linkedin: "https://linkedin.com/in/debjit",
  });
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  }

  return (
    <Glass style={{ padding: "28px 26px" }}>
      {/* Card header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: C.green + "14", border: `1px solid ${C.green}28`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <User size={15} color={C.green} />
        </div>
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Profile Information</h3>
          <p style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>Update your public profile details</p>
        </div>
      </div>

      {/* Avatar row */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg, #6EE7B7, #818CF8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, color: "#0A0A0A", flexShrink: 0 }}>D</div>
        <div>
          <p style={{ fontSize: 12, color: C.text, fontWeight: 500, marginBottom: 4 }}>Profile Picture</p>
          <p style={{ fontSize: 11, color: C.muted, marginBottom: 8 }}>JPG, PNG or GIF · Max 2 MB</p>
          <GhostBtn style={{ fontSize: 11, padding: "5px 12px" }}>
            <Camera size={12} /> Upload photo
          </GhostBtn>
        </div>
      </div>

      {/* Form fields — 2 column grid, some spanning full width */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {[
          { key: "name", label: "Full Name", type: "text", placeholder: "Your name" },
          { key: "email", label: "Email Address", type: "email", placeholder: "you@example.com" },
          { key: "college", label: "College / University", type: "text", placeholder: "Your institution" },
          { key: "bio", label: "Bio", type: "text", placeholder: "A short bio…", full: true },
          { key: "github", label: "GitHub Profile URL", type: "url", placeholder: "https://github.com/…", full: true },
          { key: "linkedin", label: "LinkedIn Profile URL", type: "url", placeholder: "https://linkedin.com/…", full: true },
        ].map(({ key, label, type, placeholder, full }) => (
          <div key={key} style={{ gridColumn: full ? "1 / -1" : undefined }}>
            <label style={labelStyle}>{label}</label>
            <input
              type={type}
              value={form[key]}
              onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
              placeholder={placeholder}
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = "rgba(110,231,183,0.35)")}
              onBlur={e => (e.target.style.borderColor = C.border)}
            />
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 12 }}>
        <PrimaryBtn onClick={handleSave}>
          {saved ? <><Check size={13} /> Saved!</> : "Update Profile"}
        </PrimaryBtn>
        {saved && <span style={{ fontSize: 12, color: C.green }}>Changes saved successfully.</span>}
      </div>
    </Glass>
  );
}

// [Learning Preferences Card]
function LearningPreferencesCard() {
  const [prefs, setPrefs] = useState({ career: "Full Stack Developer", skill: "Intermediate" });
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  }

  const skillColors = { Beginner: C.green, Intermediate: C.amber, Advanced: C.indigo };

  return (
    <Glass style={{ padding: "28px 26px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: C.indigo + "22", border: `1px solid ${C.indigo}35`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <BookOpenCheck size={15} color={C.indigo} />
        </div>
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Learning Preferences</h3>
          <p style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>Personalise your learning experience</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Career path select */}
        <div>
          <label style={labelStyle}>Preferred Career Path</label>
          <div style={{ position: "relative" }}>
            <select
              value={prefs.career}
              onChange={e => setPrefs(p => ({ ...p, career: e.target.value }))}
              style={{ ...inputStyle, appearance: "none", cursor: "pointer", color: C.text }}
              onFocus={e => (e.target.style.borderColor = "rgba(129,140,248,0.4)")}
              onBlur={e => (e.target.style.borderColor = C.border)}>
              {["Frontend Developer", "Full Stack Developer", "Java Developer", "AI / ML Engineer"].map(o => (
                <option key={o} value={o} style={{ background: "#1a1a1a" }}>{o}</option>
              ))}
            </select>
            <ChevronRight size={12} color="#555" style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%) rotate(90deg)", pointerEvents: "none" }} />
          </div>
        </div>

        {/* Skill level toggle */}
        <div>
          <label style={labelStyle}>Skill Level</label>
          <div style={{ display: "flex", gap: 8 }}>
            {["Beginner", "Intermediate", "Advanced"].map(lvl => {
              const active = prefs.skill === lvl;
              const col = skillColors[lvl];
              return (
                <button key={lvl} onClick={() => setPrefs(p => ({ ...p, skill: lvl }))}
                  style={{
                    flex: 1, padding: "8px 4px", borderRadius: 8, fontSize: 11,
                    fontWeight: active ? 600 : 400,
                    background: active ? col + "16" : "transparent",
                    border: `1px solid ${active ? col + "40" : C.border}`,
                    color: active ? col : "#666",
                    cursor: "pointer", transition: "all 0.2s", fontFamily: "inherit",
                  }}>
                  {lvl}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 12 }}>
        <PrimaryBtn onClick={handleSave}>
          {saved ? <><Check size={13} /> Saved!</> : "Save Preferences"}
        </PrimaryBtn>
        {saved && <span style={{ fontSize: 12, color: C.green }}>Preferences updated.</span>}
      </div>
    </Glass>
  );
}

// [Account Settings Card]
function AccountSettingsCard() {
  const { user, setUser } = useContext(UserContext)
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate()
  const handleLogout = async () => {
    try {
      await api.post("/api/v1/users/logout", {});
    } catch (error) {
      console.error(error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      setUser(null);
      navigate("/");
    }
  };

  return (
    <Glass style={{ padding: "28px 26px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: C.amber + "18", border: `1px solid ${C.amber}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <KeyRound size={15} color={C.amber} />
        </div>
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Account Settings</h3>
          <p style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>Manage your account security</p>
        </div>
      </div>

      <InfoRow label="Email Address" value={user?.email} />
      <InfoRow label="Account Role" value={user?.role === "admin" ? "Administrator" : "User"} />

      <div style={{ marginTop: 20, display: "flex", flexWrap: "wrap", gap: 10 }}>
        <GhostBtn><KeyRound size={13} /> Change Password</GhostBtn>
        <GhostBtn onClick={handleLogout}><User size={13} /> Logout</GhostBtn>

        {/* Delete account — shows inline confirmation step first */}
        {!showConfirm ? (
          <DangerBtn onClick={() => setShowConfirm(true)}>
            <Trash2 size={13} /> Delete Account
          </DangerBtn>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 14px", borderRadius: 9, border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.06)", width: "100%" }}>
            <span style={{ fontSize: 12, color: "#FCA5A5", flex: 1 }}>This action is irreversible. Are you sure?</span>
            <DangerBtn style={{ padding: "5px 12px", fontSize: 12 }}>Yes, delete</DangerBtn>
            <GhostBtn onClick={() => setShowConfirm(false)} style={{ padding: "5px 12px", fontSize: 12 }}>Cancel</GhostBtn>
          </div>
        )}
      </div>
    </Glass>
  );
}

// [Progress Settings Card]
function ProgressSettingsCard() {
  const [resetPath, setResetPath] = useState(false);
  const [resetAchv, setResetAchv] = useState(false);

  function handleReset(type) {
    if (type === "path") { setResetPath(true); setTimeout(() => setResetPath(false), 2500); }
    if (type === "achv") { setResetAchv(true); setTimeout(() => setResetAchv(false), 2500); }
  }

  return (
    <Glass style={{ padding: "28px 26px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: C.pink + "18", border: `1px solid ${C.pink}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <RotateCcw size={15} color={C.pink} />
        </div>
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Progress Settings</h3>
          <p style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>Reset your tracked progress</p>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {[
          {
            type: "path", title: "Reset Learning Path Progress",
            desc: "Clears all lesson completions and path progress.",
            done: resetPath, handler: () => handleReset("path"),
          },
          {
            type: "achv", title: "Reset Achievement Progress",
            desc: "Removes all earned badges and milestone data.",
            done: resetAchv, handler: () => handleReset("achv"),
          },
        ].map(({ type, title, desc, done, handler }) => (
          <div key={type} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderRadius: 10, background: "rgba(255,255,255,0.02)", border: `1px solid ${C.border}` }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 500, color: C.text, marginBottom: 3 }}>{title}</p>
              <p style={{ fontSize: 11, color: C.muted }}>{desc}</p>
            </div>
            {done
              ? <span style={{ fontSize: 11, color: C.green, display: "flex", alignItems: "center", gap: 4, whiteSpace: "nowrap" }}><Check size={12} /> Reset done</span>
              : <DangerBtn onClick={handler} style={{ padding: "7px 14px", fontSize: 12, whiteSpace: "nowrap" }}>
                <RotateCcw size={12} /> Reset
              </DangerBtn>
            }
          </div>
        ))}
      </div>
    </Glass>
  );
}

// [Admin Controls Card]
// Conditionally rendered — only when user?.role === "admin".
// To integrate with real auth: replace `user` with useAuth() context value.

// [Settings Section] — anchor wrapper + stacked cards
function SettingsSection({ user }) {
  return (
    <FadeIn delay={0.05}>
      <div id="settings">
        {/* Section heading */}
        <div style={{ marginBottom: 22 }}>
          <SectionLabel>PREFERENCES</SectionLabel>
          <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 22, color: "#f0f0f0", letterSpacing: "-0.015em", marginBottom: 4 }}>Settings</h2>
          <p style={{ fontSize: 13, color: C.muted }}>Manage your profile, learning preferences, and account security.</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* [Profile Information Card] */}
          <FadeIn delay={0.05}><ProfileCard /></FadeIn>

          {/* [Learning Preferences Card] */}
          <FadeIn delay={0.08}><LearningPreferencesCard /></FadeIn>

          {/* [Account Settings Card] */}
          <FadeIn delay={0.11}><AccountSettingsCard user={user} /></FadeIn>

          {/* [Progress Settings Card] */}
          <FadeIn delay={0.14}><ProgressSettingsCard /></FadeIn>

        </div>
      </div>
    </FadeIn>
  );
}
