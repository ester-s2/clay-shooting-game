// src/config.js
export const GAME_DURATION_MS = 30000;
export const MAX_RETRIES = 5;
export const BEST_SCORE_KEY = 'clayshoot.best';

// radius/speed는 캔버스 짧은 변 기준 정규화(0~1) 비율
export const TARGET_TYPES = {
  big:    { radius: 0.075, speed: 0.18, points: 10 },
  medium: { radius: 0.050, speed: 0.28, points: 20 },
  small:  { radius: 0.032, speed: 0.42, points: 40 },
};

// 콤보 단계별 점수 배율. 단계는 0부터, 초과 시 마지막 값 유지
export const COMBO_TABLE = [1, 1.5, 2, 2.5, 3];

export const DIFFICULTY = {
  baseSpawnIntervalMs: 700,   // 시작 시 스폰 간격 (30초판: 초반부터 몰입되게 조밀)
  minSpawnIntervalMs: 350,    // 가장 빨라졌을 때 하한
  spawnRampPerSec: 30,        // 초당 스폰 간격 단축량(ms) → 약 12초에 최소 간격 도달
  speedRampPerSec: 0.024,     // 초당 속도 배율 증가량 → 30초 시점 약 1.7배
};
