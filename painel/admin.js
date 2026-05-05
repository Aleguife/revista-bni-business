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
      toolbar: {
        container: [
          ['bold', 'italic', 'underline'],
          [{ header: 2 }, { header: 3 }, 'blockquote'],
          ['imagem'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['clean'],
        ],
        handlers: {
          imagem: function () {
            const range = quill.getSelection(true);
            const placeholder = '[IMG: img/nome-da-imagem.webp]';
            quill.insertText(range.index, placeholder, 'user');
            quill.setSelection(range.index + placeholder.length);
          },
        },
      },
      clipboard: { matchVisual: false },
    },
    placeholder: 'Cole aqui o texto completo. Bold, italic, listas e subtítulos são preservados automaticamente ao colar do InDesign ou Word.',
  });

  // Estiliza botão customizado 📷
  const btnImg = document.querySelector('.ql-imagem');
  if (btnImg) { btnImg.textContent = '📷'; btnImg.title = 'Inserir imagem [IMG: arquivo.webp]'; }

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

  // Auto-save nos campos dinâmicos (CTAs) via event delegation
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

// ── MONTAR CORPO DO ARTIGO (sem IA) ──────────────────────────
// Pega o HTML do Quill, distribui em blocos .texto-duplo.fade-in
// e insere .citacao-bloco.fade-in nas posições corretas.
// legendas: { 'img/arquivo.webp': 'caption text', ... }
function montarCorpoArtigo(d, legendas) {
  legendas = legendas || {};
  const tmp = document.createElement('div');
  tmp.innerHTML = d.texto || '';

  // Tokens em ordem do documento
  const tokens = [];
  Array.from(tmp.children).forEach(el => {
    const tag = el.tagName ? el.tagName.toLowerCase() : '';
    if (!tag) return;
    const text = el.textContent.trim();
    // Detecta marcador [IMG: arquivo.webp]
    const imgMatch = text.match(/^\[IMG:\s*([^\]]+)\]$/);
    if (imgMatch) {
      tokens.push({ tag: 'img-placeholder', file: imgMatch[1].trim() });
      return;
    }
    if ((tag === 'p' || tag === 'ul' || tag === 'ol') && !text) return;
    tokens.push({ tag, html: el.outerHTML, inner: el.innerHTML });
  });

  // Elementos estruturais que quebram o fluxo de colunas
  const isStructural = tag => tag === 'h2' || tag === 'h3' || tag === 'blockquote' || tag === 'img-placeholder';

  const output = [];

  let i = 0;
  while (i < tokens.length) {
    const t = tokens[i];

    if (t.tag === 'img-placeholder') {
      // [IMG: arquivo.webp] → <figure class="foto-larga fade-in">
      const file = t.file;
      const caption = legendas[file] || '';
      const src = '/edicao-02/' + (d.slug || 'materia') + '/' + file;
      let fig = '<figure class="foto-larga fade-in">\n  <img src="' + src + '" alt="' + caption + '" loading="lazy">\n';
      if (caption) fig += '  <figcaption>' + caption + '</figcaption>\n';
      fig += '</figure>';
      output.push(fig);
      i++;

    } else if (t.tag === 'blockquote') {
      // Blockquote do Quill → .citacao-bloco diretamente (não conta como parágrafo)
      output.push('<div class="citacao-bloco fade-in"><blockquote>' + t.inner + '</blockquote></div>');
      i++;

    } else if (t.tag === 'h2' || t.tag === 'h3') {
      // H2 → .secao-titulo | H3 → .secao-subtitulo
      const cls = t.tag === 'h2' ? 'secao-titulo' : 'secao-subtitulo';
      const section = [];
      i++;
      while (i < tokens.length && !isStructural(tokens[i].tag)) {
        section.push(tokens[i]);
        i++;
      }
      let html = '<div class="fade-in"><span class="' + cls + '">' + t.inner + '</span>';
      for (let j = 0; j < section.length; j += 2) {
        html += '<div class="texto-duplo"><div>' + section[j].html + '</div><div>' + (section[j + 1] ? section[j + 1].html : '') + '</div></div>';
      }
      html += '</div>';
      output.push(html);

    } else {
      // Parágrafo/lista — pareia com o próximo elemento não-estrutural
      const next = (i + 1 < tokens.length && !isStructural(tokens[i + 1].tag))
        ? tokens[i + 1] : null;
      output.push('<div class="texto-duplo fade-in"><div>' + t.html + '</div><div>' + (next ? next.html : '') + '</div></div>');
      i += next ? 2 : 1;
    }
  }

  return output.join('\n');
}

// ── MONTAR SEÇÃO DE CTAs (sem IA) ────────────────────────────
function montarCTASection(d) {
  if (!d.ctas.length) return '';
  const tipoParaClasse = t => t.toLowerCase().replace('e-mail', 'email').replace(/[^a-z]/g, '');
  const icones = {
    whatsapp:  '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>',
    site:      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
    instagram: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg>',
    linkedin:  '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>',
    email:     '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/></svg>',
    youtube:   '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58a2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/></svg>',
    outro:     '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>',
  };
  const botoes = d.ctas.map(c => {
    const cls = tipoParaClasse(c.tipo);
    return '      <a class="cta-btn cta-btn--' + cls + '" href="' + c.link + '" target="_blank" rel="noopener">' + (icones[cls] || icones.outro) + ' ' + (c.texto || c.tipo) + '</a>';
  }).join('\n');
  return '<section class="cta-section">\n  <div class="cta-inner">\n    <div class="cta-texto">\n      <h3>' + (d.empresa || d.profissional || 'Entre em contato') + '</h3>\n    </div>\n    <div class="cta-botoes">\n' + botoes + '\n    </div>\n  </div>\n</section>';
}

// ── TEMPLATE BASE FIXO ────────────────────────────────────────
// Navbar, hero, CSS, JS, nav-edicao e footer são SEMPRE iguais.
// A IA gera APENAS: descrição SEO, titulo formatado, legenda da foto.
// Artigo e CTAs são montados diretamente pelo JS.
function montarTemplate(d, parts) {
  const dataFormatada = d.data
    ? new Date(d.data + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
    : '';
  const dataISO   = d.data || '';
  const slug      = d.slug || 'materia';

  const seoDesc    = (parts.seo     || '').replace(/"/g, '&quot;').trim();
  const heroTitulo = (parts.titulo  || d.titulo).trim();
  const caption    = (parts.caption || '').trim();

  // Artigo e CTAs montados em JS — sem IA
  const artigo  = montarCorpoArtigo(d, parts.legendas || {});
  const ctaHtml = montarCTASection(d);

  const autorMeta  = d.autor   ? '\n<meta name="author" content="' + d.autor + '">' : '';
  const dataMeta   = dataISO   ? '\n<meta property="article:published_time" content="' + dataISO + '">' : '';
  const dataHtml   = dataFormatada ? '<span class="bl-data">' + dataFormatada + '</span>' : '';
  const bylineHtml = d.autor   ? '<div class="hero-assina">Por <span>' + d.autor + '</span></div>' : '';
  const captionHtml = caption  ? ' — ' + caption : '';
  const olhoHtml   = d.olho    ? d.olho : '';

  return `<!DOCTYPE html>
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
<meta name="description" content="${seoDesc}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Revista BNI Business">
<meta property="og:title" content="${d.titulo} | BNI Business">
<meta property="og:description" content="${seoDesc}">
<meta property="og:image" content="https://bnibusiness.com.br/edicao-02/${slug}/img/og-cover.webp">
<meta property="og:url" content="https://bnibusiness.com.br/edicao-02/${slug}">
<meta property="og:locale" content="pt_BR">
<meta name="robots" content="index, follow, max-image-preview:large">${autorMeta}
<meta property="article:section" content="${d.secao}">${dataMeta}
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${d.titulo} | BNI Business">
<meta name="twitter:description" content="${seoDesc}">
<meta name="twitter:image" content="https://bnibusiness.com.br/edicao-02/${slug}/img/og-cover.webp">
<link rel="sitemap" type="application/xml" title="Sitemap" href="https://bnibusiness.com.br/sitemap.xml">
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
  .hero { display: grid; grid-template-columns: 1fr 1fr; min-height: 90vh; background: var(--creme); }
  .hero-foto { position: relative; overflow: hidden; background: #2a2a2a; }
  .hero-foto img { width: 100%; height: 110%; object-fit: cover; object-position: center top; display: block; filter: grayscale(8%); will-change: transform; }
  .hero-foto-caption { position: absolute; bottom: 5rem; right: 2rem; text-align: right; }
  .hero-foto-caption p { font-family: 'Barlow Condensed', sans-serif; font-size: 14px; color: var(--branco); line-height: 1.5; background: rgba(26,26,26,0.75); padding: 10px 14px; display: inline-block; max-width: 250px; }
  .hero-foto-caption strong { display: block; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
  .hero-texto { padding: 4rem 4rem 4rem 5rem; display: flex; flex-direction: column; justify-content: center; background: var(--creme); }
  .hero-byline { font-family: 'Barlow Condensed', sans-serif; font-size: 14px; letter-spacing: 2px; color: var(--cinza); text-transform: uppercase; margin-bottom: 2rem; display: flex; flex-direction: column; gap: 4px; }
  .hero-byline .bl-secao { color: var(--vermelho); font-weight: 600; display: flex; align-items: center; gap: 6px; }
  .hero-byline .bl-secao::before { content: '\\u25E4'; font-size: 11px; }
  .hero-titulo { font-family: 'Playfair Display', serif; font-size: clamp(2.5rem, 4vw, 4.5rem); font-weight: 900; line-height: 1.05; color: var(--preto); margin-bottom: 2rem; letter-spacing: -0.5px; }
  .hero-chapeu { font-family: 'Barlow', sans-serif; font-size: 1.2rem; line-height: 1.5; color: #333; border-left: 3px solid var(--vermelho); padding-left: 1.5rem; margin-bottom: 2.5rem; }
  .hero-assina { font-family: 'Barlow Condensed', sans-serif; font-size: 12px; letter-spacing: 1.5px; color: var(--cinza); text-transform: uppercase; }
  .hero-assina span { color: var(--preto); font-weight: 600; }
  .divisor { height: 3px; background: linear-gradient(90deg, var(--vermelho) 0%, var(--vermelho) 40%, var(--creme-escuro) 40%); transform: scaleX(0); transform-origin: left; transition: transform 0.8s cubic-bezier(0.4,0,0.2,1); }
  .divisor.animado { transform: scaleX(1); }
  .artigo { max-width: 1100px; margin: 0 auto; padding: 4rem; }
  .artigo > div { margin-top: 3.5rem; }
  .artigo > div:first-child { margin-top: 0; }
  .texto-duplo { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; }
  .texto-duplo p { font-family: 'Barlow', sans-serif; font-size: 1.125rem; font-weight: 300; line-height: 1.7; color: #2a2a2a; text-indent: 1.5em; }
  .texto-duplo ul, .texto-duplo ol { font-family: 'Barlow', sans-serif; font-size: 1.125rem; font-weight: 300; line-height: 1.7; color: #2a2a2a; padding-left: 1.5em; }
  .texto-triplo { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 2.5rem; }
  .texto-triplo p { font-family: 'Barlow', sans-serif; font-size: 1.125rem; font-weight: 300; line-height: 1.7; color: #2a2a2a; text-indent: 1.5em; }
  .secao-titulo { font-family: 'Barlow Condensed', sans-serif; font-size: 18px; font-weight: 600; letter-spacing: 2.5px; text-transform: uppercase; color: var(--vermelho); margin-bottom: 1.5rem; padding-bottom: 0.4rem; display: block; position: relative; }
  .secao-titulo::after { content: ''; position: absolute; bottom: 0; left: 0; height: 2px; width: 0; background: var(--vermelho); transition: width 0.6s cubic-bezier(0.4,0,0.2,1); }
  .secao-titulo.animado::after { width: 100%; }
  .secao-subtitulo { font-family: 'Barlow Condensed', sans-serif; font-size: 14px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: var(--preto); margin-bottom: 1rem; display: block; }
  .citacao-bloco { background: var(--vermelho); padding: 3.5rem 4rem; position: relative; opacity: 0; transform: translateX(-30px); transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.4,0,0.2,1); }
  .citacao-bloco.visible { opacity: 1; transform: translateX(0); }
  .citacao-bloco blockquote { font-family: 'Playfair Display', serif; font-size: clamp(1.3rem,2.5vw,1.8rem); font-style: italic; color: var(--branco); line-height: 1.5; font-weight: 400; padding-left: 5rem; position: relative; }
  .citacao-bloco blockquote::before { content: '\\201C'; font-family: 'Playfair Display', serif; font-size: 9rem; font-style: normal; color: rgba(255,255,255,0.25); position: absolute; left: -0.5rem; top: -1.5rem; line-height: 1; }
  .citacao-lateral { border-left: 4px solid var(--vermelho); padding: 1rem 1.5rem; float: right; width: 45%; margin-left: 2.5rem; margin-bottom: 1rem; }
  .citacao-lateral p { font-family: 'Playfair Display', serif; font-size: 1.15rem; font-style: italic; color: var(--preto); line-height: 1.5; text-indent: 0 !important; }
  .foto-larga { margin: 3rem 0 1rem; }
  .foto-larga img { width: 100%; height: auto; display: block; }
  .foto-larga figcaption { font-family: 'Barlow Condensed', sans-serif; font-size: 14px; color: #2a2a2a; margin-top: 0.5rem; line-height: 1.5; }
  .clearfix::after { content: ''; display: block; clear: both; height: 0; }
  .fade-in { opacity: 0; transform: translateY(24px); transition: opacity 0.7s ease, transform 0.7s ease; overflow: hidden; }
  .fade-in.visible { opacity: 1; transform: translateY(0); }
  .cta-section { background: var(--creme-escuro); }
  .cta-inner { max-width: 1100px; margin: 0 auto; padding: 4rem; display: flex; align-items: center; justify-content: space-between; gap: 2rem; flex-wrap: wrap; }
  .cta-texto h3 { font-family: 'Playfair Display', serif; font-size: clamp(1.4rem,2.5vw,2rem); font-weight: 700; color: var(--preto); margin-bottom: 0.5rem; line-height: 1.2; }
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
  .nav-edicao { display: flex; align-items: center; justify-content: center; gap: 1.5rem; padding: 4rem; background: var(--branco); border-top: 1px solid var(--creme-escuro); }
  .nav-edicao-btn { display: inline-flex; align-items: center; gap: 0.8rem; padding: 1rem 2rem; font-family: 'Barlow Condensed', sans-serif; font-size: 13px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; text-decoration: none; border: 2px solid var(--vermelho); color: var(--vermelho); background: transparent; transition: background 0.2s, color 0.2s; }
  .nav-edicao-btn:hover { background: var(--vermelho); color: var(--branco); }
  .footer-nav-link { font-family: 'Barlow Condensed', sans-serif; font-size: 16px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #fff; text-decoration: none; padding: 1rem 1rem; text-align: center; display: block; transition: background 0.2s, color 0.2s; }
  .footer-nav-link:hover { background: rgba(255,255,255,0.12); color: #fff; }
  .footer-bar { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 0.5rem; padding: 0.75rem 2rem; border-top: 1px solid rgba(255,255,255,0.15); background: var(--vermelho); }
  .footer-bar-copy { font-family: 'Barlow Condensed', sans-serif; font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: rgba(255,255,255,0.7); white-space: nowrap; }
  .footer-bar-link { font-family: 'Barlow Condensed', sans-serif; font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: rgba(255,255,255,0.7); text-decoration: none; transition: color 0.2s; }
  .footer-bar-link:hover { color: var(--branco); }
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
    .hero-foto-caption { bottom: 6rem; }
  }
</style>
</head>
<body>

<section class="hero">
  <div class="hero-foto">
    <img src="${d.imagemUrl}" alt="${d.imagemAlt || d.titulo}" loading="eager" fetchpriority="high" />
    <div class="hero-foto-caption">
      <p><strong>${d.profissional || d.empresa}</strong>${captionHtml}</p>
    </div>
  </div>
  <div class="hero-texto fade-in">
    <div class="hero-byline">
      <span class="bl-secao">${d.secao}</span>
      ${dataHtml}
    </div>
    <h1 class="hero-titulo">${heroTitulo}</h1>
    <p class="hero-chapeu">${olhoHtml}</p>
    ${bylineHtml}
  </div>
</section>

<div class="divisor"></div>

<main class="artigo">
${artigo}
</main>

${ctaHtml}

<section class="nav-edicao">
  <a class="nav-edicao-btn" href="/edicao-02/">&larr; Voltar à Edição 2</a>
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
  document.querySelectorAll('.secao-titulo, .secao-subtitulo').forEach(el => obsTitulo.observe(el));
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
</html>`;
}

// ── API CLAUDE ─────────────────────────────────
function parseAIResponse(text) {
  const sections = ['SEO', 'TITULO', 'CAPTION'];
  const parts = {};
  sections.forEach((sec, i) => {
    const marker = '==' + sec + '==';
    const idx = text.indexOf(marker);
    if (idx === -1) { parts[sec.toLowerCase()] = ''; return; }
    const contentStart = idx + marker.length;
    let end = text.length;
    for (let j = i + 1; j < sections.length; j++) {
      const nextIdx = text.indexOf('==' + sections[j] + '==', contentStart);
      if (nextIdx !== -1 && nextIdx < end) end = nextIdx;
    }
    parts[sec.toLowerCase()] = text.slice(contentStart, end).trim();
  });

  // Extrai ==LEGENDA:arquivo.webp== texto ==FIM==
  const legendas = {};
  const legendaRe = /==LEGENDA:([^=\n]+)==([\s\S]*?)==FIM==/g;
  let m;
  while ((m = legendaRe.exec(text)) !== null) {
    legendas[m[1].trim()] = m[2].trim();
  }
  parts.legendas = legendas;

  return parts;
}

async function chamarClaudeAPI(apiKey, dados) {
  const response = await fetch('/painel/proxy.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5',
      max_tokens: 1500,
      messages: [{ role: 'user', content: montarPrompt(dados) }],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `HTTP ${response.status}`);
  }

  const data = await response.json();
  const texto = data.content?.find(c => c.type === 'text')?.text || '';
  const parts = parseAIResponse(texto);
  return montarTemplate(dados, parts);
}

function montarPrompt(d) {
  const dataFormatada = d.data
    ? new Date(d.data + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
    : '';

  // Detecta imagens no texto ([IMG: arquivo.webp])
  const textoPlano = (d.texto || '').replace(/<[^>]+>/g, ' ');
  const imgMatches = [...textoPlano.matchAll(/\[IMG:\s*([^\]]+)\]/g)].map(m => m[1].trim());
  const uniqueImgs = [...new Set(imgMatches)];

  let legendaBloco = '';
  if (uniqueImgs.length > 0) {
    legendaBloco = '\n\nO texto contem ' + uniqueImgs.length + ' imagem(ns) marcada(s). Para cada uma, gere uma legenda adequada ao contexto da materia (1 linha, sem ponto final), usando o formato:\n\n' +
      uniqueImgs.map(f => '==LEGENDA:' + f + '==\n[legenda]\n==FIM==').join('\n\n');
  }

  return `Voce e o assistente SEO da Revista BNI Business.
O sistema ja monta automaticamente o HTML completo da materia.
Sua unica funcao: fornecer 3 textos curtos para SEO e apresentacao visual.

=== DADOS DA MATERIA ===
Titulo: ${d.titulo}
Profissional: ${d.profissional || ''}
Empresa: ${d.empresa || ''}
Secao: ${d.secao}
Data: ${dataFormatada}

=== PRIMEIROS PARAGRAFOS DO TEXTO (para contexto) ===
${textoPlano.replace(/\s+/g, ' ').trim().slice(0, 600)}...

=== RETORNE EXATAMENTE NESTE FORMATO ===${legendaBloco}

==SEO==
[descricao de ate 150 caracteres para meta description e og:description — baseada no titulo e texto]

==TITULO==
[titulo "${d.titulo}" formatado com <br> para 2-3 linhas e <span style="color:#C8102E;"> em 1-2 palavras-chave — nao altere as palavras]

==CAPTION==
[cargo ou descricao breve de ${d.profissional || d.empresa} para legenda da foto — 1 linha, sem ponto final]`;
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
window.adicionarCTA   = adicionarCTA;
window.removerCTA     = removerCTA;
window.fazerLogin     = fazerLogin;
window.sair           = sair;
window.mostrarAba     = mostrarAba;
window.gerarMateria   = gerarMateria;
window.limparForm     = limparForm;
window.copiarHTML     = copiarHTML;
window.publicar       = publicar;
