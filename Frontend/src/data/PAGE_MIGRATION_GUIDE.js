// ═══════════════════════════════════════════════════════════════
// BuildWise — Page Component Update Guide
// How every page imports data after the refactor
// ═══════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────
// 1. Home.jsx  (BuildWise.jsx)
// ─────────────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import { platformStats, communityStats, howItWorksSteps } from "./platform";
import { comparisonTable } from "./about";
import { testimonials } from "./testimonials";
import { getFeaturedProjects } from "../services/projectService";
import { getPublishedPaths } from "../services/learningPathService";
import { COLORS, FONTS } from "../constants/theme";

export default function Home() {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [paths, setPaths] = useState([]);

  useEffect(() => {
    getFeaturedProjects().then(setFeaturedProjects);
    getPublishedPaths().then(setPaths);
  }, []);

  // platformStats      → animated hero counters
  // communityStats     → community proof section
  // howItWorksSteps    → How It Works section
  // comparisonTable    → BuildWise vs others table
  // testimonials       → testimonial carousel
  // featuredProjects   → project cards section
  // paths              → learning path preview
}


// ─────────────────────────────────────────────────────────────
// 2. About.jsx
// ─────────────────────────────────────────────────────────────

import { philosophy, team, roadmap, comparisonTable } from "./about";
import { testimonials } from "./testimonials";
import { platformStats } from "./platform";
import { COLORS, FONTS } from "../constants/theme";

export default function About() {
  // philosophy     → philosophy section (3 cards)
  // team           → team grid
  // roadmap        → product roadmap timeline
  // comparisonTable→ comparison grid
  // testimonials   → testimonial section
  // platformStats  → stats bar (reused from Home)
}


// ─────────────────────────────────────────────────────────────
// 3. Projects.jsx
// ─────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import { filterProjects } from "../services/projectService";
import {
  categories,
  difficulties,
  durations,
  sortOptions,
  techFilters,
} from "./filters";
import { COLORS, FONTS, DIFFICULTY_COLORS } from "../constants/theme";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [filters, setFilters] = useState({
    category: "all",
    difficulty: "All",
    duration: "Any",
    techStack: [],
    sort: "popular",
    search: "",
  });

  useEffect(() => {
    filterProjects(filters).then(setProjects);
  }, [filters]);

  // categories    → category tab bar
  // difficulties  → difficulty dropdown
  // durations     → duration dropdown
  // sortOptions   → sort dropdown
  // techFilters   → tech multi-select
  // projects      → filtered project grid
}


// ─────────────────────────────────────────────────────────────
// 4. ProjectDetails.jsx
// ─────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getProjectBySlug, getProjectDetails, getRelatedProjects } from "../services/projectService";
import { COLORS, FONTS, DIFFICULTY_COLORS } from "../constants/theme";

export default function ProjectDetails() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [details, setDetails] = useState(null);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    getProjectBySlug(slug).then(setProject);
    getProjectDetails(slug).then(setDetails);
    getRelatedProjects(slug).then(setRelated);
  }, [slug]);

  // project  → header meta (name, difficulty, duration, stack)
  // details  → full detail content:
  //   details.summary, details.problem, details.solution
  //   details.features, details.gallery, details.challenges
  //   details.timeline, details.metrics, details.stack, details.info
  // related  → related projects section
}


// ─────────────────────────────────────────────────────────────
// 5. Dashboard.jsx
// ─────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import { getDashboardSummary } from "../services/dashboardService";
import { COLORS, FONTS } from "../constants/theme";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getDashboardSummary().then(setData);
  }, []);

  if (!data) return null;

  const { user, stats, paths, projects, activity, achievements } = data;

  // user          → greeting, avatar, level
  // stats         → 4-stat cards row (streak, ships, hours, level)
  // paths         → learning path progress cards
  // projects      → active projects list
  // activity      → recent activity feed
  // achievements  → badge grid
}


// ─────────────────────────────────────────────────────────────
// 6. AdminPanel.jsx
// ─────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import {
  getAdminDashboardSummary,
  getAdminProjects,
  getAdminUsers,
  getAdminLearningPaths,
  getAdminAchievements,
} from "../Services/adminService";
import { COLORS, FONTS } from "../Constants/theme";

export default function AdminPanel() {
  const [summary, setSummary]   = useState(null);
  const [projects, setProjects] = useState([]);
  const [users, setUsers]       = useState([]);
  const [paths, setPaths]       = useState([]);
  const [badges, setBadges]     = useState([]);

  useEffect(() => {
    getAdminDashboardSummary().then(setSummary);
    getAdminProjects().then(setProjects);
    getAdminUsers().then(setUsers);
    getAdminLearningPaths().then(setPaths);
    getAdminAchievements().then(setBadges);
  }, []);

  // summary.metrics       → platform stat cards
  // summary.activity      → recent activity feed
  // summary.notifications → notification bell dropdown
  // summary.charts        → chart data (recharts / d3)
  //   .charts.userGrowth
  //   .charts.projectViews
  //   .charts.pathCompletions
  // projects              → project management table
  // users                 → user management table
  // paths                 → learning path table
  // badges                → achievements management
}
