(() => {
  const track = document.getElementById('track');
  const slides = [...track.children];
  const dotsBox = document.getElementById('dots');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let i = 0, timer;

  const dots = slides.map((_, n) => {
    const b = document.createElement('button');
    b.className = 'dot';
    b.setAttribute('aria-label', `Go to slide ${n + 1}`);
    b.onclick = () => { go(n); restart(); };
    dotsBox.appendChild(b);
    return b;
  });

  function go(n) {
    i = (n + slides.length) % slides.length;
    const s = slides[i];
    const offset = s.offsetLeft - (track.parentElement.clientWidth - s.clientWidth) / 2;
    track.style.transform = `translateX(${-offset}px)`;
    slides.forEach((el, k) => el.classList.toggle('active', k === i));
    dots.forEach((d, k) => d.classList.toggle('active', k === i));
  }
  function restart() {
    clearInterval(timer);
    if (!reduce) timer = setInterval(() => go(i + 1), 5000);
  }

  document.getElementById('prev').onclick = () => { go(i - 1); restart(); };
  document.getElementById('next').onclick = () => { go(i + 1); restart(); };
  track.parentElement.addEventListener('mouseenter', () => clearInterval(timer));
  track.parentElement.addEventListener('mouseleave', restart);
  addEventListener('resize', () => go(i));
  go(0); restart();
})();

 
/* ===== FEATURES SECTION (step 2): cursor glow ===== */
(() => {
  const bento = document.getElementById('bento');
  if (!bento) return;
  bento.addEventListener('pointermove', e => {
    bento.querySelectorAll('.card').forEach(c => {
      const r = c.getBoundingClientRect();
      c.style.setProperty('--x', `${e.clientX - r.left}px`);
      c.style.setProperty('--y', `${e.clientY - r.top}px`);
    });
  });
})();

/* ===== TYPING DEMO SECTION (step 3) ===== */
(() => {
  const promptEl = document.getElementById('typed-prompt');
  const replyEl = document.getElementById('typed-reply');
  const chipsBox = document.getElementById('chips');
  if (!promptEl) return;
 
  // Edit these to match your client's business
  const demos = [
    { label: 'Write a slogan', prompt: 'Write a slogan for a coffee shop.', reply: 'Fresh roasted, slowly poured, made for your morning.' },
    { label: 'Plan a trip', prompt: 'Plan a 2-day trip to Marrakech.', reply: 'Day 1: Jemaa el-Fnaa, the souks and a rooftop dinner.\nDay 2: Majorelle Garden, Bahia Palace and a hammam.' },
    { label: 'Explain code', prompt: 'What does a CSS grid do?', reply: 'It lays out content in rows and columns, so you can build full page layouts without hacks.' }
  ];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wait = ms => new Promise(r => setTimeout(r, ms));
  let run = 0, visible = false, current = 0;
 
  const chips = demos.map((d, n) => {
    const b = document.createElement('button');
    b.className = 'chip'; b.textContent = d.label;
    b.onclick = () => play(n);
    chipsBox.appendChild(b);
    return b;
  });
 
  async function type(el, text, speed, id) {
    el.textContent = '';
    for (const ch of text) {
      if (id !== run) return false;
      el.textContent += ch;
      await wait(speed + Math.random() * 25);
    }
    return true;
  }
 
  async function play(n) {
    const id = ++run; current = n;
    chips.forEach((c, k) => c.classList.toggle('active', k === n));
    const d = demos[n];
    if (reduce) { promptEl.textContent = d.prompt; replyEl.textContent = d.reply; return; }
    replyEl.textContent = '';
    if (!(await type(promptEl, d.prompt, 45, id))) return;
    await wait(500);
    if (!(await type(replyEl, d.reply, 18, id))) return;
    await wait(3500);
    if (id === run && visible) play((n + 1) % demos.length);
  }
 
  // start typing only when the section scrolls into view
  new IntersectionObserver(([e]) => {
    const was = visible; visible = e.isIntersecting;
    if (visible && !was) play(current);
  }, { threshold: 0.4 }).observe(document.getElementById('demo'));
})();

/* ===== MOVING ICONS & PICTURES SECTION (step 4) ===== */
(() => {
  const mq = document.getElementById('mq');
  if (mq) mq.innerHTML += mq.innerHTML + mq.innerHTML + mq.innerHTML; // repeat so the loop never shows a gap
 
  const stage = document.getElementById('stage');
  const photo = document.getElementById('photo');
  if (!stage || !photo || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  stage.addEventListener('pointermove', e => {
    const r = stage.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    photo.style.transform = `perspective(700px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg)`;
  });
  stage.addEventListener('pointerleave', () => { photo.style.transform = ''; });
})();



/* ===== TESTIMONIALS + FOOTER (step 5) ===== */
(() => {
  // fade-in on scroll
  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { threshold: 0.15 });
    items.forEach(el => io.observe(el));
  } else items.forEach(el => el.classList.add('in'));
 
  // current year
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
 
  // newsletter (front-end check only: connect it to your email service later)
  const form = document.getElementById('news');
  const msg = document.getElementById('news-msg');
  if (form) form.addEventListener('submit', e => {
    e.preventDefault();
    const v = document.getElementById('email').value.trim();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    msg.textContent = ok ? 'Thanks! You are subscribed.' : 'Please enter a valid email address.';
    msg.style.color = ok ? '#81c995' : '#f28b82';
    if (ok) form.reset();
  });
})();