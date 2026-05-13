#!/usr/bin/env node
/**
 * adicionar-breadcrumb.js — Insere JSON-LD BreadcrumbList em todas
 * as materias de uma edicao (PT/EN/ES). Idempotente: pula se ja existir.
 *
 * Hierarquia: Home > Edicao XX > [titulo da materia]
 *
 * Uso:
 *   node scripts/adicionar-breadcrumb.js edicao-01
 *   node scripts/adicionar-breadcrumb.js edicao-02
 */

const fs = require('fs');
const path = require('path');

const edicaoArg = process.argv[2];
if (!edicaoArg || !/^edicao-\d{2}$/.test(edicaoArg)) {
  console.error('Uso: node scripts/adicionar-breadcrumb.js edicao-XX');
  process.exit(1);
}

const numero = edicaoArg.split('-')[1]; // "01", "02", ...

const LANGS = {
  pt: { home: 'Home',   edicao: `Edição ${numero}`,  baseUrl: '' },
  en: { home: 'Home',   edicao: `Edition ${numero}`, baseUrl: '/en' },
  es: { home: 'Inicio', edicao: `Edición ${numero}`, baseUrl: '/es' },
};

// Le slugs lendo o filesystem (toda pasta dentro de edicao-XX/ que tem index.html)
const baseDir = path.join(__dirname, '..', edicaoArg);
if (!fs.existsSync(baseDir)) {
  console.error(`Diretorio nao encontrado: ${baseDir}`);
  process.exit(1);
}

const slugs = fs.readdirSync(baseDir)
  .filter(name => {
    const fullPath = path.join(baseDir, name);
    return fs.statSync(fullPath).isDirectory()
        && fs.existsSync(path.join(fullPath, 'index.html'));
  });

console.log(`Edicao ${edicaoArg}: ${slugs.length} materias encontradas`);

function processFile(filePath, lang) {
  if (!fs.existsSync(filePath)) {
    console.log(`  -  ${filePath} (nao existe, pulando)`);
    return;
  }

  const cfg = LANGS[lang];
  const html = fs.readFileSync(filePath, 'utf8');

  if (html.includes('"@type": "BreadcrumbList"')) {
    console.log(`  =  ${filePath} (ja tem)`);
    return;
  }

  const titleMatch = html.match(/<title>([^<]+)<\/title>/);
  if (!titleMatch) {
    console.error(`  !  ${filePath}: sem <title>`);
    return;
  }
  const titleFull = titleMatch[1];
  const title = titleFull.replace(/\s*[—-]\s*BNI Business\s*$/, '').trim();

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": cfg.home,   "item": `https://bnibusiness.com.br${cfg.baseUrl}/` },
      { "@type": "ListItem", "position": 2, "name": cfg.edicao, "item": `https://bnibusiness.com.br${cfg.baseUrl}/${edicaoArg}/` },
      { "@type": "ListItem", "position": 3, "name": title }
    ]
  };

  const breadcrumbScript =
    '<script type="application/ld+json">\n' +
    JSON.stringify(breadcrumb, null, 2) +
    '\n</script>';

  // Inserir apos o primeiro </script> que fecha um JSON-LD existente
  const ldJsonPattern = /(<script type="application\/ld\+json">[\s\S]*?<\/script>)/;
  if (!ldJsonPattern.test(html)) {
    console.error(`  !  ${filePath}: sem JSON-LD anterior pra ancorar`);
    return;
  }

  const newHtml = html.replace(ldJsonPattern, `$1\n${breadcrumbScript}`);
  fs.writeFileSync(filePath, newHtml);
  console.log(`  +  ${filePath}`);
}

for (const slug of slugs) {
  processFile(path.join(__dirname, '..', edicaoArg, slug, 'index.html'), 'pt');
  processFile(path.join(__dirname, '..', 'en', edicaoArg, slug, 'index.html'), 'en');
  processFile(path.join(__dirname, '..', 'es', edicaoArg, slug, 'index.html'), 'es');
}

console.log('✓ Concluido');
