/* 
   PRAKASH AIR CONDITIONERS — interaction layer
    */
(function(){
  "use strict";

  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 
     THEME (dark / light) — persists via localStorage
   */
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('pac-theme');
  if (savedTheme) root.setAttribute('data-theme', savedTheme);

  themeToggle?.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    localStorage.setItem('pac-theme', next);
  });

  /* 
     PRELOADER
   */
  const preloader = document.getElementById('preloader');
  const preloaderFill = document.getElementById('preloaderFill');
  let progress = 0;
  const loadTimer = setInterval(() => {
    progress += Math.random() * 18;
    if (progress > 96) progress = 96;
    if (preloaderFill) preloaderFill.style.width = progress + '%';
  }, 140);

  window.addEventListener('load', () => {
    clearInterval(loadTimer);
    if (preloaderFill) preloaderFill.style.width = '100%';
    setTimeout(() => {
      preloader?.classList.add('is-done');
      document.body.style.overflow = '';
      playHeroIntro();
    }, 420);
  });
  // safety fallback in case 'load' is delayed by heavy assets
  setTimeout(() => { if (!preloader?.classList.contains('is-done')) { clearInterval(loadTimer); preloader?.classList.add('is-done'); playHeroIntro(); } }, 3200);

  /* 
     NAV — scrolled state + mobile burger + progress rail
   */
  const siteNav = document.getElementById('siteNav');
  const railFill = document.getElementById('scrollRailFill');
  const navBurger = document.getElementById('navBurger');
  const navLinks = document.getElementById('navLinks');

  function onScroll(){
    const y = window.scrollY;
    siteNav?.classList.toggle('is-scrolled', y > 40);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (railFill) railFill.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
  }
  window.addEventListener('scroll', onScroll, { passive:true });
  onScroll();

  navBurger?.addEventListener('click', () => {
    const open = navLinks.classList.toggle('is-open');
    if (open){
      Object.assign(navLinks.style, { display:'flex', flexDirection:'column', position:'fixed', top:'72px', left:'0', right:'0', background:'var(--bg)', padding:'26px 24px', borderBottom:'1px solid var(--line)' });
    } else {
      navLinks.removeAttribute('style');
    }
  });
  navLinks?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    if (navLinks.classList.contains('is-open')){ navLinks.classList.remove('is-open'); navLinks.removeAttribute('style'); }
  }));

  /* 
     CUSTOM CURSOR
   */
  const cursor = document.querySelector('.cursor-dot');
  if (cursor && matchMedia('(hover:hover) and (pointer:fine)').matches){
    let cx=0, cy=0, tx=0, ty=0;
    window.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; cursor.style.opacity = '1'; });
    (function loop(){
      cx += (tx-cx) * .18; cy += (ty-cy) * .18;
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll('a, button, .product-visual').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.style.width = cursor.style.height = '38px');
      el.addEventListener('mouseleave', () => cursor.style.width = cursor.style.height = '16px');
    });
  }

  /* 
     HERO — atmospheric airflow particle canvas
   */
  const canvas = document.getElementById('airCanvas');
  if (canvas && !reduceMotion){
    const ctx = canvas.getContext('2d');
    let w, h, particles = [];
    const COUNT = window.innerWidth < 760 ? 34 : 70;

    function resize(){
      w = canvas.width = canvas.offsetWidth * devicePixelRatio;
      h = canvas.height = canvas.offsetHeight * devicePixelRatio;
    }
    function makeParticle(){
      return {
        x: Math.random()*w,
        y: Math.random()*h,
        r: (Math.random()*1.6+.4) * devicePixelRatio,
        vx: (Math.random()*.35+.05) * devicePixelRatio,
        vy: (Math.random()-.5) * .12 * devicePixelRatio,
        o: Math.random()*.4+.08
      };
    }
    function init(){
      resize();
      particles = Array.from({length:COUNT}, makeParticle);
    }
    function tick(){
      ctx.clearRect(0,0,w,h);
      const accent = getComputedStyle(root).getPropertyValue('--mist').trim() || '#9db8c4';
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x > w + 10){ p.x = -10; p.y = Math.random()*h; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fillStyle = hexToRgba(accent, p.o);
        ctx.fill();
      });
      requestAnimationFrame(tick);
    }
    function hexToRgba(hex, alpha){
      hex = hex.trim();
      let r=157,g=184,b=196;
      if (hex[0] === '#'){
        const h2 = hex.length === 4
          ? hex.slice(1).split('').map(c=>c+c).join('')
          : hex.slice(1);
        r = parseInt(h2.substring(0,2),16); g = parseInt(h2.substring(2,4),16); b = parseInt(h2.substring(4,6),16);
      }
      return `rgba(${r},${g},${b},${alpha})`;
    }
    window.addEventListener('resize', resize);
    init(); tick();
  }

  /* 
     HERO INTRO — signature reveal + word-by-word eyebrow + tagline
   */
  function playHeroIntro(){
    document.querySelectorAll('.hero-eyebrow span').forEach((s,i) => {
      s.style.transition = `transform .9s cubic-bezier(.16,.84,.3,1) ${i*.02}s`;
      requestAnimationFrame(()=> s.style.transform = 'translateY(0)');
    });

    const lines = document.querySelectorAll('.sig-line');
    lines.forEach((line, i) => {
      line.style.transform = 'translateY(115%)';
      line.style.transition = `transform 1.1s cubic-bezier(.16,.84,.3,1) ${0.25 + i*.14}s`;
      requestAnimationFrame(()=> requestAnimationFrame(()=> line.style.transform = 'translateY(0)'));
    });

    const tagline = document.getElementById('heroTagline');
    if (tagline){
      tagline.style.opacity = 0;
      tagline.style.transform = 'translateY(10px)';
      tagline.style.transition = 'opacity 1s ease .9s, transform 1s cubic-bezier(.16,.84,.3,1) .9s';
      requestAnimationFrame(()=> requestAnimationFrame(()=> { tagline.style.opacity = 1; tagline.style.transform='translateY(0)'; }));
    }

    document.querySelectorAll('.hero .reveal-fade').forEach((el,i) => {
      el.style.transition = `opacity .9s ease ${1.2+i*.1}s, transform .9s cubic-bezier(.16,.84,.3,1) ${1.2+i*.1}s`;
      requestAnimationFrame(()=> requestAnimationFrame(()=> { el.style.opacity = 1; el.style.transform = 'translateY(0)'; }));
    });
  }

  /* 
     TEXT SCRAMBLE / DECODE — used on product names as they enter view
   */
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890#$%&';
  function scrambleInto(el, finalText){
    if (el.dataset.scrambled === 'true') return;
    el.dataset.scrambled = 'true';
    if (reduceMotion){ el.textContent = finalText; return; }
    const len = finalText.length;
    let frame = 0;
    const totalFrames = 26;
    function render(){
      let out = '';
      for (let i=0;i<len;i++){
        const ch = finalText[i];
        if (ch === ' '){ out += ' '; continue; }
        const revealAt = (i/len) * totalFrames * .7;
        if (frame >= revealAt + 8){
          out += ch;
        } else if (frame >= revealAt){
          out += CHARS[Math.floor(Math.random()*CHARS.length)];
        } else {
          out += '';
        }
      }
      el.textContent = out;
      frame++;
      if (frame <= totalFrames + 10){
        requestAnimationFrame(render);
      } else {
        el.textContent = finalText;
      }
    }
    render();
  }

  /* 
     STATEMENT — word opacity wash on scroll
   */
  const statementWords = document.querySelectorAll('.statement .sw');
  if (statementWords.length){
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          statementWords.forEach((w,i) => setTimeout(()=> w.style.opacity = 1, i*40));
          io.disconnect();
        }
      });
    }, { threshold:.5 });
    io.observe(document.querySelector('.statement'));
  }

  /* 
     GENERIC REVEAL — cards, features, service photos
   */
  const revealEls = document.querySelectorAll('[data-reveal]');
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        const el = entry.target;
        const delay = (parseInt(el.dataset.i || '0', 10)) * 60;
        setTimeout(() => { el.style.transition = 'opacity .9s cubic-bezier(.16,.84,.3,1), transform .9s cubic-bezier(.16,.84,.3,1)'; el.style.opacity = 1; el.style.transform = 'translateY(0)'; }, delay);
        revealIO.unobserve(el);
      }
    });
  }, { threshold:.15, rootMargin:'0px 0px -60px 0px' });
  revealEls.forEach((el,i) => { el.dataset.i = i % 8; revealIO.observe(el); });

  /* 
     PRODUCT STAGES — visual + copy reveal, lazy model-viewer load, decode name
   */
  const stages = document.querySelectorAll('.product-stage');
  const stageIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const stage = entry.target;
      const visual = stage.querySelector('.product-visual');
      const copy = stage.querySelector('.product-copy');
      const flow = stage.querySelector('.system-flow');
      const mv = stage.querySelector('model-viewer');
      const nameEl = stage.querySelector('.product-name');

      if (entry.isIntersecting){
        // lazy-load the GLB only once, the moment its stage approaches
        if (mv && !mv.getAttribute('src')){
          const src = mv.dataset.src;
          mv.setAttribute('src', src);
          mv.setAttribute('reveal', 'auto');
        }
        visual.style.transition = 'opacity 1.1s cubic-bezier(.16,.84,.3,1), transform 1.1s cubic-bezier(.16,.84,.3,1)';
        visual.style.opacity = 1;
        visual.style.transform = 'translateY(0) scale(1)';

        copy.style.transition = 'opacity 1s cubic-bezier(.16,.84,.3,1) .18s, transform 1s cubic-bezier(.16,.84,.3,1) .18s';
        copy.style.opacity = 1;
        copy.style.transform = 'translateY(0)';

        if (flow){
          flow.style.transition = 'opacity 1s ease .4s, transform 1s cubic-bezier(.16,.84,.3,1) .4s';
          flow.style.opacity = 1;
          flow.style.transform = 'translateY(0)';
        }

        if (nameEl && nameEl.dataset.decode){
          setTimeout(() => scrambleInto(nameEl, nameEl.dataset.decode), 260);
        }
      }
    });
  }, { threshold:.28 });
  stages.forEach(s => stageIO.observe(s));

  /* subtle cursor-driven parallax on each product-visual (desktop only) */
  if (matchMedia('(hover:hover) and (pointer:fine)').matches && !reduceMotion){
    document.querySelectorAll('.product-visual').forEach(visual => {
      let rx = 0, ry = 0, tx2 = 0, ty2 = 0;
      visual.addEventListener('mousemove', (e) => {
        const rect = visual.getBoundingClientRect();
        tx2 = ((e.clientX - rect.left) / rect.width - .5) * 10;
        ty2 = ((e.clientY - rect.top) / rect.height - .5) * -10;
      });
      visual.addEventListener('mouseleave', () => { tx2 = 0; ty2 = 0; });
      (function loop(){
        rx += (tx2-rx) * .06; ry += (ty2-ry) * .06;
        visual.style.setProperty('--tiltX', ry.toFixed(2)+'deg');
        visual.style.setProperty('--tiltY', rx.toFixed(2)+'deg');
        requestAnimationFrame(loop);
      })();
    });
  }

  /* 
     FINAL HEADLINE — word rise-in
   */
  const finalWords = document.querySelectorAll('.final-headline .fw');
  if (finalWords.length){
    finalWords.forEach(w => { w.innerHTML = `<span>${w.textContent}</span>`; w.querySelector('span').style.transform = 'translateY(115%)'; w.querySelector('span').style.display='inline-block'; });
    const fio = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          finalWords.forEach((w,i) => {
            const s = w.querySelector('span');
            s.style.transition = `transform .9s cubic-bezier(.16,.84,.3,1) ${i*.08}s`;
            requestAnimationFrame(()=> s.style.transform = 'translateY(0)');
          });
          fio.disconnect();
        }
      });
    }, { threshold:.4 });
    fio.observe(document.querySelector('.final-headline'));
  }

  /* 
     RIPPLE — responsive press animation on any [data-ripple] element
   */
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-ripple]');
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.4;
    const dot = document.createElement('span');
    dot.className = 'ripple-dot';
    dot.style.width = dot.style.height = size + 'px';
    dot.style.left = (e.clientX - rect.left - size/2) + 'px';
    dot.style.top = (e.clientY - rect.top - size/2) + 'px';
    el.appendChild(dot);
    setTimeout(() => dot.remove(), 650);
  });

  /* 
     COUNT-UP — hero stats + turnover values, triggered once on reveal
   */
  function animateCount(el){
    if (el.dataset.counted === 'true') return;
    el.dataset.counted = 'true';
    const to = parseFloat(el.dataset.countTo || '0');
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    if (reduceMotion){ el.textContent = prefix + to.toFixed(decimals) + suffix; return; }
    const dur = 1400;
    const start = performance.now();
    function frame(now){
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = to * eased;
      el.textContent = prefix + val.toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(frame);
      else el.textContent = prefix + to.toFixed(decimals) + suffix;
    }
    requestAnimationFrame(frame);
  }
  const countEls = document.querySelectorAll('[data-count-to]');
  if (countEls.length){
    const countIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) animateCount(entry.target); });
    }, { threshold:.6 });
    countEls.forEach(el => countIO.observe(el));
  }

  /* 
     TURNOVER CHART — bars grow into view once
   */
  const turnoverBars = document.querySelectorAll('.turnover-bar');
  if (turnoverBars.length){
    const barIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          const bar = entry.target;
          const to = bar.dataset.growTo || '0';
          requestAnimationFrame(() => { bar.style.height = to + '%'; });
          barIO.unobserve(bar);
        }
      });
    }, { threshold:.3 });
    turnoverBars.forEach(b => barIO.observe(b));
  }

  /* 
     CONTACT FORM 
   */
  const contactForm = document.getElementById('contactForm');
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('cf-name')?.value.trim() || '';
    const phone = document.getElementById('cf-phone')?.value.trim() || '';
    const type = document.getElementById('cf-type')?.value || '';
    const email = document.getElementById('cf-email')?.value.trim() || '';
    const message = document.getElementById('cf-message')?.value.trim() || '';

    if (!name || !phone || !type || !email){
      contactForm.reportValidity();
      return;
    }

    const subject = `New ${type} Request — ${name}`;
    const bodyLines = [
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Request type: ${type}`,
      `Reply-to email: ${email}`,
      '',
      message ? `Message: ${message}` : ''
    ].filter(Boolean);

    const mailto = `mailto:prakashairconditioners@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join('\n'))}`;
    window.location.href = mailto;
  });

  /* 
     FOOTER YEAR
   */
  const yearEl = document.getElementById('yearNow');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* lock scroll until preloader clears (avoids jump-scroll during load) */
  document.body.style.overflow = 'hidden';

})();
