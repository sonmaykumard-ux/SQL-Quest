import React from 'react';
import { BookOpen, Target, Terminal, Briefcase, Trophy, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TabType } from '../../types';

interface NavItem {
  id: TabType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'learn', label: 'Learn', icon: BookOpen },
  { id: 'practice', label: 'Practice', icon: Target },
  { id: 'playground', label: 'Playground', icon: Terminal },
  { id: 'projects', label: 'Projects', icon: Briefcase },
  { id: 'leaderboard', label: 'Leagues', icon: Trophy },
  { id: 'profile', label: 'Profile', icon: User },
];

export const BottomNav: React.FC = () => {
  const { currentTab, setCurrentTab } = useApp();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 pb-safe">
      <div className="max-w-lg mx-auto flex items-center justify-around px-1 sm:px-3 py-1.5 sm:py-2">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all relative ${
                isActive
                  ? 'text-emerald-400 font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-200 font-medium'
              }`}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Active pill background */}
              {isActive && (
                <div className="absolute inset-0 bg-emerald-500/15 rounded-2xl -z-10 animate-fade-in" />
              )}
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-[11px] leading-tight tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
