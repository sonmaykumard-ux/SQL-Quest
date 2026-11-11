import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, HelpCircle, ArrowRight, RotateCcw, Play, Sparkles, BookOpen } from 'lucide-react';
import { Lesson, Exercise, McqExercise, FillBlankExercise, WriteQueryExercise, FixBugExercise, QueryResult } from '../../types';
import { useApp } from '../../context/AppContext';
import { executeQuery, validateExerciseQuery } from '../../services/sqliteEngine';
import { Mascot } from '../common/Mascot';

interface LessonModalProps {
  lesson: Lesson;
  onClose: () => void;
}

export const LessonModal: React.FC<LessonModalProps> = ({ lesson, onClose }) => {
  const { completeLesson, recordQueryExecuted, stats } = useApp();

  const [stepIndex, setStepIndex] = useState<number>(0); // 0 = Intro summary, 1..N = exercises, N+1 = Complete
  const [selectedMcq, setSelectedMcq] = useState<number | null>(null);
  const [selectedBlank, setSelectedBlank] = useState<string>('');
  const [userQuery, setUserQuery] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [validationState, setValidationState] = useState<{
    tested: boolean;
    isCorrect: boolean;
    feedback: string;
  } | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);

  const totalSteps = lesson.exercises.length + 1; // 1 intro + exercises
  const currentExercise: Exercise | null = stepIndex > 0 && stepIndex <= lesson.exercises.length
    ? lesson.exercises[stepIndex - 1]
    : null;

  // Reset exercise state when stepIndex changes
  useEffect(() => {
    setSelectedMcq(null);
    setSelectedBlank('');
    setQueryResult(null);
    setValidationState(null);
    setShowHint(false);

    if (currentExercise) {
      if (currentExercise.type === 'write_query') {
        const ex = currentExercise as WriteQueryExercise;
        setUserQuery(ex.defaultQuery || 'SELECT * FROM customers;');
      } else if (currentExercise.type === 'fix_bug') {
        const ex = currentExercise as FixBugExercise;
        setUserQuery(ex.buggyQuery);
      }
    }
  }, [stepIndex]);

  // Handle MCQ check
  const handleCheckMcq = (mcq: McqExercise) => {
    if (selectedMcq === null) return;
    const isCorrect = selectedMcq === mcq.correctAnswerIndex;
    setValidationState({
      tested: true,
      isCorrect,
      feedback: isCorrect
        ? 'Correct! ' + mcq.explanation
        : 'Not quite. ' + mcq.explanation,
    });
  };

  // Handle Fill-in-the-blank check
  const handleCheckBlank = (blank: FillBlankExercise) => {
    if (!selectedBlank) return;
    const isCorrect = selectedBlank.toLowerCase() === blank.correctBlank.toLowerCase();
    setValidationState({
      tested: true,
      isCorrect,
      feedback: isCorrect
        ? 'Well done! ' + blank.explanation
        : `Incorrect. The correct keyword is "${blank.correctBlank}". ` + blank.explanation,
    });
  };

  // Handle Running SQL in SQLite
  const handleRunSql = async (datasetId: string) => {
    setIsRunning(true);
    recordQueryExecuted(userQuery);
    const res = await executeQuery(datasetId, userQuery);
    setQueryResult(res);
    setIsRunning(false);
  };

  // Handle Validating SQL query against reference target
  const handleCheckSqlQuery = async (datasetId: string, targetQuery: string) => {
    setIsRunning(true);
    recordQueryExecuted(userQuery);
    const res = await validateExerciseQuery(datasetId, userQuery, targetQuery);
    setQueryResult(res.userResult);
    setValidationState({
      tested: true,
      isCorrect: res.isCorrect,
      feedback: res.feedback,
    });
    setIsRunning(false);
  };

  const handleNextStep = () => {
    if (stepIndex < totalSteps) {
      setStepIndex(prev => prev + 1);
    } else {
      // Completed lesson!
      completeLesson(lesson.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Top Header */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-slate-800 flex items-center justify-between gap-3 bg-slate-900/60">
          <div className="flex items-center gap-2 flex-1">
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
              aria-label="Close lesson"
            >
              <X className="w-5 h-5" />
            </button>
            {/* Progress Bar */}
            <div className="flex-1 bg-slate-800 h-2.5 rounded-full overflow-hidden mx-2">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${Math.round((stepIndex / totalSteps) * 100)}%` }}
              />
            </div>
          </div>
          <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">
            {stepIndex === 0 ? 'Concept' : stepIndex <= lesson.exercises.length ? `Exercise ${stepIndex}/${lesson.exercises.length}` : 'Completed'}
          </span>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* STEP 0: Concept Overview */}
          {stepIndex === 0 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-3">
                <Mascot mood="happy" size="md" />
                <div>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    Level {lesson.levelId} • {lesson.durationMinutes} min lesson
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-100">{lesson.title}</h2>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {lesson.topics.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 text-emerald-300 border border-slate-700/60"
                  >
                    #{t}
                  </span>
                ))}
              </div>

              <div className="text-slate-300 text-xs sm:text-sm leading-relaxed space-y-3 bg-slate-800/40 p-4 rounded-2xl border border-slate-800">
                {lesson.summaryMarkdown
                  .trim()
                  .split('\n\n')
                  .map((block, bIdx) => {
                    const trimmed = block.trim();
                    if (trimmed.startsWith('### ')) {
                      return (
                        <h4 key={bIdx} className="text-sm sm:text-base font-bold text-emerald-300 pt-1">
                          {trimmed.replace('### ', '')}
                        </h4>
                      );
                    }
                    if (trimmed.startsWith('```')) {
                      const codeContent = trimmed.replace(/```sql|```/g, '').trim();
                      return (
                        <pre
                          key={bIdx}
                          className="bg-slate-950 p-3 rounded-xl font-mono text-xs text-emerald-300 border border-slate-800 overflow-x-auto my-2"
                        >
                          <code>{codeContent}</code>
                        </pre>
                      );
                    }
                    if (trimmed.startsWith('- ')) {
                      const items = trimmed.split('\n').filter(line => line.trim().startsWith('- '));
                      return (
                        <ul key={bIdx} className="space-y-1.5 list-disc list-inside text-slate-300">
                          {items.map((it, iIdx) => {
                            const raw = it.replace(/^- /, '');
                            // Format bold **word**
                            const parts = raw.split(/\*\*(.*?)\*\*/g);
                            return (
                              <li key={iIdx}>
                                {parts.map((p, pIdx) =>
                                  pIdx % 2 === 1 ? (
                                    <strong key={pIdx} className="text-slate-100 font-bold">
                                      {p}
                                    </strong>
                                  ) : (
                                    p
                                  )
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      );
                    }
                    // Regular paragraph with bold support
                    const parts = trimmed.split(/\*\*(.*?)\*\*/g);
                    return (
                      <p key={bIdx} className="text-slate-300">
                        {parts.map((p, pIdx) =>
                          pIdx % 2 === 1 ? (
                            <strong key={pIdx} className="text-slate-100 font-bold">
                              {p}
                            </strong>
                          ) : (
                            p
                          )
                        )}
                      </p>
                    );
                  })}
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <p className="text-xs sm:text-sm text-emerald-300 font-medium">
                  Complete {lesson.exercises.length} interactive exercises to earn <strong>+10 XP</strong> and <strong>+5 SQL Coins</strong>!
                </p>
              </div>
            </div>
          )}

          {/* STEP 1..N: Exercises */}
          {currentExercise && (
            <div className="space-y-4 animate-fade-in">
              {/* Exercise Prompt */}
              <div className="flex items-start gap-3">
                <Mascot
                  mood={
                    validationState
                      ? validationState.isCorrect
                        ? 'cheering'
                        : 'thinking'
                      : 'winking'
                  }
                  size="sm"
                />
                <div className="flex-1">
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                    {currentExercise.type.replace('_', ' ').toUpperCase()} • +{currentExercise.xpReward} XP
                  </span>
                  <h3 className="text-base sm:text-lg font-semibold text-slate-100">
                    {currentExercise.prompt}
                  </h3>
                </div>
              </div>

              {/* MCQ TYPE */}
              {currentExercise.type === 'mcq' && (() => {
                const mcq = currentExercise as McqExercise;
                return (
                  <div className="space-y-2.5 pt-2">
                    {mcq.options.map((option, idx) => {
                      const isSelected = selectedMcq === idx;
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            if (!validationState?.tested) setSelectedMcq(idx);
                          }}
                          disabled={validationState?.tested}
                          className={`w-full text-left p-3.5 rounded-2xl border transition-all text-sm font-medium flex items-center justify-between ${
                            isSelected
                              ? 'bg-emerald-500/15 border-emerald-500 text-emerald-200 shadow-sm'
                              : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/60 text-slate-300'
                          }`}
                        >
                          <span>{option}</span>
                          <span className="text-xs w-6 h-6 rounded-full border flex items-center justify-center font-bold">
                            {String.fromCharCode(65 + idx)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                );
              })()}

              {/* FILL BLANK TYPE */}
              {currentExercise.type === 'fill_blank' && (() => {
                const blank = currentExercise as FillBlankExercise;
                return (
                  <div className="space-y-4 pt-2">
                    <div className="p-4 rounded-2xl bg-slate-950 font-mono text-sm text-cyan-300 border border-slate-800">
                      {blank.template.split('___').map((part, i, arr) => (
                        <React.Fragment key={i}>
                          <span>{part}</span>
                          {i < arr.length - 1 && (
                            <span className="inline-block px-3 py-1 mx-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold min-w-[60px] text-center">
                              {selectedBlank || '_____'}
                            </span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>

                    <div className="space-y-1.5">
                      <p className="text-xs text-slate-400 font-medium">Select the missing keyword:</p>
                      <div className="flex flex-wrap gap-2">
                        {blank.blankOptions.map((opt, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              if (!validationState?.tested) setSelectedBlank(opt);
                            }}
                            disabled={validationState?.tested}
                            className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                              selectedBlank === opt
                                ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* WRITE QUERY OR FIX BUG TYPE */}
              {(currentExercise.type === 'write_query' || currentExercise.type === 'fix_bug') && (() => {
                const datasetId =
                  currentExercise.type === 'write_query'
                    ? (currentExercise as WriteQueryExercise).datasetId
                    : (currentExercise as FixBugExercise).datasetId;
                const targetQuery =
                  currentExercise.type === 'write_query'
                    ? (currentExercise as WriteQueryExercise).targetQuery
                    : (currentExercise as FixBugExercise).targetQuery;

                return (
                  <div className="space-y-3 pt-2">
                    {/* Buggy description warning */}
                    {currentExercise.type === 'fix_bug' && (
                      <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{(currentExercise as FixBugExercise).bugDescription}</span>
                      </div>
                    )}

                    {/* SQL Editor */}
                    <div className="rounded-2xl border border-slate-700 overflow-hidden bg-slate-950">
                      <div className="px-3.5 py-1.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                        <span className="text-[11px] font-mono text-slate-400">
                          SQLite Engine • Dataset: <span className="text-emerald-400 font-bold">{datasetId}</span>
                        </span>
                        <button
                          onClick={() => {
                            if (currentExercise.type === 'write_query') {
                              setUserQuery((currentExercise as WriteQueryExercise).defaultQuery || '');
                            } else {
                              setUserQuery((currentExercise as FixBugExercise).buggyQuery);
                            }
                          }}
                          className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" /> Reset
                        </button>
                      </div>

                      <textarea
                        value={userQuery}
                        onChange={e => setUserQuery(e.target.value)}
                        rows={4}
                        className="w-full p-3 font-mono text-sm bg-transparent text-emerald-300 focus:outline-none resize-none"
                        spellCheck={false}
                      />
                    </div>

                    {/* Controls */}
                    <div className="flex flex-wrap items-center gap-2 justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRunSql(datasetId)}
                          disabled={isRunning || !userQuery.trim()}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <Play className="w-3.5 h-3.5 text-emerald-400" /> Run Query
                        </button>

                        <button
                          onClick={() => setShowHint(!showHint)}
                          className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs font-medium flex items-center gap-1"
                        >
                          <HelpCircle className="w-3.5 h-3.5" /> Hint
                        </button>
                      </div>

                      <button
                        onClick={() => handleCheckSqlQuery(datasetId, targetQuery)}
                        disabled={isRunning || !userQuery.trim()}
                        className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Check Solution
                      </button>
                    </div>

                    {/* Hint Drawer */}
                    {showHint && (
                      <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-300 text-xs animate-fade-in">
                        💡 <strong>Hint:</strong> {currentExercise.hint || 'Target syntax: ' + targetQuery}
                      </div>
                    )}

                    {/* Query Execution Result Table */}
                    {queryResult && (
                      <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-2.5 space-y-1.5 max-h-48 overflow-y-auto">
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span>
                            {queryResult.error
                              ? 'Execution Failed'
                              : `${queryResult.rowCount} rows returned`}
                          </span>
                          <span>{queryResult.executionTimeMs} ms</span>
                        </div>

                        {queryResult.error ? (
                          <div className="p-2 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono">
                            {queryResult.error}
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs font-mono">
                              <thead>
                                <tr className="border-b border-slate-800 text-slate-400">
                                  {queryResult.columns.map((col, cIdx) => (
                                    <th key={cIdx} className="px-2 py-1">
                                      {col}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-900">
                                {queryResult.values.slice(0, 5).map((row, rIdx) => (
                                  <tr key={rIdx} className="text-slate-200">
                                    {row.map((cell, cIdx) => (
                                      <td key={cIdx} className="px-2 py-1 whitespace-nowrap">
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
                            {queryResult.rowCount > 5 && (
                              <p className="text-[10px] text-slate-500 text-center py-1">
                                (Showing first 5 rows)
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Feedback Alert */}
              {validationState && (
                <div
                  className={`p-3.5 rounded-2xl border text-sm font-medium flex items-start gap-2.5 animate-fade-in ${
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
                  <div className="flex-1">
                    <p className="font-bold">{validationState.isCorrect ? 'Awesome!' : 'Try Again'}</p>
                    <p className="text-xs mt-0.5 opacity-90">{validationState.feedback}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* FINAL STEP: Lesson Completion */}
          {stepIndex > lesson.exercises.length && (
            <div className="text-center py-6 space-y-4 animate-fade-in">
              <div className="flex justify-center">
                <Mascot mood="cheering" size="xl" />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-slate-100">Lesson Complete!</h3>
                <p className="text-sm text-slate-400 mt-1">
                  You conquered "{lesson.title}". Your SQL knowledge is leveling up!
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
                  <div className="text-2xl font-black text-emerald-400">+10</div>
                  <div className="text-xs font-semibold text-emerald-300">XP Earned</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                  <div className="text-2xl font-black text-amber-400">+5</div>
                  <div className="text-xs font-semibold text-amber-300">SQL Coins</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Action Footer */}
        <div className="px-4 sm:px-6 py-3.5 border-t border-slate-800 bg-slate-900 flex items-center justify-between gap-3">
          {stepIndex === 0 ? (
            <button
              onClick={() => setStepIndex(1)}
              className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-[0.98]"
            >
              Start Exercises <ArrowRight className="w-4 h-4" />
            </button>
          ) : stepIndex <= lesson.exercises.length ? (
            <div className="w-full flex items-center justify-between gap-3">
              {/* Check Answer Button (for MCQ / Fill Blank) */}
              {!validationState?.tested && currentExercise?.type === 'mcq' && (
                <button
                  onClick={() => handleCheckMcq(currentExercise as McqExercise)}
                  disabled={selectedMcq === null}
                  className="w-full py-3 rounded-2xl bg-emerald-500 disabled:opacity-50 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm transition-all"
                >
                  Check Answer
                </button>
              )}

              {!validationState?.tested && currentExercise?.type === 'fill_blank' && (
                <button
                  onClick={() => handleCheckBlank(currentExercise as FillBlankExercise)}
                  disabled={!selectedBlank}
                  className="w-full py-3 rounded-2xl bg-emerald-500 disabled:opacity-50 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm transition-all"
                >
                  Check Answer
                </button>
              )}

              {/* Continue Button once tested or for write queries */}
              {(validationState?.tested || currentExercise?.type === 'write_query' || currentExercise?.type === 'fix_bug') && (
                <button
                  onClick={handleNextStep}
                  className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98]"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={handleNextStep}
              className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm shadow-lg transition-transform active:scale-[0.98]"
            >
              Finish & Return to Quest Path
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
