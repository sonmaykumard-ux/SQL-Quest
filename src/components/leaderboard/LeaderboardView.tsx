import React, { useState } from 'react';
import {
  Trophy,
  Flame,
  Zap,
  Clock,
  ArrowUp,
  ArrowDown,
  Minus,
  Heart,
  Sparkles,
  Info,
  ShieldAlert,
  Award,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Mascot } from '../common/Mascot';
import { buildLeagueLeaderboard, getLeaguePromotionZone } from '../../utils/leaderboardHelper';
import { LeaderboardEntry } from '../../types';

type LeagueType = 'Bronze' | 'Silver' | 'Gold' | 'Emerald' | 'Diamond';

const LEAGUES_INFO: { id: LeagueType; name: string; icon: string; color: string; border: string }[] = [
  { id: 'Bronze', name: 'Bronze League', icon: '🥉', color: 'from-amber-900/40 to-slate-900', border: 'border-amber-700/50' },
  { id: 'Silver', name: 'Silver League', icon: '🥈', color: 'from-slate-500/30 to-slate-900', border: 'border-slate-400/50' },
  { id: 'Gold', name: 'Gold League', icon: '🥇', color: 'from-yellow-500/20 to-slate-900', border: 'border-yellow-500/50' },
  { id: 'Emerald', name: 'Emerald League', icon: '🌲', color: 'from-emerald-500/20 to-slate-900', border: 'border-emerald-500/50' },
  { id: 'Diamond', name: 'Diamond League', icon: '💎', color: 'from-cyan-500/20 to-slate-900', border: 'border-cyan-500/50' },
];

export const LeaderboardView: React.FC = () => {
  const { stats, showToast, setCurrentTab } = useApp();

  const [selectedLeague, setSelectedLeague] = useState<LeagueType>(stats.league);
  const [cheeredIds, setCheeredIds] = useState<Record<string, boolean>>({});
  const [showInfoModal, setShowInfoModal] = useState<boolean>(false);

  const leaderboard: LeaderboardEntry[] = buildLeagueLeaderboard(stats, selectedLeague);
  const userEntry = leaderboard.find(e => e.isCurrentUser);

  const top3 = [
    leaderboard[1], // 2nd place
    leaderboard[0], // 1st place
    leaderboard[2], // 3rd place
  ].filter(Boolean);

  const handleCheer = (id: string, name: string) => {
    if (cheeredIds[id]) return;
    setCheeredIds(prev => ({ ...prev, [id]: true }));
    showToast(`🙌 You sent a cheer to ${name}!`);
  };

  const activeLeagueConfig = LEAGUES_INFO.find(l => l.id === selectedLeague) || LEAGUES_INFO[0];

  return (
    <div className="space-y-6 pb-20">
      {/* Header Banner */}
      <div
        className={`rounded-3xl bg-gradient-to-br ${activeLeagueConfig.color} border ${activeLeagueConfig.border} p-5 sm:p-6 shadow-xl relative overflow-hidden`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              Weekly League Tournament
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-100 flex items-center gap-2">
              <span>{activeLeagueConfig.icon}</span>
              <span>{activeLeagueConfig.name}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
              Compete with fellow SQL learners. Top 3 advance to the higher division on Sunday!
            </p>
          </div>

          {/* Season Countdown Timer */}
          <div className="flex items-center gap-3">
            <div className="p-3 sm:p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center flex-shrink-0 shadow-lg">
              <span className="text-[10px] font-bold text-slate-400 flex items-center justify-center gap-1 uppercase tracking-wider">
                <Clock className="w-3 h-3 text-emerald-400" />
                Resets In
              </span>
              <span className="text-sm sm:text-base font-black text-emerald-400 block mt-0.5 font-mono">
                3d 14h 22m
              </span>
            </div>

            <button
              onClick={() => setShowInfoModal(true)}
              className="p-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              title="League Rules & Promotion info"
              aria-label="League rules"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* User Standing Bar */}
        {userEntry && (
          <div className="mt-4 pt-3.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Your Current Placement:</span>
              <span className="font-extrabold text-amber-400 text-sm">
                #{userEntry.rank} of {leaderboard.length}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                {getLeaguePromotionZone(userEntry.rank, leaderboard.length) === 'promotion'
                  ? '🚀 Promotion Zone!'
                  : getLeaguePromotionZone(userEntry.rank, leaderboard.length) === 'demotion'
                  ? '⚠️ Demotion Risk'
                  : '🛡️ Safe Zone'}
              </span>
            </div>

            <div className="flex items-center gap-3 text-slate-300 font-medium">
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-violet-400 fill-violet-400" />
                <strong className="text-white">{stats.xp}</strong> XP
              </span>
              <span className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <strong className="text-white">{stats.currentStreak}</strong> Day Streak
              </span>
            </div>
          </div>
        )}
      </div>

      {/* League Selector Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-800 scrollbar-none">
        {LEAGUES_INFO.map(league => {
          const isSelected = selectedLeague === league.id;
          const isCurrentDivision = stats.league === league.id;

          return (
            <button
              key={league.id}
              onClick={() => setSelectedLeague(league.id)}
              className={`px-3 sm:px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 ${
                isSelected
                  ? 'bg-slate-800 text-white border-2 border-amber-400/80 shadow-md scale-105'
                  : 'bg-slate-900 hover:bg-slate-800/80 text-slate-400 border border-slate-800'
              }`}
            >
              <span>{league.icon}</span>
              <span>{league.name.replace(' League', '')}</span>
              {isCurrentDivision && (
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/30 text-emerald-300 font-extrabold uppercase">
                  YOU
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Top 3 Podium (Duolingo Style) */}
      {top3.length >= 3 && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="text-center space-y-0.5">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
              Top Performers
            </span>
            <h2 className="text-base font-bold text-slate-100">Weekly Division Podium</h2>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end pt-4 max-w-lg mx-auto">
            {/* 2nd Place */}
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="relative">
                <span className="text-3xl sm:text-4xl">{top3[0].avatar}</span>
                <span className="absolute -bottom-1 -right-1 text-xs bg-slate-300 text-slate-950 font-black w-5 h-5 rounded-full flex items-center justify-center border border-white">
                  2
                </span>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-200 block truncate max-w-[85px] sm:max-w-[120px]">
                  {top3[0].name}
                </span>
                <span className="text-[10px] text-violet-400 font-mono font-bold">
                  {top3[0].xp} XP
                </span>
              </div>
              <div className="w-full h-20 sm:h-24 bg-gradient-to-t from-slate-700/60 to-slate-700/20 rounded-t-2xl border-t-2 border-slate-300 flex items-center justify-center text-slate-400 font-black text-lg">
                🥈
              </div>
            </div>

            {/* 1st Place (Crown) */}
            <div className="flex flex-col items-center text-center space-y-2 -translate-y-2">
              <div className="relative">
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-lg animate-bounce">👑</span>
                <span className="text-4xl sm:text-5xl">{top3[1].avatar}</span>
                <span className="absolute -bottom-1 -right-1 text-xs bg-amber-400 text-slate-950 font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-amber-300 shadow">
                  1
                </span>
              </div>
              <div>
                <span className="text-xs sm:text-sm font-extrabold text-amber-300 block truncate max-w-[95px] sm:max-w-[130px]">
                  {top3[1].name}
                </span>
                <span className="text-[11px] text-violet-300 font-mono font-extrabold">
                  {top3[1].xp} XP
                </span>
              </div>
              <div className="w-full h-28 sm:h-32 bg-gradient-to-t from-amber-600/40 via-amber-500/20 to-amber-400/20 rounded-t-2xl border-t-2 border-amber-400 flex items-center justify-center text-amber-400 font-black text-2xl shadow-lg">
                🥇
              </div>
            </div>

            {/* 3rd Place */}
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="relative">
                <span className="text-3xl sm:text-4xl">{top3[2].avatar}</span>
                <span className="absolute -bottom-1 -right-1 text-xs bg-amber-700 text-white font-black w-5 h-5 rounded-full flex items-center justify-center border border-amber-600">
                  3
                </span>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-200 block truncate max-w-[85px] sm:max-w-[120px]">
                  {top3[2].name}
                </span>
                <span className="text-[10px] text-violet-400 font-mono font-bold">
                  {top3[2].xp} XP
                </span>
              </div>
              <div className="w-full h-16 sm:h-20 bg-gradient-to-t from-amber-900/60 to-amber-900/20 rounded-t-2xl border-t-2 border-amber-700 flex items-center justify-center text-amber-700 font-black text-lg">
                🥉
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Division Standings */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl space-y-0">
        <div className="px-5 py-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="font-bold uppercase tracking-wider text-[11px] text-slate-300">
            Rank & Learner
          </span>
          <div className="flex items-center gap-6 pr-2">
            <span className="font-bold uppercase tracking-wider text-[11px] text-slate-300">XP Points</span>
            <span className="font-bold uppercase tracking-wider text-[11px] text-slate-300 hidden sm:inline">
              Social
            </span>
          </div>
        </div>

        <div className="divide-y divide-slate-800/60">
          {leaderboard.map(learner => {
            const isUser = learner.isCurrentUser;
            const zone = getLeaguePromotionZone(learner.rank, leaderboard.length);
            const isCheered = cheeredIds[learner.id];

            // Render Promotion Zone divider after rank 3
            const showPromotionDivider = learner.rank === 4;
            // Render Demotion Zone divider before last 2
            const showDemotionDivider = learner.rank === leaderboard.length - 1;

            return (
              <React.Fragment key={learner.id}>
                {showPromotionDivider && (
                  <div className="bg-emerald-500/10 border-y border-emerald-500/30 px-4 py-1.5 flex items-center justify-between text-[11px] font-bold text-emerald-400">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Promotion Zone • Top 3 Advance to Next League
                    </span>
                    <span>▲ PROMOTING</span>
                  </div>
                )}

                {showDemotionDivider && (
                  <div className="bg-rose-500/10 border-y border-rose-500/30 px-4 py-1.5 flex items-center justify-between text-[11px] font-bold text-rose-400">
                    <span className="flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      Demotion Zone • Risk of Falling to Lower League
                    </span>
                    <span>▼ DEMOTION</span>
                  </div>
                )}

                <div
                  className={`p-3.5 sm:p-4 flex items-center justify-between gap-3 transition-colors ${
                    isUser
                      ? 'bg-emerald-500/15 border-l-4 border-l-emerald-500 font-bold'
                      : 'hover:bg-slate-800/40'
                  }`}
                >
                  {/* Left: Rank, Avatar, Name */}
                  <div className="flex items-center gap-2.5 sm:gap-3.5 flex-1 min-w-0">
                    {/* Rank Number */}
                    <div className="w-7 flex-shrink-0 text-center">
                      <span
                        className={`text-sm font-black ${
                          learner.rank === 1
                            ? 'text-amber-400'
                            : learner.rank === 2
                            ? 'text-slate-300'
                            : learner.rank === 3
                            ? 'text-amber-600'
                            : isUser
                            ? 'text-emerald-400'
                            : 'text-slate-500'
                        }`}
                      >
                        {learner.rank}
                      </span>
                    </div>

                    {/* Trend Icon */}
                    <div className="flex-shrink-0 text-[10px]">
                      {learner.trend === 'up' ? (
                        <ArrowUp className="w-3.5 h-3.5 text-emerald-400" />
                      ) : learner.trend === 'down' ? (
                        <ArrowDown className="w-3.5 h-3.5 text-rose-400" />
                      ) : (
                        <Minus className="w-3 h-3 text-slate-600" />
                      )}
                    </div>

                    {/* Avatar */}
                    <span className="text-2xl flex-shrink-0">{learner.avatar}</span>

                    {/* Name & Title */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs sm:text-sm truncate ${isUser ? 'text-emerald-300 font-black' : 'text-slate-200'}`}>
                          {learner.name}
                        </span>
                        {isUser && (
                          <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-1.5 py-0.2 rounded-md uppercase">
                            YOU
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        {learner.titleBadge && <span>{learner.titleBadge}</span>}
                        {learner.streak > 0 && (
                          <span className="flex items-center gap-0.5 text-amber-400 font-semibold">
                            <Flame className="w-3 h-3 fill-amber-500" /> {learner.streak}d
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: XP Score & Cheer Button */}
                  <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                    <div className="text-right">
                      <div className="text-xs sm:text-sm font-mono font-black text-violet-300 flex items-center justify-end gap-1">
                        <Zap className="w-3.5 h-3.5 text-violet-400 fill-violet-400" />
                        <span>{learner.xp}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium">XP</span>
                    </div>

                    {/* Cheer Button */}
                    {!isUser && (
                      <button
                        onClick={() => handleCheer(learner.id, learner.name)}
                        className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all active:scale-95 ${
                          isCheered
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400'
                        }`}
                        title="Send encouragement cheer"
                        aria-label={`Cheer ${learner.name}`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isCheered ? 'fill-rose-400 text-rose-400' : ''}`} />
                        <span className="text-[10px] hidden sm:inline">
                          {(learner.cheersReceived || 0) + (isCheered ? 1 : 0)}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Motivational Info Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Mascot mood="cheering" size="sm" />
          <div>
            <h3 className="text-sm font-bold text-slate-100">Want to Climb the Leaderboard?</h3>
            <p className="text-xs text-slate-400">
              Complete lessons (+10 XP), write SQL queries (+15 XP), or solve Daily Challenges (+25 XP)!
            </p>
          </div>
        </div>

        <button
          onClick={() => setCurrentTab('learn')}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-md transition-all active:scale-95 whitespace-nowrap"
        >
          Start Next Lesson →
        </button>
      </div>

      {/* League Rules Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 w-full max-w-md space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                How SQLQuest Leagues Work
              </h3>
              <button
                onClick={() => setShowInfoModal(false)}
                className="text-slate-400 hover:text-slate-200 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-bold text-emerald-400">1. Weekly Seasons</span>
                <p>Every week, learners are placed in a 10-person division matching their skill tier.</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-bold text-amber-400">2. Promotion (Top 3)</span>
                <p>The top 3 learners with the highest XP on Sunday night advance to the next league division.</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-bold text-rose-400">3. Demotion Zone</span>
                <p>Learners in the bottom 2 ranks of a tier drop back down to the previous division.</p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                ⭐ <strong>100% Free Competition</strong>: No paid boosters or microtransactions. Every XP point is earned purely through real SQL learning!
              </div>
            </div>

            <button
              onClick={() => setShowInfoModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
