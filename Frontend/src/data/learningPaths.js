import { COLORS } from "../constants/theme.js";
import {
  Monitor,
  Server,
  Layers,
  Brain,
  Container,
} from "lucide-react";
// ─────────────────────────────────────────────
// Learning Paths
// Used by: Home hero, Projects page sidebar,
//          Dashboard progress cards
// ─────────────────────────────────────────────

export const learningPaths = [
  {
    id: 1,
    slug: "frontend-mastery",
    title: "Frontend Mastery",
    iconKey: Monitor,
    color: COLORS.green,
    desc: "React, TypeScript, animations, performance",
    duration: "8 weeks",
    modules: 12,
    totalModules: 36,
    difficulty: "Beginner",
    status: "Published",
    steps: [
      "HTML & CSS Foundations",
      "JavaScript Mastery",
      "React Ecosystem",
      "Advanced Patterns",
    ],
  },
  {
    id: 2,
    slug: "backend-apis",
    title: "Backend APIs",
    iconKey: Server,
    color: COLORS.indigo,
    desc: "Node.js, databases, APIs, system design",
    duration: "10 weeks",
    modules: 9,
    totalModules: 28,
    difficulty: "Intermediate",
    status: "Published",
    steps: [
      "Node & Express",
      "Databases & SQL",
      "REST & GraphQL",
      "Microservices",
    ],
  },
  {
    id: 3,
    slug: "full-stack-bootcamp",
    title: "Full Stack Bootcamp",
    iconKey: Layers,
    color: COLORS.pink,
    desc: "End-to-end apps, deployment, production",
    duration: "16 weeks",
    modules: 24,
    totalModules: 24,
    difficulty: "Intermediate",
    status: "Published",
    steps: [
      "Frontend Basics",
      "Backend APIs",
      "Database Design",
      "Deploy & Scale",
    ],
  },
  {
    id: 4,
    slug: "ai-engineering",
    title: "AI Engineering",
    iconKey: Brain,
    color: COLORS.amber,
    desc: "LLMs, agents, ML pipelines, embeddings",
    duration: "12 weeks",
    modules: 0,
    totalModules: 20,
    difficulty: "Advanced",
    status: "Draft",
    steps: [
      "Python & Math",
      "ML Fundamentals",
      "LLM Integration",
      "AI Products",
    ],
  },
  {
    id: 5,
    slug: "devops-cloud",
    title: "DevOps & Cloud",
    iconKey: Container,
    color: COLORS.indigo,
    desc: "Docker, Kubernetes, CI/CD, cloud infra",
    duration: "10 weeks",
    modules: 15,
    totalModules: 15,
    difficulty: "Intermediate",
    status: "Review",
    steps: [
      "Linux & Bash",
      "Docker & Containers",
      "Kubernetes",
      "Cloud & CI/CD",
    ],
  },
];

export default learningPaths;
