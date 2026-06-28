import {
  currentUser,
  userStats,
  userPathProgress,
  userProjects,
  recentActivity,
} from "../data/dashboard.js";
import { COLORS, FONTS, C } from "../Constants/theme";
import { achievements } from "../data/achievements.js";
import api from "../Services/api.js"
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

// ─────────────────────────────────────────────
// Dashboard Service
// Will map to: GET /api/me/*
// ─────────────────────────────────────────────


export const getUserStats = async () => {
  const statsRes = await api.get("/api/v1/dashboard/get-UserStats")

  const stats = statsRes?.data?.data
  const xp=stats?.xp
  const dashboardStats = [
    {
      label: "Day Streak",
      val: stats?.dayStreak?.value ?? 0,
      suffix: "",
      icon: Flame,
      color: COLORS.amber,
    },
    {
      label: "Projects Shipped",
      val: stats?.projectsShipped?.value ?? 0,
      suffix: "",
      icon: Rocket,
      color: COLORS.green,
    },
    {
      label: "Hours Learned",
      val: stats?.hoursLearned?.value ?? 0,
      suffix: "",
      icon: Clock,
      color: COLORS.indigo,
    },
    {
      label: "Current Level",
      val: stats?.currentLevel?.value ?? 1,
      suffix: "",
      icon: TrendingUp,
      color: COLORS.pink,
    },
  ];
  return {dashboardStats,xp}
};


export const getUserProjects = async () => {
  const projectsRes = await api.get("/api/v1/dashboard/get-UserProjects")

  const userProjects = projectsRes?.data?.data

  return userProjects;
};

export const getUserAchievements = async () => {
  // Returns all achievements with unlocked state for the current user
  return achievements;
};

export const getDashboardSummary = async () => {
  const [ { dashboardStats, xp }, projects, userAchievements] =
    await Promise.all([
      getUserStats(),
      getUserProjects(),
      getUserAchievements(),
    ]);
  return { stats: dashboardStats, xp, projects, achievements: userAchievements };
};
