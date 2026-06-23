import {
  currentUser,
  userStats,
  userPathProgress,
  userProjects,
  recentActivity,
} from "../data/dashboard.js";
import { achievements } from "../data/achievements.js";

// ─────────────────────────────────────────────
// Dashboard Service
// Will map to: GET /api/me/*
// ─────────────────────────────────────────────


export const getUserStats = async () => {
  return userStats;
};

export const getUserPathProgress = async () => {
  return userPathProgress;
};

export const getUserProjects = async () => {
  return userProjects;
};

export const getRecentActivity = async () => {
  return recentActivity;
};

export const getUserAchievements = async () => {
  // Returns all achievements with unlocked state for the current user
  return achievements;
};

export const getDashboardSummary = async () => {
  const [stats, paths, projects, activity, userAchievements] =
    await Promise.all([
      getUserStats(),
      getUserPathProgress(),
      getUserProjects(),
      getRecentActivity(),
      getUserAchievements(),
    ]);
  return { stats, paths, projects, activity, achievements: userAchievements };
};
