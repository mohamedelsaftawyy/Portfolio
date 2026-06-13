'use strict';

/* ─────────────────────────────────────────────
   CURSOR GLOW
───────────────────────────────────────────── */
const glowEl = document.getElementById('cursor-glow');
let mx = window.innerWidth / 2, my = window.innerHeight / 2;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  glowEl.style.left = mx + 'px';
  glowEl.style.top  = my + 'px';
  document.documentElement.style.setProperty('--cx', mx + 'px');
  document.documentElement.style.setProperty('--cy', my + 'px');
});

/* ─────────────────────────────────────────────
   MATRIX RAIN (background canvas)
───────────────────────────────────────────── */
(function () {
  const c = document.getElementById('matrix-canvas');
  const ctx = c.getContext('2d');
  const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ#$%@&';
  let cols, drops;

  function resize() {
    c.width  = window.innerWidth;
    c.height = window.innerHeight;
    cols  = Math.floor(c.width / 18);
    drops = Array(cols).fill(1);
  }

  function draw() {
    ctx.fillStyle = 'rgba(2,8,16,0.05)';
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.font = '14px JetBrains Mono, monospace';
    for (let i = 0; i < drops.length; i++) {
      const ch = chars[Math.floor(Math.random() * chars.length)];
      const x  = i * 18;
      const y  = drops[i] * 18;
      // lead character bright
      ctx.fillStyle = 'rgba(0,212,255,0.9)';
      ctx.fillText(ch, x, y);
      // trailing
      ctx.fillStyle = `rgba(0,212,255,${Math.random() * 0.4})`;
      ctx.fillText(chars[Math.floor(Math.random() * chars.length)], x, y - 18);

      if (y > c.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
  }

  window.addEventListener('resize', resize);
  resize();
  setInterval(draw, 55);
})();

/* ─────────────────────────────────────────────
   GRID / PARTICLE CANVAS
───────────────────────────────────────────── */
(function () {
  const c = document.getElementById('grid-canvas');
  const ctx = c.getContext('2d');
  let W, H, dots = [];
  const N = 55;

  function resize() { W = c.width = window.innerWidth; H = c.height = window.innerHeight; }

  function init() {
    dots = Array.from({ length: N }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 1,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < N; i++) {
      const a = dots[i];
      a.x += a.vx; a.y += a.vy;
      if (a.x < 0 || a.x > W) a.vx *= -1;
      if (a.y < 0 || a.y > H) a.vy *= -1;

      // pull towards cursor slightly
      const dx = mx - a.x, dy = my - a.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 200) { a.x += dx * 0.0008; a.y += dy * 0.0008; }

      ctx.beginPath();
      ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,212,255,0.5)';
      ctx.fill();

      for (let j = i + 1; j < N; j++) {
        const b = dots[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 150) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(0,212,255,${0.12 * (1 - d / 150)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); init(); });
  resize(); init(); draw();
})();

/* ─────────────────────────────────────────────
   HUD CLOCK
───────────────────────────────────────────── */
const hudTime = document.getElementById('hud-time');
if (hudTime) {
  setInterval(() => {
    const now = new Date();
    hudTime.textContent = now.toTimeString().slice(0, 8);
  }, 1000);
}

/* ─────────────────────────────────────────────
   TYPED TEXT
───────────────────────────────────────────── */
(function () {
  const roles = [
    'Cybersecurity Student',
    'Penetration Tester (in-training)',
    'CTF Enthusiast',
    'Digital Forensics Analyst',
    'Ethical Hacker',
  ];
  const el = document.getElementById('typed');
  if (!el) return;
  let ri = 0, ci = 0, deleting = false;

  function type() {
    const cur = roles[ri];
    if (!deleting) {
      el.textContent = cur.slice(0, ++ci);
      if (ci === cur.length) { deleting = true; setTimeout(type, 2200); return; }
    } else {
      el.textContent = cur.slice(0, --ci);
      if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
    }
    setTimeout(type, deleting ? 45 : 75);
  }
  type();
})();

/* ─────────────────────────────────────────────
   HAMBURGER
───────────────────────────────────────────── */
document.getElementById('hamburger').addEventListener('click', function () {
  document.querySelector('.nav-links').classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(l => {
  l.addEventListener('click', () => document.querySelector('.nav-links').classList.remove('open'));
});

/* ─────────────────────────────────────────────
   ACTIVE NAV
───────────────────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const a = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if (a) a.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' }).observe
  || sections.forEach(s => {});
const navObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    navLinks.forEach(l => l.classList.remove('active'));
    const a = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
    if (a) a.classList.add('active');
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => navObs.observe(s));

/* ─────────────────────────────────────────────
   SCROLL REVEAL
───────────────────────────────────────────── */
document.querySelectorAll('.skill-card, .cert-card, .project-card, .terminal-card, .bar-item, .platform-card, .about-stats').forEach(el => {
  el.classList.add('reveal');
});

const revealObs = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 60);
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ─────────────────────────────────────────────
   BAR ANIMATION
───────────────────────────────────────────── */
new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('animated'); }
  });
}, { threshold: 0.5 }).observe
  || [];
const barObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('animated'); } });
}, { threshold: 0.5 });
document.querySelectorAll('.bar-fill').forEach(b => barObs.observe(b));

/* ─────────────────────────────────────────────
   COUNTER ANIMATION
───────────────────────────────────────────── */
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = +el.dataset.target;
    let cur = 0;
    const timer = setInterval(() => {
      cur = Math.min(cur + 1, target);
      el.textContent = cur;
      if (cur >= target) clearInterval(timer);
    }, 80);
    counterObs.unobserve(el);
  });
}, { threshold: 0.6 });
document.querySelectorAll('.stat-num').forEach(c => counterObs.observe(c));

/* ─────────────────────────────────────────────
   3D TILT on cards
───────────────────────────────────────────── */
document.querySelectorAll('.tilt-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    const rx = ((e.clientY - cy) / (rect.height / 2)) * -7;
    const ry = ((e.clientX - cx) / (rect.width  / 2)) *  7;
    card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateZ(0)';
    card.style.transition = 'transform 0.5s ease';
  });
  card.addEventListener('mouseenter', () => { card.style.transition = 'transform 0.1s ease'; });
});

/* ─────────────────────────────────────────────
   RADAR CHART
───────────────────────────────────────────── */
(function () {
  const canvas = document.getElementById('radar-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = 320, H = 320, cx = W / 2, cy = H / 2, R = 120;

  const labels  = ['Network\nSec', 'Web\nSec', 'Forensics', 'Python', 'Rev\nEng', 'OSINT'];
  const values  = [0.85, 0.80, 0.75, 0.78, 0.65, 0.70];
  const N = labels.length;

  let progress = 0;

  function angleAt(i) { return (Math.PI * 2 * i) / N - Math.PI / 2; }

  function draw(p) {
    ctx.clearRect(0, 0, W, H);

    // Grid rings
    for (let ring = 1; ring <= 5; ring++) {
      ctx.beginPath();
      const r = (R / 5) * ring;
      for (let i = 0; i < N; i++) {
        const a = angleAt(i);
        const x = cx + Math.cos(a) * r;
        const y = cy + Math.sin(a) * r;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = ring === 5 ? 'rgba(0,212,255,0.25)' : 'rgba(0,212,255,0.08)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Spokes
    for (let i = 0; i < N; i++) {
      const a = angleAt(i);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R);
      ctx.strokeStyle = 'rgba(0,212,255,0.12)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Data area
    ctx.beginPath();
    for (let i = 0; i < N; i++) {
      const a = angleAt(i);
      const r = R * values[i] * p;
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
    grad.addColorStop(0, 'rgba(124,58,237,0.3)');
    grad.addColorStop(1, 'rgba(0,212,255,0.15)');
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,212,255,0.8)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Data points
    for (let i = 0; i < N; i++) {
      const a = angleAt(i);
      const r = R * values[i] * p;
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#00d4ff';
      ctx.shadowColor = '#00d4ff';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Labels
    ctx.font = '11px JetBrains Mono, monospace';
    ctx.fillStyle = 'rgba(200,216,232,0.8)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let i = 0; i < N; i++) {
      const a = angleAt(i);
      const labelR = R + 26;
      const x = cx + Math.cos(a) * labelR;
      const y = cy + Math.sin(a) * labelR;
      const parts = labels[i].split('\n');
      parts.forEach((line, li) => {
        ctx.fillText(line, x, y + li * 13 - (parts.length - 1) * 6.5);
      });
    }
  }

  // Animate in when visible
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      progress = 0;
      const step = () => {
        progress = Math.min(progress + 0.03, 1);
        draw(progress);
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      obs.unobserve(canvas);
    });
  }, { threshold: 0.4 });

  obs.observe(canvas);
  draw(0);
})();

/* ─────────────────────────────────────────────
   CONTACT FORM
───────────────────────────────────────────── */
document.getElementById('contactForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const btn = document.getElementById('form-btn-text');
  btn.textContent = 'Transmitting...';

  const res = await fetch(this.action, {
    method: 'POST',
    body: new FormData(this),
    headers: { Accept: 'application/json' },
  });

  if (res.ok) {
    btn.textContent = 'Transmitted ✓';
    this.reset();
  } else {
    btn.textContent = 'Failed — try email directly';
  }
  setTimeout(() => { btn.textContent = 'Transmit Message'; }, 4000);
});
