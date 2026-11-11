import React from 'react';
import { Zap, Coins, Smartphone, Monitor, Volume2, VolumeX } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Mascot } from './Mascot';
import { DailyStreakTracker } from './DailyStreakTracker';

export const Header: React.FC = () => {
  const { stats, isAndroidFrame, setIsAndroidFrame, setCurrentTab, soundEnabled, toggleSound } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-3 sm:px-6 py-2.5">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        {/* Logo and Brand */}
        <div
          onClick={() => setCurrentTab('learn')}
          className="flex items-center gap-2.5 cursor-pointer group"
          role="button"
          tabIndex={0}
          aria-label="SQLQuest Home"
        >
          <Mascot size="sm" mood="happy" />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent group-hover:opacity-90">
                SQLQuest
              </span>
              <span className="hidden sm:inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                FREE
              </span>
            </div>
            <p className="hidden md:block text-[11px] text-slate-400 font-medium">
              Gamified SQL Academy
            </p>
          </div>
        </div>

        {/* Gamified HUD Badges */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Daily Streak Tracker */}
          <DailyStreakTracker />

          {/* XP Points */}
          <button
            onClick={() => setCurrentTab('leaderboard')}
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/30 transition-all text-violet-300 font-bold text-xs sm:text-sm"
            title={`${stats.xp} Total XP earned • View Leaderboard`}
            aria-label={`XP: ${stats.xp}`}
          >
            <Zap className="w-4 h-4 text-violet-400 fill-violet-400" />
            <span>{stats.xp}</span>
            <span className="hidden sm:inline text-[11px] text-violet-400/80">XP</span>
          </button>

          {/* SQL Coins */}
          <button
            onClick={() => setCurrentTab('profile')}
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 transition-all text-yellow-400 font-bold text-xs sm:text-sm"
            title={`${stats.coins} SQL Coins earned`}
            aria-label={`Coins: ${stats.coins}`}
          >
            <Coins className="w-4 h-4 text-yellow-400" />
            <span>{stats.coins}</span>
          </button>

          {/* Android Mobile Frame Toggle */}
          <button
            onClick={() => setIsAndroidFrame(!isAndroidFrame)}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium transition-colors"
            title={isAndroidFrame ? 'Switch to Full Screen View' : 'Preview in Android Mobile Frame'}
            aria-label="Toggle Android frame"
          >
            {isAndroidFrame ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-cyan-400" />
                <span>Full View</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Android Mode</span>
              </>
            )}
          </button>

          {/* Sound Effect Toggle */}
          <button
            onClick={toggleSound}
            className={`flex items-center justify-center p-2 rounded-xl border transition-colors cursor-pointer ${
              soundEnabled
                ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-emerald-400'
                : 'bg-slate-800/60 hover:bg-slate-800 border-slate-800 text-slate-500'
            }`}
            title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
            aria-label={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
