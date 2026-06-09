import { projects } from "../data/projects.js";
import { projectDetails } from "../data/projectDetails.js";
import { matchDurationFilter } from "../data/filters.js";

// ─────────────────────────────────────────────
// Project Service
//
// All functions are async so that replacing the
// local data import with a real API call requires
// changing only this file — page components stay
// identical.
//
// Future swap example:
//   return projects;
//   → const res = await api.get("/projects"); return res.data;
// ─────────────────────────────────────────────

export const getProjects = async () => {
  return projects;
};

export const getProjectById = async (id) => {
  return projects.find((p) => p.id === Number(id)) ?? null;
};

export const getProjectBySlug = async (slug) => {
  return projects.find((p) => p.slug === slug) ?? null;
};

export const getFeaturedProjects = async () => {
  return projects.filter((p) => p.featured);
};

export const getRecommendedProjects = async () => {
  return projects.filter((p) => p.recommended);
};

export const getNewestProjects = async () => {
  return projects.filter((p) => p.newest);
};

export const getProjectsByCategory = async (categoryId) => {
  if (!categoryId || categoryId === "all") return projects;
  return projects.filter((p) => p.category === categoryId);
};

export const getProjectDetails = async (slug) => {
  return projectDetails[slug] ?? null;
};

export const getRelatedProjects = async (slug) => {
  const detail = projectDetails[slug];
  if (!detail) return [];

  // Prefer id-based relations (future-proof)
  if (detail.relatedProjectIds?.length) {
    return projects.filter((p) => detail.relatedProjectIds.includes(p.id));
  }

  // Fallback to embedded legacy shape
  return detail.relatedProjects ?? [];
};

/**
 * filterProjects — full client-side filter + sort
 *
 * @param {Object} opts
 * @param {string} opts.category     - category id or "all"
 * @param {string} opts.difficulty   - difficulty label or "All"
 * @param {string} opts.duration     - duration bucket string or "Any"
 * @param {string[]} opts.techStack  - array of tech strings
 * @param {string} opts.sort         - sort option id
 * @param {string} opts.search       - freetext search
 */
export const filterProjects = async ({
  category = "all",
  difficulty = "All",
  duration = "Any",
  techStack = [],
  sort = "popular",
  search = "",
} = {}) => {
  let result = [...projects];

  if (category !== "all") {
    result = result.filter((p) => p.category === category);
  }

  if (difficulty !== "All") {
    result = result.filter((p) => p.difficulty === difficulty);
  }

  if (duration !== "Any") {
    result = result.filter((p) => matchDurationFilter(p.durationWeeks, duration));
  }

  if (techStack.length > 0) {
    result = result.filter((p) =>
      techStack.every((t) => p.stack.includes(t))
    );
  }

  if (search.trim()) {
    const q = search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q) ||
        p.stack.some((s) => s.toLowerCase().includes(q))
    );
  }

  switch (sort) {
    case "popular":
      result.sort((a, b) => b.learners - a.learners);
      break;
    case "newest":
      result = result.filter((p) => p.newest).concat(result.filter((p) => !p.newest));
      break;
    case "recommended":
      result = result.filter((p) => p.recommended).concat(result.filter((p) => !p.recommended));
      break;
    case "shortest":
      result.sort((a, b) => a.durationWeeks - b.durationWeeks);
      break;
    case "longest":
      result.sort((a, b) => b.durationWeeks - a.durationWeeks);
      break;
  }

  return result;
};
