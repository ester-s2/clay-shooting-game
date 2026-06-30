// src/render.js
const COLORS = { big: '#5b8cff', medium: '#4dd2a0', small: '#ff7eb6' };

// 캔버스 backing store를 화면 크기 * DPR로 맞춤. 정규화 좌표 변환용 dims 반환.
export function resizeCanvas(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { w, h, short: Math.min(w, h) };
}

// targets: target.js의 객체 배열, effects: {x,y,kind:'hit'|'miss',t} 배열 (t=0~1 수명비)
export function drawFrame(ctx, dims, targets, effects) {
  ctx.clearRect(0, 0, dims.w, dims.h);
  for (const t of targets) {
    const cx = t.x * dims.w;
    const cy = t.y * dims.h;
    const r = t.radius * dims.short;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = COLORS[t.type] || '#fff';
    ctx.fill();
    ctx.lineWidth = Math.max(2, r * 0.12);
    ctx.strokeStyle = 'rgba(255,255,255,.85)';
    ctx.stroke();
  }
  for (const e of effects) {
    const cx = e.x * dims.w;
    const cy = e.y * dims.h;
    const r = (0.02 + e.t * 0.05) * dims.short;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = e.kind === 'hit'
      ? `rgba(255,211,77,${1 - e.t})`
      : `rgba(255,90,90,${1 - e.t})`;
    ctx.lineWidth = 3;
    ctx.stroke();
  }
}
