# CLAUDE.md — Revista BNI Business

Contexto permanente do projeto para o Claude Code.
Leia este arquivo inteiro antes de qualquer ação.

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
  - Secret necessário no GitHub: `SSH_PASS`

---

## ⚠ REGRA CRÍTICA DE DEPLOY

O deploy deste projeto é **SEMPRE via SSH/rsync**. **NUNCA use FTP-Deploy-Action**.

- Workflow: `.github/workflows/deploy.yml`
- Mecanismo: `sshpass -e rsync` sobre SSH na porta 22
- Host: `ftp.bnibusiness.com.br` | Usuário: `bnibusiness1`
- Secret: `SSH_PASS` (configurado no GitHub → Settings → Secrets → Actions)

Não altere o workflow para FTP sob nenhuma circunstância.

---

## 🚨 REGRA DE OURO: imagens vão SEMPRE no Git

Imagens de matérias **DEVEM** ser versionadas no Git. Nunca subir via FTP isolado.
O rsync roda com `--delete` e apaga arquivos não versionados na próxima publicação.

**Fluxo correto para nova matéria:**
1. Criar pasta `edicao-02/[materia]/img/` no repositório local
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
| Fonte título | Playfair Display 700 (Google Fonts) |
| Fonte corpo | DM Sans 400/500 (Google Fonts) |

Retrancas de seção sempre em `#CC0000`. Títulos em Playfair Display. Corpo em DM Sans.

---

## Edição 2 — Status das 16 matérias

| # | Seção | Profissional / Empresa | Slug | Status |
|---|-------|----------------------|------|--------|
| 1 | Eventos | Cigar Night — Rodrigo Motta | `cigar-night` | ✅ no ar |
| 2 | Case de sucesso | Magna Marinho / ELA | `magna-marinho` | ⬜ pendente |
| 3 | Case de sucesso | José Roberto Teixeira / JRT Print | `jose-roberto-teixeira` | ⬜ pendente |
| 4 | Matéria de Capa | Felipe Xavier / Redax Engenharia | `felipe-xavier` | ✅ no ar |
| 5 | Editorial | O impresso que o digital não substitui | `o-impresso` | ⬜ pendente |
| 6 | Negócios | Up Brasil / Mariana Cerone | `up-brasil` | ⬜ pendente |
| 7 | Saúde mental | Tonos / Elisa de Lima | `tonos` | ⬜ pendente |
| 8 | Direito | AposentaSP / Dra. Simone Baptista | `aposentasp` | ⬜ pendente |
| 9 | Estilo | MSR Device Golden / Anderson Oliveira | `msr-golden` | ⬜ pendente |
| 10 | BNI Mundi | WPO Languages / Waldir Pires | `bni-mundi` | ⬜ pendente |
| 11 | Reconhecimento | Evento BNI OESP | `reconhecimento` | ⬜ pendente |
| 12 | Desenvolvimento pessoal | Massaru Ogata / IFT | `massaru-ogata` | ⬜ pendente |
| 13 | Eventos (2ª) | Salleven / Carla Sallada | `salleven` | ⬜ pendente |
| 14 | Turismo | Mônaco / Convenção BNI 2026 | `monaco` | ⬜ pendente |
| 15 | Negócios (2ª) | FIA Business School | `fia-business-school` | ⬜ pendente |
| 16 | BNI São Francisco | BNI São Francisco | `bni-sao-francisco` | ⬜ pendente |

Atualizar este arquivo ao publicar cada matéria (⬜ → ✅).

---

## Regras de desenvolvimento

1. **Nunca usar frameworks** — HTML/CSS/JS puro apenas
2. **Cache busting** — ao editar `nav.js` ou `footer.js`, incrementar `?v=N` em todas as páginas
3. **Slugs em kebab-case** — sempre minúsculas, sem acentos, hífens entre palavras
4. **Caminho das imagens** — sempre relativo à raiz: `/edicao-02/[slug]/hero.jpg`
5. **Commits em português** — ex: `feat: adiciona matéria magna-marinho`
6. **Uma pasta por matéria** — `edicao-02/[slug]/index.html`
7. **Preservar HTML do texto** — nunca remover tags `<b>`, `<i>`, `<u>`, `<ul>`, `<ol>`, `<h2>` do texto original
8. **Atualizar CLAUDE.md** — ao publicar cada matéria, marcar ✅ na tabela acima

---

## Admin CMS

Painel em `/admin/` para criação de matérias via browser.

- Login com senha hasheada (SHA-256)
- Formulário com todos os campos da matéria
- Geração de HTML via Claude API (modelo: `claude-sonnet-4-20250514`)
- Publicação direta via GitHub API (sem terminal)
- Checklist integrado das 16 matérias
- **Versão atual do `admin.js`:** `?v=22`

---

## Bug das colunas — Causa raiz e solução (05/05/2026)

**Causa raiz descoberta:**
O Quill insere parágrafos vazios invisíveis (`<p> </p>` com espaços/`&nbsp;` e `<p><br></p>`) entre os elementos estruturais. A função `montarCorpoArtigo()` contava esses vazios como parágrafos reais, quebrando a coleta da seção e gerando múltiplos `.texto-duplo` separados em vez de um único.

**Solução aplicada:**
Filtro de parágrafos vazios no início de `montarCorpoArtigo()`, antes de tokenizar e dividir colunas. Um parágrafo é considerado vazio quando `textContent` (após `trim` e remoção de `\u00a0`) é string vazia **e** não contém `<img>`.

**Lição de debugging:**
Quando teste isolado em Node funciona mas a integração no painel falha, a primeira ação é capturar o input real da integração com `console.log`. Foi assim que a causa raiz foi descoberta.

---

## Pendências conhecidas do Admin CMS

1. **Título do hero** — padrão de 3 linhas vermelho/cinza/vermelho não está sendo gerado (atualmente só gera 2 linhas)
2. **CTA** — seção vazia; `montarCTASection()` não está gerando conteúdo
3. **Citações inline** — citações em largura total ficam ao final da seção, mas a intenção do Quill é que apareçam inline no fluxo do texto (entre parágrafos específicos). Solução proposta: tratar `blockquote` como separador estrutural, dividindo a seção em sub-blocos de `.texto-duplo`. **Cuidado:** essa lógica era a causa do bug original — qualquer correção precisa preservar o filtro de parágrafos vazios.

---

## Próximas fases

- [ ] Edição 2: publicar as 14 matérias restantes (próxima: `jose-roberto-teixeira`)
- [ ] Página índice `/edicao-02/` com grid das 16 matérias
- [ ] Home com grid de edições (após Ed.1 e Ed.2 concluídas)
- [ ] Edição 1: digitalizar retroativamente
- [ ] Templates A (hero vertical) e B (hero horizontal)
