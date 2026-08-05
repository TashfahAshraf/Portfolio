document.getElementById('year').textContent = new Date().getFullYear();

// mobile nav toggle
const navToggle = document.getElementById('nav-toggle');
const mainNav = document.getElementById('main-nav');

navToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', isOpen);
});

mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// blueprint flip toggle (light / dark) with moon/sun icon
const modeToggle = document.getElementById('mode-toggle');
const modeIcon = document.getElementById('mode-icon');
const root = document.documentElement;

function applyMode(mode) {
  if (mode === 'dark') {
    root.setAttribute('data-mode', 'dark');
    modeIcon.classList.remove('fa-moon');
    modeIcon.classList.add('fa-sun');
  } else {
    root.removeAttribute('data-mode');
    modeIcon.classList.remove('fa-sun');
    modeIcon.classList.add('fa-moon');
  }
}

const savedMode = localStorage.getItem('portfolio-mode');
if (savedMode) applyMode(savedMode);

modeToggle.addEventListener('click', () => {
  const isDark = root.getAttribute('data-mode') === 'dark';
  const next = isDark ? 'light' : 'dark';
  applyMode(next);
  localStorage.setItem('portfolio-mode', next);
});

// scroll reveal animations (sections, skill bars, project cards, stats)
const revealEls = document.querySelectorAll('[data-reveal]');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => revealObserver.observe(el));

// back to top button
const backToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 500);
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// scroll progress bar
const scrollProgress = document.getElementById('scroll-progress');

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrollProgress.style.width = pct + '%';
});

// active nav link highlight while scrolling
const navLinks = document.querySelectorAll('[data-nav-link]');
const sections = Array.from(navLinks).map(link => document.querySelector(link.getAttribute('href')));

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = '#' + entry.target.id;
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === id);
      });
    }
  });
}, { rootMargin: '-45% 0px -45% 0px' });

sections.forEach(section => { if (section) navObserver.observe(section); });

// hero typing effect
const typingEl = document.getElementById('typing-text');
const typingPhrases = ['Front-End Web Developer', 'IT Student', 'AI Enthusiast'];
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (typingEl) {
  if (prefersReducedMotion) {
    typingEl.textContent = typingPhrases[0];
  } else {
    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function typeLoop() {
      const current = typingPhrases[phraseIndex];
      if (!deleting) {
        charIndex++;
        typingEl.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(typeLoop, 1400);
          return;
        }
      } else {
        charIndex--;
        typingEl.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % typingPhrases.length;
        }
      }
      setTimeout(typeLoop, deleting ? 45 : 80);
    }
    typeLoop();
  }
}

// stats counter animation
const statNumbers = document.querySelectorAll('.stat-number');
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-count'), 10);
      let current = 0;
      const step = Math.max(1, Math.ceil(target / 40));
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = current;
      }, 35);
      statsObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

statNumbers.forEach(el => statsObserver.observe(el));

// project filtering
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.getAttribute('data-filter');

    projectCards.forEach(card => {
      const matches = filter === 'all' || card.getAttribute('data-category') === filter;
      card.classList.toggle('filtered-out', !matches);
    });
  });
});

// contact form validation
const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');

function setError(fieldId, message) {
  const row = document.getElementById(fieldId).closest('.form-row');
  const errorEl = document.getElementById(fieldId + '-error');
  if (message) {
    row.classList.add('invalid');
    errorEl.textContent = message;
  } else {
    row.classList.remove('invalid');
    errorEl.textContent = '';
  }
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  status.textContent = '';
  status.classList.remove('success');

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  let valid = true;

  if (!name) {
    setError('name', 'Enter your name.');
    valid = false;
  } else {
    setError('name', '');
  }

  if (!email) {
    setError('email', 'Enter your email.');
    valid = false;
  } else if (!isValidEmail(email)) {
    setError('email', 'Enter a valid email address.');
    valid = false;
  } else {
    setError('email', '');
  }

  if (!message) {
    setError('message', 'Enter a message.');
    valid = false;
  } else {
    setError('message', '');
  }

  if (valid) {
    status.textContent = '✅ Thank you! Your message has been validated successfully.';
    status.classList.add('success');
    form.reset();
  }
});