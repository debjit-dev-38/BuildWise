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
import axios from "axios";
import api from "./api.js";
// ─────────────────────────────────────────────
// Admin Service
// Will map to: GET /api/admin/*
// ─────────────────────────────────────────────

export const getPlatformMetrics = async () => {
  return platformMetrics;
};

export const getAdminProjects = async ({
  page = 1,
  limit = 9,
  category,
  difficulty,
  duration,
  tech = [],
  sort,
  search,
} = {}) => {   //{} prevents crashes if someone calls getAdminProjects()

  const params = {
    page,
    limit,
    /* Conditional property inclusion 
    This is the interesting part: ...(category && category !== "all" && { category }),Suppose:category = "Web Development"
    Evaluation:category && category !== "all" becomes:"Web Development" && true 
    which returns:true
    Then:true && { category }returns:{ category: "Web Development" }
    Spread operator adds it:{  page: 1,  limit: 9,  category: "Web Development"} */
    ...(category && category !== "all" && { category }),
    ...(difficulty && difficulty !== "All" && { difficulty }),
    ...(duration && duration !== "Any" && { duration }),
    ...(tech.length > 0 && { tech: tech.join(",") }),
    ...(sort && { sort }),
    ...(search && { search }),
  };

  const { data } = await axios.get(`${import.meta.env.VITE_APP_URI}/api/v1/projects/get-project`, { params });
  return data.data; // { projects, totalProjects, page, totalPages, hasNextPage }
}

export const getAdminLearningPaths = async () => {
  return adminLearningPaths;
};

export const getAdminUsers = async ({
  page = 1,
  limit = 5,
  role,
  search
} = {}) => {
  const params = {
    page,
    limit,
    ...(role && role !== "All" && { role }),
    ...(search && { search })
  }

  const { data } = await api.get("/api/v1/users/get-users", { params });
  return data.data
};


export const updateUserRole = async (id, role) => {
  const { data } = await api.patch(
    `/api/v1/users/role/${id}`,
    { role }
  );

  return data.data;
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
