import {
  Code2,
  Rocket,
  Target,
  Cpu,
  GitBranch,
  Users,
  BookOpen,
  Heart,
} from "lucide-react";

import { COLORS } from "../constants/theme.js";

// ─────────────────────────────────────────────
// About Page Data
// ─────────────────────────────────────────────

export const philosophy = [
  {
    icon: Code2,
    color: COLORS.green,
    title: "Learn by Building",
    desc: "Every skill you gain is anchored to something you shipped. No abstract concepts without context — just real code solving real problems.",
  },
  {
    icon: Rocket,
    color: COLORS.indigo,
    title: "Ship Before Perfect",
    desc: "Done is better than perfect. We believe momentum matters more than polish. Shipping imperfect code you can iterate on beats polishing code that never ships.",
  },
  {
    icon: Target,
    color: COLORS.amber,
    title: "Real Projects, Real Skills",
    desc: "Every project on BuildWise mirrors what engineering teams actually build. Interview ready. Portfolio ready. Production ready.",
  },
];

export const team = [
  {
    id: 1,
    name: "Arya Mehta",
    role: "Co-founder & CEO",
    bio: "Ex-Stripe, 10y in developer tooling. Believes the only way to learn engineering is to engineer things.",
    img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
  },
  {
    id: 2,
    name: "James Okonkwo",
    role: "Co-founder & CTO",
    bio: "Built ML infra at Anthropic. Obsessed with learning systems and how developers actually grow.",
    img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80",
  },
  {
    id: 3,
    name: "Priya Sharma",
    role: "Head of Curriculum",
    bio: "Former SWE at Google. Designed onboarding systems used by 40K+ engineers. Projects-first believer.",
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
  },
  {
    id: 4,
    name: "Lucas Weber",
    role: "Head of Community",
    bio: "Built developer communities at GitHub and Vercel. Turns builders into a network that compounds.",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
  },
];

export const roadmap = [
  {
    icon: Cpu,
    label: "AI-assisted guidance",
    desc: "Real-time hints and code review from an AI that knows your project context.",
    color: COLORS.green,
    status: "In Progress",
  },
  {
    icon: GitBranch,
    label: "Community challenges",
    desc: "Monthly themed builds with feedback from peers and senior engineers.",
    color: COLORS.indigo,
    status: "Q3 2025",
  },
  {
    icon: Users,
    label: "Mentorship network",
    desc: "1-on-1 pairing with senior engineers for project reviews and career advice.",
    color: COLORS.amber,
    status: "Q4 2025",
  },
  {
    icon: BookOpen,
    label: "Expanded learning paths",
    desc: "50+ more paths covering DevOps, Web3, mobile, and systems programming.",
    color: COLORS.green,
    status: "Ongoing",
  },
  {
    icon: Heart,
    label: "Open source contributions",
    desc: "Build on real open-source projects with community maintainers as mentors.",
    color: COLORS.indigo,
    status: "2026",
  },
];

// [category, old platform, BuildWise]
export const comparisonTable = [
  { cat: "Approach", old: "Passive consumption", bw: "Active creation" },
  { cat: "Theory", old: "Heavy, upfront", bw: "Just-in-time, applied" },
  { cat: "Tutorial Hell", old: "Endless re-watching", bw: "Ship, reflect, iterate" },
  { cat: "Certificates", old: "Completion badges", bw: "Live deployed projects" },
  { cat: "Portfolio", old: "Todo apps & clones", bw: "Real production-grade work" },
  { cat: "Job Readiness", old: "Theory without practice", bw: "Proven through shipping" },
  { cat: "Real Experience", old: "Simulated exercises", bw: "Actual engineering challenges" },
];

export default { philosophy, team, roadmap, comparisonTable };