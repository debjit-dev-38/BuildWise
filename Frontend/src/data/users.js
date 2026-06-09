// ─────────────────────────────────────────────
// Users
// Used by: Admin panel user management
// The logged-in user's own record lives in dashboard.js
// ─────────────────────────────────────────────

export const users = [
  { id: 1, name: "Debjit Dey",   email: "debjit@buildwise.dev",  role: "admin",     joined: "2024-09-01", progress: 92 },
  { id: 2, name: "Ananya Sen",   email: "ananya@vit.edu",         role: "user",      joined: "2024-10-12", progress: 67 },
  { id: 3, name: "Rohan Mehta",  email: "rohan.m@gmail.com",      role: "user",      joined: "2024-11-03", progress: 43 },
  { id: 4, name: "Priya Sharma", email: "priya.s@gmail.com",      role: "user",      joined: "2024-11-19", progress: 81 },
  { id: 5, name: "Karan Joshi",  email: "karan.j@outlook.com",    role: "moderator", joined: "2024-10-28", progress: 55 },
  { id: 6, name: "Ishaan Das",   email: "ishaan.d@vit.edu",       role: "user",      joined: "2024-12-01", progress: 12 },
];

export const ROLES = ["admin", "moderator", "user"];

export default users;
