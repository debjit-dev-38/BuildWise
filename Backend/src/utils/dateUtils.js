/**
 * utils/dateUtils.js
 *
 * Timezone-safe date helpers for Asia/Kolkata (IST, UTC+5:30).
 *
 * Why not just use `new Date()` and compare UTC midnight?
 *   A user active at 11:45 PM IST is still on "today" in IST,
 *   but UTC midnight may already have flipped to "tomorrow".
 *   All calendar-day comparisons must use IST boundaries.
 *
 * Strategy: convert any UTC Date to an IST "wall-clock" date string
 * ("YYYY-MM-DD") by using Intl.DateTimeFormat, then compare strings.
 * No external libraries needed.
 */

const TZ = "Asia/Kolkata";

/**
 * Returns the IST calendar date string ("YYYY-MM-DD") for a given UTC Date.
 * Defaults to now if no date is provided.
 *
 * @param {Date} [date=new Date()]
 * @returns {string} e.g. "2024-07-15"
 */
export function toISTDateString(date = new Date()) {
  // Intl.DateTimeFormat with timeZone renders the wall-clock date in IST.
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  // en-CA locale formats as YYYY-MM-DD, which is what we want.
  return parts.map((p) => p.value).join(""); // "2024-07-15"
}

/**
 * Returns the UTC Date object corresponding to Monday 00:00:00 IST
 * of the current IST week.
 *
 * Why Monday? ISO week starts on Monday.
 * The returned Date is a true UTC instant — safe to use in MongoDB $gte queries.
 *
 * @returns {Date}
 */
export function getISTWeekStart() {
  const nowIST = new Date(
    new Date().toLocaleString("en-US", { timeZone: TZ })
  );

  // 0=Sun,1=Mon,...,6=Sat  →  shift so Monday=0
  const dayOfWeek = nowIST.getDay(); // 0..6
  const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  // Midnight IST of the Monday of this week
  const mondayIST = new Date(nowIST);
  mondayIST.setDate(mondayIST.getDate() - daysFromMonday);
  mondayIST.setHours(0, 0, 0, 0);

  // Convert back to UTC by subtracting IST offset (5h 30m = 330 minutes)
  const IST_OFFSET_MS = 330 * 60 * 1000;
  return new Date(mondayIST.getTime() - IST_OFFSET_MS);
}

/**
 * Returns the UTC Date corresponding to the 1st of the current calendar
 * month at 00:00:00 IST.
 *
 * @returns {Date}
 */
export function getISTMonthStart() {
  const nowIST = new Date(
    new Date().toLocaleString("en-US", { timeZone: TZ })
  );

  const firstIST = new Date(nowIST);
  firstIST.setDate(1);
  firstIST.setHours(0, 0, 0, 0);

  const IST_OFFSET_MS = 330 * 60 * 1000;
  return new Date(firstIST.getTime() - IST_OFFSET_MS);
}

/**
 * Computes the updated streak given the user's lastActiveDate and
 * the current IST date string.
 *
 * Rules:
 *   - No prior activity          → streak = 1
 *   - Same calendar day (IST)    → streak unchanged
 *   - Next calendar day (IST)    → streak + 1
 *   - Any gap larger than 1 day  → streak = 1
 *
 * @param {number} currentStreak  - current dayStreak.value
 * @param {Date|null} lastActiveDate - dayStreak.lastActiveDate from DB
 * @returns {{ newStreak: number, todayIST: string, changed: boolean }}
 */
export function computeStreak(currentStreak, lastActiveDate) {
  const todayIST = toISTDateString(); // "YYYY-MM-DD"

  if (!lastActiveDate) {
    // First-ever activity
    return { newStreak: 1, todayIST, changed: true };
  }

  const lastIST = toISTDateString(new Date(lastActiveDate));

  if (lastIST === todayIST) {
    // Already recorded activity today — no change
    return { newStreak: currentStreak, todayIST, changed: false };
  }

  // How many calendar days ago was lastIST?
  // Compare by constructing UTC midnight equivalents of IST date strings.
  const todayUTC = new Date(todayIST + "T00:00:00Z");
  const lastUTC = new Date(lastIST + "T00:00:00Z");
  const diffDays = Math.round(
    (todayUTC.getTime() - lastUTC.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 1) {
    // Consecutive day
    return { newStreak: currentStreak + 1, todayIST, changed: true };
  }

  // Missed one or more days
  return { newStreak: 1, todayIST, changed: true };
}
