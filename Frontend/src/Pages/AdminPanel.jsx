import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, FolderOpen, BookOpen, Trophy, Settings,
  Bell, Activity, Shield, Plus, Search, Edit2, Trash2,
  Eye, X, Check, AlertTriangle, TrendingUp, Zap,
  Database, Cpu, Globe, BarChart2, RefreshCw,
  UserCheck, UserX, ChevronRight, ChevronLeft, ArrowUpRight,
  Layers, CheckCircle, MoreHorizontal, Menu,
} from "lucide-react";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  getAdminDashboardSummary,
  getAdminProjects,
  getAdminUsers,
  getAdminLearningPaths,
  getAdminAchievements,
} from "../Services/adminService";
import { COLORS, FONTS } from "../Constants/theme";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
// Mint accent: #6ee7b7 / emerald-300  (primary accent, matches Dashboard)
// Surfaces:    #0a0a0a base · #111318 card · #0d0f14 card-alt
// Borders:     white/5 default · white/10 hover
// Text:        white full · white/60 secondary · white/35 muted · white/20 faint

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function AdminPanel({ user = { role: "admin", name: "Debjit Dey" } }) {
  // Role protection
  if (!user || user.role !== "admin") return <AccessDenied />;

  const [section, setSection] = useState("overview");
  const [collapsed, setCollapsed] = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [summary, setSummary]   = useState(null);
  const [projects, setProjects] = useState([]);
  const [users, setUsers]       = useState([]);
  const [paths, setPaths]       = useState([]);
  const [badges, setBadges]     = useState([]);

  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const sideWidth = collapsed ? 56 : 216;

  useEffect(() => {
    getAdminDashboardSummary().then(setSummary);
    getAdminProjects().then(setProjects);
    getAdminUsers().then(setUsers);
    getAdminLearningPaths().then(setPaths);
    getAdminAchievements().then(setBadges);
  }, []);

  const stats        = summary?.metrics     ?? {};
  const activity     = summary?.activity    ?? [];
  const notifications= summary?.notifications ?? [];
  const chartUserGrowth      = summary?.charts?.userGrowth      ?? [];
  const chartProjectViews    = summary?.charts?.projectViews    ?? [];
  const chartPathCompletions = summary?.charts?.pathCompletions ?? [];

  const sectionMap = {
    overview: null,
    projects: (
      <ProjectManagement
        projects={projects}
        setProjects={setProjects}
        onAddProject={() => setShowAddProject(true)}
      />
    ),
    paths: <LearningPathManagement paths={paths} setPaths={setPaths} />,
    users: <UserManagement users={users} setUsers={setUsers} />,
    analytics: (
      <AnalyticsSection
        chartUserGrowth={chartUserGrowth}
        chartProjectViews={chartProjectViews}
        chartPathCompletions={chartPathCompletions}
      />
    ),
    moderation: <ContentModeration />,
    achievements: <AchievementManagement badges={badges} setBadges={setBadges} />,
    settings: <SystemSettings />,
    activity: <ActivityFeed activity={activity} />,
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600&display=swap');
        *, *::before, *::after { box-sizing: border-box; font-family: 'DM Sans', -apple-system, sans-serif; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.07); border-radius: 99px; }
        select option { background: #0d0f14; color: white; }
      `}</style>

      <Sidebar active={section} onSelect={setSection} collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />

      <motion.main
        animate={{ marginLeft: sideWidth }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="min-h-screen"
      >
        {/* Top Bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-3.5 border-b border-white/5 bg-[#0a0a0a]/95 backdrop-blur-xl">
          <div>
            <h1 className="text-sm font-semibold text-white/85">
              {NAV.find((n) => n.id === section)?.label || "Overview"}
            </h1>
            <p className="text-xs text-white/25 mt-0.5">{today}</p>
          </div>
          <div className="flex items-center gap-2">
            <PrimaryButton small icon={Plus} onClick={() => setShowAddProject(true)}>Add Project</PrimaryButton>
            <GhostButton small icon={BookOpen} onClick={() => setSection("paths")}>Add Path</GhostButton>
            <GhostButton small icon={Users} onClick={() => setSection("users")}>Manage Users</GhostButton>
            <div className="relative">
              <button onClick={() => setShowNotifs((v) => !v)}
                className="relative p-2 rounded-lg border border-white/7 text-white/30 hover:text-white/60 hover:border-white/15 transition-colors">
                <Bell size={14} />
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-rose-500 text-[9px] font-bold flex items-center justify-center text-white leading-none">
                  {notifications.length}
                </span>
              </button>
              <NotificationPanel open={showNotifs} onClose={() => setShowNotifs(false)} notifications={notifications} />
            </div>
            <div className="w-7 h-7 rounded-full bg-white/6 border border-white/10 flex items-center justify-center text-xs font-semibold text-white/60 flex-shrink-0">
              {user.name?.[0] || "A"}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6 space-y-6 max-w-7xl">

          {section === "overview" && (
            <>
              {/* Admin hero */}
              <motion.div {...fadeUp(0)}
                className="rounded-2xl border border-white/5 bg-[#111318] px-6 py-5">
                <div className="flex items-center gap-2.5 mb-1">
                  <h2 className="text-base font-semibold text-white">Welcome back, {user.name?.split(" ")[0]}</h2>
                  <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-400/10 border border-emerald-400/15 text-emerald-400 flex items-center gap-1">
                    <Shield size={9} strokeWidth={2.5} /> Admin
                  </span>
                </div>
                <p className="text-xs text-white/35">Here's what's happening across the BuildWise platform today.</p>
              </motion.div>

              {/* Stat cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <StatCard icon={Users}       label="Total Users"     value={stats.totalUsers        ?? 0} delay={0.05} />
                <StatCard icon={FolderOpen}  label="Total Projects"  value={stats.totalProjects     ?? 0} delay={0.08} />
                <StatCard icon={BookOpen}    label="Learning Paths"  value={stats.totalLearningPaths?? 0} delay={0.11} />
                <StatCard icon={CheckCircle} label="Completions"     value={stats.totalCompletions  ?? 0} delay={0.14} />
                <StatCard icon={Zap}         label="Active Users"    value={stats.activeUsers       ?? 0} delay={0.17} />
                <StatCard icon={TrendingUp}  label="New This Week"   value={stats.newUsersThisWeek  ?? 0} delay={0.20} />
              </div>

              <AnalyticsSection
                chartUserGrowth={chartUserGrowth}
                chartProjectViews={chartProjectViews}
                chartPathCompletions={chartPathCompletions}
              />
              <ContentModeration />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <ActivityFeed activity={activity} />

                {/* Quick Stats */}
                <motion.section {...fadeUp(0.15)}>
                  <SectionHeader title="Quick Stats" />
                  <div className="space-y-2">
                    {[
                      { label: "Project Completion Rate", value: "68%", bar: 68 },
                      { label: "User Growth Rate (MoM)", value: "+14.8%", bar: 74 },
                      { label: "Weekly Engagement", value: "83%", bar: 83 },
                    ].map(({ label, value, bar }, i) => (
                      <div key={label} className="px-4 py-3.5 rounded-xl border border-white/5 bg-[#111318] hover:border-white/10 transition-colors">
                        <div className="flex justify-between items-center mb-2.5">
                          <span className="text-xs text-white/50">{label}</span>
                          <span className="text-sm font-semibold text-white/80">{value}</span>
                        </div>
                        <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${bar}%` }}
                            transition={{ delay: 0.5 + i * 0.1, duration: 0.7, ease: "easeOut" }}
                            className="h-full rounded-full bg-emerald-400/60"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.section>
              </div>
            </>
          )}

          {/* Routed sections */}
          <AnimatePresence mode="wait">
            {section !== "overview" && (
              <motion.div key={section}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: "easeOut" }}>
                {sectionMap[section]}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.main>

      {/* Modals */}
      <AnimatePresence>
        {showAddProject && (
          <AddProjectModal
            onClose={() => setShowAddProject(false)}
            onSave={(form) => {
              setProjects((prev) => [...prev, {
                id: Date.now(), name: form.title, category: form.category || "Web Dev",
                difficulty: form.difficulty, tech: form.techStack.split(",").map((t) => t.trim()).filter(Boolean),
                status: "Draft", created: new Date().toISOString().slice(0, 10),
              }]);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const difficultyColor = (d) => ({
  Beginner: "text-emerald-400 bg-emerald-400/8 border-emerald-400/15",
  Intermediate: "text-white/50 bg-white/5 border-white/10",
  Advanced: "text-rose-400 bg-rose-400/8 border-rose-400/15",
}[d] || "text-white/35 bg-white/4 border-white/8");

const statusColor = (s) => ({
  Published: "text-emerald-400 bg-emerald-400/8 border-emerald-400/15",
  Draft: "text-white/35 bg-white/4 border-white/8",
  Review: "text-white/60 bg-white/5 border-white/10",
}[s] || "text-white/35 bg-white/4 border-white/8");

const roleColor = (r) => ({
  admin: "text-emerald-400 bg-emerald-400/8 border-emerald-400/15",
  moderator: "text-white/60 bg-white/5 border-white/10",
  user: "text-white/35 bg-white/4 border-white/8",
}[r] || "text-white/35 bg-white/4 border-white/8");

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.35, ease: [0.16, 1, 0.3, 1] },
});

// ─── PRIMITIVES ───────────────────────────────────────────────────────────────

function Badge({ label, colorClass }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${colorClass}`}>
      {label}
    </span>
  );
}

function Counter({ target }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let v = 0;
    const step = Math.ceil(target / 55);
    const t = setInterval(() => {
      v += step;
      if (v >= target) { setCount(target); clearInterval(t); }
      else setCount(v);
    }, 16);
    return () => clearInterval(t);
  }, [target]);
  return <>{count.toLocaleString()}</>;
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0d0f14] border border-white/8 rounded-xl px-3 py-2 text-xs shadow-xl">
      <p className="font-medium text-white/70 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-emerald-400">{p.name}: {p.value.toLocaleString()}</p>
      ))}
    </div>
  );
};

// ─── LAYOUT PRIMITIVES ────────────────────────────────────────────────────────

function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div>
        <h2 className="text-sm font-semibold text-white tracking-tight">{title}</h2>
        {subtitle && <p className="text-xs text-white/35 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function PrimaryButton({ onClick, icon: Icon, children, small = false }) {
  return (
    <motion.button
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      onClick={onClick}
      className={`flex items-center gap-1.5 bg-emerald-400 text-black font-semibold rounded-lg hover:bg-emerald-300 transition-colors ${small ? "px-3 py-1.5 text-xs" : "px-3.5 py-2 text-sm"}`}
    >
      {Icon && <Icon size={small ? 12 : 14} strokeWidth={2.5} />}
      {children}
    </motion.button>
  );
}

function GhostButton({ onClick, icon: Icon, children, small = false, danger = false }) {
  return (
    <motion.button
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      onClick={onClick}
      className={`flex items-center gap-1.5 border rounded-lg font-medium transition-colors ${danger
        ? "border-rose-500/20 text-rose-400/80 hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/5"
        : "border-white/8 text-white/40 hover:text-white/80 hover:border-white/15 bg-transparent"
        } ${small ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm"}`}
    >
      {Icon && <Icon size={small ? 11 : 13} />}
      {children}
    </motion.button>
  );
}

function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="relative">
      <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Search…"}
        className="w-full bg-[#0d0f14] border border-white/7 rounded-lg pl-8.5 pr-4 py-2 text-sm text-white/80 placeholder-white/20 focus:outline-none focus:border-white/15 transition-colors"
      />
    </div>
  );
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, delay = 0 }) {
  return (
    <motion.div
      {...fadeUp(delay)}
      whileHover={{ y: -2 }}
      transition={{ ...fadeUp(delay).transition, hover: { duration: 0.2 } }}
      className="rounded-2xl border border-white/5 bg-[#111318] p-5 cursor-default hover:border-white/10 transition-colors"
    >
      <div className="flex items-center justify-between mb-4">
        <Icon size={14} className="text-white/20" />
        <ArrowUpRight size={12} className="text-white/15" />
      </div>
      <p className="text-2xl font-semibold text-white tracking-tight tabular-nums">
        <Counter target={typeof value === "number" ? value : 0} />
      </p>
      <p className="text-xs text-white/35 mt-1.5">{label}</p>
    </motion.div>
  );
}

// ─── MODALS ───────────────────────────────────────────────────────────────────

const inputCls = "w-full bg-[#0a0a0a] border border-white/7 rounded-lg px-3.5 py-2.5 text-sm text-white/80 placeholder-white/18 focus:outline-none focus:border-white/18 transition-colors";
const labelCls = "block text-xs text-white/40 mb-1.5 font-medium";

function AddProjectModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    title: "", description: "", difficulty: "Beginner", category: "",
    duration: "", techStack: "", github: "", demo: "", thumbnail: "", outcomes: "",
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.97 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/8 bg-[#0d0f14] shadow-2xl"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <div>
            <h3 className="text-sm font-semibold text-white">Add New Project</h3>
            <p className="text-xs text-white/35 mt-0.5">Fill in the details to publish a new project</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg border border-white/8 text-white/30 hover:text-white/70 hover:border-white/15 transition-colors">
            <X size={14} />
          </button>
        </div>
        <div className="p-6 grid grid-cols-2 gap-4">
          {[
            { label: "Project Title", key: "title", span: 2, placeholder: "Build a Full-Stack Todo App" },
            { label: "Category", key: "category", placeholder: "Web Dev, AI/ML, Web3…" },
            { label: "Estimated Duration", key: "duration", placeholder: "e.g. 3 days" },
            { label: "GitHub Link", key: "github", placeholder: "https://github.com/…" },
            { label: "Live Demo Link", key: "demo", placeholder: "https://demo.example.com" },
            { label: "Thumbnail URL", key: "thumbnail", span: 2, placeholder: "https://…/thumbnail.png" },
          ].map(({ label, key, span, placeholder }) => (
            <div key={key} className={span === 2 ? "col-span-2" : ""}>
              <label className={labelCls}>{label}</label>
              <input value={form[key]} onChange={(e) => set(key, e.target.value)} placeholder={placeholder} className={inputCls} />
            </div>
          ))}
          <div>
            <label className={labelCls}>Difficulty</label>
            <select value={form.difficulty} onChange={(e) => set("difficulty", e.target.value)}
              className={inputCls + " appearance-none"}>
              {["Beginner", "Intermediate", "Advanced"].map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Tech Stack</label>
            <input value={form.techStack} onChange={(e) => set("techStack", e.target.value)}
              placeholder="React, Node.js, MongoDB…" className={inputCls} />
          </div>
          <div className="col-span-2">
            <label className={labelCls}>Description</label>
            <textarea value={form.description} onChange={(e) => set("description", e.target.value)}
              rows={3} placeholder="A brief description of what the project teaches…"
              className={inputCls + " resize-none"} />
          </div>
          <div className="col-span-2">
            <label className={labelCls}>Learning Outcomes</label>
            <textarea value={form.outcomes} onChange={(e) => set("outcomes", e.target.value)}
              rows={3} placeholder="What will the learner be able to do after completing this project?"
              className={inputCls + " resize-none"} />
          </div>
        </div>
        <div className="flex justify-end gap-2.5 px-6 py-5 border-t border-white/5">
          <GhostButton onClick={onClose} icon={X}>Cancel</GhostButton>
          <PrimaryButton onClick={() => { onSave(form); onClose(); }} icon={Check}>Save Project</PrimaryButton>
        </div>
      </motion.div>
    </motion.div>
  );
}

function AchievementModal({ onClose, initial = null, onSave }) {
  const [form, setForm] = useState(initial || { name: "", description: "", icon: "🏆", xp: 100 });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.97 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-white/8 bg-[#0d0f14] shadow-2xl"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <h3 className="text-sm font-semibold text-white">{initial ? "Edit Achievement" : "Create Achievement"}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg border border-white/8 text-white/30 hover:text-white/70 hover:border-white/15 transition-colors">
            <X size={14} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          {[
            { label: "Achievement Name", key: "name", placeholder: "Stack Master" },
            { label: "Description", key: "description", placeholder: "Use 5+ tech stacks" },
            { label: "Badge Icon (emoji)", key: "icon", placeholder: "🏆" },
          ].map(({ label, key, placeholder }) => (
            <div key={key}>
              <label className={labelCls}>{label}</label>
              <input value={form[key]} onChange={(e) => set(key, e.target.value)} placeholder={placeholder} className={inputCls} />
            </div>
          ))}
          <div>
            <label className={labelCls}>XP Reward</label>
            <input type="number" value={form.xp} onChange={(e) => set("xp", Number(e.target.value))} placeholder="100" className={inputCls} />
          </div>
        </div>
        <div className="flex justify-end gap-2.5 px-6 py-5 border-t border-white/5">
          <GhostButton onClick={onClose} icon={X}>Cancel</GhostButton>
          <PrimaryButton onClick={() => { onSave(form); onClose(); }} icon={Check}>Save Achievement</PrimaryButton>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── SECTIONS ─────────────────────────────────────────────────────────────────

function ProjectManagement({ projects, setProjects, onAddProject }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filtered = projects.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || p.difficulty === filter;
    return matchSearch && matchFilter;
  });

  // TODO: Fetch projects from database
  // TODO: Create project API
  // TODO: Update project API
  // TODO: Delete project API

  return (
    <motion.section {...fadeUp(0.1)} className="rounded-2xl border border-white/5 bg-[#111318]">
      <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
        <SectionHeader
          title="Project Management"
          subtitle={`${projects.length} total`}
          action={<PrimaryButton onClick={onAddProject} icon={Plus} small>Add Project</PrimaryButton>}
        />
      </div>
      <div className="px-6 pb-2 pt-4 flex flex-col sm:flex-row gap-3">
        <div className="flex-1"><SearchBar value={search} onChange={setSearch} placeholder="Search projects…" /></div>
        <div className="flex gap-1.5 flex-wrap">
          {["All", "Beginner", "Intermediate", "Advanced"].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${filter === f
                ? "bg-emerald-400/10 text-emerald-400 border-emerald-400/20"
                : "border-white/7 text-white/35 hover:text-white/70 hover:border-white/15"
                }`}>
              {f}
            </button>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto px-6 pb-6 pt-2">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              {["Project Name", "Category", "Difficulty", "Tech Stack", "Status", "Created", "Actions"].map((h) => (
                <th key={h} className="text-left text-xs text-white/25 font-medium pb-3 pr-6 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filtered.map((p, i) => (
                <motion.tr key={p.id}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-white/4 last:border-0 hover:bg-white/2 transition-colors group">
                  <td className="py-3 pr-6 font-medium text-white/85 whitespace-nowrap text-sm">{p.name}</td>
                  <td className="py-3 pr-6 text-white/40 whitespace-nowrap text-xs">{p.category}</td>
                  <td className="py-3 pr-6 whitespace-nowrap"><Badge label={p.difficulty} colorClass={difficultyColor(p.difficulty)} /></td>
                  <td className="py-3 pr-6">
                    <div className="flex gap-1 flex-wrap">
                      {p.tech.slice(0, 3).map((t) => (
                        <span key={t} className="text-xs px-1.5 py-0.5 rounded bg-white/4 text-white/40 border border-white/6">{t}</span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 pr-6 whitespace-nowrap"><Badge label={p.status} colorClass={statusColor(p.status)} /></td>
                  <td className="py-3 pr-6 text-white/25 text-xs whitespace-nowrap">{p.created}</td>
                  <td className="py-3">
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <GhostButton small icon={Eye} onClick={() => {}}>View</GhostButton>
                      <GhostButton small icon={Edit2} onClick={() => {}}>Edit</GhostButton>
                      <GhostButton small danger icon={Trash2} onClick={() => setProjects((prev) => prev.filter((x) => x.id !== p.id))}>Del</GhostButton>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-white/25 text-sm">No projects match your search.</div>
        )}
      </div>
    </motion.section>
  );
}

function LearningPathManagement({ paths, setPaths }) {
  // TODO: Learning path CRUD API
  return (
    <motion.section {...fadeUp(0.1)} className="rounded-2xl border border-white/5 bg-[#111318] p-6">
      <SectionHeader title="Learning Paths" subtitle={`${paths.length} paths`}
        action={<PrimaryButton small icon={Plus} onClick={() => {}}>Add Path</PrimaryButton>} />
      <div className="grid gap-2">
        {paths.map((lp, i) => (
          <motion.div key={lp.id}
            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
            className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5 rounded-xl border border-white/5 bg-[#0a0a0a] hover:border-white/10 transition-colors group">
            <div className="flex items-center gap-3">
              <BookOpen size={13} className="text-white/20 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-white/85">{lp.name}</p>
                <p className="text-xs text-white/30 mt-0.5">{lp.modules} modules · {lp.duration}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Badge label={lp.difficulty} colorClass={difficultyColor(lp.difficulty)} />
              <Badge label={lp.status} colorClass={statusColor(lp.status)} />
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <GhostButton small icon={Eye} onClick={() => {}}>View</GhostButton>
                <GhostButton small icon={Edit2} onClick={() => {}}>Edit</GhostButton>
                <GhostButton small danger icon={Trash2} onClick={() => setPaths((p) => p.filter((x) => x.id !== lp.id))}>Del</GhostButton>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

function UserManagement({ users, setUsers }) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [page, setPage] = useState(1);
  const PER_PAGE = 4;

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)) &&
      (roleFilter === "All" || u.role === roleFilter);
  });
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const promote = (id) => setUsers((u) => u.map((x) => x.id === id ? { ...x, role: "admin" } : x));
  const demote  = (id) => setUsers((u) => u.map((x) => x.id === id ? { ...x, role: "user"  } : x));
  const remove  = (id) => setUsers((u) => u.filter((x) => x.id !== id));

  // TODO: User management API

  return (
    <motion.section {...fadeUp(0.1)} className="rounded-2xl border border-white/5 bg-[#111318] p-6">
      <SectionHeader title="User Management" subtitle={`${users.length} registered users`} />
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex-1"><SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search users…" /></div>
        <div className="flex gap-1.5">
          {["All", "admin", "moderator", "user"].map((r) => (
            <button key={r} onClick={() => { setRoleFilter(r); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors capitalize ${roleFilter === r
                ? "bg-emerald-400/10 text-emerald-400 border-emerald-400/20"
                : "border-white/7 text-white/35 hover:text-white/70 hover:border-white/15"
                }`}>
              {r}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <AnimatePresence>
          {paginated.map((u, i) => (
            <motion.div key={u.id}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5 rounded-xl border border-white/5 bg-[#0a0a0a] hover:border-white/10 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/8 flex items-center justify-center text-xs font-semibold text-white/60 flex-shrink-0">
                  {u.name[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-white/85">{u.name}</p>
                  <p className="text-xs text-white/35">{u.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <Badge label={u.role} colorClass={roleColor(u.role)} />
                <span className="text-xs text-white/25 hidden sm:block">Joined {u.joined}</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-400/60" style={{ width: `${u.progress}%` }} />
                  </div>
                  <span className="text-xs text-white/30">{u.progress}%</span>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {u.role !== "admin"
                    ? <GhostButton small icon={UserCheck} onClick={() => promote(u.id)}>Promote</GhostButton>
                    : <GhostButton small icon={UserX} onClick={() => demote(u.id)}>Demote</GhostButton>}
                  <GhostButton small danger icon={Trash2} onClick={() => remove(u.id)}>Delete</GhostButton>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-5">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
            className="p-1.5 rounded-lg border border-white/7 text-white/30 hover:text-white/60 disabled:opacity-30 transition-colors">
            <ChevronLeft size={13} />
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)}
              className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${page === i + 1
                ? "bg-emerald-400 text-black"
                : "text-white/35 hover:text-white/70 border border-white/7"
                }`}>
              {i + 1}
            </button>
          ))}
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="p-1.5 rounded-lg border border-white/7 text-white/30 hover:text-white/60 disabled:opacity-30 transition-colors">
            <ChevronRight size={13} />
          </button>
        </div>
      )}
    </motion.section>
  );
}

function AnalyticsSection({ chartUserGrowth = [], chartProjectViews = [], chartPathCompletions = [] }) {
  return (
    <motion.section {...fadeUp(0.1)} className="space-y-4">
      <SectionHeader title="Analytics" subtitle="Platform engagement overview" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-1">
        {[
          { label: "Most Viewed Project", value: "AI Chat Interface", sub: "2,481 views", icon: Eye },
          { label: "Most Popular Path", value: "Frontend Mastery", sub: "312 completions", icon: TrendingUp },
          { label: "Most Active User", value: "Debjit Roy", sub: "92% completion rate", icon: Zap },
        ].map(({ label, value, sub, icon: Icon }) => (
          <div key={label} className="rounded-xl border border-white/5 bg-[#111318] px-5 py-4 hover:border-white/10 transition-colors">
            <div className="flex items-center gap-1.5 mb-2.5">
              <Icon size={12} className="text-white/20" />
              <span className="text-xs text-white/30">{label}</span>
            </div>
            <p className="text-sm font-semibold text-white/85">{value}</p>
            <p className="text-xs text-white/25 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* User Growth */}
        <div className="rounded-xl border border-white/5 bg-[#111318] p-5">
          <p className="text-xs text-white/30 mb-4">User Growth</p>
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={chartUserGrowth}>
              <defs>
                <linearGradient id="gMint" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6ee7b7" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#6ee7b7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="users" name="Users" stroke="#6ee7b7" strokeWidth={1.5} fill="url(#gMint)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        {/* Project Views */}
        <div className="rounded-xl border border-white/5 bg-[#111318] p-5">
          <p className="text-xs text-white/30 mb-4">Project Views (Weekly)</p>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={chartProjectViews}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="week" tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="views" name="Views" stroke="#6ee7b7" strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* Path Completions */}
        <div className="rounded-xl border border-white/5 bg-[#111318] p-5">
          <p className="text-xs text-white/30 mb-4">Path Completions</p>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={chartPathCompletions} barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="completions" name="Completions" fill="#6ee7b7" fillOpacity={0.7} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.section>
  );
}

function ContentModeration() {
  const items = [
    { label: "Submitted Projects", count: 7, desc: "Projects awaiting admin review", icon: FolderOpen },
    { label: "Reported Content", count: 3, desc: "User-flagged comments and projects", icon: AlertTriangle },
    { label: "Pending Learning Paths", count: 2, desc: "Learning paths in draft/review", icon: BookOpen },
  ];
  return (
    <motion.section {...fadeUp(0.1)}>
      <SectionHeader title="Content Moderation" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {items.map(({ label, count, desc, icon: Icon }) => (
          <div key={label} className="rounded-xl border border-white/5 bg-[#111318] p-5 hover:border-white/10 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <Icon size={13} className="text-white/20 mt-0.5" />
              <span className="text-xl font-semibold text-white/85 tabular-nums">{count}</span>
            </div>
            <p className="text-sm font-medium text-white/80 mb-1">{label}</p>
            <p className="text-xs text-white/30 mb-4 leading-relaxed">{desc}</p>
            <GhostButton small icon={Eye} onClick={() => {}}>Review</GhostButton>
          </div>
        ))}
      </div>
    </motion.section>
  );
}

function AchievementManagement({ badges, setBadges }) {
  const [modal, setModal] = useState(null);

  // TODO: Achievement CRUD API

  return (
    <>
      <motion.section {...fadeUp(0.1)}>
        <SectionHeader title="Achievements" subtitle={`${badges.length} badges`}
          action={<PrimaryButton small icon={Plus} onClick={() => setModal("add")}>Create</PrimaryButton>} />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {badges.map((a) => (
            <motion.div key={a.id} whileHover={{ y: -2 }}
              className="rounded-xl border border-white/5 bg-[#111318] p-5 hover:border-white/10 transition-colors group">
              <div className="flex items-start justify-between mb-4">
                <span className="text-2xl">{a.icon}</span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <GhostButton small icon={Edit2} onClick={() => setModal(a)}>Edit</GhostButton>
                  <GhostButton small danger icon={Trash2} onClick={() => setBadges((prev) => prev.filter((x) => x.id !== a.id))}>Del</GhostButton>
                </div>
              </div>
              <p className="text-sm font-semibold text-white/85">{a.name}</p>
              <p className="text-xs text-white/35 mt-1 mb-3 leading-relaxed">{a.description}</p>
              <div className="flex items-center gap-1.5">
                <Zap size={11} className="text-emerald-400/70" />
                <span className="text-xs text-emerald-400/70 font-medium">{a.xp} XP</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
      <AnimatePresence>
        {modal && (
          <AchievementModal
            initial={modal === "add" ? null : modal}
            onClose={() => setModal(null)}
            onSave={(form) => {
              if (modal === "add") {
                setBadges((prev) => [...prev, { ...form, id: Date.now() }]);
              } else {
                setBadges((prev) => prev.map((x) => x.id === modal.id ? { ...x, ...form } : x));
              }
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
  const toggle = (k) => setSettings((s) => ({ ...s, [k]: !s[k] }));

  const items = [
    { key: "maintenance", label: "Maintenance Mode", desc: "Temporarily disable user access to the platform", danger: true },
    { key: "registration", label: "User Registration", desc: "Allow new users to sign up" },
    { key: "darkMode", label: "Force Dark Mode", desc: "Override all user theme preferences" },
    { key: "emailNotifs", label: "Email Notifications", desc: "Send transactional emails to users" },
    { key: "betaFeatures", label: "Beta Features", desc: "Enable experimental features for all users" },
  ];

  const health = [
    { label: "Database", icon: Database },
    { label: "API", icon: Cpu },
    { label: "CDN", icon: Globe },
  ];

  return (
    <motion.section {...fadeUp(0.1)}>
      <SectionHeader title="System Settings" subtitle="Admin-only platform configuration" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-[#111318] p-5 space-y-2">
          {items.map(({ key, label, desc, danger }) => (
            <div key={key} className={`flex items-center justify-between px-4 py-3.5 rounded-xl border transition-colors ${danger && settings[key]
              ? "border-rose-500/15 bg-rose-500/4"
              : "border-white/5 bg-[#0a0a0a] hover:border-white/10"
              }`}>
              <div>
                <p className={`text-sm font-medium ${danger && settings[key] ? "text-rose-400" : "text-white/80"}`}>{label}</p>
                <p className="text-xs text-white/30 mt-0.5">{desc}</p>
              </div>
              <button onClick={() => toggle(key)}
                className={`relative flex-shrink-0 rounded-full transition-colors ${settings[key] ? (danger ? "bg-rose-500" : "bg-emerald-400") : "bg-white/10"}`}
                style={{ width: 36, height: 20 }}>
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${settings[key] ? "translate-x-[17px]" : "translate-x-0.5"}`} />
              </button>
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-white/5 bg-[#111318] p-5">
          <p className="text-xs font-medium text-white/40 mb-4">Service Health</p>
          <div className="space-y-2">
            {health.map(({ label, icon: Icon }) => (
              <div key={label} className="flex items-center justify-between px-3.5 py-3 rounded-xl bg-[#0a0a0a] border border-white/5">
                <div className="flex items-center gap-2.5">
                  <Icon size={12} className="text-white/25" />
                  <span className="text-sm text-white/55">{label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-xs text-emerald-400/70">Healthy</span>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-3 w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-white/7 text-xs text-white/35 hover:text-white/60 hover:border-white/15 transition-colors">
            <RefreshCw size={11} />
            Refresh Status
          </button>
        </div>
      </div>
    </motion.section>
  );
}

function ActivityFeed({ activity = [] }) {
  return (
    <motion.section {...fadeUp(0.1)}>
      <SectionHeader title="Activity Feed" subtitle="Recent admin actions" />
      <div className="rounded-2xl border border-white/5 bg-[#111318] p-5">
        {activity.map((item, i) => {
          // Support both direct icon component (legacy) and iconKey string from service layer
          const iconMap = { FolderOpen, UserCheck, BookOpen, Trophy, Trash2 };
          const Icon = item.icon ?? iconMap[item.iconKey] ?? Activity;
          return (
            <motion.div key={item.id}
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
              className="flex gap-3.5 relative">
              {i < activity.length - 1 && (
                <div className="absolute left-[15px] top-8 bottom-0 w-px bg-white/4" />
              )}
              <div className="p-2 rounded-lg bg-white/4 border border-white/6 flex-shrink-0 z-10 h-fit mt-0.5">
                <Icon size={12} className="text-white/30" />
              </div>
              <div className="pb-5 flex-1 min-w-0">
                <p className="text-sm font-medium text-white/75">{item.action}</p>
                <p className="text-xs text-white/35 mt-0.5 truncate">{item.detail}</p>
                <p className="text-xs text-white/20 mt-1">{item.time}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────

const NAV = [
  { id: "overview",    label: "Overview",       icon: LayoutDashboard },
  { id: "projects",    label: "Projects",        icon: FolderOpen },
  { id: "paths",       label: "Learning Paths",  icon: BookOpen },
  { id: "users",       label: "Users",           icon: Users },
  { id: "analytics",   label: "Analytics",       icon: BarChart2 },
  { id: "moderation",  label: "Moderation",      icon: Shield },
  { id: "achievements",label: "Achievements",    icon: Trophy },
  { id: "settings",    label: "Settings",        icon: Settings },
  { id: "activity",    label: "Activity",        icon: Activity },
];

function Sidebar({ active, onSelect, collapsed, onToggle }) {
  return (
    <motion.aside
      animate={{ width: collapsed ? 56 : 216 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className="fixed left-0 top-0 h-full z-30 flex flex-col overflow-hidden"
      style={{ background: "#080a0d", borderRight: "1px solid rgba(255,255,255,0.05)" }}
    >
      {/* Logo */}
      <div className={`flex items-center gap-2.5 px-4 py-4 border-b border-white/5 ${collapsed ? "justify-center" : ""}`}>
        <div className="w-6 h-6 rounded-md bg-emerald-400/15 border border-emerald-400/20 flex items-center justify-center flex-shrink-0">
          <Layers size={12} className="text-emerald-400" />
        </div>
        {!collapsed && (
          <span className="font-semibold text-white/85 text-sm tracking-tight whitespace-nowrap">BuildWise</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2.5 space-y-0.5 overflow-y-auto">
        {NAV.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => onSelect(id)}
            title={collapsed ? label : undefined}
            className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors ${active === id
              ? "bg-white/6 text-white font-medium"
              : "text-white/35 hover:text-white/70 hover:bg-white/4"
              } ${collapsed ? "justify-center" : ""}`}>
            <Icon size={14} className="flex-shrink-0" />
            {!collapsed && <span className="whitespace-nowrap">{label}</span>}
          </button>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="p-2.5 border-t border-white/5">
        <button onClick={onToggle}
          className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs text-white/25 hover:text-white/50 hover:bg-white/4 transition-colors ${collapsed ? "justify-center" : ""}`}>
          <Menu size={13} />
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </motion.aside>
  );
}

// ─── NOTIFICATION PANEL ───────────────────────────────────────────────────────

function NotificationPanel({ open, onClose, notifications = [] }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className="absolute right-0 top-11 z-50 w-72 rounded-xl border border-white/8 bg-[#0d0f14] shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
              <span className="text-xs font-semibold text-white/70">Notifications</span>
              <button onClick={onClose} className="text-white/25 hover:text-white/60 transition-colors"><X size={13} /></button>
            </div>
            {notifications.map((n) => (
              <div key={n.id} className="px-4 py-3 hover:bg-white/3 transition-colors border-b border-white/4 last:border-0">
                <p className="text-xs text-white/65">{n.message}</p>
                <p className="text-xs text-white/25 mt-0.5">{n.time}</p>
              </div>
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── ACCESS DENIED ────────────────────────────────────────────────────────────

function AccessDenied() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-sm mx-auto p-8">
        <div className="w-12 h-12 rounded-xl bg-rose-500/8 border border-rose-500/15 flex items-center justify-center mx-auto mb-6">
          <Shield size={20} className="text-rose-400/70" />
        </div>
        <h1 className="text-xl font-semibold text-white mb-3">Access Denied</h1>
        <p className="text-white/40 text-sm mb-6 leading-relaxed">
          You don't have permission to view this page. Admin access is required.
        </p>
        <a href="/" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-400 text-black text-sm font-semibold hover:bg-emerald-300 transition-colors">
          <ChevronLeft size={14} strokeWidth={2.5} /> Return Home
        </a>
      </motion.div>
    </div>
  );
}
