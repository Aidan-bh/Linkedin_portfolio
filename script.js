/* ================================================================
   AIDAN HEWITT PORTFOLIO — script.js
   · Custom lagging cursor
   · Navbar scroll shrink
   · Mobile nav toggle
   · Floating particle generator
   · Typewriter hero title
   · Scroll reveal
   · Counter animation
   · Active nav highlight
   · Auto year
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ======================================================
     0. SCROLL PROGRESS + SECTION PAGE ANIMATIONS
  ====================================================== */
  const progress = document.getElementById('scrollProgress');
  function updateScrollProgress() {
    if (!progress) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    progress.style.width = `${pct}%`;
  }
  updateScrollProgress();
  window.addEventListener('scroll', updateScrollProgress, { passive: true });

  const sectionObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      entry.target.classList.toggle('section-in-view', entry.isIntersecting);
    });
  }, { threshold: 0.22 });
  document.querySelectorAll('.section').forEach(section => sectionObs.observe(section));

  /* ---- YEAR ---- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ======================================================
     1. CUSTOM CURSOR — lagging ring + instant dot
  ====================================================== */
  const ring = document.getElementById('cursorRing');
  const dot  = document.getElementById('cursorDot');
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;

  if (ring && dot && finePointer) {
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';
    });

    (function animateCursor() {
      rx += (mx - rx) * 0.1;
      ry += (my - ry) * 0.1;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(animateCursor);
    })();

    document.querySelectorAll('a, button, .project-card, .pill, .contact-link-row').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
    });

    document.addEventListener('mousedown', () => {
      ring.classList.add('clicking');
      setTimeout(() => ring.classList.remove('clicking'), 280);
    });
  }

  /* ======================================================
     2. NAVBAR SCROLL SHRINK
  ====================================================== */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  /* ======================================================
     3. MOBILE NAV
  ====================================================== */
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  function closeNav() {
    navLinks.classList.remove('open');
    const sp = navToggle.querySelectorAll('span');
    sp[0].style.transform = ''; sp[1].style.opacity = ''; sp[2].style.transform = '';
  }

  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    const sp = navToggle.querySelectorAll('span');
    if (open) {
      sp[0].style.transform = 'translateY(6px) rotate(45deg)';
      sp[1].style.opacity   = '0';
      sp[2].style.transform = 'translateY(-6px) rotate(-45deg)';
    } else closeNav();
  });

  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));
  document.addEventListener('click', e => {
    if (navLinks.classList.contains('open') &&
        !navLinks.contains(e.target) && !navToggle.contains(e.target)) closeNav();
  });

  /* ======================================================
     4. FLOATING PARTICLES
  ====================================================== */
  const pContainer = document.getElementById('particles');
  if (pContainer) {
    function spawnParticle() {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 3 + 1;
      const colors = ['#00F5FF', '#356DFF', '#FF2BD6', '#39FF88', '#FFE66D', '#9D4DFF'];
      p.style.cssText = `
        width: ${size}px; height: ${size}px;
        left: ${Math.random() * 100}%;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        animation-duration: ${Math.random() * 8 + 6}s;
        animation-delay: ${Math.random() * 4}s;
        box-shadow: 0 0 6px currentColor;
      `;
      pContainer.appendChild(p);
      setTimeout(() => p.remove(), 14000);
    }
    for (let i = 0; i < 20; i++) spawnParticle();
    setInterval(spawnParticle, 600);
  }

  /* ======================================================
     5. TYPEWRITER HERO TITLE
  ====================================================== */
  const titles = [
    'FULL-STACK DEVELOPER',
    'AI/ML ENGINEER',
    'COMPUTER SCIENCE GRADUATE',
    'PROBLEM SOLVER'
  ];
  const titleEl = document.getElementById('typedTitle');
  if (titleEl) {
    let ti = 0, ci = 0, deleting = false;
    function type() {
      const cur = titles[ti];
      if (!deleting) {
        titleEl.textContent = cur.slice(0, ++ci);
        if (ci === cur.length) { deleting = true; setTimeout(type, 2200); return; }
      } else {
        titleEl.textContent = cur.slice(0, --ci);
        if (ci === 0) { deleting = false; ti = (ti + 1) % titles.length; }
      }
      setTimeout(type, deleting ? 40 : 80);
    }
    setTimeout(type, 1000);
  }

  /* ======================================================
     6. SCROLL REVEAL
  ====================================================== */
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  /* ======================================================
     7. COUNTER ANIMATION
  ====================================================== */
  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.count, 10);
      const start = performance.now();
      const duration = 1600;
      function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target);
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      counterObs.unobserve(el);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => counterObs.observe(el));

  /* ======================================================
     8. ACTIVE NAV HIGHLIGHT
  ====================================================== */
  const sections = document.querySelectorAll('section[id], header[id]');
  const navAs    = document.querySelectorAll('.nav-links a');

  new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navAs.forEach(a => {
          const active = a.getAttribute('href') === `#${e.target.id}`;
          a.style.color = active ? 'var(--cyan)' : '';
          a.style.textShadow = active ? 'var(--glow-cyan)' : '';
        });
      }
    });
  }, { threshold: 0.4 }).observe;

  sections.forEach(s => {
    new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          navAs.forEach(a => {
            const active = a.getAttribute('href') === `#${e.target.id}`;
            a.style.color      = active ? 'var(--cyan)' : '';
            a.style.textShadow = active ? 'var(--glow-cyan)' : '';
          });
        }
      });
    }, { threshold: 0.4 }).observe(s);
  });

  /* ======================================================
     9. STAGGER DELAYS ON SKILLS / PILLS
  ====================================================== */
  document.querySelectorAll('.skills-block').forEach((block, i) => {
    block.style.transitionDelay = `${i * 0.12}s`;
  });

  document.querySelectorAll('.project-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.1}s`;
  });


  /* ======================================================
     10. EXTRA CYBERPUNK SCROLL MOTION + MOBILE-FRIENDLY INTERACTIONS
  ====================================================== */
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const heroContent = document.querySelector('.hero-content');
  const heroGrid = document.querySelector('.cyber-grid');

  if (!reduceMotion) {
    let ticking = false;
    function animateOnScroll() {
      const y = window.scrollY || 0;
      if (heroContent) {
        heroContent.style.transform = `translate3d(0, ${Math.min(y * 0.08, 42)}px, 0)`;
        heroContent.style.opacity = String(Math.max(1 - y / 950, 0.35));
      }
      if (heroGrid) {
        heroGrid.style.transform = `translate3d(0, ${y * -0.035}px, 0)`;
      }
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(animateOnScroll);
        ticking = true;
      }
    }, { passive: true });
  }

  // Fine-pointer card tilt only. Touch devices keep simple, stable hover states.
  if (finePointer && !reduceMotion) {
    document.querySelectorAll('.project-card, .edu-card, .skills-block').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateX = ((y / rect.height) - 0.5) * -4;
        const rotateY = ((x / rect.width) - 0.5) * 5;
        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // Stagger each pill on reveal for a more deliberate category-by-category entrance.
  document.querySelectorAll('.skills-block .pill').forEach((pill, i) => {
    pill.style.animationDelay = `${(i % 8) * 0.045}s`;
  });


});