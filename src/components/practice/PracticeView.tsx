import React, { useState } from 'react';
import {
  Target,
  Bug,
  Briefcase,
  Globe,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  Sparkles,
  Clock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { INTERVIEW_QUESTIONS } from '../../data/interviewQuestions';
import { ALL_DATASETS } from '../../data/datasets';
import { executeQuery, validateExerciseQuery } from '../../services/sqliteEngine';
import { useApp } from '../../context/AppContext';
import { Mascot } from '../common/Mascot';

interface DailyChallengeItem {
  id: string;
  title: string;
  datasetId: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  prompt: string;
  targetQuery: string;
  starterQuery: string;
  xpReward: number;
}

const DAILY_CHALLENGES: DailyChallengeItem[] = [
  {
    id: 'ch_1',
    title: 'Top 5 Customers by Revenue',
    datasetId: 'ecommerce',
    difficulty: 'Beginner',
    prompt: 'Find the top 5 customers who spent the most total money across all their orders. Return first_name and total_spent rounded to 2 decimal places.',
    starterQuery: 'SELECT c.first_name, ROUND(SUM(o.total_amount), 2) AS total_spent\nFROM customers c\nJOIN orders o ON c.customer_id = o.customer_id\nGROUP BY c.customer_id, c.first_name\nORDER BY total_spent DESC\nLIMIT 5;',
    targetQuery: 'SELECT c.first_name, ROUND(SUM(o.total_amount), 2) AS total_spent FROM customers c JOIN orders o ON c.customer_id = o.customer_id GROUP BY c.customer_id, c.first_name ORDER BY total_spent DESC LIMIT 5;',
    xpReward: 25,
  },
  {
    id: 'ch_2',
    title: 'Identify High-Earning Departments',
    datasetId: 'hr',
    difficulty: 'Intermediate',
    prompt: 'Find departments where the average employee salary exceeds $100,000. Return department_name and the average salary.',
    starterQuery: 'SELECT d.department_name, ROUND(AVG(e.salary), 2) AS avg_sal\nFROM departments d\nJOIN employees e ON d.department_id = e.department_id\nGROUP BY d.department_name\nHAVING AVG(e.salary) > 100000;',
    targetQuery: 'SELECT d.department_name, ROUND(AVG(e.salary), 2) AS avg_sal FROM departments d JOIN employees e ON d.department_id = e.department_id GROUP BY d.department_name HAVING AVG(e.salary) > 100000;',
    xpReward: 30,
  },
  {
    id: 'ch_3',
    title: 'Bank Liquid Accounts Breakdown',
    datasetId: 'banking',
    difficulty: 'Intermediate',
    prompt: 'Find all bank accounts with a balance over $10,000. Return account_id, account_type, and balance in descending order of balance.',
    starterQuery: 'SELECT account_id, account_type, balance\nFROM accounts\nWHERE balance > 10000\nORDER BY balance DESC;',
    targetQuery: 'SELECT account_id, account_type, balance FROM accounts WHERE balance > 10000 ORDER BY balance DESC;',
    xpReward: 25,
  },
];

export const PracticeView: React.FC = () => {
  const { stats, completeChallenge, recordQueryExecuted } = useApp();

  const [activeSection, setActiveSection] = useState<'challenges' | 'interview' | 'dialects'>('challenges');
  const [selectedChallenge, setSelectedChallenge] = useState<DailyChallengeItem>(DAILY_CHALLENGES[0]);
  const [challengeQuery, setChallengeQuery] = useState<string>(DAILY_CHALLENGES[0].starterQuery);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [validationResult, setValidationResult] = useState<{ isCorrect: boolean; feedback: string } | null>(null);

  // Interview state
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedInterviewId, setExpandedInterviewId] = useState<string | null>(null);
  const [mockInterviewMode, setMockInterviewMode] = useState<boolean>(false);

  const categories = ['All', 'Beginner', 'Joins', 'Window Functions', 'Optimization', 'Case Studies'];

  const filteredQuestions = selectedCategory === 'All'
    ? INTERVIEW_QUESTIONS
    : INTERVIEW_QUESTIONS.filter(q => q.category.toLowerCase().includes(selectedCategory.toLowerCase()));

  const handleTestChallenge = async () => {
    setIsVerifying(true);
    recordQueryExecuted(challengeQuery);
    const res = await validateExerciseQuery(selectedChallenge.datasetId, challengeQuery, selectedChallenge.targetQuery);
    setIsVerifying(false);

    setValidationResult({
      isCorrect: res.isCorrect,
      feedback: res.feedback,
    });

    if (res.isCorrect) {
      completeChallenge(selectedChallenge.id);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Practice Sub-Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveSection('challenges')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all flex-shrink-0 ${
            activeSection === 'challenges'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>Daily Challenges</span>
        </button>

        <button
          onClick={() => setActiveSection('interview')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all flex-shrink-0 ${
            activeSection === 'interview'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Interview Prep Hub</span>
        </button>

        <button
          onClick={() => setActiveSection('dialects')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all flex-shrink-0 ${
            activeSection === 'dialects'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>SQL Dialects Guide</span>
        </button>
      </div>

      {/* SECTION 1: DAILY CHALLENGES */}
      {activeSection === 'challenges' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-100">Today's SQL Challenges</h2>
              <p className="text-xs text-slate-400">
                Solve realistic data queries every day to boost your streak and earn +25 XP!
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/30">
              <span>Solved: {stats.solvedChallengeIds.length} / {DAILY_CHALLENGES.length}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {DAILY_CHALLENGES.map(ch => {
              const isSolved = stats.solvedChallengeIds.includes(ch.id);
              const isSelected = selectedChallenge.id === ch.id;

              return (
                <div
                  key={ch.id}
                  onClick={() => {
                    setSelectedChallenge(ch);
                    setChallengeQuery(ch.starterQuery);
                    setValidationResult(null);
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-emerald-950/30 border-emerald-500 shadow-md ring-1 ring-emerald-500/30'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                      {ch.difficulty}
                    </span>
                    {isSolved ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Solved
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-amber-400">+{ch.xpReward} XP</span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-slate-100">{ch.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{ch.prompt}</p>
                </div>
              );
            })}
          </div>

          {/* Active Challenge Workspace */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Challenge • {selectedChallenge.difficulty} • Dataset: {selectedChallenge.datasetId}
                </span>
                <h3 className="text-lg font-bold text-slate-100">{selectedChallenge.title}</h3>
                <p className="text-xs sm:text-sm text-slate-300">{selectedChallenge.prompt}</p>
              </div>

              <div className="flex-shrink-0">
                <Mascot mood={validationResult?.isCorrect ? 'cheering' : 'thinking'} size="sm" />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden">
              <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono">SQL Editor</span>
                <button
                  onClick={() => setChallengeQuery(selectedChallenge.starterQuery)}
                  className="hover:text-slate-200 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              </div>
              <textarea
                value={challengeQuery}
                onChange={e => setChallengeQuery(e.target.value)}
                rows={5}
                className="w-full p-3.5 font-mono text-xs sm:text-sm text-emerald-300 bg-transparent focus:outline-none resize-none"
                spellCheck={false}
              />
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-slate-400">
                Runs live in embedded SQLite engine
              </span>

              <button
                onClick={handleTestChallenge}
                disabled={isVerifying || !challengeQuery.trim()}
                className="px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all active:scale-95"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Verify & Submit</span>
              </button>
            </div>

            {/* Validation Outcome */}
            {validationResult && (
              <div
                className={`p-4 rounded-2xl border flex items-start gap-3 animate-fade-in ${
                  validationResult.isCorrect
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'
                    : 'bg-rose-500/15 border-rose-500/40 text-rose-200'
                }`}
              >
                {validationResult.isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="font-bold text-sm">
                    {validationResult.isCorrect ? 'Challenge Conquered!' : 'Incorrect Result'}
                  </h4>
                  <p className="text-xs mt-0.5 opacity-90">{validationResult.feedback}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 2: INTERVIEW PREP HUB */}
      {activeSection === 'interview' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-100">SQL Interview Preparation</h2>
              <p className="text-xs text-slate-400">
                Curated questions asked in technical interviews at top tech companies and data teams.
              </p>
            </div>

            <button
              onClick={() => setMockInterviewMode(!mockInterviewMode)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                mockInterviewMode
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {mockInterviewMode ? 'Exit Mock Interview' : '⏱️ Start Mock Interview Mode'}
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Question List Accordion */}
          <div className="space-y-3">
            {filteredQuestions.map(q => {
              const isExpanded = expandedInterviewId === q.id;

              return (
                <div
                  key={q.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden transition-all shadow-md"
                >
                  <button
                    onClick={() => setExpandedInterviewId(isExpanded ? null : q.id)}
                    className="w-full p-4 text-left flex items-center justify-between gap-3 hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                          {q.category}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                          {q.difficulty}
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-100">{q.title}</h3>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-800 text-slate-400">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="p-4 pt-0 border-t border-slate-800/80 space-y-4 animate-fade-in text-xs sm:text-sm">
                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-slate-200">
                        <span className="font-bold text-emerald-400 block mb-1">Interview Question:</span>
                        {q.question}
                      </div>

                      <div className="space-y-2">
                        <span className="font-bold text-slate-300">Solution Query:</span>
                        <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-emerald-300 text-xs overflow-x-auto leading-relaxed">
                          {q.queryExample}
                        </pre>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 text-slate-300 space-y-1">
                        <span className="font-bold text-slate-100 block">Logic & Expected Output:</span>
                        <p>{q.expectedResultExplanation}</p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 space-y-1">
                        <span className="font-bold text-rose-200 block">Common Candidate Pitfalls:</span>
                        <p>{q.commonMistakes}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 3: SQL DIALECTS GUIDE */}
      {activeSection === 'dialects' && (
        <div className="space-y-5">
          <div>
            <h2 className="text-xl font-bold text-slate-100">SQL Dialects & Warehouse Guide</h2>
            <p className="text-xs text-slate-400">
              Master the critical syntax variations between PostgreSQL, BigQuery, Snowflake, SQL Server, and SQLite.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-sky-400">PostgreSQL / SQLite</span>
              <h3 className="text-sm font-bold text-slate-100">String Concatenation & Pagination</h3>
              <p className="text-xs text-slate-400">
                Uses the ANSI standard double pipe <code className="text-emerald-400 font-mono">||</code> operator for string concatenation, and <code className="text-emerald-400 font-mono">LIMIT N OFFSET M</code> for pagination.
              </p>
              <pre className="p-2.5 rounded-lg bg-slate-950 text-xs font-mono text-emerald-300">
                SELECT first_name || ' ' || last_name FROM customers LIMIT 10;
              </pre>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-amber-400">Google BigQuery</span>
              <h3 className="text-sm font-bold text-slate-100">Analytical & Date Functions</h3>
              <p className="text-xs text-slate-400">
                Uses <code className="text-emerald-400 font-mono">CONCAT()</code>, <code className="text-emerald-400 font-mono">DATE_ADD()</code>, and powerful native JSON path operators like <code className="text-emerald-400 font-mono">JSON_EXTRACT_SCALAR()</code>.
              </p>
              <pre className="p-2.5 rounded-lg bg-slate-950 text-xs font-mono text-emerald-300">
                SELECT DATE_ADD(CURRENT_DATE(), INTERVAL 7 DAY);
              </pre>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-cyan-400">Snowflake</span>
              <h3 className="text-sm font-bold text-slate-100">Semi-Structured Data & Time Travel</h3>
              <p className="text-xs text-slate-400">
                Features native <code className="text-emerald-400 font-mono">FLATTEN()</code> for querying JSON arrays and <code className="text-emerald-400 font-mono">AT(TIMESTAMP =&gt; ...)</code> for database historical point-in-time querying.
              </p>
              <pre className="p-2.5 rounded-lg bg-slate-950 text-xs font-mono text-emerald-300">
                SELECT * FROM transactions AT(OFFSET =&gt; -60*5);
              </pre>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-rose-400">Microsoft SQL Server (T-SQL)</span>
              <h3 className="text-sm font-bold text-slate-100">TOP & Plus Concatenation</h3>
              <p className="text-xs text-slate-400">
                Uses <code className="text-emerald-400 font-mono">SELECT TOP N</code> at the statement start, and the plus sign <code className="text-emerald-400 font-mono">+</code> for string concatenation.
              </p>
              <pre className="p-2.5 rounded-lg bg-slate-950 text-xs font-mono text-emerald-300">
                SELECT TOP 10 first_name + ' ' + last_name FROM customers;
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
