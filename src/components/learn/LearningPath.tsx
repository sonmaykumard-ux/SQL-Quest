import React from 'react';
import { Check, Star, Play, Sparkles, Trophy, Award, BookOpen, Layers } from 'lucide-react';
import { CURRICULUM_LEVELS } from '../../data/curriculum';
import { useApp } from '../../context/AppContext';
import { Mascot } from '../common/Mascot';
import { Lesson } from '../../types';

export const LearningPath: React.FC = () => {
  const { stats, setActiveLessonModal, setCurrentTab } = useApp();

  const totalLessonsCount = CURRICULUM_LEVELS.reduce((sum, lvl) => sum + lvl.lessons.length, 0);
  const completedCount = stats.completedLessonIds.length;
  const progressPercent = Math.min(100, Math.round((completedCount / totalLessonsCount) * 100));

  // Determine current active lesson
  let foundCurrent = false;
  let nextLessonToSuggest: Lesson | null = null;

  for (const lvl of CURRICULUM_LEVELS) {
    for (const l of lvl.lessons) {
      if (!stats.completedLessonIds.includes(l.id) && !foundCurrent) {
        nextLessonToSuggest = l;
        foundCurrent = true;
        break;
      }
    }
    if (foundCurrent) break;
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Daily Quest Header Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-emerald-900/60 via-slate-900 to-slate-900 border border-emerald-500/30 p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none">
          <Mascot mood="cheering" size="xl" />
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 relative z-10">
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              100% Free Complete Academy
            </div>
            <h1 className="text-lg sm:text-2xl font-black text-slate-100 tracking-tight leading-snug">
              SQL Quest Learning Journey
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed">
              Progress from your very first <code className="text-emerald-400 font-mono">SELECT</code> to job-ready Data Analyst window functions and warehousing.
            </p>
          </div>

          {/* Quick Start Next Lesson Button */}
          {nextLessonToSuggest && (
            <button
              onClick={() => setActiveLessonModal(nextLessonToSuggest)}
              className="w-full sm:w-auto px-5 py-2.5 sm:py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-all flex-shrink-0"
              aria-label={`Continue: ${nextLessonToSuggest.title}`}
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Continue Lesson</span>
            </button>
          )}
        </div>

        {/* Overall Curriculum Progress Bar */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 font-medium text-slate-300">
            <span>Overall Academy Progress:</span>
            <span className="font-bold text-emerald-400">
              {completedCount} / {totalLessonsCount} lessons ({progressPercent}%)
            </span>
          </div>

          <div className="w-full sm:w-48 bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Duolingo-style Level Sections and Lesson Nodes */}
      <div className="space-y-10 max-w-xl mx-auto">
        {CURRICULUM_LEVELS.map(level => {
          const levelCompletedLessons = level.lessons.filter(l =>
            stats.completedLessonIds.includes(l.id)
          );
          const isLevelMastered = levelCompletedLessons.length === level.lessons.length;

          return (
            <div key={level.id} className="space-y-5">
              {/* Level Header Card */}
              <div
                className="p-4 sm:p-5 rounded-2xl border shadow-md flex items-center justify-between gap-3"
                style={{
                  backgroundColor: `${level.color}15`,
                  borderColor: `${level.color}40`,
                }}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-black px-2 py-0.5 rounded-md text-slate-950"
                      style={{ backgroundColor: level.color }}
                    >
                      LEVEL {level.number}
                    </span>
                    <span className="text-xs font-semibold text-slate-300">
                      {levelCompletedLessons.length} / {level.lessons.length} Completed
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-100 mt-1">{level.title}</h3>
                  <p className="text-xs text-slate-400">{level.subtitle}</p>
                </div>

                {isLevelMastered ? (
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 flex-shrink-0">
                    <Trophy className="w-5 h-5 fill-amber-400" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 flex-shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                )}
              </div>

              {/* Lesson Nodes Path (Winding layout) */}
              <div className="flex flex-col items-center gap-5 py-2">
                {level.lessons.map((lesson, idx) => {
                  const isCompleted = stats.completedLessonIds.includes(lesson.id);
                  const isCurrent = nextLessonToSuggest?.id === lesson.id;

                  // Winding offsets (-24px, 0, 24px) for classic Duolingo feel
                  const offsets = [
                    'sm:translate-x-0',
                    'sm:translate-x-6',
                    'sm:-translate-x-6',
                    'sm:translate-x-0',
                  ];
                  const offsetClass = offsets[idx % offsets.length];

                  return (
                    <div
                      key={lesson.id}
                      className={`relative flex flex-col items-center ${offsetClass} transition-transform`}
                    >
                      {/* Active "START HERE" mascot callout bubble */}
                      {isCurrent && (
                        <div className="absolute -top-11 z-20 animate-bounce flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500 text-slate-950 text-[11px] font-black shadow-lg">
                          <span>START HERE</span>
                          <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
                        </div>
                      )}

                      {/* Lesson Circular Node Button */}
                      <button
                        onClick={() => setActiveLessonModal(lesson)}
                        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex flex-col items-center justify-center transition-all relative group shadow-lg active:scale-95 ${
                          isCompleted
                            ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 border-4 border-emerald-400 ring-4 ring-emerald-500/20'
                            : isCurrent
                            ? 'bg-slate-800 hover:bg-slate-700 text-emerald-400 border-4 border-emerald-500 ring-4 ring-emerald-500/40 animate-pulse'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-4 border-slate-700 hover:border-slate-500'
                        }`}
                        aria-label={`Lesson: ${lesson.title}`}
                      >
                        {isCompleted ? (
                          <>
                            <Check className="w-7 h-7 stroke-[3]" />
                            <div className="flex gap-0.5 mt-0.5">
                              <Star className="w-2.5 h-2.5 fill-slate-950 text-slate-950" />
                              <Star className="w-2.5 h-2.5 fill-slate-950 text-slate-950" />
                              <Star className="w-2.5 h-2.5 fill-slate-950 text-slate-950" />
                            </div>
                          </>
                        ) : isCurrent ? (
                          <Play className="w-7 h-7 fill-emerald-400 translate-x-0.5" />
                        ) : (
                          <Star className="w-6 h-6 text-slate-400 group-hover:text-slate-200" />
                        )}
                      </button>

                      {/* Lesson Title label */}
                      <div className="mt-2 text-center max-w-[160px]">
                        <span className="text-xs font-bold text-slate-200 block truncate">
                          {lesson.title}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          +{lesson.exercises.length * 5 + 10} XP • 5m
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Level Milestone Treasure Chest Node */}
                <div className="pt-2 flex flex-col items-center">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all ${
                      isLevelMastered
                        ? 'bg-amber-500/20 border-amber-500 text-amber-400 shadow-amber-500/20 shadow-lg'
                        : 'bg-slate-800/80 border-slate-700 text-slate-500'
                    }`}
                  >
                    <Award className="w-7 h-7" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 mt-1">
                    Level {level.number} Checkpoint
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
