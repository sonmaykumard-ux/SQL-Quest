import test from 'node:test';
import assert from 'node:assert/strict';
import { areResultsEquivalent } from './sqliteEngine';
import { QueryResult } from '../types';

test('sqliteEngine: areResultsEquivalent compares equivalent results regardless of capitalization', () => {
  const res1: QueryResult = {
    columns: ['name', 'price'],
    values: [['Apple', 2.5], ['Banana', 1.0]],
    rowCount: 2,
    executionTimeMs: 1.2,
  };

  const res2: QueryResult = {
    columns: ['name', 'price'],
    values: [['apple', 2.5], ['banana', 1.0]],
    rowCount: 2,
    executionTimeMs: 0.8,
  };

  assert.equal(areResultsEquivalent(res1, res2), true);
});

test('sqliteEngine: areResultsEquivalent returns false on column count mismatch', () => {
  const res1: QueryResult = {
    columns: ['name'],
    values: [['Apple']],
    rowCount: 1,
    executionTimeMs: 1.0,
  };

  const res2: QueryResult = {
    columns: ['name', 'price'],
    values: [['Apple', 2.5]],
    rowCount: 1,
    executionTimeMs: 1.0,
  };

  assert.equal(areResultsEquivalent(res1, res2), false);
});

test('sqliteEngine: areResultsEquivalent handles unordered rows when ignoreOrder is true', () => {
  const res1: QueryResult = {
    columns: ['id'],
    values: [[1], [2], [3]],
    rowCount: 3,
    executionTimeMs: 1.0,
  };

  const res2: QueryResult = {
    columns: ['id'],
    values: [[3], [1], [2]],
    rowCount: 3,
    executionTimeMs: 1.0,
  };

  assert.equal(areResultsEquivalent(res1, res2, true), true);
});
