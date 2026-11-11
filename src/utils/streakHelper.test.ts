import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isStreakActiveToday,
  getNextStreakMilestone,
  getRecentWeekDays,
  STREAK_MILESTONES,
} from './streakHelper';

test('streakHelper: isStreakActiveToday returns true when lastActiveDate equals today', () => {
  assert.equal(isStreakActiveToday('2026-11-11', '2026-11-11'), true);
  assert.equal(isStreakActiveToday('2026-11-10', '2026-11-11'), false);
  assert.equal(isStreakActiveToday('', '2026-11-11'), false);
});

test('streakHelper: getNextStreakMilestone calculates progress accurately', () => {
  // At 1 day streak, next is 3 days (Flame Apprentice)
  const at1 = getNextStreakMilestone(1);
  assert.equal(at1.nextMilestone.days, 3);
  assert.equal(at1.daysRemaining, 2);
  assert.equal(at1.progressPercent, 33);

  // At 5 days streak, next is 7 days (Week Warrior)
  const at5 = getNextStreakMilestone(5);
  assert.equal(at5.nextMilestone.days, 7);
  assert.equal(at5.daysRemaining, 2);
  assert.equal(at5.progressPercent, 50); // (5-3)/(7-3) = 2/4 = 50%
});

test('streakHelper: getRecentWeekDays generates 7 consecutive days ending today', () => {
  const days = getRecentWeekDays('2026-11-11', 3, '2026-11-11');
  assert.equal(days.length, 7);
  
  // Last element should be today
  const lastDay = days[days.length - 1];
  assert.equal(lastDay.dateStr, '2026-11-11');
  assert.equal(lastDay.isToday, true);
  assert.equal(lastDay.isCompleted, true);

  // 3 consecutive days should be completed: 2026-11-11, 2026-11-10, 2026-11-09
  const completedCount = days.filter(d => d.isCompleted).length;
  assert.equal(completedCount, 3);
});
