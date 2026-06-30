// src/difficulty.js
import { DIFFICULTY } from './config.js';

export function spawnInterval(elapsedMs) {
  const sec = elapsedMs / 1000;
  // 매초 25ms씩 빨라지되 하한 적용
  const interval = DIFFICULTY.baseSpawnIntervalMs - sec * 25;
  return Math.max(DIFFICULTY.minSpawnIntervalMs, interval);
}

export function speedMultiplier(elapsedMs) {
  const sec = elapsedMs / 1000;
  return 1 + sec * DIFFICULTY.speedRampPerSec;
}
