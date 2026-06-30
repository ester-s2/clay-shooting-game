// src/target.js
import { TARGET_TYPES } from './config.js';

const SPAWN_Y = 1.05;   // 화면 아래
const KILL_Y = -0.1;    // 화면 위로 벗어남

export function createTarget({ type, x, vx, vy, id }) {
  return {
    id, type, x, y: SPAWN_Y, vx, vy,
    radius: TARGET_TYPES[type].radius,
    alive: true,
  };
}

export function updateTarget(target, dtSec, speedMult) {
  const x = target.x + target.vx * dtSec * speedMult;
  const y = target.y + target.vy * dtSec * speedMult;
  const alive = target.alive && y > KILL_Y;
  return { ...target, x, y, alive };
}

export function isHit(target, px, py) {
  const dx = px - target.x;
  const dy = py - target.y;
  return dx * dx + dy * dy <= target.radius * target.radius;
}

export function pickType(rand) {
  if (rand < 0.5) return 'big';
  if (rand < 0.85) return 'medium';
  return 'small';
}
