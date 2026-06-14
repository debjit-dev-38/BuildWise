import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, User, Star, Lock, Shield, BookOpen, Code, Rocket, Target, Brain,
  TrendingUp, Settings, Globe, Package, BarChart3, Smartphone, Cloud, Database,
  Search, Lightbulb, GraduationCap, Monitor, Server, Layers, GitBranch,
  Terminal, Workflow, Bell, Mail, Key, Award, Zap, Activity, Cpu, HardDrive,
  Wifi, Gauge, FileText,
  X, Plus, Trash2, ChevronDown, Check, BookmarkIcon, Upload, FileIcon,
  Eye, Save, AlertCircle, GripVertical, Clock, Users2, Star as StarIcon,
} from "lucide-react";

// ─── Icon Registry ─────────────────────────────────────────────────────────────
const ICONS = {
  Users, User, Star, Lock, Shield, BookOpen, Code, Rocket, Target, Brain,
  TrendingUp, Settings, Globe, Package, BarChart3, Smartphone, Cloud, Database,
  Search, Lightbulb, GraduationCap, Monitor, Server, Layers, GitBranch,
  Terminal, Workflow, Bell, Mail, Key, Award, Zap, Activity, Cpu, HardDrive,
  Wifi, Gauge, FileText,
};

// ─── Design Tokens ─────────────────────────────────────────────────────────────
const T = {
  bg: "#0A0A0A",
  surface: "rgba(255,255,255,0.04)",
  surfaceHov: "rgba(255,255,255,0.07)",
  border: "rgba(255,255,255,0.08)",
  borderHov: "rgba(255,255,255,0.16)",
  text: "#FFFFFF",
  muted: "rgba(255,255,255,0.55)",
  faint: "rgba(255,255,255,0.18)",
  faintSolid: "#111",
  // strict accent palette
  green: "#6EE7B7",
  indigo: "#818CF8",
  amber: "#FCD34D",
  pink: "#F9A8D4",
  sans: "'DM Sans', sans-serif",
  serif: "'Instrument Serif', serif",
  mono: "'DM Mono', monospace",
};

const ACCENT_MAP = { green: T.green, indigo: T.indigo, amber: T.amber, pink: T.pink };
const DIFF_COLOR = { Beginner: T.green, Intermediate: T.indigo, Advanced: T.amber, Expert: T.pink };
const CATEGORIES = ["Frontend", "Backend", "Full Stack", "Mobile", "DevOps", "AI/ML", "Data", "Security"];
const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];
const DURATIONS = ["1 Week", "2 Weeks", "3 Weeks", "4 Weeks", "6 Weeks", "8 Weeks", "10 Weeks", "12 Weeks"];
const STATUSES = [
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "coming-soon", label: "Coming Soon" },
];
const TABS = ["Basic Info", "Content", "Tech & Features", "Modules", "Media", "Publish"];

function uid() { return Math.random().toString(36).slice(2, 9); }
function slugify(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
function accentRgb(color) {
  const m = { green: "110,231,183", indigo: "129,140,248", amber: "252,211,77", pink: "249,168,212" };
  return m[color] ?? m.green;
}

const DEFAULT = {
  id: "", name: "", slug: "", description: "", color: "green",
  category: "Full Stack", difficulty: "Intermediate", duration: "8 Weeks",
  durationWeeks: 8, stack: [], metrics: [], image: "", featured: false,
  newest: true, recommended: false, status: "in-progress", summary: "",
  cover: { url: "", publicId: "", originalName: "" }, problem: "", solution: "",
  features: [], gallery: [],
  challenges: [], modules: [], relatedProjectIds: [],
};

// ─── Tiny Primitives ──────────────────────────────────────────────────────────

function Inp({ value, onChange, placeholder, mono = false, disabled = false, type = "text" }) {
  const [f, setF] = useState(false);
  return (
    <input type={type} value={value} onChange={onChange} placeholder={placeholder}
      disabled={disabled}
      onFocus={() => setF(true)} onBlur={() => setF(false)}
      style={{
        width: "100%", background: disabled ? "rgba(255,255,255,0.01)" : T.surface,
        border: `1px solid ${f ? T.green : T.border}`, borderRadius: 8,
        padding: "8px 11px", color: disabled ? T.muted : T.text,
        fontFamily: mono ? T.mono : T.sans, fontSize: 13, outline: "none",
        transition: "border-color 0.2s", boxSizing: "border-box",
        cursor: disabled ? "not-allowed" : "text",
      }}
    />
  );
}

function Txa({ value, onChange, placeholder, rows = 3 }) {
  const [f, setF] = useState(false);
  return (
    <textarea rows={rows} value={value} onChange={onChange} placeholder={placeholder}
      onFocus={() => setF(true)} onBlur={() => setF(false)}
      style={{
        width: "100%", background: T.surface, border: `1px solid ${f ? T.green : T.border}`,
        borderRadius: 8, padding: "8px 11px", color: T.text, fontFamily: T.sans,
        fontSize: 13, outline: "none", resize: "vertical", lineHeight: 1.6,
        transition: "border-color 0.2s", boxSizing: "border-box",
      }}
    />
  );
}

function Sel({ value, onChange, options }) {
  const [f, setF] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <select value={value} onChange={onChange}
        onFocus={() => setF(true)} onBlur={() => setF(false)}
        style={{
          width: "100%", background: T.faintSolid,
          border: `1px solid ${f ? T.green : T.border}`, borderRadius: 8,
          padding: "8px 32px 8px 11px", color: T.text, fontFamily: T.sans,
          fontSize: 13, outline: "none", cursor: "pointer",
          appearance: "none", transition: "border-color 0.2s", boxSizing: "border-box",
        }}>
        {options.map(o => <option key={o.value ?? o} value={o.value ?? o} style={{ background: "#111" }}>{o.label ?? o}</option>)}
      </select>
      <ChevronDown size={13} style={{ position: "absolute", right: 9, top: "50%", transform: "translateY(-50%)", color: T.muted, pointerEvents: "none" }} />
    </div>
  );
}

function Tog({ value, onChange, label }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer", userSelect: "none" }}>
      <div onClick={() => onChange(!value)} style={{
        width: 34, height: 18, borderRadius: 9, transition: "background 0.2s",
        background: value ? T.green : T.border, position: "relative", flexShrink: 0,
      }}>
        <div style={{
          position: "absolute", top: 2, left: value ? 18 : 2, width: 14, height: 14,
          borderRadius: "50%", background: value ? T.bg : T.muted, transition: "left 0.2s",
        }} />
      </div>
      <span style={{ fontFamily: T.sans, fontSize: 13, color: T.muted }}>{label}</span>
    </label>
  );
}

function Lbl({ children, required }) {
  return (
    <div style={{ fontFamily: T.sans, fontSize: 11, fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase", color: T.muted, marginBottom: 6 }}>
      {children}{required && <span style={{ color: "#F87171", marginLeft: 3 }}>*</span>}
    </div>
  );
}

function Field({ label, required, children, hint }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <Lbl required={required}>{label}</Lbl>}
      {children}
      {hint && <div style={{ fontFamily: T.sans, fontSize: 11, color: T.muted, marginTop: 4 }}>{hint}</div>}
    </div>
  );
}

function AddBtn({ onClick, label }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        width: "100%", background: h ? "rgba(110,231,183,0.07)" : "transparent",
        border: `1px dashed ${h ? T.green : T.border}`,
        color: h ? T.green : T.muted, borderRadius: 8, padding: "8px 0",
        fontSize: 13, fontFamily: T.sans, cursor: "pointer", transition: "all 0.2s",
      }}>
      <Plus size={13} />{label}
    </button>
  );
}

function DelBtn({ onClick }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        background: h ? "rgba(248,113,113,0.1)" : "transparent", border: "none",
        borderRadius: 6, cursor: "pointer", color: h ? "#F87171" : T.muted,
        padding: 6, display: "flex", transition: "all 0.15s", flexShrink: 0,
      }}>
      <Trash2 size={13} />
    </button>
  );
}

// ─── Icon Picker ───────────────────────────────────────────────────────────────
function LucideIconPicker({ selected, onSelect, onClose }) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const lq = q.toLowerCase();
    return Object.keys(ICONS).filter(k => k.toLowerCase().includes(lq));
  }, [q]);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 400,
      background: "rgba(0,0,0,0.85)", backdropFilter: "blur(10px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
    }} onClick={onClose}>
      <motion.div initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.18, ease: [0.25, 0.8, 0.25, 1] }}
        style={{
          background: "#0f0f0f", border: `1px solid ${T.border}`,
          borderRadius: 16, width: "100%", maxWidth: 460,
          maxHeight: "78vh", display: "flex", flexDirection: "column",
          boxShadow: "0 32px 80px rgba(0,0,0,0.7)",
        }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: `1px solid ${T.border}` }}>
          <span style={{ fontFamily: T.sans, fontWeight: 600, fontSize: 14, color: T.text }}>Choose Icon</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: T.muted, display: "flex", borderRadius: 6, padding: 4 }}>
            <X size={15} />
          </button>
        </div>
        <div style={{ padding: "10px 14px", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ position: "relative" }}>
            <Search size={13} style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", color: T.muted }} />
            <input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder="Search icons…"
              style={{
                width: "100%", background: T.surface, border: `1px solid ${T.border}`,
                borderRadius: 8, padding: "7px 10px 7px 30px", color: T.text,
                fontFamily: T.sans, fontSize: 13, outline: "none", boxSizing: "border-box",
              }} />
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: 10 }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "28px 0", color: T.muted, fontFamily: T.sans, fontSize: 13 }}>No icons match "{q}"</div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 5 }}>
              {filtered.map(key => {
                const Icon = ICONS[key];
                const sel = selected === key;
                return (
                  <button key={key} onClick={() => { onSelect(key); onClose(); }} title={key}
                    style={{
                      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                      gap: 4, padding: "9px 3px", borderRadius: 8,
                      border: `1px solid ${sel ? T.green : "transparent"}`,
                      background: sel ? "rgba(110,231,183,0.08)" : T.surface,
                      cursor: "pointer", transition: "all 0.15s",
                    }}
                    onMouseEnter={e => { if (!sel) e.currentTarget.style.background = T.surfaceHov; }}
                    onMouseLeave={e => { if (!sel) e.currentTarget.style.background = sel ? "rgba(110,231,183,0.08)" : T.surface; }}>
                    <Icon size={17} color={sel ? T.green : T.muted} />
                    <span style={{ fontFamily: T.sans, fontSize: 8, color: sel ? T.green : T.muted, textAlign: "center", lineHeight: 1.2, wordBreak: "break-word" }}>{key}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ─── Icon Button ───────────────────────────────────────────────────────────────
function IconBtn({ iconKey, onClick, accent }) {
  const Icon = ICONS[iconKey] ?? Package;
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      title="Change icon"
      style={{
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        gap: 2, width: 52, height: 48, borderRadius: 8, flexShrink: 0,
        background: h ? T.surfaceHov : T.surface,
        border: `1px solid ${h ? T.borderHov : T.border}`,
        cursor: "pointer", transition: "all 0.15s",
      }}>
      <Icon size={16} color={accent ?? T.green} />
      <span style={{ fontFamily: T.sans, fontSize: 8, color: T.muted }}>icon</span>
    </button>
  );
}

// ─── PDF Upload ────────────────────────────────────────────────────────────────
const PDF_MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const PDF_UPLOAD_ENDPOINT = `${import.meta.env.VITE_APP_URI}/api/v1/projects/upload-pdf`;
// NOTE: PDF uploads occur immediately when selected.
// Backend should clean up orphan uploads if a user uploads a PDF but never saves the project.

function PdfUpload({ pdfName, pdfUrl, onUpload, onRemove }) {
  const [drag, setDrag] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef();
  const abortRef = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      abortRef.current?.abort();
    };
  }, []);

  async function handleFile(file) {
    if (!file) return;

    // Validate type
    const isValidPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");
    if (!isValidPdf) {
      setError("Only PDF files are accepted.");
      return;
    }

    // Validate size
    if (file.size > PDF_MAX_BYTES) {
      setError("File exceeds 10 MB limit.");
      return;
    }

    // Prevent duplicate upload
    if (pdfName === file.name && pdfUrl) {
      setError("This file is already uploaded.");
      return;
    }

    setError("");
    setUploading(true);

    // Cancel any in-flight upload
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    try {
      const formData = new FormData();
      formData.append("pdf", file);

      const response = await axios.post(
        PDF_UPLOAD_ENDPOINT,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          signal: abortRef.current.signal,
        }
      );

      if (!mountedRef.current) return;

      const { success, url, publicId, originalName } = response.data.data || {};
      if (!success || !url || !publicId) {
        throw new Error("Invalid response from upload server.");
      }
      onUpload({ pdfName: originalName ?? file.name, pdfUrl: url, pdfPublicId: publicId });
    } catch (err) {
      if (!mountedRef.current) return;
      if (axios.isCancel(err)) return;
      setError(err?.response?.data?.message ?? "Upload failed. Please try again.");
    } finally {
      if (mountedRef.current) setUploading(false);
    }
  }

  return (
    <div>
      {pdfName ? (
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          background: T.surface, border: `1px solid ${T.border}`,
          borderRadius: 10, padding: "10px 12px",
        }}>
          <FileIcon size={18} color={T.green} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: T.sans, fontSize: 13, color: T.text, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{pdfName}</div>
            <div style={{ fontFamily: T.sans, fontSize: 11, color: T.muted }}>PDF uploaded</div>
          </div>
          <button
            onClick={() => { if (uploading) return; setError(""); fileRef.current?.click(); }}
            disabled={uploading}
            style={{ background: "transparent", border: `1px solid ${T.border}`, borderRadius: 6, padding: "4px 10px", color: T.muted, fontFamily: T.sans, fontSize: 11, cursor: uploading ? "not-allowed" : "pointer", opacity: uploading ? 0.5 : 1 }}>
            Replace
          </button>
          <button
            onClick={() => { abortRef.current?.abort(); abortRef.current = null; setUploading(false); setError(""); onRemove(); }}
            style={{ background: "none", border: "none", cursor: "pointer", color: T.muted, display: "flex", padding: 4 }}>
            <X size={14} />
          </button>
        </div>
      ) : (
        <div
          onDragOver={e => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}
          onClick={() => !uploading && fileRef.current?.click()}
          style={{
            border: `2px dashed ${drag ? T.green : T.border}`,
            borderRadius: 10, padding: "20px 16px",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
            background: drag ? "rgba(110,231,183,0.04)" : "transparent",
            cursor: uploading ? "not-allowed" : "pointer", transition: "all 0.2s",
            opacity: uploading ? 0.7 : 1,
          }}>
          <Upload size={20} color={drag ? T.green : T.muted} />
          <div style={{ fontFamily: T.sans, fontSize: 13, color: T.muted, textAlign: "center" }}>
            {uploading
              ? <span style={{ color: T.green, fontWeight: 600 }}>Uploading…</span>
              : <><span style={{ color: T.green, fontWeight: 600 }}>Upload PDF</span> or drag & drop</>
            }
          </div>
          <div style={{ fontFamily: T.sans, fontSize: 11, color: T.faint }}>PDF files only · max 10 MB</div>
        </div>
      )}
      {error && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6, fontFamily: T.sans, fontSize: 11, color: "#F87171" }}>
          <AlertCircle size={12} />
          {error}
        </div>
      )}
      <input ref={fileRef} type="file" accept="application/pdf" style={{ display: "none" }}
        onChange={e => { handleFile(e.target.files[0]); e.target.value = ""; }} />
    </div>
  );
}

// ─── Image Upload ──────────────────────────────────────────────────────────────
const IMAGE_MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const IMAGE_UPLOAD_ENDPOINT = `${import.meta.env.VITE_APP_URI}/api/v1/projects/upload-image`;
const ACCEPTED_IMAGE_MIME = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]);
const ACCEPTED_IMAGE_EXT = /\.(jpe?g|png|webp|gif)$/i;
// NOTE: Image uploads occur immediately when selected.
// Backend should clean up orphan uploads if a user uploads an image but never saves the project.

function ImageUpload({ url, originalName, onUpload, onRemove, label = "Upload Image" }) {
  const [drag, setDrag] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef();
  const abortRef = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      abortRef.current?.abort();
    };
  }, []);

  async function handleFile(file) {
    if (!file) return;

    const isValidType =
      ACCEPTED_IMAGE_MIME.has(file.type) ||
      ACCEPTED_IMAGE_EXT.test(file.name);
    if (!isValidType) {
      setError("Only JPEG, PNG, WebP, or GIF images are accepted.");
      return;
    }

    if (file.size > IMAGE_MAX_BYTES) {
      setError("File exceeds 10 MB limit.");
      return;
    }

    if (originalName === file.name && url) {
      setError("This image is already uploaded.");
      return;
    }

    setError("");
    setUploading(true);
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await axios.post(IMAGE_UPLOAD_ENDPOINT, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        signal: abortRef.current.signal,
      });

      if (!mountedRef.current) return;

      const { success, url: resUrl, publicId, originalName: resName } = response.data.data || {};
      if (!success || !resUrl || !publicId) {
        throw new Error("Invalid response from upload server.");
      }

      onUpload({ url: resUrl, publicId, originalName: resName ?? file.name });
    } catch (err) {
      if (!mountedRef.current) return;
      if (axios.isCancel(err)) return;
      setError(err?.response?.data?.message ?? "Upload failed. Please try again.");
    } finally {
      if (mountedRef.current) setUploading(false);
    }
  }

  return (
    <div>
      {url ? (
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          background: T.surface, border: `1px solid ${T.border}`,
          borderRadius: 10, padding: "10px 12px",
        }}>
          <img src={url} alt={originalName} style={{ width: 36, height: 36, borderRadius: 6, objectFit: "cover", flexShrink: 0, border: `1px solid ${T.border}` }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: T.sans, fontSize: 13, color: T.text, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{originalName}</div>
            <div style={{ fontFamily: T.sans, fontSize: 11, color: T.muted }}>Image uploaded</div>
          </div>
          <button
            onClick={() => { if (uploading) return; setError(""); fileRef.current?.click(); }}
            disabled={uploading}
            style={{ background: "transparent", border: `1px solid ${T.border}`, borderRadius: 6, padding: "4px 10px", color: T.muted, fontFamily: T.sans, fontSize: 11, cursor: uploading ? "not-allowed" : "pointer", opacity: uploading ? 0.5 : 1 }}>
            Replace
          </button>
          <button
            onClick={() => { abortRef.current?.abort(); abortRef.current = null; setUploading(false); setError(""); onRemove(); }}
            style={{ background: "none", border: "none", cursor: "pointer", color: T.muted, display: "flex", padding: 4 }}>
            <X size={14} />
          </button>
        </div>
      ) : (
        <div
          onDragOver={e => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}
          onClick={() => !uploading && fileRef.current?.click()}
          style={{
            border: `2px dashed ${drag ? T.green : T.border}`,
            borderRadius: 10, padding: "20px 16px",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
            background: drag ? "rgba(110,231,183,0.04)" : "transparent",
            cursor: uploading ? "not-allowed" : "pointer", transition: "all 0.2s",
            opacity: uploading ? 0.7 : 1,
          }}>
          <Upload size={20} color={drag ? T.green : T.muted} />
          <div style={{ fontFamily: T.sans, fontSize: 13, color: T.muted, textAlign: "center" }}>
            {uploading
              ? <span style={{ color: T.green, fontWeight: 600 }}>Uploading…</span>
              : <><span style={{ color: T.green, fontWeight: 600 }}>{label}</span> or drag & drop</>
            }
          </div>
          <div style={{ fontFamily: T.sans, fontSize: 11, color: T.faint }}>JPEG, PNG, WebP, GIF · max 10 MB</div>
        </div>
      )}
      {error && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6, fontFamily: T.sans, fontSize: 11, color: "#F87171" }}>
          <AlertCircle size={12} />
          {error}
        </div>
      )}
      <input ref={fileRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
        style={{ display: "none" }}
        onChange={e => { handleFile(e.target.files[0]); e.target.value = ""; }} />
    </div>
  );
}

// ─── Color Selector (4-accent only) ────────────────────────────────────────────
function ColorSelector({ value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      {Object.entries(ACCENT_MAP).map(([k, hex]) => (
        <button key={k} onClick={() => onChange(k)} title={k}
          style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
            padding: "8px 14px", borderRadius: 10, cursor: "pointer",
            border: `1px solid ${value === k ? hex : T.border}`,
            background: value === k ? `${hex}14` : "transparent",
            transition: "all 0.15s",
          }}>
          <div style={{ width: 20, height: 20, borderRadius: "50%", background: hex }} />
          <span style={{ fontFamily: T.sans, fontSize: 11, color: value === k ? hex : T.muted, textTransform: "capitalize" }}>{k}</span>
        </button>
      ))}
    </div>
  );
}

// ─── PROJECT CARD PREVIEW ──────────────────────────────────────────────────────
function ProjectCardPreview({ project }) {
  const accent = ACCENT_MAP[project.color] ?? T.green;
  const rgb = accentRgb(project.color);
  const diff = project.difficulty;
  const diffC = DIFF_COLOR[diff] ?? T.green;
  const initials = (project.name || "BW").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div style={{
      background: "#0f0f0f", border: `1px solid rgba(255,255,255,0.08)`,
      borderRadius: 16, overflow: "hidden", width: "100%", maxWidth: 320, margin: "0 auto",
      fontFamily: T.sans,
    }}>
      {/* Top area */}
      <div style={{
        position: "relative", height: 140,
        background: `linear-gradient(135deg, rgba(${rgb},0.08) 0%, rgba(${rgb},0.03) 100%)`,
        display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
      }}>
        {/* Grid background */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)",
          backgroundSize: "28px 28px",
        }} />
        {/* Glow */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          width: 120, height: 120, borderRadius: "50%",
          background: `radial-gradient(ellipse, rgba(${rgb},0.18) 0%, transparent 70%)`,
          filter: "blur(20px)",
        }} />
        {/* Logo */}
        <div style={{
          position: "relative", width: 64, height: 64, borderRadius: 14,
          background: `rgba(${rgb},0.12)`,
          border: `1px solid rgba(${rgb},0.25)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 0 28px rgba(${rgb},0.2)`,
        }}>
          <span style={{ fontFamily: T.serif, fontSize: 22, color: accent, fontWeight: 400 }}>{initials}</span>
        </div>
        {/* Bookmark */}
        <div style={{ position: "absolute", top: 10, right: 10, width: 28, height: 28, borderRadius: 7, background: "rgba(255,255,255,0.06)", border: `1px solid rgba(255,255,255,0.08)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <BookmarkIcon size={13} color={T.muted} />
        </div>
        {/* Difficulty badge */}
        <div style={{
          position: "absolute", bottom: 10, left: 10,
          fontSize: 10, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase",
          color: diffC, background: `rgba(${Object.values(DIFF_COLOR).indexOf(diffC) > -1 ? "" : "110,231,183"},0)`,
          padding: "3px 9px", borderRadius: 20,
          backgroundColor: `${diffC}18`,
          border: `1px solid ${diffC}33`,
        }}>{diff}</div>
      </div>

      {/* Middle area */}
      <div style={{ padding: "14px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, color: T.muted, fontSize: 12 }}>
            <Clock size={12} /> <span>{project.duration || "8 Weeks"}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}>
            <StarIcon size={11} color={T.amber} style={{ fill: T.amber }} />
            <span style={{ color: T.text, fontWeight: 600 }}>4.7</span>
          </div>
        </div>
        <div style={{ fontFamily: T.serif, fontSize: 18, color: T.text, lineHeight: 1.25, marginBottom: 7 }}>
          {project.name || <span style={{ color: T.muted, fontFamily: T.sans, fontSize: 15 }}>Project name…</span>}
        </div>
        <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.6, marginBottom: 10, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {project.description || <span style={{ fontStyle: "italic" }}>Add a description…</span>}
        </div>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
          {project.stack.slice(0, 3).map(s => (
            <span key={s.id} style={{ fontSize: 11, fontFamily: T.sans, padding: "2px 9px", borderRadius: 20, background: "rgba(255,255,255,0.05)", border: `1px solid rgba(255,255,255,0.08)`, color: T.muted }}>
              {s.name || "Tech"}
            </span>
          ))}
          {project.stack.length > 3 && (
            <span style={{ fontSize: 11, fontFamily: T.sans, padding: "2px 9px", borderRadius: 20, background: "rgba(255,255,255,0.05)", border: `1px solid rgba(255,255,255,0.08)`, color: T.muted }}>
              +{project.stack.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Bottom area */}
      <div style={{ padding: "0 16px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 10, color: T.muted, fontSize: 12 }}>
          <Users2 size={12} /> <span>4.1k learners</span>
        </div>
        <button style={{
          width: "100%", background: "rgba(255,255,255,0.05)",
          border: `1px solid rgba(255,255,255,0.1)`,
          borderRadius: 10, padding: "10px 0",
          color: T.text, fontSize: 13, fontWeight: 500, fontFamily: T.sans,
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        }}>
          View Project →
        </button>
      </div>
    </div>
  );
}

// ─── LEARNING PAGE PREVIEW ─────────────────────────────────────────────────────
function LearningPagePreview({ project }) {
  const accent = ACCENT_MAP[project.color] ?? T.green;
  const rgb = accentRgb(project.color);
  const completed = project.modules.filter(m => m.completed).length;
  const total = project.modules.length || 1;
  const pct = Math.round((completed / total) * 100);
  const activeIdx = project.modules.findIndex(m => !m.completed && !m.locked);
  const activeMod = project.modules[activeIdx] ?? project.modules[0];
  const diffC = DIFF_COLOR[project.difficulty] ?? T.green;

  // Circular ring
  const R = 30, circ = 2 * Math.PI * R;
  const offset = circ - (pct / 100) * circ;

  return (
    <div style={{ background: "#0A0A0A", borderRadius: 12, overflow: "hidden", fontFamily: T.sans, fontSize: 12 }}>
      <div style={{ display: "grid", gridTemplateColumns: "100px 1fr", minHeight: 500, overflow: "hidden" }}>
        {/* LEFT SIDEBAR */}
        <div style={{ borderRight: `1px solid ${T.border}`, padding: "12px 0" }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: T.muted, padding: "0 10px 6px" }}>Course Modules</div>
          {project.modules.length === 0 ? (
            <div style={{ padding: "8px 10px", color: T.faint, fontSize: 11 }}>No modules yet</div>
          ) : project.modules.map((m, i) => {
            const isActive = i === activeIdx;
            const isDone = m.completed;
            const isLocked = m.locked && !isDone;
            return (
              <div key={m.id || i} style={{
                display: "flex", alignItems: "center", gap: 6, padding: "5px 10px",
                borderLeft: `2px solid ${isActive ? accent : "transparent"}`,
                background: isActive ? `rgba(${rgb},0.06)` : "transparent",
              }}>
                <span style={{ fontSize: 9, fontWeight: 700, color: T.muted, minWidth: 16 }}>{String(i + 1).padStart(2, "0")}</span>
                <span style={{ flex: 1, fontSize: 10, color: isActive ? accent : isDone ? T.muted : isLocked ? "rgba(255,255,255,0.2)" : T.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {m.phase || `Module ${i + 1}`}
                </span>
                {isDone && <Check size={9} color={accent} />}
                {isLocked && <Lock size={9} color="rgba(255,255,255,0.2)" />}
              </div>
            );
          })}
          <div style={{ padding: "10px 10px 0", borderTop: `1px solid ${T.border}`, marginTop: 8 }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: T.muted, marginBottom: 5 }}>Completion</div>
            <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 20, height: 3, marginBottom: 4 }}>
              <div style={{ background: accent, height: 3, borderRadius: 20, width: `${pct}%`, transition: "width 0.4s" }} />
            </div>
            <div style={{ fontSize: 9, color: T.muted }}>{completed} of {project.modules.length} modules</div>
          </div>
        </div>

        {/* CENTER */}
        <div style={{ padding: "16px 18px", overflowY: "auto", maxHeight: 500, minWidth: 0 }}>
          <div style={{ display: "flex", gap: 5, marginBottom: 8, flexWrap: "wrap" }}>
            <span style={{
              fontSize: 9, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase",
              color: accent, background: `rgba(${rgb},0.1)`, border: `1px solid rgba(${rgb},0.2)`,
              padding: "2px 7px", borderRadius: 20,
            }}>
              {project.category}
            </span>
            <span style={{
              fontSize: 9, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase",
              color: diffC, background: `${diffC}18`, border: `1px solid ${diffC}33`,
              padding: "2px 7px", borderRadius: 20,
            }}>
              {project.difficulty}
            </span>
          </div>

          <div style={{ fontFamily: T.serif, fontSize: 22, color: T.text, lineHeight: 1.2, marginBottom: 8 }}>
            {project.name || "Project Title"}
          </div>

          <div style={{ display: "flex", gap: 14, marginBottom: 10, flexWrap: "wrap" }}>
            <span style={{ color: T.muted, fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}>
              <Clock size={11} />{project.duration}
            </span>
            <span style={{ color: T.muted, fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}>
              <Users2 size={11} />4.1k learners
            </span>
            <span style={{ color: T.muted, fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}>
              <StarIcon size={11} color={T.amber} style={{ fill: T.amber }} />4.7
            </span>
          </div>

          <div style={{ display: "flex", gap: 5, marginBottom: 12, flexWrap: "wrap" }}>
            {project.stack.slice(0, 6).map(s => (
              <span key={s.id} style={{
                fontSize: 10, padding: "2px 8px", borderRadius: 20,
                background: "rgba(255,255,255,0.05)", border: `1px solid rgba(255,255,255,0.08)`, color: T.muted,
              }}>
                {s.name || "Tech"}
              </span>
            ))}
          </div>

          {activeMod && (
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: "12px 14px", marginBottom: 14 }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: accent, marginBottom: 4 }}>
                Module {String(activeIdx + 1).padStart(2, "0")}
              </div>
              <div style={{ fontFamily: T.serif, fontSize: 18, color: T.text, marginBottom: 8 }}>
                {activeMod.phase || "Module Title"}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20, background: T.amber + "22", border: `1px solid ${T.amber}44`, color: T.amber }}>
                  In Progress
                </span>
                <span style={{ fontSize: 11, color: T.muted, display: "flex", alignItems: "center", gap: 4 }}>
                  <Clock size={10} />{activeMod.duration || "1 hr"}
                </span>
              </div>
            </div>
          )}

          {activeMod?.desc && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: accent, marginBottom: 6 }}>Overview</div>
              <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.7 }}>{activeMod.desc}</div>
            </div>
          )}

          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: accent, marginBottom: 6 }}>Learning Material</div>
            {activeMod?.pdfName ? (
              <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "10px 12px", display: "flex", alignItems: "center", gap: 10 }}>
                <FileIcon size={16} color={accent} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: T.text, fontWeight: 600 }}>{activeMod.pdfName}</div>
                </div>
              </div>
            ) : (
              <div style={{ background: T.surface, border: `1px dashed ${T.border}`, borderRadius: 10, padding: 16, textAlign: "center", color: T.muted, fontSize: 11 }}>
                No learning material uploaded
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── FORM TABS ─────────────────────────────────────────────────────────────────

function TabBasicInfo({ p, set }) {
  return (
    <div>
      <Field label="Project Name" required>
        <Inp value={p.name} onChange={e => {
          const name = e.target.value;
          set("name", name);
          if (!p.slug || p.slug === slugify(p.name))
            set("slug", slugify(name));
          const initials = name.split(" ").filter(Boolean).map(word => word[0]).join("").slice(0, 2).toUpperCase();
          set("image", initials);
        }} />
      </Field>
      <Field label="Slug" hint="Auto-generated, editable">
        <Inp value={p.slug} onChange={e => set("slug", e.target.value)} placeholder="rest-api-with-authentication" mono />
      </Field>
      <Field label="Description" required>
        <Txa value={p.description} onChange={e => set("description", e.target.value)} placeholder="Short 1–2 sentence description shown on project cards." rows={2} />
      </Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label="Category">
          <Sel value={p.category} onChange={e => set("category", e.target.value)} options={CATEGORIES} />
        </Field>
        <Field label="Difficulty">
          <Sel value={p.difficulty} onChange={e => set("difficulty", e.target.value)} options={DIFFICULTIES} />
        </Field>
        <Field label="Duration">
          <Sel value={p.duration} onChange={e => { set("duration", e.target.value); set("durationWeeks", parseInt(e.target.value) || 0); }} options={DURATIONS} />
        </Field>
        <Field label="Duration Weeks">
          <Inp type="number" value={p.durationWeeks} onChange={e => set("durationWeeks", parseInt(e.target.value) || 0)} placeholder="8" />
        </Field>
      </div>
      <Field label="Project Image Key" hint="Identifier for the project thumbnail image">
        <Inp value={p.image} onChange={e => set("image", e.target.value)} placeholder="e.g. rest-api-thumbnail" mono />
      </Field>
      <Field label="Color Theme">
        <ColorSelector value={p.color} onChange={v => set("color", v)} />
      </Field>
    </div>
  );
}

function TabContent({ p, set }) {
  return (
    <div>
      <Field label="Summary" hint="Extended overview for the project detail page">
        <Txa value={p.summary} onChange={e => set("summary", e.target.value)} placeholder="Expand on goals, scope, and learning outcomes." rows={4} />
      </Field>
      <Field label="Cover Image" hint="Full-width hero banner">
        <ImageUpload
          url={p.cover.url}
          originalName={p.cover.originalName}
          onUpload={({ url, publicId, originalName }) =>
            set("cover", { url, publicId, originalName })
          }
          onRemove={() => set("cover", { url: "", publicId: "", originalName: "" })}
          label="Upload Cover Image"
        />
      </Field>
      <Field label="Problem Statement">
        <Txa value={p.problem} onChange={e => set("problem", e.target.value)} placeholder="What real-world problem does this project solve?" rows={4} />
      </Field>
      <Field label="Solution">
        <Txa value={p.solution} onChange={e => set("solution", e.target.value)} placeholder="How does this project address the problem?" rows={4} />
      </Field>
    </div>
  );
}

function TabTechFeatures({ p, set, openPicker }) {
  const accent = ACCENT_MAP[p.color] ?? T.green;

  function addStack() { set("stack", [...p.stack, { id: uid(), name: "", iconKey: "Code", category: "" }]); }
  function addMetric() { set("metrics", [...p.metrics, { id: uid(), value: "", num: 0, label: "", iconKey: "TrendingUp" }]); }
  function addFeature() { set("features", [...p.features, { id: uid(), label: "", desc: "", iconKey: "Star" }]); }

  function updateStack(id, k, v) { set("stack", p.stack.map(i => i.id === id ? { ...i, [k]: v } : i)); }
  function updateMetric(id, k, v) { set("metrics", p.metrics.map(i => i.id === id ? { ...i, [k]: v } : i)); }
  function updateFeature(id, k, v) { set("features", p.features.map(i => i.id === id ? { ...i, [k]: v } : i)); }

  return (
    <div>
      {/* Tech Stack */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <div style={{ fontFamily: T.sans, fontWeight: 600, fontSize: 13, color: T.text }}>Tech Stack <span style={{ fontSize: 11, color: T.muted, fontWeight: 400 }}>({p.stack.length})</span></div>
        </div>
        <div style={{ fontFamily: T.sans, fontSize: 11, color: T.muted, marginBottom: 10 }}>
          Name<span style={{ color: "#F87171", marginLeft: 3 }}>*</span> is required per item.
        </div>
        {p.stack.map(item => (
          <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "8px 10px" }}>
            <GripVertical size={13} color={T.faint} style={{ flexShrink: 0 }} />
            <IconBtn iconKey={item.iconKey} onClick={() => openPicker("stack", item.id)} accent={accent} />
            <Inp value={item.name} onChange={e => updateStack(item.id, "name", e.target.value)} placeholder="e.g. React" />
            <Inp value={item.category} onChange={e => updateStack(item.id, "category", e.target.value)} placeholder="Category (optional)" />
            <DelBtn onClick={() => set("stack", p.stack.filter(i => i.id !== item.id))} />
          </div>
        ))}
        <AddBtn onClick={addStack} label="Add Technology" />
      </div>

      {/* Metrics */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: T.sans, fontWeight: 600, fontSize: 13, color: T.text, marginBottom: 4 }}>
          Metrics <span style={{ fontSize: 11, color: T.muted, fontWeight: 400 }}>({p.metrics.length})</span>
        </div>
        <div style={{ fontFamily: T.sans, fontSize: 11, color: T.muted, marginBottom: 10 }}>
          Value<span style={{ color: "#F87171", marginLeft: 3 }}>*</span> and Label<span style={{ color: "#F87171", marginLeft: 3 }}>*</span> are required per item.
        </div>
        {p.metrics.map(item => (
          <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "8px 10px" }}>
            <IconBtn iconKey={item.iconKey} onClick={() => openPicker("metrics", item.id)} accent={accent} />
            <Inp value={item.value} onChange={e => updateMetric(item.id, "value", e.target.value)} placeholder="Display value (e.g. 4.1k)" />
            <Inp value={item.label} onChange={e => updateMetric(item.id, "label", e.target.value)} placeholder="Label (e.g. Learners)" />
            <DelBtn onClick={() => set("metrics", p.metrics.filter(i => i.id !== item.id))} />
          </div>
        ))}
        <AddBtn onClick={addMetric} label="Add Metric" />
      </div>

      {/* Features */}
      <div>
        <div style={{ fontFamily: T.sans, fontWeight: 600, fontSize: 13, color: T.text, marginBottom: 4 }}>
          Key Features <span style={{ fontSize: 11, color: T.muted, fontWeight: 400 }}>({p.features.length})</span>
        </div>
        <div style={{ fontFamily: T.sans, fontSize: 11, color: T.muted, marginBottom: 10 }}>
          Label<span style={{ color: "#F87171", marginLeft: 3 }}>*</span> is required per item.
        </div>
        {p.features.map(item => (
          <div key={item.id} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "8px 10px" }}>
            <IconBtn iconKey={item.iconKey} onClick={() => openPicker("features", item.id)} accent={accent} />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
              <Inp value={item.label} onChange={e => updateFeature(item.id, "label", e.target.value)} placeholder="Feature title" />
              <Txa value={item.desc} onChange={e => updateFeature(item.id, "desc", e.target.value)} placeholder="Short description" rows={2} />
            </div>
            <DelBtn onClick={() => set("features", p.features.filter(i => i.id !== item.id))} />
          </div>
        ))}
        <AddBtn onClick={addFeature} label="Add Feature" />
      </div>
    </div>
  );
}

function TabModules({ p, set }) {
  function addModule() {
    set("modules", [...p.modules, { id: uid(), phase: "", weeks: "", desc: "", duration: "", completed: false, locked: false, pdfUrl: "", pdfName: "", pdfPublicId: "" }]);
  }
  function removeMod(id) { set("modules", p.modules.filter(m => m.id !== id)); }

  return (
    <div>
      <div style={{ fontFamily: T.sans, fontWeight: 600, fontSize: 13, color: T.text, marginBottom: 4 }}>
        Course Modules <span style={{ fontSize: 11, color: T.muted, fontWeight: 400 }}>({p.modules.length})</span>
      </div>
      <div style={{ fontFamily: T.sans, fontSize: 11, color: T.muted, marginBottom: 12 }}>
        Phase / Title<span style={{ color: "#F87171", marginLeft: 3 }}>*</span> is required per module.
      </div>
      {p.modules.length === 0 && (
        <div style={{ textAlign: "center", padding: "28px 0", marginBottom: 12, color: T.muted, fontFamily: T.sans, fontSize: 13, background: T.surface, borderRadius: 10, border: `1px dashed ${T.border}` }}>
          <BookOpen size={22} color={T.faint} style={{ marginBottom: 6, display: "block", margin: "0 auto 6px" }} />
          Define the learning modules learners will complete
        </div>
      )}
      {p.modules.map((mod, i) => (
        <div key={mod.id} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: "12px 14px", marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <span style={{ fontFamily: T.mono, fontSize: 11, color: T.muted, minWidth: 22 }}>{String(i + 1).padStart(2, "0")}</span>
            <div style={{ flex: 1 }}>
              <Inp
                value={mod.phase}
                onChange={e => set("modules", p.modules.map(m => m.id === mod.id ? { ...m, phase: e.target.value } : m))}
                placeholder="Phase / Module title *"
              />
            </div>
            <div style={{ width: 90 }}>
              <Inp value={mod.weeks} onChange={e => set("modules", p.modules.map(m => m.id === mod.id ? { ...m, weeks: e.target.value } : m))} placeholder="Weeks" />
            </div>
            <div style={{ width: 90 }}>
              <Inp value={mod.duration} onChange={e => set("modules", p.modules.map(m => m.id === mod.id ? { ...m, duration: e.target.value } : m))} placeholder="Duration" />
            </div>
            <DelBtn onClick={() => removeMod(mod.id)} />
          </div>
          <div style={{ marginBottom: 10 }}>
            <Txa value={mod.desc} onChange={e => set("modules", p.modules.map(m => m.id === mod.id ? { ...m, desc: e.target.value } : m))} placeholder="What will the learner do in this module?" rows={2} />
          </div>
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontFamily: T.sans, fontSize: 11, fontWeight: 600, color: T.muted, letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: 6 }}>PDF Material</div>
            <PdfUpload
              pdfName={mod.pdfName} pdfUrl={mod.pdfUrl}
              onUpload={({ pdfName, pdfUrl, pdfPublicId }) => {
                set("modules", p.modules.map(m =>
                  m.id === mod.id ? { ...m, pdfName, pdfUrl, pdfPublicId } : m
                ));
              }}
              onRemove={() => {
                set("modules", p.modules.map(m =>
                  m.id === mod.id ? { ...m, pdfName: "", pdfUrl: "", pdfPublicId: "" } : m
                ));
              }}
            />
          </div>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            <Tog value={mod.completed} onChange={v => set("modules", p.modules.map(m => m.id === mod.id ? { ...m, completed: v } : m))} label="Mark completed" />
            <Tog value={mod.locked} onChange={v => set("modules", p.modules.map(m => m.id === mod.id ? { ...m, locked: v } : m))} label="Lock module" />
          </div>
        </div>
      ))}
      <AddBtn onClick={addModule} label="Add Module" />
    </div>
  );
}

function TabMedia({ p, set }) {
  function addGallery() { set("gallery", [...p.gallery, { id: uid(), url: "", publicId: "", originalName: "", caption: "" }]); }
  function addChallenge() { set("challenges", [...p.challenges, { id: uid(), title: "", body: "" }]); }

  return (
    <div>
      {/* Gallery */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: T.sans, fontWeight: 600, fontSize: 13, color: T.text, marginBottom: 4 }}>
          Gallery <span style={{ fontSize: 11, color: T.muted, fontWeight: 400 }}>({p.gallery.length})</span>
        </div>
        <div style={{ fontFamily: T.sans, fontSize: 11, color: T.muted, marginBottom: 10 }}>
          Image upload<span style={{ color: "#F87171", marginLeft: 3 }}>*</span> is required per item.
        </div>
        {p.gallery.map(item => (
          <div key={item.id} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
            <div style={{ flex: 2 }}>
              <ImageUpload
                url={item.url}
                originalName={item.originalName}
                onUpload={({ url, publicId, originalName }) =>
                  set("gallery", p.gallery.map(g =>
                    g.id === item.id ? { ...g, url, publicId, originalName } : g
                  ))
                }
                onRemove={() =>
                  set("gallery", p.gallery.map(g =>
                    g.id === item.id ? { ...g, url: "", publicId: "", originalName: "" } : g
                  ))
                }
                label="Upload Image"
              />
            </div>
            <div style={{ flex: 1 }}>
              <Inp value={item.caption} onChange={e => set("gallery", p.gallery.map(g => g.id === item.id ? { ...g, caption: e.target.value } : g))} placeholder="Caption" />
            </div>
            <DelBtn onClick={() => set("gallery", p.gallery.filter(g => g.id !== item.id))} />
          </div>
        ))}
        <AddBtn onClick={addGallery} label="Add Gallery Image" />
      </div>

      {/* Challenges */}
      <div>
        <div style={{ fontFamily: T.sans, fontWeight: 600, fontSize: 13, color: T.text, marginBottom: 4 }}>
          Challenges <span style={{ fontSize: 11, color: T.muted, fontWeight: 400 }}>({p.challenges.length})</span>
        </div>
        <div style={{ fontFamily: T.sans, fontSize: 11, color: T.muted, marginBottom: 10 }}>
          Title<span style={{ color: "#F87171", marginLeft: 3 }}>*</span> is required per item.
        </div>
        {p.challenges.map(item => (
          <div key={item.id} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "10px 12px", marginBottom: 10 }}>
            <div style={{ marginBottom: 8 }}>
              <Inp value={item.title} onChange={e => set("challenges", p.challenges.map(c => c.id === item.id ? { ...c, title: e.target.value } : c))} placeholder="Challenge title *" />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ flex: 1 }}>
                <Txa value={item.body} onChange={e => set("challenges", p.challenges.map(c => c.id === item.id ? { ...c, body: e.target.value } : c))} placeholder="Describe the challenge and how it's overcome" rows={2} />
              </div>
              <DelBtn onClick={() => set("challenges", p.challenges.filter(c => c.id !== item.id))} />
            </div>
          </div>
        ))}
        <AddBtn onClick={addChallenge} label="Add Challenge" />
      </div>
    </div>
  );
}

function TabPublish({ p, set }) {
  return (
    <div>
      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: "16px 18px", marginBottom: 16 }}>
        <div style={{ fontFamily: T.sans, fontWeight: 600, fontSize: 13, color: T.text, marginBottom: 14 }}>Project Flags</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Tog value={p.featured} onChange={v => set("featured", v)} label="Featured project" />
          <Tog value={p.newest} onChange={v => set("newest", v)} label="Mark as new" />
          <Tog value={p.recommended} onChange={v => set("recommended", v)} label="Recommended" />
        </div>
      </div>

      <Field label="Status">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
          {STATUSES.map(s => {
            const sel = p.status === s.value;
            return (
              <button key={s.value} onClick={() => set("status", s.value)}
                style={{
                  padding: "10px 8px", borderRadius: 10, fontFamily: T.sans, fontSize: 12, fontWeight: 500,
                  background: sel ? "rgba(110,231,183,0.08)" : T.surface,
                  border: `1px solid ${sel ? T.green : T.border}`,
                  color: sel ? T.green : T.muted, cursor: "pointer", transition: "all 0.15s",
                }}>
                {s.label}
              </button>
            );
          })}
        </div>
      </Field>

      <Field label="Related Project IDs" hint="Comma-separated project IDs">
        <Inp
          value={p.relatedProjectIds.join(",")}
          onChange={e => set("relatedProjectIds", e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
          placeholder="proj_abc, proj_def"
          mono
        />
      </Field>

      {/* Summary card */}
      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: "14px 16px", marginTop: 8 }}>
        <div style={{ fontFamily: T.sans, fontSize: 12, fontWeight: 600, color: T.muted, letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: 10 }}>Project Summary</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[
            ["Name", p.name || "—"],
            ["Category", p.category],
            ["Difficulty", p.difficulty],
            ["Duration", p.duration],
            ["Stack", `${p.stack.length} items`],
            ["Modules", `${p.modules.length} modules`],
            ["Features", `${p.features.length} features`],
            ["Status", p.status],
          ].map(([k, v]) => (
            <div key={k} style={{ background: "rgba(255,255,255,0.02)", borderRadius: 8, padding: "8px 10px" }}>
              <div style={{ fontFamily: T.sans, fontSize: 10, color: T.muted, marginBottom: 2 }}>{k}</div>
              <div style={{ fontFamily: T.sans, fontSize: 12, color: T.text, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function ProjectBuilderDrawer({ open, onClose, onSave, initialData }) {
  const [project, setProject] = useState(() => ({ ...DEFAULT, id: uid(), ...(initialData ?? {}) }));
  const [tab, setTab] = useState(0);
  const [previewTab, setPTab] = useState(0); // 0=card, 1=learning
  const [picker, setPicker] = useState(null); // {field, id}
  const [saved, setSaved] = useState(false);
  const [publishErrors, setPublishErrors] = useState([]);
  const bodyRef = useRef(null);

  const set = useCallback((key, value) => {
    setProject(p => ({ ...p, [key]: value }));
    setSaved(false);
    setPublishErrors([]);
  }, []);

  // Reset scroll on tab change
  useEffect(() => { bodyRef.current?.scrollTo({ top: 0, behavior: "smooth" }); }, [tab]);

  function openPicker(field, id) { setPicker({ field, id }); }

  function handlePickerSelect(iconKey) {
    if (!picker) return;
    const { field, id } = picker;
    if (field === "stack") set("stack", project.stack.map(i => i.id === id ? { ...i, iconKey } : i));
    if (field === "metrics") set("metrics", project.metrics.map(i => i.id === id ? { ...i, iconKey } : i));
    if (field === "features") set("features", project.features.map(i => i.id === id ? { ...i, iconKey } : i));
    setPicker(null);
  }

  function handleSaveDraft() {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function handlePublish() {
    const errors = [];

    if (!project.name.trim())
      errors.push("Project Name is required.");
    if (!project.description.trim())
      errors.push("Description is required.");

    project.stack.forEach((item, i) => {
      if (!item.name.trim())
        errors.push(`Tech Stack item #${i + 1}: Name is required.`);
    });
    project.metrics.forEach((item, i) => {
      if (!item.value.trim())
        errors.push(`Metric #${i + 1}: Value is required.`);
      if (!item.label.trim())
        errors.push(`Metric #${i + 1}: Label is required.`);
    });
    project.features.forEach((item, i) => {
      if (!item.label.trim())
        errors.push(`Feature #${i + 1}: Label is required.`);
    });
    project.modules.forEach((item, i) => {
      if (!item.phase.trim())
        errors.push(`Module #${i + 1}: Phase / Title is required.`);
    });
    project.challenges.forEach((item, i) => {
      if (!item.title.trim())
        errors.push(`Challenge #${i + 1}: Title is required.`);
    });
    project.gallery.forEach((item, i) => {
      if (!item.url)
        errors.push(`Gallery image #${i + 1}: An uploaded image is required.`);
    });

    if (errors.length > 0) {
      setPublishErrors(errors);
      return;
    }

    setPublishErrors([]);
    const output = {
      id: project.id, name: project.name,
      slug: project.slug || slugify(project.name),
      description: project.description, color: project.color,
      category: project.category, difficulty: project.difficulty,
      duration: project.duration, durationWeeks: project.durationWeeks,
      stack: project.stack, metrics: project.metrics, image: project.image,
      featured: project.featured, newest: project.newest,
      recommended: project.recommended, status: project.status,
      summary: project.summary, cover: project.cover,
      problem: project.problem, solution: project.solution,
      features: project.features, gallery: project.gallery,
      challenges: project.challenges, modules: project.modules,
      relatedProjectIds: project.relatedProjectIds,
    };
    console.log(JSON.stringify(output, null, 2));
    onSave?.(output);
    onClose?.();
  }

  const pickerCurrent =
    picker?.field === "stack" ? project.stack.find(i => i.id === picker.id)?.iconKey :
      picker?.field === "metrics" ? project.metrics.find(i => i.id === picker.id)?.iconKey :
        picker?.field === "features" ? project.features.find(i => i.id === picker.id)?.iconKey : undefined;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif&family=DM+Sans:wght@400;500;600;700&family=DM+Mono&display=swap');
        .bw-drawer-body::-webkit-scrollbar { width:4px; }
        .bw-drawer-body::-webkit-scrollbar-track { background:transparent; }
        .bw-drawer-body::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.1); border-radius:2px; }
        .bw-drawer-body { scrollbar-width:thin; scrollbar-color:rgba(255,255,255,0.1) transparent; }
        select option { background:#111; }
      `}</style>

      <AnimatePresence>
        {open && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed", inset: 0, zIndex: 300,
              background: "rgba(0,0,0,0.72)", backdropFilter: "blur(12px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: 16,
            }}
            onClick={e => { if (e.target === e.currentTarget) onClose?.(); }}
          >
            <motion.div
              key="drawer"
              initial={{ scale: 0.96, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 12 }}
              transition={{ duration: 0.25, ease: [0.25, 0.8, 0.25, 1] }}
              style={{
                width: "100%", maxWidth: 1400, height: "90vh",
                background: "rgba(12,12,12,0.98)",
                border: `1px solid rgba(255,255,255,0.1)`,
                borderRadius: 24, overflow: "hidden",
                display: "flex", flexDirection: "column",
                boxShadow: "0 48px 120px rgba(0,0,0,0.8)",
                fontFamily: T.sans,
              }}
            >
              {/* ── HEADER ── */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "0 24px", height: 60, flexShrink: 0,
                borderBottom: `1px solid ${T.border}`,
                background: "rgba(255,255,255,0.02)",
              }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: T.text, letterSpacing: "-0.2px" }}>Create Project</div>
                  <div style={{ fontSize: 12, color: T.muted }}>Build and manage learning projects</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <button onClick={handleSaveDraft}
                    style={{
                      display: "flex", alignItems: "center", gap: 6,
                      background: saved ? "rgba(110,231,183,0.1)" : "transparent",
                      border: `1px solid ${saved ? "rgba(110,231,183,0.25)" : T.border}`,
                      color: saved ? T.green : T.muted,
                      borderRadius: 9, padding: "7px 14px", fontSize: 13, fontFamily: T.sans, cursor: "pointer", transition: "all 0.2s",
                    }}>
                    {saved ? <><Check size={13} />Saved</> : <><Save size={13} />Save Draft</>}
                  </button>
                  <button onClick={handlePublish}
                    style={{
                      display: "flex", alignItems: "center", gap: 6,
                      background: T.green, border: "none", color: "#0A0A0A",
                      borderRadius: 9, padding: "7px 16px", fontSize: 13, fontWeight: 700,
                      fontFamily: T.sans, cursor: "pointer",
                      boxShadow: "0 3px 14px rgba(110,231,183,0.25)", transition: "opacity 0.2s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
                    onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                    <Upload size={13} />Publish Project
                  </button>
                  <button onClick={onClose}
                    style={{ background: "transparent", border: `1px solid ${T.border}`, borderRadius: 9, padding: 7, cursor: "pointer", color: T.muted, display: "flex", transition: "all 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = T.surfaceHov; e.currentTarget.style.color = T.text; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.muted; }}>
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* ── VALIDATION ERRORS ── */}
              {publishErrors.length > 0 && (
                <div style={{
                  flexShrink: 0, padding: "10px 24px",
                  background: "rgba(248,113,113,0.07)",
                  borderBottom: `1px solid rgba(248,113,113,0.2)`,
                  display: "flex", alignItems: "flex-start", gap: 10,
                }}>
                  <AlertCircle size={15} color="#F87171" style={{ flexShrink: 0, marginTop: 1 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: T.sans, fontSize: 12, fontWeight: 600, color: "#F87171", marginBottom: 4 }}>
                      Please fix the following before publishing:
                    </div>
                    <ul style={{ margin: 0, padding: "0 0 0 16px", listStyle: "disc" }}>
                      {publishErrors.map((e, i) => (
                        <li key={i} style={{ fontFamily: T.sans, fontSize: 12, color: "#F87171", lineHeight: 1.7 }}>{e}</li>
                      ))}
                    </ul>
                  </div>
                  <button
                    onClick={() => setPublishErrors([])}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#F87171", display: "flex", padding: 2, flexShrink: 0 }}>
                    <X size={14} />
                  </button>
                </div>
              )}

              {/* ── BODY ── */}
              <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 360px", overflow: "hidden" }}>

                {/* LEFT: Tabs + Form */}
                <div style={{ display: "flex", flexDirection: "column", borderRight: `1px solid ${T.border}`, overflow: "hidden" }}>
                  {/* Sticky Tab Bar */}
                  <div style={{
                    display: "flex", gap: 2, padding: "10px 16px",
                    borderBottom: `1px solid ${T.border}`,
                    background: "rgba(255,255,255,0.01)", flexShrink: 0,
                  }}>
                    {TABS.map((t, i) => {
                      const act = i === tab;
                      return (
                        <button key={t} onClick={() => setTab(i)}
                          style={{
                            padding: "6px 12px", borderRadius: 8, fontFamily: T.sans, fontSize: 12, fontWeight: act ? 600 : 400,
                            background: act ? "rgba(110,231,183,0.08)" : "transparent",
                            border: `1px solid ${act ? "rgba(110,231,183,0.22)" : "transparent"}`,
                            color: act ? T.green : T.muted, cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap",
                          }}>
                          {t}
                        </button>
                      );
                    })}
                  </div>

                  {/* Form Content */}
                  <div ref={bodyRef} className="bw-drawer-body" style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
                    <AnimatePresence mode="wait">
                      <motion.div key={tab}
                        initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.18 }}>
                        {tab === 0 && <TabBasicInfo p={project} set={set} />}
                        {tab === 1 && <TabContent p={project} set={set} />}
                        {tab === 2 && <TabTechFeatures p={project} set={set} openPicker={openPicker} />}
                        {tab === 3 && <TabModules p={project} set={set} />}
                        {tab === 4 && <TabMedia p={project} set={set} />}
                        {tab === 5 && <TabPublish p={project} set={set} />}
                      </motion.div>
                    </AnimatePresence>
                    <div style={{ height: 40 }} />
                  </div>
                </div>

                {/* RIGHT: Preview */}
                <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
                  {/* Preview tab switcher */}
                  <div style={{
                    display: "flex", gap: 2, padding: "10px 14px",
                    borderBottom: `1px solid ${T.border}`, flexShrink: 0,
                    background: "rgba(255,255,255,0.01)",
                  }}>
                    {["Project Card", "Learning Page"].map((t, i) => {
                      const act = i === previewTab;
                      return (
                        <button key={t} onClick={() => setPTab(i)}
                          style={{
                            padding: "5px 12px", borderRadius: 8, fontFamily: T.sans, fontSize: 12, fontWeight: act ? 600 : 400,
                            background: act ? "rgba(255,255,255,0.06)" : "transparent",
                            border: `1px solid ${act ? T.border : "transparent"}`,
                            color: act ? T.text : T.muted, cursor: "pointer", transition: "all 0.15s",
                          }}>
                          <Eye size={11} style={{ display: "inline", marginRight: 5, verticalAlign: "middle" }} />{t}
                        </button>
                      );
                    })}
                  </div>

                  {/* Preview content */}
                  <div className="bw-drawer-body" style={{ flex: 1, overflowY: "auto", padding: 16 }}>
                    <AnimatePresence mode="wait">
                      <motion.div key={previewTab}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}>
                        {previewTab === 0
                          ? <ProjectCardPreview project={project} />
                          : <LearningPagePreview project={project} />
                        }
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Icon Picker Portal */}
      {picker && (
        <LucideIconPicker
          selected={pickerCurrent}
          onSelect={handlePickerSelect}
          onClose={() => setPicker(null)}
        />
      )}
    </>
  );
}
