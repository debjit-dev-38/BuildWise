import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Check, Play, ExternalLink } from "lucide-react";
import api from "../Services/api";

const C = {
  green: "#6EE7B7",
  indigo: "#818CF8",
  amber: "#FCD34D",
  surface: "rgba(255,255,255,0.03)",
  border: "rgba(255,255,255,0.08)",
  muted: "#666",
};

function DiffBadge({ d }) {
  if (!d) return null;
  const label = d.charAt(0).toUpperCase() + d.slice(1).toLowerCase();
  return (
    <div style={{ fontSize: 11, fontWeight: 600, color: C.amber, background: C.amber + "18", border: `1px solid ${C.amber}30`, borderRadius: 6, padding: "3px 10px" }}>
      {label}
    </div>
  );
}

function PrimaryBtn({ children, style, onClick }) {
  return (
    <button onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 6, background: C.green + "18", border: `1px solid ${C.green}35`, color: C.green, borderRadius: 8, padding: "8px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", ...style }}>
      {children}
    </button>
  );
}

function GhostBtn({ children }) {
  return (
    <button style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`, color: "#888", borderRadius: 8, padding: "8px 12px", fontSize: 12, cursor: "pointer" }}>
      {children}
    </button>
  );
}

export default function DashboardCard() {
  const [hov, setHov] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/v1/enroll/dashboard")
      .then((res) => setData(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ borderRadius: 16, background: C.surface, border: `1px solid ${C.border}`, height: 480, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 13, color: C.muted }}>Loading...</span>
      </div>
    );
  }

  if (!data) return null;

  // ---------------- DATA ----------------
  const project = data.project;
  const { progressPercent = 0, totalModules = 0, currentModuleNumber = 1, activeModule = null, last4Completed = [] } = data.ui;

  // Full ordered module list
  const allModules = [...(project?.modules ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const activeId = activeModule ? String(activeModule._id) : null;
  const activeOrder = activeModule?.order ?? totalModules + 1;
  const weekLabel = `Week ${currentModuleNumber} of ${totalModules}`;

  // ---------------- RENDER ----------------
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderRadius: 16, overflow: "hidden",
        border: hov ? `1px solid ${C.green}28` : `1px solid ${C.border}`,
        background: C.surface, backdropFilter: "blur(20px)",
        transition: "all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1)",
        transform: hov ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hov ? `0 20px 60px ${C.green}0e` : "none",
      }}
    >
      {/* HEADER */}
      <div style={{ height: 160, position: "relative", background: `radial-gradient(ellipse at 35% 60%, ${C.green}1a 0%, rgba(255,255,255,0.02) 70%)`, borderBottom: `1px solid ${C.border}`, overflow: "hidden" }}>
        {/* Grid texture */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

        {/* Project initials */}
        <motion.div animate={{ scale: hov ? 1.05 : 1 }} transition={{ duration: 0.4 }}
          style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 72, height: 72, borderRadius: 18, background: `${C.green}18`, border: `1px solid ${C.green}35`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Instrument Serif', serif", fontSize: 22, color: C.green }}>
            {project?.name?.slice(0, 2).toUpperCase() ?? "—"}
          </div>
        </motion.div>

        {/* Progress chip */}
        <motion.div animate={{ y: hov ? -4 : 0 }} transition={{ duration: 0.4 }}
          style={{ position: "absolute", top: 14, right: 16, background: "rgba(10,10,10,0.7)", backdropFilter: "blur(12px)", border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 10px" }}>
          <div style={{ fontSize: 10, color: C.green, fontWeight: 600, marginBottom: 2 }}>PROGRESS</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#e5e5e5" }}>{progressPercent}% done</div>
        </motion.div>

        {/* Module position chip */}
        <motion.div animate={{ y: hov ? -4 : 0 }} transition={{ duration: 0.4, delay: 0.05 }}
          style={{ position: "absolute", bottom: 14, left: 16, background: "rgba(10,10,10,0.7)", backdropFilter: "blur(12px)", border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 10px", display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.amber }} />
          <div style={{ fontSize: 11, color: "#e5e5e5" }}>Module {currentModuleNumber} of {totalModules}</div>
        </motion.div>
      </div>

      {/* BODY */}
      <div style={{ padding: "20px 22px" }}>

        {/* Title + meta */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
          <div>
            <div style={{ display: "flex", gap: 6, marginBottom: 8, alignItems: "center" }}>
              <DiffBadge d={project?.difficulty} />
              {project?.durationWeeks && (
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Clock size={11} color="#555" />
                  <span style={{ fontSize: 11, color: "#555" }}>{project.durationWeeks} weeks</span>
                </div>
              )}
            </div>
            <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 22, color: "#f0f0f0", letterSpacing: "-0.015em", marginBottom: 4 }}>
              {project?.name ?? "—"}
            </h3>
            <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
              Currently on:{" "}
              <span style={{ color: C.amber }}>
                Module {currentModuleNumber} — {activeModule?.phase ?? "—"}
              </span>
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: "#555" }}>{weekLabel}</span>
            <span style={{ fontSize: 11, color: C.green }}>{progressPercent}% complete</span>
          </div>
          <div style={{ height: 4, background: "rgba(255,255,255,0.07)", borderRadius: 2, overflow: "hidden" }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
              style={{ height: "100%", background: `linear-gradient(90deg, ${C.green}, ${C.indigo})`, borderRadius: 2 }}
            />
          </div>
        </div>

        {/* Module list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 18 }}>
          {allModules.map((m) => {
            const mOrder = m.order ?? 0;
            const done = mOrder < activeOrder;
            const active = String(m._id) === activeId;

            return (
              <div key={String(m._id)} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 16, height: 16, borderRadius: "50%", flexShrink: 0, background: done ? C.green + "20" : active ? C.amber + "20" : "rgba(255,255,255,0.04)", border: `1px solid ${done ? C.green + "50" : active ? C.amber + "50" : "rgba(255,255,255,0.1)"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {done ? (
                    <Check size={9} color={C.green} />
                  ) : active ? (
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.amber }} />
                  ) : null}
                </div>
                <span style={{ fontSize: 12, color: done ? "#888" : active ? C.amber : "#444", textDecoration: done ? "line-through" : "none" }}>
                  {m.title ?? m.phase}
                </span>
                {active && (
                  <span style={{ fontSize: 10, background: "rgba(252,211,77,0.12)", color: C.amber, padding: "2px 6px", borderRadius: 4, marginLeft: "auto" }}>
                    current
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 10 }}>
          <PrimaryBtn style={{ flex: 1, justifyContent: "center" }}>
            <Play size={13} /> Continue Module {currentModuleNumber}
          </PrimaryBtn>
          <GhostBtn>
            <ExternalLink size={13} />
          </GhostBtn>
        </div>
      </div>
    </div>
  );
}
