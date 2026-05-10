/* ============================================================
   analytics-events.js — Revista BNI Business
   Eventos GA4 para mensurar engajamento e conversoes:
     - cta_click       — clique em botao da secao CTA da materia
     - share_click     — clique em botao de compartilhamento
     - outbound_click  — clique em link externo (fora do dominio)
     - scroll_depth    — marcos de 25/50/75/100% de scroll da pagina
     - read_complete   — leitor chegou a 90% do conteudo da materia
   Cada evento dispara no maximo 1x por sessao de pagina.
   ============================================================ */
(function () {
  'use strict';

  // gtag pode nao ter carregado ainda — usar dataLayer direto e fallback seguro
  function track(eventName, params) {
    try {
      if (typeof window.gtag === 'function') {
        window.gtag('event', eventName, params || {});
      } else if (window.dataLayer && typeof window.dataLayer.push === 'function') {
        window.dataLayer.push(Object.assign({ event: eventName }, params || {}));
      }
    } catch (e) { /* nunca quebrar a pagina por causa de tracking */ }
  }

  // ── Contexto da pagina (slug, edicao, idioma) ──────────────
  function getPageContext() {
    var path = window.location.pathname; // ex: /edicao-02/tonos/
    var lang = (document.documentElement.lang || 'pt').toLowerCase().split('-')[0];

    // padrao: [/lang]/edicao-XX/slug/
    var match = path.match(/(?:\/(en|es))?\/(edicao-\d+)\/([^\/]+)\/?/);
    var edicao = match ? match[2] : '';
    var slug = match ? match[3] : '';

    // 'index' nao e materia
    if (slug === 'index.html' || slug === '') slug = '';

    return {
      lang: lang,
      edicao: edicao,
      materia_slug: slug,
      page_title: document.title || ''
    };
  }

  var ctx = getPageContext();
  var isMateria = !!ctx.materia_slug;

  // ── Detecta canal pelo botao (.cta-btn--whatsapp, etc) ─────
  function detectCanal(el) {
    var cls = (el.className || '').toString();
    var match = cls.match(/cta-btn--(\w+)|share-btn--(\w+)/);
    return match ? (match[1] || match[2]) : 'desconhecido';
  }

  function getButtonLabel(el) {
    return (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 80);
  }

  // ── CTA + share + outbound clicks (event delegation) ───────
  document.addEventListener('click', function (ev) {
    var anchor = ev.target.closest && ev.target.closest('a');
    if (!anchor) return;

    var href = anchor.getAttribute('href') || '';
    if (!href || href.charAt(0) === '#' || href.indexOf('javascript:') === 0) return;

    var classes = anchor.className.toString();

    // CTA principal
    if (/\bcta-btn\b/.test(classes)) {
      track('cta_click', Object.assign({}, ctx, {
        cta_canal: detectCanal(anchor),
        cta_label: getButtonLabel(anchor),
        outbound_url: href
      }));
      return;
    }

    // Botao de compartilhamento (sidebar ou inline)
    if (/\bshare-btn\b/.test(classes)) {
      track('share_click', Object.assign({}, ctx, {
        share_canal: detectCanal(anchor),
        outbound_url: href
      }));
      return;
    }

    // Outbound click generico (link externo dentro do conteudo)
    try {
      var url = new URL(href, window.location.origin);
      if (url.hostname && url.hostname !== window.location.hostname) {
        track('outbound_click', Object.assign({}, ctx, {
          outbound_url: href,
          outbound_host: url.hostname
        }));
      }
    } catch (e) { /* href relativo invalido — ignora */ }
  }, { passive: true });

  // ── Scroll depth + read_complete (apenas em paginas de materia) ─
  if (isMateria) {
    var scrollMarks = [25, 50, 75, 100];
    var firedScroll = {};
    var firedReadComplete = false;
    var artigoEl = document.querySelector('main.artigo, article.materia, article');
    var ticking = false;

    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        var scrollTop = window.scrollY || window.pageYOffset;
        var docHeight = document.documentElement.scrollHeight - window.innerHeight;
        var pct = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;

        for (var i = 0; i < scrollMarks.length; i++) {
          var mark = scrollMarks[i];
          if (pct >= mark && !firedScroll[mark]) {
            firedScroll[mark] = true;
            track('scroll_depth', Object.assign({}, ctx, { percent: mark }));
          }
        }

        // read_complete: 90% do bloco do artigo (nao da pagina inteira)
        if (!firedReadComplete && artigoEl) {
          var artigoTop = artigoEl.offsetTop;
          var artigoHeight = artigoEl.offsetHeight;
          var readPct = (scrollTop - artigoTop + window.innerHeight) / artigoHeight;
          if (readPct >= 0.9) {
            firedReadComplete = true;
            track('read_complete', Object.assign({}, ctx, { threshold: 90 }));
          }
        }

        ticking = false;
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    // Dispara uma vez ao carregar (caso ja esteja com scroll por hash, etc)
    onScroll();
  }
})();
