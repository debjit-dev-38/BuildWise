// utils/updateDayStreak.js
import { User } from "../models/user.model.js";

export const updateDayStreak = async (userId) => {
  const user = await User.findById(userId);

  if (!user) return null;

  const now = new Date();

  // Make "today" a date-only value
  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const lastActiveDate = user.userStats.lastActiveDate;

  // First learning activity
  if (!lastActiveDate) {
    user.userStats.dayStreak.value = 1;
    user.userStats.lastActiveDate = today;

    await user.save();
    return user.userStats.dayStreak.value;
  }

  const lastDay = new Date(lastActiveDate);
  lastDay.setHours(0, 0, 0, 0);

  const diffDays = Math.floor(
    (today - lastDay) / (1000 * 60 * 60 * 24)
  );

  // Already did a valid action today
  if (diffDays === 0) {
    return user.userStats.dayStreak.value;
  }

  // Was active yesterday
  if (diffDays === 1) {
    user.userStats.dayStreak.value += 1;
  } else {
    // Missed at least one full day
    user.userStats.dayStreak.value = 1;
  }

  user.userStats.lastActiveDate = today;

  await user.save();

  return user.userStats.dayStreak.value;
};