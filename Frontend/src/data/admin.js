// ─────────────────────────────────────────────
// Admin Panel Data
// Will be replaced by:
//   GET /api/admin/stats
//   GET /api/admin/users
//   GET /api/admin/activity
//   etc.
// ─────────────────────────────────────────────

export const platformMetrics = {
  totalUsers: 4821,
  totalProjects: 138,
  totalLearningPaths: 24,
  totalCompletions: 9342,
  activeUsers: 1203,
  newUsersThisWeek: 317,
};

// Admin project table — mirrors structure from projects.js
// but with admin-specific fields (status, created date)
export const adminProjects = [
  { id: 1,  name: "Todo App with Auth",      category: "Web Dev",    difficulty: "Beginner",     tech: ["React","Firebase"],             status: "Published", created: "2024-11-01" },
  { id: 2,  name: "E-Commerce Dashboard",    category: "Full Stack", difficulty: "Intermediate", tech: ["Next.js","MongoDB","Stripe"],    status: "Published", created: "2024-11-08" },
  { id: 3,  name: "AI Chat Interface",       category: "AI/ML",      difficulty: "Advanced",     tech: ["Python","FastAPI","OpenAI"],     status: "Draft",     created: "2024-11-15" },
  { id: 4,  name: "Portfolio Generator",     category: "Web Dev",    difficulty: "Beginner",     tech: ["HTML","CSS","JS"],              status: "Published", created: "2024-11-20" },
  { id: 5,  name: "Real-Time Chat App",      category: "Full Stack", difficulty: "Intermediate", tech: ["React","Socket.io","Node"],      status: "Review",    created: "2024-11-28" },
  { id: 6,  name: "Blockchain Wallet",       category: "Web3",       difficulty: "Advanced",     tech: ["Solidity","Ethers.js","React"],  status: "Draft",     created: "2024-12-03" },
];

export const adminLearningPaths = [
  { id: 1, name: "Frontend Mastery",   difficulty: "Beginner",     duration: "8 weeks",  modules: 12, status: "Published" },
  { id: 2, name: "Full Stack Bootcamp",difficulty: "Intermediate", duration: "16 weeks", modules: 24, status: "Published" },
  { id: 3, name: "AI Engineering",     difficulty: "Advanced",     duration: "12 weeks", modules: 18, status: "Draft" },
  { id: 4, name: "DevOps & Cloud",     difficulty: "Intermediate", duration: "10 weeks", modules: 15, status: "Review" },
];

export const adminUsers = [
  { id: 1, name: "Debjit Dey",    email: "debjit@buildwise.dev",  role: "admin",     joined: "2024-09-01", progress: 92 },
  { id: 2, name: "Ananya Sen",    email: "ananya@vit.edu",         role: "user",      joined: "2024-10-12", progress: 67 },
  { id: 3, name: "Rohan Mehta",   email: "rohan.m@gmail.com",      role: "user",      joined: "2024-11-03", progress: 43 },
  { id: 4, name: "Priya Sharma",  email: "priya.s@gmail.com",      role: "user",      joined: "2024-11-19", progress: 81 },
  { id: 5, name: "Karan Joshi",   email: "karan.j@outlook.com",    role: "moderator", joined: "2024-10-28", progress: 55 },
  { id: 6, name: "Ishaan Das",    email: "ishaan.d@vit.edu",       role: "user",      joined: "2024-12-01", progress: 12 },
];

export const adminAchievements = [
  { id: 1, name: "First Commit",  description: "Complete your first project",   icon: "🚀", xp: 50 },
  { id: 2, name: "Stack Master",  description: "Use 5+ tech stacks",             icon: "⚡", xp: 200 },
  { id: 3, name: "Path Pioneer",  description: "Complete a full learning path",  icon: "🏆", xp: 500 },
];

export const adminActivity = [
  { id: 1, action: "Project Added",          detail: "E-Commerce Dashboard by admin",              time: "2 min ago",  iconKey: "FolderOpen" },
  { id: 2, action: "User Promoted",          detail: "Karan Joshi → Moderator",                    time: "18 min ago", iconKey: "UserCheck" },
  { id: 3, action: "Learning Path Updated",  detail: "Full Stack Bootcamp — Module 8 revised",     time: "1 hr ago",   iconKey: "BookOpen" },
  { id: 4, action: "Achievement Created",    detail: "'Stack Master' badge added",                  time: "3 hr ago",   iconKey: "Trophy" },
  { id: 5, action: "Project Deleted",        detail: "Draft: Weather Widget removed",              time: "5 hr ago",   iconKey: "Trash2" },
];

export const adminNotifications = [
  { id: 1, type: "user",     message: "14 new users registered today",      time: "just now" },
  { id: 2, type: "approval", message: "3 projects pending review",          time: "10 min ago" },
  { id: 3, type: "report",   message: "1 reported comment needs action",    time: "32 min ago" },
];

// ─── Chart Data ───────────────────────────────

export const chartUserGrowth = [
  { month: "Aug", users: 1800 },
  { month: "Sep", users: 2400 },
  { month: "Oct", users: 3100 },
  { month: "Nov", users: 3800 },
  { month: "Dec", users: 4200 },
  { month: "Jan", users: 4821 },
];

export const chartProjectViews = [
  { week: "W1", views: 820 },
  { week: "W2", views: 1340 },
  { week: "W3", views: 990 },
  { week: "W4", views: 1780 },
  { week: "W5", views: 2100 },
  { week: "W6", views: 1620 },
];

export const chartPathCompletions = [
  { name: "Frontend",   completions: 312 },
  { name: "Full Stack", completions: 198 },
  { name: "AI Eng",     completions: 87 },
  { name: "DevOps",     completions: 143 },
];

export default {
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
};
