// NP Sales PWA Service Worker
// 1775715729183 는 build.js가 빌드 시점마다 교체 → 브라우저가 새 SW 감지
const CACHE = 'np-sales-1775715729183';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
  './icon-192.png',
  './icon-512.png',
];

// 설치 — 핵심 파일 선 캐싱
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS).catch(() => {}))
  );
  // 즉시 활성화 (대기 없이 새 버전 적용)
  self.skipWaiting();
});

// 활성화 — 구버전 캐시 전부 삭제
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  // 즉시 모든 클라이언트(탭) 제어권 획득
  self.clients.claim();
});

// 요청 처리
// - index.html(navigate): Network First → 항상 최신 HTML
// - 나머지: Cache First → 오프라인 지원
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  const isNavigate = e.request.mode === 'navigate';

  if (isNavigate) {
    // 네트워크 우선: 새 버전이 있으면 즉시 반영
    e.respondWith(
      fetch(e.request)
        .then(res => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE).then(c => c.put(e.request, clone));
          }
          return res;
        })
        .catch(() => caches.match('./index.html'))
    );
  } else {
    // 캐시 우선: 아이콘·manifest 등 정적 파일
    e.respondWith(
      caches.match(e.request).then(cached => {
        if (cached) return cached;
        return fetch(e.request).then(res => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE).then(c => c.put(e.request, clone));
          }
          return res;
        });
      })
    );
  }
});
