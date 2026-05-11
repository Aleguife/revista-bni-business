#!/usr/bin/env node
/* ============================================================
   gerar-sitemap.js — Revista BNI Business
   Regenera sitemap.xml a partir de:
   - painel/admin.js (constante MATERIAS_POR_EDICAO: slugs + status)
   - HTML de cada materia (<title> e article:published_time)

   Uso:
     node scripts/gerar-sitemap.js             # grava sitemap.xml
     node scripts/gerar-sitemap.js --dry-run   # imprime no stdout

   Inclui:
   - Homepage PT/EN/ES
   - Indice de cada edicao com >=1 materia publicada (PT/EN/ES)
   - Cada materia publicada em PT (com <news:news>), EN e ES
   ============================================================ */

const fs   = require('fs');
const path = require('path');

const BASE_URL = 'https://bnibusiness.com.br';
const ROOT     = path.resolve(__dirname, '..');
const TODAY    = new Date().toISOString().slice(0, 10);
const isDryRun = process.argv.includes('--dry-run');

// ── 1. Carregar MATERIAS_POR_EDICAO do admin.js ──────────────
function loadMateriasPorEdicao() {
  const adminPath = path.join(ROOT, 'painel/admin.js');
  const text = fs.readFileSync(adminPath, 'utf-8');
  const match = text.match(/const MATERIAS_POR_EDICAO\s*=\s*(\{[\s\S]*?\n\});/);
  if (!match) {
    throw new Error('MATERIAS_POR_EDICAO nao encontrado em painel/admin.js');
  }
  // eval seguro: codigo proprio do projeto, nao input externo
  return eval('(' + match[1] + ')');
}

// ── 2. Ler meta de uma materia (titulo + data de publicacao) ─
function readArticleMeta(htmlRelPath) {
  const htmlPath = path.join(ROOT, htmlRelPath);
  if (!fs.existsSync(htmlPath)) return null;

  const html = fs.readFileSync(htmlPath, 'utf-8');
  const titleMatch    = html.match(/<title>([^<]+)<\/title>/);
  const pubDateMatch  = html.match(/<meta\s+property="article:published_time"\s+content="([^"]+)"/);

  const mtime = fs.statSync(htmlPath).mtime.toISOString().slice(0, 10);

  return {
    title:         titleMatch ? titleMatch[1].trim().replace(/\s+/g, ' ') : '',
    publishedTime: pubDateMatch ? pubDateMatch[1] : TODAY,
    lastmod:       mtime,
  };
}

// ── 3. Helpers de XML ────────────────────────────────────────
function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildUrlEntry(opts) {
  const { loc, lastmod, changefreq, priority, hreflangs, news } = opts;

  let entry = '  <url>\n';
  entry += '    <loc>' + loc + '</loc>\n';
  entry += '    <lastmod>' + lastmod + '</lastmod>\n';
  entry += '    <changefreq>' + changefreq + '</changefreq>\n';
  entry += '    <priority>' + priority + '</priority>\n';
  entry += '    <xhtml:link rel="alternate" hreflang="pt-BR" href="' + hreflangs.pt + '"/>\n';
  entry += '    <xhtml:link rel="alternate" hreflang="en" href="'    + hreflangs.en + '"/>\n';
  entry += '    <xhtml:link rel="alternate" hreflang="es" href="'    + hreflangs.es + '"/>\n';
  entry += '    <xhtml:link rel="alternate" hreflang="x-default" href="' + hreflangs.pt + '"/>\n';
  if (news) {
    entry += '    <news:news>\n';
    entry += '      <news:publication>\n';
    entry += '        <news:name>Revista BNI Business</news:name>\n';
    entry += '        <news:language>pt</news:language>\n';
    entry += '      </news:publication>\n';
    entry += '      <news:publication_date>' + news.publicationDate + '</news:publication_date>\n';
    entry += '      <news:title>' + escapeXml(news.title) + '</news:title>\n';
    entry += '    </news:news>\n';
  }
  entry += '  </url>\n';
  return entry;
}

// ── 4. Gerar sitemap completo ────────────────────────────────
function generateSitemap() {
  const MATERIAS = loadMateriasPorEdicao();

  let out  = '<?xml version="1.0" encoding="UTF-8"?>\n';
  out += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  out += '        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"\n';
  out += '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"\n';
  out += '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n\n';

  // Homepages (PT/EN/ES)
  const langs = ['', 'en', 'es'];
  langs.forEach(function (lang) {
    const langPath = lang ? '/' + lang + '/' : '/';
    out += buildUrlEntry({
      loc: BASE_URL + langPath,
      lastmod: TODAY,
      changefreq: 'weekly',
      priority: lang === '' ? '1.0' : '0.8',
      hreflangs: {
        pt: BASE_URL + '/',
        en: BASE_URL + '/en/',
        es: BASE_URL + '/es/',
      },
    }) + '\n';
  });

  // Por edicao
  Object.keys(MATERIAS).forEach(function (edicao) {
    const publicadas = MATERIAS[edicao].filter(function (m) {
      return m.status === 'publicada';
    });
    if (publicadas.length === 0) return; // pula edicoes sem nada publicado

    // Indices da edicao (PT/EN/ES)
    langs.forEach(function (lang) {
      const langPath = lang
        ? '/' + lang + '/' + edicao + '/'
        : '/' + edicao + '/';
      out += buildUrlEntry({
        loc: BASE_URL + langPath,
        lastmod: TODAY,
        changefreq: 'monthly',
        priority: lang === '' ? '0.9' : '0.7',
        hreflangs: {
          pt: BASE_URL + '/' + edicao + '/',
          en: BASE_URL + '/en/' + edicao + '/',
          es: BASE_URL + '/es/' + edicao + '/',
        },
      }) + '\n';
    });

    // Materias por idioma (PT primeiro com news:news, depois EN, depois ES)
    langs.forEach(function (lang) {
      publicadas.forEach(function (m) {
        const slug = m.slug;
        const htmlRel = lang
          ? lang + '/' + edicao + '/' + slug + '/index.html'
          : edicao + '/' + slug + '/index.html';
        const meta = readArticleMeta(htmlRel);

        if (!meta) {
          console.warn('AVISO: arquivo nao encontrado: ' + htmlRel + ' (pulando)');
          return;
        }

        const isPT = lang === '';
        const isCapaPT = slug === 'materia-de-capa' && isPT;

        const langPath = lang
          ? '/' + lang + '/' + edicao + '/' + slug + '/'
          : '/' + edicao + '/' + slug + '/';

        out += buildUrlEntry({
          loc: BASE_URL + langPath,
          lastmod: meta.lastmod,
          changefreq: 'monthly',
          priority: isPT ? (isCapaPT ? '1.0' : '0.9') : '0.7',
          hreflangs: {
            pt: BASE_URL + '/' + edicao + '/' + slug + '/',
            en: BASE_URL + '/en/' + edicao + '/' + slug + '/',
            es: BASE_URL + '/es/' + edicao + '/' + slug + '/',
          },
          news: isPT
            ? { publicationDate: meta.publishedTime, title: meta.title }
            : null,
        }) + '\n';
      });
    });
  });

  // Paginas legais (termos, privacidade, cookies) — PT, EN, ES
  const LEGAIS = ['termos', 'privacidade', 'cookies'];
  langs.forEach(function (lang) {
    LEGAIS.forEach(function (legal) {
      const langPath = lang
        ? '/' + lang + '/' + legal + '/'
        : '/' + legal + '/';
      out += buildUrlEntry({
        loc: BASE_URL + langPath,
        lastmod: TODAY,
        changefreq: 'yearly',
        priority: lang === '' ? '0.4' : '0.3',
        hreflangs: {
          pt: BASE_URL + '/' + legal + '/',
          en: BASE_URL + '/en/' + legal + '/',
          es: BASE_URL + '/es/' + legal + '/',
        },
      }) + '\n';
    });
  });

  out += '</urlset>\n';
  return out;
}

// ── 5. Main ──────────────────────────────────────────────────
try {
  const xml = generateSitemap();
  const outPath = path.join(ROOT, 'sitemap.xml');
  const urlCount = (xml.match(/<url>/g) || []).length;

  if (isDryRun) {
    process.stdout.write(xml);
    process.stderr.write('\n[DRY-RUN] ' + urlCount + ' URLs. sitemap.xml NAO foi gravado.\n');
  } else {
    fs.writeFileSync(outPath, xml, 'utf-8');
    console.log('✓ sitemap.xml gerado com ' + urlCount + ' URLs.');
  }
} catch (err) {
  console.error('ERRO: ' + err.message);
  process.exit(1);
}
