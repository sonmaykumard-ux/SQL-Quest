import test from 'node:test';
import assert from 'node:assert/strict';
import { buildLeagueLeaderboard, getLeaguePromotionZone } from './leaderboardHelper';
import { UserStats } from '../types';

test('leaderboardHelper: ranks users in descending order of XP and includes current user', () => {
  const mockStats: UserStats = {
    xp: 500,
    coins: 10,
    currentStreak: 3,
    longestStreak: 3,
    lastActiveDate: '2026-11-11',
    totalDaysLearned: 3,
    queriesExecuted: 5,
    dailyGoalMinutes: 10,
    streakFreezes: 0,
    league: 'Bronze',
    leagueRank: 1,
    completedLessonIds: [],
    completedProjectIds: [],
    solvedChallengeIds: [],
    unlockedAchievementIds: [],
    inventory: [],
    activeTheme: 'default',
    activeAvatar: 'default',
  };

  const board = buildLeagueLeaderboard(mockStats, 'Bronze');
  assert.ok(board.length > 5);

  // Since user has 500 XP and max bronze peer has 220 XP, user must be rank 1!
  assert.equal(board[0].isCurrentUser, true);
  assert.equal(board[0].rank, 1);
  assert.equal(board[0].xp, 500);

  // Check monotonic descending order
  for (let i = 0; i < board.length - 1; i++) {
    assert.ok(board[i].xp >= board[i + 1].xp);
    assert.equal(board[i].rank, i + 1);
  }
});

test('leaderboardHelper: promotion and demotion zones', () => {
  assert.equal(getLeaguePromotionZone(1, 10), 'promotion');
  assert.equal(getLeaguePromotionZone(2, 10), 'promotion');
  assert.equal(getLeaguePromotionZone(3, 10), 'promotion');
  assert.equal(getLeaguePromotionZone(5, 10), 'safe');
  assert.equal(getLeaguePromotionZone(9, 10), 'demotion');
  assert.equal(getLeaguePromotionZone(10, 10), 'demotion');
});
