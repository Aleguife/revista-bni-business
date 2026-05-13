#!/usr/bin/env node
/**
 * atualizar-nav-edicao.js — Atualiza os hrefs dos botoes "Materia Anterior /
 * Proxima Materia" em cada materia de uma edicao, baseado na ordem definida
 * em painel/admin.js (MATERIAS_POR_EDICAO).
 *
 * Wrap-around: materia 1 prev = ultima, ultima next = 1.
 * Funciona em PT (edicao-XX/), EN (en/edicao-XX/) e ES (es/edicao-XX/).
 *
 * Uso:
 *   node scripts/atualizar-nav-edicao.js edicao-01
 *   node scripts/atualizar-nav-edicao.js edicao-02
 */

const fs = require('fs');
const path = require('path');

const edicaoArg = process.argv[2];
if (!edicaoArg || !/^edicao-\d{2}$/.test(edicaoArg)) {
  console.error('Uso: node scripts/atualizar-nav-edicao.js edicao-XX');
  process.exit(1);
}

// Le ordem das materias do admin.js
const adminJs = fs.readFileSync(path.join(__dirname, '..', 'painel', 'admin.js'), 'utf8');
const blockMatch = adminJs.match(new RegExp(`'${edicaoArg}':\\s*\\[([\\s\\S]*?)\\],?\\s*(?:'edicao-|};)`));
if (!blockMatch) {
  console.error(`Nao achei o bloco MATERIAS_POR_EDICAO['${edicaoArg}'] no admin.js`);
  process.exit(1);
}

const slugs = [...blockMatch[1].matchAll(/slug:\s*'([^']+)'/g)].map(m => m[1]);
if (slugs.length === 0) {
  console.error('Nenhum slug extraido — verifique o formato');
  process.exit(1);
}
console.log(`${edicaoArg}: ${slugs.length} materias na ordem: ${slugs.join(', ')}`);

const LANG_PATHS = {
  pt: { dir: edicaoArg,            urlPrefix: ''     },
  en: { dir: `en/${edicaoArg}`,    urlPrefix: '/en'  },
  es: { dir: `es/${edicaoArg}`,    urlPrefix: '/es'  },
};

function updateNav(filePath, urlPrefix, prevSlug, nextSlug) {
  if (!fs.existsSync(filePath)) {
    console.log(`  -  ${filePath} (nao existe)`);
    return;
  }
  const html = fs.readFileSync(filePath, 'utf8');

  const prevUrl = `${urlPrefix}/${edicaoArg}/${prevSlug}/`;
  const nextUrl = `${urlPrefix}/${edicaoArg}/${nextSlug}/`;

  // Pattern resiliente: troca `href="#"` ou `href="..."` dentro de cada botao
  // pelos slugs reais. Usa marcadores de classe pra identificar prev vs next.
  let newHtml = html;
  let changed = false;

  // PREV: <a class="... nav-edicao-prev" href="WHATEVER">
  const prevRegex = /(<a\s+class="[^"]*nav-edicao-prev[^"]*"\s+href=")[^"]*(")/;
  if (prevRegex.test(newHtml)) {
    newHtml = newHtml.replace(prevRegex, `$1${prevUrl}$2`);
    changed = true;
  }

  // NEXT
  const nextRegex = /(<a\s+class="[^"]*nav-edicao-next[^"]*"\s+href=")[^"]*(")/;
  if (nextRegex.test(newHtml)) {
    newHtml = newHtml.replace(nextRegex, `$1${nextUrl}$2`);
    changed = true;
  }

  if (!changed) {
    console.log(`  !  ${filePath}: sem botoes nav-edicao-prev/next pra atualizar`);
    return;
  }

  fs.writeFileSync(filePath, newHtml);
  console.log(`  ✓  ${path.relative(path.join(__dirname, '..'), filePath)} (prev: ${prevSlug}, next: ${nextSlug})`);
}

for (let i = 0; i < slugs.length; i++) {
  const slug = slugs[i];
  const prevSlug = slugs[(i - 1 + slugs.length) % slugs.length]; // wrap
  const nextSlug = slugs[(i + 1) % slugs.length];                 // wrap

  for (const [lang, cfg] of Object.entries(LANG_PATHS)) {
    const filePath = path.join(__dirname, '..', cfg.dir, slug, 'index.html');
    updateNav(filePath, cfg.urlPrefix, prevSlug, nextSlug);
  }
}

console.log('✓ Concluido');
