import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import api from "../Services/api";
import Loader from "../Components/Loader";
import { motion, useInView } from "framer-motion";
import {
  Hammer, Home, FolderOpen, Trophy, Settings, Bell,
  Search, ChevronLeft, ChevronRight, ArrowRight, Flame, Clock,
  Zap, Play, Check, Lock, Rocket, Menu, User,
  Target, Shield, BadgeInfo, Camera, KeyRound,
  Trash2, RotateCcw, BookOpenCheck, Star, TrendingUp, Award,
} from "lucide-react";
import { getDashboardSummary } from "../Services/dashboardService";
import { COLORS, C } from "../Constants/theme";
import { UserContext } from "../Context/UserContext";
import DashboardCard from "../Components/DashboardCard";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const NAV = [
  { id: "home", label: "Home", icon: Home, path: "/" },
  { id: "projects", label: "Projects", icon: FolderOpen, path: "/projects" },
  { id: "about", label: "About", icon: BadgeInfo, path: "/about" },
  { id: "achieve", label: "Achievements", icon: Trophy, scroll: "achievements" },
  { id: "settings", label: "Settings", icon: Settings, scroll: "settings" },
  { id: "admin", label: "Admin Panel", icon: Shield, path: "/admin", adminOnly: true },
];

const inputStyle = {
  width: "100%", padding: "9px 12px",
  background: "rgba(255,255,255,0.035)",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: 9, color: "#e5e5e5", fontSize: 13,
  outline: "none", fontFamily: "inherit", boxSizing: "border-box",
  transition: "border-color 0.2s",
};

const labelStyle = {
  fontSize: 10.5, color: "#555", letterSpacing: "0.08em",
  textTransform: "uppercase", fontWeight: 500,
  marginBottom: 6, display: "block",
};

const SECTION_HEAD = {
  fontFamily: "'Instrument Serif', serif",
  fontSize: 22, color: "#f2f2f2",
  letterSpacing: "-0.018em", lineHeight: 1.2,
};

// ─────────────────────────────────────────────────────────────────────────────
// HOOKS
// ─────────────────────────────────────────────────────────────────────────────

function useCountUp(target, isInView, duration = 1100) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!isInView || !target) return;
    const steps = 45, inc = target / steps;
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

function useHover() {
  const [hov, setHov] = useState(false);
  return [hov, { onMouseEnter: () => setHov(true), onMouseLeave: () => setHov(false) }];
}

// ─────────────────────────────────────────────────────────────────────────────
// PRIMITIVES
// ─────────────────────────────────────────────────────────────────────────────

function FadeIn({ children, delay = 0, y = 16, style = {}, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      style={style} className={className}>
      {children}
    </motion.div>
  );
}

// Elevated glass panel — three distinct elevation levels
function Panel({ children, style = {}, elevation = 1, accent, onClick }) {
  const [hov, handlers] = useHover();
  const bases = [
    "rgba(255,255,255,0.025)",  // 0 — sunken
    "rgba(255,255,255,0.04)",   // 1 — default surface
    "rgba(255,255,255,0.065)",  // 2 — raised
  ];
  const hovBg = [
    "rgba(255,255,255,0.04)",
    "rgba(255,255,255,0.06)",
    "rgba(255,255,255,0.09)",
  ];
  const shadows = [
    "none",
    "0 2px 16px rgba(0,0,0,0.3)",
    "0 8px 32px rgba(0,0,0,0.4)",
  ];
  return (
    <div {...(onClick ? { onClick, ...handlers } : handlers)}
      style={{
        background: hov && onClick ? hovBg[elevation] : bases[elevation],
        border: `1px solid ${hov && accent ? accent + "28" : "rgba(255,255,255,0.07)"}`,
        backdropFilter: "blur(24px)",
        borderRadius: 16,
        boxShadow: hov && accent
          ? `${shadows[elevation]}, 0 0 40px ${accent}0a`
          : shadows[elevation],
        transition: "all 0.28s cubic-bezier(0.22, 1, 0.36, 1)",
        transform: hov && onClick ? "translateY(-2px)" : "translateY(0)",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}>
      {children}
    </div>
  );
}

function PrimaryBtn({ children, onClick, style = {} }) {
  const [hov, handlers] = useHover();
  return (
    <button onClick={onClick} {...handlers}
      style={{
        display: "inline-flex", alignItems: "center", gap: 7,
        padding: "9px 20px",
        background: hov
          ? `linear-gradient(135deg, #7EEFC0, ${C.green})`
          : `linear-gradient(135deg, ${C.green}, #55C49A)`,
        color: "#071A12", fontWeight: 700, fontSize: 13,
        borderRadius: 9, border: "none", cursor: "pointer",
        transition: "all 0.22s cubic-bezier(0.22, 1, 0.36, 1)",
        transform: hov ? "translateY(-1px)" : "translateY(0)",
        boxShadow: hov ? `0 8px 24px ${C.green}30` : `0 2px 8px ${C.green}18`,
        letterSpacing: "-0.01em",
        fontFamily: "inherit", ...style,
      }}>
      {children}
    </button>
  );
}

function GhostBtn({ children, onClick, style = {} }) {
  const [hov, handlers] = useHover();
  return (
    <button onClick={onClick} {...handlers}
      style={{
        display: "inline-flex", alignItems: "center", gap: 7,
        padding: "9px 18px",
        background: hov ? "rgba(255,255,255,0.06)" : "transparent",
        color: hov ? "#d0d0d0" : "#666", fontSize: 13, fontWeight: 400,
        borderRadius: 9,
        border: `1px solid ${hov ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.08)"}`,
        cursor: "pointer", transition: "all 0.2s ease", fontFamily: "inherit", ...style,
      }}>
      {children}
    </button>
  );
}

function DangerBtn({ children, onClick, style = {} }) {
  const [hov, handlers] = useHover();
  return (
    <button onClick={onClick} {...handlers}
      style={{
        display: "inline-flex", alignItems: "center", gap: 7,
        padding: "9px 18px",
        background: hov ? "rgba(239,68,68,0.1)" : "transparent",
        color: hov ? "#FCA5A5" : "#666", fontSize: 13, fontWeight: 400,
        borderRadius: 9,
        border: `1px solid ${hov ? "rgba(239,68,68,0.32)" : "rgba(255,255,255,0.08)"}`,
        cursor: "pointer", transition: "all 0.2s ease", fontFamily: "inherit", ...style,
      }}>
      {children}
    </button>
  );
}

function EyebrowLabel({ children }) {
  return (
    <p style={{
      fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase",
      color: C.green, fontWeight: 600, marginBottom: 5,
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {children}
    </p>
  );
}

function DiffBadge({ d }) {
  const map = {
    Beginner: { bg: `${C.green}14`, color: C.green },
    Intermediate: { bg: `${C.amber}14`, color: C.amber },
    Advanced: { bg: `${C.indigo}14`, color: C.indigo },
    Expert: { bg: `${C.pink}14`, color: C.pink },
  };
  const s = map[d] || map.Intermediate;
  return (
    <span style={{
      fontSize: 9.5, fontWeight: 700, padding: "3px 8px",
      borderRadius: 5, background: s.bg, color: s.color,
      letterSpacing: "0.04em",
    }}>{d}</span>
  );
}

function SectionDivider() {
  return (
    <div style={{
      height: 1,
      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.06) 70%, transparent)",
      margin: "0 0 36px",
    }} />
  );
}

function EmptyState({ icon: Icon, color, title, body, action }) {
  return (
    <div style={{
      padding: "44px 24px", textAlign: "center",
      borderRadius: 16,
      border: "1px dashed rgba(255,255,255,0.07)",
      background: "rgba(255,255,255,0.01)",
    }}>
      <div style={{
        width: 46, height: 46, borderRadius: 12,
        background: color + "10", border: `1px solid ${color}1E`,
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 14px",
      }}>
        <Icon size={19} color={color} />
      </div>
      <p style={{ fontWeight: 600, color: "#d0d0d0", fontSize: 14, marginBottom: 6 }}>{title}</p>
      <p style={{ fontSize: 12, color: "#555", marginBottom: 20, lineHeight: 1.65 }}>{body}</p>
      {action}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SIDEBAR
// ─────────────────────────────────────────────────────────────────────────────

function SidebarNavItem({ item, isActive, collapsed, onClick }) {
  const [hov, handlers] = useHover();
  const Icon = item.icon;
  const highlighted = isActive;
  return (
    <button
      onClick={onClick}
      {...handlers}
      style={{
        display: "flex", alignItems: "center",
        gap: collapsed ? 0 : 10,
        padding: collapsed ? "10px" : "8px 11px",
        justifyContent: collapsed ? "center" : "flex-start",
        borderRadius: 9,
        border: `1px solid ${highlighted ? `${C.green}28` : "transparent"}`,
        background: highlighted
          ? `${C.green}0C`
          : hov ? "rgba(255,255,255,0.04)" : "transparent",
        color: highlighted ? C.green : hov ? "#c8c8c8" : "#666",
        transition: "all 0.18s ease",
        width: "100%", textAlign: "left",
        cursor: "pointer", fontFamily: "inherit",
      }}>
      <Icon size={15} style={{ flexShrink: 0 }} />
      {!collapsed && (
        <span style={{ fontSize: 13, fontWeight: highlighted ? 500 : 400, whiteSpace: "nowrap" }}>
          {item.label}
        </span>
      )}
      {!collapsed && highlighted && (
        <div style={{
          marginLeft: "auto", width: 5, height: 5, borderRadius: "50%",
          background: C.green, boxShadow: `0 0 7px ${C.green}`,
        }} />
      )}
    </button>
  );
}

function SidebarNavLink({ item, collapsed }) {
  const [hov, handlers] = useHover();
  const Icon = item.icon;
  return (
    <NavLink
      to={item.path}
      {...handlers}
      style={({ isActive }) => ({
        display: "flex", alignItems: "center",
        gap: collapsed ? 0 : 10,
        padding: collapsed ? "10px" : "8px 11px",
        justifyContent: collapsed ? "center" : "flex-start",
        borderRadius: 9,
        border: `1px solid ${isActive ? `${C.green}28` : "transparent"}`,
        background: isActive
          ? `${C.green}0C`
          : hov ? "rgba(255,255,255,0.04)" : "transparent",
        color: isActive ? C.green : hov ? "#c8c8c8" : "#666",
        transition: "all 0.18s ease",
        width: "100%", textDecoration: "none",
      })}>
      {({ isActive }) => (
        <>
          <Icon size={15} style={{ flexShrink: 0 }} />
          {!collapsed && (
            <span style={{ fontSize: 13, fontWeight: isActive ? 500 : 400, whiteSpace: "nowrap" }}>
              {item.label}
            </span>
          )}
          {!collapsed && isActive && (
            <div style={{
              marginLeft: "auto", width: 5, height: 5, borderRadius: "50%",
              background: C.green, boxShadow: `0 0 7px ${C.green}`,
            }} />
          )}
        </>
      )}
    </NavLink>
  );
}

function Sidebar({ active, setActive, collapsed, setCollapsed, scrollContainerRef }) {
  const { user } = useContext(UserContext);

  function scrollToSection(id) {
    const container = scrollContainerRef.current;
    const target = document.getElementById(id);
    if (!container || !target) return;
    container.scrollBy({
      top: target.getBoundingClientRect().top - container.getBoundingClientRect().top - 80,
      behavior: "smooth",
    });
  }

  return (
    <motion.aside
      initial={{ x: -24, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        width: collapsed ? 64 : 216, flexShrink: 0,
        height: "100vh", position: "sticky", top: 0,
        display: "flex", flexDirection: "column",
        background: "rgba(8,8,8,0.88)",
        backdropFilter: "blur(32px)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        transition: "width 0.32s cubic-bezier(0.22, 1, 0.36, 1)",
        zIndex: 40, overflow: "hidden",
      }}>

      {/* Logo */}
      <div style={{
        padding: "17px 13px 14px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8, flexShrink: 0,
          background: "linear-gradient(135deg, #6EE7B7 0%, #818CF8 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 10px rgba(110,231,183,0.25)",
        }}>
          <Hammer size={13} color="#071A12" />
        </div>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08 }}
            style={{ fontWeight: 700, fontSize: 14, letterSpacing: "-0.025em", color: "#fff", whiteSpace: "nowrap" }}>
            BuildWise
          </motion.span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            marginLeft: "auto", background: "none", border: "none",
            cursor: "pointer", color: "#444", display: "flex",
            flexShrink: 0, padding: 4, borderRadius: 6,
            transition: "color 0.18s",
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "#999")}
          onMouseLeave={e => (e.currentTarget.style.color = "#444")}>
          <Menu size={14} />
        </button>
      </div>

      {/* Nav */}
      <nav style={{
        flex: 1, padding: "10px 7px",
        display: "flex", flexDirection: "column", gap: 2,
        overflowY: "auto",
      }}>
        {NAV
          .filter(item => !item.adminOnly || user?.role === "admin")
          .map(item => item.scroll
            ? (
              <SidebarNavItem
                key={item.id}
                item={item}
                isActive={active === item.id}
                collapsed={collapsed}
                onClick={() => { setActive(item.id); scrollToSection(item.scroll); }}
              />
            ) : (
              <SidebarNavLink key={item.id} item={item} collapsed={collapsed} />
            )
          )}
      </nav>

      {/* User */}
      <div style={{ padding: "9px 7px 13px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div
          style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: collapsed ? "8px" : "7px 10px",
            borderRadius: 9, cursor: "pointer",
            transition: "background 0.18s",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
          <div style={{
            width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
            background: "linear-gradient(135deg, #6EE7B7, #818CF8)",
            color: "#071A12", fontSize: 12, fontWeight: 800,
            display: "flex", alignItems: "center", justifyContent: "center",
          }} title={user?.fullName}>
            {user?.fullName?.charAt(0).toUpperCase()}
          </div>
          {!collapsed && (
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontSize: 12, fontWeight: 600, color: "#d0d0d0",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}>{user?.fullName}</div>
              <div style={{ fontSize: 10, color: "#444", marginTop: 1 }}>Builder</div>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HEADER
// ─────────────────────────────────────────────────────────────────────────────

function Header() {
  const { user } = useContext(UserContext);
  const [notifs] = useState(3);
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      style={{
        padding: "14px 28px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", gap: 16,
        background: "rgba(8,8,8,0.6)",
        backdropFilter: "blur(28px)",
        position: "sticky", top: 0, zIndex: 30,
      }}>

      {/* Search */}
      <div style={{ flex: 1, maxWidth: 340, position: "relative" }}>
        <Search size={13} color={searchFocused ? "#6EE7B7" : "#444"}
          style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", transition: "color 0.2s" }} />
        <input
          placeholder="Search projects, modules…"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          style={{
            width: "100%", padding: "8px 12px 8px 34px",
            background: searchFocused ? "rgba(255,255,255,0.055)" : "rgba(255,255,255,0.03)",
            border: `1px solid ${searchFocused ? "rgba(110,231,183,0.25)" : "rgba(255,255,255,0.07)"}`,
            borderRadius: 9, color: "#d0d0d0", fontSize: 13,
            outline: "none", fontFamily: "inherit", boxSizing: "border-box",
            transition: "all 0.2s ease",
          }}
        />
      </div>

      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
        {/* Bell */}
        <div style={{ position: "relative" }}>
          <button
            style={{
              width: 34, height: 34, borderRadius: 9,
              background: "rgba(255,255,255,0.035)",
              border: "1px solid rgba(255,255,255,0.07)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", transition: "all 0.18s", color: "#666",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.color = "#d0d0d0"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.035)"; e.currentTarget.style.color = "#666"; }}>
            <Bell size={14} />
          </button>
          {notifs > 0 && (
            <div style={{
              position: "absolute", top: -3, right: -3,
              width: 15, height: 15, borderRadius: "50%",
              background: C.green, display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 9, fontWeight: 800, color: "#071A12",
              border: "2px solid #090909",
            }}>{notifs}</div>
          )}
        </div>

        {/* Avatar */}
        <div title={user?.fullName} style={{
          width: 34, height: 34, borderRadius: "50%",
          background: "linear-gradient(135deg, #6EE7B7, #818CF8)",
          color: "#071A12", fontSize: 13, fontWeight: 800,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", boxShadow: "0 0 0 2px rgba(110,231,183,0.2)",
        }}>
          {user?.fullName?.charAt(0).toUpperCase()}
        </div>
      </div>
    </motion.header>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────────────────────────────────────

function WelcomeHero({ stats }) {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  // Find streak from stats array
  const streakStat = stats?.find(s => s.label?.toLowerCase().includes("streak") || s.suffix === "d");
  const streak = streakStat?.val ?? 0;

  return (
    <div style={{ padding: "40px 28px 0", position: "relative" }}>
      {/* Hero glows */}
      <div style={{ position: "absolute", top: 0, left: "20%", width: 500, height: 240, background: `radial-gradient(ellipse, ${C.green}08 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 30, right: "8%", width: 280, height: 180, background: `radial-gradient(ellipse, ${C.indigo}06 0%, transparent 70%)`, pointerEvents: "none" }} />

      <FadeIn>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
          {/* Left: editorial heading */}
          <div style={{ flex: "1 1 340px" }}>
            {streak > 0 && (
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 999, background: "rgba(110,231,183,0.07)", border: "1px solid rgba(110,231,183,0.16)", marginBottom: 16 }}>
                <div style={{ width: 4, height: 4, borderRadius: "50%", background: C.green, animation: "pulse 2s infinite" }} />
                <span style={{ fontSize: 11, color: C.green, fontWeight: 500 }}>{streak} day streak active 🔥</span>
              </div>
            )}
            <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(28px, 3.8vw, 46px)", color: "#f0f0f0", letterSpacing: "-0.022em", lineHeight: 1.1, marginBottom: 12 }}>
              Welcome back,<br />
              <span style={{ background: `linear-gradient(115deg, #f0f0f0 40%, ${C.green})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                {user?.fullName?.split(" ")[0]}
              </span>
            </h1>
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.7, maxWidth: 400, marginBottom: 22 }}>
              Keep shipping. Every module completed is a step toward something real.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <PrimaryBtn onClick={() => navigate("/projects")}>
                <Play size={13} /> Continue Learning
              </PrimaryBtn>
              <GhostBtn onClick={() => navigate("/projects")}>
                <FolderOpen size={13} /> All Projects
              </GhostBtn>
            </div>
          </div>

          {/* Right: momentum panel */}
          {stats && stats.length > 0 && (
            <div style={{ margin: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
              {stats.map((m, i) => (
                <AnalyticTile key={m.label} m={m} i={i} />
              ))}
            </div>
          )}
        </div>
      </FadeIn>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// QUICK ACTIONS
// ─────────────────────────────────────────────────────────────────────────────

function QuickActions() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const scroll = id => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const actions = [
    { label: "Browse Projects", icon: FolderOpen, color: C.green, onClick: () => navigate("/projects") },
    { label: "Achievements", icon: Trophy, color: C.indigo, onClick: () => scroll("achievements") },
    { label: "Settings", icon: Settings, color: C.amber, onClick: () => scroll("settings") },
    user?.role === "admin"
      ? { label: "Admin Panel", icon: Shield, color: C.pink, onClick: () => navigate("/admin") }
      : { label: "Profile", icon: User, color: C.pink, onClick: () => scroll("settings") },
  ];

  return (
    <FadeIn>
      <div className="dash-quick-strip" style={{
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10,
      }}>
        {actions.map((a, i) => (
          <QuickActionBtn key={i} {...a} />
        ))}
      </div>
    </FadeIn>
  );
}

function QuickActionBtn({ label, icon: Icon, color, onClick }) {
  const [hov, handlers] = useHover();
  return (
    <button onClick={onClick} {...handlers}
      style={{
        padding: "14px 10px", borderRadius: 12,
        background: hov ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.04)",
        border: `1px solid ${hov ? color + "28" : "rgba(255,255,255,0.07)"}`,
        backdropFilter: "blur(20px)",
        cursor: "pointer", textAlign: "center",
        fontFamily: "inherit", width: "100%",
        transition: "all 0.22s cubic-bezier(0.22, 1, 0.36, 1)",
        transform: hov ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hov ? `0 8px 24px ${color}12` : "none",
      }}>
      <div style={{
        width: 32, height: 32, borderRadius: 9,
        background: hov ? color + "1A" : color + "0E",
        border: `1px solid ${hov ? color + "30" : color + "16"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 9px",
        transition: "all 0.22s",
      }}>
        <Icon size={14} color={color} />
      </div>
      <div style={{
        fontSize: 11.5, color: hov ? "#b0b0b0" : "#555",
        fontWeight: 500, transition: "color 0.18s",
      }}>{label}</div>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ANALYTICS PANEL (replaces Today's Focus)
// ─────────────────────────────────────────────────────────────────────────────

function AnalyticsPanel({ stats, achievements, projects }) {
  const completedProjects = projects?.filter(e => e.project?.progress === 100).length ?? 0;
  const totalProjects = projects?.length ?? 0;

  const projectsStat = stats?.find(s => s.label?.toLowerCase().includes("project"));
  const achieveStat = stats?.find(s => s.label?.toLowerCase().includes("achieve"));

  const unlockedCount = achievements?.filter(a => a.unlocked).length ?? 0;
  const totalAchieve = achievements?.length ?? 0;
  const completedCount = projectsStat?.val ?? 0;
  const xpVal = completedCount * 85;
  const xpNext = (Math.floor(completedCount / 3) + 1) * 255;
  const xpPct = xpNext > 0 ? Math.min(100, Math.round((xpVal / xpNext) * 100)) : 0;
  // Next locked achievement
  const nextAchieve = achievements?.find(a => !a.unlocked);

  // Derive level from stats or project count
  const streakStat = stats?.find(s => s.label?.toLowerCase().includes("streak") || s.suffix === "🔥");
  const streakVal = streakStat?.val ?? 0;
  const level = Math.max(1, Math.floor(totalProjects / 2) + 1);
  const builderScore = Math.min(99, completedProjects * 12 + unlockedCount * 6 + streakVal);

  // Completion pct
  const completionPct = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0;

  return (
    <FadeIn delay={0.06}>
      <div>
        <EyebrowLabel>ANALYTICS</EyebrowLabel>
        <h2 style={{ ...SECTION_HEAD, fontSize: 18, marginBottom: 16 }}>Your progress</h2>

        {/* xp bar */}
        <Panel elevation={1} style={{ padding: "16px 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: "#666" }}>XP Progress</span>
            <span style={{ fontSize: 11, color: C.green, fontWeight: 600 }}>{xpPct}%</span>
          </div>
          <div style={{
            height: 5, borderRadius: 3,
            background: "rgba(255,255,255,0.06)", overflow: "hidden",
          }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${xpPct}%` }}
              transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
              style={{
                height: "100%", borderRadius: 3,
                background: `linear-gradient(90deg, ${C.green}, #818CF8)`,
                boxShadow: `0 0 8px ${C.green}50`,
              }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            <span style={{ fontSize: 10, color: "#444" }}>{xpVal} XP</span>
            <span style={{ fontSize: 10, color: "#444" }}>{xpNext} XP</span>
          </div>
        </Panel>

        {/* Completion bar */}
        <Panel elevation={1} style={{ padding: "16px 16px" , marginTop:10}}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: 11.5, color: "#666" }}>Project completion</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: C.green }}>{completionPct}%</span>
          </div>
          <div style={{ height: 4, background: "rgba(255,255,255,0.05)", borderRadius: 2, overflow: "hidden" }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionPct}%` }}
              transition={{ duration: 1.1, delay: 0.5, ease: "easeOut" }}
              style={{
                height: "100%", borderRadius: 2,
                background: `linear-gradient(90deg, ${C.green}, #818CF8)`,
              }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
            <span style={{ fontSize: 10, color: "#3a3a3a" }}>{completedProjects} completed</span>
            <span style={{ fontSize: 10, color: "#3a3a3a" }}>{totalProjects} total</span>
          </div>
        </Panel>

        {/* Next achievement preview */}
        {nextAchieve && (
          <div style={{ marginTop: 10 }}>
            <NextAchievementPreview a={nextAchieve} />
          </div>
        )}
      </div>
    </FadeIn>
  );
}

function AnalyticTile({ m, i }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const count = useCountUp(m.val, inView, 900);
  const Icon = m.icon;
  const [hov, handlers] = useHover();

  return (
    <FadeIn delay={i * 0.06}>
      <div ref={ref} {...handlers}
        style={{
          padding: "20px 20px 20px",
          borderRadius: 12,
          background: hov ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.04)",
          border: `1px solid ${hov ? m.color + "28" : "rgba(255,255,255,0.07)"}`,
          transition: "all 0.22s",
          transform: hov ? "translateY(-1px)" : "translateY(0)",
        }}>
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: m.color + "12", border: `1px solid ${m.color}1E`,
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom:10
          
        }}>
          <Icon size={13} color={m.color} />
        </div>
        <div style={{
          fontFamily: "'Instrument Serif', serif",
          fontSize: 26, lineHeight: 1,
          color: "#e8e8e8", marginBottom: 4,
          letterSpacing: "-0.02em",
          textAlign: "center"
        }}>
          {count}
        </div>
        <div style={{textAlign:"center", fontSize: 10.5, color: "#4a4a4a" }}>{m.label}</div>
      </div>
    </FadeIn>
  );
}

function NextAchievementPreview({ a }) {
  const Icon = a.icon;
  return (
    <Panel elevation={1} accent={a.color} style={{ padding: "13px 14px" }}>
      <p style={{ fontSize: 9.5, color: "#444", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10 }}>NEXT MILESTONE</p>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 9,
          background: a.color + "10", border: `1px solid ${a.color}20`,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <Lock size={13} color={a.color} />
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#c0c0c0", marginBottom: 2 }}>{a.name}</div>
          <div style={{ fontSize: 10.5, color: "#484848", lineHeight: 1.4 }}>{a.desc}</div>
        </div>
      </div>
    </Panel>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PROJECT CARDS
// ─────────────────────────────────────────────────────────────────────────────

function ProjectCard({ p, i }) {
  const accent = COLORS[p.color] ?? COLORS.green;
  const [hov, handlers] = useHover();

  return (
    <FadeIn delay={i * 0.06}>
      <div {...handlers}
        style={{
          borderRadius: 14, overflow: "hidden",
          border: `1px solid ${hov ? accent + "28" : "rgba(255,255,255,0.07)"}`,
          background: hov ? "rgba(255,255,255,0.055)" : "rgba(255,255,255,0.03)",
          backdropFilter: "blur(24px)",
          transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
          transform: hov ? "translateY(-5px)" : "translateY(0)",
          boxShadow: hov ? `0 20px 52px ${accent}12, 0 4px 16px rgba(0,0,0,0.3)` : "0 2px 12px rgba(0,0,0,0.2)",
          cursor: "pointer",
        }}>

        {/* Visual header */}
        <div style={{
          height: 96, position: "relative",
          background: `radial-gradient(ellipse at 35% 55%, ${accent}1A 0%, transparent 70%)`,
          borderBottom: `1px solid ${hov ? accent + "18" : "rgba(255,255,255,0.05)"}`,
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }} />

          <motion.div
            animate={{ scale: hov ? 1.07 : 1, y: hov ? -2 : 0 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: accent + "16", border: `1px solid ${accent}30`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'Instrument Serif', serif", fontSize: 15, color: accent,
              boxShadow: hov ? `0 0 20px ${accent}25` : "none",
              transition: "box-shadow 0.3s",
            }}>{p.image}</div>
          </motion.div>

          <div style={{ position: "absolute", bottom: 7, left: 10 }}><DiffBadge d={p.difficulty} /></div>
          {p.progress === 100 && (
            <div style={{
              position: "absolute", top: 7, right: 8,
              background: `${C.green}18`, border: `1px solid ${C.green}30`,
              borderRadius: 6, padding: "2px 8px", fontSize: 9.5, color: C.green, fontWeight: 700,
            }}>✓ Done</div>
          )}
        </div>

        <div style={{ padding: "15px 15px 13px" }}>
          <h4 style={{ fontSize: 13, fontWeight: 600, color: "#d8d8d8", marginBottom: 8, lineHeight: 1.3 }}>{p.name}</h4>

          {p.progress > 0 && p.progress < 100 && (
            <div style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 10, color: "#444" }}>Progress</span>
                <span style={{ fontSize: 10, color: accent, fontWeight: 600 }}>{p.progress}%</span>
              </div>
              <div style={{ height: 3, background: "rgba(255,255,255,0.05)", borderRadius: 2, overflow: "hidden" }}>
                <div style={{
                  width: `${p.progress}%`, height: "100%",
                  background: `linear-gradient(90deg, ${accent}, ${accent}90)`,
                  borderRadius: 2, transition: "width 1.1s ease",
                }} />
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 11 }}>
            {(p.stack ?? []).slice(0, 3).map(tech => (
              <span key={tech.name} style={{
                fontSize: 10, padding: "2px 7px", borderRadius: 4,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.06)",
                color: "#555",
              }}>{tech.name}</span>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <Clock size={10} color="#3a3a3a" />
            <span style={{ fontSize: 11, color: "#3a3a3a", flex: 1 }}>{p.duration}</span>
            <motion.div animate={{ x: hov ? 2 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronRight size={13} color={hov ? accent : "#2e2e2e"} />
            </motion.div>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ACTIVITY FEED
// ─────────────────────────────────────────────────────────────────────────────

function ActivityFeed({ activity }) {
  if (!activity || activity.length === 0) {
    return (
      <FadeIn>
        <EyebrowLabel>ACTIVITY</EyebrowLabel>
        <h2 style={{ ...SECTION_HEAD, fontSize: 18, marginBottom: 14 }}>Recent activity</h2>
        <EmptyState icon={Zap} color={C.amber} title="No activity yet" body="Your actions appear here as you build." />
      </FadeIn>
    );
  }

  return (
    <FadeIn delay={0.08}>
      <div>
        <EyebrowLabel>ACTIVITY</EyebrowLabel>
        <h2 style={{ ...SECTION_HEAD, fontSize: 18, marginBottom: 14 }}>Recent activity</h2>
        <Panel elevation={1} style={{ padding: "4px 0" }}>
          {activity.map((a, i) => {
            const Icon = a.icon;
            return (
              <div key={i} style={{ display: "flex", gap: 12, padding: "12px 18px", position: "relative" }}>
                {i < activity.length - 1 && (
                  <div style={{
                    position: "absolute", left: 27, top: 44, bottom: -10, width: 1,
                    background: "linear-gradient(to bottom, rgba(255,255,255,0.05), transparent)",
                  }} />
                )}
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: a.color + "12", border: `1px solid ${a.color}22`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, position: "relative", zIndex: 1,
                }}>
                  <Icon size={12} color={a.color} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                    <div>
                      <span style={{ fontSize: 10.5, color: a.color, fontWeight: 600, display: "block", marginBottom: 2 }}>{a.label}</span>
                      <span style={{ fontSize: 12.5, color: "#8a8a8a", lineHeight: 1.45 }}>{a.text}</span>
                    </div>
                    <span style={{ fontSize: 10, color: "#383838", whiteSpace: "nowrap", flexShrink: 0 }}>{a.time}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </Panel>
      </div>
    </FadeIn>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ACHIEVEMENTS
// ─────────────────────────────────────────────────────────────────────────────

function AchievementsSection({ achievements }) {
  return (
    <FadeIn delay={0.06}>
      <div id="achievements">
        <div style={{ marginBottom: 18 }}>
          <EyebrowLabel>MILESTONES</EyebrowLabel>
          <h2 style={SECTION_HEAD}>Achievements</h2>
        </div>
        {!achievements || achievements.length === 0 ? (
          <EmptyState icon={Trophy} color={C.indigo} title="No achievements yet" body="Complete projects and hit milestones to earn badges." />
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 10 }}>
            {achievements.map((a, i) => <AchievementTile key={i} a={a} i={i} />)}
          </div>
        )}
      </div>
    </FadeIn>
  );
}

function AchievementTile({ a, i }) {
  const Icon = a.icon;
  const [hov, handlers] = useHover();
  return (
    <FadeIn delay={i * 0.04}>
      <div {...handlers}
        style={{
          padding: "17px 13px", borderRadius: 13, textAlign: "center",
          border: `1px solid ${a.unlocked ? a.color + "22" : "rgba(255,255,255,0.06)"}`,
          background: a.unlocked ? a.color + "06" : "rgba(255,255,255,0.02)",
          backdropFilter: "blur(20px)",
          opacity: a.unlocked ? 1 : hov ? 0.7 : 0.38,
          cursor: "pointer",
          transition: "all 0.25s cubic-bezier(0.22, 1, 0.36, 1)",
          transform: hov ? "translateY(-3px)" : "translateY(0)",
          boxShadow: hov && a.unlocked ? `0 12px 32px ${a.color}12` : "none",
        }}>
        <div style={{
          width: 40, height: 40, borderRadius: 11,
          background: a.unlocked ? a.color + "16" : "rgba(255,255,255,0.03)",
          border: `1px solid ${a.unlocked ? a.color + "28" : "rgba(255,255,255,0.06)"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 11px",
          boxShadow: a.unlocked && hov ? `0 0 18px ${a.color}20` : "none",
          transition: "box-shadow 0.25s",
        }}>
          {a.unlocked ? <Icon size={17} color={a.color} /> : <Lock size={14} color="#2e2e2e" />}
        </div>
        <div style={{ fontSize: 11.5, fontWeight: 600, color: a.unlocked ? "#c8c8c8" : "#383838", marginBottom: 4, lineHeight: 1.3 }}>{a.name}</div>
        <div style={{ fontSize: 10, color: "#363636", lineHeight: 1.4 }}>{a.desc}</div>
      </div>
    </FadeIn>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SETTINGS
// ─────────────────────────────────────────────────────────────────────────────

function InfoRow({ label, value }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "11px 0", borderBottom: "1px solid rgba(255,255,255,0.05)",
    }}>
      <span style={{ fontSize: 12, color: "#4a4a4a" }}>{label}</span>
      <span style={{ fontSize: 13, color: "#a0a0a0", fontWeight: 500 }}>{value}</span>
    </div>
  );
}

function SettingsSection({ user }) {
  return (
    <FadeIn delay={0.04}>
      <div id="settings">
        <div style={{ marginBottom: 24 }}>
          <EyebrowLabel>PREFERENCES</EyebrowLabel>
          <h2 style={{ ...SECTION_HEAD, marginBottom: 5 }}>Settings</h2>
          <p style={{ fontSize: 13, color: "#484848", lineHeight: 1.6 }}>Manage your profile, preferences, and account security.</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <FadeIn delay={0.04}><ProfileCard /></FadeIn>
          <FadeIn delay={0.07}><LearningPreferencesCard /></FadeIn>
          <FadeIn delay={0.10}><AccountSettingsCard user={user} /></FadeIn>
          <FadeIn delay={0.13}><ProgressSettingsCard /></FadeIn>
        </div>
      </div>
    </FadeIn>
  );
}

function ProfileCard() {
  const { user } = useContext(UserContext);
  const [form, setForm] = useState({
    name: user?.fullName ?? "",
    email: user?.email ?? "",
    bio: "Full-stack learner building real products.",
    college: "VIT VELLORE",
    github: "https://github.com/debjit",
    linkedin: "https://linkedin.com/in/debjit",
  });
  const [saved, setSaved] = useState(false);
  function handleSave() { setSaved(true); setTimeout(() => setSaved(false), 2200); }

  return (
    <Panel elevation={1} style={{ padding: "26px 24px" }}>
      <SettingsCardHeader icon={User} color={C.green} title="Profile Information" sub="Update your public profile details" />
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 22 }}>
        <div style={{
          width: 52, height: 52, borderRadius: "50%", flexShrink: 0,
          background: "linear-gradient(135deg, #6EE7B7, #818CF8)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18, fontWeight: 800, color: "#071A12",
          boxShadow: "0 0 0 3px rgba(110,231,183,0.15)",
        }}>
          {user?.fullName?.charAt(0).toUpperCase()}
        </div>
        <div>
          <p style={{ fontSize: 12, color: "#a0a0a0", fontWeight: 500, marginBottom: 4 }}>Profile Picture</p>
          <p style={{ fontSize: 11, color: "#4a4a4a", marginBottom: 8 }}>JPG, PNG or GIF · Max 2 MB</p>
          <GhostBtn style={{ fontSize: 11, padding: "5px 12px" }}><Camera size={12} /> Upload photo</GhostBtn>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {[
          { key: "name", label: "Full Name", type: "text", placeholder: "Your name" },
          { key: "email", label: "Email Address", type: "email", placeholder: "you@example.com" },
          { key: "college", label: "College / University", type: "text", placeholder: "Your institution" },
          { key: "bio", label: "Bio", type: "text", placeholder: "A short bio…", full: true },
          { key: "github", label: "GitHub URL", type: "url", placeholder: "https://github.com/…", full: true },
          { key: "linkedin", label: "LinkedIn URL", type: "url", placeholder: "https://linkedin.com/…", full: true },
        ].map(({ key, label, type, placeholder, full }) => (
          <div key={key} style={{ gridColumn: full ? "1 / -1" : undefined }}>
            <label style={labelStyle}>{label}</label>
            <input type={type} value={form[key]} placeholder={placeholder}
              onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = "rgba(110,231,183,0.32)")}
              onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.07)")}
            />
          </div>
        ))}
      </div>
      <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 12 }}>
        <PrimaryBtn onClick={handleSave}>{saved ? <><Check size={13} /> Saved!</> : "Update Profile"}</PrimaryBtn>
        {saved && <span style={{ fontSize: 12, color: C.green }}>Changes saved.</span>}
      </div>
    </Panel>
  );
}

function LearningPreferencesCard() {
  const [prefs, setPrefs] = useState({ career: "Full Stack Developer", skill: "Intermediate" });
  const [saved, setSaved] = useState(false);
  const skillColors = { Beginner: C.green, Intermediate: C.amber, Advanced: C.indigo };
  function handleSave() { setSaved(true); setTimeout(() => setSaved(false), 2200); }

  return (
    <Panel elevation={1} style={{ padding: "26px 24px" }}>
      <SettingsCardHeader icon={BookOpenCheck} color={C.indigo} title="Project Preferences" sub="Personalise your experience" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <label style={labelStyle}>Career Path</label>
          <div style={{ position: "relative" }}>
            <select value={prefs.career} onChange={e => setPrefs(p => ({ ...p, career: e.target.value }))}
              style={{ ...inputStyle, appearance: "none", cursor: "pointer", color: "#d0d0d0" }}
              onFocus={e => (e.target.style.borderColor = "rgba(129,140,248,0.4)")}
              onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.07)")}>
              {["Frontend Developer", "Full Stack Developer", "Java Developer", "AI / ML Engineer"].map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
            <ChevronRight size={11} color="#444" style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%) rotate(90deg)", pointerEvents: "none" }} />
          </div>
        </div>
        <div>
          <label style={labelStyle}>Skill Level</label>
          <div style={{ display: "flex", gap: 7 }}>
            {["Beginner", "Intermediate", "Advanced"].map(lvl => {
              const isActive = prefs.skill === lvl;
              const col = skillColors[lvl];
              return (
                <button key={lvl} onClick={() => setPrefs(p => ({ ...p, skill: lvl }))}
                  style={{
                    flex: 1, padding: "8px 4px", borderRadius: 8, fontSize: 11,
                    fontWeight: isActive ? 600 : 400,
                    background: isActive ? col + "14" : "transparent",
                    border: `1px solid ${isActive ? col + "38" : "rgba(255,255,255,0.07)"}`,
                    color: isActive ? col : "#4a4a4a",
                    cursor: "pointer", transition: "all 0.18s", fontFamily: "inherit",
                  }}>
                  {lvl}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 12 }}>
        <PrimaryBtn onClick={handleSave}>{saved ? <><Check size={13} /> Saved!</> : "Save Preferences"}</PrimaryBtn>
        {saved && <span style={{ fontSize: 12, color: C.green }}>Preferences updated.</span>}
      </div>
    </Panel>
  );
}

function AccountSettingsCard() {
  const { user, setUser } = useContext(UserContext);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try { await api.post("/api/v1/users/logout", {}); } catch (e) { console.error(e); }
    finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null); navigate("/");
    }
  };

  return (
    <Panel elevation={1} style={{ padding: "26px 24px" }}>
      <SettingsCardHeader icon={KeyRound} color={C.amber} title="Account Settings" sub="Manage your account security" />
      <InfoRow label="Email Address" value={user?.email} />
      <InfoRow label="Account Role" value={user?.role === "admin" ? "Administrator" : "User"} />
      <div style={{ marginTop: 18, display: "flex", flexWrap: "wrap", gap: 10 }}>
        <GhostBtn><KeyRound size={13} /> Change Password</GhostBtn>
        <GhostBtn onClick={handleLogout}><User size={13} /> Logout</GhostBtn>
        {!showConfirm ? (
          <DangerBtn onClick={() => setShowConfirm(true)}><Trash2 size={13} /> Delete Account</DangerBtn>
        ) : (
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "9px 14px", borderRadius: 9, width: "100%",
            border: "1px solid rgba(239,68,68,0.28)",
            background: "rgba(239,68,68,0.05)",
          }}>
            <span style={{ fontSize: 12, color: "#FCA5A5", flex: 1 }}>This action is irreversible. Are you sure?</span>
            <DangerBtn style={{ padding: "5px 12px", fontSize: 12 }}>Yes, delete</DangerBtn>
            <GhostBtn onClick={() => setShowConfirm(false)} style={{ padding: "5px 12px", fontSize: 12 }}>Cancel</GhostBtn>
          </div>
        )}
      </div>
    </Panel>
  );
}

function ProgressSettingsCard() {
  const [done, setDone] = useState(false);
  function handleReset() { setDone(true); setTimeout(() => setDone(false), 2500); }

  return (
    <Panel elevation={1} style={{ padding: "26px 24px" }}>
      <SettingsCardHeader icon={RotateCcw} color={C.pink} title="Progress Settings" sub="Reset your tracked progress" />
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 16px", borderRadius: 11,
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div>
          <p style={{ fontSize: 13, fontWeight: 500, color: "#c0c0c0", marginBottom: 3 }}>Reset Achievement Progress</p>
          <p style={{ fontSize: 11, color: "#484848" }}>Removes all earned badges and milestone data.</p>
        </div>
        {done
          ? <span style={{ fontSize: 11, color: C.green, display: "flex", alignItems: "center", gap: 4, whiteSpace: "nowrap" }}><Check size={12} /> Done</span>
          : <DangerBtn onClick={handleReset} style={{ padding: "7px 14px", fontSize: 12, whiteSpace: "nowrap" }}><RotateCcw size={12} /> Reset</DangerBtn>}
      </div>
    </Panel>
  );
}

// Shared settings card header
function SettingsCardHeader({ icon: Icon, color, title, sub }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
      <div style={{
        width: 32, height: 32, borderRadius: 9, flexShrink: 0,
        background: color + "12", border: `1px solid ${color}22`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon size={14} color={color} />
      </div>
      <div>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: "#d0d0d0" }}>{title}</h3>
        <p style={{ fontSize: 11, color: "#484848", marginTop: 2 }}>{sub}</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const { user, loading } = useContext(UserContext);
  const [active, setActive] = useState("home");
  const [collapsed, setCollapsed] = useState(false);
  const scrollContainerRef = useRef(null);
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { getDashboardSummary().then(setData); }, []);

  if (loading) return <Loader size="lg" text="Authenticating..." fullScreen />;
  if (!data) return null;

  // paths destructured but intentionally not rendered
  const { stats, paths, projects, activity, achievements } = data;

  if (!user) {
    return (
      <div style={{ minHeight: "100vh", background: "#090909", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: "center", maxWidth: 360, padding: 40 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14, margin: "0 auto 24px",
            background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.14)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Shield size={20} color="rgba(239,68,68,0.65)" />
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 600, color: "#f0f0f0", marginBottom: 10 }}>Access Required</h1>
          <p style={{ color: "#3a3a3a", fontSize: 14, marginBottom: 24, lineHeight: 1.65 }}>
            Sign in to access your dashboard, projects, achievements and progress.
          </p>
          <a href="/login" style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "9px 20px", borderRadius: 9,
            background: `linear-gradient(135deg, ${C.green}, #55C49A)`,
            color: "#071A12", fontSize: 13, fontWeight: 700, textDecoration: "none",
          }}>
            <ChevronLeft size={14} strokeWidth={2.5} /> Log in
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh", background: "#090909",
      color: "#d0d0d0", fontFamily: "'DM Sans', sans-serif",
      display: "flex",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { overflow-x: hidden; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #090909; }
        ::-webkit-scrollbar-thumb { background: #1e1e1e; border-radius: 2px; }
        @keyframes pulseGreen {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(110,231,183,0.4); }
          50% { opacity: 0.6; box-shadow: 0 0 0 4px rgba(110,231,183,0); }
        }
        input::placeholder { color: #333; }
        input, select, button { box-sizing: border-box; }
        select option { background: #111; color: #d0d0d0; }
        @media (max-width: 960px) {
          .dash-two-col { grid-template-columns: 1fr !important; }
          .dash-hero-panel { max-width: 100% !important; }
          .dash-quick-strip { grid-template-columns: repeat(2, 1fr) !important; }
          .dash-projects-grid { grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)) !important; }
        }
        @media (max-width: 600px) {
          .dash-main-pad { padding: 22px 16px 0 !important; }
          .dash-projects-grid { grid-template-columns: 1fr !important; }
          .dash-quick-strip { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      {/* Global ambient layer */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)",
          backgroundSize: "64px 64px", opacity: 0.5,
        }} />
        <div style={{ position: "absolute", top: "0%", left: "20%", width: 700, height: 500, background: `radial-gradient(ellipse, ${C.green}08 0%, transparent 65%)` }} />
        <div style={{ position: "absolute", top: "45%", right: "2%", width: 500, height: 400, background: `radial-gradient(ellipse, ${C.indigo}07 0%, transparent 65%)` }} />
        <div style={{ position: "absolute", bottom: "5%", left: "35%", width: 400, height: 250, background: `radial-gradient(ellipse, ${C.amber}05 0%, transparent 70%)` }} />
      </div>

      <Sidebar
        active={active} setActive={setActive}
        collapsed={collapsed} setCollapsed={setCollapsed}
        scrollContainerRef={scrollContainerRef}
      />

      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", position: "relative" }}>
        <div style={{ position: "relative", zIndex: 20 }}>
          <Header />
        </div>

        <div
          ref={scrollContainerRef}
          style={{ flex: 1, overflowY: "auto", position: "relative", zIndex: 10, maxHeight: "calc(100vh - 63px)" }}>

          {/* HERO */}
          <WelcomeHero stats={stats} />

          {/* MAIN CONTENT */}
          <div className="dash-main-pad" style={{ padding: "38px 32px 0" }}>

            {/* Quick actions */}
            <div style={{ marginBottom: 38 }}>
              <QuickActions />
            </div>

            {/* Two-col layout */}
            <div className="dash-two-col" style={{
              display: "grid", gridTemplateColumns: "1fr 330px",
              gap: 28, alignItems: "start", marginBottom: 48,
            }}>

              {/* ─── Primary column ─── */}
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>

                {/* CONTINUE BUILDING — dominant section */}
                <section style={{ marginBottom: 44 }}>
                  <FadeIn style={{ marginBottom: 18 }}>
                    <EyebrowLabel>CONTINUE WHERE YOU LEFT OFF</EyebrowLabel>
                    <h2 style={{ ...SECTION_HEAD, fontSize: 24 }}>Current project</h2>
                  </FadeIn>
                  {/* Wrap DashboardCard in a subtle elevated shell */}
                  <div style={{
                    borderRadius: 16, overflow: "hidden",
                    boxShadow: `0 0 0 1px rgba(255,255,255,0.07), 0 16px 48px rgba(0,0,0,0.35), 0 0 80px ${C.green}06`,
                  }}>
                    <DashboardCard />
                  </div>
                </section>

                <SectionDivider />

                {/* PROJECTS */}
                <section style={{ marginBottom: 44 }}>
                  <FadeIn style={{ marginBottom: 18 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 10 }}>
                      <div>
                        <EyebrowLabel>PROJECTS</EyebrowLabel>
                        <h2 style={SECTION_HEAD}>My projects</h2>
                      </div>
                      <GhostBtn onClick={() => navigate("/projects")} style={{ fontSize: 12, padding: "6px 14px" }}>
                        View all <ArrowRight size={12} />
                      </GhostBtn>
                    </div>
                  </FadeIn>
                  {projects.length === 0 ? (
                    <EmptyState icon={FolderOpen} color={C.green} title="No projects yet"
                      body="Browse available projects and enroll to get started."
                      action={<PrimaryBtn onClick={() => navigate("/projects")}><FolderOpen size={13} /> Browse Projects</PrimaryBtn>} />
                  ) : (
                    <div className="dash-projects-grid" style={{
                      display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 14,
                    }}>
                      {projects.map((e, i) => <ProjectCard key={e._id} p={e.project} i={i} />)}
                    </div>
                  )}
                </section>

                <SectionDivider />

                {/* ACHIEVEMENTS */}
                <section style={{ marginBottom: 44 }}>
                  <AchievementsSection achievements={achievements} />
                </section>

                <SectionDivider />

                {/* SETTINGS */}
                <section style={{ marginBottom: 44 }}>
                  <SettingsSection user={user} />
                </section>
              </div>

              {/* ─── Insight rail ─── */}
              <div style={{ display: "flex", flexDirection: "column", gap: 24, position: "sticky", top: 24 }}>

                {/* Analytics */}
                <AnalyticsPanel stats={stats} achievements={achievements} projects={projects} />

                <div style={{ height: 1, background: "rgba(255,255,255,0.05)" }} />

                {/* Activity */}
                <ActivityFeed activity={activity} />

                <div style={{ height: 1, background: "rgba(255,255,255,0.05)" }} />

                {/* Ship CTA */}
                <FadeIn delay={0.12}>
                  <div style={{
                    borderRadius: 14, padding: "22px 18px", textAlign: "center",
                    border: `1px solid rgba(110,231,183,0.12)`,
                    background: "rgba(110,231,183,0.02)",
                    position: "relative", overflow: "hidden",
                  }}>
                    <div style={{
                      position: "absolute", top: "50%", left: "50%",
                      transform: "translate(-50%,-50%)",
                      width: "160%", height: "160%",
                      background: `radial-gradient(ellipse, ${C.green}07 0%, transparent 60%)`,
                      pointerEvents: "none",
                    }} />
                    <div style={{ position: "relative", zIndex: 1 }}>
                      <div style={{
                        width: 38, height: 38, borderRadius: 10,
                        background: `${C.green}10`, border: `1px solid ${C.green}22`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        margin: "0 auto 12px",
                      }}>
                        <Rocket size={16} color={C.green} />
                      </div>
                      <div style={{
                        fontFamily: "'Instrument Serif', serif", fontSize: 16,
                        color: "#d8d8d8", marginBottom: 7, letterSpacing: "-0.01em",
                      }}>Ready to build?</div>
                      <p style={{ fontSize: 11.5, color: "#484848", marginBottom: 16, lineHeight: 1.65 }}>
                        Pick your next project and start shipping something real.
                      </p>
                      <PrimaryBtn onClick={() => navigate("/projects")} style={{ width: "100%", justifyContent: "center" }}>
                        <FolderOpen size={13} /> Browse Projects
                      </PrimaryBtn>
                    </div>
                  </div>
                </FadeIn>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer style={{
            padding: "20px 32px", borderTop: "1px solid rgba(255,255,255,0.05)",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            flexWrap: "wrap", gap: 12,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <div style={{
                width: 20, height: 20, borderRadius: 5,
                background: "linear-gradient(135deg, #6EE7B7, #818CF8)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Hammer size={10} color="#071A12" />
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#888" }}>BuildWise</span>
            </div>
            <span style={{ fontSize: 11, color: "#2a2a2a" }}>© 2025 BuildWise. All rights reserved.</span>
            <div style={{ display: "flex", gap: 16 }}>
              {["Help", "Privacy", "Status"].map(l => (
                <span key={l} style={{ fontSize: 11, color: "#2e2e2e", cursor: "pointer", transition: "color 0.15s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#666")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#2e2e2e")}>{l}</span>
              ))}
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}