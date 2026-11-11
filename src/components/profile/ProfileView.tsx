import React, { useState } from 'react';
import {
  Flame,
  Zap,
  Coins,
  Trophy,
  Award,
  Calendar,
  CheckCircle2,
  Lock,
  ShoppingBag,
  Sparkles,
  RotateCcw,
  Clock,
  Shield,
  Smartphone,
  Check,
  Volume2,
  VolumeX,
  Settings,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Mascot } from '../common/Mascot';
import { ALL_ACHIEVEMENTS } from '../../utils/gamification';
import { SHOP_ITEMS } from '../../data/shopItems';
import { DailyGoalMinutes, ShopItem } from '../../types';

export const ProfileView: React.FC = () => {
  const {
    stats,
    setDailyGoal,
    purchaseShopItem,
    isAndroidFrame,
    setIsAndroidFrame,
    resetProgress,
    showToast,
    soundEnabled,
    toggleSound,
    playPreviewSound,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'stats' | 'achievements' | 'shop' | 'leaderboard' | 'settings'>('stats');

  // Days of week for streak calendar
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const todayDayIdx = (new Date().getDay() + 6) % 7; // Monday = 0

  const goalOptions: { minutes: DailyGoalMinutes; label: string }[] = [
    { minutes: 5, label: 'Casual (5 min)' },
    { minutes: 10, label: 'Regular (10 min)' },
    { minutes: 15, label: 'Serious (15 min)' },
    { minutes: 30, label: 'Intensive (30 min)' },
  ];

  // League Leaderboard simulated participants
  const mockLeaderboard = [
    { rank: 1, name: 'Sonia_SQL', xp: 820, avatar: '👑', isUser: false },
    { rank: 2, name: 'Alex_DataNinja', xp: 640, avatar: '⚡', isUser: false },
    { rank: stats.leagueRank, name: 'You (SQL Analyst)', xp: stats.xp, avatar: '🐲', isUser: true },
    { rank: 4, name: 'Devon_QueryMaster', xp: 480, avatar: '💎', isUser: false },
    { rank: 5, name: 'Hana_Analytics', xp: 390, avatar: '🚀', isUser: false },
    { rank: 6, name: 'Ravi_Postgres', xp: 310, avatar: '📊', isUser: false },
  ].sort((a, b) => b.xp - a.xp).map((item, index) => ({ ...item, rank: index + 1 }));

  const hasVisor = stats.inventory.includes('avatar_dragon_visor');
  const hasCrown = stats.inventory.includes('avatar_crown');

  return (
    <div className="space-y-6 pb-20">
      {/* Profile Header Banner */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center p-2">
              <Mascot
                mood="happy"
                size="md"
                hasVisor={hasVisor}
                hasCrown={hasCrown}
              />
            </div>
            <span className="absolute -bottom-1 -right-1 text-xs px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black">
              {stats.league}
            </span>
          </div>

          <div className="text-center sm:text-left space-y-1 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h2 className="text-xl font-bold text-slate-100">SQL Explorer</h2>
              {stats.inventory.includes('title_sql_wizard') && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  🧙‍♂️ Database Sorcerer
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              Joined SQLQuest • {stats.league} League (Rank #{stats.leagueRank})
            </p>

            {/* Quick Stats Badges */}
            <div className="flex items-center justify-center sm:justify-start gap-3 pt-2">
              <div className="flex items-center gap-1 text-amber-400 font-bold text-xs">
                <Flame className="w-4 h-4 fill-amber-500" />
                <span>{stats.currentStreak} Day Streak</span>
              </div>
              <div className="flex items-center gap-1 text-violet-400 font-bold text-xs">
                <Zap className="w-4 h-4 fill-violet-400" />
                <span>{stats.xp} Total XP</span>
              </div>
              <div className="flex items-center gap-1 text-yellow-400 font-bold text-xs">
                <Coins className="w-4 h-4" />
                <span>{stats.coins} Coins</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-800 pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('stats')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
            activeTab === 'stats'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Stats & Streaks</span>
        </button>

        <button
          onClick={() => setActiveTab('achievements')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
            activeTab === 'achievements'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Badges ({stats.unlockedAchievementIds.length}/{ALL_ACHIEVEMENTS.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('shop')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
            activeTab === 'shop'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-yellow-400" />
          <span>Rewards Shop</span>
        </button>

        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
            activeTab === 'leaderboard'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Leagues</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
            activeTab === 'settings'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Settings className="w-4 h-4 text-slate-400" />
          <span>Settings</span>
        </button>
      </div>

      {/* STATS & STREAK TAB */}
      {activeTab === 'stats' && (
        <div className="space-y-5">
          {/* Streak Calendar Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
                  Daily Streak Calendar
                </h3>
                <p className="text-xs text-slate-400">
                  Learn at least 1 lesson or solve 1 challenge daily to keep your flame blazing!
                </p>
              </div>

              <div className="text-right">
                <span className="text-2xl font-black text-amber-400">{stats.currentStreak}</span>
                <span className="text-[10px] text-slate-400 block font-medium">Days In A Row</span>
              </div>
            </div>

            {/* Weekly Activity Row */}
            <div className="grid grid-cols-7 gap-2 pt-2">
              {daysOfWeek.map((day, idx) => {
                const isPastOrToday = idx <= todayDayIdx;
                const isToday = idx === todayDayIdx;

                return (
                  <div
                    key={day}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border text-center transition-all ${
                      isPastOrToday
                        ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                        : 'bg-slate-800/40 border-slate-800 text-slate-500'
                    } ${isToday ? 'ring-2 ring-amber-400' : ''}`}
                  >
                    <span className="text-[10px] font-bold uppercase">{day}</span>
                    <div className="my-1">
                      {isPastOrToday ? (
                        <Flame className="w-5 h-5 text-amber-400 fill-amber-400" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-slate-700 block my-1.5" />
                      )}
                    </div>
                    <span className="text-[9px] font-medium opacity-80">
                      {isToday ? 'Today' : isPastOrToday ? 'Done' : 'Pending'}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Streak Freeze & Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-xs text-slate-400 block">Longest Streak</span>
                <span className="text-lg font-bold text-slate-100">{stats.longestStreak} days</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-xs text-slate-400 block">Total Active Days</span>
                <span className="text-lg font-bold text-slate-100">{stats.totalDaysLearned} days</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-xs text-slate-400 block">Streak Freeze Shields</span>
                <span className="text-lg font-bold text-sky-400">🧊 {stats.streakFreezes} ready</span>
              </div>
            </div>
          </div>

          {/* Daily Learning Goal Selector */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                Select Daily Learning Goal
              </h3>
              <p className="text-xs text-slate-400">
                Pacing yourself with steady daily practice yields the highest retention rate.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {goalOptions.map(opt => {
                const isSelected = stats.dailyGoalMinutes === opt.minutes;
                return (
                  <button
                    key={opt.minutes}
                    onClick={() => setDailyGoal(opt.minutes)}
                    className={`p-3 rounded-2xl border text-xs font-bold transition-all text-center ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cumulative Learning Analytics */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
            <h3 className="text-base font-bold text-slate-100">Cumulative Learning Activity</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[11px] text-slate-400">Lessons Completed</span>
                <p className="text-xl font-bold text-emerald-400 mt-1">
                  {stats.completedLessonIds.length}
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[11px] text-slate-400">Queries Executed</span>
                <p className="text-xl font-bold text-cyan-400 mt-1">
                  {stats.queriesExecuted}
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[11px] text-slate-400">Challenges Solved</span>
                <p className="text-xl font-bold text-amber-400 mt-1">
                  {stats.solvedChallengeIds.length}
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[11px] text-slate-400">Projects Mastered</span>
                <p className="text-xl font-bold text-violet-400 mt-1">
                  {stats.completedProjectIds.length}
                </p>
              </div>
            </div>
          </div>

          {/* Sound Effects & Audio Feedback */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center border transition-colors ${
                    soundEnabled
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                      : 'bg-slate-800/80 border-slate-700 text-slate-500'
                  }`}
                >
                  {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-100">Sound Effects</h3>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        soundEnabled
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {soundEnabled ? 'Enabled' : 'Muted'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Plays a subtle 'ding' when completing lessons or unlocking achievements.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={playPreviewSound}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Play a preview ding"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Test Ding</span>
                </button>

                <button
                  type="button"
                  role="switch"
                  aria-checked={soundEnabled}
                  aria-label="Toggle sound effects"
                  onClick={toggleSound}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
                    soundEnabled ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 mt-0.5 ${
                      soundEnabled ? 'translate-x-6.5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Reset progress */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Need to start fresh from scratch?</span>
            <button
              onClick={() => {
                if (window.confirm('Reset all SQLQuest progress? (XP, streaks, and lessons will be reset)')) {
                  resetProgress();
                }
              }}
              className="text-rose-400 hover:text-rose-300 font-semibold underline"
            >
              Reset All Progress
            </button>
          </div>
        </div>
      )}

      {/* ACHIEVEMENTS TAB */}
      {activeTab === 'achievements' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-100">SQL Badges & Milestones</h3>
            <p className="text-xs text-slate-400">
              Unlock badges by maintaining streaks, running queries, and mastering advanced SQL concepts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ALL_ACHIEVEMENTS.map(ach => {
              const isUnlocked = stats.unlockedAchievementIds.includes(ach.id);

              return (
                <div
                  key={ach.id}
                  className={`p-4 rounded-2xl border flex items-start gap-3 transition-all ${
                    isUnlocked
                      ? 'bg-slate-900 border-amber-500/40 shadow-sm'
                      : 'bg-slate-900/60 border-slate-800 opacity-60'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${
                      isUnlocked ? 'bg-amber-500/20 border border-amber-500/40' : 'bg-slate-800 text-slate-600'
                    }`}
                  >
                    {isUnlocked ? ach.icon : <Lock className="w-5 h-5 text-slate-500" />}
                  </div>

                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-100">{ach.title}</h4>
                      {isUnlocked && (
                        <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" /> Unlocked
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">{ach.description}</p>
                    <div className="flex items-center gap-2 pt-1 text-[11px] font-semibold text-slate-300">
                      <span className="text-violet-400">+{ach.xpBonus} XP</span>
                      <span>•</span>
                      <span className="text-yellow-400">+{ach.coinsBonus} Coins</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* REWARDS SHOP TAB */}
      {activeTab === 'shop' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-2xl">
            <div>
              <h3 className="text-base font-bold text-yellow-300 flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-yellow-400" />
                SQL Coins Rewards Shop
              </h3>
              <p className="text-xs text-slate-300">
                100% Free! Coins are earned purely through learning. No real money or payments ever.
              </p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 font-black text-sm">
              <Coins className="w-4 h-4" />
              <span>{stats.coins} Available</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {SHOP_ITEMS.map(item => {
              const isOwned = stats.inventory.includes(item.id);
              const canAfford = stats.coins >= item.costCoins;

              return (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl p-2 rounded-xl bg-slate-800 inline-block">{item.icon}</span>
                      <span className="text-xs font-bold text-yellow-400 flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5" /> {item.costCoins}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-100">{item.name}</h4>
                    <p className="text-xs text-slate-400">{item.description}</p>
                  </div>

                  <div>
                    {item.type !== 'streak_freeze' && isOwned ? (
                      <span className="w-full py-2 rounded-xl bg-slate-800 text-emerald-400 text-xs font-bold flex items-center justify-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Equipped
                      </span>
                    ) : (
                      <button
                        onClick={() => purchaseShopItem(item)}
                        disabled={!canAfford}
                        className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                          canAfford
                            ? 'bg-yellow-500 hover:bg-yellow-400 text-slate-950 shadow-md'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        {item.type === 'streak_freeze' ? 'Buy Shield (+1)' : 'Unlock with Coins'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* LEADERBOARD TAB */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-100">{stats.league} League Leaderboard</h3>
              <p className="text-xs text-slate-400">
                Top 3 learners advance to the next league division each Sunday!
              </p>
            </div>
            <span className="text-xs font-black px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {stats.league} Division
            </span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl divide-y divide-slate-800 overflow-hidden shadow-lg">
            {mockLeaderboard.map(competitor => (
              <div
                key={competitor.rank}
                className={`p-4 flex items-center justify-between gap-3 ${
                  competitor.isUser ? 'bg-emerald-500/10 font-bold' : 'hover:bg-slate-800/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                      competitor.rank === 1
                        ? 'bg-amber-500 text-slate-950'
                        : competitor.rank === 2
                        ? 'bg-slate-300 text-slate-950'
                        : competitor.rank === 3
                        ? 'bg-amber-700 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {competitor.rank}
                  </span>
                  <span className="text-xl">{competitor.avatar}</span>
                  <div>
                    <span className="text-sm text-slate-100 block">{competitor.name}</span>
                    {competitor.isUser && (
                      <span className="text-[10px] text-emerald-400 font-semibold">Your current standing</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 text-sm font-mono font-bold text-violet-300">
                  <Zap className="w-3.5 h-3.5 text-violet-400 fill-violet-400" />
                  <span>{competitor.xp} XP</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* APP SETTINGS TAB */}
      {activeTab === 'settings' && (
        <div className="space-y-5">
          {/* Sound & Audio Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-colors ${
                    soundEnabled
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                      : 'bg-slate-800/80 border-slate-700 text-slate-500'
                  }`}
                >
                  {soundEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-100">Sound Effects</h3>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        soundEnabled
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {soundEnabled ? 'Enabled' : 'Muted'}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                    Plays a subtle 'ding' when completing a lesson or unlocking an achievement badge.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                <button
                  onClick={playPreviewSound}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Test sound effect"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Test Ding</span>
                </button>

                <button
                  type="button"
                  role="switch"
                  aria-checked={soundEnabled}
                  aria-label="Toggle sound effects"
                  onClick={toggleSound}
                  className={`w-14 h-7 rounded-full transition-colors relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
                    soundEnabled ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`block w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-200 mt-0.5 ${
                      soundEnabled ? 'translate-x-7.5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span>🎵</span>
                <span>Synthesized via Web Audio API (Offline, Zero Lag)</span>
              </span>
              <span className="text-emerald-400 font-medium">100% Client-Side</span>
            </div>
          </div>

          {/* Daily Goal Settings */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                Daily Learning Target
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Set how many minutes you want to dedicate to SQL practice every day.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {goalOptions.map(opt => {
                const isSelected = stats.dailyGoalMinutes === opt.minutes;
                return (
                  <button
                    key={opt.minutes}
                    onClick={() => setDailyGoal(opt.minutes)}
                    className={`p-3 rounded-2xl border text-xs font-bold transition-all text-center cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Device Mockup Toggle */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
                <Smartphone className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-100">Android Device Preview Frame</h3>
                <p className="text-xs text-slate-400">Preview SQLQuest inside an authentic Android phone mockup.</p>
              </div>
            </div>
            <button
              onClick={() => setIsAndroidFrame(!isAndroidFrame)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                isAndroidFrame
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
              }`}
            >
              {isAndroidFrame ? 'Active' : 'Disabled'}
            </button>
          </div>

          {/* Reset Progress Section */}
          <div className="p-5 rounded-3xl bg-rose-950/20 border border-rose-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-bold text-rose-300">Reset Learning Progress</h4>
              <p className="text-xs text-rose-400/80">
                Permanently resets all completed lessons, XP, coins, and streak data to brand new.
              </p>
            </div>
            <button
              onClick={() => {
                if (window.confirm('Reset all SQLQuest progress? (XP, streaks, and lessons will be reset)')) {
                  resetProgress();
                }
              }}
              className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto"
            >
              Reset All Progress
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
