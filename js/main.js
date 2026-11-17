/**
 * Guía Financiera Yupay — main.js
 * Lógica: sidebar · smooth scroll · scroll spy · dark mode
 */

document.addEventListener('DOMContentLoaded', () => {

  // ── Inicializar íconos Lucide ──
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // ── Elementos del DOM ──
  const sidebar        = document.getElementById('sidebar');
  const overlay        = document.getElementById('sidebarOverlay');
  const hamburgerBtn   = document.getElementById('hamburgerBtn');
  const closeBtn       = document.getElementById('sidebarCloseBtn');
  const navLinks       = document.querySelectorAll('.sidebar__link');

  // ───────────────────────────────────────────
  // 1. SIDEBAR: Abrir / Cerrar (móvil)
  // ───────────────────────────────────────────

  function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('active');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function toggleSidebar() {
    sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
  }

  if (hamburgerBtn) hamburgerBtn.addEventListener('click', toggleSidebar);
  if (closeBtn)     closeBtn.addEventListener('click', closeSidebar);
  if (overlay)      overlay.addEventListener('click', closeSidebar);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('open')) closeSidebar();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) closeSidebar();
  });

  // ───────────────────────────────────────────
  // 2. SMOOTH SCROLL + ESTADO ACTIVO
  // ───────────────────────────────────────────

  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          const topbarHeight = window.innerWidth <= 768 ? 64 : 0;
          const targetTop = targetEl.getBoundingClientRect().top + window.pageYOffset - topbarHeight - 20;
          window.scrollTo({ top: targetTop, behavior: 'smooth' });
          setActiveLink(link);
          if (window.innerWidth <= 768) setTimeout(closeSidebar, 150);
        }
      }
    });
  });

  function setActiveLink(activeLink) {
    navLinks.forEach((l) => l.classList.remove('active'));
    activeLink.classList.add('active');
  }

  // ───────────────────────────────────────────
  // 3. SCROLL SPY
  // ───────────────────────────────────────────

  const sections = document.querySelectorAll('section[id], div[id]');
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0,
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        const matchingLink = document.querySelector(`.sidebar__link[href="#${id}"]`);
        if (matchingLink) setActiveLink(matchingLink);
      }
    });
  }, observerOptions);

  sections.forEach((section) => sectionObserver.observe(section));

  // ───────────────────────────────────────────
  // 4. BOTÓN "Empezar la Guía" → scroll a guía 1
  // ───────────────────────────────────────────

  const startBtn = document.querySelector('.btn--primary[href="#modulo1"]');
  if (startBtn) {
    startBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById('modulo1');
      if (target) {
        const topbarHeight = window.innerWidth <= 768 ? 64 : 0;
        const targetTop = target.getBoundingClientRect().top + window.pageYOffset - topbarHeight - 20;
        window.scrollTo({ top: targetTop, behavior: 'smooth' });
      }
    });
  }

  // ───────────────────────────────────────────
  // 5. DARK MODE
  // ───────────────────────────────────────────

  const DARK_KEY = 'yupay-dark-mode';

  // Inyectar botón flotante para escritorio
  const desktopThemeBtn = document.createElement('button');
  desktopThemeBtn.className = 'topbar__theme-btn--desktop';
  desktopThemeBtn.id = 'themeToggleBtnDesktop';
  desktopThemeBtn.setAttribute('aria-label', 'Alternar modo oscuro');
  desktopThemeBtn.innerHTML = '<i data-lucide="sun"></i>';
  document.body.appendChild(desktopThemeBtn);

  // Botón del topbar móvil
  const mobileThemeBtn = document.getElementById('themeToggleBtn');

  function applyTheme(isDark) {
    document.body.classList.toggle('dark-mode', isDark);
    // Actualizar ícono en ambos botones
    [desktopThemeBtn, mobileThemeBtn].forEach((btn) => {
      if (!btn) return;
      const iconEl = btn.querySelector('i');
      if (iconEl) {
        iconEl.setAttribute('data-lucide', isDark ? 'moon' : 'sun');
      }
    });
    // Re-renderizar íconos Lucide
    if (typeof lucide !== 'undefined') lucide.createIcons();
    // Guardar preferencia
    localStorage.setItem(DARK_KEY, isDark ? '1' : '0');
  }

  function toggleTheme() {
    const isDark = !document.body.classList.contains('dark-mode');
    applyTheme(isDark);
  }

  // Leer preferencia guardada
  const savedPref = localStorage.getItem(DARK_KEY);
  if (savedPref === '1') {
    applyTheme(true);
  } else if (savedPref === null && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    // Respetar preferencia del sistema operativo si no hay preferencia guardada
    applyTheme(true);
  }

  desktopThemeBtn.addEventListener('click', toggleTheme);
  if (mobileThemeBtn) mobileThemeBtn.addEventListener('click', toggleTheme);

  // ───────────────────────────────────────────
  // 6. LOG de bienvenida
  // ───────────────────────────────────────────

  console.log(
    '%c🐝 Guía Financiera Yupay — Inicializado%c\nVersión 2.0 · Gestión de Emprendimientos',
    'color: #6CB36E; font-weight: bold; font-size: 14px;',
    'color: #6B7280; font-size: 12px;'
  );

});
