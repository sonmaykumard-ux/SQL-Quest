import React from 'react';
import { X, Trophy, Zap, Coins } from 'lucide-react';
import { Achievement } from '../../types';
import { Mascot } from './Mascot';

interface AchievementModalProps {
  achievement: Achievement;
  onClose: () => void;
}

export const AchievementModal: React.FC<AchievementModalProps> = ({ achievement, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border-2 border-amber-500/50 rounded-3xl p-6 w-full max-w-sm text-center space-y-4 shadow-2xl relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-slate-200"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex justify-center pt-2">
          <Mascot mood="cheering" size="lg" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-black uppercase tracking-widest text-amber-400">
            Achievement Unlocked!
          </span>
          <h3 className="text-xl font-black text-slate-100 flex items-center justify-center gap-2">
            <span>{achievement.icon}</span>
            <span>{achievement.title}</span>
          </h3>
          <p className="text-xs text-slate-300">{achievement.description}</p>
        </div>

        {/* Bonus rewards */}
        <div className="flex justify-center gap-3 pt-1">
          <span className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl bg-violet-500/20 text-violet-300 border border-violet-500/30">
            <Zap className="w-3.5 h-3.5 text-violet-400 fill-violet-400" />
            +{achievement.xpBonus} XP
          </span>
          <span className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
            <Coins className="w-3.5 h-3.5 text-yellow-400" />
            +{achievement.coinsBonus} Coins
          </span>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-lg transition-transform active:scale-95"
        >
          Awesome! Continue Quest
        </button>
      </div>
    </div>
  );
};
