import { getTodayDateString } from './gamification';

export interface DayStreakStatus {
  dateStr: string;
  dayLabel: string;
  dayNumber: number;
  isToday: boolean;
  isCompleted: boolean;
  isFuture: boolean;
}

export interface StreakMilestone {
  days: number;
  title: string;
  badge: string;
  xpReward: number;
  coinReward: number;
}

export const STREAK_MILESTONES: StreakMilestone[] = [
  { days: 3, title: 'Flame Apprentice', badge: '🥉', xpReward: 50, coinReward: 10 },
  { days: 7, title: 'Week Warrior', badge: '⚡', xpReward: 100, coinReward: 20 },
  { days: 14, title: 'Fortnight Flame', badge: '🔥', xpReward: 250, coinReward: 40 },
  { days: 30, title: 'SQL Legend', badge: '👑', xpReward: 500, coinReward: 100 },
  { days: 100, title: 'Century Master', badge: '💎', xpReward: 2000, coinReward: 500 },
];

/**
 * Checks whether the user completed a lesson today.
 */
export function isStreakActiveToday(lastActiveDate: string, todayStr: string = getTodayDateString()): boolean {
  if (!lastActiveDate) return false;
  return lastActiveDate === todayStr;
}

/**
 * Returns the next streak milestone and progress towards it.
 */
export function getNextStreakMilestone(currentStreak: number): {
  nextMilestone: StreakMilestone;
  progressPercent: number;
  daysRemaining: number;
} {
  const next = STREAK_MILESTONES.find(m => m.days > currentStreak) || STREAK_MILESTONES[STREAK_MILESTONES.length - 1];
  const prevDays = STREAK_MILESTONES.slice().reverse().find(m => m.days <= currentStreak)?.days || 0;
  
  const span = next.days - prevDays;
  const progressInSpan = currentStreak - prevDays;
  const progressPercent = Math.min(100, Math.max(0, Math.round((progressInSpan / (span || 1)) * 100)));
  const daysRemaining = Math.max(0, next.days - currentStreak);

  return {
    nextMilestone: next,
    progressPercent: currentStreak >= next.days ? 100 : progressPercent,
    daysRemaining,
  };
}

/**
 * Generates the 7-day window ending on today, marking which days have completed lessons.
 */
export function getRecentWeekDays(
  lastActiveDate: string,
  currentStreak: number,
  todayStr: string = getTodayDateString(),
  activityDates: string[] = []
): DayStreakStatus[] {
  const result: DayStreakStatus[] = [];
  const today = new Date(todayStr + 'T12:00:00'); // midday to avoid DST shifts

  const completedSet = new Set<string>(activityDates);

  // If activityDates was not explicitly tracked for historical mock sessions,
  // reconstruct the streak backwards from lastActiveDate
  if (lastActiveDate && currentStreak > 0) {
    const activeDate = new Date(lastActiveDate + 'T12:00:00');
    for (let i = 0; i < currentStreak; i++) {
      const d = new Date(activeDate);
      d.setDate(activeDate.getDate() - i);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      completedSet.add(`${y}-${m}-${day}`);
    }
  }

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Past 6 days + today = 7 days
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${day}`;
    const isToday = dateStr === todayStr;

    result.push({
      dateStr,
      dayLabel: dayNames[d.getDay()],
      dayNumber: d.getDate(),
      isToday,
      isCompleted: completedSet.has(dateStr),
      isFuture: false,
    });
  }

  return result;
}
