# CLAUDE.md — Revista BNI Business

Contexto permanente do projeto para o Claude Code.
Leia este arquivo inteiro antes de qualquer ação.

---

## FLUXO DO PROJETO (CRÍTICO PARA ENTENDER O CONTEXTO)

A Revista BNI Business é uma revista **IMPRESSA**. Este CMS é canal de publicação **DIGITAL**, não de criação editorial.

**Fluxo completo:**
1. Jornalista envia as matérias para Alexandre
2. Alexandre diagrama tudo no InDesign
3. Sequência de aprovações e revisões com o cliente
4. PDF final entregue à gráfica
5. Enquanto a gráfica imprime, Alexandre publica as matérias neste CMS

**IMPORTANTE:** Quando Alexandre vai publicar uma matéria, todo o conteúdo (texto, imagens, citações, fotos) **JÁ ESTÁ PRONTO** e aprovado. Não há criação de conteúdo aqui — só replicação digital do que já foi aprovado para impressão.

**Status das edições (12/05/2026):**
- ✅ Edição 2: 16 matérias publicadas (PT/EN/ES)
- ✅ Edição 1: 17 matérias publicadas (PT/EN/ES) com página índice nas 3 versões
- 📋 Edição 3: em fase comercial

**Implicação para Claude:** NÃO perguntar se o conteúdo está pronto, se Alexandre vai escrever, se tem rascunho. O conteúdo SEMPRE está pronto. As perguntas válidas são apenas sobre detalhes técnicos da publicação digital (slug, posição no sumário, etc).

---

## Visão geral

**Revista BNI Business** é uma publicação editorial premium do BNI São Paulo.
Site estático em HTML/CSS/JS puro, hospedado na Locaweb, deploy automático via GitHub Actions.

- **Repositório:** `Aleguife/revista-bni-business`
- **Domínio:** `bnibusiness.com.br`
- **Branch principal:** `main` (deploy automático ao commitar)
- **Stack:** HTML5 semântico, CSS3, JS vanilla — sem frameworks, sem build tools
- **Deploy:** SSH/rsync via GitHub Actions (`.github/workflows/deploy.yml`)
  - Host: `ftp.bnibusiness.com.br` | Usuário: `bnibusiness1` | Porta: `22`
  - Secret necessário no GitHub: `SSH_KEY` (chave privada ed25519 em base64)
  - Para regenerar: `base64 -i caminho/para/chave_privada | pbcopy` e cola no secret

---

## ⚠ REGRA CRÍTICA DE DEPLOY

O deploy deste projeto é **SEMPRE via SSH/rsync**. **NUNCA use FTP-Deploy-Action**.

- Workflow: `.github/workflows/deploy.yml`
- Mecanismo: `rsync -e "ssh -i chave_privada"` sobre SSH na porta 22
- Host: `ftp.bnibusiness.com.br` | Usuário: `bnibusiness1`
- Secret: `SSH_KEY` (chave privada ed25519 em base64, configurado no GitHub → Settings → Secrets → Actions)
- Chave pública correspondente vive em `~/.ssh/authorized_keys` do `bnibusiness1@ftp.bnibusiness.com.br`

Não altere o workflow para FTP sob nenhuma circunstância. Não troque o método de autenticação para senha (`sshpass`) — chave SSH é mais seguro e também resolve o problema de senha vazada.

---

## 🚨 REGRA DE OURO: imagens vão SEMPRE no Git

Imagens de matérias **DEVEM** ser versionadas no Git. Nunca subir via FTP isolado.
O rsync roda com `--delete` e apaga arquivos não versionados na próxima publicação.

**Fluxo correto para nova matéria:**
1. Criar pasta `edicao-XX/[materia]/img/` no repositório local
2. Colocar as imagens dentro
3. `git add` + `commit` + `push`
4. Só depois publicar o HTML pelo painel Admin

---

## Identidade visual

| Token | Valor |
|-------|-------|
| Vermelho principal | `#CC0000` |
| Preto | `#111111` |
| Branco | `#ffffff` |
| Bege (fundo) | `#f5f4f2` |
| Fonte título | Playfair Display 700/900 (Google Fonts) |
| Fonte corpo | Barlow 300/400/500 (Google Fonts) |
| Fonte UI | Barlow Condensed 300/400/500/600 (Google Fonts) |

Retrancas de seção sempre em `#CC0000`. Títulos em Playfair Display. Corpo em Barlow.

---

## Edição 1 — Status das 17 matérias

| # | Seção | Título / Empresa | Slug | Status |
|---|-------|------------------|------|--------|
| 1 | Eventos | BNI Summit 2026 MOVIMENTO | `eventos` | ✅ no ar |
| 2 | Turismo | Do passaporte à coragem | `turismo` | ✅ no ar |
| 3 | Matéria de Capa | BNI Revoluciona o Networking na Região Oeste de SP | `materia-de-capa` | ✅ no ar |
| 4 | Branding | A transformação acontece quando design e propósito se encontram | `branding` | ✅ no ar |
| 5 | Case de sucesso | Anderson "Nen" — Givers Gain | `case-bni` | ✅ no ar |
| 6 | Estilo | Onde paixão encontra propósito | `estilo` | ✅ no ar |
| 7 | Design | O Alquimista do Aço | `design` | ✅ no ar |
| 8 | CEOs no BNI | John Rodgerson | `ceos-no-bni` | ✅ no ar |
| 9 | Desenvolvimento pessoal | A raridade que desperta onde o fim se transforma | `desenvolvimento-pessoal` | ✅ no ar |
| 10 | Idiomas | "Inglês não é para mim!!" | `idiomas` | ✅ no ar |
| 11 | Engenharia | Quando a estrutura conta uma história | `engenharia` | ✅ no ar |
| 12 | ONG | Novas Trilhas | `ong` | ✅ no ar |
| 13 | Saúde mental | Tonos — líderes sem ansiedade | `saude-mental` | ✅ no ar |
| 14 | Saúde | A nova era da fisioterapia | `saude` | ✅ no ar |
| 15 | Publicidade | Quando a luz se acende, a cidade vê | `publicidade` | ✅ no ar |
| 16 | Investimentos | Além dos números: legados que transcendem gerações | `investimentos` | ✅ no ar |
| 17 | Investimentos | Educação financeira: segurança, patrimônio e liberdade | `investimentos-2` | ✅ no ar |

---

## Edição 2 — Status das 16 matérias

| # | Seção | Profissional / Empresa | Slug | Status |
|---|-------|----------------------|------|--------|
| 1 | Eventos | Cigar Night — Rodrigo Motta | `eventos` | ✅ no ar |
| 2 | Case de sucesso | Magna Marinho / ELA | `magna-marinho` | ✅ no ar |
| 3 | Case de sucesso | José Roberto Teixeira / JRT Print | `jrt-print` | ✅ no ar |
| 4 | Matéria de Capa | Felipe Xavier / Redax Engenharia | `materia-de-capa` | ✅ no ar |
| 5 | Editorial | O impresso que o digital não substitui | `alef-editora` | ✅ no ar |
| 6 | Negócios | Up Brasil / Mariana Cerone | `up-brasil` | ✅ no ar |
| 7 | Saúde mental | Tonos / Elisa de Lima | `tonos` | ✅ no ar |
| 8 | Direito | AposentaSP / Dra. Simone Baptista | `aposenta-sp` | ✅ no ar |
| 9 | Estilo | MSR Device Golden / Anderson Oliveira | `msr-device-golden-store` | ✅ no ar |
| 10 | BNI Mundi | WPO Languages / Waldir Pires | `bni-mundi` | ✅ no ar |
| 11 | Reconhecimento | Evento BNI OESP | `reconhecimento` | ✅ no ar |
| 12 | Desenvolvimento pessoal | Massaru Ogata / IFT | `massaru-ogata` | ✅ no ar |
| 13 | Eventos (2ª) | Salleven / Carla Sallada | `salleven-eventos` | ✅ no ar |
| 14 | Turismo | Mônaco / Convenção BNI 2026 | `monaco` | ✅ no ar |
| 15 | Negócios (2ª) | FIA Business School | `fia-business-school` | ✅ no ar |
| 16 | BNI São Francisco | BNI São Francisco | `bni-sao-francisco` | ✅ no ar |

---

## Arquitetura de scripts (PR 3, 09/05/2026)

Toda matéria carrega esta sequência de scripts no `<head>` (com `defer`):

```html
<link rel="stylesheet" href="/assets/css/materia.css">
<script src="/nav.js?v=VERSAO" defer></script>
<script src="/footer.js?v=VERSAO" defer></script>
<script src="/assets/js/materia.js?v=VERSAO" defer></script>
```

| Arquivo | Responsabilidade |
|---------|------------------|
| `nav.js` | Injeta navbar (logo + links + dropdown de idiomas) |
| `footer.js` | Injeta rodapé (newsletter ConvertKit + links + créditos) |
| `assets/js/materia.js` | Comportamentos da matéria: fade-in, parallax, share, reading circle, sliders, language switcher |

**⚠ Dependência crítica:** `nav.js` NÃO injeta CSS próprio. Toda página que carregar `nav.js` DEVE também carregar `/assets/css/materia.css`, caso contrário a navbar aparece sem estilo.

Páginas especiais sem navbar (ex: `/newsletter/obrigado/`) são exceção — não carregam nav.js nem materia.css.

---

## Página índice de cada edição

Desde 09/05/2026, `sumario.js` (data-driven JS) foi **removido** em favor de páginas índice estáticas (commit `03fd3ae`, "limpa sumario.js orfao").

Cada edição tem 3 páginas índice (uma por idioma):
- `/edicao-XX/index.html` (PT)
- `/en/edicao-XX/index.html` (EN)
- `/es/edicao-XX/index.html` (ES)

Layout: hero com capa + estatísticas, grid de cards das matérias. Estrutura inline (CSS no `<style>` da própria página, dados num `const ARTICLES = [...]` no script inline). Replicar entre edições é cópia + adaptação do conteúdo.

**Cross-link entre idiomas:** cada matéria e índice traz um bloco `<link rel="alternate" hreflang>` no head para as 3 versões + `x-default`.

---

## Painel Admin (`/painel/`)

Painel em `/painel/index.html` para criação de matérias via browser.

**Acesso:**
- HTTP Basic Auth (camada server-side via `.htpasswd`) — usuário `alex`
- Login JS (camada client-side com hash SHA-256 em `admin.js`)
- Mesma senha nas duas camadas (mantida em gerenciador de senhas pessoal)

**Funcionalidades:**
- Geração de HTML via Claude API (modelo: `claude-sonnet-4-6`, com Vision input — ver "Histórico técnico")
- Publicação direta via GitHub API (sem terminal)
- Seletor de Edição no formulário (`<select id="f-edicao">`) — define pasta de publicação
- Checklist por edição (`MATERIAS_POR_EDICAO['edicao-XX']` em admin.js)
- **Versão atual do `admin.js`:** `?v=49`

**Para publicar matéria de qualquer edição:**
1. Selecionar a edição no dropdown topo do formulário
2. O preview do slug muda para `bnibusiness.com.br/edicao-XX/[slug]/`
3. Versionar imagens da matéria no Git ANTES (a regra de ouro + pré-requisito da Vision API)
4. Preencher o formulário e gerar com IA — o painel baixa as imagens via raw GitHub e envia como Vision input

**Para adicionar uma nova edição (Ed.3+) ao checklist:** editar `painel/admin.js` na constante `MATERIAS_POR_EDICAO`:
```js
'edicao-XX': [
  { num:1, secao:'...', titulo:'...', slug:'...', status:'pendente' },
  // ...
],
```

---

## Sitemap automatico (scripts/gerar-sitemap.js)

Desde 11/05/2026, `sitemap.xml` e gerado automaticamente. Nao editar manualmente.

**Como funciona:**
- Le `MATERIAS_POR_EDICAO` em `painel/admin.js` (slugs + status)
- Le HTML de cada materia publicada pra extrair `<title>` e `article:published_time`
- Gera 117 URLs (home, indices de edicao, materias PT/EN/ES, paginas legais)
- PT inclui `<news:news>` block; EN/ES nao
- `lastmod` = mtime do arquivo HTML

**Comandos:**
```bash
node scripts/gerar-sitemap.js              # gera sitemap.xml
node scripts/gerar-sitemap.js --dry-run    # imprime no stdout, nao grava
```

**Quando rodar:** apos publicar nova materia (status:publicada no admin.js), ou apos editar uma materia existente. Ideal rodar antes de cada `git push`.

---

## `.htaccess` raiz (PR 2, 09/05/2026)

Configuração Apache na raiz do projeto:
- **Force HTTPS 301** (13/05/2026): redirect de `http://` pra `https://` evita duplicate content que confunde crawlers. Sem isso, Locaweb servia HTTP com 200 em vez de redirect.
- **gzip** via `mod_deflate` para HTML/CSS/JS/SVG/XML
- **Cache de 1 ano** para imagens, CSS, JS, fontes (`Cache-Control: public, max-age=31536000, immutable`)
- **Cache curto** para HTML (5min) — permite publicação rápida sem servir cache stale
- **Headers de segurança:** X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy
- **Bloqueio público** a `.htaccess`, `.htpasswd`, `.gitignore`, `.env*`

Cache busting via `?v=N` continua sendo o mecanismo principal de invalidação.

---

## Scripts auxiliares (`scripts/`)

Scripts Node.js parametrizados por edição. Rodar antes de cada `git push` quando relevante:

| Script | Função |
|--------|--------|
| `gerar-sitemap.js` | Gera `sitemap.xml` com 117 URLs (home + índices + matérias PT/EN/ES + páginas legais). Lê `MATERIAS_POR_EDICAO` no admin.js. |
| `adicionar-breadcrumb.js edicao-XX` | Insere JSON-LD `BreadcrumbList` (Home → Edição → matéria) em todas as matérias da edição (PT+EN+ES). Idempotente. |
| `atualizar-nav-edicao.js edicao-XX` | Ajusta `href` dos botões "Matéria Anterior / Próxima" com base na ordem do admin.js. Wrap-around. |
| `atualizar-json-ld.js edicao-XX [YYYY-MM-DD]` | Enriquece JSON-LD Article: troca `author` string por `Person` schema com `sameAs` (Fernanda Sodré → Instagram) + adiciona `dateModified`. |

---

## Regras de desenvolvimento

1. **Nunca usar frameworks** — HTML/CSS/JS puro apenas
2. **Cache busting** — ao editar `nav.js`, `footer.js`, `materia.js` ou `admin.js`, incrementar `?v=N` em todas as páginas que referenciam
3. **Slugs em kebab-case** — sempre minúsculas, sem acentos, hífens entre palavras
4. **Caminho das imagens** — sempre relativo à raiz: `/edicao-XX/[slug]/hero.jpg`
5. **Commits em português** — ex: `feat: adiciona matéria magna-marinho`
6. **Uma pasta por matéria** — `edicao-XX/[slug]/index.html`
7. **Preservar HTML do texto** — nunca remover tags `<b>`, `<i>`, `<u>`, `<ul>`, `<ol>`, `<h2>` do texto original
8. **Atualizar CLAUDE.md** — ao publicar cada matéria, marcar ✅ na tabela acima

---

## Histórico técnico (decisões de arquitetura)

### Bug das colunas — Causa raiz (05/05/2026)
O Quill insere parágrafos vazios invisíveis (`<p> </p>` com espaços/`&nbsp;` e `<p><br></p>`) entre elementos estruturais. A função `montarCorpoArtigo()` filtra esses vazios antes de tokenizar — um parágrafo é vazio quando `textContent` (após `trim` e remoção de ` `) é string vazia **e** não contém `<img>`.

**Lição:** quando teste isolado em Node funciona mas integração no painel falha, capturar input real com `console.log` no painel — foi assim que o bug foi descoberto.

### Hero title — padrão 3 linhas (05/05/2026)
Função `formatarTituloHero(titulo)` em `painel/admin.js`:
1. Se contiver ` | ` (espaço-pipe-espaço): quebra manual exata → sempre JS, nunca IA
2. Títulos com ≤4 palavras (sem pipe): 2 linhas vermelho/cinza
3. Títulos com 5+ palavras (sem pipe): 3 linhas vermelho/cinza/vermelho (IA divide com critério gramatical, JS é fallback)

### Tags SEO geradas pela IA (admin v=26)
`<meta property="article:tag">` geradas automaticamente pela Claude API. Formato `==TAGS==` no prompt, 3-5 tags pt-BR sem acentos minúsculas, foco em SEO. Tag obrigatória: `bni`. Sem fallback hardcoded.

### Refator multi-edição (PR 3, 09/05/2026)
- `admin.js` parametrizado com `EDICAO_PADRAO` + `getCurrentEdicao()` + `MATERIAS_POR_EDICAO`
- Bug `og:locale="pt_BR"` corrigido nas 32 versões EN/ES (eram cópia da PT)
- Sumário data-driven (eliminou `sumario-en.js` e `sumario-es.js`)
- Script inline de 180 linhas extraído para `assets/js/materia.js` (-9k linhas em HTML)
- 8 slugs divergentes corrigidos no admin (cigar-night→eventos, felipe-xavier→materia-de-capa, etc.)

### Vision API nas legendas do painel (12/05/2026, commit `28e71af`)
Antes desse commit, `admin.js` enviava só título + 600 chars de texto pra Claude API ao gerar legendas — modelo não via as fotos e inventava descrições (pessoas inexistentes, cenas que não estavam nas imagens). Fix:
- `chamarClaudeAPI()` agora chama `extrairArquivosImagem()` no texto da matéria
- Para cada imagem, busca via `raw.githubusercontent.com/Aleguife/revista-bni-business/main/${edicao}/${slug}/img/${arquivo}` (Promise.allSettled em paralelo)
- Converte pra base64 e monta `messages.content` como array com blocos `text+image` intercalados por marcador `"Imagem [nome.webp]:"`
- Modelo atualizado: `claude-sonnet-4-5` → `claude-sonnet-4-6`
- Prompt de legenda reescrito pra exigir descrição do visual real, não frase-tese
- Pré-requisito: imagens versionadas no Git ANTES de gerar matéria (já era regra de ouro). Se 404, painel avisa e gera sem visão pra aquela específica.
- Fix retroativo de legendas da Ed.1 (33 figcaptions) via Claude Code commit `ced6cde`.

### Frente SEO + Performance + A11y (13/05/2026)
Sequência de melhorias após a publicação completa da Ed.1. Cada item commitado separadamente:

**SEO estrutural:**
- BreadcrumbList JSON-LD em 99 matérias (Ed.1 + Ed.2 × PT/EN/ES) via `scripts/adicionar-breadcrumb.js`
- `dateModified` + `author` como Person schema com `sameAs` (Instagram Fernanda Sodré) via `scripts/atualizar-json-ld.js`
- Nav prev/next com `href` real (era `#`) via `scripts/atualizar-nav-edicao.js`
- Alinhamento `<title>` × card titles no sumário (13 matérias EN/ES tinham divergência editorial entre versões geradas por agentes paralelos)
- Sitemap submetido em Google Search Console + Bing Webmaster Tools

**Performance:**
- `srcset` nas capas (`capa1.webp` 1125×1500, `capa1-sm.webp` 500×666 etc.) — mobile baixa versão pequena
- 3 animações trocadas pra propriedades compositadas (GPU): `btnBreathe` (border-color → opacity), `ctaLetterPulse` (letter-spacing → opacity), `progressFill` (width → transform scaleX)
- Heading order fix: `footer.js` injetava `<h4>` quebrando hierarquia, trocado por `<h2>`

**Acessibilidade (a11y 90 → 96+):**
- `--cinza: #888 → #555` (contraste 3.4 → 7.5 em fundo creme, WCAG AAA)
- `.dep-dot` (depoimento dots): removida margin negativa que sobrepunha touch areas; agora 48×48 com 8px gap
- ARIA: removido `role="banner"` do `<a class="nav-logo">` e `role="navigation"` redundantes (nav element já tem implicit). Wrapper trocado de `<nav>` pra `<header>`
- `wordBreathe*` keyframes: opacity mínima 0.65 → 0.88 (mantém contraste 3:1 do hero h1 durante animação)

**Falsos positivos do PageSpeed:** report mostrou "página bloqueada por noindex" e "sem metadescrição" em runs com cache stale. Confirmado falso positivo via Search Console URL Inspection ("URL está no Google", indexada como Googlebot Smartphone). Dica: rodar PageSpeed digitando URL fresh em vez de via link compartilhado.

---

## Pendências conhecidas

Refinos residuais de Performance da home (PageSpeed 88, mobile, 13/05/2026):
- **Reflow forçado de 167ms**: algum JS força layout síncrono. Suspeito: `void bar.offsetWidth` no script do slider de depoimentos (linha ~1046 de `index.html`) ou queries no `nav.js`.
- **LCP 3.0s** — capa1/capa2 carregando lento mesmo com `srcset`. Pode melhorar com `<link rel="preload">` + revisar `fetchpriority`.

Não bloqueia ranking — scores atuais: Perf 88 / A11y 96 / BP 100 / SEO 100. Próximas frentes em `PLANO-CRESCIMENTO.md`.

---

## Prompt reutilizável — Versionar Imagens da Matéria

**Quando usar:** depois de criar a pasta `edicao-XX/[SLUG]/img/` com as imagens da matéria.

```
Vou publicar uma nova matéria da Edição [N] da Revista BNI Business.
As imagens já estão preparadas localmente em edicao-0[N]/[SLUG]/img/

## TAREFA

1. Execute "ls edicao-0[N]/[SLUG]/img/" para listar as imagens
2. Mostre os arquivos encontrados e me peça confirmação dos
   nomes antes de prosseguir (validação contra typos)
3. Após minha confirmação, execute:
   git add edicao-0[N]/[SLUG]/img/
   git status (mostre o que será commitado)
4. Faça commit:
   git commit -m "feat: adiciona imagens da matéria [SLUG]"
5. Faça push:
   git push origin main
6. Aguarde o GitHub Actions completar e me reporte
   o número do workflow + status final

## CUIDADOS CRÍTICOS

- NÃO crie o index.html da matéria — isso será feito pelo painel
- NÃO mexa em outros arquivos do projeto
- NÃO atualize admin.js, nem outras matérias
- Apenas versione as imagens da pasta /img/ desta matéria

## LEMBRETE

Confirme que SSH da Locaweb está habilitado antes do push.
Se não estiver, o deploy vai dar timeout.
```

---

## Próximas fases

- [ ] **Edição 3**: digitalizar quando entrar em fase de produção. Workflow já está pronto — ao chegar título e imagens, rodar `scripts/adicionar-breadcrumb.js edicao-03` + `scripts/atualizar-nav-edicao.js edicao-03` + `scripts/atualizar-json-ld.js edicao-03` após publicação via painel.
- [ ] Templates A (hero vertical) e B (hero horizontal)
- [ ] Refinos de performance da home (reflow + LCP) — só se quiser bater 95+ no PageSpeed
