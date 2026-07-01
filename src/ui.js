// src/ui.js
const $ = (id) => document.getElementById(id);

export function updateHud({ time, score, combo, lives }) {
  $('hud-lives').textContent = `남은 기회 ${lives}회`;
  $('hud-score').textContent = String(score);
  $('hud-time').textContent = String(Math.ceil(time));
  $('hud-combo').textContent = 'x' + combo;
}

// 게임 시작 전 초기 상태(시작 버튼)
export function setStartMode() {
  $('overlay-title').textContent = '클레이사격';
  $('overlay-final').textContent = '도형을 탭/클릭해서 맞추세요!';
  $('overlay-best').textContent = '';
  $('btn-retry').textContent = '시작하기';
  $('retry-count').textContent = '';
  $('btn-webtoon').classList.add('hidden');
  $('overlay').classList.remove('hidden');
}

export function showOverlay({ title, finalScore, best, retriesLeft, showWebtoonCta }) {
  $('overlay-title').textContent = title;
  $('overlay-final').textContent = `점수: ${finalScore}`;
  $('overlay-best').textContent = `최고 기록: ${best}`;
  const btn = $('btn-retry');
  if (retriesLeft > 0) {
    btn.textContent = '다시하기';
    btn.classList.remove('hidden');
    $('retry-count').textContent = `남은 기회: ${retriesLeft}회`;
  } else {
    btn.classList.add('hidden');
    $('retry-count').textContent = '기회를 모두 사용했어요';
  }
  // 웹툰 CTA: 자리/문구만 (data-stub, 동작 없음)
  $('btn-webtoon').classList.toggle('hidden', !showWebtoonCta);
  $('overlay').classList.remove('hidden');
}

export function hideOverlay() {
  $('overlay').classList.add('hidden');
}

export function onRetry(handler) {
  $('btn-retry').addEventListener('click', handler);
}
