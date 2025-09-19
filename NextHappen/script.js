document.addEventListener('DOMContentLoaded', () => {
  // =====================
  // Burger menu
  // =====================
  const nav = document.querySelector('#nav');
  const openBtn = document.querySelector('#open');
  const closeBtn = document.querySelector('#close');

  openBtn?.addEventListener('click', () => nav?.classList.add('visible'));
  closeBtn?.addEventListener('click', () => nav?.classList.remove('visible'));

  // (opcional) cerrar al click fuera
  document.addEventListener('click', (e) => {
    if (!nav?.classList.contains('visible')) return;
    const clickedInside = nav.contains(e.target) || openBtn?.contains(e.target);
    if (!clickedInside) nav.classList.remove('visible');
  });

  // =====================
  // Carruseles reutilizables (seguros)
  // =====================
  function setupCarousel(carouselId, cardSelector, containerSelector) {
    let index = 0;
    const carousel = document.getElementById(carouselId);
    const container = document.querySelector(containerSelector);

    if (!carousel || !container) {
      // No existe el carrusel/contendor: devuelve no-op para evitar errores.
      return function noop() {};
    }

    // Calcula las tarjetas dinámicamente por si el layout cambia
    const getCards = () => Array.from(document.querySelectorAll(cardSelector));

    function getCardWidth() {
      const cards = getCards();
      if (!cards.length) return 0; // sin tarjetas, evita errores
      const first = cards[0];
      // ancho visual
      const rect = first.getBoundingClientRect();
      // márgenes horizontales
      const style = window.getComputedStyle(first);
      const ml = parseFloat(style.marginLeft || '0');
      const mr = parseFloat(style.marginRight || '0');

      // intenta tomar el gap del contenedor si existe
      const cStyle = window.getComputedStyle(container);
      const colGap = parseFloat(cStyle.columnGap || cStyle.gap || '0');

      // usa el mayor entre margin/gap (dependiendo de tu CSS)
      const extra = Math.max(mr + ml, colGap || 0);
      // evita 0 para no dividir por 0
      const width = rect.width + extra;
      return width > 0 ? width : 1;
    }

    function getVisibleCount() {
      const w = getCardWidth();
      if (!w) return 1;
      const vis = Math.floor(container.clientWidth / w);
      return Math.max(1, vis || 1);
    }

    function clampIndex(idx) {
      const total = getCards().length;
      const max = Math.max(0, total - getVisibleCount());
      if (idx < 0) return 0;
      if (idx > max) return max;
      return idx;
    }

    function applyTransform() {
      const shift = -index * getCardWidth();
      carousel.style.transform = `translateX(${shift}px)`;
    }

    function move(direction) {
      const next = clampIndex(index + (direction === 1 ? 1 : -1));
      if (next === index) return;
      index = next;
      applyTransform();
    }

    // Recalcular al redimensionar
    window.addEventListener('resize', () => {
      index = clampIndex(index);
      applyTransform();
    });

    // primer ajuste
    applyTransform();

    return move;
  }

  // Exponer funciones para los botones onclick del HTML
  window.moveMain = setupCarousel("carousel", ".card", ".carousel-container");
  window.moveValues = setupCarousel("valuesCarousel", ".values-card", ".values-cards-container");
  window.moveFunctions = setupCarousel("functionsCarousel", ".functions-card", ".functions-cards-container");

  // =====================
  // i18n (ES/EN) con persistencia
  // =====================
  const I18N = {
    es: window.I18N_ES || {},
    en: window.I18N_EN || {}
  };

  const LANG_KEY = "nexthappen-lang";
  const langToggle = document.getElementById("lang-toggle");

  function getLang() {
    const saved = localStorage.getItem(LANG_KEY);
    return saved === 'en' ? 'en' : 'es';
  }

  function setLang(lang) {
    localStorage.setItem(LANG_KEY, lang);
  }

  function translatePage(lang) {
    const dict = I18N[lang] || {};
    // data-i18n -> innerText
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (dict[key] !== undefined) el.innerText = dict[key];
    });
    // data-i18n-html -> innerHTML
    document.querySelectorAll("[data-i18n-html]").forEach(el => {
      const key = el.getAttribute("data-i18n-html");
      if (dict[key] !== undefined) el.innerHTML = dict[key];
    });
    // data-i18n-alt -> alt
    document.querySelectorAll("[data-i18n-alt]").forEach(el => {
      const key = el.getAttribute("data-i18n-alt");
      if (dict[key] !== undefined) el.setAttribute("alt", dict[key]);
    });

    // atributo lang para accesibilidad/SEO
    document.documentElement.setAttribute("lang", lang);

    // label del botón (mostrar el alternativo)
    if (langToggle && dict["nav.idioma"] !== undefined) {
      langToggle.innerText = dict["nav.idioma"];
    }
  }

  // Inicializar traducción cuando el DOM ya está listo y diccionarios cargados
  const current = getLang();
  translatePage(current);

  // Toggle de idioma
  langToggle?.addEventListener("click", (e) => {
    e.preventDefault();
    const next = getLang() === "es" ? "en" : "es";
    setLang(next);
    translatePage(next);
    // UX: cerrar el menú tras cambiar idioma
    nav?.classList.remove("visible");
  });
});
