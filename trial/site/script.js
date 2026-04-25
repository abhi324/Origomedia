/* =========================================================
   ORIGO — Interaction Layer v3
   ========================================================= */

(function () {
  'use strict';

  /* ---------- Helpers ---------- */
  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const lerp = (a, b, n) => a + (b - a) * n;

  /* ---------- Footer year ---------- */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Custom cursor ---------- */
  const cursor     = $('.cursor');
  const cursorRing = $('.cursor-ring');
  const hasFine    = window.matchMedia('(pointer: fine)').matches;

  if (cursor && cursorRing && hasFine) {
    let mx = -100, my = -100;
    let rx = -100, ry = -100;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
      cursor.style.transform = `translate(${mx - 5}px, ${my - 5}px)`;
    });

    const ringLoop = () => {
      rx = lerp(rx, mx, 0.1);
      ry = lerp(ry, my, 0.1);
      cursorRing.style.transform = `translate(${rx - 19}px, ${ry - 19}px)`;
      requestAnimationFrame(ringLoop);
    };
    requestAnimationFrame(ringLoop);

    $$('a, button, [role="button"]').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-expand'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-expand'));
    });
  }

  /* ---------- Scroll progress ---------- */
  const progressBar = $('.scroll-progress');
  const updateProgress = () => {
    if (!progressBar) return;
    const scrolled  = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (maxScroll > 0 ? (scrolled / maxScroll) * 100 : 0) + '%';
  };
  window.addEventListener('scroll', updateProgress, { passive: true });

  /* ---------- Nav: scrolled + mobile toggle ---------- */
  const nav      = $('#nav');
  const toggle   = $('#navToggle');
  const navLinks = $('#navLinks');

  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 12);
    updateProgress();
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (toggle && nav) toggle.addEventListener('click', () => nav.classList.toggle('open'));
  if (navLinks) navLinks.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => nav && nav.classList.remove('open'))
  );

  /* ---------- Reveal on scroll ---------- */
  const revealEls = $$('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ---------- Rotating word (hero) ---------- */
  const rotator = $('#rotator');
  if (rotator) {
    const words = ['craft.', 'ritual.', 'skin.', 'beauty.', 'story.', 'trust.'];
    let i = 0;
    let currentEl = rotator.querySelector('.word');
    const swap = () => {
      i = (i + 1) % words.length;
      const next = document.createElement('span');
      next.className = 'word';
      next.textContent = words[i];
      rotator.appendChild(next);
      requestAnimationFrame(() => {
        next.classList.add('in');
        if (currentEl) currentEl.classList.replace('in', 'out');
      });
      setTimeout(() => {
        if (currentEl && currentEl.parentNode) currentEl.parentNode.removeChild(currentEl);
        currentEl = next;
      }, 700);
    };
    setInterval(swap, 2400);
  }

  /* ---------- Animated counters ---------- */
  const counters = $$('[data-target]');
  if ('IntersectionObserver' in window && counters.length) {
    const countIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target   = parseInt(el.dataset.target, 10);
        const duration = 2000;
        const start    = performance.now();
        const tick = (now) => {
          const elapsed  = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // easeOutExpo
          const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          el.textContent = Math.round(eased * target);
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        countIO.unobserve(el);
      });
    }, { threshold: 0.6 });
    counters.forEach(el => countIO.observe(el));
  }

  /* ---------- Magnetic buttons ---------- */
  if (hasFine) {
    const magnetStrength = 0.28;
    $$('.magnetic').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width  / 2;
        const y = e.clientY - r.top  - r.height / 2;
        btn.style.transform = `translate(${x * magnetStrength}px, ${y * magnetStrength}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
  }

  /* ---------- 3D tilt on cards ---------- */
  if (hasFine) {
    $$('.work-card, .j-card, .pkg').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const r   = card.getBoundingClientRect();
        const x   = (e.clientX - r.left) / r.width  - 0.5;
        const y   = (e.clientY - r.top)  / r.height - 0.5;
        const tX  = x *  8;
        const tY  = y * -8;
        card.style.transform =
          `translateY(-5px) perspective(800px) rotateX(${tY}deg) rotateY(${tX}deg)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  /* ---------- Horizontal rail (work) ---------- */
  const rail = $('#workRail');
  const prev = $('#railPrev');
  const next = $('#railNext');
  if (rail && prev && next) {
    const scrollBy = () => Math.min(rail.clientWidth * 0.8, 560);
    prev.addEventListener('click', () => rail.scrollBy({ left: -scrollBy(), behavior: 'smooth' }));
    next.addEventListener('click', () => rail.scrollBy({ left:  scrollBy(), behavior: 'smooth' }));

    let isDown = false, startX = 0, startLeft = 0;
    rail.addEventListener('mousedown', (e) => {
      isDown = true; startX = e.pageX; startLeft = rail.scrollLeft;
      rail.style.cursor = 'grabbing';
    });
    const stop = () => { isDown = false; rail.style.cursor = ''; };
    rail.addEventListener('mouseleave', stop);
    rail.addEventListener('mouseup', stop);
    rail.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      rail.scrollLeft = startLeft - (e.pageX - startX);
    });
  }

  /* ---------- Parallax blobs on scroll ---------- */
  const blob1 = $('.blob-1');
  const blob2 = $('.blob-2');
  if (blob1 || blob2) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY * 0.18;
      if (blob1) blob1.style.transform = `translateY(${-y}px)`;
      if (blob2) blob2.style.transform = `translateY(${y * 0.6}px)`;
    }, { passive: true });
  }

  /* ---------- Niche image banner: zoom-in on load ---------- */
  $$('.niche-card img, .hero-cinema .hc-bg img').forEach(img => {
    if (img.complete) img.closest('.niche-card, .hero-cinema')?.classList.add('loaded');
    else img.addEventListener('load', () => img.closest('.niche-card, .hero-cinema')?.classList.add('loaded'));
  });

  /* ---------- FAQ accordions ---------- */
  $$('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    if (!q || !a) return;
    q.addEventListener('click', () => {
      const open = item.classList.toggle('open');
      a.style.maxHeight = open ? a.scrollHeight + 'px' : '0';
    });
  });

  /* ---------- Journal filter ---------- */
  const filterBar   = $('#filterBar');
  const journalGrid = $('#journalGrid');
  if (filterBar && journalGrid) {
    filterBar.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-filter]');
      if (!btn) return;
      filterBar.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      journalGrid.querySelectorAll('.j-card').forEach(card => {
        const tag = card.dataset.tag;
        card.style.display = (f === 'all' || tag === f) ? '' : 'none';
      });
    });
  }

  /* ---------- Smooth scroll for in-page links ---------- */
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });

  /* ---------- Toast ---------- */
  const toastEl = $('#toast');
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toastEl.classList.remove('show'), 3200);
  }

  /* ---------- Form handling ---------- */
  function handleForm(formId, storageKey, successMsg) {
    const form = document.getElementById(formId);
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      const data = {};
      new FormData(form).forEach((v, k) => { data[k] = v; });
      data._submittedAt = new Date().toISOString();
      try {
        const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
        existing.push(data);
        localStorage.setItem(storageKey, JSON.stringify(existing));
      } catch (err) { /* non-fatal */ }

      const btn = form.querySelector('button[type="submit"]');
      const original = btn ? btn.innerHTML : '';
      if (btn) { btn.disabled = true; btn.innerHTML = 'Sending…'; }
      setTimeout(() => {
        if (btn) { btn.disabled = false; btn.innerHTML = original; }
        form.reset();
        toast(successMsg);
      }, 600);
    });
  }

  handleForm('joinForm',    'origo_creators',    "Application received. We'll be in touch soon.");
  handleForm('contactForm', 'origo_inquiries',   'Thanks — your note just landed with us.');
  handleForm('newsletter',  'origo_subscribers', "You're on the list. One letter a month.");

})();
