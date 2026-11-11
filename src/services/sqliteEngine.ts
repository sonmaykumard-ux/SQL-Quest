import initSqlJs, { Database, SqlJsStatic } from 'sql.js';
import { ALL_DATASETS } from '../data/datasets';
import { QueryResult } from '../types';

let SQL: SqlJsStatic | null = null;
const activeDatabases: Map<string, Database> = new Map();

export async function getSqlInstance(): Promise<SqlJsStatic> {
  if (SQL) return SQL;
  SQL = await initSqlJs({
    locateFile: () => {
      return '/sql-wasm.wasm';
    },
  });
  return SQL;
}

export async function getDatabaseForDataset(datasetId: string): Promise<Database> {
  if (activeDatabases.has(datasetId)) {
    return activeDatabases.get(datasetId)!;
  }

  const sqlInstance = await getSqlInstance();
  const db = new sqlInstance.Database();
  const dataset = ALL_DATASETS[datasetId] || ALL_DATASETS.ecommerce;

  if (dataset && dataset.initSql) {
    db.run(dataset.initSql);
  }

  activeDatabases.set(datasetId, db);
  return db;
}

export async function resetDatabase(datasetId: string): Promise<void> {
  if (activeDatabases.has(datasetId)) {
    const oldDb = activeDatabases.get(datasetId);
    try {
      oldDb?.close();
    } catch {
      // ignore
    }
    activeDatabases.delete(datasetId);
  }
  await getDatabaseForDataset(datasetId);
}

export async function executeQuery(datasetId: string, query: string): Promise<QueryResult> {
  const trimmed = query.trim();
  if (!trimmed) {
    return {
      columns: [],
      values: [],
      rowCount: 0,
      executionTimeMs: 0,
      error: 'Query cannot be empty.',
    };
  }

  const startTime = performance.now();
  try {
    const db = await getDatabaseForDataset(datasetId);
    const results = db.exec(trimmed);
    const executionTimeMs = Math.round((performance.now() - startTime) * 100) / 100;

    if (!results || results.length === 0) {
      // Statements like INSERT, UPDATE, CREATE TABLE that return no rows
      return {
        columns: ['status'],
        values: [['Query executed successfully (0 rows returned).']],
        rowCount: 0,
        executionTimeMs,
      };
    }

    const first = results[0];
    const sanitizedValues: (string | number | null)[][] = first.values.map(row =>
      row.map(val => (val instanceof Uint8Array ? `[BLOB ${val.length}B]` : val))
    );
    return {
      columns: first.columns,
      values: sanitizedValues,
      rowCount: sanitizedValues.length,
      executionTimeMs,
    };
  } catch (err: unknown) {
    const executionTimeMs = Math.round((performance.now() - startTime) * 100) / 100;
    const errorMessage = err instanceof Error ? err.message : String(err);
    return {
      columns: [],
      values: [],
      rowCount: 0,
      executionTimeMs,
      error: errorMessage,
    };
  }
}

/**
 * Normalizes query result values for comparison:
 * Handles case insensitivity of string columns, numeric comparisons, nulls, and sorting where applicable.
 */
export function areResultsEquivalent(
  resA: QueryResult,
  resB: QueryResult,
  ignoreOrder: boolean = false
): boolean {
  if (resA.error || resB.error) return false;
  if (resA.columns.length !== resB.columns.length) return false;
  if (resA.values.length !== resB.values.length) return false;

  const serializeRow = (row: (string | number | null)[]) => {
    return row
      .map(v => {
        if (v === null || v === undefined) return 'NULL';
        if (typeof v === 'number') return v.toFixed(2);
        return String(v).trim().toLowerCase();
      })
      .join('||');
  };

  const rowsA = resA.values.map(serializeRow);
  const rowsB = resB.values.map(serializeRow);

  if (ignoreOrder) {
    rowsA.sort();
    rowsB.sort();
  }

  return rowsA.every((row, idx) => row === rowsB[idx]);
}

export async function validateExerciseQuery(
  datasetId: string,
  userQuery: string,
  targetQuery: string
): Promise<{
  isCorrect: boolean;
  feedback: string;
  userResult: QueryResult;
  targetResult: QueryResult;
}> {
  const userResult = await executeQuery(datasetId, userQuery);
  const targetResult = await executeQuery(datasetId, targetQuery);

  if (userResult.error) {
    return {
      isCorrect: false,
      feedback: `SQL Syntax or Execution Error: ${userResult.error}`,
      userResult,
      targetResult,
    };
  }

  const doesTargetHaveOrderBy = /order\s+by/i.test(targetQuery);
  const isEquivalent = areResultsEquivalent(userResult, targetResult, !doesTargetHaveOrderBy);

  if (isEquivalent) {
    return {
      isCorrect: true,
      feedback: 'Excellent work! Your query produced the exact expected data result.',
      userResult,
      targetResult,
    };
  }

  if (userResult.rowCount !== targetResult.rowCount) {
    return {
      isCorrect: false,
      feedback: `Expected ${targetResult.rowCount} rows, but your query returned ${userResult.rowCount} rows. Check your WHERE condition or JOIN.`,
      userResult,
      targetResult,
    };
  }

  if (userResult.columns.length !== targetResult.columns.length) {
    return {
      isCorrect: false,
      feedback: `Expected ${targetResult.columns.length} columns (${targetResult.columns.join(', ')}), but got ${userResult.columns.length} columns.`,
      userResult,
      targetResult,
    };
  }

  return {
    isCorrect: false,
    feedback: 'The columns or data values did not match the expected result. Check your column calculations or filters.',
    userResult,
    targetResult,
  };
}
