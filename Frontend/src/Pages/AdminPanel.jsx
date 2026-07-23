import { useState, useEffect, useRef, useContext } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Loader from "../Components/Loader";
import { UserContext } from "../Context/UserContext";
import axios from "axios";
import {
  LayoutDashboard, Users, FolderOpen, Trophy, Settings,
  Bell, Activity, Shield, Plus, Search, Edit2, Trash2,
  Eye, X, Check, AlertTriangle, TrendingUp, Zap,
  Database, Cpu, Globe, BarChart2, RefreshCw,
  UserCheck, UserX, ChevronRight, ChevronLeft, ArrowUpRight,
  CheckCircle, Menu, Hammer, Layers,
} from "lucide-react";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  updateUserRole,
  getAdminDashboardSummary,
  getAdminProjects,
  getAdminUsers,
  getAdminAchievements,
} from "../Services/adminService";
import ProjectBuilderDrawer from "./ProjectBuilderDrawer";

// ─── DESIGN TOKENS (mirrors Dashboard / theme.js) ─────────────────────────────
const C = {
  green: "#6EE7B7",
  indigo: "#818CF8",
  amber: "#FCD34D",
  pink: "#F472B6",
  bg: "#090909",
};

const EASE = [0.22, 1, 0.36, 1];

const SECTION_HEAD = {
  fontFamily: "'Instrument Serif', serif",
  fontSize: 22, color: "#f2f2f2",
  letterSpacing: "-0.018em", lineHeight: 1.2,
  margin: 0,
};

// ─── NAV ──────────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "projects", label: "Projects", icon: FolderOpen },
  { id: "users", label: "Users", icon: Users },
  { id: "analytics", label: "Analytics", icon: BarChart2 },
  { id: "moderation", label: "Moderation", icon: Shield },
  { id: "achievements", label: "Achievements", icon: Trophy },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "activity", label: "Activity", icon: Activity },
];

// ─── HOOKS ────────────────────────────────────────────────────────────────────
function useHover() {
  const [hov, setHov] = useState(false);
  return [hov, { onMouseEnter: () => setHov(true), onMouseLeave: () => setHov(false) }];
}

// ─── ANIMATION PRIMITIVES ─────────────────────────────────────────────────────
function FadeIn({ children, delay = 0, y = 16, style = {} }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: EASE }}
      style={style}>
      {children}
    </motion.div>
  );
}

// ─── PANEL (glass surface, three elevations) ──────────────────────────────────
function Panel({ children, style = {}, elevation = 1, accent, onClick }) {
  const [hov, handlers] = useHover();
  const bases = ["rgba(255,255,255,0.025)", "rgba(255,255,255,0.04)", "rgba(255,255,255,0.065)"];
  const hovBg = ["rgba(255,255,255,0.04)", "rgba(255,255,255,0.06)", "rgba(255,255,255,0.09)"];
  const shadows = ["none", "0 2px 16px rgba(0,0,0,0.3)", "0 8px 32px rgba(0,0,0,0.4)"];
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

// ─── BUTTON PRIMITIVES ────────────────────────────────────────────────────────
function PrimaryBtn({ children, onClick, style = {}, icon: Icon }) {
  const [hov, handlers] = useHover();
  return (
    <button onClick={onClick} {...handlers}
      style={{
        display: "inline-flex", alignItems: "center", gap: 7,
        padding: "8px 16px",
        background: hov
          ? `linear-gradient(135deg, #7EEFC0, ${C.green})`
          : `linear-gradient(135deg, ${C.green}, #55C49A)`,
        color: "#071A12", fontWeight: 700, fontSize: 12,
        borderRadius: 9, border: "none", cursor: "pointer",
        transition: "all 0.22s cubic-bezier(0.22, 1, 0.36, 1)",
        transform: hov ? "translateY(-1px)" : "translateY(0)",
        boxShadow: hov ? `0 8px 24px ${C.green}30` : `0 2px 8px ${C.green}18`,
        letterSpacing: "-0.01em", fontFamily: "inherit", ...style,
      }}>
      {Icon && <Icon size={12} />}
      {children}
    </button>
  );
}

function GhostBtn({ children, onClick, style = {}, icon: Icon }) {
  const [hov, handlers] = useHover();
  return (
    <button onClick={onClick} {...handlers}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "7px 14px",
        background: hov ? "rgba(255,255,255,0.06)" : "transparent",
        color: hov ? "#d0d0d0" : "#666", fontSize: 12, fontWeight: 400,
        borderRadius: 9,
        border: `1px solid ${hov ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.08)"}`,
        cursor: "pointer", transition: "all 0.2s ease", fontFamily: "inherit", ...style,
      }}>
      {Icon && <Icon size={11} />}
      {children}
    </button>
  );
}

function DangerBtn({ children, onClick, style = {}, icon: Icon }) {
  const [hov, handlers] = useHover();
  return (
    <button onClick={onClick} {...handlers}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "7px 14px",
        background: hov ? "rgba(239,68,68,0.1)" : "transparent",
        color: hov ? "#FCA5A5" : "#555", fontSize: 12, fontWeight: 400,
        borderRadius: 9,
        border: `1px solid ${hov ? "rgba(239,68,68,0.32)" : "rgba(255,255,255,0.08)"}`,
        cursor: "pointer", transition: "all 0.2s ease", fontFamily: "inherit", ...style,
      }}>
      {Icon && <Icon size={11} />}
      {children}
    </button>
  );
}

// ─── EYEBROW LABEL ────────────────────────────────────────────────────────────
function EyebrowLabel({ children }) {
  return (
    <p style={{
      fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase",
      color: C.green, fontWeight: 600, marginBottom: 5, margin: "0 0 5px",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {children}
    </p>
  );
}

function SectionDivider() {
  return (
    <div style={{
      height: 1,
      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.06) 70%, transparent)",
      margin: "0 0 32px",
    }} />
  );
}

// ─── COUNTER ──────────────────────────────────────────────────────────────────
function Counter({ target }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let v = 0;
    const step = Math.ceil((target || 0) / 55);
    const t = setInterval(() => {
      v += step;
      if (v >= target) { setCount(target); clearInterval(t); }
      else setCount(v);
    }, 16);
    return () => clearInterval(t);
  }, [target]);
  return <>{count.toLocaleString()}</>;
}

// ─── SEARCH BAR ───────────────────────────────────────────────────────────────
function SearchInput({ value, onChange, placeholder }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: "relative", flex: 1 }}>
      <Search size={13} color={focused ? C.green : "#444"}
        style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", transition: "color 0.2s" }} />
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder || "Search…"}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%", padding: "8px 12px 8px 34px",
          background: focused ? "rgba(255,255,255,0.055)" : "rgba(255,255,255,0.03)",
          border: `1px solid ${focused ? `${C.green}40` : "rgba(255,255,255,0.07)"}`,
          borderRadius: 9, color: "#d0d0d0", fontSize: 13,
          outline: "none", fontFamily: "inherit", boxSizing: "border-box",
          transition: "all 0.2s ease",
        }}
      />
    </div>
  );
}

// ─── BADGE ────────────────────────────────────────────────────────────────────
function Badge({ label, type = "neutral" }) {
  const map = {
    Beginner: { bg: `${C.green}14`, color: C.green },
    Intermediate: { bg: `${C.indigo}14`, color: C.indigo },
    Advanced: { bg: "#ef444414", color: "#FCA5A5" },
    admin: { bg: "#f472b614", color: C.pink },
    moderator: { bg: `${C.indigo}14`, color: C.indigo },
    user: { bg: "rgba(255,255,255,0.06)", color: "#888" },
    published: { bg: `${C.green}14`, color: C.green },
    Draft: { bg: "rgba(255,255,255,0.06)", color: "#777" },
    Review: { bg: `${C.amber}12`, color: C.amber },
    neutral: { bg: "rgba(255,255,255,0.06)", color: "#777" },
  };
  const s = map[label] || map.neutral;
  return (
    <span style={{
      fontSize: 10, fontWeight: 600, padding: "3px 8px",
      borderRadius: 6, background: s.bg, color: s.color,
      letterSpacing: "0.04em", whiteSpace: "nowrap",
    }}>{label}</span>
  );
}

// ─── CUSTOM TOOLTIP ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#0d0f14",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 12, padding: "8px 12px", fontSize: 12,
      boxShadow: "0 8px 32px rgba(0,0,0,0.7)",
      backdropFilter: "blur(12px)",
    }}>
      <p style={{ fontWeight: 500, color: "rgba(255,255,255,0.45)", marginBottom: 4, fontSize: 11 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: C.green, margin: 0, fontFamily: "'DM Mono', monospace", fontWeight: 600 }}>
          {p.name}: {p.value?.toLocaleString()}
        </p>
      ))}
    </div>
  );
};

// ─── NOTIFICATION PANEL ───────────────────────────────────────────────────────
function NotificationPanel({ open, onClose, notifications = [] }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <div style={{ position: "fixed", inset: 0, zIndex: 40 }} onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            style={{
              position: "absolute", right: 0, top: 48, zIndex: 50,
              width: 280, borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.09)",
              background: "#0d0f14",
              boxShadow: "0 16px 48px rgba(0,0,0,0.7)",
              overflow: "hidden",
            }}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>Notifications</span>
              <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#555", display: "flex" }}
                onMouseEnter={e => e.currentTarget.style.color = "#aaa"}
                onMouseLeave={e => e.currentTarget.style.color = "#555"}>
                <X size={13} />
              </button>
            </div>
            {notifications.map((n) => (
              <div key={n.id} style={{
                padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)",
                transition: "background 0.15s",
              }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.025)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.65)" }}>{n.message}</p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 3 }}>{n.time}</p>
              </div>
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
function Sidebar({ active, onSelect, collapsed, onToggle, user }) {
  return (
    <motion.aside
      initial={{ x: -24, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: EASE }}
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
        padding: "16px 13px 14px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8, flexShrink: 0,
          background: "linear-gradient(135deg, #6EE7B7 0%, #818CF8 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 2px 10px ${C.green}25`,
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
        {!collapsed && (
          <button onClick={onToggle}
            style={{
              marginLeft: "auto", background: "none", border: "none",
              cursor: "pointer", color: "#444", display: "flex",
              flexShrink: 0, padding: 4, borderRadius: 6, transition: "color 0.18s",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "#999")}
            onMouseLeave={e => (e.currentTarget.style.color = "#444")}>
            <Menu size={14} />
          </button>
        )}
      </div>

      {/* Admin badge */}
      {!collapsed && (
        <div style={{ padding: "8px 13px 6px" }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            fontSize: 10, fontWeight: 600, letterSpacing: "0.08em",
            color: C.green, background: `${C.green}10`,
            border: `1px solid ${C.green}20`,
            borderRadius: 6, padding: "3px 8px",
          }}>
            <Shield size={9} strokeWidth={2.5} />
            ADMIN PANEL
          </span>
        </div>
      )}

      {/* Nav */}
      <nav style={{
        flex: 1, padding: "8px 7px",
        display: "flex", flexDirection: "column", gap: 2,
        overflowY: "auto",
      }}>
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <SidebarNavItem key={id} id={id} label={label} Icon={Icon}
              isActive={isActive} collapsed={collapsed} onClick={() => onSelect(id)} />
          );
        })}
      </nav>

      {/* Collapsed toggle */}
      {collapsed && (
        <div style={{ padding: "8px 7px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <button onClick={onToggle}
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
              padding: "8px", background: "none", border: "none", cursor: "pointer",
              color: "#444", borderRadius: 8, transition: "color 0.18s",
            }}
            onMouseEnter={e => e.currentTarget.style.color = "#999"}
            onMouseLeave={e => e.currentTarget.style.color = "#444"}>
            <Menu size={14} />
          </button>
        </div>
      )}

      {/* User */}
      <div style={{ padding: "9px 7px 13px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: collapsed ? "8px" : "7px 10px",
          borderRadius: 9, cursor: "pointer", transition: "background 0.18s",
        }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
          <div style={{
            width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
            background: `linear-gradient(135deg, ${C.green}, ${C.indigo})`,
            color: "#071A12", fontSize: 12, fontWeight: 800,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {user?.fullName?.[0]?.toUpperCase()}
          </div>
          {!collapsed && (
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontSize: 12, fontWeight: 600, color: "#d0d0d0",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}>{user?.fullName}</div>
              <div style={{ fontSize: 10, color: "#444", marginTop: 1 }}>Administrator</div>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
}

function SidebarNavItem({ id, label, Icon, isActive, collapsed, onClick }) {
  const [hov, handlers] = useHover();
  return (
    <button onClick={onClick} {...handlers}
      title={collapsed ? label : undefined}
      style={{
        display: "flex", alignItems: "center",
        gap: collapsed ? 0 : 10,
        padding: collapsed ? "10px" : "8px 11px",
        justifyContent: collapsed ? "center" : "flex-start",
        borderRadius: 9,
        border: `1px solid ${isActive ? `${C.green}28` : "transparent"}`,
        background: isActive ? `${C.green}0C` : hov ? "rgba(255,255,255,0.04)" : "transparent",
        color: isActive ? C.green : hov ? "#c8c8c8" : "#666",
        transition: "all 0.18s ease", width: "100%", textAlign: "left",
        cursor: "pointer", fontFamily: "inherit",
      }}>
      <Icon size={15} style={{ flexShrink: 0 }} />
      {!collapsed && (
        <span style={{ fontSize: 13, fontWeight: isActive ? 500 : 400, whiteSpace: "nowrap" }}>
          {label}
        </span>
      )}
      {!collapsed && isActive && (
        <div style={{
          marginLeft: "auto", width: 5, height: 5, borderRadius: "50%",
          background: C.green, boxShadow: `0 0 7px ${C.green}`,
        }} />
      )}
    </button>
  );
}

// ─── HEADER ───────────────────────────────────────────────────────────────────
function Header({ section, user, notifications, onAddProject, onGoUsers, onNotifToggle, showNotifs, onNotifClose }) {
  const label = NAV_ITEMS.find(n => n.id === section)?.label || "Overview";
  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: EASE }}
      style={{
        padding: "13px 28px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", gap: 16,
        background: "rgba(8,8,8,0.7)",
        backdropFilter: "blur(28px)",
        position: "sticky", top: 0, zIndex: 30,
      }}>

      {/* Page title */}
      <div style={{ flex: 1 }}>
        <h1 style={{
          fontFamily: "'Instrument Serif', serif",
          fontSize: 18, color: "#f2f2f2",
          letterSpacing: "-0.018em", margin: 0,
        }}>{label}</h1>
        <p style={{ fontSize: 11, color: "#3a3a3a", marginTop: 2 }}>{today}</p>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <PrimaryBtn onClick={onAddProject} icon={Plus}>Add Project</PrimaryBtn>
        <GhostBtn onClick={onGoUsers} icon={Users}>Manage Users</GhostBtn>

        {/* Notif bell */}
        <div style={{ position: "relative" }}>
          <button onClick={onNotifToggle}
            style={{
              position: "relative", padding: 8, borderRadius: 9,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "transparent", cursor: "pointer",
              color: "rgba(255,255,255,0.5)", display: "flex",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}>
            <Bell size={15} />
            {notifications.length > 0 && (
              <span style={{
                position: "absolute", top: -4, right: -4,
                width: 16, height: 16, borderRadius: "50%",
                background: C.green, color: "#071A12",
                fontSize: 9, fontWeight: 800,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {notifications.length}
              </span>
            )}
          </button>
          <NotificationPanel open={showNotifs} onClose={onNotifClose} notifications={notifications} />
        </div>

        {/* Avatar */}
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          background: `linear-gradient(135deg, ${C.green}, ${C.indigo})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 12, fontWeight: 800, color: "#071A12", flexShrink: 0,
        }}>
          {user?.fullName?.[0]?.toUpperCase() || "A"}
        </div>
      </div>
    </motion.header>
  );
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, delay = 0, accent }) {
  const [hov, handlers] = useHover();
  const col = accent || C.green;
  return (
    <FadeIn delay={delay}>
      <div {...handlers}
        style={{
          padding: "20px 18px",
          background: hov ? "rgba(255,255,255,0.055)" : "rgba(255,255,255,0.035)",
          border: `1px solid ${hov ? col + "28" : "rgba(255,255,255,0.07)"}`,
          borderRadius: 14,
          boxShadow: hov ? `0 8px 32px rgba(0,0,0,0.35), 0 0 40px ${col}08` : "0 2px 16px rgba(0,0,0,0.2)",
          transition: "all 0.28s cubic-bezier(0.22, 1, 0.36, 1)",
          transform: hov ? "translateY(-2px)" : "translateY(0)",
          cursor: "default",
        }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: col + "12", border: `1px solid ${col}22`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Icon size={14} color={col} />
          </div>
          <ArrowUpRight size={12} color="rgba(255,255,255,0.15)" />
        </div>
        <p style={{
          fontFamily: "'DM Mono', monospace", fontSize: 26, fontWeight: 600,
          color: "#f2f2f2", letterSpacing: "-0.03em", lineHeight: 1, margin: 0,
        }}>
          <Counter target={typeof value === "number" ? value : 0} />
        </p>
        <p style={{ fontSize: 11.5, color: "#555", marginTop: 6 }}>{label}</p>
      </div>
    </FadeIn>
  );
}

// ─── SECTION HEADER ───────────────────────────────────────────────────────────
function SectionHeader({ eyebrow, title, subtitle, action }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 20 }}>
      <div>
        {eyebrow && <EyebrowLabel>{eyebrow}</EyebrowLabel>}
        <h2 style={{ ...SECTION_HEAD, fontSize: 19 }}>{title}</h2>
        {subtitle && <p style={{ fontSize: 12, color: "#555", marginTop: 4 }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

// ─── FILTER PILLS ─────────────────────────────────────────────────────────────
function FilterPill({ label, active, onClick }) {
  const [hov, handlers] = useHover();
  return (
    <button onClick={onClick} {...handlers}
      style={{
        padding: "6px 13px", fontSize: 11.5, fontWeight: active ? 600 : 400,
        borderRadius: 8, border: `1px solid ${active ? C.green + "40" : "rgba(255,255,255,0.08)"}`,
        background: active ? `${C.green}10` : hov ? "rgba(255,255,255,0.04)" : "transparent",
        color: active ? C.green : hov ? "#c0c0c0" : "#666",
        cursor: "pointer", transition: "all 0.18s ease", fontFamily: "inherit",
      }}>
      {label}
    </button>
  );
}

// ─── PAGINATION ───────────────────────────────────────────────────────────────
function Pagination({ page, totalPages, setPage }) {
  if (totalPages <= 1) return null;

  // Build page number list with ellipsis: [1, ..., 4, 5, 6, ..., 20]
  const getPages = () => {
    const delta = 1; // pages on each side of current
    const pages = [];
    const left = page - delta;
    const right = page + delta;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= left && i <= right)) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }
    return pages;
  };

  const btnBase = {
    minWidth: 28, height: 28, borderRadius: 8, fontSize: 12,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "transparent", color: "#555",
    cursor: "pointer", transition: "all 0.15s",
    fontFamily: "inherit", display: "flex",
    alignItems: "center", justifyContent: "center",
    padding: "0 6px",
  };

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, padding: "18px 0 4px", flexWrap: "wrap" }}>
      {/* Prev */}
      <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
        style={{ ...btnBase, opacity: page === 1 ? 0.3 : 1, cursor: page === 1 ? "not-allowed" : "pointer" }}>
        <ChevronLeft size={13} />
      </button>

      {getPages().map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} style={{ fontSize: 12, color: "#3a3a3a", padding: "0 4px" }}>…</span>
        ) : (
          <button key={p} onClick={() => setPage(p)}
            style={{
              ...btnBase,
              fontWeight: page === p ? 700 : 400,
              border: `1px solid ${page === p ? C.green : "rgba(255,255,255,0.08)"}`,
              background: page === p ? C.green : "transparent",
              color: page === p ? "#071A12" : "#555",
            }}>
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
        style={{ ...btnBase, opacity: page === totalPages ? 0.3 : 1, cursor: page === totalPages ? "not-allowed" : "pointer" }}>
        <ChevronRight size={13} />
      </button>

      {/* Jump to page input for large sets */}
      {totalPages > 10 && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 8 }}>
          <span style={{ fontSize: 11, color: "#3a3a3a" }}>Go to</span>
          <input
            type="number" min={1} max={totalPages}
            defaultValue={page}
            key={page}
            onKeyDown={e => {
              if (e.key === "Enter") {
                const val = Math.min(totalPages, Math.max(1, Number(e.target.value)));
                setPage(val);
              }
            }}
            style={{
              width: 44, height: 28, borderRadius: 8, fontSize: 12,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.04)", color: "#d0d0d0",
              textAlign: "center", outline: "none", fontFamily: "inherit",
            }}
          />
          <span style={{ fontSize: 11, color: "#3a3a3a" }}>of {totalPages}</span>
        </div>
      )}
    </div>
  );
}

// ─── ACHIEVEMENT MODAL ────────────────────────────────────────────────────────
function AchievementModal({ onClose, initial = null, onSave }) {
  const [form, setForm] = useState(initial || { name: "", description: "", icon: "🏆", xp: 100 });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const inputStyle = {
    width: "100%", padding: "9px 12px",
    background: "rgba(255,255,255,0.035)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 9, color: "#e5e5e5", fontSize: 13,
    outline: "none", fontFamily: "inherit", boxSizing: "border-box",
    transition: "border-color 0.2s",
  };
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
      onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.97 }}
        transition={{ duration: 0.22, ease: EASE }}
        onClick={e => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 440,
          borderRadius: 18, border: "1px solid rgba(255,255,255,0.09)",
          background: "#0d0f14", boxShadow: "0 24px 64px rgba(0,0,0,0.8)",
        }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <h3 style={{ ...SECTION_HEAD, fontSize: 16 }}>{initial ? "Edit Achievement" : "Create Achievement"}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#555", display: "flex", borderRadius: 6, padding: 4 }}
            onMouseEnter={e => e.currentTarget.style.color = "#bbb"}
            onMouseLeave={e => e.currentTarget.style.color = "#555"}>
            <X size={14} />
          </button>
        </div>
        <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { label: "Achievement Name", key: "name", placeholder: "Stack Master" },
            { label: "Description", key: "description", placeholder: "Use 5+ tech stacks" },
            { label: "Badge Icon (emoji)", key: "icon", placeholder: "🏆" },
          ].map(({ label, key, placeholder }) => (
            <div key={key}>
              <label style={{ fontSize: 10.5, color: "#555", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 500, marginBottom: 6, display: "block" }}>{label}</label>
              <input value={form[key]} onChange={e => set(key, e.target.value)} placeholder={placeholder} style={inputStyle}
                onFocus={e => e.target.style.borderColor = C.green + "60"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.07)"} />
            </div>
          ))}
          <div>
            <label style={{ fontSize: 10.5, color: "#555", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 500, marginBottom: 6, display: "block" }}>XP Reward</label>
            <input type="number" value={form.xp} onChange={e => set("xp", Number(e.target.value))} placeholder="100" style={inputStyle}
              onFocus={e => e.target.style.borderColor = C.green + "60"}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.07)"} />
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, padding: "14px 22px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <GhostBtn onClick={onClose} icon={X}>Cancel</GhostBtn>
          <PrimaryBtn onClick={() => { onSave(form); onClose(); }} icon={Check}>Save Achievement</PrimaryBtn>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── SECTIONS ─────────────────────────────────────────────────────────────────

function ProjectManagement({ projects, setProjects, totalProjects, totalPages, page, setPage, search, setSearch, filter, setFilter, onAddProject, onEditProject }) {
  const removeProject = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_APP_URI}/api/v1/projects/delete-project/${id}`);
      setProjects(prev => prev.filter(x => x._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FadeIn>
      <Panel style={{ overflow: "hidden" }}>
        <div style={{ padding: "22px 24px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <SectionHeader
            eyebrow="MANAGE"
            title="Projects"
            subtitle={`${totalProjects} total projects`}
            action={<PrimaryBtn onClick={onAddProject} icon={Plus}>Add Project</PrimaryBtn>}
          />
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search projects…" />
            <div style={{ display: "flex", gap: 6 }}>
              {["All", "Beginner", "Intermediate", "Advanced"].map(f => (
                <FilterPill key={f} label={f} active={filter === f} onClick={() => { setFilter(f); setPage(1); }} />
              ))}
            </div>
          </div>
        </div>

        <div style={{ overflowX: "auto", padding: "0 24px 8px" }}>
          <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                {["Project Name", "Category", "Difficulty", "Tech Stack", "Status", "Created", "Actions"].map(h => (
                  <th key={h} style={{ textAlign: "left", fontSize: 10, color: "#444", fontWeight: 500, padding: "12px 12px 10px 0", whiteSpace: "nowrap", letterSpacing: "0.06em", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {projects.map((p, i) => (
                  <motion.tr key={p._id}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.03 }}
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.018)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "11px 12px 11px 0", color: "rgba(255,255,255,0.85)", fontWeight: 500, whiteSpace: "nowrap" }}>{p.name}</td>
                    <td style={{ padding: "11px 12px 11px 0", color: "#555", whiteSpace: "nowrap", fontSize: 12 }}>{p.category}</td>
                    <td style={{ padding: "11px 12px 11px 0", whiteSpace: "nowrap" }}><Badge label={p.difficulty} /></td>
                    <td style={{ padding: "11px 12px 11px 0" }}>
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                        {p.stack?.map(t => (
                          <span key={t.name} style={{ fontSize: 10, padding: "2px 6px", borderRadius: 5, background: "rgba(255,255,255,0.04)", color: "#666", border: "1px solid rgba(255,255,255,0.06)" }}>{t.name}</span>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: "11px 12px 11px 0", whiteSpace: "nowrap" }}><Badge label={p.status} /></td>
                    <td style={{ padding: "11px 12px 11px 0", color: "#3a3a3a", fontSize: 11, whiteSpace: "nowrap" }}>{p.createdAt}</td>
                    <td style={{ padding: "11px 0" }}>
                      <div style={{ display: "flex", gap: 4, opacity: 0 }}
                        onMouseEnter={e => e.currentTarget.style.opacity = 1}
                        onMouseLeave={e => e.currentTarget.style.opacity = 0}
                        ref={el => {
                          if (el) {
                            const row = el.closest("tr");
                            if (row) {
                              row.addEventListener("mouseenter", () => el.style.opacity = 1);
                              row.addEventListener("mouseleave", () => el.style.opacity = 0);
                            }
                          }
                        }}>
                        <GhostBtn icon={Eye} onClick={() => window.open(`/projectdetails/${p.slug}`, "_blank")}>View</GhostBtn>
                        <GhostBtn icon={Edit2} onClick={() => onEditProject(p)}>Edit</GhostBtn>
                        <DangerBtn icon={Trash2} onClick={() => removeProject(p._id)}>Del</DangerBtn>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {projects.length === 0 && (
            <p style={{ padding: "40px 0", textAlign: "center", color: "#444", fontSize: 13 }}>No projects match your search.</p>
          )}
        </div>
        <div style={{ padding: "0 24px 20px" }}>
          <Pagination page={page} totalPages={totalPages} setPage={setPage} />
        </div>
      </Panel>
    </FadeIn>
  );
}

function UserManagement({ users, setUsers, totalUsers, totalPages, page, setPage, search, setSearch, filter, setFilter, fetchUsers }) {
  const promote = async (id) => { await updateUserRole(id, "admin"); fetchUsers(); };
  const demote = async (id) => { await updateUserRole(id, "user"); fetchUsers(); };
  const remove = (id) => setUsers(u => u.filter(x => x._id !== id));

  return (
    <FadeIn>
      <Panel style={{ padding: "22px 24px" }}>
        <SectionHeader eyebrow="MANAGE" title="Users" subtitle={`${totalUsers} registered users`} />
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 18 }}>
          <SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search users…" />
          <div style={{ display: "flex", gap: 6 }}>
            {["All", "admin", "user"].map(r => (
              <FilterPill key={r} label={r} active={filter === r} onClick={() => { setFilter(r); setPage(1); }} />
            ))}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <AnimatePresence>
            {users.map((u, i) => (
              <motion.div key={u._id}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ delay: i * 0.04, ease: EASE }}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  flexWrap: "wrap", gap: 12,
                  padding: "12px 14px", borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.05)",
                  background: "rgba(255,255,255,0.02)", transition: "border-color 0.2s, background 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.background = "rgba(255,255,255,0.035)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: "50%",
                    background: `linear-gradient(135deg, ${C.green}18, ${C.indigo}18)`,
                    border: "1px solid rgba(255,255,255,0.08)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.6)", flexShrink: 0,
                  }}>
                    {u.fullName?.[0]}
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.85)", margin: 0 }}>{u.fullName}</p>
                    <p style={{ fontSize: 11, color: "#555", margin: "2px 0 0" }}>{u.username} · {u.email}</p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <Badge label={u.role} />
                  <div style={{ display: "flex", gap: 4 }}>
                    {u.role !== "admin"
                      ? <GhostBtn icon={UserCheck} onClick={() => promote(u._id)}>Promote</GhostBtn>
                      : <GhostBtn icon={UserX} onClick={() => demote(u._id)}>Demote</GhostBtn>
                    }
                    <DangerBtn icon={Trash2} onClick={() => remove(u._id)}>Delete</DangerBtn>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {users.length === 0 && (
            <p style={{ padding: "36px 0", textAlign: "center", color: "#444", fontSize: 13 }}>No users found</p>
          )}
        </div>
        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
      </Panel>
    </FadeIn>
  );
}

// ─── EMPTY CHART PLACEHOLDER ──────────────────────────────────────────────────
function ChartEmpty({ label }) {
  return (
    <div style={{
      height: 200, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: 8,
    }}>
      <BarChart2 size={20} color="#2a2a2a" />
      <p style={{ fontSize: 11, color: "#333", margin: 0 }}>No {label} data yet</p>
    </div>
  );
}

// ─── ANALYTICS SECTION ────────────────────────────────────────────────────────
function AnalyticsSection({ chartUserGrowth = [], chartProjectCompletions = [], chartWeeklyEnrollments = [] }) {

  // ── Derived KPIs from real chart data ──
  // Total users = sum of all monthly signups (backend sends per-month counts, not cumulative)
  const totalUsersFromChart = chartUserGrowth.reduce((s, m) => s + (m.users ?? 0), 0);

  // Month-over-month growth % (last two months)
  const momGrowth = (() => {
    if (chartUserGrowth.length < 2) return null;
    const prev = chartUserGrowth[chartUserGrowth.length - 2]?.users ?? 0;
    const curr = chartUserGrowth[chartUserGrowth.length - 1]?.users ?? 0;
    if (!prev) return null;
    return (((curr - prev) / prev) * 100).toFixed(1);
  })();

  // Top project by completions
  const topProject = chartProjectCompletions.length
    ? [...chartProjectCompletions].sort((a, b) => (b.completions ?? 0) - (a.completions ?? 0))[0]
    : null;

  // Peak enrollment week
  const peakWeek = chartWeeklyEnrollments.length
    ? [...chartWeeklyEnrollments].sort((a, b) => (b.enrollments ?? 0) - (a.enrollments ?? 0))[0]
    : null;

  // Total completions across all projects
  const totalCompletions = chartProjectCompletions.reduce((s, p) => s + (p.completions ?? 0), 0);

  // KPI tiles — all derived from real data
  const kpis = [
    {
      label: "Total Signups",
      value: totalUsersFromChart ? totalUsersFromChart.toLocaleString() : "—",
      sub: momGrowth ? `+${momGrowth}% vs last month` : "across all time",
      icon: Users,
      accent: C.green,
      up: momGrowth > 0,
    },
    {
      label: "Top Project",
      value: topProject ? topProject.project : "—",
      sub: topProject ? `${(topProject.completions ?? 0).toLocaleString()} completions` : "no data yet",
      icon: TrendingUp,
      accent: C.indigo,
    },
    {
      label: "Peak Enrollment Week",
      value: peakWeek ? peakWeek.week : "—",
      sub: peakWeek ? `${(peakWeek.enrollments ?? 0).toLocaleString()} enrollments` : "no data yet",
      icon: Zap,
      accent: C.amber,
    },
    {
      label: "Total Completions",
      value: totalCompletions ? totalCompletions.toLocaleString() : "—",
      sub: `across ${chartProjectCompletions.length} projects`,
      icon: CheckCircle,
      accent: C.green,
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <FadeIn>
        <SectionHeader
          eyebrow="INSIGHTS"
          title="Analytics"
          subtitle="Real-time platform engagement data"
        />
      </FadeIn>

      {/* ── KPI Row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
        {kpis.map(({ label, value, sub, icon: Icon, accent, up }, i) => (
          <FadeIn key={label} delay={i * 0.06}>
            <div style={{
              padding: "18px 20px",
              background: "rgba(255,255,255,0.03)",
              border: `1px solid rgba(255,255,255,0.07)`,
              borderRadius: 14,
              transition: "border-color 0.25s, background 0.25s",
            }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = accent + "30";
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                e.currentTarget.style.background = "rgba(255,255,255,0.03)";
              }}>
              {/* Icon + label row */}
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 14 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                  background: accent + "14", border: `1px solid ${accent}22`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon size={13} color={accent} />
                </div>
                <span style={{ fontSize: 10, color: "#3a3a3a", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 500 }}>
                  {label}
                </span>
              </div>
              {/* Value */}
              <p style={{
                fontSize: 15, fontWeight: 600,
                color: "rgba(255,255,255,0.88)",
                margin: "0 0 4px",
                lineHeight: 1.3,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {value}
              </p>
              {/* Sub */}
              <p style={{ fontSize: 11, color: up ? C.green : "#444", margin: 0 }}>{sub}</p>
            </div>
          </FadeIn>
        ))}
      </div>

      {/* ── Charts: 2-col top row, 1 full-width bottom ── */}

      {/* Row 1: User Growth (wide) + Weekly Enrollments */}
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 14 }}>

        {/* User Growth — area chart */}
        <FadeIn delay={0.05}>
          <Panel style={{ padding: "22px 24px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18 }}>
              <div>
                <EyebrowLabel>User Growth</EyebrowLabel>
                <p style={{ fontSize: 11, color: "#444", margin: 0 }}>Monthly signups over 12 months</p>
              </div>
              {momGrowth && (
                <span style={{
                  fontSize: 11, fontWeight: 600, padding: "3px 9px",
                  borderRadius: 6, background: `${C.green}12`,
                  border: `1px solid ${C.green}22`, color: C.green,
                }}>
                  +{momGrowth}% MoM
                </span>
              )}
            </div>
            {chartUserGrowth.length === 0
              ? <ChartEmpty label="user growth" />
              : (
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={chartUserGrowth} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="ugGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={C.green} stopOpacity={0.18} />
                        <stop offset="100%" stopColor={C.green} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.035)" vertical={false} />
                    <XAxis dataKey="month" tick={{ fill: "#3a3a3a", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#3a3a3a", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,255,255,0.06)", strokeWidth: 1, fill: "transparent" }} wrapperStyle={{ outline: "none" }} />
                    <Area
                      type="monotone" dataKey="users" name="Users"
                      stroke={C.green} strokeWidth={2}
                      fill="url(#ugGrad)" dot={false}
                      activeDot={{ r: 4, fill: C.green, strokeWidth: 0 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
          </Panel>
        </FadeIn>

        {/* Weekly Enrollments — line chart */}
        <FadeIn delay={0.1}>
          <Panel style={{ padding: "22px 24px" }}>
            <div style={{ marginBottom: 18 }}>
              <EyebrowLabel>Weekly Enrollments</EyebrowLabel>
              <p style={{ fontSize: 11, color: "#444", margin: 0 }}>
                {peakWeek ? `Peak: ${peakWeek.week} · ${peakWeek.enrollments} enrolled` : "Enrollment activity by week"}
              </p>
            </div>
            {chartWeeklyEnrollments.length === 0
              ? <ChartEmpty label="enrollment" />
              : (
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartWeeklyEnrollments} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.035)" vertical={false} />
                    <XAxis dataKey="week" tick={{ fill: "#3a3a3a", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#3a3a3a", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,255,255,0.06)", strokeWidth: 1, fill: "transparent" }} wrapperStyle={{ outline: "none" }} />
                    <Line
                      type="monotone" dataKey="enrollments" name="Enrollments"
                      stroke={C.green} strokeWidth={2} dot={false}
                      activeDot={{ r: 4, fill: C.indigo, strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
          </Panel>
        </FadeIn>
      </div>

      {/* Row 2: Project Completions — full width bar chart */}
      <FadeIn delay={0.15}>
        <Panel style={{ padding: "22px 24px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18 }}>
            <div>
              <EyebrowLabel>Project Completions</EyebrowLabel>
              <p style={{ fontSize: 11, color: "#444", margin: 0 }}>
                {totalCompletions
                  ? `${totalCompletions.toLocaleString()} total completions across ${chartProjectCompletions.length} projects`
                  : "Completions by project"}
              </p>
            </div>
            {topProject && (
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: 10, color: "#444", letterSpacing: "0.06em", textTransform: "uppercase", margin: "0 0 2px" }}>Top Project</p>
                <p style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.75)", margin: 0 }}>
                  {topProject.project}
                </p>
              </div>
            )}
          </div>
          {chartProjectCompletions.length === 0
            ? <ChartEmpty label="completion" />
            : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={chartProjectCompletions}
                  barSize={18}
                  margin={{ top: 4, right: 4, left: -20, bottom: 40 }}
                >
                  <defs>
                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={C.green} stopOpacity={0.85} />
                      <stop offset="100%" stopColor={C.green} stopOpacity={0.35} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.035)" vertical={false} />
                  <XAxis
                    dataKey="project"
                    interval={0}
                    tick={{ fill: "#3a3a3a", fontSize: 10 }}
                    tickFormatter={v => v?.length > 12 ? v.slice(0, 12) + "…" : v}
                    angle={-30}
                    textAnchor="end"
                    height={50}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis tick={{ fill: "#3a3a3a", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,255,255,0.06)", strokeWidth: 1, fill: "transparent" }} wrapperStyle={{ outline: "none" }} />
                  <Bar dataKey="completions" name="Completions" fill="url(#barGrad)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
        </Panel>
      </FadeIn>
    </div>
  );
}

function ContentModeration() {
  const items = [
    { label: "Submitted Projects", count: 7, desc: "Projects awaiting admin review", icon: FolderOpen },
    { label: "Reported Content", count: 3, desc: "User-flagged comments and projects", icon: AlertTriangle },
    { label: "Pending Review", count: 2, desc: "Content items in draft / review state", icon: Eye },
  ];
  return (
    <FadeIn>
      <div>
        <SectionHeader eyebrow="SAFETY" title="Content Moderation" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
          {items.map(({ label, count, desc, icon: Icon }, i) => (
            <FadeIn key={label} delay={i * 0.06}>
              <Panel style={{ padding: "18px 20px" }} accent={C.amber}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 8,
                    background: `${C.amber}12`, border: `1px solid ${C.amber}22`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Icon size={13} color={C.amber} />
                  </div>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 22, fontWeight: 600, color: "#f2f2f2" }}>{count}</span>
                </div>
                <p style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.8)", margin: "0 0 4px" }}>{label}</p>
                <p style={{ fontSize: 11.5, color: "#555", lineHeight: 1.6, margin: "0 0 14px" }}>{desc}</p>
                <GhostBtn icon={Eye} onClick={() => { }}>Review</GhostBtn>
              </Panel>
            </FadeIn>
          ))}
        </div>
      </div>
    </FadeIn>
  );
}

function AchievementManagement({ badges, setBadges }) {
  const [modal, setModal] = useState(null);
  return (
    <>
      <FadeIn>
        <SectionHeader eyebrow="GAMIFICATION" title="Achievements" subtitle={`${badges.length} badges`}
          action={<PrimaryBtn icon={Plus} onClick={() => setModal("add")}>Create</PrimaryBtn>} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
          {badges.map((a, i) => (
            <FadeIn key={a.id} delay={i * 0.05}>
              <Panel style={{ padding: "18px 20px" }} elevation={1} accent={C.green}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                  <span style={{ fontSize: 24 }}>{a.icon}</span>
                  <div style={{ display: "flex", gap: 4 }}>
                    <GhostBtn icon={Edit2} onClick={() => setModal(a)} />
                    <DangerBtn icon={Trash2} onClick={() => setBadges(prev => prev.filter(x => x.id !== a.id))} />
                  </div>
                </div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.85)", margin: "0 0 4px" }}>{a.name}</p>
                <p style={{ fontSize: 11.5, color: "#555", lineHeight: 1.6, margin: "0 0 12px" }}>{a.description}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <Zap size={11} color={`${C.green}90`} />
                  <span style={{ fontSize: 11, color: `${C.green}90`, fontWeight: 600 }}>{a.xp} XP</span>
                </div>
              </Panel>
            </FadeIn>
          ))}
        </div>
      </FadeIn>

      <AnimatePresence>
        {modal && (
          <AchievementModal
            initial={modal === "add" ? null : modal}
            onClose={() => setModal(null)}
            onSave={form => {
              if (modal === "add") setBadges(prev => [...prev, { ...form, id: Date.now() }]);
              else setBadges(prev => prev.map(x => x.id === modal.id ? { ...x, ...form } : x));
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function SystemSettings() {
  const [settings, setSettings] = useState({
    maintenance: false, registration: true, darkMode: true, emailNotifs: true, betaFeatures: false,
  });
  const toggle = k => setSettings(s => ({ ...s, [k]: !s[k] }));
  const items = [
    { key: "maintenance", label: "Maintenance Mode", desc: "Temporarily disable user access", danger: true },
    { key: "registration", label: "User Registration", desc: "Allow new users to sign up" },
    { key: "darkMode", label: "Force Dark Mode", desc: "Override all user theme preferences" },
    { key: "emailNotifs", label: "Email Notifications", desc: "Send transactional emails to users" },
    { key: "betaFeatures", label: "Beta Features", desc: "Enable experimental features platform-wide" },
  ];
  const health = [
    { label: "Database", icon: Database },
    { label: "API", icon: Cpu },
    { label: "CDN", icon: Globe },
  ];

  return (
    <FadeIn>
      <SectionHeader eyebrow="SYSTEM" title="Settings" subtitle="Admin-only platform configuration" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16, flexWrap: "wrap" }} className="admin-settings-grid">
        <Panel style={{ padding: "6px 0" }}>
          {items.map(({ key, label, desc, danger }) => {
            const on = settings[key];
            return (
              <div key={key}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "14px 20px",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                  background: on && danger ? "rgba(239,68,68,0.03)" : "transparent",
                  transition: "background 0.2s",
                }}
                onMouseEnter={e => !on && (e.currentTarget.style.background = "rgba(255,255,255,0.018)")}
                onMouseLeave={e => e.currentTarget.style.background = on && danger ? "rgba(239,68,68,0.03)" : "transparent"}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500, color: on && danger ? "#FCA5A5" : "rgba(255,255,255,0.8)", margin: 0 }}>{label}</p>
                  <p style={{ fontSize: 11, color: "#555", margin: "3px 0 0", lineHeight: 1.5 }}>{desc}</p>
                </div>
                <button onClick={() => toggle(key)} style={{
                  position: "relative", flexShrink: 0,
                  width: 36, height: 20, borderRadius: 99,
                  background: on ? (danger ? "#ef4444" : C.green) : "rgba(255,255,255,0.1)",
                  border: "none", cursor: "pointer", transition: "background 0.22s",
                }}>
                  <span style={{
                    position: "absolute", top: 2, width: 16, height: 16,
                    borderRadius: "50%", background: "#fff",
                    left: on ? 18 : 2, transition: "left 0.22s cubic-bezier(0.22,1,0.36,1)",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.4)",
                  }} />
                </button>
              </div>
            );
          })}
        </Panel>

        <Panel style={{ padding: "18px 20px" }}>
          <EyebrowLabel>Service Health</EyebrowLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
            {health.map(({ label, icon: Icon }) => (
              <div key={label} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "10px 14px", borderRadius: 10,
                background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Icon size={12} color="#444" />
                  <span style={{ fontSize: 12, color: "#777" }}>{label}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.green, boxShadow: `0 0 6px ${C.green}` }} />
                  <span style={{ fontSize: 11, color: `${C.green}90` }}>Healthy</span>
                </div>
              </div>
            ))}
          </div>
          <button style={{
            marginTop: 12, width: "100%",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            padding: "9px 0", borderRadius: 9,
            border: "1px solid rgba(255,255,255,0.07)",
            background: "transparent", cursor: "pointer",
            fontSize: 12, color: "#555", fontFamily: "inherit",
            transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.color = "#aaa"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#555"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; }}>
            <RefreshCw size={11} />
            Refresh Status
          </button>
        </Panel>
      </div>
    </FadeIn>
  );
}

function ActivityFeed({ activity = [] }) {
  const iconMap = { FolderOpen, UserCheck, Trophy, Trash2, Activity };
  return (
    <FadeIn>
      <SectionHeader eyebrow="LOG" title="Activity Feed" subtitle="Recent admin actions" />
      <Panel style={{ padding: "18px 22px" }}>
        {activity.map((item, i) => {
          const Icon = item.icon ?? iconMap[item.iconKey] ?? Activity;
          return (
            <motion.div key={item.id}
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06, ease: EASE }}
              style={{ display: "flex", gap: 12, position: "relative" }}>
              {i < activity.length - 1 && (
                <div style={{ position: "absolute", left: 15, top: 32, bottom: 0, width: 1, background: "rgba(255,255,255,0.04)" }} />
              )}
              <div style={{
                padding: 8, borderRadius: 9,
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)",
                flexShrink: 0, zIndex: 1, height: "fit-content", marginTop: 2,
              }}>
                <Icon size={12} color="#555" />
              </div>
              <div style={{ paddingBottom: 20, flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.75)", margin: 0 }}>{item.action}</p>
                <p style={{ fontSize: 11.5, color: "#555", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.detail}</p>
                <p style={{ fontSize: 11, color: "#3a3a3a", marginTop: 4 }}>{item.time}</p>
              </div>
            </motion.div>
          );
        })}
        {activity.length === 0 && (
          <p style={{ textAlign: "center", color: "#444", fontSize: 13, padding: "24px 0" }}>No recent activity</p>
        )}
      </Panel>
    </FadeIn>
  );
}

// ─── ACCESS DENIED ────────────────────────────────────────────────────────────
function AccessDenied() {
  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ease: EASE, duration: 0.5 }}
        style={{ textAlign: "center", maxWidth: 360, padding: "40px 24px" }}>
        <div style={{
          width: 52, height: 52, borderRadius: 14,
          background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px",
        }}>
          <Shield size={22} color="#f87171" />
        </div>
        <h1 style={{ ...SECTION_HEAD, fontSize: 20, marginBottom: 10 }}>Access Denied</h1>
        <p style={{ fontSize: 13, color: "#555", lineHeight: 1.7, marginBottom: 24 }}>
          You don't have permission to view this page. Admin access is required.
        </p>
        <a href="/" style={{ textDecoration: "none" }}>
          <PrimaryBtn icon={ChevronLeft}>Return Home</PrimaryBtn>
        </a>
      </motion.div>
    </div>
  );
}

// ─── OVERVIEW SECTION ─────────────────────────────────────────────────────────
function Overview({ user, stats, activity, chartUserGrowth, chartProjectCompletions, chartWeeklyEnrollments }) {
  const statCards = [
    { icon: Users, label: "Total Users", value: stats.totalUsers ?? 0, accent: C.green },
    { icon: FolderOpen, label: "Projects", value: stats.totalProjects ?? 0, accent: C.indigo },
    { icon: CheckCircle, label: "Completions", value: stats.totalCompletions ?? 0, accent: C.amber },
    { icon: Zap, label: "Active Users", value: stats.totalActiveUsers ?? 0, accent: C.green },
    { icon: TrendingUp, label: "New This Week", value: stats.newUsersThisWeek ?? 0, accent: C.indigo },
  ];

  // ── Real derived quick stats ──
  // Completion Rate: completions / totalEnrollments (now returned by backend)
  const completionRate = stats.totalEnrollments
    ? Math.round((stats.totalCompletions / stats.totalEnrollments) * 100)
    : 0;

  // MoM User Growth: (thisMonth - lastMonth) / lastMonth × 100
  const momRate = (() => {
    if (chartUserGrowth.length < 2) return 0;
    const prev = chartUserGrowth[chartUserGrowth.length - 2]?.users ?? 0;
    const curr = chartUserGrowth[chartUserGrowth.length - 1]?.users ?? 0;
    if (!prev) return 0;
    return Math.round(((curr - prev) / prev) * 100);
  })();

  // Weekly Engagement: latest week vs peak week
  const weeklyEngagement = (() => {
    if (!chartWeeklyEnrollments.length) return 0;
    const peak = Math.max(...chartWeeklyEnrollments.map(w => w.enrollments ?? 0));
    const latest = chartWeeklyEnrollments[chartWeeklyEnrollments.length - 1]?.enrollments ?? 0;
    return peak ? Math.round((latest / peak) * 100) : 0;
  })();

  const quickStats = [
    {
      label: "Project Completion Rate",
      value: `${completionRate}%`,
      bar: completionRate,
    },
    {
      label: "User Growth Rate (MoM)",
      value: momRate >= 0 ? `+${momRate}%` : `${momRate}%`,
      bar: Math.min(100, Math.max(0, 50 + momRate)),
      negative: momRate < 0,
    },
    {
      label: "Weekly Engagement",
      value: `${weeklyEngagement}%`,
      bar: weeklyEngagement,
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
      {/* Hero */}
      <FadeIn>
        <div style={{
          borderRadius: 18, padding: "28px 30px",
          background: "rgba(255,255,255,0.03)",
          border: `1px solid rgba(255,255,255,0.07)`,
          position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: "50%", right: -60,
            transform: "translateY(-50%)", width: 300, height: 200,
            background: `radial-gradient(ellipse, ${C.green}08 0%, transparent 65%)`,
            pointerEvents: "none",
          }} />
          <div style={{ position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <h2 style={{ ...SECTION_HEAD, fontSize: 20 }}>
                Welcome back, {user?.fullName?.split(" ")[0]}
              </h2>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                fontSize: 10, fontWeight: 600, padding: "3px 9px",
                background: `${C.green}10`, border: `1px solid ${C.green}25`,
                borderRadius: 6, color: C.green, letterSpacing: "0.06em",
              }}>
                <Shield size={9} strokeWidth={2.5} /> ADMIN
              </span>
            </div>
            <p style={{ fontSize: 13, color: "#555", margin: 0 }}>Here's what's happening across the BuildWise platform today.</p>
          </div>
        </div>
      </FadeIn>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: 12 }}>
        {statCards.map(({ icon, label, value, accent }, i) => (
          <StatCard key={label} icon={icon} label={label} value={value} delay={i * 0.05} accent={accent} />
        ))}
      </div>

      <SectionDivider />

      {/* Charts */}
      <AnalyticsSection
        chartUserGrowth={chartUserGrowth}
        chartProjectCompletions={chartProjectCompletions}
        chartWeeklyEnrollments={chartWeeklyEnrollments}
      />

      <SectionDivider />

      {/* Two-col: Activity + Quick Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="admin-two-col">
        <ActivityFeed activity={activity} />

        <FadeIn delay={0.1}>
          <div>
            <SectionHeader eyebrow="METRICS" title="Quick Stats" />
            <Panel style={{ padding: "6px 0" }}>
              {quickStats.map(({ label, value, bar, negative }, i) => {
                const barColor = negative ? "#f87171" : C.green;
                return (
                  <div key={label} style={{
                    padding: "14px 20px",
                    borderBottom: i < quickStats.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <span style={{ fontSize: 12, color: "#666" }}>{label}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: negative ? "#f87171" : "rgba(255,255,255,0.8)", fontFamily: "'DM Mono', monospace" }}>{value}</span>
                    </div>
                    <div style={{ height: 3, borderRadius: 99, background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${bar}%` }}
                        transition={{ delay: 0.4 + i * 0.1, duration: 0.8, ease: EASE }}
                        style={{ height: "100%", borderRadius: 99, background: `linear-gradient(90deg, ${barColor}80, ${barColor})` }}
                      />
                    </div>
                  </div>
                );
              })}
            </Panel>
          </div>
        </FadeIn>
      </div>

      <SectionDivider />

      <ContentModeration />
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function AdminPanel() {
  const { user, loading } = useContext(UserContext);
  const [section, setSection] = useState("overview");
  const [collapsed, setCollapsed] = useState(false);
  const [isNarrow, setIsNarrow] = useState(false);
  const [showProjectDrawer, setShowProjectDrawer] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [showNotifs, setShowNotifs] = useState(false);
  const [summary, setSummary] = useState(null);
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [userFilter, setUserFilter] = useState("All");
  const [userPage, setUserPage] = useState(1);
  const [userTotalPages, setUserTotalPages] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [badges, setBadges] = useState([]);
  const [projects, setProjects] = useState([]);
  const [projectSearch, setProjectSearch] = useState("");
  const [projectFilter, setProjectFilter] = useState("All");
  const [projectPage, setProjectPage] = useState(1);
  const [projectTotalPages, setProjectTotalPages] = useState(0);
  const [totalProjects, setTotalProjects] = useState(0);
  const PROJECTS_PER_PAGE = 10;

  const fetchProjects = () =>
    getAdminProjects({ page: projectPage, limit: PROJECTS_PER_PAGE, difficulty: projectFilter, search: projectSearch })
      .then(data => { setProjects(data.projects); setProjectTotalPages(data.totalPages); setTotalProjects(data.totalProjects); })
      .catch(console.error);

  const fetchUsers = () =>
    getAdminUsers({ page: userPage, limit: 10, role: userFilter, search: userSearch })
      .then(data => { setUsers(data.users); setUserTotalPages(data.totalPages); setTotalUsers(data.totalUsers); })
      .catch(console.error);

  const handleSaveProject = async (projectData) => {
    try {
      if (editingProject) {
        await axios.put(`${import.meta.env.VITE_APP_URI}/api/v1/projects/update-project/${editingProject._id}`, projectData);
      } else {
        await axios.post(`${import.meta.env.VITE_APP_URI}/api/v1/projects/add-project`, projectData);
      }
      await fetchProjects();
      setShowProjectDrawer(false);
      setEditingProject(null);
    } catch (error) {
      console.error("STATUS:", error.response?.status, error.response?.data);
    }
  };

  useEffect(() => {
    getAdminDashboardSummary().then(setSummary);
    getAdminAchievements().then(setBadges);
  }, []);

  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, [projectPage, projectFilter, projectSearch, userPage, userFilter, userSearch]);
  useEffect(() => {
    const onResize = () => setIsNarrow(window.innerWidth < 960);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const stats = summary?.metrics ?? {};
  const activity = summary?.activity ?? [];
  const notifications = summary?.notifications ?? [];
  const chartUserGrowth = summary?.charts?.userGrowth ?? [];
  const chartProjectCompletions = summary?.charts?.projectCompletions ?? [];
  const chartWeeklyEnrollments = summary?.charts?.weeklyEnrollments ?? [];

  const sectionMap = {
    projects: (
      <ProjectManagement
        projects={projects} setProjects={setProjects}
        totalProjects={totalProjects} totalPages={projectTotalPages}
        page={projectPage} setPage={setProjectPage}
        search={projectSearch} setSearch={setProjectSearch}
        filter={projectFilter} setFilter={setProjectFilter}
        onAddProject={() => { setEditingProject(null); setShowProjectDrawer(true); }}
        onEditProject={async (project) => {
          try {
            const res = await axios.get(`${import.meta.env.VITE_APP_URI}/api/v1/projects/get-project/${project.slug}`);
            setEditingProject(res.data.data ?? res.data);
          } catch { setEditingProject(project); }
          setShowProjectDrawer(true);
        }}
      />
    ),
    users: (
      <UserManagement
        users={users} setUsers={setUsers}
        totalUsers={totalUsers} totalPages={userTotalPages}
        page={userPage} setPage={setUserPage}
        search={userSearch} setSearch={setUserSearch}
        filter={userFilter} setFilter={setUserFilter}
        fetchUsers={fetchUsers}
      />
    ),
    analytics: <AnalyticsSection chartUserGrowth={chartUserGrowth} chartProjectCompletions={chartProjectCompletions} chartWeeklyEnrollments={chartWeeklyEnrollments} />,
    moderation: <ContentModeration />,
    achievements: <AchievementManagement badges={badges} setBadges={setBadges} />,
    settings: <SystemSettings />,
    activity: <ActivityFeed activity={activity} />,
  };

  if (loading) return <Loader size="lg" text="Checking Access…" fullScreen />;
  if (user?.role !== "admin") return <AccessDenied />;

  return (
    <div style={{
      minHeight: "100vh", display: "flex",
      background: C.bg, color: "#e5e5e5",
      fontFamily: "'DM Sans', -apple-system, sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.07); border-radius: 99px; }
        select option { background: #0d0f14; color: white; }
        @media (max-width: 900px) {
          .admin-two-col { grid-template-columns: 1fr !important; }
          .admin-settings-grid { grid-template-columns: 1fr !important; }
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

      {/* Sidebar */}
      <Sidebar
        active={section} onSelect={setSection}
        collapsed={collapsed || isNarrow} onToggle={() => setCollapsed(c => !c)}
        user={user}
      />

      {/* Main */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", position: "relative", zIndex: 1 }}>
        <Header
          section={section} user={user}
          notifications={notifications}
          onAddProject={() => { setEditingProject(null); setShowProjectDrawer(true); }}
          onGoUsers={() => setSection("users")}
          onNotifToggle={() => setShowNotifs(v => !v)}
          showNotifs={showNotifs}
          onNotifClose={() => setShowNotifs(false)}
        />

        <div style={{ flex: 1, overflowY: "auto", maxHeight: "calc(100vh - 63px)" }}>
          <div style={{ padding: "32px 32px 48px", maxWidth: 1280 }}>
            <AnimatePresence mode="wait">
              {section === "overview" ? (
                <motion.div key="overview"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}>
                  <Overview
                    user={user} stats={stats} activity={activity}
                    chartUserGrowth={chartUserGrowth}
                    chartProjectCompletions={chartProjectCompletions}
                    chartWeeklyEnrollments={chartWeeklyEnrollments}
                  />
                </motion.div>
              ) : (
                <motion.div key={section}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}>
                  {sectionMap[section]}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <footer style={{
            padding: "18px 32px", borderTop: "1px solid rgba(255,255,255,0.05)",
            display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <div style={{
                width: 20, height: 20, borderRadius: 5,
                background: "linear-gradient(135deg, #6EE7B7, #818CF8)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Hammer size={10} color="#071A12" />
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#555" }}>BuildWise Admin</span>
            </div>
            <span style={{ fontSize: 11, color: "#2a2a2a" }}>© 2025 BuildWise. All rights reserved.</span>
          </footer>
        </div>
      </div>

      {/* Project Drawer */}
      <AnimatePresence>
        {showProjectDrawer && (
          <ProjectBuilderDrawer
            open={showProjectDrawer}
            onClose={() => { setShowProjectDrawer(false); setEditingProject(null); }}
            initialData={editingProject}
            mode={editingProject ? "edit" : "create"}
            onSave={handleSaveProject}
          />
        )}
      </AnimatePresence>
    </div>
  );
}