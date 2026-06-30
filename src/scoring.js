// src/scoring.js
import { TARGET_TYPES, COMBO_TABLE, BEST_SCORE_KEY } from './config.js';

export function comboMultiplier(comboCount) {
  const idx = Math.min(Math.max(comboCount, 0), COMBO_TABLE.length - 1);
  return COMBO_TABLE[idx];
}

export function hitScore(targetType, comboCount) {
  const base = TARGET_TYPES[targetType].points;
  return Math.round(base * comboMultiplier(comboCount));
}

export function loadBest(storage) {
  const raw = storage.getItem(BEST_SCORE_KEY);
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) ? n : 0;
}

export function saveBest(storage, score) {
  const current = loadBest(storage);
  if (score > current) {
    storage.setItem(BEST_SCORE_KEY, String(score));
    return score;
  }
  return current;
}
