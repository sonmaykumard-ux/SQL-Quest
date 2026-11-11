import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { LearningPath } from './components/learn/LearningPath';
import { SqlPlayground } from './components/playground/SqlPlayground';
import { PracticeView } from './components/practice/PracticeView';
import { ProjectsView } from './components/projects/ProjectsView';
import { ProfileView } from './components/profile/ProfileView';
import { LeaderboardView } from './components/leaderboard/LeaderboardView';
import { LessonModal } from './components/learn/LessonModal';
import { AchievementModal } from './components/common/AchievementModal';
import { Smartphone, Battery, Wifi, Signal } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const {
    currentTab,
    isAndroidFrame,
    setIsAndroidFrame,
    activeLessonModal,
    setActiveLessonModal,
    toastMessage,
    newAchievementUnlocked,
    dismissAchievement,
  } = useApp();

  const renderActiveTab = () => {
    switch (currentTab) {
      case 'learn':
        return <LearningPath />;
      case 'practice':
        return <PracticeView />;
      case 'playground':
        return <SqlPlayground />;
      case 'projects':
        return <ProjectsView />;
      case 'leaderboard':
        return <LeaderboardView />;
      case 'profile':
        return <ProfileView />;
      default:
        return <LearningPath />;
    }
  };

  const appView = (
    <div className="flex flex-col min-h-screen bg-slate-900 text-slate-100 selection:bg-emerald-500/30">
      {/* Android Status Bar (when in Android frame or mobile) */}
      {isAndroidFrame && (
        <div className="bg-slate-950 px-6 py-1.5 flex items-center justify-between text-[11px] font-mono text-slate-400 select-none border-b border-slate-800">
          <span>9:41</span>
          {/* Camera Notch */}
          <div className="w-3 h-3 rounded-full bg-slate-900 border border-slate-700/60" />
          <div className="flex items-center gap-1.5">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5 text-emerald-400" />
          </div>
        </div>
      )}

      {/* Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-3 sm:px-6 pt-4 sm:pt-6">
        {renderActiveTab()}
      </main>

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Android Bottom Gesture Bar */}
      {isAndroidFrame && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950 py-1 flex justify-center pointer-events-none">
          <div className="w-28 h-1 rounded-full bg-slate-600" />
        </div>
      )}

      {/* Active Lesson Modal */}
      {activeLessonModal && (
        <LessonModal
          lesson={activeLessonModal}
          onClose={() => setActiveLessonModal(null)}
        />
      )}

      {/* Achievement Unlocked Modal */}
      {newAchievementUnlocked && (
        <AchievementModal
          achievement={newAchievementUnlocked}
          onClose={dismissAchievement}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-slate-800 text-emerald-300 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-2xl border border-emerald-500/40 shadow-2xl animate-bounce-subtle pointer-events-none flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );

  if (isAndroidFrame) {
    return (
      <div className="min-h-screen bg-slate-950 py-6 px-2 flex flex-col items-center justify-center">
        {/* Toggle Back to Responsive Bar */}
        <div className="mb-3 flex items-center gap-2">
          <button
            onClick={() => setIsAndroidFrame(false)}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            ← Switch to Full-Bleed Desktop View
          </button>
        </div>

        {/* Realistic Android Phone Device Frame */}
        <div className="w-full max-w-[420px] h-[860px] max-h-[92vh] rounded-[48px] border-4 border-slate-700 bg-slate-900 shadow-2xl overflow-hidden flex flex-col relative ring-8 ring-slate-800/60">
          <div className="flex-1 overflow-y-auto">{appView}</div>
        </div>
      </div>
    );
  }

  return appView;
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
