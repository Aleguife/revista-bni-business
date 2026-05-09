/**
 * sumario.js — Revista BNI Business
 * Sumário data-driven multi-edição multi-idioma.
 * Detecta a edição pela URL (/edicao-XX/) e o idioma por <html lang>.
 *
 * Para adicionar uma nova edição: popule SUMARIOS['edicao-XX'] abaixo.
 *
 * Carregar com:
 *   <script src="/sumario.js?v=N" defer></script>
 *
 * Expõe globalmente: abrirSumario(), fecharSumario()
 */

(function () {
  'use strict';

  /* ── DADOS DOS SUMARIOS POR EDIÇÃO ──────────────────────────────
   * Cada item: { num, slug, secao: { pt, en, es }, desc: { pt, en, es } }
   * Para adicionar Edição 01, popule SUMARIOS['edicao-01'] com 16 itens.
   */
  var SUMARIOS = {
    'edicao-01': [
      // Adicione aqui os 16 itens da Edição 01 quando os títulos forem definidos.
    ],
    'edicao-02': [
      { num: 1,  slug: 'eventos',
        secao: { pt: 'Eventos',                 en: 'Events',                 es: 'Eventos' },
        desc:  { pt: 'Cigar Night',             en: 'Cigar Night',            es: 'Cigar Night' } },
      { num: 2,  slug: 'magna-marinho',
        secao: { pt: 'Case de sucesso',         en: 'Success Story',          es: 'Caso de éxito' },
        desc:  { pt: 'Magna Marinho',           en: 'Magna Marinho',          es: 'Magna Marinho' } },
      { num: 3,  slug: 'jrt-print',
        secao: { pt: 'Case de sucesso',         en: 'Success Story',          es: 'Caso de éxito' },
        desc:  { pt: 'José Roberto Teixeira',   en: 'José Roberto Teixeira',  es: 'José Roberto Teixeira' } },
      { num: 4,  slug: 'materia-de-capa',
        secao: { pt: 'Matéria de Capa',         en: 'Cover Story',            es: 'Portada' },
        desc:  { pt: 'Felipe Xavier',           en: 'Felipe Xavier',          es: 'Felipe Xavier' } },
      { num: 5,  slug: 'alef-editora',
        secao: { pt: 'Editorial',               en: 'Editorial',              es: 'Editorial' },
        desc:  { pt: 'Alef Design + Editora',   en: 'Alef Design + Editora',  es: 'Alef Design + Editora' } },
      { num: 6,  slug: 'up-brasil',
        secao: { pt: 'Negócios',                en: 'Business',               es: 'Negocios' },
        desc:  { pt: 'Up Brasil',               en: 'Up Brasil',              es: 'Up Brasil' } },
      { num: 7,  slug: 'tonos',
        secao: { pt: 'Saúde mental',            en: 'Mental Health',          es: 'Salud mental' },
        desc:  { pt: 'Elisa de Lima',           en: 'Elisa de Lima',          es: 'Elisa de Lima' } },
      { num: 8,  slug: 'aposenta-sp',
        secao: { pt: 'Direito',                 en: 'Law',                    es: 'Derecho' },
        desc:  { pt: 'Dra. Simone Baptista',    en: 'Dra. Simone Baptista',   es: 'Dra. Simone Baptista' } },
      { num: 9,  slug: 'msr-device-golden-store',
        secao: { pt: 'Estilo',                  en: 'Style',                  es: 'Estilo' },
        desc:  { pt: 'MSR Device Golden Store', en: 'MSR Device Golden Store',es: 'MSR Device Golden Store' } },
      { num: 10, slug: 'bni-mundi',
        secao: { pt: 'BNI mundi',               en: 'BNI World',              es: 'BNI Mundi' },
        desc:  { pt: 'BNI Mundi',               en: 'BNI Mundi',              es: 'BNI Mundi' } },
      { num: 11, slug: 'reconhecimento',
        secao: { pt: 'Reconhecimento',          en: 'Recognition',            es: 'Reconocimiento' },
        desc:  { pt: 'Reconhecimento BNI',      en: 'Reconhecimento BNI',     es: 'Reconhecimento BNI' } },
      { num: 12, slug: 'massaru-ogata',
        secao: { pt: 'Desenvolvimento pessoal', en: 'Personal Development',   es: 'Desarrollo personal' },
        desc:  { pt: 'Massaru Ogata',           en: 'Massaru Ogata',          es: 'Massaru Ogata' } },
      { num: 13, slug: 'salleven-eventos',
        secao: { pt: 'Eventos empresariais',    en: 'Corporate Events',       es: 'Eventos empresariales' },
        desc:  { pt: 'Salleven Eventos Empresariais', en: 'Salleven Eventos Empresariais', es: 'Salleven Eventos Empresariais' } },
      { num: 14, slug: 'monaco',
        secao: { pt: 'Turismo',                 en: 'Tourism',                es: 'Turismo' },
        desc:  { pt: 'Trip in Viagens Alphaville', en: 'Trip in Viagens Alphaville', es: 'Trip in Viagens Alphaville' } },
      { num: 15, slug: 'fia-business-school',
        secao: { pt: 'Negócios',                en: 'Business',               es: 'Negocios' },
        desc:  { pt: 'FIA Business School',     en: 'FIA Business School',    es: 'FIA Business School' } },
      { num: 16, slug: 'bni-sao-francisco',
        secao: { pt: 'BNI São Francisco',       en: 'BNI São Francisco',      es: 'BNI São Francisco' },
        desc:  { pt: 'BNI São Francisco',       en: 'BNI São Francisco',      es: 'BNI São Francisco' } },
    ],
  };

  var I18N = {
    fechar: { pt: 'Fechar', en: 'Close', es: 'Cerrar' }
  };

  /* ── DETECÇÃO DE CONTEXTO ─────────────────────────────────────── */
  function detectEdicao() {
    var m = location.pathname.match(/\/edicao-(\d+)\//);
    return m ? 'edicao-' + m[1] : 'edicao-02';
  }

  function detectLang() {
    var docLang = (document.documentElement.lang || '').toLowerCase();
    if (docLang.indexOf('en') === 0) return 'en';
    if (docLang.indexOf('es') === 0) return 'es';
    return 'pt';
  }

  function langPathPrefix(lang) {
    return lang === 'pt' ? '' : lang + '/';
  }

  function getItems() {
    var edicao = detectEdicao();
    var lang   = detectLang();
    var prefix = langPathPrefix(lang);
    var raw    = SUMARIOS[edicao] || [];
    return raw.map(function (it) {
      return {
        num:   it.num,
        url:   'https://bnibusiness.com.br/' + prefix + edicao + '/' + it.slug + '/',
        secao: (it.secao && (it.secao[lang] || it.secao.pt)) || '',
        desc:  (it.desc  && (it.desc[lang]  || it.desc.pt))  || ''
      };
    });
  }

  /* ── Logo SVG (mesmos dados do nav.js, IDs únicos sum-*) ── */
  var LOGO_SVG = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 192.9 20" style="display:block" aria-label="Revista BNI Business">'
    + '<defs>'
    + '<clipPath id="sum-cp0"><rect width="192.9" height="20"/></clipPath>'
    + '<clipPath id="sum-cp1"><rect width="192.9" height="20"/></clipPath>'
    + '<clipPath id="sum-cp2"><rect width="192.9" height="20"/></clipPath>'
    + '</defs>'
    + '<g clip-path="url(#sum-cp0)">'
    + '<path fill="#fff" d="M188.88,19.96c2.84,0,4.03-1.59,4.03-3.21,0-1.83-1.59-2.43-2.95-3.04-1.23-.5-2.3-.93-2.3-1.89s.58-1.55,1.51-1.55c.45,0,.82.15,1.16.35l2,2.63.09-.04-.11-2.95-.99.19c-.56-.19-1.4-.37-2.11-.37-2.22,0-3.75,1.23-3.75,3.17,0,1.68,1.27,2.33,2.89,2.97,1.18.49,2.24.93,2.24,1.98,0,.97-.62,1.57-1.64,1.57-1.36,0-1.96-.71-2.84-2.17l-.58-.88-.09-.04.06,2.71c.8.3,2.02.58,3.38.58M180.56,19.96c2.84,0,4.03-1.59,4.03-3.21,0-1.83-1.59-2.43-2.95-3.04-1.23-.5-2.3-.93-2.3-1.89s.58-1.55,1.51-1.55c.45,0,.82.15,1.16.35l2,2.63.09-.04-.11-2.95-.99.19c-.56-.19-1.4-.37-2.11-.37-2.22,0-3.75,1.23-3.75,3.17,0,1.68,1.27,2.33,2.89,2.97,1.18.49,2.24.93,2.24,1.98,0,.97-.62,1.57-1.64,1.57-1.36,0-1.96-.71-2.84-2.17l-.58-.88-.09-.04.06,2.71c.8.3,2.03.58,3.38.58M170.46,13.2c.17-1.87.93-2.89,1.68-2.89,1.1,0,1.34,1.59,1.34,2.89h-3.01ZM171.8,20c2.33,0,3.77-1.18,4.59-3.32l-.13-.06c-.52,1.12-1.38,1.68-2.61,1.68-2,0-3.23-1.66-3.23-3.94,0-.26-.02-.67.02-.93,1.21.04,5.82.11,5.82.11.02-.13.04-.26.04-.41,0-1.33-1.1-3.12-3.86-3.12-2.91,0-5.28,2.18-5.28,5.19,0,2.71,1.98,4.8,4.63,4.8M155.11,19.66h5.49l-.04-.13-.32-.02c-.75-.06-.84-.13-.84-.3v-6.89c.41-.24.82-.45,1.53-.45.95,0,1.66.43,1.66,1.83v5.47c0,.17.04.3-.71.34l-.39.02-.07.13h5.58l-.06-.13-.19-.02c-1.01-.13-1.12-.19-1.12-.32v-5.79c0-1.03-.19-2.07-.69-2.58-.49-.47-.99-.75-1.72-.75-1.4,0-2.78,1.1-3.79,1.98h-.02l.06-1.94-4.48,1.23-.02.09.49.11c.73.19.88.37.88,1.7v5.94c0,.26-.24.3-.9.34l-.26.02-.06.13ZM149,19.66h5.64l-.06-.13-.17-.02c-.99-.11-1.12-.13-1.12-.3v-9.11l-4.41,1.23-.02.09.5.11c.73.19.88.37.88,1.7v5.94c0,.26-.24.3-.9.34l-.26.02-.07.13ZM151.67,8.95c1.19,0,1.83-.91,1.83-1.77s-.65-1.77-1.83-1.77-1.83.88-1.83,1.77.67,1.77,1.83,1.77M144.24,19.96c2.84,0,4.03-1.59,4.03-3.21,0-1.83-1.59-2.43-2.95-3.04-1.23-.5-2.3-.93-2.3-1.89s.58-1.55,1.51-1.55c.45,0,.82.15,1.16.35l2,2.63.09-.04-.11-2.95-.99.19c-.56-.19-1.4-.37-2.11-.37-2.22,0-3.75,1.23-3.75,3.17,0,1.68,1.27,2.33,2.89,2.97,1.18.49,2.24.93,2.24,1.98,0,.97-.62,1.57-1.64,1.57-1.36,0-1.96-.71-2.84-2.17l-.58-.88-.09-.04.06,2.71c.8.3,2.03.58,3.38.58M136.12,20l4.44-1.31.02-.09-.54-.11c-.71-.19-.84-.39-.84-1.64v-6.48h-4.52l.07.13.3.02c.97.06,1.12.09,1.12.3v6.87c-.39.22-.75.45-1.36.45-1.03,0-1.74-.45-1.7-1.81l.07-5.96h-4.59l.07.13.3.02c1.1.09,1.19.17,1.19.26l-.09,5.79c-.04,1.08.17,2.07.69,2.58.52.52.86.8,1.59.8,1.4,0,2.74-1.01,3.81-2h.06l-.09,2.05ZM121.15,12.27v-5.75l.24-.04c1.75,0,3.23.86,3.23,2.86,0,2.13-1.57,3.01-3.38,2.93h-.09ZM122.12,19.44l-.97-.37v-6.59c.07-.02.22-.04.39-.04,1.94,0,3.62,1.25,3.62,3.38s-1.34,3.36-2.86,3.55l-.17.06ZM115.77,19.66h6.87c4.24,0,6.07-1.55,6.07-3.98,0-2.02-1.7-3.32-4.41-3.55v-.04c2.33-.39,3.75-1.29,3.75-2.78,0-2.24-1.77-3.1-6.03-3.1h-6.22l.06.17.58.06c1.08.13,1.2.13,1.2.28v12.36c0,.13-.24.26-.99.37l-.82.09-.06.13Z"/>'
    + '<polygon fill="#fff" points="97.37 0 97.37 9.66 89.77 0 83.88 0 83.88 19.49 89.77 19.49 89.77 9.15 97.97 19.49 103.23 19.49 103.23 0 97.37 0"/>'
    + '<g clip-path="url(#sum-cp1)">'
    + '<path fill="#fff" d="M70.36,11.94h3.1c1.4,0,2.34.51,2.31,1.57-.03,1.02-.86,1.49-1.96,1.49h-3.45v-3.06ZM70.36,4.5h2.27c1.21,0,2.08.34,2.05,1.6-.03,1.09-.98,1.5-2.05,1.5h-2.27v-3.1ZM64.34,19.48h8.03s2.29,0,2.29,0c1.64,0,3.16-.25,4.55-1.06,3.1-1.8,3.37-5.77,1.12-7.9-1.19-1.05-1.98-1.22-2.53-1.39.76-.38,1.48-.88,2.03-1.54.55-.66.9-1.62.86-2.74C80.55.84,77.01,0,74.21,0h-2.8l-7.07.02v19.47Z"/>'
    + '</g>'
    + '<polygon fill="#fff" points="105.72 8.24 105.72 19.49 111.7 19.49 111.7 2.32 105.72 8.24"/>'
    + '<polygon fill="#fff" points="105.72 0 105.72 5.96 111.7 0 105.72 0"/>'
    + '<g clip-path="url(#sum-cp2)">'
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

  /* ── CSS do sumário (injetado dinamicamente) ── */
  var CSS = [
    '.sumario-overlay{position:fixed;inset:0;background:var(--vermelho,#CC0000);z-index:500;display:none;flex-direction:column;overflow:hidden;}',
    '.sumario-overlay.open{display:flex;}',
    '.sumario-header{display:flex;align-items:center;justify-content:space-between;padding:0 2.5rem;height:70px;flex-shrink:0;border-bottom:1px solid rgba(255,255,255,0.2);}',
    '.sumario-fechar{background:none;border:none;cursor:pointer;color:#fff;font-family:"Barlow Condensed",sans-serif;font-size:12px;letter-spacing:2.5px;text-transform:uppercase;display:flex;align-items:center;gap:10px;}',
    '.sumario-grid{display:grid;grid-template-columns:1fr 1fr;grid-template-rows:repeat(8,1fr);gap:0 70px;padding:0 2.5rem 1rem;flex:1;min-height:0;}',
    '.sumario-item{display:flex;flex-direction:column;justify-content:center;padding:0.4rem 20px;border-bottom:1px solid rgba(255,255,255,0.22);cursor:pointer;text-decoration:none;overflow:hidden;}',
    '.sumario-item:hover{background:rgba(255,255,255,0.07);}',
    '.sumario-titulo-linha{display:flex;align-items:baseline;gap:1rem;min-width:0;overflow:hidden;}',
    '.sumario-num{font-family:"Barlow Condensed",sans-serif;font-size:2.4rem;font-weight:500;color:#fff;flex-shrink:0;line-height:1.15;width:3.8rem;}',
    '.sumario-secao{font-family:"Barlow Condensed",sans-serif;font-size:0.85rem;font-weight:400;color:rgba(255,255,255,0.7);letter-spacing:1.5px;text-transform:uppercase;display:block;padding-left:calc(3.8rem + 1rem);margin-bottom:1px;line-height:1.2;}',
    '.sumario-desc{font-family:"Barlow Condensed",sans-serif;font-size:2.4rem;font-weight:300;color:#fff;line-height:1.1;white-space:normal;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;padding-left:0;}',
    '@media(max-width:900px){',
    '  .sumario-overlay{overflow-y:auto;}',
    '  .sumario-header{padding:0 20px;}',
    '  .sumario-grid{grid-template-columns:1fr;grid-template-rows:unset;overflow-y:unset;padding:0 20px 2rem;}',
    '  .sumario-item{grid-column:1!important;grid-row:unset!important;flex-direction:row;align-items:center;gap:0.4rem;padding:0.3rem 10px;}',
    '  .sumario-titulo-linha{display:contents;}',
    '  .sumario-num{order:1;font-size:1.3rem;width:auto;flex-shrink:0;}',
    '  .sumario-secao{display:none;}',
    '  .sumario-desc{order:2;display:block;font-size:1.3rem;white-space:nowrap;overflow:hidden;-webkit-line-clamp:unset;}',
    '}'
  ].join('\n');

  /* ── HTML do sumário (data-driven) ── */
  function buildHTML() {
    var items = getItems();
    if (items.length === 0) return null;

    var lang   = detectLang();
    var fechar = I18N.fechar[lang] || I18N.fechar.pt;

    var CLOSE_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.5" width="20" height="20">'
      + '<line x1="4" y1="4" x2="20" y2="20"/><line x1="20" y1="4" x2="4" y2="20"/></svg>';

    var html = '<div class="sumario-overlay" id="sumario">'
             +   '<div class="sumario-header">'
             +     '<div class="nav-logo">' + LOGO_SVG + '</div>'
             +     '<button class="sumario-fechar" onclick="fecharSumario()">' + fechar + ' ' + CLOSE_ICON + '</button>'
             +   '</div>'
             +   '<div class="sumario-grid">';

    items.forEach(function (item, idx) {
      var col = idx < 8 ? 1 : 2;
      var row = (idx % 8) + 1;
      var num = String(item.num).padStart(2, '0');
      html += '<a class="sumario-item" href="' + item.url + '" style="grid-column:' + col + ';grid-row:' + row + ';">'
            +   '<span class="sumario-secao">' + item.secao + '</span>'
            +   '<span class="sumario-titulo-linha"><span class="sumario-num">' + num + '</span><span class="sumario-desc">' + item.desc + '</span></span>'
            + '</a>';
    });

    html += '</div></div>';
    return html;
  }

  /* ── Injeta CSS no <head> ── */
  function injectStyles() {
    if (document.getElementById('sumario-styles')) return;
    var style = document.createElement('style');
    style.id = 'sumario-styles';
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  /* ── Injeta HTML no fim do <body> ── */
  function injectHTML() {
    if (document.getElementById('sumario')) return; /* evita duplicata */
    var markup = buildHTML();
    if (!markup) return; /* edição sem itens */
    var tmp = document.createElement('div');
    tmp.innerHTML = markup;
    document.body.appendChild(tmp.firstChild);
  }

  function inject() {
    injectStyles();
    injectHTML();
  }

  /* ── API global exposta para nav.js e matérias ── */
  window.abrirSumario = function () {
    var el = document.getElementById('sumario');
    if (el) { el.classList.add('open'); document.body.style.overflow = 'hidden'; }
  };
  window.fecharSumario = function () {
    var el = document.getElementById('sumario');
    if (el) { el.classList.remove('open'); document.body.style.overflow = ''; }
  };

  /* ── Fecha com Escape ── */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') window.fecharSumario();
  });

  /* ── Injeta assim que o body estiver disponível ── */
  if (document.body) {
    inject();
  } else {
    document.addEventListener('DOMContentLoaded', inject);
  }

})();
