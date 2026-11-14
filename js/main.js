'use strict';

const ADDRESS = '경기도 파주시 광탄면 쇠장이길 265';
const SWIPE_PX = 50;
const MENU_NOTES = {
  'menu-breakfast': '조식 운영 시간 내 주문 · 가격은 1인 기준',
  'menu-lunch': '중식 운영 시간 내 주문 · 가격은 1인 기준',
};
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ===================================================
// 1. SLIDERS (히어로 · 요리 갤러리 공통)
//    [data-slider] 안에서 data-slide="n" 요소들을 한 번에 켜고 끔
// ===================================================
function initSlider(root) {
  const count = new Set(Array.from(root.querySelectorAll('[data-slide]')).map((el) => el.dataset.slide)).size;
  if (count < 2) return;
  const interval = Number(root.dataset.interval) || 6000;
  const current = root.querySelector('[data-current]');
  let index = 0;
  let timer = null;
  let paused = false;

  // 첫 장 뒤 사진도 미리 불러 넘길 때 비지 않게
  window.addEventListener('load', () => {
    root.querySelectorAll('img[loading="lazy"]').forEach((img) => { img.loading = 'eager'; });
  });

  root.style.setProperty('--interval', `${interval}ms`);

  // 지금 켜진 점의 진행 막대를 처음부터 다시 채움 (다시 넘기기 시작할 때)
  const restartProgress = () => {
    const dot = root.querySelector('[data-go].is-active');
    if (!dot) return;
    dot.classList.remove('is-active');
    void dot.offsetWidth;
    dot.classList.add('is-active');
  };

  // Windows '애니메이션 표시'가 꺼진 PC에서도 자동 넘김 유지
  const schedule = () => {
    clearTimeout(timer);
    if (paused) return;
    timer = setTimeout(() => go(index + 1), interval);
  };

  const go = (next) => {
    index = (next + count) % count;
    root.querySelectorAll('[data-slide]').forEach((el) => {
      const active = Number(el.dataset.slide) === index;
      el.classList.toggle('is-active', active);
      if (el.tagName !== 'IMG') el.setAttribute('aria-hidden', String(!active));
    });
    root.querySelectorAll('[data-go]').forEach((btn) => {
      const active = Number(btn.dataset.go) === index;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-current', active ? 'true' : 'false');
    });
    if (current) current.textContent = String(index + 1).padStart(2, '0');
    schedule();
  };

  const setPaused = (value) => {
    if (paused === value) return;
    paused = value;
    root.classList.toggle('is-paused', value);
    if (value) {
      clearTimeout(timer);
    } else {
      restartProgress();
      schedule();
    }
  };

  root.querySelector('[data-prev]')?.addEventListener('click', () => go(index - 1));
  root.querySelector('[data-next]')?.addEventListener('click', () => go(index + 1));
  root.querySelectorAll('[data-go]').forEach((btn) => btn.addEventListener('click', () => go(Number(btn.dataset.go))));

  // 마우스를 올리면 멈춤 — data-hover-pause가 있으면 그 요소 위에서만
  // (히어로는 화면 전체라 섹션 전체로 잡으면 커서가 늘 그 안에 있어 영영 안 넘어감)
  const pauseZones = root.querySelectorAll('[data-hover-pause]');
  (pauseZones.length ? pauseZones : [root]).forEach((zone) => {
    zone.addEventListener('mouseenter', () => setPaused(true));
    zone.addEventListener('mouseleave', () => setPaused(false));
  });
  // 키보드로 들어왔을 때만 멈춤 (마우스로 화살표를 누른 뒤에도 자동 넘김은 계속)
  root.addEventListener('focusin', (e) => { if (e.target.matches(':focus-visible')) setPaused(true); });
  root.addEventListener('focusout', (e) => { if (!root.contains(e.relatedTarget)) setPaused(false); });
  document.addEventListener('visibilitychange', () => setPaused(document.hidden));
  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') go(index - 1);
    if (e.key === 'ArrowRight') go(index + 1);
  });

  // 밀어서 넘기기 (터치)
  let startX = null;
  root.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') startX = e.clientX; });
  root.addEventListener('pointerup', (e) => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    startX = null;
    if (Math.abs(dx) > SWIPE_PX) go(index + (dx < 0 ? 1 : -1));
  });

  go(0);
}

// ===================================================
// 1-1. 히어로 그릇 — 커서를 따라 살짝 기울고 떠오름
//      마우스가 있는 PC에서만 (Windows '애니메이션 표시'가 꺼져 있어도 동작 — 대표님 지시)
// ===================================================
const TILT_DEG = 12;

function initDishTilt() {
  const dish = document.querySelector('.hero-dish');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!dish || !finePointer) return;
  let frame = 0;

  const setTilt = (x, y) => {
    dish.style.setProperty('--tilt-x', `${(-y * TILT_DEG).toFixed(2)}deg`);
    dish.style.setProperty('--tilt-y', `${(x * TILT_DEG).toFixed(2)}deg`);
    dish.style.setProperty('--glow-x', `${(50 + x * 40).toFixed(1)}%`);
    dish.style.setProperty('--glow-y', `${(50 + y * 40).toFixed(1)}%`);
  };

  dish.addEventListener('pointerenter', () => dish.classList.add('is-hover'));
  dish.addEventListener('pointermove', (e) => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const box = dish.getBoundingClientRect();
      setTilt((e.clientX - box.left) / box.width - 0.5, (e.clientY - box.top) / box.height - 0.5);
    });
  });
  dish.addEventListener('pointerleave', () => {
    cancelAnimationFrame(frame);
    dish.classList.remove('is-hover');
    setTilt(0, 0);
  });
}

// ===================================================
// 2. HEADER (히어로 위 투명 → 흰색)
// ===================================================
function initHeaderScroll() {
  const header = document.getElementById('siteHeader');
  const hero = document.getElementById('hero');
  const floatTop = document.querySelector('.floating-btn--top');
  const onScroll = () => {
    const compact = window.innerWidth <= 900; // 모바일은 내용이 헤더 뒤로 지나가므로 바로 흰색
    const limit = hero && !compact ? hero.offsetHeight - header.offsetHeight - 40 : 10;
    const navOpen = document.getElementById('mainNav').classList.contains('open');
    header.classList.toggle('is-solid', window.scrollY > limit || navOpen);
    if (floatTop) floatTop.classList.toggle('show', window.scrollY > 900);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();
  return onScroll;
}

// ===================================================
// 3. MOBILE NAV
// ===================================================
let refreshHeader = () => {};

function setMobileNav(open) {
  const nav = document.getElementById('mainNav');
  const btn = document.getElementById('btnHamburger');
  nav.classList.toggle('open', open);
  btn.setAttribute('aria-expanded', String(open));
  btn.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
  btn.innerHTML = open
    ? '<i class="fas fa-times" aria-hidden="true"></i>'
    : '<i class="fas fa-bars" aria-hidden="true"></i>';
  refreshHeader();
}

function toggleMobileNav() {
  setMobileNav(!document.getElementById('mainNav').classList.contains('open'));
}

function initMobileNavClose() {
  document.querySelectorAll('.main-nav a').forEach((link) => {
    link.addEventListener('click', () => setMobileNav(false));
  });
}

// ===================================================
// 4. MENU TABS
// ===================================================
function switchMenu(tabEl, panelId) {
  const panel = document.getElementById(panelId);
  if (!panel) return;
  document.querySelectorAll('.menu-tab').forEach((t) => {
    const active = t === tabEl;
    t.classList.toggle('active', active);
    t.setAttribute('aria-selected', String(active));
  });
  document.querySelectorAll('.menu-panel').forEach((p) => p.classList.toggle('active', p === panel));
  const note = document.getElementById('menuNote');
  if (note && MENU_NOTES[panelId]) note.textContent = MENU_NOTES[panelId];
}

/** data-tab 링크(히어로·대표 메뉴)를 누르면 해당 탭을 열고 메뉴로 이동 */
function initTabLinks() {
  document.querySelectorAll('[data-tab]').forEach((link) => {
    link.addEventListener('click', () => {
      const panelId = link.getAttribute('data-tab');
      const tab = document.querySelector(`.menu-tab[aria-controls="${panelId}"]`);
      if (tab) switchMenu(tab, panelId);
    });
  });
}

// ===================================================
// 6. SCROLL TO TOP / ACTIVE NAV
// ===================================================
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
}

function initActiveNavScroll() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');
  const onScroll = () => {
    let currentId = '';
    sections.forEach((section) => {
      if (window.scrollY >= section.offsetTop - 120) currentId = '#' + section.id;
    });
    navLinks.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === currentId));
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ===================================================
// 7. MAP POPUP & NATIVE APPS
// ===================================================
function openMapPopup() {
  const popup = document.getElementById('mapPopup');
  if (!popup) return;
  popup.classList.add('show');
  document.body.style.overflow = 'hidden';
  popup.querySelector('.map-popup-close')?.focus();
}

function closeMapPopup(evt) {
  const popup = document.getElementById('mapPopup');
  if (!popup || !popup.classList.contains('show')) return;
  if (evt && evt.target && evt.target !== popup) return;
  popup.classList.remove('show');
  document.body.style.overflow = '';
}

function copyAddress() {
  if (!navigator.clipboard) {
    showToast('복사 기능을 지원하지 않는 브라우저입니다.');
    return;
  }
  navigator.clipboard.writeText(ADDRESS)
    .then(() => showToast('주소가 복사되었습니다.'))
    .catch(() => showToast('주소 복사에 실패했습니다.'));
}

function initMapAppLinks() {
  document.querySelectorAll('.btn-map-app').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const appUrl = btn.getAttribute('data-app');
      const webUrl = btn.getAttribute('data-web');
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        window.location.href = appUrl; // 앱 호출 → 없으면 웹 지도
        setTimeout(() => { if (!document.hidden) window.open(webUrl, '_blank', 'noopener'); }, 1500);
      } else {
        window.open(webUrl, '_blank', 'noopener');
      }
    });
  });
}

// ===================================================
// TOAST
// ===================================================
let toastTimer = null;
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ===================================================
// INIT
// ===================================================
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-slider]').forEach(initSlider);
  initDishTilt();
  refreshHeader = initHeaderScroll();
  initMobileNavClose();
  initTabLinks();
  initActiveNavScroll();
  initMapAppLinks();
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMapPopup();
      setMobileNav(false);
    }
  });
});
