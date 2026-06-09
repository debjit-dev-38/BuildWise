import {
  platformMetrics,
  adminProjects,
  adminLearningPaths,
  adminUsers,
  adminAchievements,
  adminActivity,
  adminNotifications,
  chartUserGrowth,
  chartProjectViews,
  chartPathCompletions,
} from "../data/admin.js";

// ─────────────────────────────────────────────
// Admin Service
// Will map to: GET /api/admin/*
// ─────────────────────────────────────────────

export const getPlatformMetrics = async () => {
  return platformMetrics;
};

export const getAdminProjects = async () => {
  return adminProjects;
};

export const getAdminLearningPaths = async () => {
  return adminLearningPaths;
};

export const getAdminUsers = async () => {
  return adminUsers;
};

export const getAdminUserById = async (id) => {
  return adminUsers.find((u) => u.id === Number(id)) ?? null;
};

export const getAdminAchievements = async () => {
  return adminAchievements;
};

export const getAdminActivity = async () => {
  return adminActivity;
};

export const getAdminNotifications = async () => {
  return adminNotifications;
};

export const getChartData = async () => {
  return {
    userGrowth: chartUserGrowth,
    projectViews: chartProjectViews,
    pathCompletions: chartPathCompletions,
  };
};

export const getAdminDashboardSummary = async () => {
  const [metrics, activity, notifications, charts] = await Promise.all([
    getPlatformMetrics(),
    getAdminActivity(),
    getAdminNotifications(),
    getChartData(),
  ]);
  return { metrics, activity, notifications, charts };
};
