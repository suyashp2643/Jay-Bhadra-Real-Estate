/* =============================================
   JAY BHADRA BUILDERS — MAIN JS
   Pure Vanilla JS · No Dependencies
   ============================================= */
'use strict';

const CONFIG = {
  whatsapp: '91919765711811',   // UPDATE: Replace with actual WhatsApp number
  phone: '+91919765711811',     // UPDATE: Replace with actual phone number
};

const WA_DEFAULT = encodeURIComponent(
  "Hello Jay Bhadra Builders! I'm interested in your properties. Please share more details."
);

document.addEventListener('DOMContentLoaded', () => {
  initTopStrip();
  initNavbar();
  initMobileNav();
  initIntersectionObserver();
  initCounters();
  initModal();
  initTestimonialSlider();
  initFilterSystem();
  initForms();
  setActiveNav();
});

/* ── Top Strip Dismiss ── */
function initTopStrip() {
  const btn = document.querySelector('.strip-dismiss');
  const strip = document.querySelector('.top-strip');
  if (!btn || !strip) return;
  btn.addEventListener('click', () => {
    strip.style.transition = 'max-height .3s, opacity .3s, padding .3s';
    strip.style.maxHeight = strip.offsetHeight + 'px';
    requestAnimationFrame(() => {
      strip.style.maxHeight = '0';
      strip.style.opacity = '0';
      strip.style.padding = '0';
      strip.style.overflow = 'hidden';
    });
    setTimeout(() => strip.remove(), 350);
  });
}

/* ── Sticky Navbar ── */
function initNavbar() {
  const nav = document.querySelector('.navbar');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ── Mobile Hamburger + Drawer ── */
function initMobileNav() {
  const burger  = document.querySelector('.hamburger');
  const drawer  = document.querySelector('.nav-drawer');
  const overlay = document.querySelector('.nav-overlay');
  if (!burger || !drawer) return;

  const open = () => {
    burger.classList.add('open');
    drawer.classList.add('open');
    overlay && overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    burger.classList.remove('open');
    drawer.classList.remove('open');
    overlay && overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  burger.addEventListener('click', () => burger.classList.contains('open') ? close() : open());
  overlay && overlay.addEventListener('click', close);
  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => e.key === 'Escape' && close());
}

/* ── Intersection Observer — Fade Animations ── */
function initIntersectionObserver() {
  const els = document.querySelectorAll('.fade-up, .fade-in');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => io.observe(el));
}

/* ── Animated Counters ── */
function initCounters() {
  const els = document.querySelectorAll('[data-counter]');
  if (!els.length) return;
  const animate = (el) => {
    const target = parseInt(el.getAttribute('data-counter'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const dur = 1800;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(eased * target) + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target + suffix;
    };
    requestAnimationFrame(tick);
  };
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { animate(e.target); io.unobserve(e.target); } });
  }, { threshold: 0.5 });
  els.forEach(el => io.observe(el));
}

/* ── Enquiry Modal ── */
function initModal() {
  const overlay = document.querySelector('.modal-overlay');
  const closeBtn = document.querySelector('.modal-close');
  if (!overlay) return;

  const open = (name) => {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    const f = overlay.querySelector('#modal-project-name');
    if (f && name) f.value = name;
  };
  const close = () => {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  overlay.addEventListener('click', e => e.target === overlay && close());
  closeBtn && closeBtn.addEventListener('click', close);
  document.addEventListener('keydown', e => e.key === 'Escape' && close());

  document.querySelectorAll('[data-enquire]').forEach(btn => {
    btn.addEventListener('click', () => open(btn.getAttribute('data-enquire')));
  });

  const form = overlay.querySelector('.modal-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name    = form.querySelector('#modal-name')?.value || '';
      const phone   = form.querySelector('#modal-phone')?.value || '';
      const project = form.querySelector('#modal-project-name')?.value || 'your properties';
      const bhk     = form.querySelector('#modal-bhk')?.value || '';
      const msg = encodeURIComponent(
        `Hello Jay Bhadra Builders!\n\nName: ${name}\nPhone: ${phone}\nInterested In: ${project}${bhk ? '\nBHK: ' + bhk : ''}\n\nPlease share more details.`
      );
      window.open(`https://wa.me/${CONFIG.whatsapp}?text=${msg}`, '_blank');
      close();
    });
  }

  window.openEnquiryModal = open;
}

/* ── Testimonial Auto-Slider ── */
function initTestimonialSlider() {
  const track  = document.querySelector('.testimonial-track');
  if (!track) return;
  const cards  = track.querySelectorAll('.testimonial-card');
  const dots   = document.querySelectorAll('.slider-dot');
  const prev   = document.querySelector('.slider-prev');
  const next   = document.querySelector('.slider-next');
  let cur = 0, timer;

  const go = (idx) => {
    cur = (idx + cards.length) % cards.length;
    track.style.transform = `translateX(-${cur * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === cur));
  };

  dots.forEach((d, i) => d.addEventListener('click', () => { go(i); reset(); }));
  prev && prev.addEventListener('click', () => { go(cur - 1); reset(); });
  next && next.addEventListener('click', () => { go(cur + 1); reset(); });

  const reset = () => { clearInterval(timer); timer = setInterval(() => go(cur + 1), 5000); };
  reset(); go(0);
}

/* ── Project Filter + Search ── */
function initFilterSystem() {
  const grid = document.querySelector('.projects-grid[data-filterable]');
  if (!grid) return;

  let activeFilter = 'all';
  let searchTerm = '';

  const apply = () => {
    grid.querySelectorAll('.project-card[data-filter]').forEach(card => {
      const tags   = card.getAttribute('data-filter').split(' ');
      const title  = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
      const meta   = card.querySelector('.card-meta')?.textContent.toLowerCase() || '';
      const matchF = activeFilter === 'all' || tags.includes(activeFilter);
      const matchS = !searchTerm || title.includes(searchTerm) || meta.includes(searchTerm);
      card.style.display = matchF && matchS ? '' : 'none';
    });
  };

  document.querySelectorAll('.filter-btn[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn[data-filter]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.getAttribute('data-filter');
      apply();
    });
  });

  const searchInput = document.querySelector('.search-bar input');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      searchTerm = searchInput.value.toLowerCase().trim();
      apply();
    });
  }
  apply();
}

/* ── Form Validation + WhatsApp Submit ── */
function initForms() {
  document.querySelectorAll('form[data-validate]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;

      form.querySelectorAll('[required]').forEach(field => {
        const grp = field.closest('.form-group');
        const err = grp?.querySelector('.form-error');
        const val = field.value.trim();
        let msg = '';

        if (!val) {
          msg = 'This field is required.';
        } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
          msg = 'Please enter a valid email address.';
        } else if (field.type === 'tel' && !/^\d{10}$/.test(val.replace(/\D/g, ''))) {
          msg = 'Please enter a valid 10-digit phone number.';
        }

        field.classList.toggle('error', !!msg);
        if (err) { err.textContent = msg; err.classList.toggle('show', !!msg); }
        if (msg) valid = false;
      });

      if (valid) submitToWhatsApp(form);
    });

    form.querySelectorAll('[required]').forEach(field => {
      field.addEventListener('input', () => {
        field.classList.remove('error');
        const err = field.closest('.form-group')?.querySelector('.form-error');
        if (err) err.classList.remove('show');
      });
    });
  });
}

function submitToWhatsApp(form) {
  const data = {};
  new FormData(form).forEach((v, k) => { if (v) data[k] = v; });
  const lines = Object.entries(data).map(([k, v]) =>
    `${k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}: ${v}`
  );
  const msg = encodeURIComponent('Hello Jay Bhadra Builders!\n\n' + lines.join('\n') + '\n\nPlease get in touch with me.');
  window.open(`https://wa.me/${CONFIG.whatsapp}?text=${msg}`, '_blank');
  showSuccess(form);
}

function showSuccess(form) {
  if (form.querySelector('.form-success')) return;
  const div = document.createElement('div');
  div.className = 'form-success';
  div.style.cssText = 'background:#d4f0e3;color:#1a6b45;border:1px solid #a8dfc0;border-radius:8px;padding:14px 18px;margin-top:16px;font-size:0.875rem;';
  div.textContent = '✅ Thank you! We\'ll get back to you shortly via WhatsApp.';
  form.appendChild(div);
  form.reset();
  setTimeout(() => div.remove(), 8000);
}

/* ── Set Active Nav Link ── */
function setActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-drawer a').forEach(a => {
    const href = a.getAttribute('href') || '';
    const isActive = href === page || (page === '' && href === 'index.html');
    if (isActive) a.classList.add('active');
  });
}
