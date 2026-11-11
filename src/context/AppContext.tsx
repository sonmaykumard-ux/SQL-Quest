import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import { UserStats, TabType, DailyGoalMinutes, Lesson, ShopItem, Achievement } from '../types';
import { updateStreak, calculateLeague, checkNewAchievements, XP_REWARDS, COIN_REWARDS } from '../utils/gamification';
import { soundEffects } from '../services/soundEffects';

interface AppContextType {
  stats: UserStats;
  currentTab: TabType;
  setCurrentTab: (tab: TabType) => void;
  isAndroidFrame: boolean;
  setIsAndroidFrame: (val: boolean) => void;
  activeLessonModal: Lesson | null;
  setActiveLessonModal: (lesson: Lesson | null) => void;
  queryHistory: string[];
  savedQueries: { id: string; name: string; query: string; datasetId: string }[];
  saveQuery: (name: string, query: string, datasetId: string) => void;
  deleteSavedQuery: (id: string) => void;
  addXp: (amount: number, reason?: string) => void;
  addCoins: (amount: number) => void;
  completeLesson: (lessonId: string, xpReward?: number, coinReward?: number) => void;
  completeProject: (projectId: string) => void;
  completeChallenge: (challengeId: string) => void;
  recordQueryExecuted: (query: string) => void;
  purchaseShopItem: (item: ShopItem) => boolean;
  setDailyGoal: (minutes: DailyGoalMinutes) => void;
  setActiveTheme: (theme: string) => void;
  setActiveAvatar: (avatar: string) => void;
  useStreakFreeze: () => boolean;
  soundEnabled: boolean;
  toggleSound: () => void;
  setSoundEnabled: (val: boolean) => void;
  playPreviewSound: () => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  newAchievementUnlocked: Achievement | null;
  dismissAchievement: () => void;
  resetProgress: () => void;
}

const STORAGE_KEY = 'sqlquest_user_stats_v1';
const HISTORY_KEY = 'sqlquest_query_history_v1';
const SAVED_QUERIES_KEY = 'sqlquest_saved_queries_v1';
const SOUND_STORAGE_KEY = 'sqlquest_sound_enabled_v1';

const DEFAULT_STATS: UserStats = {
  xp: 0,
  coins: 15, // welcome starter coins
  currentStreak: 1,
  longestStreak: 1,
  lastActiveDate: '',
  totalDaysLearned: 1,
  queriesExecuted: 0,
  dailyGoalMinutes: 10,
  streakFreezes: 1, // starter free freeze
  league: 'Bronze',
  leagueRank: 15,
  completedLessonIds: [],
  completedProjectIds: [],
  solvedChallengeIds: [],
  unlockedAchievementIds: [],
  inventory: ['theme_default', 'avatar_default'],
  activeTheme: 'theme_default',
  activeAvatar: 'avatar_default',
  activityDates: [],
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_STATS, ...JSON.parse(saved) };
      }
    } catch {
      // fallback
    }
    return DEFAULT_STATS;
  });

  const [currentTab, setCurrentTab] = useState<TabType>('learn');
  const [isAndroidFrame, setIsAndroidFrame] = useState<boolean>(false);
  const [activeLessonModal, setActiveLessonModal] = useState<Lesson | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [newAchievementUnlocked, setNewAchievementUnlocked] = useState<Achievement | null>(null);

  const [queryHistory, setQueryHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [savedQueries, setSavedQueries] = useState<{ id: string; name: string; query: string; datasetId: string }[]>(() => {
    try {
      const saved = localStorage.getItem(SAVED_QUERIES_KEY);
      return saved
        ? JSON.parse(saved)
        : [
            {
              id: 'sq_1',
              name: 'Top 5 Customers by Revenue',
              query: 'SELECT c.first_name, SUM(o.total_amount) AS spent\nFROM customers c\nJOIN orders o ON c.customer_id = o.customer_id\nGROUP BY c.customer_id\nORDER BY spent DESC\nLIMIT 5;',
              datasetId: 'ecommerce',
            },
            {
              id: 'sq_2',
              name: 'Average Salary by Department',
              query: 'SELECT d.department_name, ROUND(AVG(e.salary), 2) AS avg_salary\nFROM employees e\nJOIN departments d ON e.department_id = d.department_id\nGROUP BY d.department_name\nORDER BY avg_salary DESC;',
              datasetId: 'hr',
            },
          ];
    } catch {
      return [];
    }
  });

  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(SOUND_STORAGE_KEY);
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const setSoundEnabled = (val: boolean) => {
    setSoundEnabledState(val);
    try {
      localStorage.setItem(SOUND_STORAGE_KEY, JSON.stringify(val));
    } catch {}
    if (val) {
      soundEffects.playDing(true);
      showToast('🔊 Sound effects enabled');
    } else {
      showToast('🔇 Sound effects muted');
    }
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  const playPreviewSound = () => {
    soundEffects.playDing(true);
  };

  // Save stats to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    } catch {
      // localStorage error handling
    }
  }, [stats]);

  // Check daily streak on mount
  useEffect(() => {
    setStats(prev => {
      const streakResult = updateStreak(prev);
      const leagueInfo = calculateLeague(prev.xp);
      return {
        ...prev,
        currentStreak: streakResult.currentStreak,
        longestStreak: streakResult.longestStreak,
        lastActiveDate: streakResult.lastActiveDate,
        streakFreezes: streakResult.streakFreezes,
        totalDaysLearned: streakResult.totalDaysLearned,
        league: leagueInfo.league,
        leagueRank: leagueInfo.rank,
      };
    });
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 3500);
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#10B981', '#3B82F6', '#F59E0B', '#EC4899', '#8B5CF6'],
      });
    } catch {
      // non-fatal
    }
  };

  const evaluateAchievements = (updatedStats: UserStats) => {
    const newlyUnlocked = checkNewAchievements(updatedStats, updatedStats.unlockedAchievementIds);
    if (newlyUnlocked.length > 0) {
      const first = newlyUnlocked[0];
      setNewAchievementUnlocked(first);
      triggerConfetti();
      soundEffects.playAchievementChime(soundEnabled);
      setStats(current => ({
        ...current,
        xp: current.xp + first.xpBonus,
        coins: current.coins + first.coinsBonus,
        unlockedAchievementIds: [...current.unlockedAchievementIds, ...newlyUnlocked.map(a => a.id)],
      }));
    }
  };

  const addXp = (amount: number, reason?: string) => {
    setStats(prev => {
      const nextXp = prev.xp + amount;
      const leagueInfo = calculateLeague(nextXp);
      const updated = {
        ...prev,
        xp: nextXp,
        league: leagueInfo.league,
        leagueRank: leagueInfo.rank,
      };
      evaluateAchievements(updated);
      return updated;
    });

    if (reason) {
      showToast(`+${amount} XP: ${reason}!`);
    }
  };

  const addCoins = (amount: number) => {
    setStats(prev => ({ ...prev, coins: prev.coins + amount }));
  };

  const completeLesson = (
    lessonId: string,
    xpReward = XP_REWARDS.LESSON_COMPLETE,
    coinReward = COIN_REWARDS.LESSON_COMPLETE
  ) => {
    setStats(prev => {
      const isFirstTime = !prev.completedLessonIds.includes(lessonId);
      const earnedXp = isFirstTime ? xpReward : Math.floor(xpReward / 2);
      const earnedCoins = isFirstTime ? coinReward : 1;
      const nextCompleted = isFirstTime ? [...prev.completedLessonIds, lessonId] : prev.completedLessonIds;

      const streakResult = updateStreak(prev);
      const leagueInfo = calculateLeague(prev.xp + earnedXp);
      const todayStr = streakResult.lastActiveDate;
      const prevDates = prev.activityDates || [];
      const nextActivityDates = todayStr && !prevDates.includes(todayStr) ? [...prevDates, todayStr] : prevDates;

      const updated: UserStats = {
        ...prev,
        xp: prev.xp + earnedXp,
        coins: prev.coins + earnedCoins,
        completedLessonIds: nextCompleted,
        currentStreak: streakResult.currentStreak,
        longestStreak: streakResult.longestStreak,
        lastActiveDate: streakResult.lastActiveDate,
        totalDaysLearned: streakResult.totalDaysLearned,
        league: leagueInfo.league,
        leagueRank: leagueInfo.rank,
        activityDates: nextActivityDates,
      };

      triggerConfetti();
      soundEffects.playDing(soundEnabled);
      showToast(`🎉 Lesson Completed! +${earnedXp} XP & +${earnedCoins} SQL Coins`);
      evaluateAchievements(updated);
      return updated;
    });
  };

  const completeProject = (projectId: string) => {
    setStats(prev => {
      if (prev.completedProjectIds.includes(projectId)) return prev;
      const updated = {
        ...prev,
        xp: prev.xp + XP_REWARDS.PROJECT_COMPLETE,
        coins: prev.coins + COIN_REWARDS.PROJECT_COMPLETE,
        completedProjectIds: [...prev.completedProjectIds, projectId],
      };
      triggerConfetti();
      showToast(`🏆 Project Mastered! +${XP_REWARDS.PROJECT_COMPLETE} XP & +${COIN_REWARDS.PROJECT_COMPLETE} Coins`);
      evaluateAchievements(updated);
      return updated;
    });
  };

  const completeChallenge = (challengeId: string) => {
    setStats(prev => {
      if (prev.solvedChallengeIds.includes(challengeId)) return prev;
      const updated = {
        ...prev,
        xp: prev.xp + XP_REWARDS.CHALLENGE_COMPLETE,
        coins: prev.coins + COIN_REWARDS.CHALLENGE_COMPLETE,
        solvedChallengeIds: [...prev.solvedChallengeIds, challengeId],
      };
      triggerConfetti();
      showToast(`🎯 Challenge Solved! +${XP_REWARDS.CHALLENGE_COMPLETE} XP`);
      evaluateAchievements(updated);
      return updated;
    });
  };

  const recordQueryExecuted = (query: string) => {
    const trimmed = query.trim();
    if (trimmed) {
      setQueryHistory(prev => {
        const next = [trimmed, ...prev.filter(q => q !== trimmed)].slice(0, 50);
        try {
          localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });
    }

    setStats(prev => {
      const updated = {
        ...prev,
        queriesExecuted: prev.queriesExecuted + 1,
      };
      evaluateAchievements(updated);
      return updated;
    });
  };

  const saveQuery = (name: string, query: string, datasetId: string) => {
    const newSaved = {
      id: `sq_${Date.now()}`,
      name: name.trim() || 'Untitled Query',
      query: query.trim(),
      datasetId,
    };
    setSavedQueries(prev => {
      const next = [newSaved, ...prev];
      try {
        localStorage.setItem(SAVED_QUERIES_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
    showToast(`Saved query: "${newSaved.name}"`);
  };

  const deleteSavedQuery = (id: string) => {
    setSavedQueries(prev => {
      const next = prev.filter(q => q.id !== id);
      try {
        localStorage.setItem(SAVED_QUERIES_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const purchaseShopItem = (item: ShopItem): boolean => {
    if (stats.coins < item.costCoins) {
      showToast(`Need ${item.costCoins - stats.coins} more coins! Earn more by solving SQL exercises.`);
      return false;
    }

    setStats(prev => {
      if (item.type === 'streak_freeze') {
        return {
          ...prev,
          coins: prev.coins - item.costCoins,
          streakFreezes: prev.streakFreezes + 1,
        };
      }

      return {
        ...prev,
        coins: prev.coins - item.costCoins,
        inventory: [...prev.inventory, item.id],
        activeTheme: item.type === 'theme' ? item.id : prev.activeTheme,
        activeAvatar: item.type === 'avatar' ? item.id : prev.activeAvatar,
      };
    });

    triggerConfetti();
    showToast(`Unlocked ${item.name}!`);
    return true;
  };

  const setDailyGoal = (minutes: DailyGoalMinutes) => {
    setStats(prev => ({ ...prev, dailyGoalMinutes: minutes }));
    showToast(`Daily Goal set to ${minutes} mins/day.`);
  };

  const setActiveTheme = (theme: string) => {
    setStats(prev => ({ ...prev, activeTheme: theme }));
  };

  const setActiveAvatar = (avatar: string) => {
    setStats(prev => ({ ...prev, activeAvatar: avatar }));
  };

  const useStreakFreeze = () => {
    if (stats.streakFreezes <= 0) return false;
    setStats(prev => ({ ...prev, streakFreezes: prev.streakFreezes - 1 }));
    showToast('Streak Freeze activated! Your streak is protected.');
    return true;
  };

  const dismissAchievement = () => {
    setNewAchievementUnlocked(null);
  };

  const resetProgress = () => {
    setStats(DEFAULT_STATS);
    setQueryHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(HISTORY_KEY);
    } catch {
      // ignore
    }
    showToast('Progress reset successfully.');
  };

  return (
    <AppContext.Provider
      value={{
        stats,
        currentTab,
        setCurrentTab,
        isAndroidFrame,
        setIsAndroidFrame,
        activeLessonModal,
        setActiveLessonModal,
        queryHistory,
        savedQueries,
        saveQuery,
        deleteSavedQuery,
        addXp,
        addCoins,
        completeLesson,
        completeProject,
        completeChallenge,
        recordQueryExecuted,
        purchaseShopItem,
        setDailyGoal,
        setActiveTheme,
        setActiveAvatar,
        useStreakFreeze,
        soundEnabled,
        toggleSound,
        setSoundEnabled,
        playPreviewSound,
        toastMessage,
        showToast,
        newAchievementUnlocked,
        dismissAchievement,
        resetProgress,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
