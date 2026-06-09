// ─────────────────────────────────────────────
// Platform Data
// Homepage stats, community counters, how-it-works
// ─────────────────────────────────────────────

// Animated counters on the homepage hero / stats bar
import {
  Users,
  Code2,
  Map,
  CheckCircle2,
  Search,
  Rocket,
} from "lucide-react";
export const platformStats = [
  { to: 18000, suffix: "+", label: "Builders", icon: Users },
  { to: 2400, suffix: "+", label: "Projects Completed", icon: Code2 },
  { to: 48, suffix: "", label: "Learning Paths", icon: Map },
  { to: 94, suffix: "%", label: "Completion Rate", icon: CheckCircle2 },
];

export const communityStats = [
  { val: 18432, label: "Builders enrolled", suffix: "" },
  { val: 2400, label: "Projects shipped", suffix: "" },
  { val: 94, label: "Completion rate", suffix: "%" },
  { val: 4.9, label: "Average rating", suffix: "★" },
];

export const howItWorksSteps = [
  {
    num: "01",
    title: "Choose a Project",
    desc: "Browse curated projects filtered by tech stack, difficulty, and time commitment.",
    icon: Search,
  },
  {
    num: "02",
    title: "Follow the Roadmap",
    desc: "Step-by-step structured guide with explanations, resources, and checkpoints.",
    icon: Map,
  },
  {
    num: "03",
    title: "Build & Deploy",
    desc: "Ship a real project to production. Add it to your portfolio and share it.",
    icon: Rocket,
  },
];