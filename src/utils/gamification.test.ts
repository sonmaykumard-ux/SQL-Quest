import test from 'node:test';
import assert from 'node:assert/strict';
import { updateStreak, calculateLeague, checkNewAchievements, XP_REWARDS } from './gamification';
import { UserStats } from '../types';

test('gamification: first time learning initializes streak to 1', () => {
  const initial = {
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: '',
    streakFreezes: 0,
    totalDaysLearned: 0,
  };

  const res = updateStreak(initial, '2026-11-11', '2026-11-10');
  assert.equal(res.currentStreak, 1);
  assert.equal(res.longestStreak, 1);
  assert.equal(res.totalDaysLearned, 1);
  assert.equal(res.streakIncremented, true);
});

test('gamification: consecutive day increments streak and updates longest', () => {
  const current = {
    currentStreak: 4,
    longestStreak: 4,
    lastActiveDate: '2026-11-10',
    streakFreezes: 0,
    totalDaysLearned: 4,
  };

  const res = updateStreak(current, '2026-11-11', '2026-11-10');
  assert.equal(res.currentStreak, 5);
  assert.equal(res.longestStreak, 5);
  assert.equal(res.totalDaysLearned, 5);
});

test('gamification: activity on same day does not duplicate streak increment', () => {
  const current = {
    currentStreak: 5,
    longestStreak: 5,
    lastActiveDate: '2026-11-11',
    streakFreezes: 1,
    totalDaysLearned: 5,
  };

  const res = updateStreak(current, '2026-11-11', '2026-11-10');
  assert.equal(res.currentStreak, 5);
  assert.equal(res.streakIncremented, false);
});

test('gamification: missed day consumes streak freeze if available', () => {
  const current = {
    currentStreak: 12,
    longestStreak: 12,
    lastActiveDate: '2026-11-08', // two days ago
    streakFreezes: 2,
    totalDaysLearned: 12,
  };

  const res = updateStreak(current, '2026-11-11', '2026-11-10');
  assert.equal(res.currentStreak, 13);
  assert.equal(res.streakFreezes, 1);
  assert.equal(res.streakPreservedByFreeze, true);
});

test('gamification: missed day with 0 freezes resets streak to 1', () => {
  const current = {
    currentStreak: 12,
    longestStreak: 12,
    lastActiveDate: '2026-11-08',
    streakFreezes: 0,
    totalDaysLearned: 12,
  };

  const res = updateStreak(current, '2026-11-11', '2026-11-10');
  assert.equal(res.currentStreak, 1);
  assert.equal(res.longestStreak, 12);
});

test('gamification: calculateLeague thresholds', () => {
  assert.equal(calculateLeague(100).league, 'Bronze');
  assert.equal(calculateLeague(500).league, 'Silver');
  assert.equal(calculateLeague(1200).league, 'Gold');
  assert.equal(calculateLeague(2500).league, 'Emerald');
  assert.equal(calculateLeague(4000).league, 'Diamond');
});

test('gamification: checkNewAchievements unlocks first_query and query_detective', () => {
  const mockStats: UserStats = {
    xp: 50,
    coins: 20,
    currentStreak: 1,
    longestStreak: 1,
    lastActiveDate: '2026-11-11',
    totalDaysLearned: 1,
    queriesExecuted: 25,
    dailyGoalMinutes: 10,
    streakFreezes: 0,
    league: 'Bronze',
    leagueRank: 10,
    completedLessonIds: [],
    completedProjectIds: [],
    solvedChallengeIds: [],
    unlockedAchievementIds: [],
    inventory: [],
    activeTheme: 'default',
    activeAvatar: 'default',
  };

  const unlocked = checkNewAchievements(mockStats, []);
  const ids = unlocked.map(a => a.id);
  assert.ok(ids.includes('first_query'));
  assert.ok(ids.includes('query_detective'));
});
