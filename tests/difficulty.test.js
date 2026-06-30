// tests/difficulty.test.js
import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnInterval, speedMultiplier } from '../src/difficulty.js';

test('spawnInterval starts at base and decreases over time', () => {
  assert.equal(spawnInterval(0), 900);
  assert.ok(spawnInterval(10000) < 900);
});

test('spawnInterval never drops below the minimum', () => {
  assert.ok(spawnInterval(600000) >= 350);
});

test('speedMultiplier starts at 1 and grows with time', () => {
  assert.equal(speedMultiplier(0), 1);
  assert.ok(Math.abs(speedMultiplier(10000) - 1.12) < 1e-9); // 1 + 10*0.012
});
