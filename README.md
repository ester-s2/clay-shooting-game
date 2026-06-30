# 클레이사격 슈팅게임 (데모)

허공에 떠오르는 도형을 탭/클릭으로 맞춰 60초간 점수를 겨루는 웹 미니게임 데모.

## 실행
정적 파일이라 빌드가 필요 없습니다.
```bash
python3 -m http.server 8000
# http://localhost:8000/ 접속
```

## 테스트
```bash
npm test
```

## 구조
- `src/config.js` — 게임 상수
- `src/scoring.js` / `difficulty.js` / `target.js` — 순수 로직 (테스트 대상)
- `src/input.js` / `render.js` / `ui.js` — 브라우저 어댑터
- `src/game.js` — 게임 루프·상태머신

## 향후 작업 (데모 범위 밖)
- 추상 도형 → 웹툰 에셋 교체
- 웹툰 열람 시 추가 리트라이 지급 (현재 CTA 자리만 존재)
- 점수 공유, 사운드, 서버 랭킹
