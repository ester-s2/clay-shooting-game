// tests/scoring.test.js
import test from 'node:test';
import assert from 'node:assert/strict';
import { comboMultiplier, hitScore, loadBest, saveBest } from '../src/scoring.js';

test('comboMultiplier maps combo count to table, clamps at end', () => {
  assert.equal(comboMultiplier(0), 1);
  assert.equal(comboMultiplier(2), 2);
  assert.equal(comboMultiplier(99), 3); // 테이블 마지막 값 유지
});

test('hitScore multiplies base points by combo multiplier, rounded', () => {
  assert.equal(hitScore('big', 0), 10);     // 10 * 1
  assert.equal(hitScore('small', 1), 60);   // 40 * 1.5
  assert.equal(hitScore('medium', 2), 40);  // 20 * 2
});

test('loadBest returns 0 when absent, parses stored value', () => {
  const empty = { getItem: () => null };
  assert.equal(loadBest(empty), 0);
  const filled = { getItem: () => '123' };
  assert.equal(loadBest(filled), 123);
});

test('saveBest only updates when higher, returns current best', () => {
  let stored = '50';
  const storage = { getItem: () => stored, setItem: (_k, v) => { stored = v; } };
  assert.equal(saveBest(storage, 40), 50); // 낮으면 유지
  assert.equal(saveBest(storage, 80), 80); // 높으면 갱신
  assert.equal(stored, '80');
});

test('comboMultiplier clamps negative combo to index 0', () => {
  assert.equal(comboMultiplier(-3), 1);
});

test('saveBest with equal score does NOT overwrite', () => {
  let stored = '50';
  const storage = { getItem: () => stored, setItem: (_k, v) => { stored = v; } };
  assert.equal(saveBest(storage, 50), 50);
  assert.equal(stored, '50'); // 덮어쓰지 않음
});
