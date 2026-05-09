/**
 * materia.js — Revista BNI Business
 * Comportamentos comuns a todas as paginas de materia:
 * fade-in, parallax do hero, dropdown de idiomas, botoes de share,
 * carrossel de mais materias, reading circle, language switcher.
 *
 * Substitui o <script> inline que existia em cada matéria. Le o tempo
 * de leitura via atributo data-reading-mins no <main class="artigo">.
 *
 * Carregar com:
 *   <script src="/assets/js/materia.js?v=N" defer></script>
 */

(function () {
  'use strict';

  // ── Scroll fade-in ──────────────────────────────────────────
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.fade-in').forEach(function (el) { obs.observe(el); });

  setTimeout(function () {
    var h = document.querySelector('.hero-texto');
    if (h) h.classList.add('visible');
  }, 100);

  // Divisor animation on load
  setTimeout(function () {
    var d = document.querySelector('.divisor');
    if (d) d.classList.add('animado');
  }, 300);

  // Secao-titulo underline draw animation
  var obsTitulo = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('animado');
        obsTitulo.unobserve(e.target);
      }
    });
  }, { threshold: 0.8 });
  document.querySelectorAll('.secao-titulo').forEach(function (el) { obsTitulo.observe(el); });

  // Citacao slide-in (separate from fade-in)
  var obsCitacao = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obsCitacao.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.citacao-bloco').forEach(function (el) { obsCitacao.observe(el); });

  // ── Hero parallax ───────────────────────────────────────────
  var heroImg = document.querySelector('.hero-foto img');
  if (heroImg) {
    window.addEventListener('scroll', function () {
      var scrolled = window.pageYOffset;
      var rate = scrolled * 0.25;
      heroImg.style.transform = 'translateY(' + rate + 'px)';
    }, { passive: true });
  }

  // ── Dropdown idiomas ────────────────────────────────────────
  window.toggleDropdown = function (id) {
    var item = document.getElementById(id);
    if (item) item.classList.toggle('open');
  };
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav-item')) {
      document.querySelectorAll('.nav-item').forEach(function (i) { i.classList.remove('open'); });
    }
  });

  // ── Share buttons appear after scrolling past hero ──────────
  var shareSidebar = document.getElementById('shareSidebar');
  var shareMobile  = document.getElementById('shareMobile');
  var outrasMaterias = document.querySelector('.cta-section');
  window.addEventListener('scroll', function () {
    var scrolled = window.pageYOffset;
    var afterHero = scrolled > window.innerHeight * 0.6;
    var beforeOtras = outrasMaterias
      ? scrolled < outrasMaterias.getBoundingClientRect().top + scrolled - 80
      : true;
    var show = afterHero && beforeOtras;
    if (shareSidebar) shareSidebar.classList.toggle('visible', show);
    if (shareMobile)  shareMobile.classList.toggle('visible', show);
  }, { passive: true });

  // ── Copy link (usa URL atual em runtime) ────────────────────
  window.copiarLink = function () {
    var url = location.href.replace(/\/+$/, '');
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(url).then(function () {
      var btn = document.getElementById('copyBtn');
      if (btn) {
        btn.classList.add('copied');
        setTimeout(function () { btn.classList.remove('copied'); }, 2000);
      }
    });
  };

  // ── Carrossel ───────────────────────────────────────────────
  var carrosselPos = 0;
  window.moverCarrossel = function (dir) {
    var track = document.getElementById('carrosselTrack');
    if (!track) return;
    var cards = track.querySelectorAll('.nav-mat-card');
    if (!cards.length) return;
    var isMobile = window.innerWidth <= 900;
    var visible = isMobile ? 1 : 2;
    var max = cards.length - visible;
    carrosselPos = Math.max(0, Math.min(carrosselPos + dir, max));
    var cardW = cards[0].offsetWidth;
    track.style.transform = 'translateX(-' + (carrosselPos * cardW) + 'px)';
  };

  // ── READING CIRCLE ──────────────────────────────────────────
  var readingCircle = document.getElementById('readingCircle');
  var circleProgress = document.getElementById('circleProgress');
  var circleMins = document.getElementById('circleMins');
  var circleLabel = document.getElementById('circleLabel');
  var circleInner = document.getElementById('circleInner');
  var readingTimeEl = document.getElementById('readingTime');

  // Le o tempo de leitura do atributo data-reading-mins do <main class="artigo">
  var artigoEl = document.querySelector('main.artigo');
  var totalMins = artigoEl ? parseInt(artigoEl.dataset.readingMins, 10) : NaN;
  if (!totalMins || totalMins < 1) totalMins = 5; // fallback

  var circumference = 201; // 2 * PI * 32

  window.addEventListener('scroll', function () {
    if (!artigoEl) return;

    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var progress = Math.min(scrollTop / docHeight, 1);

    // Show circle after 30% of hero, hide when footer is visible
    if (readingCircle) {
      var footer = document.querySelector('footer');
      var footerTop = footer ? footer.getBoundingClientRect().top : Infinity;
      var showCircle = scrollTop > window.innerHeight * 0.3 && footerTop > window.innerHeight;
      readingCircle.classList.toggle('visible', showCircle);
    }

    // Arc progress
    if (circleProgress) {
      var offset = circumference - (progress * circumference);
      circleProgress.style.strokeDashoffset = offset;
    }

    // Mins remaining
    var artigoTop = artigoEl.offsetTop;
    var artigoHeight = artigoEl.offsetHeight;
    var readProgress = Math.max(0, Math.min((scrollTop - artigoTop) / artigoHeight, 1));
    var minsLeft = Math.ceil(totalMins * (1 - readProgress));

    if (circleMins && circleLabel && circleInner) {
      if (minsLeft <= 0) {
        circleMins.textContent = '✓';
        circleLabel.textContent = 'fim';
        circleInner.classList.add('reading-circle-done');
      } else {
        circleMins.textContent = minsLeft;
        circleLabel.textContent = 'min';
        circleInner.classList.remove('reading-circle-done');
      }
    }

    // Update byline too
    if (readingTimeEl) {
      if (minsLeft <= 0) readingTimeEl.textContent = 'Leitura concluída ✓';
      else if (readProgress === 0) readingTimeEl.textContent = totalMins + ' min de leitura';
      else readingTimeEl.textContent = '~' + minsLeft + ' min restantes';
    }
  }, { passive: true });

  // ── SLIDERS (carrosséis de fotos com autoplay) ──────────────
  document.querySelectorAll('.foto-slider').forEach(function (sl) {
    var slides = sl.querySelectorAll('.slider-slide');
    var dots   = sl.querySelectorAll('.slider-dot');
    var prev   = sl.querySelector('.slider-prev');
    var next   = sl.querySelector('.slider-next');
    var track  = sl.querySelector('.slider-track');
    if (!track || slides.length <= 1) return;
    var cur = 0;
    var timer;
    var hovering = false;
    function goTo(idx) {
      slides[cur].classList.remove('active');
      if (dots[cur]) dots[cur].classList.remove('active');
      cur = (idx + slides.length) % slides.length;
      slides[cur].classList.add('active');
      if (dots[cur]) dots[cur].classList.add('active');
      track.style.transform = 'translateX(-' + (cur * sl.offsetWidth) + 'px)';
    }
    function startPlay() {
      clearInterval(timer);
      if (!hovering) timer = setInterval(function () { goTo(cur + 1); }, 3000);
    }
    if (prev) prev.addEventListener('click', function () { goTo(cur - 1); });
    if (next) next.addEventListener('click', function () { goTo(cur + 1); });
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () { goTo(+this.dataset.idx); });
    });
    sl.addEventListener('mouseenter', function () { hovering = true;  clearInterval(timer); });
    sl.addEventListener('mouseleave', function () { hovering = false; startPlay(); });
    startPlay();
  });

  // ── LANGUAGE SWITCHER ───────────────────────────────────────
  window.setLang = function (sigla) {
    localStorage.setItem('bni_lang', sigla);
  };
  function hideLangCurrent() {
    var pageLang = document.documentElement.dataset.lang || 'PT';
    document.querySelectorAll('.dropdown a[data-lang]').forEach(function (a) {
      a.style.display = (a.dataset.lang === pageLang) ? 'none' : '';
    });
    var label = document.getElementById('langLabel');
    if (label) label.textContent = pageLang;
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hideLangCurrent);
  } else {
    hideLangCurrent();
  }

})();
