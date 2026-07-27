import { projects } from "../data/projects.js";
import { projectDetails } from "../data/projectDetails.js";
import { matchDurationFilter } from "../data/filters.js";
import api from "./api.js";

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



export const getProjects = async ({
  page = 1,
  limit = 9,
  category,
  difficulty,
  duration,
  tech = [],
  sort,
  search,
} = {}) => {
  const params = {
    page,
    limit,
    ...(category && category !== "all" && { category }),
    ...(difficulty && difficulty !== "All" && { difficulty }),
    ...(duration && duration !== "Any" && { duration }),
    ...(tech.length > 0 && { tech: tech.join(",") }),
    ...(sort && { sort }),
    ...(search && { search }),
  };

  const { data } = await api.get("/api/v1/projects/get-project", { params });
  return data.data; // { projects, totalProjects, page, totalPages, hasNextPage }
}
export const getProjectById = async (id) => {
  return projects.find((p) => p.id === Number(id)) ?? null;  //not required
};

export const getProjectBySlug = async (slug) => {
  const res = await api.get(`/api/v1/projects/get-project/${slug}`);

  return res.data.data;
};

/**
 * getProjectModules — fetch project + modules data from backend
 * Used by BuildWiseLearningPage to load full learning content
 *
 * @param {string} slug - the project slug
 * @returns {Object} { project: {...}, modules: [...] }
 */


export const getProjectModules = async (slug) => {
  // Fetch project
  const projectRes = await api.get(`/api/v1/projects/get-project/${slug}`);

  const projectData = projectRes.data.data;

  // Fetch enrollment
  const enrollmentRes = await api.get(
    `/api/v1/enroll/get-enrollments/${projectData._id}`
  );

  const enrollment = enrollmentRes.data.data;

  const completedSet = new Set(
    (enrollment?.completedModules || []).map((id) => id.toString())
  );

  const currentModuleId =
    enrollment?.currentModule?.toString() || null;

  const currentIndex = projectData.modules.findIndex(
    (m) => m._id.toString() === currentModuleId
  );

  // Extract project info
  const project = {
    id: projectData._id,
    title: projectData.name,
    slug: projectData.slug,
    difficulty: projectData.difficulty,
    duration: projectData.duration,
    learners: projectData.metrics?.[0]?.num ?? 0,
    rating: projectData.metrics?.[1]?.num ?? 0,
    category: projectData.category,
    techStack: projectData.stack?.map((s) => s.name) ?? [],
  };

  const modules = (projectData.modules ?? []).map((m, idx) => ({
    id: m._id.toString(),
    order: m.order ?? idx + 1,
    title: m.phase,
    description: m.desc,
    duration: m.duration,
    pdfUrl: m.pdfUrl || null,
    pdfPublicId: m.pdfPublicId || "",

    completed: completedSet.has(m._id.toString()),

    unlocked:
      currentIndex === -1
        ? idx === 0
        : idx <= currentIndex,
  }));

  return {
    project,
    modules,
    currentModuleId,
  };
};

export const getFeaturedProjects = async () => {
  return projects.filter((p) => p.featured);
};

export const getRecommendedProjects = async () => {
  return projects.filter((p) => p.recommended);
};

export const getNewestProjects = async () => {
  return projects.filter((p) => p.newest); //na
};

export const getProjectsByCategory = async (categoryId) => {
  if (!categoryId || categoryId === "all") return projects;
  return projects.filter((p) => p.category === categoryId); //ma
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
export const filterProjects = async (
  projects,
  {
    category = "all",
    difficulty = "All",
    duration = "Any",
    techStack = [],
    sort = "popular",
    search = "",
  } = {}
) => {
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
      techStack.every((t) =>
        (p.stack || []).some((s) =>
          (typeof s === "string" ? s : s?.name) === t
        )
      )
    );
  }

  if (search.trim()) {
    const q = search.toLowerCase();

    result = result.filter(
      (p) =>
        (p.name || "").toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q) ||
        (p.stack || []).some((s) =>
          (typeof s === "string" ? s : s?.name || "")
            .toLowerCase()
            .includes(q)
        )
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
