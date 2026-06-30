// src/game.js
import { GAME_DURATION_MS, MAX_RETRIES, TARGET_TYPES } from './config.js';
import { hitScore, saveBest, comboMultiplier } from './scoring.js';
import { spawnInterval, speedMultiplier } from './difficulty.js';
import { createTarget, updateTarget, pickType } from './target.js';
import { attachPointer } from './input.js';
import { resizeCanvas, drawFrame } from './render.js';
import { updateHud, setStartMode, showOverlay, hideOverlay, onRetry } from './ui.js';

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const storage = window.localStorage;

let dims = resizeCanvas(canvas);
window.addEventListener('resize', () => { dims = resizeCanvas(canvas); });

const state = {
  phase: 'idle',          // 'idle' | 'playing' | 'over'
  targets: [],
  effects: [],
  score: 0,
  combo: 0,               // 연속 명중 수 (배율 인덱스로 사용)
  retriesLeft: MAX_RETRIES,
  elapsedMs: 0,
  spawnTimerMs: 0,
  lastTs: 0,
  nextId: 1,
};

// 난수 기반 한 변의 가장자리에서 타겟 생성 (좌우로 살짝 흐르며 위로)
function spawnTarget() {
  const type = pickType(Math.random());
  const x = 0.15 + Math.random() * 0.7;
  const vx = (Math.random() - 0.5) * 0.06;
  const baseVy = -TARGET_TYPES[type].speed;
  state.targets.push(createTarget({ type, x, vx, vy: baseVy, id: state.nextId++ }));
}

function handlePoint({ x, y }) {
  if (state.phase !== 'playing') return;
  // 종횡비 보정: isHit은 정규화 원-점이므로 short축 기준으로 보정
  // 여기서는 단순화를 위해 가장 가까운 타겟부터 검사
  for (let i = state.targets.length - 1; i >= 0; i--) {
    const t = state.targets[i];
    // x는 가로폭, y는 세로폭 정규화이므로 반경 비교 시 축 보정
    const dx = (x - t.x) * (dims.w / dims.short);
    const dy = (y - t.y) * (dims.h / dims.short);
    if (dx * dx + dy * dy <= t.radius * t.radius) {
      state.score += hitScore(t.type, state.combo);
      state.combo += 1;
      state.effects.push({ x: t.x, y: t.y, kind: 'hit', t: 0 });
      state.targets.splice(i, 1);
      return;
    }
  }
}

function tick(ts) {
  if (state.phase !== 'playing') return;
  if (!state.lastTs) state.lastTs = ts;
  const dtMs = Math.min(50, ts - state.lastTs); // 큰 점프 방지
  state.lastTs = ts;
  const dtSec = dtMs / 1000;
  state.elapsedMs += dtMs;

  // 스폰
  state.spawnTimerMs -= dtMs;
  if (state.spawnTimerMs <= 0) {
    spawnTarget();
    state.spawnTimerMs = spawnInterval(state.elapsedMs);
  }

  // 이동 + 놓침 처리
  const mult = speedMultiplier(state.elapsedMs);
  const next = [];
  for (const t of state.targets) {
    const n = updateTarget(t, dtSec, mult);
    if (n.alive) next.push(n);
    else { state.combo = 0; state.effects.push({ x: n.x, y: 0, kind: 'miss', t: 0 }); }
  }
  state.targets = next;

  // 이펙트 수명
  state.effects = state.effects
    .map((e) => ({ ...e, t: e.t + dtSec * 2.5 }))
    .filter((e) => e.t < 1);

  // 렌더 + HUD
  drawFrame(ctx, dims, state.targets, state.effects);
  const timeLeft = Math.max(0, (GAME_DURATION_MS - state.elapsedMs) / 1000);
  updateHud({ time: timeLeft, score: state.score, combo: comboLabel() });

  if (state.elapsedMs >= GAME_DURATION_MS) return endGame();
  requestAnimationFrame(tick);
}

function comboLabel() {
  // HUD 표시는 배율 단계 기준 (0콤보=1)
  return comboMultiplier(state.combo);
}

function startGame() {
  if (state.phase === 'playing') return;
  if (state.retriesLeft <= 0) return;
  state.retriesLeft -= 1;
  state.phase = 'playing';
  state.targets = [];
  state.effects = [];
  state.score = 0;
  state.combo = 0;
  state.elapsedMs = 0;
  state.spawnTimerMs = 0;
  state.lastTs = 0;
  hideOverlay();
  requestAnimationFrame(tick);
}

function endGame() {
  state.phase = 'over';
  const best = saveBest(storage, state.score);
  showOverlay({
    title: '게임 종료',
    finalScore: state.score,
    best,
    retriesLeft: state.retriesLeft,
    showWebtoonCta: state.retriesLeft <= 0,
  });
}

// 부팅
attachPointer(canvas, handlePoint);
onRetry(startGame);
updateHud({ time: GAME_DURATION_MS / 1000, score: 0, combo: 1 });
setStartMode();
