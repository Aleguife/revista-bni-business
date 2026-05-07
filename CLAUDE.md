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

**Status das edições:**
- Edição 2: em produção digital (prioridade comercial atual)
- Edição 1: próxima após Edição 2
- Edição 3: em fase comercial, será replicada depois

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
| 2 | Case de sucesso | Magna Marinho / ELA | `magna-marinho` | ✅ no ar |
| 3 | Case de sucesso | José Roberto Teixeira / JRT Print | `jrt-print` | ✅ no ar |
| 4 | Matéria de Capa | Felipe Xavier / Redax Engenharia | `felipe-xavier` | ✅ no ar |
| 5 | Editorial | O impresso que o digital não substitui | `o-impresso` | ⬜ pendente |
| 6 | Negócios | Up Brasil / Mariana Cerone | `up-brasil` | ✅ no ar |
| 7 | Saúde mental | Tonos / Elisa de Lima | `tonos` | ✅ no ar |
| 8 | Direito | AposentaSP / Dra. Simone Baptista | `aposentasp` | ✅ no ar |
| 9 | Estilo | MSR Device Golden / Anderson Oliveira | `msr-golden` | ✅ no ar |
| 10 | BNI Mundi | WPO Languages / Waldir Pires | `bni-mundi` | ✅ no ar |
| 11 | Reconhecimento | Evento BNI OESP | `reconhecimento` | ✅ no ar |
| 12 | Desenvolvimento pessoal | Massaru Ogata / IFT | `massaru-ogata` | ✅ no ar |
| 13 | Eventos (2ª) | Salleven / Carla Sallada | `salleven` | ✅ no ar |
| 14 | Turismo | Mônaco / Convenção BNI 2026 | `monaco` | ✅ no ar |
| 15 | Negócios (2ª) | FIA Business School | `fia-business-school` | ✅ no ar |
| 16 | BNI São Francisco | BNI São Francisco | `bni-sao-francisco` | ✅ no ar |

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
- **Versão atual do `admin.js`:** `?v=26`

---

## Sumário externalizado — sumario.js (05/05/2026)

O sumário da revista foi externalizado em `/sumario.js`, seguindo o mesmo padrão de injeção dinâmica do `nav.js` e `footer.js`.

- Para alterar o sumário no futuro, edite **APENAS `/sumario.js`**
- O sumário atual contém os **16 itens da Edição 2**
- `sumario.js` injeta CSS + HTML + expõe `abrirSumario()` e `fecharSumario()` globalmente
- O `grid-template-rows` correto é `repeat(8, 1fr)` (8 linhas = 8 itens por coluna)
- **Versão:** `sumario.js?v=2026050502`
- Item 03 aponta para `edicao-02/jrt-print/` (JRT Print publicada)
- **Cuidado:** o bloco `<div class="sumario-overlay" id="sumario">` **NÃO deve ser reintroduzido** inline nas matérias novas geradas pelo painel — o script externo cuida disso

---

## Bug das colunas — Causa raiz e solução (05/05/2026)

**Causa raiz descoberta:**
O Quill insere parágrafos vazios invisíveis (`<p> </p>` com espaços/`&nbsp;` e `<p><br></p>`) entre os elementos estruturais. A função `montarCorpoArtigo()` contava esses vazios como parágrafos reais, quebrando a coleta da seção e gerando múltiplos `.texto-duplo` separados em vez de um único.

**Solução aplicada:**
Filtro de parágrafos vazios no início de `montarCorpoArtigo()`, antes de tokenizar e dividir colunas. Um parágrafo é considerado vazio quando `textContent` (após `trim` e remoção de `\u00a0`) é string vazia **e** não contém `<img>`.

**Lição de debugging:**
Quando teste isolado em Node funciona mas a integração no painel falha, a primeira ação é capturar o input real da integração com `console.log`. Foi assim que a causa raiz foi descoberta.

---

## Hero title — padrão 3 linhas vermelho/cinza/vermelho (05/05/2026)

**Função responsável:** `formatarTituloHero(titulo)` em `painel/admin.js`

**Regras:**
1. Se o campo Título contiver ` | ` (espaço-pipe-espaço): usa como quebra manual exata → sempre JS, nunca IA.
2. Títulos com ≤ 4 palavras (sem pipe): **2 linhas** vermelho/cinza.
3. Títulos com 5+ palavras (sem pipe): **3 linhas** vermelho/cinza/vermelho.
   - JS divide em terços equilibrados como fallback.
   - IA divide com critério gramatical (preposições, conjunções) quando retorna resultado.

**Fluxo no painel:** se o usuário usa pipe → JS sempre; sem pipe → IA retorna as `<span>`, JS serve de fallback.

**Exemplo de uso do pipe pelo usuário:**
```
Campo Título: "Quando o BNI | vai além do | networking"
```
Gera:
```html
<span style="color:var(--vermelho);">Quando o BNI</span><br>
<span style="color:#b3b2b2;">vai além do</span><br>
<span style="color:var(--vermelho);">networking</span>
```

## Tags SEO geradas pela IA (v=26)

As `<meta property="article:tag">` são geradas automaticamente pela Claude API em cada matéria. Não há mais tags hardcoded.

- **Formato no prompt:** seção `==TAGS==` com lista separada por vírgula
- **Regras:** 3–5 tags, pt-BR sem acentos, minúsculo, foco em SEO
- **Tag obrigatória:** `bni` sempre presente
- **Se IA não retornar tags:** nenhuma meta tag é gerada (sem fallback hardcoded)
- **Comentário órfão** `<!-- Placeholder: substituir pela foto real do Felipe -->` removido do template

## Pendências conhecidas do Admin CMS

1. ~~**Título do hero**~~ — **RESOLVIDO** (v=25): função `formatarTituloHero` + prompt atualizado
2. **CTA** — seção vazia; `montarCTASection()` não está gerando conteúdo
3. ~~**Citações inline**~~ — **RESOLVIDO** (v=23): blockquotes ficam inline no fluxo da seção

---

## Prompts Reutilizáveis para Publicação

Prompts genéricos prontos para usar com o Claude Code em cada nova matéria. Copiar, substituir `[SLUG]`/`[NUMERO]`/`[NOVA_VERSAO]` e colar.

---

### PROMPT 1 — Versionar Imagens da Matéria

**Quando usar:** depois de criar a pasta `edicao-02/[SLUG]/img/` com as 3 imagens da matéria.

```
Vou publicar uma nova matéria da Edição 2 da Revista BNI Business.
As imagens já estão preparadas localmente em edicao-02/[SLUG]/img/

## TAREFA

1. Execute "ls edicao-02/[SLUG]/img/" para listar as imagens 
   da pasta

2. Mostre os arquivos encontrados e me peça confirmação dos 
   nomes antes de prosseguir (validação contra typos)

3. Após minha confirmação, execute:
   git add edicao-02/[SLUG]/img/
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
- NÃO atualize sumario.js, admin.js, nem outras matérias
- Apenas versione as imagens da pasta /img/ desta matéria

## LEMBRETE

Confirme que SSH da Locaweb está habilitado antes do push. 
Se não estiver, o deploy vai dar timeout.
```

---

### PROMPT 2 — Atualizar Item do Sumário

**Quando usar:** depois de publicar a matéria pelo painel, para trocar `href="#"` pela URL real no `sumario.js`.

```
A matéria [SLUG] foi publicada em:
https://bnibusiness.com.br/edicao-02/[SLUG]/

Por favor, atualize o sumario.js para que o item [NUMERO] 
(que hoje está com href="#") aponte para essa URL.

## TAREFA 1 — Atualizar sumario.js

Localize o item [NUMERO] (procure por grid-row:[NUMERO] ou pelo 
texto da matéria) e troque href="#" por:
href="https://bnibusiness.com.br/edicao-02/[SLUG]/"

## TAREFA 2 — Atualizar versão do sumario.js

A versão atual é v=2026050502.
Atualize para v=[NOVA_VERSAO] em todos os arquivos que carregam 
o sumario.js. Procure por sumario.js?v=2026050502 em:

- /edicao-02/*/index.html (todas as matérias publicadas)
- /painel/admin.js

Use o padrão de data do dia atual: vYYYYMMDDXX (sequencial)

## CUIDADOS

- NÃO mexa no admin.js além da string da versão do sumario.js
  (admin.js mantém v=26)
- NÃO mexa em nav.js ou footer.js

## RELATÓRIO ANTES DO PUSH

Antes de commit/push, me reporte:
1. Item alterado no sumario.js (antes/depois)
2. Lista de arquivos com versão atualizada
3. Aguarde minha aprovação

## DEPOIS DA APROVAÇÃO

git add .
git commit -m "feat: atualiza link do item [NUMERO] do sumário para matéria [SLUG]"
git push origin main

## LEMBRETE

Confirme SSH da Locaweb antes do push.
```

---

## Próximas fases

- [ ] Edição 2: publicar as 12 matérias restantes (4 de 16 publicadas)
- [ ] Página índice `/edicao-02/` com grid das 16 matérias
- [ ] Home com grid de edições (após Ed.1 e Ed.2 concluídas)
- [ ] Edição 1: digitalizar retroativamente
- [ ] Templates A (hero vertical) e B (hero horizontal)
