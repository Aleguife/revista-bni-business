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
// Regra de distribuição: para qualquer grupo de N parágrafos
// consecutivos, os primeiros ceil(N/2) vão na coluna ESQUERDA e
// os restantes floor(N/2) vão na coluna DIREITA — um único
// .texto-duplo por grupo, leitura top-down por coluna.
//
// Elementos estruturais (h2, h3, blockquote, [IMG:]) ficam em
// largura total e reiniciam um novo grupo.
// legendas: { 'img/arquivo.webp': 'caption text', ... }
function montarCorpoArtigo(d, legendas) {
  legendas = legendas || {};
  var tmp = document.createElement('div');
  tmp.innerHTML = d.texto || '';

  // ── DEBUG — remover após diagnóstico ───────────────────────
  console.log('=== DEBUG QUILL OUTPUT ===');
  console.log('Tipo:', typeof d.texto);
  console.log('Conteúdo bruto:', d.texto);
  console.log('=== FIM DEBUG ===');

  // ── Tokenização ────────────────────────────────────────────
  // Cada filho direto do Quill vira um token com type explícito:
  //   'h2' | 'h3' | 'quote' | 'img' | 'para'

  // O Quill insere <p>&nbsp;</p> e <p><br></p> entre elementos.
  // textContent.trim() NÃO remove \u00a0 (non-breaking space),
  // fazendo esses parágrafos vazios serem tratados como reais.
  function ehVazio(el) {
    var tag = el.tagName ? el.tagName.toLowerCase() : '';
    if (tag !== 'p') return false;
    var texto = el.textContent.replace(/\u00a0/g, ' ').trim();
    return texto === '' && !el.querySelector('img');
  }

  var tokens = [];
  var children = tmp.children;
  for (var c = 0; c < children.length; c++) {
    var el   = children[c];
    var tag  = el.tagName ? el.tagName.toLowerCase() : '';
    if (!tag) continue;
    if (ehVazio(el)) continue;                           // ← filtra &nbsp; e <br> vazios
    var text = el.textContent.replace(/\u00a0/g, ' ').trim();
    var imgMatch = text.match(/^\[IMG:\s*([^\]]+)\]$/);
    if (imgMatch) {
      tokens.push({ type: 'img', file: imgMatch[1].trim() });
      continue;
    }
    if ((tag === 'p' || tag === 'ul' || tag === 'ol') && !text) continue;
    if      (tag === 'h2')         tokens.push({ type: 'h2',    inner: el.innerHTML });
    else if (tag === 'h3')         tokens.push({ type: 'h3',    inner: el.innerHTML });
    else if (tag === 'blockquote') tokens.push({ type: 'quote', inner: el.innerHTML });
    else                           tokens.push({ type: 'para',  html:  el.outerHTML });
  }

  // ── textoDuplo ─────────────────────────────────────────────
  // Recebe TODOS os parágrafos da seção de uma vez.
  // Esquerda = primeiros ceil(n/2), direita = restantes floor(n/2).
  // Chamada UMA ÚNICA vez por seção — nunca em pares.
  function textoDuplo(paras, extraCls) {
    var n   = paras.length;
    var mid = Math.ceil(n / 2);
    var L = '', R = '';
    for (var k = 0; k < mid; k++) L += paras[k].html;
    for (var k = mid; k < n; k++) R += paras[k].html;
    var cls = 'texto-duplo' + (extraCls ? ' ' + extraCls : '');
    return '<div class="' + cls + '"><div>' + L + '</div><div>' + R + '</div></div>';
  }

  function imgHtml(tk) {
    var cap = legendas[tk.file] || '';
    var src = '/edicao-02/' + (d.slug || 'materia') + '/' + tk.file;
    return '<figure class="foto-larga fade-in"><img src="' + src +
           '" alt="' + cap + '" loading="lazy">' +
           (cap ? '<figcaption>' + cap + '</figcaption>' : '') + '</figure>';
  }

  // Predicado: inicia nova seção (interrompe coleta de parágrafos)
  function isBreak(type) {
    return type === 'h2' || type === 'h3' || type === 'img';
  }

  // ── Loop principal ──────────────────────────────────────────
  var out = [];
  var i   = 0;
  var n   = tokens.length;

  while (i < n) {
    var tk = tokens[i];

    // — Imagem standalone —
    if (tk.type === 'img') {
      out.push(imgHtml(tk));
      i++;
      continue;
    }

    // — Citação avulsa (antes do primeiro subtítulo) —
    if (tk.type === 'quote') {
      out.push('<div class="citacao-bloco fade-in"><blockquote>' + tk.inner + '</blockquote></div>');
      i++;
      continue;
    }

    // — Subtítulo h2 / h3 —
    // Processa tokens da seção em ordem, mantendo citações inline.
    // A cada blockquote: flush dos paras acumulados como texto-duplo,
    // emite a citação, continua coletando. Preserva o filtro ehVazio.
    if (tk.type === 'h2' || tk.type === 'h3') {
      var spanCls = tk.type === 'h2' ? 'secao-titulo' : 'secao-subtitulo';
      i++;
      var block = '<div class="fade-in"><span class="' + spanCls + '">' + tk.inner + '</span>';
      var currentParas = [];
      while (i < n && !isBreak(tokens[i].type)) {
        var cur = tokens[i];
        if (cur.type === 'quote') {
          if (currentParas.length > 0) {
            block += textoDuplo(currentParas, '');
            currentParas = [];
          }
          block += '<div class="citacao-bloco"><blockquote>' + cur.inner + '</blockquote></div>';
        } else {
          currentParas.push(cur);
        }
        i++;
      }
      if (currentParas.length > 0) { block += textoDuplo(currentParas, ''); }
      block += '</div>';
      out.push(block);
      continue;
    }

    // — Parágrafos de introdução (antes do primeiro subtítulo) —
    // Mesma lógica inline: flush ao encontrar cada citação.
    var currentParas = [];
    while (i < n && !isBreak(tokens[i].type)) {
      var cur = tokens[i];
      if (cur.type === 'quote') {
        if (currentParas.length > 0) {
          out.push(textoDuplo(currentParas, 'fade-in'));
          currentParas = [];
        }
        out.push('<div class="citacao-bloco fade-in"><blockquote>' + cur.inner + '</blockquote></div>');
      } else {
        currentParas.push(cur);
      }
      i++;
    }
    if (currentParas.length > 0) { out.push(textoDuplo(currentParas, 'fade-in')); }
  }

  return out.join('\n');
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
// HTML literal extraído da matéria-de-capa — impossível quebrar.
// montarTemplate() apenas substitui os marcadores %%MARKER%%.
const TEMPLATE_BASE = `<!DOCTYPE html>
<html lang="pt-BR" data-lang="PT">
<head>
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-KX2T4K1YJG"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-KX2T4K1YJG');
</script>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>%%TITULO_SEO%% — BNI Business</title>
<meta name="description" content="%%SEO_DESC%%">

<!-- Open Graph -->
<meta property="og:type" content="article">
<meta property="og:site_name" content="Revista BNI Business">
<meta property="og:title" content="%%TITULO_SEO%% | BNI">
<meta property="og:description" content="%%SEO_DESC%%">
<meta property="og:image" content="https://bnibusiness.com.br/edicao-02/%%SLUG%%/img/og-cover.webp">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:url" content="https://bnibusiness.com.br/edicao-02/%%SLUG%%">
<meta property="og:locale" content="pt_BR">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="author" content="%%AUTOR%%">
<meta property="article:section" content="%%SECAO%%">
<meta property="article:tag" content="engenharia">
<meta property="article:tag" content="licitações">
<meta property="article:tag" content="BNI">
<meta property="article:author" content="%%AUTOR%%">
<meta property="article:published_time" content="%%DATA_ISO%%">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="%%TITULO_SEO%% | BNI">
<meta name="twitter:description" content="%%SEO_DESC%%">
<meta name="twitter:image" content="https://bnibusiness.com.br/edicao-02/%%SLUG%%/img/og-cover.webp">
<link rel="sitemap" type="application/xml" title="Sitemap" href="https://bnibusiness.com.br/sitemap.xml">
<link rel="canonical" href="https://bnibusiness.com.br/edicao-02/%%SLUG%%/">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Barlow+Condensed:wght@300;400;500;600&family=Barlow:wght@300;400;500&display=swap" rel="stylesheet">
<style>

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --vermelho: #C8102E;
    --preto: #1a1a1a;
    --creme: #F5F0E8;
    --creme-escuro: #EAE3D5;
    --cinza: #888;
    --cinza-claro: #f9f6f0;
    --branco: #fff;
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--creme);
    color: var(--preto);
    font-family: 'Barlow', sans-serif;
    font-weight: 400;
    line-height: 1.7;
    overflow-x: hidden;
  }

  /* ── HERO ABERTURA ── */
  .hero {
    display: grid;
    grid-template-columns: 1fr 1fr;
    min-height: 90vh;
    background: var(--creme);
  }

  .hero-foto {
    position: relative;
    overflow: hidden;
    background: #2a2a2a;
  }
  .hero-foto img {
    width: 100%;
    height: 110%;
    object-fit: cover;
    object-position: center top;
    display: block;
    filter: grayscale(8%);
    will-change: transform;
  }
  .hero-foto-caption {
    position: absolute;
    bottom: 5rem;
    right: 2rem;
    text-align: right;
  }
  .hero-foto-caption p {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 14px;
    color: var(--branco);
    line-height: 1.5;
    background: rgba(26,26,26,0.75);
    padding: 10px 14px;
    display: inline-block;
    max-width: 250px;
  }
  .hero-foto-caption strong { display: block; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }

  .hero-texto {
    padding: 4rem 4rem 4rem 5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background: var(--creme);
  }
  .hero-byline {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 14px;
    letter-spacing: 2px;
    color: var(--cinza);
    text-transform: uppercase;
    margin-bottom: 2rem;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .hero-byline .bl-secao { color: var(--vermelho); font-weight: 600; display: flex; align-items: center; gap: 6px; }
  .hero-byline .bl-secao::before { content: '◤'; font-size: 11px; }
  .hero-byline .bl-data { color: var(--cinza); }
  .hero-byline .bl-leitura { color: var(--cinza); }

  .hero-titulo {
    font-family: 'Playfair Display', serif;
    font-size: 4.5rem;
    font-weight: 900;
    line-height: 0.7;
    color: var(--preto);
    margin-bottom: calc(2rem + 20px);
    letter-spacing: -0.5px;
  }
  @media (max-width: 900px) {
    .hero-titulo { font-size: 4.05rem; }
  }
  .hero-titulo .destaque { color: var(--vermelho); }

  .hero-chapeu {
    font-family: 'Barlow', sans-serif;
    font-size: 1.5rem;
    font-style: normal;
    line-height: 1.2;
    color: #333;
    border-left: 3px solid var(--vermelho);
    padding-left: 1.5rem;
    margin-bottom: 2.5rem;
  }
  .hero-chapeu strong { font-style: normal; color: var(--vermelho); }

  .hero-assina {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 12px;
    letter-spacing: 1.5px;
    color: var(--cinza);
    text-transform: uppercase;
  }
  .hero-assina span { color: var(--preto); font-weight: 600; }

  /* ── LINHA DIVISÓRIA ── */
  .divisor {
    height: 3px;
    background: linear-gradient(90deg, var(--vermelho) 0%, var(--vermelho) 40%, var(--creme-escuro) 40%);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .divisor.animado {
    transform: scaleX(1);
  }

  /* ── CORPO DO ARTIGO ── */
  .artigo {
    max-width: 1100px;
    margin: 0 auto;
    padding: 4rem 4rem;
  }

  /* ESPAÇAMENTO UNIFORME — todos os filhos diretos do artigo */
  .artigo > div {
    margin-top: 3.5rem;
  }
  .artigo > div:first-child {
    margin-top: 0;
  }

  /* TEXTO EM COLUNAS */
  .texto-duplo {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    margin-top: 0;
    margin-bottom: 0;
  }
  /* só aplica espaço após o secao-titulo dentro do bloco */
  .secao-titulo + .texto-duplo,
  .secao-titulo + figure + .texto-duplo {
    margin-top: 1.5rem;
  }
  .texto-duplo p {
    font-family: 'Barlow', sans-serif;
    font-size: 1.125rem;
    font-weight: 300;
    line-height: 1.7;
    color: #2a2a2a;
    text-indent: 1.5em;
  }

  /* TEXTO 3 COLUNAS */
  .texto-triplo {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 2.5rem;
    margin-top: 1.5rem;
  }
  .texto-triplo p {
    font-family: 'Barlow', sans-serif;
    font-size: 1.125rem;
    font-weight: 300;
    line-height: 1.7;
    color: #2a2a2a;
    text-indent: 1.5em;
  }

  /* SUBTÍTULOS DE SEÇÃO */
  .secao-titulo {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 18px;
    font-weight: 600;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: var(--vermelho);
    margin-bottom: 1.5rem;
    padding-bottom: 0.4rem;
    display: block;
    position: relative;
  }
  .secao-titulo::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    height: 2px;
    width: 0;
    background: var(--vermelho);
    transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .secao-titulo.animado::after {
    width: 100%;
  }

  /* CITAÇÃO EM DESTAQUE */
  .citacao-bloco {
    background: var(--vermelho);
    padding: 3.5rem 4rem;
    margin: 0;
    position: relative;
    opacity: 0;
    transform: translateX(-30px);
    transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .citacao-bloco.visible {
    opacity: 1;
    transform: translateX(0);
  }
  .citacao-bloco {
    position: relative;
  }
  .citacao-bloco blockquote {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.3rem, 2.5vw, 1.8rem);
    font-style: italic;
    color: var(--branco);
    line-height: 1.5;
    font-weight: 400;
    padding-left: 5rem;
    position: relative;
  }
  .citacao-bloco blockquote::before {
    content: '\\201C';
    font-family: 'Playfair Display', serif;
    font-size: 9rem;
    font-style: normal;
    color: rgba(255,255,255,0.25);
    position: absolute;
    left: -0.5rem;
    top: -1.5rem;
    line-height: 1;
  }

  /* ESPAÇAMENTO ENTRE SUB-BLOCOS DENTRO DE UMA SEÇÃO */
  .fade-in > .citacao-bloco,
  .fade-in > .texto-duplo + .citacao-bloco,
  .fade-in > .citacao-bloco + .texto-duplo {
    margin-top: 3rem;
  }

  /* CITAÇÃO LATERAL (sidebar) */
  .citacao-lateral {
    border-left: 4px solid var(--vermelho);
    padding: 1rem 1.5rem;
    margin: 0;
    float: right;
    width: 45%;
    margin-left: 2.5rem;
    margin-bottom: 1rem;
  }
  .citacao-lateral p {
    font-family: 'Playfair Display', serif;
    font-size: 1.15rem;
    font-style: italic;
    color: var(--preto);
    line-height: 1.5;
    text-indent: 0 !important;
  }

  /* FOTOS DA CHINA */
  .fotos-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin: 3rem 0;
  }
  .fotos-grid img {
    width: 100%;
    aspect-ratio: 4/3;
    object-fit: cover;
    display: block;
  }
  .foto-legenda {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 14px;
    color: #2a2a2a;
    letter-spacing: 0.5px;
    margin-top: 0.5rem;
    grid-column: 1 / -1;
    line-height: 1.5;
  }

  /* FOTO LARGA */
  .foto-larga {
    margin: 3rem 0 1rem;
  }
  .foto-larga img {
    width: 100%;
    height: auto;
    display: block;
  }
  .foto-larga figcaption {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 14px;
    color: #2a2a2a;
    margin-top: 0.5rem;
    line-height: 1.5;
  }

  /* SEPARADOR DE SEÇÃO */

  /* CARD FINAL (perfil) */
  .card-perfil {
    background: var(--branco);
    border: 1px solid var(--creme-escuro);
    display: flex;
    align-items: center;
    gap: 2rem;
    padding: 2rem;
    margin-top: 4rem;
    max-width: 500px;
  }
  .card-perfil-info h3 {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 1.1rem;
    font-weight: 600;
    letter-spacing: 0.5px;
    color: var(--preto);
  }
  .card-perfil-info p {
    font-family: 'Barlow', sans-serif;
    font-size: 12px;
    color: var(--cinza);
    text-indent: 0 !important;
  }
  .card-perfil-qr {
    width: 64px;
    height: 64px;
    background: var(--creme-escuro);
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* CLEARFIX */
  .clearfix::after { content: ''; display: block; clear: both; height: 0; }

  /* FADE IN */
  .fade-in {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.7s ease, transform 0.7s ease;
    overflow: hidden;
  }
  .fade-in.visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* RESPONSIVE */
  @media (max-width: 900px) {
    .hero { grid-template-columns: 1fr; min-height: auto; }
    .hero-foto { height: 100vh; max-height: none; }
    .hero-texto { padding: 2.5rem 1.5rem; }
    .texto-duplo, .texto-triplo { grid-template-columns: 1fr; gap: 0; }
    .citacao-lateral { float: none; width: 100%; margin: 1.5rem 0; }
    .artigo { padding: 3rem 1.2rem; }
    .citacao-bloco { padding: 2rem 1.5rem; }
    .fotos-grid { grid-template-columns: 1fr; }
  }


  /* ── HEADER / NAV ── */
  nav {
    background: var(--vermelho);
    padding: 0 2.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 70px;
    position: sticky;
    top: 0;
    z-index: 200;
  }
  @media (max-width: 900px) {
    nav { padding: 0 20px; height: 60px; }
    .nav-btn { padding: 0 0.8rem; gap: 4px; height: 60px; }
    .nav-label { display: none; }
    .nav-btn .arrow { display: none; }
    .hero-foto-caption { bottom: 6rem; }
    .citacao-bloco { padding: 2rem 1.5rem; }
    .citacao-bloco blockquote {
      padding-left: 0;
      display: flex;
      flex-direction: column;
    }
    .citacao-bloco blockquote::before {
      position: static;
      display: block;
      font-size: 9rem;
      line-height: 0.3;
      margin-bottom: -0.5rem;
      color: rgba(255,255,255,0.25);
    }
  }
  .nav-logo svg { display: block; height: 18px; width: auto; }
  .nav-menu { display: flex; align-items: center; }
  .nav-item { position: relative; }
  .nav-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--branco);
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 500;
    font-size: 14px;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 0 1.4rem;
    height: 70px;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: background 0.15s;
  }
  .nav-btn:hover { background: rgba(255,255,255,0.12); }
  .nav-btn .arrow { font-size: 8px; transition: transform 0.2s; opacity: 0.8; }
  .nav-item.open .arrow { transform: rotate(180deg); }

  /* dropdown idiomas */
  .dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    background: var(--vermelho);
    min-width: 160px;
    border-top: 2px solid rgba(255,255,255,0.25);
    display: none;
    flex-direction: column;
    box-shadow: 0 8px 24px rgba(0,0,0,0.25);
    z-index: 300;
  }
  .nav-item.open .dropdown { display: flex; }
  .dropdown a {
    color: var(--branco);
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 12px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    padding: 13px 20px;
    text-decoration: none;
    border-bottom: 1px solid rgba(255,255,255,0.12);
    transition: background 0.15s;
  }
  .dropdown a:last-child { border-bottom: none; }
  .dropdown a:hover { background: rgba(255,255,255,0.15); }

  /* ── SCROLL INDICATOR ── */
  .scroll-hint {
    display: none;
  }
  @media (max-width: 900px) {
    .scroll-hint {
      position: absolute;
      bottom: 1.5rem;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      opacity: 0.75;
      animation: scrollBounce 2s ease-in-out infinite;
    }
  }
  .scroll-hint span {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--branco);
  }
  .scroll-hint svg { display: block; }
  @keyframes scrollBounce {
    0%, 100% { transform: translateX(-50%) translateY(0); opacity: 0.75; }
    50% { transform: translateX(-50%) translateY(6px); opacity: 1; }
  }

  /* ── COMPARTILHAMENTO ── */
  .share-sidebar {
    position: fixed;
    right: 1.5rem;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    gap: 10px;
    z-index: 150;
    opacity: 0;
    transition: opacity 0.4s ease;
  }
  .share-sidebar.visible { opacity: 1; }

  .share-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    text-decoration: none;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    border: none;
    position: relative;
  }
  .share-btn:hover {
    transform: scale(1.12);
    box-shadow: 0 4px 16px rgba(0,0,0,0.18);
  }
  .share-btn svg { display: block; }

  .share-btn--whatsapp { background: #25D366; }
  .share-btn--linkedin { background: #0A66C2; }
  .share-btn--facebook { background: #1877F2; }
  .share-btn--copy { background: var(--preto); }

  /* Tooltip */
  .share-btn::after {
    content: attr(data-tip);
    position: absolute;
    right: 52px;
    background: var(--preto);
    color: var(--branco);
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 11px;
    letter-spacing: 1px;
    text-transform: uppercase;
    padding: 4px 10px;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s;
  }
  .share-btn:hover::after { opacity: 1; }

  /* Mobile bottom bar */
  .share-mobile {
    display: none;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: var(--preto);
    padding: 10px 1.5rem;
    z-index: 150;
    justify-content: space-around;
    align-items: center;
    border-top: 2px solid var(--vermelho);
    opacity: 0;
    transition: opacity 0.4s ease;
  }
  .share-mobile.visible { opacity: 1; }
  .share-mobile .share-btn {
    width: 44px;
    height: 44px;
  }
  .share-mobile .share-label {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 10px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.6);
    text-align: center;
    margin-top: 2px;
  }
  .share-mobile-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
  }

  @media (max-width: 900px) {
    .share-sidebar { display: none; }
    .share-mobile { display: flex; }
    /* Add padding to body so content not hidden behind bar */

  }
  @media (min-width: 901px) {
    .share-mobile { display: none !important; }
  }

  /* Copied feedback */
  .share-btn--copy.copied::after { content: 'Copiado!'; opacity: 1; }

  /* ── CTA ── */
  .cta-section {
    background: var(--creme-escuro);
  }
  .cta-inner {
    max-width: 1100px;
    margin: 0 auto;
    padding: 4rem 4rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
    flex-wrap: wrap;
  }
  .cta-texto h3 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.4rem, 2.5vw, 2rem);
    font-weight: 700;
    color: var(--preto);
    margin-bottom: 0.5rem;
    line-height: 1.2;
  }
  .cta-texto p {
    font-family: 'Barlow', sans-serif;
    font-size: 1rem;
    color: #555;
    text-indent: 0;
  }
  .cta-botoes {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }
  .cta-btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 0.9rem 1.8rem;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    text-decoration: none;
    transition: transform 0.2s, box-shadow 0.2s;
    white-space: nowrap;
  }
  .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.15); }
  .cta-btn--whatsapp { background: #25D366; color: #fff; }
  .cta-btn--site { background: var(--vermelho); color: #fff; }
  .cta-btn svg { flex-shrink: 0; }

  /* ── OUTRAS MATÉRIAS ── */
  .outras-materias {
    background: var(--branco);
    padding: 4rem 0;
  }
  .carrossel-outer {
    max-width: 80%;
    margin: 0 auto;
    position: relative;
  }
  .outras-titulo {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--cinza);
    text-align: center;
    margin-bottom: 3rem;
  }
  .carrossel-wrapper {
    overflow: hidden;
    padding: 0;
  }
  .carrossel-track {
    display: flex;
    gap: 2rem;
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .carrossel-card {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    min-width: calc(50% - 1rem);
    flex-shrink: 0;
    text-decoration: none;
    cursor: pointer;
    padding: 1rem 0;
  }
  .carrossel-card img {
    width: 180px;
    height: 120px;
    object-fit: cover;
    flex-shrink: 0;
  }
  .carrossel-card-texto {}
  .carrossel-card-secao {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--vermelho);
    display: block;
    margin-bottom: 0.4rem;
  }
  .carrossel-card-titulo {
    font-family: 'Playfair Display', serif;
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--preto);
    line-height: 1.2;
    display: block;
    margin-bottom: 0.4rem;
  }
  .carrossel-card-desc {
    font-family: 'Barlow', sans-serif;
    font-size: 0.85rem;
    color: var(--cinza);
    line-height: 1.4;
  }
  .carrossel-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: var(--vermelho);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s, transform 0.2s;
    z-index: 10;
  }
  .carrossel-btn:hover { background: #a00d24; transform: translateY(-50%) scale(1.08); }
  .carrossel-btn--prev { left: -1.5rem; }
  .carrossel-btn--next { right: -1.5rem; }

  /* ── FOOTER ── */
  footer { position: relative; z-index: 0; isolation: isolate; }
  .footer-mobile { display: flex; flex-direction: column; background: var(--vermelho); padding: 2.5rem 1.5rem; gap: 2rem; }
  .footer-desktop { display: none; }
  @media (min-width: 901px) {
    .footer-mobile { display: none; }
    .footer-desktop {
      display: flex;
      flex-direction: row;
      background: var(--vermelho);
      padding: 4rem;
      gap: 3rem;
      align-items: flex-start;
      position: relative;
      z-index: 1;
    }
    .footer-desktop > * {
      flex: 1 1 0;
      min-width: 0;
      box-sizing: border-box;
      position: relative;
      z-index: 2;
    }
  }
  .footer-logo svg { height: 40px; width: auto; display: block; margin-bottom: 1rem; }
  .footer-tagline {
    font-family: 'Barlow', sans-serif;
    font-size: 0.975rem;
    color: rgba(255,255,255,0.7);
  }
  .footer-nav {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
  }
  .footer-nav a {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--branco);
    text-decoration: none;
    padding: 1rem 0;
    width: 100%;
    text-align: center;
    border-bottom: 1px solid rgba(255,255,255,0.2);
    transition: color 0.2s;
  }
  .footer-nav a:first-child { border-top: 1px solid rgba(255,255,255,0.2); }
  .footer-nav a:hover { color: rgba(255,255,255,0.7); }
  .footer-newsletter h4 {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 18px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--branco);
    margin-bottom: 0.5rem;
    text-align: center;
  }
  .footer-newsletter p {
    font-family: 'Barlow', sans-serif;
    font-size: 0.8375rem;
    color: rgba(255,255,255,0.7);
    text-align: center;
    margin-bottom: 1.2rem;
    line-height: 1.5;
    text-indent: 0;
  }
  .newsletter-form {
    display: flex;
    align-items: center;
    border-bottom: 1px solid rgba(255,255,255,0.5);
    margin-bottom: 1rem;
  }
  .newsletter-form input {
    flex: 1;
    background: none;
    border: none;
    outline: none;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 13px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--branco);
    padding: 0.6rem 0;
  }
  .newsletter-form input::placeholder { color: rgba(255,255,255,0.5); }
  footer input[type="email"]::placeholder { color: rgba(255,255,255,0.6) !important; }
  .newsletter-form button {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--branco);
    padding: 0.4rem;
    display: flex;
    align-items: center;
  }
  .newsletter-check {
    display: flex;
    align-items: flex-start;
    gap: 8px;
  }
  .newsletter-check input[type="checkbox"] {
    margin-top: 3px;
    flex-shrink: 0;
    accent-color: var(--branco);
    outline: none;
    box-shadow: none;
    border: none;
  }
  .newsletter-check input[type="checkbox"]:focus { outline: none; box-shadow: none; }
  .newsletter-check label {
    font-family: 'Barlow', sans-serif;
    font-size: 0.72rem;
    color: rgba(255,255,255,0.65);
    line-height: 1.4;
  }
  .footer-bottom {
    background: #a00d24;
    padding: 1.2rem 4rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem;
  }
  .footer-bottom span, .footer-bottom a {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 11px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.7);
    text-decoration: none;
  }
  .footer-bottom a:hover { color: var(--branco); }
  .footer-bottom-links { display: flex; gap: 2rem; }
  .footer-credit a { color: rgba(255,255,255,0.9) !important; font-weight: 600; }
  .footer-bottom-left { display: flex; flex-direction: column; gap: 4px; }

  @media (max-width: 900px) {
    /* CTA */
    .cta-inner {
      flex-direction: column;
      padding: 2.5rem 1.5rem;
    }
    .cta-botoes { width: 100%; flex-direction: column; }
    .cta-btn { width: 100%; justify-content: center; }

    /* Carrossel */
    .carrossel-card {
      min-width: 100%;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    .carrossel-card img {
      width: 100%;
      height: 200px;
    }
    .carrossel-outer { max-width: 90%; }
    .outras-materias { padding-bottom: 5rem; }

    /* Footer */
    .footer-desktop { display: none !important; }
    .footer-mobile-logo {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    .footer-mobile-logo svg { height: 40px; margin-bottom: 0.8rem; }
    .footer-mobile-logo .footer-tagline { text-align: center; color: rgba(255,255,255,0.7); font-family: 'Barlow', sans-serif; font-size: 0.975rem; }
    .footer-mobile .footer-nav { align-items: center; }
    .footer-mobile .footer-nav a { text-align: center; }
    .footer-mobile .footer-newsletter h4,
    .footer-mobile .footer-newsletter p { text-align: center; }
    .footer-bottom {
      padding: 1rem 1.5rem;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 0.8rem;
    }
    .footer-bottom-links { justify-content: center; flex-wrap: wrap; gap: 1rem; }

    /* Footer bottom */
    .footer-bottom {
      padding: 1rem 1.5rem;
      flex-direction: column;
      align-items: center;
      gap: 0.8rem;
      text-align: center;
    }
    .footer-bottom-links {
      flex-wrap: wrap;
      gap: 1rem;
      justify-content: center;
    }
  }

  /* ── NAV MATÉRIAS ── */
  .nav-materias {
    display: flex;
    align-items: center;
    position: relative;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 4rem;
  }
  .nav-materias-track-wrapper {
    flex: 1;
    overflow: hidden;
  }
  .nav-materias-track {
    display: flex;
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .nav-mat-card {
    min-width: 50%;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 2rem;
    padding: 0 2rem;
    text-decoration: none;
    box-sizing: border-box;
  }
  .nav-mat-card img {
    width: 200px;
    height: 200px;
    object-fit: cover;
    flex-shrink: 0;
  }
  .nav-mat-info {
    display: flex;
    flex-direction: column;
  }
  .nav-mat-secao {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--cinza);
    margin-bottom: 0.5rem;
  }
  .nav-mat-titulo {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.3rem, 2vw, 1.8rem);
    font-weight: 700;
    color: var(--vermelho);
    line-height: 1.15;
    font-style: italic;
  }
  .nav-mat-desc {
    font-family: 'Barlow', sans-serif;
    font-size: 0.9rem;
    color: var(--cinza);
    line-height: 1.4;
    margin-top: 0.3rem;
  }
  .nav-mat-btn {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: var(--vermelho);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: background 0.2s, transform 0.2s;
    z-index: 10;
  }
  .nav-mat-btn:hover { background: #a00d24; transform: scale(1.08); }
  @media (max-width: 900px) {
    .nav-materias { padding: 0 1rem; }
    .nav-mat-card { min-width: 100%; padding: 0 1rem; flex-direction: column; align-items: center; text-align: center; }
    .nav-mat-card img { width: 100%; height: 220px; }
    .nav-mat-btn { width: 40px; height: 40px; }
  }

  /* ── NAVEGAÇÃO ENTRE MATÉRIAS ── */
  .nav-edicao {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    padding: 4rem;
    background: var(--branco);
    border-top: 1px solid var(--creme-escuro);
  }
  .nav-edicao-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.8rem;
    padding: 1rem 2rem;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    text-decoration: none;
    border: 2px solid var(--vermelho);
    color: var(--vermelho);
    background: transparent;
    transition: background 0.2s, color 0.2s;
  }
  .nav-edicao-btn:hover {
    background: var(--vermelho);
    color: var(--branco);
  }
  @media (max-width: 900px) {
    .nav-edicao {
      flex-direction: column;
      padding: 2.5rem 1.5rem;
      gap: 1rem;
    }
    .nav-edicao-btn { width: 100%; justify-content: center; }
  }

  /* ── BARRA INFERIOR FOOTER ── */
  .footer-bar {
    background: #a00d24;
    padding: 1.2rem 3rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
  }
  .footer-bar-copy {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 14px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.7);
    white-space: nowrap;
  }
  .footer-bar-links {
    display: flex;
    gap: 2rem;
    flex-wrap: nowrap;
  }
  .footer-bar-link {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 14px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.7);
    text-decoration: none;
    transition: color 0.2s, border-bottom 0.2s;
    border-bottom: 1px solid transparent;
    padding-bottom: 2px;
  }
  .footer-bar-link:hover {
    color: var(--branco);
    border-bottom: 1px solid var(--branco);
  }
  @media (max-width: 900px) {
    .footer-bar {
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 1.2rem 1.5rem 5rem;
      gap: 0.8rem;
    }
    .footer-bar-copy { white-space: normal; font-size: 11px; }
    .footer-bar-links { flex-wrap: nowrap; justify-content: center; gap: 1.2rem; }
    .footer-bar-link { font-size: 11px; padding: 8px 4px; min-height: 44px; display: flex; align-items: center; }
  }

  /* ── FOOTER NAV LINKS ── */
  .footer-nav-link {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #fff;
    text-decoration: none;
    padding: 1rem 1rem;
    text-align: center;
    display: block;
    transition: background 0.2s, color 0.2s;
  }
  .footer-nav-link:hover {
    background: rgba(255,255,255,0.12);
    color: #fff;
  }


  /* ── READING CIRCLE ── */
  .reading-circle {
    position: fixed;
    bottom: 2rem;
    left: 2rem;
    width: 72px;
    height: 72px;
    z-index: 150;
    opacity: 0;
    transform: scale(0.8);
    transition: opacity 0.4s ease, transform 0.4s ease;
    cursor: default;
  }
  .reading-circle.visible {
    opacity: 1;
    transform: scale(1);
  }
  .reading-circle svg {
    position: absolute;
    top: 0; left: 0;
    width: 72px; height: 72px;
    transform: rotate(-90deg);
  }
  .reading-circle-bg {
    fill: none;
    stroke: rgba(200,16,46,0.2);
    stroke-width: 4;
  }
  .reading-circle-prog {
    fill: none;
    stroke: var(--vermelho);
    stroke-width: 4;
    stroke-linecap: round;
    stroke-dasharray: 201;
    stroke-dashoffset: 201;
    transition: stroke-dashoffset 0.3s ease;
  }
  .reading-circle-inner {
    position: absolute;
    inset: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: var(--branco);
    border-radius: 50%;
    box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  }
  .reading-circle-mins {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 22px;
    font-weight: 600;
    color: var(--vermelho);
    line-height: 1;
  }
  .reading-circle-label {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 10px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    color: var(--cinza);
    line-height: 1;
    margin-top: 2px;
  }
  .reading-circle-done .reading-circle-mins {
    font-size: 12px;
    letter-spacing: 0.5px;
  }
  @media (max-width: 900px) {
    .reading-circle { bottom: 5rem; left: 1rem; width: 64px; height: 64px; }
    .reading-circle svg { width: 64px; height: 64px; }
    .reading-circle-mins { font-size: 19px; }
  }
</style>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "%%TITULO_SEO%%",
  "description": "%%SEO_DESC%%",
  "image": "https://bnibusiness.com.br/edicao-02/%%SLUG%%/img/og-cover.webp",
  "author": {"@type": "Person", "name": "%%AUTOR%%"},
  "publisher": {"@type": "Organization", "name": "Revista BNI Business", "url": "https://bnibusiness.com.br"},
  "datePublished": "%%DATA_ISO%%",
  "mainEntityOfPage": "https://bnibusiness.com.br/edicao-02/%%SLUG%%/",
  "articleSection": "%%SECAO%%",
  "inLanguage": "pt-BR"
}
</script>
<script src="../../nav.js?v=2026050303" defer></script>
  <script src="../../footer.js?v=2026050303" defer></script>
  <script src="../../sumario.js?v=2026050501" defer></script>
  </head>
<body>
<div class="reading-circle" id="readingCircle">
  <svg viewBox="0 0 72 72">
    <circle class="reading-circle-bg" cx="36" cy="36" r="32"/>
    <circle class="reading-circle-prog" id="circleProgress" cx="36" cy="36" r="32"/>
  </svg>
  <div class="reading-circle-inner" id="circleInner">
    <span class="reading-circle-mins" id="circleMins">12</span>
    <span class="reading-circle-label" id="circleLabel">min</span>
  </div>
</div>

<!-- COMPARTILHAMENTO LATERAL (desktop) -->
<div class="share-sidebar" id="shareSidebar">
  <a class="share-btn share-btn--whatsapp" href="https://wa.me/?text=%%TITULO_SEO%% — BNI Business%20https://bnibusiness.com.br/edicao-02/%%SLUG%%" target="_blank" rel="noopener" data-tip="WhatsApp"><svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></a>
  <a class="share-btn share-btn--linkedin" href="https://www.linkedin.com/sharing/share-offsite/?url=https://bnibusiness.com.br/edicao-02/%%SLUG%%" target="_blank" rel="noopener" data-tip="LinkedIn"><svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>
  <a class="share-btn share-btn--facebook" href="https://www.facebook.com/sharer/sharer.php?u=https://bnibusiness.com.br/edicao-02/%%SLUG%%" target="_blank" rel="noopener" data-tip="Facebook"><svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
  <button class="share-btn share-btn--copy" onclick="copiarLink()" data-tip="Copiar link" id="copyBtn"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg></button>
</div>

<!-- COMPARTILHAMENTO INFERIOR (mobile) -->
<div class="share-mobile" id="shareMobile">
  <div class="share-mobile-item">
    <a class="share-btn share-btn--whatsapp" href="https://wa.me/?text=%%TITULO_SEO%% — BNI Business%20https://bnibusiness.com.br/edicao-02/%%SLUG%%" target="_blank" rel="noopener"><svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></a>
    <span class="share-label">WhatsApp</span>
  </div>
  <div class="share-mobile-item">
    <a class="share-btn share-btn--linkedin" href="https://www.linkedin.com/sharing/share-offsite/?url=https://bnibusiness.com.br/edicao-02/%%SLUG%%" target="_blank" rel="noopener"><svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>
    <span class="share-label">LinkedIn</span>
  </div>
  <div class="share-mobile-item">
    <a class="share-btn share-btn--facebook" href="https://www.facebook.com/sharer/sharer.php?u=https://bnibusiness.com.br/edicao-02/%%SLUG%%" target="_blank" rel="noopener"><svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
    <span class="share-label">Facebook</span>
  </div>
  <div class="share-mobile-item">
    <button class="share-btn share-btn--copy" onclick="copiarLink()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg></button>
    <span class="share-label">Copiar</span>
  </div>
</div>


<!-- NAV -->


<!-- HERO -->
<section class="hero">
  <div class="hero-foto">
    <!-- Placeholder: substituir pela foto real do Felipe -->
    <img src="%%IMAGEM_URL%%" alt="%%IMAGEM_ALT%%" loading="eager" fetchpriority="high" />
    <div class="hero-foto-caption">
      <p><strong>%%PROFISSIONAL%%</strong> %%CAPTION%%</p>
    </div>
    <div class="scroll-hint">
      <span>Scroll</span>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </div>
  </div>

  <div class="hero-texto fade-in">
    <div class="hero-byline">
      <span class="bl-secao">%%SECAO%%</span>
      <span class="bl-data">%%DATA_FORMATADA%%</span>
      <span class="bl-leitura" id="readingTime">12 min de leitura</span>
    </div>

    <h1 class="hero-titulo">%%TITULO_HTML%%</h1>

    <p class="hero-chapeu">%%OLHO%%</p>

    <div class="hero-assina">Por <span>%%AUTOR%%</span></div>
  </div>
</section>

<div class="divisor"></div>

<!-- ARTIGO PRINCIPAL -->
<main class="artigo">
%%ARTIGO%%
</main>

  <!-- CTA -->
  %%CTA_SECTION%%

  <!-- NAVEGAÇÃO ENTRE MATÉRIAS -->
  <section class="nav-edicao">
    <a class="nav-edicao-btn nav-edicao-prev" href="#">
      <svg width="28" height="12" viewBox="0 0 28 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="27" y1="6" x2="1" y2="6"/><polyline points="7 1 1 6 7 11"/></svg>
      Matéria Anterior
    </a>
    <a class="nav-edicao-btn nav-edicao-next" href="#">
      Próxima Matéria
      <svg width="28" height="12" viewBox="0 0 28 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="1" y1="6" x2="27" y2="6"/><polyline points="21 1 27 6 21 11"/></svg>
    </a>
  </section>

  <!-- FOOTER -->
  

<script>

  // Scroll fade-in
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));
  setTimeout(() => {
    const h = document.querySelector('.hero-texto');
    if (h) h.classList.add('visible');
  }, 100);

  // Divisor animation on load
  setTimeout(() => {
    const d = document.querySelector('.divisor');
    if (d) d.classList.add('animado');
  }, 300);

  // Secao-titulo underline draw animation
  const obsTitulo = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('animado');
        obsTitulo.unobserve(e.target);
      }
    });
  }, { threshold: 0.8 });
  document.querySelectorAll('.secao-titulo').forEach(el => obsTitulo.observe(el));

  // Citacao slide-in (separate from fade-in)
  const obsCitacao = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obsCitacao.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.citacao-bloco').forEach(el => obsCitacao.observe(el));

  // Hero parallax
  const heroImg = document.querySelector('.hero-foto img');
  if (heroImg) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * 0.25;
      heroImg.style.transform = 'translateY(' + rate + 'px)';
    }, { passive: true });
  }

  // Dropdown idiomas
  function toggleDropdown(id) {
    const item = document.getElementById(id);
    item.classList.toggle('open');
  }
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-item')) {
      document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('open'));
    }
  });

  // Share buttons appear after scrolling past hero
  const shareSidebar = document.getElementById('shareSidebar');
  const shareMobile = document.getElementById('shareMobile');
  const outrasMaterias = document.querySelector('.cta-section');
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const afterHero = scrolled > window.innerHeight * 0.6;
    const beforeOtras = outrasMaterias
      ? scrolled < outrasMaterias.getBoundingClientRect().top + scrolled - 80
      : true;
    const show = afterHero && beforeOtras;
    if (shareSidebar) shareSidebar.classList.toggle('visible', show);
    if (shareMobile) shareMobile.classList.toggle('visible', show);
  }, { passive: true });

  // Copy link
  function copiarLink() {
    navigator.clipboard.writeText('https://bnibusiness.com.br/edicao-02/%%SLUG%%').then(() => {
      const btn = document.getElementById('copyBtn');
      if (btn) {
        btn.classList.add('copied');
        setTimeout(() => btn.classList.remove('copied'), 2000);
      }
    });
  }

  // Carrossel
  let carrosselPos = 0;
  function moverCarrossel(dir) {
    const track = document.getElementById('carrosselTrack');
    const cards = track.querySelectorAll('.nav-mat-card');
    const isMobile = window.innerWidth <= 900;
    const visible = isMobile ? 1 : 2;
    const max = cards.length - visible;
    carrosselPos = Math.max(0, Math.min(carrosselPos + dir, max));
    const cardW = cards[0].offsetWidth;
    track.style.transform = 'translateX(-' + (carrosselPos * cardW) + 'px)';
  }


  // ── READING CIRCLE ──
  const readingCircle = document.getElementById('readingCircle');
  const circleProgress = document.getElementById('circleProgress');
  const circleMins = document.getElementById('circleMins');
  const circleLabel = document.getElementById('circleLabel');
  const circleInner = document.getElementById('circleInner');
  const readingTimeEl = document.getElementById('readingTime');
  const totalMins = %%TOTAL_MINS%%;
  const circumference = 201; // 2 * PI * 32

  window.addEventListener('scroll', () => {
    const artigo = document.querySelector('main.artigo');
    if (!artigo) return;

    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.min(scrollTop / docHeight, 1);

    // Show circle after 30% of hero, hide when footer is visible
    if (readingCircle) {
      const footer = document.querySelector('footer');
      const footerTop = footer ? footer.getBoundingClientRect().top : Infinity;
      const showCircle = scrollTop > window.innerHeight * 0.3 && footerTop > window.innerHeight;
      readingCircle.classList.toggle('visible', showCircle);
    }

    // Arc progress
    if (circleProgress) {
      const offset = circumference - (progress * circumference);
      circleProgress.style.strokeDashoffset = offset;
    }

    // Mins remaining
    const artigoTop = artigo.offsetTop;
    const artigoHeight = artigo.offsetHeight;
    const readProgress = Math.max(0, Math.min((scrollTop - artigoTop) / artigoHeight, 1));
    const minsLeft = Math.ceil(totalMins * (1 - readProgress));

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


  // ── LANGUAGE SWITCHER ──
  function setLang(sigla) {
    localStorage.setItem('bni_lang', sigla);
  }
  function hideLangCurrent() {
    const pageLang = document.documentElement.dataset.lang || 'PT';
    document.querySelectorAll('.dropdown a[data-lang]').forEach(function(a) {
      a.style.display = (a.dataset.lang === pageLang) ? 'none' : '';
    });
    const label = document.getElementById('langLabel');
    if (label) label.textContent = pageLang;
  }
  document.addEventListener('DOMContentLoaded', hideLangCurrent);
</script>
</body>
</html>`;

function montarTemplate(d, parts) {
  const dataFormatada = d.data
    ? new Date(d.data + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
    : '';
  const dataISO    = d.data || '';
  const slug       = d.slug || 'materia';

  const seoDesc    = (parts.seo    || '').replace(/%%/g, '').trim();
  const caption    = (parts.caption || '').trim();

  // Título do hero: pipe manual → sempre JS (determinístico);
  // sem pipe → prefere resultado da IA, JS como fallback.
  var heroTituloRaw = d.titulo || '';
  var heroTitulo;
  if (heroTituloRaw.indexOf(' | ') !== -1) {
    heroTitulo = formatarTituloHero(heroTituloRaw);
  } else {
    heroTitulo = (parts.titulo && parts.titulo.trim()) ? parts.titulo.trim() : formatarTituloHero(heroTituloRaw);
  }

  const artigo     = montarCorpoArtigo(d, parts.legendas || {});
  const ctaHtml    = montarCTASection(d);

  // Computa tempo de leitura estimado
  const wordCount  = (d.texto || '').replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  const totalMins  = Math.max(1, Math.ceil(wordCount / 200));

  const r = (str) => (s, find, val) => s.split(find).join(val);
  let html = TEMPLATE_BASE;
  const R = (find, val) => { html = html.split(find).join(val); };

  R('%%TITULO_SEO%%',   d.titulo || '');
  R('%%SEO_DESC%%',     seoDesc);
  R('%%SLUG%%',         slug);
  R('%%SECAO%%',        d.secao || '');
  R('%%AUTOR%%',        d.autor || '');
  R('%%DATA_ISO%%',     dataISO);
  R('%%DATA_FORMATADA%%', dataFormatada);
  R('%%IMAGEM_URL%%',   d.imagemUrl || ('/edicao-02/' + slug + '/hero.jpg'));
  R('%%IMAGEM_ALT%%',   d.imagemAlt || '');
  R('%%PROFISSIONAL%%', d.profissional || d.empresa || '');
  R('%%CAPTION%%',      caption);
  R('%%TITULO_HTML%%',  heroTitulo);
  R('%%OLHO%%',         d.olho || '');
  R('%%ARTIGO%%',       artigo);
  R('%%CTA_SECTION%%',  ctaHtml);
  R('%%TOTAL_MINS%%',   String(totalMins));

  return html;
}


// ── FORMATAR TÍTULO DO HERO ───────────────────────────────────
// Pipe " | " = quebra manual respeitada à risca.
// ≤4 palavras (sem pipe) = 2 linhas (vermelho / cinza).
// 5+ palavras (sem pipe) = 3 linhas equilibradas (vermelho / cinza / vermelho).
function formatarTituloHero(titulo) {
  titulo = (titulo || '').trim();
  var partes;

  if (titulo.indexOf(' | ') !== -1) {
    partes = titulo.split(' | ').map(function (p) { return p.trim(); }).filter(Boolean);
  } else {
    var palavras = titulo.split(/\s+/).filter(Boolean);
    var n = palavras.length;
    if (n <= 1) {
      partes = [titulo];
    } else if (n <= 4) {
      // 2 linhas: todas exceto a última | última
      partes = [palavras.slice(0, n - 1).join(' '), palavras[n - 1]];
    } else {
      // 3 linhas: ceil(n/3) | ceil(restante/2) | restante
      var t1 = Math.ceil(n / 3);
      var t2 = Math.ceil((n - t1) / 2);
      partes = [
        palavras.slice(0, t1).join(' '),
        palavras.slice(t1, t1 + t2).join(' '),
        palavras.slice(t1 + t2).join(' ')
      ];
    }
  }

  var cores = ['var(--vermelho)', '#b3b2b2', 'var(--vermelho)'];
  return partes.map(function (p, i) {
    return '<span style="color:' + (cores[i] || 'var(--vermelho)') + ';">' + p + '</span>';
  }).join('<br>\n');
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
[Formate o titulo "${d.titulo}" em HTML para o hero. REGRAS OBRIGATORIAS:

1. PADRAO DE CORES: vermelho → cinza → vermelho.
   Vermelho = var(--vermelho) | Cinza = #b3b2b2

2. PIPE " | " = quebra manual: use EXATAMENTE esses pontos, sem alterar palavras.
   Ex: "Quando o BNI | vai além do | networking"
   → <span style="color:var(--vermelho);">Quando o BNI</span><br>
   <span style="color:#b3b2b2;">vai além do</span><br>
   <span style="color:var(--vermelho);">networking</span>

3. SEM PIPE + TITULO CURTO (4 palavras ou menos) = 2 linhas (vermelho/cinza).
   Ex: "O fim do silêncio"
   → <span style="color:var(--vermelho);">O fim do</span><br>
   <span style="color:#b3b2b2;">silêncio</span>

4. SEM PIPE + TITULO LONGO (5+ palavras) = SEMPRE 3 linhas (vermelho/cinza/vermelho).
   Quebre em preposicoes, conjuncoes ou pausas gramaticais naturais.
   NAO corte nomes proprios nem expressoes idiomaticas.
   Ex: "Quando o BNI vai além do networking"
   → <span style="color:var(--vermelho);">Quando o BNI</span><br>
   <span style="color:#b3b2b2;">vai além do</span><br>
   <span style="color:var(--vermelho);">networking</span>

Retorne APENAS os span e br, sem a tag h1. Nao altere as palavras do titulo.]

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
