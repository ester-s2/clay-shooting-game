// src/input.js
// pointerdown 위치를 캔버스 기준 0~1 좌표로 변환해 콜백
export function attachPointer(canvas, onPoint) {
  const handler = (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    onPoint({ x, y });
  };
  canvas.addEventListener('pointerdown', handler);
  return () => canvas.removeEventListener('pointerdown', handler);
}
