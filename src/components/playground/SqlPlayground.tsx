import React, { useState, useEffect } from 'react';
import {
  Play,
  RotateCcw,
  Trash2,
  Copy,
  Bookmark,
  History,
  Database,
  Sparkles,
  ChevronRight,
  Info,
  Check,
  Table as TableIcon,
  Clock,
  Layers,
  Search,
} from 'lucide-react';
import { ALL_DATASETS, DATASET_LIST } from '../../data/datasets';
import { executeQuery, resetDatabase } from '../../services/sqliteEngine';
import { QueryResult, Dataset } from '../../types';
import { useApp } from '../../context/AppContext';
import { Mascot } from '../common/Mascot';

const SQL_KEYWORDS = [
  'SELECT',
  'FROM',
  'WHERE',
  'JOIN',
  'GROUP BY',
  'HAVING',
  'ORDER BY',
  'LIMIT',
  'COUNT(*)',
  'AVG()',
  'SUM()',
  'CASE WHEN',
];

export const SqlPlayground: React.FC = () => {
  const {
    recordQueryExecuted,
    queryHistory,
    savedQueries,
    saveQuery,
    deleteSavedQuery,
    showToast,
  } = useApp();

  const [activeDatasetId, setActiveDatasetId] = useState<string>('ecommerce');
  const [query, setQuery] = useState<string>(
    'SELECT \n  c.first_name, \n  c.city, \n  COUNT(o.order_id) AS total_orders, \n  ROUND(SUM(o.total_amount), 2) AS total_spent\nFROM customers c\nLEFT JOIN orders o ON c.customer_id = o.customer_id\nGROUP BY c.customer_id\nORDER BY total_spent DESC;'
  );
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [activeTab, setActiveTab] = useState<'results' | 'schema' | 'history' | 'saved' | 'tutor'>('results');
  const [tutorExplanation, setTutorExplanation] = useState<string | null>(null);
  const [saveModalOpen, setSaveModalOpen] = useState<boolean>(false);
  const [queryNameInput, setQueryNameInput] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const activeDataset: Dataset = ALL_DATASETS[activeDatasetId] || ALL_DATASETS.ecommerce;

  // Run the query automatically on first mount
  useEffect(() => {
    handleRunQuery();
  }, [activeDatasetId]);

  const handleRunQuery = async () => {
    if (!query.trim()) return;
    setIsRunning(true);
    recordQueryExecuted(query);
    const res = await executeQuery(activeDatasetId, query);
    setResult(res);
    setIsRunning(false);
    setActiveTab('results');
  };

  const handleResetDb = async () => {
    await resetDatabase(activeDatasetId);
    showToast(`Database "${activeDataset.name}" reset to original factory state.`);
    handleRunQuery();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(query);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    showToast('Query copied to clipboard!');
  };

  const handleInsertKeyword = (kw: string) => {
    setQuery(prev => prev + ' ' + kw);
  };

  const handleExplainQueryWithTutor = () => {
    setActiveTab('tutor');
    const upper = query.toUpperCase();
    const explanationParts: string[] = [];

    explanationParts.push(`**Target Dataset**: \`${activeDataset.name}\``);

    if (upper.includes('SELECT')) {
      explanationParts.push(
        '1. **SELECT Clause**: Extracts specified columns and aggregate calculations from the resulting records.'
      );
    }
    if (upper.includes('FROM')) {
      explanationParts.push(
        '2. **FROM Clause**: Designates the primary base table as the source of the pipeline.'
      );
    }
    if (upper.includes('JOIN')) {
      explanationParts.push(
        '3. **JOIN Operation**: Horizontally connects related tables via foreign key relationship constraints.'
      );
    }
    if (upper.includes('WHERE')) {
      explanationParts.push(
        '4. **WHERE Filter**: Evaluates individual row criteria before any grouping occurs.'
      );
    }
    if (upper.includes('GROUP BY')) {
      explanationParts.push(
        '5. **GROUP BY**: Partitions records into summary buckets, evaluating aggregate functions per bucket.'
      );
    }
    if (upper.includes('HAVING')) {
      explanationParts.push(
        '6. **HAVING Filter**: Filters the aggregate summary buckets after the grouping stage.'
      );
    }
    if (upper.includes('ORDER BY')) {
      explanationParts.push(
        '7. **ORDER BY**: Sorts the output rows based on specified expressions in ascending or descending sequence.'
      );
    }

    if (result?.error) {
      explanationParts.push(
        `\n⚠️ **Error Analysis**: SQLite reported: \`${result.error}\`. Verify that table and column identifiers exist in the active schema tab.`
      );
    } else if (result) {
      explanationParts.push(
        `\n✅ **Execution Metrics**: The query successfully returned ${result.rowCount} row(s) in ${result.executionTimeMs} ms.`
      );
    }

    setTutorExplanation(explanationParts.join('\n\n'));
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl">
        {/* Dataset Selector */}
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span className="text-xs font-semibold text-slate-300">Dataset:</span>
          <select
            value={activeDatasetId}
            onChange={e => setActiveDatasetId(e.target.value)}
            className="bg-slate-800 text-slate-100 text-xs font-bold rounded-xl px-2.5 py-1.5 border border-slate-700 focus:outline-none focus:border-emerald-500 cursor-pointer"
            aria-label="Select database dataset"
          >
            {DATASET_LIST.map(d => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.tables.length} tables)
              </option>
            ))}
          </select>
        </div>

        {/* Toolbar Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={handleCopy}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1 transition-colors"
            title="Copy Query"
            aria-label="Copy query"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Copy</span>
          </button>

          <button
            onClick={() => setSaveModalOpen(true)}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1 transition-colors"
            title="Bookmark Query"
            aria-label="Save query"
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Save</span>
          </button>

          <button
            onClick={handleResetDb}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1 transition-colors"
            title="Reset Database to default"
            aria-label="Reset database"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset DB</span>
          </button>

          <button
            onClick={() => setQuery('')}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs font-medium flex items-center gap-1 transition-colors"
            title="Clear Editor"
            aria-label="Clear query editor"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>

          <button
            onClick={handleExplainQueryWithTutor}
            className="px-3 py-1.5 rounded-xl bg-violet-600/30 hover:bg-violet-600/50 border border-violet-500/40 text-violet-300 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            aria-label="AI SQL Tutor explain query"
          >
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span>AI Tutor</span>
          </button>

          <button
            onClick={handleRunQuery}
            disabled={isRunning || !query.trim()}
            className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
            aria-label="Execute SQL query"
          >
            <Play className="w-3.5 h-3.5 fill-slate-950" />
            <span>Run Query</span>
          </button>
        </div>
      </div>

      {/* SQL Code Editor Area */}
      <div className="rounded-2xl border border-slate-700/80 bg-slate-950 overflow-hidden shadow-xl">
        {/* Editor Tab Bar */}
        <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            <span className="text-xs font-mono text-slate-400 ml-2">sandbox.sql</span>
          </div>

          <span className="text-[11px] font-mono text-emerald-400/80">
            Real SQLite Wasm Engine
          </span>
        </div>

        {/* Text Area */}
        <textarea
          value={query}
          onChange={e => setQuery(e.target.value)}
          rows={6}
          className="w-full p-4 font-mono text-xs sm:text-sm text-emerald-300 bg-transparent focus:outline-none resize-y selection:bg-emerald-500/30 leading-relaxed"
          placeholder="Write standard SQL query here (e.g. SELECT * FROM customers LIMIT 10;)"
          spellCheck={false}
          aria-label="SQL query code editor"
        />

        {/* Quick Insert Keyword Chips */}
        <div className="px-3 py-2 bg-slate-900/60 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1 flex-shrink-0">
            Chips:
          </span>
          {SQL_KEYWORDS.map(kw => (
            <button
              key={kw}
              onClick={() => handleInsertKeyword(kw)}
              className="text-[11px] font-mono px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-300 border border-slate-700/60 flex-shrink-0 transition-colors"
            >
              {kw}
            </button>
          ))}
        </div>
      </div>

      {/* Results and Inspector Tab Navigation */}
      <div className="flex items-center gap-1 border-b border-slate-800 pb-1">
        <button
          onClick={() => setActiveTab('results')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'results'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <TableIcon className="w-3.5 h-3.5" />
          <span>Results</span>
          {result && !result.error && (
            <span className="text-[10px] bg-slate-800 px-1.5 py-0.2 rounded-full font-mono">
              {result.rowCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('schema')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'schema'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Schema Explorer</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'history'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>History ({queryHistory.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'saved'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Saved ({savedQueries.length})</span>
        </button>

        <button
          onClick={() => {
            handleExplainQueryWithTutor();
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'tutor'
              ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          <span>AI Tutor</span>
        </button>
      </div>

      {/* TAB CONTENT PANELS */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 min-h-[220px]">
        {/* RESULTS TAB */}
        {activeTab === 'results' && (
          <div className="space-y-3">
            {result ? (
              result.error ? (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono space-y-2">
                  <div className="font-bold text-sm flex items-center gap-2">
                    <span>Query Execution Error</span>
                  </div>
                  <div>{result.error}</div>
                  <button
                    onClick={handleExplainQueryWithTutor}
                    className="mt-2 text-xs font-sans text-rose-200 underline font-semibold"
                  >
                    Ask AI Tutor to diagnose this error →
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span className="text-emerald-400 font-semibold">
                      ✓ {result.rowCount} row(s) returned
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {result.executionTimeMs} ms
                    </span>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-slate-800">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-slate-800/80 text-slate-300 border-b border-slate-700">
                        <tr>
                          {result.columns.map((col, idx) => (
                            <th key={idx} className="px-3 py-2.5 font-bold uppercase tracking-wider text-[11px]">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 bg-slate-950/60">
                        {result.values.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-slate-800/40 text-slate-200">
                            {row.map((val, cIdx) => (
                              <td key={cIdx} className="px-3 py-2 whitespace-nowrap">
                                {val === null ? (
                                  <span className="text-slate-500 italic">NULL</span>
                                ) : (
                                  String(val)
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )
            ) : (
              <div className="text-center py-10 text-slate-400 space-y-2">
                <TableIcon className="w-8 h-8 mx-auto text-slate-500" />
                <p className="text-sm">Click "Run Query" to execute SQL against the real SQLite engine.</p>
              </div>
            )}
          </div>
        )}

        {/* SCHEMA EXPLORER TAB */}
        {activeTab === 'schema' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-100">{activeDataset.name} Schema</h4>
                <p className="text-xs text-slate-400">{activeDataset.description}</p>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {activeDataset.tables.length} tables
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activeDataset.tables.map(table => (
                <div
                  key={table.name}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <TableIcon className="w-3.5 h-3.5 text-slate-400" />
                      {table.name}
                    </span>
                    <button
                      onClick={() => setQuery(`SELECT * FROM ${table.name} LIMIT 10;`)}
                      className="text-[10px] text-slate-400 hover:text-slate-200 underline"
                    >
                      SELECT *
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400">{table.description}</p>

                  <div className="divide-y divide-slate-800/60 pt-1">
                    {table.columns.map(col => (
                      <div key={col.name} className="py-1 flex items-center justify-between text-[11px] font-mono">
                        <span className="text-slate-200 flex items-center gap-1">
                          {col.name}
                          {col.isPrimary && (
                            <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1 rounded">PK</span>
                          )}
                          {col.isForeign && (
                            <span className="text-[9px] bg-sky-500/20 text-sky-300 px-1 rounded">FK</span>
                          )}
                        </span>
                        <span className="text-slate-500">{col.type}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* QUERY HISTORY TAB */}
        {activeTab === 'history' && (
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-100">Recent Query History</h4>
            {queryHistory.length === 0 ? (
              <p className="text-xs text-slate-400">No queries executed yet.</p>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {queryHistory.map((histQuery, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2 group"
                  >
                    <code className="text-xs font-mono text-slate-300 truncate max-w-md">
                      {histQuery}
                    </code>
                    <button
                      onClick={() => {
                        setQuery(histQuery);
                        setActiveTab('results');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold flex-shrink-0"
                    >
                      Load
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SAVED QUERIES TAB */}
        {activeTab === 'saved' && (
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-100">Bookmarked Queries</h4>
            {savedQueries.length === 0 ? (
              <p className="text-xs text-slate-400">No saved queries. Click "Save" above to bookmark queries!</p>
            ) : (
              <div className="space-y-2.5 max-h-72 overflow-y-auto">
                {savedQueries.map(sq => (
                  <div
                    key={sq.id}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200">{sq.name}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setActiveDatasetId(sq.datasetId);
                            setQuery(sq.query);
                            setActiveTab('results');
                          }}
                          className="text-xs font-semibold text-emerald-400 hover:underline"
                        >
                          Load
                        </button>
                        <button
                          onClick={() => deleteSavedQuery(sq.id)}
                          className="text-xs text-rose-400 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <pre className="text-[11px] font-mono text-slate-400 bg-slate-900 p-2 rounded-lg overflow-x-auto">
                      {sq.query}
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* AI SQL TUTOR TAB */}
        {activeTab === 'tutor' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mascot mood="thinking" size="md" />
              <div>
                <h4 className="text-sm font-bold text-slate-100">AI SQL Tutor</h4>
                <p className="text-xs text-slate-400">Real-time query explanation, dialect tips, and performance insights.</p>
              </div>
            </div>

            {tutorExplanation ? (
              <div className="p-4 rounded-xl bg-violet-950/30 border border-violet-500/30 text-xs sm:text-sm text-slate-200 space-y-2 whitespace-pre-line leading-relaxed font-sans">
                {tutorExplanation}
              </div>
            ) : (
              <button
                onClick={handleExplainQueryWithTutor}
                className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs"
              >
                Analyze Current Query
              </button>
            )}
          </div>
        )}
      </div>

      {/* Save Query Modal */}
      {saveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 w-full max-w-md space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-100">Save Query to Favourites</h3>
            <input
              type="text"
              value={queryNameInput}
              onChange={e => setQueryNameInput(e.target.value)}
              placeholder="e.g. Monthly Revenue by Rep"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSaveModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  saveQuery(queryNameInput, query, activeDatasetId);
                  setQueryNameInput('');
                  setSaveModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold"
              >
                Save Query
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
