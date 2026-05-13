#!/usr/bin/env node
/**
 * atualizar-json-ld.js — Enriquece o JSON-LD Article das materias:
 *   1. Substitui author string por Person schema com sameAs
 *   2. Adiciona dateModified (default: hoje)
 *
 * Idempotente: se ja tiver Person schema com sameAs ou ja tiver dateModified,
 * atualiza in place sem duplicar.
 *
 * Uso:
 *   node scripts/atualizar-json-ld.js edicao-01
 *   node scripts/atualizar-json-ld.js edicao-02
 *   node scripts/atualizar-json-ld.js edicao-01 2026-05-13   (data customizada)
 */

const fs = require('fs');
const path = require('path');

const edicaoArg = process.argv[2];
const dataArg = process.argv[3] || new Date().toISOString().slice(0, 10); // YYYY-MM-DD

if (!edicaoArg || !/^edicao-\d{2}$/.test(edicaoArg)) {
  console.error('Uso: node scripts/atualizar-json-ld.js edicao-XX [YYYY-MM-DD]');
  process.exit(1);
}

const baseDir = path.join(__dirname, '..', edicaoArg);
if (!fs.existsSync(baseDir)) {
  console.error(`Diretorio nao encontrado: ${baseDir}`);
  process.exit(1);
}

const slugs = fs.readdirSync(baseDir)
  .filter(name => {
    const full = path.join(baseDir, name);
    return fs.statSync(full).isDirectory() && fs.existsSync(path.join(full, 'index.html'));
  });

console.log(`${edicaoArg}: ${slugs.length} materias, dateModified: ${dataArg}`);

// Person schema da Fernanda Sodre (unica autora ate hoje das duas edicoes)
const FERNANDA = {
  "@type": "Person",
  "name": "Fernanda Sodré",
  "url": "https://instagram.com/eufernandasodre",
  "sameAs": [
    "https://instagram.com/eufernandasodre"
  ]
};

function updateFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`  -  ${filePath} (nao existe)`);
    return;
  }
  let html = fs.readFileSync(filePath, 'utf8');

  // Localiza o bloco <script type="application/ld+json"> ... </script> Article
  // (o primeiro JSON-LD do head — o BreadcrumbList vem depois).
  const ldRegex = /(<script type="application\/ld\+json">\s*)(\{[\s\S]*?\})(\s*<\/script>)/;
  const m = html.match(ldRegex);
  if (!m) {
    console.log(`  !  ${filePath}: sem JSON-LD`);
    return;
  }

  let json;
  try {
    json = JSON.parse(m[2]);
  } catch (err) {
    console.error(`  !  ${filePath}: JSON-LD invalido (${err.message})`);
    return;
  }

  // So mexe se for um Article (nao BreadcrumbList ou outros)
  if (json["@type"] !== "Article") {
    console.log(`  -  ${filePath}: primeiro JSON-LD nao e Article (${json["@type"]})`);
    return;
  }

  // 1. Author → Person schema completo
  json.author = FERNANDA;

  // 2. dateModified
  json.dateModified = dataArg;

  // Reescreve preservando indentacao "humana" (2 espacos)
  const newJson = JSON.stringify(json, null, 2);
  const newBlock = `${m[1]}${newJson}${m[3]}`;
  const newHtml = html.replace(ldRegex, newBlock);

  if (newHtml === html) {
    console.log(`  =  ${filePath} (sem mudancas)`);
    return;
  }

  fs.writeFileSync(filePath, newHtml);
  console.log(`  ✓  ${path.relative(path.join(__dirname, '..'), filePath)}`);
}

for (const slug of slugs) {
  updateFile(path.join(__dirname, '..', edicaoArg, slug, 'index.html'));
  updateFile(path.join(__dirname, '..', 'en', edicaoArg, slug, 'index.html'));
  updateFile(path.join(__dirname, '..', 'es', edicaoArg, slug, 'index.html'));
}

console.log('✓ Concluido');
