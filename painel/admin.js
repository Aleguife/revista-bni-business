// =============================================
// BNI BUSINESS — ADMIN CMS v2
// =============================================

// Hash SHA-256 da senha do painel.
// Para trocar a senha: gere o hash em https://emn178.github.io/online-tools/sha256.html
// e substitua a string abaixo. Sem fallback em texto claro.
const SENHA_HASH = '78a560ad10a00bf5b026cb04768dd98c8c436900eb9e5d4be6bb75a58366c221';

const REPO_OWNER = 'Aleguife';
const REPO_NAME  = 'revista-bni-business';
const LOGIN_SESSION_KEY = 'bni-painel-autenticado';

// ── EDIÇÃO ATUAL ────────────────────────────────────────────────
// Define qual edição o painel publica por padrão. Pode ser sobrescrito
// pelo seletor <select id="f-edicao"> no formulário.
const EDICAO_PADRAO = 'edicao-03';

function getCurrentEdicao() {
  const el = document.getElementById('f-edicao');
  return (el && el.value) ? el.value : EDICAO_PADRAO;
}

function edicaoNumero(edicao) {
  const m = (edicao || '').match(/edicao-(\d+)/);
  return m ? m[1] : '00';
}

// ── MAPA: valor do <select> → dados da matéria ──────────────────
// Chaves sem prefixo = Edição 02. Chaves com prefixo 'ed1-' = Edição 01.
const SECAO_MAP = {
  // Edição 02
  'eventos-1':       { label: 'Eventos',                 slug: 'eventos'                  },
  'case-1':          { label: 'Case de sucesso',         slug: 'magna-marinho'            },
  'capa':            { label: 'Matéria de Capa',         slug: 'materia-de-capa'          },
  'editorial':       { label: 'Editorial',               slug: 'alef-editora'             },
  'negocios-1':      { label: 'Negócios',                slug: 'up-brasil'                },
  'saude-mental':    { label: 'Saúde mental',            slug: 'tonos'                    },
  'direito':         { label: 'Direito',                 slug: 'aposenta-sp'              },
  'estilo':          { label: 'Estilo',                  slug: 'msr-device-golden-store'  },
  'bni-mundi':       { label: 'BNI Mundi',               slug: 'bni-mundi'                },
  'reconhecimento':  { label: 'Reconhecimento',          slug: 'reconhecimento'           },
  'dev-pessoal':     { label: 'Desenvolvimento pessoal', slug: 'massaru-ogata'            },
  'turismo':         { label: 'Turismo',                 slug: 'monaco'                   },
  'bni-sao-francisco':{ label: 'BNI São Francisco',      slug: 'bni-sao-francisco'        },
  'eventos-2':       { label: 'Eventos',                 slug: 'salleven-eventos'         },
  'case-2':          { label: 'Case de sucesso',         slug: 'jrt-print'                },
  'negocios-2':      { label: 'Negócios',                slug: 'fia-business-school'      },
  // Edição 01
  'ed1-eventos':         { label: 'Eventos',                 slug: 'eventos'                 },
  'ed1-turismo':         { label: 'Turismo',                 slug: 'turismo'                 },
  'ed1-capa':            { label: 'Matéria de Capa',         slug: 'materia-de-capa'         },
  'ed1-branding':        { label: 'Branding',                slug: 'branding'                },
  'ed1-case-bni':        { label: 'Case de sucesso',         slug: 'case-bni'                },
  'ed1-estilo':          { label: 'Estilo',                  slug: 'estilo'                  },
  'ed1-design':          { label: 'Design',                  slug: 'design'                  },
  'ed1-ceos-no-bni':     { label: 'CEOs no BNI',             slug: 'ceos-no-bni'             },
  'ed1-dev-pessoal':     { label: 'Desenvolvimento pessoal', slug: 'desenvolvimento-pessoal' },
  'ed1-idiomas':         { label: 'Idiomas',                 slug: 'idiomas'                 },
  'ed1-engenharia':      { label: 'Engenharia',              slug: 'engenharia'              },
  'ed1-ong':             { label: 'ONG',                     slug: 'ong'                     },
  'ed1-saude-mental':    { label: 'Saúde mental',            slug: 'saude-mental'            },
  'ed1-saude':           { label: 'Saúde',                   slug: 'saude'                   },
  'ed1-publicidade':     { label: 'Publicidade',             slug: 'publicidade'             },
  'ed1-investimentos':   { label: 'Investimentos',           slug: 'investimentos'           },
  'ed1-investimentos-2': { label: 'Investimentos',           slug: 'investimentos-2'         },
};

// ── CHECKLIST POR EDIÇÃO ────────────────────────────────────────
const MATERIAS_POR_EDICAO = {
  'edicao-01': [
    { num:1,  secao:'Eventos',                 titulo:'BNI Summit 2026 MOVIMENTO: onde conexões se transformam em resultados',                                                                  slug:'eventos',                  status:'publicada' },
    { num:2,  secao:'Turismo',                 titulo:'Do passaporte à coragem: o que muda quando você cruza as fronteiras pela primeira vez',                                                  slug:'turismo',                  status:'publicada' },
    { num:3,  secao:'Matéria de Capa',         titulo:'BNI Revoluciona o Networking na Região Oeste de São Paulo: 12 Grupos unindo empresários e transformando negócios',                       slug:'materia-de-capa',          status:'publicada' },
    { num:4,  secao:'Branding',                titulo:'A transformação acontece quando design e propósito se encontram',                                                                        slug:'branding',                 status:'publicada' },
    { num:5,  secao:'Case de sucesso',         titulo:'Quando um grupo aposta em um sonho: a história de Anderson "Nen" e o verdadeiro significado de "Givers Gain"',                           slug:'case-bni',                 status:'publicada' },
    { num:6,  secao:'Estilo',                  titulo:'Onde paixão encontra propósito: a história de quem achou seu lugar',                                                                     slug:'estilo',                   status:'publicada' },
    { num:7,  secao:'Design',                  titulo:'O Alquimista do Aço: a história de quem transforma metal em sonhos',                                                                     slug:'design',                   status:'publicada' },
    { num:8,  secao:'CEOs no BNI',             titulo:'John Rodgerson: valores, relacionamentos e a arte de construir uma das maiores companhias aéreas do Brasil',                             slug:'ceos-no-bni',              status:'publicada' },
    { num:9,  secao:'Desenvolvimento pessoal', titulo:'A raridade que desperta onde o fim se transforma em novos começos',                                                                      slug:'desenvolvimento-pessoal',  status:'publicada' },
    { num:10, secao:'Idiomas',                 titulo:'"Inglês não é para mim!!"',                                                                                                              slug:'idiomas',                  status:'publicada' },
    { num:11, secao:'Engenharia',              titulo:'Quando a estrutura conta uma história: projetos que desafiam o impossível',                                                              slug:'engenharia',               status:'publicada' },
    { num:12, secao:'ONG',                     titulo:'Novas Trilhas: empresários transformam vidas além dos negócios',                                                                         slug:'ong',                      status:'publicada' },
    { num:13, secao:'Saúde mental',            titulo:'O segredo dos líderes que performam sem ansiedade: conheça a Tonos',                                                                     slug:'saude-mental',             status:'publicada' },
    { num:14, secao:'Saúde',                   titulo:'A nova era da fisioterapia: visão integrada, resultado real',                                                                            slug:'saude',                    status:'publicada' },
    { num:15, secao:'Publicidade',             titulo:'Quando a luz se acende, a cidade vê',                                                                                                    slug:'publicidade',              status:'publicada' },
    { num:16, secao:'Investimentos',           titulo:'Além dos números: a arte de construir legados que transcendem gerações',                                                                 slug:'investimentos',            status:'publicada' },
    { num:17, secao:'Investimentos',           titulo:'Educação financeira: o caminho para construir segurança, patrimônio e liberdade',                                                        slug:'investimentos-2',          status:'publicada' },
  ],
  'edicao-02': [
    { num:1,  secao:'Eventos',                titulo:'Cigar Night — Rodrigo Motta',            slug:'eventos',                  status:'publicada' },
    { num:2,  secao:'Case de sucesso',         titulo:'Magna Marinho / ELA',                    slug:'magna-marinho',            status:'publicada' },
    { num:3,  secao:'Case de sucesso',         titulo:'José Roberto Teixeira / JRT Print',      slug:'jrt-print',                status:'publicada' },
    { num:4,  secao:'Matéria de Capa',         titulo:'Felipe Xavier / Redax Engenharia',       slug:'materia-de-capa',          status:'publicada' },
    { num:5,  secao:'Editorial',               titulo:'O impresso que o digital não substitui', slug:'alef-editora',             status:'publicada' },
    { num:6,  secao:'Negócios',                titulo:'Up Brasil / Mariana Cerone',             slug:'up-brasil',                status:'publicada' },
    { num:7,  secao:'Saúde mental',            titulo:'Tonos / Elisa de Lima',                  slug:'tonos',                    status:'publicada' },
    { num:8,  secao:'Direito',                 titulo:'AposentaSP / Dra. Simone Baptista',      slug:'aposenta-sp',              status:'publicada' },
    { num:9,  secao:'Estilo',                  titulo:'MSR Device Golden / Anderson Oliveira',  slug:'msr-device-golden-store',  status:'publicada' },
    { num:10, secao:'BNI Mundi',               titulo:'WPO Languages / Waldir Pires',           slug:'bni-mundi',                status:'publicada' },
    { num:11, secao:'Reconhecimento',          titulo:'Evento BNI OESP',                        slug:'reconhecimento',           status:'publicada' },
    { num:12, secao:'Desenvolvimento pessoal', titulo:'Massaru Ogata / IFT',                    slug:'massaru-ogata',            status:'publicada' },
    { num:13, secao:'Eventos',                 titulo:'Salleven / Carla Sallada',               slug:'salleven-eventos',         status:'publicada' },
    { num:14, secao:'Turismo',                 titulo:'Mônaco / Convenção BNI 2026',            slug:'monaco',                   status:'publicada' },
    { num:15, secao:'Negócios',                titulo:'FIA Business School',                    slug:'fia-business-school',      status:'publicada' },
    { num:16, secao:'BNI São Francisco',       titulo:'BNI São Francisco',                      slug:'bni-sao-francisco',        status:'publicada' },
  ],
  'edicao-03': [
    { num:1,  secao:'Negócios',                 titulo:'Conexões que a IA não faz',                                                     slug:'conexoes-ia',                            status:'publicada' },
    { num:2,  secao:'Mercado imobiliário',      titulo:'Do contrato ao negócio: a trajetória de Peter Lima',                             slug:'peter-lima-mercado-imobiliario',         status:'publicada' },
    { num:3,  secao:'Desenvolvimento pessoal',  titulo:'Taís Araújo: reescrevendo histórias através da liderança',                        slug:'tais-araujo-lideranca',                  status:'publicada' },
    { num:4,  secao:'Matéria de capa',          titulo:'Thomas Pillet – Após liderar a cultura da Up Brasil, o executivo prepara grande mudança no setor', slug:'thomas-pillet-up-brasil', status:'pendente' },
    { num:5,  secao:'Estilo',                   titulo:'O que sua joia diz sobre você',                                                   slug:'joias-estilo-pessoal',                   status:'pendente' },
    { num:6,  secao:'Saúde mental',             titulo:'O que a mente exausta custa ao negócio',                                          slug:'saude-mental-negocios',                  status:'pendente' },
    { num:7,  secao:'Saúde mental',             titulo:'Quem é o CEO do seu cérebro – tem certeza que é você?',                            slug:'ceo-do-seu-cerebro',                     status:'pendente' },
    { num:8,  secao:'Direito',                  titulo:'Quem cuida da sua aposentadoria quando você não tem RH pra isso?',                slug:'aposentadoria-sem-rh',                   status:'pendente' },
    { num:9,  secao:'Alta performance',         titulo:'Wilson Borges: de jogador de futebol a presidente de multinacionais farmacêuticas', slug:'wilson-borges-alta-performance',         status:'pendente' },
    { num:10, secao:'Negócios',                 titulo:'Liderança sem fronteiras',                                                        slug:'lideranca-sem-fronteiras',                status:'pendente' },
    { num:11, secao:'Networking',               titulo:'O Valor das Conexões Reais',                                                      slug:'conexoes-reais-networking',               status:'pendente' },
    { num:12, secao:'Case de sucesso',          titulo:'Foco, força e fé: a fórmula de voo do Comandante Ramos',                           slug:'comandante-ramos-lideranca',              status:'pendente' },
    { num:13, secao:'Estilo',                   titulo:'Stella Onisko: a arquitetura de uma reconstrução',                                 slug:'stella-onisko-arquitetura',               status:'pendente' },
    { num:14, secao:'Marketing',                titulo:'Marca não é enfeite: é decisão de negócio',                                       slug:'marca-nao-e-enfeite',                     status:'pendente' },
    { num:15, secao:'Saúde',                    titulo:'Vitae Flux: a virada que um engenheiro deu rumo ao cuidado integrativo',          slug:'vitae-flux-cuidado-integrativo',          status:'pendente' },
    { num:16, secao:'Case de sucesso',          titulo:'Rafael Oleinik: pra trás, nem pra pegar impulso!',                                 slug:'rafael-oleinik-case-sucesso',             status:'pendente' },
  ],
};

function getMateriasAtuais() {
  return MATERIAS_POR_EDICAO[getCurrentEdicao()] || [];
}

const RASCUNHO_KEY   = 'bni-rascunho';
const CAMPOS_SIMPLES = [
  ['f-edicao',       'edicao'],
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
  ['f-materia-checklist', 'materiaChecklist'],
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
          ['imagem', 'legenda', 'credito', 'uma-coluna', 'slider'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['clean'],
        ],
        handlers: {
          imagem: function () {
            const range = quill.getSelection(true);
            const placeholder = '[IMG: nome-da-imagem.webp]';
            quill.insertText(range.index, placeholder, 'user');
            quill.setSelection(range.index + placeholder.length);
          },
          legenda: function () { inserirTagNoEditor('[LEGENDA: Escreva uma legenda editorial personalizada]'); },
          credito: function () { inserirTagNoEditor('[CRÉDITO: Nome do fotógrafo]'); },
          'uma-coluna': function () {
            const range = quill.getSelection(true);
            const placeholder = '[1COL]\n\n[/1COL]';
            quill.insertText(range.index, placeholder, 'user');
            quill.setSelection(range.index + 7);
          },
          slider: function () { /* tratado pelo dropdown — ver abaixo */ },
        },
      },
      clipboard: { matchVisual: false },
    },
    placeholder: 'Cole aqui o texto completo. Bold, italic, listas e subtítulos são preservados automaticamente ao colar do InDesign ou Word.',
  });

  function inserirTagNoEditor(tag) {
    const range = quill.getSelection(true);
    quill.insertText(range.index, tag, 'user');
    quill.setSelection(range.index + tag.length);
  }

  // Estiliza botões de tags editoriais
  const btnImg = document.querySelector('.ql-imagem');
  if (btnImg) { btnImg.textContent = '📷'; btnImg.title = 'Inserir imagem [IMG: arquivo.webp]'; }
  const btnLegenda = document.querySelector('.ql-legenda');
  if (btnLegenda) { btnLegenda.textContent = '💬'; btnLegenda.title = 'Legenda manual da imagem anterior'; }
  const btnCredito = document.querySelector('.ql-credito');
  if (btnCredito) { btnCredito.textContent = '©'; btnCredito.title = 'Crédito da imagem anterior'; }
  const btnUmaColuna = document.querySelector('.ql-uma-coluna');
  if (btnUmaColuna) { btnUmaColuna.textContent = '1↔2'; btnUmaColuna.title = 'Bloco com fluxo equilibrado em duas colunas'; btnUmaColuna.style.cssText += 'width:auto;padding:0 5px;font-size:11px;'; }
  // Dropdown 🎠
  const btnSlider = document.querySelector('.ql-slider');
  if (btnSlider) {
    btnSlider.innerHTML = '🎠 <span style="font-size:9px;opacity:0.6;">▾</span>';
    btnSlider.style.cssText += 'width:auto;padding:0 6px;';

    const ddMenu = document.createElement('div');
    ddMenu.className = 'ql-slider-dropdown';
    ddMenu.innerHTML = [
      ['sl',         'Slider sem legenda'],
      ['individual', 'Slider legenda individual'],
      ['global',     'Slider legenda global'],
      ['manual',     'Slider legenda manual'],
    ].map(([t, l]) => `<div class="ql-slider-option" data-type="${t}">${l}</div>`).join('');

    const wrap = btnSlider.closest('span') || btnSlider.parentElement;
    wrap.style.position = 'relative';
    wrap.appendChild(ddMenu);

    const placeholders = {
      sl:         '[SLIDER-SL: img/foto1.webp | img/foto2.webp | img/foto3.webp]',
      individual: '[SLIDER: img/foto1.webp | img/foto2.webp | img/foto3.webp]',
      global:     '[SLIDER-GLOBAL: img/foto1.webp | img/foto2.webp | img/foto3.webp]',
      manual:     '[SLIDER: img/foto1.webp::Legenda 1 | img/foto2.webp::Legenda 2 | img/foto3.webp::Legenda 3]',
    };

    btnSlider.addEventListener('click', function(e) {
      e.preventDefault(); e.stopPropagation();
      ddMenu.classList.toggle('open');
    });
    document.addEventListener('click', function() { ddMenu.classList.remove('open'); });
    ddMenu.addEventListener('click', function(e) {
      const opt = e.target.closest('.ql-slider-option');
      if (!opt) return;
      e.stopPropagation();
      const ph = placeholders[opt.dataset.type];
      if (!ph) return;
      const range = quill.getSelection(true);
      quill.insertText(range.index, ph, 'user');
      quill.setSelection(range.index + ph.length);
      ddMenu.classList.remove('open');
    });
  }

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

  // Não depende do atraso do autosave quando o usuário atualiza a página
  // logo após editar algum campo.
  window.addEventListener('pagehide', salvarRascunho);
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') salvarRascunho();
  });

  // Mantém o acesso durante a sessão atual da aba, sem persistir após fechá-la.
  if (sessionStorage.getItem(LOGIN_SESSION_KEY) === '1') abrirPainel();
});

// ── RASCUNHO (AUTO-SAVE) ──────────────────────
let _saveTimer = null;
let rascunhoRestaurado = false;

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
  rascunhoRestaurado = true;

  // Campos simples
  CAMPOS_SIMPLES.forEach(function ([id, key]) {
    const el = document.getElementById(id);
    if (el && r[key] != null) el.value = r[key];
  });

  // Sincroniza preview do slug-base com a edição restaurada
  onEdicaoChange();

  // A lista da Edição 03 é reconstruída por onEdicaoChange; por isso a
  // matéria escolhida é aplicada somente depois de a lista existir.
  const seletorMateria = document.getElementById('f-materia-checklist');
  if (seletorMateria && r.materiaChecklist) {
    seletorMateria.value = r.materiaChecklist;
    onMateriaChecklistChange();
  }

  // A seleção da matéria preenche título, slug, URL Hero e alt com sugestões
  // padrão. O rascunho, porém, é a fonte de verdade depois de uma recarga.
  // Reaplica os valores salvos sem desfazer a lista recém-montada.
  CAMPOS_SIMPLES.forEach(function ([id, key]) {
    if (id === 'f-edicao' || id === 'f-materia-checklist') return;
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
        '<input type="text" class="cta-link" placeholder="Link" value="' + (cta.link || '').replace(/"/g, '&quot;') + '">' +
        '<button type="button" class="btn-remove" onclick="removerCTA(this)">✕</button>';
      c.appendChild(div);
    });
  }
}

// ── LOGIN ─────────────────────────────────────
function abrirPainel() {
  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('painel').classList.remove('hidden');
  onEdicaoChange();
  renderChecklist();
  const data = document.getElementById('f-data');
  if (!rascunhoRestaurado && data && !data.value) data.valueAsDate = new Date();
}

async function fazerLogin() {
  const input = document.getElementById('senha-input').value;
  const hash  = await sha256(input);
  const ok    = (hash === SENHA_HASH);
  if (ok) {
    sessionStorage.setItem(LOGIN_SESSION_KEY, '1');
    abrirPainel();
  } else {
    document.getElementById('login-error').classList.add('show');
    document.getElementById('senha-input').value = '';
    document.getElementById('senha-input').focus();
  }
}

function sair() {
  sessionStorage.removeItem(LOGIN_SESSION_KEY);
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

// ── EDIÇÃO ──────────────────────────────────
function onEdicaoChange() {
  const edicao = getCurrentEdicao();
  const base = document.getElementById('slug-base');
  if (base) base.textContent = 'bnibusiness.com.br/' + edicao + '/';
  const navLabel = document.getElementById('nav-checklist-label');
  if (navLabel) navLabel.textContent = 'Checklist Edição ' + edicaoNumero(edicao);
  atualizarSeletorMateriaChecklist();
  renderChecklist();
}

// Para a Edição 03, a matéria é escolhida diretamente do checklist.
// Isso mantém seção, título e slug sincronizados, inclusive nas retrancas repetidas.
function atualizarSeletorMateriaChecklist() {
  const seletorMateria = document.getElementById('f-materia-checklist');
  const wrapMateria = document.getElementById('edicao-03-materia-wrap');
  const seletorSecao = document.getElementById('f-secao');
  if (!seletorMateria || !wrapMateria || !seletorSecao) return;

  const grupoAnterior = document.getElementById('secoes-edicao-03');
  if (grupoAnterior) grupoAnterior.remove();

  const ehEdicao03 = getCurrentEdicao() === 'edicao-03';
  wrapMateria.hidden = !ehEdicao03;
  seletorSecao.disabled = ehEdicao03;

  if (!ehEdicao03) {
    seletorMateria.innerHTML = '<option value="">Selecione a matéria...</option>';
    return;
  }

  const materias = MATERIAS_POR_EDICAO['edicao-03'] || [];
  const grupo = document.createElement('optgroup');
  grupo.id = 'secoes-edicao-03';
  grupo.label = 'Edição 03';
  materias.forEach(function (materia) {
    const chave = 'ed3-' + materia.num;
    SECAO_MAP[chave] = { label: materia.secao, slug: materia.slug };
    const option = document.createElement('option');
    option.value = chave;
    option.textContent = materia.secao + ' — ' + materia.titulo;
    grupo.appendChild(option);
  });
  seletorSecao.appendChild(grupo);

  seletorMateria.innerHTML = '<option value="">Selecione a matéria...</option>';
  materias.forEach(function (materia) {
    const option = document.createElement('option');
    option.value = materia.slug;
    option.textContent = String(materia.num).padStart(2, '0') + ' — ' + materia.secao + ': ' + materia.titulo;
    seletorMateria.appendChild(option);
  });
}

function onMateriaChecklistChange() {
  const slug = document.getElementById('f-materia-checklist').value;
  const materia = (MATERIAS_POR_EDICAO['edicao-03'] || []).find(function (item) {
    return item.slug === slug;
  });
  if (!materia) { agendarSalvamento(); return; }

  document.getElementById('f-secao').value = 'ed3-' + materia.num;
  document.getElementById('f-titulo').value = materia.titulo;
  onSecaoChange();
  agendarSalvamento();
}

// ── SLUG + IMAGEM + ALT AUTOMÁTICOS ──────────
function onSecaoChange() {
  const key  = document.getElementById('f-secao').value;
  const hint = document.getElementById('slug-hint');
  if (!key || !SECAO_MAP[key]) { hint.textContent = ''; return; }

  const { slug, label } = SECAO_MAP[key];
  const statusSalvo = JSON.parse(localStorage.getItem('bni-status') || '{}');
  const materia     = getMateriasAtuais().find(m => m.slug === slug);

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
    <input type="text" class="cta-link" placeholder="Link (ex: https://wa.me/5511...)">
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
  const seletorMateria = document.getElementById('f-materia-checklist');
  if (seletorMateria) seletorMateria.value = '';
  document.getElementById('card-status').style.display  = 'none';
  document.getElementById('card-preview').style.display = 'none';
  localStorage.removeItem(RASCUNHO_KEY);
}

function val(id) { return (document.getElementById(id)?.value || '').trim(); }

// Marcadores no texto recebem somente o nome do arquivo. Aceita "img/arquivo"
// como compatibilidade, mas sempre gera o caminho final dentro de /img/.
function normalizarArquivoImagem(arquivo) {
  return String(arquivo || '').trim().replace(/^\/?img\//i, '').replace(/^\/+/, '');
}

// ── GERAR MATÉRIA ─────────────────────────────
async function gerarMateria() {
  const apiKey = val('f-api-key');
  if (!apiKey) { alert('Informe a chave da API Claude.'); return; }

  const secaoVal = val('f-secao');
  const slugAtual = val('f-slug');
  const slugChecklist = val('f-materia-checklist') || slugAtual;
  const materiaChecklist = (MATERIAS_POR_EDICAO['edicao-03'] || []).find(function (materia) {
    return materia.slug === slugChecklist;
  });
  const secaoLabel = (secaoVal && SECAO_MAP[secaoVal] ? SECAO_MAP[secaoVal].label : secaoVal) || (materiaChecklist ? materiaChecklist.secao : '');

  const dados = {
    secao:       secaoLabel,
    olho:        val('f-olho'),
    titulo:      val('f-titulo'),
    slug:        val('f-slug'),
    empresa:     val('f-empresa'),
    profissional: val('f-profissional'),
    autor:       val('f-autor'),
    data:        val('f-data'),
    imagemUrl:   val('f-imagem-url') || `/${getCurrentEdicao()}/${val('f-slug')}/hero.jpg`,
    imagemAlt:   val('f-imagem-alt'),
    texto:       quill ? quill.root.innerHTML : '',
    ctas:        getCTAs(),
  };

  if (!dados.titulo || !dados.slug || !dados.texto) {
    alert('Preencha pelo menos: Título, Slug e Texto base.');
    return;
  }

  if (dados.ctas.length === 0) {
    if (!confirm('Nenhum CTA foi adicionado.\n\nA seção de contato terá apenas o texto da IA, sem botões de WhatsApp/Site/etc.\n\nContinuar mesmo assim?')) return;
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
function escaparHtml(texto) {
  return String(texto || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function montarCorpoArtigo(d, legendas) {
  legendas = legendas || {};
  var tmp = document.createElement('div');
  tmp.innerHTML = d.texto || '';

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
  var sliderGlobalIdx = 0;
  var children = tmp.children;
  for (var c = 0; c < children.length; c++) {
    var el   = children[c];
    var tag  = el.tagName ? el.tagName.toLowerCase() : '';
    if (!tag) continue;
    if (ehVazio(el)) continue;                           // ← filtra &nbsp; e <br> vazios
    var text = el.textContent.replace(/\u00a0/g, ' ').trim();
    // Formato compacto: [1COL][IMG: arquivo.webp][/1COL]
    // Crédito opcional: [1COL][IMG: arquivo.webp][CRÉDITO: Nome][/1COL]
    var imgOneColMatch = text.match(/^\[1COL\]\s*\[IMG:\s*([^\]]+)\]\s*(?:\[CR[ÉE]DITO:\s*([^\]]+)\]\s*)?\[\/1COL\]$/i);
    if (imgOneColMatch) {
      tokens.push({ type: 'img-one-col', file: imgOneColMatch[1].trim(), credit: (imgOneColMatch[2] || '').trim() });
      continue;
    }
    if (/^\[1COL\]$/i.test(text)) {
      tokens.push({ type: 'one-col-open' });
      continue;
    }
    if (/^\[\/1COL\]$/i.test(text)) {
      tokens.push({ type: 'one-col-close' });
      continue;
    }
    var imgMatch = text.match(/^\[IMG:\s*([^\]]+)\]$/);
    if (imgMatch) {
      tokens.push({ type: 'img', file: imgMatch[1].trim() });
      continue;
    }
    var creditoMatch = text.match(/^\[CR[ÉE]DITO:\s*([^\]]+)\]$/i);
    if (creditoMatch) {
      tokens.push({ type: 'credit', value: creditoMatch[1].trim() });
      continue;
    }
    // Legenda editorial manual da imagem imediatamente anterior.
    // Ela tem prioridade sobre a legenda sugerida pela IA.
    var legendaMatch = text.match(/^\[LEGENDA:\s*([^\]]+)\]$/i);
    if (legendaMatch) {
      tokens.push({ type: 'caption', value: legendaMatch[1].trim() });
      continue;
    }
    // Permite legendas editoriais longas, quebradas em mais de um parágrafo
    // pelo Quill. A normalização abaixo reúne o conteúdo até o ] final.
    var legendaInicioMatch = text.match(/^\[LEGENDA:\s*(.*)$/i);
    if (legendaInicioMatch) {
      tokens.push({ type: 'caption-start', value: legendaInicioMatch[1].trim() });
      continue;
    }
    var sliderMatch = text.match(/^\[SLIDER:\s*([^\]]+)\]$/);
    if (sliderMatch) {
      tokens.push({ type: 'slider', raw: sliderMatch[1].trim() });
      continue;
    }
    var sliderSlMatch = text.match(/^\[SLIDER-SL:\s*([^\]]+)\]$/);
    if (sliderSlMatch) {
      tokens.push({ type: 'slider-sl', raw: sliderSlMatch[1].trim() });
      continue;
    }
    var sliderGlobalMatch = text.match(/^\[SLIDER-GLOBAL:\s*([^\]]+)\]$/);
    if (sliderGlobalMatch) {
      tokens.push({ type: 'slider-global', raw: sliderGlobalMatch[1].trim(), idx: sliderGlobalIdx++ });
      continue;
    }
    if ((tag === 'p' || tag === 'ul' || tag === 'ol') && !text) continue;
    if      (tag === 'h2')         tokens.push({ type: 'h2',    inner: el.innerHTML });
    else if (tag === 'h3')         tokens.push({ type: 'h3',    inner: el.innerHTML });
    else if (tag === 'blockquote') tokens.push({ type: 'quote', inner: el.innerHTML });
    else                           tokens.push({ type: 'para',  html:  el.outerHTML });
  }

  // Une uma [LEGENDA:] que foi dividida pelo editor em vários parágrafos.
  // Assim a legenda continua sendo aplicada à imagem anterior, mesmo quando
  // contém nomes, destaque em negrito ou uma quebra de linha.
  var tokensComLegenda = [];
  for (var lt = 0; lt < tokens.length; lt++) {
    if (tokens[lt].type !== 'caption-start') {
      tokensComLegenda.push(tokens[lt]);
      continue;
    }
    var partesLegenda = [tokens[lt].value];
    var fechouLegenda = /\]$/.test(tokens[lt].value);
    var li = lt + 1;
    while (!fechouLegenda && li < tokens.length && tokens[li].type === 'para') {
      var textoLegenda = document.createElement('div');
      textoLegenda.innerHTML = tokens[li].html;
      var trecho = textoLegenda.textContent.replace(/\u00a0/g, ' ').trim();
      partesLegenda.push(trecho);
      fechouLegenda = /\]$/.test(trecho);
      li++;
    }
    if (fechouLegenda) {
      var legendaCompleta = partesLegenda.join(' ').replace(/\]\s*$/, '').trim();
      tokensComLegenda.push({ type: 'caption', value: legendaCompleta });
      lt = li - 1;
    } else {
      // Marcador incompleto não deve consumir o texto editorial seguinte.
      tokensComLegenda.push({ type: 'para', html: '<p>' + escaparHtml('[LEGENDA: ' + tokens[lt].value) + '</p>' });
    }
  }
  tokens = tokensComLegenda;

  // Um bloco [1COL] envolve uma seção editorial inteira. A regra especial
  // fica confinada entre as tags e nunca altera as demais seções.
  var tokensNormalizados = [];
  for (var t = 0; t < tokens.length; t++) {
    if (tokens[t].type !== 'one-col-open') {
      tokensNormalizados.push(tokens[t]);
      continue;
    }
    var fim = t + 1;
    while (fim < tokens.length && tokens[fim].type !== 'one-col-close') fim++;
    if (fim < tokens.length) {
      tokensNormalizados.push({ type: 'one-col-block', items: tokens.slice(t + 1, fim) });
      t = fim;
    }
  }
  tokens = tokensNormalizados;

  // ── textoDuplo ─────────────────────────────────────────────
  // Recebe TODOS os parágrafos da seção de uma vez.
  // O ponto de corte é escolhido por massa de caracteres: encontra
  // o índice i (1 ≤ i < n) onde a soma acumulada de chars fica mais
  // próxima de 50% do total — sempre na fronteira entre parágrafos,
  // preservando a ordem de leitura e sem viúvas/forcas.
  // Chamada UMA ÚNICA vez por seção — nunca em pares.
  function textoDuplo(paras, extraCls) {
    var n = paras.length;
    var mid;
    if (n <= 2) {
      mid = Math.ceil(n / 2);
    } else {
      var total = 0;
      for (var k = 0; k < n; k++) total += paras[k].html.length;
      var target = total / 2;
      var best = 1, bestDiff = Infinity, cum = 0;
      for (var k = 0; k < n - 1; k++) {
        cum += paras[k].html.length;
        var diff = Math.abs(cum - target);
        if (diff < bestDiff) { bestDiff = diff; best = k + 1; }
      }
      mid = best;
    }
    var L = '', R = '';
    for (var k = 0; k < mid; k++) L += paras[k].html;
    for (var k = mid; k < n; k++) R += paras[k].html;
    var cls = 'texto-duplo' + (extraCls ? ' ' + extraCls : '');
    return '<div class="' + cls + '"><div>' + L + '</div><div>' + R + '</div></div>';
  }

  function imgHtml(tk, credito, umaColuna, legendaManual) {
    var file = normalizarArquivoImagem(tk.file);
    var dadosImagem = legendaDaImagem(file);
    var alt = dadosImagem.alt || dadosImagem.legenda || '';
    var cap = legendaManual || dadosImagem.legenda || alt;
    var altSeguro = escaparHtml(alt);
    var capSeguro = escaparHtml(cap);
    var src = '/' + getCurrentEdicao() + '/' + (d.slug || 'materia') + '/img/' + file;
    var imagemHtml = '<img src="' + src + '" alt="' + altSeguro + '" loading="lazy">';
    if (credito) {
      imagemHtml = '<div class="foto-larga__moldura">' + imagemHtml +
        '<span class="foto-credito">Foto: ' + escaparHtml(credito) + '</span></div>';
    }
    return '<figure class="foto-larga fade-in' + (credito ? ' foto-larga--com-credito' : '') + (umaColuna ? ' foto-larga--uma-coluna' : '') + '">' + imagemHtml +
           (cap ? '<figcaption>' + capSeguro + '</figcaption>' : '') + '</figure>';
  }

  function blocoUmaColunaHtml(items) {
    var titulo = '', corpo = '';
    for (var b = 0; b < items.length; b++) {
      var item = items[b];
      if ((item.type === 'h2' || item.type === 'h3') && !titulo) {
        titulo = '<' + item.type + ' class="secao-titulo">' + item.inner + '</' + item.type + '>';
      } else if (item.type === 'para') {
        corpo += item.html;
      } else if (item.type === 'img') {
        var proximo = b + 1;
        var legendaManual = (items[proximo] && items[proximo].type === 'caption') ? items[proximo++].value : '';
        var credito = (items[proximo] && items[proximo].type === 'credit') ? items[proximo++].value : '';
        corpo += imgHtml(item, credito, true, legendaManual);
        b = proximo - 1;
      } else if (item.type === 'quote') {
        corpo += '<div class="citacao-bloco"><blockquote>' + item.inner + '</blockquote></div>';
      }
    }
    // Mesmo se o subtítulo for incluído por engano entre as tags, ele é
    // retirado do fluxo de colunas e permanece em largura total.
    return '<div class="bloco-uma-coluna-grupo fade-in">' + titulo +
      '<section class="bloco-uma-coluna">' + corpo + '</section></div>';
  }

  function legendaDaImagem(file) {
    var dado = legendas[file];
    if (dado && typeof dado === 'object') return dado;
    return { alt: dado || '', legenda: dado || '' };
  }

  function sliderHtml(tk) {
    var parts = tk.raw.split('|').map(function(s) { return s.trim(); }).filter(Boolean);
    var baseSlug = d.slug || 'materia';
    var id = 'sl' + Date.now().toString(36);

    var slidesHtml = parts.map(function(p, idx) {
      var m = p.match(/^(.+?)::(.*)$/);
      var file = normalizarArquivoImagem(m ? m[1].trim() : p);
      var dadosImagem = legendaDaImagem(file);
      var cap = '';
      if (tk.type === 'slider') {
        // individual: legenda manual (::) tem prioridade, senão usa IA
        cap = (m && m[2].trim()) ? m[2].trim() : (dadosImagem.legenda || '');
      }
      var alt = (m && m[2].trim()) ? m[2].trim() : (dadosImagem.alt || cap);
      var altSeguro = escaparHtml(alt);
      var capSeguro = escaparHtml(cap);
      // slider-sl: sem legenda
      // slider-global: legenda fica no rodapé, não por foto
      var src = '/' + getCurrentEdicao() + '/' + baseSlug + '/img/' + file;
      return '<figure class="slider-slide' + (idx === 0 ? ' active' : '') + '">' +
             '<img src="' + src + '" alt="' + altSeguro + '" loading="lazy">' +
             (cap ? '<figcaption>' + capSeguro + '</figcaption>' : '') + '</figure>';
    }).join('');

    var dotsHtml = parts.map(function(_, idx) {
      return '<button class="slider-dot' + (idx === 0 ? ' active' : '') + '" data-idx="' + idx + '" aria-label="Slide ' + (idx + 1) + '"></button>';
    }).join('');

    // Legenda global: gerada pela IA para slider-global
    var gc = tk.type === 'slider-global' ? (legendas['__sg-' + tk.idx + '__'] || '') : '';
    var gcHtml = gc ? '<p class="slider-caption-global">' + escaparHtml(gc) + '</p>' : '';

    var nav = parts.length > 1
      ? '<button class="slider-prev" aria-label="Anterior">&#8592;</button>' +
        '<button class="slider-next" aria-label="Próximo">&#8594;</button>' +
        '<div class="slider-dots">' + dotsHtml + '</div>'
      : '';

    return '<div class="foto-slider fade-in" id="' + id + '">' +
           '<div class="slider-track">' + slidesHtml + '</div>' +
           nav + gcHtml + '</div>';
  }

  // Predicado: inicia nova seção (interrompe coleta de parágrafos)
  function isBreak(type) {
    return type === 'h2' || type === 'h3' || type === 'img' || type === 'img-one-col' || type === 'credit' || type === 'caption' || type === 'one-col-block' ||
           type === 'one-col-open' || type === 'one-col-close' ||
           type === 'slider' || type === 'slider-sl' || type === 'slider-global';
  }

  // ── Loop principal ──────────────────────────────────────────
  var out = [];
  var i   = 0;
  var n   = tokens.length;

  while (i < n) {
    var tk = tokens[i];

    if (tk.type === 'one-col-block') {
      out.push(blocoUmaColunaHtml(tk.items));
      i++;
      continue;
    }

    // — Imagem em uma coluna: [1COL] + [IMG] + crédito opcional + [/1COL] —
    if (tk.type === 'one-col-open' && i + 2 < n && tokens[i + 1].type === 'img') {
      var oneColImg = tokens[i + 1];
      var nextIndex = i + 2;
      var oneColCredito = '';
      if (tokens[nextIndex] && tokens[nextIndex].type === 'credit') {
        oneColCredito = tokens[nextIndex].value;
        nextIndex++;
      }
      if (tokens[nextIndex] && tokens[nextIndex].type === 'one-col-close') {
        out.push(imgHtml(oneColImg, oneColCredito, true));
        i = nextIndex + 1;
        continue;
      }
    }

    // Tags de coluna isoladas ou malformadas não aparecem no artigo.
    if (tk.type === 'one-col-open' || tk.type === 'one-col-close') {
      i++;
      continue;
    }

    // — Imagem standalone —
    if (tk.type === 'img' || tk.type === 'img-one-col') {
      var afterImage = i + 1;
      var legendaManual = (tokens[afterImage] && tokens[afterImage].type === 'caption') ? tokens[afterImage++].value : '';
      var credito = tk.credit || ((tokens[afterImage] && tokens[afterImage].type === 'credit') ? tokens[afterImage].value : '');
      if (!tk.credit && credito) afterImage++;

      // Uma imagem em 1COL divide a mesma linha com o próximo parágrafo.
      // Assim, ela não cria uma área vazia nem interrompe a leitura em duas colunas.
      if (tk.type === 'img-one-col' && tokens[afterImage] && tokens[afterImage].type === 'para') {
        // Se o texto anterior ocupou apenas a coluna esquerda, a tag completa
        // exclusivamente essa linha: imagem e parágrafo seguinte ficam à direita.
        // Nenhum bloco de texto comum tem seu comportamento alterado.
        var ultimo = out.length - 1;
        var fimColunaVazia = '</div><div></div></div>';
        if (ultimo >= 0 && out[ultimo].endsWith(fimColunaVazia)) {
          out[ultimo] = out[ultimo].slice(0, -fimColunaVazia.length) +
            '</div><div>' + imgHtml(tk, credito, true, legendaManual) + tokens[afterImage].html + '</div></div>';
          i = afterImage + 1;
          continue;
        }
        out.push('<div class="texto-duplo texto-duplo--imagem-coluna fade-in"><div>' +
          imgHtml(tk, credito, true, legendaManual) + '</div><div>' + tokens[afterImage].html + '</div></div>');
        i = afterImage + 1;
        continue;
      }

      out.push(imgHtml(tk, credito, tk.type === 'img-one-col', legendaManual));
      i = afterImage;
      continue;
    }

    // Crédito sem imagem imediatamente anterior: ignora para não exibir a tag bruta.
    if (tk.type === 'credit') {
      i++;
      continue;
    }

    // Legenda sem imagem imediatamente anterior: não vaza como texto na matéria.
    if (tk.type === 'caption') {
      i++;
      continue;
    }

    // — Slider (todas as variantes) —
    if (tk.type === 'slider' || tk.type === 'slider-sl' || tk.type === 'slider-global') {
      out.push(sliderHtml(tk));
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
      var headTag = tk.type;
      var headCls = tk.type === 'h2' ? 'secao-titulo' : 'secao-subtitulo';
      i++;
      var tituloAntesDeBlocoUmaColuna = tokens[i] && tokens[i].type === 'one-col-block';
      var block = '<div class="fade-in' + (tituloAntesDeBlocoUmaColuna ? ' bloco-uma-coluna-titulo' : '') + '"><' + headTag + ' class="' + headCls + '">' + tk.inner + '</' + headTag + '>';
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
function montarCTASection(d, ctaCopy) {
  // Sem CTAs E sem copy da IA → seção é descartada (comportamento original)
  if (!d.ctas.length && !ctaCopy) return '';
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
  const nome = d.profissional || d.empresa || 'a empresa';
  const labelPorTipo = {
    whatsapp:  'Falar com ' + nome,
    site:      'Visitar o site',
    instagram: 'Siga no Instagram',
    linkedin:  'LinkedIn',
    email:     'Enviar e-mail',
    youtube:   'YouTube',
    outro:     'Saiba mais',
  };
  const botoes = d.ctas.map(c => {
    const cls = tipoParaClasse(c.tipo);
    const label = labelPorTipo[cls] || c.tipo;
    return '      <a class="cta-btn cta-btn--' + cls + '" href="' + c.link + '" target="_blank" rel="noopener">' + (icones[cls] || icones.outro) + ' ' + label + '</a>';
  }).join('\n');
  const ctaH3 = (ctaCopy && ctaCopy.h3) ? ctaCopy.h3 : ('Entre em contato com ' + (d.empresa || d.profissional || 'a empresa'));
  const ctaP  = (ctaCopy && ctaCopy.p)  ? '\n      <p>' + ctaCopy.p + '</p>' : '';
  // Botões só aparecem se houver CTAs cadastrados; senão renderiza só o texto
  const botoesDiv = botoes
    ? '\n    <div class="cta-botoes">\n' + botoes + '\n    </div>'
    : '';
  return '<section class="cta-section">\n  <div class="cta-inner">\n    <div class="cta-texto">\n      <h3>' + ctaH3 + '</h3>' + ctaP + '\n    </div>' + botoesDiv + '\n  </div>\n</section>';
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
<meta property="og:image" content="https://bnibusiness.com.br/%%EDICAO%%/%%SLUG%%/img/og-cover.webp">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:url" content="https://bnibusiness.com.br/%%EDICAO%%/%%SLUG%%/">
<meta property="og:locale" content="pt_BR">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="author" content="%%AUTOR%%">
<meta property="article:section" content="%%SECAO%%">
%%ARTICLE_TAGS%%
<meta property="article:author" content="%%AUTOR%%">
<meta property="article:published_time" content="%%DATA_ISO%%">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="%%TITULO_SEO%% | BNI">
<meta name="twitter:description" content="%%SEO_DESC%%">
<meta name="twitter:image" content="https://bnibusiness.com.br/%%EDICAO%%/%%SLUG%%/img/og-cover.webp">
<link rel="sitemap" type="application/xml" title="Sitemap" href="https://bnibusiness.com.br/sitemap.xml">
<link rel="canonical" href="https://bnibusiness.com.br/%%EDICAO%%/%%SLUG%%/">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Barlow+Condensed:wght@300;400;500;600&family=Barlow:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/css/materia.css?v=11">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "%%TITULO_SEO%%",
  "description": "%%SEO_DESC%%",
  "image": "https://bnibusiness.com.br/%%EDICAO%%/%%SLUG%%/img/og-cover.webp",
  "author": {"@type": "Person", "name": "%%AUTOR%%"},
  "publisher": {"@type": "Organization", "name": "Revista BNI Business", "url": "https://bnibusiness.com.br", "logo": {"@type": "ImageObject", "url": "https://bnibusiness.com.br/assets/img/logo.svg", "width": 600, "height": 60}},
  "datePublished": "%%DATA_ISO%%",
  "mainEntityOfPage": "https://bnibusiness.com.br/%%EDICAO%%/%%SLUG%%/",
  "articleSection": "%%SECAO%%",
  "inLanguage": "pt-BR"
}
</script>
<script src="../../nav.js?v=2026050902" defer></script>
  <script src="../../footer.js?v=2026050813" defer></script>  </head>
<body>
<div class="reading-circle" id="readingCircle">
  <svg viewBox="0 0 72 72">
    <circle class="reading-circle-bg" cx="36" cy="36" r="32"/>
    <circle class="reading-circle-prog" id="circleProgress" cx="36" cy="36" r="32"/>
  </svg>
  <div class="reading-circle-inner" id="circleInner">
    <span class="reading-circle-mins" id="circleMins">%%TOTAL_MINS%%</span>
    <span class="reading-circle-label" id="circleLabel">min</span>
  </div>
</div>

<!-- COMPARTILHAMENTO LATERAL (desktop) -->
<div class="share-sidebar" id="shareSidebar">
  <a class="share-btn share-btn--whatsapp" href="https://wa.me/?text=%%TITULO_SEO%% — BNI Business%20https://bnibusiness.com.br/%%EDICAO%%/%%SLUG%%" target="_blank" rel="noopener" data-tip="WhatsApp"><svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></a>
  <a class="share-btn share-btn--linkedin" href="https://www.linkedin.com/sharing/share-offsite/?url=https://bnibusiness.com.br/%%EDICAO%%/%%SLUG%%" target="_blank" rel="noopener" data-tip="LinkedIn"><svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>
  <a class="share-btn share-btn--facebook" href="https://www.facebook.com/sharer/sharer.php?u=https://bnibusiness.com.br/%%EDICAO%%/%%SLUG%%" target="_blank" rel="noopener" data-tip="Facebook"><svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
  <button class="share-btn share-btn--copy" onclick="copiarLink()" data-tip="Copiar link" id="copyBtn"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg></button>
</div>

<!-- COMPARTILHAMENTO INFERIOR (mobile) -->
<div class="share-mobile" id="shareMobile">
  <div class="share-mobile-item">
    <a class="share-btn share-btn--whatsapp" href="https://wa.me/?text=%%TITULO_SEO%% — BNI Business%20https://bnibusiness.com.br/%%EDICAO%%/%%SLUG%%" target="_blank" rel="noopener"><svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></a>
    <span class="share-label">WhatsApp</span>
  </div>
  <div class="share-mobile-item">
    <a class="share-btn share-btn--linkedin" href="https://www.linkedin.com/sharing/share-offsite/?url=https://bnibusiness.com.br/%%EDICAO%%/%%SLUG%%" target="_blank" rel="noopener"><svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>
    <span class="share-label">LinkedIn</span>
  </div>
  <div class="share-mobile-item">
    <a class="share-btn share-btn--facebook" href="https://www.facebook.com/sharer/sharer.php?u=https://bnibusiness.com.br/%%EDICAO%%/%%SLUG%%" target="_blank" rel="noopener"><svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
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
      <span class="bl-leitura" id="readingTime">%%TOTAL_MINS%% min de leitura</span>
    </div>

    <h1 class="hero-titulo">%%TITULO_HTML%%</h1>

    <p class="hero-chapeu">%%OLHO%%</p>

    <div class="hero-assina">Por <span>%%AUTOR%%</span></div>
  </div>
</section>

<div class="divisor"></div>

<!-- ARTIGO PRINCIPAL -->
<main class="artigo" data-reading-mins="%%TOTAL_MINS%%">
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
  

<script src="/assets/js/materia.js?v=2026051201" defer></script>
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
  const imagemAlt  = (parts.alt_hero || '').trim() || d.imagemAlt || '';

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
  let ctaCopy = null;
  if (parts.cta) {
    const ctaLines = parts.cta.split('\n').map(l => l.trim()).filter(Boolean);
    const limparLinhaCTA = linha => linha.replace(/^\[LINHA\s*[12][^\]]*\]\s*/i, '').trim();
    if (ctaLines.length >= 1) ctaCopy = { h3: limparLinhaCTA(ctaLines[0]), p: limparLinhaCTA(ctaLines[1] || '') };
  }
  const ctaHtml    = montarCTASection(d, ctaCopy);

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
  R('%%IMAGEM_URL%%',   d.imagemUrl || ('/' + getCurrentEdicao() + '/' + slug + '/hero.jpg'));
  R('%%EDICAO%%',       getCurrentEdicao());
  R('%%IMAGEM_ALT%%',   escaparHtml(imagemAlt));
  R('%%PROFISSIONAL%%', d.profissional || d.empresa || '');
  R('%%CAPTION%%',      caption);
  R('%%TITULO_HTML%%',  heroTitulo);
  R('%%OLHO%%',         d.olho || '');
  R('%%ARTIGO%%',       artigo);
  R('%%CTA_SECTION%%',  ctaHtml);
  R('%%TOTAL_MINS%%',   String(totalMins));

  // Gera <meta property="article:tag"> a partir das tags retornadas pela IA.
  // Se a IA não retornou tags, não gera nenhuma meta tag (sem fallback hardcoded).
  var articleTagsHtml = '';
  if (parts.tags) {
    var tagsArr = parts.tags.split(',').map(function (t) { return t.trim(); }).filter(Boolean);
    if (tagsArr.length > 0) {
      articleTagsHtml = tagsArr.map(function (t) {
        return '<meta property="article:tag" content="' + t + '">';
      }).join('\n');
    }
  }
  R('%%ARTICLE_TAGS%%', articleTagsHtml);

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
  const sections = ['SEO', 'TITULO', 'CAPTION', 'ALT_HERO', 'TAGS', 'CTA'];
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

  // Extrai ==IMAGEM:arquivo.webp== ALT + LEGENDA ==FIM==
  const legendas = {};
  const imagemRe = /==IMAGEM:([^=\n]+)==\s*ALT:\s*([\s\S]*?)\s*LEGENDA:\s*([\s\S]*?)\s*==FIM==/g;
  let m;
  while ((m = imagemRe.exec(text)) !== null) {
    legendas[m[1].trim()] = { alt: m[2].trim(), legenda: m[3].trim() };
  }

  // Formato anterior: mantém compatibilidade com respostas já geradas.
  const legendaRe = /==LEGENDA:([^=\n]+)==([\s\S]*?)==FIM==/g;
  while ((m = legendaRe.exec(text)) !== null) {
    if (!legendas[m[1].trim()]) {
      legendas[m[1].trim()] = { alt: m[2].trim(), legenda: m[2].trim() };
    }
  }
  // Extrai ==LEGENDA-SLIDER-GLOBAL:N== texto ==FIM==
  const sgRe = /==LEGENDA-SLIDER-GLOBAL:(\d+)==([\s\S]*?)==FIM==/g;
  while ((m = sgRe.exec(text)) !== null) {
    legendas['__sg-' + m[1].trim() + '__'] = m[2].trim();
  }
  parts.legendas = legendas;

  return parts;
}

// Extrai a lista de arquivos de imagem que precisam de legenda IA,
// na mesma ordem em que aparecem no texto. Usado tanto pelo prompt
// quanto pelo carregamento das imagens via Vision.
function extrairArquivosImagem(textoPlano) {
  const imgs = [];
  // [IMG: arquivo.webp]
  [...textoPlano.matchAll(/\[IMG:\s*([^\]]+)\]/g)].forEach(m => imgs.push(normalizarArquivoImagem(m[1])));
  // [SLIDER: ...] — só fotos SEM "::" (manual tem prioridade)
  [...textoPlano.matchAll(/\[SLIDER:\s*([^\]]+)\]/g)].forEach(m => {
    m[1].split('|').forEach(part => {
      const t = part.trim();
      if (t && t.indexOf('::') === -1) imgs.push(normalizarArquivoImagem(t));
    });
  });
  // [SLIDER-GLOBAL: ...] — todas as fotos contam (uma legenda global)
  [...textoPlano.matchAll(/\[SLIDER-GLOBAL:\s*([^\]]+)\]/g)].forEach(m => {
    m[1].split('|').forEach(part => {
      const t = part.trim();
      if (t) imgs.push(normalizarArquivoImagem(t));
    });
  });
  return [...new Set(imgs)];
}

// Baixa uma imagem do raw.githubusercontent.com e devolve em base64
// pra ser injetada como input multimodal no request à Claude API.
async function fetchImagemBase64(edicao, slug, arquivo) {
  arquivo = normalizarArquivoImagem(arquivo);
  const url = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/${edicao}/${slug}/img/${arquivo}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`imagem nao encontrada no GitHub: ${arquivo} (HTTP ${res.status})`);
  const blob = await res.blob();
  const mediaType = blob.type && blob.type.startsWith('image/') ? blob.type : 'image/webp';
  const base64 = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.onerror = () => reject(new Error('falha ao ler imagem em base64'));
    reader.readAsDataURL(blob);
  });
  return { mediaType, base64 };
}

async function chamarClaudeAPI(apiKey, dados) {
  const edicao = getCurrentEdicao();
  const textoPlano = (dados.texto || '').replace(/<[^>]+>/g, ' ');
  const arquivoHero = normalizarArquivoImagem(dados.imagemUrl || '');
  const arquivos = [...new Set([
    ...(arquivoHero ? [arquivoHero] : []),
    ...extrairArquivosImagem(textoPlano),
  ])];

  // Carrega hero e imagens do corpo em base64 (em paralelo) pra mandar via Vision.
  // Se alguma falhar (ex: ainda nao versionada no Git), avisa no log
  // e segue com as demais — a IA gera legenda sem ver essa especifica.
  const blocosImagem = [];
  if (arquivos.length > 0) {
    addLog(`Carregando ${arquivos.length} imagem(ns) do GitHub raw...`, 'loading');
    const resultados = await Promise.allSettled(
      arquivos.map(a => fetchImagemBase64(edicao, dados.slug, a))
    );
    resultados.forEach((r, i) => {
      const arquivo = arquivos[i];
      if (r.status === 'fulfilled') {
        blocosImagem.push({ type: 'text', text: `Imagem [${arquivo}]:` });
        blocosImagem.push({
          type: 'image',
          source: { type: 'base64', media_type: r.value.mediaType, data: r.value.base64 }
        });
      } else {
        addLog(`Aviso: ${r.reason.message} — legenda de ${arquivo} sera gerada sem visao`, 'erro');
      }
    });
  }

  const content = [...blocosImagem, { type: 'text', text: montarPrompt(dados) }];

  const response = await fetch('/painel/proxy.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      messages: [{ role: 'user', content }],
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

  // Detecta imagens no texto para geração de legendas pela IA
  const textoPlano = (d.texto || '').replace(/<[^>]+>/g, ' ');

  // [IMG: arquivo.webp] → sempre gera legenda
  const imgMatches = [...textoPlano.matchAll(/\[IMG:\s*([^\]]+)\]/g)].map(m => normalizarArquivoImagem(m[1]));

  // [SLIDER: ...] → gera legenda individual apenas para fotos SEM "::" (manual)
  const sliderIndividualImgs = [];
  [...textoPlano.matchAll(/\[SLIDER:\s*([^\]]+)\]/g)].forEach(function(m) {
    m[1].split('|').forEach(function(part) {
      var t = part.trim();
      if (t.indexOf('::') === -1) sliderIndividualImgs.push(normalizarArquivoImagem(t));
    });
  });

  // [SLIDER-GLOBAL: ...] → IA gera UMA legenda para o conjunto (marcador especial abaixo)
  const sliderGlobalList = [...textoPlano.matchAll(/\[SLIDER-GLOBAL:\s*([^\]]+)\]/g)];

  // [SLIDER-SL: ...] → sem legenda, IA não gera nada

  const uniqueImgs = [...new Set([...imgMatches, ...sliderIndividualImgs])];

  let legendaBloco = '';
  if (uniqueImgs.length > 0) {
    legendaBloco = '\n\nAs ' + uniqueImgs.length + ' imagem(ns) foram anexadas acima nesta mensagem, cada uma precedida pelo marcador "Imagem [nome.webp]:". Para cada uma, gere DOIS textos distintos. ALT: descricao literal e objetiva da imagem para acessibilidade. LEGENDA: frase editorial que acrescente contexto e relacione a imagem ao argumento da materia, sem inventar fatos. A legenda nao pode identificar elementos visuais — pessoa, roupa, pose, ambiente, placa, logotipo ou o que a pessoa esta fazendo; isso e funcao exclusiva do ALT. Em vez disso, use uma decisao, consequencia, contraste ou contexto concreto citado no texto. Evite frases-tese genericas e tom publicitario. Ambos devem ter 1 linha e nao terminar com ponto. Formato de saida:\n\n' +
      uniqueImgs.map(f => '==IMAGEM:' + f + '==\nALT: [descricao objetiva]\nLEGENDA: [leitura editorial]\n==FIM==').join('\n\n');
  }

  let sliderGlobalBloco = '';
  if (sliderGlobalList.length > 0) {
    sliderGlobalBloco = '\n\n' + sliderGlobalList.map((_, idx) =>
      '==LEGENDA-SLIDER-GLOBAL:' + idx + '==\n[legenda unica (1 linha, sem ponto final) que descreva o conjunto de fotos deste slider]\n==FIM=='
    ).join('\n\n');
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

=== RETORNE EXATAMENTE NESTE FORMATO ===${legendaBloco}${sliderGlobalBloco}

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
[Legenda narrativa para a foto hero — texto que aparece DEPOIS do nome em negrito. Estilo evocativo, conectado ao conteudo da materia, nunca generico. Referencia real: "de servidor publico ao empreendedor — a trajetoria de quem aprendeu as regras do jogo de dentro para fora". Regras: 1 linha, sem ponto final, sem repetir o nome da pessoa. Como o nome ja vem imediatamente antes, a legenda deve começar com verbo ou locucao verbal que complete a frase (ex.: "transformou...", "construiu...", "encontra..."); NUNCA comece com "de quem", "de", "para quem" ou outra construcao que deixe a frase incompleta. Nao use formulas genericas ("especialista em", "profissional com X anos") ou afirmacoes absolutas/nao verificaveis ("nenhum concorrente", "o melhor", "unico") — use uma perspectiva, contraste ou conquista especifica extraida do texto da materia.]

==ALT_HERO==
[Descreva a imagem hero anexada em até 125 caracteres. Baseie-se exclusivamente no que ela mostra. Seja objetivo e específico; não comece com "imagem de" e não invente tempo de experiência, cargos, locais ou fatos não visíveis]

==TAGS==
[entre 3 e 5 tags de SEO para esta materia, separadas por virgula. REGRAS: (1) portugues sem acentos; (2) tudo em minusculo; (3) foco em palavras que pessoas buscam no Google; (4) incluir 1 tag especifica do tema (ex: "outsourcing de impressao", "esclerose lateral amiotrofica"), 1 tag tematica ampla (ex: "empreendedorismo", "saude"), e obrigatoriamente a tag "bni"; (5) evitar genericos sem contexto ("negocios", "sucesso"). Ex para JRT Print: outsourcing de impressao, networking empresarial, bni osasco, empreendedorismo, bni]
${d.ctas.length > 0 ? `
==CTA==
[LINHA 1 — titulo h3: personalizado ao conteudo da materia. Use como ponto de partida "Gostou da materia?<br>Entre em contato com [nome da empresa ou profissional]" mas adapte ao contexto. Pode usar <br> para quebra de linha. Exemplo real: "Gostou da materia?<br>Entre em contato com a Redax"]
[LINHA 2 — descricao p: 1 frase curta descrevendo o servico ou produto da empresa, baseada no texto da materia. Sem ponto final opcional. Exemplo real: "Obras publicas e privadas com planejamento, seguranca tecnica e juridica"]` : ''}`;
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
  const marcadorInvalido = /\bundefined\b/i.test(html) || /\[(?:\/?1col|img:|cr[ée]dito:)/i.test(html);
  if (marcadorInvalido) {
    addLog('Erro: o HTML contém um marcador inválido. Gere novamente antes de publicar.', 'error');
    alert('Publicação bloqueada: revise o HTML gerado e gere a matéria novamente.');
    return;
  }

  const edicao = getCurrentEdicao();
  const caminho = `${edicao}/${slug}/index.html`;
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
        message: `feat: matéria ${slug} — Edição ${edicaoNumero(edicao)}`,
        content: btoa(unescape(encodeURIComponent(html))),
        ...(sha ? { sha } : {}),
      }),
    });

    if (!res.ok) throw new Error((await res.json().catch(()=>({}))).message || `HTTP ${res.status}`);

    addLog('✓ Publicado! Deploy em ~30 segundos.', 'ok');
    addLog(`🔗 bnibusiness.com.br/${edicao}/${slug}/`, 'ok');
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

  const materias = getMateriasAtuais();

  if (materias.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:2rem;color:#888;">Nenhuma matéria cadastrada para a edição ' + edicaoNumero(getCurrentEdicao()) + '. Edite MATERIAS_POR_EDICAO em admin.js para popular o checklist desta edição.</td></tr>';
    document.getElementById('progress-bar').style.width = '0%';
    document.getElementById('progress-texto').textContent = '0 / 0 publicadas';
    return;
  }

  materias.forEach(m => {
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

  const pct = Math.round((publicadas / materias.length) * 100);
  document.getElementById('progress-bar').style.width = pct + '%';
  document.getElementById('progress-texto').textContent = `${publicadas} / ${materias.length} publicadas`;
}

function marcarPublicada(slug) {
  const s = JSON.parse(localStorage.getItem('bni-status') || '{}');
  s[slug] = 'publicada';
  localStorage.setItem('bni-status', JSON.stringify(s));
  renderChecklist();
}

// ── EXPOSIÇÃO GLOBAL (chamadas via onclick no HTML) ───
window.onEdicaoChange = onEdicaoChange;
window.onMateriaChecklistChange = onMateriaChecklistChange;
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
