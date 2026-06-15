// ─────────────────────────────────────────────
// Filter & Sort Configuration
// Used by: Projects page filter bar
// ─────────────────────────────────────────────

import {
  Sparkles,
  Database,
  Shield,
  Monitor,
  Server,
  Layers,
  Brain,
  Smartphone,
  Container,
  TrendingUp,
  Zap,
  Star,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

export const categories = [
  { id: "all", label: "All", icon: Sparkles },

  { id: "Frontend", label: "Frontend", icon: Monitor },

  { id: "Backend", label: "Backend", icon: Server },

  { id: "Full Stack", label: "Full Stack", icon: Layers },

  { id: "Mobile", label: "Mobile", icon: Smartphone },

  { id: "DevOps", label: "DevOps", icon: Container },

  { id: "AI/ML", label: "AI/ML", icon: Brain },

  { id: "Data", label: "Data", icon: Database },

  { id: "Security", label: "Security", icon: Shield },
];

export const difficulties = [
  "All",
  "Beginner",
  "Intermediate",
  "Advanced",
];

export const durations = [
  "Any",
  "< 2 weeks",
  "2–4 weeks",
  "4–6 weeks",
  "6+ weeks",
];

export const sortOptions = [
  { id: "popular", label: "Most Popular", icon: TrendingUp },
  { id: "newest", label: "Newest", icon: Zap },
  { id: "recommended", label: "Recommended", icon: Star },
  { id: "shortest", label: "Shortest Duration", icon: ArrowUp },
  { id: "longest", label: "Longest Duration", icon: ArrowDown },
];

export const techFilters = [
  "React",
  "Next.js",
  "Node.js",
  "TypeScript",
  "Python",
  "PostgreSQL",
  "MongoDB",
  "Docker",
  "Go",
  "Tailwind CSS",
  "OpenAI",
  "Supabase",
  "Stripe",
  "GraphQL",
];

export const matchDurationFilter = (durationWeeks, filter) => {
  switch (filter) {
    case "< 2 weeks":
      return durationWeeks < 2;

    case "2–4 weeks":
      return durationWeeks >= 2 && durationWeeks <= 4;

    case "4–6 weeks":
      return durationWeeks > 4 && durationWeeks <= 6;

    case "6+ weeks":
      return durationWeeks > 6;

    default:
      return true;
  }
};

export default {
  categories,
  difficulties,
  durations,
  sortOptions,
  techFilters,
  matchDurationFilter,
};