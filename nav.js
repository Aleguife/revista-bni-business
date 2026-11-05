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
    var base = window.location.origin;
    var path = window.location.pathname; // ex: /edicao-02/materia-de-capa/ ou /en/edicao-02/materia-de-capa/

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

  /* ── Logo Alef Business para o cabeçalho vermelho ── */
  var LOGO_SVG = '<img src="/assets/img/logo-alef-business-inverse.svg" alt="Alef Business" height="20" style="display:block;width:auto;max-width:145px">';

  /* ── Ícones SVG inline ── */
  var ICON_GLOBE = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>';
  var ICON_MENU  = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
  var ICON_HOME  = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>';

  /* ── Detecta idioma atual ── */
  function getCurrentLang() {
    return (document.documentElement.dataset.lang || 'PT').toUpperCase();
  }

  /* ── Constrói o HTML da nav ── */
  function buildNav() {
    var urls = getLangUrls();
    var currentLang = getCurrentLang();

    var html = '<a href="' + window.location.origin + '" class="nav-logo" aria-label="Alef Business — Página inicial" style="text-decoration:none">' + LOGO_SVG + '</a>'
      + '<nav aria-label="Menu principal">'
      + '<div class="nav-menu">'

      /* Link Home */
      + '<div class="nav-item">'
      +   '<a class="nav-btn" href="' + window.location.origin + '" aria-label="Página inicial">'
      +     ICON_HOME
      +     '<span class="nav-label">Home</span>'
      +   '</a>'
      + '</div>'

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

      /* Botão Sumário (só visível dentro de uma edição; aponta pra página índice) */
      + '<div class="nav-item" id="nav-sumario-item">'
      +   '<a class="nav-btn" id="nav-sumario-link" href="#" aria-label="Ver sumário desta edição">'
      +     ICON_MENU
      +     '<span class="nav-label">Sumário</span>'
      +   '</a>'
      + '</div>'

      + '</div>'  /* .nav-menu */
      + '</nav>';

    return html;
  }

  /* ── Injeta a nav no <body> como primeiro elemento ── */
  function injectNav() {
    /* Evita injeção dupla */
    if (document.getElementById('bni-nav')) return;

    var wrapper = document.createElement('header');
    wrapper.id = 'bni-nav';
    wrapper.setAttribute('aria-label', 'Cabeçalho da página');
    wrapper.innerHTML = buildNav();

    /* Insere antes de qualquer outro elemento do body */
    var body = document.body;
    if (body.firstChild) {
      body.insertBefore(wrapper, body.firstChild);
    } else {
      body.appendChild(wrapper);
    }

    hideLangCurrent();
    configureSumarioButton();
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

  /* ── Configura o botão "Sumário" ──
   * Detecta se a URL atual está dentro de uma edição (/edicao-XX/) e:
   *   - dentro: aponta pra /[lang/]edicao-XX/ (página índice)
   *   - fora:   esconde o botão
   */
  function configureSumarioButton() {
    var item = document.getElementById('nav-sumario-item');
    var link = document.getElementById('nav-sumario-link');
    if (!item || !link) return;

    var match = location.pathname.match(/\/edicao-(\d+)\//);
    if (!match) {
      item.style.display = 'none';
      return;
    }

    var edicao = 'edicao-' + match[1];
    var langMatch = location.pathname.match(/^\/(en|es)\//);
    var prefix = langMatch ? '/' + langMatch[1] + '/' : '/';
    var indiceUrl = prefix + edicao + '/';

    /* Esconde se ja estiver na propria pagina indice (URL termina em /edicao-XX/) */
    var pathNoTrailingSlash = location.pathname.replace(/\/$/, '');
    var indiceNoTrailingSlash = indiceUrl.replace(/\/$/, '');
    if (pathNoTrailingSlash === indiceNoTrailingSlash) {
      item.style.display = 'none';
      return;
    }

    link.href = indiceUrl;
  }

  /* ── Navegação anterior/próxima da Edição 03 ──
   * Mantém a sequência centralizada: as três versões de idioma usam os
   * mesmos slugs, mudando apenas o prefixo (/en ou /es).
   */
  function configureArticleNavigation() {
    var editionThree = [
      'conexoes-ia',
      'peter-lima-mercado-imobiliario',
      'tais-araujo-lideranca',
      'thomas-pillet-up-brasil',
      'joias-estilo-pessoal',
      'saude-mental-negocios',
      'ceo-do-seu-cerebro',
      'aposentadoria-sem-rh',
      'wilson-borges-alta-performance',
      'lideranca-sem-fronteiras',
      'conexoes-reais-networking',
      'comandante-ramos-lideranca',
      'stella-onisko-arquitetura',
      'marca-nao-e-enfeite',
      'vitae-flux-cuidado-integrativo',
      'rafael-oleinik-case-sucesso'
    ];
    var match = location.pathname.match(/^\/(?:en\/|es\/)?edicao-03\/([^/]+)\/?$/);
    if (!match) return;

    var language = location.pathname.indexOf('/en/') === 0 ? 'en' : (location.pathname.indexOf('/es/') === 0 ? 'es' : 'pt');
    // Until the remaining translations are published, EN and ES expose
    // only the three pages that already exist and return to their contents.
    var available = editionThree;
    var current = available.indexOf(match[1]);
    if (current < 0) return;

    var prefix = language === 'pt' ? '' : '/' + language;
    var copy = language === 'en'
      ? { prev: 'Previous Article', next: 'Next Article', contents: 'Contents' }
      : language === 'es'
        ? { prev: 'Artículo anterior', next: 'Artículo siguiente', contents: 'Sumario' }
        : { prev: 'Matéria anterior', next: 'Próxima matéria', contents: 'Sumário' };
    var prev = document.querySelector('.nav-edicao-prev');
    var next = document.querySelector('.nav-edicao-next');
    var prevTarget = current === 0 ? prefix + '/edicao-03/' : prefix + '/edicao-03/' + available[current - 1] + '/';
    var nextTarget = current === available.length - 1 ? prefix + '/edicao-03/' : prefix + '/edicao-03/' + available[current + 1] + '/';

    if (prev) {
      prev.href = prevTarget;
      prev.setAttribute('aria-label', current === 0 ? copy.contents : copy.prev);
    }
    if (next) {
      next.href = nextTarget;
      next.setAttribute('aria-label', current === available.length - 1 ? copy.contents : copy.next);
    }
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
    configureArticleNavigation();
  } else {
    document.addEventListener('DOMContentLoaded', function () {
      injectNav();
      configureArticleNavigation();
    });
  }

})();
