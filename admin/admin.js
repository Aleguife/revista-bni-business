// =============================================
// BNI BUSINESS — ADMIN CMS
// Login | Geração via Claude API | Publicação via GitHub API
// =============================================

// ── SENHA (hash SHA-256) ──────────────────────
// Senha padrão: bni@2025 → troque pelo hash da sua senha
// Para gerar novo hash: https://emn178.github.io/online-tools/sha256.html
const SENHA_HASH = '06bf25716926ca5a67b6cd8c39fbce0e6b2a510033a7047f6d269472b4050821';
// ATENÇÃO: hash acima é placeholder — troque antes de colocar no ar

// ── MATÉRIAS EDIÇÃO 2 ─────────────────────────
const MATERIAS = [
  { num: 1,  secao: 'Eventos',               titulo: 'Cigar Night — Rodrigo Motta',           slug: 'cigar-night',           status: 'publicada' },
  { num: 2,  secao: 'Case de sucesso',        titulo: 'Magna Marinho / ELA',                   slug: 'magna-marinho',         status: 'pendente'  },
  { num: 3,  secao: 'Case de sucesso',        titulo: 'José Roberto Teixeira / JRT Print',     slug: 'jose-roberto-teixeira', status: 'pendente'  },
  { num: 4,  secao: 'Matéria de Capa',        titulo: 'Felipe Xavier / Redax Engenharia',      slug: 'felipe-xavier',         status: 'publicada' },
  { num: 5,  secao: 'Editorial',              titulo: 'O impresso que o digital não substitui',slug: 'o-impresso',            status: 'pendente'  },
  { num: 6,  secao: 'Negócios',              titulo: 'Up Brasil / Mariana Cerone',            slug: 'up-brasil',             status: 'pendente'  },
  { num: 7,  secao: 'Saúde mental',           titulo: 'Tonos / Elisa de Lima',                 slug: 'tonos',                 status: 'pendente'  },
  { num: 8,  secao: 'Direito',               titulo: 'AposentaSP / Dra. Simone Baptista',    slug: 'aposentasp',            status: 'pendente'  },
  { num: 9,  secao: 'Estilo',               titulo: 'MSR Device Golden / Anderson Oliveira',slug: 'msr-golden',            status: 'pendente'  },
  { num: 10, secao: 'BNI Mundi',             titulo: 'WPO Languages / Waldir Pires',          slug: 'bni-mundi',             status: 'pendente'  },
  { num: 11, secao: 'Reconhecimento',         titulo: 'Evento BNI OESP',                       slug: 'reconhecimento',        status: 'pendente'  },
  { num: 12, secao: 'Desenvolvimento pessoal',titulo: 'Massaru Ogata / IFT',                   slug: 'massaru-ogata',         status: 'pendente'  },
  { num: 13, secao: 'Eventos',               titulo: 'Salleven / Carla Sallada',              slug: 'salleven',              status: 'pendente'  },
  { num: 14, secao: 'Turismo',               titulo: 'Mônaco / Convenção BNI 2026',           slug: 'monaco',                status: 'pendente'  },
  { num: 15, secao: 'Negócios',              titulo: 'FIA Business School',                   slug: 'fia-business-school',   status: 'pendente'  },
  { num: 16, secao: 'BNI São Francisco',      titulo: 'BNI São Francisco',                     slug: 'bni-sao-francisco',     status: 'pendente'  },
];

const REPO_OWNER = 'Aleguife';
const REPO_NAME  = 'revista-bni-business';

// ── LOGIN ─────────────────────────────────────

async function fazerLogin() {
  const input = document.getElementById('senha-input').value;
  const hash  = await sha256(input);
  
  // Se ainda usando hash placeholder, aceita senha direta para setup inicial
  const senhaCorreta = (hash === SENHA_HASH) || (SENHA_HASH.length !== 64 && input === 'bni@2025');

  if (senhaCorreta) {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('painel').classList.remove('hidden');
    renderChecklist();
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
  const buf  = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(msg));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
}

// ── NAVEGAÇÃO ─────────────────────────────────

function mostrarAba(id, el) {
  document.querySelectorAll('.aba').forEach(a => a.classList.add('hidden'));
  document.getElementById('aba-' + id).classList.remove('hidden');

  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (el) el.classList.add('active');
}

// ── FORMULÁRIO ────────────────────────────────

function limparForm() {
  ['f-secao','f-titulo','f-slug','f-empresa','f-profissional','f-texto','f-frase','f-cta-texto','f-cta-link'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  document.getElementById('card-status').style.display  = 'none';
  document.getElementById('card-preview').style.display = 'none';
}

function val(id) {
  return (document.getElementById(id)?.value || '').trim();
}

// ── GERAR MATÉRIA ─────────────────────────────

async function gerarMateria() {
  const apiKey = val('f-api-key');
  if (!apiKey) { alert('Informe a chave da API Claude antes de gerar.'); return; }

  const dados = {
    secao:       val('f-secao'),
    titulo:      val('f-titulo'),
    slug:        val('f-slug'),
    empresa:     val('f-empresa'),
    profissional: val('f-profissional'),
    texto:       val('f-texto'),
    frase:       val('f-frase'),
    ctaTexto:    val('f-cta-texto'),
    ctaLink:     val('f-cta-link'),
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
  const prompt = montarPrompt(dados);

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8000,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `HTTP ${response.status}`);
  }

  const data = await response.json();
  const texto = data.content?.find(c => c.type === 'text')?.text || '';

  // Extrai HTML entre ```html ... ``` ou pega tudo
  const match = texto.match(/```html\s*([\s\S]*?)```/);
  return match ? match[1].trim() : texto.trim();
}

function montarPrompt(d) {
  return `Você é o sistema de geração de matérias da Revista BNI Business, uma revista empresarial premium do BNI São Paulo.

Gere uma página HTML completa para a seguinte matéria. Siga EXATAMENTE as instruções de estilo e estrutura abaixo.

═══ DADOS DA MATÉRIA ═══
Seção: ${d.secao}
Título: ${d.titulo}
Empresa/Anunciante: ${d.empresa}
Profissional: ${d.profissional}
Texto base: ${d.texto}
Frase de destaque: ${d.frase || '(gere uma frase impactante de no máximo 15 palavras)'}
Slug: ${d.slug}
CTA texto: ${d.ctaTexto || 'Saiba mais'}
CTA link: ${d.ctaLink || '#'}

═══ INSTRUÇÕES DE ESTILO ═══
Identidade visual: vermelho #CC0000, preto #111, branco #fff, fundo bege #f5f4f2
Tipografia: Playfair Display (títulos), DM Sans (corpo)
Tom: editorial premium, profissional, inspirador

═══ ESTRUTURA HTML OBRIGATÓRIA ═══
1. DOCTYPE + head completo com meta tags SEO (title, description, og:tags)
2. Incluir: <link rel="stylesheet" href="/assets/css/materia.css"> e <script src="/assets/js/nav.js?v=1"></script>
3. Hero section: retranca da seção em vermelho, título grande em Playfair Display, nome da empresa
4. Introdução: lead em corpo maior (18px), tom de abertura impactante
5. Corpo principal: 3 parágrafos bem desenvolvidos a partir do texto base
6. Bloco de destaque: frase de destaque em vermelho com fundo escuro (#111), typography grande
7. CTA section: botão vermelho com o link de contato
8. Seção "Mais da edição": div com id="mais-materias" e class="mais-materias-placeholder" (será preenchido por JS)
9. Incluir: <script src="/assets/js/footer.js?v=1"></script> ao final do body

═══ REGRAS TÉCNICAS ═══
- HTML semântico e limpo
- Classes em português kebab-case
- Sem inline styles quando possível (use classes)
- Imagens com src="/edicao-02/${d.slug}/hero.jpg" e alt descritivo
- Responsive com meta viewport já no head
- NÃO inclua <style> com CSS de reset ou layout geral — apenas classes específicas desta matéria

Retorne APENAS o HTML completo, entre \`\`\`html e \`\`\`. Nada mais.`;
}

// ── STATUS / LOG ──────────────────────────────

function mostrarStatus() {
  const card = document.getElementById('card-status');
  card.style.display = 'block';
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
  const txt = document.getElementById('html-gerado').value;
  navigator.clipboard.writeText(txt).then(() => {
    const btn = event.target.closest('button');
    const orig = btn.textContent;
    btn.textContent = 'Copiado!';
    setTimeout(() => btn.textContent = orig, 1500);
  });
}

// ── PUBLICAR NO GITHUB ────────────────────────

async function publicar() {
  const token = val('f-github-token');
  if (!token) { alert('Informe o Token GitHub antes de publicar.'); return; }

  const slug = val('f-slug');
  const html = document.getElementById('html-gerado').value;

  if (!slug || !html) { alert('Gere a matéria antes de publicar.'); return; }

  const caminho = `edicao-02/${slug}/index.html`;
  
  addLog('Publicando no GitHub...', 'loading');

  try {
    // Verifica se arquivo já existe (para obter SHA)
    let sha = undefined;
    const check = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${caminho}`, {
      headers: { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github.v3+json' }
    });
    if (check.ok) {
      const existing = await check.json();
      sha = existing.sha;
    }

    // Commit do arquivo
    const body = {
      message: `feat: adiciona matéria ${slug} — Edição 02`,
      content: btoa(unescape(encodeURIComponent(html))),
      ...(sha ? { sha } : {}),
    };

    const res = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${caminho}`, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `HTTP ${res.status}`);
    }

    addLog(`✓ Publicado! Deploy iniciado em ~20 segundos.`, 'ok');
    addLog(`URL: bnibusiness.com.br/edicao-02/${slug}/`, 'ok');

    // Marca como publicada no checklist
    marcarPublicada(slug);

  } catch (e) {
    addLog('Erro ao publicar: ' + e.message, 'erro');
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
      <td>
        <span class="badge-status badge-${status}">
          <span class="badge-dot"></span>
          ${status === 'publicada' ? 'No ar' : 'Pendente'}
        </span>
      </td>
    `;
    tbody.appendChild(tr);
  });

  const pct = Math.round((publicadas / MATERIAS.length) * 100);
  document.getElementById('progress-bar').style.width = pct + '%';
  document.getElementById('progress-texto').textContent = `${publicadas} / ${MATERIAS.length} publicadas`;
}

function marcarPublicada(slug) {
  const status = JSON.parse(localStorage.getItem('bni-status') || '{}');
  status[slug] = 'publicada';
  localStorage.setItem('bni-status', JSON.stringify(status));
  renderChecklist();
}
