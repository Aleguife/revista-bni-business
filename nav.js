/**
 * nav.js — Revista BNI Business
 * Gera dinamicamente a navbar em todas as páginas.
 * Coloque <script src="/nav.js" defer></script> no <head> de cada HTML.
 *
 * Links de idioma: detectados a partir da URL atual.
 * - PT: https://bnibusiness.com.br/<caminho>
 * - EN: https://bnibusiness.com.br/en/<caminho>
 * - ES: https://bnibusiness.com.br/es/<caminho>
 */

(function () {
  'use strict';

  /* ── Resolve URLs de idioma a partir da URL atual ── */
  function getLangUrls() {
    var base = 'https://bnibusiness.com.br';
    var path = window.location.pathname; // ex: /edicao-01/materia-de-capa/ ou /en/edicao-01/materia-de-capa/

    var ptPath, enPath, esPath;

    if (path.startsWith('/en/')) {
      ptPath = path.slice(3);  // remove "/en"
      enPath = path;
      esPath = '/es/' + path.slice(4); // substitui "/en/" por "/es/"
    } else if (path.startsWith('/es/')) {
      ptPath = path.slice(3);
      enPath = '/en/' + path.slice(4);
      esPath = path;
    } else {
      ptPath = path;
      enPath = '/en' + path;
      esPath = '/es' + path;
    }

    return {
      PT: base + ptPath,
      EN: base + enPath,
      ES: base + esPath
    };
  }

  /* ── SVG logo completo (Revista BNI Business) ── */
  var LOGO_SVG = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 192.9 20" height="18" style="display:block" aria-label="Revista BNI Business">'
    + '<defs>'
    + '<clipPath id="nav-cp0"><rect width="192.9" height="20"/></clipPath>'
    + '<clipPath id="nav-cp1"><rect width="192.9" height="20"/></clipPath>'
    + '<clipPath id="nav-cp2"><rect width="192.9" height="20"/></clipPath>'
    + '</defs>'
    + '<g clip-path="url(#nav-cp0)">'
    + '<path fill="#fff" d="M188.88,19.96c2.84,0,4.03-1.59,4.03-3.21,0-1.83-1.59-2.43-2.95-3.04-1.23-.5-2.3-.93-2.3-1.89s.58-1.55,1.51-1.55c.45,0,.82.15,1.16.35l2,2.63.09-.04-.11-2.95-.99.19c-.56-.19-1.4-.37-2.11-.37-2.22,0-3.75,1.23-3.75,3.17,0,1.68,1.27,2.33,2.89,2.97,1.18.49,2.24.93,2.24,1.98,0,.97-.62,1.57-1.64,1.57-1.36,0-1.96-.71-2.84-2.17l-.58-.88-.09-.04.06,2.71c.8.3,2.02.58,3.38.58M180.56,19.96c2.84,0,4.03-1.59,4.03-3.21,0-1.83-1.59-2.43-2.95-3.04-1.23-.5-2.3-.93-2.3-1.89s.58-1.55,1.51-1.55c.45,0,.82.15,1.16.35l2,2.63.09-.04-.11-2.95-.99.19c-.56-.19-1.4-.37-2.11-.37-2.22,0-3.75,1.23-3.75,3.17,0,1.68,1.27,2.33,2.89,2.97,1.18.49,2.24.93,2.24,1.98,0,.97-.62,1.57-1.64,1.57-1.36,0-1.96-.71-2.84-2.17l-.58-.88-.09-.04.06,2.71c.8.3,2.03.58,3.38.58M170.46,13.2c.17-1.87.93-2.89,1.68-2.89,1.1,0,1.34,1.59,1.34,2.89h-3.01ZM171.8,20c2.33,0,3.77-1.18,4.59-3.32l-.13-.06c-.52,1.12-1.38,1.68-2.61,1.68-2,0-3.23-1.66-3.23-3.94,0-.26-.02-.67.02-.93,1.21.04,5.82.11,5.82.11.02-.13.04-.26.04-.41,0-1.33-1.1-3.12-3.86-3.12-2.91,0-5.28,2.18-5.28,5.19,0,2.71,1.98,4.8,4.63,4.8M155.11,19.66h5.49l-.04-.13-.32-.02c-.75-.06-.84-.13-.84-.3v-6.89c.41-.24.82-.45,1.53-.45.95,0,1.66.43,1.66,1.83v5.47c0,.17.04.3-.71.34l-.39.02-.07.13h5.58l-.06-.13-.19-.02c-1.01-.13-1.12-.19-1.12-.32v-5.79c0-1.03-.19-2.07-.69-2.58-.49-.47-.99-.75-1.72-.75-1.4,0-2.78,1.1-3.79,1.98h-.02l.06-1.94-4.48,1.23-.02.09.49.11c.73.19.88.37.88,1.7v5.94c0,.26-.24.3-.9.34l-.26.02-.06.13ZM149,19.66h5.64l-.06-.13-.17-.02c-.99-.11-1.12-.13-1.12-.3v-9.11l-4.41,1.23-.02.09.5.11c.73.19.88.37.88,1.7v5.94c0,.26-.24.3-.9.34l-.26.02-.07.13ZM151.67,8.95c1.19,0,1.83-.91,1.83-1.77s-.65-1.77-1.83-1.77-1.83.88-1.83,1.77.67,1.77,1.83,1.77M144.24,19.96c2.84,0,4.03-1.59,4.03-3.21,0-1.83-1.59-2.43-2.95-3.04-1.23-.5-2.3-.93-2.3-1.89s.58-1.55,1.51-1.55c.45,0,.82.15,1.16.35l2,2.63.09-.04-.11-2.95-.99.19c-.56-.19-1.4-.37-2.11-.37-2.22,0-3.75,1.23-3.75,3.17,0,1.68,1.27,2.33,2.89,2.97,1.18.49,2.24.93,2.24,1.98,0,.97-.62,1.57-1.64,1.57-1.36,0-1.96-.71-2.84-2.17l-.58-.88-.09-.04.06,2.71c.8.3,2.03.58,3.38.58M136.12,20l4.44-1.31.02-.09-.54-.11c-.71-.19-.84-.39-.84-1.64v-6.48h-4.52l.07.13.3.02c.97.06,1.12.09,1.12.3v6.87c-.39.22-.75.45-1.36.45-1.03,0-1.74-.45-1.7-1.81l.07-5.96h-4.59l.07.13.3.02c1.1.09,1.19.17,1.19.26l-.09,5.79c-.04,1.08.17,2.07.69,2.58.52.52.86.8,1.59.8,1.4,0,2.74-1.01,3.81-2h.06l-.09,2.05ZM121.15,12.27v-5.75l.24-.04c1.75,0,3.23.86,3.23,2.86,0,2.13-1.57,3.01-3.38,2.93h-.09ZM122.12,19.44l-.97-.37v-6.59c.07-.02.22-.04.39-.04,1.94,0,3.62,1.25,3.62,3.38s-1.34,3.36-2.86,3.55l-.17.06ZM115.77,19.66h6.87c4.24,0,6.07-1.55,6.07-3.98,0-2.02-1.7-3.32-4.41-3.55v-.04c2.33-.39,3.75-1.29,3.75-2.78,0-2.24-1.77-3.1-6.03-3.1h-6.22l.06.17.58.06c1.08.13,1.2.13,1.2.28v12.36c0,.13-.24.26-.99.37l-.82.09-.06.13Z"/>'
    + '<polygon fill="#fff" points="97.37 0 97.37 9.66 89.77 0 83.88 0 83.88 19.49 89.77 19.49 89.77 9.15 97.97 19.49 103.23 19.49 103.23 0 97.37 0"/>'
    + '<g clip-path="url(#nav-cp1)">'
    + '<path fill="#fff" d="M70.36,11.94h3.1c1.4,0,2.34.51,2.31,1.57-.03,1.02-.86,1.49-1.96,1.49h-3.45v-3.06ZM70.36,4.5h2.27c1.21,0,2.08.34,2.05,1.6-.03,1.09-.98,1.5-2.05,1.5h-2.27v-3.1ZM64.34,19.48h8.03s2.29,0,2.29,0c1.64,0,3.16-.25,4.55-1.06,3.1-1.8,3.37-5.77,1.12-7.9-1.19-1.05-1.98-1.22-2.53-1.39.76-.38,1.48-.88,2.03-1.54.55-.66.9-1.62.86-2.74C80.55.84,77.01,0,74.21,0h-2.8l-7.07.02v19.47Z"/>'
    + '</g>'
    + '<polygon fill="#fff" points="105.72 8.24 105.72 19.49 111.7 19.49 111.7 2.32 105.72 8.24"/>'
    + '<polygon fill="#fff" points="105.72 0 105.72 5.96 111.7 0 105.72 0"/>'
    + '<g clip-path="url(#nav-cp2)">'
    + '<path fill="#fff" d="M1.26,6.14h6.32c2.5,0,4.3,1.42,4.3,3.76,0,1.6-.72,2.75-2.47,3.31v.05c1.42.43,1.94,1.24,2.09,2.9.22,1.96.23,3.06.59,3.24v.13h-2.52c-.34-.22-.34-1.26-.49-3.06-.14-1.58-.88-2.27-2.48-2.27h-2.86v5.33H1.26V6.14ZM3.74,12.3h3.24c1.57,0,2.39-.79,2.39-2.03,0-1.33-.7-2.09-2.3-2.09h-3.33v4.12Z"/>'
    + '<path fill="#fff" d="M12.78,14.75c0-2.86,1.93-5.08,4.77-5.08,1.4,0,2.5.49,3.31,1.35.94.99,1.39,2.5,1.37,4.29h-7.18c.16,1.66,1.04,2.77,2.65,2.77,1.1,0,1.82-.47,2.12-1.26h2.23c-.47,1.73-2.02,3.01-4.38,3.01-3.06,0-4.9-2.23-4.9-5.08ZM15.08,13.87h4.79c-.09-1.58-.94-2.54-2.32-2.54-1.49,0-2.27,1.03-2.47,2.54Z"/>'
    + '<path fill="#fff" d="M22.21,9.92h2.4l1.4,4.48c.41,1.3.81,3.22.81,3.22h.05s.38-1.93.79-3.22l1.46-4.48h2.32l-3.4,9.62h-2.5l-3.33-9.62Z"/>'
    + '<path fill="#fff" d="M32.09,6.14h2.34v2.21h-2.34v-2.21ZM32.13,9.92h2.29v9.62h-2.29v-9.62Z"/>'
    + '<path fill="#fff" d="M35.44,16.59h2.2c.18,1.15,1.06,1.64,2.29,1.64s1.85-.54,1.85-1.31c0-.95-.97-1.13-2.48-1.42-1.8-.36-3.51-.77-3.51-2.95,0-1.82,1.55-2.86,3.8-2.86,2.56,0,3.84,1.15,4.07,2.83h-2.18c-.16-.83-.77-1.28-1.91-1.28-1.06,0-1.62.49-1.62,1.15,0,.85.99,1.01,2.45,1.28,1.82.34,3.62.77,3.62,3.12,0,2.02-1.73,3.08-4.1,3.08-2.74,0-4.32-1.31-4.47-3.26Z"/>'
    + '<path fill="#fff" d="M44.37,9.92h1.48v-3.06h2.25v3.06h1.93v1.57h-1.93v5.38c0,.7.38.9,1.03.9.23,0,.56-.04.74-.07h.11v1.78c-.38.07-.9.14-1.51.14-1.55,0-2.61-.56-2.61-2.25v-5.89h-1.48v-1.57Z"/>'
    + '<path fill="#fff" d="M57.17,18.3h-.04c-.63.85-1.49,1.48-3.02,1.48-1.87,0-3.28-.97-3.28-2.84,0-2.18,1.66-2.7,3.94-2.97,1.58-.2,2.38-.45,2.38-1.31s-.58-1.39-1.73-1.39c-1.28,0-1.91.59-1.96,1.55h-2.16c.07-1.64,1.37-3.13,4.1-3.13,1.1,0,1.94.16,2.57.56.9.54,1.37,1.46,1.37,2.74v5.06c0,.79.14,1.21.36,1.35v.16h-2.21c-.16-.22-.29-.59-.32-1.24ZM57.2,16.05v-1.42c-.45.29-1.17.49-1.87.63-1.4.27-2.21.56-2.21,1.62s.77,1.33,1.66,1.33c1.57,0,2.43-1.08,2.43-2.16Z"/>'
    + '</g>'
    + '</g>'
    + '</svg>';

  /* ── Ícones SVG inline ── */
  var ICON_GLOBE = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>';
  var ICON_MENU  = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';

  /* ── Detecta idioma atual ── */
  function getCurrentLang() {
    return (document.documentElement.dataset.lang || 'PT').toUpperCase();
  }

  /* ── Constrói o HTML da nav ── */
  function buildNav() {
    var urls = getLangUrls();
    var currentLang = getCurrentLang();

    var html = '<div class="nav-logo" role="banner">' + LOGO_SVG + '</div>'
      + '<nav role="navigation" aria-label="Menu principal">'
      + '<div class="nav-menu">'

      /* Dropdown de idioma */
      + '<div class="nav-item" id="item-idiomas">'
      +   '<button class="nav-btn" id="nav-lang-btn" onclick="BNINav.toggleDropdown(\'item-idiomas\')" aria-haspopup="true" aria-expanded="false" aria-label="Selecionar idioma">'
      +     ICON_GLOBE
      +     '<span class="nav-label" id="langLabel">' + currentLang + '</span>'
      +     '<span class="arrow" aria-hidden="true">▼</span>'
      +   '</button>'
      +   '<div class="dropdown" role="menu">'
      +     '<a href="' + urls.PT + '" onclick="BNINav.setLang(\'PT\')" data-lang="PT" role="menuitem">PT — Português</a>'
      +     '<a href="' + urls.EN + '" onclick="BNINav.setLang(\'EN\')" data-lang="EN" role="menuitem">EN — English</a>'
      +     '<a href="' + urls.ES + '" onclick="BNINav.setLang(\'ES\')" data-lang="ES" role="menuitem">ES — Español</a>'
      +   '</div>'
      + '</div>'

      /* Botão Sumário (só presente se a página tiver o overlay #sumario) */
      + '<div class="nav-item" id="nav-sumario-item">'
      +   '<button class="nav-btn" id="nav-sumario-btn" onclick="if(typeof abrirSumario===\'function\')abrirSumario()" aria-label="Abrir sumário">'
      +     ICON_MENU
      +     '<span class="nav-label">Sumário</span>'
      +   '</button>'
      + '</div>'

      + '</div>'  /* .nav-menu */
      + '</nav>';

    return html;
  }

  /* ── Injeta a nav no <body> como primeiro elemento ── */
  function injectNav() {
    /* Evita injeção dupla */
    if (document.getElementById('bni-nav')) return;

    var wrapper = document.createElement('nav');
    wrapper.id = 'bni-nav';
    wrapper.setAttribute('role', 'navigation');
    wrapper.setAttribute('aria-label', 'Menu principal');
    wrapper.innerHTML = buildNav();

    /* Insere antes de qualquer outro elemento do body */
    var body = document.body;
    if (body.firstChild) {
      body.insertBefore(wrapper, body.firstChild);
    } else {
      body.appendChild(wrapper);
    }

    hideLangCurrent();
    hideSumarioIfAbsent();
  }

  /* ── Oculta o idioma atual do dropdown ── */
  function hideLangCurrent() {
    var pageLang = getCurrentLang();
    document.querySelectorAll('#bni-nav .dropdown a[data-lang]').forEach(function (a) {
      a.style.display = (a.dataset.lang === pageLang) ? 'none' : '';
    });
    var label = document.getElementById('langLabel');
    if (label) label.textContent = pageLang;
  }

  /* ── Oculta o botão "Sumário" se a página não tiver o overlay ── */
  function hideSumarioIfAbsent() {
    var sumarioItem = document.getElementById('nav-sumario-item');
    if (!sumarioItem) return;
    /* Aguarda o DOM completo para checar a existência do overlay */
    document.addEventListener('DOMContentLoaded', function () {
      if (!document.getElementById('sumario')) {
        sumarioItem.style.display = 'none';
      }
    });
  }

  /* ── API pública exposta globalmente ── */
  window.BNINav = {
    toggleDropdown: function (id) {
      var item = document.getElementById(id);
      if (!item) return;
      var isOpen = item.classList.toggle('open');
      var btn = item.querySelector('.nav-btn');
      if (btn) btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    },
    setLang: function (sigla) {
      localStorage.setItem('bni_lang', sigla);
    }
  };

  /* ── Fecha dropdown ao clicar fora ── */
  document.addEventListener('click', function (e) {
    if (!e.target.closest('#bni-nav .nav-item')) {
      document.querySelectorAll('#bni-nav .nav-item').forEach(function (i) {
        i.classList.remove('open');
        var btn = i.querySelector('.nav-btn');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });
    }
  });

  /* ── Fecha dropdown com Escape ── */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('#bni-nav .nav-item').forEach(function (i) {
        i.classList.remove('open');
      });
    }
  });

  /* ── Injeta assim que o body estiver disponível ── */
  if (document.body) {
    injectNav();
  } else {
    document.addEventListener('DOMContentLoaded', injectNav);
  }

})();
