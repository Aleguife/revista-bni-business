/**
 * footer.js — Revista BNI Business
 * Gera dinamicamente o footer em todas as páginas.
 * Coloque <script src="/footer.js" defer></script> no <head> de cada HTML.
 *
 * SVG Logo footer: versão menor (128.57 × 20) sem o "Revista" expandido.
 */

(function () {
  'use strict';

  /* ── SVG logo footer ── */
  var FOOTER_LOGO_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128.57 20" style="width:100%;max-width:450px;height:auto;display:block;" aria-label="BNI Business">'
    + '<g>'
    + '<path fill="#fff" d="M124.54,19.96c2.84,0,4.03-1.59,4.03-3.21,0-1.83-1.59-2.43-2.95-3.04-1.23-.5-2.3-.93-2.3-1.89s.58-1.55,1.51-1.55c.45,0,.82.15,1.16.35l2,2.63.09-.04-.11-2.95-.99.19c-.56-.19-1.4-.37-2.11-.37-2.22,0-3.75,1.23-3.75,3.17,0,1.68,1.27,2.33,2.89,2.97,1.18.49,2.24.93,2.24,1.98,0,.97-.62,1.57-1.64,1.57-1.36,0-1.96-.71-2.84-2.17l-.58-.88-.09-.04.06,2.71c.8.3,2.02.58,3.38.58M116.23,19.96c2.84,0,4.03-1.59,4.03-3.21,0-1.83-1.59-2.43-2.95-3.04-1.23-.5-2.3-.93-2.3-1.89s.58-1.55,1.51-1.55c.45,0,.82.15,1.16.35l2,2.63.09-.04-.11-2.95-.99.19c-.56-.19-1.4-.37-2.11-.37-2.22,0-3.75,1.23-3.75,3.17,0,1.68,1.27,2.33,2.89,2.97,1.18.49,2.24.93,2.24,1.98,0,.97-.62,1.57-1.64,1.57-1.36,0-1.96-.71-2.84-2.17l-.58-.88-.09-.04.06,2.71c.8.3,2.03.58,3.38.58M106.13,13.2c.17-1.87.93-2.89,1.68-2.89,1.1,0,1.33,1.59,1.33,2.89h-3.01ZM107.46,20c2.33,0,3.77-1.18,4.59-3.32l-.13-.06c-.52,1.12-1.38,1.68-2.61,1.68-2,0-3.23-1.66-3.23-3.94,0-.26-.02-.67.02-.93,1.21.04,5.82.11,5.82.11.02-.13.04-.26.04-.41,0-1.33-1.1-3.12-3.86-3.12-2.91,0-5.28,2.18-5.28,5.19,0,2.71,1.98,4.8,4.63,4.8M90.78,19.66h5.49l-.04-.13-.32-.02c-.75-.06-.84-.13-.84-.3v-6.89c.41-.24.82-.45,1.53-.45.95,0,1.66.43,1.66,1.83v5.47c0,.17.04.3-.71.34l-.39.02-.06.13h5.58l-.06-.13-.19-.02c-1.01-.13-1.12-.19-1.12-.32v-5.79c0-1.03-.19-2.07-.69-2.58-.49-.47-.99-.75-1.72-.75-1.4,0-2.78,1.1-3.79,1.98h-.02l.06-1.94-4.48,1.23-.02.09.49.11c.73.19.88.37.88,1.7v5.94c0,.26-.24.3-.9.34l-.26.02-.06.13ZM84.66,19.66h5.64l-.06-.13-.17-.02c-.99-.11-1.12-.13-1.12-.3v-9.11l-4.41,1.23-.02.09.5.11c.73.19.88.37.88,1.7v5.94c0,.26-.24.3-.9.34l-.26.02-.07.13ZM87.33,8.95c1.19,0,1.83-.91,1.83-1.77s-.65-1.77-1.83-1.77-1.83.88-1.83,1.77.67,1.77,1.83,1.77M79.9,19.96c2.84,0,4.03-1.59,4.03-3.21,0-1.83-1.59-2.43-2.95-3.04-1.23-.5-2.3-.93-2.3-1.89s.58-1.55,1.51-1.55c.45,0,.82.15,1.16.35l2,2.63.09-.04-.11-2.95-.99.19c-.56-.19-1.4-.37-2.11-.37-2.22,0-3.75,1.23-3.75,3.17,0,1.68,1.27,2.33,2.89,2.97,1.18.49,2.24.93,2.24,1.98,0,.97-.62,1.57-1.64,1.57-1.36,0-1.96-.71-2.84-2.17l-.58-.88-.09-.04.06,2.71c.8.3,2.03.58,3.38.58M71.78,20l4.44-1.31.02-.09-.54-.11c-.71-.19-.84-.39-.84-1.64v-6.48h-4.52l.07.13.3.02c.97.06,1.12.09,1.12.3v6.87c-.39.22-.75.45-1.36.45-1.03,0-1.74-.45-1.7-1.81l.06-5.96h-4.59l.07.13.3.02c1.1.09,1.19.17,1.19.26l-.09,5.79c-.04,1.08.17,2.07.69,2.58.52.52.86.8,1.59.8,1.4,0,2.74-1.01,3.81-2h.06l-.09,2.05ZM56.82,12.27v-5.75l.24-.04c1.74,0,3.23.86,3.23,2.86,0,2.13-1.57,3.01-3.38,2.93h-.09ZM57.79,19.44l-.97-.37v-6.59c.06-.02.22-.04.39-.04,1.94,0,3.62,1.25,3.62,3.38s-1.34,3.36-2.86,3.55l-.17.06ZM51.43,19.66h6.87c4.24,0,6.07-1.55,6.07-3.98,0-2.02-1.7-3.32-4.41-3.55v-.04c2.33-.39,3.75-1.29,3.75-2.78,0-2.24-1.77-3.1-6.03-3.1h-6.22l.06.17.58.06c1.08.13,1.2.13,1.2.28v12.36c0,.13-.24.26-.99.37l-.82.09-.06.13Z"/>'
    + '<polygon fill="#fff" points="33.03 0 33.03 9.66 25.43 0 19.54 0 19.54 19.49 25.43 19.49 25.43 9.15 33.63 19.49 38.89 19.49 38.89 0 33.03 0"/>'
    + '<path fill="#fff" d="M6.03,11.94h3.1c1.4,0,2.34.51,2.31,1.57-.03,1.02-.85,1.49-1.96,1.49h-3.45v-3.06ZM6.03,4.5h2.27c1.21,0,2.09.34,2.05,1.6-.03,1.09-.98,1.5-2.05,1.5h-2.27v-3.1ZM0,19.48h8.03s2.29,0,2.29,0c1.64,0,3.16-.25,4.55-1.06,3.1-1.8,3.36-5.77,1.12-7.9-1.19-1.05-1.98-1.22-2.53-1.39.76-.38,1.48-.88,2.03-1.54.55-.66.9-1.62.86-2.74-.13-4.02-3.68-4.87-6.48-4.87h-2.8L0,.02v19.47Z"/>'
    + '<polygon fill="#fff" points="41.38 8.24 41.38 19.49 47.37 19.49 47.37 2.32 41.38 8.24"/>'
    + '<polygon fill="#fff" points="41.38 0 41.38 5.96 47.37 0 41.38 0"/>'
    + '<g>'
    + '<path fill="#fff" d="M49.69,17.27c.31,0,.59.12.79.33.2.2.33.48.33.79s-.12.58-.33.79c-.2.2-.48.33-.79.33s-.58-.12-.79-.33c-.2-.2-.33-.48-.33-.79s.12-.59.33-.79c.2-.2.48-.33.79-.33M50.34,17.73c-.17-.17-.4-.27-.66-.27s-.49.1-.65.27c-.17.17-.27.4-.27.66s.1.49.27.65c.17.17.4.27.65.27s.49-.1.66-.27c.17-.17.27-.4.27-.65s-.1-.49-.27-.66"/>'
    + '<path fill="#fff" d="M49.25,19.02h.17v-.54h.21l.38.54h.2l-.4-.56c.22-.03.35-.14.35-.32,0-.3-.29-.33-.56-.33h-.36v1.21ZM49.42,17.94h.23c.16,0,.34.03.34.2,0,.2-.24.2-.42.2h-.15v-.4Z"/>'
    + '</g>'
    + '</g>'
    + '</svg>';

  /* ── Ícones de redes sociais ── */
  var ICON_WA = '<svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>';
  var ICON_EMAIL = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/></svg>';
  var ICON_IG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="#fff"/></svg>';
  var ICON_LI = '<svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>';

  var SOCIAL_BTN_STYLE = 'display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,0.12);transition:background 0.2s;';

  function socialBtn(href, title, icon, target) {
    var tgt = target || '_blank';
    return '<a href="' + href + '" target="' + tgt + '" rel="noopener" title="' + title + '" '
      + 'style="' + SOCIAL_BTN_STYLE + '" '
      + 'onmouseover="this.style.background=\'rgba(255,255,255,0.25)\'" '
      + 'onmouseout="this.style.background=\'rgba(255,255,255,0.12)\'">'
      + icon
      + '</a>';
  }

  /* ── Constrói o HTML do footer ── */
  function buildFooter() {
    return ''
      + '<div style="padding:2rem 2rem 1.5rem;display:flex;flex-wrap:wrap;gap:1.5rem;background:var(--vermelho);">'

      /* Coluna 1 — Logo + redes sociais */
      + '<div style="flex:1 1 200px;min-width:200px;">'
      +   '<div style="max-width:450px;margin:0 auto;">'
      +     '<div style="margin-bottom:0.75rem;">' + FOOTER_LOGO_SVG + '</div>'
      +     '<p style="font-family:\'Barlow\',sans-serif;font-size:0.85rem;color:rgba(255,255,255,0.7);">Conectando empresários. Gerando resultados.</p>'
      +     '<div style="display:flex;gap:10px;margin-top:0.75rem;align-items:center;">'
      +       socialBtn('https://wa.me/5511968592642?text=Estou%20entrando%20em%20contato%20atrav%C3%A9s%20do%20site%20da%20Revista%20BNI%20Business', 'WhatsApp', ICON_WA)
      +       socialBtn('mailto:contato@bnibusiness.com.br', 'Email', ICON_EMAIL, '_self')
      +       socialBtn('https://instagram.com/revistabnibusiness', 'Instagram', ICON_IG)
      +       socialBtn('https://linkedin.com/company/revistabnibusiness', 'LinkedIn', ICON_LI)
      +     '</div>'
      +   '</div>'
      + '</div>'

      /* Coluna 2 — Links de navegação */
      + '<div style="flex:1 1 150px;min-width:150px;">'
      +   '<div style="max-width:450px;margin:0 auto;display:flex;flex-direction:column;">'
      +     '<a href="#" class="footer-nav-link" style="border-top:1px solid rgba(255,255,255,0.2);border-bottom:1px solid rgba(255,255,255,0.2);">Revistas</a>'
      +     '<a href="#" class="footer-nav-link" style="border-bottom:1px solid rgba(255,255,255,0.2);">Sobre</a>'
      +     '<a href="#" class="footer-nav-link" style="border-bottom:1px solid rgba(255,255,255,0.2);">Contato</a>'
      +     '<a href="#" class="footer-nav-link" style="border-bottom:1px solid rgba(255,255,255,0.2);">Expediente</a>'
      +   '</div>'
      + '</div>'

      /* Coluna 3 — Newsletter */
      + '<div style="flex:1 1 220px;min-width:220px;">'
      +   '<div style="max-width:450px;margin:0 auto;">'
      +     '<h4 style="font-family:\'Barlow Condensed\',sans-serif;font-size:16px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#fff;margin-bottom:0.4rem;text-align:center;">Inscreva-se</h4>'
      +     '<p style="font-family:\'Barlow\',sans-serif;font-size:0.8rem;color:rgba(255,255,255,0.7);text-align:center;margin-bottom:0.9rem;line-height:1.4;">Inscreva-se em nossa newsletter!<br>Seja o primeiro a receber as últimas notícias sobre negócios, design e cultura.</p>'
      +     '<div style="display:flex;align-items:center;border-bottom:1px solid rgba(255,255,255,0.5);margin-bottom:1rem;">'
      +       '<input type="email" placeholder="SEU E-MAIL" id="footer-newsletter-email" style="flex:1;background:none;border:none;outline:none;font-family:\'Barlow Condensed\',sans-serif;font-size:13px;letter-spacing:1.5px;text-transform:uppercase;color:#fff;padding:0.6rem 0;text-align:center;" />'
      +       '<button id="footer-newsletter-btn" style="background:none;border:none;cursor:pointer;color:#fff;padding:0.4rem;display:flex;align-items:center;" aria-label="Assinar newsletter"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></button>'
      +     '</div>'
      +     '<div style="display:flex;align-items:flex-start;gap:8px;">'
      +       '<input type="checkbox" id="footer-newsletter-consent" style="margin-top:3px;flex-shrink:0;accent-color:#fff;outline:none;border:none;box-shadow:none;" />'
      +       '<label for="footer-newsletter-consent" style="font-family:\'Barlow\',sans-serif;font-size:0.8375rem;color:rgba(255,255,255,0.65);line-height:1.4;">Concordo em receber esta newsletter e entendo que posso cancelar a assinatura a qualquer momento.</label>'
      +     '</div>'
      +   '</div>'
      + '</div>'

      + '</div>' /* fim padding wrapper */

      /* Barra inferior de copyright */
      + '<div class="footer-bar" style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:0.5rem;padding:0.75rem 2rem;border-top:1px solid rgba(255,255,255,0.15);">'
      +   '<span class="footer-bar-copy" style="white-space:nowrap;font-size:11px;letter-spacing:0.5px;">© 2026 — <a href="https://alefdesign.com.br" target="_blank" class="footer-bar-link">Alef Design</a></span>'
      +   '<div class="footer-bar-links" style="display:flex;gap:1rem;flex-shrink:0;">'
      +     '<a href="https://bnibusiness.com.br/cookies/" class="footer-bar-link" style="font-size:11px;">Cookies</a>'
      +     '<a href="https://bnibusiness.com.br/privacidade/" class="footer-bar-link" style="font-size:11px;">Privacidade</a>'
      +     '<a href="https://bnibusiness.com.br/termos/" class="footer-bar-link" style="font-size:11px;">Termos de Uso</a>'
      +   '</div>'
      + '</div>';
  }

  /* ── Estilos mobile via <style> (não afeta desktop) ── */
  function injectFooterStyles() {
    if (document.getElementById('bni-footer-styles')) return;
    var style = document.createElement('style');
    style.id = 'bni-footer-styles';
    style.textContent = [
      '@media (max-width: 768px) {',
      '  #bni-footer .footer-bar {',
      '    flex-direction: row !important;',
      '    flex-wrap: nowrap !important;',
      '    align-items: center !important;',
      '    justify-content: space-between !important;',
      '    padding: 0.5rem 1rem !important;',
      '    gap: 0.5rem !important;',
      '  }',
      '  #bni-footer .footer-bar-copy {',
      '    white-space: nowrap !important;',
      '    font-size: 10px !important;',
      '    flex-shrink: 0 !important;',
      '    display: inline-flex !important;',
      '    align-items: center !important;',
      '    gap: 0.25rem !important;',
      '  }',
      '  #bni-footer .footer-bar-links {',
      '    flex-shrink: 0 !important;',
      '    gap: 0.6rem !important;',
      '  }',
      '  #bni-footer .footer-bar-links a {',
      '    font-size: 10px !important;',
      '  }',
      '}'
    ].join('\n');
    document.head.appendChild(style);
  }

  /* ── Injeta o footer no final do <body> ── */
  function injectFooter() {
    /* Evita injeção dupla */
    if (document.getElementById('bni-footer')) return;

    injectFooterStyles();

    var footer = document.createElement('footer');
    footer.id = 'bni-footer';
    footer.style.background = 'var(--vermelho)';
    footer.setAttribute('role', 'contentinfo');
    footer.innerHTML = buildFooter();

    document.body.appendChild(footer);

    /* ── Ocultar .share-mobile quando o footer estiver visível ── */
    var _shareMobile = document.querySelector('.share-mobile');
    var _footerEl = document.getElementById('bni-footer');
    if (_shareMobile && _footerEl) {
      var _obs = new IntersectionObserver(function(entries) {
        var entry = entries[0];
        _shareMobile.style.visibility = entry.isIntersecting ? 'hidden' : '';
        _shareMobile.style.pointerEvents = entry.isIntersecting ? 'none' : '';
      }, { threshold: 0.05 });
      _obs.observe(_footerEl);
    }
  }

  /* ── Aguarda o DOM estar pronto ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectFooter);
  } else {
    injectFooter();
  }

})();
