import { COLORS } from "../constants/theme.js";

import {
  Rocket,
  Flame,
  Layers,
  Code2,
  Brain,
  Trophy,
  Zap,
} from "lucide-react";

// ─────────────────────────────────────────────
// Achievements
// Used by: Dashboard, Admin panel
// ─────────────────────────────────────────────

export const achievements = [
  {
    id: 1,
    name: "First Ship",
    icon: Rocket,
    color: COLORS.green,
    desc: "Deploy your first project",
    xp: 50,
    unlocked: true,
  },
  {
    id: 2,
    name: "Week Warrior",
    icon: Flame,
    color: COLORS.amber,
    desc: "7-day learning streak",
    xp: 100,
    unlocked: true,
  },
  {
    id: 3,
    name: "Stack Master",
    icon: Layers,
    color: COLORS.indigo,
    desc: "Use 5 different tech stacks",
    xp: 200,
    unlocked: true,
  },
  {
    id: 4,
    name: "Code Ninja",
    icon: Code2,
    color: COLORS.pink,
    desc: "100 commits milestone",
    xp: 300,
    unlocked: false,
  },
  {
    id: 5,
    name: "AI Pioneer",
    icon: Brain,
    color: COLORS.green,
    desc: "Complete an AI/ML project",
    xp: 400,
    unlocked: false,
  },
  {
    id: 6,
    name: "Path Pioneer",
    icon: Trophy,
    color: COLORS.amber,
    desc: "Complete a full learning path",
    xp: 500,
    unlocked: false,
  },
  {
    id: 7,
    name: "Full Streaker",
    icon: Zap,
    color: COLORS.amber,
    desc: "30-day learning streak",
    xp: 600,
    unlocked: false,
  },
];

export default achievements;