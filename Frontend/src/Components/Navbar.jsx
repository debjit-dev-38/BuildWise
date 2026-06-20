import React from 'react'
import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Hammer, ArrowRight, Play, Monitor, Server, Layers, Brain,
  Search, Map, Rocket, Clock, Check, X, Sparkles,
  Star, Menu, BookOpen, Users
} from "lucide-react";
import { useContext } from 'react';
import { UserContext } from '../Context/UserContext';
const NAV_LINKS = [
  { name: "Home", path: "/" },
  { name: "Projects", path: "/projects" },
  { name: "DashBoard", path: "/dashboard" },
  { name: "About", path: "/about" },
];
const G = {
  green: "#6EE7B7",
  indigo: "#818CF8",
  amber: "#FCD34D",
  bg: "#0A0A0A",
  text: "#F0F0F0",
  muted: "rgba(255,255,255,0.45)",
  faint: "rgba(255,255,255,0.18)",
  card: "rgba(255,255,255,0.02)",
  border: "rgba(255,255,255,0.07)",
  serif: { fontFamily: "'Instrument Serif', serif" },
  mono: { fontFamily: "'DM Mono', monospace" },
  sans: { fontFamily: "'DM Sans', sans-serif" },
};

const Navbar = () => {
  const { user, setUser,loading } = useContext(UserContext)
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate()
  const location = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.8, 0.25, 1] }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-5"
      style={{
        width: "min(900px, calc(100% - 32px))",
        background: scrolled ? "rgba(10,10,10,0.9)" : "rgba(10,10,10,0.4)",
        backdropFilter: "blur(24px)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 12,
        transition: "background 0.3s ease",
      }}
    >
      <div className="flex items-center justify-between h-[52px]">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div
            className="flex items-center justify-center rounded-[7px]"
            style={{
              width: 28,
              height: 28,
              background: "linear-gradient(135deg, #6EE7B7, #818CF8)",
            }}
          >
            <Hammer size={14} color="#0A0A0A" />
          </div>
          <span className="font-semibold text-[15px] tracking-tight text-white">BuildWise</span>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((link) => {
            const isActive = location.pathname === link.path;

            return (
              <Link
                key={link.name}
                to={link.path}
                className="text-sm transition-colors duration-200"
                style={{
                  color: isActive ? G.green : "#888",
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-2">

          {user ? (<div style={{ display: "flex", alignItems: "center", margin: 20, flexShrink: 0 }}>
            <div
              title={user.fullName}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: G.green,
                color: G.bg,
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {user.fullName?.charAt(0).toUpperCase()}
            </div>
          </div>) : (<div style={{ display: "flex", alignItems: "center", margin: 20, flexShrink: 0 }}>
            <motion.button onClick={() => { navigate('/login') }} whileHover={{ y: -1, boxShadow: "0 6px 20px rgba(110,231,183,0.38)" }} whileTap={{ scale: 0.97 }}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 16px", borderRadius: 10, background: G.green, color: G.bg, fontSize: 12, fontWeight: 700, border: "none", cursor: "pointer", boxShadow: "0 3px 14px rgba(110,231,183,0.28)", transition: "box-shadow 0.3s" }}>
              <Sparkles size={12} /> Login
            </motion.button>
          </div>)}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white"
          onClick={() => setOpen(!open)}
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: "hidden", borderTop: "1px solid rgba(255,255,255,0.06)", paddingBottom: 12 }}
          >
            <div className="flex flex-col">
              {NAV_LINKS.map((l) => {
                const isActive = location.pathname === l.path;
                return (
                  <Link key={l.name} to={l.path} className="py-[10px] text-sm" style={{
                    color: isActive ? G.green : "#888",
                    fontWeight: isActive ? 600 : 400,
                  }}>{l.name}</Link>
                );
              })}
            </div>
            <div className="flex gap-2 mt-2">
              <button className="flex-1 text-center py-[9px] text-[13px] rounded-lg" style={{ border: "1px solid rgba(255,255,255,0.12)", color: "#e5e5e5", background: "transparent" }}>Login</button>
              <button className="flex-1 text-center py-[9px] text-[13px] font-semibold rounded-lg" style={{ background: "#6EE7B7", color: "#0A0A0A" }}>Get Started</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

export default Navbar
