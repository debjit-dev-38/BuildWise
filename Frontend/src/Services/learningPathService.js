import { learningPaths } from "../data/learningPaths.js";

// ─────────────────────────────────────────────
// Learning Path Service
// ─────────────────────────────────────────────

export const getLearningPaths = async () => {
  return learningPaths;
};

export const getLearningPathById = async (id) => {
  return learningPaths.find((p) => p.id === Number(id)) ?? null;
};

export const getLearningPathBySlug = async (slug) => {
  return learningPaths.find((p) => p.slug === slug) ?? null;
};

export const getPublishedPaths = async () => {
  return learningPaths.filter((p) => p.status === "Published");
};

export const getLearningPathsByDifficulty = async (difficulty) => {
  return learningPaths.filter((p) => p.difficulty === difficulty);
};
