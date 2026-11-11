import React, { useState } from 'react';
import {
  Briefcase,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Trophy,
  ArrowRight,
  Database,
  Sparkles,
} from 'lucide-react';
import { PORTFOLIO_PROJECTS } from '../../data/projects';
import { Project, ProjectTask, QueryResult } from '../../types';
import { useApp } from '../../context/AppContext';
import { executeQuery, validateExerciseQuery } from '../../services/sqliteEngine';
import { Mascot } from '../common/Mascot';

export const ProjectsView: React.FC = () => {
  const { stats, completeProject, recordQueryExecuted } = useApp();

  const [selectedProject, setSelectedProject] = useState<Project>(PORTFOLIO_PROJECTS[0]);
  const [currentTaskIndex, setCurrentTaskIndex] = useState<number>(0);
  const [userQuery, setUserQuery] = useState<string>(PORTFOLIO_PROJECTS[0].tasks[0].solutionQuery);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [validationState, setValidationState] = useState<{ isCorrect: boolean; feedback: string } | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);

  const currentTask: ProjectTask = selectedProject.tasks[currentTaskIndex];
  const isProjectCompleted = stats.completedProjectIds.includes(selectedProject.id);

  const handleSelectProject = (proj: Project) => {
    setSelectedProject(proj);
    setCurrentTaskIndex(0);
    setUserQuery(proj.tasks[0].solutionQuery);
    setQueryResult(null);
    setValidationState(null);
    setShowHint(false);
  };

  const handleRunTaskQuery = async () => {
    setIsRunning(true);
    recordQueryExecuted(userQuery);
    const res = await executeQuery(selectedProject.datasetId, userQuery);
    setQueryResult(res);
    setIsRunning(false);
  };

  const handleVerifyTaskQuery = async () => {
    setIsRunning(true);
    recordQueryExecuted(userQuery);
    const res = await validateExerciseQuery(
      selectedProject.datasetId,
      userQuery,
      currentTask.solutionQuery
    );
    setQueryResult(res.userResult);
    setValidationState({
      isCorrect: res.isCorrect,
      feedback: res.feedback,
    });
    setIsRunning(false);

    if (res.isCorrect) {
      if (currentTaskIndex + 1 < selectedProject.tasks.length) {
        // Move to next task after brief pause or user clicks Next
      } else {
        // Entire project completed!
        completeProject(selectedProject.id);
      }
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Portfolio Header */}
      <div className="rounded-3xl bg-gradient-to-r from-cyan-950/80 via-slate-900 to-indigo-950/80 border border-cyan-500/30 p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30">
              <Sparkles className="w-3.5 h-3.5" /> Data Analyst Portfolio Projects
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-100">
              Real-World Industry Case Studies
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Solve end-to-end analytical problems using real SQLite databases. Build job-ready resume experience!
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-right">
              <span className="text-[11px] text-slate-400 block font-medium">Completed</span>
              <span className="text-lg font-black text-cyan-400">
                {stats.completedProjectIds.length} / {PORTFOLIO_PROJECTS.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Project Selector Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {PORTFOLIO_PROJECTS.map(proj => {
          const isSelected = selectedProject.id === proj.id;
          const isDone = stats.completedProjectIds.includes(proj.id);

          return (
            <div
              key={proj.id}
              onClick={() => handleSelectProject(proj)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 relative overflow-hidden ${
                isSelected
                  ? 'bg-cyan-950/30 border-cyan-500 shadow-lg ring-1 ring-cyan-500/40'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                  {proj.difficulty}
                </span>
                {isDone ? (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                    <Trophy className="w-3.5 h-3.5 fill-emerald-400" /> Mastered
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-cyan-400">+100 XP</span>
                )}
              </div>

              <h3 className="text-sm font-bold text-slate-100 leading-snug">{proj.title}</h3>
              <p className="text-xs text-slate-400 line-clamp-2">{proj.scenario}</p>

              <div className="flex items-center gap-2 pt-2 text-[11px] text-slate-400 border-t border-slate-800">
                <Database className="w-3 h-3 text-cyan-400" />
                <span>Dataset: {proj.datasetId}</span>
                <span className="ml-auto font-medium">{proj.tasks.length} tasks</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Project Interactive Case Study Workspace */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-5 shadow-2xl">
        {/* Scenario Banner */}
        <div className="space-y-2 border-b border-slate-800 pb-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              Project #{selectedProject.number} • {selectedProject.category}
            </span>
            {isProjectCompleted && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                ✓ Completed (+100 XP Awarded)
              </span>
            )}
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-100">{selectedProject.title}</h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
            <strong>Business Problem:</strong> {selectedProject.scenario}
          </p>
        </div>

        {/* Task Steps Navigator */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {selectedProject.tasks.map((task, idx) => {
            const isTaskActive = currentTaskIndex === idx;
            return (
              <button
                key={task.id}
                onClick={() => {
                  setCurrentTaskIndex(idx);
                  setUserQuery(task.solutionQuery);
                  setValidationState(null);
                  setQueryResult(null);
                  setShowHint(false);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all flex-shrink-0 ${
                  isTaskActive
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span>Task {task.taskNumber}: {task.title}</span>
              </button>
            );
          })}
        </div>

        {/* Current Task Details */}
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 space-y-1">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              Business Question to Answer with SQL:
            </span>
            <p className="text-sm font-semibold text-slate-100">{currentTask.businessQuestion}</p>
          </div>

          {/* SQL Editor */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden">
            <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono">SQL Analyst Editor</span>
              <button
                onClick={() => setUserQuery(currentTask.solutionQuery)}
                className="hover:text-slate-200 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>
            <textarea
              value={userQuery}
              onChange={e => setUserQuery(e.target.value)}
              rows={6}
              className="w-full p-4 font-mono text-xs sm:text-sm text-cyan-300 bg-transparent focus:outline-none resize-none leading-relaxed"
              spellCheck={false}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={handleRunTaskQuery}
                disabled={isRunning || !userQuery.trim()}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Play className="w-3.5 h-3.5 text-cyan-400" /> Run Query
              </button>

              <button
                onClick={() => setShowHint(!showHint)}
                className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs font-medium flex items-center gap-1"
              >
                <HelpCircle className="w-3.5 h-3.5" /> Hint
              </button>
            </div>

            <button
              onClick={handleVerifyTaskQuery}
              disabled={isRunning || !userQuery.trim()}
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-lg transition-transform active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" /> Check & Submit Task
            </button>
          </div>

          {/* Hint */}
          {showHint && (
            <div className="p-3.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-300 text-xs animate-fade-in">
              💡 <strong>Hint:</strong> {currentTask.hint}
            </div>
          )}

          {/* Validation Feedback */}
          {validationState && (
            <div
              className={`p-4 rounded-2xl border flex items-start gap-3 animate-fade-in ${
                validationState.isCorrect
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'
                  : 'bg-rose-500/15 border-rose-500/40 text-rose-200'
              }`}
            >
              {validationState.isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <h4 className="font-bold text-sm">
                  {validationState.isCorrect ? 'Task Successfully Completed!' : 'Result Mismatch'}
                </h4>
                <p className="text-xs opacity-90">{validationState.feedback}</p>
                {validationState.isCorrect && (
                  <p className="text-xs text-emerald-300/90 pt-1 font-mono">
                    {currentTask.explanation}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Live Query Results Table */}
          {queryResult && (
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>{queryResult.rowCount} rows returned</span>
                <span>{queryResult.executionTimeMs} ms</span>
              </div>

              {queryResult.error ? (
                <div className="p-3 rounded-lg bg-rose-500/10 text-rose-300 text-xs font-mono">
                  {queryResult.error}
                </div>
              ) : (
                <div className="overflow-x-auto max-h-56">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 sticky top-0">
                      <tr>
                        {queryResult.columns.map((col, idx) => (
                          <th key={idx} className="px-3 py-2 font-bold uppercase text-[10px]">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900">
                      {queryResult.values.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-900/50 text-slate-200">
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="px-3 py-1.5 whitespace-nowrap">
                              {cell === null ? (
                                <span className="text-slate-500 italic">NULL</span>
                              ) : (
                                String(cell)
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
