import { UserStats, Achievement } from '../types';

export const XP_REWARDS = {
  LESSON_COMPLETE: 10,
  MCQ_CORRECT: 5,
  SQL_EXERCISE_COMPLETE: 15,
  CHALLENGE_COMPLETE: 25,
  DAILY_MISSION_COMPLETE: 30,
  LEVEL_COMPLETE: 50,
  PROJECT_COMPLETE: 100,
  SEVEN_DAY_STREAK: 100,
};

export const COIN_REWARDS = {
  LESSON_COMPLETE: 5,
  EXERCISE_COMPLETE: 2,
  CHALLENGE_COMPLETE: 10,
  LEVEL_COMPLETE: 20,
  PROJECT_COMPLETE: 50,
  STREAK_MILESTONE: 15,
};

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getYesterdayDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function updateStreak(
  currentStats: Pick<UserStats, 'currentStreak' | 'longestStreak' | 'lastActiveDate' | 'streakFreezes' | 'totalDaysLearned'>,
  todayStr: string = getTodayDateString(),
  yesterdayStr: string = getYesterdayDateString()
): {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  streakFreezes: number;
  totalDaysLearned: number;
  streakPreservedByFreeze: boolean;
  streakIncremented: boolean;
} {
  const { currentStreak, longestStreak, lastActiveDate, streakFreezes, totalDaysLearned } = currentStats;

  // Already logged activity today
  if (lastActiveDate === todayStr) {
    return {
      currentStreak,
      longestStreak,
      lastActiveDate,
      streakFreezes,
      totalDaysLearned,
      streakPreservedByFreeze: false,
      streakIncremented: false,
    };
  }

  // First time ever
  if (!lastActiveDate) {
    return {
      currentStreak: 1,
      longestStreak: Math.max(1, longestStreak),
      lastActiveDate: todayStr,
      streakFreezes,
      totalDaysLearned: 1,
      streakPreservedByFreeze: false,
      streakIncremented: true,
    };
  }

  // Active yesterday -> consecutive streak
  if (lastActiveDate === yesterdayStr) {
    const nextStreak = currentStreak + 1;
    return {
      currentStreak: nextStreak,
      longestStreak: Math.max(nextStreak, longestStreak),
      lastActiveDate: todayStr,
      streakFreezes,
      totalDaysLearned: totalDaysLearned + 1,
      streakPreservedByFreeze: false,
      streakIncremented: true,
    };
  }

  // Missed a day -> Check if freeze available
  if (streakFreezes > 0) {
    // Preserve streak using 1 freeze
    return {
      currentStreak: currentStreak + 1,
      longestStreak: Math.max(currentStreak + 1, longestStreak),
      lastActiveDate: todayStr,
      streakFreezes: streakFreezes - 1,
      totalDaysLearned: totalDaysLearned + 1,
      streakPreservedByFreeze: true,
      streakIncremented: true,
    };
  }

  // Reset streak to 1
  return {
    currentStreak: 1,
    longestStreak,
    lastActiveDate: todayStr,
    streakFreezes,
    totalDaysLearned: totalDaysLearned + 1,
    streakPreservedByFreeze: false,
    streakIncremented: true,
  };
}

export function calculateLeague(xp: number): {
  league: 'Bronze' | 'Silver' | 'Gold' | 'Emerald' | 'Diamond';
  rank: number;
  nextThreshold: number;
} {
  if (xp < 250) {
    return { league: 'Bronze', rank: Math.max(1, 15 - Math.floor(xp / 20)), nextThreshold: 250 };
  } else if (xp < 750) {
    return { league: 'Silver', rank: Math.max(1, 10 - Math.floor((xp - 250) / 50)), nextThreshold: 750 };
  } else if (xp < 1800) {
    return { league: 'Gold', rank: Math.max(1, 7 - Math.floor((xp - 750) / 150)), nextThreshold: 1800 };
  } else if (xp < 3500) {
    return { league: 'Emerald', rank: Math.max(1, 5 - Math.floor((xp - 1800) / 350)), nextThreshold: 3500 };
  } else {
    return { league: 'Diamond', rank: Math.max(1, 3 - Math.floor((xp - 3500) / 1000)), nextThreshold: 10000 };
  }
}

export const ALL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_query',
    title: 'First Query',
    description: 'Executed your first SQL query in SQLQuest.',
    icon: '⚡',
    category: 'queries',
    requiredProgress: 1,
    xpBonus: 20,
    coinsBonus: 10,
  },
  {
    id: 'sql_beginner',
    title: 'SQL Beginner',
    description: 'Completed Level 1: SQL Fundamentals.',
    icon: '🌱',
    category: 'learning',
    requiredProgress: 1,
    xpBonus: 50,
    coinsBonus: 25,
  },
  {
    id: 'join_master',
    title: 'Join Master',
    description: 'Mastered SQL Joins in Level 4.',
    icon: '🔗',
    category: 'learning',
    requiredProgress: 4,
    xpBonus: 75,
    coinsBonus: 35,
  },
  {
    id: 'aggregate_expert',
    title: 'Aggregate Expert',
    description: 'Solved all GROUP BY and aggregation challenges.',
    icon: '📊',
    category: 'learning',
    requiredProgress: 3,
    xpBonus: 75,
    coinsBonus: 35,
  },
  {
    id: 'window_function_wizard',
    title: 'Window Function Wizard',
    description: 'Completed Level 9 Window Functions.',
    icon: '🪄',
    category: 'learning',
    requiredProgress: 9,
    xpBonus: 100,
    coinsBonus: 50,
  },
  {
    id: 'query_detective',
    title: 'Query Detective',
    description: 'Executed over 25 successful queries.',
    icon: '🔍',
    category: 'queries',
    requiredProgress: 25,
    xpBonus: 60,
    coinsBonus: 30,
  },
  {
    id: 'seven_day_streak',
    title: 'Seven-Day Streak',
    description: 'Learned SQL for 7 consecutive days.',
    icon: '🔥',
    category: 'streak',
    requiredProgress: 7,
    xpBonus: 100,
    coinsBonus: 50,
  },
  {
    id: 'thirty_day_streak',
    title: 'Thirty-Day Streak',
    description: 'Maintained a persistent 30-day learning streak.',
    icon: '👑',
    category: 'streak',
    requiredProgress: 30,
    xpBonus: 250,
    coinsBonus: 150,
  },
  {
    id: 'hundred_day_streak',
    title: 'Hundred-Day Streak',
    description: 'Century legend: 100 consecutive days of SQL!',
    icon: '🏆',
    category: 'streak',
    requiredProgress: 100,
    xpBonus: 500,
    coinsBonus: 300,
  },
  {
    id: 'database_architect',
    title: 'Database Architect',
    description: 'Learned DDL, Constraints, and Schema Management in Level 11.',
    icon: '🏛️',
    category: 'learning',
    requiredProgress: 11,
    xpBonus: 100,
    coinsBonus: 50,
  },
  {
    id: 'sql_interview_ready',
    title: 'SQL Interview Ready',
    description: 'Solved advanced case studies and completed mock interview drills.',
    icon: '💼',
    category: 'projects',
    requiredProgress: 3,
    xpBonus: 150,
    coinsBonus: 75,
  },
  {
    id: 'data_analyst_champion',
    title: 'Data Analyst Champion',
    description: 'Completed real-world industry portfolio projects.',
    icon: '🚀',
    category: 'projects',
    requiredProgress: 1,
    xpBonus: 200,
    coinsBonus: 100,
  },
];

export function checkNewAchievements(
  stats: UserStats,
  alreadyUnlockedIds: string[]
): Achievement[] {
  const newAchievements: Achievement[] = [];

  for (const ach of ALL_ACHIEVEMENTS) {
    if (alreadyUnlockedIds.includes(ach.id)) continue;

    let unlocked = false;
    if (ach.id === 'first_query' && stats.queriesExecuted >= 1) unlocked = true;
    if (ach.id === 'query_detective' && stats.queriesExecuted >= 25) unlocked = true;
    if (ach.id === 'seven_day_streak' && stats.currentStreak >= 7) unlocked = true;
    if (ach.id === 'thirty_day_streak' && stats.currentStreak >= 30) unlocked = true;
    if (ach.id === 'hundred_day_streak' && stats.currentStreak >= 100) unlocked = true;
    if (ach.id === 'sql_beginner' && stats.completedLessonIds.some(id => id.startsWith('l1_'))) unlocked = true;
    if (ach.id === 'aggregate_expert' && stats.completedLessonIds.some(id => id.startsWith('l3_'))) unlocked = true;
    if (ach.id === 'join_master' && stats.completedLessonIds.some(id => id.startsWith('l4_'))) unlocked = true;
    if (ach.id === 'window_function_wizard' && stats.completedLessonIds.some(id => id.startsWith('l9_'))) unlocked = true;
    if (ach.id === 'database_architect' && stats.completedLessonIds.some(id => id.startsWith('l11_'))) unlocked = true;
    if (ach.id === 'data_analyst_champion' && stats.completedProjectIds.length >= 1) unlocked = true;
    if (ach.id === 'sql_interview_ready' && stats.completedProjectIds.length >= 2) unlocked = true;

    if (unlocked) {
      newAchievements.push(ach);
    }
  }

  return newAchievements;
}
