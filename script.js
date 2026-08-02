/* ============================================================
   BLOOMLINE — LUXURY FASHION E-COMMERCE
   Modern JS — Interactions, Animations & UI Logic
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initLoader();
  initCursor();
  initNav();
  initMobileMenu();
  initScrollReveal();
  initHeroParallax();
  initMagneticBtns();
  initFilterTabs();
  initWishlistBtns();
  initNewsletterForm();
  initAuthModal();
});

/* ============================================================
   THEME
   ============================================================ */
function initTheme() {
  const btn  = document.getElementById('theme-toggle');
  const root = document.documentElement;
  const saved = localStorage.getItem('bloomline-theme') || 'dark';
  applyTheme(saved);

  btn.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('bloomline-theme', next);
  });

  function applyTheme(t) {
    root.dataset.theme = t;
    btn.setAttribute('aria-checked', t === 'dark');
  }
}

/* ============================================================
   LOADER
   ============================================================ */
function initLoader() {
  const loader = document.getElementById('loader');
  const bar    = document.getElementById('loader-bar');
  const count  = document.getElementById('loader-count');
  if (!loader) return;

  document.body.style.overflow = 'hidden';

  let p = 0;
  const tick = setInterval(() => {
    // natural ease-out acceleration
    p += (100 - p) * 0.045 + 0.3;
    if (p >= 100) { p = 100; clearInterval(tick); finish(); }
    bar.style.width   = p + '%';
    count.textContent = Math.floor(p);
  }, 28);

  function finish() {
    bar.style.width   = '100%';
    count.textContent = '100';
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
      triggerHero();
    }, 360);
  }
}

/* ============================================================
   HERO REVEAL (after loader)
   ============================================================ */
let heroFired = false;

function triggerHero() {
  if (heroFired) return;
  heroFired = true;

  // Eyebrow
  const ey = document.getElementById('hero-eyebrow');
  if (ey) setTimeout(() => ey.classList.add('show'), 80);

  // Headline lines with stagger
  ['hl1','hl2','hl3'].forEach((id, i) => {
    const el = document.getElementById(id);
    if (el) setTimeout(() => el.classList.add('show'), 220 + i * 160);
  });

  // Sub, CTA, Stats
  const sub   = document.getElementById('hero-sub');
  const cta   = document.getElementById('hero-cta');
  const stats = document.getElementById('hero-stats');
  const badge = document.getElementById('hero-badge');

  if (sub)   setTimeout(() => sub.classList.add('show'),   580);
  if (cta)   setTimeout(() => cta.classList.add('show'),   780);
  if (stats) setTimeout(() => stats.classList.add('show'), 1000);
  if (badge) setTimeout(() => badge.classList.add('show'), 1300);

  // Image zoom-out on load
  const img = document.getElementById('hero-main-img');
  if (img) {
    if (img.complete) img.classList.add('loaded');
    else img.addEventListener('load', () => img.classList.add('loaded'));
  }

  // Initialize interactive canvas lines
  initHeroCanvas();
}

// Fallback if loader skipped
window.addEventListener('load', () => setTimeout(triggerHero, 2600));

/* ============================================================
   CUSTOM CURSOR
   ============================================================ */
function initCursor() {
  const c = document.getElementById('cursor');
  const f = document.getElementById('cursor-follower');
  if (!c || !f) return;
  if (window.matchMedia('(pointer:coarse)').matches) return;

  let mx = 0, my = 0, fx = 0, fy = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    c.style.left = mx + 'px'; c.style.top = my + 'px';
  });

  (function loop() {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    f.style.left = fx + 'px'; f.style.top = fy + 'px';
    requestAnimationFrame(loop);
  })();

  // Hover state
  document.querySelectorAll('a,button,.product-card,.cat-card,.lb-item,.theme-btn').forEach(el => {
    el.addEventListener('mouseenter', () => { c.classList.add('hovering'); f.classList.add('hovering'); });
    el.addEventListener('mouseleave', () => { c.classList.remove('hovering'); f.classList.remove('hovering'); });
  });

  document.addEventListener('mouseleave',  () => { c.style.opacity='0'; f.style.opacity='0'; });
  document.addEventListener('mouseenter',  () => { c.style.opacity='1'; f.style.opacity='.6'; });
  document.addEventListener('mousedown',   () => c.style.transform='translate(-50%,-50%) scale(.7)');
  document.addEventListener('mouseup',     () => c.style.transform='translate(-50%,-50%) scale(1)');
}

/* ============================================================
   NAV — scroll + active section
   ============================================================ */
function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 55);
  }, { passive: true });

  // Active link tracking
  const sections = [...document.querySelectorAll('section[id]')];
  const links    = [...document.querySelectorAll('.nav-links a')];

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id);
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => obs.observe(s));
}

/* ============================================================
   MOBILE MENU
   ============================================================ */
function initMobileMenu() {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  let open = false;

  function toggle() {
    open = !open;
    btn.classList.toggle('open', open);
    menu.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  btn.addEventListener('click', toggle);
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { if(open) toggle(); }));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && open) toggle(); });
}

/* ============================================================
   SCROLL REVEAL — IntersectionObserver
   ============================================================ */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-l, .reveal-r');

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('vis');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });

  els.forEach(el => obs.observe(el));
}

/* ============================================================
   HERO PARALLAX
   ============================================================ */
function initHeroParallax() {
  if (window.matchMedia('(max-width:768px)').matches) return;

  const img = document.getElementById('hero-main-img');
  if (!img) return;

  let tick = false;
  window.addEventListener('scroll', () => {
    if (!tick) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y < window.innerHeight) {
          img.style.transform = `scale(${img.classList.contains('loaded') ? 1 : 1.05}) translateY(${y * 0.22}px)`;
        }
        tick = false;
      });
      tick = true;
    }
  }, { passive: true });
}

/* ============================================================
   MAGNETIC BUTTONS
   ============================================================ */
function initMagneticBtns() {
  if (window.matchMedia('(pointer:coarse)').matches) return;

  document.querySelectorAll('.btn-primary, .btn-ghost, #lookbook-btn').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width  / 2) * .25;
      const y = (e.clientY - r.top  - r.height / 2) * .25;
      el.style.transform = `translate(${x}px,${y}px)`;
    });
    el.addEventListener('mouseleave', () => el.style.transform = '');
  });
}

/* ============================================================
   FILTER TABS
   ============================================================ */
function initFilterTabs() {
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab').forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-pressed', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-pressed', 'true');
    });
  });
}

/* ============================================================
   WISHLIST TOGGLE
   ============================================================ */
function initWishlistBtns() {
  document.querySelectorAll('.product-wish').forEach(btn => {
    let active = false;
    const svg = btn.querySelector('svg');
    btn.addEventListener('click', () => {
      active = !active;
      svg.style.fill   = active ? 'var(--accent)' : '';
      svg.style.stroke = active ? 'var(--accent)' : 'var(--text-primary)';
      btn.setAttribute('aria-pressed', active);
      // bounce
      btn.style.transform = 'scale(1.3)';
      setTimeout(() => btn.style.transform = '', 200);
    });
  });
}

/* ============================================================
   SMOOTH SCROLL
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const el = document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    const offset = (document.getElementById('nav')?.offsetHeight || 70);
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
  });
});

/* ============================================================
   NEWSLETTER FORM
   ============================================================ */
function initNewsletterForm() {
  const form  = document.getElementById('nl-form');
  const input = document.getElementById('nl-email');
  const btn   = document.getElementById('nl-submit');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const v = input.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
      input.style.borderColor = '#d9534f';
      shake(input); return;
    }
    input.style.borderColor = '';
    btn.textContent = '✓ Subscribed';
    btn.style.background = '#2d6a4f';
    btn.style.borderColor = '#2d6a4f';
    btn.style.color = '#fff';
    btn.disabled = input.disabled = true;
    input.value = '';
    setTimeout(() => {
      btn.textContent = 'Subscribe';
      btn.style.cssText = '';
      btn.disabled = input.disabled = false;
    }, 4000);
  });

  if (input) {
    input.addEventListener('input', () => input.style.borderColor = '');
  }
}

function shake(el) {
  const kf = [
    { transform:'translateX(0)' },
    { transform:'translateX(-7px)' },
    { transform:'translateX(7px)' },
    { transform:'translateX(-5px)' },
    { transform:'translateX(5px)' },
    { transform:'translateX(0)' }
  ];
  el.animate(kf, { duration: 420, easing: 'ease' });
}

/* ============================================================
   HERO CANVAS ANIMATION (Lines That Bloom)
   ============================================================ */
function initHeroCanvas() {
  // Respect prefers-reduced-motion setting
  if (window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;

  const canvas = document.getElementById('hero-canvas');
  const container = document.querySelector('.hero-left');
  if (!canvas || !container) return;

  const ctx = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let animationId = null;

  // Track mouse coordinates relative to container
  let mouse = { x: null, y: null, targetX: null, targetY: null, active: false };

  function resize() {
    const rect = container.getBoundingClientRect();
    width = canvas.width = rect.width;
    height = canvas.height = rect.height;
  }
  
  window.addEventListener('resize', resize, { passive: true });
  resize();

  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    mouse.targetX = e.clientX - rect.left;
    mouse.targetY = e.clientY - rect.top;
    mouse.active = true;
  });

  container.addEventListener('mouseleave', () => {
    mouse.targetX = null;
    mouse.targetY = null;
    mouse.active = false;
  });

  function updateMouse() {
    if (mouse.targetX !== null && mouse.targetY !== null) {
      if (mouse.x === null) {
        mouse.x = mouse.targetX;
        mouse.y = mouse.targetY;
      } else {
        mouse.x += (mouse.targetX - mouse.x) * 0.08;
        mouse.y += (mouse.targetY - mouse.y) * 0.08;
      }
    } else {
      mouse.x = null;
      mouse.y = null;
    }
  }

  // 5 organic wavy paths
  const lineCount = 5;
  const lines = [];

  for (let i = 0; i < lineCount; i++) {
    lines.push({
      seed: Math.random() * 100,
      speed: 0.003 + Math.random() * 0.003,
      amplitude: 25 + Math.random() * 35,
      thickness: 0.75 + Math.random() * 1.0,
      baseYFactor: 0.25 + (i / (lineCount - 1)) * 0.5, // spaced vertically
      opacity: 0.06 + (i / lineCount) * 0.08,
      offsetPhase: i * (Math.PI / 3)
    });
  }

  // Slow ambient particles
  const particles = [];
  const maxParticles = 15;

  function createParticle(initY = false) {
    return {
      x: Math.random() * width,
      y: initY ? Math.random() * height : height + 15,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -0.3 - Math.random() * 0.6,
      size: 0.8 + Math.random() * 1.5,
      opacity: 0,
      maxOpacity: 0.08 + Math.random() * 0.16,
      life: 0,
      maxLife: 250 + Math.random() * 350
    };
  }

  // Pre-fill particles
  for (let i = 0; i < maxParticles; i++) {
    particles.push(createParticle(true));
  }

  let time = 0;
  let introFrames = 0;

  function draw() {
    time += 1;
    if (introFrames < 180) introFrames++; // 3 seconds fade-in
    const introFade = introFrames / 180;

    updateMouse();

    // Dynamically retrieve CSS custom properties for color harmony
    const computedStyle = getComputedStyle(document.documentElement);
    const accentColor = computedStyle.getPropertyValue('--accent').trim() || '#C8A96A';
    
    ctx.clearRect(0, 0, width, height);

    // Draw blooming lines
    for (let l = 0; l < lines.length; l++) {
      const line = lines[l];
      const t = time * line.speed + line.seed;

      ctx.beginPath();
      
      const points = [];
      const steps = 14; // smooth curve points
      
      for (let s = 0; s <= steps; s++) {
        const x = (s / steps) * width;
        let y = height * line.baseYFactor;
        
        // Multi-frequency wave formula
        const wave1 = Math.sin(x * 0.0025 + t + line.offsetPhase) * line.amplitude;
        const wave2 = Math.cos(x * 0.006 - t * 0.7 + line.offsetPhase) * (line.amplitude * 0.35);
        y += wave1 + wave2;

        // Interaction: pull line towards cursor
        if (mouse.x !== null && mouse.y !== null) {
          const dx = x - mouse.x;
          const dy = y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 200; // range
          
          if (dist < maxDist) {
            const pull = (1 - dist / maxDist) * 0.5; // pull force
            y += (mouse.y - y) * pull;
          }
        }

        points.push({ x, y });
      }

      // Draw curve
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 0; i < points.length - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
      }
      ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);

      // Line style
      ctx.lineWidth = line.thickness;
      ctx.strokeStyle = accentColor;
      ctx.globalAlpha = line.opacity * introFade;
      ctx.stroke();
    }

    // Draw particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.life++;
      
      // Physics
      p.y += p.vy;
      p.x += p.vx;
      p.x += Math.sin(p.y * 0.015 + p.life * 0.01) * 0.25; // sway

      // Interactive push
      if (mouse.x !== null && mouse.y !== null) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const push = (1 - dist / 120) * 0.6;
          p.x += (dx / dist) * push * 2;
          p.y += (dy / dist) * push * 1.5;
        }
      }

      // Fade-in/out logic
      if (p.life < 60) {
        p.opacity = (p.life / 60) * p.maxOpacity;
      } else if (p.life > p.maxLife - 60) {
        p.opacity = ((p.maxLife - p.life) / 60) * p.maxOpacity;
      } else {
        p.opacity = p.maxOpacity;
      }

      if (p.opacity > 0) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = accentColor;
        ctx.globalAlpha = p.opacity * introFade;
        ctx.fill();
      }

      // Respawn
      if (p.y < -10 || p.life >= p.maxLife || p.x < -10 || p.x > width + 10) {
        particles[i] = createParticle(false);
      }
    }

    ctx.globalAlpha = 1.0;
    animationId = requestAnimationFrame(draw);
  }

  draw();
}

/* ============================================================
   AUTH MODAL (Sign In / Register)
   ============================================================ */
function initAuthModal() {
  const overlay      = document.getElementById('auth-overlay');
  const openBtn      = document.getElementById('nav-login-btn');
  const closeBtn     = document.getElementById('auth-close-btn');
  const tabLogin     = document.getElementById('tab-login');
  const tabRegister  = document.getElementById('tab-register');
  const formLogin    = document.getElementById('form-login');
  const formRegister = document.getElementById('form-register');

  if (!overlay || !openBtn || !closeBtn) return;

  // Open Modal
  openBtn.addEventListener('click', () => {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    
    // Auto-focus first input
    const firstInput = formLogin.querySelector('input');
    if (firstInput) setTimeout(() => firstInput.focus(), 150);
  });

  // Close Modal
  function closeModal() {
    overlay.classList.remove('open');
    const mobileMenu = document.getElementById('mobile-menu');
    if (!mobileMenu || !mobileMenu.classList.contains('open')) {
      document.body.style.overflow = '';
    }
  }

  closeBtn.addEventListener('click', closeModal);

  // Close on background click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  // Close on Escape press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) {
      closeModal();
    }
  });

  // Tab switching
  function switchTab(target) {
    if (target === 'login') {
      tabLogin.classList.add('active');
      tabLogin.setAttribute('aria-selected', 'true');
      tabRegister.classList.remove('active');
      tabRegister.setAttribute('aria-selected', 'false');

      formLogin.classList.add('active');
      formRegister.classList.remove('active');
    } else {
      tabRegister.classList.add('active');
      tabRegister.setAttribute('aria-selected', 'true');
      tabLogin.classList.remove('active');
      tabLogin.setAttribute('aria-selected', 'false');

      formRegister.classList.add('active');
      formLogin.classList.remove('active');
    }
  }

  tabLogin.addEventListener('click', () => switchTab('login'));
  tabRegister.addEventListener('click', () => switchTab('register'));

  // Form submission and validation animations
  [formLogin, formRegister].forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      const inputs = form.querySelectorAll('input[required]');

      inputs.forEach((input) => {
        const value = input.value.trim();
        let fieldValid = true;

        if (!value) {
          fieldValid = false;
        } else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          fieldValid = false;
        } else if (input.type === 'checkbox' && !input.checked) {
          fieldValid = false;
        }

        if (!fieldValid) {
          isValid = false;
          input.parentElement.style.borderBottomColor = '#d9534f';
          
          // Reset border on type
          input.addEventListener('input', function resetBorder() {
            input.parentElement.style.borderBottomColor = '';
            input.removeEventListener('input', resetBorder);
          });
        }
      });

      if (!isValid) {
        // Shake modal form
        form.classList.add('auth-shake');
        setTimeout(() => form.classList.remove('auth-shake'), 420);
        return;
      }

      // Success flow
      const submitBtn = form.querySelector('.auth-submit-btn');
      const originalText = submitBtn.innerHTML;
      
      submitBtn.innerHTML = '<span>✓ Success</span>';
      submitBtn.style.background = '#2d6a4f';
      submitBtn.style.borderColor = '#2d6a4f';
      submitBtn.style.color = '#fff';
      
      // Disable inputs during transition
      form.querySelectorAll('input, button').forEach(el => el.disabled = true);

      setTimeout(() => {
        closeModal();
        
        // Reset form states after modal closes
        setTimeout(() => {
          form.reset();
          submitBtn.innerHTML = originalText;
          submitBtn.style.cssText = '';
          form.querySelectorAll('input, button').forEach(el => el.disabled = false);
        }, 500);
      }, 1200);
    });
  });

  // Cursor hover registration (for custom cursor)
  document.querySelectorAll('#nav-login-btn, #auth-close-btn, .auth-tab, .auth-forgot, .auth-remember').forEach(el => {
    el.addEventListener('mouseenter', () => {
      const c = document.getElementById('cursor');
      const f = document.getElementById('cursor-follower');
      if (c && f) { c.classList.add('hovering'); f.classList.add('hovering'); }
    });
    el.addEventListener('mouseleave', () => {
      const c = document.getElementById('cursor');
      const f = document.getElementById('cursor-follower');
      if (c && f) { c.classList.remove('hovering'); f.classList.remove('hovering'); }
    });
  });
}

/* ============================================================
   REDUCED MOTION
   ============================================================ */
if (window.matchMedia('(prefers-reduced-motion:reduce)').matches) {
  document.querySelectorAll('.reveal,.reveal-l,.reveal-r').forEach(el => {
    el.style.transition = 'none';
    el.classList.add('vis');
  });
  ['hero-eyebrow','hero-sub','hero-cta','hero-stats','hero-badge'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.style.transition = 'none'; el.classList.add('show'); }
  });
  ['hl1','hl2','hl3'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.style.transition = 'none'; el.classList.add('show'); }
  });
}
