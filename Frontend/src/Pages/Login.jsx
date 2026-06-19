import { useState, useContext } from "react";
import { bwToast } from "../Components/BuildWiseToast";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Eye, EyeOff, ChevronRight, Clock, Lock, Mail, AtSign,
  LayoutGrid, Folder, TrendingUp, BookOpen, Users, Settings,
  Calendar, BarChart3, CheckCircle2, Circle,
} from "lucide-react";
import toast from "react-hot-toast";
import { UserContext } from "../Context/UserContext";


// ── Design tokens ──────────────────────────────────────────────────────────
const ACCENT = "#6EE7B7";
const BG = "#060607";
const BORDER = "rgba(255,255,255,0.07)";
const GLASS = "rgba(255,255,255,0.02)";
const CARD_BG = "rgba(255,255,255,0.015)";
const TEXT = "#F0F0F0";
const TEXT_SEC = "rgba(255,255,255,0.45)";
const SERIF = "'Instrument Serif', serif";
const SANS = "'DM Sans', sans-serif";
const MONO = "'DM Mono', monospace";

// ── Animation helpers ─────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay, ease: [0.25, 0.8, 0.25, 1] },
});
const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.35, delay },
});

// ── Workspace data ────────────────────────────────────────────────────────
const PROJECT = {
  title: "AI Resume Analyzer",
  week: 6,
  totalWeeks: 8,
  progress: 78,
  nextDuration: "45 min",
  lastActive: "2 hours ago",
  estRemaining: "6 hours",
  enrolled: "1,236",
  completionRate: "93%",
  stack: ["Next.js", "TypeScript", "PostgreSQL", "Prisma"],
};

const MODULES = [
  { id: 1, title: "Project Setup & Scaffolding", state: "completed" },
  { id: 2, title: "Database Schema Design", state: "completed" },
  { id: 3, title: "Authentication System", state: "completed" },
  { id: 4, title: "Authorization & Roles", state: "completed" },
  { id: 5, title: "Enrollment System", state: "current" },
  { id: 6, title: "Progress Tracking", state: "locked" },
  { id: 7, title: "Certificates & Completion", state: "locked" },
];

const NAV_ICONS = [LayoutGrid, Folder, TrendingUp, BookOpen, Users, Settings];

// ── Particles — ambient floating dots for the left panel ───────────────────
const PARTICLES = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  top: Math.random() * 100,
  size: 1.6 + Math.random() * 2.2,
  duration: 12 + Math.random() * 14,
  delay: Math.random() * 0.1,
  peak: 0.25 + Math.random() * 0.4,
  driftX: (Math.random() - 0.5) * 36,
  driftY: -(10 + Math.random() * 26),
}));


function Particles() {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      {PARTICLES.map((p) => (
        <span
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: ACCENT,
            opacity: 0,
            boxShadow: `0 0 ${p.size * 2.4}px rgba(110,231,183,0.55)`,
            "--peak": p.peak,
            "--dx": `${p.driftX}px`,
            "--dy": `${p.driftY}px`,
            animation: `particleFloat ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function BrandMark({ size = 42 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none" style={{ flexShrink: 0 }}>
      <path d="M22 2 L40 12 L40 32 L22 42 L4 32 L4 12 Z" stroke={ACCENT} strokeWidth="1.6" fill="none" />
      <path d="M10 28 L17 17 L23 25 L29 18 L35 27" stroke={ACCENT} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function ActivePill() {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      fontFamily: MONO, fontSize: 9.5, fontWeight: 600, letterSpacing: "0.08em",
      textTransform: "uppercase", color: ACCENT,
      background: "rgba(110,231,183,0.08)", border: "1px solid rgba(110,231,183,0.22)",
      borderRadius: 20, padding: "4px 10px", whiteSpace: "nowrap",
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: ACCENT }} />
      Active
    </span>
  );
}

function ModuleRow({ m, index }) {
  const isCompleted = m.state === "completed";
  const isCurrent = m.state === "current";
  const isLocked = m.state === "locked";
  return (
    <motion.div
      {...fadeIn(0.5 + index * 0.04)}
      style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 2px" }}
    >
      <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 17, height: 17, flexShrink: 0 }}>
        {isCompleted && <CheckCircle2 size={17} color={ACCENT} strokeWidth={1.8} />}
        {isCurrent && (
          <span style={{
            width: 17, height: 17, borderRadius: "50%", border: `1.5px solid ${ACCENT}`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <ChevronRight size={9} color={ACCENT} strokeWidth={3} />
          </span>
        )}
        {isLocked && <Circle size={16} color="rgba(255,255,255,0.15)" strokeWidth={1.6} />}
      </span>
      <span style={{
        flex: 1, fontSize: 13,
        fontFamily: SANS,
        fontWeight: isCurrent ? 600 : 400,
        color: isCurrent ? TEXT : isCompleted ? "rgba(255,255,255,0.58)" : "rgba(255,255,255,0.25)",
      }}>
        {m.title}
      </span>
      {isCurrent && (
        <span style={{
          fontFamily: MONO, fontSize: 9, fontWeight: 600, letterSpacing: "0.06em",
          color: ACCENT, background: "rgba(110,231,183,0.08)",
          border: "1px solid rgba(110,231,183,0.25)", borderRadius: 20, padding: "3px 9px",
          whiteSpace: "nowrap",
        }}>CURRENT</span>
      )}
      {isLocked && <Lock size={12} color="rgba(255,255,255,0.18)" />}
    </motion.div>
  );
}

function IconSidebar() {
  return (
    <div style={{
      width: 58, flexShrink: 0, borderRight: `1px solid ${BORDER}`,
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "18px 0 16px",
    }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {NAV_ICONS.map((Icon, i) => (
          <div key={i} style={{
            width: 34, height: 34, borderRadius: 9,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: i === 0 ? "rgba(110,231,183,0.12)" : "transparent",
            border: i === 0 ? "1px solid rgba(110,231,183,0.22)" : "1px solid transparent",
            color: i === 0 ? ACCENT : "rgba(255,255,255,0.32)",
            cursor: "pointer", transition: "all 0.15s",
          }}>
            <Icon size={16} strokeWidth={1.8} />
          </div>
        ))}
      </div>
    </div>
  );
}

function StatBlock({ icon: Icon, label, children, delay }) {
  return (
    <motion.div {...fadeIn(delay)} style={{ marginBottom: 20 }}>
      <Icon size={16} color={ACCENT} strokeWidth={1.6} style={{ marginBottom: 9, display: "block" }} />
      <div style={{
        fontFamily: MONO, fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase",
        color: TEXT_SEC, marginBottom: 6,
      }}>{label}</div>
      {children}
    </motion.div>
  );
}

function SideStats({ activeTitle }) {
  return (
    <div>
      <StatBlock icon={Clock} label="Next Module" delay={0.6}>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: TEXT, marginBottom: 3, lineHeight: 1.3 }}>{activeTitle}</div>
        <div style={{ fontSize: 11.5, color: TEXT_SEC }}>{PROJECT.nextDuration}</div>
      </StatBlock>
      <StatBlock icon={Calendar} label="Last Active" delay={0.7}>
        <div style={{ fontSize: 11.5, color: TEXT_SEC }}>{PROJECT.lastActive}</div>
      </StatBlock>
      <StatBlock icon={BarChart3} label="Est. Remaining" delay={0.8}>
        <div style={{ fontSize: 11.5, color: TEXT_SEC }}>{PROJECT.estRemaining}</div>
      </StatBlock>
      <StatBlock icon={Users} label="Project Stats" delay={0.9}>
        <div style={{ fontSize: 11.5, color: TEXT_SEC, marginBottom: 2 }}>{PROJECT.enrolled} enrolled</div>
        <div style={{ fontSize: 11.5, color: TEXT_SEC }}>{PROJECT.completionRate} completion rate</div>
      </StatBlock>
    </div>
  );
}

function WorkspaceCard() {
  const current = MODULES.find((m) => m.state === "current");
  return (
    <div style={{
      flex: 1, display: "flex", minHeight: 0,
      border: `1px solid ${BORDER}`, borderRadius: 16,
      background: CARD_BG, backdropFilter: "blur(8px)",
      overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
    }}>
      <IconSidebar />

      <div style={{
        flex: 1, minWidth: 0, padding: "20px 24px 14px",
        overflow: "hidden", borderRight: `1px solid ${BORDER}`,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, gap: 10 }}>
          <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: ACCENT }}>
            Current Project
          </span>
          <ActivePill />
        </div>

        <h2 style={{
          fontFamily: SANS, fontWeight: 700, fontSize: "clamp(19px, 2.2vw, 25px)",
          color: TEXT, marginBottom: 6, letterSpacing: "-0.01em",
        }}>
          {PROJECT.title}
        </h2>
        <p style={{ fontFamily: SANS, fontSize: 12.5, color: TEXT_SEC, marginBottom: 16 }}>
          Week {PROJECT.week} of {PROJECT.totalWeeks}
        </p>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
          <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: TEXT_SEC }}>
            Progress
          </span>
          <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, color: ACCENT }}>{PROJECT.progress}%</span>
        </div>
        <div style={{ height: 5, borderRadius: 20, background: "rgba(255,255,255,0.07)", marginBottom: 16, overflow: "hidden" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${PROJECT.progress}%` }}
            transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
            style={{ height: "100%", borderRadius: 20, background: ACCENT }}
          />
        </div>

        <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 14 }}>
          {PROJECT.stack.map((t) => (
            <span key={t} style={{
              background: "rgba(255,255,255,0.03)", border: `1px solid ${BORDER}`, borderRadius: 20,
              fontSize: 11, padding: "4px 11px", color: TEXT_SEC, fontFamily: MONO,
            }}>{t}</span>
          ))}
        </div>

        <div style={{ height: 1, background: BORDER, marginBottom: 2 }} />

        <div>
          {MODULES.map((m, i) => <ModuleRow key={m.id} m={m} index={i} />)}
        </div>
      </div>

      <div style={{ width: 150, flexShrink: 0, padding: "20px 18px", overflow: "hidden" }}>
        <SideStats activeTitle={current?.title} />
      </div>
    </div>
  );
}

function InputField({ id, label, type, value, onChange, placeholder, autoComplete, leftIcon, children }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      {label && (
        <label htmlFor={id} style={{
          display: "block", fontFamily: MONO, fontSize: 10, letterSpacing: "0.12em",
          textTransform: "uppercase", color: TEXT_SEC, marginBottom: 6,
        }}>{label}</label>
      )}
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        {leftIcon && (
          <span style={{
            position: "absolute", left: 13, display: "flex", alignItems: "center",
            color: focused ? ACCENT : "rgba(255,255,255,0.32)", pointerEvents: "none", transition: "color 0.15s",
          }}>
            {leftIcon}
          </span>
        )}
        <input
          id={id} type={type} value={value} onChange={onChange}
          placeholder={placeholder} autoComplete={autoComplete}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{
            width: "100%", borderRadius: 8, outline: "none",
            background: focused ? "rgba(110,231,183,0.03)" : "#111",
            border: `1px solid ${focused ? "rgba(110,231,183,0.3)" : BORDER}`,
            boxShadow: focused ? "0 0 0 3px rgba(110,231,183,0.05)" : "none",
            padding: `10px ${children ? 40 : 14}px 10px ${leftIcon ? 38 : 12}px`,
            fontFamily: SANS, fontSize: 13, color: TEXT,
            transition: "all 0.18s",
          }}
        />
        {children}
      </div>
    </div>
  );
}

function OAuthBtn({ label, icon }) {
  const [h, setH] = useState(false);
  return (
    <button
      type="button"
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
        padding: "9px 0", width: "100%", borderRadius: 9, cursor: "pointer",
        background: h ? "rgba(255,255,255,0.04)" : "#111",
        border: `1px solid ${h ? "rgba(255,255,255,0.12)" : BORDER}`,
        color: h ? TEXT : TEXT_SEC, fontFamily: SANS, fontSize: 12.5,
        transition: "all 0.15s",
      }}
    >{icon}{label}</button>
  );
}

function StatusBar() {
  return (
    <motion.div
      {...fadeIn(0.2)}
      style={{
        position: "absolute", top: 22, right: 28, zIndex: 2,
        display: "flex", alignItems: "center", gap: 10,
        fontFamily: MONO, fontSize: 10, color: "rgba(255,255,255,0.32)", letterSpacing: "0.04em",
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: ACCENT }} />
        Systems Operational
      </span>
      <span style={{ opacity: 0.3 }}>/</span>
      <span>Synced 2m ago</span>
      <span style={{ opacity: 0.3 }}>/</span>
      <span style={{ border: `1px solid ${BORDER}`, borderRadius: 6, padding: "2px 8px", color: "rgba(255,255,255,0.4)" }}>
        v1.0.0
      </span>
    </motion.div>
  );
}

// ── MAIN LOGIN COMPONENT ──────────────────────────────────────────────────

export default function Login() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { getCurrentUser } = useContext(UserContext)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email && !username) { setError("Please enter your username or email."); return; }
    if (!password) { setError("Please enter your password."); return; }
    setLoading(true);
    try {
      // TODO: await loginUser({ email, password });
      await axios.post(`${import.meta.env.VITE_APP_URI}/api/v1/users/login`, {
        username,
        email,
        password,
      },
        {
          withCredentials: true,
        })
      bwToast.success("User logged in successfully")
      await getCurrentUser()
      navigate("/");
    } catch (err) {
      bwToast.error("Couldn't Login")
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif&family=DM+Sans:wght@400;500;600;700&family=DM+Mono&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
        @keyframes particleFloat {
          0%   { opacity: 0; transform: translate(0, 0); }
          20%  { opacity: var(--peak); transform: translate(calc(var(--dx) * 0.3), calc(var(--dy) * 0.3)); }
          50%  { opacity: var(--peak); transform: translate(var(--dx), var(--dy)); }
          80%  { opacity: var(--peak); transform: translate(calc(var(--dx) * 0.7), calc(var(--dy) * 0.7)); }
          100% { opacity: 0; transform: translate(0, 0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 1000px #111111 inset !important;
          -webkit-text-fill-color: #F0F0F0 !important;
          caret-color: #F0F0F0 !important;
          border-color: rgba(255,255,255,0.07) !important;
          transition: background-color 9999s ease-in-out 0s !important;
        }
      `}</style>

      <div style={{
        display: "flex", width: "100vw", height: "100vh", overflow: "hidden",
        background: BG, color: TEXT, fontFamily: SANS, position: "relative",
      }}>

        {/* ════════════════════════
            LEFT — Workspace
        ════════════════════════ */}
        <div style={{
          flex: "0 0 57%", borderRight: `1px solid ${BORDER}`,
          height: "100%", overflow: "hidden", position: "relative",
          display: "flex", flexDirection: "column",
          padding: "34px 46px 28px",
        }}>
          {/* BG grid */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
            backgroundImage: "linear-gradient(rgba(255,255,255,0.028) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.028) 1px, transparent 1px)",
            backgroundSize: "60px 60px", opacity: 0.65,
          }} />
          {/* Faint green glow */}
          <div style={{
            position: "absolute", top: "38%", left: "20%", transform: "translate(-50%, -50%)",
            width: 480, height: 480, borderRadius: "50%", pointerEvents: "none", zIndex: 0,
            background: "radial-gradient(ellipse, rgba(110,231,183,0.05) 0%, transparent 68%)",
          }} />
          {/* Moving particles */}
          <Particles />

          {/* Brand */}
          <motion.div {...fadeUp(0)} style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 44, position: "relative", zIndex: 1 }}>
            <BrandMark />
            <div>
              <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 16, letterSpacing: "0.1em", color: TEXT }}>
                BUILDWISE
              </div>
              <div style={{ fontFamily: MONO, fontSize: 9.5, letterSpacing: "0.16em", color: TEXT_SEC, marginTop: 3 }}>
                PROJECT LEARNING OS
              </div>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.div {...fadeUp(0.1)} style={{ marginBottom: 26, position: "relative", zIndex: 1 }}>
            <p style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.16em", color: ACCENT, textTransform: "uppercase", marginBottom: 10 }}>
              Your Workspace
            </p>
            <h1 style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "clamp(28px, 3.6vw, 44px)", lineHeight: 1.08, marginBottom: 14, color: TEXT }}>
              Continue <span style={{ fontStyle: "italic", color: ACCENT }}>building.</span>
            </h1>
            <p style={{ fontSize: 14, color: TEXT_SEC, maxWidth: 420, lineHeight: 1.6 }}>
              Your projects, modules, and progress are waiting exactly where you left them.
            </p>
          </motion.div>

          {/* Workspace card */}
          <motion.div {...fadeUp(0.2)} style={{ flex: 1, minHeight: 0, position: "relative", zIndex: 1, display: "flex" }}>
            <WorkspaceCard />
          </motion.div>

          {/* Terminal footer */}
          <motion.div {...fadeIn(0.6)} style={{
            marginTop: 18, position: "relative", zIndex: 1,
            fontFamily: MONO, fontSize: 11.5, color: "rgba(255,255,255,0.3)",
            display: "flex", gap: 9, alignItems: "center",
          }}>
            <span style={{ color: ACCENT }}>{">_"}</span>
            <span>// BUILD DIFFERENT. LEARN DEEPER. SHIP REAL.</span>
          </motion.div>
        </div>

        {/* ════════════════════════
            RIGHT — Auth
        ════════════════════════ */}
        <div style={{
          flex: "1", height: "100%", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", position: "relative",
          zIndex: 1, overflow: "hidden",
        }}>
          <StatusBar />

          <motion.div {...fadeUp(0.3)} style={{ width: "100%", maxWidth: 360, padding: "0 28px" }}>

            {/* Auth header */}
            <div style={{ marginBottom: 28 }}>
              <h2 style={{
                fontFamily: SERIF, fontSize: 33, fontWeight: 400,
                color: TEXT, letterSpacing: "-0.01em", lineHeight: 1.2, marginBottom: 8,
              }}>
                Welcome back
              </h2>
              <p style={{ fontSize: 13.5, color: TEXT_SEC, fontWeight: 300, lineHeight: 1.6 }}>
                Sign in to pick up where you left off.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }} noValidate>

              <InputField
                id="username" label="Username" type="text"
                value={username} onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, "").toLowerCase())}
                placeholder="jordanbuilds" autoComplete="username"
                leftIcon={<AtSign size={14} />}
              />

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }} />
                <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)" }}>or</span>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }} />
              </div>

              <InputField
                id="email" label="Email" type="email"
                value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com" autoComplete="email"
                leftIcon={<Mail size={14} />}
              />

              <div>
                <label htmlFor="password" style={{
                  display: "block", fontFamily: MONO, fontSize: 10, letterSpacing: "0.12em",
                  textTransform: "uppercase", color: TEXT_SEC, marginBottom: 6,
                }}>Password</label>
                <InputField
                  id="password" type={showPw ? "text" : "password"}
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" autoComplete="current-password"
                  leftIcon={<Lock size={14} />}
                >
                  <button type="button" onClick={() => setShowPw((p) => !p)}
                    aria-label={showPw ? "Hide password" : "Show password"}
                    style={{
                      position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                      background: "none", border: "none", cursor: "pointer",
                      color: "rgba(255,255,255,0.4)", padding: 3, display: "flex", alignItems: "center", transition: "color 0.15s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#bbb")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
                  >
                    {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </InputField>
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 9 }}>
                  <Link to="/forgot-password" style={{
                    fontFamily: SANS, fontSize: 12, color: ACCENT, textDecoration: "none",
                    transition: "opacity 0.15s",
                  }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = 0.7)}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = 1)}
                  >Forgot password?</Link>
                </div>
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.18 }}
                    style={{
                      fontSize: 11.5, color: "#f87171",
                      background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.15)",
                      borderRadius: 6, padding: "7px 10px",
                    }}
                  >{error}</motion.p>
                )}
              </AnimatePresence>

              {/* CTA */}
              <button
                type="submit" disabled={loading}
                style={{
                  width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  borderRadius: 9, fontFamily: SANS, fontSize: 13.5, fontWeight: 600,
                  background: "linear-gradient(180deg, #93EFC9 0%, #4FDE9E 100%)",
                  color: "#07170F", padding: "11px 0", border: "none",
                  boxShadow: "0 2px 20px rgba(110,231,183,0.22)",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.75 : 1, transition: "all 0.18s",
                }}
                onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.filter = "brightness(1.06)"; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 26px rgba(110,231,183,0.3)"; } }}
                onMouseLeave={(e) => { e.currentTarget.style.filter = "none"; e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 2px 20px rgba(110,231,183,0.22)"; }}
              >
                {loading ? (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                    stroke="#07170F" strokeWidth="2.5" strokeLinecap="round"
                    style={{ animation: "spin 0.8s linear infinite" }}>
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                ) : (<>Continue Building <ArrowRight size={13} strokeWidth={2.3} /></>)}
              </button>
            </form>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "20px 0" }}>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }} />
              <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", whiteSpace: "nowrap" }}>
                or continue with
              </span>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }} />
            </div>

            {/* OAuth */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 }}>
              <OAuthBtn label="GitHub" icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
              } />
              <OAuthBtn label="Google" icon={
                <svg width="14" height="14" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
              } />
            </div>

            {/* Footer */}
            <p style={{ textAlign: "center", fontSize: 13, color: "rgba(255,255,255,0.35)", marginTop: 22 }}>
              New to BuildWise?{" "}
              <Link to="/register" style={{
                color: ACCENT, fontWeight: 600, textDecoration: "none",
                display: "inline-flex", alignItems: "center", gap: 4, transition: "opacity 0.15s",
              }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = 0.75)}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = 1)}
              >Create an account <ArrowRight size={12} /></Link>
            </p>
          </motion.div>
        </div>

      </div>
    </>
  );
}
