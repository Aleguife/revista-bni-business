// =============================================
// BNI BUSINESS — ADMIN CMS v2
// =============================================

// Senha padrão: bni@2025 (mude o hash abaixo)
// Gere em: https://emn178.github.io/online-tools/sha256.html
const SENHA_HASH = 'PLACEHOLDER';

const REPO_OWNER = 'Aleguife';
const REPO_NAME  = 'revista-bni-business';

// ── MAPA: valor do <select> → dados da matéria ──
const SECAO_MAP = {
  'eventos-1':       { label: 'Eventos',                slug: 'cigar-night'          },
  'case-1':          { label: 'Case de sucesso',         slug: 'magna-marinho'        },
  'capa':            { label: 'Matéria de Capa',         slug: 'felipe-xavier'        },
  'editorial':       { label: 'Editorial',               slug: 'o-impresso'           },
  'negocios-1':      { label: 'Negócios',                slug: 'up-brasil'            },
  'saude-mental':    { label: 'Saúde mental',            slug: 'tonos'                },
  'direito':         { label: 'Direito',                 slug: 'aposentasp'           },
  'estilo':          { label: 'Estilo',                  slug: 'msr-golden'           },
  'bni-mundi':       { label: 'BNI Mundi',               slug: 'bni-mundi'            },
  'reconhecimento':  { label: 'Reconhecimento',          slug: 'reconhecimento'       },
  'dev-pessoal':     { label: 'Desenvolvimento pessoal', slug: 'massaru-ogata'        },
  'turismo':         { label: 'Turismo',                 slug: 'monaco'               },
  'bni-sao-francisco':{ label: 'BNI São Francisco',      slug: 'bni-sao-francisco'    },
  'eventos-2':       { label: 'Eventos',                 slug: 'salleven'             },
  'case-2':          { label: 'Case de sucesso',         slug: 'jose-roberto-teixeira'},
  'negocios-2':      { label: 'Negócios',                slug: 'fia-business-school'  },
};

const MATERIAS = [
  { num:1,  secao:'Eventos',                titulo:'Cigar Night — Rodrigo Motta',            slug:'cigar-night',            status:'publicada' },
  { num:2,  secao:'Case de sucesso',         titulo:'Magna Marinho / ELA',                    slug:'magna-marinho',          status:'pendente'  },
  { num:3,  secao:'Case de sucesso',         titulo:'José Roberto Teixeira / JRT Print',      slug:'jose-roberto-teixeira',  status:'pendente'  },
  { num:4,  secao:'Matéria de Capa',         titulo:'Felipe Xavier / Redax Engenharia',       slug:'felipe-xavier',          status:'publicada' },
  { num:5,  secao:'Editorial',               titulo:'O impresso que o digital não substitui', slug:'o-impresso',             status:'pendente'  },
  { num:6,  secao:'Negócios',                titulo:'Up Brasil / Mariana Cerone',             slug:'up-brasil',              status:'pendente'  },
  { num:7,  secao:'Saúde mental',            titulo:'Tonos / Elisa de Lima',                  slug:'tonos',                  status:'pendente'  },
  { num:8,  secao:'Direito',                 titulo:'AposentaSP / Dra. Simone Baptista',      slug:'aposentasp',             status:'pendente'  },
  { num:9,  secao:'Estilo',                  titulo:'MSR Device Golden / Anderson Oliveira',  slug:'msr-golden',             status:'pendente'  },
  { num:10, secao:'BNI Mundi',               titulo:'WPO Languages / Waldir Pires',           slug:'bni-mundi',              status:'pendente'  },
  { num:11, secao:'Reconhecimento',          titulo:'Evento BNI OESP',                        slug:'reconhecimento',         status:'pendente'  },
  { num:12, secao:'Desenvolvimento pessoal', titulo:'Massaru Ogata / IFT',                    slug:'massaru-ogata',          status:'pendente'  },
  { num:13, secao:'Eventos',                 titulo:'Salleven / Carla Sallada',               slug:'salleven',               status:'pendente'  },
  { num:14, secao:'Turismo',                 titulo:'Mônaco / Convenção BNI 2026',            slug:'monaco',                 status:'pendente'  },
  { num:15, secao:'Negócios',                titulo:'FIA Business School',                    slug:'fia-business-school',    status:'pendente'  },
  { num:16, secao:'BNI São Francisco',       titulo:'BNI São Francisco',                      slug:'bni-sao-francisco',      status:'pendente'  },
];

const RASCUNHO_KEY   = 'bni-rascunho';
const CAMPOS_SIMPLES = [
  ['f-secao',        'secao'],
  ['f-titulo',       'titulo'],
  ['f-olho',         'olho'],
  ['f-slug',         'slug'],
  ['f-empresa',      'empresa'],
  ['f-profissional', 'profissional'],
  ['f-autor',        'autor'],
  ['f-data',         'data'],
  ['f-imagem-url',   'imagemUrl'],
  ['f-imagem-alt',   'imagemAlt'],
];

// ── HELPERS ───────────────────────────────────
function toKebab(str) {
  return str.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

// Extrai o incremento numérico do valor do select (ex: "eventos-2" → 2)
function incrementoDaSecao(secaoKey) {
  const partes = secaoKey.split('-');
  const ultimo = partes[partes.length - 1];
  return /^\d+$/.test(ultimo) ? parseInt(ultimo, 10) : 1;
}

// ── QUILL EDITOR ──────────────────────────────
let quill;
document.addEventListener('DOMContentLoaded', function () {
  if (!document.getElementById('f-texto-editor')) return;

  quill = new Quill('#f-texto-editor', {
    theme: 'snow',
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline'],
        [{ header: 2 }, { header: 3 }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['clean'],
      ],
      clipboard: { matchVisual: false },
    },
    placeholder: 'Cole aqui o texto completo. Bold, italic, listas e subtítulos são preservados automaticamente ao colar do InDesign ou Word.',
  });

  // Restaura rascunho do localStorage
  restaurarRascunho();

  // Auto-save no Quill
  quill.on('text-change', agendarSalvamento);

  // Auto-save nos campos simples (exclui credenciais)
  document.querySelectorAll('#aba-nova-materia input, #aba-nova-materia select, #aba-nova-materia textarea')
    .forEach(function (el) {
      if (el.id === 'f-api-key' || el.id === 'f-github-token') return;
      el.addEventListener('input',  agendarSalvamento);
      el.addEventListener('change', agendarSalvamento);
    });

  // Auto-save nos campos dinâmicos (frases e CTAs) via event delegation
  document.getElementById('frases-container').addEventListener('input',  agendarSalvamento);
  document.getElementById('ctas-container').addEventListener('input',    agendarSalvamento);
  document.getElementById('ctas-container').addEventListener('change',   agendarSalvamento);
});

// ── RASCUNHO (AUTO-SAVE) ──────────────────────
let _saveTimer = null;

function agendarSalvamento() {
  clearTimeout(_saveTimer);
  _saveTimer = setTimeout(salvarRascunho, 500);
}

function salvarRascunho() {
  const r = {
    texto:  quill ? quill.root.innerHTML : '',
    frases: getFrases(),
    ctas:   getCTAs(),
  };
  CAMPOS_SIMPLES.forEach(function ([id, key]) { r[key] = val(id); });
  localStorage.setItem(RASCUNHO_KEY, JSON.stringify(r));
}

function restaurarRascunho() {
  const raw = localStorage.getItem(RASCUNHO_KEY);
  if (!raw) return;
  let r;
  try { r = JSON.parse(raw); } catch (e) { return; }

  // Campos simples
  CAMPOS_SIMPLES.forEach(function ([id, key]) {
    const el = document.getElementById(id);
    if (el && r[key] != null) el.value = r[key];
  });

  // Editor Quill
  if (quill && r.texto) quill.root.innerHTML = r.texto;

  // Frases de destaque
  if (Array.isArray(r.frases) && r.frases.length) {
    const c = document.getElementById('frases-container');
    c.innerHTML = '';
    r.frases.forEach(function (f) {
      const div = document.createElement('div');
      div.className = 'frase-item';
      div.innerHTML =
        '<input type="text" class="frase-input" value="' + f.replace(/"/g, '&quot;') + '">' +
        '<button type="button" class="btn-remove" onclick="removerFrase(this)" title="Remover">✕</button>';
      c.appendChild(div);
    });
  }

  // Botões de CTA
  if (Array.isArray(r.ctas) && r.ctas.length) {
    document.getElementById('cta-vazio').style.display = 'none';
    const c = document.getElementById('ctas-container');
    c.innerHTML = '';
    r.ctas.forEach(function (cta) {
      const div = document.createElement('div');
      div.className = 'cta-item';
      div.innerHTML =
        '<select class="cta-tipo">' +
          CTA_TIPOS.map(function (t) {
            return '<option' + (t === cta.tipo ? ' selected' : '') + '>' + t + '</option>';
          }).join('') +
        '</select>' +
        '<input type="text" class="cta-texto" placeholder="Texto do botão" value="' + (cta.texto || '').replace(/"/g, '&quot;') + '">' +
        '<input type="text" class="cta-link"  placeholder="Link"            value="' + (cta.link  || '').replace(/"/g, '&quot;') + '">' +
        '<button type="button" class="btn-remove" onclick="removerCTA(this)">✕</button>';
      c.appendChild(div);
    });
  }
}

// ── LOGIN ─────────────────────────────────────
async function fazerLogin() {
  const input = document.getElementById('senha-input').value;
  const hash  = await sha256(input);
  const ok    = (hash === SENHA_HASH) || (SENHA_HASH === 'PLACEHOLDER' && input === 'bni@2025');
  if (ok) {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('painel').classList.remove('hidden');
    renderChecklist();
    document.getElementById('f-data').valueAsDate = new Date();
  } else {
    document.getElementById('login-error').classList.add('show');
    document.getElementById('senha-input').value = '';
    document.getElementById('senha-input').focus();
  }
}

function sair() {
  document.getElementById('painel').classList.add('hidden');
  document.getElementById('login-screen').classList.remove('hidden');
  document.getElementById('senha-input').value = '';
}

async function sha256(msg) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(msg));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
}

// ── NAVEGAÇÃO ─────────────────────────────────
function mostrarAba(id, el) {
  document.querySelectorAll('.aba').forEach(a => a.classList.add('hidden'));
  document.getElementById('aba-' + id).classList.remove('hidden');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (el) el.classList.add('active');
  if (id === 'checklist') renderChecklist();
}

// ── SLUG + IMAGEM + ALT AUTOMÁTICOS ──────────
function onSecaoChange() {
  const key  = document.getElementById('f-secao').value;
  const hint = document.getElementById('slug-hint');
  if (!key || !SECAO_MAP[key]) { hint.textContent = ''; return; }

  const { slug, label } = SECAO_MAP[key];
  const statusSalvo = JSON.parse(localStorage.getItem('bni-status') || '{}');
  const materia     = MATERIAS.find(m => m.slug === slug);

  // 1. Slug
  document.getElementById('f-slug').value = slug;
  hint.textContent = (materia && (statusSalvo[slug] === 'publicada' || materia.status === 'publicada'))
    ? '⚠ Esta matéria já está publicada. Publicar novamente irá sobrescrever.'
    : '';

  // 2. Imagem Hero — img/<secao-kebab><incremento>.webp
  const inc       = incrementoDaSecao(key);
  const secaoKebab = toKebab(label);
  document.getElementById('f-imagem-url').value = `img/${secaoKebab}${inc}.webp`;

  // 3. Alt text
  atualizarAlt(label);
}

function onTituloInput() {
  const key   = document.getElementById('f-secao').value;
  const label = (key && SECAO_MAP[key]) ? SECAO_MAP[key].label : '';
  atualizarAlt(label);
}

function atualizarAlt(secaoLabel) {
  const titulo  = (document.getElementById('f-titulo').value  || '').trim();
  const empresa = (document.getElementById('f-empresa').value || '').trim();
  if (!titulo) return;
  const partes = [titulo];
  if (empresa)    partes.push(empresa);
  if (secaoLabel) partes.push(secaoLabel);
  partes.push('Revista BNI Business');
  document.getElementById('f-imagem-alt').value = partes.join(' — ');
}

// ── FRASES DINÂMICAS ──────────────────────────
function adicionarFrase() {
  const container = document.getElementById('frases-container');
  const div = document.createElement('div');
  div.className = 'frase-item';
  div.innerHTML = `<input type="text" class="frase-input" placeholder="Digite a frase de destaque...">
    <button type="button" class="btn-remove" onclick="removerFrase(this)" title="Remover">✕</button>`;
  container.appendChild(div);
  div.querySelector('input').focus();
}

function removerFrase(btn) {
  const container = document.getElementById('frases-container');
  if (container.children.length <= 1) {
    btn.closest('.frase-item').querySelector('input').value = '';
    return;
  }
  btn.closest('.frase-item').remove();
}

function getFrases() {
  return Array.from(document.querySelectorAll('.frase-input'))
    .map(i => i.value.trim()).filter(Boolean);
}

// ── CTAs DINÂMICOS ────────────────────────────
const CTA_TIPOS = ['WhatsApp', 'Site', 'Instagram', 'LinkedIn', 'E-mail', 'YouTube', 'Outro'];

function adicionarCTA() {
  const container = document.getElementById('ctas-container');
  document.getElementById('cta-vazio').style.display = 'none';

  const div = document.createElement('div');
  div.className = 'cta-item';
  div.innerHTML = `
    <select class="cta-tipo">
      ${CTA_TIPOS.map(t => `<option>${t}</option>`).join('')}
    </select>
    <input type="text" class="cta-texto" placeholder="Texto do botão (Ex: Fale conosco)">
    <input type="text" class="cta-link" placeholder="Link">
    <button type="button" class="btn-remove" onclick="removerCTA(this)">✕</button>`;
  container.appendChild(div);
}

function removerCTA(btn) {
  btn.closest('.cta-item').remove();
  if (document.querySelectorAll('.cta-item').length === 0) {
    document.getElementById('cta-vazio').style.display = 'block';
  }
}

function getCTAs() {
  return Array.from(document.querySelectorAll('.cta-item')).map(el => ({
    tipo:  el.querySelector('.cta-tipo').value,
    texto: el.querySelector('.cta-texto').value.trim(),
    link:  el.querySelector('.cta-link').value.trim(),
  })).filter(c => c.link);
}

// ── FORMULÁRIO ────────────────────────────────
function limparForm() {
  ['f-secao','f-titulo','f-olho','f-slug','f-empresa','f-profissional',
   'f-autor','f-imagem-url','f-imagem-alt'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  if (quill) quill.setContents([]);
  document.getElementById('f-data').valueAsDate = new Date();
  document.getElementById('frases-container').innerHTML =
    `<div class="frase-item"><input type="text" class="frase-input" placeholder='"Conexões que transformam negócios em legados"'>
    <button class="btn-remove" onclick="removerFrase(this)">✕</button></div>`;
  document.getElementById('ctas-container').innerHTML = '';
  document.getElementById('cta-vazio').style.display = 'block';
  document.getElementById('slug-hint').textContent = '';
  document.getElementById('card-status').style.display  = 'none';
  document.getElementById('card-preview').style.display = 'none';
  localStorage.removeItem(RASCUNHO_KEY);
}

function val(id) { return (document.getElementById(id)?.value || '').trim(); }

// ── GERAR MATÉRIA ─────────────────────────────
async function gerarMateria() {
  const apiKey = val('f-api-key');
  if (!apiKey) { alert('Informe a chave da API Claude.'); return; }

  const secaoVal = val('f-secao');
  const secaoLabel = secaoVal && SECAO_MAP[secaoVal] ? SECAO_MAP[secaoVal].label : secaoVal;

  const dados = {
    secao:       secaoLabel,
    olho:        val('f-olho'),
    titulo:      val('f-titulo'),
    slug:        val('f-slug'),
    empresa:     val('f-empresa'),
    profissional: val('f-profissional'),
    autor:       val('f-autor'),
    data:        val('f-data'),
    imagemUrl:   val('f-imagem-url') || `/edicao-02/${val('f-slug')}/hero.jpg`,
    imagemAlt:   val('f-imagem-alt'),
    texto:       quill ? quill.root.innerHTML : '',
    frases:      getFrases(),
    ctas:        getCTAs(),
  };

  if (!dados.titulo || !dados.slug || !dados.texto) {
    alert('Preencha pelo menos: Título, Slug e Texto base.');
    return;
  }

  mostrarStatus();
  addLog('Enviando para a IA...', 'loading');

  try {
    const html = await chamarClaudeAPI(apiKey, dados);
    addLog('HTML gerado com sucesso!', 'ok');
    mostrarPreview(html);
  } catch (e) {
    addLog('Erro: ' + e.message, 'erro');
  }
}

async function chamarClaudeAPI(apiKey, dados) {
  // Chama o proxy local para evitar bloqueio de CORS
  const response = await fetch('/painel/proxy.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5',
      max_tokens: 8000,
      messages: [{ role: 'user', content: montarPrompt(dados) }],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `HTTP ${response.status}`);
  }

  const data = await response.json();
  const texto = data.content?.find(c => c.type === 'text')?.text || '';
  const match = texto.match(/```html\s*([\s\S]*?)```/);
  return match ? match[1].trim() : texto.trim();
}

function montarPrompt(d) {
  const frasesStr = d.frases.length
    ? d.frases.map((f,i) => `Frase ${i+1}: ${f}`).join('\n')
    : '(gere 2 frases de destaque impactantes com no máximo 15 palavras cada)';

  const ctasStr = d.ctas.length
    ? d.ctas.map(c => `- ${c.tipo}: texto "${c.texto}" → link: ${c.link}`).join('\n')
    : '(sem CTA — omita a section.cta-section completamente)';

  const dataFormatada = d.data
    ? new Date(d.data + 'T12:00:00').toLocaleDateString('pt-BR', { day:'2-digit', month:'long', year:'numeric' })
    : '';

  const dataISO = d.data || '';
  const slug = d.slug || 'materia';

  return `Você é o sistema de geração de matérias da Revista BNI Business.

Gere uma página HTML COMPLETA seguindo EXATAMENTE o template abaixo.
NÃO invente estrutura nova. NÃO use classes diferentes das mostradas no template.
NÃO use /assets/css/materia.css — todo CSS está inline no <style>.
Substitua apenas os conteúdos marcados com [COLCHETES].

═══ DADOS DA MATÉRIA ═══
Seção: ${d.secao}
Título: ${d.titulo}
Olho/Subtítulo: ${d.olho || '(gere um subtítulo de uma frase)'}
Empresa: ${d.empresa}
Profissional: ${d.profissional}
Autor: ${d.autor || ''}
Data formatada: ${dataFormatada || ''}
Data ISO: ${dataISO}
Slug: ${slug}
Imagem hero: src="${d.imagemUrl}" alt="${d.imagemAlt || d.titulo}"

Texto base da matéria (preserve TODA formatação HTML — bold, italic, listas, h2, h3 etc.):
${d.texto}

Frases de destaque (cada uma vira um .citacao-bloco intercalado no artigo):
${frasesStr}

CTAs:
${ctasStr}

═══ TEMPLATE HTML — COPIE E PREENCHA ═══

\`\`\`html
<!DOCTYPE html>
<html lang="pt-BR" data-lang="PT">
<head>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-KX2T4K1YJG"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-KX2T4K1YJG');
</script>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${d.titulo} — BNI Business</title>
<meta name="description" content="[DESCRIÇÃO SEO de 150 caracteres baseada no texto]">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Revista BNI Business">
<meta property="og:title" content="${d.titulo} | BNI Business">
<meta property="og:description" content="[DESCRIÇÃO]">
<meta property="og:image" content="https://bnibusiness.com.br/edicao-02/${slug}/img/og-cover.webp">
<meta property="og:url" content="https://bnibusiness.com.br/edicao-02/${slug}">
<meta property="og:locale" content="pt_BR">
<meta name="robots" content="index, follow, max-image-preview:large">
${d.autor ? `<meta name="author" content="${d.autor}">` : ''}
<meta property="article:section" content="${d.secao}">
${dataISO ? `<meta property="article:published_time" content="${dataISO}">` : ''}
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${d.titulo} | BNI Business">
<meta name="twitter:description" content="[DESCRIÇÃO]">
<meta name="twitter:image" content="https://bnibusiness.com.br/edicao-02/${slug}/img/og-cover.webp">
<link rel="canonical" href="https://bnibusiness.com.br/edicao-02/${slug}/">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Barlow+Condensed:wght@300;400;500;600&family=Barlow:wght@300;400;500&display=swap" rel="stylesheet">
<script src="../../nav.js?v=2026050303" defer></script>
<script src="../../footer.js?v=2026050303" defer></script>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root { --vermelho: #C8102E; --preto: #1a1a1a; --creme: #F5F0E8; --creme-escuro: #EAE3D5; --cinza: #888; --branco: #fff; }
  html { scroll-behavior: smooth; }
  body { background: var(--creme); color: var(--preto); font-family: 'Barlow', sans-serif; font-weight: 400; line-height: 1.7; overflow-x: hidden; }

  /* HERO */
  .hero { display: grid; grid-template-columns: 1fr 1fr; min-height: 90vh; background: var(--creme); }
  .hero-foto { position: relative; overflow: hidden; background: #2a2a2a; }
  .hero-foto img { width: 100%; height: 110%; object-fit: cover; object-position: center top; display: block; filter: grayscale(8%); will-change: transform; }
  .hero-foto-caption { position: absolute; bottom: 5rem; right: 2rem; text-align: right; }
  .hero-foto-caption p { font-family: 'Barlow Condensed', sans-serif; font-size: 14px; color: var(--branco); line-height: 1.5; background: rgba(26,26,26,0.75); padding: 10px 14px; display: inline-block; max-width: 250px; }
  .hero-foto-caption strong { display: block; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
  .hero-texto { padding: 4rem 4rem 4rem 5rem; display: flex; flex-direction: column; justify-content: center; background: var(--creme); }
  .hero-byline { font-family: 'Barlow Condensed', sans-serif; font-size: 14px; letter-spacing: 2px; color: var(--cinza); text-transform: uppercase; margin-bottom: 2rem; display: flex; flex-direction: column; gap: 4px; }
  .hero-byline .bl-secao { color: var(--vermelho); font-weight: 600; display: flex; align-items: center; gap: 6px; }
  .hero-byline .bl-secao::before { content: '◤'; font-size: 11px; }
  .hero-titulo { font-family: 'Playfair Display', serif; font-size: clamp(2.5rem, 4vw, 4.5rem); font-weight: 900; line-height: 1.05; color: var(--preto); margin-bottom: 2rem; letter-spacing: -0.5px; }
  .hero-chapeu { font-family: 'Barlow', sans-serif; font-size: 1.2rem; line-height: 1.5; color: #333; border-left: 3px solid var(--vermelho); padding-left: 1.5rem; margin-bottom: 2.5rem; }
  .hero-assina { font-family: 'Barlow Condensed', sans-serif; font-size: 12px; letter-spacing: 1.5px; color: var(--cinza); text-transform: uppercase; }
  .hero-assina span { color: var(--preto); font-weight: 600; }

  /* DIVISOR */
  .divisor { height: 3px; background: linear-gradient(90deg, var(--vermelho) 0%, var(--vermelho) 40%, var(--creme-escuro) 40%); transform: scaleX(0); transform-origin: left; transition: transform 0.8s cubic-bezier(0.4,0,0.2,1); }
  .divisor.animado { transform: scaleX(1); }

  /* ARTIGO */
  .artigo { max-width: 1100px; margin: 0 auto; padding: 4rem; }
  .artigo > div { margin-top: 3.5rem; }
  .artigo > div:first-child { margin-top: 0; }
  .texto-duplo { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; }
  .texto-duplo p { font-family: 'Barlow', sans-serif; font-size: 1.125rem; font-weight: 300; line-height: 1.7; color: #2a2a2a; text-indent: 1.5em; }
  .texto-triplo { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 2.5rem; }
  .texto-triplo p { font-family: 'Barlow', sans-serif; font-size: 1.125rem; font-weight: 300; line-height: 1.7; color: #2a2a2a; text-indent: 1.5em; }
  .secao-titulo { font-family: 'Barlow Condensed', sans-serif; font-size: 18px; font-weight: 600; letter-spacing: 2.5px; text-transform: uppercase; color: var(--vermelho); margin-bottom: 1.5rem; padding-bottom: 0.4rem; display: block; position: relative; }
  .secao-titulo::after { content: ''; position: absolute; bottom: 0; left: 0; height: 2px; width: 0; background: var(--vermelho); transition: width 0.6s cubic-bezier(0.4,0,0.2,1); }
  .secao-titulo.animado::after { width: 100%; }

  /* CITAÇÕES */
  .citacao-bloco { background: var(--vermelho); padding: 3.5rem 4rem; position: relative; opacity: 0; transform: translateX(-30px); transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.4,0,0.2,1); }
  .citacao-bloco.visible { opacity: 1; transform: translateX(0); }
  .citacao-bloco blockquote { font-family: 'Playfair Display', serif; font-size: clamp(1.3rem,2.5vw,1.8rem); font-style: italic; color: var(--branco); line-height: 1.5; font-weight: 400; padding-left: 5rem; position: relative; }
  .citacao-bloco blockquote::before { content: '"'; font-family: 'Playfair Display', serif; font-size: 9rem; font-style: normal; color: rgba(255,255,255,0.25); position: absolute; left: -0.5rem; top: -1.5rem; line-height: 1; }
  .citacao-lateral { border-left: 4px solid var(--vermelho); padding: 1rem 1.5rem; float: right; width: 45%; margin-left: 2.5rem; margin-bottom: 1rem; }
  .citacao-lateral p { font-family: 'Playfair Display', serif; font-size: 1.15rem; font-style: italic; color: var(--preto); line-height: 1.5; text-indent: 0 !important; }

  /* FOTO */
  .foto-larga { margin: 3rem 0 1rem; }
  .foto-larga img { width: 100%; height: auto; display: block; }
  .foto-larga figcaption { font-family: 'Barlow Condensed', sans-serif; font-size: 14px; color: #2a2a2a; margin-top: 0.5rem; line-height: 1.5; }
  .clearfix::after { content: ''; display: block; clear: both; height: 0; }

  /* FADE IN */
  .fade-in { opacity: 0; transform: translateY(24px); transition: opacity 0.7s ease, transform 0.7s ease; overflow: hidden; }
  .fade-in.visible { opacity: 1; transform: translateY(0); }

  /* CTA */
  .cta-section { background: var(--creme-escuro); }
  .cta-inner { max-width: 1100px; margin: 0 auto; padding: 4rem; display: flex; align-items: center; justify-content: space-between; gap: 2rem; flex-wrap: wrap; }
  .cta-texto h3 { font-family: 'Playfair Display', serif; font-size: clamp(1.4rem,2.5vw,2rem); font-weight: 700; color: var(--preto); margin-bottom: 0.5rem; line-height: 1.2; }
  .cta-texto p { font-family: 'Barlow', sans-serif; font-size: 1rem; color: #555; }
  .cta-botoes { display: flex; gap: 1rem; flex-wrap: wrap; }
  .cta-btn { display: inline-flex; align-items: center; gap: 10px; padding: 0.9rem 1.8rem; font-family: 'Barlow Condensed', sans-serif; font-size: 13px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; text-decoration: none; transition: transform 0.2s, box-shadow 0.2s; white-space: nowrap; }
  .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.15); }
  .cta-btn--whatsapp { background: #25D366; color: #fff; }
  .cta-btn--instagram { background: #E1306C; color: #fff; }
  .cta-btn--linkedin { background: #0077B5; color: #fff; }
  .cta-btn--site { background: var(--vermelho); color: #fff; }
  .cta-btn--email { background: #555; color: #fff; }
  .cta-btn--youtube { background: #FF0000; color: #fff; }
  .cta-btn--outro { background: #333; color: #fff; }
  .cta-btn svg { flex-shrink: 0; }

  /* NAV ENTRE MATÉRIAS */
  .nav-edicao { display: flex; align-items: center; justify-content: center; gap: 1.5rem; padding: 4rem; background: var(--branco); border-top: 1px solid var(--creme-escuro); }
  .nav-edicao-btn { display: inline-flex; align-items: center; gap: 0.8rem; padding: 1rem 2rem; font-family: 'Barlow Condensed', sans-serif; font-size: 13px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; text-decoration: none; border: 2px solid var(--vermelho); color: var(--vermelho); background: transparent; transition: background 0.2s, color 0.2s; }
  .nav-edicao-btn:hover { background: var(--vermelho); color: var(--branco); }

  /* RESPONSIVE */
  @media (max-width: 900px) {
    .hero { grid-template-columns: 1fr; min-height: auto; }
    .hero-foto { height: 100vh; }
    .hero-texto { padding: 2.5rem 1.5rem; }
    .texto-duplo, .texto-triplo { grid-template-columns: 1fr; gap: 0; }
    .citacao-lateral { float: none; width: 100%; margin: 1.5rem 0; }
    .artigo { padding: 3rem 1.2rem; }
    .citacao-bloco { padding: 2rem 1.5rem; }
    .citacao-bloco blockquote { padding-left: 0; }
    .citacao-bloco blockquote::before { position: static; display: block; font-size: 6rem; line-height: 0.5; margin-bottom: 0.5rem; }
    .cta-inner { flex-direction: column; padding: 2.5rem 1.5rem; }
    .cta-botoes { width: 100%; flex-direction: column; }
    .cta-btn { width: 100%; justify-content: center; }
    .nav-edicao { flex-direction: column; padding: 2.5rem 1.5rem; gap: 1rem; }
    .nav-edicao-btn { width: 100%; justify-content: center; }
  }
</style>
</head>
<body>

<!-- HERO -->
<section class="hero">
  <div class="hero-foto">
    <img src="${d.imagemUrl}" alt="${d.imagemAlt || d.titulo}" loading="eager" fetchpriority="high" />
    <div class="hero-foto-caption">
      <p><strong>${d.profissional || d.empresa}</strong> — [CARGO OU DESCRIÇÃO BREVE DO PROFISSIONAL]</p>
    </div>
  </div>
  <div class="hero-texto fade-in">
    <div class="hero-byline">
      <span class="bl-secao">${d.secao}</span>
      ${dataFormatada ? `<span class="bl-data">${dataFormatada}</span>` : ''}
    </div>
    <h1 class="hero-titulo">
      [QUEBRE O TÍTULO EM 2-3 LINHAS COM &lt;br&gt; — use &lt;span style="color:var(--vermelho);"&gt; para palavras-chave em vermelho]
    </h1>
    <p class="hero-chapeu">${d.olho || '[OLHO/SUBTÍTULO]'}</p>
    ${d.autor ? `<div class="hero-assina">Por <span>${d.autor}</span></div>` : ''}
  </div>
</section>

<div class="divisor"></div>

<!-- ARTIGO -->
<main class="artigo">

  <div class="texto-duplo fade-in">
    <p>[LEAD — primeiro parágrafo em tom de abertura forte]</p>
    <p>[SEGUNDO PARÁGRAFO]</p>
  </div>

  <div class="fade-in">
    <span class="secao-titulo">[SUBTÍTULO DA PRIMEIRA SEÇÃO]</span>
    <div class="texto-duplo">
      <div><p>[PARÁGRAFO]</p><p>[PARÁGRAFO]</p></div>
      <div><p>[PARÁGRAFO]</p><p>[PARÁGRAFO]</p></div>
    </div>
  </div>

  <div class="citacao-bloco fade-in">
    <blockquote>[PRIMEIRA FRASE DE DESTAQUE]</blockquote>
  </div>

  <div class="fade-in">
    <span class="secao-titulo">[SUBTÍTULO DA SEGUNDA SEÇÃO]</span>
    <div class="texto-duplo">
      <div><p>[PARÁGRAFO]</p></div>
      <div><p>[PARÁGRAFO]</p></div>
    </div>
  </div>

  <!-- Continue com mais blocos conforme necessário -->

</main>

${d.ctas.length ? `<section class="cta-section">
  <div class="cta-inner">
    <div class="cta-texto">
      <h3>[CHAMADA PARA AÇÃO — ${d.empresa || d.profissional}]</h3>
      <p>[SUBTEXTO DO CTA]</p>
    </div>
    <div class="cta-botoes">
      [GERE UM &lt;a class="cta-btn cta-btn--TIPO" href="LINK" target="_blank" rel="noopener"&gt;TEXTO&lt;/a&gt; POR CTA INFORMADO]
    </div>
  </div>
</section>` : ''}

<section class="nav-edicao">
  <a class="nav-edicao-btn" href="/edicao-02/">
    &larr; Voltar à Edição 2
  </a>
</section>

<script>
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));
  setTimeout(() => { const h = document.querySelector('.hero-texto'); if (h) h.classList.add('visible'); }, 100);
  setTimeout(() => { const d = document.querySelector('.divisor'); if (d) d.classList.add('animado'); }, 300);
  const obsTitulo = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('animado'); obsTitulo.unobserve(e.target); } });
  }, { threshold: 0.8 });
  document.querySelectorAll('.secao-titulo').forEach(el => obsTitulo.observe(el));
  const obsCitacao = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obsCitacao.unobserve(e.target); } });
  }, { threshold: 0.15 });
  document.querySelectorAll('.citacao-bloco').forEach(el => obsCitacao.observe(el));
  const heroImg = document.querySelector('.hero-foto img');
  if (heroImg) {
    window.addEventListener('scroll', () => {
      heroImg.style.transform = 'translateY(' + (window.pageYOffset * 0.25) + 'px)';
    }, { passive: true });
  }
</script>
</body>
</html>
\`\`\`

═══ REGRAS FINAIS ═══
- Use EXATAMENTE as classes CSS do template — não invente classes novas nem adicione <style> extra
- nav.js e footer.js (no <head>) injetam navbar e footer — NÃO os recrie manualmente no body
- Distribua o texto base em múltiplos blocos .texto-duplo ou .texto-triplo
- Cada subtítulo vira um .secao-titulo antes de um bloco .texto-duplo
- Intercale .citacao-bloco com as frases de destaque ao longo do artigo
- PRESERVE toda formatação HTML do texto base (b, i, u, ul, ol, li, h2, h3 etc.)
- NÃO reescreva nem resuma o texto base — apenas organize em blocos
- No hero-titulo, quebre em 2-3 linhas com <br> e use <span style="color:var(--vermelho);"> para destaque

Retorne APENAS o HTML completo entre \`\`\`html e \`\`\`. Nada mais.`;
}

// ── STATUS / LOG ──────────────────────────────
function mostrarStatus() {
  document.getElementById('card-status').style.display = 'block';
  document.getElementById('log-container').innerHTML = '';
  document.getElementById('card-preview').style.display = 'none';
}

function addLog(msg, tipo) {
  const div = document.createElement('div');
  div.className = `log-item ${tipo}`;
  div.innerHTML = `<span class="log-dot"></span><span>${msg}</span>`;
  document.getElementById('log-container').appendChild(div);
}

function mostrarPreview(html) {
  document.getElementById('card-preview').style.display = 'block';
  document.getElementById('html-gerado').value = html;
}

function copiarHTML() {
  navigator.clipboard.writeText(document.getElementById('html-gerado').value).then(() => {
    const btn = event.target.closest('button');
    const orig = btn.textContent;
    btn.textContent = '✓ Copiado!';
    setTimeout(() => btn.textContent = orig, 1500);
  });
}

// ── PUBLICAR NO GITHUB ────────────────────────
async function publicar() {
  const token = val('f-github-token');
  if (!token) { alert('Informe o Token GitHub.'); return; }

  const slug = val('f-slug');
  const html = document.getElementById('html-gerado').value;
  if (!slug || !html) { alert('Gere a matéria antes de publicar.'); return; }

  const caminho = `edicao-02/${slug}/index.html`;
  addLog('Publicando no GitHub...', 'loading');

  try {
    let sha;
    const check = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${caminho}`, {
      headers: { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github.v3+json' }
    });
    if (check.ok) sha = (await check.json()).sha;

    const res = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${caminho}`, {
      method: 'PUT',
      headers: { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github.v3+json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `feat: matéria ${slug} — Edição 02`,
        content: btoa(unescape(encodeURIComponent(html))),
        ...(sha ? { sha } : {}),
      }),
    });

    if (!res.ok) throw new Error((await res.json().catch(()=>({}))).message || `HTTP ${res.status}`);

    addLog('✓ Publicado! Deploy em ~30 segundos.', 'ok');
    addLog(`🔗 bnibusiness.com.br/edicao-02/${slug}/`, 'ok');
    marcarPublicada(slug);
  } catch (e) {
    addLog('Erro: ' + e.message, 'erro');
  }
}

// ── CHECKLIST ─────────────────────────────────
function renderChecklist() {
  const statusSalvo = JSON.parse(localStorage.getItem('bni-status') || '{}');
  const tbody = document.getElementById('checklist-body');
  tbody.innerHTML = '';
  let publicadas = 0;

  MATERIAS.forEach(m => {
    const status = statusSalvo[m.slug] || m.status;
    if (status === 'publicada') publicadas++;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="num-col">${m.num}</td>
      <td class="secao-col">${m.secao}</td>
      <td>${m.titulo}</td>
      <td class="slug-col">${m.slug}</td>
      <td><span class="badge-status badge-${status}"><span class="badge-dot"></span>${status === 'publicada' ? 'No ar' : 'Pendente'}</span></td>`;
    tbody.appendChild(tr);
  });

  const pct = Math.round((publicadas / MATERIAS.length) * 100);
  document.getElementById('progress-bar').style.width = pct + '%';
  document.getElementById('progress-texto').textContent = `${publicadas} / ${MATERIAS.length} publicadas`;
}

function marcarPublicada(slug) {
  const s = JSON.parse(localStorage.getItem('bni-status') || '{}');
  s[slug] = 'publicada';
  localStorage.setItem('bni-status', JSON.stringify(s));
  renderChecklist();
}

// ── EXPOSIÇÃO GLOBAL (chamadas via onclick no HTML) ───
window.onSecaoChange  = onSecaoChange;
window.onTituloInput  = onTituloInput;
window.adicionarFrase = adicionarFrase;
window.removerFrase   = removerFrase;
window.adicionarCTA   = adicionarCTA;
window.removerCTA     = removerCTA;
window.fazerLogin     = fazerLogin;
window.sair           = sair;
window.mostrarAba     = mostrarAba;
window.gerarMateria   = gerarMateria;
window.limparForm     = limparForm;
window.copiarHTML     = copiarHTML;
window.publicar       = publicar;
