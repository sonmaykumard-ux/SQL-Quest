import React, { useState, useRef, useEffect } from 'react';
import { Flame, CheckCircle2, Clock, ShieldCheck, Zap, Coins, X, ChevronRight, Calendar, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getTodayDateString } from '../../utils/gamification';
import {
  isStreakActiveToday,
  getNextStreakMilestone,
  getRecentWeekDays,
  STREAK_MILESTONES,
} from '../../utils/streakHelper';
import { CURRICULUM_LEVELS } from '../../data/curriculum';

export const DailyStreakTracker: React.FC = () => {
  const { stats, setCurrentTab, setActiveLessonModal } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const todayStr = getTodayDateString();
  const completedToday = isStreakActiveToday(stats.lastActiveDate, todayStr);
  const weekDays = getRecentWeekDays(stats.lastActiveDate, stats.currentStreak, todayStr, stats.activityDates || []);
  const { nextMilestone, progressPercent, daysRemaining } = getNextStreakMilestone(stats.currentStreak);

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Find next incomplete lesson for quick start
  const handleStartLesson = () => {
    setIsOpen(false);
    for (const level of CURRICULUM_LEVELS) {
      for (const lesson of level.lessons) {
        if (!stats.completedLessonIds.includes(lesson.id)) {
          setCurrentTab('learn');
          setActiveLessonModal(lesson);
          return;
        }
      }
    }
    // Fallback if all completed
    setCurrentTab('learn');
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Header Button Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border transition-all text-xs sm:text-sm font-bold shadow-xs select-none ${
          completedToday
            ? 'bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-red-500/15 hover:from-amber-500/25 hover:to-orange-500/25 border-amber-500/40 text-amber-300 shadow-amber-500/10'
            : stats.currentStreak > 0
            ? 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-400'
            : 'bg-slate-800 hover:bg-slate-700/80 border-slate-700 text-slate-400'
        }`}
        title={`Daily Streak: ${stats.currentStreak} consecutive day${stats.currentStreak === 1 ? '' : 's'}. ${
          completedToday ? 'Lesson completed today!' : 'Complete a lesson today to continue your streak!'
        }`}
        aria-label={`Daily Streak Tracker: ${stats.currentStreak} days`}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        <div className="relative flex items-center justify-center">
          <Flame
            className={`w-4 h-4 transition-transform duration-300 ${
              completedToday
                ? 'text-orange-500 fill-orange-500 animate-pulse drop-shadow-[0_0_6px_rgba(249,115,22,0.8)] scale-110'
                : stats.currentStreak > 0
                ? 'text-amber-400 fill-amber-400/80'
                : 'text-slate-500'
            }`}
          />
          {/* Attention indicator dot if not completed today */}
          {!completedToday && (
            <span
              className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-orange-500 border border-slate-900 animate-ping"
              title="Daily lesson pending"
            />
          )}
        </div>

        <span className="tabular-nums font-extrabold tracking-tight">{stats.currentStreak}</span>
        
        <span className="hidden md:inline text-[11px] font-semibold text-amber-400/80">
          {stats.currentStreak === 1 ? 'day streak' : 'day streak'}
        </span>

        {/* Active Streak Freeze Badge */}
        {stats.streakFreezes > 0 && (
          <span
            className="text-[10px] bg-sky-500/25 text-sky-300 px-1 py-0.2 rounded border border-sky-500/30 font-mono flex items-center gap-0.5 ml-0.5"
            title={`${stats.streakFreezes} Streak Freeze protection active`}
          >
            <span>🧊</span>
            <span>{stats.streakFreezes}</span>
          </span>
        )}
      </button>

      {/* Expanded Popover / Modal */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Daily Streak Tracker Details"
          className="absolute right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 top-full mt-2 w-[calc(100vw-1.5rem)] max-w-sm sm:w-96 bg-slate-900/98 backdrop-blur-xl border border-slate-700/90 rounded-2xl p-4 sm:p-5 shadow-2xl z-50 text-slate-100 animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Header row */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
                <Flame className="w-5 h-5 text-orange-400 fill-orange-400" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-white">Daily Streak Tracker</h3>
                <p className="text-[11px] text-slate-400">Complete 1 lesson daily to keep burning</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
              aria-label="Close streak details"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Hero Streak Counter */}
          <div className="my-4 py-3 px-4 rounded-xl bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-red-500/10 border border-amber-500/20 text-center relative overflow-hidden">
            <div className="absolute -top-6 -right-6 w-20 h-20 bg-orange-500/10 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-center gap-2">
              <Flame className="w-7 h-7 text-orange-500 fill-orange-500 animate-bounce" />
              <span className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                {stats.currentStreak}
              </span>
              <span className="text-lg font-bold text-amber-300">
                {stats.currentStreak === 1 ? 'Day' : 'Days'}
              </span>
            </div>
            <p className="text-xs text-amber-200/90 font-medium mt-1">
              Consecutive days completing SQL lessons
            </p>
          </div>

          {/* Status Message Banner */}
          {completedToday ? (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs text-emerald-200 leading-relaxed">
                <span className="font-bold text-emerald-300">Streak Active Today!</span> You completed your daily lesson. Come back tomorrow to keep the flame alive.
              </div>
            </div>
          ) : (
            <div className="mb-4 p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
              <div className="text-xs text-amber-200 leading-relaxed flex-1">
                <span className="font-bold text-amber-300">Daily Lesson Pending:</span> Complete 1 lesson today to keep your streak alive and reach <span className="font-bold text-white">{stats.currentStreak + 1} days</span>!
              </div>
            </div>
          )}

          {/* 7-Day Rolling Calendar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Last 7 Days
              </span>
              <span className="text-[11px] text-slate-400">
                {stats.activityDates && stats.activityDates.length > 0 ? `${stats.activityDates.length} days recorded` : 'Recent activity'}
              </span>
            </div>

            <div className="grid grid-cols-7 gap-1 sm:gap-1.5 text-center">
              {weekDays.map((day) => (
                <div
                  key={day.dateStr}
                  className={`flex flex-col items-center p-1.5 rounded-lg border transition-all ${
                    day.isToday
                      ? day.isCompleted
                        ? 'bg-orange-500/20 border-orange-500/50 text-orange-300 font-bold'
                        : 'bg-amber-500/10 border-amber-500/50 border-dashed text-amber-300 animate-pulse'
                      : day.isCompleted
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-slate-800/60 border-slate-800 text-slate-500'
                  }`}
                  title={`${day.dateStr} • ${day.isCompleted ? 'Completed lesson' : 'No lesson completed'}`}
                >
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    {day.dayLabel}
                  </span>
                  <div className="my-1 flex items-center justify-center h-5">
                    {day.isCompleted ? (
                      <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
                    ) : day.isToday ? (
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                    )}
                  </div>
                  <span className="text-[10px] font-mono">
                    {day.dayNumber}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-2 mb-4 text-center">
            <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Longest</p>
              <p className="text-sm font-bold text-white mt-0.5">{stats.longestStreak} d</p>
            </div>
            <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Total Days</p>
              <p className="text-sm font-bold text-white mt-0.5">{stats.totalDaysLearned} d</p>
            </div>
            <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Freezes</p>
              <p className="text-sm font-bold text-sky-300 mt-0.5 flex items-center justify-center gap-1">
                <span>🧊</span>
                <span>{stats.streakFreezes}</span>
              </p>
            </div>
          </div>

          {/* Next Streak Milestone Card */}
          <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 mb-4">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                <span>{nextMilestone.badge}</span>
                <span>Next: {nextMilestone.title}</span>
              </div>
              <span className="text-[11px] text-amber-400 font-bold">
                {daysRemaining === 0 ? 'Achieved!' : `${daysRemaining} day${daysRemaining === 1 ? '' : 's'} away`}
              </span>
            </div>

            <div className="w-full bg-slate-700/60 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5">
              <span>Target: {nextMilestone.days} Days</span>
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <Sparkles className="w-3 h-3" />
                +{nextMilestone.xpReward} XP & +{nextMilestone.coinReward} Coins
              </span>
            </div>
          </div>

          {/* Action Button */}
          {!completedToday ? (
            <button
              onClick={handleStartLesson}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 transition-all cursor-pointer"
            >
              <Flame className="w-4 h-4 fill-slate-950 text-slate-950" />
              <span>Complete Today's Lesson</span>
              <ChevronRight className="w-4 h-4 ml-auto" />
            </button>
          ) : (
            <button
              onClick={() => {
                setIsOpen(false);
                setCurrentTab('learn');
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Explore More Lessons</span>
              <ChevronRight className="w-4 h-4 ml-auto" />
            </button>
          )}

          {/* Tip */}
          <p className="text-[10px] text-slate-500 text-center mt-2.5">
            Tip: Streak Freezes automatically protect your streak if you miss a day!
          </p>
        </div>
      )}
    </div>
  );
};
