'use strict';

// ===================================================
// 1. HERO SLIDER
// ===================================================
let currentSlide = 0;
let slideTimer   = null;
const SLIDE_INTERVAL = 5000;

function initHeroSlider() {
  startSlideTimer();
}

function startSlideTimer() {
  clearInterval(slideTimer);
  slideTimer = setInterval(() => moveSlide(1), SLIDE_INTERVAL);
}

function moveSlide(dir) {
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.hero-dot');
  if (!slides.length) return;
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = (currentSlide + dir + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
  startSlideTimer();
}

function goSlide(idx) {
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.hero-dot');
  if (!slides.length) return;
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = idx;
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
  startSlideTimer();
}

// ===================================================
// 2. HEADER SCROLL EFFECT
// ===================================================
function initHeaderScroll() {
  const header   = document.getElementById('siteHeader');
  const floatTop = document.querySelector('.floating-btn--top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
      floatTop && floatTop.classList.add('show');
    } else {
      header.classList.remove('scrolled');
      floatTop && floatTop.classList.remove('show');
    }
  }, { passive: true });
}

// ===================================================
// 3. MOBILE NAV
// ===================================================
function toggleMobileNav() {
  const nav = document.getElementById('mainNav');
  const btn = document.getElementById('btnHamburger');
  nav.classList.toggle('open');
  btn.classList.toggle('open');
}

function initMobileNavClose() {
  document.querySelectorAll('.main-nav a').forEach(link => {
    link.addEventListener('click', () => {
      document.getElementById('mainNav').classList.remove('open');
      document.getElementById('btnHamburger').classList.remove('open');
    });
  });
}

// ===================================================
// 4. MENU TAB SWITCHER
// ===================================================
function switchMenu(tabEl, panelId) {
  document.querySelectorAll('.menu-tab').forEach(t => t.classList.remove('active'));
  tabEl.classList.add('active');
  document.querySelectorAll('.menu-panel').forEach(p => p.classList.remove('active'));
  const panel = document.getElementById(panelId);
  if (panel) panel.classList.add('active');
}

// ===================================================
// 5. SCROLL TO TOP
// ===================================================
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===================================================
// 6. SCROLL REVEAL ANIMATION
// ===================================================
function initScrollReveal() {
  const targets = document.querySelectorAll(
    '.promo-card, .menu-card, .snack-card, .quick-info-item'
  );
  targets.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity .5s ease, transform .5s ease';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const allTargets = Array.from(targets);
        const idx = allTargets.indexOf(entry.target) % 6;
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'none';
        }, 80 * idx);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(el => observer.observe(el));
}

// ===================================================
// 7. ACTIVE NAV LINK ON SCROLL
// ===================================================
function initActiveNavScroll() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 140) {
        current = '#' + section.id;
      }
    });
    navLinks.forEach(link => {
      link.style.color = '';
      link.style.fontWeight = '';
      if (link.getAttribute('href') === current) {
        link.style.color = 'var(--green-main)';
        link.style.fontWeight = '700';
      }
    });
  }, { passive: true });
}

// ===================================================
// TOAST (간단 알림 - 필요 시 사용)
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
  initHeroSlider();
  initHeaderScroll();
  initMobileNavClose();
  initScrollReveal();
  initActiveNavScroll();
  console.log('🍽️ North Farm CC - F&B 식음팀 페이지 로드 완료');
});
