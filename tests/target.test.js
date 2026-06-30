// tests/target.test.js
import test from 'node:test';
import assert from 'node:assert/strict';
import { createTarget, updateTarget, isHit, pickType } from '../src/target.js';

test('createTarget starts below screen and is alive with type radius', () => {
  const t = createTarget({ type: 'big', x: 0.5, vx: 0, vy: -0.18, id: 1 });
  assert.equal(t.alive, true);
  assert.ok(t.y > 1); // 화면 아래에서 시작
  assert.equal(t.radius, 0.075);
});

test('updateTarget moves by velocity * dt * speedMult (immutable)', () => {
  const t = createTarget({ type: 'big', x: 0.5, vx: 0.1, vy: -0.2, id: 1 });
  const startY = t.y;
  const n = updateTarget(t, 0.5, 1);
  assert.notEqual(n, t); // 새 객체
  assert.ok(Math.abs(n.x - (0.5 + 0.1 * 0.5)) < 1e-9);
  assert.ok(n.y < startY); // 위로 이동
});

test('updateTarget marks not-alive after leaving top', () => {
  const t = { ...createTarget({ type: 'big', x: 0.5, vx: 0, vy: -1, id: 1 }), y: -0.05 };
  const n = updateTarget(t, 0.1, 1);
  assert.equal(n.alive, false);
});

test('isHit detects point inside the target circle', () => {
  const t = createTarget({ type: 'big', x: 0.5, vx: 0, vy: 0, id: 1 });
  const ty = t.y;
  assert.equal(isHit(t, 0.5, ty), true);          // 중심
  assert.equal(isHit(t, 0.5 + 0.074, ty), true);  // 반경 내
  assert.equal(isHit(t, 0.5 + 0.2, ty), false);   // 반경 밖
});

test('pickType partitions probability space', () => {
  assert.equal(pickType(0.1), 'big');
  assert.equal(pickType(0.6), 'medium');
  assert.equal(pickType(0.95), 'small');
});

test('pickType boundary values: exact threshold goes to higher bucket', () => {
  assert.equal(pickType(0.5), 'medium');    // 0.5 is NOT < 0.5 → medium
  assert.equal(pickType(0.85), 'small');    // 0.85 is NOT < 0.85 → small
  assert.equal(pickType(0), 'big');         // 0 < 0.5 → big
  assert.equal(pickType(0.4999), 'big');    // 0.4999 < 0.5 → big
});
