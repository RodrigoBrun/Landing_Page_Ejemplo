/* =========================================================
   Landing Premium Genérica — script.js (FIXED)
   Cambios:
   - Envuelto en DOMContentLoaded para asegurar que el DOM exista.
   - Asegurate que en el CSS exista `.mobile-menu.open { display:block }`
========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  // ================================
  // 1) Helpers
  // ================================
  const $ = (s, sc = document) => sc.querySelector(s);
  const $$ = (s, sc = document) => [...sc.querySelectorAll(s)];
  const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

  // Smooth scroll para anchors
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // cerrar menú móvil si corresponde
      $('#mobile-menu')?.classList.remove('open');
    });
  });

  // ================================
  // 2) AOS
  // ================================
  window.AOS && AOS.init({
    once: true,
    duration: 800,
    easing: 'ease-out-cubic',
    offset: 10,
  });

  // ================================
  // 3) Menú móvil + Tema (persistencia)
  // ================================
  const btnMenu = $('#btn-menu');
  const mobileMenu = $('#mobile-menu');
  btnMenu?.addEventListener('click', () => {
    mobileMenu?.classList.toggle('open');
  });

  const THEME_KEY = 'lp-theme';
  const btnTheme = $('#btn-theme');
  const applyTheme = (mode) => {
    document.body.classList.toggle('theme-light', mode === 'light');
    localStorage.setItem(THEME_KEY, mode);
    // Cambiar icono
    const icon = btnTheme?.querySelector('i');
    if (icon) icon.className = mode === 'light' ? 'ph ph-moon-stars' : 'ph ph-sun-dim';
  };
  // Estado inicial
  applyTheme(localStorage.getItem(THEME_KEY) || 'dark');
  btnTheme?.addEventListener('click', () => {
    const next = document.body.classList.contains('theme-light') ? 'dark' : 'light';
    applyTheme(next);
  });

  // ================================
  // 4) Contadores (cuando entran en viewport)
  // ================================
  const counters = $$('.num');
  const obsCounter = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const to = parseFloat(el.getAttribute('data-count') || '0');
      const isFloat = String(to).includes('.');
      const dur = 1200;
      const start = performance.now();

      const step = (t) => {
        const p = clamp((t - start) / dur, 0, 1);
        const val = to * (0.1 + 0.9 * p*p); // ease
        el.textContent = isFloat ? val.toFixed(1) : Math.round(val);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      obs.unobserve(el);
    });
  }, { threshold: .25 });
  counters.forEach(c => obsCounter.observe(c));

  // ================================
  // 5) Slider de testimonios
  // ================================
  const SLIDES_DATA = [
    {
      quote: "Quedó increíble. Subió la tasa de contacto 2x y cargaba rapidísimo.",
      author: "María R., Estudio Contable"
    },
    {
      quote: "Metimos la landing en campañas y fue un golazo. Gestión impecable.",
      author: "Santiago P., Agencia Digital"
    },
    {
      quote: "Me dio una imagen premium y clara. En 48h ya estaba online.",
      author: "Lucía D., Eventos"
    }
  ];

  const slidesWrap = $('#slides');
  if (slidesWrap){
    // Render
    SLIDES_DATA.forEach(({quote, author}) => {
      const slide = document.createElement('div');
      slide.className = 'slide';
      slide.innerHTML = `
        <blockquote>“${quote}”</blockquote>
        <footer>— ${author}</footer>
      `;
      slidesWrap.appendChild(slide);
    });

    let idx = 0;
    const prev = $('.slider-btn.prev');
    const next = $('.slider-btn.next');

    const go = (i) => {
      idx = (i + SLIDES_DATA.length) % SLIDES_DATA.length;
      slidesWrap.style.transform = `translateX(-${idx * 100}%)`;
    };
    prev?.addEventListener('click', ()=> go(idx-1));
    next?.addEventListener('click', ()=> go(idx+1));

    // Auto-play (pausa al hover)
    let timer = setInterval(()=> go(idx+1), 4000);
    slidesWrap.addEventListener('mouseenter', ()=> clearInterval(timer));
    slidesWrap.addEventListener('mouseleave', ()=> timer = setInterval(()=> go(idx+1), 4000));
  }

  // ================================
  // 6) Contacto
  // ================================
  const WHATSAPP = '59892992182'; // Uruguay 598 + número (editar)
  $('#btn-whatsapp')?.addEventListener('click', () => {
    const nombre = $('[name="nombre"]')?.value?.trim() || '';
    const mensaje = $('[name="mensaje"]')?.value?.trim() || '';
    const texto = `Hola! Soy ${nombre}. Quiero mi landing premium. Detalles: ${mensaje}`;
    const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
  });

  $('#contact-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('¡Gracias! Te responderemos hoy. (Conectar a EmailJS o Sheets acá)');
    e.target.reset();
  });

  // ================================
  // 7) Año footer
  // ================================
  $('#year').textContent = new Date().getFullYear();
});
