import { COLORS,C } from "../Constants/theme.js";

import {
  Flame,
  Rocket,
  Clock,
  TrendingUp,
  Monitor,
  Server,
  Layers,
  Brain,
  Check,
  Code2,
  Star,
  Play,
  GitCommit,
  Zap,
} from "lucide-react";

// ─────────────────────────────────────────────
// Dashboard Data
// Represents the currently logged-in user's
// personal state. Will be replaced by API calls
// to /api/me, /api/me/activity, etc.
// ─────────────────────────────────────────────

export const currentUser = {
  id: 1,
  name: "Debjit Roy",
  email: "debjit@buildwise.dev",
  role: "admin",
  joined: "2024-09-01",
  avatar: null,
  level: 4,
  xp: 3240,
  xpToNextLevel: 4000,
};

export const userStats = [
  {
    label: "Day Streak",
    val: 12,
    suffix: "🔥",
    icon: Flame,
    color: COLORS.amber,
    delta: "+3 this week",
  },
  {
    label: "Projects Shipped",
    val: 7,
    suffix: "",
    icon: Rocket,
    color: COLORS.green,
    delta: "+1 this month",
  },
  {
    label: "Hours Learned",
    val: 94,
    suffix: "h",
    icon: Clock,
    color: COLORS.indigo,
    delta: "+8 this week",
  },
  {
    label: "Current Level",
    val: 4,
    suffix: "",
    icon: TrendingUp,
    color: COLORS.pink,
    delta: "Lv 5 soon",
  },
];

// User's progress per learning path

export const userPathProgress = [
  {
    pathId: 1,
    title: "Frontend Mastery",
    icon: Monitor,
    color: COLORS.green,
    progress: 68,
    lessonsCompleted: 24,
    totalLessons: 36,
    desc:
      "Build responsive UIs with React, Tailwind, and modern tooling. Ships a portfolio-grade project.",
  },
  {
    pathId: 2,
    title: "Backend APIs",
    icon: Server,
    color: COLORS.indigo,
    progress: 31,
    lessonsCompleted: 9,
    totalLessons: 28,
    desc:
      "REST and GraphQL APIs with Node.js, Postgres, and Redis. Auth, rate limiting, and deployment included.",
  },
  {
    pathId: 3,
    title: "Full Stack SaaS",
    icon: Layers,
    color: COLORS.pink,
    progress: 12,
    lessonsCompleted: 4,
    totalLessons: 32,
    desc:
      "End-to-end SaaS with payments, auth, and dashboards. Launch a live product by the end.",
  },
  {
    pathId: 4,
    title: "AI / ML Basics",
    icon: Brain,
    color: COLORS.amber,
    progress: 0,
    lessonsCompleted: 0,
    totalLessons: 20,
    desc:
      "Fine-tune models, build pipelines, and integrate LLMs into real applications.",
  },
];

// User's active projects

export const userProjects = [
  {
    projectId: 1,
    name: "AI Chat App",
    color: COLORS.green,
    difficulty: "Intermediate",
    duration: "4 wks",
    stack: ["Next.js", "OpenAI", "Postgres"],
    image: "AI",
    progress: 75,
  },
  {
    projectId: 2,
    name: "SaaS Dashboard",
    color: COLORS.indigo,
    difficulty: "Advanced",
    duration: "6 wks",
    stack: ["React", "Stripe", "Supabase"],
    image: "SA",
    progress: 30,
  },
  {
    projectId: 3,
    name: "Dev Portfolio",
    color: COLORS.pink,
    difficulty: "Beginner",
    duration: "2 wks",
    stack: ["React", "Framer", "MDX"],
    image: "PF",
    progress: 100,
  },
];

export const recentActivity = [
  {
    icon: Check,
    color: COLORS.green,
    label: "Completed",
    text: "Module 3: Streaming Responses",
    time: "2h ago",
  },
  {
    icon: Code2,
    color: COLORS.indigo,
    label: "Committed",
    text: "Pushed 14 files to ai-chat-app",
    time: "5h ago",
  },
  {
    icon: Star,
    color: COLORS.amber,
    label: "Achievement",
    text: "Earned 'Week Warrior' badge",
    time: "Yesterday",
  },
  {
    icon: Play,
    color: COLORS.green,
    label: "Started",
    text: "Module 4: Conversation History",
    time: "Yesterday",
  },
  {
    icon: GitCommit,
    color: COLORS.pink,
    label: "Milestone",
    text: "Reached 10 GitHub commits",
    time: "2 days ago",
  },
];
export default {
  currentUser,
  userStats,
  userPathProgress,
  userProjects,
  recentActivity,
};