import { useState, useRef } from "react";
import Background from "../Components/Background";
import Navbar from "../Components/Navbar";
import { COLORS, FONTS, DIFFICULTY_COLORS, badgeBg } from "../Constants/theme";

// ─── Mock API Data (replace with real fetch) ──────────────────────────────────
const MOCK_DATA = {
  project: {
    id: "proj_001",
    title: "REST API with Authentication",
    slug: "rest-api-with-auth",
    difficulty: "Intermediate",
    duration: "8 Weeks",
    learners: 4100,
    rating: 4.7,
    category: "Backend",
    techStack: ["Express", "PostgreSQL", "Redis", "JWT", "Zod", "Docker", "Jest"],
  },
  modules: [
    { id: "m1",  order: 1,  title: "Introduction",           description: "Overview of the project architecture, goals, and what you'll build by the end of this course.", duration: "30 min",  pdfUrl: null, completed: true,  unlocked: true  },
    { id: "m2",  order: 2,  title: "Project Setup",          description: "Scaffold the project, install dependencies, configure TypeScript, and set up the development environment.", duration: "45 min",  pdfUrl: null, completed: true,  unlocked: true  },
    { id: "m3",  order: 3,  title: "Database Design",        description: "Design the PostgreSQL schema, define table relationships, and write migration scripts.", duration: "1 hour",  pdfUrl: null, completed: true,  unlocked: true  },
    { id: "m4",  order: 4,  title: "User Registration",      description: "Implement the registration endpoint with Zod validation, bcrypt password hashing, and proper error handling.", duration: "1.5 hrs", pdfUrl: null, completed: false, unlocked: true  },
    { id: "m5",  order: 5,  title: "Login System",           description: "Build the login flow, verify credentials safely, and issue JWT access tokens and refresh tokens.", duration: "1.5 hrs", pdfUrl: null, completed: false, unlocked: false },
    ],
};

// ─── Derived progress ──────────────────────────────────────────────────────────
function deriveProgress(modules) {
  const completed = modules.filter((m) => m.completed).length;
  const total = modules.length;
  return { completedModules: completed, totalModules: total, percentage: Math.round((completed / total) * 100) };
}

// ─── Design tokens (scoped to this page) ──────────────────────────────────────
const ACCENT  = COLORS.green;            // #6EE7B7
const BG      = COLORS.bg;               // #0A0A0A
const BORDER  = COLORS.border;           // rgba(255,255,255,0.07)
const GLASS   = COLORS.card;             // rgba(255,255,255,0.02)
const TEXT    = COLORS.text;             // #F0F0F0
const TEXT_SEC = COLORS.muted;           // rgba(255,255,255,0.45)
const SERIF   = FONTS.serif.fontFamily;  // 'Instrument Serif', serif
const SANS    = FONTS.sans.fontFamily;   // 'DM Sans', sans-serif

const css = {
  // ── layout ──────────────────────────────────────────────────────────────────
  page: {
    ...FONTS.sans,
    background: BG,
    color: TEXT,
    minHeight: "100vh",
    position: "relative",
    // no overflow:hidden — it breaks sticky + scroll context
  },
  // paddingTop must match Navbar height so content isn't hidden beneath it
  appShell: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    paddingTop: 76,   // pushes content below the fixed navbar (top:16 + height:52 + 8gap)
  },
  // body clips overflow so each column scrolls independently
  body: {
    display: "flex",
    flex: 1,
    height: "calc(100vh - 76px)",
    overflow: "hidden",
  },

  // ── left sidebar ────────────────────────────────────────────────────────────
  sidebarLeft: {
    width: 240,
    flexShrink: 0,
    borderRight: `1px solid ${BORDER}`,
    padding: "20px 0",
    overflowY: "auto",
    height: "100%",
    background: "rgba(10,10,10,0.95)",
  },
  sidebarLabel: {
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: "1.5px",
    color: TEXT_SEC,
    textTransform: "uppercase",
    padding: "8px 16px 4px",
  },

  // ── module list item (function) ──────────────────────────────────────────────
  moduleItem: (active, completed, unlocked) => ({
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "7px 14px",
    borderRadius: 8,
    cursor: unlocked ? "pointer" : "default",
    fontSize: 13,
    color: active ? ACCENT : completed ? TEXT : unlocked ? TEXT_SEC : "rgba(255,255,255,0.25)",
    background: active ? `rgba(110,231,183,0.06)` : "transparent",
    borderLeft: active ? `2px solid ${ACCENT}` : "2px solid transparent",
    transition: "all 0.2s",
    opacity: unlocked ? 1 : 0.5,
  }),

  // ── main content area ────────────────────────────────────────────────────────
  main: { flex: 1, padding: "36px 48px", overflowY: "auto", overflowX: "hidden", minWidth: 0, height: "100%" },

  // ── right sidebar ────────────────────────────────────────────────────────────
  sidebarRight: {
    width: 220,
    flexShrink: 0,
    borderLeft: `1px solid ${BORDER}`,
    padding: "20px 16px",
    overflowY: "auto",
    height: "100%",
    background: "rgba(10,10,10,0.95)",
  },

  // ── cards ────────────────────────────────────────────────────────────────────
  glassCard: {
    background: GLASS,
    border: `1px solid ${BORDER}`,
    borderRadius: 12,
    padding: "16px",
  },

  // ── buttons ──────────────────────────────────────────────────────────────────
  btnPrimary: {
    background: ACCENT,
    color: BG,
    border: "none",
    borderRadius: 8,
    padding: "11px 24px",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: SANS,
    transition: "opacity 0.2s",
  },
  btnSecondary: {
    background: "transparent",
    color: TEXT,
    border: `1px solid ${BORDER}`,
    borderRadius: 8,
    padding: "11px 20px",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: SANS,
    transition: "all 0.2s",
  },
  btnDisabled: {
    background: "transparent",
    color: "rgba(255,255,255,0.2)",
    border: `1px solid rgba(255,255,255,0.05)`,
    borderRadius: 8,
    padding: "11px 20px",
    fontSize: 14,
    cursor: "not-allowed",
    fontFamily: SANS,
  },

  // ── tags / badges ────────────────────────────────────────────────────────────
  tag: {
    background: GLASS,
    border: `1px solid ${BORDER}`,
    borderRadius: 20,
    fontSize: 11,
    padding: "3px 10px",
    color: TEXT_SEC,
  },

  // ── SVG text (progress ring) ─────────────────────────────────────────────────
  progressRingText: {
    fontFamily: SANS,
    fill: TEXT,
    fontSize: 14,
    fontWeight: 700,
    dominantBaseline: "middle",
    textAnchor: "middle",
  },
};

// ─── Sub-components ────────────────────────────────────────────────────────────

function ProgressRing({ pct }) {
  const r = 36, cx = 44, cy = 44, stroke = 4;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={88} height={88} viewBox="0 0 88 88">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={BORDER} strokeWidth={stroke} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={ACCENT} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round" transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: "stroke-dashoffset 0.6s ease" }} />
      <text x={cx} y={cy} style={css.progressRingText}>{pct}%</text>
    </svg>
  );
}

function StatusBadge({ status }) {
  const map = {
    Completed:     { bg: `rgba(110,231,183,0.10)`, border: `rgba(110,231,183,0.25)`, color: COLORS.green },
    "In Progress": { bg: `rgba(252,211,77,0.10)`,  border: `rgba(252,211,77,0.25)`,  color: COLORS.amber },
    "Not Started": { bg: GLASS,                     border: BORDER,                   color: TEXT_SEC },
  };
  const s = map[status] || map["Not Started"];
  return (
    <span style={{
      background: s.bg,
      border: `1px solid ${s.border}`,
      color: s.color,
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: "0.5px",
      padding: "3px 10px",
      borderRadius: 20,
    }}>
      {status}
    </span>
  );
}

function DifficultyBadge({ level }) {
  const color = DIFFICULTY_COLORS[level] ?? ACCENT;
  return (
    <span style={{
      background: badgeBg(color),
      border: `1px solid ${color}44`,
      color,
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: "1px",
      textTransform: "uppercase",
      padding: "3px 12px",
      borderRadius: 20,
    }}>
      {level}
    </span>
  );
}

function Modal({ onCancel, onConfirm }) {
  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.75)",
      zIndex: 200,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <div style={{
        background: "#111",
        border: `1px solid ${COLORS.borderHover}`,
        borderRadius: 16,
        padding: 32,
        width: 400,
        boxShadow: `0 0 60px rgba(110,231,183,0.07)`,
      }}>
        <h3 style={{ fontFamily: SERIF, fontSize: 22, marginBottom: 12, color: TEXT }}>Mark as Complete?</h3>
        <p style={{ color: TEXT_SEC, fontSize: 14, lineHeight: 1.7, marginBottom: 28 }}>
          Have you completed and understood this module? Your progress will be saved and the next module will unlock.
        </p>
        <div style={{ display: "flex", gap: 12 }}>
          <button className="bw-btn-secondary" style={css.btnSecondary} onClick={onCancel}>Cancel</button>
          <button style={css.btnPrimary} onClick={onConfirm}>Mark Complete ✓</button>
        </div>
      </div>
    </div>
  );
}

function CelebrationCard({ project, onDashboard, onNext }) {
  return (
    <div style={{ ...css.glassCard, borderColor: "rgba(110,231,183,0.2)", textAlign: "center", padding: 48 }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
      <h2 style={{ fontFamily: SERIF, fontSize: 30, marginBottom: 12, color: TEXT }}>Congratulations!</h2>
      <p style={{ color: TEXT_SEC, fontSize: 15, marginBottom: 32 }}>
        You've completed <strong style={{ color: TEXT }}>{project.title}</strong>. Your certificate is ready.
      </p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <button style={css.btnPrimary}>⬇ Download Certificate</button>
        <button className="bw-btn-secondary" style={css.btnSecondary} onClick={onNext}>View Next Project</button>
        <button className="bw-btn-secondary" style={css.btnSecondary} onClick={onDashboard}>Back to Dashboard</button>
      </div>
    </div>
  );
}

function PDFViewer({ pdfUrl }) {
  if (!pdfUrl) {
    return (
      <div style={{ ...css.glassCard, minHeight: 360, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, borderStyle: "dashed" }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={TEXT_SEC} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
        <p style={{ color: TEXT_SEC, fontSize: 14 }}>PDF material hasn't been attached to this module yet.</p>
        <p style={{ color: COLORS.faint, fontSize: 12 }}>The instructor will upload it shortly.</p>
      </div>
    );
  }
  return (
    <div style={{ ...css.glassCard, padding: 0, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: `1px solid ${BORDER}` }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: TEXT_SEC, letterSpacing: "1px", textTransform: "uppercase" }}>Learning Material</span>
        <div style={{ display: "flex", gap: 8 }}>
          <a href={pdfUrl} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: ACCENT, textDecoration: "none", padding: "3px 10px", border: `1px solid rgba(110,231,183,0.2)`, borderRadius: 6 }}>⬇ Download</a>
          <a href={pdfUrl} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: TEXT_SEC, textDecoration: "none", padding: "3px 10px", border: `1px solid ${BORDER}`, borderRadius: 6 }}>⛶ Fullscreen</a>
        </div>
      </div>
      <iframe src={`${pdfUrl}#toolbar=0&navpanes=0`} width="100%" height="600" style={{ border: "none", display: "block" }} title="Module PDF" />
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function BuildWiseLearningPage({ data = MOCK_DATA }) {
  const [modules, setModules]     = useState(data.modules);
  const [activeId, setActiveId]   = useState(() => {
    const first = data.modules.find((m) => m.unlocked && !m.completed);
    return first ? first.id : data.modules[0]?.id;
  });
  const [showModal, setShowModal] = useState(false);
  const mainRef = useRef(null);

  const project     = data.project;
  const progress    = deriveProgress(modules);
  const activeModule = modules.find((m) => m.id === activeId);
  const activeIndex  = modules.findIndex((m) => m.id === activeId);
  const prevModule   = activeIndex > 0 ? modules[activeIndex - 1] : null;
  const nextModule   = activeIndex < modules.length - 1 ? modules[activeIndex + 1] : null;
  const allDone      = progress.completedModules === progress.totalModules;

  const moduleStatus = (m) => {
    if (m.completed) return "Completed";
    if (m.id === activeId && m.unlocked) return "In Progress";
    return "Not Started";
  };

  const timeRemaining = modules
    .filter((m) => !m.completed)
    .reduce((acc, m) => {
      const raw = m.duration || "";
      const hrs = raw.includes("hour") ? parseFloat(raw) : raw.includes("min") ? parseFloat(raw) / 60 : 0;
      return acc + hrs;
    }, 0);

  function handleMarkComplete() {
    setShowModal(false);
    setModules((prev) => {
      const idx = prev.findIndex((m) => m.id === activeId);
      return prev.map((m, i) => {
        if (m.id === activeId) return { ...m, completed: true };
        if (i === idx + 1)     return { ...m, unlocked: true };
        return m;
      });
    });
    if (nextModule) setActiveId(nextModule.id);
  }

  function selectModule(m) {
    if (!m.unlocked && !m.completed) return;
    setActiveId(m.id);
    mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div style={css.page}>
      {/* ── Injected fonts + utility overrides ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif&family=DM+Sans:wght@400;500;600;700&family=DM+Mono&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
        .bw-module-hover:hover { background: rgba(255,255,255,0.035) !important; }
        .bw-btn-secondary:hover { border-color: rgba(255,255,255,0.18) !important; color: #fff !important; }
        @media (max-width: 1024px) { .bw-sidebar-right { display: none !important; } }
        @media (max-width: 768px)  { .bw-sidebar-left  { display: none !important; } .bw-main { padding: 20px !important; } }
      `}</style>

      {/* Imported background — radial blobs + grid */}
      <Background />

      {/* Navbar sits outside appShell so position:fixed resolves against the viewport,
           not against any ancestor stacking context */}
      <Navbar />

      <div style={css.appShell}>
        <div style={css.body}>
          {/* ── LEFT SIDEBAR ── */}
          <aside className="bw-sidebar-left" style={css.sidebarLeft}>
            <div style={css.sidebarLabel}>Course Modules</div>
            {modules.map((m, i) => (
              <div
                key={m.id}
                className={m.unlocked ? "bw-module-hover" : ""}
                style={css.moduleItem(m.id === activeId, m.completed, m.unlocked)}
                onClick={() => selectModule(m)}
              >
                <span style={{ fontSize: 10, fontWeight: 700, opacity: 0.45, minWidth: 20 }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span style={{ flex: 1, fontSize: 12 }}>{m.title}</span>
                {m.completed  && <span style={{ color: ACCENT, fontSize: 11 }}>✓</span>}
                {!m.unlocked  && <span style={{ fontSize: 11 }}>🔒</span>}
              </div>
            ))}

            <div style={{ height: 16 }} />
            <div style={css.sidebarLabel}>Completion</div>
            <div style={{ padding: "8px 16px" }}>
              <div style={{ background: COLORS.faintSolid, borderRadius: 20, height: 4, marginBottom: 6 }}>
                <div style={{ background: ACCENT, height: 4, borderRadius: 20, width: `${progress.percentage}%`, transition: "width 0.5s ease" }} />
              </div>
              <div style={{ fontSize: 11, color: TEXT_SEC }}>{progress.completedModules} of {progress.totalModules} modules</div>
            </div>
          </aside>

          {/* ── MAIN CONTENT ── */}
          <main className="bw-main" ref={mainRef} style={css.main}>

            {/* PROJECT OVERVIEW */}
            <section style={{ marginBottom: 36 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
                <span style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase",
                  color: ACCENT, background: "rgba(110,231,183,0.07)",
                  border: "1px solid rgba(110,231,183,0.18)", padding: "3px 10px", borderRadius: 20,
                }}>
                  {project.category}
                </span>
                <DifficultyBadge level={project.difficulty} />
              </div>

              <h1 style={{
                fontFamily: SERIF, fontSize: 36, lineHeight: 1.15, marginBottom: 14,
                background: `linear-gradient(135deg, #fff 55%, rgba(110,231,183,0.75))`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                {project.title}
              </h1>

              <div style={{ display: "flex", gap: 28, flexWrap: "wrap", marginBottom: 18 }}>
                {[
                  ["⏱", project.duration],
                  ["👥", `${(project.learners / 1000).toFixed(1)}k learners`],
                  ["★", `${project.rating} rating`],
                ].map(([icon, val]) => (
                  <div key={val} style={{ fontSize: 13, color: TEXT_SEC, display: "flex", alignItems: "center", gap: 5 }}>
                    <span>{icon}</span><span>{val}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {project.techStack.map((t) => <span key={t} style={css.tag}>{t}</span>)}
              </div>
            </section>

            {/* CELEBRATION BANNER — shown above module view when all done */}
            {allDone && (
              <div style={{ marginBottom: 32 }}>
                <CelebrationCard project={project} onDashboard={() => {}} onNext={() => {}} />
              </div>
            )}

            {/* MODULE VIEW — always rendered so completed modules stay browsable */}
            {activeModule ? (
              <>
                {/* MODULE HEADER */}
                <section style={{ ...css.glassCard, marginBottom: 24 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: ACCENT, marginBottom: 6 }}>
                        Module {String(activeIndex + 1).padStart(2, "0")}
                      </div>
                      <h2 style={{ fontFamily: SERIF, fontSize: 26, marginBottom: 8, color: TEXT }}>
                        {activeModule.title}
                      </h2>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                        <StatusBadge status={moduleStatus(activeModule)} />
                        <span style={{ fontSize: 12, color: TEXT_SEC, display: "flex", alignItems: "center", gap: 4 }}>
                          ⏱ {activeModule.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* OVERVIEW */}
                <section style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: ACCENT, marginBottom: 10 }}>
                    Overview
                  </div>
                  <p style={{ fontSize: 15, lineHeight: 1.8, color: TEXT_SEC }}>{activeModule.description}</p>
                </section>

                {/* PDF VIEWER */}
                <section style={{ marginBottom: 28 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: ACCENT, marginBottom: 12 }}>
                    Learning Material
                  </div>
                  <PDFViewer pdfUrl={activeModule.pdfUrl} />
                </section>

                {/* ACTIONS */}
                <section style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", paddingBottom: 60 }}>
                  {!activeModule.completed && (
                    <button style={css.btnPrimary} onClick={() => setShowModal(true)}>
                      Mark as Completed ✓
                    </button>
                  )}
                  {activeModule.completed && (
                    <div style={{
                      display: "flex", alignItems: "center", gap: 8,
                      background: "rgba(110,231,183,0.07)",
                      border: "1px solid rgba(110,231,183,0.18)",
                      borderRadius: 8, padding: "10px 18px",
                      fontSize: 13, color: ACCENT, fontWeight: 600,
                    }}>
                      ✓ Module Completed
                    </div>
                  )}
                  <div style={{ flex: 1 }} />
                  {prevModule ? (
                    <button className="bw-btn-secondary" style={css.btnSecondary} onClick={() => selectModule(prevModule)}>
                      ← Previous
                    </button>
                  ) : (
                    <button style={css.btnDisabled} disabled>← Previous</button>
                  )}
                  {nextModule && nextModule.unlocked ? (
                    <button className="bw-btn-secondary" style={css.btnSecondary} onClick={() => selectModule(nextModule)}>
                      Next →
                    </button>
                  ) : (
                    <button style={css.btnDisabled} disabled title={nextModule ? "Complete this module to unlock" : "Last module"}>
                      Next {nextModule ? "🔒" : ""}
                    </button>
                  )}
                </section>
              </>
            ) : null /* activeModule */}
          </main>

          {/* ── RIGHT SIDEBAR ── */}
          <aside className="bw-sidebar-right" style={css.sidebarRight}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: TEXT_SEC, marginBottom: 12 }}>
              Your Progress
            </div>

            <div style={{ ...css.glassCard, textAlign: "center", marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}>
                <ProgressRing pct={progress.percentage} />
              </div>
              <div style={{ fontSize: 12, color: TEXT_SEC }}>
                {progress.completedModules} of {progress.totalModules} modules
              </div>
            </div>

            <div style={{ ...css.glassCard, marginBottom: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: TEXT_SEC, marginBottom: 6 }}>
                Current Module
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 3 }}>{activeModule?.title}</div>
              <div style={{ fontSize: 11, color: TEXT_SEC }}>{activeModule?.duration}</div>
            </div>

            <div style={{ ...css.glassCard, marginBottom: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: TEXT_SEC, marginBottom: 6 }}>
                Time Remaining
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: TEXT }}>{timeRemaining.toFixed(1)}</div>
              <div style={{ fontSize: 11, color: TEXT_SEC }}>hours estimated</div>
            </div>

            <div style={{ ...css.glassCard, marginBottom: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: TEXT_SEC, marginBottom: 8 }}>
                Modules Completed
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: ACCENT, marginBottom: 8 }}>
                {progress.completedModules}{" "}
                <span style={{ fontSize: 13, color: TEXT_SEC, fontWeight: 400 }}>/ {progress.totalModules}</span>
              </div>
              <div style={{ background: COLORS.faintSolid, borderRadius: 20, height: 4 }}>
                <div style={{ background: ACCENT, height: 4, borderRadius: 20, width: `${progress.percentage}%`, transition: "width 0.5s ease" }} />
              </div>
            </div>

            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: TEXT_SEC, marginBottom: 8 }}>
              Stack
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {project.techStack.map((t) => <span key={t} style={css.tag}>{t}</span>)}
            </div>
          </aside>
        </div>
      </div>

      {/* COMPLETION MODAL */}
      {showModal && <Modal onCancel={() => setShowModal(false)} onConfirm={handleMarkComplete} />}
    </div>
  );
}
