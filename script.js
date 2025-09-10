// Gleam landing page interactions

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasFinePointer = window.matchMedia('(pointer: fine)').matches;

// Reveal on scroll
(() => {
  if (prefersReducedMotion) return;
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;
  const io = new IntersectionObserver((entries, observer) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0.16, rootMargin: '40px' });
  reveals.forEach((el) => io.observe(el));
})();

// Tilt effect
(() => {
  if (prefersReducedMotion || !hasFinePointer) return;
  const tiltElements = document.querySelectorAll('.tilt');
  tiltElements.forEach((el) => {
    const maxTilt = 12;
    let rect = el.getBoundingClientRect();
    let frame;
    const shine = document.createElement('div');
    shine.className = 'tilt__shine';
    el.appendChild(shine);

    const onMove = (event) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const { clientX, clientY } = event.type.startsWith('touch') && event.touches[0] ? event.touches[0] : event;
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = clientX - cx;
        const dy = clientY - cy;
        const rx = (dy / (rect.height / 2)) * -maxTilt;
        const ry = (dx / (rect.width / 2)) * maxTilt;
        el.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
        const mx = ((dx / rect.width) + 0.5) * 100;
        const my = ((dy / rect.height) + 0.5) * 100;
        shine.style.setProperty('--mx', `${mx}%`);
        shine.style.setProperty('--my', `${my}%`);
      });
    };

    const onEnter = () => { rect = el.getBoundingClientRect(); };
    const onLeave = () => { el.style.transform = 'perspective(900px) rotateX(0) rotateY(0)'; };

    el.addEventListener('pointerenter', onEnter, { passive: true });
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave, { passive: true });
    window.addEventListener('resize', () => { rect = el.getBoundingClientRect(); }, { passive: true });
  });
})();

// Magnetic buttons
(() => {
  if (prefersReducedMotion || !hasFinePointer) return;
  const magnets = document.querySelectorAll('.magnetic');
  magnets.forEach((btn) => {
    let rect = btn.getBoundingClientRect();
    const strength = 18; // px
    const onMove = (e) => {
      const { clientX, clientY } = e;
      const relX = ((clientX - rect.left) / rect.width - 0.5) * 2;
      const relY = ((clientY - rect.top) / rect.height - 0.5) * 2;
      const tx = relX * strength;
      const ty = relY * strength;
      btn.style.transform = `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px)`;
    };
    const onLeave = () => { btn.style.transform = 'translate(0, 0)'; };
    btn.addEventListener('pointerenter', () => { rect = btn.getBoundingClientRect(); }, { passive: true });
    btn.addEventListener('pointermove', onMove);
    btn.addEventListener('pointerleave', onLeave, { passive: true });
    window.addEventListener('resize', () => { rect = btn.getBoundingClientRect(); }, { passive: true });
  });
})();

// Parallax orbs in hero
(() => {
  if (prefersReducedMotion || !hasFinePointer) return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const layers = hero.querySelectorAll('.parallax');
  let raf; let rect = hero.getBoundingClientRect();
  const onMove = (e) => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      layers.forEach((layer) => {
        const depth = parseFloat(layer.getAttribute('data-depth') || '0.05');
        const dx = (x - cx) * depth;
        const dy = (y - cy) * depth;
        layer.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
      });
    });
  };
  hero.addEventListener('pointermove', onMove);
  window.addEventListener('resize', () => { rect = hero.getBoundingClientRect(); }, { passive: true });
})();

// Smooth scroll for internal anchor links
(() => {
  const anchors = document.querySelectorAll('a[href^="#"]');
  anchors.forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
    });
  });
})();

// Footer year
(() => {
  const y = document.getElementById('year');
  if (y) y.textContent = String(new Date().getFullYear());
})();

