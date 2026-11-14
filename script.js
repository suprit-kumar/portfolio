(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;

  /* Theme */
  const root = document.documentElement;
  const saved = localStorage.getItem('theme');
  if (saved) root.dataset.theme = saved;
  const themeBtn = $('#themeToggle');
  const syncTheme = () => { themeBtn.innerHTML = `<i class="fa-solid fa-${root.dataset.theme === 'dark' ? 'moon' : 'sun'}"></i>`; };
  syncTheme();
  themeBtn.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', root.dataset.theme);
    syncTheme();
  });

  /* Mobile menu */
  const burger = $('#burger'), links = $('#navLinks');
  const closeMenu = () => { links.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); };
  burger.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
  });
  $$('a', links).forEach(a => a.addEventListener('click', closeMenu));

  /* Smooth scroll (lightweight Lenis-style inertia) */
  const smooth = !reduce && fine;
  if (smooth) {
    let target = scrollY, current = scrollY, running = false;
    const loop = () => {
      current += (target - current) * 0.1;
      if (Math.abs(target - current) < 0.5) { current = target; running = false; }
      scrollTo(0, current);
      if (running) requestAnimationFrame(loop);
    };
    const max = () => document.documentElement.scrollHeight - innerHeight;
    addEventListener('wheel', e => {
      if (e.ctrlKey) return;
      e.preventDefault();
      if (!running) { current = scrollY; target = scrollY; }
      target = Math.max(0, Math.min(max(), target + e.deltaY));
      if (!running) { running = true; requestAnimationFrame(loop); }
    }, { passive: false });
    window.__smoothTo = y => { target = Math.max(0, Math.min(max(), y)); current = scrollY; if (!running) { running = true; requestAnimationFrame(loop); } };
  }
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const el = $(id);
    if (!el) return;
    e.preventDefault();
    const y = el.getBoundingClientRect().top + scrollY - (id === '#home' ? 0 : 20);
    if (window.__smoothTo) window.__smoothTo(y); else scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
    history.replaceState(null, '', id);
  }));
  $('#toTop').addEventListener('click', () => window.__smoothTo ? window.__smoothTo(0) : scrollTo({ top: 0, behavior: 'smooth' }));

  /* Scroll progress, nav state, active link */
  const prog = $('#progress'), nav = $('#nav');
  const sections = $$('main section[id]');
  const navAnchors = $$('.nav-links a');
  let ticking = false;
  const onScroll = () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    prog.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`;
    nav.classList.toggle('scrolled', scrollY > 30);
    let cur = '';
    sections.forEach(s => { if (s.getBoundingClientRect().top < innerHeight * 0.4) cur = s.id; });
    navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
    ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* Cursor glow & dot */
  if (fine) {
    const glow = $('#cursorGlow'), dot = $('#cursorDot');
    let mx = innerWidth / 2, my = innerHeight / 2, gx = mx, gy = my;
    addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; dot.style.transform = `translate(${mx}px,${my}px)`; }, { passive: true });
    (function follow() {
      gx += (mx - gx) * 0.08; gy += (my - gy) * 0.08;
      glow.style.transform = `translate(${gx}px,${gy}px)`;
      requestAnimationFrame(follow);
    })();
    document.addEventListener('mouseover', e => { if (e.target.closest('a,button,.node,.domain')) dot.classList.add('big'); });
    document.addEventListener('mouseout', e => { if (e.target.closest('a,button,.node,.domain')) dot.classList.remove('big'); });
  }

  /* Card tilt + spotlight */
  $$('[data-tilt]').forEach(el => {
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      el.style.setProperty('--mx', x * 100 + '%'); el.style.setProperty('--my', y * 100 + '%');
      if (fine && !reduce && !el.classList.contains('photo-wrap')) {
        el.style.transform = `perspective(900px) rotateX(${(0.5 - y) * 7}deg) rotateY(${(x - 0.5) * 9}deg) translateY(-3px)`;
      } else if (fine && !reduce) {
        el.style.transform = `perspective(900px) rotateX(${(0.5 - y) * 12}deg) rotateY(${(x - 0.5) * 14}deg)`;
      }
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });

  /* Magnetic buttons */
  if (fine && !reduce) $$('.magnetic').forEach(b => {
    b.addEventListener('mousemove', e => {
      const r = b.getBoundingClientRect();
      b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.15}px,${(e.clientY - r.top - r.height / 2) * 0.25 - 3}px)`;
    });
    b.addEventListener('mouseleave', () => { b.style.transform = ''; });
  });

  /* Text reveal split */
  $$('.split').forEach(h => {
    const words = h.textContent.trim().split(/\s+/);
    h.setAttribute('aria-label', h.textContent.trim());
    h.innerHTML = words.map((w, i) => `<span class="w" aria-hidden="true"><span style="transition-delay:${i * 60}ms">${w}</span></span>`).join(' ');
  });

  /* SVG path lengths & meters */
  $$('.impact .draw').forEach(p => { try { p.style.setProperty('--len', Math.ceil(p.getTotalLength()) + 2); } catch (e) { /* ignore */ } });
  $$('.meter').forEach(m => { m.querySelector('i').style.setProperty('--v', m.dataset.v + '%'); });

  /* Count up */
  const countUp = el => {
    const end = +el.dataset.count, t0 = performance.now(), dur = 1600;
    const step = t => {
      const p = Math.min((t - t0) / dur, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    reduce ? (el.textContent = end) : requestAnimationFrame(step);
  };

  /* Intersection reveal */
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    const el = en.target;
    el.classList.add('in');
    $$('[data-count]', el).forEach(countUp);
    if (el.matches('[data-count]')) countUp(el);
    io.unobserve(el);
  }), { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal,.split,.stat').forEach(el => io.observe(el));

  /* Typing effect */
  const typed = $('#typed');
  const phrases = ['Senior Software Engineer', 'Backend Engineer', 'Python Developer', 'AI-Integrated Engineer', 'Cloud & DevOps Practitioner'];
  if (reduce) typed.textContent = phrases[0];
  else {
    let pi = 0, ci = 0, del = false;
    (function tick() {
      const word = phrases[pi];
      ci += del ? -1 : 1;
      typed.textContent = word.slice(0, ci);
      let wait = del ? 35 : 75;
      if (!del && ci === word.length) { del = true; wait = 1500; }
      else if (del && ci === 0) { del = false; pi = (pi + 1) % phrases.length; wait = 350; }
      setTimeout(tick, wait);
    })();
  }

  /* Canvas helpers */
  const dpr = Math.min(devicePixelRatio || 1, 2);
  const fit = (c, w, h) => { c.width = w * dpr; c.height = h * dpr; const x = c.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0); return x; };
  const colors = () => root.dataset.theme === 'dark' ? ['124,92,255', '0,212,255', '255,79,216'] : ['90,60,230', '0,140,200', '210,40,170'];

  /* Neural network background */
  (() => {
    const c = $('#neural'), hero = $('#home');
    let w, h, ctx, nodes = [], visible = true, mouse = { x: -999, y: -999 };
    const build = () => {
      w = hero.clientWidth; h = hero.clientHeight; ctx = fit(c, w, h);
      const n = Math.min(Math.floor(w * h / 15000), 90);
      nodes = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35, k: Math.floor(Math.random() * 3) }));
    };
    build();
    addEventListener('resize', build);
    hero.addEventListener('mousemove', e => { const r = hero.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
    hero.addEventListener('mouseleave', () => { mouse.x = mouse.y = -999; });
    new IntersectionObserver(e => { visible = e[0].isIntersecting; }).observe(hero);
    const draw = () => {
      requestAnimationFrame(draw);
      if (!visible) return;
      const col = colors();
      ctx.clearRect(0, 0, w, h);
      for (const a of nodes) {
        if (!reduce) {
          a.x += a.vx; a.y += a.vy;
          if (a.x < 0 || a.x > w) a.vx *= -1;
          if (a.y < 0 || a.y > h) a.vy *= -1;
          const dx = a.x - mouse.x, dy = a.y - mouse.y, d = Math.hypot(dx, dy);
          if (d < 120) { a.x += dx / d * 1.2; a.y += dy / d * 1.2; }
        }
      }
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j], d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 130) { ctx.strokeStyle = `rgba(${col[a.k]},${(1 - d / 130) * .35})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
        }
        const dm = Math.hypot(a.x - mouse.x, a.y - mouse.y);
        if (dm < 170) { ctx.strokeStyle = `rgba(${col[1]},${(1 - dm / 170) * .6})`; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke(); }
        ctx.fillStyle = `rgba(${col[a.k]},.85)`; ctx.beginPath(); ctx.arc(a.x, a.y, 2, 0, 6.283); ctx.fill();
      }
    };
    draw();
  })();

  /* Particles orbiting the photo */
  (() => {
    const c = $('#photoParticles');
    if (!c) return;
    const size = c.parentElement.clientWidth * 1.36;
    const ctx = fit(c, size, size);
    const ps = Array.from({ length: 46 }, () => ({ a: Math.random() * 6.283, r: size * (.37 + Math.random() * .13), s: (Math.random() * .004 + .001) * (Math.random() < .5 ? -1 : 1), z: Math.random() * 2 + .8, k: Math.floor(Math.random() * 3) }));
    let vis = true;
    new IntersectionObserver(e => { vis = e[0].isIntersecting; }).observe(c);
    (function draw() {
      requestAnimationFrame(draw);
      if (!vis) return;
      ctx.clearRect(0, 0, size, size);
      const col = colors();
      for (const p of ps) {
        if (!reduce) p.a += p.s;
        const x = size / 2 + Math.cos(p.a) * p.r, y = size / 2 + Math.sin(p.a) * p.r;
        ctx.fillStyle = `rgba(${col[p.k]},.9)`; ctx.shadowColor = `rgb(${col[p.k]})`; ctx.shadowBlur = 10;
        ctx.beginPath(); ctx.arc(x, y, p.z, 0, 6.283); ctx.fill();
      }
      ctx.shadowBlur = 0;
    })();
  })();

  /* Skill filters */
  $$('.filter').forEach(btn => btn.addEventListener('click', () => {
    $$('.filter').forEach(b => { b.classList.toggle('active', b === btn); b.setAttribute('aria-selected', b === btn); });
    const f = btn.dataset.filter;
    $$('.group').forEach(g => g.classList.toggle('dim', f !== 'all' && g.dataset.cat !== f));
  }));

  /* Technology orbit */
  (() => {
    const orbit = $('#orbit');
    const items = [
      ['fa-brands fa-python', 36, 22, 0], ['fa-brands fa-js', 36, 22, 1], ['fa-solid fa-database', 36, 22, 2],
      ['fa-brands fa-docker', 28, 16, 0], ['fa-solid fa-cloud', 28, 16, 1], ['fa-brands fa-github', 28, 16, 2], ['fa-solid fa-gears', 28, 16, 3],
      ['fa-solid fa-diagram-project', 46, 32, 0], ['fa-solid fa-brain', 46, 32, 1], ['fa-solid fa-server', 46, 32, 2], ['fa-brands fa-jenkins', 46, 32, 3], ['fa-brands fa-html5', 46, 32, 4]
    ];
    const titles = { 'fa-python': 'Python', 'fa-js': 'JavaScript', 'fa-database': 'PostgreSQL / Redis', 'fa-docker': 'Docker', 'fa-cloud': 'Azure', 'fa-github': 'GitHub Actions', 'fa-gears': 'Celery', 'fa-diagram-project': 'Microservices', 'fa-brain': 'AI-Assisted Dev', 'fa-server': 'Django / Flask', 'fa-jenkins': 'Jenkins', 'fa-html5': 'HTML & CSS' };
    const rings = { 22: [0, 3], 16: [0, 4], 32: [0, 5] };
    const radii = { 22: 0.28, 16: 0.42, 32: 0.54 };
    const counts = { 22: 3, 16: 4, 32: 5 };
    items.forEach(([icon, , ring, idx]) => {
      const div = document.createElement('div');
      div.className = 'o-item';
      const radius = (orbit.clientWidth || 400) * radii[ring] * (ring === 22 ? 1 : 1);
      const dur = ring === 22 ? 22 : ring === 16 ? 32 : 44;
      div.style.setProperty('--rad', radius + 'px');
      div.style.setProperty('--d', dur + 's');
      div.style.setProperty('--delay', -(dur / counts[ring]) * idx + 's');
      const key = icon.split(' ')[1];
      div.innerHTML = `<span title="${titles[key]}" aria-hidden="true"><i class="${icon}"></i></span>`;
      orbit.appendChild(div);
    });
  })();

  /* Career journey map */
  (() => {
    const data = [
      { org: 'IOP Technologies', role: 'Software Developer · May 2019 – Jan 2021', pts: ['Built an EdTech platform serving 5000+ users.', 'Delivered registration and subscription systems.', 'Integrated SMS and email notifications.', 'Implemented authentication systems.'] },
      { org: 'Alice Blue', role: 'Software Developer · Mar 2021 – Apr 2022', pts: ['Developed FinTech applications with Django and PostgreSQL.', 'Built portfolio and SIP integrations.', 'Optimized queries and improved application performance.'] },
      { org: 'Capgemini Engineering', role: 'Software Engineer · Apr 2022 – Sep 2023', pts: ['Built a network technology data processing platform.', 'Designed Redis Pub/Sub architecture with Celery async processing.', 'Dockerized deployments and authored client onboarding guides.'] },
      { org: 'Wipro', role: 'Senior Software Engineer · Sep 2023 – Apr 2025', pts: ['Modernized monoliths into modular services and built high-performance REST APIs.', 'Migrated Python 3.8 → 3.12 and Jenkins → GitHub Actions (≈30% faster deployments).', 'Resolved 100+ production incidents; optimized APIs from 800ms to 150ms.'] },
      { org: 'Optum', role: 'Senior Software Engineer · Apr 2025 – Present', pts: ['HR payout processing for millions of employees.', 'WARN Act reporting from 40 minutes to under 5 (92% faster).', 'AI-assisted development to boost engineering productivity.'] }
    ];
    const nodes = $$('.node'), box = $('#journeyDetail'), road = $('#roadmap');
    const show = i => {
      nodes.forEach((n, k) => { n.classList.toggle('active', k === i); n.classList.toggle('passed', k < i); n.setAttribute('aria-pressed', k === i); });
      const d = data[i];
      box.classList.remove('swap'); void box.offsetWidth; box.classList.add('swap');
      box.innerHTML = `<h3>${d.org}</h3><p class="role">${d.role}</p><ul>${d.pts.map(p => `<li>${p}</li>`).join('')}</ul>`;
      const last = nodes[i].querySelector('.n-dot'), rr = road.getBoundingClientRect(), lr = last.getBoundingClientRect();
      road.style.setProperty('--prog', Math.max(0, lr.top - rr.top + lr.height / 2 - 14) + 'px');
    };
    nodes.forEach((n, i) => n.addEventListener('click', () => show(i)));
    show(0);
    addEventListener('resize', () => show(nodes.findIndex(n => n.classList.contains('active'))));
  })();

  $('#year').textContent = new Date().getFullYear();
})();
